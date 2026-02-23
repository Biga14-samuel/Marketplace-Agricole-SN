from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


# ============================================================================
# Définition des types et statuts possibles
# ============================================================================

class NotificationType(str, enum.Enum):
    """
    Types de notifications système.
    Permet de catégoriser les notifications pour un filtrage et affichage adapté.
    """
    ORDER = "order"  # Notifications liées aux commandes
    PROMO = "promo"  # Notifications promotionnelles
    STOCK = "stock"  # Alertes de disponibilité de stock
    MESSAGE = "message"  # Nouveaux messages
    REVIEW = "review"  # Nouveaux avis ou réponses
    SYSTEM = "system"  # Notifications système importantes


class NotificationChannel(str, enum.Enum):
    """
    Canaux de communication disponibles.
    Les utilisateurs peuvent choisir comment ils veulent être notifiés.
    """
    EMAIL = "email"  # Notification par email
    SMS = "sms"  # Notification par SMS
    PUSH = "push"  # Notification push (application mobile/navigateur)
    IN_APP = "in_app"  # Notification dans l'application


class EmailStatus(str, enum.Enum):
    """
    Statuts d'envoi d'email.
    Permet de suivre le cycle de vie d'un email envoyé.
    """
    PENDING = "pending"  # En attente d'envoi
    SENT = "sent"  # Envoyé avec succès
    FAILED = "failed"  # Échec d'envoi
    BOUNCED = "bounced"  # Email rejeté (adresse invalide)
    OPENED = "opened"  # Email ouvert par le destinataire


class TicketCategory(str, enum.Enum):
    """
    Catégories de tickets support.
    Aide à router les tickets vers les bonnes équipes.
    """
    TECHNICAL = "technical"  # Problème technique
    PAYMENT = "payment"  # Question de paiement
    PRODUCT = "product"  # Question sur un produit
    DELIVERY = "delivery"  # Problème de livraison
    ACCOUNT = "account"  # Question sur le compte
    OTHER = "other"  # Autre question


class TicketPriority(str, enum.Enum):
    """
    Niveaux de priorité des tickets.
    Détermine l'ordre de traitement.
    """
    LOW = "low"  # Priorité basse
    MEDIUM = "medium"  # Priorité moyenne
    HIGH = "high"  # Priorité haute
    URGENT = "urgent"  # Urgent


class TicketStatus(str, enum.Enum):
    """
    Statuts des tickets support.
    Suit le cycle de vie d'une demande de support.
    """
    OPEN = "open"  # Ouvert, en attente de traitement
    IN_PROGRESS = "in_progress"  # En cours de traitement
    WAITING_CUSTOMER = "waiting_customer"  # En attente de réponse du client
    RESOLVED = "resolved"  # Résolu
    CLOSED = "closed"  # Fermé


# ============================================================================
# MODÈLE NOTIFICATION : Notifications système
# ============================================================================

