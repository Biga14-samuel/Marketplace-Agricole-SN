from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal

from app.core.database import get_db
from app.services.product_service import (
    CategoryService, TagService, UnitService, ProductService
)
from app.routers.auth_router import get_current_user
from app.schemas.product_schema import (
    CategoryCreate, CategoryUpdate, CategoryResponse, CategoryTree,
    TagCreate, TagResponse,
    UnitCreate, UnitResponse,
    ProductCreate, ProductUpdate, ProductResponse, ProductComplete,
    ProductImageCreate, ProductImageResponse,
    ProductVariantCreate, ProductVariantResponse,
    StockAlertCreate, StockAlertResponse,
    ProductStockUpdate, ProductSearchFilters
)
from app.schemas.auth_schema import MessageResponse

router = APIRouter(prefix="/products", tags=["Products & Catalog"])


# ============= Dependencies =============

def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(db)


def get_tag_service(db: Session = Depends(get_db)) -> TagService:
    return TagService(db)


def get_unit_service(db: Session = Depends(get_db)) -> UnitService:
    return UnitService(db)


def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(db)


# ============= Category Endpoints =============

@router.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer une catégorie"
)
def create_category(
    category_data: CategoryCreate,
    current_user=Depends(get_current_user),
    category_service: CategoryService = Depends(get_category_service)
):
    """
    Crée une nouvelle catégorie de produits.
    
    **Réservé aux administrateurs.**
    
    Une catégorie peut avoir une catégorie parente pour créer une hiérarchie.
    Par exemple : "Légumes" → "Légumes feuilles" → "Salades"
    """
    category = category_service.create_category(category_data)
    return CategoryResponse.model_validate(category)


@router.get(
    "/categories",
    response_model=List[CategoryResponse],
    summary="Obtenir toutes les catégories"
)
def get_categories(
    active_only: bool = Query(False, description="Ne retourner que les catégories actives"),
    category_service: CategoryService = Depends(get_category_service)
):
    """
    Récupère la liste de toutes les catégories.
    
    Cette route est publique et ne nécessite pas d'authentification.
    """
    categories = category_service.get_all_categories(active_only)
    return [CategoryResponse.model_validate(cat) for cat in categories]


@router.get(
    "/categories/tree",
    response_model=List[CategoryTree],
    summary="Obtenir l'arbre des catégories"
)
def get_category_tree(
    active_only: bool = Query(False, description="Ne retourner que les catégories actives"),
    category_service: CategoryService = Depends(get_category_service)
):
    """
    Récupère l'arbre hiérarchique des catégories.
    
    Retourne les catégories racines avec leurs sous-catégories imbriquées.
    """
    tree = category_service.get_category_tree(active_only)
    return [CategoryTree.model_validate(cat) for cat in tree]


@router.get(
    "/categories/{category_id}",
    response_model=CategoryResponse,
    summary="Obtenir une catégorie"
)
def get_category(
    category_id: int,
    category_service: CategoryService = Depends(get_category_service)
):
    """Récupère une catégorie spécifique par son ID."""
    category = category_service.get_category(category_id)
    return CategoryResponse.model_validate(category)


@router.put(
    "/categories/{category_id}",
    response_model=CategoryResponse,
    summary="Mettre à jour une catégorie"
)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user=Depends(get_current_user),
    category_service: CategoryService = Depends(get_category_service)
):
    """Met à jour une catégorie. **Réservé aux administrateurs.**"""
    category = category_service.update_category(category_id, category_data)
    return CategoryResponse.model_validate(category)


@router.delete(
    "/categories/{category_id}",
    response_model=MessageResponse,
    summary="Supprimer une catégorie"
)
def delete_category(
    category_id: int,
    current_user=Depends(get_current_user),
    category_service: CategoryService = Depends(get_category_service)
):
    """Supprime une catégorie. **Réservé aux administrateurs.**"""
    category_service.delete_category(category_id)
    return MessageResponse(message="Catégorie supprimée avec succès")


# ============= Tag Endpoints =============

@router.post(
    "/tags",
    response_model=TagResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un tag"
)
def create_tag(
    tag_data: TagCreate,
    current_user=Depends(get_current_user),
    tag_service: TagService = Depends(get_tag_service)
):
    """
    Crée un nouveau tag.
    
    **Réservé aux administrateurs.**
    
    Les types de tags disponibles :
    - **bio** : Produits biologiques certifiés
    - **local** : Produits locaux de la région
    - **season** : Produits de saison
    - **promo** : Produits en promotion
    """
    tag = tag_service.create_tag(tag_data)
    return TagResponse.model_validate(tag)


