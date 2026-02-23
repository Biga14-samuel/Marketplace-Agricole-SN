// @ts-nocheck
import { getErrorMessage } from '@/shared/utils/error-handler';
// paymentConfig.ts

/**
 * Configuration des paiements pour le Cameroun
 * Configuration centralisée pour tous les systèmes de paiement
 */

import { PaymentMethod } from '../utils/cameroonPaymentUtils';

export enum Environment {
    SANDBOX = 'sandbox',
    PRODUCTION = 'production',
    STAGING = 'staging',
    DEVELOPMENT = 'development'
}

export enum PaymentProvider {
    MTN = 'MTN',
    ORANGE = 'ORANGE',
    EXPRESS_UNION = 'EXPRESS_UNION',
    YUP = 'YUP',
    CINETPAY = 'CINETPAY',
    STRIPE = 'STRIPE',
    PAYPAL = 'PAYPAL',
    FLUTTERWAVE = 'FLUTTERWAVE',
    MANUAL = 'MANUAL'
}

export interface BasePaymentConfig {
    /** Environnement d'exécution */
    environment: Environment;
    /** Activer/désactiver le mode débogage */
    debug: boolean;
    /** Devise par défaut */
    defaultCurrency: string;
    /** Langue par défaut */
    defaultLanguage: string;
    /** Timezone par défaut */
    defaultTimezone: string;
    /** URL de callback par défaut */
    defaultCallbackUrl: string;
    /** URL de webhook par défaut */
    defaultWebhookUrl: string;
    /** Activer les logs détaillés */
    enableDetailedLogs: boolean;
    /** Durée de vie des sessions de paiement (en minutes) */
    sessionLifetime: number;
    /** Durée de vie des tokens (en minutes) */
    tokenLifetime: number;
}

export interface MobileMoneyConfig {
    /** Clé API fournie par l'opérateur */
    apiKey: string;
    /** Clé secrète API */
    apiSecret: string;
    /** Code marchand */
    merchantCode: string;
    /** Nom du marchand */
    merchantName: string;
    /** Numéro de téléphone du marchand */
    merchantPhone: string;
    /** Email du marchand */
    merchantEmail: string;
    /** Montant minimum de transaction */
    minAmount: number;
    /** Montant maximum de transaction */
    maxAmount: number;
    /** Frais par défaut (en pourcentage) */
    defaultFeesPercentage: number;
    /** Frais fixes par défaut */
    defaultFixedFees: number;
    /** Activer la validation OTP */
    enableOTPValidation: boolean;
    /** Longueur du code OTP */
    otpLength: number;
    /** Durée de validité OTP (en secondes) */
    otpLifetime: number;
    /** URL de callback spécifique */
    callbackUrl?: string;
    /** URL de webhook spécifique */
    webhookUrl?: string;
}

export interface BankTransferConfig {
    /** Nom de la banque */
    bankName: string;
    /** Code banque */
    bankCode: string;
    /** Numéro de compte */
    accountNumber: string;
    /** Nom du compte */
    accountName: string;
    /** Code agence */
    branchCode?: string;
    /** Code SWIFT */
    swiftCode?: string;
    /** IBAN */
    iban?: string;
    /** Adresse de la banque */
    bankAddress?: string;
    /** Instructions spéciales */
    specialInstructions?: string;
    /** Frais de transfert (en pourcentage) */
    transferFeesPercentage: number;
    /** Frais fixes de transfert */
    transferFixedFees: number;
    /** Délai de traitement (en heures) */
    processingDelayHours: number;
}

export interface CardPaymentConfig {
    /** Clé publique */
    publicKey: string;
    /** Clé secrète */
    secretKey: string;
    /** Identifiant du marchand */
    merchantId: string;
    /** URL de retour */
    returnUrl: string;
    /** URL d'annulation */
    cancelUrl: string;
    /** Devises acceptées */
    acceptedCurrencies: string[];
    /** Types de cartes acceptés */
    acceptedCardTypes: string[];
    /** Activer 3D Secure */
    enable3DSecure: boolean;
    /** Activer la sauvegarde des cartes */
    enableCardSaving: boolean;
    /** Frais de traitement carte (en pourcentage) */
    processingFeesPercentage: number;
    /** Frais fixes de traitement */
    processingFixedFees: number;
}

