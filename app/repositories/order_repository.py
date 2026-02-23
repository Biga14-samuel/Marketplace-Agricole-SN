from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import Optional, List
from datetime import datetime

from app.models.orders import (
    Cart, CartItem, Order, OrderItem, OrderStatusHistory, OrderTracking
)


# ============= Cart Repository =============

class CartRepository:
    """Repository pour les paniers"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Cart:
        """Crée un nouveau panier"""
        cart = Cart(**kwargs)
        self.db.add(cart)
        self.db.commit()
        self.db.refresh(cart)
        return cart
    
    def get_by_id(self, cart_id: int) -> Optional[Cart]:
        """Récupère un panier par son ID"""
        return self.db.query(Cart).filter(Cart.id == cart_id).first()
    
    def get_by_user_id(self, user_id: int) -> Optional[Cart]:
        """Récupère le panier actif d'un utilisateur"""
        return self.db.query(Cart).filter(
            Cart.user_id == user_id,
            Cart.expires_at > datetime.now()
        ).first()
    
    def get_by_session_id(self, session_id: str) -> Optional[Cart]:
        """Récupère le panier d'une session anonyme"""
        return self.db.query(Cart).filter(
            Cart.session_id == session_id,
            Cart.expires_at > datetime.now()
        ).first()
    
    def get_with_items(self, cart_id: int) -> Optional[Cart]:
        """Récupère un panier avec tous ses articles"""
        return self.db.query(Cart).options(
            joinedload(Cart.items).joinedload(CartItem.product),
            joinedload(Cart.items).joinedload(CartItem.variant)
        ).filter(Cart.id == cart_id).first()
    
    def merge_carts(self, source_cart: Cart, target_cart: Cart) -> Cart:
        """
        Fusionne deux paniers (utilisé quand un utilisateur se connecte).
        Utilise flush() car c'est une opération intermédiaire.
        """
        for item in source_cart.items:
            # Vérifier si le produit existe déjà dans le panier cible
            existing_item = next(
                (i for i in target_cart.items 
                 if i.product_id == item.product_id and i.variant_id == item.variant_id),
                None
            )
            if existing_item:
                # Augmenter la quantité
                existing_item.quantity += item.quantity
                existing_item.subtotal = existing_item.quantity * existing_item.unit_price
            else:
                # Ajouter le nouvel article
                item.cart_id = target_cart.id
        
        # Utiliser flush() car c'est une opération intermédiaire
        self.db.flush()
        return target_cart
    
    def delete_expired_carts(self) -> int:
        """Supprime les paniers expirés"""
        count = self.db.query(Cart).filter(
            Cart.expires_at < datetime.now()
        ).delete()
        self.db.commit()
        return count
    
    def update(self, cart: Cart) -> Cart:
        """
        Met à jour un panier.
        Utilise commit() car c'est une opération finale.
        """
        self.db.commit()
        self.db.refresh(cart)
        return cart
    
    def delete(self, cart: Cart) -> bool:
        """Supprime un panier"""
        self.db.delete(cart)
        self.db.commit()
        return True


# ============= Cart Item Repository =============

class CartItemRepository:
    """Repository pour les articles du panier"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, cart_id: int, **kwargs) -> CartItem:
        """
        Crée un nouvel article dans le panier.
        Utilise flush() car généralement suivi d'autres opérations.
        """
        item = CartItem(cart_id=cart_id, **kwargs)
        self.db.add(item)
        # Utiliser flush() au lieu de commit() pour garder la transaction ouverte
        self.db.flush()
        self.db.refresh(item)
        return item
    
    def get_by_id(self, item_id: int) -> Optional[CartItem]:
        """Récupère un article par son ID"""
        return self.db.query(CartItem).filter(CartItem.id == item_id).first()
    
    def get_cart_item(
        self, 
        cart_id: int, 
        product_id: int, 
        variant_id: Optional[int] = None
    ) -> Optional[CartItem]:
        """Récupère un article spécifique dans un panier"""
        query = self.db.query(CartItem).filter(
            CartItem.cart_id == cart_id,
            CartItem.product_id == product_id
        )
        if variant_id is not None:
            query = query.filter(CartItem.variant_id == variant_id)
        else:
            query = query.filter(CartItem.variant_id.is_(None))
        return query.first()
    
    def update(self, item: CartItem) -> CartItem:
        """
        Met à jour un article.
        Utilise flush() car généralement dans une transaction plus large.
        """
        self.db.flush()
        self.db.refresh(item)
        return item
    
    def delete(self, item: CartItem) -> bool:
        """
        Supprime un article.
        Utilise flush() pour permettre d'autres opérations dans la même transaction.
        """
        self.db.delete(item)
        self.db.flush()
        return True
    
    def clear_cart(self, cart_id: int) -> int:
        """Vide tous les articles d'un panier"""
        count = self.db.query(CartItem).filter(
            CartItem.cart_id == cart_id
        ).delete()
        self.db.flush()
        return count


# ============= Order Repository =============

