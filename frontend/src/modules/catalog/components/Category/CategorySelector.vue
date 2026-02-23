<template>
    <div class="relative" ref="container">
        <!-- Champ de sélection principal -->
        <div class="relative group" @click="toggleDropdown">
            <!-- Label -->
            <label v-if="label" class="flex text-sm font-medium mb-2 text-forest-green-700 items-center space-x-2">
                <svg class="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>{{ label }}</span>
                <span v-if="required" class="text-terracotta-500">*</span>
            </label>

            <!-- Conteneur du champ -->
            <div class="relative cursor-pointer transition-all duration-300 ease-out-custom" :class="[
                isOpen ? 'ring-2 ring-spring-green-300' : '',
                error ? 'ring-2 ring-terracotta-300' : '',
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            ]">
                <!-- Fond avec dégradé organique -->
                <div
                    class="absolute inset-0 bg-gradient-to-r from-spring-green-50/40 to-cream-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>

                <!-- Champ affiché -->
                <div class="relative bg-white/90 backdrop-blur-sm border rounded-xl shadow-soft-organic overflow-hidden transition-all duration-300 ease-out-custom"
                    :class="[
                        isOpen ? 'border-spring-green-400 shadow-organic' : 'border-nature-gray-200/60',
                        error ? 'border-terracotta-400' : ''
                    ]">
                    <div class="flex items-center justify-between px-4 py-3">
                        <!-- Contenu sélectionné -->
                        <div class="flex items-center space-x-3 flex-1 min-w-0">
                            <div v-if="selectedCategory" class="flex items-center space-x-3 flex-1">
                                <!-- Icône de la catégorie -->
                                <div
                                    class="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-spring-green-100 to-cream-100 flex items-center justify-center text-spring-green-600">
                                    {{ selectedCategory.icon || '🌱' }}
                                </div>

                                <!-- Nom et chemin -->
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-forest-green-900 truncate">
                                        {{ selectedCategory.name }}
                                    </div>
                                    <div v-if="showPath && categoryPath.length > 1"
                                        class="text-xs text-nature-gray-500 truncate">
                                        <span v-for="(cat, index) in categoryPath.slice(0, -1)" :key="cat.id">
                                            {{ cat.name }}
                                            <span v-if="index < categoryPath.length - 2" class="mx-1">›</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Placeholder -->
                            <div v-else class="text-nature-gray-400 italic flex-1">
                                {{ placeholder || 'Sélectionnez une catégorie...' }}
                            </div>
                        </div>

                        <!-- Indicateur et bouton clear -->
                        <div class="flex items-center space-x-2 ml-3">
                            <!-- Bouton clear -->
                            <button v-if="selectedCategory && clearable && !disabled" @click.stop="clearSelection"
                                class="p-1 text-nature-gray-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-all duration-200 ease-out-custom">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>

                            <!-- Flèche dropdown -->
                            <div class="transition-transform duration-500 ease-out-expo"
                                :class="{ 'rotate-180': isOpen }">
                                <svg class="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message d'erreur -->
            <div v-if="error" class="mt-2 flex items-center text-sm text-terracotta-600 animate-fade-in">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                </svg>
                {{ error }}
            </div>
        </div>

        <!-- Dropdown -->
        <Transition enter-active-class="transition-all duration-300 ease-out-expo"
            enter-from-class="opacity-0 scale-95 translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in-expo" leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95">
            <div v-if="isOpen && !disabled" class="absolute z-50 mt-2 w-full min-w-[300px]" :class="dropdownPosition">
                <!-- Dropdown container -->
                <div class="relative">
                    <!-- Flèche du dropdown -->
                    <div
                        class="absolute -top-2 left-6 w-4 h-4 bg-white/95 backdrop-blur-sm transform rotate-45 border-l border-t border-nature-gray-200/60">
                    </div>

                    <!-- Carte du dropdown -->
                    <div
                        class="bg-white/95 backdrop-blur-sm rounded-xl shadow-organic-xl border border-nature-gray-200/60 overflow-hidden">
                        <!-- Barre de recherche -->
                        <div
                            class="p-4 border-b border-nature-gray-200/40 bg-gradient-to-r from-spring-green-50/30 to-cream-50/20">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-spring-green-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input ref="searchInput" v-model="searchQuery" type="text"
                                    class="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-spring-green-200/50 rounded-lg focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom placeholder-nature-gray-400 text-forest-green-800 shadow-sm"
                                    placeholder="Rechercher une catégorie..." @keydown.esc="closeDropdown"
                                    @keydown.down.prevent="navigateDown" @keydown.up.prevent="navigateUp"
                                    @keydown.enter.prevent="selectFocused" />
                            </div>

                            <!-- Filtres rapides -->
                            <div v-if="filterable" class="flex flex-wrap gap-2 mt-3">
                                <button v-for="filter in quickFilters" :key="filter.id" @click="applyFilter(filter.id)"
                                    class="px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ease-out-custom"
                                    :class="[
                                        activeFilter === filter.id
                                            ? 'bg-spring-green-100 border-spring-green-300 text-spring-green-800'
                                            : 'border-nature-gray-300 text-nature-gray-600 hover:bg-nature-gray-50'
                                    ]">
                                    {{ filter.label }}
                                </button>
                            </div>
                        </div>

                        <!-- Liste des catégories -->
                        <div class="max-h-64 overflow-y-auto custom-scrollbar">
                            <!-- État de chargement -->
                            <div v-if="loading" class="py-8 text-center">
                                <div
                                    class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-spring-green-200 border-t-spring-green-500 mb-3">
                                </div>
                                <p class="text-sm text-nature-gray-500">Chargement des catégories...</p>
                            </div>

                            <!-- Catégories filtrées -->
                            <div v-else-if="filteredCategories.length === 0" class="py-8 text-center">
                                <div class="w-16 h-16 mx-auto mb-3 opacity-30">
                                    <svg class="w-full h-full text-nature-gray-400" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                                <p class="text-nature-gray-500">Aucune catégorie trouvée</p>
                                <p v-if="searchQuery" class="text-sm text-nature-gray-400 mt-1">Essayez avec d'autres
                                    termes</p>
                            </div>

                            <!-- Liste des catégories -->
                            <div v-else class="py-2">
                                <!-- Option "Aucune catégorie" -->
                                <div v-if="allowNone" @click="selectNone" @mouseenter="focusedIndex = -1"
                                    class="px-4 py-3 hover:bg-spring-green-50 cursor-pointer transition-all duration-200 ease-out-custom group"
                                    :class="{ 'bg-spring-green-50': focusedIndex === -1 }">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-nature-gray-100 to-cream-100 flex items-center justify-center text-nature-gray-500">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div
                                                class="font-medium text-nature-gray-700 group-hover:text-forest-green-900">
                                                Aucune catégorie</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Catégories -->
                                <div v-for="(category, index) in filteredCategories" :key="category.id"
                                    @click="selectCategory(category)" @mouseenter="focusedIndex = index"
                                    class="px-4 py-3 hover:bg-spring-green-50 cursor-pointer transition-all duration-200 ease-out-custom border-b border-nature-gray-100/30 last:border-b-0 group"
                                    :class="[
                                        { 'bg-spring-green-50': focusedIndex === index },
                                        { 'opacity-50': !category.is_active && hideInactive }
                                    ]" :style="{ paddingLeft: `${(getCategoryDepth(category) * 20) + 16}px` }">
                                    <div class="flex items-center space-x-3">
                                        <!-- Icône -->
                                        <div class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 ease-out-custom group-hover:scale-110"
                                            :class="[
                                                category.is_active
                                                    ? 'bg-gradient-to-br from-spring-green-100 to-cream-100 text-spring-green-600'
                                                    : 'bg-gradient-to-br from-terracotta-100 to-cream-100 text-terracotta-600'
                                            ]">
                                            {{ category.icon || (hasChildren(category) ? '🌳' : '🍃') }}
                                        </div>

                                        <!-- Informations -->
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center justify-between">
                                                <div class="font-medium truncate" :class="[
                                                    category.is_active ? 'text-forest-green-900' : 'text-nature-gray-600',
                                                    'group-hover:text-forest-green-700'
                                                ]">
                                                    {{ category.name }}
                                                </div>

                                                <!-- Indicateurs -->
                                                <div class="flex items-center space-x-2 ml-3">
                                                    <!-- Badge statut -->
                                                    <span v-if="!category.is_active"
                                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-terracotta-100 text-terracotta-800">
                                                        Inactive
                                                    </span>

                                                    <!-- Badge enfants -->
                                                    <span v-if="hasChildren(category)"
                                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-forest-green-100 text-forest-green-800">
                                                        {{ category.children.length }} sous-cat.
                                                    </span>
                                                </div>
                                            </div>

                                            <!-- Chemin parent -->
                                            <div v-if="showPathInList"
                                                class="text-xs text-nature-gray-500 truncate mt-1">
                                                {{ getCategoryPath(category) }}
                                            </div>
                                        </div>

                                        <!-- Indicateur de sélection -->
                                        <div v-if="isSelected(category)" class="flex-shrink-0 ml-2">
                                            <div
                                                class="w-5 h-5 rounded-full bg-gradient-to-r from-spring-green-500 to-forest-green-500 flex items-center justify-center">
                                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer du dropdown -->
                        <div v-if="filteredCategories.length > 0"
                            class="px-4 py-3 border-t border-nature-gray-200/40 bg-gradient-to-r from-spring-green-50/20 to-cream-50/10">
                            <div class="flex items-center justify-between text-sm">
                                <div class="text-nature-gray-500">
                                    <span class="font-medium text-forest-green-700">{{ filteredCategories.length
                                        }}</span> catégories
                                </div>
                                <div class="text-nature-gray-500">
                                    <span class="font-medium text-forest-green-700">{{ activeCategoriesCount }}</span>
                                    actives
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useCategoryStore } from '@/modules/catalog/store/modules/category.store'

