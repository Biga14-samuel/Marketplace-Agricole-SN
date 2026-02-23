from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timezone
from sqlalchemy.orm import Session
import slugify

from app.models.wishlist import Wishlist, WishlistItem, ProductFollow, ProducerFollow
from app.schemas.wishlist import (
    WishlistCreate,
    WishlistUpdate,
    WishlistItemCreate,
    WishlistItemUpdate,
    ProductFollowCreate,
    ProductFollowUpdate,
    ProducerFollowCreate,
    ProducerFollowUpdate
)
from app.repositories.wishlist_repository import (
    WishlistRepository,
    WishlistItemRepository,
    ProductFollowRepository,
    ProducerFollowRepository
)


class WishlistService:
    """
    Service pour gérer les listes de souhaits.
    Implémente la logique métier comme la génération de slugs uniques,
    la validation des permissions, etc.
    """
    
    @staticmethod
    def create_wishlist(
        db: Session,
        user_id: int,
        wishlist_data: WishlistCreate
    ) -> Wishlist:
        """
        Crée une nouvelle liste de souhaits pour un utilisateur.
        Si la liste est publique, génère automatiquement un slug unique pour le partage.
        """
        wishlist = Wishlist(
            user_id=user_id,
            **wishlist_data.model_dump()
        )
        
        # Générer un slug unique si la liste est publique
        if wishlist.is_public:
            base_slug = slugify.slugify(wishlist.name)
            slug = base_slug
            counter = 1
            
            # Vérifier l'unicité du slug et incrémenter si nécessaire
            while WishlistRepository.get_by_slug(db, slug):
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            wishlist.slug = slug
        
        return WishlistRepository.create(db, wishlist)
    
    @staticmethod
    def get_wishlist(db: Session, wishlist_id: int) -> Optional[Wishlist]:
        """Récupère une liste de souhaits par son ID"""
        return WishlistRepository.get_by_id(db, wishlist_id)
    
    @staticmethod
    def get_wishlist_by_slug(db: Session, slug: str) -> Optional[Wishlist]:
        """
        Récupère une liste de souhaits publique par son slug.
        Cela permet de partager des listes via des URLs conviviales comme:
        https://example.com/wishlists/mes-produits-preferes
        """
        return WishlistRepository.get_by_slug(db, slug)
    
    @staticmethod
    def get_wishlist_with_items(db: Session, wishlist_id: int) -> Optional[Wishlist]:
        """
        Récupère une liste de souhaits avec tous ses items et les détails des produits.
        Optimisé pour éviter les requêtes N+1 grâce au joinedload.
        """
        return WishlistRepository.get_with_items(db, wishlist_id)
    
    @staticmethod
    def get_user_wishlists(db: Session, user_id: int) -> List[Wishlist]:
        """Récupère toutes les listes d'un utilisateur, triées par ordre personnalisé"""
        return WishlistRepository.get_user_wishlists(db, user_id)
    
    @staticmethod
    def update_wishlist(
        db: Session,
        wishlist_id: int,
        wishlist_data: WishlistUpdate
    ) -> Optional[Wishlist]:
        """
        Met à jour une liste de souhaits.
        Si la liste devient publique, génère un slug.
        Si elle redevient privée, supprime le slug.
        """
        wishlist = WishlistRepository.get_by_id(db, wishlist_id)
        
        if not wishlist:
            return None
        
        # Récupérer les champs à mettre à jour
        update_data = wishlist_data.model_dump(exclude_unset=True)
        
        # Gérer la visibilité et le slug
        if 'is_public' in update_data:
            if update_data['is_public'] and not wishlist.slug:
                # La liste devient publique, générer un slug
                base_slug = slugify.slugify(wishlist.name)
                slug = base_slug
                counter = 1
                
                while WishlistRepository.get_by_slug(db, slug):
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                
                wishlist.slug = slug
            elif not update_data['is_public']:
                # La liste devient privée, supprimer le slug
                wishlist.slug = None
        
        # Mettre à jour les autres champs
        for field, value in update_data.items():
            if field != 'is_public':  # Déjà géré ci-dessus
                setattr(wishlist, field, value)
        
        return WishlistRepository.update(db, wishlist)
    
    @staticmethod
    def delete_wishlist(db: Session, wishlist_id: int) -> bool:
        """
        Supprime une liste de souhaits.
        Retourne True si la suppression a réussi, False si la liste n'existait pas.
        """
        wishlist = WishlistRepository.get_by_id(db, wishlist_id)
        
        if not wishlist:
            return False
        
        WishlistRepository.delete(db, wishlist)
        return True
    
    @staticmethod
    def check_user_permission(
        db: Session,
        wishlist_id: int,
        user_id: int
    ) -> bool:
        """
        Vérifie si un utilisateur a la permission de modifier une liste.
        Un utilisateur peut modifier uniquement ses propres listes.
        """
        wishlist = WishlistRepository.get_by_id(db, wishlist_id)
        
        if not wishlist:
            return False
        
        return wishlist.user_id == user_id
    
    @staticmethod
    def get_wishlist_stats(db: Session, user_id: int) -> Dict[str, Any]:
        """
        Calcule des statistiques sur les listes de souhaits d'un utilisateur.
        Retourne le nombre total de listes, d'items, de listes publiques, etc.
        """
        total_wishlists = WishlistRepository.count_user_wishlists(db, user_id)
        total_items = WishlistItemRepository.count_total_items_for_user(db, user_id)
        public_wishlists = WishlistRepository.count_public_wishlists(db, user_id)
        
        # Trouver la liste la plus populaire (celle avec le plus d'items)
        wishlists = WishlistRepository.get_user_wishlists(db, user_id)
        most_popular = None
        max_items = 0
        
        for wishlist in wishlists:
            item_count = WishlistItemRepository.count_items_in_wishlist(db, wishlist.id)
            if item_count > max_items:
                max_items = item_count
                most_popular = wishlist.name
        
        return {
            "total_wishlists": total_wishlists,
            "total_items": total_items,
            "public_wishlists": public_wishlists,
            "most_popular_wishlist": most_popular
        }


