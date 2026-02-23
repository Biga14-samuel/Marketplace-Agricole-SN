// @ts-nocheck
// frontend/src/modules/payments/utils/paymentFormatters.ts
import {
    PAYMENT_STATUS,
    PAYMENT_METHODS,
    PAYMENT_CURRENCIES,
    INVOICE_STATUS,
    REFUND_STATUS,
    PAYOUT_STATUS
} from '../types/payment.types'

// ============ FORMATAGE MONÉTAIRE ============

/**
 * Formate un montant en devise XAF (Franc CFA)
 */
export const formatCurrencyXAF = (amount: number): string => {
    if (amount === null || amount === undefined) return '0 FCFA'

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

/**
 * Formate un montant avec la devise spécifiée
 */
export const formatCurrency = (amount: number, currency: PAYMENT_CURRENCIES = PAYMENT_CURRENCIES.XAF): string => {
    if (amount === null || amount === undefined) {
        return currency === PAYMENT_CURRENCIES.XAF ? '0 FCFA' : `0 ${currency}`
    }

    const formatters: Record<PAYMENT_CURRENCIES, Intl.NumberFormat> = {
        [PAYMENT_CURRENCIES.XAF]: new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }),
        [PAYMENT_CURRENCIES.EUR]: new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }),
        [PAYMENT_CURRENCIES.USD]: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    const formatter = formatters[currency] || formatters[PAYMENT_CURRENCIES.XAF]
    return formatter.format(amount)
}

/**
 * Formate un montant en format abrégé (K, M, B)
 */
export const formatCurrencyAbbreviated = (amount: number, currency: PAYMENT_CURRENCIES = PAYMENT_CURRENCIES.XAF): string => {
    if (amount === 0) return formatCurrency(0, currency)

    const absAmount = Math.abs(amount)
    const sign = amount < 0 ? '-' : ''

    let value: number
    let suffix: string

    if (absAmount >= 1_000_000_000) {
        value = absAmount / 1_000_000_000
        suffix = 'B'
    } else if (absAmount >= 1_000_000) {
        value = absAmount / 1_000_000
        suffix = 'M'
    } else if (absAmount >= 1_000) {
        value = absAmount / 1_000
        suffix = 'K'
    } else {
        return formatCurrency(amount, currency)
    }

    const formattedValue = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value)

    const currencySymbol = currency === PAYMENT_CURRENCIES.XAF ? 'FCFA' : currency
    return `${sign}${formattedValue}${suffix} ${currencySymbol}`
}

/**
 * Formate un pourcentage
 */
export const formatPercentage = (percentage: number, decimals: number = 2): string => {
    if (percentage === null || percentage === undefined) return '0%'

    return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(percentage / 100)
}

// ============ FORMATAGE DES STATUTS ============

/**
 * Formate le statut d'un paiement
 */
export const formatPaymentStatus = (status: PAYMENT_STATUS): {
    text: string
    color: string
    icon: string
    bgColor: string
} => {
    const statusMap: Record<PAYMENT_STATUS, { text: string; color: string; icon: string; bgColor: string }> = {
        [PAYMENT_STATUS.PENDING]: {
            text: 'En attente',
            color: 'text-amber-600',
            icon: '⏳',
            bgColor: 'bg-amber-100'
        },
        [PAYMENT_STATUS.PROCESSING]: {
            text: 'En traitement',
            color: 'text-blue-600',
            icon: '🔄',
            bgColor: 'bg-blue-100'
        },
        [PAYMENT_STATUS.SUCCESS]: {
            text: 'Réussi',
            color: 'text-green-600',
            icon: '✅',
            bgColor: 'bg-green-100'
        },
        [PAYMENT_STATUS.FAILED]: {
            text: 'Échoué',
            color: 'text-red-600',
            icon: '❌',
            bgColor: 'bg-red-100'
        },
        [PAYMENT_STATUS.CANCELLED]: {
            text: 'Annulé',
            color: 'text-gray-600',
            icon: '🚫',
            bgColor: 'bg-gray-100'
        },
        [PAYMENT_STATUS.REFUNDED]: {
            text: 'Remboursé',
            color: 'text-purple-600',
            icon: '💸',
            bgColor: 'bg-purple-100'
        },
        [PAYMENT_STATUS.PARTIALLY_REFUNDED]: {
            text: 'Partiellement remboursé',
            color: 'text-indigo-600',
            icon: '↩️',
            bgColor: 'bg-indigo-100'
        },
        [PAYMENT_STATUS.EXPIRED]: {
            text: 'Expiré',
            color: 'text-yellow-600',
            icon: '⌛',
            bgColor: 'bg-yellow-100'
        },
        [PAYMENT_STATUS.DISPUTED]: {
            text: 'En litige',
            color: 'text-orange-600',
            icon: '⚖️',
            bgColor: 'bg-orange-100'
        }
    }

    return statusMap[status] || {
        text: 'Inconnu',
        color: 'text-gray-600',
        icon: '❓',
        bgColor: 'bg-gray-100'
    }
}

