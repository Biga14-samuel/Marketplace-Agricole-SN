from pydantic import BaseModel, Field, field_validator, ConfigDict
from datetime import datetime
from typing import Optional
from decimal import Decimal

from app.models.promotions import (
    CouponType, PromotionType, LoyaltyTransactionType, RewardType
)


# ============================================================================
# Code promotionnel
# ============================================================================

class CouponBase(BaseModel):
    """Schéma de base pour un coupon (champs communs)"""
    code: str = Field(..., min_length=3, max_length=50, description="Code du coupon (ex: NOEL2025)")
    type: CouponType
    value: Decimal = Field(..., gt=0, description="Valeur de la réduction")
    min_order_amount: Optional[Decimal] = Field(None, ge=0)
    max_discount: Optional[Decimal] = Field(None, ge=0)
    usage_limit: Optional[int] = Field(None, ge=1)
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True
    
    @field_validator('code')
    @classmethod
    def validate_code(cls, v):
        """Valide et normalise le code du coupon"""
        code = v.strip().upper()
        if not code:
            raise ValueError("Le code ne peut pas être vide")
        # Vérifier que le code ne contient que des caractères alphanumériques
        if not code.replace('-', '').replace('_', '').isalnum():
            raise ValueError("Le code ne peut contenir que des lettres, chiffres, tirets et underscores")
        return code
    
    @field_validator('valid_until')
    @classmethod
    def validate_dates(cls, v, info):
        """Valide que la date de fin est après la date de début"""
        if 'valid_from' in info.data and v <= info.data['valid_from']:
            raise ValueError("La date de fin doit être après la date de début")
        return v
    
    @field_validator('value')
    @classmethod
    def validate_value(cls, v, info):
        """Valide la valeur selon le type de coupon"""
        if v.as_tuple().exponent < -2:
            raise ValueError("La valeur ne peut avoir plus de 2 décimales")
        
        # Pour les pourcentages, vérifier que la valeur est entre 0 et 100
        if 'type' in info.data and info.data['type'] == CouponType.PERCENTAGE:
            if v > 100:
                raise ValueError("Le pourcentage ne peut pas dépasser 100%")
        
        return v


class CouponCreate(CouponBase):
    """Schéma pour créer un nouveau coupon"""
    pass


class CouponUpdate(BaseModel):
    """Schéma pour mettre à jour un coupon existant"""
    is_active: Optional[bool] = None
    usage_limit: Optional[int] = Field(None, ge=1)
    valid_until: Optional[datetime] = None


class CouponResponse(CouponBase):
    """Schéma de réponse pour un coupon"""
    id: int
    used_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS COUPONUSAGE : Utilisation de coupon
# ============================================================================

class CouponUsageBase(BaseModel):
    """Schéma de base pour une utilisation de coupon"""
    coupon_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    order_id: int = Field(..., gt=0)
    discount_amount: Decimal = Field(..., ge=0)


class CouponUsageCreate(CouponUsageBase):
    """Schéma pour enregistrer une utilisation de coupon"""
    pass


class CouponUsageResponse(CouponUsageBase):
    """Schéma de réponse pour une utilisation de coupon"""
    id: int
    used_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS PROMOTION : Promotion produit
# ============================================================================

class PromotionBase(BaseModel):
    """Schéma de base pour une promotion produit"""
    product_id: int = Field(..., gt=0)
    type: PromotionType
    discount_percentage: Decimal = Field(..., gt=0, le=100, description="Pourcentage de réduction (0-100)")
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    
    @field_validator('end_date')
    @classmethod
    def validate_dates(cls, v, info):
        """Valide que la date de fin est après la date de début"""
        if 'start_date' in info.data and v <= info.data['start_date']:
            raise ValueError("La date de fin doit être après la date de début")
        return v
    
    @field_validator('discount_percentage')
    @classmethod
    def validate_percentage(cls, v):
        """Valide le pourcentage de réduction"""
        if v.as_tuple().exponent < -2:
            raise ValueError("Le pourcentage ne peut avoir plus de 2 décimales")
        return v


class PromotionCreate(PromotionBase):
    """Schéma pour créer une nouvelle promotion"""
    pass


class PromotionUpdate(BaseModel):
    """Schéma pour mettre à jour une promotion"""
    is_active: Optional[bool] = None
    end_date: Optional[datetime] = None


