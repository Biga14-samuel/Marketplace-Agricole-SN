// @ts-nocheck
// frontend/src/modules/payments/services/refundService.ts
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
    Refund,
    RefundRequest,
    CreateRefundDto,
    UpdateRefundStatusDto,
    RefundFiltersDto,
    RefundStats,
    RefundReason
} from '../types/refund.types'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { formatCurrencyXAF } from '../utils/currencyFormatter'
import { REFUND_STATUS, REFUND_REASONS } from '../constants/refund.constants'

// Client axios partagé
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        const token = authStore.token

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * Service pour la gestion des remboursements
 */
class RefundService {
    // ============ REMBOURSEMENTS ============

    /**
     * Demander un remboursement
     */
    async requestRefund(refundData: CreateRefundDto): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post('/v1/refunds', {
                ...refundData,
                currency: 'XAF'
            })

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur demande remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la demande de remboursement')
        }
    }

    /**
     * Obtenir les remboursements de l'utilisateur
     */
    async getUserRefunds(filters?: RefundFiltersDto): Promise<Refund[]> {
        try {
            const params = new URLSearchParams()

            if (filters) {
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status)
                }
                if (filters.reason && filters.reason !== 'all') {
                    params.append('reason', filters.reason)
                }
                if (filters.startDate) {
                    params.append('startDate', filters.startDate.toISOString())
                }
                if (filters.endDate) {
                    params.append('endDate', filters.endDate.toISOString())
                }
                if (filters.search) {
                    params.append('search', filters.search)
                }
            }

            const url = `/v1/refunds${params.toString() ? `?${params.toString()}` : ''}`
            const response: AxiosResponse<Refund[]> = await apiClient.get(url)

            return response.data.map(refund => this.formatRefund(refund))
        } catch (error: unknown) {
            console.error('Erreur récupération remboursements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des remboursements')
        }
    }

    /**
     * Obtenir les détails d'un remboursement
     */
    async getRefund(refundId: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.get(`/v1/refunds/${refundId}`)
            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur récupération remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du remboursement')
        }
    }

    /**
     * Obtenir les remboursements liés à une commande
     */
    async getOrderRefunds(orderId: string): Promise<Refund[]> {
        try {
            const response: AxiosResponse<Refund[]> = await apiClient.get(`/v1/orders/${orderId}/refunds`)
            return response.data.map(refund => this.formatRefund(refund))
        } catch (error: unknown) {
            console.error('Erreur récupération remboursements commande:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des remboursements de la commande')
        }
    }

    /**
     * Obtenir les remboursements liés à un paiement
     */
    async getPaymentRefunds(paymentId: string): Promise<Refund[]> {
        try {
            const response: AxiosResponse<Refund[]> = await apiClient.get(`/v1/payments/${paymentId}/refunds`)
            return response.data.map(refund => this.formatRefund(refund))
        } catch (error: unknown) {
            console.error('Erreur récupération remboursements paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des remboursements du paiement')
        }
    }

    // ============ GESTION DES DEMANDES ============

    /**
     * Obtenir les demandes de remboursement (pour producteurs)
     */
    async getRefundRequests(asProducer: boolean = false, filters?: RefundFiltersDto): Promise<RefundRequest[]> {
        try {
            const params = new URLSearchParams()

            if (asProducer) {
                params.append('producer', 'true')
            }

            if (filters) {
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status)
                }
                if (filters.startDate) {
                    params.append('startDate', filters.startDate.toISOString())
                }
                if (filters.endDate) {
                    params.append('endDate', filters.endDate.toISOString())
                }
            }

            const url = `/v1/refunds/requests${params.toString() ? `?${params.toString()}` : ''}`
            const response: AxiosResponse<RefundRequest[]> = await apiClient.get(url)

            return response.data.map(request => ({
                ...request,
                formattedAmount: formatCurrencyXAF(request.amount),
                createdAt: new Date(request.createdAt),
                updatedAt: new Date(request.updatedAt)
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération demandes remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des demandes de remboursement')
        }
    }

    /**
     * Mettre à jour le statut d'un remboursement
     */
    async updateRefundStatus(refundId: string, statusData: UpdateRefundStatusDto): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.put(
                `/v1/refunds/${refundId}`,
                statusData
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur mise à jour statut remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut du remboursement')
        }
    }

    /**
     * Approuver un remboursement
     */
    async approveRefund(refundId: string, reason?: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post(
                `/v1/refunds/${refundId}/approve`,
                { reason }
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur approbation remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'approbation du remboursement')
        }
    }

    /**
     * Rejeter un remboursement
     */
    async rejectRefund(refundId: string, reason: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post(
                `/v1/refunds/${refundId}/reject`,
                { reason }
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur rejet remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du rejet du remboursement')
        }
    }

    /**
     * Annuler une demande de remboursement
     */
    async cancelRefundRequest(refundId: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post(
                `/v1/refunds/${refundId}/cancel`
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur annulation demande remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'annulation de la demande de remboursement')
        }
    }

    /**
     * Demander des informations supplémentaires
     */
    async requestAdditionalInfo(refundId: string, message: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post(
                `/v1/refunds/${refundId}/request-info`,
                { message }
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur demande informations supplémentaires:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la demande d\'informations supplémentaires')
        }
    }

    // ============ PROCESSUS DE REMBOURSEMENT ============

    /**
     * Initier le processus de remboursement
     */
    async initiateRefund(refundId: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post(
                `/v1/refunds/${refundId}/initiate`
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur initiation processus remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du processus de remboursement')
        }
    }

    /**
     * Compléter le remboursement
     */
    async completeRefund(refundId: string, transactionId?: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post(
                `/v1/refunds/${refundId}/complete`,
                { transactionId }
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur complétion remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la complétion du remboursement')
        }
    }

    /**
     * Vérifier le statut d'un remboursement (pour polling)
     */
    async checkRefundStatus(refundId: string): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.get(
                `/v1/refunds/${refundId}/status`
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur vérification statut remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut du remboursement')
        }
    }

    // ============ STATISTIQUES ET RAPPORTS ============

    /**
     * Obtenir les statistiques des remboursements
     */
    async getRefundStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<RefundStats> {
        try {
            const response: AxiosResponse<RefundStats> = await apiClient.get(
                `/v1/refunds/stats?period=${period}`
            )

            return {
                ...response.data,
                formattedTotalAmount: formatCurrencyXAF(response.data.totalAmount || 0),
                formattedAverageRefund: formatCurrencyXAF(response.data.averageRefund || 0),
                formattedApprovedAmount: formatCurrencyXAF(response.data.approvedAmount || 0),
                formattedPendingAmount: formatCurrencyXAF(response.data.pendingAmount || 0),
                formattedRejectedAmount: formatCurrencyXAF(response.data.rejectedAmount || 0)
            }
        } catch (error: unknown) {
            console.error('Erreur récupération statistiques remboursements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques')
        }
    }

    /**
     * Obtenir les raisons de remboursement les plus fréquentes
     */
    async getTopRefundReasons(limit: number = 5): Promise<RefundReason[]> {
        try {
            const response: AxiosResponse<RefundReason[]> = await apiClient.get(
                `/v1/refunds/top-reasons?limit=${limit}`
            )

            return response.data
        } catch (error: unknown) {
            console.error('Erreur récupération raisons remboursement:', error)
            return []
        }
    }

    /**
     * Exporter l'historique des remboursements
     */
    async exportRefunds(format: 'csv' | 'excel', filters?: RefundFiltersDto): Promise<Blob> {
        try {
            const params = new URLSearchParams()
            params.append('format', format)

            if (filters) {
                if (filters.startDate) {
                    params.append('startDate', filters.startDate.toISOString())
                }
                if (filters.endDate) {
                    params.append('endDate', filters.endDate.toISOString())
                }
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status)
                }
            }

            const response: AxiosResponse<Blob> = await apiClient.get(`/v1/refunds/export?${params.toString()}`, {
                responseType: 'blob'
            })

            return response.data
        } catch (error: unknown) {
            console.error('Erreur export remboursements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'export des remboursements')
        }
    }

    // ============ POLITIQUES ET CONDITIONS ============

    /**
     * Obtenir la politique de remboursement
     */
    async getRefundPolicy(): Promise<{
        allowed: boolean
        maxDays: number
        minAmount: number
        maxAmount: number
        conditions: string[]
        exceptions: string[]
    }> {
        try {
            const response: AxiosResponse = await apiClient.get('/v1/refunds/policy')
            return response.data
        } catch (error: unknown) {
            console.error('Erreur récupération politique remboursement:', error)
            // Politique par défaut
            return {
                allowed: true,
                maxDays: 30,
                minAmount: 1000,
                maxAmount: 1000000,
                conditions: [
                    'Le produit doit être retourné dans son état d\'origine',
                    'La demande doit être faite dans les 30 jours suivant l\'achat',
                    'Le produit ne doit pas être utilisé ou endommagé'
                ],
                exceptions: [
                    'Produits périssables',
                    'Produits personnalisés',
                    'Services déjà fournis'
                ]
            }
        }
    }

    /**
     * Vérifier l'éligibilité au remboursement
     */
    async checkEligibility(orderId: string, productIds?: string[]): Promise<{
        eligible: boolean
        reason?: string
        maxAmount: number
        allowedUntil: Date
    }> {
        try {
            const response: AxiosResponse = await apiClient.post('/v1/refunds/check-eligibility', {
                orderId,
                productIds
            })

            return {
                ...response.data,
                allowedUntil: new Date(response.data.allowedUntil)
            }
        } catch (error: unknown) {
            console.error('Erreur vérification éligibilité:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification de l\'éligibilité')
        }
    }

    // ============ COMMUNICATION ============

    /**
     * Envoyer une notification de remboursement
     */
    async sendRefundNotification(refundId: string, type: 'approval' | 'rejection' | 'completion'): Promise<void> {
        try {
            await apiClient.post(`/v1/refunds/${refundId}/notify`, { type })
        } catch (error: unknown) {
            console.error('Erreur envoi notification remboursement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la notification')
        }
    }

    /**
     * Ajouter un commentaire à un remboursement
     */
    async addComment(refundId: string, comment: string, isInternal: boolean = false): Promise<Refund> {
        try {
            const response: AxiosResponse<Refund> = await apiClient.post(
                `/v1/refunds/${refundId}/comments`,
                { comment, isInternal }
            )

            return this.formatRefund(response.data)
        } catch (error: unknown) {
            console.error('Erreur ajout commentaire:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire')
        }
    }

    /**
     * Obtenir les commentaires d'un remboursement
     */
    async getComments(refundId: string): Promise<Array<{
        id: string
        userId: string
        userName: string
        comment: string
        isInternal: boolean
        createdAt: Date
    }>> {
        try {
            const response: AxiosResponse = await apiClient.get(`/v1/refunds/${refundId}/comments`)

            return response.data.map((comment: any) => ({
                ...comment,
                createdAt: new Date(comment.createdAt)
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération commentaires:', error)
            return []
        }
    }

    // ============ FONCTIONS UTILITAIRES ============

    /**
     * Formater un remboursement
     */
    private formatRefund(refund: Refund): Refund {
        return {
            ...refund,
            formattedAmount: formatCurrencyXAF(refund.amount),
            formattedOriginalAmount: refund.originalAmount ? formatCurrencyXAF(refund.originalAmount) : undefined,
            formattedFees: refund.fees ? formatCurrencyXAF(refund.fees) : undefined,
            createdAt: new Date(refund.createdAt),
            updatedAt: new Date(refund.updatedAt),
            approvedAt: refund.approvedAt ? new Date(refund.approvedAt) : undefined,
            rejectedAt: refund.rejectedAt ? new Date(refund.rejectedAt) : undefined,
            completedAt: refund.completedAt ? new Date(refund.completedAt) : undefined,
            status: refund.status as REFUND_STATUS
        }
    }

    /**
     * Calculer le montant de remboursement
     */
    calculateRefundAmount(originalAmount: number, daysSincePurchase: number, condition: 'good' | 'fair' | 'poor'): {
        amount: number
        percentage: number
        reason: string
    } {
        let percentage = 100

        // Réduction en fonction du temps
        if (daysSincePurchase > 14) {
            percentage -= 20
        }
        if (daysSincePurchase > 21) {
            percentage -= 30
        }

        // Réduction en fonction de l'état
        if (condition === 'fair') {
            percentage -= 20
        } else if (condition === 'poor') {
            percentage -= 50
        }

        // Minimum de 30%
        percentage = Math.max(30, percentage)

        const amount = originalAmount * (percentage / 100)

        return {
            amount,
            percentage,
            reason: `Remboursement de ${percentage}% en fonction du temps (${daysSincePurchase} jours) et de l'état (${condition})`
        }
    }

    /**
     * Vérifier si une commande est remboursable
     */
    isOrderRefundable(orderDate: Date, orderStatus: string): boolean {
        const today = new Date()
        const daysDifference = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))

        // Maximum 30 jours
        if (daysDifference > 30) return false

        // Seules certaines commandes sont remboursables
        const refundableStatuses = ['delivered', 'completed', 'partially_returned']
        return refundableStatuses.includes(orderStatus)
    }

    /**
     * Générer un numéro de référence de remboursement
     */
    generateRefundReference(): string {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

        return `REF-${year}${month}${day}-${random}`
    }

    /**
     * Obtenir le texte de la raison de remboursement
     */
    getRefundReasonText(reasonCode: string): string {
        const reasons: Record<string, string> = {
            'product_defective': 'Produit défectueux',
            'not_as_described': 'Ne correspond pas à la description',
            'wrong_item': 'Mauvais article reçu',
            'late_delivery': 'Livraison tardive',
            'missing_parts': 'Pièces manquantes',
            'change_of_mind': 'Changement d\'avis',
            'too_expensive': 'Trop cher',
            'found_better_price': 'Trouvé meilleur prix ailleurs',
            'other': 'Autre'
        }

        return reasons[reasonCode] || 'Raison non spécifiée'
    }

    /**
     * Tester la connexion au service de remboursement
     */
    async testConnection(): Promise<boolean> {
        try {
            await apiClient.get('/v1/refunds/health')
            return true
        } catch (error) {
            console.error('Erreur connexion service remboursement:', error)
            return false
        }
    }
}

// Export singleton instance
export default new RefundService()
