"""
Schémas Pydantic pour les commandes et le panier
"""
from pydantic import BaseModel, Field, ConfigDict, model_validator, field_validator, AliasChoices
from typing import Optional, List, Any
from datetime import datetime
from decimal import Decimal
from enum import Enum

# ============= Enums =============

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class DeliveryType(str, Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"

# ============= Cart Schemas =============

class CartItemBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    product_id: int = Field(validation_alias=AliasChoices("product_id", "productId"))
    variant_id: Optional[int] = Field(
        default=None,
        validation_alias=AliasChoices("variant_id", "variantId")
    )
    quantity: int = Field(gt=0, description="Quantité doit être positive")

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0, description="Quantité doit être positive")

class ProductSnapshot(BaseModel):
    """Snapshot du produit pour les items de commande"""
    id: int
    name: str
    sku: Optional[str] = None
    description: Optional[str] = None
    price: Decimal
    images: List[str] = []
    category: Optional[str] = None
    unit: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("images", mode="before")
    @classmethod
    def normalize_images(cls, value: Any) -> List[str]:
        if value in (None, ""):
            return []

        raw_items = value if isinstance(value, (list, tuple, set)) else [value]
        normalized: List[str] = []

        for item in raw_items:
            if isinstance(item, str):
                normalized.append(item)
                continue
            if isinstance(item, dict):
                url = item.get("url") or item.get("path")
                if url:
                    normalized.append(str(url))
                continue

            url = getattr(item, "url", None)
            if url:
                normalized.append(str(url))

        return normalized

    @field_validator("category", mode="before")
    @classmethod
    def normalize_category(cls, value: Any) -> Optional[str]:
        if value is None or isinstance(value, str):
            return value
        if isinstance(value, dict):
            name = value.get("name")
            return str(name) if name is not None else None
        name = getattr(value, "name", None)
        return str(name) if name is not None else None

    @field_validator("unit", mode="before")
    @classmethod
    def normalize_unit(cls, value: Any) -> Optional[str]:
        if value is None or isinstance(value, str):
            return value
        if isinstance(value, dict):
            label = value.get("abbreviation") or value.get("name")
            return str(label) if label is not None else None
        label = getattr(value, "abbreviation", None) or getattr(value, "name", None)
        return str(label) if label is not None else None

class CartItemResponse(BaseModel):
    id: int
    cart_id: int
    product_id: int
    variant_id: Optional[int] = None
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    created_at: datetime
    updated_at: datetime
    
    # Relations
    product: Optional[ProductSnapshot] = None
    
    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    expires_at: datetime
    created_at: datetime
    updated_at: datetime
    
    # Relations et calculs
    items: List[CartItemResponse] = []
    subtotal: Decimal = Field(default=Decimal('0.00'))
    tax_amount: Decimal = Field(default=Decimal('0.00'))
    delivery_fee: Decimal = Field(default=Decimal('0.00'))
    discount_amount: Decimal = Field(default=Decimal('0.00'))
    total_amount: Decimal = Field(default=Decimal('0.00'))
    total: Decimal = Field(default=Decimal('0.00'))  # Alias for total_amount
    items_count: int = Field(default=0)  # Total number of items
    
    model_config = ConfigDict(from_attributes=True)

# ============= Order Schemas =============

class OrderItemBase(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(ge=0)

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: Optional[int] = None
    variant_id: Optional[int] = None
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    product_snapshot: Optional[dict] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class CheckoutRequest(BaseModel):
    delivery_type: DeliveryType
    pickup_point_id: Optional[int] = None
    pickup_slot_id: Optional[int] = None
    delivery_address_id: Optional[int] = None
    notes: Optional[str] = None
    payment_method: str = Field(description="Méthode de paiement")

class OrderBase(BaseModel):
    delivery_type: DeliveryType
    pickup_point_id: Optional[int] = None
    pickup_slot_id: Optional[int] = None
    delivery_address_id: Optional[int] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    payment_method: str

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    notes: Optional[str] = None

class ProducerInfo(BaseModel):
    id: int
    business_name: str
    avatar: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    producer_id: Optional[int] = None
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    subtotal: Decimal
    tax_amount: Decimal
    delivery_fee: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    delivery_type: DeliveryType
    pickup_point_id: Optional[int] = None
    pickup_slot_id: Optional[int] = None
    delivery_address_id: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Relations
    items: List[OrderItemResponse] = []
    producer: Optional[ProducerInfo] = None
    
    model_config = ConfigDict(from_attributes=True)

# ============= Order Status History =============

class OrderStatusHistoryCreate(BaseModel):
    old_status: Optional[OrderStatus] = None
    new_status: OrderStatus
    comment: Optional[str] = None

class OrderStatusHistoryResponse(BaseModel):
    id: int
    order_id: int
    old_status: Optional[OrderStatus] = None
    new_status: OrderStatus
    comment: Optional[str] = None
    changed_by: Optional[int] = None
    changed_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# ============= Order Tracking =============

class OrderTrackingCreate(BaseModel):
    status: str = Field(max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    note: Optional[str] = None

class OrderTrackingResponse(BaseModel):
    id: int
    order_id: int
    status: str
    location: Optional[str] = None
    note: Optional[str] = None
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)

# ============= Request/Response Schemas =============

class UpdateOrderStatusRequest(BaseModel):
    status: Optional[OrderStatus] = None
    new_status: Optional[OrderStatus] = None
    comment: Optional[str] = None

    @model_validator(mode="after")
    def validate_status_field(self):
        if self.status is None and self.new_status is None:
            raise ValueError("Un statut est requis (status ou new_status)")
        if self.status is None and self.new_status is not None:
            self.status = self.new_status
        return self

class CancelOrderRequest(BaseModel):
    reason: Optional[str] = None

class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total: int
    page: int
    limit: int

class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None

# ============= Filter Schemas =============

class OrderFilter(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    delivery_type: Optional[DeliveryType] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    search: Optional[str] = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    sort_by: str = Field(default="created_at")
    sort_order: str = Field(default="desc", pattern="^(asc|desc)$")

class ProducerOrderFilter(OrderFilter):
    producer_id: Optional[int] = None
