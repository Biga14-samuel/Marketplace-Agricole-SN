import { getErrorMessage } from '@/shared/utils/error-handler';
// src/modules/user-profiles/customer/services/CustomerProfileService.ts

import type {
    CustomerProfile,
    CompleteCustomerProfile,
    CreateCustomerProfileRequest,
    UpdateCustomerProfileRequest,
    Address,
    CreateAddressRequest,
    UpdateAddressRequest,
    SetDefaultAddressRequest,
    GetAddressesQuery,
    AddressResponse,
    AddressListResponse,
    ApiResponse,
    PaginatedResponse,
    CustomerProfileFormData,
    AddressFormData
} from '../types';
import { apiClient } from '@/shared/services/api';
import type { AxiosResponse, AxiosError } from 'axios';

/**
 * Service pour gérer les opérations liées au profil client
 * Ce service couvre tous les endpoints du module Customer Profiles
 */
export class CustomerProfileService {
    private static readonly BASE_URL = '/customer-profiles/customers';
    private static readonly ADDRESS_BASE_URL = `${CustomerProfileService.BASE_URL}/addresses`;

    // ============ PROFIL CLIENT ============

    /**
     * Obtenir le profil client de l'utilisateur connecté
     * Endpoint: GET /api/v1/customer-profiles/customers/profile
     */
    static async getProfile(): Promise<CustomerProfile> {
        try {
            const response: AxiosResponse<ApiResponse<CustomerProfile>> = await apiClient.get(
                `${this.BASE_URL}/profile`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la récupération du profil');
            }

            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtenir le profil complet avec adresses
     * Endpoint: GET /api/v1/customer-profiles/customers/profile/complete
     */
    static async getCompleteProfile(): Promise<CompleteCustomerProfile> {
        try {
            const response: AxiosResponse<ApiResponse<CompleteCustomerProfile>> = await apiClient.get(
                `${this.BASE_URL}/profile/complete`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la récupération du profil complet');
            }

            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du profil complet:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Créer un profil client
     * Endpoint: POST /api/v1/customer-profiles/customers/profile
     */
    static async createProfile(data: CreateCustomerProfileRequest): Promise<CustomerProfile> {
        try {
            const response: AxiosResponse<ApiResponse<CustomerProfile>> = await apiClient.post(
                `${this.BASE_URL}/profile`,
                data
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la création du profil');
            }

            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la création du profil:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Mettre à jour le profil client
     * Endpoint: PUT /api/v1/customer-profiles/customers/profile
     */
    static async updateProfile(data: UpdateCustomerProfileRequest): Promise<CustomerProfile> {
        try {
            const response: AxiosResponse<ApiResponse<CustomerProfile>> = await apiClient.put(
                `${this.BASE_URL}/profile`,
                data
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la mise à jour du profil');
            }

            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Supprimer le profil client
     * Endpoint: DELETE /api/v1/customer-profiles/customers/profile
     */
    static async deleteProfile(): Promise<void> {
        try {
            const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(
                `${this.BASE_URL}/profile`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la suppression du profil');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du profil:', error);
            throw this.handleError(error);
        }
    }

    // ============ GESTION DES ADRESSES ============

    /**
     * Obtenir toutes les adresses du client
     * Endpoint: GET /api/v1/customer-profiles/customers/addresses
     */
    static async getAddresses(query?: GetAddressesQuery): Promise<PaginatedResponse<Address>> {
        try {
            const response: AxiosResponse<ApiResponse<PaginatedResponse<Address>>> = await apiClient.get(
                this.ADDRESS_BASE_URL,
                { params: query }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la récupération des adresses');
            }

            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des adresses:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtenir une adresse spécifique
     * Endpoint: GET /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    static async getAddress(addressId: string): Promise<Address> {
        try {
            const response: AxiosResponse<ApiResponse<Address>> = await apiClient.get(
                `${this.ADDRESS_BASE_URL}/${addressId}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la récupération de l'adresse ${addressId}`);
            }

            return response.data.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'adresse ${addressId}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Ajouter une nouvelle adresse
     * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    static async addAddress(data: CreateAddressRequest): Promise<Address> {
        try {
            const response: AxiosResponse<AddressResponse> = await apiClient.post(
                this.ADDRESS_BASE_URL,
                data
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de l\'ajout de l\'adresse');
            }

            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'adresse:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Mettre à jour une adresse existante
     * Endpoint: PUT /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    static async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<Address> {
        try {
            const response: AxiosResponse<AddressResponse> = await apiClient.put(
                `${this.ADDRESS_BASE_URL}/${addressId}`,
                data
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la mise à jour de l'adresse ${addressId}`);
            }

            return response.data.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'adresse ${addressId}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Supprimer une adresse
     * Endpoint: DELETE /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    static async deleteAddress(addressId: string): Promise<void> {
        try {
            const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(
                `${this.ADDRESS_BASE_URL}/${addressId}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la suppression de l'adresse ${addressId}`);
            }
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'adresse ${addressId}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Définir une adresse par défaut
     * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}/set-default
     */
    static async setDefaultAddress(addressId: string, data?: SetDefaultAddressRequest): Promise<void> {
        try {
            const requestData = data || { addressId };
            const response: AxiosResponse<ApiResponse<void>> = await apiClient.post(
                `${this.ADDRESS_BASE_URL}/${addressId}/set-default`,
                requestData
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la définition de l'adresse ${addressId} par défaut`);
            }
        } catch (error) {
            console.error(`Erreur lors de la définition de l'adresse ${addressId} par défaut:`, error);
            throw this.handleError(error);
        }
    }

    // ============ MÉTHODES UTILITAIRES POUR FORMULAIRES ============

    /**
     * Préparer les données du formulaire de profil pour l'API
     */
    static prepareProfileFormData(formData: CustomerProfileFormData): UpdateCustomerProfileRequest {
        return {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            birthDate: formData.birthDate,
            avatar: typeof formData.avatar === 'string' ? formData.avatar : undefined,
            preferences: {
                newsletterSubscription: formData.preferences.newsletterSubscription,
                marketingEmails: formData.preferences.marketingEmails,
                smsNotifications: formData.preferences.smsNotifications,
                preferredDeliveryTime: formData.preferences.preferredDeliveryTime,
                language: formData.preferences.language
            }
        };
    }

    /**
     * Préparer les données du formulaire d'adresse pour l'API
     */
    static prepareAddressFormData(formData: AddressFormData): CreateAddressRequest {
        return {
            type: formData.type,
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            company: formData.company,
            street: formData.street,
            street2: formData.street2,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            region: formData.region,
            phone: formData.phone,
            isDefault: formData.isDefault,
            instructions: formData.instructions
        };
    }

    /**
     * Mettre à jour le formulaire d'adresse pour l'API
     */
    static prepareAddressUpdateFormData(formData: AddressFormData): UpdateAddressRequest {
        return {
            type: formData.type,
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            company: formData.company,
            street: formData.street,
            street2: formData.street2,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            region: formData.region,
            phone: formData.phone,
            isDefault: formData.isDefault,
            instructions: formData.instructions
        };
    }

    /**
     * Télécharger un avatar
     */
    static async uploadAvatar(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response: AxiosResponse<ApiResponse<{ url: string }>> = await apiClient.post(
                `${this.BASE_URL}/profile/avatar`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec du téléchargement de l\'avatar');
            }

            return response.data.data.url;
        } catch (error) {
            console.error('Erreur lors du téléchargement de l\'avatar:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Supprimer l'avatar
     */
    static async deleteAvatar(): Promise<void> {
        try {
            const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(
                `${this.BASE_URL}/profile/avatar`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la suppression de l\'avatar');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'avatar:', error);
            throw this.handleError(error);
        }
    }

    // ============ MÉTHODES DE VALIDATION ============

    /**
     * Valider les données du formulaire de profil
     */
    static validateProfileFormData(data: CustomerProfileFormData): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
        }

        if (!data.lastName || data.lastName.trim().length < 2) {
            errors.lastName = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.email = 'Adresse email invalide';
        }

        if (!data.phone || !this.isValidPhoneNumber(data.phone)) {
            errors.phone = 'Numéro de téléphone invalide';
        }

        if (data.birthDate) {
            const birthDate = new Date(data.birthDate);
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
            const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

            if (birthDate < minDate || birthDate > maxDate) {
                errors.birthDate = 'Date de naissance invalide';
            }
        }

        return errors;
    }

    /**
     * Valider les données du formulaire d'adresse
     */
    static validateAddressFormData(data: AddressFormData): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!data.title || data.title.trim().length < 2) {
            errors.title = 'Le titre doit contenir au moins 2 caractères';
        }

        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
        }

        if (!data.lastName || data.lastName.trim().length < 2) {
            errors.lastName = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!data.street || data.street.trim().length < 5) {
            errors.street = 'L\'adresse doit contenir au moins 5 caractères';
        }

        if (!data.city || data.city.trim().length < 2) {
            errors.city = 'La ville doit contenir au moins 2 caractères';
        }

        if (!data.postalCode || !/^[0-9]{4,10}$/.test(data.postalCode)) {
            errors.postalCode = 'Code postal invalide';
        }

        if (!data.country || data.country.trim().length < 2) {
            errors.country = 'Le pays est requis';
        }

        if (!data.phone || !this.isValidPhoneNumber(data.phone)) {
            errors.phone = 'Numéro de téléphone invalide';
        }

        return errors;
    }

    /**
     * Vérifier si une adresse email est valide
     */
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Vérifier si un numéro de téléphone est valide
     */
    private static isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // ============ GESTION DES ERREURS ============

    /**
     * Gérer les erreurs de l'API
     */
    private static handleError(error: unknown): Error {
        // Type guard pour AxiosError
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            
            if (axiosError.response) {
                // Erreur de l'API avec réponse
                const { status, data } = axiosError.response;

                switch (status) {
                    case 400:
                        return new Error(data?.message || 'Requête invalide');
                    case 401:
                        return new Error('Non autorisé. Veuillez vous reconnecter.');
                    case 403:
                        return new Error('Accès interdit');
                    case 404:
                        return new Error('Ressource non trouvée');
                    case 409:
                        return new Error(data?.message || 'Conflit de données');
                    case 422:
                        return new Error(data?.message || 'Données de validation invalides');
                    case 500:
                        return new Error('Erreur interne du serveur');
                    default:
                        return new Error(data?.message || `Erreur ${status}: Erreur inconnue`);
                }
            } else if (axiosError.request) {
                // Erreur de réseau
                return new Error('Erreur de réseau. Vérifiez votre connexion internet.');
            }
        }
        
        // Erreur de configuration ou autre
        return new Error(getErrorMessage(error));
    }

    // ============ MÉTHODES DE CACHE ET OPTIMISATION ============

    /**
     * Cache en mémoire pour éviter les appels API répétitifs
     */
    private static cache = new Map<string, { data: any; timestamp: number }>();
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    /**
     * Récupérer les données avec cache
     */
    static async getWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
        const cached = this.cache.get(key);
        const now = Date.now();

        if (cached && now - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }

        const data = await fetchFn();
        this.cache.set(key, { data, timestamp: now });
        return data;
    }

    /**
     * Invalider le cache pour une clé spécifique
     */
    static invalidateCache(key?: string): void {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Récupérer le profil avec cache
     */
    static async getProfileCached(): Promise<CustomerProfile> {
        return this.getWithCache('profile', () => this.getProfile());
    }

    /**
     * Récupérer les adresses avec cache
     */
    static async getAddressesCached(query?: GetAddressesQuery): Promise<PaginatedResponse<Address>> {
        const cacheKey = `addresses-${JSON.stringify(query || {})}`;
        return this.getWithCache(cacheKey, () => this.getAddresses(query));
    }

    // ============ MÉTHODES DE SYNCHRONISATION ============

    /**
     * Synchroniser les données locales avec le serveur
     */
    static async syncProfileData(localData: Partial<CustomerProfile>): Promise<CustomerProfile> {
        try {
            // Récupérer les données actuelles du serveur
            const serverProfile = await this.getProfile();

            // Fusionner les données (priorité au local)
            const mergedData: UpdateCustomerProfileRequest = {
                ...serverProfile,
                ...localData
            };

            // Mettre à jour le serveur
            return await this.updateProfile(mergedData);
        } catch (error) {
            console.error('Erreur lors de la synchronisation du profil:', error);
            throw error;
        }
    }

    /**
     * Vérifier si le profil existe
     */
    static async checkProfileExists(): Promise<boolean> {
        try {
            await this.getProfile();
            return true;
        } catch (error: unknown) {
            if (getErrorMessage(error).includes('404') || getErrorMessage(error).includes('non trouvé')) {
                return false;
            }
            throw error;
        }
    }

    // ============ MÉTHODES DE TRANSFORMATION ============

    /**
     * Formater un numéro de téléphone pour l'affichage
     */
    static formatPhoneForDisplay(phone: string): string {
        if (!phone) return '';

        // Supprimer tous les caractères non numériques
        const cleaned = phone.replace(/\D/g, '');

        // Formater selon la longueur
        if (cleaned.length === 9) {
            // Format camerounais: 6 XX XX XX
            return cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        } else if (cleaned.length === 12 && cleaned.startsWith('237')) {
            // Format international: +237 6 XX XX XX
            return `+237 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
        } else if (cleaned.length === 13 && cleaned.startsWith('00237')) {
            // Format international avec 00: 00237 6 XX XX XX
            return `+237 ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)} ${cleaned.slice(12, 14)}`;
        }

        // Retourner le numéro original s'il ne correspond à aucun format connu
        return phone;
    }

    /**
     * Extraire l'adresse par défaut d'un type spécifique
     */
    static getDefaultAddress(profile: CompleteCustomerProfile, type: 'BILLING' | 'DELIVERY' | 'BOTH'): Address | undefined {
        return profile.addresses.find(addr => addr.isDefault && addr.type === type);
    }

    /**
     * Compter le nombre d'adresses par type
     */
    static countAddressesByType(profile: CompleteCustomerProfile): Record<string, number> {
        const counts: Record<string, number> = {
            BILLING: 0,
            DELIVERY: 0,
            BOTH: 0,
            total: profile.addresses.length
        };

        profile.addresses.forEach(addr => {
            counts[addr.type] = (counts[addr.type] || 0) + 1;
        });

        return counts;
    }
}

/**
 * Instance du service pour une utilisation plus simple
 */
export default CustomerProfileService;

/**
 * Fonctions utilitaires supplémentaires
 */

/**
 * Créer un service avec des options personnalisées
 */
export function createCustomerProfileService(options?: {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}) {
    const customApiClient = apiClient;

    if (options?.baseURL) {
        customApiClient.defaults.baseURL = options.baseURL;
    }

    if (options?.timeout) {
        customApiClient.defaults.timeout = options.timeout;
    }

    if (options?.headers) {
        customApiClient.defaults.headers.common = {
            ...customApiClient.defaults.headers.common,
            ...options.headers
        };
    }

    return CustomerProfileService;
}

/**
 * Hook pour utiliser le service dans les composants Vue
 * (À utiliser avec un store Pinia)
 */
export function useCustomerProfileService() {
    return {
        // Profil
        getProfile: CustomerProfileService.getProfile,
        getCompleteProfile: CustomerProfileService.getCompleteProfile,
        createProfile: CustomerProfileService.createProfile,
        updateProfile: CustomerProfileService.updateProfile,
        deleteProfile: CustomerProfileService.deleteProfile,

        // Adresses
        getAddresses: CustomerProfileService.getAddresses,
        getAddress: CustomerProfileService.getAddress,
        addAddress: CustomerProfileService.addAddress,
        updateAddress: CustomerProfileService.updateAddress,
        deleteAddress: CustomerProfileService.deleteAddress,
        setDefaultAddress: CustomerProfileService.setDefaultAddress,

        // Utilitaires
        uploadAvatar: CustomerProfileService.uploadAvatar,
        deleteAvatar: CustomerProfileService.deleteAvatar,
        validateProfileFormData: CustomerProfileService.validateProfileFormData,
        validateAddressFormData: CustomerProfileService.validateAddressFormData,

        // Cache
        getProfileCached: CustomerProfileService.getProfileCached,
        getAddressesCached: CustomerProfileService.getAddressesCached,
        invalidateCache: CustomerProfileService.invalidateCache,

        // Synchronisation
        syncProfileData: CustomerProfileService.syncProfileData,
        checkProfileExists: CustomerProfileService.checkProfileExists,
    };
}