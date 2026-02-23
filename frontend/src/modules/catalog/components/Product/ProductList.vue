<template>
    <div class="product-list-wrapper">
        <!-- Texture d'arrière-plan organique -->
        <div class="organic-background"></div>
        <div class="leaf-floating-animation"></div>

        <!-- Header avec statistiques animées -->
        <header class="list-header animate-fade-in">
            <div class="header-content">
                <!-- Titre avec animation de croissance -->
                <div class="title-section">
                    <h1 class="main-title">
                        <span class="title-text">Notre Jardin Gourmand</span>
                        <span class="title-subtext animate-subtle-pulse">Des produits frais, locaux et de saison</span>
                    </h1>

                    <!-- Statistiques en direct -->
                    <div class="live-stats">
                        <div class="stat-item animate-float">
                            <div class="stat-icon">🌱</div>
                            <div class="stat-content">
                                <span class="stat-value">{{ formatNumber(totalProducts) }}</span>
                                <span class="stat-label">Produits frais</span>
                            </div>
                        </div>
                        <div class="stat-item animate-float" style="animation-delay: 0.2s">
                            <div class="stat-icon">👨‍🌾</div>
                            <div class="stat-content">
                                <span class="stat-value">{{ formatNumber(producersCount) }}</span>
                                <span class="stat-label">Producteurs locaux</span>
                            </div>
                        </div>
                        <div class="stat-item animate-float" style="animation-delay: 0.4s">
                            <div class="stat-icon">⭐</div>
                            <div class="stat-content">
                                <span class="stat-value">{{ featuredProductsCount }}</span>
                                <span class="stat-label">Coup de cœur</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions rapides -->
                <div class="action-section">
                    <button @click="showAddProduct" class="action-btn add-product-btn animate-gentle-glow">
                        <span class="btn-icon">+</span>
                        <span class="btn-text">Ajouter un produit</span>
                        <span class="btn-hint">Faire pousser</span>
                    </button>

                    <!-- Vue rapide toggle -->
                    <div class="view-toggle">
                        <button @click="toggleViewMode('grid')" class="view-btn"
                            :class="{ active: viewMode === 'grid' }" title="Vue grille">
                            <svg class="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button @click="toggleViewMode('list')" class="view-btn"
                            :class="{ active: viewMode === 'list' }" title="Vue liste">
                            <svg class="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Barre de filtres organique -->
        <div class="filters-section animate-slide-in-up">
            <div class="filters-container">
                <!-- Recherche avec animation -->
                <div class="search-group">
                    <div class="search-wrapper">
                        <input v-model="searchQuery" type="text" placeholder="Rechercher un produit, un producteur..."
                            class="search-input" @input="debouncedSearch" />
                        <div class="search-decoration"></div>
                        <button class="search-btn" @click="performSearch">
                            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                    <div class="search-hint animate-pulse-soft">
                        <span class="hint-icon">💡</span>
                        <span>Essayez "tomates bio" ou "fromage local"</span>
                    </div>
                </div>

                <!-- Filtres rapides -->
                <div class="quick-filters">
                    <div class="filters-scroll">
                        <button v-for="filter in quickFilters" :key="filter.id" @click="toggleQuickFilter(filter.id)"
                            class="quick-filter-btn" :class="{ active: activeQuickFilters.includes(filter.id) }"
                            :style="{ '--filter-color': filter.color }">
                            <span class="filter-icon">{{ filter.icon }}</span>
                            <span class="filter-label">{{ filter.label }}</span>
                            <span v-if="filter.count" class="filter-count">{{ filter.count }}</span>
                        </button>
                    </div>
                    <button @click="showAdvancedFilters = !showAdvancedFilters" class="advanced-filters-toggle"
                        :class="{ active: showAdvancedFilters }">
                        <span class="toggle-icon">{{ showAdvancedFilters ? '–' : '+' }}</span>
                        <span class="toggle-text">Filtres avancés</span>
                    </button>
                </div>

                <!-- Filtres avancés avec animation -->
                <transition name="slide-down">
                    <div v-if="showAdvancedFilters" class="advanced-filters">
                        <div class="filters-grid">
                            <!-- Catégorie -->
                            <div class="filter-group">
                                <label class="filter-label">🌿 Catégorie</label>
                                <CategorySelector v-model="filters.category_id"
                                    placeholder="Toutes les catégories..." />
                            </div>

                            <!-- Prix -->
                            <div class="filter-group">
                                <label class="filter-label">💰 Fourchette de prix</label>
                                <div class="price-range">
                                    <div class="range-inputs">
                                        <input v-model.number="filters.min_price" type="number" min="0"
                                            placeholder="Min" class="range-input" />
                                        <span class="range-separator">à</span>
                                        <input v-model.number="filters.max_price" type="number"
                                            :min="filters.min_price || 0" placeholder="Max" class="range-input" />
                                    </div>
                                    <div class="range-slider">
                                        <input type="range" :min="priceRange.min" :max="priceRange.max"
                                            :value="filters.min_price || priceRange.min" @input="updateMinPrice"
                                            class="slider" />
                                        <input type="range" :min="priceRange.min" :max="priceRange.max"
                                            :value="filters.max_price || priceRange.max" @input="updateMaxPrice"
                                            class="slider" />
                                    </div>
                                </div>
                            </div>

                            <!-- Stock -->
                            <div class="filter-group">
                                <label class="filter-label">📦 Disponibilité</label>
                                <div class="stock-filters">
                                    <label class="stock-filter">
                                        <input v-model="filters.in_stock" type="checkbox" class="filter-checkbox" />
                                        <span class="filter-text">En stock</span>
                                        <div class="filter-indicator stock"></div>
                                    </label>
                                    <label class="stock-filter">
                                        <input v-model="filters.low_stock" type="checkbox" class="filter-checkbox" />
                                        <span class="filter-text">Stock limité</span>
                                        <div class="filter-indicator low-stock"></div>
                                    </label>
                                    <label class="stock-filter">
                                        <input v-model="filters.out_of_stock" type="checkbox" class="filter-checkbox" />
                                        <span class="filter-text">Sur commande</span>
                                        <div class="filter-indicator out-of-stock"></div>
                                    </label>
                                </div>
                            </div>

                            <!-- Producteur -->
                            <div class="filter-group">
                                <label class="filter-label">👨‍🌾 Producteur</label>
                                <select v-model="filters.producer_id" class="producer-select">
                                    <option value="">Tous les producteurs</option>
                                    <option v-for="producer in producers" :key="producer.id" :value="producer.id">
                                        {{ producer.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Actions filtres -->
                            <div class="filter-actions">
                                <button @click="applyFilters" class="filter-action-btn apply-btn">
                                    <span class="action-icon">✓</span>
                                    <span>Appliquer</span>
                                </button>
                                <button @click="resetFilters" class="filter-action-btn reset-btn">
                                    <span class="action-icon">↺</span>
                                    <span>Réinitialiser</span>
                                </button>
                                <button @click="saveFilterPreset" class="filter-action-btn save-btn">
                                    <span class="action-icon">💾</span>
                                    <span>Sauvegarder</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- Contenu principal -->
        <main class="main-content">
            <!-- En-tête de liste -->
            <div class="list-controls animate-fade-in">
                <!-- Tri -->
                <div class="sort-controls">
                    <label class="sort-label">Trier par:</label>
                    <select v-model="sortBy" @change="applySorting" class="sort-select">
                        <option value="created_at">Date d'ajout</option>
                        <option value="price">Prix croissant</option>
                        <option value="-price">Prix décroissant</option>
                        <option value="name">Nom (A-Z)</option>
                        <option value="-name">Nom (Z-A)</option>
                        <option value="stock_quantity">Stock disponible</option>
                        <option value="rating">Note des clients</option>
                    </select>
                    <button @click="toggleSortDirection" class="sort-direction-btn"
                        :class="{ reversed: sortDirection === 'desc' }" title="Inverser l'ordre">
                        <svg class="direction-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                </div>

                <!-- Résultats -->
                <div class="results-info">
                    <span class="results-count">
                        {{ filteredProducts.length }} produit{{ filteredProducts.length !== 1 ? 's' : '' }} trouvé{{
                            filteredProducts.length !== 1 ? 's' : '' }}
                    </span>
                    <span v-if="hasActiveFilters" class="active-filters-badge">
                        Filtres actifs
                        <button @click="resetFilters" class="clear-filters-btn">✕</button>
                    </span>
                </div>

                <!-- Affichage -->
                <div class="display-controls">
                    <label class="display-label">Afficher:</label>
                    <select v-model="itemsPerPage" @change="updatePagination" class="display-select">
                        <option value="12">12 produits</option>
                        <option value="24">24 produits</option>
                        <option value="48">48 produits</option>
                        <option value="96">96 produits</option>
                    </select>
                </div>
            </div>

            <!-- État de chargement -->
            <div v-if="loading" class="loading-state">
                <div class="loading-animation">
                    <div class="loading-dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                    <p class="loading-text">Récolte des produits...</p>
                </div>
            </div>

            <!-- État vide -->
            <div v-else-if="!loading && products.length === 0" class="empty-state">
                <div class="empty-illustration">
                    <div class="empty-icon">🛒</div>
                    <svg class="empty-decoration" viewBox="0 0 200 100">
                        <path d="M20,50 Q50,20 80,50 T140,50" fill="none" stroke="currentColor" stroke-width="2"
                            opacity="0.2" />
                        <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.1" />
                        <circle cx="100" cy="50" r="8" fill="currentColor" opacity="0.1" />
                        <circle cx="150" cy="50" r="8" fill="currentColor" opacity="0.1" />
                    </svg>
                </div>
                <h3 class="empty-title">Le jardin est vide</h3>
                <p class="empty-description">
                    Aucun produit n'est disponible pour le moment. Soyez le premier à ajouter vos produits frais !
                </p>
                <button @click="showAddProduct" class="empty-action-btn">
                    <span class="btn-icon">🌱</span>
                    <span>Planter mon premier produit</span>
                </button>
            </div>

            <!-- État avec résultats -->
            <div v-else-if="!loading && products.length > 0" class="products-content">
                <!-- Vue grille -->
                <div v-if="viewMode === 'grid'" class="products-grid" :class="`grid-cols-${gridColumns}`">
                    <transition-group name="product-card" tag="div" class="grid-transition">
                        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product"
                            :view-mode="viewMode" @click="viewProduct(product)" @add-to-cart="addToCart"
                            @toggle-favorite="toggleFavorite" class="product-item" />
                    </transition-group>
                </div>

                <!-- Vue liste -->
                <div v-else class="products-list">
                    <div class="list-header-row">
                        <div class="header-cell">Produit</div>
                        <div class="header-cell">Catégorie</div>
                        <div class="header-cell">Prix</div>
                        <div class="header-cell">Stock</div>
                        <div class="header-cell">Statut</div>
                        <div class="header-cell">Actions</div>
                    </div>

                    <transition-group name="product-row" tag="div">
                        <ProductRow v-for="product in paginatedProducts" :key="product.id" :product="product"
                            @click="viewProduct(product)" @edit="editProduct(product)" @delete="deleteProduct(product)"
                            class="list-row-item" />
                    </transition-group>
                </div>

                <!-- Pagination organique -->
                <div v-if="totalPages > 1" class="pagination-wrapper">
                    <div class="pagination-container">
                        <!-- Page précédente -->
                        <button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn prev-btn">
                            <svg class="pagination-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Précédent</span>
                        </button>

                        <!-- Numéros de page -->
                        <div class="page-numbers">
                            <button v-for="page in visiblePages" :key="page"
                                @click="typeof page === 'number' ? goToPage(page) : null" class="page-number" :class="{
                                    'current': page === currentPage,
                                    'ellipsis': page === '...'
                                }" :disabled="page === '...'">
                                {{ page }}
                            </button>
                        </div>

                        <!-- Indicateur de page -->
                        <div class="page-info">
                            <span class="page-text">
                                Page {{ currentPage }} sur {{ totalPages }}
                            </span>
                            <span class="page-hint">
                                ({{ startItem }}-{{ endItem }} sur {{ totalProducts }} produits)
                            </span>
                        </div>

                        <!-- Page suivante -->
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="pagination-btn next-btn">
                            <span>Suivant</span>
                            <svg class="pagination-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Quick actions flottantes -->
            <div class="floating-actions">
                <button @click="scrollToTop" class="floating-action-btn scroll-top-btn"
                    :class="{ visible: showScrollTop }">
                    <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                </button>

                <button @click="exportProducts" class="floating-action-btn export-btn" title="Exporter la liste">
                    <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>

                <button @click="refreshProducts" class="floating-action-btn refresh-btn" title="Actualiser"
                    :class="{ rotating: isRefreshing }">
                    <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        </main>

        <!-- Panneau latéral des favoris -->
        <aside class="favorites-sidebar" :class="{ open: showFavorites }">
            <div class="sidebar-header">
                <h3 class="sidebar-title">
                    <span class="sidebar-icon">⭐</span>
                    Mes favoris
                    <span class="favorites-count">{{ favorites.length }}</span>
                </h3>
                <button @click="showFavorites = false" class="sidebar-close-btn">
                    ✕
                </button>
            </div>

            <div class="favorites-list">
                <div v-if="favorites.length === 0" class="empty-favorites">
                    <div class="empty-fav-icon">🤍</div>
                    <p>Ajoutez des produits à vos favoris</p>
                </div>

                <div v-else class="favorites-items">
                    <div v-for="fav in favorites" :key="fav.id" class="favorite-item" @click="viewProduct(fav)">
                        <img :src="getProductImage(fav)" :alt="fav.name" class="fav-image" />
                        <div class="fav-info">
                            <h4 class="fav-name">{{ fav.name }}</h4>
                            <p class="fav-price">{{ formatPrice(fav.price) }}</p>
                        </div>
                        <button @click.stop="toggleFavorite(fav)" class="remove-fav-btn" title="Retirer des favoris">
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            <button v-if="favorites.length > 0" @click="clearFavorites" class="clear-favorites-btn">
                Vider les favoris
            </button>
        </aside>

        <!-- Bouton favoris flottant -->
        <button @click="showFavorites = !showFavorites" class="floating-favorites-btn"
            :class="{ active: showFavorites }">
            <span class="fav-btn-icon">⭐</span>
            <span v-if="favorites.length > 0" class="fav-btn-count">
                {{ favorites.length }}
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/modules/catalog/store/modules/product.store'
import { useCategoryStore } from '@/modules/catalog/store/modules/category.store'
import ProductCard from './ProductCard.vue'
import ProductRow from './ProductRow.vue'
import CategorySelector from '../Category/CategorySelector.vue'

// Router et stores
const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

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

// États réactifs
const loading = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')
const gridColumns = ref(3)
const showAdvancedFilters = ref(false)
const showFavorites = ref(false)
const showScrollTop = ref(false)
const isRefreshing = ref(false)
const searchQuery = ref('')

// Filtres
const filters = reactive({
    category_id: null as string | null,
    min_price: null as number | null,
    max_price: null as number | null,
    in_stock: false,
    low_stock: false,
    out_of_stock: false,
    producer_id: null as string | null,
    tags: [] as string[]
})

// Tri et pagination
const sortBy = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Données
const products = computed(() => productStore.products as any[])
const favorites = ref<any[]>([])
const producers = ref([
    { id: '1', name: 'Ferme du Bonheur' },
    { id: '2', name: 'Jardins Bio' },
    { id: '3', name: 'Verger Traditionnel' },
    { id: '4', name: 'Maraîcher Local' }
])

// Filtres rapides
const quickFilters = ref([
    { id: 'bio', label: 'Bio', icon: '🌱', color: '#5a8c5a', count: 24 },
    { id: 'local', label: 'Local', icon: '📍', color: '#d2691e', count: 42 },
    { id: 'season', label: 'Saison', icon: '📅', color: '#dfba41', count: 18 },
    { id: 'promo', label: 'Promotions', icon: '🔥', color: '#e53e3e', count: 8 },
    { id: 'new', label: 'Nouveautés', icon: '🆕', color: '#3182ce', count: 12 },
    { id: 'best', label: 'Meilleurs', icon: '⭐', color: '#d69e2e', count: 15 },
    { id: 'limited', label: 'Stock limité', icon: '⚡', color: '#805ad5', count: 7 }
])

const activeQuickFilters = ref<string[]>([])

// Computed properties
const totalProducts = computed(() => products.value.length)
const producersCount = computed(() => producers.value.length)
const featuredProductsCount = computed(() =>
    products.value.filter(p => p.is_featured).length
)

const filteredProducts = computed(() => {
    let filtered = [...products.value]

    // Recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.origin?.toLowerCase().includes(query)
        )
    }

    // Filtres rapides
    if (activeQuickFilters.value.includes('bio')) {
        filtered = filtered.filter(p => p.tags?.some((t: any) => t.name === 'Bio'))
    }
    if (activeQuickFilters.value.includes('local')) {
        filtered = filtered.filter(p => p.origin?.includes('local'))
    }
    if (activeQuickFilters.value.includes('season')) {
        filtered = filtered.filter(p => p.tags?.some((t: any) => t.name === 'Saison'))
    }
    if (activeQuickFilters.value.includes('promo')) {
        filtered = filtered.filter(p => p.price < 10) // Exemple
    }
    if (activeQuickFilters.value.includes('new')) {
        filtered = filtered.filter(p => {
            const created = new Date(p.created_at)
            const now = new Date()
            const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24)
            return diffDays < 7
        })
    }
    if (activeQuickFilters.value.includes('best')) {
        filtered = filtered.filter(p => p.rating >= 4)
    }
    if (activeQuickFilters.value.includes('limited')) {
        filtered = filtered.filter(p => p.stock_quantity < 10)
    }

    // Filtres avancés
    if (filters.category_id) {
        filtered = filtered.filter(p => p.category_id === filters.category_id)
    }

    if (filters.min_price !== null) {
        filtered = filtered.filter(p => p.price >= filters.min_price!)
    }

    if (filters.max_price !== null) {
        filtered = filtered.filter(p => p.price <= filters.max_price!)
    }

    if (filters.in_stock) {
        filtered = filtered.filter(p => p.stock_quantity > 0)
    }

    if (filters.low_stock) {
        filtered = filtered.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10)
    }

    if (filters.out_of_stock) {
        filtered = filtered.filter(p => p.stock_quantity === 0)
    }

    if (filters.producer_id) {
        filtered = filtered.filter(p => p.producer_id === filters.producer_id)
    }

    return filtered
})

