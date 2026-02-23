from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt as bcrypt_lib
from app.core.config import settings
import secrets

# NOTE:
# - bcrypt 5.x est incompatible avec passlib 1.7.x pour le backend bcrypt.
# - On utilise pbkdf2_sha256 pour le hash principal (compatible partout),
#   et on garde une vérification legacy des hashes bcrypt existants.
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
    pbkdf2_sha256__rounds=29000
)


def hash_password(password: str) -> str:
    """
    Hache un mot de passe en utilisant bcrypt
    
    Args:
        password: Le mot de passe en clair
        
    Returns:
        Le mot de passe haché
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un mot de passe correspond à son hash
    
    Args:
        plain_password: Le mot de passe en clair
        hashed_password: Le mot de passe haché
        
    Returns:
        True si le mot de passe correspond, False sinon
    """
    # Compatibilité avec les anciens hashes bcrypt déjà en base
    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            # bcrypt compare historiquement seulement les 72 premiers bytes.
            return bcrypt_lib.checkpw(
                plain_password.encode("utf-8")[:72],
                hashed_password.encode("utf-8")
            )
        except (ValueError, TypeError):
            return False

    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (ValueError, TypeError):
        return False


def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Crée un token d'accès JWT
    
    Args:
        data: Les données à encoder dans le token
        expires_delta: Durée de validité du token
        
    Returns:
        Le token JWT encodé
    """
    to_encode = data.copy()
    print(f"DEBUG create_access_token - Données initiales: {to_encode}")
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
    
    # IMPORTANT: Ajouter le type "access" au payload
    to_encode.update({"exp": expire, "type": "access"})
    print(f"DEBUG create_access_token - Données finales avec type: {to_encode}")
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    print(f"DEBUG create_access_token - Token créé: {encoded_jwt[:50]}...")
    
    return encoded_jwt


def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Crée un token de rafraîchissement JWT
    
    Args:
        data: Les données à encoder dans le token
        expires_delta: Durée de validité du token
        
    Returns:
        Le token JWT encodé
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Décode et valide un token JWT
    
    Args:
        token: Le token JWT à décoder
        
    Returns:
        Les données décodées du token ou None si invalide
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print(f"DEBUG - Token décodé avec succès. Payload complet: {payload}")
        print(f"DEBUG - Type du token: {payload.get('type')}")
        print(f"DEBUG - Subject (user_id): {payload.get('sub')}")
        return payload
    except JWTError as e:
        print(f"DEBUG JWT ERROR: {e}")
        print(f"DEBUG - Token qui a échoué: {token[:50]}...")
        return None

def generate_random_token(length: int = 32) -> str:
    """
    Génère un token aléatoire sécurisé
    
    Args:
        length: Longueur du token en bytes
        
    Returns:
        Token aléatoire en hexadécimal
    """
    return secrets.token_urlsafe(length)


def generate_verification_token() -> str:
    """
    Génère un token de vérification d'email
    
    Returns:
        Token de vérification
    """
    return generate_random_token(32)


def generate_password_reset_token() -> str:
    """
    Génère un token de réinitialisation de mot de passe
    
    Returns:
        Token de réinitialisation
    """
    return generate_random_token(32)
