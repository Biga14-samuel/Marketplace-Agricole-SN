// modules/catalog/store/modules/category.store.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { categoriesApi } from '../../services/api/categories.api';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../../services/api/categories.api';
import { Category, CategoryTree } from '../../services/models/category.model';

interface DefaultCategorySeed {
    name: string;
    description?: string;
    children?: DefaultCategorySeed[];
}

const DEFAULT_CATEGORY_SEED: DefaultCategorySeed[] = [
    {
        name: 'Fruits',
        description: 'Fruits frais locaux et de saison',
        children: [
            { name: 'Agrumes' },
            { name: 'Mangues' },
            { name: 'Ananas' },
            { name: 'Bananes & Plantains' },
            { name: 'Papayes' },
            { name: 'Avocats' }
        ]
    },
    {
        name: 'Legumes',
        description: 'Legumes frais pour la cuisine quotidienne',
        children: [
            { name: 'Legumes-feuilles' },
            { name: 'Legumes-racines' },
            { name: 'Legumes-fruits' },
            { name: 'Legumes-bulbes' },
            { name: 'Legumes secs' }
        ]
    },
    {
        name: 'Tubercules',
        description: 'Racines et feculents traditionnels',
        children: [
            { name: 'Manioc' },
            { name: 'Macabo & Taro' },
            { name: 'Patate douce' },
            { name: 'Igname' },
            { name: 'Pomme de terre' }
        ]
    },
    {
        name: 'Cereales',
        description: 'Cereales et derives',
        children: [
            { name: 'Mais' },
            { name: 'Riz' },
            { name: 'Mil & Sorgho' },
            { name: 'Ble' },
            { name: 'Farines' }
        ]
    },
    {
        name: 'Legumineuses',
        description: 'Proteines vegetales et graines',
        children: [
            { name: 'Haricots' },
            { name: 'Pois & Lentilles' },
            { name: 'Soja' },
            { name: 'Arachides' }
        ]
    },
    {
        name: 'Epices & Condiments',
        description: 'Saveurs et assaisonnements',
        children: [
            { name: 'Piment' },
            { name: 'Gingembre' },
            { name: 'Ail' },
            { name: 'Oignon' },
            { name: 'Herbes aromatiques' }
        ]
    },
    {
        name: 'Produits animaux',
        description: 'Produits issus de l elevage',
        children: [
            { name: 'Oeufs' },
            { name: 'Volailles' },
            { name: 'Viandes rouges' },
            { name: 'Porc' },
            { name: 'Lait & produits laitiers' }
        ]
    },
    {
        name: 'Poissons & Fruits de mer',
        description: 'Produits de peche et elevage aquatique',
        children: [
            { name: "Poissons d eau douce" },
            { name: 'Poissons fumes' },
            { name: 'Crevettes' },
            { name: 'Crustaces' }
        ]
    },
    {
        name: 'Huiles & Corps gras',
        description: 'Huiles alimentaires et matieres grasses',
        children: [
            { name: 'Huile de palme' },
            { name: "Huile d arachide" },
            { name: 'Huile de coco' },
            { name: 'Beurre & margarine' }
        ]
    },
    {
        name: 'Produits transformes',
        description: 'Produits agricoles transformes artisanalement',
        children: [
            { name: 'Jus' },
            { name: 'Confitures' },
            { name: 'Conserves' },
            { name: 'Farines transformees' },
            { name: 'Epices moulues' }
        ]
    },
    {
        name: 'Boissons locales',
        description: 'Boissons et infusions issues du terroir',
        children: [
            { name: 'Jus naturels' },
            { name: 'Tisanes' },
            { name: 'Cacao & chocolat' },
            { name: 'Cafe' }
        ]
    },
    {
        name: 'Produits apicoles',
        description: 'Produits de la ruche',
        children: [
            { name: 'Miel' },
            { name: 'Cire' },
            { name: 'Propolis' }
        ]
    },
    {
        name: 'Semences & Plants',
        description: 'Materiel vegetal pour la culture',
        children: [
            { name: 'Semences maraicheres' },
            { name: 'Plants fruitiers' },
            { name: 'Plants potagers' }
        ]
    },
    {
        name: 'Fleurs & Plantes',
        description: 'Plantes ornementales et medicinales',
        children: [
            { name: 'Fleurs coupees' },
            { name: 'Plantes ornementales' },
            { name: 'Plantes medicinales' }
        ]
    },
    {
        name: 'Autres produits agricoles',
        description: 'Autres produits utiles a l exploitation',
        children: [
            { name: 'Fourrage' },
            { name: 'Compost & intrants bio' },
            { name: 'Artisanat agricole' }
        ]
    }
];

