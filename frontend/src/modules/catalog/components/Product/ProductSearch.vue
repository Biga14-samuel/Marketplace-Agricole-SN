<template>
    <div class="product-search-page">
        <!-- Background avec texture africaine subtile -->
        <div class="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-emerald-50/60 to-amber-100/70 z-0">
            <div class="absolute inset-0 opacity-5 bg-repeat texture-pattern"></div>
        </div>

        <div class="relative z-10">
            <!-- En-tête inspiré des marchés camerounais -->
            <div class="mb-8 text-center">
                <div class="inline-block p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-amber-500/10 mb-4">
                    <div class="flex items-center justify-center space-x-3">
                        <MarketIcon class="w-8 h-8 text-emerald-600" />
                        <h1
                            class="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
                            Marché Local Fresh
                        </h1>
                        <LeafIcon class="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
                <p class="text-amber-800/70 text-lg max-w-2xl mx-auto">
                    Découvrez les trésors frais de nos producteurs locaux. Du cœur du Cameroun à votre table.
                </p>
            </div>

            <!-- Barre de recherche principale avec animation organique -->
            <div class="max-w-4xl mx-auto mb-10">
                <div class="relative group">
                    <!-- Animated background effect -->
                    <div
                        class="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 ease-organic">
                    </div>

                    <div
                        class="relative bg-white/90 backdrop-blur-sm rounded-xl border-2 border-emerald-200/50 shadow-lg overflow-hidden">
                        <div class="flex items-center px-4">
                            <SearchIcon class="w-6 h-6 text-emerald-600 ml-2" />
                            <input v-model="searchQuery" type="text"
                                placeholder="Rechercher des produits (ananas, plantain, ndolè, cacao, etc.)..."
                                class="flex-1 px-4 py-5 text-lg bg-transparent outline-none placeholder:text-amber-800/40"
                                @input="debouncedSearch" />
                            <div class="flex items-center space-x-2 pr-4">
                                <button @click="toggleAdvancedFilters"
                                    class="p-2 rounded-lg hover:bg-emerald-50 transition-all duration-300 ease-organic"
                                    :class="{ 'bg-emerald-50 text-emerald-700': showAdvancedFilters }">
                                    <FilterIcon class="w-5 h-5" />
                                </button>
                                <button @click="resetFilters"
                                    class="p-2 rounded-lg hover:bg-amber-50 transition-all duration-300 ease-organic">
                                    <RefreshCwIcon class="w-5 h-5 text-amber-600" />
                                </button>
                            </div>
                        </div>

                        <!-- Barre de filtre rapide -->
                        <div class="px-4 pb-4 border-t border-emerald-100/50 pt-3">
                            <div class="flex flex-wrap gap-2">
                                <button v-for="filter in quickFilters" :key="filter.id"
                                    @click="toggleQuickFilter(filter.id)"
                                    class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-organic transform hover:scale-105"
                                    :class="[
                                        activeQuickFilters.includes(filter.id)
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm'
                                            : 'bg-white/60 text-amber-800/70 border border-amber-200/50 hover:bg-amber-50/80'
                                    ]">
                                    <span class="flex items-center space-x-2">
                                        <component :is="filter.icon" class="w-4 h-4" />
                                        <span>{{ filter.label }}</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section principale avec filtres et résultats -->
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <!-- Panneau des filtres avancés -->
                    <Transition enter-active-class="transition-all duration-500 ease-organic"
                        enter-from-class="opacity-0 -translate-x-8" enter-to-class="opacity-100 translate-x-0"
                        leave-active-class="transition-all duration-300 ease-organic"
                        leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-8">
                        <div v-if="showAdvancedFilters" class="lg:col-span-1">
                            <div
                                class="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-amber-200/50 shadow-lg p-6 sticky top-6">
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="text-lg font-semibold text-emerald-800 flex items-center">
                                        <SlidersIcon class="w-5 h-5 mr-2" />
                                        Filtres Avancés
                                    </h3>
                                    <button @click="toggleAdvancedFilters"
                                        class="lg:hidden p-2 rounded-lg hover:bg-amber-50 transition-all duration-300 ease-organic">
                                        <XIcon class="w-5 h-5 text-amber-600" />
                                    </button>
                                </div>

                                <!-- Filtre par catégorie -->
                                <div class="mb-6">
                                    <h4 class="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                                        <LayersIcon class="w-4 h-4 mr-2" />
                                        Catégories
                                    </h4>
                                    <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                        <label v-for="category in categories" :key="category.id"
                                            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50/50 cursor-pointer transition-all duration-200 ease-organic">
                                            <input type="checkbox" :value="category.id"
                                                v-model="activeFilters.categories" @change="handleFilter"
                                                class="rounded text-emerald-600 focus:ring-emerald-500" />
                                            <span class="text-sm text-amber-800/80">{{ category.name }}</span>
                                            <span
                                                class="ml-auto text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                                {{ category.product_count || 0 }}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Filtre par prix -->
                                <div class="mb-6">
                                    <h4 class="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                                        <TagIcon class="w-4 h-4 mr-2" />
                                        Prix (FCFA)
                                    </h4>
                                    <div class="space-y-4">
                                        <div class="flex justify-between text-xs text-amber-600">
                                            <span>{{ formatPrice(minPrice) }}</span>
                                            <span>{{ formatPrice(maxPrice) }}</span>
                                        </div>
                                        <div class="space-y-3">
                                            <div class="flex items-center gap-3">
                                                <input type="number" v-model.number="priceRange[0]" :min="priceLimits.min"
                                                    :max="priceLimits.max"
                                                    class="w-24 px-2 py-1.5 text-xs border border-emerald-300/50 rounded-lg bg-white/70 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 ease-organic"
                                                    @change="handlePriceFilter('min')" />
                                                <span class="text-xs text-amber-600">à</span>
                                                <input type="number" v-model.number="priceRange[1]" :min="priceLimits.min"
                                                    :max="priceLimits.max"
                                                    class="w-24 px-2 py-1.5 text-xs border border-emerald-300/50 rounded-lg bg-white/70 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 ease-organic"
                                                    @change="handlePriceFilter('max')" />
                                            </div>
                                            <div class="relative h-2">
                                                <input type="range" v-model.number="priceRange[0]"
                                                    :min="priceLimits.min" :max="priceLimits.max" :step="100"
                                                    class="price-range-slider"
                                                    @input="handlePriceFilter('min')" />
                                                <input type="range" v-model.number="priceRange[1]"
                                                    :min="priceLimits.min" :max="priceLimits.max" :step="100"
                                                    class="price-range-slider"
                                                    @input="handlePriceFilter('max')" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Filtre par localité -->
                                <div class="mb-6">
                                    <h4 class="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                                        <MapPinIcon class="w-4 h-4 mr-2" />
                                        Région
                                    </h4>
                                    <select v-model="activeFilters.region" @change="handleFilter"
                                        class="w-full px-3 py-2 text-sm border border-amber-300/50 rounded-lg bg-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300 ease-organic">
                                        <option value="">Toutes les régions</option>
                                        <option v-for="region in cameroonRegions" :key="region" :value="region">
                                            {{ region }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Filtre par disponibilité -->
                                <div class="mb-6">
                                    <h4 class="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                                        <CalendarIcon class="w-4 h-4 mr-2" />
                                        Disponibilité
                                    </h4>
                                    <div class="space-y-2">
                                        <label
                                            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50/50 cursor-pointer">
                                            <input type="checkbox" v-model="activeFilters.inStock"
                                                @change="handleFilter"
                                                class="rounded text-emerald-600 focus:ring-emerald-500" />
                                            <span class="text-sm text-amber-800/80">En stock</span>
                                        </label>
                                        <label
                                            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50/50 cursor-pointer">
                                            <input type="checkbox" v-model="activeFilters.seasonal"
                                                @change="handleFilter"
                                                class="rounded text-emerald-600 focus:ring-emerald-500" />
                                            <span class="text-sm text-amber-800/80">Produits de saison</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Bouton appliquer filtres (mobile) -->
                                <button @click="applyFilters"
                                    class="lg:hidden w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200">
                                    Appliquer les filtres
                                </button>
                            </div>
                        </div>
                    </Transition>

                    <!-- Résultats de recherche -->
                    <div :class="showAdvancedFilters ? 'lg:col-span-3' : 'lg:col-span-4'">
                        <!-- En-tête des résultats -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div class="flex-1">
                                <div class="flex items-center flex-wrap gap-2">
                                    <span class="text-lg font-semibold text-emerald-800">
                                        {{ totalResults }} produits trouvés
                                    </span>
                                    <span v-if="searchQuery"
                                        class="text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-sm">
                                        "{{ searchQuery }}"
                                    </span>
                                    <span v-if="activeFilters.categories.length > 0"
                                        class="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-sm">
                                        {{ activeFilters.categories.length }} catégorie(s)
                                    </span>
                                </div>
                                <p class="text-sm text-amber-700/60 mt-1">
                                    Produits frais de nos producteurs partenaires
                                </p>
                            </div>

                            <div class="flex items-center space-x-4">
                                <!-- Toggle filtres avancés (mobile) -->
                                <button @click="toggleAdvancedFilters"
                                    class="lg:hidden p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-amber-200/50 hover:bg-amber-50/80 transition-all duration-300 ease-organic">
                                    <SlidersIcon class="w-5 h-5 text-amber-700" />
                                </button>

                                <!-- Tri -->
                                <div class="relative">
                                    <select v-model="sortBy" @change="handleSort"
                                        class="appearance-none pl-4 pr-10 py-2.5 text-sm border border-amber-300/50 rounded-xl bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300 ease-organic">
                                        <option value="name_asc">Nom (A → Z)</option>
                                        <option value="name_desc">Nom (Z → A)</option>
                                        <option value="price_asc">Prix croissant</option>
                                        <option value="price_desc">Prix décroissant</option>
                                        <option value="newest">Plus récent</option>
                                        <option value="featured">En vedette</option>
                                    </select>
                                    <ChevronDownIcon
                                        class="absolute right-3 top-3 w-4 h-4 text-amber-600 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <!-- État de chargement -->
                        <div v-if="loading" class="text-center py-20">
                            <div class="inline-block">
                                <div class="relative">
                                    <!-- Animation de chargement organique -->
                                    <div
                                        class="w-24 h-24 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin ease-organic">
                                    </div>
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <LeafIcon class="w-12 h-12 text-emerald-400 animate-pulse" />
                                    </div>
                                </div>
                                <p class="mt-4 text-amber-700/70 animate-pulse">
                                    Chargement des produits frais...
                                </p>
                            </div>
                        </div>

                        <!-- Aucun résultat -->
                        <div v-else-if="products.length === 0" class="text-center py-20">
                            <div class="max-w-md mx-auto">
                                <div class="relative w-32 h-32 mx-auto mb-6">
                                    <div
                                        class="absolute inset-0 bg-gradient-to-r from-emerald-100 to-amber-100 rounded-full opacity-60 animate-pulse">
                                    </div>
                                    <PackageXIcon class="relative w-full h-full text-amber-500 p-8" />
                                </div>
                                <h3 class="text-xl font-semibold text-amber-800 mb-2">
                                    Aucun produit trouvé
                                </h3>
                                <p class="text-amber-700/60 mb-6">
                                    Essayez de modifier vos critères de recherche ou explorez nos catégories
                                </p>
                                <button @click="resetFilters"
                                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-amber-200">
                                    <RefreshCwIcon class="w-4 h-4 mr-2" />
                                    Réinitialiser la recherche
                                </button>
                            </div>
                        </div>

                        <!-- Grille de produits -->
                        <TransitionGroup v-else tag="div"
                            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            enter-active-class="transition-all duration-500 ease-organic"
                            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                            leave-active-class="transition-all duration-300 ease-organic absolute"
                            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
                            move-class="transition-all duration-500 ease-organic">
                            <ProductCard v-for="product in products" :key="product.id" :product="product"
                                class="transform transition-all duration-300 ease-organic hover:scale-[1.02] hover:shadow-2xl"
                                @click="$router.push(`/catalog/products/${product.id}`)" />
                        </TransitionGroup>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="mt-12">
                            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div class="text-sm text-amber-700/60">
                                    Page {{ currentPage }} sur {{ totalPages }}
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button @click="prevPage" :disabled="currentPage === 1"
                                        class="p-3 rounded-xl border border-amber-300/50 hover:bg-amber-50/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-organic">
                                        <ChevronLeftIcon class="w-5 h-5 text-amber-700" />
                                    </button>

                                    <div class="flex items-center space-x-1">
                                        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                                            class="w-10 h-10 rounded-lg font-medium transition-all duration-300 ease-organic"
                                            :class="[
                                                page === currentPage
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200'
                                                    : 'text-amber-700 hover:bg-amber-50/80'
                                            ]">
                                            {{ page }}
                                        </button>
                                        <span v-if="showEllipsis" class="text-amber-400 px-2">...</span>
                                    </div>

                                    <button @click="nextPage" :disabled="currentPage === totalPages"
                                        class="p-3 rounded-xl border border-amber-300/50 hover:bg-amber-50/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-organic">
                                        <ChevronRightIcon class="w-5 h-5 text-amber-700" />
                                    </button>
                                </div>

                                <div class="text-sm text-amber-700/60">
                                    {{ totalResults }} produits au total
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bannière de saison (typique au Cameroun) -->
            <div class="mt-16 max-w-7xl mx-auto px-4">
                <div
                    class="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 rounded-2xl p-8 relative overflow-hidden">
                    <!-- Texture de feuilles -->
                    <div class="absolute inset-0 opacity-5">
                        <div class="absolute top-4 left-4 w-32 h-32 bg-emerald-300 rounded-full"></div>
                        <div class="absolute bottom-4 right-4 w-24 h-24 bg-amber-300 rounded-full"></div>
                    </div>

                    <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-3">
                                <CalendarIcon class="w-8 h-8 text-emerald-600" />
                                <h3 class="text-xl font-bold text-emerald-800">
                                    Produits de Saison au Cameroun
                                </h3>
                            </div>
                            <p class="text-amber-800/70 mb-4">
                                Découvrez les produits frais qui sont en pleine saison en ce moment.
                                Profitez de la meilleure qualité et des prix les plus avantageux.
                            </p>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    class="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                    🥭 Mangues
                                </span>
                                <span class="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                    🍌 Plantains
                                </span>
                                <span
                                    class="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                    🍍 Ananas
                                </span>
                                <span class="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                    🥬 Salade
                                </span>
                            </div>
                        </div>
                        <button @click="viewSeasonalProducts"
                            class="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200 whitespace-nowrap">
                            Voir les produits de saison
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProductStore } from '@/modules/catalog/store/modules/product.store'
import { useCategoryStore } from '@/modules/catalog/store/modules/category.store'
import { createEmojiIcon } from '@/shared/components/icons/emoji'

