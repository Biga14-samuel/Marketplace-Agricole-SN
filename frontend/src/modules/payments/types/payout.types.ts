// @ts-nocheck
// frontend/src/modules/payments/types/payout.types.ts

// ============ ENUMS ============
export enum PAYOUT_STATUS {
    PENDING = 'pending',              // En attente de traitement
    PROCESSING = 'processing',        // En cours de traitement
    APPROVED = 'approved',            // Approuvé
    REJECTED = 'rejected',            // Rejeté
    PAID = 'paid',                    // Payé
    FAILED = 'failed',                // Échec du paiement
    CANCELLED = 'cancelled',          // Annulé
    ON_HOLD = 'on_hold',             // En attente (pour vérification)
    PARTIALLY_PAID = 'partially_paid', // Partiellement payé
    SCHEDULED = 'scheduled',         // Programmée
    REVERSED = 'reversed'            // Remboursé
}

export enum PAYOUT_METHODS {
    BANK_TRANSFER = 'bank_transfer',      // Virement bancaire
    MOBILE_MONEY = 'mobile_money',        // Mobile Money
    DIGITAL_WALLET = 'digital_wallet',    // Portefeuille numérique
    CASH = 'cash',                       // Espèces
    CHECK = 'check',                     // Chèque
    CARD = 'card',                       // Carte
    OTHER = 'other'                      // Autre
}

export enum PAYOUT_SCHEDULES {
    DAILY = 'daily',                    // Quotidien
    WEEKLY = 'weekly',                  // Hebdomadaire
    BIWEEKLY = 'biweekly',              // Bimensuel
    MONTHLY = 'monthly',                // Mensuel
    QUARTERLY = 'quarterly',            // Trimestriel
    SEMI_ANNUAL = 'semi_annual',        // Semestriel
    ANNUAL = 'annual',                  // Annuel
    MANUAL = 'manual',                  // Manuel
    ON_DEMAND = 'on_demand'             // Sur demande
}

export enum PAYOUT_PRIORITY {
    LOW = 'low',                        // Faible
    MEDIUM = 'medium',                  // Moyenne
    HIGH = 'high',                      // Haute
    URGENT = 'urgent'                   // Urgente
}

export enum PAYOUT_CURRENCY {
    XAF = 'XAF'                         // Franc CFA
}

export enum PAYOUT_TYPE {
    REVENUE_SHARE = 'revenue_share',    // Partage de revenus
    COMMISSION = 'commission',          // Commission
    ROYALTY = 'royalty',                // Redevance
    BONUS = 'bonus',                    // Prime
    REFUND = 'refund',                  // Remboursement
    ADVANCE = 'advance',                // Avance
    SETTLEMENT = 'settlement',          // Règlement
    OTHER = 'other'                     // Autre
}

// ============ INTERFACES DE BASE ============

/**
 * Interface pour les frais de versement
 */
export interface PayoutFees {
    platformFee: number                 // Frais de plateforme
    processingFee: number              // Frais de traitement
    taxAmount?: number                 // Montant des taxes
    totalFees: number                  // Total des frais
    breakdown: {
        platform: {
            amount: number
            percentage: number
            description?: string
        }
        processing: {
            amount: number
            percentage: number
            description?: string
        }
        tax?: {
            amount: number
            rate: number
            description?: string
        }
    }
    formattedPlatformFee?: string
    formattedProcessingFee?: string
    formattedTaxAmount?: string
    formattedTotalFees?: string
}

/**
 * Interface pour les limites de versement
 */
export interface PayoutLimits {
    daily: {
        count: number
        amount: number
        remaining: number
    }
    weekly: {
        count: number
        amount: number
        remaining: number
    }
    monthly: {
        count: number
        amount: number
        remaining: number
    }
    perTransaction: {
        min: number
        max: number
    }
    formattedDailyAmount?: string
    formattedWeeklyAmount?: string
    formattedMonthlyAmount?: string
    formattedPerTransactionMin?: string
    formattedPerTransactionMax?: string
}

/**
 * Interface pour les informations bancaires
 */