export interface PaymentGatewayConfig {
    /** Nom du fournisseur */
    provider: PaymentProvider;
    /** Activer/désactiver ce fournisseur */
    enabled: boolean;
    /** Priorité (plus bas = plus haute priorité) */
    priority: number;
    /** Configuration spécifique au fournisseur */
    config: Record<string, any>;
}

export interface FeesConfig {
    /** Méthode de paiement */
    method: PaymentMethod;
    /** Frais en pourcentage */
    percentage: number;
    /** Frais fixes */
    fixed: number;
    /** Frais minimum */
    minFees: number;
    /** Frais maximum */
    maxFees: number;
    /** Qui paie les frais ('customer' ou 'merchant') */
    feePayer: 'customer' | 'merchant';
    /** TVA applicable sur les frais (en pourcentage) */
    vatOnFees: number;
}

export interface LimitsConfig {
    /** Méthode de paiement */
    method: PaymentMethod;
    /** Montant minimum par transaction */
    minAmountPerTransaction: number;
    /** Montant maximum par transaction */
    maxAmountPerTransaction: number;
    /** Nombre maximum de transactions par jour */
    maxTransactionsPerDay: number;
    /** Montant maximum par jour */
    maxAmountPerDay: number;
    /** Nombre maximum de transactions par mois */
    maxTransactionsPerMonth: number;
    /** Montant maximum par mois */
    maxAmountPerMonth: number;
}

export interface SecurityConfig {
    /** Activer le chiffrement */
    enableEncryption: boolean;
    /** Algorithme de chiffrement */
    encryptionAlgorithm: string;
    /** Clé de chiffrement */
    encryptionKey: string;
    /** Activer les tokens JWT */
    enableJWT: boolean;
    /** Secret JWT */
    jwtSecret: string;
    /** Durée de vie JWT (en minutes) */
    jwtLifetime: number;
    /** Activer la validation IP */
    enableIPValidation: boolean;
    /** IPs autorisées */
    allowedIPs: string[];
    /** Activer la validation du referer */
    enableRefererValidation: boolean;
    /** Domaines autorisés */
    allowedDomains: string[];
    /** Activer la vérification de la signature */
    enableSignatureVerification: boolean;
}

export interface NotificationConfig {
    /** Activer les notifications SMS */
    enableSMS: boolean;
    /** Activer les notifications Email */
    enableEmail: boolean;
    /** Activer les notifications Push */
    enablePush: boolean;
    /** Activer les notifications WhatsApp */
    enableWhatsApp: boolean;
    /** Template SMS pour succès */
    smsSuccessTemplate: string;
    /** Template SMS pour échec */
    smsFailureTemplate: string;
    /** Template Email pour succès */
    emailSuccessTemplate: string;
    /** Template Email pour échec */
    emailFailureTemplate: string;
    /** Langues supportées */
    supportedLanguages: string[];
}

export interface ReconciliationConfig {
    /** Fréquence de rapprochement (en heures) */
    frequencyHours: number;
    /** Activer le rapprochement automatique */
    enableAutoReconciliation: boolean;
    /** Heure du rapprochement automatique (format HH:MM) */
    autoReconciliationTime: string;
    /** Tolérance de différence (en pourcentage) */
    tolerancePercentage: number;
    /** Activer les alertes de différence */
    enableDiscrepancyAlerts: boolean;
    /** Emails pour alertes */
    alertEmails: string[];
}

