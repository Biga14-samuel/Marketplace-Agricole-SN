// API exports - only export API functions, not types
export { categoriesApi } from './api/categories.api';
export { productsApi } from './api/products.api';
export { productImagesApi } from './api/productImages.api';
export { productVariantsApi } from './api/productVariants.api';
export { stockApi } from './api/stock.api';
export { stockAlertsApi } from './api/stockAlerts.api';
export { tagsApi } from './api/tags.api';
export { unitsApi } from './api/units.api';

// Export types from API files
export type {
  Category,
  CategoryTree,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from './api/categories.api';

export type {
  Product,
  CompleteProduct,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateStockRequest,
  SearchProductsParams,
  SearchProductsResponse
} from './api/products.api';

export type {
  ProductImage,
  CreateProductImageRequest,
  UpdateProductImageRequest
} from './api/productImages.api';

export type {
  ProductVariant,
  CreateVariantRequest,
  UpdateVariantRequest,
  VariantAttribute
} from './api/productVariants.api';



export type {
  StockAlert,
  CreateStockAlertRequest,
  UpdateStockAlertRequest,
  StockAlertStats
} from './api/stockAlerts.api';

export type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest
} from './api/tags.api';

export type {
  Unit,
  CreateUnitRequest,
  UpdateUnitRequest
} from './api/units.api';

// Model exports - export model classes
export * from './models';

// Type exports - export additional types
export type {
  ProductFilter,
  ProductWithMetadata,
  ProductsSearchResponse as ProductsSearchResponseType,
  StockAlertType,
  StockMovementType,
  StockReferenceType,
  CreateStockMovementRequest
} from './types';
