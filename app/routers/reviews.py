from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.review_service import ReviewService
from app.schemas.reviews import (
    ReviewCreate, ReviewUpdate, ReviewResponse,
    ProducerReviewCreate, ProducerReviewResponse, ProducerReviewResponseModel,
    ReviewHelpfulResponse,
    ReviewReportCreate, ReviewReportUpdate, ReviewReportResponse,
    ProductRatingStats, ProducerRatingStats
)


# Le préfixe /api/v1/reviews est ajouté par main.py
router = APIRouter(
    prefix="",
    tags=["Reviews & Trust"]
)


# ============================================================================
# ENDPOINTS - REVIEW (Avis produits)
# ============================================================================

@router.post("/products", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_product_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
):
    """
    Crée un nouvel avis sur un produit.
    
    **Conditions requises :**
    - La commande doit appartenir à l'utilisateur
    - La commande doit avoir été livrée (garantit un achat vérifié)
    - L'utilisateur ne doit pas avoir déjà laissé un avis pour cette commande
    
    **Champs importants :**
    - **rating** : Note de 1 à 5 étoiles (obligatoire)
    - **title** : Titre court et accrocheur (5-200 caractères)
    - **comment** : Commentaire détaillé (10-5000 caractères)
    - **images** : URLs des photos (optionnel, max 5 images)
    
    L'avis sera automatiquement marqué comme "achat vérifié" puisque
    seules les commandes livrées peuvent être évaluées.
    """
    service = ReviewService(db)
    return service.create_review(review_data)


@router.get("/products/{review_id}", response_model=ReviewResponse)
def get_product_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'un avis produit spécifique."""
    service = ReviewService(db)
    return service.get_review(review_id)


@router.get("/products/product/{product_id}", response_model=List[ReviewResponse])
def get_product_reviews(
    product_id: int,
    approved_only: bool = Query(True, description="Afficher uniquement les avis approuvés"),
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter (pagination)"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments"),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les avis d'un produit spécifique.
    
    Par défaut, seuls les avis approuvés sont affichés pour garantir
    la qualité du contenu. Les modérateurs peuvent voir tous les avis
    en mettant approved_only à False.
    
    Les avis sont triés du plus récent au plus ancien.
    """
    service = ReviewService(db)
    return service.get_product_reviews(product_id, approved_only, skip, limit)


@router.get("/products/user/{user_id}", response_model=List[ReviewResponse])
def get_user_reviews(
    user_id: int,
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments"),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les avis laissés par un utilisateur spécifique.
    
    Utile pour afficher l'historique complet des évaluations d'un client
    sur sa page de profil.
    """
    service = ReviewService(db)
    return service.get_user_reviews(user_id, skip, limit)


@router.patch("/products/{review_id}", response_model=ReviewResponse)
def update_product_review(
    review_id: int,
    review_data: ReviewUpdate,
    user_id: int = Query(..., description="ID de l'utilisateur qui modifie"),
    db: Session = Depends(get_db)
):
    """
    Met à jour un avis existant.
    
    **Permissions :**
    - L'auteur peut modifier le titre, le commentaire et les images
    - Les modérateurs peuvent changer le statut d'approbation
    
    Seul l'auteur de l'avis peut le modifier (sauf pour le champ is_approved
    qui est réservé aux modérateurs).
    """
    service = ReviewService(db)
    return service.update_review(review_id, review_data, user_id)


@router.delete("/products/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_review(
    review_id: int,
    user_id: int = Query(..., description="ID de l'utilisateur"),
    db: Session = Depends(get_db)
):
    """
    Supprime un avis produit.
    
    Seul l'auteur peut supprimer son propre avis.
    """
    service = ReviewService(db)
    service.delete_review(review_id, user_id)


