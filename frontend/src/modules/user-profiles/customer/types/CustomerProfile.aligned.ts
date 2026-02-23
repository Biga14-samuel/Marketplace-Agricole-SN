// Types alignés avec le backend FastAPI
// Backend: app/schemas/profile_schema.py

export interface CustomerProfile {
  id: number
  user_id: number
  first_name: string
  last_name: string
  avatar?: string
  preferences?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CustomerProfileCreate {
  first_name: string
  last_name: string
  avatar?: string
  preferences?: Record<string, any>
}

export interface CustomerProfileUpdate {
  first_name?: string
  last_name?: string
  avatar?: string
  preferences?: Record<string, any>
}

export interface CustomerProfileComplete extends CustomerProfile {
  addresses: Address[]
}

// Types d'adresse
export type AddressType = 'billing' | 'delivery'

export interface Address {
  id: number
  customer_profile_id: number
  type: AddressType
  street: string
  city: string
  postal_code: string
  country: string
  is_default: boolean
  coordinates?: string  // Format: "latitude,longitude"
  additional_info?: string
  created_at: string
  updated_at: string
}

export interface AddressCreate {
  type: AddressType
  street: string
  city: string
  postal_code: string
  country?: string  // Par défaut "Cameroun"
  is_default?: boolean
  coordinates?: string
  additional_info?: string
}

export interface AddressUpdate {
  type?: AddressType
  street?: string
  city?: string
  postal_code?: string
  country?: string
  is_default?: boolean
  coordinates?: string
  additional_info?: string
}

// Réponses API
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface MessageResponse {
  message: string
}

// Constantes Cameroun
export const CAMEROON_REGIONS = [
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
]

export const CAMEROON_CITIES = [
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
]

// Validation téléphone Cameroun: +237XXXXXXXXX (9 chiffres, commence par 6 ou 2)
export const CAMEROON_PHONE_REGEX = /^(\+237|237)?[62]\d{8}$/

// Validation coordonnées GPS
export function validateCoordinates(coords: string): boolean {
  const parts = coords.split(',')
  if (parts.length !== 2) return false
  
  try {
    const lat = parseFloat(parts[0])
    const lon = parseFloat(parts[1])
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
  } catch {
    return false
  }
}

// Formattage adresse complète
export function formatFullAddress(address: Address): string {
  const parts = [
    address.street,
    address.additional_info,
    `${address.postal_code} ${address.city}`,
    address.country,
  ].filter(Boolean)
  
  return parts.join(', ')
}

// Extraction adresse par défaut
export function getDefaultAddress(addresses: Address[], type: AddressType): Address | undefined {
  return addresses.find(addr => addr.is_default && addr.type === type)
}
