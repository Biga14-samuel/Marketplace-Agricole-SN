from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status

from app.repositories.review_repository import ReviewRepository
from app.models.orders import Order, OrderStatus
from app.schemas.reviews import (
    ReviewCreate, ReviewUpdate, ReviewResponse,
    ProducerReviewCreate, ProducerReviewResponse, ProducerReviewResponseModel,
    ReviewHelpfulCreate, ReviewHelpfulResponse,
    ReviewReportCreate, ReviewReportUpdate, ReviewReportResponse,
    ProductRatingStats, ProducerRatingStats
)


class ReviewService:
    """
    Service gérant toute la logique métier des avis et de la confiance.
    
    Architecture de transaction :
    - Le Repository utilise flush() pour obtenir les IDs
    - Le Service utilise commit() pour valider les transactions atomiques
    - En cas d'erreur, le rollback est automatique
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = ReviewRepository(db)
    
    # ========================================================================
    # LOGIQUE MÉTIER - REVIEW (Avis produit)
    # ========================================================================
    
    def create_review(self, review_data: ReviewCreate) -> ReviewResponse:
        """
        Crée un nouvel avis produit avec vérifications strictes.
        
        Vérifie que :
        - La commande existe et appartient à l'utilisateur
        - La commande a été livrée (pour garantir un achat vérifié)
        - L'utilisateur n'a pas déjà laissé un avis pour cette commande
        """
        try:
            # Vérifier que la commande existe
            order = self.db.query(Order).filter(Order.id == review_data.order_id).first()
            if not order:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Commande {review_data.order_id} non trouvée"
                )
            
            # Vérifier que la commande appartient à l'utilisateur
            if order.user_id != review_data.user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Cette commande ne vous appartient pas"
                )
            
            # Vérifier que la commande a été livrée
            # Seuls les achats vérifiés peuvent laisser des avis
            if order.status != OrderStatus.DELIVERED:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous ne pouvez laisser un avis que pour une commande livrée"
                )
            
            # Vérifier que l'utilisateur n'a pas déjà laissé un avis
            existing_review = self.repository.get_review_by_user_and_order(
                review_data.user_id,
                review_data.order_id
            )
            
            if existing_review:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous avez déjà laissé un avis pour cette commande"
                )
            
            # Créer l'avis avec le flag verified_purchase à True
            review = self.repository.create_review(review_data)
            review.verified_purchase = True  # Automatiquement vérifié car commande livrée
            
            self.db.commit()
            self.db.refresh(review)
            
            return ReviewResponse.model_validate(review)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création de l'avis : {str(e)}"
            )
    
    def get_review(self, review_id: int) -> ReviewResponse:
        """Récupère un avis par son ID"""
        review = self.repository.get_review_by_id(review_id)
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Avis {review_id} non trouvé"
            )
        return ReviewResponse.model_validate(review)
    
    def get_product_reviews(
        self,
        product_id: int,
        approved_only: bool = True,
        skip: int = 0,
        limit: int = 100
    ) -> List[ReviewResponse]:
        """
        Récupère tous les avis d'un produit.
        
        Par défaut, seuls les avis approuvés sont retournés pour
        garantir la qualité du contenu affiché publiquement.
        """
        reviews = self.repository.get_product_reviews(
            product_id,
            approved_only,
            skip,
            limit
        )
        return [ReviewResponse.model_validate(r) for r in reviews]
    
    def get_user_reviews(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[ReviewResponse]:
        """Récupère tous les avis laissés par un utilisateur"""
        reviews = self.repository.get_user_reviews(user_id, skip, limit)
        return [ReviewResponse.model_validate(r) for r in reviews]
    
    def update_review(
        self,
        review_id: int,
        review_data: ReviewUpdate,
        user_id: int
    ) -> ReviewResponse:
        """
        Met à jour un avis existant.
        
        Seul l'auteur de l'avis peut le modifier.
        Les modérateurs peuvent changer le statut d'approbation.
        """
        try:
            review = self.repository.get_review_by_id(review_id)
            if not review:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Avis {review_id} non trouvé"
                )
            
            # Vérifier que l'utilisateur est bien l'auteur
            # (sauf si c'est une mise à jour du statut d'approbation par un admin)
            if review_data.is_approved is None and review.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Vous ne pouvez modifier que vos propres avis"
                )
            
            review = self.repository.update_review(review, review_data)
            
            self.db.commit()
            self.db.refresh(review)
            
            return ReviewResponse.model_validate(review)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la mise à jour : {str(e)}"
            )
    
    def delete_review(self, review_id: int, user_id: int) -> bool:
        """
        Supprime un avis.
        
        Seul l'auteur peut supprimer son propre avis.
        """
        try:
            review = self.repository.get_review_by_id(review_id)
            if not review:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Avis {review_id} non trouvé"
                )
            
            # Vérifier que l'utilisateur est bien l'auteur
            if review.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Vous ne pouvez supprimer que vos propres avis"
                )
            
            self.repository.delete_review(review)
            
            self.db.commit()
            return True
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la suppression : {str(e)}"
            )
    
    def get_product_stats(self, product_id: int) -> ProductRatingStats:
        """
        Calcule et retourne les statistiques complètes d'un produit.
        
        Ces statistiques sont essentielles pour afficher sur la fiche produit
        des informations comme la note moyenne, le nombre total d'avis,
        et la distribution des notes (combien de 5 étoiles, 4 étoiles, etc.).
        """
        stats = self.repository.get_product_rating_stats(product_id)
        
        return ProductRatingStats(
            product_id=product_id,
            total_reviews=stats["total_reviews"],
            average_rating=stats["average_rating"],
            rating_distribution=stats["rating_distribution"],
            verified_purchases_percentage=stats["verified_purchases_percentage"]
        )
    
    # ========================================================================
    # LOGIQUE MÉTIER - PRODUCERREVIEW (Avis producteur)
    # ========================================================================
    
    def create_producer_review(
        self,
        review_data: ProducerReviewCreate
    ) -> ProducerReviewResponseModel:
        """
        Crée un nouvel avis sur un producteur.
        
        Vérifie que l'utilisateur a bien commandé chez ce producteur
        et que la commande a été livrée.
        """
        try:
            # Vérifier que la commande existe
            order = self.db.query(Order).filter(Order.id == review_data.order_id).first()
            if not order:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Commande {review_data.order_id} non trouvée"
                )
            
            # Vérifier que la commande appartient à l'utilisateur
            if order.user_id != review_data.user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Cette commande ne vous appartient pas"
                )
            
            # Vérifier que la commande a été livrée
            if order.status != OrderStatus.DELIVERED:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous ne pouvez évaluer le producteur que pour une commande livrée"
                )
            
            # Vérifier que l'utilisateur n'a pas déjà laissé un avis producteur
            existing_review = self.repository.get_producer_review_by_user_and_order(
                review_data.user_id,
                review_data.order_id
            )
            
            if existing_review:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous avez déjà évalué ce producteur pour cette commande"
                )
            
            # Créer l'avis
            review = self.repository.create_producer_review(review_data)
            
            self.db.commit()
            self.db.refresh(review)
            
            return ProducerReviewResponseModel.model_validate(review)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création de l'avis : {str(e)}"
            )
    
    def get_producer_reviews(
        self,
        producer_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[ProducerReviewResponseModel]:
        """Récupère tous les avis d'un producteur"""
        reviews = self.repository.get_producer_reviews(producer_id, skip, limit)
        return [ProducerReviewResponseModel.model_validate(r) for r in reviews]
    
    def respond_to_review(
        self,
        review_id: int,
        response_data: ProducerReviewResponse,
        producer_id: int
    ) -> ProducerReviewResponseModel:
        """
        Permet au producteur de répondre à un avis.
        
        Seul le producteur concerné peut répondre à un avis le concernant.
        Cette fonctionnalité est cruciale pour maintenir le dialogue avec les clients.
        """
        try:
            review = self.repository.get_producer_review_by_id(review_id)
            if not review:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Avis {review_id} non trouvé"
                )
            
            # Vérifier que le producteur est bien concerné par cet avis
            if review.producer_id != producer_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Vous ne pouvez répondre qu'aux avis vous concernant"
                )
            
            # Ajouter la réponse
            review = self.repository.add_producer_response(review, response_data.response)
            
            self.db.commit()
            self.db.refresh(review)
            
            return ProducerReviewResponseModel.model_validate(review)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de l'ajout de la réponse : {str(e)}"
            )
    
    def get_producer_stats(self, producer_id: int) -> ProducerRatingStats:
        """
        Calcule les statistiques d'un producteur.
        
        Inclut le taux de réponse, qui est un indicateur important
        du niveau d'engagement du producteur envers ses clients.
        """
        stats = self.repository.get_producer_rating_stats(producer_id)
        
        return ProducerRatingStats(
            producer_id=producer_id,
            total_reviews=stats["total_reviews"],
            average_rating=stats["average_rating"],
            response_rate=stats["response_rate"]
        )
    
    # ========================================================================
    # LOGIQUE MÉTIER - REVIEWHELPFUL (Votes d'utilité)
    # ========================================================================
    
    def vote_helpful(
        self,
        review_id: int,
        user_id: int,
        is_helpful: bool
    ) -> ReviewHelpfulResponse:
        """
        Permet à un utilisateur de voter si un avis lui a été utile.
        
        Cette fonctionnalité est cruciale pour faire remonter les avis
        les plus pertinents et aider les futurs acheteurs à prendre
        des décisions éclairées.
        
        Un utilisateur ne peut voter qu'une seule fois par avis.
        S'il change d'avis, il peut modifier son vote.
        """
        try:
            # Vérifier que l'avis existe
            review = self.repository.get_review_by_id(review_id)
            if not review:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Avis {review_id} non trouvé"
                )
            
            # Vérifier si l'utilisateur a déjà voté
            existing_vote = self.repository.get_user_vote_on_review(user_id, review_id)
            
            if existing_vote:
                # Si le vote est identique, ne rien faire
                if existing_vote.is_helpful == is_helpful:
                    return ReviewHelpfulResponse.model_validate(existing_vote)
                
                # Sinon, supprimer l'ancien vote et mettre à jour le compteur
                if existing_vote.is_helpful:
                    self.repository.decrement_helpful_count(review)
                
                self.repository.delete_helpful_vote(existing_vote)
            
            # Créer le nouveau vote
            vote_data = ReviewHelpfulCreate(
                review_id=review_id,
                user_id=user_id,
                is_helpful=is_helpful
            )
            
            vote = self.repository.create_helpful_vote(vote_data)
            
            # Mettre à jour le compteur si le vote est positif
            if is_helpful:
                self.repository.increment_helpful_count(review)
            
            self.db.commit()
            self.db.refresh(vote)
            
            return ReviewHelpfulResponse.model_validate(vote)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors du vote : {str(e)}"
            )
    
    def remove_vote(self, review_id: int, user_id: int) -> bool:
        """
        Permet à un utilisateur de retirer son vote sur un avis.
        """
        try:
            # Vérifier que le vote existe
            vote = self.repository.get_user_vote_on_review(user_id, review_id)
            if not vote:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Aucun vote trouvé"
                )
            
            # Si le vote était positif, décrémenter le compteur
            if vote.is_helpful:
                review = self.repository.get_review_by_id(review_id)
                if review:
                    self.repository.decrement_helpful_count(review)
            
            # Supprimer le vote
            self.repository.delete_helpful_vote(vote)
            
            self.db.commit()
            return True
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la suppression du vote : {str(e)}"
            )
    
    # ========================================================================
    # LOGIQUE MÉTIER - REVIEWREPORT (Signalements)
    # ========================================================================
    
    def report_review(
        self,
        report_data: ReviewReportCreate
    ) -> ReviewReportResponse:
        """
        Permet de signaler un avis inapproprié.
        
        Les signalements sont essentiels pour maintenir la qualité
        de votre plateforme. Ils permettent à la communauté de vous
        alerter sur les avis qui violent vos règles.
        
        Un utilisateur ne peut signaler le même avis qu'une seule fois
        pour éviter les abus.
        """
        try:
            # Vérifier que l'avis existe
            review = self.repository.get_review_by_id(report_data.review_id)
            if not review:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Avis {report_data.review_id} non trouvé"
                )
            
            # Vérifier que l'utilisateur n'a pas déjà signalé cet avis
            already_reported = self.repository.check_user_reported_review(
                report_data.user_id,
                report_data.review_id
            )
            
            if already_reported:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous avez déjà signalé cet avis"
                )
            
            # Créer le signalement
            report = self.repository.create_review_report(report_data)
            
            self.db.commit()
            self.db.refresh(report)
            
            return ReviewReportResponse.model_validate(report)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors du signalement : {str(e)}"
            )
    
    def get_pending_reports(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> List[ReviewReportResponse]:
        """
        Récupère tous les signalements en attente de modération.
        
        Cette fonction est destinée aux modérateurs pour examiner
        les signalements et prendre les décisions appropriées.
        """
        reports = self.repository.get_pending_reports(skip, limit)
        return [ReviewReportResponse.model_validate(r) for r in reports]
    
    def moderate_report(
        self,
        report_id: int,
        status_update: ReviewReportUpdate
    ) -> ReviewReportResponse:
        """
        Traite un signalement et décide de l'action à prendre.
        
        Les modérateurs peuvent :
        - Approuver le signalement (approved) : L'avis sera désapprouvé ou supprimé
        - Rejeter le signalement (rejected) : L'avis reste visible
        - Marquer comme examiné (reviewed) : État intermédiaire
        
        Si un signalement est approuvé, l'avis concerné est automatiquement
        désapprouvé pour ne plus être visible publiquement.
        """
        try:
            # Récupérer le signalement
            report = self.repository.get_report_by_id(report_id)
            if not report:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Signalement {report_id} non trouvé"
                )
            
            # Mettre à jour le statut du signalement
            report = self.repository.update_report_status(report, status_update)
            
            # Si le signalement est approuvé, désapprouver l'avis
            from app.models.reviews import ReviewReportStatus
            if status_update.status == ReviewReportStatus.APPROVED:
                review = self.repository.get_review_by_id(report.review_id)
                if review:
                    review_update = ReviewUpdate(is_approved=False)
                    self.repository.update_review(review, review_update)
            
            self.db.commit()
            self.db.refresh(report)
            
            return ReviewReportResponse.model_validate(report)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la modération : {str(e)}"
            )
    
    def get_review_reports(self, review_id: int) -> List[ReviewReportResponse]:
        """
        Récupère tous les signalements d'un avis spécifique.
        
        Utile pour voir l'historique complet des signalements
        et comprendre pourquoi un avis a été désapprouvé.
        """
        reports = self.repository.get_review_reports(review_id)
        return [ReviewReportResponse.model_validate(r) for r in reports]