@router.get("/products/product/{product_id}/stats", response_model=ProductRatingStats)
def get_product_statistics(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère les statistiques complètes d'un produit.
    
    **Retourne :**
    - Nombre total d'avis
    - Note moyenne sur 5 étoiles
    - Distribution des notes (combien de 5★, 4★, 3★, 2★, 1★)
    - Pourcentage d'achats vérifiés
    
    Ces statistiques sont essentielles pour afficher sur la fiche produit
    des informations claires qui aident les clients à prendre des décisions.
    """
    service = ReviewService(db)
    return service.get_product_stats(product_id)


# ============================================================================
# ENDPOINTS - PRODUCERREVIEW (Avis producteurs)
# ============================================================================

@router.post("/producers", response_model=ProducerReviewResponseModel, status_code=status.HTTP_201_CREATED)
def create_producer_review(
    review_data: ProducerReviewCreate,
    db: Session = Depends(get_db)
):
    """
    Crée un nouvel avis sur un producteur.
    
    **Conditions requises :**
    - La commande doit appartenir à l'utilisateur
    - La commande doit avoir été livrée
    - L'utilisateur ne doit pas avoir déjà évalué ce producteur pour cette commande
    
    Les avis producteurs évaluent l'expérience globale avec le vendeur :
    communication, rapidité, emballage, professionnalisme, etc.
    """
    service = ReviewService(db)
    return service.create_producer_review(review_data)


@router.get("/producers/producer/{producer_id}", response_model=List[ProducerReviewResponseModel])
def get_producer_reviews(
    producer_id: int,
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments"),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les avis d'un producteur.
    
    Les avis sont triés du plus récent au plus ancien.
    Inclut les éventuelles réponses du producteur.
    """
    service = ReviewService(db)
    return service.get_producer_reviews(producer_id, skip, limit)


@router.post("/producers/{review_id}/respond", response_model=ProducerReviewResponseModel)
def respond_to_producer_review(
    review_id: int,
    response_data: ProducerReviewResponse,
    producer_id: int = Query(..., description="ID du producteur qui répond"),
    db: Session = Depends(get_db)
):
    """
    Permet au producteur de répondre à un avis le concernant.
    
    **Fonctionnalité importante :**
    Les réponses des producteurs montrent leur engagement envers leurs clients.
    Elles permettent de :
    - Remercier les clients satisfaits
    - Expliquer ou résoudre les problèmes mentionnés
    - Montrer le professionnalisme et le service client
    
    Un bon taux de réponse améliore significativement la confiance des acheteurs.
    Seul le producteur concerné peut répondre à un avis le concernant.
    """
    service = ReviewService(db)
    return service.respond_to_review(review_id, response_data, producer_id)


@router.get("/producers/producer/{producer_id}/stats", response_model=ProducerRatingStats)
def get_producer_statistics(
    producer_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère les statistiques d'un producteur.
    
    **Retourne :**
    - Nombre total d'avis reçus
    - Note moyenne sur 5 étoiles
    - Taux de réponse (% d'avis avec réponse du producteur)
    
    Le taux de réponse est un indicateur clé du niveau d'engagement
    et de professionnalisme du producteur.
    """
    service = ReviewService(db)
    return service.get_producer_stats(producer_id)


# ============================================================================
# ENDPOINTS - HELPFUL VOTES (Votes d'utilité)
# ============================================================================

@router.post("/helpful", response_model=ReviewHelpfulResponse, status_code=status.HTTP_201_CREATED)
def vote_review_helpful(
    review_id: int = Query(..., description="ID de l'avis"),
    user_id: int = Query(..., description="ID de l'utilisateur qui vote"),
    is_helpful: bool = Query(..., description="True = utile, False = pas utile"),
    db: Session = Depends(get_db)
):
    """
    Vote si un avis est utile ou non.
    
    **Fonctionnement :**
    - Un utilisateur peut voter une seule fois par avis
    - Si l'utilisateur vote à nouveau, son vote précédent est remplacé
    - Les votes positifs (is_helpful=True) incrémentent le compteur de l'avis
    - Les avis avec beaucoup de votes positifs sont mis en avant
    
    Cette fonctionnalité permet à la communauté de faire remonter
    les avis les plus pertinents et détaillés.
    """
    service = ReviewService(db)
    return service.vote_helpful(review_id, user_id, is_helpful)


@router.delete("/helpful", status_code=status.HTTP_204_NO_CONTENT)
def remove_helpful_vote(
    review_id: int = Query(..., description="ID de l'avis"),
    user_id: int = Query(..., description="ID de l'utilisateur"),
    db: Session = Depends(get_db)
):
    """
    Retire le vote d'utilité d'un utilisateur sur un avis.
    
    Si le vote était positif, le compteur de l'avis est automatiquement
    décrémenté.
    """
    service = ReviewService(db)
    service.remove_vote(review_id, user_id)


# ============================================================================
# ENDPOINTS - REPORTS (Signalements)
# ============================================================================

@router.post("/reports", response_model=ReviewReportResponse, status_code=status.HTTP_201_CREATED)
def report_review(
    report_data: ReviewReportCreate,
    db: Session = Depends(get_db)
):
    """
    Signale un avis inapproprié ou frauduleux.
    
    **Raisons de signalement disponibles :**
    - **spam** : Avis publicitaire ou répétitif
    - **offensive** : Contenu offensant ou inapproprié
    - **fake** : Avis frauduleux ou faux
    - **irrelevant** : Avis hors sujet
    - **other** : Autre raison
    
    **Règles importantes :**
    - Un utilisateur ne peut signaler le même avis qu'une seule fois
    - Les signalements sont examinés par les modérateurs
    - Les avis avec des signalements approuvés sont désapprouvés automatiquement
    
    Cette fonctionnalité permet à la communauté de vous alerter sur
    les contenus problématiques et de maintenir la qualité de la plateforme.
    """
    service = ReviewService(db)
    return service.report_review(report_data)


@router.get("/reports/pending", response_model=List[ReviewReportResponse])
def get_pending_reports(
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments"),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les signalements en attente de modération.
    
    **Endpoint réservé aux modérateurs.**
    
    Retourne la liste de tous les signalements avec le statut "pending"
    triés du plus récent au plus ancien. Les modérateurs peuvent ensuite
    examiner chaque signalement et décider de l'action appropriée.
    """
    service = ReviewService(db)
    return service.get_pending_reports(skip, limit)


@router.patch("/reports/{report_id}", response_model=ReviewReportResponse)
def moderate_report(
    report_id: int,
    status_update: ReviewReportUpdate,
    db: Session = Depends(get_db)
):
    """
    Traite un signalement et décide de l'action à prendre.
    
    **Endpoint réservé aux modérateurs.**
    
    **Actions possibles :**
    - **approved** : Le signalement est fondé, l'avis est désapprouvé automatiquement
    - **rejected** : Le signalement est infondé, l'avis reste visible
    - **reviewed** : État intermédiaire, signalement examiné mais action différée
    
    Si le statut passe à "approved", l'avis concerné est automatiquement
    désapprouvé (is_approved=False) et ne sera plus visible publiquement.
    """
    service = ReviewService(db)
    return service.moderate_report(report_id, status_update)


@router.get("/reports/review/{review_id}", response_model=List[ReviewReportResponse])
def get_review_reports(
    review_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère tous les signalements d'un avis spécifique.
    
    **Endpoint réservé aux modérateurs.**
    
    Utile pour voir l'historique complet des signalements et comprendre
    pourquoi un avis a été désapprouvé. Permet aussi d'identifier les avis
    qui ont reçu plusieurs signalements et nécessitent une attention particulière.
    """
    service = ReviewService(db)
    return service.get_review_reports(review_id)