// Composants
import ProductCard from '@/modules/catalog/components/Product/ProductCard.vue'

// Icons (emoji fallback)
const SearchIcon = createEmojiIcon('🔍', 'Search')
const FilterIcon = createEmojiIcon('🎛️', 'Filter')
const RefreshCwIcon = createEmojiIcon('🔄', 'Refresh')
const SlidersIcon = createEmojiIcon('🎚️', 'Sliders')
const XIcon = createEmojiIcon('✕', 'Close')
const LayersIcon = createEmojiIcon('🗂️', 'Layers')
const TagIcon = createEmojiIcon('🏷️', 'Tag')
const MapPinIcon = createEmojiIcon('📍', 'MapPin')
const CalendarIcon = createEmojiIcon('📅', 'Calendar')
const ChevronDownIcon = createEmojiIcon('▼', 'ChevronDown')
const ChevronLeftIcon = createEmojiIcon('◀', 'ChevronLeft')
const ChevronRightIcon = createEmojiIcon('▶', 'ChevronRight')
const PackageXIcon = createEmojiIcon('📦', 'PackageX')
const LeafIcon = createEmojiIcon('🍃', 'Leaf')
const StarIcon = createEmojiIcon('⭐', 'Star')
const FlameIcon = createEmojiIcon('🔥', 'Flame')
const SproutIcon = createEmojiIcon('🌱', 'Sprout')
const ShieldIcon = createEmojiIcon('🛡️', 'Shield')
const ClockIcon = createEmojiIcon('⏰', 'Clock')
const TrendingUpIcon = createEmojiIcon('📈', 'TrendingUp')
const MarketIcon = createEmojiIcon('🏪', 'Market')

// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// États réactifs
const searchQuery = ref('')
const showAdvancedFilters = ref(false)
const sortBy = ref('newest')
const currentPage = ref(1)
const loading = ref(false)
const priceRange = ref<[number, number]>([0, 50000]) // FCFA
const priceLimits = { min: 0, max: 100000 }

// Filtres rapides typiques au Cameroun
const quickFilters = ref([
    { id: 'bio', label: '🌿 Bio & Naturel', icon: SproutIcon },
    { id: 'local', label: '📍 Local', icon: MapPinIcon },
    { id: 'fresh', label: '🥬 Très Frais', icon: LeafIcon },
    { id: 'trending', label: '🔥 Populaire', icon: FlameIcon },
    { id: 'featured', label: '⭐ En Vedette', icon: StarIcon },
    { id: 'new', label: '🆕 Nouveau', icon: TrendingUpIcon }
])

const activeQuickFilters = ref<string[]>([])

// Filtres avancés
const activeFilters = ref({
    categories: [] as string[],
    region: '',
    inStock: false,
    seasonal: false
})

// Données pour les filtres
const cameroonRegions = ref([
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord',
    'Littoral', 'Nord', 'Nord-Ouest', 'Ouest',
    'Sud', 'Sud-Ouest'
])

// Données calculées
const products = computed(() => productStore.products)
const categories = computed(() => categoryStore.categories)
const totalResults = computed(() => productStore.searchResults.total)
const totalPages = computed(() =>
    productStore.searchResults.total_pages ||
    Math.ceil(totalResults.value / Math.max(1, productStore.searchResults.limit || 1))
)
const minPrice = computed(() => priceRange.value[0])
const maxPrice = computed(() => priceRange.value[1])

