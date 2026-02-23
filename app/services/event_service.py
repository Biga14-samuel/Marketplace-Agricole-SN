from typing import Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from croniter import croniter
import secrets
import hmac
import hashlib
import httpx

from app.models.event import Event, WebhookEndpoint, WebhookDelivery, ScheduledTask
from app.repositories.event_repository import (
    EventRepository,
    WebhookEndpointRepository,
    WebhookDeliveryRepository,
    ScheduledTaskRepository
)


class EventService:
    """Service pour gérer les événements système"""
    
    @staticmethod
    def create_event(
        db: Session,
        event_type: str,
        payload: Dict[str, Any],
        entity_type: Optional[str] = None,
        entity_id: Optional[int] = None,
        triggered_by: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Event:
        """
        Crée un nouvel événement et le marque pour traitement.
        
        Cette méthode est appelée partout dans l'application quand quelque chose
        d'important se passe. Par exemple, après la création d'une commande,
        on appelle : EventService.create_event(db, "order.created", {...})
        """
        event = Event(
            type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            payload=payload,
            metadata=metadata,
            triggered_by=triggered_by,
            processed=False
        )
        
        return EventRepository.create(db, event)


class WebhookService:
    """Service pour gérer l'envoi de webhooks"""
    
    @staticmethod
    def generate_secret() -> str:
        """Génère un secret aléatoire sécurisé pour signer les webhooks"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def generate_signature(payload: str, secret: str) -> str:
        """
        Génère une signature HMAC-SHA256 pour sécuriser un webhook.
        
        Le système distant peut vérifier cette signature pour s'assurer
        que le webhook vient bien de vous et non d'un attaquant.
        """
        return hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
    
    @staticmethod
    async def send_webhook(
        db: Session,
        endpoint: WebhookEndpoint,
        event: Event
    ) -> WebhookDelivery:
        """
        Envoie un webhook à un endpoint pour un événement donné.
        
        Cette méthode :
        1. Prépare le payload JSON avec l'événement
        2. Génère une signature de sécurité
        3. Envoie la requête HTTP
        4. Enregistre le résultat (succès ou échec)
        5. Met à jour les statistiques de l'endpoint
        """
        import json
        
        # Préparer le payload
        payload_dict = {
            "event_id": event.id,
            "event_type": event.type,
            "entity_type": event.entity_type,
            "entity_id": event.entity_id,
            "payload": event.payload,
            "triggered_at": event.triggered_at.isoformat()
        }
        payload_str = json.dumps(payload_dict)
        
        # Générer la signature
        signature = WebhookService.generate_signature(payload_str, endpoint.secret)
        
        # Préparer les headers
        headers = {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Event-Type": event.type,
            **(endpoint.headers or {})
        }
        
        # Créer l'enregistrement de livraison
        delivery = WebhookDelivery(
            webhook_endpoint_id=endpoint.id,
            event_id=event.id,
            request_headers=headers,
            request_body=payload_str,
            attempt_number=1
        )
        
        start_time = datetime.now(timezone.utc)
        
        try:
            # Envoyer la requête HTTP
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method=endpoint.http_method,
                    url=endpoint.url,
                    json=payload_dict,
                    headers=headers,
                    timeout=endpoint.timeout_seconds
                )
            
            # Calculer le temps de réponse
            response_time_ms = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
            
            # Enregistrer la réponse
            delivery.response_status_code = response.status_code
            delivery.response_headers = dict(response.headers)
            delivery.response_body = response.text
            delivery.response_time_ms = response_time_ms
            delivery.success = 200 <= response.status_code < 300
            
        except Exception as e:
            # Enregistrer l'erreur
            delivery.success = False
            delivery.error_message = str(e)
        
        # Sauvegarder la livraison
        delivery = WebhookDeliveryRepository.create(db, delivery)
        
        # Mettre à jour les statistiques de l'endpoint
        WebhookEndpointRepository.update_stats(db, endpoint.id, delivery.success)
        
        return delivery


class ScheduledTaskService:
    """Service pour gérer les tâches planifiées"""
    
    @staticmethod
    def calculate_next_run(schedule: str, from_time: Optional[datetime] = None) -> datetime:
        """
        Calcule la prochaine exécution d'une tâche selon son expression Cron.
        
        Utilise la bibliothèque croniter pour parser l'expression Cron
        et calculer la prochaine occurrence.
        """
        if from_time is None:
            from_time = datetime.now(timezone.utc)
        
        cron = croniter(schedule, from_time)
        return cron.get_next(datetime)
    
    @staticmethod
    def update_next_run(db: Session, task_id: int) -> Optional[ScheduledTask]:
        """
        Met à jour la date de prochaine exécution d'une tâche.
        
        Appelé après chaque exécution pour planifier la suivante.
        """
        task = ScheduledTaskRepository.get_by_id(db, task_id)
        
        if not task or not task.is_active:
            return None
        
        task.next_run_at = ScheduledTaskService.calculate_next_run(task.schedule)
        
        return ScheduledTaskRepository.update(db, task)