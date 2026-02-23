from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime, timezone

from app.models.promotions import (
    Coupon, CouponUsage, Promotion,
    LoyaltyProgram, LoyaltyPoint, LoyaltyTransaction,
    Reward, RewardRedemption,
    LoyaltyTransactionType
)
from app.schemas.promotions import (
    CouponCreate, CouponUpdate,
    CouponUsageCreate,
    PromotionCreate, PromotionUpdate,
    LoyaltyProgramCreate, LoyaltyProgramUpdate,
    LoyaltyPointCreate,
    LoyaltyTransactionCreate,
    RewardCreate, RewardUpdate,
    RewardRedemptionCreate
)


class PromotionRepository:
    """
    Repository pour gérer les opérations CRUD sur toutes les entités
    du module Promotions & Fidélité.
    
    Rappel architecture :
    - Repository utilise flush() pour obtenir les IDs sans valider la transaction
    - Le Service appelant utilisera commit() pour valider l'ensemble
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    # ========================================================================
    # OPÉRATIONS CRUD - COUPON
    # ========================================================================
    
    def create_coupon(self, coupon_data: CouponCreate) -> Coupon:
        """Crée un nouveau coupon"""
        coupon = Coupon(**coupon_data.model_dump())
        self.db.add(coupon)
        self.db.flush()
        self.db.refresh(coupon)
        return coupon
    
    def get_coupon_by_id(self, coupon_id: int) -> Optional[Coupon]:
        """Récupère un coupon par son ID"""
        return self.db.query(Coupon).filter(Coupon.id == coupon_id).first()
    
    def get_coupon_by_code(self, code: str) -> Optional[Coupon]:
        """Récupère un coupon par son code"""
        return self.db.query(Coupon).filter(Coupon.code == code.upper()).first()
    
    def get_active_coupons(self, skip: int = 0, limit: int = 100) -> List[Coupon]:
        """Récupère tous les coupons actifs"""
        now = datetime.now(timezone.utc)
        return self.db.query(Coupon).filter(
            and_(
                Coupon.is_active,
                Coupon.valid_from <= now,
                Coupon.valid_until >= now
            )
        ).offset(skip).limit(limit).all()
    
    def update_coupon(self, coupon: Coupon, coupon_data: CouponUpdate) -> Coupon:
        """Met à jour un coupon"""
        update_data = coupon_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(coupon, field, value)
        
        self.db.flush()
        self.db.refresh(coupon)
        return coupon
    
    def increment_coupon_usage(self, coupon: Coupon) -> Coupon:
        """Incrémente le compteur d'utilisation d'un coupon"""
        coupon.used_count += 1
        self.db.flush()
        self.db.refresh(coupon)
        return coupon
    
    def delete_coupon(self, coupon: Coupon) -> bool:
        """Supprime un coupon"""
        self.db.delete(coupon)
        self.db.flush()
        return True
    
    # ========================================================================
    # OPÉRATIONS CRUD - COUPONUSAGE
    # ========================================================================
    
    def create_coupon_usage(self, usage_data: CouponUsageCreate) -> CouponUsage:
        """Enregistre une utilisation de coupon"""
        usage = CouponUsage(**usage_data.model_dump())
        self.db.add(usage)
        self.db.flush()
        self.db.refresh(usage)
        return usage
    
    def get_user_coupon_usages(self, user_id: int) -> List[CouponUsage]:
        """Récupère toutes les utilisations de coupons par un utilisateur"""
        return self.db.query(CouponUsage).filter(
            CouponUsage.user_id == user_id
        ).order_by(CouponUsage.used_at.desc()).all()
    
    def check_user_used_coupon(self, user_id: int, coupon_id: int) -> bool:
        """Vérifie si un utilisateur a déjà utilisé un coupon spécifique"""
        usage = self.db.query(CouponUsage).filter(
            and_(
                CouponUsage.user_id == user_id,
                CouponUsage.coupon_id == coupon_id
            )
        ).first()
        return usage is not None
    
    # ========================================================================
    # OPÉRATIONS CRUD - PROMOTION
    # ========================================================================
    
    def create_promotion(self, promotion_data: PromotionCreate) -> Promotion:
        """Crée une nouvelle promotion produit"""
        promotion = Promotion(**promotion_data.model_dump())
        self.db.add(promotion)
        self.db.flush()
        self.db.refresh(promotion)
        return promotion
    
    def get_promotion_by_id(self, promotion_id: int) -> Optional[Promotion]:
        """Récupère une promotion par son ID"""
        return self.db.query(Promotion).filter(Promotion.id == promotion_id).first()
    
    def get_active_promotions_for_product(self, product_id: int) -> List[Promotion]:
        """Récupère toutes les promotions actives pour un produit"""
        now = datetime.now(timezone.utc)
        return self.db.query(Promotion).filter(
            and_(
                Promotion.product_id == product_id,
                Promotion.is_active,
                Promotion.start_date <= now,
                Promotion.end_date >= now
            )
        ).all()
    
    def get_all_active_promotions(self, skip: int = 0, limit: int = 100) -> List[Promotion]:
        """Récupère toutes les promotions actives"""
        now = datetime.now(timezone.utc)
        return self.db.query(Promotion).filter(
            and_(
                Promotion.is_active,
                Promotion.start_date <= now,
                Promotion.end_date >= now
            )
        ).offset(skip).limit(limit).all()
    
    def update_promotion(self, promotion: Promotion, promotion_data: PromotionUpdate) -> Promotion:
        """Met à jour une promotion"""
        update_data = promotion_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(promotion, field, value)
        
        self.db.flush()
        self.db.refresh(promotion)
        return promotion
    
    def delete_promotion(self, promotion: Promotion) -> bool:
        """Supprime une promotion"""
        self.db.delete(promotion)
        self.db.flush()
        return True
    
    # ========================================================================
    # OPÉRATIONS CRUD - LOYALTYPROGRAM
    # ========================================================================
    
    def create_loyalty_program(self, program_data: LoyaltyProgramCreate) -> LoyaltyProgram:
        """Crée un nouveau programme de fidélité"""
        program = LoyaltyProgram(**program_data.model_dump())
        self.db.add(program)
        self.db.flush()
        self.db.refresh(program)
        return program
    
    def get_loyalty_program_by_id(self, program_id: int) -> Optional[LoyaltyProgram]:
        """Récupère un programme de fidélité par son ID"""
        return self.db.query(LoyaltyProgram).filter(
            LoyaltyProgram.id == program_id
        ).first()
    
    def get_active_loyalty_program(self) -> Optional[LoyaltyProgram]:
        """Récupère le programme de fidélité actif"""
        return self.db.query(LoyaltyProgram).filter(
            LoyaltyProgram.is_active
        ).first()
    
    def update_loyalty_program(
        self,
        program: LoyaltyProgram,
        program_data: LoyaltyProgramUpdate
    ) -> LoyaltyProgram:
        """Met à jour un programme de fidélité"""
        update_data = program_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(program, field, value)
        
        self.db.flush()
        self.db.refresh(program)
        return program
    
    # ========================================================================
    # OPÉRATIONS CRUD - LOYALTYPOINT
    # ========================================================================
    
    def create_loyalty_points(self, points_data: LoyaltyPointCreate) -> LoyaltyPoint:
        """Crée un nouveau compte de points pour un utilisateur"""
        points = LoyaltyPoint(**points_data.model_dump())
        self.db.add(points)
        self.db.flush()
        self.db.refresh(points)
        return points
    
    def get_loyalty_points_by_user(self, user_id: int) -> Optional[LoyaltyPoint]:
        """Récupère le solde de points d'un utilisateur"""
        return self.db.query(LoyaltyPoint).filter(
            LoyaltyPoint.user_id == user_id
        ).first()
    
    def update_loyalty_balance(
        self,
        loyalty_point: LoyaltyPoint,
        points_change: int,
        transaction_type: LoyaltyTransactionType
    ) -> LoyaltyPoint:
        """
        Met à jour le solde de points d'un utilisateur.
        
        Args:
            loyalty_point: L'objet LoyaltyPoint à mettre à jour
            points_change: Le nombre de points (positif ou négatif)
            transaction_type: Type de transaction (earned, spent, expired)
        """
        # Mettre à jour le solde
        loyalty_point.balance += points_change
        
        # Mettre à jour les statistiques lifetime
        if transaction_type == LoyaltyTransactionType.EARNED:
            loyalty_point.lifetime_earned += points_change
        elif transaction_type == LoyaltyTransactionType.SPENT:
            loyalty_point.lifetime_spent += abs(points_change)
        
        self.db.flush()
        self.db.refresh(loyalty_point)
        return loyalty_point
    
    # ========================================================================
    # OPÉRATIONS CRUD - LOYALTYTRANSACTION
    # ========================================================================
    
    def create_loyalty_transaction(
        self,
        transaction_data: LoyaltyTransactionCreate
    ) -> LoyaltyTransaction:
        """Enregistre une transaction de points"""
        transaction = LoyaltyTransaction(**transaction_data.model_dump())
        self.db.add(transaction)
        self.db.flush()
        self.db.refresh(transaction)
        return transaction
    
    def get_user_loyalty_transactions(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[LoyaltyTransaction]:
        """Récupère l'historique des transactions de points d'un utilisateur"""
        return self.db.query(LoyaltyTransaction).filter(
            LoyaltyTransaction.user_id == user_id
        ).order_by(LoyaltyTransaction.created_at.desc()).offset(skip).limit(limit).all()
    
    # ========================================================================
    # OPÉRATIONS CRUD - REWARD
    # ========================================================================
    
    def create_reward(self, reward_data: RewardCreate) -> Reward:
        """Crée une nouvelle récompense"""
        reward = Reward(**reward_data.model_dump())
        self.db.add(reward)
        self.db.flush()
        self.db.refresh(reward)
        return reward
    
    def get_reward_by_id(self, reward_id: int) -> Optional[Reward]:
        """Récupère une récompense par son ID"""
        return self.db.query(Reward).filter(Reward.id == reward_id).first()
    
    def get_active_rewards(self, skip: int = 0, limit: int = 100) -> List[Reward]:
        """Récupère toutes les récompenses actives et disponibles"""
        return self.db.query(Reward).filter(
            and_(
                Reward.is_active,
                or_(
                    Reward.stock.is_(None),  # Stock illimité
                    Reward.stock > 0  # Stock disponible
                )
            )
        ).offset(skip).limit(limit).all()
    
    def update_reward(self, reward: Reward, reward_data: RewardUpdate) -> Reward:
        """Met à jour une récompense"""
        update_data = reward_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(reward, field, value)
        
        self.db.flush()
        self.db.refresh(reward)
        return reward
    
    def decrement_reward_stock(self, reward: Reward) -> Reward:
        """Décrémente le stock d'une récompense"""
        if reward.stock is not None:
            reward.stock -= 1
            self.db.flush()
            self.db.refresh(reward)
        return reward
    
    def delete_reward(self, reward: Reward) -> bool:
        """Supprime une récompense"""
        self.db.delete(reward)
        self.db.flush()
        return True
    
    # ========================================================================
    # OPÉRATIONS CRUD - REWARDREDEMPTION
    # ========================================================================
    
    def create_reward_redemption(
        self,
        redemption_data: RewardRedemptionCreate
    ) -> RewardRedemption:
        """Enregistre un échange de récompense"""
        redemption = RewardRedemption(**redemption_data.model_dump())
        self.db.add(redemption)
        self.db.flush()
        self.db.refresh(redemption)
        return redemption
    
    def get_user_reward_redemptions(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[RewardRedemption]:
        """Récupère l'historique des échanges de récompenses d'un utilisateur"""
        return self.db.query(RewardRedemption).filter(
            RewardRedemption.user_id == user_id
        ).order_by(RewardRedemption.redeemed_at.desc()).offset(skip).limit(limit).all()