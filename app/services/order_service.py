from sqlalchemy.orm import Session
from typing import Optional, List, Tuple
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from decimal import Decimal

from app.repositories.order_repository import (
    CartRepository, CartItemRepository, OrderRepository,
    OrderItemRepository, OrderStatusHistoryRepository, OrderTrackingRepository
)
from app.repositories.product_repository import ProductRepository, ProductVariantRepository
from app.repositories.profile_repository import AddressRepository, PickupPointRepository
from app.models.orders import Cart, CartItem, Order, OrderTracking
from app.schemas.order_schema import (
    CartItemCreate, CartItemUpdate, CheckoutRequest,
    OrderStatusHistoryCreate, OrderTrackingCreate
)


# ============= Cart Service =============

class CartService:
    """Service pour la gestion des paniers"""
    
    def __init__(self, db: Session):
        self.db = db
        self.cart_repo = CartRepository(db)
        self.cart_item_repo = CartItemRepository(db)
        self.product_repo = ProductRepository(db)
        self.variant_repo = ProductVariantRepository(db)
    
    def get_or_create_cart(
        self, 
        user_id: Optional[int] = None, 
        session_id: Optional[str] = None
    ) -> Cart:
        """
        Récupère ou crée un panier pour un utilisateur ou une session.
        Si l'utilisateur se connecte avec un panier de session, fusionne les deux.
        """
        # Chercher le panier utilisateur si connecté
        user_cart = None
        if user_id:
            user_cart = self.cart_repo.get_by_user_id(user_id)
        
        # Chercher le panier de session
        session_cart = None
        if session_id:
            session_cart = self.cart_repo.get_by_session_id(session_id)
        
        # Si les deux existent, fusionner
        if user_cart and session_cart:
            user_cart = self.cart_repo.merge_carts(session_cart, user_cart)
            self.cart_repo.delete(session_cart)
            # Commit final après toutes les opérations
            self.db.commit()
            return user_cart
        
        # Si seulement le panier utilisateur existe
        if user_cart:
            return user_cart
        
        # Si seulement le panier de session existe et l'utilisateur se connecte
        if session_cart and user_id:
            session_cart.user_id = user_id
            session_cart.session_id = None
            return self.cart_repo.update(session_cart)
        
        # Si le panier de session existe
        if session_cart:
            return session_cart
        
        # Créer un nouveau panier
        expires_at = datetime.now() + timedelta(days=7)
        return self.cart_repo.create(
            user_id=user_id,
            session_id=session_id if not user_id else None,
            expires_at=expires_at
        )
    
    def add_item(
        self, 
        user_id: Optional[int],
        session_id: Optional[str],
        item_data: CartItemCreate
    ) -> CartItem:
        """Ajoute un article au panier"""
        # Récupérer ou créer le panier
        cart = self.get_or_create_cart(user_id, session_id)
        
        # Vérifier que le produit existe et est actif
        product = self.product_repo.get_by_id(item_data.product_id)
        if not product or not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produit non trouvé ou inactif"
            )
        
        # Déterminer le prix unitaire
        unit_price = product.price
        
        # Si une variante est spécifiée, vérifier et ajuster le prix
        if item_data.variant_id:
            variant = self.variant_repo.get_by_id(item_data.variant_id)
            if not variant or variant.product_id != product.id or not variant.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Variante invalide"
                )
            unit_price = product.price + variant.price_modifier
        
        # Vérifier le stock disponible
        available_stock = product.stock_quantity
        if item_data.variant_id and variant:
            available_stock = variant.stock
        
        if available_stock < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuffisant. Disponible: {available_stock}"
            )
        
        # Vérifier si l'article existe déjà dans le panier
        existing_item = self.cart_item_repo.get_cart_item(
            cart.id,
            item_data.product_id,
            item_data.variant_id
        )
        
        if existing_item:
            # Mettre à jour la quantité
            new_quantity = existing_item.quantity + item_data.quantity
            if available_stock < new_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuffisant. Disponible: {available_stock}"
                )
            existing_item.quantity = new_quantity
            existing_item.subtotal = existing_item.quantity * existing_item.unit_price
            # Commit final
            self.db.commit()
            self.db.refresh(existing_item)
            return existing_item
        
        # Créer un nouvel article
        subtotal = unit_price * item_data.quantity
        new_item = self.cart_item_repo.create(
            cart_id=cart.id,
            product_id=item_data.product_id,
            variant_id=item_data.variant_id,
            quantity=item_data.quantity,
            unit_price=unit_price,
            subtotal=subtotal
        )
        
        # Mettre à jour la date de modification du panier
        cart.updated_at = datetime.now()
        
        # Commit final après toutes les opérations
        self.db.commit()
        self.db.refresh(new_item)
        return new_item
    
    def update_item(
        self,
        user_id: Optional[int],
        session_id: Optional[str],
        item_id: int,
        item_data: CartItemUpdate
    ) -> CartItem:
        """Met à jour la quantité d'un article du panier"""
        # Récupérer le panier
        cart = self.get_or_create_cart(user_id, session_id)
        
        # Récupérer l'article
        item = self.cart_item_repo.get_by_id(item_id)
        if not item or item.cart_id != cart.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article non trouvé dans le panier"
            )
        
        # Vérifier le stock
        product = self.product_repo.get_by_id(item.product_id)
        available_stock = product.stock_quantity
        if item.variant_id:
            variant = self.variant_repo.get_by_id(item.variant_id)
            available_stock = variant.stock if variant else 0
        
        if available_stock < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuffisant. Disponible: {available_stock}"
            )
        
        # Mettre à jour
        item.quantity = item_data.quantity
        item.subtotal = item.quantity * item.unit_price
        cart.updated_at = datetime.now()
        
        # Commit final
        self.db.commit()
        self.db.refresh(item)
        return item
    
    def remove_item(
        self,
        user_id: Optional[int],
        session_id: Optional[str],
        item_id: int
    ) -> bool:
        """Retire un article du panier"""
        cart = self.get_or_create_cart(user_id, session_id)
        item = self.cart_item_repo.get_by_id(item_id)
        
        if not item or item.cart_id != cart.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article non trouvé dans le panier"
            )
        
        self.cart_item_repo.delete(item)
        cart.updated_at = datetime.now()
        
        # Commit final
        self.db.commit()
        return True
    
    def get_cart(
        self,
        user_id: Optional[int],
        session_id: Optional[str]
    ) -> Cart:
        """Récupère le panier avec tous ses articles"""
        cart = self.get_or_create_cart(user_id, session_id)
        cart_with_items = self.cart_repo.get_with_items(cart.id)
        # Si get_with_items retourne None (ne devrait pas arriver), retourner le panier de base
        return cart_with_items if cart_with_items else cart
    
    def clear_cart(
        self,
        user_id: Optional[int],
        session_id: Optional[str]
    ) -> bool:
        """Vide complètement le panier"""
        cart = self.get_or_create_cart(user_id, session_id)
        self.cart_item_repo.clear_cart(cart.id)
        cart.updated_at = datetime.now()
        
        # Commit final
        self.db.commit()
        return True
    
    def calculate_cart_total(self, cart: Cart) -> Tuple[Decimal, int]:
        """
        Calcule le total du panier et le nombre d'articles.
        Retourne (total, items_count)
        """
        total = Decimal("0.00")
        items_count = 0
        
        for item in cart.items:
            total += item.subtotal
            items_count += item.quantity
        
        return total, items_count


