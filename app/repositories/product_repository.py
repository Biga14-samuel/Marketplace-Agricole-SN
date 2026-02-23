from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, or_
from typing import Optional, List
from datetime import datetime

from app.models.products import (
    Category, Tag, Unit, Product, ProductImage, ProductVariant,
    StockMovement, StockAlert
)


# ============= Category Repository =============

class CategoryRepository:
    """Repository pour les catégories"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Category:
        """Crée une catégorie"""
        category = Category(**kwargs)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def get_by_id(self, category_id: int) -> Optional[Category]:
        """Récupère une catégorie par son ID"""
        return self.db.query(Category).filter(Category.id == category_id).first()
    
    def get_by_slug(self, slug: str) -> Optional[Category]:
        """Récupère une catégorie par son slug"""
        return self.db.query(Category).filter(Category.slug == slug).first()
    
    def get_all(self, active_only: bool = False) -> List[Category]:
        """Récupère toutes les catégories"""
        query = self.db.query(Category).order_by(Category.position, Category.name)
        if active_only:
            query = query.filter(Category.is_active)
        return query.all()
    
    def get_root_categories(self, active_only: bool = False) -> List[Category]:
        """Récupère les catégories racines (sans parent)"""
        query = self.db.query(Category).filter(Category.parent_id.is_(None)).order_by(Category.position)
        if active_only:
            query = query.filter(Category.is_active)
        return query.all()
    
    def get_subcategories(self, parent_id: int, active_only: bool = False) -> List[Category]:
        """Récupère les sous-catégories d'une catégorie"""
        query = self.db.query(Category).filter(Category.parent_id == parent_id).order_by(Category.position)
        if active_only:
            query = query.filter(Category.is_active)
        return query.all()
    
    def update(self, category: Category) -> Category:
        """Met à jour une catégorie"""
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def delete(self, category: Category) -> bool:
        """Supprime une catégorie"""
        self.db.delete(category)
        self.db.commit()
        return True


# ============= Tag Repository =============

class TagRepository:
    """Repository pour les tags"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Tag:
        """Crée un tag"""
        tag = Tag(**kwargs)
        self.db.add(tag)
        self.db.commit()
        self.db.refresh(tag)
        return tag
    
    def get_by_id(self, tag_id: int) -> Optional[Tag]:
        """Récupère un tag par son ID"""
        return self.db.query(Tag).filter(Tag.id == tag_id).first()
    
    def get_by_slug(self, slug: str) -> Optional[Tag]:
        """Récupère un tag par son slug"""
        return self.db.query(Tag).filter(Tag.slug == slug).first()
    
    def get_all(self, tag_type: Optional[str] = None, active_only: bool = False) -> List[Tag]:
        """Récupère tous les tags"""
        query = self.db.query(Tag)
        if tag_type:
            query = query.filter(Tag.type == tag_type)
        if active_only:
            query = query.filter(Tag.is_active)
        return query.order_by(Tag.name).all()
    
    def get_by_ids(self, tag_ids: List[int]) -> List[Tag]:
        """Récupère plusieurs tags par leurs IDs"""
        return self.db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    
    def update(self, tag: Tag) -> Tag:
        """Met à jour un tag"""
        self.db.commit()
        self.db.refresh(tag)
        return tag
    
    def delete(self, tag: Tag) -> bool:
        """Supprime un tag"""
        self.db.delete(tag)
        self.db.commit()
        return True


# ============= Unit Repository =============

class UnitRepository:
    """Repository pour les unités de mesure"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Unit:
        """Crée une unité"""
        unit = Unit(**kwargs)
        self.db.add(unit)
        self.db.commit()
        self.db.refresh(unit)
        return unit
    
    def get_by_id(self, unit_id: int) -> Optional[Unit]:
        """Récupère une unité par son ID"""
        return self.db.query(Unit).filter(Unit.id == unit_id).first()
    
    def get_all(self, unit_type: Optional[str] = None, active_only: bool = False) -> List[Unit]:
        """Récupère toutes les unités"""
        query = self.db.query(Unit)
        if unit_type:
            query = query.filter(Unit.type == unit_type)
        if active_only:
            query = query.filter(Unit.is_active)
        return query.order_by(Unit.name).all()
    
    def update(self, unit: Unit) -> Unit:
        """Met à jour une unité"""
        self.db.commit()
        self.db.refresh(unit)
        return unit
    
    def delete(self, unit: Unit) -> bool:
        """Supprime une unité"""
        self.db.delete(unit)
        self.db.commit()
        return True


