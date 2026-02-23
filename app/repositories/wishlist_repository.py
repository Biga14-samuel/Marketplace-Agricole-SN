from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_

from app.models.wishlist import (
    Wishlist,
    WishlistItem,
    ProductFollow,
    ProducerFollow
)


class WishlistRepository:
    """
    Repository pour gérer les listes de souhaits.
    Regroupe toutes les requêtes liées aux wishlists.
    """
    
    @staticmethod
    def create(db: Session, wishlist: Wishlist) -> Wishlist:
        """
        Crée une nouvelle liste de souhaits dans la base de données.
        Génère automatiquement un slug si la liste est publique.
        """
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)
        return wishlist
    
    @staticmethod
    def get_by_id(db: Session, wishlist_id: int) -> Optional[Wishlist]:
        """Récupère une liste de souhaits par son ID"""
        return db.query(Wishlist).filter(Wishlist.id == wishlist_id).first()
    
    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Wishlist]:
        """
        Récupère une liste de souhaits publique par son slug.
        Utile pour partager des listes via une URL conviviale.
        """
        return db.query(Wishlist).filter(
            and_(
                Wishlist.slug == slug,
                Wishlist.is_public
            )
        ).first()
    
    @staticmethod
    def get_user_wishlists(
        db: Session,
        user_id: int,
        include_public_only: bool = False
    ) -> List[Wishlist]:
        """
        Récupère toutes les listes d'un utilisateur.
        Peut filtrer pour n'afficher que les listes publiques.
        """
        query = db.query(Wishlist).filter(Wishlist.user_id == user_id)
        
        if include_public_only:
            query = query.filter(Wishlist.is_public)
        
        return query.order_by(Wishlist.sort_order, Wishlist.created_at.desc()).all()
    
    @staticmethod
    def get_with_items(db: Session, wishlist_id: int) -> Optional[Wishlist]:
        """
        Récupère une liste de souhaits avec tous ses items.
        Utilise joinedload pour éviter le problème N+1 queries.
        """
        return db.query(Wishlist).options(
            joinedload(Wishlist.items).joinedload(WishlistItem.product)
        ).filter(Wishlist.id == wishlist_id).first()
    
    @staticmethod
    def update(db: Session, wishlist: Wishlist) -> Wishlist:
        """Met à jour une liste de souhaits existante"""
        db.commit()
        db.refresh(wishlist)
        return wishlist
    
    @staticmethod
    def delete(db: Session, wishlist: Wishlist) -> None:
        """
        Supprime une liste de souhaits.
        Grâce au cascade, tous les items seront automatiquement supprimés.
        """
        db.delete(wishlist)
        db.commit()
    
    @staticmethod
    def count_user_wishlists(db: Session, user_id: int) -> int:
        """Compte le nombre de listes d'un utilisateur"""
        return db.query(Wishlist).filter(Wishlist.user_id == user_id).count()
    
    @staticmethod
    def count_public_wishlists(db: Session, user_id: int) -> int:
        """Compte le nombre de listes publiques d'un utilisateur"""
        return db.query(Wishlist).filter(
            and_(
                Wishlist.user_id == user_id,
                Wishlist.is_public
            )
        ).count()


