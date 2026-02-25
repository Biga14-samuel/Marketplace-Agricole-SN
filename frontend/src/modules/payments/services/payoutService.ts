// @ts-nocheck
// frontend/src/modules/payments/services/payoutService.ts
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
    Payout,
    PayoutRequest,
    CreatePayoutDto,
    UpdatePayoutDto,
    PayoutFiltersDto,
    PayoutStats,
    PayoutSchedule,
    PayoutMethod,
    PayoutReconciliation
} from '../types/payout.types'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { formatCurrencyXAF } from '../utils/currencyFormatter'
import { PAYOUT_STATUS, PAYOUT_METHODS, PAYOUT_SCHEDULES } from '../constants/payout.constants'
import { validatePhoneNumber, validateBankAccount } from '../utils/paymentValidators'

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

        // Vérifier si c'est un producteur pour certaines routes
        if (config.url?.includes('/payouts') && !authStore.isProducer) {
            console.warn('Accès aux versements réservé aux producteurs')
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * Service pour la gestion des versements aux producteurs
 */
class PayoutService {
    // ============ VERSEMENTS PRODUCTEURS ============

    /**
     * Obtenir les versements du producteur
     */
    async getProducerPayouts(filters?: PayoutFiltersDto): Promise<Payout[]> {
        try {
            const params = new URLSearchParams()

            if (filters) {
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status)
                }
                if (filters.method && filters.method !== 'all') {
                    params.append('method', filters.method)
                }
                if (filters.startDate) {
                    params.append('startDate', filters.startDate.toISOString())
                }
                if (filters.endDate) {
                    params.append('endDate', filters.endDate.toISOString())
                }
                if (filters.minAmount !== undefined) {
                    params.append('minAmount', filters.minAmount.toString())
                }
                if (filters.maxAmount !== undefined) {
                    params.append('maxAmount', filters.maxAmount.toString())
                }
                if (filters.search) {
                    params.append('search', filters.search)
                }
            }

            const url = `/v1/payouts${params.toString() ? `?${params.toString()}` : ''}`
            const response: AxiosResponse<Payout[]> = await apiClient.get(url)

            return response.data.map(payout => this.formatPayout(payout))
        } catch (error: unknown) {
            console.error('Erreur récupération versements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des versements')
        }
    }

    /**
     * Obtenir les versements à venir
     */
    async getUpcomingPayouts(): Promise<Payout[]> {
        try {
            const response: AxiosResponse<Payout[]> = await apiClient.get('/v1/payouts/upcoming')
            return response.data.map(payout => this.formatPayout(payout))
        } catch (error: unknown) {
            console.error('Erreur récupération versements à venir:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des versements à venir')
        }
    }

    /**
     * Obtenir un versement spécifique
     */
    async getPayout(payoutId: string): Promise<Payout> {
        try {
            const response: AxiosResponse<Payout> = await apiClient.get(`/v1/payouts/${payoutId}`)
            return this.formatPayout(response.data)
        } catch (error: unknown) {
            console.error('Erreur récupération versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du versement')
        }
    }

    /**
     * Demander un versement
     */
    async requestPayout(payoutData: CreatePayoutDto): Promise<Payout> {
        try {
            // Validation des données
            this.validatePayoutRequest(payoutData)

            const response: AxiosResponse<Payout> = await apiClient.post('/v1/payouts/request', {
                ...payoutData,
                currency: 'XAF'
            })

            return this.formatPayout(response.data)
        } catch (error: unknown) {
            console.error('Erreur demande versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la demande de versement')
        }
    }

    /**
     * Annuler une demande de versement
     */
    async cancelPayout(payoutId: string, reason?: string): Promise<Payout> {
        try {
            const response: AxiosResponse<Payout> = await apiClient.post(
                `/v1/payouts/${payoutId}/cancel`,
                { reason }
            )

            return this.formatPayout(response.data)
        } catch (error: unknown) {
            console.error('Erreur annulation versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'annulation du versement')
        }
    }

    // ============ GESTION DES VERSEMENTS (ADMIN) ============

    /**
     * Obtenir tous les versements (admin)
     */
    async getAllPayouts(filters?: PayoutFiltersDto & { producerId?: string }): Promise<Payout[]> {
        try {
            const params = new URLSearchParams()

            if (filters) {
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status)
                }
                if (filters.method && filters.method !== 'all') {
                    params.append('method', filters.method)
                }
                if (filters.startDate) {
                    params.append('startDate', filters.startDate.toISOString())
                }
                if (filters.endDate) {
                    params.append('endDate', filters.endDate.toISOString())
                }
                if (filters.producerId) {
                    params.append('producerId', filters.producerId)
                }
            }

            const response: AxiosResponse<Payout[]> = await apiClient.get(
                `/v1/payouts/all${params.toString() ? `?${params.toString()}` : ''}`
            )

            return response.data.map(payout => this.formatPayout(payout))
        } catch (error: unknown) {
            console.error('Erreur récupération tous les versements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement de tous les versements')
        }
    }

    /**
     * Mettre à jour le statut d'un versement (admin)
     */
    async updatePayoutStatus(payoutId: string, statusData: UpdatePayoutDto): Promise<Payout> {
        try {
            const response: AxiosResponse<Payout> = await apiClient.put(
                `/v1/payouts/${payoutId}`,
                statusData
            )

            return this.formatPayout(response.data)
        } catch (error: unknown) {
            console.error('Erreur mise à jour statut versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut du versement')
        }
    }

    /**
     * Approuver un versement (admin)
     */
    async approvePayout(payoutId: string): Promise<Payout> {
        try {
            const response: AxiosResponse<Payout> = await apiClient.post(
                `/v1/payouts/${payoutId}/approve`
            )

            return this.formatPayout(response.data)
        } catch (error: unknown) {
            console.error('Erreur approbation versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'approbation du versement')
        }
    }

    /**
     * Rejeter un versement (admin)
     */
    async rejectPayout(payoutId: string, reason: string): Promise<Payout> {
        try {
            const response: AxiosResponse<Payout> = await apiClient.post(
                `/v1/payouts/${payoutId}/reject`,
                { reason }
            )

            return this.formatPayout(response.data)
        } catch (error: unknown) {
            console.error('Erreur rejet versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du rejet du versement')
        }
    }

    /**
     * Marquer comme payé (admin)
     */
    async markAsPaid(payoutId: string, transactionId?: string): Promise<Payout> {
        try {
            const response: AxiosResponse<Payout> = await apiClient.post(
                `/v1/payouts/${payoutId}/mark-paid`,
                { transactionId }
            )

            return this.formatPayout(response.data)
        } catch (error: unknown) {
            console.error('Erreur marquage versement payé:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du marquage du versement comme payé')
        }
    }

    /**
     * Traiter un versement en lot (admin)
     */
    async processBatchPayouts(payoutIds: string[]): Promise<Payout[]> {
        try {
            const response: AxiosResponse<Payout[]> = await apiClient.post(
                '/v1/payouts/batch-process',
                { payoutIds }
            )

            return response.data.map(payout => this.formatPayout(payout))
        } catch (error: unknown) {
            console.error('Erreur traitement lot versements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du traitement des versements en lot')
        }
    }

    // ============ STATISTIQUES ET RAPPORTS ============

    /**
     * Obtenir les statistiques des versements
     */
    async getPayoutStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<PayoutStats> {
        try {
            const response: AxiosResponse<PayoutStats> = await apiClient.get(
                `/v1/payouts/stats?period=${period}`
            )

            return {
                ...response.data,
                formattedTotalAmount: formatCurrencyXAF(response.data.totalAmount || 0),
                formattedAveragePayout: formatCurrencyXAF(response.data.averagePayout || 0),
                formattedPendingAmount: formatCurrencyXAF(response.data.pendingAmount || 0),
                formattedProcessedAmount: formatCurrencyXAF(response.data.processedAmount || 0),
                formattedFailedAmount: formatCurrencyXAF(response.data.failedAmount || 0)
            }
        } catch (error: unknown) {
            console.error('Erreur récupération statistiques versements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques')
        }
    }

    /**
     * Obtenir le solde disponible pour versement
     */
    async getAvailableBalance(): Promise<{
        available: number
        pending: number
        nextPayoutDate: Date | null
        formattedAvailable: string
        formattedPending: string
    }> {
        try {
            const response: AxiosResponse<{
                available: number
                pending: number
                nextPayoutDate: string | null
            }> = await apiClient.get('/v1/payouts/balance')

            return {
                available: response.data.available,
                pending: response.data.pending,
                nextPayoutDate: response.data.nextPayoutDate ? new Date(response.data.nextPayoutDate) : null,
                formattedAvailable: formatCurrencyXAF(response.data.available),
                formattedPending: formatCurrencyXAF(response.data.pending)
            }
        } catch (error: unknown) {
            console.error('Erreur récupération solde disponible:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du solde disponible')
        }
    }

    /**
     * Générer un rapport de versements
     */
    async generatePayoutReport(params: {
        startDate: Date
        endDate: Date
        format: 'pdf' | 'csv' | 'excel'
        includeDetails: boolean
    }): Promise<Blob> {
        try {
            const response: AxiosResponse<Blob> = await apiClient.post(
                '/v1/payouts/report',
                params,
                {
                    responseType: 'blob'
                }
            )

            return response.data
        } catch (error: unknown) {
            console.error('Erreur génération rapport versements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la génération du rapport')
        }
    }

    /**
     * Exporter l'historique des versements
     */
    async exportPayouts(format: 'csv' | 'excel', filters?: PayoutFiltersDto): Promise<Blob> {
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

            const response: AxiosResponse<Blob> = await apiClient.get(
                `/v1/payouts/export?${params.toString()}`,
                { responseType: 'blob' }
            )

            return response.data
        } catch (error: unknown) {
            console.error('Erreur export versements:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'export des versements')
        }
    }

    // ============ MÉTHODES DE VERSEMENT ============

    /**
     * Obtenir les méthodes de versement disponibles
     */
    async getPayoutMethods(): Promise<PayoutMethod[]> {
        try {
            const response: AxiosResponse<PayoutMethod[]> = await apiClient.get('/v1/payouts/methods')
            return response.data.map(method => ({
                ...method,
                formattedMinAmount: method.minAmount ? formatCurrencyXAF(method.minAmount) : undefined,
                formattedMaxAmount: method.maxAmount ? formatCurrencyXAF(method.maxAmount) : undefined,
                formattedFees: method.fees
                    ? `${method.fees.percentage}% + ${formatCurrencyXAF(method.fees.fixed)}`
                    : 'Aucun frais'
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération méthodes versement:', error)
            // Retourner les méthodes par défaut
            return this.getDefaultPayoutMethods()
        }
    }

    /**
     * Ajouter une méthode de versement
     */
    async addPayoutMethod(methodData: {
        type: string
        details: Record<string, any>
        isDefault?: boolean
    }): Promise<PayoutMethod> {
        try {
            const response: AxiosResponse<PayoutMethod> = await apiClient.post(
                '/v1/payouts/methods',
                methodData
            )

            return response.data
        } catch (error: unknown) {
            console.error('Erreur ajout méthode versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de la méthode de versement')
        }
    }

    /**
     * Définir la méthode de versement par défaut
     */
    async setDefaultPayoutMethod(methodId: string): Promise<void> {
        try {
            await apiClient.put(`/v1/payouts/methods/${methodId}/default`)
        } catch (error: unknown) {
            console.error('Erreur définition méthode par défaut:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la définition de la méthode par défaut')
        }
    }

    // ============ PROGRAMMATION DES VERSEMENTS ============

    /**
     * Obtenir la programmation des versements
     */
    async getPayoutSchedule(): Promise<PayoutSchedule> {
        try {
            const response: AxiosResponse<PayoutSchedule> = await apiClient.get('/v1/payouts/schedule')

            return {
                ...response.data,
                nextPayoutDate: new Date(response.data.nextPayoutDate),
                lastPayoutDate: response.data.lastPayoutDate ? new Date(response.data.lastPayoutDate) : undefined
            }
        } catch (error: unknown) {
            console.error('Erreur récupération programmation versements:', error)
            // Retourner une programmation par défaut
            return this.getDefaultPayoutSchedule()
        }
    }

    /**
     * Mettre à jour la programmation des versements
     */
    async updatePayoutSchedule(scheduleData: {
        frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
        dayOfWeek?: number
        dayOfMonth?: number
        autoPayout: boolean
        minAmount: number
    }): Promise<PayoutSchedule> {
        try {
            const response: AxiosResponse<PayoutSchedule> = await apiClient.put(
                '/v1/payouts/schedule',
                scheduleData
            )

            return {
                ...response.data,
                nextPayoutDate: new Date(response.data.nextPayoutDate),
                lastPayoutDate: response.data.lastPayoutDate ? new Date(response.data.lastPayoutDate) : undefined
            }
        } catch (error: unknown) {
            console.error('Erreur mise à jour programmation:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la programmation')
        }
    }

    /**
     * Activer/désactiver les versements automatiques
     */
    async toggleAutoPayout(enabled: boolean): Promise<PayoutSchedule> {
        try {
            const response: AxiosResponse<PayoutSchedule> = await apiClient.put(
                '/v1/payouts/schedule/auto-payout',
                { enabled }
            )

            return {
                ...response.data,
                nextPayoutDate: new Date(response.data.nextPayoutDate),
                lastPayoutDate: response.data.lastPayoutDate ? new Date(response.data.lastPayoutDate) : undefined
            }
        } catch (error: unknown) {
            console.error('Erreur modification versements automatiques:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la modification des versements automatiques')
        }
    }

    // ============ RÉCONCILIATION ============

    /**
     * Obtenir les rapports de réconciliation
     */
    async getReconciliationReports(filters?: {
        startDate?: Date
        endDate?: Date
        status?: string
    }): Promise<PayoutReconciliation[]> {
        try {
            const params = new URLSearchParams()

            if (filters) {
                if (filters.startDate) {
                    params.append('startDate', filters.startDate.toISOString())
                }
                if (filters.endDate) {
                    params.append('endDate', filters.endDate.toISOString())
                }
                if (filters.status) {
                    params.append('status', filters.status)
                }
            }

            const response: AxiosResponse<PayoutReconciliation[]> = await apiClient.get(
                `/v1/payouts/reconciliation${params.toString() ? `?${params.toString()}` : ''}`
            )

            return response.data.map(report => ({
                ...report,
                formattedTotalAmount: formatCurrencyXAF(report.totalAmount),
                formattedFees: formatCurrencyXAF(report.fees),
                formattedNetAmount: formatCurrencyXAF(report.netAmount),
                reportDate: new Date(report.reportDate),
                createdAt: new Date(report.createdAt)
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération rapports réconciliation:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des rapports de réconciliation')
        }
    }

    /**
     * Générer un rapport de réconciliation
     */
    async generateReconciliationReport(params: {
        startDate: Date
        endDate: Date
        includeTransactions: boolean
    }): Promise<PayoutReconciliation> {
        try {
            const response: AxiosResponse<PayoutReconciliation> = await apiClient.post(
                '/v1/payouts/reconciliation/generate',
                params
            )

            return {
                ...response.data,
                formattedTotalAmount: formatCurrencyXAF(response.data.totalAmount),
                formattedFees: formatCurrencyXAF(response.data.fees),
                formattedNetAmount: formatCurrencyXAF(response.data.netAmount),
                reportDate: new Date(response.data.reportDate),
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur génération rapport réconciliation:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la génération du rapport de réconciliation')
        }
    }

    // ============ NOTIFICATIONS ET ALERTES ============

    /**
     * Configurer les notifications de versement
     */
    async configurePayoutNotifications(config: {
        email: boolean
        sms: boolean
        push: boolean
        threshold: number
    }): Promise<void> {
        try {
            await apiClient.put('/v1/payouts/notifications', config)
        } catch (error: unknown) {
            console.error('Erreur configuration notifications:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la configuration des notifications')
        }
    }

    /**
     * Envoyer un rappel de versement
     */
    async sendPayoutReminder(payoutId: string): Promise<void> {
        try {
            await apiClient.post(`/v1/payouts/${payoutId}/remind`)
        } catch (error: unknown) {
            console.error('Erreur envoi rappel versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du rappel de versement')
        }
    }

    // ============ FONCTIONS UTILITAIRES ============

    /**
     * Formater un versement
     */
    private formatPayout(payout: Payout): Payout {
        return {
            ...payout,
            formattedAmount: formatCurrencyXAF(payout.amount),
            formattedFees: payout.fees ? formatCurrencyXAF(payout.fees) : undefined,
            formattedNetAmount: payout.netAmount ? formatCurrencyXAF(payout.netAmount) : formatCurrencyXAF(payout.amount),
            requestedAt: new Date(payout.requestedAt),
            processedAt: payout.processedAt ? new Date(payout.processedAt) : undefined,
            paidAt: payout.paidAt ? new Date(payout.paidAt) : undefined,
            createdAt: new Date(payout.createdAt),
            updatedAt: new Date(payout.updatedAt),
            status: payout.status as PAYOUT_STATUS,
            method: payout.method as PAYOUT_METHODS
        }
    }

    /**
     * Valider une demande de versement
     */
    private validatePayoutRequest(payoutData: CreatePayoutDto): void {
        if (payoutData.amount <= 0) {
            throw new Error('Le montant doit être supérieur à 0')
        }

        if (!payoutData.method) {
            throw new Error('La méthode de versement est requise')
        }

        // Validation spécifique selon la méthode
        switch (payoutData.method) {
            case PAYOUT_METHODS.MOBILE_MONEY:
                const phoneNumber = payoutData.details?.phoneNumber
                if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
                    throw new Error('Numéro de téléphone Mobile Money invalide')
                }
                break

            case PAYOUT_METHODS.BANK_TRANSFER:
                const accountNumber = payoutData.details?.accountNumber
                if (!accountNumber || !validateBankAccount(accountNumber)) {
                    throw new Error('Numéro de compte bancaire invalide')
                }
                break
        }
    }

    /**
     * Obtenir les méthodes de versement par défaut
     */
    private getDefaultPayoutMethods(): PayoutMethod[] {
        return [
            {
                id: 'bank_transfer',
                type: PAYOUT_METHODS.BANK_TRANSFER,
                name: 'Virement bancaire',
                isActive: true,
                fees: { percentage: 0.5, fixed: 500 },
                minAmount: 10000,
                maxAmount: 10000000,
                processingTime: '2-3 jours ouvrables',
                formattedFees: '0.5% + 500 FCFA',
                formattedMinAmount: '10 000 FCFA',
                formattedMaxAmount: '10 000 000 FCFA'
            },
            {
                id: 'mtn_money',
                type: PAYOUT_METHODS.MOBILE_MONEY,
                name: 'MTN Mobile Money',
                isActive: true,
                fees: { percentage: 1.0, fixed: 0 },
                minAmount: 1000,
                maxAmount: 500000,
                processingTime: 'Instantané',
                formattedFees: '1.0%',
                formattedMinAmount: '1 000 FCFA',
                formattedMaxAmount: '500 000 FCFA'
            },
            {
                id: 'orange_money',
                type: PAYOUT_METHODS.MOBILE_MONEY,
                name: 'Orange Money',
                isActive: true,
                fees: { percentage: 1.2, fixed: 50 },
                minAmount: 1000,
                maxAmount: 500000,
                processingTime: 'Instantané',
                formattedFees: '1.2% + 50 FCFA',
                formattedMinAmount: '1 000 FCFA',
                formattedMaxAmount: '500 000 FCFA'
            },
            {
                id: 'express_union',
                type: PAYOUT_METHODS.MOBILE_MONEY,
                name: 'Express Union',
                isActive: true,
                fees: { percentage: 0.8, fixed: 100 },
                minAmount: 5000,
                maxAmount: 1000000,
                processingTime: '1-2 heures',
                formattedFees: '0.8% + 100 FCFA',
                formattedMinAmount: '5 000 FCFA',
                formattedMaxAmount: '1 000 000 FCFA'
            }
        ]
    }

    /**
     * Obtenir la programmation par défaut
     */
    private getDefaultPayoutSchedule(): PayoutSchedule {
        const nextPayoutDate = new Date()
        nextPayoutDate.setDate(nextPayoutDate.getDate() + 7) // 7 jours dans le futur

        return {
            frequency: PAYOUT_SCHEDULES.WEEKLY,
            dayOfWeek: 5, // Vendredi
            autoPayout: true,
            minAmount: 10000,
            nextPayoutDate,
            formattedMinAmount: '10 000 FCFA'
        }
    }

    /**
     * Calculer les frais de versement
     */
    calculatePayoutFees(amount: number, method: PAYOUT_METHODS): {
        fees: number
        netAmount: number
        breakdown: {
            percentage: number
            fixed: number
            total: number
        }
    } {
        const methods = this.getDefaultPayoutMethods()
        const methodConfig = methods.find(m => m.type === method)

        if (!methodConfig || !methodConfig.fees) {
            return {
                fees: 0,
                netAmount: amount,
                breakdown: { percentage: 0, fixed: 0, total: 0 }
            }
        }

        const percentageFee = amount * (methodConfig.fees.percentage / 100)
        const fixedFee = methodConfig.fees.fixed
        const totalFees = percentageFee + fixedFee
        const netAmount = amount - totalFees

        return {
            fees: totalFees,
            netAmount,
            breakdown: {
                percentage: percentageFee,
                fixed: fixedFee,
                total: totalFees
            }
        }
    }

    /**
     * Vérifier l'éligibilité au versement
     */
    checkPayoutEligibility(amount: number, method: PAYOUT_METHODS): {
        eligible: boolean
        reasons: string[]
        minAmount: number
        maxAmount: number
    } {
        const methods = this.getDefaultPayoutMethods()
        const methodConfig = methods.find(m => m.type === method)
        const reasons: string[] = []

        if (!methodConfig || !methodConfig.isActive) {
            reasons.push('Méthode de versement non disponible')
            return {
                eligible: false,
                reasons,
                minAmount: 0,
                maxAmount: 0
            }
        }

        if (methodConfig.minAmount && amount < methodConfig.minAmount) {
            reasons.push(`Le montant minimum est de ${formatCurrencyXAF(methodConfig.minAmount)}`)
        }

        if (methodConfig.maxAmount && amount > methodConfig.maxAmount) {
            reasons.push(`Le montant maximum est de ${formatCurrencyXAF(methodConfig.maxAmount)}`)
        }

        return {
            eligible: reasons.length === 0,
            reasons,
            minAmount: methodConfig.minAmount || 0,
            maxAmount: methodConfig.maxAmount || Infinity
        }
    }

    /**
     * Générer un numéro de référence de versement
     */
    generatePayoutReference(): string {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

        return `PTO-${year}${month}${day}-${random}`
    }

    /**
     * Tester la connexion au service
     */
    async testConnection(): Promise<boolean> {
        try {
            await apiClient.get('/v1/payouts/health')
            return true
        } catch (error) {
            console.error('Erreur connexion service versements:', error)
            return false
        }
    }
}

// Export singleton instance
export default new PayoutService()
