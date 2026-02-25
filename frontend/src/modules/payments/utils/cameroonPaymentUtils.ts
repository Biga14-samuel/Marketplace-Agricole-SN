// @ts-nocheck
// cameroonPaymentUtils.ts

/**
 * Utilitaires pour les paiements au Cameroun
 * Supporte: Mobile Money (MTN, Orange), Express Union, YUP, CinetPay, etc.
 */

import { CurrencyFormatter, formatAsXAF } from './currencyFormatter';

export enum PaymentMethod {
    MTN_MOBILE_MONEY = 'MTN_MOBILE_MONEY',
    ORANGE_MONEY = 'ORANGE_MONEY',
    EXPRESS_UNION = 'EXPRESS_UNION',
    YUP = 'YUP',
    UBA = 'UBA',
    ECOBANK = 'ECOBANK',
    CINETPAY = 'CINETPAY',
    CASH = 'CASH',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CHECK = 'CHECK',
    CREDIT_CARD = 'CREDIT_CARD'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    INITIATED = 'INITIATED',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
    REFUNDED = 'REFUNDED'
}

export interface PaymentTransaction {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    customerPhone?: string;
    customerName?: string;
    customerEmail?: string;
    merchantCode?: string;
    merchantName?: string;
    description?: string;
    fees: number;
    netAmount: number;
    metadata?: Record<string, any>;
    initiatedAt: Date;
    completedAt?: Date;
    callbackUrl?: string;
}

export interface MobileMoneyConfig {
    apiKey: string;
    merchantCode: string;
    merchantName: string;
    environment: 'sandbox' | 'production';
    callbackUrl?: string;
    maxAmount: number;
    minAmount: number;
}

export interface BankTransferConfig {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branchCode?: string;
    swiftCode?: string;
    iban?: string;
}

export interface PaymentMethodInfo {
    method: PaymentMethod;
    name: string;
    description: string;
    icon: string;
    isAvailable: boolean;
    minAmount: number;
    maxAmount: number;
    feesPercentage: number;
    processingTime: string;
    supportedCurrencies: string[];
}

export interface PaymentReceipt {
    transactionId: string;
    reference: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    customerInfo: {
        name?: string;
        phone?: string;
        email?: string;
    };
    merchantInfo: {
        name: string;
        code?: string;
    };
    timestamp: Date;
    fees: number;
    netAmount: number;
    qrCode?: string;
    authorizationCode?: string;
}

export class CameroonPaymentUtils {
    private static readonly OPERATOR_PREFIXES = {
        MTN: ['6', '67', '68', '69', '65'],
        ORANGE: ['7', '79', '77', '78'],
        NEXTTEL: ['66'],
        CAMTEL: ['233', '22', '24']
    };

    private static readonly BANK_CODES = {
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
        VISA: 'VISA',
        MASTERCARD: 'MASTERCARD'
    };

