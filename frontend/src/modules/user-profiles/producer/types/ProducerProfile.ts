// frontend/src/modules/user-profiles/producer/types/ProducerProfile.ts

/**
 * Types pour les profils producteurs
 * Correspond aux endpoints de l'API Producer Profiles
 */

// ==================== ENUMS ====================

/**
 * Type de production agricole
 */
export enum ProductionType {
    ORGANIC = 'organic',          // Agriculture biologique
    BIODYNAMIC = 'biodynamic',    // Biodynamie
    PERMACULTURE = 'permaculture', // Permaculture
    CONVENTIONAL = 'conventional', // Conventionnel
    HYDROPONIC = 'hydroponic',    // Hydroponie
    URBAN = 'urban',              // Agriculture urbaine
    FAMILY = 'family',            // Ferme familiale
    COOPERATIVE = 'cooperative',  // Coopérative
    SPECIALTY = 'specialty'       // Spécialité (truffes, safran, etc.)
}

/**
 * Type de certification
 */
export enum CertificationType {
    AB = 'ab',                    // Agriculture Biologique (France)
    EU_ORGANIC = 'eu_organic',    // Bio Européen
    DEMETER = 'demeter',          // Biodynamie Demeter
    NATURE_PROGRES = 'nature_progres',
    HAUTE_VALEUR_ENVIRONNEMENTALE = 'hve',
    FAIRTRADE = 'fairtrade',      // Commerce équitable
    LOCAL = 'local',              // Production locale
    AOP = 'aop',                  // Appellation d'Origine Protégée
    AOC = 'aoc',                  // Appellation d'Origine Contrôlée
    IGP = 'igp',                  // Indication Géographique Protégée
    LABEL_ROUGE = 'label_rouge'
}

/**
 * Type de document légal
 */
export enum DocumentType {
    KBIS = 'kbis',                // Extrait Kbis
    INSURANCE = 'insurance',      // Attestation d'assurance
    CERTIFICATION = 'certification', // Certificat de production
    IDENTITY = 'identity',        // Pièce d'identité
    SIRET = 'siret',              // Justificatif SIRET
    TVA = 'tva',                  // Numéro de TVA
    IBAN = 'iban',                // Relevé d'identité bancaire
    HYGIENE = 'hygiene',          // Certificat d'hygiène
    QUALITY = 'quality',           // Certification qualité
    OTHER = 'other'
}

/**
 * Statut de vérification
 */
export enum VerificationStatus {
    PENDING = 'pending',          // En attente
    UNDER_REVIEW = 'under_review', // En cours de vérification
    VERIFIED = 'verified',        // Vérifié
    REJECTED = 'rejected',        // Rejeté
    SUSPENDED = 'suspended'       // Suspendu
}

/**
 * Jours de la semaine
 */
export enum DayOfWeek {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7
}

/**
 * Statut du point de retrait
 */
export enum PickupPointStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    TEMPORARILY_CLOSED = 'temporarily_closed',
    COMING_SOON = 'coming_soon'
}

/**
 * Type de point de retrait
 */
export enum PickupPointType {
    FARM = 'farm',                // À la ferme
    MARKET = 'market',            // Marché
    FARMERS_MARKET = 'farmers_market', // Marché de producteurs
    DELIVERY_POINT = 'delivery_point', // Point relais
    DRIVE = 'drive',              // Drive
    COLLECTIVE = 'collective',    // Point collectif
    MOBILE = 'mobile'             // Mobile (camion, van)
}

// ==================== INTERFACES PRINCIPALES ====================

/**
 * Profil complet du producteur (correspond à GET /profile/complete)
 */
export interface ProducerProfile {
    // Identifiants
    id: string;
    user_id: string;

    // Informations de l'entreprise
    business_name: string;
    legal_name?: string;
    description?: string;
    bio: string;

    // Informations légales
    siret: string;
    tva_number: string;
    iban: string;
    bic?: string;

    // Informations de production
    farm_size: number;           // en hectares
    production_type: ProductionType;
    certifications: CertificationType[];
    other_certifications?: string[];

    // Localisation
    address: {
        street: string;
        city: string;
        postal_code: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };

    // Contact
    phone?: string;
    website?: string;
    email: string;

