// ============================================
// EXPORT PRINCIPAL DE L'APPLICATION
// ============================================

// Types
export * from './types'
export type { AuthViewProps } from './views/auth'

// Stores
export * from './stores'

// Constantes
export * from './constants'

// Composants d'authentification
export * from './views/auth'

// Utilitaires
export * from './utils'

// ============================================
// TYPES GLOBAUX
// ============================================

/**
 * Configuration globale de l'application
 */
export interface GlobalConfig {
    api: {
        baseUrl: string
        timeout: number
    }
    app: {
        name: string
        version: string
        environment: 'development' | 'production' | 'test'
    }
    features: Record<string, boolean>
}

// ============================================
// FONCTIONS UTILITAIRES GLOBALES
// ============================================

/**
 * Formate un prix avec la devise
 */
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
    })
    return formatter.format(price)
}

/**
 * Formate une date
 */
export const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = {}): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options
    }
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('fr-FR', defaultOptions).format(dateObj)
}

/**
 * Génère un identifiant unique
 */
export const generateId = (prefix: string = 'id'): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Délai pour les tests et animations
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================
// VALIDATEURS
// ============================================

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Valide un numéro de téléphone français
 */
export const isValidFrenchPhone = (phone: string): boolean => {
    const phoneRegex = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/
    return phoneRegex.test(phone)
}

// ============================================
// FONCTIONS DE SÉCURITÉ
// ============================================

/**
 * Masque partiellement un email
 */
export const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@')
    if (username.length <= 2) return email

    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
    return `${maskedUsername}@${domain}`
}

/**
 * Masque partiellement un numéro de carte
 */
export const maskCardNumber = (cardNumber: string): string => {
    const lastFour = cardNumber.slice(-4)
    return `**** **** **** ${lastFour}`
}

// ============================================
// EXPORTS PAR DÉFAUT
// ============================================

export default {
    // Types
    types: {
        // Exporter les types principaux
    },

    // Stores
    stores: {
        // Exporter les stores principaux
    },

    // Constantes
    constants: {
        // Exporter les constantes principales
    },

    // Utilitaires
    utils: {
        formatPrice,
        formatDate,
        generateId,
        delay,
        isValidEmail,
        isValidFrenchPhone,
        maskEmail,
        maskCardNumber
    }
}