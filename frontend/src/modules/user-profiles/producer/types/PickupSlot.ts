// frontend/src/modules/user-profiles/producer/types/PickupSlot.ts

/**
 * Types pour les créneaux de retrait des producteurs
 * Gestion des plages horaires, réservations, disponibilités et capacités
 */

// ==================== ENUMS ====================

/**
 * Statut d'un créneau
 */
export enum SlotStatus {
    AVAILABLE = 'available',           // Disponible à la réservation
    BOOKED = 'booked',                 // Réservé (mais pas encore retiré)
    CONFIRMED = 'confirmed',           // Confirmé par le producteur
    IN_PROGRESS = 'in_progress',       // En cours de préparation
    READY_FOR_PICKUP = 'ready_for_pickup', // Prêt pour retrait
    COMPLETED = 'completed',           // Retrait effectué
    CANCELLED = 'cancelled',           // Annulé
    NO_SHOW = 'no_show',               // Client ne s'est pas présenté
    EXPIRED = 'expired',               // Expiré (non réservé à temps)
    BLOCKED = 'blocked',               // Bloqué manuellement
    MAINTENANCE = 'maintenance'        // En maintenance
}

/**
 * Type de créneau
 */
export enum SlotType {
    STANDARD = 'standard',             // Créneau standard
    EXPRESS = 'express',               // Créneau rapide (temps réduit)
    PREMIUM = 'premium',               // Créneau premium (avec avantages)
    GROUP = 'group',                   // Créneau pour groupe
    VIP = 'vip',                       // Créneau VIP
    URGENT = 'urgent',                 // Créneau urgent
    BULK = 'bulk'                      // Créneau pour commandes volumineuses
}

/**
 * Récurrence des créneaux
 */
export enum RecurrencePattern {
    NONE = 'none',                     // Pas de récurrence
    DAILY = 'daily',                   // Tous les jours
    WEEKDAYS = 'weekdays',             // Du lundi au vendredi
    WEEKENDS = 'weekends',             // Samedi et dimanche
    WEEKLY = 'weekly',                 // Toutes les semaines
    BIWEEKLY = 'biweekly',             // Toutes les deux semaines
    MONTHLY = 'monthly',               // Tous les mois
    CUSTOM = 'custom'                  // Récurrence personnalisée
}

/**
 * Priorité de réservation
 */
export enum BookingPriority {
    NORMAL = 'normal',                 // Priorité normale
    HIGH = 'high',                     // Priorité haute
    URGENT = 'urgent'                  // Priorité urgente
}

/**
 * Méthode de création du créneau
 */
export enum SlotCreationMethod {
    MANUAL = 'manual',                 // Créé manuellement
    AUTOMATIC = 'automatic',           // Généré automatiquement
    TEMPLATE = 'template',             // Basé sur un template
    IMPORT = 'import',                 // Importé
    API = 'api'                        // Créé via API
}

/**
 * Jours de la semaine (réutilisé)
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

// ==================== ADDITIONAL TYPES ====================

/**
 * Données pour créer un créneau
 */
export interface PickupSlotCreate extends CreatePickupSlotRequest {}

/**
 * Données pour mettre à jour un créneau
 */
export interface PickupSlotUpdate extends UpdatePickupSlotRequest {}

/**
 * Données pour créer plusieurs créneaux
 */
export interface PickupSlotBulkCreate extends CreatePickupSlotsBatchRequest {}

/**
 * Données pour mettre à jour plusieurs créneaux
 */
export interface PickupSlotBulkUpdate extends UpdatePickupSlotsBatchRequest {}

/**
 * Réservation de créneau
 */
export interface SlotReservation extends SlotBooking {}

/**
 * Occupation d'un créneau
 */
export interface SlotOccupancy {
    slot_id: string;
    total_capacity: number;
    current_bookings: number;
    available_spots: number;
    utilization_rate: number;
}

/**
 * Pattern de récurrence de créneau
 */
export interface SlotRecurrencePattern {
    pattern: RecurrencePattern;
    start_date: string;
    end_date?: string;
    exceptions?: string[];  // Dates à exclure
}

/**
 * Conflit de créneau
 */
export interface SlotConflict {
    slot1_id: string;
    slot2_id: string;
    conflict_type: 'time_overlap' | 'capacity_exceeded' | 'resource_conflict';
    description: string;
}

/**
 * Résultat de validation de créneau
 */
export interface SlotValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Statistiques de créneau
 */
export interface SlotAnalytics extends SlotStatistics {}

/**
 * Liste d'attente pour un créneau
 */
