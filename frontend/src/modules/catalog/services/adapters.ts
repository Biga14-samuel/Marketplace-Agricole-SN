/**
 * Adapters pour convertir les types API en types utilisables par les stores
 * Ces adapters permettent de résoudre les incompatibilités entre les types API et les modèles
 */

import type { Category as ApiCategory } from './api/categories.api';
import type { Product as ApiProduct } from './api/products.api';
import type { Tag as ApiTag } from './api/tags.api';
import type { Unit as ApiUnit } from './api/units.api';

/**
 * Adapter pour Category
 * Ajoute les méthodes manquantes attendues par le store
 */
export function adaptCategory(apiCategory: ApiCategory): ApiCategory & {
  toCreateRequest?: () => any;
  toUpdateRequest?: () => any;
} {
  return {
    ...apiCategory,
    toCreateRequest: () => apiCategory,
    toUpdateRequest: () => apiCategory
  };
}

/**
 * Adapter pour Product
 * Ajoute les propriétés et méthodes manquantes
 */
export function adaptProduct(apiProduct: ApiProduct): ApiProduct & {
  images?: any[];
  variants?: any[];
  stock_alerts?: any[];
} {
  return {
    ...apiProduct,
    images: (apiProduct as any).images || [],
    variants: (apiProduct as any).variants || [],
    stock_alerts: (apiProduct as any).stock_alerts || []
  };
}

/**
 * Adapter pour Tag
 */
export function adaptTag(apiTag: ApiTag): ApiTag {
  return apiTag;
}

/**
 * Adapter pour Unit
 */
export function adaptUnit(apiUnit: ApiUnit): ApiUnit {
  return apiUnit;
}
