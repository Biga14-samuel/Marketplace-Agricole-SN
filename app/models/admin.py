from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey,
    Text, Numeric, Date, UniqueConstraint, func, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base
import enum


# ============ ÉNUMÉRATIONS ============

class ActionType(str, enum.Enum):
    """
    Types d'actions administratives possibles.
    Cette énumération garantit que seules des actions valides sont enregistrées.
    """
    # Gestion des utilisateurs
    USER_CREATE = "user_create"
    USER_UPDATE = "user_update"
    USER_DELETE = "user_delete"
    USER_BAN = "user_ban"
    USER_UNBAN = "user_unban"
    USER_VERIFY = "user_verify"
    
    # Gestion des produits
    PRODUCT_CREATE = "product_create"
    PRODUCT_UPDATE = "product_update"
    PRODUCT_DELETE = "product_delete"
    PRODUCT_APPROVE = "product_approve"
    PRODUCT_REJECT = "product_reject"
    
    # Gestion des commandes
    ORDER_CANCEL = "order_cancel"
    ORDER_REFUND = "order_refund"
    
    # Modération de contenu
    CONTENT_MODERATE = "content_moderate"
    CONTENT_DELETE = "content_delete"
    
    # Configuration système
    SETTING_UPDATE = "setting_update"
    COMMISSION_UPDATE = "commission_update"
    TAX_RATE_UPDATE = "tax_rate_update"
    
    # Autres actions
    EXPORT_DATA = "export_data"
    BULK_OPERATION = "bulk_operation"


class ModerationStatus(str, enum.Enum):
    """
    Statuts possibles pour un contenu en cours de modération.
    Le flux typique est : pending → under_review → approved/rejected
    """
    PENDING = "pending"           # En attente de révision
    UNDER_REVIEW = "under_review" # En cours d'examen par un modérateur
    APPROVED = "approved"         # Contenu approuvé, pas de problème
    REJECTED = "rejected"         # Contenu rejeté et supprimé/masqué
    DISMISSED = "dismissed"       # Signalement considéré comme non fondé


class SettingType(str, enum.Enum):
    """
    Types de valeurs pour les paramètres système.
    Permet de valider et convertir correctement les valeurs.
    """
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    JSON = "json"


# ============ MODÈLES D'ADMINISTRATION ============

class AdminAction(Base):
    """
    Journal d'audit de toutes les actions administratives.
    """
    __tablename__ = "admin_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Qui a effectué l'action ?
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Quel type d'action ?
    action_type = Column(SQLEnum(ActionType), nullable=False, index=True)
    
    # Description textuelle de l'action pour les humains
    description = Column(Text, nullable=True)
    
    # Sur quelle entité l'action a-t-elle été effectuée ?
    target_entity = Column(String(50), nullable=True, index=True)  # "user", "product", "order"
    target_id = Column(Integer, nullable=True, index=True)
    
    # Quelles modifications ont été apportées ?
    changes = Column(JSONB, nullable=True)
    
    # Métadonnées de la requête pour la sécurité
    ip_address = Column(String(45), nullable=True)  # Support IPv6
    user_agent = Column(Text, nullable=True)
    
    # Contexte additionnel (raison, notes, etc.)
    # CORRECTION : Ajout du '=' et de 'Column'
    extra_data = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)
    
    # Relations
    admin = relationship("User", back_populates="admin_actions")
    
    def __repr__(self):
        return f"<AdminAction {self.action_type} by admin_id={self.admin_id}>"


