from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel

from app.core.database import get_db
from app.core.deps import get_current_user, get_current_user_optional
from app.services.payment_service import PaymentService
from app.models.profiles import ProducerProfile
from app.models.orders import Order
from app.models.payments import Payment, Invoice
from app.models.auth import User
from app.schemas.payments import (
    PaymentCreate, PaymentResponse, PaymentStats,
    PaymentMethodCreate, PaymentMethodResponse,
    RefundCreate, RefundResponse,
    InvoiceResponse,
    ProducerPayoutResponse, ProducerPayoutCalculation
)
from app.models.payments import PaymentStatus, InvoiceStatus, PaymentMethodType, PaymentProvider


# Créer le routeur - le préfixe /api/v1/payments est ajouté par main.py
router = APIRouter(
    prefix="",
    tags=["Payments & Billing"]
)


class ProducerPayoutRequestBody(BaseModel):
    period_start: datetime
    period_end: datetime
    payout_method: Optional[str] = None
    account_details: Optional[Dict[str, Any]] = None
    commission_rate: Decimal = Decimal("0.15")


class PaymentInitiateRequestBody(BaseModel):
    order_id: int
    payment_method: str
    provider: Optional[str] = None
    amount: Decimal
    currency: str = "XAF"


class PaymentInitiateResponseBody(BaseModel):
    payment_id: int
    status: str
    transaction_id: Optional[str] = None
    provider_redirect_url: Optional[str] = None


class PaymentConfirmBody(BaseModel):
    transaction_id: str
    provider_reference: Optional[str] = None


class PaymentMethodCreateCurrentBody(BaseModel):
    type: PaymentMethodType
    last4: Optional[str] = None
    brand: Optional[str] = None
    is_default: bool = False
    stripe_payment_method_id: Optional[str] = None


def _get_current_producer_id(db: Session, user_id: int) -> int:
    producer = db.query(ProducerProfile).filter(ProducerProfile.user_id == user_id).first()
    if not producer:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Profil producteur requis"
        )
    return producer.id


def _parse_datetime_or_date(value: str, field_name: str, end_of_day: bool = False) -> datetime:
    """
    Accepte:
    - YYYY-MM-DD
    - YYYY-MM-DDTHH:MM:SS[.ffffff][+TZ]
    """
    try:
        if len(value) == 10:
            parsed_date = date.fromisoformat(value)
            return datetime.combine(parsed_date, time.max if end_of_day else time.min)

        normalized = value.replace("Z", "+00:00")
        parsed_dt = datetime.fromisoformat(normalized)
        # Le service manipule des datetime naïfs côté DB.
        return parsed_dt.replace(tzinfo=None) if parsed_dt.tzinfo else parsed_dt
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"{field_name} invalide. Utilisez YYYY-MM-DD ou ISO datetime."
        )


def _map_client_payment_method(method: str) -> PaymentMethodType:
    mapping = {
        "card": PaymentMethodType.CARD,
        "credit_card": PaymentMethodType.CARD,
        "debit_card": PaymentMethodType.CARD,
        "stripe": PaymentMethodType.CARD,
        "paypal": PaymentMethodType.CARD,
        "bank_transfer": PaymentMethodType.TRANSFER,
        "transfer": PaymentMethodType.TRANSFER,
        "mobile_money": PaymentMethodType.WALLET,
        "wallet": PaymentMethodType.WALLET,
        "cash": PaymentMethodType.CASH,
    }
    normalized = (method or "").strip().lower()
    if normalized not in mapping:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Méthode de paiement non supportée: {method}"
        )
    return mapping[normalized]


def _map_client_provider(provider: Optional[str]) -> Optional[PaymentProvider]:
    if not provider:
        return None
    normalized = provider.strip().lower()
    if normalized == "stripe":
        return PaymentProvider.STRIPE
    if normalized == "paypal":
        return PaymentProvider.PAYPAL
    # Les providers Mobile Money MVP sont acceptés côté payload, mais non stockés
    # dans l'enum provider actuel.
    if normalized in {"mtn", "orange", "express_union", "mtn_mobile_money", "orange_money"}:
        return None
    return None


# ============================================================================
# ENDPOINTS - PAYMENT (Paiements)
# ============================================================================

