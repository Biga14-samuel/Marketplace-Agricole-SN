from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Date, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base

# ============================================================================
# Énumérations pour les abonnements et paniers
# ============================================================================

class SubscriptionFrequency(str, enum.Enum):
    """
    Fréquences possibles pour les abonnements de paniers récurrents.
    
    Ces fréquences déterminent à quelle cadence un client reçoit son panier.
    Le choix de la fréquence impacte la planification des livraisons et
    permet aux producteurs d'organiser leur production en conséquence.
    """
    WEEKLY = "weekly"  # Livraison chaque semaine (tous les 7 jours)
    BIWEEKLY = "biweekly"  # Livraison toutes les deux semaines (tous les 14 jours)
    MONTHLY = "monthly"  # Livraison chaque mois (tous les 30 jours environ)

class SubscriptionStatus(str, enum.Enum):
    """
    États possibles d'un abonnement durant son cycle de vie.
    
    Un abonnement passe par différents états qui déterminent s'il doit
    générer des commandes ou non. Cette gestion d'état permet une grande
    flexibilité pour les clients tout en maintenant la cohérence du système.
    """
    ACTIVE = "active"  # Abonnement actif, génère des commandes automatiquement
    PAUSED = "paused"  # Temporairement en pause, ne génère pas de commandes
    CANCELLED = "cancelled"  # Annulé définitivement, ne peut plus être réactivé


class DeliveryStatus(str, enum.Enum):
    """
    États d'une livraison planifiée dans le cadre d'un abonnement.
    
    Chaque livraison programmée a son propre statut qui suit son évolution
    depuis la planification jusqu'à la livraison effective ou l'annulation.
    """
    SCHEDULED = "scheduled"  # Planifiée mais pas encore traitée
    PROCESSING = "processing"  # En cours de préparation (commande créée)
    DELIVERED = "delivered"  # Livrée avec succès
    SKIPPED = "skipped"  # Sautée volontairement par le client
    FAILED = "failed"  # Échec de livraison pour une raison quelconque


# ============================================================================
# MODÈLE SUBSCRIPTION : Abonnement panier récurrent
# ============================================================================