export interface SlotWaitlist {
    slot_id: string;
    customers: Array<{
        customer_id: string;
        position: number;
        added_at: string;
    }>;
}

/**
 * Paramètres de notification de créneau
 */
export interface SlotNotificationSettings {
    slot_id: string;
    notify_on_booking: boolean;
    notify_on_cancellation: boolean;
    notify_before_pickup: boolean;
    notification_delay_minutes: number;
}

/**
 * Paramètres d'export de créneaux
 */
export interface SlotExportParams {
    format: 'csv' | 'excel' | 'pdf';
    date_range: {
        start_date: string;
        end_date: string;
    };
    include_bookings: boolean;
    include_statistics: boolean;
}

// ==================== INTERFACES PRINCIPALES ====================

/**
 * Créneau de retrait complet
 */
export interface PickupSlot {
    // Identifiants
    id: string;
    pickup_point_id: string;
    producer_id: string;
    external_reference?: string;      // Référence externe

    // Date et heure
    date: string;
    specific_date?: string; // Alias pour date                     // Format "YYYY-MM-DD"
    day_of_week: DayOfWeek;
    start_time: string;              // Format "HH:MM"
    end_time: string;                // Format "HH:MM"
    timezone: string;                // Fuseau horaire

    // Durée
    duration_minutes: number;        // Durée totale en minutes
    buffer_before_minutes: number;   // Tampon avant le créneau
    buffer_after_minutes: number;    // Tampon après le créneau
    actual_duration_minutes?: number; // Durée réelle (si différent)

    // Capacité et réservations
    capacity: {
        max_orders: number;            // Nombre maximum de commandes
        max_items_per_order: number;   // Articles maximum par commande
        max_weight_per_order?: number; // Poids maximum par commande (kg)
        max_volume_per_order?: number; // Volume maximum par commande (L)
    };

    bookings: {
        current_orders: number;        // Nombre de commandes réservées
        current_items: number;         // Nombre total d'articles
        current_weight?: number;       // Poids total réservé
        current_volume?: number;       // Volume total réservé
        reserved_orders: string[];     // IDs des commandes réservées
        waiting_list: string[];        // IDs en liste d'attente
    };

    // Calculs automatiques
    available_slots: number;         // max_orders - current_orders
    utilization_percentage: number;  // (current_orders / max_orders) * 100
    is_full: boolean;               // Déduit de available_slots <= 0
    is_almost_full: boolean;        // Déduit (ex: > 80% d'occupation)

    // Configuration
    type: SlotType;
    status: SlotStatus;
    creation_method: SlotCreationMethod;
    is_active: boolean;
    is_visible: boolean;            // Visible pour les clients
    is_bookable: boolean;           // Réservable par les clients
    requires_confirmation: boolean; // Nécessite confirmation manuelle

    // Restrictions
    restrictions: {
        min_order_notice_hours: number; // Préavis minimum (heures)
        max_order_advance_days: number; // Réservation max à l'avance (jours)
        cutoff_time: string;           // Heure limite pour réserver (HH:MM)
        allowed_modification_hours: number; // Délai pour modifications
        allowed_cancellation_hours: number; // Délai pour annulation
        age_restriction?: number;      // Âge minimum requis
        special_requirements?: string[]; // Exigences particulières
    };

    // Tarification
    pricing: {
        base_fee?: number;            // Frais de base
        fee_per_order?: number;       // Frais par commande
        fee_per_item?: number;        // Frais par article
        fee_per_weight?: number;      // Frais par kg
        fee_per_volume?: number;      // Frais par litre
        minimum_order_amount?: number; // Montant minimum de commande
        deposit_required?: number;    // Acompte requis
        cancellation_fee?: number;    // Frais d'annulation
        currency: string;             // Devise (ex: EUR)
    };

    // Optimisation
    optimization: {
        is_peak_hour: boolean;        // Heure de pointe
        peak_multiplier?: number;     // Multiplicateur pour heures de pointe
        recommended_slot: boolean;    // Recommandé par le système
        popularity_score: number;     // Score de popularité (0-100)
        difficulty_level?: 'easy' | 'medium' | 'hard'; // Difficulté de préparation
    };

    // Métadonnées
    metadata: {
        notes?: string;               // Notes internes
        tags?: string[];              // Tags de catégorisation
        color_code?: string;          // Code couleur pour le calendrier
        icon?: string;                // Icône pour l'affichage
        recurrence_id?: string;       // ID du pattern de récurrence
        template_id?: string;         // ID du template utilisé
        last_modified_by?: string;    // Dernier utilisateur modifiant
        version: number;              // Version du créneau
    };