/**
 * Formate le statut d'une facture
 */
export const formatInvoiceStatus = (status: INVOICE_STATUS): {
    text: string
    color: string
    icon: string
    bgColor: string
} => {
    const statusMap: Record<INVOICE_STATUS, { text: string; color: string; icon: string; bgColor: string }> = {
        [INVOICE_STATUS.DRAFT]: {
            text: 'Brouillon',
            color: 'text-gray-600',
            icon: '📝',
            bgColor: 'bg-gray-100'
        },
        [INVOICE_STATUS.SENT]: {
            text: 'Envoyée',
            color: 'text-blue-600',
            icon: '📤',
            bgColor: 'bg-blue-100'
        },
        [INVOICE_STATUS.VIEWED]: {
            text: 'Consultée',
            color: 'text-indigo-600',
            icon: '👁️',
            bgColor: 'bg-indigo-100'
        },
        [INVOICE_STATUS.PAID]: {
            text: 'Payée',
            color: 'text-green-600',
            icon: '💰',
            bgColor: 'bg-green-100'
        },
        [INVOICE_STATUS.PARTIALLY_PAID]: {
            text: 'Partiellement payée',
            color: 'text-amber-600',
            icon: '💸',
            bgColor: 'bg-amber-100'
        },
        [INVOICE_STATUS.OVERDUE]: {
            text: 'En retard',
            color: 'text-red-600',
            icon: '⚠️',
            bgColor: 'bg-red-100'
        },
        [INVOICE_STATUS.CANCELLED]: {
            text: 'Annulée',
            color: 'text-gray-600',
            icon: '🚫',
            bgColor: 'bg-gray-100'
        },
        [INVOICE_STATUS.REFUNDED]: {
            text: 'Remboursée',
            color: 'text-purple-600',
            icon: '↩️',
            bgColor: 'bg-purple-100'
        },
        [INVOICE_STATUS.DISPUTED]: {
            text: 'En litige',
            color: 'text-orange-600',
            icon: '⚖️',
            bgColor: 'bg-orange-100'
        },
        [INVOICE_STATUS.WRITTEN_OFF]: {
            text: 'Radiée',
            color: 'text-pink-600',
            icon: '📉',
            bgColor: 'bg-pink-100'
        }
    }

    return statusMap[status] || {
        text: 'Inconnu',
        color: 'text-gray-600',
        icon: '❓',
        bgColor: 'bg-gray-100'
    }
}

/**
 * Formate le statut d'un remboursement
 */
