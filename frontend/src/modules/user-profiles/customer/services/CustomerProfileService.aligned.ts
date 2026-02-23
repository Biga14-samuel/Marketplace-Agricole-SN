// Service aligné avec les endpoints backend FastAPI
// Backend: app/routers/customer_profile_router.py

import axios from 'axios'
import type {
  CustomerProfile,
  CustomerProfileCreate,
  CustomerProfileUpdate,
  CustomerProfileComplete,
  Address,
  AddressCreate,
  AddressUpdate,
  ApiResponse,
  MessageResponse,
} from '../types/CustomerProfile.aligned'

const API_BASE = '/api/v1/customers'

export class CustomerProfileService {
  // ============= PROFIL CLIENT =============
  
  /**
   * GET /api/v1/customers/profile
   * Obtenir mon profil client
   */
  static async getProfile(): Promise<CustomerProfile> {
    const response = await axios.get<CustomerProfile>(`${API_BASE}/profile`)
    return response.data
  }

  /**
   * GET /api/v1/customers/profile/complete
   * Obtenir mon profil complet avec adresses
   */
  static async getCompleteProfile(): Promise<CustomerProfileComplete> {
    const response = await axios.get<CustomerProfileComplete>(`${API_BASE}/profile/complete`)
    return response.data
  }

  /**
   * POST /api/v1/customers/profile
   * Créer un profil client
   */
  static async createProfile(data: CustomerProfileCreate): Promise<CustomerProfile> {
    const response = await axios.post<CustomerProfile>(`${API_BASE}/profile`, data)
    return response.data
  }

  /**
   * PUT /api/v1/customers/profile
   * Mettre à jour mon profil client
   */
  static async updateProfile(data: CustomerProfileUpdate): Promise<CustomerProfile> {
    const response = await axios.put<CustomerProfile>(`${API_BASE}/profile`, data)
    return response.data
  }

  /**
   * DELETE /api/v1/customers/profile
   * Supprimer mon profil client
   */
  static async deleteProfile(): Promise<MessageResponse> {
    const response = await axios.delete<MessageResponse>(`${API_BASE}/profile`)
    return response.data
  }

  // ============= ADRESSES =============

  /**
   * GET /api/v1/customers/addresses
   * Obtenir toutes mes adresses
   */
  static async getAddresses(): Promise<Address[]> {
    const response = await axios.get<Address[]>(`${API_BASE}/addresses`)
    return response.data
  }

  /**
   * GET /api/v1/customers/addresses/{address_id}
   * Obtenir une adresse spécifique
   */
  static async getAddress(addressId: number): Promise<Address> {
    const response = await axios.get<Address>(`${API_BASE}/addresses/${addressId}`)
    return response.data
  }

  /**
   * POST /api/v1/customers/addresses
   * Ajouter une adresse
   */
  static async createAddress(data: AddressCreate): Promise<Address> {
    const response = await axios.post<Address>(`${API_BASE}/addresses`, data)
    return response.data
  }

  /**
   * PUT /api/v1/customers/addresses/{address_id}
   * Mettre à jour une adresse
   */
  static async updateAddress(addressId: number, data: AddressUpdate): Promise<Address> {
    const response = await axios.put<Address>(`${API_BASE}/addresses/${addressId}`, data)
    return response.data
  }

  /**
   * DELETE /api/v1/customers/addresses/{address_id}
   * Supprimer une adresse
   */
  static async deleteAddress(addressId: number): Promise<MessageResponse> {
    const response = await axios.delete<MessageResponse>(`${API_BASE}/addresses/${addressId}`)
    return response.data
  }

  /**
   * POST /api/v1/customers/addresses/{address_id}/set-default
   * Définir une adresse par défaut
   */
  static async setDefaultAddress(addressId: number): Promise<Address> {
    const response = await axios.post<Address>(`${API_BASE}/addresses/${addressId}/set-default`)
    return response.data
  }

  // ============= VALIDATION =============

  /**
   * Valider les données de profil
   */
  static validateProfile(data: CustomerProfileCreate | CustomerProfileUpdate): string[] {
    const errors: string[] = []

    if ('first_name' in data && (!data.first_name || data.first_name.length < 2)) {
      errors.push('Le prénom doit contenir au moins 2 caractères')
    }

    if ('last_name' in data && (!data.last_name || data.last_name.length < 2)) {
      errors.push('Le nom doit contenir au moins 2 caractères')
    }

    return errors
  }

  /**
   * Valider les données d'adresse
   */
  static validateAddress(data: AddressCreate | AddressUpdate): string[] {
    const errors: string[] = []

    if ('street' in data && (!data.street || data.street.length < 5)) {
      errors.push('La rue doit contenir au moins 5 caractères')
    }

    if ('city' in data && (!data.city || data.city.length < 2)) {
      errors.push('La ville doit contenir au moins 2 caractères')
    }

    if ('postal_code' in data && (!data.postal_code || data.postal_code.length < 2)) {
      errors.push('Le code postal est requis')
    }

    if ('coordinates' in data && data.coordinates) {
      const parts = data.coordinates.split(',')
      if (parts.length !== 2) {
        errors.push('Les coordonnées doivent être au format "latitude,longitude"')
      } else {
        try {
          const lat = parseFloat(parts[0])
          const lon = parseFloat(parts[1])
          if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            errors.push('Coordonnées GPS invalides')
          }
        } catch {
          errors.push('Les coordonnées doivent être des nombres valides')
        }
      }
    }

    return errors
  }
}

export default CustomerProfileService
