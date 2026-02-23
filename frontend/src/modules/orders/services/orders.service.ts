// modules/orders/services/orders.service.ts
import type { AxiosResponse } from 'axios'
import type {
  Cart,
  CartItem,
  Order,
  OrderStatusHistory,
  OrderTracking,
  AddToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
  UpdateOrderStatusRequest,
  AddTrackingRequest,
  CancelOrderRequest,
  OrderFilter,
  ProducerOrderFilter
} from '../types/orders.types'
import {
  CartItemAdapter,
  CartAdapter,
  OrderAdapter,
  OrderStatusHistoryAdapter,
  OrderTrackingAdapter
} from '../adapters/order.adapter'
import { apiClient } from '@/shared/services/api'

export const ordersService = {
  // ============================================
  // PANIER - Endpoints
  // ============================================

  /**
   * POST /api/v1/orders/cart/items
   * Ajouter un article au panier
   */
  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    try {
      const backendData = CartItemAdapter.toBackendCreate(data)
      const response: AxiosResponse = await apiClient.post('/orders/cart/items', backendData)
      return CartItemAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur ajout au panier:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de l\'ajout au panier')
    }
  },

  /**
   * GET /api/v1/orders/cart
   * Voir mon panier
   */
  getCart: async (): Promise<Cart> => {
    try {
      const response: AxiosResponse = await apiClient.get('/orders/cart')
      return CartAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur récupération panier:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération du panier')
    }
  },

  /**
   * DELETE /api/v1/orders/cart
   * Vider le panier
   */
  clearCart: async (): Promise<void> => {
    try {
      await apiClient.delete('/orders/cart')
    } catch (error: any) {
      console.error('Erreur vidage panier:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du vidage du panier')
    }
  },

  /**
   * PUT /api/v1/orders/cart/items/{item_id}
   * Mettre à jour un article du panier
   */
  updateCartItem: async (itemId: string | number, data: UpdateCartItemRequest): Promise<CartItem> => {
    try {
      const backendData = CartItemAdapter.toBackendUpdate(data)
      const response: AxiosResponse = await apiClient.put(`/orders/cart/items/${itemId}`, backendData)
      return CartItemAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur mise à jour article panier:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la mise à jour de l\'article')
    }
  },

  /**
   * DELETE /api/v1/orders/cart/items/{item_id}
   * Retirer un article du panier
   */
  removeCartItem: async (itemId: string | number): Promise<void> => {
    try {
      await apiClient.delete(`/orders/cart/items/${itemId}`)
    } catch (error: any) {
      console.error('Erreur suppression article panier:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la suppression de l\'article')
    }
  },

  // ============================================
  // COMMANDES - Endpoints
  // ============================================

  /**
   * POST /api/v1/orders/checkout
   * Finaliser la commande
   */
  checkout: async (data: CheckoutRequest): Promise<Order> => {
    try {
      const backendData = OrderAdapter.toBackendCheckout(data)
      const response: AxiosResponse = await apiClient.post('/orders/checkout', backendData)
      return OrderAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur checkout:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la finalisation de la commande')
    }
  },

  /**
   * GET /api/v1/orders/my-orders
   * Mes commandes
   */
  getMyOrders: async (filter?: OrderFilter): Promise<{ orders: Order[]; total: number; page: number; limit: number }> => {
    try {
      const params = new URLSearchParams()

      if (filter) {
        if (filter.status) {
          params.append('status', Array.isArray(filter.status) ? filter.status[0] : filter.status)
        }
        if (filter.page) {
          params.append('skip', ((filter.page - 1) * (filter.limit || 20)).toString())
        }
        if (filter.limit) {
          params.append('limit', filter.limit.toString())
        }
        if (filter.search) {
          params.append('search', filter.search)
        }
      }

      const url = `/orders/my-orders${params.toString() ? `?${params.toString()}` : ''}`
      const response: AxiosResponse = await apiClient.get(url)

      return {
        orders: response.data.orders.map((order: any) => OrderAdapter.toFrontend(order)),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      }
    } catch (error: any) {
      console.error('Erreur récupération mes commandes:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des commandes')
    }
  },

  /**
   * GET /api/v1/orders/producer-orders
   * Commandes reçues (Producteur)
   */
  getProducerOrders: async (filter?: ProducerOrderFilter): Promise<{ orders: Order[]; total: number; page: number; limit: number }> => {
    try {
      const params = new URLSearchParams()

      if (filter) {
        if (filter.status) {
          params.append('status', Array.isArray(filter.status) ? filter.status[0] : filter.status)
        }
        if (filter.page) {
          params.append('skip', ((filter.page - 1) * (filter.limit || 20)).toString())
        }
        if (filter.limit) {
          params.append('limit', filter.limit.toString())
        }
        if (filter.producerId) {
          params.append('producer_id', filter.producerId.toString())
        }
      }

      const url = `/orders/producer-orders${params.toString() ? `?${params.toString()}` : ''}`
      const response: AxiosResponse = await apiClient.get(url)

      return {
        orders: response.data.orders.map((order: any) => OrderAdapter.toFrontend(order)),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      }
    } catch (error: any) {
      console.error('Erreur récupération commandes producteur:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des commandes producteur')
    }
  },

  /**
   * GET /api/v1/orders/{order_id}
   * Détails d'une commande
   */
  getOrderDetail: async (orderId: string | number): Promise<Order> => {
    try {
      const response: AxiosResponse = await apiClient.get(`/orders/${orderId}`)
      return OrderAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur récupération détails commande:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération des détails de la commande')
    }
  },

  /**
   * POST /api/v1/orders/{order_id}/status
   * Changer le statut d'une commande
   */
  updateOrderStatus: async (orderId: string | number, data: UpdateOrderStatusRequest): Promise<Order> => {
    try {
      const backendData = OrderStatusHistoryAdapter.toBackendCreate(data)
      const response: AxiosResponse = await apiClient.post(`/orders/${orderId}/status`, backendData)
      return OrderAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur mise à jour statut commande:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la mise à jour du statut')
    }
  },

  /**
   * POST /api/v1/orders/{order_id}/cancel
   * Annuler une commande
   */
  cancelOrder: async (orderId: string | number, data?: CancelOrderRequest): Promise<Order> => {
    try {
      const response: AxiosResponse = await apiClient.post(`/orders/${orderId}/cancel`, data || {})
      return OrderAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur annulation commande:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de l\'annulation de la commande')
    }
  },

  /**
   * POST /api/v1/orders/{order_id}/tracking
   * Ajouter un suivi de livraison
   */
  addTracking: async (orderId: string | number, data: AddTrackingRequest): Promise<OrderTracking> => {
    try {
      const backendData = OrderTrackingAdapter.toBackendCreate(data)
      const response: AxiosResponse = await apiClient.post(`/orders/${orderId}/tracking`, backendData)
      return OrderTrackingAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur ajout suivi:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de l\'ajout du suivi')
    }
  },

  /**
   * GET /api/v1/orders/{order_id}/tracking
   * Voir le suivi d'une commande
   */
  getTracking: async (orderId: string | number): Promise<OrderTracking[]> => {
    try {
      const response: AxiosResponse = await apiClient.get(`/orders/${orderId}/tracking`)
      return response.data.map((tracking: any) => OrderTrackingAdapter.toFrontend(tracking))
    } catch (error: any) {
      console.error('Erreur récupération suivi:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération du suivi')
    }
  },

  /**
   * GET /api/v1/orders/{order_id}/history
   * Voir l'historique des statuts
   */
  getOrderHistory: async (orderId: string | number): Promise<OrderStatusHistory[]> => {
    try {
      const response: AxiosResponse = await apiClient.get(`/orders/${orderId}/history`)
      return response.data.map((history: any) => OrderStatusHistoryAdapter.toFrontend(history))
    } catch (error: any) {
      console.error('Erreur récupération historique:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération de l\'historique')
    }
  },

  /**
   * POST /api/v1/orders/bulk-cancel
   * Annuler plusieurs commandes
   */
  bulkCancelOrders: async (orderIds: (string | number)[], data?: CancelOrderRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response: AxiosResponse = await apiClient.post('/orders/bulk-cancel', {
        order_ids: orderIds.map(id => parseInt(id.toString())),
        ...data
      })
      return { success: true, message: response.data.message }
    } catch (error: any) {
      console.error('Erreur annulation en lot:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de l\'annulation des commandes')
    }
  }
}

export default ordersService