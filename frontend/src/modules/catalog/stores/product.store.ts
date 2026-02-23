// frontend/src/modules/catalog/stores/product.store.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductFilter, ProductsSearchResponse } from '../services/models/product.model'
import catalogService from '../services/catalog.service'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchResults = ref<ProductsSearchResponse | null>(null)
  const filters = ref<ProductFilter>({})

  // Getters
  const activeProducts = computed(() => 
    products.value.filter(product => product.is_active)
  )

  const inStockProducts = computed(() =>
    products.value.filter(product => product.isInStock())
  )

  const lowStockProducts = computed(() =>
    products.value.filter(product => product.isLowStock())
  )

  const outOfStockProducts = computed(() =>
    products.value.filter(product => product.isOutOfStock())
  )

  // Actions
  const searchProducts = async (params: any = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await catalogService.searchProducts(params)
      searchResults.value = result
      products.value = result.products
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la recherche de produits'
      console.error('Erreur recherche produits:', err)
    } finally {
      loading.value = false
    }
  }

  const getProduct = async (productId: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      const product = await catalogService.getProduct(productId)
      currentProduct.value = product
      return product
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération du produit'
      console.error('Erreur récupération produit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData: any) => {
    loading.value = true
    error.value = null
    
    try {
      const product = await catalogService.createProduct(productData)
      products.value.push(product)
      return product
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création du produit'
      console.error('Erreur création produit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (productId: string | number, productData: any) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedProduct = await catalogService.updateProduct(productId, productData)
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      if (currentProduct.value?.id === productId) {
        currentProduct.value = updatedProduct
      }
      return updatedProduct
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du produit'
      console.error('Erreur mise à jour produit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (productId: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      await catalogService.deleteProduct(productId)
      products.value = products.value.filter(p => p.id !== productId)
      if (currentProduct.value?.id === productId) {
        currentProduct.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression du produit'
      console.error('Erreur suppression produit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentProduct = () => {
    currentProduct.value = null
  }

  const setFilters = (newFilters: ProductFilter) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    searchResults,
    filters,
    
    // Getters
    activeProducts,
    inStockProducts,
    lowStockProducts,
    outOfStockProducts,
    
    // Actions
    searchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
    clearCurrentProduct,
    setFilters,
    clearFilters
  }
})