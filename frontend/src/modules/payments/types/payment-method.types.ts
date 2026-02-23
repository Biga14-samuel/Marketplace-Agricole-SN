// @ts-nocheck
// frontend/src/modules/payments/types/payment-method.types.ts

// ============ ENUMS ============
export enum PAYMENT_METHOD_TYPE {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    MOBILE_MONEY = 'mobile_money',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    DIGITAL_WALLET = 'digital_wallet',
    CASH_ON_DELIVERY = 'cash_on_delivery',
    CRYPTO = 'crypto',
    SPLIT_PAYMENT = 'split_payment',
    SUBSCRIPTION = 'subscription',
    INSTALLMENT = 'installment',
    GIFT_CARD = 'gift_card'
}

export enum PAYMENT_METHOD_STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING_VERIFICATION = 'pending_verification',
    VERIFIED = 'verified',
    EXPIRED = 'expired',
    SUSPENDED = 'suspended',
    RESTRICTED = 'restricted'
}

export enum CARD_TYPE {
    VISA = 'visa',
    MASTERCARD = 'mastercard',
    AMEX = 'amex',
    DISCOVER = 'discover',
    DINERS_CLUB = 'diners_club',
    JCB = 'jcb',
    UNIONPAY = 'unionpay',
    MAESTRO = 'maestro',
    OTHER = 'other'
}

export enum MOBILE_MONEY_PROVIDER {
    MTN = 'mtn',
    ORANGE = 'orange',
    EXPRESS_UNION = 'express_union',
    MOOV = 'moov',
    AIRTEL_MONEY = 'airtel_money',
    TIGO = 'tigo',
    OTHER = 'other'
}

export enum WALLET_TYPE {
    APP_WALLET = 'app_wallet',
    WEB_WALLET = 'web_wallet',
    HARDWARE_WALLET = 'hardware_wallet',
    PREPAID_CARD = 'prepaid_card'
}

export enum VERIFICATION_METHOD {
    SMS = 'sms',
    EMAIL = 'email',
    MICRO_DEPOSIT = 'micro_deposit',
    DOCUMENT_UPLOAD = 'document_upload',
    ID_VERIFICATION = 'id_verification',
    FACE_VERIFICATION = 'face_verification'
}

// ============ INTERFACES DE BASE ============

/**
 * Interface pour les frais de méthode de paiement
 */
export interface PaymentMethodFees {
    percentage: number
    fixed: number
    minFee?: number
    maxFee?: number
    currency: string
    description?: string
    appliesTo: 'all' | 'domestic' | 'international' | 'specific_countries'
    taxIncluded: boolean
    formattedPercentage?: string
    formattedFixed?: string
    formattedMinFee?: string
    formattedMaxFee?: string
}

/**
 * Interface pour les limites de méthode de paiement
 */
export interface PaymentMethodLimits {
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
 * Interface pour les pays pris en charge
 */
export interface SupportedCountry {
    code: string
    name: string
    currency: string
    isActive: boolean
    requiresVerification: boolean
    specificRules?: Record<string, any>
}

// ============ CARTES BANCAIRES ============

/**
 * Interface pour les détails de carte bancaire
 */
export interface CardDetails {
    id: string
    paymentMethodId: string
    userId: string

    // Informations de base
    cardType: CARD_TYPE
    cardNumber: string // masqué dans la plupart des cas
    last4: string
    cardHolder: string
    expiryMonth: number
    expiryYear: number
    cvv?: string // jamais stocké en clair

    // Informations supplémentaires
    issuingBank?: string
    issuingCountry?: string
    cardLevel?: 'standard' | 'gold' | 'platinum' | 'infinite'

    // Sécurité
    token?: string // token de paiement sécurisé
    fingerprint?: string // empreinte digitale de la carte

    // Métadonnées
    isDefault: boolean
    isExpired: boolean
    isValid: boolean

    // Dates
    createdAt: Date
    updatedAt: Date
    lastUsedAt?: Date
    expiryDate?: Date

    // Formatés
    formattedCardNumber?: string
    formattedExpiryDate?: string
    formattedLastUsedAt?: string
}

/**
 * Interface pour créer une carte
 */
export interface CreateCardDto {
    cardNumber: string
    cardHolder: string
    expiryMonth: number
    expiryYear: number
    cvv: string
    isDefault?: boolean
    metadata?: Record<string, any>
}

/**
 * Interface pour mettre à jour une carte
 */
export interface UpdateCardDto {
    cardHolder?: string
    expiryMonth?: number
    expiryYear?: number
    isDefault?: boolean
    metadata?: Record<string, any>
}

// ============ MOBILE MONEY ============

/**
 * Interface pour les détails Mobile Money
 */
export interface MobileMoneyDetails {
    id: string
    paymentMethodId: string
    userId: string