const sortedProducts = computed(() => {
    const sorted = [...filteredProducts.value]

    const [field, direction] = sortBy.value.startsWith('-')
        ? [sortBy.value.slice(1), 'desc']
        : [sortBy.value, 'asc']

    sorted.sort((a, b) => {
        let aVal = a[field]
        let bVal = b[field]

        if (field === 'price') {
            aVal = Number(aVal) || 0
            bVal = Number(bVal) || 0
        }

        if (field === 'name') {
            aVal = String(aVal || '').toLowerCase()
            bVal = String(bVal || '').toLowerCase()
        }

        if (aVal < bVal) return direction === 'asc' ? -1 : 1
        if (aVal > bVal) return direction === 'asc' ? 1 : -1
        return 0
    })

    return sorted
})

const priceRange = computed(() => ({
    min: 0,
    max: Math.max(...products.value.map(p => p.price), 100)
}))

const hasActiveFilters = computed(() => {
    return searchQuery.value ||
        activeQuickFilters.value.length > 0 ||
        filters.category_id !== null ||
        filters.min_price !== null ||
        filters.max_price !== null ||
        filters.in_stock ||
        filters.low_stock ||
        filters.out_of_stock ||
        filters.producer_id !== null
})

// Pagination
const totalPages = computed(() =>
    Math.ceil(sortedProducts.value.length / itemsPerPage.value)
)

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedProducts.value.slice(start, end)
})

