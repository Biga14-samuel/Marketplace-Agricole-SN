// @ts-nocheck
// frontend/src/modules/payments/hooks/useMobileMoney.ts
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/composables/useToast'
import { cameroonPaymentService } from '../services/cameroonPaymentService'
import type {
    MobileMoneyPayment,
    MobileMoneyProvider,
    MobileMoneyTransaction,
    PaymentRequest,
    PaymentResponse
} from '../types/payment.types'
import { PAYMENT_STATUS } from '../constants/payment.constants'
import { CameroonProviders } from '../constants/cameroon.constants'
import { usePayment } from './usePayment'

interface UseMobileMoneyOptions {
    autoPollStatus?: boolean
    pollInterval?: number
    onSuccess?: (transaction: MobileMoneyTransaction) => void
    onError?: (error: unknown) => void
}

/**
 * Hook pour gérer les paiements Mobile Money au Cameroun
 * Supporte MTN Mobile Money, Orange Money, Express Union
 */
export function useMobileMoney(options: UseMobileMoneyOptions = {}) {
    const { autoPollStatus = true, pollInterval = 5000, onSuccess, onError } = options

    const { t } = useI18n()
    const { showSuccess, showError, showWarning } = useToast()
    const { formatCurrency } = usePayment()

    // États réactifs
    const isLoading = ref(false)
    const isProcessing = ref(false)
    const transaction = ref<MobileMoneyTransaction | null>(null)
    const paymentStatus = ref(PAYMENT_STATUS.PENDING)
    const countdown = ref<number>(0)
    const error = ref<string | null>(null)
    const pollTimer = ref<NodeJS.Timeout | null>(null)

    // Liste des fournisseurs disponibles
    const availableProviders = computed<MobileMoneyProvider[]>(() => {
        return [
            {
                id: CameroonProviders.MTN_MOBILE_MONEY,
                name: t('payments.providers.mtn'),
                code: 'mtn',
                logo: '/images/mobile-money/mtn-money.png',
                isActive: true,
                minAmount: 100,
                maxAmount: 1000000,
                fees: 0.5
            },
            {
                id: CameroonProviders.ORANGE_MONEY,
                name: t('payments.providers.orange'),
                code: 'orange',
                logo: '/images/mobile-money/orange-money.png',
                isActive: true,
                minAmount: 100,
                maxAmount: 500000,
                fees: 0.5
            },
            {
                id: CameroonProviders.EXPRESS_UNION,
                name: t('payments.providers.expressUnion'),
                code: 'express-union',
                logo: '/images/mobile-money/express-union.png',
                isActive: true,
                minAmount: 100,
                maxAmount: 200000,
                fees: 0.5
            }
        ]
    })

    /**
     * Initialise un paiement Mobile Money
     */
    const initiatePayment = async (
        providerId: string,
        paymentData: PaymentRequest
    ): Promise<MobileMoneyTransaction | null> => {
        try {
            isLoading.value = true
            error.value = null

            // Valider le fournisseur
            const provider = availableProviders.value.find(p => p.id === providerId)
            if (!provider) {
                throw new Error(t('payments.errors.invalidProvider'))
            }

            // Valider le montant
            if (paymentData.amount < provider.minAmount) {
                throw new Error(
                    t('payments.errors.minAmount', { amount: formatCurrency(provider.minAmount) })
                )
            }

            if (paymentData.amount > provider.maxAmount) {
                throw new Error(
                    t('payments.errors.maxAmount', { amount: formatCurrency(provider.maxAmount) })
                )
            }

            // Créer la requête spécifique Mobile Money
            const mobileMoneyRequest: MobileMoneyPayment = {
                ...paymentData,
                provider: providerId,
                phoneNumber: paymentData.phoneNumber || '',
                operatorCode: provider.code,
                fees: provider.fees,
                totalAmount: paymentData.amount + (paymentData.amount * provider.fees) / 100
            }

            // Appeler le service
            const response = await cameroonPaymentService.initiateMobileMoneyPayment(mobileMoneyRequest)

            if (response.success && response.data) {
                transaction.value = response.data
                paymentStatus.value = response.data.status
                countdown.value = response.data.expiresIn || 300 // 5 minutes par défaut

                // Démarrer le suivi automatique du statut
                if (autoPollStatus && response.data.transactionId) {
                    startPolling(response.data.transactionId)
                }

                showSuccess(t('payments.mobileMoney.initiated', { provider: provider.name }))
                return response.data
            } else {
                throw new Error(response.message || t('payments.errors.initiationFailed'))
            }
        } catch (err: any) {
            error.value = err.message || t('payments.errors.unknown')
            showError(error.value)
            onError?.(err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Vérifie le statut d'une transaction
     */
    const checkPaymentStatus = async (transactionId: string): Promise<boolean> => {
        if (!transactionId) return false

        try {
            const response = await cameroonPaymentService.checkPaymentStatus(transactionId)

            if (response.success && response.data) {
                const updatedTransaction = response.data
                transaction.value = updatedTransaction
                paymentStatus.value = updatedTransaction.status

                // Gérer les différents statuts
                switch (updatedTransaction.status) {
                    case PAYMENT_STATUS.COMPLETED:
                        stopPolling()
                        showSuccess(t('payments.mobileMoney.completed'))
                        onSuccess?.(updatedTransaction)
                        break

                    case PAYMENT_STATUS.FAILED:
                    case PAYMENT_STATUS.CANCELLED:
                        stopPolling()
                        showError(t('payments.mobileMoney.failed'))
                        onError?.(new Error(updatedTransaction.status))
                        break

                    case PAYMENT_STATUS.PENDING:
                        if (updatedTransaction.expiresIn !== undefined) {
                            countdown.value = updatedTransaction.expiresIn
                        }
                        break
                }

                return true
            }

            return false
        } catch (err: any) {
            error.value = err.message
            return false
        }
    }

    /**
     * Annule une transaction en cours
     */
    const cancelPayment = async (transactionId: string): Promise<boolean> => {
        if (!transactionId) return false

        try {
            isProcessing.value = true
            const response = await cameroonPaymentService.cancelPayment(transactionId)

            if (response.success) {
                paymentStatus.value = PAYMENT_STATUS.CANCELLED
                stopPolling()
                showWarning(t('payments.mobileMoney.cancelled'))
                return true
            }

            return false
        } catch (err: any) {
            error.value = err.message
            showError(t('payments.errors.cancelFailed'))
            return false
        } finally {
            isProcessing.value = false
        }
    }

    /**
     * Simule un paiement Mobile Money (pour le développement)
     */
    const simulatePayment = async (
        transactionId: string,
        simulateStatus = PAYMENT_STATUS.COMPLETED
    ): Promise<boolean> => {
        try {
            const response = await cameroonPaymentService.simulatePayment(transactionId, simulateStatus)

            if (response.success) {
                // Recharger le statut après simulation
                await checkPaymentStatus(transactionId)
                return true
            }

            return false
        } catch (err: any) {
            error.value = err.message
            return false
        }
    }

    /**
     * Formate un numéro de téléphone pour Mobile Money
     */
    const formatPhoneNumber = (phoneNumber: string, providerId: string): string => {
        // Supprimer tous les caractères non numériques
        const cleanNumber = phoneNumber.replace(/\D/g, '')

        // Ajouter l'indicatif Cameroun si absent
        if (!cleanNumber.startsWith('237')) {
            return `237${cleanNumber}`
        }

        return cleanNumber
    }

    /**
     * Calcule les frais pour un montant donné et un fournisseur
     */
    const calculateFees = (amount: number, providerId: string): number => {
        const provider = availableProviders.value.find(p => p.id === providerId)
        if (!provider) return 0

        return (amount * provider.fees) / 100
    }

    /**
     * Calcule le montant total avec frais
     */
    const calculateTotalWithFees = (amount: number, providerId: string): number => {
        const fees = calculateFees(amount, providerId)
        return amount + fees
    }

    /**
     * Démarre le polling pour vérifier le statut
     */
    const startPolling = (transactionId: string) => {
        stopPolling() // Arrêter tout polling existant

        pollTimer.value = setInterval(async () => {
            if (countdown.value > 0) {
                countdown.value -= 1
            } else {
                // Temps écoulé, arrêter le polling
                stopPolling()
                paymentStatus.value = PAYMENT_STATUS.EXPIRED
                showError(t('payments.mobileMoney.expired'))
                return
            }

            await checkPaymentStatus(transactionId)
        }, pollInterval)
    }

    /**
     * Arrête le polling
     */
    const stopPolling = () => {
        if (pollTimer.value) {
            clearInterval(pollTimer.value)
            pollTimer.value = null
        }
    }

    /**
     * Formate le compte à rebours en minutes:secondes
     */
    const formattedCountdown = computed(() => {
        const minutes = Math.floor(countdown.value / 60)
        const seconds = countdown.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    /**
     * Vérifie si un paiement est encore valide (non expiré)
     */
    const isPaymentValid = computed(() => {
        return paymentStatus.value === PAYMENT_STATUS.PENDING && countdown.value > 0
    })

    /**
     * Réinitialise le hook à son état initial
     */
    const reset = () => {
        stopPolling()
        transaction.value = null
        paymentStatus.value = PAYMENT_STATUS.PENDING
        countdown.value = 0
        error.value = null
        isLoading.value = false
        isProcessing.value = false
    }

    // Nettoyage à la destruction
    onUnmounted(() => {
        stopPolling()
    })

    return {
        // États
        isLoading,
        isProcessing,
        transaction,
        paymentStatus,
        countdown,
        formattedCountdown,
        error,
        availableProviders,
        isPaymentValid,

        // Méthodes
        initiatePayment,
        checkPaymentStatus,
        cancelPayment,
        simulatePayment,
        formatPhoneNumber,
        calculateFees,
        calculateTotalWithFees,
        startPolling,
        stopPolling,
        reset,

        // Utilitaires
        formatCurrency
    }
}

/**
 * Hook spécifique pour MTN Mobile Money
 */
export function useMtnMobileMoney(options?: UseMobileMoneyOptions) {
    const hook = useMobileMoney(options)

    const initiateMtnPayment = async (paymentData: PaymentRequest) => {
        return hook.initiatePayment(CameroonProviders.MTN_MOBILE_MONEY, paymentData)
    }

    return {
        ...hook,
        initiateMtnPayment
    }
}

/**
 * Hook spécifique pour Orange Money
 */
export function useOrangeMoney(options?: UseMobileMoneyOptions) {
    const hook = useMobileMoney(options)

    const initiateOrangePayment = async (paymentData: PaymentRequest) => {
        return hook.initiatePayment(CameroonProviders.ORANGE_MONEY, paymentData)
    }

    return {
        ...hook,
        initiateOrangePayment
    }
}

/**
 * Hook spécifique pour Express Union
 */
export function useExpressUnion(options?: UseMobileMoneyOptions) {
    const hook = useMobileMoney(options)

    const initiateExpressUnionPayment = async (paymentData: PaymentRequest) => {
        return hook.initiatePayment(CameroonProviders.EXPRESS_UNION, paymentData)
    }

    return {
        ...hook,
        initiateExpressUnionPayment
    }
}

export type UseMobileMoneyReturn = ReturnType<typeof useMobileMoney>
export type UseMtnMobileMoneyReturn = ReturnType<typeof useMtnMobileMoney>
export type UseOrangeMoneyReturn = ReturnType<typeof useOrangeMoney>
export type UseExpressUnionReturn = ReturnType<typeof useExpressUnion>
