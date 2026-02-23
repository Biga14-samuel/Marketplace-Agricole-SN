from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal

from app.core.database import get_db
from app.services.promotion_service import PromotionService
from app.schemas.promotions import (
    CouponCreate, CouponUpdate, CouponResponse, CouponValidation,
    CouponUsageResponse,
    PromotionCreate, PromotionResponse,
    LoyaltyProgramCreate, LoyaltyProgramResponse,
    LoyaltyPointResponse, LoyaltyTransactionResponse,
    RewardCreate, RewardUpdate, RewardResponse,
    RewardRedemptionResponse,
    PointsCalculation
)


# Le préfixe /api/v1/promotions est ajouté par main.py
router = APIRouter(
    prefix="",
    tags=["Promotions & Loyalty"]
)


# ============================================================================
# ENDPOINTS - COUPON (Codes promotionnels)
# ============================================================================

@router.post("/coupons", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
def create_coupon(
    coupon_data: CouponCreate,
    db: Session = Depends(get_db)
):
    """
    Crée un nouveau code promotionnel.
    
    Les coupons peuvent être de trois types :
    - **percentage** : Réduction en pourcentage (ex: 10% de réduction)
    - **fixed** : Montant fixe de réduction (ex: 1000 XAF de réduction)
    - **free_delivery** : Livraison gratuite
    
    Vous pouvez définir :
    - Un montant minimum de commande requis
    - Un plafond de réduction (pour les pourcentages)
    - Une limite d'utilisation (nombre de fois que le coupon peut être utilisé)
    - Une période de validité
    """
    service = PromotionService(db)
    return service.create_coupon(coupon_data)


@router.get("/coupons/{coupon_id}", response_model=CouponResponse)
def get_coupon(
    coupon_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'un coupon spécifique."""
    service = PromotionService(db)
    return service.get_coupon(coupon_id)


@router.get("/coupons", response_model=List[CouponResponse])
def get_active_coupons(
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter (pagination)"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments à retourner"),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les coupons actifs et valides actuellement.
    
    Seuls les coupons actifs, non expirés et n'ayant pas atteint
    leur limite d'utilisation sont retournés.
    """
    service = PromotionService(db)
    return service.get_active_coupons(skip, limit)


@router.patch("/coupons/{coupon_id}", response_model=CouponResponse)
def update_coupon(
    coupon_id: int,
    coupon_data: CouponUpdate,
    db: Session = Depends(get_db)
):
    """
    Met à jour un coupon existant.
    
    Vous pouvez modifier :
    - Le statut actif/inactif
    - La limite d'utilisation
    - La date d'expiration
    """
    service = PromotionService(db)
    return service.update_coupon(coupon_id, coupon_data)


@router.post("/coupons/validate", response_model=CouponValidation)
def validate_coupon(
    code: str = Query(..., description="Code du coupon à valider"),
    user_id: int = Query(..., description="ID de l'utilisateur"),
    order_amount: Decimal = Query(..., description="Montant de la commande"),
    db: Session = Depends(get_db)
):
    """
    Valide un code coupon et calcule la réduction applicable.
    
    Cette fonction vérifie :
    - Que le code existe et est actif
    - Que la période de validité est respectée
    - Que les limites d'utilisation ne sont pas atteintes
    - Que l'utilisateur n'a pas déjà utilisé ce coupon
    - Que le montant minimum de commande est atteint
    
    Retourne le montant de réduction et le montant final après réduction.
    """
    service = PromotionService(db)
    return service.validate_coupon(code, user_id, order_amount)


@router.post("/coupons/apply", response_model=CouponUsageResponse, status_code=status.HTTP_201_CREATED)
def apply_coupon(
    code: str = Query(..., description="Code du coupon"),
    user_id: int = Query(..., description="ID de l'utilisateur"),
    order_id: int = Query(..., description="ID de la commande"),
    order_amount: Decimal = Query(..., description="Montant de la commande"),
    db: Session = Depends(get_db)
):
    """
    Applique un coupon à une commande.
    
    Cette fonction doit être appelée lors de la finalisation d'une commande.
    Elle valide le coupon, l'applique, enregistre l'utilisation,
    et met à jour les compteurs.
    """
    service = PromotionService(db)
    return service.apply_coupon(code, user_id, order_id, order_amount)


# ============================================================================
# ENDPOINTS - PROMOTION (Promotions produits)
# ============================================================================

@router.post("/product-promotions", response_model=PromotionResponse, status_code=status.HTTP_201_CREATED)
def create_promotion(
    promotion_data: PromotionCreate,
    db: Session = Depends(get_db)
):
    """
    Crée une nouvelle promotion sur un produit.
    
    Les promotions produits s'appliquent automatiquement sans code.
    Types disponibles :
    - **flash_sale** : Vente flash limitée dans le temps
    - **bundle** : Offre groupée
    - **volume** : Réduction selon la quantité achetée
    """
    service = PromotionService(db)
    return service.create_promotion(promotion_data)


@router.get("/product-promotions/{promotion_id}", response_model=PromotionResponse)
def get_promotion(
    promotion_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'une promotion spécifique."""
    service = PromotionService(db)
    return service.get_promotion(promotion_id)


@router.get("/product-promotions/product/{product_id}", response_model=List[PromotionResponse])
def get_product_promotions(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère toutes les promotions actives pour un produit.
    
    Utile pour afficher toutes les offres disponibles sur un produit.
    """
    service = PromotionService(db)
    return service.get_product_promotions(product_id)


@router.get("/product-promotions/product/{product_id}/best", response_model=PromotionResponse)
def get_best_promotion(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère la meilleure promotion pour un produit.
    
    Si plusieurs promotions sont actives, retourne celle avec
    le pourcentage de réduction le plus élevé.
    """
    service = PromotionService(db)
    result = service.get_best_promotion_for_product(product_id)
    if result is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucune promotion active pour ce produit"
        )
    return result


# ============================================================================
# ENDPOINTS - LOYALTY PROGRAM (Programme de fidélité)
# ============================================================================

@router.post("/loyalty-programs", response_model=LoyaltyProgramResponse, status_code=status.HTTP_201_CREATED)
def create_loyalty_program(
    program_data: LoyaltyProgramCreate,
    db: Session = Depends(get_db)
):
    """
    Crée un nouveau programme de fidélité.
    
    Définit combien de points les clients gagnent pour chaque euro dépensé.
    Si un programme actif existe déjà, il sera automatiquement désactivé.
    """
    service = PromotionService(db)
    return service.create_loyalty_program(program_data)


@router.get("/loyalty-programs/active", response_model=LoyaltyProgramResponse)
def get_active_program(db: Session = Depends(get_db)):
    """
    Récupère le programme de fidélité actuellement actif.
    
    Ce programme détermine le taux de conversion euros → points.
    """
    service = PromotionService(db)
    return service.get_active_program()


# ============================================================================
# ENDPOINTS - LOYALTY POINTS (Points de fidélité)
# ============================================================================

@router.get("/loyalty-points/user/{user_id}", response_model=LoyaltyPointResponse)
def get_user_points(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère le solde de points de fidélité d'un utilisateur.
    
    Si l'utilisateur n'a pas encore de compte de points,
    un nouveau compte est créé automatiquement avec un solde de 0.
    """
    service = PromotionService(db)
    return service.get_or_create_user_points(user_id)


@router.post("/loyalty-points/calculate", response_model=PointsCalculation)
def calculate_points(
    order_amount: Decimal = Query(..., description="Montant de la commande"),
    db: Session = Depends(get_db)
):
    """
    Calcule combien de points seront gagnés pour un montant d'achat.
    
    Utilise le taux du programme de fidélité actif.
    Utile pour afficher un aperçu avant la finalisation de commande.
    """
    service = PromotionService(db)
    return service.calculate_points_for_order(order_amount)


@router.post("/loyalty-points/award", status_code=status.HTTP_201_CREATED)
def award_points(
    user_id: int = Query(..., description="ID de l'utilisateur"),
    order_id: int = Query(..., description="ID de la commande"),
    order_amount: Decimal = Query(..., description="Montant de la commande"),
    db: Session = Depends(get_db)
):
    """
    Attribue des points de fidélité pour une commande.
    
    Cette fonction doit être appelée quand une commande est livrée.
    Elle calcule les points selon le montant de la commande,
    les ajoute au solde de l'utilisateur, et enregistre la transaction.
    """
    service = PromotionService(db)
    points, transaction = service.award_points_for_order(user_id, order_id, order_amount)
    return {
        "points": points,
        "transaction": transaction
    }


@router.get("/loyalty-points/transactions/{user_id}", response_model=List[LoyaltyTransactionResponse])
def get_user_transactions(
    user_id: int,
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments"),
    db: Session = Depends(get_db)
):
    """
    Récupère l'historique des transactions de points d'un utilisateur.
    
    Affiche tous les mouvements de points : gagnés, dépensés, expirés.
    Trié du plus récent au plus ancien.
    """
    service = PromotionService(db)
    return service.get_user_transactions(user_id, skip, limit)


# ============================================================================
# ENDPOINTS - REWARDS (Récompenses)
# ============================================================================

@router.post("/rewards", response_model=RewardResponse, status_code=status.HTTP_201_CREATED)
def create_reward(
    reward_data: RewardCreate,
    db: Session = Depends(get_db)
):
    """
    Crée une nouvelle récompense échangeable contre des points.
    
    Les récompenses peuvent être :
    - **discount** : Une réduction en argent sur une prochaine commande
    - **free_product** : Un produit gratuit
    
    Vous pouvez définir un stock limité ou illimité (null).
    """
    service = PromotionService(db)
    return service.create_reward(reward_data)


@router.get("/rewards/{reward_id}", response_model=RewardResponse)
def get_reward(
    reward_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'une récompense spécifique."""
    service = PromotionService(db)
    return service.get_reward(reward_id)


@router.get("/rewards", response_model=List[RewardResponse])
def get_available_rewards(
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments"),
    db: Session = Depends(get_db)
):
    """
    Récupère toutes les récompenses disponibles actuellement.
    
    Seules les récompenses actives et en stock sont retournées.
    """
    service = PromotionService(db)
    return service.get_available_rewards(skip, limit)


@router.patch("/rewards/{reward_id}", response_model=RewardResponse)
def update_reward(
    reward_id: int,
    reward_data: RewardUpdate,
    db: Session = Depends(get_db)
):
    """
    Met à jour une récompense existante.
    
    Vous pouvez modifier le nom, la description, le coût en points,
    le stock disponible, et le statut actif/inactif.
    """
    service = PromotionService(db)
    return service.update_reward(reward_id, reward_data)


@router.post("/rewards/redeem", status_code=status.HTTP_201_CREATED)
def redeem_reward(
    user_id: int = Query(..., description="ID de l'utilisateur"),
    reward_id: int = Query(..., description="ID de la récompense"),
    order_id: Optional[int] = Query(None, description="ID de la commande (optionnel)"),
    db: Session = Depends(get_db)
):
    """
    Échange des points contre une récompense.
    
    Cette fonction vérifie :
    - Que l'utilisateur a suffisamment de points
    - Que la récompense est disponible et en stock
    - Débite les points du solde de l'utilisateur
    - Enregistre l'échange et décrémente le stock
    
    Retourne les détails de l'échange et le nouveau solde de points.
    """
    service = PromotionService(db)
    redemption, points = service.redeem_reward(user_id, reward_id, order_id)
    return {
        "redemption": redemption,
        "remaining_points": points
    }


@router.get("/rewards/redemptions/{user_id}", response_model=List[RewardRedemptionResponse])
def get_user_redemptions(
    user_id: int,
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments"),
    db: Session = Depends(get_db)
):
    """
    Récupère l'historique des échanges de récompenses d'un utilisateur.
    
    Affiche toutes les récompenses que l'utilisateur a réclamées.
    Trié du plus récent au plus ancien.
    """
    service = PromotionService(db)
    return service.get_user_redemptions(user_id, skip, limit)