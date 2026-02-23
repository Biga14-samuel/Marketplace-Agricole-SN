// @ts-nocheck
// modules/catalog/store/modules/category.store.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { categoriesApi } from '../../services/api/categories.api';
import { Category, CategoryTree, CreateCategoryRequest, UpdateCategoryRequest } from '../../services/models/category.model'
import { Category as CategoryModel, CategoryTree as CategoryTreeModel } from '../../services/models/category.model';;

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
      const newCategory = newCategoryData;

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

            const fetchedCategories = await categoriesApi.getAllCategories();

            // Mettre à jour les catégories
            categories.value = fetchedCategories;

            // Mettre à jour le cache
            categoriesCache.value.clear();
            fetchedCategories.forEach(cat => categoriesCache.value.set(cat.id, cat));

            // Réinitialiser l'arbre
            categoryTree.value = [];

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

            const tree = await categoriesApi.getCategoryTree();
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

            const category = await categoriesApi.getCategoryById(categoryId);

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

            const updatedCategory = await categoriesApi.updateCategory(categoryId, data);

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