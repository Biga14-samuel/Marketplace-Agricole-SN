import { getErrorMessage } from '@/shared/utils/error-handler'
import { apiClient } from '@/shared/services/api'
import type { AxiosError } from 'axios'
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
  PaginatedResponse,
  CustomerProfileFormData,
  AddressFormData,
  CustomerProfileValidationErrors,
  AddressValidationErrors,
} from '../types'

type BackendProfile = {
  id: number
  user_id: number
  first_name: string
  last_name: string
  avatar?: string | null
  preferences?: Record<string, any> | null
  created_at: string
  updated_at: string
  addresses?: BackendAddress[]
}

type BackendAddress = {
  id: number
  customer_profile_id: number
  type: 'billing' | 'delivery'
  street: string
  city: string
  postal_code: string
  country: string
  is_default: boolean
  coordinates?: string | null
  additional_info?: string | null
  created_at: string
  updated_at: string
}

type CurrentUser = {
  email?: string
  phone?: string
}

const BASE_URL = '/customer-profiles/customers'
const AUTH_ME_URL = '/authentification/auth/me'

const defaultPreferences = {
  newsletterSubscription: false,
  marketingEmails: false,
  smsNotifications: false,
  preferredDeliveryTime: undefined,
  preferredCommunicationMethod: undefined,
  allergies: [],
  dietaryRestrictions: [],
  language: 'fr' as 'fr' | 'en',
}

function parseAdditionalInfo(raw?: string | null): Record<string, any> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function serializeAdditionalInfo(data: Record<string, any>): string | null {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
  return Object.keys(clean).length ? JSON.stringify(clean) : null
}

function parseCoordinates(raw?: string | null): { latitude: number; longitude: number } | undefined {
  if (!raw) return undefined
  const [latRaw, lngRaw] = raw.split(',').map(v => v.trim())
  const latitude = Number(latRaw)
  const longitude = Number(lngRaw)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined
  return { latitude, longitude }
}

function serializeCoordinates(
  coords?: { latitude?: number; longitude?: number; lat?: number; lng?: number } | null
): string | undefined {
  if (!coords) return undefined
  const latitude = coords.latitude ?? coords.lat
  const longitude = coords.longitude ?? coords.lng
  if (latitude === undefined || longitude === undefined) return undefined
  return `${latitude},${longitude}`
}

function toBackendAddressType(type?: string): 'billing' | 'delivery' {
  if (type === 'BILLING') return 'billing'
  if (type === 'DELIVERY') return 'delivery'
  if (type === 'BOTH') return 'delivery'
  return 'delivery'
}

function toFrontendAddressType(backendType: 'billing' | 'delivery', additionalInfo: Record<string, any>): 'BILLING' | 'DELIVERY' | 'BOTH' {
  if (additionalInfo.originalType === 'BOTH') return 'BOTH'
  return backendType === 'billing' ? 'BILLING' : 'DELIVERY'
}

function mapAddress(backend: BackendAddress, profile?: CustomerProfile): Address {
  const info = parseAdditionalInfo(backend.additional_info)
  const firstName = info.firstName || profile?.firstName || ''
  const lastName = info.lastName || profile?.lastName || ''

  return {
    id: String(backend.id),
    userId: profile?.userId || '',
    type: toFrontendAddressType(backend.type, info),
    title: info.title || `${backend.city}`,
    firstName,
    lastName,
    company: info.company,
    street: backend.street,
    street2: info.street2,
    city: backend.city,
    postalCode: backend.postal_code,
    country: backend.country,
    region: info.region,
    phone: info.phone || profile?.phone || '',
    isDefault: backend.is_default,
    coordinates: parseCoordinates(backend.coordinates),
    instructions: info.instructions,
    createdAt: backend.created_at,
    updatedAt: backend.updated_at,
  }
}

