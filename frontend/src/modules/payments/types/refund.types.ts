// @ts-nocheck
// frontend/src/modules/payments/types/refund.types.ts

// ============ ENUMS ============
export enum REFUND_STATUS {
    REQUESTED = 'requested',        // Demande initiale
    UNDER_REVIEW = 'under_review',  // En cours d'examen
    PENDING_APPROVAL = 'pending_approval', // En attente d'approbation
    APPROVED = 'approved',          // Approuvé
    REJECTED = 'rejected',          // Rejeté
    PROCESSING = 'processing',      // En cours de traitement
    COMPLETED = 'completed',        // Terminé (remboursé)
    FAILED = 'failed',              // Échec du remboursement
    CANCELLED = 'cancelled',        // Annulé
    PARTIALLY_REFUNDED = 'partially_refunded', // Partiellement remboursé
    DISPUTED = 'disputed'           // En litige
}

export enum REFUND_REASON {
    PRODUCT_DEFECTIVE = 'product_defective',          // Produit défectueux
    NOT_AS_DESCRIBED = 'not_as_described',           // Ne correspond pas à la description
    WRONG_ITEM = 'wrong_item',                       // Mauvais article reçu
    LATE_DELIVERY = 'late_delivery',                 // Livraison tardive
    DAMAGED = 'damaged',                             // Produit endommagé
    MISSING_PARTS = 'missing_parts',                 // Pièces manquantes
    QUALITY_ISSUE = 'quality_issue',                 // Problème de qualité
    SIZE_ISSUE = 'size_issue',                       // Problème de taille
    COLOR_ISSUE = 'color_issue',                     // Problème de couleur
    CHANGE_OF_MIND = 'change_of_mind',               // Changement d'avis
    FOUND_BETTER_PRICE = 'found_better_price',       // Trouvé meilleur prix ailleurs
    TOO_EXPENSIVE = 'too_expensive',                 // Trop cher
    DUPLICATE_PURCHASE = 'duplicate_purchase',       // Achat en double
    CANCELLED_ORDER = 'cancelled_order',             // Commande annulée
    SERVICE_NOT_PROVIDED = 'service_not_provided',   // Service non fourni
    INCORRECT_BILLING = 'incorrect_billing',         // Facturation incorrecte
    FRAUDULENT_CHARGE = 'fraudulent_charge',         // Fraude
    TECHNICAL_ISSUE = 'technical_issue',             // Problème technique
    OTHER = 'other'                                  // Autre
}

export enum REFUND_METHOD {
    ORIGINAL_METHOD = 'original_method',    // Remboursement sur la méthode originale
    BANK_TRANSFER = 'bank_transfer',        // Virement bancaire
    MOBILE_MONEY = 'mobile_money',          // Mobile Money
    DIGITAL_WALLET = 'digital_wallet',      // Portefeuille numérique
    STORE_CREDIT = 'store_credit',          // Crédit boutique
    GIFT_CARD = 'gift_card',                // Carte cadeau
    CASH = 'cash',                          // Espèces
    CHECK = 'check',                        // Chèque
    OTHER = 'other'                         // Autre
}

export enum REFUND_TYPE {
    FULL = 'full',                          // Remboursement total
    PARTIAL = 'partial',                    // Remboursement partiel
    EXCHANGE = 'exchange',                  // Échange
    STORE_CREDIT = 'store_credit'           // Crédit boutique
}

export enum REFUND_PRIORITY {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

// ============ INTERFACES DE BASE ============

/**
 * Interface pour les articles à rembourser
 */
export interface RefundItem {
    id: string
    refundId: string
    orderItemId: string
    productId: string
    productName: string
    productSku?: string
    productImage?: string

    // Quantité et prix
    quantity: number
    originalQuantity: number
    unitPrice: number
    originalUnitPrice: number

    // Montants
    subtotal: number
    taxAmount?: number
    totalAmount: number
    refundAmount: number

