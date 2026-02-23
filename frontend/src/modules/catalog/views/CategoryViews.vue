<template>
  <div class="min-h-screen organic-category-bg relative overflow-hidden">
    <!-- Animations de fond subtiles -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="leaf-float absolute top-5 left-5 text-6xl text-primary-green/20">🍃</div>
      <div class="leaf-float absolute top-10 right-10 text-5xl text-secondary-orange/20" style="animation-delay: 3s;">🌿</div>
      <div class="leaf-float absolute bottom-20 left-20 text-7xl text-forest-green/20" style="animation-delay: 6s;">🍂</div>
      <div class="leaf-float absolute bottom-10 right-20 text-6xl text-earth-brown/20" style="animation-delay: 9s;">🌱</div>
      <div class="leaf-float absolute top-1/3 left-10 text-5xl text-green-300/20" style="animation-delay: 12s;">🍀</div>
    </div>

    <!-- Texture de fond organique -->
    <div class="absolute inset-0 category-texture opacity-5"></div>

    <!-- Header inspirant -->
    <div class="relative z-10">
      <div class="container mx-auto px-4 py-12">
        <!-- Hero Section -->
        <div class="text-center mb-16 animate-slide-in-down">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-green to-green-600 rounded-3xl mb-6 shadow-2xl animate-pulse-soft">
            <span class="text-5xl text-white">🏷️</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-forest-green mb-4">
            Nos Catégories Gourmandes
          </h1>
          <p class="text-xl text-earth-brown/80 max-w-3xl mx-auto mb-8 leading-relaxed">
            Découvrez l'univers de produits frais, locaux et de saison, organisés avec soin pour votre plaisir
          </p>
          
          <!-- Indicateurs rapides -->
          <div class="flex flex-wrap justify-center gap-6 mb-12">
            <div class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-green-100/50 shadow-sm">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <span class="text-2xl text-green-600">📦</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-green">{{ totalCategories }}</p>
                <p class="text-sm text-gray-600">Catégories</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-green-100/50 shadow-sm">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span class="text-2xl text-amber-600">🍎</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-green">{{ totalProducts }}</p>
                <p class="text-sm text-gray-600">Produits</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-green-100/50 shadow-sm">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span class="text-2xl text-blue-600">🏪</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-green">{{ activeSuppliers }}</p>
                <p class="text-sm text-gray-600">Fournisseurs actifs</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-green-100/50 shadow-sm">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <span class="text-2xl text-purple-600">📈</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-green">{{ averageStock }}%</p>
                <p class="text-sm text-gray-600">Stock moyen</p>
              </div>
            </div>
          </div>

          <!-- Barre de recherche et filtres -->
          <div class="max-w-4xl mx-auto mb-12">
            <div class="organic-search-card bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 shadow-sm">
              <div class="flex flex-col md:flex-row gap-4">
                <!-- Recherche -->
                <div class="flex-1">
                  <div class="relative">
                    <input 
                      v-model="searchQuery"
                      type="text" 
                      placeholder="Rechercher une catégorie, un produit..."
                      class="w-full px-6 py-4 pl-14 bg-white/70 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic hover:border-green-300 text-lg"
                    >
                    <span class="absolute left-5 top-4 text-2xl text-green-500">🔍</span>
                    <button 
                      v-if="searchQuery"
                      @click="searchQuery = ''"
                      class="absolute right-5 top-4 text-gray-400 hover:text-gray-600 transition-organic text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <!-- Filtres rapides -->
                <div class="flex flex-wrap gap-3">
                  <button 
                    v-for="filter in quickFilters"
                    :key="filter.id"
                    @click="toggleFilter(filter.id)"
                    class="px-4 py-3 rounded-xl border transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2"
                    :class="[
                      activeFilters.includes(filter.id) 
                        ? filter.classes.active 
                        : filter.classes.inactive
                    ]"
                  >
                    <span>{{ filter.icon }}</span>
                    <span>{{ filter.label }}</span>
                    <span v-if="filter.count" class="text-xs px-2 py-1 rounded-full bg-white/50">
                      {{ filter.count }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grille des catégories -->
        <div class="animate-fade-in">
          <!-- En-tête de section -->
          <div class="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 class="text-3xl font-bold text-forest-green mb-2">Explorez nos univers</h2>
              <p class="text-earth-brown/80">Cliquez sur une catégorie pour découvrir ses trésors</p>
            </div>
            
            <div class="flex items-center space-x-4 mt-4 md:mt-0">
              <!-- Tri -->
              <div class="relative">
                <select 
                  v-model="sortBy"
                  class="px-4 py-3 pl-12 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic appearance-none cursor-pointer"
                >
                  <option value="name">Trier par nom</option>
                  <option value="stock">Trier par stock</option>
                  <option value="products">Trier par produits</option>
                  <option value="popularity">Trier par popularité</option>
                </select>
                <span class="absolute left-4 top-3.5 text-xl text-green-500">📊</span>
              </div>
              
              <!-- Vue -->
              <div class="flex bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 p-1">
                <button 
                  @click="viewMode = 'grid'"
                  class="p-2 rounded-lg transition-all duration-300 transition-organic"
                  :class="viewMode === 'grid' ? 'bg-primary-green text-white' : 'text-gray-600 hover:bg-green-50'"
                  title="Vue grille"
                >
                  <span class="text-xl">▦</span>
                </button>
                <button 
                  @click="viewMode = 'list'"
                  class="p-2 rounded-lg transition-all duration-300 transition-organic"
                  :class="viewMode === 'list' ? 'bg-primary-green text-white' : 'text-gray-600 hover:bg-green-50'"
                  title="Vue liste"
                >
                  <span class="text-xl">☰</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Vue Grille -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(category, index) in filteredCategories"
              :key="category.id"
              class="organic-category-card transform transition-all duration-500 transition-organic hover:scale-[1.02] animate-card-appear"
              :style="{ animationDelay: `${index * 0.1}s` }"
              @click="viewCategory(category)"
            >
              <!-- En-tête de la carte -->
              <div class="card-header" :class="getCategoryColor(category.type).header">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center space-x-4">
                    <div class="category-icon" :class="getCategoryColor(category.type).icon">
                      <span class="text-4xl">{{ category.icon }}</span>
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900">{{ category.name }}</h3>
                      <p class="text-gray-600">{{ category.subtitle }}</p>
                    </div>
                  </div>
                  <span class="text-3xl opacity-20">{{ category.icon }}</span>
                </div>
                
                <!-- Badges -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-if="category.seasonal" class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-sm font-medium">
                    <span class="mr-1">🍂</span> Saisonnier
                  </span>
                  <span v-if="category.bio" class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium">
                    <span class="mr-1">🌿</span> Bio
                  </span>
                  <span v-if="category.local" class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium">
                    <span class="mr-1">📍</span> Local
                  </span>
                </div>
              </div>

              <!-- Contenu de la carte -->
              <div class="card-content">
                <p class="text-gray-700 mb-6">{{ category.description }}</p>
                
                <!-- Statistiques -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                  <div class="text-center">
                    <p class="text-sm text-gray-500">Produits</p>
                    <p class="text-2xl font-bold text-gray-900">{{ category.productCount }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500">En stock</p>
                    <p class="text-2xl font-bold" :class="getStockColor(category.stockLevel)">
                      {{ category.stockPercentage }}%
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500">Valeur</p>
                    <p class="text-xl font-bold text-gray-900">{{ formatCurrency(category.totalValue) }}</p>
                  </div>
                </div>
                
                <!-- Barre de stock -->
                <div class="mb-6">
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Niveau de stock</span>
                    <span>{{ category.inStock }}/{{ category.totalStock }}</span>
                  </div>
                  <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                         :class="getStockColorClass(category.stockPercentage)"
                         :style="{ width: `${category.stockPercentage}%` }">
                    </div>
                  </div>
                </div>
                
                <!-- Produits populaires -->
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-2">Produits populaires</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="product in category.popularProducts.slice(0, 3)" 
                          :key="product"
                          class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {{ product }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Pied de carte -->
              <div class="card-footer mt-6 pt-6 border-t border-gray-200">
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-green to-green-600 flex items-center justify-center">
                      <span class="text-white text-sm">👨‍🌾</span>
                    </div>
                    <span class="text-sm text-gray-600">{{ category.suppliers }} fournisseurs</span>
                  </div>
                  <button 
                    @click.stop="viewCategory(category)"
                    class="px-4 py-2 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2 group"
                  >
                    <span>Explorer</span>
                    <span class="text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Vue Liste -->
          <div v-else class="animate-fade-in">
            <div class="organic-list-view bg-white/90 backdrop-blur-sm rounded-2xl border border-green-100/50 shadow-sm overflow-hidden">
              <!-- En-tête du tableau -->
              <div class="hidden md:grid grid-cols-12 gap-4 bg-gradient-to-r from-green-50 to-green-100/30 px-6 py-4 border-b border-green-100">
                <div class="col-span-4 text-sm font-semibold text-forest-green">Catégorie</div>
                <div class="col-span-2 text-sm font-semibold text-forest-green">Produits</div>
                <div class="col-span-2 text-sm font-semibold text-forest-green">Stock</div>
                <div class="col-span-2 text-sm font-semibold text-forest-green">Valeur</div>
                <div class="col-span-2 text-sm font-semibold text-forest-green">Actions</div>
              </div>

              <!-- Liste -->
              <div class="divide-y divide-green-50">
                <div 
                  v-for="(category, index) in filteredCategories"
                  :key="category.id"
                  class="px-6 py-5 hover:bg-green-50/50 transition-all duration-300 transition-organic animate-row-appear"
                  :style="{ animationDelay: `${index * 0.05}s` }"
                  @click="viewCategory(category)"
                >
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <!-- Colonne Catégorie -->
                    <div class="col-span-4">
                      <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm"
                             :class="getCategoryColor(category.type).icon">
                          <span class="text-3xl">{{ category.icon }}</span>
                        </div>
                        <div>
                          <h4 class="text-xl font-bold text-gray-900">{{ category.name }}</h4>
                          <p class="text-gray-600">{{ category.subtitle }}</p>
                          <div class="flex flex-wrap gap-2 mt-2">
                            <span v-if="category.seasonal" class="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded">🍂 Saisonnier</span>
                            <span v-if="category.bio" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">🌿 Bio</span>
                            <span v-if="category.local" class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">📍 Local</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Colonne Produits -->
                    <div class="col-span-2">
                      <div class="text-center">
                        <p class="text-2xl font-bold text-gray-900">{{ category.productCount }}</p>
                        <p class="text-sm text-gray-600">produits</p>
                      </div>
                    </div>

                    <!-- Colonne Stock -->
                    <div class="col-span-2">
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-600">Disponible</span>
                          <span class="text-lg font-bold" :class="getStockColor(category.stockLevel)">
                            {{ category.stockPercentage }}%
                          </span>
                        </div>
                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                               :class="getStockColorClass(category.stockPercentage)"
                               :style="{ width: `${category.stockPercentage}%` }">
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Colonne Valeur -->
                    <div class="col-span-2">
                      <div class="text-center">
                        <p class="text-xl font-bold text-gray-900">{{ formatCurrency(category.totalValue) }}</p>
                        <p class="text-sm text-gray-600">valeur totale</p>
                      </div>
                    </div>

                    <!-- Colonne Actions -->
                    <div class="col-span-2">
                      <div class="flex justify-end space-x-2">
                        <button 
                          @click.stop="viewCategory(category)"
                          class="px-4 py-2 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                        >
                          <span class="hidden md:inline">Voir</span>
                          <span class="md:hidden">👁️</span>
                        </button>
                        <button 
                          @click.stop="editCategory(category)"
                          class="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 rounded-lg hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                        >
                          <span class="hidden md:inline">Éditer</span>
                          <span class="md:hidden">✏️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message si pas de résultats -->
          <div v-if="filteredCategories.length === 0" class="text-center py-20 animate-fade-in">
            <div class="text-8xl mb-6 opacity-20">🏷️</div>
            <h3 class="text-2xl font-semibold text-gray-700 mb-3">Aucune catégorie trouvée</h3>
            <p class="text-gray-600 mb-8">Essayez de modifier vos critères de recherche</p>
            <button 
              @click="resetFilters"
              class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105"
            >
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredCategories.length > 0" class="mt-12 animate-fade-in">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
              <p class="text-sm text-gray-600">
                Affichage de {{ filteredCategories.length }} catégories sur {{ categories.length }}
              </p>
              <div class="flex items-center space-x-4">
                <button 
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-organic disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'hover:scale-105': currentPage > 1 }"
                >
                  ← Précédent
                </button>
                <div class="flex space-x-2">
                  <button 
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    class="w-10 h-10 rounded-lg transition-all duration-300 transition-organic"
                    :class="currentPage === page 
                      ? 'bg-gradient-to-r from-primary-green to-green-600 text-white shadow-md' 
                      : 'border border-green-200 hover:bg-green-50 hover:scale-105'"
                  >
                    {{ page }}
                  </button>
                </div>
                <button 
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-organic disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'hover:scale-105': currentPage < totalPages }"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-20 text-center animate-fade-in">
          <div class="bg-gradient-to-r from-primary-green/10 via-green-50/30 to-emerald-50/20 rounded-3xl p-12 border border-primary-green/30">
            <h3 class="text-3xl font-bold text-forest-green mb-4">Une catégorie manquante ?</h3>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Proposez-nous de nouvelles catégories ou produits pour enrichir notre sélection de produits frais
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                @click="addCategory"
                class="px-8 py-4 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center space-x-3 text-lg font-semibold"
              >
                <span class="text-2xl">➕</span>
                <span>Ajouter une catégorie</span>
              </button>
              <button 
                @click="suggestProduct"
                class="px-8 py-4 bg-gradient-to-r from-secondary-orange/10 to-orange-100 border border-secondary-orange/30 text-earth-brown rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center space-x-3 text-lg font-semibold"
              >
                <span class="text-2xl">💡</span>
                <span>Suggérer un produit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton flottant pour mobile -->
    <button 
      @click="addCategory"
      class="md:hidden fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary-green to-green-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 transition-organic z-50 animate-bounce-soft"
    >
      <span class="text-3xl">➕</span>
    </button>

    <!-- Modale de suggestion -->
    <transition name="modal-fade">
      <div v-if="showSuggestionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Contenu de la modale -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-green to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span class="text-4xl text-white">💡</span>
            </div>
            <h3 class="text-3xl font-bold text-forest-green mb-3">Suggérer un produit</h3>
            <p class="text-gray-600">Partagez avec nous vos idées de produits frais</p>
          </div>
          
          <form @submit.prevent="submitSuggestion" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
              <input type="text" class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                <option value="">Sélectionnez une catégorie</option>
                <option v-for="cat in categories" :key="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pourquoi ce produit ?</label>
              <textarea rows="4" class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic"></textarea>
            </div>
            
            <div class="flex justify-end space-x-4 pt-6">
              <button 
                type="button"
                @click="showSuggestionModal = false"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 transition-organic"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105"
              >
                Envoyer la suggestion
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CategoryViews',
  data() {
    return {
      searchQuery: '',
      activeFilters: [],
      sortBy: 'name',
      viewMode: 'grid',
      currentPage: 1,
      itemsPerPage: 9,
      showSuggestionModal: false,
      totalCategories: 8,
      totalProducts: 145,
      activeSuppliers: 32,
      averageStock: 78,
      quickFilters: [
        {
          id: 'bio',
          label: 'Bio',
          icon: '🌿',
          count: 5,
          classes: {
            active: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-green-200 hover:bg-green-50'
          }
        },
        {
          id: 'seasonal',
          label: 'Saisonnier',
          icon: '🍂',
          count: 6,
          classes: {
            active: 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-amber-200 hover:bg-amber-50'
          }
        },
        {
          id: 'local',
          label: 'Local',
          icon: '📍',
          count: 7,
          classes: {
            active: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
          }
        },
        {
          id: 'low-stock',
          label: 'Stock bas',
          icon: '⚠️',
          count: 2,
          classes: {
            active: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-red-200 hover:bg-red-50'
          }
        }
      ],
      categories: [
        {
          id: 1,
          name: 'Fruits Frais',
          subtitle: 'De saison et bio',
          icon: '🍎',
          type: 'fruits',
          description: 'Une sélection de fruits de saison, cultivés localement avec amour et respect de la nature.',
          productCount: 28,
          stockPercentage: 85,
          stockLevel: 'good',
          inStock: 2340,
          totalStock: 2750,
          totalValue: 8450,
          suppliers: 12,
          seasonal: true,
          bio: true,
          local: true,
          popularProducts: ['Pommes Golden', 'Fraises Gariguette', 'Poires Williams']
        },
        {
          id: 2,
          name: 'Légumes de Saison',
          subtitle: 'Du producteur au marché',
          icon: '🥕',
          type: 'legumes',
          description: 'Légumes frais cueillis à maturité, garantissant saveur et nutriments optimaux.',
          productCount: 32,
          stockPercentage: 72,
          stockLevel: 'medium',
          inStock: 1850,
          totalStock: 2560,
          totalValue: 6200,
          suppliers: 15,
          seasonal: true,
          bio: true,
          local: true,
          popularProducts: ['Carottes Nouvelles', 'Tomates Cerises', 'Salades']
        },
        {
          id: 3,
          name: 'Produits Laitiers',
          subtitle: 'Fermiers et artisanaux',
          icon: '🥛',
          type: 'laitiers',
          description: 'Fromages, yaourts et lait provenant de fermes locales qui chérissent leurs animaux.',
          productCount: 18,
          stockPercentage: 65,
          stockLevel: 'medium',
          inStock: 1250,
          totalStock: 1920,
          totalValue: 4850,
          suppliers: 8,
          seasonal: false,
          bio: false,
          local: true,
          popularProducts: ['Fromage de Chèvre', 'Yaourt Nature', 'Beurre Fermier']
        },
        {
          id: 4,
          name: 'Viandes & Volailles',
          subtitle: 'Élevage responsable',
          icon: '🥩',
          type: 'viandes',
          description: 'Viandes issues d\'élevages respectueux, avec une traçabilité totale de la ferme à l\'assiette.',
          productCount: 15,
          stockPercentage: 45,
          stockLevel: 'low',
          inStock: 850,
          totalStock: 1890,
          totalValue: 12800,
          suppliers: 6,
          seasonal: false,
          bio: true,
          local: true,
          popularProducts: ['Poulet Fermier', 'Bœuf Charolais', 'Jambon Sec']
        },
        {
          id: 5,
          name: 'Poissons & Fruits de Mer',
          subtitle: 'Pêche durable',
          icon: '🐟',
          type: 'poissons',
          description: 'Produits de la mer fraîchement débarqués, issus de pêche responsable et durable.',
          productCount: 22,
          stockPercentage: 38,
          stockLevel: 'low',
          inStock: 680,
          totalStock: 1780,
          totalValue: 9500,
          suppliers: 5,
          seasonal: true,
          bio: false,
          local: false,
          popularProducts: ['Saumon Sauvage', 'Moules de Bouchot', 'Cabillaud']
        },
        {
          id: 6,
          name: 'Épicerie Fine',
          subtitle: 'Produits d\'exception',
          icon: '🍯',
          type: 'epicerie',
          description: 'Sélection de produits d\'épicerie fine, miels, huiles et condiments artisanaux.',
          productCount: 24,
          stockPercentage: 92,
          stockLevel: 'good',
          inStock: 2100,
          totalStock: 2280,
          totalValue: 5600,
          suppliers: 10,
          seasonal: false,
          bio: true,
          local: true,
          popularProducts: ['Miel de Lavande', 'Huile d\'Olive', 'Vinaigre Balsamique']
        },
        {
          id: 7,
          name: 'Boissons',
          subtitle: 'Naturelles et rafraîchissantes',
          icon: '🍹',
          type: 'boissons',
          description: 'Jus de fruits pressés, eaux aromatisées et boissons artisanales sans additifs.',
          productCount: 19,
          stockPercentage: 78,
          stockLevel: 'good',
          inStock: 1750,
          totalStock: 2240,
          totalValue: 3200,
          suppliers: 9,
          seasonal: false,
          bio: true,
          local: true,
          popularProducts: ['Jus de Pomme', 'Limonade Artisanale', 'Eau Pétillante']
        },
        {
          id: 8,
          name: 'Pain & Pâtisserie',
          subtitle: 'Fait maison',
          icon: '🥖',
          type: 'boulangerie',
          description: 'Pains au levain, viennoiseries et pâtisseries préparés avec des ingrédients de qualité.',
          productCount: 14,
          stockPercentage: 55,
          stockLevel: 'medium',
          inStock: 950,
          totalStock: 1720,
          totalValue: 2850,
          suppliers: 4,
          seasonal: false,
          bio: false,
          local: true,
          popularProducts: ['Pain au Levain', 'Croissants', 'Tartes aux Fruits']
        }
      ]
    }
  },
  computed: {
    filteredCategories() {
      let filtered = this.categories

      // Filtre par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(category => 
          category.name.toLowerCase().includes(query) ||
          category.subtitle.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query)
        )
      }

      // Filtres rapides
      if (this.activeFilters.length > 0) {
        filtered = filtered.filter(category => {
          if (this.activeFilters.includes('bio') && category.bio) return true
          if (this.activeFilters.includes('seasonal') && category.seasonal) return true
          if (this.activeFilters.includes('local') && category.local) return true
          if (this.activeFilters.includes('low-stock') && category.stockLevel === 'low') return true
          return false
        })
      }

      // Tri
      filtered = [...filtered].sort((a, b) => {
        switch (this.sortBy) {
          case 'stock':
            return b.stockPercentage - a.stockPercentage
          case 'products':
            return b.productCount - a.productCount
          case 'popularity':
            return b.totalValue - a.totalValue
          default:
            return a.name.localeCompare(b.name)
        }
      })

      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.itemsPerPage)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  methods: {
    getCategoryColor(type) {
      const colors = {
        fruits: {
          header: 'bg-gradient-to-r from-red-50/30 via-pink-50/20 to-rose-50/10',
          icon: 'bg-gradient-to-br from-red-100 to-pink-200 text-red-600'
        },
        legumes: {
          header: 'bg-gradient-to-r from-green-50/30 via-emerald-50/20 to-teal-50/10',
          icon: 'bg-gradient-to-br from-green-100 to-emerald-200 text-green-600'
        },
        laitiers: {
          header: 'bg-gradient-to-r from-blue-50/30 via-cyan-50/20 to-sky-50/10',
          icon: 'bg-gradient-to-br from-blue-100 to-cyan-200 text-blue-600'
        },
        viandes: {
          header: 'bg-gradient-to-r from-amber-50/30 via-orange-50/20 to-red-50/10',
          icon: 'bg-gradient-to-br from-amber-100 to-orange-200 text-amber-600'
        },
        poissons: {
          header: 'bg-gradient-to-r from-indigo-50/30 via-violet-50/20 to-purple-50/10',
          icon: 'bg-gradient-to-br from-indigo-100 to-violet-200 text-indigo-600'
        },
        epicerie: {
          header: 'bg-gradient-to-r from-yellow-50/30 via-amber-50/20 to-orange-50/10',
          icon: 'bg-gradient-to-br from-yellow-100 to-amber-200 text-yellow-600'
        },
        boissons: {
          header: 'bg-gradient-to-r from-cyan-50/30 via-sky-50/20 to-blue-50/10',
          icon: 'bg-gradient-to-br from-cyan-100 to-sky-200 text-cyan-600'
        },
        boulangerie: {
          header: 'bg-gradient-to-r from-amber-50/30 via-yellow-50/20 to-orange-50/10',
          icon: 'bg-gradient-to-br from-amber-100 to-yellow-200 text-amber-600'
        }
      }
      return colors[type] || {
        header: 'bg-gradient-to-r from-gray-50/30 via-gray-50/20 to-gray-50/10',
        icon: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
      }
    },
    getStockColor(level) {
      const colors = {
        good: 'text-green-600',
        medium: 'text-amber-600',
        low: 'text-red-600'
      }
      return colors[level] || 'text-gray-600'
    },
    getStockColorClass(percentage) {
      if (percentage >= 70) return 'bg-gradient-to-r from-green-500 to-green-600'
      if (percentage >= 40) return 'bg-gradient-to-r from-amber-500 to-amber-600'
      return 'bg-gradient-to-r from-red-500 to-red-600'
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(amount)
    },
    toggleFilter(filterId) {
      const index = this.activeFilters.indexOf(filterId)
      if (index > -1) {
        this.activeFilters.splice(index, 1)
      } else {
        this.activeFilters.push(filterId)
      }
    },
    resetFilters() {
      this.searchQuery = ''
      this.activeFilters = []
      this.currentPage = 1
    },
    viewCategory(category) {
      console.log('Voir la catégorie:', category)
      this.$emit('view-category', category)
      // Navigation vers la page de détails de la catégorie
    },
    editCategory(category) {
      console.log('Éditer la catégorie:', category)
      this.$emit('edit-category', category)
      // Navigation vers le formulaire d'édition
    },
    addCategory() {
      console.log('Ajouter une catégorie')
      this.$emit('add-category')
      // Navigation vers le formulaire d'ajout
    },
    suggestProduct() {
      this.showSuggestionModal = true
    },
    submitSuggestion() {
      console.log('Suggestion envoyée')
      this.showSuggestionModal = false
      // Logique d'envoi de suggestion
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
    }
  }
}
</script>

