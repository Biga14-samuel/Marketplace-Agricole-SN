from pydantic import BaseModel, Field, field_validator, ConfigDict
from datetime import datetime
from typing import Optional, Dict, Any
from decimal import Decimal

from app.models.payments import (
    PaymentStatus, PaymentMethodType, PaymentProvider,
    RefundStatus, InvoiceStatus, PayoutStatus
)


# ============================================================================
# Transaction de paiement
# ============================================================================

class PaymentBase(BaseModel):
    """Schéma de base pour un paiement (champs communs)"""
    payment_method: PaymentMethodType
    amount: Decimal = Field(..., gt=0, description="Montant doit être positif")
    currency: str = Field(default="XAF", min_length=3, max_length=3)
    provider: Optional[PaymentProvider] = None
    additional_data: Optional[Dict[str, Any]] = None


class PaymentCreate(PaymentBase):
    """Schéma pour créer un nouveau paiement"""
    order_id: int = Field(..., gt=0)
    transaction_id: Optional[str] = None
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        """Valide que le montant a maximum 2 décimales"""
        if v.as_tuple().exponent < -2:
            raise ValueError("Le montant ne peut avoir plus de 2 décimales")
        return v


class PaymentUpdate(BaseModel):
    """Schéma pour mettre à jour un paiement existant"""
    status: Optional[PaymentStatus] = None
    transaction_id: Optional[str] = None
    additional_data: Optional[Dict[str, Any]] = None


class PaymentResponse(PaymentBase):
    """Schéma de réponse pour un paiement"""
    id: int
    order_id: int
    status: PaymentStatus
    transaction_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS PAYMENTMETHOD : Moyen de paiement sauvegardé
# ============================================================================

class PaymentMethodBase(BaseModel):
    """Schéma de base pour un moyen de paiement"""
    type: PaymentMethodType
    last4: Optional[str] = Field(None, min_length=4, max_length=4)
    brand: Optional[str] = Field(None, max_length=50)
    is_default: bool = False


class PaymentMethodCreate(PaymentMethodBase):
    """
    Schéma pour créer un nouveau moyen de paiement
    ⚠️ SÉCURITÉ: user_id ne doit JAMAIS venir du body - il vient du JWT
    """
    # ❌ SUPPRIMÉ: user_id: int = Field(..., gt=0)  # FAILLE DE SÉCURITÉ
    # ✅ Le user_id sera récupéré depuis current_user dans le router
    stripe_payment_method_id: Optional[str] = None


class PaymentMethodUpdate(BaseModel):
    """Schéma pour mettre à jour un moyen de paiement"""
    is_default: Optional[bool] = None
    
    # Note : On ne permet généralement pas de modifier les autres champs
    # car ils sont liés au fournisseur de paiement


class PaymentMethodResponse(PaymentMethodBase):
    """Schéma de réponse pour un moyen de paiement"""
    id: int
    user_id: int
    stripe_payment_method_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS REFUND : Remboursement
# ============================================================================

class RefundBase(BaseModel):
    """Schéma de base pour un remboursement"""
    amount: Decimal = Field(..., gt=0)
    reason: Optional[str] = None
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        """Valide que le montant a maximum 2 décimales"""
        if v.as_tuple().exponent < -2:
            raise ValueError("Le montant ne peut avoir plus de 2 décimales")
        return v


class RefundCreate(RefundBase):
    """Schéma pour créer un nouveau remboursement"""
    payment_id: int = Field(..., gt=0)


class RefundUpdate(BaseModel):
    """Schéma pour mettre à jour un remboursement"""
    status: Optional[RefundStatus] = None


class RefundResponse(RefundBase):
    """Schéma de réponse pour un remboursement"""
    id: int
    payment_id: int
    status: RefundStatus
    created_at: datetime
    processed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS INVOICE : Facture
# ============================================================================

class InvoiceBase(BaseModel):
    """Schéma de base pour une facture"""
    subtotal: Decimal = Field(..., ge=0)
    tax_amount: Decimal = Field(default=Decimal("0"), ge=0)
    total: Decimal = Field(..., gt=0)
    
    @field_validator('subtotal', 'tax_amount', 'total')
    @classmethod
    def validate_amounts(cls, v):
        """Valide que les montants ont maximum 2 décimales"""
        if v.as_tuple().exponent < -2:
            raise ValueError("Les montants ne peuvent avoir plus de 2 décimales")
        return v


class InvoiceCreate(InvoiceBase):
    """Schéma pour créer une nouvelle facture"""
    order_id: int = Field(..., gt=0)
    invoice_number: str = Field(..., min_length=1, max_length=50)
    due_date: Optional[datetime] = None
    
    @field_validator('invoice_number')
    @classmethod
    def validate_invoice_number(cls, v):
        """Valide le format du numéro de facture"""
        if not v.strip():
            raise ValueError("Le numéro de facture ne peut pas être vide")
        return v.strip().upper()


class InvoiceUpdate(BaseModel):
    """Schéma pour mettre à jour une facture"""
    status: Optional[InvoiceStatus] = None
    file_path: Optional[str] = None
    due_date: Optional[datetime] = None


class InvoiceResponse(InvoiceBase):
    """Schéma de réponse pour une facture"""
    id: int
    order_id: int
    invoice_number: str
    issue_date: datetime
    due_date: Optional[datetime] = None
    status: InvoiceStatus
    file_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS PRODUCERPAYOUT : Versement producteur
# ============================================================================

class ProducerPayoutBase(BaseModel):
    """Schéma de base pour un versement producteur"""
    period_start: datetime
    period_end: datetime
    gross_amount: Decimal = Field(..., ge=0)
    commission: Decimal = Field(..., ge=0)
    net_amount: Decimal = Field(..., ge=0)
    
    @field_validator('gross_amount', 'commission', 'net_amount')
    @classmethod
    def validate_amounts(cls, v):
        """Valide que les montants ont maximum 2 décimales"""
        if v.as_tuple().exponent < -2:
            raise ValueError("Les montants ne peuvent avoir plus de 2 décimales")
        return v
    
    @field_validator('period_end')
    @classmethod
    def validate_period(cls, v, info):
        """Valide que la période de fin est après le début"""
        if 'period_start' in info.data and v <= info.data['period_start']:
            raise ValueError("La date de fin doit être après la date de début")
        return v


class ProducerPayoutCreate(ProducerPayoutBase):
    """Schéma pour créer un nouveau versement producteur"""
    producer_id: int = Field(..., gt=0)


class ProducerPayoutUpdate(BaseModel):
    """Schéma pour mettre à jour un versement producteur"""
    status: Optional[PayoutStatus] = None
    paid_at: Optional[datetime] = None


class ProducerPayoutResponse(ProducerPayoutBase):
    """Schéma de réponse pour un versement producteur"""
    id: int
    producer_id: int
    status: PayoutStatus
    created_at: datetime
    paid_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS DE CALCUL ET STATISTIQUES
# ============================================================================

class PaymentStats(BaseModel):
    """Statistiques sur les paiements"""
    total_payments: int
    total_amount: Decimal
    completed_amount: Decimal
    pending_amount: Decimal
    failed_count: int
    refunded_amount: Decimal


class ProducerPayoutCalculation(BaseModel):
    """Résultat du calcul d'un versement producteur"""
    producer_id: int
    period_start: datetime
    period_end: datetime
    total_orders: int
    gross_amount: Decimal
    commission_rate: Decimal  # Taux de commission (ex: 0.15 pour 15%)
    commission_amount: Decimal
    net_amount: Decimal
