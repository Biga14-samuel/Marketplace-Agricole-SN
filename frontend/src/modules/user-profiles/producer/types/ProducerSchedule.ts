// frontend/src/modules/user-profiles/producer/types/ProducerSchedule.ts

/**
 * Types pour les horaires d'ouverture et créneaux de retrait des producteurs
 * Gestion des disponibilités, plannings et créneaux de retrait
 */

// ==================== ENUMS ====================

/**
 * Jours de la semaine (ISO 8601)
 */
export enum DayOfWeek {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7
}

/**
 * Type d'horaire
 */
export enum ScheduleType {
    REGULAR = 'regular',           // Horaires réguliers
    SEASONAL = 'seasonal',         // Horaires saisonniers
    HOLIDAY = 'holiday',           // Horaires de vacances
    SPECIAL = 'special',           // Horaires spéciaux (événements)
    TEMPORARY = 'temporary'        // Horaires temporaires
}

/**
 * Période de la journée
 */
export enum TimeSlotType {
    MORNING = 'morning',           // Matin
    AFTERNOON = 'afternoon',       // Après-midi
    EVENING = 'evening',           // Soir
    FULL_DAY = 'full_day',         // Journée complète
    CUSTOM = 'custom'              // Plage horaire personnalisée
}

/**
 * Statut d'un créneau
 */
export enum SlotStatus {
    AVAILABLE = 'available',       // Disponible
    BOOKED = 'booked',             // Réservé
    FULL = 'full',                 // Complet
    CLOSED = 'closed',             // Fermé
    CANCELLED = 'cancelled',       // Annulé
    MAINTENANCE = 'maintenance'    // En maintenance
}

/**
 * Type de récurrence pour les créneaux
 */
export enum RecurrenceType {
    NONE = 'none',                 // Pas de récurrence
    DAILY = 'daily',               // Tous les jours
    WEEKLY = 'weekly',             // Toutes les semaines
    BIWEEKLY = 'biweekly',         // Toutes les deux semaines
    MONTHLY = 'monthly',           // Tous les mois
    CUSTOM = 'custom'              // Récurrence personnalisée
}

/**
 * Unité de durée pour les créneaux
 */
export enum DurationUnit {
    MINUTES = 'minutes',           // Minutes
    HOURS = 'hours',               // Heures
    DAYS = 'days'                  // Jours
}

// ==================== INTERFACES PRINCIPALES ====================

/**
 * Horaire d'ouverture d'un producteur
 */
export interface ProducerSchedule {
    // Identifiants
    id: string;
    producer_id: string;
    pickup_point_id?: string;      // Si spécifique à un point de retrait

    // Informations de base
    type: ScheduleType;
    name: string;                  // Nom de l'horaire (ex: "Horaire d'été")
    description?: string;

    // Jours et heures
    day_of_week: DayOfWeek;        // 1= Lundi, 7= Dimanche
    open_time: string;            // Format "HH:MM"
    close_time: string;           // Format "HH:MM"

    // Disponibilité
    is_active: boolean;
    is_peak_hours: boolean;       // Heures de pointe (tarification différente)
    max_capacity?: number;        // Capacité maximale simultanée

    // Période de validité
    valid_from?: string;          // Date de début de validité
    valid_until?: string;         // Date de fin de validité
    is_all_year: boolean;         // Valable toute l'année

    // Exceptions
    exceptions?: Array<{
        date: string;               // Date de l'exception (YYYY-MM-DD)
        reason: string;             // Raison (fermeture, horaire spécial)
        open_time?: string;         // Horaire spécial d'ouverture
        close_time?: string;        // Horaire spécial de fermeture
        is_closed: boolean;         // Fermé ce jour
    }>;

    // Métadonnées
    metadata?: {
        break_start?: string;       // Début de pause
        break_end?: string;         // Fin de pause
        preparation_time?: number;  // Temps de préparation en minutes
        min_notice?: number;        // Préavis minimum en heures
        notes?: string;            // Notes internes
    };

    // Dates
    created_at: string;
    updated_at: string;
}

/**
 * Créneau de retrait spécifique
 */
export interface PickupSlot {
    // Identifiants
    id: string;
    pickup_point_id: string;
    producer_id: string;

