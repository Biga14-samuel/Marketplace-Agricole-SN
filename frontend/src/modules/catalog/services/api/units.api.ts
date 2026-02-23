// module/catalog/services/api/units.api.ts

import apiClient from '@/shared/services/api';

export interface Unit {
    id: string;
    name: string;
    symbol: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUnitRequest {
    name: string;
    symbol: string;
    description?: string;
}

export interface UpdateUnitRequest {
    name?: string;
    symbol?: string;
    description?: string;
}

export interface UnitsApi {
    // Créer une unité de mesure
    createUnit(data: CreateUnitRequest): Promise<Unit>;

    // Obtenir toutes les unités
    getAllUnits(): Promise<Unit[]>;

    // Obtenir une unité par ID (si disponible dans le futur)
    getUnitById?(unitId: string): Promise<Unit>;

    // Mettre à jour une unité (si disponible dans le futur)
    updateUnit?(unitId: string, data: UpdateUnitRequest): Promise<Unit>;

    // Supprimer une unité (si disponible dans le futur)
    deleteUnit?(unitId: string): Promise<void>;
}

export const unitsApi: UnitsApi = {
    createUnit: async (data: CreateUnitRequest): Promise<Unit> => {
        const response = await apiClient.post<Unit>(
            '/products-catalog/units',
            data
        );
        return response.data;
    },

    getAllUnits: async (): Promise<Unit[]> => {
        const response = await apiClient.get<Unit[]>(
            '/products-catalog/units'
        );
        return response.data;
    },

    // Méthodes optionnelles pour des fonctionnalités futures
    // getUnitById: async (unitId: string): Promise<Unit> => {
    //   const response = await apiClient.get<Unit>(
    //     `/api/v1/products-catalog/products/units/${unitId}`
    //   );
    //   return response.data;
    // },

    // updateUnit: async (unitId: string, data: UpdateUnitRequest): Promise<Unit> => {
    //   const response = await apiClient.put<Unit>(
    //     `/api/v1/products-catalog/products/units/${unitId}`,
    //     data
    //   );
    //   return response.data;
    // },

    // deleteUnit: async (unitId: string): Promise<void> => {
    //   await apiClient.delete(
    //     `/api/v1/products-catalog/products/units/${unitId}`
    //   );
    // },
};

export default unitsApi;