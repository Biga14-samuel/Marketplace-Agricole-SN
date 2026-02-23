from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional
from datetime import datetime, date, timedelta, timezone
from decimal import Decimal

from app.repositories.subscriptions_repository import (
    SubscriptionRepository, SubscriptionItemRepository, SubscriptionDeliveryRepository,
    ProductBundleRepository, BundleItemRepository
)
from app.schemas.subscriptions import (
    SubscriptionCreate, SubscriptionUpdate,
    SubscriptionDeliverySkip, SubscriptionPause, SubscriptionCancel,
    ProductBundleCreate, ProductBundleUpdate, BundleItemCreate
)
from app.models.subscriptions import SubscriptionStatus, DeliveryStatus
from app.models.products import Product


# ============================================================================
# SERVICE SUBSCRIPTION
# ============================================================================

class SubscriptionService:
    """
    Service qui gère toute la logique métier des abonnements.
    
    Ce service orchestre plusieurs repositories pour créer et gérer des
    abonnements complets. Il s'occupe de la validation métier, de la création
    des livraisons planifiées, et de la gestion du cycle de vie des abonnements.
    """
    
    def __init__(self, db: Session):
        self.subscription_repo = SubscriptionRepository(db)
        self.item_repo = SubscriptionItemRepository(db)
        self.delivery_repo = SubscriptionDeliveryRepository(db)
        self.db = db
    
    def create_subscription(self, user_id: int, subscription_data: SubscriptionCreate):
        """
        Crée un nouvel abonnement complet avec tous ses items et livraisons planifiées.
        
        Cette méthode est le point d'entrée principal pour créer un abonnement.
        Elle effectue plusieurs opérations dans une transaction pour garantir
        la cohérence des données :
        
        1. Valide que le producteur existe et que tous les produits lui appartiennent
        2. Crée l'abonnement de base
        3. Ajoute tous les items (produits) à l'abonnement
        4. Génère les livraisons planifiées pour les 3 prochains mois
        
        Cette approche transactionnelle garantit que soit tout est créé avec succès,
        soit rien n'est créé en cas d'erreur (atomicité).
        """
        # Vérifier que tous les produits existent et appartiennent au producteur
        for item_data in subscription_data.items:
            product = self.db.query(Product).filter(Product.id == item_data.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Le produit {item_data.product_id} n'existe pas"
                )
            if product.producer_id != subscription_data.producer_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Le produit {product.name} n'appartient pas au producteur sélectionné"
                )
        
        # Créer l'abonnement de base
        subscription = self.subscription_repo.create(
            user_id=user_id,
            producer_id=subscription_data.producer_id,
            name=subscription_data.name,
            frequency=subscription_data.frequency,
            price=float(subscription_data.price),
            next_delivery=subscription_data.next_delivery,
            delivery_notes=subscription_data.delivery_notes
        )
        
        # Ajouter tous les produits à l'abonnement
        for item_data in subscription_data.items:
            self.item_repo.create(
                subscription_id=subscription.id,
                product_id=item_data.product_id,
                quantity=item_data.quantity,
                is_flexible=item_data.is_flexible
            )
        
        # Générer les livraisons planifiées pour les 3 prochains mois
        self._generate_future_deliveries(subscription, months=3)
        
        return subscription
    
    def _generate_future_deliveries(self, subscription, months: int = 3):
        """
        Génère automatiquement les livraisons planifiées futures.
        
        Cette méthode privée crée toutes les occurrences de livraison à venir
        selon la fréquence de l'abonnement. Par exemple, pour un abonnement
        hebdomadaire sur 3 mois, elle créera environ 12 livraisons planifiées.
        
        Cela permet au client de voir à l'avance toutes ses livraisons futures
        et de les gérer individuellement (sauter une livraison si besoin).
        """
        current_date = subscription.next_delivery
        end_date = date.today() + timedelta(days=months * 30)
        
        while current_date <= end_date:
            # Créer une livraison planifiée pour cette date
            self.delivery_repo.create(
                subscription_id=subscription.id,
                delivery_date=current_date
            )
            
            # Calculer la prochaine date selon la fréquence
            current_date = self.subscription_repo.calculate_next_delivery_date(
                current_date, subscription.frequency
            )
    
    def get_user_subscriptions(self, user_id: int, status: Optional[SubscriptionStatus] = None):
        """
        Récupère tous les abonnements d'un utilisateur.
        
        Permet au client de voir tous ses abonnements actifs, en pause ou annulés.
        Les abonnements sont retournés avec leurs items pour affichage complet.
        """
        return self.subscription_repo.get_user_subscriptions(user_id, status)
    
    def get_subscription(self, subscription_id: int, user_id: Optional[int] = None):
        """
        Récupère un abonnement spécifique avec ses détails complets.
        
        Si user_id est fourni, vérifie que l'abonnement appartient bien à
        cet utilisateur pour empêcher l'accès non autorisé.
        """
        subscription = self.subscription_repo.get_by_id(subscription_id)
        
        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Abonnement non trouvé"
            )
        
        if user_id and subscription.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à accéder à cet abonnement"
            )
        
        return subscription
    
    def update_subscription(self, subscription_id: int, update_data: SubscriptionUpdate,
                           user_id: Optional[int] = None):
        """
        Met à jour un abonnement existant.
        
        Permet au client de modifier son abonnement : changer le nom,
        la fréquence, mettre en pause, reprendre ou annuler.
        
        Certaines modifications déclenchent des actions supplémentaires :
        - Changer la fréquence régénère les livraisons futures
        - Reprendre un abonnement en pause peut nécessiter une nouvelle date
        """
        # Vérifier les permissions
        subscription = self.get_subscription(subscription_id, user_id)
        
        # Extraire les données à mettre à jour
        update_dict = update_data.model_dump(exclude_unset=True)
        
        # Si on change la fréquence, il faudra régénérer les livraisons
        frequency_changed = 'frequency' in update_dict and update_dict['frequency'] != subscription.frequency
        
        # Mettre à jour l'abonnement
        updated = self.subscription_repo.update(subscription_id, **update_dict)
        
        # Si la fréquence a changé, supprimer les livraisons futures non traitées
        # et en régénérer de nouvelles
        if frequency_changed and updated:
            # TODO: Implémenter la suppression et régénération des livraisons futures
            pass
        
        return updated
    
    def pause_subscription(self, subscription_id: int, pause_data: SubscriptionPause,
                          user_id: Optional[int] = None):
        """
        Met un abonnement en pause temporairement.
        
        L'abonnement en pause ne génère plus de commandes automatiques.
        Si une date de reprise est fournie, l'abonnement peut être
        automatiquement réactivé à cette date par un job planifié.
        """
        subscription = self.get_subscription(subscription_id, user_id)
        
        if subscription.status == SubscriptionStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un abonnement annulé ne peut pas être mis en pause"
            )
        
        return self.subscription_repo.pause(subscription_id)
    
    def resume_subscription(self, subscription_id: int, next_delivery: Optional[date] = None,
                           user_id: Optional[int] = None):
        """
        Réactive un abonnement en pause.
        
        Si next_delivery est fourni, définit une nouvelle date de première
        livraison. Sinon, reprend avec la date qui était planifiée.
        """
        subscription = self.get_subscription(subscription_id, user_id)
        
        if subscription.status != SubscriptionStatus.PAUSED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Seul un abonnement en pause peut être repris"
            )
        
        # Si aucune nouvelle date n'est fournie mais que la prochaine livraison
        # est dans le passé, calculer une nouvelle date
        if not next_delivery and subscription.next_delivery < date.today():
            next_delivery = self.subscription_repo.calculate_next_delivery_date(
                date.today(), subscription.frequency
            )
        
        return self.subscription_repo.resume(subscription_id, next_delivery)
    
    def cancel_subscription(self, subscription_id: int, cancel_data: SubscriptionCancel,
                           user_id: Optional[int] = None):
        """
        Annule définitivement un abonnement.
        
        Un abonnement annulé ne peut plus être réactivé. Cette action est
        irréversible. Les livraisons planifiées futures sont automatiquement
        annulées.
        
        La raison d'annulation est enregistrée pour aider le producteur à
        comprendre pourquoi les clients annulent et améliorer son service.
        """
        subscription = self.get_subscription(subscription_id, user_id)
        
        if subscription.status == SubscriptionStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet abonnement est déjà annulé"
            )
        
        # Marquer toutes les livraisons futures comme annulées
        future_deliveries = self.delivery_repo.get_subscription_deliveries(
            subscription_id,
            start_date=date.today()
        )
        
        for delivery in future_deliveries:
            if delivery.status == DeliveryStatus.SCHEDULED:
                self.delivery_repo.skip(delivery.id, cancel_data.reason)
        
        # Annuler l'abonnement
        return self.subscription_repo.cancel(subscription_id)
    
    def get_upcoming_deliveries(self, subscription_id: int, days: int = 30,
                               user_id: Optional[int] = None):
        """
        Récupère les prochaines livraisons planifiées d'un abonnement.
        
        Permet au client de voir son calendrier de livraisons à venir
        et de planifier ses absences (vacances, déplacements).
        """
        subscription = self.get_subscription(subscription_id, user_id)
        return self.delivery_repo.get_upcoming_deliveries(subscription.id, days)
    
