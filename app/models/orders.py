from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


# ============= Enums =============

class OrderStatus(str, enum.Enum):
    """Statuts possibles d'une commande"""
    PENDING = "pending"  # En attente de confirmation
    CONFIRMED = "confirmed"  # Confirmée par le producteur
    PREPARING = "preparing"  # En cours de préparation
    READY = "ready"  # Prête pour retrait/livraison
    COMPLETED = "completed"  # Terminée
    CANCELLED = "cancelled"  # Annulée


class PaymentStatus(str, enum.Enum):
    """Statuts de paiement"""
    PENDING = "pending"  # En attente
    COMPLETED = "completed"  # Payé
    FAILED = "failed"  # Échec
    REFUNDED = "refunded"  # Remboursé


class DeliveryType(str, enum.Enum):
    """Types de livraison"""
    PICKUP = "pickup"  # Retrait sur place
    DELIVERY = "delivery"  # Livraison à domicile


# ============= Cart Models =============

class Cart(Base):
    """Panier d'achat temporaire"""
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=True, index=True)
    session_id = Column(String(255), nullable=True, index=True)  # Pour les utilisateurs non connectés
    expires_at = Column(DateTime, nullable=False)  # Date d'expiration du panier
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    user = relationship("User", backref="carts")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Cart(id={self.id}, user_id={self.user_id}, items_count={len(self.items)})>"


class CartItem(Base):
    """Article dans le panier"""
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('carts.id', ondelete='CASCADE'), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False, index=True)
    variant_id = Column(Integer, ForeignKey('product_variants.id', ondelete='SET NULL'), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")
    variant = relationship("ProductVariant")

    def __repr__(self):
        return f"<CartItem(id={self.id}, product_id={self.product_id}, quantity={self.quantity})>"


# ============= Order Models =============

class Order(Base):
    """Commande finalisée"""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    producer_id = Column(Integer, ForeignKey('producer_profiles.id', ondelete='SET NULL'), nullable=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True) 
    
    # Statuts
    status = Column(SQLEnum(OrderStatus), nullable=False, default=OrderStatus.PENDING, index=True)
    payment_status = Column(SQLEnum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING, index=True)
    
    # Montants
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax_amount = Column(Numeric(10, 2), nullable=False, default=0)
    delivery_fee = Column(Numeric(10, 2), nullable=False, default=0)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0)
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    # Livraison
    delivery_type = Column(SQLEnum(DeliveryType), nullable=False)
    pickup_point_id = Column(Integer, ForeignKey('pickup_points.id', ondelete='SET NULL'), nullable=True)
    pickup_slot_id = Column(Integer, ForeignKey('pickup_slots.id', ondelete='SET NULL'), nullable=True)
    delivery_address_id = Column(Integer, ForeignKey('addresses.id', ondelete='SET NULL'), nullable=True)

    # Informations supplémentaires
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations existantes
    user = relationship("User", backref="orders")
    producer = relationship("ProducerProfile", backref="orders")
    pickup_point = relationship("PickupPoint")
    pickup_slot = relationship("PickupSlot")
    delivery_address = relationship("Address")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan", order_by="OrderStatusHistory.changed_at.desc()")
    tracking = relationship("OrderTracking", back_populates="order", cascade="all, delete-orphan", order_by="OrderTracking.timestamp.desc()")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")
    invoice = relationship("Invoice", back_populates="order", uselist=False, cascade="all, delete-orphan")
    coupon_usage = relationship("CouponUsage", back_populates="order", uselist=False, cascade="all, delete-orphan")
    loyalty_transactions = relationship("LoyaltyTransaction", back_populates="order", cascade="all, delete-orphan")
    reward_redemption = relationship("RewardRedemption", back_populates="order", uselist=False, cascade="all, delete-orphan")
    review = relationship("Review", back_populates="order", uselist=False, cascade="all, delete-orphan")
    producer_review = relationship("ProducerReview", back_populates="order", uselist=False, cascade="all, delete-orphan")
    delivery = relationship("Delivery", back_populates="order", uselist=False)
    
    def __repr__(self):
        return f"<Order(id={self.id}, order_number='{self.order_number}', status={self.status}, total={self.total_amount})>"

class OrderItem(Base):
    """Article d'une commande"""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='SET NULL'), nullable=True, index=True)
    variant_id = Column(Integer, ForeignKey('product_variants.id', ondelete='SET NULL'), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)  # Prix unitaire au moment de la commande
    subtotal = Column(Numeric(10, 2), nullable=False)  # quantity * unit_price
    product_snapshot = Column(JSON, nullable=True)  # Snapshot complet du produit au moment de la commande
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
    variant = relationship("ProductVariant")

    def __repr__(self):
        return f"<OrderItem(id={self.id}, order_id={self.order_id}, quantity={self.quantity}, subtotal={self.subtotal})>"


class OrderStatusHistory(Base):
    """Historique des changements de statut d'une commande"""
    __tablename__ = "order_status_history"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    old_status = Column(SQLEnum(OrderStatus), nullable=True)  # NULL pour la première entrée
    new_status = Column(SQLEnum(OrderStatus), nullable=False)
    comment = Column(Text, nullable=True)  # Commentaire optionnel sur le changement
    changed_by = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)  # Qui a fait le changement
    changed_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    order = relationship("Order", back_populates="status_history")
    changed_by_user = relationship("User", foreign_keys=[changed_by])

    def __repr__(self):
        return f"<OrderStatusHistory(id={self.id}, order_id={self.order_id}, {self.old_status} -> {self.new_status})>"


class OrderTracking(Base):
    """Suivi de livraison en temps réel"""
    __tablename__ = "order_tracking"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    status = Column(String(100), nullable=False)  # Ex: "En préparation", "En route", "Livré"
    location = Column(String(255), nullable=True)  # Localisation géographique
    note = Column(Text, nullable=True)  # Note descriptive
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    order = relationship("Order", back_populates="tracking")

    def __repr__(self):
        return f"<OrderTracking(id={self.id}, order_id={self.order_id}, status='{self.status}')>"