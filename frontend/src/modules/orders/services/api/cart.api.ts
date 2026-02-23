// modules/orders/services/api/cart.api.ts

import apiClient from '@/shared/services/api';

// ============================================
// TYPES ALIGNÉS AVEC LE BACKEND
// ============================================

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
    sku: string;
    images: string[];
  };
}

export interface Cart {
  id: number;
  user_id?: number;
  session_id?: string;
  items: CartItem[];
  total: number;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemCreate {
  product_id: number;
  variant_id?: number;
  quantity: number;
}

export interface CartItemUpdate {
  quantity: number;
}

export interface MessageResponse {
  message: string;
}

// ============================================
// API INTERFACE
// ============================================

export interface CartApi {
  // Ajouter un article au panier
  addItem(data: CartItemCreate): Promise<CartItem>;

  // Voir mon panier
  getCart(): Promise<Cart>;

  // Mettre à jour un article du panier
  updateItem(itemId: number, data: CartItemUpdate): Promise<CartItem>;

  // Retirer un article du panier
  removeItem(itemId: number): Promise<MessageResponse>;

  // Vider le panier
  clearCart(): Promise<MessageResponse>;
}

// ============================================
// IMPLÉMENTATION
// ============================================

export const cartApi: CartApi = {
  addItem: async (data: CartItemCreate): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>(
      '/orders/cart/items',
      data
    );
    return response.data;
  },

  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>(
      '/orders/cart'
    );
    return response.data;
  },

  updateItem: async (itemId: number, data: CartItemUpdate): Promise<CartItem> => {
    const response = await apiClient.put<CartItem>(
      `/orders/cart/items/${itemId}`,
      data
    );
    return response.data;
  },

  removeItem: async (itemId: number): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(
      `/orders/cart/items/${itemId}`
    );
    return response.data;
  },

  clearCart: async (): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(
      '/orders/cart'
    );
    return response.data;
  },
};

export default cartApi;
