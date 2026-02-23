// utils/catalog.helpers.ts
import type { Product, Category, Inventory, ProductFilter } from '../types/catalog.types'
import type { ExportFormat, PaginationParams } from '../../../shared/types/common.types'

/**
 * ============================================
 * CONSTANTES & CONFIGURATION
 * ============================================
 */

// Endpoints API
export const CATALOG_ENDPOINTS = {
  // Produits
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  PRODUCT_SEARCH: '/products/search',
  PRODUCT_EXPORT: '/products/export',
  PRODUCT_BULK: '/products/bulk',
  
  // Catégories
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id: string | number) => `/categories/${id}`,
  CATEGORY_PRODUCTS: (id: string | number) => `/categories/${id}/products`,
  CATEGORY_TREE: '/categories/tree',
  
  // Inventaire
  INVENTORY: '/inventory',
  INVENTORY_DETAIL: (id: string | number) => `/inventory/${id}`,
  INVENTORY_SEARCH: '/inventory/search',
  INVENTORY_ADJUSTMENT: '/inventory/adjust',
  INVENTORY_TRANSFER: '/inventory/transfer',
  INVENTORY_HISTORY: (productId: string | number) => `/inventory/${productId}/history`,
  INVENTORY_LOW_STOCK: '/inventory/low-stock',
  INVENTORY_EXPORT: '/inventory/export',
  
  // Fournisseurs
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAIL: (id: string | number) => `/suppliers/${id}`,
  SUPPLIER_PRODUCTS: (id: string | number) => `/suppliers/${id}/products`,
  SUPPLIER_SEARCH: '/suppliers/search',
  
  // Marques
  BRANDS: '/brands',
  BRAND_DETAIL: (id: string | number) => `/brands/${id}`,
  BRAND_PRODUCTS: (id: string | number) => `/brands/${id}/products`,
  BRAND_SEARCH: '/brands/search'
}

// Statuts d'inventaire
export const INVENTORY_STATUS = {
  'in-stock': { label: 'En stock', color: 'success', icon: 'mdi-check-circle' },
  'low-stock': { label: 'Stock faible', color: 'warning', icon: 'mdi-alert-circle' },
  'out-of-stock': { label: 'Rupture', color: 'error', icon: 'mdi-close-circle' },
  'pre-order': { label: 'Pré-commande', color: 'info', icon: 'mdi-clock-outline' }
} as const

// Types de mouvement de stock
export const STOCK_MOVEMENT_TYPES = {
  IN: { label: 'Entrée', color: 'success', icon: 'mdi-arrow-up' },
  OUT: { label: 'Sortie', color: 'error', icon: 'mdi-arrow-down' },
  ADJUSTMENT: { label: 'Ajustement', color: 'warning', icon: 'mdi-adjust' },
  TRANSFER: { label: 'Transfert', color: 'info', icon: 'mdi-swap-horizontal' }
} as const

/**
 * ============================================
 * PRODUITS - Helpers
 * ============================================
 */

/**
 * Formate les données d'un produit pour l'API
 */
export const formatProductForAPI = (product: Partial<Product>): Record<string, any> => {
  const formatted: Record<string, any> = {
    ...product,
    price: product.price ? Number(product.price) : 0,
    cost_price: product.cost_price ? Number(product.cost_price) : 0,
    weight: product.weight ? Number(product.weight) : 0,
    stock_quantity: product.stock_quantity ? Number(product.stock_quantity) : 0,
    is_active: product.is_active ?? true,
    tax_rate: product.tax_rate ? Number(product.tax_rate) : 0
  }

  // Supprimer les champs non nécessaires pour l'API
  delete formatted.created_at
  delete formatted.updated_at

  return formatted
}

/**
 * Calcule le prix TTC
 */
export const calculateTaxIncludedPrice = (price: number, taxRate: number): number => {
  return price * (1 + taxRate / 100)
}

/**
 * Génère un SKU automatique
 */
export const generateSKU = (productName: string, categoryCode?: string, brandCode?: string): string => {
  const prefix = categoryCode ? categoryCode.substring(0, 3).toUpperCase() : 'PRO'
  const brand = brandCode ? brandCode.substring(0, 2).toUpperCase() : '00'
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const nameCode = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, '0')
  
  return `${prefix}-${brand}-${nameCode}-${random}`
}

