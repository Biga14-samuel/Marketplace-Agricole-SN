
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from app.core import deps
from app.models.auth import User
from app.schemas.event import (
    Event,
    EventStats,
    WebhookEndpoint,
    WebhookEndpointCreate,
    WebhookEndpointUpdate,
    WebhookDelivery,
    ScheduledTask,
    ScheduledTaskCreate,
    ScheduledTaskUpdate,
    TaskExecution,
    TaskStats,
    EventTypeEnum,
    TaskStatusEnum
)
from app.repositories.event_repository import (
    EventRepository,
    WebhookEndpointRepository,
    WebhookDeliveryRepository,
    ScheduledTaskRepository,
    TaskExecutionRepository
)

router = APIRouter()


def require_admin(current_user: User = Depends(deps.get_current_active_user)) -> User:
    """
    Dépendance pour vérifier que l'utilisateur est un administrateur.
    Les événements et automatisations sont des fonctionnalités sensibles.
    """
    if current_user.role not in ["admin", "superadmin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    return current_user


# ==================== ÉVÉNEMENTS ====================

@router.get("/events", response_model=List[Event])
def get_events(
    *,
    db: Session = Depends(deps.get_db),
    event_type: Optional[EventTypeEnum] = Query(None, description="Filtrer par type"),
    processed: Optional[bool] = Query(None, description="Filtrer par statut de traitement"),
    hours: Optional[int] = Query(24, ge=1, le=168, description="Nombre d'heures à remonter"),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(require_admin)
):
    """
    Récupère la liste des événements système.
    
    Les événements sont comme un journal de bord détaillé de tout ce qui se passe
    sur votre plateforme. Vous pouvez filtrer par type (commandes, paiements, etc.),
    par statut de traitement, et par période.
    
    **Cas d'usage :**
    - Voir tous les paiements réussis des dernières 24h
    - Trouver les événements non traités (webhooks en attente)
    - Analyser les tendances (combien de commandes par jour ?)
    """
    if processed is not None:
        # Récupérer selon le statut de traitement
        if processed:
            # Cette route nécessiterait une méthode dans le repository
            raise HTTPException(status_code=501, detail="Filtrage par processed non implémenté")
        else:
            return EventRepository.get_pending(db, limit)
    
    if event_type:
        start_date = datetime.now(timezone.utc) - timedelta(hours=hours)
        return EventRepository.get_by_type(db, event_type, start_date=start_date, limit=limit)
    
    return EventRepository.get_recent(db, hours=hours, limit=limit)


@router.get("/events/{event_id}", response_model=Event)
def get_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Récupère les détails complets d'un événement spécifique.
    
    Affiche toutes les informations enregistrées pour cet événement,
    y compris le payload JSON complet et les métadonnées.
    """
    event = EventRepository.get_by_id(db, event_id)
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Événement non trouvé"
        )
    
    return event


@router.get("/events/stats", response_model=EventStats)
def get_event_stats(
    *,
    db: Session = Depends(deps.get_db),
    hours: int = Query(24, ge=1, le=720, description="Période pour les statistiques"),
    current_user: User = Depends(require_admin)
):
    """
    Récupère des statistiques sur les événements système.
    
    Affiche un résumé de l'activité : combien d'événements ont été générés,
    lesquels sont en attente de traitement, répartition par type, etc.
    
    Parfait pour un tableau de bord administrateur.
    """
    start_date = datetime.now(timezone.utc) - timedelta(hours=hours)
    end_date = datetime.now(timezone.utc)
    
    # Statistiques par type
    by_type = EventRepository.count_by_type(db, start_date, end_date)
    
    # Total d'événements
    total_events = sum(by_type.values())
    
    # Événements en attente
    pending_events = len(EventRepository.get_pending(db, limit=10000))
    
    # Événements traités aujourd'hui
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    processed_today_dict = EventRepository.count_by_type(db, today_start, end_date)
    processed_today = sum(processed_today_dict.values())
    
    return EventStats(
        total_events=total_events,
        pending_events=pending_events,
        processed_today=processed_today,
        by_type=by_type,
        average_processing_time_ms=None  # À calculer si nécessaire
    )


# ==================== WEBHOOKS ENDPOINTS ====================

@router.post("/webhooks", response_model=WebhookEndpoint, status_code=status.HTTP_201_CREATED)
def create_webhook(
    *,
    db: Session = Depends(deps.get_db),
    webhook_in: WebhookEndpointCreate,
    current_user: User = Depends(require_admin)
):
    """
    Crée un nouveau webhook endpoint.
    
    Un webhook est comme un messager automatique : quand certains événements
    se produisent sur votre plateforme, ce messager va automatiquement prévenir
    un système externe en lui envoyant une notification HTTP.
    
    **Exemple d'utilisation :**
    Vous voulez qu'à chaque nouvelle commande, votre système comptable externe
    soit notifié automatiquement. Vous créez un webhook :
    - URL : https://comptabilite.exemple.com/webhooks/commandes
    - Événements : ["order.created", "order.paid"]
    - Secret : une clé pour sécuriser les échanges
    
    Maintenant, à chaque nouvelle commande, votre système comptable reçoit
    automatiquement une notification avec tous les détails.
    """
    from app.models.event import WebhookEndpoint
    import secrets
    
    # Générer un secret automatiquement si non fourni
    if not webhook_in.secret:
        webhook_in.secret = secrets.token_urlsafe(32)
    
    webhook = WebhookEndpoint(
        created_by=current_user.id,
        **webhook_in.model_dump()
    )
    
    return WebhookEndpointRepository.create(db, webhook)


@router.get("/webhooks", response_model=List[WebhookEndpoint])
def get_webhooks(
    *,
    db: Session = Depends(deps.get_db),
    active_only: bool = Query(True, description="Afficher uniquement les webhooks actifs"),
    current_user: User = Depends(require_admin)
):
    """
    Récupère la liste de tous les webhooks configurés.
    
    Par défaut, affiche uniquement les webhooks actifs. Vous pouvez désactiver
    un webhook temporairement sans le supprimer en mettant is_active=false.
    """
    if active_only:
        return WebhookEndpointRepository.get_all_active(db)
    
    # Cette route nécessiterait une méthode get_all dans le repository
    return WebhookEndpointRepository.get_all_active(db)


@router.get("/webhooks/{webhook_id}", response_model=WebhookEndpoint)
def get_webhook(
    *,
    db: Session = Depends(deps.get_db),
    webhook_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Récupère les détails complets d'un webhook.
    
    Affiche la configuration, les statistiques d'utilisation (combien de fois
    appelé, taux de succès), et la date de dernière utilisation.
    """
    webhook = WebhookEndpointRepository.get_by_id(db, webhook_id)
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook non trouvé"
        )
    
    return webhook