    // Date et heure
    date: string;                 // Format "YYYY-MM-DD"
    day_of_week: DayOfWeek;
    start_time: string;          // Format "HH:MM"
    end_time: string;            // Format "HH:MM"
    duration_minutes: number;    // Durée du créneau en minutes

    // Capacité
    max_orders: number;
    current_orders: number;
    available_slots: number;     // Calculé: max_orders - current_orders
    max_orders_per_customer: number; // Limite par client

    // Statut
    status: SlotStatus;
    is_active: boolean;
    is_full: boolean;            // Déduit de available_slots === 0

    // Restrictions
    min_order_notice_hours: number; // Délai minimum pour commander (en heures)
    cutoff_time?: string;        // Heure limite de réservation (format "HH:MM")

    // Tarification
    fee?: number;                // Frais de retrait optionnel
    fee_description?: string;    // Description des frais

    // Réservations
    reservations?: Array<{
        order_id: string;
        customer_id: string;
        customer_name: string;
        reserved_at: string;
        items_count: number;
    }>;

    // Métadonnées
    metadata?: {
        notes?: string;
        special_instructions?: string;
        weather_conditions?: string;
        staff_assigned?: string[]; // IDs du personnel assigné
    };

    // Dates
    created_at: string;
    updated_at: string;
}

// ==================== TYPES POUR CRÉATION/MISE À JOUR ====================

/**
 * Données pour créer un nouvel horaire
 */
export interface CreateScheduleRequest {
    producer_id: string;
    pickup_point_id?: string;
    type: ScheduleType;
    name: string;
    description?: string;
    day_of_week: DayOfWeek;
    open_time: string;
    close_time: string;
    is_active?: boolean;
    is_peak_hours?: boolean;
    max_capacity?: number;
    valid_from?: string;
    valid_until?: string;
    is_all_year?: boolean;
    exceptions?: Array<{
        date: string;
        reason: string;
        open_time?: string;
        close_time?: string;
        is_closed: boolean;
    }>;
    metadata?: {
        break_start?: string;
        break_end?: string;
        preparation_time?: number;
        min_notice?: number;
        notes?: string;
    };
}

/**
 * Données pour mettre à jour un horaire
 */
export interface UpdateScheduleRequest {
    name?: string;
    description?: string;
    open_time?: string;
    close_time?: string;
    is_active?: boolean;
    is_peak_hours?: boolean;
    max_capacity?: number;
    valid_from?: string;
    valid_until?: string;
    is_all_year?: boolean;
    exceptions?: Array<{
        date: string;
        reason: string;
        open_time?: string;
        close_time?: string;
        is_closed: boolean;
    }>;
    metadata?: {
        break_start?: string;
        break_end?: string;
        preparation_time?: number;
        min_notice?: number;
        notes?: string;
    };
}

/**
 * Données pour créer un créneau de retrait
 */
export interface CreatePickupSlotRequest {
    pickup_point_id: string;
    date: string;
    start_time: string;
    end_time: string;
    max_orders: number;
    max_orders_per_customer?: number;
    min_order_notice_hours?: number;
    fee?: number;
    fee_description?: string;
    is_active?: boolean;
    metadata?: {
        notes?: string;
        special_instructions?: string;
    };
}

/**
 * Données pour mettre à jour un créneau
 */
export interface UpdatePickupSlotRequest {
    start_time?: string;
    end_time?: string;
    max_orders?: number;
    max_orders_per_customer?: number;
    min_order_notice_hours?: number;
    fee?: number;
    fee_description?: string;
    is_active?: boolean;
    status?: SlotStatus;
    metadata?: {
        notes?: string;
        special_instructions?: string;
    };
}

// ==================== TYPES POUR CRÉNEAUX DISPONIBLES ====================

/**
 * Créneau disponible enrichi d'informations
 */
export interface AvailableSlot extends PickupSlot {
    pickup_point_name: string;
    pickup_point_address: string;
    pickup_point_type: string;
    producer_name: string;
    producer_logo?: string;
    distance_km?: number;         // Distance en kilomètres
    travel_time_minutes?: number; // Temps de trajet estimé
    is_favorite?: boolean;        // Point de retrait favori
    rating?: number;              // Note du producteur
}

/**
 * Réponse pour les créneaux disponibles
 */