export interface BankDetails {
    bankName: string
    accountName: string
    accountNumber: string
    accountType?: 'checking' | 'savings' | 'business'
    iban?: string
    swiftCode?: string
    bankCode?: string
    branchCode?: string
    branchName?: string
    country: string
    currency: string
    isVerified: boolean
    verifiedAt?: Date
    formattedAccountNumber?: string
}

/**
 * Interface pour les détails Mobile Money
 */
export interface MobileMoneyDetails {
    provider: string                   // MTN, Orange, Express Union
    phoneNumber: string
    accountName?: string
    accountNumber?: string
    country: string
    currency: string
    isVerified: boolean
    verifiedAt?: Date
    formattedPhoneNumber?: string
}

// ============ VERSEMENTS ============

/**
 * Interface principale pour un versement
 */
export interface Payout {
    id: string
    payoutNumber: string               // Numéro unique de versement
    reference?: string                // Référence externe

    // Producteur
    producerId: string
    producerName: string
    producerEmail: string
    producerPhone?: string

    // Informations de base
    status: PAYOUT_STATUS
    type: PAYOUT_TYPE
    priority: PAYOUT_PRIORITY

    // Montants
    amount: number
    currency: PAYOUT_CURRENCY
    fees?: PayoutFees
    netAmount: number
    taxAmount?: number

    // Méthode de versement
    method: PAYOUT_METHODS
    methodDetails: BankDetails | MobileMoneyDetails | Record<string, any>

    // Transactions liées
    paymentIds: string[]               // IDs des paiements source
    orderIds: string[]                 // IDs des commandes source
    invoiceIds?: string[]              // IDs des factures

    // Détails du calcul
    calculationBreakdown: {
        totalSales: number
        commissionRate: number
        commissionAmount: number
        adjustments: Array<{
            type: 'discount' | 'fee' | 'tax' | 'other'
            amount: number
            description: string
        }>
        deductions: Array<{
            type: 'advance' | 'chargeback' | 'fee' | 'other'
            amount: number
            description: string
        }>
    }

    // Dates importantes
    requestedAt: Date
    processedAt?: Date
    paidAt?: Date
    scheduledAt?: Date
    estimatedArrival?: Date
    cancelledAt?: Date
    failedAt?: Date

    // Workflow
    requestedBy: string
    approvedBy?: string
    approvedAt?: Date
    rejectedBy?: string
    rejectedAt?: Date
    rejectionReason?: string
    processedBy?: string
    paidBy?: string

    // Transaction financière
    transactionId?: string
    bankReference?: string
    mobileTransactionId?: string

    // Métadonnées
    metadata?: Record<string, any>
    tags?: string[]
    notes?: string[]

    // Dates système
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedAmount?: string
    formattedNetAmount?: string
    formattedRequestedAt?: string
    formattedProcessedAt?: string
    formattedPaidAt?: string

    // Calculés
    daysSinceRequest?: number
    isOverdue?: boolean
    canBeCancelled?: boolean
    canBeExpedited?: boolean
}

// ============ PROGRAMMATION ============

/**
 * Interface pour la programmation des versements
 */
export interface PayoutSchedule {
    id: string
    producerId: string

    // Configuration
    frequency: PAYOUT_SCHEDULES
    dayOfWeek?: number                // 0 = Dimanche, 6 = Samedi
    dayOfMonth?: number               // 1-31
    timeOfDay?: string                // HH:MM format 24h

    // Paramètres
    autoPayout: boolean
    minAmount: number
    maxAmount?: number
    currency: PAYOUT_CURRENCY

    // Méthode par défaut
    defaultMethod: PAYOUT_METHODS
    methodDetails?: BankDetails | MobileMoneyDetails

    // Statut
    isActive: boolean
    isPaused: boolean
    pauseReason?: string
    pauseUntil?: Date

    // Dates importantes
    nextPayoutDate: Date
    lastPayoutDate?: Date
    lastPayoutAmount?: number

    // Historique
    totalPayouts: number
    totalAmount: number
    averagePayout: number

    // Métadonnées
    metadata?: Record<string, any>

    // Dates système
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedMinAmount?: string
    formattedMaxAmount?: string
    formattedTotalAmount?: string
    formattedAveragePayout?: string
    formattedNextPayoutDate?: string
    formattedLastPayoutDate?: string
}

