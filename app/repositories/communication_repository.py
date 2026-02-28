from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from app.models.communication import (
    Notification, NotificationPreference, EmailTemplate, EmailLog,
    Conversation, Message, SupportTicket, TicketMessage,
    NotificationType, NotificationChannel, EmailStatus, TicketStatus
)


# ============================================================================
# REPOSITORY NOTIFICATION
# ============================================================================

class NotificationRepository:
    """Gère les opérations de base de données pour les notifications"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, type: NotificationType, title: str, 
               message: str, link: Optional[str] = None) -> Notification:
        """Crée une nouvelle notification"""
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            link=link
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification
    
    def get_by_id(self, notification_id: int) -> Optional[Notification]:
        """Récupère une notification par son ID"""
        return self.db.query(Notification).filter(Notification.id == notification_id).first()
    
    def get_user_notifications(self, user_id: int, skip: int = 0, 
                               limit: int = 50, unread_only: bool = False) -> List[Notification]:
        """Récupère les notifications d'un utilisateur"""
        query = self.db.query(Notification).filter(Notification.user_id == user_id)
        
        if unread_only:
            query = query.filter(~Notification.is_read)
        
        return query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()
    
    def count_user_notifications(self, user_id: int, unread_only: bool = False) -> int:
        """Compte les notifications d'un utilisateur"""
        query = self.db.query(func.count(Notification.id)).filter(Notification.user_id == user_id)
        
        if unread_only:
            query = query.filter(~Notification.is_read)
        
        return query.scalar()
    
    def mark_as_read(self, notification_id: int) -> Optional[Notification]:
        """Marque une notification comme lue"""
        notification = self.get_by_id(notification_id)
        if notification and not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(notification)
        return notification
    
    def mark_all_as_read(self, user_id: int) -> int:
        """Marque toutes les notifications d'un utilisateur comme lues"""
        count = self.db.query(Notification).filter(
            and_(
                Notification.user_id == user_id,
                ~Notification.is_read
            )
        ).update({
            "is_read": True,
            "read_at": datetime.now(timezone.utc)
        })
        self.db.commit()
        return count
    
    def delete(self, notification_id: int) -> bool:
        """Supprime une notification"""
        notification = self.get_by_id(notification_id)
        if notification:
            self.db.delete(notification)
            self.db.commit()
            return True
        return False
    
    def delete_old_notifications(self, days: int = 30) -> int:
        """Supprime les notifications lues de plus de X jours"""
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        count = self.db.query(Notification).filter(
            and_(
                Notification.is_read,
                Notification.read_at < cutoff_date
            )
        ).delete()
        self.db.commit()
        return count


# ============================================================================
# REPOSITORY NOTIFICATIONPREFERENCE
# ============================================================================

class NotificationPreferenceRepository:
    """Gère les préférences de notification des utilisateurs"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, channel: NotificationChannel, 
               type: NotificationType, is_enabled: bool = True) -> NotificationPreference:
        """Crée une préférence de notification"""
        preference = NotificationPreference(
            user_id=user_id,
            channel=channel,
            type=type,
            is_enabled=is_enabled
        )
        self.db.add(preference)
        self.db.commit()
        self.db.refresh(preference)
        return preference
    
    def get_by_id(self, preference_id: int) -> Optional[NotificationPreference]:
        """Récupère une préférence par son ID"""
        return self.db.query(NotificationPreference).filter(
            NotificationPreference.id == preference_id
        ).first()
    
    def get_user_preferences(self, user_id: int) -> List[NotificationPreference]:
        """Récupère toutes les préférences d'un utilisateur"""
        return self.db.query(NotificationPreference).filter(
            NotificationPreference.user_id == user_id
        ).all()
    
    def get_user_preference(self, user_id: int, channel: NotificationChannel, 
                           type: NotificationType) -> Optional[NotificationPreference]:
        """Récupère une préférence spécifique"""
        return self.db.query(NotificationPreference).filter(
            and_(
                NotificationPreference.user_id == user_id,
                NotificationPreference.channel == channel,
                NotificationPreference.type == type
            )
        ).first()
    
    def update(self, preference_id: int, is_enabled: bool) -> Optional[NotificationPreference]:
        """Met à jour une préférence"""
        preference = self.get_by_id(preference_id)
        if preference:
            preference.is_enabled = is_enabled
            preference.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(preference)
        return preference
    
    def is_notification_enabled(self, user_id: int, channel: NotificationChannel, 
                               type: NotificationType) -> bool:
        """Vérifie si un type de notification est activé pour un canal"""
        preference = self.get_user_preference(user_id, channel, type)
        # Par défaut, les notifications sont activées si aucune préférence n'existe
        return preference.is_enabled if preference else True


# ============================================================================
# REPOSITORY EMAILTEMPLATE
# ============================================================================

