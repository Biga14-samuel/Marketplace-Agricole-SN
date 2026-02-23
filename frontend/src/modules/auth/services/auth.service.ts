/**
 * SERVICE AUTHENTIFICATION
 * Appels API vers tous les endpoints d'authentification
 * Aligné sur les endpoints backend FastAPI du module Identité & Sécurité
 */

import axios, { type AxiosInstance } from 'axios'
import type {
    LoginCredentials,
    LoginResponse,
    RegisterData,
    RegisterResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    VerifyEmailRequest,
    MessageResponse,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordChange,
    User
} from '../types/auth.types'

class AuthService {
    private api: AxiosInstance

    constructor() {
        this.api = axios.create({
            baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1',
            timeout: 120000, // 2 minutes pour les opérations lentes comme l'inscription
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Intercepteur pour ajouter le token automatiquement
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getAccessToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Intercepteur pour gérer les erreurs 401 (token expiré)
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config
                const err = error as any

                if (err?.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true

                    try {
                        const refreshToken = this.getRefreshToken()
                        if (refreshToken) {
                            const response = await this.refreshToken({ refresh_token: refreshToken })

                            this.saveAccessToken(response.access_token)

                            // Retenter la requête originale avec le nouveau token
                            originalRequest.headers.Authorization = `Bearer ${response.access_token}`
                            return this.api(originalRequest)
                        }
                    } catch (refreshError) {
                        // Échec du rafraîchissement, déconnexion
                        this.clearTokens()
                        if (typeof window !== 'undefined') {
                            // ✅ FIX Bug 3: Redirection vers la vraie route /login
                            window.location.href = '/login'
                        }
                    }
                }

                return Promise.reject(error)
            }
        )
    }

    /**
     * POST /authentification/auth/register
     * Créer un compte utilisateur
     */
    async register(data: RegisterData): Promise<RegisterResponse> {
        const response = await this.api.post<RegisterResponse>('/authentification/auth/register', data)
        return response.data
    }

    /**
     * POST /authentification/auth/login
     * Connexion utilisateur
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await this.api.post<LoginResponse>('/authentification/auth/login', credentials)
        const { access_token, refresh_token, user } = response.data

        // Sauvegarder les tokens
        this.saveAccessToken(access_token)
        this.saveRefreshToken(refresh_token)

        return response.data
    }

    /**
     * POST /authentification/auth/refresh
     * Rafraîchir le token d'accès
     */
    async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        const response = await this.api.post<RefreshTokenResponse>('/authentification/auth/refresh', data)
        return response.data
    }

    /**
     * POST /authentification/auth/logout
     * Déconnexion utilisateur
     */
    async logout(): Promise<MessageResponse> {
        const refreshToken = this.getRefreshToken()
        if (refreshToken) {
            const response = await this.api.post<MessageResponse>('/authentification/auth/logout', {
                refresh_token: refreshToken
            })
            this.clearTokens()
            return response.data
        }
        this.clearTokens()
        return { message: 'Déconnexion réussie' }
    }

    /**
     * GET /authentification/auth/me
     * Obtenir le profil de l'utilisateur connecté
     */
    async getCurrentUser(): Promise<User> {
        const response = await this.api.get<User>('/authentification/auth/me')
        return response.data
    }

    /**
     * POST /authentification/auth/verify-email
     * Vérifier l'email
     */
    async verifyEmail(data: VerifyEmailRequest): Promise<MessageResponse> {
        const response = await this.api.post<MessageResponse>('/authentification/auth/verify-email', data)
        return response.data
    }

    /**
     * POST /authentification/auth/password-reset/request
     * Demander une réinitialisation de mot de passe
     */
    async requestPasswordReset(data: PasswordResetRequest): Promise<MessageResponse> {
        const response = await this.api.post<MessageResponse>('/authentification/auth/password-reset/request', data)
        return response.data
    }

    /**
     * POST /authentification/auth/password-reset/confirm
     * Confirmer la réinitialisation de mot de passe
     */
    async confirmPasswordReset(data: PasswordResetConfirm): Promise<MessageResponse> {
        const response = await this.api.post<MessageResponse>('/authentification/auth/password-reset/confirm', data)
        return response.data
    }

    /**
     * POST /authentification/auth/password/change
     * Changer le mot de passe (utilisateur connecté)
     */
    async changePassword(data: PasswordChange): Promise<MessageResponse> {
        const response = await this.api.post<MessageResponse>('/authentification/auth/password/change', data)
        return response.data
    }

    // ============================================
    // Méthodes utilitaires pour gérer les tokens
    // ============================================

    /**
     * Sauvegarde le token d'accès
     */
    saveAccessToken(token: string): void {
        localStorage.setItem('access_token', token)
    }

    /**
     * Sauvegarde le token de rafraîchissement
     */
    saveRefreshToken(token: string): void {
        localStorage.setItem('refresh_token', token)
    }

    /**
     * Récupère le token d'accès
     */
    getAccessToken(): string | null {
        return localStorage.getItem('access_token')
    }

    /**
     * Récupère le token de rafraîchissement
     */
    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token')
    }

    /**
     * Supprime tous les tokens
     */
    clearTokens(): void {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    isAuthenticated(): boolean {
        return !!this.getAccessToken()
    }
}

// Export d'une instance unique
export const authService = new AuthService()
export default authService