    // Fournisseur
    provider: MOBILE_MONEY_PROVIDER
    providerName: string

    // Informations du compte
    phoneNumber: string
    accountName?: string
    accountNumber?: string

    // Statut
    isVerified: boolean
    verificationMethod?: VERIFICATION_METHOD
    verificationDate?: Date

    // Métadonnées
    metadata?: Record<string, any>
    isDefault: boolean

    // Dates
    createdAt: Date
    updatedAt: Date
    lastUsedAt?: Date

    // Formatés
    formattedPhoneNumber?: string
    formattedLastUsedAt?: string
}

/**
 * Interface pour créer un compte Mobile Money
 */
export interface CreateMobileMoneyDto {
    provider: MOBILE_MONEY_PROVIDER
    phoneNumber: string
    accountName?: string
    isDefault?: boolean
    verificationCode?: string
    metadata?: Record<string, any>
}

/**
 * Interface pour un fournisseur Mobile Money
 */
export interface MobileMoneyProvider {
    id: string
    name: string
    code: MOBILE_MONEY_PROVIDER
    logo: string
    description?: string

    // Configuration
    country: string
    currency: string
    isActive: boolean

    // Frais
    fees: PaymentMethodFees
    limits: PaymentMethodLimits

    // Caractéristiques
    features: string[]
    requiresPhoneNumber: boolean
    requiresVerification: boolean
    supportsDeposit: boolean
    supportsWithdrawal: boolean
    supportsTransfer: boolean
    supportsBillPayment: boolean

    // Contact
    customerService?: {
        phone: string
        email: string
        website: string
    }

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedFees?: string
}

// ============ COMPTES BANCAIRES ============

/**
 * Interface pour les détails de compte bancaire
 */
export interface BankAccountDetails {
    id: string
    paymentMethodId: string
    userId: string

    // Informations bancaires
    bankName: string
    bankCode?: string
    branchCode?: string
    branchName?: string

    // Informations du compte
    accountNumber: string
    accountHolder: string
    accountType: 'checking' | 'savings' | 'business' | 'other'

    // Codes internationaux
    iban?: string
    swiftCode?: string
    routingNumber?: string

    // Adresse de la banque
    bankAddress?: {
        street: string
        city: string
        state?: string
        postalCode: string
        country: string
    }

    // Statut
    isVerified: boolean
    verificationMethod?: VERIFICATION_METHOD
    verificationDate?: Date

    // Métadonnées
    metadata?: Record<string, any>
    isDefault: boolean

    // Dates
    createdAt: Date
    updatedAt: Date
    lastUsedAt?: Date

    // Formatés
    formattedAccountNumber?: string
    formattedLastUsedAt?: string
}

/**
 * Interface pour créer un compte bancaire
 */
export interface CreateBankAccountDto {
    bankName: string
    accountNumber: string
    accountHolder: string
    accountType?: 'checking' | 'savings' | 'business' | 'other'
    bankCode?: string
    branchCode?: string
    iban?: string
    swiftCode?: string
    isDefault?: boolean
    metadata?: Record<string, any>
}

// ============ PORTEFEUILLES NUMÉRIQUES ============

/**
 * Interface pour les détails de portefeuille numérique
 */
export interface DigitalWalletDetails {
    id: string
    paymentMethodId: string
    userId: string

    // Type de portefeuille
    walletType: WALLET_TYPE
    provider: string // 'app', 'paypal', 'venmo', etc.

    // Informations du compte
    walletId: string
    walletAddress?: string
    email?: string
    phoneNumber?: string

    // Solde
    balance?: number
    currency: string

    // Sécurité
    isVerified: boolean
    verificationLevel?: 'basic' | 'advanced' | 'full'

    // Métadonnées
    metadata?: Record<string, any>
    isDefault: boolean

    // Dates
    createdAt: Date
    updatedAt: Date
    lastUsedAt?: Date

    // Formatés
    formattedBalance?: string
    formattedLastUsedAt?: string
}

/**
 * Interface pour créer un portefeuille numérique
 */
export interface CreateDigitalWalletDto {
    walletType: WALLET_TYPE
    provider: string
    walletId: string
    walletAddress?: string
    email?: string
    phoneNumber?: string
    isDefault?: boolean
    metadata?: Record<string, any>
}

// ============ MÉTHODES DE PAIEMENT ============

/**
 * Interface principale pour une méthode de paiement
 */
export interface PaymentMethod {
    id: string
    userId: string

