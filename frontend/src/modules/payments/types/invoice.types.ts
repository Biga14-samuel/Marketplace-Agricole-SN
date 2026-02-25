// @ts-nocheck
// frontend/src/modules/payments/types/invoice.types.ts

// ============ ENUMS ============
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

export enum INVOICE_TYPES {
    STANDARD = 'standard',
    PROFORMA = 'proforma',
    RECURRING = 'recurring',
    CREDIT = 'credit',
    DEBIT = 'debit',
    ESTIMATE = 'estimate',
    COMMERCIAL = 'commercial',
    CUSTOMS = 'customs'
}

export enum INVOICE_FREQUENCY {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    BIWEEKLY = 'biweekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    SEMI_ANNUAL = 'semi_annual',
    ANNUAL = 'annual',
    CUSTOM = 'custom'
}

export enum TAX_TYPES {
    VAT = 'vat',          // TVA (Valeur Ajoutée)
    SALES_TAX = 'sales_tax', // Taxe sur les ventes
    GST = 'gst',          // Taxe sur les produits et services
    WITHHOLDING = 'withholding', // Retenue à la source
    EXEMPT = 'exempt'     // Exonéré
}

export enum PAYMENT_TERMS {
    IMMEDIATE = 'immediate',
    NET_7 = 'net_7',
    NET_15 = 'net_15',
    NET_30 = 'net_30',
    NET_45 = 'net_45',
    NET_60 = 'net_60',
    NET_90 = 'net_90',
    END_OF_MONTH = 'end_of_month',
    UPON_RECEIPT = 'upon_receipt'
}

// ============ INTERFACES DE BASE ============

/**
 * Interface pour les adresses de facturation
 */
export interface InvoiceAddress {
    street: string
    city: string
    state?: string
    postalCode: string
    country: string
    countryCode: string
    phone?: string
    email?: string
    company?: string
    taxId?: string // Numéro d'identification fiscale
}

/**
 * Interface pour les contacts de facturation
 */
export interface InvoiceContact {
    name: string
    email: string
    phone?: string
    role?: string
    department?: string
}

/**
 * Interface pour les informations fiscales
 */
export interface TaxInfo {
    type: TAX_TYPES
    rate: number
    code?: string
    name: string
    country: string
    isInclusive: boolean // Taxe incluse dans le prix
    registrationNumber?: string
}

/**
 * Interface pour les conditions de paiement
 */
export interface PaymentTerms {
    type: PAYMENT_TERMS
    days: number
    description: string
    lateFeePercentage?: number
    lateFeeFixed?: number
    discountPercentage?: number
    discountDays?: number
}

// ============ LIGNES DE FACTURE ============

/**
 * Interface pour une ligne de facture
 */
export interface InvoiceLineItem {
    id: string
    invoiceId: string
    lineNumber: number

    // Informations produit
    productId?: string
    productName: string
    productDescription?: string
    productCode?: string
    productSku?: string
    productCategory?: string

    // Quantité et prix
    quantity: number
    unitPrice: number
    unitOfMeasure?: string // Unité de mesure (kg, litre, pièce, etc.)

    // Taxes
    taxRate?: number
    taxType?: TAX_TYPES
    taxAmount?: number

    // Remises
    discountPercentage?: number
    discountAmount?: number

    // Totaux
    subtotal: number
    total: number

    // Producteur
    producerId?: string
    producerName?: string

    // Métadonnées
    metadata?: Record<string, any>
    notes?: string

    // Dates
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedUnitPrice?: string
    formattedSubtotal?: string
    formattedTotal?: string
    formattedTaxAmount?: string
}

/**
 * Interface pour créer une ligne de facture
 */
export interface CreateInvoiceLineItemDto {
    productId?: string
    productName: string
    productDescription?: string
    productCode?: string
    quantity: number
    unitPrice: number
    unitOfMeasure?: string
    taxRate?: number
    taxType?: TAX_TYPES
    discountPercentage?: number
    discountAmount?: number
    producerId?: string
    metadata?: Record<string, any>
    notes?: string
}

