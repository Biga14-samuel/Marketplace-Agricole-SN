// module/catalog/services/models/product.model.ts

import type {
  CompleteProduct,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateStockRequest,
  SearchProductsParams,
  SearchProductsResponse
} from '../api/products.api';
import type { CreateProductImageRequest } from '../api/productImages.api';
import type { CreateVariantRequest } from '../api/productVariants.api';
import type { CreateStockAlertRequest } from '../api/stockAlerts.api';
import { Category } from './category.model';
import { Tag } from './tag.model';
import { Unit } from './unit.model';

export class Product {
    id: string;
    name: string;
    description?: string;
    sku?: string;
    price: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    category_id?: string;
    unit_id?: string;
    tags: string[];
    is_active: boolean;
    is_virtual: boolean;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    created_at: Date;
    updated_at: Date;
    category?: Category; // Populé lors de la récupération complète
    unit?: Unit; // Populé lors de la récupération complète
    tag_objects?: Tag[]; // Populé lors de la récupération complète
    images: ProductImage[];
    variants: ProductVariant[];
    stock_alerts: StockAlert[];

    constructor(data: Partial<Product> = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.description = data.description;
        this.sku = data.sku || this.generateSKU();
        this.price = data.price || 0;
        this.compare_price = data.compare_price;
        this.cost_price = data.cost_price;
        this.stock_quantity = data.stock_quantity || 0;
        this.low_stock_threshold = data.low_stock_threshold;
        this.category_id = data.category_id;
        this.unit_id = data.unit_id;
        this.tags = data.tags || [];
        this.is_active = data.is_active ?? true;
        this.is_virtual = data.is_virtual ?? false;
        this.weight = data.weight;
        this.dimensions = data.dimensions || {};
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
        this.category = data.category;
        this.unit = data.unit;
        this.tag_objects = data.tag_objects || [];
        this.images = data.images?.map(img => new ProductImage(img)) || [];
        this.variants = data.variants?.map(variant => new ProductVariant(variant)) || [];
        this.stock_alerts = data.stock_alerts?.map(alert => new StockAlert(alert)) || [];
    }