export interface AvailableSlotsResponse {
    date: string;
    pickup_point_id?: string;     // Optionnel: filtre par point de retrait
    slots: AvailableSlot[];
    total_available: number;
    summary: {
        morning_slots: number;      // Créneaux du matin (avant 12h)
        afternoon_slots: number;    // Créneaux de l'après-midi (12h-18h)
        evening_slots: number;      // Créneaux du soir (après 18h)
        free_slots: number;         // Créneaux sans frais
        premium_slots: number;      // Créneaux avec frais
    };
    filters_applied?: {
        time_range?: string;
        max_distance?: number;
        min_rating?: number;
    };
}

/**
 * Filtres pour la recherche de créneaux
 */
export interface SlotFilters {
    date?: string;
    time_range?: {
        start: string;             // Format "HH:MM"
        end: string;               // Format "HH:MM"
    };
    day_of_week?: DayOfWeek[];
    pickup_point_id?: string;
    producer_id?: string;
    max_distance_km?: number;    // Distance maximale
    coordinates?: {
        lat: number;
        lng: number;
    };
    min_rating?: number;         // Note minimale du producteur
    has_fee?: boolean;           // Avec ou sans frais
    slot_type?: TimeSlotType;    // Type de créneau
    status?: SlotStatus[];
    available_only?: boolean;    // Uniquement les créneaux disponibles
}

// ==================== TYPES POUR GÉNÉRATION DE CRÉNEAUX ====================

/**
 * Configuration pour générer des créneaux récurrents
 */
export interface RecurringSlotGeneration {
    pickup_point_id: string;
    start_date: string;
    end_date?: string;           // Optionnel: date de fin
    recurrence_type: RecurrenceType;

    // Pour les récurrences hebdomadaires
    days_of_week?: DayOfWeek[];

    // Pour les récurrences mensuelles
    day_of_month?: number;       // Jour du mois (1-31)

    // Horaires
    time_slots: Array<{
        start_time: string;
        end_time: string;
        max_orders: number;
        fee?: number;
    }>;

    // Options
    exclude_dates?: string[];    // Dates à exclure
    include_holidays?: boolean;  // Inclure les jours fériés
    min_order_notice_hours?: number;
    max_orders_per_customer?: number;
    is_active?: boolean;
}

/**
 * Résultat de la génération de créneaux
 */
export interface SlotGenerationResult {
    success: boolean;
    generated_slots: number;
    failed_slots: number;
    slots: PickupSlot[];
    warnings: string[];
    conflicts: Array<{
        date: string;
        time: string;
        reason: string;
    }>;
}

// ==================== TYPES POUR LES HORAIRES SPÉCIAUX ====================

/**
 * Horaire spécial (vacances, événements)
 */
export interface SpecialSchedule {
    id: string;
    producer_id: string;
    pickup_point_id?: string;

    // Informations
    title: string;
    description?: string;
    type: 'holiday' | 'event' | 'maintenance' | 'other';

    // Dates
    start_date: string;
    end_date: string;
    start_time?: string;         // Heure de début spécifique
    end_time?: string;           // Heure de fin spécifique

    // Impact
    is_closed: boolean;          // Fermeture complète
    modified_hours?: Array<{
        day_of_week: DayOfWeek;
        open_time?: string;
        close_time?: string;
    }>;

    // Affichage
    color_code?: string;         // Code couleur pour le calendrier
    icon?: string;
    is_recurring_yearly?: boolean; // Se répète chaque année

    // Dates
    created_at: string;
    updated_at: string;
}

// ==================== TYPES POUR LA DISPONIBILITÉ ====================

/**
 * Disponibilité d'un producteur pour une période
 */
export interface AvailabilityWindow {
    producer_id: string;
    pickup_point_id?: string;
    date: string;
    day_of_week: DayOfWeek;
    is_available: boolean;
    reason?: string;             // Raison si non disponible

    // Horaires réguliers
    regular_hours?: {
        open_time: string;
        close_time: string;
    };

    // Horaires spéciaux
    special_hours?: {
        open_time?: string;
        close_time?: string;
        notes?: string;
    };

    // Créneaux disponibles
    available_slots: PickupSlot[];
    slot_summary: {
        total_slots: number;
        available_slots: number;
        booked_slots: number;
        peak_hours: boolean;
    };
}

/**
 * Calendrier de disponibilité
 */