export interface PaymentConfig {
    /** Configuration de base */
    base: BasePaymentConfig;
    /** Configuration Mobile Money */
    mobileMoney: {
        [key in PaymentProvider.MTN | PaymentProvider.ORANGE | PaymentProvider.EXPRESS_UNION]?: MobileMoneyConfig;
    };
    /** Configuration virements bancaires */
    bankTransfer: BankTransferConfig[];
    /** Configuration cartes de crédit */
    cardPayments: CardPaymentConfig;
    /** Configuration des passerelles de paiement */
    paymentGateways: PaymentGatewayConfig[];
    /** Configuration des frais */
    fees: FeesConfig[];
    /** Configuration des limites */
    limits: LimitsConfig[];
    /** Configuration de sécurité */
    security: SecurityConfig;
    /** Configuration des notifications */
    notifications: NotificationConfig;
    /** Configuration du rapprochement */
    reconciliation: ReconciliationConfig;
}

/**
 * Configuration par défaut pour les paiements au Cameroun
 */
export const defaultPaymentConfig: PaymentConfig = {
    base: {
        environment: Environment.SANDBOX,
        debug: true,
        defaultCurrency: 'XAF',
        defaultLanguage: 'fr',
        defaultTimezone: 'Africa/Douala',
        defaultCallbackUrl: 'https://votredomaine.com/payment/callback',
        defaultWebhookUrl: 'https://votredomaine.com/api/payment/webhook',
        enableDetailedLogs: true,
        sessionLifetime: 30, // minutes
        tokenLifetime: 60, // minutes
    },

    mobileMoney: {
        [PaymentProvider.MTN]: {
            apiKey: 'your-mtn-api-key',
            apiSecret: 'your-mtn-api-secret',
            merchantCode: 'MTN_MERCHANT_CODE',
            merchantName: 'Votre Entreprise',
            merchantPhone: '237677123456',
            merchantEmail: 'merchant@example.com',
            minAmount: 100,
            maxAmount: 1000000,
            defaultFeesPercentage: 0.5,
            defaultFixedFees: 0,
            enableOTPValidation: true,
            otpLength: 6,
            otpLifetime: 300, // 5 minutes
            callbackUrl: 'https://votredomaine.com/payment/mtn/callback',
            webhookUrl: 'https://votredomaine.com/api/payment/mtn/webhook',
        },
        [PaymentProvider.ORANGE]: {
            apiKey: 'your-orange-api-key',
            apiSecret: 'your-orange-api-secret',
            merchantCode: 'ORANGE_MERCHANT_CODE',
            merchantName: 'Votre Entreprise',
            merchantPhone: '237677123456',
            merchantEmail: 'merchant@example.com',
            minAmount: 100,
            maxAmount: 500000,
            defaultFeesPercentage: 0.5,
            defaultFixedFees: 0,
            enableOTPValidation: true,
            otpLength: 6,
            otpLifetime: 300,
            callbackUrl: 'https://votredomaine.com/payment/orange/callback',
            webhookUrl: 'https://votredomaine.com/api/payment/orange/webhook',
        },
        [PaymentProvider.EXPRESS_UNION]: {
            apiKey: 'your-eu-api-key',
            apiSecret: 'your-eu-api-secret',
            merchantCode: 'EU_MERCHANT_CODE',
            merchantName: 'Votre Entreprise',
            merchantPhone: '237677123456',
            merchantEmail: 'merchant@example.com',
            minAmount: 100,
            maxAmount: 500000,
            defaultFeesPercentage: 0.4,
            defaultFixedFees: 0,
            enableOTPValidation: false,
            otpLength: 6,
            otpLifetime: 300,
            callbackUrl: 'https://votredomaine.com/payment/eu/callback',
            webhookUrl: 'https://votredomaine.com/api/payment/eu/webhook',
        },
    },

    bankTransfer: [
        {
            bankName: 'UBA Cameroon',
            bankCode: '10002',
            accountNumber: '12345678901',
            accountName: 'VOTRE ENTREPRISE SARL',
            branchCode: '01001',
            swiftCode: 'UNAFCMCX',
            iban: 'CM21100020012345678901234',
            bankAddress: 'Boulevard de la République, Yaoundé',
            specialInstructions: 'Mentionner le numéro de référence de paiement',
            transferFeesPercentage: 0.1,
            transferFixedFees: 500,
            processingDelayHours: 24,
        },
        {
            bankName: 'Ecobank Cameroon',
            bankCode: '10005',
            accountNumber: '98765432109',
            accountName: 'VOTRE ENTREPRISE SARL',
            branchCode: '02001',
            swiftCode: 'ECOCCMCX',
            iban: 'CM21100050098765432109876',
            bankAddress: 'Avenue Kennedy, Douala',
            specialInstructions: 'Envoyer le justificatif par email',
            transferFeesPercentage: 0.15,
            transferFixedFees: 750,
            processingDelayHours: 48,
        },
    ],

    cardPayments: {
        publicKey: 'pk_test_your_public_key',
        secretKey: 'sk_test_your_secret_key',
        merchantId: 'merchant_test_id',
        returnUrl: 'https://votredomaine.com/payment/success',
        cancelUrl: 'https://votredomaine.com/payment/cancel',
        acceptedCurrencies: ['XAF', 'EUR', 'USD'],
        acceptedCardTypes: ['VISA', 'MASTERCARD'],
        enable3DSecure: true,
        enableCardSaving: false,
        processingFeesPercentage: 2.5,
        processingFixedFees: 0,
    },

    paymentGateways: [
        {
            provider: PaymentProvider.CINETPAY,
            enabled: true,
            priority: 1,
            config: {
                apiKey: 'your-cinetpay-api-key',
                siteId: 'your-site-id',
                notifyUrl: 'https://votredomaine.com/api/cinetpay/notify',
                returnUrl: 'https://votredomaine.com/payment/return',
                currency: 'XAF',
                lang: 'fr',
            },
        },
        {
            provider: PaymentProvider.FLUTTERWAVE,
            enabled: false,
            priority: 2,
            config: {
                publicKey: 'FLWPUBK_TEST-your-key',
                secretKey: 'FLWSECK_TEST-your-secret',
                encryptionKey: 'FLWSECK_TEST-encryption-key',
                currency: 'XAF',
                country: 'CM',
            },
        },
        {
            provider: PaymentProvider.STRIPE,
            enabled: false,
            priority: 3,
            config: {
                publishableKey: 'pk_test_your_key',
                secretKey: 'sk_test_your_secret',
                webhookSecret: 'whsec_your_webhook_secret',
                currency: 'usd',
            },
        },
    ],

    fees: [
        {
            method: PaymentMethod.MTN_MOBILE_MONEY,
            percentage: 0.5,
            fixed: 0,
            minFees: 25,
            maxFees: 2000,
            feePayer: 'customer',
            vatOnFees: 19.25,
        },
        {
            method: PaymentMethod.ORANGE_MONEY,
            percentage: 0.5,
            fixed: 0,
            minFees: 25,
            maxFees: 1500,
            feePayer: 'customer',
            vatOnFees: 19.25,
        },
        {
            method: PaymentMethod.EXPRESS_UNION,
            percentage: 0.4,
            fixed: 100,
            minFees: 100,
            maxFees: 1000,
            feePayer: 'customer',
            vatOnFees: 19.25,
        },
        {
            method: PaymentMethod.CINETPAY,
            percentage: 1.0,
            fixed: 0,
            minFees: 50,
            maxFees: 5000,
            feePayer: 'merchant',
            vatOnFees: 19.25,
        },
        {
            method: PaymentMethod.CREDIT_CARD,
            percentage: 2.5,
            fixed: 0,
            minFees: 100,
            maxFees: 10000,
            feePayer: 'customer',
            vatOnFees: 19.25,
        },
        {
            method: PaymentMethod.BANK_TRANSFER,
            percentage: 0.1,
            fixed: 500,
            minFees: 500,
            maxFees: 5000,
            feePayer: 'customer',
            vatOnFees: 19.25,
        },
    ],

    limits: [
        {
            method: PaymentMethod.MTN_MOBILE_MONEY,
            minAmountPerTransaction: 50,
            maxAmountPerTransaction: 1000000,
            maxTransactionsPerDay: 10,
            maxAmountPerDay: 5000000,
            maxTransactionsPerMonth: 100,
            maxAmountPerMonth: 20000000,
        },
        {
            method: PaymentMethod.ORANGE_MONEY,
            minAmountPerTransaction: 100,
            maxAmountPerTransaction: 500000,
            maxTransactionsPerDay: 5,
            maxAmountPerDay: 2000000,
            maxTransactionsPerMonth: 50,
            maxAmountPerMonth: 10000000,
        },
        {
            method: PaymentMethod.CREDIT_CARD,
            minAmountPerTransaction: 1000,
            maxAmountPerTransaction: 5000000,
            maxTransactionsPerDay: 20,
            maxAmountPerDay: 10000000,
            maxTransactionsPerMonth: 200,
            maxAmountPerMonth: 50000000,
        },
    ],

    security: {
        enableEncryption: true,
        encryptionAlgorithm: 'aes-256-cbc',
        encryptionKey: 'your-32-character-encryption-key-here',
        enableJWT: true,
        jwtSecret: 'your-jwt-secret-key-minimum-32-chars',
        jwtLifetime: 60,
        enableIPValidation: true,
        allowedIPs: ['127.0.0.1', '192.168.1.0/24'],
        enableRefererValidation: true,
        allowedDomains: ['votredomaine.com', 'api.votredomaine.com'],
        enableSignatureVerification: true,
    },

    notifications: {
        enableSMS: true,
        enableEmail: true,
        enablePush: false,
        enableWhatsApp: false,
        smsSuccessTemplate: 'Paiement de {amount} réussi. Ref: {reference}. Merci!',
        smsFailureTemplate: 'Paiement de {amount} échoué. Réessayez ou contactez le support.',
        emailSuccessTemplate: 'payment-success.html',
        emailFailureTemplate: 'payment-failure.html',
        supportedLanguages: ['fr', 'en'],
    },

    reconciliation: {
        frequencyHours: 24,
        enableAutoReconciliation: true,
        autoReconciliationTime: '02:00',
        tolerancePercentage: 0.01,
        enableDiscrepancyAlerts: true,
        alertEmails: ['comptable@example.com', 'admin@example.com'],
    },
};

