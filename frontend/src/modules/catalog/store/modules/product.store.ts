// @ts-nocheck
// modules/catalog/store/modules/product.store.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { productsApi } from '../../services/api/products.api';
import type { SearchProductsParams, ProductsSearchResponse } from '../../services/models/product.model';
import { ProductHelper, ProductInventoryManager } from '../../services/models/product.model';
import {
  type CreateProductImageRequest
} from '../../services/models/productImage.model';
import {
  type CreateVariantRequest
} from '../../services/models/productVariant.model';
import {
  type CreateStockAlertRequest
} from '../../services/models/stockAlert.model';

export const useProductStore = defineStore('product', () => {
  // ============================================
  // State
  // ============================================

  // Liste de tous les produits
  const products = ref<Product[]>([]);

  // Produit actuellement sélectionné/consulté
  const currentProduct = ref<Product | null>(null);

  // Produit complet avec toutes les relations
  const completeProduct = ref<CompleteProduct | null>(null);

  // État de chargement
  const loading = ref<boolean>(false);

  // Erreurs
  const error = ref<string | null>(null);

  // Cache pour les produits par ID
  const productsCache = ref<Map<string, Product>>(new Map());
  const completeProductsCache = ref<Map<string, CompleteProduct>>(new Map());

  // État de l'opération en cours
  const operationStatus = ref<'idle' | 'creating' | 'updating' | 'deleting' | 'fetching' | 'uploading'>('idle');

  // Produits sélectionnés (pour les opérations en lot)
  const selectedProducts = ref<Set<string>>(new Set());

  // Filtres de recherche courants
  const currentFilters = ref<SearchProductsParams>({
    page: 1,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  // Résultats de la recherche (avec pagination)
  const searchResults = ref<ProductsSearchResponse>({
    products: [],
    total: 0,
    total_pages: 1,
  });

  // Gestionnaire d'inventaire
  const inventoryManager = ref<ProductInventoryManager>(new ProductInventoryManager());

  // Images en cours de téléchargement
  const uploadingImages = ref<Map<string, { progress: number; error?: string }>>(new Map());

  // ============================================
  // Getters / Computed
  // ============================================

  // Tous les produits
  const allProducts = computed(() => products.value);

  // Produits filtrés selon les critères actuels
  const filteredProducts = computed(() => {
    if (!currentFilters.value.search && !currentFilters.value.category_id && !currentFilters.value.tags) {
      return products.value;
    }

    return ProductHelper.filterBySearch(
      products.value,
      currentFilters.value.search || ''
    );
  });

  // Produit par ID
  const getProductById = computed(() => (id: string) =>
    products.value.find(product => product.id === id) || null
  );

  // Produit par SKU
  const getProductBySKU = computed(() => (sku: string) =>
    ProductHelper.findBySKU(products.value, sku)
  );

  // Produits en stock
  const inStockProducts = computed(() =>
    ProductHelper.filterByStockStatus(products.value, 'in_stock')
  );

  // Produits en rupture de stock
  const outOfStockProducts = computed(() =>
    ProductHelper.filterByStockStatus(products.value, 'out_of_stock')
  );

  // Produits avec stock faible
  const lowStockProducts = computed(() =>
    ProductHelper.filterByStockStatus(products.value, 'low_stock')
  );

  // Produits en promotion
  const discountedProducts = computed(() =>
    ProductHelper.getDiscountedProducts(products.value)
  );

  // Produits les plus récents
  const recentProducts = computed(() =>
    ProductHelper.getRecentProducts(products.value, 10)
  );

  // Produits les plus vendus (simulé)
  const bestSellingProducts = computed(() =>
    ProductHelper.getBestSellingProducts(products.value, 10)
  );

  // Options de produits pour les sélecteurs
  const productOptions = computed(() =>
    ProductHelper.formatForSelect(filteredProducts.value)
  );

  // Produits sélectionnés
  const selectedProductList = computed(() =>
    Array.from(selectedProducts.value)
      .map(id => getProductById.value(id))
      .filter(Boolean) as Product[]
  );

  // Statistiques des produits
  const productStats = computed(() =>
    ProductHelper.getProductStats(products.value)
  );

  // Produits groupés par catégorie
  const productsByCategory = computed(() =>
    ProductHelper.groupByCategory(products.value)
  );

  // Vérifier si un SKU existe déjà
  const skuExists = computed(() => (sku: string, excludeId?: string) =>
    ProductHelper.skuExists(products.value, sku, excludeId)
  );

  // Images du produit courant
  const currentProductImages = computed(() =>
    completeProduct.value?.images || []
  );

  // Variantes du produit courant
  const currentProductVariants = computed(() =>
    completeProduct.value?.variants || []
  );

  // Alertes de stock du produit courant
  const currentProductStockAlerts = computed(() =>
    completeProduct.value?.stock_alerts || []
  );

  // Image principale du produit courant
  const currentProductMainImage = computed(() =>
    completeProduct.value?.images?.find(img => img.is_main) ||
    completeProduct.value?.images?.[0] ||
    null
  );

  // ============================================
  // Actions / Methods
  // ============================================

  /**
   * Créer un produit
   * Endpoint: POST /api/v1/products-catalog/products/
   */
  const createProduct = async (data: CreateProductRequest): Promise<Product> => {
    try {
      operationStatus.value = 'creating';
      loading.value = true;
      error.value = null;

      // Vérifier si le SKU existe déjà
      if (data.sku && skuExists.value(data.sku)) {
        throw new Error(`Un produit avec le SKU "${data.sku}" existe déjà`);
      }

      const newProductData = await productsApi.createProduct(data);
      const newProduct = new Product(newProductData);

      // Ajouter à la liste
      products.value.push(newProduct);

      // Mettre à jour le cache
      productsCache.value.set(newProduct.id, newProduct);

      // Mettre à jour l'inventaire
      inventoryManager.value.addProduct(newProduct);

      return newProduct;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création du produit';
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Rechercher des produits
   * Endpoint: GET /api/v1/products-catalog/products/
   */
  const searchProducts = async (params?: SearchProductsParams, merge = false): Promise<ProductsSearchResponse> => {
    try {
      operationStatus.value = 'fetching';
      loading.value = true;
      error.value = null;

      // Mettre à jour les filtres courants
      if (params) {
        currentFilters.value = { ...currentFilters.value, ...params };
      }

      const response = await productsApi.searchProducts(currentFilters.value);
      searchResults.value = response;

      // Mettre à jour la liste des produits
      if (merge && currentFilters.value.page && currentFilters.value.page > 1) {
        // Ajouter à la liste existante (pour le scroll infini)
        const existingIds = new Set(products.value.map(p => p.id));
        const newProducts = response.products.filter(p => !existingIds.has(p.id));
        products.value.push(...newProducts);
      } else {
        // Remplacer la liste
        products.value = response.products;
      }

      // Mettre à jour le cache
      response.products.forEach(product => {
        productsCache.value.set(product.id, product);
        inventoryManager.value.addProduct(product);
      });

      return response;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la recherche des produits';
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Obtenir mes produits
   * Endpoint: GET /api/v1/products-catalog/products/my-products
   */
  const getMyProducts = async (params?: Omit<SearchProductsParams, 'search'>): Promise<ProductsSearchResponse> => {
    try {
      operationStatus.value = 'fetching';
      loading.value = true;
      error.value = null;

      const response = await productsApi.getMyProducts(params);
      searchResults.value = response;

      // Mettre à jour la liste des produits
      products.value = response.products;

      // Mettre à jour le cache
      response.products.forEach(product => {
        productsCache.value.set(product.id, product);
        inventoryManager.value.addProduct(product);
      });

      return response;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération de vos produits';
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Obtenir un produit par son ID
   * Endpoint: GET /api/v1/products-catalog/products/{product_id}
   */
  const getProductByIdAction = async (productId: string, forceRefresh = false): Promise<Product> => {
    try {
      // Vérifier le cache d'abord
      const cachedProduct = productsCache.value.get(productId);
      if (cachedProduct && !forceRefresh) {
        currentProduct.value = cachedProduct;
        return cachedProduct;
      }

      operationStatus.value = 'fetching';
      loading.value = true;
      error.value = null;

      const product = await productsApi.getProductById(productId);

      // Mettre à jour le cache
      productsCache.value.set(product.id, product);

      // Mettre à jour la liste
      const index = products.value.findIndex(p => p.id === productId);
      if (index !== -1) {
        products.value[index] = product;
      } else {
        products.value.push(product);
      }

      currentProduct.value = product;

      // Mettre à jour l'inventaire
      inventoryManager.value.addProduct(product);

      return product;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la récupération du produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Mettre à jour un produit
   * Endpoint: PUT /api/v1/products-catalog/products/{product_id}
   */
  const updateProduct = async (productId: string, data: UpdateProductRequest): Promise<Product> => {
    try {
      operationStatus.value = 'updating';
      loading.value = true;
      error.value = null;

      // Vérifier si le nouveau SKU existe déjà (excluant le produit actuel)
      if (data.sku && skuExists.value(data.sku, productId)) {
        throw new Error(`Un produit avec le SKU "${data.sku}" existe déjà`);
      }

      const updatedProduct = await productsApi.updateProduct(productId, data);

      // Mettre à jour le cache
      productsCache.value.set(productId, updatedProduct);

      // Mettre à jour la liste
      const index = products.value.findIndex(p => p.id === productId);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }

      // Mettre à jour le produit courant
      if (currentProduct.value?.id === productId) {
        currentProduct.value = updatedProduct;
      }

      // Mettre à jour l'inventaire
      inventoryManager.value.addProduct(updatedProduct);

      // Invalider le cache du produit complet
      completeProductsCache.value.delete(productId);

      return updatedProduct;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la mise à jour du produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Supprimer un produit
   * Endpoint: DELETE /api/v1/products-catalog/products/{product_id}
   */
  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      operationStatus.value = 'deleting';
      loading.value = true;
      error.value = null;

      await productsApi.deleteProduct(productId);

      // Supprimer de la liste
      products.value = products.value.filter(p => p.id !== productId);

      // Supprimer des caches
      productsCache.value.delete(productId);
      completeProductsCache.value.delete(productId);

      // Désélectionner si nécessaire
      selectedProducts.value.delete(productId);

      // Supprimer de l'inventaire
      inventoryManager.value.removeProduct(productId);

      // Réinitialiser les produits courants si nécessaire
      if (currentProduct.value?.id === productId) {
        currentProduct.value = null;
      }
      if (completeProduct.value?.id === productId) {
        completeProduct.value = null;
      }

    } catch (err: any) {
      error.value = err.message || `Erreur lors de la suppression du produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Obtenir un produit complet
   * Endpoint: GET /api/v1/products-catalog/products/{product_id}/complete
   */
  const getCompleteProduct = async (productId: string, forceRefresh = false): Promise<CompleteProduct> => {
    try {
      // Vérifier le cache d'abord
      const cachedCompleteProduct = completeProductsCache.value.get(productId);
      if (cachedCompleteProduct && !forceRefresh) {
        completeProduct.value = cachedCompleteProduct;
        return cachedCompleteProduct;
      }

      operationStatus.value = 'fetching';
      loading.value = true;
      error.value = null;

      const complete = await productsApi.getCompleteProduct(productId);
      completeProduct.value = complete;
      completeProductsCache.value.set(productId, complete);

      // Mettre à jour aussi le produit de base dans le cache
      productsCache.value.set(productId, complete);

      // Mettre à jour l'inventaire
      inventoryManager.value.addProduct(complete);

      return complete;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la récupération du produit complet ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Mettre à jour le stock d'un produit
   * Endpoint: POST /api/v1/products-catalog/products/{product_id}/stock
   */
  const updateStock = async (productId: string, data: UpdateStockRequest): Promise<Product> => {
    try {
      operationStatus.value = 'updating';
      loading.value = true;
      error.value = null;

      const updatedProduct = await productsApi.updateStock(productId, data);

      // Mettre à jour le cache
      productsCache.value.set(productId, updatedProduct);

      // Mettre à jour la liste
      const index = products.value.findIndex(p => p.id === productId);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }

      // Mettre à jour les produits courants
      if (currentProduct.value?.id === productId) {
        currentProduct.value = updatedProduct;
      }

      // Mettre à jour l'inventaire
      inventoryManager.value.updateStock(productId, data.stock_quantity);

      // Invalider le cache du produit complet
      completeProductsCache.value.delete(productId);

      return updatedProduct;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la mise à jour du stock du produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Ajouter une image à un produit
   * Endpoint: POST /api/v1/products-catalog/products/{product_id}/images
   */
  const addProductImage = async (productId: string, data: CreateProductImageRequest): Promise<ProductImage> => {
    try {
      operationStatus.value = 'uploading';
      loading.value = true;
      error.value = null;

      const image = await productsApi.addProductImage(productId, data);

      // Mettre à jour le produit complet dans le cache
      const cachedComplete = completeProductsCache.value.get(productId);
      if (cachedComplete) {
        cachedComplete.images.push(image);
        completeProductsCache.value.set(productId, cachedComplete);

        if (completeProduct.value?.id === productId) {
          completeProduct.value = cachedComplete;
        }
      }

      // Invalider le cache du produit complet pour forcer un rechargement
      completeProductsCache.value.delete(productId);

      return image;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de l'ajout de l'image au produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Obtenir les images d'un produit
   * Endpoint: GET /api/v1/products-catalog/products/{product_id}/images
   */
  const getProductImages = async (productId: string): Promise<ProductImage[]> => {
    try {
      operationStatus.value = 'fetching';
      loading.value = true;
      error.value = null;

      const images = await productsApi.getProductImages(productId);

      // Mettre à jour le produit complet dans le cache
      const cachedComplete = completeProductsCache.value.get(productId);
      if (cachedComplete) {
        cachedComplete.images = images;
        completeProductsCache.value.set(productId, cachedComplete);

        if (completeProduct.value?.id === productId) {
          completeProduct.value = cachedComplete;
        }
      }

      return images;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la récupération des images du produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Ajouter une variante à un produit
   * Endpoint: POST /api/v1/products-catalog/products/{product_id}/variants
   */
  const addProductVariant = async (productId: string, data: CreateVariantRequest): Promise<ProductVariant> => {
    try {
      operationStatus.value = 'creating';
      loading.value = true;
      error.value = null;

      const variant = await productsApi.addProductVariant(productId, data);

      // Mettre à jour le produit complet dans le cache
      const cachedComplete = completeProductsCache.value.get(productId);
      if (cachedComplete) {
        cachedComplete.variants.push(variant);
        completeProductsCache.value.set(productId, cachedComplete);

        if (completeProduct.value?.id === productId) {
          completeProduct.value = cachedComplete;
        }
      }

      // Invalider le cache du produit complet pour forcer un rechargement
      completeProductsCache.value.delete(productId);

      return variant;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de l'ajout de la variante au produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Obtenir les variantes d'un produit
   * Endpoint: GET /api/v1/products-catalog/products/{product_id}/variants
   */
  const getProductVariants = async (productId: string): Promise<ProductVariant[]> => {
    try {
      operationStatus.value = 'fetching';
      loading.value = true;
      error.value = null;

      const variants = await productsApi.getProductVariants(productId);

      // Mettre à jour le produit complet dans le cache
      const cachedComplete = completeProductsCache.value.get(productId);
      if (cachedComplete) {
        cachedComplete.variants = variants;
        completeProductsCache.value.set(productId, cachedComplete);

        if (completeProduct.value?.id === productId) {
          completeProduct.value = cachedComplete;
        }
      }

      return variants;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la récupération des variantes du produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Créer une alerte de stock pour un produit
   * Endpoint: POST /api/v1/products-catalog/products/{product_id}/stock-alert
   */
  const createStockAlert = async (productId: string, data: CreateStockAlertRequest): Promise<StockAlert> => {
    try {
      operationStatus.value = 'creating';
      loading.value = true;
      error.value = null;

      const alert = await productsApi.createStockAlert(productId, data);

      // Mettre à jour le produit complet dans le cache
      const cachedComplete = completeProductsCache.value.get(productId);
      if (cachedComplete) {
        cachedComplete.stock_alerts.push(alert);
        completeProductsCache.value.set(productId, cachedComplete);

        if (completeProduct.value?.id === productId) {
          completeProduct.value = cachedComplete;
        }
      }

      return alert;
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la création de l'alerte de stock pour le produit ${productId}`;
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Sélectionner/désélectionner un produit
   */
  const toggleProductSelection = (productId: string): void => {
    if (selectedProducts.value.has(productId)) {
      selectedProducts.value.delete(productId);
    } else {
      selectedProducts.value.add(productId);
    }
  };

  /**
   * Sélectionner tous les produits
   */
  const selectAllProducts = (): void => {
    filteredProducts.value.forEach(product => {
      selectedProducts.value.add(product.id);
    });
  };

  /**
   * Désélectionner tous les produits
   */
  const deselectAllProducts = (): void => {
    selectedProducts.value.clear();
  };

  /**
   * Basculer la sélection de tous les produits
   */
  const toggleSelectAllProducts = (): void => {
    const allFilteredIds = new Set(filteredProducts.value.map(product => product.id));
    const allSelected = Array.from(selectedProducts.value).every(id => allFilteredIds.has(id));

    if (allSelected) {
      deselectAllProducts();
    } else {
      selectAllProducts();
    }
  };

  /**
   * Supprimer plusieurs produits
   */
  const deleteSelectedProducts = async (): Promise<void> => {
    try {
      operationStatus.value = 'deleting';
      loading.value = true;
      error.value = null;

      const productIds = Array.from(selectedProducts.value);

      // Supprimer chaque produit
      for (const productId of productIds) {
        try {
          await productsApi.deleteProduct(productId);

          // Supprimer de la liste
          products.value = products.value.filter(p => p.id !== productId);

          // Supprimer des caches
          productsCache.value.delete(productId);
          completeProductsCache.value.delete(productId);

          // Supprimer de l'inventaire
          inventoryManager.value.removeProduct(productId);
        } catch (err) {
          console.error(`Erreur lors de la suppression du produit ${productId}`, err);
        }
      }

      // Vider la sélection
      selectedProducts.value.clear();

      // Réinitialiser les produits courants si nécessaire
      if (currentProduct.value && productIds.includes(currentProduct.value.id)) {
        currentProduct.value = null;
      }
      if (completeProduct.value && productIds.includes(completeProduct.value.id)) {
        completeProduct.value = null;
      }

    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression des produits';
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Mettre à jour le stock de plusieurs produits
   */
  const updateStockForSelected = async (stockQuantity: number, reason?: string): Promise<void> => {
    try {
      operationStatus.value = 'updating';
      loading.value = true;
      error.value = null;

      const productIds = Array.from(selectedProducts.value);

      for (const productId of productIds) {
        try {
          await updateStock(productId, { stock_quantity: stockQuantity, adjustment_reason: reason });
        } catch (err) {
          console.error(`Erreur lors de la mise à jour du stock du produit ${productId}`, err);
        }
      }

    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du stock des produits';
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Activer/désactiver plusieurs produits
   */
  const toggleActiveForSelected = async (isActive: boolean): Promise<void> => {
    try {
      operationStatus.value = 'updating';
      loading.value = true;
      error.value = null;

      const productIds = Array.from(selectedProducts.value);

      for (const productId of productIds) {
        try {
          await updateProduct(productId, { is_active: isActive });
        } catch (err) {
          console.error(`Erreur lors de la mise à jour du statut du produit ${productId}`, err);
        }
      }

    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du statut des produits';
      throw err;
    } finally {
      loading.value = false;
      operationStatus.value = 'idle';
    }
  };

  /**
   * Vérifier la disponibilité d'un produit
   */
  const checkAvailability = (productId: string, quantity: number): boolean => {
    return inventoryManager.value.checkAvailability(productId, quantity);
  };

  /**
   * Réserver du stock
   */
  const reserveStock = (productId: string, quantity: number): boolean => {
    return inventoryManager.value.reserveStock(productId, quantity);
  };

  /**
   * Libérer du stock réservé
   */
  const releaseStock = (productId: string, quantity: number): void => {
    inventoryManager.value.releaseStock(productId, quantity);
  };

  /**
   * Obtenir les alertes de stock déclenchées
   */
  const getTriggeredStockAlerts = () => {
    return inventoryManager.value.checkStockAlerts();
  };

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = (): void => {
    currentFilters.value = {
    };
    searchResults.value = {
    };
  };

  /**
   * Réinitialiser le store
   */
  const resetStore = (): void => {
    products.value = [];
    currentProduct.value = null;
    completeProduct.value = null;
    productsCache.value.clear();
    completeProductsCache.value.clear();
    selectedProducts.value.clear();
    inventoryManager.value = new ProductInventoryManager();
    uploadingImages.value.clear();
    resetFilters();
    loading.value = false;
    error.value = null;
    operationStatus.value = 'idle';
  };

  // ============================================
  // Retour du store
  // ============================================

  return {
    // State
    products,
    currentProduct,
    completeProduct,
    loading,
    error,
    operationStatus,
    selectedProducts,
    currentFilters,
    searchResults,
    inventoryManager,
    uploadingImages,

    // Getters
    allProducts,
    filteredProducts,
    getProductById,
    getProductBySKU,
    inStockProducts,
    outOfStockProducts,
    lowStockProducts,
    discountedProducts,
    recentProducts,
    bestSellingProducts,
    productOptions,
    selectedProductList,
    productStats,
    productsByCategory,
    skuExists,
    currentProductImages,
    currentProductVariants,
    currentProductStockAlerts,
    currentProductMainImage,

    // Actions (Endpoints principaux)
    createProduct,
    searchProducts,
    getMyProducts,
    getProductById: getProductByIdAction,
    updateProduct,
    deleteProduct,
    getCompleteProduct,
    updateStock,
    addProductImage,
    getProductImages,
    addProductVariant,
    getProductVariants,
    createStockAlert,

    // Actions supplémentaires
    toggleProductSelection,
    selectAllProducts,
    deselectAllProducts,
    toggleSelectAllProducts,
    deleteSelectedProducts,
    updateStockForSelected,
    toggleActiveForSelected,
    checkAvailability,
    reserveStock,
    releaseStock,
    getTriggeredStockAlerts,
    resetFilters,
    resetStore,
  };
});

// Type export pour une utilisation externe
export type ProductStore = ReturnType<typeof useProductStore>;