export const formatRefundStatus = (status: REFUND_STATUS): {
    text: string
    color: string
    icon: string
    bgColor: string
} => {
    const statusMap: Record<REFUND_STATUS, { text: string; color: string; icon: string; bgColor: string }> = {
        [REFUND_STATUS.REQUESTED]: {
            text: 'Demandé',
            color: 'text-amber-600',
            icon: '📝',
            bgColor: 'bg-amber-100'
        },
        [REFUND_STATUS.UNDER_REVIEW]: {
            text: 'En examen',
            color: 'text-blue-600',
            icon: '🔍',
            bgColor: 'bg-blue-100'
        },
        [REFUND_STATUS.PENDING_APPROVAL]: {
            text: 'En attente d\'approbation',
            color: 'text-yellow-600',
            icon: '⏳',
            bgColor: 'bg-yellow-100'
        },
        [REFUND_STATUS.APPROVED]: {
            text: 'Approuvé',
            color: 'text-green-600',
            icon: '✅',
            bgColor: 'bg-green-100'
        },
        [REFUND_STATUS.REJECTED]: {
            text: 'Rejeté',
            color: 'text-red-600',
            icon: '❌',
            bgColor: 'bg-red-100'
        },
        [REFUND_STATUS.PROCESSING]: {
            text: 'En traitement',
            color: 'text-indigo-600',
            icon: '🔄',
            bgColor: 'bg-indigo-100'
        },
        [REFUND_STATUS.COMPLETED]: {
            text: 'Terminé',
            color: 'text-emerald-600',
            icon: '💰',
            bgColor: 'bg-emerald-100'
        },
        [REFUND_STATUS.FAILED]: {
            text: 'Échec',
            color: 'text-rose-600',
            icon: '⚠️',
            bgColor: 'bg-rose-100'
        },
        [REFUND_STATUS.CANCELLED]: {
            text: 'Annulé',
            color: 'text-gray-600',
            icon: '🚫',
            bgColor: 'bg-gray-100'
        },
        [REFUND_STATUS.PARTIALLY_REFUNDED]: {
            text: 'Partiellement remboursé',
            color: 'text-purple-600',
            icon: '↩️',
            bgColor: 'bg-purple-100'
        },
        [REFUND_STATUS.DISPUTED]: {
            text: 'En litige',
            color: 'text-orange-600',
            icon: '⚖️',
            bgColor: 'bg-orange-100'
        }
    }

    return statusMap[status] || {
        text: 'Inconnu',
        color: 'text-gray-600',
        icon: '❓',
        bgColor: 'bg-gray-100'
    }
}

/**
 * Formate le statut d'un versement
 */
export const formatPayoutStatus = (status: PAYOUT_STATUS): {
    text: string
    color: string
    icon: string
    bgColor: string
} => {
    const statusMap: Record<PAYOUT_STATUS, { text: string; color: string; icon: string; bgColor: string }> = {
        [PAYOUT_STATUS.PENDING]: {
            text: 'En attente',
            color: 'text-amber-600',
            icon: '⏳',
            bgColor: 'bg-amber-100'
        },
        [PAYOUT_STATUS.PROCESSING]: {
            text: 'En traitement',
            color: 'text-blue-600',
            icon: '🔄',
            bgColor: 'bg-blue-100'
        },
        [PAYOUT_STATUS.APPROVED]: {
            text: 'Approuvé',
            color: 'text-green-600',
            icon: '✅',
            bgColor: 'bg-green-100'
        },
        [PAYOUT_STATUS.REJECTED]: {
            text: 'Rejeté',
            color: 'text-red-600',
            icon: '❌',
            bgColor: 'bg-red-100'
        },
        [PAYOUT_STATUS.PAID]: {
            text: 'Payé',
            color: 'text-emerald-600',
            icon: '💰',
            bgColor: 'bg-emerald-100'
        },
        [PAYOUT_STATUS.FAILED]: {
            text: 'Échec',
            color: 'text-rose-600',
            icon: '⚠️',
            bgColor: 'bg-rose-100'
        },
        [PAYOUT_STATUS.CANCELLED]: {
            text: 'Annulé',
            color: 'text-gray-600',
            icon: '🚫',
            bgColor: 'bg-gray-100'
        },
        [PAYOUT_STATUS.ON_HOLD]: {
            text: 'En attente',
            color: 'text-yellow-600',
            icon: '⏸️',
            bgColor: 'bg-yellow-100'
        },
        [PAYOUT_STATUS.PARTIALLY_PAID]: {
            text: 'Partiellement payé',
            color: 'text-purple-600',
            icon: '💸',
            bgColor: 'bg-purple-100'
        },
        [PAYOUT_STATUS.SCHEDULED]: {
            text: 'Programmé',
            color: 'text-indigo-600',
            icon: '📅',
            bgColor: 'bg-indigo-100'
        },
        [PAYOUT_STATUS.REVERSED]: {
            text: 'Remboursé',
            color: 'text-orange-600',
            icon: '↩️',
            bgColor: 'bg-orange-100'
        }
    }

    return statusMap[status] || {
        text: 'Inconnu',
        color: 'text-gray-600',
        icon: '❓',
        bgColor: 'bg-gray-100'
    }
}

