// @ts-nocheck
// frontend/src/modules/payments/services/paymentMethodService.ts
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
    PaymentMethod,
    CreatePaymentMethodDto,
    UpdatePaymentMethodDto,
    PaymentMethodFiltersDto,
    CameroonPaymentProvider,
    MobileMoneyProvider,
    BankAccount,
    CardDetails,
    PaymentMethodStats
} from '../types/payment-method.types'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { formatCurrencyXAF } from '../utils/currencyFormatter'
import { PAYMENT_METHODS } from '../constants/payment.constants'
import { validatePhoneNumber } from '../utils/paymentValidators'

// Client axios partagé
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
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

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * Service pour la gestion des méthodes de paiement
 */
class PaymentMethodService {
    // ============ MÉTHODES DE PAIEMENT UTILISATEUR ============

    /**
     * Obtenir les méthodes de paiement de l'utilisateur
     */
    async getPaymentMethods(filters?: PaymentMethodFiltersDto): Promise<PaymentMethod[]> {
        try {
            const params = new URLSearchParams()

            if (filters) {
                if (filters.type && filters.type !== 'all') {
                    params.append('type', filters.type)
                }
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status)
                }
                if (filters.country) {
                    params.append('country', filters.country)
                }
                if (filters.isDefault !== undefined) {
                    params.append('isDefault', filters.isDefault.toString())
                }
            }

            const url = `/v1/payment-methods${params.toString() ? `?${params.toString()}` : ''}`
            const response: AxiosResponse<PaymentMethod[]> = await apiClient.get(url)

