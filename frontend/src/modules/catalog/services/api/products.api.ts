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
    is_virtual?: boolean;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    created_at: string;
    updated_at: string;
    images?: ProductImage[];
    image?: string;
}

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
    position: number;
    // Compatibilité legacy frontend
    is_main?: boolean;
    order?: number;
    uploaded_at?: string;
    created_at?: string;
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
    tag_ids?: number[];
    is_active?: boolean;
    is_virtual?: boolean;
    is_featured?: boolean;
    min_order?: number;
    max_order?: number | null;
    origin?: string;
    harvest_date?: string;
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
    tag_ids?: number[];
    is_active?: boolean;
    is_virtual?: boolean;
    is_featured?: boolean;
    min_order?: number;
    max_order?: number | null;
    origin?: string;
    harvest_date?: string;
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
    stock_quantity?: number;
    quantity?: number;
    type?: 'in' | 'out' | 'adjustment';
    adjustment_reason?: string;
    reason?: string;
}

export interface CreateProductImageRequest {
    url: string;
    alt_text?: string;
    is_primary?: boolean;
    position?: number;
    // Compatibilité legacy frontend
    is_main?: boolean;
    order?: number;
}

export interface UploadProductImageRequest {
    file: File;
    alt_text?: string;
    is_primary?: boolean;
    position?: number;
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
    createProduct(data: CreateProductRequest): Promise<Product>;
    searchProducts(params?: SearchProductsParams): Promise<SearchProductsResponse>;
    getMyProducts(params?: Omit<SearchProductsParams, 'search'>): Promise<SearchProductsResponse>;
    getProductById(productId: string): Promise<Product>;
    updateProduct(productId: string, data: UpdateProductRequest): Promise<Product>;
    deleteProduct(productId: string): Promise<void>;
    getCompleteProduct(productId: string): Promise<CompleteProduct>;
    updateStock(productId: string, data: UpdateStockRequest): Promise<Product>;
    addProductImage(productId: string, data: CreateProductImageRequest): Promise<ProductImage>;
    uploadProductImage(
        productId: string,
        data: UploadProductImageRequest,
        onProgress?: (progress: number) => void
    ): Promise<ProductImage>;
    getProductImages(productId: string): Promise<ProductImage[]>;
    addProductVariant(productId: string, data: CreateVariantRequest): Promise<ProductVariant>;
    getProductVariants(productId: string): Promise<ProductVariant[]>;
    createStockAlert(productId: string, data: CreateStockAlertRequest): Promise<StockAlert>;
}

const normalizeProductImage = (image: any): ProductImage => {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
    const normalizeUrl = (url?: string): string => {
        if (!url) return '';
        if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
            return url;
        }
        return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const isPrimary = Boolean(image?.is_primary ?? image?.is_main ?? false);
    const position = Number(image?.position ?? image?.order ?? 0);
    return {
        ...image,
        url: normalizeUrl(image?.url),
        is_primary: isPrimary,
        position,
        // Garder les clés legacy pour les composants qui ne sont pas encore migrés
        is_main: image?.is_main ?? isPrimary,
        order: image?.order ?? position,
    } as ProductImage;
};

const normalizeProduct = (product: any): Product => {
    const images = Array.isArray(product?.images)
        ? product.images.map((img: any) => normalizeProductImage(img))
        : [];

    return {
        ...product,
        images,
        image: product?.image || images[0]?.url,
    } as Product;
};

