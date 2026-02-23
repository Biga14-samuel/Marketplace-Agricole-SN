// ============================================
// TYPES DE BASE ET ENUMS PARTAGÉS
// ============================================

/**
 * Types d'utilisateurs de la plateforme
 */
export enum UserType {
    CUSTOMER = 'customer',
    PRODUCER = 'producer',
    ADMIN = 'admin'
}

/**
 * Statuts de vérification des profils
 */
export enum VerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
    UNDER_REVIEW = 'under_review'
}

/**
 * Types de documents pour les producteurs
 */
export enum DocumentType {
    KBIS = 'kbis',
    INSURANCE = 'insurance',
    CERTIFICATION = 'certification',
    IDENTITY = 'identity',
    BANK = 'bank'
}

/**
 * Types d'adresses
 */
export enum AddressType {
    BILLING = 'billing',
    DELIVERY = 'delivery',
    BUSINESS = 'business',
    FARM = 'farm'
}

/**
 * Jours de la semaine
 */
export enum DayOfWeek {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday'
}

/**
 * Types de production agricole
 */
export enum ProductionType {
    ORGANIC = 'organic',
    BIODYNAMIC = 'biodynamic',
    PERMACULTURE = 'permaculture',
    CONVENTIONAL = 'conventional',
    HYDROPONIC = 'hydroponic',
    URBAN = 'urban',
    FAMILY = 'family',
    COOPERATIVE = 'cooperative',
    SPECIALTY = 'specialty'
}

/**
 * Certifications disponibles
 */
export enum CertificationType {
    AB = 'ab', // Agriculture Biologique
    DEMETER = 'demeter',
    NATURE_PROGRES = 'nature_progres',
    HVE = 'hve',
    FAIRTRADE = 'fairtrade',
    LOCAL = 'local'
}

// ============================================
// INTERFACES DE BASE
// ============================================

/**
 * Interface pour les coordonnées géographiques
 */
export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Interface de base pour tous les utilisateurs
 */
export interface BaseUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    userType: UserType;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Préférences utilisateur
 */
export interface UserPreferences {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        marketing: boolean;
    };
    privacy: {
        profileVisible: boolean;
        contactInfoVisible: boolean;
        activityVisible: boolean;
    };
}

/**
 * Statistiques utilisateur
 */
export interface UserStatistics {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteCategories: string[];
    lastOrderDate?: string;
    memberSince: string;
}

/**
 * Adresse d'un client
 */
