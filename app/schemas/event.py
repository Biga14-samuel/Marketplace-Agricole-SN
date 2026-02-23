from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from enum import Enum
import re


# ============ ÉNUMÉRATIONS ============

class EventTypeEnum(str, Enum):
    """Types d'événements système"""
    # Utilisateur
    USER_CREATED = "user.created"
    USER_UPDATED = "user.updated"
    USER_DELETED = "user.deleted"
    USER_VERIFIED = "user.verified"
    USER_LOGGED_IN = "user.logged_in"
    # Commandes
    ORDER_CREATED = "order.created"
    ORDER_CONFIRMED = "order.confirmed"
    ORDER_PAID = "order.paid"
    ORDER_SHIPPED = "order.shipped"
    ORDER_DELIVERED = "order.delivered"
    ORDER_CANCELLED = "order.cancelled"
    ORDER_REFUNDED = "order.refunded"
    # Paiements
    PAYMENT_INITIATED = "payment.initiated"
    PAYMENT_SUCCESS = "payment.success"
    PAYMENT_FAILED = "payment.failed"
    # Produits
    PRODUCT_CREATED = "product.created"
    PRODUCT_UPDATED = "product.updated"
    PRODUCT_DELETED = "product.deleted"
    PRODUCT_OUT_OF_STOCK = "product.out_of_stock"
    PRODUCT_BACK_IN_STOCK = "product.back_in_stock"
    # Livraisons
    DELIVERY_ASSIGNED = "delivery.assigned"
    DELIVERY_COMPLETED = "delivery.completed"
    # Messages
    MESSAGE_SENT = "message.sent"
    # Système
    BACKUP_COMPLETED = "system.backup_completed"


class TaskStatusEnum(str, Enum):
    """Statuts de tâche planifiée"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    DISABLED = "disabled"


class TaskTypeEnum(str, Enum):
    """Types de tâches planifiées"""
    CLEANUP_OLD_SESSIONS = "cleanup.old_sessions"
    CLEANUP_EXPIRED_TOKENS = "cleanup.expired_tokens"
    GENERATE_DAILY_REPORT = "report.daily"
    SEND_REMINDER_EMAILS = "notification.reminders"
    BACKUP_DATABASE = "backup.database"
    CUSTOM = "custom"


# ============ EVENT SCHEMAS ============

class EventBase(BaseModel):
    """Schéma de base pour un événement"""
    type: EventTypeEnum = Field(..., description="Type d'événement")
    entity_type: Optional[str] = Field(None, max_length=50, description="Type d'entité concernée")
    entity_id: Optional[int] = Field(None, description="ID de l'entité concernée")
    payload: Dict[str, Any] = Field(..., description="Données de l'événement")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Métadonnées additionnelles")


class EventCreate(EventBase):
    """
    Schéma pour créer un nouvel événement.
    Le triggered_by sera renseigné automatiquement avec l'utilisateur actuel.
    """
    pass


class Event(EventBase):
    """Schéma complet d'un événement"""
    id: int
    triggered_by: Optional[int] = None
    triggered_at: datetime
    processed: bool
    processed_at: Optional[datetime] = None
    processing_attempts: int
    last_error: Optional[str] = None
    
    model_config = {"from_attributes": True}


# ============ WEBHOOK ENDPOINT SCHEMAS ============

class WebhookEndpointBase(BaseModel):
    """Schéma de base pour un webhook endpoint"""
    name: str = Field(..., min_length=1, max_length=100, description="Nom descriptif")
    description: Optional[str] = Field(None, description="Description du webhook")
    url: str = Field(..., min_length=1, max_length=500, description="URL de destination")
    events: List[str] = Field(..., min_length=1, description="Liste des événements écoutés")
    http_method: str = Field(default="POST", description="Méthode HTTP")
    headers: Optional[Dict[str, str]] = Field(None, description="Headers HTTP personnalisés")
    timeout_seconds: int = Field(default=30, ge=1, le=300, description="Timeout en secondes")
    max_retries: int = Field(default=3, ge=0, le=10, description="Nombre de tentatives max")
    retry_delay_seconds: int = Field(default=60, ge=1, description="Délai entre tentatives")
    is_active: bool = Field(default=True, description="Webhook actif ou non")
    
    # Validation de l'URL - Pydantic v2
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        """Valide que l'URL est au bon format"""
        if not v.startswith(('http://', 'https://')):
            raise ValueError("L'URL doit commencer par http:// ou https://")
        return v
    
    # Validation de la méthode HTTP - Pydantic v2
    @field_validator('http_method')
    @classmethod
    def validate_http_method(cls, v: str) -> str:
        """Valide que la méthode HTTP est supportée"""
        allowed_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
        v = v.upper()
        if v not in allowed_methods:
            raise ValueError(f"Méthode HTTP doit être parmi : {', '.join(allowed_methods)}")
        return v
    
    # Validation des événements - Pydantic v2
    @field_validator('events')
    @classmethod
    def validate_events(cls, v: List[str]) -> List[str]:
        """Valide que les événements sont valides"""
        valid_events = [e.value for e in EventTypeEnum]
        for event in v:
            if event not in valid_events:
                raise ValueError(f"Événement '{event}' invalide. Doit être parmi : {', '.join(valid_events)}")
        return v


