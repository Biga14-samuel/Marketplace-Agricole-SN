// src/modules/catalog/services/types/inventory.types.ts

// ============================================
// Types de base pour l'inventaire
// ============================================

/**
 * État du stock
 */
export enum StockStatus {
    IN_STOCK = 'in_stock',
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    BACKORDER = 'backorder',
    DISCONTINUED = 'discontinued',
}

/**
 * Type de stock
 */
export enum StockType {
    PHYSICAL = 'physical',
    VIRTUAL = 'virtual',
    RESERVED = 'reserved',
    AVAILABLE = 'available',
    QUARANTINE = 'quarantine',
}

/**
 * Emplacement de stock
 */
export interface StockLocation {
    id: string;
    name: string;
    code: string;
    description?: string;
    address?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Niveau de stock par emplacement
 */
export interface StockLevel {
    product_id: string;
    variant_id?: string;
    location_id: string;
    quantity: number;
    reserved_quantity: number;
    available_quantity: number;
    minimum_quantity: number;
    maximum_quantity: number;
    reorder_point: number;
    last_counted_at?: string;
    last_updated_at: string;
}

// ============================================
// Types pour les mouvements de stock
// ============================================

/**
 * Type de mouvement de stock
 */
export enum InventoryMovementType {
    INBOUND = 'inbound',
    OUTBOUND = 'outbound',
    ADJUSTMENT = 'adjustment',
    TRANSFER = 'transfer',
    RESERVATION = 'reservation',
    RELEASE = 'release',
    COUNT = 'count',
    DAMAGED = 'damaged',
    EXPIRED = 'expired',
    RETURN = 'return',
    LOSS = 'loss',
}

/**
 * Statut de mouvement de stock
 */
export enum MovementStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    PARTIAL = 'partial',
    ERROR = 'error',
}

/**
 * Source/destination de mouvement
 */
export enum MovementSourceType {
    SUPPLIER = 'supplier',
    CUSTOMER = 'customer',
    WAREHOUSE = 'warehouse',
    PRODUCTION = 'production',
    QUALITY = 'quality',
    OTHER = 'other',
}

/**
 * Mouvement de stock détaillé
 */