    // Réseaux sociaux
    social_media?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };

    // Images
    logo_url?: string;
    banner_url?: string;
    gallery?: string[];          // URLs des images de la ferme/production

    // Statut
    is_verified: boolean;
    verified: boolean;  // Alias pour compatibilité
    verification_status: VerificationStatus;
    verification_date?: string;

    // Métriques
    rating?: number;              // Note moyenne (0-5)
    review_count?: number;        // Nombre d'avis
    product_count?: number;       // Nombre de produits actifs
    order_count?: number;         // Nombre de commandes totales

    // Dates
    created_at: string;
    updated_at: string;
    verified_at?: string;

    // Préférences
    preferences?: {
        auto_confirm_orders?: boolean;
        notify_new_orders?: boolean;
        notify_reviews?: boolean;
        default_pickup_point_id?: string;
        language?: string;
    };
}

/**
 * Format pour la création/mise à jour du profil (POST/PUT /profile)
 */
export interface CreateProducerProfile {
    business_name: string;
    legal_name?: string;
    description?: string;
    bio: string;
    siret: string;
    tva_number: string;
    iban: string;
    bic?: string;
    farm_size: number;
    production_type: ProductionType;
    certifications: CertificationType[];
    other_certifications?: string[];
    address: {
        street: string;
        city: string;
        postal_code: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    phone?: string;
    website?: string;
    social_media?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    logo_url?: string;
    banner_url?: string;
}

export interface UpdateProducerProfile extends Partial<CreateProducerProfile> {
    bio?: string;
    is_verified?: boolean;
    verification_status?: VerificationStatus;
}

// ==================== ADDITIONAL TYPES ====================

/**
 * Données pour créer un profil producteur
 */
export interface ProducerProfileCreate extends CreateProducerProfile { }

/**
 * Données pour mettre à jour un profil producteur
 */
export interface ProducerProfileUpdate extends UpdateProducerProfile { }

/**
 * Données pour uploader un document
 */
export interface ProducerDocumentUpload extends UploadDocument { }

/**
 * Données pour mettre à jour un document
 */
export interface ProducerDocumentUpdate {
    type?: DocumentType;
    verified?: boolean;
    verified_by?: string;
    verified_at?: string;
    expires_at?: string;
    metadata?: Record<string, any>;
}

/**
 * Données pour créer un point de retrait
 */
export interface PickupPointCreate extends CreatePickupPoint { }

/**
 * Données pour créer un créneau
 */
export interface PickupSlotCreate extends CreatePickupSlot { }

/**
 * Données pour mettre à jour un horaire
 */
export interface ProducerScheduleUpdate extends UpdateSchedule { }

/**
 * Demande de vérification
 */
export interface VerificationRequest {
    producer_id: string;
    document_type: DocumentType;
    message?: string;
    priority: 'normal' | 'high' | 'urgent';
}

/**
 * Profil producteur complet avec statistiques étendues
 * (correspond à GET /profile/complete)
 */
export interface CompleteProducerProfile extends ProducerProfile {
    statistics: {
        total_orders: number;
        completed_orders: number;
        pending_orders: number;
        total_revenue: number;
        average_order_value: number;
        customer_count: number;
        repeat_customer_rate: number;
    };
    pickup_points: PickupPoint[];
    documents: ProducerDocument[];
    schedule: ProducerSchedule[];
    recent_orders?: Array<{
        id: string;
        customer_name: string;
        total_amount: number;
        status: string;
        created_at: string;
    }>;
    recent_reviews?: Array<{
        id: string;
        customer_name: string;
        rating: number;
        comment: string;
        created_at: string;
    }>;
}

/**
 * Producteur vérifié (correspond à GET /verified)
 */
export interface VerifiedProducer {
    id: string;
    business_name: string;
    description?: string;
    bio: string;
    logo_url?: string;
    banner_url?: string;
    production_type: ProductionType;
    certifications: CertificationType[];
    address: {
        city: string;
        postal_code: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    rating: number;
    review_count: number;
    product_count: number;
    pickup_points: Array<{
        id: string;
        name: string;
        address: string;
        type: PickupPointType;
    }>;
    distance?: number; // en km
    is_favorite?: boolean;
    verified_at: string;
}

// ==================== DOCUMENTS ====================

/**
 * Document légal du producteur
 */
export interface ProducerDocument {
    id: string;
    producer_id: string;
    type: DocumentType;
    file_path: string;
    file_name: string;
    file_size: number;
    file_type: string;
    verified: boolean;
    verified_by?: string;
    verified_at?: string;
    uploaded_at: string;
    expires_at?: string;
    metadata?: Record<string, any>;
}

export interface UploadDocument {
    type: DocumentType;
    file: File;
    expires_at?: string;
}

export interface DocumentVerification {
    verified: boolean;
    verified_by?: string;
    comment?: string;
}

// ==================== POINTS DE RETRAIT ====================

/**
 * Point de retrait (correspond aux endpoints /pickup-points)
 */
export interface PickupPoint {
    id: string;
    producer_id: string;
    name: string;
    type: PickupPointType;
    description?: string;