@router.get(
    "/tags",
    response_model=List[TagResponse],
    summary="Obtenir tous les tags"
)
def get_tags(
    type: Optional[str] = Query(None, description="Filtrer par type de tag"),
    active_only: bool = Query(False, description="Ne retourner que les tags actifs"),
    tag_service: TagService = Depends(get_tag_service)
):
    """
    Récupère la liste de tous les tags.
    
    Cette route est publique et ne nécessite pas d'authentification.
    """
    tags = tag_service.get_all_tags(type, active_only)
    return [TagResponse.model_validate(tag) for tag in tags]


# ============= Unit Endpoints =============

@router.post(
    "/units",
    response_model=UnitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer une unité de mesure"
)
def create_unit(
    unit_data: UnitCreate,
    current_user=Depends(get_current_user),
    unit_service: UnitService = Depends(get_unit_service)
):
    """
    Crée une nouvelle unité de mesure.
    
    **Réservé aux administrateurs.**
    
    Types d'unités :
    - **weight** : Poids (kg, g, etc.)
    - **volume** : Volume (L, mL, etc.)
    - **piece** : Pièce unitaire
    """
    unit = unit_service.create_unit(unit_data)
    return UnitResponse.model_validate(unit)


@router.get(
    "/units",
    response_model=List[UnitResponse],
    summary="Obtenir toutes les unités"
)
def get_units(
    unit_type: Optional[str] = Query(None, description="Filtrer par type d'unité"),
    active_only: bool = Query(False, description="Ne retourner que les unités actives"),
    unit_service: UnitService = Depends(get_unit_service)
):
    """
    Récupère la liste de toutes les unités de mesure.
    
    Cette route est publique et ne nécessite pas d'authentification.
    """
    units = unit_service.get_all_units(unit_type, active_only)
    return [UnitResponse.model_validate(unit) for unit in units]


