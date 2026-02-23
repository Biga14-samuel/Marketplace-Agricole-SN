// auth.types.ts

// ============================================
// Types principaux
// ============================================

/**
 * Rôle utilisateur (aligné avec le backend)
 */
export interface Role {
    id: number
    name: string
    description?: string
    created_at: string
}

/**
 * Représente un utilisateur dans l'application (aligné avec le backend)
 */
export interface User {
    id: number
    email: string
    phone?: string
    is_active: boolean
    is_verified: boolean
    created_at: string
    updated_at: string
    roles: Role[]
}

/**
 * Rôles utilisateur disponibles
 */
export type UserRole = 'Admin' | 'Producer' | 'Customer' | 'Moderator'

/**
 * Enum des noms de rôles pour utilisation dans les routes et guards
 */
export enum RoleName {
    ADMIN = 'Admin',
    PRODUCER = 'Producer',
    CUSTOMER = 'Customer',
    MODERATOR = 'Moderator'
}

/**
 * Ensemble de tokens d'authentification (aligné avec le backend)
 */
export interface AuthTokens {
    access_token: string
    refresh_token: string
    token_type: string
}

/**
 * Réponse de connexion (aligné avec le backend)
 */
export interface LoginResponse {
    access_token: string
    refresh_token: string
    token_type: string
    user: User
}

/**
 * Alias pour LoginResponse (pour compatibilité)
 */
export type AuthResponse = LoginResponse

/**
 * Réponse de rafraîchissement de token
 */
export interface RefreshTokenResponse {
    access_token: string
    token_type: string
}

// ============================================
// Types pour les requêtes
// ============================================

/**
 * Données pour la connexion
 */
export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
}

/**
 * Données pour l'inscription (aligné avec le backend)
 */
export interface RegisterData {
    email: string
    password: string
    phone?: string
    first_name?: string
    last_name?: string
    role?: string // ✅ NOUVEAU: Rôle choisi (Customer ou Producer)
}

/**
 * Réponse d'inscription
 */
export interface RegisterResponse {
    message: string
    detail?: string
}

/**
 * Données pour rafraîchir le token (aligné avec le backend)
 */
export interface RefreshTokenRequest {
    refresh_token: string
}

/**
 * Données pour vérifier l'email (aligné avec le backend)
 */
export interface VerifyEmailRequest {
    token: string
}

/**
 * Données pour demander une réinitialisation de mot de passe (aligné avec le backend)
 */
export interface PasswordResetRequest {
    email: string
}

/**
 * Données pour confirmer la réinitialisation de mot de passe (aligné avec le backend)
 */
export interface PasswordResetConfirm {
    token: string
    new_password: string
}

/**
 * Données pour changer le mot de passe (aligné avec le backend)
 */
export interface PasswordChange {
    old_password: string
    new_password: string
}

/**
 * Réponse générique avec message
 */
export interface MessageResponse {
    message: string
    detail?: string
}

// ============================================
// Types pour l'état d'authentification
// ============================================

/**
 * État du store d'authentification
 */
export interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isLoading: boolean
    error: string | null
    isInitialized: boolean
}

/**
 * Configuration du store d'authentification
 */
export interface AuthConfig {
    storageKey?: string
    tokenRefreshInterval?: number
    autoRefreshTokens?: boolean
}

// ============================================
// Types pour les réponses d'erreur
// ============================================

/**
 * Erreur standard de l'API d'authentification
 */
export interface AuthError {
    message: string
    code?: string
    statusCode?: number
    errors?: Record<string, string[]>
    timestamp?: Date | string
}

/**
 * Codes d'erreur courants
 */
export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN'
}

// ============================================
// Types pour les événements d'authentification
// ============================================

/**
 * Événements émis par le système d'authentification
 */
export interface AuthEvents {
    onLogin?: (user: User) => void
    onLogout?: (reason?: string) => void
    onTokenRefresh?: (tokens: AuthTokens) => void
    onError?: (error: AuthError) => void
    onUserUpdate?: (user: User) => void
}

// ============================================
// Types pour les hooks/utilitaires
// ============================================

/**
 * Options pour les hooks d'authentification
 */
export interface UseAuthOptions {
    requireAuth?: boolean
    redirectTo?: string
    onUnauthenticated?: () => void
}

/**
 * Résultat du hook d'authentification
 */
export interface UseAuthResult {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => Promise<void>
    register: (data: RegisterData) => Promise<void>
}

// ============================================
// Types pour les validations
// ============================================

/**
 * Schéma de validation pour les formulaires d'authentification
 */
export interface AuthValidationSchema {
    email?: string[]
    password?: string[]
    name?: string[]
    confirmPassword?: string[]
    [key: string]: string[] | undefined
}

/**
 * Règles de validation des mots de passe
 */
export interface PasswordPolicy {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxLength?: number
}

// ============================================
// Types pour les configurations OAuth
// ============================================

/**
 * Configuration pour les providers OAuth
 */
export interface OAuthProvider {
    id: string
    name: string
    icon: string
    color: string
    scopes: string[]
    authorizeUrl: string
    clientId: string
    redirectUri: string
}

/**
 * Données pour la connexion OAuth
 */
export interface OAuthLoginData {
    provider: string
    code: string
    state?: string
    redirectUri?: string
}

// ============================================
// Types pour les sessions
// ============================================

/**
 * Informations sur la session utilisateur
 */
export interface SessionInfo {
    id: string
    userId: string
    ipAddress?: string
    userAgent?: string
    location?: string
    device?: string
    os?: string
    browser?: string
    lastActive: Date | string
    createdAt: Date | string
    isCurrent?: boolean
}

// ============================================
// Types utilitaires
// ============================================

/**
 * Type pour les fonctions asynchrones avec état de chargement
 */
export interface AsyncAction<T = void> {
    execute: (...args: any[]) => Promise<T>
    isLoading: boolean
    error: Error | null
    data: T | null
}

/**
 * Type pour les requêtes paginées
 */
export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

/**
 * Extrait les clés d'un type qui sont obligatoires
 */
export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

/**
 * Rend certaines propriétés d'un type optionnelles
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Crée un type avec toutes les propriétés en lecture seule
 */
export type ReadonlyDeep<T> = {
    readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P]
}

// ============================================
// Exports groupés (sans conflit)
// ============================================

// Pas besoin de réexporter, toutes les interfaces/types sont déjà exportés
// individuellement avec les déclarations ci-dessus