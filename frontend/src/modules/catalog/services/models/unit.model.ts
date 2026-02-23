// module/catalog/services/models/unit.model.ts

import type {
    CreateUnitRequest, UpdateUnitRequest
} from '../api/units.api';

export class Unit {
    id: string;
    name: string;
    symbol: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    category?: UnitCategory; // Optionnel: catégorie d'unité
    conversion_factor?: number; // Optionnel: facteur de conversion vers une unité de base
    base_unit_id?: string; // Optionnel: ID de l'unité de base pour les conversions

    constructor(data: Partial<Unit> = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.symbol = data.symbol || '';
        this.description = data.description;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
        this.category = data.category;
        this.conversion_factor = data.conversion_factor || 1;
        this.base_unit_id = data.base_unit_id;
    }

    // Factory method pour créer une unité à partir des données de l'API
    static fromApiData(data: any): Unit {
        return new Unit({
            id: data.id,
            name: data.name,
            symbol: data.symbol,
            description: data.description,
            created_at: data.created_at,
            updated_at: data.updated_at,
            category: data.category,
            conversion_factor: data.conversion_factor,
            base_unit_id: data.base_unit_id,
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateUnitRequest {
        return {
            name: this.name,
            symbol: this.symbol,
            description: this.description,
        };
    }

    // Convertir en format de requête pour l'API (mise à jour)
    toUpdateRequest(): UpdateUnitRequest {
        return {
            name: this.name,
            symbol: this.symbol,
            description: this.description,
        };
    }

    // Vérifier si l'unité est valide pour la création
    isValidForCreation(): boolean {
        return !!this.name.trim() && !!this.symbol.trim();
    }

    // Vérifier si l'unité est valide pour la mise à jour
    isValidForUpdate(): boolean {
        return !!this.id && !!this.name.trim() && !!this.symbol.trim();
    }

    // Obtenir le nom d'affichage complet (ex: "Kilogramme (kg)")
    getDisplayName(): string {
        return `${this.name} (${this.symbol})`;
    }

    // Obtenir le nom d'affichage court (ex: "kg")
    getShortName(): string {
        return this.symbol;
    }

    // Vérifier si l'unité est une unité de base (sans conversion_factor ou avec conversion_factor = 1)
    isBaseUnit(): boolean {
        return this.conversion_factor === 1 || !this.base_unit_id;
    }

    // Formater une valeur avec cette unité
    formatValue(value: number, decimals: number = 2): string {
        const formattedValue = value.toFixed(decimals);
        return `${formattedValue} ${this.symbol}`;
    }

    // Convertir une valeur depuis cette unité vers une unité cible
    convertTo(value: number, targetUnit: Unit): number | null {
        if (!this.conversion_factor || !targetUnit.conversion_factor) {
            return null;
        }

        // Si les unités ont la même unité de base
        if (this.base_unit_id === targetUnit.base_unit_id) {
            return (value * this.conversion_factor) / targetUnit.conversion_factor;
        }

        // Si l'unité cible est l'unité de base de cette unité
        if (targetUnit.id === this.base_unit_id) {
            return value * this.conversion_factor;
        }

        // Si cette unité est l'unité de base de l'unité cible
        if (this.id === targetUnit.base_unit_id) {
            return value / targetUnit.conversion_factor;
        }

        return null;
    }

    // Vérifier si l'unité peut être convertie vers une autre unité
    canConvertTo(targetUnit: Unit): boolean {
        return (
            this.base_unit_id === targetUnit.base_unit_id ||
            targetUnit.id === this.base_unit_id ||
            this.id === targetUnit.base_unit_id
        );
    }

    // Cloner l'unité
    clone(): Unit {
        return new Unit({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: new Date(this.updated_at),
        });
    }

    // Mettre à jour les propriétés
    update(data: Partial<Unit>): void {
        Object.assign(this, data);
        this.updated_at = new Date();
    }

    // Vérifier si l'unité correspond à un terme de recherche
    matchesSearch(searchTerm: string): boolean {
        const term = searchTerm.toLowerCase();
        return (
            this.name.toLowerCase().includes(term) ||
            this.symbol.toLowerCase().includes(term) ||
            (this.description && this.description.toLowerCase().includes(term)) ||
            false
        );
    }
}

// Types pour les catégories d'unités
export enum UnitCategory {
    WEIGHT = 'weight',
    VOLUME = 'volume',
    LENGTH = 'length',
    AREA = 'area',
    COUNT = 'count',
    TIME = 'time',
    TEMPERATURE = 'temperature',
    OTHER = 'other',
}

export interface UnitCategoryInfo {
    category: UnitCategory;
    name: string;
    icon?: string;
    baseUnit?: string;
}

// Helper functions
export const UnitHelper = {
    // Définir les informations par catégorie
    getCategoryInfo(category: UnitCategory): UnitCategoryInfo {
        const categories: Record<UnitCategory, UnitCategoryInfo> = {
            [UnitCategory.WEIGHT]: {
                category: UnitCategory.WEIGHT,
                name: 'Poids',
                icon: 'scale',
                baseUnit: 'kg',
            },
            [UnitCategory.VOLUME]: {
                category: UnitCategory.VOLUME,
                name: 'Volume',
                icon: 'flask',
                baseUnit: 'L',
            },
            [UnitCategory.LENGTH]: {
                category: UnitCategory.LENGTH,
                name: 'Longueur',
                icon: 'ruler',
                baseUnit: 'm',
            },
            [UnitCategory.AREA]: {
                category: UnitCategory.AREA,
                name: 'Surface',
                icon: 'square',
                baseUnit: 'm²',
            },
            [UnitCategory.COUNT]: {
                category: UnitCategory.COUNT,
                name: 'Quantité',
                icon: 'hash',
                baseUnit: 'unité',
            },
            [UnitCategory.TIME]: {
                category: UnitCategory.TIME,
                name: 'Temps',
                icon: 'clock',
                baseUnit: 's',
            },
            [UnitCategory.TEMPERATURE]: {
                category: UnitCategory.TEMPERATURE,
                name: 'Température',
                icon: 'thermometer',
                baseUnit: '°C',
            },
            [UnitCategory.OTHER]: {
                category: UnitCategory.OTHER,
                name: 'Autre',
                icon: 'box',
            },
        };

        return categories[category] || categories[UnitCategory.OTHER];
    },

    // Filtrer les unités par recherche
    filterBySearch(units: Unit[], searchTerm: string): Unit[] {
        if (!searchTerm.trim()) return units;

        return units.filter(unit => unit.matchesSearch(searchTerm));
    },

    // Trier les unités
    sortUnits(
        units: Unit[],
        sortBy: 'name' | 'symbol' | 'category' | 'created_at' = 'name',
        order: 'asc' | 'desc' = 'asc'
    ): Unit[] {
        const sorted = [...units];

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'symbol':
                sorted.sort((a, b) => a.symbol.localeCompare(b.symbol));
                break;
            case 'category':
                sorted.sort((a, b) => {
                    const categoryA = a.category || UnitCategory.OTHER;
                    const categoryB = b.category || UnitCategory.OTHER;
                    return categoryA.localeCompare(categoryB);
                });
                break;
            case 'created_at':
                sorted.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
                break;
        }

        return order === 'desc' ? sorted.reverse() : sorted;
    },

    // Grouper les unités par catégorie
    groupByCategory(units: Unit[]): Record<UnitCategory | 'uncategorized', Unit[]> {
        const groups: Record<UnitCategory | 'uncategorized', Unit[]> = {
            [UnitCategory.WEIGHT]: [],
            [UnitCategory.VOLUME]: [],
            [UnitCategory.LENGTH]: [],
            [UnitCategory.AREA]: [],
            [UnitCategory.COUNT]: [],
            [UnitCategory.TIME]: [],
            [UnitCategory.TEMPERATURE]: [],
            [UnitCategory.OTHER]: [],
            'uncategorized': [],
        };

        units.forEach(unit => {
            if (unit.category && unit.category in groups) {
                groups[unit.category].push(unit);
            } else {
                groups['uncategorized'].push(unit);
            }
        });

        return groups;
    },

    // Trouver une unité par ID
    findById(units: Unit[], id: string): Unit | undefined {
        return units.find(unit => unit.id === id);
    },

    // Trouver une unité par symbole (insensible à la casse)
    findBySymbol(units: Unit[], symbol: string): Unit | undefined {
        const normalized = symbol.trim();
        return units.find(unit => unit.symbol.toLowerCase() === normalized.toLowerCase());
    },

    // Trouver des unités par nom (insensible à la casse)
    findByName(units: Unit[], name: string): Unit[] {
        const normalized = name.toLowerCase();
        return units.filter(unit => unit.name.toLowerCase() === normalized);
    },

    // Vérifier si un symbole d'unité existe déjà
    symbolExists(units: Unit[], symbol: string, excludeId?: string): boolean {
        const normalized = symbol.toLowerCase();
        return units.some(unit =>
            unit.symbol.toLowerCase() === normalized &&
            (!excludeId || unit.id !== excludeId)
        );
    },

    // Vérifier si un nom d'unité existe déjà
    nameExists(units: Unit[], name: string, excludeId?: string): boolean {
        const normalized = name.toLowerCase();
        return units.some(unit =>
            unit.name.toLowerCase() === normalized &&
            (!excludeId || unit.id !== excludeId)
        );
    },

    // Obtenir les unités de base
    getBaseUnits(units: Unit[]): Unit[] {
        return units.filter(unit => unit.isBaseUnit());
    },

    // Obtenir les unités par catégorie
    getUnitsByCategory(units: Unit[], category: UnitCategory): Unit[] {
        return units.filter(unit => unit.category === category);
    },

    // Obtenir les unités avec conversion (dérivées)
    getDerivedUnits(units: Unit[]): Unit[] {
        return units.filter(unit => !unit.isBaseUnit());
    },

    // Obtenir la chaîne de conversion entre deux unités
    getConversionChain(units: Unit[], fromUnitId: string, toUnitId: string): string[] | null {
        const unitMap = new Map(units.map(unit => [unit.id, unit]));
        const fromUnit = unitMap.get(fromUnitId);
        const toUnit = unitMap.get(toUnitId);

        if (!fromUnit || !toUnit) return null;

        const chain: string[] = [];
        let current = fromUnit;

        while (current && current.id !== toUnitId) {
            chain.push(current.id);

            if (current.base_unit_id) {
                current = unitMap.get(current.base_unit_id);
            } else {
                break;
            }
        }

        if (current && current.id === toUnitId) {
            chain.push(toUnitId);
            return chain;
        }

        return null;
    },

    // Calculer les statistiques des unités
    getUnitStats(units: Unit[]): {
        total: number;
        baseUnits: number;
        derivedUnits: number;
        byCategory: Record<UnitCategory | 'uncategorized', number>;
        mostCommonCategory?: UnitCategory | 'uncategorized';
    } {
        const total = units.length;
        const baseUnits = units.filter(unit => unit.isBaseUnit()).length;
        const derivedUnits = total - baseUnits;

        const groups = UnitHelper.groupByCategory(units);
        const byCategory: Record<UnitCategory | 'uncategorized', number> = {} as any;

        let maxCount = 0;
        let mostCommonCategory: UnitCategory | 'uncategorized' | undefined;

        Object.entries(groups).forEach(([category, unitList]) => {
            const count = unitList.length;
            byCategory[category as UnitCategory | 'uncategorized'] = count;

            if (count > maxCount && category !== 'uncategorized') {
                maxCount = count;
                mostCommonCategory = category as UnitCategory;
            }
        });

        return {
            total,
            baseUnits,
            derivedUnits,
            byCategory,
            mostCommonCategory,
        };
    },

    // Formater les unités pour un sélecteur
    formatForSelect(units: Unit[], includeSymbol: boolean = true): { value: string; label: string }[] {
        return units.map(unit => ({
            value: unit.id,
            label: includeSymbol ? unit.getDisplayName() : unit.name,
        }));
    },

    // Filtrer les unités par type de produit
    getUnitsForProductType(units: Unit[], productType: 'physical' | 'digital' | 'service'): Unit[] {
        if (productType === 'digital' || productType === 'service') {
            // Pour les produits digitaux ou services, on utilise généralement des unités de comptage
            return units.filter(unit =>
                unit.category === UnitCategory.COUNT ||
                unit.symbol === 'unité' ||
                unit.symbol === 'licence'
            );
        }

        // Pour les produits physiques, toutes les unités sont possibles sauf certaines
        return units.filter(unit =>
            unit.category !== UnitCategory.TIME &&
            unit.category !== UnitCategory.TEMPERATURE
        );
    },
};

// Classe pour gérer les conversions d'unités
export class UnitConverter {
    private units: Map<string, Unit>;

    constructor(units: Unit[] = []) {
        this.units = new Map(units.map(unit => [unit.id, unit]));
    }

    // Convertir une valeur d'une unité à une autre
    convert(value: number, fromUnitId: string, toUnitId: string): number | null {
        const fromUnit = this.units.get(fromUnitId);
        const toUnit = this.units.get(toUnitId);

        if (!fromUnit || !toUnit) {
            return null;
        }

        return fromUnit.convertTo(value, toUnit);
    }

    // Obtenir toutes les unités convertissables depuis une unité donnée
    getConvertibleUnits(fromUnitId: string): Unit[] {
        const fromUnit = this.units.get(fromUnitId);
        if (!fromUnit) return [];

        const convertible: Unit[] = [];

        this.units.forEach(unit => {
            if (unit.id !== fromUnitId && fromUnit.canConvertTo(unit)) {
                convertible.push(unit);
            }
        });

        return convertible;
    }

    // Ajouter une unité
    addUnit(unit: Unit): void {
        this.units.set(unit.id, unit);
    }

    // Supprimer une unité
    removeUnit(unitId: string): void {
        this.units.delete(unitId);
    }

    // Mettre à jour une unité
    updateUnit(unit: Unit): void {
        this.units.set(unit.id, unit);
    }

    // Obtenir une unité par ID
    getUnit(unitId: string): Unit | undefined {
        return this.units.get(unitId);
    }

    // Obtenir toutes les unités
    getAllUnits(): Unit[] {
        return Array.from(this.units.values());
    }

    // Vérifier si deux unités sont compatibles
    areUnitsCompatible(unitId1: string, unitId2: string): boolean {
        const unit1 = this.units.get(unitId1);
        const unit2 = this.units.get(unitId2);

        if (!unit1 || !unit2) return false;

        return unit1.canConvertTo(unit2);
    }

    // Obtenir le facteur de conversion direct
    getConversionFactor(fromUnitId: string, toUnitId: string): number | null {
        const result = this.convert(1, fromUnitId, toUnitId);
        return result;
    }
}

// Types utilitaires pour les composants
export interface UnitSelection {
    unit: Unit;
    selected: boolean;
}

export interface UnitGroup {
    category: UnitCategory | 'uncategorized';
    name: string;
    icon?: string;
    units: Unit[];
}