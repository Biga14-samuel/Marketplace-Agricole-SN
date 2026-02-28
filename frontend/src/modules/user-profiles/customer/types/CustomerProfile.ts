// src/modules/user-profiles/customer/types/CustomerProfile.ts

/**
 * Types pour le module Customer Profile
 * Correspond aux endpoints de l'API Customer Profiles
 */

// ============ TYPES DE BASE ============

/**
 * Profil client de base
 * Correspond à l'endpoint: GET /api/v1/customer-profiles/customers/profile
 */
export interface CustomerProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    coverImage?: string;
    birthDate?: string;
    preferences: CustomerPreferences;
    createdAt: string;
    updatedAt: string;
}

/**
 * Profil client complet avec adresses
 * Correspond à l'endpoint: GET /api/v1/customer-profiles/customers/profile/complete
 */
export interface CompleteCustomerProfile extends CustomerProfile {
    addresses: Address[];
    deliveryAddress?: Address;
    billingAddress?: Address;
}

/**
 * Type d'adresse
 */
export type AddressType = 'BILLING' | 'DELIVERY' | 'BOTH';

/**
 * Adresse client
 * Correspond aux endpoints /api/v1/customer-profiles/customers/addresses
 */
export interface Address {
    id: string;
    userId: string;
    type: AddressType;
    title: string;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    postalCode: string;
    country: string;
    region?: string;
    phone: string;
    isDefault: boolean;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    instructions?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Préférences client
 */
export interface CustomerPreferences {
    newsletterSubscription: boolean;
    marketingEmails: boolean;
    smsNotifications: boolean;
    preferredDeliveryTime?: 'MORNING' | 'AFTERNOON' | 'EVENING';
    preferredCommunicationMethod?: 'EMAIL' | 'SMS' | 'WHATSAPP';
    allergies?: string[];
    dietaryRestrictions?: string[];
    language: 'fr' | 'en';
}

// ============ TYPES POUR REQUÊTES ============

/**
 * Données pour créer un profil client
 * Endpoint: POST /api/v1/customer-profiles/customers/profile
 */
export interface CreateCustomerProfileRequest {
    firstName: string;
    lastName: string;
    phone: string;
    birthDate?: string;
    avatar?: string;
    preferences?: Partial<CustomerPreferences>;
}

/**
 * Données pour mettre à jour un profil client
 * Endpoint: PUT /api/v1/customer-profiles/customers/profile
 */
export interface UpdateCustomerProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    birthDate?: string;
    avatar?: string;
    preferences?: Partial<CustomerPreferences>;
}

/**
 * Données pour créer une adresse
 * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}
 */
export interface CreateAddressRequest {
    type: AddressType;
    title: string;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    postalCode: string;
    country: string;
    region?: string;
    phone: string;
    isDefault?: boolean;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    instructions?: string;
}

/**
 * Données pour mettre à jour une adresse
 * Endpoint: PUT /api/v1/customer-profiles/customers/addresses/{address_id}
 */
export interface UpdateAddressRequest {
    type?: AddressType;
    title?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    street?: string;
    street2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    region?: string;
    phone?: string;
    isDefault?: boolean;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    instructions?: string;
}

/**
 * Données pour définir une adresse par défaut
 * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}/set-default
 */
export interface SetDefaultAddressRequest {
    addressId: string;
}

// ============ TYPES POUR RÉPONSES API ============

/**
 * Réponse API standard pour les opérations sur les profils
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: ApiError[];
}

/**
 * Réponse pour les listes paginées
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Erreur API
 */
export interface ApiError {
    code: string;
    message: string;
    field?: string;
}

// ============ TYPES POUR REQUÊTES AVEC QUERY PARAMS ============

/**
 * Paramètres de requête pour la liste des adresses
 * Endpoint: GET /api/v1/customer-profiles/customers/addresses
 */
export interface GetAddressesQuery {
    page?: number;
    limit?: number;
    type?: AddressType;
    isDefault?: boolean;
}

/**
 * Paramètres de requête pour les adresses par défaut
 */
export interface GetDefaultAddressQuery {
    type?: AddressType;
}

// ============ TYPES POUR LE STORE PINIA ============

/**
 * État du store Pinia pour le profil client
 */
