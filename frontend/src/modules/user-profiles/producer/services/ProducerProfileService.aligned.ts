// Service aligné avec les endpoints backend FastAPI
// Backend: app/routers/producer_profile_router.py

import axios from 'axios'
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
  MessageResponse,
} from '../types/ProducerProfile.aligned'

const API_BASE = '/api/v1/producers'

export class ProducerProfileService {
  // ============= PROFIL PRODUCTEUR =============
  
  /**
   * GET /api/v1/producers/profile
   * Obtenir mon profil producteur
   */
  static async getProfile(): Promise<ProducerProfile> {
    const response = await axios.get<ProducerProfile>(`${API_BASE}/profile`)
    return response.data
  }

  /**
   * GET /api/v1/producers/profile/complete
   * Obtenir mon profil complet
   */
  static async getCompleteProfile(): Promise<ProducerProfileComplete> {
    const response = await axios.get<ProducerProfileComplete>(`${API_BASE}/profile/complete`)
    return response.data
  }

  /**
   * POST /api/v1/producers/profile
   * Créer un profil producteur
   */
  static async createProfile(data: ProducerProfileCreate): Promise<ProducerProfile> {
    const response = await axios.post<ProducerProfile>(`${API_BASE}/profile`, data)
    return response.data
  }

  /**
   * PUT /api/v1/producers/profile
   * Mettre à jour mon profil producteur
   */
  static async updateProfile(data: ProducerProfileUpdate): Promise<ProducerProfile> {
    const response = await axios.put<ProducerProfile>(`${API_BASE}/profile`, data)
    return response.data
  }

  /**
   * GET /api/v1/producers/verified
   * Obtenir la liste des producteurs vérifiés
   */
  static async getVerifiedProducers(skip = 0, limit = 100): Promise<ProducerProfile[]> {
    const response = await axios.get<ProducerProfile[]>(`${API_BASE}/verified`, {
      params: { skip, limit }
    })
    return response.data
  }

  // ============= POINTS DE RETRAIT =============

  /**
   * POST /api/v1/producers/pickup-points
   * Créer un point de retrait
   */
  static async createPickupPoint(data: PickupPointCreate): Promise<PickupPoint> {
    const response = await axios.post<PickupPoint>(`${API_BASE}/pickup-points`, data)
    return response.data
  }

  /**
   * GET /api/v1/producers/pickup-points
   * Obtenir mes points de retrait
   */
  static async getPickupPoints(activeOnly = false): Promise<PickupPoint[]> {
    const response = await axios.get<PickupPoint[]>(`${API_BASE}/pickup-points`, {
      params: { active_only: activeOnly }
    })
    return response.data
  }

  /**
   * GET /api/v1/producers/pickup-points/{point_id}
   * Obtenir un point de retrait
   */
  static async getPickupPoint(pointId: number): Promise<PickupPoint> {
    const response = await axios.get<PickupPoint>(`${API_BASE}/pickup-points/${pointId}`)
    return response.data
  }

  /**
   * PUT /api/v1/producers/pickup-points/{point_id}
   * Mettre à jour un point de retrait
   */
  static async updatePickupPoint(pointId: number, data: PickupPointUpdate): Promise<PickupPoint> {
    const response = await axios.put<PickupPoint>(`${API_BASE}/pickup-points/${pointId}`, data)
    return response.data
  }

  /**
   * DELETE /api/v1/producers/pickup-points/{point_id}
   * Supprimer un point de retrait
   */
  static async deletePickupPoint(pointId: number): Promise<MessageResponse> {
    const response = await axios.delete<MessageResponse>(`${API_BASE}/pickup-points/${pointId}`)
    return response.data
  }

  // ============= CRÉNEAUX DE RETRAIT =============

  /**
   * POST /api/v1/producers/pickup-points/{point_id}/slots
   * Créer un créneau de retrait
   */
  static async createPickupSlot(pointId: number, data: PickupSlotCreate): Promise<PickupSlot> {
    const response = await axios.post<PickupSlot>(`${API_BASE}/pickup-points/${pointId}/slots`, data)
    return response.data
  }

  /**
   * GET /api/v1/producers/pickup-points/{point_id}/slots
   * Obtenir les créneaux d'un point de retrait
   */
  static async getPickupSlots(pointId: number, activeOnly = false): Promise<PickupSlot[]> {
    const response = await axios.get<PickupSlot[]>(`${API_BASE}/pickup-points/${pointId}/slots`, {
      params: { active_only: activeOnly }
    })
    return response.data
  }

  /**
   * GET /api/v1/producers/pickup-points/{point_id}/slots/available
   * Obtenir les créneaux disponibles pour un jour
   */
  static async getAvailableSlots(pointId: number, dayOfWeek: string): Promise<PickupSlot[]> {
    const response = await axios.get<PickupSlot[]>(`${API_BASE}/pickup-points/${pointId}/slots/available`, {
      params: { day_of_week: dayOfWeek }
    })
    return response.data
  }

  // ============= VALIDATION =============

  /**
   * Valider les données de profil
   */
  static validateProfile(data: ProducerProfileCreate | ProducerProfileUpdate): string[] {
    const errors: string[] = []

    if ('business_name' in data && (!data.business_name || data.business_name.length < 2)) {
      errors.push('Le nom de l\'entreprise doit contenir au moins 2 caractères')
    }

    if ('siret' in data && data.siret && ![9, 14].includes(data.siret.length)) {
      errors.push('Le SIRET doit contenir 9 ou 14 chiffres')
    }

    if ('iban' in data && data.iban) {
      const cleaned = data.iban.replace(/\s/g, '').toUpperCase()
      if (cleaned.length < 15 || cleaned.length > 34) {
        errors.push('IBAN invalide (longueur incorrecte)')
      }
    }

    return errors
  }
}

export default ProducerProfileService
