// Store Pinia aligné avec le backend FastAPI
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import CustomerProfileService from '../services/CustomerProfileService.aligned'
import type {
  CustomerProfile,
  CustomerProfileCreate,
  CustomerProfileUpdate,
  CustomerProfileComplete,
  Address,
  AddressCreate,
  AddressUpdate,
  AddressType,
} from '../types/CustomerProfile.aligned'

export const useCustomerStore = defineStore('customer', () => {
  // ============= ÉTAT =============
  const profile = ref<CustomerProfile | null>(null)
  const completeProfile = ref<CustomerProfileComplete | null>(null)
  const addresses = ref<Address[]>([])
  const selectedAddress = ref<Address | null>(null)
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============= GETTERS =============
  const hasProfile = computed(() => !!profile.value)
  
  const fullName = computed(() => {
    if (!profile.value) return ''
    return `${profile.value.first_name} ${profile.value.last_name}`.trim()
  })

  const defaultBillingAddress = computed(() => 
    addresses.value.find(addr => addr.is_default && addr.type === 'billing')
  )

  const defaultDeliveryAddress = computed(() => 
    addresses.value.find(addr => addr.is_default && addr.type === 'delivery')
  )

  // ============= ACTIONS - PROFIL =============
  async function fetchProfile() {
    try {
      loading.value = true
      error.value = null
      profile.value = await CustomerProfileService.getProfile()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération du profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCompleteProfile() {
    try {
      loading.value = true
      error.value = null
      const data = await CustomerProfileService.getCompleteProfile()
      completeProfile.value = data
      profile.value = data
      addresses.value = data.addresses
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération du profil complet'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProfile(data: CustomerProfileCreate) {
    try {
      loading.value = true
      error.value = null
      
      const errors = CustomerProfileService.validateProfile(data)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }
      
      profile.value = await CustomerProfileService.createProfile(data)
      return profile.value
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création du profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: CustomerProfileUpdate) {
    try {
      loading.value = true
      error.value = null
      profile.value = await CustomerProfileService.updateProfile(data)
      return profile.value
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProfile() {
    try {
      loading.value = true
      error.value = null
      await CustomerProfileService.deleteProfile()
      profile.value = null
      completeProfile.value = null
      addresses.value = []
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression du profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============= ACTIONS - ADRESSES =============
  async function fetchAddresses() {
    try {
      loading.value = true
      error.value = null
      addresses.value = await CustomerProfileService.getAddresses()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des adresses'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAddress(addressId: number) {
    try {
      loading.value = true
      error.value = null
      const address = await CustomerProfileService.getAddress(addressId)
      selectedAddress.value = address
      return address
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération de l\'adresse'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createAddress(data: AddressCreate) {
    try {
      loading.value = true
      error.value = null
      
      const errors = CustomerProfileService.validateAddress(data)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }
      
      const newAddress = await CustomerProfileService.createAddress(data)
      addresses.value.push(newAddress)
      return newAddress
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'ajout de l\'adresse'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAddress(addressId: number, data: AddressUpdate) {
    try {
      loading.value = true
      error.value = null
      
      const updatedAddress = await CustomerProfileService.updateAddress(addressId, data)
      const index = addresses.value.findIndex(addr => addr.id === addressId)
      if (index !== -1) {
        addresses.value[index] = updatedAddress
      }
      return updatedAddress
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de l\'adresse'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteAddress(addressId: number) {
    try {
      loading.value = true
      error.value = null
      await CustomerProfileService.deleteAddress(addressId)
      addresses.value = addresses.value.filter(addr => addr.id !== addressId)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de l\'adresse'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function setDefaultAddress(addressId: number) {
    try {
      loading.value = true
      error.value = null
      await CustomerProfileService.setDefaultAddress(addressId)
      
      // Mettre à jour localement
      addresses.value = addresses.value.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      }))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la définition de l\'adresse par défaut'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============= UTILITAIRES =============
  function clearError() {
    error.value = null
  }

  function resetState() {
    profile.value = null
    completeProfile.value = null
    addresses.value = []
    selectedAddress.value = null
    loading.value = false
    error.value = null
  }

  return {
    // État
    profile,
    completeProfile,
    addresses,
    selectedAddress,
    loading,
    error,
    
    // Getters
    hasProfile,
    fullName,
    defaultBillingAddress,
    defaultDeliveryAddress,
    
    // Actions - Profil
    fetchProfile,
    fetchCompleteProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    
    // Actions - Adresses
    fetchAddresses,
    fetchAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    
    // Utilitaires
    clearError,
    resetState,
  }
})