<style scoped>
/* Variables de couleur */
:root {
  --primary-green: #45a348;
  --secondary-orange: #ff8c42;
  --forest-green: #2d5016;
  --earth-brown: #8b4513;
}

/* Background organique */
.organic-category-bg {
  background: linear-gradient(135deg, 
    rgba(240, 253, 244, 0.95) 0%,      /* Vert très pâle */
    rgba(220, 252, 231, 0.9) 25%,      /* Vert clair */
    rgba(255, 255, 255, 1) 50%,        /* Blanc */
    rgba(254, 243, 199, 0.9) 75%,      /* Jaune pâle */
    rgba(240, 253, 244, 0.95) 100%     /* Boucle */
  );
  min-height: 100vh;
}

/* Texture de fond */
.category-texture {
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(69, 163, 72, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 140, 66, 0.03) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2345a348' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-size: 200px 200px, 150px 150px, 100px 100px;
}

/* Animation d'entrée */
@keyframes slide-in-down {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes row-appear {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-down {
  animation: slide-in-down 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-card-appear {
  animation: card-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-row-appear {
  animation: row-appear 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Animation des feuilles */
@keyframes leaf-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(5deg);
  }
  66% {
    transform: translateY(5px) rotate(-2deg);
  }
}

.leaf-float {
  animation: leaf-float 15s ease-in-out infinite;
}

/* Animation de rebond doux */
@keyframes bounce-soft {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-soft {
  animation: bounce-soft 2s ease-in-out infinite;
}

/* Animation de pulsation douce */
@keyframes pulse-soft {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-soft {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Carte de catégorie organique */
.organic-category-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
}

.organic-category-card:hover {
  box-shadow: 0 20px 40px rgba(69, 163, 72, 0.15);
}

.organic-category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    var(--primary-green) 0%, 
    var(--secondary-orange) 50%, 
    var(--primary-green) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.organic-category-card:hover::before {
  opacity: 1;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-content {
  padding: 1.5rem;
}

.card-footer {
  padding: 1.5rem;
  background: rgba(249, 250, 251, 0.5);
}

/* Carte de recherche */
.organic-search-card {
  position: relative;
  overflow: hidden;
}

.organic-search-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(69, 163, 72, 0.03) 50%,
    transparent 100%
  );
  transform: rotate(45deg);
  animation: search-shine 20s linear infinite;
}

@keyframes search-shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* Vue liste */
.organic-list-view {
  position: relative;
  overflow: hidden;
}

.organic-list-view::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, 
    var(--primary-green) 0%, 
    rgba(255, 140, 66, 0.2) 50%, 
    var(--primary-green) 100%);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.2;
  pointer-events: none;
}

/* Icone de catégorie */
.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.organic-category-card:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
}

/* Transitions organiques */
.transition-organic {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-duration: 300ms;
}

/* Transition de modale */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .organic-category-card {
    margin-bottom: 1.5rem;
  }
  
  .card-header,
  .card-content,
  .card-footer {
    padding: 1rem;
  }
  
  .category-icon {
    width: 60px;
    height: 60px;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-6xl {
    font-size: 3rem;
  }
}

@media (max-width: 640px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .flex-wrap {
    justify-content: center;
  }
}
</style>