interface Props {
    modelValue?: string | null
    label?: string
    placeholder?: string
    required?: boolean
    error?: string
    disabled?: boolean
    clearable?: boolean
    allowNone?: boolean
    filterable?: boolean
    showPath?: boolean
    showPathInList?: boolean
    hideInactive?: boolean
    onlyActive?: boolean
    dropdownPosition?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    label: '',
    placeholder: 'Sélectionnez une catégorie...',
    required: false,
    error: '',
    disabled: false,
    clearable: true,
    allowNone: false,
    filterable: true,
    showPath: true,
    showPathInList: true,
    hideInactive: false,
    onlyActive: false,
    dropdownPosition: 'bottom'
})

interface Emits {
    (e: 'update:modelValue', value: string | null): void
    (e: 'change', value: string | null): void
    (e: 'select', category: any): void
}

const emit = defineEmits<Emits>()

// Store et données
const categoryStore = useCategoryStore()
const container = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

// États
const isOpen = ref(false)
const searchQuery = ref('')
const focusedIndex = ref(-1)
const activeFilter = ref<string>('all')
const loading = ref(false)

// Filtres rapides
const quickFilters = [
    { id: 'all', label: 'Toutes' },
    { id: 'active', label: 'Actives' },
    { id: 'roots', label: 'Racines' },
    { id: 'leaves', label: 'Feuilles' }
]

