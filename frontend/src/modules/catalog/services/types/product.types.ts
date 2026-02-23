// src/modules/catalog/services/types/product.types.ts

// ============================================
// Types de base pour les produits
// ============================================

/**
 * État d'activité d'un produit
 */
export enum ProductStatus {
    ACTIVE = 'active',
    DRAFT = 'draft',
    ARCHIVED = 'archived',
    OUT_OF_STOCK = 'out_of_stock',
}

/**
 * Type de produit
 */
export enum ProductType {
    PHYSICAL = 'physical',
    DIGITAL = 'digital',
    SERVICE = 'service',
    BUNDLE = 'bundle',
}

/**
 * Interface de base pour un produit
 */
export interface ProductBase {
    name: string;
    description?: string;
    sku?: string;
    price: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    category_id?: string;
    unit_id?: string;
    tags: string[];
    is_active: boolean;
    is_virtual: boolean;
    weight?: number;
    dimensions?: ProductDimensions;
    metadata?: Record<string, any>;
}

/**
 * Dimensions d'un produit
 */
export interface ProductDimensions {
    length?: number;
    width?: number;
    height?: number;
    unit?: 'cm' | 'm' | 'in' | 'ft';
}

/**
 * Produit complet tel que retourné par l'API
 */
export interface Product extends ProductBase {
    id: string;
    created_at: string;
    updated_at: string;
    status: ProductStatus;
    type: ProductType;
    barcode?: string;
    tax_rate?: number;
    supplier_id?: string;
    supplier_sku?: string;
    minimum_order_quantity?: number;
    maximum_order_quantity?: number;
    lead_time_days?: number;
    expiry_date?: string;
    manufacturer?: string;
    brand?: string;
}

/**
 * Produit avec des métadonnées étendues
 */
export interface ProductWithMetadata extends Product {
    category_name?: string;
    unit_name?: string;
    tag_names?: string[];
    image_url?: string;
    total_sold?: number;
    average_rating?: number;
    review_count?: number;
}

// ============================================
// Types pour les images de produits
// ============================================

/**
 * Image de produit
 */
export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_main: boolean;
    order: number;
    created_at: string;
    updated_at?: string;
    file_size?: number;
    file_type?: string;
    dimensions?: {
        width: number;
        height: number;
    };
    thumbnail_url?: string;
    medium_url?: string;
    large_url?: string;
}

/**
 * Requête pour créer une image de produit
 */
export interface CreateProductImageRequest {
    url: string;
    alt_text?: string;
    is_main?: boolean;
    order?: number;
}

/**
 * Requête pour mettre à jour une image de produit
 */
export interface UpdateProductImageRequest {
    alt_text?: string;
    is_main?: boolean;
    order?: number;
}

// ============================================
// Types pour les variantes de produits
// ============================================

/**
 * Attribut de variante
 */
export interface VariantAttribute {
    name: string;
    value: string;
    display_name?: string;
}

/**
 * Variante de produit
 */
