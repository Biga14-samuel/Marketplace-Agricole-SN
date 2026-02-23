// Types DTO pour les produits (Data Transfer Objects)

/**
 * DTO pour la création d'un produit
 */
export interface ProductCreateDto {
  sku: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  cost_price?: number;
  tax_rate?: number;
  stock_quantity: number;
  min_stock_level?: number;
  max_stock_level?: number;
  reorder_point?: number;
  weight?: number;
  height?: number;
  width?: number;
  depth?: number;
  category_id?: string | number;
  supplier_id?: string | number;
  brand_id?: string | number;
  is_active?: boolean;
  is_featured?: boolean;
  tags?: string[];
  images?: string[];
  meta_title?: string;
  meta_description?: string;
}

/**
 * DTO pour la mise à jour d'un produit
 */
export interface ProductUpdateDto {
  sku?: string;
  name?: string;
  description?: string;
  short_description?: string;
  price?: number;
  cost_price?: number;
  tax_rate?: number;
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  reorder_point?: number;
  weight?: number;
  height?: number;
  width?: number;
  depth?: number;
  category_id?: string | number;
  supplier_id?: string | number;
  brand_id?: string | number;
  is_active?: boolean;
  is_featured?: boolean;
  tags?: string[];
  images?: string[];
  meta_title?: string;
  meta_description?: string;
}

/**
 * DTO pour la mise à jour en masse de produits
 */
export interface ProductBulkUpdateDto {
  product_ids: Array<string | number>;
  updates: Partial<ProductUpdateDto>;
}

/**
 * DTO pour les filtres de recherche de produits
 */
export interface ProductSearchDto {
  page?: number;
  limit?: number;
  category_id?: string | number;
  supplier_id?: string | number;
  brand_id?: string | number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  search_term?: string;
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}
