// ============================================
// TYPES GLOBAUX DE L'APPLICATION
// ============================================

// Types de base
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Dictionary<T = any> = Record<string, T>
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    errors?: Record<string, string[]>
    meta?: {
        total?: number
        page?: number
        limit?: number
        pages?: number
    }
}

// Note: PaginatedResponse est déjà défini dans auth.types.ts
// Si vous voulez une version globale, renommez-le ou utilisez un alias
export interface GlobalPaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Types pour l'application
export interface AppConfig {
    name: string
    version: string
    apiUrl: string
    environment: 'development' | 'production' | 'test'
}

// Types pour les composants
export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
}

export interface Toast {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
}

// Types pour les événements
export interface AppEvent {
    type: string
    payload?: any
    timestamp: Date
}

// Types des autres modules (stubs temporaires ou imports conditionnels)
// Note: Supprimez ces lignes si les fichiers n'existent pas encore

// Pour éviter les erreurs, définissez des stubs temporaires ou commentez les imports
// export type { User } from '../modules/auth'
// export type { Product } from '../modules/products'
// export type { Order } from '../modules/orders'

// Stubs temporaires pour les types des modules non encore créés
export interface User {
    id: string
    email: string
    name?: string
}

export interface Product {
    id: string
    name: string
    price: number
}

export interface Order {
    id: string
    userId: string
    total: number
    status: string
}

// Note: Pas besoin de bloc d'export groupé car tout est déjà exporté individuellement