// frontend/src/modules/user-profiles/producer/types/PickupPoint.ts

/**
 * Types pour les points de retrait des producteurs
 * Gestion des lieux de retrait, adresses, capacités et configurations
 */

// ==================== ENUMS ====================

/**
 * Type de point de retrait
 */
export enum PickupPointType {
    FARM = 'farm',                    // À la ferme
    FARMERS_MARKET = 'farmers_market', // Marché de producteurs
    DELIVERY_POINT = 'delivery_point', // Point relais (boulangerie, épicerie)
    DRIVE_THRU = 'drive_thru',        // Drive (voiture)
    COMMUNITY_POINT = 'community_point', // Point communautaire (AMAP, association)
    MOBILE_TRUCK = 'mobile_truck',    // Camion itinérant
    URBAN_FARM = 'urban_farm',        // Ferme urbaine
    COLLECTIVE_POINT = 'collective_point', // Point collectif (plusieurs producteurs)
    HOME_DELIVERY = 'home_delivery',  // Livraison à domicile (spécial)
    POPUP_STORE = 'popup_store',      // Boutique éphémère
    WORKPLACE = 'workplace',          // Entreprise/collectivité
    OTHER = 'other'
}

/**
 * Statut du point de retrait
 */
export enum PickupPointStatus {
    ACTIVE = 'active',                // Actif et opérationnel
    INACTIVE = 'inactive',            // Inactif temporairement
    COMING_SOON = 'coming_soon',      // Bientôt disponible
    TEMPORARILY_CLOSED = 'temporarily_closed', // Fermé temporairement
    PERMANENTLY_CLOSED = 'permanently_closed', // Fermé définitivement
    UNDER_MAINTENANCE = 'under_maintenance', // En maintenance
    FULL_CAPACITY = 'full_capacity'  // Capacité atteinte
}

/**
 * Type d'accès
 */
export enum AccessType {
    WALK_IN = 'walk_in',              // Accès piéton
    DRIVE_IN = 'drive_in',            // Accès voiture (drive)
    BICYCLE = 'bicycle',              // Accès vélo
    PUBLIC_TRANSPORT = 'public_transport', // Proche transport en commun
    DELIVERY_ONLY = 'delivery_only',  // Uniquement livraison
    BY_APPOINTMENT = 'by_appointment' // Sur rendez-vous uniquement
}

/**
 * Équipements disponibles
 */
export enum FacilityType {
    PARKING = 'parking',              // Parking
    COVERED_AREA = 'covered_area',    // Zone couverte
    REFRIGERATION = 'refrigeration',  // Réfrigération
    FREEZER = 'freezer',              // Congélateur
    SCALES = 'scales',                // Balance
    CARD_TERMINAL = 'card_terminal',  // Terminal CB
    WIFI = 'wifi',                    // WiFi gratuit
    TOILETS = 'toilets',              // Toilettes
    HAND_WASH = 'hand_wash',          // Point lavage mains
    DISABLED_ACCESS = 'disabled_access', // Accès handicapé
    PET_FRIENDLY = 'pet_friendly',    // Animaux acceptés
    SEATING_AREA = 'seating_area',    // Zone assise
    PLAY_AREA = 'play_area',          // Espace enfants
    CHARGING_STATION = 'charging_station', // Borne recharge véhicule
    PACKAGING_STATION = 'packaging_station', // Zone emballage
    SAMPLING_AREA = 'sampling_area'   // Zone dégustation
}

/**
 * Jours d'ouverture (réutilisé depuis ProducerSchedule)
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
 * Coordonnées géographiques
 */
export interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Horaire de retrait
 */
export interface PickupSchedule {
    id: string;
    pickup_point_id: string;
    day_of_week: DayOfWeek;
    start_time: string;
    open_time?: string; // Alias pour start_time
    end_time: string;
    close_time?: string; // Alias pour end_time
    is_active: boolean;
    break_start?: string;
    break_end?: string;
    max_concurrent_orders?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Exception d'horaire
 */
export interface PickupException {
    id: string;
    pickup_point_id: string;
    date: string;
    is_closed: boolean;
    reason?: string;
    alternative_hours?: {
        start_time: string;
        end_time: string;
    };
    created_at: string;
    updated_at: string;
}

/**
 * Statistiques de retrait
 */
export interface PickupAnalytics {
    pickup_point_id: string;
    period: {
        start_date: string;
        end_date: string;
    };
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    peak_hours: Array<{
        hour: number;
        order_count: number;
    }>;
    busiest_days: Array<{
        day_of_week: DayOfWeek;
        order_count: number;
    }>;
}

/**
 * Point de retrait avec créneaux
 */
export interface PickupPointWithSlots extends PickupPoint {
    slots: Array<{
        id: string;
        date: string;
        start_time: string;
        end_time: string;
        available_spots: number;
        total_spots: number;
    }>;
    schedule?: PickupSchedule[];
    exceptions?: PickupException[];
}

// ==================== INTERFACES PRINCIPALES ====================

/**
 * Point de retrait complet
 */
export interface PickupPoint {
    // Identifiants
    id: string;
    producer_id: string;
    external_id?: string;           // ID externe (Google Places, etc.)

