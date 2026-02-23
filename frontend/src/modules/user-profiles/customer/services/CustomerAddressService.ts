import { getErrorMessage } from '@/shared/utils/error-handler'
import type { AxiosError } from 'axios'
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  SetDefaultAddressRequest,
  GetAddressesQuery,
  PaginatedResponse,
  AddressFormData,
  AddressValidationErrors,
  GeocodingResult,
  GeocodeParams,
  AddressFilter,
  AddressSummary,
} from '../types'
import { CustomerProfileService } from './CustomerProfileService'

function handleAxiosError(error: unknown): Error {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>
    const detail = axiosError.response?.data?.detail || axiosError.response?.data?.message
    if (detail) return new Error(detail)
  }
  return new Error(getErrorMessage(error))
}

export class CustomerAddressService {
  private static cache = new Map<string, { data: any; timestamp: number }>()
  private static readonly CACHE_DURATION = 5 * 60 * 1000

  static async getAddresses(query?: GetAddressesQuery): Promise<PaginatedResponse<Address>> {
    try {
      return await CustomerProfileService.getAddresses(query)
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async getAddress(addressId: string): Promise<Address> {
    try {
      return await CustomerProfileService.getAddress(addressId)
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async addAddress(data: CreateAddressRequest): Promise<Address> {
    try {
      const created = await CustomerProfileService.addAddress(data)
      this.invalidateCache('addresses')
      return created
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<Address> {
    try {
      const updated = await CustomerProfileService.updateAddress(addressId, data)
      this.invalidateCache('addresses')
      return updated
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async deleteAddress(addressId: string): Promise<void> {
    try {
      await CustomerProfileService.deleteAddress(addressId)
      this.invalidateCache('addresses')
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static async setDefaultAddress(addressId: string, _data?: SetDefaultAddressRequest): Promise<void> {
    try {
      await CustomerProfileService.setDefaultAddress(addressId)
      this.invalidateCache('addresses')
    } catch (error) {
      throw handleAxiosError(error)
    }
  }

  static prepareAddressFormData(formData: AddressFormData): CreateAddressRequest {
    return { ...formData }
  }

  static prepareAddressUpdateFormData(formData: AddressFormData): UpdateAddressRequest {
    return { ...formData }
  }

  static validateAddressFormData(data: AddressFormData): AddressValidationErrors {
    const errors: AddressValidationErrors = {}
    if (!data.title || data.title.trim().length < 2) errors.title = 'Le titre doit contenir au moins 2 caractères'
    if (!data.firstName || data.firstName.trim().length < 2) errors.firstName = 'Le prénom doit contenir au moins 2 caractères'
    if (!data.lastName || data.lastName.trim().length < 2) errors.lastName = 'Le nom doit contenir au moins 2 caractères'
    if (!data.street || data.street.trim().length < 3) errors.street = 'L\'adresse est requise'
    if (!data.city || data.city.trim().length < 2) errors.city = 'La ville est requise'
    if (!data.postalCode || !/^[0-9]{2,10}$/.test(data.postalCode.replace(/\s/g, ''))) errors.postalCode = 'Code postal invalide'
    if (!data.country || data.country.trim().length < 2) errors.country = 'Le pays est requis'
    if (!data.phone || !/^\+?[0-9\s\-()]{8,20}$/.test(data.phone.replace(/\s/g, ''))) errors.phone = 'Téléphone invalide'
    if (!data.type) errors.type = 'Type d\'adresse requis'
    return errors
  }

  static validateForShipping(address: Address): boolean {
    return Boolean(address.street && address.city && address.postalCode && address.country && address.phone)
  }

  static validateForBilling(address: Address): boolean {
    return Boolean(address.street && address.city && address.postalCode && address.country && address.firstName && address.lastName)
  }

  static async geocodeAddress(params: GeocodeParams): Promise<GeocodingResult | null> {
    try {
      const query = encodeURIComponent(`${params.address} ${params.country || ''}`.trim())
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      if (!response.ok) return null
      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) return null

      const first = data[0]
      return {
        latitude: Number(first.lat),
        longitude: Number(first.lon),
        formattedAddress: first.display_name || params.address,
        street: params.address,
        city: '',
        postalCode: '',
        country: params.country || 'CM',
      }
    } catch {
      return null
    }
  }

  static async searchAddresses(query: string, country?: string): Promise<AddressSummary[]> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=${(country || 'CM').toLowerCase()}&format=json&limit=5`
      const response = await fetch(url)
      if (!response.ok) return []
      const data = await response.json()
      if (!Array.isArray(data)) return []

      return data.map((item: any, index: number) => ({
        id: String(item.place_id || index),
        title: item.display_name || query,
        street: item.display_name || query,
        city: '',
        postalCode: '',
        country: (country || 'CM').toUpperCase(),
        type: 'DELIVERY',
        isDefault: false,
      }))
    } catch {
      return []
    }
  }

  static async getAddressesCached(query?: GetAddressesQuery, forceRefresh = false): Promise<PaginatedResponse<Address>> {
    const key = `addresses-${JSON.stringify(query || {})}`
    const cached = this.cache.get(key)
    const now = Date.now()
    if (!forceRefresh && cached && now - cached.timestamp < this.CACHE_DURATION) return cached.data
    const data = await this.getAddresses(query)
    this.cache.set(key, { data, timestamp: now })
    return data
  }

  static invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }
    Array.from(this.cache.keys()).forEach((key) => {
      if (key.includes(pattern)) this.cache.delete(key)
    })
  }

  static formatFullAddress(address: Address): string {
    return [address.street, address.street2, `${address.postalCode} ${address.city}`, address.region, address.country]
      .filter(Boolean)
      .join(', ')
  }

  static formatShortAddress(address: Address): string {
    return `${address.city}, ${address.country}`
  }

  static formatOneLineAddress(address: Address): string {
    return `${address.street}, ${address.postalCode} ${address.city}`
  }

  static getDefaultAddressByType(addresses: Address[], type: string): Address | undefined {
    return addresses.find(addr => addr.isDefault && addr.type === type)
  }

  static sortAddresses(addresses: Address[]): Address[] {
    const typeOrder: Record<string, number> = { BILLING: 1, DELIVERY: 2, BOTH: 3 }
    return [...addresses].sort((a, b) => {
      const typeCompare = (typeOrder[a.type] || 4) - (typeOrder[b.type] || 4)
      if (typeCompare !== 0) return typeCompare
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
      return a.title.localeCompare(b.title)
    })
  }

  static filterAddresses(addresses: Address[], filter: AddressFilter): Address[] {
    return addresses.filter((address) => {
      if (filter.type && address.type !== filter.type) return false
      if (filter.isDefault !== undefined && address.isDefault !== filter.isDefault) return false
      if (filter.city && !address.city.toLowerCase().includes(filter.city.toLowerCase())) return false
      if (filter.country && address.country !== filter.country) return false
      return true
    })
  }

  static async syncAddresses(localAddresses: Address[]): Promise<Address[]> {
    const server = await this.getAddresses()
    const serverById = new Map(server.items.map(item => [item.id, item]))

    for (const local of localAddresses) {
      if (!serverById.has(local.id)) {
        await this.addAddress(this.prepareAddressFormData(local as any))
      } else {
        await this.updateAddress(local.id, this.prepareAddressUpdateFormData(local as any))
      }
    }

    const finalData = await this.getAddresses()
    return finalData.items
  }

  static getAddressStats(addresses: Address[]) {
    const byType = addresses.reduce((acc, addr) => {
      acc[addr.type] = (acc[addr.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: addresses.length,
      byType,
      defaultCount: addresses.filter(addr => addr.isDefault).length,
      hasBilling: addresses.some(addr => addr.type === 'BILLING' || addr.type === 'BOTH'),
      hasDelivery: addresses.some(addr => addr.type === 'DELIVERY' || addr.type === 'BOTH'),
    }
  }
}

export default CustomerAddressService

export function useCustomerAddressService() {
  return {
    getAddresses: CustomerAddressService.getAddresses,
    getAddress: CustomerAddressService.getAddress,
    addAddress: CustomerAddressService.addAddress,
    updateAddress: CustomerAddressService.updateAddress,
    deleteAddress: CustomerAddressService.deleteAddress,
    setDefaultAddress: CustomerAddressService.setDefaultAddress,
    validateAddressFormData: CustomerAddressService.validateAddressFormData,
    validateForShipping: CustomerAddressService.validateForShipping,
    validateForBilling: CustomerAddressService.validateForBilling,
    geocodeAddress: CustomerAddressService.geocodeAddress,
    searchAddresses: CustomerAddressService.searchAddresses,
    getAddressesCached: CustomerAddressService.getAddressesCached,
    invalidateCache: CustomerAddressService.invalidateCache,
    formatFullAddress: CustomerAddressService.formatFullAddress,
    formatShortAddress: CustomerAddressService.formatShortAddress,
    formatOneLineAddress: CustomerAddressService.formatOneLineAddress,
    getDefaultAddressByType: CustomerAddressService.getDefaultAddressByType,
    sortAddresses: CustomerAddressService.sortAddresses,
    filterAddresses: CustomerAddressService.filterAddresses,
    syncAddresses: CustomerAddressService.syncAddresses,
    getAddressStats: CustomerAddressService.getAddressStats,
    prepareAddressFormData: CustomerAddressService.prepareAddressFormData,
    prepareAddressUpdateFormData: CustomerAddressService.prepareAddressUpdateFormData,
  }
}
