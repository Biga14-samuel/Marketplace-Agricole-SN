/**
 * Configuration de l'API pour le module d'authentification
 */

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/api/v1/authentification/auth/register',
            LOGIN: '/api/v1/authentification/auth/login',
            LOGOUT: '/api/v1/authentification/auth/logout',
            REFRESH: '/api/v1/authentification/auth/refresh',
            ME: '/api/v1/authentification/auth/me',
            VERIFY_EMAIL: '/api/v1/authentification/auth/verify-email',
            PASSWORD_RESET_REQUEST: '/api/v1/authentification/auth/password-reset/request',
            PASSWORD_RESET_CONFIRM: '/api/v1/authentification/auth/password-reset/confirm',
            PASSWORD_CHANGE: '/api/v1/authentification/auth/password/change'
        }
    },
    TIMEOUT: 30000,
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token'
    }
}

export default API_CONFIG