/**
 * Classe de gestion de la configuration des paiements
 */
export class PaymentConfigManager {
    private config: PaymentConfig;
    private configPath: string;

    constructor(config?: PaymentConfig, configPath?: string) {
        this.config = config || defaultPaymentConfig;
        this.configPath = configPath || './config/payment.json';
    }

    /**
     * Charge la configuration depuis le localStorage
     */
    async loadFromStorage(): Promise<void> {
        try {
            const data = localStorage.getItem('paymentConfig');
            if (data) {
                this.config = JSON.parse(data);
            }
        } catch (error) {
            console.warn('Impossible de charger la configuration depuis le localStorage, utilisation de la configuration par défaut');
        }
    }

    /**
     * Sauvegarde la configuration dans le localStorage
     */
    async saveToStorage(): Promise<void> {
        try {
            localStorage.setItem('paymentConfig', JSON.stringify(this.config));
        } catch (error) {
            console.error(`Erreur lors de la sauvegarde de la configuration: ${error}`);
        }
    }

    /**
     * Obtient la configuration complète
     */
    getConfig(): PaymentConfig {
        return this.config;
    }

    /**
     * Met à jour la configuration
     */
    updateConfig(newConfig: Partial<PaymentConfig>): void {
        this.config = {
            ...this.config,
            ...newConfig,
            base: { ...this.config.base, ...newConfig.base },
            security: { ...this.config.security, ...newConfig.security },
            notifications: { ...this.config.notifications, ...newConfig.notifications },
            reconciliation: { ...this.config.reconciliation, ...newConfig.reconciliation },
        };
    }

