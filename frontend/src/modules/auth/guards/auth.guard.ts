/**
 * Guards de navigation pour l'authentification
 * Protège les routes selon le statut d'authentification et les rôles
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import type { UserRole } from '../types/auth.types'

/**
 * Guard pour vérifier si l'utilisateur est authentifié
 */
export const requireAuth = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()

    // Initialiser l'authentification si ce n'est pas déjà fait
    if (!authStore.isInitialized) {
        await authStore.initializeAuth()
    }

    if (authStore.isAuthenticated) {
        next()
    } else {
        next({
            path: '/auth/login',
            query: { redirect: to.fullPath }
        })
    }
}

/**
 * Guard pour vérifier si l'utilisateur n'est PAS authentifié (pour login, register, etc.)
 */
export const requireGuest = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()

    // Initialiser l'authentification si ce n'est pas déjà fait
    if (!authStore.isInitialized) {
        await authStore.initializeAuth()
    }

    if (!authStore.isAuthenticated) {
        next()
    } else {
        next('/')
    }
}

/**
 * Guard pour vérifier si l'utilisateur a un rôle spécifique
 */
export const requireRole = (roles: UserRole | UserRole[]) => {
    return async (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
    ) => {
        const authStore = useAuthStore()

        // Initialiser l'authentification si ce n'est pas déjà fait
        if (!authStore.isInitialized) {
            await authStore.initializeAuth()
        }

        if (!authStore.isAuthenticated) {
            next({
                path: '/auth/login',
                query: { redirect: to.fullPath }
            })
            return
        }

        const requiredRoles = Array.isArray(roles) ? roles : [roles]
        const userRoles = authStore.user?.roles?.map(r => r.name) || []
        
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role))

        if (hasRequiredRole) {
            next()
        } else {
            next({
                path: '/unauthorized',
                query: { message: 'Vous n\'avez pas les permissions nécessaires' }
            })
        }
    }
}

/**
 * Guard pour vérifier si l'email est vérifié
 */
export const requireVerifiedEmail = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()

    // Initialiser l'authentification si ce n'est pas déjà fait
    if (!authStore.isInitialized) {
        await authStore.initializeAuth()
    }

    if (!authStore.isAuthenticated) {
        next({
            path: '/auth/login',
            query: { redirect: to.fullPath }
        })
        return
    }

    if (authStore.user?.is_verified) {
        next()
    } else {
        next({
            path: '/auth/verify-email',
            query: { message: 'Veuillez vérifier votre email pour continuer' }
        })
    }
}

/**
 * Guard combiné : authentification + rôle
 */
export const requireAuthAndRole = (roles: UserRole | UserRole[]) => {
    return async (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
    ) => {
        // First check authentication
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) {
            next({
                path: '/auth/login',
                query: { redirect: to.fullPath }
            })
            return
        }
        
        // Then check role
        requireRole(roles)(to, from, next)
    }
}

export default {
    requireAuth,
    requireGuest,
    requireRole,
    requireVerifiedEmail,
    requireAuthAndRole
}
