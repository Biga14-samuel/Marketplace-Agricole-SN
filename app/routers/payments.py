from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from decimal import Decimal

from app.core.database import get_db
from app.services.payment_service import PaymentService
from app.schemas.payments import (
    PaymentCreate, PaymentResponse, PaymentStats,
    PaymentMethodCreate, PaymentMethodResponse,
    RefundCreate, RefundResponse,
    InvoiceResponse,
    ProducerPayoutResponse, ProducerPayoutCalculation
)
from app.models.payments import PaymentStatus, InvoiceStatus


# Créer le routeur - le préfixe /api/v1/payments est ajouté par main.py
router = APIRouter(
    prefix="",
    tags=["Payments & Billing"]
)


# ============================================================================
# ENDPOINTS - PAYMENT (Paiements)
# ============================================================================

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db)
):
    """
    Crée un nouveau paiement pour une commande.
    
    Le paiement est initialement créé avec le statut 'pending'.
    Vous devrez ensuite mettre à jour son statut selon le résultat
    de la transaction avec votre fournisseur de paiement (Stripe, PayPal, etc.).
    """
    service = PaymentService(db)
    return service.create_payment(payment_data)


@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'un paiement spécifique."""
    service = PaymentService(db)
    return service.get_payment(payment_id)


@router.get("/order/{order_id}", response_model=List[PaymentResponse])
def get_order_payments(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère tous les paiements associés à une commande.
    
    Utile pour voir l'historique complet des transactions d'une commande,
    notamment en cas de paiements multiples ou de remboursements.
    """
    service = PaymentService(db)
    return service.get_payments_by_order(order_id)


@router.patch("/{payment_id}/status", response_model=PaymentResponse)
def update_payment_status(
    payment_id: int,
    new_status: PaymentStatus,
    transaction_id: str = None,
    db: Session = Depends(get_db)
):
    """
    Met à jour le statut d'un paiement.
    
    Cet endpoint est typiquement appelé après avoir reçu une confirmation
    de votre fournisseur de paiement (webhook Stripe, notification PayPal, etc.).
    
    Si le paiement passe à 'completed' et que la commande est entièrement payée,
    le statut de la commande sera automatiquement mis à jour.
    """
    service = PaymentService(db)
    return service.update_payment_status(payment_id, new_status, transaction_id)


@router.get("/stats/", response_model=PaymentStats)
def get_payment_statistics(
    start_date: datetime = Query(..., description="Date de début de la période"),
    end_date: datetime = Query(..., description="Date de fin de la période"),
    db: Session = Depends(get_db)
):
    """
    Calcule des statistiques sur les paiements pour une période donnée.
    
    Retourne le nombre total de paiements, les montants par statut,
    et d'autres métriques utiles pour le tableau de bord financier.
    """
    service = PaymentService(db)
    return service.get_payment_statistics(start_date, end_date)


# ============================================================================
# ENDPOINTS - PAYMENTMETHOD (Moyens de paiement sauvegardés)
# ============================================================================

@router.post("/methods", response_model=PaymentMethodResponse, status_code=status.HTTP_201_CREATED)
def create_payment_method(
    payment_method_data: PaymentMethodCreate,
    db: Session = Depends(get_db)
):
    """
    Sauvegarde un nouveau moyen de paiement pour un utilisateur.
    
    Permet aux clients de sauvegarder leurs cartes bancaires ou autres
    moyens de paiement pour faciliter leurs achats futurs.
    
    Si is_default=True, tous les autres moyens de cet utilisateur
    seront automatiquement marqués comme non-défaut.
    """
    service = PaymentService(db)
    return service.create_payment_method(payment_method_data)


@router.get("/methods/{method_id}", response_model=PaymentMethodResponse)
def get_payment_method(
    method_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'un moyen de paiement spécifique."""
    service = PaymentService(db)
    return service.get_payment_method(method_id)


@router.get("/methods/user/{user_id}", response_model=List[PaymentMethodResponse])
def get_user_payment_methods(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère tous les moyens de paiement sauvegardés d'un utilisateur.
    
    Les moyens sont triés avec le moyen par défaut en premier,
    puis par date de création (plus récents en premier).
    """
    service = PaymentService(db)
    return service.get_user_payment_methods(user_id)


@router.patch("/methods/{method_id}/set-default", response_model=PaymentMethodResponse)
def set_default_payment_method(
    method_id: int,
    user_id: int = Query(..., description="ID de l'utilisateur propriétaire"),
    db: Session = Depends(get_db)
):
    """
    Définit un moyen de paiement comme moyen par défaut.
    
    L'ancien moyen par défaut (s'il existe) sera automatiquement
    marqué comme non-défaut.
    """
    service = PaymentService(db)
    return service.set_default_payment_method(method_id, user_id)


@router.delete("/methods/{method_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment_method(
    method_id: int,
    user_id: int = Query(..., description="ID de l'utilisateur propriétaire"),
    db: Session = Depends(get_db)
):
    """
    Supprime un moyen de paiement sauvegardé.
    
    L'utilisateur ne pourra plus l'utiliser pour de futurs paiements,
    mais les paiements déjà effectués avec ce moyen restent en base.
    """
    service = PaymentService(db)
    service.delete_payment_method(method_id, user_id)


# ============================================================================
# ENDPOINTS - REFUND (Remboursements)
# ============================================================================

@router.post("/refunds", response_model=RefundResponse, status_code=status.HTTP_201_CREATED)
def create_refund(
    refund_data: RefundCreate,
    db: Session = Depends(get_db)
):
    """
    Crée une demande de remboursement pour un paiement.
    
    Le remboursement peut être partiel (montant inférieur au paiement)
    ou total. Le système vérifie automatiquement que le montant demandé
    ne dépasse pas le montant disponible (paiement - remboursements déjà effectués).
    
    Le remboursement est créé avec le statut 'pending' et devra être
    traité via l'endpoint process_refund une fois effectué.
    """
    service = PaymentService(db)
    return service.create_refund(refund_data)


@router.patch("/refunds/{refund_id}/process", response_model=RefundResponse)
def process_refund(
    refund_id: int,
    db: Session = Depends(get_db)
):
    """
    Marque un remboursement comme traité/complété.
    
    Cet endpoint devrait être appelé après avoir effectivement
    remboursé le client via votre fournisseur de paiement.
    
    Si le paiement est entièrement remboursé après ce traitement,
    son statut sera automatiquement mis à jour vers 'refunded'.
    """
    service = PaymentService(db)
    return service.process_refund(refund_id)


# ============================================================================
# ENDPOINTS - INVOICE (Factures)
# ============================================================================

@router.post("/invoices/order/{order_id}", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice_for_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Génère une facture pour une commande.
    
    La facture reçoit automatiquement un numéro unique au format INV-YYYY-NNNN.
    Les montants (sous-total, TVA, total) sont calculés automatiquement à partir
    du montant total de la commande.
    
    Une seule facture peut exister par commande.
    """
    service = PaymentService(db)
    return service.create_invoice_for_order(order_id)


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'une facture spécifique."""
    service = PaymentService(db)
    return service.get_invoice(invoice_id)


@router.get("/invoices/order/{order_id}", response_model=InvoiceResponse)
def get_invoice_by_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """Récupère la facture associée à une commande."""
    service = PaymentService(db)
    return service.get_invoice_by_order(order_id)


@router.patch("/invoices/{invoice_id}/status", response_model=InvoiceResponse)
def update_invoice_status(
    invoice_id: int,
    new_status: InvoiceStatus,
    db: Session = Depends(get_db)
):
    """
    Met à jour le statut d'une facture.
    
    Les statuts possibles sont :
    - draft : Brouillon, pas encore envoyée
    - sent : Envoyée au client
    - paid : Payée par le client
    - overdue : En retard de paiement
    """
    service = PaymentService(db)
    return service.update_invoice_status(invoice_id, new_status)


# ============================================================================
# ENDPOINTS - PRODUCERPAYOUT (Versements producteurs)
# ============================================================================

@router.get("/payouts/calculate", response_model=ProducerPayoutCalculation)
def calculate_producer_payout(
    producer_id: int = Query(..., description="ID du producteur"),
    period_start: datetime = Query(..., description="Début de la période"),
    period_end: datetime = Query(..., description="Fin de la période"),
    commission_rate: Decimal = Query(Decimal("0.15"), description="Taux de commission (0.15 = 15%)"),
    db: Session = Depends(get_db)
):
    """
    Calcule le versement pour un producteur sur une période donnée.
    
    Cette fonction analyse toutes les commandes livrées du producteur
    pendant la période et calcule :
    - Le montant brut de ses ventes
    - La commission à prélever
    - Le montant net à lui verser
    
    Utile pour prévisualiser un versement avant de le créer officiellement.
    """
    service = PaymentService(db)
    return service.calculate_producer_payout(
        producer_id, period_start, period_end, commission_rate
    )


@router.post("/payouts", response_model=ProducerPayoutResponse, status_code=status.HTTP_201_CREATED)
def create_producer_payout(
    producer_id: int = Query(..., description="ID du producteur"),
    period_start: datetime = Query(..., description="Début de la période"),
    period_end: datetime = Query(..., description="Fin de la période"),
    commission_rate: Decimal = Query(Decimal("0.15"), description="Taux de commission"),
    db: Session = Depends(get_db)
):
    """
    Crée un versement producteur basé sur le calcul automatique.
    
    Le versement est créé avec le statut 'pending' et devra être
    marqué comme 'completed' une fois le virement effectué.
    
    Un seul versement peut exister par producteur et par période.
    """
    service = PaymentService(db)
    return service.create_producer_payout(
        producer_id, period_start, period_end, commission_rate
    )


@router.get("/payouts/{payout_id}", response_model=ProducerPayoutResponse)
def get_producer_payout(
    payout_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'un versement spécifique."""
    service = PaymentService(db)
    return service.get_producer_payout(payout_id)


@router.get("/payouts/producer/{producer_id}", response_model=List[ProducerPayoutResponse])
def get_producer_payouts(
    producer_id: int,
    skip: int = Query(0, ge=0, description="Nombre d'éléments à sauter (pagination)"),
    limit: int = Query(100, ge=1, le=100, description="Nombre maximum d'éléments à retourner"),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les versements d'un producteur.
    
    Les versements sont triés par date de fin de période (plus récents en premier)
    et paginés pour de meilleures performances.
    """
    service = PaymentService(db)
    return service.get_producer_payouts(producer_id, skip, limit)


@router.patch("/payouts/{payout_id}/process", response_model=ProducerPayoutResponse)
def process_payout(
    payout_id: int,
    db: Session = Depends(get_db)
):
    """
    Marque un versement comme traité/complété.
    
    Cet endpoint devrait être appelé après avoir effectivement
    viré l'argent au producteur via votre système bancaire.
    
    La date de paiement (paid_at) est automatiquement enregistrée.
    """
    service = PaymentService(db)
    return service.process_payout(payout_id)


@router.post("/payouts/generate-monthly", response_model=List[ProducerPayoutResponse])
def generate_monthly_payouts(
    year: int = Query(..., description="Année du mois à traiter"),
    month: int = Query(..., ge=1, le=12, description="Mois à traiter (1-12)"),
    db: Session = Depends(get_db)
):
    """
    Génère automatiquement tous les versements mensuels.
    
    Cette fonction crée un versement pour chaque producteur actif
    ayant eu des ventes livrées pendant le mois spécifié.
    
    Les producteurs sans ventes ne reçoivent pas de versement.
    Si un versement existe déjà pour un producteur, il est ignoré.
    
    Cet endpoint est typiquement appelé par une tâche planifiée
    au début de chaque mois pour calculer les versements du mois précédent.
    """
    service = PaymentService(db)
    return service.generate_monthly_payouts(year, month)