# ============= Product Endpoints =============

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un produit"
)
def create_product(
    product_data: ProductCreate,
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Crée un nouveau produit.
    
    **Réservé aux producteurs.**
    
    Informations requises :
    - **name** : Nom du produit
    - **slug** : Identifiant URL unique (ex: tomates-bio)
    - **price** : Prix unitaire
    - **stock_quantity** : Quantité en stock
    - **category_id** : ID de la catégorie
    - **unit_id** : ID de l'unité de mesure
    
    Informations optionnelles :
    - **description** : Description détaillée
    - **tag_ids** : Liste des IDs des tags à associer
    - **origin** : Origine géographique
    - **harvest_date** : Date de récolte
    - **min_order** : Quantité minimum de commande
    - **max_order** : Quantité maximum de commande
    """
    product = product_service.create_product(current_user.id, product_data)
    return ProductResponse.model_validate(product)


@router.get(
    "/",
    response_model=List[ProductResponse],
    summary="Rechercher des produits"
)
def search_products(
    category_id: Optional[int] = Query(None, description="Filtrer par catégorie"),
    producer_id: Optional[int] = Query(None, description="Filtrer par producteur"),
    tag_ids: Optional[List[int]] = Query(None, description="Filtrer par tags"),
    min_price: Optional[Decimal] = Query(None, description="Prix minimum"),
    max_price: Optional[Decimal] = Query(None, description="Prix maximum"),
    is_featured: Optional[bool] = Query(None, description="Produits mis en avant uniquement"),
    in_stock: Optional[bool] = Query(None, description="Produits en stock uniquement"),
    search_term: Optional[str] = Query(None, description="Recherche textuelle"),
    skip: int = Query(0, ge=0, description="Nombre d'éléments à ignorer"),
    limit: int = Query(100, ge=1, le=100, description="Nombre d'éléments à retourner"),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Recherche de produits avec filtres multiples.
    
    Cette route est publique et ne retourne que les produits actifs.
    Tous les filtres sont optionnels et peuvent être combinés.
    """
    filters = ProductSearchFilters(
        category_id=category_id,
        producer_id=producer_id,
        tag_ids=tag_ids,
        min_price=min_price,
        max_price=max_price,
        is_featured=is_featured,
        in_stock=in_stock,
        search_term=search_term
    )
    products = product_service.search_products(filters, skip, limit)
    return [ProductResponse.model_validate(p) for p in products]


@router.get(
    "/my-products",
    response_model=List[ProductResponse],
    summary="Obtenir mes produits"
)
def get_my_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = Query(False, description="Ne retourner que les produits actifs"),
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Récupère tous les produits du producteur connecté.
    
    **Réservé aux producteurs.**
    """
    products = product_service.get_my_products(current_user.id, skip, limit, active_only)
    return [ProductResponse.model_validate(p) for p in products]


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Obtenir un produit"
)
def get_product(
    product_id: int,
    product_service: ProductService = Depends(get_product_service)
):
    """
    Récupère un produit spécifique par son ID.
    
    Cette route est publique.
    """
    product = product_service.get_product(product_id)
    return ProductResponse.model_validate(product)


@router.get(
    "/{product_id}/complete",
    response_model=ProductComplete,
    summary="Obtenir un produit complet"
)
def get_complete_product(
    product_id: int,
    product_service: ProductService = Depends(get_product_service)
):
    """
    Récupère un produit avec toutes ses informations :
    - Images
    - Variantes
    - Disponibilité saisonnière
    - Catégorie et unité
    - Tags
    
    Cette route est publique.
    """
    product = product_service.get_complete_product(product_id)
    return ProductComplete.model_validate(product)


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Mettre à jour un produit"
)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Met à jour un produit.
    
    Seul le producteur propriétaire du produit peut le modifier.
    Tous les champs sont optionnels - seuls les champs fournis seront mis à jour.
    """
    product = product_service.update_product(product_id, current_user.id, product_data)
    return ProductResponse.model_validate(product)


@router.post(
    "/{product_id}/stock",
    response_model=ProductResponse,
    summary="Mettre à jour le stock"
)
def update_stock(
    product_id: int,
    stock_data: ProductStockUpdate,
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Met à jour le stock d'un produit avec enregistrement dans l'historique.
    
    Types de mouvements :
    - **in** : Entrée de stock (réapprovisionnement)
    - **out** : Sortie de stock (vente)
    - **adjustment** : Ajustement manuel (correction d'inventaire)
    
    Pour les types "in" et "out", la quantité est ajoutée ou soustraite du stock actuel.
    Pour le type "adjustment", la quantité devient le nouveau stock total.
    """
    product = product_service.update_stock(
        product_id,
        current_user.id,
        stock_data.quantity,
        stock_data.type,
        stock_data.reason
    )
    return ProductResponse.model_validate(product)


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer un produit"
)
def delete_product(
    product_id: int,
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Supprime un produit.
    
    Seul le producteur propriétaire du produit peut le supprimer.
    ⚠️ Cette action supprime également toutes les données associées (images, variantes, etc.)
    """
    product_service.delete_product(product_id, current_user.id)


# ============= Product Images =============

@router.post(
    "/{product_id}/images",
    response_model=ProductImageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter une image"
)
def add_product_image(
    product_id: int,
    image_data: ProductImageCreate,
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Ajoute une image à un produit.
    
    Seul le producteur propriétaire du produit peut ajouter des images.
    La première image ajoutée est automatiquement définie comme image principale.
    """
    image = product_service.add_image(product_id, current_user.id, image_data)
    return ProductImageResponse.model_validate(image)


@router.get(
    "/{product_id}/images",
    response_model=List[ProductImageResponse],
    summary="Obtenir les images d'un produit"
)
def get_product_images(
    product_id: int,
    product_service: ProductService = Depends(get_product_service)
):
    """
    Récupère toutes les images d'un produit.
    
    Cette route est publique.
    """
    images = product_service.get_product_images(product_id)
    return [ProductImageResponse.model_validate(img) for img in images]


# ============= Product Variants =============

@router.post(
    "/{product_id}/variants",
    response_model=ProductVariantResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter une variante"
)
def add_product_variant(
    product_id: int,
    variant_data: ProductVariantCreate,
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Ajoute une variante à un produit.
    
    Les variantes permettent de proposer le même produit dans différents formats.
    Exemple : Tomates en 1kg, 3kg ou 5kg.
    
    Le prix final de la variante = prix du produit + price_modifier
    """
    variant = product_service.add_variant(product_id, current_user.id, variant_data)
    return ProductVariantResponse.model_validate(variant)


@router.get(
    "/{product_id}/variants",
    response_model=List[ProductVariantResponse],
    summary="Obtenir les variantes d'un produit"
)
def get_product_variants(
    product_id: int,
    active_only: bool = Query(False, description="Ne retourner que les variantes actives"),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Récupère toutes les variantes d'un produit.
    
    Cette route est publique.
    """
    variants = product_service.get_product_variants(product_id, active_only)
    return [ProductVariantResponse.model_validate(v) for v in variants]


# ============= Stock Alerts =============

@router.post(
    "/{product_id}/stock-alert",
    response_model=StockAlertResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer une alerte de stock"
)
def create_stock_alert(
    product_id: int,
    alert_data: StockAlertCreate,
    current_user=Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """
    Crée une alerte de stock bas pour un produit.
    
    Quand le stock descend en dessous du seuil défini,
    une notification sera envoyée au producteur.
    """
    alert = product_service.create_stock_alert(product_id, current_user.id, alert_data)
    return StockAlertResponse.model_validate(alert)