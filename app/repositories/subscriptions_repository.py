from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import List, Optional
from datetime import datetime, date, timedelta, timezone

from app.models.subscriptions import (
    Subscription, SubscriptionItem, SubscriptionDelivery,
    ProductBundle, BundleItem,
    SubscriptionStatus, DeliveryStatus, SubscriptionFrequency
)


# ============================================================================
# REPOSITORY SUBSCRIPTION
# ============================================================================

class SubscriptionRepository:
    """
    Gère toutes les opérations de base de données pour les abonnements.
    
    Ce repository encapsule toute la logique d'accès aux données des abonnements,
    permettant de créer, lire, mettre à jour et supprimer des abonnements de
    manière cohérente et optimisée.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, producer_id: int, name: str,
               frequency: SubscriptionFrequency, price: float,
               next_delivery: date, delivery_notes: Optional[str] = None) -> Subscription:
        """
        Crée un nouvel abonnement.
        
        Cette méthode crée la structure de base de l'abonnement. Les items
        (produits) doivent être ajoutés séparément via add_item().
        """
        subscription = Subscription(
            user_id=user_id,
            producer_id=producer_id,
            name=name,
            frequency=frequency,
            price=price,
            next_delivery=next_delivery,
            delivery_notes=delivery_notes,
            status=SubscriptionStatus.ACTIVE
        )
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        return subscription
    
    def get_by_id(self, subscription_id: int) -> Optional[Subscription]:
        """Récupère un abonnement par son ID"""
        return self.db.query(Subscription).filter(Subscription.id == subscription_id).first()
    
    def get_user_subscriptions(self, user_id: int, status: Optional[SubscriptionStatus] = None) -> List[Subscription]:
        """
        Récupère tous les abonnements d'un utilisateur.
        
        Peut être filtré par statut pour obtenir uniquement les abonnements
        actifs, en pause ou annulés.
        """
        query = self.db.query(Subscription).filter(Subscription.user_id == user_id)
        
        if status:
            query = query.filter(Subscription.status == status)
        
        return query.order_by(desc(Subscription.created_at)).all()
    
    def get_producer_subscriptions(self, producer_id: int, status: Optional[SubscriptionStatus] = None) -> List[Subscription]:
        """
        Récupère tous les abonnements d'un producteur.
        
        Permet au producteur de voir tous ses clients abonnés et leur statut.
        """
        query = self.db.query(Subscription).filter(Subscription.producer_id == producer_id)
        
        if status:
            query = query.filter(Subscription.status == status)
        
        return query.order_by(desc(Subscription.created_at)).all()
    
    def get_active_subscriptions_for_date(self, delivery_date: date) -> List[Subscription]:
        """
        Récupère tous les abonnements actifs dont la prochaine livraison est à cette date.
        
        Cette méthode est cruciale pour le job automatisé qui génère les commandes.
        Elle identifie tous les abonnements qui doivent être traités aujourd'hui.
        """
        return self.db.query(Subscription).filter(
            and_(
                Subscription.status == SubscriptionStatus.ACTIVE,
                Subscription.next_delivery == delivery_date
            )
        ).all()
    
    def update(self, subscription_id: int, **kwargs) -> Optional[Subscription]:
        """
        Met à jour un abonnement avec les valeurs fournies.
        
        Cette méthode flexible permet de mettre à jour n'importe quel champ
        de l'abonnement en passant les nouvelles valeurs comme arguments.
        """
        subscription = self.get_by_id(subscription_id)
        if subscription:
            for key, value in kwargs.items():
                if hasattr(subscription, key) and value is not None:
                    setattr(subscription, key, value)
            
            subscription.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(subscription)
        return subscription
    
    def pause(self, subscription_id: int) -> Optional[Subscription]:
        """
        Met un abonnement en pause.
        
        Un abonnement en pause ne génère plus de commandes automatiques
        mais peut être réactivé à tout moment.
        """
        return self.update(subscription_id, status=SubscriptionStatus.PAUSED)
    
    def resume(self, subscription_id: int, next_delivery: Optional[date] = None) -> Optional[Subscription]:
        """
        Réactive un abonnement en pause.
        
        Si next_delivery est fourni, redéfinit la date de prochaine livraison.
        Sinon, garde la date actuelle.
        """
        update_data = {"status": SubscriptionStatus.ACTIVE}
        if next_delivery:
            update_data["next_delivery"] = next_delivery
        
        return self.update(subscription_id, **update_data)
    
    def cancel(self, subscription_id: int) -> Optional[Subscription]:
        """
        Annule définitivement un abonnement.
        
        Un abonnement annulé ne peut plus être réactivé. C'est une action
        définitive qui marque aussi la date d'annulation pour les statistiques.
        """
        return self.update(
            subscription_id,
            status=SubscriptionStatus.CANCELLED,
            cancelled_at=datetime.now(timezone.utc)
        )
    
    def update_next_delivery(self, subscription_id: int, new_date: date) -> Optional[Subscription]:
        """
        Met à jour la date de prochaine livraison.
        
        Cette méthode est appelée automatiquement après chaque livraison
        pour planifier la suivante selon la fréquence définie.
        """
        return self.update(subscription_id, next_delivery=new_date)
    
    def calculate_next_delivery_date(self, current_date: date, frequency: SubscriptionFrequency) -> date:
        """
        Calcule la prochaine date de livraison selon la fréquence.
        
        Cette méthode implémente la logique de calcul des dates de livraison :
        - WEEKLY : ajoute 7 jours
        - BIWEEKLY : ajoute 14 jours
        - MONTHLY : ajoute environ 30 jours (ajusté selon le mois)
        """
        if frequency == SubscriptionFrequency.WEEKLY:
            return current_date + timedelta(days=7)
        elif frequency == SubscriptionFrequency.BIWEEKLY:
            return current_date + timedelta(days=14)
        else:  # MONTHLY
            # Calculer le mois suivant à la même date
            # Si c'est le 31 et que le mois suivant n'a que 30 jours, ajuster
            month = current_date.month
            year = current_date.year
            
            if month == 12:
                next_month = 1
                next_year = year + 1
            else:
                next_month = month + 1
                next_year = year
            
            try:
                return current_date.replace(month=next_month, year=next_year)
            except ValueError:
                # Le jour n'existe pas dans le mois suivant (ex: 31 février)
                # On prend le dernier jour du mois
                if next_month == 12:
                    return date(next_year, 12, 31)
                else:
                    return date(next_year, next_month + 1, 1) - timedelta(days=1)
    
    def delete(self, subscription_id: int) -> bool:
        """
        Supprime physiquement un abonnement.
        
        Attention : cette opération est irréversible et supprime aussi tous
        les items et livraisons associés (cascade). Préférer cancel() qui
        garde l'historique.
        """
        subscription = self.get_by_id(subscription_id)
        if subscription:
            self.db.delete(subscription)
            self.db.commit()
            return True
        return False


# ============================================================================
# REPOSITORY SUBSCRIPTIONITEM
# ============================================================================

class SubscriptionItemRepository:
    """
    Gère les produits inclus dans les abonnements.
    
    Permet d'ajouter, modifier ou retirer des produits d'un abonnement.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, subscription_id: int, product_id: int,
               quantity: int, is_flexible: bool = False) -> SubscriptionItem:
        """
        Ajoute un produit à un abonnement.
        
        Le produit sera inclus dans toutes les futures livraisons de
        cet abonnement avec la quantité spécifiée.
        """
        item = SubscriptionItem(
            subscription_id=subscription_id,
            product_id=product_id,
            quantity=quantity,
            is_flexible=is_flexible
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
    
    def get_by_id(self, item_id: int) -> Optional[SubscriptionItem]:
        """Récupère un item d'abonnement par son ID"""
        return self.db.query(SubscriptionItem).filter(SubscriptionItem.id == item_id).first()
    
    def get_subscription_items(self, subscription_id: int) -> List[SubscriptionItem]:
        """
        Récupère tous les produits d'un abonnement.
        
        Retourne la liste complète des produits qui seront livrés
        à chaque occurrence de l'abonnement.
        """
        return self.db.query(SubscriptionItem).filter(
            SubscriptionItem.subscription_id == subscription_id
        ).all()
    
    def update(self, item_id: int, **kwargs) -> Optional[SubscriptionItem]:
        """Met à jour un item d'abonnement"""
        item = self.get_by_id(item_id)
        if item:
            for key, value in kwargs.items():
                if hasattr(item, key) and value is not None:
                    setattr(item, key, value)
            
            item.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(item)
        return item
    
    def delete(self, item_id: int) -> bool:
        """
        Retire un produit d'un abonnement.
        
        Le produit ne sera plus inclus dans les futures livraisons.
        """
        item = self.get_by_id(item_id)
        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False


# ============================================================================
# REPOSITORY SUBSCRIPTIONDELIVERY
# ============================================================================

class SubscriptionDeliveryRepository:
    """
    Gère les livraisons planifiées des abonnements.
    
    Chaque abonnement génère de multiples livraisons planifiées dans le temps.
    Ce repository permet de créer ces planifications et de suivre leur état.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, subscription_id: int, delivery_date: date) -> SubscriptionDelivery:
        """
        Crée une nouvelle livraison planifiée.
        
        Cette méthode est appelée automatiquement lors de la création d'un
        abonnement ou après chaque livraison pour planifier la suivante.
        """
        delivery = SubscriptionDelivery(
            subscription_id=subscription_id,
            delivery_date=delivery_date,
            status=DeliveryStatus.SCHEDULED
        )
        self.db.add(delivery)
        self.db.commit()
        self.db.refresh(delivery)
        return delivery
    
    def get_by_id(self, delivery_id: int) -> Optional[SubscriptionDelivery]:
        """Récupère une livraison par son ID"""
        return self.db.query(SubscriptionDelivery).filter(
            SubscriptionDelivery.id == delivery_id
        ).first()
    
    def get_subscription_deliveries(self, subscription_id: int,
                                   start_date: Optional[date] = None,
                                   end_date: Optional[date] = None) -> List[SubscriptionDelivery]:
        """
        Récupère les livraisons planifiées d'un abonnement sur une période.
        
        Permet d'afficher un calendrier de livraisons futures ou
        l'historique des livraisons passées.
        """
        query = self.db.query(SubscriptionDelivery).filter(
            SubscriptionDelivery.subscription_id == subscription_id
        )
        
        if start_date:
            query = query.filter(SubscriptionDelivery.delivery_date >= start_date)
        if end_date:
            query = query.filter(SubscriptionDelivery.delivery_date <= end_date)
        
        return query.order_by(SubscriptionDelivery.delivery_date).all()
    
    def get_upcoming_deliveries(self, subscription_id: int, days_ahead: int = 30) -> List[SubscriptionDelivery]:
        """
        Récupère les livraisons à venir dans les X prochains jours.
        
        Utile pour afficher au client ses prochaines livraisons planifiées.
        """
        end_date = date.today() + timedelta(days=days_ahead)
        return self.get_subscription_deliveries(subscription_id, date.today(), end_date)
    
    def get_deliveries_for_date(self, delivery_date: date,
                               status: Optional[DeliveryStatus] = None) -> List[SubscriptionDelivery]:
        """
        Récupère toutes les livraisons planifiées pour une date spécifique.
        
        Cette méthode est utilisée par le job automatisé qui génère les
        commandes. Elle identifie toutes les livraisons à traiter aujourd'hui.
        """
        query = self.db.query(SubscriptionDelivery).filter(
            SubscriptionDelivery.delivery_date == delivery_date
        )
        
        if status:
            query = query.filter(SubscriptionDelivery.status == status)
        
        return query.all()
    
    def update(self, delivery_id: int, **kwargs) -> Optional[SubscriptionDelivery]:
        """Met à jour une livraison planifiée"""
        delivery = self.get_by_id(delivery_id)
        if delivery:
            for key, value in kwargs.items():
                if hasattr(delivery, key) and value is not None:
                    setattr(delivery, key, value)
            
            delivery.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(delivery)
        return delivery
    
    def skip(self, delivery_id: int, reason: Optional[str] = None) -> Optional[SubscriptionDelivery]:
        """
        Marque une livraison comme sautée.
        
        Le client peut décider de sauter une livraison spécifique sans
        affecter les suivantes ni annuler tout l'abonnement.
        """
        return self.update(
            delivery_id,
            skipped=True,
            skip_reason=reason,
            status=DeliveryStatus.SKIPPED
        )
    
    def mark_as_processed(self, delivery_id: int, order_id: int) -> Optional[SubscriptionDelivery]:
        """
        Marque une livraison comme traitée et lie la commande générée.
        
        Appelé quand le système génère automatiquement une commande pour
        cette livraison planifiée.
        """
        return self.update(
            delivery_id,
            order_id=order_id,
            status=DeliveryStatus.PROCESSING,
            processed_at=datetime.now(timezone.utc)
        )
    
    def mark_as_delivered(self, delivery_id: int) -> Optional[SubscriptionDelivery]:
        """Marque une livraison comme complétée avec succès"""
        return self.update(delivery_id, status=DeliveryStatus.DELIVERED)
    
    def mark_as_failed(self, delivery_id: int) -> Optional[SubscriptionDelivery]:
        """Marque une livraison comme ayant échoué"""
        return self.update(delivery_id, status=DeliveryStatus.FAILED)


# ============================================================================
# REPOSITORY PRODUCTBUNDLE
# ============================================================================

class ProductBundleRepository:
    """
    Gère les paniers pré-composés (bundles).
    
    Permet de créer, modifier et gérer des offres groupées de produits.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, producer_id: int, name: str, description: Optional[str],
               price: float, discount_percentage: Optional[float] = None,
               image_url: Optional[str] = None, is_active: bool = True,
               valid_from: Optional[datetime] = None,
               valid_until: Optional[datetime] = None,
               stock_quantity: Optional[int] = None) -> ProductBundle:
        """
        Crée un nouveau bundle.
        
        Le bundle est créé vide, les produits doivent être ajoutés ensuite
        via le BundleItemRepository.
        """
        bundle = ProductBundle(
            producer_id=producer_id,
            name=name,
            description=description,
            price=price,
            discount_percentage=discount_percentage,
            image_url=image_url,
            is_active=is_active,
            valid_from=valid_from,
            valid_until=valid_until,
            stock_quantity=stock_quantity
        )
        self.db.add(bundle)
        self.db.commit()
        self.db.refresh(bundle)
        return bundle
    
    def get_by_id(self, bundle_id: int) -> Optional[ProductBundle]:
        """Récupère un bundle par son ID"""
        return self.db.query(ProductBundle).filter(ProductBundle.id == bundle_id).first()
    
    def get_producer_bundles(self, producer_id: int, active_only: bool = True) -> List[ProductBundle]:
        """
        Récupère tous les bundles d'un producteur.
        
        Peut être filtré pour n'afficher que les bundles actifs.
        """
        query = self.db.query(ProductBundle).filter(ProductBundle.producer_id == producer_id)
        
        if active_only:
            query = query.filter(ProductBundle.is_active)
        
        return query.order_by(desc(ProductBundle.created_at)).all()
    
    def get_active_bundles(self) -> List[ProductBundle]:
        """
        Récupère tous les bundles actifs et valides.
        
        Utilisé pour afficher les bundles disponibles aux clients.
        Filtre les bundles selon leur statut et leurs dates de validité.
        """
        now = datetime.now(timezone.utc)
        
        return self.db.query(ProductBundle).filter(
            and_(
                ProductBundle.is_active,
                or_(
                    ProductBundle.valid_from.is_(None),
                    ProductBundle.valid_from <= now
                ),
                or_(
                    ProductBundle.valid_until.is_(None),
                    ProductBundle.valid_until >= now
                )
            )
        ).all()
    
    def update(self, bundle_id: int, **kwargs) -> Optional[ProductBundle]:
        """Met à jour un bundle avec les valeurs fournies"""
        bundle = self.get_by_id(bundle_id)
        if bundle:
            for key, value in kwargs.items():
                if hasattr(bundle, key) and value is not None:
                    setattr(bundle, key, value)
            
            bundle.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(bundle)
        return bundle
    
    def deactivate(self, bundle_id: int) -> Optional[ProductBundle]:
        """Désactive un bundle sans le supprimer"""
        return self.update(bundle_id, is_active=False)
    
    def activate(self, bundle_id: int) -> Optional[ProductBundle]:
        """Réactive un bundle désactivé"""
        return self.update(bundle_id, is_active=True)
    
    def decrease_stock(self, bundle_id: int, quantity: int = 1) -> Optional[ProductBundle]:
        """
        Diminue le stock d'un bundle après achat.
        
        Si le bundle a un stock limité, cette méthode est appelée après
        chaque vente pour mettre à jour le stock disponible.
        """
        bundle = self.get_by_id(bundle_id)
        if bundle and bundle.stock_quantity is not None:
            new_stock = max(0, bundle.stock_quantity - quantity)
            return self.update(bundle_id, stock_quantity=new_stock)
        return bundle
    
    def delete(self, bundle_id: int) -> bool:
        """Supprime physiquement un bundle"""
        bundle = self.get_by_id(bundle_id)
        if bundle:
            self.db.delete(bundle)
            self.db.commit()
            return True
        return False