/**
 * Interface pour mettre à jour la programmation
 */
export interface UpdatePayoutScheduleDto {
    frequency?: PAYOUT_SCHEDULES
    dayOfWeek?: number
    dayOfMonth?: number
    timeOfDay?: string
    autoPayout?: boolean
    minAmount?: number
    maxAmount?: number
    defaultMethod?: PAYOUT_METHODS
    methodDetails?: Record<string, any>
    isActive?: boolean
    metadata?: Record<string, any>
}

// ============ DEMANDES DE VERSEMENT ============

/**
 * Interface pour une demande de versement
 */
export interface PayoutRequest {
    id: string
    producerId: string
    producerName: string

    // Informations de base
    status: 'pending' | 'approved' | 'rejected' | 'cancelled'
    type: PAYOUT_TYPE

    // Montants
    requestedAmount: number
    currency: PAYOUT_CURRENCY
    approvedAmount?: number

    // Méthode
    method: PAYOUT_METHODS
    methodDetails: Record<string, any>

    // Justification
    reason?: string
    explanation?: string

    // Approbation
    approvedBy?: string
    approvedAt?: Date
    rejectedBy?: string
    rejectedAt?: Date
    rejectionReason?: string

    // Résultat
    payoutId?: string

    // Métadonnées
    metadata?: Record<string, any>
    notes?: string[]

    // Dates
    requestedAt: Date
    updatedAt: Date
    processedAt?: Date

    // Formatés
    formattedRequestedAmount?: string
    formattedApprovedAmount?: string
    formattedRequestedAt?: string
}

/**
 * Interface pour créer une demande de versement
 */
export interface CreatePayoutRequestDto {
    amount: number
    currency?: PAYOUT_CURRENCY
    method: PAYOUT_METHODS
    methodDetails: Record<string, any>
    reason?: string
    explanation?: string
    metadata?: Record<string, any>
}

// ============ MÉTHODES DE VERSEMENT ============

/**
 * Interface pour une méthode de versement
 */
export interface PayoutMethod {
    id: string
    name: string
    code: PAYOUT_METHODS
    description?: string

    // Configuration
    isActive: boolean
    isDefault: boolean
    requiresVerification: boolean

    // Frais
    fees: {
        percentage: number
        fixed: number
        minFee?: number
        maxFee?: number
        currency: string
    }

    // Limites
    limits: {
        minAmount: number
        maxAmount: number
        dailyLimit?: number
        monthlyLimit?: number
    }

    // Délais
    processingTime: string            // "instantané", "2-3 jours", etc.
    estimatedArrival: string         // Délai d'arrivée estimé

    // Restrictions
    availableCountries: string[]
    availableCurrencies: string[]

    // Présentation
    logo?: string
    icon?: string
    color?: string

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedFees?: string
    formattedMinAmount?: string
    formattedMaxAmount?: string
    formattedDailyLimit?: string
    formattedMonthlyLimit?: string
}

// ============ DTOs ============

/**
 * Interface pour créer un versement
 */
export interface CreatePayoutDto {
    producerId: string
    amount: number
    currency?: PAYOUT_CURRENCY
    method: PAYOUT_METHODS
    methodDetails: Record<string, any>
    type?: PAYOUT_TYPE
    paymentIds?: string[]
    orderIds?: string[]
    notes?: string[]
    metadata?: Record<string, any>
    scheduledAt?: Date
}

/**
 * Interface pour mettre à jour un versement
 */
export interface UpdatePayoutDto {
    status?: PAYOUT_STATUS
    notes?: string[]
    metadata?: Record<string, any>
    transactionId?: string
    bankReference?: string
    rejectionReason?: string
}

/**
 * Interface pour traiter un versement
 */
export interface ProcessPayoutDto {
    transactionId: string
    bankReference?: string
    mobileTransactionId?: string
    notes?: string
    fees?: PayoutFees
}

// ============ FILTRES ============

/**
 * Interface pour filtrer les versements
 */
export interface PayoutFiltersDto {
    // Filtres de base
    status?: PAYOUT_STATUS | 'all'
    method?: PAYOUT_METHODS | 'all'
    type?: PAYOUT_TYPE | 'all'
    priority?: PAYOUT_PRIORITY | 'all'