    /**
     * Obtient la configuration pour un environnement spécifique
     */
    getEnvironmentConfig(env?: Environment): PaymentConfig {
        const targetEnv = env || this.config.base.environment;

        // Cloner la configuration
        const envConfig = JSON.parse(JSON.stringify(this.config));

        // Modifier les URLs selon l'environnement
        if (targetEnv === Environment.SANDBOX || targetEnv === Environment.DEVELOPMENT) {
            envConfig.base.defaultCallbackUrl = 'http://localhost:3000/payment/callback';
            envConfig.base.defaultWebhookUrl = 'http://localhost:3000/api/payment/webhook';

            // Désactiver certaines validations en développement
            envConfig.security.enableIPValidation = false;
            envConfig.security.enableRefererValidation = false;
        }

        return envConfig;
    }

    /**
     * Obtient la configuration pour un fournisseur de paiement
     */
    getProviderConfig(provider: PaymentProvider): PaymentGatewayConfig | undefined {
        return this.config.paymentGateways.find(p => p.provider === provider);
    }

    /**
     * Obtient les frais pour une méthode de paiement
     */
    getFeesConfig(method: PaymentMethod): FeesConfig | undefined {
        return this.config.fees.find(f => f.method === method);
    }

    /**
     * Obtient les limites pour une méthode de paiement
     */
    getLimitsConfig(method: PaymentMethod): LimitsConfig | undefined {
        return this.config.limits.find(l => l.method === method);
    }