function mapProfile(backend: BackendProfile, currentUser?: CurrentUser | null): CustomerProfile {
  const preferences = {
    ...defaultPreferences,
    ...(backend.preferences || {}),
  }
  return {
    id: String(backend.id),
    userId: String(backend.user_id),
    firstName: backend.first_name,
    lastName: backend.last_name,
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatar: backend.avatar || undefined,
    preferences,
    createdAt: backend.created_at,
    updatedAt: backend.updated_at,
  }
}

function toBackendProfilePayload(
  data: CreateCustomerProfileRequest | UpdateCustomerProfileRequest
): Record<string, any> {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    avatar: data.avatar,
    preferences: data.preferences,
  }
}

function toBackendAddressPayload(data: CreateAddressRequest | UpdateAddressRequest): Record<string, any> {
  const info = {
    title: (data as any).title,
    firstName: (data as any).firstName,
    lastName: (data as any).lastName,
    company: (data as any).company,
    street2: (data as any).street2,
    region: (data as any).region,
    phone: (data as any).phone,
    instructions: (data as any).instructions,
    originalType: (data as any).type === 'BOTH' ? 'BOTH' : undefined,
  }
  return {
    type: toBackendAddressType((data as any).type),
    street: (data as any).street,
    city: (data as any).city,
    postal_code: (data as any).postalCode,
    country: (data as any).country || 'Cameroun',
    is_default: (data as any).isDefault,
    coordinates: serializeCoordinates((data as any).coordinates),
    additional_info: serializeAdditionalInfo(info),
  }
}

async function getCurrentUserSafe(): Promise<CurrentUser | null> {
  try {
    const response = await apiClient.get<CurrentUser>(AUTH_ME_URL)
    return response.data
  } catch {
    return null
  }
}

function handleAxiosError(error: unknown): Error {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>
    const detail = axiosError.response?.data?.detail || axiosError.response?.data?.message
    if (detail) return new Error(detail)
  }
  return new Error(getErrorMessage(error))
}

export class CustomerProfileService {
  private static cache = new Map<string, { data: any; timestamp: number }>()
  private static readonly CACHE_DURATION = 5 * 60 * 1000