class EmailTemplateRepository:
    """Gère les templates d'emails"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, name: str, subject: str, body: str, 
               variables: Optional[List[str]] = None, is_active: bool = True) -> EmailTemplate:
        """Crée un template d'email"""
        template = EmailTemplate(
            name=name,
            subject=subject,
            body=body,
            variables=variables,
            is_active=is_active
        )
        self.db.add(template)
        self.db.commit()
        self.db.refresh(template)
        return template
    
    def get_by_id(self, template_id: int) -> Optional[EmailTemplate]:
        """Récupère un template par son ID"""
        return self.db.query(EmailTemplate).filter(EmailTemplate.id == template_id).first()
    
    def get_by_name(self, name: str) -> Optional[EmailTemplate]:
        """Récupère un template par son nom"""
        return self.db.query(EmailTemplate).filter(EmailTemplate.name == name).first()
    
    def get_all(self, active_only: bool = True) -> List[EmailTemplate]:
        """Récupère tous les templates"""
        query = self.db.query(EmailTemplate)
        if active_only:
            query = query.filter(EmailTemplate.is_active == True)
        return query.all()
    
    def update(self, template_id: int, **kwargs) -> Optional[EmailTemplate]:
        """Met à jour un template"""
        template = self.get_by_id(template_id)
        if template:
            for key, value in kwargs.items():
                if hasattr(template, key) and value is not None:
                    setattr(template, key, value)
            template.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(template)
        return template
    
    def delete(self, template_id: int) -> bool:
        """Supprime un template"""
        template = self.get_by_id(template_id)
        if template:
            self.db.delete(template)
            self.db.commit()
            return True
        return False


# ============================================================================
# REPOSITORY EMAILLOG
# ============================================================================

class EmailLogRepository:
    """Gère les logs d'envoi d'emails"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, recipient: str, subject: str, user_id: Optional[int] = None,
               template_id: Optional[int] = None) -> EmailLog:
        """Crée un log d'email"""
        log = EmailLog(
            user_id=user_id,
            template_id=template_id,
            recipient=recipient,
            subject=subject,
            status=EmailStatus.PENDING
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log
    
    def get_by_id(self, log_id: int) -> Optional[EmailLog]:
        """Récupère un log par son ID"""
        return self.db.query(EmailLog).filter(EmailLog.id == log_id).first()
    
    def get_user_emails(self, user_id: int, skip: int = 0, limit: int = 50) -> List[EmailLog]:
        """Récupère les emails d'un utilisateur"""
        return self.db.query(EmailLog).filter(
            EmailLog.user_id == user_id
        ).order_by(desc(EmailLog.created_at)).offset(skip).limit(limit).all()
    
    def update_status(self, log_id: int, status: EmailStatus, 
                     error_message: Optional[str] = None) -> Optional[EmailLog]:
        """Met à jour le statut d'un email"""
        log = self.get_by_id(log_id)
        if log:
            log.status = status
            if error_message:
                log.error_message = error_message
            if status == EmailStatus.SENT:
                log.sent_at = datetime.now(timezone.utc)
            elif status == EmailStatus.OPENED:
                log.opened_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(log)
        return log


# ============================================================================
# REPOSITORY CONVERSATION
# ============================================================================

class ConversationRepository:
    """Gère les conversations entre utilisateurs"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, participants: List[int], subject: Optional[str] = None) -> Conversation:
        """Crée une nouvelle conversation"""
        conversation = Conversation(
            participants=participants,
            subject=subject
        )
        self.db.add(conversation)
        self.db.commit()
        self.db.refresh(conversation)
        return conversation
    
    def get_by_id(self, conversation_id: int) -> Optional[Conversation]:
        """Récupère une conversation par son ID"""
        return self.db.query(Conversation).filter(Conversation.id == conversation_id).first()
    
    def get_user_conversations(self, user_id: int, skip: int = 0, 
                              limit: int = 50) -> List[Conversation]:
        """Récupère les conversations d'un utilisateur"""
        # Note: La recherche dans le champ JSON peut varier selon la BDD
        # Pour SQLite, on utilise json_extract
        return self.db.query(Conversation).filter(
            Conversation.participants.contains([user_id])
        ).order_by(desc(Conversation.last_message_at)).offset(skip).limit(limit).all()
    
    def find_conversation(self, user1_id: int, user2_id: int) -> Optional[Conversation]:
        """Trouve une conversation entre deux utilisateurs"""
        conversations = self.db.query(Conversation).all()
        for conv in conversations:
            if set(conv.participants) == {user1_id, user2_id}:
                return conv
        return None
    
    def update_last_message_time(self, conversation_id: int) -> Optional[Conversation]:
        """Met à jour l'horodatage du dernier message"""
        conversation = self.get_by_id(conversation_id)
        if conversation:
            conversation.last_message_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(conversation)
        return conversation


# ============================================================================
# REPOSITORY MESSAGE
# ============================================================================

class MessageRepository:
    """Gère les messages dans les conversations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, conversation_id: int, sender_id: int, content: str,
               attachments: Optional[List[str]] = None) -> Message:
        """Crée un nouveau message"""
        message = Message(
            conversation_id=conversation_id,
            sender_id=sender_id,
            content=content,
            attachments=attachments
        )
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message
    
    def get_by_id(self, message_id: int) -> Optional[Message]:
        """Récupère un message par son ID"""
        return self.db.query(Message).filter(Message.id == message_id).first()
    
    def get_conversation_messages(self, conversation_id: int, skip: int = 0,
                                 limit: int = 100) -> List[Message]:
        """Récupère les messages d'une conversation"""
        return self.db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.sent_at).offset(skip).limit(limit).all()
    
    def mark_as_read(self, message_id: int) -> Optional[Message]:
        """Marque un message comme lu"""
        message = self.get_by_id(message_id)
        if message and not message.is_read:
            message.is_read = True
            message.read_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(message)
        return message
    
    def count_unread_messages(self, conversation_id: int, user_id: int) -> int:
        """Compte les messages non lus d'une conversation pour un utilisateur"""
        return self.db.query(func.count(Message.id)).filter(
            and_(
                Message.conversation_id == conversation_id,
                Message.sender_id != user_id,
                ~Message.is_read
            )
        ).scalar()


