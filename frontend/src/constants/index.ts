// ============================================
// CONSTANTES GLOBALES DE L'APPLICATION
// ============================================

// Configuration de l'API
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    TIMEOUT: 30000,
    VERSION: 'v1'
} as const

// Routes principales
export const APP_ROUTES = {
    HOME: '/',
    CATALOG: '/catalogue',
    CART: '/panier',
    PROFILE: '/profil',
    ORDERS: '/commandes',
    ABOUT: '/a-propos',
    CONTACT: '/contact'
} as const

// Environnement
export const ENVIRONMENT = import.meta.env.MODE as 'development' | 'production' | 'test'

// Configuration de l'application
export const APP_CONFIG = {
    NAME: 'MarketFraîche',
    VERSION: '1.0.0',
    DESCRIPTION: 'Vos produits frais, directement des producteurs'
} as const

// Breakpoints pour le responsive
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
} as const

// Couleurs de l'application
export const COLORS = {
    PRIMARY: '#45a348',
    SECONDARY: '#ff8c42',
    ACCENT: '#118ab2',
    SUCCESS: '#10b981',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6'
} as const

// SUPPRIMER la section d'export groupé en bas