export interface CustomerAddress {
    id: string;
    userId: string;
    type: AddressType;
    label?: string;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Préférences du client
 */
export interface CustomerPreferences {
    dietaryRestrictions?: string[];
    favoriteCategories?: string[];
    deliveryWindows?: {
        morning: boolean;
        afternoon: boolean;
        evening: boolean;
    };
    packagingPreferences?: {
        noPlastic: boolean;
        reusable: boolean;
        minimal: boolean;
    };
    paymentMethods?: {
        creditCard: boolean;
        debitCard: boolean;
        applePay: boolean;
        googlePay: boolean;
        cash: boolean;
    };
    communicationPreferences?: {
        orderReminders: boolean;
        productRecommendations: boolean;
        seasonalOffers: boolean;
    };
}

/**
 * Profil complet du client
 */
export interface CustomerProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    birthDate?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    preferences: CustomerPreferences;
    statistics: UserStatistics;
    addresses: CustomerAddress[];
    newsletterSubscribed: boolean;
    marketingConsent: boolean;
    verificationStatus: VerificationStatus;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// PROFILS PRODUCTEURS
// ============================================

/**
 * Document légal d'un producteur
 */
export interface ProducerDocument {
    id: string;
    producerId: string;
    type: DocumentType;
    name: string;
    filePath: string;
    fileSize: number; // en octets
    mimeType: string;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
    expirationDate?: Date;
    uploadedAt: Date;
    metadata?: Record<string, any>;
}

/**
 * Horaires d'ouverture d'un producteur
 */
export interface ProducerSchedule {
    id: string;
    producerId: string;
    dayOfWeek: DayOfWeek;
    openTime: string; // Format HH:MM
    closeTime: string; // Format HH:MM
    isClosed: boolean;
    breakStart?: string;
    breakEnd?: string;
    note?: string; // Ex: "Sur rendez-vous uniquement"
}

/**
 * Point de retrait
 */
export interface PickupPoint {
    id: string;
    producerId: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates: Coordinates;
    instructions?: string;
    contactPhone?: string;
    contactEmail?: string;
    isActive: boolean;
    isDefault: boolean;
    capacity?: number; // Nombre maximum de commandes simultanées
    features?: {
        parking: boolean;
        refrigeration: boolean;
        wheelchairAccessible: boolean;
        restrooms: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Créneau de retrait
 */
export interface PickupSlot {
    id: string;
    pickupPointId: string;
    dayOfWeek: DayOfWeek;
    startTime: string; // Format HH:MM
    endTime: string; // Format HH:MM
    date: Date; // Pour les créneaux spécifiques
    isRecurring: boolean; // Si c'est un créneau récurrent
    maxOrders: number;
    currentOrders: number;
    isAvailable: boolean;
    price?: number; // Prix supplémentaire pour ce créneau
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Informations de ferme/exploitation
 */
export interface FarmInfo {
    size: number; // en hectares
    sizeUnit: 'hectares' | 'acres' | 'square_meters';
    productionTypes: ProductionType[];
    certifications: CertificationType[];
    description?: string;
    foundingYear?: number;
    fullTimeEmployees?: number;
    partTimeEmployees?: number;
    cultivationMethods?: string[];
    irrigationSystems?: string[];
    greenhouseArea?: number; // en m²
    openFieldArea?: number; // en hectares
}

/**
 * Informations bancaires (sécurisées)
 */
export interface BankInfo {
    iban: string;
    bic?: string;
    accountHolderName: string;
    bankName?: string;
    isVerified: boolean;
    verifiedAt?: Date;
}

/**
 * Informations légales
 */
export interface LegalInfo {
    siret: string;
    siren?: string;
    tvaNumber?: string;
    legalName: string;
    legalForm?: string; // SARL, SAS, EI, etc.
    registrationCity?: string;
    registrationDate?: Date;
    capital?: number;
    nafCode?: string;
}

/**
 * Profil complet du producteur
 */
export interface ProducerProfile {
    id: string;
    userId: string;
    businessName: string;
    legalName?: string;
    description: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };

    // Informations légales
    legalInfo: LegalInfo;

    // Informations bancaires
    bankInfo: BankInfo;

    // Informations sur la ferme
    farmInfo: FarmInfo;

    // Horaires et points de retrait
    schedules: ProducerSchedule[];
    pickupPoints: PickupPoint[];

    // Documents
    documents: ProducerDocument[];

    // Statut et vérification
    verificationStatus: VerificationStatus;
    isFeatured: boolean;
    isActive: boolean;

    // Statistiques
    statistics: {
        totalProducts: number;
        activeProducts: number;
        totalOrders: number;
        completedOrders: number;
        averageRating?: number;
        totalReviews: number;
        responseRate?: number; // Taux de réponse aux messages
        averageResponseTime?: number; // en heures
    };

    // Métadonnées
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// TYPES DE RÉPONSE API
// ============================================

/**
 * Réponse API standardisée
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: ApiError[];
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
    timestamp: Date;
}

/**
 * Erreur API
 */
export interface ApiError {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, any>;
}

/**
 * Pagination
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// ============================================
// TYPES DE REQUÊTES
// ============================================

/**
 * Requête pour créer/mettre à jour un profil client
 */
export interface CustomerProfileRequest {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
    birthDate?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    preferences?: Partial<CustomerPreferences>;
    newsletterSubscribed?: boolean;
    marketingConsent?: boolean;
}

/**
 * Requête pour créer/mettre à jour une adresse
 */
export interface AddressRequest {
    type: AddressType;
    label?: string;
    street: string;
    streetComplement?: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: Coordinates;
    isDefault?: boolean;
    instructions?: string;
}

/**
 * Requête pour créer/mettre à jour un profil producteur
 */
export interface ProducerProfileRequest {
    businessName?: string;
    description?: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    legalInfo?: Partial<LegalInfo>;
    bankInfo?: Partial<BankInfo>;
    farmInfo?: Partial<FarmInfo>;
}

/**
 * Requête pour créer/mettre à jour un document
 */
export interface DocumentRequest {
    type: DocumentType;
    file: File;
    name?: string;
    expirationDate?: Date;
}

/**
 * Requête pour créer/mettre à jour un point de retrait
 */
export interface PickupPointRequest {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates: Coordinates;
    instructions?: string;
    contactPhone?: string;
    contactEmail?: string;
    isActive?: boolean;
    isDefault?: boolean;
    capacity?: number;
    features?: {
        parking?: boolean;
        refrigeration?: boolean;
        wheelchairAccessible?: boolean;
        restrooms?: boolean;
    };
}

/**
 * Requête pour créer/mettre à jour un créneau de retrait
 */
export interface PickupSlotRequest {
    pickupPointId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    date?: Date;
    isRecurring?: boolean;
    maxOrders: number;
    price?: number;
    note?: string;
}

/**
 * Requête pour créer/mettre à jour un horaire
 */
export interface ScheduleRequest {
    dayOfWeek: DayOfWeek;
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
    breakStart?: string;
    breakEnd?: string;
    note?: string;
}

// ============================================
// TYPES D'ÉVÉNEMENTS
// ============================================

/**
 * Événements liés aux profils utilisateurs
 */
export interface UserProfileEvent {
    type: 'profile_updated' | 'address_added' | 'address_updated' | 'address_deleted' |
    'document_uploaded' | 'document_verified' | 'pickup_point_updated' |
    'schedule_updated' | 'verification_status_changed';
    userId: string;
    userType: UserType;
    data: Record<string, any>;
    timestamp: Date;
}

// ============================================
// TYPES DE FILTRES
// ============================================

/**
 * Filtres pour la recherche de producteurs
 */
export interface ProducerFilters {
    search?: string;
    productionTypes?: ProductionType[];
    certifications?: CertificationType[];
    verifiedOnly?: boolean;
    featuredOnly?: boolean;
    hasDelivery?: boolean;
    hasPickup?: boolean;
    minRating?: number;
    distance?: {
        coordinates: Coordinates;
        radius: number; // en kilomètres
    };
    sortBy?: 'distance' | 'rating' | 'name' | 'newest';
}

// ============================================
// UTILITAIRES ET TYPES D'AIDE
// ============================================

/**
 * Type pour les coordonnées avec validation
 */
export type ValidCoordinates = {
    lat: number; // -90 à 90
    lng: number; // -180 à 180
    accuracy?: number;
};

/**
 * Type pour les URLs d'images
 */
export type ImageURL = string & { readonly _brand: 'ImageURL' };

/**
 * Type pour les emails validés
 */
export type ValidEmail = string & { readonly _brand: 'ValidEmail' };

/**
 * Type pour les numéros de téléphone validés
 */
export type ValidPhone = string & { readonly _brand: 'ValidPhone' };

/**
 * Type pour les IBAN validés
 */
export type ValidIBAN = string & { readonly _brand: 'ValidIBAN' };

/**
 * Type pour les SIRET validés
 */
export type ValidSIRET = string & { readonly _brand: 'ValidSIRET' };

/**
 * Vérifie si un objet est de type CustomerProfile
 */
export function isCustomerProfile(obj: unknown): obj is CustomerProfile {
    return obj !== null && typeof obj === 'object' && obj && 'userType' in obj && (obj as any).userType === UserType.CUSTOMER;
}

/**
 * Vérifie si un objet est de type ProducerProfile
 */
export function isProducerProfile(obj: unknown): obj is ProducerProfile {
    return obj !== null && typeof obj === 'object' && obj && 'userType' in obj && (obj as any).userType === UserType.PRODUCER;
}

/**
 * Calcule l'âge à partir de la date de naissance
 */
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

/**
 * Formate une adresse complète
 */
export function formatAddress(address: CustomerAddress): string {
    const parts = [
        address.street,
        `${address.postalCode} ${address.city}`,
        address.country
    ].filter(Boolean);

    return parts.join(', ');
}

/**
 * Vérifie si un producteur est ouvert à un moment donné
 */
export function isProducerOpen(
    schedules: ProducerSchedule[],
    date: Date = new Date()
): boolean {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const schedule = schedules.find(s => s.dayOfWeek === dayOfWeek);

    if (!schedule || schedule.isClosed) {
        return false;
    }

    const now = date.toLocaleTimeString('fr-FR', { hour12: false });
    return now >= schedule.openTime && now <= schedule.closeTime;
}

/**
 * Obtient les créneaux disponibles pour un point de retrait
 */
export function getAvailableSlots(
    slots: PickupSlot[],
    date: Date = new Date()
): PickupSlot[] {
    return slots.filter(slot => {
        const slotDate = slot.isRecurring
            ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
            : new Date(slot.date);

        return (
            slot.isAvailable &&
            slot.currentOrders < slot.maxOrders &&
            slotDate >= date &&
            (!slot.isRecurring || slot.dayOfWeek === date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())
        );
    });
}

// ============================================
// EXPORTS
// ============================================

// All types, interfaces, and enums are already exported inline above

/**
 * Type guard pour vérifier si un objet est une réponse API valide
 */
export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
    return obj !== null && typeof obj === 'object' && obj && 'success' in obj && typeof (obj as any).success === 'boolean' && 'timestamp' in obj && (obj as any).timestamp instanceof Date;
}

/**
 * Type guard pour vérifier si un objet est une réponse paginée
 */
export function isPaginatedResponse<T>(obj: unknown): obj is PaginatedResponse<T> {
    return obj !== null && typeof obj === 'object' && obj && 'items' in obj && Array.isArray((obj as any).items) && 'pagination' in obj && (obj as any).pagination && typeof (obj as any).pagination.total === 'number';
}

/**
 * Crée une réponse API standardisée
 */
export function createApiResponse<T>(
    success: boolean,
    data?: T,
    message?: string,
    errors?: ApiError[],
    meta?: Record<string, unknown>
): ApiResponse<T> {
    return {
        success,
        data,
        message,
        errors,
        meta,
        timestamp: new Date()
    };
}

/**
 * Crée une erreur API standardisée
 */
export function createApiError(
    code: string,
    message: string,
    field?: string,
    details?: Record<string, any>
): ApiError {
    return {
        code,
        message,
        field,
        details
    };
}

// ============================================
// CONSTANTES
// ============================================

/**
 * Configuration par défaut pour les profils
 */
export const DEFAULT_PROFILE_CONFIG = {
    customer: {
        preferences: {
            dietaryRestrictions: [],
            favoriteCategories: [],
            deliveryWindows: {
                morning: true,
                afternoon: true,
                evening: false
            },
            packagingPreferences: {
                noPlastic: true,
                reusable: false,
                minimal: false
            }
        }
    },
    producer: {
        farmInfo: {
            sizeUnit: 'hectares' as const,
            productionTypes: [],
            certifications: []
        }
    }
};

/**
 * Limites de l'application
 */
export const APP_LIMITS = {
    MAX_ADDRESSES_PER_USER: 10,
    MAX_PICKUP_POINTS_PER_PRODUCER: 5,
    MAX_DOCUMENTS_PER_PRODUCER: 20,
    MAX_SCHEDULE_DAYS: 7,
    MAX_PICKUP_SLOTS_PER_POINT: 100
};

/**
 * Formats de fichiers autorisés pour les documents
 */
export const ALLOWED_DOCUMENT_TYPES = {
    [DocumentType.KBIS]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentType.INSURANCE]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentType.CERTIFICATION]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentType.IDENTITY]: ['image/jpeg', 'image/png'],
    [DocumentType.BANK]: ['application/pdf', 'image/jpeg', 'image/png']
};

/**
 * Tailles de fichiers maximales (en octets)
 */
export const MAX_FILE_SIZES = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    PDF: 10 * 1024 * 1024, // 10MB
    DOCUMENT: 15 * 1024 * 1024 // 15MB
};

/**
 * Pays supportés
 */
export const SUPPORTED_COUNTRIES = [
    'FR', // France
    'BE', // Belgique
    'CH', // Suisse
    'LU', // Luxembourg
    'DE', // Allemagne
    'ES', // Espagne
    'IT', // Italie
    'PT'  // Portugal
] as const;

export type SupportedCountry = typeof SUPPORTED_COUNTRIES[number];

/**
 * Langues supportées
 */
export const SUPPORTED_LANGUAGES = [
    'fr', // Français
    'en', // Anglais
    'de', // Allemand
    'es', // Espagnol
    'it', // Italien
    'pt'  // Portugais
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Devises supportées
 */
export const SUPPORTED_CURRENCIES = [
    'EUR', // Euro
    'CHF', // Franc suisse
    'GBP'  // Livre sterling
] as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];