// ============ FORMATAGE DES MÉTHODES DE PAIEMENT ============

/**
 * Formate la méthode de paiement
 */
export const formatPaymentMethod = (method: PAYMENT_METHODS): {
    text: string
    icon: string
    color: string
    description: string
} => {
    const methodMap: Record<PAYMENT_METHODS, { text: string; icon: string; color: string; description: string }> = {
        [PAYMENT_METHODS.CREDIT_CARD]: {
            text: 'Carte de crédit',
            icon: '💳',
            color: 'text-blue-600',
            description: 'Paiement par carte bancaire'
        },
        [PAYMENT_METHODS.DEBIT_CARD]: {
            text: 'Carte de débit',
            icon: '💳',
            color: 'text-green-600',
            description: 'Paiement par carte de débit'
        },
        [PAYMENT_METHODS.MOBILE_MONEY]: {
            text: 'Mobile Money',
            icon: '📱',
            color: 'text-purple-600',
            description: 'Paiement via Mobile Money'
        },
        [PAYMENT_METHODS.BANK_TRANSFER]: {
            text: 'Virement bancaire',
            icon: '🏦',
            color: 'text-indigo-600',
            description: 'Virement bancaire'
        },
        [PAYMENT_METHODS.PAYPAL]: {
            text: 'PayPal',
            icon: '🔵',
            color: 'text-blue-500',
            description: 'Paiement sécurisé PayPal'
        },
        [PAYMENT_METHODS.DIGITAL_WALLET]: {
            text: 'Portefeuille numérique',
            icon: '👛',
            color: 'text-yellow-600',
            description: 'Portefeuille numérique'
        },
        [PAYMENT_METHODS.CASH_ON_DELIVERY]: {
            text: 'Paiement à la livraison',
            icon: '💰',
            color: 'text-gray-600',
            description: 'Paiement en espèces à la livraison'
        },
        [PAYMENT_METHODS.CRYPTO]: {
            text: 'Cryptomonnaie',
            icon: '₿',
            color: 'text-orange-600',
            description: 'Paiement en cryptomonnaie'
        }
    }

    return methodMap[method] || {
        text: 'Méthode inconnue',
        icon: '❓',
        color: 'text-gray-600',
        description: 'Méthode de paiement non reconnue'
    }
}

/**
 * Formate le fournisseur Mobile Money
 */
export const formatMobileMoneyProvider = (provider: string): {
    text: string
    icon: string
    color: string
    logo?: string
} => {
    const providerMap: Record<string, { text: string; icon: string; color: string; logo?: string }> = {
        'mtn': {
            text: 'MTN Mobile Money',
            icon: '📱',
            color: 'text-yellow-600',
            logo: '/assets/images/mobile-money/mtn-money.png'
        },
        'orange': {
            text: 'Orange Money',
            icon: '📱',
            color: 'text-orange-600',
            logo: '/assets/images/mobile-money/orange-money.png'
        },
        'express_union': {
            text: 'Express Union',
            icon: '🏦',
            color: 'text-blue-600',
            logo: '/assets/images/mobile-money/express-union.png'
        },
        'moov': {
            text: 'Moov Money',
            icon: '📱',
            color: 'text-red-600'
        },
        'airtel_money': {
            text: 'Airtel Money',
            icon: '📱',
            color: 'text-red-500'
        },
        'tigo': {
            text: 'Tigo Pesa',
            icon: '📱',
            color: 'text-green-600'
        }
    }

    return providerMap[provider.toLowerCase()] || {
        text: provider,
        icon: '📱',
        color: 'text-gray-600'
    }
}

// ============ FORMATAGE DES DATES ============

/**
 * Formate une date en format local français
 */
export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A'

    const dateObj = date instanceof Date ? date : new Date(date)

    if (isNaN(dateObj.getTime())) return 'Date invalide'

    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(dateObj)
}

