// @ts-nocheck
// cameroonPaymentProviders.ts

/**
 * Configuration des fournisseurs de paiement locaux au Cameroun
 * MTN Mobile Money, Orange Money, Express Union, YUP, CinetPay, etc.
 */

import { Environment } from '../config/paymentConfig';

export enum CameroonPaymentProvider {
    MTN_MOBILE_MONEY = 'MTN_MOBILE_MONEY',
    ORANGE_MONEY = 'ORANGE_MONEY',
    EXPRESS_UNION_MOBILE = 'EXPRESS_UNION_MOBILE',
    YUP_CAMEROON = 'YUP_CAMEROON',
    CINETPAY = 'CINETPAY',
    PAYDUNYA = 'PAYDUNYA',
    NOTCHPAY = 'NOTCHPAY',
    UMONEY = 'UMONEY',
    TIGO_CASH = 'TIGO_CASH',
    EASYPAY = 'EASYPAY',
    QUICK_CASH = 'QUICK_CASH',
    FIRST_BANK_MOBILE = 'FIRST_BANK_MOBILE',
    UBA_MOBILE = 'UBA_MOBILE',
    ECOBANK_MOBILE = 'ECOBANK_MOBILE'
}

export enum ProviderStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    MAINTENANCE = 'MAINTENANCE',
    BETA = 'BETA',
    DEPRECATED = 'DEPRECATED'
}

export enum ProviderRegion {
    ALL = 'ALL',
    YAOUNDE = 'YAOUNDE',
    DOUALA = 'DOUALA',
    GAROUA = 'GAROUA',
    BAFOUSSAM = 'BAFOUSSAM',
    MAROUA = 'MAROUA',
    BAMENDA = 'BAMENDA',
    NGAOUNDERE = 'NGAOUNDERE',
    KUMBA = 'KUMBA',
    BUEA = 'BUEA',
    LIMBE = 'LIMBE',
    KRIBI = 'KRIBI',
    EDEA = 'EDEA',
    MBALMAYO = 'MBALMAYO',
    NKONGSAMBA = 'NKONGSAMBA',
    WEST = 'WEST',
    EAST = 'EAST',
    NORTH = 'NORTH',
    SOUTH = 'SOUTH',
    LITTORAL = 'LITTORAL',
    CENTER = 'CENTER',
    ADAMAWA = 'ADAMAWA',
    FAR_NORTH = 'FAR_NORTH',
    NORTH_WEST = 'NORTH_WEST',
    SOUTH_WEST = 'SOUTH_WEST'
}

export interface ProviderAPIEndpoint {
    sandbox: string;
    production: string;
    test: string;
    version: string;
}

export interface ProviderAPICredentials {
    apiKey: string;
    apiSecret: string;
    username?: string;
    password?: string;
    merchantId: string;
    merchantCode: string;
    merchantToken?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: Date;
}

export interface ProviderWebhookConfig {
    url: string;
    secret: string;
    events: string[];
    retryAttempts: number;
    timeout: number;
}

export interface ProviderRateLimit {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
    burstLimit: number;
}

export interface ProviderFees {
    deposit: {
        percentage: number;
        fixed: number;
        min: number;
        max: number;
    };
    withdrawal: {
        percentage: number;
        fixed: number;
        min: number;
        max: number;
    };
    transfer: {
        percentage: number;
        fixed: number;
        min: number;
        max: number;
    };
    inquiry: {
        fixed: number;
    };
}

export interface ProviderSupport {
    phone: string[];
    email: string[];
    website: string;
    supportHours: string;
    languages: string[];
    responseTime: string;
}

export interface ProviderCompliance {
    isLicensed: boolean;
    licenseNumber?: string;
    regulatoryBody?: string;
    licenseExpiry?: Date;
    isPCICompliant: boolean;
    isGDPRCompliant: boolean;
    dataCenters: string[];
    backupPolicy: string;
}

export interface CameroonPaymentProviderConfig {
    // Identifiant du fournisseur
    id: CameroonPaymentProvider;

    // Informations de base
    name: string;
    description: string;
    logo: string;
    website: string;
    foundedYear: number;
    headquarters: string;

    // Statut et disponibilité
    status: ProviderStatus;
    regions: ProviderRegion[];
    supportedLanguages: string[];

    // Configuration API
    endpoints: ProviderAPIEndpoint;
    credentials: ProviderAPICredentials;

    // Configuration webhook
    webhook: ProviderWebhookConfig;

    // Limites et restrictions
    rateLimits: ProviderRateLimit;
    limits: {
        minTransaction: number;
        maxTransaction: number;
        dailyLimit: number;
        monthlyLimit: number;
        perTransactionLimit: number;
    };

    // Frais
    fees: ProviderFees;

    // Devises supportées
    supportedCurrencies: string[];

    // Méthodes supportées
    supportedMethods: string[];

