// src/modules/user-profiles/customer/types/Address.ts

/**
 * Types spécifiques aux adresses pour le module Customer
 * Correspond aux endpoints d'adresses de l'API Customer Profiles
 */

// ============ TYPES DE BASE ============

/**
 * Type d'adresse
 */
export type AddressType = 'BILLING' | 'DELIVERY' | 'BOTH';

/**
 * Adresse client complète
 * Endpoint: GET /api/v1/customer-profiles/customers/addresses/{address_id}
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
    coordinates?: Coordinates;
    instructions?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Coordonnées géographiques
 */
export interface Coordinates {
    latitude: number;
    lat?: number; // Alias pour latitude
    longitude: number;
    lng?: number; // Alias pour longitude
}

/**
 * Adresse simplifiée pour les listes
 */
export interface AddressSummary {
    id: string;
    title: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    type: AddressType;
    isDefault: boolean;
}

// ============ TYPES POUR REQUÊTES API ============

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
    coordinates?: Coordinates;
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
    coordinates?: Coordinates;
    instructions?: string;
}

/**
 * Données pour définir une adresse par défaut
 * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}/set-default
 */
export interface SetDefaultAddressRequest {
    addressId: string;
    type?: AddressType; // Si on veut définir par défaut pour un type spécifique
}

// ============ TYPES POUR RÉPONSES API ============

/**
 * Réponse pour une seule adresse
 */
export interface AddressResponse {
    success: boolean;
    data: Address;
    message?: string;
}

/**
 * Réponse pour une liste d'adresses paginée
 * Endpoint: GET /api/v1/customer-profiles/customers/addresses
 */
