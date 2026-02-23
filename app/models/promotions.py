from sqlalchemy import Column, Integer, String, Numeric, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


# ============================================================================
# Définition des types possibles
# ============================================================================

class CouponType(str, enum.Enum):
    """
    Types de coupons disponibles.
    - percentage : Réduction en pourcentage (ex: 10% de réduction)
    - fixed : Montant fixe de réduction (ex: 1000 XAF de réduction)
    - free_delivery : Livraison gratuite
    """
    PERCENTAGE = "percentage"
    FIXED = "fixed"
    FREE_DELIVERY = "free_delivery"


class PromotionType(str, enum.Enum):
    """
    Types de promotions produits.
    - flash_sale : Vente flash limitée dans le temps
    - bundle : Offre groupée (achetez plusieurs produits ensemble)
    - volume : Réduction selon la quantité achetée
    """
    FLASH_SALE = "flash_sale"
    BUNDLE = "bundle"
    VOLUME = "volume"


class LoyaltyTransactionType(str, enum.Enum):
    """
    Types de transactions de points de fidélité.
    - earned : Points gagnés (après un achat)
    - spent : Points dépensés (échange contre récompense)
    - expired : Points expirés (non utilisés dans le temps imparti)
    """
    EARNED = "earned"
    SPENT = "spent"
    EXPIRED = "expired"


class RewardType(str, enum.Enum):
    """
    Types de récompenses disponibles.
    - discount : Réduction en argent sur une prochaine commande
    - free_product : Produit gratuit
    """
    DISCOUNT = "discount"
    FREE_PRODUCT = "free_product"


# ============================================================================
# MODÈLE COUPON : Code promotionnel
# ============================================================================

class Coupon(Base):
    """
    Représente un code promotionnel utilisable par les clients.
    
    Un coupon peut être un pourcentage de réduction, un montant fixe,
    ou offrir la livraison gratuite. Il peut avoir des conditions
    d'utilisation (montant minimum, nombre d'utilisations limité).
    """
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    
    # Code du coupon (ex: "BIENVENUE10", "NOEL2025")
    code = Column(String(50), unique=True, nullable=False, index=True)
    
    # Type et valeur de la réduction
    type = Column(SQLEnum(CouponType), nullable=False)
    value = Column(Numeric(10, 2), nullable=False)  # Pourcentage ou montant fixe
    
    # Conditions d'utilisation
    min_order_amount = Column(Numeric(10, 2), nullable=True)  # Montant minimum de commande
    max_discount = Column(Numeric(10, 2), nullable=True)  # Plafond de réduction (pour les pourcentages)
    
    # Limites d'utilisation
    usage_limit = Column(Integer, nullable=True)  # Nombre max d'utilisations (null = illimité)
    used_count = Column(Integer, default=0, nullable=False)  # Nombre d'utilisations actuelles
    
    # Période de validité
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=False)
    
    # Statut
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    usages = relationship("CouponUsage", back_populates="coupon", cascade="all, delete-orphan")


# ============================================================================
# MODÈLE COUPONUSAGE : Historique d'utilisation des coupons
# ============================================================================

