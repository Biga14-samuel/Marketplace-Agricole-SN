// validators/product.validators.ts
import { z } from 'zod'
import type { 
  Product, 
  ProductFilter,
  ProductCreateDto,
  ProductUpdateDto,
  ProductBulkUpdateDto,
  ProductSearchDto
} from '@/modules/catalog/types/catalog.types'
/**
 * ============================================
 * SCHÉMAS ZOD POUR LA VALIDATION
 * ============================================
 */

// Schéma de base pour un produit
export const ProductSchema = z.object({
  sku: z.string()
    .min(1, 'Le SKU est requis')
    .max(50, 'Le SKU ne doit pas dépasser 50 caractères')
    .regex(/^[A-Z0-9\-_]+$/, 'Le SKU doit contenir uniquement des lettres majuscules, chiffres, tirets et underscores'),
  
  name: z.string()
    .min(1, 'Le nom est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(200, 'Le nom ne doit pas dépasser 200 caractères'),
  
  description: z.string()
    .optional()
    .or(z.literal(''))
    .transform(val => val || ''),
  
  short_description: z.union([z.string().max(500, 'La description courte ne doit pas dépasser 500 caractères'), z.literal('')])
    .optional()
    .transform(val => val || ''),
  
  price: z.number()
    .min(0, 'Le prix doit être positif ou zéro')
    .max(1000000, 'Le prix ne doit pas dépasser 1 000 000'),
  
  cost_price: z.number()
    .optional()
    .refine(val => val === undefined || val >= 0, 'Le prix de revient doit être positif ou zéro'),
  
  tax_rate: z.number()
    .optional()
    .refine(val => val === undefined || (val >= 0 && val <= 100), 'Le taux de TVA doit être entre 0 et 100%'),
  
  stock_quantity: z.number()
    .int('La quantité doit être un nombre entier')
    .min(0, 'La quantité ne peut pas être négative'),
  
  min_stock_level: z.number()
    .int('Le stock minimum doit être un nombre entier')
    .min(0, 'Le stock minimum ne peut pas être négatif')
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  max_stock_level: z.number()
    .int('Le stock maximum doit être un nombre entier')
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  reorder_point: z.number()
    .int('Le point de réappro doit être un nombre entier')
    .min(0, 'Le point de réappro ne peut pas être négatif')
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  weight: z.number()
    .min(0, 'Le poids ne peut pas être négatif')
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  height: z.number()
    .min(0, 'La hauteur ne peut pas être négative')
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  width: z.number()
    .min(0, 'La largeur ne peut pas être négative')
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  depth: z.number()
    .min(0, 'La profondeur ne peut pas être négative')
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  category_id: z.union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  supplier_id: z.union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  brand_id: z.union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
  
  images: z.array(z.string().url('L\'URL de l\'image n\'est pas valide'))
    .optional()
    .default([]),
  
  is_active: z.boolean()
    .default(true),
  
  is_featured: z.boolean()
    .default(false),
  
  tags: z.array(z.string().min(1, 'Un tag ne peut pas être vide'))
    .optional()
    .default([]),
  
  meta_title: z.string()
    .max(70, 'Le meta title ne doit pas dépasser 70 caractères')
    .optional()
    .nullable()
    .transform(val => val || undefined),
  
  meta_description: z.string()
    .max(160, 'La meta description ne doit pas dépasser 160 caractères')
    .optional()
    .nullable()
    .transform(val => val || undefined)
}).refine(data => {
  // Validation: maxStockLevel doit être >= minStockLevel si les deux sont définis
  if (data.max_stock_level !== undefined && data.min_stock_level !== undefined) {
    return data.max_stock_level >= data.min_stock_level
  }
  return true
}, {
  message: 'Le stock maximum doit être supérieur ou égal au stock minimum',
  path: ['maxStockLevel']
}).refine(data => {
  // Validation: reorderPoint doit être entre minStockLevel et maxStockLevel
  if (data.reorder_point !== undefined) {
    if (data.min_stock_level !== undefined && data.reorder_point < data.min_stock_level) {
      return false
    }
    if (data.max_stock_level !== undefined && data.reorder_point > data.max_stock_level) {
      return false
    }
  }
  return true
}, {
  message: 'Le point de réapprovisionnement doit être entre le stock minimum et maximum',
  path: ['reorderPoint']
})

// Schéma pour la création d'un produit (POST /products)
export const ProductCreateSchema = ProductSchema

// Schéma pour la mise à jour d'un produit (PUT /products/:id)
export const ProductUpdateSchema = ProductSchema.partial()

// Schéma pour la mise à jour en masse (POST /products/bulk)
export const ProductBulkUpdateSchema = z.object({
  product_ids: z.array(z.union([z.string(), z.number()]))
    .min(1, 'Au moins un ID de produit est requis'),
  updates: ProductSchema.partial()
})

// Schéma pour les filtres de recherche (GET /products/search)
export const ProductFilterSchema = z.object({
  category_id: z.union([z.string(), z.number()]).optional().nullable(),
  supplier_id: z.union([z.string(), z.number()]).optional().nullable(),
  brand_id: z.union([z.string(), z.number()]).optional().nullable(),
  minPrice: z.number().min(0).optional().nullable(),
  maxPrice: z.number().min(0).optional().nullable(),
  inStock: z.boolean().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  is_featured: z.boolean().optional().nullable(),
  searchTerm: z.string().optional().nullable(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['name', 'price', 'stock_quantity', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
}).refine(data => {
  // Validation: maxPrice doit être >= minPrice si les deux sont définis
  if (data.maxPrice !== null && data.minPrice !== null && 
      data.maxPrice !== undefined && data.minPrice !== undefined) {
    return data.maxPrice >= data.minPrice
  }
  return true
}, {
  message: 'Le prix maximum doit être supérieur ou égal au prix minimum',
  path: ['maxPrice']
})

// Schéma pour l'import de produits
export const ProductImportSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'Le fichier ne doit pas dépasser 10MB')
    .refine(file => {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ]
      return allowedTypes.includes(file.type)
    }, 'Le fichier doit être un Excel (.xlsx, .xls) ou CSV')
})

