from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from typing import List, Optional
from datetime import datetime, timezone

from app.models.reviews import (
    Review, ProducerReview, ReviewHelpful, ReviewReport,
    ReviewReportStatus
)
from app.schemas.reviews import (
    ReviewCreate, ReviewUpdate,
    ProducerReviewCreate,
    ReviewHelpfulCreate,
    ReviewReportCreate, ReviewReportUpdate
)


class ReviewRepository:
    """
    Repository pour gérer les opérations CRUD sur toutes les entités
    du module Avis & Confiance.
    
    Rappel architecture :
    - Repository utilise flush() pour obtenir les IDs sans valider la transaction
    - Le Service appelant utilisera commit() pour valider l'ensemble
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    # ========================================================================
    # OPÉRATIONS CRUD - REVIEW (Avis produit)
    # ========================================================================
    
    def create_review(self, review_data: ReviewCreate) -> Review:
        """Crée un nouvel avis produit"""
        review = Review(**review_data.model_dump())
        self.db.add(review)
        self.db.flush()
        self.db.refresh(review)
        return review
    
    def get_review_by_id(self, review_id: int) -> Optional[Review]:
        """Récupère un avis par son ID"""
        return self.db.query(Review).filter(Review.id == review_id).first()
    
    def get_product_reviews(
        self,
        product_id: int,
        approved_only: bool = True,
        skip: int = 0,
        limit: int = 100
    ) -> List[Review]:
        """Récupère tous les avis d'un produit"""
        query = self.db.query(Review).filter(Review.product_id == product_id)
        
        if approved_only:
            query = query.filter(Review.is_approved == True)
        
        return query.order_by(desc(Review.created_at)).offset(skip).limit(limit).all()
    
    def get_user_reviews(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Review]:
        """Récupère tous les avis laissés par un utilisateur"""
        return self.db.query(Review).filter(
            Review.user_id == user_id
        ).order_by(desc(Review.created_at)).offset(skip).limit(limit).all()
    
    def get_review_by_user_and_order(self, user_id: int, order_id: int) -> Optional[Review]:
        """Vérifie si un utilisateur a déjà laissé un avis pour une commande donnée"""
        return self.db.query(Review).filter(
            and_(
                Review.user_id == user_id,
                Review.order_id == order_id
            )
        ).first()
    
    def update_review(self, review: Review, review_data: ReviewUpdate) -> Review:
        """Met à jour un avis existant"""
        update_data = review_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(review, field, value)
        
        self.db.flush()
        self.db.refresh(review)
        return review
    
    def delete_review(self, review: Review) -> bool:
        """Supprime un avis"""
        self.db.delete(review)
        self.db.flush()
        return True
    
    def increment_helpful_count(self, review: Review) -> Review:
        """Incrémente le compteur de votes utiles"""
        review.helpful_count += 1
        self.db.flush()
        self.db.refresh(review)
        return review
    
    def decrement_helpful_count(self, review: Review) -> Review:
        """Décrémente le compteur de votes utiles"""
        if review.helpful_count > 0:
            review.helpful_count -= 1
        self.db.flush()
        self.db.refresh(review)
        return review
    
    def get_product_rating_stats(self, product_id: int) -> dict:
        """
        Calcule les statistiques de notation pour un produit.
        
        Retourne :
        - Nombre total d'avis
        - Note moyenne
        - Distribution des notes (combien d'avis pour chaque étoile)
        - Pourcentage d'achats vérifiés
        """
        # Récupérer tous les avis approuvés du produit
        reviews = self.db.query(Review).filter(
            and_(
                Review.product_id == product_id,
                Review.is_approved == True
            )
        ).all()
        
        if not reviews:
            return {
                "total_reviews": 0,
                "average_rating": 0.0,
                "rating_distribution": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
                "verified_purchases_percentage": 0.0
            }
        
        # Calculer les statistiques
        total_reviews = len(reviews)
        average_rating = sum(r.rating for r in reviews) / total_reviews
        
        # Distribution des notes
        rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for review in reviews:
            rating_distribution[review.rating] += 1
        
        # Pourcentage d'achats vérifiés
        verified_count = sum(1 for r in reviews if r.verified_purchase)
        verified_percentage = (verified_count / total_reviews) * 100 if total_reviews > 0 else 0
        
        return {
            "total_reviews": total_reviews,
            "average_rating": round(average_rating, 2),
            "rating_distribution": rating_distribution,
            "verified_purchases_percentage": round(verified_percentage, 2)
        }
    
    # ========================================================================
    # OPÉRATIONS CRUD - PRODUCERREVIEW (Avis producteur)
    # ========================================================================
    
    def create_producer_review(self, review_data: ProducerReviewCreate) -> ProducerReview:
        """Crée un nouvel avis producteur"""
        review = ProducerReview(**review_data.model_dump())
        self.db.add(review)
        self.db.flush()
        self.db.refresh(review)
        return review
    
    def get_producer_review_by_id(self, review_id: int) -> Optional[ProducerReview]:
        """Récupère un avis producteur par son ID"""
        return self.db.query(ProducerReview).filter(
            ProducerReview.id == review_id
        ).first()
    
    def get_producer_reviews(
        self,
        producer_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[ProducerReview]:
        """Récupère tous les avis d'un producteur"""
        return self.db.query(ProducerReview).filter(
            ProducerReview.producer_id == producer_id
        ).order_by(desc(ProducerReview.created_at)).offset(skip).limit(limit).all()
    
    def get_producer_review_by_user_and_order(
        self,
        user_id: int,
        order_id: int
    ) -> Optional[ProducerReview]:
        """Vérifie si un utilisateur a déjà laissé un avis producteur pour une commande"""
        return self.db.query(ProducerReview).filter(
            and_(
                ProducerReview.user_id == user_id,
                ProducerReview.order_id == order_id
            )
        ).first()
    
    def add_producer_response(
        self,
        review: ProducerReview,
        response: str
    ) -> ProducerReview:
        """Ajoute la réponse du producteur à un avis"""
        # Import déplacé en haut du fichier (ligne 4)
        review.response = response
        review.responded_at = datetime.now(timezone.utc)
        self.db.flush()
        self.db.refresh(review)
        return review
    
    def get_producer_rating_stats(self, producer_id: int) -> dict:
        """
        Calcule les statistiques de notation pour un producteur.
        
        Retourne :
        - Nombre total d'avis
        - Note moyenne
        - Taux de réponse (pourcentage d'avis avec réponse du producteur)
        """
        reviews = self.db.query(ProducerReview).filter(
            ProducerReview.producer_id == producer_id
        ).all()
        
        if not reviews:
            return {
                "total_reviews": 0,
                "average_rating": 0.0,
                "response_rate": 0.0
            }
        
        total_reviews = len(reviews)
        average_rating = sum(r.rating for r in reviews) / total_reviews
        
        # Calculer le taux de réponse
        responses_count = sum(1 for r in reviews if r.response is not None)
        response_rate = (responses_count / total_reviews) * 100 if total_reviews > 0 else 0
        
        return {
            "total_reviews": total_reviews,
            "average_rating": round(average_rating, 2),
            "response_rate": round(response_rate, 2)
        }
    
    # ========================================================================
    # OPÉRATIONS CRUD - REVIEWHELPFUL (Votes d'utilité)
    # ========================================================================
    
    def create_helpful_vote(self, vote_data: ReviewHelpfulCreate) -> ReviewHelpful:
        """Enregistre un vote d'utilité sur un avis"""
        vote = ReviewHelpful(**vote_data.model_dump())
        self.db.add(vote)
        self.db.flush()
        self.db.refresh(vote)
        return vote
    
    def get_user_vote_on_review(self, user_id: int, review_id: int) -> Optional[ReviewHelpful]:
        """Vérifie si un utilisateur a déjà voté sur un avis"""
        return self.db.query(ReviewHelpful).filter(
            and_(
                ReviewHelpful.user_id == user_id,
                ReviewHelpful.review_id == review_id
            )
        ).first()
    
    def delete_helpful_vote(self, vote: ReviewHelpful) -> bool:
        """Supprime un vote d'utilité"""
        self.db.delete(vote)
        self.db.flush()
        return True
    
    # ========================================================================
    # OPÉRATIONS CRUD - REVIEWREPORT (Signalements)
    # ========================================================================
    
    def create_review_report(self, report_data: ReviewReportCreate) -> ReviewReport:
        """Crée un signalement d'avis"""
        report = ReviewReport(**report_data.model_dump())
        self.db.add(report)
        self.db.flush()
        self.db.refresh(report)
        return report
    
    def get_report_by_id(self, report_id: int) -> Optional[ReviewReport]:
        """Récupère un signalement par son ID"""
        return self.db.query(ReviewReport).filter(
            ReviewReport.id == report_id
        ).first()
    
    def get_pending_reports(self, skip: int = 0, limit: int = 100) -> List[ReviewReport]:
        """Récupère tous les signalements en attente de traitement"""
        return self.db.query(ReviewReport).filter(
            ReviewReport.status == ReviewReportStatus.PENDING
        ).order_by(desc(ReviewReport.created_at)).offset(skip).limit(limit).all()
    
    def get_review_reports(self, review_id: int) -> List[ReviewReport]:
        """Récupère tous les signalements d'un avis spécifique"""
        return self.db.query(ReviewReport).filter(
            ReviewReport.review_id == review_id
        ).order_by(desc(ReviewReport.created_at)).all()
    
    def update_report_status(
        self,
        report: ReviewReport,
        report_data: ReviewReportUpdate
    ) -> ReviewReport:
        """Met à jour le statut d'un signalement"""
        update_data = report_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(report, field, value)
        
        self.db.flush()
        self.db.refresh(report)
        return report
    
    def check_user_reported_review(self, user_id: int, review_id: int) -> bool:
        """Vérifie si un utilisateur a déjà signalé un avis"""
        report = self.db.query(ReviewReport).filter(
            and_(
                ReviewReport.user_id == user_id,
                ReviewReport.review_id == review_id
            )
        ).first()
        return report is not None