    // Dates
    startDate?: Date
    endDate?: Date
    requestedAfter?: Date
    requestedBefore?: Date
    paidAfter?: Date
    paidBefore?: Date

    // Montants
    minAmount?: number
    maxAmount?: number
    amountRange?: {
        min: number
        max: number
    }

    // Recherche
    search?: string
    payoutNumber?: string
    reference?: string

    // Relations
    producerId?: string
    paymentId?: string
    orderId?: string

    // Métadonnées
    tags?: string[]

    // Pagination
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'

    // Délais
    overdueOnly?: boolean
    scheduledOnly?: boolean
}

// ============ STATISTIQUES ============

/**
 * Interface pour les statistiques de versement
 */
export interface PayoutStats {
    // Totaux
    totalPayouts: number
    totalAmount: number
    averagePayout: number
    totalFees: number
    totalNetAmount: number

    // Par statut
    pending: number
    processing: number
    paid: number
    failed: number
    cancelled: number

    // Montants par statut
    pendingAmount: number
    processingAmount: number
    paidAmount: number
    failedAmount: number
    cancelledAmount: number

    // Par méthode
    byMethod: Record<PAYOUT_METHODS, { count: number; amount: number }>

    // Par type
    byType: Record<PAYOUT_TYPE, { count: number; amount: number }>

    // Tendance
    monthlyTrend: Array<{
        month: string
        count: number
        amount: number
        fees: number
        netAmount: number
    }>

    // Top producteurs
    topProducers: Array<{
        producerId: string
        producerName: string
        count: number
        amount: number
        average: number
    }>

    // Performance
    averageProcessingTime: number      // en heures
    successRate: number               // en pourcentage
    failedRate: number                // en pourcentage

    // Formatés
    formattedTotalAmount?: string
    formattedAveragePayout?: string
    formattedTotalFees?: string
    formattedTotalNetAmount?: string
    formattedPaidAmount?: string
    formattedPendingAmount?: string
}

// ============ RAPPORTS ============

/**
 * Interface pour un rapport de réconciliation
 */
export interface PayoutReconciliation {
    id: string
    reportNumber: string
    period: {
        start: Date
        end: Date
    }

    // Résumé
    summary: {
        totalPayouts: number
        totalAmount: number
        totalFees: number
        totalNetAmount: number
        averagePayout: number
    }

    // Détails
    details: {
        byMethod: Record<PAYOUT_METHODS, { count: number; amount: number; fees: number }>
        byStatus: Record<PAYOUT_STATUS, { count: number; amount: number }>
        byProducer: Record<string, { name: string; count: number; amount: number }>
    }

    // Transactions
    transactions: Array<{
        payoutId: string
        payoutNumber: string
        amount: number
        fees: number
        netAmount: number
        method: PAYOUT_METHODS
        status: PAYOUT_STATUS
        paidAt?: Date
    }>

    // Vérification
    verified: boolean
    verifiedBy?: string
    verifiedAt?: Date
    discrepancies?: Array<{
        type: 'missing' | 'mismatch' | 'duplicate'
        description: string
        amount: number
        resolved: boolean
    }>

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    reportDate: Date
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedTotalAmount?: string
    formattedTotalFees?: string
    formattedTotalNetAmount?: string
    formattedAveragePayout?: string
    formattedReportDate?: string
}

// ============ SOLDE ET DISPONIBILITÉ ============

/**
 * Interface pour le solde disponible
 */
export interface AvailableBalance {
    producerId: string
    producerName: string

    // Soldes
    totalBalance: number              // Solde total
    availableBalance: number          // Solde disponible pour versement
    pendingBalance: number            // Solde en attente
    heldBalance: number               // Solde retenu (pour litiges, etc.)

    // Prochain versement
    nextPayoutDate?: Date
    nextPayoutAmount?: number
    nextPayoutMethod?: PAYOUT_METHODS

    // Historique récent
    recentPayouts: Array<{
        id: string
        amount: number
        netAmount: number
        status: PAYOUT_STATUS
        paidAt?: Date
    }>

    // Limites
    payoutLimits: PayoutLimits

