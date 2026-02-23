from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core import deps
from app.models.auth import User
from app.schemas.wishlist import (
    Wishlist,
    WishlistCreate,
    WishlistUpdate,
    WishlistWithItems,
    WishlistWithItemsCount,
    WishlistItem,
    WishlistItemCreate,
    WishlistItemUpdate,
    WishlistItemWithProduct,
    ProductFollow,
    ProductFollowCreate,
    ProductFollowUpdate,
    ProductFollowWithProduct,
    ProducerFollow,
    ProducerFollowCreate,
    ProducerFollowUpdate,
    ProducerFollowWithProducer,
    WishlistStats,
    FollowStats,
    MoveItemRequest,
    BulkAddToWishlistRequest,
    ShareWishlistResponse
)
from app.services.wishlist_service import (
    WishlistService,
    WishlistItemService,
    ProductFollowService,
    ProducerFollowService
)

router = APIRouter()


# ==================== LISTES DE SOUHAITS ====================

@router.post("/wishlists", response_model=Wishlist, status_code=status.HTTP_201_CREATED)
def create_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_in: WishlistCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Crée une nouvelle liste de souhaits pour l'utilisateur connecté.
    
    Si la liste est marquée comme publique, un slug unique sera automatiquement généré
    pour permettre le partage via une URL conviviale.
    
    **Exemple de requête:**
    ```json
    {
        "name": "Mes produits préférés",
        "description": "Les produits que j'achète régulièrement",
        "is_public": false
    }
    ```
    """
    return WishlistService.create_wishlist(db, current_user.id, wishlist_in)


@router.get("/wishlists/my", response_model=List[WishlistWithItemsCount])
def get_my_wishlists(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère toutes les listes de souhaits de l'utilisateur connecté.
    
    Retourne les listes triées par ordre personnalisé (sort_order) puis par date de création.
    Chaque liste inclut le nombre d'items qu'elle contient.
    """
    wishlists = WishlistService.get_user_wishlists(db, current_user.id)
    
    # Enrichir avec le nombre d'items
    result = []
    for wishlist in wishlists:
        items_count = WishlistItemService.get_wishlist_items(db, wishlist.id, load_products=False)
        wishlist_dict = wishlist.__dict__.copy()
        wishlist_dict['items_count'] = len(items_count)
        result.append(wishlist_dict)
    
    return result


@router.get("/wishlists/{wishlist_id}", response_model=WishlistWithItems)
def get_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les détails complets d'une liste de souhaits avec tous ses items.
    
    L'utilisateur doit être le propriétaire de la liste pour y accéder.
    Pour accéder à une liste publique d'un autre utilisateur, utilisez l'endpoint /wishlists/public/{slug}.
    """
    wishlist = WishlistService.get_wishlist_with_items(db, wishlist_id)
    
    if not wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Liste de souhaits non trouvée"
        )
    
    # Vérifier que l'utilisateur est le propriétaire de la liste
    if wishlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas accès à cette liste"
        )
    
    return wishlist


@router.get("/wishlists/public/{slug}", response_model=WishlistWithItems)
def get_public_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    slug: str
):
    """
    Récupère une liste de souhaits publique via son slug.
    
    Cette route est accessible sans authentification et permet de partager des listes.
    Seules les listes marquées comme publiques peuvent être consultées de cette manière.
    
    **Exemple:** /wishlists/public/mes-produits-bio-preferes
    """
    wishlist = WishlistService.get_wishlist_by_slug(db, slug)
    
    if not wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Liste de souhaits non trouvée ou non publique"
        )
    
    return wishlist


@router.put("/wishlists/{wishlist_id}", response_model=Wishlist)
def update_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_id: int,
    wishlist_in: WishlistUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met à jour une liste de souhaits.
    
    Permet de modifier le nom, la description, la visibilité ou l'ordre d'affichage.
    Lorsqu'une liste devient publique, un slug unique est automatiquement généré.
    """
    # Vérifier les permissions
    if not WishlistService.check_user_permission(db, wishlist_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres listes"
        )
    
    wishlist = WishlistService.update_wishlist(db, wishlist_id, wishlist_in)
    
    if not wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Liste de souhaits non trouvée"
        )
    
    return wishlist


@router.delete("/wishlists/{wishlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Supprime une liste de souhaits et tous ses items.
    
    Cette action est irréversible. Tous les produits de la liste seront supprimés,
    mais les produits eux-mêmes ne seront pas affectés.
    """
    # Vérifier les permissions
    if not WishlistService.check_user_permission(db, wishlist_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez supprimer que vos propres listes"
        )
    
    success = WishlistService.delete_wishlist(db, wishlist_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Liste de souhaits non trouvée"
        )


@router.post("/wishlists/{wishlist_id}/share", response_model=ShareWishlistResponse)
def share_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Génère un lien de partage pour une liste de souhaits.
    
    La liste sera automatiquement rendue publique si ce n'est pas déjà le cas.
    Retourne l'URL complète de partage avec le slug de la liste.
    """
    # Vérifier les permissions
    if not WishlistService.check_user_permission(db, wishlist_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez partager que vos propres listes"
        )
    
    wishlist = WishlistService.get_wishlist(db, wishlist_id)
    
    if not wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Liste de souhaits non trouvée"
        )
    
    # Rendre la liste publique si nécessaire
    if not wishlist.is_public:
        update_data = WishlistUpdate(is_public=True)
        wishlist = WishlistService.update_wishlist(db, wishlist_id, update_data)
    
    # Construire l'URL de partage
    share_url = f"/wishlists/public/{wishlist.slug}"
    
    return {
        "share_url": share_url,
        "slug": wishlist.slug,
        "expires_at": None  # Peut être implémenté si on veut des liens temporaires
    }