export interface AddressListResponse {
    success: boolean;
    data: {
        items: Address[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    message?: string;
}

/**
 * Réponse pour la suppression d'adresse
 */
export interface DeleteAddressResponse {
    success: boolean;
    message: string;
    data: null;
}

// ============ TYPES POUR QUERY PARAMS ============

/**
 * Paramètres de requête pour la liste des adresses
 * Endpoint: GET /api/v1/customer-profiles/customers/addresses
 */
export interface GetAddressesQuery {
    page?: number;
    limit?: number;
    type?: AddressType;
    isDefault?: boolean;
    search?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Paramètres pour filtrer les adresses
 */
export interface AddressFilter {
    type?: AddressType;
    isDefault?: boolean;
    city?: string;
    country?: string;
}

// ============ TYPES POUR FORMULAIRES ============

/**
 * Données du formulaire d'adresse (pour création/édition)
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
    coordinates?: Coordinates;
    instructions?: string;
}

/**
 * Données pour la recherche d'adresse via API
 */
export interface AddressSearchData {
    query: string;
    country?: string;
    limit?: number;
}

// ============ TYPES POUR VALIDATION ============

/**
 * Erreurs de validation pour le formulaire d'adresse
 */
export interface AddressValidationErrors {
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
    instructions?: string;
    type?: string;
}

/**
 * Règles de validation pour les champs d'adresse
 */
export interface AddressValidationRules {
    [key: string]: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        message: string;
    };
}

// ============ TYPES POUR LA GÉOLOCALISATION ============

/**
 * Résultat de géolocalisation
 */
export interface GeocodingResult {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    region?: string;
}

/**
 * Paramètres de géolocalisation
 */
export interface GeocodeParams {
    address: string;
    country?: string;
}

// ============ TYPES POUR LE STORE ============

/**
 * État des adresses dans le store Pinia
 */
export interface AddressState {
    addresses: Address[];
    selectedAddress: Address | null;
    defaultBillingAddress: Address | null;
    defaultDeliveryAddress: Address | null;
    loading: boolean;
    error: string | null;
    filters: AddressFilter;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Actions disponibles pour les adresses
 */
export interface AddressActions {
    loadAddresses(filters?: AddressFilter): Promise<void>;
    getAddressById(id: string): Promise<Address | null>;
    createAddress(data: CreateAddressRequest): Promise<Address>;
    updateAddress(id: string, data: UpdateAddressRequest): Promise<Address>;
    deleteAddress(id: string): Promise<void>;
    setDefaultAddress(id: string, type?: AddressType): Promise<void>;
    searchAddresses(query: string): Promise<Address[]>;
    geocodeAddress(address: string): Promise<GeocodingResult | null>;
    clearAddresses(): void;
    clearError(): void;
}

// ============ CONSTANTES ============

/**
 * Options pour les types d'adresse
 */
export const ADDRESS_TYPES: Array<{ value: AddressType; label: string; description: string }> = [
    { value: 'BILLING', label: 'Facturation', description: 'Adresse pour les factures et paiements' },
    { value: 'DELIVERY', label: 'Livraison', description: 'Adresse pour la réception des commandes' },
    { value: 'BOTH', label: 'Les deux', description: 'Adresse pour facturation et livraison' },
];

/**
 * Pays disponibles avec codes et drapeaux
 */
export const COUNTRIES: Array<{
    code: string;
    name: string;
    flag?: string;
    phoneCode?: string;
    postalCodePattern?: RegExp;
}> = [
        { code: 'CM', name: 'Cameroun', flag: '🇨🇲', phoneCode: '+237' },
        { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
        { code: 'BE', name: 'Belgique', flag: '🇧🇪', phoneCode: '+32' },
        { code: 'CH', name: 'Suisse', flag: '🇨🇭', phoneCode: '+41' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
        { code: 'SN', name: 'Sénégal', flag: '🇸🇳', phoneCode: '+221' },
        { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', phoneCode: '+225' },
    ];

/**
 * Régions du Cameroun
 */
export const CAMEROON_REGIONS: string[] = [
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

/**
 * Villes principales du Cameroun
 */
export const CAMEROON_CITIES: string[] = [
    'Yaoundé',
    'Douala',
    'Garoua',
    'Bamenda',
    'Maroua',
    'Ngaoundéré',
    'Bafoussam',
    'Bertoua',
    'Ebolowa',
    'Kumba',
    'Limbe',
    'Buéa',
    'Dschang',
    'Foumban',
    'Bafang',
];

/**
 * Titres d'adresse disponibles
 */
export const ADDRESS_TITLES: string[] = [
    'Domicile',
    'Bureau',
    'Famille',
    'Autre',
    'Livraison standard',
    'Facturation',
];

// ============ RÈGLES DE VALIDATION ============

/**
 * Règles de validation pour les adresses
 */
export const ADDRESS_VALIDATION_RULES: AddressValidationRules = {
    title: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: 'Le titre doit contenir entre 2 et 50 caractères'
    },
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: 'Le prénom doit contenir entre 2 et 100 caractères'
    },
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: 'Le nom doit contenir entre 2 et 100 caractères'
    },
    street: {
        required: true,
        minLength: 5,
        maxLength: 200,
        message: 'La rue doit contenir entre 5 et 200 caractères'
    },
    city: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: 'La ville doit contenir entre 2 et 100 caractères'
    },
    postalCode: {
        required: true,
        pattern: /^[0-9]{4,10}$/,
        message: 'Le code postal doit contenir entre 4 et 10 chiffres'
    },
    country: {
        required: true,
        message: 'Le pays est requis'
    },
    phone: {
        required: true,
        pattern: /^\+?[0-9\s\-\(\)]{8,20}$/,
        message: 'Numéro de téléphone invalide'
    },
};

// ============ UTILITAIRES ============

/**
 * Type guard pour vérifier si un objet est une adresse
 */
export function isAddress(obj: any): obj is Address {
    return obj &&
        typeof obj === 'object' &&
        'street' in obj &&
        'city' in obj &&
        'postalCode' in obj &&
        'country' in obj;
}

/**
 * Formate une adresse complète pour l'affichage
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
 * Formate une adresse courte (ville + pays)
 */
export function formatShortAddress(address: Address | AddressSummary): string {
    return `${address.city}, ${address.country}`;
}

/**
 * Formate l'adresse pour une ligne
 */
export function formatOneLineAddress(address: Address): string {
    return `${address.street}, ${address.postalCode} ${address.city}`;
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

/**
 * Vérifie si une adresse est valide pour l'expédition
 */
export function isValidForShipping(address: Address): boolean {
    return Boolean(
        address.street &&
        address.city &&
        address.postalCode &&
        address.country &&
        address.phone
    );
}

/**
 * Vérifie si une adresse est valide pour la facturation
 */
export function isValidForBilling(address: Address): boolean {
    return Boolean(
        address.street &&
        address.city &&
        address.postalCode &&
        address.country &&
        address.firstName &&
        address.lastName
    );
}

/**
 * Clone une adresse (utile pour la pré-remplissage des formulaires)
 */
export function cloneAddress(address: Address): Address {
    return {
        ...address,
        id: '', // Reset ID pour création
    };
}

/**
 * Compare deux adresses pour vérifier si elles sont identiques
 */
export function areAddressesEqual(addr1: Address, addr2: Address): boolean {
    const keysToCompare: (keyof Address)[] = [
        'street', 'street2', 'city', 'postalCode', 'country',
        'region', 'firstName', 'lastName', 'company'
    ];

    return keysToCompare.every(key => addr1[key] === addr2[key]);
}

/**
 * Extrait les coordonnées d'une adresse si disponibles
 */
export function extractCoordinates(address: Address): Coordinates | null {
    if (address.coordinates) {
        return address.coordinates;
    }

    // Tentative d'extraction à partir d'autres champs si nécessaire
    return null;
}

/**
 * Valide les données d'adresse selon les règles
 */
export function validateAddressData(data: Partial<AddressFormData>): AddressValidationErrors {
    const errors: AddressValidationErrors = {};

    if (!data.title || data.title.length < 2) {
        errors.title = 'Un titre valide est requis';
    }

    if (!data.firstName || data.firstName.length < 2) {
        errors.firstName = 'Le prénom est requis';
    }

    if (!data.lastName || data.lastName.length < 2) {
        errors.lastName = 'Le nom est requis';
    }

    if (!data.street || data.street.length < 5) {
        errors.street = 'L\'adresse est trop courte';
    }

    if (!data.city || data.city.length < 2) {
        errors.city = 'La ville est requise';
    }

    if (!data.postalCode || !/^[0-9]{4,10}$/.test(data.postalCode)) {
        errors.postalCode = 'Code postal invalide';
    }

    if (!data.country) {
        errors.country = 'Le pays est requis';
    }

    if (!data.phone || !/^\+?[0-9\s\-\(\)]{8,20}$/.test(data.phone)) {
        errors.phone = 'Numéro de téléphone invalide';
    }

    return errors;
}

// Note: Tous les types sont déjà exportés avec leur déclaration
// Pas besoin de ré-export à la fin du fichier