// ============ FACTURES ============

/**
 * Interface principale pour une facture
 */
export interface Invoice {
    id: string
    invoiceNumber: string
    referenceNumber?: string
    orderId: string
    paymentId?: string

    // Type et statut
    type: INVOICE_TYPES
    status: INVOICE_STATUS

    // Parties
    sellerId: string
    sellerName: string
    sellerAddress: InvoiceAddress
    sellerContact?: InvoiceContact
    sellerLogo?: string
    sellerTaxInfo?: TaxInfo

    buyerId: string
    buyerName: string
    buyerAddress: InvoiceAddress
    buyerContact?: InvoiceContact
    buyerTaxInfo?: TaxInfo

    // Producteur (si différent du vendeur)
    producerId?: string
    producerName?: string
    producerAddress?: InvoiceAddress

    // Dates
    issueDate: Date
    dueDate?: Date
    deliveryDate?: Date
    paidDate?: Date
    cancellationDate?: Date
    viewedAt?: Date

    // Conditions de paiement
    paymentTerms: PaymentTerms
    currency: string
    language?: string
    locale?: string

    // Montants
    subtotal: number
    taxAmount: number
    discountAmount?: number
    shippingAmount?: number
    handlingAmount?: number
    otherAmount?: number
    totalAmount: number
    amountPaid: number
    amountDue: number

    // Taxes
    taxInfo?: TaxInfo[]
    isTaxInclusive: boolean

    // Lignes
    items: InvoiceLineItem[]

    // Remises globales
    globalDiscount?: {
        percentage?: number
        amount?: number
        reason?: string
    }

    // Frais supplémentaires
    fees?: Array<{
        name: string
        amount: number
        description?: string
        taxRate?: number
    }>

    // Informations de livraison
    shippingInfo?: {
        method: string
        trackingNumber?: string
        carrier?: string
        estimatedDelivery?: Date
        actualDelivery?: Date
    }

    // Notes et conditions
    notes?: string[]
    terms?: string
    footerNotes?: string
    internalNotes?: string

    // Documents associés
    pdfUrl?: string
    pdfGeneratedAt?: Date
    shareUrl?: string
    shareToken?: string
    shareExpiresAt?: Date

    // Références
    previousInvoiceId?: string
    creditNoteId?: string
    recurringInvoiceId?: string

    // Métadonnées
    metadata?: Record<string, any>
    tags?: string[]

    // Dates système
    createdAt: Date
    updatedAt: Date
    sentAt?: Date
    remindedAt?: Date
    archivedAt?: Date

    // Formatés
    formattedSubtotal?: string
    formattedTaxAmount?: string
    formattedTotalAmount?: string
    formattedAmountDue?: string
    formattedAmountPaid?: string
    formattedIssueDate?: string
    formattedDueDate?: string
    formattedCreatedAt?: string
    formattedDeliveryDate?: string

    // Statistiques
    daysOverdue?: number
    isOverdue?: boolean
    paymentStatus?: 'pending' | 'partial' | 'paid' | 'overdue'
}

// ============ FACTURES RÉCURRENTES ============

/**
 * Interface pour une facture récurrente
 */
export interface RecurringInvoice {
    id: string
    name: string
    description?: string

    // Configuration de récurrence
    frequency: INVOICE_FREQUENCY
    interval: number // Ex: 1 pour tous les mois, 2 pour tous les 2 mois
    startDate: Date
    endDate?: Date
    nextInvoiceDate: Date
    lastInvoiceDate?: Date

    // Paramètres de facture
    invoiceTemplate: Partial<Invoice>
    autoSend: boolean
    autoRemind: boolean
    reminderDaysBefore?: number

    // Statistiques
    totalInvoices: number
    successfulInvoices: number
    failedInvoices: number
    totalAmount: number

    // Statut
    isActive: boolean
    isPaused: boolean
    pauseReason?: string
    pauseUntil?: Date

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date
    lastRunAt?: Date

    // Formatés
    formattedTotalAmount?: string
    formattedNextInvoiceDate?: string
}

