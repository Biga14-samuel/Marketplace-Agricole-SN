// Interface pour l'inventaire d'un produit
export interface ProductInventory {
  quantity: number
  reservedQuantity?: number
  availableQuantity?: number
  lastUpdated?: string | Date
  location?: string
  status?: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface Product {
  id?: string | number
  name?: string
  sku?: string
  price?: number
  costPrice?: number
  weight?: number
  height?: number
  width?: number
  depth?: number
  stockQuantity?: number
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  isActive?: boolean
  isFeatured?: boolean
  taxRate?: number
  createdAt?: string | Date
  updatedAt?: string | Date
  inventory?: ProductInventory
  categoryName?: string
  supplierName?: string
  brandName?: string
  // Propriétés dynamiques pour les attributs personnalisés
  [key: string]: string | number | boolean | Date | ProductInventory | undefined
}

export interface Category {
  id: string | number
  name: string
  description?: string
  parentId?: string | number | null
  parent_id?: string | number | null
  displayOrder?: number
  order?: number
  isActive?: boolean
  productCount?: number
  children?: Category[]
  createdAt?: string | Date
  updatedAt?: string | Date
  // Propriétés dynamiques pour les métadonnées
  [key: string]: string | number | boolean | Date | Category[] | null | undefined
}

export interface Inventory {
  id: string | number
  productId?: string | number
  quantity?: number
  reservedQuantity?: number
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  productName?: string
  warehouseName?: string
  status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  isActive?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
  // Propriétés dynamiques pour les métadonnées d'inventaire
  [key: string]: string | number | boolean | Date | undefined
}

export interface Supplier {
  id?: string | number
  name?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  isActive?: boolean
  productCount?: number
  createdAt?: string | Date
  updatedAt?: string | Date
  // Propriétés dynamiques pour les informations supplémentaires
  [key: string]: string | number | boolean | Date | undefined
}

export interface Brand {
  id?: string | number
  name?: string
  isActive?: boolean
  productCount?: number
  createdAt?: string | Date
  updatedAt?: string | Date
  // Propriétés dynamiques pour les métadonnées de marque
  [key: string]: string | number | boolean | Date | undefined
}

export interface ProductFilter {
  categoryId?: string | number
  supplierId?: string | number
  brandId?: string | number
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isActive?: boolean
  isFeatured?: boolean
  searchTerm?: string
}

export interface CategoryFilter {
  search?: string
  parentId?: string | number | null
  isActive?: boolean
}

export interface InventoryFilter {
  productId?: string | number
  locationId?: string | number
  status?: string
}

export interface SupplierFilter {
  search?: string
  isActive?: boolean
}

export interface BrandFilter {
  search?: string
  isActive?: boolean
}