export interface ProductVariant {
    id: string;
    product_id: string;
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    attributes: VariantAttribute[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    barcode?: string;
    weight?: number;
    dimensions?: ProductDimensions;
    images?: string[]; // IDs des images spécifiques
}

/**
 * Requête pour créer une variante
 */
export interface CreateVariantRequest {
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    attributes: VariantAttribute[];
    is_active?: boolean;
    barcode?: string;
    weight?: number;
    dimensions?: ProductDimensions;
    images?: string[];
}

/**
 * Requête pour mettre à jour une variante
 */
export interface UpdateVariantRequest {
    name?: string;
    sku?: string;
    price?: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity?: number;
    low_stock_threshold?: number;
    attributes?: VariantAttribute[];
    is_active?: boolean;
    barcode?: string;
    weight?: number;
    dimensions?: ProductDimensions;
    images?: string[];
}

// ============================================
// Types pour les alertes de stock
// ============================================

/**
 * Type d'alerte de stock
 */
export enum StockAlertType {
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    CRITICAL_STOCK = 'critical_stock',
    OVERSTOCK = 'overstock',
    CUSTOM = 'custom',
}

/**
 * Sévérité d'alerte
 */
export enum AlertSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

/**
 * Alerte de stock
 */
export interface StockAlert {
    id: string;
    product_id: string;
    variant_id?: string;
    threshold: number;
    current_stock?: number;
    is_active: boolean;
    is_triggered: boolean;
    alert_type: StockAlertType;
    severity: AlertSeverity;
    created_at: string;
    updated_at?: string;
    triggered_at?: string;
    notification_sent: boolean;
    notification_count: number;
    last_notification_at?: string;
}

/**
 * Requête pour créer une alerte de stock
 */
export interface CreateStockAlertRequest {
    threshold: number;
    is_active?: boolean;
    alert_type?: StockAlertType;
    variant_id?: string;
}

/**
 * Requête pour mettre à jour une alerte de stock
 */
export interface UpdateStockAlertRequest {
    threshold?: number;
    is_active?: boolean;
    alert_type?: StockAlertType;
    severity?: AlertSeverity;
}

// ============================================
// Types pour les mouvements de stock
// ============================================

/**
 * Type de mouvement de stock
 */
export enum StockMovementType {
    INBOUND = 'inbound',
    OUTBOUND = 'outbound',
    ADJUSTMENT = 'adjustment',
    TRANSFER = 'transfer',
    RESERVATION = 'reservation',
    RELEASE = 'release',
    COUNT = 'count',
    DAMAGED = 'damaged',
    EXPIRED = 'expired',
}

/**
 * Référence de mouvement
 */
export enum StockReferenceType {
    ORDER = 'order',
    TRANSFER = 'transfer',
    ADJUSTMENT = 'adjustment',
    COUNT = 'count',
    PURCHASE_ORDER = 'purchase_order',
    RETURN = 'return',
    DAMAGE = 'damage',
    EXPIRY = 'expiry',
}

/**
 * Mouvement de stock
 */
export interface StockMovement {
    id: string;
    product_id: string;
    variant_id?: string;
    movement_type: StockMovementType;
    quantity: number;
    previous_quantity: number;
    new_quantity: number;
    reference_id?: string;
    reference_type?: StockReferenceType;
    adjustment_reason?: string;
    user_id?: string;
    user_name?: string;
    location_id?: string;
    location_name?: string;
    cost_price?: number;
    total_value?: number;
    notes?: string;
    created_at: string;
    updated_at?: string;
}

/**
 * Requête pour créer un mouvement de stock
 */
export interface CreateStockMovementRequest {
    product_id: string;
    variant_id?: string;
    movement_type: StockMovementType;
    quantity: number;
    reference_id?: string;
    reference_type?: StockReferenceType;
    adjustment_reason?: string;
    location_id?: string;
    cost_price?: number;
    notes?: string;
}

// ============================================
// Types pour les requêtes API de produits
// ============================================

/**
 * Requête pour créer un produit
 */
export interface CreateProductRequest {
    name: string;
    slug?: string;
    description?: string;
    sku?: string;
    price: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    category_id?: string;
    unit_id?: string;
    tags?: string[];
    tag_ids?: Array<string | number>;
    is_active?: boolean;
    is_virtual?: boolean;
    weight?: number;
    dimensions?: ProductDimensions;
    metadata?: Record<string, any>;
    status?: ProductStatus;
    type?: ProductType;
    barcode?: string;
    tax_rate?: number;
    supplier_id?: string;
    supplier_sku?: string;
    minimum_order_quantity?: number;
    maximum_order_quantity?: number;
    min_order?: number;
    max_order?: number;
    lead_time_days?: number;
    expiry_date?: string;
    harvest_date?: string | Date;
    manufacturer?: string;
    brand?: string;
    origin?: string;
    is_featured?: boolean;
}

/**
 * Requête pour mettre à jour un produit
 */
export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

/**
 * Requête pour mettre à jour le stock
 */
export interface UpdateStockRequest {
    stock_quantity: number;
    adjustment_reason?: string;
    movement_type?: StockMovementType;
}

/**
 * Paramètres de recherche de produits
 */
export interface SearchProductsParams {
    // Pagination
    page?: number;
    limit?: number;

    // Filtres
    search?: string;
    category_id?: string;
    tags?: string[];
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    is_active?: boolean;
    status?: ProductStatus;
    type?: ProductType;
    supplier_id?: string;
    manufacturer?: string;
    brand?: string;

    // Tri
    sort_by?: 'name' | 'price' | 'created_at' | 'updated_at' | 'stock_quantity' | 'total_sold';
    sort_order?: 'asc' | 'desc';

