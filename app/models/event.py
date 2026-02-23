from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey,
    Text, func, Enum as SQLEnum, Index
)

from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base
import enum


# ============ ÉNUMÉRATIONS ============

class EventType(str, enum.Enum):
    """
    Types d'événements système qui peuvent être déclenchés.
    
    Chaque fois que quelque chose d'important se passe dans l'application,
    un événement de ce type est créé et peut déclencher des actions automatiques.
    """
    # Événements utilisateur
    USER_CREATED = "user.created"
    USER_UPDATED = "user.updated"
    USER_DELETED = "user.deleted"
    USER_VERIFIED = "user.verified"
    USER_LOGGED_IN = "user.logged_in"
    
    # Événements de commande
    ORDER_CREATED = "order.created"
    ORDER_CONFIRMED = "order.confirmed"
    ORDER_PAID = "order.paid"
    ORDER_SHIPPED = "order.shipped"
    ORDER_DELIVERED = "order.delivered"
    ORDER_CANCELLED = "order.cancelled"
    ORDER_REFUNDED = "order.refunded"
    
    # Événements de paiement
    PAYMENT_INITIATED = "payment.initiated"
    PAYMENT_SUCCESS = "payment.success"
    PAYMENT_FAILED = "payment.failed"
    PAYMENT_REFUND_INITIATED = "payment.refund_initiated"
    PAYMENT_REFUND_COMPLETED = "payment.refund_completed"
    
    # Événements de produit
    PRODUCT_CREATED = "product.created"
    PRODUCT_UPDATED = "product.updated"
    PRODUCT_DELETED = "product.deleted"
    PRODUCT_OUT_OF_STOCK = "product.out_of_stock"
    PRODUCT_BACK_IN_STOCK = "product.back_in_stock"
    PRODUCT_PRICE_CHANGED = "product.price_changed"
    
    # Événements de livraison
    DELIVERY_ASSIGNED = "delivery.assigned"
    DELIVERY_IN_TRANSIT = "delivery.in_transit"
    DELIVERY_COMPLETED = "delivery.completed"
    DELIVERY_FAILED = "delivery.failed"
    
    # Événements de message
    MESSAGE_SENT = "message.sent"
    MESSAGE_RECEIVED = "message.received"
    
    # Événements de modération
    CONTENT_REPORTED = "content.reported"
    USER_BANNED = "user.banned"
    USER_UNBANNED = "user.unbanned"
    
    # Événements système
    BACKUP_COMPLETED = "system.backup_completed"
    BACKUP_FAILED = "system.backup_failed"
    MAINTENANCE_STARTED = "system.maintenance_started"
    MAINTENANCE_ENDED = "system.maintenance_ended"


class TaskStatus(str, enum.Enum):
    """
    Statuts possibles pour une tâche planifiée.
    """
    PENDING = "pending"       # En attente d'exécution
    RUNNING = "running"       # En cours d'exécution
    COMPLETED = "completed"   # Terminée avec succès
    FAILED = "failed"         # Échec
    CANCELLED = "cancelled"   # Annulée
    DISABLED = "disabled"     # Désactivée


class TaskType(str, enum.Enum):
    """
    Types de tâches planifiées disponibles.
    
    Chaque type correspond à une fonction spécifique qui sera exécutée
    selon le planning défini.
    """
    # Nettoyage et maintenance
    CLEANUP_OLD_SESSIONS = "cleanup.old_sessions"
    CLEANUP_EXPIRED_TOKENS = "cleanup.expired_tokens"
    CLEANUP_OLD_LOGS = "cleanup.old_logs"
    
    # Synchronisation
    SYNC_INVENTORY = "sync.inventory"
    SYNC_PRODUCTS = "sync.products"
    
    # Rapports et statistiques
    GENERATE_DAILY_REPORT = "report.daily"
    GENERATE_WEEKLY_REPORT = "report.weekly"
    GENERATE_MONTHLY_REPORT = "report.monthly"
    CALCULATE_ANALYTICS = "analytics.calculate"
    
    # Notifications
    SEND_REMINDER_EMAILS = "notification.reminders"
    SEND_NEWSLETTER = "notification.newsletter"
    PROCESS_NOTIFICATIONS_QUEUE = "notification.process_queue"
    
    # Paiements
    PROCESS_PENDING_PAYMENTS = "payment.process_pending"
    PROCESS_RECURRING_PAYMENTS = "payment.recurring"
    
    # Livraisons
    UPDATE_DELIVERY_STATUS = "delivery.update_status"
    PROCESS_EXPIRED_BANS = "moderation.expire_bans"
    
    # Sauvegardes
    BACKUP_DATABASE = "backup.database"
    BACKUP_FILES = "backup.files"
    
    # Personnalisé
    CUSTOM = "custom"


