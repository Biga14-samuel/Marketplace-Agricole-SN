// @ts-nocheck
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ordersService } from '../services/orders.service'
import type { Cart, CartItem, AddToCartRequest } from '../types/orders.types'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const itemsCount = computed(() => {
    if (!cart.value) return 0
    return cart.value.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    return cart.value?.totalAmount || 0
  })

  const subtotal = computed(() => {
    return cart.value?.subtotal || 0
  })

  const items = computed(() => {
    return cart.value?.items || []
  })

  // Actions
  const fetchCart = async () => {
    loading.value = true
    error.value = null
    try {
      cart.value = await ordersService.getCart()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du panier'
      console.error('Error fetching cart:', err)
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (data: AddToCartRequest) => {
    loading.value = true
    error.value = null
    try {
      await ordersService.addToCart(data)
      await fetchCart()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'ajout au panier'
      console.error('Error adding to cart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCartItem = async (itemId: string | number, quantity: number) => {
    loading.value = true
    error.value = null
    try {
      await ordersService.updateCartItem(itemId, { quantity })
      await fetchCart()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour'
      console.error('Error updating cart item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeCartItem = async (itemId: string | number) => {
    loading.value = true
    error.value = null
    try {
      await ordersService.removeCartItem(itemId)
      await fetchCart()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression'
      console.error('Error removing cart item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    error.value = null
    try {
      await ordersService.clearCart()
      cart.value = null
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du vidage du panier'
      console.error('Error clearing cart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getItemQuantity = (productId: string | number) => {
    if (!cart.value) return 0
    const item = cart.value.items.find(i => i.productId === productId)
    return item?.quantity || 0
  }

  return {
    // State
    cart,
    loading,
    error,
    
    // Computed
    itemsCount,
    totalAmount,
    subtotal,
    items,
    
    // Actions
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getItemQuantity
  }
})
