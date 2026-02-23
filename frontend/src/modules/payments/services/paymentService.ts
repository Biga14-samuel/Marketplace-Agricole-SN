// frontend/src/modules/payments/services/paymentService.ts
import type { AxiosResponse } from 'axios'
import type {
    Payment,
    PaymentStats,
    CreatePaymentDto,
    ConfirmMobileMoneyDto,
    PaymentFiltersDto,
    PaymentMethod,
    CreatePaymentMethodDto,
    RefundRequestDto,
    UpdateRefundStatusDto,
    PayoutRequestDto,
    Invoice,
    Refund,
    CameroonPaymentProvider
} from '../types/payment.types'
import {
    PaymentAdapter,
    PaymentMethodAdapter,
    InvoiceAdapter,
    RefundAdapter,
    PaymentStatsAdapter,
    formatCurrencyXAF
} from '../adapters/payment.adapter'
import { apiClient } from '@/shared/services/api'
import { PAYMENT_STATUS, PAYMENT_METHODS } from '../types/payment.types'

/**
 * Service pour la gestion des paiements - Intégré avec l'API backend
 */
class PaymentService {
    // ============ PAYMENTS ============

    /**
     * Créer un nouveau paiement
     */
    async createPayment(paymentData: CreatePaymentDto): Promise<Payment> {
        try {
            const backendData = PaymentAdapter.toBackendCreate(paymentData)
            const response: AxiosResponse = await apiClient.post('/payments', backendData)
            return PaymentAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur création paiement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la création du paiement')
        }
    }

    /**
     * Confirmer un paiement Mobile Money
     */
    async confirmMobileMoneyPayment(paymentId: string, data: ConfirmMobileMoneyDto): Promise<Payment> {
        try {
            // Update payment status to completed with mobile money details
            const response: AxiosResponse = await apiClient.patch(
                `/payments/${paymentId}/status`,
                {
                    new_status: 'completed',
                    transaction_id: data.transactionId,
                    additional_data: {
                        mobile_number: data.phoneNumber,
                        provider: data.provider,
                        confirmation_code: data.otpCode
                    }
                }
            )
            return PaymentAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur confirmation Mobile Money:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la confirmation du paiement')
        }
    }

    /**
     * Obtenir les détails d'un paiement
     */
    async getPayment(paymentId: string): Promise<Payment> {
        try {
            const response: AxiosResponse = await apiClient.get(`/payments/${paymentId}`)
            return PaymentAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur récupération paiement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération du paiement')
        }
    }

    /**
     * Obtenir les paiements d'une commande
     */
    async getOrderPayments(orderId: string): Promise<Payment[]> {
        try {
            const response: AxiosResponse = await apiClient.get(`/payments/order/${orderId}`)
            return response.data.map((payment: any) => PaymentAdapter.toFrontend(payment))
        } catch (error: any) {
            console.error('Erreur récupération paiements commande:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des paiements')
        }
    }

    /**
     * Obtenir les paiements de l'utilisateur (avec filtres)
     */
    async getUserPayments(filters?: PaymentFiltersDto): Promise<Payment[]> {
        try {
            const params = new URLSearchParams()

            if (filters) {
                if (filters.status && filters.status !== 'all') {
                    // Map frontend status to backend status
                    const backendStatus = this.mapStatusToBackend(filters.status)
                    if (backendStatus) params.append('status', backendStatus)
                }
                if (filters.startDate) {
                    params.append('start_date', filters.startDate.toISOString())
                }
                if (filters.endDate) {
                    params.append('end_date', filters.endDate.toISOString())
                }
                if (filters.minAmount !== undefined) {
                    params.append('min_amount', filters.minAmount.toString())
                }
                if (filters.maxAmount !== undefined) {
                    params.append('max_amount', filters.maxAmount.toString())
                }
                if (filters.search) {
                    params.append('search', filters.search)
                }
            }

            // For now, we'll get all payments and filter client-side
            // In a real implementation, you'd add user filtering to the backend
            const url = `/payments${params.toString() ? `?${params.toString()}` : ''}`
            const response: AxiosResponse = await apiClient.get(url)

            return response.data.map((payment: any) => PaymentAdapter.toFrontend(payment))
        } catch (error: any) {
            console.error('Erreur récupération paiements utilisateur:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des paiements')
        }
    }