    // Services supplémentaires
    additionalServices: string[];

    // Support client
    support: ProviderSupport;

    // Conformité et régulation
    compliance: ProviderCompliance;

    // Métadonnées
    metadata: {
        providerCode: string;
        providerCategory: string;
        integrationLevel: 'FULL' | 'PARTIAL' | 'TESTING';
        lastUpdated: Date;
        version: string;
        documentationUrl: string;
        changelogUrl: string;
    };

    // Configuration spécifique à l'environnement
    environmentConfig: {
        sandbox: Record<string, any>;
        production: Record<string, any>;
    };
}

export interface ProviderTransactionResponse {
    success: boolean;
    transactionId: string;
    reference: string;
    providerReference: string;
    amount: number;
    currency: string;
    status: string;
    message: string;
    timestamp: Date;
    fees: number;
    metadata: Record<string, any>;
    rawResponse?: any;
}

export interface ProviderBalance {
    available: number;
    pending: number;
    currency: string;
    lastUpdated: Date;
}

export interface ProviderWebhookEvent {
    eventType: string;
    eventId: string;
    timestamp: Date;
    data: any;
    signature?: string;
    provider: CameroonPaymentProvider;
}

/**
 * Classe de gestion des fournisseurs de paiement camerounais
 */
export class CameroonPaymentProviders {
    private static providers: Map<CameroonPaymentProvider, CameroonPaymentProviderConfig> = new Map();
    private static initialized = false;