export interface InventoryMovement {
    id: string;
    reference_number: string;
    product_id: string;
    variant_id?: string;
    movement_type: InventoryMovementType;
    quantity: number;
    unit_cost?: number;
    total_cost?: number;
    source_type?: MovementSourceType;
    source_id?: string;
    source_name?: string;
    destination_type?: MovementSourceType;
    destination_id?: string;
    destination_name?: string;
    from_location_id?: string;
    to_location_id?: string;
    status: MovementStatus;
    notes?: string;
    created_by?: string;
    approved_by?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Ligne de mouvement de stock (pour les documents)
 */
export interface MovementLineItem {
    id: string;
    movement_id: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    unit_cost?: number;
    total_cost?: number;
    batch_number?: string;
    expiry_date?: string;
    serial_numbers?: string[];
    notes?: string;
}

// ============================================
// Types pour les ajustements de stock
// ============================================

/**
 * Type d'ajustement
 */
export enum AdjustmentType {
    MANUAL = 'manual',
    COUNT = 'count',
    DAMAGE = 'damage',
    EXPIRY = 'expiry',
    THEFT = 'theft',
    QUALITY = 'quality',
    SYSTEM = 'system',
    OTHER = 'other',
}

/**
 * Ajustement de stock
 */
export interface StockAdjustment {
    id: string;
    reference_number: string;
    product_id: string;
    variant_id?: string;
    location_id: string;
    adjustment_type: AdjustmentType;
    quantity_change: number;
    previous_quantity: number;
    new_quantity: number;
    reason: string;
    cost_impact?: number;
    approved_by?: string;
    approved_at?: string;
    created_by: string;
    created_at: string;
}

/**
 * Requête pour un ajustement de stock
 */
export interface CreateAdjustmentRequest {
    product_id: string;
    variant_id?: string;
    location_id: string;
    adjustment_type: AdjustmentType;
    quantity_change: number;
    reason: string;
    notes?: string;
    cost_impact?: number;
}

// ============================================
// Types pour les transferts de stock
// ============================================

/**
 * Statut de transfert
 */
export enum TransferStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    IN_TRANSIT = 'in_transit',
    PARTIAL = 'partial',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

/**
 * Transfert de stock
 */
export interface StockTransfer {
    id: string;
    reference_number: string;
    from_location_id: string;
    to_location_id: string;
    status: TransferStatus;
    expected_date?: string;
    actual_date?: string;
    notes?: string;
    created_by: string;
    approved_by?: string;
    completed_by?: string;
    created_at: string;
    updated_at: string;
    items: TransferItem[];
}

/**
 * Item de transfert
 */
export interface TransferItem {
    id: string;
    transfer_id: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    quantity_sent?: number;
    quantity_received?: number;
    unit_cost?: number;
    batch_number?: string;
    expiry_date?: string;
    notes?: string;
}

/**
 * Requête pour créer un transfert
 */
export interface CreateTransferRequest {
    from_location_id: string;
    to_location_id: string;
    expected_date?: string;
    notes?: string;
    items: Array<{
        product_id: string;
        variant_id?: string;
        quantity: number;
        batch_number?: string;
        expiry_date?: string;
    }>;
}

// ============================================
// Types pour les inventaires physiques
// ============================================

/**
 * Type de comptage
 */
export enum CountType {
    CYCLE = 'cycle',
    FULL = 'full',
    SPOT = 'spot',
    ADJUSTMENT = 'adjustment',
}

/**
 * Statut de comptage
 */
export enum CountStatus {
    PLANNED = 'planned',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    ADJUSTED = 'adjusted',
}

/**
 * Comptage d'inventaire
 */
export interface StockCount {
    id: string;
    reference_number: string;
    location_id: string;
    count_type: CountType;
    status: CountStatus;
    scheduled_date?: string;
    start_date?: string;
    end_date?: string;
    counted_by?: string[];
    variance_threshold?: number;
    notes?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    items: CountItem[];
    summary?: CountSummary;
}

/**
 * Item de comptage
 */
export interface CountItem {
    id: string;
    count_id: string;
    product_id: string;
    variant_id?: string;
    expected_quantity: number;
    counted_quantity: number;
    variance: number;
    variance_percentage: number;
    batch_number?: string;
    expiry_date?: string;
    counted_by?: string;
    counted_at?: string;
    notes?: string;
}

/**
 * Résumé de comptage
 */
export interface CountSummary {
    total_items: number;
    counted_items: number;
    pending_items: number;
    total_expected: number;
    total_counted: number;
    total_variance: number;
    total_variance_value: number;
    items_with_variance: number;
    accuracy_percentage: number;
}

// ============================================
// Types pour les réservations de stock
// ============================================

/**
 * Type de réservation
 */
export enum ReservationType {
    ORDER = 'order',
    QUOTE = 'quote',
    PRODUCTION = 'production',
    MAINTENANCE = 'maintenance',
    OTHER = 'other',
}

/**
 * Statut de réservation
 */
export enum ReservationStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    RELEASED = 'released',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

/**
 * Réservation de stock
 */
export interface StockReservation {
    id: string;
    reference_number: string;
    reservation_type: ReservationType;
    status: ReservationStatus;
    product_id: string;
    variant_id?: string;
    location_id: string;
    quantity: number;
    reserved_quantity: number;
    released_quantity: number;
    requested_by: string;
    requested_for?: string;
    expected_use_date?: string;
    expiry_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// ============================================
// Types pour les lots/séries
// ============================================

/**
 * Lot de produit
 */
export interface ProductBatch {
    id: string;
    product_id: string;
    variant_id?: string;
    batch_number: string;
    manufacturer_lot?: string;
    quantity: number;
    available_quantity: number;
    reserved_quantity: number;
    unit_cost?: number;
    manufacturing_date?: string;
    expiry_date?: string;
    received_date: string;
    supplier_id?: string;
    supplier_batch?: string;
    location_id: string;
    status: 'active' | 'expired' | 'quarantine' | 'consumed';
    notes?: string;
    created_at: string;
    updated_at: string;
}

/**
 Numéro de série
 */
export interface SerialNumber {
    id: string;
    product_id: string;
    variant_id?: string;
    serial_number: string;
    batch_id?: string;
    status: 'available' | 'reserved' | 'sold' | 'returned' | 'defective';
    location_id: string;
    purchase_order_id?: string;
    sales_order_id?: string;
    warranty_start?: string;
    warranty_end?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// ============================================
// Types pour les alertes de stock
// ============================================

/**
 * Type d'alerte
 */
export enum InventoryAlertType {
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    OVERSTOCK = 'overstock',
    EXPIRY = 'expiry',
    SLOW_MOVING = 'slow_moving',
    OBSOLETE = 'obsolete',
    CUSTOM = 'custom',
}

/**
 * Priorité d'alerte
 */
export enum AlertPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

/**
 * Alerte d'inventaire
 */
export interface InventoryAlert {
    id: string;
    alert_type: InventoryAlertType;
    priority: AlertPriority;
    product_id: string;
    variant_id?: string;
    location_id?: string;
    threshold_value: number;
    current_value: number;
    is_triggered: boolean;
    triggered_at?: string;
    notification_sent: boolean;
    notification_count: number;
    last_notification_at?: string;
    acknowledged_by?: string;
    acknowledged_at?: string;
    resolution_notes?: string;
    created_at: string;
    updated_at: string;
}

// ============================================
// Types pour les requêtes API d'inventaire
// ============================================

/**
 * Paramètres de recherche des mouvements
 */
export interface SearchMovementsParams {
    // Pagination
    page?: number;
    limit?: number;