    // Raison spécifique à l'article
    reason?: REFUND_REASON
    explanation?: string

    // État de l'article
    condition?: 'new' | 'like_new' | 'used' | 'damaged' | 'defective'
    returnRequired: boolean
    returned?: boolean
    returnDate?: Date

    // Métadonnées
    metadata?: Record<string, any>

    // Formatés
    formattedUnitPrice?: string
    formattedSubtotal?: string
    formattedTotalAmount?: string
    formattedRefundAmount?: string
}

/**
 * Interface pour les preuves de remboursement
 */
export interface RefundEvidence {
    id: string
    refundId: string
    type: 'photo' | 'video' | 'document' | 'email' | 'other'
    url: string
    thumbnailUrl?: string
    fileName: string
    fileSize?: number
    mimeType?: string
    description?: string
    uploadedBy: string
    uploadedAt: Date
    isVerified?: boolean
}

/**
 * Interface pour les commentaires de remboursement
 */
export interface RefundComment {
    id: string
    refundId: string
    userId: string
    userName: string
    userRole: string
    userAvatar?: string

    comment: string
    isInternal: boolean
    isCustomerVisible: boolean

    attachments?: string[]
    metadata?: Record<string, any>

    createdAt: Date
    updatedAt: Date
    deletedAt?: Date

    formattedCreatedAt?: string
}

// ============ REMBOURSEMENTS ============

/**
 * Interface principale pour un remboursement
 */
export interface Refund {
    id: string
    refundNumber: string
    reference?: string

    // Relations
    orderId: string
    paymentId: string
    invoiceId?: string

    // Parties concernées
    customerId: string
    customerName: string
    customerEmail: string
    customerPhone?: string

    producerId: string
    producerName: string
    producerEmail?: string

    // Informations de base
    status: REFUND_STATUS
    type: REFUND_TYPE
    priority: REFUND_PRIORITY

    // Raison
    reason: REFUND_REASON
    explanation: string
    additionalNotes?: string

    // Montants
    originalAmount: number
    requestedAmount: number
    approvedAmount?: number
    refundedAmount?: number

    // Calculs
    fees?: number
    taxAmount?: number
    netAmount?: number
    shippingCost?: number
    restockingFee?: number

    // Méthode et détails
    refundMethod: REFUND_METHOD
    methodDetails?: Record<string, any>

    // Articles
    items: RefundItem[]
    totalItems: number

    // Preuves
    evidence?: RefundEvidence[]

    // Commentaires
    comments?: RefundComment[]

    // Workflow
    requestedBy: string
    requestedAt: Date
    reviewedBy?: string
    reviewedAt?: Date
    approvedBy?: string
    approvedAt?: Date
    rejectedBy?: string
    rejectedAt?: Date
    rejectionReason?: string
    processedBy?: string
    processedAt?: Date
    completedBy?: string
    completedAt?: Date

    // Transaction
    transactionId?: string
    transactionReference?: string
    transactionDate?: Date

    // Retour
    returnRequired: boolean
    returnStatus?: 'not_returned' | 'in_transit' | 'received' | 'inspected' | 'restocked'
    returnTrackingNumber?: string
    returnCarrier?: string
    returnReceivedAt?: Date
    returnInspectedAt?: Date
    returnRestockedAt?: Date

    // Délais
    estimatedCompletion?: Date
    slaDays?: number
    isOverdue?: boolean

    // Métadonnées
    metadata?: Record<string, any>
    tags?: string[]

    // Dates système
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date

    // Formatés
    formattedOriginalAmount?: string
    formattedRequestedAmount?: string
    formattedApprovedAmount?: string
    formattedRefundedAmount?: string
    formattedRequestedAt?: string
    formattedEstimatedCompletion?: string

    // Calculés
    daysSinceRequest?: number
    canBeCancelled?: boolean
    canBeUpdated?: boolean
}

// ============ DTOs ============

/**
 * Interface pour demander un remboursement
 */
export interface CreateRefundDto {
    orderId: string
    paymentId: string