    /**
     * Initialise les configurations des fournisseurs
     */
    static initialize(environment: Environment = Environment.SANDBOX): void {
        if (this.initialized) return;

        // Configuration MTN Mobile Money Cameroun
        this.providers.set(CameroonPaymentProvider.MTN_MOBILE_MONEY, {
            id: CameroonPaymentProvider.MTN_MOBILE_MONEY,
            name: 'MTN Mobile Money Cameroon',
            description: 'Service de paiement mobile de MTN Cameroun - Le leader du mobile money en Afrique',
            logo: 'https://www.mtn.cm/images/mtn-money-logo.png',
            website: 'https://www.mtn.cm/mobile-money',
            foundedYear: 2007,
            headquarters: 'Yaoundé, Cameroun',

            status: ProviderStatus.ACTIVE,
            regions: [ProviderRegion.ALL],
            supportedLanguages: ['fr', 'en'],

            endpoints: {
                sandbox: 'https://sandbox.momodeveloper.mtn.com',
                production: 'https://momodeveloper.mtn.com',
                test: 'https://test.momoapi.mtn.com',
                version: 'v1'
            },

            credentials: {
                apiKey: process.env.MTN_API_KEY || '',
                apiSecret: process.env.MTN_API_SECRET || '',
                merchantId: process.env.MTN_MERCHANT_ID || '',
                merchantCode: process.env.MTN_MERCHANT_CODE || '',
                accessToken: process.env.MTN_ACCESS_TOKEN || '',
                refreshToken: process.env.MTN_REFRESH_TOKEN || ''
            },

            webhook: {
                url: process.env.MTN_WEBHOOK_URL || 'https://yourdomain.com/webhook/mtn',
                secret: process.env.MTN_WEBHOOK_SECRET || '',
                events: ['payment.success', 'payment.failed', 'payment.pending', 'transfer.completed'],
                retryAttempts: 3,
                timeout: 5000
            },

            rateLimits: {
                requestsPerMinute: 60,
                requestsPerHour: 1000,
                requestsPerDay: 10000,
                burstLimit: 10
            },

            limits: {
                minTransaction: 100, // 100 XAF
                maxTransaction: 1000000, // 1,000,000 XAF
                dailyLimit: 5000000, // 5,000,000 XAF
                monthlyLimit: 20000000, // 20,000,000 XAF
                perTransactionLimit: 1000000
            },

            fees: {
                deposit: {
                    percentage: 0.5,
                    fixed: 25,
                    min: 25,
                    max: 2000
                },
                withdrawal: {
                    percentage: 0.5,
                    fixed: 25,
                    min: 25,
                    max: 2000
                },
                transfer: {
                    percentage: 0.5,
                    fixed: 25,
                    min: 25,
                    max: 2000
                },
                inquiry: {
                    fixed: 0
                }
            },

            supportedCurrencies: ['XAF'],
            supportedMethods: ['USSD', 'Mobile App', 'Web', 'API'],
            additionalServices: ['Bill Payment', 'Airtime Purchase', 'Merchant Payments', 'International Transfer'],

            support: {
                phone: ['+237 670 00 00 00', '+237 680 00 00 00'],
                email: ['support@mtn.cm', 'momo@mtn.cm'],
                website: 'https://www.mtn.cm/support',
                supportHours: '24/7',
                languages: ['fr', 'en'],
                responseTime: '15 minutes'
            },

            compliance: {
                isLicensed: true,
                licenseNumber: 'MINFI-2021-00123',
                regulatoryBody: 'MINFI Cameroon',
                licenseExpiry: new Date('2025-12-31'),
                isPCICompliant: true,
                isGDPRCompliant: true,
                dataCenters: ['Yaoundé', 'Douala', 'Paris'],
                backupPolicy: 'Daily backups with 30-day retention'
            },

            metadata: {
                providerCode: 'MTN_CM',
                providerCategory: 'TELCO',
                integrationLevel: 'FULL',
                lastUpdated: new Date('2024-01-15'),
                version: '2.1.0',
                documentationUrl: 'https://developer.mtn.cm/docs',
                changelogUrl: 'https://developer.mtn.cm/changelog'
            },

            environmentConfig: {
                sandbox: {
                    testPhoneNumbers: ['237677123456', '237678123456'],
                    testAmounts: [100, 500, 1000, 5000],
                    simulationMode: true,
                    mockResponses: true
                },
                production: {
                    auditLogging: true,
                    realTimeMonitoring: true,
                    fraudDetection: true,
                    autoReconciliation: true
                }
            }
        });

        // Configuration Orange Money Cameroun
        this.providers.set(CameroonPaymentProvider.ORANGE_MONEY, {
            id: CameroonPaymentProvider.ORANGE_MONEY,
            name: 'Orange Money Cameroon',
            description: 'Service de paiement mobile d\'Orange Cameroun - Simple, Rapide, Sécurisé',
            logo: 'https://www.orange.cm/images/orange-money-logo.png',
            website: 'https://www.orange.cm/orange-money',
            foundedYear: 2008,
            headquarters: 'Douala, Cameroun',

            status: ProviderStatus.ACTIVE,
            regions: [ProviderRegion.ALL],
            supportedLanguages: ['fr', 'en'],

            endpoints: {
                sandbox: 'https://api.orange.com/orange-money-webpay/sandbox',
                production: 'https://api.orange.com/orange-money-webpay/cm',
                test: 'https://test.orange-money.cm',
                version: 'v2'
            },

            credentials: {
                apiKey: process.env.ORANGE_API_KEY || '',
                apiSecret: process.env.ORANGE_API_SECRET || '',
                username: process.env.ORANGE_USERNAME || '',
                password: process.env.ORANGE_PASSWORD || '',
                merchantId: process.env.ORANGE_MERCHANT_ID || '',
                merchantCode: process.env.ORANGE_MERCHANT_CODE || '',
                accessToken: process.env.ORANGE_ACCESS_TOKEN || ''
            },

            webhook: {
                url: process.env.ORANGE_WEBHOOK_URL || 'https://yourdomain.com/webhook/orange',
                secret: process.env.ORANGE_WEBHOOK_SECRET || '',
                events: ['payment.initiated', 'payment.completed', 'payment.cancelled', 'payment.error'],
                retryAttempts: 3,
                timeout: 5000
            },

            rateLimits: {
                requestsPerMinute: 50,
                requestsPerHour: 800,
                requestsPerDay: 8000,
                burstLimit: 8
            },

            limits: {
                minTransaction: 100,
                maxTransaction: 500000,
                dailyLimit: 2000000,
                monthlyLimit: 10000000,
                perTransactionLimit: 500000
            },

            fees: {
                deposit: {
                    percentage: 0.5,
                    fixed: 25,
                    min: 25,
                    max: 1500
                },
                withdrawal: {
                    percentage: 0.5,
                    fixed: 25,
                    min: 25,
                    max: 1500
                },
                transfer: {
                    percentage: 0.5,
                    fixed: 25,
                    min: 25,
                    max: 1500
                },
                inquiry: {
                    fixed: 0
                }
            },

            supportedCurrencies: ['XAF'],
            supportedMethods: ['USSD', 'Mobile App', 'Web', 'API', 'Agent'],
            additionalServices: ['Bill Payment', 'Airtime Purchase', 'Loan Services', 'Insurance'],

            support: {
                phone: ['+237 699 99 99 99', '+237 677 77 77 77'],
                email: ['support@orange.cm', 'orange.money@orange.cm'],
                website: 'https://www.orange.cm/support',
                supportHours: '24/7',
                languages: ['fr', 'en'],
                responseTime: '20 minutes'
            },

            compliance: {
                isLicensed: true,
                licenseNumber: 'MINFI-2020-00456',
                regulatoryBody: 'MINFI Cameroon',
                licenseExpiry: new Date('2024-12-31'),
                isPCICompliant: true,
                isGDPRCompliant: true,
                dataCenters: ['Douala', 'Yaoundé', 'Dakar'],
                backupPolicy: 'Real-time replication'
            },

            metadata: {
                providerCode: 'ORANGE_CM',
                providerCategory: 'TELCO',
                integrationLevel: 'FULL',
                lastUpdated: new Date('2023-11-20'),
                version: '1.5.2',
                documentationUrl: 'https://developer.orange.cm/docs',
                changelogUrl: 'https://developer.orange.cm/changelog'
            },

            environmentConfig: {
                sandbox: {
                    testPhoneNumbers: ['237699123456', '237677123456'],
                    testAmounts: [100, 1000, 5000],
                    simulationMode: true,
                    mockResponses: true
                },
                production: {
                    auditLogging: true,
                    realTimeMonitoring: true,
                    fraudDetection: true,
                    autoReconciliation: true
                }
            }
        });

        // Configuration Express Union Mobile Money
        this.providers.set(CameroonPaymentProvider.EXPRESS_UNION_MOBILE, {
            id: CameroonPaymentProvider.EXPRESS_UNION_MOBILE,
            name: 'Express Union Mobile',
            description: 'Service financier mobile d\'Express Union Cameroun - Banque Mobile',
            logo: 'https://www.expressunion.cm/images/eu-mobile-logo.png',
            website: 'https://www.expressunion.cm/mobile',
            foundedYear: 2009,
            headquarters: 'Yaoundé, Cameroun',

            status: ProviderStatus.ACTIVE,
            regions: [ProviderRegion.ALL],
            supportedLanguages: ['fr', 'en'],

            endpoints: {
                sandbox: 'https://sandbox.expressunionmobile.cm/api',
                production: 'https://api.expressunionmobile.cm',
                test: 'https://test.expressunionmobile.cm',
                version: 'v1'
            },

            credentials: {
                apiKey: process.env.EXPRESS_UNION_API_KEY || '',
                apiSecret: process.env.EXPRESS_UNION_API_SECRET || '',
                merchantId: process.env.EXPRESS_UNION_MERCHANT_ID || '',
                merchantCode: process.env.EXPRESS_UNION_MERCHANT_CODE || '',
                username: process.env.EXPRESS_UNION_USERNAME || '',
                password: process.env.EXPRESS_UNION_PASSWORD || ''
            },

            webhook: {
                url: process.env.EXPRESS_UNION_WEBHOOK_URL || 'https://yourdomain.com/webhook/expressunion',
                secret: process.env.EXPRESS_UNION_WEBHOOK_SECRET || '',
                events: ['transaction.success', 'transaction.failed', 'account.updated'],
                retryAttempts: 3,
                timeout: 5000
            },

            rateLimits: {
                requestsPerMinute: 40,
                requestsPerHour: 600,
                requestsPerDay: 6000,
                burstLimit: 5
            },

            limits: {
                minTransaction: 100,
                maxTransaction: 500000,
                dailyLimit: 1500000,
                monthlyLimit: 8000000,
                perTransactionLimit: 500000
            },

            fees: {
                deposit: {
                    percentage: 0.4,
                    fixed: 100,
                    min: 100,
                    max: 1000
                },
                withdrawal: {
                    percentage: 0.4,
                    fixed: 100,
                    min: 100,
                    max: 1000
                },
                transfer: {
                    percentage: 0.4,
                    fixed: 100,
                    min: 100,
                    max: 1000
                },
                inquiry: {
                    fixed: 0
                }
            },

            supportedCurrencies: ['XAF'],
            supportedMethods: ['USSD', 'Mobile App', 'Web', 'API', 'Agent'],
            additionalServices: ['Bank Transfer', 'Account Opening', 'Micro-loans', 'Savings'],

            support: {
                phone: ['+237 233 40 00 00', '+237 677 55 55 55'],
                email: ['support@expressunion.cm', 'mobile@expressunion.cm'],
                website: 'https://www.expressunion.cm/contact',
                supportHours: '8:00-18:00 (Mon-Fri), 9:00-13:00 (Sat)',
                languages: ['fr', 'en'],
                responseTime: '30 minutes'
            },

            compliance: {
                isLicensed: true,
                licenseNumber: 'COBAC-2019-00345',
                regulatoryBody: 'COBAC',
                licenseExpiry: new Date('2024-06-30'),
                isPCICompliant: true,
                isGDPRCompliant: true,
                dataCenters: ['Yaoundé', 'Douala'],
                backupPolicy: 'Daily backups'
            },

            metadata: {
                providerCode: 'EXPRESS_UNION_CM',
                providerCategory: 'BANK',
                integrationLevel: 'PARTIAL',
                lastUpdated: new Date('2023-09-10'),
                version: '1.2.1',
                documentationUrl: 'https://developer.expressunion.cm/docs',
                changelogUrl: 'https://developer.expressunion.cm/changelog'
            },

            environmentConfig: {
                sandbox: {
                    testPhoneNumbers: ['237677123456'],
                    testAmounts: [100, 500, 1000],
                    simulationMode: true,
                    mockResponses: true
                },
                production: {
                    auditLogging: true,
                    realTimeMonitoring: true,
                    fraudDetection: true
                }
            }
        });

        // Configuration YUP Cameroon
        this.providers.set(CameroonPaymentProvider.YUP_CAMEROON, {
            id: CameroonPaymentProvider.YUP_CAMEROON,
            name: 'YUP Cameroon',
            description: 'Plateforme de paiement numérique panafricaine - Transferts d\'argent et paiements',
            logo: 'https://www.yup.cm/images/yup-logo.png',
            website: 'https://www.yup.cm',
            foundedYear: 2017,
            headquarters: 'Douala, Cameroun',

            status: ProviderStatus.ACTIVE,
            regions: [ProviderRegion.ALL],
            supportedLanguages: ['fr', 'en'],

            endpoints: {
                sandbox: 'https://sandbox.yup.cm/api',
                production: 'https://api.yup.cm',
                test: 'https://test.yup.cm/api',
                version: 'v3'
            },

            credentials: {
                apiKey: process.env.YUP_API_KEY || '',
                apiSecret: process.env.YUP_API_SECRET || '',
                merchantId: process.env.YUP_MERCHANT_ID || '',
                merchantCode: process.env.YUP_MERCHANT_CODE || '',
                accessToken: process.env.YUP_ACCESS_TOKEN || '',
                refreshToken: process.env.YUP_REFRESH_TOKEN || ''
            },

            webhook: {
                url: process.env.YUP_WEBHOOK_URL || 'https://yourdomain.com/webhook/yup',
                secret: process.env.YUP_WEBHOOK_SECRET || '',
                events: ['payment.success', 'payment.failed', 'transfer.completed', 'wallet.updated'],
                retryAttempts: 3,
                timeout: 5000
            },

            rateLimits: {
                requestsPerMinute: 100,
                requestsPerHour: 1500,
                requestsPerDay: 15000,
                burstLimit: 20
            },

            limits: {
                minTransaction: 100,
                maxTransaction: 500000,
                dailyLimit: 3000000,
                monthlyLimit: 15000000,
                perTransactionLimit: 500000
            },

            fees: {
                deposit: {
                    percentage: 0.3,
                    fixed: 50,
                    min: 50,
                    max: 500
                },
                withdrawal: {
                    percentage: 0.3,
                    fixed: 50,
                    min: 50,
                    max: 500
                },
                transfer: {
                    percentage: 0.2,
                    fixed: 0,
                    min: 0,
                    max: 300
                },
                inquiry: {
                    fixed: 0
                }
            },

            supportedCurrencies: ['XAF', 'EUR', 'USD', 'XOF'],
            supportedMethods: ['Mobile App', 'Web', 'API', 'QR Code'],
            additionalServices: ['International Transfers', 'Currency Exchange', 'Merchant Services', 'API Marketplace'],

            support: {
                phone: ['+237 673 00 00 00', '+237 677 88 88 88'],
                email: ['support@yup.cm', 'tech@yup.cm'],
                website: 'https://help.yup.cm',
                supportHours: '24/7',
                languages: ['fr', 'en', 'ar'],
                responseTime: '10 minutes'
            },

            compliance: {
                isLicensed: true,
                licenseNumber: 'MINFI-2021-00789',
                regulatoryBody: 'MINFI Cameroon',
                licenseExpiry: new Date('2025-03-31'),
                isPCICompliant: true,
                isGDPRCompliant: true,
                dataCenters: ['Douala', 'Paris', 'Dakar'],
                backupPolicy: 'Multi-region redundancy'
            },

            metadata: {
                providerCode: 'YUP_CM',
                providerCategory: 'FIN_TECH',
                integrationLevel: 'FULL',
                lastUpdated: new Date('2024-02-01'),
                version: '3.0.0',
                documentationUrl: 'https://developer.yup.cm/docs',
                changelogUrl: 'https://developer.yup.cm/changelog'
            },

            environmentConfig: {
                sandbox: {
                    testPhoneNumbers: ['237673123456', '237677123456'],
                    testAmounts: [100, 500, 1000, 5000],
                    simulationMode: true,
                    mockResponses: true
                },
                production: {
                    auditLogging: true,
                    realTimeMonitoring: true,
                    fraudDetection: true,
                    autoReconciliation: true,
                    multiCurrency: true
                }
            }
        });

        // Configuration CinetPay Cameroun
        this.providers.set(CameroonPaymentProvider.CINETPAY, {
            id: CameroonPaymentProvider.CINETPAY,
            name: 'CinetPay Cameroon',
            description: 'Plateforme de paiement en ligne pour l\'Afrique - Paiements mobiles et cartes',
            logo: 'https://www.cinetpay.com/images/logo.png',
            website: 'https://www.cinetpay.com',
            foundedYear: 2016,
            headquarters: 'Abidjan, Côte d\'Ivoire',

            status: ProviderStatus.ACTIVE,
            regions: [ProviderRegion.ALL],
            supportedLanguages: ['fr', 'en'],

            endpoints: {
                sandbox: 'https://sandbox.cinetpay.com/v1',
                production: 'https://api.cinetpay.com/v1',
                test: 'https://test.cinetpay.com/v1',
                version: 'v1'
            },

            credentials: {
                apiKey: process.env.CINETPAY_API_KEY || '',
                apiSecret: process.env.CINETPAY_API_SECRET || '',
                merchantId: process.env.CINETPAY_MERCHANT_ID || '',
                merchantCode: process.env.CINETPAY_SITE_ID || '',
                accessToken: process.env.CINETPAY_ACCESS_TOKEN || ''
            },

            webhook: {
                url: process.env.CINETPAY_WEBHOOK_URL || 'https://yourdomain.com/webhook/cinetpay',
                secret: process.env.CINETPAY_WEBHOOK_SECRET || '',
                events: ['payment.success', 'payment.failure', 'payment.pending', 'payment.canceled'],
                retryAttempts: 5,
                timeout: 10000
            },

            rateLimits: {
                requestsPerMinute: 200,
                requestsPerHour: 3000,
                requestsPerDay: 30000,
                burstLimit: 30
            },

            limits: {
                minTransaction: 100,
                maxTransaction: 2000000,
                dailyLimit: 10000000,
                monthlyLimit: 50000000,
                perTransactionLimit: 2000000
            },

            fees: {
                deposit: {
                    percentage: 1.0,
                    fixed: 50,
                    min: 50,
                    max: 5000
                },
                withdrawal: {
                    percentage: 1.5,
                    fixed: 100,
                    min: 100,
                    max: 7500
                },
                transfer: {
                    percentage: 0.8,
                    fixed: 0,
                    min: 0,
                    max: 4000
                },
                inquiry: {
                    fixed: 0
                }
            },

            supportedCurrencies: ['XAF', 'XOF', 'EUR', 'USD', 'GNF'],
            supportedMethods: ['MTN', 'Orange', 'Moov', 'Visa', 'MasterCard', 'PayPal'],
            additionalServices: ['Recurring Payments', 'Marketplace', 'Split Payments', 'Payment Links'],

            support: {
                phone: ['+225 27 22 58 96 00', '+237 677 11 11 11'],
                email: ['support@cinetpay.com', 'cm@cinetpay.com'],
                website: 'https://help.cinetpay.com',
                supportHours: '24/7',
                languages: ['fr', 'en'],
                responseTime: '5 minutes'
            },

            compliance: {
                isLicensed: true,
                licenseNumber: 'BCEAO-2020-00123',
                regulatoryBody: 'BCEAO',
                licenseExpiry: new Date('2024-12-31'),
                isPCICompliant: true,
                isGDPRCompliant: true,
                dataCenters: ['Abidjan', 'Paris', 'Dakar', 'Yaoundé'],
                backupPolicy: 'Real-time synchronous replication'
            },

            metadata: {
                providerCode: 'CINETPAY',
                providerCategory: 'PAYMENT_GATEWAY',
                integrationLevel: 'FULL',
                lastUpdated: new Date('2024-01-30'),
                version: '1.8.3',
                documentationUrl: 'https://docs.cinetpay.com',
                changelogUrl: 'https://docs.cinetpay.com/changelog'
            },

            environmentConfig: {
                sandbox: {
                    testPhoneNumbers: ['237677123456', '237699123456'],
                    testAmounts: [100, 1000, 10000],
                    simulationMode: true,
                    mockResponses: true,
                    testCards: {
                        success: '4111111111111111',
                        failure: '4000000000000002'
                    }
                },
                production: {
                    auditLogging: true,
                    realTimeMonitoring: true,
                    fraudDetection: true,
                    autoReconciliation: true,
                    chargebackProtection: true
                }
            }
        });

        this.initialized = true;
    }