class WebhookEndpointCreate(WebhookEndpointBase):
    """
    Schéma pour créer un webhook endpoint.
    Le secret sera généré automatiquement par le système si non fourni.
    """
    secret: Optional[str] = Field(None, min_length=32, max_length=100, description="Secret partagé")


class WebhookEndpointUpdate(BaseModel):
    """Schéma pour mettre à jour un webhook endpoint"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    url: Optional[str] = Field(None, min_length=1, max_length=500)
    events: Optional[List[str]] = Field(None, min_length=1)
    http_method: Optional[str] = None
    headers: Optional[Dict[str, str]] = None
    timeout_seconds: Optional[int] = Field(None, ge=1, le=300)
    max_retries: Optional[int] = Field(None, ge=0, le=10)
    retry_delay_seconds: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None


class WebhookEndpoint(WebhookEndpointBase):
    """Schéma complet d'un webhook endpoint"""
    id: int
    secret: str
    last_triggered_at: Optional[datetime] = None
    total_deliveries: int
    successful_deliveries: int
    failed_deliveries: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[int] = None
    
    model_config = {"from_attributes": True}


# ============ WEBHOOK DELIVERY SCHEMAS ============

class WebhookDeliveryBase(BaseModel):
    """Schéma de base pour une livraison de webhook"""
    request_headers: Optional[Dict[str, str]] = None
    request_body: Optional[str] = None
    response_status_code: Optional[int] = None
    response_headers: Optional[Dict[str, str]] = None
    response_body: Optional[str] = None
    response_time_ms: Optional[int] = None
    success: bool
    error_message: Optional[str] = None
    attempt_number: int = 1


class WebhookDelivery(WebhookDeliveryBase):
    """Schéma complet d'une livraison de webhook"""
    id: int
    webhook_endpoint_id: int
    event_id: int
    delivered_at: datetime
    
    model_config = {"from_attributes": True}


# ============ SCHEDULED TASK SCHEMAS ============

class ScheduledTaskBase(BaseModel):
    """Schéma de base pour une tâche planifiée"""
    name: str = Field(..., min_length=1, max_length=100, description="Nom unique de la tâche")
    description: Optional[str] = Field(None, description="Description de la tâche")
    type: TaskTypeEnum = Field(..., description="Type de tâche")
    schedule: str = Field(..., min_length=1, max_length=100, description="Expression Cron")
    is_active: bool = Field(default=True, description="Tâche active ou non")
    config: Optional[Dict[str, Any]] = Field(None, description="Configuration de la tâche")
    timeout_seconds: int = Field(default=300, ge=1, le=3600, description="Timeout en secondes")
    max_retries: int = Field(default=3, ge=0, le=10, description="Nombre de tentatives max")
    notify_on_failure: bool = Field(default=True, description="Notifier en cas d'échec")
    notify_email: Optional[str] = Field(None, max_length=255, description="Email de notification")
    
    # Validation de l'expression Cron - Pydantic v2
    @field_validator('schedule')
    @classmethod
    def validate_cron(cls, v: str) -> str:
        """
        Valide que l'expression Cron est au bon format.
        Format : minute heure jour_du_mois mois jour_de_la_semaine
        Exemple : "0 3 * * *" = tous les jours à 3h du matin
        """
        # Validation basique : 5 champs séparés par des espaces
        parts = v.split()
        if len(parts) != 5:
            raise ValueError(
                "L'expression Cron doit avoir 5 champs : "
                "minute heure jour_du_mois mois jour_de_la_semaine. "
                "Exemple : '0 3 * * *' pour tous les jours à 3h"
            )
        
        # Chaque champ peut contenir : nombres, *, -, /, ,
        cron_pattern = re.compile(r'^[\d\*\-/,]+$')
        for part in parts:
            if not cron_pattern.match(part):
                raise ValueError(
                    f"Champ Cron invalide : '{part}'. "
                    "Utilisez uniquement des chiffres, *, -, /, et ,"
                )
        
        return v
    
    # Validation de l'email si notif activée - Pydantic v2
    @field_validator('notify_email')
    @classmethod
    def validate_notify_email(cls, v: Optional[str], info: ValidationInfo) -> Optional[str]:
        """Vérifie que l'email est fourni si notify_on_failure est True"""
        # Accès aux autres champs via info.data (Pydantic v2)
        notify_on_failure = info.data.get('notify_on_failure', False)
        
        if notify_on_failure and not v:
            raise ValueError(
                "Un email de notification est requis si notify_on_failure est True"
            )
        
        # Validation basique du format email si fourni
        if v and '@' not in v:
            raise ValueError("Format d'email invalide")
        
        return v