    // Raison
    reason: REFUND_REASON
    explanation: string
    additionalNotes?: string

    // Type et montant
    type?: REFUND_TYPE
    requestedAmount?: number

    // Articles
    items: Array<{
        orderItemId: string
        quantity: number
        reason?: REFUND_REASON
        explanation?: string
        condition?: string
    }>

    // Preuves
    evidence?: Array<{
        type: string
        url: string
        description?: string
    }>

    // Méthode de remboursement préférée
    preferredMethod?: REFUND_METHOD
    methodDetails?: Record<string, any>

    // Métadonnées
    metadata?: Record<string, any>
    tags?: string[]
}

/**
 * Interface pour mettre à jour le statut d'un remboursement
 */
export interface UpdateRefundStatusDto {
    status: REFUND_STATUS
    reason?: string
    notes?: string
    approvedAmount?: number
    refundMethod?: REFUND_METHOD
    methodDetails?: Record<string, any>
    transactionId?: string
    transactionReference?: string
}

/**
 * Interface pour approuver un remboursement
 */
export interface ApproveRefundDto {
    approvedAmount?: number
    refundMethod?: REFUND_METHOD
    methodDetails?: Record<string, any>
    notes?: string
    estimatedCompletion?: Date
}

/**
 * Interface pour rejeter un remboursement
 */
export interface RejectRefundDto {
    reason: string
    notes?: string
    allowResubmission?: boolean
    resubmissionDeadline?: Date
}

/**
 * Interface pour traiter un remboursement
 */
export interface ProcessRefundDto {
    transactionId: string
    transactionReference?: string
    transactionDate?: Date
    notes?: string
    fees?: number
    taxAmount?: number
    netAmount?: number
}

// ============ FILTRES ============

/**
 * Interface pour filtrer les remboursements
 */
export interface RefundFiltersDto {
    // Filtres de base
    status?: REFUND_STATUS | 'all'
    reason?: REFUND_REASON | 'all'
    type?: REFUND_TYPE | 'all'
    priority?: REFUND_PRIORITY | 'all'

    // Dates
    startDate?: Date
    endDate?: Date
    requestedAfter?: Date
    requestedBefore?: Date
    completedAfter?: Date
    completedBefore?: Date

    // Montants
    minAmount?: number
    maxAmount?: number
    amountRange?: {
        min: number
        max: number
    }

    // Recherche
    search?: string
    refundNumber?: string
    reference?: string

    // Relations
    orderId?: string
    paymentId?: string
    customerId?: string
    producerId?: string

    // Statut de retour
    returnStatus?: string

    // Métadonnées
    tags?: string[]

    // Pagination
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'

    // Délais
    overdueOnly?: boolean
    slaBreached?: boolean
}

// ============ STATISTIQUES ============

/**
 * Interface pour les statistiques de remboursement
 */
export interface RefundStats {
    // Totaux
    totalRefunds: number
    totalAmount: number
    averageRefund: number

    // Par statut
    requested: number
    underReview: number
    approved: number
    rejected: number
    processing: number
    completed: number
    failed: number

    // Montants par statut
    requestedAmount: number
    underReviewAmount: number
    approvedAmount: number
    rejectedAmount: number
    processingAmount: number
    completedAmount: number
    failedAmount: number

    // Par raison
    byReason: Record<REFUND_REASON, { count: number; amount: number }>

    // Par type
    byType: Record<REFUND_TYPE, { count: number; amount: number }>

    // Taux
    approvalRate: number
    rejectionRate: number
    completionRate: number
    averageProcessingTime: number // en jours

    // Top
    topProducts: Array<{
        productId: string
        productName: string
        refunds: number
        amount: number
        refundRate: number
    }>

    topCustomers: Array<{
        customerId: string
        customerName: string
        refunds: number
        amount: number
        refundRate: number
    }>

