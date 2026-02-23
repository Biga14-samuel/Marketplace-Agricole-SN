from datetime import datetime, date, timezone
from typing import Optional, List, Dict, Any
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator, ConfigDict
from enum import Enum


# ============ ÉNUMÉRATIONS ============

class ActionTypeEnum(str, Enum):
    """Types d'actions administratives (copie de l'enum SQLAlchemy pour Pydantic)"""
    USER_CREATE = "user_create"
    USER_UPDATE = "user_update"
    USER_DELETE = "user_delete"
    USER_BAN = "user_ban"
    USER_UNBAN = "user_unban"
    USER_VERIFY = "user_verify"
    PRODUCT_CREATE = "product_create"
    PRODUCT_UPDATE = "product_update"
    PRODUCT_DELETE = "product_delete"
    PRODUCT_APPROVE = "product_approve"
    PRODUCT_REJECT = "product_reject"
    ORDER_CANCEL = "order_cancel"
    ORDER_REFUND = "order_refund"
    CONTENT_MODERATE = "content_moderate"
    CONTENT_DELETE = "content_delete"
    SETTING_UPDATE = "setting_update"
    COMMISSION_UPDATE = "commission_update"
    TAX_RATE_UPDATE = "tax_rate_update"
    EXPORT_DATA = "export_data"
    BULK_OPERATION = "bulk_operation"


class ModerationStatusEnum(str, Enum):
    """Statuts de modération de contenu"""
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    DISMISSED = "dismissed"


class SettingTypeEnum(str, Enum):
    """Types de valeurs pour les paramètres système"""
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    JSON = "json"


# ============ ADMIN ACTION SCHEMAS ============

class AdminActionBase(BaseModel):
    """Schéma de base pour une action administrative"""
    action_type: ActionTypeEnum = Field(..., description="Type d'action effectuée")
    description: Optional[str] = Field(None, description="Description textuelle de l'action")
    target_entity: Optional[str] = Field(None, max_length=50, description="Type d'entité ciblée")
    target_id: Optional[int] = Field(None, description="ID de l'entité ciblée")
    changes: Optional[Dict[str, Any]] = Field(None, description="Modifications effectuées")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Métadonnées additionnelles")


class AdminActionCreate(AdminActionBase):
    """
    Schéma pour enregistrer une nouvelle action administrative.
    L'admin_id, l'ip_address et le user_agent sont capturés automatiquement par le système.
    """
    pass


class AdminAction(AdminActionBase):
    """Schéma complet d'une action administrative"""
    id: int
    admin_id: Optional[int] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class AdminActionWithAdmin(AdminAction):
    """Action administrative avec les détails de l'administrateur qui l'a effectuée"""
    admin: Optional[Dict[str, Any]] = Field(None, description="Détails de l'administrateur")


# ============ BANNED USER SCHEMAS ============

class BannedUserBase(BaseModel):
    """Schéma de base pour un bannissement"""
    reason: str = Field(..., min_length=10, description="Raison du bannissement")
    violation_type: Optional[str] = Field(None, max_length=50, description="Type de violation")
    is_permanent: bool = Field(default=False, description="Bannissement permanent ou temporaire")
    banned_until: Optional[datetime] = Field(None, description="Date de fin du bannissement")
    evidence: Optional[Dict[str, Any]] = Field(None, description="Preuves du bannissement")
    
    @field_validator('banned_until')
    @classmethod
    def validate_banned_until(cls, v, info):
        is_permanent = info.data.get('is_permanent', False)
        
        if not is_permanent and v is None:
            raise ValueError("Une date de fin est requise pour un bannissement temporaire")
        
        if is_permanent and v is not None:
            raise ValueError("Un bannissement permanent ne doit pas avoir de date de fin")
        
        if v and v <= datetime.now(timezone.utc).replace(tzinfo=None):
            raise ValueError("La date de fin doit être dans le futur")
        
        return v


class BannedUserCreate(BannedUserBase):
    """Schéma pour bannir un utilisateur"""
    user_id: int = Field(..., description="ID de l'utilisateur à bannir")


class BannedUserUpdate(BaseModel):
    """Schéma pour modifier un bannissement existant"""
    reason: Optional[str] = Field(None, min_length=10)
    banned_until: Optional[datetime] = None
    is_permanent: Optional[bool] = None


class UnbanUser(BaseModel):
    """Schéma pour débannir un utilisateur"""
    reason: str = Field(..., min_length=10, description="Raison du débannissement")


class BannedUser(BannedUserBase):
    """Schéma complet d'un utilisateur banni"""
    id: int
    user_id: int
    banned_by: Optional[int] = None
    previous_bans_count: int
    is_active: bool
    created_at: datetime
    unbanned_at: Optional[datetime] = None
    unbanned_by: Optional[int] = None
    unban_reason: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class BannedUserWithDetails(BannedUser):
    """Utilisateur banni avec les détails de l'utilisateur et du modérateur"""
    user: Optional[Dict[str, Any]] = Field(None, description="Détails de l'utilisateur banni")
    banner: Optional[Dict[str, Any]] = Field(None, description="Détails du modérateur")


