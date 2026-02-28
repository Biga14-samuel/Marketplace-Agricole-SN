from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from enum import Enum
import re


# ============= Enums =============

class TagTypeEnum(str, Enum):
    """Types de tags"""
    BIO = "bio"
    LOCAL = "local"
    SEASON = "season"
    PROMO = "promo"


class UnitTypeEnum(str, Enum):
    """Types d'unités"""
    WEIGHT = "weight"
    VOLUME = "volume"
    PIECE = "piece"


class StockMovementTypeEnum(str, Enum):
    """Types de mouvements de stock"""
    IN = "in"
    OUT = "out"
    ADJUSTMENT = "adjustment"


# ============= Category Schemas =============

class CategoryBase(BaseModel):
    """Schéma de base pour une catégorie"""
    name: str = Field(..., min_length=2, max_length=100)
    slug: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[int] = None
    position: int = Field(default=0, ge=0)
    is_active: bool = True

    @field_validator('slug')
    @classmethod
    def validate_slug(cls, v):
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Le slug ne peut contenir que des minuscules, chiffres et tirets')
        return v


class CategoryCreate(CategoryBase):
    """Schéma pour créer une catégorie"""
    pass


class CategoryUpdate(BaseModel):
    """Schéma pour mettre à jour une catégorie"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    slug: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[int] = None
    position: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    """Schéma de réponse pour une catégorie"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CategoryTree(CategoryResponse):
    """Catégorie avec ses sous-catégories"""
    subcategories: List['CategoryTree'] = []

    model_config = ConfigDict(from_attributes=True)


# ============= Tag Schemas =============

class TagBase(BaseModel):
    """Schéma de base pour un tag"""
    name: str = Field(..., min_length=2, max_length=50)
    slug: str = Field(..., min_length=2, max_length=50)
    type: TagTypeEnum
    color: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True

    @field_validator('slug')
    @classmethod
    def validate_slug(cls, v):
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Le slug ne peut contenir que des minuscules, chiffres et tirets')
        return v

    @field_validator('color')
    @classmethod
    def validate_color(cls, v):
        if v and not re.match(r'^#[0-9A-Fa-f]{6}$', v):
            raise ValueError('La couleur doit être au format hexadécimal (#RRGGBB)')
        return v


class TagCreate(TagBase):
    """Schéma pour créer un tag"""
    pass


class TagUpdate(BaseModel):
    """Schéma pour mettre à jour un tag"""
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None


class TagResponse(TagBase):
    """Schéma de réponse pour un tag"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Unit Schemas =============

class UnitBase(BaseModel):
    """Schéma de base pour une unité"""
    name: str = Field(..., min_length=2, max_length=50)
    abbreviation: str = Field(..., min_length=1, max_length=10)
    type: UnitTypeEnum
    is_active: bool = True


class UnitCreate(UnitBase):
    """Schéma pour créer une unité"""
    pass


class UnitUpdate(BaseModel):
    """Schéma pour mettre à jour une unité"""
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    abbreviation: Optional[str] = Field(None, min_length=1, max_length=10)
    is_active: Optional[bool] = None


class UnitResponse(UnitBase):
    """Schéma de réponse pour une unité"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Product Schemas =============

class ProductBase(BaseModel):
    """Schéma de base pour un produit"""
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    category_id: Optional[int] = None
    unit_id: Optional[int] = None
    price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    min_order: int = Field(default=1, ge=1)
    max_order: Optional[int] = Field(None, ge=1)
    is_active: bool = True
    is_featured: bool = False
    origin: Optional[str] = Field(None, max_length=100)
    harvest_date: Optional[date] = None

    @field_validator('slug')
    @classmethod
    def validate_slug(cls, v):
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Le slug ne peut contenir que des minuscules, chiffres et tirets')
        return v

    @field_validator('max_order')
    @classmethod
    def validate_max_order(cls, v, info):
        if v is not None and 'min_order' in info.data:
            if v < info.data['min_order']:
                raise ValueError('La quantité maximum doit être supérieure ou égale à la quantité minimum')
        return v


class ProductCreate(ProductBase):
    """Schéma pour créer un produit"""
    tag_ids: Optional[List[int]] = []


class ProductUpdate(BaseModel):
    """Schéma pour mettre à jour un produit"""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    slug: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    category_id: Optional[int] = None
    unit_id: Optional[int] = None
    # Simplification ici : on garde juste gt=0
    price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    min_order: Optional[int] = Field(None, ge=1)
    max_order: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    origin: Optional[str] = Field(None, max_length=100)
    harvest_date: Optional[date] = None
    tag_ids: Optional[List[int]] = None


class ProductResponse(ProductBase):
    """Schéma de réponse pour un produit"""
    id: int
    producer_id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None
    unit: Optional[UnitResponse] = None
    tags: List[TagResponse] = []
    images: List['ProductImageResponse'] = []

    model_config = ConfigDict(from_attributes=True)


