// ============================================
// STORES D'AUTHENTIFICATION
// ============================================

// Export du vrai store d'authentification
export { useAuthStore } from './auth.store'

// Export des types d'authentification
export type {
    User,
    LoginCredentials,
    RegisterData,
    AuthState,
    AuthResponse,
    RefreshTokenResponse
} from '../types/auth.types'