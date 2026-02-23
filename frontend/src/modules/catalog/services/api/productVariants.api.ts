// module/catalog/services/api/productVariants.api.ts

import apiClient from '@/shared/services/api';

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
    attributes: Record<string, string>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateVariantRequest {
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    attributes: Record<string, string>;
    is_active?: boolean;
}

export interface UpdateVariantRequest {
    name?: string;
    sku?: string;
    price?: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity?: number;
    low_stock_threshold?: number;
    attributes?: Record<string, string>;
    is_active?: boolean;
}

export interface VariantAttribute {
    name: string;
    value: string;
}

export interface VariantsResponse {
    variants: ProductVariant[];
    total: number;
}

export interface ProductVariantsApi {
    // Ajouter une variante à un produit
    addProductVariant(productId: string, data: CreateVariantRequest): Promise<ProductVariant>;

    // Obtenir toutes les variantes d'un produit
    getProductVariants(productId: string): Promise<ProductVariant[]>;

    // Obtenir une variante spécifique (si disponible dans le futur)
    getProductVariantById?(productId: string, variantId: string): Promise<ProductVariant>;

    // Mettre à jour une variante (si disponible dans le futur)
    updateProductVariant?(productId: string, variantId: string, data: UpdateVariantRequest): Promise<ProductVariant>;

    // Supprimer une variante (si disponible dans le futur)
    deleteProductVariant?(productId: string, variantId: string): Promise<void>;

    // Mettre à jour le stock d'une variante (si disponible dans le futur)
    updateVariantStock?(productId: string, variantId: string, stockQuantity: number): Promise<ProductVariant>;

    // Rechercher des variantes par attributs (si disponible dans le futur)
    searchVariantsByAttributes?(productId: string, attributes: Record<string, string>): Promise<ProductVariant[]>;
}

export const productVariantsApi: ProductVariantsApi = {
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

    // Méthodes optionnelles pour des fonctionnalités futures
    // getProductVariantById: async (productId: string, variantId: string): Promise<ProductVariant> => {
    //   const response = await apiClient.get<ProductVariant>(
    //     `/api/v1/products-catalog/products/${productId}/variants/${variantId}`
    //   );
    //   return response.data;
    // },

    // updateProductVariant: async (productId: string, variantId: string, data: UpdateVariantRequest): Promise<ProductVariant> => {
    //   const response = await apiClient.put<ProductVariant>(
    //     `/api/v1/products-catalog/products/${productId}/variants/${variantId}`,
    //     data
    //   );
    //   return response.data;
    // },

    // deleteProductVariant: async (productId: string, variantId: string): Promise<void> => {
    //   await apiClient.delete(
    //     `/api/v1/products-catalog/products/${productId}/variants/${variantId}`
    //   );
    // },

    // updateVariantStock: async (productId: string, variantId: string, stockQuantity: number): Promise<ProductVariant> => {
    //   const response = await apiClient.patch<ProductVariant>(
    //     `/api/v1/products-catalog/products/${productId}/variants/${variantId}/stock`,
    //     { stock_quantity: stockQuantity }
    //   );
    //   return response.data;
    // },

    // searchVariantsByAttributes: async (productId: string, attributes: Record<string, string>): Promise<ProductVariant[]> => {
    //   const response = await apiClient.post<ProductVariant[]>(
    //     `/api/v1/products-catalog/products/${productId}/variants/search`,
    //     { attributes }
    //   );
    //   return response.data;
    // },
};

export default productVariantsApi;