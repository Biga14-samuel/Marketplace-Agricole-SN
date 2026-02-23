from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


# Table de liaison Many-to-Many pour User et Role
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    Column('assigned_at', DateTime, server_default=func.now())
)


class User(Base):
    """Modèle utilisateur principal"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations d'authentification
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    password_resets = relationship("PasswordReset", back_populates="user", cascade="all, delete-orphan")
    email_verifications = relationship("EmailVerification", back_populates="user", cascade="all, delete-orphan")
    login_history = relationship("LoginHistory", back_populates="user", cascade="all, delete-orphan")
    
    # Relations de paiement
    payment_methods = relationship("PaymentMethod", back_populates="user", cascade="all, delete-orphan")
    
    # Relations de promotion et fidélité
    coupon_usages = relationship("CouponUsage", back_populates="user", cascade="all, delete-orphan")
    loyalty_points = relationship("LoyaltyPoint", back_populates="user", uselist=False, cascade="all, delete-orphan")
    loyalty_transactions = relationship("LoyaltyTransaction", back_populates="user", cascade="all, delete-orphan")
    reward_redemptions = relationship("RewardRedemption", back_populates="user", cascade="all, delete-orphan")
    
    # Relations d'avis
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    producer_reviews = relationship("ProducerReview", back_populates="user", cascade="all, delete-orphan")
    review_votes = relationship("ReviewHelpful", back_populates="user", cascade="all, delete-orphan")
    review_reports = relationship("ReviewReport", back_populates="user", cascade="all, delete-orphan")
    
    # Relations de wishlist
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")
    product_follows = relationship("ProductFollow", back_populates="user", cascade="all, delete-orphan")
    
    # Relations de suivi de producteur (en tant que follower)
    producer_follows = relationship(
        "ProducerFollow", 
        foreign_keys="ProducerFollow.user_id", 
        back_populates="user", 
        cascade="all, delete-orphan"
    )
    
    # Relations de suivi de producteur (en tant que producteur suivi)
    # Ceci permet aux producteurs de voir qui les suit
    producer_followers = relationship(
        "ProducerFollow", 
        foreign_keys="ProducerFollow.producer_id", 
        back_populates="producer_user",
        cascade="all, delete-orphan"
    )
    
    # Relations d'administration
    admin_actions = relationship("AdminAction", back_populates="admin", cascade="all, delete-orphan")
    ban_record = relationship("BannedUser", foreign_keys="BannedUser.user_id", back_populates="user", uselist=False)
    system_settings_updated = relationship("SystemSetting", back_populates="updater")
    
    # Relations de commission (pour les producteurs)
    commissions = relationship("Commission", foreign_keys="Commission.producer_id", back_populates="producer")
    
    # Relations de livraison - En tant que producteur
    delivery_zones = relationship(
        "DeliveryZone", 
        foreign_keys="DeliveryZone.producer_id",
        back_populates="producer", 
        cascade="all, delete-orphan"
    )
    
    # Relations de livraison - En tant que livreur
    deliveries_as_driver = relationship(
        "Delivery", 
        foreign_keys="Delivery.driver_id",
        back_populates="driver", 
        cascade="all, delete-orphan"
    )
    
    delivery_routes = relationship(
        "DeliveryRoute", 
        foreign_keys="DeliveryRoute.driver_id",
        back_populates="driver", 
        cascade="all, delete-orphan"
    )
    
    driver_profile = relationship(
        "DeliveryDriver", 
        back_populates="user", 
        uselist=False, 
        cascade="all, delete-orphan"
    )

    @property
    def role(self) -> str:
        """Retourne le nom du premier rôle de l'utilisateur, ou 'customer' par défaut"""
        if self.roles:
            return self.roles[0].name
        return "Customer"
    
    def has_role(self, role_name: str) -> bool:
        """Vérifie si l'utilisateur a un rôle spécifique"""
        expected = (role_name or "").strip().lower()
        return any((role.name or "").strip().lower() == expected for role in self.roles)
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"


class Role(Base):
    """Modèle de rôles système"""
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    users = relationship("User", secondary=user_roles, back_populates="roles")

    def __repr__(self):
        return f"<Role(id={self.id}, name='{self.name}')>"


class RefreshToken(Base):
    """Modèle pour les tokens de rafraîchissement JWT"""
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(500), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    user = relationship("User", back_populates="refresh_tokens")

    def __repr__(self):
        return f"<RefreshToken(id={self.id}, user_id={self.user_id}, revoked={self.revoked})>"


class PasswordReset(Base):
    """Modèle pour la réinitialisation de mot de passe"""
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(500), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    user = relationship("User", back_populates="password_resets")

    def __repr__(self):
        return f"<PasswordReset(id={self.id}, user_id={self.user_id}, used={self.used})>"


class EmailVerification(Base):
    """Modèle pour la vérification d'email"""
    __tablename__ = "email_verifications"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(500), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=False)

    # Relations
    user = relationship("User", back_populates="email_verifications")

    def __repr__(self):
        return f"<EmailVerification(id={self.id}, user_id={self.user_id}, verified={self.verified_at is not None})>"


class LoginHistory(Base):
    """Modèle pour l'historique des connexions"""
    __tablename__ = "login_history"

    id = Column(Integer, primary_key=True, index=True, nullable=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 max length
    user_agent = Column(Text, nullable=True)
    login_at = Column(DateTime, server_default=func.now(), nullable=False)
    success = Column(Boolean, nullable=False)
    failure_reason = Column(String(255), nullable=True)

    # Relations
    user = relationship("User", back_populates="login_history")

    def __repr__(self):
        return f"<LoginHistory(id={self.id}, user_id={self.user_id}, success={self.success})>"
