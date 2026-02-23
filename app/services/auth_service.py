from sqlalchemy.orm import Session
from typing import Optional, Tuple
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status

from app.models.auth import User, EmailVerification
from app.repositories.auth_repository import (
    UserRepository, RoleRepository, RefreshTokenRepository,
    PasswordResetRepository, EmailVerificationRepository, LoginHistoryRepository
)
from app.schemas.auth_schema import UserCreate, LoginRequest
from app.core.security import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, decode_token, generate_verification_token,
    generate_password_reset_token
)
from app.core.config import settings


class AuthService:
    """Service d'authentification"""
    
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.role_repo = RoleRepository(db)
        self.refresh_token_repo = RefreshTokenRepository(db)
        self.password_reset_repo = PasswordResetRepository(db)
        self.email_verification_repo = EmailVerificationRepository(db)
        self.login_history_repo = LoginHistoryRepository(db)
    
    def register_user(
            self, 
            user_data: UserCreate,
            assign_role: str = "Customer"
        ) -> Tuple[User, str]:
            """
            Enregistre un nouvel utilisateur

            Returns:
                Tuple[User, verification_token]
            """
            # Vérifier si l'email existe déjà
            existing_user = self.user_repo.get_by_email(user_data.email)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Un utilisateur avec cet email existe déjà"
                )

            # Vérifier si le téléphone existe déjà
            if user_data.phone:
                existing_phone = self.user_repo.get_by_phone(user_data.phone)
                if existing_phone:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Un utilisateur avec ce numéro de téléphone existe déjà"
                )

            # Créer l'utilisateur
            password_hash = hash_password(user_data.password)
            user = self.user_repo.create(
                email=user_data.email,
                password_hash=password_hash,
                phone=user_data.phone
            )

            # Si on skip la vérification email, activer directement le compte
            if settings.SKIP_EMAIL_VERIFICATION:
                print(f"🚀 Mode développement: activation automatique du compte {user.email}")
                user = self.user_repo.verify_email(user)

            # Assigner le rôle
            role = self.role_repo.get_by_name(assign_role)
            if role:
                self.role_repo.assign_role_to_user(user, role)

            # Créer un profil client si first_name et last_name sont fournis
            user_name = None
            if assign_role == "Customer" and user_data.first_name and user_data.last_name:
                from app.repositories.profile_repository import CustomerProfileRepository
                profile_repo = CustomerProfileRepository(self.db)
                profile_repo.create(
                    user_id=user.id,
                    first_name=user_data.first_name,
                    last_name=user_data.last_name
                )
                user_name = f"{user_data.first_name} {user_data.last_name}"

            # Créer un token de vérification d'email (même en mode skip pour les logs)
            verification_token = generate_verification_token()
            expires_at = datetime.now(timezone.utc) + timedelta(hours=48)  # 48h pour plus de confort
            self.email_verification_repo.create(
                user_id=user.id,
                token=verification_token,
                expires_at=expires_at
            )

            # En mode développement on n'envoie pas d'email mais on affiche le lien
            if settings.SKIP_EMAIL_VERIFICATION:
                print(f"⚠️ Mode développement: envoi d'email désactivé pour {user.email}")
                print(f"🔗 Lien de vérification (si besoin): {settings.FRONTEND_URL}/auth/verify-email?token={verification_token}")
            else:
                # Le routeur se chargera d'ajouter la tâche d'envoi en arrière-plan.
                print(f"📧 Préparé pour envoi d'email de vérification à: {user.email}")
                print(f"🔗 Lien de vérification (manuel): {settings.FRONTEND_URL}/auth/verify-email?token={verification_token}")

            return user, verification_token

    
    def login(
        self,
        login_data: LoginRequest,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Tuple[str, str, User]:
        """
        Authentifie un utilisateur
        
        Returns:
            Tuple[access_token, refresh_token, user]
        """
        # Récupérer l'utilisateur
        user = self.user_repo.get_by_email(login_data.email)
        
        if not user:
            # Ne pas logger les tentatives avec email inexistant pour éviter l'erreur FK
            # On pourrait logger dans une table séparée si nécessaire
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect"
            )
        
        # Vérifier le mot de passe
        if not verify_password(login_data.password, user.password_hash):
            # Enregistrer la tentative échouée
            self.login_history_repo.create(
                user_id=user.id,
                ip_address=ip_address,
                user_agent=user_agent,
                success=False,
                failure_reason="Mot de passe incorrect"
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect"
            )
        
        # Vérifier si l'utilisateur est actif
        if not user.is_active:
            self.login_history_repo.create(
                user_id=user.id,
                ip_address=ip_address,
                user_agent=user_agent,
                success=False,
                failure_reason="Compte désactivé"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Votre compte a été désactivé"
            )
        
        # Créer les tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token_str = create_refresh_token(data={"sub": str(user.id)})
        
        # Enregistrer le refresh token
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        self.refresh_token_repo.create(
            user_id=user.id,
            token=refresh_token_str,
            expires_at=expires_at
        )
        
        # Enregistrer la connexion réussie
        self.login_history_repo.create(
            user_id=user.id,
            ip_address=ip_address,
            user_agent=user_agent,
            success=True
        )
        
        return access_token, refresh_token_str, user
    
    def refresh_access_token(self, refresh_token: str) -> str:
        """Rafraîchit un access token"""
        # Vérifier le refresh token
        token_data = decode_token(refresh_token)
        if not token_data or token_data.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de rafraîchissement invalide"
            )
        
        # Vérifier si le token existe en base
        db_token = self.refresh_token_repo.get_by_token(refresh_token)
        if not db_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de rafraîchissement invalide ou révoqué"
            )
        
        # Vérifier l'expiration
        if db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de rafraîchissement expiré"
            )
        
        # Créer un nouveau access token
        user_id = token_data.get("sub")
        access_token = create_access_token(data={"sub": str(user_id)})
        
        return access_token
    
    def logout(self, refresh_token: str) -> bool:
        """Déconnecte un utilisateur en révoquant son refresh token"""
        db_token = self.refresh_token_repo.get_by_token(refresh_token)
        if not db_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de rafraîchissement invalide"
            )
        
        self.refresh_token_repo.revoke(db_token)
        return True
    
    def verify_email(self, token: str) -> User:
        """Vérifie l'email d'un utilisateur"""
        print(f"DEBUG verify_email - Token reçu: {token}")
        
        # Récupérer la vérification
        verification = self.email_verification_repo.get_by_token(token)
        
        if not verification:
            print(f"DEBUG - Token non trouvé ou expiré")
            # Vérifier si le token existe mais est déjà utilisé
            used_verification = self.db.query(EmailVerification).filter(
                EmailVerification.token == token
            ).first()
            
            if used_verification and used_verification.verified_at:
                # Le token a déjà été utilisé
                user = self.user_repo.get_by_id(used_verification.user_id)
                if user and user.is_verified:
                    print(f"DEBUG - Email déjà vérifié pour l'utilisateur {user.email}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Cet email a déjà été vérifié"
                    )
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de vérification invalide ou expiré"
            )
        
        print(f"DEBUG - Vérification trouvée pour user_id: {verification.user_id}")
        
        # Récupérer l'utilisateur
        user = self.user_repo.get_by_id(verification.user_id)
        if not user:
            print(f"DEBUG - Utilisateur non trouvé")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        
        # Vérifier si l'email est déjà vérifié
        if user.is_verified:
            print(f"DEBUG - Email déjà vérifié pour {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet email a déjà été vérifié"
            )
        
        # Marquer comme vérifié
        self.email_verification_repo.mark_as_verified(verification)
        print(f"DEBUG - Token marqué comme vérifié")
        
        # Vérifier l'utilisateur
        verified_user = self.user_repo.verify_email(user)
        print(f"DEBUG - Utilisateur vérifié: {verified_user.email}")
        
        return verified_user
    
    def request_password_reset(self, email: str) -> str:
        """Demande une réinitialisation de mot de passe"""
        user = self.user_repo.get_by_email(email)
        if not user:
            # Ne pas révéler si l'email existe ou non
            return "Si cet email existe, un lien de réinitialisation a été envoyé"
        
        # Créer un token de réinitialisation
        reset_token = generate_password_reset_token()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=2)  # 2h pour plus de confort
        self.password_reset_repo.create(
            user_id=user.id,
            token=reset_token,
            expires_at=expires_at
        )
        
        return reset_token
    
    def reset_password(self, token: str, new_password: str) -> User:
        """Réinitialise le mot de passe d'un utilisateur"""
        # Récupérer la demande de réinitialisation
        reset_request = self.password_reset_repo.get_by_token(token)
        if not reset_request:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de réinitialisation invalide ou expiré"
            )
        
        # Récupérer l'utilisateur
        user = self.user_repo.get_by_id(reset_request.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        
        # Mettre à jour le mot de passe
        user.password_hash = hash_password(new_password)
        updated_user = self.user_repo.update(user)
        
        # Marquer le token comme utilisé
        self.password_reset_repo.mark_as_used(reset_request)
        
        # Révoquer tous les refresh tokens
        self.refresh_token_repo.revoke_all_user_tokens(user.id)
        
        return updated_user
    
    def change_password(
        self, 
        user_id: int, 
        old_password: str, 
        new_password: str
    ) -> User:
        """Change le mot de passe d'un utilisateur"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        
        # Vérifier l'ancien mot de passe
        if not verify_password(old_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ancien mot de passe incorrect"
            )
        
        # Mettre à jour le mot de passe
        user.password_hash = hash_password(new_password)
        updated_user = self.user_repo.update(user)
        
        # Révoquer tous les refresh tokens
        self.refresh_token_repo.revoke_all_user_tokens(user.id)
        
        return updated_user
    
    def get_current_user(self, token: str) -> User:
        """Récupère l'utilisateur actuel à partir du token"""
        print(f"DEBUG get_current_user - Token reçu: {token[:50]}...")
        
        # Décoder le token
        payload = decode_token(token)
        print(f"DEBUG get_current_user - Payload après décodage: {payload}")
        
        if not payload:
            print("DEBUG - Le payload est None, le token n'a pas pu être décodé")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token d'accès invalide - décodage échoué"
            )
        
        token_type = payload.get("type")
        print(f"DEBUG - Type trouvé dans le payload: '{token_type}'")
        
        if token_type != "access":
            print(f"DEBUG - Le type '{token_type}' ne correspond pas à 'access'")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token d'accès invalide - type incorrect: {token_type}"
            )
        
        # Récupérer l'utilisateur
        user_id = payload.get("sub")
        print(f"DEBUG - User ID extrait: {user_id}")
        
        user = self.user_repo.get_by_id(user_id)
        if not user:
            print(f"DEBUG - Aucun utilisateur trouvé avec l'ID {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        
        if not user.is_active:
            print(f"DEBUG - L'utilisateur {user_id} n'est pas actif")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Compte désactivé"
            )
        
        print(f"DEBUG - Utilisateur trouvé et validé: {user.email}")
        return user