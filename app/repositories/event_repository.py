from typing import List, Optional, Dict
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import and_, func

from app.models.event import (
    Event,
    WebhookEndpoint,
    WebhookDelivery,
    ScheduledTask,
    TaskExecution,
    EventType,
    TaskStatus
)


class EventRepository:
    """
    Repository pour gérer les événements système.
    
    Les événements sont comme des notifications internes qui disent "quelque chose
    d'important vient de se passer". Ce repository permet de les créer, les rechercher,
    et marquer ceux qui ont été traités.
    """
    
    @staticmethod
    def create(db: Session, event: Event) -> Event:
        """
        Crée un nouvel événement dans la base de données.
        Chaque événement est horodaté automatiquement.
        """
        db.add(event)
        db.commit()
        db.refresh(event)
        return event
    
    @staticmethod
    def get_by_id(db: Session, event_id: int) -> Optional[Event]:
        """Récupère un événement spécifique par son ID"""
        return db.query(Event).filter(Event.id == event_id).first()
    
    @staticmethod
    def get_pending(db: Session, limit: int = 100) -> List[Event]:
        """
        Récupère les événements en attente de traitement.
        
        Ces événements n'ont pas encore été traités par les webhooks ou
        autres handlers. Ils sont triés du plus ancien au plus récent
        pour assurer un traitement dans l'ordre.
        """
        return db.query(Event).filter(
            ~Event.processed
        ).order_by(Event.triggered_at).limit(limit).all()
    
    @staticmethod
    def get_by_type(
        db: Session,
        event_type: EventType,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[Event]:
        """
        Récupère tous les événements d'un type spécifique.
        
        Par exemple, tous les événements "order.created" pour analyser
        combien de commandes ont été créées dans une période donnée.
        """
        query = db.query(Event).filter(Event.type == event_type)
        
        if start_date:
            query = query.filter(Event.triggered_at >= start_date)
        
        if end_date:
            query = query.filter(Event.triggered_at <= end_date)
        
        return query.order_by(Event.triggered_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_by_entity(
        db: Session,
        entity_type: str,
        entity_id: int
    ) -> List[Event]:
        """
        Récupère tous les événements concernant une entité spécifique.
        
        Par exemple, tous les événements liés à la commande numéro 42.
        C'est utile pour reconstruire l'historique complet d'une entité.
        """
        return db.query(Event).filter(
            and_(
                Event.entity_type == entity_type,
                Event.entity_id == entity_id
            )
        ).order_by(Event.triggered_at).all()
    
    @staticmethod
    def mark_as_processed(
        db: Session,
        event_id: int,
        success: bool = True,
        error: Optional[str] = None
    ) -> Optional[Event]:
        """
        Marque un événement comme traité.
        
        Après qu'un événement a été traité (webhooks envoyés, notifications
        déclenchées), on le marque comme traité pour ne pas le retraiter.
        """
        event = EventRepository.get_by_id(db, event_id)
        
        if not event:
            return None
        
        event.processed = True
        event.processed_at = datetime.now(timezone.utc)
        event.processing_attempts += 1
        
        if not success and error:
            event.last_error = error
        
        db.commit()
        db.refresh(event)
        return event
    
    @staticmethod
    def get_recent(
        db: Session,
        hours: int = 24,
        limit: int = 100
    ) -> List[Event]:
        """
        Récupère les événements récents.
        
        Utile pour afficher un flux d'activité en temps réel sur
        un tableau de bord administrateur.
        """
        since = datetime.now(timezone.utc) - timedelta(hours=hours)
        
        return db.query(Event).filter(
            Event.triggered_at >= since
        ).order_by(Event.triggered_at.desc()).limit(limit).all()
    
    @staticmethod
    def count_by_type(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, int]:
        """
        Compte les événements par type dans une période donnée.
        
        Retourne un dictionnaire avec le type d'événement comme clé
        et le nombre d'occurrences comme valeur.
        """
        query = db.query(
            Event.type,
            func.count(Event.id).label('count')
        )
        
        if start_date:
            query = query.filter(Event.triggered_at >= start_date)
        
        if end_date:
            query = query.filter(Event.triggered_at <= end_date)
        
        results = query.group_by(Event.type).all()
        
        return {str(event_type): count for event_type, count in results}
    
    @staticmethod
    def cleanup_old_events(db: Session, days: int = 90) -> int:
        """
        Supprime les anciens événements traités pour libérer de l'espace.
        
        Les événements sont gardés pendant un certain temps pour l'audit
        et le débogage, puis supprimés. Seuls les événements traités sont
        supprimés - les non traités sont conservés.
        
        Retourne le nombre d'événements supprimés.
        """
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        count = db.query(Event).filter(
            and_(
                Event.processed,
                Event.triggered_at < cutoff_date
            )
        ).delete()
        
        db.commit()
        return count


class WebhookEndpointRepository:
    """
    Repository pour gérer les webhooks endpoints.
    
    Les webhooks permettent à votre application de notifier d'autres systèmes
    quand des événements se produisent. Ce repository gère ces configurations.
    """
    
    @staticmethod
    def create(db: Session, endpoint: WebhookEndpoint) -> WebhookEndpoint:
        """Crée un nouveau webhook endpoint"""
        db.add(endpoint)
        db.commit()
        db.refresh(endpoint)
        return endpoint
    
    @staticmethod
    def get_by_id(db: Session, endpoint_id: int) -> Optional[WebhookEndpoint]:
        """Récupère un webhook endpoint par son ID"""
        return db.query(WebhookEndpoint).filter(
            WebhookEndpoint.id == endpoint_id
        ).first()
    
    @staticmethod
    def get_all_active(db: Session) -> List[WebhookEndpoint]:
        """
        Récupère tous les webhooks endpoints actifs.
        
        Ce sont les endpoints qui recevront actuellement des notifications
        quand des événements se produisent.
        """
        return db.query(WebhookEndpoint).filter(
            WebhookEndpoint.is_active
        ).all()
    
    @staticmethod
    def get_for_event_type(db: Session, event_type: str) -> List[WebhookEndpoint]:
        """
        Récupère tous les webhooks abonnés à un type d'événement spécifique.
        
        Quand un événement "order.created" se produit, cette méthode trouve
        tous les webhooks qui veulent être notifiés de ce type d'événement.
        """
        return db.query(WebhookEndpoint).filter(
            and_(
                WebhookEndpoint.is_active,
                WebhookEndpoint.events.contains([event_type])
            )
        ).all()
    
    @staticmethod
    def update(db: Session, endpoint: WebhookEndpoint) -> WebhookEndpoint:
        """Met à jour un webhook endpoint"""
        db.commit()
        db.refresh(endpoint)
        return endpoint
    
    @staticmethod
    def update_stats(
        db: Session,
        endpoint_id: int,
        success: bool
    ) -> Optional[WebhookEndpoint]:
        """
        Met à jour les statistiques d'un webhook après une livraison.
        
        Incrémente les compteurs de succès ou d'échec et met à jour
        la date de dernière utilisation.
        """
        endpoint = WebhookEndpointRepository.get_by_id(db, endpoint_id)
        
        if not endpoint:
            return None
        
        endpoint.last_triggered_at = datetime.now(timezone.utc)
        endpoint.total_deliveries += 1
        
        if success:
            endpoint.successful_deliveries += 1
        else:
            endpoint.failed_deliveries += 1
        
        return WebhookEndpointRepository.update(db, endpoint)
    
    @staticmethod
    def delete(db: Session, endpoint: WebhookEndpoint) -> None:
        """Supprime un webhook endpoint"""
        db.delete(endpoint)
        db.commit()


class WebhookDeliveryRepository:
    """
    Repository pour l'historique des livraisons de webhooks.
    
    Chaque fois qu'un webhook est appelé, on enregistre tous les détails
    (requête, réponse, temps, erreurs) pour le débogage et les statistiques.
    """
    
    @staticmethod
    def create(db: Session, delivery: WebhookDelivery) -> WebhookDelivery:
        """Enregistre une nouvelle livraison de webhook"""
        db.add(delivery)
        db.commit()
        db.refresh(delivery)
        return delivery
    
    @staticmethod
    def get_by_endpoint(
        db: Session,
        endpoint_id: int,
        limit: int = 100
    ) -> List[WebhookDelivery]:
        """
        Récupère l'historique des livraisons d'un endpoint.
        
        Permet de voir toutes les fois où ce webhook a été appelé,
        avec les succès et les échecs.
        """
        return db.query(WebhookDelivery).filter(
            WebhookDelivery.webhook_endpoint_id == endpoint_id
        ).order_by(WebhookDelivery.delivered_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_by_event(db: Session, event_id: int) -> List[WebhookDelivery]:
        """
        Récupère toutes les livraisons déclenchées par un événement.
        
        Un seul événement peut déclencher plusieurs webhooks (un pour
        chaque endpoint abonné à ce type d'événement).
        """
        return db.query(WebhookDelivery).filter(
            WebhookDelivery.event_id == event_id
        ).all()
    
    @staticmethod
    def get_failed(
        db: Session,
        endpoint_id: Optional[int] = None,
        hours: int = 24
    ) -> List[WebhookDelivery]:
        """
        Récupère les livraisons échouées récentes.
        
        Utile pour déboguer les problèmes de webhooks ou relancer
        manuellement des livraisons qui ont échoué.
        """
        since = datetime.now(timezone.utc) - timedelta(hours=hours)
        
        query = db.query(WebhookDelivery).filter(
            and_(
                ~WebhookDelivery.success,
                WebhookDelivery.delivered_at >= since
            )
        )
        
        if endpoint_id:
            query = query.filter(
                WebhookDelivery.webhook_endpoint_id == endpoint_id
            )
        
        return query.order_by(WebhookDelivery.delivered_at.desc()).all()
    
    @staticmethod
    def cleanup_old_deliveries(db: Session, days: int = 30) -> int:
        """
        Supprime les anciennes livraisons pour libérer de l'espace.
        
        Garde seulement les livraisons récentes pour le débogage.
        Retourne le nombre de livraisons supprimées.
        """
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        count = db.query(WebhookDelivery).filter(
            WebhookDelivery.delivered_at < cutoff_date
        ).delete()
        
        db.commit()
        return count


class ScheduledTaskRepository:
    """
    Repository pour gérer les tâches planifiées.
    
    Les tâches planifiées sont des actions qui se répètent automatiquement
    selon un calendrier défini (comme les alarmes sur votre téléphone).
    """
    
    @staticmethod
    def create(db: Session, task: ScheduledTask) -> ScheduledTask:
        """Crée une nouvelle tâche planifiée"""
        db.add(task)
        db.commit()
        db.refresh(task)
        return task
    
    @staticmethod
    def get_by_id(db: Session, task_id: int) -> Optional[ScheduledTask]:
        """Récupère une tâche par son ID"""
        return db.query(ScheduledTask).filter(
            ScheduledTask.id == task_id
        ).first()
    
    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[ScheduledTask]:
        """
        Récupère une tâche par son nom.
        
        Les noms de tâches sont uniques, donc on peut les utiliser
        comme identifiants parlants.
        """
        return db.query(ScheduledTask).filter(
            ScheduledTask.name == name
        ).first()
    
    @staticmethod
    def get_all_active(db: Session) -> List[ScheduledTask]:
        """
        Récupère toutes les tâches actives.
        
        Ce sont les tâches qui s'exécuteront selon leur planning.
        Les tâches désactivées sont ignorées.
        """
        return db.query(ScheduledTask).filter(
            ScheduledTask.is_active
        ).all()
    
    @staticmethod
    def get_due_tasks(db: Session) -> List[ScheduledTask]:
        """
        Récupère les tâches qui doivent s'exécuter maintenant.
        
        Une tâche est "due" si sa prochaine exécution (next_run_at)
        est dans le passé ou maintenant, et qu'elle n'est pas déjà
        en cours d'exécution.
        """
        now = datetime.now(timezone.utc)
        
        return db.query(ScheduledTask).filter(
            and_(
                ScheduledTask.is_active,
                ScheduledTask.status != TaskStatus.RUNNING,
                ScheduledTask.next_run_at <= now
            )
        ).all()
    
    @staticmethod
    def update(db: Session, task: ScheduledTask) -> ScheduledTask:
        """Met à jour une tâche planifiée"""
        db.commit()
        db.refresh(task)
        return task
    
    @staticmethod
    def update_execution_stats(
        db: Session,
        task_id: int,
        success: bool,
        duration_seconds: int,
        result: Optional[str] = None
    ) -> Optional[ScheduledTask]:
        """
        Met à jour les statistiques d'exécution d'une tâche.
        
        Appelé après chaque exécution pour garder trace des succès,
        échecs, et performances.
        """
        task = ScheduledTaskRepository.get_by_id(db, task_id)
        
        if not task:
            return None
        
        task.last_run_at = datetime.now(timezone.utc)
        task.last_duration_seconds = duration_seconds
        task.last_result = result
        task.total_runs += 1
        
        if success:
            task.successful_runs += 1
            task.status = TaskStatus.COMPLETED
        else:
            task.failed_runs += 1
            task.status = TaskStatus.FAILED
        
        return ScheduledTaskRepository.update(db, task)
    
    @staticmethod
    def delete(db: Session, task: ScheduledTask) -> None:
        """Supprime une tâche planifiée"""
        db.delete(task)
        db.commit()


class TaskExecutionRepository:
    """
    Repository pour l'historique d'exécution des tâches planifiées.
    
    Chaque fois qu'une tâche s'exécute, on enregistre tous les détails
    pour permettre l'audit, le débogage et l'analyse de performance.
    """
    
    @staticmethod
    def create(db: Session, execution: TaskExecution) -> TaskExecution:
        """Enregistre une nouvelle exécution de tâche"""
        db.add(execution)
        db.commit()
        db.refresh(execution)
        return execution
    
    @staticmethod
    def get_by_task(
        db: Session,
        task_id: int,
        limit: int = 50
    ) -> List[TaskExecution]:
        """
        Récupère l'historique d'exécutions d'une tâche.
        
        Permet de voir toutes les fois où cette tâche s'est exécutée,
        avec les succès, échecs, et durées.
        """
        return db.query(TaskExecution).filter(
            TaskExecution.task_id == task_id
        ).order_by(TaskExecution.started_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_recent_failures(
        db: Session,
        hours: int = 24
    ) -> List[TaskExecution]:
        """
        Récupère les exécutions échouées récentes.
        
        Utile pour un tableau de bord administrateur qui montre
        les tâches qui ont des problèmes.
        """
        since = datetime.now(timezone.utc) - timedelta(hours=hours)
        
        return db.query(TaskExecution).filter(
            and_(
                ~TaskExecution.success,
                TaskExecution.started_at >= since
            )
        ).order_by(TaskExecution.started_at.desc()).all()
    
    @staticmethod
    def update(db: Session, execution: TaskExecution) -> TaskExecution:
        """Met à jour une exécution de tâche"""
        db.commit()
        db.refresh(execution)
        return execution
    
    @staticmethod
    def cleanup_old_executions(db: Session, days: int = 90) -> int:
        """
        Supprime les anciennes exécutions pour libérer de l'espace.
        
        Garde seulement l'historique récent. Les statistiques globales
        de la tâche sont préservées dans ScheduledTask.
        
        Retourne le nombre d'exécutions supprimées.
        """
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        count = db.query(TaskExecution).filter(
            TaskExecution.started_at < cutoff_date
        ).delete()
        
        db.commit()
        return count