export interface AvailabilityCalendar {
    producer_id: string;
    pickup_point_id?: string;
    month: number;               // 1-12
    year: number;
    days: Array<{
        date: string;
        day_of_week: DayOfWeek;
        is_available: boolean;
        is_today: boolean;
        is_past: boolean;
        is_fully_booked: boolean;
        available_slots_count: number;
        has_special_hours: boolean;
        color_indicator: 'green' | 'yellow' | 'red' | 'gray';
    }>;
    summary: {
        available_days: number;
        unavailable_days: number;
        fully_booked_days: number;
        special_days: number;
    };
}

// ==================== TYPES POUR LES RÉSERVATIONS ====================

/**
 * Réservation d'un créneau
 */
export interface SlotReservation {
    id: string;
    slot_id: string;
    order_id: string;
    customer_id: string;

    // Informations client
    customer_name: string;
    customer_email: string;
    customer_phone?: string;

    // Informations commande
    order_items_count: number;
    order_total: number;
    order_notes?: string;

    // Statut
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    checked_in: boolean;
    checked_in_at?: string;

    // QR Code
    qr_code_data?: string;
    check_in_code?: string;      // Code à 4 chiffres

    // Dates
    reserved_at: string;
    confirmed_at?: string;
    cancelled_at?: string;
    completed_at?: string;

    // Métadonnées
    metadata?: {
        vehicle_type?: string;
        license_plate?: string;
        special_needs?: string;
        expected_arrival?: string;
    };
}

/**
 * Données pour réserver un créneau
 */
export interface ReserveSlotRequest {
    slot_id: string;
    customer_id: string;
    order_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    order_items_count: number;
    order_total: number;
    order_notes?: string;
    metadata?: {
        vehicle_type?: string;
        license_plate?: string;
        special_needs?: string;
    };
}

// ==================== TYPES POUR LES STATISTIQUES ====================

/**
 * Statistiques d'utilisation des créneaux
 */
export interface SlotStatistics {
    period: {
        start_date: string;
        end_date: string;
    };
    totals: {
        total_slots: number;
        available_slots: number;
        booked_slots: number;
        utilization_rate: number;  // Pourcentage d'utilisation
        revenue_from_fees: number; // Revenus des frais de retrait
    };
    by_day: Array<{
        day_of_week: DayOfWeek;
        day_name: string;
        slots_count: number;
        booked_count: number;
        utilization_rate: number;
    }>;
    by_time_slot: Array<{
        time_range: string;
        slots_count: number;
        booked_count: number;
        popularity_rate: number;   // Taux de remplissage
    }>;
    peak_times: Array<{
        day_of_week: DayOfWeek;
        time_slot: string;
        utilization_rate: number;
    }>;
    trends: {
        weekly_growth: number;
        monthly_growth: number;
        peak_day: string;
        most_popular_time: string;
    };
}

// ==================== TYPES POUR L'API ====================

/**
 * Réponse pour la liste des horaires
 */