    // Date range
    created_from?: string;
    created_to?: string;
    updated_from?: string;
    updated_to?: string;
}

/**
 * Réponse paginée pour la recherche de produits
 */
export interface ProductsSearchResponse {
    products: ProductWithMetadata[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    aggregations?: ProductAggregations;
}

/**
 * Agrégations pour les produits
 */
export interface ProductAggregations {
    by_category?: Record<string, number>;
    by_status?: Record<ProductStatus, number>;
    by_type?: Record<ProductType, number>;
    price_range?: {
        min: number;
        max: number;
        avg: number;
    };
    stock_status?: {
        in_stock: number;
        low_stock: number;
        out_of_stock: number;
    };
}

// ============================================
// Types pour les produits complets
// ============================================

/**
 * Produit complet avec toutes les relations
 */
export interface CompleteProduct extends Product {
    category?: {
        id: string;
        name: string;
        path?: string[];
    };
    unit?: {
        id: string;
        name: string;
        symbol: string;
    };
    images: ProductImage[];
    variants: ProductVariant[];
    stock_alerts: StockAlert[];
    tag_details?: Array<{
        id: string;
        name: string;
        color?: string;
    }>;
    supplier?: {
        id: string;
        name: string;
        contact_email?: string;
    };
    stock_movements?: StockMovement[];
    total_sold?: number;
    revenue?: number;
    average_rating?: number;
}

/**
 * Produit simplifié pour les listes
 */
export interface ProductListItem {
    id: string;
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    stock_quantity: number;
    image_url?: string;
    category_name?: string;
    status: ProductStatus;
    is_active: boolean;
    created_at: string;
}

// ============================================
// Types pour les formulaires
// ============================================

/**
 * Données de formulaire pour créer/éditer un produit
 */
export interface ProductFormData extends Omit<CreateProductRequest, 'dimensions' | 'tags'> {
    id?: string;
    dimensions?: {
        length?: string;
        width?: string;
        height?: string;
        unit?: string;
    };
    tags?: Array<{ id: string; name: string }> | string[];
    images?: Array<File | string>;
    main_image_index?: number;
    variants?: Array<Partial<ProductVariant>>;
    seo_title?: string;
    seo_description?: string;
    meta_keywords?: string[];
}

/**
 * État de validation d'un formulaire de produit
 */
export interface ProductFormValidation {
    isValid: boolean;
    errors: {
        name?: string;
        sku?: string;
        price?: string;
        stock_quantity?: string;
        category_id?: string;
        [key: string]: string | undefined;
    };
}

// ============================================
// Types pour les sélecteurs
// ============================================

/**
 * Option de produit pour les sélecteurs
 */
export interface ProductOption {
    value: string;
    label: string;
    sku?: string;
    price?: number;
    stock?: number;
    disabled?: boolean;
    image_url?: string;
}

/**
 * Configuration pour les sélecteurs de produits
 */
export interface ProductSelectConfig {
    include_variants?: boolean;
    only_in_stock?: boolean;
    only_active?: boolean;
    category_id?: string;
    tags?: string[];
    min_price?: number;
    max_price?: number;
    limit?: number;
}

// ============================================
// Types pour les statistiques
// ============================================

/**
 * Statistiques d'un produit
 */
export interface ProductStats {
    product_id: string;
    total_sold: number;
    total_revenue: number;
    average_order_value: number;
    stock_turnover_rate: number;
    days_of_inventory: number;
    last_sale_date?: string;
    peak_sales_month?: string;
    conversion_rate?: number;
}

/**
 * Statistiques globales des produits
 */
export interface ProductsGlobalStats {
    total_products: number;
    active_products: number;
    out_of_stock_products: number;
    low_stock_products: number;
    total_stock_value: number;
    average_price: number;
    total_categories: number;
    most_expensive_product?: {
        id: string;
        name: string;
        price: number;
    };
    best_selling_product?: {
        id: string;
        name: string;
        total_sold: number;
    };
}

// ============================================
// Types pour les opérations en lot
// ============================================

/**
 * Requête pour mettre à jour plusieurs produits
 */
export interface BatchUpdateProductsRequest {
    updates: Array<{
        id: string;
        data: Partial<UpdateProductRequest>;
    }>;
}

/**
 * Requête pour mettre à jour le stock en lot
 */
export interface BatchUpdateStockRequest {
    updates: Array<{
        product_id: string;
        variant_id?: string;
        stock_quantity: number;
        adjustment_reason?: string;
    }>;
}

/**
 * Requête pour changer le statut en lot
 */
export interface BatchUpdateStatusRequest {
    product_ids: string[];
    status: ProductStatus;
    is_active?: boolean;
}

// ============================================
// Types pour les états UI
// ============================================

/**
 * État d'un produit dans l'interface utilisateur
 */
export interface ProductUIState {
    id: string;
    is_loading: boolean;
    is_editing: boolean;
    is_selected: boolean;
    is_expanded?: boolean;
    error?: string;
}

/**
 * État du gestionnaire de produits
 */
export interface ProductsManagerState {
    products: Product[];
    selected_ids: string[];
    filters: SearchProductsParams;
    loading: boolean;
    error?: string;
    last_updated: string;
    total_count: number;
}

// ============================================
// Types pour les événements
// ============================================

/**
 * Événement de sélection de produit
 */
export interface ProductSelectionEvent {
    product: Product;
    selected: boolean;
    shift_key: boolean;
    ctrl_key: boolean;
}

/**
 * Événement de changement de stock
 */
export interface StockChangeEvent {
    product_id: string;
    variant_id?: string;
    old_quantity: number;
    new_quantity: number;
    change: number;
    reason?: string;
    user_id?: string;
}

/**
 * Événement d'alerte de stock
 */
export interface StockAlertEvent {
    alert: StockAlert;
    product: Product;
    current_stock: number;
    timestamp: string;
}

// ============================================
// Types pour les hooks
// ============================================

/**
 * Paramètres du hook useProducts
 */
export interface UseProductsOptions {
    filters?: SearchProductsParams;
    auto_refresh?: boolean;
    refresh_interval?: number;
    include_metadata?: boolean;
}

/**
 * Valeur de retour du hook useProducts
 */
export interface UseProductsReturn {
    products: ProductWithMetadata[];
    loading: boolean;
    error?: Error;
    total: number;
    page: number;
    total_pages: number;
    refresh: () => Promise<void>;
    setFilters: (filters: SearchProductsParams) => void;
    getProduct: (id: string) => ProductWithMetadata | undefined;
}

/**
 * Paramètres du hook useProduct
 */
export interface UseProductOptions {
    include_complete?: boolean;
    include_stats?: boolean;
    include_stock_history?: boolean;
}

/**
 * Valeur de retour du hook useProduct
 */
export interface UseProductReturn {
    product: CompleteProduct | Product | null;
    loading: boolean;
    error?: Error;
    refresh: () => Promise<void>;
    update: (data: UpdateProductRequest) => Promise<Product>;
    delete: () => Promise<void>;
    updateStock: (data: UpdateStockRequest) => Promise<Product>;
    addImage: (data: CreateProductImageRequest) => Promise<ProductImage>;
    addVariant: (data: CreateVariantRequest) => Promise<ProductVariant>;
    addStockAlert: (data: CreateStockAlertRequest) => Promise<StockAlert>;
}

// ============================================
// Types pour les exports/imports
// ============================================

/**
 * Format d'exportation de produits
 */
export interface ProductExport {
    version: string;
    exported_at: string;
    products: Array<Product & {
        category_name?: string;
        unit_name?: string;
        tag_names?: string[];
        image_urls?: string[];
        variant_count?: number;
    }>;
    included_variants?: ProductVariant[];
    included_images?: ProductImage[];
    metadata: {
        total_products: number;
        total_variants: number;
        total_images: number;
        total_stock_value: number;
    };
}

/**
 * Format d'importation de produits
 */
export interface ProductImport {
    products: Array<{
        name: string;
        description?: string;
        sku?: string;
        price: number;
        compare_price?: number;
        stock_quantity: number;
        category_name?: string;
        unit_name?: string;
        tags?: string[];
        barcode?: string;
        weight?: number;
        dimensions?: ProductDimensions;
        supplier_name?: string;
        manufacturer?: string;
        brand?: string;
        images?: string[];
        variants?: Array<{
            name: string;
            sku?: string;
            price: number;
            stock_quantity: number;
            attributes: VariantAttribute[];
        }>;
    }>;
    options: {
        create_categories?: boolean;
        create_tags?: boolean;
        create_suppliers?: boolean;
        update_existing?: boolean;
        conflict_strategy: 'skip' | 'replace' | 'merge';
        import_images?: boolean;
        import_variants?: boolean;
    };
}

// ============================================
// Types pour les erreurs
// ============================================

/**
 * Erreur spécifique aux produits
 */
export interface ProductError {
    code: ProductErrorCode;
    message: string;
    product_id?: string;
    field?: keyof ProductBase;
    details?: any;
}

/**
 * Codes d'erreur pour les produits
 */
export enum ProductErrorCode {
    PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
    PRODUCT_SKU_EXISTS = 'PRODUCT_SKU_EXISTS',
    PRODUCT_BARCODE_EXISTS = 'PRODUCT_BARCODE_EXISTS',
    PRODUCT_HAS_VARIANTS = 'PRODUCT_HAS_VARIANTS',
    PRODUCT_HAS_ORDERS = 'PRODUCT_HAS_ORDERS',
    CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
    UNIT_NOT_FOUND = 'UNIT_NOT_FOUND',
    TAG_NOT_FOUND = 'TAG_NOT_FOUND',
    SUPPLIER_NOT_FOUND = 'SUPPLIER_NOT_FOUND',
    INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
    INVALID_PRICE = 'INVALID_PRICE',
    INVALID_STOCK = 'INVALID_STOCK',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    BATCH_OPERATION_FAILED = 'BATCH_OPERATION_FAILED',
}

// ============================================
// Types utilitaires
// ============================================

/**
 * Filtre pour les produits
 */
export type ProductFilter =
    | { type: 'all' }
    | { type: 'active' }
    | { type: 'inactive' }
    | { type: 'in_stock' }
    | { type: 'out_of_stock' }
    | { type: 'low_stock' }
    | { type: 'by_category'; category_id: string }
    | { type: 'by_tag'; tag_id: string }
    | { type: 'by_supplier'; supplier_id: string }
    | { type: 'by_price_range'; min: number; max: number }
    | { type: 'search'; query: string };

/**
 * Trier les produits
 */
export type ProductSort =
    | { field: 'name'; order: 'asc' | 'desc' }
    | { field: 'price'; order: 'asc' | 'desc' }
    | { field: 'stock_quantity'; order: 'asc' | 'desc' }
    | { field: 'created_at'; order: 'asc' | 'desc' }
    | { field: 'updated_at'; order: 'asc' | 'desc' }
    | { field: 'total_sold'; order: 'asc' | 'desc' };

/**
 * Options de pagination pour les produits
 */
export interface ProductPagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

/**
 * Configuration pour l'affichage des produits
 */
export interface ProductDisplayConfig {
    show_images?: boolean;
    show_prices?: boolean;
    show_stock?: boolean;
    show_sku?: boolean;
    show_category?: boolean;
    show_status?: boolean;
    show_actions?: boolean;
    image_size?: 'small' | 'medium' | 'large';
    grid_columns?: number;
}

/**
 * Contexte de produit pour les composants
 */
export interface ProductContext {
    product: Product;
    category?: {
        id: string;
        name: string;
    };
    unit?: {
        id: string;
        name: string;
        symbol: string;
    };
    tags: Array<{ id: string; name: string }>;
    images: ProductImage[];
    variants: ProductVariant[];
    stock_alerts: StockAlert[];
    is_in_stock: boolean;
    has_discount: boolean;
}

// ============================================
// Types génériques pour les réponses API
// ============================================

/**
 * Réponse API standard pour un produit
 */
export interface ProductResponse {
    success: boolean;
    data: Product;
    message?: string;
    errors?: ProductError[];
}

/**
 * Réponse API pour plusieurs produits
 */
export interface ProductsResponse {
    success: boolean;
    data: Product[];
    pagination?: ProductPagination;
    message?: string;
    errors?: ProductError[];
}

/**
 * Réponse API pour un produit complet
 */
export interface CompleteProductResponse {
    success: boolean;
    data: CompleteProduct;
    message?: string;
    errors?: ProductError[];
}

/**
 * Réponse API pour les images d'un produit
 */
export interface ProductImagesResponse {
    success: boolean;
    data: ProductImage[];
    message?: string;
    errors?: ProductError[];
}

/**
 * Réponse API pour les variantes d'un produit
 */
export interface ProductVariantsResponse {
    success: boolean;
    data: ProductVariant[];
    message?: string;
    errors?: ProductError[];
}

/**
 * Réponse API pour les alertes de stock d'un produit
 */
export interface StockAlertsResponse {
    success: boolean;
    data: StockAlert[];
    message?: string;
    errors?: ProductError[];
}

// ============================================
// Types pour les mutations (CRUD)
// ============================================

/**
 * Mutation pour créer un produit
 */
export interface CreateProductMutation {
    request: CreateProductRequest;
    response: ProductResponse;
}

/**
 * Mutation pour mettre à jour un produit
 */
export interface UpdateProductMutation {
    request: UpdateProductRequest;
    response: ProductResponse;
}

/**
 * Mutation pour supprimer un produit
 */
export interface DeleteProductMutation {
    request: void;
    response: { success: boolean; message?: string };
}

/**
 * Mutation pour mettre à jour le stock
 */
export interface UpdateStockMutation {
    request: UpdateStockRequest;
    response: ProductResponse;
}

/**
 * Mutation pour ajouter une image
 */
export interface AddProductImageMutation {
    request: CreateProductImageRequest;
    response: { success: boolean; data: ProductImage; message?: string };
}

/**
 * Mutation pour ajouter une variante
 */
export interface AddProductVariantMutation {
    request: CreateVariantRequest;
    response: { success: boolean; data: ProductVariant; message?: string };
}

/**
 * Mutation pour ajouter une alerte de stock
 */
export interface AddStockAlertMutation {
    request: CreateStockAlertRequest;
    response: { success: boolean; data: StockAlert; message?: string };
}

// ============================================
// Types pour les props de composants
// ============================================

/**
 * Props pour un composant de produit
 */
export interface ProductComponentProps {
    product: Product | ProductWithMetadata;
    onSelect?: (product: Product, selected: boolean) => void;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    onView?: (product: Product) => void;
    isSelected?: boolean;
    showImage?: boolean;
    showActions?: boolean;
    showStock?: boolean;
    showPrice?: boolean;
    showCategory?: boolean;
    showSku?: boolean;
    variant?: 'card' | 'list' | 'compact';
}

/**
 * Props pour une liste de produits
 */
export interface ProductListComponentProps {
    products: Array<Product | ProductWithMetadata>;
    loading?: boolean;
    onProductClick?: (product: Product) => void;
    onSelectionChange?: (selectedIds: string[]) => void;
    selectedIds?: string[];
    emptyMessage?: string;
    variant?: 'grid' | 'list';
    columns?: number;
    pagination?: ProductPagination;
    onPageChange?: (page: number) => void;
}

/**
 * Props pour un sélecteur de produits
 */
export interface ProductSelectComponentProps {
    value?: string | string[];
    onChange: (value: string | string[] | null) => void;
    multiple?: boolean;
    categoryFilter?: string;
    tagFilter?: string[];
    supplierFilter?: string;
    onlyInStock?: boolean;
    onlyActive?: boolean;
    placeholder?: string;
    disabled?: boolean;
    includeVariants?: boolean;
    className?: string;
}

/**
 * Props pour un formulaire de produit
 */
export interface ProductFormComponentProps {
    initialData?: ProductFormData;
    onSubmit: (data: ProductFormData) => Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
    error?: string;
    categories?: Array<{ id: string; name: string }>;
    units?: Array<{ id: string; name: string; symbol: string }>;
    tags?: Array<{ id: string; name: string }>;
    suppliers?: Array<{ id: string; name: string }>;
}

// ============================================
// Types pour les tests
// ============================================

/**
 * Données de test pour un produit
 */
export interface TestProduct {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
    category_id?: string;
    is_active: boolean;
}

/**
 * Configuration des tests de produits
 */
export interface ProductTestConfig {
    create_mock_products: (count: number) => TestProduct[];
    create_mock_product_with_variants: (variantCount: number) => TestProduct & { variants: any[] };
    validate_product_structure: (product: Product) => boolean;
    validate_product_form: (formData: ProductFormData) => string[];
}

// ============================================
// Types pour les endpoints spécifiques
// ============================================

/**
 * Types liés à l'endpoint GET /my-products
 */
export interface MyProductsParams extends Omit<SearchProductsParams, 'search'> {
    sort_by?: 'name' | 'price' | 'created_at' | 'updated_at' | 'stock_quantity';
}

/**
 * Types liés à l'endpoint POST /{product_id}/images
 */
export interface UploadProductImageRequest extends CreateProductImageRequest {
    file?: File;
}

/**
 * Types liés à l'endpoint POST /{product_id}/stock
 */
export interface ProductStockUpdateEvent {
    product_id: string;
    old_stock: number;
    new_stock: number;
    change: number;
    reason?: string;
    user_id?: string;
    timestamp: string;
}

/**
 * Types liés à l'endpoint GET /{product_id}/complete
 */
export interface CompleteProductOptions {
    include_category?: boolean;
    include_unit?: boolean;
    include_tags?: boolean;
    include_images?: boolean;
    include_variants?: boolean;
    include_stock_alerts?: boolean;
    include_supplier?: boolean;
    include_stats?: boolean;
}