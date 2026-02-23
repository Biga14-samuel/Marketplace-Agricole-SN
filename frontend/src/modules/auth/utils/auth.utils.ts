/**
 * Utilitaires pour l'authentification
 */

import type { User, UserRole } from '../types/auth.types'

/**
 * Formate le nom complet d'un utilisateur
 */
export const getUserDisplayName = (user: User | null): string => {
    if (!user) return 'Invité'
    return user.email.split('@')[0]
}

/**
 * Obtient les initiales d'un utilisateur
 */
export const getUserInitials = (user: User | null): string => {
    if (!user) return 'IN'
    const email = user.email.split('@')[0]
    return email.substring(0, 2).toUpperCase()
}

/**
 * Vérifie si un token JWT est expiré
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp * 1000 // Convertir en millisecondes
        return Date.now() >= exp
    } catch {
        return true
    }
}

/**
 * Extrait le payload d'un token JWT
 */
export const decodeToken = (token: string): any => {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

/**
 * Obtient le label d'un rôle en français
 */
export const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
        'Admin': 'Administrateur',
        'Producer': 'Producteur',
        'Customer': 'Client',
        'Moderator': 'Modérateur'
    }
    return labels[role] || role
}

/**
 * Obtient la couleur associée à un rôle
 */
export const getRoleColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
        'Admin': 'red',
        'Producer': 'green',
        'Customer': 'blue',
        'Moderator': 'purple'
    }
    return colors[role] || 'gray'
}

/**
 * Formate une date de création de compte
 */
export const formatAccountCreationDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Aujourd\'hui'
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
    return `Il y a ${Math.floor(diffDays / 365)} ans`
}

/**
 * Génère une couleur d'avatar basée sur l'email
 */
export const getAvatarColor = (email: string): string => {
    const colors = [
        '#10b981', // green
        '#3b82f6', // blue
        '#8b5cf6', // purple
        '#f59e0b', // amber
        '#ef4444', // red
        '#06b6d4', // cyan
        '#ec4899', // pink
    ]
    
    let hash = 0
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
}

/**
 * Masque partiellement un email
 */
export const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@')
    if (username.length <= 3) {
        return `${username[0]}***@${domain}`
    }
    return `${username.substring(0, 3)}***@${domain}`
}

/**
 * Masque partiellement un numéro de téléphone
 */
export const maskPhone = (phone: string): string => {
    if (phone.length <= 4) return phone
    return `${phone.substring(0, 2)}${'*'.repeat(phone.length - 4)}${phone.substring(phone.length - 2)}`
}

/**
 * Valide le format d'un email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Valide le format d'un numéro de téléphone (Cameroun)
 * Formats acceptés: +237XXXXXXXXX, 237XXXXXXXXX, 6XXXXXXXX, 2XXXXXXXX
 */
export const isValidPhone = (phone: string): boolean => {
    // Format Cameroun: +237 suivi de 9 chiffres (commence par 6 ou 2)
    const phoneRegex = /^(\+237|237)?[62]\d{8}$/
    return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

/**
 * Génère un message de bienvenue personnalisé
 */
export const getWelcomeMessage = (user: User | null): string => {
    if (!user) return 'Bienvenue sur MarketFraîche'
    
    const hour = new Date().getHours()
    let greeting = 'Bonjour'
    
    if (hour < 12) greeting = 'Bonjour'
    else if (hour < 18) greeting = 'Bon après-midi'
    else greeting = 'Bonsoir'
    
    const name = getUserDisplayName(user)
    return `${greeting}, ${name} !`
}

export default {
    getUserDisplayName,
    getUserInitials,
    isTokenExpired,
    decodeToken,
    getRoleLabel,
    getRoleColor,
    formatAccountCreationDate,
    getAvatarColor,
    maskEmail,
    maskPhone,
    isValidEmail,
    isValidPhone,
    getWelcomeMessage
}