class ScheduledTaskCreate(ScheduledTaskBase):
    """Schéma pour créer une tâche planifiée"""
    pass


class ScheduledTaskUpdate(BaseModel):
    """Schéma pour mettre à jour une tâche planifiée"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    schedule: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: Optional[bool] = None
    config: Optional[Dict[str, Any]] = None
    timeout_seconds: Optional[int] = Field(None, ge=1, le=3600)
    max_retries: Optional[int] = Field(None, ge=0, le=10)
    notify_on_failure: Optional[bool] = None
    notify_email: Optional[str] = Field(None, max_length=255)


class ScheduledTask(ScheduledTaskBase):
    """Schéma complet d'une tâche planifiée"""
    id: int
    status: TaskStatusEnum
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    last_result: Optional[str] = None
    last_duration_seconds: Optional[int] = None
    total_runs: int
    successful_runs: int
    failed_runs: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[int] = None
    
    model_config = {"from_attributes": True}


# ============ TASK EXECUTION SCHEMAS ============

class TaskExecutionBase(BaseModel):
    """Schéma de base pour une exécution de tâche"""
    status: TaskStatusEnum
    success: Optional[bool] = None
    output: Optional[str] = None
    error: Optional[str] = None
    rows_processed: Optional[int] = None
    attempt_number: int = 1


class TaskExecution(TaskExecutionBase):
    """Schéma complet d'une exécution de tâche"""
    id: int
    task_id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    
    model_config = {"from_attributes": True}


# ============ RESPONSE SCHEMAS ============

class EventStats(BaseModel):
    """Statistiques sur les événements"""
    total_events: int = Field(description="Nombre total d'événements")
    pending_events: int = Field(description="Événements non traités")
    processed_today: int = Field(description="Événements traités aujourd'hui")
    by_type: Dict[str, int] = Field(description="Répartition par type")
    average_processing_time_ms: Optional[int] = Field(None, description="Temps moyen de traitement")


class WebhookStats(BaseModel):
    """Statistiques sur les webhooks"""
    total_endpoints: int = Field(description="Nombre total d'endpoints")
    active_endpoints: int = Field(description="Endpoints actifs")
    total_deliveries: int = Field(description="Nombre total de livraisons")
    successful_deliveries: int = Field(description="Livraisons réussies")
    failed_deliveries: int = Field(description="Livraisons échouées")
    success_rate: float = Field(description="Taux de succès en %")


class TaskStats(BaseModel):
    """Statistiques sur les tâches planifiées"""
    total_tasks: int = Field(description="Nombre total de tâches")
    active_tasks: int = Field(description="Tâches actives")
    running_tasks: int = Field(description="Tâches en cours")
    failed_last_run: int = Field(description="Tâches échouées dernièrement")
    next_execution: Optional[datetime] = Field(None, description="Prochaine exécution")


class EventWithDeliveries(Event):
    """Événement avec ses livraisons de webhook"""
    deliveries: List[WebhookDelivery] = []


class ScheduledTaskWithExecutions(ScheduledTask):
    """Tâche planifiée avec son historique d'exécutions"""
    recent_executions: List[TaskExecution] = []


class WebhookTestRequest(BaseModel):
    """Requête pour tester un webhook"""
    event_type: EventTypeEnum = Field(..., description="Type d'événement à simuler")
    payload: Dict[str, Any] = Field(..., description="Données de test")


class WebhookTestResponse(BaseModel):
    """Réponse d'un test de webhook"""
    success: bool = Field(description="Test réussi ou non")
    status_code: Optional[int] = Field(None, description="Code de statut HTTP")
    response_time_ms: Optional[int] = Field(None, description="Temps de réponse")
    error_message: Optional[str] = Field(None, description="Message d'erreur si échec")
    response_body: Optional[str] = Field(None, description="Corps de la réponse")