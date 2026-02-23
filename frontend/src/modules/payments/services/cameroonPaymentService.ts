// @ts-nocheck
// frontend/src/modules/payments/services/cameroonPaymentService.ts
import axios, { AxiosResponse } from 'axios'
import type {
    CameroonPaymentRequest,
    MobileMoneyPayment,
    MobileMoneyTransfer,
    MobileMoneyWithdrawal,
    MobileMoneyDeposit,
    MobileMoneyBalance,
    MobileMoneyTransaction,
    MobileMoneyTransactionStatus,
    CameroonPaymentProvider,
    PaymentProviderConfig,
    USSDCode,
    CameroonBankDetails,
    MTNPaymentRequest,
    OrangeMoneyPayment,
    ExpressUnionPayment,
    MobileMoneyCallback,
    PaymentSimulation
} from '../types/cameroon-payment.types'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { formatCurrencyXAF } from '../utils/currencyFormatter'
import { validatePhoneNumber, validateMTNNumber, validateOrangeNumber } from '../utils/cameroonPaymentUtils'
import {
    CAMEROON_PAYMENT_PROVIDERS,
    MOBILE_MONEY_TRANSACTION_TYPES,
    USSD_CODES,
    FIXED_CHARGES,
    BANK_CODES
} from '../constants/cameroon.constants'