/**
 * Formate une date avec l'heure
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A'

    const dateObj = date instanceof Date ? date : new Date(date)

    if (isNaN(dateObj.getTime())) return 'Date invalide'

    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(dateObj)
}

/**
 * Formate une date en format relatif (il y a...)
 */
export const formatRelativeDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A'

    const dateObj = date instanceof Date ? date : new Date(date)

    if (isNaN(dateObj.getTime())) return 'Date invalide'

    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffSeconds < 60) {
        return 'à l\'instant'
    } else if (diffMinutes < 60) {
        return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    } else if (diffHours < 24) {
        return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    } else if (diffDays < 7) {
        return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    } else if (diffWeeks < 4) {
        return `il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`
    } else if (diffMonths < 12) {
        return `il y a ${diffMonths} mois`
    } else {
        return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`
    }
}

/**
 * Formate la durée en jours/heures/minutes
 */
export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return remainingMinutes > 0
            ? `${hours}h ${remainingMinutes}min`
            : `${hours}h`
    } else {
        const days = Math.floor(minutes / 1440)
        const remainingHours = Math.floor((minutes % 1440) / 60)
        return remainingHours > 0
            ? `${days}j ${remainingHours}h`
            : `${days}j`
    }
}

// ============ FORMATAGE DES NUMÉROS ============

/**
 * Formate un numéro de téléphone Camerounais
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return ''

    // Supprimer tous les caractères non numériques
    const cleaned = phoneNumber.replace(/\D/g, '')

    // Format pour le Cameroun: +237 6XX XX XX XX
    if (cleaned.length === 9) {
        return `+237 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`
    } else if (cleaned.length === 12 && cleaned.startsWith('237')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 12)}`
    }

    // Retourner le numéro original si le format n'est pas reconnu
    return phoneNumber
}

/**
 * Masque les informations sensibles (numéros de carte, etc.)
 */
export const maskSensitiveInfo = (info: string, visibleDigits: number = 4): string => {
    if (!info || info.length <= visibleDigits) return info

    const maskedLength = info.length - visibleDigits
    const maskedPart = '•'.repeat(maskedLength)
    const visiblePart = info.slice(-visibleDigits)

    return maskedPart + visiblePart
}

/**
 * Formate un numéro de carte bancaire (masqué)
 */
export const formatCardNumber = (cardNumber: string): string => {
    if (!cardNumber) return ''

    const cleaned = cardNumber.replace(/\s/g, '')

    if (cleaned.length === 16) {
        return `**** **** **** ${cleaned.slice(-4)}`
    }

    return maskSensitiveInfo(cleaned, 4)
}

// ============ FORMATAGE DES NOMS ============

/**
 * Formate le nom complet en initiales
 */
export const formatInitials = (fullName: string): string => {
    if (!fullName) return ''

    return fullName
        .split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
}

/**
 * Formate un nom en format abrégé
 */
export const formatAbbreviatedName = (name: string, maxLength: number = 20): string => {
    if (!name) return ''

    if (name.length <= maxLength) return name

    return name.slice(0, maxLength - 3) + '...'
}

// ============ FORMATAGE DES ADRESSES ============

/**
 * Formate une adresse complète
 */
export const formatAddress = (address: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
}): string => {
    const parts = []

    if (address.street) parts.push(address.street)
    if (address.city) {
        const cityParts = []
        if (address.postalCode) cityParts.push(address.postalCode)
        cityParts.push(address.city)
        parts.push(cityParts.join(' '))
    }
    if (address.state) parts.push(address.state)
    if (address.country) parts.push(address.country)

    return parts.join(', ')
}

// ============ FORMATAGE DES QUANTITÉS ============

/**
 * Formate une quantité avec unité
 */
export const formatQuantity = (quantity: number, unit?: string): string => {
    const formattedQuantity = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(quantity)

    return unit ? `${formattedQuantity} ${unit}` : formattedQuantity
}

// ============ FORMATAGE DES DÉLAIS ============

/**
 * Formate un délai en jours
 */