    /**
     * Vérifie si une méthode de paiement est disponible dans l'environnement courant
     */
    isMethodAvailable(method: PaymentMethod): boolean {
        const limits = this.getLimitsConfig(method);

        if (!limits) {
            return false;
        }

        // Vérifier si le fournisseur correspondant est activé
        let providerEnabled = false;

        switch (method) {
            case PaymentMethod.MTN_MOBILE_MONEY:
                providerEnabled = this.config.mobileMoney[PaymentProvider.MTN] !== undefined;
                break;
            case PaymentMethod.ORANGE_MONEY:
                providerEnabled = this.config.mobileMoney[PaymentProvider.ORANGE] !== undefined;
                break;
            case PaymentMethod.CINETPAY:
                providerEnabled = this.config.paymentGateways.some(p =>
                    p.provider === PaymentProvider.CINETPAY && p.enabled
                );
                break;
            case PaymentMethod.CREDIT_CARD:
                providerEnabled = this.config.cardPayments.secretKey !== '';
                break;
        }

        return providerEnabled;
    }

    /**
     * Obtient les méthodes de paiement disponibles
     */
    getAvailableMethods(): PaymentMethod[] {
        const allMethods = Object.values(PaymentMethod);
        return allMethods.filter(method => this.isMethodAvailable(method));
    }

    /**
     * Calcule les frais pour un montant et une méthode donnés
     */
    calculateFees(amount: number, method: PaymentMethod): {
        fees: number;
        vat: number;
        totalFees: number;
        netAmount: number;
        totalAmount: number;
    } {
        const feesConfig = this.getFeesConfig(method);

        if (!feesConfig) {
            throw new Error(`Configuration des frais non trouvée pour ${method}`);
        }

        // Calcul des frais de base
        let baseFees = (amount * feesConfig.percentage) / 100 + feesConfig.fixed;

        // Appliquer les limites min/max
        if (feesConfig.minFees > 0 && baseFees < feesConfig.minFees) {
            baseFees = feesConfig.minFees;
        }

        if (feesConfig.maxFees > 0 && baseFees > feesConfig.maxFees) {
            baseFees = feesConfig.maxFees;
        }

        // Calcul de la TVA sur les frais
        const vat = (baseFees * feesConfig.vatOnFees) / 100;
        const totalFees = baseFees + vat;

        // Calcul des montants nets et totaux
        let netAmount, totalAmount;

        if (feesConfig.feePayer === 'customer') {
            // Frais payés par le client
            totalAmount = amount;
            netAmount = totalAmount - totalFees;
        } else {
            // Frais payés par le marchand
            totalAmount = amount + totalFees;
            netAmount = amount;
        }

        return {
            fees: baseFees,
            vat,
            totalFees,
            netAmount,
            totalAmount,
        };
    }