    // Dates de suivi
    timestamps: {
        created_at: string;
        updated_at: string;
        activated_at?: string;
        deactivated_at?: string;
        last_booking_at?: string;
        last_modification_at?: string;
    };

    // Statistiques
    statistics?: {
        total_bookings: number;       // Total historique des réservations
        no_show_count: number;        // Nombre de no-show
        cancellation_rate: number;    // Taux d'annulation
        average_processing_time: number; // Temps moyen de traitement
        customer_satisfaction?: number; // Satisfaction moyenne
    };

    // Intégrations
    integrations?: {
        calendar_event_id?: string;   // ID de l'événement calendrier
        notification_sent: boolean;   // Notification envoyée
        reminder_sent: boolean;       // Rappel envoyé
        sync_status: 'pending' | 'synced' | 'failed';
    };
}

/**
 * Réponse de créneau disponible pour les clients
 */
export interface AvailableSlot {
    slot: PickupSlot;
    pickup_point: {
        id: string;
        name: string;
        address: string;
        type: string;
        distance_km?: number;
        estimated_travel_time?: number;
        facilities: string[];
    };
    producer: {
        id: string;
        name: string;
        rating: number;
        logo_url?: string;
        certifications: string[];
    };
    availability: {
        is_available: boolean;
        available_until?: string;     // Jusqu'à quand disponible
        waitlist_position?: number;   // Position liste d'attente
        estimated_wait_time?: number; // Temps d'attente estimé (minutes)
        recommended_alternatives?: Array<{
            slot_id: string;
            date: string;
            time: string;
            available_slots: number;
        }>;
    };
    pricing_summary: {
        total_fee: number;
        breakdown: Array<{
            type: string;
            amount: number;
            description: string;
        }>;
        discounts_available: boolean;
    };
}

// ==================== TYPES POUR CRÉATION/MISE À JOUR ====================

/**
 * Données pour créer un créneau
 */
export interface CreatePickupSlotRequest {
    pickup_point_id: string;
    date: string;
    start_time: string;
    end_time: string;

    // Configuration
    type?: SlotType;
    status?: SlotStatus;
    is_active?: boolean;
    is_visible?: boolean;
    is_bookable?: boolean;
    requires_confirmation?: boolean;

    // Capacité
    capacity: {
        max_orders: number;
        max_items_per_order?: number;
        max_weight_per_order?: number;
        max_volume_per_order?: number;
    };

    // Restrictions
    restrictions?: {
        min_order_notice_hours?: number;
        max_order_advance_days?: number;
        cutoff_time?: string;
        allowed_modification_hours?: number;
        allowed_cancellation_hours?: number;
        age_restriction?: number;
        special_requirements?: string[];
    };

    // Tarification
    pricing?: {
        base_fee?: number;
        fee_per_order?: number;
        fee_per_item?: number;
        fee_per_weight?: number;
        fee_per_volume?: number;
        minimum_order_amount?: number;
        deposit_required?: number;
        cancellation_fee?: number;
        currency?: string;
    };

    // Optimisation
    optimization?: {
        is_peak_hour?: boolean;
        peak_multiplier?: number;
        recommended_slot?: boolean;
        popularity_score?: number;
        difficulty_level?: 'easy' | 'medium' | 'hard';
    };

    // Métadonnées
    metadata?: {
        notes?: string;
        tags?: string[];
        color_code?: string;
        icon?: string;
        recurrence_id?: string;
        template_id?: string;
    };
}

/**
 * Données pour mettre à jour un créneau
 */
export interface UpdatePickupSlotRequest {
    // Date et heure
    date?: string;
    start_time?: string;
    end_time?: string;
    timezone?: string;

    // Configuration
    type?: SlotType;
    status?: SlotStatus;
    is_active?: boolean;
    is_visible?: boolean;
    is_bookable?: boolean;
    requires_confirmation?: boolean;

    // Capacité
    capacity?: {
        max_orders?: number;
        max_items_per_order?: number;
        max_weight_per_order?: number;
        max_volume_per_order?: number;
    };

    // Restrictions
    restrictions?: {
        min_order_notice_hours?: number;
        max_order_advance_days?: number;
        cutoff_time?: string;
        allowed_modification_hours?: number;
        allowed_cancellation_hours?: number;
        age_restriction?: number;
        special_requirements?: string[];
    };

