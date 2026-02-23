// @ts-nocheck
// modules/orders/stores/orders.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Cart,
  CartItem,
  Order,
  OrderFilter,
  ProducerOrderFilter,
  OrderStatus,
  CheckoutRequest
} from '../types/orders.types'
import { ordersService } from '../services/orders.service'

export const useOrdersStore = defineStore('orders', () => {
  // ============================================
  // STATE
  // ============================================
  const cart = ref<Cart | null>(null)
  const cartItems = ref<CartItem[]>([])
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const producerOrders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============================================
  // GETTERS
  // ============================================
  const cartTotalItems = computed(() => {
    if (!cart.value?.items) return 0
    return cart.value.items.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotalAmount = computed(() => {
    return cart.value?.totalAmount || 0
  })

  const pendingOrdersCount = computed(() => {
    return orders.value.filter(order => 
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing'
    ).length
  })

  const cartStats = computed(() => {
    if (!cart.value?.items) return {
      totalItems: 0,
      uniqueProducts: 0,
      cartValue: 0,
      averageItemPrice: 0
    }

    const items = cart.value.items
    return {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      uniqueProducts: items.length,
      cartValue: cart.value.totalAmount,
      averageItemPrice: items.length > 0 
        ? items.reduce((sum, item) => sum + item.subtotal, 0) / items.length
        : 0
    }
  })

  // ============================================
  // ACTIONS - PANIER
  // ============================================

  /**
   * Ajouter un article au panier
   */
  const addToCart = async (data: { productId: string | number; variantId?: string | number; quantity: number }) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.addToCart(data)
      
      // Mettre à jour le panier
      await fetchCart()
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'ajout au panier'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer le panier
   */
  const fetchCart = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.getCart()
      cart.value = response
      cartItems.value = response.items
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération du panier'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Vider le panier
   */
  const clearCart = async () => {
    try {
      loading.value = true
      error.value = null
      await ordersService.clearCart()
      cart.value = null
      cartItems.value = []
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du vidage du panier'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour la quantité d'un article
   */
  const updateCartItem = async (itemId: string | number, quantity: number) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.updateCartItem(itemId, { quantity })
      
      // Mettre à jour le panier local
      if (cart.value) {
        const index = cart.value.items.findIndex(item => item.id === itemId)
        if (index !== -1) {
          cart.value.items[index] = response
        }
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du panier'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Retirer un article du panier
   */
  const removeCartItem = async (itemId: string | number) => {
    try {
      loading.value = true
      error.value = null
      await ordersService.removeCartItem(itemId)
      
      // Mettre à jour le panier local
      if (cart.value) {
        cart.value.items = cart.value.items.filter(item => item.id !== itemId)
        cartItems.value = cart.value.items
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de l\'article'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================
  // ACTIONS - COMMANDES
  // ============================================

  /**
   * Finaliser la commande
   */
  const checkout = async (data: CheckoutRequest) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.checkout(data)
      
      // Vider le panier après commande
      cart.value = null
      cartItems.value = []
      
      // Ajouter la commande à la liste
      orders.value.unshift(response)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la finalisation de la commande'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer mes commandes
   */
  const fetchMyOrders = async (filter?: OrderFilter) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.getMyOrders(filter)
      orders.value = response.orders
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des commandes'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer les commandes du producteur
   */
  const fetchProducerOrders = async (filter?: ProducerOrderFilter) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.getProducerOrders(filter)
      producerOrders.value = response.orders
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des commandes producteur'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer les détails d'une commande
   */
  const fetchOrderDetail = async (orderId: string | number) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.getOrderDetail(orderId)
      currentOrder.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des détails de la commande'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  const updateOrderStatus = async (orderId: string | number, status: OrderStatus, comment?: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.updateOrderStatus(orderId, { status, comment })
      
      // Mettre à jour la commande dans les listes
      const updateOrderInList = (list: Order[]) => {
        const index = list.findIndex(order => order.id === orderId)
        if (index !== -1) {
          list[index] = response
        }
      }
      
      updateOrderInList(orders.value)
      updateOrderInList(producerOrders.value)
      
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = response
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du statut'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Annuler une commande
   */
  const cancelOrder = async (orderId: string | number, reason?: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.cancelOrder(orderId, { reason })
      
      // Mettre à jour la commande dans les listes
      const updateOrderInList = (list: Order[]) => {
        const index = list.findIndex(order => order.id === orderId)
        if (index !== -1) {
          list[index] = response
        }
      }
      
      updateOrderInList(orders.value)
      updateOrderInList(producerOrders.value)
      
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = response
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'annulation de la commande'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Ajouter un suivi de livraison
   */
  const addTracking = async (orderId: string | number, data: {
    status: string
    location?: string
    latitude?: number
    longitude?: number
    note?: string
  }) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.addTracking(orderId, data)
      
      if (currentOrder.value?.id === orderId) {
        if (!currentOrder.value.tracking) {
          currentOrder.value.tracking = []
        }
        currentOrder.value.tracking.push(response)
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'ajout du suivi'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer l'historique d'une commande
   */
  const fetchOrderHistory = async (orderId: string | number) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.getOrderHistory(orderId)
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération de l\'historique'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer le suivi d'une commande
   */
  const fetchTracking = async (orderId: string | number) => {
    try {
      loading.value = true
      error.value = null
      const response = await ordersService.getTracking(orderId)
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération du suivi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================
  // UTILITAIRES
  // ============================================

  const clearError = () => {
    error.value = null
  }

  const resetCurrentOrder = () => {
    currentOrder.value = null
  }

  return {
    // State
    cart,
    cartItems,
    orders,
    currentOrder,
    producerOrders,
    loading,
    error,
    
    // Getters
    cartTotalItems,
    cartTotalAmount,
    pendingOrdersCount,
    cartStats,
    
    // Actions - Panier
    addToCart,
    fetchCart,
    clearCart,
    updateCartItem,
    removeCartItem,
    
    // Actions - Commandes
    checkout,
    fetchMyOrders,
    fetchProducerOrders,
    fetchOrderDetail,
    updateOrderStatus,
    cancelOrder,
    addTracking,
    fetchOrderHistory,
    fetchTracking,
    
    // Utilitaires
    clearError,
    resetCurrentOrder
  }
})