class WishlistItemService:
    """
    Service pour gérer les items dans les listes de souhaits.
    Gère l'ajout, la modification et la suppression de produits dans les listes.
    """
    
    @staticmethod
    def add_item(
        db: Session,
        wishlist_id: int,
        item_data: WishlistItemCreate
    ) -> Optional[WishlistItem]:
        """
        Ajoute un produit à une liste de souhaits.
        Vérifie d'abord que le produit n'est pas déjà dans la liste pour éviter les doublons.
        """
        # Vérifier si le produit n'est pas déjà dans la liste
        if WishlistItemRepository.exists_in_wishlist(db, wishlist_id, item_data.product_id):
            return None  # Le produit est déjà dans la liste
        
        item = WishlistItem(
            wishlist_id=wishlist_id,
            **item_data.model_dump()
        )
        
        return WishlistItemRepository.create(db, item)
    
    @staticmethod
    def add_multiple_items(
        db: Session,
        wishlist_id: int,
        product_ids: List[int],
        notes: Optional[str] = None
    ) -> Tuple[List[WishlistItem], List[int]]:
        """
        Ajoute plusieurs produits à une liste en une seule opération.
        Retourne un tuple avec (items créés, IDs de produits déjà présents).
        Plus performant que d'ajouter les items un par un.
        """
        items_to_create = []
        already_exists = []
        
        for product_id in product_ids:
            # Vérifier si le produit n'est pas déjà dans la liste
            if WishlistItemRepository.exists_in_wishlist(db, wishlist_id, product_id):
                already_exists.append(product_id)
                continue
            
            item = WishlistItem(
                wishlist_id=wishlist_id,
                product_id=product_id,
                notes=notes
            )
            items_to_create.append(item)
        
        created_items = []
        if items_to_create:
            created_items = WishlistItemRepository.create_bulk(db, items_to_create)
        
        return created_items, already_exists
    
    @staticmethod
    def get_wishlist_items(
        db: Session,
        wishlist_id: int,
        load_products: bool = True
    ) -> List[WishlistItem]:
        """
        Récupère tous les items d'une liste de souhaits.
        Peut charger les détails des produits pour éviter des requêtes supplémentaires.
        """
        return WishlistItemRepository.get_by_wishlist(db, wishlist_id, load_products)
    
    @staticmethod
    def update_item(
        db: Session,
        item_id: int,
        item_data: WishlistItemUpdate
    ) -> Optional[WishlistItem]:
        """
        Met à jour un item de liste (notes, quantité, ordre d'affichage).
        Utile pour permettre aux utilisateurs de personnaliser leurs listes.
        """
        item = WishlistItemRepository.get_by_id(db, item_id)
        
        if not item:
            return None
        
        update_data = item_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(item, field, value)
        
        return WishlistItemRepository.update(db, item)
    
    @staticmethod
    def remove_item(db: Session, item_id: int) -> bool:
        """
        Supprime un item d'une liste de souhaits.
        Retourne True si la suppression a réussi, False si l'item n'existait pas.
        """
        item = WishlistItemRepository.get_by_id(db, item_id)
        
        if not item:
            return False
        
        WishlistItemRepository.delete(db, item)
        return True
    
    @staticmethod
    def remove_item_by_product(
        db: Session,
        wishlist_id: int,
        product_id: int
    ) -> bool:
        """
        Supprime un produit spécifique d'une liste.
        Alternative à remove_item quand on connaît l'ID du produit plutôt que l'ID de l'item.
        """
        return WishlistItemRepository.delete_by_product(db, wishlist_id, product_id)
    
    @staticmethod
    def move_item_to_wishlist(
        db: Session,
        item_id: int,
        target_wishlist_id: int
    ) -> Optional[WishlistItem]:
        """
        Déplace un item d'une liste de souhaits vers une autre.
        Vérifie que le produit n'existe pas déjà dans la liste de destination.
        """
        item = WishlistItemRepository.get_by_id(db, item_id)
        
        if not item:
            return None
        
        # Vérifier que le produit n'est pas déjà dans la liste de destination
        if WishlistItemRepository.exists_in_wishlist(db, target_wishlist_id, item.product_id):
            return None
        
        item.wishlist_id = target_wishlist_id
        return WishlistItemRepository.update(db, item)
    
    @staticmethod
    def find_product_in_user_wishlists(
        db: Session,
        user_id: int,
        product_id: int
    ) -> List[WishlistItem]:
        """
        Trouve toutes les listes de souhaits d'un utilisateur contenant un produit donné.
        Utile pour afficher "Ce produit est dans X de vos listes" sur la page produit.
        """
        return WishlistItemRepository.get_by_product(db, product_id, user_id)


