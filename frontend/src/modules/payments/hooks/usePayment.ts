// @ts-nocheck
import { getErrorMessage } from '@/shared/utils/error-handler';
// hooks/usePayment.ts

/**
 * Hook personnalisé pour la gestion des paiements
 * Intégration des systèmes de paiement camerounais (MTN Mobile Money, Orange Money, etc.)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    PAYMENT_METHODS,
    PAYMENT_STATUS,
    CURRENCIES,
    isMobileMoney,
    isCardPayment,
    calculateTransactionFees,
    isAmountWithinLimits,
    formatAmount
} from '../constants/payment.constants';
import {
    CameroonPaymentProvider,
    cameroonPaymentProviders,
    ProviderTransactionResponse
} from '../config/cameroonPaymentProviders';
import {
    getPaymentConfigManager,
    calculatePaymentFees,
    validatePaymentAmount
} from '../config/paymentConfig';
import {
    validatePhoneNumber,
    validatePaymentReference,
    validateAmount as validateAmountUtil
} from '../utils/paymentValidators';

// Types d'erreur de paiement
export type PaymentError = {
    code: string;
    message: string;
    details?: any;
};

// Types de statut de paiement
export type PaymentState = {
    isProcessing: boolean;
    isSuccess: boolean;
    isError: boolean;
    isPending: boolean;
    status: string;
    message: string;
    data: any | null;
    error: PaymentError | null;
};

// Options d'initialisation de paiement
export interface PaymentInitOptions {
    amount: number;
    currency?: string;
    method: keyof typeof PAYMENT_METHODS;
    phoneNumber?: string;
    email?: string;
    customerName?: string;
    customerId?: string;
    orderId?: string;
    description?: string;
    metadata?: Record<string, any>;
    redirectUrl?: string;
    callbackUrl?: string;
}

// Options de vérification de paiement
export interface PaymentVerifyOptions {
    transactionId: string;
    providerReference?: string;
}

// Options de configuration du hook
export interface UsePaymentOptions {
    autoVerify?: boolean;
    verificationInterval?: number;
    maxVerificationAttempts?: number;
    onSuccess?: (data: any) => void;
    onError?: (error: PaymentError) => void;
    onStatusChange?: (status: PaymentState) => void;
}

/**
 * Hook personnalisé pour la gestion des paiements
 */