const startItem = computed(() =>
    (currentPage.value - 1) * itemsPerPage.value + 1
)

const endItem = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, sortedProducts.value.length)
)

const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        pages.push(1)

        if (current > 3) {
            pages.push('...')
        }

        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            pages.push(i)
        }

        if (current < total - 2) {
            pages.push('...')
        }

        if (total > 1) {
            pages.push(total)
        }
    }

    return pages
})

// Méthodes
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(price)
}

const toggleViewMode = (mode: 'grid' | 'list') => {
    viewMode.value = mode
    localStorage.setItem('productListViewMode', mode)
}

const toggleQuickFilter = (filterId: string) => {
    const index = activeQuickFilters.value.indexOf(filterId)
    if (index === -1) {
        activeQuickFilters.value.push(filterId)
    } else {
        activeQuickFilters.value.splice(index, 1)
    }
    currentPage.value = 1
}

const debouncedSearch = debounce(() => {
    currentPage.value = 1
}, 300)

const performSearch = () => {
    currentPage.value = 1
}

const updateMinPrice = (event: Event) => {
    const target = event.target as HTMLInputElement
    filters.min_price = parseInt(target.value)
}

const updateMaxPrice = (event: Event) => {
    const target = event.target as HTMLInputElement
    filters.max_price = parseInt(target.value)
}

