import api from '@/shared/services/api';
import type {
    PickupSlot,
    PickupSlotCreate,
    PickupSlotUpdate,
    PickupSlotBulkCreate,
    PickupSlotBulkUpdate,
    AvailableSlot,
    SlotReservation,
    SlotOccupancy,
    SlotValidationResult,
    SlotConflict,
    RecurrencePattern
} from '../types';

export const PickupSlotService = {
    // ============================================
    // CRÉATION ET GESTION DES CRÉNEAUX
    // ============================================

    /**
     * Créer un nouveau créneau
     * POST /api/v1/producer-profiles/producers/pickup-slots
     */
    async createSlot(slotData: PickupSlotCreate): Promise<PickupSlot> {
        const response = await api.post('/producer-profiles/producers/pickup-slots', slotData);
        return response.data;
    },

    /**
     * Créer plusieurs créneaux en une seule requête
     * POST /api/v1/producer-profiles/producers/pickup-slots/batch
     */
    async createSlotsBatch(slotsData: PickupSlotBulkCreate): Promise<{
        created: PickupSlot[];
        failed: Array<{ data: Record<string, unknown>; error: string }>;
        total_created: number;
        total_failed: number;
    }> {
        const response = await api.post('/producer-profiles/producers/pickup-slots/batch', slotsData);
        return response.data;
    },

    /**
     * Générer des créneaux récurrents selon un motif
     * POST /api/v1/producer-profiles/producers/pickup-slots/generate-recurring
     */
    async generateRecurringSlots(
        pickupPointId: string,
        pattern: SlotRecurrencePattern
    ): Promise<{
        generated_count: number;
        slots: PickupSlot[];
    }> {
        const response = await api.post(
            '/producer-profiles/producers/pickup-slots/generate-recurring',
            {
                pickup_point_id: pickupPointId,
                ...pattern
            }
        );
        return response.data;
    },

    /**
     * Dupliquer un créneau pour d'autres jours
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/duplicate
     */
    async duplicateSlot(
        slotId: string,
        dates: string[],
        overrideData?: Partial<PickupSlotCreate>
    ): Promise<PickupSlot[]> {
        const response = await api.post(`/producer-profiles/producers/pickup-slots/${slotId}/duplicate`, {
            dates,
            override_data: overrideData
        });
        return response.data;
    },

    // ============================================
    // LECTURE ET RECHERCHE DES CRÉNEAUX
    // ============================================

    /**
     * Obtenir un créneau par son ID
     * GET /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async getSlot(slotId: string): Promise<PickupSlot> {
        const response = await api.get(`/producer-profiles/producers/pickup-slots/${slotId}`);
        return response.data;
    },

    /**
     * Obtenir les créneaux avec filtres avancés
     * GET /api/v1/producer-profiles/producers/pickup-slots
     */
    async getSlots(params?: {
        pickup_point_id?: string;
        producer_id?: string;
        date_from?: string;
        date_to?: string;
        day_of_week?: number | number[];
        time_from?: string;
        time_to?: string;
        is_active?: boolean;
        is_recurring?: boolean;
        has_capacity?: boolean;
        min_capacity?: number;
        status?: 'available' | 'full' | 'closed';
        include_past?: boolean;
        page?: number;
        limit?: number;
        sort_by?: 'date' | 'start_time' | 'capacity' | 'occupancy';
        sort_order?: 'asc' | 'desc';
    }): Promise<{
        slots: PickupSlot[];
        total: number;
        pages: number;
        current_page: number;
        summary: {
            total_slots: number;
            available_slots: number;
            average_occupancy: number;
            peak_day?: string;
        };
    }> {
        const response = await api.get('/producer-profiles/producers/pickup-slots', { params });
        return response.data;
    },

    /**
     * Rechercher des créneaux par texte
     * GET /api/v1/producer-profiles/producers/pickup-slots/search
     */
    async searchSlots(searchParams: {
        query: string;
        pickup_point_id?: string;
        date_from?: string;
        date_to?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        slots: PickupSlot[];
        total: number;
        pages: number;
    }> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/search', {
            params: searchParams
        });
        return response.data;
    },

    /**
     * Obtenir les créneaux pour un calendrier (format iCal)
     * GET /api/v1/producer-profiles/producers/pickup-slots/calendar
     */
    async getCalendarSlots(params?: {
        pickup_point_id?: string;
        date_from?: string;
        date_to?: string;
        format?: 'json' | 'ical';
    }): Promise<any> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/calendar', {
            params,
            headers: params?.format === 'ical' ? { Accept: 'text/calendar' } : {}
        });

        if (params?.format === 'ical') {
            return response.data; // Retourne le texte iCal
        }
        return response.data;
    },

    // ============================================
    // MISE À JOUR DES CRÉNEAUX
    // ============================================

    /**
     * Mettre à jour un créneau
     * PUT /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async updateSlot(slotId: string, updateData: PickupSlotUpdate): Promise<PickupSlot> {
        const response = await api.put(`/producer-profiles/producers/pickup-slots/${slotId}`, updateData);
        return response.data;
    },

    /**
     * Mettre à jour plusieurs créneaux en une seule requête
     * PUT /api/v1/producer-profiles/producers/pickup-slots/batch
     */
    async updateSlotsBatch(updates: PickupSlotBulkUpdate): Promise<{
        updated: PickupSlot[];
        failed: Array<{ slot_id: string; error: string }>;
        total_updated: number;
        total_failed: number;
    }> {
        const response = await api.put('/producer-profiles/producers/pickup-slots/batch', updates);
        return response.data;
    },

    /**
     * Activer/désactiver un créneau
     * PATCH /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/toggle
     */
    async toggleSlot(slotId: string, isActive: boolean): Promise<PickupSlot> {
        const response = await api.patch(`/producer-profiles/producers/pickup-slots/${slotId}/toggle`, {
            is_active: isActive
        });
        return response.data;
    },

    /**
     * Mettre à jour la capacité d'un créneau
     * PATCH /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/capacity
     */
    async updateCapacity(
        slotId: string,
        maxOrders: number,
        keepExistingOrders: boolean = true
    ): Promise<PickupSlot> {
        const response = await api.patch(`/producer-profiles/producers/pickup-slots/${slotId}/capacity`, {
            max_orders: maxOrders,
            keep_existing_orders: keepExistingOrders
        });
        return response.data;
    },

    /**
     * Déplacer un créneau (changer la date/heure)
     * PATCH /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/move
     */
    async moveSlot(
        slotId: string,
        newDate: string,
        newStartTime?: string,
        newEndTime?: string
    ): Promise<PickupSlot> {
        const response = await api.patch(`/producer-profiles/producers/pickup-slots/${slotId}/move`, {
            new_date: newDate,
            new_start_time: newStartTime,
            new_end_time: newEndTime
        });
        return response.data;
    },

    // ============================================
    // SUPPRESSION DES CRÉNEAUX
    // ============================================

    /**
     * Supprimer un créneau
     * DELETE /api/v1/producer-profiles/producers/pickup-slots/{slot_id}
     */
    async deleteSlot(slotId: string): Promise<{ message: string }> {
        const response = await api.delete(`/producer-profiles/producers/pickup-slots/${slotId}`);
        return response.data;
    },

    /**
     * Supprimer plusieurs créneaux
     * DELETE /api/v1/producer-profiles/producers/pickup-slots/batch
     */
    async deleteSlotsBatch(slotIds: string[]): Promise<{
        message: string;
        deleted_count: number;
        failed_deletions: Array<{ slot_id: string; error: string }>;
    }> {
        const response = await api.delete('/producer-profiles/producers/pickup-slots/batch', {
            data: { slot_ids: slotIds }
        });
        return response.data;
    },

    /**
     * Supprimer tous les créneaux passés
     * DELETE /api/v1/producer-profiles/producers/pickup-slots/clear-past
     */
    async clearPastSlots(keepDays: number = 7): Promise<{ message: string; deleted_count: number }> {
        const response = await api.delete('/producer-profiles/producers/pickup-slots/clear-past', {
            params: { keep_days: keepDays }
        });
        return response.data;
    },

    // ============================================
    // DISPONIBILITÉ ET RÉSERVATION
    // ============================================

    /**
     * Vérifier la disponibilité d'un créneau
     * GET /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/availability
     */
    async checkAvailability(
        slotId: string,
        requestedOrders: number = 1
    ): Promise<{
        available: boolean;
        available_capacity: number;
        is_full: boolean;
        can_accommodate: boolean;
        waitlist_available?: boolean;
        next_available_slot?: AvailableSlot;
    }> {
        const response = await api.get(`/producer-profiles/producers/pickup-slots/${slotId}/availability`, {
            params: { requested_orders: requestedOrders }
        });
        return response.data;
    },

    /**
     * Obtenir les créneaux disponibles pour un point de retrait
     * GET /api/v1/producer-profiles/producers/pickup-slots/available
     */
    async getAvailableSlots(params: {
        pickup_point_id: string;
        date: string;
        min_capacity?: number;
        time_from?: string;
        time_to?: string;
        duration_minutes?: number;
        exclude_slot_ids?: string[];
    }): Promise<AvailableSlot[]> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/available', { params });
        return response.data;
    },

    /**
     * Réserver des places dans un créneau
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/reserve
     */
    async reserveSlot(
        slotId: string,
        reservationData: SlotReservation
    ): Promise<{
        success: boolean;
        reservation_id?: string;
        reserved_count: number;
        new_current_orders: number;
        expiration_time?: string;
        slot: PickupSlot;
    }> {
        const response = await api.post(
            `/producer-profiles/producers/pickup-slots/${slotId}/reserve`,
            reservationData
        );
        return response.data;
    },

    /**
     * Libérer des places réservées
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/release
     */
    async releaseReservation(
        slotId: string,
        reservationId?: string,
        orderCount?: number
    ): Promise<{
        success: boolean;
        released_count: number;
        new_current_orders: number;
        message?: string;
    }> {
        const response = await api.post(`/producer-profiles/producers/pickup-slots/${slotId}/release`, {
            reservation_id: reservationId,
            order_count: orderCount
        });
        return response.data;
    },

    /**
     * Obtenir la liste des réservations d'un créneau
     * GET /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/reservations
     */
    async getSlotReservations(
        slotId: string,
        params?: {
            status?: 'active' | 'expired' | 'cancelled';
            page?: number;
            limit?: number;
        }
    ): Promise<{
        reservations: Array<{
            id: string;
            customer_id: string;
            customer_name: string;
            order_id?: string;
            reserved_count: number;
            status: string;
            reserved_at: string;
            expires_at?: string;
        }>;
        total: number;
        pages: number;
    }> {
        const response = await api.get(`/producer-profiles/producers/pickup-slots/${slotId}/reservations`, {
            params
        });
        return response.data;
    },

    // ============================================
    // STATISTIQUES ET ANALYTIQUES
    // ============================================

    /**
     * Obtenir les statistiques d'occupation
     * GET /api/v1/producer-profiles/producers/pickup-slots/stats/occupancy
     */
    async getOccupancyStats(params?: {
        pickup_point_id?: string;
        date_from?: string;
        date_to?: string;
        group_by?: 'day' | 'hour' | 'weekday';
    }): Promise<SlotOccupancy> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/stats/occupancy', { params });
        return response.data;
    },

    /**
     * Obtenir les statistiques de performance des créneaux
     * GET /api/v1/producer-profiles/producers/pickup-slots/stats/performance
     */
    async getPerformanceStats(params?: {
        pickup_point_id?: string;
        date_from?: string;
        date_to?: string;
    }): Promise<{
        total_slots: number;
        used_slots: number;
        utilization_rate: number;
        average_occupancy: number;
        peak_occupancy: number;
        most_popular_time: string;
        revenue_per_slot: number;
        cancellations_rate: number;
    }> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/stats/performance', { params });
        return response.data;
    },

    /**
     * Obtenir les prévisions de demande
     * GET /api/v1/producer-profiles/producers/pickup-slots/forecast
     */
    async getDemandForecast(params: {
        pickup_point_id: string;
        days_ahead: number;
        confidence_level?: number;
    }): Promise<{
        date: string;
        forecasted_demand: number;
        confidence_interval: [number, number];
        recommended_capacity: number;
        risk_level: 'low' | 'medium' | 'high';
    }[]> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/forecast', { params });
        return response.data;
    },

    // ============================================
    // VALIDATION ET CONFLITS
    // ============================================

    /**
     * Valider un créneau avant création
     * POST /api/v1/producer-profiles/producers/pickup-slots/validate
     */
    async validateSlot(slotData: PickupSlotCreate): Promise<SlotValidationResult> {
        const response = await api.post('/producer-profiles/producers/pickup-slots/validate', slotData);
        return response.data;
    },

    /**
     * Vérifier les conflits de créneaux
     * POST /api/v1/producer-profiles/producers/pickup-slots/check-conflicts
     */
    async checkConflicts(slotData: PickupSlotCreate | PickupSlotCreate[]): Promise<{
        has_conflicts: boolean;
        conflicts: SlotConflict[];
        suggestions: Array<{
            alternative_time: string;
            alternative_date?: string;
            confidence: number;
        }>;
    }> {
        const response = await api.post('/producer-profiles/producers/pickup-slots/check-conflicts', {
            slots: Array.isArray(slotData) ? slotData : [slotData]
        });
        return response.data;
    },

    /**
     * Vérifier la capacité globale pour une période
     * GET /api/v1/producer-profiles/producers/pickup-slots/capacity-check
     */
    async checkOverallCapacity(params: {
        pickup_point_id: string;
        date: string;
        time_range: { start: string; end: string };
    }): Promise<{
        total_capacity: number;
        used_capacity: number;
        available_capacity: number;
        capacity_utilization: number;
        is_overloaded: boolean;
        overload_percentage?: number;
    }> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/capacity-check', { params });
        return response.data;
    },

    // ============================================
    // GESTION DES LISTES D'ATTENTE
    // ============================================

    /**
     * Ajouter un client à la liste d'attente
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/waitlist
     */
    async addToWaitlist(
        slotId: string,
        customerData: {
            customer_id: string;
            customer_name: string;
            customer_email: string;
            requested_capacity: number;
            notification_preferences?: {
                email: boolean;
                sms: boolean;
                push: boolean;
            };
        }
    ): Promise<{
        waitlist_id: string;
        position: number;
        estimated_wait_time?: string;
        notification_sent: boolean;
    }> {
        const response = await api.post(`/producer-profiles/producers/pickup-slots/${slotId}/waitlist`, customerData);
        return response.data;
    },

    /**
     * Obtenir la liste d'attente d'un créneau
     * GET /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/waitlist
     */
    async getWaitlist(slotId: string): Promise<{
        waitlist: Array<{
            id: string;
            customer_id: string;
            customer_name: string;
            position: number;
            joined_at: string;
            notified_at?: string;
            status: 'waiting' | 'notified' | 'converted' | 'cancelled';
        }>;
        total_waiting: number;
        average_wait_time: string;
    }> {
        const response = await api.get(`/producer-profiles/producers/pickup-slots/${slotId}/waitlist`);
        return response.data;
    },

    /**
     * Convertir une attente en réservation
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/waitlist/{waitlist_id}/convert
     */
    async convertWaitlistToReservation(
        slotId: string,
        waitlistId: string
    ): Promise<{
        success: boolean;
        reservation_id: string;
        waitlist_removed: boolean;
    }> {
        const response = await api.post(
            `/producer-profiles/producers/pickup-slots/${slotId}/waitlist/${waitlistId}/convert`
        );
        return response.data;
    },

    // ============================================
    // NOTIFICATIONS ET RAPPELS
    // ============================================

    /**
     * Envoyer des rappels pour un créneau
     * POST /api/v1/producer-profiles/producers/pickup-slots/{slot_id}/send-reminders
     */
    async sendReminders(
        slotId: string,
        options?: {
            hours_before?: number[];
            message_template?: string;
            include_qr_code?: boolean;
            send_to_all?: boolean;
        }
    ): Promise<{
        sent_count: number;
        failed_count: number;
        delivery_status: Array<{
            customer_id: string;
            method: string;
            status: string;
            error?: string;
        }>;
    }> {
        const response = await api.post(`/producer-profiles/producers/pickup-slots/${slotId}/send-reminders`, options);
        return response.data;
    },

    /**
     * Configurer les notifications automatiques
     * PUT /api/v1/producer-profiles/producers/pickup-slots/notification-settings
     */
    async updateNotificationSettings(settings: {
        reminder_hours_before: number[];
        capacity_alerts_threshold: number;
        notify_on_cancellation: boolean;
        notify_on_waitlist_move: boolean;
        email_notifications: boolean;
        sms_notifications: boolean;
        push_notifications: boolean;
    }): Promise<void> {
        await api.put('/producer-profiles/producers/pickup-slots/notification-settings', settings);
    },

    // ============================================
    // EXPORT ET RAPPORTS
    // ============================================

    /**
     * Exporter les créneaux
     * GET /api/v1/producer-profiles/producers/pickup-slots/export
     */
    async exportSlots(params?: {
        pickup_point_id?: string;
        date_from?: string;
        date_to?: string;
        format: 'csv' | 'excel' | 'pdf' | 'ical';
        include_details?: boolean;
    }): Promise<Blob> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Générer un rapport d'analyse des créneaux
     * GET /api/v1/producer-profiles/producers/pickup-slots/report
     */
    async generateReport(params: {
        pickup_point_id: string;
        report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
        date_from: string;
        date_to: string;
    }): Promise<{
        report_url: string;
        expires_at: string;
        report_data?: Record<string, unknown>;
    }> {
        const response = await api.get('/producer-profiles/producers/pickup-slots/report', { params });
        return response.data;
    }
};

