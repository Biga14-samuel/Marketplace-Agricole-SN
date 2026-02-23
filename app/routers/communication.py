from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core import deps
from app.core.database import get_db
from app.models.auth import User
from app.schemas.communication import (
    NotificationCreate, NotificationResponse, NotificationListResponse,
    NotificationPreferenceCreate, NotificationPreferenceUpdate, NotificationPreferenceResponse,
    EmailTemplateCreate, EmailTemplateUpdate, EmailTemplateResponse,
    EmailLogResponse, ConversationCreate, ConversationResponse, ConversationWithLastMessage,
    MessageCreate, MessageResponse, SupportTicketCreate, SupportTicketUpdate,
    SupportTicketResponse, SupportTicketWithMessages, TicketMessageCreate, TicketMessageResponse,
    SendEmailRequest, BulkNotificationCreate
)
from app.services.communication_service import (
    NotificationService, NotificationPreferenceService, EmailTemplateService,
    EmailService, ConversationService, SupportTicketService
)
from app.models.communication import TicketStatus


router = APIRouter(prefix="", tags=["communication"])


# ============================================================================
# DÉPENDANCES
# ============================================================================
# Les dépendances d'authentification sont maintenant dans app.core.deps


# ============================================================================
# ROUTES NOTIFICATIONS
# ============================================================================

@router.get("/notifications", response_model=NotificationListResponse)
def get_my_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les notifications de l'utilisateur connecté.
    
    Paramètres :
    - skip : Nombre de notifications à ignorer (pagination)
    - limit : Nombre maximum de notifications à retourner
    - unread_only : Si True, ne retourne que les notifications non lues
    """
    service = NotificationService(db)
    return service.get_user_notifications(current_user.id, skip, limit, unread_only)


@router.post("/notifications", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Crée une nouvelle notification (réservé aux admins).
    """
    service = NotificationService(db)
    return service.create_notification(notification)