// Catégories
const categories = ref<any[]>([])
const categoryMap = ref<Map<string, any>>(new Map())

// Données calculées
const selectedCategory = computed(() => {
    if (!props.modelValue) return null
    return categoryMap.value.get(props.modelValue) || null
})

const categoryPath = computed(() => {
    if (!selectedCategory.value) return []

    const path: any[] = []
    let current = selectedCategory.value

    while (current) {
        path.unshift(current)
        if (current.parent_id && categoryMap.value.has(current.parent_id)) {
            current = categoryMap.value.get(current.parent_id)
        } else {
            break
        }
    }

    return path
})

const filteredCategories = computed(() => {
    let filtered = categories.value

    // Filtrer par recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(cat =>
            cat.name.toLowerCase().includes(query) ||
            cat.description?.toLowerCase().includes(query) ||
            (cat.slug && cat.slug.toLowerCase().includes(query))
        )
    }

    // Appliquer les filtres rapides
    switch (activeFilter.value) {
        case 'active':
            filtered = filtered.filter(cat => cat.is_active)
            break
        case 'roots':
            filtered = filtered.filter(cat => !cat.parent_id)
            break
        case 'leaves':
            filtered = filtered.filter(cat => !cat.children || cat.children.length === 0)
            break
    }

    // Filtrer les inactives si demandé
    if (props.hideInactive) {
        filtered = filtered.filter(cat => cat.is_active)
    }

    // Trier par position puis nom
    return filtered.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order
        return a.name.localeCompare(b.name)
    })
})

const activeCategoriesCount = computed(() => {
    return filteredCategories.value.filter(cat => cat.is_active).length
})

// Méthodes
const loadCategories = async () => {
    if (loading.value) return

    loading.value = true
    try {
        const tree = await categoryStore.fetchCategoryTree()

        // Transformer l'arbre en liste plate avec profondeur
        const flattenTree = (nodes: any[], parentId: string | null = null, depth: number = 0): any[] => {
            let result: any[] = []

            nodes.forEach(node => {
                const nodeWithDepth = {
                    ...node,
                    parent_id: parentId,
                    depth: depth
                }

                result.push(nodeWithDepth)
                categoryMap.value.set(node.id, nodeWithDepth)

                if (node.children && node.children.length > 0) {
                    result = result.concat(flattenTree(node.children, node.id, depth + 1))
                }
            })

            return result
        }

        categories.value = flattenTree(tree || [])
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
    } finally {
        loading.value = false
    }
}

