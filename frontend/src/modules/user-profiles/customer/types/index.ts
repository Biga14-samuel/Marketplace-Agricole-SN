// src/modules/user-profiles/customer/types/index.ts

/**
 * Fichier d'exportation central des types pour le module Customer
 * Ce fichier permet d'importer tous les types depuis un seul point d'entrée
 */

// ============ REEXPORTS DEPUIS CUSTOMERPROFILE.TS ============

// Types de base
export type { CustomerProfile } from './CustomerProfile';
export type { CompleteCustomerProfile } from './CustomerProfile';
export type { CustomerPreferences } from './CustomerProfile';

// Types pour requêtes API
export type { CreateCustomerProfileRequest } from './CustomerProfile';
export type { UpdateCustomerProfileRequest } from './CustomerProfile';

// Types pour réponses API
export type { ApiResponse } from './CustomerProfile';
export type { PaginatedResponse } from './CustomerProfile';
export type { ApiError } from './CustomerProfile';

// Types pour query params
export type { GetAddressesQuery } from './CustomerProfile';
export type { GetDefaultAddressQuery } from './CustomerProfile';

// Types pour le store Pinia
export type { CustomerProfileState } from './CustomerProfile';

// Types pour formulaires
export type { CustomerProfileFormData } from './CustomerProfile';
export type { AddressFormData } from './CustomerProfile';

// Types pour validation
export type { CustomerProfileValidationErrors } from './CustomerProfile';
export type { AddressValidationErrors } from './CustomerProfile';

// Constantes
export {
    DELIVERY_TIME_OPTIONS,
    LANGUAGE_OPTIONS
} from './CustomerProfile';

// Utilitaires
export {
    isCustomerProfile,
    isCompleteProfile,
    formatCustomerName
} from './CustomerProfile';

// ============ REEXPORTS DEPUIS ADDRESS.TS ============

// Types de base
export type { Address } from './Address';
export type { AddressType } from './Address';
export type { Coordinates } from './Address';
export type { AddressSummary } from './Address';

// Types pour requêtes API
export type { CreateAddressRequest } from './Address';
export type { UpdateAddressRequest } from './Address';
export type { SetDefaultAddressRequest } from './Address';

// Types pour réponses API
export type { AddressResponse } from './Address';
export type { AddressListResponse } from './Address';
export type { DeleteAddressResponse } from './Address';

// Types pour query params
export type { GetAddressesQuery as AddressQueryParams } from './Address';
export type { AddressFilter } from './Address';

// Types pour géolocalisation
export type { GeocodingResult } from './Address';
export type { GeocodeParams } from './Address';

// Types pour store
export type { AddressState } from './Address';
export type { AddressActions } from './Address';

// Constantes
export {
    ADDRESS_TYPES,
    COUNTRIES,
    CAMEROON_REGIONS,
    CAMEROON_CITIES,
    ADDRESS_TITLES,
    ADDRESS_VALIDATION_RULES
} from './Address';

// Utilitaires
export {
    isAddress,
    formatFullAddress,
    formatShortAddress,
    formatOneLineAddress,
    getDefaultAddressByType,
    isValidForShipping,
    isValidForBilling,
    cloneAddress,
    areAddressesEqual,
    validateAddressData
} from './Address';

// ============ TYPES GLOBAUX ET UTILITAIRES ============

/**
 * Type pour les réponses d'erreur API
 */
