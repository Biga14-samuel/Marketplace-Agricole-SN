// frontend/src/modules/catalog/services/catalog.service.ts

import type { AxiosResponse } from 'axios'
import { apiClient } from '@/shared/services/api'
import {
  CategoryAdapter,
  TagAdapter,
  UnitAdapter,
  ProductAdapter,
  ProductImageAdapter,
  ProductVariantAdapter,
  StockAlertAdapter
} from '../adapters/catalog.adapter'
import type {
  Category,
  Tag,
  Unit,
  Product,
  ProductImage,
  ProductVariant,
  StockAlert,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateProductRequest,
  UpdateProductRequest
} from './types'

/**
 * Service intégré pour la gestion du catalogue - Connecté à l'API backend
 */
class CatalogService {
  private readonly productsBasePath = '/products-catalog/products'

  // ============ CATEGORIES ============

  /**
   * POST /api/v1/products-catalog/categories
   * Créer une nouvelle catégorie
   */
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    try {
      const backendData = CategoryAdapter.toBackendCreate(categoryData)
      const response: AxiosResponse = await apiClient.post(`${this.productsBasePath}/categories`, backendData)
      return CategoryAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur création catégorie:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la création de la catégorie')
    }
  }

  /**
   * GET /api/v1/products-catalog/categories
   * Récupérer toutes les catégories
   */
  async getCategories(includeInactive = false): Promise<Category[]> {
    try {
      const params = new URLSearchParams()
      if (!includeInactive) params.append('active_only', 'true')

      const url = `${this.productsBasePath}/categories${params.toString() ? `?${params.toString()}` : ''}`
      const response: AxiosResponse = await apiClient.get(url)
      return response.data.map((category: any) => CategoryAdapter.toFrontend(category))
    } catch (error: any) {
      console.error('Erreur récupération catégories:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des catégories')
    }
  }

  /**
   * GET /api/v1/products-catalog/categories/tree
   * Récupérer l'arbre des catégories
   */
  async getCategoryTree(): Promise<Category[]> {
    try {
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}/categories/tree`)
      return response.data.map((category: any) => CategoryAdapter.toFrontend(category))
    } catch (error: any) {
      console.error('Erreur récupération arbre catégories:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement de l\'arbre des catégories')
    }
  }

  /**
   * GET /api/v1/products-catalog/categories/{category_id}
   * Récupérer une catégorie par ID
   */
  async getCategory(categoryId: string | number): Promise<Category> {
    try {
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}/categories/${categoryId}`)
      return CategoryAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur récupération catégorie:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération de la catégorie')
    }
  }

  /**
   * PUT /api/v1/products-catalog/categories/{category_id}
   * Mettre à jour une catégorie
   */
  async updateCategory(categoryId: string | number, categoryData: UpdateCategoryRequest): Promise<Category> {
    try {
      const backendData = CategoryAdapter.toBackendUpdate(categoryData)
      const response: AxiosResponse = await apiClient.put(`${this.productsBasePath}/categories/${categoryId}`, backendData)
      return CategoryAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur mise à jour catégorie:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la mise à jour de la catégorie')
    }
  }

  /**
   * DELETE /api/v1/products-catalog/categories/{category_id}
   * Supprimer une catégorie
   */
  async deleteCategory(categoryId: string | number): Promise<void> {
    try {
      await apiClient.delete(`${this.productsBasePath}/categories/${categoryId}`)
    } catch (error: any) {
      console.error('Erreur suppression catégorie:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la suppression de la catégorie')
    }
  }

  // ============ TAGS ============

  /**
   * POST /api/v1/products-catalog/tags
   * Créer un nouveau tag
   */
  async createTag(tagData: any): Promise<Tag> {
    try {
      const backendData = TagAdapter.toBackendCreate(tagData)
      const response: AxiosResponse = await apiClient.post(`${this.productsBasePath}/tags`, backendData)
      return TagAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur création tag:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la création du tag')
    }
  }

  /**
   * GET /api/v1/products-catalog/tags
   * Récupérer tous les tags
   */
  async getTags(type?: string): Promise<Tag[]> {
    try {
      const params = new URLSearchParams()
      if (type) params.append('type', type)

      const url = `${this.productsBasePath}/tags${params.toString() ? `?${params.toString()}` : ''}`
      const response: AxiosResponse = await apiClient.get(url)
      return response.data.map((tag: any) => TagAdapter.toFrontend(tag))
    } catch (error: any) {
      console.error('Erreur récupération tags:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des tags')
    }
  }

  // ============ UNITS ============

  /**
   * POST /api/v1/products-catalog/units
   * Créer une nouvelle unité
   */
  async createUnit(unitData: any): Promise<Unit> {
    try {
      const backendData = UnitAdapter.toBackendCreate(unitData)
      const response: AxiosResponse = await apiClient.post(`${this.productsBasePath}/units`, backendData)
      return UnitAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur création unité:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la création de l\'unité')
    }
  }

  /**
   * GET /api/v1/products-catalog/units
   * Récupérer toutes les unités
   */
  async getUnits(type?: string): Promise<Unit[]> {
    try {
      const params = new URLSearchParams()
      if (type) params.append('unit_type', type)

      const url = `${this.productsBasePath}/units${params.toString() ? `?${params.toString()}` : ''}`
      const response: AxiosResponse = await apiClient.get(url)
      return response.data.map((unit: any) => UnitAdapter.toFrontend(unit))
    } catch (error: any) {
      console.error('Erreur récupération unités:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des unités')
    }
  }

  // ============ PRODUCTS ============

  /**
   * POST /api/v1/products-catalog/products
   * Créer un nouveau produit
   */
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const backendData = ProductAdapter.toBackendCreate(productData)
      const response: AxiosResponse = await apiClient.post(this.productsBasePath, backendData)
      return ProductAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur création produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la création du produit')
    }
  }

  /**
   * GET /api/v1/products-catalog/products
   * Rechercher des produits
   */
  async searchProducts(params: {
    search_term?: string
    category_id?: string | number
    producer_id?: string | number
    tag_ids?: (string | number)[]
    min_price?: number
    max_price?: number
    is_featured?: boolean
    in_stock?: boolean
    skip?: number
    limit?: number
  } = {}): Promise<{ products: Product[]; total: number }> {
    try {
      const searchParams = new URLSearchParams()

      if (params.search_term) searchParams.append('search_term', params.search_term)
      if (params.category_id) searchParams.append('category_id', params.category_id.toString())
      if (params.producer_id) searchParams.append('producer_id', params.producer_id.toString())
      if (params.tag_ids?.length) {
        params.tag_ids.forEach(id => searchParams.append('tag_ids', id.toString()))
      }
      if (params.min_price !== undefined) searchParams.append('min_price', params.min_price.toString())
      if (params.max_price !== undefined) searchParams.append('max_price', params.max_price.toString())
      if (params.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString())
      if (params.in_stock !== undefined) searchParams.append('in_stock', params.in_stock.toString())
      if (params.skip !== undefined) searchParams.append('skip', params.skip.toString())
      if (params.limit !== undefined) searchParams.append('limit', params.limit.toString())

      const query = searchParams.toString()
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}${query ? `?${query}` : ''}`)

      if (Array.isArray(response.data)) {
        return {
          products: response.data.map((product: any) => ProductAdapter.toFrontend(product)),
          total: response.data.length
        }
      }

      const products = Array.isArray(response.data?.products) ? response.data.products : []
      return {
        products: products.map((product: any) => ProductAdapter.toFrontend(product)),
        total: Number(response.data?.total ?? products.length)
      }
    } catch (error: any) {
      console.error('Erreur recherche produits:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la recherche de produits')
    }
  }

  /**
   * GET /api/v1/products-catalog/products/my-products
   * Récupérer mes produits (producteur)
   */
  async getMyProducts(params: {
    skip?: number
    limit?: number
    category_id?: string | number
    is_active?: boolean
  } = {}): Promise<{ products: Product[]; total: number }> {
    try {
      const searchParams = new URLSearchParams()

      if (params.skip !== undefined) searchParams.append('skip', params.skip.toString())
      if (params.limit !== undefined) searchParams.append('limit', params.limit.toString())
      if (params.category_id) searchParams.append('category_id', params.category_id.toString())
      if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString())

      const query = searchParams.toString()
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}/my-products${query ? `?${query}` : ''}`)

      // Handle both array and object response formats
      if (Array.isArray(response.data)) {
        return {
          products: response.data.map((product: any) => ProductAdapter.toFrontend(product)),
          total: response.data.length
        }
      }

      return {
        products: response.data.products?.map((product: any) => ProductAdapter.toFrontend(product)) || [],
        total: response.data.total || 0
      }
    } catch (error: any) {
      console.error('Erreur récupération mes produits:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement de vos produits')
    }
  }

  /**
   * GET /api/v1/products-catalog/products/{product_id}
   * Récupérer un produit par ID
   */
  async getProduct(productId: string | number): Promise<Product> {
    try {
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}/${productId}`)
      return ProductAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur récupération produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération du produit')
    }
  }

  /**
   * GET /api/v1/products-catalog/products/{product_id}/complete
   * Récupérer un produit complet avec toutes ses relations
   */
  async getCompleteProduct(productId: string | number): Promise<Product> {
    try {
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}/${productId}/complete`)
      return ProductAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur récupération produit complet:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération du produit complet')
    }
  }

  /**
   * PUT /api/v1/products-catalog/products/{product_id}
   * Mettre à jour un produit
   */
  async updateProduct(productId: string | number, productData: UpdateProductRequest): Promise<Product> {
    try {
      const backendData = ProductAdapter.toBackendUpdate(productData)
      const response: AxiosResponse = await apiClient.put(`${this.productsBasePath}/${productId}`, backendData)
      return ProductAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur mise à jour produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la mise à jour du produit')
    }
  }

  /**
   * POST /api/v1/products-catalog/products/{product_id}/stock
   * Mettre à jour le stock d'un produit
   */
  async updateStock(productId: string | number, stockData: {
    quantity: number
    type: 'in' | 'out' | 'adjustment'
    reason?: string
  }): Promise<Product> {
    try {
      const response: AxiosResponse = await apiClient.post(`${this.productsBasePath}/${productId}/stock`, stockData)
      return ProductAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur mise à jour stock:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la mise à jour du stock')
    }
  }

  /**
   * DELETE /api/v1/products-catalog/products/{product_id}
   * Supprimer un produit
   */
  async deleteProduct(productId: string | number): Promise<void> {
    try {
      await apiClient.delete(`${this.productsBasePath}/${productId}`)
    } catch (error: any) {
      console.error('Erreur suppression produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la suppression du produit')
    }
  }

  // ============ PRODUCT IMAGES ============

  /**
   * POST /api/v1/products-catalog/products/{product_id}/images
   * Ajouter une image à un produit
   */
  async addProductImage(productId: string | number, imageData: any): Promise<ProductImage> {
    try {
      const backendData = ProductImageAdapter.toBackendCreate(imageData)
      const response: AxiosResponse = await apiClient.post(`${this.productsBasePath}/${productId}/images`, backendData)
      return ProductImageAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur ajout image produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de l\'ajout de l\'image')
    }
  }

  /**
   * GET /api/v1/products-catalog/products/{product_id}/images
   * Récupérer les images d'un produit
   */
  async getProductImages(productId: string | number): Promise<ProductImage[]> {
    try {
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}/${productId}/images`)
      return response.data.map((image: any) => ProductImageAdapter.toFrontend(image))
    } catch (error: any) {
      console.error('Erreur récupération images produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des images')
    }
  }

  // ============ PRODUCT VARIANTS ============

  /**
   * POST /api/v1/products-catalog/products/{product_id}/variants
   * Ajouter une variante à un produit
   */
  async addProductVariant(productId: string | number, variantData: any): Promise<ProductVariant> {
    try {
      const backendData = ProductVariantAdapter.toBackendCreate(variantData)
      const response: AxiosResponse = await apiClient.post(`${this.productsBasePath}/${productId}/variants`, backendData)
      return ProductVariantAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur ajout variante produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de l\'ajout de la variante')
    }
  }

  /**
   * GET /api/v1/products-catalog/products/{product_id}/variants
   * Récupérer les variantes d'un produit
   */
  async getProductVariants(productId: string | number): Promise<ProductVariant[]> {
    try {
      const response: AxiosResponse = await apiClient.get(`${this.productsBasePath}/${productId}/variants`)
      return response.data.map((variant: any) => ProductVariantAdapter.toFrontend(variant))
    } catch (error: any) {
      console.error('Erreur récupération variantes produit:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors du chargement des variantes')
    }
  }

  // ============ STOCK ALERTS ============

  /**
   * POST /api/v1/products-catalog/stock-alerts
   * Créer une alerte de stock
   */
  async createStockAlert(alertData: any): Promise<StockAlert> {
    try {
      const backendData = StockAlertAdapter.toBackendCreate(alertData)
      const productId = backendData.product_id
      const response: AxiosResponse = await apiClient.post(`${this.productsBasePath}/${productId}/stock-alert`, backendData)
      return StockAlertAdapter.toFrontend(response.data)
    } catch (error: any) {
      console.error('Erreur création alerte stock:', error)
      throw new Error(error.response?.data?.detail || 'Erreur lors de la création de l\'alerte de stock')
    }
  }

  // ============ UTILITY METHODS ============

  /**
   * Tester la connexion à l'API catalog
   */
  async testConnection(): Promise<boolean> {
    try {
      await apiClient.get(`${this.productsBasePath}/categories`)
      return true
    } catch (error) {
      console.error('Erreur connexion API catalog:', error)
      return false
    }
  }
}

// Export singleton instance
export default new CatalogService()