    // Tarification
    pricing?: {
        base_fee?: number;
        fee_per_order?: number;
        fee_per_item?: number;
        fee_per_weight?: number;
        fee_per_volume?: number;
        minimum_order_amount?: number;
        deposit_required?: number;
        cancellation_fee?: number;
        currency?: string;
    };

    // Optimisation
    optimization?: {
        is_peak_hour?: boolean;
        peak_multiplier?: number;
        recommended_slot?: boolean;
        popularity_score?: number;
        difficulty_level?: 'easy' | 'medium' | 'hard';
    };

    // Métadonnées
    metadata?: {
        notes?: string;
        tags?: string[];
        color_code?: string;
        icon?: string;
        recurrence_id?: string;
        template_id?: string;
    };
}

/**
 * Données pour créer plusieurs créneaux (batch)
 */
export interface CreatePickupSlotsBatchRequest {
    slots: CreatePickupSlotRequest[];
    options?: {
        skip_conflicts?: boolean;      // Passer les créneaux en conflit
        validate_only?: boolean;       // Valider sans créer
        notify_producer?: boolean;     // Notifier le producteur
    };
}

/**
 * Données pour mettre à jour plusieurs créneaux (batch)
 */
export interface UpdatePickupSlotsBatchRequest {
    updates: Array<{
        slot_id: string;
        data: UpdatePickupSlotRequest;
    }>;
    options?: {
        validate_only?: boolean;
        notify_customers?: boolean;    // Notifier les clients affectés
    };
}

// ==================== TYPES POUR LA RÉCURRENCE ====================

/**
 * Pattern de récurrence pour les créneaux
 */
export interface RecurrencePatternConfig {
    id: string;
    producer_id: string;
    pickup_point_id: string;
    pattern: RecurrencePattern;
    name: string;
    description?: string;

    // Paramètres de récurrence
    settings: {
        start_date: string;
        end_date?: string;            // Optionnel
        days_of_week?: DayOfWeek[];   // Pour les patterns personnalisés
        interval?: number;            // Intervalle (ex: 2 pour toutes les 2 semaines)
        occurrences?: number;         // Nombre d'occurrences
    };

    // Configuration des créneaux
    slot_config: {
        start_time: string;
        end_time: string;
        capacity: {
            max_orders: number;
            max_items_per_order?: number;
        };
        type: SlotType;
        restrictions?: {
            min_order_notice_hours: number;
            max_order_advance_days: number;
        };
        pricing?: {
            base_fee?: number;
            fee_per_order?: number;
        };
    };

    // Exclusions
    exclusions?: {
        dates: string[];              // Dates spécifiques à exclure
        date_ranges: Array<{
            start_date: string;
            end_date: string;
        }>;
    };

    // Statut
    is_active: boolean;
    last_generated_at?: string;
    next_generation_date?: string;

    // Métadonnées
    metadata?: {
        generated_slots_count: number;
        last_error?: string;
        tags?: string[];
    };

    // Dates
    created_at: string;
    updated_at: string;
}

/**
 * Génération de créneaux récurrents
 */
export interface GenerateRecurringSlotsRequest {
    recurrence_pattern_id: string;
    start_date: string;
    end_date?: string;
    options?: {
        overwrite_existing?: boolean;  // Écraser les créneaux existants
        skip_conflicts?: boolean;      // Passer les conflits
        notify_producer?: boolean;     // Notifier le producteur
    };
}

// ==================== TYPES POUR LES RÉSERVATIONS ====================

/**
 * Réservation d'un créneau
 */
export interface SlotBooking {
    id: string;
    slot_id: string;
    order_id: string;
    customer_id: string;

    // Informations client
    customer: {
        name: string;
        email: string;
        phone?: string;
        preferred_language?: string;
        special_notes?: string;
    };

    // Informations commande
    order: {
        items_count: number;
        total_weight?: number;
        total_volume?: number;
        total_amount: number;
        payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded';
        payment_method?: string;
    };

    // Statut
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    confirmation_code: string;        // Code à 6 chiffres
    qr_code_data?: string;           // Données QR code

    // Check-in
    check_in: {
        is_checked_in: boolean;
        checked_in_at?: string;
        checked_in_by?: string;         // ID du personnel
        verification_method?: 'qr_code' | 'manual' | 'geo';
        location?: {
            lat?: number;
            lng?: number;
            accuracy?: number;
        };
    };

    // Retrait
    pickup: {
        is_picked_up: boolean;
        picked_up_at?: string;
        picked_up_by?: string;          // Nom de la personne retirant
        vehicle_info?: {
            type?: string;
            license_plate?: string;
            color?: string;
        };
        packaging_returned?: boolean;   // Emballages retournés
    };