// Schéma pour l'export de produits (GET /products/export)
export const ProductExportSchema = z.object({
  format: z.enum(['csv', 'excel', 'pdf']).default('csv'),
  columns: z.array(z.string()).optional(),
  filter: ProductFilterSchema.partial().optional()
})

/**
 * ============================================
 * FONCTIONS DE VALIDATION
 * ============================================
 */

/**
 * Valide les données pour la création d'un produit
 * Endpoint: POST /products
 */
export const validateProductCreate = (data: unknown): { success: boolean; data?: ProductCreateDto; error?: string } => {
  try {
    const validated = ProductCreateSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: message }
    }
    return { success: false, error: 'Données de produit invalides' }
  }
}

/**
 * Valide les données pour la mise à jour d'un produit
 * Endpoint: PUT /products/:id
 */
export const validateProductUpdate = (data: unknown): { success: boolean; data?: ProductUpdateDto; error?: string } => {
  try {
    const validated = ProductUpdateSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: message }
    }
    return { success: false, error: 'Données de mise à jour invalides' }
  }
}

/**
 * Valide les données pour la mise à jour en masse
 * Endpoint: POST /products/bulk
 */
export const validateProductBulkUpdate = (data: unknown): { success: boolean; data?: ProductBulkUpdateDto; error?: string } => {
  try {
    const validated = ProductBulkUpdateSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: message }
    }
    return { success: false, error: 'Données de mise à jour en masse invalides' }
  }
}

/**
 * Valide les filtres de recherche
 * Endpoint: GET /products/search
 */
export const validateProductFilter = (data: unknown): { success: boolean; data?: ProductSearchDto; error?: string } => {
  try {
    const validated = ProductFilterSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: message }
    }
    return { success: false, error: 'Filtres de recherche invalides' }
  }
}

/**
 * Valide les paramètres d'export
 * Endpoint: GET /products/export
 */
export const validateProductExport = (data: unknown): { success: boolean; data?: any; error?: string } => {
  try {
    const validated = ProductExportSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: message }
    }
    return { success: false, error: 'Paramètres d\'export invalides' }
  }
}

/**
 * Valide un fichier d'import
 */
export const validateProductImportFile = (file: File): { success: boolean; error?: string } => {
  try {
    ProductImportSchema.parse({ file })
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Fichier invalide' }
    }
    return { success: false, error: 'Fichier invalide' }
  }
}

/**
 * Valide le SKU pour l'unicité (à utiliser avec une vérification API)
 */
export const validateProductSku = (sku: string): { success: boolean; error?: string } => {
  if (!sku.trim()) {
    return { success: false, error: 'Le SKU est requis' }
  }
  
  if (sku.length > 50) {
    return { success: false, error: 'Le SKU ne doit pas dépasser 50 caractères' }
  }
  
  const skuRegex = /^[A-Z0-9\-_]+$/
  if (!skuRegex.test(sku)) {
    return { 
      success: false, 
      error: 'Le SKU doit contenir uniquement des lettres majuscules, chiffres, tirets et underscores' 
    }
  }
  
  return { success: true }
}

/**
 * Valide le prix et les informations financières
 */