# ============ MODÈLES ============

class Event(Base):
    """
    Événement système déclenché par une action dans l'application.
    
    Chaque fois que quelque chose d'important se passe (nouvelle commande, produit
    en rupture de stock, paiement reçu), un événement est créé. Ces événements peuvent :
    - Déclencher des webhooks vers des systèmes externes
    - Être utilisés pour des notifications en temps réel
    - Alimenter des tableaux de bord et des statistiques
    - Créer un audit trail de ce qui s'est passé
    
    C'est comme un journal de bord détaillé qui enregistre tout ce qui se passe
    sur votre plateforme, avec suffisamment de contexte pour comprendre et réagir.
    """
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Type d'événement (utilise l'énumération EventType)
    type = Column(SQLEnum(EventType), nullable=False, index=True)
    
    # Sur quelle entité l'événement s'est produit
    entity_type = Column(String(50), nullable=True, index=True)  # "order", "user", "product"
    entity_id = Column(Integer, nullable=True, index=True)
    
    # Données de l'événement au format JSON
    # Contient toutes les informations contextuelles nécessaires
    # Par exemple, pour order.created : {"order_id": 123, "total": 45.50, "items_count": 3}
    payload = Column(JSONB, nullable=False)
    
    # Métadonnées additionnelles
    # User-Agent, IP, ID de l'utilisateur qui a déclenché l'action, etc.
    extra_data = Column(JSONB, nullable=True)
    
    # Qui a déclenché cet événement (si applicable)
    triggered_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Quand l'événement s'est produit
    triggered_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)
    
    # L'événement a-t-il été traité par les webhooks/handlers ?
    processed = Column(Boolean, nullable=False, default=False, index=True)
    processed_at = Column(DateTime, nullable=True)
    
    # Nombre de tentatives de traitement (utile si un webhook échoue)
    processing_attempts = Column(Integer, nullable=False, default=0)
    
    # Dernière erreur rencontrée lors du traitement
    last_error = Column(Text, nullable=True)
    
    # Relations
    user = relationship("User", foreign_keys=[triggered_by])
    webhook_deliveries = relationship("WebhookDelivery", back_populates="event", cascade="all, delete-orphan")
    
    # Index composé pour rechercher efficacement les événements non traités
    __table_args__ = (
        Index('ix_events_pending', 'processed', 'triggered_at'),
        Index('ix_events_entity', 'entity_type', 'entity_id'),
    )
    
    def __repr__(self):
        return f"<Event {self.type} entity={self.entity_type}#{self.entity_id}>"


