// frontend/src/modules/catalog/stores/product.store.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Product as ProductModel,
  ProductFilter,
  ProductsSearchResponse,
  CreateProductRequest,
  UpdateProductRequest
} from '../services/models/product.model'
import { Product } from '../services/models/product.model'
import catalogService from '../services/catalog.service'

type StoreSearchProductsResponse = Omit<ProductsSearchResponse, 'products'> & {
  products: ProductModel[]
}

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<ProductModel[]>([])
  const currentProduct = ref<ProductModel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchResults = ref<StoreSearchProductsResponse | null>(null)
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
  const searchProducts = async (params: Record<string, unknown> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await catalogService.searchProducts(params)
      const mappedProducts = result.products.map(item => Product.fromApiData(item))
      searchResults.value = {
        products: mappedProducts,
        total: result.total,
        page: 1,
        limit: mappedProducts.length || 20,
        total_pages: 1
      }
      products.value = mappedProducts
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la recherche de produits'
      console.error('Erreur recherche produits:', err)
    } finally {
      loading.value = false
    }
  }

  const getProduct = async (productId: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      const productData = await catalogService.getProduct(productId)
      const product = Product.fromApiData(productData)
      currentProduct.value = product
      return product
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la récupération du produit'
      console.error('Erreur récupération produit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData: CreateProductRequest) => {
    loading.value = true
    error.value = null
    
    try {
      const created = await catalogService.createProduct(productData)
      const product = Product.fromApiData(created)
      products.value.push(product)
      return product
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la création du produit'
      console.error('Erreur création produit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (productId: string | number, productData: UpdateProductRequest) => {
    loading.value = true
    error.value = null
    
    try {
      const updated = await catalogService.updateProduct(productId, productData)
      const updatedProduct = Product.fromApiData(updated)
      const index = products.value.findIndex(p => String(p.id) === String(productId))
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      if (currentProduct.value && String(currentProduct.value.id) === String(productId)) {
        currentProduct.value = updatedProduct
      }
      return updatedProduct
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du produit'
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
      products.value = products.value.filter(p => String(p.id) !== String(productId))
      if (currentProduct.value && String(currentProduct.value.id) === String(productId)) {
        currentProduct.value = null
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression du produit'
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
