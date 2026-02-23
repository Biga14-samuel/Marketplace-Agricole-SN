from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, Dict

from app.repositories.communication_repository import (
    NotificationRepository, NotificationPreferenceRepository,
    EmailTemplateRepository, EmailLogRepository, ConversationRepository,
    MessageRepository, SupportTicketRepository, TicketMessageRepository
)
from app.schemas.communication import (
    NotificationCreate, NotificationPreferenceCreate,
    NotificationPreferenceUpdate, EmailTemplateCreate, EmailTemplateUpdate,
    ConversationCreate, MessageCreate, SupportTicketCreate, SupportTicketUpdate,
    TicketMessageCreate, SendEmailRequest, BulkNotificationCreate
)
from app.models.communication import (
    EmailStatus, TicketStatus
)


# ============================================================================
# SERVICE NOTIFICATION
# ============================================================================

class NotificationService:
    """Service pour gérer les notifications utilisateur"""
    
    def __init__(self, db: Session):
        self.repository = NotificationRepository(db)
        self.preference_repo = NotificationPreferenceRepository(db)
    
    def create_notification(self, notification_data: NotificationCreate):
        """Crée une nouvelle notification"""
        return self.repository.create(
            user_id=notification_data.user_id,
            type=notification_data.type,
            title=notification_data.title,
            message=notification_data.message,
            link=notification_data.link
        )
    
    def create_bulk_notifications(self, bulk_data: BulkNotificationCreate):
        """Crée des notifications pour plusieurs utilisateurs"""
        notifications = []
        for user_id in bulk_data.user_ids:
            notification = self.repository.create(
                user_id=user_id,
                type=bulk_data.type,
                title=bulk_data.title,
                message=bulk_data.message,
                link=bulk_data.link
            )
            notifications.append(notification)
        return notifications
    
    def get_user_notifications(self, user_id: int, skip: int = 0, 
                              limit: int = 50, unread_only: bool = False):
        """Récupère les notifications d'un utilisateur avec pagination"""
        notifications = self.repository.get_user_notifications(
            user_id, skip, limit, unread_only
        )
        total = self.repository.count_user_notifications(user_id, unread_only=False)
        unread_count = self.repository.count_user_notifications(user_id, unread_only=True)
        
        return {
            "notifications": notifications,
            "total": total,
            "unread_count": unread_count
        }
    
    def mark_notification_as_read(self, notification_id: int, user_id: int):
        """Marque une notification comme lue"""
        notification = self.repository.get_by_id(notification_id)
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification non trouvée"
            )
        
        if notification.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier cette notification"
            )
        
        return self.repository.mark_as_read(notification_id)
    
    def mark_all_as_read(self, user_id: int):
        """Marque toutes les notifications d'un utilisateur comme lues"""
        count = self.repository.mark_all_as_read(user_id)
        return {"message": f"{count} notification(s) marquée(s) comme lue(s)"}
    
    def delete_notification(self, notification_id: int, user_id: int):
        """Supprime une notification"""
        notification = self.repository.get_by_id(notification_id)
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification non trouvée"
            )
        
        if notification.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à supprimer cette notification"
            )
        
        self.repository.delete(notification_id)
        return {"message": "Notification supprimée avec succès"}


# ============================================================================
# SERVICE NOTIFICATIONPREFERENCE
# ============================================================================

class NotificationPreferenceService:
    """Service pour gérer les préférences de notification"""
    
    def __init__(self, db: Session):
        self.repository = NotificationPreferenceRepository(db)
    
    def get_user_preferences(self, user_id: int):
        """Récupère toutes les préférences d'un utilisateur"""
        return self.repository.get_user_preferences(user_id)
    
    def create_or_update_preference(self, user_id: int, 
                                   preference_data: NotificationPreferenceCreate):
        """Crée ou met à jour une préférence de notification"""
        existing = self.repository.get_user_preference(
            user_id, preference_data.channel, preference_data.type
        )
        
        if existing:
            return self.repository.update(existing.id, preference_data.is_enabled)
        else:
            return self.repository.create(
                user_id=user_id,
                channel=preference_data.channel,
                type=preference_data.type,
                is_enabled=preference_data.is_enabled
            )
    
    def update_preference(self, preference_id: int, user_id: int, 
                         update_data: NotificationPreferenceUpdate):
        """Met à jour une préférence existante"""
        preference = self.repository.get_by_id(preference_id)
        
        if not preference:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Préférence non trouvée"
            )
        
        if preference.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier cette préférence"
            )
        
        return self.repository.update(preference_id, update_data.is_enabled)


# ============================================================================
# SERVICE EMAILTEMPLATE
# ============================================================================

