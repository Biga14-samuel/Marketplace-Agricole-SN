/**
 * STORE AUTHENTIFICATION
 * Gestion de l'état d'authentification avec Pinia
 * Aligné avec le backend FastAPI
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { authService } from '../services/auth.service'
import type {
    User,
    LoginCredentials,
    RegisterData,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordChange
} from '../types/auth.types'

export const useAuthStore = defineStore('auth', () => {
    // ============================================
    // State
    // ============================================
    const user: Ref<User | null> = ref(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const isInitialized = ref(false)

    // ============================================
    // Getters
    // ============================================
    const isAuthenticated = computed(() => {
        // ✅ FIX: On se fie uniquement à user.value qui est set en mémoire
        // Évite la race condition avec localStorage
        return user.value !== null
    })

    const currentUser = computed(() => user.value)

    const userRole = computed(() => {
        if (!user.value || !user.value.roles || user.value.roles.length === 0) {
            return 'Customer'
        }
        return user.value.roles[0].name
    })

    const hasRole = computed(() => (roleName: string) => {
        if (!user.value || !user.value.roles) return false
        return user.value.roles.some(role => role.name === roleName)
    })

    // ============================================
    // Actions
    // ============================================

    /**
     * Définit une erreur avec auto-effacement après 5 secondes
     */
    const setError = (message: string) => {
        error.value = message
        setTimeout(() => {
            error.value = null
        }, 5000)
    }

    /**
     * Nettoie les données UI non critiques qui peuvent rester d'un autre compte.
     */
    const clearUserUiStorage = () => {
        const keysToRemove = [
            'favoriteProducts',
            'productListViewMode',
            'wishlist'
        ]

        keysToRemove.forEach((key) => localStorage.removeItem(key))

        const prefixedKeys = ['favorite_', 'wishlist_']
        const toDelete: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (!key) continue
            if (prefixedKeys.some(prefix => key.startsWith(prefix))) {
                toDelete.push(key)
            }
        }
        toDelete.forEach((key) => localStorage.removeItem(key))
    }

    /**
     * Efface l'état d'authentification
     */
    const clearAuth = () => {
        user.value = null
        authService.clearTokens()
        clearUserUiStorage()
        error.value = null
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    const register = async (registerData: RegisterData) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.register(registerData)
            // L'inscription ne retourne pas de tokens, l'utilisateur doit vérifier son email
            return response
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               'Erreur lors de l\'inscription'
            setError(errorMessage)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    const login = async (credentials: LoginCredentials) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.login(credentials)
            clearUserUiStorage()
            user.value = response.user
            return response
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               'Erreur lors de la connexion'
            setError(errorMessage)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Déconnexion de l'utilisateur
     */
    const logout = async () => {
        isLoading.value = true
        try {
            await authService.logout()
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err)
        } finally {
            clearAuth()
            isLoading.value = false
        }
    }

    /**
     * Récupère le profil de l'utilisateur connecté
     */
    const fetchUserProfile = async () => {
        if (!authService.isAuthenticated()) {
            clearAuth()
            return
        }

        isLoading.value = true
        try {
            const userData = await authService.getCurrentUser()
            user.value = userData
        } catch (err: any) {
            console.error('Erreur lors de la récupération du profil:', err)
            // Si erreur 401 ou 404, déconnecter (token invalide ou utilisateur non trouvé)
            if (err.response?.status === 401 || err.response?.status === 404) {
                clearAuth()
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Vérifie l'email avec le token
     */
    const verifyEmail = async (token: string) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.verifyEmail({ token })
            return response
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               'Erreur lors de la vérification de l\'email'
            setError(errorMessage)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Renvoyer l'email de vérification.
     */
    const resendVerificationEmail = async (email: string) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.resendVerificationEmail({ email })
            return response
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.message ||
                'Erreur lors du renvoi de l\'email de vérification'
            setError(errorMessage)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Demande une réinitialisation de mot de passe
     */
    const requestPasswordReset = async (data: PasswordResetRequest) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.requestPasswordReset(data)
            return response
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               'Erreur lors de la demande de réinitialisation'
            setError(errorMessage)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Confirme la réinitialisation de mot de passe
     */
    const confirmPasswordReset = async (data: PasswordResetConfirm) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.confirmPasswordReset(data)
            return response
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               'Erreur lors de la réinitialisation'
            setError(errorMessage)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Change le mot de passe de l'utilisateur connecté
     */
    const changePassword = async (data: PasswordChange) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.changePassword(data)
            // Après changement de mot de passe, déconnecter l'utilisateur
            await logout()
            return response
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               'Erreur lors du changement de mot de passe'
            setError(errorMessage)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Initialise l'authentification au démarrage de l'application
     */
    const initializeAuth = async () => {
        if (isInitialized.value) return

        if (authService.isAuthenticated()) {
            try {
                await fetchUserProfile()
            } catch (err) {
                // ✅ FIX: Token invalide/périmé → nettoyer sans bloquer
                console.warn('Token invalide ou expiré, nettoyage du localStorage')
                clearAuth()
            }
        }
        
        isInitialized.value = true
    }

    /**
     * Initialise depuis le localStorage (alias pour initializeAuth)
     */
    const initializeFromLocalStorage = async () => {
        await initializeAuth()
    }

    /**
     * Récupère l'utilisateur actuel (alias pour fetchUserProfile)
     */
    const fetchCurrentUser = async () => {
        await fetchUserProfile()
    }

    /**
     * Réinitialise l'état (alias pour clearAuth)
     */
    const resetState = () => {
        clearAuth()
    }

    return {
        // State
        user,
        isLoading,
        error,
        isInitialized,

        // Getters
        isAuthenticated,
        currentUser,
        userRole,
        hasRole,

        // Actions
        register,
        login,
        logout,
        fetchUserProfile,
        fetchCurrentUser,
        verifyEmail,
        resendVerificationEmail,
        requestPasswordReset,
        confirmPasswordReset,
        changePassword,
        initializeAuth,
        initializeFromLocalStorage,
        clearAuth,
        resetState,
        setError
    }
})

export default useAuthStore