/**
 * Interface pour créer une facture récurrente
 */
export interface CreateRecurringInvoiceDto {
    name: string
    description?: string
    frequency: INVOICE_FREQUENCY
    interval?: number
    startDate: Date
    endDate?: Date
    invoiceTemplate: Partial<Invoice>
    autoSend?: boolean
    autoRemind?: boolean
    reminderDaysBefore?: number
    metadata?: Record<string, any>
}

// ============ NOTES DE CRÉDIT ============

/**
 * Interface pour une note de crédit
 */
export interface CreditNote {
    id: string
    creditNoteNumber: string
    invoiceId: string
    originalInvoiceNumber: string

    // Raison
    reason: string
    explanation?: string

    // Montants
    originalAmount: number
    creditAmount: number
    balanceApplied: number
    remainingBalance: number

    // Statut
    status: 'draft' | 'issued' | 'applied' | 'cancelled'

    // Dates
    issueDate: Date
    appliedDate?: Date
    expiryDate?: Date

    // Métadonnées
    metadata?: Record<string, any>

    // Dates système
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedOriginalAmount?: string
    formattedCreditAmount?: string
    formattedRemainingBalance?: string
}

// ============ MODÈLES DE FACTURE ============

/**
 * Interface pour un modèle de facture
 */
export interface InvoiceTemplate {
    id: string
    name: string
    description?: string

    // Design
    header?: {
        logo?: string
        title?: string
        subtitle?: string
    }

    colors?: {
        primary: string
        secondary: string
        accent: string
        background: string
        text: string
    }

    layout?: {
        showLogo: boolean
        showTaxDetails: boolean
        showPaymentInstructions: boolean
        showBankDetails: boolean
        showQRCode: boolean
    }

    // Contenu
    paymentInstructions?: string
    bankDetails?: {
        bankName: string
        accountName: string
        accountNumber: string
        iban?: string
        swiftCode?: string
    }

    // Métadonnées
    isDefault: boolean
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date
}

// ============ DTOs ============

/**
 * Interface pour créer une facture
 */
export interface CreateInvoiceDto {
    // Informations de base
    type?: INVOICE_TYPES
    orderId: string

    // Parties
    sellerId: string
    sellerName: string
    sellerAddress: InvoiceAddress
    sellerContact?: InvoiceContact

    buyerId: string
    buyerName: string
    buyerAddress: InvoiceAddress
    buyerContact?: InvoiceContact

    // Dates
    issueDate?: Date
    dueDate?: Date
    deliveryDate?: Date

    // Conditions
    paymentTerms?: PaymentTerms
    currency?: string
    language?: string

    // Lignes
    items: CreateInvoiceLineItemDto[]

    // Taxes
    taxInfo?: TaxInfo[]
    isTaxInclusive?: boolean

    // Remises
    globalDiscount?: {
        percentage?: number
        amount?: number
        reason?: string
    }

    // Frais
    shippingAmount?: number
    handlingAmount?: number
    otherAmount?: number

    // Notes
    notes?: string[]
    terms?: string

    // Métadonnées
    metadata?: Record<string, any>
    tags?: string[]
}

/**
 * Interface pour mettre à jour une facture
 */
export interface UpdateInvoiceDto {
    // Statut
    status?: INVOICE_STATUS

    // Informations
    buyerContact?: InvoiceContact
    sellerContact?: InvoiceContact

    // Dates
    dueDate?: Date
    deliveryDate?: Date

    // Montants
    amountPaid?: number

    // Notes
    notes?: string[]
    terms?: string
    internalNotes?: string

    // Métadonnées
    metadata?: Record<string, any>
    tags?: string[]
}

/**
 * Interface pour envoyer une facture
 */
export interface SendInvoiceDto {
    email: string
    cc?: string[]
    bcc?: string[]
    subject?: string
    message?: string
    sendCopyToSeller?: boolean
    deliveryMethod?: 'email' | 'sms' | 'both'
}

/**
 * Interface pour partager une facture
 */
