// src/modules/user-profiles/customer/stores/useCustomerStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
    CustomerProfile,
    CompleteCustomerProfile,
    Address,
    CreateCustomerProfileRequest,
    UpdateCustomerProfileRequest,
    CreateAddressRequest,
    UpdateAddressRequest,
    SetDefaultAddressRequest,
    GetAddressesQuery,
    CustomerProfileFormData,
    AddressFormData,
    CustomerProfileState,
    AddressValidationErrors,
    CustomerProfileValidationErrors
} from '../types';
import {
    CustomerProfileService,
    CustomerAddressService
} from '../services';
import type { PaginatedResponse } from '../types';

/**
 * Store Pinia pour la gestion de l'état du profil client
 * Gère le profil client, les adresses et les préférences
 */
export const useCustomerStore = defineStore('customer', () => {
    // ============ ÉTAT ============

    // Profil client
    const profile = ref<CustomerProfile | null>(null);
    const completeProfile = ref<CompleteCustomerProfile | null>(null);

    // Adresses
    const addresses = ref<Address[]>([]);
    const selectedAddress = ref<Address | null>(null);
    const defaultBillingAddress = ref<Address | null>(null);
    const defaultDeliveryAddress = ref<Address | null>(null);

    // État de chargement
    const isLoading = ref(false);
    const isUpdatingProfile = ref(false);
    const isUpdatingAddress = ref(false);
    const isDeletingAddress = ref(false);

    // Erreurs
    const error = ref<string | null>(null);
    const profileErrors = ref<CustomerProfileValidationErrors>({});
    const addressErrors = ref<AddressValidationErrors>({});

    // Filtres et pagination
    const addressFilters = ref<GetAddressesQuery>({
        page: 1,
        limit: 10,
    });

    const pagination = ref({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    });

    // ============ GETTERS ============

    /**
     * Vérifie si le profil est chargé
     */
    const hasProfile = computed(() => !!profile.value);

    /**
     * Vérifie si le profil est complet (avec adresses)
     */
    const hasCompleteProfile = computed(() => !!completeProfile.value);

    /**
     * Nom complet du client
     */
    const fullName = computed(() => {
        if (!profile.value) return '';
        return `${profile.value.firstName} ${profile.value.lastName}`.trim();
    });

    /**
     * Adresses filtrées par type
     */
    const billingAddresses = computed(() =>
        addresses.value.filter(addr => addr.type === 'BILLING' || addr.type === 'BOTH')
    );

    const deliveryAddresses = computed(() =>
        addresses.value.filter(addr => addr.type === 'DELIVERY' || addr.type === 'BOTH')
    );

    /**
     * Adresse par défaut active
     */
    const activeDefaultAddress = computed(() => {
        return addresses.value.find(addr => addr.isDefault) || null;
    });

    /**
     * Statistiques des adresses
     */
    const addressStats = computed(() => {
        const total = addresses.value.length;
        const billing = billingAddresses.value.length;
        const delivery = deliveryAddresses.value.length;
        const both = addresses.value.filter(addr => addr.type === 'BOTH').length;
        const defaults = addresses.value.filter(addr => addr.isDefault).length;

        return { total, billing, delivery, both, defaults };
    });

    /**
     * Vérifie si le profil peut passer commande
     */
    const canPlaceOrder = computed(() => {
        if (!profile.value) return false;
        if (!profile.value.phone) return false;
        if (!profile.value.email) return false;
        if (deliveryAddresses.value.length === 0) return false;

        return true;
    });

    // ============ ACTIONS ============

    /**
     * Réinitialiser l'état d'erreur
     */
    const clearError = () => {
        error.value = null;
        profileErrors.value = {};
        addressErrors.value = {};
    };

    /**
     * Définir une erreur
     */
    const setError = (message: string) => {
        error.value = message;
    };

    // ============ PROFIL CLIENT ============

    /**
     * Obtenir le profil client
     * Endpoint: GET /api/v1/customer-profiles/customers/profile
     */
    const fetchProfile = async (forceRefresh = false): Promise<void> => {
        try {
            isLoading.value = true;
            clearError();

            if (!forceRefresh && profile.value) {
                isLoading.value = false;
                return;
            }

            const data = await CustomerProfileService.getProfile();
            profile.value = data;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération du profil';
            console.error('Erreur fetchProfile:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Obtenir le profil complet avec adresses
     * Endpoint: GET /api/v1/customer-profiles/customers/profile/complete
     */
    const fetchCompleteProfile = async (): Promise<void> => {
        try {
            isLoading.value = true;
            clearError();

            const data = await CustomerProfileService.getCompleteProfile();
            completeProfile.value = data;
            profile.value = data;
            addresses.value = data.addresses;

            // Mettre à jour les adresses par défaut
            updateDefaultAddresses();
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération du profil complet';
            console.error('Erreur fetchCompleteProfile:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Créer un profil client
     * Endpoint: POST /api/v1/customer-profiles/customers/profile
     */
    const createProfile = async (data: CreateCustomerProfileRequest): Promise<CustomerProfile | null> => {
        try {
            isUpdatingProfile.value = true;
            clearError();

            // Valider les données
            const validationErrors = CustomerProfileService.validateProfileFormData(data as any);
            if (Object.keys(validationErrors).length > 0) {
                profileErrors.value = validationErrors;
                throw new Error('Données de formulaire invalides');
            }

            const newProfile = await CustomerProfileService.createProfile(data);
            profile.value = newProfile;

            // Invalider le cache
            CustomerProfileService.invalidateCache();

            return newProfile;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création du profil';
            console.error('Erreur createProfile:', err);
            return null;
        } finally {
            isUpdatingProfile.value = false;
        }
    };

    /**
     * Mettre à jour le profil client
     * Endpoint: PUT /api/v1/customer-profiles/customers/profile
     */
    const updateProfile = async (data: UpdateCustomerProfileRequest): Promise<CustomerProfile | null> => {
        try {
            isUpdatingProfile.value = true;
            clearError();

            const updatedProfile = await CustomerProfileService.updateProfile(data);
            profile.value = updatedProfile;

            if (completeProfile.value) {
                completeProfile.value = {
                    ...completeProfile.value,
                    ...updatedProfile
                };
            }

            // Invalider le cache
            CustomerProfileService.invalidateCache();

            return updatedProfile;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la mise à jour du profil';
            console.error('Erreur updateProfile:', err);
            return null;
        } finally {
            isUpdatingProfile.value = false;
        }
    };

    /**
     * Supprimer le profil client
     * Endpoint: DELETE /api/v1/customer-profiles/customers/profile
     */
    const deleteProfile = async (): Promise<boolean> => {
        try {
            isLoading.value = true;
            clearError();

            await CustomerProfileService.deleteProfile();

            // Réinitialiser l'état
            resetState();

            return true;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression du profil';
            console.error('Erreur deleteProfile:', err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    // ============ GESTION DES ADRESSES ============

    /**
     * Obtenir toutes les adresses (avec pagination)
     * Endpoint: GET /api/v1/customer-profiles/customers/addresses
     */
    const fetchAddresses = async (query?: GetAddressesQuery): Promise<void> => {
        try {
            isLoading.value = true;
            clearError();

            // Fusionner les filtres
            const mergedQuery = { ...addressFilters.value, ...query };

            const response: PaginatedResponse<Address> = await CustomerAddressService.getAddresses(mergedQuery);
            addresses.value = response.items;

            // Mettre à jour la pagination
            pagination.value = {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.totalPages,
                hasNext: response.hasNext,
                hasPrev: response.hasPrev,
            };

            // Mettre à jour les adresses par défaut
            updateDefaultAddresses();

            // Mettre à jour les filtres
            if (query) {
                addressFilters.value = { ...addressFilters.value, ...query };
            }
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération des adresses';
            console.error('Erreur fetchAddresses:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Obtenir une adresse spécifique
     * Endpoint: GET /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    const fetchAddress = async (addressId: string): Promise<Address | null> => {
        try {
            isLoading.value = true;
            clearError();

            const address = await CustomerAddressService.getAddress(addressId);
            selectedAddress.value = address;

            return address;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération de l\'adresse';
            console.error('Erreur fetchAddress:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Ajouter une nouvelle adresse
     * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    const addAddress = async (data: CreateAddressRequest): Promise<Address | null> => {
        try {
            isUpdatingAddress.value = true;
            clearError();

            // Valider les données
            const validationErrors = CustomerAddressService.validateAddressFormData(data as any);
            if (Object.keys(validationErrors).length > 0) {
                addressErrors.value = validationErrors;
                throw new Error('Données d\'adresse invalides');
            }

            const newAddress = await CustomerAddressService.addAddress(data);

            // Ajouter à la liste
            addresses.value.push(newAddress);

            // Si c'est l'adresse par défaut, mettre à jour les autres
            if (newAddress.isDefault) {
                updateDefaultAddresses();
            }

            // Invalider le cache
            CustomerAddressService.invalidateCache();

            return newAddress;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de l\'ajout de l\'adresse';
            console.error('Erreur addAddress:', err);
            return null;
        } finally {
            isUpdatingAddress.value = false;
        }
    };

    /**
     * Mettre à jour une adresse existante
     * Endpoint: PUT /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    const updateAddress = async (addressId: string, data: UpdateAddressRequest): Promise<Address | null> => {
        try {
            isUpdatingAddress.value = true;
            clearError();

            const updatedAddress = await CustomerAddressService.updateAddress(addressId, data);

            // Mettre à jour dans la liste
            const index = addresses.value.findIndex(addr => addr.id === addressId);
            if (index !== -1) {
                addresses.value[index] = updatedAddress;
            }

            // Mettre à jour l'adresse sélectionnée si c'est celle-ci
            if (selectedAddress.value?.id === addressId) {
                selectedAddress.value = updatedAddress;
            }

            // Mettre à jour les adresses par défaut
            updateDefaultAddresses();

            // Invalider le cache
            CustomerAddressService.invalidateCache();

            return updatedAddress;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la mise à jour de l\'adresse';
            console.error('Erreur updateAddress:', err);
            return null;
        } finally {
            isUpdatingAddress.value = false;
        }
    };

    /**
     * Supprimer une adresse
     * Endpoint: DELETE /api/v1/customer-profiles/customers/addresses/{address_id}
     */
    const deleteAddress = async (addressId: string): Promise<boolean> => {
        try {
            isDeletingAddress.value = true;
            clearError();

            await CustomerAddressService.deleteAddress(addressId);

            // Supprimer de la liste
            addresses.value = addresses.value.filter(addr => addr.id !== addressId);

            // Si c'était l'adresse sélectionnée, la réinitialiser
            if (selectedAddress.value?.id === addressId) {
                selectedAddress.value = null;
            }

            // Mettre à jour les adresses par défaut
            updateDefaultAddresses();

            // Invalider le cache
            CustomerAddressService.invalidateCache();

            return true;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression de l\'adresse';
            console.error('Erreur deleteAddress:', err);
            return false;
        } finally {
            isDeletingAddress.value = false;
        }
    };

    /**
     * Définir une adresse comme adresse par défaut
     * Endpoint: POST /api/v1/customer-profiles/customers/addresses/{address_id}/set-default
     */
    const setDefaultAddress = async (addressId: string, data?: SetDefaultAddressRequest): Promise<boolean> => {
        try {
            isUpdatingAddress.value = true;
            clearError();

            await CustomerAddressService.setDefaultAddress(addressId, data);

            // Mettre à jour toutes les adresses
            addresses.value = addresses.value.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
            }));

            // Mettre à jour les adresses par défaut
            updateDefaultAddresses();

            // Invalider le cache
            CustomerAddressService.invalidateCache();

            return true;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la définition de l\'adresse par défaut';
            console.error('Erreur setDefaultAddress:', err);
            return false;
        } finally {
            isUpdatingAddress.value = false;
        }
    };

    // ============ MÉTHODES UTILITAIRES ============

    /**
     * Mettre à jour les références des adresses par défaut
     */
    const updateDefaultAddresses = (): void => {
        const billing = addresses.value.find(addr =>
            addr.isDefault && (addr.type === 'BILLING' || addr.type === 'BOTH')
        );
        const delivery = addresses.value.find(addr =>
            addr.isDefault && (addr.type === 'DELIVERY' || addr.type === 'BOTH')
        );

        defaultBillingAddress.value = billing || null;
        defaultDeliveryAddress.value = delivery || null;
    };

    /**
     * Sélectionner une adresse
     */
    const selectAddress = (address: Address | null): void => {
        selectedAddress.value = address;
    };

    /**
     * Réinitialiser l'état du store
     */
    const resetState = (): void => {
        profile.value = null;
        completeProfile.value = null;
        addresses.value = [];
        selectedAddress.value = null;
        defaultBillingAddress.value = null;
        defaultDeliveryAddress.value = null;
        isLoading.value = false;
        isUpdatingProfile.value = false;
        isUpdatingAddress.value = false;
        isDeletingAddress.value = false;
        error.value = null;
        profileErrors.value = {};
        addressErrors.value = {};
    };

    /**
     * Valider les données du formulaire de profil
     */
    const validateProfileForm = (data: CustomerProfileFormData): boolean => {
        const errors = CustomerProfileService.validateProfileFormData(data);
        profileErrors.value = errors;
        return Object.keys(errors).length === 0;
    };

    /**
     * Valider les données du formulaire d'adresse
     */
    const validateAddressForm = (data: AddressFormData): boolean => {
        const errors = CustomerAddressService.validateAddressFormData(data);
        addressErrors.value = errors;
        return Object.keys(errors).length === 0;
    };

    /**
     * Préparer les données pour la mise à jour du profil
     */
    const prepareProfileUpdateData = (formData: CustomerProfileFormData): UpdateCustomerProfileRequest => {
        return CustomerProfileService.prepareProfileFormData(formData);
    };

    /**
     * Préparer les données pour la création d'adresse
     */
    const prepareAddressCreateData = (formData: AddressFormData): CreateAddressRequest => {
        return CustomerAddressService.prepareAddressFormData(formData);
    };

    /**
     * Préparer les données pour la mise à jour d'adresse
     */
    const prepareAddressUpdateData = (formData: AddressFormData): UpdateAddressRequest => {
        return CustomerAddressService.prepareAddressUpdateFormData(formData);
    };

    /**
     * Géocoder une adresse
     */
    const geocodeAddress = async (address: string): Promise<any> => {
        try {
            clearError();
            return await CustomerAddressService.geocodeAddress({ address });
        } catch (err: any) {
            error.value = err.message || 'Erreur lors du géocodage de l\'adresse';
            console.error('Erreur geocodeAddress:', err);
            return null;
        }
    };

    // ============ MÉTHODES DE SYNCHRONISATION ============

    /**
     * Synchroniser toutes les données du client
     */
    const syncCustomerData = async (): Promise<boolean> => {
        try {
            isLoading.value = true;
            clearError();

            await Promise.all([
                fetchCompleteProfile(),
                fetchAddresses()
            ]);

            return true;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la synchronisation des données';
            console.error('Erreur syncCustomerData:', err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Vérifier si le profil existe
     */
    const checkProfileExists = async (): Promise<boolean> => {
        try {
            await CustomerProfileService.checkProfileExists();
            return true;
        } catch {
            return false;
        }
    };

    // ============ EXPORT DES RÉACTIVITÉS ============

    return {
        // État
        profile,
        completeProfile,
        addresses,
        selectedAddress,
        defaultBillingAddress,
        defaultDeliveryAddress,
        isLoading,
        isUpdatingProfile,
        isUpdatingAddress,
        isDeletingAddress,
        error,
        profileErrors,
        addressErrors,
        addressFilters,
        pagination,

        // Getters
        hasProfile,
        hasCompleteProfile,
        fullName,
        billingAddresses,
        deliveryAddresses,
        activeDefaultAddress,
        addressStats,
        canPlaceOrder,

        // Actions - Profil
        fetchProfile,
        fetchCompleteProfile,
        createProfile,
        updateProfile,
        deleteProfile,

        // Actions - Adresses
        fetchAddresses,
        fetchAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,

        // Utilitaires
        clearError,
        setError,
        selectAddress,
        resetState,
        validateProfileForm,
        validateAddressForm,
        prepareProfileUpdateData,
        prepareAddressCreateData,
        prepareAddressUpdateData,
        geocodeAddress,
        syncCustomerData,
        checkProfileExists,
    };
});

/**
 * Type du store pour l'utilisation dans les composants
 */
export type CustomerStore = ReturnType<typeof useCustomerStore>;

/**
 * Hook simplifié pour utiliser le store
 */
export function useCustomer() {
    const store = useCustomerStore();
    return store;
}