    // Informations de base
    name: string;
    type: PickupPointType;
    status: PickupPointStatus;
    is_active: boolean;  // Actif ou non
    description?: string;
    tagline?: string;               // Slogan court

    // Localisation
    address: {
        street: string;
        street_number?: string;
        city: string;
        postal_code: string;
        country: string;
        department?: string;          // Département
        region?: string;             // Région
        neighborhood?: string;       // Quartier
        additional_info?: string;    // Complément d'adresse
        formatted_address?: string;  // Adresse formatée complète
    };

    // Coordonnées géographiques
    coordinates: {
        lat: number;
        lng: number;
        accuracy?: number;           // Précision en mètres
        altitude?: number;           // Altitude
    };

    // Accès et transport
    access_types: AccessType[];
    nearby_transport?: {
        bus_stops?: string[];
        metro_stations?: string[];
        train_stations?: string[];
        bike_sharing?: boolean;
        parking_info?: string;
    };

    // Instructions
    instructions: string;
    arrival_instructions?: string;   // Instructions d'arrivée
    parking_instructions?: string;   // Instructions parking
    accessibility_info?: string;     // Accessibilité PMR

    // Contact
    contact: {
        phone?: string;
        email?: string;
        emergency_contact?: string;   // Contact d'urgence
        contact_person?: string;      // Personne à contacter
    };

    // Équipements et services
    facilities: FacilityType[];
    additional_facilities?: string[]; // Équipements supplémentaires

    // Capacité
    capacity: {
        max_daily_orders: number;     // Commandes max par jour
        max_simultaneous_customers: number; // Clients simultanés max
        average_processing_time: number; // Temps moyen de retrait (minutes)
        queue_capacity?: number;      // Capacité file d'attente
        storage_capacity?: string;    // Capacité de stockage
    };

    // Horaires (spécifiques au point)
    opening_hours?: Array<{
        day_of_week: DayOfWeek;
        open_time: string;           // Format "HH:MM"
        close_time: string;          // Format "HH:MM"
        is_active: boolean;
        by_appointment_only?: boolean; // Sur rendez-vous uniquement
    }>;

    // Horaires spéciaux
    special_hours?: Array<{
        date: string;                // Format "YYYY-MM-DD"
        name: string;                // Ex: "Fermeture annuelle"
        open_time?: string;
        close_time?: string;
        is_closed: boolean;
        reason?: string;
    }>;

    // Images
    images: Array<{
        url: string;
        caption?: string;
        is_primary: boolean;
        order: number;
        type?: 'exterior' | 'interior' | 'products' | 'map' | 'other';
    }>;

    // Tarification
    fees?: {
        pickup_fee?: number;         // Frais de retrait
        minimum_order?: number;      // Commande minimum
        free_pickup_threshold?: number; // Gratuit à partir de
        accepted_payment_methods: string[]; // CB, espèces, chèque, etc.
        notes?: string;
    };

    // Règles
    rules?: {
        cancellation_policy_hours: number;
        modification_policy_hours: number;
        allowed_modifications: boolean;
        packaging_policy?: string;   // Politique d'emballage
        return_policy?: string;      // Politique de retour
    };

    // Métriques
    metrics?: {
        total_orders: number;
        average_rating: number;
        review_count: number;
        last_order_date?: string;
        busiest_day?: DayOfWeek;
        busiest_time?: string;
        utilization_rate?: number;   // Taux d'utilisation
    };

    // Préférences
    preferences?: {
        auto_assign_orders: boolean; // Affectation automatique des commandes
        notify_on_order: boolean;    // Notification à chaque commande
        default_slot_duration: number; // Durée par défaut des créneaux (minutes)
        buffer_time_between_slots: number; // Temps tampon entre créneaux
    };

