// @ts-nocheck
// constants/payment.constants.ts

/**
 * Constantes de paiement pour le système e-commerce Camerounais
 * Centralisation de toutes les constantes liées aux paiements
 */

// ==================== ENVIRONNEMENTS ====================
export const PAYMENT_ENVIRONMENTS = {
    SANDBOX: 'sandbox',
    PRODUCTION: 'production',
    STAGING: 'staging',
    DEVELOPMENT: 'development'
} as const;

export type PaymentEnvironment = typeof PAYMENT_ENVIRONMENTS[keyof typeof PAYMENT_ENVIRONMENTS];

// ==================== MÉTHODES DE PAIEMENT ====================
export const PAYMENT_METHODS = {
    // Mobile Money
    MTN_MOBILE_MONEY: 'MTN_MOBILE_MONEY',
    ORANGE_MONEY: 'ORANGE_MONEY',
    EXPRESS_UNION_MOBILE: 'EXPRESS_UNION_MOBILE',

    // Cartes bancaires
    VISA: 'VISA',
    MASTERCARD: 'MASTERCARD',
    AMEX: 'AMEX',

    // Virements bancaires
    BANK_TRANSFER: 'BANK_TRANSFER',
    WIRE_TRANSFER: 'WIRE_TRANSFER',

    // Plateformes de paiement
    CINETPAY: 'CINETPAY',
    YUP: 'YUP',
    PAYDUNYA: 'PAYDUNYA',
    NOTCHPAY: 'NOTCHPAY',
    FLUTTERWAVE: 'FLUTTERWAVE',
    STRIPE: 'STRIPE',

    // Autres
    CASH: 'CASH',
    CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
    CHECK: 'CHECK',
    WALLET: 'WALLET'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// ==================== STATUTS DE PAIEMENT ====================
export const PAYMENT_STATUS = {
    // Statuts initiaux
    PENDING: 'PENDING',
    INITIATED: 'INITIATED',
    PROCESSING: 'PROCESSING',

    // Statuts de succès
    SUCCESS: 'SUCCESS',
    COMPLETED: 'COMPLETED',
    SETTLED: 'SETTLED',

    // Statuts d'échec
    FAILED: 'FAILED',
    DECLINED: 'DECLINED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',

    // Statuts intermédiaires
    AUTHORIZED: 'AUTHORIZED',
    CAPTURED: 'CAPTURED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
    CHARGEBACK: 'CHARGEBACK',

    // Statuts spéciaux
    ON_HOLD: 'ON_HOLD',
    UNDER_REVIEW: 'UNDER_REVIEW',
    REQUIRES_ACTION: 'REQUIRES_ACTION'
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// ==================== STATUTS DE COMMANDE ====================
export const ORDER_STATUS = {
    // Statuts de commande
    DRAFT: 'DRAFT',
    PENDING_PAYMENT: 'PENDING_PAYMENT',
    PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
    PAYMENT_FAILED: 'PAYMENT_FAILED',

    // Après paiement
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    READY_FOR_SHIPMENT: 'READY_FOR_SHIPMENT',

    // Livraison
    SHIPPED: 'SHIPPED',
    IN_TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',

    // Finalisation
    DELIVERED: 'DELIVERED',
    COMPLETED: 'COMPLETED',

    // Annulations
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',

    // Problèmes
    ON_HOLD: 'ON_HOLD',
    RETURNED: 'RETURNED',
    DISPUTED: 'DISPUTED'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// ==================== DEVISES ====================
export const CURRENCIES = {
    XAF: 'XAF',
    XOF: 'XOF',
    EUR: 'EUR',
    USD: 'USD',
    GBP: 'GBP',
    JPY: 'JPY',
    CNY: 'CNY',
    CAD: 'CAD',
    AUD: 'AUD',
    CHF: 'CHF',
    GHS: 'GHS',
    NGN: 'NGN',
    KES: 'KES',
    ZAR: 'ZAR'
} as const;

export type Currency = typeof CURRENCIES[keyof typeof CURRENCIES];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    XAF: 'FCFA',
    XOF: 'CFA',
    EUR: '€',
    USD: '$',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    CAD: 'CA$',
    AUD: 'A$',
    CHF: 'CHF',
    GHS: 'GH₵',
    NGN: '₦',
    KES: 'KSh',
    ZAR: 'R'
};

export const CURRENCY_NAMES: Record<Currency, string> = {
    XAF: 'Franc CFA d\'Afrique centrale',
    XOF: 'Franc CFA d\'Afrique de l\'Ouest',
    EUR: 'Euro',
    USD: 'Dollar américain',
    GBP: 'Livre sterling',
    JPY: 'Yen japonais',
    CNY: 'Yuan chinois',
    CAD: 'Dollar canadien',
    AUD: 'Dollar australien',
    CHF: 'Franc suisse',
    GHS: 'Cedi ghanéen',
    NGN: 'Naira nigérian',
    KES: 'Shilling kényan',
    ZAR: 'Rand sud-africain'
};

// ==================== OPÉRATEURS CAMEROUNAIS ====================
export const CAMEROON_OPERATORS = {
    MTN: 'MTN',
    ORANGE: 'ORANGE',
    NEXTTEL: 'NEXTTEL',
    CAMTEL: 'CAMTEL'
} as const;

export type CameroonOperator = typeof CAMEROON_OPERATORS[keyof typeof CAMEROON_OPERATORS];

export const OPERATOR_PREFIXES: Record<CameroonOperator, string[]> = {
    MTN: ['6', '65', '66', '67', '68', '69'],
    ORANGE: ['7', '77', '78', '79'],
    NEXTTEL: ['62', '63'],
    CAMTEL: ['22', '23', '24', '233']
};

export const OPERATOR_NAMES: Record<CameroonOperator, string> = {
    MTN: 'MTN Cameroon',
    ORANGE: 'Orange Cameroon',
    NEXTTEL: 'Viettel Cameroon (Nexttel)',
    CAMTEL: 'Camtel Cameroon'
};

// ==================== CODES BANCAIRES CAMEROUNAIS ====================
export const BANK_CODES = {
    UBA: '10002',
    ECOBANK: '10005',
    BICEC: '10003',
    SCB: '10001',
    BGFI: '10004',
    CBC: '10006',
    NFC: '10007',
    CITI: '10008',
    SG: '10009',
    CORIS: '10010',
    AFIRLAND: '10011',
    ATLANTIC: '10012',
    COFINA: '10013',
    UBC: '10014',
    CREDIT_SAHEL: '10015'
} as const;

export const BANK_NAMES: Record<string, string> = {
    [BANK_CODES.UBA]: 'United Bank for Africa Cameroon',
    [BANK_CODES.ECOBANK]: 'Ecobank Cameroon',
    [BANK_CODES.BICEC]: 'BICEC Cameroon',
    [BANK_CODES.SCB]: 'Société Générale Cameroon',
    [BANK_CODES.BGFI]: 'BGFI Bank Cameroon',
    [BANK_CODES.CBC]: 'Commercial Bank of Cameroon',
    [BANK_CODES.NFC]: 'National Financial Credit Bank',
    [BANK_CODES.CITI]: 'Citibank Cameroon',
    [BANK_CODES.SG]: 'Standard Chartered Bank Cameroon',
    [BANK_CODES.CORIS]: 'Coris Bank Cameroon',
    [BANK_CODES.AFIRLAND]: 'Afriland First Bank',
    [BANK_CODES.ATLANTIC]: 'Banque Atlantique Cameroon',
    [BANK_CODES.COFINA]: 'COFINA Cameroon',
    [BANK_CODES.UBC]: 'UBC Cameroon',
    [BANK_CODES.CREDIT_SAHEL]: 'Credit du Sahel Cameroon'
};

// ==================== FRAIS DE TRANSACTION ====================
export const TRANSACTION_FEES = {
    // Frais Mobile Money (en XAF)
    MOBILE_MONEY_FEES: {
        MIN_FEE: 25,
        MAX_FEE: 2000,
        PERCENTAGE: 0.5,

        // Frais dégressifs par tranche (montant en XAF -> frais en XAF)
        TIERED_FEES: {
            5000: 25,      // ≤ 5,000 XAF
            25000: 100,    // ≤ 25,000 XAF
            50000: 200,    // ≤ 50,000 XAF
            100000: 300,   // ≤ 100,000 XAF
            150000: 400,   // ≤ 150,000 XAF
            300000: 500,   // ≤ 300,000 XAF
            500000: 1000,  // ≤ 500,000 XAF
            INFINITY: 2000 // > 500,000 XAF
        }
    },

    // Frais cartes bancaires
    CARD_FEES: {
        PERCENTAGE: 2.5,
        FIXED: 0,
        MIN_FEE: 100,
        MAX_FEE: 10000
    },

    // Frais virement bancaire
    BANK_TRANSFER_FEES: {
        PERCENTAGE: 0.1,
        FIXED: 500,
        MIN_FEE: 500,
        MAX_FEE: 5000
    },

    // Frais CinetPay
    CINETPAY_FEES: {
        PERCENTAGE: 1.0,
        FIXED: 50,
        MIN_FEE: 50,
        MAX_FEE: 5000
    },

    // TVA Camerounaise
    VAT_RATE: 19.25, // TVA Cameroun en pourcentage
    VAT_ON_FEES: true // La TVA s'applique-t-elle sur les frais?
};

// ==================== LIMITES DE TRANSACTION ====================
export const TRANSACTION_LIMITS = {
    // Mobile Money
    MOBILE_MONEY: {
        MIN_AMOUNT: 100,
        MAX_AMOUNT: 1000000,
        DAILY_LIMIT: 5000000,
        MONTHLY_LIMIT: 20000000,
        MAX_TRANSACTIONS_PER_DAY: 10
    },

    // Cartes bancaires
    CARD: {
        MIN_AMOUNT: 1000,
        MAX_AMOUNT: 5000000,
        DAILY_LIMIT: 10000000,
        MONTHLY_LIMIT: 50000000,
        MAX_TRANSACTIONS_PER_DAY: 20
    },

    // Virements bancaires
    BANK_TRANSFER: {
        MIN_AMOUNT: 1000,
        MAX_AMOUNT: 10000000,
        DAILY_LIMIT: 50000000,
        MONTHLY_LIMIT: 200000000
    }
};

// ==================== CODES D'ERREUR ====================
export const PAYMENT_ERROR_CODES = {
    // Erreurs générales
    VALIDATION_ERROR: 'PAYMENT_VALIDATION_ERROR',
    INVALID_PARAMETERS: 'INVALID_PARAMETERS',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // Erreurs de paiement
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAYMENT_DECLINED: 'PAYMENT_DECLINED',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
    EXPIRED_CARD: 'EXPIRED_CARD',
    INVALID_CARD: 'INVALID_CARD',
    TRANSACTION_LIMIT_EXCEEDED: 'TRANSACTION_LIMIT_EXCEEDED',
    DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',

    // Erreurs Mobile Money
    INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
    INVALID_OPERATOR: 'INVALID_OPERATOR',
    MOBILE_MONEY_UNAVAILABLE: 'MOBILE_MONEY_UNAVAILABLE',
    OTP_REQUIRED: 'OTP_REQUIRED',
    OTP_EXPIRED: 'OTP_EXPIRED',
    OTP_INVALID: 'OTP_INVALID',

    // Erreurs de réseau/API
    NETWORK_ERROR: 'NETWORK_ERROR',
    PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    API_ERROR: 'API_ERROR',

    // Erreurs de sécurité
    SECURITY_ERROR: 'SECURITY_ERROR',
    FRAUD_DETECTED: 'FRAUD_DETECTED',
    UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
    INVALID_SIGNATURE: 'INVALID_SIGNATURE',

    // Erreurs de traitement
    DUPLICATE_TRANSACTION: 'DUPLICATE_TRANSACTION',
    ALREADY_PROCESSED: 'ALREADY_PROCESSED',
    ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
    PAYMENT_NOT_FOUND: 'PAYMENT_NOT_FOUND',

    // Erreurs de configuration
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
    PROVIDER_NOT_CONFIGURED: 'PROVIDER_NOT_CONFIGURED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS'
} as const;

export type PaymentErrorCode = typeof PAYMENT_ERROR_CODES[keyof typeof PAYMENT_ERROR_CODES];

export const PAYMENT_ERROR_MESSAGES: Record<PaymentErrorCode, string> = {
    // Erreurs générales
    PAYMENT_VALIDATION_ERROR: 'Erreur de validation des données de paiement',
    INVALID_PARAMETERS: 'Paramètres de paiement invalides',
    MISSING_REQUIRED_FIELD: 'Champ obligatoire manquant',

    // Erreurs de paiement
    PAYMENT_FAILED: 'Le paiement a échoué',
    PAYMENT_DECLINED: 'Paiement refusé',
    INSUFFICIENT_FUNDS: 'Fonds insuffisants',
    EXPIRED_CARD: 'Carte expirée',
    INVALID_CARD: 'Numéro de carte invalide',
    TRANSACTION_LIMIT_EXCEEDED: 'Limite de transaction dépassée',
    DAILY_LIMIT_EXCEEDED: 'Limite quotidienne dépassée',

    // Erreurs Mobile Money
    INVALID_PHONE_NUMBER: 'Numéro de téléphone invalide',
    INVALID_OPERATOR: 'Opérateur mobile non supporté',
    MOBILE_MONEY_UNAVAILABLE: 'Service Mobile Money indisponible',
    OTP_REQUIRED: 'Code OTP requis',
    OTP_EXPIRED: 'Code OTP expiré',
    OTP_INVALID: 'Code OTP invalide',

    // Erreurs de réseau/API
    NETWORK_ERROR: 'Erreur réseau',
    PROVIDER_UNAVAILABLE: 'Fournisseur de paiement indisponible',
    TIMEOUT_ERROR: 'Délai d\'attente dépassé',
    API_ERROR: 'Erreur API du fournisseur',

    // Erreurs de sécurité
    SECURITY_ERROR: 'Erreur de sécurité',
    FRAUD_DETECTED: 'Activité suspecte détectée',
    UNAUTHORIZED_ACCESS: 'Accès non autorisé',
    INVALID_SIGNATURE: 'Signature invalide',

    // Erreurs de traitement
    DUPLICATE_TRANSACTION: 'Transaction dupliquée',
    ALREADY_PROCESSED: 'Paiement déjà traité',
    ORDER_NOT_FOUND: 'Commande non trouvée',
    PAYMENT_NOT_FOUND: 'Paiement non trouvé',

    // Erreurs de configuration
    CONFIGURATION_ERROR: 'Erreur de configuration',
    PROVIDER_NOT_CONFIGURED: 'Fournisseur non configuré',
    INVALID_CREDENTIALS: 'Identifiants invalides'
};

// ==================== CODES DE SUCCÈS ====================
export const PAYMENT_SUCCESS_CODES = {
    PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
    PAYMENT_AUTHORIZED: 'PAYMENT_AUTHORIZED',
    PAYMENT_CAPTURED: 'PAYMENT_CAPTURED',
    PAYMENT_REFUNDED: 'PAYMENT_REFUNDED',
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    PAYMENT_INITIATED: 'PAYMENT_INITIATED'
} as const;

// ==================== CODES DE RETOUR API ====================
export const API_RESPONSE_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
} as const;

// ==================== MESSAGES UTILISATEUR ====================
export const USER_MESSAGES = {
    PAYMENT: {
        SUCCESS: 'Paiement effectué avec succès',
        FAILED: 'Le paiement a échoué. Veuillez réessayer',
        PENDING: 'Paiement en attente de confirmation',
        PROCESSING: 'Paiement en cours de traitement',
        CANCELLED: 'Paiement annulé',
        REFUNDED: 'Paiement remboursé',

        // Mobile Money
        OTP_SENT: 'Code OTP envoyé à votre numéro',
        OTP_REQUIRED: 'Veuillez saisir le code OTP reçu par SMS',
        OTP_RESENT: 'Nouveau code OTP envoyé',

        // Instructions
        CHECK_PHONE: 'Vérifiez votre téléphone pour confirmer le paiement',
        CONFIRM_PAYMENT: 'Confirmez le paiement sur votre téléphone',
        WAIT_FOR_CONFIRMATION: 'Veuillez patienter pendant la confirmation',

        // Erreurs
        INVALID_PHONE: 'Numéro de téléphone invalide',
        OPERATOR_NOT_SUPPORTED: 'Opérateur non supporté',
        AMOUNT_TOO_SMALL: 'Montant trop faible',
        AMOUNT_TOO_LARGE: 'Montant trop élevé',
        DAILY_LIMIT_REACHED: 'Limite quotidienne atteinte',

        // Conseils
        TRY_AGAIN: 'Veuillez réessayer',
        CONTACT_SUPPORT: 'Contactez le support technique',
        CHECK_BALANCE: 'Vérifiez votre solde',
        USE_ANOTHER_METHOD: 'Utilisez une autre méthode de paiement'
    },

    ORDER: {
        CREATED: 'Commande créée avec succès',
        UPDATED: 'Commande mise à jour',
        CANCELLED: 'Commande annulée',
        CONFIRMED: 'Commande confirmée',
        PROCESSING: 'Commande en cours de traitement',
        SHIPPED: 'Commande expédiée',
        DELIVERED: 'Commande livrée',

        // Statuts
        STATUS_CHANGED: 'Statut de commande modifié',
        TRACKING_ADDED: 'Informations de suivi ajoutées',

        // Erreurs
        NOT_FOUND: 'Commande non trouvée',
        CANNOT_CANCEL: 'Impossible d\'annuler cette commande',
        CANNOT_UPDATE: 'Impossible de mettre à jour cette commande'
    }
} as const;

// ==================== EXPIRATIONS ====================
export const EXPIRATION_TIMES = {
    // En secondes
    PAYMENT_SESSION: 30 * 60,      // 30 minutes
    OTP_CODE: 5 * 60,             // 5 minutes
    PAYMENT_TOKEN: 15 * 60,       // 15 minutes
    CART_SESSION: 24 * 60 * 60,   // 24 heures
    ORDER_CONFIRMATION: 2 * 60 * 60, // 2 heures

    // En millisecondes
    API_TIMEOUT: 30000,           // 30 secondes
    PROVIDER_TIMEOUT: 45000,      // 45 secondes

    // En jours
    PAYMENT_RECORDS_RETENTION: 365, // 1 an
    ORDER_HISTORY_RETENTION: 730   // 2 ans
} as const;

// ==================== CONFIGURATIONS PAR DÉFAUT ====================
export const DEFAULT_CONFIG = {
    CURRENCY: CURRENCIES.XAF,
    LANGUAGE: 'fr',
    COUNTRY: 'CM',
    TIMEZONE: 'Africa/Douala',
    DATE_FORMAT: 'DD/MM/YYYY',
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm:ss',

    // Configuration paiement
    PAYMENT_METHOD: PAYMENT_METHODS.MTN_MOBILE_MONEY,
    AUTO_CAPTURE: true,
    ALLOW_RETRY: true,
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 5000, // 5 secondes

    // Configuration Mobile Money
    MOBILE_MONEY: {
        OTP_LENGTH: 6,
        OTP_CHARACTERS: '0123456789',
        MAX_OTP_ATTEMPTS: 3,
        OTP_RESEND_DELAY: 60 // secondes
    },

    // Configuration des notifications
    NOTIFICATIONS: {
        ENABLE_SMS: true,
        ENABLE_EMAIL: true,
        ENABLE_PUSH: false,
        CONFIRMATION_SMS: true,
        FAILURE_SMS: true
    }
} as const;

// ==================== RÉGIONS CAMEROUNAISES ====================
export const CAMEROON_REGIONS = {
    ADAMAWA: 'Adamaoua',
    CENTER: 'Centre',
    EAST: 'Est',
    FAR_NORTH: 'Extrême-Nord',
    LITTORAL: 'Littoral',
    NORTH: 'Nord',
    NORTHWEST: 'Nord-Ouest',
    WEST: 'Ouest',
    SOUTH: 'Sud',
    SOUTHWEST: 'Sud-Ouest'
} as const;

export type CameroonRegion = typeof CAMEROON_REGIONS[keyof typeof CAMEROON_REGIONS];

export const REGION_CITIES: Record<CameroonRegion, string[]> = {
    [CAMEROON_REGIONS.ADAMAWA]: ['Ngaoundéré', 'Meiganga', 'Tibati'],
    [CAMEROON_REGIONS.CENTER]: ['Yaoundé', 'Mbalmayo', 'Monatélé'],
    [CAMEROON_REGIONS.EAST]: ['Bertoua', 'Batouri', 'Abong-Mbang'],
    [CAMEROON_REGIONS.FAR_NORTH]: ['Maroua', 'Garoua', 'Kousséri'],
    [CAMEROON_REGIONS.LITTORAL]: ['Douala', 'Edéa', 'Nkongsamba'],
    [CAMEROON_REGIONS.NORTH]: ['Garoua', 'Poli', 'Rey Bouba'],
    [CAMEROON_REGIONS.NORTHWEST]: ['Bamenda', 'Kumbo', 'Ndop'],
    [CAMEROON_REGIONS.WEST]: ['Bafoussam', 'Dschang', 'Foumban'],
    [CAMEROON_REGIONS.SOUTH]: ['Ebolowa', 'Kribi', 'Sangmélima'],
    [CAMEROON_REGIONS.SOUTHWEST]: ['Buea', 'Limbe', 'Kumba']
};

// ==================== CODES POSTAUX ====================
export const POSTAL_CODES = {
    YAOUNDE: '00237',
    DOUALA: '00235',
    BAFOUSSAM: '00231',
    GAROUA: '00227',
    MAROUA: '00229',
    BAMENDA: '00233',
    KRIBI: '00238',
    EBOLOWA: '00239',
    NGAOUNDERE: '00226',
    BERTOUA: '00224'
} as const;

// ==================== TAUX DE CHANGE FIXES (approximatifs) ====================
export const EXCHANGE_RATES: Record<Currency, number> = {
    [CURRENCIES.XAF]: 1,
    [CURRENCIES.XOF]: 0.0165, // 1 XAF ≈ 0.0165 XOF
    [CURRENCIES.EUR]: 0.00152, // 1 XAF ≈ 0.00152 EUR
    [CURRENCIES.USD]: 0.00166, // 1 XAF ≈ 0.00166 USD
    [CURRENCIES.GBP]: 0.00131, // 1 XAF ≈ 0.00131 GBP
    [CURRENCIES.JPY]: 0.184,   // 1 XAF ≈ 0.184 JPY
    [CURRENCIES.CNY]: 0.0119,  // 1 XAF ≈ 0.0119 CNY
    [CURRENCIES.CAD]: 0.00224, // 1 XAF ≈ 0.00224 CAD
    [CURRENCIES.AUD]: 0.00252, // 1 XAF ≈ 0.00252 AUD
    [CURRENCIES.CHF]: 0.00143, // 1 XAF ≈ 0.00143 CHF
    [CURRENCIES.GHS]: 0.0201,  // 1 XAF ≈ 0.0201 GHS
    [CURRENCIES.NGN]: 2.52,    // 1 XAF ≈ 2.52 NGN
    [CURRENCIES.KES]: 0.265,   // 1 XAF ≈ 0.265 KES
    [CURRENCIES.ZAR]: 0.0314   // 1 XAF ≈ 0.0314 ZAR
};

// ==================== TYPES DE LIVRAISON ====================
export const DELIVERY_TYPES = {
    STANDARD: 'STANDARD',
    EXPRESS: 'EXPRESS',
    SAME_DAY: 'SAME_DAY',
    NEXT_DAY: 'NEXT_DAY',
    PICKUP: 'PICKUP',
    SCHEDULED: 'SCHEDULED'
} as const;

export type DeliveryType = typeof DELIVERY_TYPES[keyof typeof DELIVERY_TYPES];

export const DELIVERY_TIMES: Record<DeliveryType, { min: number; max: number }> = {
    [DELIVERY_TYPES.STANDARD]: { min: 3, max: 7 }, // jours
    [DELIVERY_TYPES.EXPRESS]: { min: 1, max: 3 },
    [DELIVERY_TYPES.SAME_DAY]: { min: 0, max: 1 },
    [DELIVERY_TYPES.NEXT_DAY]: { min: 1, max: 2 },
    [DELIVERY_TYPES.PICKUP]: { min: 0, max: 0 },
    [DELIVERY_TYPES.SCHEDULED]: { min: 0, max: 14 }
};

// ==================== CODES PROMOTIONNELS ====================
export const COUPON_TYPES = {
    PERCENTAGE: 'PERCENTAGE',
    FIXED_AMOUNT: 'FIXED_AMOUNT',
    FREE_SHIPPING: 'FREE_SHIPPING',
    BUY_X_GET_Y: 'BUY_X_GET_Y'
} as const;

export type CouponType = typeof COUPON_TYPES[keyof typeof COUPON_TYPES];

// ==================== SÉCURITÉ ====================
export const SECURITY = {
    // Longueurs minimales
    MIN_PASSWORD_LENGTH: 8,
    MIN_PIN_LENGTH: 4,
    MAX_PIN_LENGTH: 6,

    // Formats
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    PHONE_REGEX: /^(?:\+237|237)?[67]\d{8}$/,
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Tentatives
    MAX_LOGIN_ATTEMPTS: 5,
    MAX_PIN_ATTEMPTS: 3,
    LOCKOUT_TIME: 15 * 60, // 15 minutes en secondes

    // Tokens
    TOKEN_LENGTH: 32,
    REFRESH_TOKEN_LENGTH: 64
} as const;

// ==================== CODES DE SUIVI ====================
export const TRACKING_PREFIXES = {
    DHL: 'DHL',
    FEDEX: 'FDX',
    UPS: 'UPS',
    POST_CAMEROUN: 'PC',
    LOCAL_COURIER: 'LC',
    CUSTOM: 'CUST'
} as const;

// ==================== VALEURS PAR DÉFAUT ====================
export const DEFAULT_VALUES = {
    // Quantités
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 100,
    DEFAULT_QUANTITY: 1,

    // Taxes
    DEFAULT_TAX_RATE: TRANSACTION_FEES.VAT_RATE,

    // Frais de livraison
    DEFAULT_SHIPPING_FEE: 1500, // XAF
    FREE_SHIPPING_THRESHOLD: 20000, // XAF

    // Pagination
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,

    // Délais
    DEFAULT_PROCESSING_TIME: 24, // heures
    DEFAULT_DELIVERY_TIME: 72,   // heures

    // Retours
    RETURN_PERIOD: 14, // jours
    REFUND_PERIOD: 30  // jours
} as const;

// ==================== FONCTIONS UTILITAIRES ====================
/**
 * Vérifie si une méthode de paiement est de type Mobile Money
 */
export function isMobileMoney(method: PaymentMethod): boolean {
    return [
        PAYMENT_METHODS.MTN_MOBILE_MONEY,
        PAYMENT_METHODS.ORANGE_MONEY,
        PAYMENT_METHODS.EXPRESS_UNION_MOBILE
    ].includes(method);
}

/**
 * Vérifie si une méthode de paiement est une carte bancaire
 */
export function isCardPayment(method: PaymentMethod): boolean {
    return [
        PAYMENT_METHODS.VISA,
        PAYMENT_METHODS.MASTERCARD,
        PAYMENT_METHODS.AMEX
    ].includes(method);
}

/**
 * Vérifie si une méthode de paiement nécessite un numéro de téléphone
 */
export function requiresPhoneNumber(method: PaymentMethod): boolean {
    return isMobileMoney(method) || method === PAYMENT_METHODS.YUP;
}

/**
 * Obtient l'opérateur à partir d'un numéro de téléphone
 */
export function getOperatorFromPhone(phone: string): CameroonOperator | null {
    const cleanPhone = phone.replace(/\D/g, '');
    const localNumber = cleanPhone.startsWith('237') ? cleanPhone.substring(3) : cleanPhone;

    for (const [operator, prefixes] of Object.entries(OPERATOR_PREFIXES)) {
        for (const prefix of prefixes) {
            if (localNumber.startsWith(prefix)) {
                return operator as CameroonOperator;
            }
        }
    }

    return null;
}

/**
 * Formate un montant avec la devise
 */
export function formatAmount(amount: number, currency: Currency = CURRENCIES.XAF): string {
    const symbol = CURRENCY_SYMBOLS[currency];

    if (currency === CURRENCIES.XAF || currency === CURRENCIES.XOF) {
        // Pas de décimales pour XAF/XOF
        const formatted = Math.round(amount).toLocaleString('fr-FR');
        return `${formatted} ${symbol}`;
    } else {
        // Avec décimales pour les autres devises
        const formatted = amount.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return `${formatted} ${symbol}`;
    }
}

/**
 * Calcule les frais de transaction pour un montant et une méthode donnés
 */
export function calculateTransactionFees(
    amount: number,
    method: PaymentMethod
): { fees: number; vat: number; totalFees: number } {
    let fees = 0;

    if (isMobileMoney(method)) {
        // Frais Mobile Money dégressifs
        const tiers = TRANSACTION_FEES.MOBILE_MONEY_FEES.TIERED_FEES;

        for (const [limit, fee] of Object.entries(tiers)) {
            if (amount <= parseInt(limit) || limit === 'INFINITY') {
                fees = fee;
                break;
            }
        }
    } else if (method === PAYMENT_METHODS.CINETPAY) {
        fees = Math.max(
            TRANSACTION_FEES.CINETPAY_FEES.MIN_FEE,
            Math.min(
                TRANSACTION_FEES.CINETPAY_FEES.MAX_FEE,
                (amount * TRANSACTION_FEES.CINETPAY_FEES.PERCENTAGE) / 100 + TRANSACTION_FEES.CINETPAY_FEES.FIXED
            )
        );
    } else if (isCardPayment(method)) {
        fees = Math.max(
            TRANSACTION_FEES.CARD_FEES.MIN_FEE,
            Math.min(
                TRANSACTION_FEES.CARD_FEES.MAX_FEE,
                (amount * TRANSACTION_FEES.CARD_FEES.PERCENTAGE) / 100 + TRANSACTION_FEES.CARD_FEES.FIXED
            )
        );
    } else if (method === PAYMENT_METHODS.BANK_TRANSFER) {
        fees = Math.max(
            TRANSACTION_FEES.BANK_TRANSFER_FEES.MIN_FEE,
            Math.min(
                TRANSACTION_FEES.BANK_TRANSFER_FEES.MAX_FEE,
                (amount * TRANSACTION_FEES.BANK_TRANSFER_FEES.PERCENTAGE) / 100 + TRANSACTION_FEES.BANK_TRANSFER_FEES.FIXED
            )
        );
    }

    // Calcul de la TVA
    const vat = TRANSACTION_FEES.VAT_ON_FEES ? (fees * TRANSACTION_FEES.VAT_RATE) / 100 : 0;
    const totalFees = fees + vat;

    return {
        fees: Math.round(fees),
        vat: Math.round(vat),
        totalFees: Math.round(totalFees)
    };
}

/**
 * Vérifie si un montant est dans les limites pour une méthode de paiement
 */
export function isAmountWithinLimits(amount: number, method: PaymentMethod): boolean {
    if (isMobileMoney(method)) {
        return amount >= TRANSACTION_LIMITS.MOBILE_MONEY.MIN_AMOUNT &&
            amount <= TRANSACTION_LIMITS.MOBILE_MONEY.MAX_AMOUNT;
    }

    if (isCardPayment(method)) {
        return amount >= TRANSACTION_LIMITS.CARD.MIN_AMOUNT &&
            amount <= TRANSACTION_LIMITS.CARD.MAX_AMOUNT;
    }

    if (method === PAYMENT_METHODS.BANK_TRANSFER) {
        return amount >= TRANSACTION_LIMITS.BANK_TRANSFER.MIN_AMOUNT &&
            amount <= TRANSACTION_LIMITS.BANK_TRANSFER.MAX_AMOUNT;
    }

    return true;
}

/**
 * Obtient le message d'erreur correspondant au code
 */
export function getPaymentErrorMessage(code: PaymentErrorCode): string {
    return PAYMENT_ERROR_MESSAGES[code] || 'Erreur de paiement inconnue';
}

/**
 * Convertit un montant d'une devise à une autre
 */
export function convertCurrency(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
): number {
    if (fromCurrency === toCurrency) return amount;

    // Convertir d'abord en XAF (notre devise de référence)
    const amountInXAF = amount / EXCHANGE_RATES[fromCurrency];
    // Puis convertir vers la devise cible
    return amountInXAF * EXCHANGE_RATES[toCurrency];
}

/**
 * Génère un code de transaction unique
 */
export function generateTransactionCode(prefix: string = 'TXN'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${random.toString().padStart(4, '0')}`;
}

/**
 * Valide un numéro de téléphone camerounais
 */
export function validateCameroonPhone(phone: string): boolean {
    const regex = SECURITY.PHONE_REGEX;
    return regex.test(phone);
}

// ==================== EXPORT DES CONSTANTES ====================
export default {
    // Constantes
    PAYMENT_ENVIRONMENTS,
    PAYMENT_METHODS,
    PAYMENT_STATUS,
    ORDER_STATUS,
    CURRENCIES,
    CURRENCY_SYMBOLS,
    CURRENCY_NAMES,
    CAMEROON_OPERATORS,
    OPERATOR_PREFIXES,
    OPERATOR_NAMES,
    BANK_CODES,
    BANK_NAMES,
    TRANSACTION_FEES,
    TRANSACTION_LIMITS,
    PAYMENT_ERROR_CODES,
    PAYMENT_ERROR_MESSAGES,
    PAYMENT_SUCCESS_CODES,
    API_RESPONSE_CODES,
    USER_MESSAGES,
    EXPIRATION_TIMES,
    DEFAULT_CONFIG,
    CAMEROON_REGIONS,
    REGION_CITIES,
    POSTAL_CODES,
    EXCHANGE_RATES,
    DELIVERY_TYPES,
    DELIVERY_TIMES,
    COUPON_TYPES,
    SECURITY,
    TRACKING_PREFIXES,
    DEFAULT_VALUES,

    // Fonctions utilitaires
    isMobileMoney,
    isCardPayment,
    requiresPhoneNumber,
    getOperatorFromPhone,
    formatAmount,
    calculateTransactionFees,
    isAmountWithinLimits,
    getPaymentErrorMessage,
    convertCurrency,
    generateTransactionCode,
    validateCameroonPhone
};

// ==================== TYPES ====================
// Ré-exporter les types pour une utilisation facile
export type {
    PaymentEnvironment,
    PaymentMethod,
    PaymentStatus,
    OrderStatus,
    Currency,
    CameroonOperator,
    PaymentErrorCode,
    CameroonRegion,
    DeliveryType,
    CouponType
};