    /**
     * Obtient la configuration d'un fournisseur
     */
    static getProvider(providerId: CameroonPaymentProvider): CameroonPaymentProviderConfig | undefined {
        if (!this.initialized) {
            this.initialize();
        }

        return this.providers.get(providerId);
    }

    /**
     * Obtient tous les fournisseurs
     */
    static getAllProviders(): CameroonPaymentProviderConfig[] {
        if (!this.initialized) {
            this.initialize();
        }

        return Array.from(this.providers.values());
    }

    /**
     * Obtient les fournisseurs actifs
     */
    static getActiveProviders(): CameroonPaymentProviderConfig[] {
        return this.getAllProviders().filter(provider =>
            provider.status === ProviderStatus.ACTIVE || provider.status === ProviderStatus.BETA
        );
    }

    /**
     * Obtient les fournisseurs par catégorie
     */
    static getProvidersByCategory(category: string): CameroonPaymentProviderConfig[] {
        return this.getAllProviders().filter(provider =>
            provider.metadata.providerCategory === category
        );
    }

    /**
     * Obtient les fournisseurs supportant une devise spécifique
     */
    static getProvidersByCurrency(currency: string): CameroonPaymentProviderConfig[] {
        return this.getAllProviders().filter(provider =>
            provider.supportedCurrencies.includes(currency.toUpperCase())
        );
    }