@router.post(
    "/initiate",
    response_model=PaymentInitiateResponseBody,
    status_code=status.HTTP_201_CREATED
)
def initiate_payment(
    payload: PaymentInitiateRequestBody,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint orienté parcours client.
    Initialise un paiement pour une commande du client connecté.
    """
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commande introuvable"
        )
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez pas initier le paiement de cette commande"
        )

    payment_method = _map_client_payment_method(payload.payment_method)
    provider = _map_client_provider(payload.provider)
    transaction_id = f"PAY-{payload.order_id}-{current_user.id}-{int(datetime.utcnow().timestamp())}"

    service = PaymentService(db)
    created = service.create_payment(
        PaymentCreate(
            order_id=payload.order_id,
            payment_method=payment_method,
            amount=payload.amount,
            currency=payload.currency,
            provider=provider,
            transaction_id=transaction_id,
            additional_data={
                "provider_payload": payload.provider,
                "source": "initiate"
            }
        )
    )
    return PaymentInitiateResponseBody(
        payment_id=created.id,
        status=created.status.value if hasattr(created.status, "value") else str(created.status),
        transaction_id=created.transaction_id,
        provider_redirect_url=None
    )


@router.get("/{payment_id}/status")
def get_payment_status(
    payment_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retourne l'état simplifié d'un paiement pour polling client.
    """
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paiement introuvable"
        )
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commande liée au paiement introuvable"
        )

    producer_profile = db.query(ProducerProfile).filter(ProducerProfile.user_id == current_user.id).first()
    is_owner = order.user_id == current_user.id
    is_related_producer = bool(producer_profile and order.producer_id == producer_profile.id)
    if not (is_owner or is_related_producer):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé à ce paiement"
        )

    return {
        "payment_id": payment.id,
        "status": payment.status.value if hasattr(payment.status, "value") else str(payment.status),
        "transaction_id": payment.transaction_id
    }


@router.post("/confirm")
def confirm_payment(
    payload: PaymentConfirmBody,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirme un paiement via son transaction_id (flux provider/mobile money).
    """
    service = PaymentService(db)
    payment = service.repository.get_payment_by_transaction_id(payload.transaction_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction introuvable"
        )

    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order or order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez pas confirmer ce paiement"
        )

    updated = service.update_payment_status(payment.id, PaymentStatus.COMPLETED, payload.transaction_id)

    existing_invoice = db.query(Invoice).filter(Invoice.order_id == order.id).first()
    if not existing_invoice:
        service.create_invoice_for_order(order.id)

    return {
        "payment_id": updated.id,
        "status": updated.status.value if hasattr(updated.status, "value") else str(updated.status),
        "transaction_id": updated.transaction_id,
        "provider_reference": payload.provider_reference
    }


@router.get("/history", response_model=List[PaymentResponse])
def get_payment_history(
    role: str = Query("customer", description="customer|producer"),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Historique des paiements pour le client ou le producteur connecté.
    """
    query = db.query(Payment).join(Order, Payment.order_id == Order.id)

    if role == "producer":
        producer_id = _get_current_producer_id(db, current_user.id)
        query = query.filter(Order.producer_id == producer_id)
    else:
        query = query.filter(Order.user_id == current_user.id)

    payments = query.order_by(Payment.created_at.desc()).all()
    return [PaymentResponse.model_validate(item) for item in payments]

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
    start_date: str = Query(..., description="Date de début (YYYY-MM-DD ou ISO datetime)"),
    end_date: str = Query(..., description="Date de fin (YYYY-MM-DD ou ISO datetime)"),
    db: Session = Depends(get_db)
):
    """
    Calcule des statistiques sur les paiements pour une période donnée.
    
    Retourne le nombre total de paiements, les montants par statut,
    et d'autres métriques utiles pour le tableau de bord financier.
    """
    start_dt = _parse_datetime_or_date(start_date, "start_date")
    end_dt = _parse_datetime_or_date(end_date, "end_date", end_of_day=True)

    service = PaymentService(db)
    return service.get_payment_statistics(start_dt, end_dt)


# ============================================================================
# ENDPOINTS - PAYMENTMETHOD (Moyens de paiement sauvegardés)
# ============================================================================

@router.post("/methods", response_model=PaymentMethodResponse, status_code=status.HTTP_201_CREATED)
def create_payment_method(
    payment_method_data: PaymentMethodCreate,
    current_user: User = Depends(get_current_user),  # ✅ FIX SÉCURITÉ: user_id depuis JWT
    db: Session = Depends(get_db)
):
    """
    Sauvegarde un nouveau moyen de paiement pour l'utilisateur connecté.
    
    ⚠️ SÉCURITÉ: Le user_id est automatiquement récupéré depuis le JWT,
    pas depuis le body de la requête (prévient l'usurpation d'identité).
    
    Si is_default=True, tous les autres moyens de cet utilisateur
    seront automatiquement marqués comme non-défaut.
    """
    service = PaymentService(db)
    # ✅ Injecter le user_id depuis le JWT
    return service.create_payment_method_for_user(payment_method_data, current_user.id)