    // Type et statut
    type: PAYMENT_METHOD_TYPE
    status: PAYMENT_METHOD_STATUS
    name: string
    description?: string

    // Détails spécifiques
    details: CardDetails | MobileMoneyDetails | BankAccountDetails | DigitalWalletDetails | Record<string, any>

    // Configuration
    isDefault: boolean
    isActive: boolean
    isGlobal: boolean

    // Frais et limites
    fees?: PaymentMethodFees
    limits?: PaymentMethodLimits

    // Restrictions géographiques
    countries?: SupportedCountry[]
    currencies?: string[]

    // Disponibilité
    availableFor: {
        deposits: boolean
        withdrawals: boolean
        payments: boolean
        transfers: boolean
    }

    // Sécurité
    requiresVerification: boolean
    verificationStatus?: 'pending' | 'verified' | 'failed'
    verificationMethod?: VERIFICATION_METHOD

    // Présentation
    logo?: string
    icon?: string
    color?: string
    displayOrder: number

    // Métadonnées
    metadata?: Record<string, any>
    tags?: string[]

    // Statistiques d'utilisation
    usageCount: number
    successRate?: number
    lastSuccessAt?: Date
    lastFailureAt?: Date

    // Dates
    createdAt: Date
    updatedAt: Date
    verifiedAt?: Date
    lastUsedAt?: Date
    expiresAt?: Date

    // Formatés
    formattedCreatedAt?: string
    formattedLastUsedAt?: string
    formattedExpiresAt?: string
    formattedFees?: string
    formattedLimits?: string

    // Calculés
    canBeDeleted?: boolean
    canBeUpdated?: boolean
    daysUntilExpiry?: number
    isExpiringSoon?: boolean
}

// ============ DTOs ============

/**
 * Interface pour créer une méthode de paiement
 */
export interface CreatePaymentMethodDto {
    type: PAYMENT_METHOD_TYPE
    name: string
    description?: string
    details: Record<string, any>
    isDefault?: boolean
    isActive?: boolean
    metadata?: Record<string, any>
    tags?: string[]
}

/**
 * Interface pour mettre à jour une méthode de paiement
 */
export interface UpdatePaymentMethodDto {
    name?: string
    description?: string
    status?: PAYMENT_METHOD_STATUS
    isDefault?: boolean
    isActive?: boolean
    details?: Record<string, any>
    metadata?: Record<string, any>
    tags?: string[]
}

/**
 * Interface pour vérifier une méthode de paiement
 */
export interface VerifyPaymentMethodDto {
    verificationMethod: VERIFICATION_METHOD
    verificationCode?: string
    amounts?: number[] // pour micro-dépôts
    document?: {
        type: string
        url: string
        metadata?: Record<string, any>
    }
}

// ============ FILTRES ============

/**
 * Interface pour filtrer les méthodes de paiement
 */
export interface PaymentMethodFiltersDto {
    // Filtres de base
    type?: PAYMENT_METHOD_TYPE | 'all'
    status?: PAYMENT_METHOD_STATUS | 'all'

    // Disponibilité
    availableFor?: 'deposits' | 'withdrawals' | 'payments' | 'transfers' | 'all'
    country?: string
    currency?: string

    // Statut
    isDefault?: boolean
    isActive?: boolean
    isVerified?: boolean

    // Recherche
    search?: string
    name?: string

    // Métadonnées
    tags?: string[]

    // Pagination
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'

    // Expiration
    expiresSoon?: boolean
    expiredOnly?: boolean
}

// ============ CONFIGURATION ============

/**
 * Interface pour la configuration d'une méthode de paiement
 */
export interface PaymentMethodConfig {
    id: string
    paymentMethodType: PAYMENT_METHOD_TYPE

    // Configuration générale
    isEnabled: boolean
    displayName: string
    description: string

    // Paramètres
    settings: Record<string, any>
    credentials?: Record<string, any> // stocké chiffré

    // Frais par défaut
    defaultFees: PaymentMethodFees

    // Limites par défaut
    defaultLimits: PaymentMethodLimits

    // Restrictions
    allowedCountries: string[]
    allowedCurrencies: string[]
    minAmount: number
    maxAmount: number