    // Factory method pour créer un produit à partir des données de l'API
    static fromApiData(data: any): Product {
        return new Product({
            id: data.id,
            name: data.name,
            description: data.description,
            sku: data.sku,
            price: data.price,
            compare_price: data.compare_price,
            cost_price: data.cost_price,
            stock_quantity: data.stock_quantity,
            low_stock_threshold: data.low_stock_threshold,
            category_id: data.category_id,
            unit_id: data.unit_id,
            tags: data.tags || [],
            is_active: data.is_active,
            is_virtual: data.is_virtual,
            weight: data.weight,
            dimensions: data.dimensions,
            created_at: data.created_at,
            updated_at: data.updated_at,
            category: data.category ? Category.fromApiData(data.category) : undefined,
            unit: data.unit ? Unit.fromApiData(data.unit) : undefined,
            tag_objects: data.tag_details?.map((tag: any) => Tag.fromApiData(tag)),
            images: data.images?.map((img: any) => ProductImage.fromApiData(img)),
            variants: data.variants?.map((variant: any) => ProductVariant.fromApiData(variant)),
            stock_alerts: data.stock_alerts?.map((alert: any) => StockAlert.fromApiData(alert)),
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateProductRequest {
        return {
            name: this.name,
            description: this.description,
            sku: this.sku,
            price: this.price,
            compare_price: this.compare_price,
            cost_price: this.cost_price,
            stock_quantity: this.stock_quantity,
            low_stock_threshold: this.low_stock_threshold,
            category_id: this.category_id,
            unit_id: this.unit_id,
            tags: this.tags,
            is_active: this.is_active,
            is_virtual: this.is_virtual,
            weight: this.weight,
            dimensions: this.dimensions,
        };
    }

    // Convertir en format de requête pour l'API (mise à jour)
    toUpdateRequest(): UpdateProductRequest {
        return {
            name: this.name,
            description: this.description,
            sku: this.sku,
            price: this.price,
            compare_price: this.compare_price,
            cost_price: this.cost_price,
            stock_quantity: this.stock_quantity,
            low_stock_threshold: this.low_stock_threshold,
            category_id: this.category_id,
            unit_id: this.unit_id,
            tags: this.tags,
            is_active: this.is_active,
            is_virtual: this.is_virtual,
            weight: this.weight,
            dimensions: this.dimensions,
        };
    }

    // Générer un SKU automatique
    generateSKU(): string {
        const prefix = this.name.substring(0, 3).toUpperCase().replace(/\s/g, '');
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }

    // Vérifier si le produit est valide pour la création
    isValidForCreation(): boolean {
        return !!this.name.trim() && this.price >= 0;
    }

    // Vérifier si le produit est valide pour la mise à jour
    isValidForUpdate(): boolean {
        return !!this.id && !!this.name.trim() && this.price >= 0;
    }

    // Vérifier si le produit est en stock
    isInStock(): boolean {
        return this.stock_quantity > 0;
    }

    // Vérifier si le stock est faible
    isLowStock(): boolean {
        if (!this.low_stock_threshold) return false;
        return this.stock_quantity <= this.low_stock_threshold && this.stock_quantity > 0;
    }

    // Vérifier si le produit est en rupture de stock
    isOutOfStock(): boolean {
        return this.stock_quantity <= 0;
    }

    // Vérifier si le produit a une promotion (compare_price)
    hasDiscount(): boolean {
        return !!this.compare_price && this.compare_price > this.price;
    }

    // Calculer le pourcentage de réduction
    getDiscountPercentage(): number {
        if (!this.hasDiscount() || !this.compare_price) return 0;
        return Math.round(((this.compare_price - this.price) / this.compare_price) * 100);
    }

    // Calculer la marge bénéficiaire
    getProfitMargin(): number {
        if (!this.cost_price || this.cost_price <= 0) return 0;
        return ((this.price - this.cost_price) / this.cost_price) * 100;
    }

    // Obtenir le prix formaté
    getFormattedPrice(): string {
        return `${this.price.toFixed(2)} €`;
    }

    // Obtenir le prix de comparaison formaté
    getFormattedComparePrice(): string {
        return this.compare_price ? `${this.compare_price.toFixed(2)} €` : '';
    }

    // Calculer le volume (dimensions)
    getVolume(): number | null {
        if (!this.dimensions?.length || !this.dimensions?.width || !this.dimensions?.height) {
            return null;
        }
        return this.dimensions.length * this.dimensions.width * this.dimensions.height;
    }

    // Calculer la densité (poids/volume)
    getDensity(): number | null {
        const volume = this.getVolume();
        if (!this.weight || !volume || volume === 0) return null;
        return this.weight / volume;
    }

    // Obtenir l'image principale
    getMainImage(): ProductImage | null {
        return this.images.find(img => img.is_main) || this.images[0] || null;
    }

    // Obtenir les images secondaires
    getSecondaryImages(): ProductImage[] {
        return this.images.filter(img => !img.is_main);
    }

    // Ajouter une image
    addImage(imageData: CreateProductImageRequest): void {
        const newImage = new ProductImage({
            ...imageData,
            product_id: this.id,
            order: this.images.length,
        });
        this.images.push(newImage);
    }

    // Supprimer une image
    removeImage(imageId: string): void {
        this.images = this.images.filter(img => img.id !== imageId);
    }

    // Définir une image comme principale
    setMainImage(imageId: string): void {
        this.images.forEach(img => {
            img.is_main = img.id === imageId;
        });
    }

    // Ajouter une variante
    addVariant(variantData: CreateVariantRequest): void {
        const newVariant = new ProductVariant({
            ...variantData,
            product_id: this.id,
        });
        this.variants.push(newVariant);
    }

    // Supprimer une variante
    removeVariant(variantId: string): void {
        this.variants = this.variants.filter(variant => variant.id !== variantId);
    }

    // Obtenir le stock total (produit + variantes)
    getTotalStock(): number {
        const variantsStock = this.variants.reduce((sum, variant) => sum + variant.stock_quantity, 0);
        return this.stock_quantity + variantsStock;
    }

    // Mettre à jour le stock
    updateStock(updateData: UpdateStockRequest): void {
        this.stock_quantity = updateData.stock_quantity;
        this.updated_at = new Date();
    }

    // Ajouter une alerte de stock
    addStockAlert(alertData: CreateStockAlertRequest): void {
        const newAlert = new StockAlert({
            ...alertData,
            product_id: this.id,
        });
        this.stock_alerts.push(newAlert);
    }

    // Vérifier si une alerte de stock est déclenchée
    isStockAlertTriggered(): boolean {
        if (!this.low_stock_threshold) return false;
        return this.stock_quantity <= this.low_stock_threshold;
    }

    // Obtenir les tags sous forme d'objets Tag
    getTagsAsObjects(): Tag[] {
        return this.tag_objects || [];
    }

    // Vérifier si le produit a un tag spécifique
    hasTag(tagId: string): boolean {
        return this.tags.includes(tagId) || this.tag_objects?.some(tag => tag.id === tagId) || false;
    }

    // Ajouter un tag
    addTag(tagId: string): void {
        if (!this.tags.includes(tagId)) {
            this.tags.push(tagId);
        }
    }

    // Retirer un tag
    removeTag(tagId: string): void {
        this.tags = this.tags.filter(id => id !== tagId);
    }

    // Cloner le produit
    clone(): Product {
        return new Product({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: new Date(this.updated_at),
            images: this.images.map(img => img.clone()),
            variants: this.variants.map(variant => variant.clone()),
            stock_alerts: this.stock_alerts.map(alert => alert.clone()),
        });
    }

    // Mettre à jour les propriétés
    update(data: Partial<Product>): void {
        Object.assign(this, data);
        this.updated_at = new Date();
    }

    // Vérifier si le produit correspond à un terme de recherche
    matchesSearch(searchTerm: string): boolean {
        const term = searchTerm.toLowerCase();
        return (
            this.name.toLowerCase().includes(term) ||
            (this.description && this.description.toLowerCase().includes(term)) ||
            (this.sku && this.sku.toLowerCase().includes(term)) ||
            false
        );
    }
}

export class ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_main: boolean;
    order: number;
    created_at: Date;

    constructor(data: Partial<ProductImage> = {}) {
        this.id = data.id || '';
        this.product_id = data.product_id || '';
        this.url = data.url || '';
        this.alt_text = data.alt_text;
        this.is_main = data.is_main || false;
        this.order = data.order || 0;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    }

    static fromApiData(data: any): ProductImage {
        return new ProductImage({
            id: data.id,
            product_id: data.product_id,
            url: data.url,
            alt_text: data.alt_text,
            is_main: data.is_main,
            order: data.order,
            created_at: data.created_at,
        });
    }

    toCreateRequest(): CreateProductImageRequest {
        return {
            url: this.url,
            alt_text: this.alt_text,
            is_main: this.is_main,
            order: this.order,
        };
    }

    clone(): ProductImage {
        return new ProductImage({
            ...this,
            created_at: new Date(this.created_at),
        });
    }
}

export class ProductVariant {
    id: string;
    product_id: string;
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    stock_quantity: number;
    attributes: Record<string, string>;
    created_at: Date;
    updated_at: Date;

    constructor(data: Partial<ProductVariant> = {}) {
        this.id = data.id || '';
        this.product_id = data.product_id || '';
        this.name = data.name || '';
        this.sku = data.sku || this.generateVariantSKU();
        this.price = data.price || 0;
        this.compare_price = data.compare_price;
        this.stock_quantity = data.stock_quantity || 0;
        this.attributes = data.attributes || {};
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
    }

    static fromApiData(data: any): ProductVariant {
        return new ProductVariant({
            id: data.id,
            product_id: data.product_id,
            name: data.name,
            sku: data.sku,
            price: data.price,
            compare_price: data.compare_price,
            stock_quantity: data.stock_quantity,
            attributes: data.attributes,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    }

    toCreateRequest(): CreateVariantRequest {
        return {
            name: this.name,
            sku: this.sku,
            price: this.price,
            compare_price: this.compare_price,
            stock_quantity: this.stock_quantity,
            attributes: this.attributes,
        };
    }

    generateVariantSKU(): string {
        const baseSKU = this.product_id.substring(0, 3).toUpperCase();
        const attrString = Object.values(this.attributes).join('-').substring(0, 10).toUpperCase();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${baseSKU}-${attrString}-${random}`;
    }

    getAttributeString(): string {
        return Object.entries(this.attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
    }

    isInStock(): boolean {
        return this.stock_quantity > 0;
    }

    clone(): ProductVariant {
        return new ProductVariant({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: new Date(this.updated_at),
        });
    }
}

export class StockAlert {
    id: string;
    product_id: string;
    threshold: number;
    is_active: boolean;
    created_at: Date;

    constructor(data: Partial<StockAlert> = {}) {
        this.id = data.id || '';
        this.product_id = data.product_id || '';
        this.threshold = data.threshold || 0;
        this.is_active = data.is_active ?? true;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    }

    static fromApiData(data: any): StockAlert {
        return new StockAlert({
            id: data.id,
            product_id: data.product_id,
            threshold: data.threshold,
            is_active: data.is_active,
            created_at: data.created_at,
        });
    }

    toCreateRequest(): CreateStockAlertRequest {
        return {
            threshold: this.threshold,
            is_active: this.is_active,
        };
    }

    isTriggered(currentStock: number): boolean {
        return this.is_active && currentStock <= this.threshold;
    }

    clone(): StockAlert {
        return new StockAlert({
            ...this,
            created_at: new Date(this.created_at),
        });
    }
}

// Helper functions
export const ProductHelper = {
    // Filtrer les produits par recherche
    filterBySearch(products: Product[], searchTerm: string): Product[] {
        if (!searchTerm.trim()) return products;

        return products.filter(product => product.matchesSearch(searchTerm));
    },

    // Filtrer par catégorie
    filterByCategory(products: Product[], categoryId: string): Product[] {
        return products.filter(product => product.category_id === categoryId);
    },

    // Filtrer par tag
    filterByTag(products: Product[], tagId: string): Product[] {
        return products.filter(product => product.hasTag(tagId));
    },

    // Filtrer par disponibilité en stock
    filterByStockStatus(products: Product[], status: 'in_stock' | 'low_stock' | 'out_of_stock'): Product[] {
        switch (status) {
            case 'in_stock':
                return products.filter(product => product.isInStock() && !product.isLowStock());
            case 'low_stock':
                return products.filter(product => product.isLowStock());
            case 'out_of_stock':
                return products.filter(product => product.isOutOfStock());
            default:
                return products;
        }
    },

    // Trier les produits
    sortProducts(
        products: Product[],
        sortBy: 'name' | 'price' | 'created_at' | 'updated_at' | 'stock' = 'name',
        order: 'asc' | 'desc' = 'asc'
    ): Product[] {
        const sorted = [...products];

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'created_at':
                sorted.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
                break;
            case 'updated_at':
                sorted.sort((a, b) => a.updated_at.getTime() - b.updated_at.getTime());
                break;
            case 'stock':
                sorted.sort((a, b) => a.stock_quantity - b.stock_quantity);
                break;
        }

        return order === 'desc' ? sorted.reverse() : sorted;
    },

    // Filtrer par plage de prix
    filterByPriceRange(products: Product[], minPrice?: number, maxPrice?: number): Product[] {
        return products.filter(product => {
            if (minPrice !== undefined && product.price < minPrice) return false;
            if (maxPrice !== undefined && product.price > maxPrice) return false;
            return true;
        });
    },

    // Obtenir les produits en promotion
    getDiscountedProducts(products: Product[]): Product[] {
        return products.filter(product => product.hasDiscount());
    },

    // Obtenir les produits les plus récents
    getRecentProducts(products: Product[], limit = 10): Product[] {
        return ProductHelper.sortProducts(products, 'created_at', 'desc').slice(0, limit);
    },

    // Obtenir les produits les plus vendus (simulé par stock bas)
    getBestSellingProducts(products: Product[], limit = 10): Product[] {
        // Tri par stock le plus bas (supposant que les meilleures ventes ont un stock réduit)
        return [...products]
            .sort((a, b) => a.stock_quantity - b.stock_quantity)
            .slice(0, limit);
    },

    // Trouver un produit par ID
    findById(products: Product[], id: string): Product | undefined {
        return products.find(product => product.id === id);
    },

    // Trouver un produit par SKU
    findBySKU(products: Product[], sku: string): Product | undefined {
        return products.find(product => product.sku === sku);
    },

    // Vérifier si un SKU existe déjà
    skuExists(products: Product[], sku: string, excludeId?: string): boolean {
        return products.some(product =>
            product.sku === sku &&
            (!excludeId || product.id !== excludeId)
        );
    },

    // Calculer les statistiques des produits
    getProductStats(products: Product[]): {
        total: number;
        active: number;
        virtual: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
        totalStockValue: number;
        averagePrice: number;
    } {
        const total = products.length;
        const active = products.filter(product => product.is_active).length;
        const virtual = products.filter(product => product.is_virtual).length;
        const inStock = products.filter(product => product.isInStock() && !product.isLowStock()).length;
        const lowStock = products.filter(product => product.isLowStock()).length;
        const outOfStock = products.filter(product => product.isOutOfStock()).length;

        const totalStockValue = products.reduce((sum, product) => {
            return sum + (product.price * product.stock_quantity);
        }, 0);

        const averagePrice = total > 0
            ? products.reduce((sum, product) => sum + product.price, 0) / total
            : 0;

        return {
            total,
            active,
            virtual,
            inStock,
            lowStock,
            outOfStock,
            totalStockValue,
            averagePrice,
        };
    },

    // Grouper les produits par catégorie
    groupByCategory(products: Product[]): Record<string, Product[]> {
        const groups: Record<string, Product[]> = {};

        products.forEach(product => {
            const categoryId = product.category_id || 'uncategorized';
            if (!groups[categoryId]) {
                groups[categoryId] = [];
            }
            groups[categoryId].push(product);
        });

        return groups;
    },

    // Formater les produits pour un sélecteur
    formatForSelect(products: Product[]): { value: string; label: string; sku?: string }[] {
        return products.map(product => ({
            value: product.id,
            label: product.name,
            sku: product.sku,
        }));
    },

    // Générer des suggestions de prix basées sur le coût
    suggestPricing(costPrice: number, marginPercent: number = 30): {
        wholesale: number;
        retail: number;
        compare: number;
    } {
        const wholesale = costPrice * (1 + marginPercent / 100);
        const retail = wholesale * 1.4; // 40% de marge supplémentaire pour le détail
        const compare = retail * 1.2; // 20% de réduction suggérée

        return {
            wholesale: Math.round(wholesale * 100) / 100,
            retail: Math.round(retail * 100) / 100,
            compare: Math.round(compare * 100) / 100,
        };
    },

    // Valider les dimensions
    validateDimensions(dimensions: any): boolean {
        if (!dimensions) return true;

        const { length, width, height } = dimensions;

        if (length !== undefined && (length < 0 || length > 1000)) return false;
        if (width !== undefined && (width < 0 || width > 1000)) return false;
        if (height !== undefined && (height < 0 || height > 1000)) return false;

        return true;
    },

    // Calculer le poids volumétrique
    calculateVolumetricWeight(dimensions: any, factor: number = 5000): number | null {
        if (!dimensions?.length || !dimensions?.width || !dimensions?.height) {
            return null;
        }

        const volume = dimensions.length * dimensions.width * dimensions.height;
        return volume / factor;
    },
};

// Classe pour gérer le panier/stock
export class ProductInventoryManager {
    private products: Map<string, Product> = new Map();

    constructor(products: Product[] = []) {
        products.forEach(product => this.products.set(product.id, product));
    }

    // Vérifier la disponibilité
    checkAvailability(productId: string, quantity: number): boolean {
        const product = this.products.get(productId);
        if (!product) return false;

        return product.stock_quantity >= quantity;
    }

    // Réserver du stock
    reserveStock(productId: string, quantity: number): boolean {
        const product = this.products.get(productId);
        if (!product || product.stock_quantity < quantity) return false;

        product.stock_quantity -= quantity;
        product.updated_at = new Date();
        return true;
    }

    // Libérer du stock réservé
    releaseStock(productId: string, quantity: number): void {
        const product = this.products.get(productId);
        if (product) {
            product.stock_quantity += quantity;
            product.updated_at = new Date();
        }
    }

    // Mettre à jour le stock
    updateStock(productId: string, newQuantity: number): void {
        const product = this.products.get(productId);
        if (product) {
            product.stock_quantity = newQuantity;
            product.updated_at = new Date();
        }
    }

    // Vérifier les alertes de stock
    checkStockAlerts(): Array<{ product: Product; alert: StockAlert }> {
        const triggeredAlerts: Array<{ product: Product; alert: StockAlert }> = [];

        this.products.forEach(product => {
            product.stock_alerts.forEach(alert => {
                if (alert.isTriggered(product.stock_quantity)) {
                    triggeredAlerts.push({ product, alert });
                }
            });
        });

        return triggeredAlerts;
    }

    // Obtenir les produits en rupture de stock
    getOutOfStockProducts(): Product[] {
        return Array.from(this.products.values()).filter(product => product.isOutOfStock());
    }

    // Obtenir les produits avec stock faible
    getLowStockProducts(): Product[] {
        return Array.from(this.products.values()).filter(product => product.isLowStock());
    }

    // Ajouter un produit
    addProduct(product: Product): void {
        this.products.set(product.id, product);
    }

    // Supprimer un produit
    removeProduct(productId: string): void {
        this.products.delete(productId);
    }

    // Obtenir un produit
    getProduct(productId: string): Product | undefined {
        return this.products.get(productId);
    }

    // Obtenir tous les produits
    getAllProducts(): Product[] {
        return Array.from(this.products.values());
    }
}

// Types utilitaires pour les composants
export interface ProductSelection {
    product: Product;
    selected: boolean;
    quantity: number;
}

export interface ProductFilter {
    search?: string;
    category_id?: string;
    tags?: string[];
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    is_active?: boolean;
}

export interface ProductWithMetadata extends Product {
    category_name?: string;
    unit_name?: string;
    tag_names?: string[];
    image_url?: string;
    total_sold?: number;
    average_rating?: number;
    review_count?: number;
}

export type {
    CreateProductRequest,
    UpdateProductRequest,
    UpdateStockRequest,
    SearchProductsParams,
    SearchProductsResponse as ProductsSearchResponse,
    CompleteProduct
} from '../api/products.api';
