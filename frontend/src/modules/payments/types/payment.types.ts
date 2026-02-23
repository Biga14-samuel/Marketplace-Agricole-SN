// modules/payments/types/payment.types.ts

// ============ ENUMS ============
export enum PAYMENT_STATUS {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    EXPIRED = 'expired',
    DISPUTED = 'disputed'
}

export enum PAYMENT_METHODS {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    MOBILE_MONEY = 'mobile_money',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    DIGITAL_WALLET = 'digital_wallet',
    CASH_ON_DELIVERY = 'cash_on_delivery',
    CRYPTO = 'crypto'
}

export enum PAYMENT_CURRENCIES {
    XAF = 'XAF',
    EUR = 'EUR',
    USD = 'USD'
}

export enum INVOICE_STATUS {
    DRAFT = 'draft',
    SENT = 'sent',
    VIEWED = 'viewed',
    PAID = 'paid',
    PARTIALLY_PAID = 'partially_paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    DISPUTED = 'disputed',
    WRITTEN_OFF = 'written_off'
}

export enum REFUND_STATUS {
    REQUESTED = 'requested',
    UNDER_REVIEW = 'under_review',
    PENDING_APPROVAL = 'pending_approval',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    PARTIALLY_REFUNDED = 'partially_refunded',
    DISPUTED = 'disputed'
}

export enum PAYOUT_STATUS {
    PENDING = 'pending',
    PROCESSING = 'processing',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PAID = 'paid',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    ON_HOLD = 'on_hold',
    PARTIALLY_PAID = 'partially_paid',
    SCHEDULED = 'scheduled',
    REVERSED = 'reversed'
}

// ============ INTERFACES DE BASE ============

/**
 * Interface pour les frais de transaction
 */
export interface TransactionFees {
    percentage: number
    fixed: number
    tax?: number
    description?: string
}

/**
 * Interface pour les adresses
 */
export interface PaymentAddress {
    street: string
    city: string
    state?: string
    postalCode: string
    country: string
    countryCode: string
}

/**
 * Interface pour les informations client
 */
export interface PaymentCustomer {
    id: string
    name: string
    email: string
    phone?: string
    address?: PaymentAddress
}

/**
 * Interface pour les informations du produit
 */
export interface PaymentItem {
    id: string
    name: string
    description?: string
    quantity: number
    unitPrice: number
    totalPrice: number
    productId: string
    producerId?: string
    category?: string
    taxRate?: number
    formattedUnitPrice?: string
    formattedTotalPrice?: string
}

// ============ PAIEMENTS ============

/**
 * Interface principale pour un paiement
 */
export interface Payment {
    id: string
    orderId: string
    transactionId?: string
    reference: string
    amount: number
    currency: PAYMENT_CURRENCIES
    status: PAYMENT_STATUS
    method: PAYMENT_METHODS

    // Détails du paiement
    customerId: string
    customerEmail?: string
    customerName?: string
    customerPhone?: string

    // Frais et taxes
    fees?: number
    taxAmount?: number
    netAmount?: number
    discountAmount?: number

    // Métadonnées
    metadata?: Record<string, any>
    description?: string
    notes?: string[]

    // Relations
    items?: PaymentItem[]
    invoiceId?: string
    refundId?: string

    // Méthode de paiement spécifique
    methodDetails?: {
        provider?: string
        cardLast4?: string
        cardBrand?: string
        mobileNumber?: string
        bankAccount?: string
        walletId?: string
    }

    // Dates
    createdAt: Date
    updatedAt: Date
    paidAt?: Date
    failedAt?: Date
    refundedAt?: Date

    // Formatés
    formattedAmount?: string
    formattedFees?: string
    formattedNetAmount?: string
    formattedCreatedAt?: string
}

/**
 * Interface pour créer un paiement
 */
export interface CreatePaymentDto {
    orderId: string
    amount: number
    currency?: PAYMENT_CURRENCIES
    method: PAYMENT_METHODS
    customerId: string
    customerEmail?: string
    customerName?: string
    customerPhone?: string
    items?: PaymentItem[]
    metadata?: Record<string, any>
    description?: string
}

/**
 * Interface pour confirmer un paiement Mobile Money
 */
export interface ConfirmMobileMoneyDto {
    phoneNumber: string
    provider: string
    pinCode?: string
    otpCode?: string
    transactionId: string
}

/**
 * Interface pour filtrer les paiements
 */
