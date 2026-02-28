// module/catalog/services/api/productImages.api.ts

import apiClient from '@/shared/services/api';

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
    position: number;
    // Compatibilité legacy
    is_main?: boolean;
    order?: number;
    uploaded_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateProductImageRequest {
    url: string;
    alt_text?: string;
    is_primary?: boolean;
    position?: number;
    // Compatibilité legacy
    is_main?: boolean;
    order?: number;
}

export interface UpdateProductImageRequest {
    alt_text?: string;
    is_primary?: boolean;
    position?: number;
    is_main?: boolean;
    order?: number;
}

export interface ProductImagesApi {
    // Ajouter une image à un produit
    addProductImage(productId: string, data: CreateProductImageRequest): Promise<ProductImage>;

    // Obtenir toutes les images d'un produit
    getProductImages(productId: string): Promise<ProductImage[]>;

    // Obtenir une image spécifique d'un produit (si disponible dans le futur)
    getProductImageById?(productId: string, imageId: string): Promise<ProductImage>;

    // Mettre à jour une image de produit (si disponible dans le futur)
    updateProductImage?(productId: string, imageId: string, data: UpdateProductImageRequest): Promise<ProductImage>;

    // Supprimer une image de produit (si disponible dans le futur)
    deleteProductImage?(productId: string, imageId: string): Promise<void>;

    // Mettre à jour l'ordre des images (si disponible dans le futur)
    reorderProductImages?(productId: string, imageIds: string[]): Promise<void>;

    // Définir une image comme principale (si disponible dans le futur)
    setMainImage?(productId: string, imageId: string): Promise<ProductImage>;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const normalizeImageUrl = (url?: string): string => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
        return url;
    }
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const productImagesApi: ProductImagesApi = {
    addProductImage: async (productId: string, data: CreateProductImageRequest): Promise<ProductImage> => {
        const payload = {
            url: data.url,
            alt_text: data.alt_text,
            is_primary: data.is_primary ?? data.is_main ?? false,
            position: data.position ?? data.order ?? 0,
        };
        const response = await apiClient.post<ProductImage>(
            `/products-catalog/products/${productId}/images`,
            payload
        );
        return {
            ...response.data,
            url: normalizeImageUrl((response.data as any).url),
            is_primary: (response.data as any).is_primary ?? (response.data as any).is_main ?? false,
            position: (response.data as any).position ?? (response.data as any).order ?? 0,
        };
    },

    getProductImages: async (productId: string): Promise<ProductImage[]> => {
        const response = await apiClient.get<ProductImage[]>(
            `/products-catalog/products/${productId}/images`
        );
        return (response.data || []).map((image: any) => ({
            ...image,
            url: normalizeImageUrl(image?.url),
            is_primary: image.is_primary ?? image.is_main ?? false,
            position: image.position ?? image.order ?? 0,
        }));
    },

    // Méthodes optionnelles pour des fonctionnalités futures
    // getProductImageById: async (productId: string, imageId: string): Promise<ProductImage> => {
    //   const response = await apiClient.get<ProductImage>(
    //     `/api/v1/products-catalog/products/${productId}/images/${imageId}`
    //   );
    //   return response.data;
    // },

    // updateProductImage: async (productId: string, imageId: string, data: UpdateProductImageRequest): Promise<ProductImage> => {
    //   const response = await apiClient.put<ProductImage>(
    //     `/api/v1/products-catalog/products/${productId}/images/${imageId}`,
    //     data
    //   );
    //   return response.data;
    // },

    // deleteProductImage: async (productId: string, imageId: string): Promise<void> => {
    //   await apiClient.delete(
    //     `/api/v1/products-catalog/products/${productId}/images/${imageId}`
    //   );
    // },

    // reorderProductImages: async (productId: string, imageIds: string[]): Promise<void> => {
    //   await apiClient.put(
    //     `/api/v1/products-catalog/products/${productId}/images/reorder`,
    //     { image_ids: imageIds }
    //   );
    // },

    // setMainImage: async (productId: string, imageId: string): Promise<ProductImage> => {
    //   const response = await apiClient.patch<ProductImage>(
    //     `/api/v1/products-catalog/products/${productId}/images/${imageId}/set-main`
    //   );
    //   return response.data;
    // },
};

export default productImagesApi;
