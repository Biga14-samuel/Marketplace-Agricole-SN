<template>
  <div class="min-h-screen organic-dashboard-bg relative overflow-hidden">
    <!-- Animations de fond subtiles -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="leaf-float absolute top-20 left-5 text-6xl text-primary-green/20">🍃</div>
      <div class="leaf-float absolute top-10 right-20 text-5xl text-secondary-orange/20" style="animation-delay: 3s;">🌿</div>
      <div class="leaf-float absolute bottom-32 left-20 text-4xl text-forest-green/20" style="animation-delay: 6s;">🍂</div>
      <div class="leaf-float absolute bottom-10 right-10 text-6xl text-earth-brown/20" style="animation-delay: 9s;">🌱</div>
    </div>

    <!-- Texture de fond organique -->
    <div class="absolute inset-0 organic-grid-texture opacity-5"></div>

    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- En-tête avec navigation -->
      <div class="animate-slide-in-down transition-organic mb-10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-green to-green-600 flex items-center justify-center shadow-lg">
                <span class="text-2xl text-white">⚠️</span>
              </div>
              <div>
                <h1 class="text-4xl font-bold text-forest-green">Alertes de Stock</h1>
                <p class="text-earth-brown/80 text-lg">Surveillance intelligente de vos produits frais</p>
              </div>
            </div>
            
            <!-- Indicateurs rapides -->
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse"></div>
                <span class="text-sm text-gray-700">{{ criticalAlerts }} critiques</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 animate-pulse-soft"></div>
                <span class="text-sm text-gray-700">{{ warningAlerts }} avertissements</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                <span class="text-sm text-gray-700">{{ activeAlerts }} actives</span>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="createNewAlert"
              class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center space-x-2 group"
            >
              <span class="text-xl group-hover:animate-bounce">➕</span>
              <span class="font-semibold">Nouvelle Alerte</span>
              <span class="text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">✨</span>
            </button>
            
            <button 
              @click="toggleViewMode"
              class="px-6 py-3 bg-gradient-to-r from-secondary-orange/10 to-orange-100 border border-secondary-orange/30 text-earth-brown rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span class="text-xl">{{ viewMode === 'grid' ? '📋' : '🔍' }}</span>
              <span>{{ viewMode === 'grid' ? 'Vue détaillée' : 'Vue grille' }}</span>
            </button>
          </div>
        </div>

        <!-- Statistiques en temps réel -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="organic-stat-card animate-stat-card" style="animation-delay: 0.1s;">
            <div class="card-inner">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500">Alertes Actives</p>
                  <p class="text-3xl font-bold text-forest-green mt-2">{{ totalAlerts }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span class="text-2xl text-green-600">📊</span>
                </div>
              </div>
              <div class="mt-4">
                <div class="h-2 bg-green-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" 
                       :style="{ width: `${(activeAlerts / totalAlerts) * 100}%` }"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ activeAlerts }} sur {{ totalAlerts }} actives</p>
              </div>
            </div>
          </div>

          <div class="organic-stat-card animate-stat-card" style="animation-delay: 0.2s;">
            <div class="card-inner">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500">En Attente</p>
                  <p class="text-3xl font-bold text-amber-600 mt-2">{{ pendingAlerts }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <span class="text-2xl text-amber-600">⏳</span>
                </div>
              </div>
              <div class="mt-4">
                <div class="h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" 
                       :style="{ width: `${(pendingAlerts / totalAlerts) * 100}%` }"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Nécessitent votre attention</p>
              </div>
            </div>
          </div>

          <div class="organic-stat-card animate-stat-card" style="animation-delay: 0.3s;">
            <div class="card-inner">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500">Résolues (7j)</p>
                  <p class="text-3xl font-bold text-blue-600 mt-2">{{ resolvedAlerts }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span class="text-2xl text-blue-600">✅</span>
                </div>
              </div>
              <div class="mt-4">
                <div class="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" 
                       :style="{ width: `${Math.min((resolvedAlerts / 50) * 100, 100)}%` }"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Progression hebdomadaire</p>
              </div>
            </div>
          </div>

          <div class="organic-stat-card animate-stat-card" style="animation-delay: 0.4s;">
            <div class="card-inner">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500">Moyenne Réponse</p>
                  <p class="text-3xl font-bold text-purple-600 mt-2">{{ averageResponseTime }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <span class="text-2xl text-purple-600">⚡</span>
                </div>
              </div>
              <div class="mt-4">
                <div class="h-2 bg-purple-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" 
                       :style="{ width: '85%' }"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Réponse rapide aux alertes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres et recherche -->
        <div class="organic-filter-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-green-100/50 shadow-sm animate-fade-in">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Barre de recherche -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-forest-green mb-2">Rechercher une alerte</label>
              <div class="relative">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Rechercher par produit, statut ou message..."
                  class="w-full px-4 py-3 pl-12 bg-white/70 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic"
                >
                <span class="absolute left-4 top-3.5 text-xl text-green-500">🔍</span>
                <button 
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-organic"
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
                class="px-4 py-2 rounded-lg border transition-all duration-300 transition-organic hover:scale-105"
                :class="[
                  activeFilters.includes(filter.id) 
                    ? filter.classes.active 
                    : filter.classes.inactive
                ]"
              >
                <span class="flex items-center space-x-2">
                  <span>{{ filter.icon }}</span>
                  <span>{{ filter.label }}</span>
                  <span v-if="filter.count" class="text-xs px-1.5 py-0.5 rounded-full bg-white/50">
                    {{ filter.count }}
                  </span>
                </span>
              </button>
            </div>
          </div>

          <!-- Filtres avancés -->
          <div class="mt-6 pt-6 border-t border-green-100">
            <div class="flex flex-wrap gap-6">
              <div>
                <label class="block text-sm font-medium text-forest-green mb-2">Catégorie</label>
                <select 
                  v-model="categoryFilter"
                  class="px-4 py-2 bg-white/70 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="fruits">🍎 Fruits</option>
                  <option value="legumes">🥕 Légumes</option>
                  <option value="produits-laitiers">🥛 Produits laitiers</option>
                  <option value="viandes">🥩 Viandes</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-forest-green mb-2">Période</label>
                <select 
                  v-model="periodFilter"
                  class="px-4 py-2 bg-white/70 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic"
                >
                  <option value="24h">Dernières 24h</option>
                  <option value="7j">7 derniers jours</option>
                  <option value="30j">30 derniers jours</option>
                  <option value="all">Tout</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-forest-green mb-2">Priorité</label>
                <select 
                  v-model="priorityFilter"
                  class="px-4 py-2 bg-white/70 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic"
                >
                  <option value="">Toutes</option>
                  <option value="critical">🔥 Critique</option>
                  <option value="high">⚠️ Haute</option>
                  <option value="medium">📢 Moyenne</option>
                  <option value="low">📝 Faible</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des alertes -->
      <div v-if="viewMode === 'grid'" class="animate-fade-in">
        <!-- En-tête du tableau -->
        <div class="hidden md:block organic-table-header bg-gradient-to-r from-green-50 to-green-100/50 rounded-t-2xl px-6 py-4 border border-green-100/50">
          <div class="grid grid-cols-12 gap-4 text-sm font-semibold text-forest-green">
            <div class="col-span-4">Alerte</div>
            <div class="col-span-2">Produit</div>
            <div class="col-span-2">Statut</div>
            <div class="col-span-2">Déclenchée</div>
            <div class="col-span-2">Actions</div>
          </div>
        </div>

        <!-- Liste des alertes en tableau -->
        <div class="bg-white/80 backdrop-blur-sm rounded-b-2xl md:rounded-2xl border border-green-100/50 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <div v-if="filteredAlerts.length === 0" class="text-center py-16">
              <div class="text-6xl mb-4">📭</div>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Aucune alerte trouvée</h3>
              <p class="text-gray-500">Essayez de modifier vos filtres ou créez une nouvelle alerte</p>
            </div>

            <div v-for="(alert, index) in filteredAlerts" 
                 :key="alert.id"
                 class="border-b border-green-50 last:border-b-0 hover:bg-green-50/50 transition-all duration-300 transition-organic animate-row-appear"
                 :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="px-6 py-5">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <!-- Colonne Alerte -->
                  <div class="col-span-4">
                    <div class="flex items-start space-x-4">
                      <div class="relative">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                             :class="getAlertColorClasses(alert.priority).bg">
                          <span class="text-2xl">{{ getAlertIcon(alert.type) }}</span>
                        </div>
                        <div v-if="alert.unread" class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                      </div>
                      <div class="flex-1">
                        <p class="font-semibold text-gray-800">{{ alert.title }}</p>
                        <p class="text-sm text-gray-600 mt-1">{{ alert.description }}</p>
                        <div class="flex flex-wrap gap-2 mt-2">
                          <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                                :class="getAlertColorClasses(alert.priority).badge">
                            {{ getPriorityLabel(alert.priority) }}
                          </span>
                          <span v-if="alert.category" class="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                            {{ getCategoryIcon(alert.category) }} {{ getCategoryLabel(alert.category) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Colonne Produit -->
                  <div class="col-span-2">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <span class="text-lg">{{ getProductIcon(alert.productType) }}</span>
                      </div>
                      <div>
                        <p class="font-medium text-gray-800">{{ alert.productName }}</p>
                        <p class="text-sm text-gray-500">Stock: {{ alert.currentStock }}/{{ alert.threshold }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Colonne Statut -->
                  <div class="col-span-2">
                    <div class="flex items-center space-x-2">
                      <div class="relative">
                        <div class="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                             :class="getStatusColorClasses(alert.status).circle"></div>
                        <div class="absolute inset-1 rounded-full animate-pulse-soft"
                             :class="getStatusColorClasses(alert.status).pulse"></div>
                      </div>
                      <div>
                        <p class="font-medium" :class="getStatusColorClasses(alert.status).text">
                          {{ getStatusLabel(alert.status) }}
                        </p>
                        <p v-if="alert.lastTriggered" class="text-xs text-gray-500">
                          {{ formatTimeAgo(alert.lastTriggered) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Colonne Déclenchée -->
                  <div class="col-span-2">
                    <p class="font-medium text-gray-700">{{ formatDate(alert.createdAt) }}</p>
                    <p class="text-sm text-gray-500">{{ formatTime(alert.createdAt) }}</p>
                    <div v-if="alert.triggerCount > 0" class="inline-flex items-center px-2 py-1 mt-1 bg-blue-50 text-blue-700 rounded text-xs">
                      🔥 {{ alert.triggerCount }} déclenchement(s)
                    </div>
                  </div>

                  <!-- Colonne Actions -->
                  <div class="col-span-2">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewAlertDetails(alert)"
                        class="p-2 rounded-lg bg-gradient-to-r from-primary-green/10 to-green-100 text-primary-green hover:from-primary-green/20 hover:to-green-200 transition-all duration-300 transition-organic hover:scale-110"
                        title="Voir les détails"
                      >
                        <span class="text-lg">👁️</span>
                      </button>
                      <button 
                        @click="editAlert(alert)"
                        class="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transition-organic hover:scale-110"
                        title="Modifier"
                      >
                        <span class="text-lg">✏️</span>
                      </button>
                      <button 
                        @click="toggleAlertStatus(alert)"
                        class="p-2 rounded-lg transition-all duration-300 transition-organic hover:scale-110"
                        :class="alert.status === 'active' 
                          ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-600 hover:from-amber-100 hover:to-amber-200'
                          : 'bg-gradient-to-r from-green-50 to-green-100 text-green-600 hover:from-green-100 hover:to-green-200'"
                        :title="alert.status === 'active' ? 'Désactiver' : 'Activer'"
                      >
                        <span class="text-lg">{{ alert.status === 'active' ? '⏸️' : '▶️' }}</span>
                      </button>
                      <button 
                        @click="deleteAlert(alert)"
                        class="p-2 rounded-lg bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 transition-all duration-300 transition-organic hover:scale-110"
                        title="Supprimer"
                      >
                        <span class="text-lg">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue cartes -->
      <div v-else class="animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(alert, index) in filteredAlerts" 
            :key="'card-' + alert.id"
            class="organic-alert-card transform transition-all duration-500 transition-organic hover:scale-[1.02] animate-card-appear"
            :style="{ animationDelay: `${index * 0.1}s` }"
            :class="getAlertColorClasses(alert.priority).card"
          >
            <!-- En-tête de la carte -->
            <div class="card-header">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                         :class="getAlertColorClasses(alert.priority).iconBg">
                      <span class="text-2xl">{{ getAlertIcon(alert.type) }}</span>
                    </div>
                    <div v-if="alert.unread" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900">{{ alert.title }}</h3>
                    <p class="text-sm text-gray-600">{{ alert.productName }}</p>
                  </div>
                </div>
                <div class="flex space-x-1">
                  <button 
                    @click="toggleAlertStatus(alert)"
                    class="p-1.5 rounded-lg bg-white/50 hover:bg-white transition-organic"
                    :title="alert.status === 'active' ? 'Désactiver' : 'Activer'"
                  >
                    <span class="text-lg">{{ alert.status === 'active' ? '⏸️' : '▶️' }}</span>
                  </button>
                </div>
              </div>

              <!-- Badges -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                      :class="getAlertColorClasses(alert.priority).badge">
                  {{ getPriorityLabel(alert.priority) }}
                </span>
                <span class="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {{ getCategoryIcon(alert.category) }} {{ getCategoryLabel(alert.category) }}
                </span>
                <span class="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-700">
                  {{ getAlertIcon(alert.type) }} {{ getTypeLabel(alert.type) }}
                </span>
              </div>
            </div>

            <!-- Contenu de la carte -->
            <div class="card-content">
              <p class="text-gray-700 mb-4">{{ alert.description }}</p>
              
              <!-- Indicateur de stock -->
              <div class="mb-6">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Niveau de stock</span>
                  <span class="font-semibold">{{ alert.currentStock }} / {{ alert.threshold }}</span>
                </div>
                <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                       :class="getStockLevelClass(alert.currentStock, alert.threshold)"
                       :style="{ width: `${Math.min((alert.currentStock / alert.threshold) * 100, 100)}%` }"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Critique</span>
                  <span>Bon niveau</span>
                </div>
              </div>

              <!-- Informations supplémentaires -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Dernier déclenchement</p>
                  <p class="font-medium text-gray-800">{{ formatDate(alert.lastTriggered) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Fréquence</p>
                  <p class="font-medium text-gray-800">{{ getFrequencyLabel(alert.frequency) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Créée le</p>
                  <p class="font-medium text-gray-800">{{ formatDate(alert.createdAt) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Statut</p>
                  <p :class="['font-medium', getStatusColorClasses(alert.status).text]">
                    {{ getStatusLabel(alert.status) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions de la carte -->
            <div class="card-footer mt-6 pt-6 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <div v-if="alert.notifications" class="flex space-x-1">
                    <span v-if="alert.notifications.email" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📧</span>
                    <span v-if="alert.notifications.sms" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">📱</span>
                    <span v-if="alert.notifications.push" class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">🔔</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="viewAlertDetails(alert)"
                    class="px-4 py-2 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                  >
                    Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredAlerts.length > 0" class="mt-8 animate-fade-in">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-600">
            Affichage de {{ filteredAlerts.length }} alertes sur {{ alerts.length }}
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

      <!-- Bouton flottant pour mobile -->
      <button 
        @click="createNewAlert"
        class="md:hidden fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary-green to-green-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 transition-organic z-50 animate-bounce-soft"
      >
        <span class="text-2xl">➕</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockAlertList',
  data() {
    return {
      viewMode: 'grid',
      searchQuery: '',
      activeFilters: [],
      categoryFilter: '',
      periodFilter: '7j',
      priorityFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      alerts: [
        {
          id: 1,
          title: 'Stock critique de pommes',
          description: 'Les pommes Golden Bio approchent du seuil critique',
          productName: 'Pommes Golden Bio',
          productType: 'fruits',
          productCode: 'POM-BIO-001',
          category: 'fruits',
          type: 'stock',
          priority: 'critical',
          status: 'active',
          currentStock: 15,
          threshold: 50,
          createdAt: '2024-01-15T09:30:00',
          lastTriggered: '2024-01-15T14:20:00',
          triggerCount: 3,
          frequency: 'realtime',
          notifications: {
            email: true,
            sms: true,
            push: true
          },
          unread: true
        },
        {
          id: 2,
          title: 'Avertissement carottes',
          description: 'Le stock de carottes nouvelles est bas',
          productName: 'Carottes Nouvelles',
          productType: 'legumes',
          productCode: 'CAR-NEW-002',
          category: 'legumes',
          type: 'stock',
          priority: 'high',
          status: 'active',
          currentStock: 65,
          threshold: 100,
          createdAt: '2024-01-14T11:15:00',
          lastTriggered: '2024-01-14T16:45:00',
          triggerCount: 1,
          frequency: 'daily',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          unread: false
        },
        {
          id: 3,
          title: 'Date de péremption proche',
          description: 'Les salades Batavia approchent de la date limite',
          productName: 'Salade Batavia',
          productType: 'legumes',
          productCode: 'SAL-BAT-003',
          category: 'legumes',
          type: 'expiration',
          priority: 'medium',
          status: 'pending',
          currentStock: 200,
          threshold: 300,
          createdAt: '2024-01-13T10:30:00',
          lastTriggered: null,
          triggerCount: 0,
          frequency: 'daily',
          notifications: {
            email: true,
            sms: false,
            push: false
          },
          unread: true
        },
        {
          id: 4,
          title: 'Réapprovisionnement réussi',
          description: 'Les tomates cerises ont été réapprovisionnées',
          productName: 'Tomates Cerises',
          productType: 'fruits',
          productCode: 'TOM-CER-004',
          category: 'fruits',
          type: 'replenishment',
          priority: 'low',
          status: 'resolved',
          currentStock: 180,
          threshold: 120,
          createdAt: '2024-01-12T14:20:00',
          lastTriggered: '2024-01-11T09:15:00',
          triggerCount: 2,
          frequency: 'weekly',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          unread: false
        },
        {
          id: 5,
          title: 'Stock anormalement élevé',
          description: 'Le stock d\'oignons dépasse les prévisions',
          productName: 'Oignons Jaunes',
          productType: 'legumes',
          productCode: 'OIG-JAU-005',
          category: 'legumes',
          type: 'excess',
          priority: 'medium',
          status: 'active',
          currentStock: 450,
          threshold: 300,
          createdAt: '2024-01-11T16:45:00',
          lastTriggered: null,
          triggerCount: 0,
          frequency: 'weekly',
          notifications: {
            email: true,
            sms: false,
            push: false
          },
          unread: false
        }
      ],
      quickFilters: [
        {
          id: 'critical',
          label: 'Critiques',
          icon: '🔥',
          count: 2,
          classes: {
            active: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-red-200 hover:bg-red-50'
          }
        },
        {
          id: 'active',
          label: 'Actives',
          icon: '⚠️',
          count: 4,
          classes: {
            active: 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-amber-200 hover:bg-amber-50'
          }
        },
        {
          id: 'unread',
          label: 'Non lues',
          icon: '📬',
          count: 2,
          classes: {
            active: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
          }
        },
        {
          id: 'fruits',
          label: 'Fruits',
          icon: '🍎',
          count: 2,
          classes: {
            active: 'bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200 text-pink-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-pink-200 hover:bg-pink-50'
          }
        },
        {
          id: 'legumes',
          label: 'Légumes',
          icon: '🥕',
          count: 3,
          classes: {
            active: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700',
            inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-green-200 hover:bg-green-50'
          }
        }
      ]
    }
  },
  computed: {
    filteredAlerts() {
      let filtered = this.alerts

      // Filtre par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(alert => 
          alert.title.toLowerCase().includes(query) ||
          alert.description.toLowerCase().includes(query) ||
          alert.productName.toLowerCase().includes(query) ||
          alert.productCode.toLowerCase().includes(query)
        )
      }

      // Filtres rapides
      if (this.activeFilters.length > 0) {
        filtered = filtered.filter(alert => {
          if (this.activeFilters.includes('critical') && alert.priority === 'critical') return true
          if (this.activeFilters.includes('active') && alert.status === 'active') return true
          if (this.activeFilters.includes('unread') && alert.unread) return true
          if (this.activeFilters.includes('fruits') && alert.category === 'fruits') return true
          if (this.activeFilters.includes('legumes') && alert.category === 'legumes') return true
          return this.activeFilters.some(filter => 
            alert.type === filter || alert.priority === filter || alert.status === filter
          )
        })
      }

      // Filtre par catégorie
      if (this.categoryFilter) {
        filtered = filtered.filter(alert => alert.category === this.categoryFilter)
      }

      // Filtre par priorité
      if (this.priorityFilter) {
        filtered = filtered.filter(alert => alert.priority === this.priorityFilter)
      }

      // Filtre par période
      if (this.periodFilter !== 'all') {
        const now = new Date()
        let cutoff = new Date()
        
        switch(this.periodFilter) {
          case '24h':
            cutoff.setDate(now.getDate() - 1)
            break
          case '7j':
            cutoff.setDate(now.getDate() - 7)
            break
          case '30j':
            cutoff.setDate(now.getDate() - 30)
            break
        }
        
        filtered = filtered.filter(alert => new Date(alert.createdAt) >= cutoff)
      }

      return filtered
    },
    totalAlerts() {
      return this.alerts.length
    },
    activeAlerts() {
      return this.alerts.filter(a => a.status === 'active').length
    },
    criticalAlerts() {
      return this.alerts.filter(a => a.priority === 'critical').length
    },
    warningAlerts() {
      return this.alerts.filter(a => a.priority === 'high').length
    },
    pendingAlerts() {
      return this.alerts.filter(a => a.status === 'pending').length
    },
    resolvedAlerts() {
      return this.alerts.filter(a => a.status === 'resolved').length
    },
    averageResponseTime() {
      return '2h 15m'
    },
    totalPages() {
      return Math.ceil(this.filteredAlerts.length / this.itemsPerPage)
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
    getAlertColorClasses(priority) {
      const classes = {
        critical: {
          bg: 'bg-gradient-to-br from-red-100 to-red-200',
          iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
          badge: 'bg-red-100 text-red-800',
          card: 'border-l-4 border-red-500',
          text: 'text-red-600'
        },
        high: {
          bg: 'bg-gradient-to-br from-amber-100 to-amber-200',
          iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
          badge: 'bg-amber-100 text-amber-800',
          card: 'border-l-4 border-amber-500',
          text: 'text-amber-600'
        },
        medium: {
          bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
          iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          badge: 'bg-blue-100 text-blue-800',
          card: 'border-l-4 border-blue-500',
          text: 'text-blue-600'
        },
        low: {
          bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
          iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600',
          badge: 'bg-gray-100 text-gray-800',
          card: 'border-l-4 border-gray-500',
          text: 'text-gray-600'
        }
      }
      return classes[priority] || classes.medium
    },
    getStatusColorClasses(status) {
      const classes = {
        active: {
          circle: 'bg-green-500',
          pulse: 'bg-green-400',
          text: 'text-green-600'
        },
        pending: {
          circle: 'bg-amber-500',
          pulse: 'bg-amber-400',
          text: 'text-amber-600'
        },
        resolved: {
          circle: 'bg-blue-500',
          pulse: 'bg-blue-400',
          text: 'text-blue-600'
        },
        disabled: {
          circle: 'bg-gray-500',
          pulse: 'bg-gray-400',
          text: 'text-gray-600'
        }
      }
      return classes[status] || classes.active
    },
    getAlertIcon(type) {
      const icons = {
        stock: '📉',
        expiration: '⏰',
        replenishment: '📈',
        excess: '📊',
        quality: '⭐'
      }
      return icons[type] || '⚠️'
    },
    getProductIcon(type) {
      const icons = {
        fruits: '🍎',
        legumes: '🥕',
        'produits-laitiers': '🥛',
        viandes: '🥩',
        poissons: '🐟',
        epicerie: '🥫'
      }
      return icons[type] || '📦'
    },
    getCategoryIcon(category) {
      const icons = {
        fruits: '🍎',
        legumes: '🥕',
        'produits-laitiers': '🥛',
        viandes: '🥩'
      }
      return icons[category] || '📦'
    },
    getPriorityLabel(priority) {
      const labels = {
        critical: 'Critique',
        high: 'Haute',
        medium: 'Moyenne',
        low: 'Faible'
      }
      return labels[priority] || priority
    },
    getStatusLabel(status) {
      const labels = {
        active: 'Active',
        pending: 'En attente',
        resolved: 'Résolue',
        disabled: 'Désactivée'
      }
      return labels[status] || status
    },
    getCategoryLabel(category) {
      const labels = {
        fruits: 'Fruits',
        legumes: 'Légumes',
        'produits-laitiers': 'Produits laitiers',
        viandes: 'Viandes'
      }
      return labels[category] || category
    },
    getTypeLabel(type) {
      const labels = {
        stock: 'Stock bas',
        expiration: 'Péremption',
        replenishment: 'Réappro',
        excess: 'Excès',
        quality: 'Qualité'
      }
      return labels[type] || type
    },
    getFrequencyLabel(frequency) {
      const labels = {
        realtime: 'Temps réel',
        daily: 'Quotidien',
        weekly: 'Hebdomadaire',
        monthly: 'Mensuel'
      }
      return labels[frequency] || frequency
    },
    getStockLevelClass(current, threshold) {
      const percentage = (current / threshold) * 100
      if (percentage < 30) return 'bg-gradient-to-r from-red-500 to-red-600'
      if (percentage < 60) return 'bg-gradient-to-r from-amber-500 to-amber-600'
      return 'bg-gradient-to-r from-green-500 to-green-600'
    },
    formatDate(dateString) {
      if (!dateString) return '—'
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    formatTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatTimeAgo(dateString) {
      if (!dateString) return 'Jamais'
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 60) return `Il y a ${diffMins} min`
      if (diffHours < 24) return `Il y a ${diffHours} h`
      if (diffDays < 7) return `Il y a ${diffDays} j`
      return this.formatDate(dateString)
    },
    toggleFilter(filterId) {
      const index = this.activeFilters.indexOf(filterId)
      if (index > -1) {
        this.activeFilters.splice(index, 1)
      } else {
        this.activeFilters.push(filterId)
      }
    },
    toggleViewMode() {
      this.viewMode = this.viewMode === 'grid' ? 'cards' : 'grid'
    },
    viewAlertDetails(alert) {
      console.log('Voir les détails de l\'alerte:', alert)
      // Navigation vers la page de détails
    },
    editAlert(alert) {
      console.log('Modifier l\'alerte:', alert)
      // Navigation vers le formulaire d'édition
    },
    toggleAlertStatus(alert) {
      alert.status = alert.status === 'active' ? 'disabled' : 'active'
      console.log('Changement de statut pour:', alert)
    },
    deleteAlert(alert) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer l'alerte "${alert.title}" ?`)) {
        const index = this.alerts.findIndex(a => a.id === alert.id)
        if (index > -1) {
          this.alerts.splice(index, 1)
          console.log('Alerte supprimée:', alert)
        }
      }
    },
    createNewAlert() {
      console.log('Créer une nouvelle alerte')
      // Navigation vers le formulaire de création
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
/* Variables de couleur cohérentes */
:root {
  --primary-green: #45a348;
  --secondary-orange: #ff8c42;
  --forest-green: #2d5016;
  --earth-brown: #8b4513;
}

/* Background organique pour tableau de bord */
.organic-dashboard-bg {
  background: linear-gradient(135deg, 
    rgba(240, 253, 244, 0.9) 0%,      /* Vert très pâle */
    rgba(220, 252, 231, 0.8) 20%,     /* Vert clair */
    rgba(255, 255, 255, 1) 40%,       /* Blanc */
    rgba(255, 247, 237, 0.9) 60%,     /* Orange pâle */
    rgba(254, 243, 199, 0.8) 80%,     /* Jaune pâle */
    rgba(240, 253, 244, 0.9) 100%     /* Boucle */
  );
  min-height: 100vh;
}

/* Texture de grille organique */
.organic-grid-texture {
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(69, 163, 72, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 140, 66, 0.03) 0%, transparent 50%),
    linear-gradient(45deg, transparent 49%, rgba(69, 163, 72, 0.02) 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, rgba(255, 140, 66, 0.02) 50%, transparent 51%);
  background-size: 100px 100px, 150px 150px, 20px 20px, 20px 20px;
}

/* Cartes de statistiques */
.organic-stat-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(69, 163, 72, 0.1);
  border-radius: 20px;
  padding: 1px;
  position: relative;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.organic-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(69, 163, 72, 0.1);
}

.organic-stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, 
    var(--primary-green) 0%, 
    transparent 30%, 
    var(--secondary-orange) 70%, 
    transparent 100%);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.3;
}

.card-inner {
  background: white;
  border-radius: 19px;
  padding: 1.5rem;
  height: 100%;
}

/* Animation pour les cartes de statistiques */
@keyframes stat-card-appear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-stat-card {
  animation: stat-card-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
}

/* Cartes d'alerte */
.organic-alert-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.organic-alert-card::before {
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

.organic-alert-card:hover::before {
  opacity: 1;
}

/* Animation d'apparition des cartes */
@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(20px) rotateX(-10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.animate-card-appear {
  animation: card-appear 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Animation d'apparition des lignes */
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

.animate-row-appear {
  animation: row-appear 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Carte de filtres */
.organic-filter-card {
  position: relative;
  overflow: hidden;
}

.organic-filter-card::after {
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
  animation: filter-shine 20s linear infinite;
}

@keyframes filter-shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* En-tête de tableau */
.organic-table-header {
  position: relative;
  overflow: hidden;
}

.organic-table-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 50%, 
    transparent 100%);
  transform: translateX(-100%);
  animation: table-shine 3s infinite;
}

@keyframes table-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
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
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Transitions organiques */
.transition-organic {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-duration: 300ms;
}
</style>