export interface ErrorResponse {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

/**
 * Type pour les options de sélection
 */
export interface SelectOption<T = string> {
    value: T;
    label: string;
    disabled?: boolean;
    icon?: string;
}

/**
 * Type pour les états de chargement
 */
export interface LoadingState {
    isLoading: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
}

/**
 * Type pour les formulaires avec état
 */
export interface FormState<T> {
    data: T;
    errors: Record<string, string>;
    isDirty: boolean;
    isValid: boolean;
    isSubmitting: boolean;
}

/**
 * Crée un état de formulaire initial
 */
export function createInitialFormState<T>(initialData: T): FormState<T> {
    return {
        data: initialData,
        errors: {},
        isDirty: false,
        isValid: false,
        isSubmitting: false,
    };
}

/**
 * Vérifie si un objet a une propriété
 */
export function hasProperty<T extends object, K extends string>(
    obj: T,
    key: K
): obj is T & Record<K, unknown> {
    return key in obj;
}

/**
 * Crée un objet de requête URL à partir d'un objet
 */
export function createQueryParams(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(item => searchParams.append(key, String(item)));
            } else if (typeof value === 'boolean') {
                searchParams.append(key, value ? 'true' : 'false');
            } else {
                searchParams.append(key, String(value));
            }
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Transforme une date en format ISO sans le timezone
 */
export function toLocalISOString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Formate un numéro de téléphone camerounais
 */
export function formatCameroonPhoneNumber(phone: string): string {
    // Nettoyer le numéro
    let cleaned = phone.replace(/\D/g, '');

    // Si le numéro commence par 237, le formater
    if (cleaned.startsWith('237')) {
        cleaned = cleaned.slice(3);
    }

    // Ajouter le préfixe +237 si nécessaire
    if (!cleaned.startsWith('+237') && !cleaned.startsWith('237')) {
        cleaned = `237${cleaned}`;
    }

    // Formater selon le modèle
    if (cleaned.length === 12) { // +237XXXXXXXXX
        return `+${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 12)}`;
    } else if (cleaned.length === 9) { // XXXXXXXX (sans indicatif)
        return `+237 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)}`;
    }

    // Retourner tel quel si le format n'est pas reconnu
    return phone;
}

/**
 * Vérifie si un numéro de téléphone est valide pour le Cameroun
 */
export function isValidCameroonPhoneNumber(phone: string): boolean {
    const regex = /^(?:\+237|237)?[2-8][0-9]{8}$/;
    const cleaned = phone.replace(/\D/g, '');
    return regex.test(cleaned);
}

// ============ EXPORTS PAR DÉFAUT ============

/**
 * Export par défaut combinant les types principaux
 * Note: Les types ne peuvent pas être exportés comme valeurs
 * Utilisez les imports nommés à la place
 */
import {
    DELIVERY_TIME_OPTIONS,
    LANGUAGE_OPTIONS,
    formatCustomerName,
} from './CustomerProfile';

import {
    ADDRESS_TYPES,
    COUNTRIES,
    formatFullAddress,
    validateAddressData
} from './Address';

export default {
    // Constantes
    ADDRESS_TYPES: ADDRESS_TYPES,
    COUNTRIES: COUNTRIES,
    DELIVERY_TIME_OPTIONS: DELIVERY_TIME_OPTIONS,
    LANGUAGE_OPTIONS: LANGUAGE_OPTIONS,

    // Utilitaires
    formatFullAddress: formatFullAddress,
    formatCustomerName: formatCustomerName,
    validateAddressData: validateAddressData,
};

// ============ ALIAS D'EXPORT ============

/**
 * Alias pour les types couramment utilisés
 */

// Import des types pour les alias
import type {
    CustomerProfile,
    CompleteCustomerProfile,
    UpdateCustomerProfileRequest,
    AddressFormData,
    ApiResponse,
    PaginatedResponse
} from './CustomerProfile';

import type {
    CreateAddressRequest,
    UpdateAddressRequest,
} from './Address';

// Pour le profil client
export type Profile = CustomerProfile;
export type CompleteProfile = CompleteCustomerProfile;
export type UpdateProfileRequest = UpdateCustomerProfileRequest;

// Pour les adresses
export type AddressData = AddressFormData;
export type NewAddressRequest = CreateAddressRequest;
export type EditAddressRequest = UpdateAddressRequest;

// Pour les réponses API
export type Response<T> = ApiResponse<T>;
export type Paginated<T> = PaginatedResponse<T>;