class BannedUser(Base):
    """
    Gestion des utilisateurs bannis de la plateforme.
    """
    __tablename__ = "banned_users"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Utilisateur banni (relation directe)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True
    )
    
    # Qui a banni cet utilisateur ?
    banned_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Pourquoi le bannissement ?
    reason = Column(Text, nullable=False)
    
    # Catégorie de la violation
    violation_type = Column(String(50), nullable=True)
    
    # Durée du bannissement
    is_permanent = Column(Boolean, nullable=False, default=False)
    banned_until = Column(DateTime, nullable=True)
    
    # Est-ce que c'est une récidive ?
    previous_bans_count = Column(Integer, nullable=False, default=0)
    
    # Preuves ou détails supplémentaires
    evidence = Column(JSONB, nullable=True)
    
    # Statut du bannissement
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Historique
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    unbanned_at = Column(DateTime, nullable=True)
    unbanned_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    unban_reason = Column(Text, nullable=True)
    
    # Relations
    # CORRECTION : Les noms dans foreign_keys doivent correspondre aux variables de colonnes
    user = relationship("User", foreign_keys=[user_id], back_populates="ban_record")
    banner = relationship("User", foreign_keys=[banned_by])
    unbanner = relationship("User", foreign_keys=[unbanned_by])
    
    def __repr__(self):
        ban_type = "permanent" if self.is_permanent else f"until {self.banned_until}"
        return f"<BannedUser user_id={self.user_id} ({ban_type})>"


class ContentModeration(Base):
    """
    Système de modération du contenu généré par les utilisateurs.
    """
    __tablename__ = "content_moderations"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Quel type de contenu est signalé ?
    content_type = Column(
        String(50),
        nullable=False,
        index=True
    )
    
    content_id = Column(Integer, nullable=False, index=True)
    
    # Qui a signalé ce contenu ?
    reported_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Pourquoi ce contenu est-il signalé ?
    reason = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    
    # Statut de la modération
    status = Column(
        SQLEnum(ModerationStatus),
        nullable=False,
        default=ModerationStatus.PENDING,
        index=True
    )
    
    # Priorité du signalement
    priority = Column(Integer, nullable=False, default=0)
    
    # Qui a examiné ce signalement ?
    reviewed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    # Décision du modérateur
    moderator_notes = Column(Text, nullable=True)
    action_taken = Column(String(100), nullable=True)
    
    # Si plusieurs utilisateurs signalent le même contenu
    reports_count = Column(Integer, nullable=False, default=1)
    
    # Métadonnées additionnelles
    # CORRECTION : Ajout du '=' et de 'Column'
    extra_data = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relations
    reporter = relationship("User", foreign_keys=[reported_by])
    reviewer = relationship("User", foreign_keys=[reviewed_by])
    
    # Index composé
    __table_args__ = (
        UniqueConstraint('content_type', 'content_id', 'reported_by', name='uq_content_report'),
    )
    
    def __repr__(self):
        return f"<ContentModeration {self.content_type}#{self.content_id} status={self.status}>"


# ============ MODÈLES DE CONFIGURATION ============

class SystemSetting(Base):
    """
    Paramètres configurables du système.
    
    Au lieu de coder en dur des valeurs dans le code source, on les stocke dans cette
    table pour pouvoir les modifier sans redéployer l'application. C'est comme les
    réglages de votre téléphone : vous pouvez les changer sans réinstaller le système.
    
    Exemples de paramètres :
    - "maintenance_mode" = true/false
    - "min_order_amount" = 10.00
    - "max_products_per_page" = 50
    - "featured_categories" = ["bio", "local"]
    """
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Clé unique du paramètre (ex: "maintenance_mode", "min_order_amount")
    key = Column(String(100), nullable=False, unique=True, index=True)
    
    # Valeur stockée sous forme de chaîne, convertie selon le type
    value = Column(Text, nullable=False)
    
    # Type de données pour valider et convertir correctement
    type = Column(SQLEnum(SettingType), nullable=False, default=SettingType.STRING)
    
    # Documentation du paramètre
    description = Column(Text, nullable=True)
    
    # Ce paramètre est-il visible publiquement via l'API ?
    # Les paramètres publics peuvent être lus par tous (ex: "site_name")
    # Les paramètres privés sont réservés aux admins (ex: "stripe_secret_key")
    is_public = Column(Boolean, nullable=False, default=False)
    
    # Validation des valeurs
    allowed_values = Column(JSONB, nullable=True)  # Liste des valeurs autorisées
    min_value = Column(Numeric(10, 2), nullable=True)  # Pour les nombres
    max_value = Column(Numeric(10, 2), nullable=True)
    
    # Métadonnées
    category = Column(String(50), nullable=True)  # "general", "payment", "email", etc.
    requires_restart = Column(Boolean, nullable=False, default=False)  # Faut-il redémarrer l'app ?
    
    # Historique
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    updated_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relations
    updater = relationship("User", back_populates="system_settings_updated")
    
    def __repr__(self):
        return f"<SystemSetting {self.key}={self.value}>"


