from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey,
    Text, UniqueConstraint, func
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Wishlist(Base):
    """
    Liste de souhaits créée par un utilisateur.
    Une liste peut contenir plusieurs produits et peut être publique ou privée.
    Les listes publiques peuvent être partagées avec d'autres utilisateurs.
    """
    __tablename__ = "wishlists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Nom de la liste (ex: "Pour le weekend", "Cadeaux de Noël")
    name = Column(String(100), nullable=False)
    
    # Description optionnelle de la liste
    description = Column(Text, nullable=True)
    
    # Visibilité de la liste
    is_public = Column(Boolean, nullable=False, default=False)
    
    # Si la liste est publique, un slug peut être généré pour le partage
    slug = Column(String(150), nullable=True, unique=True, index=True)
    
    # Permet de trier les listes d'un utilisateur
    sort_order = Column(Integer, nullable=False, default=0)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="wishlists")
    items = relationship("WishlistItem", back_populates="wishlist", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Wishlist {self.name} (user_id={self.user_id})>"


class WishlistItem(Base):
    """
    Produit ajouté à une liste de souhaits.
    Garde trace de quand le produit a été ajouté et permet d'ajouter des notes.
    """
    __tablename__ = "wishlist_items"
    
    id = Column(Integer, primary_key=True, index=True)
    wishlist_id = Column(Integer, ForeignKey("wishlists.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    # Date d'ajout du produit à la liste
    added_at = Column(DateTime, nullable=False, server_default=func.now())
    
    # Notes personnelles sur le produit (ex: "Pour l'anniversaire de Marie")
    notes = Column(Text, nullable=True)
    
    # Quantité souhaitée (optionnel)
    desired_quantity = Column(Integer, nullable=True, default=1)
    
    # Ordre d'affichage dans la liste
    sort_order = Column(Integer, nullable=False, default=0)
    
    # Relations
    wishlist = relationship("Wishlist", back_populates="items")
    product = relationship("Product", back_populates="wishlist_items")
    
    # Contrainte d'unicité : un produit ne peut être qu'une seule fois dans une même liste
    __table_args__ = (
        UniqueConstraint('wishlist_id', 'product_id', name='uq_wishlist_product'),
    )
    
    def __repr__(self):
        return f"<WishlistItem wishlist_id={self.wishlist_id} product_id={self.product_id}>"


class ProductFollow(Base):
    """
    Suivi d'un produit par un utilisateur.
    Permet de recevoir des notifications sur les changements de stock ou de prix.
    """
    __tablename__ = "product_follows"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    # Options de notification
    notify_on_stock = Column(Boolean, nullable=False, default=True)  # Notifier quand revient en stock
    notify_on_price_drop = Column(Boolean, nullable=False, default=False)  # Notifier en cas de baisse de prix
    
    # Prix au moment du suivi (pour détecter les baisses)
    initial_price = Column(Integer, nullable=True)  # Stocké en centimes
    
    # Seuil de prix pour notification (optionnel)
    # L'utilisateur sera notifié si le prix descend en dessous de ce seuil
    price_threshold = Column(Integer, nullable=True)  # En centimes
    
    # Statut actif/inactif du suivi
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    last_notified_at = Column(DateTime, nullable=True)  # Dernière notification envoyée
    
    # Relations
    user = relationship("User", back_populates="product_follows")
    product = relationship("Product", back_populates="followers")
    
    # Contrainte d'unicité : un utilisateur ne peut suivre un produit qu'une seule fois
    __table_args__ = (
        UniqueConstraint('user_id', 'product_id', name='uq_user_product_follow'),
    )
    
    def __repr__(self):
        return f"<ProductFollow user_id={self.user_id} product_id={self.product_id}>"


class ProducerFollow(Base):
    """
    Suivi d'un producteur par un utilisateur.
    Permet de recevoir des notifications sur les nouveaux produits du producteur.
    """
    __tablename__ = "producer_follows"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # CORRECTION IMPORTANTE: Un producteur est un User, donc la relation pointe vers users.id
    producer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Option de notification
    notify_on_new_product = Column(Boolean, nullable=False, default=True)
    
    # Peut aussi notifier sur d'autres événements
    notify_on_promotion = Column(Boolean, nullable=False, default=False)  # Promotions du producteur
    notify_on_blog_post = Column(Boolean, nullable=False, default=False)  # Nouveaux articles de blog
    
    # Statut actif/inactif du suivi
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    last_notified_at = Column(DateTime, nullable=True)  # Dernière notification envoyée
    
    # Relations
    # L'utilisateur qui suit le producteur
    user = relationship("User", foreign_keys=[user_id], back_populates="producer_follows")
    
    # Le producteur suivi (qui est aussi un User)
    producer_user = relationship("User", foreign_keys=[producer_id], back_populates="producer_followers")
    
    # Contrainte d'unicité : un utilisateur ne peut suivre un producteur qu'une seule fois
    __table_args__ = (
        UniqueConstraint('user_id', 'producer_id', name='uq_user_producer_follow'),
    )
    
    def __repr__(self):
        return f"<ProducerFollow user_id={self.user_id} producer_id={self.producer_id}>"