const normalizeSearchResponse = (
    payload: any,
    params?: SearchProductsParams
): SearchProductsResponse => {
    if (Array.isArray(payload)) {
        const normalizedProducts = payload.map((product: any) => normalizeProduct(product));
        const page = Number(params?.page ?? 1);
        const limit = Number(params?.limit ?? (normalizedProducts.length || 20));
        return {
            products: normalizedProducts,
            total: normalizedProducts.length,
            page,
            limit,
            total_pages: Math.max(1, Math.ceil(normalizedProducts.length / Math.max(limit, 1))),
        };
    }

    const products = Array.isArray(payload?.products)
        ? payload.products.map((product: any) => normalizeProduct(product))
        : [];
    const page = Number(payload?.page ?? params?.page ?? 1);
    const limit = Number(payload?.limit ?? params?.limit ?? (products.length || 20));
    const total = Number(payload?.total ?? products.length);
    const totalPages = Number(payload?.total_pages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1))));

    return {
        products,
        total,
        page,
        limit,
        total_pages: totalPages,
    };
};

const toIntOrUndefined = (value: unknown): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const numeric = Number(value);
    return Number.isInteger(numeric) ? numeric : undefined;
};

const normalizeProductPayload = (data: CreateProductRequest | UpdateProductRequest): Record<string, any> => {
    const payload: Record<string, any> = { ...data };

    if ('category_id' in payload) {
        payload.category_id = toIntOrUndefined(payload.category_id);
    }
    if ('unit_id' in payload) {
        payload.unit_id = toIntOrUndefined(payload.unit_id);
    }

    if (Array.isArray(payload.tag_ids)) {
        payload.tag_ids = payload.tag_ids
            .map((id: unknown) => Number(id))
            .filter((id: number) => Number.isInteger(id) && id > 0);
    } else if (Array.isArray(payload.tags)) {
        payload.tag_ids = payload.tags
            .map((id: unknown) => Number(id))
            .filter((id: number) => Number.isInteger(id) && id > 0);
    }

    return payload;
};

const toFiniteNumberOrUndefined = (value: unknown): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
};

const normalizeSearchParams = (params?: SearchProductsParams): Record<string, unknown> => {
    if (!params) return {};

    const normalized: Record<string, unknown> = {};

    const limit = toIntOrUndefined(params.limit);
    const page = toIntOrUndefined(params.page);
    if (limit && limit > 0) {
        normalized.limit = limit;
    }
    if (page && page > 0) {
        // Backend FastAPI utilise `skip` + `limit`.
        const effectiveLimit = (limit && limit > 0) ? limit : 20;
        normalized.skip = (page - 1) * effectiveLimit;
    }

    const search = String(params.search || '').trim();
    if (search) {
        normalized.search_term = search;
    }

    const categoryId = toIntOrUndefined(params.category_id);
    if (categoryId && categoryId > 0) {
        normalized.category_id = categoryId;
    }

    if (Array.isArray(params.tags) && params.tags.length > 0) {
        // Le backend attend `tag_ids` (List[int]).
        const tagIds = params.tags
            .map((tag) => Number(tag))
            .filter((tag) => Number.isInteger(tag) && tag > 0);
        if (tagIds.length > 0) {
            normalized.tag_ids = tagIds;
        }
    }

    const minPrice = toFiniteNumberOrUndefined(params.min_price);
    if (minPrice !== undefined) {
        normalized.min_price = minPrice;
    }
    const maxPrice = toFiniteNumberOrUndefined(params.max_price);
    if (maxPrice !== undefined) {
        normalized.max_price = maxPrice;
    }

    if (typeof params.in_stock === 'boolean') {
        normalized.in_stock = params.in_stock;
    }

    return normalized;
};