    /**
     * Obtient les fournisseurs disponibles dans une région
     */
    static getProvidersByRegion(region: ProviderRegion): CameroonPaymentProviderConfig[] {
        return this.getAllProviders().filter(provider =>
            provider.regions.includes(ProviderRegion.ALL) || provider.regions.includes(region)
        );
    }

    /**
     * Met à jour la configuration d'un fournisseur
     */
    static updateProvider(providerId: CameroonPaymentProvider, updates: Partial<CameroonPaymentProviderConfig>): boolean {
        const provider = this.getProvider(providerId);

        if (!provider) {
            return false;
        }

        // Fusionner les mises à jour
        const updatedProvider = {
            ...provider,
            ...updates,
            metadata: {
                ...provider.metadata,
                ...updates.metadata,
                lastUpdated: new Date()
            }
        };

        this.providers.set(providerId, updatedProvider);
        return true;
    }

    /**
     * Met à jour les identifiants API d'un fournisseur
     */
    static updateProviderCredentials(
        providerId: CameroonPaymentProvider,
        credentials: Partial<ProviderAPICredentials>
    ): boolean {
        const provider = this.getProvider(providerId);

        if (!provider) {
            return false;
        }

        provider.credentials = {
            ...provider.credentials,
            ...credentials
        };

        this.providers.set(providerId, provider);
        return true;
    }

