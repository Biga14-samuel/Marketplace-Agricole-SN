import { getErrorMessage } from '@/shared/utils/error-handler';
/**
 * Intercepteurs HTTP pour gérer l'authentification et les erreurs
 * Aligné avec le backend FastAPI
 */

import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { authService } from './auth.service'

/**
 * Configure les intercepteurs pour une instance Axios
 */
export const setupInterceptors = (axiosInstance: AxiosInstance) => {
    
    // Intercepteur de requête - Ajoute le token d'authentification
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = authService.getAccessToken()
            
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`
            }
            
            return config
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        }
    )

    // Intercepteur de réponse - Gère les erreurs et le rafraîchissement du token
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

            // Erreur 401 - Token expiré
            if ((error as any).response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const refreshToken = authService.getRefreshToken()
                    
                    if (refreshToken) {
                        // Tenter de rafraîchir le token
                        const response = await authService.refreshToken({ refresh_token: refreshToken })
                        
                        // Sauvegarder le nouveau token
                        authService.saveAccessToken(response.access_token)

                        // Mettre à jour le header de la requête originale
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${response.access_token}`
                        }

                        // Retenter la requête originale
                        return axiosInstance(originalRequest)
                    }
                } catch (refreshError) {
                    // Échec du rafraîchissement - Déconnecter l'utilisateur
                    authService.clearTokens()
                    
                    // Rediriger vers la page de connexion
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login?session=expired'
                    }
                    
                    return Promise.reject(refreshError)
                }
            }

            // Erreur 403 - Accès interdit
            if ((error as any).response?.status === 403) {
                console.error('Accès interdit:', (error as any).response.data)
                
                if (typeof window !== 'undefined') {
                    window.location.href = '/unauthorized'
                }
            }

            // Erreur 404 - Ressource non trouvée
            if ((error as any).response?.status === 404) {
                console.error('Ressource non trouvée:', error.config?.url)
            }

            // Erreur 500 - Erreur serveur
            if ((error as any).response?.status === 500) {
                console.error('Erreur serveur:', (error as any).response.data)
            }

            return Promise.reject(error)
        }
    )
}

/**
 * Extrait le message d'erreur d'une réponse API
 */
export const extractErrorMessage = (error: unknown): string => {
    if ((error as any).response?.data?.detail) {
        return (error as any).response.data.detail
    }
    
    if ((error as any).response?.data?.message) {
        return (error as any).response.data.message
    }
    
    if (getErrorMessage(error)) {
        return getErrorMessage(error)
    }
    
    return 'Une erreur est survenue'
}

/**
 * Vérifie si une erreur est une erreur de validation
 */
export const isValidationError = (error: unknown): boolean => {
    return (error as any).response?.status === 422
}

/**
 * Extrait les erreurs de validation d'une réponse API
 */
export const extractValidationErrors = (error: unknown): Record<string, string[]> => {
    if ((error as any).response?.data?.errors) {
        return (error as any).response.data.errors
    }
    
    return {}
}

export default {
    setupInterceptors,
    extractErrorMessage,
    isValidationError,
    extractValidationErrors
}