    // Communication
    communication: {
        confirmation_sent: boolean;
        reminder_sent: boolean;
        follow_up_sent: boolean;
        notifications: Array<{
            type: string;
            sent_at: string;
            status: 'sent' | 'delivered' | 'failed';
        }>;
    };

    // Métadonnées
    metadata?: {
        booking_source?: 'web' | 'mobile' | 'api' | 'phone';
        ip_address?: string;
        user_agent?: string;
        utm_source?: string;
        notes?: string;
    };

    // Dates
    timestamps: {
        booked_at: string;
        confirmed_at?: string;
        cancelled_at?: string;
        completed_at?: string;
        no_show_at?: string;
    };
}

/**
 * Données pour réserver un créneau
 */
export interface BookSlotRequest {
    slot_id: string;
    customer_id: string;
    order_id: string;

    // Informations client
    customer: {
        name: string;
        email: string;
        phone?: string;
        preferred_language?: string;
        special_notes?: string;
    };

    // Informations commande
    order: {
        items_count: number;
        total_weight?: number;
        total_volume?: number;
        total_amount: number;
        payment_status: 'pending' | 'paid';
        payment_method?: string;
    };

    // Options
    options?: {
        skip_confirmation?: boolean;    // Passer la confirmation manuelle
        priority?: BookingPriority;
        send_confirmation?: boolean;    // Envoyer confirmation immédiate
    };

    // Métadonnées
    metadata?: {
        booking_source?: 'web' | 'mobile' | 'api' | 'phone';
        ip_address?: string;
        user_agent?: string;
        utm_source?: string;
    };
}

/**
 * Données pour mettre à jour une réservation
 */
export interface UpdateBookingRequest {
    // Informations client
    customer?: {
        name?: string;
        email?: string;
        phone?: string;
        special_notes?: string;
    };

    // Informations commande
    order?: {
        items_count?: number;
        total_weight?: number;
        total_volume?: number;
        total_amount?: number;
        payment_status?: 'pending' | 'paid' | 'partially_paid' | 'refunded';
    };

    // Statut
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

    // Options
    options?: {
        send_notification?: boolean;
        notify_customer?: boolean;
        cancellation_reason?: string;
    };
}

// ==================== TYPES POUR LA DISPONIBILITÉ ====================

/**
 * Disponibilité des créneaux pour une période
 */
export interface SlotAvailability {
    pickup_point_id: string;
    date: string;
    day_of_week: DayOfWeek;

    // Créneaux
    slots: Array<{
        slot_id: string;
        start_time: string;
        end_time: string;
        type: SlotType;
        available_slots: number;
        is_peak: boolean;
        pricing: {
            base_fee?: number;
            total_fee: number;
        };
        restrictions: {
            min_order_notice_hours: number;
            cutoff_time: string;
        };
    }>;

    // Résumé
    summary: {
        total_slots: number;
        available_slots: number;
        peak_slots: number;
        recommended_slot?: string;      // ID du créneau recommandé
        next_available_slot?: string;   // Prochain créneau disponible
        utilization_rate: number;       // Taux d'utilisation global
    };

    // Recommandations
    recommendations?: Array<{
        slot_id: string;
        reason: string;                 // "Peu fréquenté", "Meilleur prix", etc.
        score: number;                  // Score de recommandation (0-100)
    }>;
}

/**
 * Filtres pour la recherche de créneaux disponibles
 */
export interface SlotAvailabilityFilters {
    pickup_point_id?: string;
    producer_id?: string;
    date?: string;                    // Date spécifique
    date_range?: {                    // Plage de dates
        start: string;
        end: string;
    };
    time_range?: {                    // Plage horaire
        start: string;
        end: string;
    };
    day_of_week?: DayOfWeek[];
    min_available_slots?: number;     // Minimum de places disponibles
    max_fee?: number;                 // Frais maximum
    slot_types?: SlotType[];
    exclude_peak_hours?: boolean;     // Exclure les heures de pointe
    require_immediate_booking?: boolean; // Réservation immédiate possible
    customer_id?: string;             // Pour vérifier les restrictions client
}

// ==================== TYPES POUR LES STATISTIQUES ====================

/**
 * Statistiques des créneaux
 */
export interface SlotStatistics {
    period: {
        start_date: string;
        end_date: string;
    };

    // Général
    overview: {
        total_slots: number;
        available_slots: number;
        booked_slots: number;
        utilization_rate: number;
        revenue_from_slots: number;
        average_slots_per_day: number;
    };

