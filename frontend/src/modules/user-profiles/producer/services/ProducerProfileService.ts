import api from '@/shared/services/api';
import type {
    ProducerProfile,
    ProducerProfileCreate,
    ProducerProfileUpdate,
    ProductionType,
    PickupPoint,
    PickupPointCreate,
    PickupSlotUpdate,
    PickupSlot,
    PickupSlotCreate,
    ProducerDocument,
    ProducerDocumentUpload,
    ProducerSchedule,
    ProducerScheduleUpdate
} from '../types';

export const ProducerProfileService = {
    // ============================================
    // PROFIL PRODUCTEUR
    // ============================================

    /**
     * Obtenir mon profil producteur
     * GET /api/v1/producer-profiles/producers/profile
     */
    async getProfile(): Promise<ProducerProfile> {
        const response = await api.get('/producer-profiles/producers/profile');
        return response.data;
    },

    /**
     * Créer un profil producteur
     * POST /api/v1/producer-profiles/producers/profile
     */
    async createProfile(profileData: ProducerProfileCreate): Promise<ProducerProfile> {
        const response = await api.post('/producer-profiles/producers/profile', profileData);
        return response.data;
    },

    /**
     * Mettre à jour mon profil producteur
     * PUT /api/v1/producer-profiles/producers/profile
     */
    async updateProfile(profileData: ProducerProfileUpdate): Promise<ProducerProfile> {
        const response = await api.put('/producer-profiles/producers/profile', profileData);
        return response.data;
    },

    /**
     * Obtenir mon profil complet (avec documents, points de retrait, etc.)
     * GET /api/v1/producer-profiles/producers/profile/complete
     */
    async getCompleteProfile(): Promise<{
        profile: ProducerProfile;
        documents: ProducerDocument[];
        pickupPoints: PickupPoint[];
        schedule: ProducerSchedule[];
    }> {
        const response = await api.get('/producer-profiles/producers/profile/complete');
        return response.data;
    },

    /**
     * Obtenir la liste des producteurs vérifiés (pour les clients)
     * GET /api/v1/producer-profiles/producers/verified
     */
    async getVerifiedProducers(params?: {
        page?: number;
        limit?: number;
        search?: string;
        production_type?: ProductionType[];
        certified?: boolean;
        region?: string;
        rating_min?: number;
        sort_by?: 'rating' | 'name' | 'date';
        sort_order?: 'asc' | 'desc';
    }): Promise<{
        producers: ProducerProfile[];
        total: number;
        pages: number;
        current_page: number;
    }> {
        const response = await api.get('/producer-profiles/producers/verified', { params });
        return response.data;
    },

    // ============================================
    // DOCUMENTS & VÉRIFICATION
    // ============================================

    /**
     * Télécharger un document
     * POST /api/v1/producer-profiles/producers/documents
     */
    async uploadDocument(documentData: ProducerDocumentUpload): Promise<ProducerDocument> {
        const formData = new FormData();
        formData.append('type', documentData.type);
        formData.append('file', documentData.file);

        if (documentData.expires_at) {
            formData.append('expires_at', documentData.expires_at);
        }

        const response = await api.post('/producer-profiles/producers/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Obtenir tous mes documents
     * GET /api/v1/producer-profiles/producers/documents
     */
    async getDocuments(): Promise<ProducerDocument[]> {
        const response = await api.get('/producer-profiles/producers/documents');
        return response.data;
    },

    /**
     * Supprimer un document
     * DELETE /api/v1/producer-profiles/producers/documents/{id}
     */
    async deleteDocument(documentId: string): Promise<void> {
        await api.delete(`/producer-profiles/producers/documents/${documentId}`);
    },

    /**
     * Soumettre pour vérification
     * POST /api/v1/producer-profiles/producers/verification/submit
     */
    async submitForVerification(): Promise<{ message: string; status: string }> {
        const response = await api.post('/producer-profiles/producers/verification/submit');
        return response.data;
    },

    /**
     * Obtenir le statut de vérification
     * GET /api/v1/producer-profiles/producers/verification/status
     */
    async getVerificationStatus(): Promise<{
        status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
        message?: string;
        reviewed_at?: Date;
        reviewer_notes?: string;
    }> {
        const response = await api.get('/producer-profiles/producers/verification/status');
        return response.data;
    },

    // ============================================
    // POINTS DE RETRAIT
    // ============================================

    /**
     * Créer un point de retrait
     * POST /api/v1/producer-profiles/producers/pickup-points
     */
    async createPickupPoint(pickupPointData: PickupPointCreate): Promise<PickupPoint> {
        const response = await api.post('/producer-profiles/producers/pickup-points', pickupPointData);
        return response.data;
    },

    /**
     * Obtenir tous mes points de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points
     */
    async getPickupPoints(): Promise<PickupPoint[]> {
        const response = await api.get('/producer-profiles/producers/pickup-points');
        return response.data;
    },

    /**
     * Obtenir un point de retrait spécifique
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}
     */
    async getPickupPoint(pointId: string): Promise<PickupPoint> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}`);
        return response.data;
    },

    /**
     * Mettre à jour un point de retrait
     * PUT /api/v1/producer-profiles/producers/pickup-points/{point_id}
     */
    async updatePickupPoint(pointId: string, updateData: any): Promise<PickupPoint> {
        const response = await api.put(`/producer-profiles/producers/pickup-points/${pointId}`, updateData);
        return response.data;
    },

    /**
     * Supprimer un point de retrait
     * DELETE /api/v1/producer-profiles/producers/pickup-points/{point_id}
     */
    async deletePickupPoint(pointId: string): Promise<void> {
        await api.delete(`/producer-profiles/producers/pickup-points/${pointId}`);
    },

    /**
     * Activer/Désactiver un point de retrait
     * PATCH /api/v1/producer-profiles/producers/pickup-points/{point_id}/toggle
     */
    async togglePickupPoint(pointId: string, isActive: boolean): Promise<PickupPoint> {
        const response = await api.patch(`/producer-profiles/producers/pickup-points/${pointId}/toggle`, { is_active: isActive });
        return response.data;
    },

    // ============================================
    // CRÉNEAUX DE RETRAIT
    // ============================================

    /**
     * Créer un créneau de retrait
     * POST /api/v1/producer-profiles/producers/pickup-points/{point_id}/slots
     */
    async createPickupSlot(pointId: string, slotData: PickupSlotCreate): Promise<PickupSlot> {
        const response = await api.post(`/producer-profiles/producers/pickup-points/${pointId}/slots`, slotData);
        return response.data;
    },

    /**
     * Obtenir les créneaux d'un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/slots
     */
    async getPickupSlots(pointId: string, params?: {
        date_from?: string;
        date_to?: string;
        day_of_week?: number;
        only_available?: boolean;
    }): Promise<PickupSlot[]> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}/slots`, { params });
        return response.data;
    },

    /**
     * Obtenir les créneaux disponibles pour un jour
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/slots/available
     */
    async getAvailableSlots(
        pointId: string,
        date: string,
        params?: {
            time_from?: string;
            time_to?: string;
        }
    ): Promise<PickupSlot[]> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}/slots/available`, {
            params: { date, ...params }
        });
        return response.data;
    },

    /**
     * Mettre à jour un créneau
     * PUT /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async updatePickupSlot(slotId: string, updateData: Partial<PickupSlot>): Promise<PickupSlot> {
        const response = await api.put(`/producer-profiles/producers/pickup-slots/${slotId}`, updateData);
        return response.data;
    },

    /**
     * Supprimer un créneau
     * DELETE /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async deletePickupSlot(slotId: string): Promise<void> {
        await api.delete(`/producer-profiles/producers/pickup-slots/${slotId}`);
    },

    // ============================================
    // HORAIRES D'OUVERTURE
    // ============================================

    /**
     * Obtenir mes horaires d'ouverture
     * GET /api/v1/producer-profiles/producers/schedule
     */
    async getSchedule(): Promise<ProducerSchedule[]> {
        const response = await api.get('/producer-profiles/producers/schedule');
        return response.data;
    },

    /**
     * Mettre à jour mes horaires d'ouverture
     * PUT /api/v1/producer-profiles/producers/schedule
     */
    async updateSchedule(scheduleData: ProducerScheduleUpdate[]): Promise<ProducerSchedule[]> {
        const response = await api.put('/producer-profiles/producers/schedule', scheduleData);
        return response.data;
    },

    /**
     * Obtenir les exceptions d'horaires (fermetures exceptionnelles)
     * GET /api/v1/producer-profiles/producers/schedule/exceptions
     */
    async getScheduleExceptions(params?: {
        date_from?: string;
        date_to?: string;
    }): Promise<Array<{
        id: string;
        date: string;
        reason: string;
        is_closed: boolean;
        special_hours?: { open_time: string; close_time: string };
    }>> {
        const response = await api.get('/producer-profiles/producers/schedule/exceptions', { params });
        return response.data;
    },

    /**
     * Ajouter une exception d'horaire
     * POST /api/v1/producer-profiles/producers/schedule/exceptions
     */
    async addScheduleException(exceptionData: {
        date: string;
        reason: string;
        is_closed: boolean;
        special_hours?: { open_time: string; close_time: string };
    }): Promise<any> {
        const response = await api.post('/producer-profiles/producers/schedule/exceptions', exceptionData);
        return response.data;
    },

    // ============================================
    // STATISTIQUES & ANALYTIQUES
    // ============================================

    /**
     * Obtenir les statistiques du producteur
     * GET /api/v1/producer-profiles/producers/stats
     */
    async getStats(): Promise<{
        total_orders: number;
        total_revenue: number;
        average_rating: number;
        total_products: number;
        orders_this_month: number;
        revenue_this_month: number;
        pickup_points_count: number;
        active_pickup_points: number;
    }> {
        const response = await api.get('/producer-profiles/producers/stats');
        return response.data;
    },

    /**
     * Obtenir les performances mensuelles
     * GET /api/v1/producer-profiles/producers/stats/monthly
     */
    async getMonthlyStats(params?: {
        year?: number;
        month?: number;
    }): Promise<Array<{
        date: string;
        orders_count: number;
        total_revenue: number;
        average_order_value: number;
    }>> {
        const response = await api.get('/producer-profiles/producers/stats/monthly', { params });
        return response.data;
    },

    // ============================================
    // PRÉFÉRENCES & PARAMÈTRES
    // ============================================

    /**
     * Mettre à jour les préférences de notification
     * PUT /api/v1/producer-profiles/producers/preferences/notifications
     */
    async updateNotificationPreferences(preferences: {
        email_notifications: boolean;
        push_notifications: boolean;
        order_updates: boolean;
        new_messages: boolean;
        low_stock_alerts: boolean;
        weekly_report: boolean;
    }): Promise<void> {
        await api.put('/producer-profiles/producers/preferences/notifications', preferences);
    },

    /**
     * Mettre à jour les paramètres de paiement
     * PUT /api/v1/producer-profiles/producers/payment-settings
     */
    async updatePaymentSettings(settings: {
        iban?: string;
        bic?: string;
        payout_frequency: 'weekly' | 'bi-weekly' | 'monthly';
        auto_payout: boolean;
        minimum_payout_amount: number;
    }): Promise<void> {
        await api.put('/producer-profiles/producers/payment-settings', settings);
    },

    // ============================================
    // UTILITAIRES
    // ============================================

    /**
     * Vérifier la disponibilité d'un SIRET
     * GET /api/v1/producer-profiles/producers/check-siret
     */
    async checkSiretAvailability(siret: string): Promise<{
        available: boolean;
        message?: string;
    }> {
        const response = await api.get('/producer-profiles/producers/check-siret', {
            params: { siret }
        });
        return response.data;
    },

    /**
     * Valider un numéro de TVA
     * GET /api/v1/producer-profiles/producers/validate-vat
     */
    async validateVatNumber(vatNumber: string): Promise<{
        valid: boolean;
        company_name?: string;
        address?: string;
    }> {
        const response = await api.get('/producer-profiles/producers/validate-vat', {
            params: { vat_number: vatNumber }
        });
        return response.data;
    },

    /**
     * Rechercher des coordonnées géographiques
     * GET /api/v1/producer-profiles/producers/geocode
     */
    async geocodeAddress(address: string): Promise<{
        lat: number;
        lng: number;
        formatted_address: string;
        street: string;
        city: string;
        postal_code: string;
        country: string;
    }> {
        const response = await api.get('/producer-profiles/producers/geocode', {
            params: { address }
        });
        return response.data;
    }
};