    private static readonly PAYMENT_METHODS_INFO: PaymentMethodInfo[] = [
        {
            method: PaymentMethod.MTN_MOBILE_MONEY,
            name: 'MTN Mobile Money',
            description: 'Paiement via MTN Mobile Money Cameroun',
            icon: 'mtn.png',
            isAvailable: true,
            minAmount: 50,
            maxAmount: 1000000,
            feesPercentage: 0.5,
            processingTime: 'Instantané',
            supportedCurrencies: ['XAF']
        },
        {
            method: PaymentMethod.ORANGE_MONEY,
            name: 'Orange Money',
            description: 'Paiement via Orange Money Cameroun',
            icon: 'orange.png',
            isAvailable: true,
            minAmount: 100,
            maxAmount: 500000,
            feesPercentage: 0.5,
            processingTime: 'Instantané',
            supportedCurrencies: ['XAF']
        },
        {
            method: PaymentMethod.EXPRESS_UNION,
            name: 'Express Union Mobile Money',
            description: 'Paiement via Express Union Mobile Money',
            icon: 'express_union.png',
            isAvailable: true,
            minAmount: 100,
            maxAmount: 500000,
            feesPercentage: 0.4,
            processingTime: 'Instantané',
            supportedCurrencies: ['XAF']
        },
        {
            method: PaymentMethod.YUP,
            name: 'YUP',
            description: 'Paiement via YUP Cameroon',
            icon: 'yup.png',
            isAvailable: true,
            minAmount: 100,
            maxAmount: 500000,
            feesPercentage: 0.3,
            processingTime: 'Instantané',
            supportedCurrencies: ['XAF']
        },
        {
            method: PaymentMethod.CINETPAY,
            name: 'CinetPay',
            description: 'Paiement via plateforme CinetPay',
            icon: 'cinetpay.png',
            isAvailable: true,
            minAmount: 100,
            maxAmount: 2000000,
            feesPercentage: 1.0,
            processingTime: '2-5 minutes',
            supportedCurrencies: ['XAF']
        },
        {
            method: PaymentMethod.BANK_TRANSFER,
            name: 'Virement Bancaire',
            description: 'Virement bancaire local',
            icon: 'bank_transfer.png',
            isAvailable: true,
            minAmount: 1000,
            maxAmount: 10000000,
            feesPercentage: 0.1,
            processingTime: '24-48 heures',
            supportedCurrencies: ['XAF']
        },
        {
            method: PaymentMethod.CREDIT_CARD,
            name: 'Carte Bancaire',
            description: 'Paiement par carte Visa/MasterCard',
            icon: 'credit_card.png',
            isAvailable: true,
            minAmount: 1000,
            maxAmount: 5000000,
            feesPercentage: 2.0,
            processingTime: 'Instantané',
            supportedCurrencies: ['XAF']
        }
    ];

    private currencyFormatter: CurrencyFormatter;

    constructor() {
        this.currencyFormatter = new CurrencyFormatter();
    }

    /**
     * Valide un numéro de téléphone camerounais
     */
    validatePhoneNumber(phone: string): { isValid: boolean; operator?: string; normalized?: string } {
        // Nettoyer le numéro
        const cleaned = phone.replace(/\D/g, '');

        // Vérifier la longueur
        if (cleaned.length !== 9 && cleaned.length !== 12) {
            return { isValid: false };
        }

        let phoneNumber = cleaned;

        // Si c'est un numéro international (+237), extraire le local
        if (cleaned.length === 12 && cleaned.startsWith('237')) {
            phoneNumber = cleaned.substring(3);
        } else if (cleaned.length !== 9) {
            return { isValid: false };
        }

        // Vérifier le préfixe de l'opérateur
        for (const [operator, prefixes] of Object.entries(CameroonPaymentUtils.OPERATOR_PREFIXES)) {
            for (const prefix of prefixes) {
                if (phoneNumber.startsWith(prefix)) {
                    return {
                        isValid: true,
                        operator,
                        normalized: `237${phoneNumber}`
                    };
                }
            }
        }

        return { isValid: false };
    }

    /**
     * Valide un numéro de compte Mobile Money
     */
    validateMobileMoneyAccount(account: string, operator: 'MTN' | 'ORANGE'): boolean {
        const phoneValidation = this.validatePhoneNumber(account);

        if (!phoneValidation.isValid) {
            return false;
        }

        if (operator === 'MTN' && phoneValidation.operator === 'MTN') {
            return true;
        }

        if (operator === 'ORANGE' && phoneValidation.operator === 'ORANGE') {
            return true;
        }

        return false;
    }

    /**
     * Génère une référence de paiement unique
     */
    generatePaymentReference(prefix: string = 'PAY'): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const day = new Date().getDate().toString().padStart(2, '0');
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

