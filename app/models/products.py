from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Numeric, Date, Table, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


# ============= Enums =============

class TagType(str, enum.Enum):
    """Types de tags pour les produits"""
    BIO = "bio"
    LOCAL = "local"
    SEASON = "season"
    PROMO = "promo"


class UnitType(str, enum.Enum):
    """Types d'unités de mesure"""
    WEIGHT = "weight"
    VOLUME = "volume"
    PIECE = "piece"


class StockMovementType(str, enum.Enum):
    """Types de mouvements de stock"""
    IN = "in"  # Entrée de stock (réapprovisionnement)
    OUT = "out"  # Sortie de stock (vente)
    ADJUSTMENT = "adjustment"  # Ajustement manuel (correction d'inventaire)


# ============= Many-to-Many Association Table =============

# Table de liaison entre Product et Tag
product_tags = Table(
    'product_tags',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
    Column('assigned_at', DateTime, server_default=func.now())
)


# ============= Organization Models =============

class Category(Base):
    """Catégories de produits avec support de hiérarchie"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)  # Nom de l'icône ou emoji
    parent_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=True)
    position = Column(Integer, default=0, nullable=False)  # Ordre d'affichage
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    parent = relationship("Category", remote_side=[id], backref="subcategories")
    products = relationship("Product", back_populates="category")
    commissions = relationship("Commission", back_populates="category")
    tax_rates = relationship("TaxRate", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}', parent_id={self.parent_id})>"


class Tag(Base):
    """Tags pour classifier les produits de manière transversale"""
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    slug = Column(String(50), nullable=False, unique=True, index=True)
    type = Column(SQLEnum(TagType), nullable=False)
    color = Column(String(7), nullable=True)  # Couleur hex pour l'affichage (ex: #00FF00)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    products = relationship("Product", secondary=product_tags, back_populates="tags")

    def __repr__(self):
        return f"<Tag(id={self.id}, name='{self.name}', type={self.type})>"


class Unit(Base):
    """Unités de mesure pour les produits"""
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)  # Ex: "Kilogramme", "Litre", "Pièce"
    abbreviation = Column(String(10), nullable=False, unique=True)  # Ex: "kg", "L", "pc"
    type = Column(SQLEnum(UnitType), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    products = relationship("Product", back_populates="unit")

    def __repr__(self):
        return f"<Unit(id={self.id}, name='{self.name}', type={self.type})>"


# ============= Product Models =============

class Product(Base):
    """Produit principal"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    producer_id = Column(Integer, ForeignKey('producer_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='SET NULL'), nullable=True, index=True)
    unit_id = Column(Integer, ForeignKey('units.id', ondelete='SET NULL'), nullable=True)
    
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Prix et stock
    price = Column(Numeric(10, 2), nullable=False)  # Prix unitaire
    stock_quantity = Column(Integer, nullable=False, default=0)
    min_order = Column(Integer, nullable=False, default=1)  # Quantité minimum de commande
    max_order = Column(Integer, nullable=True)  # Quantité maximum de commande (NULL = illimité)
    
    # État du produit
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)  # Produit mis en avant
    
    # Informations spécifiques agriculture
    origin = Column(String(100), nullable=True)  # Origine géographique
    harvest_date = Column(Date, nullable=True)  # Date de récolte
    
    # Métadonnées
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    producer = relationship("ProducerProfile", backref="products")
    category = relationship("Category", back_populates="products")
    unit = relationship("Unit", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.position")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    availabilities = relationship("ProductAvailability", back_populates="product", cascade="all, delete-orphan")
    stock_movements = relationship("StockMovement", back_populates="product", cascade="all, delete-orphan")
    stock_alert = relationship("StockAlert", back_populates="product", uselist=False, cascade="all, delete-orphan")
    tags = relationship("Tag", secondary=product_tags, back_populates="products")
    promotions = relationship("Promotion", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="product", cascade="all, delete-orphan")
    followers = relationship("ProductFollow", back_populates="product", cascade="all, delete-orphan")


    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', price={self.price})>"


class ProductImage(Base):
    """Images de produits"""
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False, index=True)
    url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    position = Column(Integer, default=0, nullable=False)  # Ordre d'affichage
    is_primary = Column(Boolean, default=False, nullable=False)
    uploaded_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    product = relationship("Product", back_populates="images")

    def __repr__(self):
        return f"<ProductImage(id={self.id}, product_id={self.product_id}, is_primary={self.is_primary})>"


class ProductVariant(Base):
    """Variantes de produits (ex: différentes tailles, formats)"""
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(100), nullable=False)  # Ex: "1kg", "3kg", "5kg"
    sku = Column(String(50), unique=True, nullable=True, index=True)  # Stock Keeping Unit
    price_modifier = Column(Numeric(10, 2), nullable=False, default=0)  # Modificateur de prix (+/-)
    stock = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    product = relationship("Product", back_populates="variants")

    def __repr__(self):
        return f"<ProductVariant(id={self.id}, name='{self.name}', stock={self.stock})>"


class ProductAvailability(Base):
    """Disponibilité saisonnière des produits"""
    __tablename__ = "product_availabilities"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    available_days = Column(String(50), nullable=True)  # Jours de la semaine (ex: "1,3,5" pour Lundi, Mercredi, Vendredi)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    product = relationship("Product", back_populates="availabilities")

    def __repr__(self):
        return f"<ProductAvailability(id={self.id}, product_id={self.product_id}, {self.start_date} - {self.end_date})>"


# ============= Inventory Models =============

class StockMovement(Base):
    """Historique des mouvements de stock"""
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False, index=True)
    type = Column(SQLEnum(StockMovementType), nullable=False)
    quantity = Column(Integer, nullable=False)  # Peut être positif ou négatif
    reason = Column(String(255), nullable=True)  # Raison du mouvement
    reference = Column(String(100), nullable=True)  # Référence externe (ex: numéro de commande)
    created_by = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    product = relationship("Product", back_populates="stock_movements")
    created_by_user = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<StockMovement(id={self.id}, product_id={self.product_id}, type={self.type}, quantity={self.quantity})>"


class StockAlert(Base):
    """Alertes de stock bas"""
    __tablename__ = "stock_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False, unique=True, index=True)
    threshold = Column(Integer, nullable=False)  # Seuil d'alerte
    is_active = Column(Boolean, default=True, nullable=False)
    notified_at = Column(DateTime, nullable=True)  # Dernière notification envoyée
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    product = relationship("Product", back_populates="stock_alert")

    def __repr__(self):
        return f"<StockAlert(id={self.id}, product_id={self.product_id}, threshold={self.threshold})>"