export interface ShareInvoiceDto {
    expirationDays?: number
    password?: string
    canDownload?: boolean
    canPrint?: boolean
    notifyOnView?: boolean
    allowedEmails?: string[]
}

// ============ FILTRES ============

/**
 * Interface pour filtrer les factures
 */
export interface InvoiceFiltersDto {
    // Filtres de base
    status?: INVOICE_STATUS | 'all'
    type?: INVOICE_TYPES | 'all'

    // Dates
    startDate?: Date
    endDate?: Date
    dueDateStart?: Date
    dueDateEnd?: Date

    // Montants
    minAmount?: number
    maxAmount?: number

    // Recherche
    search?: string
    invoiceNumber?: string
    referenceNumber?: string

    // Parties
    sellerId?: string
    buyerId?: string
    producerId?: string

    // Commandes et paiements
    orderId?: string
    paymentId?: string

    // Tags
    tags?: string[]

    // Pagination
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

/**
 * Interface pour filtrer les factures récurrentes
 */
export interface RecurringInvoiceFiltersDto {
    isActive?: boolean
    frequency?: INVOICE_FREQUENCY
    startDate?: Date
    endDate?: Date
    search?: string
    page?: number
    limit?: number
}

// ============ STATISTIQUES ============

/**
 * Interface pour les statistiques de facturation
 */
export interface InvoiceStats {
    // Totaux
    totalInvoices: number
    totalAmount: number
    averageInvoiceAmount: number

    // Par statut
    draftInvoices: number
    sentInvoices: number
    viewedInvoices: number
    paidInvoices: number
    partiallyPaidInvoices: number
    overdueInvoices: number
    cancelledInvoices: number

    // Montants par statut
    draftAmount: number
    sentAmount: number
    viewedAmount: number
    paidAmount: number
    partiallyPaidAmount: number
    overdueAmount: number
    cancelledAmount: number

    // Évolution
    monthlyTrend: Array<{
        month: string
        invoices: number
        amount: number
        paid: number
        overdue: number
    }>

    // Top clients
    topBuyers: Array<{
        buyerId: string
        buyerName: string
        invoices: number
        amount: number
        paid: number
        overdue: number
    }>

    // Top producteurs
    topProducers: Array<{
        producerId: string
        producerName: string
        invoices: number
        amount: number
    }>

    // Vieillissement des créances
    agingReport: {
        current: number
        '1-30': number
        '31-60': number
        '61-90': number
        '90+': number
    }

    // Formatés
    formattedTotalAmount?: string
    formattedAverageInvoiceAmount?: string
    formattedPaidAmount?: string
    formattedOverdueAmount?: string
    formattedDraftAmount?: string
}

/**
 * Interface pour un résumé de facturation
 */
export interface InvoiceSummary {
    // En attente
    pending: {
        count: number
        amount: number
    }

    // En retard
    overdue: {
        count: number
        amount: number
        oldest: Date | null
    }

    // Payées ce mois
    paidThisMonth: {
        count: number
        amount: number
    }

    // À venir
    upcoming: {
        count: number
        amount: number
        nextDueDate: Date | null
    }

    // Formatés
    formattedPendingAmount?: string
    formattedOverdueAmount?: string
    formattedPaidThisMonthAmount?: string
    formattedUpcomingAmount?: string
}

// ============ RAPPORTS ============

/**
 * Interface pour un rapport de facturation
 */
export interface BillingReport {
    period: {
        start: Date
        end: Date
    }

    // Résumé
    summary: {
        totalInvoices: number
        totalAmount: number
        totalPaid: number
        totalOutstanding: number
        averageDaysToPay: number
    }

    // Détails
    details: {
        byStatus: Record<INVOICE_STATUS, { count: number; amount: number }>
        byType: Record<INVOICE_TYPES, { count: number; amount: number }>
        byBuyer: Record<string, { name: string; count: number; amount: number }>
        byProducer: Record<string, { name: string; count: number; amount: number }>
    }

