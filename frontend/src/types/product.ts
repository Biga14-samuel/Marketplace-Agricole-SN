import type { Product, ProductFilter } from './catalog'

export type { Product, ProductFilter }

export interface ProductCreateDto {
  sku: string
  name: string
  description?: string
  shortDescription?: string
  price: number
  costPrice?: number
  taxRate?: number
  stockQuantity: number
  minStockLevel?: number | null
  maxStockLevel?: number | null
  reorderPoint?: number | null
  weight?: number | null
  height?: number | null
  width?: number | null
  depth?: number | null
  categoryId?: string | number | null
  supplierId?: string | number | null
  brandId?: string | number | null
  images?: string[]
  isActive?: boolean
  isFeatured?: boolean
  tags?: string[]
  metaTitle?: string | null
  metaDescription?: string | null
}

export type ProductUpdateDto = Partial<ProductCreateDto>

export interface ProductBulkUpdateDto {
  ids: Array<string | number>
  updates: ProductUpdateDto
}