class WishlistItemRepository:
    """
    Repository pour gérer les items des listes de souhaits.
    Permet d'ajouter, modifier et supprimer des produits dans les listes.
    """
    
    @staticmethod
    def create(db: Session, item: WishlistItem) -> WishlistItem:
        """Ajoute un produit à une liste de souhaits"""
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    
    @staticmethod
    def create_bulk(db: Session, items: List[WishlistItem]) -> List[WishlistItem]:
        """
        Ajoute plusieurs produits à une liste en une seule transaction.
        Plus performant que d'ajouter les items un par un.
        """
        db.add_all(items)
        db.commit()
        for item in items:
            db.refresh(item)
        return items
    
    @staticmethod
    def get_by_id(db: Session, item_id: int) -> Optional[WishlistItem]:
        """Récupère un item par son ID"""
        return db.query(WishlistItem).filter(WishlistItem.id == item_id).first()
    
    @staticmethod
    def get_by_wishlist(
        db: Session,
        wishlist_id: int,
        load_products: bool = False
    ) -> List[WishlistItem]:
        """
        Récupère tous les items d'une liste de souhaits.
        Peut charger les produits associés pour éviter les requêtes supplémentaires.
        """
        query = db.query(WishlistItem).filter(WishlistItem.wishlist_id == wishlist_id)
        
        if load_products:
            query = query.options(joinedload(WishlistItem.product))
        
        return query.order_by(WishlistItem.sort_order, WishlistItem.added_at.desc()).all()
    
    @staticmethod
    def get_by_product(db: Session, product_id: int, user_id: int) -> List[WishlistItem]:
        """
        Trouve toutes les listes de souhaits d'un utilisateur contenant un produit spécifique.
        Utile pour savoir dans quelles listes un produit apparaît déjà.
        """
        return db.query(WishlistItem).join(Wishlist).filter(
            and_(
                WishlistItem.product_id == product_id,
                Wishlist.user_id == user_id
            )
        ).all()
    
    @staticmethod
    def exists_in_wishlist(db: Session, wishlist_id: int, product_id: int) -> bool:
        """
        Vérifie si un produit existe déjà dans une liste.
        Évite les doublons lors de l'ajout.
        """
        return db.query(WishlistItem).filter(
            and_(
                WishlistItem.wishlist_id == wishlist_id,
                WishlistItem.product_id == product_id
            )
        ).first() is not None
    
    @staticmethod
    def update(db: Session, item: WishlistItem) -> WishlistItem:
        """Met à jour un item de liste"""
        db.commit()
        db.refresh(item)
        return item
    
    @staticmethod
    def delete(db: Session, item: WishlistItem) -> None:
        """Supprime un item d'une liste"""
        db.delete(item)
        db.commit()
    
    @staticmethod
    def delete_by_product(db: Session, wishlist_id: int, product_id: int) -> bool:
        """
        Supprime un produit d'une liste spécifique.
        Retourne True si un item a été supprimé, False sinon.
        """
        item = db.query(WishlistItem).filter(
            and_(
                WishlistItem.wishlist_id == wishlist_id,
                WishlistItem.product_id == product_id
            )
        ).first()
        
        if item:
            db.delete(item)
            db.commit()
            return True
        return False
    
    @staticmethod
    def count_items_in_wishlist(db: Session, wishlist_id: int) -> int:
        """Compte le nombre d'items dans une liste"""
        return db.query(WishlistItem).filter(
            WishlistItem.wishlist_id == wishlist_id
        ).count()
    
    @staticmethod
    def count_total_items_for_user(db: Session, user_id: int) -> int:
        """Compte le nombre total d'items dans toutes les listes d'un utilisateur"""
        return db.query(WishlistItem).join(Wishlist).filter(
            Wishlist.user_id == user_id
        ).count()


class ProductFollowRepository:
    """
    Repository pour gérer le suivi des produits.
    Permet aux utilisateurs de surveiller des produits pour recevoir des notifications.
    """
    
    @staticmethod
    def create(db: Session, follow: ProductFollow) -> ProductFollow:
        """Commence à suivre un produit"""
        db.add(follow)
        db.commit()
        db.refresh(follow)
        return follow
    
    @staticmethod
    def get_by_id(db: Session, follow_id: int) -> Optional[ProductFollow]:
        """Récupère un suivi par son ID"""
        return db.query(ProductFollow).filter(ProductFollow.id == follow_id).first()
    
    @staticmethod
    def get_by_user_and_product(
        db: Session,
        user_id: int,
        product_id: int
    ) -> Optional[ProductFollow]:
        """
        Vérifie si un utilisateur suit déjà un produit spécifique.
        Utile avant de créer un nouveau suivi.
        """
        return db.query(ProductFollow).filter(
            and_(
                ProductFollow.user_id == user_id,
                ProductFollow.product_id == product_id
            )
        ).first()
    
    @staticmethod
    def get_user_follows(
        db: Session,
        user_id: int,
        active_only: bool = True,
        load_products: bool = False
    ) -> List[ProductFollow]:
        """
        Récupère tous les produits suivis par un utilisateur.
        Peut filtrer pour n'afficher que les suivis actifs.
        """
        query = db.query(ProductFollow).filter(ProductFollow.user_id == user_id)
        
        if active_only:
            query = query.filter(ProductFollow.is_active)
        
        if load_products:
            query = query.options(joinedload(ProductFollow.product))
        
        return query.order_by(ProductFollow.created_at.desc()).all()
    
    @staticmethod
    def get_product_followers(db: Session, product_id: int) -> List[ProductFollow]:
        """
        Récupère tous les utilisateurs qui suivent un produit donné.
        Utile pour envoyer des notifications de masse quand le produit change.
        """
        return db.query(ProductFollow).filter(
            and_(
                ProductFollow.product_id == product_id,
                ProductFollow.is_active
            )
        ).all()
    
    @staticmethod
    def get_followers_for_stock_notification(db: Session, product_id: int) -> List[ProductFollow]:
        """
        Récupère les utilisateurs à notifier quand un produit revient en stock.
        Filtre pour ne récupérer que ceux qui ont activé cette notification.
        """
        return db.query(ProductFollow).filter(
            and_(
                ProductFollow.product_id == product_id,
                ProductFollow.is_active,
                ProductFollow.notify_on_stock
            )
        ).all()
    
    @staticmethod
    def get_followers_for_price_notification(db: Session, product_id: int) -> List[ProductFollow]:
        """
        Récupère les utilisateurs à notifier en cas de baisse de prix.
        Filtre pour ne récupérer que ceux qui ont activé cette notification.
        """
        return db.query(ProductFollow).filter(
            and_(
                ProductFollow.product_id == product_id,
                ProductFollow.is_active,
                ProductFollow.notify_on_price_drop
            )
        ).all()
    
    @staticmethod
    def update(db: Session, follow: ProductFollow) -> ProductFollow:
        """Met à jour un suivi de produit"""
        db.commit()
        db.refresh(follow)
        return follow
    
    @staticmethod
    def delete(db: Session, follow: ProductFollow) -> None:
        """Arrête de suivre un produit"""
        db.delete(follow)
        db.commit()
    
    @staticmethod
    def count_user_follows(db: Session, user_id: int) -> int:
        """Compte le nombre de produits suivis par un utilisateur"""
        return db.query(ProductFollow).filter(
            and_(
                ProductFollow.user_id == user_id,
                ProductFollow.is_active
            )
        ).count()