// Formatage des prix en FCFA
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF'
    }).format(price)
}

// Utilitaire debounce (sans dépendance externe)
const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 300) => {
    let timer: number | undefined
    return (...args: Parameters<T>) => {
        if (timer !== undefined) {
            window.clearTimeout(timer)
        }
        timer = window.setTimeout(() => fn(...args), wait)
    }
}

// Recherche avec debounce
const debouncedSearch = debounce(() => {
    void performSearch()
}, 500)

// Gestion des filtres rapides
const toggleQuickFilter = (filterId: string) => {
    const index = activeQuickFilters.value.indexOf(filterId)
    if (index > -1) {
        activeQuickFilters.value.splice(index, 1)
    } else {
        activeQuickFilters.value.push(filterId)
    }
    performSearch()
}

// Gestion des filtres avancés
const handleFilter = () => {
    currentPage.value = 1
    performSearch()
}

const handlePriceFilter = (changed?: 'min' | 'max') => {
    let [min, max] = priceRange.value

    if (changed === 'min' && min > max) {
        min = max
    } else if (changed === 'max' && max < min) {
        max = min
    }

    min = Math.max(priceLimits.min, Math.min(min, priceLimits.max))
    max = Math.max(min, Math.min(max, priceLimits.max))

    priceRange.value = [min, max]
    handleFilter()
}

