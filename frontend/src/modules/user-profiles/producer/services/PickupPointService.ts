import api from '@/shared/services/api';
import type {
    PickupPoint,
    PickupPointCreate,
    UpdatePickupPointRequest,
    PickupSlot,
    PickupSlotCreate,
    PickupSlotUpdate,
    AvailableSlot,
    PickupSchedule,
    PickupException,
    PickupAnalytics,
    PickupPointWithSlots,
    Coordinates
} from '../types';

export const PickupPointService = {
    // ============================================
    // GESTION DES POINTS DE RETRAIT
    // ============================================

    /**
     * Créer un nouveau point de retrait
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
    async getPickupPoints(params?: {
        is_active?: boolean;
        has_slots?: boolean;
        include_slots?: boolean;
        page?: number;
        limit?: number;
        sort_by?: 'name' | 'created_at' | 'order_count';
        sort_order?: 'asc' | 'desc';
    }): Promise<{
        pickup_points: PickupPoint[];
        total: number;
        pages: number;
        current_page: number;
    }> {
        const response = await api.get('/producer-profiles/producers/pickup-points', { params });
        const data = response.data;

        if (Array.isArray(data)) {
            return {
                pickup_points: data as PickupPoint[],
                total: data.length,
                pages: 1,
                current_page: 1
            };
        }

        const pickupPoints = Array.isArray(data?.pickup_points) ? data.pickup_points as PickupPoint[] : [];
        return {
            pickup_points: pickupPoints,
            total: Number(data?.total ?? pickupPoints.length),
            pages: Number(data?.pages ?? 1),
            current_page: Number(data?.current_page ?? 1)
        };
    },

    /**
     * Obtenir un point de retrait spécifique
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}
     */
    async getPickupPoint(
        pointId: string,
        params?: {
            include_slots?: boolean;
            include_schedule?: boolean;
            include_analytics?: boolean;
        }
    ): Promise<PickupPointWithSlots> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}`, { params });
        return response.data;
    },

    /**
     * Mettre à jour un point de retrait
     * PUT /api/v1/producer-profiles/producers/pickup-points/{point_id}
     */
    async updatePickupPoint(
        pointId: string,
        updateData: UpdatePickupPointRequest
    ): Promise<PickupPoint> {
        const response = await api.put(`/producer-profiles/producers/pickup-points/${pointId}`, updateData);
        return response.data;
    },

    /**
     * Supprimer un point de retrait
     * DELETE /api/v1/producer-profiles/producers/pickup-points/{point_id}
     */
    async deletePickupPoint(pointId: string): Promise<{ message: string }> {
        const response = await api.delete(`/producer-profiles/producers/pickup-points/${pointId}`);
        return response.data;
    },

    /**
     * Activer/désactiver un point de retrait
     * PATCH /api/v1/producer-profiles/producers/pickup-points/{point_id}/toggle
     */
    async togglePickupPoint(pointId: string, isActive: boolean): Promise<PickupPoint> {
        try {
            const response = await api.patch(`/producer-profiles/producers/pickup-points/${pointId}/toggle`, {
                is_active: isActive
            });
            return response.data;
        } catch (error: any) {
            const status = Number(error?.response?.status || 0);

            // Fallback MVP: endpoint /toggle parfois indisponible côté backend.
            if (status === 404 || status === 405) {
                const response = await api.put(`/producer-profiles/producers/pickup-points/${pointId}`, {
                    is_active: isActive
                });
                return response.data;
            }

            throw error;
        }
    },

    /**
     * Dupliquer un point de retrait
     * POST /api/v1/producer-profiles/producers/pickup-points/{point_id}/duplicate
     */
    async duplicatePickupPoint(pointId: string, newName?: string): Promise<PickupPoint> {
        const response = await api.post(`/producer-profiles/producers/pickup-points/${pointId}/duplicate`, {
            new_name: newName
        });
        return response.data;
    },

    /**
     * Obtenir les statistiques d'un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/stats
     */
    async getPickupPointStats(pointId: string): Promise<PickupAnalytics> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}/stats`);
        return response.data;
    },

    // ============================================
    // GESTION DES CRÉNEAUX DE RETRAIT
    // ============================================

    /**
     * Créer un créneau de retrait
     * POST /api/v1/producer-profiles/producers/pickup-points/{point_id}/slots
     */
    async createPickupSlot(
        pointId: string,
        slotData: PickupSlotCreate
    ): Promise<PickupSlot> {
        const response = await api.post(`/producer-profiles/producers/pickup-points/${pointId}/slots`, slotData);
        return response.data;
    },

    /**
     * Créer plusieurs créneaux en une seule fois
     * POST /api/v1/producer-profiles/producers/pickup-points/{point_id}/slots/batch
     */
    async createPickupSlotsBatch(
        pointId: string,
        slotsData: PickupSlotCreate[]
    ): Promise<PickupSlot[]> {
        const response = await api.post(`/producer-profiles/producers/pickup-points/${pointId}/slots/batch`, {
            slots: slotsData
        });
        return response.data;
    },

    /**
     * Obtenir tous les créneaux d'un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/slots
     */
    async getPickupSlots(
        pointId: string,
        params?: {
            date_from?: string;
            date_to?: string;
            day_of_week?: number;
            is_active?: boolean;
            is_recurring?: boolean;
            include_past?: boolean;
            page?: number;
            limit?: number;
        }
    ): Promise<{
        slots: PickupSlot[];
        total: number;
        pages: number;
        current_page: number;
    }> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}/slots`, { params });
        const data = response.data;

        if (Array.isArray(data)) {
            return {
                slots: data as PickupSlot[],
                total: data.length,
                pages: 1,
                current_page: 1
            };
        }

        const slots = Array.isArray(data?.slots) ? (data.slots as PickupSlot[]) : [];
        return {
            slots,
            total: Number(data?.total ?? slots.length),
            pages: Number(data?.pages ?? 1),
            current_page: Number(data?.current_page ?? 1)
        };
    },

    /**
     * Obtenir un créneau spécifique
     * GET /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async getPickupSlot(slotId: string): Promise<PickupSlot> {
        const response = await api.get(`/producer-profiles/producers/pickup-slots/${slotId}`);
        return response.data;
    },

    /**
     * Mettre à jour un créneau
     * PUT /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async updatePickupSlot(
        slotId: string,
        updateData: PickupSlotUpdate
    ): Promise<PickupSlot> {
        const response = await api.put(`/producer-profiles/producers/pickup-slots/${slotId}`, updateData);
        return response.data;
    },

    /**
     * Supprimer un créneau
     * DELETE /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async deletePickupSlot(slotId: string): Promise<{ message: string }> {
        const response = await api.delete(`/producer-profiles/producers/pickup-slots/${slotId}`);
        return response.data;
    },

    /**
     * Supprimer plusieurs créneaux
     * DELETE /api/v1/producer-profiles/producers/pickup-points/{point_id}/slots/batch
     */
    async deletePickupSlotsBatch(
        pointId: string,
        slotIds: string[]
    ): Promise<{ message: string; deleted_count: number }> {
        const response = await api.delete(`/producer-profiles/producers/pickup-points/${pointId}/slots/batch`, {
            data: { slot_ids: slotIds }
        });
        return response.data;
    },

    /**
     * Activer/désactiver un créneau
     * PATCH /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/toggle
     */
    async togglePickupSlot(slotId: string, isActive: boolean): Promise<PickupSlot> {
        const response = await api.patch(`/producer-profiles/producers/pickup-slots/${slotId}/toggle`, {
            is_active: isActive
        });
        return response.data;
    },

    /**
     * Mettre à jour la capacité d'un créneau
     * PATCH /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/capacity
     */
    async updateSlotCapacity(
        slotId: string,
        maxOrders: number
    ): Promise<PickupSlot> {
        const response = await api.patch(`/producer-profiles/producers/pickup-slots/${slotId}/capacity`, {
            max_orders: maxOrders
        });
        return response.data;
    },

    // ============================================
    // CRÉNEAUX DISPONIBLES (PUBLIC)
    // ============================================

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
            min_capacity?: number;
            include_full?: boolean;
        }
    ): Promise<AvailableSlot[]> {
        const response = await api.get(
            `/producer-profiles/producers/pickup-points/${pointId}/slots/available`,
            { params: { date, ...params } }
        );
        return response.data;
    },

    /**
     * Vérifier la disponibilité d'un créneau spécifique
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/check-availability
     */
    async checkSlotAvailability(
        slotId: string,
        requestedOrders?: number
    ): Promise<{
        available: boolean;
        available_capacity: number;
        is_full: boolean;
        next_available_slot?: AvailableSlot;
    }> {
        const response = await api.post(`/producer-profiles/producers/pickup-slots/${slotId}/check-availability`, {
            requested_orders: requestedOrders
        });
        return response.data;
    },

    /**
     * Réserver des places dans un créneau
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/reserve
     */
    async reserveSlotCapacity(
        slotId: string,
        orderCount: number
    ): Promise<{
        success: boolean;
        reserved_count: number;
        new_current_orders: number;
        slot: PickupSlot;
    }> {
        const response = await api.post(`/producer-profiles/producers/pickup-slots/${slotId}/reserve`, {
            order_count: orderCount
        });
        return response.data;
    },

    /**
     * Libérer des places réservées
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/release
     */
    async releaseSlotCapacity(
        slotId: string,
        orderCount: number
    ): Promise<{
        success: boolean;
        released_count: number;
        new_current_orders: number;
    }> {
        const response = await api.post(`/producer-profiles/producers/pickup-slots/${slotId}/release`, {
            order_count: orderCount
        });
        return response.data;
    },

    // ============================================
    // GESTION DES HORAIRES RÉCURRENTS
    // ============================================

    /**
     * Définir des horaires récurrents pour un point de retrait
     * POST /api/v1/producer-profiles/producers/pickup-points/{point_id}/schedule
     */
    async setPickupSchedule(
        pointId: string,
        schedule: PickupSchedule[]
    ): Promise<PickupSchedule[]> {
        const response = await api.post(`/producer-profiles/producers/pickup-points/${pointId}/schedule`, {
            schedule
        });
        return response.data;
    },

    /**
     * Obtenir les horaires récurrents d'un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/schedule
     */
    async getPickupSchedule(pointId: string): Promise<PickupSchedule[]> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}/schedule`);
        return response.data;
    },

    /**
     * Générer des créneaux à partir des horaires récurrents
     * POST /api/v1/producer-profiles/producers/pickup-points/{point_id}/generate-slots
     */
    async generateSlotsFromSchedule(
        pointId: string,
        params: {
            start_date: string;
            end_date: string;
            clear_existing?: boolean;
            skip_weekends?: boolean;
            skip_holidays?: boolean;
        }
    ): Promise<{
        generated_count: number;
        slots: PickupSlot[];
    }> {
        const response = await api.post(
            `/producer-profiles/producers/pickup-points/${pointId}/generate-slots`,
            params
        );
        return response.data;
    },

    // ============================================
    // EXCEPTIONS ET FERMETURES
    // ============================================

    /**
     * Ajouter une exception (fermeture ou horaires spéciaux)
     * POST /api/v1/producer-profiles/producers/pickup-points/{point_id}/exceptions
     */
    async addPickupException(
        pointId: string,
        exception: PickupException
    ): Promise<PickupException> {
        const response = await api.post(
            `/producer-profiles/producers/pickup-points/${pointId}/exceptions`,
            exception
        );
        return response.data;
    },

    /**
     * Obtenir les exceptions d'un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/exceptions
     */
    async getPickupExceptions(
        pointId: string,
        params?: {
            date_from?: string;
            date_to?: string;
            is_closed?: boolean;
        }
    ): Promise<PickupException[]> {
        const response = await api.get(
            `/producer-profiles/producers/pickup-points/${pointId}/exceptions`,
            { params }
        );
        return response.data;
    },

    /**
     * Supprimer une exception
     * DELETE /api/v1/producer-profiles/producers/pickup-points/{point_id}/exceptions/{exception_id}
     */
    async deletePickupException(
        pointId: string,
        exceptionId: string
    ): Promise<{ message: string }> {
        const response = await api.delete(
            `/producer-profiles/producers/pickup-points/${pointId}/exceptions/${exceptionId}`
        );
        return response.data;
    },

    // ============================================
    // GÉOLOCALISATION ET DISTANCE
    // ============================================

    /**
     * Calculer la distance entre deux points
     * GET /api/v1/producer-profiles/producers/pickup-points/distance
     */
    async calculateDistance(
        origin: Coordinates,
        destination: Coordinates
    ): Promise<{
        distance_km: number;
        distance_miles: number;
        duration_minutes: number;
        polyline?: string;
    }> {
        const response = await api.get('/producer-profiles/producers/pickup-points/distance', {
            params: {
                origin_lat: origin.latitude,
                origin_lng: origin.longitude,
                dest_lat: destination.latitude,
                dest_lng: destination.longitude
            }
        });
        return response.data;
    },

    /**
     * Rechercher des points de retrait par rayon
     * GET /api/v1/producer-profiles/producers/pickup-points/nearby
     */
    async getNearbyPickupPoints(
        coordinates: Coordinates,
        radiusKm: number,
        params?: {
            is_active?: boolean;
            has_available_slots?: boolean;
            min_rating?: number;
            limit?: number;
        }
    ): Promise<PickupPoint[]> {
        const response = await api.get('/producer-profiles/producers/pickup-points/nearby', {
            params: {
                lat: coordinates.latitude,
                lng: coordinates.longitude,
                radius_km: radiusKm,
                ...params
            }
        });
        return response.data;
    },

    // ============================================
    // ANALYTIQUES ET STATISTIQUES
    // ============================================

    /**
     * Obtenir les statistiques de tous les points de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/analytics
     */
    async getPickupPointsAnalytics(params?: {
        date_from?: string;
        date_to?: string;
        group_by?: 'day' | 'week' | 'month' | 'pickup_point';
    }): Promise<PickupAnalytics> {
        const response = await api.get('/producer-profiles/producers/pickup-points/analytics', { params });
        return response.data;
    },

    /**
     * Obtenir le taux d'occupation des créneaux
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/occupancy
     */
    async getSlotOccupancy(
        pointId: string,
        params?: {
            date_from?: string;
            date_to?: string;
            group_by?: 'day' | 'hour' | 'slot';
        }
    ): Promise<{
        average_occupancy: number;
        peak_hours: Array<{
            hour: string;
            occupancy_rate: number;
            total_slots: number;
            used_slots: number;
        }>;
        daily_occupancy: Array<{
            date: string;
            occupancy_rate: number;
            total_capacity: number;
            used_capacity: number;
        }>;
    }> {
        const response = await api.get(
            `/producer-profiles/producers/pickup-points/${pointId}/occupancy`,
            { params }
        );
        return response.data;
    },

    /**
     * Obtenir les prévisions d'occupation
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/forecast
     */
    async getOccupancyForecast(
        pointId: string,
        daysAhead: number = 7
    ): Promise<Array<{
        date: string;
        predicted_occupancy: number;
        confidence_level: 'low' | 'medium' | 'high';
        recommended_action?: 'add_slots' | 'reduce_capacity' | 'maintain';
    }>> {
        const response = await api.get(
            `/producer-profiles/producers/pickup-points/${pointId}/forecast`,
            { params: { days_ahead: daysAhead } }
        );
        return response.data;
    },

    // ============================================
    // GESTION DES COMMANDES PAR CRÉNEAU
    // ============================================

    /**
     * Obtenir les commandes pour un créneau
     * GET /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/orders
     */
    async getSlotOrders(
        slotId: string,
        params?: {
            status?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<{
        orders: Array<{
            id: string;
            customer_name: string;
            total_amount: number;
            status: string;
            pickup_time: string;
        }>;
        total: number;
        pages: number;
    }> {
        const response = await api.get(`/producer-profiles/producers/pickup-slots/${slotId}/orders`, { params });
        return response.data;
    },

    /**
     * Exporter la liste des commandes pour un créneau
     * GET /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/orders/export
     */
    async exportSlotOrders(
        slotId: string,
        format: 'csv' | 'excel' | 'pdf'
    ): Promise<Blob> {
        const response = await api.get(
            `/producer-profiles/producers/pickup-slots/${slotId}/orders/export`,
            {
                params: { format },
                responseType: 'blob'
            }
        );
        return response.data;
    },

    // ============================================
    // UTILITAIRES ET OUTILS
    // ============================================

    /**
     * Valider l'adresse d'un point de retrait
     * POST /api/v1/producer-profiles/producers/pickup-points/validate-address
     */
    async validateAddress(address: {
        street: string;
        city: string;
        postal_code: string;
        country: string;
    }): Promise<{
        valid: boolean;
        normalized_address?: string;
        coordinates?: Coordinates;
        suggestions?: Array<{
            street: string;
            city: string;
            postal_code: string;
            country: string;
        }>;
    }> {
        const response = await api.post('/producer-profiles/producers/pickup-points/validate-address', address);
        return response.data;
    },

    /**
     * Générer un QR code pour un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/qrcode
     */
    async generateQRCode(
        pointId: string,
        params?: {
            size?: number;
            format?: 'png' | 'svg' | 'pdf';
        }
    ): Promise<{ qr_code_url: string; expires_at: string }> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}/qrcode`, { params });
        return response.data;
    },

    /**
     * Obtenir les journaux d'activité d'un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-points/{point_id}/logs
     */
    async getPickupPointLogs(
        pointId: string,
        params?: {
            action?: string;
            date_from?: string;
            date_to?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<{
        logs: Array<{
            id: string;
            action: string;
            performed_by: string;
            performed_at: string;
            details: Record<string, any>;
            ip_address?: string;
        }>;
        total: number;
        pages: number;
    }> {
        const response = await api.get(`/producer-profiles/producers/pickup-points/${pointId}/logs`, { params });
        return response.data;
    },

    /**
     * Synchroniser les points de retrait avec un calendrier externe
     * POST /api/v1/producer-profiles/producers/pickup-points/sync-calendar
     */
    async syncWithCalendar(
        calendarType: 'google' | 'outlook' | 'ical',
        calendarId?: string
    ): Promise<{
        success: boolean;
        synced_count: number;
        next_sync_token?: string;
    }> {
        const response = await api.post('/producer-profiles/producers/pickup-points/sync-calendar', {
            calendar_type: calendarType,
            calendar_id: calendarId
        });
        return response.data;
    }
};

// Helper functions
export const PickupPointHelpers = {
    /**
     * Formater les horaires pour l'affichage
     */
    formatSchedule(schedule: PickupSchedule[]): string {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return schedule
            .map(s => `${days[s.day_of_week]}: ${s.start_time} - ${s.end_time}`)
            .join('\n');
    },

    /**
     * Vérifier si un point est ouvert à une date/heure donnée
     */
    isPointOpenAt(
        point: PickupPointWithSlots,
        dateTime: Date
    ): { open: boolean; nextOpening?: string; reason?: string } {
        const dayOfWeek = dateTime.getDay();
        const timeStr = dateTime.toTimeString().slice(0, 5); // HH:mm

        // Vérifier les exceptions d'abord
        const exception = point.exceptions?.find((e: any) => e.date === dateTime.toISOString().split('T')[0]);
        if (exception) {
            if (exception.is_closed) {
                return { open: false, reason: exception.reason || 'Fermeture exceptionnelle' };
            }
            if (exception.alternative_hours) {
                const isOpen = timeStr >= exception.alternative_hours.start_time && timeStr <= exception.alternative_hours.end_time;
                return {
                    open: isOpen,
                    nextOpening: !isOpen ? exception.alternative_hours.start_time : undefined
                };
            }
        }

        // Vérifier le planning régulier
        const daySchedule = point.schedule?.find((s: any) => s.day_of_week === dayOfWeek);
        if (!daySchedule) {
            return { open: false, reason: 'Fermé ce jour' };
        }

        const isOpen = timeStr >= daySchedule.open_time && timeStr <= daySchedule.close_time;

        // Vérifier la pause
        if (daySchedule.break_start && daySchedule.break_end) {
            const isBreak = timeStr >= daySchedule.break_start && timeStr <= daySchedule.break_end;
            if (isBreak) {
                return { open: false, reason: 'Pause déjeuner', nextOpening: daySchedule.break_end };
            }
        }

        return {
            open: isOpen,
            nextOpening: !isOpen ? daySchedule.open_time : undefined
        };
    },

    /**
     * Calculer la capacité totale disponible pour une période
     */
    calculateAvailableCapacity(
        slots: PickupSlot[],
        dateFrom: Date,
        dateTo: Date
    ): number {
        return slots.reduce((total, slot) => {
            const slotDate = slot.date ? new Date(slot.date) : null;
            if (slotDate && slotDate >= dateFrom && slotDate <= dateTo && slot.is_active) {
                return total + (slot.capacity.max_orders - slot.bookings.current_orders);
            }
            return total;
        }, 0);
    },

    /**
     * Générer un identifiant unique pour les créneaux
     */
    generateSlotId(pointId: string, date: string, startTime: string): string {
        return `${pointId}_${date.replace(/-/g, '')}_${startTime.replace(/:/g, '')}`;
    }
};
