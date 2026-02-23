from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

from app.models.subscriptions import SubscriptionFrequency, SubscriptionStatus, DeliveryStatus

# ============================================================================
# SCHÉMAS SUBSCRIPTION - Abonnements récurrents
# ============================================================================

class SubscriptionItemBase(BaseModel):
    """
    Schéma de base pour un item d'abonnement.
    
    Définit un produit et sa quantité dans un panier d'abonnement.
    La flexibilité permet au producteur de substituer le produit si nécessaire.
    """
    product_id: int = Field(..., gt=0, description="ID du produit à inclure")
    quantity: int = Field(..., gt=0, le=100, description="Quantité à livrer à chaque fois")
    is_flexible: bool = Field(False, description="Le producteur peut-il substituer ce produit ?")


class SubscriptionItemCreate(SubscriptionItemBase):
    """Schéma pour créer un item d'abonnement"""
    pass


class SubscriptionItemUpdate(BaseModel):
    """Schéma pour mettre à jour un item d'abonnement"""
    quantity: Optional[int] = Field(None, gt=0, le=100)
    is_flexible: Optional[bool] = None


class SubscriptionItemResponse(SubscriptionItemBase):
    """Schéma de réponse pour un item d'abonnement"""
    id: int
    subscription_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class SubscriptionBase(BaseModel):
    """
    Schéma de base pour un abonnement.
    
    Un abonnement permet à un client de recevoir régulièrement
    un panier de produits sans avoir à repasser commande à chaque fois.
    """
    name: str = Field(..., min_length=3, max_length=200, description="Nom de l'abonnement")
    frequency: SubscriptionFrequency = Field(..., description="Fréquence de livraison")
    price: Decimal = Field(..., gt=0, description="Prix à chaque livraison")
    next_delivery: date = Field(..., description="Date de la première/prochaine livraison")
    delivery_notes: Optional[str] = Field(None, max_length=500, description="Notes de livraison")


class SubscriptionCreate(SubscriptionBase):
    """
    Schéma pour créer un nouvel abonnement.
    
    Lors de la création, le client doit spécifier le producteur chez qui
    il s'abonne et la liste des produits qu'il souhaite recevoir.
    """
    producer_id: int = Field(..., gt=0, description="ID du producteur")
    items: List[SubscriptionItemCreate] = Field(..., min_length=1, description="Produits de l'abonnement")
    
    @field_validator('items')
    @classmethod
    def validate_items_not_empty(cls, v):
        """Valide qu'il y a au moins un produit dans l'abonnement"""
        if not v or len(v) == 0:
            raise ValueError("Un abonnement doit contenir au moins un produit")
        return v
    
    @field_validator('next_delivery')
    @classmethod
    def validate_next_delivery_future(cls, v):
        """Valide que la première livraison est dans le futur"""
        if v < date.today():
            raise ValueError("La date de première livraison doit être dans le futur")
        return v


class SubscriptionUpdate(BaseModel):
    """
    Schéma pour mettre à jour un abonnement existant.
    
    Le client peut modifier le nom, la fréquence, les notes de livraison,
    ou même changer le statut (pause/reprise/annulation).
    """
    name: Optional[str] = Field(None, min_length=3, max_length=200)
    frequency: Optional[SubscriptionFrequency] = None
    status: Optional[SubscriptionStatus] = None
    next_delivery: Optional[date] = None
    delivery_notes: Optional[str] = Field(None, max_length=500)
    
    @field_validator('next_delivery')
    @classmethod
    def validate_next_delivery_if_provided(cls, v):
        """Si une nouvelle date est fournie, elle doit être dans le futur"""
        if v is not None and v < date.today():
            raise ValueError("La nouvelle date de livraison doit être dans le futur")
        return v


