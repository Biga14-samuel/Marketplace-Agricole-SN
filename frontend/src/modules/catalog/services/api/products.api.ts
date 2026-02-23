// module/catalog/services/api/products.api.ts

import apiClient from '@/shared/services/api';

export interface Product {
    id: string;
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
    tags?: string[];
    is_active: boolean;
    is_virtual: boolean;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_main: boolean;
    order: number;
    created_at: string;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    stock_quantity: number;
    attributes: Record<string, string>;
    created_at: string;
    updated_at: string;
}

export interface StockAlert {
    id: string;
    product_id: string;
    threshold: number;
    is_active: boolean;
    created_at: string;
}

export interface CompleteProduct extends Product {
    category?: {
        id: string;
        name: string;
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
}

export interface CreateProductRequest {
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
    tags?: string[];
    is_active?: boolean;
    is_virtual?: boolean;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
}

export interface UpdateProductRequest {
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity?: number;
    low_stock_threshold?: number;
    category_id?: string;
    unit_id?: string;
    tags?: string[];
    is_active?: boolean;
    is_virtual?: boolean;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
}

export interface SearchProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    tags?: string[];
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort_by?: 'name' | 'price' | 'created_at' | 'updated_at';
    sort_order?: 'asc' | 'desc';
}

export interface SearchProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface UpdateStockRequest {
    stock_quantity: number;
    adjustment_reason?: string;
}

export interface CreateProductImageRequest {
    url: string;
    alt_text?: string;
    is_main?: boolean;
    order?: number;
}

export interface CreateVariantRequest {
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    stock_quantity: number;
    attributes: Record<string, string>;
}

export interface CreateStockAlertRequest {
    threshold: number;
    is_active?: boolean;
}

export interface ProductsApi {
    // Créer un produit
    createProduct(data: CreateProductRequest): Promise<Product>;

    // Rechercher des produits
    searchProducts(params?: SearchProductsParams): Promise<SearchProductsResponse>;

    // Obtenir mes produits
    getMyProducts(params?: Omit<SearchProductsParams, 'search'>): Promise<SearchProductsResponse>;

    // Obtenir un produit par ID
    getProductById(productId: string): Promise<Product>;

    // Mettre à jour un produit
    updateProduct(productId: string, data: UpdateProductRequest): Promise<Product>;

    // Supprimer un produit
    deleteProduct(productId: string): Promise<void>;

    // Obtenir un produit complet
    getCompleteProduct(productId: string): Promise<CompleteProduct>;

    // Mettre à jour le stock
    updateStock(productId: string, data: UpdateStockRequest): Promise<Product>;

    // Ajouter une image
    addProductImage(productId: string, data: CreateProductImageRequest): Promise<ProductImage>;

    // Obtenir les images d'un produit
    getProductImages(productId: string): Promise<ProductImage[]>;

    // Ajouter une variante
    addProductVariant(productId: string, data: CreateVariantRequest): Promise<ProductVariant>;

    // Obtenir les variantes d'un produit
    getProductVariants(productId: string): Promise<ProductVariant[]>;

    // Créer une alerte de stock
    createStockAlert(productId: string, data: CreateStockAlertRequest): Promise<StockAlert>;
}

export const productsApi: ProductsApi = {
    createProduct: async (data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.post<Product>(
            '/products-catalog/products',
            data
        );
        return response.data;
    },

    searchProducts: async (params?: SearchProductsParams): Promise<SearchProductsResponse> => {
        const response = await apiClient.get<SearchProductsResponse>(
            '/products-catalog/products',
            { params }
        );
        return response.data;
    },

    getMyProducts: async (params?: Omit<SearchProductsParams, 'search'>): Promise<SearchProductsResponse> => {
        const response = await apiClient.get<SearchProductsResponse>(
            '/products-catalog/products/my-products',
            { params }
        );
        return response.data;
    },

    getProductById: async (productId: string): Promise<Product> => {
        const response = await apiClient.get<Product>(
            `/products-catalog/products/${productId}`
        );
        return response.data;
    },

    updateProduct: async (productId: string, data: UpdateProductRequest): Promise<Product> => {
        const response = await apiClient.put<Product>(
            `/products-catalog/products/${productId}`,
            data
        );
        return response.data;
    },

    deleteProduct: async (productId: string): Promise<void> => {
        await apiClient.delete(
            `/products-catalog/products/${productId}`
        );
    },

    getCompleteProduct: async (productId: string): Promise<CompleteProduct> => {
        const response = await apiClient.get<CompleteProduct>(
            `/products-catalog/products/${productId}/complete`
        );
        return response.data;
    },

    updateStock: async (productId: string, data: UpdateStockRequest): Promise<Product> => {
        const response = await apiClient.post<Product>(
            `/products-catalog/products/${productId}/stock`,
            data
        );
        return response.data;
    },

    addProductImage: async (productId: string, data: CreateProductImageRequest): Promise<ProductImage> => {
        const response = await apiClient.post<ProductImage>(
            `/products-catalog/products/${productId}/images`,
            data
        );
        return response.data;
    },

    getProductImages: async (productId: string): Promise<ProductImage[]> => {
        const response = await apiClient.get<ProductImage[]>(
            `/products-catalog/products/${productId}/images`
        );
        return response.data;
    },

    addProductVariant: async (productId: string, data: CreateVariantRequest): Promise<ProductVariant> => {
        const response = await apiClient.post<ProductVariant>(
            `/products-catalog/products/${productId}/variants`,
            data
        );
        return response.data;
    },

    getProductVariants: async (productId: string): Promise<ProductVariant[]> => {
        const response = await apiClient.get<ProductVariant[]>(
            `/products-catalog/products/${productId}/variants`
        );
        return response.data;
    },

    createStockAlert: async (productId: string, data: CreateStockAlertRequest): Promise<StockAlert> => {
        const response = await apiClient.post<StockAlert>(
            `/products-catalog/products/${productId}/stock-alert`,
            data
        );
        return response.data;
    },
};

export default productsApi;