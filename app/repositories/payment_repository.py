from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List, Optional
from datetime import datetime, timezone
from decimal import Decimal

from app.models.payments import (
    Payment, PaymentMethod, Refund, Invoice, ProducerPayout,
    PaymentStatus, InvoiceStatus, PayoutStatus, RefundStatus
)
from app.schemas.payments import (
    PaymentCreate, PaymentUpdate,
    PaymentMethodCreate, PaymentMethodUpdate,
    RefundCreate, RefundUpdate,
    InvoiceCreate, InvoiceUpdate,
    ProducerPayoutCreate, ProducerPayoutUpdate
)


class PaymentRepository:
    """
    Repository pour gérer les opérations CRUD sur les paiements.
    
    Rappel architecture :
    - Repository utilise flush() pour obtenir les IDs sans valider la transaction
    - Le Service appelant utilisera commit() pour valider l'ensemble
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    # ========================================================================
    # OPÉRATIONS CRUD - PAYMENT
    # ========================================================================
    
    def create_payment(self, payment_data: PaymentCreate) -> Payment:
        """
        Crée un nouveau paiement dans la base de données.
        
        Args:
            payment_data: Données du paiement à créer
            
        Returns:
            L'objet Payment créé avec son ID
        """
        payment = Payment(**payment_data.model_dump())
        self.db.add(payment)
        self.db.flush()  # Obtient l'ID sans commit
        self.db.refresh(payment)
        return payment
    
    def get_payment_by_id(self, payment_id: int) -> Optional[Payment]:
        """Récupère un paiement par son ID"""
        return self.db.query(Payment).filter(Payment.id == payment_id).first()
    
    def get_payment_by_transaction_id(self, transaction_id: str) -> Optional[Payment]:
        """Récupère un paiement par son ID de transaction externe"""
        return self.db.query(Payment).filter(
            Payment.transaction_id == transaction_id
        ).first()
    
    def get_payments_by_order(self, order_id: int) -> List[Payment]:
        """Récupère tous les paiements d'une commande"""
        return self.db.query(Payment).filter(
            Payment.order_id == order_id
        ).order_by(Payment.created_at.desc()).all()
    
    def get_payments_by_status(
        self, 
        status: PaymentStatus,
        skip: int = 0,
        limit: int = 100
    ) -> List[Payment]:
        """Récupère tous les paiements ayant un statut donné"""
        return self.db.query(Payment).filter(
            Payment.status == status
        ).offset(skip).limit(limit).all()
    
    def update_payment(self, payment: Payment, payment_data: PaymentUpdate) -> Payment:
        """
        Met à jour un paiement existant.
        
        Args:
            payment: L'objet Payment à mettre à jour
            payment_data: Nouvelles données
            
        Returns:
            L'objet Payment mis à jour
        """
        update_data = payment_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(payment, field, value)
        
        self.db.flush()
        self.db.refresh(payment)
        return payment
    
    def get_total_amount_by_order(self, order_id: int) -> Decimal:
        """Calcule le montant total payé pour une commande"""
        result = self.db.query(func.sum(Payment.amount)).filter(
            and_(
                Payment.order_id == order_id,
                Payment.status == PaymentStatus.COMPLETED
            )
        ).scalar()
        
        return result if result else Decimal("0")
    
    # ========================================================================
    # OPÉRATIONS CRUD - PAYMENTMETHOD
    # ========================================================================
    
    def create_payment_method(
        self, 
        payment_method_data: PaymentMethodCreate
    ) -> PaymentMethod:
        """
        Crée un nouveau moyen de paiement sauvegardé.
        
        Si is_default=True, tous les autres moyens de l'utilisateur
        sont marqués comme non-défaut.
        """
        # Si ce moyen est défini comme défaut, retirer le défaut des autres
        if payment_method_data.is_default:
            self.db.query(PaymentMethod).filter(
                PaymentMethod.user_id == payment_method_data.user_id
            ).update({"is_default": False})
        
        payment_method = PaymentMethod(**payment_method_data.model_dump())
        self.db.add(payment_method)
        self.db.flush()
        self.db.refresh(payment_method)
        return payment_method
    
    def get_payment_method_by_id(self, method_id: int) -> Optional[PaymentMethod]:
        """Récupère un moyen de paiement par son ID"""
        return self.db.query(PaymentMethod).filter(
            PaymentMethod.id == method_id
        ).first()
    
    def get_payment_methods_by_user(self, user_id: int) -> List[PaymentMethod]:
        """Récupère tous les moyens de paiement d'un utilisateur"""
        return self.db.query(PaymentMethod).filter(
            PaymentMethod.user_id == user_id
        ).order_by(PaymentMethod.is_default.desc(), PaymentMethod.created_at.desc()).all()
    
    def get_default_payment_method(self, user_id: int) -> Optional[PaymentMethod]:
        """Récupère le moyen de paiement par défaut d'un utilisateur"""
        return self.db.query(PaymentMethod).filter(
            and_(
                PaymentMethod.user_id == user_id,
                PaymentMethod.is_default
            )
        ).first()
    
    def update_payment_method(
        self, 
        payment_method: PaymentMethod,
        payment_method_data: PaymentMethodUpdate
    ) -> PaymentMethod:
        """Met à jour un moyen de paiement"""
        # Si on définit celui-ci comme défaut, retirer le défaut des autres
        if payment_method_data.is_default:
            self.db.query(PaymentMethod).filter(
                and_(
                    PaymentMethod.user_id == payment_method.user_id,
                    PaymentMethod.id != payment_method.id
                )
            ).update({"is_default": False})
        
        update_data = payment_method_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(payment_method, field, value)
        
        self.db.flush()
        self.db.refresh(payment_method)
        return payment_method
    
    def delete_payment_method(self, payment_method: PaymentMethod) -> bool:
        """Supprime un moyen de paiement"""
        self.db.delete(payment_method)
        self.db.flush()
        return True
    
    # ========================================================================
    # OPÉRATIONS CRUD - REFUND
    # ========================================================================
    
    def create_refund(self, refund_data: RefundCreate) -> Refund:
        """Crée un nouveau remboursement"""
        refund = Refund(**refund_data.model_dump())
        self.db.add(refund)
        self.db.flush()
        self.db.refresh(refund)
        return refund
    
    def get_refund_by_id(self, refund_id: int) -> Optional[Refund]:
        """Récupère un remboursement par son ID"""
        return self.db.query(Refund).filter(Refund.id == refund_id).first()
    
    def get_refunds_by_payment(self, payment_id: int) -> List[Refund]:
        """Récupère tous les remboursements d'un paiement"""
        return self.db.query(Refund).filter(
            Refund.payment_id == payment_id
        ).order_by(Refund.created_at.desc()).all()
    
    def update_refund(self, refund: Refund, refund_data: RefundUpdate) -> Refund:
        """Met à jour un remboursement"""
        update_data = refund_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(refund, field, value)
        
        # Si le statut passe à completed, enregistrer la date de traitement
        if refund_data.status == RefundStatus.COMPLETED and not refund.processed_at:
            refund.processed_at = datetime.utcnow(timezone.utc)
        
        self.db.flush()
        self.db.refresh(refund)
        return refund
    
    def get_total_refunded_for_payment(self, payment_id: int) -> Decimal:
        """Calcule le montant total remboursé pour un paiement"""
        result = self.db.query(func.sum(Refund.amount)).filter(
            and_(
                Refund.payment_id == payment_id,
                Refund.status == RefundStatus.COMPLETED
            )
        ).scalar()
        
        return result if result else Decimal("0")
    
    # ========================================================================
    # OPÉRATIONS CRUD - INVOICE
    # ========================================================================
    
    def create_invoice(self, invoice_data: InvoiceCreate) -> Invoice:
        """Crée une nouvelle facture"""
        invoice = Invoice(**invoice_data.model_dump())
        self.db.add(invoice)
        self.db.flush()
        self.db.refresh(invoice)
        return invoice
    
    def get_invoice_by_id(self, invoice_id: int) -> Optional[Invoice]:
        """Récupère une facture par son ID"""
        return self.db.query(Invoice).filter(Invoice.id == invoice_id).first()
    
    def get_invoice_by_order(self, order_id: int) -> Optional[Invoice]:
        """Récupère la facture d'une commande"""
        return self.db.query(Invoice).filter(Invoice.order_id == order_id).first()
    
    def get_invoice_by_number(self, invoice_number: str) -> Optional[Invoice]:
        """Récupère une facture par son numéro"""
        return self.db.query(Invoice).filter(
            Invoice.invoice_number == invoice_number
        ).first()
    
    def get_invoices_by_status(
        self,
        status: InvoiceStatus,
        skip: int = 0,
        limit: int = 100
    ) -> List[Invoice]:
        """Récupère toutes les factures ayant un statut donné"""
        return self.db.query(Invoice).filter(
            Invoice.status == status
        ).offset(skip).limit(limit).all()
    
    def update_invoice(self, invoice: Invoice, invoice_data: InvoiceUpdate) -> Invoice:
        """Met à jour une facture"""
        update_data = invoice_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(invoice, field, value)
        
        self.db.flush()
        self.db.refresh(invoice)
        return invoice
    
    # ========================================================================
    # OPÉRATIONS CRUD - PRODUCERPAYOUT
    # ========================================================================
    
    def create_producer_payout(
        self, 
        payout_data: ProducerPayoutCreate
    ) -> ProducerPayout:
        """Crée un nouveau versement producteur"""
        payout = ProducerPayout(**payout_data.model_dump())
        self.db.add(payout)
        self.db.flush()
        self.db.refresh(payout)
        return payout
    
    def get_payout_by_id(self, payout_id: int) -> Optional[ProducerPayout]:
        """Récupère un versement par son ID"""
        return self.db.query(ProducerPayout).filter(
            ProducerPayout.id == payout_id
        ).first()
    
    def get_payouts_by_producer(
        self,
        producer_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[ProducerPayout]:
        """Récupère tous les versements d'un producteur"""
        return self.db.query(ProducerPayout).filter(
            ProducerPayout.producer_id == producer_id
        ).order_by(ProducerPayout.period_end.desc()).offset(skip).limit(limit).all()
    
    def get_payouts_by_status(
        self,
        status: PayoutStatus,
        skip: int = 0,
        limit: int = 100
    ) -> List[ProducerPayout]:
        """Récupère tous les versements ayant un statut donné"""
        return self.db.query(ProducerPayout).filter(
            ProducerPayout.status == status
        ).offset(skip).limit(limit).all()
    
    def get_pending_payouts(self) -> List[ProducerPayout]:
        """Récupère tous les versements en attente"""
        return self.db.query(ProducerPayout).filter(
            ProducerPayout.status == PayoutStatus.PENDING
        ).all()
    
    def update_producer_payout(
        self,
        payout: ProducerPayout,
        payout_data: ProducerPayoutUpdate
    ) -> ProducerPayout:
        """Met à jour un versement producteur"""
        update_data = payout_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(payout, field, value)
        
        # Si le statut passe à completed, enregistrer la date de paiement
        if payout_data.status == PayoutStatus.COMPLETED and not payout.paid_at:
            payout.paid_at = datetime.utcnow(timezone.utc)
        
        self.db.flush()
        self.db.refresh(payout)
        return payout
    
    def check_payout_exists_for_period(
        self,
        producer_id: int,
        period_start: datetime,
        period_end: datetime
    ) -> bool:
        """
        Vérifie si un versement existe déjà pour cette période.
        Utile pour éviter les doublons lors de la génération automatique.
        """
        existing = self.db.query(ProducerPayout).filter(
            and_(
                ProducerPayout.producer_id == producer_id,
                ProducerPayout.period_start == period_start,
                ProducerPayout.period_end == period_end
            )
        ).first()
        
        return existing is not None