    /**
     * Annuler un paiement
     */
    async cancelPayment(paymentId: string): Promise<Payment> {
        try {
            const response: AxiosResponse = await apiClient.patch(
                `/payments/${paymentId}/status`,
                { new_status: 'failed' }
            )
            return PaymentAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur annulation paiement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de l\'annulation du paiement')
        }
    }

    /**
     * Vérifier le statut d'un paiement (pour polling)
     */
    async checkPaymentStatus(paymentId: string): Promise<Payment> {
        return this.getPayment(paymentId)
    }

    // ============ STATISTIQUES ============

    /**
     * Obtenir les statistiques de paiement
     */
    async getPaymentStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<PaymentStats> {
        try {
            const endDate = new Date()
            const startDate = new Date()

            // Calculate start date based on period
            switch (period) {
                case 'day':
                    startDate.setDate(endDate.getDate() - 1)
                    break
                case 'week':
                    startDate.setDate(endDate.getDate() - 7)
                    break
                case 'month':
                    startDate.setMonth(endDate.getMonth() - 1)
                    break
                case 'year':
                    startDate.setFullYear(endDate.getFullYear() - 1)
                    break
            }

            const response: AxiosResponse = await apiClient.get(
                `/payments/stats/?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
            )

            return PaymentStatsAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur récupération statistiques:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des statistiques')
        }
    }

    // ============ MÉTHODES DE PAIEMENT ============

    /**
     * Obtenir les méthodes de paiement d'un utilisateur
     */
    async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
        try {
            const response: AxiosResponse = await apiClient.get(`/payments/methods/user/${userId}`)
            return response.data.map((method: any) => PaymentMethodAdapter.toFrontend(method))
        } catch (error: any) {
            console.error('Erreur récupération méthodes paiement:', error)
            // Retourner des méthodes par défaut en cas d'erreur
            return this.getDefaultPaymentMethods()
        }
    }

    /**
     * Ajouter une méthode de paiement
     */
    async addPaymentMethod(methodData: CreatePaymentMethodDto): Promise<PaymentMethod> {
        try {
            const backendData = PaymentMethodAdapter.toBackendCreate(methodData)
            const response: AxiosResponse = await apiClient.post('/payments/methods', backendData)
            return PaymentMethodAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur ajout méthode paiement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de l\'ajout de la méthode de paiement')
        }
    }

    /**
     * Définir une méthode de paiement par défaut
     */
    async setDefaultPaymentMethod(methodId: string, userId: string): Promise<void> {
        try {
            await apiClient.patch(`/payments/methods/${methodId}/set-default?user_id=${userId}`)
        } catch (error: any) {
            console.error('Erreur définition méthode par défaut:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la définition de la méthode par défaut')
        }
    }

    /**
     * Supprimer une méthode de paiement
     */
    async removePaymentMethod(methodId: string, userId: string): Promise<void> {
        try {
            await apiClient.delete(`/payments/methods/${methodId}?user_id=${userId}`)
        } catch (error: any) {
            console.error('Erreur suppression méthode paiement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la suppression de la méthode de paiement')
        }
    }

    // ============ FACTURES ============

    /**
     * Créer une facture pour une commande
     */
    async createInvoiceForOrder(orderId: string): Promise<Invoice> {
        try {
            const response: AxiosResponse = await apiClient.post(`/payments/invoices/order/${orderId}`)
            return InvoiceAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur création facture:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la création de la facture')
        }
    }

    /**
     * Obtenir une facture par ID
     */
    async getInvoice(invoiceId: string): Promise<Invoice> {
        try {
            const response: AxiosResponse = await apiClient.get(`/payments/invoices/${invoiceId}`)
            return InvoiceAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur récupération facture:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération de la facture')
        }
    }

    /**
     * Obtenir la facture d'une commande
     */
    async getInvoiceByOrder(orderId: string): Promise<Invoice> {
        try {
            const response: AxiosResponse = await apiClient.get(`/payments/invoices/order/${orderId}`)
            return InvoiceAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur récupération facture commande:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération de la facture')
        }
    }

    // ============ REMBOURSEMENTS ============

    /**
     * Demander un remboursement
     */
    async requestRefund(refundData: RefundRequestDto): Promise<Refund> {
        try {
            const backendData = RefundAdapter.toBackendCreate(refundData)
            const response: AxiosResponse = await apiClient.post('/payments/refunds', backendData)
            return RefundAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur demande remboursement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la demande de remboursement')
        }
    }

    /**
     * Traiter un remboursement
     */
    async processRefund(refundId: string): Promise<Refund> {
        try {
            const response: AxiosResponse = await apiClient.patch(`/payments/refunds/${refundId}/process`)
            return RefundAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur traitement remboursement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors du traitement du remboursement')
        }
    }

    // ============ VERSEMENTS PRODUCTEURS ============

    /**
     * Calculer un versement producteur
     */
    async calculateProducerPayout(params: {
        producerId: string
        periodStart: Date
        periodEnd: Date
        commissionRate?: number
    }): Promise<any> {
        try {
            const queryParams = new URLSearchParams({
                producer_id: params.producerId,
                period_start: params.periodStart.toISOString(),
                period_end: params.periodEnd.toISOString(),
                commission_rate: (params.commissionRate || 0.15).toString()
            })

            const response: AxiosResponse = await apiClient.get(`/payments/payouts/calculate?${queryParams}`)
            return response.data
        } catch (error: any) {
            console.error('Erreur calcul versement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors du calcul du versement')
        }
    }

    /**
     * Créer un versement producteur
     */
    async createProducerPayout(params: {
        producerId: string
        periodStart: Date
        periodEnd: Date
        commissionRate?: number
    }): Promise<any> {
        try {
            const queryParams = new URLSearchParams({
                producer_id: params.producerId,
                period_start: params.periodStart.toISOString(),
                period_end: params.periodEnd.toISOString(),
                commission_rate: (params.commissionRate || 0.15).toString()
            })

            const response: AxiosResponse = await apiClient.post(`/payments/payouts?${queryParams}`)
            return response.data
        } catch (error: any) {
            console.error('Erreur création versement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la création du versement')
        }
    }

    /**
     * Obtenir les versements d'un producteur
     */
    async getProducerPayouts(producerId: string, skip = 0, limit = 100): Promise<any[]> {
        try {
            const response: AxiosResponse = await apiClient.get(
                `/payments/payouts/producer/${producerId}?skip=${skip}&limit=${limit}`
            )
            return response.data.map((payout: any) => ({
                ...payout,
                formattedAmount: formatCurrencyXAF(parseFloat(payout.net_amount))
            }))
        } catch (error: any) {
            console.error('Erreur récupération versements:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des versements')
        }
    }

    // ============ FONCTIONS UTILITAIRES ============

    /**
     * Mapper le statut frontend vers backend
     */
    private mapStatusToBackend(status: string): string | null {
        const mapping: Record<string, string> = {
            'pending': 'pending',
            'processing': 'pending',
            'success': 'completed',
            'failed': 'failed',
            'cancelled': 'failed',
            'refunded': 'refunded',
            'partially_refunded': 'refunded',
            'expired': 'failed',
            'disputed': 'failed'
        }
        return mapping[status] || null
    }

    /**
     * Obtenir les méthodes de paiement disponibles (fallback)
     */
    async getPaymentMethods(): Promise<PaymentMethod[]> {
        // For backward compatibility - redirect to getUserPaymentMethods
        return this.getDefaultPaymentMethods()
    }

    /**
     * Obtenir les fournisseurs de paiement au Cameroun
     */
    async getCameroonPaymentProviders(): Promise<CameroonPaymentProvider[]> {
        // This would typically come from a configuration endpoint
        return this.getDefaultCameroonProviders()
    }

    /**
     * Obtenir les méthodes de paiement par défaut
     */
    private getDefaultPaymentMethods(): PaymentMethod[] {
        return [
            {
                id: 'stripe_card',
                userId: '',
                type: PAYMENT_METHODS.CREDIT_CARD,
                name: 'Carte de crédit',
                description: 'Paiement par carte bancaire',
                isActive: true,
                isDefault: false,
                isGlobal: true,
                fees: { percentage: 2.9, fixed: 30 },
                metadata: { provider: 'stripe' },
                createdAt: new Date(),
                updatedAt: new Date(),
                formattedFees: '2.9% + 30 FCFA'
            },
            {
                id: 'paypal',
                userId: '',
                type: PAYMENT_METHODS.PAYPAL,
                name: 'PayPal',
                description: 'Paiement via PayPal',
                isActive: true,
                isDefault: false,
                isGlobal: true,
                fees: { percentage: 3.4, fixed: 0 },
                metadata: { provider: 'paypal' },
                createdAt: new Date(),
                updatedAt: new Date(),
                formattedFees: '3.4%'
            },
            {
                id: 'mtn_money',
                userId: '',
                type: PAYMENT_METHODS.MOBILE_MONEY,
                name: 'MTN Mobile Money',
                description: 'Paiement mobile MTN',
                isActive: true,
                isDefault: false,
                isGlobal: false,
                countries: ['CM'],
                fees: { percentage: 1.5, fixed: 0 },
                metadata: { provider: 'mtn', requiresPhoneNumber: true },
                createdAt: new Date(),
                updatedAt: new Date(),
                formattedFees: '1.5%'
            },
            {
                id: 'orange_money',
                userId: '',
                type: PAYMENT_METHODS.MOBILE_MONEY,
                name: 'Orange Money',
                description: 'Paiement mobile Orange',
                isActive: true,
                isDefault: false,
                isGlobal: false,
                countries: ['CM'],
                fees: { percentage: 1.2, fixed: 50 },
                metadata: { provider: 'orange', requiresPhoneNumber: true },
                createdAt: new Date(),
                updatedAt: new Date(),
                formattedFees: '1.2% + 50 FCFA'
            }
        ]
    }

    /**
     * Obtenir les fournisseurs Cameroun par défaut
     */
    private getDefaultCameroonProviders(): CameroonPaymentProvider[] {
        return [
            {
                id: 'mtn_money',
                name: 'MTN Mobile Money',
                code: 'MTN',
                isActive: true,
                fees: { percentage: 1.5, fixed: 0 },
                countries: ['CM'],
                requiresPhoneNumber: true,
                transactionTypes: ['deposit', 'withdrawal', 'payment'],
                formattedFees: '1.5%'
            },
            {
                id: 'orange_money',
                name: 'Orange Money',
                code: 'OM',
                isActive: true,
                fees: { percentage: 1.2, fixed: 50 },
                countries: ['CM'],
                requiresPhoneNumber: true,
                transactionTypes: ['deposit', 'withdrawal', 'payment'],
                formattedFees: '1.2% + 50 FCFA'
            },
            {
                id: 'express_union',
                name: 'Express Union',
                code: 'EU',
                isActive: true,
                fees: { percentage: 0.8, fixed: 100 },
                countries: ['CM'],
                requiresPhoneNumber: false,
                transactionTypes: ['deposit', 'withdrawal'],
                formattedFees: '0.8% + 100 FCFA'
            }
        ]
    }

    /**
     * Simuler un paiement pour le développement
     */
    async simulatePayment(paymentId: string, status: PAYMENT_STATUS): Promise<Payment> {
        // Cette fonction est uniquement pour le développement
        if (import.meta.env.PROD) {
            throw new Error('Simulation non disponible en production')
        }

        try {
            const backendStatus = this.mapStatusToBackend(status) || 'pending'
            const response: AxiosResponse = await apiClient.patch(
                `/payments/${paymentId}/status`,
                { new_status: backendStatus }
            )
            return PaymentAdapter.toFrontend(response.data)
        } catch (error: any) {
            console.error('Erreur simulation paiement:', error)
            throw new Error(error.response?.data?.detail || 'Erreur lors de la simulation du paiement')
        }
    }

    /**
     * Tester la connexion à l'API de paiement
     */
    async testConnection(): Promise<boolean> {
        try {
            // Test with a simple stats call
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(endDate.getDate() - 1)

            await apiClient.get(`/payments/stats/?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`)
            return true
        } catch (error) {
            console.error('Erreur connexion API paiement:', error)
            return false
        }
    }
}

// Export singleton instance
export default new PaymentService()