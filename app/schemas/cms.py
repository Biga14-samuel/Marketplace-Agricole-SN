from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.cms import FAQCategory


# ============= Page Schemas =============

class PageBase(BaseModel):
    """Schéma de base pour une page"""
    title: str = Field(..., min_length=1, max_length=255, description="Titre de la page")
    slug: Optional[str] = Field(None, max_length=255, description="Slug unique (généré automatiquement si non fourni)")
    content: str = Field(..., description="Contenu de la page")
    meta_description: Optional[str] = Field(None, max_length=500, description="Description pour le SEO")
    is_published: bool = Field(default=False, description="Page publiée ou non")


class PageCreate(PageBase):
    """Schéma pour créer une page"""
    pass


class PageUpdate(BaseModel):
    """Schéma pour mettre à jour une page"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    meta_description: Optional[str] = Field(None, max_length=500)
    is_published: Optional[bool] = None


class PageResponse(PageBase):
    """Schéma de réponse pour une page"""
    id: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============= FAQ Schemas =============

class FAQBase(BaseModel):
    """Schéma de base pour une FAQ"""
    category: FAQCategory = Field(..., description="Catégorie de la FAQ")
    question: str = Field(..., min_length=1, max_length=500, description="Question")
    answer: str = Field(..., description="Réponse")
    position: int = Field(default=0, ge=0, description="Position d'affichage")
    is_published: bool = Field(default=False, description="FAQ publiée ou non")


class FAQCreate(FAQBase):
    """Schéma pour créer une FAQ"""
    pass


class FAQUpdate(BaseModel):
    """Schéma pour mettre à jour une FAQ"""
    category: Optional[FAQCategory] = None
    question: Optional[str] = Field(None, min_length=1, max_length=500)
    answer: Optional[str] = None
    position: Optional[int] = Field(None, ge=0)
    is_published: Optional[bool] = None


class FAQResponse(FAQBase):
    """Schéma de réponse pour une FAQ"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============= BlogPost Schemas =============

class BlogPostBase(BaseModel):
    """Schéma de base pour un article de blog"""
    title: str = Field(..., min_length=1, max_length=255, description="Titre de l'article")
    slug: Optional[str] = Field(None, max_length=255, description="Slug unique (généré automatiquement si non fourni)")
    content: str = Field(..., description="Contenu de l'article")
    excerpt: Optional[str] = Field(None, description="Résumé de l'article")
    featured_image: Optional[str] = Field(None, max_length=500, description="URL de l'image mise en avant")
    tags: Optional[str] = Field(None, max_length=500, description="Tags séparés par des virgules")
    is_published: bool = Field(default=False, description="Article publié ou non")


class BlogPostCreate(BlogPostBase):
    """Schéma pour créer un article"""
    pass


class BlogPostUpdate(BaseModel):
    """Schéma pour mettre à jour un article"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = Field(None, max_length=500)
    tags: Optional[str] = Field(None, max_length=500)
    is_published: Optional[bool] = None


class BlogPostResponse(BlogPostBase):
    """Schéma de réponse pour un article"""
    id: int
    author_id: Optional[int] = None
    views: int = 0
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class BlogPostWithAuthor(BlogPostResponse):
    """Schéma de réponse avec les informations de l'auteur"""
    author_email: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============= Testimonial Schemas =============

class TestimonialBase(BaseModel):
    """Schéma de base pour un témoignage"""
    content: str = Field(..., min_length=1, description="Contenu du témoignage")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Note de 1 à 5")
    is_featured: bool = Field(default=False, description="Témoignage mis en avant")
    is_approved: bool = Field(default=False, description="Témoignage approuvé")


class TestimonialCreate(TestimonialBase):
    """Schéma pour créer un témoignage"""
    pass


class TestimonialUpdate(BaseModel):
    """Schéma pour mettre à jour un témoignage"""
    content: Optional[str] = Field(None, min_length=1)
    rating: Optional[int] = Field(None, ge=1, le=5)
    is_featured: Optional[bool] = None
    is_approved: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    """Schéma de réponse pour un témoignage"""
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TestimonialWithUser(TestimonialResponse):
    """Schéma de réponse avec les informations de l'utilisateur"""
    user_email: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