export const validateProductPrice = (
  price: number, 
  costPrice?: number
): { success: boolean; error?: string; warnings?: string[] } => {
  const warnings: string[] = []
  
  if (price < 0) {
    return { success: false, error: 'Le prix ne peut pas être négatif' }
  }
  
  if (price > 1000000) {
    return { success: false, error: 'Le prix ne doit pas dépasser 1 000 000' }
  }
  
  if (costPrice !== undefined) {
    if (costPrice < 0) {
      return { success: false, error: 'Le prix de revient ne peut pas être négatif' }
    }
    
    if (costPrice > price) {
      warnings.push('Le prix de revient est supérieur au prix de vente')
    }
    
    if (price > 0 && costPrice > 0) {
      const margin = ((price - costPrice) / costPrice) * 100
      if (margin < 0) {
        warnings.push('La marge est négative')
      } else if (margin < 10) {
        warnings.push('La marge est inférieure à 10%')
      }
    }
  }
  
  return { 
    success: true, 
    warnings: warnings.length > 0 ? warnings : undefined 
  }
}

/**
 * Valide les niveaux de stock
 */
export const validateStockLevels = (
  stock_quantity: number,
  minStockLevel?: number,
  maxStockLevel?: number,
  reorderPoint?: number
): { success: boolean; error?: string; warnings?: string[] } => {
  const warnings: string[] = []
  
  if (stock_quantity < 0) {
    return { success: false, error: 'La quantité en stock ne peut pas être négative' }
  }
  
  if (minStockLevel !== undefined) {
    if (minStockLevel < 0) {
      return { success: false, error: 'Le stock minimum ne peut pas être négatif' }
    }
    
    if (stock_quantity < minStockLevel) {
      warnings.push('Le stock actuel est inférieur au stock minimum')
    }
  }
  
  if (maxStockLevel !== undefined) {
    if (maxStockLevel < 0) {
      return { success: false, error: 'Le stock maximum ne peut pas être négatif' }
    }
    
    if (minStockLevel !== undefined && maxStockLevel < minStockLevel) {
      return { 
        success: false, 
        error: 'Le stock maximum doit être supérieur ou égal au stock minimum' 
      }
    }
    
    if (stock_quantity > maxStockLevel) {
      warnings.push('Le stock actuel dépasse le stock maximum')
    }
  }
  
  if (reorderPoint !== undefined) {
    if (reorderPoint < 0) {
      return { success: false, error: 'Le point de réapprovisionnement ne peut pas être négatif' }
    }
    
    if (minStockLevel !== undefined && reorderPoint < minStockLevel) {
      return { 
        success: false, 
        error: 'Le point de réapprovisionnement doit être supérieur ou égal au stock minimum' 
      }
    }
    
    if (maxStockLevel !== undefined && reorderPoint > maxStockLevel) {
      return { 
        success: false, 
        error: 'Le point de réapprovisionnement doit être inférieur ou égal au stock maximum' 
      }
    }
    
    if (stock_quantity <= reorderPoint) {
      warnings.push('Le stock actuel est au niveau du point de réapprovisionnement')
    }
  }
  
  return { 
    success: true, 
    warnings: warnings.length > 0 ? warnings : undefined 
  }
}

/**
 * Valide les dimensions du produit
 */
export const validateProductDimensions = (
  weight?: number,
  height?: number,
  width?: number,
  depth?: number
): { success: boolean; error?: string } => {
  if (weight !== undefined && weight < 0) {
    return { success: false, error: 'Le poids ne peut pas être négatif' }
  }
  
  if (height !== undefined && height < 0) {
    return { success: false, error: 'La hauteur ne peut pas être négative' }
  }
  
  if (width !== undefined && width < 0) {
    return { success: false, error: 'La largeur ne peut pas être négative' }
  }
  
  if (depth !== undefined && depth < 0) {
    return { success: false, error: 'La profondeur ne peut pas être négative' }
  }
  
  return { success: true }
}

/**
 * Valide les URLs des images
 */
export const validateProductImages = (images: string[]): { success: boolean; error?: string } => {
  for (const image of images) {
    try {
      new URL(image)
    } catch {
      return { success: false, error: `L'URL de l'image n'est pas valide: ${image}` }
    }
  }
  
  if (images.length > 10) {
    return { success: false, error: 'Maximum 10 images autorisées' }
  }
  
  return { success: true }
}

/**
 * Valide les métadonnées SEO
 */
export const validateProductMetadata = (
  metaTitle?: string,
  metaDescription?: string
): { success: boolean; warnings?: string[] } => {
  const warnings: string[] = []
  
  if (metaTitle && metaTitle.length > 70) {
    warnings.push('Le meta title est trop long (idéalement < 70 caractères)')
  }
  
  if (metaTitle && metaTitle.length < 10) {
    warnings.push('Le meta title est trop court (idéalement > 10 caractères)')
  }
  
  if (metaDescription && metaDescription.length > 160) {
    warnings.push('La meta description est trop longue (idéalement < 160 caractères)')
  }
  
  if (metaDescription && metaDescription.length < 50) {
    warnings.push('La meta description est trop courte (idéalement > 50 caractères)')
  }
  
  return { 
    success: true, 
    warnings: warnings.length > 0 ? warnings : undefined 
  }
}