# ============= Product Repository =============

class ProductRepository:
    """Repository pour les produits"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Product:
        """Crée un produit"""
        product = Product(**kwargs)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product
    
    def get_by_id(self, product_id: int) -> Optional[Product]:
        """Récupère un produit par son ID"""
        return self.db.query(Product).filter(Product.id == product_id).first()
    
    def get_by_slug(self, slug: str) -> Optional[Product]:
        """Récupère un produit par son slug"""
        return self.db.query(Product).filter(Product.slug == slug).first()
    
    def get_complete(self, product_id: int) -> Optional[Product]:
        """Récupère un produit avec toutes ses relations"""
        return self.db.query(Product).options(
            joinedload(Product.category),
            joinedload(Product.unit),
            joinedload(Product.tags),
            joinedload(Product.images),
            joinedload(Product.variants),
            joinedload(Product.availabilities)
        ).filter(Product.id == product_id).first()
    
    def get_producer_products(
        self,
        producer_id: int,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = False
    ) -> List[Product]:
        """Récupère les produits d'un producteur"""
        query = self.db.query(Product).filter(Product.producer_id == producer_id)
        if active_only:
            query = query.filter(Product.is_active)
        return query.order_by(desc(Product.created_at)).offset(skip).limit(limit).all()
    
    def search_products(
        self,
        category_id: Optional[int] = None,
        producer_id: Optional[int] = None,
        tag_ids: Optional[List[int]] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        is_featured: Optional[bool] = None,
        in_stock: Optional[bool] = None,
        search_term: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Product]:
        """Recherche de produits avec filtres"""
        query = self.db.query(Product).filter(Product.is_active)
        
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        if producer_id:
            query = query.filter(Product.producer_id == producer_id)
        
        if tag_ids:
            query = query.join(Product.tags).filter(Tag.id.in_(tag_ids))
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        if is_featured is not None:
            query = query.filter(Product.is_featured == is_featured)
        
        if in_stock:
            query = query.filter(Product.stock_quantity > 0)
        
        if search_term:
            search_pattern = f"%{search_term}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern)
                )
            )
        
        return query.order_by(desc(Product.created_at)).offset(skip).limit(limit).all()
    
    def add_tags(self, product: Product, tag_ids: List[int]) -> Product:
        """Ajoute des tags à un produit"""
        tags = self.db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
        product.tags.extend(tags)
        self.db.flush()
        self.db.refresh(product)
        return product
    
    def remove_tags(self, product: Product, tag_ids: List[int]) -> Product:
        tags_to_remove = [tag for tag in product.tags if tag.id in tag_ids]
        for tag in tags_to_remove:
            product.tags.remove(tag)
        self.db.flush()
        self.db.refresh(product) 
        # Pas besoin de refresh ici, l'objet est toujours dans la session
        return product
    
    def update_stock(self, product: Product, quantity: int) -> Product:
        """Met à jour le stock d'un produit"""
        product.stock_quantity = quantity
        self.db.commit()
        self.db.refresh(product)
        return product
    
    def update(self, product: Product) -> Product:
        """Met à jour un produit"""
        self.db.commit()
        self.db.refresh(product)
        return product
    
    def delete(self, product: Product) -> bool:
        """Supprime un produit"""
        self.db.delete(product)
        self.db.commit()
        return True


# ============= Product Image Repository =============