    // Sécurité
    security?: {
        surveillance_cameras: boolean;
        alarm_system: boolean;
        insurance_coverage: boolean;
        safety_protocols?: string[];
    };

    // Durabilité
    sustainability?: {
        eco_packaging: boolean;
        waste_reduction: boolean;
        local_sourcing: boolean;
        carbon_neutral: boolean;
        initiatives?: string[];
    };

    // Dates
    created_at: string;
    updated_at: string;
    activated_at?: string;
    last_maintenance_date?: string;
    next_maintenance_date?: string;

    // Métadonnées
    metadata?: {
        google_places_id?: string;
        openstreetmap_id?: string;
        timezone?: string;
        ownership_type?: 'owned' | 'rented' | 'shared' | 'cooperative';
        square_meters?: number;
        year_established?: number;
        tags?: string[];
    };
}

// ==================== TYPES POUR CRÉATION/MISE À JOUR ====================

/**
 * Données pour créer un nouveau point de retrait
 */
export interface CreatePickupPointRequest {
    producer_id: string;
    name: string;
    type: PickupPointType;
    description?: string;
    tagline?: string;

    // Adresse
    address: {
        street: string;
        street_number?: string;
        city: string;
        postal_code: string;
        country: string;
        department?: string;
        region?: string;
        neighborhood?: string;
        additional_info?: string;
    };

    // Coordonnées
    coordinates: {
        lat: number;
        lng: number;
        accuracy?: number;
    };

    // Accès
    access_types: AccessType[];
    nearby_transport?: {
        bus_stops?: string[];
        metro_stations?: string[];
        train_stations?: string[];
        bike_sharing?: boolean;
        parking_info?: string;
    };

    // Instructions
    instructions: string;
    arrival_instructions?: string;
    parking_instructions?: string;
    accessibility_info?: string;

    // Contact
    contact?: {
        phone?: string;
        email?: string;
        emergency_contact?: string;
        contact_person?: string;
    };

    // Équipements
    facilities?: FacilityType[];
    additional_facilities?: string[];

    // Capacité
    capacity: {
        max_daily_orders: number;
        max_simultaneous_customers: number;
        average_processing_time?: number;
        queue_capacity?: number;
        storage_capacity?: string;
    };

    // Horaires
    opening_hours?: Array<{
        day_of_week: DayOfWeek;
        open_time: string;
        close_time: string;
        is_active?: boolean;
        by_appointment_only?: boolean;
    }>;

    // Images
    images?: Array<{
        file?: File;                // Pour l'upload
        url?: string;               // URL existante
        caption?: string;
        is_primary?: boolean;
        type?: 'exterior' | 'interior' | 'products' | 'map' | 'other';
    }>;

    // Tarification
    fees?: {
        pickup_fee?: number;
        minimum_order?: number;
        free_pickup_threshold?: number;
        accepted_payment_methods?: string[];
        notes?: string;
    };

    // Règles
    rules?: {
        cancellation_policy_hours?: number;
        modification_policy_hours?: number;
        allowed_modifications?: boolean;
        packaging_policy?: string;
        return_policy?: string;
    };

    // Préférences
    preferences?: {
        auto_assign_orders?: boolean;
        notify_on_order?: boolean;
        default_slot_duration?: number;
        buffer_time_between_slots?: number;
    };

    // Sécurité
    security?: {
        surveillance_cameras?: boolean;
        alarm_system?: boolean;
        insurance_coverage?: boolean;
        safety_protocols?: string[];
    };

    // Durabilité
    sustainability?: {
        eco_packaging?: boolean;
        waste_reduction?: boolean;
        local_sourcing?: boolean;
        carbon_neutral?: boolean;
        initiatives?: string[];
    };

    // Statut
    status?: PickupPointStatus;
}

/**
 * Données pour mettre à jour un point de retrait
 */
export interface UpdatePickupPointRequest {
    name?: string;
    type?: PickupPointType;
    description?: string;
    tagline?: string;

    // Adresse
    address?: {
        street?: string;
        street_number?: string;
        city?: string;
        postal_code?: string;
        country?: string;
        department?: string;
        region?: string;
        neighborhood?: string;
        additional_info?: string;
    };

    // Coordonnées
    coordinates?: {
        lat?: number;
        lng?: number;
        accuracy?: number;
    };

    // Accès
    access_types?: AccessType[];
    nearby_transport?: {
        bus_stops?: string[];
        metro_stations?: string[];
        train_stations?: string[];
        bike_sharing?: boolean;
        parking_info?: string;
    };