class CouponUsage(Base):
    """
    Enregistre chaque utilisation d'un coupon par un utilisateur.
    
    Permet de tracer qui a utilisé quel coupon, sur quelle commande,
    et quel montant de réduction a été appliqué.
    """
    __tablename__ = "coupon_usages"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références
    coupon_id = Column(Integer, ForeignKey("coupons.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    
    # Montant de la réduction appliquée
    discount_amount = Column(Numeric(10, 2), nullable=False)
    
    # Horodatage
    used_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    coupon = relationship("Coupon", back_populates="usages")
    user = relationship("User", back_populates="coupon_usages")
    order = relationship("Order", back_populates="coupon_usage")


# ============================================================================
# MODÈLE PROMOTION : Promotion sur produit
# ============================================================================

class Promotion(Base):
    """
    Représente une promotion appliquée directement à un produit.
    
    Les promotions produits sont différentes des coupons car elles
    s'appliquent automatiquement sans code à saisir. Elles peuvent
    être des ventes flash, des offres groupées, ou des réductions volume.
    """
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Produit concerné
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    
    # Type et valeur de la promotion
    type = Column(SQLEnum(PromotionType), nullable=False)
    discount_percentage = Column(Numeric(5, 2), nullable=False)  # Pourcentage de réduction
    
    # Période de validité
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    
    # Statut
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    product = relationship("Product", back_populates="promotions")


# ============================================================================
# MODÈLE LOYALTYPROGRAM : Programme de fidélité
# ============================================================================

class LoyaltyProgram(Base):
    """
    Définit les paramètres du programme de fidélité.
    
    Le programme détermine combien de points les clients gagnent
    pour chaque euro dépensé. Généralement, une plateforme n'a
    qu'un seul programme actif à la fois.
    """
    __tablename__ = "loyalty_programs"

    id = Column(Integer, primary_key=True, index=True)
    
    # Nom du programme (ex: "Programme Fidélité Or")
    name = Column(String(100), nullable=False)
    
    # Taux de conversion (ex: 1 point par euro dépensé)
    points_per_euro = Column(Numeric(5, 2), nullable=False)
    
    # Description du programme
    description = Column(Text, nullable=True)
    
    # Statut
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ============================================================================
# MODÈLE LOYALTYPOINT : Solde de points client
# ============================================================================

class LoyaltyPoint(Base):
    """
    Représente le solde de points de fidélité d'un client.
    
    Chaque utilisateur a un seul enregistrement qui suit son solde actuel,
    le total des points gagnés depuis toujours, et le total dépensé.
    """
    __tablename__ = "loyalty_points"

    id = Column(Integer, primary_key=True, index=True)
    
    # Utilisateur
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    
    # Solde actuel de points disponibles
    balance = Column(Integer, default=0, nullable=False)
    
    # Statistiques totales (depuis l'inscription)
    lifetime_earned = Column(Integer, default=0, nullable=False)  # Total gagné
    lifetime_spent = Column(Integer, default=0, nullable=False)  # Total dépensé
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="loyalty_points")


# ============================================================================
# MODÈLE LOYALTYTRANSACTION : Historique des transactions de points
# ============================================================================

class LoyaltyTransaction(Base):
    """
    Enregistre chaque mouvement de points de fidélité.
    
    Permet de tracer quand et comment les points ont été gagnés,
    dépensés ou expirés. Essentiel pour l'audit et la transparence.
    """
    __tablename__ = "loyalty_transactions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Utilisateur concerné
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Type et montant de la transaction
    type = Column(SQLEnum(LoyaltyTransactionType), nullable=False, index=True)
    points = Column(Integer, nullable=False)  # Positif pour earned, négatif pour spent/expired
    
    # Références optionnelles
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True, index=True)
    
    # Description de la transaction
    description = Column(Text, nullable=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    user = relationship("User", back_populates="loyalty_transactions")
    order = relationship("Order", back_populates="loyalty_transactions")


# ============================================================================
# MODÈLE REWARD : Récompense disponible
# ============================================================================

class Reward(Base):
    """
    Représente une récompense que les clients peuvent obtenir
    en échangeant leurs points de fidélité.
    
    Les récompenses peuvent être des réductions ou des produits gratuits.
    Elles ont un stock limité qui diminue à chaque échange.
    """
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    
    # Informations de base
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    
    # Coût en points
    points_cost = Column(Integer, nullable=False)
    
    # Type et valeur de la récompense
    type = Column(SQLEnum(RewardType), nullable=False)
    value = Column(Numeric(10, 2), nullable=False)  # Montant de réduction ou valeur du produit
    
    # Gestion du stock
    stock = Column(Integer, nullable=True)  # null = stock illimité
    
    # Statut
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    redemptions = relationship("RewardRedemption", back_populates="reward", cascade="all, delete-orphan")


# ============================================================================
# MODÈLE REWARDREDEMPTION : Utilisation de récompense
# ============================================================================

class RewardRedemption(Base):
    """
    Enregistre chaque échange de points contre une récompense.
    
    Permet de suivre qui a réclamé quelle récompense, quand,
    et sur quelle commande la récompense a été appliquée.
    """
    __tablename__ = "reward_redemptions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    reward_id = Column(Integer, ForeignKey("rewards.id"), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True, index=True)
    
    # Horodatage
    redeemed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    user = relationship("User", back_populates="reward_redemptions")
    reward = relationship("Reward", back_populates="redemptions")
    order = relationship("Order", back_populates="reward_redemption")