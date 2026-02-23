from fastapi import APIRouter, Depends, status, Cookie, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.core.deps import get_current_user, get_current_user_optional
from app.services.order_service import CartService, OrderService
from app.schemas.order_schema import (
    CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse,
    CheckoutRequest, OrderResponse, OrderItemResponse,
    UpdateOrderStatusRequest, CancelOrderRequest, OrderListResponse,
    OrderTrackingCreate, OrderTrackingResponse, OrderStatusHistoryResponse,
    MessageResponse, OrderFilter, ProducerOrderFilter
)

router = APIRouter(tags=["Orders & Cart"])


# ============= Dependencies =============

def get_cart_service(db: Session = Depends(get_db)) -> CartService:
    return CartService(db)


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(db)


def get_session_id(session_id: Optional[str] = Cookie(None)) -> str:
    """Récupère ou crée un ID de session pour les utilisateurs non connectés"""
    if not session_id:
        return str(uuid.uuid4())
    return session_id


# ============= Cart Endpoints =============

@router.post(
    "/cart/items",
    response_model=CartItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter un article au panier"
)
def add_to_cart(
    item_data: CartItemCreate,
    session_id: str = Depends(get_session_id),
    current_user = Depends(get_current_user_optional),
    cart_service: CartService = Depends(get_cart_service)
):
    """
    Ajoute un article au panier.
    
    Fonctionne pour les utilisateurs connectés et non connectés.
    Si l'utilisateur se connecte après avoir ajouté des articles,
    son panier de session sera fusionné avec son panier utilisateur.
    
    Vérifie automatiquement :
    - Que le produit existe et est actif
    - Que le stock est suffisant
    - Que la variante est valide si spécifiée
    """
    user_id = current_user.id if current_user else None
    item = cart_service.add_item(user_id, session_id, item_data)
    return CartItemResponse.model_validate(item)


@router.get(
    "/cart",
    response_model=CartResponse,
    summary="Voir mon panier"
)
def get_cart(
    session_id: str = Depends(get_session_id),
    current_user = Depends(get_current_user_optional),
    cart_service: CartService = Depends(get_cart_service)
):
    """
    Récupère le panier actuel avec tous ses articles.
    
    Fonctionne pour les utilisateurs connectés et non connectés.
    Le total et le nombre d'articles sont calculés automatiquement.
    """
    user_id = current_user.id if current_user else None
    cart = cart_service.get_cart(user_id, session_id)
    
    # Calculer le total et le nombre d'articles
    total, items_count = cart_service.calculate_cart_total(cart)
    
    # Construire la réponse
    response = CartResponse.model_validate(cart)
    response.total = total
    response.items_count = items_count
    
    return response


@router.put(
    "/cart/items/{item_id}",
    response_model=CartItemResponse,
    summary="Mettre à jour un article du panier"
)
def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    session_id: str = Depends(get_session_id),
    current_user = Depends(get_current_user_optional),
    cart_service: CartService = Depends(get_cart_service)
):
    """
    Met à jour la quantité d'un article dans le panier.
    
    Vérifie que le stock est suffisant pour la nouvelle quantité.
    """
    user_id = current_user.id if current_user else None
    item = cart_service.update_item(user_id, session_id, item_id, item_data)
    return CartItemResponse.model_validate(item)


@router.delete(
    "/cart/items/{item_id}",
    response_model=MessageResponse,
    summary="Retirer un article du panier"
)
def remove_from_cart(
    item_id: int,
    session_id: str = Depends(get_session_id),
    current_user = Depends(get_current_user_optional),
    cart_service: CartService = Depends(get_cart_service)
):
    """Retire un article spécifique du panier."""
    user_id = current_user.id if current_user else None
    cart_service.remove_item(user_id, session_id, item_id)
    return MessageResponse(message="Article retiré du panier")


@router.delete(
    "/cart",
    response_model=MessageResponse,
    summary="Vider le panier"
)
def clear_cart(
    session_id: str = Depends(get_session_id),
    current_user = Depends(get_current_user_optional),
    cart_service: CartService = Depends(get_cart_service)
):
    """Vide complètement le panier."""
    user_id = current_user.id if current_user else None
    cart_service.clear_cart(user_id, session_id)
    return MessageResponse(message="Panier vidé")


