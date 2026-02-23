// Types alignés avec le backend FastAPI
// Backend: app/schemas/profile_schema.py

export type DocumentType = 'kbis' | 'insurance' | 'certification'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface ProducerProfile {
  id: number
  user_id: number
  business_name: string
  bio?: string
  certifications?: string[]
  siret?: string
  tva_number?: string
  iban?: string
  farm_size?: number
  production_type?: string[]
  avatar?: string
  cover_image?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface ProducerProfileCreate {
  business_name: string
  bio?: string
  certifications?: string[]
  siret?: string
  tva_number?: string
  iban?: string
  farm_size?: number
  production_type?: string[]
  avatar?: string
  cover_image?: string
}

export interface ProducerProfileUpdate {
  business_name?: string
  bio?: string
  certifications?: string[]
  siret?: string
  tva_number?: string
  iban?: string
  farm_size?: number
  production_type?: string[]
  avatar?: string
  cover_image?: string
}

export interface ProducerProfileComplete extends ProducerProfile {
  documents: ProducerDocument[]
  schedules: ProducerSchedule[]
  pickup_points: PickupPoint[]
}

export interface ProducerDocument {
  id: number
  producer_id: number
  type: DocumentType
  file_path: string
  original_filename?: string
  verified: boolean
  verified_by?: number
  verified_at?: string
  uploaded_at: string
  expires_at?: string
}

export interface ProducerSchedule {
  id: number
  producer_id: number
  day_of_week: DayOfWeek
  open_time: string  // Format "HH:MM"
  close_time: string  // Format "HH:MM"
  is_closed: boolean
  created_at: string
}

export interface PickupPoint {
  id: number
  producer_id: number
  name: string
  address: string
  city: string
  postal_code: string
  coordinates?: string  // Format: "latitude,longitude"
  instructions?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PickupPointCreate {
  name: string
  address: string
  city: string
  postal_code: string
  coordinates?: string
  instructions?: string
  is_active?: boolean
}

export interface PickupPointUpdate {
  name?: string
  address?: string
  city?: string
  postal_code?: string
  coordinates?: string
  instructions?: string
  is_active?: boolean
}

export interface PickupSlot {
  id: number
  pickup_point_id: number
  day_of_week: DayOfWeek
  start_time: string  // Format "HH:MM"
  end_time: string  // Format "HH:MM"
  max_orders: number
  current_orders: number
  is_active: boolean
  created_at: string
}

export interface PickupSlotCreate {
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  max_orders?: number
  is_active?: boolean
}

export interface MessageResponse {
  message: string
}

// Validation SIRET (9 ou 14 chiffres)
export function validateSiret(siret: string): boolean {
  return siret.length === 9 || siret.length === 14
}

// Validation IBAN (15-34 caractères)
export function validateIban(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase()
  return cleaned.length >= 15 && cleaned.length <= 34
}

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