class PromotionResponse(PromotionBase):
    """Schéma de réponse pour une promotion"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS LOYALTYPROGRAM : Programme de fidélité
# ============================================================================

class LoyaltyProgramBase(BaseModel):
    """Schéma de base pour un programme de fidélité"""
    name: str = Field(..., min_length=3, max_length=100)
    points_per_euro: Decimal = Field(..., gt=0, description="Nombre de points gagnés par euro dépensé")
    description: Optional[str] = None
    is_active: bool = True
    
    @field_validator('points_per_euro')
    @classmethod
    def validate_points_per_euro(cls, v):
        """Valide le taux de conversion"""
        if v.as_tuple().exponent < -2:
            raise ValueError("Le taux ne peut avoir plus de 2 décimales")
        return v


class LoyaltyProgramCreate(LoyaltyProgramBase):
    """Schéma pour créer un nouveau programme de fidélité"""
    pass


class LoyaltyProgramUpdate(BaseModel):
    """Schéma pour mettre à jour un programme de fidélité"""
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    points_per_euro: Optional[Decimal] = Field(None, gt=0)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class LoyaltyProgramResponse(LoyaltyProgramBase):
    """Schéma de réponse pour un programme de fidélité"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS LOYALTYPOINT : Solde de points
# ============================================================================

class LoyaltyPointBase(BaseModel):
    """Schéma de base pour un solde de points"""
    user_id: int = Field(..., gt=0)
    balance: int = Field(default=0, ge=0)
    lifetime_earned: int = Field(default=0, ge=0)
    lifetime_spent: int = Field(default=0, ge=0)


class LoyaltyPointCreate(LoyaltyPointBase):
    """Schéma pour créer un nouveau solde de points"""
    pass


class LoyaltyPointResponse(LoyaltyPointBase):
    """Schéma de réponse pour un solde de points"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS LOYALTYTRANSACTION : Transaction de points
# ============================================================================

class LoyaltyTransactionBase(BaseModel):
    """Schéma de base pour une transaction de points"""
    user_id: int = Field(..., gt=0)
    type: LoyaltyTransactionType
    points: int = Field(..., description="Positif pour earned, négatif pour spent/expired")
    order_id: Optional[int] = Field(None, gt=0)
    description: Optional[str] = None


class LoyaltyTransactionCreate(LoyaltyTransactionBase):
    """Schéma pour créer une nouvelle transaction de points"""
    pass


class LoyaltyTransactionResponse(LoyaltyTransactionBase):
    """Schéma de réponse pour une transaction de points"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS REWARD : Récompense
# ============================================================================

class RewardBase(BaseModel):
    """Schéma de base pour une récompense"""
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    points_cost: int = Field(..., gt=0, description="Coût en points de fidélité")
    type: RewardType
    value: Decimal = Field(..., gt=0, description="Valeur de la récompense")
    stock: Optional[int] = Field(None, ge=0, description="Stock disponible (null = illimité)")
    is_active: bool = True
    
    @field_validator('value')
    @classmethod
    def validate_value(cls, v):
        """Valide la valeur de la récompense"""
        if v.as_tuple().exponent < -2:
            raise ValueError("La valeur ne peut avoir plus de 2 décimales")
        return v


class RewardCreate(RewardBase):
    """Schéma pour créer une nouvelle récompense"""
    pass


class RewardUpdate(BaseModel):
    """Schéma pour mettre à jour une récompense"""
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = None
    points_cost: Optional[int] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class RewardResponse(RewardBase):
    """Schéma de réponse pour une récompense"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Échange de récompense
# ============================================================================

class RewardRedemptionBase(BaseModel):
    """Schéma de base pour un échange de récompense"""
    user_id: int = Field(..., gt=0)
    reward_id: int = Field(..., gt=0)
    order_id: Optional[int] = Field(None, gt=0)


class RewardRedemptionCreate(RewardRedemptionBase):
    """Schéma pour créer un nouvel échange de récompense"""
    pass


class RewardRedemptionResponse(RewardRedemptionBase):
    """Schéma de réponse pour un échange de récompense"""
    id: int
    redeemed_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS DE VALIDATION ET DE CALCUL
# ============================================================================

class CouponValidation(BaseModel):
    """Résultat de validation d'un coupon"""
    is_valid: bool
    message: str
    discount_amount: Optional[Decimal] = None
    final_amount: Optional[Decimal] = None


class PointsCalculation(BaseModel):
    """Calcul de points pour un montant d'achat"""
    order_amount: Decimal
    points_earned: int
    program_rate: Decimal