    // Interface utilisateur
    logo: string
    icon: string
    color: string
    displayOrder: number

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedMinAmount?: string
    formattedMaxAmount?: string
    formattedDefaultFees?: string
}

// ============ FOURNISSEURS ============

/**
 * Interface pour un fournisseur de paiement
 */
export interface PaymentProvider {
    id: string
    name: string
    code: string
    type: PAYMENT_METHOD_TYPE

    // Informations
    description?: string
    website?: string
    logo: string
    color?: string

    // Statut
    isActive: boolean
    maintenanceMode: boolean
    maintenanceMessage?: string

    // Couverture
    countries: string[]
    currencies: string[]

    // Caractéristiques
    features: string[]
    supportedOperations: string[]

    // Configuration
    config: Record<string, any>
    apiVersion?: string

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date
    lastHealthCheck?: Date

    // Statistiques
    uptime?: number
    responseTime?: number
    successRate?: number

    // Formatés
    formattedUptime?: string
    formattedResponseTime?: string
}

/**
 * Interface pour un fournisseur de paiement au Cameroun
 */
export interface CameroonPaymentProvider {
    id: string
    name: string
    code: string
    type: PAYMENT_METHOD_TYPE

    // Spécificités Cameroun
    localName?: string
    localDescription?: string

    // Logo et présentation
    logo: string
    color: string

    // Statut
    isActive: boolean
    isRecommended: boolean
    popularity: number // 1-5

    // Frais
    fees: PaymentMethodFees
    limits: PaymentMethodLimits

    // Caractéristiques
    features: string[]
    transactionTypes: string[]

    // Support
    customerSupport: {
        phone: string
        email: string
        hours: string
        languages: string[]
    }

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    supportedSince: Date
    lastUpdated: Date

    // Formatés
    formattedFees?: string
    formattedLimits?: string
    formattedSupportedSince?: string
}

// ============ STATISTIQUES ============

/**
 * Interface pour les statistiques d'utilisation des méthodes de paiement
 */
export interface PaymentMethodStats {
    // Totaux
    totalMethods: number
    activeMethods: number
    verifiedMethods: number
    defaultMethods: number

    // Par type
    byType: Record<PAYMENT_METHOD_TYPE, {
        count: number
        active: number
        verified: number
        usageCount: number
        successRate: number
    }>

    // Utilisation
    mostUsedMethod: PAYMENT_METHOD_TYPE
    leastUsedMethod: PAYMENT_METHOD_TYPE

    // Taux de succès
    overallSuccessRate: number
    successRateByType: Record<PAYMENT_METHOD_TYPE, number>

    // Préférences
    preferredMethod?: PAYMENT_METHOD_TYPE
    frequentlyUsed: Array<{
        type: PAYMENT_METHOD_TYPE
        name: string
        count: number
        lastUsed: Date
    }>

    // Évolution
    monthlyTrend: Array<{
        month: string
        methodsAdded: number
        methodsRemoved: number
        usageCount: number
        successRate: number
    }>

    // Formatés
    formattedMostUsedMethod?: string
    formattedLeastUsedMethod?: string
}

// ============ PRÉFÉRENCES ============

/**
 * Interface pour les préférences de paiement
 */
export interface PaymentPreferences {
    userId: string

    // Préférences générales
    preferredMethod?: PAYMENT_METHOD_TYPE
    preferredMethodId?: string
    autoSelectMethod: boolean

    // Restrictions
    blockedMethods: PAYMENT_METHOD_TYPE[]
    countryRestrictions: Record<string, PAYMENT_METHOD_TYPE[]>

    // Comportement
    rememberMethods: boolean
    saveNewMethods: boolean
    requireVerification: boolean

    // Notifications
    notifyOnMethodAdded: boolean
    notifyOnMethodExpired: boolean
    notifyOnMethodUsed: boolean

    // Métadonnées
    metadata?: Record<string, any>

    // Dates
    createdAt: Date
    updatedAt: Date

    // Formatés
    formattedCreatedAt?: string
    formattedUpdatedAt?: string
}

// ============ RAPPORTS ============

/**
 * Interface pour un rapport de méthode de paiement
 */
export interface PaymentMethodReport {
    period: {
        start: Date
        end: Date
    }

    // Résumé
    summary: {
        totalMethods: number
        activeMethods: number
        newMethodsAdded: number
        methodsRemoved: number
        verificationRate: number
    }

    // Détails
    details: {
        byType: Record<PAYMENT_METHOD_TYPE, {
            count: number
            active: number
            verified: number
            usage: number
            successRate: number
            failureRate: number
        }>
        byCountry: Record<string, {
            count: number
            preferredMethod: PAYMENT_METHOD_TYPE
            verificationRate: number
        }>
        byStatus: Record<PAYMENT_METHOD_STATUS, number>
    }

