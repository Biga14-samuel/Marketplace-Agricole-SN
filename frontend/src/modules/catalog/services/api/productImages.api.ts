// module/catalog/services/api/productImages.api.ts

import apiClient from '@/shared/services/api';

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_main: boolean;
    order: number;
    created_at: string;
    updated_at?: string;
}

export interface CreateProductImageRequest {
    url: string;
    alt_text?: string;
    is_main?: boolean;
    order?: number;
}

export interface UpdateProductImageRequest {
    alt_text?: string;
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

export const productImagesApi: ProductImagesApi = {
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