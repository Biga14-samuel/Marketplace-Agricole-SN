// @ts-nocheck
// constants/invoice.constants.ts

/**
 * Constantes de facturation pour le système e-commerce Camerounais
 * Centralisation de toutes les constantes liées aux factures
 */

// ==================== TYPES DE FACTURES ====================
export const INVOICE_TYPES = {
    STANDARD: 'STANDARD',
    PROFORMA: 'PROFORMA',
    COMMERCIAL: 'COMMERCIAL',
    SIMPLIFIED: 'SIMPLIFIED',
    RECURRENT: 'RECURRENT',
    CREDIT_NOTE: 'CREDIT_NOTE',
    DEBIT_NOTE: 'DEBIT_NOTE',
    CORRECTION: 'CORRECTION'
} as const;

export type InvoiceType = typeof INVOICE_TYPES[keyof typeof INVOICE_TYPES];

// ==================== STATUTS DE FACTURE ====================
export const INVOICE_STATUS = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    SENT: 'SENT',
    VIEWED: 'VIEWED',
    PARTIALLY_PAID: 'PARTIALLY_PAID',
    PAID: 'PAID',
    OVERDUE: 'OVERDUE',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    DISPUTED: 'DISPUTED',
    ARCHIVED: 'ARCHIVED'
} as const;

export type InvoiceStatus = typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS];

// ==================== MÉTHODES DE PAIEMENT FACTURE ====================
export const INVOICE_PAYMENT_METHODS = {
    CASH: 'CASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CHECK: 'CHECK',
    CREDIT_CARD: 'CREDIT_CARD',
    MOBILE_MONEY: 'MOBILE_MONEY',
    ONLINE_PAYMENT: 'ONLINE_PAYMENT',
    DIRECT_DEBIT: 'DIRECT_DEBIT',
    PAYMENT_PLAN: 'PAYMENT_PLAN',
    OTHER: 'OTHER'
} as const;

export type InvoicePaymentMethod = typeof INVOICE_PAYMENT_METHODS[keyof typeof INVOICE_PAYMENT_METHODS];

// ==================== TAUX DE TVA CAMEROUNAIS ====================
export const VAT_RATES = {
    STANDARD: 19.25,    // Taux normal au Cameroun (19.25%)
    REDUCED: 9.75,      // Taux réduit (hôtellerie, restauration)
    SUPER_REDUCED: 5.5, // Taux super réduit (produits de première nécessité)
    ZERO: 0,            // Taux zéro (exportations, certains services)
    EXEMPT: -1          // Exonéré (hors champ de la TVA)
} as const;

export type VatRate = typeof VAT_RATES[keyof typeof VAT_RATES];

// ==================== CATÉGORIES DE PRODUITS/SERVICES ====================
export const PRODUCT_CATEGORIES = {
    // Alimentation
    FOOD: 'FOOD',
    BEVERAGES: 'BEVERAGES',
    FRUITS_VEGETABLES: 'FRUITS_VEGETABLES',

    // Technologie
    ELECTRONICS: 'ELECTRONICS',
    COMPUTERS: 'COMPUTERS',
    MOBILE_PHONES: 'MOBILE_PHONES',

    // Mode
    CLOTHING: 'CLOTHING',
    SHOES: 'SHOES',
    ACCESSORIES: 'ACCESSORIES',

    // Maison
    FURNITURE: 'FURNITURE',
    DECORATION: 'DECORATION',
    APPLIANCES: 'APPLIANCES',

    // Services
    CONSULTING: 'CONSULTING',
    MAINTENANCE: 'MAINTENANCE',
    TRANSPORT: 'TRANSPORT',

    // Autre
    OTHER: 'OTHER'
} as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];

// ==================== UNITÉS DE MESURE ====================
export const MEASUREMENT_UNITS = {
    PIECE: 'PIECE',
    KILOGRAM: 'KILOGRAM',
    GRAM: 'GRAM',
    LITER: 'LITER',
    METER: 'METER',
    SQUARE_METER: 'SQUARE_METER',
    CUBIC_METER: 'CUBIC_METER',
    HOUR: 'HOUR',
    DAY: 'DAY',
    MONTH: 'MONTH',
    UNIT: 'UNIT',
    PACK: 'PACK',
    DOZEN: 'DOZEN'
} as const;

