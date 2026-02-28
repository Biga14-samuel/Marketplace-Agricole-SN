<template>
    <div class="min-h-screen relative overflow-hidden">
        <!-- Texture de fond organique pour producteur -->
        <div class="absolute inset-0 z-0">
            <!-- Dégradé naturel agricole -->
            <div class="absolute inset-0 bg-gradient-to-br from-forest-green/10 via-cream-light/15 to-terracotta/8">
            </div>

            <!-- Filigranes agricoles -->
            <div class="absolute inset-0 opacity-[0.015]">
                <div class="absolute top-20 left-10 w-72 h-72" v-html="fieldPattern"></div>
                <div class="absolute bottom-20 right-10 w-64 h-64" v-html="harvestPattern"></div>
                <div class="absolute top-1/2 left-1/3 w-56 h-56" v-html="toolPattern"></div>
            </div>

            <!-- Texture papier de terroir -->
            <div class="absolute inset-0"
                style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,139,34,0.03) 2px, rgba(34,139,34,0.03) 4px);">
            </div>
        </div>

        <!-- Animation d'ambiance - Graines qui tombent -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div class="seed seed-1">🌱</div>
            <div class="seed seed-2">🍃</div>
            <div class="seed seed-3">🌿</div>
            <div class="seed seed-4">🌾</div>
            <div class="seed seed-5">🥕</div>
        </div>

        <!-- Contenu principal -->
        <div class="relative z-10">
            <!-- Navigation producteur avec effet de profondeur -->
            <header class="pt-8 px-6">
                <div class="max-w-7xl mx-auto">
                    <div
                        class="flex justify-between items-center backdrop-blur-sm bg-white/40 rounded-3xl p-4 border border-white/20 shadow-sm">
                        <!-- Logo et identité producteur -->
                        <div class="flex items-center space-x-4">
                            <div class="relative group">
                                <div
                                    class="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-green to-terracotta p-0.5 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                                    <div
                                        class="w-full h-full rounded-2xl bg-cream-light flex items-center justify-center">
                                        <span
                                            class="text-2xl font-serif text-forest-green transition-transform duration-700 group-hover:rotate-12">👨‍🌾</span>
                                    </div>
                                </div>
                                <div
                                    class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-terracotta/30 backdrop-blur-sm border border-white/30 animate-pulse">
                                </div>
                            </div>
                            <div>
                                <h1 class="text-2xl font-serif font-bold text-forest-green">Mon Espace Producteur</h1>
                                <p class="text-sm text-nature-gray mt-1">Bienvenue, {{ producerName }} 👋</p>
                            </div>
                        </div>

                        <!-- Navigation principale -->
                        <nav class="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full">
                            <router-link to="/producer/dashboard"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300 text-sm px-4 py-2 rounded-full hover:bg-white/50">
                                Dashboard
                            </router-link>
                            <router-link to="/producer/products"
                                class="bg-forest-green/10 text-forest-green font-medium text-sm px-4 py-2 rounded-full">
                                Mes Produits
                            </router-link>
                            <router-link to="/producer/orders"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300 text-sm px-4 py-2 rounded-full hover:bg-white/50">
                                Commandes
                            </router-link>
                            <router-link to="/producer/stats"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300 text-sm px-4 py-2 rounded-full hover:bg-white/50">
                                Statistiques
                            </router-link>
                        </nav>

                        <!-- Actions rapides -->
                        <div class="flex items-center space-x-3">
                            <button class="relative group" @click="showNotifications">
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-white/80 backdrop-blur-sm border border-forest-green/10 flex items-center justify-center text-forest-green shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-110">
                                    <span class="text-xl">🔔</span>
                                    <span v-if="unreadNotifications"
                                        class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-terracotta text-white text-xs flex items-center justify-center">
                                        {{ unreadNotifications }}
                                    </span>
                                </div>
                            </button>
                            <button @click="showAddProductModal" class="btn-primary px-6 py-3">
                                <span class="flex items-center space-x-2">
                                    <span>➕</span>
                                    <span>Nouveau produit</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Contenu principal -->
            <main class="py-8 px-6">
                <div class="max-w-7xl mx-auto">
                    <!-- En-tête avec statistiques -->
                    <div class="mb-8 animate-slide-up">
                        <div class="flex justify-between items-center mb-8">
                            <div>
                                <h2 class="text-3xl font-serif font-bold text-forest-green mb-2">Mes Produits</h2>
                                <p class="text-nature-gray">Gérez votre catalogue et suivez vos ventes</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="text-right">
                                    <div class="text-sm text-nature-gray">Chiffre d'affaires du mois</div>
                                    <div class="text-2xl font-bold text-forest-green">{{ formatXaf(Number(monthlyRevenue)) }}</div>
                                </div>
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-green/10 to-terracotta/10 flex items-center justify-center text-forest-green">
                                    <span class="text-xl">💰</span>
                                </div>
                            </div>
                        </div>

                        <!-- Statistiques rapides -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div class="stat-card stat-total">
                                <div class="stat-icon">📦</div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ totalProducts }}</div>
                                    <div class="stat-label">Produits au catalogue</div>
                                </div>
                            </div>
                            <div class="stat-card stat-active">
                                <div class="stat-icon">✅</div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ activeProducts }}</div>
                                    <div class="stat-label">Produits actifs</div>
                                </div>
                            </div>
                            <div class="stat-card stat-low">
                                <div class="stat-icon">⚠️</div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ lowStockProducts }}</div>
                                    <div class="stat-label">Stocks critiques</div>
                                </div>
                            </div>
                            <div class="stat-card stat-out">
                                <div class="stat-icon">❌</div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ outOfStockProducts }}</div>
                                    <div class="stat-label">Ruptures</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Barre de contrôle -->
                    <div class="mb-8 animate-slide-up" style="animation-delay: 0.1s">
                        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green/10">
                            <div
                                class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                <!-- Filtres -->
                                <div class="flex flex-wrap gap-3">
                                    <button v-for="filter in filters" :key="filter.id" @click="toggleFilter(filter.id)"
                                        :class="[
                                            'filter-btn',
                                            activeFilters.includes(filter.id) ? 'filter-btn-active' : 'filter-btn-inactive'
                                        ]">
                                        <span class="filter-btn-content">
                                            <span>{{ filter.icon }}</span>
                                            <span>{{ filter.label }}</span>
                                            <span v-if="filter.count" class="filter-count">{{ filter.count }}</span>
                                        </span>
                                    </button>
                                </div>

                                <!-- Recherche et tri -->
                                <div class="flex items-center space-x-4">
                                    <div class="relative">
                                        <input v-model="searchQuery" type="text" placeholder="Rechercher un produit..."
                                            class="search-input pl-10 pr-4 py-2" />
                                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <span class="text-forest-green/60">🔍</span>
                                        </div>
                                    </div>
                                    <select v-model="sortBy" class="select-input">
                                        <option value="name">Nom (A-Z)</option>
                                        <option value="price">Prix (croissant)</option>
                                        <option value="stock">Stock (décroissant)</option>
                                        <option value="sales">Ventes (décroissant)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Liste des produits -->
                    <div class="animate-slide-up" style="animation-delay: 0.2s">
                        <!-- En-tête de liste -->
                        <div class="grid grid-cols-12 gap-4 mb-4 px-4 text-sm font-medium text-nature-gray">
                            <div class="col-span-5">Produit</div>
                            <div class="col-span-2 text-center">Prix</div>
                            <div class="col-span-2 text-center">Stock</div>
                            <div class="col-span-2 text-center">Statut</div>
                            <div class="col-span-1 text-center">Actions</div>
                        </div>

                        <!-- Liste -->
                        <div class="space-y-3">
                            <transition-group name="product-list">
                                <div v-for="(product, index) in filteredProducts" :key="product.id"
                                    class="product-card animate-slide-up"
                                    :style="`animation-delay: ${0.3 + index * 0.05}s`">
                                    <!-- Informations produit -->
                                    <div class="grid grid-cols-12 gap-4 items-center">
                                        <!-- Colonne Produit -->
                                        <div class="col-span-5">
                                            <div class="flex items-center space-x-4">
                                                <div class="product-image-wrapper">
                                                    <img :src="product.image" :alt="product.name"
                                                        class="product-image" />
                                                    <div v-if="product.isBio" class="product-badge bio">🌿</div>
                                                    <div v-if="product.isSeasonal" class="product-badge seasonal">🌸
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 class="product-name">{{ product.name }}</h3>
                                                    <p class="product-category">{{ product.category }}</p>
                                                    <div class="flex items-center space-x-2 mt-1">
                                                        <span class="product-sales">
                                                            <span class="sales-icon">📈</span>
                                                            <span>{{ product.sales }} ventes</span>
                                                        </span>
                                                        <span class="product-rating">
                                                            <span class="rating-icon">⭐</span>
                                                            <span>{{ product.rating }}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Colonne Prix -->
                                        <div class="col-span-2 text-center">
                                            <div class="product-price">{{ formatXaf(product.price) }}</div>
                                            <div class="text-xs text-nature-gray mt-1">{{ product.unit }}</div>
                                        </div>

                                        <!-- Colonne Stock -->
                                        <div class="col-span-2">
                                            <div class="stock-indicator" :class="getStockClass(product.stock)">
                                                <div class="stock-bar"
                                                    :style="{ width: `${(product.stock / product.maxStock) * 100}%` }">
                                                </div>
                                                <div class="stock-text">
                                                    {{ product.stock }} / {{ product.maxStock }}
                                                </div>
                                            </div>
                                            <div class="text-xs text-center text-nature-gray mt-2">
                                                {{ getStockMessage(product.stock, product.maxStock) }}
                                            </div>
                                        </div>

                                        <!-- Colonne Statut -->
                                        <div class="col-span-2 text-center">
                                            <div class="inline-flex items-center">
                                                <label class="switch">
                                                    <input type="checkbox" :checked="product.isActive"
                                                        @change="toggleProductStatus(product)" />
                                                    <span class="slider"></span>
                                                </label>
                                                <span class="ml-3 status-label"
                                                    :class="product.isActive ? 'status-active' : 'status-inactive'">
                                                    {{ product.isActive ? 'En ligne' : 'Hors ligne' }}
                                                </span>
                                            </div>
                                            <div v-if="product.lastUpdate" class="text-xs text-nature-gray mt-1">
                                                Mis à jour {{ product.lastUpdate }}
                                            </div>
                                        </div>

                                        <!-- Colonne Actions -->
                                        <div class="col-span-1 text-center">
                                            <div class="flex justify-center space-x-2">
                                                <button @click="editProduct(product)" class="action-btn edit-btn"
                                                    title="Modifier">
                                                    ✏️
                                                </button>
                                                <button @click="duplicateProduct(product)"
                                                    class="action-btn duplicate-btn" title="Dupliquer">
                                                    📋
                                                </button>
                                                <button @click="confirmDelete(product)" class="action-btn delete-btn"
                                                    title="Supprimer">
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Détails supplémentaires (expandable) -->
                                    <div v-if="expandedProduct === product.id"
                                        class="mt-4 pt-4 border-t border-forest-green/10">
                                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div class="detail-item">
                                                <div class="detail-label">Ventes ce mois</div>
                                                <div class="detail-value">{{ product.monthlySales }} unités</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Revenus totaux</div>
                                                <div class="detail-value">{{ formatXaf(product.totalRevenue) }}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Taux de conversion</div>
                                                <div class="detail-value">{{ product.conversionRate }}%</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Note moyenne</div>
                                                <div class="detail-value">{{ product.rating }}/5 ({{ product.reviewCount
                                                }} avis)</div>
                                            </div>
                                        </div>
                                        <div class="flex justify-end space-x-3 mt-4">
                                            <button @click="viewProductStats(product)"
                                                class="btn-secondary px-4 py-2 text-sm">
                                                Voir les statistiques
                                            </button>
                                            <button @click="manageStock(product)" class="btn-primary px-4 py-2 text-sm">
                                                Gérer le stock
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </transition-group>

                            <!-- État vide -->
                            <div v-if="filteredProducts.length === 0" class="empty-state animate-slide-up">
                                <div class="empty-icon">📦</div>
                                <h3 class="empty-title">Aucun produit trouvé</h3>
                                <p class="empty-description">
                                    {{ searchQuery ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par ajouter votre premier produit.' }}
                                </p>
                                <button @click="showAddProductModal" class="btn-primary mt-6 px-8 py-3">
                                    <span class="flex items-center space-x-2">
                                        <span>➕</span>
                                        <span>Ajouter un produit</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div v-if="filteredProducts.length > 0" class="mt-8 flex justify-center">
                            <div class="pagination">
                                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn prev">
                                    ← Précédent
                                </button>
                                <div class="pagination-numbers">
                                    <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                                        'pagination-number',
                                        currentPage === page ? 'pagination-active' : ''
                                    ]">
                                        {{ page }}
                                    </button>
                                </div>
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="pagination-btn next">
                                    Suivant →
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Section insights -->
                    <div class="mt-12 animate-slide-up" style="animation-delay: 0.4s">
                        <div class="insights-section">
                            <h3 class="section-title">💡 Insights et recommandations</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="insight-card">
                                    <div class="insight-icon">📈</div>
                                    <h4 class="insight-title">Produits performants</h4>
                                    <p class="insight-description">
                                        {{ topPerformingProducts.length }} produits génèrent 80% de vos revenus
                                    </p>
                                    <div class="mt-4 space-y-2">
                                        <div v-for="product in topPerformingProducts.slice(0, 3)" :key="product.id"
                                            class="insight-item">
                                            <span class="insight-item-name">{{ product.name }}</span>
                                            <span class="insight-item-value">{{ formatXaf(product.totalRevenue) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="insight-card">
                                    <div class="insight-icon">⚠️</div>
                                    <h4 class="insight-title">Attention requise</h4>
                                    <p class="insight-description">
                                        {{ lowStockProducts }} produits ont un stock critique
                                    </p>
                                    <div class="mt-4 space-y-2">
                                        <div v-for="product in criticalStockProducts.slice(0, 3)" :key="product.id"
                                            class="insight-item">
                                            <span class="insight-item-name">{{ product.name }}</span>
                                            <span class="insight-item-value">{{ product.stock }} restants</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="insight-card">
                                    <div class="insight-icon">🎯</div>
                                    <h4 class="insight-title">Optimisation</h4>
                                    <p class="insight-description">
                                        Améliorez vos photos pour augmenter les conversions
                                    </p>
                                    <div class="mt-4">
                                        <button @click="showOptimizationTips" class="btn-secondary w-full">
                                            Voir les conseils
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Modal d'ajout/modification de produit -->
        <transition name="product-modal">
            <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeProductModal"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">{{ modalMode === 'add' ? 'Ajouter un produit' : 'Modifier le produit' }}
                        </h3>
                        <button @click="closeProductModal" class="modal-close">✕</button>
                    </div>
                    <div class="modal-body">
                        <ProductForm v-if="showProductModal" :product="editingProduct" :mode="modalMode"
                            @submit="handleProductSubmit" @cancel="closeProductModal" />
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal de suppression -->
        <transition name="confirm-modal">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="cancelDelete"></div>
                <div class="confirm-modal-content">
                    <div class="confirm-modal-icon">🗑️</div>
                    <h3 class="confirm-modal-title">Supprimer le produit</h3>
                    <p class="confirm-modal-description">
                        Êtes-vous sûr de vouloir supprimer "{{ productToDelete?.name }}" ? Cette action est
                        irréversible.
                    </p>
                    <div class="confirm-modal-actions">
                        <button @click="cancelDelete" class="btn-secondary">Annuler</button>
                        <button @click="deleteProduct" class="btn-danger">Supprimer définitivement</button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Toast notifications -->
        <transition name="toast">
            <div v-if="showToast" class="toast-notification">
                <div class="toast-icon">{{ toastIcon }}</div>
                <div class="toast-content">
                    <div class="toast-title">{{ toastTitle }}</div>
                    <div class="toast-message">{{ toastMessage }}</div>
                </div>
                <button @click="hideToast" class="toast-close">✕</button>
            </div>
        </transition>
    </div>
</template>

<script>
import ProductForm from '@/modules/catalog/components/Product/ProductForm.vue'
import catalogService from '@/modules/catalog/services/catalog.service'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

export default {
    name: 'MyProductsView',
    components: {
        ProductForm
    },
    data() {
        return {
            producerName: 'Producteur',
            searchQuery: '',
            sortBy: 'name',
            currentPage: 1,
            itemsPerPage: 10,
            expandedProduct: null,
            showProductModal: false,
            showDeleteModal: false,
            modalMode: 'add',
            editingProduct: null,
            productToDelete: null,
            showToast: false,
            toastTitle: '',
            toastMessage: '',
            toastIcon: '',
            unreadNotifications: 0,
            monthlyRevenue: '0',
            activeFilters: [],
            fieldPattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="rgba(34,139,34,0.03)" stroke-width="0.5" stroke-dasharray="5,5"/>
        <line x1="10" y1="30" x2="90" y2="30" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
      </svg>`,
            harvestPattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34,139,34,0.02)" stroke-width="0.4"/>
        <path d="M30,30 L70,70 M70,30 L30,70" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <circle cx="50" cy="50" r="15" fill="rgba(34,139,34,0.01)"/>
      </svg>`,
            toolPattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="40" height="40" rx="5" fill="none" stroke="rgba(34,139,34,0.02)" stroke-width="0.4"/>
        <line x1="30" y1="50" x2="70" y2="50" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
      </svg>`,
            filters: [
                { id: 'active', label: 'Actifs', icon: '✅', count: 0 },
                { id: 'inactive', label: 'Inactifs', icon: '⏸️', count: 0 },
                { id: 'bio', label: 'Bio', icon: '🌿', count: 0 },
                { id: 'low-stock', label: 'Stock bas', icon: '⚠️', count: 0 },
                { id: 'out-of-stock', label: 'Rupture', icon: '❌', count: 0 },
                { id: 'seasonal', label: 'De saison', icon: '🌸', count: 0 }
            ],
            products: []
        }
    },
    computed: {
        totalProducts() {
            return this.products.length
        },
        activeProducts() {
            return this.products.filter(p => p.isActive).length
        },
        lowStockProducts() {
            return this.products.filter(p => p.stock > 0 && p.stock <= p.maxStock * 0.2).length
        },
        outOfStockProducts() {
            return this.products.filter(p => p.stock === 0).length
        },
        filteredProducts() {
            let filtered = [...this.products]

            // Filtre par recherche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                )
            }

            // Filtres actifs
            if (this.activeFilters.length > 0) {
                filtered = filtered.filter(product => {
                    if (this.activeFilters.includes('active') && !product.isActive) return false
                    if (this.activeFilters.includes('inactive') && product.isActive) return false
                    if (this.activeFilters.includes('bio') && !product.isBio) return false
                    if (this.activeFilters.includes('low-stock') && (product.stock === 0 || product.stock > product.maxStock * 0.2)) return false
                    if (this.activeFilters.includes('out-of-stock') && product.stock > 0) return false
                    if (this.activeFilters.includes('seasonal') && !product.isSeasonal) return false
                    return true
                })
            }

            // Tri
            filtered.sort((a, b) => {
                switch (this.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name)
                    case 'price':
                        return a.price - b.price
                    case 'stock':
                        return b.stock - a.stock
                    case 'sales':
                        return b.sales - a.sales
                    default:
                        return 0
                }
            })

            // Pagination
            const start = (this.currentPage - 1) * this.itemsPerPage
            return filtered.slice(start, start + this.itemsPerPage)
        },
        totalPages() {
            return Math.ceil(this.products.length / this.itemsPerPage)
        },
        topPerformingProducts() {
            return [...this.products]
                .filter(p => p.isActive)
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 5)
        },
        criticalStockProducts() {
            return [...this.products]
                .filter(p => p.stock > 0 && p.stock <= p.maxStock * 0.2)
                .sort((a, b) => a.stock - b.stock)
        }
    },
    methods: {
        formatXaf(amount) {
            return new Intl.NumberFormat('fr-CM', {
                style: 'currency',
                currency: 'XAF',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Number(amount || 0))
        },
        formatRelativeUpdateLabel(value) {
            if (!value) return 'mis à jour récemment'
            const date = new Date(value)
            if (Number.isNaN(date.getTime())) return 'mis à jour récemment'

            const now = new Date()
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
            if (diffDays <= 0) return 'aujourd\'hui'
            if (diffDays === 1) return 'hier'
            if (diffDays < 7) return `il y a ${diffDays} jours`
            return date.toLocaleDateString('fr-CM')
        },
        normalizeProductFromApi(product) {
            const tags = Array.isArray(product?.tags) ? product.tags : []
            const tagObjects = Array.isArray(product?.tag_objects) ? product.tag_objects : []
            const isBio = tags.includes('bio') || tagObjects.some(tag => tag?.slug === 'bio' || tag?.type === 'bio')
            const isSeasonal = tags.includes('season') || tags.includes('saison') ||
                tagObjects.some(tag => tag?.slug === 'season' || tag?.type === 'season')
            const stock = Number(product?.stock_quantity ?? 0)
            const lowStockThreshold = Number(product?.low_stock_threshold ?? 10)
            const maxStock = Math.max(stock, lowStockThreshold * 5, 10)
            const price = Number(product?.price ?? 0)

            return {
                id: product?.id ?? Date.now(),
                name: product?.name || 'Produit',
                category: product?.category?.name || 'Non catégorisé',
                image: product?.images?.[0]?.url || '',
                price,
                unit: product?.unit?.abbreviation || product?.unit?.name || 'unité',
                stock,
                maxStock,
                isActive: Boolean(product?.is_active),
                isBio,
                isSeasonal,
                sales: 0,
                rating: 0,
                monthlySales: 0,
                totalRevenue: 0,
                conversionRate: 0,
                reviewCount: 0,
                lastUpdate: this.formatRelativeUpdateLabel(product?.updated_at)
            }
        },
        refreshFilterCounts() {
            const total = this.products.length
            const active = this.products.filter(p => p.isActive).length
            const inactive = total - active
            const bio = this.products.filter(p => p.isBio).length
            const lowStock = this.products.filter(p => p.stock > 0 && p.stock <= p.maxStock * 0.2).length
            const outOfStock = this.products.filter(p => p.stock === 0).length
            const seasonal = this.products.filter(p => p.isSeasonal).length

            this.filters = this.filters.map(filter => {
                if (filter.id === 'active') return { ...filter, count: active }
                if (filter.id === 'inactive') return { ...filter, count: inactive }
                if (filter.id === 'bio') return { ...filter, count: bio }
                if (filter.id === 'low-stock') return { ...filter, count: lowStock }
                if (filter.id === 'out-of-stock') return { ...filter, count: outOfStock }
                if (filter.id === 'seasonal') return { ...filter, count: seasonal }
                return filter
            })
        },
        async loadMyProducts() {
            try {
                const response = await catalogService.getMyProducts({ limit: 100 })
                this.products = Array.isArray(response?.products)
                    ? response.products.map((product) => this.normalizeProductFromApi(product))
                    : []
                this.monthlyRevenue = '0'
                this.refreshFilterCounts()
            } catch (error) {
                console.error('Erreur chargement des produits du producteur:', error)
                this.products = []
                this.monthlyRevenue = '0'
                this.refreshFilterCounts()
            }
        },
        toggleFilter(filterId) {
            const index = this.activeFilters.indexOf(filterId)
            if (index === -1) {
                this.activeFilters.push(filterId)
            } else {
                this.activeFilters.splice(index, 1)
            }
        },
        getStockClass(stock) {
            if (stock === 0) return 'stock-empty'
            if (stock <= 10) return 'stock-low'
            if (stock <= 30) return 'stock-medium'
            return 'stock-high'
        },
        getStockMessage(stock, maxStock) {
            const percentage = (stock / maxStock) * 100
            if (stock === 0) return 'Rupture de stock'
            if (percentage <= 20) return 'Stock critique'
            if (percentage <= 50) return 'Stock moyen'
            return 'Stock confortable'
        },
        toggleProductStatus(product) {
            product.isActive = !product.isActive
            this.refreshFilterCounts()
            this.showToastMessage(
                product.isActive ? 'Produit activé' : 'Produit désactivé',
                `"${product.name}" est maintenant ${product.isActive ? 'visible' : 'masqué'} dans le catalogue`,
                product.isActive ? '✅' : '⏸️'
            )
        },
        showAddProductModal() {
            this.modalMode = 'add'
            this.editingProduct = null
            this.showProductModal = true
            document.body.style.overflow = 'hidden'
        },
        editProduct(product) {
            this.modalMode = 'edit'
            this.editingProduct = { ...product }
            this.showProductModal = true
            document.body.style.overflow = 'hidden'
        },
        duplicateProduct(product) {
            const duplicate = {
                ...product,
                id: Date.now(),
                name: `${product.name} (copie)`,
                sales: 0,
                monthlySales: 0,
                totalRevenue: 0,
                reviewCount: 0
            }
            this.products.unshift(duplicate)
            this.showToastMessage('Produit dupliqué', `Une copie de "${product.name}" a été créée`, '📋')
        },
        confirmDelete(product) {
            this.productToDelete = product
            this.showDeleteModal = true
            document.body.style.overflow = 'hidden'
        },
        cancelDelete() {
            this.productToDelete = null
            this.showDeleteModal = false
            document.body.style.overflow = 'auto'
        },
        deleteProduct() {
            if (this.productToDelete) {
                const index = this.products.findIndex(p => p.id === this.productToDelete.id)
                if (index !== -1) {
                    this.products.splice(index, 1)
                    this.refreshFilterCounts()
                    this.showToastMessage('Produit supprimé', `"${this.productToDelete.name}" a été supprimé`, '🗑️')
                }
            }
            this.cancelDelete()
        },
        closeProductModal() {
            this.showProductModal = false
            this.editingProduct = null
            document.body.style.overflow = 'auto'
            if (this.$route.path.endsWith('/products/new')) {
                this.$router.push('/producer/products')
            }
        },
        handleProductSubmit(productData) {
            if (this.modalMode === 'add') {
                const newProduct = {
                    ...productData,
                    id: Date.now(),
                    sales: 0,
                    monthlySales: 0,
                    totalRevenue: 0,
                    reviewCount: 0,
                    lastUpdate: 'à l\'instant'
                }
                this.products.unshift(newProduct)
                this.refreshFilterCounts()
                this.showToastMessage('Produit ajouté', 'Votre nouveau produit a été ajouté au catalogue', '✅')
            } else {
                const index = this.products.findIndex(p => p.id === productData.id)
                if (index !== -1) {
                    this.products[index] = {
                        ...this.products[index],
                        ...productData,
                        lastUpdate: 'à l\'instant'
                    }
                    this.refreshFilterCounts()
                    this.showToastMessage('Produit modifié', 'Les modifications ont été enregistrées', '✏️')
                }
            }
            this.closeProductModal()
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++
            }
        },
        goToPage(page) {
            this.currentPage = page
        },
        viewProductStats(product) {
            this.showToastMessage('Statistiques', `Ouverture des statistiques pour "${product.name}"`, '📈')
            // Navigation vers la page de statistiques du produit
        },
        manageStock(product) {
            this.showToastMessage('Gestion de stock', `Ouverture de la gestion de stock pour "${product.name}"`, '📦')
            // Ouverture du modal de gestion de stock
        },
        showNotifications() {
            this.showToastMessage('Notifications', 'Ouverture des notifications', '🔔')
            // Navigation vers la page des notifications
        },
        showOptimizationTips() {
            this.showToastMessage('Conseils', 'Ouverture des conseils d\'optimisation', '🎯')
            // Ouverture du modal de conseils
        },
        showToastMessage(title, message, icon = 'ℹ️') {
            this.toastTitle = title
            this.toastMessage = message
            this.toastIcon = icon
            this.showToast = true

            setTimeout(() => {
                this.hideToast()
            }, 3000)
        },
        hideToast() {
            this.showToast = false
        }
    },
    watch: {
        '$route.path'(newPath) {
            if (newPath.endsWith('/products/new') && !this.showProductModal) {
                this.showAddProductModal()
            }
        }
    },
    async mounted() {
        const authStore = useAuthStore()
        const email = authStore?.user?.email
        if (email && typeof email === 'string') {
            this.producerName = email.split('@')[0] || 'Producteur'
        }

        await this.loadMyProducts()

        if (this.$route.path.endsWith('/products/new')) {
            this.showAddProductModal()
        }
    }
}
</script>

<style scoped>
/* Variables de couleurs personnalisées */
:root {
    --forest-green: #228B22;
    --cream-light: #FFFDD0;
    --terracotta: #E2725B;
    --nature-gray: #666666;
    --success-green: #10B981;
    --warning-amber: #F59E0B;
    --error-red: #EF4444;
}

/* Animation de page */
.page-enter-active,
.page-leave-active {
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

/* Animation de slide up */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* Animations de graines qui tombent */
.seed {
    position: absolute;
    font-size: 20px;
    animation: fall linear infinite;
    opacity: 0.1;
    z-index: 1;
}

.seed-1 {
    left: 10%;
    animation-duration: 25s;
    animation-delay: 0s;
}

.seed-2 {
    left: 30%;
    animation-duration: 30s;
    animation-delay: 5s;
}

.seed-3 {
    left: 50%;
    animation-duration: 20s;
    animation-delay: 10s;
}

.seed-4 {
    left: 70%;
    animation-duration: 35s;
    animation-delay: 15s;
}

.seed-5 {
    left: 90%;
    animation-duration: 28s;
    animation-delay: 20s;
}

@keyframes fall {
    0% {
        top: -50px;
        transform: rotate(0deg);
    }

    100% {
        top: 100vh;
        transform: rotate(360deg);
    }
}

/* Cartes de statistiques */
.stat-card {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(34, 139, 34, 0.1);
    transition: all 0.5s;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-card:hover {
    transform: scale(1.05);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.stat-total {
    border-left: 4px solid var(--forest-green);
}

.stat-active {
    border-left: 4px solid var(--success-green);
}

.stat-low {
    border-left: 4px solid var(--warning-amber);
}

.stat-out {
    border-left: 4px solid var(--error-red);
}

.stat-icon {
    font-size: 1.875rem;
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: 1.875rem;
    font-weight: bold;
    color: var(--forest-green);
}

.stat-label {
    font-size: 0.875rem;
    color: var(--nature-gray);
    margin-top: 0.25rem;
}

/* Boutons de filtre */
.filter-btn {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: 1px solid;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.filter-btn-active {
    background-color: rgba(34, 139, 34, 0.2);
    color: var(--forest-green);
    border-color: rgba(34, 139, 34, 0.3);
}

.filter-btn-inactive {
    background-color: rgba(255, 255, 255, 0.6);
    color: var(--nature-gray);
    border-color: rgba(34, 139, 34, 0.1);
}

.filter-btn-inactive:hover {
    background-color: rgba(34, 139, 34, 0.05);
    border-color: rgba(34, 139, 34, 0.2);
}

.filter-btn-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-count {
    margin-left: 0.25rem;
    padding: 0.25rem 0.5rem;
    background-color: rgba(34, 139, 34, 0.1);
    color: var(--forest-green);
    font-size: 0.75rem;
    border-radius: 9999px;
}

/* Champs de formulaire */
.search-input {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(34, 139, 34, 0.2);
    border-radius: 0.75rem;
    transition: all 0.3s;
    width: 16rem;
}

.search-input:focus {
    outline: none;
    border-color: rgba(34, 139, 34, 0.4);
    box-shadow: 0 0 0 4px rgba(34, 139, 34, 0.1);
}

.select-input {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(34, 139, 34, 0.2);
    border-radius: 0.75rem;
    padding: 0.5rem 1rem;
    transition: all 0.3s;
}

.select-input:focus {
    outline: none;
    border-color: rgba(34, 139, 34, 0.4);
    box-shadow: 0 0 0 4px rgba(34, 139, 34, 0.1);
}

/* Carte produit */
.product-card {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(34, 139, 34, 0.1);
    transition: all 0.5s;
}

.product-card:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border-color: rgba(34, 139, 34, 0.2);
}

.product-image-wrapper {
    position: relative;
    width: 4rem;
    height: 4rem;
    border-radius: 0.75rem;
    overflow: hidden;
    flex-shrink: 0;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-badge {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
}

.product-badge.bio {
    background-color: #10b981;
    color: white;
}

.product-badge.seasonal {
    background-color: #ec4899;
    color: white;
}

.product-name {
    font-weight: bold;
    color: var(--forest-green);
    transition: color 0.3s;
}

.product-name:hover {
    color: var(--terracotta);
}

.product-category {
    font-size: 0.875rem;
    color: var(--nature-gray);
    margin-top: 0.25rem;
}

.product-sales,
.product-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--nature-gray);
}

.product-price {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--forest-green);
}

/* Indicateur de stock */
.stock-indicator {
    position: relative;
    height: 1.5rem;
    background-color: #f3f4f6;
    border-radius: 9999px;
    overflow: hidden;
}

.stock-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transition: all 0.5s;
}

.stock-high .stock-bar {
    @apply bg-green-500;
}

.stock-medium .stock-bar {
    @apply bg-amber-500;
}

.stock-low .stock-bar {
    @apply bg-red-500;
}

.stock-empty .stock-bar {
    @apply bg-gray-400;
}

.stock-text {
    @apply absolute inset-0 flex items-center justify-center text-xs font-medium text-white;
}

/* Switch toggle */
.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: var(--forest-green);
}

input:checked+.slider:before {
    transform: translateX(24px);
}

.status-label {
    @apply text-sm font-medium;
}

.status-active {
    @apply text-green-600;
}

.status-inactive {
    @apply text-gray-500;
}

/* Boutons d'action */
.action-btn {
    @apply w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110;
}

.edit-btn {
    @apply bg-blue-100 text-blue-600 hover:bg-blue-200;
}

.duplicate-btn {
    @apply bg-forest-green bg-opacity-10 text-forest-green hover:bg-opacity-20;
}

.delete-btn {
    @apply bg-red-100 text-red-600 hover:bg-red-200;
}

/* Détails produit */
.detail-item {
    @apply bg-white/60 backdrop-blur-sm rounded-xl p-3;
}

.detail-label {
    @apply text-xs text-nature-gray mb-1;
}

.detail-value {
    @apply font-medium text-forest-green;
}

/* État vide */
.empty-state {
    @apply bg-gradient-to-br from-white/70 to-cream-light backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-dashed border-forest-green border-opacity-20;
}

.empty-icon {
    @apply text-6xl mb-6;
}

.empty-title {
    @apply text-2xl font-serif font-bold text-forest-green mb-3;
}

.empty-description {
    @apply text-nature-gray max-w-md mx-auto;
}

/* Pagination */
.pagination {
    @apply flex items-center space-x-4;
}

.pagination-btn {
    @apply px-4 py-2 bg-white/80 backdrop-blur-sm border border-forest-green border-opacity-20 rounded-xl text-forest-green font-medium transition-all duration-300 hover:bg-forest-green hover:bg-opacity-5 hover:border-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-numbers {
    @apply flex items-center space-x-2;
}

.pagination-number {
    @apply w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-forest-green border-opacity-20 rounded-xl text-forest-green font-medium transition-all duration-300 hover:bg-forest-green hover:bg-opacity-5 hover:border-opacity-40;
}

.pagination-active {
    @apply bg-forest-green text-white border-forest-green;
}

/* Section insights */
.insights-section {
    @apply bg-gradient-to-br from-white/60 to-cream-light backdrop-blur-sm rounded-3xl p-8 border border-forest-green border-opacity-10;
}

.section-title {
    @apply text-2xl font-serif font-bold text-forest-green mb-6;
}

.insight-card {
    @apply bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green border-opacity-10 transition-all duration-500 hover:scale-105 hover:shadow-xl;
}

.insight-icon {
    @apply text-3xl mb-4;
}

.insight-title {
    @apply font-bold text-forest-green mb-2;
}

.insight-description {
    @apply text-nature-gray text-sm mb-4;
}

.insight-item {
    @apply flex justify-between items-center py-2 border-b border-forest-green border-opacity-5 last:border-b-0;
}

.insight-item-name {
    @apply text-forest-green;
}

.insight-item-value {
    @apply font-medium text-terracotta;
}

/* Boutons */
.btn-primary {
    @apply bg-gradient-to-r from-forest-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-secondary {
    @apply bg-gradient-to-r from-cream-light to-white text-terracotta font-semibold rounded-xl border border-terracotta border-opacity-20 transition-all duration-500 hover:border-opacity-40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-danger {
    @apply bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl transform hover:scale-105;
}

/* Modals */
.modal-content {
    @apply relative bg-white/95 backdrop-blur-sm rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl;
}

.modal-header {
    @apply flex justify-between items-center p-6 border-b border-forest-green border-opacity-10 bg-white/95 backdrop-blur-sm;
}

.modal-title {
    @apply text-2xl font-serif font-bold text-forest-green;
}

.modal-close {
    @apply w-10 h-10 rounded-full bg-forest-green bg-opacity-10 text-forest-green flex items-center justify-center hover:bg-opacity-20 transition-colors duration-300;
}

.modal-body {
    @apply p-6;
}

.product-modal-enter-active,
.product-modal-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-modal-enter-from,
.product-modal-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}

.confirm-modal-content {
    @apply relative bg-white/95 backdrop-blur-sm rounded-3xl max-w-md w-full p-8 shadow-2xl text-center;
}

.confirm-modal-icon {
    @apply text-5xl mb-4;
}

.confirm-modal-title {
    @apply text-2xl font-serif font-bold text-forest-green mb-3;
}

.confirm-modal-description {
    @apply text-nature-gray mb-8;
}

.confirm-modal-actions {
    @apply flex justify-center space-x-4;
}

.confirm-modal-enter-active,
.confirm-modal-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.confirm-modal-enter-from,
.confirm-modal-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

/* Toast notification */
.toast-notification {
    @apply fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-forest-green border-opacity-10 flex items-center space-x-4 max-w-sm;
}

.toast-icon {
    @apply text-3xl;
}

.toast-content {
    @apply flex-1;
}

.toast-title {
    @apply font-bold text-forest-green;
}

.toast-message {
    @apply text-sm text-nature-gray;
}

.toast-close {
    @apply w-8 h-8 rounded-full bg-forest-green bg-opacity-10 text-forest-green flex items-center justify-center hover:bg-opacity-20 transition-colors duration-300;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
}

/* Animation de liste */
.product-list-enter-active,
.product-list-leave-active,
.product-list-move {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-list-enter-from,
.product-list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.product-list-leave-active {
    position: absolute;
}

/* Utilitaires */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-forest-green bg-opacity-5 rounded-full;
}

::-webkit-scrollbar-thumb {
    @apply bg-forest-green bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-300;
}
</style>

<!-- Styles globaux -->
<style>
:root {
    --forest-green: #228B22;
    --cream-light: #FFFDD0;
    --terracotta: #E2725B;
    --nature-gray: #666666;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.font-serif {
    font-family: 'Playfair Display', 'Georgia', serif;
}

/* Appliquer les variables aux classes Tailwind */
.bg-forest-green {
    background-color: var(--forest-green);
}

.text-forest-green {
    color: var(--forest-green);
}

.border-forest-green {
    border-color: var(--forest-green);
}

.bg-cream-light {
    background-color: var(--cream-light);
}

.text-cream-light {
    color: var(--cream-light);
}

.bg-terracotta {
    background-color: var(--terracotta);
}

.text-terracotta {
    color: var(--terracotta);
}

.border-terracotta {
    border-color: var(--terracotta);
}

.text-nature-gray {
    color: var(--nature-gray);
}
</style>