            return response.data.map(method => this.formatPaymentMethod(method))
        } catch (error: unknown) {
            console.error('Erreur récupération méthodes paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des méthodes de paiement')
        }
    }

    /**
     * Obtenir une méthode de paiement par ID
     */
    async getPaymentMethod(methodId: string): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.get(`/v1/payment-methods/${methodId}`)
            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur récupération méthode paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la méthode de paiement')
        }
    }

    /**
     * Ajouter une nouvelle méthode de paiement
     */
    async addPaymentMethod(methodData: CreatePaymentMethodDto): Promise<PaymentMethod> {
        try {
            // Validation supplémentaire selon le type
            this.validatePaymentMethodData(methodData)

            const response: AxiosResponse<PaymentMethod> = await apiClient.post('/v1/payment-methods', methodData)
            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur ajout méthode paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de la méthode de paiement')
        }
    }

    /**
     * Mettre à jour une méthode de paiement
     */
    async updatePaymentMethod(methodId: string, updateData: UpdatePaymentMethodDto): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.put(
                `/v1/payment-methods/${methodId}`,
                updateData
            )

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur mise à jour méthode paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la méthode de paiement')
        }
    }

    /**
     * Supprimer une méthode de paiement
     */
    async removePaymentMethod(methodId: string): Promise<void> {
        try {
            await apiClient.delete(`/v1/payment-methods/${methodId}`)
        } catch (error: unknown) {
            console.error('Erreur suppression méthode paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la méthode de paiement')
        }
    }

    /**
     * Définir une méthode de paiement par défaut
     */
    async setDefaultPaymentMethod(methodId: string): Promise<void> {
        try {
            await apiClient.put(`/v1/payment-methods/${methodId}/default`)
        } catch (error: unknown) {
            console.error('Erreur définition méthode par défaut:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la définition de la méthode par défaut')
        }
    }

    /**
     * Vérifier une méthode de paiement
     */
    async verifyPaymentMethod(methodId: string, verificationData: Record<string, unknown>): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.post(
                `/v1/payment-methods/${methodId}/verify`,
                verificationData
            )

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur vérification méthode paiement:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification de la méthode de paiement')
        }
    }

    // ============ CARTES BANCAIRES ============

    /**
     * Ajouter une carte bancaire
     */
    async addCard(cardData: {
        cardNumber: string
        cardHolder: string
        expiryMonth: number
        expiryYear: number
        cvv: string
        isDefault?: boolean
    }): Promise<PaymentMethod> {
        try {
            // Validation de la carte
            this.validateCardData(cardData)

            const response: AxiosResponse<PaymentMethod> = await apiClient.post('/v1/payment-methods/cards', {
                type: PAYMENT_METHODS.CREDIT_CARD,
                details: {
                    cardNumber: cardData.cardNumber.replace(/\s/g, ''),
                    cardHolder: cardData.cardHolder,
                    expiryMonth: cardData.expiryMonth,
                    expiryYear: cardData.expiryYear,
                    last4: cardData.cardNumber.slice(-4)
                },
                isDefault: cardData.isDefault || false
            })

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur ajout carte:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de la carte bancaire')
        }
    }

    /**
     * Mettre à jour une carte bancaire
     */
    async updateCard(methodId: string, cardData: Partial<CardDetails>): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.put(
                `/v1/payment-methods/cards/${methodId}`,
                cardData
            )

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur mise à jour carte:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la carte bancaire')
        }
    }

    // ============ MOBILE MONEY (CAMEROUN) ============

    /**
     * Ajouter un compte Mobile Money
     */
    async addMobileMoneyAccount(mobileMoneyData: {
        provider: string
        phoneNumber: string
        accountName?: string
        isDefault?: boolean
    }): Promise<PaymentMethod> {
        try {
            // Validation du numéro de téléphone
            if (!validatePhoneNumber(mobileMoneyData.phoneNumber)) {
                throw new Error('Numéro de téléphone invalide')
            }

            const response: AxiosResponse<PaymentMethod> = await apiClient.post('/v1/payment-methods/mobile-money', {
                type: PAYMENT_METHODS.MOBILE_MONEY,
                provider: mobileMoneyData.provider,
                details: {
                    phoneNumber: mobileMoneyData.phoneNumber,
                    accountName: mobileMoneyData.accountName,
                    provider: mobileMoneyData.provider
                },
                isDefault: mobileMoneyData.isDefault || false
            })

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur ajout Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout du compte Mobile Money')
        }
    }

    /**
     * Vérifier un compte Mobile Money
     */
    async verifyMobileMoneyAccount(methodId: string, verificationCode: string): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.post(
                `/v1/payment-methods/mobile-money/${methodId}/verify`,
                { verificationCode }
            )

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur vérification Mobile Money:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du compte Mobile Money')
        }
    }

    /**
     * Obtenir les fournisseurs Mobile Money disponibles
     */
    async getMobileMoneyProviders(countryCode: string = 'CM'): Promise<MobileMoneyProvider[]> {
        try {
            const response: AxiosResponse<MobileMoneyProvider[]> = await apiClient.get(
                `/v1/payment-methods/providers/mobile-money?country=${countryCode}`
            )

            return response.data.map(provider => ({
                ...provider,
                formattedFees: provider.fees
                    ? `${provider.fees.percentage}% + ${formatCurrencyXAF(provider.fees.fixed)}`
                    : 'Aucun frais'
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération fournisseurs Mobile Money:', error)
            // Retourner les fournisseurs par défaut pour le Cameroun
            return this.getDefaultMobileMoneyProviders()
        }
    }

    // ============ COMPTES BANCAIRES ============

    /**
     * Ajouter un compte bancaire
     */
    async addBankAccount(bankData: {
        bankName: string
        accountNumber: string
        accountHolder: string
        iban?: string
        swiftCode?: string
        bankCode?: string
        branchCode?: string
        isDefault?: boolean
    }): Promise<PaymentMethod> {
        try {
            // Validation des données bancaires
            this.validateBankData(bankData)

            const response: AxiosResponse<PaymentMethod> = await apiClient.post('/v1/payment-methods/bank-accounts', {
                type: PAYMENT_METHODS.BANK_TRANSFER,
                details: {
                    bankName: bankData.bankName,
                    accountNumber: bankData.accountNumber,
                    accountHolder: bankData.accountHolder,
                    iban: bankData.iban,
                    swiftCode: bankData.swiftCode,
                    bankCode: bankData.bankCode,
                    branchCode: bankData.branchCode
                },
                isDefault: bankData.isDefault || false
            })

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur ajout compte bancaire:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout du compte bancaire')
        }
    }

    /**
     * Vérifier un compte bancaire
     */
    async verifyBankAccount(methodId: string, amounts: number[]): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.post(
                `/v1/payment-methods/bank-accounts/${methodId}/verify`,
                { amounts }
            )

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur vérification compte bancaire:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du compte bancaire')
        }
    }

    // ============ PORTEFEUILLE NUMÉRIQUE ============

    /**
     * Créer un portefeuille numérique
     */
    async createDigitalWallet(walletData: {
        type: 'app' | 'web'
        phoneNumber?: string
        email?: string
        currency?: string
    }): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.post('/v1/payment-methods/wallets', {
                type: PAYMENT_METHODS.DIGITAL_WALLET,
                details: walletData,
                isDefault: false
            })

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur création portefeuille:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la création du portefeuille numérique')
        }
    }

    /**
     * Recharger un portefeuille numérique
     */
    async topUpWallet(methodId: string, amount: number, paymentMethod: string): Promise<PaymentMethod> {
        try {
            const response: AxiosResponse<PaymentMethod> = await apiClient.post(
                `/v1/payment-methods/wallets/${methodId}/top-up`,
                { amount, paymentMethod }
            )

            return this.formatPaymentMethod(response.data)
        } catch (error: unknown) {
            console.error('Erreur rechargement portefeuille:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du rechargement du portefeuille')
        }
    }

    /**
     * Vérifier le solde du portefeuille
     */
    async checkWalletBalance(methodId: string): Promise<{ balance: number; formattedBalance: string }> {
        try {
            const response: AxiosResponse<{ balance: number }> = await apiClient.get(
                `/v1/payment-methods/wallets/${methodId}/balance`
            )

            return {
                balance: response.data.balance,
                formattedBalance: formatCurrencyXAF(response.data.balance)
            }
        } catch (error: unknown) {
            console.error('Erreur vérification solde:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du solde')
        }
    }

    // ============ FOURNISSEURS LOCAUX ============

    /**
     * Obtenir les fournisseurs de paiement au Cameroun
     */
    async getCameroonPaymentProviders(): Promise<CameroonPaymentProvider[]> {
        try {
            const response: AxiosResponse<CameroonPaymentProvider[]> = await apiClient.get(
                '/v1/payment-methods/providers/cameroon'
            )

            return response.data.map(provider => ({
                ...provider,
                formattedFees: provider.fees
                    ? `${provider.fees.percentage}% + ${formatCurrencyXAF(provider.fees.fixed)}`
                    : 'Aucun frais',
                isActive: provider.isActive !== false
            }))
        } catch (error: unknown) {
            console.error('Erreur récupération fournisseurs Cameroun:', error)
            // Retourner les fournisseurs par défaut
            return this.getDefaultCameroonProviders()
        }
    }

    /**
     * Obtenir les banques locales disponibles
     */
    async getLocalBanks(countryCode: string = 'CM'): Promise<Array<{
        id: string
        name: string
        code: string
        logo?: string
        swiftCode?: string
        country: string
    }>> {
        try {
            const response: AxiosResponse = await apiClient.get(
                `/v1/payment-methods/banks?country=${countryCode}`
            )

            return response.data
        } catch (error: unknown) {
            console.error('Erreur récupération banques locales:', error)
            // Retourner les banques par défaut pour le Cameroun
            return this.getDefaultCameroonBanks()
        }
    }

    // ============ STATISTIQUES ET ANALYTIQUES ============

    /**
     * Obtenir les statistiques d'utilisation des méthodes de paiement
     */
    async getPaymentMethodStats(): Promise<PaymentMethodStats> {
        try {
            const response: AxiosResponse<PaymentMethodStats> = await apiClient.get('/v1/payment-methods/stats')
            return response.data
        } catch (error: unknown) {
            console.error('Erreur récupération statistiques méthodes:', error)
            throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques')
        }
    }

    /**
     * Obtenir les préférences de paiement
     */
    async getPaymentPreferences(): Promise<{
        preferredMethod: string | null
        frequentlyUsed: Array<{ type: string; count: number }>
        successRates: Record<string, number>
    }> {
        try {
            const response: AxiosResponse = await apiClient.get('/v1/payment-methods/preferences')
            return response.data
        } catch (error: unknown) {
            console.error('Erreur récupération préférences:', error)
            return {
                preferredMethod: null,
                frequentlyUsed: [],
                successRates: {}
            }
        }
    }

    // ============ VALIDATIONS ET VÉRIFICATIONS ============

    /**
     * Valider les données de méthode de paiement
     */
    private validatePaymentMethodData(data: CreatePaymentMethodDto): void {
        if (!data.type) {
            throw new Error('Le type de méthode de paiement est requis')
        }

        if (!data.details) {
            throw new Error('Les détails de la méthode de paiement sont requis')
        }

        // Validation spécifique selon le type
        switch (data.type) {
            case PAYMENT_METHODS.CREDIT_CARD:
                this.validateCardData(data.details as CardDetails)
                break
            case PAYMENT_METHODS.MOBILE_MONEY:
                const mmDetails = data.details as any
                if (!mmDetails.phoneNumber || !validatePhoneNumber(mmDetails.phoneNumber)) {
                    throw new Error('Numéro de téléphone Mobile Money invalide')
                }
                break
            case PAYMENT_METHODS.BANK_TRANSFER:
                this.validateBankData(data.details as BankAccount)
                break
        }
    }

    /**
     * Valider les données de carte bancaire
     */
    private validateCardData(cardData: CardDetails | any): void {
        const cardNumber = cardData.cardNumber?.replace(/\s/g, '') || ''

        // Validation du numéro de carte (algorithme de Luhn)
        if (!this.validateCardNumber(cardNumber)) {
            throw new Error('Numéro de carte invalide')
        }

        // Validation de la date d'expiration
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() + 1

        const expiryMonth = cardData.expiryMonth
        const expiryYear = cardData.expiryYear

        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
            throw new Error('La carte a expiré')
        }

        // Validation du CVV
        const cvv = cardData.cvv || ''
        if (!/^\d{3,4}$/.test(cvv)) {
            throw new Error('CVV invalide')
        }
    }

    /**
     * Valider les données bancaires
     */
    private validateBankData(bankData: BankAccount): void {
        if (!bankData.accountNumber) {
            throw new Error('Le numéro de compte est requis')
        }

        if (!bankData.accountHolder) {
            throw new Error('Le titulaire du compte est requis')
        }

        if (!bankData.bankName) {
            throw new Error('Le nom de la banque est requis')
        }
    }

    /**
     * Valider un numéro de carte avec l'algorithme de Luhn
     */
    private validateCardNumber(cardNumber: string): boolean {
        let sum = 0
        let isEven = false

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10)

            if (isEven) {
                digit *= 2
                if (digit > 9) {
                    digit -= 9
                }
            }

            sum += digit
            isEven = !isEven
        }

        return sum % 10 === 0
    }

    // ============ FONCTIONS UTILITAIRES ============

    /**
     * Formater une méthode de paiement
     */
    private formatPaymentMethod(method: PaymentMethod): PaymentMethod {
        return {
            ...method,
            formattedFees: method.fees
                ? `${method.fees.percentage}% + ${formatCurrencyXAF(method.fees.fixed)}`
                : 'Aucun frais',
            createdAt: new Date(method.createdAt),
            updatedAt: new Date(method.updatedAt),
            lastUsedAt: method.lastUsedAt ? new Date(method.lastUsedAt) : undefined,
            status: method.status,
            type: method.type
        }
    }

    /**
     * Obtenir les fournisseurs Mobile Money par défaut
     */
    private getDefaultMobileMoneyProviders(): MobileMoneyProvider[] {
        return [
            {
                id: 'mtn_money',
                name: 'MTN Mobile Money',
                code: 'MTN',
                logo: '/assets/images/mobile-money/mtn-money.png',
                country: 'CM',
                isActive: true,
                fees: { percentage: 1.5, fixed: 0 },
                requiresPhoneNumber: true,
                formattedFees: '1.5%'
            },
            {
                id: 'orange_money',
                name: 'Orange Money',
                code: 'OM',
                logo: '/assets/images/mobile-money/orange-money.png',
                country: 'CM',
                isActive: true,
                fees: { percentage: 1.2, fixed: 50 },
                requiresPhoneNumber: true,
                formattedFees: '1.2% + 50 FCFA'
            },
            {
                id: 'express_union',
                name: 'Express Union',
                code: 'EU',
                logo: '/assets/images/mobile-money/express-union.png',
                country: 'CM',
                isActive: true,
                fees: { percentage: 0.8, fixed: 100 },
                requiresPhoneNumber: false,
                formattedFees: '0.8% + 100 FCFA'
            }
        ]
    }

    /**
     * Obtenir les fournisseurs Cameroun par défaut
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
                transactionTypes: ['deposit', 'withdrawal', 'payment'],
                formattedFees: '1.5%'
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
                transactionTypes: ['deposit', 'withdrawal', 'payment'],
                formattedFees: '1.2% + 50 FCFA'
            }
        ]
    }

    /**
     * Obtenir les banques Cameroun par défaut
     */
    private getDefaultCameroonBanks(): Array<{
        id: string
        name: string
        code: string
        logo?: string
        swiftCode?: string
        country: string
    }> {
        return [
            {
                id: 'bicec',
                name: 'BICEC',
                code: 'BICEC',
                swiftCode: 'BICECCMCX',
                country: 'CM'
            },
            {
                id: 'sgbc',
                name: 'SGBC',
                code: 'SGBC',
                swiftCode: 'SGCBCMCX',
                country: 'CM'
            },
            {
                id: 'afriland',
                name: 'Afriland First Bank',
                code: 'AFB',
                swiftCode: 'AFRICMCX',
                country: 'CM'
            },
            {
                id: 'ecobank',
                name: 'Ecobank',
                code: 'ECO',
                swiftCode: 'ECOCCMCX',
                country: 'CM'
            },
            {
                id: 'uba',
                name: 'United Bank for Africa',
                code: 'UBA',
                swiftCode: 'UNAFCMCX',
                country: 'CM'
            }
        ]
    }

    /**
     * Masquer les informations sensibles
     */
    maskSensitiveInfo(info: string, visibleDigits: number = 4): string {
        if (!info || info.length <= visibleDigits) return info

        const maskedLength = info.length - visibleDigits
        const maskedPart = '*'.repeat(maskedLength)
        const visiblePart = info.slice(-visibleDigits)

        return maskedPart + visiblePart
    }

    /**
     * Tester la connexion au service
     */
    async testConnection(): Promise<boolean> {
        try {
            await apiClient.get('/v1/payment-methods/health')
            return true
        } catch (error) {
            console.error('Erreur connexion service méthodes paiement:', error)
            return false
        }
    }
}

// Export singleton instance
export default new PaymentMethodService()
