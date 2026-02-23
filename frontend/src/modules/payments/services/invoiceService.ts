// @ts-nocheck
// frontend/src/modules/payments/services/invoiceService.ts
import axios, { AxiosResponse } from 'axios'
import type {
    Invoice,
    InvoiceLineItem,
    CreateInvoiceDto,
    UpdateInvoiceDto,
    InvoiceFiltersDto,
    InvoiceSummary,
    InvoiceStats
} from '../types/invoice.types'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { formatCurrencyXAF } from '../utils/currencyFormatter'
import { INVOICE_STATUS, INVOICE_TYPES } from '../constants/invoice.constants'
import { generateInvoicePDF } from '../utils/invoiceGenerator'

// Client axios partagé avec la configuration de base
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
 * Service pour la gestion des factures
 */
class InvoiceService {
    // ============ INVOICES ============

    /**
     * Créer une nouvelle facture
     */
    async createInvoice(invoiceData: CreateInvoiceDto): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.post('/v1/invoices', {
                ...invoiceData,
                currency: 'XAF'
            })

            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur création facture:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la création de la facture')
        }
    }

    /**
     * Obtenir les factures de l'utilisateur
     */
    async getUserInvoices(filters?: InvoiceFiltersDto): Promise<Invoice[]> {
        try {
            const params = new URLSearchParams()

            if (filters) {
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status)
                }
                if (filters.type && filters.type !== 'all') {
                    params.append('type', filters.type)
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
                if (filters.producerId) {
                    params.append('producerId', filters.producerId)
                }
            }

            const url = `/v1/invoices${params.toString() ? `?${params.toString()}` : ''}`
            const response: AxiosResponse<Invoice[]> = await apiClient.get(url)

            return response.data.map(invoice => this.formatInvoice(invoice))
        } catch (error: unknown) {
            console.error('Erreur récupération factures:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des factures')
        }
    }

    /**
     * Obtenir une facture par son ID
     */
    async getInvoice(invoiceId: string): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.get(`/v1/invoices/${invoiceId}`)
            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur récupération facture:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la facture')
        }
    }

    /**
     * Obtenir les factures liées à une commande
     */
    async getOrderInvoices(orderId: string): Promise<Invoice[]> {
        try {
            const response: AxiosResponse<Invoice[]> = await apiClient.get(`/v1/orders/${orderId}/invoices`)
            return response.data.map(invoice => this.formatInvoice(invoice))
        } catch (error: unknown) {
            console.error('Erreur récupération factures commande:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des factures de la commande')
        }
    }

    /**
     * Mettre à jour une facture
     */
    async updateInvoice(invoiceId: string, updateData: UpdateInvoiceDto): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.put(
                `/v1/invoices/${invoiceId}`,
                updateData
            )

            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur mise à jour facture:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la facture')
        }
    }

    /**
     * Supprimer une facture
     */
    async deleteInvoice(invoiceId: string): Promise<void> {
        try {
            await apiClient.delete(`/v1/invoices/${invoiceId}`)
        } catch (error: unknown) {
            console.error('Erreur suppression facture:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la facture')
        }
    }

    /**
     * Annuler une facture
     */
    async cancelInvoice(invoiceId: string, reason?: string): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.post(
                `/v1/invoices/${invoiceId}/cancel`,
                { reason }
            )

            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur annulation facture:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'annulation de la facture')
        }
    }

    // ============ TÉLÉCHARGEMENT ET ENVOI ============

    /**
     * Télécharger une facture en PDF
     */
    async downloadInvoice(invoiceId: string): Promise<Blob> {
        try {
            const response: AxiosResponse<Blob> = await apiClient.get(
                `/v1/invoices/${invoiceId}/download`,
                {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/pdf'
                    }
                }
            )

            return response.data
        } catch (error: unknown) {
            console.error('Erreur téléchargement facture:', error)

            // Fallback: générer le PDF côté client si l'API échoue
            try {
                const invoice = await this.getInvoice(invoiceId)
                const pdfBlob = await generateInvoicePDF(invoice)
                return pdfBlob
            } catch (fallbackError) {
                throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement de la facture')
            }
        }
    }

    /**
     * Prévisualiser une facture
     */
    async previewInvoice(invoiceId: string): Promise<string> {
        try {
            const blob = await this.downloadInvoice(invoiceId)
            return URL.createObjectURL(blob)
        } catch (error: unknown) {
            console.error('Erreur prévisualisation facture:', error)
            throw new Error('Erreur lors de la prévisualisation de la facture')
        }
    }

    /**
     * Envoyer une facture par email
     */
    async sendInvoiceByEmail(invoiceId: string, email: string, message?: string): Promise<void> {
        try {
            await apiClient.post(`/v1/invoices/${invoiceId}/send`, {
                email,
                message
            })
        } catch (error: unknown) {
            console.error('Erreur envoi facture par email:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la facture')
        }
    }

    /**
     * Partager une facture par lien
     */
    async shareInvoice(invoiceId: string, expiresIn?: number): Promise<{ shareUrl: string; expiresAt: Date }> {
        try {
            const response: AxiosResponse<{ shareUrl: string; expiresAt: string }> = await apiClient.post(
                `/v1/invoices/${invoiceId}/share`,
                { expiresIn }
            )

            return {
                shareUrl: response.data.shareUrl,
                expiresAt: new Date(response.data.expiresAt)
            }
        } catch (error: unknown) {
            console.error('Erreur partage facture:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du partage de la facture')
        }
    }

    // ============ FACTURES RÉCURRENTES ============

    /**
     * Créer une facture récurrente
     */
    async createRecurringInvoice(recurringData: {
        customerId: string
        items: InvoiceLineItem[]
        frequency: 'monthly' | 'quarterly' | 'yearly'
        startDate: Date
        endDate?: Date
        description?: string
    }): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.post('/v1/invoices/recurring', {
                ...recurringData,
                type: INVOICE_TYPES.RECURRING
            })

            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur création facture récurrente:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la création de la facture récurrente')
        }
    }

    /**
     * Suspendre une facture récurrente
     */
    async suspendRecurringInvoice(invoiceId: string): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.post(
                `/v1/invoices/${invoiceId}/suspend`
            )

            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur suspension facture récurrente:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la suspension de la facture récurrente')
        }
    }

    /**
     * Reprendre une facture récurrente
     */
    async resumeRecurringInvoice(invoiceId: string): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.post(
                `/v1/invoices/${invoiceId}/resume`
            )

            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur reprise facture récurrente:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la reprise de la facture récurrente')
        }
    }

    // ============ STATISTIQUES ET RAPPORTS ============

    /**
     * Obtenir les statistiques des factures
     */
    async getInvoiceStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<InvoiceStats> {
        try {
            const response: AxiosResponse<InvoiceStats> = await apiClient.get(
                `/v1/invoices/stats?period=${period}`
            )

            return {
                ...response.data,
                formattedTotalAmount: formatCurrencyXAF(response.data.totalAmount || 0),
                formattedPaidAmount: formatCurrencyXAF(response.data.paidAmount || 0),
                formattedPendingAmount: formatCurrencyXAF(response.data.pendingAmount || 0),
                formattedOverdueAmount: formatCurrencyXAF(response.data.overdueAmount || 0)
            }
        } catch (error: unknown) {
            console.error('Erreur récupération statistiques factures:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques')
        }
    }

    /**
     * Obtenir le résumé des factures
     */
    async getInvoiceSummary(): Promise<InvoiceSummary> {
        try {
            const response: AxiosResponse<InvoiceSummary> = await apiClient.get('/v1/invoices/summary')
            return response.data
        } catch (error: unknown) {
            console.error('Erreur récupération résumé factures:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement du résumé')
        }
    }

    /**
     * Exporter les factures en CSV
     */
    async exportInvoices(format: 'csv' | 'excel', filters?: InvoiceFiltersDto): Promise<Blob> {
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

            const response: AxiosResponse<Blob> = await apiClient.get(`/v1/invoices/export?${params.toString()}`, {
                responseType: 'blob'
            })

            return response.data
        } catch (error: unknown) {
            console.error('Erreur export factures:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'export des factures')
        }
    }

    /**
     * Générer un rapport de facturation
     */
    async generateBillingReport(params: {
        startDate: Date
        endDate: Date
        groupBy: 'day' | 'week' | 'month'
        includeDetails: boolean
    }): Promise<any> {
        try {
            const response: AxiosResponse = await apiClient.post('/v1/invoices/report', params)
            return response.data
        } catch (error: unknown) {
            console.error('Erreur génération rapport facturation:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la génération du rapport')
        }
    }

    // ============ FACTURES POUR PRODUCTEURS ============

    /**
     * Obtenir les factures des producteurs
     */
    async getProducerInvoices(filters?: InvoiceFiltersDto): Promise<Invoice[]> {
        try {
            const params = new URLSearchParams()
            params.append('producer', 'true')

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

            const response: AxiosResponse<Invoice[]> = await apiClient.get(
                `/v1/invoices?${params.toString()}`
            )

            return response.data.map(invoice => this.formatInvoice(invoice))
        } catch (error: unknown) {
            console.error('Erreur récupération factures producteur:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des factures producteur')
        }
    }

    /**
     * Générer une facture de versement pour producteur
     */
    async generatePayoutInvoice(payoutId: string): Promise<Invoice> {
        try {
            const response: AxiosResponse<Invoice> = await apiClient.post(
                `/v1/payouts/${payoutId}/invoice`
            )

            return this.formatInvoice(response.data)
        } catch (error: unknown) {
            console.error('Erreur génération facture versement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la génération de la facture de versement')
        }
    }

    // ============ FONCTIONS UTILITAIRES ============

    /**
     * Formater une facture
     */
    private formatInvoice(invoice: Invoice): Invoice {
        const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
        const taxAmount = invoice.taxRate ? subtotal * (invoice.taxRate / 100) : 0
        const totalAmount = subtotal + taxAmount - (invoice.discountAmount || 0)

        return {
            ...invoice,
            subtotal,
            taxAmount,
            totalAmount,
            formattedSubtotal: formatCurrencyXAF(subtotal),
            formattedTaxAmount: formatCurrencyXAF(taxAmount),
            formattedTotalAmount: formatCurrencyXAF(totalAmount),
            formattedDiscountAmount: invoice.discountAmount ? formatCurrencyXAF(invoice.discountAmount) : undefined,
            issueDate: new Date(invoice.issueDate),
            dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
            paidAt: invoice.paidAt ? new Date(invoice.paidAt) : undefined,
            createdAt: new Date(invoice.createdAt),
            updatedAt: new Date(invoice.updatedAt),
            items: invoice.items.map(item => ({
                ...item,
                formattedUnitPrice: formatCurrencyXAF(item.unitPrice),
                formattedTotal: formatCurrencyXAF(item.quantity * item.unitPrice)
            })),
            status: invoice.status as INVOICE_STATUS,
            type: invoice.type as INVOICE_TYPES
        }
    }

    /**
     * Valider un numéro de facture
     */
    validateInvoiceNumber(invoiceNumber: string): boolean {
        // Format: INV-YYYY-MM-NNNN
        const regex = /^INV-\d{4}-\d{2}-\d{4}$/
        return regex.test(invoiceNumber)
    }

    /**
     * Générer un numéro de facture
     */
    generateInvoiceNumber(prefix: string = 'INV'): string {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

        return `${prefix}-${year}-${month}-${random}`
    }

    /**
     * Calculer les taxes
     */
    calculateTaxes(subtotal: number, taxRate: number = 19.25): { taxAmount: number; total: number } {
        const taxAmount = subtotal * (taxRate / 100)
        const total = subtotal + taxAmount
        return { taxAmount, total }
    }

    /**
     * Vérifier si une facture est en retard
     */
    isInvoiceOverdue(invoice: Invoice): boolean {
        if (invoice.status === INVOICE_STATUS.PAID) return false
        if (!invoice.dueDate) return false

        const dueDate = new Date(invoice.dueDate)
        const today = new Date()

        return today > dueDate
    }

    /**
     * Obtenir le nombre de jours de retard
     */
    getDaysOverdue(invoice: Invoice): number {
        if (!this.isInvoiceOverdue(invoice) || !invoice.dueDate) return 0

        const dueDate = new Date(invoice.dueDate)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - dueDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return diffDays
    }

    /**
     * Tester la connexion au service de facturation
     */
    async testConnection(): Promise<boolean> {
        try {
            await apiClient.get('/v1/invoices/health')
            return true
        } catch (error) {
            console.error('Erreur connexion service facturation:', error)
            return false
        }
    }
}

// Export singleton instance
export default new InvoiceService()