const applyFilters = () => {
    currentPage.value = 1
    showAdvancedFilters.value = false
}

const resetFilters = () => {
    searchQuery.value = ''
    activeQuickFilters.value = []
    Object.assign(filters, {
        category_id: null,
        min_price: null,
        max_price: null,
        in_stock: false,
        low_stock: false,
        out_of_stock: false,
        producer_id: null,
        tags: []
    })
    currentPage.value = 1
}

const saveFilterPreset = () => {
    // Implémenter la sauvegarde des filtres
    console.log('Sauvegarde des filtres', filters)
}

const applySorting = () => {
    currentPage.value = 1
}

const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    if (sortBy.value.startsWith('-')) {
        sortBy.value = sortBy.value.slice(1)
    } else {
        sortBy.value = '-' + sortBy.value
    }
}

const updatePagination = () => {
    currentPage.value = 1
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        scrollToProducts()
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        scrollToProducts()
    }
}

const goToPage = (page: number) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        scrollToProducts()
    }
}

const scrollToProducts = () => {
    const productsSection = document.querySelector('.products-content')
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const refreshProducts = async () => {
    isRefreshing.value = true
    try {
        await productStore.searchProducts()
    } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error)
    } finally {
        setTimeout(() => {
            isRefreshing.value = false
        }, 1000)
    }
}