# ============================================================================
# REPOSITORY BUNDLEITEM
# ============================================================================

class BundleItemRepository:
    """
    Gère les produits inclus dans les bundles.
    
    Permet de définir la composition exacte d'un panier pré-composé.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, bundle_id: int, product_id: int, quantity: int) -> BundleItem:
        """Ajoute un produit à un bundle"""
        item = BundleItem(
            bundle_id=bundle_id,
            product_id=product_id,
            quantity=quantity
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
    
    def get_by_id(self, item_id: int) -> Optional[BundleItem]:
        """Récupère un item de bundle par son ID"""
        return self.db.query(BundleItem).filter(BundleItem.id == item_id).first()
    
    def get_bundle_items(self, bundle_id: int) -> List[BundleItem]:
        """Récupère tous les produits d'un bundle"""
        return self.db.query(BundleItem).filter(BundleItem.bundle_id == bundle_id).all()
    
    def update(self, item_id: int, quantity: int) -> Optional[BundleItem]:
        """Met à jour la quantité d'un produit dans le bundle"""
        item = self.get_by_id(item_id)
        if item:
            item.quantity = quantity
            self.db.commit()
            self.db.refresh(item)
        return item
    
    def delete(self, item_id: int) -> bool:
        """Retire un produit d'un bundle"""
        item = self.get_by_id(item_id)
        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False