export type MeasurementUnit = typeof MEASUREMENT_UNITS[keyof typeof MEASUREMENT_UNITS];

export const UNIT_LABELS: Record<MeasurementUnit, string> = {
    PIECE: 'Pièce',
    KILOGRAM: 'Kg',
    GRAM: 'g',
    LITER: 'L',
    METER: 'm',
    SQUARE_METER: 'm²',
    CUBIC_METER: 'm³',
    HOUR: 'Heure',
    DAY: 'Jour',
    MONTH: 'Mois',
    UNIT: 'Unité',
    PACK: 'Pack',
    DOZEN: 'Douzaine'
};

// ==================== FORMATS DE NUMÉROTATION ====================
export const INVOICE_NUMBER_FORMATS = {
    // Année + Mois + Numéro séquentiel
    YEAR_MONTH_SEQUENCE: 'YYYY/MM/####',

    // Client + Année + Numéro
    CLIENT_YEAR_SEQUENCE: 'CLIENT/YYYY/####',

    // Type + Année + Mois + Numéro
    TYPE_YEAR_MONTH_SEQUENCE: 'TYPE/YYYY/MM/####',

    // Simple séquentiel
    SIMPLE_SEQUENCE: '#######',

    // Code projet + Numéro
    PROJECT_SEQUENCE: 'PROJECT/####'
} as const;

export type InvoiceNumberFormat = typeof INVOICE_NUMBER_FORMATS[keyof typeof INVOICE_NUMBER_FORMATS];

// ==================== DÉLAIS DE PAIEMENT ====================
export const PAYMENT_TERMS = {
    IMMEDIATE: 0,         // Paiement immédiat
    NET_7: 7,            // Net 7 jours
    NET_15: 15,          // Net 15 jours
    NET_30: 30,          // Net 30 jours (standard)
    NET_45: 45,          // Net 45 jours
    NET_60: 60,          // Net 60 jours
    END_OF_MONTH: -1,    // Fin de mois
    ON_DELIVERY: -2,     // À la livraison
    ON_RECEIPT: -3       // À réception
} as const;

export type PaymentTerm = typeof PAYMENT_TERMS[keyof typeof PAYMENT_TERMS];

export const PAYMENT_TERM_LABELS: Record<PaymentTerm, string> = {
    [PAYMENT_TERMS.IMMEDIATE]: 'Paiement immédiat',
    [PAYMENT_TERMS.NET_7]: 'Net 7 jours',
    [PAYMENT_TERMS.NET_15]: 'Net 15 jours',
    [PAYMENT_TERMS.NET_30]: 'Net 30 jours',
    [PAYMENT_TERMS.NET_45]: 'Net 45 jours',
    [PAYMENT_TERMS.NET_60]: 'Net 60 jours',
    [PAYMENT_TERMS.END_OF_MONTH]: 'Fin de mois',
    [PAYMENT_TERMS.ON_DELIVERY]: 'À la livraison',
    [PAYMENT_TERMS.ON_RECEIPT]: 'À réception'
};

// ==================== PÉNALITÉS DE RETARD ====================
export const LATE_PAYMENT_PENALTIES = {
    // Taux d'intérêt légal au Cameroun
    LEGAL_INTEREST_RATE: 1.5, // 1.5% par mois

    // Frais de recouvrement forfaitaires
    RECOVERY_FEE_FIXED: 5000, // 5,000 XAF
    RECOVERY_FEE_PERCENTAGE: 10, // 10% du montant

    // Taux de pénalité recommandé
    RECOMMENDED_PENALTY_RATE: 0.1, // 10% du montant

    // Délai de grâce (en jours)
    GRACE_PERIOD: 7
} as const;