    // Adresse
    address: {
        street: string;
        city: string;
        postal_code: string;
        country: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        additional_info?: string;
    };

    // Instructions
    instructions: string;
    parking_info?: string;
    accessibility_info?: string;

    // Contact spécifique
    contact_phone?: string;
    contact_email?: string;

    // Statut
    is_active: boolean;
    status: PickupPointStatus;

    // Capacité
    max_daily_orders?: number;
    max_simultaneous_customers?: number;

    // Images
    images?: string[];

    // Horaires par défaut
    default_opening_hours?: Array<{
        day_of_week: DayOfWeek;
        open_time: string; // format "HH:MM"
        close_time: string; // format "HH:MM"
    }>;

    // Dates
    created_at: string;
    updated_at: string;
}

export interface CreatePickupPoint {
    name: string;
    type: PickupPointType;
    description?: string;
    address: {
        street: string;
        city: string;
        postal_code: string;
        country: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        additional_info?: string;
    };
    instructions: string;
    parking_info?: string;
    accessibility_info?: string;
    contact_phone?: string;
    contact_email?: string;
    is_active?: boolean;
    max_daily_orders?: number;
    max_simultaneous_customers?: number;
    images?: File[];
    default_opening_hours?: Array<{
        day_of_week: DayOfWeek;
        open_time: string;
        close_time: string;
    }>;
}

export interface UpdatePickupPoint extends Partial<CreatePickupPoint> {
    status?: PickupPointStatus;
}

/**
 * Réponse pour la liste des points de retrait
 */
export interface PickupPointListResponse {
    pickup_points: PickupPoint[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
}

// ==================== CRÉNEAUX DE RETRAIT ====================

/**
 * Créneau de retrait (correspond aux endpoints /slots)
 */
export interface PickupSlot {
    id: string;
    pickup_point_id: string;
    date: string; // format "YYYY-MM-DD"
    day_of_week: DayOfWeek;
    start_time: string; // format "HH:MM"
    end_time: string; // format "HH:MM"
    max_orders: number;
    current_orders: number;
    available_slots: number;
    is_active: boolean;
    is_full: boolean;

    // Restrictions
    min_order_notice_hours?: number; // Délai minimum pour réserver (en heures)
    max_orders_per_customer?: number; // Limite par client

    // Prix optionnel
    fee?: number; // Frais de retrait