const handleSort = () => {
    performSearch()
}

// Réinitialisation des filtres
const resetFilters = () => {
    searchQuery.value = ''
    activeFilters.value = {
        categories: [],
        region: '',
        inStock: false,
        seasonal: false
    }
    activeQuickFilters.value = []
    priceRange.value = [0, 50000]
    currentPage.value = 1
    performSearch()
}

// Pagination
const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

const showEllipsis = computed(() => totalPages.value > visiblePages.value.length)

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        performSearch()
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        performSearch()
    }
}

const goToPage = (page: number) => {
    currentPage.value = page
    performSearch()
}

// Recherche principale
const performSearch = async () => {
    loading.value = true

    try {
        const sortMap: Record<string, { sort_by: 'name' | 'price' | 'created_at'; sort_order: 'asc' | 'desc' }> = {
            name_asc: { sort_by: 'name', sort_order: 'asc' },
            name_desc: { sort_by: 'name', sort_order: 'desc' },
            price_asc: { sort_by: 'price', sort_order: 'asc' },
            price_desc: { sort_by: 'price', sort_order: 'desc' },
            newest: { sort_by: 'created_at', sort_order: 'desc' },
            featured: { sort_by: 'created_at', sort_order: 'desc' }
        }

        const sortConfig = sortMap[sortBy.value] || sortMap.newest

        const filters: any = {
            search: searchQuery.value || undefined,
            page: currentPage.value,
            limit: productStore.searchResults.limit || 20,
            min_price: priceRange.value[0],
            max_price: priceRange.value[1],
            in_stock: activeFilters.value.inStock || undefined,
            sort_by: sortConfig.sort_by,
            sort_order: sortConfig.sort_order
        }

        if (activeFilters.value.categories.length === 1) {
            filters.category_id = activeFilters.value.categories[0]
        }

        // Ajouter les filtres rapides
        const quickTags: string[] = []
        if (activeQuickFilters.value.includes('bio')) quickTags.push('bio')
        if (activeQuickFilters.value.includes('local')) quickTags.push('local')
        if (activeQuickFilters.value.includes('fresh')) quickTags.push('fresh')
        if (activeQuickFilters.value.includes('featured')) quickTags.push('featured')
        if (activeQuickFilters.value.includes('new')) quickTags.push('new')
        if (quickTags.length > 0) {
            filters.tags = quickTags
        }

        await productStore.searchProducts(filters)
    } catch (error) {
        console.error('Erreur lors de la recherche:', error)
    } finally {
        loading.value = false
    }
}

