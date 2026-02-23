// module/catalog/services/api/stock.api.ts

import apiClient from '@/shared/services/api';

export interface StockUpdate {
    id: string;
    product_id: string;
    old_quantity: number;
    new_quantity: number;
    adjustment: number;
    adjustment_reason?: string;
    user_id?: string;
    created_at: string;
}

export interface StockAlert {
    id: string;
    product_id: string;
    threshold: number;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface CreateStockUpdateRequest {
    stock_quantity: number;
    adjustment_reason?: string;
}

export interface CreateStockAlertRequest {
    threshold: number;
    is_active?: boolean;
}

export interface UpdateStockAlertRequest {
    threshold?: number;
    is_active?: boolean;
}

export interface StockApi {
    // Mettre à jour le stock d'un produit
    updateStock(productId: string, data: CreateStockUpdateRequest): Promise<any>;

    // Créer une alerte de stock pour un produit
    createStockAlert(productId: string, data: CreateStockAlertRequest): Promise<StockAlert>;

    // Obtenir l'historique des mises à jour de stock (si disponible dans le futur)
    getStockHistory?(productId: string, params?: {
        page?: number;
        limit?: number;
        start_date?: string;
        end_date?: string;
    }): Promise<{
        history: StockUpdate[];
        total: number;
        page: number;
        limit: number;
    }>;

    // Obtenir toutes les alertes de stock (si disponible dans le futur)
    getAllStockAlerts?(params?: {
        page?: number;
        limit?: number;
        is_active?: boolean;
        product_id?: string;
    }): Promise<{
        alerts: StockAlert[];
        total: number;
        page: number;
        limit: number;
    }>;

    // Obtenir les alertes de stock actives (si disponible dans le futur)
    getActiveStockAlerts?(): Promise<StockAlert[]>;

    // Obtenir une alerte de stock spécifique (si disponible dans le futur)
    getStockAlertById?(alertId: string): Promise<StockAlert>;

    // Mettre à jour une alerte de stock (si disponible dans le futur)
    updateStockAlert?(alertId: string, data: UpdateStockAlertRequest): Promise<StockAlert>;

    // Supprimer une alerte de stock (si disponible dans le futur)
    deleteStockAlert?(alertId: string): Promise<void>;

    // Obtenir le stock global (si disponible dans le futur)
    getGlobalStockReport?(): Promise<{
        total_products: number;
        total_quantity: number;
        low_stock_products: number;
        out_of_stock_products: number;
    }>;
}

export const stockApi: StockApi = {
    updateStock: async (productId: string, data: CreateStockUpdateRequest): Promise<any> => {
        const response = await apiClient.post(
            `/products-catalog/products/${productId}/stock`,
            data
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

    // Méthodes optionnelles pour des fonctionnalités futures
    // getStockHistory: async (productId: string, params?: any): Promise<any> => {
    //   const response = await apiClient.get(
    //     `/api/v1/products-catalog/products/${productId}/stock/history`,
    //     { params }
    //   );
    //   return response.data;
    // },

    // getAllStockAlerts: async (params?: any): Promise<any> => {
    //   const response = await apiClient.get(
    //     '/api/v1/products-catalog/stock-alerts',
    //     { params }
    //   );
    //   return response.data;
    // },

    // getActiveStockAlerts: async (): Promise<StockAlert[]> => {
    //   const response = await apiClient.get<StockAlert[]>(
    //     '/api/v1/products-catalog/stock-alerts/active'
    //   );
    //   return response.data;
    // },

    // getStockAlertById: async (alertId: string): Promise<StockAlert> => {
    //   const response = await apiClient.get<StockAlert>(
    //     `/api/v1/products-catalog/stock-alerts/${alertId}`
    //   );
    //   return response.data;
    // },

    // updateStockAlert: async (alertId: string, data: UpdateStockAlertRequest): Promise<StockAlert> => {
    //   const response = await apiClient.put<StockAlert>(
    //     `/api/v1/products-catalog/stock-alerts/${alertId}`,
    //     data
    //   );
    //   return response.data;
    // },

    // deleteStockAlert: async (alertId: string): Promise<void> => {
    //   await apiClient.delete(
    //     `/api/v1/products-catalog/stock-alerts/${alertId}`
    //   );
    // },

    // getGlobalStockReport: async (): Promise<any> => {
    //   const response = await apiClient.get(
    //     '/api/v1/products-catalog/stock/report'
    //   );
    //   return response.data;
    // },
};

export default stockApi;