    // Dates
    created_at: string;
    updated_at: string;
}

export interface CreatePickupSlot {
    pickup_point_id: string;
    date: string;
    start_time: string;
    end_time: string;
    max_orders: number;
    min_order_notice_hours?: number;
    max_orders_per_customer?: number;
    fee?: number;
    is_active?: boolean;
}

export interface UpdatePickupSlot extends Partial<CreatePickupSlot> {
    current_orders?: number;
}

/**
 * Créneaux disponibles pour un jour (GET /slots/available)
 */
export interface AvailableSlot extends PickupSlot {
    pickup_point_name: string;
    pickup_point_address: string;
    pickup_point_type: PickupPointType;
}

export interface AvailableSlotsResponse {
    date: string;
    pickup_point_id: string;
    slots: AvailableSlot[];
    total_available: number;
}

/**
 * Pour la génération de créneaux récurrents
 */
export interface RecurringSlotGeneration {
    pickup_point_id: string;
    start_date: string;
    end_date?: string;
    days_of_week: DayOfWeek[];
    start_time: string;
    end_time: string;
    max_orders: number;
    min_order_notice_hours?: number;
    max_orders_per_customer?: number;
    fee?: number;
    exclude_dates?: string[]; // Dates à exclure (format "YYYY-MM-DD")
}

// ==================== HORAIRES D'OUVERTURE ====================

/**
 * Horaires d'ouverture du producteur
 */
export interface ProducerSchedule {
    id: string;
    producer_id: string;
    day_of_week: DayOfWeek;
    open_time: string;
    close_time: string;
    is_active: boolean;
    pickup_point_id?: string; // Si spécifique à un point de retrait
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateSchedule {
    day_of_week: DayOfWeek;
    open_time: string;
    close_time: string;
    is_active?: boolean;
    pickup_point_id?: string;
    notes?: string;
}

export interface UpdateSchedule extends Partial<CreateSchedule> { }

// ==================== RÉPONSES API ====================

/**
 * Réponses API standardisées
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        total_pages?: number;
    };
}

export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any>;
    };
}

/**
 * Réponse pour la liste des producteurs vérifiés
 */
export interface VerifiedProducersResponse {
    producers: VerifiedProducer[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
    filters?: {
        production_type?: ProductionType[];
        certification?: CertificationType[];
        distance?: number;
        rating?: number;
    };
}

/**
 * Statistiques pour le dashboard producteur
 */
export interface ProducerStats {
    overview: {
        total_orders: number;
        total_revenue: number;
        active_products: number;
        pickup_points: number;
        customer_count: number;
    };
    recent_activity: {
        new_orders: number;
        pending_orders: number;
        new_reviews: number;
        messages: number;
    };
    revenue: {
        current_month: number;
        previous_month: number;
        growth_percentage: number;
        by_product_category: Array<{
            category: string;
            revenue: number;
            percentage: number;
        }>;
    };
    orders: {
        status_distribution: Array<{
            status: string;
            count: number;
            percentage: number;
        }>;
        daily_average: number;
        peak_day: string;
    };
    customers: {
        new_customers: number;
        returning_customers: number;
        favorite_customers: Array<{
            customer_id: string;
            customer_name: string;
            order_count: number;
            total_spent: number;
        }>;
    };
}

// ==================== TYPES UTILITAIRES ====================

/**
 * Pour la recherche/filtrage des producteurs
 */
export interface ProducerFilters {
    search?: string;
    production_type?: ProductionType[];
    certifications?: CertificationType[];
    min_rating?: number;
    distance?: number; // Rayon en km
    coordinates?: {
        lat: number;
        lng: number;
    };
    pickup_point_type?: PickupPointType[];
    is_verified?: boolean;
    sort_by?: 'rating' | 'distance' | 'newest' | 'name';
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

/**
 * Pour la pagination
 */
export interface PaginationParams {
    page: number;
    limit: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

/**
 * Coordonnées géographiques
 */
export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Adresse complète
 */
export interface FullAddress {
    street: string;
    city: string;
    postal_code: string;
    country: string;
    coordinates?: Coordinates;
    formatted_address?: string;
}

// ==================== TYPES POUR LES FORMULAIRES ====================

/**
 * Données pour le formulaire de création de profil
 */
export interface ProducerProfileFormData {
    // Section 1: Informations de base
    business_name: string;
    legal_name?: string;
    description: string;
    bio: string;

    // Section 2: Informations légales
    siret: string;
    tva_number: string;
    iban: string;
    bic?: string;

    // Section 3: Production
    farm_size: number;
    production_type: ProductionType;
    certifications: CertificationType[];
    other_certifications?: string;

    // Section 4: Contact
    phone: string;
    website?: string;
    email: string;

    // Section 5: Adresse
    address: {
        street: string;
        city: string;
        postal_code: string;
        country: string;
        coordinates?: Coordinates;
    };

    // Section 6: Réseaux sociaux
    social_media?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };

    // Section 7: Images
    logo?: File;
    banner?: File;
    gallery?: File[];

    // Acceptation des conditions
    accept_terms: boolean;
    accept_privacy_policy: boolean;
}

/**
 * Validation des champs du formulaire
 */
export interface ProducerProfileValidation {
    isValid: boolean;
    errors: Record<string, string[]>;
    touched: Record<string, boolean>;
}

// ==================== TYPES POUR L'ÉTAT ====================

/**
 * État du producteur dans le store
 */
export interface ProducerState {
    profile: ProducerProfile | null;
    completeProfile: CompleteProducerProfile | null;
    pickupPoints: PickupPoint[];
    documents: ProducerDocument[];
    schedule: ProducerSchedule[];
    verifiedProducers: VerifiedProducer[];
    stats: ProducerStats | null;