export const productsApi: ProductsApi = {
    createProduct: async (data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.post<Product>(
            '/products-catalog/products',
            normalizeProductPayload(data)
        );
        return normalizeProduct(response.data);
    },

    searchProducts: async (params?: SearchProductsParams): Promise<SearchProductsResponse> => {
        const normalizedParams = normalizeSearchParams(params);
        const response = await apiClient.get('/products-catalog/products', { params: normalizedParams });
        return normalizeSearchResponse(response.data, params);
    },

    getMyProducts: async (params?: Omit<SearchProductsParams, 'search'>): Promise<SearchProductsResponse> => {
        const normalizedParams = normalizeSearchParams(params as SearchProductsParams);
        const response = await apiClient.get('/products-catalog/products/my-products', { params: normalizedParams });
        return normalizeSearchResponse(response.data, params);
    },

    getProductById: async (productId: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`/products-catalog/products/${productId}`);
        return normalizeProduct(response.data);
    },

    updateProduct: async (productId: string, data: UpdateProductRequest): Promise<Product> => {
        const response = await apiClient.put<Product>(
            `/products-catalog/products/${productId}`,
            normalizeProductPayload(data)
        );
        return normalizeProduct(response.data);
    },

    deleteProduct: async (productId: string): Promise<void> => {
        await apiClient.delete(`/products-catalog/products/${productId}`);
    },

    getCompleteProduct: async (productId: string): Promise<CompleteProduct> => {
        const response = await apiClient.get<CompleteProduct>(`/products-catalog/products/${productId}/complete`);
        const normalized = normalizeProduct(response.data) as CompleteProduct;
        return {
            ...normalized,
            images: Array.isArray(normalized?.images) ? normalized.images : [],
            variants: Array.isArray(response.data?.variants) ? response.data.variants : [],
            stock_alerts: Array.isArray((response.data as any)?.stock_alerts)
                ? (response.data as any).stock_alerts
                : [],
        };
    },

    updateStock: async (productId: string, data: UpdateStockRequest): Promise<Product> => {
        const payload = {
            quantity: data.quantity ?? data.stock_quantity ?? 0,
            type: data.type ?? 'adjustment',
            reason: data.reason ?? data.adjustment_reason,
        };
        const response = await apiClient.post<Product>(`/products-catalog/products/${productId}/stock`, payload);
        return response.data;
    },

    addProductImage: async (productId: string, data: CreateProductImageRequest): Promise<ProductImage> => {
        const payload = {
            url: data.url,
            alt_text: data.alt_text,
            is_primary: data.is_primary ?? data.is_main ?? false,
            position: data.position ?? data.order ?? 0,
        };
        const response = await apiClient.post(`/products-catalog/products/${productId}/images`, payload);
        return normalizeProductImage(response.data);
    },

    uploadProductImage: async (
        productId: string,
        data: UploadProductImageRequest,
        onProgress?: (progress: number) => void
    ): Promise<ProductImage> => {
        const formData = new FormData();
        formData.append('file', data.file);
        if (data.alt_text) {
            formData.append('alt_text', data.alt_text);
        }
        formData.append('is_primary', String(Boolean(data.is_primary)));
        formData.append('position', String(data.position ?? 0));

        const response = await apiClient.post(
            `/products-catalog/products/${productId}/images/upload`,
            formData,
            {
                onUploadProgress: (event) => {
                    if (!onProgress) return;
                    const total = event.total || 1;
                    const progress = Math.round((event.loaded * 100) / total);
                    onProgress(progress);
                },
            }
        );
        return normalizeProductImage(response.data);
    },

    getProductImages: async (productId: string): Promise<ProductImage[]> => {
        const response = await apiClient.get(`/products-catalog/products/${productId}/images`);
        return Array.isArray(response.data)
            ? response.data.map((img: any) => normalizeProductImage(img))
            : [];
    },

    addProductVariant: async (productId: string, data: CreateVariantRequest): Promise<ProductVariant> => {
        const response = await apiClient.post<ProductVariant>(`/products-catalog/products/${productId}/variants`, data);
        return response.data;
    },

    getProductVariants: async (productId: string): Promise<ProductVariant[]> => {
        const response = await apiClient.get<ProductVariant[]>(`/products-catalog/products/${productId}/variants`);
        return response.data;
    },

    createStockAlert: async (productId: string, data: CreateStockAlertRequest): Promise<StockAlert> => {
        const response = await apiClient.post<StockAlert>(`/products-catalog/products/${productId}/stock-alert`, data);
        return response.data;
    },
};

export default productsApi;
