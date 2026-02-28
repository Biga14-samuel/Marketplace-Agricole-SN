from sqlalchemy.orm import Session
from typing import Optional, List
from fastapi import HTTPException, status, UploadFile
from pathlib import Path
from uuid import uuid4
from datetime import datetime, timezone
import shutil

from app.repositories.product_repository import (
    CategoryRepository, TagRepository, UnitRepository, ProductRepository,
    ProductImageRepository, ProductVariantRepository,
    StockMovementRepository, StockAlertRepository
)
from app.repositories.profile_repository import ProducerProfileRepository
from app.models.auth import User
from app.models.profiles import ProducerProfile
from app.models.products import Product, Category, Tag, Unit, ProductImage, ProductVariant, StockAlert
from app.core.config import settings
from app.schemas.product_schema import (
    CategoryCreate, CategoryUpdate, TagCreate, TagUpdate,
    UnitCreate, UnitUpdate, ProductCreate, ProductUpdate,
    ProductImageCreate,
    ProductVariantCreate,
    StockAlertCreate,
    ProductSearchFilters
)


# ============= Category Service =============

class CategoryService:
    """Service pour la gestion des catégories"""
    
    def __init__(self, db: Session):
        self.db = db
        self.category_repo = CategoryRepository(db)
    
    def create_category(self, category_data: CategoryCreate) -> Category:
        """Crée une nouvelle catégorie"""
        # Vérifier que le slug est unique
        existing = self.category_repo.get_by_slug(category_data.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Une catégorie avec ce slug existe déjà"
            )
        
        # Si parent_id est fourni, vérifier qu'il existe
        if category_data.parent_id:
            parent = self.category_repo.get_by_id(category_data.parent_id)
            if not parent:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Catégorie parente non trouvée"
                )
        
        return self.category_repo.create(**category_data.model_dump())
    
    def get_category(self, category_id: int) -> Category:
        """Récupère une catégorie"""
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Catégorie non trouvée"
            )
        return category
    
    def get_all_categories(self, active_only: bool = False) -> List[Category]:
        """Récupère toutes les catégories"""
        return self.category_repo.get_all(active_only)
    
    def get_category_tree(self, active_only: bool = False) -> List[Category]:
        """Récupère l'arbre des catégories (racines avec sous-catégories)"""
        return self.category_repo.get_root_categories(active_only)
    
    def update_category(self, category_id: int, category_data: CategoryUpdate) -> Category:
        """Met à jour une catégorie"""
        category = self.get_category(category_id)
        
        # Vérifier le slug si modifié
        if category_data.slug and category_data.slug != category.slug:
            existing = self.category_repo.get_by_slug(category_data.slug)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Une catégorie avec ce slug existe déjà"
                )
        
        # Mettre à jour les champs
        update_data = category_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(category, field, value)
        
        return self.category_repo.update(category)
    
    def delete_category(self, category_id: int) -> bool:
        """Supprime une catégorie"""
        category = self.get_category(category_id)
        
        # Vérifier qu'elle n'a pas de sous-catégories
        subcats = self.category_repo.get_subcategories(category_id)
        if subcats:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Impossible de supprimer une catégorie qui a des sous-catégories"
            )
        
        return self.category_repo.delete(category)


# ============= Tag Service =============

class TagService:
    """Service pour la gestion des tags"""
    
    def __init__(self, db: Session):
        self.db = db
        self.tag_repo = TagRepository(db)
    
    def create_tag(self, tag_data: TagCreate) -> Tag:
        """Crée un nouveau tag"""
        # Vérifier que le slug est unique
        existing = self.tag_repo.get_by_slug(tag_data.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un tag avec ce slug existe déjà"
            )
        
        return self.tag_repo.create(**tag_data.model_dump())
    
    def get_tag(self, tag_id: int) -> Tag:
        """Récupère un tag"""
        tag = self.tag_repo.get_by_id(tag_id)
        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag non trouvé"
            )
        return tag
    
    def get_all_tags(self, tag_type: Optional[str] = None, active_only: bool = False) -> List[Tag]:
        """Récupère tous les tags"""
        return self.tag_repo.get_all(tag_type, active_only)
    
    def update_tag(self, tag_id: int, tag_data: TagUpdate) -> Tag:
        """Met à jour un tag"""
        tag = self.get_tag(tag_id)
        
        update_data = tag_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(tag, field, value)
        
        return self.tag_repo.update(tag)
    
    def delete_tag(self, tag_id: int) -> bool:
        """Supprime un tag"""
        tag = self.get_tag(tag_id)
        return self.tag_repo.delete(tag)