class ProductFollowService:
    """
    Service pour gérer le suivi des produits.
    Permet aux utilisateurs de surveiller les changements de stock et de prix.
    """
    
    @staticmethod
    def follow_product(
        db: Session,
        user_id: int,
        follow_data: ProductFollowCreate,
        current_price: Optional[int] = None
    ) -> Optional[ProductFollow]:
        """
        Commence à suivre un produit.
        Enregistre le prix actuel pour pouvoir détecter les baisses ultérieures.
        Retourne None si l'utilisateur suit déjà ce produit.
        """
        # Vérifier si l'utilisateur suit déjà ce produit
        existing = ProductFollowRepository.get_by_user_and_product(
            db, user_id, follow_data.product_id
        )
        
        if existing:
            return None  # L'utilisateur suit déjà ce produit
        
        follow = ProductFollow(
            user_id=user_id,
            initial_price=current_price,
            **follow_data.model_dump()
        )
        
        return ProductFollowRepository.create(db, follow)
    
    @staticmethod
    def get_user_followed_products(
        db: Session,
        user_id: int,
        active_only: bool = True
    ) -> List[ProductFollow]:
        """
        Récupère tous les produits suivis par un utilisateur.
        Peut filtrer pour n'afficher que les suivis actifs.
        """
        return ProductFollowRepository.get_user_follows(db, user_id, active_only, load_products=True)
    
    @staticmethod
    def update_follow(
        db: Session,
        follow_id: int,
        follow_data: ProductFollowUpdate
    ) -> Optional[ProductFollow]:
        """
        Met à jour les préférences de suivi d'un produit.
        Permet de modifier les notifications ou de désactiver temporairement le suivi.
        """
        follow = ProductFollowRepository.get_by_id(db, follow_id)
        
        if not follow:
            return None
        
        update_data = follow_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(follow, field, value)
        
        return ProductFollowRepository.update(db, follow)
    
    @staticmethod
    def unfollow_product(db: Session, follow_id: int) -> bool:
        """
        Arrête de suivre un produit.
        Retourne True si l'opération a réussi, False si le suivi n'existait pas.
        """
        follow = ProductFollowRepository.get_by_id(db, follow_id)
        
        if not follow:
            return False
        
        ProductFollowRepository.delete(db, follow)
        return True
    
    @staticmethod
    def check_price_notifications(
        db: Session,
        product_id: int,
        new_price: int
    ) -> List[ProductFollow]:
        """
        Vérifie quels utilisateurs doivent être notifiés d'une baisse de prix.
        Retourne la liste des suivis qui déclenchent une notification.
        Cette méthode est appelée quand le prix d'un produit change.
        """
        followers = ProductFollowRepository.get_followers_for_price_notification(db, product_id)
        
        to_notify = []
        
        for follow in followers:
            should_notify = False
            
            # Vérifier si le prix a baissé par rapport au prix initial
            if follow.initial_price and new_price < follow.initial_price:
                should_notify = True
            
            # Vérifier si le prix est en dessous du seuil défini
            if follow.price_threshold and new_price <= follow.price_threshold:
                should_notify = True
            
            if should_notify:
                to_notify.append(follow)
        
        return to_notify
    
    @staticmethod
    def notify_stock_available(db: Session, product_id: int) -> List[ProductFollow]:
        """
        Récupère les utilisateurs à notifier quand un produit revient en stock.
        Cette méthode est appelée quand le stock d'un produit passe de 0 à >0.
        """
        return ProductFollowRepository.get_followers_for_stock_notification(db, product_id)
    
    @staticmethod
    def mark_as_notified(db: Session, follow_id: int) -> Optional[ProductFollow]:
        """
        Marque qu'une notification a été envoyée pour ce suivi.
        Permet d'éviter d'envoyer trop de notifications rapprochées.
        """
        follow = ProductFollowRepository.get_by_id(db, follow_id)
        
        if not follow:
            return None
        
        follow.last_notified_at = datetime.now(timezone.utc)
        return ProductFollowRepository.update(db, follow)