class EmailTemplateService:
    """Service pour gérer les templates d'emails"""
    
    def __init__(self, db: Session):
        self.repository = EmailTemplateRepository(db)
    
    def create_template(self, template_data: EmailTemplateCreate):
        """Crée un nouveau template d'email"""
        # Vérifier que le nom n'existe pas déjà
        existing = self.repository.get_by_name(template_data.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un template avec ce nom existe déjà"
            )
        
        return self.repository.create(
            name=template_data.name,
            subject=template_data.subject,
            body=template_data.body,
            variables=template_data.variables,
            is_active=template_data.is_active
        )
    
    def get_template(self, template_id: int):
        """Récupère un template par son ID"""
        template = self.repository.get_by_id(template_id)
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template non trouvé"
            )
        return template
    
    def get_template_by_name(self, name: str):
        """Récupère un template par son nom"""
        template = self.repository.get_by_name(name)
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Template '{name}' non trouvé"
            )
        return template
    
    def get_all_templates(self, active_only: bool = True):
        """Récupère tous les templates"""
        return self.repository.get_all(active_only)
    
    def update_template(self, template_id: int, update_data: EmailTemplateUpdate):
        """Met à jour un template"""
        self.get_template(template_id)
        
        update_dict = update_data.model_dump(exclude_unset=True)
        return self.repository.update(template_id, **update_dict)
    
    def delete_template(self, template_id: int):
        """Supprime un template"""
        self.get_template(template_id)
        self.repository.delete(template_id)
        return {"message": "Template supprimé avec succès"}
    
    def render_template(self, template_name: str, variables: Dict) -> Dict[str, str]:
        """Rend un template avec les variables fournies"""
        template = self.get_template_by_name(template_name)
        
        if not template.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce template n'est pas actif"
            )
        
        # Remplacer les variables dans le sujet et le corps
        subject = template.subject
        body = template.body
        
        for key, value in variables.items():
            placeholder = f"{{{{{key}}}}}"  # Format: {{variable}}
            subject = subject.replace(placeholder, str(value))
            body = body.replace(placeholder, str(value))
        
        return {
            "subject": subject,
            "body": body
        }


# ============================================================================
# SERVICE EMAIL
# ============================================================================

class EmailService:
    """Service pour gérer l'envoi d'emails"""
    
    def __init__(self, db: Session):
        self.log_repo = EmailLogRepository(db)
        self.template_service = EmailTemplateService(db)
    
    def send_email(self, email_request: SendEmailRequest):
        """Envoie un email en utilisant un template"""
        # Récupérer et rendre le template
        rendered = self.template_service.render_template(
            email_request.template_name, 
            email_request.variables
        )
        
        # Créer un log d'email
        log = self.log_repo.create(
            recipient=email_request.recipient,
            subject=rendered["subject"],
            template_id=self.template_service.get_template_by_name(
                email_request.template_name
            ).id
        )
        
        # TODO: Intégrer avec un vrai service d'envoi d'emails (SendGrid, AWS SES, etc.)
        # Pour l'instant, on simule un envoi réussi
        try:
            # Simulation d'envoi
            print(f"Envoi email à {email_request.recipient}")
            print(f"Sujet: {rendered['subject']}")
            print(f"Corps: {rendered['body'][:100]}...")
            
            # Marquer comme envoyé
            self.log_repo.update_status(log.id, EmailStatus.SENT)
            
            return {
                "message": "Email envoyé avec succès",
                "log_id": log.id
            }
        except Exception as e:
            # En cas d'erreur, marquer comme échoué
            self.log_repo.update_status(log.id, EmailStatus.FAILED, str(e))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de l'envoi de l'email: {str(e)}"
            )
    
    def get_user_email_logs(self, user_id: int, skip: int = 0, limit: int = 50):
        """Récupère l'historique des emails d'un utilisateur"""
        return self.log_repo.get_user_emails(user_id, skip, limit)


# ============================================================================
# SERVICE CONVERSATION
# ============================================================================