export interface CustomerProfileState {
    profile: CustomerProfile | null;
    completeProfile: CompleteCustomerProfile | null;
    addresses: Address[];
    loading: boolean;
    error: string | null;
    selectedAddress: Address | null;
}

// ============ TYPES POUR FORMULAIRES ============

/**
 * Données du formulaire de profil
 */
export interface CustomerProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate?: string;
    avatar?: File | string;
    preferences: {
        newsletterSubscription: boolean;
        marketingEmails: boolean;
        smsNotifications: boolean;
        preferredDeliveryTime?: 'MORNING' | 'AFTERNOON' | 'EVENING';
        language: 'fr' | 'en';
    };
}

/**
 * Données du formulaire d'adresse
 */
export interface AddressFormData {
    type: AddressType;
    title: string;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    postalCode: string;
    country: string;
    region?: string;
    phone: string;
    isDefault: boolean;
    instructions?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

// ============ TYPES POUR VALIDATION ============

/**
 * Erreurs de validation pour le profil
 */
export interface CustomerProfileValidationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
}

/**
 * Erreurs de validation pour l'adresse
 */
export interface AddressValidationErrors {
    type?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
}

// ============ CONSTANTES ============

/**
 * Options pour les types d'adresse
 */
export const ADDRESS_TYPES: Array<{ value: AddressType; label: string }> = [
    { value: 'BILLING', label: 'Adresse de facturation' },
    { value: 'DELIVERY', label: 'Adresse de livraison' },
    { value: 'BOTH', label: 'Adresse de facturation et livraison' },
];

/**
 * Options pour les créneaux de livraison
 */
export const DELIVERY_TIME_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'MORNING', label: 'Matin (8h-12h)' },
    { value: 'AFTERNOON', label: 'Après-midi (12h-18h)' },
    { value: 'EVENING', label: 'Soir (18h-22h)' },
];

/**
 * Options de langue
 */
export const LANGUAGE_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
];

/**
 * Pays disponibles
 */
export const COUNTRIES: Array<{ code: string; name: string }> = [
    { code: 'CM', name: 'Cameroun' },
    { code: 'TD', name: 'Tchad' },
    { code: 'GA', name: 'Gabon' },
    { code: 'CG', name: 'Congo' },
    { code: 'SN', name: 'Sénégal' },
    { code: 'CI', name: "Côte d'Ivoire" },
];

/**
 * Régions du Cameroun
 */
export const CAMEROON_REGIONS = [
    'Adamaoua',
    'Centre',
    'Est',
    'Extrême-Nord',
    'Littoral',
    'Nord',
    'Nord-Ouest',
    'Ouest',
    'Sud',
    'Sud-Ouest',
];

// ============ UTILITAIRES ============

/**
 * Type guard pour vérifier si un objet est une adresse
 */
export function isAddress(obj: any): obj is Address {
    return obj && typeof obj === 'object' && 'street' in obj && 'city' in obj && 'postalCode' in obj;
}

/**
 * Type guard pour vérifier si un objet est un profil client
 */
export function isCustomerProfile(obj: any): obj is CustomerProfile {
    return obj && typeof obj === 'object' && 'firstName' in obj && 'lastName' in obj && 'email' in obj;
}

/**
 * Vérifie si le profil est complet
 */
export function isCompleteProfile(profile: CustomerProfile | CompleteCustomerProfile): profile is CompleteCustomerProfile {
    return 'addresses' in profile;
}

/**
 * Formate le nom complet du client
 */
export function formatCustomerName(profile: CustomerProfile): string {
    return `${profile.firstName} ${profile.lastName}`.trim();
}

/**
 * Formate l'adresse complète
 */
export function formatFullAddress(address: Address): string {
    const parts = [
        address.street,
        address.street2,
        `${address.postalCode} ${address.city}`,
        address.region,
        address.country,
    ].filter(Boolean);

    return parts.join(', ');
}

/**
 * Extrait l'adresse par défaut d'un type spécifique
 */
export function getDefaultAddressByType(
    addresses: Address[],
    type: AddressType
): Address | undefined {
    return addresses.find(addr => addr.isDefault && addr.type === type);
}

// Note: Tous les types sont déjà exportés avec leur déclaration
// Pas besoin de ré-export à la fin du fichier