    /**
     * Compare les frais entre plusieurs fournisseurs
     */
    static compareFees(amount: number, providers: CameroonPaymentProvider[] = []): Array<{
        provider: CameroonPaymentProvider;
        name: string;
        totalFees: number;
        netAmount: number;
        percentage: number;
        fixed: number;
    }> {
        const comparison = [];

        const providersToCompare = providers.length > 0
            ? providers
            : this.getActiveProviders().map(p => p.id);

        for (const providerId of providersToCompare) {
            const provider = this.getProvider(providerId);

            if (provider) {
                const depositFees = provider.fees.deposit;
                const fees = (amount * depositFees.percentage) / 100 + depositFees.fixed;

                // Appliquer les limites min/max
                const totalFees = Math.max(depositFees.min, Math.min(depositFees.max, fees));
                const netAmount = amount - totalFees;

                comparison.push({
                    provider: providerId,
                    name: provider.name,
                    totalFees,
                    netAmount,
                    percentage: depositFees.percentage,
                    fixed: depositFees.fixed
                });
            }
        }

        // Trier par frais totaux (croissant)
        return comparison.sort((a, b) => a.totalFees - b.totalFees);
    }

    /**
     * Valide si un montant est dans les limites d'un fournisseur
     */
    static validateAmountLimits(
        providerId: CameroonPaymentProvider,
        amount: number
    ): { isValid: boolean; errors: string[] } {
        const provider = this.getProvider(providerId);
        const errors: string[] = [];

        if (!provider) {
            return { isValid: false, errors: ['Fournisseur non trouvé'] };
        }

        if (amount < provider.limits.minTransaction) {
            errors.push(`Le montant minimum est de ${provider.limits.minTransaction} ${provider.supportedCurrencies[0]}`);
        }

        if (amount > provider.limits.maxTransaction) {
            errors.push(`Le montant maximum est de ${provider.limits.maxTransaction} ${provider.supportedCurrencies[0]}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Génère une URL d'API pour un fournisseur
     */
    static getApiUrl(
        providerId: CameroonPaymentProvider,
        endpoint: string,
        environment: Environment = Environment.SANDBOX
    ): string {
        const provider = this.getProvider(providerId);

        if (!provider) {
            throw new Error(`Fournisseur non trouvé: ${providerId}`);
        }

        let baseUrl: string;

        switch (environment) {
            case Environment.PRODUCTION:
                baseUrl = provider.endpoints.production;
                break;
            case Environment.SANDBOX:
                baseUrl = provider.endpoints.sandbox;
                break;
            case Environment.STAGING:
            case Environment.DEVELOPMENT:
                baseUrl = provider.endpoints.test;
                break;
            default:
                baseUrl = provider.endpoints.sandbox;
        }

        // Nettoyer les slashs doubles
        return `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    }

    /**
     * Obtient les informations de support d'un fournisseur
     */
    static getSupportInfo(providerId: CameroonPaymentProvider): ProviderSupport | undefined {
        return this.getProvider(providerId)?.support;
    }

    /**
     * Obtient les fournisseurs avec le niveau d'intégration spécifié
     */
    static getProvidersByIntegrationLevel(level: 'FULL' | 'PARTIAL' | 'TESTING'): CameroonPaymentProviderConfig[] {
        return this.getAllProviders().filter(provider =>
            provider.metadata.integrationLevel === level
        );
    }

    /**
     * Sauvegarde la configuration des fournisseurs dans un fichier
     */
    static async saveToFile(filePath: string): Promise<void> {
        const fs = await import('fs/promises');

        const data = {
            providers: Array.from(this.providers.entries()).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {} as Record<string, CameroonPaymentProviderConfig>),
            lastUpdated: new Date().toISOString()
        };

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    /**
     * Charge la configuration des fournisseurs depuis un fichier
     */
    static async loadFromFile(filePath: string): Promise<void> {
        const fs = await import('fs/promises');

        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const parsed = JSON.parse(data);

            for (const [key, value] of Object.entries(parsed.providers || {})) {
                const providerConfig = value as CameroonPaymentProviderConfig;
                providerConfig.metadata.lastUpdated = new Date(providerConfig.metadata.lastUpdated);

                if (providerConfig.compliance.licenseExpiry) {
                    providerConfig.compliance.licenseExpiry = new Date(providerConfig.compliance.licenseExpiry);
                }

                this.providers.set(key as CameroonPaymentProvider, providerConfig);
            }

            this.initialized = true;
        } catch (error) {
            console.warn(`Impossible de charger la configuration depuis ${filePath}, utilisation de la configuration par défaut`);
            this.initialize();
        }
    }
}

/**
 * Singleton pour accéder aux fournisseurs
 */
export const cameroonPaymentProviders = {
    getProvider: (id: CameroonPaymentProvider) => CameroonPaymentProviders.getProvider(id),
    getAllProviders: () => CameroonPaymentProviders.getAllProviders(),
    getActiveProviders: () => CameroonPaymentProviders.getActiveProviders(),
    getProvidersByCurrency: (currency: string) => CameroonPaymentProviders.getProvidersByCurrency(currency),
    compareFees: (amount: number, providers?: CameroonPaymentProvider[]) =>
        CameroonPaymentProviders.compareFees(amount, providers),
    validateAmountLimits: (providerId: CameroonPaymentProvider, amount: number) =>
        CameroonPaymentProviders.validateAmountLimits(providerId, amount),
    getApiUrl: (providerId: CameroonPaymentProvider, endpoint: string, environment?: Environment) =>
        CameroonPaymentProviders.getApiUrl(providerId, endpoint, environment)
};

/**
 * Démonstration de l'utilisation
 */
export function demonstrateProviders(): void {
    CameroonPaymentProviders.initialize();

    console.log('=== Fournisseurs de paiement Camerounais ===\n');

    // Afficher tous les fournisseurs actifs
    const activeProviders = CameroonPaymentProviders.getActiveProviders();

    console.log(`Fournisseurs actifs: ${activeProviders.length}\n`);

    activeProviders.forEach(provider => {
        console.log(`=== ${provider.name} ===`);
        console.log(`Catégorie: ${provider.metadata.providerCategory}`);
        console.log(`Statut: ${provider.status}`);
        console.log(`Devises: ${provider.supportedCurrencies.join(', ')}`);
        console.log(`Limites: ${provider.limits.minTransaction} - ${provider.limits.maxTransaction} ${provider.supportedCurrencies[0]}`);
        console.log(`Frais dépôt: ${provider.fees.deposit.percentage}% + ${provider.fees.deposit.fixed} fixe`);
        console.log(`Intégration: ${provider.metadata.integrationLevel}`);
        console.log(`Dernière mise à jour: ${provider.metadata.lastUpdated.toLocaleDateString('fr-FR')}`);
        console.log();
    });

    // Comparer les frais
    console.log('=== Comparaison des frais (10,000 XAF) ===\n');

    const comparison = CameroonPaymentProviders.compareFees(10000);
    comparison.forEach(item => {
        console.log(`${item.name}: ${item.totalFees} XAF (${item.percentage}% + ${item.fees}fixed)`);
    });

    // Obtenir les fournisseurs par catégorie
    console.log('\n=== Fournisseurs par catégorie ===\n');

    const categories = ['TELCO', 'BANK', 'FIN_TECH', 'PAYMENT_GATEWAY'];

    categories.forEach(category => {
        const providers = CameroonPaymentProviders.getProvidersByCategory(category);
        if (providers.length > 0) {
            console.log(`${category}: ${providers.length} fournisseur(s)`);
            providers.forEach(p => console.log(`  - ${p.name}`));
        }
    });
}

// Exécuter la démonstration si le fichier est exécuté directement
if (require.main === module) {
    demonstrateProviders();
}