    // Formatés
    formattedTotalBalance?: string
    formattedAvailableBalance?: string
    formattedPendingBalance?: string
    formattedHeldBalance?: string
    formattedNextPayoutAmount?: string
    formattedNextPayoutDate?: string
}

// ============ NOTIFICATIONS ============

/**
 * Interface pour une notification de versement
 */
export interface PayoutNotification {
    id: string
    payoutId: string
    type: 'requested' | 'approved' | 'rejected' | 'processing' | 'paid' | 'failed' | 'cancelled'
    recipient: string
    recipientType: 'producer' | 'admin' | 'finance'
    subject: string
    body: string
    data: any

    // Statut
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    sentAt?: Date
    readAt?: Date

    // Formatés
    formattedCreatedAt?: string
}

// ============ WORKFLOW ============

/**
 * Interface pour une étape du workflow de versement
 */
export interface PayoutWorkflowStep {
    id: string
    payoutId: string
    step: number
    name: string
    description?: string

    // Responsable
    assignedTo: string
    assignedToName?: string
    assignedToRole: string

    // Statut
    status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'blocked'
    isRequired: boolean

    // Actions
    actions: string[]
    completedAction?: string

    // Délais
    dueDate?: Date
    completedAt?: Date
    slaHours?: number
    isOverdue?: boolean

    // Commentaires
    comments?: string[]

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date
}

// ============ TYPES D'EXPORT ============

/**
 * Interface pour l'export des versements
 */
export interface PayoutExportOptions {
    format: 'csv' | 'excel' | 'pdf' | 'json'
    filters?: PayoutFiltersDto
    columns?: string[]
    includeTransactions?: boolean
    includeBreakdown?: boolean
    language?: string
    currency?: string
}

// ============ TYPES UTILITAIRES ============

/**
 * Interface pour les frais détaillés
 */
export interface DetailedPayoutFees {
    breakdown: {
        platform: {
            amount: number
            percentage: number
            description: string
        }
        processing: {
            amount: number
            percentage: number
            description: string
        }
        tax?: {
            amount: number
            rate: number
            description: string
        }
        other?: Array<{
            name: string
            amount: number
            description: string
        }>
    }
    totalFees: number
    netAmount: number
    formattedTotalFees?: string
    formattedNetAmount?: string
}

/**
 * Interface pour la vérification d'éligibilité
 */
export interface PayoutEligibility {
    eligible: boolean
    reasons: string[]

    // Détails
    minAmount: number
    maxAmount: number
    availableBalance: number

    // Restrictions
    restrictions: Array<{
        type: string
        message: string
        severity: 'warning' | 'error'
    }>

    // Recommandations
    recommendedMethods: PAYOUT_METHODS[]

    // Formatés
    formattedMinAmount?: string
    formattedMaxAmount?: string
    formattedAvailableBalance?: string
}

// ============ EXPORT DES TYPES ============

export type {
    // Versements
    Payout as IPayout,
    CreatePayoutDto as ICreatePayoutDto,
    UpdatePayoutDto as IUpdatePayoutDto,
    ProcessPayoutDto as IProcessPayoutDto,
    PayoutFiltersDto as IPayoutFiltersDto,

    // Programmation
    PayoutSchedule as IPayoutSchedule,
    UpdatePayoutScheduleDto as IUpdatePayoutScheduleDto,

    // Demandes
    PayoutRequest as IPayoutRequest,
    CreatePayoutRequestDto as ICreatePayoutRequestDto,

    // Méthodes
    PayoutMethod as IPayoutMethod,

    // Statistiques
    PayoutStats as IPayoutStats,

    // Rapports
    PayoutReconciliation as IPayoutReconciliation,

    // Solde
    AvailableBalance as IAvailableBalance,

    // Notifications
    PayoutNotification as IPayoutNotification,

    // Workflow
    PayoutWorkflowStep as IPayoutWorkflowStep,

    // Export
    PayoutExportOptions as IPayoutExportOptions,

    // Utilitaires
    DetailedPayoutFees as IDetailedPayoutFees,
    PayoutEligibility as IPayoutEligibility,

    // Structures de base
    PayoutFees as IPayoutFees,
    PayoutLimits as IPayoutLimits,
    BankDetails as IBankDetails,
    MobileMoneyDetails as IMobileMoneyDetails
}
