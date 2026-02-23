/**
 * Composable pour la validation des mots de passe
 * Aligné avec les règles de validation du backend FastAPI
 */

import { ref, computed } from 'vue'

export interface PasswordValidationRules {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
}

export interface PasswordValidationResult {
    isValid: boolean
    errors: string[]
    strength: number // 0-100
}

export function usePasswordValidation() {
    const password = ref('')
    
    // Règles de validation (alignées avec le backend)
    const rules: PasswordValidationRules = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true
    }

    /**
     * Valide un mot de passe selon les règles du backend
     */
    const validatePassword = (pwd: string): PasswordValidationResult => {
        const errors: string[] = []
        let strength = 0

        // Vérification de la longueur minimale
        if (pwd.length < rules.minLength) {
            errors.push(`Le mot de passe doit contenir au moins ${rules.minLength} caractères`)
        } else {
            strength += 25
        }

        // Vérification de la présence d'une majuscule
        if (rules.requireUppercase && !/[A-Z]/.test(pwd)) {
            errors.push('Le mot de passe doit contenir au moins une majuscule')
        } else if (/[A-Z]/.test(pwd)) {
            strength += 25
        }

        // Vérification de la présence d'une minuscule
        if (rules.requireLowercase && !/[a-z]/.test(pwd)) {
            errors.push('Le mot de passe doit contenir au moins une minuscule')
        } else if (/[a-z]/.test(pwd)) {
            strength += 25
        }

        // Vérification de la présence d'un chiffre
        if (rules.requireNumbers && !/\d/.test(pwd)) {
            errors.push('Le mot de passe doit contenir au moins un chiffre')
        } else if (/\d/.test(pwd)) {
            strength += 25
        }

        // Bonus pour les caractères spéciaux (non requis mais recommandé)
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
            strength = Math.min(100, strength + 10)
        }

        // Bonus pour la longueur supplémentaire
        if (pwd.length >= 12) {
            strength = Math.min(100, strength + 10)
        }

        return {
            isValid: errors.length === 0,
            errors,
            strength
        }
    }

    /**
     * Retourne la couleur selon la force du mot de passe
     */
    const getStrengthColor = (strength: number): string => {
        if (strength < 40) return 'red'
        if (strength < 70) return 'orange'
        if (strength < 90) return 'yellow'
        return 'green'
    }

    /**
     * Retourne le label selon la force du mot de passe
     */
    const getStrengthLabel = (strength: number): string => {
        if (strength < 40) return 'Faible'
        if (strength < 70) return 'Moyen'
        if (strength < 90) return 'Fort'
        return 'Très fort'
    }

    /**
     * Valide que deux mots de passe correspondent
     */
    const validatePasswordMatch = (pwd1: string, pwd2: string): boolean => {
        return pwd1 === pwd2 && pwd1.length > 0
    }

    return {
        password,
        rules,
        validatePassword,
        getStrengthColor,
        getStrengthLabel,
        validatePasswordMatch
    }
}

export default usePasswordValidation