# ============= Product Image Schemas =============

class ProductImageBase(BaseModel):
    """Schéma de base pour une image de produit"""
    url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    position: int = Field(default=0, ge=0)
    is_primary: bool = False


class ProductImageCreate(ProductImageBase):
    """Schéma pour créer une image"""
    pass


class ProductImageUpdate(BaseModel):
    """Schéma pour mettre à jour une image"""
    alt_text: Optional[str] = Field(None, max_length=255)
    position: Optional[int] = Field(None, ge=0)
    is_primary: Optional[bool] = None


class ProductImageResponse(ProductImageBase):
    """Schéma de réponse pour une image"""
    id: int
    product_id: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Product Variant Schemas =============

class ProductVariantBase(BaseModel):
    """Schéma de base pour une variante"""
    name: str = Field(..., min_length=1, max_length=100)
    sku: Optional[str] = Field(None, max_length=50)
    # Simplification ici
    price_modifier: Decimal = Field(default=0)
    stock: int = Field(default=0, ge=0)
    is_active: bool = True


class ProductVariantCreate(ProductVariantBase):
    """Schéma pour créer une variante"""
    pass


class ProductVariantUpdate(BaseModel):
    """Schéma pour mettre à jour une variante"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    sku: Optional[str] = Field(None, max_length=50)
    # Simplification ici
    price_modifier: Optional[Decimal] = Field(None)
    stock: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class ProductVariantResponse(ProductVariantBase):
    """Schéma de réponse pour une variante"""
    id: int
    product_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Product Availability Schemas =============

class ProductAvailabilityBase(BaseModel):
    """Schéma de base pour la disponibilité"""
    start_date: date
    end_date: date
    available_days: Optional[str] = None

    @field_validator('end_date')
    @classmethod
    def validate_dates(cls, v, info):
        if 'start_date' in info.data and v < info.data['start_date']:
            raise ValueError('La date de fin doit être après la date de début')
        return v

    @field_validator('available_days')
    @classmethod
    def validate_available_days(cls, v):
        if v:
            days = v.split(',')
            for day in days:
                if not day.strip().isdigit() or not (1 <= int(day.strip()) <= 7):
                    raise ValueError('Les jours disponibles doivent être des chiffres entre 1 et 7')
        return v


class ProductAvailabilityCreate(ProductAvailabilityBase):
    """Schéma pour créer une disponibilité"""
    pass


class ProductAvailabilityUpdate(BaseModel):
    """Schéma pour mettre à jour une disponibilité"""
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    available_days: Optional[str] = None


class ProductAvailabilityResponse(ProductAvailabilityBase):
    """Schéma de réponse pour une disponibilité"""
    id: int
    product_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Stock Movement Schemas =============

class StockMovementBase(BaseModel):
    """Schéma de base pour un mouvement de stock"""
    type: StockMovementTypeEnum
    quantity: int = Field(..., description="Quantité (positive ou négative selon le type)")
    reason: Optional[str] = Field(None, max_length=255)
    reference: Optional[str] = Field(None, max_length=100)


class StockMovementCreate(StockMovementBase):
    """Schéma pour créer un mouvement de stock"""
    product_id: int


class StockMovementResponse(StockMovementBase):
    """Schéma de réponse pour un mouvement de stock"""
    id: int
    product_id: int
    created_by: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Stock Alert Schemas =============

class StockAlertBase(BaseModel):
    """Schéma de base pour une alerte de stock"""
    threshold: int = Field(..., ge=0, description="Seuil d'alerte")
    is_active: bool = True


class StockAlertCreate(StockAlertBase):
    """Schéma pour créer une alerte"""
    product_id: int


class StockAlertUpdate(BaseModel):
    """Schéma pour mettre à jour une alerte"""
    threshold: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class StockAlertResponse(StockAlertBase):
    """Schéma de réponse pour une alerte"""
    id: int
    product_id: int
    notified_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Complete Product Response =============

class ProductComplete(ProductResponse):
    """Produit complet avec toutes les informations"""
    images: List[ProductImageResponse] = []
    variants: List[ProductVariantResponse] = []
    availabilities: List[ProductAvailabilityResponse] = []

    model_config = ConfigDict(from_attributes=True)


# ============= Utility Schemas =============

class ProductStockUpdate(BaseModel):
    """Schéma pour mettre à jour le stock d'un produit"""
    quantity: int
    type: StockMovementTypeEnum
    reason: Optional[str] = None


class ProductSearchFilters(BaseModel):
    """Filtres de recherche pour les produits"""
    category_id: Optional[int] = None
    producer_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    is_featured: Optional[bool] = None
    in_stock: Optional[bool] = None
    search_term: Optional[str] = None


# Mise à jour de la référence circulaire
CategoryTree.model_rebuild()
ProductResponse.model_rebuild()
ProductComplete.model_rebuild()
