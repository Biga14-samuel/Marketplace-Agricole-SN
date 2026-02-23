// Store Pinia aligné avec le backend FastAPI
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getErrorMessage } from '@/shared/utils/error-handler'
import ProducerProfileService from '../services/ProducerProfileService.aligned'
import type {
  ProducerProfile,
  ProducerProfileCreate,
  ProducerProfileUpdate,
  ProducerProfileComplete,
  PickupPoint,
  PickupPointCreate,
  PickupPointUpdate,
  PickupSlot,
  PickupSlotCreate,
} from '../types/ProducerProfile.aligned'

export const useProducerStore = defineStore('producer', () => {
  // ============= ÉTAT =============
  const profile = ref<ProducerProfile | null>(null)
  const completeProfile = ref<ProducerProfileComplete | null>(null)
  const pickupPoints = ref<PickupPoint[]>([])
  const selectedPickupPoint = ref<PickupPoint | null>(null)
  const pickupSlots = ref<PickupSlot[]>([])
  const verifiedProducers = ref<ProducerProfile[]>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============= GETTERS =============
  const hasProfile = computed(() => !!profile.value)
  const isVerified = computed(() => profile.value?.is_verified || false)
  
  const activePickupPoints = computed(() => 
    pickupPoints.value.filter(point => point.is_active)
  )

  // ============= ACTIONS - PROFIL =============
  async function fetchProfile() {
    try {
      loading.value = true
      error.value = null
      profile.value = await ProducerProfileService.getProfile()
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCompleteProfile() {
    try {
      loading.value = true
      error.value = null
      const data = await ProducerProfileService.getCompleteProfile()
      completeProfile.value = data
      profile.value = data
      pickupPoints.value = data.pickup_points
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProfile(data: ProducerProfileCreate) {
    try {
      loading.value = true
      error.value = null
      
      const errors = ProducerProfileService.validateProfile(data)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }
      
      profile.value = await ProducerProfileService.createProfile(data)
      return profile.value
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: ProducerProfileUpdate) {
    try {
      loading.value = true
      error.value = null
      profile.value = await ProducerProfileService.updateProfile(data)
      return profile.value
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchVerifiedProducers(skip = 0, limit = 100) {
    try {
      loading.value = true
      error.value = null
      verifiedProducers.value = await ProducerProfileService.getVerifiedProducers(skip, limit)
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============= ACTIONS - POINTS DE RETRAIT =============
  async function fetchPickupPoints(activeOnly = false) {
    try {
      loading.value = true
      error.value = null
      pickupPoints.value = await ProducerProfileService.getPickupPoints(activeOnly)
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPickupPoint(pointId: number) {
    try {
      loading.value = true
      error.value = null
      const point = await ProducerProfileService.getPickupPoint(pointId)
      selectedPickupPoint.value = point
      return point
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPickupPoint(data: PickupPointCreate) {
    try {
      loading.value = true
      error.value = null
      const newPoint = await ProducerProfileService.createPickupPoint(data)
      pickupPoints.value.push(newPoint)
      return newPoint
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePickupPoint(pointId: number, data: PickupPointUpdate) {
    try {
      loading.value = true
      error.value = null
      const updatedPoint = await ProducerProfileService.updatePickupPoint(pointId, data)
      const index = pickupPoints.value.findIndex(point => point.id === pointId)
      if (index !== -1) {
        pickupPoints.value[index] = updatedPoint
      }
      return updatedPoint
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePickupPoint(pointId: number) {
    try {
      loading.value = true
      error.value = null
      await ProducerProfileService.deletePickupPoint(pointId)
      pickupPoints.value = pickupPoints.value.filter(point => point.id !== pointId)
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============= ACTIONS - CRÉNEAUX =============
  async function fetchPickupSlots(pointId: number, activeOnly = false) {
    try {
      loading.value = true
      error.value = null
      pickupSlots.value = await ProducerProfileService.getPickupSlots(pointId, activeOnly)
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPickupSlot(pointId: number, data: PickupSlotCreate) {
    try {
      loading.value = true
      error.value = null
      const newSlot = await ProducerProfileService.createPickupSlot(pointId, data)
      pickupSlots.value.push(newSlot)
      return newSlot
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableSlots(pointId: number, dayOfWeek: string) {
    try {
      loading.value = true
      error.value = null
      return await ProducerProfileService.getAvailableSlots(pointId, dayOfWeek)
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
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
    pickupPoints.value = []
    selectedPickupPoint.value = null
    pickupSlots.value = []
    verifiedProducers.value = []
    loading.value = false
    error.value = null
  }

  return {
    // État
    profile,
    completeProfile,
    pickupPoints,
    selectedPickupPoint,
    pickupSlots,
    verifiedProducers,
    loading,
    error,
    
    // Getters
    hasProfile,
    isVerified,
    activePickupPoints,
    
    // Actions - Profil
    fetchProfile,
    fetchCompleteProfile,
    createProfile,
    updateProfile,
    fetchVerifiedProducers,
    
    // Actions - Points de retrait
    fetchPickupPoints,
    fetchPickupPoint,
    createPickupPoint,
    updatePickupPoint,
    deletePickupPoint,
    
    // Actions - Créneaux
    fetchPickupSlots,
    createPickupSlot,
    fetchAvailableSlots,
    
    // Utilitaires
    clearError,
    resetState,
  }
})
