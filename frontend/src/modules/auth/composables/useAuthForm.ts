/**
 * Composable pour gérer les formulaires d'authentification
 * Aligné avec les schémas de validation du backend FastAPI
 */

import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { usePasswordValidation } from './usePasswordValidation'
import type { LoginCredentials, RegisterData } from '../types/auth.types'

export function useAuthForm() {
    const authStore = useAuthStore()
    const { validatePassword, validatePasswordMatch } = usePasswordValidation()

    // État du formulaire
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    /**
     * Valide un email
     */
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Valide un numéro de téléphone (format Cameroun)
     * Formats acceptés: +237XXXXXXXXX, 237XXXXXXXXX, 6XXXXXXXX, 2XXXXXXXX
     */
    const validatePhone = (phone: string): boolean => {
        if (!phone) return true // Optionnel
        // Format Cameroun: +237 suivi de 9 chiffres (commence par 6 ou 2)
        const phoneRegex = /^(\+237|237)?[62]\d{8}$/
        return phoneRegex.test(phone.replace(/[\s-]/g, ''))
    }

    /**
     * Efface les messages d'erreur et de succès
     */
    const clearMessages = () => {
        errorMessage.value = null
        successMessage.value = null
    }

    /**
     * Définit un message d'erreur
     */
    const setError = (message: string) => {
        errorMessage.value = message
        successMessage.value = null
    }

    /**
     * Définit un message de succès
     */
    const setSuccess = (message: string) => {
        successMessage.value = message
        errorMessage.value = null
    }

    /**
     * Gère la connexion
     */
    const handleLogin = async (credentials: LoginCredentials) => {
        clearMessages()

        // Validation
        if (!credentials.email || !credentials.password) {
            setError('Veuillez remplir tous les champs')
            return false
        }

        if (!validateEmail(credentials.email)) {
            setError('Adresse email invalide')
            return false
        }

        isLoading.value = true

        try {
            await authStore.login(credentials)
            setSuccess('Connexion réussie !')
            return true
        } catch (error: unknown) {
            const message = (error as any).response?.data?.detail || 
                          (error as any).response?.data?.message || 
                          'Identifiants incorrects'
            setError(message)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Gère l'inscription
     */
    const handleRegister = async (data: RegisterData & { confirmPassword?: string }) => {
        clearMessages()

        // Validation de l'email
        if (!data.email || !validateEmail(data.email)) {
            setError('Adresse email invalide')
            return false
        }

        // Validation du téléphone
        if (data.phone && !validatePhone(data.phone)) {
            setError('Numéro de téléphone invalide')
            return false
        }

        // Validation du mot de passe
        const passwordValidation = validatePassword(data.password)
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors[0])
            return false
        }

        // Vérification de la confirmation du mot de passe
        if (data.confirmPassword && !validatePasswordMatch(data.password, data.confirmPassword)) {
            setError('Les mots de passe ne correspondent pas')
            return false
        }

        isLoading.value = true

        try {
            const registerData: RegisterData = {
                email: data.email,
                password: data.password,
                phone: data.phone
            }

            const response = await authStore.register(registerData)
            setSuccess(response.message || 'Inscription réussie ! Veuillez vérifier votre email.')
            return true
        } catch (error: unknown) {
            const message = (error as any).response?.data?.detail || 
                          (error as any).response?.data?.message || 
                          'Une erreur est survenue lors de l\'inscription'
            setError(message)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Gère la demande de réinitialisation de mot de passe
     */
    const handlePasswordResetRequest = async (email: string) => {
        clearMessages()

        if (!email || !validateEmail(email)) {
            setError('Adresse email invalide')
            return false
        }

        isLoading.value = true

        try {
            const response = await authStore.requestPasswordReset({ email })
            setSuccess(response.message || 'Un email de réinitialisation a été envoyé')
            return true
        } catch (error: unknown) {
            const message = (error as any).response?.data?.detail || 
                          (error as any).response?.data?.message || 
                          'Une erreur est survenue'
            setError(message)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Gère la confirmation de réinitialisation de mot de passe
     */
    const handlePasswordResetConfirm = async (token: string, newPassword: string, confirmPassword?: string) => {
        clearMessages()

        // Validation du mot de passe
        const passwordValidation = validatePassword(newPassword)
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors[0])
            return false
        }

        // Vérification de la confirmation
        if (confirmPassword && !validatePasswordMatch(newPassword, confirmPassword)) {
            setError('Les mots de passe ne correspondent pas')
            return false
        }

        isLoading.value = true

        try {
            const response = await authStore.confirmPasswordReset({
                token,
                new_password: newPassword
            })
            setSuccess(response.message || 'Mot de passe réinitialisé avec succès')
            return true
        } catch (error: unknown) {
            const message = (error as any).response?.data?.detail || 
                          (error as any).response?.data?.message || 
                          'Une erreur est survenue'
            setError(message)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Gère le changement de mot de passe
     */
    const handlePasswordChange = async (oldPassword: string, newPassword: string, confirmPassword?: string) => {
        clearMessages()

        if (!oldPassword) {
            setError('Veuillez saisir votre mot de passe actuel')
            return false
        }

        // Validation du nouveau mot de passe
        const passwordValidation = validatePassword(newPassword)
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors[0])
            return false
        }

        // Vérification de la confirmation
        if (confirmPassword && !validatePasswordMatch(newPassword, confirmPassword)) {
            setError('Les mots de passe ne correspondent pas')
            return false
        }

        isLoading.value = true

        try {
            const response = await authStore.changePassword({
                old_password: oldPassword,
                new_password: newPassword
            })
            setSuccess(response.message || 'Mot de passe modifié avec succès')
            return true
        } catch (error: unknown) {
            const message = (error as any).response?.data?.detail || 
                          (error as any).response?.data?.message || 
                          'Une erreur est survenue'
            setError(message)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Gère la vérification d'email
     */
    const handleEmailVerification = async (token: string) => {
        clearMessages()

        if (!token) {
            setError('Token de vérification manquant')
            return false
        }

        isLoading.value = true

        try {
            const response = await authStore.verifyEmail(token)
            setSuccess(response.message || 'Email vérifié avec succès')
            return true
        } catch (error: unknown) {
            const message = (error as any).response?.data?.detail || 
                          (error as any).response?.data?.message || 
                          'Token invalide ou expiré'
            setError(message)
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        // État
        isLoading,
        errorMessage,
        successMessage,

        // Validation
        validateEmail,
        validatePhone,
        validatePassword,
        validatePasswordMatch,

        // Messages
        clearMessages,
        setError,
        setSuccess,

        // Actions
        handleLogin,
        handleRegister,
        handlePasswordResetRequest,
        handlePasswordResetConfirm,
        handlePasswordChange,
        handleEmailVerification
    }
}

export default useAuthForm