export const formatDays = (days: number): string => {
    if (days === 1) return '1 jour'
    if (days < 7) return `${days} jours`
    if (days === 7) return '1 semaine'
    if (days < 30) return `${Math.floor(days / 7)} semaines`
    if (days === 30) return '1 mois'
    if (days < 365) return `${Math.floor(days / 30)} mois`
    if (days === 365) return '1 an'
    return `${Math.floor(days / 365)} ans`
}

// ============ FORMATAGE DES COULEURS ============

/**
 * Génère une couleur basée sur une chaîne (pour les avatars, etc.)
 */
export const generateColorFromString = (str: string): string => {
    if (!str) return '#6B7280'

    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const colors = [
        '#EF4444', // red
        '#F59E0B', // amber
        '#10B981', // emerald
        '#3B82F6', // blue
        '#8B5CF6', // violet
        '#EC4899', // pink
        '#6366F1', // indigo
        '#14B8A6', // teal
        '#F97316', // orange
        '#84CC16', // lime
        '#06B6D4', // cyan
        '#8B5CF6'  // purple
    ]

    const index = Math.abs(hash) % colors.length
    return colors[index]
}

// ============ FORMATAGE DES ERREURS ============

/**
 * Formate un message d'erreur de paiement
 */
export const formatPaymentError = (errorCode: string): {
    message: string
    severity: 'info' | 'warning' | 'error'
    action?: string
} => {
    const errorMap: Record<string, { message: string; severity: 'info' | 'warning' | 'error'; action?: string }> = {
        'insufficient_funds': {
            message: 'Fonds insuffisants sur votre compte',
            severity: 'error',
            action: 'Veuillez recharger votre compte'
        },
        'card_declined': {
            message: 'Carte refusée',
            severity: 'error',
            action: 'Veuillez utiliser une autre carte'
        },
        'expired_card': {
            message: 'Carte expirée',
            severity: 'error',
            action: 'Veuillez mettre à jour vos informations de carte'
        },
        'network_error': {
            message: 'Erreur réseau',
            severity: 'warning',
            action: 'Veuillez réessayer dans quelques instants'
        },
        'invalid_pin': {
            message: 'Code PIN incorrect',
            severity: 'error',
            action: 'Veuillez saisir le code PIN correct'
        },
        'timeout': {
            message: 'Temps d\'attente dépassé',
            severity: 'warning',
            action: 'Veuillez réessayer'
        },
        'duplicate_transaction': {
            message: 'Transaction en double détectée',
            severity: 'warning',
            action: 'Veuillez vérifier votre historique de transactions'
        }
    }

    return errorMap[errorCode] || {
        message: 'Une erreur est survenue lors du paiement',
        severity: 'error',
        action: 'Veuillez contacter le support'
    }
}

// ============ FONCTIONS UTILITAIRES ============

/**
 * Vérifie si une valeur est un nombre valide
 */
export const isValidNumber = (value: unknown): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string' && value.trim() === '') return false
    const num = Number(value)
    return !isNaN(num) && isFinite(num)
}

/**
 * Arrondit un nombre à 2 décimales
 */
export const roundToTwoDecimals = (num: number): number => {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

/**
 * Calcule le pourcentage de progression
 */
export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0
    return roundToTwoDecimals((value / total) * 100)
}

// ============ EXPORT ============

export default {
    // Formatage monétaire
    formatCurrencyXAF,
    formatCurrency,
    formatCurrencyAbbreviated,
    formatPercentage,

    // Formatage des statuts
    formatPaymentStatus,
    formatInvoiceStatus,
    formatRefundStatus,
    formatPayoutStatus,

    // Formatage des méthodes
    formatPaymentMethod,
    formatMobileMoneyProvider,

    // Formatage des dates
    formatDate,
    formatDateTime,
    formatRelativeDate,
    formatDuration,

    // Formatage des numéros
    formatPhoneNumber,
    maskSensitiveInfo,
    formatCardNumber,

    // Formatage des noms
    formatInitials,
    formatAbbreviatedName,

    // Formatage des adresses
    formatAddress,

    // Formatage des quantités
    formatQuantity,

    // Formatage des délais
    formatDays,

    // Formatage des couleurs
    generateColorFromString,

    // Formatage des erreurs
    formatPaymentError,

    // Utilitaires
    isValidNumber,
    roundToTwoDecimals,
    calculatePercentage
}