export interface PaymentFiltersDto {
    status?: PAYMENT_STATUS | 'all'
    method?: PAYMENT_METHODS | 'all'
    startDate?: Date
    endDate?: Date
    minAmount?: number
    maxAmount?: number
    search?: string
    customerId?: string
    producerId?: string
    orderId?: string
}

// ============ MÉTHODES DE PAIEMENT ============

/**
 * Interface pour une méthode de paiement
 */
export interface PaymentMethod {
    id: string
    userId: string
    type: PAYMENT_METHODS
    name: string
    description?: string
    isActive: boolean
    isDefault: boolean
    isGlobal?: boolean

    // Détails spécifiques
    details?: Record<string, any>
    metadata?: Record<string, any>

    // Frais
    fees?: TransactionFees

    // Restrictions
    countries?: string[]
    currencies?: PAYMENT_CURRENCIES[]
    minAmount?: number
    maxAmount?: number

    // Logo et présentation
    logo?: string
    color?: string
    icon?: string

    // Statut et utilisation
    lastUsedAt?: Date
    usageCount?: number
    successRate?: number

    // Dates
    createdAt: Date
    updatedAt: Date
    verifiedAt?: Date

    // Formatés
    formattedFees?: string
    formattedLastUsedAt?: string
}

/**
 * Interface pour créer une méthode de paiement
 */
export interface CreatePaymentMethodDto {
    type: PAYMENT_METHODS
    name: string
    description?: string
    details: Record<string, any>
    isDefault?: boolean
    metadata?: Record<string, any>
}

/**
 * Interface pour mettre à jour une méthode de paiement
 */
export interface UpdatePaymentMethodDto {
    name?: string
    description?: string
    isActive?: boolean
    isDefault?: boolean
    details?: Record<string, any>
    metadata?: Record<string, any>
}

/**
 * Interface pour filtrer les méthodes de paiement
 */
export interface PaymentMethodFiltersDto {
    type?: PAYMENT_METHODS | 'all'
    status?: 'active' | 'inactive' | 'all'
    country?: string
    isDefault?: boolean
    search?: string
}

// ============ FACTURES ============

/**
 * Interface pour une ligne de facture
 */
export interface InvoiceLineItem {
    id: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    productId?: string
    orderItemId?: string
    taxRate?: number
    taxAmount?: number
    formattedUnitPrice?: string
    formattedTotalPrice?: string
}

/**
 * Interface pour une facture
 */
export interface Invoice {
    id: string
    invoiceNumber: string
    orderId: string
    paymentId?: string
    customerId: string
    producerId?: string

    // Informations client
    customerName: string
    customerEmail: string
    customerPhone?: string
    customerAddress?: PaymentAddress

    // Informations facture
    issueDate: Date
    dueDate?: Date
    paidAt?: Date
    status: INVOICE_STATUS
    type: 'standard' | 'proforma' | 'recurring' | 'credit'

    // Montants
    subtotal: number
    taxAmount: number
    discountAmount?: number
    totalAmount: number
    amountPaid: number
    amountDue: number

    // Taxes et frais
    taxRate?: number
    taxDetails?: Record<string, any>
    fees?: number

    // Items
    items: InvoiceLineItem[]

    // Métadonnées
    notes?: string[]
    terms?: string
    pdfUrl?: string
    shareUrl?: string

    // Dates
    createdAt: Date
    updatedAt: Date
    sentAt?: Date
    viewedAt?: Date

    // Formatés
    formattedSubtotal?: string
    formattedTaxAmount?: string
    formattedTotalAmount?: string
    formattedAmountDue?: string
    formattedIssueDate?: string
    formattedDueDate?: string
}

/**
 * Interface pour créer une facture
 */
export interface CreateInvoiceDto {
    orderId: string
    customerId: string
    producerId?: string
    issueDate?: Date
    dueDate?: Date
    items: InvoiceLineItem[]
    notes?: string[]
    terms?: string
    taxRate?: number
    discountAmount?: number
}

/**
 * Interface pour mettre à jour une facture
 */
export interface UpdateInvoiceDto {
    status?: INVOICE_STATUS
    dueDate?: Date
    notes?: string[]
    terms?: string
    amountPaid?: number
}

/**
 * Interface pour filtrer les factures
 */
