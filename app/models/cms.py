from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


# ============= Enums =============

class FAQCategory(str, enum.Enum):
    """Catégories de FAQ"""
    GENERAL = "general"
    COMMANDES = "commandes"
    LIVRAISON = "livraison"
    PAIEMENT = "paiement"
    PRODUITS = "produits"
    COMPTE = "compte"
    ABONNEMENTS = "abonnements"
    RETOURS = "retours"
    AUTRE = "autre"


# ============= Models =============

class Page(Base):
    """Pages statiques du site"""
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    meta_description = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=False, nullable=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Page(id={self.id}, title='{self.title}', slug='{self.slug}')>"


class FAQ(Base):
    """Questions fréquentes"""
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(SQLEnum(FAQCategory), nullable=False, index=True)
    question = Column(String(500), nullable=False)
    answer = Column(Text, nullable=False)
    position = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<FAQ(id={self.id}, category='{self.category}', question='{self.question[:50]}...')>"


class BlogPost(Base):
    """Articles de blog"""
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)  # Résumé de l'article
    featured_image = Column(String(500), nullable=True)  # URL de l'image
    tags = Column(String(500), nullable=True)  # Tags séparés par des virgules
    views = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    author = relationship("User", foreign_keys=[author_id])

    def __repr__(self):
        return f"<BlogPost(id={self.id}, title='{self.title}', slug='{self.slug}')>"


class Testimonial(Base):
    """Témoignages clients"""
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)  # Note de 1 à 5
    is_featured = Column(Boolean, default=False, nullable=False)
    is_approved = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    user = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        return f"<Testimonial(id={self.id}, user_id={self.user_id}, rating={self.rating})>"
