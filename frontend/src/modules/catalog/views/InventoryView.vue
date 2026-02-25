<template>
    <div class="min-h-screen relative overflow-hidden">
        <!-- Texture de fond organique pour inventaire -->
        <div class="absolute inset-0 z-0">
            <!-- Dégradé naturel d'entrepôt -->
            <div class="absolute inset-0 bg-gradient-to-br from-forest-green/8 via-cream-light/12 to-terracotta/6">
            </div>

            <!-- Filigranes d'inventaire organique -->
            <div class="absolute inset-0 opacity-[0.012]">
                <div class="absolute top-16 left-10 w-64 h-64" v-html="warehousePattern"></div>
                <div class="absolute bottom-20 right-12 w-72 h-72" v-html="cratePattern"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"
                    v-html="gridPattern"></div>
            </div>

            <!-- Texture de papier d'inventaire -->
            <div class="absolute inset-0"
                style="background-image: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(34,139,34,0.02) 1px, rgba(34,139,34,0.02) 2px);">
            </div>
        </div>

        <!-- Animation d'ambiance - Particules d'inventaire -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div class="inventory-particle particle-1">📦</div>
            <div class="inventory-particle particle-2">📊</div>
            <div class="inventory-particle particle-3">📈</div>
            <div class="inventory-particle particle-4">🔍</div>
            <div class="inventory-particle particle-5">⚖️</div>
        </div>

        <!-- Contenu principal -->
        <div class="relative z-10">
            <!-- Navigation inventaire avec effet de profondeur -->
            <header class="pt-8 px-6">
                <div class="max-w-7xl mx-auto">
                    <div
                        class="flex justify-between items-center backdrop-blur-sm bg-white/40 rounded-3xl p-4 border border-white/20 shadow-sm">
                        <!-- Logo et titre inventaire -->
                        <div class="flex items-center space-x-4">
                            <div class="relative group">
                                <div
                                    class="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-green to-terracotta p-0.5 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                                    <div
                                        class="w-full h-full rounded-2xl bg-cream-light flex items-center justify-center">
                                        <span
                                            class="text-2xl font-serif text-forest-green transition-transform duration-700 group-hover:rotate-12">📦</span>
                                    </div>
                                </div>
                                <div
                                    class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-terracotta/30 backdrop-blur-sm border border-white/30 animate-pulse">
                                </div>
                            </div>
                            <div>
                                <h1 class="text-2xl font-serif font-bold text-forest-green">Gestion des Stocks</h1>
                                <p class="text-sm text-nature-gray mt-1">Surveillez et gérez vos produits en temps réel
                                </p>
                            </div>
                        </div>

                        <!-- Navigation rapide -->
                        <nav class="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full">
                            <router-link to="/producer/dashboard"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300 text-sm px-4 py-2 rounded-full hover:bg-white bg-opacity-50">
                                Dashboard
                            </router-link>
                            <router-link to="/producer/products"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300 text-sm px-4 py-2 rounded-full hover:bg-white bg-opacity-50">
                                Produits
                            </router-link>
                            <router-link to="/producer/inventory"
                                class="bg-forest-green bg-opacity-10 text-forest-green font-medium text-sm px-4 py-2 rounded-full">
                                Inventaire
                            </router-link>
                            <router-link to="/producer/orders"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300 text-sm px-4 py-2 rounded-full hover:bg-white bg-opacity-50">
                                Commandes
                            </router-link>
                        </nav>

                        <!-- Actions rapides inventaire -->
                        <div class="flex items-center space-x-3">
                            <button @click="syncInventory" class="btn-secondary px-4 py-2 text-sm"
                                :class="{ 'opacity-50': isSyncing }">
                                <span class="flex items-center space-x-2">
                                    <span v-if="isSyncing" class="animate-spin">⟳</span>
                                    <span v-else>🔄</span>
                                    <span>{{ isSyncing ? 'Synchronisation...' : 'Synchroniser' }}</span>
                                </span>
                            </button>
                            <button @click="showAddStockModal" class="btn-primary px-6 py-3">
                                <span class="flex items-center space-x-2">
                                    <span>➕</span>
                                    <span>Ajouter au stock</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Contenu principal -->
            <main class="py-8 px-6">
                <div class="max-w-7xl mx-auto">
                    <!-- En-tête avec KPI -->
                    <div class="mb-8 animate-slide-up">
                        <div class="flex justify-between items-center mb-8">
                            <div>
                                <h2 class="text-3xl font-serif font-bold text-forest-green mb-2">Inventaire Complet</h2>
                                <p class="text-nature-gray">Surveillance en temps réel de vos stocks et alertes</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="text-right">
                                    <div class="text-sm text-nature-gray">Dernière mise à jour</div>
                                    <div class="text-lg font-bold text-forest-green">{{ lastUpdateTime }}</div>
                                </div>
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-green/10 to-terracotta/10 flex items-center justify-center text-forest-green">
                                    <span class="text-xl">🕒</span>
                                </div>
                            </div>
                        </div>

                        <!-- KPI principaux -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div class="kpi-card kpi-total">
                                <div class="kpi-icon">📦</div>
                                <div class="kpi-content">
                                    <div class="kpi-value">{{ formatCurrency(totalStockValue) }}</div>
                                    <div class="kpi-label">Valeur totale du stock</div>
                                    <div class="kpi-trend positive">
                                        <span>↗</span>
                                        <span>+{{ stockValueChange }}%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="kpi-card kpi-warning">
                                <div class="kpi-icon">⚠️</div>
                                <div class="kpi-content">
                                    <div class="kpi-value">{{ lowStockItems }}</div>
                                    <div class="kpi-label">Stocks critiques</div>
                                    <div class="kpi-trend negative" v-if="lowStockItems > 0">
                                        <span>↘</span>
                                        <span>Attention requise</span>
                                    </div>
                                </div>
                            </div>
                            <div class="kpi-card kpi-success">
                                <div class="kpi-icon">✅</div>
                                <div class="kpi-content">
                                    <div class="kpi-value">{{ optimalStockItems }}</div>
                                    <div class="kpi-label">Stocks optimaux</div>
                                    <div class="kpi-trend positive">
                                        <span>✓</span>
                                        <span>Niveau sain</span>
                                    </div>
                                </div>
                            </div>
                            <div class="kpi-card kpi-alert">
                                <div class="kpi-icon">📅</div>
                                <div class="kpi-content">
                                    <div class="kpi-value">{{ expiringSoonItems }}</div>
                                    <div class="kpi-label">Péremption proche</div>
                                    <div class="kpi-trend warning" v-if="expiringSoonItems > 0">
                                        <span>⏰</span>
                                        <span>{{ nearestExpiryDays }} jours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section d'alertes -->
                    <div class="mb-8 animate-slide-up" style="animation-delay: 0.1s">
                        <div class="alerts-section">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="section-title">🚨 Alertes de Stock</h3>
                                <button @click="dismissAllAlerts"
                                    class="text-sm text-nature-gray hover:text-forest-green transition-colors duration-300">
                                    Tout masquer
                                </button>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div v-if="criticalAlerts.length > 0" class="alert-card critical">
                                    <div class="alert-icon">🔥</div>
                                    <div class="alert-content">
                                        <div class="alert-title">{{ criticalAlerts.length }} Urgences</div>
                                        <div class="alert-description">Stocks épuisés ou très bas</div>
                                    </div>
                                    <button @click="viewCriticalAlerts" class="alert-action">
                                        Voir
                                    </button>
                                </div>

                                <div v-if="warningAlerts.length > 0" class="alert-card warning">
                                    <div class="alert-icon">⚠️</div>
                                    <div class="alert-content">
                                        <div class="alert-title">{{ warningAlerts.length }} Avertissements</div>
                                        <div class="alert-description">Stocks bas ou péremption proche</div>
                                    </div>
                                    <button @click="viewWarningAlerts" class="alert-action">
                                        Voir
                                    </button>
                                </div>

                                <div v-if="infoAlerts.length > 0" class="alert-card info">
                                    <div class="alert-icon">💡</div>
                                    <div class="alert-content">
                                        <div class="alert-title">{{ infoAlerts.length }} Recommandations</div>
                                        <div class="alert-description">Suggestions d'optimisation</div>
                                    </div>
                                    <button @click="viewInfoAlerts" class="alert-action">
                                        Voir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Barre de contrôle inventaire -->
                    <div class="mb-8 animate-slide-up" style="animation-delay: 0.2s">
                        <div class="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green border-opacity-10">
                            <div
                                class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                <!-- Filtres rapides -->
                                <div class="flex flex-wrap gap-3">
                                    <button v-for="filter in inventoryFilters" :key="filter.id"
                                        @click="toggleInventoryFilter(filter.id)" :class="[
                                            'inventory-filter-btn',
                                            activeInventoryFilters.includes(filter.id) ? 'inventory-filter-active' : 'inventory-filter-inactive'
                                        ]">
                                        <span class="inventory-filter-content">
                                            <span>{{ filter.icon }}</span>
                                            <span>{{ filter.label }}</span>
                                            <span v-if="filter.count" class="inventory-filter-count">{{ filter.count
                                                }}</span>
                                        </span>
                                    </button>
                                </div>

                                <!-- Recherche et actions -->
                                <div class="flex items-center space-x-4">
                                    <div class="relative">
                                        <input v-model="inventorySearch" type="text"
                                            placeholder="Rechercher un produit..."
                                            class="inventory-search-input pl-10 pr-4 py-2" />
                                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <span class="text-forest-green/60">🔍</span>
                                        </div>
                                    </div>

                                    <div class="flex space-x-2">
                                        <button @click="exportInventory" class="btn-secondary px-4 py-2 text-sm">
                                            <span class="flex items-center space-x-2">
                                                <span>📥</span>
                                                <span class="hidden md:inline">Exporter</span>
                                            </span>
                                        </button>
                                        <button @click="showInventoryReport" class="btn-secondary px-4 py-2 text-sm">
                                            <span class="flex items-center space-x-2">
                                                <span>📊</span>
                                                <span class="hidden md:inline">Rapport</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Vue sélection -->
                            <div class="flex items-center space-x-4 mt-6">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm text-nature-gray">Vue :</span>
                                    <button @click="viewMode = 'table'"
                                        :class="['view-toggle-btn', viewMode === 'table' ? 'view-toggle-active' : '']">
                                        📋 Tableau
                                    </button>
                                    <button @click="viewMode = 'grid'"
                                        :class="['view-toggle-btn', viewMode === 'grid' ? 'view-toggle-active' : '']">
                                        🗂️ Grille
                                    </button>
                                    <button @click="viewMode = 'cards'"
                                        :class="['view-toggle-btn', viewMode === 'cards' ? 'view-toggle-active' : '']">
                                        🃏 Cartes
                                    </button>
                                </div>

                                <div class="flex items-center space-x-2 ml-auto">
                                    <span class="text-sm text-nature-gray">Trier par :</span>
                                    <select v-model="sortField" class="sort-select">
                                        <option value="name">Nom</option>
                                        <option value="stock">Stock</option>
                                        <option value="lastUpdated">Dernière mise à jour</option>
                                        <option value="expiryDate">Date de péremption</option>
                                        <option value="value">Valeur</option>
                                    </select>
                                    <button @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'"
                                        class="sort-direction-btn">
                                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contenu de l'inventaire selon la vue -->
                    <div class="animate-slide-up" style="animation-delay: 0.3s">
                        <!-- Vue tableau (par défaut) -->
                        <div v-if="viewMode === 'table'" class="inventory-table-container">
                            <table class="inventory-table">
                                <thead>
                                    <tr class="table-header">
                                        <th class="table-header-cell">Produit</th>
                                        <th class="table-header-cell text-center">Catégorie</th>
                                        <th class="table-header-cell text-center">Stock actuel</th>
                                        <th class="table-header-cell text-center">Stock optimal</th>
                                        <th class="table-header-cell text-center">Statut</th>
                                        <th class="table-header-cell text-center">Péremption</th>
                                        <th class="table-header-cell text-center">Valeur</th>
                                        <th class="table-header-cell text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <transition-group name="inventory-item">
                                        <tr v-for="(item, index) in filteredInventory" :key="item.id"
                                            class="table-row group" :style="`animation-delay: ${0.4 + index * 0.05}s`">
                                            <!-- Cellule Produit -->
                                            <td class="table-cell">
                                                <div class="flex items-center space-x-4">
                                                    <div class="item-image-wrapper">
                                                        <img :src="item.image" :alt="item.name" class="item-image" />
                                                        <div v-if="item.isBio" class="item-badge bio">🌿</div>
                                                        <div v-if="item.isSeasonal" class="item-badge seasonal">🌸</div>
                                                    </div>
                                                    <div>
                                                        <h4 class="item-name">{{ item.name }}</h4>
                                                        <p class="item-sku">SKU: {{ item.sku }}</p>
                                                        <div class="flex items-center space-x-2 mt-1">
                                                            <span class="item-location">
                                                                <span class="location-icon">📍</span>
                                                                <span>{{ item.location }}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <!-- Cellule Catégorie -->
                                            <td class="table-cell text-center">
                                                <span class="category-badge">{{ item.category }}</span>
                                            </td>

                                            <!-- Cellule Stock actuel -->
                                            <td class="table-cell text-center">
                                                <div class="stock-display">
                                                    <div class="stock-quantity">{{ item.currentStock }}</div>
                                                    <div class="stock-unit">{{ item.unit }}</div>
                                                </div>
                                            </td>

                                            <!-- Cellule Stock optimal -->
                                            <td class="table-cell text-center">
                                                <div class="stock-display">
                                                    <div class="stock-quantity">{{ item.optimalStock }}</div>
                                                    <div class="stock-unit">{{ item.unit }}</div>
                                                </div>
                                            </td>

                                            <!-- Cellule Statut -->
                                            <td class="table-cell text-center">
                                                <div class="stock-status" :class="getStockStatusClass(item)">
                                                    <div class="status-indicator"></div>
                                                    <span class="status-text">{{ getStockStatusText(item) }}</span>
                                                </div>
                                                <div v-if="item.reorderPoint && item.currentStock <= item.reorderPoint"
                                                    class="reorder-alert">
                                                    <span class="reorder-icon">🔄</span>
                                                    <span class="reorder-text">Commander</span>
                                                </div>
                                            </td>

                                            <!-- Cellule Péremption -->
                                            <td class="table-cell text-center">
                                                <div v-if="item.expiryDate" class="expiry-display"
                                                    :class="getExpiryClass(item)">
                                                    <div class="expiry-date">{{ formatDate(item.expiryDate) }}</div>
                                                    <div class="expiry-days">{{ getDaysUntilExpiry(item) }} jours</div>
                                                </div>
                                                <div v-else class="no-expiry">Non périssable</div>
                                            </td>

                                            <!-- Cellule Valeur -->
                                            <td class="table-cell text-center">
                                                <div class="value-display">
                                                    <div class="value-amount">{{ formatCurrency(item.stockValue) }}
                                                    </div>
                                                    <div class="value-per-unit">{{ formatCurrency(item.unitValue) }}/{{
                                                        item.unit }}</div>
                                                </div>
                                            </td>

                                            <!-- Cellule Actions -->
                                            <td class="table-cell text-center">
                                                <div class="action-buttons">
                                                    <button @click="adjustStock(item)" class="action-btn adjust-btn"
                                                        title="Ajuster le stock">
                                                        📝
                                                    </button>
                                                    <button @click="viewStockHistory(item)"
                                                        class="action-btn history-btn" title="Historique">
                                                        📊
                                                    </button>
                                                    <button @click="transferStock(item)" class="action-btn transfer-btn"
                                                        title="Transférer">
                                                        🔄
                                                    </button>
                                                    <button @click="setAlerts(item)" class="action-btn alert-btn"
                                                        title="Alertes">
                                                        🔔
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </transition-group>
                                </tbody>
                            </table>
                        </div>

                        <!-- Vue grille -->
                        <div v-if="viewMode === 'grid'" class="inventory-grid">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <transition-group name="inventory-grid-item">
                                    <div v-for="(item, index) in filteredInventory" :key="item.id"
                                        class="inventory-grid-card group"
                                        :style="`animation-delay: ${0.4 + index * 0.05}s`">
                                        <!-- En-tête de la carte -->
                                        <div class="grid-card-header">
                                            <div class="grid-card-image">
                                                <img :src="item.image" :alt="item.name" />
                                                <div v-if="item.isBio" class="grid-card-badge bio">🌿</div>
                                            </div>
                                            <div class="grid-card-title">
                                                <h4 class="grid-card-name">{{ item.name }}</h4>
                                                <p class="grid-card-category">{{ item.category }}</p>
                                            </div>
                                        </div>

                                        <!-- Corps de la carte -->
                                        <div class="grid-card-body">
                                            <div class="grid-card-stats">
                                                <div class="stat-item">
                                                    <div class="stat-label">Stock actuel</div>
                                                    <div class="stat-value">{{ item.currentStock }} {{ item.unit }}
                                                    </div>
                                                </div>
                                                <div class="stat-item">
                                                    <div class="stat-label">Stock optimal</div>
                                                    <div class="stat-value">{{ item.optimalStock }} {{ item.unit }}
                                                    </div>
                                                </div>
                                                <div class="stat-item">
                                                    <div class="stat-label">Statut</div>
                                                    <div class="stat-value" :class="getStockStatusClass(item)">
                                                        {{ getStockStatusText(item) }}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Jauge de stock -->
                                            <div class="stock-gauge">
                                                <div class="gauge-label">Niveau de stock</div>
                                                <div class="gauge-bar">
                                                    <div class="gauge-fill" :class="getStockGaugeClass(item)"
                                                        :style="{ width: `${(item.currentStock / item.optimalStock) * 100}%` }">
                                                    </div>
                                                </div>
                                                <div class="gauge-numbers">
                                                    <span>0</span>
                                                    <span>{{ item.optimalStock }}</span>
                                                </div>
                                            </div>

                                            <!-- Péremption -->
                                            <div v-if="item.expiryDate" class="expiry-section">
                                                <div class="expiry-label">Péremption</div>
                                                <div class="expiry-value" :class="getExpiryClass(item)">
                                                    {{ formatDate(item.expiryDate) }} ({{ getDaysUntilExpiry(item) }}
                                                    jours)
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Pied de la carte -->
                                        <div class="grid-card-footer">
                                            <div class="grid-card-value">
                                                <span class="value-label">Valeur :</span>
                                                <span class="value-amount">{{ formatCurrency(item.stockValue) }}</span>
                                            </div>
                                            <div class="grid-card-actions">
                                                <button @click="adjustStock(item)" class="grid-action-btn">
                                                    <span>📝</span>
                                                    <span class="action-label">Ajuster</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </transition-group>
                            </div>
                        </div>

                        <!-- Vue cartes -->
                        <div v-if="viewMode === 'cards'" class="inventory-cards">
                            <div class="space-y-4">
                                <transition-group name="inventory-card-item">
                                    <div v-for="(item, index) in filteredInventory" :key="item.id"
                                        class="inventory-card group" :style="`animation-delay: ${0.4 + index * 0.05}s`">
                                        <!-- Barre latérale avec statut -->
                                        <div class="card-sidebar" :class="getStockStatusClass(item)">
                                            <div class="sidebar-status">
                                                {{ getStockStatusText(item) }}
                                            </div>
                                            <div class="sidebar-icon">
                                                {{ item.isBio ? '🌿' : '📦' }}
                                            </div>
                                        </div>

                                        <!-- Contenu principal -->
                                        <div class="card-content">
                                            <div class="card-header">
                                                <div class="card-title-section">
                                                    <h4 class="card-title">{{ item.name }}</h4>
                                                    <div class="card-subtitle">
                                                        <span class="card-category">{{ item.category }}</span>
                                                        <span class="card-separator">•</span>
                                                        <span class="card-location">{{ item.location }}</span>
                                                    </div>
                                                </div>
                                                <div class="card-sku">
                                                    SKU: {{ item.sku }}
                                                </div>
                                            </div>

                                            <div class="card-body">
                                                <!-- Informations de stock -->
                                                <div class="card-stock-info">
                                                    <div class="stock-current">
                                                        <div class="stock-label">Stock actuel</div>
                                                        <div class="stock-value">{{ item.currentStock }} {{ item.unit }}
                                                        </div>
                                                    </div>
                                                    <div class="stock-optimal">
                                                        <div class="stock-label">Stock optimal</div>
                                                        <div class="stock-value">{{ item.optimalStock }} {{ item.unit }}
                                                        </div>
                                                    </div>
                                                    <div class="stock-reorder">
                                                        <div class="stock-label">Point de commande</div>
                                                        <div class="stock-value">{{ item.reorderPoint || 'N/A' }} {{
                                                            item.unit }}</div>
                                                    </div>
                                                </div>

                                                <!-- Valeur et péremption -->
                                                <div class="card-details">
                                                    <div class="detail-item">
                                                        <div class="detail-label">Valeur stock</div>
                                                        <div class="detail-value">{{ formatCurrency(item.stockValue) }}
                                                        </div>
                                                    </div>
                                                    <div class="detail-item">
                                                        <div class="detail-label">Valeur unitaire</div>
                                                        <div class="detail-value">{{ formatCurrency(item.unitValue) }}/{{
                                                            item.unit }}</div>
                                                    </div>
                                                    <div v-if="item.expiryDate" class="detail-item">
                                                        <div class="detail-label">Péremption</div>
                                                        <div class="detail-value" :class="getExpiryClass(item)">
                                                            {{ formatDate(item.expiryDate) }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Actions -->
                                            <div class="card-actions">
                                                <button @click="adjustStock(item)" class="card-action-btn primary">
                                                    <span>📝 Ajuster</span>
                                                </button>
                                                <button @click="viewStockHistory(item)"
                                                    class="card-action-btn secondary">
                                                    <span>📊 Historique</span>
                                                </button>
                                                <button @click="transferStock(item)" class="card-action-btn tertiary">
                                                    <span>🔄 Transférer</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </transition-group>
                            </div>
                        </div>

                        <!-- État vide -->
                        <div v-if="filteredInventory.length === 0" class="empty-inventory animate-slide-up">
                            <div class="empty-inventory-icon">📦</div>
                            <h3 class="empty-inventory-title">Inventaire vide</h3>
                            <p class="empty-inventory-description">
                                {{ inventorySearch ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par ajouter des produits à votre inventaire.' }}
                            </p>
                            <div class="empty-inventory-actions">
                                <button @click="showAddStockModal" class="btn-primary mt-6 px-8 py-3">
                                    <span class="flex items-center space-x-2">
                                        <span>➕</span>
                                        <span>Ajouter des produits</span>
                                    </span>
                                </button>
                                <button @click="importInventory" class="btn-secondary mt-6 px-8 py-3 ml-4">
                                    <span class="flex items-center space-x-2">
                                        <span>📥</span>
                                        <span>Importer</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Section historique et tendances -->
                    <div class="mt-12 animate-slide-up" style="animation-delay: 0.5s">
                        <div class="trends-section">
                            <h3 class="section-title">📈 Tendances et Analyse</h3>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- Graphique de consommation -->
                                <div class="trend-card">
                                    <div class="trend-card-header">
                                        <h4 class="trend-card-title">Consommation moyenne</h4>
                                        <select v-model="trendPeriod" class="trend-select">
                                            <option value="7d">7 derniers jours</option>
                                            <option value="30d">30 derniers jours</option>
                                            <option value="90d">90 derniers jours</option>
                                        </select>
                                    </div>
                                    <div class="trend-card-body">
                                        <div class="consumption-chart">
                                            <!-- Simulation de graphique -->
                                            <div class="chart-bars">
                                                <div v-for="(day, index) in consumptionData" :key="index"
                                                    class="chart-bar"
                                                    :style="{ height: `${(day.value / maxConsumption) * 100}%` }"
                                                    :class="getChartBarClass(day.value)">
                                                    <div class="chart-bar-tooltip">
                                                        {{ day.label }}: {{ day.value }} {{ selectedUnit }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="chart-labels">
                                                <span v-for="day in consumptionData" :key="day.label">{{ day.label
                                                    }}</span>
                                            </div>
                                        </div>
                                        <div class="chart-summary">
                                            <div class="summary-item">
                                                <div class="summary-label">Consommation moyenne</div>
                                                <div class="summary-value">{{ averageConsumption }} {{ selectedUnit
                                                    }}/jour</div>
                                            </div>
                                            <div class="summary-item">
                                                <div class="summary-label">Tendance</div>
                                                <div class="summary-value"
                                                    :class="consumptionTrend > 0 ? 'positive' : 'negative'">
                                                    {{ consumptionTrend > 0 ? '↑' : '↓' }} {{ Math.abs(consumptionTrend)
                                                    }}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Prévisions de stock -->
                                <div class="trend-card">
                                    <div class="trend-card-header">
                                        <h4 class="trend-card-title">Prévisions de rupture</h4>
                                        <span class="trend-card-badge critical" v-if="predictedOutOfStock > 0">
                                            {{ predictedOutOfStock }} produits
                                        </span>
                                    </div>
                                    <div class="trend-card-body">
                                        <div class="forecast-list">
                                            <div v-for="item in forecastItems" :key="item.id" class="forecast-item">
                                                <div class="forecast-product">
                                                    <span class="forecast-name">{{ item.name }}</span>
                                                    <span class="forecast-category">{{ item.category }}</span>
                                                </div>
                                                <div class="forecast-details">
                                                    <div class="forecast-stock">
                                                        <span class="forecast-current">{{ item.currentStock }} {{
                                                            item.unit }}</span>
                                                        <span class="forecast-separator">→</span>
                                                        <span class="forecast-predicted">0 {{ item.unit }}</span>
                                                    </div>
                                                    <div class="forecast-time">
                                                        <span class="forecast-icon">⏰</span>
                                                        <span class="forecast-days">{{ item.daysUntilOut }} jours</span>
                                                    </div>
                                                </div>
                                                <button @click="reorderNow(item)" class="forecast-action">
                                                    Commander
                                                </button>
                                            </div>
                                        </div>

                                        <div v-if="forecastItems.length === 0" class="forecast-empty">
                                            <div class="forecast-empty-icon">✅</div>
                                            <div class="forecast-empty-text">Aucune rupture prévue dans les 30 jours
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Modal d'ajustement de stock -->
        <transition name="stock-modal">
            <div v-if="showStockModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeStockModal"></div>
                <div class="stock-modal-content">
                    <div class="stock-modal-header">
                        <h3 class="stock-modal-title">Ajuster le stock</h3>
                        <button @click="closeStockModal" class="stock-modal-close">✕</button>
                    </div>
                    <div class="stock-modal-body">
                        <StockAdjustmentForm v-if="selectedItem" :item="selectedItem" @adjust="handleStockAdjustment"
                            @cancel="closeStockModal" />
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal de rapport d'inventaire -->
        <transition name="report-modal">
            <div v-if="showReportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeReportModal"></div>
                <div class="report-modal-content">
                    <div class="report-modal-header">
                        <h3 class="report-modal-title">Rapport d'inventaire</h3>
                        <button @click="closeReportModal" class="report-modal-close">✕</button>
                    </div>
                    <div class="report-modal-body">
                        <InventoryReport :inventory="filteredInventory" @generate="generateReport"
                            @cancel="closeReportModal" />
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
import StockAdjustmentForm from '@/modules/catalog/components/StockAdjustmentForm.vue'
import InventoryReport from '@/modules/catalog/components/InventoryReport.vue'

export default {
    name: 'InventoryView',
    components: {
        StockAdjustmentForm,
        InventoryReport
    },
    data() {
        return {
            inventorySearch: '',
            viewMode: 'table',
            sortField: 'name',
            sortDirection: 'desc',
            activeInventoryFilters: [],
            showStockModal: false,
            showReportModal: false,
            selectedItem: null,
            isSyncing: false,
            trendPeriod: '30d',
            showToast: false,
            toastTitle: '',
            toastMessage: '',
            toastIcon: '',
            lastUpdateTime: 'il y a 2 minutes',
            warehousePattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="80" height="60" fill="none" stroke="rgba(34,139,34,0.02)" stroke-width="0.5"/>
        <line x1="10" y1="40" x2="90" y2="40" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <line x1="10" y1="60" x2="90" y2="60" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <rect x="30" y="30" width="10" height="10" fill="none" stroke="rgba(34,139,34,0.02)" stroke-width="0.4"/>
      </svg>`,
            cratePattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="5" fill="none" stroke="rgba(34,139,34,0.02)" stroke-width="0.5"/>
        <line x1="20" y1="40" x2="80" y2="40" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <line x1="40" y1="20" x2="40" y2="80" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
        <line x1="60" y1="20" x2="60" y2="80" stroke="rgba(226,114,91,0.02)" stroke-width="0.3"/>
      </svg>`,
            gridPattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="rgba(34,139,34,0.01)" stroke-width="0.3"/>
        <line x1="10" y1="30" x2="90" y2="30" stroke="rgba(34,139,34,0.01)" stroke-width="0.2"/>
        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(34,139,34,0.01)" stroke-width="0.2"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="rgba(34,139,34,0.01)" stroke-width="0.2"/>
        <line x1="30" y1="10" x2="30" y2="90" stroke="rgba(226,114,91,0.01)" stroke-width="0.2"/>
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(226,114,91,0.01)" stroke-width="0.2"/>
        <line x1="70" y1="10" x2="70" y2="90" stroke="rgba(226,114,91,0.01)" stroke-width="0.2"/>
      </svg>`,
            inventoryFilters: [
                { id: 'critical', label: 'Critique', icon: '🔥', count: 3 },
                { id: 'low', label: 'Bas', icon: '⚠️', count: 5 },
                { id: 'optimal', label: 'Optimal', icon: '✅', count: 12 },
                { id: 'expiring', label: 'Péremption', icon: '📅', count: 2 },
                { id: 'out', label: 'Rupture', icon: '❌', count: 1 },
                { id: 'bio', label: 'Bio', icon: '🌿', count: 8 }
            ],
            inventory: [
                {
                    id: 1,
                    name: 'Tomates Anciennes Coeur de Boeuf',
                    sku: 'TOM-001',
                    category: 'Légumes fruits',
                    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400',
                    currentStock: 28,
                    optimalStock: 100,
                    reorderPoint: 20,
                    unit: 'kg',
                    unitValue: 5.90,
                    stockValue: 165.20,
                    location: 'Zone A, Rack 3',
                    isBio: true,
                    isSeasonal: true,
                    expiryDate: '2024-12-15',
                    lastUpdated: '2024-11-10',
                    status: 'low'
                },
                {
                    id: 2,
                    name: 'Courgettes Bio',
                    sku: 'COU-002',
                    category: 'Légumes',
                    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400',
                    currentStock: 15,
                    optimalStock: 80,
                    reorderPoint: 15,
                    unit: 'kg',
                    unitValue: 3.50,
                    stockValue: 52.50,
                    location: 'Zone A, Rack 2',
                    isBio: true,
                    isSeasonal: true,
                    expiryDate: '2024-11-25',
                    lastUpdated: '2024-11-09',
                    status: 'critical'
                },
                {
                    id: 3,
                    name: 'Aubergines Violette',
                    sku: 'AUB-003',
                    category: 'Légumes',
                    image: 'https://images.unsplash.com/photo-1551845543-2f7c2a4a2cc5?auto=format&fit=crop&w=400',
                    currentStock: 5,
                    optimalStock: 60,
                    reorderPoint: 10,
                    unit: 'kg',
                    unitValue: 4.30,
                    stockValue: 21.50,
                    location: 'Zone B, Rack 1',
                    isBio: false,
                    isSeasonal: true,
                    expiryDate: '2024-11-20',
                    lastUpdated: '2024-11-08',
                    status: 'critical'
                },
                {
                    id: 4,
                    name: 'Poivrons Tricolores',
                    sku: 'POI-004',
                    category: 'Légumes',
                    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400',
                    currentStock: 0,
                    optimalStock: 50,
                    reorderPoint: 10,
                    unit: 'kg',
                    unitValue: 5.80,
                    stockValue: 0,
                    location: 'Zone A, Rack 1',
                    isBio: true,
                    isSeasonal: true,
                    expiryDate: null,
                    lastUpdated: '2024-11-07',
                    status: 'out'
                },
                {
                    id: 5,
                    name: 'Concombres Rustiques',
                    sku: 'CON-005',
                    category: 'Légumes',
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400',
                    currentStock: 42,
                    optimalStock: 150,
                    reorderPoint: 30,
                    unit: 'pièce',
                    unitValue: 2.90,
                    stockValue: 121.80,
                    location: 'Zone C, Rack 4',
                    isBio: true,
                    isSeasonal: true,
                    expiryDate: '2024-12-05',
                    lastUpdated: '2024-11-10',
                    status: 'optimal'
                },
                {
                    id: 6,
                    name: 'Salade Batavia',
                    sku: 'SAL-006',
                    category: 'Légumes feuilles',
                    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400',
                    currentStock: 8,
                    optimalStock: 40,
                    reorderPoint: 8,
                    unit: 'pièce',
                    unitValue: 1.80,
                    stockValue: 14.40,
                    location: 'Chambre froide 1',
                    isBio: false,
                    isSeasonal: true,
                    expiryDate: '2024-11-18',
                    lastUpdated: '2024-11-09',
                    status: 'critical'
                },
                {
                    id: 7,
                    name: 'Carottes Nouvelles',
                    sku: 'CAR-007',
                    category: 'Légumes racines',
                    image: 'https://images.unsplash.com/photo-1598170845058-78132e1b46d1?auto=format&fit=crop&w=400',
                    currentStock: 65,
                    optimalStock: 120,
                    reorderPoint: 25,
                    unit: 'kg',
                    unitValue: 2.40,
                    stockValue: 156.00,
                    location: 'Zone B, Rack 3',
                    isBio: true,
                    isSeasonal: false,
                    expiryDate: '2025-01-15',
                    lastUpdated: '2024-11-09',
                    status: 'optimal'
                },
                {
                    id: 8,
                    name: 'Radis Rose',
                    sku: 'RAD-008',
                    category: 'Légumes racines',
                    image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=400',
                    currentStock: 3,
                    optimalStock: 30,
                    reorderPoint: 6,
                    unit: 'botte',
                    unitValue: 1.90,
                    stockValue: 5.70,
                    location: 'Chambre froide 2',
                    isBio: false,
                    isSeasonal: true,
                    expiryDate: '2024-11-15',
                    lastUpdated: '2024-11-08',
                    status: 'critical'
                },
                {
                    id: 9,
                    name: 'Oignons Jaunes',
                    sku: 'OIG-009',
                    category: 'Légumes bulbes',
                    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=400',
                    currentStock: 92,
                    optimalStock: 200,
                    reorderPoint: 40,
                    unit: 'kg',
                    unitValue: 2.10,
                    stockValue: 193.20,
                    location: 'Zone D, Rack 2',
                    isBio: true,
                    isSeasonal: false,
                    expiryDate: '2025-03-20',
                    lastUpdated: '2024-11-07',
                    status: 'optimal'
                },
                {
                    id: 10,
                    name: 'Ail Rose',
                    sku: 'AIL-010',
                    category: 'Légumes bulbes',
                    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400',
                    currentStock: 25,
                    optimalStock: 60,
                    reorderPoint: 12,
                    unit: 'tête',
                    unitValue: 3.20,
                    stockValue: 80.00,
                    location: 'Zone D, Rack 1',
                    isBio: true,
                    isSeasonal: false,
                    expiryDate: '2025-02-28',
                    lastUpdated: '2024-11-06',
                    status: 'low'
                }
            ],
            consumptionData: [
                { label: 'Lun', value: 45 },
                { label: 'Mar', value: 52 },
                { label: 'Mer', value: 48 },
                { label: 'Jeu', value: 60 },
                { label: 'Ven', value: 55 },
                { label: 'Sam', value: 38 },
                { label: 'Dim', value: 30 }
            ],
            selectedUnit: 'kg',
            forecastItems: [
                {
                    id: 2,
                    name: 'Courgettes Bio',
                    category: 'Légumes',
                    currentStock: 15,
                    unit: 'kg',
                    daysUntilOut: 3
                },
                {
                    id: 6,
                    name: 'Salade Batavia',
                    category: 'Légumes feuilles',
                    currentStock: 8,
                    unit: 'pièce',
                    daysUntilOut: 5
                },
                {
                    id: 8,
                    name: 'Radis Rose',
                    category: 'Légumes racines',
                    currentStock: 3,
                    unit: 'botte',
                    daysUntilOut: 2
                }
            ]
        }
    },
    computed: {
        totalStockValue() {
            return this.inventory.reduce((sum, item) => sum + item.stockValue, 0)
        },
        stockValueChange() {
            return 2.5 // Simulé
        },
        lowStockItems() {
            return this.inventory.filter(item => item.status === 'low' || item.status === 'critical').length
        },
        optimalStockItems() {
            return this.inventory.filter(item => item.status === 'optimal').length
        },
        expiringSoonItems() {
            return this.inventory.filter(item => {
                if (!item.expiryDate) return false
                const daysUntilExpiry = this.getDaysUntilExpiry(item)
                return daysUntilExpiry <= 7 && daysUntilExpiry > 0
            }).length
        },
        nearestExpiryDays() {
            const expiringItems = this.inventory.filter(item => item.expiryDate)
            if (expiringItems.length === 0) return 0
            return Math.min(...expiringItems.map(item => this.getDaysUntilExpiry(item)))
        },
        filteredInventory() {
            let filtered = [...this.inventory]

            // Filtre par recherche
            if (this.inventorySearch) {
                const query = this.inventorySearch.toLowerCase()
                filtered = filtered.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.sku.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
                )
            }

            // Filtres actifs
            if (this.activeInventoryFilters.length > 0) {
                filtered = filtered.filter(item => {
                    if (this.activeInventoryFilters.includes('critical') && item.status !== 'critical') return false
                    if (this.activeInventoryFilters.includes('low') && item.status !== 'low') return false
                    if (this.activeInventoryFilters.includes('optimal') && item.status !== 'optimal') return false
                    if (this.activeInventoryFilters.includes('out') && item.status !== 'out') return false
                    if (this.activeInventoryFilters.includes('expiring') && (!item.expiryDate || this.getDaysUntilExpiry(item) > 7)) return false
                    if (this.activeInventoryFilters.includes('bio') && !item.isBio) return false
                    return true
                })
            }

            // Tri
            filtered.sort((a, b) => {
                let aValue, bValue

                switch (this.sortField) {
                    case 'name':
                        aValue = a.name
                        bValue = b.name
                        break
                    case 'stock':
                        aValue = a.currentStock
                        bValue = b.currentStock
                        break
                    case 'lastUpdated':
                        aValue = new Date(a.lastUpdated)
                        bValue = new Date(b.lastUpdated)
                        break
                    case 'expiryDate':
                        aValue = a.expiryDate ? new Date(a.expiryDate) : new Date('9999-12-31')
                        bValue = b.expiryDate ? new Date(b.expiryDate) : new Date('9999-12-31')
                        break
                    case 'value':
                        aValue = a.stockValue
                        bValue = b.stockValue
                        break
                    default:
                        aValue = a.name
                        bValue = b.name
                }

                if (typeof aValue === 'string') {
                    return this.sortDirection === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue)
                } else {
                    return this.sortDirection === 'asc'
                        ? aValue - bValue
                        : bValue - aValue
                }
            })

            return filtered
        },
        criticalAlerts() {
            return this.inventory.filter(item => item.status === 'critical' || item.status === 'out')
        },
        warningAlerts() {
            return this.inventory.filter(item => {
                if (item.status === 'low') return true
                if (item.expiryDate) {
                    const days = this.getDaysUntilExpiry(item)
                    return days <= 14 && days > 0
                }
                return false
            })
        },
        infoAlerts() {
            return this.inventory.filter(item => {
                const stockRatio = item.currentStock / item.optimalStock
                return stockRatio > 1.5 // Trop de stock
            })
        },
        maxConsumption() {
            return Math.max(...this.consumptionData.map(d => d.value))
        },
        averageConsumption() {
            const sum = this.consumptionData.reduce((acc, d) => acc + d.value, 0)
            return Math.round(sum / this.consumptionData.length)
        },
        consumptionTrend() {
            // Simulation de tendance
            return 2.3
        },
        predictedOutOfStock() {
            return this.forecastItems.length
        }
    },
    methods: {
        toggleInventoryFilter(filterId) {
            const index = this.activeInventoryFilters.indexOf(filterId)
            if (index === -1) {
                this.activeInventoryFilters.push(filterId)
            } else {
                this.activeInventoryFilters.splice(index, 1)
            }
        },
        getStockStatusClass(item) {
            switch (item.status) {
                case 'critical': return 'status-critical'
                case 'low': return 'status-low'
                case 'optimal': return 'status-optimal'
                case 'out': return 'status-out'
                default: return 'status-unknown'
            }
        },
        getStockStatusText(item) {
            switch (item.status) {
                case 'critical': return 'Critique'
                case 'low': return 'Bas'
                case 'optimal': return 'Optimal'
                case 'out': return 'Rupture'
                default: return 'Inconnu'
            }
        },
        getExpiryClass(item) {
            if (!item.expiryDate) return 'expiry-none'
            const days = this.getDaysUntilExpiry(item)
            if (days <= 0) return 'expiry-expired'
            if (days <= 3) return 'expiry-critical'
            if (days <= 7) return 'expiry-warning'
            if (days <= 14) return 'expiry-approaching'
            return 'expiry-safe'
        },
        getDaysUntilExpiry(item) {
            if (!item.expiryDate) return Infinity
            const expiryDate = new Date(item.expiryDate)
            const today = new Date()
            const diffTime = expiryDate - today
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        },
        formatDate(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR')
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('fr-CM', {
                style: 'currency',
                currency: 'XAF',
                maximumFractionDigits: 0
            }).format(Number(amount) || 0)
        },
        getStockGaugeClass(item) {
            const ratio = item.currentStock / item.optimalStock
            if (ratio >= 0.8) return 'gauge-optimal'
            if (ratio >= 0.3) return 'gauge-medium'
            return 'gauge-low'
        },
        getChartBarClass(value) {
            const max = this.maxConsumption
            const ratio = value / max
            if (ratio >= 0.8) return 'chart-high'
            if (ratio >= 0.5) return 'chart-medium'
            return 'chart-low'
        },
        syncInventory() {
            this.isSyncing = true
            this.showToastMessage(
                'Synchronisation',
                'Mise à jour de l\'inventaire en cours...',
                '🔄'
            )

            setTimeout(() => {
                this.isSyncing = false
                this.lastUpdateTime = 'à l\'instant'
                this.showToastMessage(
                    'Synchronisé',
                    'L\'inventaire a été mis à jour avec succès',
                    '✅'
                )
            }, 1500)
        },
        adjustStock(item) {
            this.selectedItem = item
            this.showStockModal = true
            document.body.style.overflow = 'hidden'
        },
        viewStockHistory(item) {
            this.showToastMessage(
                'Historique',
                `Ouverture de l'historique pour ${item.name}`,
                '📊'
            )
        },
        transferStock(item) {
            this.showToastMessage(
                'Transfert',
                `Transfert du stock pour ${item.name}`,
                '🔄'
            )
        },
        setAlerts(item) {
            this.showToastMessage(
                'Alertes',
                `Configuration des alertes pour ${item.name}`,
                '🔔'
            )
        },
        showAddStockModal() {
            this.showToastMessage(
                'Ajout de stock',
                'Ouverture du formulaire d\'ajout',
                '➕'
            )
        },
        showInventoryReport() {
            this.showReportModal = true
            document.body.style.overflow = 'hidden'
        },
        closeStockModal() {
            this.showStockModal = false
            this.selectedItem = null
            document.body.style.overflow = 'auto'
        },
        closeReportModal() {
            this.showReportModal = false
            document.body.style.overflow = 'auto'
        },
        handleStockAdjustment(adjustment) {
            const item = this.inventory.find(i => i.id === adjustment.itemId)
            if (item) {
                item.currentStock = adjustment.newStock
                item.lastUpdated = new Date().toISOString().split('T')[0]
                item.stockValue = item.currentStock * item.unitValue

                // Mettre à jour le statut
                const ratio = item.currentStock / item.optimalStock
                if (item.currentStock === 0) {
                    item.status = 'out'
                } else if (ratio <= 0.2) {
                    item.status = 'critical'
                } else if (ratio <= 0.5) {
                    item.status = 'low'
                } else {
                    item.status = 'optimal'
                }

                this.showToastMessage(
                    'Stock ajusté',
                    `Le stock de ${item.name} a été mis à jour`,
                    '✅'
                )
            }
            this.closeStockModal()
        },
        generateReport(reportType) {
            this.showToastMessage(
                'Rapport généré',
                `Rapport ${reportType} téléchargé avec succès`,
                '📥'
            )
            this.closeReportModal()
        },
        exportInventory() {
            this.showToastMessage(
                'Export',
                'Export de l\'inventaire démarré',
                '📥'
            )
        },
        importInventory() {
            this.showToastMessage(
                'Import',
                'Ouverture de l\'import d\'inventaire',
                '📤'
            )
        },
        dismissAllAlerts() {
            this.showToastMessage(
                'Alertes masquées',
                'Toutes les alertes ont été masquées',
                '👁️'
            )
        },
        viewCriticalAlerts() {
            this.activeInventoryFilters = ['critical', 'out']
            this.showToastMessage(
                'Filtre appliqué',
                'Affichage des alertes critiques',
                '🔥'
            )
        },
        viewWarningAlerts() {
            this.activeInventoryFilters = ['low', 'expiring']
            this.showToastMessage(
                'Filtre appliqué',
                'Affichage des avertissements',
                '⚠️'
            )
        },
        viewInfoAlerts() {
            this.activeInventoryFilters = []
            this.showToastMessage(
                'Recommandations',
                'Ouverture des recommandations',
                '💡'
            )
        },
        reorderNow(item) {
            this.showToastMessage(
                'Commande',
                `Commande lancée pour ${item.name}`,
                '🛒'
            )
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
    --critical-red: #DC2626;
}

/* Animation de page */
.page-enter-active,
.page-leave-active {
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateX(20px);
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

/* Animations de particules d'inventaire */
.inventory-particle {
    position: absolute;
    font-size: 20px;
    animation: floatInventory linear infinite;
    opacity: 0.1;
    z-index: 1;
}

.particle-1 {
    left: 5%;
    animation-duration: 25s;
    animation-delay: 0s;
}

.particle-2 {
    left: 25%;
    animation-duration: 30s;
    animation-delay: 5s;
}

.particle-3 {
    left: 45%;
    animation-duration: 20s;
    animation-delay: 10s;
}

.particle-4 {
    left: 65%;
    animation-duration: 35s;
    animation-delay: 15s;
}

.particle-5 {
    left: 85%;
    animation-duration: 28s;
    animation-delay: 20s;
}

@keyframes floatInventory {
    0% {
        top: -50px;
        transform: translateX(0) rotate(0deg);
    }

    25% {
        transform: translateX(50px) rotate(90deg);
    }

    50% {
        top: 50vh;
        transform: translateX(0) rotate(180deg);
    }

    75% {
        transform: translateX(-50px) rotate(270deg);
    }

    100% {
        top: 100vh;
        transform: translateX(0) rotate(360deg);
    }
}

/* Cartes KPI */
.kpi-card {
    @apply bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green border-opacity-10 transition-all duration-500 hover:scale-105 hover:shadow-xl flex items-center space-x-4;
}

.kpi-total {
    border-left: 4px solid var(--forest-green);
}

.kpi-warning {
    border-left: 4px solid var(--warning-amber);
}

.kpi-success {
    border-left: 4px solid var(--success-green);
}

.kpi-alert {
    border-left: 4px solid var(--terracotta);
}

.kpi-icon {
    @apply text-3xl;
}

.kpi-content {
    @apply flex-1;
}

.kpi-value {
    @apply text-3xl font-bold text-forest-green;
}

.kpi-label {
    @apply text-sm text-nature-gray mt-1;
}

.kpi-trend {
    @apply inline-flex items-center space-x-1 text-xs font-medium mt-2 px-2 py-1 rounded-full;
}

.kpi-trend.positive {
    @apply bg-green-100 text-green-800;
}

.kpi-trend.negative {
    @apply bg-red-100 text-red-800;
}

.kpi-trend.warning {
    @apply bg-amber-100 text-amber-800;
}

/* Section d'alertes */
.alerts-section {
    @apply bg-gradient-to-br from-white to-cream-light backdrop-blur-sm rounded-3xl p-8 border border-forest-green border-opacity-10;
}

.section-title {
    @apply text-2xl font-serif font-bold text-forest-green;
}

.alert-card {
    @apply rounded-2xl p-6 flex items-center justify-between transition-all duration-500 hover:scale-105;
}

.alert-card.critical {
    @apply bg-gradient-to-r from-red-50 to-red-100 border border-red-200;
}

.alert-card.warning {
    @apply bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200;
}

.alert-card.info {
    @apply bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200;
}

.alert-icon {
    @apply text-3xl;
}

.alert-content {
    @apply flex-1 ml-4;
}

.alert-title {
    @apply font-bold text-forest-green;
}

.alert-description {
    @apply text-sm text-nature-gray mt-1;
}

.alert-action {
    @apply px-4 py-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl text-forest-green font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-md;
}

/* Boutons de filtre d'inventaire */
.inventory-filter-btn {
    @apply px-4 py-2 rounded-full border transition-all duration-300 flex items-center space-x-2 text-sm font-medium;
}

.inventory-filter-active {
    @apply bg-forest-green bg-opacity-20 text-forest-green border-forest-green border-opacity-30;
}

.inventory-filter-inactive {
    @apply bg-white bg-opacity-60 text-nature-gray border-forest-green border-opacity-10 hover:bg-forest-green hover:bg-opacity-5 hover:border-forest-green hover:border-opacity-20;
}

.inventory-filter-content {
    @apply flex items-center space-x-2;
}

.inventory-filter-count {
    @apply ml-1 px-2 py-1 bg-forest-green bg-opacity-10 text-forest-green text-xs rounded-full;
}

/* Champs de recherche */
.inventory-search-input {
    @apply bg-white bg-opacity-80 backdrop-blur-sm border border-forest-green border-opacity-20 rounded-xl focus:outline-none focus:border-forest-green focus:border-opacity-40 focus:ring-4 focus:ring-forest-green focus:ring-opacity-10 transition-all duration-300 w-64;
}

/* Boutons de vue */
.view-toggle-btn {
    @apply px-4 py-2 rounded-xl border border-forest-green border-opacity-20 text-sm font-medium transition-all duration-300;
}

.view-toggle-active {
    @apply bg-forest-green bg-opacity-20 text-forest-green border-forest-green border-opacity-40;
}

.view-toggle-btn:not(.view-toggle-active) {
    @apply bg-white bg-opacity-60 text-nature-gray hover:bg-forest-green hover:bg-opacity-5 hover:border-forest-green hover:border-opacity-30;
}

/* Sélecteurs de tri */
.sort-select {
    @apply bg-white bg-opacity-80 backdrop-blur-sm border border-forest-green border-opacity-20 rounded-xl px-4 py-2 focus:outline-none focus:border-forest-green focus:border-opacity-40 focus:ring-4 focus:ring-forest-green focus:ring-opacity-10 transition-all duration-300 text-sm;
}

.sort-direction-btn {
    @apply w-10 h-10 rounded-xl bg-white bg-opacity-80 backdrop-blur-sm border border-forest-green border-opacity-20 flex items-center justify-center text-forest-green transition-all duration-300 hover:bg-forest-green hover:bg-opacity-10;
}

/* Boutons */
.btn-primary {
    @apply bg-gradient-to-r from-forest-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-secondary {
    @apply bg-terracotta bg-opacity-10 text-terracotta font-semibold rounded-xl border border-terracotta border-opacity-20 transition-all duration-500 hover:border-terracotta hover:border-opacity-40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Table d'inventaire */
.inventory-table-container {
    @apply bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl overflow-hidden border border-forest-green border-opacity-10;
}

.inventory-table {
    @apply w-full;
}

.table-header {
    @apply bg-forest-green bg-opacity-5;
}

.table-header-cell {
    @apply px-6 py-4 text-left text-sm font-semibold text-forest-green uppercase tracking-wider border-b border-forest-green border-opacity-10;
}

.table-row {
    @apply border-b border-forest-green border-opacity-10 transition-all duration-300 hover:bg-forest-green bg-opacity-5;
}

.table-cell {
    @apply px-6 py-4;
}

/* Images d'articles */
.item-image-wrapper {
    @apply relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0;
}

.item-image {
    @apply w-full h-full object-cover;
}

.item-badge {
    @apply absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs;
}

.item-badge.bio {
    @apply bg-green-500 text-white;
}

.item-badge.seasonal {
    @apply bg-pink-500 text-white;
}

.item-name {
    @apply font-bold text-forest-green;
}

.item-sku {
    @apply text-xs text-nature-gray;
}

.item-location {
    @apply inline-flex items-center space-x-1 text-xs text-nature-gray;
}

/* Badges de catégorie */
.category-badge {
    @apply inline-block px-3 py-1 bg-forest-green bg-opacity-10 text-forest-green text-xs font-medium rounded-full;
}

/* Affichage de stock */
.stock-display {
    @apply text-center;
}

.stock-quantity {
    @apply text-xl font-bold text-forest-green;
}

.stock-unit {
    @apply text-xs text-nature-gray;
}

/* Statut de stock */
.stock-status {
    @apply inline-flex items-center space-x-2 px-3 py-2 rounded-xl;
}

.status-indicator {
    @apply w-3 h-3 rounded-full;
}

.status-text {
    @apply text-sm font-medium;
}

.status-critical {
    @apply bg-red-100 text-red-800;
}

.status-critical .status-indicator {
    @apply bg-red-500;
}

.status-low {
    @apply bg-amber-100 text-amber-800;
}

.status-low .status-indicator {
    @apply bg-amber-500;
}

.status-optimal {
    @apply bg-green-100 text-green-800;
}

.status-optimal .status-indicator {
    @apply bg-green-500;
}

.status-out {
    @apply bg-gray-100 text-gray-800;
}

.status-out .status-indicator {
    @apply bg-gray-500;
}

/* Alerte de réapprovisionnement */
.reorder-alert {
    @apply inline-flex items-center space-x-1 text-xs text-forest-green mt-1 px-2 py-1 bg-forest-green bg-opacity-10 rounded-full;
}

/* Affichage de péremption */
.expiry-display {
    @apply text-center px-3 py-2 rounded-xl;
}

.expiry-date {
    @apply font-medium;
}

.expiry-days {
    @apply text-xs mt-1;
}

.expiry-critical {
    @apply bg-red-100 text-red-800;
}

.expiry-warning {
    @apply bg-amber-100 text-amber-800;
}

.expiry-approaching {
    @apply bg-blue-100 text-blue-800;
}

.expiry-safe {
    @apply bg-green-100 text-green-800;
}

.expiry-expired {
    @apply bg-gray-100 text-gray-800;
}

.expiry-none {
    @apply bg-gray-50 text-gray-600;
}

.no-expiry {
    @apply text-gray-500 text-sm;
}

/* Affichage de valeur */
.value-display {
    @apply text-center;
}

.value-amount {
    @apply text-lg font-bold text-forest-green;
}

.value-per-unit {
    @apply text-xs text-nature-gray;
}

/* Boutons d'action */
.action-buttons {
    @apply flex justify-center space-x-2;
}

.action-btn {
    @apply w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110;
}

.adjust-btn {
    @apply bg-blue-100 text-blue-600 hover:bg-blue-200;
}

.history-btn {
    @apply bg-purple-100 text-purple-600 hover:bg-purple-200;
}

.transfer-btn {
    @apply bg-forest-green bg-opacity-10 text-forest-green hover:bg-forest-green bg-opacity-20;
}

.alert-btn {
    @apply bg-amber-100 text-amber-600 hover:bg-amber-200;
}

/* Grille d'inventaire */
.inventory-grid {
    @apply bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green border-opacity-10;
}

.inventory-grid-card {
    @apply bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 border border-forest-green border-opacity-10 transition-all duration-500 hover:scale-105 hover:shadow-xl;
}

.grid-card-header {
    @apply flex items-center space-x-4 mb-6;
}

.grid-card-image {
    @apply relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0;
}

.grid-card-image img {
    @apply w-full h-full object-cover;
}

.grid-card-badge {
    @apply absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs;
}

.grid-card-badge.bio {
    @apply bg-green-500 text-white;
}

.grid-card-title {
    @apply flex-1;
}

.grid-card-name {
    @apply font-bold text-forest-green;
}

.grid-card-category {
    @apply text-sm text-nature-gray;
}

.grid-card-body {
    @apply space-y-6;
}

.grid-card-stats {
    @apply grid grid-cols-3 gap-4;
}

.stat-item {
    @apply text-center;
}

.stat-label {
    @apply text-xs text-nature-gray mb-1;
}

.stat-value {
    @apply font-medium text-forest-green;
}

/* Jauge de stock */
.stock-gauge {
    @apply space-y-2;
}

.gauge-label {
    @apply text-sm text-forest-green font-medium;
}

.gauge-bar {
    @apply h-2 bg-gray-100 rounded-full overflow-hidden;
}

.gauge-fill {
    @apply h-full rounded-full transition-all duration-500;
}

.gauge-optimal {
    @apply bg-green-500;
}

.gauge-medium {
    @apply bg-amber-500;
}

.gauge-low {
    @apply bg-red-500;
}

.gauge-numbers {
    @apply flex justify-between text-xs text-nature-gray;
}

/* Section péremption */
.expiry-section {
    @apply flex justify-between items-center p-3 bg-forest-green bg-opacity-5 rounded-xl;
}

.expiry-label {
    @apply text-sm text-forest-green font-medium;
}

.expiry-value {
    @apply text-sm font-medium px-3 py-1 rounded-full;
}

/* Pied de carte grille */
.grid-card-footer {
    @apply flex justify-between items-center mt-6 pt-6 border-t border-forest-green border-opacity-10;
}

.grid-card-value {
    @apply flex items-center space-x-2;
}

.value-label {
    @apply text-sm text-nature-gray;
}

.value-amount {
    @apply font-bold text-forest-green;
}

.grid-card-actions {
    @apply flex space-x-2;
}

.grid-action-btn {
    @apply flex items-center space-x-2 px-4 py-2 bg-forest-green bg-opacity-10 text-forest-green rounded-xl transition-all duration-300 hover:bg-forest-green bg-opacity-20;
}

.action-label {
    @apply text-sm font-medium;
}

/* Cartes d'inventaire */
.inventory-cards {
    @apply bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green border-opacity-10;
}

.inventory-card {
    @apply flex bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl border border-forest-green border-opacity-10 transition-all duration-500 hover:shadow-xl overflow-hidden;
}

.card-sidebar {
    @apply w-20 flex flex-col items-center justify-center p-4 flex-shrink-0;
}

.sidebar-status {
    @apply text-xs font-bold uppercase tracking-wider transform -rotate-90 whitespace-nowrap mb-4;
}

.sidebar-icon {
    @apply text-2xl;
}

.card-content {
    @apply flex-1 p-6;
}

.card-header {
    @apply flex justify-between items-start mb-6;
}

.card-title-section {
    @apply flex-1;
}

.card-title {
    @apply text-xl font-bold text-forest-green;
}

.card-subtitle {
    @apply flex items-center space-x-2 text-sm text-nature-gray mt-1;
}

.card-sku {
    @apply text-xs text-nature-gray bg-forest-green bg-opacity-5 px-3 py-1 rounded-full;
}

.card-body {
    @apply space-y-6;
}

.card-stock-info {
    @apply grid grid-cols-3 gap-6;
}

.stock-current,
.stock-optimal,
.stock-reorder {
    @apply p-4 bg-forest-green bg-opacity-5 rounded-xl;
}

.stock-label {
    @apply text-sm text-nature-gray mb-2;
}

.stock-value {
    @apply text-lg font-bold text-forest-green;
}

.card-details {
    @apply grid grid-cols-3 gap-6;
}

.detail-item {
    @apply p-4 bg-white bg-opacity-50 rounded-xl;
}

.detail-label {
    @apply text-sm text-nature-gray mb-2;
}

.detail-value {
    @apply font-medium text-forest-green;
}

.card-actions {
    @apply flex justify-end space-x-4 mt-6;
}

.card-action-btn {
    @apply px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105;
}

.card-action-btn.primary {
    @apply bg-forest-green text-white hover:bg-forest-green bg-opacity-90;
}

.card-action-btn.secondary {
    @apply bg-forest-green bg-opacity-10 text-forest-green hover:bg-opacity-20;
}

.card-action-btn.tertiary {
    @apply bg-terracotta bg-opacity-10 text-terracotta hover:bg-terracotta hover:bg-opacity-20;
}

/* État vide */
.empty-inventory {
    @apply bg-gradient-to-br from-white to-cream-light backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-dashed border-forest-green border-opacity-20;
}

.empty-inventory-icon {
    @apply text-6xl mb-6;
}

.empty-inventory-title {
    @apply text-2xl font-serif font-bold text-forest-green mb-3;
}

.empty-inventory-description {
    @apply text-nature-gray max-w-md mx-auto;
}

.empty-inventory-actions {
    @apply flex justify-center space-x-4;
}

/* Section tendances */
.trends-section {
    @apply bg-gradient-to-br from-white to-cream-light backdrop-blur-sm rounded-3xl p-8 border border-forest-green border-opacity-10;
}

.trend-card {
    @apply bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green border-opacity-10;
}

.trend-card-header {
    @apply flex justify-between items-center mb-6;
}

.trend-card-title {
    @apply text-lg font-bold text-forest-green;
}

.trend-select {
    @apply bg-white bg-opacity-80 backdrop-blur-sm border border-forest-green border-opacity-20 rounded-xl px-3 py-1 text-sm focus:outline-none focus:border-forest-green focus:border-opacity-40;
}

.trend-card-badge {
    @apply px-3 py-1 text-xs font-medium rounded-full;
}

.trend-card-badge.critical {
    @apply bg-red-100 text-red-800;
}

/* Graphique de consommation */
.consumption-chart {
    @apply relative h-48 mb-6;
}

.chart-bars {
    @apply flex items-end justify-between h-40 px-4;
}

.chart-bar {
    @apply relative w-8 bg-forest-green bg-opacity-20 rounded-t-lg transition-all duration-500 hover:opacity-80;
}

.chart-bar-tooltip {
    @apply absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap;
}

.chart-high {
    @apply bg-green-500;
}

.chart-medium {
    @apply bg-amber-500;
}

.chart-low {
    @apply bg-blue-500;
}

.chart-labels {
    @apply flex justify-between px-4 text-xs text-nature-gray;
}

.chart-summary {
    @apply grid grid-cols-2 gap-6;
}

.summary-item {
    @apply p-4 bg-forest-green bg-opacity-5 rounded-xl;
}

.summary-label {
    @apply text-sm text-nature-gray mb-2;
}

.summary-value {
    @apply text-lg font-bold text-forest-green;
}

.summary-value.positive {
    @apply text-green-600;
}

.summary-value.negative {
    @apply text-red-600;
}

/* Prévisions */
.forecast-list {
    @apply space-y-4;
}

.forecast-item {
    @apply flex items-center justify-between p-4 bg-forest-green bg-opacity-5 rounded-xl hover:bg-forest-green hover:bg-opacity-10 transition-colors duration-300;
}

.forecast-product {
    @apply flex-1;
}

.forecast-name {
    @apply font-medium text-forest-green block;
}

.forecast-category {
    @apply text-sm text-nature-gray;
}

.forecast-details {
    @apply flex items-center space-x-6;
}

.forecast-stock {
    @apply flex items-center space-x-2;
}

.forecast-current {
    @apply text-forest-green;
}

.forecast-separator {
    @apply text-nature-gray;
}

.forecast-predicted {
    @apply text-red-600;
}

.forecast-time {
    @apply flex items-center space-x-2 text-amber-600;
}

.forecast-action {
    @apply px-4 py-2 bg-forest-green bg-opacity-10 text-forest-green rounded-xl hover:bg-forest-green bg-opacity-20 transition-colors duration-300;
}

.forecast-empty {
    @apply text-center py-8;
}

.forecast-empty-icon {
    @apply text-4xl mb-4;
}

.forecast-empty-text {
    @apply text-nature-gray;
}

/* Modals */
.stock-modal-content,
.report-modal-content {
    @apply relative bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl;
}

.stock-modal-header,
.report-modal-header {
    @apply flex justify-between items-center p-6 border-b border-forest-green border-opacity-10 sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm z-10;
}

.stock-modal-title,
.report-modal-title {
    @apply text-2xl font-serif font-bold text-forest-green;
}

.stock-modal-close,
.report-modal-close {
    @apply w-10 h-10 rounded-full bg-forest-green bg-opacity-10 text-forest-green flex items-center justify-center hover:bg-forest-green bg-opacity-20 transition-colors duration-300;
}

.stock-modal-body,
.report-modal-body {
    @apply p-6;
}

.stock-modal-enter-active,
.stock-modal-leave-active,
.report-modal-enter-active,
.report-modal-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stock-modal-enter-from,
.stock-modal-leave-to,
.report-modal-enter-from,
.report-modal-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}

/* Toast notification */
.toast-notification {
    @apply fixed bottom-6 right-6 z-50 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-forest-green border-opacity-10 flex items-center space-x-4 max-w-sm;
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
    @apply w-8 h-8 rounded-full bg-forest-green bg-opacity-10 text-forest-green flex items-center justify-center hover:bg-forest-green bg-opacity-20 transition-colors duration-300;
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

/* Animations d'éléments d'inventaire */
.inventory-item-enter-active,
.inventory-item-leave-active,
.inventory-item-move,
.inventory-grid-item-enter-active,
.inventory-grid-item-leave-active,
.inventory-grid-item-move,
.inventory-card-item-enter-active,
.inventory-card-item-leave-active,
.inventory-card-item-move {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.inventory-item-enter-from,
.inventory-item-leave-to,
.inventory-grid-item-enter-from,
.inventory-grid-item-leave-to,
.inventory-card-item-enter-from,
.inventory-card-item-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.inventory-item-leave-active,
.inventory-grid-item-leave-active,
.inventory-card-item-leave-active {
    position: absolute;
}

/* Utilitaires */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    /* version standard pour compatibilité future */
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
    @apply bg-forest-green bg-opacity-20 rounded-full hover:bg-forest-green bg-opacity-30 transition-colors duration-300;
}
</style>

<style>
/* Styles globaux */
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

