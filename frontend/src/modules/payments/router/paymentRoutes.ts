// @ts-nocheck
// frontend/src/modules/payments/router/paymentRoutes.ts
import type { RouteRecordRaw } from 'vue-router'
import { PaymentStatus } from '../constants/payment.constants'

/**
 * Routes pour le module de paiement
 */
const paymentRoutes: RouteRecordRaw[] = [
    {
        path: '/payments',
        name: 'payments',
        redirect: { name: 'payment-methods' },
        meta: {
            requiresAuth: true,
            title: 'payments.common.payment',
            breadcrumb: 'payments.common.payment'
        },
        children: [
            // Vue des méthodes de paiement
            {
                path: 'methods',
                name: 'payment-methods',
                component: () => import('../views/PaymentMethodsView.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'payments.methods.title',
                    breadcrumb: 'payments.methods.title',
                    permissions: ['view_payment_methods', 'manage_payment_methods']
                }
            },

            // Vue de paiement (pour effectuer un paiement)
            {
                path: 'checkout/:orderId?',
                name: 'payment-checkout',
                component: () => import('../views/PaymentView.vue'),
                props: true,
                meta: {
                    requiresAuth: true,
                    title: 'payments.common.payment',
                    breadcrumb: 'payments.common.payment',
                    permissions: ['make_payment']
                }
            },

            // Vue mobile money spécifique
            {
                path: 'mobile-money/:orderId',
                name: 'mobile-money-payment',
                component: () => import('../components/MobileMoneyPayment.vue'),
                props: true,
                meta: {
                    requiresAuth: true,
                    title: 'payments.mobileMoney.title',
                    breadcrumb: 'payments.mobileMoney.title',
                    permissions: ['make_payment']
                }
            },

            // Historique des paiements
            {
                path: 'history',
                name: 'payment-history',
                component: () => import('../views/PaymentHistoryView.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'payments.history.title',
                    breadcrumb: 'payments.history.title',
                    permissions: ['view_payment_history']
                }
            },

            // Détails d'un paiement spécifique
            {
                path: 'history/:transactionId',
                name: 'payment-details',
                component: () => import('../views/PaymentView.vue'),
                props: true,
                meta: {
                    requiresAuth: true,
                    title: 'payments.common.payment',
                    breadcrumb: 'payments.common.payment',
                    permissions: ['view_payment_details']
                }
            },

            // Factures
            {
                path: 'invoices',
                name: 'invoices',
                component: () => import('../views/InvoiceView.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'payments.invoices.title',
                    breadcrumb: 'payments.invoices.title',
                    permissions: ['view_invoices']
                }
            },

            // Détails d'une facture
            {
                path: 'invoices/:invoiceId',
                name: 'invoice-details',
                component: () => import('../components/InvoiceViewer.vue'),
                props: true,
                meta: {
                    requiresAuth: true,
                    title: 'payments.invoices.invoice',
                    breadcrumb: 'payments.invoices.invoice',
                    permissions: ['view_invoices']
                }
            },

            // Remboursements
            {
                path: 'refunds',
                name: 'refunds',
                component: () => import('../views/RefundsView.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'payments.refunds.title',
                    breadcrumb: 'payments.refunds.title',
                    permissions: ['view_refunds', 'request_refunds']
                }
            },

            // Demande de remboursement pour une transaction spécifique
            {
                path: 'refunds/request/:transactionId',
                name: 'request-refund',
                component: () => import('../components/RefundRequestForm.vue'),
                props: true,
                meta: {
                    requiresAuth: true,
                    title: 'payments.refunds.requestRefund',
                    breadcrumb: 'payments.refunds.requestRefund',
                    permissions: ['request_refunds']
                }
            },

            // Versements producteur (pour les producteurs/vendeurs)
            {
                path: 'payouts',
                name: 'payouts',
                component: () => import('../views/ProducerPayoutsView.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'payments.payouts.title',
                    breadcrumb: 'payments.payouts.title',
                    permissions: ['view_payouts', 'request_payouts'],
                    role: 'producer' // Exemple de restriction par rôle
                }
            },

            // Demande de versement
            {
                path: 'payouts/request',
                name: 'request-payout',
                component: () => import('../components/PayoutCalculator.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'payments.payouts.requestPayout',
                    breadcrumb: 'payments.payouts.requestPayout',
                    permissions: ['request_payouts'],
                    role: 'producer'
                }
            },

            // Statistiques de paiement (pour les administrateurs)
            {
                path: 'statistics',
                name: 'payment-statistics',
                component: () => import('../views/PaymentStatsView.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'payments.statistics.title',
                    breadcrumb: 'payments.statistics.title',
                    permissions: ['view_payment_statistics'],
                    role: 'admin'
                }
            },

            // Page de retour après paiement (callback)
            {
                path: 'callback/:provider',
                name: 'payment-callback',
                component: () => import('../views/PaymentView.vue'),
                props: true,
                meta: {
                    requiresAuth: false, // Peut être accessible sans auth pour les callbacks externes
                    title: 'payments.common.payment',
                    permissions: []
                }
            },

            // Page d'échec de paiement
            {
                path: 'failed',
                name: 'payment-failed',
                component: () => import('../components/PaymentStatus.vue'),
                props: () => ({
                    status: PaymentStatus.FAILED
                }),
                meta: {
                    requiresAuth: true,
                    title: 'payments.status.failed',
                    breadcrumb: 'payments.status.failed'
                }
            },

            // Page de succès de paiement
            {
                path: 'success',
                name: 'payment-success',
                component: () => import('../components/PaymentStatus.vue'),
                props: () => ({
                    status: PaymentStatus.COMPLETED
                }),
                meta: {
                    requiresAuth: true,
                    title: 'payments.status.completed',
                    breadcrumb: 'payments.status.completed'
                }
            },

            // Page d'annulation de paiement
            {
                path: 'cancelled',
                name: 'payment-cancelled',
                component: () => import('../components/PaymentStatus.vue'),
                props: () => ({
                    status: PaymentStatus.CANCELLED
                }),
                meta: {
                    requiresAuth: true,
                    title: 'payments.status.cancelled',
                    breadcrumb: 'payments.status.cancelled'
                }
            }
        ]
    },

    // Route pour le webhook de paiement (si nécessaire en frontend, bien que généralement backend)
    // Note: Cette route est généralement gérée par le backend, mais on peut avoir une page de confirmation
    {
        path: '/payment-webhook/:provider',
        name: 'payment-webhook',
        component: () => import('../views/PaymentView.vue'),
        meta: {
            requiresAuth: false
        }
    }
]

/**
 * Fonction pour obtenir les routes du module paiement
 * @returns {RouteRecordRaw[]} Les routes du module paiement
 */
export function getPaymentRoutes(): RouteRecordRaw[] {
    return paymentRoutes
}

/**
 * Fonction pour ajouter les routes du module paiement au routeur principal
 * @param router - L'instance du routeur Vue Router
 */
export function setupPaymentRoutes(router: { addRoute: (route: unknown) => void }): void {
    paymentRoutes.forEach(route => {
        router.addRoute(route)
    })
}

/**
 * Route par défaut pour la navigation après un paiement réussi
 */
export const DEFAULT_SUCCESS_REDIRECT = { name: 'payment-success' }

/**
 * Route par défaut pour la navigation après un paiement échoué
 */
export const DEFAULT_FAILURE_REDIRECT = { name: 'payment-failed' }

/**
 * Route par défaut pour la navigation après une annulation
 */
export const DEFAULT_CANCELLATION_REDIRECT = { name: 'payment-cancelled' }

export default paymentRoutes