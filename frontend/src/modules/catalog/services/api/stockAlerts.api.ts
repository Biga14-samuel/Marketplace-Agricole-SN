// module/catalog/services/api/stockAlerts.api.ts

import apiClient from '@/shared/services/api';

export interface StockAlert {
    id: string;
    product_id: string;
    product_name?: string;
    threshold: number;
    current_stock: number;
    is_active: boolean;
    is_triggered: boolean;
    created_at: string;
    updated_at?: string;
    triggered_at?: string;
}

export interface CreateStockAlertRequest {
    threshold: number;
    is_active?: boolean;
}

export interface UpdateStockAlertRequest {
    threshold?: number;
    is_active?: boolean;
}

export interface StockAlertResponse {
    alert: StockAlert;
}

export interface StockAlertsListResponse {
    alerts: StockAlert[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface SearchStockAlertsParams {
    page?: number;
    limit?: number;
    product_id?: string;
    is_active?: boolean;
    is_triggered?: boolean;
    min_threshold?: number;
    max_threshold?: number;
    sort_by?: 'created_at' | 'updated_at' | 'threshold' | 'current_stock';
    sort_order?: 'asc' | 'desc';
}

export interface StockAlertStats {
    total_alerts: number;
    active_alerts: number;
    triggered_alerts: number;
    low_stock_products: number;
    critical_stock_products: number;
}

export interface StockAlertsApi {
    // Créer une alerte de stock pour un produit
    createStockAlert(productId: string, data: CreateStockAlertRequest): Promise<StockAlert>;

    // Obtenir toutes les alertes de stock (si disponible dans le futur)
    getAllStockAlerts(): Promise<StockAlert[]>;

    // Obtenir les alertes de stock actives (si disponible dans le futur)
    getActiveStockAlerts(): Promise<StockAlert[]>;

    // Obtenir les alertes de stock déclenchées (si disponible dans le futur)
    getTriggeredStockAlerts(): Promise<StockAlert[]>;

    // Obtenir une alerte de stock par ID (si disponible dans le futur)
    getStockAlertById(alertId: string): Promise<StockAlert>;

    // Mettre à jour une alerte de stock (si disponible dans le futur)
    updateStockAlert(alertId: string, data: UpdateStockAlertRequest): Promise<StockAlert>;

    // Supprimer une alerte de stock (si disponible dans le futur)
    deleteStockAlert(alertId: string): Promise<void>;

    // Acknowledge/mark a stock alert as acknowledged
    acknowledgeStockAlert(id: string): Promise<StockAlert>;

    // Obtenir les statistiques des alertes de stock (si disponible dans le futur)
    getStockAlertStats(): Promise<StockAlertStats>;

    // Get stock alerts by product
    getStockAlertsByProduct(productId: string): Promise<StockAlert[]>;

    // Get stock alerts by variant
    getStockAlertsByVariant(variantId: string): Promise<StockAlert[]>;

    // Obtenir les alertes de stock pour un produit spécifique (si disponible dans le futur)
    getProductStockAlerts(productId: string): Promise<StockAlert[]>;

    // Activer/désactiver une alerte de stock (si disponible dans le futur)
    toggleStockAlert(alertId: string, isActive: boolean): Promise<StockAlert>;

    // Marquer une alerte comme lue/non déclenchée (si disponible dans le futur)
    markAlertAsRead(alertId: string): Promise<StockAlert>;

    // Vérifier et déclencher les alertes (si disponible dans le futur)
    checkAndTriggerAlerts(): Promise<{
        triggered: number;
        checked: number;
    }>;
}

export const stockAlertsApi: StockAlertsApi = {
    async getAllStockAlerts() {
        const response = await apiClient.get<StockAlert[]>('/products-catalog/stock-alerts');
        return response.data;
    },

    async getActiveStockAlerts() {
        const response = await apiClient.get<StockAlert[]>('/products-catalog/stock-alerts/active');
        return response.data;
    },

    async getTriggeredStockAlerts() {
        const response = await apiClient.get<StockAlert[]>('/products-catalog/stock-alerts/triggered');
        return response.data;
    },

    async getStockAlertById(id: string) {
        const response = await apiClient.get<StockAlert>(`/products-catalog/stock-alerts/${id}`);
        return response.data;
    },

    async createStockAlert(productId: string, data: CreateStockAlertRequest) {
        const response = await apiClient.post<StockAlert>(
            `/products-catalog/products/${productId}/stock-alert`,
            data
        );
        return response.data;
    },

    async updateStockAlert(id: string, data: UpdateStockAlertRequest) {
        const response = await apiClient.put<StockAlert>(`/products-catalog/stock-alerts/${id}`, data);
        return response.data;
    },

    async deleteStockAlert(id: string) {
        await apiClient.delete(`/products-catalog/stock-alerts/${id}`);
    },

    async acknowledgeStockAlert(id: string) {
        const response = await apiClient.post<StockAlert>(`/products-catalog/stock-alerts/${id}/acknowledge`);
        return response.data;
    },

    async getStockAlertStats() {
        const response = await apiClient.get<StockAlertStats>('/products-catalog/stock-alerts/stats');
        return response.data;
    },

    async getStockAlertsByProduct(productId: string) {
        const response = await apiClient.get<StockAlert[]>(`/products-catalog/products/${productId}/stock-alerts`);
        return response.data;
    },

    async getStockAlertsByVariant(variantId: string) {
        const response = await apiClient.get<StockAlert[]>(`/products-catalog/variants/${variantId}/stock-alerts`);
        return response.data;
    },

    async getProductStockAlerts(productId: string) {
        const response = await apiClient.get<StockAlert[]>(`/products-catalog/products/${productId}/stock-alerts`);
        return response.data;
    },

    async toggleStockAlert(alertId: string, isActive: boolean) {
        const response = await apiClient.patch<StockAlert>(
            `/products-catalog/stock-alerts/${alertId}/toggle`,
            { is_active: isActive }
        );
        return response.data;
    },

    async markAlertAsRead(alertId: string) {
        const response = await apiClient.patch<StockAlert>(
            `/products-catalog/stock-alerts/${alertId}/mark-read`
        );
        return response.data;
    },

    async checkAndTriggerAlerts() {
        const response = await apiClient.post<{ triggered: number; checked: number }>(
            '/products-catalog/stock-alerts/check'
        );
        return response.data;
    }
};

export default stockAlertsApi;