export interface InvoiceFiltersDto {
    status?: INVOICE_STATUS | 'all'
    type?: 'standard' | 'proforma' | 'recurring' | 'credit' | 'all'
    startDate?: Date
    endDate?: Date
    search?: string
    customerId?: string
    producerId?: string
    orderId?: string
}

// ============ REMBOURSEMENTS ============

/**
 * Interface pour un remboursement
 */
export interface Refund {
    id: string
    paymentId: string
    orderId: string
    customerId: string
    producerId: string

    // Informations remboursement
    reason: string
    explanation?: string
    amount: number
    originalAmount: number
    currency: PAYMENT_CURRENCIES
    status: REFUND_STATUS

    // Frais et montants
    fees?: number
    netAmount?: number
    transactionFee?: number
    processingFee?: number

    // Approuvé/Rejeté
    approvedBy?: string
    approvedAt?: Date
    rejectedBy?: string
    rejectedAt?: Date
    rejectionReason?: string

    // Complété
    completedAt?: Date
    transactionId?: string
    method?: PAYMENT_METHODS

    // Items remboursés
    items?: Array<{
        itemId: string
        quantity: number
        amount: number
        reason?: string
    }>

    // Métadonnées
    evidence?: string[]
    notes?: string[]

    // Dates
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedAmount?: string
    formattedOriginalAmount?: string
    formattedCreatedAt?: string
}

/**
 * Interface pour demander un remboursement
 */
export interface RefundRequestDto {
    paymentId: string
    reason: string
    explanation: string
    amount?: number
    items?: Array<{
        itemId: string
        quantity: number
        reason?: string
    }>
    evidence?: string[]
}

/**
 * Interface pour mettre à jour le statut d'un remboursement
 */
export interface UpdateRefundStatusDto {
    status: REFUND_STATUS
    reason?: string
    transactionId?: string
    notes?: string[]
}

/**
 * Interface pour filtrer les remboursements
 */
export interface RefundFiltersDto {
    status?: REFUND_STATUS | 'all'
    reason?: string | 'all'
    startDate?: Date
    endDate?: Date
    search?: string
    customerId?: string
    producerId?: string
    paymentId?: string
}

// ============ VERSEMENTS (PAYOUTS) ============

/**
 * Interface pour un versement (payout)
 */
export interface Payout {
    id: string
    producerId: string
    reference: string

    // Informations versement
    amount: number
    currency: PAYMENT_CURRENCIES
    status: PAYOUT_STATUS
    method: PAYOUT_METHODS

    // Frais
    fees?: number
    netAmount?: number
    taxAmount?: number

    // Détails de la méthode
    methodDetails?: Record<string, any>

    // Transactions liées
    paymentIds?: string[]
    orderIds?: string[]

    // Approuvé/Rejeté
    approvedBy?: string
    approvedAt?: Date
    rejectedBy?: string
    rejectedAt?: Date
    rejectionReason?: string

    // Payé
    paidAt?: Date
    transactionId?: string
    bankReference?: string

    // Métadonnées
    notes?: string[]
    metadata?: Record<string, any>

    // Dates
    requestedAt: Date
    processedAt?: Date
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedAmount?: string
    formattedFees?: string
    formattedNetAmount?: string
    formattedRequestedAt?: string
}

/**
 * Interface pour demander un versement
 */
export interface PayoutRequestDto {
    amount: number
    method: PAYOUT_METHODS
    methodDetails?: Record<string, any>
    notes?: string[]
}

/**
 * Interface pour mettre à jour un versement
 */
export interface UpdatePayoutDto {
    status?: PAYOUT_STATUS
    notes?: string[]
    transactionId?: string
    bankReference?: string
    rejectionReason?: string
}

/**
 * Interface pour filtrer les versements
 */
export interface PayoutFiltersDto {
    status?: PAYOUT_STATUS | 'all'
    method?: PAYOUT_METHODS | 'all'
    startDate?: Date
    endDate?: Date
    minAmount?: number
    maxAmount?: number
    search?: string
    producerId?: string
}

// ============ STATISTIQUES ============

/**
 * Interface pour les statistiques de paiement
 */
export interface PaymentStats {
    // Totaux
    totalRevenue: number
    averageTransaction: number
    totalTransactions: number
    conversionRate: number

    // Par statut
    pendingPayments: number
    failedPayments: number
    successfulPayments: number
    refundedPayments: number

    // Par méthode
    revenueByMethod: Record<PAYMENT_METHODS, number>
    transactionsByMethod: Record<PAYMENT_METHODS, number>

