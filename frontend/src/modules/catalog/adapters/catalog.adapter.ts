// frontend/src/modules/catalog/adapters/catalog.adapter.ts

import type {
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../services/types'
import { Product as ProductModel, ProductImage as ProductImageModel, ProductVariant as ProductVariantModel, StockAlert as StockAlertModel } from '../services/models/product.model'
import { Category as CategoryModel } from '../services/models/category.model'
import { Tag as TagModel } from '../services/models/tag.model'
import { Unit as UnitModel } from '../services/models/unit.model'

// ============ BACKEND API TYPES ============
// These match the Python backend schemas

interface BackendCategory {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  parent_id?: number
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
  subcategories?: BackendCategory[]
}

interface BackendTag {
  id: number
  name: string
  slug: string
  type: 'bio' | 'local' | 'season' | 'promo'
  color?: string
  description?: string
  is_active: boolean
  created_at: string
}

interface BackendUnit {
  id: number
  name: string
  abbreviation: string
  type: 'weight' | 'volume' | 'piece'
  is_active: boolean
  created_at: string
}

interface BackendProductImage {
  id: number
  product_id: number
  url: string
  alt_text?: string
  position: number
  is_primary: boolean
  uploaded_at: string
}

interface BackendProductVariant {
  id: number
  product_id: number
  name: string
  sku?: string
  price_modifier: string // Decimal as string
  stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface BackendProduct {
  id: number
  producer_id: number
  category_id?: number
  unit_id?: number
  name: string
  slug: string
  description?: string
  price?: string // Decimal as string
  stock_quantity: number
  min_order: number
  max_order?: number
  is_active: boolean
  is_featured: boolean
  origin?: string
  harvest_date?: string
  created_at: string
  updated_at: string
  category?: BackendCategory
  unit?: BackendUnit
  tags: BackendTag[]
  images?: BackendProductImage[]
  variants?: BackendProductVariant[]
}

interface BackendStockAlert {
  id: number
  product_id: number
  threshold: number
  is_active: boolean
  notified_at?: string
  created_at: string
  updated_at: string
}

// ============ ENUM MAPPERS ============

const BACKEND_TO_FRONTEND_TAG_TYPE: Record<string, string> = {
  'bio': 'bio',
  'local': 'local',
  'season': 'season',
  'promo': 'promo'
}

const FRONTEND_TO_BACKEND_TAG_TYPE: Record<string, string> = {
  'bio': 'bio',
  'local': 'local',
  'season': 'season',
  'promo': 'promo'
}

const BACKEND_TO_FRONTEND_UNIT_TYPE: Record<string, string> = {
  'weight': 'weight',
  'volume': 'volume',
  'piece': 'piece'
}

const FRONTEND_TO_BACKEND_UNIT_TYPE: Record<string, string> = {
  'weight': 'weight',
  'volume': 'volume',
  'piece': 'piece'
}

// ============ UTILITY FUNCTIONS ============

export function parseDecimalString(value: string | undefined): number {
  if (!value) return 0
  return parseFloat(value) || 0
}

export function formatCurrencyXAF(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDateString(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-CM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ============ ADAPTERS ============

/**
 * Adapter for Category objects
 */
export class CategoryAdapter {
  static toFrontend(backendCategory: BackendCategory): any {
    return CategoryModel.fromApiData({
      ...backendCategory,
      position: backendCategory.position,
      parent_id: backendCategory.parent_id?.toString(),
      children: backendCategory.subcategories || []
    }) as any
  }

  static toBackendCreate(frontendRequest: any): any {
    // API expects { name, description?, parent_id?, order? }
    return {
      name: frontendRequest.name,
      description: frontendRequest.description,
      parent_id: frontendRequest.parent_id ? frontendRequest.parent_id : undefined,
      order: frontendRequest.position ?? frontendRequest.order ?? 0
    }
  }

  static toBackendUpdate(frontendRequest: any): any {
    const data: any = {}
    if (frontendRequest.name !== undefined) data.name = frontendRequest.name
    if (frontendRequest.description !== undefined) data.description = frontendRequest.description
    if (frontendRequest.parent_id !== undefined) data.parent_id = frontendRequest.parent_id
    if (frontendRequest.position !== undefined) data.order = frontendRequest.position
    if (frontendRequest.order !== undefined) data.order = frontendRequest.order
    return data
  }
}

/**
 * Adapter for Tag objects
 */
export class TagAdapter {
  static toFrontend(backendTag: BackendTag): any {
    return TagModel.fromApiData({
      ...backendTag,
      type: BACKEND_TO_FRONTEND_TAG_TYPE[backendTag.type] || backendTag.type
    }) as any
  }

  static toBackendCreate(frontendRequest: any): any {
    return {
      name: frontendRequest.name,
      slug: frontendRequest.slug,
      type: FRONTEND_TO_BACKEND_TAG_TYPE[frontendRequest.type] || frontendRequest.type,
      color: frontendRequest.color,
      description: frontendRequest.description,
      is_active: frontendRequest.is_active !== false
    }
  }
}

/**
 * Adapter for Unit objects
 */
export class UnitAdapter {
  static toFrontend(backendUnit: BackendUnit): any {
    return UnitModel.fromApiData({
      ...backendUnit,
      type: BACKEND_TO_FRONTEND_UNIT_TYPE[backendUnit.type] || backendUnit.type
    }) as any
  }

  static toBackendCreate(frontendRequest: any): any {
    return {
      name: frontendRequest.name,
      abbreviation: frontendRequest.abbreviation,
      type: FRONTEND_TO_BACKEND_UNIT_TYPE[frontendRequest.type] || frontendRequest.type,
      is_active: frontendRequest.is_active !== false
    }
  }
}

/**
 * Adapter for ProductImage objects
 */
export class ProductImageAdapter {
  static toFrontend(backendImage: BackendProductImage): any {
    return ProductImageModel.fromApiData({
      ...backendImage,
      is_main: backendImage.is_primary,
      order: backendImage.position,
      uploaded_at: backendImage.uploaded_at
    }) as any
  }

  static toBackendCreate(frontendRequest: any): any {
    return {
      url: frontendRequest.url,
      alt_text: frontendRequest.alt_text,
      position: frontendRequest.position || 0,
      is_primary: frontendRequest.is_primary || false
    }
  }
}

/**
 * Adapter for ProductVariant objects
 */
export class ProductVariantAdapter {
  static toFrontend(backendVariant: BackendProductVariant): any {
    const variantData: any = {
      id: backendVariant.id.toString(),
      product_id: backendVariant.product_id.toString(),
      name: backendVariant.name,
      sku: backendVariant.sku,
      price: parseDecimalString(backendVariant.price_modifier),
      stock_quantity: backendVariant.stock,
      is_active: backendVariant.is_active,
      created_at: backendVariant.created_at,
      updated_at: backendVariant.updated_at,
      attributes: {}
    }

    return ProductVariantModel.fromApiData(variantData) as any
  }

  static toBackendCreate(frontendRequest: any): any {
    return {
      name: frontendRequest.name,
      sku: frontendRequest.sku,
      price_modifier: frontendRequest.price_modifier?.toString() || '0',
      stock: frontendRequest.stock || 0,
      is_active: frontendRequest.is_active !== false
    }
  }
}

/**
 * Adapter for Product objects
 */
export class ProductAdapter {
  static toFrontend(backendProduct: BackendProduct): any {
    const modelData: any = {
      id: backendProduct.id.toString(),
      name: backendProduct.name,
      description: backendProduct.description,
      sku: undefined,
      price: parseDecimalString(backendProduct.price),
      compare_price: undefined,
      cost_price: undefined,
      stock_quantity: backendProduct.stock_quantity,
      low_stock_threshold: undefined,
      category_id: backendProduct.category_id?.toString(),
      unit_id: backendProduct.unit_id?.toString(),
      tags: backendProduct.tags?.map(t => t.slug) || [],
      is_active: backendProduct.is_active,
      is_virtual: false,
      weight: undefined,
      dimensions: undefined,
      created_at: backendProduct.created_at,
      updated_at: backendProduct.updated_at,
      category: backendProduct.category ? CategoryModel.fromApiData(backendProduct.category) : undefined,
      unit: backendProduct.unit ? UnitModel.fromApiData(backendProduct.unit) : undefined,
      tag_objects: backendProduct.tags?.map(t => TagModel.fromApiData(t)) || [],
      images: backendProduct.images?.map(img => ProductImageModel.fromApiData({
        ...img,
        is_main: img.is_primary,
        order: img.position
      })) || [],
      variants: backendProduct.variants?.map(v => ProductVariantModel.fromApiData({
        id: v.id,
        product_id: v.product_id,
        name: v.name,
        sku: v.sku,
        price: parseDecimalString((v as any).price || (v as any).price_modifier || '0'),
        stock_quantity: v.stock,
        attributes: (v as any).attributes || {},
        created_at: v.created_at,
        updated_at: v.updated_at
      })) || [],
      stock_alerts: []
    }

    return ProductModel.fromApiData(modelData) as any
  }

  static toBackendCreate(frontendRequest: CreateProductRequest): any {
    return {
      name: frontendRequest.name,
      slug: frontendRequest.slug,
      description: frontendRequest.description,
      category_id: frontendRequest.category_id ? parseInt(frontendRequest.category_id.toString()) : undefined,
      unit_id: frontendRequest.unit_id ? parseInt(frontendRequest.unit_id.toString()) : undefined,
      price: frontendRequest.price?.toString(),
      stock_quantity: frontendRequest.stock_quantity || 0,
      min_order: frontendRequest.min_order || 1,
      max_order: frontendRequest.max_order,
      is_active: frontendRequest.is_active !== false,
      is_featured: frontendRequest.is_featured || false,
      origin: frontendRequest.origin,
      harvest_date: (() => {
        const h = frontendRequest.harvest_date as any
        if (!h) return undefined
        return typeof h === 'string' ? h : h.toISOString().split('T')[0]
      })(),
      tag_ids: frontendRequest.tag_ids?.map(id => parseInt(id.toString())) || []
    }
  }

  static toBackendUpdate(frontendRequest: UpdateProductRequest): any {
    const updateData: any = {}

    if (frontendRequest.name !== undefined) updateData.name = frontendRequest.name
    if (frontendRequest.slug !== undefined) updateData.slug = frontendRequest.slug
    if (frontendRequest.description !== undefined) updateData.description = frontendRequest.description
    if (frontendRequest.category_id !== undefined) {
      updateData.category_id = frontendRequest.category_id ? parseInt(frontendRequest.category_id.toString()) : null
    }
    if (frontendRequest.unit_id !== undefined) {
      updateData.unit_id = frontendRequest.unit_id ? parseInt(frontendRequest.unit_id.toString()) : null
    }
    if (frontendRequest.price !== undefined) updateData.price = frontendRequest.price?.toString()
    if (frontendRequest.stock_quantity !== undefined) updateData.stock_quantity = frontendRequest.stock_quantity
    if (frontendRequest.min_order !== undefined) updateData.min_order = frontendRequest.min_order
    if (frontendRequest.max_order !== undefined) updateData.max_order = frontendRequest.max_order
    if (frontendRequest.is_active !== undefined) updateData.is_active = frontendRequest.is_active
    if (frontendRequest.is_featured !== undefined) updateData.is_featured = frontendRequest.is_featured
    if (frontendRequest.origin !== undefined) updateData.origin = frontendRequest.origin
    if (frontendRequest.harvest_date !== undefined) {
      const h = frontendRequest.harvest_date as any
      updateData.harvest_date = h ? (typeof h === 'string' ? h : h.toISOString().split('T')[0]) : null
    }
    if (frontendRequest.tag_ids !== undefined) {
      updateData.tag_ids = frontendRequest.tag_ids?.map(id => parseInt(id.toString())) || []
    }

    return updateData
  }
}

/**
 * Adapter for StockAlert objects
 */
export class StockAlertAdapter {
  static toFrontend(backendAlert: BackendStockAlert): any {
    return StockAlertModel.fromApiData({
      ...backendAlert,
      product_id: backendAlert.product_id.toString(),
      created_at: backendAlert.created_at,
      updated_at: backendAlert.updated_at,
      notified_at: backendAlert.notified_at
    }) as any
  }

  static toBackendCreate(frontendRequest: any): any {
    return {
      product_id: parseInt(frontendRequest.product_id.toString()),
      threshold: frontendRequest.threshold,
      is_active: frontendRequest.is_active !== false
    }
  }
}

// Exports are provided via individual `export class` declarations above.