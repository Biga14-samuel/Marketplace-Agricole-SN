<template>
    <div class="pickup-points-view min-h-screen">
        <!-- Arrière-plan organique avec dégradé et animation -->
        <div class="fixed inset-0 -z-20 bg-gradient-to-br from-forest-25/95 via-cream-40/90 to-terracotta-30/85">
            <div class="absolute inset-0 bg-road-pattern opacity-5"></div>
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-forest-500/15 to-transparent"></div>
        </div>

        <!-- Navigation supérieure -->
        <nav class="sticky top-0 z-30 backdrop-blur-xl bg-white/85 border-b border-forest-100/30 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex items-center space-x-3">
                        <router-link to="/producer/dashboard"
                            class="p-2 rounded-full hover:bg-forest-50 transition-all duration-300 ease-organic">
                            <span class="text-xl">⬅️</span>
                        </router-link>
                        <div>
                            <h1 class="text-2xl lg:text-3xl font-serif font-bold text-forest-800">
                                📍 Points de retrait
                            </h1>
                            <p class="text-sm text-terracotta-600">
                                Gérez les lieux où vos clients peuvent récupérer leurs commandes
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <router-link to="/producer/settings"
                            class="px-4 py-3 bg-white text-forest-700 border border-forest-200 rounded-xl shadow-sm hover:shadow-md hover:bg-forest-50 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>⚙️</span>
                            <span class="hidden sm:inline">Paramètres</span>
                        </router-link>
                        <!-- Vue carte/liste -->
                        <div class="flex bg-forest-50 rounded-lg p-1">
                            <button @click="viewMode = 'list'"
                                class="p-2 rounded-md transition-all duration-300 ease-organic"
                                :class="viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'">
                                <span class="text-lg">📋</span>
                            </button>
                            <button @click="viewMode = 'map'"
                                class="p-2 rounded-md transition-all duration-300 ease-organic"
                                :class="viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-white/50'">
                                <span class="text-lg">🗺️</span>
                            </button>
                        </div>

                        <!-- Nouveau point de retrait -->
                        <button @click="openNewPointModal"
                            class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>➕</span>
                            <span>Nouveau point</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Vue liste ou carte -->
            <transition mode="out-in" enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-500 ease-organic"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
                <!-- Vue liste -->
                <section v-if="viewMode === 'list'" key="list" class="space-y-8">
                    <!-- Statistiques -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
                        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="p-3 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                                    <span class="text-2xl">📍</span>
                                </div>
                                <span class="text-xs px-2 py-1 bg-forest-50 text-forest-700 rounded-full">
                                    Total
                                </span>
                            </div>
                            <div class="text-3xl font-bold text-forest-800">{{ pickupPoints.length }}</div>
                            <div class="text-sm text-terracotta-600">Points de retrait</div>
                        </div>

                        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl">
                                    <span class="text-2xl">✅</span>
                                </div>
                                <span class="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                                    Actifs
                                </span>
                            </div>
                            <div class="text-3xl font-bold text-forest-800">{{ activePointsCount }}</div>
                            <div class="text-sm text-terracotta-600">Points actifs</div>
                        </div>

                        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                                    <span class="text-2xl">📅</span>
                                </div>
                                <span class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                    Créneaux
                                </span>
                            </div>
                            <div class="text-3xl font-bold text-forest-800">{{ totalSlots }}</div>
                            <div class="text-sm text-terracotta-600">Créneaux configurés</div>
                        </div>

                        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl">
                                    <span class="text-2xl">📦</span>
                                </div>
                                <span class="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                                    Ce mois
                                </span>
                            </div>
                            <div class="text-3xl font-bold text-forest-800">{{ totalUpcomingOrders }}</div>
                            <div class="text-sm text-terracotta-600">Commandes planifiées</div>
                        </div>
                    </div>

                    <!-- Liste des points de retrait -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden animate-slide-up"
                        style="animation-delay: 100ms">
                        <div
                            class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">🗺️</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Tous vos points de retrait
                                    </h2>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="relative">
                                        <input v-model="searchQuery" type="text" placeholder="Rechercher un point..."
                                            class="pl-10 pr-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                                        <span class="absolute left-3 top-2.5 text-forest-400">🔍</span>
                                    </div>
                                    <select v-model="statusFilter"
                                        class="px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                        <option value="all">Tous les statuts</option>
                                        <option value="active">Actifs uniquement</option>
                                        <option value="inactive">Inactifs</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="p-6">
                            <div v-if="filteredPoints.length === 0" class="text-center py-16">
                                <span class="text-6xl block mb-6">📍</span>
                                <h3 class="text-xl font-serif font-semibold text-forest-800 mb-2">
                                    Aucun point de retrait trouvé
                                </h3>
                                <p class="text-terracotta-600 mb-6">
                                    {{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Commencez par ajouter votre premier point de retrait' }}
                                </p>
                                <button @click="openNewPointModal"
                                    class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-organic flex items-center space-x-2 mx-auto">
                                    <span>➕</span>
                                    <span>Créer mon premier point</span>
                                </button>
                            </div>

                            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div v-for="point in filteredPoints" :key="point.id"
                                    class="border border-forest-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-forest-200 transition-all duration-300 ease-organic group"
                                    :class="{ 'opacity-60': !point.is_active }">
                                    <!-- En-tête de la carte -->
                                    <div
                                        class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30 flex items-center justify-between">
                                        <div class="flex items-center space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm">
                                                <span class="text-xl">{{ point.icon }}</span>
                                            </div>
                                            <div>
                                                <h3 class="font-serif font-semibold text-forest-800">{{ point.name }}
                                                </h3>
                                                <div class="flex items-center space-x-2 text-sm">
                                                    <span class="px-2 py-1 rounded-full"
                                                        :class="point.is_active ? 'bg-green-100 text-green-700' : 'bg-terracotta-100 text-terracotta-700'">
                                                        {{ point.is_active ? '✅ Actif' : '⏸️ Inactif' }}
                                                    </span>
                                                    <span class="text-terracotta-600">{{ point.type }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <button @click="togglePointStatus(point)"
                                                class="p-2 hover:bg-white rounded-lg transition-colors"
                                                :title="point.is_active ? 'Désactiver' : 'Activer'">
                                                <span>{{ point.is_active ? '⏸️' : '▶️' }}</span>
                                            </button>
                                            <button @click="editPoint(point)"
                                                class="p-2 hover:bg-white rounded-lg transition-colors">
                                                <span>✏️</span>
                                            </button>
                                            <button @click="deletePoint(point)"
                                                class="p-2 hover:bg-white rounded-lg transition-colors">
                                                <span>🗑️</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Contenu de la carte -->
                                    <div class="p-6 bg-white">
                                        <div class="space-y-4">
                                            <!-- Adresse -->
                                            <div class="flex items-start space-x-3">
                                                <div class="p-2 bg-forest-50 rounded-lg">
                                                    <span class="text-lg">🏠</span>
                                                </div>
                                                <div class="flex-1">
                                                    <div class="text-sm font-medium text-forest-700">Adresse</div>
                                                    <div class="text-terracotta-600">{{ point.address }}</div>
                                                </div>
                                            </div>

                                            <!-- Horaires -->
                                            <div class="flex items-start space-x-3">
                                                <div class="p-2 bg-forest-50 rounded-lg">
                                                    <span class="text-lg">🕒</span>
                                                </div>
                                                <div class="flex-1">
                                                    <div class="text-sm font-medium text-forest-700">Horaires</div>
                                                    <div class="text-terracotta-600">
                                                        {{ point.schedule_summary || 'Non configuré' }}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Instructions -->
                                            <div v-if="point.instructions" class="flex items-start space-x-3">
                                                <div class="p-2 bg-forest-50 rounded-lg">
                                                    <span class="text-lg">📋</span>
                                                </div>
                                                <div class="flex-1">
                                                    <div class="text-sm font-medium text-forest-700">Instructions</div>
                                                    <div class="text-terracotta-600 text-sm">{{ point.instructions }}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Statistiques -->
                                            <div class="pt-4 border-t border-forest-100">
                                                <div class="grid grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <div class="text-lg font-bold text-forest-800">{{
                                                            point.slot_count }}</div>
                                                        <div class="text-xs text-terracotta-600">Créneaux</div>
                                                    </div>
                                                    <div>
                                                        <div class="text-lg font-bold text-forest-800">{{
                                                            point.upcoming_orders }}</div>
                                                        <div class="text-xs text-terracotta-600">Commandes à venir</div>
                                                    </div>
                                                    <div>
                                                        <div class="text-lg font-bold text-forest-800">{{ point.capacity
                                                            }}%</div>
                                                        <div class="text-xs text-terracotta-600">Taux d'occupation</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Actions -->
                                        <div class="mt-6 pt-6 border-t border-forest-100 flex flex-wrap gap-3">
                                            <button @click="viewPointDetails(point)"
                                                class="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg hover:bg-forest-100 transition-all duration-300 ease-organic flex items-center space-x-2">
                                                <span>👁️</span>
                                                <span>Voir détails</span>
                                            </button>
                                            <button @click="manageSchedule(point)"
                                                class="px-4 py-2 bg-cream-100 text-forest-700 rounded-lg hover:bg-cream-200 transition-all duration-300 ease-organic flex items-center space-x-2">
                                                <span>📅</span>
                                                <span>Gérer les horaires</span>
                                            </button>
                                            <button @click="viewAnalytics(point)"
                                                class="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 ease-organic flex items-center space-x-2">
                                                <span>📈</span>
                                                <span>Statistiques</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Guide de configuration -->
                    <div class="bg-gradient-to-r from-forest-50/50 to-cream-50/50 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6 animate-slide-up"
                        style="animation-delay: 200ms">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="p-2 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                                <span class="text-xl">💡</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-serif font-semibold text-forest-800">
                                    Conseils pour vos points de retrait
                                </h3>
                                <p class="text-sm text-terracotta-600">
                                    Optimisez l'expérience de vos clients
                                </p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="p-4 bg-white/70 rounded-xl">
                                <div class="text-2xl mb-2">📍</div>
                                <div class="font-medium text-forest-700 mb-2">Localisation stratégique</div>
                                <div class="text-sm text-terracotta-600">
                                    Choisissez des emplacements facilement accessibles et bien signalés
                                </div>
                            </div>
                            <div class="p-4 bg-white/70 rounded-xl">
                                <div class="text-2xl mb-2">🕒</div>
                                <div class="font-medium text-forest-700 mb-2">Horaires adaptés</div>
                                <div class="text-sm text-terracotta-600">
                                    Proposez des créneaux qui correspondent aux habitudes de vos clients
                                </div>
                            </div>
                            <div class="p-4 bg-white/70 rounded-xl">
                                <div class="text-2xl mb-2">📱</div>
                                <div class="font-medium text-forest-700 mb-2">Communication claire</div>
                                <div class="text-sm text-terracotta-600">
                                    Indiquez précisément les instructions pour le retrait
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Vue carte -->
                <section v-else key="map" class="animate-slide-up">
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                        <div
                            class="bg-gradient-to-r from-cream-50 to-forest-50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">🗺️</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Vue carte
                                    </h2>
                                </div>
                                <div class="flex items-center space-x-3 text-sm">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-forest-600">Point actif</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-3 h-3 bg-terracotta-400 rounded-full"></div>
                                        <span class="text-forest-600">Point inactif</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Carte simulée -->
                        <div class="relative p-6 min-h-[500px] bg-gradient-to-br from-forest-50 to-blue-50">
                            <!-- Légende de la carte -->
                            <div class="absolute top-6 left-6 z-10">
                                <div
                                    class="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-forest-100">
                                    <div class="space-y-3">
                                        <div class="font-medium text-forest-800 mb-2">Vos points de retrait</div>
                                        <div v-for="point in pickupPoints" :key="point.id"
                                            class="flex items-center space-x-3 p-2 hover:bg-forest-50 rounded-lg cursor-pointer transition-colors"
                                            @click="centerOnPoint(point)">
                                            <div class="w-3 h-3 rounded-full"
                                                :class="point.is_active ? 'bg-green-500' : 'bg-terracotta-400'"></div>
                                            <div class="flex-1">
                                                <div class="font-medium text-forest-700">{{ point.name }}</div>
                                                <div class="text-xs text-terracotta-600">{{ point.type }}</div>
                                            </div>
                                            <span class="text-lg">{{ point.icon }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Points sur la carte -->
                            <div class="relative w-full h-full">
                                <!-- Point 1 -->
                                <div v-for="point in pickupPoints" :key="point.id"
                                    class="absolute cursor-pointer transform transition-all duration-300 ease-organic hover:scale-125"
                                    :style="point.mapPosition" @click="selectPointOnMap(point)">
                                    <div class="relative">
                                        <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform transition-transform"
                                            :class="[
                                                point.is_active
                                                    ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                                                    : 'bg-gradient-to-br from-terracotta-300 to-terracotta-400 text-white',
                                                selectedPoint?.id === point.id ? 'ring-4 ring-forest-300 scale-125' : ''
                                            ]">
                                            <span class="text-sm">{{ point.icon }}</span>
                                        </div>
                                        <div v-if="selectedPoint?.id === point.id"
                                            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-forest-100 min-w-[250px] animate-slide-up">
                                            <div class="font-serif font-semibold text-forest-800 mb-2">{{ point.name }}
                                            </div>
                                            <div class="text-sm text-terracotta-600 mb-3">{{ point.address }}</div>
                                            <div class="flex items-center justify-between">
                                                <span class="text-xs px-2 py-1 rounded-full"
                                                    :class="point.is_active ? 'bg-green-100 text-green-700' : 'bg-terracotta-100 text-terracotta-700'">
                                                    {{ point.is_active ? 'Actif' : 'Inactif' }}
                                                </span>
                                                <button @click.stop="viewPointDetails(point)"
                                                    class="text-sm text-forest-600 hover:text-forest-700 flex items-center space-x-1">
                                                    <span>Voir détails</span>
                                                    <span>➡️</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Contrôles de la carte -->
                            <div class="absolute bottom-6 right-6 flex flex-col space-y-3">
                                <button @click="zoomIn"
                                    class="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-forest-100 hover:bg-white transition-all duration-300">
                                    <span class="text-xl">➕</span>
                                </button>
                                <button @click="zoomOut"
                                    class="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-forest-100 hover:bg-white transition-all duration-300">
                                    <span class="text-xl">➖</span>
                                </button>
                                <button @click="resetView"
                                    class="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-forest-100 hover:bg-white transition-all duration-300">
                                    <span class="text-xl">🗺️</span>
                                </button>
                            </div>
                        </div>

                        <!-- Légende des performances -->
                        <div class="p-6 border-t border-forest-100/30 bg-gradient-to-r from-white to-forest-50/30">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="flex items-center space-x-3">
                                    <div class="p-3 bg-green-100 rounded-xl">
                                        <span class="text-xl">📈</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-800">Point le plus fréquenté</div>
                                        <div class="text-terracotta-600">{{ mostPopularPoint?.name || 'Aucun' }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="p-3 bg-blue-100 rounded-xl">
                                        <span class="text-xl">🕒</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-800">Heure de pointe</div>
                                        <div class="text-terracotta-600">{{ busiestHourLabel }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="p-3 bg-purple-100 rounded-xl">
                                        <span class="text-xl">👥</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-800">Taux d'occupation moyen</div>
                                        <div class="text-terracotta-600">{{ averageOccupancyRate }}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </transition>

            <!-- Planification des créneaux -->
            <section class="mt-8 animate-slide-up" style="animation-delay: 300ms">
                <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                    <div
                        class="bg-gradient-to-r from-forest-50 to-terracotta-50/50 px-6 py-4 border-b border-forest-100/30">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-xl">📅</span>
                                <h2 class="text-xl font-serif font-semibold text-forest-800">
                                    Planification des créneaux
                                </h2>
                            </div>
                            <router-link to="/producer/schedule"
                                class="text-sm text-forest-600 hover:text-forest-700 flex items-center space-x-1 transition-colors">
                                <span>Gérer tous les horaires</span>
                                <span>➡️</span>
                            </router-link>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-forest-100">
                                        <th class="text-left py-3 px-4 text-sm font-medium text-forest-700">Point de
                                            retrait</th>
                                        <th v-for="day in daysOfWeek" :key="day"
                                            class="text-center py-3 px-4 text-sm font-medium text-forest-700">
                                            {{ day }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="point in pickupPoints.slice(0, 3)" :key="point.id"
                                        class="border-b border-forest-100/30 hover:bg-forest-50/30 transition-colors">
                                        <td class="py-4 px-4">
                                            <div class="flex items-center space-x-3">
                                                <span class="text-lg">{{ point.icon }}</span>
                                                <div>
                                                    <div class="font-medium text-forest-800">{{ point.name }}</div>
                                                    <div class="text-xs text-terracotta-600">{{ point.slot_count }}
                                                        créneaux</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td v-for="day in daysOfWeek" :key="day" class="py-4 px-4 text-center">
                                            <div v-if="getPointSchedule(point, day)"
                                                class="inline-block px-3 py-1 bg-gradient-to-r from-forest-100 to-forest-50 text-forest-700 rounded-lg text-sm">
                                                {{ getPointSchedule(point, day) }}
                                            </div>
                                            <span v-else class="text-terracotta-400 text-sm">-</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-6 flex justify-center">
                            <button @click="goToSchedule"
                                class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-organic flex items-center space-x-2">
                                <span>📅</span>
                                <span>Planifier tous les créneaux</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Modal pour ajouter/modifier un point -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-500 ease-organic"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showPointModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closePointModal"></div>
                <div
                    class="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                    <!-- En-tête du modal -->
                    <div class="bg-gradient-to-r from-forest-500 to-forest-600 px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl text-white">{{ editingPoint ? '✏️' : '➕' }}</span>
                                <h3 class="text-xl font-serif font-semibold text-white">
                                    {{ editingPoint ? 'Modifier le point' : 'Nouveau point de retrait' }}
                                </h3>
                            </div>
                            <button @click="closePointModal" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <span class="text-white text-xl">✖️</span>
                            </button>
                        </div>
                    </div>

                    <!-- Contenu du modal -->
                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        <form @submit.prevent="savePoint" class="space-y-6">
                            <!-- Nom et icône -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>📝</span>
                                            <span>Nom du point de retrait</span>
                                        </span>
                                    </label>
                                    <input v-model="pointForm.name" type="text" required
                                        class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Ex: Point retrait quartier Mballa II..." />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>🎨</span>
                                            <span>Icône</span>
                                        </span>
                                    </label>
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-1">
                                            <select v-model="pointForm.icon"
                                                class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                                <option value="🏡">🏡 Ferme</option>
                                                <option value="🏪">🏪 Marché</option>
                                                <option value="🛒">🛒 Boutique</option>
                                                <option value="📍">📍 Point relais</option>
                                                <option value="🚚">🚚 Livraison</option>
                                            </select>
                                        </div>
                                        <div class="p-3 bg-forest-50 rounded-lg">
                                            <span class="text-xl">{{ pointForm.icon }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Type et statut -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>🏷️</span>
                                            <span>Type de point</span>
                                        </span>
                                    </label>
                                    <select v-model="pointForm.type"
                                        class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                        <option value="ferme">Ferme 🌾</option>
                                        <option value="marche">Marché 🏪</option>
                                        <option value="boutique">Boutique 🛒</option>
                                        <option value="relais">Point relais 📍</option>
                                        <option value="autre">Autre 🔄</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>🔧</span>
                                            <span>Statut</span>
                                        </span>
                                    </label>
                                    <div class="flex items-center space-x-4">
                                        <label class="flex items-center space-x-2">
                                            <input v-model="pointForm.is_active" type="radio" :value="true"
                                                class="text-forest-500 focus:ring-forest-500" />
                                            <span class="text-forest-700">Actif ✅</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input v-model="pointForm.is_active" type="radio" :value="false"
                                                class="text-forest-500 focus:ring-forest-500" />
                                            <span class="text-forest-700">Inactif ⏸️</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Adresse -->
                            <div>
                                <label class="block text-sm font-medium text-forest-700 mb-2">
                                    <span class="inline-flex items-center space-x-1">
                                        <span>🏠</span>
                                        <span>Adresse complète</span>
                                    </span>
                                </label>
                                <textarea v-model="pointForm.address" rows="2" required
                                    class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Numéro, rue, code postal, ville..."></textarea>
                            </div>

                            <!-- Instructions -->
                            <div>
                                <label class="block text-sm font-medium text-forest-700 mb-2">
                                    <span class="inline-flex items-center space-x-1">
                                        <span>📋</span>
                                        <span>Instructions de retrait</span>
                                    </span>
                                    <span class="text-xs text-terracotta-600 ml-2">(Optionnel)</span>
                                </label>
                                <textarea v-model="pointForm.instructions" rows="3"
                                    class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Ex: Sonner à l'entrée, parking gratuit derrière le bâtiment, demander à l'accueil..."></textarea>
                            </div>

                            <!-- Capacité -->
                            <div>
                                <label class="block text-sm font-medium text-forest-700 mb-2">
                                    <span class="inline-flex items-center space-x-1">
                                        <span>👥</span>
                                        <span>Capacité simultanée</span>
                                    </span>
                                    <span class="text-xs text-terracotta-600 ml-2">Nombre maximum de clients pouvant
                                        retirer en même temps</span>
                                </label>
                                <div class="flex items-center space-x-6">
                                    <div class="flex-1">
                                        <input v-model.number="pointForm.capacity" type="range" min="1" max="50"
                                            class="w-full accent-forest-500" />
                                        <div class="flex justify-between text-xs text-terracotta-600 mt-1">
                                            <span>1 personne</span>
                                            <span>Jusqu'à 50 personnes</span>
                                        </div>
                                    </div>
                                    <div class="w-24 text-center">
                                        <div class="text-3xl font-bold text-forest-800">{{ pointForm.capacity }}</div>
                                        <div class="text-xs text-terracotta-600">personnes</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Boutons -->
                            <div class="flex justify-end space-x-4 pt-6 border-t border-forest-100">
                                <button type="button" @click="closePointModal"
                                    class="px-6 py-3 text-forest-600 hover:bg-forest-50 rounded-xl transition-all duration-300 ease-organic">
                                    Annuler
                                </button>
                                <button type="submit"
                                    class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-organic flex items-center space-x-2">
                                    <span>{{ editingPoint ? '💾' : '➕' }}</span>
                                    <span>{{ editingPoint ? 'Mettre à jour' : 'Créer le point' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Toast de confirmation -->
        <transition enter-active-class="transition-all duration-500 ease-organic"
            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-500 ease-organic" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4">
            <div v-if="showSuccessToast"
                class="fixed bottom-6 right-6 bg-white border border-forest-200 rounded-xl shadow-xl p-4 max-w-sm animate-slide-up">
                <div class="flex items-center space-x-3">
                    <div class="p-2 bg-forest-100 rounded-lg">
                        <span class="text-xl">✅</span>
                    </div>
                    <div>
                        <p class="font-medium text-forest-700">{{ toastMessage }}</p>
                        <p class="text-sm text-terracotta-600">{{ toastDescription }}</p>
                    </div>
                    <button @click="showSuccessToast = false" class="ml-4 p-1 hover:bg-forest-50 rounded">
                        <span>✖️</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducerStore } from '@/modules/user-profiles/producer/stores/useProducerStore'

type ViewPickupPoint = {
    id: string
    name: string
    icon: string
    type: string
    address: string
    instructions: string
    is_active: boolean
    schedule_summary: string
    slot_count: number
    upcoming_orders: number
    capacity: number
    mapPosition: { top: string; left: string }
}

const router = useRouter()
const producerStore = useProducerStore()

const viewMode = ref<'list' | 'map'>('list')
const showPointModal = ref(false)
const showSuccessToast = ref(false)
const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const selectedPoint = ref<ViewPickupPoint | null>(null)
const editingPoint = ref<ViewPickupPoint | null>(null)
const toastMessage = ref('')
const toastDescription = ref('')

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const dayApiByLabel: Record<string, string> = {
    Lun: 'monday',
    Mar: 'tuesday',
    Mer: 'wednesday',
    Jeu: 'thursday',
    Ven: 'friday',
    Sam: 'saturday',
    Dim: 'sunday'
}

const mapPositions = [
    { top: '40%', left: '30%' },
    { top: '45%', left: '60%' },
    { top: '55%', left: '45%' },
    { top: '65%', left: '70%' },
    { top: '35%', left: '50%' },
    { top: '30%', left: '75%' },
    { top: '60%', left: '25%' }
]

const pointForm = reactive({
    name: '',
    icon: '🏡',
    type: 'point',
    address: '',
    instructions: '',
    capacity: 10,
    is_active: true
})

const normalizeTime = (value: string | null | undefined): string => {
    if (!value) return ''
    return value.slice(0, 5)
}

const inferIcon = (name: string, address: string): string => {
    const haystack = `${name} ${address}`.toLowerCase()
    if (haystack.includes('march')) return '🏪'
    if (haystack.includes('livrai')) return '🚚'
    if (haystack.includes('boutique')) return '🛒'
    if (haystack.includes('relais')) return '📍'
    if (haystack.includes('ferme')) return '🏡'
    return '📍'
}

const inferType = (name: string, address: string): string => {
    const haystack = `${name} ${address}`.toLowerCase()
    if (haystack.includes('ferme')) return 'ferme'
    if (haystack.includes('march')) return 'marche'
    if (haystack.includes('boutique')) return 'boutique'
    if (haystack.includes('relais')) return 'relais'
    if (haystack.includes('livrai')) return 'livraison'
    return 'point'
}

const normalizeDay = (value: unknown): string => {
    if (typeof value === 'string') return value.toLowerCase()
    if (typeof value === 'number') {
        const map: Record<number, string> = {
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday',
            7: 'sunday'
        }
        return map[value] || ''
    }
    return ''
}

const slotsByPoint = computed<Record<string, any[]>>(() => {
    const grouped: Record<string, any[]> = {}
    for (const slot of producerStore.slots as any[]) {
        const pointId = String((slot as any).pickup_point_id ?? (slot as any).pickupPointId ?? '')
        if (!pointId) continue
        if (!grouped[pointId]) grouped[pointId] = []
        grouped[pointId].push(slot)
    }
    return grouped
})

const buildScheduleSummary = (pointId: string): string => {
    const slots = slotsByPoint.value[pointId] || []
    if (slots.length === 0) return 'Non configuré'

    const grouped: Record<string, string[]> = {}
    for (const slot of slots) {
        const day = normalizeDay((slot as any).day_of_week ?? (slot as any).dayOfWeek)
        if (!day) continue
        const start = normalizeTime((slot as any).start_time ?? (slot as any).startTime)
        const end = normalizeTime((slot as any).end_time ?? (slot as any).endTime)
        if (!start || !end) continue
        if (!grouped[day]) grouped[day] = []
        grouped[day].push(`${start}-${end}`)
    }

    const entries = Object.entries(grouped).slice(0, 2)
    if (entries.length === 0) return 'Créneaux configurés'

    const dayLabel: Record<string, string> = {
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mer',
        thursday: 'Jeu',
        friday: 'Ven',
        saturday: 'Sam',
        sunday: 'Dim'
    }

    return entries
        .map(([day, ranges]) => `${dayLabel[day] || day}: ${ranges[0]}`)
        .join(', ')
}

const pickupPoints = computed<ViewPickupPoint[]>(() => {
    const rawPoints = (producerStore.pickupPoints as any[]) || []
    return rawPoints.map((point, index) => {
        const id = String(point.id)
        const addressText = [point.address, point.postal_code, point.city].filter(Boolean).join(', ')
        const slots = slotsByPoint.value[id] || []
        const upcomingOrders = slots.reduce((sum: number, slot: any) => {
            const count = Number(slot?.bookings?.current_orders ?? slot?.current_orders ?? 0)
            return sum + (Number.isFinite(count) ? count : 0)
        }, 0)
        const maxOrders = slots.reduce((sum: number, slot: any) => {
            const max = Number(slot?.capacity?.max_orders ?? slot?.max_orders ?? 0)
            return sum + (Number.isFinite(max) ? max : 0)
        }, 0)
        const occupancy = maxOrders > 0 ? Math.round((upcomingOrders / maxOrders) * 100) : 0

        return {
            id,
            name: point.name || 'Point de retrait',
            icon: inferIcon(point.name || '', addressText),
            type: inferType(point.name || '', addressText),
            address: addressText || 'Adresse non renseignée',
            instructions: point.instructions || '',
            is_active: Boolean(point.is_active),
            schedule_summary: buildScheduleSummary(id),
            slot_count: slots.length,
            upcoming_orders: upcomingOrders,
            capacity: occupancy,
            mapPosition: mapPositions[index % mapPositions.length]
        }
    })
})

const activePointsCount = computed(() => pickupPoints.value.filter((p) => p.is_active).length)
const totalSlots = computed(() => pickupPoints.value.reduce((total, point) => total + point.slot_count, 0))
const totalUpcomingOrders = computed(() => pickupPoints.value.reduce((total, point) => total + point.upcoming_orders, 0))
const averageOccupancyRate = computed(() => {
    if (pickupPoints.value.length === 0) return 0
    const total = pickupPoints.value.reduce((sum, point) => sum + point.capacity, 0)
    return Math.round(total / pickupPoints.value.length)
})
const busiestHourLabel = computed(() => {
    const hourCount: Record<string, number> = {}
    for (const slot of producerStore.slots as any[]) {
        const start = normalizeTime((slot as any).start_time ?? (slot as any).startTime)
        if (!start) continue
        const current = Number((slot as any)?.bookings?.current_orders ?? (slot as any)?.current_orders ?? 0)
        hourCount[start] = (hourCount[start] || 0) + (Number.isFinite(current) ? current : 0)
    }
    const peak = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]
    return peak ? `${peak[0]}-${peak[0].slice(0, 2)}h59` : 'N/A'
})

const filteredPoints = computed(() => {
    return pickupPoints.value.filter((point) => {
        const matchesSearch = !searchQuery.value ||
            point.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            point.address.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesStatus = statusFilter.value === 'all' ||
            (statusFilter.value === 'active' && point.is_active) ||
            (statusFilter.value === 'inactive' && !point.is_active)

        return matchesSearch && matchesStatus
    })
})

const mostPopularPoint = computed(() => {
    if (pickupPoints.value.length === 0) return null
    return pickupPoints.value.reduce((most, point) =>
        point.upcoming_orders > most.upcoming_orders ? point : most
    )
})

const parseAddress = (fullAddress: string) => {
    const raw = fullAddress.trim()
    const parts = raw.split(',').map((p) => p.trim()).filter(Boolean)
    const postalMatch = raw.match(/\b\d{4,6}\b/)
    const postalCode = postalMatch?.[0] || '00000'
    const cityFromTail = parts.length > 1 ? parts[parts.length - 1] : 'Yaoundé'
    const city = cityFromTail.replace(postalCode, '').trim() || 'Yaoundé'

    return {
        street: parts[0] || raw || 'Adresse non renseignée',
        city,
        postal_code: postalCode
    }
}

const loadData = async () => {
    try {
        await producerStore.fetchPickupPoints()
        try {
            await producerStore.fetchAllSlots()
        } catch {
            // On laisse la vue fonctionner même si les créneaux ne sont pas disponibles.
        }
    } catch (error: any) {
        showToast('Chargement impossible', error?.message || 'Impossible de charger les points de retrait')
    }
}

const openNewPointModal = () => {
    editingPoint.value = null
    Object.assign(pointForm, {
        name: '',
        icon: '🏡',
        type: 'point',
        address: '',
        instructions: '',
        capacity: 10,
        is_active: true
    })
    showPointModal.value = true
}

const closePointModal = () => {
    showPointModal.value = false
    editingPoint.value = null
}

const savePoint = async () => {
    try {
        const parsed = parseAddress(pointForm.address)
        const payload: any = {
            name: pointForm.name,
            address: parsed.street,
            city: parsed.city,
            postal_code: parsed.postal_code,
            instructions: pointForm.instructions || undefined,
            is_active: pointForm.is_active
        }

        if (editingPoint.value) {
            await producerStore.updatePickupPoint(String(editingPoint.value.id), payload)
            showToast('Point mis à jour', 'Le point de retrait a été modifié avec succès')
        } else {
            await producerStore.createPickupPoint(payload)
            showToast('Point créé', 'Le nouveau point de retrait a été ajouté')
        }

        await loadData()
        closePointModal()
    } catch (error: any) {
        showToast('Erreur', error?.message || 'Échec lors de la sauvegarde du point')
    }
}

const editPoint = (point: ViewPickupPoint) => {
    editingPoint.value = point
    Object.assign(pointForm, {
        name: point.name,
        icon: point.icon,
        type: point.type,
        address: point.address,
        instructions: point.instructions || '',
        capacity: 10,
        is_active: point.is_active
    })
    showPointModal.value = true
}

const deletePoint = async (point: ViewPickupPoint) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le point "${point.name}" ?`)) return
    try {
        await producerStore.deletePickupPoint(String(point.id))
        await loadData()
        showToast('Point supprimé', 'Le point de retrait a été supprimé')
    } catch (error: any) {
        showToast('Erreur', error?.message || 'Impossible de supprimer ce point')
    }
}

const togglePointStatus = async (point: ViewPickupPoint) => {
    try {
        await producerStore.togglePickupPoint(String(point.id), !point.is_active)
        await loadData()
        showToast(
            !point.is_active ? 'Point activé' : 'Point désactivé',
            `Le point "${point.name}" est maintenant ${!point.is_active ? 'actif' : 'inactif'}`
        )
    } catch (error: any) {
        showToast('Erreur', error?.message || 'Impossible de changer le statut du point')
    }
}

const viewPointDetails = (point: ViewPickupPoint) => {
    router.push(`/producer/pickup-points/${point.id}`)
}

const manageSchedule = (point: ViewPickupPoint) => {
    router.push({ path: '/producer/schedule', query: { pointId: String(point.id) } })
}

const viewAnalytics = (_point: ViewPickupPoint) => {
    showToast('Info', 'Les statistiques détaillées seront disponibles dans une prochaine itération')
}

const selectPointOnMap = (point: ViewPickupPoint) => {
    selectedPoint.value = selectedPoint.value?.id === point.id ? null : point
}

const centerOnPoint = (point: ViewPickupPoint) => {
    selectedPoint.value = point
}

const zoomIn = () => {
    // Placeholder UX: future intégration d'une vraie carte.
}

const zoomOut = () => {
    // Placeholder UX: future intégration d'une vraie carte.
}

const resetView = () => {
    selectedPoint.value = null
}

const getPointSchedule = (point: ViewPickupPoint, day: string) => {
    const targetDay = dayApiByLabel[day]
    if (!targetDay) return '-'
    const slots = (slotsByPoint.value[String(point.id)] || []).filter((slot: any) => {
        return normalizeDay((slot as any).day_of_week ?? (slot as any).dayOfWeek) === targetDay
    })
    if (slots.length === 0) return null

    const first = slots[0]
    const start = normalizeTime((first as any).start_time ?? (first as any).startTime)
    const end = normalizeTime((first as any).end_time ?? (first as any).endTime)
    if (!start || !end) return 'Ouvert'
    return `${start}-${end}`
}

const goToSchedule = () => {
    router.push('/producer/schedule')
}

const showToast = (message: string, description: string) => {
    toastMessage.value = message
    toastDescription.value = description
    showSuccessToast.value = true
    setTimeout(() => {
        showSuccessToast.value = false
    }, 3000)
}

onMounted(async () => {
    await loadData()
})
</script>

<style scoped>
/* Animation personnalisée */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-5px) rotate(0.5deg);
    }
}

/* Classes d'animation */
.animate-slide-up {
    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Courbe de bézier organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Pattern de routes en filigrane */
.bg-road-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 100 L200 100 M100 0 L100 200' stroke='%233a7d34' stroke-width='1' stroke-opacity='0.03' stroke-dasharray='5,5'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%233a7d34' fill-opacity='0.03'/%3E%3Ccircle cx='150' cy='50' r='3' fill='%233a7d34' fill-opacity='0.03'/%3E%3Ccircle cx='50' cy='150' r='3' fill='%233a7d34' fill-opacity='0.03'/%3E%3Ccircle cx='150' cy='150' r='3' fill='%233a7d34' fill-opacity='0.03'/%3E%3C/svg%3E");
}

/* Palette de couleurs étendue */
.text-forest-25 {
    color: #f7faf7;
}

.bg-forest-25 {
    background-color: #f7faf7;
}

.text-forest-50 {
    color: #f0f7f0;
}

.bg-forest-50 {
    background-color: #f0f7f0;
}

.text-forest-100 {
    color: #e0eee0;
}

.bg-forest-100 {
    background-color: #e0eee0;
}

.text-forest-200 {
    color: #c1ddc1;
}

.bg-forest-200 {
    background-color: #c1ddc1;
}

.text-forest-300 {
    color: #a2cca2;
}

.bg-forest-300 {
    background-color: #a2cca2;
}

.text-forest-400 {
    color: #83bb83;
}

.bg-forest-400 {
    background-color: #83bb83;
}

.text-forest-500 {
    color: #64aa64;
}

.bg-forest-500 {
    background-color: #64aa64;
}

.text-forest-600 {
    color: #508850;
}

.bg-forest-600 {
    background-color: #508850;
}

.text-forest-700 {
    color: #3c663c;
}

.bg-forest-700 {
    background-color: #3c663c;
}

.text-forest-800 {
    color: #284428;
}

.bg-forest-800 {
    background-color: #284428;
}

.text-cream-40 {
    color: #fefdf5;
}

.bg-cream-40 {
    background-color: #fefdf5;
}

.text-cream-50 {
    color: #fefaf0;
}

.bg-cream-50 {
    background-color: #fefaf0;
}

.text-cream-100 {
    color: #fdf5e1;
}

.bg-cream-100 {
    background-color: #fdf5e1;
}

.text-cream-200 {
    color: #fbebc3;
}

.bg-cream-200 {
    background-color: #fbebc3;
}

.text-terracotta-30 {
    color: #fefaf5;
}

.bg-terracotta-30 {
    background-color: #fefaf5;
}

.text-terracotta-50 {
    color: #fdf5f0;
}

.bg-terracotta-50 {
    background-color: #fdf5f0;
}

.text-terracotta-100 {
    color: #fbebe1;
}

.bg-terracotta-100 {
    background-color: #fbebe1;
}

.text-terracotta-200 {
    color: #f7d8c3;
}

.bg-terracotta-200 {
    background-color: #f7d8c3;
}

.text-terracotta-300 {
    color: #f3c4a5;
}

.bg-terracotta-300 {
    background-color: #f3c4a5;
}

.text-terracotta-400 {
    color: #efb187;
}

.bg-terracotta-400 {
    background-color: #efb187;
}

.text-terracotta-500 {
    color: #eb9e69;
}

.bg-terracotta-500 {
    background-color: #eb9e69;
}

.text-terracotta-600 {
    color: #bc7e54;
}

.bg-terracotta-600 {
    background-color: #bc7e54;
}

.text-terracotta-700 {
    color: #8d5f3f;
}

.bg-terracotta-700 {
    background-color: #8d5f3f;
}

/* Ombres douces */
.shadow-soft {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Animation d'arrière-plan subtile */
.pickup-points-view::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 10% 20%, rgba(100, 170, 100, 0.05) 0%, transparent 25%),
        radial-gradient(circle at 90% 80%, rgba(235, 158, 105, 0.03) 0%, transparent 25%);
    animation: float 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: -15;
}

/* Scrollbar personnalisée */
.pickup-points-view ::-webkit-scrollbar {
    width: 6px;
}

.pickup-points-view ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
}

.pickup-points-view ::-webkit-scrollbar-thumb {
    background: rgba(100, 170, 100, 0.3);
    border-radius: 10px;
}

.pickup-points-view ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 170, 100, 0.5);
}

/* Styles pour les transitions */
.router-view-transition-enter-active,
.router-view-transition-leave-active {
    transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.router-view-transition-enter-from,
.router-view-transition-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* Effets de survol spéciaux */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Styles pour la carte */
.map-marker {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.map-marker:hover {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* Styles pour les boutons de la carte */
.map-controls button {
    backdrop-filter: blur(10px);
}

/* Styles pour les états désactivés */
input:disabled,
textarea:disabled,
select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Amélioration de l'accessibilité focus */
*:focus {
    outline: 2px solid rgba(100, 170, 100, 0.5);
    outline-offset: 2px;
}

/* Styles pour les badges de statut */
.status-badge {
    transition: all 0.3s ease-organic;
}

/* Animation pour les points sur la carte */
@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

.pulse-active {
    animation: pulse 2s infinite;
}
</style>