export interface ScheduleListResponse {
    schedules: ProducerSchedule[];
    special_schedules: SpecialSchedule[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
    summary: {
        active_schedules: number;
        weekly_hours: number;      // Nombre total d'heures par semaine
        coverage_rate: number;     // Pourcentage de couverture horaire
    };
}

/**
 * Réponse pour la liste des créneaux
 */
export interface SlotListResponse {
    slots: PickupSlot[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
    filters?: SlotFilters;
    summary: {
        available: number;
        booked: number;
        full: number;
        upcoming: number;          // Créneaux à venir
    };
}

/**
 * Réponse pour la disponibilité
 */
export interface AvailabilityResponse {
    producer_id: string;
    pickup_point_id?: string;
    date_range: {
        start: string;
        end: string;
    };
    availability: AvailabilityWindow[];
    next_available_date?: string;
    recommendations?: Array<{
        date: string;
        time_slot: string;
        available_slots: number;
        popularity: 'low' | 'medium' | 'high';
    }>;
}

// ==================== HELPER TYPES ====================

/**
 * Configuration du planning
 */
export interface ScheduleConfig {
    time_slot_duration: number;  // Durée standard d'un créneau en minutes
    buffer_time_between_slots: number; // Temps entre deux créneaux
    max_slots_per_day: number;   // Nombre maximum de créneaux par jour
    min_booking_notice: number;  // Préavis minimum en heures
    max_booking_advance: number; // Réservation max en jours à l'avance
    auto_confirm: boolean;       // Confirmation automatique des réservations
    allow_modifications: boolean; // Autoriser les modifications
    cancellation_policy_hours: number; // Délai d'annulation en heures
}

/**
 * Jour ouvré avec horaires
 */
export interface BusinessDay {
    day_of_week: DayOfWeek;
    is_open: boolean;
    open_time?: string;
    close_time?: string;
    is_peak: boolean;
    schedule_id?: string;
}

/**
 * Plage horaire
 */
export interface TimeRange {
    start: string;               // Format "HH:MM"
    end: string;                 // Format "HH:MM"
    label?: string;              // "Matin", "Après-midi", etc.
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Obtient le nom du jour en français
 */
export const getDayName = (day: DayOfWeek): string => {
    const names: Record<DayOfWeek, string> = {
        [DayOfWeek.MONDAY]: 'Lundi',
        [DayOfWeek.TUESDAY]: 'Mardi',
        [DayOfWeek.WEDNESDAY]: 'Mercredi',
        [DayOfWeek.THURSDAY]: 'Jeudi',
        [DayOfWeek.FRIDAY]: 'Vendredi',
        [DayOfWeek.SATURDAY]: 'Samedi',
        [DayOfWeek.SUNDAY]: 'Dimanche'
    };
    return names[day];
};

/**
 * Obtient l'abréviation du jour
 */
export const getDayAbbreviation = (day: DayOfWeek): string => {
    const abbreviations: Record<DayOfWeek, string> = {
        [DayOfWeek.MONDAY]: 'Lun',
        [DayOfWeek.TUESDAY]: 'Mar',
        [DayOfWeek.WEDNESDAY]: 'Mer',
        [DayOfWeek.THURSDAY]: 'Jeu',
        [DayOfWeek.FRIDAY]: 'Ven',
        [DayOfWeek.SATURDAY]: 'Sam',
        [DayOfWeek.SUNDAY]: 'Dim'
    };
    return abbreviations[day];
};

/**
 * Vérifie si un créneau est disponible
 */
export const isSlotAvailable = (slot: PickupSlot): boolean => {
    return slot.is_active &&
        slot.status === SlotStatus.AVAILABLE &&
        slot.available_slots > 0;
};

/**
 * Calcule la durée d'un créneau en minutes
 */
export const calculateSlotDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    return endTotal - startTotal;
};

/**
 * Formate une heure pour l'affichage
 */
export const formatTime = (time: string, format: 'short' | 'long' = 'short'): string => {
    const [hours, minutes] = time.split(':').map(Number);

    if (format === 'short') {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Format long avec AM/PM ou 24h
    if (hours === 0) {
        return `12:${minutes.toString().padStart(2, '0')} AM`;
    } else if (hours < 12) {
        return `${hours}:${minutes.toString().padStart(2, '0')} AM`;
    } else if (hours === 12) {
        return `12:${minutes.toString().padStart(2, '0')} PM`;
    } else {
        return `${hours - 12}:${minutes.toString().padStart(2, '0')} PM`;
    }
};

/**
 * Détermine le type de créneau en fonction de l'heure
 */
export const getTimeSlotType = (startTime: string): TimeSlotType => {
    const [hours] = startTime.split(':').map(Number);

    if (hours < 12) return TimeSlotType.MORNING;
    if (hours < 18) return TimeSlotType.AFTERNOON;
    return TimeSlotType.EVENING;
};

/**
 * Vérifie si un jour est ouvré
 */
export const isBusinessDay = (schedule: ProducerSchedule[], day: DayOfWeek): boolean => {
    return schedule.some(s =>
        s.day_of_week === day &&
        s.is_active &&
        s.open_time !== s.close_time
    );
};

/**
 * Obtient les horaires pour un jour spécifique
 */
export const getScheduleForDay = (
    schedules: ProducerSchedule[],
    day: DayOfWeek
): ProducerSchedule[] => {
    return schedules.filter(s =>
        s.day_of_week === day &&
        s.is_active
    );
};

/**
 * Vérifie si une date est dans la plage de validité
 */
export const isScheduleValidForDate = (
    schedule: ProducerSchedule,
    date: Date
): boolean => {
    if (schedule.is_all_year) return true;

    const currentDate = new Date(date);

    if (schedule.valid_from) {
        const validFrom = new Date(schedule.valid_from);
        if (currentDate < validFrom) return false;
    }

    if (schedule.valid_until) {
        const validUntil = new Date(schedule.valid_until);
        if (currentDate > validUntil) return false;
    }

    return true;
};

/**
 * Génère une série de dates pour une période
 */
export const generateDateRange = (
    startDate: string,
    endDate: string,
    includeWeekends: boolean = true
): string[] => {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        const dayOfWeek = current.getDay(); // 0 = Dimanche, 1 = Lundi, etc.

        if (includeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
            dates.push(current.toISOString().split('T')[0]);
        }

        current.setDate(current.getDate() + 1);
    }

    return dates;
};

/**
 * Obtient la couleur pour un statut de créneau
 */
export const getSlotStatusColor = (status: SlotStatus): string => {
    const colors: Record<SlotStatus, string> = {
        [SlotStatus.AVAILABLE]: 'bg-green-100 text-green-800',
        [SlotStatus.BOOKED]: 'bg-blue-100 text-blue-800',
        [SlotStatus.FULL]: 'bg-red-100 text-red-800',
        [SlotStatus.CLOSED]: 'bg-gray-100 text-gray-800',
        [SlotStatus.CANCELLED]: 'bg-orange-100 text-orange-800',
        [SlotStatus.MAINTENANCE]: 'bg-purple-100 text-purple-800'
    };
    return colors[status];
};

/**
 * Obtient l'icône pour un statut de créneau
 */
export const getSlotStatusIcon = (status: SlotStatus): string => {
    const icons: Record<SlotStatus, string> = {
        [SlotStatus.AVAILABLE]: 'check-circle',
        [SlotStatus.BOOKED]: 'calendar-days',
        [SlotStatus.FULL]: 'x-circle',
        [SlotStatus.CLOSED]: 'lock-closed',
        [SlotStatus.CANCELLED]: 'exclamation-triangle',
        [SlotStatus.MAINTENANCE]: 'wrench-screwdriver'
    };
    return icons[status];
};

/**
 * Formate une plage horaire pour l'affichage
 */
export const formatTimeRange = (start: string, end: string): string => {
    return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * Calcule le temps restant avant un créneau
 */
export const getTimeUntilSlot = (slot: PickupSlot): string | null => {
    const now = new Date();
    const slotDate = new Date(`${slot.date}T${slot.start_time}`);

    const diffMs = slotDate.getTime() - now.getTime();

    if (diffMs <= 0) return null;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 24) {
        const days = Math.floor(diffHours / 24);
        return `${days} jour${days > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
        return `${diffHours}h${diffMinutes > 0 ? `${diffMinutes}m` : ''}`;
    } else {
        return `${diffMinutes} minutes`;
    }
};

// ==================== EXPORTS ====================

export type {
    ProducerSchedule as BusinessHours,
    PickupSlot as TimeSlot,
    AvailableSlot as EnrichedSlot,
    ScheduleListResponse as PaginatedSchedules,
    SlotListResponse as PaginatedSlots,
    AvailabilityCalendar as CalendarView,
    SpecialSchedule as HolidaySchedule
};

/**
 * Type guard pour vérifier si un objet est un ProducerSchedule
 */
export const isProducerSchedule = (obj: unknown): obj is ProducerSchedule => {
    return obj !== null &&
        typeof obj === 'object' &&
        obj &&
        'id' in obj && typeof (obj as any).id === 'string' &&
        'producer_id' in obj && typeof (obj as any).producer_id === 'string' &&
        'day_of_week' in obj && typeof (obj as any).day_of_week === 'number' &&
        'open_time' in obj && typeof (obj as any).open_time === 'string' &&
        'close_time' in obj && typeof (obj as any).close_time === 'string' &&
        'is_active' in obj && typeof (obj as any).is_active === 'boolean';
};

/**
 * Type guard pour vérifier si un objet est un PickupSlot
 */
export const isPickupSlot = (obj: any): obj is PickupSlot => {
    return obj &&
        typeof obj.id === 'string' &&
        typeof obj.pickup_point_id === 'string' &&
        typeof obj.date === 'string' &&
        typeof obj.start_time === 'string' &&
        typeof obj.end_time === 'string' &&
        typeof obj.max_orders === 'number' &&
        typeof obj.current_orders === 'number';
};