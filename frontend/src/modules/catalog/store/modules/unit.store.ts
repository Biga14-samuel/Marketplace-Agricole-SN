// modules/catalog/store/modules/unit.store.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { unitsApi } from '../../services/api/units.api';
import type { CreateUnitRequest, UpdateUnitRequest } from '../../services/api/units.api';
import { Unit, UnitHelper, UnitCategory, UnitConverter } from '../../services/models/unit.model';

type ExtendedCreateUnitRequest = CreateUnitRequest & {
    category?: UnitCategory;
    conversion_factor?: number;
    base_unit_id?: string;
};

type ExtendedUpdateUnitRequest = UpdateUnitRequest & {
    category?: UnitCategory;
    conversion_factor?: number;
    base_unit_id?: string;
};

export const useUnitStore = defineStore('unit', () => {
    // ============================================
    // State
    // ============================================

    // Liste de toutes les unités
    const units = ref<Unit[]>([]);

    // Unité actuellement sélectionnée/consultée
    const currentUnit = ref<Unit | null>(null);

    // État de chargement
    const loading = ref<boolean>(false);

    // Erreurs
    const error = ref<string | null>(null);

    // Cache pour les unités par ID
    const unitsCache = ref<Map<string, Unit>>(new Map());

    // État de l'opération en cours
    const operationStatus = ref<'idle' | 'creating' | 'updating' | 'deleting' | 'fetching'>('idle');

    // Unités sélectionnées (pour les opérations en lot)
    const selectedUnits = ref<Set<string>>(new Set());

    // Filtres de recherche
    const searchFilter = ref<string>('');
    const categoryFilter = ref<UnitCategory | 'all' | 'uncategorized'>('all');
    const sortBy = ref<'name' | 'symbol' | 'category' | 'created_at'>('name');
    const sortOrder = ref<'asc' | 'desc'>('asc');

    // Gestionnaire de conversions
    const unitConverter = ref<UnitConverter>(new UnitConverter());

    // ============================================
    // Getters / Computed
    // ============================================

    // Toutes les unités triées selon les critères actuels
    const allUnits = computed(() =>
        UnitHelper.sortUnits(units.value, sortBy.value, sortOrder.value)
    );

    // Unités filtrées par recherche et catégorie
    const filteredUnits = computed(() => {
        let filtered = allUnits.value;

        if (searchFilter.value.trim()) {
            filtered = UnitHelper.filterBySearch(filtered, searchFilter.value);
        }

        if (categoryFilter.value !== 'all') {
            if (categoryFilter.value === 'uncategorized') {
                filtered = filtered.filter(unit => !unit.category);
            } else {
                filtered = UnitHelper.getUnitsByCategory(filtered, categoryFilter.value as UnitCategory);
            }
        }

        return filtered;
    });

    // Unité par ID
    const getUnitById = computed(() => (id: string) =>
        units.value.find(unit => unit.id === id) || null
    );

    // Unité par symbole
    const getUnitBySymbol = computed(() => (symbol: string) =>
        UnitHelper.findBySymbol(units.value, symbol)
    );

    // Unités groupées par catégorie
    const unitsByCategory = computed(() =>
        UnitHelper.groupByCategory(filteredUnits.value)
    );

    // Unités de base (conversion_factor = 1)
    const baseUnits = computed(() =>
        UnitHelper.getBaseUnits(filteredUnits.value)
    );

    // Unités dérivées (avec conversion)
    const derivedUnits = computed(() =>
        UnitHelper.getDerivedUnits(filteredUnits.value)
    );

    // Options d'unités pour les sélecteurs
    const unitOptions = computed(() => {
        const options: Array<{
            value: string;
            label: string;
            symbol: string;
            category?: UnitCategory;
            isBase?: boolean;
        }> = [];

        filteredUnits.value.forEach(unit => {
            options.push({
                value: unit.id,
                label: unit.getDisplayName(),
                symbol: unit.symbol,
                category: unit.category,
                isBase: unit.isBaseUnit(),
            });
        });

        return options;
    });

    // Unités par catégorie pour les sélecteurs groupés
    const groupedUnitOptions = computed(() => {
        const groups: Array<{
            label: string;
            options: Array<{
                value: string;
                label: string;
                symbol: string;
            }>;
        }> = [];

        const categories = UnitHelper.groupByCategory(filteredUnits.value);

        Object.entries(categories).forEach(([category, unitList]) => {
            if (unitList.length > 0) {
                const categoryInfo = UnitHelper.getCategoryInfo(category as UnitCategory);
                groups.push({
                    label: categoryInfo.name,
                    options: unitList.map(unit => ({
                        value: unit.id,
                        label: unit.getDisplayName(),
                        symbol: unit.symbol,
                    })),
                });
            }
        });

        // Ajouter les unités non catégorisées
        if (categories.uncategorized && categories.uncategorized.length > 0) {
            groups.push({
                label: 'Non catégorisées',
                options: categories.uncategorized.map(unit => ({
                    value: unit.id,
                    label: unit.getDisplayName(),
                    symbol: unit.symbol,
                })),
            });
        }

        return groups;
    });

    // Unités sélectionnées
    const selectedUnitList = computed(() =>
        Array.from(selectedUnits.value).map(id => getUnitById.value(id)).filter(Boolean) as Unit[]
    );

    // Statistiques des unités
    const unitStats = computed(() =>
        UnitHelper.getUnitStats(units.value)
    );

    // Catégories disponibles (avec comptage)
    const availableCategories = computed(() => {
        const stats = unitStats.value;
        return Object.entries(stats.byCategory)
            .filter(([_, count]) => count > 0)
            .map(([category, count]) => {
                const info = UnitHelper.getCategoryInfo(category as UnitCategory);
                return {
                    category: category as UnitCategory | 'uncategorized',
                    name: info.name,
                    count,
                    icon: info.icon,
                };
            });
    });

    // Vérifier si un symbole existe déjà
    const unitSymbolExists = computed(() => (symbol: string, excludeId?: string) =>
        UnitHelper.symbolExists(units.value, symbol, excludeId)
    );

    // Vérifier si un nom existe déjà
    const unitNameExists = computed(() => (name: string, excludeId?: string) =>
        UnitHelper.nameExists(units.value, name, excludeId)
    );

    // Mettre à jour le convertisseur avec les unités actuelles
    const updateConverter = computed(() => {
        unitConverter.value = new UnitConverter(units.value);
        return unitConverter.value;
    });

    // ============================================
    // Actions / Methods
    // ============================================

    /**
     * Créer une unité
     * Endpoint: POST /api/v1/products-catalog/products/units
     */
    const createUnit = async (data: ExtendedCreateUnitRequest): Promise<Unit> => {
        try {
            operationStatus.value = 'creating';
            loading.value = true;
            error.value = null;

            // Vérifier si le symbole existe déjà
            if (unitSymbolExists.value(data.symbol)) {
                throw new Error(`Une unité avec le symbole "${data.symbol}" existe déjà`);
            }

            // Vérifier si le nom existe déjà
            if (unitNameExists.value(data.name)) {
                throw new Error(`Une unité avec le nom "${data.name}" existe déjà`);
            }

            const newUnitData = await unitsApi.createUnit({
                name: data.name,
                symbol: data.symbol,
                description: data.description,
            });

            const newUnit = Unit.fromApiData({
                ...newUnitData,
                category: data.category,
                conversion_factor: data.conversion_factor,
                base_unit_id: data.base_unit_id,
            });

            // Ajouter à la liste
            units.value.push(newUnit);

            // Mettre à jour le cache
            unitsCache.value.set(newUnit.id, newUnit);

            // Mettre à jour le convertisseur
            updateConverter.value;

            return newUnit;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création de l\'unité';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Obtenir toutes les unités
     * Endpoint: GET /api/v1/products-catalog/products/units
     */
    const fetchAllUnits = async (forceRefresh = false): Promise<Unit[]> => {
        try {
            if (units.value.length > 0 && !forceRefresh) {
                return units.value;
            }

            operationStatus.value = 'fetching';
            loading.value = true;
            error.value = null;

            const fetchedUnitsData = await unitsApi.getAllUnits();
            const fetchedUnits = fetchedUnitsData.map(unit => Unit.fromApiData(unit));

            // Mettre à jour les unités
            units.value = fetchedUnits;

            // Mettre à jour le cache
            unitsCache.value.clear();
            fetchedUnits.forEach(unit => unitsCache.value.set(unit.id, unit));

            // Mettre à jour le convertisseur
            unitConverter.value = new UnitConverter(fetchedUnits);

            return fetchedUnits;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération des unités';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Obtenir une unité par son ID (méthode locale, pas d'endpoint spécifique)
     */
    const fetchUnitById = async (unitId: string, forceRefresh = false): Promise<Unit | null> => {
        try {
            // Vérifier le cache d'abord
            const cachedUnit = unitsCache.value.get(unitId);
            if (cachedUnit && !forceRefresh) {
                currentUnit.value = cachedUnit;
                return cachedUnit;
            }

            // Si pas en cache, chercher dans la liste locale
            const unit = getUnitById.value(unitId);
            if (unit) {
                currentUnit.value = unit;
                return unit;
            }

            // Si pas dans la liste, essayer de recharger toutes les unités
            await fetchAllUnits();

            const foundUnit = getUnitById.value(unitId);
            currentUnit.value = foundUnit;
            return foundUnit;

        } catch (err: any) {
            error.value = err.message || `Erreur lors de la récupération de l'unité ${unitId}`;
            throw err;
        }
    };

    /**
     * Mettre à jour une unité (méthode locale, pas d'endpoint spécifique pour l'instant)
     */
    const updateUnit = async (unitId: string, data: ExtendedUpdateUnitRequest): Promise<Unit> => {
        try {
            operationStatus.value = 'updating';
            loading.value = true;
            error.value = null;

            const unit = getUnitById.value(unitId);
            if (!unit) {
                throw new Error('Unité non trouvée');
            }

            // Vérifier si le nouveau symbole existe déjà (excluant l'unité actuelle)
            if (data.symbol && unitSymbolExists.value(data.symbol, unitId)) {
                throw new Error(`Une unité avec le symbole "${data.symbol}" existe déjà`);
            }

            // Vérifier si le nouveau nom existe déjà (excluant l'unité actuelle)
            if (data.name && unitNameExists.value(data.name, unitId)) {
                throw new Error(`Une unité avec le nom "${data.name}" existe déjà`);
            }

            // Mettre à jour localement
            unit.update(data);

            // Mettre à jour le cache
            unitsCache.value.set(unitId, unit);

            // Mettre à jour la liste
            const index = units.value.findIndex(u => u.id === unitId);
            if (index !== -1) {
                units.value[index] = unit;
            }

            // Mettre à jour l'unité courante si c'est celle-ci
            if (currentUnit.value?.id === unitId) {
                currentUnit.value = unit;
            }

            // Mettre à jour le convertisseur
            unitConverter.value.updateUnit(unit);

            return unit;
        } catch (err: any) {
            error.value = err.message || `Erreur lors de la mise à jour de l'unité ${unitId}`;
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Supprimer une unité (méthode locale, pas d'endpoint spécifique pour l'instant)
     */
    const deleteUnit = async (unitId: string): Promise<void> => {
        try {
            operationStatus.value = 'deleting';
            loading.value = true;
            error.value = null;

            const unit = getUnitById.value(unitId);
            if (!unit) {
                throw new Error('Unité non trouvée');
            }

            // Vérifier si l'unité est utilisée par des produits
            // Note: Dans une vraie application, nous vérifierions avec l'API
            // Pour l'instant, nous ne pouvons pas vérifier, donc nous supposons qu'elle n'est pas utilisée
            // Ou nous pourrions ajouter une propriété `usage_count` similaire aux tags

            // Supprimer de la liste
            units.value = units.value.filter(u => u.id !== unitId);

            // Supprimer du cache
            unitsCache.value.delete(unitId);

            // Désélectionner si nécessaire
            selectedUnits.value.delete(unitId);

            // Réinitialiser l'unité courante si c'est celle-ci
            if (currentUnit.value?.id === unitId) {
                currentUnit.value = null;
            }

            // Mettre à jour le convertisseur
            unitConverter.value.removeUnit(unitId);

        } catch (err: any) {
            error.value = err.message || `Erreur lors de la suppression de l'unité ${unitId}`;
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Supprimer plusieurs unités
     */
    const deleteSelectedUnits = async (): Promise<void> => {
        try {
            operationStatus.value = 'deleting';
            loading.value = true;
            error.value = null;

            const unitIds = Array.from(selectedUnits.value);

            // Supprimer chaque unité
            for (const unitId of unitIds) {
                units.value = units.value.filter(u => u.id !== unitId);
                unitsCache.value.delete(unitId);
                unitConverter.value.removeUnit(unitId);
            }

            // Vider la sélection
            selectedUnits.value.clear();

            // Réinitialiser l'unité courante si elle était sélectionnée
            if (currentUnit.value && unitIds.includes(currentUnit.value.id)) {
                currentUnit.value = null;
            }

        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression des unités';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Sélectionner/désélectionner une unité
     */
    const toggleUnitSelection = (unitId: string): void => {
        if (selectedUnits.value.has(unitId)) {
            selectedUnits.value.delete(unitId);
        } else {
            selectedUnits.value.add(unitId);
        }
    };

    /**
     * Sélectionner toutes les unités
     */
    const selectAllUnits = (): void => {
        filteredUnits.value.forEach(unit => {
            selectedUnits.value.add(unit.id);
        });
    };

    /**
     * Désélectionner toutes les unités
     */
    const deselectAllUnits = (): void => {
        selectedUnits.value.clear();
    };

    /**
     * Basculer la sélection de toutes les unités
     */
    const toggleSelectAllUnits = (): void => {
        const allFilteredIds = new Set(filteredUnits.value.map(unit => unit.id));
        const allSelected = Array.from(selectedUnits.value).every(id => allFilteredIds.has(id));

        if (allSelected) {
            deselectAllUnits();
        } else {
            selectAllUnits();
        }
    };

    /**
     * Définir les filtres de recherche
     */
    const setFilters = (filters: {
        search?: string;
        category?: UnitCategory | 'all' | 'uncategorized';
        sortBy?: 'name' | 'symbol' | 'category' | 'created_at';
        sortOrder?: 'asc' | 'desc';
    }): void => {
        if (filters.search !== undefined) searchFilter.value = filters.search;
        if (filters.category !== undefined) categoryFilter.value = filters.category;
        if (filters.sortBy !== undefined) sortBy.value = filters.sortBy;
        if (filters.sortOrder !== undefined) sortOrder.value = filters.sortOrder;
    };

    /**
     * Réinitialiser les filtres
     */
    const resetFilters = (): void => {
        searchFilter.value = '';
        categoryFilter.value = 'all';
        sortBy.value = 'name';
        sortOrder.value = 'asc';
    };

    /**
     * Rechercher des unités
     */
    const searchUnits = (query: string): Unit[] => {
        return UnitHelper.filterBySearch(units.value, query);
    };

    /**
     * Convertir une valeur d'une unité à une autre
     */
    const convertValue = (value: number, fromUnitId: string, toUnitId: string): number | null => {
        return unitConverter.value.convert(value, fromUnitId, toUnitId);
    };

    /**
     * Obtenir les unités compatibles pour conversion
     */
    const getCompatibleUnits = (unitId: string): Unit[] => {
        return unitConverter.value.getConvertibleUnits(unitId);
    };

    /**
     * Vérifier si deux unités sont compatibles
     */
    const areUnitsCompatible = (unitId1: string, unitId2: string): boolean => {
        return unitConverter.value.areUnitsCompatible(unitId1, unitId2);
    };

    /**
     * Obtenir le facteur de conversion
     */
    const getConversionFactor = (fromUnitId: string, toUnitId: string): number | null => {
        return unitConverter.value.getConversionFactor(fromUnitId, toUnitId);
    };

    /**
     * Obtenir les unités recommandées pour un type de produit
     */
    const getUnitsForProductType = (productType: 'physical' | 'digital' | 'service'): Unit[] => {
        return UnitHelper.getUnitsForProductType(units.value, productType);
    };

    /**
     * Formater une valeur avec son unité
     */
    const formatValueWithUnit = (value: number, unitId: string, decimals: number = 2): string => {
        const unit = getUnitById.value(unitId);
        if (!unit) return `${value.toFixed(decimals)}`;
        return unit.formatValue(value, decimals);
    };

    /**
     * Ajouter une relation de conversion
     */
    const addConversionRelation = async (
        fromUnitId: string,
        toUnitId: string,
        conversionFactor: number
    ): Promise<void> => {
        try {
            const fromUnit = getUnitById.value(fromUnitId);
            const toUnit = getUnitById.value(toUnitId);

            if (!fromUnit || !toUnit) {
                throw new Error('Unités non trouvées');
            }

            // Mettre à jour l'unité dérivée
            // Ici, nous devrions déterminer quelle unité est la base et laquelle est dérivée
            // Pour simplifier, nous mettons à jour `toUnit` comme dérivée de `fromUnit`
            await updateUnit(toUnitId, {
                conversion_factor: conversionFactor,
                base_unit_id: fromUnitId,
            });

        } catch (err: any) {
            error.value = err.message || 'Erreur lors de l\'ajout de la relation de conversion';
            throw err;
        }
    };

    /**
     * Créer plusieurs unités
     */
    const createUnitsFromList = async (unitsList: ExtendedCreateUnitRequest[]): Promise<Unit[]> => {
        try {
            operationStatus.value = 'creating';
            loading.value = true;
            error.value = null;

            const createdUnits: Unit[] = [];

            for (const unitData of unitsList) {
                // Vérifier si l'unité existe déjà (par symbole)
                if (!unitSymbolExists.value(unitData.symbol)) {
                    try {
                        const newUnitData = await unitsApi.createUnit({
                            name: unitData.name,
                            symbol: unitData.symbol,
                            description: unitData.description,
                        });
                        const newUnit = Unit.fromApiData({
                            ...newUnitData,
                            category: unitData.category,
                            conversion_factor: unitData.conversion_factor,
                            base_unit_id: unitData.base_unit_id,
                        });
                        units.value.push(newUnit);
                        unitsCache.value.set(newUnit.id, newUnit);
                        createdUnits.push(newUnit);
                    } catch (err) {
                        console.error(`Erreur lors de la création de l'unité "${unitData.name}"`, err);
                    }
                }
            }

            // Mettre à jour le convertisseur
            unitConverter.value = new UnitConverter(units.value);

            return createdUnits;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création des unités';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Vérifier si des unités existent déjà
     */
    const checkUnitsExist = (symbols: string[]): { existing: Unit[]; new: string[] } => {
        const existing: Unit[] = [];
        const newSymbols: string[] = [];

        symbols.forEach(symbol => {
            const foundUnit = getUnitBySymbol.value(symbol);
            if (foundUnit) {
                existing.push(foundUnit);
            } else {
                newSymbols.push(symbol);
            }
        });

        return { existing, new: newSymbols };
    };

    /**
     * Importer des unités standard (système métrique, impérial, etc.)
     */
    const importStandardUnits = async (): Promise<Unit[]> => {
        const standardUnits: ExtendedCreateUnitRequest[] = [
            // Unités de poids (métrique)
            { name: 'Gramme', symbol: 'g', category: UnitCategory.WEIGHT, conversion_factor: 0.001, base_unit_id: undefined },
            { name: 'Kilogramme', symbol: 'kg', category: UnitCategory.WEIGHT, conversion_factor: 1, base_unit_id: undefined },
            { name: 'Tonne', symbol: 't', category: UnitCategory.WEIGHT, conversion_factor: 1000, base_unit_id: undefined },

            // Unités de volume (métrique)
            { name: 'Millilitre', symbol: 'ml', category: UnitCategory.VOLUME, conversion_factor: 0.001, base_unit_id: undefined },
            { name: 'Litre', symbol: 'L', category: UnitCategory.VOLUME, conversion_factor: 1, base_unit_id: undefined },

            // Unités de longueur (métrique)
            { name: 'Centimètre', symbol: 'cm', category: UnitCategory.LENGTH, conversion_factor: 0.01, base_unit_id: undefined },
            { name: 'Mètre', symbol: 'm', category: UnitCategory.LENGTH, conversion_factor: 1, base_unit_id: undefined },
            { name: 'Kilomètre', symbol: 'km', category: UnitCategory.LENGTH, conversion_factor: 1000, base_unit_id: undefined },

            // Unités de quantité
            { name: 'Unité', symbol: 'unité', category: UnitCategory.COUNT, conversion_factor: 1, base_unit_id: undefined },
            { name: 'Paire', symbol: 'paire', category: UnitCategory.COUNT, conversion_factor: 2, base_unit_id: undefined },
            { name: 'Dizaine', symbol: 'dizaine', category: UnitCategory.COUNT, conversion_factor: 10, base_unit_id: undefined },
            { name: 'Centaine', symbol: 'centaine', category: UnitCategory.COUNT, conversion_factor: 100, base_unit_id: undefined },
        ];

        return await createUnitsFromList(standardUnits);
    };

    /**
     * Réinitialiser le store
     */
    const resetStore = (): void => {
        units.value = [];
        currentUnit.value = null;
        unitsCache.value.clear();
        selectedUnits.value.clear();
        unitConverter.value = new UnitConverter();
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
        units,
        currentUnit,
        loading,
        error,
        operationStatus,
        selectedUnits,
        searchFilter,
        categoryFilter,
        sortBy,
        sortOrder,
        unitConverter,

        // Getters
        allUnits,
        filteredUnits,
        getUnitById,
        getUnitBySymbol,
        unitsByCategory,
        baseUnits,
        derivedUnits,
        unitOptions,
        groupedUnitOptions,
        selectedUnitList,
        unitStats,
        availableCategories,
        unitSymbolExists,
        unitNameExists,
        updateConverter,

        // Actions
        createUnit,
        fetchAllUnits,
        fetchUnitById,
        updateUnit,
        deleteUnit,
        deleteSelectedUnits,
        toggleUnitSelection,
        selectAllUnits,
        deselectAllUnits,
        toggleSelectAllUnits,
        setFilters,
        resetFilters,
        searchUnits,
        convertValue,
        getCompatibleUnits,
        areUnitsCompatible,
        getConversionFactor,
        getUnitsForProductType,
        formatValueWithUnit,
        addConversionRelation,
        createUnitsFromList,
        checkUnitsExist,
        importStandardUnits,
        resetStore,
    };
});

// Type export pour une utilisation externe
export type UnitStore = ReturnType<typeof useUnitStore>;