const getCategoryDepth = (category: any): number => {
    return category.depth || 0
}

const getCategoryPath = (category: any): string => {
    const path: string[] = []
    let current = category

    // Remonter la hiérarchie
    while (current && current.parent_id) {
        const parent = categoryMap.value.get(current.parent_id)
        if (parent) {
            path.unshift(parent.name)
            current = parent
        } else {
            break
        }
    }

    return path.length > 0 ? path.join(' › ') : 'Racine'
}

const hasChildren = (category: any): boolean => {
    return category.children && category.children.length > 0
}

const isSelected = (category: any): boolean => {
    return props.modelValue === category.id
}

const toggleDropdown = () => {
    if (props.disabled) return

    isOpen.value = !isOpen.value

    if (isOpen.value) {
        nextTick(() => {
            searchInput.value?.focus()
            focusedIndex.value = -1
        })
    }
}

const closeDropdown = () => {
    isOpen.value = false
    searchQuery.value = ''
    activeFilter.value = 'all'
}

const selectCategory = (category: any) => {
    if (props.disabled) return

    emit('update:modelValue', category.id)
    emit('change', category.id)
    emit('select', category)
    closeDropdown()
}

const selectNone = () => {
    if (props.disabled) return

    emit('update:modelValue', null)
    emit('change', null)
    emit('select', null)
    closeDropdown()
}

const clearSelection = (event: Event) => {
    event.stopPropagation()

    if (props.disabled) return

    emit('update:modelValue', null)
    emit('change', null)
    emit('select', null)
}

const applyFilter = (filterId: string) => {
    activeFilter.value = filterId
}

const navigateDown = () => {
    if (filteredCategories.value.length === 0) return

    focusedIndex.value = (focusedIndex.value + 1) % filteredCategories.value.length
    if (props.allowNone && focusedIndex.value === 0) {
        focusedIndex.value = 1
    }
}

const navigateUp = () => {
    if (filteredCategories.value.length === 0) return

    if (props.allowNone) {
        if (focusedIndex.value === -1) {
            focusedIndex.value = filteredCategories.value.length - 1
        } else if (focusedIndex.value === 0) {
            focusedIndex.value = -1
        } else {
            focusedIndex.value = (focusedIndex.value - 1) % filteredCategories.value.length
        }
    } else {
        focusedIndex.value = (focusedIndex.value - 1 + filteredCategories.value.length) % filteredCategories.value.length
    }
}

const selectFocused = () => {
    if (focusedIndex.value === -1 && props.allowNone) {
        selectNone()
    } else if (focusedIndex.value >= 0 && focusedIndex.value < filteredCategories.value.length) {
        selectCategory(filteredCategories.value[focusedIndex.value])
    }
}

const handleClickOutside = (event: Event) => {
    if (container.value && !container.value.contains(event.target as Node)) {
        closeDropdown()
    }
}

// Observateurs
watch(() => props.modelValue, (newValue) => {
    // Émettre l'événement change si la valeur change de l'extérieur
    if (newValue !== undefined) {
        emit('change', newValue)
    }
})

// Cycle de vie
onMounted(() => {
    loadCategories()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Courbes de Bézier personnalisées */
:deep() {
    --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
    --ease-out-custom: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ease-out-expo {
    transition-timing-function: var(--ease-out-expo);
}

.ease-out-custom {
    transition-timing-function: var(--ease-out-custom);
}

/* Animation d'apparition */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

/* Ombres organiques */
.shadow-soft-organic {
    box-shadow:
        0 2px 8px -1px rgba(0, 85, 0, 0.05),
        0 1px 4px -1px rgba(139, 195, 74, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.shadow-organic {
    box-shadow:
        0 4px 16px -2px rgba(0, 85, 0, 0.1),
        0 2px 8px -1px rgba(139, 195, 74, 0.08);
}

.shadow-organic-xl {
    box-shadow:
        0 20px 40px -10px rgba(0, 85, 0, 0.15),
        0 10px 20px -5px rgba(139, 195, 74, 0.1);
}

/* Scrollbar personnalisée */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 85, 0, 0.05);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #4ade80, #22c55e);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #22c55e, #16a34a);
}
</style>
