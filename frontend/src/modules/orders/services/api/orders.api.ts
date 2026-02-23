// modules/orders/services/api/orders.api.ts

import apiClient from '@/shared/services/api';

// ============================================
// ENUMS ALIGNÉS AVEC LE BACKEND
// ============================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum DeliveryType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery'
}

// ============================================
// TYPES ALIGNÉS AVEC LE BACKEND
// ============================================

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_snapshot: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  old_status: OrderStatus;
  new_status: OrderStatus;
  comment?: string;
  changed_by: number;
  changed_at: string;
}

export interface OrderTracking {
  id: number;
  order_id: number;
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  timestamp: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  producer_id: number;
  status: OrderStatus;
  delivery_type: DeliveryType;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  pickup_point_id?: number;
  pickup_slot_id?: number;
  delivery_address_id?: number;
  notes?: string;
  items: OrderItem[];
  status_history: OrderStatusHistory[];
  tracking: OrderTracking[];
  created_at: string;
  updated_at: string;
}

export interface CheckoutRequest {
  delivery_type: DeliveryType;
  delivery_address_id?: number;
  pickup_point_id?: number;
  pickup_slot_id?: number;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  comment?: string;
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface OrderTrackingCreate {
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  note?: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface MessageResponse {
  message: string;
}

// ============================================
// API INTERFACE
// ============================================

export interface OrdersApi {
  // Finaliser la commande
  checkout(data: CheckoutRequest): Promise<Order>;

  // Mes commandes
  getMyOrders(skip?: number, limit?: number, statusFilter?: string): Promise<OrderListResponse>;

  // Commandes reçues (Producteur)
  getProducerOrders(skip?: number, limit?: number, statusFilter?: string): Promise<OrderListResponse>;

  // Détails d'une commande
  getOrderDetail(orderId: number): Promise<Order>;

  // Changer le statut d'une commande
  updateOrderStatus(orderId: number, data: UpdateOrderStatusRequest): Promise<Order>;

  // Annuler une commande
  cancelOrder(orderId: number, data?: CancelOrderRequest): Promise<Order>;

  // Annuler plusieurs commandes
  bulkCancelOrders(orderIds: string, data?: CancelOrderRequest): Promise<MessageResponse>;

  // Ajouter un suivi de livraison
  addTracking(orderId: number, data: OrderTrackingCreate): Promise<OrderTracking>;

  // Voir le suivi d'une commande
  getTracking(orderId: number): Promise<OrderTracking[]>;

  // Voir l'historique des statuts
  getOrderHistory(orderId: number): Promise<OrderStatusHistory[]>;
}

// ============================================
// IMPLÉMENTATION
// ============================================

export const ordersApi: OrdersApi = {
  checkout: async (data: CheckoutRequest): Promise<Order> => {
    const response = await apiClient.post<Order>(
      '/orders/checkout',
      data
    );
    return response.data;
  },

  getMyOrders: async (skip = 0, limit = 100, statusFilter?: string): Promise<OrderListResponse> => {
    const params: Record<string, any> = { skip, limit };
    if (statusFilter) {
      params.status_filter = statusFilter;
    }

    const response = await apiClient.get<OrderListResponse>(
      '/orders/my-orders',
      { params }
    );
    return response.data;
  },

  getProducerOrders: async (skip = 0, limit = 100, statusFilter?: string): Promise<OrderListResponse> => {
    const params: Record<string, any> = { skip, limit };
    if (statusFilter) {
      params.status_filter = statusFilter;
    }

    const response = await apiClient.get<OrderListResponse>(
      '/orders/producer-orders',
      { params }
    );
    return response.data;
  },

  getOrderDetail: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<Order>(
      `/orders/${orderId}`
    );
    return response.data;
  },

  updateOrderStatus: async (orderId: number, data: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await apiClient.post<Order>(
      `/orders/${orderId}/status`,
      data
    );
    return response.data;
  },

  cancelOrder: async (orderId: number, data?: CancelOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>(
      `/orders/${orderId}/cancel`,
      data || {}
    );
    return response.data;
  },

  bulkCancelOrders: async (orderIds: string, data?: CancelOrderRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      `/orders/${orderIds}/cancel`,
      data || {}
    );
    return response.data;
  },

  addTracking: async (orderId: number, data: OrderTrackingCreate): Promise<OrderTracking> => {
    const response = await apiClient.post<OrderTracking>(
      `/orders/${orderId}/tracking`,
      data
    );
    return response.data;
  },

  getTracking: async (orderId: number): Promise<OrderTracking[]> => {
    const response = await apiClient.get<OrderTracking[]>(
      `/orders/${orderId}/tracking`
    );
    return response.data;
  },

  getOrderHistory: async (orderId: number): Promise<OrderStatusHistory[]> => {
    const response = await apiClient.get<OrderStatusHistory[]>(
      `/orders/${orderId}/history`
    );
    return response.data;
  },
};

export default ordersApi;
