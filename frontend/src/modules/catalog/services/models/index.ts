// Model exports - export only model classes, not types from other models
export * from './category.model';
export * from './product.model';
export * from './tag.model';
export * from './unit.model';

// Export specific classes to avoid conflicts
export { ProductImage } from './productImage.model';
export { ProductVariant } from './productVariant.model';
export { StockAlert } from './stockAlert.model';