    // Instructions
    instructions?: string;
    arrival_instructions?: string;
    parking_instructions?: string;
    accessibility_info?: string;

    // Contact
    contact?: {
        phone?: string;
        email?: string;
        emergency_contact?: string;
        contact_person?: string;
    };

    // Équipements
    facilities?: FacilityType[];
    additional_facilities?: string[];

    // Capacité
    capacity?: {
        max_daily_orders?: number;
        max_simultaneous_customers?: number;
        average_processing_time?: number;
        queue_capacity?: number;
        storage_capacity?: string;
    };

    // Horaires
    opening_hours?: Array<{
        day_of_week: DayOfWeek;
        open_time: string;
        close_time: string;
        is_active?: boolean;
        by_appointment_only?: boolean;
    }>;

    // Images
    images?: Array<{
        file?: File;
        url?: string;
        caption?: string;
        is_primary?: boolean;
        type?: 'exterior' | 'interior' | 'products' | 'map' | 'other';
    }>;

    // Tarification
    fees?: {
        pickup_fee?: number;
        minimum_order?: number;
        free_pickup_threshold?: number;
        accepted_payment_methods?: string[];
        notes?: string;
    };

    // Règles
    rules?: {
        cancellation_policy_hours?: number;
        modification_policy_hours?: number;
        allowed_modifications?: boolean;
        packaging_policy?: string;
        return_policy?: string;
    };

    // Préférences
    preferences?: {
        auto_assign_orders?: boolean;
        notify_on_order?: boolean;
        default_slot_duration?: number;
        buffer_time_between_slots?: number;
    };

    // Sécurité
    security?: {
        surveillance_cameras?: boolean;
        alarm_system?: boolean;
        insurance_coverage?: boolean;
        safety_protocols?: string[];
    };

    // Durabilité
    sustainability?: {
        eco_packaging?: boolean;
        waste_reduction?: boolean;
        local_sourcing?: boolean;
        carbon_neutral?: boolean;
        initiatives?: string[];
    };

    // Statut
    status?: PickupPointStatus;
}

// ==================== TYPES POUR LES IMAGES ====================

/**
 * Image d'un point de retrait
 */
export interface PickupPointImage {
    id: string;
    pickup_point_id: string;
    url: string;
    thumbnail_url?: string;
    caption?: string;
    alt_text?: string;
    is_primary: boolean;
    order: number;
    type: 'exterior' | 'interior' | 'products' | 'map' | 'other';
    file_size?: number;
    dimensions?: {
        width: number;
        height: number;
    };
    uploaded_at: string;
    uploaded_by?: string;
    metadata?: {
        camera_model?: string;
        location?: string;
        tags?: string[];
    };
}

/**
 * Upload d'image
 */
export interface ImageUploadRequest {
    pickup_point_id: string;
    file: File;
    caption?: string;
    is_primary?: boolean;
    type?: 'exterior' | 'interior' | 'products' | 'map' | 'other';
}

// ==================== TYPES POUR LES HORAIRES ====================

/**
 * Horaire spécifique au point de retrait
 */
export interface PickupPointSchedule {
    id: string;
    pickup_point_id: string;
    day_of_week: DayOfWeek;
    open_time: string;           // Format "HH:MM"
    close_time: string;          // Format "HH:MM"
    is_active: boolean;
    by_appointment_only: boolean;
    notes?: string;

    // Pour les créneaux
    slot_settings?: {
        duration_minutes: number;   // Durée des créneaux
        buffer_minutes: number;     // Temps tampon entre créneaux
        max_slots_per_day: number;  // Nombre max de créneaux
    };

    created_at: string;
    updated_at: string;
}

// ==================== TYPES POUR LA DISPONIBILITÉ ====================

/**
 * Disponibilité d'un point de retrait
 */
export interface PickupPointAvailability {
    pickup_point_id: string;
    date: string;                // Format "YYYY-MM-DD"
    day_of_week: DayOfWeek;

    // Informations de base
    is_open: boolean;
    open_time?: string;
    close_time?: string;
    special_hours?: boolean;

    // Capacité
    total_capacity: number;
    booked_capacity: number;
    available_capacity: number;
    utilization_rate: number;    // Pourcentage d'utilisation

    // Créneaux
    slots: Array<{
        start_time: string;
        end_time: string;
        available: number;
        total: number;
        is_peak: boolean;
    }>;

    // Restrictions
    restrictions?: {
        max_orders_per_customer?: number;
        min_order_amount?: number;
        cutoff_time?: string;      // Heure limite pour commander
    };

