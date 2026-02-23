import { getErrorMessage } from '@/shared/utils/error-handler';
// src/modules/user-profiles/customer/services/CustomerAddressService.ts

import type {
    Address,
    CreateAddressRequest,
    UpdateAddressRequest,
    SetDefaultAddressRequest,
    GetAddressesQuery,
    AddressResponse,
    AddressListResponse,
    ApiResponse,
    PaginatedResponse,
    AddressFormData,
    AddressValidationErrors,
    GeocodingResult,
    GeocodeParams,
    AddressFilter,
    AddressSummary
} from '../types';
import { apiClient } from '@/shared/services/api';
import type { AxiosResponse, AxiosError } from 'axios';

/**
 * Service spécialisé pour la gestion des adresses client
 * Ce service se concentre uniquement sur les opérations d'adresses
 */
export class CustomerAddressService {
    private static readonly BASE_URL = '/api/v1/customer-profiles/customers/addresses';
    private static readonly GEOCODE_URL = 'https://api.geocode.xyz'; // Service de géocodage externe
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Cache en mémoire
    private static cache = new Map<string, { data: any; timestamp: number }>();
    private static geocodeCache = new Map<string, GeocodingResult>();

    // ============ OPÉRATIONS CRUD SUR LES ADRESSES ============

    /**
     * Obtenir toutes les adresses du client (avec pagination)
     * Endpoint: GET /api/v1/customer-profiles/customers/addresses
     */
    static async getAddresses(query?: GetAddressesQuery): Promise<PaginatedResponse<Address>> {
        try {
            const cacheKey = `addresses-${JSON.stringify(query || {})}`;
            const cached = this.getFromCache<PaginatedResponse<Address>>(cacheKey);

            if (cached) {
                return cached;
            }

            const response: AxiosResponse<ApiResponse<PaginatedResponse<Address>>> = await apiClient.get(
                this.BASE_URL,
                { params: this.sanitizeQueryParams(query) }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de la récupération des adresses');
            }

            this.setCache(cacheKey, response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des adresses:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtenir une adresse spécifique par son ID
     * Endpoint: GET /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    static async getAddress(addressId: string): Promise<Address> {
        try {
            const cacheKey = `address-${addressId}`;
            const cached = this.getFromCache<Address>(cacheKey);

            if (cached) {
                return cached;
            }

            const response: AxiosResponse<AddressResponse> = await apiClient.get(
                `${this.BASE_URL}/${addressId}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la récupération de l'adresse ${addressId}`);
            }

            this.setCache(cacheKey, response.data.data);
            return response.data.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'adresse ${addressId}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Ajouter une nouvelle adresse
     * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}
     * Note: L'API attend un address_id dans le chemin, nous générons un UUID temporaire
     */
    static async addAddress(data: CreateAddressRequest): Promise<Address> {
        try {
            // Générer un ID temporaire pour la requête
            const tempId = this.generateTempId();

            const response: AxiosResponse<AddressResponse> = await apiClient.post(
                this.BASE_URL,
                data,
                {
                    headers: {
                        'X-Temp-Address-ID': tempId
                    }
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Échec de l\'ajout de l\'adresse');
            }

            // Invalider le cache des listes d'adresses
            this.invalidateCache('addresses');

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
                `${this.BASE_URL}/${addressId}`,
                data
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la mise à jour de l'adresse ${addressId}`);
            }

            // Mettre à jour le cache
            this.setCache(`address-${addressId}`, response.data.data);
            this.invalidateCache('addresses');

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
                `${this.BASE_URL}/${addressId}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la suppression de l'adresse ${addressId}`);
            }

            // Supprimer du cache
            this.cache.delete(`address-${addressId}`);
            this.invalidateCache('addresses');
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'adresse ${addressId}:`, error);
            throw this.handleError(error);
        }
    }