class WebhookEndpoint(Base):
    """
    Point de terminaison webhook externe qui reçoit des notifications d'événements.
    
    Les webhooks permettent à votre application de notifier automatiquement d'autres
    systèmes quand quelque chose se passe. Par exemple :
    - Notifier un système comptable quand une commande est payée
    - Envoyer des données à un CRM quand un client s'inscrit
    - Synchroniser le stock avec un système d'inventaire externe
    
    C'est comme avoir des messagers automatiques qui vont prévenir d'autres systèmes
    dès qu'un événement important se produit.
    """
    __tablename__ = "webhook_endpoints"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Informations de base
    name = Column(String(100), nullable=False)  # Nom descriptif (ex: "Synchronisation comptabilité")
    description = Column(Text, nullable=True)
    
    # URL qui recevra les webhooks
    url = Column(String(500), nullable=False)
    
    # Secret partagé pour signer les webhooks (sécurité)
    # Le système distant peut vérifier que le webhook vient bien de vous
    secret = Column(String(100), nullable=False)
    
    # Quels types d'événements doivent déclencher ce webhook ?
    # Liste des EventType auxquels ce webhook est abonné
    # Par exemple : ["order.created", "order.paid", "order.shipped"]
    events = Column(JSONB, nullable=False)
    
    # Actif ou désactivé
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Configuration HTTP
    http_method = Column(String(10), nullable=False, default="POST")  # POST, PUT, etc.
    headers = Column(JSONB, nullable=True)  # Headers HTTP personnalisés
    timeout_seconds = Column(Integer, nullable=False, default=30)  # Timeout pour la requête
    
    # Gestion des échecs
    max_retries = Column(Integer, nullable=False, default=3)  # Nombre de tentatives en cas d'échec
    retry_delay_seconds = Column(Integer, nullable=False, default=60)  # Délai entre les tentatives
    
    # Statistiques d'utilisation
    last_triggered_at = Column(DateTime, nullable=True)  # Dernière fois que le webhook a été appelé
    total_deliveries = Column(Integer, nullable=False, default=0)  # Nombre total d'appels
    successful_deliveries = Column(Integer, nullable=False, default=0)  # Nombre de succès
    failed_deliveries = Column(Integer, nullable=False, default=0)  # Nombre d'échecs
    
    # Métadonnées
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relations
    creator = relationship("User", foreign_keys=[created_by])
    deliveries = relationship("WebhookDelivery", back_populates="endpoint", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<WebhookEndpoint {self.name} url={self.url}>"


class WebhookDelivery(Base):
    """
    Historique d'une livraison de webhook.
    
    Chaque fois qu'un webhook est déclenché, on enregistre ici tous les détails :
    - Quel événement a déclenché le webhook
    - Quel endpoint a reçu la notification
    - La requête HTTP envoyée (headers, body)
    - La réponse reçue (code de statut, body)
    - Le temps de réponse
    - Les erreurs éventuelles
    
    Cela permet de :
    - Déboguer les problèmes de webhooks
    - Voir pourquoi un webhook a échoué
    - Réessayer manuellement un webhook
    - Générer des statistiques de fiabilité
    """
    __tablename__ = "webhook_deliveries"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relations
    webhook_endpoint_id = Column(Integer, ForeignKey("webhook_endpoints.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    
    # Requête HTTP
    request_headers = Column(JSONB, nullable=True)
    request_body = Column(Text, nullable=True)
    
    # Réponse HTTP
    response_status_code = Column(Integer, nullable=True)
    response_headers = Column(JSONB, nullable=True)
    response_body = Column(Text, nullable=True)
    response_time_ms = Column(Integer, nullable=True)  # Temps de réponse en millisecondes
    
    # Résultat
    success = Column(Boolean, nullable=False, default=False, index=True)
    error_message = Column(Text, nullable=True)
    
    # Tentatives
    attempt_number = Column(Integer, nullable=False, default=1)  # Numéro de tentative (1, 2, 3...)
    
    # Horodatage
    delivered_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)
    
    # Relations
    endpoint = relationship("WebhookEndpoint", back_populates="deliveries")
    event = relationship("Event", back_populates="webhook_deliveries")
    
    # Index pour retrouver les échecs rapidement
    __table_args__ = (
        Index('ix_webhook_deliveries_failed', 'success', 'delivered_at'),
    )
    
    def __repr__(self):
        status = "success" if self.success else "failed"
        return f"<WebhookDelivery endpoint={self.webhook_endpoint_id} status={status}>"


class ScheduledTask(Base):
    """
    Tâche planifiée qui s'exécute automatiquement selon un planning.
    
    Les tâches planifiées sont des actions qui doivent se répéter régulièrement,
    comme une alarme qui sonne à la même heure chaque jour. Par exemple :
    - Nettoyer les vieilles sessions tous les jours à 3h du matin
    - Envoyer un rapport hebdomadaire tous les lundis à 9h
    - Sauvegarder la base de données toutes les 6 heures
    - Calculer les statistiques mensuelles le 1er de chaque mois
    
    C'est comme avoir un assistant qui fait certaines tâches répétitives à votre place,
    exactement quand vous le souhaitez, sans que vous ayez à y penser.
    """
    __tablename__ = "scheduled_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Informations de base
    name = Column(String(100), nullable=False, unique=True)  # Nom unique de la tâche
    description = Column(Text, nullable=True)
    
    # Type de tâche (utilise l'énumération TaskType)
    type = Column(SQLEnum(TaskType), nullable=False, index=True)
    
    # Planning d'exécution (format Cron)
    # Exemples de Cron :
    # "0 3 * * *"     = Tous les jours à 3h du matin
    # "0 9 * * 1"     = Tous les lundis à 9h
    # "0 */6 * * *"   = Toutes les 6 heures
    # "0 0 1 * *"     = Le 1er de chaque mois à minuit
    schedule = Column(String(100), nullable=False)
    
    # Statut actuel
    status = Column(SQLEnum(TaskStatus), nullable=False, default=TaskStatus.PENDING, index=True)
    
    # Actif ou désactivé
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Historique d'exécution
    last_run_at = Column(DateTime, nullable=True, index=True)  # Dernière exécution
    next_run_at = Column(DateTime, nullable=True, index=True)  # Prochaine exécution planifiée
    
    # Résultat de la dernière exécution
    last_result = Column(Text, nullable=True)  # Message de succès ou d'erreur
    last_duration_seconds = Column(Integer, nullable=True)  # Durée de la dernière exécution
    
    # Statistiques
    total_runs = Column(Integer, nullable=False, default=0)
    successful_runs = Column(Integer, nullable=False, default=0)
    failed_runs = Column(Integer, nullable=False, default=0)
    
    # Configuration de la tâche
    # Paramètres spécifiques à chaque type de tâche (format JSON)
    # Par exemple, pour une tâche de nettoyage : {"days_to_keep": 30, "batch_size": 1000}
    config = Column(JSONB, nullable=True)
    
    # Timeout et gestion des erreurs
    timeout_seconds = Column(Integer, nullable=False, default=300)  # 5 minutes par défaut
    max_retries = Column(Integer, nullable=False, default=3)
    
    # Notifications
    notify_on_failure = Column(Boolean, nullable=False, default=True)
    notify_email = Column(String(255), nullable=True)  # Email à notifier en cas d'échec
    
    # Métadonnées
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relations
    creator = relationship("User", foreign_keys=[created_by])
    executions = relationship("TaskExecution", back_populates="task", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ScheduledTask {self.name} schedule={self.schedule} status={self.status}>"


class TaskExecution(Base):
    """
    Historique d'exécution d'une tâche planifiée.
    
    Chaque fois qu'une tâche planifiée s'exécute, on enregistre tous les détails :
    - Quand elle a commencé et terminé
    - Combien de temps elle a pris
    - Si elle a réussi ou échoué
    - Les logs et messages générés
    - Les erreurs éventuelles
    
    C'est comme un journal de bord qui enregistre chaque fois que votre assistant
    automatique fait son travail, avec tous les détails pour comprendre ce qui s'est passé.
    """
    __tablename__ = "task_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relation avec la tâche
    task_id = Column(Integer, ForeignKey("scheduled_tasks.id", ondelete="CASCADE"), nullable=False)
    
    # Timing
    started_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    
    # Résultat
    status = Column(SQLEnum(TaskStatus), nullable=False, default=TaskStatus.RUNNING, index=True)
    success = Column(Boolean, nullable=True, index=True)  # NULL pendant l'exécution
    
    # Logs et résultats
    output = Column(Text, nullable=True)  # Sortie standard de la tâche
    error = Column(Text, nullable=True)  # Message d'erreur si échec
    
    # Statistiques
    rows_processed = Column(Integer, nullable=True)  # Nombre d'éléments traités (si applicable)
    
    # Tentative
    attempt_number = Column(Integer, nullable=False, default=1)
    
    # Relations
    task = relationship("ScheduledTask", back_populates="executions")
    
    # Index pour retrouver les exécutions récentes ou échouées
    __table_args__ = (
        Index('ix_task_executions_recent', 'task_id', 'started_at'),
    )
    
    def __repr__(self):
        return f"<TaskExecution task={self.task_id} status={self.status}>"


# ============ RELATIONS À AJOUTER DANS LES MODÈLES EXISTANTS ============

"""
À ajouter dans models/user.py, classe User:

# Relations pour les événements et automatisation
# (Aucune relation directe nécessaire pour l'instant, mais on garde la structure)
"""