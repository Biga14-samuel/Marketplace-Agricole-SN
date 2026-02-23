"""
Fichier d'initialisation des modèles SQLAlchemy.

Ce fichier importe tous les modèles de l'application pour s'assurer qu'ils sont
tous enregistrés dans Base.metadata. Ceci est crucial pour:
1. La création automatique des tables via Base.metadata.create_all()
2. La génération des migrations Alembic
3. La résolution des relations bidirectionnelles entre modèles

Important: Tous les modèles doivent être importés ici, même s'ils ne sont pas
explicitement exportés dans __all__.
"""

from app.core.database import Base
import importlib

# ============= Modèles d'authentification =============
from .auth import (  # noqa: F401
    User,              # Utilisateur principal
    Role,              # Rôles système (admin, producer, customer)
    RefreshToken,      # Tokens JWT pour le rafraîchissement
    PasswordReset,     # Réinitialisation de mot de passe
    EmailVerification, # Vérification d'email
    LoginHistory,      # Historique des connexions
    user_roles,        # Table de liaison User-Role   
)

# ============= Modèles de profils =============
from .profiles import (  # noqa: F401
    CustomerProfile,   # Profil client
    Address,           # Adresses de livraison/facturation
    ProducerProfile,   # Profil producteur (ferme/entreprise)
    ProducerDocument,  # Documents légaux du producteur
    ProducerSchedule,  # Horaires d'ouverture
    PickupPoint,       # Points de retrait
    PickupSlot         # Créneaux de retrait
)

# ============= Modèles de produits =============
from .products import (  # noqa: F401
    Product,            # Produit principal
    Category,           # Catégorie hiérarchique
    Tag,                # Tags transversaux (bio, local, etc.)
    Unit,               # Unités de mesure (kg, L, pièce)
    ProductImage,       # Images de produits
    ProductVariant,     # Variantes (tailles, formats)
    ProductAvailability, # Disponibilité saisonnière
    StockMovement,      # Historique des mouvements de stock
    StockAlert,         # Alertes de stock bas
    product_tags        # Table de liaison Product-Tag
)

# ============= Modèles de commandes =============
from .orders import (  # noqa: F401
    Cart,               # Panier temporaire
    CartItem,           # Article dans le panier
    Order,              # Commande finalisée
    OrderItem,          # Article d'une commande
    OrderStatusHistory, # Historique des changements de statut
    OrderTracking,      # Suivi en temps réel
    OrderStatus,        # Enum des statuts de commande
    DeliveryType        # Enum pickup/delivery
)

# ============= Modèles de paiement =============
from .payments import (  # noqa: F401
    Payment,            # Transaction de paiement
    PaymentMethod,      # Moyens de paiement sauvegardés
    Refund,             # Remboursements
    Invoice,            # Factures
    ProducerPayout,     # Versements aux producteurs
    PaymentStatus,      # Enum des statuts de paiement
    PaymentMethodType,  # Enum des types de paiement
    PaymentProvider,    # Enum des fournisseurs (Stripe, PayPal)
    RefundStatus,       # Enum des statuts de remboursement
    InvoiceStatus,      # Enum des statuts de facture
    PayoutStatus        # Enum des statuts de versement
)

# ============= Modèles de livraison =============
from .delivery import (  # noqa: F401
    DeliveryZone,       # Zone de livraison d'un producteur
    DeliverySchedule,   # Planning de livraison par zone
    Delivery,           # Livraison d'une commande
    DeliveryRoute,      # Tournée de livraison
    DeliveryRouteItem,  # Étape dans une tournée
    DeliveryDriver      # Profil livreur
)

# ============= Modèles de promotions et fidélité =============
from .promotions import (  # noqa: F401
    Coupon,                 # Code promotionnel
    CouponUsage,            # Historique d'utilisation des coupons
    Promotion,              # Promotion sur produit
    LoyaltyProgram,         # Configuration du programme de fidélité
    LoyaltyPoint,           # Solde de points d'un client
    LoyaltyTransaction,     # Historique des mouvements de points
    Reward,                 # Récompense disponible
    RewardRedemption,       # Échange de récompense
    CouponType,             # Enum des types de coupon
    PromotionType,          # Enum des types de promotion
    LoyaltyTransactionType, # Enum des types de transaction
    RewardType              # Enum des types de récompense
)

# ============= Modèles d'avis =============
from .reviews import (  # noqa: F401
    Review,              # Avis sur un produit
    ProducerReview,      # Avis sur un producteur
    ReviewHelpful,       # Vote d'utilité sur un avis
    ReviewReport,        # Signalement d'avis inapproprié
    ReviewReportReason,  # Enum des raisons de signalement
    ReviewReportStatus   # Enum des statuts de signalement
)

# ============= Modèles de wishlist et suivi =============
from .wishlist import (  # noqa: F401
    Wishlist,           # Liste de souhaits
    WishlistItem,       # Produit dans une wishlist
    ProductFollow,      # Suivi d'un produit
    ProducerFollow      # Suivi d'un producteur
)

# ============= Modèles d'administration =============
from .admin import *  # noqa: F401, F403

# ============= Modèles d'analytics =============
from .analytics import *  # noqa: F401, F403

# ============= Modèles de communication =============
from .communication import *  # noqa: F401, F403

# ============= Modèles d'événements =============
from .event import *  # noqa: F401, F403

# ============= Modèles d'abonnements =============
from .subscriptions import *  # noqa: F401, F403

# ============= Modèles CMS =============
from .cms import *  # noqa: F401, F403

# ============= Export public =============
__all__ = [
    # Table de liaison User-Role
    "Base",
    "User",
    "Role",
    "CustomerProfile",
    "ProducerProfile",
    "Address",
    "Product",
    "Category",
    "ProductImage",
    "Cart",
    "Order",
    "OrderItem",
    "Payment",
    "Invoice",
    "Delivery",
    "DeliveryZone",
    "Coupon",
    "LoyaltyPoint",
    "Review",
    "ProducerReview",
    "Wishlist",
    "ProductFollow",
]