// Toggle filtres avancés
const toggleAdvancedFilters = () => {
    showAdvancedFilters.value = !showAdvancedFilters.value
}

// Appliquer les filtres (pour mobile)
const applyFilters = () => {
    performSearch()
    showAdvancedFilters.value = false
}

// Voir les produits de saison
const viewSeasonalProducts = () => {
    activeFilters.value.seasonal = true
    performSearch()
}

// Initialisation
onMounted(async () => {
    await categoryStore.fetchAllCategories()
    await performSearch()
})

// Watchers
watch(() => activeFilters.value.categories, handleFilter)
watch(() => activeFilters.value.region, handleFilter)
watch(() => activeFilters.value.inStock, handleFilter)
watch(() => activeFilters.value.seasonal, handleFilter)
</script>

<style scoped>
/* Animation organique personnalisée */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sliders natifs */
.price-range-slider {
    @apply absolute w-full h-2 appearance-none rounded-full bg-amber-100;
    pointer-events: auto;
}

.price-range-slider::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md;
}

.price-range-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: #10b981;
    border: 2px solid #ffffff;
}

/* Animation de feuilles flottantes en arrière-plan */
@keyframes float-leaf {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

.leaf-float {
    animation: float-leaf 8s ease-in-out infinite;
}

/* Animation de pulsation organique */
@keyframes organic-pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }
}

.organic-pulse {
    animation: organic-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Dégradé texturé */
.textured-gradient {
    background: linear-gradient(135deg,
            rgba(245, 243, 235, 0.9) 0%,
            rgba(236, 252, 243, 0.9) 25%,
            rgba(254, 243, 199, 0.9) 50%,
            rgba(230, 249, 238, 0.9) 75%,
            rgba(245, 243, 235, 0.9) 100%);
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* Texture pattern for background */
.texture-pattern {
    background-image: url('data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 20 C50 10, 70 30, 80 50 C60 70, 30 60, 20 40 C10 20, 40 10, 60 20 C80 30, 90 60, 70 80 C50 90, 20 80, 10 60" fill="none" stroke="%23000" stroke-width="0.5"/%3E%3C/svg%3E');
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(254, 243, 199, 0.3);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #10b981, #f59e0b);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #059669, #d97706);
}

/* Effet de lumière sur les cartes */
.product-card-hover {
    position: relative;
    overflow: hidden;
}

.product-card-hover::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card-hover:hover::before {
    opacity: 1;
}
</style>
