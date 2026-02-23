"""
Schémas Pydantic pour les commandes et le panier
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
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
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = Field(gt=0, description="Quantité doit être positive")

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0, description="Quantité doit être positive")

class ProductSnapshot(BaseModel):
    """Snapshot du produit pour les items de commande"""
    id: int
    name: str
    sku: str
    description: Optional[str] = None
    price: Decimal
    images: List[str] = []
    category: Optional[str] = None
    unit: Optional[str] = None

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
    status: OrderStatus
    comment: Optional[str] = None

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