class OrderRepository:
    """Repository pour les commandes"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Order:
        """
        Crée une nouvelle commande.
        Utilise flush() car suivi de la création d'OrderItems et d'historique.
        """
        order = Order(**kwargs)
        self.db.add(order)
        # Utiliser flush() pour obtenir l'ID sans valider la transaction
        self.db.flush()
        self.db.refresh(order)
        return order
    
    def get_by_id(self, order_id: int) -> Optional[Order]:
        """Récupère une commande par son ID"""
        return self.db.query(Order).filter(Order.id == order_id).first()
    
    def get_by_order_number(self, order_number: str) -> Optional[Order]:
        """Récupère une commande par son numéro"""
        return self.db.query(Order).filter(Order.order_number == order_number).first()
    
    def get_complete(self, order_id: int) -> Optional[Order]:
        """Récupère une commande avec tous ses détails"""
        return self.db.query(Order).options(
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.items).joinedload(OrderItem.variant),
            joinedload(Order.status_history),
            joinedload(Order.tracking)
        ).filter(Order.id == order_id).first()
    
    def get_user_orders(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None
    ) -> List[Order]:
        """Récupère les commandes d'un utilisateur"""
        query = self.db.query(Order).filter(Order.user_id == user_id)
        if status:
            query = query.filter(Order.status == status)
        return query.order_by(desc(Order.created_at)).offset(skip).limit(limit).all()
    
    def get_producer_orders(
        self,
        producer_id: int,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None
    ) -> List[Order]:
        """Récupère les commandes d'un producteur"""
        query = self.db.query(Order).filter(Order.producer_id == producer_id)
        if status:
            query = query.filter(Order.status == status)
        return query.order_by(desc(Order.created_at)).offset(skip).limit(limit).all()
    
    def generate_order_number(self) -> str:
        """Génère un numéro de commande unique"""
        # Format: CMD-YYYY-NNNNNN
        current_year = datetime.now().year
        
        # Récupérer le dernier numéro de l'année
        last_order = self.db.query(Order).filter(
            Order.order_number.like(f"CMD-{current_year}-%")
        ).order_by(desc(Order.id)).first()
        
        if last_order:
            # Extraire le numéro et l'incrémenter
            last_number = int(last_order.order_number.split('-')[-1])
            new_number = last_number + 1
        else:
            # Premier numéro de l'année
            new_number = 1
        
        return f"CMD-{current_year}-{new_number:06d}"
    
    def update(self, order: Order) -> Order:
        """
        Met à jour une commande.
        Utilise commit() car c'est généralement une opération finale.
        """
        self.db.commit()
        self.db.refresh(order)
        return order
    
    def delete(self, order: Order) -> bool:
        """Supprime une commande"""
        self.db.delete(order)
        self.db.commit()
        return True


# ============= Order Item Repository =============

class OrderItemRepository:
    """Repository pour les articles de commande"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, order_id: int, **kwargs) -> OrderItem:
        """
        Crée un nouvel article de commande.
        Utilise flush() car fait partie de la création d'une commande.
        """
        item = OrderItem(order_id=order_id, **kwargs)
        self.db.add(item)
        # Utiliser flush() pour rester dans la même transaction
        self.db.flush()
        self.db.refresh(item)
        return item
    
    def get_order_items(self, order_id: int) -> List[OrderItem]:
        """Récupère tous les articles d'une commande"""
        return self.db.query(OrderItem).filter(
            OrderItem.order_id == order_id
        ).all()
    
    def create_from_cart(self, order_id: int, cart_items: List[CartItem]) -> List[OrderItem]:
        """
        Crée les OrderItems à partir des CartItems.
        Utilise flush() car fait partie d'une transaction de création de commande.
        """
        order_items = []
        for cart_item in cart_items:
            # Créer le snapshot du produit
            product_snapshot = {
                "name": cart_item.product.name,
                "description": cart_item.product.description,
                "price": float(cart_item.unit_price),
                "unit": cart_item.product.unit.name if cart_item.product.unit else None,
                "variant_name": cart_item.variant.name if cart_item.variant else None
            }
            
            order_item = OrderItem(
                order_id=order_id,
                product_id=cart_item.product_id,
                variant_id=cart_item.variant_id,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                subtotal=cart_item.subtotal,
                product_snapshot=product_snapshot
            )
            self.db.add(order_item)
            order_items.append(order_item)
        
        # Utiliser flush() pour rester dans la transaction
        self.db.flush()
        return order_items


# ============= Order Status History Repository =============

class OrderStatusHistoryRepository:
    """Repository pour l'historique des statuts"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> OrderStatusHistory:
        """
        Crée une entrée d'historique.
        Utilise flush() car fait partie du changement de statut.
        """
        history = OrderStatusHistory(**kwargs)
        self.db.add(history)
        # Utiliser flush() pour rester dans la transaction
        self.db.flush()
        self.db.refresh(history)
        return history
    
    def get_order_history(self, order_id: int) -> List[OrderStatusHistory]:
        """Récupère l'historique complet d'une commande"""
        return self.db.query(OrderStatusHistory).filter(
            OrderStatusHistory.order_id == order_id
        ).order_by(OrderStatusHistory.changed_at).all()


# ============= Order Tracking Repository =============

class OrderTrackingRepository:
    """Repository pour le suivi de livraison"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, order_id: int, **kwargs) -> OrderTracking:
        """Crée une entrée de suivi"""
        tracking = OrderTracking(order_id=order_id, **kwargs)
        self.db.add(tracking)
        self.db.flush()
        self.db.refresh(tracking)
        return tracking
    
    def get_order_tracking(self, order_id: int) -> List[OrderTracking]:
        """Récupère tout le suivi d'une commande"""
        return self.db.query(OrderTracking).filter(
            OrderTracking.order_id == order_id
        ).order_by(OrderTracking.timestamp).all()