// ==================== MENTIONS LÉGALES OBLIGATOIRES ====================
export const LEGAL_DISCLAIMERS = {
    // Mention TVA
    VAT_DISCLAIMER: 'TVA non applicable, article 293 B du CGI',

    // Mention exonération
    EXEMPTION_DISCLAIMER: 'Exonération de TVA selon la réglementation en vigueur',

    // Mention retard de paiement
    LATE_PAYMENT_DISCLAIMER: 'En cas de retard de paiement, des pénalités seront appliquées conformément à la loi',

    // Mention escompte
    DISCOUNT_DISCLAIMER: 'Escompte pour paiement anticipé non applicable',

    // Mention retention
    RETENTION_DISCLAIMER: 'Rétention de garantie non applicable',

    // Mentions générales
    GENERAL_TERMS: `
    Conditions générales de vente :
    1. Les produits vendus sont conformes à la description.
    2. Tout litige sera soumis aux tribunaux compétents de [VILLE].
    3. Les retours sont acceptés sous 14 jours suivant la réception.
    4. La propriété des produits est transférée au moment du paiement intégral.
  `,

    // Confidentialité
    CONFIDENTIALITY: 'Cette facture est confidentielle et destinée uniquement au destinataire.',

    // Signature électronique
    ELECTRONIC_SIGNATURE: 'Facture émise électroniquement, valable sans signature manuscrite.'
} as const;

// ==================== CODES FISCALITÉ CAMEROUNAISE ====================
export const TAX_CODES = {
    // Code Général des Impôts (CGI) Cameroun
    VAT_CODE: '293',
    WITHHOLDING_TAX_CODE: '114',
    BUSINESS_TAX_CODE: '115',

    // Régimes fiscaux
    SIMPLIFIED_TAX_SYSTEM: 'Régime Simplifié',
    REAL_TAX_SYSTEM: 'Régime Réel',
    LIBERAL_PROFESSIONS: 'Professions Libérales',

    // Codes activité
    ACTIVITY_CODES: {
        COMMERCE: '61',
        SERVICES: '62',
        INDUSTRY: '63',
        AGRICULTURE: '64',
        TRANSPORT: '65'
    }
} as const;

// ==================== INFORMATIONS ENTREPRISE PAR DÉFAUT ====================
export const DEFAULT_COMPANY_INFO = {
    // Informations obligatoires pour les factures au Cameroun
    NAME: 'VOTRE ENTREPRISE SARL',
    LEGAL_FORM: 'Société à Responsabilité Limitée',
    CAPITAL: '1 000 000 FCFA',
    TRADE_REGISTER: 'RC/YAOUNDE/2023/B/12345',
    TAX_ID: 'M123456789',
    VAT_NUMBER: 'TVAN123456789',

    // Contacts
    ADDRESS: '123 Rue du Commerce, Yaoundé, Cameroun',
    PHONE: '+237 677 123 456',
    EMAIL: 'facturation@entreprise.cm',
    WEBSITE: 'www.entreprise.cm',

    // Coordonnées bancaires
    BANK_NAME: 'United Bank for Africa Cameroon',
    BANK_ACCOUNT: '12345678901',
    BANK_CODE: '10002',
    IBAN: 'CM21100020012345678901234',
    SWIFT_CODE: 'UNAFCMCX',

    // Informations légales supplémentaires
    LEGAL_REPRESENTATIVE: 'Representant legal',
    COMMERCIAL_REGISTER: 'N° 2023/12345',
    INSURANCE_POLICY: 'POLICE123456'
} as const;