const exportProducts = () => {
    // Implémenter l'export
    console.log('Export des produits')
}

const showAddProduct = () => {
    router.push('/catalog/products/new')
}

const viewProduct = (product: any) => {
    router.push(`/catalog/products/${product.id}`)
}

const editProduct = (product: any) => {
    router.push(`/catalog/products/${product.id}/edit`)
}

const deleteProduct = async (product: any) => {
    if (confirm(`Supprimer "${product.name}" ?`)) {
        try {
            await productStore.deleteProduct(product.id)
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
        }
    }
}

const addToCart = (product: any) => {
    console.log('Ajout au panier:', product)
    // Implémenter l'ajout au panier
}

const toggleFavorite = (product: any) => {
    const index = favorites.value.findIndex(f => f.id === product.id)
    if (index === -1) {
        favorites.value.push(product)
    } else {
        favorites.value.splice(index, 1)
    }
    localStorage.setItem('favoriteProducts', JSON.stringify(favorites.value))
}

const clearFavorites = () => {
    if (favorites.value.length > 0) {
        if (confirm('Vider tous les favoris ?')) {
            favorites.value = []
            localStorage.removeItem('favoriteProducts')
        }
    }
}

const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
        const primary = product.images.find((img: any) => img.is_primary)
        return primary?.url || product.images[0]?.url
    }
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f8f4e9"/%3E%3Cpath d="M80,70 Q100,50 120,70 T160,70" stroke="%23a7d397" stroke-width="3" fill="none"/%3E%3Ccircle cx="100" cy="90" r="20" fill="%235a8c5a"/%3E%3C/svg%3E'
}

const handleScroll = () => {
    showScrollTop.value = window.scrollY > 300
}

