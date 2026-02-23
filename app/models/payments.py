from sqlalchemy import Column, Integer, String, Numeric, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

# ============================================================================
# Définition des statuts et types possibles
# ============================================================================

class PaymentStatus(str, enum.Enum):
    """
    Statuts possibles pour une transaction de paiement.
    - pending : En attente de traitement
    - completed : Paiement réussi et validé
    - failed : Échec de la transaction
    - refunded : Montant remboursé au client
    """
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethodType(str, enum.Enum):
    """
    Types de moyens de paiement acceptés.
    """
    CARD = "card"
    TRANSFER = "transfer"
    CASH = "cash"
    WALLET = "wallet"


class PaymentProvider(str, enum.Enum):
    """
    Fournisseurs de services de paiement.
    """
    STRIPE = "stripe"
    PAYPAL = "paypal"


class RefundStatus(str, enum.Enum):
    """
    Statuts d'un remboursement.
    """
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class InvoiceStatus(str, enum.Enum):
    """
    Statuts d'une facture.
    - draft : Brouillon, non envoyée
    - sent : Envoyée au client
    - paid : Payée
    - overdue : En retard de paiement
    """
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"


class PayoutStatus(str, enum.Enum):
    """
    Statuts d'un versement producteur.
    """
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"


# ============================================================================
# MODÈLE PAYMENT : Transaction de paiement
# ============================================================================

class Payment(Base):
    """
    Représente une transaction de paiement liée à une commande.
    
    Chaque paiement enregistre tous les détails de la transaction :
    montant, moyen de paiement, statut, et informations du fournisseur.
    """
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien avec la commande
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    
    # Informations de paiement
    payment_method = Column(SQLEnum(PaymentMethodType), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)  # Montant avec 2 décimales
    currency = Column(String(3), default="XAF", nullable=False)  # Code devise (ISO 4217)
    
    # Statut et suivi
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False, index=True)
    
    # Intégration fournisseur de paiement
    transaction_id = Column(String(255), unique=True, index=True)  # ID de transaction externe
    provider = Column(SQLEnum(PaymentProvider), nullable=True)
    
    # Métadonnées additionnelles (stockées en JSON)
    # Peut contenir : informations carte, détails erreur, données fournisseur, etc.
    additional_data = Column(JSON, nullable=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    order = relationship("Order", back_populates="payments")
    refunds = relationship("Refund", back_populates="payment", cascade="all, delete-orphan")


# ============================================================================
# MODÈLE PAYMENTMETHOD : Moyens de paiement sauvegardés
# ============================================================================

class PaymentMethod(Base):
    """
    Représente un moyen de paiement sauvegardé par un utilisateur.
    
    Permet aux clients de sauvegarder leurs cartes ou autres moyens
    pour faciliter les paiements futurs, sans re-saisir les informations.
    """
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien avec l'utilisateur
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Informations du moyen de paiement
    type = Column(SQLEnum(PaymentMethodType), nullable=False)
    
    # Pour les cartes : 4 derniers chiffres et marque (Visa, Mastercard, etc.)
    last4 = Column(String(4), nullable=True)
    brand = Column(String(50), nullable=True)
    
    # Gestion du moyen par défaut
    is_default = Column(Boolean, default=False, nullable=False)
    
    # ID du moyen de paiement chez le fournisseur (ex: Stripe)
    stripe_payment_method_id = Column(String(255), unique=True, nullable=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="payment_methods")


# ============================================================================
# MODÈLE REFUND : Remboursement
# ============================================================================

class Refund(Base):
    """
    Représente un remboursement lié à un paiement.
    
    Quand une commande est annulée ou qu'un produit est retourné,
    un remboursement peut être créé pour rendre l'argent au client.
    """
    __tablename__ = "refunds"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien avec le paiement original
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False, index=True)
    
    # Informations du remboursement
    amount = Column(Numeric(10, 2), nullable=False)  # Peut être partiel
    reason = Column(Text, nullable=True)  # Raison du remboursement
    
    # Statut
    status = Column(SQLEnum(RefundStatus), default=RefundStatus.PENDING, nullable=False)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime, nullable=True)  # Quand le remboursement a été traité
    
    # Relations
    payment = relationship("Payment", back_populates="refunds")


# ============================================================================
# MODÈLE INVOICE : Facture
# ============================================================================

class Invoice(Base):
    """
    Représente une facture générée pour une commande.
    
    Chaque commande doit avoir une facture officielle avec un numéro unique,
    détaillant les montants HT, taxes, et total TTC.
    """
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien avec la commande
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True, index=True)
    
    # Numéro de facture (ex: INV-2025-0001)
    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    
    # Dates
    issue_date = Column(DateTime, default=datetime.utcnow, nullable=False)  # Date d'émission
    due_date = Column(DateTime, nullable=True)  # Date d'échéance (si paiement différé)
    
    # Montants
    subtotal = Column(Numeric(10, 2), nullable=False)  # Sous-total HT
    tax_amount = Column(Numeric(10, 2), default=0, nullable=False)  # Montant de TVA
    total = Column(Numeric(10, 2), nullable=False)  # Total TTC
    
    # Statut
    status = Column(SQLEnum(InvoiceStatus), default=InvoiceStatus.DRAFT, nullable=False, index=True)
    
    # Fichier PDF de la facture
    file_path = Column(String(500), nullable=True)  # Chemin vers le PDF généré
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    order = relationship("Order", back_populates="invoice")


# ============================================================================
# Versement producteur
# ============================================================================

class ProducerPayout(Base):
    """
    Représente un versement périodique à un producteur.
    
    À la fin de chaque période (semaine, mois), on calcule ce qui revient
    au producteur après déduction de notre commission sur ses ventes.
    """
    __tablename__ = "producer_payouts"

    id = Column(Integer, primary_key=True, index=True)
    
    # Lien avec le producteur
    producer_id = Column(Integer, ForeignKey("producer_profiles.id"), nullable=False, index=True)
    
    # Période couverte par ce versement
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    # Calcul des montants
    gross_amount = Column(Numeric(10, 2), nullable=False)  # Montant brut des ventes
    commission = Column(Numeric(10, 2), nullable=False)  # Commission prélevée
    net_amount = Column(Numeric(10, 2), nullable=False)  # Montant net à verser
    
    # Statut du versement
    status = Column(SQLEnum(PayoutStatus), default=PayoutStatus.PENDING, nullable=False, index=True)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    paid_at = Column(DateTime, nullable=True)  # Date du versement effectif
    
    # Relations
    producer = relationship("ProducerProfile", back_populates="payouts")