    // Par jour
    by_day: Array<{
        day_of_week: DayOfWeek;
        day_name: string;
        slots_count: number;
        booked_count: number;
        utilization_rate: number;
        revenue: number;
    }>;

    // Par heure
    by_hour: Array<{
        hour: string;                   // "08:00", "09:00", etc.
        slots_count: number;
        booked_count: number;
        popularity_score: number;       // 0-100
        peak_factor: number;            // Facteur de pointe
    }>;

    // Par type
    by_type: Record<SlotType, {
        slots_count: number;
        booked_count: number;
        utilization_rate: number;
        average_fee: number;
        revenue: number;
    }>;

    // Performance
    performance: {
        most_popular_slot: {
            day_of_week: DayOfWeek;
            time_slot: string;
            utilization_rate: number;
        };
        least_popular_slot: {
            day_of_week: DayOfWeek;
            time_slot: string;
            utilization_rate: number;
        };
        best_revenue_slot: {
            day_of_week: DayOfWeek;
            time_slot: string;
            revenue: number;
        };
    };

    // Tendances
    trends: {
        weekly_growth: number;          // Croissance hebdomadaire (%)
        peak_day_trend: string;         // Jour de plus en plus populaire
        optimal_capacity: number;       // Capacité optimale calculée
        suggested_adjustments: Array<{
            day_of_week: DayOfWeek;
            time_slot: string;
            action: 'increase' | 'decrease' | 'maintain';
            amount: number;
            reason: string;
        }>;
    };

    // Clientèle
    customers: {
        unique_customers: number;
        returning_customers: number;
        average_bookings_per_customer: number;
        preferred_time_slots: Array<{
            time_slot: string;
            customer_count: number;
        }>;
    };
}

// ==================== TYPES POUR LES TEMPLATES ====================

/**
 * Template de créneau
 */
export interface SlotTemplate {
    id: string;
    producer_id: string;
    pickup_point_id?: string;        // Optionnel (spécifique ou général)
    name: string;
    description?: string;

    // Configuration
    config: {
        start_time: string;
        end_time: string;
        duration_minutes: number;
        type: SlotType;
        capacity: {
            max_orders: number;
            max_items_per_order?: number;
        };
        restrictions: {
            min_order_notice_hours: number;
            max_order_advance_days: number;
            cutoff_time: string;
        };
        pricing?: {
            base_fee?: number;
            fee_per_order?: number;
        };
        optimization: {
            is_peak_hour: boolean;
            recommended_slot: boolean;
        };
    };

    // Applicabilité
    applicability: {
        days_of_week: DayOfWeek[];
        valid_from?: string;
        valid_until?: string;
        is_default: boolean;           // Template par défaut
        priority: number;              // Priorité d'application
    };

    // Métadonnées
    metadata?: {
        usage_count: number;
        last_used_at?: string;
        tags?: string[];
        color_code?: string;
    };

    // Dates
    created_at: string;
    updated_at: string;
}

// ==================== TYPES POUR L'API RESPONSES ====================

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
        has_next: boolean;
        has_previous: boolean;
    };
    filters?: {
        date_range?: {
            start: string;
            end: string;
        };
        status?: SlotStatus[];
        type?: SlotType[];
        pickup_point_id?: string;
    };
    summary: {
        available: number;
        booked: number;
        completed: number;
        cancelled: number;
        utilization_rate: number;
    };
}

/**
 * Réponse pour les créneaux disponibles
 */
export interface AvailableSlotsResponse {
    date: string;
    pickup_point_id: string;
    availability: SlotAvailability;
    recommendations?: {
        best_value_slot?: AvailableSlot;
        most_available_slot?: AvailableSlot;
        soonest_slot?: AvailableSlot;
    };
    filters_applied?: SlotAvailabilityFilters;
}

/**
 * Réponse pour les statistiques
 */
export interface SlotStatsResponse {
    period: {
        start_date: string;
        end_date: string;
    };
    statistics: SlotStatistics;
    insights: Array<{
        type: 'warning' | 'suggestion' | 'opportunity';
        message: string;
        priority: 'low' | 'medium' | 'high';
        action?: string;
    }>;
}

// ==================== TYPES POUR LES OPÉRATIONS BATCH ====================

/**
 * Résultat d'opération batch
 */
