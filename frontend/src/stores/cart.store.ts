import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  unit?: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const getItemQuantity = (id: string) => {
    return items.value.find(item => item.id === id)?.quantity || 0
  }

  const addItem = (newItem: CartItem) => {
    const existing = items.value.find(item => item.id === newItem.id)
    if (existing) {
      existing.quantity += newItem.quantity
    } else {
      items.value.push({ ...newItem })
    }
  }

  return {
    items,
    getItemQuantity,
    addItem
  }
})