    // Évolution
    monthlyRevenue: Array<{
        month: string
        revenue: number
        transactions: number
    }>

    // Top
    topCustomers: Array<{
        customerId: string
        customerName: string
        totalSpent: number
        transactions: number
    }>

    topProducts: Array<{
        productId: string
        productName: string
        revenue: number
        unitsSold: number
    }>

    // Formatés
    formattedTotalRevenue?: string
    formattedAverageTransaction?: string
}

/**
 * Interface pour les statistiques de facturation
 */
export interface InvoiceStats {
    totalInvoices: number
    paidInvoices: number
    pendingInvoices: number
    overdueInvoices: number
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    overdueAmount: number
    averageInvoiceAmount: number
    formattedTotalAmount?: string
    formattedPaidAmount?: string
    formattedPendingAmount?: string
    formattedOverdueAmount?: string
}

/**
 * Interface pour les statistiques de remboursement
 */
export interface RefundStats {
    totalRefunds: number
    approvedRefunds: number
    pendingRefunds: number
    rejectedRefunds: number
    totalAmount: number
    approvedAmount: number
    pendingAmount: number
    rejectedAmount: number
    averageRefund: number
    refundRate: number
    formattedTotalAmount?: string
    formattedAverageRefund?: string
    formattedApprovedAmount?: string
    formattedPendingAmount?: string
    formattedRejectedAmount?: string
}

/**
 * Interface pour les statistiques de versement
 */
export interface PayoutStats {
    totalPayouts: number
    pendingPayouts: number
    processedPayouts: number
    failedPayouts: number
    totalAmount: number
    pendingAmount: number
    processedAmount: number
    failedAmount: number
    averagePayout: number
    formattedTotalAmount?: string
    formattedAveragePayout?: string
    formattedPendingAmount?: string
    formattedProcessedAmount?: string
    formattedFailedAmount?: string
}

// ============ SPÉCIFIQUE CAMEROUN ============

/**
 * Interface pour les fournisseurs de paiement au Cameroun
 */
export interface CameroonPaymentProvider {
    id: string
    name: string
    code: string
    logo?: string
    isActive: boolean
    fees?: TransactionFees
    countries: string[]
    requiresPhoneNumber: boolean
    transactionTypes: string[]
    minAmount?: number
    maxAmount?: number
    formattedFees?: string
}

/**
 * Interface pour les détails bancaires au Cameroun
 */
export interface CameroonBankDetails {
    id: string
    name: string
    code: string
    swiftCode?: string
    country: string
    transferLimit?: number
    dailyLimit?: number
    supportsMobileMoney?: boolean
    formattedTransferLimit?: string
    formattedDailyLimit?: string
}

// ============ RÉSUMÉS ============

/**
 * Interface pour un résumé de paiement
 */
export interface PaymentSummary {
    dateRange: {
        start: Date
        end: Date
    }
    total: {
        revenue: number
        transactions: number
        average: number
    }
    byStatus: Record<PAYMENT_STATUS, number>
    byMethod: Record<PAYMENT_METHODS, number>
    trends: {
        daily: Array<{ date: string; revenue: number; transactions: number }>
        weekly: Array<{ week: string; revenue: number; transactions: number }>
        monthly: Array<{ month: string; revenue: number; transactions: number }>
    }
}

/**
 * Interface pour un résumé de facture
 */
export interface InvoiceSummary {
    total: number
    paid: number
    pending: number
    overdue: number
    upcoming: number
    byStatus: Record<INVOICE_STATUS, number>
    aging: {
        current: number
        '1-30': number
        '31-60': number
        '61-90': number
        '90+': number
    }
}

// ============ TYPES D'EXPORT ============

/**
 * Interface pour l'export des paiements
 */
export interface PaymentExportData {
    format: 'csv' | 'excel' | 'pdf'
    filters?: PaymentFiltersDto
    columns?: string[]
    includeItems?: boolean
}

/**
 * Interface pour l'export des factures
 */
export interface InvoiceExportData {
    format: 'csv' | 'excel' | 'pdf'
    filters?: InvoiceFiltersDto
    columns?: string[]
    includeLineItems?: boolean
}

// ============ TYPES DE RÉPONSE ============

/**
 * Interface pour une réponse paginée
 */
export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        total: number
        page: number
        limit: number
        pages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

/**
 * Interface pour une réponse de paiement
 */