        return `${prefix}-${month}${day}-${timestamp.slice(-6)}-${random}`;
    }

    /**
     * Calcule les frais de transaction selon la méthode de paiement
     */
    calculateTransactionFees(amount: number, method: PaymentMethod): {
        fees: number;
        netAmount: number;
        totalAmount: number;
    } {
        const methodInfo = this.getPaymentMethodInfo(method);

        if (!methodInfo) {
            throw new Error(`Méthode de paiement non supportée: ${method}`);
        }

        // Vérifier les limites
        if (amount < methodInfo.minAmount) {
            throw new Error(`Montant minimum: ${formatAsXAF(methodInfo.minAmount)}`);
        }

        if (amount > methodInfo.maxAmount) {
            throw new Error(`Montant maximum: ${formatAsXAF(methodInfo.maxAmount)}`);
        }

        // Calcul des frais
        let fees = 0;

        switch (method) {
            case PaymentMethod.MTN_MOBILE_MONEY:
            case PaymentMethod.ORANGE_MONEY:
                // Frais dégressifs pour Mobile Money
                if (amount <= 5000) {
                    fees = 25;
                } else if (amount <= 25000) {
                    fees = 100;
                } else if (amount <= 50000) {
                    fees = 200;
                } else if (amount <= 100000) {
                    fees = 300;
                } else if (amount <= 150000) {
                    fees = 400;
                } else if (amount <= 300000) {
                    fees = 500;
                } else if (amount <= 500000) {
                    fees = 1000;
                } else {
                    fees = 2000;
                }
                break;

            case PaymentMethod.EXPRESS_UNION:
                fees = Math.max(100, amount * 0.01); // 1% minimum 100 FCFA
                break;

            case PaymentMethod.YUP:
                fees = amount * 0.005; // 0.5%
                break;

            case PaymentMethod.CINETPAY:
                fees = amount * 0.015; // 1.5%
                break;

            case PaymentMethod.BANK_TRANSFER:
                fees = Math.min(5000, Math.max(100, amount * 0.002)); // 0.2% min 100, max 5000
                break;

            case PaymentMethod.CREDIT_CARD:
                fees = amount * 0.025; // 2.5%
                break;

            default:
                fees = amount * (methodInfo.feesPercentage / 100);
        }

        // Arrondir les frais au supérieur pour le XAF
        fees = Math.ceil(fees);

        const netAmount = amount - fees;
        const totalAmount = amount;

        return { fees, netAmount, totalAmount };
    }

    /**
     * Formate un numéro de téléphone pour l'affichage
     */
    formatPhoneNumber(phone: string): string {
        const validation = this.validatePhoneNumber(phone);

        if (!validation.isValid || !validation.normalized) {
            return phone;
        }

        const normalized = validation.normalized;

        // Format: +237 6XX XXX XXX
        return `+${normalized.substring(0, 3)} ${normalized.substring(3, 6)} ${normalized.substring(6, 9)} ${normalized.substring(9)}`;
    }

    /**
     * Génère un QR Code de paiement
     */
    generatePaymentQRCode(data: {
        amount: number;
        currency: string;
        merchant: string;
        account: string;
        reference: string;
        description?: string;
    }): string {
        // Format standard pour les QR Codes de paiement au Cameroun
        const qrData = {
            v: '1', // Version
            t: 'P', // Type: Paiement
            n: data.merchant,
            a: data.account,
            am: data.amount.toString(),
            c: data.currency,
            r: data.reference,
            d: data.description || '',
            dt: new Date().toISOString()
        };

        // Convertir en chaîne pour QR Code
        const qrString = Object.entries(qrData)
            .map(([key, value]) => `${key}:${value}`)
            .join('|');

        // En pratique, utiliser une librairie QR Code ici
        // Pour l'exemple, retourner l'URL d'un générateur en ligne
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrString)}`;
    }

    /**
     * Obtient les informations d'une méthode de paiement
     */
    getPaymentMethodInfo(method: PaymentMethod): PaymentMethodInfo | undefined {
        return CameroonPaymentUtils.PAYMENT_METHODS_INFO.find(m => m.method === method);
    }

    /**
     * Liste toutes les méthodes de paiement disponibles
     */
    getAllPaymentMethods(): PaymentMethodInfo[] {
        return CameroonPaymentUtils.PAYMENT_METHODS_INFO.filter(m => m.isAvailable);
    }

    /**
     * Vérifie si une méthode de paiement supporte une devise
     */
    supportsCurrency(method: PaymentMethod, currency: string): boolean {
        const methodInfo = this.getPaymentMethodInfo(method);

        if (!methodInfo) {
            return false;
        }

        return methodInfo.supportedCurrencies.includes(currency.toUpperCase());
    }

    /**
     * Génère un reçu de paiement
     */
    generateReceipt(transaction: PaymentTransaction): PaymentReceipt {
        const methodInfo = this.getPaymentMethodInfo(transaction.method);

        const receipt: PaymentReceipt = {
            transactionId: transaction.id,
            reference: transaction.reference,
            amount: transaction.amount,
            currency: transaction.currency,
            method: transaction.method,
            status: transaction.status,
            customerInfo: {
                name: transaction.customerName,
                phone: transaction.customerPhone,
                email: transaction.customerEmail
            },
            merchantInfo: {
                name: transaction.merchantName || 'Marchand',
                code: transaction.merchantCode
            },
            timestamp: transaction.completedAt || new Date(),
            fees: transaction.fees,
            netAmount: transaction.netAmount,
            authorizationCode: this.generateAuthorizationCode()
        };

        // Générer un QR Code pour le reçu
        if (transaction.status === PaymentStatus.SUCCESS) {
            receipt.qrCode = this.generatePaymentQRCode({
                amount: transaction.amount,
                currency: transaction.currency,
                merchant: transaction.merchantName || 'Marchand',
                account: transaction.merchantCode || '',
                reference: transaction.reference,
                description: transaction.description
            });
        }

        return receipt;
    }

    /**
     * Génère un code d'autorisation
     */
    private generateAuthorizationCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    /**
     * Valide un code de transaction Mobile Money
     */
    validateMobileMoneyTransactionCode(code: string, operator: 'MTN' | 'ORANGE'): boolean {
        // Les codes de transaction sont généralement des nombres de 8-10 chiffres
        if (!/^\d{8,10}$/.test(code)) {
            return false;
        }

        // Vérification basique selon l'opérateur
        if (operator === 'MTN') {
            // MTN: souvent commence par 1-6
            return /^[1-6]/.test(code);
        } else if (operator === 'ORANGE') {
            // Orange: souvent commence par 7-9
            return /^[7-9]/.test(code);
        }

        return false;
    }

    /**
     * Simule un paiement Mobile Money
     */
    async simulateMobileMoneyPayment(transaction: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
        // Simulation d'un paiement Mobile Money
        const amount = transaction.amount || 0;
        const method = transaction.method || PaymentMethod.MTN_MOBILE_MONEY;

        const { fees, netAmount } = this.calculateTransactionFees(amount, method);

        const simulatedTransaction: PaymentTransaction = {
            id: transaction.id || `txn_${Date.now()}`,
            reference: transaction.reference || this.generatePaymentReference(),
            amount,
            currency: transaction.currency || 'XAF',
            method,
            status: PaymentStatus.SUCCESS,
            customerPhone: transaction.customerPhone,
            customerName: transaction.customerName,
            customerEmail: transaction.customerEmail,
            merchantCode: transaction.merchantCode,
            merchantName: transaction.merchantName,
            description: transaction.description,
            fees,
            netAmount,
            metadata: transaction.metadata,
            initiatedAt: transaction.initiatedAt || new Date(),
            completedAt: new Date(),
            callbackUrl: transaction.callbackUrl
        };

        // Simuler un délai de traitement
        await new Promise(resolve => setTimeout(resolve, 2000));

        return simulatedTransaction;
    }

    /**
     * Vérifie le statut d'une transaction
     */
    async checkTransactionStatus(transactionId: string): Promise<PaymentStatus> {
        // Simulation: 90% de succès, 5% d'échec, 5% en traitement
        const random = Math.random();

        if (random < 0.9) {
            return PaymentStatus.SUCCESS;
        } else if (random < 0.95) {
            return PaymentStatus.FAILED;
        } else {
            return PaymentStatus.PROCESSING;
        }
    }

    /**
     * Formatte un montant pour l'affichage sur les reçus
     */
    formatAmountForReceipt(amount: number, currency: string = 'XAF'): string {
        return this.currencyFormatter.format(amount, currency, {
            showSymbol: true,
            thousandsSeparator: ' ',
            alwaysShowDecimals: false
        });
    }

    /**
     * Génère un code de confirmation SMS
     */
    generateSMSConfirmationCode(length: number = 6): string {
        const digits = '0123456789';
        let code = '';

        for (let i = 0; i < length; i++) {
            code += digits.charAt(Math.floor(Math.random() * digits.length));
        }

        return code;
    }

    /**
     * Valide un code de confirmation SMS
     */
    validateSMSConfirmationCode(code: string, expectedCode: string): boolean {
        return code === expectedCode;
    }
}

// Export des utilitaires spécifiques
export class MTNMobileMoneyUtils {
    static readonly API_ENDPOINTS = {
        sandbox: 'https://sandbox.momodeveloper.mtn.com',
        production: 'https://momodeveloper.mtn.com'
    };

    static async initiatePayment(config: MobileMoneyConfig, phone: string, amount: number, reference: string) {
        // Implémentation simplifiée pour MTN Mobile Money API
        const endpoint = config.environment === 'sandbox'
            ? this.API_ENDPOINTS.sandbox
            : this.API_ENDPOINTS.production;

        // Note: Ceci est un exemple simplifié
        // En pratique, utiliser l'API MTN avec les bons headers et tokens
        const payload = {
            amount: amount.toString(),
            currency: 'XAF',
            externalId: reference,
            payer: {
                partyIdType: 'MSISDN',
                partyId: phone.replace('+237', '')
            },
            payerMessage: `Paiement ${reference}`,
            payeeNote: `Merchant: ${config.merchantName}`
        };

        return {
            success: true,
            transactionId: `MTN_${Date.now()}`,
            reference,
            status: 'PENDING'
        };
    }
}

export class OrangeMoneyUtils {
    static readonly API_ENDPOINTS = {
        sandbox: 'https://api.orange.com/orange-money-webpay/cm/v1',
        production: 'https://api.orange.com/orange-money-webpay/cm/v1'
    };

    static async initiatePayment(config: MobileMoneyConfig, phone: string, amount: number, reference: string) {
        // Implémentation simplifiée pour Orange Money API
        const endpoint = config.environment === 'sandbox'
            ? this.API_ENDPOINTS.sandbox
            : this.API_ENDPOINTS.production;

        const payload = {
            merchant_key: config.apiKey,
            currency: 'XAF',
            order_id: reference,
            amount: amount,
            return_url: config.callbackUrl,
            cancel_url: config.callbackUrl,
            notif_url: config.callbackUrl,
            lang: 'fr',
            phone_number: phone
        };

        return {
            success: true,
            transactionId: `OM_${Date.now()}`,
            reference,
            status: 'INITIATED'
        };
    }
}

// Fonctions utilitaires exportées
export function validateCameroonPhone(phone: string): boolean {
    const utils = new CameroonPaymentUtils();
    return utils.validatePhoneNumber(phone).isValid;
}

export function generatePaymentRef(prefix?: string): string {
    const utils = new CameroonPaymentUtils();
    return utils.generatePaymentReference(prefix);
}

export function calculateFees(amount: number, method: PaymentMethod) {
    const utils = new CameroonPaymentUtils();
    return utils.calculateTransactionFees(amount, method);
}