@router.put("/webhooks/{webhook_id}", response_model=WebhookEndpoint)
def update_webhook(
    *,
    db: Session = Depends(deps.get_db),
    webhook_id: int,
    webhook_in: WebhookEndpointUpdate,
    current_user: User = Depends(require_admin)
):
    """
    Met à jour la configuration d'un webhook.
    
    Vous pouvez modifier l'URL, les événements écoutés, le timeout, etc.
    Pour désactiver temporairement un webhook, mettez is_active=false.
    """
    webhook = WebhookEndpointRepository.get_by_id(db, webhook_id)
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook non trouvé"
        )
    
    # Mettre à jour les champs fournis
    update_data = webhook_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(webhook, field, value)
    
    return WebhookEndpointRepository.update(db, webhook)


@router.delete("/webhooks/{webhook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_webhook(
    *,
    db: Session = Depends(deps.get_db),
    webhook_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Supprime un webhook endpoint.
    
    Toutes les livraisons passées sont conservées pour l'audit, mais le webhook
    ne recevra plus de nouvelles notifications.
    """
    webhook = WebhookEndpointRepository.get_by_id(db, webhook_id)
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook non trouvé"
        )
    
    WebhookEndpointRepository.delete(db, webhook)


@router.get("/webhooks/{webhook_id}/deliveries", response_model=List[WebhookDelivery])
def get_webhook_deliveries(
    *,
    db: Session = Depends(deps.get_db),
    webhook_id: int,
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_admin)
):
    """
    Récupère l'historique des livraisons d'un webhook.
    
    Pour chaque appel du webhook, vous voyez :
    - Quel événement l'a déclenché
    - La requête HTTP envoyée (headers, body)
    - La réponse reçue (code de statut, body, temps)
    - Le succès ou l'échec
    
    C'est essentiel pour déboguer quand un webhook ne fonctionne pas comme prévu.
    """
    return WebhookDeliveryRepository.get_by_endpoint(db, webhook_id, limit)


# ==================== TÂCHES PLANIFIÉES ====================

@router.post("/tasks", response_model=ScheduledTask, status_code=status.HTTP_201_CREATED)
def create_scheduled_task(
    *,
    db: Session = Depends(deps.get_db),
    task_in: ScheduledTaskCreate,
    current_user: User = Depends(require_admin)
):
    """
    Crée une nouvelle tâche planifiée.
    
    Les tâches planifiées sont comme des alarmes intelligentes : elles exécutent
    automatiquement certaines actions selon un calendrier que vous définissez.
    
    **Exemples courants :**
    
    **Nettoyage quotidien :**
    - Nom : "Nettoyer les vieilles sessions"
    - Type : cleanup.old_sessions
    - Planning : "0 3 * * *" (tous les jours à 3h du matin)
    
    **Rapport hebdomadaire :**
    - Nom : "Rapport hebdomadaire des ventes"
    - Type : report.weekly
    - Planning : "0 9 * * 1" (tous les lundis à 9h)
    
    **Sauvegarde régulière :**
    - Nom : "Sauvegarde base de données"
    - Type : backup.database
    - Planning : "0 */6 * * *" (toutes les 6 heures)
    
    Le format Cron peut sembler cryptique au début, mais c'est très puissant.
    Chaque tâche s'exécutera automatiquement selon son planning sans que vous
    ayez à y penser.
    """
    from app.models.event import ScheduledTask
    
    task = ScheduledTask(
        created_by=current_user.id,
        **task_in.model_dump()
    )
    
    return ScheduledTaskRepository.create(db, task)


@router.get("/tasks", response_model=List[ScheduledTask])
def get_scheduled_tasks(
    *,
    db: Session = Depends(deps.get_db),
    active_only: bool = Query(True, description="Afficher uniquement les tâches actives"),
    current_user: User = Depends(require_admin)
):
    """
    Récupère la liste de toutes les tâches planifiées.
    
    Par défaut, affiche uniquement les tâches actives. Les tâches désactivées
    ne s'exécutent plus mais sont conservées pour référence.
    """
    if active_only:
        return ScheduledTaskRepository.get_all_active(db)
    
    # Cette route nécessiterait une méthode get_all dans le repository
    return ScheduledTaskRepository.get_all_active(db)


@router.get("/tasks/{task_id}", response_model=ScheduledTask)
def get_scheduled_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Récupère les détails complets d'une tâche planifiée.
    
    Affiche la configuration, les statistiques d'exécution (combien de fois
    exécutée, taux de succès), et les dates de dernière et prochaine exécution.
    """
    task = ScheduledTaskRepository.get_by_id(db, task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tâche non trouvée"
        )
    
    return task


@router.put("/tasks/{task_id}", response_model=ScheduledTask)
def update_scheduled_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    task_in: ScheduledTaskUpdate,
    current_user: User = Depends(require_admin)
):
    """
    Met à jour une tâche planifiée.
    
    Vous pouvez modifier le planning, la configuration, ou désactiver
    temporairement la tâche en mettant is_active=false.
    
    **Attention :** Si vous modifiez le planning d'une tâche, la nouvelle
    expression Cron prend effet immédiatement pour calculer la prochaine exécution.
    """
    task = ScheduledTaskRepository.get_by_id(db, task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tâche non trouvée"
        )
    
    # Mettre à jour les champs fournis
    update_data = task_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(task, field, value)
    
    return ScheduledTaskRepository.update(db, task)


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scheduled_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Supprime une tâche planifiée.
    
    L'historique d'exécutions passées est conservé, mais la tâche ne s'exécutera
    plus. Si vous voulez juste désactiver temporairement, utilisez is_active=false.
    """
    task = ScheduledTaskRepository.get_by_id(db, task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tâche non trouvée"
        )
    
    ScheduledTaskRepository.delete(db, task)


@router.get("/tasks/{task_id}/executions", response_model=List[TaskExecution])
def get_task_executions(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(require_admin)
):
    """
    Récupère l'historique d'exécutions d'une tâche.
    
    Pour chaque exécution, vous voyez :
    - Quand elle a commencé et terminé
    - Combien de temps elle a pris
    - Si elle a réussi ou échoué
    - Les logs et messages générés
    
    C'est précieux pour comprendre pourquoi une tâche échoue ou pour
    optimiser ses performances.
    """
    return TaskExecutionRepository.get_by_task(db, task_id, limit)


@router.get("/tasks/stats", response_model=TaskStats)
def get_task_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(require_admin)
):
    """
    Récupère des statistiques sur les tâches planifiées.
    
    Affiche un résumé de l'état des automatisations : combien de tâches
    actives, combien en cours d'exécution, lesquelles ont échoué récemment,
    et quand sera la prochaine exécution.
    
    Parfait pour un tableau de bord qui surveille la santé du système.
    """
    all_active_tasks = ScheduledTaskRepository.get_all_active(db)
    
    total_tasks = len(all_active_tasks)
    running_tasks = sum(1 for t in all_active_tasks if t.status == TaskStatusEnum.RUNNING)
    failed_last_run = sum(1 for t in all_active_tasks if t.status == TaskStatusEnum.FAILED)
    
    # Prochaine exécution
    next_execution = None
    for task in all_active_tasks:
        if task.next_run_at:
            if next_execution is None or task.next_run_at < next_execution:
                next_execution = task.next_run_at
    
    return TaskStats(
        total_tasks=total_tasks,
        active_tasks=total_tasks,
        running_tasks=running_tasks,
        failed_last_run=failed_last_run,
        next_execution=next_execution
    )