  static async getProfile(): Promise<CustomerProfile> {
    try {
      const [profileResponse, currentUser] = await Promise.all([
        apiClient.get<BackendProfile>(`${BASE_URL}/profile`),
        getCurrentUserSafe(),
      ])
      return mapProfile(profileResponse.data, currentUser)
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async getCompleteProfile(): Promise<CompleteCustomerProfile> {
    try {
      const [profileResponse, currentUser] = await Promise.all([
        apiClient.get<BackendProfile>(`${BASE_URL}/profile/complete`),
        getCurrentUserSafe(),
      ])

      const profile = mapProfile(profileResponse.data, currentUser)
      const addresses = (profileResponse.data.addresses || []).map((addr) => mapAddress(addr, profile))

      return {
        ...profile,
        addresses,
        deliveryAddress: addresses.find(a => a.isDefault && (a.type === 'DELIVERY' || a.type === 'BOTH')),
        billingAddress: addresses.find(a => a.isDefault && (a.type === 'BILLING' || a.type === 'BOTH')),
      }
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async createProfile(data: CreateCustomerProfileRequest): Promise<CustomerProfile> {
    try {
      await apiClient.post<BackendProfile>(`${BASE_URL}/profile`, toBackendProfilePayload(data))
      if (data.phone) {
        await apiClient.put(AUTH_ME_URL, { phone: data.phone }).catch(() => undefined)
      }
      this.invalidateCache('profile')
      return this.getProfile()
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async updateProfile(data: UpdateCustomerProfileRequest): Promise<CustomerProfile> {
    try {
      await apiClient.put<BackendProfile>(`${BASE_URL}/profile`, toBackendProfilePayload(data))
      if (data.phone || (data as any).email) {
        await apiClient.put(AUTH_ME_URL, { phone: data.phone, email: (data as any).email }).catch(() => undefined)
      }
      this.invalidateCache('profile')
      return this.getProfile()
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async deleteProfile(): Promise<void> {
    try {
      await apiClient.delete(`${BASE_URL}/profile`)
      this.invalidateCache()
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async getAddresses(query?: GetAddressesQuery): Promise<PaginatedResponse<Address>> {
    try {
      const profile = await this.getProfile()
      const response = await apiClient.get<BackendAddress[]>(`${BASE_URL}/addresses`)
      let addresses = response.data.map(addr => mapAddress(addr, profile))

      if (query?.type) addresses = addresses.filter(a => a.type === query.type)
      if (typeof query?.isDefault === 'boolean') {
        addresses = addresses.filter(a => a.isDefault === query.isDefault)
      }

      const page = query?.page || 1
      const limit = query?.limit || 10
      const total = addresses.length
      const totalPages = Math.max(1, Math.ceil(total / limit))
      const start = (page - 1) * limit
      const items = addresses.slice(start, start + limit)

      return {
        items,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async getAddress(addressId: string): Promise<Address> {
    try {
      const profile = await this.getProfile()
      const response = await apiClient.get<BackendAddress>(`${BASE_URL}/addresses/${addressId}`)
      return mapAddress(response.data, profile)
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async addAddress(data: CreateAddressRequest): Promise<Address> {
    try {
      const response = await apiClient.post<BackendAddress>(`${BASE_URL}/addresses`, toBackendAddressPayload(data))
      this.invalidateCache('addresses')
      const profile = await this.getProfile()
      return mapAddress(response.data, profile)
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<Address> {
    try {
      const response = await apiClient.put<BackendAddress>(
        `${BASE_URL}/addresses/${addressId}`,
        toBackendAddressPayload(data)
      )
      this.invalidateCache('addresses')
      const profile = await this.getProfile()
      return mapAddress(response.data, profile)
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async deleteAddress(addressId: string): Promise<void> {
    try {
      await apiClient.delete(`${BASE_URL}/addresses/${addressId}`)
      this.invalidateCache('addresses')
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async setDefaultAddress(addressId: string, _data?: SetDefaultAddressRequest): Promise<void> {
    try {
      await apiClient.post(`${BASE_URL}/addresses/${addressId}/set-default`)
      this.invalidateCache('addresses')
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

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
        language: formData.preferences.language,
      },
    }
  }

  static prepareAddressFormData(formData: AddressFormData): CreateAddressRequest {
    return { ...formData }
  }

  static prepareAddressUpdateFormData(formData: AddressFormData): UpdateAddressRequest {
    return { ...formData }
  }

  static validateProfileFormData(data: CustomerProfileFormData | CreateCustomerProfileRequest): CustomerProfileValidationErrors {
    const errors: CustomerProfileValidationErrors = {}
    if (!data.firstName || data.firstName.trim().length < 2) errors.firstName = 'Le prénom doit contenir au moins 2 caractères'
    if (!data.lastName || data.lastName.trim().length < 2) errors.lastName = 'Le nom doit contenir au moins 2 caractères'
    if ('phone' in data && data.phone && !/^\+?[0-9\s\-()]{8,20}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Numéro de téléphone invalide'
    }
    return errors
  }

  static validateAddressFormData(data: AddressFormData): AddressValidationErrors {
    const errors: AddressValidationErrors = {}
    if (!data.title || data.title.trim().length < 2) errors.title = 'Le titre est requis'
    if (!data.firstName || data.firstName.trim().length < 2) errors.firstName = 'Le prénom est requis'
    if (!data.lastName || data.lastName.trim().length < 2) errors.lastName = 'Le nom est requis'
    if (!data.street || data.street.trim().length < 3) errors.street = 'Adresse invalide'
    if (!data.city || data.city.trim().length < 2) errors.city = 'Ville invalide'
    if (!data.postalCode || !/^[0-9]{2,10}$/.test(data.postalCode.replace(/\s/g, ''))) errors.postalCode = 'Code postal invalide'
    if (!data.country) errors.country = 'Le pays est requis'
    if (!data.phone || !/^\+?[0-9\s\-()]{8,20}$/.test(data.phone.replace(/\s/g, ''))) errors.phone = 'Téléphone invalide'
    if (!data.type) errors.type = 'Le type est requis'
    return errors
  }

  static async uploadAvatar(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('Échec du chargement de l\'avatar'))
      reader.readAsDataURL(file)
    })
  }

  static async deleteAvatar(): Promise<void> {
    const profile = await this.getProfile()
    await this.updateProfile({ avatar: undefined, firstName: profile.firstName, lastName: profile.lastName })
  }

  static async getWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key)
    const now = Date.now()
    if (cached && now - cached.timestamp < this.CACHE_DURATION) return cached.data
    const data = await fetchFn()
    this.cache.set(key, { data, timestamp: now })
    return data
  }

  static invalidateCache(key?: string): void {
    if (!key) {
      this.cache.clear()
      return
    }
    Array.from(this.cache.keys()).forEach((cacheKey) => {
      if (cacheKey.includes(key)) this.cache.delete(cacheKey)
    })
  }

  static async getProfileCached(): Promise<CustomerProfile> {
    return this.getWithCache('profile', () => this.getProfile())
  }

  static async getAddressesCached(query?: GetAddressesQuery): Promise<PaginatedResponse<Address>> {
    return this.getWithCache(`addresses-${JSON.stringify(query || {})}`, () => this.getAddresses(query))
  }

  static async syncProfileData(localData: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const current = await this.getProfile()
    return this.updateProfile({
      firstName: localData.firstName ?? current.firstName,
      lastName: localData.lastName ?? current.lastName,
      phone: localData.phone ?? current.phone,
      avatar: localData.avatar ?? current.avatar,
      preferences: localData.preferences ?? current.preferences,
    })
  }

  static async checkProfileExists(): Promise<boolean> {
    try {
      await this.getProfile()
      return true
    } catch {
      return false
    }
  }

  static formatPhoneForDisplay(phone: string): string {
    return phone
  }

  static getDefaultAddress(profile: CompleteCustomerProfile, type: 'BILLING' | 'DELIVERY' | 'BOTH'): Address | undefined {
    return profile.addresses.find(addr => addr.isDefault && addr.type === type)
  }

  static countAddressesByType(profile: CompleteCustomerProfile): Record<string, number> {
    const counts: Record<string, number> = { BILLING: 0, DELIVERY: 0, BOTH: 0, total: profile.addresses.length }
    profile.addresses.forEach(addr => {
      counts[addr.type] = (counts[addr.type] || 0) + 1
    })
    return counts
  }
}

export default CustomerProfileService

export function createCustomerProfileService() {
  return CustomerProfileService
}

export function useCustomerProfileService() {
  return {
    getProfile: CustomerProfileService.getProfile,
    getCompleteProfile: CustomerProfileService.getCompleteProfile,
    createProfile: CustomerProfileService.createProfile,
    updateProfile: CustomerProfileService.updateProfile,
    deleteProfile: CustomerProfileService.deleteProfile,
    getAddresses: CustomerProfileService.getAddresses,
    getAddress: CustomerProfileService.getAddress,
    addAddress: CustomerProfileService.addAddress,
    updateAddress: CustomerProfileService.updateAddress,
    deleteAddress: CustomerProfileService.deleteAddress,
    setDefaultAddress: CustomerProfileService.setDefaultAddress,
    uploadAvatar: CustomerProfileService.uploadAvatar,
    deleteAvatar: CustomerProfileService.deleteAvatar,
    validateProfileFormData: CustomerProfileService.validateProfileFormData,
    validateAddressFormData: CustomerProfileService.validateAddressFormData,
    getProfileCached: CustomerProfileService.getProfileCached,
    getAddressesCached: CustomerProfileService.getAddressesCached,
    invalidateCache: CustomerProfileService.invalidateCache,
    syncProfileData: CustomerProfileService.syncProfileData,
    checkProfileExists: CustomerProfileService.checkProfileExists,
  }
}