def skip_delivery(self, delivery_id: int, skip_data: SubscriptionDeliverySkip,
                  user_id: Optional[int] = None):
    # 1. Récupération de la livraison
    delivery = self.delivery_repo.get_by_id(delivery_id)
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livraison non trouvée"
        )
    
    # 2. Vérifier les permissions (On appelle juste la méthode pour la validation)
    if user_id:
        self.get_subscription(delivery.subscription_id, user_id)
    
    # 3. Vérifier le statut
    if delivery.status != DeliveryStatus.SCHEDULED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seule une livraison planifiée peut être sautée"
        )
    
    # 4. Vérifier le délai de 48h
    # Note : date.today() + timedelta(days=2) est égal à "après-demain"
    if delivery.delivery_date <= date.today() + timedelta(days=2):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Il est trop tard pour sauter cette livraison (minimum 48h avant)"
        )
    
    return self.delivery_repo.skip(delivery_id, skip_data.skip_reason)
    
    def process_due_subscriptions(self, processing_date: date = None):
        """
        Traite tous les abonnements dont la livraison est due aujourd'hui.
        
        Cette méthode est appelée par un job automatisé quotidien (cron job).
        Elle identifie tous les abonnements actifs qui doivent générer une
        commande aujourd'hui et les traite automatiquement.
        
        Pour chaque abonnement dû :
        1. Crée une commande avec tous les produits de l'abonnement
        2. Marque la livraison planifiée comme traitée
        3. Met à jour la date de prochaine livraison
        4. Génère une nouvelle livraison planifiée dans le futur
        
        Retourne le nombre d'abonnements traités avec succès.
        """
        if not processing_date:
            processing_date = date.today()
        
        # Récupérer tous les abonnements actifs dus aujourd'hui
        due_subscriptions = self.subscription_repo.get_active_subscriptions_for_date(processing_date)
        
        processed_count = 0
        errors = []
        
        for subscription in due_subscriptions:
            try:
                # TODO: Créer automatiquement une commande pour cet abonnement
                # Cette partie nécessite l'intégration avec le système de commandes
                
                # Pour l'instant, on marque juste la livraison comme traitée
                deliveries = self.delivery_repo.get_deliveries_for_date(
                    processing_date,
                    DeliveryStatus.SCHEDULED
                )
                
                for delivery in deliveries:
                    if delivery.subscription_id == subscription.id:
                        # Marquer comme en cours de traitement
                        self.delivery_repo.update(
                            delivery.id,
                            status=DeliveryStatus.PROCESSING,
                            processed_at=datetime.now(timezone.utc)
                        )
                
                # Calculer et mettre à jour la prochaine date de livraison
                next_date = self.subscription_repo.calculate_next_delivery_date(
                    subscription.next_delivery,
                    subscription.frequency
                )
                self.subscription_repo.update_next_delivery(subscription.id, next_date)
                
                # Générer une nouvelle livraison planifiée pour la prochaine fois
                self.delivery_repo.create(subscription.id, next_date)
                
                processed_count += 1
                
            except Exception as e:
                errors.append({
                    "subscription_id": subscription.id,
                    "error": str(e)
                })
        
        return {
            "date": processing_date,
            "total_due": len(due_subscriptions),
            "processed": processed_count,
            "errors": errors
        }