    // Filtres
    product_id?: string;
    variant_id?: string;
    location_id?: string;
    movement_type?: InventoryMovementType;
    status?: MovementStatus;
    reference_number?: string;
    source_type?: MovementSourceType;
    destination_type?: MovementSourceType;

    // Date range
    from_date?: string;
    to_date?: string;
    created_from?: string;
    created_to?: string;

    // Tri
    sort_by?: 'created_at' | 'updated_at' | 'quantity' | 'reference_number';
    sort_order?: 'asc' | 'desc';
}

/**
 * Paramètres de recherche des ajustements
 */
export interface SearchAdjustmentsParams {
    page?: number;
    limit?: number;
    product_id?: string;
    variant_id?: string;
    location_id?: string;
    adjustment_type?: AdjustmentType;
    from_date?: string;
    to_date?: string;
    sort_by?: 'created_at' | 'quantity_change';
    sort_order?: 'asc' | 'desc';
}

/**
 * Paramètres de recherche des transferts
 */
export interface SearchTransfersParams {
    page?: number;
    limit?: number;
    from_location_id?: string;
    to_location_id?: string;
    status?: TransferStatus;
    reference_number?: string;
    from_date?: string;
    to_date?: string;
    sort_by?: 'created_at' | 'expected_date';
    sort_order?: 'asc' | 'desc';
}

/**
 * Paramètres de recherche des comptages
 */
export interface SearchCountsParams {
    page?: number;
    limit?: number;
    location_id?: string;
    count_type?: CountType;
    status?: CountStatus;
    from_date?: string;
    to_date?: string;
    sort_by?: 'scheduled_date' | 'created_at';
    sort_order?: 'asc' | 'desc';
}

// ============================================
// Types pour les réponses API d'inventaire
// ============================================

/**
 * Réponse pour les mouvements de stock
 */
export interface MovementsResponse {
    movements: InventoryMovement[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

/**
 * Réponse pour les ajustements de stock
 */
export interface AdjustmentsResponse {
    adjustments: StockAdjustment[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

/**
 * Réponse pour les transferts de stock
 */
export interface TransfersResponse {
    transfers: StockTransfer[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

/**
 * Réponse pour les comptages d'inventaire
 */
export interface CountsResponse {
    counts: StockCount[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

/**
 * Réponse pour les niveaux de stock
 */
export interface StockLevelsResponse {
    stock_levels: StockLevel[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    summary: {
        total_products: number;
        total_quantity: number;
        total_value: number;
        low_stock_items: number;
        out_of_stock_items: number;
    };
}

// ============================================
// Types pour les mises à jour de stock (endpoints)
// ============================================

/**
 * Requête pour mettre à jour le stock (endpoint POST /products/{id}/stock)
 */
export interface UpdateStockRequest {
    stock_quantity: number;
    adjustment_reason?: string;
    location_id?: string;
    movement_type?: InventoryMovementType;
    unit_cost?: number;
    reference_number?: string;
}

/**
 * Requête pour créer une alerte de stock (endpoint POST /products/{id}/stock-alert)
 */
export interface CreateStockAlertRequest {
    threshold: number;
    alert_type: InventoryAlertType;
    location_id?: string;
    is_active?: boolean;
    priority?: AlertPriority;
    notification_emails?: string[];
}

/**
 * Requête pour réserver du stock
 */
export interface ReserveStockRequest {
    product_id: string;
    variant_id?: string;
    quantity: number;
    reservation_type: ReservationType;
    location_id?: string;
    expected_use_date?: string;
    expiry_date?: string;
    notes?: string;
}

/**
 * Requête pour libérer une réservation
 */
export interface ReleaseReservationRequest {
    reservation_id: string;
    quantity?: number;
    notes?: string;
}

// ============================================
// Types pour les formulaires d'inventaire
// ============================================

/**
 * Données de formulaire pour un ajustement de stock
 */
export interface AdjustmentFormData {
    product_id: string;
    variant_id?: string;
    location_id: string;
    adjustment_type: AdjustmentType;
    quantity_change: number;
    reason: string;
    notes?: string;
    cost_impact?: number;
    batch_number?: string;
    expiry_date?: string;
}

/**
 * Données de formulaire pour un transfert
 */
export interface TransferFormData {
    from_location_id: string;
    to_location_id: string;
    expected_date?: string;
    notes?: string;
    items: Array<{
        product_id: string;
        variant_id?: string;
        quantity: number;
        batch_number?: string;
        expiry_date?: string;
    }>;
}

/**
 * Données de formulaire pour un comptage
 */
export interface CountFormData {
    location_id: string;
    count_type: CountType;
    scheduled_date?: string;
    variance_threshold?: number;
    notes?: string;
    items?: Array<{
        product_id: string;
        variant_id?: string;
        expected_quantity: number;
        batch_number?: string;
        expiry_date?: string;
    }>;
}

// ============================================
// Types pour les statistiques d'inventaire
// ============================================

/**
 * Statistiques d'inventaire
 */
export interface InventoryStats {
    total_products: number;
    total_skus: number;
    total_locations: number;
    total_stock_value: number;
    total_quantity: number;
    low_stock_items: number;
    out_of_stock_items: number;
    overstock_items: number;
    expired_items: number;
    slow_moving_items: number;
    turnover_rate: number;
    stock_accuracy: number;
    average_stock_days: number;
}

/**
 * Statistiques de mouvement
 */
export interface MovementStats {
    total_movements: number;
    total_inbound: number;
    total_outbound: number;
    total_adjustments: number;
    total_transfers: number;
    net_quantity_change: number;
    total_value_change: number;
    by_type: Record<InventoryMovementType, number>;
    by_location: Record<string, number>;
    busiest_day?: {
        date: string;
        count: number;
    };
}

/**
 * Rapport d'inventaire
 */
export interface InventoryReport {
    report_date: string;
    period_start: string;
    period_end: string;
    stats: InventoryStats;
    movement_stats: MovementStats;
    top_products: Array<{
        product_id: string;
        name: string;
        sku?: string;
        quantity: number;
        value: number;
        turnover: number;
    }>;
    alerts_summary: {
        total_alerts: number;
        by_type: Record<InventoryAlertType, number>;
        by_priority: Record<AlertPriority, number>;
    };
}

// ============================================
// Types pour les états UI d'inventaire
// ============================================

/**
 * État UI pour un mouvement
 */
export interface MovementUIState {
    id: string;
    is_loading: boolean;
    is_editing: boolean;
    is_selected: boolean;
    error?: string;
}

/**
 * État du gestionnaire d'inventaire
 */
export interface InventoryManagerState {
    movements: InventoryMovement[];
    adjustments: StockAdjustment[];
    transfers: StockTransfer[];
    counts: StockCount[];
    selected_ids: string[];
    filters: SearchMovementsParams;
    loading: boolean;
    error?: string;
    last_updated: string;
    stats?: InventoryStats;
}

// ============================================
// Types pour les événements d'inventaire
// ============================================

/**
 * Événement de mouvement de stock
 */
export interface StockMovementEvent {
    movement: InventoryMovement;
    product: {
        id: string;
        name: string;
        sku?: string;
    };
    location?: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        name: string;
    };
    timestamp: string;
}

/**
 * Événement d'alerte de stock
 */
export interface StockAlertEvent {
    alert: InventoryAlert;
    product: {
        id: string;
        name: string;
        sku?: string;
    };
    current_value: number;
    threshold_value: number;
    timestamp: string;
}

// ============================================
// Types pour les hooks d'inventaire
// ============================================

/**
 * Paramètres du hook useInventory
 */
export interface UseInventoryOptions {
    include_stats?: boolean;
    include_movements?: boolean;
    include_alerts?: boolean;
    auto_refresh?: boolean;
    refresh_interval?: number;
}

/**
 * Valeur de retour du hook useInventory
 */
export interface UseInventoryReturn {
    stats?: InventoryStats;
    movements: InventoryMovement[];
    alerts: InventoryAlert[];
    loading: boolean;
    error?: Error;
    refresh: () => Promise<void>;
    getProductStock: (productId: string, variantId?: string) => number;
    getLocationStock: (locationId: string) => number;
    updateStock: (request: UpdateStockRequest) => Promise<void>;
    createAlert: (request: CreateStockAlertRequest) => Promise<void>;
}

// ============================================
// Types pour les erreurs d'inventaire
// ============================================

/**
 * Erreur spécifique à l'inventaire
 */
export interface InventoryError {
    code: InventoryErrorCode;
    message: string;
    product_id?: string;
    location_id?: string;
    movement_id?: string;
    details?: any;
}

/**
 * Codes d'erreur pour l'inventaire
 */
export enum InventoryErrorCode {
    INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
    LOCATION_NOT_FOUND = 'LOCATION_NOT_FOUND',
    MOVEMENT_NOT_FOUND = 'MOVEMENT_NOT_FOUND',
    TRANSFER_NOT_FOUND = 'TRANSFER_NOT_FOUND',
    COUNT_NOT_FOUND = 'COUNT_NOT_FOUND',
    BATCH_NOT_FOUND = 'BATCH_NOT_FOUND',
    INVALID_QUANTITY = 'INVALID_QUANTITY',
    INVALID_MOVEMENT_TYPE = 'INVALID_MOVEMENT_TYPE',
    DUPLICATE_REFERENCE = 'DUPLICATE_REFERENCE',
    STOCK_LOCKED = 'STOCK_LOCKED',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    BATCH_OPERATION_FAILED = 'BATCH_OPERATION_FAILED',
}

// ============================================
// Types pour les composants d'inventaire
// ============================================

/**
 * Props pour un composant de mouvement de stock
 */
export interface StockMovementComponentProps {
    movement: InventoryMovement;
    onView?: (movement: InventoryMovement) => void;
    onEdit?: (movement: InventoryMovement) => void;
    onDelete?: (movement: InventoryMovement) => void;
    showProduct?: boolean;
    showLocation?: boolean;
    showCost?: boolean;
    variant?: 'card' | 'list' | 'timeline';
}

/**
 * Props pour un composant d'alerte de stock
 */
export interface StockAlertComponentProps {
    alert: InventoryAlert;
    onAcknowledge?: (alert: InventoryAlert) => void;
    onResolve?: (alert: InventoryAlert) => void;
    showProduct?: boolean;
    showLocation?: boolean;
    showPriority?: boolean;
    variant?: 'card' | 'list' | 'badge';
}

/**
 * Props pour un composant de niveau de stock
 */
export interface StockLevelComponentProps {
    stockLevel: StockLevel;
    product?: {
        id: string;
        name: string;
        sku?: string;
        image_url?: string;
    };
    location?: {
        id: string;
        name: string;
    };
    onUpdate?: (stockLevel: StockLevel) => void;
    onViewHistory?: (stockLevel: StockLevel) => void;
    showProduct?: boolean;
    showLocation?: boolean;
    showActions?: boolean;
}

// ============================================
// Types pour les mutations d'inventaire
// ============================================

/**
 * Mutation pour mettre à jour le stock
 */
export interface UpdateStockMutation {
    request: UpdateStockRequest;
    response: {
        success: boolean;
        data: {
            product_id: string;
            new_quantity: number;
            movement_id: string;
        };
        message?: string;
    };
}

/**
 * Mutation pour créer une alerte de stock
 */
export interface CreateStockAlertMutation {
    request: CreateStockAlertRequest;
    response: {
        success: boolean;
        data: InventoryAlert;
        message?: string;
    };
}

/**
 * Mutation pour créer un ajustement
 */
export interface CreateAdjustmentMutation {
    request: CreateAdjustmentRequest;
    response: {
        success: boolean;
        data: StockAdjustment;
        message?: string;
    };
}

// ============================================
// Types pour les réponses d'endpoints spécifiques
// ============================================

/**
 * Réponse pour l'endpoint POST /products/{id}/stock
 */
export interface UpdateStockResponse {
    success: boolean;
    data: {
        product_id: string;
        variant_id?: string;
        old_quantity: number;
        new_quantity: number;
        movement_id: string;
        reference_number: string;
    };
    message?: string;
    errors?: InventoryError[];
}

/**
 * Réponse pour l'endpoint POST /products/{id}/stock-alert
 */
export interface CreateStockAlertResponse {
    success: boolean;
    data: InventoryAlert;
    message?: string;
    errors?: InventoryError[];
}

/**
 * Réponse pour la vérification de stock
 */
export interface StockAvailabilityResponse {
    product_id: string;
    variant_id?: string;
    requested_quantity: number;
    available_quantity: number;
    is_available: boolean;
    locations: Array<{
        location_id: string;
        location_name: string;
        available_quantity: number;
    }>;
    reservations?: Array<{
        reservation_id: string;
        quantity: number;
        expiry_date?: string;
    }>;
}