/**
 * Formate les options de filtre produits pour l'API
 */
export const formatProductFilterParams = (filter: ProductFilter, pagination?: PaginationParams): Record<string, any> => {
  const params: Record<string, any> = {}

  // Gérer les différents types de filtres
  switch (filter.type) {
    case 'all':
      break;
    case 'active':
      params.is_active = true;
      break;
    case 'inactive':
      params.is_active = false;
      break;
    case 'in_stock':
      params.in_stock = true;
      break;
    case 'out_of_stock':
      params.in_stock = false;
      break;
    case 'low_stock':
      params.low_stock = true;
      break;
    case 'by_category':
      params.category_id = filter.category_id;
      break;
    case 'by_tag':
      params.tag_id = filter.tag_id;
      break;
    case 'by_supplier':
      params.supplier_id = filter.supplier_id;
      break;
    case 'by_price_range':
      params.min_price = filter.min;
      params.max_price = filter.max;
      break;
    case 'search':
      params.search = filter.query;
      break;
  }
  
  // Pagination
  if (pagination) {
    params.page = pagination.page || 1
    params.limit = pagination.limit || 20
  }

  return params
}

/**
 * ============================================
 * CATÉGORIES - Helpers
 * ============================================
 */

/**
 * Formate les données d'une catégorie pour l'API
 */
export const formatCategoryForAPI = (category: Partial<Category>): Record<string, any> => {
  const formatted: Record<string, any> = {
    ...category
  }

  delete formatted.created_at
  delete formatted.updated_at

  return formatted
}

/**
 * Construit un arbre de catégories à partir d'une liste plate
 * Note: Cette fonction nécessite un type Category étendu avec children et parent_id
 */