class ProducerFollowRepository:
    """
    Repository pour gérer le suivi des producteurs.
    Permet aux utilisateurs de suivre leurs producteurs préférés.
    """
    
    @staticmethod
    def create(db: Session, follow: ProducerFollow) -> ProducerFollow:
        """Commence à suivre un producteur"""
        db.add(follow)
        db.commit()
        db.refresh(follow)
        return follow
    
    @staticmethod
    def get_by_id(db: Session, follow_id: int) -> Optional[ProducerFollow]:
        """Récupère un suivi par son ID"""
        return db.query(ProducerFollow).filter(ProducerFollow.id == follow_id).first()
    
    @staticmethod
    def get_by_user_and_producer(
        db: Session,
        user_id: int,
        producer_id: int
    ) -> Optional[ProducerFollow]:
        """
        Vérifie si un utilisateur suit déjà un producteur spécifique.
        Utile avant de créer un nouveau suivi.
        """
        return db.query(ProducerFollow).filter(
            and_(
                ProducerFollow.user_id == user_id,
                ProducerFollow.producer_id == producer_id
            )
        ).first()
    
    @staticmethod
    def get_user_follows(
        db: Session,
        user_id: int,
        active_only: bool = True,
        load_producers: bool = False
    ) -> List[ProducerFollow]:
        """
        Récupère tous les producteurs suivis par un utilisateur.
        Peut filtrer pour n'afficher que les suivis actifs.
        """
        query = db.query(ProducerFollow).filter(ProducerFollow.user_id == user_id)
        
        if active_only:
            query = query.filter(ProducerFollow.is_active)
        
        if load_producers:
            query = query.options(joinedload(ProducerFollow.producer))
        
        return query.order_by(ProducerFollow.created_at.desc()).all()
    
    @staticmethod
    def get_producer_followers(db: Session, producer_id: int) -> List[ProducerFollow]:
        """
        Récupère tous les utilisateurs qui suivent un producteur donné.
        Utile pour envoyer des notifications de masse.
        """
        return db.query(ProducerFollow).filter(
            and_(
                ProducerFollow.producer_id == producer_id,
                ProducerFollow.is_active
            )
        ).all()
    
    @staticmethod
    def get_followers_for_new_product_notification(
        db: Session,
        producer_id: int
    ) -> List[ProducerFollow]:
        """
        Récupère les utilisateurs à notifier lors d'un nouveau produit.
        Filtre pour ne récupérer que ceux qui ont activé cette notification.
        """
        return db.query(ProducerFollow).filter(
            and_(
                ProducerFollow.producer_id == producer_id,
                ProducerFollow.is_active,
                ProducerFollow.notify_on_new_product
            )
        ).all()
    
    @staticmethod
    def update(db: Session, follow: ProducerFollow) -> ProducerFollow:
        """Met à jour un suivi de producteur"""
        db.commit()
        db.refresh(follow)
        return follow
    
    @staticmethod
    def delete(db: Session, follow: ProducerFollow) -> None:
        """Arrête de suivre un producteur"""
        db.delete(follow)
        db.commit()
    
    @staticmethod
    def count_user_follows(db: Session, user_id: int) -> int:
        """Compte le nombre de producteurs suivis par un utilisateur"""
        return db.query(ProducerFollow).filter(
            and_(
                ProducerFollow.user_id == user_id,
                ProducerFollow.is_active
            )
        ).count()
    
    @staticmethod
    def count_producer_followers(db: Session, producer_id: int) -> int:
        """
        Compte le nombre de followers d'un producteur.
        Utile pour afficher des statistiques au producteur.
        """
        return db.query(ProducerFollow).filter(
            and_(
                ProducerFollow.producer_id == producer_id,
                ProducerFollow.is_active
            )
        ).count()