class ConversationService:
    """Service pour gérer les conversations"""
    
    def __init__(self, db: Session):
        self.conversation_repo = ConversationRepository(db)
        self.message_repo = MessageRepository(db)
    
    def create_conversation(self, conversation_data: ConversationCreate):
        """Crée une nouvelle conversation ou retourne une existante"""
        # Si c'est une conversation à 2, vérifier si elle existe déjà
        if len(conversation_data.participants) == 2:
            existing = self.conversation_repo.find_conversation(
                conversation_data.participants[0],
                conversation_data.participants[1]
            )
            if existing:
                return existing
        
        return self.conversation_repo.create(
            participants=conversation_data.participants,
            subject=conversation_data.subject
        )
    
    def get_user_conversations(self, user_id: int, skip: int = 0, limit: int = 50):
        """Récupère les conversations d'un utilisateur"""
        conversations = self.conversation_repo.get_user_conversations(user_id, skip, limit)
        
        # Ajouter des informations supplémentaires pour chaque conversation
        result = []
        for conv in conversations:
            messages = self.message_repo.get_conversation_messages(conv.id, limit=1)
            unread = self.message_repo.count_unread_messages(conv.id, user_id)
            
            result.append({
                "id": conv.id,
                "participants": conv.participants,
                "subject": conv.subject,
                "last_message_at": conv.last_message_at,
                "created_at": conv.created_at,
                "last_message": messages[0].content if messages else None,
                "unread_count": unread
            })
        
        return result
    
    def get_conversation(self, conversation_id: int, user_id: int):
        """Récupère une conversation spécifique"""
        conversation = self.conversation_repo.get_by_id(conversation_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation non trouvée"
            )
        
        # Vérifier que l'utilisateur fait partie de la conversation
        if user_id not in conversation.participants:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à accéder à cette conversation"
            )
        
        return conversation
    
    def send_message(self, message_data: MessageCreate, sender_id: int):
        """Envoie un message dans une conversation"""
        # Vérifier que l'utilisateur fait partie de la conversation
        self.get_conversation(message_data.conversation_id, sender_id)
        
        # Créer le message
        message = self.message_repo.create(
            conversation_id=message_data.conversation_id,
            sender_id=sender_id,
            content=message_data.content,
            attachments=message_data.attachments
        )
        
        # Mettre à jour l'horodatage de la conversation
        self.conversation_repo.update_last_message_time(message_data.conversation_id)
        
        return message
    
    def get_conversation_messages(self, conversation_id: int, user_id: int,
                                 skip: int = 0, limit: int = 100):
        """Récupère les messages d'une conversation"""
        # Vérifier l'accès
        self.get_conversation(conversation_id, user_id)
        
        return self.message_repo.get_conversation_messages(conversation_id, skip, limit)
    
    def mark_message_as_read(self, message_id: int, user_id: int):
        """Marque un message comme lu"""
        message = self.message_repo.get_by_id(message_id)
        
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message non trouvé"
            )
        
        # Vérifier que l'utilisateur n'est pas l'expéditeur
        if message.sender_id == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vous ne pouvez pas marquer votre propre message comme lu"
            )
        
        return self.message_repo.mark_as_read(message_id)


# ============================================================================
# SERVICE SUPPORTTICKET
# ============================================================================

class SupportTicketService:
    """Service pour gérer les tickets de support"""
    
    def __init__(self, db: Session):
        self.ticket_repo = SupportTicketRepository(db)
        self.message_repo = TicketMessageRepository(db)
    
    def create_ticket(self, ticket_data: SupportTicketCreate, user_id: int):
        """Crée un nouveau ticket de support"""
        # Créer le ticket
        ticket = self.ticket_repo.create(
            user_id=user_id,
            subject=ticket_data.subject,
            category=ticket_data.category,
            priority=ticket_data.priority
        )
        
        # Créer le message initial
        self.message_repo.create(
            ticket_id=ticket.id,
            user_id=user_id,
            message=ticket_data.initial_message,
            attachments=ticket_data.attachments,
            is_internal=False
        )
        
        return ticket
    
    def get_user_tickets(self, user_id: int, skip: int = 0, limit: int = 50):
        """Récupère les tickets d'un utilisateur"""
        return self.ticket_repo.get_user_tickets(user_id, skip, limit)
    
    def get_all_tickets(self, status: Optional[TicketStatus] = None,
                       skip: int = 0, limit: int = 50):
        """Récupère tous les tickets (pour les admins)"""
        return self.ticket_repo.get_all_tickets(status, skip, limit)
    
    def get_ticket(self, ticket_id: int, user_id: Optional[int] = None, 
                  is_admin: bool = False):
        """Récupère un ticket spécifique"""
        ticket = self.ticket_repo.get_by_id(ticket_id)
        
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket non trouvé"
            )
        
        # Vérifier les permissions
        if not is_admin and ticket.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à accéder à ce ticket"
            )
        
        # Charger les messages
        messages = self.message_repo.get_ticket_messages(
            ticket_id, 
            include_internal=is_admin
        )
        
        return {
            "ticket": ticket,
            "messages": messages
        }
    
    def update_ticket(self, ticket_id: int, update_data: SupportTicketUpdate,
                     user_id: Optional[int] = None, is_admin: bool = False):
        """Met à jour un ticket"""
        ticket = self.ticket_repo.get_by_id(ticket_id)
        
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket non trouvé"
            )
        
        # Seuls les admins peuvent modifier le statut, la priorité et assigner
        if not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Seuls les administrateurs peuvent modifier les tickets"
            )
        
        update_dict = update_data.model_dump(exclude_unset=True)
        return self.ticket_repo.update(ticket_id, **update_dict)
    
    def add_ticket_message(self, message_data: TicketMessageCreate, user_id: int,
                          is_admin: bool = False):
        """Ajoute un message à un ticket"""
        ticket = self.ticket_repo.get_by_id(message_data.ticket_id)
        
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket non trouvé"
            )
        
        # Vérifier les permissions
        if not is_admin and ticket.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à répondre à ce ticket"
            )
        
        # Créer le message
        message = self.message_repo.create(
            ticket_id=message_data.ticket_id,
            user_id=user_id,
            message=message_data.message,
            attachments=message_data.attachments,
            is_internal=message_data.is_internal and is_admin  # Seulement les admins peuvent créer des messages internes
        )
        
        # Si c'est une réponse du client, changer le statut en WAITING_CUSTOMER
        if not is_admin and ticket.status == TicketStatus.IN_PROGRESS:
            self.ticket_repo.update(ticket.id, status=TicketStatus.WAITING_CUSTOMER)
        
        return message