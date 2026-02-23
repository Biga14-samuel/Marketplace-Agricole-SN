/**
 * Module d'authentification
 * Export centralisé de tous les composants, services, stores, etc.
 * Aligné avec le backend FastAPI - Module Identité & Sécurité
 */

// Services
export { authService } from './services/auth.service'

// Stores
export { useAuthStore } from './stores/auth.store'

// Composables
export * from './composables'

// Guards
export * from './guards/auth.guard'

// Routes
export { default as authRoutes } from './router'

// Types
export * from './types/auth.types'

// Utilitaires
export * from './utils'

// Configuration
export { API_CONFIG } from './config/api.config'

/**
 * Installation du module dans l'application Vue
 */
export default {
    install: (app: any) => {
        // Le module peut être installé si nécessaire
        // Par exemple, pour enregistrer des composants globaux
        console.log('Module Auth installé')
    }
}