    topProducers: Array<{
        producerId: string
        producerName: string
        refunds: number
        amount: number
        refundRate: number
    }>

    // Évolution
    monthlyTrend: Array<{
        month: string
        refunds: number
        amount: number
        average: number
        approvalRate: number
    }>

    // Formatés
    formattedTotalAmount?: string
    formattedAverageRefund?: string
    formattedRequestedAmount?: string
    formattedApprovedAmount?: string
    formattedCompletedAmount?: string
}

// ============ RAPPORTS ============

/**
 * Interface pour un rapport de remboursement
 */
export interface RefundReport {
    period: {
        start: Date
        end: Date
    }

    // Résumé
    summary: {
        totalRefunds: number
        totalAmount: number
        averageProcessingTime: number
        approvalRate: number
        topReason: string
    }

    // Détails
    details: {
        byStatus: Record<REFUND_STATUS, { count: number; amount: number }>
        byReason: Record<REFUND_REASON, { count: number; amount: number }>
        byType: Record<REFUND_TYPE, { count: number; amount: number }>
        byProduct: Record<string, { name: string; count: number; amount: number }>
        byCustomer: Record<string, { name: string; count: number; amount: number }>
        byProducer: Record<string, { name: string; count: number; amount: number }>
    }

    // Tendance
    trends: {
        daily: Array<{ date: string; refunds: number; amount: number }>
        weekly: Array<{ week: string; refunds: number; amount: number }>
        monthly: Array<{ month: string; refunds: number; amount: number }>
    }

    // Performance
    performance: {
        slaCompliance: number
        averageFirstResponseTime: number
        customerSatisfaction?: number
        resolutionRate: number
    }

    // Formatés
    formattedTotalAmount?: string
    formattedAverageProcessingTime?: string
}

// ============ POLITIQUES ============

/**
 * Interface pour la politique de remboursement
 */
export interface RefundPolicy {
    id: string
    name: string
    description?: string

    // Délais
    refundPeriod: number // en jours
    returnPeriod: number // en jours

    // Conditions
    conditions: string[]
    exceptions: string[]

    // Frais
    restockingFee: number
    shippingCostResponsibility: 'customer' | 'seller' | 'split'

    // Montants
    minRefundAmount: number
    maxRefundAmount: number

    // Méthodes autorisées
    allowedMethods: REFUND_METHOD[]
    defaultMethod: REFUND_METHOD

    // Processus
    autoApprovalThreshold?: number
    requiresReview: boolean
    requiresApproval: boolean
    approvalWorkflow?: string[]

    // Période d'application
    effectiveFrom: Date
    effectiveTo?: Date

    // Statut
    isActive: boolean
    isDefault: boolean

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedMinRefundAmount?: string
    formattedMaxRefundAmount?: string
}

// ============ MODÈLES ============

/**
 * Interface pour un modèle de réponse de remboursement
 */
export interface RefundTemplate {
    id: string
    name: string
    description?: string

    // Type
    type: 'approval' | 'rejection' | 'request_info' | 'completion'

    // Contenu
    subject: string
    body: string
    variables: string[] // Variables disponibles dans le template

    // Statut
    isActive: boolean
    isDefault: boolean

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date
}

// ============ ÉLIGIBILITÉ ============

/**
 * Interface pour vérifier l'éligibilité au remboursement
 */
export interface RefundEligibility {
    eligible: boolean
    reasons: string[]

    // Détails
    orderAge: number // en jours
    maxRefundPeriod: number
    remainingDays: number

    // Montants
    maxRefundAmount: number
    minRefundAmount: number
    calculatedAmount: number

    // Conditions
    requiresReturn: boolean
    canPartialRefund: boolean
    allowedMethods: REFUND_METHOD[]

    // Restrictions
    restrictions: Array<{
        type: string
        message: string
        severity: 'warning' | 'error'
    }>

