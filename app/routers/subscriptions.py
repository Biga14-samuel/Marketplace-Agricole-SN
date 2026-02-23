from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.core import deps
from app.core.database import get_db
from app.models.auth import User
from app.schemas.subscriptions import (
    SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse, SubscriptionDetailResponse,
    SubscriptionDeliveryResponse, SubscriptionDeliverySkip, SubscriptionPause,
    SubscriptionCancel,
    ProductBundleCreate, ProductBundleUpdate, ProductBundleResponse, ProductBundleDetailResponse,
    BundleItemCreate, BundleStats
)
from app.services.subscriptions_service import SubscriptionService, ProductBundleService
from app.models.subscriptions import SubscriptionStatus


router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


# ============================================================================
# DÉPENDANCES
# ============================================================================
# Les dépendances d'authentification sont maintenant dans app.core.deps

def get_current_producer_id(
    current_user: User = Depends(deps.get_current_active_user),
    db: Session = Depends(get_db)
) -> Optional[int]:
    """Récupère l'ID du producteur depuis le profil utilisateur"""
    from app.repositories.profile_repository import ProducerProfileRepository
    repo = ProducerProfileRepository(db)
    profile = repo.get_by_user_id(current_user.id)
    return profile.id if profile else None


# ============================================================================
# ROUTES SUBSCRIPTION - Gestion des abonnements
# ============================================================================

