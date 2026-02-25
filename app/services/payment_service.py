from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from fastapi import HTTPException, status

from app.models.profiles import ProducerProfile
from app.repositories.payment_repository import PaymentRepository
from app.models.payments import (
    Payment, Invoice, PaymentStatus, RefundStatus, InvoiceStatus, PayoutStatus
)
from app.models.orders import Order, OrderStatus, PaymentStatus as OrderPaymentStatus
from app.schemas.payments import (
    PaymentCreate, PaymentUpdate, PaymentResponse, PaymentStats,
    PaymentMethodCreate, PaymentMethodUpdate, PaymentMethodResponse,
    RefundCreate, RefundUpdate, RefundResponse,
    InvoiceCreate, InvoiceUpdate, InvoiceResponse,
    ProducerPayoutCreate, ProducerPayoutUpdate, ProducerPayoutResponse,
    ProducerPayoutCalculation
)


class PaymentService:
    """
    Service gérant toute la logique métier des paiements et facturations.
    
    Architecture de transaction :
    - Le Repository utilise flush() pour obtenir les IDs
    - Le Service utilise commit() pour valider les transactions atomiques
    - En cas d'erreur, le rollback est automatique grâce au context manager
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = PaymentRepository(db)
    
    # ========================================================================
    # LOGIQUE MÉTIER - PAYMENT
    # ========================================================================
    
    def create_payment(self, payment_data: PaymentCreate) -> PaymentResponse:
        """
        Crée un nouveau paiement pour une commande.
        
        Vérifie que la commande existe et n'est pas déjà entièrement payée.
        """
        try:
            # Vérifier que la commande existe
            order = self.db.query(Order).filter(Order.id == payment_data.order_id).first()
            if not order:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Commande {payment_data.order_id} non trouvée"
                )
            
            # Vérifier que le montant du paiement ne dépasse pas le total de la commande
            total_paid = self.repository.get_total_amount_by_order(payment_data.order_id)
            if total_paid + payment_data.amount > order.total_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Le montant du paiement dépasse le total de la commande"
                )
            
            # Créer le paiement
            payment = self.repository.create_payment(payment_data)
            
            # Valider la transaction
            self.db.commit()
            self.db.refresh(payment)
            
            return PaymentResponse.model_validate(payment)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création du paiement : {str(e)}"
            )
    
    def get_payment(self, payment_id: int) -> PaymentResponse:
        """Récupère un paiement par son ID"""
        payment = self.repository.get_payment_by_id(payment_id)
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Paiement {payment_id} non trouvé"
            )
        return PaymentResponse.model_validate(payment)
    
    def get_payments_by_order(self, order_id: int) -> List[PaymentResponse]:
        """Récupère tous les paiements d'une commande"""
        payments = self.repository.get_payments_by_order(order_id)
        return [PaymentResponse.model_validate(p) for p in payments]
    
    def update_payment_status(
        self, 
        payment_id: int, 
        new_status: PaymentStatus,
        transaction_id: Optional[str] = None
    ) -> PaymentResponse:
        """
        Met à jour le statut d'un paiement.
        
        Si le paiement passe à 'completed', met à jour le statut de la commande.
        """
        try:
            payment = self.repository.get_payment_by_id(payment_id)
            if not payment:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Paiement {payment_id} non trouvé"
                )
            
            # Préparer les données de mise à jour
            update_data = PaymentUpdate(status=new_status)
            if transaction_id:
                update_data.transaction_id = transaction_id
            
            # Mettre à jour le paiement
            payment = self.repository.update_payment(payment, update_data)
            
            # Si le paiement est complété, vérifier si la commande est entièrement payée
            if new_status == PaymentStatus.COMPLETED:
                self._check_and_update_order_payment_status(payment.order_id)
            
            self.db.commit()
            self.db.refresh(payment)
            
            return PaymentResponse.model_validate(payment)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la mise à jour du paiement : {str(e)}"
            )
    
    def _check_and_update_order_payment_status(self, order_id: int):
        """
        Vérifie si une commande est entièrement payée et met à jour son statut.
        
        Méthode privée appelée après la complétion d'un paiement.
        """
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        
        total_paid = self.repository.get_total_amount_by_order(order_id)
        
        if total_paid >= order.total_amount:
            # La commande est entièrement payée
            if order.status == OrderStatus.PENDING:
                order.status = OrderStatus.CONFIRMED
                self.db.flush()
    
    def get_payment_statistics(self, start_date: datetime, end_date: datetime) -> PaymentStats:
        """
        Calcule des statistiques sur les paiements pour une période donnée.
        """
        payments = self.db.query(Payment).filter(
            and_(
                Payment.created_at >= start_date,
                Payment.created_at <= end_date
            )
        ).all()
        
        total_amount = sum(p.amount for p in payments)
        completed_amount = sum(
            p.amount for p in payments if p.status == PaymentStatus.COMPLETED
        )
        pending_amount = sum(
            p.amount for p in payments if p.status == PaymentStatus.PENDING
        )
        failed_count = sum(
            1 for p in payments if p.status == PaymentStatus.FAILED
        )
        refunded_amount = sum(
            p.amount for p in payments if p.status == PaymentStatus.REFUNDED
        )
        
        return PaymentStats(
            total_payments=len(payments),
            total_amount=Decimal(str(total_amount)),
            completed_amount=Decimal(str(completed_amount)),
            pending_amount=Decimal(str(pending_amount)),
            failed_count=failed_count,
            refunded_amount=Decimal(str(refunded_amount))
        )
    
    # ========================================================================
    # LOGIQUE MÉTIER - PAYMENTMETHOD
    # ========================================================================
    
    def create_payment_method_for_user(
        self, 
        payment_method_data: PaymentMethodCreate,
        user_id: int  # ✅ FIX SÉCURITÉ: user_id passé explicitement depuis le JWT
    ) -> PaymentMethodResponse:
        """
        Crée un nouveau moyen de paiement sauvegardé pour un utilisateur spécifique.
        
        ⚠️ SÉCURITÉ: user_id doit toujours venir du JWT (current_user), 
        jamais du body de la requête.
        """
        try:
            # Créer un dict avec toutes les données + user_id
            method_dict = payment_method_data.model_dump()
            method_dict['user_id'] = user_id
            
            payment_method = self.repository.create_payment_method_dict(method_dict)
            self.db.commit()
            self.db.refresh(payment_method)
            return PaymentMethodResponse.model_validate(payment_method)
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création du moyen de paiement : {str(e)}"
            )
    
    # ⚠️ DEPRECATED: Utiliser create_payment_method_for_user à la place
    def create_payment_method(
        self, 
        payment_method_data: PaymentMethodCreate
    ) -> PaymentMethodResponse:
        """
        DEPRECATED: Cette méthode est conservée pour compatibilité mais ne devrait plus être utilisée.
        Utiliser create_payment_method_for_user à la place.
        """
        # Si payment_method_data contient user_id (ancien code), l'utiliser
        if hasattr(payment_method_data, 'user_id'):
            return self.create_payment_method_for_user(payment_method_data, payment_method_data.user_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id manquant - utiliser create_payment_method_for_user"
        )
    
    def get_payment_method(self, method_id: int) -> PaymentMethodResponse:
        """Récupère un moyen de paiement par son ID"""
        method = self.repository.get_payment_method_by_id(method_id)
        if not method:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Moyen de paiement {method_id} non trouvé"
            )
        return PaymentMethodResponse.model_validate(method)
    
    def get_user_payment_methods(self, user_id: int) -> List[PaymentMethodResponse]:
        """Récupère tous les moyens de paiement d'un utilisateur"""
        methods = self.repository.get_payment_methods_by_user(user_id)
        return [PaymentMethodResponse.model_validate(m) for m in methods]
    
    def set_default_payment_method(
        self, 
        method_id: int, 
        user_id: int
    ) -> PaymentMethodResponse:
        """Définit un moyen de paiement comme défaut pour un utilisateur"""
        try:
            method = self.repository.get_payment_method_by_id(method_id)
            if not method:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Moyen de paiement {method_id} non trouvé"
                )
            
            # Vérifier que le moyen appartient à l'utilisateur
            if method.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Ce moyen de paiement ne vous appartient pas"
                )
            
            update_data = PaymentMethodUpdate(is_default=True)
            method = self.repository.update_payment_method(method, update_data)
            
            self.db.commit()
            self.db.refresh(method)
            
            return PaymentMethodResponse.model_validate(method)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la mise à jour : {str(e)}"
            )
    
    def delete_payment_method(self, method_id: int, user_id: int) -> bool:
        """Supprime un moyen de paiement"""
        try:
            method = self.repository.get_payment_method_by_id(method_id)
            if not method:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Moyen de paiement {method_id} non trouvé"
                )
            
            # Vérifier que le moyen appartient à l'utilisateur
            if method.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Ce moyen de paiement ne vous appartient pas"
                )
            
            self.repository.delete_payment_method(method)
            self.db.commit()
            return True
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la suppression : {str(e)}"
            )
    
    # ========================================================================
    # LOGIQUE MÉTIER - REFUND
    # ========================================================================
    
    def create_refund(self, refund_data: RefundCreate) -> RefundResponse:
        """
        Crée un nouveau remboursement.
        
        Vérifie que le montant à rembourser n'excède pas le montant disponible.
        """
        try:
            # Récupérer le paiement
            payment = self.repository.get_payment_by_id(refund_data.payment_id)
            if not payment:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Paiement {refund_data.payment_id} non trouvé"
                )
            
            # Vérifier que le paiement est complété
            if payment.status != PaymentStatus.COMPLETED:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Impossible de rembourser un paiement non complété"
                )
            
            # Calculer le montant déjà remboursé
            total_refunded = self.repository.get_total_refunded_for_payment(
                refund_data.payment_id
            )
            
            # Vérifier que le nouveau remboursement ne dépasse pas le montant disponible
            if total_refunded + refund_data.amount > payment.amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Le montant du remboursement dépasse le montant disponible"
                )
            
            # Créer le remboursement
            refund = self.repository.create_refund(refund_data)
            
            self.db.commit()
            self.db.refresh(refund)
            
            return RefundResponse.model_validate(refund)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création du remboursement : {str(e)}"
            )
    
    def process_refund(self, refund_id: int) -> RefundResponse:
        """
        Traite un remboursement en le marquant comme complété.
        
        Met également à jour le statut du paiement si entièrement remboursé.
        """
        try:
            refund = self.repository.get_refund_by_id(refund_id)
            if not refund:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Remboursement {refund_id} non trouvé"
                )
            
            # Mettre à jour le statut du remboursement
            update_data = RefundUpdate(status=RefundStatus.COMPLETED)
            refund = self.repository.update_refund(refund, update_data)
            
            # Vérifier si le paiement est entièrement remboursé
            payment = self.repository.get_payment_by_id(refund.payment_id)
            total_refunded = self.repository.get_total_refunded_for_payment(
                refund.payment_id
            )
            
            if total_refunded >= payment.amount:
                # Marquer le paiement comme remboursé
                payment_update = PaymentUpdate(status=PaymentStatus.REFUNDED)
                self.repository.update_payment(payment, payment_update)
            
            self.db.commit()
            self.db.refresh(refund)
            
            return RefundResponse.model_validate(refund)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors du traitement du remboursement : {str(e)}"
            )
    
    # ========================================================================
    # LOGIQUE MÉTIER - INVOICE
    # ========================================================================
    
    def create_invoice_for_order(self, order_id: int) -> InvoiceResponse:
        """
        Crée une facture pour une commande.
        
        Génère automatiquement un numéro de facture unique et calcule tous les montants.
        """
        try:
            # Vérifier que la commande existe
            order = self.db.query(Order).filter(Order.id == order_id).first()
            if not order:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Commande {order_id} non trouvée"
                )
            
            # Vérifier qu'une facture n'existe pas déjà
            existing = self.repository.get_invoice_by_order(order_id)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Une facture existe déjà pour cette commande"
                )
            
            # Générer un numéro de facture unique
            invoice_number = self._generate_invoice_number()
            
            # Calculer les montants (vous pouvez ajuster la TVA selon vos besoins)
            tax_rate = Decimal("0.19")  # 19% de TVA par exemple
            subtotal = order.total_amount / (1 + tax_rate)
            tax_amount = order.total_amount - subtotal
            
            # Créer la facture
            invoice_data = InvoiceCreate(
                order_id=order_id,
                invoice_number=invoice_number,
                subtotal=subtotal,
                tax_amount=tax_amount,
                total=order.total_amount
            )
            
            invoice = self.repository.create_invoice(invoice_data)
            
            self.db.commit()
            self.db.refresh(invoice)
            
            return InvoiceResponse.model_validate(invoice)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création de la facture : {str(e)}"
            )
    
    def _generate_invoice_number(self) -> str:
        """
        Génère un numéro de facture unique au format INV-YYYY-NNNN.
        
        Méthode privée qui trouve le prochain numéro disponible pour l'année en cours.
        """
        current_year = datetime.now(timezone.utc).year
        prefix = f"INV-{current_year}-"
        
        # Trouver le dernier numéro de l'année
        last_invoice = self.db.query(Invoice).filter(
            Invoice.invoice_number.like(f"{prefix}%")
        ).order_by(Invoice.invoice_number.desc()).first()
        
        if last_invoice:
            # Extraire le numéro et incrémenter
            last_number = int(last_invoice.invoice_number.split("-")[-1])
            next_number = last_number + 1
        else:
            next_number = 1
        
        return f"{prefix}{next_number:04d}"
    
    def get_invoice(self, invoice_id: int) -> InvoiceResponse:
        """Récupère une facture par son ID"""
        invoice = self.repository.get_invoice_by_id(invoice_id)
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Facture {invoice_id} non trouvée"
            )
        return InvoiceResponse.model_validate(invoice)
    
    def get_invoice_by_order(self, order_id: int) -> InvoiceResponse:
        """Récupère la facture d'une commande"""
        invoice = self.repository.get_invoice_by_order(order_id)
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Aucune facture trouvée pour la commande {order_id}"
            )
        return InvoiceResponse.model_validate(invoice)
    
    def update_invoice_status(
        self, 
        invoice_id: int, 
        new_status: InvoiceStatus
    ) -> InvoiceResponse:
        """Met à jour le statut d'une facture"""
        try:
            invoice = self.repository.get_invoice_by_id(invoice_id)
            if not invoice:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Facture {invoice_id} non trouvée"
                )
            
            update_data = InvoiceUpdate(status=new_status)
            invoice = self.repository.update_invoice(invoice, update_data)
            
            self.db.commit()
            self.db.refresh(invoice)
            
            return InvoiceResponse.model_validate(invoice)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la mise à jour de la facture : {str(e)}"
            )
    
    # ========================================================================
    # LOGIQUE MÉTIER - PRODUCERPAYOUT
    # ========================================================================
    
    def calculate_producer_payout(
        self,
        producer_id: int,
        period_start: datetime,
        period_end: datetime,
        commission_rate: Decimal = Decimal("0.15")  # 15% par défaut
    ) -> ProducerPayoutCalculation:
        """
        Calcule le versement à effectuer pour un producteur sur une période.
        
        Seules les commandes producteur finalisées et payées sont éligibles.
        """
        # Récupérer les commandes éligibles sur la période.
        orders = self.db.query(Order).filter(
            and_(
                Order.producer_id == producer_id,
                Order.status == OrderStatus.COMPLETED,
                Order.payment_status == OrderPaymentStatus.COMPLETED,
                Order.created_at >= period_start,
                Order.created_at <= period_end
            )
        ).all()

        # Montant brut: somme des totaux de commandes éligibles.
        gross_amount = sum(
            (Decimal(str(order.total_amount)) for order in orders),
            Decimal("0")
        )
        
        # Calculer la commission et le montant net
        commission_amount = gross_amount * commission_rate
        net_amount = gross_amount - commission_amount
        
        return ProducerPayoutCalculation(
            producer_id=producer_id,
            period_start=period_start,
            period_end=period_end,
            total_orders=len(orders),
            gross_amount=gross_amount,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            net_amount=net_amount
        )
    
    def create_producer_payout(
        self,
        producer_id: int,
        period_start: datetime,
        period_end: datetime,
        commission_rate: Decimal = Decimal("0.15")
    ) -> ProducerPayoutResponse:
        """
        Crée un versement producteur basé sur le calcul automatique.
        
        Vérifie qu'un versement n'existe pas déjà pour cette période.
        """
        try:
            # Vérifier qu'un versement n'existe pas déjà
            if self.repository.check_payout_exists_for_period(
                producer_id, period_start, period_end
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Un versement existe déjà pour cette période"
                )
            
            # Calculer le versement
            calculation = self.calculate_producer_payout(
                producer_id, period_start, period_end, commission_rate
            )
            if calculation.total_orders == 0 or calculation.gross_amount <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Aucune commande éligible (COMPLETED + paiement COMPLETED) sur cette période"
                )
            
            # Créer le versement
            payout_data = ProducerPayoutCreate(
                producer_id=producer_id,
                period_start=period_start,
                period_end=period_end,
                gross_amount=calculation.gross_amount,
                commission=calculation.commission_amount,
                net_amount=calculation.net_amount
            )
            
            payout = self.repository.create_producer_payout(payout_data)
            
            self.db.commit()
            self.db.refresh(payout)
            
            return ProducerPayoutResponse.model_validate(payout)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création du versement : {str(e)}"
            )
    
    def get_producer_payout(self, payout_id: int) -> ProducerPayoutResponse:
        """Récupère un versement par son ID"""
        payout = self.repository.get_payout_by_id(payout_id)
        if not payout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Versement {payout_id} non trouvé"
            )
        return ProducerPayoutResponse.model_validate(payout)
    
    def get_producer_payouts(
        self,
        producer_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[ProducerPayoutResponse]:
        """Récupère tous les versements d'un producteur"""
        payouts = self.repository.get_payouts_by_producer(producer_id, skip, limit)
        return [ProducerPayoutResponse.model_validate(p) for p in payouts]
    
    def process_payout(self, payout_id: int) -> ProducerPayoutResponse:
        """
        Traite un versement en le marquant comme complété.
        
        Cette fonction serait appelée après que le virement bancaire
        ait été effectué vers le compte du producteur.
        """
        try:
            payout = self.repository.get_payout_by_id(payout_id)
            if not payout:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Versement {payout_id} non trouvé"
                )
            
            # Mettre à jour le statut
            update_data = ProducerPayoutUpdate(status=PayoutStatus.COMPLETED)
            payout = self.repository.update_producer_payout(payout, update_data)
            
            self.db.commit()
            self.db.refresh(payout)
            
            return ProducerPayoutResponse.model_validate(payout)
            
        except HTTPException:
            self.db.rollback()
            raise
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors du traitement du versement : {str(e)}"
            )
    
    def generate_monthly_payouts(self, year: int, month: int) -> List[ProducerPayoutResponse]:
        """
        Génère automatiquement tous les versements mensuels pour tous les producteurs.
        """
        try:
            # 1. Définir la période avec timezone.utc
            period_start = datetime(year, month, 1, tzinfo=timezone.utc)
            if month == 12:
                period_end = datetime(year + 1, 1, 1, tzinfo=timezone.utc) - timedelta(seconds=1)
            else:
                period_end = datetime(year, month + 1, 1, tzinfo=timezone.utc) - timedelta(seconds=1)
            
            # 2. Correction : Utiliser ProducerProfile et le champ is_verified
            producers = self.db.query(ProducerProfile).filter(ProducerProfile.is_verified).all()
            
            created_payouts = []
            
            for producer in producers:
                # Vérifier si un versement existe déjà
                if not self.repository.check_payout_exists_for_period(
                    producer.id, period_start, period_end
                ):
                    try:
                        payout = self.create_producer_payout(
                            producer.id,
                            period_start,
                            period_end
                        )
                        created_payouts.append(payout)
                    except HTTPException:
                        continue
            
            return created_payouts
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la génération des versements : {str(e)}"
            )