class ProducerFollowService:
    """
    Service pour gérer le suivi des producteurs.
    Permet aux utilisateurs de rester informés des activités de leurs producteurs préférés.
    """
    
    @staticmethod
    def follow_producer(
        db: Session,
        user_id: int,
        follow_data: ProducerFollowCreate
    ) -> Optional[ProducerFollow]:
        """
        Commence à suivre un producteur.
        Retourne None si l'utilisateur suit déjà ce producteur.
        """
        # Vérifier si l'utilisateur suit déjà ce producteur
        existing = ProducerFollowRepository.get_by_user_and_producer(
            db, user_id, follow_data.producer_id
        )
        
        if existing:
            return None  # L'utilisateur suit déjà ce producteur
        
        # Vérifier qu'un utilisateur ne peut pas se suivre lui-même
        if user_id == follow_data.producer_id:
            return None
        
        follow = ProducerFollow(
            user_id=user_id,
            **follow_data.model_dump()
        )
        
        return ProducerFollowRepository.create(db, follow)
    
    @staticmethod
    def get_user_followed_producers(
        db: Session,
        user_id: int,
        active_only: bool = True
    ) -> List[ProducerFollow]:
        """
        Récupère tous les producteurs suivis par un utilisateur.
        Peut filtrer pour n'afficher que les suivis actifs.
        """
        return ProducerFollowRepository.get_user_follows(db, user_id, active_only, load_producers=True)
    
    @staticmethod
    def update_follow(
        db: Session,
        follow_id: int,
        follow_data: ProducerFollowUpdate
    ) -> Optional[ProducerFollow]:
        """
        Met à jour les préférences de suivi d'un producteur.
        Permet de modifier les types de notifications reçues.
        """
        follow = ProducerFollowRepository.get_by_id(db, follow_id)
        
        if not follow:
            return None
        
        update_data = follow_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(follow, field, value)
        
        return ProducerFollowRepository.update(db, follow)
    
    @staticmethod
    def unfollow_producer(db: Session, follow_id: int) -> bool:
        """
        Arrête de suivre un producteur.
        Retourne True si l'opération a réussi, False si le suivi n'existait pas.
        """
        follow = ProducerFollowRepository.get_by_id(db, follow_id)
        
        if not follow:
            return False
        
        ProducerFollowRepository.delete(db, follow)
        return True
    
    @staticmethod
    def notify_new_product(db: Session, producer_id: int) -> List[ProducerFollow]:
        """
        Récupère les utilisateurs à notifier lors d'un nouveau produit.
        Cette méthode est appelée quand un producteur ajoute un nouveau produit.
        """
        return ProducerFollowRepository.get_followers_for_new_product_notification(db, producer_id)
    
    @staticmethod
    def get_producer_followers_count(db: Session, producer_id: int) -> int:
        """
        Compte le nombre de followers d'un producteur.
        Utile pour afficher des statistiques au producteur sur sa popularité.
        """
        return ProducerFollowRepository.count_producer_followers(db, producer_id)
    
    @staticmethod
    def mark_as_notified(db: Session, follow_id: int) -> Optional[ProducerFollow]:
        """
        Marque qu'une notification a été envoyée pour ce suivi.
        Permet d'éviter d'envoyer trop de notifications rapprochées.
        """
        follow = ProducerFollowRepository.get_by_id(db, follow_id)
        
        if not follow:
            return None
        
        follow.last_notified_at = datetime.now(timezone.utc)
        return ProducerFollowRepository.update(db, follow)
    
    @staticmethod
    def get_follow_stats(db: Session, user_id: int) -> Dict[str, Any]:
        """
        Calcule des statistiques sur les suivis d'un utilisateur.
        Retourne le nombre de produits et producteurs suivis, ainsi que le nombre de notifications actives.
        """
        products_followed = ProductFollowRepository.count_user_follows(db, user_id)
        producers_followed = ProducerFollowRepository.count_user_follows(db, user_id)
        
        return {
            "products_followed": products_followed,
            "producers_followed": producers_followed,
            "active_notifications": products_followed + producers_followed
        }