    // Métriques
    metrics?: {
        average_processing_time: number;
        expected_wait_time: number;
        popularity_score: number;  // Score de popularité (0-100)
    };
}

/**
 * Calendrier de disponibilité
 */
export interface PickupPointCalendar {
    pickup_point_id: string;
    month: number;
    year: number;
    days: Array<{
        date: string;
        day_of_week: DayOfWeek;
        is_open: boolean;
        is_today: boolean;
        is_past: boolean;
        available_capacity: number;
        has_special_hours: boolean;
        is_fully_booked: boolean;
        color_indicator: 'green' | 'yellow' | 'orange' | 'red' | 'gray';
    }>;
    summary: {
        open_days: number;
        closed_days: number;
        fully_booked_days: number;
        average_availability: number;
    };
}

// ==================== TYPES POUR LES STATISTIQUES ====================

/**
 * Statistiques d'un point de retrait
 */
export interface PickupPointStats {
    period: {
        start_date: string;
        end_date: string;
    };

    // Commandes
    orders: {
        total: number;
        completed: number;
        cancelled: number;
        average_per_day: number;
        peak_day: string;
        peak_time: string;
        revenue: number;
        average_order_value: number;
    };

    // Clients
    customers: {
        total: number;
        new_customers: number;
        returning_customers: number;
        average_visits: number;
        top_customers: Array<{
            customer_id: string;
            customer_name: string;
            order_count: number;
            total_spent: number;
        }>;
    };

    // Créneaux
    slots: {
        total_slots: number;
        booked_slots: number;
        utilization_rate: number;
        most_popular_slots: Array<{
            day_of_week: DayOfWeek;
            time_slot: string;
            booking_rate: number;
        }>;
    };

    // Évaluations
    reviews: {
        average_rating: number;
        total_reviews: number;
        rating_distribution: Record<number, number>; // 1-5 étoiles
        recent_reviews: Array<{
            date: string;
            rating: number;
            comment: string;
            customer_name: string;
        }>;
    };

    // Performance
    performance: {
        processing_time: {
            average: number;
            best: number;
            worst: number;
        };
        customer_satisfaction: number;
        efficiency_score: number;
    };

    // Tendances
    trends: {
        weekly_growth: number;
        monthly_growth: number;
        customer_retention_rate: number;
        popular_products: Array<{
            product_id: string;
            product_name: string;
            quantity_sold: number;
        }>;
    };
}

// ==================== TYPES POUR LES API RESPONSES ====================

/**
 * Réponse pour la liste des points de retrait
 */
export interface PickupPointListResponse {
    pickup_points: PickupPoint[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
    };
    filters?: {
        status?: PickupPointStatus[];
        type?: PickupPointType[];
        access_type?: AccessType[];
        facility?: FacilityType[];
        city?: string;
        postal_code?: string;
        distance?: number;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    summary: {
        active_count: number;
        total_capacity: number;
        average_rating: number;
    };
}

/**
 * Réponse détaillée d'un point de retrait
 */
export interface PickupPointDetailResponse {
    pickup_point: PickupPoint;
    schedule: PickupPointSchedule[];
    upcoming_slots: Array<{
        date: string;
        available_slots: number;
        next_available_time?: string;
    }>;
    statistics: PickupPointStats;
    nearby_points?: Array<{
        id: string;
        name: string;
        distance_km: number;
        type: PickupPointType;
    }>;
}

/**
 * Réponse pour la recherche de points de retrait
 */
export interface PickupPointSearchResponse {
    results: Array<{
        pickup_point: PickupPoint;
        distance_km: number;
        travel_time_minutes: number;
        availability_today: {
            is_open: boolean;
            next_available_slot?: string;
            available_slots: number;
        };
        match_score: number; // Score de pertinence (0-100)
    }>;
    search_metadata: {
        query: string;
        total_results: number;
        search_time_ms: number;
        suggestions?: string[];
    };
}

// ==================== TYPES POUR LA GÉOLOCALISATION ====================

/**
 * Résultat de géocodage
 */
export interface GeocodingResult {
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    formatted_address: string;
    place_id?: string;
    types: string[];
    accuracy: 'high' | 'medium' | 'low';
    components: {
        street?: string;
        street_number?: string;
        city: string;
        postal_code: string;
        country: string;
        department?: string;
        region?: string;
    };
}

/**
 * Calcul d'itinéraire
 */
export interface RouteCalculation {
    origin: {
        lat: number;
        lng: number;
    };
    destination: {
        lat: number;
        lng: number;
    };
    distance_km: number;
    duration_minutes: number;
    polyline?: string; // Pour l'affichage sur carte
    steps: Array<{
        instruction: string;
        distance_km: number;
        duration_minutes: number;
    }>;
    mode: 'driving' | 'walking' | 'bicycling' | 'transit';
}

// ==================== TYPES POUR LA CONFIGURATION ====================

/**
 * Configuration d'un point de retrait
 */
export interface PickupPointConfig {
    // Général
    timezone: string;
    currency: string;
    language: string;