class Subscription(Base):
    """
    Représente un abonnement à un panier récurrent pour un client.
    
    Un abonnement est un contrat entre un client et un producteur pour recevoir
    régulièrement le même panier de produits. C'est un modèle gagnant-gagnant :
    - Le client gagne du temps en ne devant plus commander manuellement
    - Le producteur a une visibilité sur ses ventes futures et peut mieux planifier
    
    L'abonnement génère automatiquement des commandes selon la fréquence définie.
    Le client garde le contrôle total : il peut sauter des livraisons, mettre en
    pause ou annuler son abonnement à tout moment.
    
    Exemple d'utilisation :
    Marie s'abonne au "Panier légumes de saison" du Producteur Bio Local pour
    recevoir un panier chaque semaine le vendredi. L'abonnement coûte 25 euros
    par semaine. Chaque mardi, le système génère automatiquement une commande
    qui sera livrée le vendredi. Si Marie part en vacances, elle peut sauter
    une ou plusieurs semaines sans annuler tout son abonnement.
    """
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identification du client et du producteur
    # Le client est celui qui reçoit les paniers régulièrement
    # Le producteur est celui qui fournit les produits de l'abonnement
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    producer_id = Column(Integer, ForeignKey("producer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Informations de l'abonnement
    # Le nom permet au client de donner un titre personnalisé à son abonnement
    # Exemple : "Mon panier bio hebdomadaire" ou "Légumes pour la famille"
    name = Column(String(200), nullable=False)
    
    # La fréquence détermine l'intervalle entre chaque livraison
    # Cette valeur est cruciale car elle pilote la génération automatique des commandes
    frequency = Column(SQLEnum(SubscriptionFrequency), nullable=False)
    
    # Le prix est le montant facturé à chaque livraison
    # Ce montant peut être différent de la somme des produits individuels
    # (par exemple avec une réduction pour abonnement)
    price = Column(Numeric(10, 2), nullable=False)
    
    # Le statut contrôle si l'abonnement génère ou non des commandes
    # Un abonnement ACTIVE génère automatiquement des commandes
    # Un abonnement PAUSED est temporairement suspendu mais peut être réactivé
    # Un abonnement CANCELLED est définitivement terminé
    status = Column(SQLEnum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE, nullable=False, index=True)
    
    # next_delivery est la date de la prochaine livraison planifiée
    # Cette date est mise à jour automatiquement après chaque livraison
    # selon la fréquence définie (7 jours pour weekly, 14 pour biweekly, etc.)
    next_delivery = Column(Date, nullable=False, index=True)
    
    # Horodatage pour suivre le cycle de vie de l'abonnement
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # cancelled_at enregistre quand l'abonnement a été annulé
    # Cette information est importante pour les statistiques et pour savoir
    # combien de temps un client est resté abonné avant d'annuler
    cancelled_at = Column(DateTime, nullable=True)
    
    # Informations optionnelles sur la livraison
    # Si le client a des préférences particulières pour la livraison
    delivery_notes = Column(Text, nullable=True)
    
    # Relations avec les autres tables
    # Un abonnement appartient à un utilisateur et un producteur
    user = relationship("User", backref="subscriptions")
    producer = relationship("ProducerProfile", backref="subscriptions")
    
    # Un abonnement contient plusieurs items (les produits du panier)
    items = relationship("SubscriptionItem", back_populates="subscription", cascade="all, delete-orphan")
    
    # Un abonnement génère de multiples livraisons planifiées dans le temps
    deliveries = relationship("SubscriptionDelivery", back_populates="subscription", cascade="all, delete-orphan", order_by="SubscriptionDelivery.delivery_date.desc()")

    def __repr__(self):
        return f"<Subscription(id={self.id}, name='{self.name}', user_id={self.user_id}, status={self.status})>"


# ============================================================================
# MODÈLE SUBSCRIPTIONITEM : Produit dans un abonnement
# ============================================================================

class SubscriptionItem(Base):
    """
    Représente un produit inclus dans un abonnement récurrent.
    
    Chaque abonnement contient un ou plusieurs produits avec leurs quantités.
    Par exemple, un "Panier légumes" pourrait contenir 3 tomates, 2 salades,
    et 1 kg de carottes. Ces items définissent exactement ce que le client
    recevra à chaque livraison.
    
    L'attribut is_flexible est une fonctionnalité avancée qui permet au
    producteur de varier légèrement le contenu selon la disponibilité saisonnière.
    Par exemple, si le client a commandé des tomates mais qu'elles ne sont pas
    disponibles cette semaine, le producteur pourrait les remplacer par un
    produit équivalent si is_flexible est True.
    """
    __tablename__ = "subscription_items"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien vers l'abonnement parent
    # Chaque item appartient à un et un seul abonnement
    subscription_id = Column(Integer, ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Identification du produit inclus dans l'abonnement
    # Ce produit doit appartenir au producteur de l'abonnement
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Quantité du produit à livrer à chaque fois
    # Cette quantité reste constante pour chaque livraison de l'abonnement
    # Par exemple : 3 pour "3 tomates" ou 2 pour "2 salades"
    quantity = Column(Integer, nullable=False, default=1)
    
    # is_flexible indique si le producteur peut substituer ce produit
    # True : le producteur peut remplacer par un produit similaire si besoin
    # False : le produit doit être exactement celui-ci, sinon la livraison échoue
    # Cette flexibilité est particulièrement utile pour les produits saisonniers
    is_flexible = Column(Boolean, default=False, nullable=False)
    
    # Horodatage pour tracer quand l'item a été ajouté ou modifié
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relations
    subscription = relationship("Subscription", back_populates="items")
    product = relationship("Product", backref="subscription_items")

    def __repr__(self):
        return f"<SubscriptionItem(id={self.id}, subscription_id={self.subscription_id}, product_id={self.product_id}, qty={self.quantity})>"


# ============================================================================
# MODÈLE SUBSCRIPTIONDELIVERY : Livraison planifiée d'un abonnement
# ============================================================================

class SubscriptionDelivery(Base):
    """
    Représente une livraison planifiée dans le cadre d'un abonnement.
    
    Quand un abonnement est créé, le système génère automatiquement plusieurs
    livraisons futures (typiquement pour les 3-6 prochains mois). Chaque
    livraison planifiée est une instance de ce modèle.
    
    Le cycle de vie d'une livraison :
    1. SCHEDULED : La livraison est planifiée mais pas encore traitée
    2. PROCESSING : Une commande a été générée, préparation en cours
    3. DELIVERED : La commande a été livrée avec succès
    4. Ou SKIPPED : Le client a choisi de sauter cette livraison
    5. Ou FAILED : Un problème a empêché la livraison
    
    Ce système de livraisons planifiées permet au client de voir à l'avance
    toutes ses futures livraisons et de les gérer individuellement (sauter une
    semaine s'il part en vacances, par exemple).
    """
    __tablename__ = "subscription_deliveries"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien vers l'abonnement parent
    subscription_id = Column(Integer, ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Date prévue pour cette livraison
    # Cette date est calculée automatiquement selon la fréquence de l'abonnement
    # Par exemple, si l'abonnement est hebdomadaire et commence le 1er janvier,
    # les livraisons seront planifiées pour le 8, 15, 22, 29 janvier, etc.
    delivery_date = Column(Date, nullable=False, index=True)
    
    # order_id relie cette livraison planifiée à une commande réelle
    # NULL si la commande n'a pas encore été générée
    # Rempli automatiquement quand le système crée la commande pour cette livraison
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Le statut suit l'évolution de cette livraison spécifique
    status = Column(SQLEnum(DeliveryStatus), default=DeliveryStatus.SCHEDULED, nullable=False, index=True)
    
    # skipped indique si le client a volontairement sauté cette livraison
    # Différent de FAILED qui indique un problème indépendant de la volonté du client
    # Quand skipped est True, le statut devient automatiquement SKIPPED
    skipped = Column(Boolean, default=False, nullable=False)
    
    # Si le client saute cette livraison, on peut enregistrer pourquoi
    skip_reason = Column(Text, nullable=True)
    
    # Horodatage
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # processed_at enregistre quand la commande a été générée
    processed_at = Column(DateTime, nullable=True)
    
    # Relations
    subscription = relationship("Subscription", back_populates="deliveries")
    order = relationship("Order", backref="subscription_delivery")

    def __repr__(self):
        return f"<SubscriptionDelivery(id={self.id}, subscription_id={self.subscription_id}, date={self.delivery_date}, status={self.status})>"


# ============================================================================
# MODÈLE PRODUCTBUNDLE : Panier pré-composé thématique
# ============================================================================

class ProductBundle(Base):
    """
    Représente un panier pré-composé de produits vendus ensemble avec une réduction.
    
    Les paniers thématiques (bundles) sont une stratégie marketing puissante :
    - Pour le client : découvrir plusieurs produits à prix avantageux
    - Pour le producteur : écouler rapidement plusieurs produits, faire découvrir sa gamme
    
    Exemples de paniers thématiques :
    - "Panier découverte légumes d'hiver" : 5 légumes de saison différents (-15%)
    - "Kit apéritif local" : fromage, charcuterie, pain, vin (-20%)
    - "Panier famille nombreuse" : quantités importantes de produits de base (-10%)
    - "Coffret découverte fermier" : sélection de tous les produits du producteur
    
    Un bundle peut être limité dans le temps (offre spéciale) ou permanent.
    Le prix peut être fixe ou calculé avec un pourcentage de réduction sur
    le total des produits inclus.
    """
    __tablename__ = "product_bundles"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identification du producteur qui propose ce panier
    # Tous les produits du bundle doivent appartenir à ce producteur
    producer_id = Column(Integer, ForeignKey("producer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Informations marketing du bundle
    # Le nom doit être accrocheur et descriptif : "Panier gourmand du terroir"
    name = Column(String(200), nullable=False)
    
    # La description explique le contenu et l'intérêt du bundle
    # Exemple : "Découvrez nos meilleurs fromages affinés avec du pain artisanal
    # et une confiture maison. Parfait pour un plateau de fromage convivial !"
    description = Column(Text, nullable=True)
    
    # Image du bundle pour le rendre attractif visuellement
    image_url = Column(String(500), nullable=True)
    
    # Stratégie de prix : soit un prix fixe, soit une réduction en pourcentage
    # Si discount_percentage est défini, le prix est calculé automatiquement
    # Sinon, on utilise le prix fixe spécifié
    price = Column(Numeric(10, 2), nullable=False)
    discount_percentage = Column(Numeric(5, 2), nullable=True)  # Exemple : 15.00 pour 15% de réduction
    
    # Activation et période de validité
    # is_active permet de désactiver temporairement le bundle sans le supprimer
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # valid_from et valid_until définissent la période de validité de l'offre
    # Utile pour les offres spéciales saisonnières ou promotionnelles
    # NULL signifie pas de limite de temps
    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    
    # Limitations de stock
    # stock_quantity suit combien de bundles sont disponibles
    # NULL signifie stock illimité (tant que les produits composants sont dispo)
    stock_quantity = Column(Integer, nullable=True)
    
    # Horodatage
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relations
    producer = relationship("ProducerProfile", backref="product_bundles")
    
    # Un bundle contient plusieurs items (produits avec leurs quantités)
    items = relationship("BundleItem", back_populates="bundle", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ProductBundle(id={self.id}, name='{self.name}', producer_id={self.producer_id}, active={self.is_active})>"


# ============================================================================
# MODÈLE BUNDLEITEM : Produit dans un panier pré-composé
# ============================================================================

class BundleItem(Base):
    """
    Représente un produit inclus dans un panier pré-composé (bundle).
    
    Chaque bundle contient un ou plusieurs produits avec leurs quantités
    respectives. Par exemple, un "Panier brunch" pourrait contenir :
    - 1 pain de campagne
    - 6 œufs frais
    - 1 pot de confiture (250g)
    - 1 fromage frais (200g)
    
    La quantité est fixe et définie par le producteur. Le client achète
    le bundle complet tel quel, il ne peut pas modifier les quantités
    individuelles (sinon ce ne serait plus un bundle mais un panier normal).
    """
    __tablename__ = "bundle_items"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien vers le bundle parent
    bundle_id = Column(Integer, ForeignKey("product_bundles.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Produit inclus dans le bundle
    # Ce produit doit appartenir au même producteur que le bundle
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Quantité de ce produit dans le bundle
    # Cette quantité est fixe et fait partie de la définition du bundle
    quantity = Column(Integer, nullable=False, default=1)
    
    # Horodatage pour tracer les modifications du contenu du bundle
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relations
    bundle = relationship("ProductBundle", back_populates="items")
    product = relationship("Product", backref="bundle_items")

    def __repr__(self):
        return f"<BundleItem(id={self.id}, bundle_id={self.bundle_id}, product_id={self.product_id}, qty={self.quantity})>"