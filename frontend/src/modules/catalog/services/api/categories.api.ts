// module/catalog/services/api/categories.api.ts

import apiClient from '@/shared/services/api';

export interface Category {
    id: string;
    name: string;
    description?: string;
    parent_id?: string | null;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface CategoryTree extends Category {
    children?: CategoryTree[];
}

export interface CreateCategoryRequest {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    parent_id?: string | number | null;
    order?: number;
    position?: number;
    is_active?: boolean;
}

export interface UpdateCategoryRequest {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    parent_id?: string | number | null;
    order?: number;
    position?: number;
    is_active?: boolean;
}

export interface CategoriesApi {
    // Créer une catégorie
    createCategory(data: CreateCategoryRequest): Promise<Category>;

    // Obtenir toutes les catégories
    getAllCategories(): Promise<Category[]>;

    // Obtenir l'arbre des catégories
    getCategoryTree(): Promise<CategoryTree[]>;

    // Obtenir une catégorie par ID
    getCategoryById(categoryId: string): Promise<Category>;

    // Mettre à jour une catégorie
    updateCategory(categoryId: string, data: UpdateCategoryRequest): Promise<Category>;

    // Supprimer une catégorie
    deleteCategory(categoryId: string): Promise<void>;
}

export const categoriesApi: CategoriesApi = {
    createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
        const response = await apiClient.post<Category>(
            '/products-catalog/products/categories',
            data
        );
        return response.data;
    },

    getAllCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get<Category[]>(
            '/products-catalog/products/categories'
        );
        return response.data;
    },

    getCategoryTree: async (): Promise<CategoryTree[]> => {
        const response = await apiClient.get<CategoryTree[]>(
            '/products-catalog/products/categories/tree'
        );
        return response.data;
    },

    getCategoryById: async (categoryId: string): Promise<Category> => {
        const response = await apiClient.get<Category>(
            `/products-catalog/products/categories/${categoryId}`
        );
        return response.data;
    },

    updateCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<Category> => {
        const response = await apiClient.put<Category>(
            `/products-catalog/products/categories/${categoryId}`,
            data
        );
        return response.data;
    },

    deleteCategory: async (categoryId: string): Promise<void> => {
        await apiClient.delete(
            `/products-catalog/products/categories/${categoryId}`
        );
    },
};

export default categoriesApi;
