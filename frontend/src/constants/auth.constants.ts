// auth.constants.ts

/**
 * Constantes pour l'authentification
 */

// Clés de stockage
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    SESSION: 'session',
    THEME: 'theme',
    LANGUAGE: 'language'
} as const

// Durées en millisecondes
export const DURATIONS = {
    ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 jours
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes avant expiration
    ERROR_MESSAGE_DISPLAY: 5000, // 5 secondes
    LOADING_TIMEOUT: 30000 // 30 secondes
} as const

// Routes d'authentification
export const AUTH_ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    CHANGE_PASSWORD: '/change-password',
    OAUTH_CALLBACK: '/auth/callback'
} as const

// Codes d'erreur HTTP
export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
} as const

// Messages d'erreur utilisateur
export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
    EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé',
    EMAIL_NOT_VERIFIED: 'Veuillez vérifier votre email avant de vous connecter',
    PASSWORD_TOO_WEAK: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    TOKEN_EXPIRED: 'Votre session a expiré, veuillez vous reconnecter',
    NETWORK_ERROR: 'Erreur de connexion au serveur',
    UNKNOWN_ERROR: 'Une erreur inattendue est survenue',
    REQUIRED_FIELD: 'Ce champ est requis',
    INVALID_EMAIL: 'Veuillez saisir un email valide',
    PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas'
} as const

// Messages de succès
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Connexion réussie',
    LOGOUT_SUCCESS: 'Déconnexion réussie',
    REGISTER_SUCCESS: 'Inscription réussie, vérifiez votre email',
    PASSWORD_RESET_SENT: 'Un email de réinitialisation a été envoyé',
    PASSWORD_CHANGED: 'Mot de passe changé avec succès',
    EMAIL_VERIFIED: 'Email vérifié avec succès',
    PROFILE_UPDATED: 'Profil mis à jour avec succès'
} as const

// Règles de validation
export const VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    EMAIL: {
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50
    }
} as const

// Providers OAuth supportés
export const OAUTH_PROVIDERS = {
    GOOGLE: {
        id: 'google',
        name: 'Google',
        icon: 'mdi-google',
        color: '#DB4437',
        scopes: ['profile', 'email']
    },
    GITHUB: {
        id: 'github',
        name: 'GitHub',
        icon: 'mdi-github',
        color: '#333333',
        scopes: ['user:email']
    },
    FACEBOOK: {
        id: 'facebook',
        name: 'Facebook',
        icon: 'mdi-facebook',
        color: '#1877F2',
        scopes: ['email', 'public_profile']
    }
} as const

// Configurations par défaut
export const DEFAULT_CONFIG = {
    AUTO_REFRESH_TOKENS: true,
    TOKEN_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
    PERSIST_SESSION: true,
    SHOW_LOADING_INDICATOR: true,
    ENABLE_OAUTH: true
} as const

// Types utilitaires pour les constantes
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES]
export type OAuthProviderKey = keyof typeof OAUTH_PROVIDERS
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES]
export type SuccessMessage = typeof SUCCESS_MESSAGES[keyof typeof SUCCESS_MESSAGES]