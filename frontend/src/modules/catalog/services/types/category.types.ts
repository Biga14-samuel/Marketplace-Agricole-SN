// src/modules/catalog/services/types/category.types.ts

// ============================================
// Types de base pour les catégories
// ============================================

/**
 * Interface de base pour une catégorie
 */
export interface CategoryBase {
    name: string;
    description?: string;
    parent_id?: string | null;
    order?: number;
}

/**
 * Catégorie complète telle que retournée par l'API
 */
export interface Category extends CategoryBase {
    id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Catégorie avec des métadonnées étendues
 */
export interface CategoryWithMetadata extends Category {
    product_count?: number;
    subcategory_count?: number;
    is_selectable?: boolean;
}

/**
 * Catégorie pour l'affichage dans l'interface utilisateur
 */
export interface CategoryDisplay extends Category {
    display_name: string;
    level: number;
    has_children: boolean;
    is_expanded?: boolean;
    is_selected?: boolean;
}

// ============================================
// Types pour l'arborescence des catégories
// ============================================

/**
 * Nœud d'arbre de catégories (avec enfants)
 */
export interface CategoryTreeNode extends Category {
    children?: CategoryTreeNode[];
    level: number;
    is_leaf: boolean;
    path: string[];
}

/**
 * Structure complète d'un arbre de catégories
 */
export interface CategoryTree {
    root: CategoryTreeNode[];
    flat_map: Map<string, CategoryTreeNode>;
    max_depth: number;
}

/**
 * Chemin dans l'arbre des catégories
 */
export interface CategoryPath {
    ids: string[];
    names: string[];
    full_path: string;
}

// ============================================
// Types pour les requêtes API
// ============================================

/**
 * Requête pour créer une catégorie
 */
export interface CreateCategoryRequest extends CategoryBase { }

/**
 * Requête pour mettre à jour une catégorie
 */
export interface UpdateCategoryRequest extends Partial<CategoryBase> { }

/**
 * Paramètres de recherche de catégories
 */
export interface SearchCategoriesParams {
    search?: string;
    parent_id?: string | null;
    only_with_products?: boolean;
    only_active?: boolean;
    limit?: number;
    offset?: number;
}

/**
 * Réponse paginée pour la recherche de catégories
 */
export interface CategoriesSearchResponse {
    categories: CategoryWithMetadata[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

// ============================================
// Types pour les formulaires
// ============================================

/**
 * Données de formulaire pour créer/éditer une catégorie
 */
export interface CategoryFormData extends CategoryBase {
    id?: string;
    image?: File | string;
    seo_title?: string;
    seo_description?: string;
    meta_keywords?: string[];
}

/**
 * État de validation d'un formulaire de catégorie
 */
export interface CategoryFormValidation {
    isValid: boolean;
    errors: {
        name?: string;
        description?: string;
        parent_id?: string;
        order?: string;
    };
}

// ============================================
// Types pour les sélecteurs
// ============================================

/**
 * Option de catégorie pour les sélecteurs
 */
export interface CategoryOption {
    value: string;
    label: string;
    level: number;
    disabled?: boolean;
    parent_id?: string | null;
}

/**
 * Groupement de catégories pour les sélecteurs
 */
export interface CategoryGroup {
    label: string;
    options: CategoryOption[];
}

/**
 * Configuration pour les sélecteurs de catégories
 */
export interface CategorySelectConfig {
    include_root?: boolean;
    root_label?: string;
    max_depth?: number;
    exclude_ids?: string[];
    only_leaves?: boolean;
    sort_by?: 'name' | 'order' | 'product_count';
}

// ============================================
// Types pour les statistiques
// ============================================

/**
 * Statistiques d'une catégorie
 */
export interface CategoryStats {
    category_id: string;
    product_count: number;
    subcategory_count: number;
    total_products_in_tree: number;
    average_price?: number;
    total_stock?: number;
    last_updated?: string;
}

/**
 * Statistiques globales des catégories
 */
export interface CategoriesGlobalStats {
    total_categories: number;
    total_root_categories: number;
    max_depth: number;
    average_products_per_category: number;
    categories_without_products: number;
    most_popular_category?: {
        id: string;
        name: string;
        product_count: number;
    };
}

// ============================================
// Types pour les opérations en lot
// ============================================

/**
 * Requête pour mettre à jour plusieurs catégories
 */
export interface BatchUpdateCategoriesRequest {
    updates: Array<{
        id: string;
        data: Partial<CategoryBase>;
    }>;
}

/**
 * Requête pour réorganiser les catégories
 */
export interface ReorderCategoriesRequest {
    parent_id?: string | null;
    order_map: Array<{
        id: string;
        order: number;
    }>;
}

/**
 * Requête pour déplacer des catégories
 */
export interface MoveCategoriesRequest {
    category_ids: string[];
    new_parent_id: string | null;
}

// ============================================
// Types pour les états UI
// ============================================

/**
 * État d'une catégorie dans l'interface utilisateur
 */
export interface CategoryUIState {
    id: string;
    is_loading: boolean;
    is_editing: boolean;
    is_expanded: boolean;
    is_selected: boolean;
    error?: string;
}

/**
 * État du gestionnaire de catégories
 */
export interface CategoriesManagerState {
    categories: Category[];
    tree: CategoryTreeNode[];
    selected_ids: string[];
    expanded_ids: string[];
    loading: boolean;
    error?: string;
    last_updated: string;
}

// ============================================
// Types pour les événements
// ============================================

/**
 * Événement de sélection de catégorie
 */
export interface CategorySelectionEvent {
    category: Category;
    selected: boolean;
    shift_key: boolean;
    ctrl_key: boolean;
}

/**
 * Événement de déplacement de catégorie
 */
export interface CategoryMoveEvent {
    category_id: string;
    old_parent_id: string | null;
    new_parent_id: string | null;
    old_order: number;
    new_order: number;
}

/**
 * Événement de suppression de catégorie
 */
export interface CategoryDeleteEvent {
    category_id: string;
    parent_id: string | null;
    had_children: boolean;
    had_products: boolean;
}

// ============================================
// Types pour les hooks
// ============================================

/**
 * Paramètres du hook useCategories
 */
export interface UseCategoriesOptions {
    include_tree?: boolean;
    include_stats?: boolean;
    auto_refresh?: boolean;
    refresh_interval?: number;
}

/**
 * Valeur de retour du hook useCategories
 */
export interface UseCategoriesReturn {
    categories: Category[];
    tree: CategoryTreeNode[];
    loading: boolean;
    error?: Error;
    refresh: () => Promise<void>;
    getCategory: (id: string) => Category | undefined;
    getCategoryTree: (id: string) => CategoryTreeNode | undefined;
    getCategoryPath: (id: string) => CategoryPath;
}

/**
 * Paramètres du hook useCategory
 */
export interface UseCategoryOptions {
    include_products?: boolean;
    include_subcategories?: boolean;
    include_parents?: boolean;
}

/**
 * Valeur de retour du hook useCategory
 */
export interface UseCategoryReturn {
    category: CategoryWithMetadata | null;
    loading: boolean;
    error?: Error;
    refresh: () => Promise<void>;
    update: (data: UpdateCategoryRequest) => Promise<Category>;
    delete: () => Promise<void>;
}

// ============================================
// Types pour les exports/imports
// ============================================

/**
 * Format d'exportation de catégories
 */
export interface CategoryExport {
    version: string;
    exported_at: string;
    categories: Array<Category & {
        parent_name?: string;
        product_count?: number;
    }>;
    metadata: {
        total_categories: number;
        total_root_categories: number;
        max_depth: number;
    };
}

/**
 * Format d'importation de catégories
 */
export interface CategoryImport {
    categories: Array<{
        name: string;
        description?: string;
        parent_name?: string;
        order?: number;
    }>;
    options: {
        create_parents?: boolean;
        update_existing?: boolean;
        conflict_strategy: 'skip' | 'replace' | 'merge';
    };
}

// ============================================
// Types pour les erreurs
// ============================================

/**
 * Erreur spécifique aux catégories
 */
export interface CategoryError {
    code: CategoryErrorCode;
    message: string;
    category_id?: string;
    field?: keyof CategoryBase;
    details?: any;
}

/**
 * Codes d'erreur pour les catégories
 */
export enum CategoryErrorCode {
    CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
    CATEGORY_NAME_EXISTS = 'CATEGORY_NAME_EXISTS',
    CATEGORY_CYCLE_DETECTED = 'CATEGORY_CYCLE_DETECTED',
    CATEGORY_HAS_CHILDREN = 'CATEGORY_HAS_CHILDREN',
    CATEGORY_HAS_PRODUCTS = 'CATEGORY_HAS_PRODUCTS',
    INVALID_PARENT = 'INVALID_PARENT',
    INVALID_ORDER = 'INVALID_ORDER',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    BATCH_OPERATION_FAILED = 'BATCH_OPERATION_FAILED',
}

// ============================================
// Types utilitaires
// ============================================

/**
 * Filtre pour les catégories
 */
export type CategoryFilter =
    | { type: 'all' }
    | { type: 'root' }
    | { type: 'leaf' }
    | { type: 'with_products' }
    | { type: 'without_products' }
    | { type: 'by_parent'; parent_id: string | null }
    | { type: 'search'; query: string };

/**
 * Trier les catégories
 */
export type CategorySort =
    | { field: 'name'; order: 'asc' | 'desc' }
    | { field: 'order'; order: 'asc' | 'desc' }
    | { field: 'created_at'; order: 'asc' | 'desc' }
    | { field: 'updated_at'; order: 'asc' | 'desc' }
    | { field: 'product_count'; order: 'asc' | 'desc' };

/**
 * Options de pagination pour les catégories
 */
export interface CategoryPagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

/**
 * Configuration pour l'affichage des catégories
 */
export interface CategoryDisplayConfig {
    show_product_count?: boolean;
    show_subcategory_count?: boolean;
    show_icons?: boolean;
    show_badges?: boolean;
    max_name_length?: number;
    show_full_path?: boolean;
}

/**
 * Contexte de catégorie pour les composants
 */
export interface CategoryContext {
    category: Category;
    parent?: Category;
    children: Category[];
    siblings: Category[];
    ancestors: Category[];
    level: number;
    is_root: boolean;
    is_leaf: boolean;
}

// ============================================
// Types génériques pour les réponses API
// ============================================

/**
 * Réponse API standard pour une catégorie
 */
export interface CategoryResponse {
    success: boolean;
    data: Category;
    message?: string;
    errors?: CategoryError[];
}

/**
 * Réponse API pour plusieurs catégories
 */
export interface CategoriesResponse {
    success: boolean;
    data: Category[];
    pagination?: CategoryPagination;
    message?: string;
    errors?: CategoryError[];
}

/**
 * Réponse API pour l'arbre des catégories
 */
export interface CategoryTreeResponse {
    success: boolean;
    data: CategoryTreeNode[];
    message?: string;
    errors?: CategoryError[];
}

// ============================================
// Types pour les mutations (CRUD)
// ============================================

/**
 * Mutation pour créer une catégorie
 */
export interface CreateCategoryMutation {
    request: CreateCategoryRequest;
    response: CategoryResponse;
}

/**
 * Mutation pour mettre à jour une catégorie
 */
export interface UpdateCategoryMutation {
    request: UpdateCategoryRequest;
    response: CategoryResponse;
}

/**
 * Mutation pour supprimer une catégorie
 */
export interface DeleteCategoryMutation {
    request: void;
    response: { success: boolean; message?: string };
}

/**
 * Mutation pour réorganiser les catégories
 */
export interface ReorderCategoriesMutation {
    request: ReorderCategoriesRequest;
    response: { success: boolean; message?: string };
}

// ============================================
// Types pour les props de composants
// ============================================

/**
 * Props pour un composant de catégorie
 */
export interface CategoryComponentProps {
    category: Category;
    level?: number;
    onSelect?: (category: Category, selected: boolean) => void;
    onEdit?: (category: Category) => void;
    onDelete?: (category: Category) => void;
    isSelected?: boolean;
    isExpanded?: boolean;
    onToggleExpand?: (category: Category) => void;
    showProductCount?: boolean;
    showActions?: boolean;
}

/**
 * Props pour un composant d'arbre de catégories
 */
export interface CategoryTreeComponentProps {
    categories: CategoryTreeNode[];
    selectedIds?: string[];
    expandedIds?: string[];
    onSelect?: (category: CategoryTreeNode) => void;
    onToggleExpand?: (category: CategoryTreeNode) => void;
    onMove?: (sourceId: string, targetId: string | null) => void;
    showCheckboxes?: boolean;
    draggable?: boolean;
    maxDepth?: number;
}

/**
 * Props pour un sélecteur de catégories
 */
export interface CategorySelectComponentProps {
    value?: string | string[];
    onChange: (value: string | string[] | null) => void;
    multiple?: boolean;
    includeRoot?: boolean;
    rootLabel?: string;
    placeholder?: string;
    disabled?: boolean;
    maxDepth?: number;
    excludeIds?: string[];
    onlyLeaves?: boolean;
    className?: string;
}