export const buildCategoryTree = (categories: Category[]): any[] => {
  const map = new Map<string, any>()
  const roots: any[] = []

  // Créer un map des catégories
  categories.forEach(category => {
    map.set(category.id, { ...category, children: [] })
  })

  // Construire l'arbre
  categories.forEach(category => {
    const node = map.get(category.id)!
    if (category.parent_id && map.has(category.parent_id)) {
      const parent = map.get(category.parent_id)!
      if (!parent.children) parent.children = []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

/**
 * Obtient le chemin d'une catégorie dans l'arbre
 * Note: Cette fonction nécessite un type Category étendu avec children
 */
export const getCategoryPath = (
  categories: any[], 
  categoryId: string, 
  path: any[] = []
): any[] => {
  for (const category of categories) {
    if (category.id === categoryId) {
      return [...path, category]
    }
    if (category.children && category.children.length > 0) {
      const found = getCategoryPath(category.children, categoryId, [...path, category])
      if (found.length > 0) return found
    }
  }
  return []
}

/**
 * ============================================
 * INVENTAIRE - Helpers
 * ============================================
 */

/**
 * Formate les données d'inventaire pour l'API
 */
export const formatInventoryForAPI = (inventory: Partial<Inventory>): Record<string, any> => {
  const formatted: Record<string, any> = {
    ...inventory,
    quantity: inventory.quantity ? Number(inventory.quantity) : 0,
    reserved_quantity: inventory.reserved_quantity ? Number(inventory.reserved_quantity) : 0,
    minimum_quantity: inventory.minimum_quantity ? Number(inventory.minimum_quantity) : 0,
    maximum_quantity: inventory.maximum_quantity ? Number(inventory.maximum_quantity) : 0,
    reorder_point: inventory.reorder_point ? Number(inventory.reorder_point) : 0
  }

  // Calculer la quantité disponible
  formatted.available_quantity = formatted.quantity - (formatted.reserved_quantity || 0)

  // Déterminer le statut
  if (formatted.availableQuantity <= 0) {
    formatted.status = 'out-of-stock'
  } else if (formatted.reorder_point && formatted.availableQuantity <= formatted.reorder_point) {
    formatted.status = 'low-stock'
  } else {
    formatted.status = 'in-stock'
  }

  delete formatted.createdAt
  delete formatted.updatedAt
  delete formatted.productName
  delete formatted.warehouseName

  return formatted
}

/**
 * Formate les données d'ajustement d'inventaire
 */
export const formatInventoryAdjustment = (
  productId: string | number,
  adjustment: number,
  reason: string,
  reference?: string
): Record<string, any> => {
  return {
    productId,
    adjustment,
    reason,
    reference,
    date: new Date().toISOString()
  }
}

/**
 * Formate les données de transfert d'inventaire
 */
export const formatInventoryTransfer = (
  productId: string | number,
  fromLocation: string,
  toLocation: string,
  quantity: number,
  reason?: string
): Record<string, any> => {
  return {
    productId,
    fromLocation,
    toLocation,
    quantity: Number(quantity),
    reason,
    transferDate: new Date().toISOString()
  }
}

/**
 * Calcule la valeur totale de l'inventaire
 */
export const calculateInventoryValue = (inventoryItems: Inventory[]): number => {
  // Note: StockLevel n'a pas de unit_cost, retourne 0 pour l'instant
  return 0
}

/**
 * Vérifie si le stock est faible
 */
export const isLowStock = (inventory: Inventory): boolean => {
  if (!inventory.reorder_point) return false
  const available = (inventory.quantity || 0) - (inventory.reserved_quantity || 0)
  return available <= inventory.reorder_point
}

/**
 * Vérifie si le stock est épuisé
 */
export const isOutOfStock = (inventory: Inventory): boolean => {
  const available = (inventory.quantity || 0) - (inventory.reserved_quantity || 0)
  return available <= 0
}

/**
 * ============================================
 * FOURNISSEURS - Helpers
 * ============================================
 * Note: Types Supplier non disponibles, fonctions commentées
 */

/*
export const formatSupplierForAPI = (supplier: Partial<any>): Record<string, any> => {
  const formatted: Record<string, any> = {
    ...supplier
  }

  delete formatted.created_at
  delete formatted.updated_at

  return formatted
}

export const formatSupplierAddress = (supplier: any): string => {
  const parts = [
    supplier.address,
    supplier.city,
    supplier.postal_code,
    supplier.country
  ].filter(Boolean)
  
  return parts.join(', ')
}
*/

/**
 * ============================================
 * MARQUES - Helpers
 * ============================================
 * Note: Types Brand non disponibles, fonctions commentées
 */

/*
export const formatBrandForAPI = (brand: Partial<any>): Record<string, any> => {
  const formatted: Record<string, any> = {
    ...brand
  }

  delete formatted.created_at
  delete formatted.updated_at

  return formatted
}
*/

/**
 * ============================================
 * EXPORT & IMPORT - Helpers
 * ============================================
 */

/**
 * Prépare les données pour l'export
 */
export const prepareExportData = (
  data: any[],
  format: ExportFormat = 'csv',
  columns?: string[]
): any => {
  let exportData = data
  
  // Filtrer les colonnes si spécifié
  if (columns && columns.length > 0) {
    exportData = data.map(item => {
      const filtered: Record<string, any> = {}
      columns.forEach(col => {
        if (item[col] !== undefined) {
          filtered[col] = item[col]
        }
      })
      return filtered
    })
  }

  // Formater selon le format
  switch (format) {
    case 'csv':
      return exportData
    case 'excel':
      return exportData
    case 'pdf':
      return exportData
    default:
      return exportData
  }
}

/**
 * Formate les paramètres d'export
 */
export const formatExportParams = (
  filter: any,
  format: ExportFormat,
  columns?: string[]
): Record<string, any> => {
  return {
    format,
    filters: filter,
    columns: columns?.join(',')
  }
}

/**
 * ============================================
 * VALIDATION - Helpers
 * ============================================
 */

/**
 * Valide les données d'un produit
 */
export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = []

  if (!product.name?.trim()) {
    errors.push('Le nom du produit est requis')
  }

  if (!product.sku?.trim()) {
    errors.push('Le SKU est requis')
  }

  if (product.price === undefined || product.price < 0) {
    errors.push('Le prix doit être un nombre positif')
  }

  if (product.stock_quantity !== undefined && product.stock_quantity < 0) {
    errors.push('La quantité en stock ne peut pas être négative')
  }

  return errors
}

/**
 * Valide les données d'inventaire
 */
export const validateInventory = (inventory: Partial<Inventory>): string[] => {
  const errors: string[] = []

  if (!inventory.product_id) {
    errors.push('L\'ID du produit est requis')
  }

  if (inventory.quantity === undefined || inventory.quantity < 0) {
    errors.push('La quantité doit être un nombre positif')
  }

  if (inventory.minimum_quantity !== undefined && inventory.minimum_quantity < 0) {
    errors.push('Le stock minimum ne peut pas être négatif')
  }

  return errors
}

/**
 * ============================================
 * FORMATAGE - Helpers
 * ============================================
 */

/**
 * Formate un prix
 */
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(price)
}

/**
 * Formate une quantité
 */
export const formatQuantity = (quantity: number, unit?: string): string => {
  const formatted = new Intl.NumberFormat('fr-FR').format(quantity)
  return unit ? `${formatted} ${unit}` : formatted
}

/**
 * Formate une date pour l'affichage
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A'
  
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(d)
}

/**
 * Formate le statut d'inventaire
 */
export const formatInventoryStatus = (status: keyof typeof INVENTORY_STATUS): string => {
  return INVENTORY_STATUS[status]?.label || status
}

/**
 * Récupère la couleur du statut d'inventaire
 */
export const getInventoryStatusColor = (status: keyof typeof INVENTORY_STATUS): string => {
  return INVENTORY_STATUS[status]?.color || 'default'
}

/**
 * ============================================
 * CALCULS - Helpers
 * ============================================
 */
/**
 * Calcule la marge bénéficiaire
 */
export const calculateProfitMargin = (costPrice: number, sellingPrice: number): number => {
  if (costPrice === 0) return 100
  return ((sellingPrice - costPrice) / costPrice) * 100
}

/**
 * Calcule le prix de vente recommandé
 */
export const calculateRecommendedPrice = (costPrice: number, targetMargin: number): number => {
  return costPrice * (1 + targetMargin / 100)
}

/**
 * ============================================
 * UTILITAIRES GÉNÉRAUX
 * ============================================
 */

/**
 * Génère un identifiant unique
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Nettoie les données avant envoi à l'API
 */
export const sanitizeData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {}
  
  Object.keys(data).forEach(key => {
    const value = data[key]
    
    // Supprimer les valeurs undefined et null
    if (value !== undefined && value !== null) {
      // Si c'est une chaîne, trim
      if (typeof value === 'string') {
        sanitized[key] = value.trim()
      } else {
        sanitized[key] = value
      }
    }
  })
  
  return sanitized
}

/**
 * Vérifie si l'URL est un endpoint de catalogue
 */
export const isCatalogEndpoint = (url: string): boolean => {
  return Object.values(CATALOG_ENDPOINTS).some(endpoint => {
    if (typeof endpoint === 'function') {
      // Pour les fonctions, on vérifie si l'url correspond au pattern
      const pattern = endpoint('([^/]+)').replace('([^/]+)', '[^/]+')
      return new RegExp(`^${pattern}$`).test(url)
    }
    return url.startsWith(endpoint as string)
  })
}

export default {
  // Constantes
  CATALOG_ENDPOINTS,
  INVENTORY_STATUS,
  STOCK_MOVEMENT_TYPES,
  
  // Produits
  formatProductForAPI,
  calculateTaxIncludedPrice,
  generateSKU,
  formatProductFilterParams,
  
  // Catégories
  formatCategoryForAPI,
  buildCategoryTree,
  getCategoryPath,
  
  // Inventaire
  formatInventoryForAPI,
  formatInventoryAdjustment,
  formatInventoryTransfer,
  calculateInventoryValue,
  isLowStock,
  isOutOfStock,
  
  // Fournisseurs - Commentés (types non disponibles)
  // formatSupplierForAPI,
  // formatSupplierAddress,
  
  // Marques - Commentées (types non disponibles)
  // formatBrandForAPI,
  
  // Export
  prepareExportData,
  formatExportParams,
  
  // Validation
  validateProduct,
  validateInventory,
  
  // Formatage
  formatPrice,
  formatQuantity,
  formatDate,
  formatInventoryStatus,
  getInventoryStatusColor,
  
  // Calculs
  calculateProfitMargin,
  calculateRecommendedPrice,
  
  // Utilitaires
  generateUniqueId,
  sanitizeData,
  isCatalogEndpoint
}