// Cycle de vie
onMounted(async () => {
    // Charger les produits
    loading.value = true
    try {
        await Promise.all([
            productStore.searchProducts(),
            categoryStore.fetchAllCategories()
        ])
    } catch (error) {
        console.error('Erreur lors du chargement:', error)
    } finally {
        loading.value = false
    }

    // Restaurer la vue
    const savedViewMode = localStorage.getItem('productListViewMode')
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
        viewMode.value = savedViewMode
    }

    // Restaurer les favoris
    const savedFavorites = localStorage.getItem('favoriteProducts')
    if (savedFavorites) {
        try {
            favorites.value = JSON.parse(savedFavorites)
        } catch (error) {
            console.error('Erreur lors du chargement des favoris:', error)
        }
    }

    // Écouter le scroll
    window.addEventListener('scroll', handleScroll)

    // Ajuster les colonnes en fonction de la largeur
    const updateGridColumns = () => {
        if (window.innerWidth < 640) gridColumns.value = 1
        else if (window.innerWidth < 1024) gridColumns.value = 2
        else gridColumns.value = 3
    }

    updateGridColumns()
    window.addEventListener('resize', updateGridColumns)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.product-list-wrapper {
    @apply relative min-h-screen bg-gradient-nature;
}

.organic-background {
    @apply absolute inset-0 bg-leaf-pattern opacity-5;
    animation: float-leaves 60s linear infinite;
}

.leaf-floating-animation {
    @apply absolute inset-0;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(167, 211, 151, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(198, 230, 179, 0.03) 0%, transparent 50%);
    animation: gentle-glow 8s ease-in-out infinite alternate;
}

/* Header styles */
.list-header {
    @apply relative z-10 py-6 px-4 md:px-8;
}

.header-content {
    @apply max-w-7xl mx-auto;
}

.title-section {
    @apply mb-6;
}

.main-title {
    @apply mb-4;
}

.title-text {
    @apply block text-3xl md:text-4xl font-bold text-forest-dark mb-2;
}

.title-subtext {
    @apply block text-lg text-green-medium italic;
}

.live-stats {
    @apply flex flex-wrap gap-4 mt-6;
}

.stat-item {
    @apply flex items-center gap-3 px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-green-light/30 shadow-soft;
}

.stat-icon {
    @apply text-2xl;
}

.stat-content {
    @apply flex flex-col;
}

.stat-value {
    @apply text-xl font-bold text-forest-dark;
}

.stat-label {
    @apply text-sm text-green-medium;
}

.action-section {
    @apply flex flex-wrap items-center justify-between gap-4 mt-6;
}

.action-btn {
    @apply flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-organic;
}

.add-product-btn {
    @apply bg-gradient-vert text-white shadow-organic hover:shadow-organic-hover hover:scale-105;
}

.btn-icon {
    @apply text-lg;
}

.btn-text {
    @apply font-semibold;
}

.btn-hint {
    @apply text-sm opacity-80;
}

.view-toggle {
    @apply flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-xl p-1;
}

.view-btn {
    @apply p-2 rounded-lg transition-all duration-300 ease-organic;
}

.view-btn.active {
    @apply bg-green-soft text-white;
}

.view-icon {
    @apply w-5 h-5;
}

/* Filters section */
.filters-section {
    @apply relative z-10 px-4 md:px-8 mb-8;
}

.filters-container {
    @apply max-w-7xl mx-auto;
}

.search-group {
    @apply mb-4;
}

.search-wrapper {
    @apply relative;
}

.search-input {
    @apply w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border-2 border-green-light/30 focus:border-green-soft focus:ring-2 focus:ring-green-soft/30 outline-none transition-all duration-300 ease-organic text-forest-dark placeholder-green-medium/60;
}

.search-decoration {
    @apply absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-green-soft/20;
}

.search-btn {
    @apply absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-green-medium hover:text-forest-dark transition-colors;
}

.search-icon {
    @apply w-5 h-5;
}

.search-hint {
    @apply flex items-center gap-2 mt-2 text-sm text-green-medium/70;
}

.hint-icon {
    @apply text-sm;
}

.quick-filters {
    @apply mb-4;
}

.filters-scroll {
    @apply flex gap-2 overflow-x-auto pb-2 scrollbar-hide;
}

.quick-filter-btn {
    @apply flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ease-organic whitespace-nowrap hover:scale-105;
}

.quick-filter-btn {
    border-color: var(--filter-color, #c6e6b3);
    background-color: rgba(var(--filter-color-rgb, 198 230 179), 0.1);
    color: var(--filter-color, #5a8c5a);
}

.quick-filter-btn.active {
    background-color: var(--filter-color);
    color: white;
}

.filter-icon {
    @apply text-sm;
}

.filter-label {
    @apply text-sm font-medium;
}

.filter-count {
    @apply text-xs px-1.5 py-0.5 rounded-full bg-white/30;
}

.advanced-filters-toggle {
    @apply flex items-center gap-2 mt-4 text-green-medium hover:text-forest-dark transition-colors duration-300;
}

.toggle-icon {
    @apply w-5 h-5 flex items-center justify-center rounded-full border border-green-light/30;
}

.advanced-filters-toggle.active .toggle-icon {
    @apply bg-green-soft text-white border-green-soft;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.advanced-filters {
    @apply mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-light/30 shadow-soft;
}

.filters-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}

.filter-group {
    @apply space-y-2;
}

.filter-label {
    @apply block text-sm font-medium text-forest-dark;
}

.price-range {
    @apply space-y-3;
}

.range-inputs {
    @apply flex items-center gap-2;
}

.range-input {
    @apply flex-1 px-3 py-2 rounded-lg border border-green-light/30 bg-white focus:border-green-soft focus:ring-1 focus:ring-green-soft/30 outline-none transition-all duration-300;
}

.range-separator {
    @apply text-green-medium;
}

.range-slider {
    @apply relative h-2;
}

.slider {
    @apply absolute w-full h-2 bg-green-light/20 rounded-full appearance-none pointer-events-auto;
}

.slider::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 rounded-full bg-green-soft cursor-pointer border-2 border-white shadow-organic;
}

.stock-filters {
    @apply space-y-2;
}

.stock-filter {
    @apply flex items-center gap-2 cursor-pointer;
}

.filter-checkbox {
    @apply sr-only;
}

.filter-text {
    @apply text-sm text-forest-dark;
}

.filter-indicator {
    @apply w-3 h-3 rounded-full;
}

.filter-indicator.stock {
    @apply bg-green-soft;
}

.filter-indicator.low-stock {
    @apply bg-terracotta;
}

.filter-indicator.out-of-stock {
    @apply bg-gray-400;
}

.producer-select {
    @apply w-full px-3 py-2 rounded-lg border border-green-light/30 bg-white focus:border-green-soft focus:ring-1 focus:ring-green-soft/30 outline-none transition-all duration-300 text-forest-dark;
}

.filter-actions {
    @apply flex gap-2;
}

.filter-action-btn {
    @apply flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-organic;
}

.apply-btn {
    @apply bg-green-soft text-white hover:bg-green-medium;
}

.reset-btn {
    @apply bg-terracotta-soft text-terracotta hover:bg-terracotta/10;
}

.save-btn {
    @apply bg-cream-medium text-forest-dark hover:bg-cream-dark;
}

/* Main content */
.main-content {
    @apply relative z-10 px-4 md:px-8 pb-20;
}

.list-controls {
    @apply flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-light/30;
}

.sort-controls,
.display-controls {
    @apply flex items-center gap-2;
}

.sort-label,
.display-label {
    @apply text-sm text-green-medium;
}

.sort-select,
.display-select {
    @apply px-3 py-2 rounded-lg border border-green-light/30 bg-white focus:border-green-soft focus:ring-1 focus:ring-green-soft/30 outline-none transition-all duration-300 text-forest-dark;
}

.sort-direction-btn {
    @apply p-2 rounded-lg border border-green-light/30 hover:border-green-soft hover:bg-green-soft/10 transition-all duration-300;
}

.sort-direction-btn.reversed .direction-icon {
    transform: rotate(180deg);
}

.direction-icon {
    @apply w-4 h-4 transition-transform duration-300;
}

.results-info {
    @apply flex items-center gap-3;
}

.results-count {
    @apply font-medium text-forest-dark;
}

.active-filters-badge {
    @apply flex items-center gap-1 px-2 py-1 bg-green-soft/20 text-green-medium text-sm rounded-full;
}

.clear-filters-btn {
    @apply w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors;
}

/* Loading state */
.loading-state {
    @apply flex items-center justify-center min-h-[400px];
}

.loading-animation {
    @apply text-center;
}

.loading-dots {
    @apply flex justify-center gap-2 mb-4;
}

.dot {
    @apply w-3 h-3 bg-green-soft rounded-full animate-bounce;
}

.dot:nth-child(2) {
    animation-delay: 0.1s;
}

.dot:nth-child(3) {
    animation-delay: 0.2s;
}

.dot:nth-child(4) {
    animation-delay: 0.3s;
}

.loading-text {
    @apply text-green-medium;
}

/* Empty state */
.empty-state {
    @apply flex flex-col items-center justify-center min-h-[400px] text-center;
}

.empty-illustration {
    @apply relative mb-6;
}

.empty-icon {
    @apply text-6xl mb-2;
}

.empty-decoration {
    @apply absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-16 text-green-light/30;
}

.empty-title {
    @apply text-2xl font-bold text-forest-dark mb-2;
}

.empty-description {
    @apply text-green-medium mb-6 max-w-md;
}

.empty-action-btn {
    @apply flex items-center gap-2 px-6 py-3 bg-gradient-vert text-white rounded-xl font-medium hover:shadow-organic-hover transition-all duration-300 ease-organic;
}

/* Products grid/list */
.products-grid {
    @apply grid gap-6 mb-8;
}

.grid-cols-1 {
    @apply grid-cols-1;
}

.grid-cols-2 {
    @apply grid-cols-1 sm:grid-cols-2;
}

.grid-cols-3 {
    @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
}

.grid-transition {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
}

.product-card-enter-active,
.product-card-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-card-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

.product-card-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
}

.product-card-leave-active {
    position: absolute;
}

.products-list {
    @apply mb-8;
}

.list-header-row {
    @apply grid grid-cols-12 gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-t-xl border-b border-green-light/30 font-medium text-green-medium text-sm;
}

.header-cell {
    @apply col-span-2;
}

.header-cell:first-child {
    @apply col-span-3;
}

.header-cell:last-child {
    @apply col-span-2;
}

.list-row-item {
    @apply transition-all duration-300 ease-organic;
}

.product-row-enter-active,
.product-row-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-row-enter-from,
.product-row-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

/* Pagination */
.pagination-wrapper {
    @apply mt-8;
}

.pagination-container {
    @apply flex flex-wrap items-center justify-between gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-light/30;
}

.pagination-btn {
    @apply flex items-center gap-2 px-4 py-2 rounded-lg border border-green-light/30 text-green-medium hover:border-green-soft hover:bg-green-soft/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-organic;
}

.page-numbers {
    @apply flex items-center gap-1;
}

.page-number {
    @apply w-8 h-8 flex items-center justify-center rounded-lg border border-green-light/30 text-green-medium hover:border-green-soft hover:bg-green-soft/10 transition-all duration-300 ease-organic;
}

.page-number.current {
    @apply bg-green-soft text-white border-green-soft;
}

.page-number.ellipsis {
    @apply border-none cursor-default hover:bg-transparent;
}

.page-info {
    @apply flex flex-col items-center;
}

.page-text {
    @apply font-medium text-forest-dark;
}

.page-hint {
    @apply text-sm text-green-medium/70;
}

/* Floating actions */
.floating-actions {
    @apply fixed right-4 bottom-24 flex flex-col gap-2 z-20;
}

.floating-action-btn {
    @apply w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-organic border border-green-light/30 text-green-medium hover:bg-green-soft hover:text-white transition-all duration-300 ease-organic;
}

.floating-action-btn.scroll-top-btn {
    @apply opacity-0 transform translate-y-10 transition-all duration-300;
}

.floating-action-btn.scroll-top-btn.visible {
    @apply opacity-100 transform translate-y-0;
}

.floating-action-btn.refresh-btn.rotating .action-icon {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Favorites sidebar */
.favorites-sidebar {
    @apply fixed right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md shadow-organic border-l border-green-light/30 transform translate-x-full transition-transform duration-500 ease-organic z-30;
}

.favorites-sidebar.open {
    @apply transform translate-x-0;
}

.sidebar-header {
    @apply flex items-center justify-between p-4 border-b border-green-light/30;
}

.sidebar-title {
    @apply flex items-center gap-2 font-bold text-forest-dark;
}

.sidebar-icon {
    @apply text-lg;
}

.favorites-count {
    @apply ml-2 px-2 py-0.5 bg-green-soft text-white text-xs rounded-full;
}

.sidebar-close-btn {
    @apply w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-soft/10 transition-colors;
}

.favorites-list {
    @apply flex-1 overflow-y-auto p-4;
}

.empty-favorites {
    @apply flex flex-col items-center justify-center h-64 text-center;
}

.empty-fav-icon {
    @apply text-4xl mb-4;
}

.favorites-items {
    @apply space-y-3;
}

.favorite-item {
    @apply flex items-center gap-3 p-3 rounded-lg hover:bg-green-soft/10 cursor-pointer transition-all duration-300 ease-organic;
}

.fav-image {
    @apply w-12 h-12 rounded-lg object-cover;
}

.fav-info {
    @apply flex-1;
}

.fav-name {
    @apply font-medium text-forest-dark text-sm line-clamp-1;
}

.fav-price {
    @apply text-sm text-green-medium;
}

.remove-fav-btn {
    @apply w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors;
}

.clear-favorites-btn {
    @apply w-full p-3 border-t border-green-light/30 text-terracotta hover:bg-terracotta/10 transition-colors;
}

/* Floating favorites button */
.floating-favorites-btn {
    @apply fixed right-4 bottom-4 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-vert text-white shadow-organic hover:shadow-organic-hover transition-all duration-300 ease-organic z-20;
}

.floating-favorites-btn.active {
    @apply bg-gradient-to-r from-green-medium to-forest-dark;
}

.fav-btn-count {
    @apply absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-terracotta rounded-full;
}

/* Responsive */
@media (max-width: 768px) {
    .grid-transition {
        @apply grid-cols-1;
    }

    .filters-grid {
        @apply grid-cols-1;
    }

    .list-controls {
        @apply flex-col items-stretch;
    }

    .favorites-sidebar {
        @apply w-full;
    }
}

/* Custom scrollbar */
.favorites-list::-webkit-scrollbar {
    width: 4px;
}

.favorites-list::-webkit-scrollbar-track {
    background: rgba(198, 230, 179, 0.1);
    border-radius: 2px;
}

.favorites-list::-webkit-scrollbar-thumb {
    background: var(--green-soft);
    border-radius: 2px;
}
</style>