    // Évolution
    trends: {
        daily: Array<{ date: string; invoices: number; amount: number; paid: number }>
        weekly: Array<{ week: string; invoices: number; amount: number; paid: number }>
        monthly: Array<{ month: string; invoices: number; amount: number; paid: number }>
    }

    // Formatés
    formattedTotalAmount?: string
    formattedTotalPaid?: string
    formattedTotalOutstanding?: string
}

// ============ EXPORT ============

/**
 * Interface pour l'export des factures
 */
export interface InvoiceExportOptions {
    format: 'csv' | 'excel' | 'pdf' | 'json'
    filters?: InvoiceFiltersDto
    columns?: string[]
    includeLineItems?: boolean
    includeAttachments?: boolean
    language?: string
    currency?: string
}

// ============ NOTIFICATIONS ============

/**
 * Interface pour une notification de facture
 */
export interface InvoiceNotification {
    type: 'invoice_sent' | 'invoice_viewed' | 'invoice_paid' | 'invoice_overdue' | 'invoice_reminder'
    invoiceId: string
    invoiceNumber: string
    recipient: string
    data: any
    sentAt: Date
    readAt?: Date
}

// ============ TYPES D'EXPORT ============

/**
 * Type pour les méthodes de paiement de facture
 */
export type InvoicePaymentMethod =
    | 'bank_transfer'
    | 'credit_card'
    | 'mobile_money'
    | 'cash'
    | 'check'
    | 'digital_wallet'
    | 'other'

/**
 * Type pour les statuts de paiement
 */
export type InvoicePaymentStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'refunded'
    | 'partially_refunded'

/**
 * Type pour les devises
 */
export type InvoiceCurrency =
    | 'XAF'

// ============ TYPES UTILITAIRES ============

/**
 * Interface pour la réconciliation
 */
export interface InvoiceReconciliation {
    invoiceId: string
    invoiceNumber: string
    amount: number
    paidAmount: number
    difference: number
    status: 'matched' | 'unmatched' | 'partial'
    matchedTransactions: Array<{
        transactionId: string
        amount: number
        date: Date
        method: string
    }>
    unmatchedAmount: number
}

/**
 * Interface pour les paiements de facture
 */
export interface InvoicePayment {
    id: string
    invoiceId: string
    amount: number
    currency: string
    method: InvoicePaymentMethod
    status: InvoicePaymentStatus
    transactionId?: string
    paymentDate: Date
    notes?: string
    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
    formattedAmount?: string
}

// ============ EXPORT DES TYPES ============

export type {
    // Factures
    Invoice as IInvoice,
    CreateInvoiceDto as ICreateInvoiceDto,
    UpdateInvoiceDto as IUpdateInvoiceDto,
    SendInvoiceDto as ISendInvoiceDto,
    ShareInvoiceDto as IShareInvoiceDto,
    InvoiceFiltersDto as IInvoiceFiltersDto,

    // Lignes de facture
    InvoiceLineItem as IInvoiceLineItem,
    CreateInvoiceLineItemDto as ICreateInvoiceLineItemDto,

    // Factures récurrentes
    RecurringInvoice as IRecurringInvoice,
    CreateRecurringInvoiceDto as ICreateRecurringInvoiceDto,
    RecurringInvoiceFiltersDto as IRecurringInvoiceFiltersDto,

    // Notes de crédit
    CreditNote as ICreditNote,

    // Modèles
    InvoiceTemplate as IInvoiceTemplate,

    // Statistiques
    InvoiceStats as IInvoiceStats,
    InvoiceSummary as IInvoiceSummary,
    BillingReport as IBillingReport,

    // Export
    InvoiceExportOptions as IInvoiceExportOptions,

    // Notifications
    InvoiceNotification as IInvoiceNotification,

    // Paiements
    InvoicePayment as IInvoicePayment,

    // Réconciliation
    InvoiceReconciliation as IInvoiceReconciliation,

    // Adresses et contacts
    InvoiceAddress as IInvoiceAddress,
    InvoiceContact as IInvoiceContact,
    TaxInfo as ITaxInfo,
    PaymentTerms as IPaymentTerms
}
