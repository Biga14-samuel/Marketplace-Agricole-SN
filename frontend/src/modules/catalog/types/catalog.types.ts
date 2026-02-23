// Re-export commonly used catalog types from services
export type {
  Product,
  ProductBase,
  ProductWithMetadata,
  ProductImage,
  ProductVariant,
  ProductFilter,
  ProductFormData,
  ProductListItem,
  ProductStats,
  CreateProductRequest,
  UpdateProductRequest,
  ProductStatus
} from '../services/types/product.types'

export type {
  Category,
  CategoryBase,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../services/types/category.types'

// Export inventory types
export type {
  StockLevel as Inventory,
  StockLevel as InventoryBase,
  InventoryMovement as StockMovement,
  InventoryAlert as StockAlert
} from '../services/types/inventory.types'

// Export DTO types
export type {
  ProductCreateDto,
  ProductUpdateDto,
  ProductBulkUpdateDto,
  ProductSearchDto
} from './product-dto.types'

// Additional catalog-specific types
export interface Supplier {
  id: string | number
  name: string
  email?: string
  phone?: string
  address?: string
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export interface Brand {
  id: string | number
  name: string
  description?: string
  logo?: string
  website?: string
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}