# ============ CONTENT MODERATION SCHEMAS ============

class ContentModerationBase(BaseModel):
    """Schéma de base pour un signalement de contenu"""
    content_type: str = Field(..., max_length=50, description="Type de contenu signalé")
    content_id: int = Field(..., description="ID du contenu signalé")
    reason: str = Field(..., max_length=100, description="Raison du signalement")
    description: Optional[str] = Field(None, description="Détails supplémentaires")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Métadonnées additionnelles")


class ContentModerationCreate(ContentModerationBase):
    """
    Schéma pour créer un signalement de contenu.
    Le reported_by est automatiquement renseigné avec l'utilisateur connecté.
    """
    pass


class ContentModerationUpdate(BaseModel):
    """Schéma pour mettre à jour le statut d'un signalement"""
    status: Optional[ModerationStatusEnum] = None
    priority: Optional[int] = Field(None, ge=0, le=10, description="Priorité de 0 (faible) à 10 (urgent)")
    moderator_notes: Optional[str] = None
    action_taken: Optional[str] = Field(None, max_length=100, description="Action prise par le modérateur")


class ContentModerationReview(BaseModel):
    """Schéma pour qu'un modérateur examine un signalement"""
    status: ModerationStatusEnum = Field(..., description="Décision du modérateur")
    moderator_notes: str = Field(..., min_length=10, description="Notes du modérateur")
    action_taken: str = Field(..., max_length=100, description="Action prise")


class ContentModeration(ContentModerationBase):
    """Schéma complet d'un signalement de contenu"""
    id: int
    reported_by: Optional[int] = None
    status: ModerationStatusEnum
    priority: int
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    moderator_notes: Optional[str] = None
    action_taken: Optional[str] = None
    reports_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ContentModerationWithDetails(ContentModeration):
    """Signalement avec les détails du rapporteur et du modérateur"""
    reporter: Optional[Dict[str, Any]] = Field(None, description="Détails du rapporteur")
    reviewer: Optional[Dict[str, Any]] = Field(None, description="Détails du modérateur")


# ============ SYSTEM SETTING SCHEMAS ============

class SystemSettingBase(BaseModel):
    """Schéma de base pour un paramètre système"""
    key: str = Field(..., min_length=1, max_length=100, description="Clé unique du paramètre")
    value: str = Field(..., description="Valeur du paramètre")
    type: SettingTypeEnum = Field(default=SettingTypeEnum.STRING, description="Type de données")
    description: Optional[str] = Field(None, description="Description du paramètre")
    is_public: bool = Field(default=False, description="Visible publiquement via l'API")
    category: Optional[str] = Field(None, max_length=50, description="Catégorie du paramètre")
    requires_restart: bool = Field(default=False, description="Nécessite un redémarrage de l'application")
    
    @field_validator('key')
    def validate_key_format(cls, v):
        """
        Les clés doivent suivre la convention snake_case.
        Exemples valides: maintenance_mode, max_upload_size, stripe_api_key
        """
        if not v.replace('_', '').isalnum():
            raise ValueError("La clé ne peut contenir que des lettres, chiffres et underscores")
        
        if v != v.lower():
            raise ValueError("La clé doit être en minuscules")
        
        return v


class SystemSettingCreate(SystemSettingBase):
    """Schéma pour créer un nouveau paramètre système"""
    allowed_values: Optional[List[str]] = Field(None, description="Valeurs autorisées")
    min_value: Optional[Decimal] = Field(None, description="Valeur minimale (pour les nombres)")
    max_value: Optional[Decimal] = Field(None, description="Valeur maximale (pour les nombres)")


class SystemSettingUpdate(BaseModel):
    """
    Schéma pour mettre à jour un paramètre système.
    Seule la valeur et la description peuvent généralement être modifiées.
    """
    value: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None


class SystemSetting(SystemSettingBase):
    """Schéma complet d'un paramètre système"""
    id: int
    allowed_values: Optional[List[str]] = None
    min_value: Optional[Decimal] = None
    max_value: Optional[Decimal] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    updated_by: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


class SystemSettingPublic(BaseModel):
    """
    Schéma pour les paramètres système visibles publiquement.
    Ne contient que les informations non sensibles.
    """
    key: str
    value: str
    type: SettingTypeEnum
    description: Optional[str] = None
    category: Optional[str] = None


# ============ COMMISSION SCHEMAS ============