@router.post("/notifications/bulk", response_model=List[NotificationResponse])
def create_bulk_notifications(
    bulk_data: BulkNotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Crée des notifications pour plusieurs utilisateurs en une seule fois.
    Utile pour les notifications de masse (nouvelles promotions, etc.).
    """
    service = NotificationService(db)
    return service.create_bulk_notifications(bulk_data)


@router.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Marque une notification comme lue.
    """
    service = NotificationService(db)
    return service.mark_notification_as_read(notification_id, current_user.id)


@router.post("/notifications/mark-all-read")
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Marque toutes les notifications de l'utilisateur comme lues.
    """
    service = NotificationService(db)
    return service.mark_all_as_read(current_user.id)


@router.delete("/notifications/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Supprime une notification.
    """
    service = NotificationService(db)
    return service.delete_notification(notification_id, current_user.id)


# ============================================================================
# ROUTES PRÉFÉRENCES DE NOTIFICATION
# ============================================================================

@router.get("/preferences", response_model=List[NotificationPreferenceResponse])
def get_notification_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les préférences de notification de l'utilisateur.
    """
    service = NotificationPreferenceService(db)
    return service.get_user_preferences(current_user.id)


@router.post("/preferences", response_model=NotificationPreferenceResponse)
def create_or_update_preference(
    preference: NotificationPreferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Crée ou met à jour une préférence de notification.
    """
    service = NotificationPreferenceService(db)
    return service.create_or_update_preference(current_user.id, preference)


@router.patch("/preferences/{preference_id}", response_model=NotificationPreferenceResponse)
def update_preference(
    preference_id: int,
    update_data: NotificationPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met à jour une préférence de notification existante.
    """
    service = NotificationPreferenceService(db)
    return service.update_preference(preference_id, current_user.id, update_data)


# ============================================================================
# ROUTES EMAIL TEMPLATES (Admin uniquement)
# ============================================================================

@router.get("/email-templates", response_model=List[EmailTemplateResponse])
def get_all_email_templates(
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Récupère tous les templates d'emails.
    """
    service = EmailTemplateService(db)
    return service.get_all_templates(active_only)


@router.post("/email-templates", response_model=EmailTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_email_template(
    template: EmailTemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Crée un nouveau template d'email.
    """
    service = EmailTemplateService(db)
    return service.create_template(template)


@router.get("/email-templates/{template_id}", response_model=EmailTemplateResponse)
def get_email_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Récupère un template d'email par son ID.
    """
    service = EmailTemplateService(db)
    return service.get_template(template_id)


@router.patch("/email-templates/{template_id}", response_model=EmailTemplateResponse)
def update_email_template(
    template_id: int,
    update_data: EmailTemplateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Met à jour un template d'email.
    """
    service = EmailTemplateService(db)
    return service.update_template(template_id, update_data)


@router.delete("/email-templates/{template_id}")
def delete_email_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Supprime un template d'email.
    """
    service = EmailTemplateService(db)
    return service.delete_template(template_id)


# ============================================================================
# ROUTES EMAILS
# ============================================================================

@router.post("/emails/send")
def send_email(
    email_request: SendEmailRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Envoie un email en utilisant un template.
    """
    service = EmailService(db)
    return service.send_email(email_request)


@router.get("/emails/logs", response_model=List[EmailLogResponse])
def get_email_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère l'historique des emails de l'utilisateur.
    """
    service = EmailService(db)
    return service.get_user_email_logs(current_user.id, skip, limit)


# ============================================================================
# ROUTES CONVERSATIONS
# ============================================================================

@router.get("/conversations", response_model=List[ConversationWithLastMessage])
def get_my_conversations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les conversations de l'utilisateur.
    """
    service = ConversationService(db)
    return service.get_user_conversations(current_user.id, skip, limit)


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Crée une nouvelle conversation.
    L'utilisateur actuel doit être dans la liste des participants.
    """
    if current_user.id not in conversation.participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous devez être inclus dans les participants"
        )
    
    service = ConversationService(db)
    return service.create_conversation(conversation)


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère une conversation spécifique.
    """
    service = ConversationService(db)
    return service.get_conversation(conversation_id, current_user.id)


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les messages d'une conversation.
    """
    service = ConversationService(db)
    return service.get_conversation_messages(conversation_id, current_user.id, skip, limit)


@router.post("/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Envoie un message dans une conversation.
    """
    service = ConversationService(db)
    return service.send_message(message, current_user.id)


@router.patch("/messages/{message_id}/read", response_model=MessageResponse)
def mark_message_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Marque un message comme lu.
    """
    service = ConversationService(db)
    return service.mark_message_as_read(message_id, current_user.id)


# ============================================================================
# ROUTES SUPPORT TICKETS
# ============================================================================

@router.get("/tickets", response_model=List[SupportTicketResponse])
def get_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status_filter: Optional[TicketStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les tickets de support.
    - Utilisateurs normaux : leurs propres tickets
    - Admins : tous les tickets (avec filtre optionnel par statut)
    """
    service = SupportTicketService(db)
    
    if current_user.has_role("admin") or current_user.has_role("superadmin"):
        return service.get_all_tickets(status_filter, skip, limit)
    else:
        return service.get_user_tickets(current_user.id, skip, limit)


@router.post("/tickets", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Crée un nouveau ticket de support.
    """
    service = SupportTicketService(db)
    return service.create_ticket(ticket, current_user.id)


@router.get("/tickets/{ticket_id}", response_model=SupportTicketWithMessages)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère un ticket spécifique avec tous ses messages.
    """
    service = SupportTicketService(db)
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    result = service.get_ticket(ticket_id, current_user.id, is_admin_user)
    
    return {
        **result["ticket"].__dict__,
        "messages": result["messages"]
    }


@router.patch("/tickets/{ticket_id}", response_model=SupportTicketResponse)
def update_ticket(
    ticket_id: int,
    update_data: SupportTicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met à jour un ticket de support (réservé aux admins).
    """
    service = SupportTicketService(db)
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    return service.update_ticket(ticket_id, update_data, current_user.id, is_admin_user)


@router.post("/tickets/messages", response_model=TicketMessageResponse, status_code=status.HTTP_201_CREATED)
def add_ticket_message(
    message: TicketMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Ajoute un message à un ticket de support.
    """
    service = SupportTicketService(db)
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    return service.add_ticket_message(message, current_user.id, is_admin_user)