@router.get("/wishlists/stats/my", response_model=WishlistStats)
def get_my_wishlist_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère des statistiques sur les listes de souhaits de l'utilisateur connecté.
    
    Retourne le nombre total de listes, d'items, de listes publiques,
    et identifie la liste la plus populaire (celle avec le plus d'items).
    """
    return WishlistService.get_wishlist_stats(db, current_user.id)


# ==================== ITEMS DE LISTE ====================

@router.post("/wishlists/{wishlist_id}/items", response_model=WishlistItem, status_code=status.HTTP_201_CREATED)
def add_item_to_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_id: int,
    item_in: WishlistItemCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Ajoute un produit à une liste de souhaits.
    
    Si le produit est déjà dans la liste, l'opération échouera avec une erreur 409.
    Vous pouvez ajouter des notes personnelles et spécifier une quantité souhaitée.
    
    **Exemple de requête:**
    ```json
    {
        "product_id": 42,
        "notes": "Pour l'anniversaire de Marie",
        "desired_quantity": 2
    }
    ```
    """
    # Vérifier les permissions
    if not WishlistService.check_user_permission(db, wishlist_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres listes"
        )
    
    item = WishlistItemService.add_item(db, wishlist_id, item_in)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce produit est déjà dans la liste"
        )
    
    return item


@router.post("/wishlists/{wishlist_id}/items/bulk", status_code=status.HTTP_201_CREATED)
def add_multiple_items_to_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_id: int,
    bulk_in: BulkAddToWishlistRequest,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Ajoute plusieurs produits à une liste de souhaits en une seule opération.
    
    Maximum 50 produits à la fois. Les produits déjà présents dans la liste seront ignorés.
    Retourne la liste des produits ajoutés et ceux qui étaient déjà présents.
    """
    # Vérifier les permissions
    if not WishlistService.check_user_permission(db, wishlist_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres listes"
        )
    
    created_items, already_exists = WishlistItemService.add_multiple_items(
        db,
        wishlist_id,
        bulk_in.product_ids,
        bulk_in.notes
    )
    
    return {
        "added": len(created_items),
        "already_exists": already_exists,
        "items": created_items
    }


@router.get("/wishlists/{wishlist_id}/items", response_model=List[WishlistItemWithProduct])
def get_wishlist_items(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère tous les items d'une liste de souhaits avec les détails des produits.
    
    Les items sont triés par ordre d'affichage personnalisé puis par date d'ajout.
    """
    # Vérifier les permissions
    wishlist = WishlistService.get_wishlist(db, wishlist_id)
    
    if not wishlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Liste de souhaits non trouvée"
        )
    
    if wishlist.user_id != current_user.id and not wishlist.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas accès à cette liste"
        )
    
    return WishlistItemService.get_wishlist_items(db, wishlist_id, load_products=True)