class CommissionBase(BaseModel):
    """Schéma de base pour une commission"""
    producer_id: Optional[int] = Field(None, description="ID du producteur (NULL = taux par défaut)")
    category_id: Optional[int] = Field(None, description="ID de la catégorie (NULL = toutes catégories)")
    percentage: Optional[Decimal] = Field(None, ge=0, le=100, description="Taux en pourcentage")
    fixed_amount: Optional[Decimal] = Field(None, ge=0, description="Montant fixe en euros")
    min_transaction_amount: Optional[Decimal] = Field(None, ge=0, description="Montant minimum de transaction")
    max_transaction_amount: Optional[Decimal] = Field(None, ge=0, description="Montant maximum de transaction")
    valid_from: date = Field(..., description="Date de début de validité")
    valid_until: Optional[date] = Field(None, description="Date de fin de validité")
    notes: Optional[str] = Field(None, description="Notes et raisons")
    
    @field_validator('percentage', 'fixed_amount', mode='after')
    @classmethod
    def validate_amounts(cls, v):
        if v is not None and v < 0:
            raise ValueError('Le montant ou pourcentage doit être positif')
        return v
    
    @field_validator('valid_until')
    @classmethod
    def validate_validity_period(cls, v, info):
        """La date de fin doit être après la date de début"""
        valid_from = info.data.get('valid_from')
        
        if v and valid_from and v <= valid_from:
            raise ValueError("La date de fin doit être postérieure à la date de début")
        
        return v


class CommissionCreate(CommissionBase):
    """Schéma pour créer une nouvelle règle de commission"""
    pass


class CommissionUpdate(BaseModel):
    """Schéma pour mettre à jour une commission existante"""
    percentage: Optional[Decimal] = Field(None, ge=0, le=100)
    fixed_amount: Optional[Decimal] = Field(None, ge=0)
    valid_until: Optional[date] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None


class Commission(CommissionBase):
    """Schéma complet d'une commission"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


class CommissionWithDetails(Commission):
    """Commission avec les détails du producteur et de la catégorie"""
    producer: Optional[Dict[str, Any]] = Field(None, description="Détails du producteur")
    category: Optional[Dict[str, Any]] = Field(None, description="Détails de la catégorie")


# ============ TAX RATE SCHEMAS ============

class TaxRateBase(BaseModel):
    """Schéma de base pour un taux de TVA"""
    country: str = Field(..., min_length=2, max_length=2, description="Code pays ISO 2 lettres")
    category_id: Optional[int] = Field(None, description="ID de la catégorie (NULL = taux par défaut)")
    rate: Decimal = Field(..., ge=0, le=100, description="Taux de TVA en pourcentage")
    name: Optional[str] = Field(None, max_length=100, description="Nom descriptif du taux")
    description: Optional[str] = Field(None, description="Description légale")
    valid_from: date = Field(..., description="Date de début de validité")
    valid_until: Optional[date] = Field(None, description="Date de fin de validité")
    regulation_reference: Optional[str] = Field(None, max_length=200, description="Référence légale")
    
    @field_validator('country')
    def validate_country_code(cls, v):
        """Le code pays doit être en majuscules"""
        v = v.upper()
              
        return v
    
    @field_validator('valid_until')
    @classmethod
    def validate_validity_period(cls, v, info):
        """La date de fin doit être après la date de début"""
        valid_from = info.data.get('valid_from')
        
        if v and valid_from and v <= valid_from:
            raise ValueError("La date de fin doit être postérieure à la date de début")
        
        return v


class TaxRateCreate(TaxRateBase):
    """Schéma pour créer un nouveau taux de TVA"""
    pass


class TaxRateUpdate(BaseModel):
    """Schéma pour mettre à jour un taux de TVA existant"""
    rate: Optional[Decimal] = Field(None, ge=0, le=100)
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    valid_until: Optional[date] = None
    is_active: Optional[bool] = None


class TaxRate(TaxRateBase):
    """Schéma complet d'un taux de TVA"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class TaxRateWithCategory(TaxRate):
    """Taux de TVA avec les détails de la catégorie"""
    category: Optional[Dict[str, Any]] = Field(None, description="Détails de la catégorie")


# ============ RESPONSE SCHEMAS SPÉCIAUX ============

class AdminStats(BaseModel):
    """Statistiques générales pour le tableau de bord administrateur"""
    total_users: int = Field(description="Nombre total d'utilisateurs")
    active_users: int = Field(description="Utilisateurs actifs")
    banned_users: int = Field(description="Utilisateurs bannis")
    pending_moderations: int = Field(description="Signalements en attente")
    total_orders_today: int = Field(description="Commandes du jour")
    revenue_today: Decimal = Field(description="Revenu du jour")
    recent_actions: List[AdminAction] = Field(description="Actions administratives récentes")


class ModerationQueue(BaseModel):
    """File d'attente de modération avec statistiques"""
    total_pending: int = Field(description="Total de signalements en attente")
    high_priority: int = Field(description="Signalements haute priorité")
    by_content_type: Dict[str, int] = Field(description="Répartition par type de contenu")
    oldest_pending: Optional[ContentModeration] = Field(None, description="Signalement le plus ancien")


class SystemHealth(BaseModel):
    """État de santé du système"""
    status: str = Field(description="'healthy', 'degraded', ou 'down'")
    database_status: str = Field(description="État de la base de données")
    cache_status: str = Field(description="État du cache")
    queue_status: str = Field(description="État des files de tâches")
    last_backup: Optional[datetime] = Field(None, description="Dernière sauvegarde")
    disk_usage_percent: Decimal = Field(description="Utilisation disque en %")