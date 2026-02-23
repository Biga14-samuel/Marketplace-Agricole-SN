from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timezone
from app.models.auth import (
    User, Role, RefreshToken, PasswordReset, 
    EmailVerification, LoginHistory
)


class UserRepository:
    """Repository pour les opérations sur les utilisateurs"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, email: str, password_hash: str, phone: Optional[str] = None) -> User:
        """Crée un nouvel utilisateur"""
        user = User(
            email=email,
            password_hash=password_hash,
            phone=phone
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Récupère un utilisateur par son ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Récupère un utilisateur par son email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_by_phone(self, phone: str) -> Optional[User]:
        """Récupère un utilisateur par son téléphone"""
        return self.db.query(User).filter(User.phone == phone).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Récupère tous les utilisateurs"""
        return self.db.query(User).offset(skip).limit(limit).all()
    
    def update(self, user: User) -> User:
        """Met à jour un utilisateur"""
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def delete(self, user: User) -> bool:
        """Supprime un utilisateur"""
        self.db.delete(user)
        self.db.commit()
        return True
    
    def verify_email(self, user: User) -> User:
        """Marque l'email de l'utilisateur comme vérifié"""
        user.is_verified = True
        return self.update(user)
    
    def activate(self, user: User) -> User:
        """Active un utilisateur"""
        user.is_active = True
        return self.update(user)
    
    def deactivate(self, user: User) -> User:
        """Désactive un utilisateur"""
        user.is_active = False
        return self.update(user)


class RoleRepository:
    """Repository pour les opérations sur les rôles"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, name: str, description: Optional[str] = None) -> Role:
        """Crée un nouveau rôle"""
        role = Role(name=name, description=description)
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role
    
    def get_by_id(self, role_id: int) -> Optional[Role]:
        """Récupère un rôle par son ID"""
        return self.db.query(Role).filter(Role.id == role_id).first()
    
    def get_by_name(self, name: str) -> Optional[Role]:
        """Récupère un rôle par son nom"""
        return self.db.query(Role).filter(Role.name == name).first()
    
    def get_all(self) -> List[Role]:
        """Récupère tous les rôles"""
        return self.db.query(Role).all()
    
    def assign_role_to_user(self, user: User, role: Role) -> bool:
        """Assigne un rôle à un utilisateur"""
        if role not in user.roles:
            user.roles.append(role)
            self.db.commit()
            return True
        return False
    
    def remove_role_from_user(self, user: User, role: Role) -> bool:
        """Retire un rôle d'un utilisateur"""
        if role in user.roles:
            user.roles.remove(role)
            self.db.commit()
            return True
        return False
    
    def get_user_roles(self, user: User) -> List[Role]:
        """Récupère tous les rôles d'un utilisateur"""
        return user.roles


class RefreshTokenRepository:
    """Repository pour les opérations sur les tokens de rafraîchissement"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, token: str, expires_at: datetime) -> RefreshToken:
        """Crée un nouveau token de rafraîchissement"""
        refresh_token = RefreshToken(
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )
        self.db.add(refresh_token)
        self.db.commit()
        self.db.refresh(refresh_token)
        return refresh_token
    
    def get_by_token(self, token: str) -> Optional[RefreshToken]:
        """Récupère un token de rafraîchissement"""
        return self.db.query(RefreshToken).filter(
            RefreshToken.token == token,
            ~RefreshToken.revoked
        ).first()
    
    def revoke(self, refresh_token: RefreshToken) -> RefreshToken:
        """Révoque un token de rafraîchissement"""
        refresh_token.revoked = True
        self.db.commit()
        self.db.refresh(refresh_token)
        return refresh_token
    
    def revoke_all_user_tokens(self, user_id: int) -> int:
        """Révoque tous les tokens d'un utilisateur"""
        count = self.db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            ~RefreshToken.revoked
        ).update({"revoked": True})
        self.db.commit()
        return count
    
    def delete_expired_tokens(self) -> int:
        """Supprime tous les tokens expirés"""
        count = self.db.query(RefreshToken).filter(
            RefreshToken.expires_at < datetime.now(timezone.utc)
        ).delete()
        self.db.commit()
        return count


class PasswordResetRepository:
    """Repository pour les opérations de réinitialisation de mot de passe"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, token: str, expires_at: datetime) -> PasswordReset:
        """Crée une nouvelle demande de réinitialisation"""
        password_reset = PasswordReset(
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )
        self.db.add(password_reset)
        self.db.commit()
        self.db.refresh(password_reset)
        return password_reset
    
    def get_by_token(self, token: str) -> Optional[PasswordReset]:
        """Récupère une demande de réinitialisation par son token"""
        return self.db.query(PasswordReset).filter(
            PasswordReset.token == token,
            ~PasswordReset.used,
            PasswordReset.expires_at > datetime.now(timezone.utc)
        ).first()
    
    def mark_as_used(self, password_reset: PasswordReset) -> PasswordReset:
        """Marque une demande comme utilisée"""
        password_reset.used = True
        password_reset.used_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(password_reset)
        return password_reset
    
    def delete_expired_tokens(self) -> int:
        """Supprime tous les tokens expirés"""
        count = self.db.query(PasswordReset).filter(
            PasswordReset.expires_at < datetime.now(timezone.utc)
        ).delete()
        self.db.commit()
        return count


class EmailVerificationRepository:
    """Repository pour les opérations de vérification d'email"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, token: str, expires_at: datetime) -> EmailVerification:
        """Crée une nouvelle demande de vérification d'email"""
        email_verification = EmailVerification(
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )
        self.db.add(email_verification)
        self.db.commit()
        self.db.refresh(email_verification)
        return email_verification
    
    def get_by_token(self, token: str) -> Optional[EmailVerification]:
        """Récupère une vérification par son token"""
        return self.db.query(EmailVerification).filter(
            EmailVerification.token == token,
            EmailVerification.verified_at.is_(None),
            EmailVerification.expires_at > datetime.now(timezone.utc)
        ).first()
    
    def mark_as_verified(self, email_verification: EmailVerification) -> EmailVerification:
        """Marque l'email comme vérifié"""
        email_verification.verified_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(email_verification)
        return email_verification
    
    def delete_expired_tokens(self) -> int:
        """Supprime tous les tokens expirés"""
        count = self.db.query(EmailVerification).filter(
            EmailVerification.expires_at < datetime.now(timezone.utc)
        ).delete()
        self.db.commit()
        return count


class LoginHistoryRepository:
    """Repository pour l'historique des connexions"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self, 
        user_id: int, 
        ip_address: Optional[str], 
        user_agent: Optional[str],
        success: bool,
        failure_reason: Optional[str] = None
    ) -> LoginHistory:
        """Enregistre une tentative de connexion"""
        login_history = LoginHistory(
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            failure_reason=failure_reason
        )
        self.db.add(login_history)
        self.db.commit()
        self.db.refresh(login_history)
        return login_history
    
    def get_user_history(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[LoginHistory]:
        """Récupère l'historique de connexion d'un utilisateur"""
        return self.db.query(LoginHistory).filter(
            LoginHistory.user_id == user_id
        ).order_by(LoginHistory.login_at.desc()).offset(skip).limit(limit).all()
    
    def get_failed_attempts(
        self, 
        user_id: int, 
        since: datetime
    ) -> List[LoginHistory]:
        """Récupère les tentatives de connexion échouées depuis une date"""
        return self.db.query(LoginHistory).filter(
            LoginHistory.user_id == user_id,
            ~LoginHistory.success,
            LoginHistory.login_at >= since
        ).all()