export const usePayment = (options: UsePaymentOptions = {}) => {
    const router = useRouter();

    // Configuration par défaut
    const config = {
        autoVerify: options.autoVerify ?? true,
        verificationInterval: options.verificationInterval ?? 5000, // 5 secondes
        maxVerificationAttempts: options.maxVerificationAttempts ?? 12, // 1 minute max
        onSuccess: options.onSuccess ?? (() => { }),
        onError: options.onError ?? (() => { }),
        onStatusChange: options.onStatusChange ?? (() => { })
    };

    // États
    const [paymentState, setPaymentState] = useState<PaymentState>({
        isProcessing: false,
        isSuccess: false,
        isError: false,
        isPending: false,
        status: PAYMENT_STATUS.PENDING,
        message: 'Prêt pour le paiement',
        data: null,
        error: null
    });

    const [availableMethods, setAvailableMethods] = useState<string[]>([]);
    const [fees, setFees] = useState<{ fees: number; vat: number; totalFees: number } | null>(null);

    // Références
    const verificationAttempts = useRef(0);
    const verificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentTransactionId = useRef<string | null>(null);

    /**
     * Initialise les méthodes de paiement disponibles
     */
    const initializePaymentMethods = useCallback(async () => {
        try {
            const manager = getPaymentConfigManager();
            const methods = manager.getAvailableMethods();
            setAvailableMethods(methods);
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des méthodes de paiement:', error);
        }
    }, []);

    /**
     * Valide les données de paiement avant initialisation
     */
    const validatePaymentData = useCallback((options: PaymentInitOptions): {
        isValid: boolean;
        errors: string[];
    } => {
        const errors: string[] = [];

        // Validation du montant
        const amountValidation = validateAmountUtil(options.amount.toString(), {
            min: 100,
            max: 10000000,
            currency: options.currency || CURRENCIES.XAF,
            allowDecimals: false
        });

        if (!amountValidation.isValid) {
            errors.push(...amountValidation.errors);
        }

        // Validation de la méthode
        if (!options.method) {
            errors.push('Méthode de paiement requise');
        }

        // Validation du numéro de téléphone pour Mobile Money
        if (isMobileMoney(options.method) && !options.phoneNumber) {
            errors.push('Numéro de téléphone requis pour Mobile Money');
        } else if (options.phoneNumber) {
            const phoneValidation = validatePhoneNumber(options.phoneNumber);
            if (!phoneValidation.isValid) {
                errors.push('Numéro de téléphone invalide');
            }
        }

        // Validation de l'email si fourni
        if (options.email && !/\S+@\S+\.\S+/.test(options.email)) {
            errors.push('Adresse email invalide');
        }

        // Validation de l'ID de commande
        if (!options.orderId) {
            errors.push('ID de commande requis');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, []);

    /**
     * Calcule les frais de transaction
     */
    const calculateFees = useCallback((amount: number, method: string) => {
        try {
            const feeResult = calculateTransactionFees(amount, method);
            setFees(feeResult);
            return feeResult;
        } catch (error) {
            console.error('Erreur lors du calcul des frais:', error);
            return null;
        }
    }, []);

    /**
     * Initialise un paiement
     */
    const initiatePayment = useCallback(async (options: PaymentInitOptions): Promise<{
        success: boolean;
        transactionId?: string;
        paymentUrl?: string;
        qrCode?: string;
        instructions?: string;
        error?: string;
    }> => {
        // Réinitialiser l'état
        setPaymentState({
            isProcessing: true,
            isSuccess: false,
            isError: false,
            isPending: true,
            status: PAYMENT_STATUS.INITIATED,
            message: 'Initialisation du paiement...',
            data: null,
            error: null
        });

        config.onStatusChange?.(paymentState);

        try {
            // Validation des données
            const validation = validatePaymentData(options);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Calcul des frais
            const feeResult = calculateFees(options.amount, options.method);
            if (!feeResult) {
                throw new Error('Impossible de calculer les frais de transaction');
            }

            // Construction de la requête
            const paymentRequest = {
                amount: options.amount,
                currency: options.currency || CURRENCIES.XAF,
                method: options.method,
                customer: {
                    phone: options.phoneNumber,
                    email: options.email,
                    name: options.customerName,
                    id: options.customerId
                },
                order: {
                    id: options.orderId,
                    description: options.description
                },
                metadata: options.metadata || {},
                fees: feeResult,
                callbackUrl: options.callbackUrl || `${window.location.origin}/payment/callback`,
                redirectUrl: options.redirectUrl || `${window.location.origin}/payment/success`
            };

            // Appel à l'API de paiement
            const response = await fetch('/api/payments/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(paymentRequest)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de l\'initialisation du paiement');
            }

            // Mettre à jour l'état
            currentTransactionId.current = data.transactionId;

            setPaymentState({
                isProcessing: false,
                isSuccess: false,
                isError: false,
                isPending: true,
                status: PAYMENT_STATUS.PROCESSING,
                message: data.message || 'Paiement en cours de traitement',
                data: data,
                error: null
            });

            config.onStatusChange?.(paymentState);

            // Démarrer la vérification automatique si configuré
            if (config.autoVerify && data.transactionId) {
                startVerification(data.transactionId, data.providerReference);
            }

            return {
                success: true,
                transactionId: data.transactionId,
                paymentUrl: data.paymentUrl,
                qrCode: data.qrCode,
                instructions: data.instructions
            };

        } catch (error: unknown) {
            const paymentError: PaymentError = {
                code: 'PAYMENT_INIT_FAILED',
                message: `Erreur lors de l'initialisation du paiement: ${getErrorMessage(error)}`,
                details: error
            };

            setPaymentState({
                isProcessing: false,
                isSuccess: false,
                isError: true,
                isPending: false,
                status: PAYMENT_STATUS.FAILED,
                message: paymentError.message,
                data: null,
                error: paymentError
            });

            config.onStatusChange?.(paymentState);
            config.onError?.(paymentError);

            return {
                success: false,
                error: paymentError.message
            };
        }
    }, [validatePaymentData, calculateFees, config]);

    /**
     * Vérifie le statut d'un paiement
     */
    const verifyPayment = useCallback(async (options: PaymentVerifyOptions): Promise<{
        success: boolean;
        status: string;
        data: any;
        error?: string;
    }> => {
        setPaymentState(prev => ({
            ...prev,
            isProcessing: true,
            message: 'Vérification du paiement...'
        }));

        config.onStatusChange?.(paymentState);

        try {
            const response = await fetch(`/api/payments/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    transactionId: options.transactionId,
                    providerReference: options.providerReference
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la vérification du paiement');
            }

            // Mettre à jour l'état en fonction du statut
            const newState: PaymentState = {
                isProcessing: false,
                isSuccess: data.status === PAYMENT_STATUS.SUCCESS || data.status === PAYMENT_STATUS.COMPLETED,
                isError: data.status === PAYMENT_STATUS.FAILED || data.status === PAYMENT_STATUS.CANCELLED,
                isPending: data.status === PAYMENT_STATUS.PENDING || data.status === PAYMENT_STATUS.PROCESSING,
                status: data.status,
                message: data.message || `Statut: ${data.status}`,
                data: data,
                error: null
            };

            setPaymentState(newState);
            config.onStatusChange?.(newState);

            // Appeler les callbacks appropriés
            if (newState.isSuccess) {
                config.onSuccess?.(data);
            } else if (newState.isError) {
                config.onError?.({
                    code: 'PAYMENT_VERIFICATION_FAILED',
                    message: data.message || 'Paiement échoué',
                    details: data
                });
            }

            return {
                success: true,
                status: data.status,
                data: data
            };

        } catch (error: unknown) {
            const paymentError: PaymentError = {
                code: 'VERIFICATION_FAILED',
                message: getErrorMessage(error),
                details: error
            };

            const errorState: PaymentState = {
                isProcessing: false,
                isSuccess: false,
                isError: true,
                isPending: false,
                status: PAYMENT_STATUS.FAILED,
                message: paymentError.message,
                data: null,
                error: paymentError
            };

            setPaymentState(errorState);
            config.onStatusChange?.(errorState);
            config.onError?.(paymentError);

            return {
                success: false,
                status: PAYMENT_STATUS.FAILED,
                data: null,
                error: paymentError.message
            };
        }
    }, [config]);

    /**
     * Démarre la vérification automatique
     */
    const startVerification = useCallback((transactionId: string, providerReference?: string) => {
        // Arrêter toute vérification en cours
        stopVerification();

        verificationAttempts.current = 0;

        const verify = async () => {
            if (verificationAttempts.current >= config.maxVerificationAttempts) {
                stopVerification();

                const timeoutError: PaymentError = {
                    code: 'VERIFICATION_TIMEOUT',
                    message: 'Délai de vérification dépassé. Veuillez vérifier manuellement.',
                    details: { transactionId, attempts: verificationAttempts.current }
                };

                setPaymentState(prev => ({
                    ...prev,
                    isProcessing: false,
                    isError: true,
                    isPending: false,
                    status: PAYMENT_STATUS.FAILED,
                    message: timeoutError.message,
                    error: timeoutError
                }));

                config.onError?.(timeoutError);
                return;
            }

            const result = await verifyPayment({ transactionId, providerReference });

            // Arrêter la vérification si le paiement est terminé (succès ou échec)
            if (result.success &&
                (result.status === PAYMENT_STATUS.SUCCESS ||
                    result.status === PAYMENT_STATUS.COMPLETED ||
                    result.status === PAYMENT_STATUS.FAILED ||
                    result.status === PAYMENT_STATUS.CANCELLED)) {
                stopVerification();
            }

            verificationAttempts.current++;
        };

        // Première vérification immédiate
        verify();

        // Programmer les vérifications suivantes
        verificationIntervalRef.current = setInterval(verify, config.verificationInterval);
    }, [config.maxVerificationAttempts, config.verificationInterval, verifyPayment, config]);

    /**
     * Arrête la vérification automatique
     */
    const stopVerification = useCallback(() => {
        if (verificationIntervalRef.current) {
            clearInterval(verificationIntervalRef.current);
            verificationIntervalRef.current = null;
        }
        verificationAttempts.current = 0;
    }, []);

    /**
     * Initialise un paiement Mobile Money
     */
    const initiateMobileMoneyPayment = useCallback(async (
        amount: number,
        phoneNumber: string,
        operator: 'MTN' | 'ORANGE' | 'EXPRESS_UNION',
        orderId: string,
        customerName?: string
    ) => {
        const method = operator === 'MTN'
            ? PAYMENT_METHODS.MTN_MOBILE_MONEY
            : operator === 'ORANGE'
                ? PAYMENT_METHODS.ORANGE_MONEY
                : PAYMENT_METHODS.EXPRESS_UNION_MOBILE;

        return initiatePayment({
            amount,
            currency: CURRENCIES.XAF,
            method,
            phoneNumber,
            orderId,
            customerName,
            description: `Paiement Mobile Money ${operator}`
        });
    }, [initiatePayment]);

    /**
     * Initialise un paiement par carte bancaire
     */
    const initiateCardPayment = useCallback(async (
        amount: number,
        cardToken: string,
        orderId: string,
        customerEmail: string,
        customerName?: string
    ) => {
        return initiatePayment({
            amount,
            currency: CURRENCIES.XAF,
            method: PAYMENT_METHODS.VISA, // ou MASTERCARD selon la carte
            email: customerEmail,
            orderId,
            customerName,
            description: 'Paiement par carte bancaire',
            metadata: { cardToken }
        });
    }, [initiatePayment]);

    /**
     * Annule un paiement en cours
     */
    const cancelPayment = useCallback(async (transactionId: string): Promise<{
        success: boolean;
        message: string;
        error?: string;
    }> => {
        try {
            const response = await fetch(`/api/payments/${transactionId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de l\'annulation du paiement');
            }

            // Arrêter la vérification
            stopVerification();

            // Mettre à jour l'état
            setPaymentState({
                isProcessing: false,
                isSuccess: false,
                isError: false,
                isPending: false,
                status: PAYMENT_STATUS.CANCELLED,
                message: data.message || 'Paiement annulé',
                data: data,
                error: null
            });

            return {
                success: true,
                message: data.message
            };

        } catch (error: unknown) {
            const paymentError: PaymentError = {
                code: 'CANCELLATION_FAILED',
                message: `Erreur lors de l'annulation du paiement: ${getErrorMessage(error)}`,
                details: error
            };

            setPaymentState(prev => ({
                ...prev,
                error: paymentError
            }));

            return {
                success: false,
                message: paymentError.message,
                error: paymentError.message
            };
        }
    }, [stopVerification]);

    /**
     * Rembourse un paiement
     */
    const refundPayment = useCallback(async (
        transactionId: string,
        amount?: number,
        reason?: string
    ): Promise<{
        success: boolean;
        refundId?: string;
        message: string;
        error?: string;
    }> => {
        try {
            const response = await fetch(`/api/payments/${transactionId}/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ amount, reason })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec du remboursement');
            }

            return {
                success: true,
                refundId: data.refundId,
                message: data.message
            };

        } catch (error: unknown) {
            return {
                success: false,
                message: getErrorMessage(error),
                error: getErrorMessage(error)
            };
        }
    }, []);

    /**
     * Récupère l'historique des paiements
     */
    const getPaymentHistory = useCallback(async (
        filters?: {
            startDate?: string;
            endDate?: string;
            status?: string;
            method?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<{
        success: boolean;
        payments: any[];
        pagination?: any;
        error?: string;
    }> => {
        try {
            const queryParams = new URLSearchParams();
            if (filters?.startDate) queryParams.append('startDate', filters.startDate);
            if (filters?.endDate) queryParams.append('endDate', filters.endDate);
            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.method) queryParams.append('method', filters.method);
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.limit) queryParams.append('limit', filters.limit.toString());

            const response = await fetch(`/api/payments/history?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la récupération de l\'historique');
            }

            return {
                success: true,
                payments: data.payments,
                pagination: data.pagination
            };

        } catch (error: unknown) {
            return {
                success: false,
                payments: [],
                error: `Erreur lors du chargement de l'historique: ${getErrorMessage(error)}`
            };
        }
    }, []);

    /**
     * Réessaie un paiement échoué
     */
    const retryPayment = useCallback(async (transactionId: string): Promise<{
        success: boolean;
        newTransactionId?: string;
        message: string;
        error?: string;
    }> => {
        try {
            const response = await fetch(`/api/payments/${transactionId}/retry`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la nouvelle tentative');
            }

            // Démarrer la vérification automatique
            if (config.autoVerify && data.transactionId) {
                startVerification(data.transactionId);
            }

            return {
                success: true,
                newTransactionId: data.transactionId,
                message: data.message
            };

        } catch (error: unknown) {
            return {
                success: false,
                message: getErrorMessage(error),
                error: getErrorMessage(error)
            };
        }
    }, [config.autoVerify, startVerification]);

    /**
     * Réinitialise l'état du paiement
     */
    const resetPayment = useCallback(() => {
        stopVerification();
        currentTransactionId.current = null;
        setFees(null);
        setPaymentState({
            isProcessing: false,
            isSuccess: false,
            isError: false,
            isPending: false,
            status: PAYMENT_STATUS.PENDING,
            message: 'Prêt pour le paiement',
            data: null,
            error: null
        });
    }, [stopVerification]);

    /**
     * Formate un montant pour l'affichage
     */
    const formatPaymentAmount = useCallback((amount: number, currency: string = CURRENCIES.XAF): string => {
        return formatAmount(amount, currency);
    }, []);

    /**
     * Vérifie si un montant est valide pour une méthode de paiement
     */
    const validatePaymentAmount = useCallback((amount: number, method: string): boolean => {
        return isAmountWithinLimits(amount, method);
    }, []);

    // Initialisation au montage
    useEffect(() => {
        initializePaymentMethods();

        // Nettoyage à la destruction
        return () => {
            stopVerification();
        };
    }, [initializePaymentMethods, stopVerification]);

    // Gestion du callback de paiement depuis l'URL
    useEffect(() => {
        const { transaction_id, status, error } = router.query;

        if (transaction_id && typeof transaction_id === 'string') {
            if (status === 'success' || status === 'failed') {
                verifyPayment({ transactionId: transaction_id });
            }
        }

        if (error) {
            setPaymentState(prev => ({
                ...prev,
                isError: true,
                message: `Erreur: ${error}`,
                error: {
                    code: 'PAYMENT_CALLBACK_ERROR',
                    message: String(error),
                    details: router.query
                }
            }));
        }
    }, [router.query, verifyPayment]);

    return {
        // États
        paymentState,
        availableMethods,
        fees,
        currentTransactionId: currentTransactionId.current,

        // Méthodes principales
        initiatePayment,
        verifyPayment,
        cancelPayment,
        refundPayment,
        retryPayment,
        resetPayment,

        // Méthodes spécifiques
        initiateMobileMoneyPayment,
        initiateCardPayment,

        // Utilitaires
        getPaymentHistory,
        formatPaymentAmount,
        validatePaymentAmount,
        calculateFees: (amount: number, method: string) => calculateFees(amount, method),

        // Contrôle de la vérification
        startVerification,
        stopVerification,

        // Statuts dérivés
        isProcessing: paymentState.isProcessing,
        isSuccess: paymentState.isSuccess,
        isError: paymentState.isError,
        isPending: paymentState.isPending,
        status: paymentState.status,
        message: paymentState.message,
        error: paymentState.error,
        data: paymentState.data
    };
};