    // Formatés
    formattedMaxRefundAmount?: string
    formattedMinRefundAmount?: string
    formattedCalculatedAmount?: string
}

// ============ NOTIFICATIONS ============

/**
 * Interface pour une notification de remboursement
 */
export interface RefundNotification {
    id: string
    refundId: string
    type: 'request_received' | 'status_update' | 'approval' | 'rejection' | 'completion' | 'reminder'
    recipient: string
    recipientType: 'customer' | 'producer' | 'admin'
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
 * Interface pour une étape de workflow de remboursement
 */
export interface RefundWorkflowStep {
    id: string
    refundId: string
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

// ============ ANALYTIQUES ============

/**
 * Interface pour les raisons de remboursement
 */
export interface RefundReasonAnalytics {
    reason: REFUND_REASON
    count: number
    amount: number
    percentage: number
    averageAmount: number
    trend: number // Évolution en pourcentage
    topProducts: Array<{
        productId: string
        productName: string
        count: number
    }>
    resolutionTime: number // Temps moyen de résolution
    formattedAmount?: string
    formattedAverageAmount?: string
}

// ============ TYPES D'EXPORT ============

/**
 * Interface pour l'export des remboursements
 */
export interface RefundExportOptions {
    format: 'csv' | 'excel' | 'pdf' | 'json'
    filters?: RefundFiltersDto
    columns?: string[]
    includeItems?: boolean
    includeComments?: boolean
    includeEvidence?: boolean
    language?: string
    currency?: string
}

// ============ TYPES UTILITAIRES ============

/**
 * Interface pour les retours physiques
 */
export interface ReturnInfo {
    refundId: string
    status: 'pending' | 'in_transit' | 'received' | 'inspected' | 'restocked' | 'lost'
    trackingNumber?: string
    carrier?: string
    shippingLabel?: string
    shippingCost?: number
    shippingPaidBy?: 'customer' | 'seller'

    // Adresse de retour
    returnAddress: {
        name: string
        street: string
        city: string
        state?: string
        postalCode: string
        country: string
        phone?: string
        email?: string
    }

    // Dates
    shippedAt?: Date
    estimatedDelivery?: Date
    receivedAt?: Date
    inspectedAt?: Date
    restockedAt?: Date

    // Notes
    notes?: string[]

    // Formatés
    formattedShippingCost?: string
}

/**
 * Interface pour les frais de remboursement
 */
export interface RefundFees {
    restockingFee: number
    shippingFee: number
    processingFee: number
    taxOnFees?: number
    totalFees: number
    netRefundAmount: number
    formattedRestockingFee?: string
    formattedShippingFee?: string
    formattedProcessingFee?: string
    formattedTotalFees?: string
    formattedNetRefundAmount?: string
}

// ============ EXPORT DES TYPES ============

export type {
    // Remboursements
    Refund as IRefund,
    CreateRefundDto as ICreateRefundDto,
    UpdateRefundStatusDto as IUpdateRefundStatusDto,
    ApproveRefundDto as IApproveRefundDto,
    RejectRefundDto as IRejectRefundDto,
    ProcessRefundDto as IProcessRefundDto,
    RefundFiltersDto as IRefundFiltersDto,

    // Articles
    RefundItem as IRefundItem,

    // Preuves
    RefundEvidence as IRefundEvidence,

    // Commentaires
    RefundComment as IRefundComment,

    // Statistiques
    RefundStats as IRefundStats,
    RefundReport as IRefundReport,

    // Politiques
    RefundPolicy as IRefundPolicy,

    // Modèles
    RefundTemplate as IRefundTemplate,

    // Éligibilité
    RefundEligibility as IRefundEligibility,

    // Notifications
    RefundNotification as IRefundNotification,

    // Workflow
    RefundWorkflowStep as IRefundWorkflowStep,

    // Analytiques
    RefundReasonAnalytics as IRefundReasonAnalytics,

    // Export
    RefundExportOptions as IRefundExportOptions,

    // Utilitaires
    ReturnInfo as IReturnInfo,
    RefundFees as IRefundFees
}