    /**
     * Définir une adresse comme adresse par défaut
     * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}/set-default
     */
    static async setDefaultAddress(addressId: string, data?: SetDefaultAddressRequest): Promise<void> {
        try {
            const requestData = data || { addressId };
            const response: AxiosResponse<ApiResponse<void>> = await apiClient.post(
                `${this.BASE_URL}/${addressId}/set-default`,
                requestData
            );

            if (!response.data.success) {
                throw new Error(response.data.message || `Échec de la définition de l'adresse par défaut`);
            }

            // Invalider le cache
            this.invalidateCache('addresses');
        } catch (error) {
            console.error(`Erreur lors de la définition de l'adresse par défaut:`, error);
            throw this.handleError(error);
        }
    }

    // ============ MÉTHODES UTILITAIRES POUR FORMULAIRES ============

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
            coordinates: formData.coordinates,
            instructions: formData.instructions
        };
    }

    /**
     * Préparer les données de mise à jour d'adresse
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
            coordinates: formData.coordinates,
            instructions: formData.instructions
        };
    }

    // ============ VALIDATION DES DONNÉES ============

    /**
     * Valider les données du formulaire d'adresse
     */
    static validateAddressFormData(data: AddressFormData): AddressValidationErrors {
        const errors: AddressValidationErrors = {};

        // Validation du titre
        if (!data.title || data.title.trim().length < 2) {
            errors.title = 'Le titre doit contenir au moins 2 caractères';
        } else if (data.title.length > 50) {
            errors.title = 'Le titre ne doit pas dépasser 50 caractères';
        }

        // Validation du prénom
        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
        }

        // Validation du nom
        if (!data.lastName || data.lastName.trim().length < 2) {
            errors.lastName = 'Le nom doit contenir au moins 2 caractères';
        }

        // Validation de la rue
        if (!data.street || data.street.trim().length < 5) {
            errors.street = 'L\'adresse doit contenir au moins 5 caractères';
        }

        // Validation de la ville
        if (!data.city || data.city.trim().length < 2) {
            errors.city = 'La ville doit contenir au moins 2 caractères';
        }

        // Validation du code postal
        if (!data.postalCode) {
            errors.postalCode = 'Le code postal est requis';
        } else if (!/^[0-9]{4,10}$/.test(data.postalCode.replace(/\s/g, ''))) {
            errors.postalCode = 'Code postal invalide';
        }

        // Validation du pays
        if (!data.country) {
            errors.country = 'Le pays est requis';
        }

        // Validation du téléphone
        if (!data.phone) {
            errors.phone = 'Le numéro de téléphone est requis';
        } else if (!this.isValidPhoneNumber(data.phone)) {
            errors.phone = 'Numéro de téléphone invalide';
        }

        // Validation du type d'adresse
        if (!data.type) {
            errors.type = 'Le type d\'adresse est requis';
        }

        return errors;
    }

    /**
     * Valider une adresse pour la livraison
     */
    static validateForShipping(address: Address): boolean {
        const requiredFields = ['street', 'city', 'postalCode', 'country', 'phone', 'firstName', 'lastName'];
        return requiredFields.every(field =>
            address[field as keyof Address] &&
            String(address[field as keyof Address]).trim().length > 0
        );
    }

    /**
     * Valider une adresse pour la facturation
     */
    static validateForBilling(address: Address): boolean {
        const requiredFields = ['street', 'city', 'postalCode', 'country', 'firstName', 'lastName'];
        return requiredFields.every(field =>
            address[field as keyof Address] &&
            String(address[field as keyof Address]).trim().length > 0
        );
    }

    // ============ GÉOCODAGE ET RECHERCHE ============

    /**
     * Géocoder une adresse (convertir texte → coordonnées)
     */
    static async geocodeAddress(params: GeocodeParams): Promise<GeocodingResult | null> {
        try {
            const cacheKey = `geocode-${params.address}-${params.country || 'default'}`;

            if (this.geocodeCache.has(cacheKey)) {
                return this.geocodeCache.get(cacheKey)!;
            }

            // Utilisation d'un service de géocodage externe
            const response = await fetch(
                `${this.GEOCODE_URL}?locate=${encodeURIComponent(params.address)}&json=1&region=${params.country || 'CM'}`
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            if (data.error) {
                return null;
            }

            const result: GeocodingResult = {
                latitude: parseFloat(data.latt),
                longitude: parseFloat(data.longt),
                formattedAddress: data.standard?.addresst || params.address,
                street: data.standard?.street || '',
                city: data.standard?.city || '',
                postalCode: data.standard?.postal || '',
                country: data.standard?.countryname || params.country || 'CM',
                region: data.standard?.region || ''
            };

            this.geocodeCache.set(cacheKey, result);
            return result;
        } catch (error) {
            console.error('Erreur lors du géocodage:', error);
            return null;
        }
    }

    /**
     * Rechercher des adresses via une API de suggestion
     */
    static async searchAddresses(query: string, country?: string): Promise<AddressSummary[]> {
        try {
            const response = await fetch(
                `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5${country ? `&country=${country}` : ''}`
            );

            if (!response.ok) {
                return [];
            }

            const data = await response.json();

            return data.features?.map((feature: any) => ({
                id: feature.properties.id,
                title: feature.properties.label,
                street: feature.properties.name,
                city: feature.properties.city,
                postalCode: feature.properties.postcode,
                country: feature.properties.country || 'FR',
                type: 'DELIVERY' as const,
                isDefault: false
            })) || [];
        } catch (error) {
            console.error('Erreur lors de la recherche d\'adresses:', error);
            return [];
        }
    }

    // ============ GESTION DU CACHE ============

    /**
     * Récupérer des données du cache
     */
    private static getFromCache<T>(key: string): T | null {
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        const now = Date.now();
        if (now - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }

        return cached.data as T;
    }

    /**
     * Mettre des données en cache
     */
    private static setCache(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Invalider le cache
     */
    static invalidateCache(pattern?: string): void {
        if (pattern) {
            // Supprimer toutes les clés correspondant au motif
            Array.from(this.cache.keys()).forEach(key => {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            });
        } else {
            // Supprimer tout le cache
            this.cache.clear();
        }
    }

    /**
     * Récupérer les adresses avec cache forcé
     */
    static async getAddressesCached(query?: GetAddressesQuery, forceRefresh = false): Promise<PaginatedResponse<Address>> {
        const cacheKey = `addresses-${JSON.stringify(query || {})}`;

        if (!forceRefresh) {
            const cached = this.getFromCache<PaginatedResponse<Address>>(cacheKey);
            if (cached) {
                return cached;
            }
        }

        const addresses = await this.getAddresses(query);
        this.setCache(cacheKey, addresses);
        return addresses;
    }

    // ============ MÉTHODES DE TRANSFORMATION ============

    /**
     * Formater une adresse complète pour l'affichage
     */
    static formatFullAddress(address: Address): string {
        const parts = [
            address.street,
            address.street2,
            `${address.postalCode} ${address.city}`,
            address.region,
            address.country
        ].filter(Boolean);

        return parts.join(', ');
    }

    /**
     * Formater une adresse courte
     */
    static formatShortAddress(address: Address): string {
        return `${address.city}, ${address.country}`;
    }

    /**
     * Formater l'adresse sur une ligne
     */
    static formatOneLineAddress(address: Address): string {
        return `${address.street}, ${address.postalCode} ${address.city}`;
    }

    /**
     * Extraire l'adresse par défaut d'un type spécifique
     */
    static getDefaultAddressByType(addresses: Address[], type: string): Address | undefined {
        return addresses.find(addr => addr.isDefault && addr.type === type);
    }

    /**
     * Trier les adresses par type puis par titre
     */
    static sortAddresses(addresses: Address[]): Address[] {
        return [...addresses].sort((a, b) => {
            // D'abord par type
            const typeOrder = { BILLING: 1, DELIVERY: 2, BOTH: 3 };
            const typeCompare = (typeOrder[a.type] || 4) - (typeOrder[b.type] || 4);

            if (typeCompare !== 0) {
                return typeCompare;
            }

            // Ensuite par adresse par défaut
            if (a.isDefault !== b.isDefault) {
                return a.isDefault ? -1 : 1;
            }

            // Enfin par titre
            return a.title.localeCompare(b.title);
        });
    }

    /**
     * Filtrer les adresses selon des critères
     */
    static filterAddresses(addresses: Address[], filter: AddressFilter): Address[] {
        return addresses.filter(address => {
            if (filter.type && address.type !== filter.type) return false;
            if (filter.isDefault !== undefined && address.isDefault !== filter.isDefault) return false;
            if (filter.city && !address.city.toLowerCase().includes(filter.city.toLowerCase())) return false;
            if (filter.country && address.country !== filter.country) return false;
            return true;
        });
    }

    // ============ UTILITAIRES ============

    /**
     * Générer un ID temporaire pour les nouvelles adresses
     */
    private static generateTempId(): string {
        return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Nettoyer les paramètres de requête
     */
    private static sanitizeQueryParams(params?: any): any {
        if (!params) return {};

        const sanitized: any = {};
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                sanitized[key] = params[key];
            }
        });

        return sanitized;
    }

    /**
     * Vérifier si un numéro de téléphone est valide
     */
    private static isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Gérer les erreurs de l'API
     */
    private static handleError(error: unknown): Error {
        // Type guard pour AxiosError
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            
            if (axiosError.response) {
                const { status, data } = axiosError.response;

                switch (status) {
                    case 400:
                        return new Error(data?.message || 'Requête invalide. Vérifiez les données saisies.');
                    case 401:
                        return new Error('Vous devez être connecté pour effectuer cette action.');
                    case 403:
                        return new Error('Vous n\'avez pas la permission de modifier cette adresse.');
                    case 404:
                        return new Error('Adresse non trouvée.');
                    case 409:
                        return new Error(data?.message || 'Cette adresse existe déjà.');
                    case 422:
                        return new Error(data?.message || 'Les données fournies sont invalides.');
                    case 500:
                        return new Error('Erreur serveur. Veuillez réessayer plus tard.');
                    default:
                        return new Error(data?.message || `Erreur ${status}: Une erreur est survenue.`);
                }
            } else if (axiosError.request) {
                return new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            }
        }
        
        return new Error(getErrorMessage(error));
    }

    // ============ MÉTHODES DE SYNCHRONISATION ============

    /**
     * Synchroniser les adresses locales avec le serveur
     */
    static async syncAddresses(localAddresses: Address[]): Promise<Address[]> {
        try {
            // Récupérer les adresses du serveur
            const serverResponse = await this.getAddresses();
            const serverAddresses = serverResponse.items;

            // Identifier les adresses à créer, mettre à jour ou supprimer
            const operations = this.compareAddresses(localAddresses, serverAddresses);

            // Exécuter les opérations
            const results: Address[] = [];

            for (const op of operations.create) {
                const created = await this.addAddress(op);
                results.push(created);
            }

            for (const op of operations.update) {
                const updated = await this.updateAddress(op.id, op.data);
                results.push(updated);
            }

            for (const op of operations.delete) {
                await this.deleteAddress(op.id);
            }

            // Récupérer la liste finale
            const finalResponse = await this.getAddresses();
            return finalResponse.items;
        } catch (error) {
            console.error('Erreur lors de la synchronisation des adresses:', error);
            throw error;
        }
    }

    /**
     * Comparer les adresses locales et serveur
     */
    private static compareAddresses(local: Address[], server: Address[]) {
        const create: CreateAddressRequest[] = [];
        const update: Array<{ id: string; data: UpdateAddressRequest }> = [];
        const deleteIds: string[] = [];

        // Trouver les adresses à créer (présentes en local mais pas en serveur)
        local.forEach(localAddr => {
            const serverAddr = server.find(s => s.id === localAddr.id);
            if (!serverAddr) {
                create.push(this.prepareAddressFormData(localAddr as any));
            }
        });

        // Trouver les adresses à mettre à jour
        local.forEach(localAddr => {
            const serverAddr = server.find(s => s.id === localAddr.id);
            if (serverAddr && this.addressesDiffer(localAddr, serverAddr)) {
                update.push({
                    id: localAddr.id,
                    data: this.prepareAddressUpdateFormData(localAddr as any)
                });
            }
        });

        // Trouver les adresses à supprimer (présentes en serveur mais pas en local)
        server.forEach(serverAddr => {
            if (!local.find(l => l.id === serverAddr.id)) {
                deleteIds.push(serverAddr.id);
            }
        });

        return { create, update, delete: deleteIds.map(id => ({ id })) };
    }

    /**
     * Vérifier si deux adresses sont différentes
     */
    private static addressesDiffer(addr1: Address, addr2: Address): boolean {
        const keys: (keyof Address)[] = [
            'title', 'firstName', 'lastName', 'company', 'street', 'street2',
            'city', 'postalCode', 'country', 'region', 'phone', 'type', 'isDefault'
        ];

        return keys.some(key => addr1[key] !== addr2[key]);
    }

    // ============ MÉTHODES DE STATISTIQUES ============

    /**
     * Obtenir des statistiques sur les adresses
     */
    static getAddressStats(addresses: Address[]) {
        const byType = addresses.reduce((acc, addr) => {
            acc[addr.type] = (acc[addr.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const byCountry = addresses.reduce((acc, addr) => {
            acc[addr.country] = (acc[addr.country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const defaultCount = addresses.filter(addr => addr.isDefault).length;

        return {
            total: addresses.length,
            byType,
            byCountry,
            defaultCount,
            hasBilling: addresses.some(addr => addr.type === 'BILLING' || addr.type === 'BOTH'),
            hasDelivery: addresses.some(addr => addr.type === 'DELIVERY' || addr.type === 'BOTH')
        };
    }
}

/**
 * Instance du service pour une utilisation simple
 */
export default CustomerAddressService;

/**
 * Hook pour utiliser le service dans les composants Vue
 */
export function useCustomerAddressService() {
    return {
        // CRUD
        getAddresses: CustomerAddressService.getAddresses,
        getAddress: CustomerAddressService.getAddress,
        addAddress: CustomerAddressService.addAddress,
        updateAddress: CustomerAddressService.updateAddress,
        deleteAddress: CustomerAddressService.deleteAddress,
        setDefaultAddress: CustomerAddressService.setDefaultAddress,

        // Validation
        validateAddressFormData: CustomerAddressService.validateAddressFormData,
        validateForShipping: CustomerAddressService.validateForShipping,
        validateForBilling: CustomerAddressService.validateForBilling,

        // Géocodage et recherche
        geocodeAddress: CustomerAddressService.geocodeAddress,
        searchAddresses: CustomerAddressService.searchAddresses,

        // Cache
        getAddressesCached: CustomerAddressService.getAddressesCached,
        invalidateCache: CustomerAddressService.invalidateCache,

        // Transformation
        formatFullAddress: CustomerAddressService.formatFullAddress,
        formatShortAddress: CustomerAddressService.formatShortAddress,
        formatOneLineAddress: CustomerAddressService.formatOneLineAddress,
        getDefaultAddressByType: CustomerAddressService.getDefaultAddressByType,
        sortAddresses: CustomerAddressService.sortAddresses,
        filterAddresses: CustomerAddressService.filterAddresses,

        // Synchronisation
        syncAddresses: CustomerAddressService.syncAddresses,

        // Statistiques
        getAddressStats: CustomerAddressService.getAddressStats,

        // Utilitaires
        prepareAddressFormData: CustomerAddressService.prepareAddressFormData,
        prepareAddressUpdateFormData: CustomerAddressService.prepareAddressUpdateFormData
    };
}