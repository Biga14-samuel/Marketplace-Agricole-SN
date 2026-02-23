// frontend/src/modules/payments/adapters/payment.adapter.ts

import type {
    Payment,
    PaymentMethod,
    Invoice,
    Refund,
    PaymentStats,
    CreatePaymentDto,
    CreatePaymentMethodDto,
    RefundRequestDto
} from '../types/payment.types'

import { PAYMENT_STATUS, PAYMENT_METHODS, PAYMENT_CURRENCIES, INVOICE_STATUS, REFUND_STATUS, PAYOUT_STATUS } from '../types/payment.types'

// ============ BACKEND API TYPES ============
// These match the Python backend schemas

interface BackendPayment {
    id: number
    order_id: number
    payment_method: 'card' | 'transfer' | 'cash' | 'wallet'
    amount: string // Decimal as string
    currency: string
    status: 'pending' | 'completed' | 'failed' | 'refunded'
    transaction_id?: string
    provider?: 'stripe' | 'paypal'
    additional_data?: any
    created_at: string
    updated_at: string
}

interface BackendPaymentMethod {
    id: number
    user_id: number
    type: 'card' | 'transfer' | 'cash' | 'wallet'
    last4?: string
    brand?: string
    is_default: boolean
    stripe_payment_method_id?: string
    created_at: string
    updated_at: string
}

interface BackendRefund {
    id: number
    payment_id: number
    amount: string
    reason?: string
    status: 'pending' | 'completed' | 'failed'
    created_at: string
    processed_at?: string
}

interface BackendInvoice {
    id: number
    order_id: number
    invoice_number: string
    issue_date: string
    due_date?: string
    subtotal: string
    tax_amount: string
    total: string
    status: 'draft' | 'sent' | 'paid' | 'overdue'
    file_path?: string
    created_at: string
    updated_at: string
}

interface BackendPaymentStats {
    total_payments: number
    total_amount: string
    completed_amount: string
    pending_amount: string
    failed_count: number
    refunded_amount: string
}

// ============ ENUM MAPPERS ============

const BACKEND_TO_FRONTEND_STATUS: Record<string, PAYMENT_STATUS> = {
    'pending': PAYMENT_STATUS.PENDING,
    'completed': PAYMENT_STATUS.SUCCESS,
    'failed': PAYMENT_STATUS.FAILED,
    'refunded': PAYMENT_STATUS.REFUNDED
}