// ==================== MESSAGES DE FACTURATION ====================
export const INVOICE_MESSAGES = {
    // En-têtes
    TITLE: 'FACTURE',
    PROFORMA_TITLE: 'FACTURE PROFORMA',
    COMMERCIAL_TITLE: 'FACTURE COMMERCIALE',
    CREDIT_NOTE_TITLE: 'AVOIR',

    // Labels
    INVOICE_NUMBER: 'Numéro de facture',
    INVOICE_DATE: 'Date de facture',
    DUE_DATE: 'Date d\'échéance',
    ORDER_NUMBER: 'Numéro de commande',
    CUSTOMER_REF: 'Référence client',
    PAYMENT_TERMS: 'Conditions de paiement',
    PAYMENT_METHOD: 'Mode de paiement',

    // Tableau articles
    DESCRIPTION: 'Description',
    QUANTITY: 'Quantité',
    UNIT_PRICE: 'Prix unitaire HT',
    DISCOUNT: 'Remise',
    VAT_RATE: 'Taux TVA',
    VAT_AMOUNT: 'Montant TVA',
    LINE_TOTAL: 'Total HT',

    // Totaux
    SUBTOTAL: 'Sous-total HT',
    TOTAL_EXCLUDING_VAT: 'Total HT',
    TOTAL_VAT: 'Total TVA',
    TOTAL_INCLUDING_VAT: 'Total TTC',
    ADVANCE_PAYMENT: 'Acompte versé',
    AMOUNT_DUE: 'Montant à payer',
    AMOUNT_PAID: 'Montant payé',
    BALANCE_DUE: 'Solde à payer',

    // Statuts
    STATUS_PAID: 'PAYÉ',
    STATUS_PENDING: 'EN ATTENTE',
    STATUS_OVERDUE: 'EN RETARD',
    STATUS_CANCELLED: 'ANNULEE',

    // Instructions
    PAYMENT_INSTRUCTIONS: 'Instructions de paiement',
    BANK_TRANSFER_INFO: 'Veuillez effectuer le virement aux coordonnées ci-dessus',
    REFERENCE_INFO: 'Mentionnez le numéro de facture dans l\'objet du virement',
    THANK_YOU: 'Merci pour votre confiance !',

    // Pied de page
    FOOTER: `
    Facture émise électroniquement - Validité légale conforme à l'article 289-V du CGI
    Pour toute réclamation : facturation@entreprise.cm
    Délai de paiement : 30 jours nets
  `
} as const;

// ==================== CONFIGURATION PDF ====================
export const PDF_CONFIG = {
    // Format papier
    PAPER_SIZE: 'A4',
    ORIENTATION: 'portrait' as const,

    // Marges (en mm)
    MARGINS: {
        TOP: 20,
        BOTTOM: 20,
        LEFT: 15,
        RIGHT: 15
    },

    // Polices
    FONTS: {
        PRIMARY: 'Helvetica',
        SECONDARY: 'Times-Roman',
        BOLD: 'Helvetica-Bold'
    },

    // Tailles de police
    FONT_SIZES: {
        TITLE: 16,
        SUBTITLE: 14,
        HEADER: 12,
        BODY: 10,
        FOOTER: 8
    },

    // Couleurs (RGB)
    COLORS: {
        PRIMARY: [41, 128, 185],    // Bleu
        SECONDARY: [52, 152, 219],  // Bleu clair
        ACCENT: [231, 76, 60],      // Rouge
        SUCCESS: [46, 204, 113],    // Vert
        WARNING: [241, 196, 15],    // Jaune
        DARK: [44, 62, 80],         // Noir bleuté
        LIGHT: [236, 240, 241]      // Gris clair
    },

    // En-tête
    HEADER: {
        LOGO_WIDTH: 150,
        LOGO_HEIGHT: 50,
        SHOW_COMPANY_INFO: true,
        SHOW_CUSTOMER_INFO: true
    },

    // Pied de page
    FOOTER: {
        SHOW_PAGE_NUMBERS: true,
        SHOW_LEGAL_INFO: true,
        SHOW_PAYMENT_INFO: true
    }
} as const;

// ==================== PÉRIODES DE FACTURATION ====================
export const BILLING_PERIODS = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    BIWEEKLY: 'BIWEEKLY',
    MONTHLY: 'MONTHLY',
    QUARTERLY: 'QUARTERLY',
    SEMI_ANNUAL: 'SEMI_ANNUAL',
    ANNUAL: 'ANNUAL',
    CUSTOM: 'CUSTOM'
} as const;

export type BillingPeriod = typeof BILLING_PERIODS[keyof typeof BILLING_PERIODS];

// ==================== LANGAGES SUPPORTÉS ====================
export const SUPPORTED_LANGUAGES = {
    FRENCH: 'fr',
    ENGLISH: 'en',
    SPANISH: 'es'
} as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
    fr: 'Français',
    en: 'English',
    es: 'Español'
};