    /**
     * Vérifie si un montant respecte les limites
     */
    validateAmountLimits(amount: number, method: PaymentMethod): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];
        const limits = this.getLimitsConfig(method);

        if (!limits) {
            return { isValid: false, errors: ['Limites non configurées pour cette méthode'] };
        }

        if (amount < limits.minAmountPerTransaction) {
            errors.push(`Le montant minimum est de ${limits.minAmountPerTransaction} XAF`);
        }

        if (amount > limits.maxAmountPerTransaction) {
            errors.push(`Le montant maximum est de ${limits.maxAmountPerTransaction} XAF`);
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Génère une URL de callback
     */
    generateCallbackUrl(params: Record<string, string> = {}): string {
        let url = this.config.base.defaultCallbackUrl;

        if (Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams(params).toString();
            url += (url.includes('?') ? '&' : '?') + queryParams;
        }

        return url;
    }

    /**
     * Génère une URL de webhook
     */
    generateWebhookUrl(event: string, params: Record<string, string> = {}): string {
        let url = this.config.base.defaultWebhookUrl;

        // Ajouter l'événement au chemin
        if (!url.endsWith('/')) url += '/';
        url += event;

        if (Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams(params).toString();
            url += '?' + queryParams;
        }

        return url;
    }
}

/**
 * Instance singleton du gestionnaire de configuration
 */
let configManager: PaymentConfigManager | null = null;

export function getPaymentConfigManager(): PaymentConfigManager {
    if (!configManager) {
        configManager = new PaymentConfigManager();
    }
    return configManager;
}

/**
 * Fonctions utilitaires d'accès rapide
 */
export function getConfig(): PaymentConfig {
    return getPaymentConfigManager().getConfig();
}

export function getEnvironment(): Environment {
    return getConfig().base.environment;
}

export function isProduction(): boolean {
    return getEnvironment() === Environment.PRODUCTION;
}

export function isSandbox(): boolean {
    return getEnvironment() === Environment.SANDBOX;
}

export function getAvailablePaymentMethods(): PaymentMethod[] {
    return getPaymentConfigManager().getAvailableMethods();
}

export function calculatePaymentFees(amount: number, method: PaymentMethod) {
    return getPaymentConfigManager().calculateFees(amount, method);
}

export function validatePaymentAmount(amount: number, method: PaymentMethod) {
    return getPaymentConfigManager().validateAmountLimits(amount, method);
}

// Exemple d'utilisation
export function demonstrateConfig(): void {
    const manager = getPaymentConfigManager();

    console.log('=== Configuration des paiements ===\n');

    console.log(`Environnement: ${manager.getConfig().base.environment}`);
    console.log(`Devise: ${manager.getConfig().base.defaultCurrency}`);
    console.log(`Langue: ${manager.getConfig().base.defaultLanguage}`);

    console.log('\n=== Méthodes disponibles ===');
    const methods = manager.getAvailableMethods();
    methods.forEach(method => {
        console.log(`- ${method}`);
    });

    console.log('\n=== Exemple de calcul de frais ===');
    const amount = 10000; // 10,000 XAF
    const method = PaymentMethod.MTN_MOBILE_MONEY;

    try {
        const fees = manager.calculateFees(amount, method);
        console.log(`Montant: ${amount} XAF`);
        console.log(`Frais: ${fees.fees} XAF`);
        console.log(`TVA: ${fees.vat} XAF`);
        console.log(`Frais totaux: ${fees.totalFees} XAF`);
        console.log(`Montant net: ${fees.netAmount} XAF`);
        console.log(`Montant total: ${fees.totalAmount} XAF`);
    } catch (error: unknown) {
        console.error(`Erreur: ${getErrorMessage(error)}`);
    }

    console.log('\n=== Validation de montant ===');
    const validation = manager.validateAmountLimits(5000000, method);
    console.log(`Valide: ${validation.isValid}`);
    if (!validation.isValid) {
        console.log(`Erreurs: ${validation.errors.join(', ')}`);
    }
}

// Exécuter la démonstration si le fichier est exécuté directement
// Note: Cette fonctionnalité n'est pas disponible dans le navigateur
// if (require.main === module) {
//     demonstrateConfig();
// }