@router.post("/methods/me", response_model=PaymentMethodResponse, status_code=status.HTTP_201_CREATED)
def create_my_payment_method(
    payment_method_data: PaymentMethodCreateCurrentBody,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sauvegarde un moyen de paiement pour l'utilisateur connecté.
    """
    service = PaymentService(db)
    payload = PaymentMethodCreate(
        type=payment_method_data.type,
        last4=payment_method_data.last4,
        brand=payment_method_data.brand,
        is_default=payment_method_data.is_default,
        stripe_payment_method_id=payment_method_data.stripe_payment_method_id
    )
    return service.create_payment_method_for_user(payload, current_user.id)


@router.get("/methods/{method_id}", response_model=PaymentMethodResponse)
def get_payment_method(
    method_id: int,
    db: Session = Depends(get_db)
):
    """Récupère les détails d'un moyen de paiement spécifique."""
    service = PaymentService(db)
    return service.get_payment_method(method_id)


@router.get("/methods", response_model=List[PaymentMethodResponse])
def get_my_payment_methods(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère les moyens de paiement de l'utilisateur connecté.
    """
    service = PaymentService(db)
    return service.get_user_payment_methods(current_user.id)


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
    user_id: Optional[int] = Query(None, description="ID de l'utilisateur propriétaire"),
    current_user=Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Définit un moyen de paiement comme moyen par défaut.
    
    L'ancien moyen par défaut (s'il existe) sera automatiquement
    marqué comme non-défaut.
    """
    resolved_user_id = user_id or (current_user.id if current_user else None)
    if not resolved_user_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="user_id requis si aucun token d'authentification n'est fourni"
        )

    service = PaymentService(db)
    return service.set_default_payment_method(method_id, resolved_user_id)


@router.delete("/methods/{method_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment_method(
    method_id: int,
    user_id: Optional[int] = Query(None, description="ID de l'utilisateur propriétaire"),
    current_user=Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Supprime un moyen de paiement sauvegardé.
    
    L'utilisateur ne pourra plus l'utiliser pour de futurs paiements,
    mais les paiements déjà effectués avec ce moyen restent en base.
    """
    resolved_user_id = user_id or (current_user.id if current_user else None)
    if not resolved_user_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="user_id requis si aucun token d'authentification n'est fourni"
        )

    service = PaymentService(db)
    service.delete_payment_method(method_id, resolved_user_id)


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


@router.get("/invoices", response_model=List[InvoiceResponse])
def get_my_invoices(
    role: str = Query("customer", description="customer|producer"),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Liste des factures de l'utilisateur connecté.
    - customer: factures liées à ses commandes.
    - producer: factures liées aux commandes qu'il a reçues.
    """
    query = db.query(Invoice).join(Order, Invoice.order_id == Order.id)
    if role == "producer":
        producer_id = _get_current_producer_id(db, current_user.id)
        query = query.filter(Order.producer_id == producer_id)
    else:
        query = query.filter(Order.user_id == current_user.id)

    invoices = query.order_by(Invoice.issue_date.desc()).all()
    return [InvoiceResponse.model_validate(invoice) for invoice in invoices]


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

@router.get("/producer/earnings")
def get_current_producer_earnings(
    period_start: Optional[datetime] = Query(None, description="Début de la période"),
    period_end: Optional[datetime] = Query(None, description="Fin de la période"),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Donne un résumé des gains du producteur connecté.
    """
    now = datetime.utcnow()
    period_start = period_start or datetime(now.year, now.month, 1)
    period_end = period_end or now

    producer_id = _get_current_producer_id(db, current_user.id)
    service = PaymentService(db)
    calc = service.calculate_producer_payout(
        producer_id=producer_id,
        period_start=period_start,
        period_end=period_end,
        commission_rate=Decimal("0.05")
    )
    return {
        "currency": "XAF",
        "total_revenue": calc.gross_amount,
        "commission_rate": float(calc.commission_rate * Decimal("100")),
        "commission_amount": calc.commission_amount,
        "net_amount": calc.net_amount,
        "period_breakdown": [
            {
                "month": period_start.strftime("%Y-%m"),
                "gross": calc.gross_amount,
                "net": calc.net_amount
            }
        ]
    }


@router.get("/producer/payout-preview", response_model=ProducerPayoutCalculation)
def get_current_producer_payout_preview(
    period_start: datetime = Query(..., description="Début de la période"),
    period_end: datetime = Query(..., description="Fin de la période"),
    commission_rate: Decimal = Query(Decimal("0.05"), description="Taux de commission"),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    producer_id = _get_current_producer_id(db, current_user.id)
    service = PaymentService(db)
    return service.calculate_producer_payout(
        producer_id=producer_id,
        period_start=period_start,
        period_end=period_end,
        commission_rate=commission_rate
    )


@router.post("/producer/payout-request", response_model=ProducerPayoutResponse, status_code=status.HTTP_201_CREATED)
def create_current_producer_payout_request(
    payload: ProducerPayoutRequestBody,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Crée une demande de virement pour le producteur connecté.
    Les champs payout_method/account_details sont acceptés pour compatibilité MVP.
    """
    producer_id = _get_current_producer_id(db, current_user.id)
    service = PaymentService(db)
    return service.create_producer_payout(
        producer_id=producer_id,
        period_start=payload.period_start,
        period_end=payload.period_end,
        commission_rate=payload.commission_rate
    )


@router.get("/producer/payouts", response_model=List[ProducerPayoutResponse])
def get_current_producer_payouts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    producer_id = _get_current_producer_id(db, current_user.id)
    service = PaymentService(db)
    return service.get_producer_payouts(producer_id=producer_id, skip=skip, limit=limit)

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