    // Tendance
    trends: {
        daily: Array<{ date: string; methodsAdded: number; methodsUsed: number }>
        weekly: Array<{ week: string; methodsAdded: number; methodsUsed: number }>
        monthly: Array<{ month: string; methodsAdded: number; methodsUsed: number }>
    }

    // Performance
    performance: {
        verificationSuccessRate: number
        averageVerificationTime: number
        methodActivationRate: number
        userSatisfaction?: number
    }

    // Formatés
    formattedTotalMethods?: string
    formattedActiveMethods?: string
    formattedVerificationRate?: string
}

// ============ TYPES D'EXPORT ============

/**
 * Interface pour l'export des méthodes de paiement
 */
export interface PaymentMethodExportOptions {
    format: 'csv' | 'excel' | 'pdf' | 'json'
    filters?: PaymentMethodFiltersDto
    columns?: string[]
    includeDetails?: boolean
    includeStatistics?: boolean
    language?: string
    currency?: string
}

// ============ TYPES UTILITAIRES ============

/**
 * Interface pour la validation d'une méthode de paiement
 */
export interface PaymentMethodValidation {
    isValid: boolean
    errors: string[]
    warnings: string[]
    suggestions: string[]

    // Détails
    cardValidation?: {
        cardType: CARD_TYPE
        isValidLuhn: boolean
        isExpired: boolean
        expiryMonthValid: boolean
        expiryYearValid: boolean
    }

    mobileMoneyValidation?: {
        provider: MOBILE_MONEY_PROVIDER
        isValidPhoneNumber: boolean
        isSupportedProvider: boolean
    }

    bankAccountValidation?: {
        isValidAccountNumber: boolean
        isValidSwiftCode?: boolean
        isValidIban?: boolean
    }

    // Recommandations
    recommendedAlternatives?: PaymentMethod[]
}

/**
 * Interface pour les méthodes de paiement suggérées
 */
export interface SuggestedPaymentMethod {
    method: PaymentMethod
    score: number // 0-100
    reasons: string[]
    isRecommended: boolean
    estimatedFees: number
    formattedEstimatedFees?: string
}

// ============ TYPES DE RÉPONSE ============

/**
 * Interface pour une réponse de méthode de paiement
 */
export interface PaymentMethodResponse {
    success: boolean
    data?: PaymentMethod
    error?: string
    message?: string
    validation?: PaymentMethodValidation
}

// ============ EXPORT DES TYPES ============

export type {
    // Méthodes de paiement
    PaymentMethod as IPaymentMethod,
    CreatePaymentMethodDto as ICreatePaymentMethodDto,
    UpdatePaymentMethodDto as IUpdatePaymentMethodDto,
    VerifyPaymentMethodDto as IVerifyPaymentMethodDto,
    PaymentMethodFiltersDto as IPaymentMethodFiltersDto,

    // Cartes
    CardDetails as ICardDetails,
    CreateCardDto as ICreateCardDto,
    UpdateCardDto as IUpdateCardDto,

    // Mobile Money
    MobileMoneyDetails as IMobileMoneyDetails,
    CreateMobileMoneyDto as ICreateMobileMoneyDto,
    MobileMoneyProvider as IMobileMoneyProvider,

    // Comptes bancaires
    BankAccountDetails as IBankAccountDetails,
    CreateBankAccountDto as ICreateBankAccountDto,

    // Portefeuilles numériques
    DigitalWalletDetails as IDigitalWalletDetails,
    CreateDigitalWalletDto as ICreateDigitalWalletDto,

    // Configuration
    PaymentMethodConfig as IPaymentMethodConfig,

    // Fournisseurs
    PaymentProvider as IPaymentProvider,
    CameroonPaymentProvider as ICameroonPaymentProvider,

    // Statistiques
    PaymentMethodStats as IPaymentMethodStats,

    // Préférences
    PaymentPreferences as IPaymentPreferences,

    // Rapports
    PaymentMethodReport as IPaymentMethodReport,

    // Export
    PaymentMethodExportOptions as IPaymentMethodExportOptions,

    // Utilitaires
    PaymentMethodValidation as IPaymentMethodValidation,
    SuggestedPaymentMethod as ISuggestedPaymentMethod,
    PaymentMethodResponse as IPaymentMethodResponse,

    // Structures de base
    PaymentMethodFees as IPaymentMethodFees,
    PaymentMethodLimits as IPaymentMethodLimits,
    SupportedCountry as ISupportedCountry
}