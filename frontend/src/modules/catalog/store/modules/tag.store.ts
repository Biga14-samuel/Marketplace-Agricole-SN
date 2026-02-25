// modules/catalog/store/modules/tag.store.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { tagsApi } from '../../services/api/tags.api';
import type { CreateTagRequest, UpdateTagRequest } from '../../services/api/tags.api';
import { Tag, TagHelper } from '../../services/models/tag.model';

export const useTagStore = defineStore('tag', () => {
    // ============================================
    // State
    // ============================================

    // Liste de tous les tags
    const tags = ref<Tag[]>([]);

    // Tag actuellement sélectionné/consulté
    const currentTag = ref<Tag | null>(null);

    // État de chargement
    const loading = ref<boolean>(false);

    // Erreurs
    const error = ref<string | null>(null);

    // Cache pour les tags par ID
    const tagsCache = ref<Map<string, Tag>>(new Map());

    // État de l'opération en cours
    const operationStatus = ref<'idle' | 'creating' | 'updating' | 'deleting' | 'fetching'>('idle');

    // Tags sélectionnés (pour les opérations en lot)
    const selectedTags = ref<Set<string>>(new Set());

    // Filtres de recherche
    const searchFilter = ref<string>('');
    const sortBy = ref<'name' | 'created_at' | 'updated_at' | 'usage'>('name');
    const sortOrder = ref<'asc' | 'desc'>('asc');
    const colorFilter = ref<string | null>(null);

    // ============================================
    // Getters / Computed
    // ============================================

    // Tous les tags triés selon les critères actuels
    const allTags = computed(() =>
        TagHelper.sortTags(tags.value, sortBy.value, sortOrder.value)
    );

    // Tags filtrés par recherche
    const filteredTags = computed(() => {
        let filtered = allTags.value;

        if (searchFilter.value.trim()) {
            filtered = TagHelper.filterBySearch(filtered, searchFilter.value);
        }

        if (colorFilter.value) {
            filtered = TagHelper.filterByColor(filtered, colorFilter.value);
        }

        return filtered;
    });

    // Tag par ID
    const getTagById = computed(() => (id: string) =>
        tags.value.find(tag => tag.id === id) || null
    );

    // Tags par nom (insensible à la casse)
    const getTagsByName = computed(() => (name: string) =>
        TagHelper.findByName(tags.value, name)
    );

    // Tags groupés par première lettre
    const tagsByLetter = computed(() =>
        TagHelper.groupByFirstLetter(filteredTags.value)
    );

    // Tags populaires (utilisés plus de 10 fois)
    const popularTags = computed(() =>
        TagHelper.getPopularTags(tags.value, 10)
    );

    // Options de tags pour les sélecteurs
    const tagOptions = computed(() =>
        filteredTags.value.map(tag => ({
            value: tag.id,
            label: tag.name,
            color: tag.color,
            textColor: tag.getTextColor(),
        }))
    );

    // Tags sélectionnés
    const selectedTagList = computed(() =>
        Array.from(selectedTags.value).map(id => getTagById.value(id)).filter(Boolean) as Tag[]
    );

    // Statistiques des tags
    const tagStats = computed(() =>
        TagHelper.getTagStats(tags.value)
    );

    // Couleurs uniques utilisées dans les tags
    const uniqueColors = computed(() => {
        const colors = new Set<string>();
        tags.value.forEach(tag => {
            if (tag.color) {
                colors.add(tag.color);
            }
        });
        return Array.from(colors);
    });

    // Vérifier si un nom de tag existe déjà
    const tagNameExists = computed(() => (name: string, excludeId?: string) =>
        TagHelper.nameExists(tags.value, name, excludeId)
    );

    // ============================================
    // Actions / Methods
    // ============================================

    /**
     * Créer un tag
     * Endpoint: POST /api/v1/products-catalog/products/tags
     */
    const createTag = async (data: CreateTagRequest): Promise<Tag> => {
        try {
            operationStatus.value = 'creating';
            loading.value = true;
            error.value = null;

            // Vérifier si le nom existe déjà
            if (tagNameExists.value(data.name)) {
                throw new Error(`Un tag avec le nom "${data.name}" existe déjà`);
            }

            const newTagData = await tagsApi.createTag(data);
            const newTag = Tag.fromApiData(newTagData);

            // Ajouter à la liste
            tags.value.push(newTag);

            // Mettre à jour le cache
            tagsCache.value.set(newTag.id, newTag);

            return newTag;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création du tag';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Obtenir tous les tags
     * Endpoint: GET /api/v1/products-catalog/products/tags
     */
    const fetchAllTags = async (forceRefresh = false): Promise<Tag[]> => {
        try {
            if (tags.value.length > 0 && !forceRefresh) {
                return tags.value;
            }

            operationStatus.value = 'fetching';
            loading.value = true;
            error.value = null;

            const fetchedTagsData = await tagsApi.getAllTags();
            const fetchedTags = fetchedTagsData.map(tag => Tag.fromApiData(tag));

            // Mettre à jour les tags
            tags.value = fetchedTags;

            // Mettre à jour le cache
            tagsCache.value.clear();
            fetchedTags.forEach(tag => tagsCache.value.set(tag.id, tag));

            return fetchedTags;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la récupération des tags';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Obtenir un tag par son ID (méthode locale, pas d'endpoint spécifique)
     */
    const fetchTagById = async (tagId: string, forceRefresh = false): Promise<Tag | null> => {
        try {
            // Vérifier le cache d'abord
            const cachedTag = tagsCache.value.get(tagId);
            if (cachedTag && !forceRefresh) {
                currentTag.value = cachedTag;
                return cachedTag;
            }

            // Si pas en cache, chercher dans la liste locale
            const tag = getTagById.value(tagId);
            if (tag) {
                currentTag.value = tag;
                return tag;
            }

            // Si pas dans la liste, essayer de recharger tous les tags
            await fetchAllTags();

            const foundTag = getTagById.value(tagId);
            currentTag.value = foundTag;
            return foundTag;

        } catch (err: any) {
            error.value = err.message || `Erreur lors de la récupération du tag ${tagId}`;
            throw err;
        }
    };

    /**
     * Mettre à jour un tag (méthode locale, pas d'endpoint spécifique pour l'instant)
     */
    const updateTag = async (tagId: string, data: UpdateTagRequest): Promise<Tag> => {
        try {
            operationStatus.value = 'updating';
            loading.value = true;
            error.value = null;

            const tag = getTagById.value(tagId);
            if (!tag) {
                throw new Error('Tag non trouvé');
            }

            // Vérifier si le nouveau nom existe déjà (excluant le tag actuel)
            if (data.name && tagNameExists.value(data.name, tagId)) {
                throw new Error(`Un tag avec le nom "${data.name}" existe déjà`);
            }

            // Mettre à jour localement
            tag.update(data);

            // Mettre à jour le cache
            tagsCache.value.set(tagId, tag);

            // Mettre à jour la liste
            const index = tags.value.findIndex(t => t.id === tagId);
            if (index !== -1) {
                tags.value[index] = tag;
            }

            // Mettre à jour le tag courant si c'est celui-ci
            if (currentTag.value?.id === tagId) {
                currentTag.value = tag;
            }

            return tag;
        } catch (err: any) {
            error.value = err.message || `Erreur lors de la mise à jour du tag ${tagId}`;
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Supprimer un tag (méthode locale, pas d'endpoint spécifique pour l'instant)
     */
    const deleteTag = async (tagId: string): Promise<void> => {
        try {
            operationStatus.value = 'deleting';
            loading.value = true;
            error.value = null;

            const tag = getTagById.value(tagId);
            if (!tag) {
                throw new Error('Tag non trouvé');
            }

            // Vérifier si le tag est utilisé
            if ((tag.usage_count || 0) > 0) {
                throw new Error('Ce tag est utilisé par des produits et ne peut pas être supprimé');
            }

            // Supprimer de la liste
            tags.value = tags.value.filter(t => t.id !== tagId);

            // Supprimer du cache
            tagsCache.value.delete(tagId);

            // Désélectionner si nécessaire
            selectedTags.value.delete(tagId);

            // Réinitialiser le tag courant si c'est celui-ci
            if (currentTag.value?.id === tagId) {
                currentTag.value = null;
            }

        } catch (err: any) {
            error.value = err.message || `Erreur lors de la suppression du tag ${tagId}`;
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Supprimer plusieurs tags
     */
    const deleteSelectedTags = async (): Promise<void> => {
        try {
            operationStatus.value = 'deleting';
            loading.value = true;
            error.value = null;

            const tagIds = Array.from(selectedTags.value);

            // Vérifier si certains tags sont utilisés
            const usedTags = tagIds.filter(id => {
                const tag = getTagById.value(id);
                return tag && (tag.usage_count || 0) > 0;
            });

            if (usedTags.length > 0) {
                throw new Error(`${usedTags.length} tag(s) sont utilisés par des produits et ne peuvent pas être supprimés`);
            }

            // Supprimer chaque tag
            for (const tagId of tagIds) {
                tags.value = tags.value.filter(t => t.id !== tagId);
                tagsCache.value.delete(tagId);
            }

            // Vider la sélection
            selectedTags.value.clear();

            // Réinitialiser le tag courant s'il était sélectionné
            if (currentTag.value && tagIds.includes(currentTag.value.id)) {
                currentTag.value = null;
            }

        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression des tags';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Sélectionner/désélectionner un tag
     */
    const toggleTagSelection = (tagId: string): void => {
        if (selectedTags.value.has(tagId)) {
            selectedTags.value.delete(tagId);
        } else {
            selectedTags.value.add(tagId);
        }
    };

    /**
     * Sélectionner tous les tags
     */
    const selectAllTags = (): void => {
        filteredTags.value.forEach(tag => {
            selectedTags.value.add(tag.id);
        });
    };

    /**
     * Désélectionner tous les tags
     */
    const deselectAllTags = (): void => {
        selectedTags.value.clear();
    };

    /**
     * Basculer la sélection de tous les tags
     */
    const toggleSelectAllTags = (): void => {
        const allFilteredIds = new Set(filteredTags.value.map(tag => tag.id));
        const allSelected = Array.from(selectedTags.value).every(id => allFilteredIds.has(id));

        if (allSelected) {
            deselectAllTags();
        } else {
            selectAllTags();
        }
    };

    /**
     * Définir les filtres de recherche
     */
    const setFilters = (filters: {
        search?: string;
        sortBy?: 'name' | 'created_at' | 'updated_at' | 'usage';
        sortOrder?: 'asc' | 'desc';
        color?: string | null;
    }): void => {
        if (filters.search !== undefined) searchFilter.value = filters.search;
        if (filters.sortBy !== undefined) sortBy.value = filters.sortBy;
        if (filters.sortOrder !== undefined) sortOrder.value = filters.sortOrder;
        if (filters.color !== undefined) colorFilter.value = filters.color;
    };

    /**
     * Réinitialiser les filtres
     */
    const resetFilters = (): void => {
        searchFilter.value = '';
        sortBy.value = 'name';
        sortOrder.value = 'asc';
        colorFilter.value = null;
    };

    /**
     * Rechercher des tags
     */
    const searchTags = (query: string): Tag[] => {
        return TagHelper.filterBySearch(tags.value, query);
    };

    /**
     * Extraire des tags d'un texte
     */
    const extractTagsFromText = (text: string): string[] => {
        return TagHelper.extractTagsFromText(text);
    };

    /**
     * Créer plusieurs tags à partir de noms
     */
    const createTagsFromNames = async (names: string[]): Promise<Tag[]> => {
        try {
            operationStatus.value = 'creating';
            loading.value = true;
            error.value = null;

            const createdTags: Tag[] = [];

            for (const name of names) {
                // Vérifier si le tag existe déjà
                if (!tagNameExists.value(name)) {
                    try {
                        const newTagData = await tagsApi.createTag({ name });
                        const newTag = Tag.fromApiData(newTagData);
                        tags.value.push(newTag);
                        tagsCache.value.set(newTag.id, newTag);
                        createdTags.push(newTag);
                    } catch (err) {
                        console.error(`Erreur lors de la création du tag "${name}"`, err);
                    }
                }
            }

            return createdTags;
        } catch (err: any) {
            error.value = err.message || 'Erreur lors de la création des tags';
            throw err;
        } finally {
            loading.value = false;
            operationStatus.value = 'idle';
        }
    };

    /**
     * Incrémenter le compteur d'utilisation d'un tag
     */
    const incrementTagUsage = (tagId: string): void => {
        const tag = getTagById.value(tagId);
        if (tag) {
            tag.incrementUsage();

            // Mettre à jour le cache
            tagsCache.value.set(tagId, tag);

            // Mettre à jour la liste
            const index = tags.value.findIndex(t => t.id === tagId);
            if (index !== -1) {
                tags.value[index] = tag;
            }
        }
    };

    /**
     * Décrémenter le compteur d'utilisation d'un tag
     */
    const decrementTagUsage = (tagId: string): void => {
        const tag = getTagById.value(tagId);
        if (tag) {
            tag.decrementUsage();

            // Mettre à jour le cache
            tagsCache.value.set(tagId, tag);

            // Mettre à jour la liste
            const index = tags.value.findIndex(t => t.id === tagId);
            if (index !== -1) {
                tags.value[index] = tag;
            }
        }
    };

    /**
     * Formater des tags pour l'affichage dans un champ de saisie
     */
    const formatTagsForInput = (tagIds: string[]): string => {
        const tagObjects = tagIds
            .map(id => getTagById.value(id))
            .filter(Boolean) as Tag[];

        return TagHelper.formatTagsForInput(tagObjects);
    };

    /**
     * Obtenir les tags recommandés basés sur la recherche
     */
    const getSuggestedTags = (searchTerm: string, limit = 5): Tag[] => {
        if (!searchTerm.trim()) return popularTags.value.slice(0, limit);

        return searchTags(searchTerm).slice(0, limit);
    };

    /**
     * Vérifier si des tags existent déjà
     */
    const checkTagsExist = (tagNames: string[]): { existing: Tag[]; new: string[] } => {
        const existing: Tag[] = [];
        const newTags: string[] = [];

        tagNames.forEach(name => {
            const foundTags = getTagsByName.value(name);
            if (foundTags.length > 0) {
                existing.push(...foundTags);
            } else {
                newTags.push(name);
            }
        });

        return { existing, new: newTags };
    };

    /**
     * Réinitialiser le store
     */
    const resetStore = (): void => {
        tags.value = [];
        currentTag.value = null;
        tagsCache.value.clear();
        selectedTags.value.clear();
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
        tags,
        currentTag,
        loading,
        error,
        operationStatus,
        selectedTags,
        searchFilter,
        sortBy,
        sortOrder,
        colorFilter,

        // Getters
        allTags,
        filteredTags,
        getTagById,
        getTagsByName,
        tagsByLetter,
        popularTags,
        tagOptions,
        selectedTagList,
        tagStats,
        uniqueColors,
        tagNameExists,

        // Actions
        createTag,
        fetchAllTags,
        fetchTagById,
        updateTag,
        deleteTag,
        deleteSelectedTags,
        toggleTagSelection,
        selectAllTags,
        deselectAllTags,
        toggleSelectAllTags,
        setFilters,
        resetFilters,
        searchTags,
        extractTagsFromText,
        createTagsFromNames,
        incrementTagUsage,
        decrementTagUsage,
        formatTagsForInput,
        getSuggestedTags,
        checkTagsExist,
        resetStore,
    };
});

// Type export pour une utilisation externe
export type TagStore = ReturnType<typeof useTagStore>;
