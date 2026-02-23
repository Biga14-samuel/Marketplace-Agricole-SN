from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.communication import (
    NotificationType, NotificationChannel, EmailStatus,
    TicketCategory, TicketPriority, TicketStatus
)


# ============================================================================
# SCHÉMAS NOTIFICATION
# ============================================================================

class NotificationBase(BaseModel):
    """Schéma de base pour les notifications"""
    type: NotificationType
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)
    link: Optional[str] = Field(None, max_length=500)


class NotificationCreate(NotificationBase):
    """Schéma pour créer une notification"""
    user_id: int


class NotificationUpdate(BaseModel):
    """Schéma pour mettre à jour une notification"""
    is_read: Optional[bool] = None


class NotificationResponse(NotificationBase):
    """Schéma de réponse pour une notification"""
    id: int
    user_id: int
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime

    model_config= ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    """Schéma de réponse pour une liste de notifications avec pagination"""
    notifications: List[NotificationResponse]
    total: int
    unread_count: int


# ============================================================================
# SCHÉMAS NOTIFICATIONPREFERENCE
# ============================================================================

class NotificationPreferenceBase(BaseModel):
    """Schéma de base pour les préférences de notification"""
    channel: NotificationChannel
    type: NotificationType
    is_enabled: bool = True


class NotificationPreferenceCreate(NotificationPreferenceBase):
    """Schéma pour créer une préférence de notification"""
    pass


class NotificationPreferenceUpdate(BaseModel):
    """Schéma pour mettre à jour une préférence"""
    is_enabled: bool


class NotificationPreferenceResponse(NotificationPreferenceBase):
    """Schéma de réponse pour une préférence"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS EMAILTEMPLATE
# ============================================================================

class EmailTemplateBase(BaseModel):
    """Schéma de base pour les templates d'email"""
    name: str = Field(..., min_length=1, max_length=100)
    subject: str = Field(..., min_length=1, max_length=200)
    body: str = Field(..., min_length=1)
    variables: Optional[List[str]] = None
    is_active: bool = True


class EmailTemplateCreate(EmailTemplateBase):
    """Schéma pour créer un template d'email"""
    pass


class EmailTemplateUpdate(BaseModel):
    """Schéma pour mettre à jour un template"""
    subject: Optional[str] = Field(None, min_length=1, max_length=200)
    body: Optional[str] = Field(None, min_length=1)
    variables: Optional[List[str]] = None
    is_active: Optional[bool] = None


class EmailTemplateResponse(EmailTemplateBase):
    """Schéma de réponse pour un template"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS EMAILLOG
# ============================================================================

class EmailLogCreate(BaseModel):
    """Schéma pour créer un log d'email"""
    user_id: Optional[int] = None
    template_id: Optional[int] = None
    recipient: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)


class EmailLogResponse(BaseModel):
    """Schéma de réponse pour un log d'email"""
    id: int
    user_id: Optional[int] = None
    template_id: Optional[int] = None
    recipient: str
    subject: str
    status: EmailStatus
    error_message: Optional[str] = None
    sent_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS CONVERSATION
# ============================================================================

class ConversationBase(BaseModel):
    """Schéma de base pour les conversations"""
    subject: Optional[str] = Field(None, max_length=200)


class ConversationCreate(ConversationBase):
    """Schéma pour créer une conversation"""
    participants: List[int] = Field(..., min_length=2)

    @field_validator('participants')
    @classmethod
    def validate_participants(cls, v):
        """Valide qu'il y a au moins 2 participants et pas de doublons"""
        if len(v) < 2:
            raise ValueError("Une conversation doit avoir au moins 2 participants")
        if len(v) != len(set(v)):
            raise ValueError("Les participants doivent être uniques")
        return v


class ConversationResponse(ConversationBase):
    """Schéma de réponse pour une conversation"""
    id: int
    participants: List[int]
    last_message_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationWithLastMessage(ConversationResponse):
    """Schéma de conversation avec le dernier message"""
    last_message: Optional[str] = None
    unread_count: int = 0


# ============================================================================
# SCHÉMAS MESSAGE
# ============================================================================

class MessageBase(BaseModel):
    """Schéma de base pour les messages"""
    content: str = Field(..., min_length=1)
    attachments: Optional[List[str]] = None


class MessageCreate(MessageBase):
    """Schéma pour créer un message"""
    conversation_id: int


class MessageResponse(MessageBase):
    """Schéma de réponse pour un message"""
    id: int
    conversation_id: int
    sender_id: Optional[int] = None
    is_read: bool
    read_at: Optional[datetime] = None
    sent_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageUpdate(BaseModel):
    """Schéma pour mettre à jour un message"""
    is_read: bool


# ============================================================================
# SCHÉMAS SUPPORTTICKET
# ============================================================================

class SupportTicketBase(BaseModel):
    """Schéma de base pour les tickets de support"""
    subject: str = Field(..., min_length=1, max_length=200)
    category: TicketCategory
    priority: TicketPriority = TicketPriority.MEDIUM


class SupportTicketCreate(SupportTicketBase):
    """Schéma pour créer un ticket de support"""
    initial_message: str = Field(..., min_length=1)
    attachments: Optional[List[str]] = None


class SupportTicketUpdate(BaseModel):
    """Schéma pour mettre à jour un ticket"""
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to: Optional[int] = None


class SupportTicketResponse(SupportTicketBase):
    """Schéma de réponse pour un ticket"""
    id: int
    user_id: Optional[int] = None
    status: TicketStatus
    assigned_to: Optional[int] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SupportTicketWithMessages(SupportTicketResponse):
    """Schéma de ticket avec ses messages"""
    messages: List['TicketMessageResponse'] = []


# ============================================================================
# SCHÉMAS TICKETMESSAGE
# ============================================================================

class TicketMessageBase(BaseModel):
    """Schéma de base pour les messages de ticket"""
    message: str = Field(..., min_length=1)
    attachments: Optional[List[str]] = None
    is_internal: bool = False


class TicketMessageCreate(TicketMessageBase):
    """Schéma pour créer un message de ticket"""
    ticket_id: int


class TicketMessageResponse(TicketMessageBase):
    """Schéma de réponse pour un message de ticket"""
    id: int
    ticket_id: int
    user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS COMBINÉS ET UTILITAIRES
# ============================================================================

class SendEmailRequest(BaseModel):
    """Schéma pour envoyer un email via un template"""
    template_name: str
    recipient: EmailStr
    variables: dict = {}


class BulkNotificationCreate(BaseModel):
    """Schéma pour créer des notifications en masse"""
    user_ids: List[int] = Field(..., min_length=1)
    type: NotificationType
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)
    link: Optional[str] = Field(None, max_length=500)


class NotificationStats(BaseModel):
    """Statistiques des notifications"""
    total: int
    unread: int
    by_type: dict


class TicketStats(BaseModel):
    """Statistiques des tickets de support"""
    total: int
    open: int
    in_progress: int
    resolved: int
    closed: int
    by_category: dict
    by_priority: dict
    average_resolution_time: Optional[float] = None  # En heures


# Mise à jour de la forward reference pour éviter les erreurs circulaires
SupportTicketWithMessages.model_rebuild()