@router.put("/wishlists/items/{item_id}", response_model=WishlistItem)
def update_wishlist_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    item_in: WishlistItemUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met à jour un item de liste de souhaits.
    
    Permet de modifier les notes, la quantité souhaitée ou l'ordre d'affichage.
    Ne permet pas de changer le produit (il faut supprimer et recréer l'item).
    """
    item = WishlistItemService.update_item(db, item_id, item_in)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item non trouvé"
        )
    
    # Vérifier les permissions via la wishlist
    if not WishlistService.check_user_permission(db, item.wishlist_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres items"
        )
    
    return item


@router.delete("/wishlists/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item_from_wishlist(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Supprime un item d'une liste de souhaits.
    
    Le produit lui-même n'est pas affecté, seule la référence dans la liste est supprimée.
    """
    success = WishlistItemService.remove_item(db, item_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item non trouvé"
        )


@router.post("/wishlists/items/move", response_model=WishlistItem)
def move_item_between_wishlists(
    *,
    db: Session = Depends(deps.get_db),
    move_request: MoveItemRequest,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Déplace un item d'une liste de souhaits vers une autre.
    
    Les deux listes doivent appartenir à l'utilisateur connecté.
    Si le produit existe déjà dans la liste de destination, l'opération échouera.
    """
    # Vérifier les permissions sur la liste de destination
    if not WishlistService.check_user_permission(db, move_request.target_wishlist_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez déplacer des items que vers vos propres listes"
        )
    
    item = WishlistItemService.move_item_to_wishlist(
        db,
        move_request.item_id,
        move_request.target_wishlist_id
    )
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Impossible de déplacer l'item (déjà existant dans la liste de destination ou item non trouvé)"
        )
    
    return item


# ==================== SUIVI DE PRODUITS ====================

@router.post("/follows/products", response_model=ProductFollow, status_code=status.HTTP_201_CREATED)
def follow_product(
    *,
    db: Session = Depends(deps.get_db),
    follow_in: ProductFollowCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Commence à suivre un produit pour recevoir des notifications.
    
    Vous pouvez choisir de recevoir des notifications :
    - Quand le produit revient en stock
    - Quand le prix baisse
    - Quand le prix descend en dessous d'un seuil spécifique
    
    **Exemple de requête:**
    ```json
    {
        "product_id": 42,
        "notify_on_stock": true,
        "notify_on_price_drop": true,
        "price_threshold": 1500
    }
    ```
    Le price_threshold est en centimes (1500 = 15,00€).
    """
    # TODO: Récupérer le prix actuel du produit pour l'enregistrer
    current_price = None  # À implémenter avec le ProductService
    
    follow = ProductFollowService.follow_product(db, current_user.id, follow_in, current_price)
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Vous suivez déjà ce produit"
        )
    
    return follow


@router.get("/follows/products/my", response_model=List[ProductFollowWithProduct])
def get_my_followed_products(
    *,
    db: Session = Depends(deps.get_db),
    active_only: bool = Query(True, description="Afficher uniquement les suivis actifs"),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère tous les produits suivis par l'utilisateur connecté.
    
    Par défaut, n'affiche que les suivis actifs. Passez active_only=false pour voir tous les suivis.
    """
    return ProductFollowService.get_user_followed_products(db, current_user.id, active_only)


@router.put("/follows/products/{follow_id}", response_model=ProductFollow)
def update_product_follow(
    *,
    db: Session = Depends(deps.get_db),
    follow_id: int,
    follow_in: ProductFollowUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met à jour les préférences de suivi d'un produit.
    
    Permet de modifier les notifications ou de désactiver temporairement le suivi sans le supprimer.
    """
    follow = ProductFollowService.update_follow(db, follow_id, follow_in)
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suivi de produit non trouvé"
        )
    
    return follow


@router.delete("/follows/products/{follow_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_product(
    *,
    db: Session = Depends(deps.get_db),
    follow_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Arrête de suivre un produit.
    
    Toutes les notifications liées à ce produit seront désactivées.
    """
    success = ProductFollowService.unfollow_product(db, follow_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suivi de produit non trouvé"
        )


# ==================== SUIVI DE PRODUCTEURS ====================

@router.post("/follows/producers", response_model=ProducerFollow, status_code=status.HTTP_201_CREATED)
def follow_producer(
    *,
    db: Session = Depends(deps.get_db),
    follow_in: ProducerFollowCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Commence à suivre un producteur pour recevoir des notifications.
    
    Vous pouvez choisir de recevoir des notifications :
    - Lors de nouveaux produits
    - Lors de promotions
    - Lors de nouveaux articles de blog
    
    **Exemple de requête:**
    ```json
    {
        "producer_id": 15,
        "notify_on_new_product": true,
        "notify_on_promotion": true,
        "notify_on_blog_post": false
    }
    ```
    """
    follow = ProducerFollowService.follow_producer(db, current_user.id, follow_in)
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Vous suivez déjà ce producteur ou tentez de vous suivre vous-même"
        )
    
    return follow


@router.get("/follows/producers/my", response_model=List[ProducerFollowWithProducer])
def get_my_followed_producers(
    *,
    db: Session = Depends(deps.get_db),
    active_only: bool = Query(True, description="Afficher uniquement les suivis actifs"),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère tous les producteurs suivis par l'utilisateur connecté.
    
    Par défaut, n'affiche que les suivis actifs. Passez active_only=false pour voir tous les suivis.
    """
    return ProducerFollowService.get_user_followed_producers(db, current_user.id, active_only)


@router.put("/follows/producers/{follow_id}", response_model=ProducerFollow)
def update_producer_follow(
    *,
    db: Session = Depends(deps.get_db),
    follow_id: int,
    follow_in: ProducerFollowUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met à jour les préférences de suivi d'un producteur.
    
    Permet de modifier les types de notifications reçues ou de désactiver temporairement le suivi.
    """
    follow = ProducerFollowService.update_follow(db, follow_id, follow_in)
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suivi de producteur non trouvé"
        )
    
    return follow


@router.delete("/follows/producers/{follow_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_producer(
    *,
    db: Session = Depends(deps.get_db),
    follow_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Arrête de suivre un producteur.
    
    Toutes les notifications liées à ce producteur seront désactivées.
    """
    success = ProducerFollowService.unfollow_producer(db, follow_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suivi de producteur non trouvé"
        )


@router.get("/follows/stats", response_model=FollowStats)
def get_follow_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère des statistiques sur les suivis de l'utilisateur connecté.
    
    Retourne le nombre de produits suivis, de producteurs suivis, et le nombre total
    de notifications actives.
    """
    return ProducerFollowService.get_follow_stats(db, current_user.id)