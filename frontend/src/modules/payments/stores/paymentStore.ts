// @ts-nocheck
import { getErrorMessage } from '@/shared/utils/error-handler';
// frontend/src/modules/payments/stores/paymentStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
    Payment,
    PaymentMethod,
    Invoice,
    Refund,
    Payout,
    PaymentStats,
    CameroonPaymentProvider,
    PaymentStatus,
    PaymentFilters
} from '../types/payment.types'
import type { CartItem } from '@/modules/orders/types/orders.types'
import paymentService from '../services/paymentService'
import invoiceService from '../services/invoiceService'
import refundService from '../services/refundService'
import paymentMethodService from '../services/paymentMethodService'
import payoutService from '../services/payoutService'
import { useNotification } from '@/shared/composables/useNotification'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { PAYMENT_STATUS, PAYMENT_METHODS, INVOICE_STATUS } from '../constants/payment.constants'

export const usePaymentStore = defineStore('payment', () => {
    const { showSuccess, showError, showInfo } = useNotification()
    const authStore = useAuthStore()

    // ============ STATE ============
    // Transactions & paiements
    const payments = ref<Payment[]>([])
    const currentPayment = ref<Payment | null>(null)
    const paymentLoading = ref(false)
    const paymentError = ref<string | null>(null)

    // Méthodes de paiement
    const paymentMethods = ref<PaymentMethod[]>([])
    const defaultPaymentMethod = ref<PaymentMethod | null>(null)
    const cameroonProviders = ref<CameroonPaymentProvider[]>([
        {
            id: 'mtn_money',
            name: 'MTN Mobile Money',
            code: 'MTN',
            logo: '/assets/images/mobile-money/mtn-money.png',
            isActive: true,
            fees: { percentage: 1.5, fixed: 0 },
            countries: ['CM'],
            requiresPhoneNumber: true,
            transactionTypes: ['deposit', 'withdrawal', 'payment']
        },
        {
            id: 'orange_money',
            name: 'Orange Money',
            code: 'OM',
            logo: '/assets/images/mobile-money/orange-money.png',
            isActive: true,
            fees: { percentage: 1.2, fixed: 50 },
            countries: ['CM'],
            requiresPhoneNumber: true,
            transactionTypes: ['deposit', 'withdrawal', 'payment']
        },
        {
            id: 'express_union',
            name: 'Express Union',
            code: 'EU',
            logo: '/assets/images/mobile-money/express-union.png',
            isActive: true,
            fees: { percentage: 0.8, fixed: 100 },
            countries: ['CM'],
            requiresPhoneNumber: false,
            transactionTypes: ['deposit', 'withdrawal']
        }
    ])

    // Factures
    const invoices = ref<Invoice[]>([])
    const currentInvoice = ref<Invoice | null>(null)

    // Remboursements
    const refunds = ref<Refund[]>([])
    const refundRequests = ref<Refund[]>([])

    // Versements producteurs
    const payouts = ref<Payout[]>([])
    const upcomingPayouts = ref<Payout[]>([])

    // Statistiques
    const paymentStats = ref<PaymentStats>({
        totalRevenue: 0,
        averageTransaction: 0,
        totalTransactions: 0,
        conversionRate: 0,
        pendingPayments: 0,
        failedPayments: 0,
        successfulPayments: 0,
        revenueByMethod: {},
        monthlyRevenue: []
    })

    // Filtres et recherche
    const filters = ref<PaymentFilters>({
        status: 'all',
        method: 'all',
        dateRange: { start: null, end: null },
        minAmount: null,
        maxAmount: null,
        searchQuery: ''
    })

    // Panier en cours de paiement
    const cartForPayment = ref<{
        items: CartItem[]
        total: number
        deliveryAddress: any
        deliveryOption: any
    } | null>(null)

    // ============ GETTERS ============
    const getPaymentsByStatus = computed(() => (status: PaymentStatus) => {
        return payments.value.filter(payment => payment.status === status)
    })

    const getSuccessfulPayments = computed(() => {
        return payments.value.filter(p => p.status === PAYMENT_STATUS.SUCCESS)
    })

    const getPendingPayments = computed(() => {
        return payments.value.filter(p => p.status === PAYMENT_STATUS.PENDING)
    })

    const getFailedPayments = computed(() => {
        return payments.value.filter(p => p.status === PAYMENT_STATUS.FAILED)
    })

    const getRefundablePayments = computed(() => {
        return payments.value.filter(p =>
            p.status === PAYMENT_STATUS.SUCCESS &&
            p.refundStatus !== 'refunded' &&
            new Date(p.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 jours
        )
    })

    const getTotalRevenue = computed(() => {
        return getSuccessfulPayments.value.reduce((sum, payment) => sum + payment.amount, 0)
    })

    const getMonthlyRevenue = computed(() => {
        const monthly: Record<string, number> = {}
        getSuccessfulPayments.value.forEach(payment => {
            const month = new Date(payment.createdAt).toLocaleString('fr-FR', { month: 'short', year: 'numeric' })
            monthly[month] = (monthly[month] || 0) + payment.amount
        })
        return Object.entries(monthly).map(([month, revenue]) => ({ month, revenue }))
    })

    const getPaymentMethodsByCountry = computed(() => (countryCode: string) => {
        const globalMethods = paymentMethods.value.filter(m => m.isGlobal || !m.countries)
        const localMethods = paymentMethods.value.filter(m => m.countries?.includes(countryCode))
        return [...localMethods, ...globalMethods]
    })

    const getActiveCameroonProviders = computed(() => {
        return cameroonProviders.value.filter(provider => provider.isActive)
    })

    const getUpcomingPayoutTotal = computed(() => {
        return upcomingPayouts.value.reduce((sum, payout) => sum + payout.amount, 0)
    })

    const getFilteredPayments = computed(() => {
        let filtered = [...payments.value]

        if (filters.value.status !== 'all') {
            filtered = filtered.filter(p => p.status === filters.value.status)
        }

        if (filters.value.method !== 'all') {
            filtered = filtered.filter(p => p.method === filters.value.method)
        }

        if (filters.value.searchQuery) {
            const query = filters.value.searchQuery.toLowerCase()
            filtered = filtered.filter(p =>
                p.transactionId?.toLowerCase().includes(query) ||
                p.customerName?.toLowerCase().includes(query) ||
                p.customerEmail?.toLowerCase().includes(query)
            )
        }

        if (filters.value.minAmount !== null) {
            filtered = filtered.filter(p => p.amount >= filters.value.minAmount!)
        }

        if (filters.value.maxAmount !== null) {
            filtered = filtered.filter(p => p.amount <= filters.value.maxAmount!)
        }

        if (filters.value.dateRange.start && filters.value.dateRange.end) {
            filtered = filtered.filter(p => {
                const paymentDate = new Date(p.createdAt)
                return paymentDate >= filters.value.dateRange.start! &&
                    paymentDate <= filters.value.dateRange.end!
            })
        }

        return filtered
    })

    // ============ ACTIONS ============
    // Actions pour les paiements
    const createPayment = async (paymentData: {
        orderId: string
        amount: number
        method: string
        metadata?: Record<string, any>
    }): Promise<Payment | null> => {
        paymentLoading.value = true
        paymentError.value = null

        try {
            const payment = await paymentService.createPayment(paymentData)
            payments.value.unshift(payment)
            showSuccess('Paiement initié avec succès')

            // Si c'est un paiement Mobile Money, démarrer le polling
            if (payment.metadata?.provider?.startsWith('mtn') ||
                payment.metadata?.provider?.startsWith('orange')) {
                startPaymentPolling(payment.id)
            }

            return payment
        } catch (error: unknown) {
            paymentError.value = getErrorMessage(error)
            showError(paymentError.value)
            return null
        } finally {
            paymentLoading.value = false
        }
    }

    const confirmMobileMoneyPayment = async (paymentId: string, phoneNumber: string) => {
        try {
            const updatedPayment = await paymentService.confirmMobileMoneyPayment(paymentId, phoneNumber)
            const index = payments.value.findIndex(p => p.id === paymentId)
            if (index !== -1) {
                payments.value[index] = updatedPayment
            }
            showSuccess('Paiement Mobile Money confirmé')
            return updatedPayment
        } catch (error: unknown) {
            showError(getErrorMessage(error))
            throw error
        }
    }

    const getPayment = async (paymentId: string) => {
        paymentLoading.value = true
        try {
            const payment = await paymentService.getPayment(paymentId)
            currentPayment.value = payment
            return payment
        } catch (error: unknown) {
            paymentError.value = getErrorMessage(error)
            showError('Erreur lors de la récupération du paiement')
            return null
        } finally {
            paymentLoading.value = false
        }
    }

    const fetchUserPayments = async () => {
        paymentLoading.value = true
        try {
            const isProducerRole = authStore.hasRole?.('Producer') || authStore.hasRole?.('Producteur')
            const userPayments = await paymentService.getUserPayments({
                ...(isProducerRole ? ({ role: 'producer' } as any) : {})
            } as any)
            payments.value = userPayments
            return userPayments
        } catch (error: unknown) {
            paymentError.value = getErrorMessage(error)
            showError('Erreur lors du chargement des paiements')
            return []
        } finally {
            paymentLoading.value = false
        }
    }

    const startPaymentPolling = (paymentId: string) => {
        const interval = setInterval(async () => {
            try {
                const payment = await paymentService.getPayment(paymentId)
                const current = payments.value.find(p => p.id === paymentId)

                if (current && current.status !== payment.status) {
                    const index = payments.value.findIndex(p => p.id === paymentId)
                    if (index !== -1) {
                        payments.value[index] = payment

                        if (payment.status === PAYMENT_STATUS.SUCCESS) {
                            clearInterval(interval)
                            showSuccess('Paiement confirmé avec succès!')
                        } else if (payment.status === PAYMENT_STATUS.FAILED) {
                            clearInterval(interval)
                            showError('Le paiement a échoué')
                        }
                    }
                }

                // Arrêter le polling après 5 minutes
                setTimeout(() => clearInterval(interval), 5 * 60 * 1000)
            } catch (error) {
                console.error('Erreur polling paiement:', error)
            }
        }, 5000) // Toutes les 5 secondes
    }

    // Actions pour les méthodes de paiement
    const fetchPaymentMethods = async () => {
        try {
            const methods = await paymentMethodService.getPaymentMethods()
            paymentMethods.value = methods

            // Trouver la méthode par défaut
            defaultPaymentMethod.value = methods.find(m => m.isDefault) || methods[0] || null

            return methods
        } catch (error: unknown) {
            showError('Erreur lors du chargement des méthodes de paiement')
            return []
        }
    }

    const addPaymentMethod = async (methodData: {
        type: string
        details: Record<string, any>
        isDefault?: boolean
    }) => {
        try {
            const newMethod = await paymentMethodService.addPaymentMethod(methodData)
            paymentMethods.value.push(newMethod)

            if (methodData.isDefault) {
                await setDefaultPaymentMethod(newMethod.id)
            }

            showSuccess('Méthode de paiement ajoutée')
            return newMethod
        } catch (error: unknown) {
            showError(`Erreur lors de l'ajout de la méthode de paiement: ${getErrorMessage(error)}`)
            throw error
        }
    }

    const setDefaultPaymentMethod = async (methodId: string) => {
        try {
            await paymentMethodService.setDefaultPaymentMethod(methodId)

            // Mettre à jour localement
            paymentMethods.value = paymentMethods.value.map(method => ({
                ...method,
                isDefault: method.id === methodId
            }))

            defaultPaymentMethod.value = paymentMethods.value.find(m => m.id === methodId) || null
            showSuccess('Méthode de paiement par défaut mise à jour')
        } catch (error: unknown) {
            showError('Erreur lors de la modification de la méthode par défaut')
            throw error
        }
    }

    const removePaymentMethod = async (methodId: string) => {
        try {
            await paymentMethodService.removePaymentMethod(methodId)
            paymentMethods.value = paymentMethods.value.filter(m => m.id !== methodId)

            // Si on supprime la méthode par défaut, en choisir une autre
            if (defaultPaymentMethod.value?.id === methodId) {
                defaultPaymentMethod.value = paymentMethods.value[0] || null
            }

            showSuccess('Méthode de paiement supprimée')
        } catch (error: unknown) {
            showError('Erreur lors de la suppression de la méthode de paiement')
            throw error
        }
    }

    // Actions pour les factures
    const fetchInvoices = async () => {
        try {
            const userInvoices = await invoiceService.getUserInvoices()
            invoices.value = userInvoices
            return userInvoices
        } catch (error: unknown) {
            showError('Erreur lors du chargement des factures')
            return []
        }
    }

    const getInvoice = async (invoiceId: string) => {
        try {
            const invoice = await invoiceService.getInvoice(invoiceId)
            currentInvoice.value = invoice
            return invoice
        } catch (error: unknown) {
            showError('Erreur lors de la récupération de la facture')
            return null
        }
    }

    const downloadInvoice = async (invoiceId: string) => {
        try {
            const blob = await invoiceService.downloadInvoice(invoiceId)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `facture-${invoiceId}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            showSuccess('Facture téléchargée')
        } catch (error: unknown) {
            showError('Erreur lors du téléchargement de la facture')
            throw error
        }
    }

    const sendInvoiceByEmail = async (invoiceId: string, email: string) => {
        try {
            await invoiceService.sendInvoiceByEmail(invoiceId, email)
            showSuccess('Facture envoyée par email')
        } catch (error: unknown) {
            showError('Erreur lors de l\'envoi de la facture')
            throw error
        }
    }

    // Actions pour les remboursements
    const requestRefund = async (refundData: {
        paymentId: string
        reason: string
        amount?: number
        explanation: string
    }) => {
        try {
            const refund = await refundService.requestRefund(refundData)
            refundRequests.value.unshift(refund)
            showSuccess('Demande de remboursement envoyée')
            return refund
        } catch (error: unknown) {
            showError(getErrorMessage(error))
            throw error
        }
    }

    const fetchRefunds = async () => {
        try {
            const userRefunds = await refundService.getUserRefunds()
            refunds.value = userRefunds
            return userRefunds
        } catch (error: unknown) {
            showError('Erreur lors du chargement des remboursements')
            return []
        }
    }

    const fetchRefundRequests = async (asProducer: boolean = false) => {
        try {
            const requests = await refundService.getRefundRequests(asProducer)
            refundRequests.value = requests
            return requests
        } catch (error: unknown) {
            showError('Erreur lors du chargement des demandes de remboursement')
            return []
        }
    }

    const updateRefundStatus = async (refundId: string, status: 'approved' | 'rejected', reason?: string) => {
        try {
            const updatedRefund = await refundService.updateRefundStatus(refundId, status, reason)
            const index = refundRequests.value.findIndex(r => r.id === refundId)
            if (index !== -1) {
                refundRequests.value[index] = updatedRefund
            }
            showSuccess(`Remboursement ${status === 'approved' ? 'approuvé' : 'rejeté'}`)
            return updatedRefund
        } catch (error: unknown) {
            showError('Erreur lors de la mise à jour du remboursement')
            throw error
        }
    }

    // Actions pour les versements producteurs
    const fetchPayouts = async () => {
        if (!authStore.isProducer) return []

        try {
            const producerPayouts = await payoutService.getProducerPayouts()
            payouts.value = producerPayouts
            return producerPayouts
        } catch (error: unknown) {
            showError('Erreur lors du chargement des versements')
            return []
        }
    }

    const fetchUpcomingPayouts = async () => {
        if (!authStore.isProducer) return []

        try {
            const upcoming = await payoutService.getUpcomingPayouts()
            upcomingPayouts.value = upcoming
            return upcoming
        } catch (error: unknown) {
            showError('Erreur lors du chargement des versements à venir')
            return []
        }
    }

    const requestPayout = async (amount: number, method: string) => {
        if (!authStore.isProducer) {
            throw new Error('Réservé aux producteurs')
        }

        try {
            const payout = await payoutService.requestPayout(amount, method)
            payouts.value.unshift(payout)
            showSuccess('Demande de versement envoyée')
            return payout
        } catch (error: unknown) {
            showError(getErrorMessage(error))
            throw error
        }
    }

    // Actions pour les statistiques
    const fetchPaymentStats = async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
        try {
            const stats = await paymentService.getPaymentStats(period)
            paymentStats.value = stats
            return stats
        } catch (error: unknown) {
            showError('Erreur lors du chargement des statistiques')
            return paymentStats.value
        }
    }

    // Actions de gestion du panier
    const setCartForPayment = (cartData: {
        items: CartItem[]
        total: number
        deliveryAddress: any
        deliveryOption: any
    }) => {
        cartForPayment.value = cartData
    }

    const clearCartForPayment = () => {
        cartForPayment.value = null
    }

    // Actions de filtrage
    const setFilters = (newFilters: Partial<PaymentFilters>) => {
        filters.value = { ...filters.value, ...newFilters }
    }

    const resetFilters = () => {
        filters.value = {
            status: 'all',
            method: 'all',
            dateRange: { start: null, end: null },
            minAmount: null,
            maxAmount: null,
            searchQuery: ''
        }
    }

    // Synchronisation des données
    const syncPaymentData = async () => {
        const promises = [
            fetchPaymentMethods(),
            fetchUserPayments(),
            fetchInvoices(),
            fetchRefunds(),
            fetchPaymentStats()
        ]

        if (authStore.isProducer) {
            promises.push(fetchPayouts(), fetchUpcomingPayouts())
        }

        await Promise.all(promises.map(p => p.catch(e => {
            console.error('Erreur synchro paiements:', e)
            return null
        })))
    }

    // ============ INITIALISATION ============
    // Initialiser les méthodes de paiement par défaut si besoin
    const initializeDefaultPaymentMethods = () => {
        if (paymentMethods.value.length === 0) {
            paymentMethods.value = [
                {
                    id: 'stripe_card',
                    type: PAYMENT_METHODS.CREDIT_CARD,
                    name: 'Carte de crédit',
                    isActive: true,
                    isGlobal: true,
                    fees: { percentage: 2.9, fixed: 30 },
                    logo: '/assets/images/payment-providers/stripe.png',
                    metadata: { provider: 'stripe' }
                },
                {
                    id: 'paypal',
                    type: PAYMENT_METHODS.PAYPAL,
                    name: 'PayPal',
                    isActive: true,
                    isGlobal: true,
                    fees: { percentage: 3.4, fixed: 0 },
                    logo: '/assets/images/payment-providers/paypal.png',
                    metadata: { provider: 'paypal' }
                }
            ]
        }
    }

    // ============ EXPORTS ============
    return {
        // State
        payments,
        currentPayment,
        paymentLoading,
        paymentError,
        paymentMethods,
        defaultPaymentMethod,
        cameroonProviders,
        invoices,
        currentInvoice,
        refunds,
        refundRequests,
        payouts,
        upcomingPayouts,
        paymentStats,
        filters,
        cartForPayment,

        // Getters
        getPaymentsByStatus,
        getSuccessfulPayments,
        getPendingPayments,
        getFailedPayments,
        getRefundablePayments,
        getTotalRevenue,
        getMonthlyRevenue,
        getPaymentMethodsByCountry,
        getActiveCameroonProviders,
        getUpcomingPayoutTotal,
        getFilteredPayments,

        // Actions
        createPayment,
        confirmMobileMoneyPayment,
        getPayment,
        fetchUserPayments,
        fetchPaymentMethods,
        addPaymentMethod,
        setDefaultPaymentMethod,
        removePaymentMethod,
        fetchInvoices,
        getInvoice,
        downloadInvoice,
        sendInvoiceByEmail,
        requestRefund,
        fetchRefunds,
        fetchRefundRequests,
        updateRefundStatus,
        fetchPayouts,
        fetchUpcomingPayouts,
        requestPayout,
        fetchPaymentStats,
        setCartForPayment,
        clearCartForPayment,
        setFilters,
        resetFilters,
        syncPaymentData,
        initializeDefaultPaymentMethods
    }
})