class SubscriptionResponse(SubscriptionBase):
    """Schéma de réponse pour un abonnement"""
    id: int
    user_id: int
    producer_id: int
    status: SubscriptionStatus
    created_at: datetime
    updated_at: datetime
    cancelled_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class SubscriptionDetailResponse(SubscriptionResponse):
    """Schéma de réponse détaillé incluant les items de l'abonnement"""
    items: List[SubscriptionItemResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS SUBSCRIPTIONDELIVERY - Livraisons planifiées
# ============================================================================

class SubscriptionDeliveryBase(BaseModel):
    """
    Schéma de base pour une livraison planifiée.
    
    Représente une seule occurrence de livraison dans le cadre
    d'un abonnement récurrent.
    """
    delivery_date: date = Field(..., description="Date prévue de livraison")
    status: DeliveryStatus = Field(DeliveryStatus.SCHEDULED, description="Statut de la livraison")


class SubscriptionDeliveryCreate(SubscriptionDeliveryBase):
    """Schéma pour créer une livraison planifiée"""
    subscription_id: int = Field(..., gt=0)


class SubscriptionDeliveryUpdate(BaseModel):
    """
    Schéma pour mettre à jour une livraison planifiée.
    
    Permet principalement de marquer une livraison comme sautée
    ou de mettre à jour son statut.
    """
    status: Optional[DeliveryStatus] = None
    skipped: Optional[bool] = None
    skip_reason: Optional[str] = Field(None, max_length=500)


class SubscriptionDeliveryResponse(SubscriptionDeliveryBase):
    """Schéma de réponse pour une livraison planifiée"""
    id: int
    subscription_id: int
    order_id: Optional[int] = None
    skipped: bool
    skip_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    processed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class SubscriptionDeliverySkip(BaseModel):
    """
    Schéma pour sauter une livraison.
    
    Permet au client d'annuler une livraison planifiée spécifique
    sans affecter les suivantes ni annuler tout l'abonnement.
    """
    skip_reason: Optional[str] = Field(None, max_length=500, description="Raison de l'annulation (optionnel)")


# ============================================================================
# SCHÉMAS PRODUCTBUNDLE - Paniers pré-composés
# ============================================================================

class BundleItemBase(BaseModel):
    """
    Schéma de base pour un item de bundle.
    
    Définit un produit et sa quantité dans un panier pré-composé.
    """
    product_id: int = Field(..., gt=0, description="ID du produit")
    quantity: int = Field(..., gt=0, le=100, description="Quantité dans le bundle")


class BundleItemCreate(BundleItemBase):
    """Schéma pour créer un item de bundle"""
    pass


class BundleItemUpdate(BaseModel):
    """Schéma pour mettre à jour un item de bundle"""
    quantity: int = Field(..., gt=0, le=100)


class BundleItemResponse(BundleItemBase):
    """Schéma de réponse pour un item de bundle"""
    id: int
    bundle_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ProductBundleBase(BaseModel):
    """
    Schéma de base pour un panier pré-composé.
    
    Un bundle est une offre groupée de plusieurs produits vendus ensemble,
    souvent avec une réduction par rapport à l'achat séparé.
    """
    name: str = Field(..., min_length=3, max_length=200, description="Nom du bundle")
    description: Optional[str] = Field(None, description="Description du bundle")
    image_url: Optional[str] = Field(None, max_length=500, description="URL de l'image")
    price: Decimal = Field(..., gt=0, description="Prix du bundle")
    discount_percentage: Optional[Decimal] = Field(None, ge=0, le=100, description="Pourcentage de réduction")
    is_active: bool = Field(True, description="Le bundle est-il disponible ?")
    valid_from: Optional[datetime] = Field(None, description="Début de validité")
    valid_until: Optional[datetime] = Field(None, description="Fin de validité")
    stock_quantity: Optional[int] = Field(None, ge=0, description="Stock disponible (null = illimité)")


class ProductBundleCreate(ProductBundleBase):
    """
    Schéma pour créer un nouveau bundle.
    
    Le producteur doit spécifier tous les produits inclus dans le bundle
    avec leurs quantités respectives.
    """
    producer_id: int = Field(..., gt=0, description="ID du producteur")
    items: List[BundleItemCreate] = Field(..., min_length=1, description="Produits du bundle")
    
    @field_validator('items')
    @classmethod
    def validate_items_not_empty(cls, v):
        """Valide qu'il y a au moins un produit dans le bundle"""
        if not v or len(v) == 0:
            raise ValueError("Un bundle doit contenir au moins un produit")
        return v
    
    @field_validator('valid_until')
    @classmethod
    def validate_validity_period(cls, v, info):
        """Valide que la date de fin est après la date de début"""
        valid_from = info.data.get('valid_from')
        if valid_from and v and v <= valid_from:
            raise ValueError("La date de fin doit être après la date de début")
        return v


class ProductBundleUpdate(BaseModel):
    """
    Schéma pour mettre à jour un bundle existant.
    
    Le producteur peut modifier le nom, la description, le prix,
    les dates de validité ou désactiver le bundle.
    """
    name: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    price: Optional[Decimal] = Field(None, gt=0)
    discount_percentage: Optional[Decimal] = Field(None, ge=0, le=100)
    is_active: Optional[bool] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    
    @field_validator('valid_until')
    @classmethod
    def validate_validity_if_both_provided(cls, v, info):
        """Si les deux dates sont fournies, valide que fin > début"""
        valid_from = info.data.get('valid_from')
        if valid_from and v and v <= valid_from:
            raise ValueError("La date de fin doit être après la date de début")
        return v


class ProductBundleResponse(ProductBundleBase):
    """Schéma de réponse pour un bundle"""
    id: int
    producer_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ProductBundleDetailResponse(ProductBundleResponse):
    """Schéma de réponse détaillé incluant les items du bundle"""
    items: List[BundleItemResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS UTILITAIRES ET AGRÉGÉS
# ============================================================================

class SubscriptionStats(BaseModel):
    """
    Statistiques d'abonnements pour un producteur.
    
    Fournit une vue d'ensemble de l'activité d'abonnements d'un producteur
    pour l'aider à comprendre sa base d'abonnés.
    """
    total_subscriptions: int = Field(..., description="Nombre total d'abonnements")
    active_subscriptions: int = Field(..., description="Abonnements actifs")
    paused_subscriptions: int = Field(..., description="Abonnements en pause")
    cancelled_subscriptions: int = Field(..., description="Abonnements annulés")
    monthly_recurring_revenue: Decimal = Field(..., description="Revenu mensuel récurrent estimé")
    upcoming_deliveries: int = Field(..., description="Livraisons prévues dans les 7 prochains jours")


class BundleStats(BaseModel):
    """
    Statistiques de ventes de bundles.
    
    Aide le producteur à comprendre quels bundles sont populaires
    et génèrent le plus de revenus.
    """
    total_bundles: int = Field(..., description="Nombre de bundles créés")
    active_bundles: int = Field(..., description="Bundles actuellement disponibles")
    total_sales: int = Field(..., description="Nombre de bundles vendus")
    total_revenue: Decimal = Field(..., description="Revenu total généré par les bundles")


class UpcomingDelivery(BaseModel):
    """
    Résumé d'une livraison à venir.
    
    Vue condensée d'une livraison planifiée pour affichage
    dans une liste ou un calendrier.
    """
    delivery_id: int
    subscription_id: int
    subscription_name: str
    delivery_date: date
    status: DeliveryStatus
    order_id: Optional[int] = None
    can_skip: bool = Field(..., description="Le client peut-il encore sauter cette livraison ?")


class SubscriptionCalendar(BaseModel):
    """
    Vue calendrier des livraisons d'abonnements.
    
    Affiche toutes les livraisons planifiées pour un client
    sur une période donnée, permettant une vue d'ensemble.
    """
    user_id: int
    start_date: date
    end_date: date
    deliveries: List[UpcomingDelivery] = []
    total_deliveries: int


class BundlePurchase(BaseModel):
    """
    Schéma pour acheter un bundle.
    
    Simplifié car acheter un bundle revient à ajouter tous ses
    produits au panier en une seule fois.
    """
    bundle_id: int = Field(..., gt=0, description="ID du bundle à acheter")
    quantity: int = Field(1, gt=0, le=10, description="Nombre de bundles (généralement 1)")


class SubscriptionPause(BaseModel):
    """
    Schéma pour mettre en pause un abonnement.
    
    Permet au client de suspendre temporairement son abonnement
    sans l'annuler définitivement.
    """
    reason: Optional[str] = Field(None, max_length=500, description="Raison de la pause (optionnel)")
    resume_date: Optional[date] = Field(None, description="Date de reprise souhaitée (optionnel)")
    
    @field_validator('resume_date')
    @classmethod
    def validate_resume_date_future(cls, v):
        """Si une date de reprise est fournie, elle doit être future"""
        if v is not None and v <= date.today():
            raise ValueError("La date de reprise doit être dans le futur")
        return v


class SubscriptionCancel(BaseModel):
    """
    Schéma pour annuler un abonnement.
    
    Permet au client d'annuler définitivement son abonnement.
    La raison aide le producteur à comprendre pourquoi les clients annulent.
    """
    reason: Optional[str] = Field(None, max_length=500, description="Raison de l'annulation")
    feedback: Optional[str] = Field(None, max_length=1000, description="Commentaires supplémentaires")