class Commission(Base):
    """
    Taux de commission prélevés sur les ventes.
    
    Votre plateforme prend une commission sur chaque vente. Ces taux peuvent varier
    selon le producteur (certains ont négocié des taux préférentiels) ou la catégorie
    de produits (les produits frais ont peut-être un taux différent des produits secs).
    
    C'est comme dans un centre commercial : certains magasins paient un loyer fixe,
    d'autres un pourcentage du chiffre d'affaires, et certains une combinaison des deux.
    """
    __tablename__ = "commissions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # À qui s'applique cette commission ?
    producer_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )  # NULL = taux par défaut
    
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )  # NULL = toutes catégories
    
    # Montant de la commission
    # Deux modèles possibles : pourcentage OU montant fixe OU les deux
    percentage = Column(Numeric(5, 2), nullable=True)  # Ex: 15.50 pour 15.5%
    fixed_amount = Column(Numeric(10, 2), nullable=True)  # Ex: 2.00 pour 2€ fixe
    
    # Seuils (optionnels)
    min_transaction_amount = Column(Numeric(10, 2), nullable=True)  # Commission appliquée si vente >= X
    max_transaction_amount = Column(Numeric(10, 2), nullable=True)  # Commission plafonnée si vente <= Y
    
    # Période de validité
    valid_from = Column(Date, nullable=False, index=True)
    valid_until = Column(Date, nullable=True, index=True)  # NULL = indéfiniment
    
    # Actif ou non
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Notes et raison de ce taux spécifique
    notes = Column(Text, nullable=True)
    
    # Historique
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relations
    producer = relationship("User", foreign_keys=[producer_id], back_populates="commissions")
    category = relationship("Category", back_populates="commissions")
    creator = relationship("User", foreign_keys=[created_by])
    
    # Contrainte : au moins percentage OU fixed_amount doit être défini
    # (Cette logique sera vérifiée au niveau du service)
    
    def __repr__(self):
        return f"<Commission producer_id={self.producer_id} rate={self.percentage}%>"


class TaxRate(Base):
    """
    Taux de TVA applicables selon le pays et la catégorie de produits.
    
    La TVA varie énormément selon le pays et le type de produit. En France, les produits
    alimentaires de base ont un taux réduit de 5.5%, les produits standard 20%, etc.
    En Allemagne, c'est différent. Ce modèle permet de gérer toute cette complexité.
    
    C'est comme un tableau de correspondance fiscal : pour chaque combinaison
    pays/catégorie, on sait quel taux de TVA appliquer.
    """
    __tablename__ = "tax_rates"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Où s'applique ce taux ?
    country = Column(String(2), nullable=False, index=True)  # Code ISO à 2 lettres (FR, DE, etc.)
    
    # À quelle catégorie de produits ?
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )  # NULL = taux par défaut du pays
    
    # Taux de TVA en pourcentage
    rate = Column(Numeric(5, 2), nullable=False)  # Ex: 20.00 pour 20%
    
    # Nom descriptif du taux (ex: "Taux normal", "Taux réduit", "Taux super-réduit")
    name = Column(String(100), nullable=True)
    
    # Description légale (référence aux textes de loi)
    description = Column(Text, nullable=True)
    
    # Actif ou non
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Période de validité (les taux changent avec les lois)
    valid_from = Column(Date, nullable=False, index=True)
    valid_until = Column(Date, nullable=True, index=True)  # NULL = indéfiniment
    
    # Métadonnées
    regulation_reference = Column(String(200), nullable=True)  # Référence légale
    
    # Historique
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relations
    category = relationship("Category", back_populates="tax_rates")
    
    # Contrainte d'unicité : un seul taux actif par pays/catégorie/période
    __table_args__ = (
        UniqueConstraint('country', 'category_id', 'valid_from', name='uq_tax_rate_period'),
    )
    
    def __repr__(self):
        return f"<TaxRate {self.country} {self.rate}%>"