# ============= Order Service =============

class OrderService:
    """Service pour la gestion des commandes"""
    
    def __init__(self, db: Session):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.order_item_repo = OrderItemRepository(db)
        self.status_history_repo = OrderStatusHistoryRepository(db)
        self.tracking_repo = OrderTrackingRepository(db)
        self.cart_service = CartService(db)
        self.cart_repo = CartRepository(db)
        self.product_repo = ProductRepository(db)
        self.address_repo = AddressRepository(db)
        self.pickup_point_repo = PickupPointRepository(db)
    
    def create_order_from_cart(
        self,
        user_id: int,
        checkout_request: CheckoutRequest
    ) -> Order:
        """
        Crée une commande à partir du panier.
        C'est une transaction complexe qui doit être atomique.
        """
        # Récupérer le panier
        cart = self.cart_service.get_cart(user_id, None)
        
        if not cart.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le panier est vide"
            )
        
        # Vérifier que tous les produits sont du même producteur
        producer_ids = {item.product.producer_id for item in cart.items}
        if len(producer_ids) > 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tous les produits doivent provenir du même producteur"
            )
        
        producer_id = producer_ids.pop()
        
        # Vérifier les stocks
        for item in cart.items:
            product = item.product
            available_stock = product.stock_quantity
            
            if item.variant_id:
                variant = item.variant
                available_stock = variant.stock if variant else 0
            
            if available_stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuffisant pour {product.name}. Disponible: {available_stock}"
                )
        
        # Valider les informations de livraison
        if checkout_request.delivery_type == "pickup":
            if not checkout_request.pickup_point_id or not checkout_request.pickup_slot_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Point de retrait et créneau requis pour un retrait"
                )
        else:
            if not checkout_request.delivery_address_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Adresse de livraison requise"
                )
            # Vérifier que l'adresse appartient à l'utilisateur
            address = self.address_repo.get_by_id(checkout_request.delivery_address_id)
            if not address or address.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Adresse invalide"
                )
        
        # Calculer les montants
        subtotal = sum(item.subtotal for item in cart.items)
        tax_amount = subtotal * Decimal("0.055")  # TVA 5.5%
        delivery_fee = Decimal("0.00") if checkout_request.delivery_type == "pickup" else Decimal("5.00")
        discount_amount = Decimal("0.00")  # TODO: Implémenter les codes promo
        total_amount = subtotal + tax_amount + delivery_fee - discount_amount
        
        # Générer le numéro de commande
        order_number = self.order_repo.generate_order_number()
        
        # Créer la commande (utilise flush() dans le repository)
        order = self.order_repo.create(
            user_id=user_id,
            producer_id=producer_id,
            order_number=order_number,
            status="pending",
            payment_status="pending",
            subtotal=subtotal,
            tax_amount=tax_amount,
            delivery_fee=delivery_fee,
            discount_amount=discount_amount,
            total_amount=total_amount,
            delivery_type=checkout_request.delivery_type,
            pickup_point_id=checkout_request.pickup_point_id,
            pickup_slot_id=checkout_request.pickup_slot_id,
            delivery_address_id=checkout_request.delivery_address_id,
            notes=checkout_request.notes
        )
        
        # Créer les OrderItems à partir des CartItems (utilise flush())
        self.order_item_repo.create_from_cart(order.id, cart.items)
        
        # Créer l'entrée d'historique initiale (utilise flush())
        self.status_history_repo.create(
            order_id=order.id,
            old_status=None,
            new_status="pending",
            comment="Commande créée",
            changed_by=user_id
        )
        
        # Mettre à jour les stocks des produits
        for item in cart.items:
            product = item.product
            if item.variant_id:
                variant = item.variant
                variant.stock -= item.quantity
            else:
                product.stock_quantity -= item.quantity
        
        # Vider le panier (utilise flush())
        self.cart_repo.delete(cart)
        
        # COMMIT FINAL - toutes les opérations réussissent ou échouent ensemble
        self.db.commit()
        self.db.refresh(order)
        
        return order
    
    def get_order(self, order_id: int, user_id: int) -> Order:
        """Récupère une commande avec vérification des droits"""
        order = self.order_repo.get_complete(order_id)
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
        # Vérifier que l'utilisateur a le droit de voir cette commande
        if order.user_id != user_id and order.producer_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès refusé à cette commande"
            )
        
        return order
    
    def get_my_orders(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        status_filter: Optional[str] = None
    ) -> List[Order]:
        """Récupère les commandes d'un client"""
        return self.order_repo.get_user_orders(user_id, skip, limit, status_filter)
    
    def get_producer_orders(
        self,
        producer_id: int,
        skip: int = 0,
        limit: int = 100,
        status_filter: Optional[str] = None
    ) -> List[Order]:
        """Récupère les commandes reçues par un producteur"""
        return self.order_repo.get_producer_orders(producer_id, skip, limit, status_filter)
    
    def update_order_status(
        self,
        order_id: int,
        user_id: int,
        status_change: OrderStatusHistoryCreate
    ) -> Order:
        """Change le statut d'une commande avec historique"""
        order = self.order_repo.get_by_id(order_id)
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
        # Vérifier les droits (seul le producteur ou l'admin peut changer le statut)
        if order.producer_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas le droit de modifier cette commande"
            )
        
        # Sauvegarder l'ancien statut
        old_status = order.status
        
        # Mettre à jour le statut (utilise flush())
        order.status = status_change.new_status
        self.db.flush()
        
        # Créer l'entrée d'historique (utilise flush())
        self.status_history_repo.create(
            order_id=order.id,
            old_status=old_status,
            new_status=status_change.new_status,
            comment=status_change.comment,
            changed_by=user_id
        )
        
        # Commit final
        self.db.commit()
        self.db.refresh(order)
        
        return order
    
    def add_tracking(
        self,
        order_id: int,
        user_id: int,
        tracking_data: OrderTrackingCreate
    ) -> OrderTracking:
        """Ajoute une entrée de suivi pour une livraison"""
        order = self.order_repo.get_by_id(order_id)
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
        # Seul le producteur peut ajouter du tracking
        if order.producer_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès refusé"
            )
        
        # 1. Création de l'enregistrement
        new_tracking = self.tracking_repo.create(
            order_id=order.id,
            **tracking_data.model_dump()
        )
        
        # 2. VALIDATION (Indispensable pour enregistrer en base)
        self.db.commit()
        
        # 3. Rafraîchissement pour récupérer les IDs générés par la DB
        self.db.refresh(new_tracking)
        
        return new_tracking
    
    def cancel_order(
        self,
        order_id: int,
        user_id: int,
        reason: str
    ) -> Order:
        """Annule une commande et restaure les stocks"""
        order = self.order_repo.get_complete(order_id)
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
        # Vérifier que l'utilisateur peut annuler
        if order.user_id != user_id and order.producer_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas annuler cette commande"
            )
        
        # Vérifier que la commande peut être annulée
        if order.status in ["completed", "cancelled"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cette commande ne peut plus être annulée"
            )
        
        # Sauvegarder l'ancien statut
        old_status = order.status
        
        # Mettre à jour le statut
        order.status = "cancelled"
        self.db.flush()
        
        # Créer l'entrée d'historique
        self.status_history_repo.create(
            order_id=order.id,
            old_status=old_status,
            new_status="cancelled",
            comment=f"Annulation: {reason}",
            changed_by=user_id
        )
        
        # Restaurer les stocks
        for item in order.items:
            if item.product:
                if item.variant_id and item.variant:
                    item.variant.stock += item.quantity
                else:
                    item.product.stock_quantity += item.quantity
        
        # Commit final
        self.db.commit()
        self.db.refresh(order)
        
        return order