export const useCategoryStore = defineStore('category', () => {
    // ============================================
    // State
    // ============================================

    // Liste plate de toutes les catégories
    const categories = ref<Category[]>([]);

    // Arbre des catégories
    const categoryTree = ref<CategoryTree[]>([]);

    // Catégorie actuellement sélectionnée/consultée
    const currentCategory = ref<Category | null>(null);

    // État de chargement
    const loading = ref<boolean>(false);

    // Erreurs
    const error = ref<string | null>(null);

    // Cache pour les catégories par ID
    const categoriesCache = ref<Map<string, Category>>(new Map());

    // État de l'opération en cours
    const operationStatus = ref<'idle' | 'creating' | 'updating' | 'deleting' | 'fetching'>('idle');

    const normalizeName = (value: string): string => value.trim().toLowerCase();
    const slugify = (value: string): string =>
        (
            value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') || 'categorie'
        );

    const upsertCategoryInState = (category: Category): void => {
        const index = categories.value.findIndex(cat => cat.id === category.id);
        if (index !== -1) {
            categories.value[index] = category;
        } else {
            categories.value.push(category);
        }
        categoriesCache.value.set(category.id, category);
    };

    const applyFetchedCategories = (rawCategories: any[]): Category[] => {
        const fetchedCategories = rawCategories.map(category => Category.fromApiData(category));
        categories.value = fetchedCategories;
        categoriesCache.value.clear();
        fetchedCategories.forEach(cat => categoriesCache.value.set(cat.id, cat));
        categoryTree.value = [];
        return fetchedCategories;
    };

    const findExistingByName = (name: string, parentId: string | null): Category | null => {
        const target = normalizeName(name);
        return (
            categories.value.find(cat =>
                normalizeName(cat.name) === target && (cat.parent_id || null) === (parentId || null)
            ) || null
        );
    };

    const createMissingCategory = async (
        seed: DefaultCategorySeed,
        parentId: string | null,
        order: number
    ): Promise<{ category: Category; created: boolean }> => {
        const existing = findExistingByName(seed.name, parentId);
        if (existing) {
            return { category: existing, created: false };
        }

        const createdCategoryData = await categoriesApi.createCategory({
            name: seed.name,
            slug: slugify(seed.name),
            description: seed.description,
            parent_id: parentId,
            order,
            position: order
        });

        const createdCategory = Category.fromApiData(createdCategoryData);
        upsertCategoryInState(createdCategory);
        return { category: createdCategory, created: true };
    };

    const seedDefaultCategories = async (): Promise<number> => {
        let createdCount = 0;

        for (let rootIndex = 0; rootIndex < DEFAULT_CATEGORY_SEED.length; rootIndex++) {
            const rootSeed = DEFAULT_CATEGORY_SEED[rootIndex];
            const rootResult = await createMissingCategory(rootSeed, null, rootIndex + 1);
            if (rootResult.created) createdCount += 1;

            const children = rootSeed.children || [];
            for (let childIndex = 0; childIndex < children.length; childIndex++) {
                const childSeed = children[childIndex];
                const childResult = await createMissingCategory(
                    childSeed,
                    rootResult.category.id,
                    childIndex + 1
                );
                if (childResult.created) createdCount += 1;
            }
        }

        if (createdCount > 0) {
            categoryTree.value = [];
        }

        return createdCount;
    };

    // ============================================
    // Getters / Computed
    // ============================================

    // Toutes les catégories triées par ordre
    const allCategories = computed(() =>
        [...categories.value].sort((a, b) => a.order - b.order)
    );

    // Catégories racines (sans parent)
    const rootCategories = computed(() =>
        allCategories.value.filter(category => !category.parent_id)
    );

    // Catégorie par ID
    const getCategoryById = computed(() => (id: string) =>
        categories.value.find(cat => cat.id === id) || null
    );

    // Catégories par parent
    const getCategoriesByParentId = computed(() => (parentId: string | null) =>
        allCategories.value.filter(cat => cat.parent_id === parentId)
    );

    // Vérifier si une catégorie a des enfants
    const hasChildren = computed(() => (categoryId: string) =>
        categories.value.some(cat => cat.parent_id === categoryId)
    );

    // Chemin d'une catégorie (noms)
    const getCategoryPath = computed(() => (categoryId: string): string[] => {
        const path: string[] = [];
        let currentId: string | null | undefined = categoryId;

        while (currentId) {
            const category = getCategoryById.value(currentId);
            if (!category) break;

            path.unshift(category.name);
            currentId = category.parent_id;
        }

        return path;
    });

    // Formater les catégories pour les sélecteurs
    const categoryOptions = computed(() => {
        const formatOptions = (cats: Category[], level = 0) => {
            const options: { value: string; label: string; disabled?: boolean }[] = [];

            cats.forEach(cat => {
                const indent = '─ '.repeat(level);
                options.push({
                    value: cat.id,
                    label: `${indent}${cat.name}`,
                });

                const children = getCategoriesByParentId.value(cat.id);
                if (children.length > 0) {
                    options.push(...formatOptions(children, level + 1));
                }
            });

            return options;
        };

        return formatOptions(rootCategories.value);
    });

    // Statistiques des catégories
    const categoryStats = computed(() => {
        const total = categories.value.length;
        const rootCount = rootCategories.value.length;
        const withChildren = categories.value.filter(cat => hasChildren.value(cat.id)).length;
        const maxDepth = Math.max(...categories.value.map(cat => getCategoryPath.value(cat.id).length), 0);

        return {
            total,
            rootCount,
            withChildren,
            maxDepth,
            averageChildren: total > 0 ? (total - rootCount) / rootCount : 0,
        };
    });

    // ============================================
    // Actions / Methods
    // ============================================

    /**
     * Créer une catégorie
     * Endpoint: POST /api/v1/products-catalog/products/categories
     */
    const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
        try {
            operationStatus.value = 'creating';
            loading.value = true;
            error.value = null;

            const newCategoryData = await categoriesApi.createCategory(data);
            const newCategory = Category.fromApiData(newCategoryData);

            // Ajouter à la liste
            categories.value.push(newCategory);

            // Mettre à jour le cache
            categoriesCache.value.set(newCategory.id, newCategory);

            // Réinitialiser l'arbre (sera recalculé au prochain accès)
            categoryTree.value = [];

            return newCategory;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création de la catégorie';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Obtenir toutes les catégories
     * Endpoint: GET /api/v1/products-catalog/products/categories
     */
    const fetchAllCategories = async (forceRefresh = false): Promise<Category[]> => {
        try {
            if (categories.value.length > 0 && !forceRefresh) {
                return categories.value;
            }

            operationStatus.value = 'fetching';
            loading.value = true;
            error.value = null;

            let fetchedCategoriesData = await categoriesApi.getAllCategories();
            let fetchedCategories = applyFetchedCategories(fetchedCategoriesData);

            if (fetchedCategories.length === 0) {
                try {
                    const createdCount = await seedDefaultCategories();
                    if (createdCount > 0) {
                        fetchedCategoriesData = await categoriesApi.getAllCategories();
                        fetchedCategories = applyFetchedCategories(fetchedCategoriesData);
                    }
                } catch (seedError) {
                    console.warn('Impossible de pre-remplir les categories par defaut:', seedError);
                }
            }

            return fetchedCategories;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération des catégories';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Obtenir l'arbre des catégories
     * Endpoint: GET /api/v1/products-catalog/products/categories/tree
     */
    const fetchCategoryTree = async (forceRefresh = false): Promise<CategoryTree[]> => {
        try {
            if (categoryTree.value.length > 0 && !forceRefresh) {
                return categoryTree.value;
            }

            operationStatus.value = 'fetching';
            loading.value = true;
            error.value = null;

            const treeData = await categoriesApi.getCategoryTree();
            let tree = treeData.map(node => CategoryTree.fromApiData(node));

            if (tree.length === 0) {
                await fetchAllCategories(true);
                if (categories.value.length > 0) {
                    tree = CategoryTree.buildTreeFromList(categories.value);
                }
            }

            categoryTree.value = tree;

            return tree;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération de l\'arbre des catégories';

            // Si l'API échoue, construire l'arbre localement
            if (categories.value.length > 0) {
                categoryTree.value = CategoryTree.buildTreeFromList(categories.value);
                return categoryTree.value;
            }

            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Obtenir une catégorie par son ID
     * Endpoint: GET /api/v1/products-catalog/products/category/{category_id}
     */
    const fetchCategoryById = async (categoryId: string, forceRefresh = false): Promise<Category> => {
        try {
            // Vérifier le cache d'abord
            const cachedCategory = categoriesCache.value.get(categoryId);
            if (cachedCategory && !forceRefresh) {
                currentCategory.value = cachedCategory;
                return cachedCategory;
            }

            operationStatus.value = 'fetching';
            loading.value = true;
            error.value = null;

            const categoryData = await categoriesApi.getCategoryById(categoryId);
            const category = Category.fromApiData(categoryData);

            // Mettre à jour le cache
            categoriesCache.value.set(category.id, category);

            // Mettre à jour la liste si la catégorie existe déjà
            const index = categories.value.findIndex(cat => cat.id === categoryId);
            if (index !== -1) {
                categories.value[index] = category;
            } else {
                categories.value.push(category);
            }

            currentCategory.value = category;

            return category;
        } catch (err: any) {
            error.value = err.message || `Erreur lors de la récupération de la catégorie ${categoryId}`;
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Mettre à jour une catégorie
     * Endpoint: PUT /api/v1/products-catalog/products/categories/{category_id}
     */
    const updateCategory = async (categoryId: string, data: UpdateCategoryRequest): Promise<Category> => {
        try {
            operationStatus.value = 'updating';
            loading.value = true;
            error.value = null;

            const updatedCategoryData = await categoriesApi.updateCategory(categoryId, data);
            const updatedCategory = Category.fromApiData(updatedCategoryData);

            // Mettre à jour la liste
            const index = categories.value.findIndex(cat => cat.id === categoryId);
            if (index !== -1) {
                categories.value[index] = updatedCategory;
            }

            // Mettre à jour le cache
            categoriesCache.value.set(categoryId, updatedCategory);

            // Mettre à jour la catégorie courante si c'est celle-ci
            if (currentCategory.value?.id === categoryId) {
                currentCategory.value = updatedCategory;
            }

            // Réinitialiser l'arbre
            categoryTree.value = [];

            return updatedCategory;
        } catch (err: any) {
            error.value = err.message || `Erreur lors de la mise à jour de la catégorie ${categoryId}`;
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Supprimer une catégorie
     * Endpoint: DELETE /api/v1/products-catalog/products/categories/{category_id}
     */
    const deleteCategory = async (categoryId: string): Promise<void> => {
        try {
            operationStatus.value = 'deleting';
            loading.value = true;
            error.value = null;

            await categoriesApi.deleteCategory(categoryId);

            // Supprimer de la liste
            categories.value = categories.value.filter(cat => cat.id !== categoryId);

            // Supprimer du cache
            categoriesCache.value.delete(categoryId);

            // Réinitialiser la catégorie courante si c'est celle-ci
            if (currentCategory.value?.id === categoryId) {
                currentCategory.value = null;
            }

            // Réinitialiser l'arbre
            categoryTree.value = [];

        } catch (err: any) {
            error.value = err.message || `Erreur lors de la suppression de la catégorie ${categoryId}`;
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Déplacer une catégorie (changer de parent)
     */
    const moveCategory = async (categoryId: string, newParentId: string | null): Promise<void> => {
        try {
            const category = categories.value.find(cat => cat.id === categoryId);
            if (!category) {
                throw new Error('Catégorie non trouvée');
            }

            // Vérifier les boucles (une catégorie ne peut pas être son propre parent/descendant)
            if (newParentId) {
                const newParent = categories.value.find(cat => cat.id === newParentId);
                if (!newParent) {
                    throw new Error('Catégorie parente non trouvée');
                }

                // Vérifier la récursion
                let currentParentId: string | null | undefined = newParentId;
                while (currentParentId) {
                    if (currentParentId === categoryId) {
                        throw new Error('Une catégorie ne peut pas être déplacée dans l\'un de ses descendants');
                    }
                    const currentParent = categories.value.find(cat => cat.id === currentParentId);
                    currentParentId = currentParent?.parent_id;
                }
            }

            await updateCategory(categoryId, { parent_id: newParentId });
        } catch (err: any) {
            error.value = err.message || `Erreur lors du déplacement de la catégorie ${categoryId}`;
            throw err;
        }
    };

    /**
     * Réorganiser les catégories (changer l'ordre)
     */
    const reorderCategories = async (reorderMap: Array<{ id: string; order: number }>) => {
        try {
            operationStatus.value = 'updating';
            loading.value = true;
            error.value = null;

            // Mettre à jour localement d'abord pour un feedback immédiat
            reorderMap.forEach(({ id, order }) => {
                const category = categories.value.find(cat => cat.id === id);
                if (category) {
                    category.order = order;
                }
            });

            // Trier localement
            categories.value.sort((a, b) => a.order - b.order);

            // Envoyer les mises à jour à l'API (dans un vrai cas, il faudrait un endpoint batch)
            for (const { id, order } of reorderMap) {
                try {
                    await categoriesApi.updateCategory(id, { order });
                } catch (err) {
                    console.error(`Erreur lors de la mise à jour de l'ordre pour la catégorie ${id}`, err);
                }
            }

            // Réinitialiser l'arbre
            categoryTree.value = [];

        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la réorganisation des catégories';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Rechercher des catégories
     */
    const searchCategories = (searchTerm: string): Category[] => {
        if (!searchTerm.trim()) return allCategories.value;

        const term = searchTerm.toLowerCase();
        return allCategories.value.filter(category =>
            category.name.toLowerCase().includes(term) ||
            (category.description && category.description.toLowerCase().includes(term))
        );
    };

    /**
     * Vérifier si une catégorie peut être supprimée
     */
    const canDeleteCategory = (categoryId: string): boolean => {
        return !hasChildren.value(categoryId);
    };

    /**
     * Construire l'arbre localement (si l'API ne le fournit pas)
     */
    const buildLocalTree = (): CategoryTree[] => {
        if (categoryTree.value.length === 0 && categories.value.length > 0) {
            categoryTree.value = CategoryTree.buildTreeFromList(categories.value);
        }
        return categoryTree.value;
    };

    /**
     * Réinitialiser le store
     */
    const resetStore = (): void => {
        categories.value = [];
        categoryTree.value = [];
        currentCategory.value = null;
        categoriesCache.value.clear();
        loading.value = false;
        error.value = null;
        operationStatus.value = 'idle';
    };

    // ============================================
    // Retour du store
    // ============================================

    return {
        // State
        categories,
        categoryTree,
        currentCategory,
        loading,
        error,
        operationStatus,

        // Getters
        allCategories,
        rootCategories,
        getCategoryById,
        getCategoriesByParentId,
        hasChildren,
        getCategoryPath,
        categoryOptions,
        categoryStats,

        // Actions
        createCategory,
        fetchAllCategories,
        fetchCategoryTree,
        fetchCategoryById,
        updateCategory,
        deleteCategory,
        moveCategory,
        reorderCategories,
        searchCategories,
        canDeleteCategory,
        buildLocalTree,
        resetStore,
    };
});

// Type export pour une utilisation externe
export type CategoryStore = ReturnType<typeof useCategoryStore>;