    // Réservations
    booking: {
        min_advance_hours: number;
        max_advance_days: number;
        cancellation_hours: number;
        modification_hours: number;
        auto_confirm: boolean;
        require_confirmation: boolean;
    };

    // Créneaux
    slots: {
        default_duration_minutes: number;
        buffer_minutes: number;
        max_per_day: number;
        peak_hours: Array<{
            start_time: string;
            end_time: string;
            multiplier?: number; // Multiplicateur pour frais de pointe
        }>;
    };

    // Notifications
    notifications: {
        new_order: boolean;
        order_modified: boolean;
        order_cancelled: boolean;
        slot_reminder: boolean;
        review_received: boolean;
    };

    // Intégrations
    integrations: {
        google_maps: boolean;
        calendar_sync: boolean;
        payment_gateway: string;
        inventory_system?: string;
    };

    // Sécurité
    security: {
        require_identity_check: boolean;
        qr_code_validation: boolean;
        check_in_required: boolean;
        max_attempts: number;
    };
}

// ==================== TYPES POUR LES FILTRES ====================

/**
 * Filtres pour la recherche de points de retrait
 */
export interface PickupPointFilters {
    // Localisation
    coordinates?: {
        lat: number;
        lng: number;
    };
    radius_km?: number;
    city?: string;
    postal_code?: string;
    region?: string;

    // Type et statut
    types?: PickupPointType[];
    status?: PickupPointStatus[];
    access_types?: AccessType[];
    facilities?: FacilityType[];

    // Capacité et disponibilité
    min_capacity?: number;
    available_now?: boolean;
    date?: string;
    time_range?: {
        start: string;
        end: string;
    };

    // Services
    has_parking?: boolean;
    has_refrigeration?: boolean;
    accepts_card?: boolean;
    free_pickup?: boolean;

    // Producteur
    producer_id?: string;
    producer_certifications?: string[];
    production_types?: string[];

    // Notation
    min_rating?: number;
    min_reviews?: number;

    // Pagination
    page?: number;
    limit?: number;
    sort_by?: 'distance' | 'rating' | 'name' | 'capacity' | 'popularity';
    sort_order?: 'asc' | 'desc';

