from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import Optional, List
from datetime import datetime
import re

# --- Fonction utilitaire pour le mot de passe ---

def validate_password_strength(v: str) -> str:
    if len(v) < 8:
        raise ValueError('Le mot de passe doit contenir au moins 8 caractères')
    if not re.search(r'[A-Z]', v):
        raise ValueError('Le mot de passe doit contenir au moins une majuscule')
    if not re.search(r'[a-z]', v):
        raise ValueError('Le mot de passe doit contenir au moins une minuscule')
    if not re.search(r'\d', v):
        raise ValueError('Le mot de passe doit contenir au moins un chiffre')
    return v

# ============= User Schemas =============

class UserBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None

    @field_validator('phone')
    @classmethod # Optionnel en V2 mais conseillé pour la clarté
    def validate_phone(cls, v):
        if v is not None:
            # Format Cameroun: +237 suivi de 9 chiffres (commence par 6 ou 2)
            phone_regex = re.compile(r'^(\+237|237)?[62]\d{8}$')
            if not phone_regex.match(v.replace(' ', '').replace('-', '')):
                raise ValueError('Numéro de téléphone invalide (format Cameroun: +237XXXXXXXXX)')
        return v

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    
    @field_validator('password')
    @classmethod
    def validate_user_password(cls, v):
        return validate_password_strength(v)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    """Schéma de réponse pour un utilisateur"""
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    roles: List['RoleResponse'] = []

    model_config = ConfigDict(from_attributes=True)

class UserWithRoles(UserResponse):
    """Schéma utilisateur avec les rôles"""
    pass


# ============= Role Schemas =============

class RoleBase(BaseModel):
    """Schéma de base pour un rôle"""
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = None


class RoleCreate(RoleBase):
    """Schéma pour la création d'un rôle"""
    pass


class RoleResponse(RoleBase):
    """Schéma de réponse pour un rôle"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Authentication Schemas =============

class LoginRequest(BaseModel):
    """Schéma pour la requête de connexion"""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Schéma de réponse pour la connexion"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Schéma pour la requête de rafraîchissement du token"""
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    """Schéma de réponse pour le rafraîchissement du token"""
    access_token: str
    token_type: str = "bearer"


# ============= Password Reset Schemas =============

class PasswordResetRequest(BaseModel):
    """Schéma pour demander une réinitialisation de mot de passe"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schéma pour confirmer une réinitialisation de mot de passe"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('new_password')
    @classmethod
    def validate_confirm_password(cls, v):
        return validate_password_strength(v)


class PasswordChange(BaseModel):
    """Schéma pour changer le mot de passe"""
    old_password: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('new_password')
    @classmethod
    def validate_change_password(cls, v):
        return validate_password_strength(v)


# ============= Email Verification Schemas =============

class EmailVerificationRequest(BaseModel):
    """Schéma pour demander une vérification d'email"""
    email: EmailStr


class EmailVerificationConfirm(BaseModel):
    """Schéma pour confirmer une vérification d'email"""
    token: str


# ============= Token Schemas =============

class TokenPayload(BaseModel):
    """Schéma pour le payload du token"""
    sub: int  # user_id
    exp: datetime
    type: str  # "access" ou "refresh"


# ============= Response Schemas =============

class MessageResponse(BaseModel):
    """Schéma de réponse générique avec un message"""
    message: str
    detail: Optional[str] = None


# Mise à jour de la référence circulaire
UserResponse.model_rebuild()