    // État de chargement
    loading: {
        profile: boolean;
        pickupPoints: boolean;
        documents: boolean;
        schedule: boolean;
        verifiedProducers: boolean;
        stats: boolean;
    };

    // État d'erreur
    error: {
        profile: string | null;
        pickupPoints: string | null;
        documents: string | null;
        schedule: string | null;
        verifiedProducers: string | null;
        stats: string | null;
    };

    // Pagination
    pagination: {
        pickupPoints: {
            page: number;
            limit: number;
            total: number;
            hasMore: boolean;
        };
        verifiedProducers: {
            page: number;
            limit: number;
            total: number;
            hasMore: boolean;
        };
    };
}

// ==================== EXPORTS ====================

export type {
    CompleteProducerProfile as ProducerCompleteProfile,
    VerifiedProducer as VerifiedProducerProfile,
    PickupPoint as ProducerPickupPoint,
    PickupSlot as ProducerPickupSlot,
    ProducerSchedule as ProducerBusinessHours
};

/**
 * Helper pour transformer les données de l'API en types TypeScript
 */
export const transformProducerProfile = (data: Record<string, unknown>): ProducerProfile => {
    const profile = data as unknown as ProducerProfile;
    return {
        ...profile,
        created_at: data.created_at ? new Date(data.created_at as string).toISOString() : new Date().toISOString(),
        updated_at: data.updated_at ? new Date(data.updated_at as string).toISOString() : new Date().toISOString(),
        verified_at: data.verified_at ? new Date(data.verified_at as string).toISOString() : undefined,
    };
};

/**
 * Helper pour valider les données d'un profil producteur
 */
export const validateProducerProfile = (profile: Partial<ProducerProfile>): string[] => {
    const errors: string[] = [];

    if (!profile.business_name?.trim()) errors.push('business_name est requis');
    if (!profile.siret?.trim()) errors.push('siret est requis');
    if (!profile.tva_number?.trim()) errors.push('tva_number est requis');
    if (!profile.iban?.trim()) errors.push('iban est requis');
    if (!profile.address?.street?.trim()) errors.push('adresse (rue) est requise');
    if (!profile.address?.city?.trim()) errors.push('adresse (ville) est requise');
    if (!profile.address?.postal_code?.trim()) errors.push('adresse (code postal) est requis');

    return errors;
};

/**
 * Formatte le type de production pour l'affichage
 */
export const formatProductionType = (type: ProductionType): string => {
    const translations: Record<ProductionType, string> = {
        [ProductionType.ORGANIC]: 'Biologique',
        [ProductionType.BIODYNAMIC]: 'Biodynamique',
        [ProductionType.PERMACULTURE]: 'Permaculture',
        [ProductionType.CONVENTIONAL]: 'Conventionnel',
        [ProductionType.HYDROPONIC]: 'Hydroponique',
        [ProductionType.URBAN]: 'Urbain',
        [ProductionType.FAMILY]: 'Ferme Familiale',
        [ProductionType.COOPERATIVE]: 'Coopérative',
        [ProductionType.SPECIALTY]: 'Spécialité'
    };
    return translations[type] || type;
};

/**
 * Formatte le type de certification pour l'affichage
 */
export const formatCertification = (cert: CertificationType): string => {
    const translations: Record<CertificationType, string> = {
        [CertificationType.AB]: 'Agriculture Biologique',
        [CertificationType.EU_ORGANIC]: 'Bio Européen',
        [CertificationType.DEMETER]: 'Demeter',
        [CertificationType.NATURE_PROGRES]: 'Nature & Progrès',
        [CertificationType.HAUTE_VALEUR_ENVIRONNEMENTALE]: 'Haute Valeur Environnementale',
        [CertificationType.FAIRTRADE]: 'Commerce Équitable',
        [CertificationType.LOCAL]: 'Production Locale',
        [CertificationType.AOP]: 'AOP',
        [CertificationType.AOC]: 'AOC',
        [CertificationType.IGP]: 'IGP',
        [CertificationType.LABEL_ROUGE]: 'Label Rouge'
    };
    return translations[cert] || cert;
};