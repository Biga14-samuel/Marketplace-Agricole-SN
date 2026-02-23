// module/catalog/services/models/productVariant.model.ts

import type { CreateVariantRequest } from '../api/productVariants.api';

export class ProductVariant {
    id: string;
    product_id: string;
    name: string;
    sku?: string;
    price: number;
    compare_price?: number;
    cost_price?: number;
    stock_quantity: number;
    low_stock_threshold?: number;
    attributes: Record<string, string>;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    barcode?: string;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    images?: string[]; // IDs des images spécifiques à cette variante

    constructor(data: Partial<ProductVariant> = {}) {
        this.id = data.id || '';
        this.product_id = data.product_id || '';
        this.name = data.name || '';
        this.sku = data.sku || this.generateVariantSKU();
        this.price = data.price || 0;
        this.compare_price = data.compare_price;
        this.cost_price = data.cost_price;
        this.stock_quantity = data.stock_quantity || 0;
        this.low_stock_threshold = data.low_stock_threshold;
        this.attributes = data.attributes || {};
        this.is_active = data.is_active ?? true;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
        this.barcode = data.barcode;
        this.weight = data.weight;
        this.dimensions = data.dimensions;
        this.images = data.images || [];
    }

    // Factory method pour créer une variante à partir des données de l'API
    static fromApiData(data: any): ProductVariant {
        return new ProductVariant({
            id: data.id,
            product_id: data.product_id,
            name: data.name,
            sku: data.sku,
            price: data.price,
            compare_price: data.compare_price,
            cost_price: data.cost_price,
            stock_quantity: data.stock_quantity,
            low_stock_threshold: data.low_stock_threshold,
            attributes: data.attributes || {},
            is_active: data.is_active,
            created_at: data.created_at,
            updated_at: data.updated_at,
            barcode: data.barcode,
            weight: data.weight,
            dimensions: data.dimensions,
            images: data.images,
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateVariantRequest {
        return {
            name: this.name,
            sku: this.sku,
            price: this.price,
            compare_price: this.compare_price,
            cost_price: this.cost_price,
            stock_quantity: this.stock_quantity,
            low_stock_threshold: this.low_stock_threshold,
            attributes: this.attributes,
            is_active: this.is_active,
        };
    }

    // Générer un SKU automatique pour la variante
    generateVariantSKU(): string {
        const productPrefix = this.product_id.substring(0, 3).toUpperCase();
        const attrHash = this.generateAttributesHash();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${productPrefix}-${attrHash}-${random}`;
    }

    // Générer un hash basé sur les attributs
    private generateAttributesHash(): string {
        const attrString = Object.entries(this.attributes)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key.substring(0, 2)}${value.substring(0, 2)}`)
            .join('')
            .toUpperCase();

        return attrString.padEnd(6, 'X').substring(0, 6);
    }

    // Vérifier si la variante est valide pour la création
    isValidForCreation(): boolean {
        return !!this.name.trim() && this.price >= 0 && this.stock_quantity >= 0;
    }

    // Vérifier si la variante est valide pour la mise à jour
    isValidForUpdate(): boolean {
        return !!this.id && !!this.name.trim() && this.price >= 0 && this.stock_quantity >= 0;
    }

    // Vérifier si la variante est en stock
    isInStock(): boolean {
        return this.stock_quantity > 0;
    }

    // Vérifier si le stock est faible
    isLowStock(): boolean {
        if (!this.low_stock_threshold) return false;
        return this.stock_quantity <= this.low_stock_threshold && this.stock_quantity > 0;
    }

    // Vérifier si la variante est en rupture de stock
    isOutOfStock(): boolean {
        return this.stock_quantity <= 0;
    }

    // Vérifier si la variante a une promotion (compare_price)
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

    // Obtenir la chaîne des attributs formatée
    getAttributesString(separator: string = ', '): string {
        return Object.entries(this.attributes)
            .map(([key, value]) => `${this.formatAttributeKey(key)}: ${value}`)
            .join(separator);
    }

    // Formater les clés d'attributs pour l'affichage
    private formatAttributeKey(key: string): string {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Obtenir un nom d'affichage complet (nom + attributs)
    getDisplayName(): string {
        if (Object.keys(this.attributes).length === 0) {
            return this.name;
        }
        return `${this.name} (${this.getAttributesString()})`;
    }

    // Obtenir une valeur d'attribut spécifique
    getAttributeValue(attributeKey: string): string | undefined {
        return this.attributes[attributeKey];
    }

    // Mettre à jour un attribut
    updateAttribute(key: string, value: string): void {
        this.attributes[key] = value;
        this.updated_at = new Date();
    }

    // Supprimer un attribut
    removeAttribute(key: string): void {
        delete this.attributes[key];
        this.updated_at = new Date();
    }

    // Vérifier si la variante a un attribut spécifique
    hasAttribute(key: string): boolean {
        return key in this.attributes;
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

    // Ajouter une image à la variante
    addImage(imageId: string): void {
        if (!this.images?.includes(imageId)) {
            this.images = [...(this.images || []), imageId];
            this.updated_at = new Date();
        }
    }

    // Retirer une image de la variante
    removeImage(imageId: string): void {
        this.images = this.images?.filter(id => id !== imageId) || [];
        this.updated_at = new Date();
    }

    // Mettre à jour le stock
    updateStock(quantity: number, adjustmentReason?: string): void {
        this.stock_quantity = quantity;
        this.updated_at = new Date();
    }

    // Incrémenter le stock
    incrementStock(amount: number = 1): void {
        this.stock_quantity += amount;
        this.updated_at = new Date();
    }

    // Décrémenter le stock
    decrementStock(amount: number = 1): boolean {
        if (this.stock_quantity < amount) return false;
        this.stock_quantity -= amount;
        this.updated_at = new Date();
        return true;
    }

    // Cloner la variante
    clone(): ProductVariant {
        return new ProductVariant({
            ...this,
            attributes: { ...this.attributes },
            created_at: new Date(this.created_at),
            updated_at: new Date(this.updated_at),
            dimensions: this.dimensions ? { ...this.dimensions } : undefined,
            images: this.images ? [...this.images] : [],
        });
    }

    // Mettre à jour les propriétés
    update(data: Partial<ProductVariant>): void {
        Object.assign(this, data);
        this.updated_at = new Date();
    }

    // Vérifier si la variante correspond à un terme de recherche
    matchesSearch(searchTerm: string): boolean {
        const term = searchTerm.toLowerCase();
        return (
            this.name.toLowerCase().includes(term) ||
            (this.sku && this.sku.toLowerCase().includes(term)) ||
            Object.values(this.attributes).some(value =>
                value.toLowerCase().includes(term)
            ) ||
            false
        );
    }

    // Vérifier si la variante correspond à des attributs spécifiques
    matchesAttributes(attributes: Record<string, string>): boolean {
        return Object.entries(attributes).every(([key, value]) =>
            this.attributes[key] === value
        );
    }

    // Obtenir les attributs sous forme de tableau
    getAttributesArray(): Array<{ key: string; value: string; displayKey: string }> {
        return Object.entries(this.attributes).map(([key, value]) => ({
            key,
            value,
            displayKey: this.formatAttributeKey(key),
        }));
    }

    // Générer un code-barres automatique
    generateBarcode(): string {
        if (this.barcode) return this.barcode;

        const base = this.sku || this.id;
        const timestamp = Date.now().toString().slice(-6);
        return `${base.replace(/[^0-9]/g, '')}${timestamp}`.padEnd(13, '0').substring(0, 13);
    }

    // Valider le code-barres (EAN-13)
    isValidBarcode(): boolean {
        if (!this.barcode) return false;

        const barcode = this.barcode.replace(/\D/g, '');
        if (barcode.length !== 13) return false;

        // Algorithme de vérification EAN-13
        const digits = barcode.split('').map(Number);
        let sum = 0;

        for (let i = 0; i < 12; i++) {
            sum += digits[i] * (i % 2 === 0 ? 1 : 3);
        }

        const checksum = (10 - (sum % 10)) % 10;
        return digits[12] === checksum;
    }
}

// Helper functions
export const ProductVariantHelper = {
    // Filtrer les variantes par recherche
    filterBySearch(variants: ProductVariant[], searchTerm: string): ProductVariant[] {
        if (!searchTerm.trim()) return variants;

        return variants.filter(variant => variant.matchesSearch(searchTerm));
    },

    // Filtrer par attributs
    filterByAttributes(variants: ProductVariant[], attributes: Record<string, string>): ProductVariant[] {
        if (Object.keys(attributes).length === 0) return variants;

        return variants.filter(variant => variant.matchesAttributes(attributes));
    },

    // Filtrer par disponibilité en stock
    filterByStockStatus(variants: ProductVariant[], status: 'in_stock' | 'low_stock' | 'out_of_stock'): ProductVariant[] {
        switch (status) {
            case 'in_stock':
                return variants.filter(variant => variant.isInStock() && !variant.isLowStock());
            case 'low_stock':
                return variants.filter(variant => variant.isLowStock());
            case 'out_of_stock':
                return variants.filter(variant => variant.isOutOfStock());
            default:
                return variants;
        }
    },

    // Trier les variantes
    sortVariants(
        variants: ProductVariant[],
        sortBy: 'name' | 'price' | 'stock_quantity' | 'created_at' | 'sku' = 'name',
        order: 'asc' | 'desc' = 'asc'
    ): ProductVariant[] {
        const sorted = [...variants];

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'stock_quantity':
                sorted.sort((a, b) => a.stock_quantity - b.stock_quantity);
                break;
            case 'created_at':
                sorted.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
                break;
            case 'sku':
                sorted.sort((a, b) => (a.sku || '').localeCompare(b.sku || ''));
                break;
        }

        return order === 'desc' ? sorted.reverse() : sorted;
    },

    // Grouper les variantes par attribut
    groupByAttribute(variants: ProductVariant[], attributeKey: string): Record<string, ProductVariant[]> {
        const groups: Record<string, ProductVariant[]> = {};

        variants.forEach(variant => {
            const value = variant.getAttributeValue(attributeKey) || 'Non spécifié';
            if (!groups[value]) {
                groups[value] = [];
            }
            groups[value].push(variant);
        });

        return groups;
    },

    // Obtenir toutes les valeurs uniques d'un attribut
    getUniqueAttributeValues(variants: ProductVariant[], attributeKey: string): string[] {
        const values = new Set<string>();

        variants.forEach(variant => {
            const value = variant.getAttributeValue(attributeKey);
            if (value) {
                values.add(value);
            }
        });

        return Array.from(values).sort();
    },

    // Obtenir toutes les clés d'attributs uniques
    getUniqueAttributeKeys(variants: ProductVariant[]): string[] {
        const keys = new Set<string>();

        variants.forEach(variant => {
            Object.keys(variant.attributes).forEach(key => keys.add(key));
        });

        return Array.from(keys).sort();
    },

    // Trouver une variante par ID
    findById(variants: ProductVariant[], id: string): ProductVariant | undefined {
        return variants.find(variant => variant.id === id);
    },

    // Trouver une variante par SKU
    findBySKU(variants: ProductVariant[], sku: string): ProductVariant | undefined {
        return variants.find(variant => variant.sku === sku);
    },

    // Vérifier si un SKU existe déjà
    skuExists(variants: ProductVariant[], sku: string, excludeId?: string): boolean {
        return variants.some(variant =>
            variant.sku === sku &&
            (!excludeId || variant.id !== excludeId)
        );
    },

    // Calculer les statistiques des variantes
    getVariantStats(variants: ProductVariant[]): {
        total: number;
        active: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
        totalStockValue: number;
        averagePrice: number;
        attributeCount: number;
    } {
        const total = variants.length;
        const active = variants.filter(variant => variant.is_active).length;
        const inStock = variants.filter(variant => variant.isInStock() && !variant.isLowStock()).length;
        const lowStock = variants.filter(variant => variant.isLowStock()).length;
        const outOfStock = variants.filter(variant => variant.isOutOfStock()).length;

        const totalStockValue = variants.reduce((sum, variant) => {
            return sum + (variant.price * variant.stock_quantity);
        }, 0);

        const averagePrice = total > 0
            ? variants.reduce((sum, variant) => sum + variant.price, 0) / total
            : 0;

        const allAttributes = new Set<string>();
        variants.forEach(variant => {
            Object.keys(variant.attributes).forEach(key => allAttributes.add(key));
        });
        const attributeCount = allAttributes.size;

        return {
            total,
            active,
            inStock,
            lowStock,
            outOfStock,
            totalStockValue,
            averagePrice,
            attributeCount,
        };
    },

    // Calculer le stock total de toutes les variantes
    getTotalStock(variants: ProductVariant[]): number {
        return variants.reduce((sum, variant) => sum + variant.stock_quantity, 0);
    },

    // Calculer la valeur totale du stock
    getTotalStockValue(variants: ProductVariant[]): number {
        return variants.reduce((sum, variant) =>
            sum + (variant.price * variant.stock_quantity), 0
        );
    },

    // Générer une matrice d'attributs pour les combinaisons
    generateAttributeMatrix(variants: ProductVariant[]): {
        attributes: string[];
        values: Record<string, string[]>;
        combinations: Array<Record<string, string>>;
    } {
        const attributes = ProductVariantHelper.getUniqueAttributeKeys(variants);
        const values: Record<string, string[]> = {};

        attributes.forEach(attr => {
            values[attr] = ProductVariantHelper.getUniqueAttributeValues(variants, attr);
        });

        // Générer toutes les combinaisons possibles (simplifié)
        const combinations: Array<Record<string, string>> = [];

        function generateCombos(current: Record<string, string>, index: number) {
            if (index === attributes.length) {
                combinations.push({ ...current });
                return;
            }

            const attr = attributes[index];
            const attrValues = values[attr];

            attrValues.forEach(value => {
                current[attr] = value;
                generateCombos(current, index + 1);
            });
        }

        if (attributes.length > 0) {
            generateCombos({}, 0);
        }

        return { attributes, values, combinations };
    },

    // Trouver la variante correspondant à une combinaison d'attributs
    findVariantByCombination(variants: ProductVariant[], combination: Record<string, string>): ProductVariant | undefined {
        return variants.find(variant => variant.matchesAttributes(combination));
    },

    // Vérifier quelles combinaisons d'attributs existent déjà
    getExistingCombinations(variants: ProductVariant[]): Array<Record<string, string>> {
        return variants.map(variant => ({ ...variant.attributes }));
    },

    // Formater les variantes pour un sélecteur
    formatForSelect(variants: ProductVariant[]): { value: string; label: string; sku?: string }[] {
        return variants.map(variant => ({
            value: variant.id,
            label: variant.getDisplayName(),
            sku: variant.sku,
        }));
    },
};

// Classe pour gérer les attributs de variantes
export class VariantAttributeManager {
    private variants: ProductVariant[] = [];

    constructor(variants: ProductVariant[] = []) {
        this.variants = variants;
    }

    // Obtenir tous les attributs disponibles
    getAllAttributes(): Array<{
        key: string;
        displayName: string;
        values: string[];
        valueCount: number;
    }> {
        const attributes: Record<string, Set<string>> = {};

        this.variants.forEach(variant => {
            Object.entries(variant.attributes).forEach(([key, value]) => {
                if (!attributes[key]) {
                    attributes[key] = new Set();
                }
                attributes[key].add(value);
            });
        });

        return Object.entries(attributes).map(([key, valueSet]) => ({
            key,
            displayName: key.split('_').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            values: Array.from(valueSet).sort(),
            valueCount: valueSet.size,
        })).sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    // Ajouter une nouvelle valeur d'attribut
    addAttributeValue(attributeKey: string, value: string): void {
        // Cette méthode prépare l'ajout mais ne modifie pas les variantes existantes directement
        // Elle pourrait être utilisée pour valider avant la création de nouvelles variantes
    }

    // Vérifier si une combinaison d'attributs est unique
    isCombinationUnique(attributes: Record<string, string>, excludeVariantId?: string): boolean {
        return !this.variants.some(variant => {
            if (excludeVariantId && variant.id === excludeVariantId) return false;
            return variant.matchesAttributes(attributes);
        });
    }

    // Générer toutes les combinaisons manquantes
    getMissingCombinations(attributeMatrix: {
        attributes: string[];
        values: Record<string, string[]>;
    }): Array<Record<string, string>> {
        // Générer toutes les combinaisons possibles
        const generateCombinations = (attrs: string[], vals: Record<string, string[]>): Array<Record<string, string>> => {
            if (attrs.length === 0) return [{}];
            
            const [first, ...rest] = attrs;
            const restCombinations = generateCombinations(rest, vals);
            const combinations: Array<Record<string, string>> = [];
            
            for (const value of (vals[first] || [])) {
                for (const restCombo of restCombinations) {
                    combinations.push({ [first]: value, ...restCombo });
                }
            }
            
            return combinations;
        };
        
        const allCombinations = generateCombinations(attributeMatrix.attributes, attributeMatrix.values);
        
        // Filtrer les combinaisons existantes
        return allCombinations.filter(combo => {
            return !this.variants.some(variant => variant.matchesAttributes(combo));
        });
    }

    // Obtenir les statistiques d'attributs
    getAttributeStats(): Array<{
        attribute: string;
        displayName: string;
        totalValues: number;
        mostCommonValue?: string;
        valueDistribution: Record<string, number>;
    }> {
        const attributes = this.getAllAttributes();

        return attributes.map(attr => {
            const distribution: Record<string, number> = {};

            this.variants.forEach(variant => {
                const value = variant.getAttributeValue(attr.key);
                if (value) {
                    distribution[value] = (distribution[value] || 0) + 1;
                }
            });

            let mostCommonValue: string | undefined;
            let maxCount = 0;

            Object.entries(distribution).forEach(([value, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    mostCommonValue = value;
                }
            });

            return {
                attribute: attr.key,
                displayName: attr.displayName,
                totalValues: attr.valueCount,
                mostCommonValue,
                valueDistribution: distribution,
            };
        });
    }

    // Filtrer les variantes par attributs
    filterByAttributes(attributes: Record<string, string | string[]>): ProductVariant[] {
        return this.variants.filter(variant => {
            return Object.entries(attributes).every(([key, value]) => {
                const variantValue = variant.getAttributeValue(key);

                if (Array.isArray(value)) {
                    return value.includes(variantValue || '');
                }

                return variantValue === value;
            });
        });
    }

    // Obtenir les variantes groupées par attribut
    getVariantsGroupedByAttribute(attributeKey: string): Record<string, ProductVariant[]> {
        return ProductVariantHelper.groupByAttribute(this.variants, attributeKey);
    }

    // Ajouter une variante
    addVariant(variant: ProductVariant): void {
        this.variants.push(variant);
    }

    // Supprimer une variante
    removeVariant(variantId: string): void {
        this.variants = this.variants.filter(v => v.id !== variantId);
    }

    // Mettre à jour une variante
    updateVariant(variantId: string, data: Partial<ProductVariant>): boolean {
        const index = this.variants.findIndex(v => v.id === variantId);
        if (index === -1) return false;

        this.variants[index].update(data);
        return true;
    }

    // Obtenir toutes les variantes
    getAllVariants(): ProductVariant[] {
        return [...this.variants];
    }
}

// Types utilitaires pour les composants
export interface VariantSelection {
    variant: ProductVariant;
    selected: boolean;
    quantity: number;
}

export interface VariantAttributeOption {
    key: string;
    displayName: string;
    values: Array<{
        value: string;
        displayValue: string;
        variantCount: number;
    }>;
}

export interface VariantCombination {
    attributes: Record<string, string>;
    exists: boolean;
    variant?: ProductVariant;
}

// Classe pour gérer le stock des variantes
export class VariantStockManager {
    private variants: Map<string, ProductVariant> = new Map();

    constructor(variants: ProductVariant[] = []) {
        variants.forEach(variant => this.variants.set(variant.id, variant));
    }

    // Vérifier la disponibilité
    checkAvailability(variantId: string, quantity: number): boolean {
        const variant = this.variants.get(variantId);
        if (!variant) return false;

        return variant.stock_quantity >= quantity;
    }

    // Réserver du stock
    reserveStock(variantId: string, quantity: number): boolean {
        const variant = this.variants.get(variantId);
        if (!variant || variant.stock_quantity < quantity) return false;

        variant.stock_quantity -= quantity;
        variant.updated_at = new Date();
        return true;
    }

    // Libérer du stock réservé
    releaseStock(variantId: string, quantity: number): void {
        const variant = this.variants.get(variantId);
        if (variant) {
            variant.stock_quantity += quantity;
            variant.updated_at = new Date();
        }
    }

    // Mettre à jour le stock
    updateStock(variantId: string, newQuantity: number): void {
        const variant = this.variants.get(variantId);
        if (variant) {
            variant.stock_quantity = newQuantity;
            variant.updated_at = new Date();
        }
    }

    // Obtenir les variantes en rupture de stock
    getOutOfStockVariants(): ProductVariant[] {
        return Array.from(this.variants.values()).filter(variant => variant.isOutOfStock());
    }

    // Obtenir les variantes avec stock faible
    getLowStockVariants(): ProductVariant[] {
        return Array.from(this.variants.values()).filter(variant => variant.isLowStock());
    }

    // Obtenir le stock total
    getTotalStock(): number {
        return Array.from(this.variants.values()).reduce(
            (sum, variant) => sum + variant.stock_quantity, 0
        );
    }

    // Obtenir la valeur totale du stock
    getTotalStockValue(): number {
        return Array.from(this.variants.values()).reduce(
            (sum, variant) => sum + (variant.price * variant.stock_quantity), 0
        );
    }

    // Ajouter une variante
    addVariant(variant: ProductVariant): void {
        this.variants.set(variant.id, variant);
    }

    // Supprimer une variante
    removeVariant(variantId: string): void {
        this.variants.delete(variantId);
    }

    // Obtenir une variante
    getVariant(variantId: string): ProductVariant | undefined {
        return this.variants.get(variantId);
    }

    // Obtenir toutes les variantes
    getAllVariants(): ProductVariant[] {
        return Array.from(this.variants.values());
    }
}