@router.post("", response_model=SubscriptionDetailResponse, status_code=status.HTTP_201_CREATED)
def create_subscription(
    subscription_data: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Crée un nouvel abonnement pour le client.
    
    Un abonnement permet de recevoir automatiquement un panier de produits
    à intervalles réguliers (hebdomadaire, bi-hebdomadaire ou mensuel).
    
    Le système va automatiquement :
    - Valider que tous les produits existent et appartiennent au producteur
    - Créer l'abonnement avec tous ses items
    - Générer les livraisons planifiées pour les 3 prochains mois
    
    Le client peut ensuite gérer son abonnement : sauter des livraisons,
    le mettre en pause ou l'annuler à tout moment.
    """
    service = SubscriptionService(db)
    return service.create_subscription(current_user.id, subscription_data)


@router.get("", response_model=List[SubscriptionResponse])
def get_my_subscriptions(
    status_filter: Optional[SubscriptionStatus] = Query(None, description="Filtrer par statut"),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère tous les abonnements du client connecté.
    
    Peut être filtré par statut pour n'afficher que :
    - Les abonnements actifs (en cours)
    - Les abonnements en pause (temporairement suspendus)
    - Les abonnements annulés (historique)
    
    Retourne une liste de tous les abonnements avec leurs informations
    principales mais sans le détail des produits (pour alléger la réponse).
    """
    service = SubscriptionService(db)
    return service.get_user_subscriptions(current_user.id, status_filter)


@router.get("/{subscription_id}", response_model=SubscriptionDetailResponse)
def get_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les détails complets d'un abonnement spécifique.
    
    Retourne toutes les informations de l'abonnement incluant :
    - Les informations générales (nom, fréquence, prix, statut)
    - La liste détaillée de tous les produits inclus
    - La date de prochaine livraison
    
    Le client ne peut accéder qu'à ses propres abonnements.
    """
    service = SubscriptionService(db)
    return service.get_subscription(subscription_id, current_user.id)


@router.patch("/{subscription_id}", response_model=SubscriptionResponse)
def update_subscription(
    subscription_id: int,
    update_data: SubscriptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met à jour un abonnement existant.
    
    Permet au client de modifier certains paramètres de son abonnement :
    - Changer le nom (personnalisation)
    - Modifier la fréquence (passer de hebdomadaire à bi-hebdomadaire par exemple)
    - Ajuster la date de prochaine livraison
    - Modifier les notes de livraison
    
    Certaines modifications peuvent avoir des effets en cascade :
    - Changer la fréquence régénère toutes les livraisons futures
    - Modifier la date de prochaine livraison décale tout le calendrier
    """
    service = SubscriptionService(db)
    return service.update_subscription(subscription_id, update_data, current_user.id)


@router.post("/{subscription_id}/pause", response_model=SubscriptionResponse)
def pause_subscription(
    subscription_id: int,
    pause_data: SubscriptionPause,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Met un abonnement en pause temporairement.
    
    Un abonnement en pause :
    - Ne génère plus de commandes automatiques
    - Conserve tous ses paramètres et produits
    - Peut être repris à tout moment
    
    Utile quand le client part en vacances ou souhaite suspendre
    temporairement ses livraisons sans tout annuler.
    
    Une date de reprise peut être spécifiée pour une réactivation
    automatique future.
    """
    service = SubscriptionService(db)
    return service.pause_subscription(subscription_id, pause_data, current_user.id)


@router.post("/{subscription_id}/resume", response_model=SubscriptionResponse)
def resume_subscription(
    subscription_id: int,
    next_delivery: Optional[date] = Query(None, description="Nouvelle date de première livraison"),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Réactive un abonnement en pause.
    
    L'abonnement reprend son cours normal et génère à nouveau des
    commandes automatiques selon sa fréquence.
    
    Si une nouvelle date de livraison est fournie, elle devient la
    prochaine date de livraison. Sinon, le système calcule la prochaine
    date selon la fréquence définie.
    """
    service = SubscriptionService(db)
    return service.resume_subscription(subscription_id, next_delivery, current_user.id)


@router.post("/{subscription_id}/cancel")
def cancel_subscription(
    subscription_id: int,
    cancel_data: SubscriptionCancel,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Annule définitivement un abonnement.
    
    ⚠️ ATTENTION : Cette action est irréversible !
    
    Un abonnement annulé :
    - Ne peut plus être réactivé
    - Garde son historique pour les statistiques
    - Annule toutes les livraisons futures planifiées
    
    La raison d'annulation est enregistrée pour aider le producteur
    à comprendre pourquoi les clients annulent et améliorer son service.
    """
    service = SubscriptionService(db)
    result = service.cancel_subscription(subscription_id, cancel_data, current_user.id)
    return {"message": "Abonnement annulé avec succès", "subscription": result}


@router.get("/{subscription_id}/deliveries", response_model=List[SubscriptionDeliveryResponse])
def get_upcoming_deliveries(
    subscription_id: int,
    days: int = Query(30, ge=1, le=365, description="Nombre de jours à afficher"),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Récupère les prochaines livraisons planifiées d'un abonnement.
    
    Affiche un calendrier des livraisons à venir avec leur statut :
    - SCHEDULED : Planifiée, pas encore traitée
    - PROCESSING : Commande générée, en préparation
    - SKIPPED : Sautée par le client
    
    Permet au client de voir toutes ses livraisons futures et de
    planifier ses absences en sautant des livraisons si nécessaire.
    """
    service = SubscriptionService(db)
    return service.get_upcoming_deliveries(subscription_id, days, current_user.id)


@router.post("/deliveries/{delivery_id}/skip", response_model=SubscriptionDeliveryResponse)
def skip_delivery(
    delivery_id: int,
    skip_data: SubscriptionDeliverySkip,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Saute une livraison planifiée spécifique.
    
    Permet au client d'annuler une seule livraison sans affecter
    les suivantes ni annuler tout l'abonnement.
    
    Utile dans plusieurs cas :
    - Client en vacances cette semaine-là
    - Stock suffisant à la maison, pas besoin de livraison
    - Contrainte exceptionnelle (déménagement, etc.)
    
    Contraintes :
    - Seules les livraisons SCHEDULED peuvent être sautées
    - Minimum 48h avant la date de livraison
    - Les livraisons suivantes ne sont pas affectées
    """
    service = SubscriptionService(db)
    return service.skip_delivery(delivery_id, skip_data, current_user.id)


# ============================================================================
# ROUTES PRODUCTBUNDLE - Gestion des paniers pré-composés
# ============================================================================

@router.post("/bundles", response_model=ProductBundleDetailResponse, status_code=status.HTTP_201_CREATED)
def create_bundle(
    bundle_data: ProductBundleCreate,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Crée un nouveau panier pré-composé (bundle).
    
    Un bundle est une offre groupée de plusieurs produits vendus ensemble,
    généralement avec une réduction par rapport à l'achat séparé.
    
    Exemples de bundles attractifs :
    - "Panier découverte légumes d'hiver" (5 légumes de saison, -15%)
    - "Kit apéritif local" (fromage, charcuterie, pain, vin, -20%)
    - "Coffret découverte fermier" (sélection de produits)
    
    Le système valide automatiquement que :
    - Tous les produits existent et appartiennent au producteur
    - Tous les produits sont actifs et disponibles
    - Le prix est cohérent avec la réduction annoncée
    
    Réservé aux producteurs uniquement.
    """
    # Vérifier que l'utilisateur est bien producteur
    if not current_producer_id or current_producer_id != bundle_data.producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être producteur pour créer un bundle"
        )
    
    service = ProductBundleService(db)
    return service.create_bundle(bundle_data)


@router.get("/bundles", response_model=List[ProductBundleResponse])
def get_available_bundles(
    db: Session = Depends(get_db)
):
    """
    Récupère tous les paniers pré-composés disponibles.
    
    Affiche tous les bundles actuellement disponibles à l'achat :
    - Actifs (is_active = True)
    - Dans leur période de validité
    - Avec du stock disponible
    
    Cette route est publique et affiche les offres à tous les clients.
    Les bundles sont retournés sans filtrage par producteur pour permettre
    aux clients de découvrir toutes les offres disponibles.
    """
    service = ProductBundleService(db)
    return service.get_available_bundles()


@router.get("/bundles/producer/{producer_id}", response_model=List[ProductBundleResponse])
def get_producer_bundles(
    producer_id: int,
    active_only: bool = Query(True, description="N'afficher que les bundles actifs"),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les bundles d'un producteur spécifique.
    
    Permet de voir tous les paniers pré-composés d'un producteur :
    - Pour le producteur : gérer son catalogue d'offres
    - Pour les clients : voir toutes les offres de ce producteur
    
    Peut filtrer pour n'afficher que les bundles actifs ou tout afficher
    (incluant les bundles désactivés, utile pour le producteur).
    """
    service = ProductBundleService(db)
    return service.get_producer_bundles(producer_id, active_only)


@router.get("/bundles/{bundle_id}", response_model=ProductBundleDetailResponse)
def get_bundle(
    bundle_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère les détails complets d'un bundle.
    
    Retourne toutes les informations du bundle incluant :
    - Nom, description, prix, réduction
    - Liste complète de tous les produits inclus avec quantités
    - Dates de validité
    - Stock disponible
    
    Cette route est publique pour permettre aux clients de voir
    le détail d'une offre avant de l'acheter.
    """
    service = ProductBundleService(db)
    return service.get_bundle(bundle_id)


@router.patch("/bundles/{bundle_id}", response_model=ProductBundleResponse)
def update_bundle(
    bundle_id: int,
    update_data: ProductBundleUpdate,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Met à jour un bundle existant.
    
    Permet au producteur de modifier son offre :
    - Ajuster le prix ou la réduction
    - Prolonger ou raccourcir la période de validité
    - Modifier la description ou l'image
    - Ajuster le stock disponible
    
    Réservé au producteur propriétaire du bundle.
    """
    if not current_producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être producteur pour modifier un bundle"
        )
    
    service = ProductBundleService(db)
    return service.update_bundle(bundle_id, update_data, current_producer_id)


@router.post("/bundles/{bundle_id}/items", response_model=dict)
def add_product_to_bundle(
    bundle_id: int,
    item_data: BundleItemCreate,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Ajoute un produit à un bundle existant.
    
    Permet au producteur d'enrichir son offre en ajoutant de nouveaux
    produits au bundle.
    
    Validations effectuées :
    - Le produit existe et appartient au producteur
    - Le produit n'est pas déjà dans le bundle
    - Le bundle appartient au producteur connecté
    """
    if not current_producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être producteur pour modifier un bundle"
        )
    
    service = ProductBundleService(db)
    item = service.add_product_to_bundle(bundle_id, item_data, current_producer_id)
    return {"message": "Produit ajouté au bundle avec succès", "item": item}


@router.delete("/bundles/{bundle_id}/items/{item_id}")
def remove_product_from_bundle(
    bundle_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Retire un produit d'un bundle.
    
    Permet au producteur de retirer un produit qui n'est plus disponible
    ou qu'il ne souhaite plus inclure dans l'offre.
    
    ⚠️ Un bundle doit toujours contenir au moins un produit.
    """
    if not current_producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être producteur pour modifier un bundle"
        )
    
    service = ProductBundleService(db)
    return service.remove_product_from_bundle(bundle_id, item_id, current_producer_id)


@router.post("/bundles/{bundle_id}/deactivate", response_model=ProductBundleResponse)
def deactivate_bundle(
    bundle_id: int,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Désactive un bundle sans le supprimer.
    
    Un bundle désactivé :
    - N'est plus visible par les clients
    - Ne peut plus être acheté
    - Conserve son historique et ses données
    - Peut être réactivé à tout moment
    
    Utile pour retirer temporairement une offre (produits en rupture,
    fin de saison) sans perdre les données.
    """
    if not current_producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être producteur pour modifier un bundle"
        )
    
    service = ProductBundleService(db)
    return service.deactivate_bundle(bundle_id, current_producer_id)


@router.post("/bundles/{bundle_id}/activate", response_model=ProductBundleResponse)
def activate_bundle(
    bundle_id: int,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Réactive un bundle précédemment désactivé.
    
    Le bundle redevient visible et achetable par les clients.
    
    Validations effectuées avant réactivation :
    - Tous les produits du bundle sont encore actifs
    - Tous les produits ont du stock disponible
    
    Si un produit n'est plus disponible, la réactivation est refusée
    et le producteur doit d'abord mettre à jour le contenu du bundle.
    """
    if not current_producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous devez être producteur pour modifier un bundle"
        )
    
    service = ProductBundleService(db)
    return service.activate_bundle(bundle_id, current_producer_id)


@router.get("/bundles/{bundle_id}/availability")
def check_bundle_availability(
    bundle_id: int,
    db: Session = Depends(get_db)
):
    """
    Vérifie la disponibilité d'un bundle.
    
    Avant d'ajouter un bundle au panier, cette route vérifie :
    - Le bundle est actif
    - Il est dans sa période de validité
    - Il a du stock disponible (si géré)
    - Tous ses produits sont en stock
    
    Retourne True si le bundle peut être acheté, False sinon.
    """
    service = ProductBundleService(db)
    is_available = service.check_bundle_availability(bundle_id)
    
    return {
        "bundle_id": bundle_id,
        "is_available": is_available,
        "message": "Le bundle est disponible à l'achat" if is_available else "Le bundle n'est pas disponible"
    }


@router.get("/bundles/stats/producer/{producer_id}", response_model=BundleStats)
def get_bundle_stats(
    producer_id: int,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Récupère les statistiques de bundles d'un producteur.
    
    Fournit une vue d'ensemble des performances des bundles :
    - Nombre total de bundles créés
    - Nombre de bundles actifs
    - Nombre total de ventes
    - Revenu total généré
    
    Réservé au producteur concerné ou aux administrateurs.
    """
    if not current_producer_id or (current_producer_id != producer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez consulter que vos propres statistiques"
        )
    
    service = ProductBundleService(db)
    return service.get_bundle_stats(producer_id)