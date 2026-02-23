from fastapi import APIRouter, Depends, status, Request, HTTPException, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.core.config import settings
from app.models.auth import User
from app.core.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth_schema import (
    UserCreate, UserResponse, LoginRequest, LoginResponse,
    RefreshTokenRequest, RefreshTokenResponse, PasswordResetRequest,
    PasswordResetConfirm, PasswordChange, EmailVerificationConfirm,
    EmailVerificationRequest, UserUpdate, MessageResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Dependency pour obtenir le service d'authentification"""
    return AuthService(db)


async def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Récupère l'utilisateur actuel à partir du token"""
    if auth is None or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token d'accès manquant",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth.credentials
    
    # Décoder le token
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token d'accès invalide - décodage échoué",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_type = payload.get("type")
    
    if token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token d'accès invalide - type incorrect: {token_type}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Récupérer l'utilisateur via le service pour rester cohérent
    user_id = payload.get("sub")
    auth_service = AuthService(db)
    user = auth_service.user_repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte désactivé"
        )
    
    return user


@router.post(
    "/register",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un compte utilisateur"
)
async def register(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Crée un nouveau compte utilisateur.
    """
    user, verification_token = auth_service.register_user(
        user_data,
        assign_role=user_data.role
    )
    
    # En mode SKIP, pas besoin d'envoyer d'email
    if settings.SKIP_EMAIL_VERIFICATION:
        print(f"[dev] SKIP mode: no email sent for {user.email}")
    else:
        # Envoyer l'email de vérification en arrière-plan
        from app.core.email import send_verification_email_in_background
        user_name = f"{user_data.first_name} {user_data.last_name}" if user_data.first_name and user_data.last_name else None
        background_tasks.add_task(
            send_verification_email_in_background,
            email=user.email,
            token=verification_token,
            user_name=user_name
        )
        print(f"[info] Verification email queued for {user.email}")
    
    return MessageResponse(
        message="Inscription réussie. Votre compte est activé." if settings.SKIP_EMAIL_VERIFICATION else "Inscription réussie. Veuillez vérifier votre email.",
        detail=f"Token de vérification (dev mode): {verification_token}"
    )


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Connexion utilisateur"
)
def login(
    login_data: LoginRequest,
    request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Authentifie un utilisateur et retourne les tokens d'accès.
    """
    # Récupérer l'IP et le user agent
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    access_token, refresh_token, user = auth_service.login(
        login_data,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user)
    )


@router.post(
    "/refresh",
    response_model=RefreshTokenResponse,
    summary="Rafraîchir le token d'accès"
)
def refresh_token(
    token_data: RefreshTokenRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Génère un nouveau token d'accès à partir du refresh token.
    """
    access_token = auth_service.refresh_access_token(token_data.refresh_token)
    
    return RefreshTokenResponse(access_token=access_token)


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Déconnexion utilisateur"
)
def logout(
    token_data: RefreshTokenRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Déconnecte l'utilisateur en révoquant son refresh token.
    """
    auth_service.logout(token_data.refresh_token)
    
    return MessageResponse(message="Déconnexion réussie")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Obtenir le profil de l'utilisateur connecté"
)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Récupère les informations de l'utilisateur actuellement connecté.
    """
    return UserResponse.model_validate(current_user)


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Mettre à jour le profil utilisateur connecté"
)
def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Met à jour l'email et/ou le téléphone de l'utilisateur connecté.
    """
    updated_user, verification_token = auth_service.update_user_profile(
        user_id=current_user.id,
        email=user_data.email,
        phone=user_data.phone
    )

    if verification_token:
        print(f"[info] New verification token generated for {updated_user.email}")

    return UserResponse.model_validate(updated_user)


@router.post(
    "/verify-email",
    response_model=MessageResponse,
    summary="Vérifier l'email"
)
def verify_email(
    verification_data: EmailVerificationConfirm,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Vérifie l'email de l'utilisateur avec le token reçu par email.
    """
    print(f"DEBUG verify_email - Données reçues: {verification_data}")
    print(f"DEBUG verify_email - Token: {verification_data.token}")
    
    auth_service.verify_email(verification_data.token)
    
    return MessageResponse(message="Email vérifié avec succès")


@router.post(
    "/resend-verification",
    response_model=MessageResponse,
    summary="Renvoyer l'email de vérification"
)
def resend_verification(
    payload: EmailVerificationRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Génère un nouveau lien de vérification pour un compte non vérifié.
    """
    token = auth_service.resend_verification_email(payload.email)
    return MessageResponse(
        message="Si cet email existe et n'est pas vérifié, un nouveau lien a été envoyé.",
        detail=f"Token de vérification (dev mode): {token}" if token else None
    )


@router.post(
    "/password-reset/request",
    response_model=MessageResponse,
    summary="Demander une réinitialisation de mot de passe"
)
def request_password_reset(
    reset_data: PasswordResetRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Envoie un email avec un lien de réinitialisation de mot de passe.
    """
    token = auth_service.request_password_reset(reset_data.email)
    
    return MessageResponse(
        message="Si cet email existe, un lien de réinitialisation a été envoyé",
        detail=f"Token de réinitialisation (dev mode): {token}"
    )


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Alias - Demander une réinitialisation de mot de passe"
)
def forgot_password_alias(
    reset_data: PasswordResetRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Alias compatible front pour la demande de reset de mot de passe.
    """
    token = auth_service.request_password_reset(reset_data.email)
    return MessageResponse(
        message="Si cet email existe, un lien de réinitialisation a été envoyé",
        detail=f"Token de réinitialisation (dev mode): {token}"
    )


@router.post(
    "/password-reset/confirm",
    response_model=MessageResponse,
    summary="Confirmer la réinitialisation de mot de passe"
)
def confirm_password_reset(
    reset_data: PasswordResetConfirm,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Réinitialise le mot de passe avec le token reçu par email.
    """
    auth_service.reset_password(reset_data.token, reset_data.new_password)
    
    return MessageResponse(message="Mot de passe réinitialisé avec succès")


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Alias - Confirmer la réinitialisation de mot de passe"
)
def reset_password_alias(
    reset_data: PasswordResetConfirm,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Alias compatible front pour la confirmation de reset de mot de passe.
    """
    auth_service.reset_password(reset_data.token, reset_data.new_password)
    return MessageResponse(message="Mot de passe réinitialisé avec succès")


@router.post(
    "/password/change",
    response_model=MessageResponse,
    summary="Changer le mot de passe"
)
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Change le mot de passe de l'utilisateur connecté.
    """
    auth_service.change_password(
        current_user.id,
        password_data.old_password,
        password_data.new_password
    )
    
    return MessageResponse(
        message="Mot de passe modifié avec succès. Veuillez vous reconnecter."
    )


@router.put(
    "/change-password",
    response_model=MessageResponse,
    summary="Alias - Changer le mot de passe"
)
def change_password_alias(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Alias compatible front pour le changement de mot de passe.
    """
    auth_service.change_password(
        current_user.id,
        password_data.old_password,
        password_data.new_password
    )
    return MessageResponse(
        message="Mot de passe modifié avec succès. Veuillez vous reconnecter."
    )