# ============= Unit Service =============

class UnitService:
    """Service pour la gestion des unités"""
    
    def __init__(self, db: Session):
        self.db = db
        self.unit_repo = UnitRepository(db)
    
    def create_unit(self, unit_data: UnitCreate) -> Unit:
        """Crée une nouvelle unité"""
        return self.unit_repo.create(**unit_data.model_dump())
    
    def get_unit(self, unit_id: int) -> Unit:
        """Récupère une unité"""
        unit = self.unit_repo.get_by_id(unit_id)
        if not unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unité non trouvée"
            )
        return unit
    
    def get_all_units(self, unit_type: Optional[str] = None, active_only: bool = False) -> List[Unit]:
        """Récupère toutes les unités"""
        return self.unit_repo.get_all(unit_type, active_only)
    
    def update_unit(self, unit_id: int, unit_data: UnitUpdate) -> Unit:
        """Met à jour une unité"""
        unit = self.get_unit(unit_id)
        
        update_data = unit_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(unit, field, value)
        
        return self.unit_repo.update(unit)
    
    def delete_unit(self, unit_id: int) -> bool:
        """Supprime une unité"""
        unit = self.get_unit(unit_id)
        return self.unit_repo.delete(unit)


# ============= Product Service =============

class ProductService:
    """Service pour la gestion des produits"""
    
    def __init__(self, db: Session):
        self.db = db
        self.product_repo = ProductRepository(db)
        self.producer_repo = ProducerProfileRepository(db)
        self.stock_movement_repo = StockMovementRepository(db)
        self.stock_alert_repo = StockAlertRepository(db)
        self.image_repo = ProductImageRepository(db)
        self.variant_repo = ProductVariantRepository(db)

    def _build_default_business_name(self, user: User) -> str:
        customer_profile = getattr(user, "customer_profile", None)
        first_name = (getattr(customer_profile, "first_name", "") or "").strip()
        last_name = (getattr(customer_profile, "last_name", "") or "").strip()
        full_name = f"{first_name} {last_name}".strip()
        if full_name:
            return full_name

        email = (user.email or "").strip()
        if email:
            local_part = email.split("@")[0].replace(".", " ").replace("_", " ").strip()
            if local_part:
                return local_part[:255]

        return f"Producteur {user.id}"

    def _ensure_producer_profile(self, user_id: int) -> Optional[ProducerProfile]:
        producer = self.producer_repo.get_by_user_id(user_id)
        if producer:
            return producer

        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        business_name = self._build_default_business_name(user)
        return self.producer_repo.create(
            user_id=user_id,
            business_name=business_name,
            is_verified=bool(settings.SKIP_EMAIL_VERIFICATION)
        )
    
    def create_product(self, user_id: int, product_data: ProductCreate) -> Product:
        """Crée un nouveau produit"""
        # Vérifier que l'utilisateur est un producteur
        producer = self._ensure_producer_profile(user_id)
        if not producer:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Seuls les producteurs peuvent créer des produits"
            )
        if not producer.is_verified and not settings.SKIP_EMAIL_VERIFICATION:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Votre profil producteur doit être validé avant de créer des produits"
            )
        
        # Vérifier que le slug est unique pour ce producteur
        existing = self.product_repo.get_by_slug(product_data.slug)
        if existing and existing.producer_id == producer.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vous avez déjà un produit avec ce slug"
            )
        
        # Extraire les tag_ids avant de créer le produit
        tag_ids = product_data.tag_ids if hasattr(product_data, 'tag_ids') else []
        product_dict = product_data.model_dump(exclude={'tag_ids'})
        
        # Créer le produit
        product = self.product_repo.create(
            producer_id=producer.id,
            **product_dict
        )
        
        # Ajouter les tags si fournis
        if tag_ids:
            self.product_repo.add_tags(product, tag_ids)
        
        # Créer le mouvement de stock initial si stock > 0
        if product.stock_quantity > 0:
            self.stock_movement_repo.create(
                product_id=product.id,
                created_by=user_id,
                type="in",
                quantity=product.stock_quantity,
                reason="Stock initial"
            )
        
        return product
    
    def get_product(self, product_id: int) -> Product:
        """Récupère un produit"""
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produit non trouvé"
            )
        return product
    
    def get_complete_product(self, product_id: int) -> Product:
        """Récupère un produit avec toutes ses informations"""
        product = self.product_repo.get_complete(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produit non trouvé"
            )
        return product
    
    def get_my_products(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = False,
        category_id: Optional[int] = None
    ) -> List[Product]:
        """Récupère les produits d'un producteur"""
        producer = self._ensure_producer_profile(user_id)
        if not producer:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Seuls les producteurs peuvent voir leurs produits"
            )
        
        return self.product_repo.get_producer_products(producer.id, skip, limit, active_only, category_id)
    
    def search_products(self, filters: ProductSearchFilters, skip: int = 0, limit: int = 100) -> List[Product]:
        """Recherche de produits avec filtres"""
        return self.product_repo.search_products(
            category_id=filters.category_id,
            producer_id=filters.producer_id,
            tag_ids=filters.tag_ids,
            min_price=float(filters.min_price) if filters.min_price else None,
            max_price=float(filters.max_price) if filters.max_price else None,
            is_featured=filters.is_featured,
            in_stock=filters.in_stock,
            search_term=filters.search_term,
            skip=skip,
            limit=limit
        )

    def update_product(self, product_id: int, user_id: int, product_data: ProductUpdate) -> Product:
        # Récupérer le produit existant
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Produit non trouvé")
        
        # Vérifier que l'utilisateur est le propriétaire du produit
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer or product.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier ce produit"
            )

        # Gestion des Tags (si fournis dans la requête)
        if product_data.tag_ids is not None:
            # Récupérer les IDs actuels pour savoir quoi supprimer
            current_tag_ids = [tag.id for tag in product.tags]
        
            # Supprimer les anciens liens si nécessaire
            if current_tag_ids:
                self.product_repo.remove_tags(product, current_tag_ids)
        
            # Ajouter les nouveaux tags (si la liste n'est pas vide)
            if product_data.tag_ids:
                self.product_repo.add_tags(product, product_data.tag_ids)

        # On convertit le schéma en dictionnaire en excluant les tags déjà gérés
        update_data = product_data.model_dump(exclude={"tag_ids"}, exclude_unset=True)
    
        for key, value in update_data.items():
            setattr(product, key, value)

        # Sauvegarde finale
        return self.product_repo.update(product)    

    def update_stock(
        self,
        product_id: int,
        user_id: int,
        quantity: int,
        movement_type: str,
        reason: Optional[str] = None
    ) -> Product:
        """Met à jour le stock d'un produit avec historique"""
        product = self.get_product(product_id)
        
        # Vérifier la propriété
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer or product.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas modifier ce produit"
            )
        
        # Calculer le nouveau stock
        if movement_type == "in":
            new_stock = product.stock_quantity + quantity
        elif movement_type == "out":
            new_stock = product.stock_quantity - quantity
        else:  # adjustment
            new_stock = quantity
        
        # Vérifier que le stock ne devient pas négatif
        if new_stock < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le stock ne peut pas être négatif"
            )
        
        # Enregistrer le mouvement
        self.stock_movement_repo.create(
            product_id=product.id,
            created_by=user_id,
            type=movement_type,
            quantity=quantity,
            reason=reason
        )
        
        # Mettre à jour le stock
        product = self.product_repo.update_stock(product, new_stock)
        
        # Vérifier si une alerte doit être déclenchée
        alert = self.stock_alert_repo.get_by_product(product.id)
        if alert and alert.is_active and new_stock <= alert.threshold:
            self.stock_alert_repo.mark_as_notified(alert)
        
        return product
    
    def delete_product(self, product_id: int, user_id: int) -> bool:
        """Supprime un produit"""
        product = self.get_product(product_id)
        
        # Vérifier la propriété
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer or product.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas supprimer ce produit"
            )
        
        return self.product_repo.delete(product)
    
    # ============= Product Images =============
    
    def add_image(self, product_id: int, user_id: int, image_data: ProductImageCreate) -> 'ProductImage':
        """Ajoute une image à un produit"""
        product = self.get_product(product_id)
        
        # Vérifier la propriété
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer or product.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas modifier ce produit"
            )

        existing_images = self.image_repo.get_product_images(product_id)
        image_payload = image_data.model_dump()
        # Première image du produit => image principale automatique
        image_payload["is_primary"] = bool(image_payload.get("is_primary")) or len(existing_images) == 0
        created_image = self.image_repo.create(product_id, **image_payload)

        if created_image.is_primary:
            return self.image_repo.set_as_primary(created_image)
        return created_image

    def add_image_file(
        self,
        product_id: int,
        user_id: int,
        image_file: UploadFile,
        alt_text: Optional[str] = None,
        position: int = 0,
        is_primary: bool = False
    ) -> 'ProductImage':
        """Upload un fichier image produit puis enregistre son URL en base."""
        # Validation droits avant écriture disque
        product = self.get_product(product_id)
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer or product.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas modifier ce produit"
            )

        filename = image_file.filename or "product-image.bin"
        extension = Path(filename).suffix.lower()
        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
        if extension and extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Format d'image non supporté. Utilisez JPG, PNG, WEBP ou GIF."
            )

        upload_dir = Path("uploads") / "products" / str(product_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        unique_name = f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{uuid4().hex}{extension or '.bin'}"
        saved_path = upload_dir / unique_name

        try:
            with saved_path.open("wb") as buffer:
                shutil.copyfileobj(image_file.file, buffer)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Impossible d'enregistrer le fichier image: {exc}"
            ) from exc

        public_url = f"/uploads/products/{product_id}/{unique_name}"
        return self.add_image(
            product_id=product_id,
            user_id=user_id,
            image_data=ProductImageCreate(
                url=public_url,
                alt_text=alt_text,
                position=position,
                is_primary=is_primary
            )
        )
    
    def get_product_images(self, product_id: int) -> List['ProductImage']:
        """Récupère toutes les images d'un produit"""
        self.get_product(product_id)  # Vérifier que le produit existe
        return self.image_repo.get_product_images(product_id)
    
    # ============= Product Variants =============
    
    def add_variant(self, product_id: int, user_id: int, variant_data: ProductVariantCreate) -> 'ProductVariant':
        """Ajoute une variante à un produit"""
        product = self.get_product(product_id)
        
        # Vérifier la propriété
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer or product.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas modifier ce produit"
            )
        
        return self.variant_repo.create(product_id, **variant_data.model_dump())
    
    def get_product_variants(self, product_id: int, active_only: bool = False) -> List['ProductVariant']:
        """Récupère toutes les variantes d'un produit"""
        self.get_product(product_id)  # Vérifier que le produit existe
        return self.variant_repo.get_product_variants(product_id, active_only)
    
    # ============= Stock Alerts =============
    
    def create_stock_alert(self, product_id: int, user_id: int, alert_data: StockAlertCreate) -> 'StockAlert':
        """Crée une alerte de stock pour un produit"""
        product = self.get_product(product_id)
        
        # Vérifier la propriété
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer or product.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas modifier ce produit"
            )
        
        # Vérifier qu'il n'y a pas déjà une alerte
        existing = self.stock_alert_repo.get_by_product(product_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Une alerte existe déjà pour ce produit. Modifiez-la ou supprimez-la d'abord."
            )
        
        return self.stock_alert_repo.create(product_id, **alert_data.model_dump(exclude={'product_id'}))