export interface BatchOperationResult {
    operation_id: string;
    operation_type: 'create' | 'update' | 'delete' | 'generate';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    processed: number;
    succeeded: number;
    failed: number;
    results: Array<{
        id: string;
        success: boolean;
        message?: string;
        error?: string;
        details?: Record<string, any>;
    }>;
    started_at: string;
    completed_at?: string;
    errors?: Array<{
        code: string;
        message: string;
        count: number;
    }>;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Calcule les métriques d'un créneau
 */
export const calculateSlotMetrics = (slot: PickupSlot): PickupSlot => {
    const available_slots = Math.max(0, slot.capacity.max_orders - slot.bookings.current_orders);
    const utilization_percentage = (slot.bookings.current_orders / slot.capacity.max_orders) * 100;
    const is_full = available_slots <= 0;
    const is_almost_full = utilization_percentage >= 80;

    return {
        ...slot,
        available_slots,
        utilization_percentage,
        is_full,
        is_almost_full
    };
};

/**
 * Vérifie si un créneau est disponible pour réservation
 */
export const isSlotBookable = (slot: PickupSlot, currentTime?: Date): boolean => {
    const now = currentTime || new Date();

    // Vérifications de base
    if (!slot.is_active || !slot.is_visible || !slot.is_bookable) {
        return false;
    }

    if (slot.is_full || slot.available_slots <= 0) {
        return false;
    }

    if (slot.status !== SlotStatus.AVAILABLE && slot.status !== SlotStatus.BOOKED) {
        return false;
    }

    // Vérifier le préavis minimum
    const slotDateTime = new Date(`${slot.date}T${slot.start_time}`);
    const hoursUntilSlot = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilSlot < slot.restrictions.min_order_notice_hours) {
        return false;
    }

    // Vérifier l'heure limite
    if (slot.restrictions.cutoff_time) {
        const cutoffDateTime = new Date(`${slot.date}T${slot.restrictions.cutoff_time}`);
        if (now > cutoffDateTime) {
            return false;
        }
    }

    return true;
};

/**
 * Calcule les frais totaux pour un créneau
 */
export const calculateSlotFees = (slot: PickupSlot, orderDetails?: {
    items_count?: number;
    weight?: number;
    volume?: number;
}): number => {
    let totalFee = 0;

    // Frais de base
    if (slot.pricing.base_fee) {
        totalFee += slot.pricing.base_fee;
    }

    // Frais par commande
    if (slot.pricing.fee_per_order) {
        totalFee += slot.pricing.fee_per_order;
    }

    // Frais par article
    if (slot.pricing.fee_per_item && orderDetails?.items_count) {
        totalFee += slot.pricing.fee_per_item * orderDetails.items_count;
    }

    // Frais par poids
    if (slot.pricing.fee_per_weight && orderDetails?.weight) {
        totalFee += slot.pricing.fee_per_weight * orderDetails.weight;
    }

    // Frais par volume
    if (slot.pricing.fee_per_volume && orderDetails?.volume) {
        totalFee += slot.pricing.fee_per_volume * orderDetails.volume;
    }

    // Multiplicateur heures de pointe
    if (slot.optimization.is_peak_hour && slot.optimization.peak_multiplier) {
        totalFee *= slot.optimization.peak_multiplier;
    }

    return parseFloat(totalFee.toFixed(2));
};

/**
 * Obtient la couleur pour un statut de créneau
 */