class ProductImageRepository:
    """Repository pour les images de produits"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, product_id: int, **kwargs) -> ProductImage:
        """Crée une image de produit"""
        image = ProductImage(product_id=product_id, **kwargs)
        self.db.add(image)
        self.db.commit()
        self.db.refresh(image)
        return image
    
    def get_by_id(self, image_id: int) -> Optional[ProductImage]:
        """Récupère une image par son ID"""
        return self.db.query(ProductImage).filter(ProductImage.id == image_id).first()
    
    def get_product_images(self, product_id: int) -> List[ProductImage]:
        """Récupère toutes les images d'un produit"""
        return self.db.query(ProductImage).filter(
            ProductImage.product_id == product_id
        ).order_by(ProductImage.position).all()
    
    def set_as_primary(self, image: ProductImage) -> ProductImage:
        """Définit une image comme image principale"""
        # Désactiver les autres images principales du même produit
        self.db.query(ProductImage).filter(
            ProductImage.product_id == image.product_id,
            ProductImage.id != image.id
        ).update({"is_primary": False})
        
        image.is_primary = True
        self.db.commit()
        self.db.refresh(image)
        return image
    
    def update(self, image: ProductImage) -> ProductImage:
        """Met à jour une image"""
        self.db.commit()
        self.db.refresh(image)
        return image
    
    def delete(self, image: ProductImage) -> bool:
        """Supprime une image"""
        self.db.delete(image)
        self.db.commit()
        return True


# ============= Product Variant Repository =============

class ProductVariantRepository:
    """Repository pour les variantes de produits"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, product_id: int, **kwargs) -> ProductVariant:
        """Crée une variante"""
        variant = ProductVariant(product_id=product_id, **kwargs)
        self.db.add(variant)
        self.db.commit()
        self.db.refresh(variant)
        return variant
    
    def get_by_id(self, variant_id: int) -> Optional[ProductVariant]:
        """Récupère une variante par son ID"""
        return self.db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    
    def get_product_variants(self, product_id: int, active_only: bool = False) -> List[ProductVariant]:
        """Récupère toutes les variantes d'un produit"""
        query = self.db.query(ProductVariant).filter(ProductVariant.product_id == product_id)
        if active_only:
            query = query.filter(ProductVariant.is_active)
        return query.all()
    
    def update(self, variant: ProductVariant) -> ProductVariant:
        """Met à jour une variante"""
        self.db.commit()
        self.db.refresh(variant)
        return variant
    
    def delete(self, variant: ProductVariant) -> bool:
        """Supprime une variante"""
        self.db.delete(variant)
        self.db.commit()
        return True


# ============= Stock Movement Repository =============

class StockMovementRepository:
    """Repository pour les mouvements de stock"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, product_id: int, created_by: Optional[int], **kwargs) -> StockMovement:
        """Crée un mouvement de stock"""
        movement = StockMovement(
            product_id=product_id,
            created_by=created_by,
            **kwargs
        )
        self.db.add(movement)
        self.db.commit()
        self.db.refresh(movement)
        return movement
    
    def get_product_movements(
        self,
        product_id: int,
        skip: int = 0,
        limit: int = 50
    ) -> List[StockMovement]:
        """Récupère l'historique des mouvements d'un produit"""
        return self.db.query(StockMovement).filter(
            StockMovement.product_id == product_id
        ).order_by(desc(StockMovement.created_at)).offset(skip).limit(limit).all()


# ============= Stock Alert Repository =============

class StockAlertRepository:
    """Repository pour les alertes de stock"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, product_id: int, **kwargs) -> StockAlert:
        """Crée une alerte de stock"""
        alert = StockAlert(product_id=product_id, **kwargs)
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert
    
    def get_by_product(self, product_id: int) -> Optional[StockAlert]:
        """Récupère l'alerte d'un produit"""
        return self.db.query(StockAlert).filter(StockAlert.product_id == product_id).first()
    
    def get_triggered_alerts(self) -> List[StockAlert]:
        """Récupère les alertes déclenchées (stock en dessous du seuil)"""
        return self.db.query(StockAlert).join(Product).filter(
            StockAlert.is_active,
            Product.stock_quantity <= StockAlert.threshold
        ).all()
    
    def mark_as_notified(self, alert: StockAlert) -> StockAlert:
        """Marque une alerte comme notifiée"""
        alert.notified_at = datetime.now()
        self.db.commit()
        self.db.refresh(alert)
        return alert
    
    def update(self, alert: StockAlert) -> StockAlert:
        """Met à jour une alerte"""
        self.db.commit()
        self.db.refresh(alert)
        return alert
    
    def delete(self, alert: StockAlert) -> bool:
        """Supprime une alerte"""
        self.db.delete(alert)
        self.db.commit()
        return True