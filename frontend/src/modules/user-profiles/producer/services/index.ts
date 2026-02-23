import { getErrorMessage } from '@/shared/utils/error-handler';
// ============================================
// SERVICES PRINCIPAUX
// ============================================

// Profil Producteur
export { ProducerProfileService } from './ProducerProfileService';

// Documents Producteur
export { ProducerDocumentService } from './ProducerDocumentService';

// Points de retrait
export { PickupPointService } from './PickupPointService';

// Créneaux de retrait
export { PickupSlotService } from './PickupSlotService';

// ============================================
// SERVICES SPÉCIALISÉS
// ============================================

// Service de géolocalisation
export * from './GeolocationService';

// Service de validation
export * from './ValidationService';

// Service de notifications
export * from './NotificationService';

// Service d'export/rapport
export * from './ReportService';

// ============================================
// TYPES RE-EXPORTS
// ============================================

// Types de profil producteur
export type {
    ProducerProfile,
    ProducerProfileCreate,
    ProducerProfileUpdate,
    ProductionType,
    ProducerDocument,
    DocumentType,
    VerificationRequest
} from '../types';

// Types de points de retrait
export type {
    PickupPoint,
    PickupPointType,
    PickupPointStatus,
    Coordinates,
    PickupSchedule,
    PickupException,
    PickupAnalytics,
    PickupPointWithSlots
} from '../types';

// Types de créneaux
export type {
    PickupSlot,
    AvailableSlot,
    SlotStatus,
    RecurrencePattern,
    DayOfWeek
} from '../types';

// Types d'horaires
export type {
    ProducerSchedule
} from '../types';

// ============================================
// UTILITAIRES D'API
// ============================================

/**
 * Configuration globale de l'API
 */
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Gestionnaire d'erreurs global
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Utilitaires pour les services
 */
export const ServiceHelpers = {
    /**
     * Formate une date pour l'API
     */
    formatDate: (date: Date): string => {
        return date.toISOString().split('T')[0];
    },

    /**
     * Formate une heure pour l'API
     */
    formatTime: (date: Date): string => {
        return date.toTimeString().split(' ')[0].substring(0, 5);
    },

    /**
     * Parse une réponse d'erreur API
     */
    parseApiError: (error: unknown): string => {
        if ((error as any).response?.data?.message) {
            return (error as any).response.data.message;
        }
        if (getErrorMessage(error)) {
            return getErrorMessage(error);
        }
        return 'Une erreur inattendue s\'est produite';
    }
};