from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, ConfigDict


# ============ WISHLIST SCHEMAS ============

class WishlistBase(BaseModel):
    """Schéma de base pour une liste de souhaits"""
    name: str = Field(..., min_length=1, max_length=100, description="Nom de la liste")
    description: Optional[str] = Field(None, description="Description de la liste")
    is_public: bool = Field(default=False, description="La liste est-elle publique?")
    sort_order: int = Field(default=0, ge=0, description="Ordre d'affichage")


class WishlistCreate(WishlistBase):
    """Schéma pour créer une liste de souhaits"""
    pass


class WishlistUpdate(BaseModel):
    """Schéma pour mettre à jour une liste de souhaits"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    is_public: Optional[bool] = None
    sort_order: Optional[int] = Field(None, ge=0)


class Wishlist(WishlistBase):
    """Schéma complet d'une liste de souhaits"""
    id: int
    user_id: int
    slug: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class WishlistWithItemsCount(Wishlist):
    """Liste de souhaits avec le nombre d'items"""
    items_count: int = 0


# ============ WISHLIST ITEM SCHEMAS ============

class WishlistItemBase(BaseModel):
    """Schéma de base pour un item de liste de souhaits"""
    notes: Optional[str] = Field(None, description="Notes personnelles sur le produit")
    desired_quantity: int = Field(default=1, ge=1, description="Quantité souhaitée")
    sort_order: int = Field(default=0, ge=0, description="Ordre d'affichage dans la liste")


class WishlistItemCreate(WishlistItemBase):
    """Schéma pour ajouter un produit à une liste de souhaits"""
    product_id: int = Field(..., description="ID du produit à ajouter")


class WishlistItemUpdate(BaseModel):
    """Schéma pour mettre à jour un item de liste de souhaits"""
    notes: Optional[str] = None
    desired_quantity: Optional[int] = Field(None, ge=1)
    sort_order: Optional[int] = Field(None, ge=0)


class WishlistItem(WishlistItemBase):
    """Schéma complet d'un item de liste de souhaits"""
    id: int
    wishlist_id: int
    product_id: int
    added_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class WishlistItemWithProduct(WishlistItem):
    """
    Item de liste de souhaits avec les détails du produit.
    Utile pour afficher la liste complète avec toutes les informations produits.
    """
    product: Optional[dict] = None  # Sera rempli avec les détails du produit
    
    model_config = ConfigDict(from_attributes=True)


class WishlistWithItems(Wishlist):
    """Liste de souhaits avec tous ses items et produits"""
    items: List[WishlistItemWithProduct] = []


# ============ PRODUCT FOLLOW SCHEMAS ============

class ProductFollowBase(BaseModel):
    """Schéma de base pour le suivi d'un produit"""
    notify_on_stock: bool = Field(
        default=True,
        description="Recevoir une notification quand le produit revient en stock"
    )
    notify_on_price_drop: bool = Field(
        default=False,
        description="Recevoir une notification en cas de baisse de prix"
    )
    price_threshold: Optional[int] = Field(
        None,
        ge=0,
        description="Seuil de prix en centimes (notifier si le prix descend en dessous)"
    )


class ProductFollowCreate(ProductFollowBase):
    """Schéma pour commencer à suivre un produit"""
    product_id: int = Field(..., description="ID du produit à suivre")


class ProductFollowUpdate(BaseModel):
    """Schéma pour mettre à jour les préférences de suivi d'un produit"""
    notify_on_stock: Optional[bool] = None
    notify_on_price_drop: Optional[bool] = None
    price_threshold: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = Field(
        None,
        description="Activer ou désactiver le suivi sans le supprimer"
    )


class ProductFollow(ProductFollowBase):
    """Schéma complet d'un suivi de produit"""
    id: int
    user_id: int
    product_id: int
    initial_price: Optional[int] = None
    is_active: bool
    created_at: datetime
    last_notified_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ProductFollowWithProduct(ProductFollow):
    """Suivi de produit avec les détails du produit"""
    product: Optional[dict] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============ PRODUCER FOLLOW SCHEMAS ============

class ProducerFollowBase(BaseModel):
    """Schéma de base pour le suivi d'un producteur"""
    notify_on_new_product: bool = Field(
        default=True,
        description="Recevoir une notification lors de nouveaux produits"
    )
    notify_on_promotion: bool = Field(
        default=False,
        description="Recevoir une notification lors de promotions"
    )
    notify_on_blog_post: bool = Field(
        default=False,
        description="Recevoir une notification lors de nouveaux articles"
    )


class ProducerFollowCreate(ProducerFollowBase):
    """Schéma pour commencer à suivre un producteur"""
    producer_id: int = Field(..., description="ID du producteur à suivre")
    
    @field_validator('producer_id')
    def validate_producer_id(cls, v):
        """Valide que l'ID n'est pas négatif"""
        if v <= 0:
            raise ValueError("L'ID du producteur doit être positif")
        return v


class ProducerFollowUpdate(BaseModel):
    """Schéma pour mettre à jour les préférences de suivi d'un producteur"""
    notify_on_new_product: Optional[bool] = None
    notify_on_promotion: Optional[bool] = None
    notify_on_blog_post: Optional[bool] = None
    is_active: Optional[bool] = Field(
        None,
        description="Activer ou désactiver le suivi sans le supprimer"
    )


class ProducerFollow(ProducerFollowBase):
    """Schéma complet d'un suivi de producteur"""
    id: int
    user_id: int
    producer_id: int
    is_active: bool
    created_at: datetime
    last_notified_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ProducerFollowWithProducer(ProducerFollow):
    """Suivi de producteur avec les détails du producteur"""
    producer: Optional[dict] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============ RESPONSE SCHEMAS ============

class WishlistStats(BaseModel):
    """Statistiques sur les listes de souhaits d'un utilisateur"""
    total_wishlists: int = Field(description="Nombre total de listes")
    total_items: int = Field(description="Nombre total d'items dans toutes les listes")
    public_wishlists: int = Field(description="Nombre de listes publiques")
    most_popular_wishlist: Optional[str] = Field(
        None,
        description="Nom de la liste avec le plus d'items"
    )


class FollowStats(BaseModel):
    """Statistiques sur les suivis d'un utilisateur"""
    products_followed: int = Field(description="Nombre de produits suivis")
    producers_followed: int = Field(description="Nombre de producteurs suivis")
    active_notifications: int = Field(
        description="Nombre de notifications actives (produits et producteurs)"
    )


class MoveItemRequest(BaseModel):
    """Schéma pour déplacer un item d'une liste à une autre"""
    target_wishlist_id: int = Field(..., description="ID de la liste de destination")
    item_id: int = Field(..., description="ID de l'item à déplacer")


class BulkAddToWishlistRequest(BaseModel):
    """Schéma pour ajouter plusieurs produits à une liste en une fois"""
    product_ids: List[int] = Field(
        ...,
        min_items=1,
        max_items=50,
        description="Liste des IDs de produits à ajouter (max 50)"
    )
    notes: Optional[str] = Field(None, description="Notes communes pour tous les produits")
    
    @field_validator('product_ids')
    def validate_unique_ids(cls, v):
        """Vérifie qu'il n'y a pas de doublons dans la liste"""
        if len(v) != len(set(v)):
            raise ValueError("La liste contient des IDs en double")
        return v


class ShareWishlistResponse(BaseModel):
    """Réponse lors du partage d'une liste"""
    share_url: str = Field(description="URL de partage de la liste")
    slug: str = Field(description="Slug unique de la liste")
    expires_at: Optional[datetime] = Field(
        None,
        description="Date d'expiration du lien (si applicable)"
    )