const FRONTEND_TO_BACKEND_STATUS: Record<PAYMENT_STATUS, string> = {
    [PAYMENT_STATUS.PENDING]: 'pending',
    [PAYMENT_STATUS.PROCESSING]: 'pending', // Map to closest backend equivalent
    [PAYMENT_STATUS.SUCCESS]: 'completed',
    [PAYMENT_STATUS.FAILED]: 'failed',
    [PAYMENT_STATUS.CANCELLED]: 'failed', // Map to closest backend equivalent
    [PAYMENT_STATUS.REFUNDED]: 'refunded',
    [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 'refunded', // Map to closest backend equivalent
    [PAYMENT_STATUS.EXPIRED]: 'failed', // Map to closest backend equivalent
    [PAYMENT_STATUS.DISPUTED]: 'failed' // Map to closest backend equivalent
}

const BACKEND_TO_FRONTEND_METHOD: Record<string, PAYMENT_METHODS> = {
    'card': PAYMENT_METHODS.CREDIT_CARD,
    'transfer': PAYMENT_METHODS.BANK_TRANSFER,
    'cash': PAYMENT_METHODS.CASH_ON_DELIVERY,
    'wallet': PAYMENT_METHODS.DIGITAL_WALLET
}

const FRONTEND_TO_BACKEND_METHOD: Record<PAYMENT_METHODS, string> = {
    [PAYMENT_METHODS.CREDIT_CARD]: 'card',
    [PAYMENT_METHODS.DEBIT_CARD]: 'card',
    [PAYMENT_METHODS.MOBILE_MONEY]: 'wallet',
    [PAYMENT_METHODS.BANK_TRANSFER]: 'transfer',
    [PAYMENT_METHODS.PAYPAL]: 'wallet',
    [PAYMENT_METHODS.DIGITAL_WALLET]: 'wallet',
    [PAYMENT_METHODS.CASH_ON_DELIVERY]: 'cash',
    [PAYMENT_METHODS.CRYPTO]: 'wallet'
}

const BACKEND_TO_FRONTEND_INVOICE_STATUS: Record<string, INVOICE_STATUS> = {
    'draft': INVOICE_STATUS.DRAFT,
    'sent': INVOICE_STATUS.SENT,
    'paid': INVOICE_STATUS.PAID,
    'overdue': INVOICE_STATUS.OVERDUE
}

const BACKEND_TO_FRONTEND_REFUND_STATUS: Record<string, REFUND_STATUS> = {
    'pending': REFUND_STATUS.REQUESTED,
    'completed': REFUND_STATUS.COMPLETED,
    'failed': REFUND_STATUS.FAILED
}

// ============ UTILITY FUNCTIONS ============

export function formatCurrencyXAF(amount: number): string {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

export function parseDecimalString(value: string): number {
    return parseFloat(value) || 0
}

export function formatDateString(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-CM', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// ============ ADAPTERS ============

/**
 * Adapter for Payment objects
 */
export class PaymentAdapter {
    /**
     * Convert backend payment to frontend payment
     */
    static toFrontend(backendPayment: BackendPayment): Payment {
        const amount = parseDecimalString(backendPayment.amount)

        return {
            id: backendPayment.id.toString(),
            orderId: backendPayment.order_id.toString(),
            transactionId: backendPayment.transaction_id,
            reference: backendPayment.transaction_id || `PAY-${backendPayment.id}`,
            amount,
            currency: PAYMENT_CURRENCIES.XAF,
            status: BACKEND_TO_FRONTEND_STATUS[backendPayment.status] || PAYMENT_STATUS.PENDING,
            method: BACKEND_TO_FRONTEND_METHOD[backendPayment.payment_method] || PAYMENT_METHODS.CREDIT_CARD,

            // Customer info (will be populated from additional_data or order)
            customerId: backendPayment.additional_data?.customer_id || '',
            customerEmail: backendPayment.additional_data?.customer_email,
            customerName: backendPayment.additional_data?.customer_name,
            customerPhone: backendPayment.additional_data?.customer_phone,

            // Fees and amounts (calculated)
            fees: backendPayment.additional_data?.fees ? parseDecimalString(backendPayment.additional_data.fees) : undefined,
            taxAmount: backendPayment.additional_data?.tax_amount ? parseDecimalString(backendPayment.additional_data.tax_amount) : undefined,
            netAmount: amount, // Will be calculated properly in service

            // Metadata
            metadata: backendPayment.additional_data,
            description: backendPayment.additional_data?.description,
            notes: backendPayment.additional_data?.notes || [],

            // Method details
            methodDetails: {
                provider: backendPayment.provider,
                cardLast4: backendPayment.additional_data?.card_last4,
                cardBrand: backendPayment.additional_data?.card_brand,
                mobileNumber: backendPayment.additional_data?.mobile_number,
                bankAccount: backendPayment.additional_data?.bank_account,
                walletId: backendPayment.additional_data?.wallet_id
            },

            // Dates
            createdAt: new Date(backendPayment.created_at),
            updatedAt: new Date(backendPayment.updated_at),
            paidAt: backendPayment.status === 'completed' ? new Date(backendPayment.updated_at) : undefined,
            failedAt: backendPayment.status === 'failed' ? new Date(backendPayment.updated_at) : undefined,
            refundedAt: backendPayment.status === 'refunded' ? new Date(backendPayment.updated_at) : undefined,

            // Formatted values
            formattedAmount: formatCurrencyXAF(amount),
            formattedFees: backendPayment.additional_data?.fees ? formatCurrencyXAF(parseDecimalString(backendPayment.additional_data.fees)) : undefined,
            formattedNetAmount: formatCurrencyXAF(amount),
            formattedCreatedAt: formatDateString(backendPayment.created_at)
        }
    }

    /**
     * Convert frontend create payment DTO to backend format
     */
    static toBackendCreate(frontendDto: CreatePaymentDto): any {
        return {
            order_id: parseInt(frontendDto.orderId),
            payment_method: FRONTEND_TO_BACKEND_METHOD[frontendDto.method],
            amount: frontendDto.amount.toString(),
            currency: frontendDto.currency || 'XAF',
            provider: frontendDto.metadata?.provider,
            additional_data: {
                customer_id: frontendDto.customerId,
                customer_email: frontendDto.customerEmail,
                customer_name: frontendDto.customerName,
                customer_phone: frontendDto.customerPhone,
                description: frontendDto.description,
                items: frontendDto.items,
                ...frontendDto.metadata
            }
        }
    }
}

/**
 * Adapter for PaymentMethod objects
 */
export class PaymentMethodAdapter {
    static toFrontend(backendMethod: BackendPaymentMethod): PaymentMethod {
        return {
            id: backendMethod.id.toString(),
            userId: backendMethod.user_id.toString(),
            type: BACKEND_TO_FRONTEND_METHOD[backendMethod.type] || PAYMENT_METHODS.CREDIT_CARD,
            name: this.generateMethodName(backendMethod),
            description: this.generateMethodDescription(backendMethod),
            isActive: true,
            isDefault: backendMethod.is_default,
            isGlobal: false,

            details: {
                last4: backendMethod.last4,
                brand: backendMethod.brand,
                stripe_payment_method_id: backendMethod.stripe_payment_method_id
            },

            // Dates
            createdAt: new Date(backendMethod.created_at),
            updatedAt: new Date(backendMethod.updated_at),

            // Formatted
            formattedLastUsedAt: formatDateString(backendMethod.updated_at)
        }
    }

    static toBackendCreate(frontendDto: CreatePaymentMethodDto): any {
        return {
            user_id: parseInt(frontendDto.details.user_id || '0'),
            type: FRONTEND_TO_BACKEND_METHOD[frontendDto.type],
            last4: frontendDto.details.last4,
            brand: frontendDto.details.brand,
            is_default: frontendDto.isDefault || false,
            stripe_payment_method_id: frontendDto.details.stripe_payment_method_id
        }
    }

    private static generateMethodName(method: BackendPaymentMethod): string {
        if (method.type === 'card' && method.brand && method.last4) {
            return `${method.brand} •••• ${method.last4}`
        }

        const typeNames = {
            'card': 'Carte bancaire',
            'transfer': 'Virement bancaire',
            'cash': 'Paiement à la livraison',
            'wallet': 'Portefeuille numérique'
        }

        return typeNames[method.type] || 'Méthode de paiement'
    }

    private static generateMethodDescription(method: BackendPaymentMethod): string {
        if (method.type === 'card') {
            return 'Paiement par carte bancaire'
        }
        return 'Méthode de paiement'
    }
}

/**
 * Adapter for Invoice objects
 */
export class InvoiceAdapter {
    static toFrontend(backendInvoice: BackendInvoice): Invoice {
        const subtotal = parseDecimalString(backendInvoice.subtotal)
        const taxAmount = parseDecimalString(backendInvoice.tax_amount)
        const totalAmount = parseDecimalString(backendInvoice.total)

        return {
            id: backendInvoice.id.toString(),
            invoiceNumber: backendInvoice.invoice_number,
            orderId: backendInvoice.order_id.toString(),

            // Customer info (will be populated from order)
            customerId: '',
            customerName: '',
            customerEmail: '',

            // Invoice info
            issueDate: new Date(backendInvoice.issue_date),
            dueDate: backendInvoice.due_date ? new Date(backendInvoice.due_date) : undefined,
            status: BACKEND_TO_FRONTEND_INVOICE_STATUS[backendInvoice.status] || INVOICE_STATUS.DRAFT,
            type: 'standard',

            // Amounts
            subtotal,
            taxAmount,
            totalAmount,
            amountPaid: backendInvoice.status === 'paid' ? totalAmount : 0,
            amountDue: backendInvoice.status === 'paid' ? 0 : totalAmount,

            // Items (will be populated from order)
            items: [],

            // Metadata
            pdfUrl: backendInvoice.file_path,

            // Dates
            createdAt: new Date(backendInvoice.created_at),
            updatedAt: new Date(backendInvoice.updated_at),
            paidAt: backendInvoice.status === 'paid' ? new Date(backendInvoice.updated_at) : undefined,

            // Formatted
            formattedSubtotal: formatCurrencyXAF(subtotal),
            formattedTaxAmount: formatCurrencyXAF(taxAmount),
            formattedTotalAmount: formatCurrencyXAF(totalAmount),
            formattedAmountDue: formatCurrencyXAF(backendInvoice.status === 'paid' ? 0 : totalAmount),
            formattedIssueDate: formatDateString(backendInvoice.issue_date),
            formattedDueDate: backendInvoice.due_date ? formatDateString(backendInvoice.due_date) : undefined
        }
    }
}

/**
 * Adapter for Refund objects
 */
export class RefundAdapter {
    static toFrontend(backendRefund: BackendRefund): Refund {
        const amount = parseDecimalString(backendRefund.amount)

        return {
            id: backendRefund.id.toString(),
            paymentId: backendRefund.payment_id.toString(),
            orderId: '', // Will be populated from payment
            customerId: '', // Will be populated from payment
            producerId: '', // Will be populated from order

            reason: backendRefund.reason || 'Remboursement demandé',
            amount,
            originalAmount: amount, // Will be populated from payment
            currency: PAYMENT_CURRENCIES.XAF,
            status: BACKEND_TO_FRONTEND_REFUND_STATUS[backendRefund.status] || REFUND_STATUS.REQUESTED,

            // Dates
            createdAt: new Date(backendRefund.created_at),
            updatedAt: new Date(backendRefund.created_at),
            completedAt: backendRefund.processed_at ? new Date(backendRefund.processed_at) : undefined,

            // Formatted
            formattedAmount: formatCurrencyXAF(amount),
            formattedOriginalAmount: formatCurrencyXAF(amount),
            formattedCreatedAt: formatDateString(backendRefund.created_at)
        }
    }

    static toBackendCreate(frontendDto: RefundRequestDto): any {
        return {
            payment_id: parseInt(frontendDto.paymentId),
            amount: frontendDto.amount?.toString(),
            reason: frontendDto.reason
        }
    }
}

/**
 * Adapter for PaymentStats objects
 */
export class PaymentStatsAdapter {
    static toFrontend(backendStats: BackendPaymentStats): PaymentStats {
        const totalRevenue = parseDecimalString(backendStats.total_amount)
        const completedAmount = parseDecimalString(backendStats.completed_amount)
        const pendingAmount = parseDecimalString(backendStats.pending_amount)
        const refundedAmount = parseDecimalString(backendStats.refunded_amount)

        return {
            totalRevenue,
            averageTransaction: backendStats.total_payments > 0 ? totalRevenue / backendStats.total_payments : 0,
            totalTransactions: backendStats.total_payments,
            conversionRate: 0.85, // Default value, should be calculated

            pendingPayments: Math.round(pendingAmount),
            failedPayments: backendStats.failed_count,
            successfulPayments: backendStats.total_payments - backendStats.failed_count,
            refundedPayments: Math.round(refundedAmount),

            // Default empty arrays - should be populated by service
            revenueByMethod: {} as Record<PAYMENT_METHODS, number>,
            transactionsByMethod: {} as Record<PAYMENT_METHODS, number>,
            monthlyRevenue: [],
            topCustomers: [],
            topProducts: [],

            // Formatted
            formattedTotalRevenue: formatCurrencyXAF(totalRevenue),
            formattedAverageTransaction: formatCurrencyXAF(totalRevenue / Math.max(backendStats.total_payments, 1))
        }
    }
}

// Exports are provided via individual `export class` declarations above.