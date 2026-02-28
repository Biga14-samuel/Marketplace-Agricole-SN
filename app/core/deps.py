from app.core.database import SessionLocal
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from app.models.auth import User
from app.core.security import decode_token
from app.services.auth_service import AuthService

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)

def get_db():
    """Dépendance pour obtenir une session de base de données"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(
    auth: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Récupère l'utilisateur actuel à partir du token"""
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

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Récupère l'utilisateur actuel actif"""
    return current_user

async def get_current_user_optional(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_optional),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Récupère l'utilisateur actuel s'il est authentifié, sinon None"""
    if not auth:
        return None
    try:
        return await get_current_user(auth, db)
    except HTTPException:
        return None

def require_admin(current_user: User = Depends(get_current_active_user)) -> User:
    """Vérifie que l'utilisateur est un administrateur"""
    if not current_user.has_role("admin") and not current_user.has_role("superadmin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    return current_user

def require_producer(current_user: User = Depends(get_current_active_user)) -> User:
    """Vérifie que l'utilisateur est un producteur"""
    # Support case-insensitive role checking
    user_roles = [role.name.lower() for role in current_user.roles]
    if "producer" not in user_roles and "admin" not in user_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les producteurs peuvent accéder à cette ressource"
        )
    return current_user