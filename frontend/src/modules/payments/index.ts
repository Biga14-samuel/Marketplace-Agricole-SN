// @ts-nocheck
// frontend/src/modules/payments/index.ts
/**
 * Module de paiement - Export principal
 * 
 * Ce module gère tous les aspects des paiements dans l'application :
 * - Paiements en ligne (cartes, Mobile Money)
 * - Gestion des méthodes de paiement
 * - Facturation et reçus
 * - Remboursements
 * - Versements aux producteurs
 * - Statistiques et rapports
 */

// Export des composants UI
export { default as PaymentMethodCard } from './components/PaymentMethodCard.vue'
export { default as PaymentMethodList } from './components/PaymentMethodList.vue'
export { default as PaymentForm } from './components/PaymentForm.vue'
export { default as PaymentStatus } from './components/PaymentStatus.vue'
export { default as InvoiceViewer } from './components/InvoiceViewer.vue'
export { default as InvoiceList } from './components/InvoiceList.vue'
export { default as RefundRequestForm } from './components/RefundRequestForm.vue'
export { default as PayoutCalculator } from './components/PayoutCalculator.vue'
export { default as PayoutList } from './components/PayoutList.vue'
export { default as MobileMoneyPayment } from './components/MobileMoneyPayment.vue'

// Export des vues (pages)
export { default as PaymentView } from './views/PaymentView.vue'
export { default as PaymentHistoryView } from './views/PaymentHistoryView.vue'
export { default as InvoiceView } from './views/InvoiceView.vue'
export { default as PaymentMethodsView } from './views/PaymentMethodsView.vue'
export { default as RefundsView } from './views/RefundsView.vue'
export { default as ProducerPayoutsView } from './views/ProducerPayoutsView.vue'
export { default as PaymentStatsView } from './views/PaymentStatsView.vue'

// Export des stores Pinia
export { usePaymentStore } from './stores/paymentStore'

// Export des services API
export * from './services/paymentService'
export * from './services/invoiceService'
export * from './services/refundService'
export * from './services/paymentMethodService'
export * from './services/payoutService'
export * from './services/cameroonPaymentService'

// Export des types TypeScript
export type * from './types/payment.types'
export type * from './types/invoice.types'
export type * from './types/refund.types'
export type * from './types/payment-method.types'
export type * from './types/payout.types'

// Export des utilitaires
export * from './utils/paymentFormatters'
export * from './utils/invoiceGenerator'
export * from './utils/currencyFormatter'
export * from './utils/cameroonPaymentUtils'
export * from './utils/paymentValidators'

// Export des configurations
export * from './config/paymentConfig'
export * from './config/cameroonPaymentProviders'
export * from './config/apiEndpoints'

// Export des constantes
export * from './constants/payment.constants'
export * from './constants/invoice.constants'
export * from './constants/cameroon.constants'

// Export des hooks/composables
export * from './hooks/usePayment'
export * from './hooks/useInvoice'
export * from './hooks/useMobileMoney'

// Export des routes
export { getPaymentRoutes, setupPaymentRoutes } from './router/paymentRoutes'
export type { PaymentRoutesConfig } from './router/paymentRoutes'

// Export des traductions (si besoin d'y accéder programmatiquement)
export { default as frTranslations } from './locales/fr/payments.json'
export { default as enTranslations } from './locales/en/payments.json'

// Export des interfaces principales pour une utilisation externe
export interface PaymentModuleConfig {
    apiBaseUrl: string
    mobileMoneyProviders: string[]
    defaultCurrency: string
    enableStripe: boolean
    enablePayPal: boolean
    enableMobileMoney: boolean
    minPayoutAmount: number
    autoRedirectOnSuccess: boolean
    successRedirectUrl?: string
    failureRedirectUrl?: string
}

// Fonction d'initialisation du module
export function initPaymentModule(config: Partial<PaymentModuleConfig> = {}): void {
    const defaultConfig: PaymentModuleConfig = {
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
        mobileMoneyProviders: ['mtn', 'orange', 'express-union'],
        defaultCurrency: 'XAF',
        enableStripe: true,
        enablePayPal: true,
        enableMobileMoney: true,
        minPayoutAmount: 5000,
        autoRedirectOnSuccess: true,
        successRedirectUrl: '/payments/success',
        failureRedirectUrl: '/payments/failed'
    }

    const finalConfig = { ...defaultConfig, ...config }

    // Configuration globale du module
    console.log('Initialisation du module de paiement avec la configuration:', finalConfig)

    // Stocker la configuration dans le store ou dans un contexte global
    if (typeof window !== 'undefined') {
        // @ts-ignore
        window.__PAYMENT_MODULE_CONFIG = finalConfig
    }
}

// Fonction pour récupérer la configuration
export function getPaymentModuleConfig(): PaymentModuleConfig {
    if (typeof window !== 'undefined') {
        // @ts-ignore
        return window.__PAYMENT_MODULE_CONFIG || {}
    }
    return {}
}

// Fonction utilitaire pour formater les montants d'argent
export function formatMoney(amount: number, currency: string = 'XAF'): string {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

// Fonction utilitaire pour vérifier si un paiement est valide
export function isValidPayment(status: string): boolean {
    const validStatuses = ['completed', 'authorized', 'settled']
    return validStatuses.includes(status.toLowerCase())
}

// Fonction utilitaire pour calculer les frais de transaction
export function calculateTransactionFees(
    amount: number,
    provider: string,
    isInternational: boolean = false
): number {
    let fees = 0

    switch (provider.toLowerCase()) {
        case 'mtn':
        case 'orange':
        case 'express-union':
            fees = amount * 0.005 // 0.5% pour Mobile Money
            break
        case 'stripe':
            fees = amount * 0.029 + 100 // 2.9% + 100 XAF
            if (isInternational) {
                fees += amount * 0.015 // 1.5% supplémentaire pour les cartes internationales
            }
            break
        case 'paypal':
            fees = amount * 0.034 + 100 // 3.4% + 100 XAF
            break
        case 'bank-transfer':
            fees = 500 // Frais fixes pour virement bancaire
            break
        default:
            fees = amount * 0.02 // 2% par défaut
    }

    return Math.round(fees)
}

// Export du module en tant qu'objet complet
const paymentModule = {
    // Composants
    components: {
        PaymentMethodCard,
        PaymentMethodList,
        PaymentForm,
        PaymentStatus,
        InvoiceViewer,
        InvoiceList,
        RefundRequestForm,
        PayoutCalculator,
        PayoutList,
        MobileMoneyPayment
    },

    // Vues
    views: {
        PaymentView,
        PaymentHistoryView,
        InvoiceView,
        PaymentMethodsView,
        RefundsView,
        ProducerPayoutsView,
        PaymentStatsView
    },

    // Services
    services: {
        paymentService: () => import('./services/paymentService'),
        invoiceService: () => import('./services/invoiceService'),
        refundService: () => import('./services/refundService'),
        paymentMethodService: () => import('./services/paymentMethodService'),
        payoutService: () => import('./services/payoutService'),
        cameroonPaymentService: () => import('./services/cameroonPaymentService')
    },

    // Utilitaires
    utils: {
        formatMoney,
        isValidPayment,
        calculateTransactionFees
    },

    // Initialisation
    init: initPaymentModule,
    getConfig: getPaymentModuleConfig
}

export default paymentModule