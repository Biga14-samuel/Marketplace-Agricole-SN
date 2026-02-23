from pydantic import BaseModel, Field, field_validator, ConfigDict
from datetime import datetime
from typing import Optional, List

from app.models.reviews import ReviewReportReason, ReviewReportStatus


# ============================================================================
# Avis produit
# ============================================================================

class ReviewBase(BaseModel):
    """Schéma de base pour un avis produit (champs communs)"""
    rating: int = Field(..., ge=1, le=5, description="Note de 1 à 5 étoiles")
    title: str = Field(..., min_length=5, max_length=200, description="Titre de l'avis")
    comment: str = Field(..., min_length=10, max_length=5000, description="Commentaire détaillé")
    images: Optional[List[str]] = Field(None, max_length=5, description="URLs des images (max 5)")
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        """Valide et nettoie le titre"""
        title = v.strip()
        if not title:
            raise ValueError("Le titre ne peut pas être vide")
        return title
    
    @field_validator('comment')
    @classmethod
    def validate_comment(cls, v):
        """Valide et nettoie le commentaire"""
        comment = v.strip()
        if not comment:
            raise ValueError("Le commentaire ne peut pas être vide")
        if len(comment) < 10:
            raise ValueError("Le commentaire doit contenir au moins 10 caractères")
        return comment
    
    @field_validator('images')
    @classmethod
    def validate_images(cls, v):
        """Valide les URLs des images"""
        if v is not None:
            if len(v) > 5:
                raise ValueError("Maximum 5 images autorisées")
            # Vérifier que ce sont des URLs valides
            for url in v:
                if not url.startswith(('http://', 'https://')):
                    raise ValueError(f"URL invalide : {url}")
        return v


class ReviewCreate(ReviewBase):
    """Schéma pour créer un nouvel avis produit"""
    product_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    order_id: int = Field(..., gt=0)


class ReviewUpdate(BaseModel):
    """Schéma pour mettre à jour un avis existant"""
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    comment: Optional[str] = Field(None, min_length=10, max_length=5000)
    images: Optional[List[str]] = Field(None, max_length=5)
    is_approved: Optional[bool] = None


class ReviewResponse(ReviewBase):
    """Schéma de réponse pour un avis produit"""
    id: int
    product_id: int
    user_id: int
    order_id: int
    verified_purchase: bool
    helpful_count: int
    is_approved: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS PRODUCERREVIEW : Avis producteur
# ============================================================================

class ProducerReviewBase(BaseModel):
    """Schéma de base pour un avis producteur (champs communs)"""
    rating: int = Field(..., ge=1, le=5, description="Note de 1 à 5 étoiles")
    comment: str = Field(..., min_length=10, max_length=2000, description="Commentaire sur le producteur")
    
    @field_validator('comment')
    @classmethod
    def validate_comment(cls, v):
        """Valide et nettoie le commentaire"""
        comment = v.strip()
        if not comment:
            raise ValueError("Le commentaire ne peut pas être vide")
        if len(comment) < 10:
            raise ValueError("Le commentaire doit contenir au moins 10 caractères")
        return comment


class ProducerReviewCreate(ProducerReviewBase):
    """Schéma pour créer un nouvel avis producteur"""
    producer_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    order_id: int = Field(..., gt=0)


class ProducerReviewResponse(BaseModel):
    """Schéma pour répondre à un avis producteur"""
    response: str = Field(..., min_length=10, max_length=2000, description="Réponse du producteur")
    
    @field_validator('response')
    @classmethod
    def validate_response(cls, v):
        """Valide et nettoie la réponse"""
        response = v.strip()
        if not response:
            raise ValueError("La réponse ne peut pas être vide")
        if len(response) < 10:
            raise ValueError("La réponse doit contenir au moins 10 caractères")
        return response


class ProducerReviewResponseModel(ProducerReviewBase):
    """Schéma de réponse pour un avis producteur"""
    id: int
    producer_id: int
    user_id: int
    order_id: int
    response: Optional[str] = None
    responded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS REVIEWHELPFUL : Vote d'utilité
# ============================================================================

class ReviewHelpfulBase(BaseModel):
    """Schéma de base pour un vote d'utilité"""
    review_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    is_helpful: bool


class ReviewHelpfulCreate(ReviewHelpfulBase):
    """Schéma pour créer un vote d'utilité"""
    pass


class ReviewHelpfulResponse(ReviewHelpfulBase):
    """Schéma de réponse pour un vote d'utilité"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS REVIEWREPORT : Signalement d'avis
# ============================================================================

class ReviewReportBase(BaseModel):
    """Schéma de base pour un signalement d'avis"""
    review_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    reason: ReviewReportReason


class ReviewReportCreate(ReviewReportBase):
    """Schéma pour créer un signalement d'avis"""
    pass


class ReviewReportUpdate(BaseModel):
    """Schéma pour mettre à jour le statut d'un signalement"""
    status: ReviewReportStatus


class ReviewReportResponse(ReviewReportBase):
    """Schéma de réponse pour un signalement d'avis"""
    id: int
    status: ReviewReportStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SCHÉMAS DE STATISTIQUES
# ============================================================================

class ProductRatingStats(BaseModel):
    """Statistiques des notes pour un produit"""
    product_id: int
    total_reviews: int
    average_rating: float
    rating_distribution: dict  # {1: count, 2: count, 3: count, 4: count, 5: count}
    verified_purchases_percentage: float


class ProducerRatingStats(BaseModel):
    """Statistiques des notes pour un producteur"""
    producer_id: int
    total_reviews: int
    average_rating: float
    response_rate: float  # Pourcentage d'avis avec réponse