# ============= Checkout Endpoint =============

@router.post(
    "/checkout",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Finaliser la commande"
)
def checkout(
    checkout_request: CheckoutRequest,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Transforme le panier en commande finalisée.
    
    **Requiert une authentification.**
    
    Cette opération est atomique - soit tout réussit, soit tout échoue :
    - Vérifie tous les stocks
    - Crée la commande
    - Crée les articles de commande avec snapshots
    - Met à jour les stocks
    - Vide le panier
    - Crée l'historique initial
    
    Paramètres requis selon le type de livraison :
    - **pickup** : pickup_point_id et pickup_slot_id requis
    - **delivery** : delivery_address_id requis
    """
    order = order_service.create_order_from_cart(
        current_user.id,
        checkout_request
    )
    
    return OrderResponse.model_validate(order)


# ============= Order Management Endpoints =============

@router.get(
    "/my-orders",
    response_model=OrderListResponse,
    summary="Mes commandes"
)
def get_my_orders(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Récupère toutes les commandes passées par l'utilisateur connecté.
    
    Peut être filtré par statut :
    - pending : En attente de confirmation
    - confirmed : Confirmée
    - preparing : En préparation
    - ready : Prête pour retrait/livraison
    - completed : Terminée
    - cancelled : Annulée
    """
    orders = order_service.get_my_orders(
        current_user.id,
        skip,
        limit,
        status_filter
    )
    total = len(orders)  # TODO: Implement proper count
    
    return OrderListResponse(
        orders=[OrderResponse.model_validate(order) for order in orders],
        total=total,
        page=(skip // limit) + 1,
        limit=limit
    )


@router.get(
    "/producer-orders",
    response_model=OrderListResponse,
    summary="Commandes reçues (Producteur)"
)
def get_producer_orders(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Récupère toutes les commandes reçues par le producteur.
    
    **Réservé aux producteurs.**
    
    Permet de gérer les commandes clients :
    - Voir les nouvelles commandes
    - Filtrer par statut
    - Suivre les commandes en cours
    """
    # Vérifier que l'utilisateur est un producteur
    from app.repositories.profile_repository import ProducerProfileRepository
    producer_repo = ProducerProfileRepository(order_service.db)
    producer = producer_repo.get_by_user_id(current_user.id)
    
    if not producer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les producteurs peuvent accéder à cette ressource"
        )
    
    orders = order_service.get_producer_orders(
        producer.id,
        skip,
        limit,
        status_filter
    )
    total = len(orders)  # TODO: Implement proper count
    
    return OrderListResponse(
        orders=[OrderResponse.model_validate(order) for order in orders],
        total=total,
        page=(skip // limit) + 1,
        limit=limit
    )


@router.get(
    "/{order_id}",
    response_model=OrderResponse,
    summary="Détails d'une commande"
)
def get_order(
    order_id: int,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Récupère les détails complets d'une commande.
    
    Inclut :
    - Tous les articles avec leurs snapshots
    - L'historique des changements de statut
    - Le suivi de livraison (si applicable)
    
    Vérifie automatiquement que l'utilisateur a le droit de voir cette commande
    (client ou producteur concerné).
    """
    order = order_service.get_order(order_id, current_user.id)
    return OrderResponse.model_validate(order)


@router.post(
    "/{order_id}/status",
    response_model=OrderResponse,
    summary="Changer le statut d'une commande"
)
@router.put(
    "/{order_id}/status",
    response_model=OrderResponse,
    summary="Changer le statut d'une commande (alias PUT)"
)
def update_order_status(
    order_id: int,
    status_change: UpdateOrderStatusRequest,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Change le statut d'une commande avec enregistrement dans l'historique.
    
    **Réservé au producteur de la commande.**
    
    Flux typique :
    1. pending → confirmed (le producteur accepte)
    2. confirmed → preparing (début de préparation)
    3. preparing → ready (prêt pour retrait/livraison)
    4. ready → completed (client a récupéré)
    
    À tout moment : → cancelled
    """
    # Convert to the service expected format
    from app.schemas.order_schema import OrderStatusHistoryCreate
    resolved_status = status_change.status or status_change.new_status
    status_change_data = OrderStatusHistoryCreate(
        new_status=resolved_status,
        comment=status_change.comment
    )
    
    order = order_service.update_order_status(
        order_id,
        current_user.id,
        status_change_data
    )
    return OrderResponse.model_validate(order)


@router.post(
    "/{order_id}/cancel",
    response_model=OrderResponse,
    summary="Annuler une commande"
)
def cancel_order(
    order_id: int,
    cancel_request: CancelOrderRequest,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Annule une commande et restaure les stocks.
    
    Peut être fait par :
    - Le client (avant que le producteur ne commence à préparer)
    - Le producteur (à tout moment avant completion)
    
    Les stocks sont automatiquement restaurés.
    """
    reason = cancel_request.reason if cancel_request.reason else "Annulation demandée"
    order = order_service.cancel_order(order_id, current_user.id, reason)
    return OrderResponse.model_validate(order)


@router.post(
    "/{order_ids}/cancel",
    response_model=MessageResponse,
    summary="Annuler plusieurs commandes"
)
def bulk_cancel_orders(
    order_ids: str,  # Comma-separated IDs
    cancel_request: CancelOrderRequest,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Annule plusieurs commandes en une seule opération.
    
    Les IDs des commandes doivent être séparés par des virgules.
    Exemple: /orders/1,2,3/cancel
    """
    try:
        order_id_list = [int(id.strip()) for id in order_ids.split(',')]
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format d'IDs invalide"
        )
    
    reason = cancel_request.reason if cancel_request.reason else "Annulation en lot"
    cancelled_count = 0
    
    for order_id in order_id_list:
        try:
            order_service.cancel_order(order_id, current_user.id, reason)
            cancelled_count += 1
        except HTTPException:
            # Continue with other orders if one fails
            continue
    
    return MessageResponse(
        message=f"{cancelled_count} commande(s) annulée(s) sur {len(order_id_list)}"
    )


# ============= Order Tracking Endpoints =============

@router.post(
    "/{order_id}/tracking",
    response_model=OrderTrackingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter un suivi de livraison"
)
def add_tracking(
    order_id: int,
    tracking_data: OrderTrackingCreate,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Ajoute une entrée de suivi pour une livraison.
    
    **Réservé au producteur de la commande.**
    
    Permet de tenir le client informé en temps réel :
    - "Chargement des produits"
    - "En route vers le client"
    - "Arrivé à l'adresse"
    - "Livraison effectuée"
    
    Chaque entrée peut inclure une localisation géographique.
    """
    tracking = order_service.add_tracking(
        order_id,
        current_user.id,
        tracking_data
    )
    return OrderTrackingResponse.model_validate(tracking)


@router.get(
    "/{order_id}/tracking",
    response_model=List[OrderTrackingResponse],
    summary="Voir le suivi d'une commande"
)
def get_order_tracking(
    order_id: int,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Récupère tout l'historique de suivi d'une commande.
    
    Accessible par le client et le producteur.
    """
    # Vérifier l'accès à la commande
    order = order_service.get_order(order_id, current_user.id)
    
    from app.repositories.order_repository import OrderTrackingRepository
    tracking_repo = OrderTrackingRepository(order_service.db)
    tracking = tracking_repo.get_order_tracking(order.id)
    
    return [OrderTrackingResponse.model_validate(t) for t in tracking]


@router.get(
    "/{order_id}/history",
    response_model=List[OrderStatusHistoryResponse],
    summary="Voir l'historique des statuts"
)
def get_order_history(
    order_id: int,
    current_user = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """
    Récupère l'historique complet des changements de statut.
    
    Accessible par le client et le producteur.
    Montre qui a changé le statut, quand, et pourquoi.
    """
    # Vérifier l'accès
    order = order_service.get_order(order_id, current_user.id)
    
    from app.repositories.order_repository import OrderStatusHistoryRepository
    history_repo = OrderStatusHistoryRepository(order_service.db)
    history = history_repo.get_order_history(order.id)
    
    return [OrderStatusHistoryResponse.model_validate(h) for h in history]