// ==================== DEVISES SUPPORTÉES ====================
export const SUPPORTED_CURRENCIES = {
    XAF: 'XAF'
} as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[keyof typeof SUPPORTED_CURRENCIES];

// ==================== MODÈLES DE FACTURE ====================
export const INVOICE_TEMPLATES = {
    STANDARD: 'STANDARD',
    MODERN: 'MODERN',
    MINIMALIST: 'MINIMALIST',
    PROFESSIONAL: 'PROFESSIONAL',
    COLORFUL: 'COLORFUL',
    BORDERED: 'BORDERED'
} as const;

export type InvoiceTemplate = typeof INVOICE_TEMPLATES[keyof typeof INVOICE_TEMPLATES];

// ==================== RÈGLES DE RÉMISE ====================
export const DISCOUNT_RULES = {
    // Types de remise
    TYPES: {
        PERCENTAGE: 'PERCENTAGE',
        FIXED_AMOUNT: 'FIXED_AMOUNT',
        QUANTITY: 'QUANTITY'
    },

    // Seuils minimums
    MINIMUM_AMOUNT: 1000, // XAF
    MINIMUM_QUANTITY: 10,

    // Limites maximums
    MAX_PERCENTAGE: 50, // 50% maximum
    MAX_AMOUNT: 100000, // 100,000 XAF maximum
} as const;

// ==================== CONFIGURATION PAR DÉFAUT ====================
export const DEFAULT_INVOICE_CONFIG = {
    TYPE: INVOICE_TYPES.STANDARD,
    STATUS: INVOICE_STATUS.DRAFT,
    PAYMENT_TERM: PAYMENT_TERMS.NET_30,
    PAYMENT_METHOD: INVOICE_PAYMENT_METHODS.BANK_TRANSFER,
    VAT_RATE: VAT_RATES.STANDARD,
    CURRENCY: SUPPORTED_CURRENCIES.XAF,
    LANGUAGE: SUPPORTED_LANGUAGES.FRENCH,
    TEMPLATE: INVOICE_TEMPLATES.STANDARD,
    NUMBER_FORMAT: INVOICE_NUMBER_FORMATS.YEAR_MONTH_SEQUENCE,

    // Options
    AUTO_NUMBERING: true,
    AUTO_CALCULATE_TOTALS: true,
    INCLUDE_VAT: true,
    SHOW_DISCOUNTS: true,
    SHOW_PAYMENT_STATUS: true,
    SHOW_LOGO: true,
    SHOW_SIGNATURE: false,

    // Numérotation
    STARTING_NUMBER: 1,
    NUMBER_PREFIX: 'FAC',
    NUMBER_PADDING: 4,

    // Validité
    VALIDITY_DAYS: 30,
    PROFORMA_VALIDITY_DAYS: 15,

    // Notifications
    SEND_ON_CREATION: true,
    SEND_REMINDERS: true,
    REMINDER_DAYS_BEFORE_DUE: [7, 3, 1],

    // Archivage
    AUTO_ARCHIVE_DAYS: 365,
    KEEP_DRAFTS_DAYS: 30
} as const;

// ==================== CODES D'ERREUR FACTURATION ====================
export const INVOICE_ERROR_CODES = {
    VALIDATION_ERROR: 'INVOICE_VALIDATION_ERROR',
    INVALID_NUMBER_FORMAT: 'INVALID_NUMBER_FORMAT',
    DUPLICATE_INVOICE_NUMBER: 'DUPLICATE_INVOICE_NUMBER',
    INVALID_VAT_RATE: 'INVALID_VAT_RATE',
    INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_CURRENCY: 'INVALID_CURRENCY',
    CUSTOMER_NOT_FOUND: 'CUSTOMER_NOT_FOUND',
    PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
    TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
    PDF_GENERATION_FAILED: 'PDF_GENERATION_FAILED',
    EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
    INVOICE_ALREADY_PAID: 'INVOICE_ALREADY_PAID',
    INVOICE_ALREADY_CANCELLED: 'INVOICE_ALREADY_CANCELLED',
    PAYMENT_EXCEEDS_AMOUNT: 'PAYMENT_EXCEEDS_AMOUNT',
    INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD'
} as const;