class Notification(Base):
    """
    Représente une notification envoyée à un utilisateur dans l'application.
    
    Les notifications gardent les utilisateurs informés des événements importants :
    nouvelle commande, promotion, message, etc. Elles restent accessibles dans
    l'interface jusqu'à ce que l'utilisateur les marque comme lues.
    """
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    
    # Utilisateur destinataire
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Type et contenu de la notification
    type = Column(SQLEnum(NotificationType), nullable=False, index=True)
    title = Column(String(200), nullable=False)  # Titre court et accrocheur
    message = Column(Text, nullable=False)  # Message détaillé
    
    # Lien optionnel vers une ressource (commande, produit, etc.)
    # Exemple : "/orders/123" ou "/products/456"
    link = Column(String(500), nullable=True)
    
    # Statut de lecture
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    read_at = Column(DateTime, nullable=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    user = relationship("User", backref="notifications")

    def __repr__(self):
        return f"<Notification(id={self.id}, type={self.type}, user_id={self.user_id}, read={self.is_read})>"


# ============================================================================
# MODÈLE NOTIFICATIONPREFERENCE : Préférences de notification
# ============================================================================

class NotificationPreference(Base):
    """
    Stocke les préférences de notification de chaque utilisateur.
    
    Permet aux utilisateurs de contrôler comment et quand ils veulent
    recevoir des notifications. Par exemple, recevoir les notifications
    de commande par email mais pas les promotions par SMS.
    """
    __tablename__ = "notification_preferences"

    id = Column(Integer, primary_key=True, index=True)
    
    # Utilisateur concerné
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Canal et type de notification
    channel = Column(SQLEnum(NotificationChannel), nullable=False)
    type = Column(SQLEnum(NotificationType), nullable=False)
    
    # Activation
    is_enabled = Column(Boolean, default=True, nullable=False)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = relationship("User", backref="notification_preferences")

    def __repr__(self):
        return f"<NotificationPreference(user_id={self.user_id}, channel={self.channel}, type={self.type}, enabled={self.is_enabled})>"


# ============================================================================
# MODÈLE EMAILTEMPLATE : Templates d'emails
# ============================================================================

class EmailTemplate(Base):
    """
    Définit les templates d'emails utilisés par la plateforme.
    
    Les templates permettent d'envoyer des emails cohérents et personnalisés
    en utilisant des variables dynamiques. Par exemple, un template de
    confirmation de commande avec {{order_number}} et {{customer_name}}.
    """
    __tablename__ = "email_templates"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identification du template
    name = Column(String(100), unique=True, nullable=False, index=True)  # Nom unique (ex: "order_confirmation")
    
    # Contenu du template
    subject = Column(String(200), nullable=False)  # Sujet de l'email
    body = Column(Text, nullable=False)  # Corps de l'email en HTML
    
    # Variables disponibles (stockées en JSON)
    # Exemple : ["order_number", "customer_name", "total_amount"]
    variables = Column(JSON, nullable=True)
    
    # Activation
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    email_logs = relationship("EmailLog", back_populates="template", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<EmailTemplate(id={self.id}, name='{self.name}', active={self.is_active})>"


# ============================================================================
# MODÈLE EMAILLOG : Historique des emails envoyés
# ============================================================================

class EmailLog(Base):
    """
    Enregistre chaque email envoyé par la plateforme.
    
    Permet de tracer tous les emails envoyés, suivre leur statut de livraison,
    et savoir s'ils ont été ouverts. Essentiel pour le debugging et les statistiques.
    """
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    template_id = Column(Integer, ForeignKey("email_templates.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Détails de l'email
    recipient = Column(String(255), nullable=False)  # Adresse email du destinataire
    subject = Column(String(200), nullable=False)
    
    # Statut
    status = Column(SQLEnum(EmailStatus), default=EmailStatus.PENDING, nullable=False, index=True)
    
    # Raison d'échec (si applicable)
    error_message = Column(Text, nullable=True)
    
    # Horodatage
    sent_at = Column(DateTime, nullable=True)  # Quand l'email a été envoyé
    opened_at = Column(DateTime, nullable=True)  # Quand l'email a été ouvert
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    user = relationship("User", backref="email_logs")
    template = relationship("EmailTemplate", back_populates="email_logs")

    def __repr__(self):
        return f"<EmailLog(id={self.id}, recipient='{self.recipient}', status={self.status})>"


# ============================================================================
# MODÈLE CONVERSATION : Fil de discussion
# ============================================================================

class Conversation(Base):
    """
    Représente une conversation entre plusieurs utilisateurs.
    
    Une conversation peut être un échange client-producteur ou une discussion
    de groupe. Elle regroupe tous les messages échangés et garde trace du
    dernier message pour un tri facile.
    """
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    
    # Participants (stockés en JSON comme liste d'IDs)
    # Exemple : [123, 456] pour une conversation entre les utilisateurs 123 et 456
    participants = Column(JSON, nullable=False)
    
    # Sujet de la conversation
    subject = Column(String(200), nullable=True)
    
    # Métadonnées
    last_message_at = Column(DateTime, nullable=True, index=True)  # Pour trier les conversations
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.sent_at.desc()")

    def __repr__(self):
        return f"<Conversation(id={self.id}, participants={self.participants}, last_message={self.last_message_at})>"


# ============================================================================
# MODÈLE MESSAGE : Message dans une conversation
# ============================================================================

class Message(Base):
    """
    Représente un message individuel dans une conversation.
    
    Chaque message contient le texte, des pièces jointes optionnelles,
    et suit son statut de lecture pour chaque participant.
    """
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Contenu du message
    content = Column(Text, nullable=False)
    
    # Pièces jointes (URLs stockées en JSON)
    # Exemple : ["https://cdn.example.com/file1.pdf", "https://cdn.example.com/image.jpg"]
    attachments = Column(JSON, nullable=True)
    
    # Statut de lecture
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    read_at = Column(DateTime, nullable=True)
    
    # Horodatage
    sent_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_messages")

    def __repr__(self):
        return f"<Message(id={self.id}, conversation_id={self.conversation_id}, sender_id={self.sender_id}, read={self.is_read})>"


# ============================================================================
# MODÈLE SUPPORTTICKET : Ticket de support client
# ============================================================================

class SupportTicket(Base):
    """
    Représente un ticket de support ouvert par un utilisateur.
    
    Les tickets permettent de gérer les demandes d'aide de manière structurée,
    avec catégorisation, priorisation, et assignation aux agents de support.
    C'est le point central du système de support client.
    """
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    
    # Utilisateur demandeur
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Contenu du ticket
    subject = Column(String(200), nullable=False)  # Sujet du problème
    
    # Catégorisation et priorisation
    category = Column(SQLEnum(TicketCategory), nullable=False, index=True)
    priority = Column(SQLEnum(TicketPriority), default=TicketPriority.MEDIUM, nullable=False, index=True)
    
    # Statut
    status = Column(SQLEnum(TicketStatus), default=TicketStatus.OPEN, nullable=False, index=True)
    
    # Assignation (agent de support qui traite le ticket)
    assigned_to = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)  # Quand le ticket a été résolu
    closed_at = Column(DateTime, nullable=True)  # Quand le ticket a été fermé
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = relationship("User", foreign_keys=[user_id], backref="support_tickets")
    assigned_agent = relationship("User", foreign_keys=[assigned_to], backref="assigned_tickets")
    messages = relationship("TicketMessage", back_populates="ticket", cascade="all, delete-orphan", order_by="TicketMessage.created_at.asc()")

    def __repr__(self):
        return f"<SupportTicket(id={self.id}, subject='{self.subject}', status={self.status}, priority={self.priority})>"


# ============================================================================
# MODÈLE TICKETMESSAGE : Réponse dans un ticket support
# ============================================================================

class TicketMessage(Base):
    """
    Représente un message échangé dans le contexte d'un ticket support.
    
    Permet la communication entre le client et l'équipe de support.
    Chaque message peut contenir des pièces jointes pour partager des
    captures d'écran, documents, etc.
    """
    __tablename__ = "ticket_messages"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références
    ticket_id = Column(Integer, ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Contenu
    message = Column(Text, nullable=False)
    
    # Pièces jointes (URLs stockées en JSON)
    attachments = Column(JSON, nullable=True)
    
    # Indicateur si c'est une réponse interne (visible uniquement par le support)
    is_internal = Column(Boolean, default=False, nullable=False)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    ticket = relationship("SupportTicket", back_populates="messages")
    user = relationship("User", foreign_keys=[user_id], backref="ticket_messages")

    def __repr__(self):
        return f"<TicketMessage(id={self.id}, ticket_id={self.ticket_id}, user_id={self.user_id})>"