/**
 * Validation complète d'un produit avant soumission
 */
export const validateProductForSubmission = (
  product: Partial<Product>,
  mode: 'create' | 'update' = 'create'
): { 
  success: boolean; 
  errors: Record<string, string>; 
  warnings: Record<string, string[]> 
} => {
  const errors: Record<string, string> = {}
  const warnings: Record<string, string[]> = {}
  
  // Validation SKU
  if (mode === 'create' || product.sku !== undefined) {
    const skuValidation = validateProductSku(product.sku || '')
    if (!skuValidation.success) {
      errors.sku = skuValidation.error!
    }
  }
  
  // Validation nom
  if (!product.name?.trim()) {
    errors.name = 'Le nom est requis'
  } else if (product.name.length < 3) {
    errors.name = 'Le nom doit contenir au moins 3 caractères'
  } else if (product.name.length > 200) {
    errors.name = 'Le nom ne doit pas dépasser 200 caractères'
  }
  
  // Validation prix
  if (product.price !== undefined) {
    const priceValidation = validateProductPrice(product.price, product.cost_price)
    if (!priceValidation.success) {
      errors.price = priceValidation.error!
    }
    if (priceValidation.warnings) {
      warnings.price = priceValidation.warnings
    }
  }
  
  // Validation stock
  if (product.stock_quantity !== undefined) {
    const stockValidation = validateStockLevels(
      product.stock_quantity,
      product.low_stock_threshold,
      undefined, // max_stock_level n'existe pas sur Product API
      undefined  // reorder_point n'existe pas sur Product API
    )
    if (!stockValidation.success) {
      errors.stock_quantity = stockValidation.error!
    }
    if (stockValidation.warnings) {
      warnings.stock_quantity = stockValidation.warnings
    }
  }
  
  // Validation dimensions
  if (product.dimensions) {
    const dimensionsValidation = validateProductDimensions(
      product.weight,
      product.dimensions.height,
      product.dimensions.width,
      product.dimensions.length
    )
    if (!dimensionsValidation.success) {
      errors.dimensions = dimensionsValidation.error!
    }
  }
  
  // Note: images n'existe pas directement sur Product API
  // Les images sont gérées séparément via ProductImage
  
  // Note: meta_title et meta_description n'existent pas sur Product API
  // Ces métadonnées seraient gérées dans un système CMS séparé
  
  return {
    success: Object.keys(errors).length === 0,
    errors,
    warnings
  }
}

/**
 * Vérifie si un produit peut être désactivé
 */
export const canDeactivateProduct = (product: Product): { 
  canDeactivate: boolean; 
  reason?: string 
} => {
  if (product.stock_quantity > 0) {
    return { 
      canDeactivate: false, 
      reason: 'Le produit a encore du stock en inventaire' 
    }
  }
  
  // Vérifier s'il y a des commandes en cours pour ce produit
  // Cette vérification nécessiterait un appel API
  // Pour l'instant, nous retournons true mais dans la réalité,
  // il faudrait vérifier avec l'endpoint approprié
  
  return { canDeactivate: true }
}

/**
 * Vérifie si un produit peut être supprimé
 */
export const canDeleteProduct = (product: Product): { 
  canDelete: boolean; 
  reason?: string 
} => {
  if (product.stock_quantity > 0) {
    return { 
      canDelete: false, 
      reason: 'Le produit a encore du stock en inventaire' 
    }
  }
  
  // Vérifier s'il y a des commandes historiques pour ce produit
  // Cette vérification nécessiterait un appel API
  
  return { canDelete: true }
}

/**
 * ============================================
 * EXPORTS
 * ============================================
 */

export default {
  // Schémas
  ProductSchema,
  ProductCreateSchema,
  ProductUpdateSchema,
  ProductBulkUpdateSchema,
  ProductFilterSchema,
  ProductImportSchema,
  ProductExportSchema,
  
  // Fonctions de validation
  validateProductCreate,
  validateProductUpdate,
  validateProductBulkUpdate,
  validateProductFilter,
  validateProductExport,
  validateProductImportFile,
  validateProductSku,
  validateProductPrice,
  validateStockLevels,
  validateProductDimensions,
  validateProductImages,
  validateProductMetadata,
  validateProductForSubmission,
  canDeactivateProduct,
  canDeleteProduct
}