export type InvoiceErrorCode = typeof INVOICE_ERROR_CODES[keyof typeof INVOICE_ERROR_CODES];

// ==================== FONCTIONS UTILITAIRES ====================
/**
 * Génère un numéro de facture selon un format
 */
export function generateInvoiceNumber(
    format: InvoiceNumberFormat,
    sequence: number,
    date: Date = new Date(),
    clientCode?: string,
    projectCode?: string
): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const paddedSequence = String(sequence).padStart(4, '0');

    let invoiceNumber = format;

    // Remplacer les placeholders
    invoiceNumber = invoiceNumber.replace('YYYY', String(year));
    invoiceNumber = invoiceNumber.replace('MM', month);
    invoiceNumber = invoiceNumber.replace('####', paddedSequence);

    if (clientCode) {
        invoiceNumber = invoiceNumber.replace('CLIENT', clientCode);
    }

    if (projectCode) {
        invoiceNumber = invoiceNumber.replace('PROJECT', projectCode);
    }

    return invoiceNumber;
}

/**
 * Calcule la date d'échéance basée sur les conditions de paiement
 */
export function calculateDueDate(
    invoiceDate: Date,
    paymentTerm: PaymentTerm
): Date {
    const dueDate = new Date(invoiceDate);

    if (paymentTerm === PAYMENT_TERMS.END_OF_MONTH) {
        // Fin du mois
        dueDate.setMonth(dueDate.getMonth() + 1);
        dueDate.setDate(0); // Dernier jour du mois
    } else if (paymentTerm === PAYMENT_TERMS.ON_DELIVERY || paymentTerm === PAYMENT_TERMS.ON_RECEIPT) {
        // Date d'échéance égale à la date de facture (paiement immédiat)
        // Pas de modification
    } else if (paymentTerm > 0) {
        // Ajouter le nombre de jours
        dueDate.setDate(dueDate.getDate() + paymentTerm);
    }

    return dueDate;
}

/**
 * Calcule le montant de la TVA
 */
export function calculateVAT(
    amountExcludingVAT: number,
    vatRate: VatRate
): number {
    if (vatRate === VAT_RATES.EXEMPT) {
        return 0;
    }

    return (amountExcludingVAT * vatRate) / 100;
}

/**
 * Calcule les pénalités de retard
 */