# ============================================================================
# REPOSITORY SUPPORTTICKET
# ============================================================================

class SupportTicketRepository:
    """Gère les tickets de support client"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, subject: str, category: str,
               priority: str = "medium") -> SupportTicket:
        """Crée un nouveau ticket de support"""
        ticket = SupportTicket(
            user_id=user_id,
            subject=subject,
            category=category,
            priority=priority,
            status=TicketStatus.OPEN
        )
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket
    
    def get_by_id(self, ticket_id: int) -> Optional[SupportTicket]:
        """Récupère un ticket par son ID"""
        return self.db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    
    def get_user_tickets(self, user_id: int, skip: int = 0, 
                        limit: int = 50) -> List[SupportTicket]:
        """Récupère les tickets d'un utilisateur"""
        return self.db.query(SupportTicket).filter(
            SupportTicket.user_id == user_id
        ).order_by(desc(SupportTicket.created_at)).offset(skip).limit(limit).all()
    
    def get_all_tickets(self, status: Optional[TicketStatus] = None, 
                       skip: int = 0, limit: int = 50) -> List[SupportTicket]:
        """Récupère tous les tickets (pour les admins)"""
        query = self.db.query(SupportTicket)
        if status:
            query = query.filter(SupportTicket.status == status)
        return query.order_by(desc(SupportTicket.created_at)).offset(skip).limit(limit).all()
    
    def update(self, ticket_id: int, **kwargs) -> Optional[SupportTicket]:
        """Met à jour un ticket"""
        ticket = self.get_by_id(ticket_id)
        if ticket:
            for key, value in kwargs.items():
                if hasattr(ticket, key) and value is not None:
                    setattr(ticket, key, value)
            
            # Mettre à jour les timestamps selon le statut
            if 'status' in kwargs:
                if kwargs['status'] == TicketStatus.RESOLVED:
                    ticket.resolved_at = datetime.now(timezone.utc)
                elif kwargs['status'] == TicketStatus.CLOSED:
                    ticket.closed_at = datetime.now(timezone.utc)
            
            ticket.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(ticket)
        return ticket
    
    def assign_ticket(self, ticket_id: int, agent_id: int) -> Optional[SupportTicket]:
        """Assigne un ticket à un agent"""
        return self.update(ticket_id, assigned_to=agent_id, status=TicketStatus.IN_PROGRESS)


# ============================================================================
# REPOSITORY TICKETMESSAGE
# ============================================================================

class TicketMessageRepository:
    """Gère les messages des tickets de support"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, ticket_id: int, user_id: int, message: str,
               attachments: Optional[List[str]] = None, 
               is_internal: bool = False) -> TicketMessage:
        """Crée un message de ticket"""
        ticket_message = TicketMessage(
            ticket_id=ticket_id,
            user_id=user_id,
            message=message,
            attachments=attachments,
            is_internal=is_internal
        )
        self.db.add(ticket_message)
        self.db.commit()
        self.db.refresh(ticket_message)
        return ticket_message
    
    def get_by_id(self, message_id: int) -> Optional[TicketMessage]:
        """Récupère un message par son ID"""
        return self.db.query(TicketMessage).filter(TicketMessage.id == message_id).first()
    
    def get_ticket_messages(self, ticket_id: int, include_internal: bool = False) -> List[TicketMessage]:
        """Récupère les messages d'un ticket"""
        query = self.db.query(TicketMessage).filter(TicketMessage.ticket_id == ticket_id)
        
        if not include_internal:
            query = query.filter(~TicketMessage.is_internal)
        
        return query.order_by(TicketMessage.created_at).all()