// Types supplémentaires spécifiques aux créneaux
export interface SlotRecurrencePattern {
    start_date: string;
    end_date?: string;
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    interval?: number;
    days_of_week?: number[];
    exclude_dates?: string[];
    max_occurrences?: number;
    time_slot: {
        start_time: string;
        end_time: string;
        max_orders: number;
    };
}

// Helper functions
export const PickupSlotHelpers = {
    /**
     * Formater l'heure pour l'affichage
     */
    formatTimeRange(startTime: string, endTime: string): string {
        return `${startTime} - ${endTime}`;
    },

    /**
     * Calculer la durée en minutes
     */
    calculateDuration(startTime: string, endTime: string): number {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        return endTotal - startTotal;
    },

    /**
     * Vérifier si un créneau est complet
     */
    isSlotFull(slot: PickupSlot): boolean {
        return slot.bookings.current_orders >= slot.capacity.max_orders;
    },

    /**
     * Calculer le taux d'occupation
     */
    calculateOccupancyRate(slot: PickupSlot): number {
        if (slot.capacity.max_orders === 0) return 0;
        return (slot.bookings.current_orders / slot.capacity.max_orders) * 100;
    },

    /**
     * Vérifier si un créneau est passé
     */
    isSlotPast(slot: PickupSlot): boolean {
        if (slot.date) {
            const slotDate = new Date(slot.date);
            const slotDateTime = new Date(
                slotDate.getFullYear(),
                slotDate.getMonth(),
                slotDate.getDate(),
                ...slot.start_time.split(':').map(Number)
            );
            return slotDateTime < new Date();
        }
        return false;
    },

    /**
     * Générer un résumé de créneau pour l'affichage
     */
    getSlotSummary(slot: PickupSlot): {
        date: string;
        time: string;
        capacity: string;
        status: 'available' | 'full' | 'past' | 'inactive';
    } {
        const date = slot.date
            ? new Date(slot.date).toLocaleDateString('fr-FR')
            : `Jour ${slot.day_of_week + 1}`;

        const time = `${slot.start_time} - ${slot.end_time}`;
        const capacity = `${slot.bookings.current_orders}/${slot.capacity.max_orders}`;

        let status: 'available' | 'full' | 'past' | 'inactive' = 'available';
        if (!slot.is_active) status = 'inactive';
        else if (this.isSlotPast(slot)) status = 'past';
        else if (this.isSlotFull(slot)) status = 'full';

        return { date, time, capacity, status };
    },

    /**
     * Générer des options de créneau pour un sélecteur
     */
    generateTimeSlots(
        startTime: string,
        endTime: string,
        durationMinutes: number = 30,
        intervalMinutes: number = 15
    ): Array<{ start: string; end: string; label: string }> {
        const slots: Array<{ start: string; end: string; label: string }> = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (
            currentHour < endHour ||
            (currentHour === endHour && currentMinute + durationMinutes <= endMinute)
        ) {
            const start = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

            // Calculer l'heure de fin
            let endHourCalc = currentHour;
            let endMinuteCalc = currentMinute + durationMinutes;

            if (endMinuteCalc >= 60) {
                endHourCalc += Math.floor(endMinuteCalc / 60);
                endMinuteCalc = endMinuteCalc % 60;
            }

            const end = `${endHourCalc.toString().padStart(2, '0')}:${endMinuteCalc.toString().padStart(2, '0')}`;

            slots.push({
                start,
                end,
                label: `${start} - ${end}`
            });

            // Avancer de l'intervalle
            currentMinute += intervalMinutes;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        }

        return slots;
    }
};