class ProductBundleService:
    """
    Service qui gère toute la logique métier des paniers pré-composés (bundles).
    
    Les bundles permettent aux producteurs de créer des offres groupées attractives
    et aux clients d'acheter plusieurs produits ensemble avec une réduction.
    Ce service s'occupe de la création, validation et gestion des bundles.
    """
    
    def __init__(self, db: Session):
        self.bundle_repo = ProductBundleRepository(db)
        self.item_repo = BundleItemRepository(db)
        self.db = db
    
    def create_bundle(self, bundle_data: ProductBundleCreate):
        """
        Crée un nouveau panier pré-composé complet.
        
        Cette méthode crée un bundle avec tous ses produits en une seule transaction.
        Elle effectue plusieurs validations importantes :
        
        1. Vérifie que tous les produits existent
        2. Vérifie que tous les produits appartiennent au producteur
        3. Vérifie que tous les produits sont actifs et disponibles
        4. Calcule le prix total si un pourcentage de réduction est défini
        5. Crée le bundle et ajoute tous ses items
        
        Cette approche transactionnelle garantit qu'on ne peut pas créer un bundle
        incomplet ou incohérent.
        """
        # Valider que tous les produits existent et appartiennent au producteur
        product_ids = [item.product_id for item in bundle_data.items]
        products = self.db.query(Product).filter(Product.id.in_(product_ids)).all()
        
        if len(products) != len(product_ids):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Un ou plusieurs produits n'existent pas"
            )
        
        # Vérifier que tous les produits appartiennent au producteur
        for product in products:
            if product.producer_id != bundle_data.producer_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Le produit {product.name} n'appartient pas au producteur sélectionné"
                )
            if not product.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Le produit {product.name} n'est pas actif"
                )
        
        # Si un pourcentage de réduction est défini, calculer le prix à partir
        # du total des produits individuels
        if bundle_data.discount_percentage is not None:
            total_price = Decimal(0)
            product_dict = {p.id: p for p in products}
            
            for item in bundle_data.items:
                product = product_dict[item.product_id]
                total_price += product.price * item.quantity
            
            # Appliquer la réduction
            discounted_price = total_price * (Decimal(1) - bundle_data.discount_percentage / Decimal(100))
            
            # Vérifier que le prix du bundle n'est pas supérieur au total
            if bundle_data.price > discounted_price:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Le prix du bundle ne peut pas être supérieur au prix avec réduction calculé"
                )
        
        # Créer le bundle de base
        bundle = self.bundle_repo.create(
            producer_id=bundle_data.producer_id,
            name=bundle_data.name,
            description=bundle_data.description,
            price=float(bundle_data.price),
            discount_percentage=float(bundle_data.discount_percentage) if bundle_data.discount_percentage else None,
            image_url=bundle_data.image_url,
            is_active=bundle_data.is_active,
            valid_from=bundle_data.valid_from,
            valid_until=bundle_data.valid_until,
            stock_quantity=bundle_data.stock_quantity
        )
        
        # Ajouter tous les produits au bundle
        for item_data in bundle_data.items:
            self.item_repo.create(
                bundle_id=bundle.id,
                product_id=item_data.product_id,
                quantity=item_data.quantity
            )
        
        return bundle
    
    def get_bundle(self, bundle_id: int):
        """
        Récupère un bundle avec tous ses détails.
        
        Retourne le bundle complet avec la liste de tous les produits inclus
        et leurs quantités.
        """
        bundle = self.bundle_repo.get_by_id(bundle_id)
        
        if not bundle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bundle non trouvé"
            )
        
        return bundle
    
    def get_producer_bundles(self, producer_id: int, active_only: bool = True):
        """
        Récupère tous les bundles d'un producteur.
        
        Permet au producteur de voir tous ses paniers pré-composés,
        actifs ou non. Utile pour gérer son catalogue d'offres.
        """
        return self.bundle_repo.get_producer_bundles(producer_id, active_only)
    
    def get_available_bundles(self):
        """
        Récupère tous les bundles disponibles à l'achat.
        
        Cette méthode est utilisée pour afficher les offres aux clients.
        Elle filtre automatiquement pour ne montrer que les bundles actifs
        et dans leur période de validité.
        """
        return self.bundle_repo.get_active_bundles()
    
    def update_bundle(self, bundle_id: int, update_data: ProductBundleUpdate,
                     producer_id: Optional[int] = None):
        """
        Met à jour un bundle existant.
        
        Permet au producteur de modifier son bundle : changer le prix,
        les dates de validité, désactiver temporairement l'offre, etc.
        
        Si producer_id est fourni, vérifie que le bundle appartient bien
        à ce producteur pour empêcher les modifications non autorisées.
        """
        bundle = self.get_bundle(bundle_id)
        
        # Vérifier les permissions
        if producer_id and bundle.producer_id != producer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier ce bundle"
            )
        
        # Extraire les données à mettre à jour
        update_dict = update_data.model_dump(exclude_unset=True)
        
        # Mettre à jour le bundle
        return self.bundle_repo.update(bundle_id, **update_dict)
    
    def add_product_to_bundle(self, bundle_id: int, item_data: BundleItemCreate,
                            producer_id: Optional[int] = None):
        """
        Ajoute un produit à un bundle existant.
        
        Permet au producteur d'enrichir son bundle avec de nouveaux produits.
        Valide que le produit appartient au même producteur que le bundle.
        """
        bundle = self.get_bundle(bundle_id)
        
        # Vérifier les permissions
        if producer_id and bundle.producer_id != producer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier ce bundle"
            )
        
        # Vérifier que le produit existe et appartient au producteur
        product = self.db.query(Product).filter(Product.id == item_data.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produit non trouvé"
            )
        
        if product.producer_id != bundle.producer_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le produit doit appartenir au même producteur que le bundle"
            )
        
        # Vérifier que le produit n'est pas déjà dans le bundle
        existing_items = self.item_repo.get_bundle_items(bundle_id)
        if any(item.product_id == item_data.product_id for item in existing_items):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce produit est déjà dans le bundle"
            )
        
        return self.item_repo.create(
            bundle_id=bundle_id,
            product_id=item_data.product_id,
            quantity=item_data.quantity
        )
    
    def remove_product_from_bundle(self, bundle_id: int, item_id: int,
                                  producer_id: Optional[int] = None):
        """
        Retire un produit d'un bundle.
        
        Permet au producteur de retirer un produit qui n'est plus disponible
        ou qu'il ne souhaite plus inclure dans l'offre.
        
        Attention : un bundle doit toujours contenir au moins un produit.
        """
        bundle = self.get_bundle(bundle_id)
        
        # Vérifier les permissions
        if producer_id and bundle.producer_id != producer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier ce bundle"
            )
        
        # Vérifier qu'il restera au moins un produit dans le bundle
        current_items = self.item_repo.get_bundle_items(bundle_id)
        if len(current_items) <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un bundle doit contenir au moins un produit"
            )
        
        # Vérifier que l'item appartient bien à ce bundle
        item = self.item_repo.get_by_id(item_id)
        if not item or item.bundle_id != bundle_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item non trouvé dans ce bundle"
            )
        
        success = self.item_repo.delete(item_id)
        
        if success:
            return {"message": "Produit retiré du bundle avec succès"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la suppression du produit"
            )
    
    def deactivate_bundle(self, bundle_id: int, producer_id: Optional[int] = None):
        """
        Désactive un bundle sans le supprimer.
        
        Un bundle désactivé n'est plus visible par les clients mais reste
        dans la base de données pour les statistiques et peut être réactivé.
        """
        bundle = self.get_bundle(bundle_id)
        
        if producer_id and bundle.producer_id != producer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier ce bundle"
            )
        
        return self.bundle_repo.deactivate(bundle_id)
    
    def activate_bundle(self, bundle_id: int, producer_id: Optional[int] = None):
        """
        Réactive un bundle précédemment désactivé.
        
        Le bundle redevient visible et achetable par les clients.
        Vérifie que tous les produits du bundle sont toujours actifs et
        disponibles avant de réactiver.
        """
        bundle = self.get_bundle(bundle_id)
        
        if producer_id and bundle.producer_id != producer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à modifier ce bundle"
            )
        
        # Vérifier que tous les produits du bundle sont encore actifs
        items = self.item_repo.get_bundle_items(bundle_id)
        product_ids = [item.product_id for item in items]
        products = self.db.query(Product).filter(Product.id.in_(product_ids)).all()
        
        inactive_products = [p.name for p in products if not p.is_active]
        if inactive_products:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Impossible de réactiver : les produits suivants sont inactifs : {', '.join(inactive_products)}"
            )
        
        return self.bundle_repo.activate(bundle_id)
    
    def check_bundle_availability(self, bundle_id: int) -> bool:
        """
        Vérifie qu'un bundle est disponible à l'achat.
        
        Un bundle est disponible si :
        1. Il est actif
        2. Il est dans sa période de validité
        3. Il a du stock disponible (si géré)
        4. Tous ses produits sont en stock
        
        Cette méthode est appelée avant d'ajouter un bundle au panier.
        """
        bundle = self.get_bundle(bundle_id)
        
        # Vérifier que le bundle est actif
        if not bundle.is_active:
            return False
        
        # Vérifier la période de validité
        now = datetime.now(timezone.utc)
        if bundle.valid_from and bundle.valid_from > now:
            return False
        if bundle.valid_until and bundle.valid_until < now:
            return False
        
        # Vérifier le stock du bundle
        if bundle.stock_quantity is not None and bundle.stock_quantity <= 0:
            return False
        
        # Vérifier que tous les produits sont disponibles
        items = self.item_repo.get_bundle_items(bundle_id)
        for item in items:
            product = self.db.query(Product).filter(Product.id == item.product_id).first()
            if not product or not product.is_active:
                return False
            if product.stock_quantity < item.quantity:
                return False
        
        return True
    
    def get_bundle_stats(self, producer_id: int):
        """
        Récupère des statistiques sur les bundles d'un producteur.
        
        Fournit une vue d'ensemble des performances des bundles :
        combien de bundles créés, combien actifs, combien vendus,
        quel revenu généré.
        
        Ces statistiques aident le producteur à comprendre l'efficacité
        de sa stratégie de bundles.
        """
        bundles = self.bundle_repo.get_producer_bundles(producer_id, active_only=False)
        
        stats = {
            "total_bundles": len(bundles),
            "active_bundles": len([b for b in bundles if b.is_active]),
            "total_sales": 0,  # TODO: Calculer depuis les commandes
            "total_revenue": Decimal(0)  # TODO: Calculer depuis les commandes
        }
        
        return stats