export const getSlotStatusColor = (status: SlotStatus): string => {
    const colors: Record<SlotStatus, string> = {
        [SlotStatus.AVAILABLE]: 'bg-green-100 text-green-800 border-green-200',
        [SlotStatus.BOOKED]: 'bg-blue-100 text-blue-800 border-blue-200',
        [SlotStatus.CONFIRMED]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        [SlotStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-800 border-amber-200',
        [SlotStatus.READY_FOR_PICKUP]: 'bg-purple-100 text-purple-800 border-purple-200',
        [SlotStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        [SlotStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
        [SlotStatus.NO_SHOW]: 'bg-orange-100 text-orange-800 border-orange-200',
        [SlotStatus.EXPIRED]: 'bg-gray-100 text-gray-800 border-gray-200',
        [SlotStatus.BLOCKED]: 'bg-red-50 text-red-600 border-red-100',
        [SlotStatus.MAINTENANCE]: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status] || colors[SlotStatus.AVAILABLE];
};

/**
 * Obtient l'icône pour un statut de créneau
 */
export const getSlotStatusIcon = (status: SlotStatus): string => {
    const icons: Record<SlotStatus, string> = {
        [SlotStatus.AVAILABLE]: 'calendar',
        [SlotStatus.BOOKED]: 'clock',
        [SlotStatus.CONFIRMED]: 'check-circle',
        [SlotStatus.IN_PROGRESS]: 'arrow-path',
        [SlotStatus.READY_FOR_PICKUP]: 'package',
        [SlotStatus.COMPLETED]: 'check-badge',
        [SlotStatus.CANCELLED]: 'x-circle',
        [SlotStatus.NO_SHOW]: 'exclamation-triangle',
        [SlotStatus.EXPIRED]: 'clock',
        [SlotStatus.BLOCKED]: 'lock-closed',
        [SlotStatus.MAINTENANCE]: 'wrench-screwdriver'
    };
    return icons[status] || icons[SlotStatus.AVAILABLE];
};

/**
 * Formate une plage horaire pour l'affichage
 */
export const formatTimeRange = (start: string, end: string): string => {
    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

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

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}${diffHours > 0 ? ` ${diffHours}h` : ''}`;
    } else if (diffHours > 0) {
        return `${diffHours}h${diffMinutes > 0 ? `${diffMinutes}m` : ''}`;
    } else {
        return `${diffMinutes} minutes`;
    }
};

/**
 * Vérifie si un créneau est en conflit avec un autre
 */
export const hasSlotConflict = (slot1: PickupSlot, slot2: PickupSlot): boolean => {
    if (slot1.pickup_point_id !== slot2.pickup_point_id) {
        return false;
    }

    if (slot1.date !== slot2.date) {
        return false;
    }

    const slot1Start = new Date(`${slot1.date}T${slot1.start_time}`);
    const slot1End = new Date(`${slot1.date}T${slot1.end_time}`);
    const slot2Start = new Date(`${slot2.date}T${slot2.start_time}`);
    const slot2End = new Date(`${slot2.date}T${slot2.end_time}`);

    // Vérifier le chevauchement
    return slot1Start < slot2End && slot1End > slot2Start;
};

/**
 * Génère un code de confirmation unique
 */
export const generateConfirmationCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Valide les données d'un créneau
 */
export const validatePickupSlot = (slot: Partial<PickupSlot>): string[] => {
    const errors: string[] = [];

    if (!slot.pickup_point_id) errors.push('Le point de retrait est requis');
    if (!slot.date) errors.push('La date est requise');
    if (!slot.start_time) errors.push('L\'heure de début est requise');
    if (!slot.end_time) errors.push('L\'heure de fin est requise');

    if (slot.capacity?.max_orders === undefined || slot.capacity.max_orders <= 0) {
        errors.push('La capacité maximale doit être supérieure à 0');
    }

    if (slot.start_time && slot.end_time) {
        const start = new Date(`2000-01-01T${slot.start_time}`);
        const end = new Date(`2000-01-01T${slot.end_time}`);
        if (end <= start) {
            errors.push('L\'heure de fin doit être après l\'heure de début');
        }
    }

    return errors;
};

// ==================== EXPORTS ====================

export type {
    PickupSlot as TimeSlot,
    AvailableSlot as ClientSlot,
    SlotBooking as Reservation,
    SlotAvailability as Availability,
    SlotStatistics as SlotStats,
    SlotTemplate as Template,
    SlotListResponse as PaginatedSlots,
    AvailableSlotsResponse as AvailableResponse,
    BatchOperationResult as BatchResult
};

/**
 * Type guard pour vérifier si un objet est un PickupSlot
 */
export const isPickupSlot = (obj: unknown): obj is PickupSlot => {
    return obj !== null &&
        typeof obj === 'object' &&
        obj &&
        'id' in obj && typeof (obj as any).id === 'string' &&
        'pickup_point_id' in obj && typeof (obj as any).pickup_point_id === 'string' &&
        'date' in obj && typeof (obj as any).date === 'string' &&
        'start_time' in obj && typeof (obj as any).start_time === 'string' &&
        'end_time' in obj && typeof (obj as any).end_time === 'string' &&
        'capacity' in obj && (obj as any).capacity && typeof (obj as any).capacity.max_orders === 'number' &&
        'bookings' in obj && (obj as any).bookings && typeof (obj as any).bookings.current_orders === 'number';
};

/**
 * Type guard pour vérifier si un objet est un AvailableSlot
 */
export const isAvailableSlot = (obj: unknown): obj is AvailableSlot => {
    return obj !== null &&
        typeof obj === 'object' &&
        obj &&
        'slot' in obj && isPickupSlot((obj as any).slot) &&
        'pickup_point' in obj && (obj as any).pickup_point && typeof (obj as any).pickup_point.name === 'string' &&
        'producer' in obj && (obj as any).producer && typeof (obj as any).producer.name === 'string';
};