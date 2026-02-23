/**
 * Composable pour gérer la session utilisateur
 * Aligné avec le système d'authentification du backend FastAPI
 */

import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import type { User, UserRole } from '../types/auth.types'

export function useSession() {
    const authStore = useAuthStore()

    /**
     * Utilisateur actuellement connecté
     */
    const user = computed<User | null>(() => authStore.currentUser)

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    const isAuthenticated = computed<boolean>(() => authStore.isAuthenticated)

    /**
     * Vérifie si la session est en cours de chargement
     */
    const isLoading = computed<boolean>(() => authStore.isLoading)

    /**
     * Rôle de l'utilisateur actuel
     */
    const userRole = computed<UserRole | null>(() => {
        if (!user.value || !user.value.roles || user.value.roles.length === 0) {
            return null
        }
        return user.value.roles[0].name as UserRole
    })

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     */
    const hasRole = (roleName: UserRole): boolean => {
        if (!user.value || !user.value.roles) return false
        return user.value.roles.some(role => role.name === roleName)
    }

    /**
     * Vérifie si l'utilisateur est un administrateur
     */
    const isAdmin = computed<boolean>(() => hasRole('Admin'))

    /**
     * Vérifie si l'utilisateur est un producteur
     */
    const isProducer = computed<boolean>(() => hasRole('Producer'))

    /**
     * Vérifie si l'utilisateur est un client
     */
    const isCustomer = computed<boolean>(() => hasRole('Customer'))

    /**
     * Vérifie si l'utilisateur est un modérateur
     */
    const isModerator = computed<boolean>(() => hasRole('Moderator'))

    /**
     * Vérifie si l'email de l'utilisateur est vérifié
     */
    const isEmailVerified = computed<boolean>(() => {
        return user.value?.is_verified ?? false
    })

    /**
     * Vérifie si le compte utilisateur est actif
     */
    const isAccountActive = computed<boolean>(() => {
        return user.value?.is_active ?? false
    })

    /**
     * Initialise la session (récupère les données utilisateur)
     */
    const initializeSession = async (): Promise<void> => {
        await authStore.initializeAuth()
    }

    /**
     * Rafraîchit les données de l'utilisateur
     */
    const refreshUser = async (): Promise<void> => {
        await authStore.fetchUserProfile()
    }

    /**
     * Déconnecte l'utilisateur
     */
    const logout = async (): Promise<void> => {
        await authStore.logout()
    }

    return {
        // État
        user,
        isAuthenticated,
        isLoading,
        userRole,
        
        // Vérifications de rôles
        hasRole,
        isAdmin,
        isProducer,
        isCustomer,
        isModerator,
        
        // Vérifications de statut
        isEmailVerified,
        isAccountActive,
        
        // Actions
        initializeSession,
        refreshUser,
        logout
    }
}

export default useSession