export function calculateLatePaymentPenalties(
    amountDue: number,
    dueDate: Date,
    paymentDate: Date
): {
    interest: number;
    fixedFee: number;
    totalPenalty: number;
} {
    const daysLate = Math.max(0, Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

    if (daysLate <= LATE_PAYMENT_PENALTIES.GRACE_PERIOD) {
        return { interest: 0, fixedFee: 0, totalPenalty: 0 };
    }

    // Intérêts de retard (1.5% par mois, calculés quotidiennement)
    const monthlyRate = LATE_PAYMENT_PENALTIES.LEGAL_INTEREST_RATE;
    const dailyRate = monthlyRate / 30 / 100;
    const interest = amountDue * dailyRate * daysLate;

    // Frais forfaitaires de recouvrement
    const fixedFee = LATE_PAYMENT_PENALTIES.RECOVERY_FEE_FIXED;
    const percentageFee = (amountDue * LATE_PAYMENT_PENALTIES.RECOVERY_FEE_PERCENTAGE) / 100;
    const recoveryFee = Math.max(fixedFee, percentageFee);

    const totalPenalty = interest + recoveryFee;

    return {
        interest: Math.round(interest),
        fixedFee: Math.round(recoveryFee),
        totalPenalty: Math.round(totalPenalty)
    };
}

/**
 * Formate un montant selon la devise
 */
export function formatCurrency(
    amount: number,
    currency: SupportedCurrency = SUPPORTED_CURRENCIES.XAF,
    locale: SupportedLanguage = SUPPORTED_LANGUAGES.FRENCH
): string {
    const localeMap = {
        [SUPPORTED_LANGUAGES.FRENCH]: 'fr-FR',
        [SUPPORTED_LANGUAGES.ENGLISH]: 'en-US',
        [SUPPORTED_LANGUAGES.SPANISH]: 'es-ES'
    };

    const currencySymbols = {
        [SUPPORTED_CURRENCIES.XAF]: 'FCFA'
    };

    const localeString = localeMap[locale] || 'fr-FR';
    const symbol = currencySymbols[currency];

    // XAF: pas de décimales
    return `${Math.round(amount).toLocaleString(localeString)} ${symbol}`;
}

/**
 * Vérifie si une facture est en retard
 */
export function isInvoiceOverdue(invoiceDate: Date, dueDate: Date, status: InvoiceStatus): boolean {
    if (status === INVOICE_STATUS.PAID || status === INVOICE_STATUS.CANCELLED) {
        return false;
    }

    const today = new Date();
    return dueDate < today;
}

/**
 * Calcule le solde restant d'une facture
 */
export function calculateInvoiceBalance(
    totalAmount: number,
    amountPaid: number,
    discounts: number = 0
): number {
    const amountDue = totalAmount - discounts;
    return Math.max(0, amountDue - amountPaid);
}

/**
 * Obtient le label d'une unité de mesure
 */
export function getUnitLabel(unit: MeasurementUnit): string {
    return UNIT_LABELS[unit] || unit;
}

/**
 * Obtient le label d'une condition de paiement
 */
export function getPaymentTermLabel(term: PaymentTerm): string {
    return PAYMENT_TERM_LABELS[term] || `${term} jours`;
}

/**
 * Valide un numéro de TVA camerounais
 */
export function validateCameroonVATNumber(vatNumber: string): boolean {
    // Format: TVAN123456789 (12 caractères, commence par TVAN suivi de 9 chiffres)
    const regex = /^TVAN\d{9}$/;
    return regex.test(vatNumber.toUpperCase());
}

/**
 * Valide un numéro de NIU (Numéro d'Identification Unique) camerounais
 */
export function validateNIUNumber(niu: string): boolean {
    // Format: M123456789 (M suivi de 9 chiffres)
    const regex = /^[Mm]\d{9}$/;
    return regex.test(niu);
}

/**
 * Génère une référence de paiement pour facture
 */
export function generatePaymentReference(invoiceNumber: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REF-${invoiceNumber.replace(/\//g, '-')}-${timestamp}-${random}`;
}

// ==================== EXPORT DES CONSTANTES ====================
export default {
    // Constantes
    INVOICE_TYPES,
    INVOICE_STATUS,
    INVOICE_PAYMENT_METHODS,
    VAT_RATES,
    PRODUCT_CATEGORIES,
    MEASUREMENT_UNITS,
    UNIT_LABELS,
    INVOICE_NUMBER_FORMATS,
    PAYMENT_TERMS,
    PAYMENT_TERM_LABELS,
    LATE_PAYMENT_PENALTIES,
    LEGAL_DISCLAIMERS,
    TAX_CODES,
    DEFAULT_COMPANY_INFO,
    INVOICE_MESSAGES,
    PDF_CONFIG,
    BILLING_PERIODS,
    SUPPORTED_LANGUAGES,
    LANGUAGE_LABELS,
    SUPPORTED_CURRENCIES,
    INVOICE_TEMPLATES,
    DISCOUNT_RULES,
    DEFAULT_INVOICE_CONFIG,
    INVOICE_ERROR_CODES,

    // Fonctions utilitaires
    generateInvoiceNumber,
    calculateDueDate,
    calculateVAT,
    calculateLatePaymentPenalties,
    formatCurrency,
    isInvoiceOverdue,
    calculateInvoiceBalance,
    getUnitLabel,
    getPaymentTermLabel,
    validateCameroonVATNumber,
    validateNIUNumber,
    generatePaymentReference
};

// ==================== TYPES ====================
// Ré-exporter les types pour une utilisation facile
export type {
    InvoiceType,
    InvoiceStatus,
    InvoicePaymentMethod,
    VatRate,
    ProductCategory,
    MeasurementUnit,
    InvoiceNumberFormat,
    PaymentTerm,
    BillingPeriod,
    SupportedLanguage,
    SupportedCurrency,
    InvoiceTemplate,
    InvoiceErrorCode
};
