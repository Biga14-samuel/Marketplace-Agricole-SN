from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


# ============================================================================
# Définition des statuts et raisons possibles
# ============================================================================

class ReviewReportReason(str, enum.Enum):
    """
    Raisons possibles pour signaler un avis.
    Ces raisons permettent de catégoriser les signalements pour faciliter la modération.
    """
    SPAM = "spam"  # Avis publicitaire ou répétitif
    OFFENSIVE = "offensive"  # Contenu offensant ou inapproprié
    FAKE = "fake"  # Avis frauduleux ou faux
    IRRELEVANT = "irrelevant"  # Avis hors sujet
    OTHER = "other"  # Autre raison


class ReviewReportStatus(str, enum.Enum):
    """
    Statuts d'un signalement d'avis.
    Permet de suivre le traitement des signalements par les modérateurs.
    """
    PENDING = "pending"  # En attente de traitement
    REVIEWED = "reviewed"  # Examiné par un modérateur
    APPROVED = "approved"  # Signalement validé, avis retiré ou sanctionné
    REJECTED = "rejected"  # Signalement non fondé


# ============================================================================
# MODÈLE REVIEW : Avis sur un produit
# ============================================================================

class Review(Base):
    """
    Représente un avis laissé par un client sur un produit acheté.
    
    Les avis sont essentiels pour aider les futurs acheteurs à prendre
    des décisions éclairées. Ils incluent une note sur 5, un titre,
    un commentaire détaillé, et optionnellement des images.
    """
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références vers les entités liées
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    
    # Contenu de l'avis
    rating = Column(Integer, nullable=False)  # Note de 1 à 5 étoiles
    title = Column(String(200), nullable=False)  # Titre court et accrocheur
    comment = Column(Text, nullable=False)  # Commentaire détaillé
    
    # Images optionnelles jointes à l'avis (URLs stockées en JSON)
    # Exemple : ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    images = Column(JSON, nullable=True)
    
    # Indicateur d'achat vérifié
    # True si l'avis provient d'une commande réellement livrée
    verified_purchase = Column(Boolean, default=False, nullable=False)
    
    # Compteur de votes "utile"
    # Ce nombre augmente quand d'autres utilisateurs trouvent l'avis pertinent
    helpful_count = Column(Integer, default=0, nullable=False)
    
    # Modération
    # Les avis peuvent nécessiter une approbation avant d'être visibles publiquement
    is_approved = Column(Boolean, default=True, nullable=False)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    order = relationship("Order", back_populates="review")
    helpful_votes = relationship("ReviewHelpful", back_populates="review", cascade="all, delete-orphan")
    reports = relationship("ReviewReport", back_populates="review", cascade="all, delete-orphan")


# ============================================================================
# MODÈLE PRODUCERREVIEW : Avis sur un producteur
# ============================================================================

class ProducerReview(Base):
    """
    Représente un avis laissé par un client sur un producteur.
    
    Contrairement aux avis produits qui évaluent la qualité d'un article,
    les avis producteurs évaluent le service, la communication, et
    l'expérience globale avec un vendeur. Le producteur peut répondre
    pour maintenir le dialogue avec ses clients.
    """
    __tablename__ = "producer_reviews"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références vers les entités liées
    producer_id = Column(Integer, ForeignKey('producer_profiles.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    
    # Contenu de l'avis
    rating = Column(Integer, nullable=False)  # Note de 1 à 5 étoiles
    comment = Column(Text, nullable=False)  # Commentaire sur l'expérience
    
    # Réponse du producteur
    # Le producteur peut répondre aux avis pour expliquer, remercier, ou résoudre un problème
    response = Column(Text, nullable=True)
    responded_at = Column(DateTime, nullable=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    producer = relationship("ProducerProfile", back_populates="reviews")
    user = relationship("User", back_populates="producer_reviews")
    order = relationship("Order", back_populates="producer_review")


# ============================================================================
# Vote d'utilité sur un avis
# ============================================================================

class ReviewHelpful(Base):
    """
    Enregistre les votes d'utilité sur les avis produits.
    
    Permet aux utilisateurs d'indiquer si un avis leur a été utile
    dans leur décision d'achat. Les avis avec beaucoup de votes positifs
    sont mis en avant pour aider les futurs acheteurs.
    """
    __tablename__ = "review_helpful"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Type de vote
    # True = l'avis est utile, False = l'avis n'est pas utile
    is_helpful = Column(Boolean, nullable=False)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    review = relationship("Review", back_populates="helpful_votes")
    user = relationship("User", back_populates="review_votes")


# ============================================================================
# MODÈLE REVIEWREPORT : Signalement d'avis inapproprié
# ============================================================================

class ReviewReport(Base):
    """
    Enregistre les signalements d'avis inappropriés ou frauduleux.
    
    Les utilisateurs peuvent signaler les avis qui violent les règles
    de la communauté. Ces signalements sont ensuite examinés par les
    modérateurs qui décident de l'action appropriée à prendre.
    """
    __tablename__ = "review_reports"

    id = Column(Integer, primary_key=True, index=True)
    
    # Références
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Raison et statut du signalement
    reason = Column(SQLEnum(ReviewReportReason), nullable=False)
    status = Column(SQLEnum(ReviewReportStatus), default=ReviewReportStatus.PENDING, nullable=False, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relations
    review = relationship("Review", back_populates="reports")
    user = relationship("User", back_populates="review_reports")