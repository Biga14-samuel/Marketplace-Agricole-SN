// src/modules/user-profiles/customer/services/index.ts

/**
 * Fichier d'exportation central des services pour le module Customer
 * Ce fichier permet d'importer tous les services depuis un seul point d'entrée
 */

// ============ EXPORT DES SERVICES ============

// Services principaux
export { CustomerProfileService } from "./CustomerProfileService";
export { CustomerAddressService } from "./CustomerAddressService";

// ============ EXPORT DES TYPES DE SERVICES ============

// Note: Les types de services sont exportés directement depuis les fichiers sources
// Utilisez les imports nommés depuis CustomerProfileService et CustomerAddressService

// ============ CONSTANTES DES SERVICES ============

// Ré-export des constantes
export * from "./CustomerProfileService";

// ============ FONCTIONS FABRIQUE ============

// Import pour les fonctions fabrique
import { CustomerProfileService } from "./CustomerProfileService";
import { CustomerAddressService } from "./CustomerAddressService";

/**
 * Créer une instance du service CustomerProfile avec des options personnalisées
 */
export function createCustomerProfileService(options?: {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}) {
    return CustomerProfileService;
}

/**
 * Créer une instance du service CustomerAddress avec des options personnalisées
 */
export function createCustomerAddressService(options?: {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}) {
    return CustomerAddressService;
}

// ============ SERVICE COMBINÉ ============

// ============ CONSTANTES DES SERVICES ============

// Note: Les services sont exportés via export * from
// Utilisez les imports nommés depuis les fichiers sources

// ============ TYPES POUR LE SERVICE COMBINÉ ============

export interface CompleteCustomerData {
    profile: any;
    addresses: any[];
    stats?: {
        addressCount: number;
        hasBilling: boolean;
        hasDelivery: boolean;
        defaultAddresses: number;
    };
}

export interface CreateProfileWithAddressRequest {
    profile: any;
    address: any;
}

export interface SyncCustomerDataRequest {
    profile?: any;
    addresses?: any[];
}
