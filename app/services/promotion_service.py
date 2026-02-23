""
from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
from datetime import datetime, timezone
from decimal import Decimal
from fastapi import HTTPException, status

from app.repositories.promotion_repository import PromotionRepository
from app.models.promotions import (
    Coupon,
    CouponType, LoyaltyTransactionType
)
from app.schemas.promotions import (
    CouponCreate, CouponUpdate, CouponResponse, CouponValidation,
    CouponUsageCreate, CouponUsageResponse,
    PromotionCreate, PromotionResponse,
    LoyaltyProgramCreate, LoyaltyProgramResponse,
    LoyaltyPointCreate, LoyaltyPointResponse,
    LoyaltyTransactionCreate, LoyaltyTransactionResponse,
    RewardCreate, RewardUpdate, RewardResponse,
    RewardRedemptionCreate, RewardRedemptionResponse,
    PointsCalculation
)


class PromotionService:
    """
    Service gérant toute la logique métier des promotions et de la fidélité.
    
    Architecture de transaction :
    - Le Repository utilise flush() pour obtenir les IDs
    - Le Service utilise commit() pour valider les transactions atomiques
    - En cas d'erreur, le rollback est automatique
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = PromotionRepository(db)
    
    # ========================================================================
    # LOGIQUE MÉTIER - COUPON
    # ========================================================================
    
    def create_coupon(self, coupon_data: CouponCreate) -> CouponResponse:
        """Crée un nouveau coupon avec validation"""
        try:
            # Vérifier que le code n'existe pas déjà
            existing = self.repository.get_coupon_by_code(coupon_data.code)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Un coupon avec le code '{coupon_data.code}' existe déjà"
                )
            
            # Créer le coupon
            coupon = self.repository.create_coupon(coupon_data)
            
            self.db.commit()
            self.db.refresh(coupon)
            
            return CouponResponse.model_validate(coupon)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création du coupon : {str(e)}"
            )
    
    def get_coupon(self, coupon_id: int) -> CouponResponse:
        """Récupère un coupon par son ID"""
        coupon = self.repository.get_coupon_by_id(coupon_id)
        if not coupon:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Coupon {coupon_id} non trouvé"
            )
        return CouponResponse.model_validate(coupon)
    
    def get_active_coupons(self, skip: int = 0, limit: int = 100) -> List[CouponResponse]:
        """Récupère tous les coupons actifs"""
        coupons = self.repository.get_active_coupons(skip, limit)
        return [CouponResponse.model_validate(c) for c in coupons]
    
    def update_coupon(self, coupon_id: int, coupon_data: CouponUpdate) -> CouponResponse:
        """Met à jour un coupon"""
        try:
            coupon = self.repository.get_coupon_by_id(coupon_id)
            if not coupon:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Coupon {coupon_id} non trouvé"
                )
            
            coupon = self.repository.update_coupon(coupon, coupon_data)
            
            self.db.commit()
            self.db.refresh(coupon)
            
            return CouponResponse.model_validate(coupon)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la mise à jour : {str(e)}"
            )
    
    def validate_coupon(
        self,
        code: str,
        user_id: int,
        order_amount: Decimal
    ) -> CouponValidation:
        """
        Valide un coupon et calcule la réduction applicable.
        
        Cette fonction vérifie toutes les conditions d'utilisation du coupon :
        - Existence et activité
        - Période de validité
        - Limite d'utilisation
        - Montant minimum de commande
        - Utilisation précédente par l'utilisateur
        """
        try:
            # Récupérer le coupon
            coupon = self.repository.get_coupon_by_code(code)
            
            if not coupon:
                return CouponValidation(
                    is_valid=False,
                    message="Code coupon invalide"
                )
            
            # Vérifier que le coupon est actif
            if not coupon.is_active:
                return CouponValidation(
                    is_valid=False,
                    message="Ce coupon n'est plus actif"
                )
            
            # Vérifier la période de validité
            now = datetime.now(timezone.utc)
            if now < coupon.valid_from:
                return CouponValidation(
                    is_valid=False,
                    message="Ce coupon n'est pas encore valide"
                )
            
            if now > coupon.valid_until:
                return CouponValidation(
                    is_valid=False,
                    message="Ce coupon a expiré"
                )
            
            # Vérifier la limite d'utilisation
            if coupon.usage_limit is not None:
                if coupon.used_count >= coupon.usage_limit:
                    return CouponValidation(
                        is_valid=False,
                        message="Ce coupon a atteint sa limite d'utilisation"
                    )
            
            # Vérifier si l'utilisateur a déjà utilisé ce coupon
            if self.repository.check_user_used_coupon(user_id, coupon.id):
                return CouponValidation(
                    is_valid=False,
                    message="Vous avez déjà utilisé ce coupon"
                )
            
            # Vérifier le montant minimum de commande
            if coupon.min_order_amount is not None:
                if order_amount < coupon.min_order_amount:
                    return CouponValidation(
                        is_valid=False,
                        message=f"Montant minimum de {coupon.min_order_amount} XAF requis"
                    )
            
            # Calculer la réduction
            discount_amount = self._calculate_coupon_discount(coupon, order_amount)
            final_amount = order_amount - discount_amount
            
            return CouponValidation(
                is_valid=True,
                message="Coupon valide",
                discount_amount=discount_amount,
                final_amount=final_amount
            )
            
        except Exception as e:
            return CouponValidation(
                is_valid=False,
                message=f"Erreur lors de la validation : {str(e)}"
            )
    
    def _calculate_coupon_discount(self, coupon: Coupon, order_amount: Decimal) -> Decimal:
        """
        Calcule le montant de la réduction selon le type de coupon.
        
        Méthode privée utilisée par validate_coupon.
        """
        if coupon.type == CouponType.PERCENTAGE:
            discount = order_amount * (coupon.value / 100)
            
            # Appliquer le plafond si défini
            if coupon.max_discount is not None:
                discount = min(discount, coupon.max_discount)
            
            return discount
        
        elif coupon.type == CouponType.FIXED:
            # La réduction ne peut pas dépasser le montant de la commande
            return min(coupon.value, order_amount)
        
        elif coupon.type == CouponType.FREE_DELIVERY:
            # Pour la livraison gratuite, retourner 0
            # Le coût de livraison sera géré séparément dans la commande
            return Decimal("0")
        
        return Decimal("0")
    
    def apply_coupon(
        self,
        code: str,
        user_id: int,
        order_id: int,
        order_amount: Decimal
    ) -> CouponUsageResponse:
        """
        Applique un coupon à une commande et enregistre l'utilisation.
        
        Cette fonction doit être appelée lors de la finalisation d'une commande.
        Elle valide le coupon, l'applique, et met à jour les compteurs.
        """
        try:
            # Valider le coupon
            validation = self.validate_coupon(code, user_id, order_amount)
            
            if not validation.is_valid:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=validation.message
                )
            
            # Récupérer le coupon
            coupon = self.repository.get_coupon_by_code(code)
            
            # Créer l'enregistrement d'utilisation
            usage_data = CouponUsageCreate(
                coupon_id=coupon.id,
                user_id=user_id,
                order_id=order_id,
                discount_amount=validation.discount_amount
            )
            
            usage = self.repository.create_coupon_usage(usage_data)
            
            # Incrémenter le compteur d'utilisation du coupon
            self.repository.increment_coupon_usage(coupon)
            
            self.db.commit()
            self.db.refresh(usage)
            
            return CouponUsageResponse.model_validate(usage)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de l'application du coupon : {str(e)}"
            )
    
    # ========================================================================
    # LOGIQUE MÉTIER - PROMOTION
    # ========================================================================
    
    def create_promotion(self, promotion_data: PromotionCreate) -> PromotionResponse:
        """Crée une nouvelle promotion produit"""
        try:
            # Vérifier que le produit existe
            # TODO: Ajouter une vérification avec le ProductRepository
            
            promotion = self.repository.create_promotion(promotion_data)
            
            self.db.commit()
            self.db.refresh(promotion)
            
            return PromotionResponse.model_validate(promotion)
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création de la promotion : {str(e)}"
            )
    
    def get_promotion(self, promotion_id: int) -> PromotionResponse:
        """Récupère une promotion par son ID"""
        promotion = self.repository.get_promotion_by_id(promotion_id)
        if not promotion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Promotion {promotion_id} non trouvée"
            )
        return PromotionResponse.model_validate(promotion)
    
    def get_product_promotions(self, product_id: int) -> List[PromotionResponse]:
        """Récupère toutes les promotions actives pour un produit"""
        promotions = self.repository.get_active_promotions_for_product(product_id)
        return [PromotionResponse.model_validate(p) for p in promotions]
    
    def get_best_promotion_for_product(self, product_id: int) -> Optional[PromotionResponse]:
        """
        Récupère la meilleure promotion active pour un produit.
        
        Si plusieurs promotions sont actives, retourne celle avec
        le pourcentage de réduction le plus élevé.
        """
        promotions = self.repository.get_active_promotions_for_product(product_id)
        
        if not promotions:
            return None
        
        # Trouver la promotion avec le plus grand pourcentage
        best_promotion = max(promotions, key=lambda p: p.discount_percentage)
        
        return PromotionResponse.model_validate(best_promotion)
    
    # ========================================================================
    # LOGIQUE MÉTIER - LOYALTY PROGRAM
    # ========================================================================
    
    def create_loyalty_program(
        self,
        program_data: LoyaltyProgramCreate
    ) -> LoyaltyProgramResponse:
        """Crée un nouveau programme de fidélité"""
        try:
            # Désactiver l'ancien programme actif s'il existe
            old_program = self.repository.get_active_loyalty_program()
            if old_program and program_data.is_active:
                old_program.is_active = False
                self.db.flush()
            
            program = self.repository.create_loyalty_program(program_data)
            
            self.db.commit()
            self.db.refresh(program)
            
            return LoyaltyProgramResponse.model_validate(program)
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création du programme : {str(e)}"
            )
    
    def get_active_program(self) -> LoyaltyProgramResponse:
        """Récupère le programme de fidélité actif"""
        program = self.repository.get_active_loyalty_program()
        if not program:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aucun programme de fidélité actif"
            )
        return LoyaltyProgramResponse.model_validate(program)
    
    # ========================================================================
    # LOGIQUE MÉTIER - LOYALTY POINTS
    # ========================================================================
    
    def get_or_create_user_points(self, user_id: int) -> LoyaltyPointResponse:
        """
        Récupère ou crée le solde de points d'un utilisateur.
        
        Si l'utilisateur n'a pas encore de solde de points (première fois),
        un nouveau compte est créé automatiquement.
        """
        try:
            # Chercher le solde existant
            points = self.repository.get_loyalty_points_by_user(user_id)
            
            if not points:
                # Créer un nouveau solde
                points_data = LoyaltyPointCreate(user_id=user_id)
                points = self.repository.create_loyalty_points(points_data)
                self.db.commit()
                self.db.refresh(points)
            
            return LoyaltyPointResponse.model_validate(points)
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la récupération des points : {str(e)}"
            )
    
    def calculate_points_for_order(self, order_amount: Decimal) -> PointsCalculation:
        """
        Calcule les points gagnés pour un montant d'achat.
        
        Utilise le taux du programme de fidélité actif.
        """
        program = self.repository.get_active_loyalty_program()
        
        if not program:
            return PointsCalculation(
                order_amount=order_amount,
                points_earned=0,
                program_rate=Decimal("0")
            )
        
        # Calculer les points (arrondi à l'entier inférieur)
        points_earned = int(order_amount * program.points_per_euro)
        
        return PointsCalculation(
            order_amount=order_amount,
            points_earned=points_earned,
            program_rate=program.points_per_euro
        )
    
    def award_points_for_order(
        self,
        user_id: int,
        order_id: int,
        order_amount: Decimal
    ) -> Tuple[LoyaltyPointResponse, LoyaltyTransactionResponse]:
        """
        Attribue des points de fidélité pour une commande.
        
        Cette fonction doit être appelée quand une commande est livrée.
        Elle calcule les points, les ajoute au solde, et enregistre la transaction.
        """
        try:
            # Calculer les points à attribuer
            calculation = self.calculate_points_for_order(order_amount)
            
            if calculation.points_earned == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Aucun point à attribuer (programme inactif ou montant insuffisant)"
                )
            
            # Récupérer ou créer le solde de points
            loyalty_points = self.repository.get_loyalty_points_by_user(user_id)
            if not loyalty_points:
                points_data = LoyaltyPointCreate(user_id=user_id)
                loyalty_points = self.repository.create_loyalty_points(points_data)
            
            # Mettre à jour le solde
            loyalty_points = self.repository.update_loyalty_balance(
                loyalty_points,
                calculation.points_earned,
                LoyaltyTransactionType.EARNED
            )
            
            # Créer la transaction
            transaction_data = LoyaltyTransactionCreate(
                user_id=user_id,
                type=LoyaltyTransactionType.EARNED,
                points=calculation.points_earned,
                order_id=order_id,
                description=f"Points gagnés pour la commande #{order_id}"
            )
            
            transaction = self.repository.create_loyalty_transaction(transaction_data)
            
            self.db.commit()
            self.db.refresh(loyalty_points)
            self.db.refresh(transaction)
            
            return (
                LoyaltyPointResponse.model_validate(loyalty_points),
                LoyaltyTransactionResponse.model_validate(transaction)
            )
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de l'attribution des points : {str(e)}"
            )
    
    def get_user_transactions(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[LoyaltyTransactionResponse]:
        """Récupère l'historique des transactions de points d'un utilisateur"""
        transactions = self.repository.get_user_loyalty_transactions(user_id, skip, limit)
        return [LoyaltyTransactionResponse.model_validate(t) for t in transactions]
    
    # ========================================================================
    # LOGIQUE MÉTIER - REWARDS
    # ========================================================================
    
    def create_reward(self, reward_data: RewardCreate) -> RewardResponse:
        """Crée une nouvelle récompense"""
        try:
            reward = self.repository.create_reward(reward_data)
            
            self.db.commit()
            self.db.refresh(reward)
            
            return RewardResponse.model_validate(reward)
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création de la récompense : {str(e)}"
            )
    
    def get_reward(self, reward_id: int) -> RewardResponse:
        """Récupère une récompense par son ID"""
        reward = self.repository.get_reward_by_id(reward_id)
        if not reward:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Récompense {reward_id} non trouvée"
            )
        return RewardResponse.model_validate(reward)
    
    def get_available_rewards(self, skip: int = 0, limit: int = 100) -> List[RewardResponse]:
        """Récupère toutes les récompenses disponibles"""
        rewards = self.repository.get_active_rewards(skip, limit)
        return [RewardResponse.model_validate(r) for r in rewards]
    
    def update_reward(self, reward_id: int, reward_data: RewardUpdate) -> RewardResponse:
        """Met à jour une récompense"""
        try:
            reward = self.repository.get_reward_by_id(reward_id)
            if not reward:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Récompense {reward_id} non trouvée"
                )
            
            reward = self.repository.update_reward(reward, reward_data)
            
            self.db.commit()
            self.db.refresh(reward)
            
            return RewardResponse.model_validate(reward)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la mise à jour : {str(e)}"
            )
    
    def redeem_reward(
        self,
        user_id: int,
        reward_id: int,
        order_id: Optional[int] = None
    ) -> Tuple[RewardRedemptionResponse, LoyaltyPointResponse]:
        """
        Échange des points contre une récompense.
        
        Vérifie que l'utilisateur a suffisamment de points,
        que la récompense est disponible, débite les points,
        et enregistre l'échange.
        """
        try:
            # Récupérer la récompense
            reward = self.repository.get_reward_by_id(reward_id)
            if not reward:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Récompense {reward_id} non trouvée"
                )
            
            # Vérifier que la récompense est active
            if not reward.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cette récompense n'est plus disponible"
                )
            
            # Vérifier le stock
            if reward.stock is not None and reward.stock <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cette récompense est en rupture de stock"
                )
            
            # Récupérer le solde de points de l'utilisateur
            loyalty_points = self.repository.get_loyalty_points_by_user(user_id)
            if not loyalty_points:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous n'avez pas encore de points de fidélité"
                )
            
            # Vérifier que l'utilisateur a suffisamment de points
            if loyalty_points.balance < reward.points_cost:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Points insuffisants. Vous avez {loyalty_points.balance} points, "
                           f"cette récompense coûte {reward.points_cost} points."
                )
            
            # Débiter les points
            loyalty_points = self.repository.update_loyalty_balance(
                loyalty_points,
                -reward.points_cost,
                LoyaltyTransactionType.SPENT
            )
            
            # Créer la transaction de points
            transaction_data = LoyaltyTransactionCreate(
                user_id=user_id,
                type=LoyaltyTransactionType.SPENT,
                points=-reward.points_cost,
                order_id=order_id,
                description=f"Échange contre : {reward.name}"
            )
            
            self.repository.create_loyalty_transaction(transaction_data)
            
            # Créer l'enregistrement d'échange
            redemption_data = RewardRedemptionCreate(
                user_id=user_id,
                reward_id=reward_id,
                order_id=order_id
            )
            
            redemption = self.repository.create_reward_redemption(redemption_data)
            
            # Décrémenter le stock si nécessaire
            if reward.stock is not None:
                self.repository.decrement_reward_stock(reward)
            
            self.db.commit()
            self.db.refresh(redemption)
            self.db.refresh(loyalty_points)
            
            return (
                RewardRedemptionResponse.model_validate(redemption),
                LoyaltyPointResponse.model_validate(loyalty_points)
            )
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de l'échange : {str(e)}"
            )
    
    def get_user_redemptions(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[RewardRedemptionResponse]:
        """Récupère l'historique des échanges de récompenses d'un utilisateur"""
        redemptions = self.repository.get_user_reward_redemptions(user_id, skip, limit)
        return [RewardRedemptionResponse.model_validate(r) for r in redemptions]