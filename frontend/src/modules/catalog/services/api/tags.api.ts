// module/catalog/services/api/tags.api.ts

import apiClient from '../../../../shared/services/api';

export interface Tag {
    id: string;
    name: string;
    description?: string;
    color?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTagRequest {
    name: string;
    description?: string;
    color?: string;
}

export interface UpdateTagRequest {
    name?: string;
    description?: string;
    color?: string;
}

export interface TagsApi {
    // Créer un tag
    createTag(data: CreateTagRequest): Promise<Tag>;

    // Obtenir tous les tags
    getAllTags(): Promise<Tag[]>;

    // Obtenir un tag par ID (si disponible dans le futur)
    getTagById?(tagId: string): Promise<Tag>;

    // Mettre à jour un tag (si disponible dans le futur)
    updateTag?(tagId: string, data: UpdateTagRequest): Promise<Tag>;

    // Supprimer un tag (si disponible dans le futur)
    deleteTag?(tagId: string): Promise<void>;
}

export const tagsApi: TagsApi = {
    createTag: async (data: CreateTagRequest): Promise<Tag> => {
        const response = await apiClient.post<Tag>(
            '/products-catalog/products/tags',
            data
        );
        return response.data;
    },

    getAllTags: async (): Promise<Tag[]> => {
        const response = await apiClient.get<Tag[]>(
            '/products-catalog/products/tags'
        );
        return response.data;
    },

    // Méthodes optionnelles pour des fonctionnalités futures
    // getTagById: async (tagId: string): Promise<Tag> => {
    //   const response = await apiClient.get<Tag>(
    //     `/api/v1/products-catalog/products/tags/${tagId}`
    //   );
    //   return response.data;
    // },

    // updateTag: async (tagId: string, data: UpdateTagRequest): Promise<Tag> => {
    //   const response = await apiClient.put<Tag>(
    //     `/api/v1/products-catalog/products/tags/${tagId}`,
    //     data
    //   );
    //   return response.data;
    // },

    // deleteTag: async (tagId: string): Promise<void> => {
    //   await apiClient.delete(
    //     `/api/v1/products-catalog/products/tags/${tagId}`
    //   );
    // },
};

export default tagsApi;
