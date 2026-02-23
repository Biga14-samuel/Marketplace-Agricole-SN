// Types pour les formulaires Vue - structure plate pour faciliter la manipulation
import type { PickupPointType, PickupPointStatus, DayOfWeek, ProductionType, CertificationType, DocumentType } from './ProducerProfile';

/**
 * Formulaire de point de retrait (structure plate)
 */
export interface PickupPointFormData {
    name: string;
    type: PickupPointType;
    description?: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    phone?: string;
    email?: string;
    instructions?: string;
    is_active: boolean;
    status?: PickupPointStatus;
}

/**
 * Formulaire de créneau de retrait
 */
export interface PickupSlotFormData {
    pickup_point_id: string;
    day_of_week: DayOfWeek;
    start_time: string;
    end_time: string;
    capacity: {
        max_orders: number;
        max_items_per_order: number;
        max_weight_per_order?: number;
        max_volume_per_order?: number;
    };
    is_active: boolean;
}

/**
 * Formulaire de profil producteur
 */
export interface ProducerProfileFormData {
    farm_name: string;
    business_name?: string;  // Ajouté pour compatibilité
    description?: string;
    production_type: ProductionType[];  // Tableau pour sélection multiple
    certifications: CertificationType[];
    farm_size?: number;
    established_year?: number;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
    email?: string;
    website?: string;
    bio?: string;
    siret?: string;
    tva_number?: string;
    iban?: string;
}

/**
 * Formulaire de vérification producteur
 */
export interface ProducerVerificationFormData {
    documents: Partial<Record<DocumentType, File | null>>;
    additional_info?: string;
}