/**
 * Hook simplifié pour l'utilisation des paiements
 */
export const usePaymentSimple = () => {
    const payment = usePayment({
        autoVerify: true,
        verificationInterval: 3000,
        maxVerificationAttempts: 20,
        onSuccess: (data) => {
            console.log('Paiement réussi:', data);
            // Redirection ou mise à jour de l'interface
        },
        onError: (error) => {
            console.error('Erreur de paiement:', error);
            // Affichage d'un message d'erreur
        }
    });

    return payment;
};

/**
 * Hook pour les paiements Mobile Money
 */
export const useMobileMoneyPayment = () => {
    const payment = usePayment();
    const [operator, setOperator] = useState<'MTN' | 'ORANGE' | 'EXPRESS_UNION'>('MTN');

    const payWithMobileMoney = useCallback(async (
        amount: number,
        phoneNumber: string,
        orderId: string,
        customerName?: string
    ) => {
        return payment.initiateMobileMoneyPayment(
            amount,
            phoneNumber,
            operator,
            orderId,
            customerName
        );
    }, [payment, operator]);

    return {
        ...payment,
        operator,
        setOperator,
        payWithMobileMoney
    };
};

/**
 * Hook pour les paiements par carte
 */
export const useCardPayment = () => {
    const payment = usePayment();
    const [cardDetails, setCardDetails] = useState<any>(null);

    const payWithCard = useCallback(async (
        amount: number,
        cardToken: string,
        orderId: string,
        customerEmail: string,
        customerName?: string
    ) => {
        return payment.initiateCardPayment(
            amount,
            cardToken,
            orderId,
            customerEmail,
            customerName
        );
    }, [payment]);

    return {
        ...payment,
        cardDetails,
        setCardDetails,
        payWithCard
    };
};

export default usePayment;