// Client axios partagé
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 45000, // 45 secondes pour les paiements Mobile Money
    headers: {
        'Content-Type': 'application/json',
    }
})

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        const token = authStore.token

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Ajouter l'en-tête spécifique pour les paiements Cameroun
        if (config.url?.includes('/cameroon/')) {
            config.headers['X-Payment-Region'] = 'CM'
            config.headers['X-Payment-Provider'] = config.data?.provider || 'unknown'
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * Service spécifique pour les paiements au Cameroun
 */
class CameroonPaymentService {
    // ============ PAYMENTS MOBILE MONEY ============

    /**
     * Initier un paiement Mobile Money
     */
    async initiateMobileMoneyPayment(paymentData: CameroonPaymentRequest): Promise<MobileMoneyPayment> {
        try {
            // Validation du numéro de téléphone selon le fournisseur
            this.validateMobileMoneyPhoneNumber(paymentData.phoneNumber, paymentData.provider)

            const response: AxiosResponse<MobileMoneyPayment> = await apiClient.post(
                '/v1/cameroon/payments/mobile-money/initiate',
                {
                    ...paymentData,
                    currency: 'XAF',
                    country: 'CM'
                }
            )

            return this.formatMobileMoneyPayment(response.data)
        } catch (error: unknown) {
            console.error('Erreur initiation paiement Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du paiement Mobile Money')
        }
    }

    /**
     * Confirmer un paiement Mobile Money avec code USSD/PIN
     */
    async confirmMobileMoneyPayment(
        transactionId: string,
        pinCode: string,
        provider: string
    ): Promise<MobileMoneyPayment> {
        try {
            const response: AxiosResponse<MobileMoneyPayment> = await apiClient.post(
                '/v1/cameroon/payments/mobile-money/confirm',
                {
                    transactionId,
                    pinCode,
                    provider
                }
            )

            return this.formatMobileMoneyPayment(response.data)
        } catch (error: unknown) {
            console.error('Erreur confirmation paiement Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la confirmation du paiement Mobile Money')
        }
    }

    /**
     * Vérifier le statut d'un paiement Mobile Money
     */
    async checkMobileMoneyStatus(transactionId: string): Promise<MobileMoneyTransactionStatus> {
        try {
            const response: AxiosResponse<MobileMoneyTransactionStatus> = await apiClient.get(
                `/v1/cameroon/payments/mobile-money/status/${transactionId}`
            )

            return {
                ...response.data,
                formattedAmount: response.data.amount ? formatCurrencyXAF(response.data.amount) : undefined,
                transactionTime: response.data.transactionTime ? new Date(response.data.transactionTime) : undefined,
                checkedAt: new Date(response.data.checkedAt)
            }
        } catch (error: unknown) {
            console.error('Erreur vérification statut Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut')
        }
    }

    /**
     * Annuler un paiement Mobile Money en attente
     */
    async cancelMobileMoneyPayment(transactionId: string): Promise<MobileMoneyPayment> {
        try {
            const response: AxiosResponse<MobileMoneyPayment> = await apiClient.post(
                `/v1/cameroon/payments/mobile-money/cancel/${transactionId}`
            )

            return this.formatMobileMoneyPayment(response.data)
        } catch (error: unknown) {
            console.error('Erreur annulation paiement Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'annulation du paiement')
        }
    }

    // ============ TRANSFERTS MOBILE MONEY ============

    /**
     * Effectuer un transfert Mobile Money
     */
    async transferMobileMoney(transferData: {
        fromPhone: string
        toPhone: string
        amount: number
        provider: string
        pinCode: string
        reason?: string
    }): Promise<MobileMoneyTransfer> {
        try {
            // Validation des numéros
            this.validateMobileMoneyPhoneNumber(transferData.fromPhone, transferData.provider)
            this.validateMobileMoneyPhoneNumber(transferData.toPhone, transferData.provider)

            const response: AxiosResponse<MobileMoneyTransfer> = await apiClient.post(
                '/v1/cameroon/transfers/mobile-money',
                {
                    ...transferData,
                    currency: 'XAF'
                }
            )

            return {
                ...response.data,
                formattedAmount: formatCurrencyXAF(response.data.amount),
                formattedFees: response.data.fees ? formatCurrencyXAF(response.data.fees) : '0 FCFA',
                formattedTotal: formatCurrencyXAF(response.data.amount + (response.data.fees || 0)),
                transactionDate: new Date(response.data.transactionDate),
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur transfert Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du transfert Mobile Money')
        }
    }

    /**
     * Effectuer un retrait Mobile Money
     */
    async withdrawMobileMoney(withdrawalData: {
        phoneNumber: string
        amount: number
        provider: string
        pinCode: string
        agentCode?: string
    }): Promise<MobileMoneyWithdrawal> {
        try {
            const response: AxiosResponse<MobileMoneyWithdrawal> = await apiClient.post(
                '/v1/cameroon/withdrawals/mobile-money',
                withdrawalData
            )

            return {
                ...response.data,
                formattedAmount: formatCurrencyXAF(response.data.amount),
                formattedFees: response.data.fees ? formatCurrencyXAF(response.data.fees) : '0 FCFA',
                withdrawalDate: new Date(response.data.withdrawalDate),
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur retrait Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du retrait Mobile Money')
        }
    }

    /**
     * Effectuer un dépôt Mobile Money
     */
    async depositMobileMoney(depositData: {
        phoneNumber: string
        amount: number
        provider: string
        agentCode: string
    }): Promise<MobileMoneyDeposit> {
        try {
            const response: AxiosResponse<MobileMoneyDeposit> = await apiClient.post(
                '/v1/cameroon/deposits/mobile-money',
                depositData
            )

            return {
                ...response.data,
                formattedAmount: formatCurrencyXAF(response.data.amount),
                formattedFees: response.data.fees ? formatCurrencyXAF(response.data.fees) : '0 FCFA',
                depositDate: new Date(response.data.depositDate),
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur dépôt Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du dépôt Mobile Money')
        }
    }

    // ============ SOLDE ET HISTORIQUE ============

    /**
     * Vérifier le solde Mobile Money
     */
    async checkMobileMoneyBalance(phoneNumber: string, provider: string): Promise<MobileMoneyBalance> {
        try {
            const response: AxiosResponse<MobileMoneyBalance> = await apiClient.post(
                '/v1/cameroon/mobile-money/balance',
                { phoneNumber, provider }
            )

            return {
                ...response.data,
                formattedBalance: formatCurrencyXAF(response.data.balance),
                formattedAvailableBalance: formatCurrencyXAF(response.data.availableBalance),
                lastChecked: new Date(response.data.lastChecked)
            }
        } catch (error: unknown) {
            console.error('Erreur vérification solde Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du solde')
        }
    }

    /**
     * Obtenir l'historique des transactions Mobile Money
     */
    async getMobileMoneyHistory(params: {
        phoneNumber: string
        provider: string
        startDate?: Date
        endDate?: Date
        type?: string
        limit?: number
    }): Promise<MobileMoneyTransaction[]> {
        try {
            const response: AxiosResponse<MobileMoneyTransaction[]> = await apiClient.post(
                '/v1/cameroon/mobile-money/history',
                params
            )

            return response.data.map(transaction => ({
                ...transaction,
                formattedAmount: formatCurrencyXAF(transaction.amount),
                transactionDate: new Date(transaction.transactionDate),
                createdAt: new Date(transaction.createdAt)
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération historique Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement de l\'historique')
        }
    }

    // ============ FOURNISSEURS ET DISPONIBILITÉ ============

    /**
     * Obtenir les fournisseurs disponibles au Cameroun
     */
    async getAvailableProviders(): Promise<CameroonPaymentProvider[]> {
        try {
            const response: AxiosResponse<CameroonPaymentProvider[]> = await apiClient.get(
                '/v1/cameroon/providers'
            )

            return response.data.map(provider => this.formatCameroonProvider(provider))
        } catch (error: unknown) {
            console.error('Erreur récupération fournisseurs:', error)
            // Retourner les fournisseurs par défaut
            return this.getDefaultCameroonProviders()
        }
    }

    /**
     * Vérifier la disponibilité d'un fournisseur
     */
    async checkProviderAvailability(providerCode: string): Promise<{
        available: boolean
        responseTime: number
        maintenance?: boolean
        maintenanceMessage?: string
        estimatedRestoreTime?: Date
    }> {
        try {
            const response: AxiosResponse = await apiClient.get(
                `/v1/cameroon/providers/${providerCode}/availability`
            )

            return {
                ...response.data,
                estimatedRestoreTime: response.data.estimatedRestoreTime
                    ? new Date(response.data.estimatedRestoreTime)
                    : undefined
            }
        } catch (error: unknown) {
            console.error('Erreur vérification disponibilité fournisseur:', error)
            return {
                available: false,
                responseTime: 0,
                maintenance: true,
                maintenanceMessage: 'Service temporairement indisponible'
            }
        }
    }

    /**
     * Obtenir la configuration d'un fournisseur
     */
    async getProviderConfig(providerCode: string): Promise<PaymentProviderConfig> {
        try {
            const response: AxiosResponse<PaymentProviderConfig> = await apiClient.get(
                `/v1/cameroon/providers/${providerCode}/config`
            )

            return {
                ...response.data,
                formattedMinAmount: response.data.minAmount ? formatCurrencyXAF(response.data.minAmount) : undefined,
                formattedMaxAmount: response.data.maxAmount ? formatCurrencyXAF(response.data.maxAmount) : undefined,
                formattedFees: response.data.fees
                    ? `${response.data.fees.percentage}% + ${formatCurrencyXAF(response.data.fees.fixed)}`
                    : 'Aucun frais'
            }
        } catch (error: unknown) {
            console.error('Erreur récupération configuration fournisseur:', error)
            // Retourner une configuration par défaut
            return this.getDefaultProviderConfig(providerCode)
        }
    }

    // ============ MTN MOBILE MONEY ============

    /**
     * Initier un paiement MTN Mobile Money
     */
    async initiateMTNPayment(paymentData: MTNPaymentRequest): Promise<MobileMoneyPayment> {
        try {
            // Validation spécifique MTN
            if (!validateMTNNumber(paymentData.phoneNumber)) {
                throw new Error('Numéro MTN invalide. Format: 6XXXXXXXX')
            }

            const response: AxiosResponse<MobileMoneyPayment> = await apiClient.post(
                '/v1/cameroon/mtn/initiate-payment',
                {
                    ...paymentData,
                    service: 'PAYMENT',
                    channel: 'WEB'
                }
            )

            return this.formatMobileMoneyPayment(response.data)
        } catch (error: unknown) {
            console.error('Erreur initiation paiement MTN:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du paiement MTN')
        }
    }

    /**
     * Effectuer un transfert MTN à MTN
     */
    async mtnToMtnTransfer(transferData: {
        senderPhone: string
        receiverPhone: string
        amount: number
        pinCode: string
        reason?: string
    }): Promise<MobileMoneyTransfer> {
        try {
            const response: AxiosResponse<MobileMoneyTransfer> = await apiClient.post(
                '/v1/cameroon/mtn/transfer',
                transferData
            )

            return {
                ...response.data,
                formattedAmount: formatCurrencyXAF(response.data.amount),
                formattedFees: response.data.fees ? formatCurrencyXAF(response.data.fees) : '0 FCFA',
                transactionDate: new Date(response.data.transactionDate),
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur transfert MTN:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du transfert MTN')
        }
    }

    /**
     * Vérifier le statut d'une transaction MTN
     */
    async checkMTNTransactionStatus(transactionId: string): Promise<MobileMoneyTransactionStatus> {
        try {
            const response: AxiosResponse<MobileMoneyTransactionStatus> = await apiClient.get(
                `/v1/cameroon/mtn/transaction-status/${transactionId}`
            )

            return {
                ...response.data,
                formattedAmount: response.data.amount ? formatCurrencyXAF(response.data.amount) : undefined,
                transactionTime: response.data.transactionTime ? new Date(response.data.transactionTime) : undefined,
                checkedAt: new Date(response.data.checkedAt)
            }
        } catch (error: unknown) {
            console.error('Erreur vérification statut MTN:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut MTN')
        }
    }

    // ============ ORANGE MONEY ============

    /**
     * Initier un paiement Orange Money
     */
    async initiateOrangeMoneyPayment(paymentData: OrangeMoneyPayment): Promise<MobileMoneyPayment> {
        try {
            // Validation spécifique Orange
            if (!validateOrangeNumber(paymentData.phoneNumber)) {
                throw new Error('Numéro Orange invalide. Format: 6XXXXXXXX ou 9XXXXXXXX')
            }

            const response: AxiosResponse<MobileMoneyPayment> = await apiClient.post(
                '/v1/cameroon/orange/initiate-payment',
                {
                    ...paymentData,
                    service: 'PAYMENT',
                    channel: 'WEB'
                }
            )

            return this.formatMobileMoneyPayment(response.data)
        } catch (error: unknown) {
            console.error('Erreur initiation paiement Orange:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du paiement Orange')
        }
    }

    /**
     * Effectuer un transfert Orange Money
     */
    async orangeMoneyTransfer(transferData: {
        senderPhone: string
        receiverPhone: string
        amount: number
        pinCode: string
        reason?: string
    }): Promise<MobileMoneyTransfer> {
        try {
            const response: AxiosResponse<MobileMoneyTransfer> = await apiClient.post(
                '/v1/cameroon/orange/transfer',
                transferData
            )

            return {
                ...response.data,
                formattedAmount: formatCurrencyXAF(response.data.amount),
                formattedFees: response.data.fees ? formatCurrencyXAF(response.data.fees) : '0 FCFA',
                transactionDate: new Date(response.data.transactionDate),
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur transfert Orange:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du transfert Orange')
        }
    }

    // ============ EXPRESS UNION ============

    /**
     * Initier un paiement Express Union
     */
    async initiateExpressUnionPayment(paymentData: ExpressUnionPayment): Promise<MobileMoneyPayment> {
        try {
            const response: AxiosResponse<MobileMoneyPayment> = await apiClient.post(
                '/v1/cameroon/express-union/initiate-payment',
                {
                    ...paymentData,
                    service: 'PAYMENT',
                    requiresPhoneNumber: paymentData.requiresPhoneNumber !== false
                }
            )

            return this.formatMobileMoneyPayment(response.data)
        } catch (error: unknown) {
            console.error('Erreur initiation paiement Express Union:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du paiement Express Union')
        }
    }

    /**
     * Effectuer un virement Express Union
     */
    async expressUnionTransfer(transferData: {
        senderAccount: string
        receiverAccount: string
        amount: number
        pinCode: string
        transferType: 'account' | 'phone' | 'card'
    }): Promise<MobileMoneyTransfer> {
        try {
            const response: AxiosResponse<MobileMoneyTransfer> = await apiClient.post(
                '/v1/cameroon/express-union/transfer',
                transferData
            )

            return {
                ...response.data,
                formattedAmount: formatCurrencyXAF(response.data.amount),
                formattedFees: response.data.fees ? formatCurrencyXAF(response.data.fees) : '0 FCFA',
                transactionDate: new Date(response.data.transactionDate),
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur transfert Express Union:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du transfert Express Union')
        }
    }

    // ============ BANQUES LOCALES ============

    /**
     * Obtenir les détails des banques locales
     */
    async getLocalBanks(): Promise<CameroonBankDetails[]> {
        try {
            const response: AxiosResponse<CameroonBankDetails[]> = await apiClient.get(
                '/v1/cameroon/banks'
            )

            return response.data.map(bank => ({
                ...bank,
                formattedTransferLimit: bank.transferLimit ? formatCurrencyXAF(bank.transferLimit) : undefined,
                formattedDailyLimit: bank.dailyLimit ? formatCurrencyXAF(bank.dailyLimit) : undefined
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération banques locales:', error)
            return this.getDefaultCameroonBanks()
        }
    }

    /**
     * Initier un virement bancaire local
     */
    async initiateLocalBankTransfer(transferData: {
        bankCode: string
        accountNumber: string
        accountName: string
        amount: number
        reference: string
        narration?: string
    }): Promise<{
        transactionId: string
        reference: string
        amount: number
        fees: number
        netAmount: number
        estimatedCompletion: Date
        formattedAmount: string
        formattedFees: string
        formattedNetAmount: string
    }> {
        try {
            const response: AxiosResponse = await apiClient.post(
                '/v1/cameroon/banks/transfer',
                transferData
            )

            return {
                ...response.data,
                formattedAmount: formatCurrencyXAF(response.data.amount),
                formattedFees: response.data.fees ? formatCurrencyXAF(response.data.fees) : '0 FCFA',
                formattedNetAmount: formatCurrencyXAF(response.data.netAmount),
                estimatedCompletion: new Date(response.data.estimatedCompletion)
            }
        } catch (error: unknown) {
            console.error('Erreur initiation virement bancaire:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'initiation du virement bancaire')
        }
    }

    // ============ USSD ET CODES ============

    /**
     * Obtenir les codes USSD pour les opérations
     */
    async getUSSDServices(): Promise<USSDCode[]> {
        try {
            const response: AxiosResponse<USSDCode[]> = await apiClient.get('/v1/cameroon/ussd')
            return response.data
        } catch (error: unknown) {
            console.error('Erreur récupération codes USSD:', error)
            return this.getDefaultUSSDServices()
        }
    }

    /**
     * Générer un code USSD pour paiement
     */
    async generateUSSDPaymentCode(paymentData: {
        amount: number
        phoneNumber: string
        provider: string
        reference: string
    }): Promise<{
        ussdCode: string
        instructions: string[]
        expiresAt: Date
        formattedAmount: string
    }> {
        try {
            const response: AxiosResponse = await apiClient.post('/v1/cameroon/ussd/generate', paymentData)

            return {
                ...response.data,
                expiresAt: new Date(response.data.expiresAt),
                formattedAmount: formatCurrencyXAF(response.data.amount)
            }
        } catch (error: unknown) {
            console.error('Erreur génération code USSD:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la génération du code USSD')
        }
    }

    // ============ CALLBACKS ET WEBHOOKS ============

    /**
     * Enregistrer un callback URL pour les notifications
     */
    async registerPaymentCallback(callbackData: {
        url: string
        events: string[]
        provider: string
        secret?: string
    }): Promise<{
        callbackId: string
        url: string
        events: string[]
        secret: string
        createdAt: Date
    }> {
        try {
            const response: AxiosResponse = await apiClient.post('/v1/cameroon/callbacks/register', callbackData)

            return {
                ...response.data,
                createdAt: new Date(response.data.createdAt)
            }
        } catch (error: unknown) {
            console.error('Erreur enregistrement callback:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'enregistrement du callback')
        }
    }

    /**
     * Simuler un callback de paiement (pour test)
     */
    async simulatePaymentCallback(callbackData: MobileMoneyCallback): Promise<{
        success: boolean
        message: string
        simulatedAt: Date
    }> {
        try {
            const response: AxiosResponse = await apiClient.post('/v1/cameroon/callbacks/simulate', callbackData)

            return {
                ...response.data,
                simulatedAt: new Date(response.data.simulatedAt)
            }
        } catch (error: unknown) {
            console.error('Erreur simulation callback:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la simulation du callback')
        }
    }

    // ============ SIMULATION ET TEST ============

    /**
     * Simuler un paiement Mobile Money (pour développement)
     */
    async simulateMobileMoneyPayment(simulationData: PaymentSimulation): Promise<MobileMoneyPayment> {
        try {
            const response: AxiosResponse<MobileMoneyPayment> = await apiClient.post(
                '/v1/cameroon/simulate/payment',
                simulationData
            )

            return this.formatMobileMoneyPayment(response.data)
        } catch (error: unknown) {
            console.error('Erreur simulation paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la simulation du paiement')
        }
    }

    /**
     * Tester la connexion à un fournisseur
     */
    async testProviderConnection(providerCode: string): Promise<{
        connected: boolean
        responseTime: number
        providerStatus: string
        apiVersion?: string
        testedAt: Date
    }> {
        try {
            const response: AxiosResponse = await apiClient.get(
                `/v1/cameroon/providers/${providerCode}/test`
            )

            return {
                ...response.data,
                testedAt: new Date(response.data.testedAt)
            }
        } catch (error: unknown) {
            console.error('Erreur test connexion fournisseur:', error)
            return {
                connected: false,
                responseTime: 0,
                providerStatus: 'OFFLINE',
                testedAt: new Date()
            }
        }
    }

    // ============ FONCTIONS UTILITAIRES ============

    /**
     * Formater un paiement Mobile Money
     */
    private formatMobileMoneyPayment(payment: MobileMoneyPayment): MobileMoneyPayment {
        return {
            ...payment,
            formattedAmount: formatCurrencyXAF(payment.amount),
            formattedFees: payment.fees ? formatCurrencyXAF(payment.fees) : '0 FCFA',
            formattedTotal: formatCurrencyXAF(payment.amount + (payment.fees || 0)),
            initiationTime: new Date(payment.initiationTime),
            expirationTime: payment.expirationTime ? new Date(payment.expirationTime) : undefined,
            completionTime: payment.completionTime ? new Date(payment.completionTime) : undefined,
            createdAt: new Date(payment.createdAt)
        }
    }

    /**
     * Formater un fournisseur Cameroun
     */
    private formatCameroonProvider(provider: CameroonPaymentProvider): CameroonPaymentProvider {
        return {
            ...provider,
            formattedFees: provider.fees
                ? `${provider.fees.percentage}% + ${formatCurrencyXAF(provider.fees.fixed)}`
                : 'Aucun frais',
            supportedSince: provider.supportedSince ? new Date(provider.supportedSince) : undefined,
            lastMaintenance: provider.lastMaintenance ? new Date(provider.lastMaintenance) : undefined
        }
    }

    /**
     * Valider un numéro de téléphone Mobile Money
     */
    private validateMobileMoneyPhoneNumber(phoneNumber: string, provider: string): void {
        switch (provider.toUpperCase()) {
            case 'MTN':
                if (!validateMTNNumber(phoneNumber)) {
                    throw new Error('Numéro MTN invalide. Format: 6XXXXXXXX')
                }
                break
            case 'ORANGE':
                if (!validateOrangeNumber(phoneNumber)) {
                    throw new Error('Numéro Orange invalide. Format: 6XXXXXXXX ou 9XXXXXXXX')
                }
                break
            default:
                if (!validatePhoneNumber(phoneNumber)) {
                    throw new Error('Numéro de téléphone invalide')
                }
        }
    }

    /**
     * Calculer les frais Mobile Money
     */
    calculateMobileMoneyFees(amount: number, provider: string): {
        fees: number
        netAmount: number
        breakdown: {
            providerFee: number
            tax: number
            platformFee: number
            total: number
        }
    } {
        const providerConfig = this.getDefaultProviderConfig(provider)

        if (!providerConfig.fees) {
            return {
                fees: 0,
                netAmount: amount,
                breakdown: {
                    providerFee: 0,
                    tax: 0,
                    platformFee: 0,
                    total: 0
                }
            }
        }

        const providerFee = amount * (providerConfig.fees.percentage / 100) + providerConfig.fees.fixed
        const tax = providerFee * 0.1975 // TVA 19.75%
        const platformFee = amount * 0.005 // 0.5% frais plateforme
        const totalFees = providerFee + tax + platformFee
        const netAmount = amount - totalFees

        return {
            fees: totalFees,
            netAmount,
            breakdown: {
                providerFee,
                tax,
                platformFee,
                total: totalFees
            }
        }
    }

    /**
     * Obtenir les fournisseurs par défaut
     */
    private getDefaultCameroonProviders(): CameroonPaymentProvider[] {
        return [
            {
                id: 'mtn_money',
                name: 'MTN Mobile Money',
                code: 'MTN',
                logo: '/assets/images/mobile-money/mtn-money.png',
                isActive: true,
                fees: { percentage: 1.5, fixed: 0 },
                countries: ['CM'],
                requiresPhoneNumber: true,
                transactionTypes: MOBILE_MONEY_TRANSACTION_TYPES,
                minAmount: 100,
                maxAmount: 1000000,
                formattedFees: '1.5%',
                supportedSince: new Date('2010-01-01')
            },
            {
                id: 'orange_money',
                name: 'Orange Money',
                code: 'OM',
                logo: '/assets/images/mobile-money/orange-money.png',
                isActive: true,
                fees: { percentage: 1.2, fixed: 50 },
                countries: ['CM'],
                requiresPhoneNumber: true,
                transactionTypes: MOBILE_MONEY_TRANSACTION_TYPES,
                minAmount: 100,
                maxAmount: 1000000,
                formattedFees: '1.2% + 50 FCFA',
                supportedSince: new Date('2012-01-01')
            },
            {
                id: 'express_union',
                name: 'Express Union',
                code: 'EU',
                logo: '/assets/images/mobile-money/express-union.png',
                isActive: true,
                fees: { percentage: 0.8, fixed: 100 },
                countries: ['CM'],
                requiresPhoneNumber: false,
                transactionTypes: ['deposit', 'withdrawal'],
                minAmount: 5000,
                maxAmount: 5000000,
                formattedFees: '0.8% + 100 FCFA',
                supportedSince: new Date('2008-01-01')
            }
        ]
    }

    /**
     * Obtenir la configuration par défaut d'un fournisseur
     */
    private getDefaultProviderConfig(providerCode: string): PaymentProviderConfig {
        switch (providerCode.toUpperCase()) {
            case 'MTN':
                return {
                    provider: 'MTN',
                    minAmount: 100,
                    maxAmount: 1000000,
                    fees: { percentage: 1.5, fixed: 0 },
                    timeout: 300, // 5 minutes
                    retryAttempts: 3,
                    requiresPIN: true,
                    formattedFees: '1.5%',
                    formattedMinAmount: '100 FCFA',
                    formattedMaxAmount: '1 000 000 FCFA'
                }
            case 'ORANGE':
                return {
                    provider: 'ORANGE',
                    minAmount: 100,
                    maxAmount: 1000000,
                    fees: { percentage: 1.2, fixed: 50 },
                    timeout: 300,
                    retryAttempts: 3,
                    requiresPIN: true,
                    formattedFees: '1.2% + 50 FCFA',
                    formattedMinAmount: '100 FCFA',
                    formattedMaxAmount: '1 000 000 FCFA'
                }
            case 'EU':
                return {
                    provider: 'EXPRESS_UNION',
                    minAmount: 5000,
                    maxAmount: 5000000,
                    fees: { percentage: 0.8, fixed: 100 },
                    timeout: 600, // 10 minutes
                    retryAttempts: 2,
                    requiresPIN: true,
                    formattedFees: '0.8% + 100 FCFA',
                    formattedMinAmount: '5 000 FCFA',
                    formattedMaxAmount: '5 000 000 FCFA'
                }
            default:
                return {
                    provider: 'UNKNOWN',
                    minAmount: 100,
                    maxAmount: 1000000,
                    fees: { percentage: 2.0, fixed: 0 },
                    timeout: 300,
                    retryAttempts: 3,
                    requiresPIN: true,
                    formattedFees: '2.0%',
                    formattedMinAmount: '100 FCFA',
                    formattedMaxAmount: '1 000 000 FCFA'
                }
        }
    }

    /**
     * Obtenir les banques par défaut
     */
    private getDefaultCameroonBanks(): CameroonBankDetails[] {
        return [
            {
                id: 'bicec',
                name: 'BICEC',
                code: BANK_CODES.BICEC,
                swiftCode: 'BICECCMCX',
                country: 'CM',
                transferLimit: 5000000,
                dailyLimit: 10000000,
                supportsMobileMoney: true,
                formattedTransferLimit: '5 000 000 FCFA',
                formattedDailyLimit: '10 000 000 FCFA'
            },
            {
                id: 'sgbc',
                name: 'SGBC',
                code: BANK_CODES.SGBC,
                swiftCode: 'SGCBCMCX',
                country: 'CM',
                transferLimit: 3000000,
                dailyLimit: 8000000,
                supportsMobileMoney: true,
                formattedTransferLimit: '3 000 000 FCFA',
                formattedDailyLimit: '8 000 000 FCFA'
            },
            {
                id: 'afriland',
                name: 'Afriland First Bank',
                code: BANK_CODES.AFRILAND,
                swiftCode: 'AFRICMCX',
                country: 'CM',
                transferLimit: 10000000,
                dailyLimit: 20000000,
                supportsMobileMoney: true,
                formattedTransferLimit: '10 000 000 FCFA',
                formattedDailyLimit: '20 000 000 FCFA'
            }
        ]
    }

    /**
     * Obtenir les services USSD par défaut
     */
    private getDefaultUSSDServices(): USSDCode[] {
        return [
            {
                provider: 'MTN',
                service: 'SOLDE',
                code: USSD_CODES.MTN.BALANCE,
                description: 'Vérifier le solde MTN Mobile Money'
            },
            {
                provider: 'MTN',
                service: 'TRANSFERT',
                code: USSD_CODES.MTN.TRANSFER,
                description: 'Effectuer un transfert MTN Mobile Money'
            },
            {
                provider: 'ORANGE',
                service: 'SOLDE',
                code: USSD_CODES.ORANGE.BALANCE,
                description: 'Vérifier le solde Orange Money'
            },
            {
                provider: 'ORANGE',
                service: 'TRANSFERT',
                code: USSD_CODES.ORANGE.TRANSFER,
                description: 'Effectuer un transfert Orange Money'
            }
        ]
    }

    /**
     * Générer un numéro de référence Cameroun
     */
    generateCameroonReference(prefix: string = 'CM'): string {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')

        return `${prefix}-${year}${month}${day}${hours}${minutes}-${random}`
    }

    /**
     * Vérifier les heures d'opération
     */
    checkOperatingHours(): {
        isOpen: boolean
        nextOpening: Date | null
        message: string
    } {
        const now = new Date()
        const hour = now.getHours()
        const day = now.getDay() // 0 = Dimanche, 6 = Samedi

        // Heures d'opération: Lundi-Vendredi 8h-18h, Samedi 9h-13h
        const isWeekday = day >= 1 && day <= 5
        const isSaturday = day === 6

        if (isWeekday && hour >= 8 && hour < 18) {
            return {
                isOpen: true,
                nextOpening: null,
                message: 'Service disponible'
            }
        } else if (isSaturday && hour >= 9 && hour < 13) {
            return {
                isOpen: true,
                nextOpening: null,
                message: 'Service disponible (horaires réduits)'
            }
        } else {
            // Calculer la prochaine ouverture
            const nextOpening = new Date(now)

            if (day === 0 || (isSaturday && hour >= 13) || day === 6) {
                // Dimanche ou après 13h Samedi -> Lundi 8h
                nextOpening.setDate(now.getDate() + (day === 0 ? 1 : 2))
                nextOpening.setHours(8, 0, 0, 0)
            } else {
                // En semaine après 18h -> lendemain 8h
                nextOpening.setDate(now.getDate() + 1)
                nextOpening.setHours(8, 0, 0, 0)
            }

            return {
                isOpen: false,
                nextOpening,
                message: 'Service hors heures d\'ouverture'
            }
        }
    }

    /**
     * Tester la connexion générale
     */
    async testServiceConnection(): Promise<boolean> {
        try {
            await apiClient.get('/v1/cameroon/health')
            return true
        } catch (error) {
            console.error('Erreur connexion service Cameroun:', error)
            return false
        }
    }
}

// Export singleton instance
export default new CameroonPaymentService()