export interface PaymentResponse {
    success: boolean
    data?: Payment
    error?: string
    message?: string
    transactionId?: string
    redirectUrl?: string
    qrCode?: string
}

/**
 * Interface pour une réponse Mobile Money
 */
export interface MobileMoneyResponse {
    success: boolean
    transactionId: string
    provider: string
    status: string
    message: string
    ussdCode?: string
    expiryTime?: Date
}

// ============ TYPES DE GESTION D'ERREUR ============

/**
 * Interface pour une erreur de paiement
 */
export interface PaymentError {
    code: string
    message: string
    details?: any
    retryable: boolean
    suggestedAction?: string
}

/**
 * Interface pour une erreur de validation
 */
export interface ValidationError {
    field: string
    message: string
    code: string
}

// ============ TYPES POUR LES WEBHOOKS ============

/**
 * Interface pour un événement de paiement
 */
export interface PaymentEvent {
    type: 'payment.created' | 'payment.completed' | 'payment.failed' | 'payment.refunded'
    data: Payment
    timestamp: Date
    signature?: string
}

/**
 * Interface pour un webhook
 */
export interface WebhookPayload {
    event: PaymentEvent
    webhookId: string
    attempts: number
}

// ============ TYPES UTILITAIRES ============

/**
 * Type pour les méthodes de versement
 */
export type PAYOUT_METHODS =
    | 'bank_transfer'
    | 'mobile_money'
    | 'digital_wallet'
    | 'check'
    | 'cash'

/**
 * Type pour les statuts de paiement
 */
export type PaymentStatus = PAYMENT_STATUS

/**
 * Type pour les méthodes de paiement
 */
export type PaymentMethodType = PAYMENT_METHODS

/**
 * Type pour les filtres de paiement
 */
export type PaymentFilters = PaymentFiltersDto

/**
 * Type pour les statistiques détaillées
 */
export interface DetailedStats {
    period: 'day' | 'week' | 'month' | 'year'
    data: Array<{
        date: string
        revenue: number
        transactions: number
        average: number
        refunds: number
        fees: number
    }>
}

// ============ EXPORT DES TYPES ============

export type {
    // Paiements
    Payment as IPayment,
    CreatePaymentDto as ICreatePaymentDto,
    ConfirmMobileMoneyDto as IConfirmMobileMoneyDto,
    PaymentFiltersDto as IPaymentFiltersDto,

    // Méthodes de paiement
    PaymentMethod as IPaymentMethod,
    CreatePaymentMethodDto as ICreatePaymentMethodDto,
    UpdatePaymentMethodDto as IUpdatePaymentMethodDto,
    PaymentMethodFiltersDto as IPaymentMethodFiltersDto,

    // Factures
    Invoice as IInvoice,
    CreateInvoiceDto as ICreateInvoiceDto,
    UpdateInvoiceDto as IUpdateInvoiceDto,
    InvoiceFiltersDto as IInvoiceFiltersDto,
    InvoiceLineItem as IInvoiceLineItem,

    // Remboursements
    Refund as IRefund,
    RefundRequestDto as IRefundRequestDto,
    UpdateRefundStatusDto as IUpdateRefundStatusDto,
    RefundFiltersDto as IRefundFiltersDto,

    // Versements
    Payout as IPayout,
    PayoutRequestDto as IPayoutRequestDto,
    UpdatePayoutDto as IUpdatePayoutDto,
    PayoutFiltersDto as IPayoutFiltersDto,

    // Statistiques
    PaymentStats as IPaymentStats,
    InvoiceStats as IInvoiceStats,
    RefundStats as IRefundStats,
    PayoutStats as IPayoutStats,

    // Cameroun
    CameroonPaymentProvider as ICameroonPaymentProvider,
    CameroonBankDetails as ICameroonBankDetails,

    // Utilitaires
    PaymentSummary as IPaymentSummary,
    InvoiceSummary as IInvoiceSummary,
    PaymentExportData as IPaymentExportData,
    InvoiceExportData as IInvoiceExportData,
    PaginatedResponse as IPaginatedResponse,
    PaymentResponse as IPaymentResponse,
    MobileMoneyResponse as IMobileMoneyResponse,
    PaymentError as IPaymentError,
    ValidationError as IValidationError,
    PaymentEvent as IPaymentEvent,
    WebhookPayload as IWebhookPayload,
    DetailedStats as IDetailedStats
}