    // Recherche texte
    search?: string;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Obtient le nom du type de point de retrait
 */
export const getPickupPointTypeName = (type: PickupPointType): string => {
    const names: Record<PickupPointType, string> = {
        [PickupPointType.FARM]: 'À la ferme',
        [PickupPointType.FARMERS_MARKET]: 'Marché de producteurs',
        [PickupPointType.DELIVERY_POINT]: 'Point relais',
        [PickupPointType.DRIVE_THRU]: 'Drive',
        [PickupPointType.COMMUNITY_POINT]: 'Point communautaire',
        [PickupPointType.MOBILE_TRUCK]: 'Camion itinérant',
        [PickupPointType.URBAN_FARM]: 'Ferme urbaine',
        [PickupPointType.COLLECTIVE_POINT]: 'Point collectif',
        [PickupPointType.HOME_DELIVERY]: 'Livraison à domicile',
        [PickupPointType.POPUP_STORE]: 'Boutique éphémère',
        [PickupPointType.WORKPLACE]: 'Lieu de travail',
        [PickupPointType.OTHER]: 'Autre'
    };
    return names[type] || type;
};

/**
 * Obtient l'icône pour un type de point de retrait
 */
export const getPickupPointTypeIcon = (type: PickupPointType): string => {
    const icons: Record<PickupPointType, string> = {
        [PickupPointType.FARM]: 'tractor',
        [PickupPointType.FARMERS_MARKET]: 'shopping-basket',
        [PickupPointType.DELIVERY_POINT]: 'package',
        [PickupPointType.DRIVE_THRU]: 'truck',
        [PickupPointType.COMMUNITY_POINT]: 'users',
        [PickupPointType.MOBILE_TRUCK]: 'truck',
        [PickupPointType.URBAN_FARM]: 'leaf',
        [PickupPointType.COLLECTIVE_POINT]: 'building-storefront',
        [PickupPointType.HOME_DELIVERY]: 'home',
        [PickupPointType.POPUP_STORE]: 'sparkles',
        [PickupPointType.WORKPLACE]: 'briefcase',
        [PickupPointType.OTHER]: 'map-pin'
    };
    return icons[type] || 'map-pin';
};

/**
 * Obtient la couleur pour un statut de point de retrait
 */
export const getPickupPointStatusColor = (status: PickupPointStatus): string => {
    const colors: Record<PickupPointStatus, string> = {
        [PickupPointStatus.ACTIVE]: 'bg-green-100 text-green-800',
        [PickupPointStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
        [PickupPointStatus.COMING_SOON]: 'bg-blue-100 text-blue-800',
        [PickupPointStatus.TEMPORARILY_CLOSED]: 'bg-orange-100 text-orange-800',
        [PickupPointStatus.PERMANENTLY_CLOSED]: 'bg-red-100 text-red-800',
        [PickupPointStatus.UNDER_MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
        [PickupPointStatus.FULL_CAPACITY]: 'bg-purple-100 text-purple-800'
    };
    return colors[status];
};

/**
 * Vérifie si un point de retrait est actuellement ouvert
 */
export const isPickupPointOpen = (
    pickupPoint: PickupPoint,
    date: Date = new Date()
): boolean => {
    const now = date;
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Convertir en 1-7

    // Vérifier le statut général
    if (pickupPoint.status !== PickupPointStatus.ACTIVE) {
        return false;
    }

    // Vérifier les horaires spéciaux pour aujourd'hui
    const todayStr = now.toISOString().split('T')[0];
    const specialHour = pickupPoint.special_hours?.find(
        sh => sh.date === todayStr
    );

    if (specialHour) {
        if (specialHour.is_closed) return false;
        if (specialHour.open_time && specialHour.close_time) {
            const [openHour, openMinute] = specialHour.open_time.split(':').map(Number);
            const [closeHour, closeMinute] = specialHour.close_time.split(':').map(Number);

            const openTime = new Date(now);
            openTime.setHours(openHour, openMinute, 0, 0);

            const closeTime = new Date(now);
            closeTime.setHours(closeHour, closeMinute, 0, 0);

            return now >= openTime && now <= closeTime;
        }
    }

    // Vérifier les horaires réguliers
    const schedule = pickupPoint.opening_hours?.find(
        oh => oh.day_of_week === dayOfWeek && oh.is_active
    );

    if (!schedule) return false;

    const [openHour, openMinute] = schedule.open_time.split(':').map(Number);
    const [closeHour, closeMinute] = schedule.close_time.split(':').map(Number);

    const openTime = new Date(now);
    openTime.setHours(openHour, openMinute, 0, 0);

    const closeTime = new Date(now);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    return now >= openTime && now <= closeTime;
};

/**
 * Calcule la distance entre deux points en kilomètres
 */
export const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Formate l'adresse d'un point de retrait
 */
export const formatAddress = (pickupPoint: PickupPoint): string => {
    const addr = pickupPoint.address;
    let formatted = '';

    if (addr.street_number && addr.street) {
        formatted += `${addr.street_number} ${addr.street}`;
    } else if (addr.street) {
        formatted += addr.street;
    }

    if (formatted && (addr.postal_code || addr.city)) {
        formatted += ', ';
    }

    if (addr.postal_code && addr.city) {
        formatted += `${addr.postal_code} ${addr.city}`;
    } else if (addr.postal_code) {
        formatted += addr.postal_code;
    } else if (addr.city) {
        formatted += addr.city;
    }

    if (addr.country && addr.country !== 'France') {
        formatted += `, ${addr.country}`;
    }

    return formatted;
};

/**
 * Obtient l'URL Google Maps pour un point de retrait
 */
export const getGoogleMapsUrl = (pickupPoint: PickupPoint): string => {
    const { lat, lng } = pickupPoint.coordinates;
    const address = encodeURIComponent(formatAddress(pickupPoint));
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${address}`;
};

/**
 * Vérifie si un point de retrait a une certaine facilité
 */
export const hasFacility = (
    pickupPoint: PickupPoint,
    facility: FacilityType
): boolean => {
    return pickupPoint.facilities.includes(facility);
};

/**
 * Obtient les prochains créneaux disponibles
 */
export const getNextAvailableSlots = (
    pickupPoint: PickupPoint,
    date: Date = new Date(),
    count: number = 3
): Array<{ date: string; time: string; available: number }> => {
    // Cette fonction simulerait la récupération des créneaux disponibles
    // Dans une implémentation réelle, cela ferait un appel API
    const slots: Array<{ date: string; time: string; available: number }> = [];

    for (let i = 0; i < count; i++) {
        const slotDate = new Date(date);
        slotDate.setDate(slotDate.getDate() + i);

        // Simulation de créneaux disponibles
        if (isPickupPointOpen(pickupPoint, slotDate)) {
            slots.push({
                date: slotDate.toISOString().split('T')[0],
                time: i === 0 ? 'Dans 1 heure' : `${slotDate.getHours()}:00`,
                available: Math.floor(Math.random() * 10) + 1
            });
        }
    }

    return slots;
};

/**
 * Calcule le temps de trajet estimé
 */
export const calculateTravelTime = (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: 'driving' | 'walking' | 'bicycling' = 'driving'
): number => {
    const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);

    const speeds: Record<typeof mode, number> = {
        driving: 50,    // km/h en ville
        walking: 5,     // km/h
        bicycling: 15   // km/h
    };

    return Math.round((distance / speeds[mode]) * 60); // en minutes
};

/**
 * Vérifie la validité d'un point de retrait
 */
export const validatePickupPoint = (pickupPoint: Partial<PickupPoint>): string[] => {
    const errors: string[] = [];

    if (!pickupPoint.name?.trim()) errors.push('Le nom est requis');
    if (!pickupPoint.address?.street?.trim()) errors.push('La rue est requise');
    if (!pickupPoint.address?.city?.trim()) errors.push('La ville est requise');
    if (!pickupPoint.address?.postal_code?.trim()) errors.push('Le code postal est requis');
    if (!pickupPoint.coordinates?.lat || !pickupPoint.coordinates?.lng) {
        errors.push('Les coordonnées sont requises');
    }
    if (!pickupPoint.instructions?.trim()) errors.push('Les instructions sont requises');
    if (pickupPoint.capacity?.max_daily_orders === undefined || pickupPoint.capacity.max_daily_orders <= 0) {
        errors.push('La capacité maximale doit être supérieure à 0');
    }

    return errors;
};

// ==================== EXPORTS ====================

export type {
    PickupPoint as PickupLocation,
    CreatePickupPointRequest as NewPickupPoint,
    UpdatePickupPointRequest as PickupPointUpdate,
    PickupPointListResponse as PaginatedPickupPoints,
    PickupPointStats as PickupPointStatistics,
    PickupPointAvailability as Availability,
    PickupPointCalendar as CalendarView
};

/**
 * Type guard pour vérifier si un objet est un PickupPoint
 */
export const isPickupPoint = (obj: unknown): obj is PickupPoint => {
    return obj !== null &&
        typeof obj === 'object' &&
        obj &&
        'id' in obj && typeof (obj as any).id === 'string' &&
        'producer_id' in obj && typeof (obj as any).producer_id === 'string' &&
        'name' in obj && typeof (obj as any).name === 'string' &&
        'type' in obj && typeof (obj as any).type === 'string' &&
        'status' in obj && typeof (obj as any).status === 'string' &&
        'address' in obj && (obj as any).address && typeof (obj as any).address.street === 'string' &&
        'coordinates' in obj && (obj as any).coordinates && typeof (obj as any).coordinates.lat === 'number' &&
        typeof (obj as any).coordinates.lng === 'number' &&
        'instructions' in obj && typeof (obj as any).instructions === 'string' &&
        'is_active' in obj && typeof (obj as any).is_active === 'boolean';
};

/**
 * Type guard pour vérifier si un objet est un CreatePickupPointRequest
 */
export const isCreatePickupPointRequest = (obj: unknown): obj is CreatePickupPointRequest => {
    return obj !== null &&
        typeof obj === 'object' &&
        obj &&
        'name' in obj && typeof (obj as any).name === 'string' &&
        'address' in obj && (obj as any).address && typeof (obj as any).address.street === 'string' &&
        'coordinates' in obj && (obj as any).coordinates && typeof (obj as any).coordinates.lat === 'number' &&
        typeof (obj as any).coordinates.lng === 'number' &&
        'instructions' in obj && typeof (obj as any).instructions === 'string' &&
        'capacity' in obj && (obj as any).capacity && typeof (obj as any).capacity.max_daily_orders === 'number';
};