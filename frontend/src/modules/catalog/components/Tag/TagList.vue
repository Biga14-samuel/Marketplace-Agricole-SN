<template>
    <!-- Conteneur principal avec fond organique -->
    <div
        class="min-h-screen bg-gradient-to-br from-forest-mist-30 via-cream-40 to-spring-green-20/50 relative overflow-hidden">
        <!-- Texture de fond subtile -->
        <div class="absolute inset-0 opacity-5 bg-tag-grid-pattern"></div>

        <!-- Animation de tags flottants -->
        <div class="fixed top-16 left-10 w-14 h-14 opacity-10 animate-float-tags-1">
            <div class="w-full h-full rounded-xl bg-gradient-to-r from-spring-green-400 to-forest-green-400 rotate-45">
            </div>
        </div>
        <div class="fixed bottom-24 right-12 w-12 h-12 opacity-10 animate-float-tags-2">
            <div class="w-full h-full rounded-full bg-gradient-to-r from-terracotta-400 to-cream-400"></div>
        </div>

        <div class="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
            <!-- Navigation -->
            <nav class="mb-8">
                <ol class="flex items-center space-x-2 text-sm">
                    <li>
                        <a href="#"
                            class="text-nature-gray-500 hover:text-spring-green-600 transition-colors duration-300 ease-out-expo">
                            Catalogue
                        </a>
                    </li>
                    <li class="flex items-center">
                        <svg class="w-4 h-4 mx-2 text-nature-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="text-forest-green-700 font-medium">Gestion des Tags</span>
                    </li>
                </ol>
            </nav>

            <!-- En-tête principal -->
            <div class="max-w-7xl mx-auto">
                <!-- Titre et actions -->
                <div class="mb-10">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div class="space-y-4">
                            <h1 class="text-4xl font-bold text-forest-green-900 tracking-tight">
                                <span class="relative inline-block">
                                    Gestion des Tags
                                    <div
                                        class="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-spring-green-300 via-terracotta-300 to-forest-green-300 rounded-full opacity-70">
                                    </div>
                                </span>
                            </h1>
                            <p class="text-lg text-nature-gray-600 max-w-3xl">
                                Organisez vos produits avec des tags colorés pour une navigation intuitive et naturelle
                            </p>
                        </div>

                        <!-- Bouton d'action principal -->
                        <div class="relative group">
                            <div
                                class="absolute -inset-1 bg-gradient-to-r from-spring-green-400 to-forest-green-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-500 ease-out-expo">
                            </div>
                            <button @click="openCreateModal"
                                class="relative px-6 py-3 bg-gradient-to-r from-spring-green-500 to-forest-green-600 text-white font-medium rounded-lg shadow-organic-lg hover:shadow-organic-xl transition-all duration-300 ease-out-custom hover:scale-105 active:scale-95 flex items-center space-x-3">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>Nouveau Tag</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Section de recherche et filtres -->
                <div class="mb-10">
                    <div
                        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-organic border border-white/50 p-6">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <!-- Barre de recherche -->
                            <div class="relative group md:col-span-2">
                                <div
                                    class="absolute inset-0 bg-gradient-to-r from-spring-green-100/30 to-cream-100/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                                </div>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg class="w-5 h-5 text-spring-green-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input v-model="searchQuery" type="text"
                                        placeholder="Rechercher un tag par nom, slug ou type..."
                                        class="w-full pl-12 pr-4 py-3 bg-white/70 border border-spring-green-200/50 rounded-xl focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom placeholder-nature-gray-400 text-forest-green-800 shadow-sm" />
                                </div>
                            </div>

                            <!-- Filtre par type -->
                            <div>
                                <label class="block text-sm font-medium text-forest-green-700 mb-2">Type</label>
                                <div class="relative">
                                    <select v-model="typeFilter"
                                        class="w-full px-4 py-3 bg-white/70 border border-spring-green-200/50 rounded-xl focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom text-forest-green-800 shadow-sm appearance-none">
                                        <option value="all">Tous les types</option>
                                        <option value="bio">Bio</option>
                                        <option value="local">Local</option>
                                        <option value="season">Saison</option>
                                        <option value="promo">Promotion</option>
                                    </select>
                                    <div
                                        class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg class="w-5 h-5 text-spring-green-500" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Filtre par statut -->
                            <div>
                                <label class="block text-sm font-medium text-forest-green-700 mb-2">Statut</label>
                                <div class="relative">
                                    <select v-model="statusFilter"
                                        class="w-full px-4 py-3 bg-white/70 border border-spring-green-200/50 rounded-xl focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom text-forest-green-800 shadow-sm appearance-none">
                                        <option value="all">Tous les statuts</option>
                                        <option value="active">Actifs uniquement</option>
                                        <option value="inactive">Inactifs uniquement</option>
                                    </select>
                                    <div
                                        class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg class="w-5 h-5 text-spring-green-500" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Boutons d'action secondaires -->
                        <div
                            class="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-nature-gray-200/40">
                            <div class="flex items-center space-x-4">
                                <button @click="toggleViewMode"
                                    class="px-4 py-2 rounded-lg border border-nature-gray-300 text-nature-gray-700 hover:bg-nature-gray-50 hover:border-nature-gray-400 transition-all duration-300 ease-out-custom flex items-center space-x-2 group"
                                    :class="{ 'bg-spring-green-50 border-spring-green-300 text-spring-green-700': viewMode === 'grid' }">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    <span>Grille</span>
                                </button>
                                <button @click="toggleViewMode"
                                    class="px-4 py-2 rounded-lg border border-nature-gray-300 text-nature-gray-700 hover:bg-nature-gray-50 hover:border-nature-gray-400 transition-all duration-300 ease-out-custom flex items-center space-x-2 group"
                                    :class="{ 'bg-spring-green-50 border-spring-green-300 text-spring-green-700': viewMode === 'list' }">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Liste</span>
                                </button>
                            </div>

                            <div class="flex items-center space-x-4 mt-4 sm:mt-0">
                                <button @click="refreshTags"
                                    class="px-4 py-2 rounded-lg border border-spring-green-200 bg-spring-green-50 text-spring-green-700 hover:bg-spring-green-100 transition-all duration-300 ease-out-custom flex items-center space-x-2 group">
                                    <svg class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ease-out-expo"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Actualiser</span>
                                </button>

                                <button @click="exportTags"
                                    class="px-4 py-2 rounded-lg border border-nature-gray-300 text-nature-gray-700 hover:bg-nature-gray-50 hover:border-nature-gray-400 transition-all duration-300 ease-out-custom flex items-center space-x-2 group">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Exporter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques -->
                <div class="mb-10">
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <!-- Total -->
                        <div
                            class="bg-gradient-to-br from-spring-green-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-spring-green-200/50 p-6 shadow-soft-organic group hover:shadow-organic transition-all duration-300 ease-out-custom">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-nature-gray-600">Total</p>
                                    <p class="text-3xl font-bold text-forest-green-900 mt-2">{{ tags.length }}</p>
                                </div>
                                <div
                                    class="w-12 h-12 rounded-full bg-gradient-to-br from-spring-green-100 to-spring-green-200 flex items-center justify-center text-spring-green-600 group-hover:scale-110 transition-transform duration-300 ease-out-expo">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Bio -->
                        <div
                            class="bg-gradient-to-br from-forest-green-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-forest-green-200/50 p-6 shadow-soft-organic group hover:shadow-organic transition-all duration-300 ease-out-custom">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-nature-gray-600">Bio</p>
                                    <p class="text-3xl font-bold text-forest-green-900 mt-2">{{ bioTags }}</p>
                                </div>
                                <div
                                    class="w-12 h-12 rounded-full bg-gradient-to-br from-forest-green-100 to-forest-green-200 flex items-center justify-center text-forest-green-600 group-hover:scale-110 transition-transform duration-300 ease-out-expo">
                                    <span class="text-xl">🌿</span>
                                </div>
                            </div>
                        </div>

                        <!-- Local -->
                        <div
                            class="bg-gradient-to-br from-terracotta-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-terracotta-200/50 p-6 shadow-soft-organic group hover:shadow-organic transition-all duration-300 ease-out-custom">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-nature-gray-600">Local</p>
                                    <p class="text-3xl font-bold text-forest-green-900 mt-2">{{ localTags }}</p>
                                </div>
                                <div
                                    class="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta-100 to-terracotta-200 flex items-center justify-center text-terracotta-600 group-hover:scale-110 transition-transform duration-300 ease-out-expo">
                                    <span class="text-xl">📍</span>
                                </div>
                            </div>
                        </div>

                        <!-- Saison -->
                        <div
                            class="bg-gradient-to-br from-cream-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-cream-200/50 p-6 shadow-soft-organic group hover:shadow-organic transition-all duration-300 ease-out-custom">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-nature-gray-600">Saison</p>
                                    <p class="text-3xl font-bold text-forest-green-900 mt-2">{{ seasonTags }}</p>
                                </div>
                                <div
                                    class="w-12 h-12 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-cream-600 group-hover:scale-110 transition-transform duration-300 ease-out-expo">
                                    <span class="text-xl">🍂</span>
                                </div>
                            </div>
                        </div>

                        <!-- Promotion -->
                        <div
                            class="bg-gradient-to-br from-red-50/80 to-white/80 backdrop-blur-sm rounded-2xl border border-red-200/50 p-6 shadow-soft-organic group hover:shadow-organic transition-all duration-300 ease-out-custom">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-nature-gray-600">Promotion</p>
                                    <p class="text-3xl font-bold text-forest-green-900 mt-2">{{ promoTags }}</p>
                                </div>
                                <div
                                    class="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform duration-300 ease-out-expo">
                                    <span class="text-xl">🔥</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Liste des tags en grille -->
                <div v-if="viewMode === 'grid'" class="mb-10">
                    <div v-if="filteredTags.length === 0" class="text-center py-20">
                        <div class="w-32 h-32 mx-auto mb-6 opacity-20">
                            <svg class="w-full h-full text-nature-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-medium text-nature-gray-500 mb-2">Aucun tag trouvé</h3>
                        <p class="text-nature-gray-400 mb-6">Créez votre premier tag pour commencer</p>
                        <button @click="openCreateModal"
                            class="px-6 py-3 bg-gradient-to-r from-spring-green-500 to-forest-green-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 ease-out-custom">
                            Créer un tag
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <TransitionGroup name="staggered-fade">
                            <div v-for="tag in paginatedTags" :key="tag.id" class="group relative"
                                style="animation-delay: calc(var(--i) * 30ms)">
                                <!-- Carte de tag -->
                                <div
                                    class="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-soft-organic overflow-hidden transition-all duration-500 ease-out-custom hover:shadow-organic-xl hover:scale-[1.02] group-hover:border-spring-green-300/50 h-full">
                                    <!-- Bande de couleur du tag -->
                                    <div class="h-3" :style="{ backgroundColor: tag.color }"></div>

                                    <div class="p-6">
                                        <!-- En-tête de la carte -->
                                        <div class="flex items-start justify-between mb-4">
                                            <div class="flex items-center space-x-4">
                                                <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md"
                                                    :style="{ backgroundColor: tag.color + '20' }">
                                                    {{ getTypeIcon(tag.type) }}
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <h3
                                                        class="text-xl font-bold text-forest-green-900 group-hover:text-forest-green-700 transition-colors duration-300 truncate">
                                                        {{ tag.name }}
                                                    </h3>
                                                    <div class="flex items-center space-x-2 mt-1">
                                                        <span
                                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                                            :style="{ backgroundColor: tag.color + '20', color: tag.color }">
                                                            {{ tag.slug }}
                                                        </span>
                                                        <span
                                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-nature-gray-100 text-nature-gray-700">
                                                            {{ getTypeLabel(tag.type) }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Badge statut -->
                                            <div class="flex flex-col items-end">
                                                <span
                                                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2"
                                                    :class="tag.is_active ? 'bg-spring-green-100 text-spring-green-800' : 'bg-terracotta-100 text-terracotta-800'">
                                                    <span class="w-2 h-2 rounded-full mr-1"
                                                        :class="tag.is_active ? 'bg-spring-green-500' : 'bg-terracotta-500'"></span>
                                                    {{ tag.is_active ? 'Actif' : 'Inactif' }}
                                                </span>
                                                <div class="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                    :style="{ backgroundColor: tag.color }"></div>
                                            </div>
                                        </div>

                                        <!-- Métadonnées -->
                                        <div class="grid grid-cols-2 gap-4 mb-6">
                                            <div class="flex items-center space-x-2 text-sm text-nature-gray-500">
                                                <svg class="w-4 h-4 text-spring-green-500" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>{{ formatDate(tag.updated_at) }}</span>
                                            </div>
                                            <div class="flex items-center space-x-2 text-sm text-nature-gray-500">
                                                <svg class="w-4 h-4 text-terracotta-500" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>{{ tag.products_count || 0 }} produits</span>
                                            </div>
                                        </div>

                                        <!-- Actions -->
                                        <div
                                            class="flex items-center justify-between pt-6 border-t border-nature-gray-200/40">
                                            <div class="flex items-center space-x-3">
                                                <button @click="viewTagProducts(tag)"
                                                    class="px-3 py-2 text-sm text-nature-gray-600 hover:text-forest-green-700 hover:bg-spring-green-50 rounded-lg transition-all duration-300 ease-out-custom flex items-center space-x-2 group">
                                                    <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                                                        fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                                    </svg>
                                                    <span>Voir produits</span>
                                                </button>
                                            </div>

                                            <div class="flex items-center space-x-2">
                                                <button @click="editTag(tag)"
                                                    class="px-3 py-2 text-sm text-spring-green-600 hover:text-spring-green-700 hover:bg-spring-green-50 rounded-lg transition-all duration-300 ease-out-custom flex items-center space-x-2 group">
                                                    <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                                                        fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                    <span>Éditer</span>
                                                </button>

                                                <button @click="deleteTag(tag)"
                                                    class="px-3 py-2 text-sm text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-50 rounded-lg transition-all duration-300 ease-out-custom flex items-center space-x-2 group">
                                                    <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                                                        fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    <span>Supprimer</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>
                </div>

                <!-- Vue tableau -->
                <div v-else class="mb-10">
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-organic border border-white/60 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="bg-gradient-to-r from-spring-green-50/50 to-forest-green-50/30">
                                        <th
                                            class="py-4 px-6 text-left text-sm font-semibold text-forest-green-900 border-b border-nature-gray-200/40">
                                            <div class="flex items-center space-x-2">
                                                <span>Tag</span>
                                            </div>
                                        </th>
                                        <th
                                            class="py-4 px-6 text-left text-sm font-semibold text-forest-green-900 border-b border-nature-gray-200/40">
                                            Type
                                        </th>
                                        <th
                                            class="py-4 px-6 text-left text-sm font-semibold text-forest-green-900 border-b border-nature-gray-200/40">
                                            Couleur
                                        </th>
                                        <th
                                            class="py-4 px-6 text-left text-sm font-semibold text-forest-green-900 border-b border-nature-gray-200/40">
                                            Statut
                                        </th>
                                        <th
                                            class="py-4 px-6 text-left text-sm font-semibold text-forest-green-900 border-b border-nature-gray-200/40">
                                            Produits
                                        </th>
                                        <th
                                            class="py-4 px-6 text-left text-sm font-semibold text-forest-green-900 border-b border-nature-gray-200/40">
                                            Dernière modification
                                        </th>
                                        <th
                                            class="py-4 px-6 text-left text-sm font-semibold text-forest-green-900 border-b border-nature-gray-200/40">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-nature-gray-200/30">
                                    <TransitionGroup name="staggered-fade">
                                        <tr v-for="tag in paginatedTags" :key="tag.id"
                                            class="hover:bg-spring-green-50/30 transition-colors duration-300 ease-out-expo">
                                            <td class="py-4 px-6">
                                                <div class="flex items-center space-x-4">
                                                    <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm"
                                                        :style="{ backgroundColor: tag.color + '20' }">
                                                        {{ getTypeIcon(tag.type) }}
                                                    </div>
                                                    <div>
                                                        <div class="font-medium text-forest-green-900">{{ tag.name }}
                                                        </div>
                                                        <div class="text-sm text-nature-gray-500">{{ tag.slug }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6">
                                                <span
                                                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nature-gray-100 text-nature-gray-700">
                                                    {{ getTypeLabel(tag.type) }}
                                                </span>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="flex items-center space-x-3">
                                                    <div class="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                                        :style="{ backgroundColor: tag.color }"></div>
                                                    <div class="font-mono text-sm text-forest-green-800">{{ tag.color }}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6">
                                                <span
                                                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                                    :class="tag.is_active ? 'bg-spring-green-100 text-spring-green-800' : 'bg-terracotta-100 text-terracotta-800'">
                                                    <span class="w-2 h-2 rounded-full mr-2"
                                                        :class="tag.is_active ? 'bg-spring-green-500' : 'bg-terracotta-500'"></span>
                                                    {{ tag.is_active ? 'Actif' : 'Inactif' }}
                                                </span>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="text-forest-green-900 font-medium">{{ tag.products_count ||
                                                    0 }}</div>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="text-sm text-nature-gray-500">{{ formatDate(tag.updated_at)
                                                }}</div>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="flex items-center space-x-3">
                                                    <button @click="viewTagProducts(tag)"
                                                        class="p-2 text-nature-gray-500 hover:text-forest-green-700 hover:bg-spring-green-50 rounded-lg transition-all duration-300 ease-out-custom"
                                                        title="Voir produits">
                                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                                        </svg>
                                                    </button>
                                                    <button @click="editTag(tag)"
                                                        class="p-2 text-spring-green-600 hover:text-spring-green-700 hover:bg-spring-green-50 rounded-lg transition-all duration-300 ease-out-custom"
                                                        title="Éditer">
                                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button @click="deleteTag(tag)"
                                                        class="p-2 text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-50 rounded-lg transition-all duration-300 ease-out-custom"
                                                        title="Supprimer">
                                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd"
                                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </TransitionGroup>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="filteredTags.length === 0" class="text-center py-20">
                            <div class="w-24 h-24 mx-auto mb-6 opacity-20">
                                <svg class="w-full h-full text-nature-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-medium text-nature-gray-500 mb-2">Aucun tag trouvé</h3>
                            <p class="text-nature-gray-400">Essayez de modifier vos filtres de recherche</p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="filteredTags.length > itemsPerPage" class="mt-10">
                    <div
                        class="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft-organic border border-white/50">
                        <div class="text-sm text-nature-gray-600">
                            Affichage de <span class="font-medium text-forest-green-700">{{ startIndex + 1 }}</span> à
                            <span class="font-medium text-forest-green-700">{{ Math.min(endIndex, filteredTags.length)
                            }}</span> sur
                            <span class="font-medium text-forest-green-700">{{ filteredTags.length }}</span> tags
                        </div>

                        <div class="flex items-center space-x-2">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="p-2 rounded-lg border border-nature-gray-300 text-nature-gray-700 hover:bg-nature-gray-50 hover:border-nature-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out-custom">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>

                            <div class="flex items-center space-x-1">
                                <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                                    class="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ease-out-custom"
                                    :class="currentPage === page ? 'bg-gradient-to-r from-spring-green-500 to-forest-green-500 text-white shadow-md' : 'text-nature-gray-700 hover:bg-spring-green-50'">
                                    {{ page }}
                                </button>
                            </div>

                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="p-2 rounded-lg border border-nature-gray-300 text-nature-gray-700 hover:bg-nature-gray-50 hover:border-nature-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out-custom">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <TagFormModal v-if="showCreateModal" :tag-id="selectedTagId" @close="closeModals" @success="handleTagSuccess" />

        <TagDeleteModal v-if="showDeleteModal && tagToDelete" :tag="tagToDelete" @close="closeModals"
            @success="handleDeleteSuccess" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTagStore } from '@/modules/catalog/store/modules/tag.store'
import TagFormModal from './TagForm.vue'
import TagDeleteModal from './TagDeleteModal.vue'

interface Tag {
    id: string
    name: string
    slug: string
    type: 'bio' | 'local' | 'season' | 'promo' | 'other'
    color: string
    is_active: boolean
    products_count?: number
    created_at: string
    updated_at: string
}

// Store
const tagStore = useTagStore()

// États
const tags = ref<Tag[]>([])
const loading = ref(false)
const searchQuery = ref('')
const typeFilter = ref('all')
const statusFilter = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(16)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const selectedTagId = ref<string | null>(null)
const tagToDelete = ref<Tag | null>(null)

// Données calculées
const filteredTags = computed(() => {
    let filtered = tags.value

    // Filtre par recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(tag =>
            tag.name.toLowerCase().includes(query) ||
            tag.slug.toLowerCase().includes(query) ||
            tag.type.toLowerCase().includes(query)
        )
    }

    // Filtre par type
    if (typeFilter.value !== 'all') {
        filtered = filtered.filter(tag => tag.type === typeFilter.value)
    }

    // Filtre par statut
    if (statusFilter.value === 'active') {
        filtered = filtered.filter(tag => tag.is_active)
    } else if (statusFilter.value === 'inactive') {
        filtered = filtered.filter(tag => !tag.is_active)
    }

    // Tri par type puis par nom
    return filtered.sort((a, b) => {
        const typeOrder = { bio: 1, local: 2, season: 3, promo: 4 }
        const orderA = typeOrder[a.type] || 5
        const orderB = typeOrder[b.type] || 5

        if (orderA !== orderB) return orderA - orderB
        return a.name.localeCompare(b.name)
    })
})

const paginatedTags = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredTags.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredTags.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
    return Math.min(startIndex.value + itemsPerPage.value, filteredTags.value.length)
})

const bioTags = computed(() => {
    return tags.value.filter(tag => tag.type === 'bio').length
})

const localTags = computed(() => {
    return tags.value.filter(tag => tag.type === 'local').length
})

const seasonTags = computed(() => {
    return tags.value.filter(tag => tag.type === 'season').length
})

const promoTags = computed(() => {
    return tags.value.filter(tag => tag.type === 'promo').length
})

// Méthodes
const toSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')

const inferTagType = (name: string): Tag['type'] => {
    const normalized = name.toLowerCase()
    if (normalized.includes('bio')) return 'bio'
    if (normalized.includes('local')) return 'local'
    if (normalized.includes('saison') || normalized.includes('season')) return 'season'
    if (normalized.includes('promo') || normalized.includes('promotion')) return 'promo'
    return 'other'
}

const loadTags = async () => {
    loading.value = true
    try {
        await tagStore.fetchAllTags()
        tags.value = tagStore.tags.map(tag => ({
            id: String(tag.id),
            name: tag.name,
            slug: toSlug(tag.name),
            type: inferTagType(tag.name),
            color: tag.color || '#10B981',
            is_active: true,
            products_count: tag.usage_count || 0,
            created_at: new Date(tag.created_at).toISOString(),
            updated_at: new Date(tag.updated_at).toISOString(),
        }))
    } catch (error) {
        console.error('Erreur lors du chargement des tags:', error)
    } finally {
        loading.value = false
    }
}

const refreshTags = () => {
    loadTags()
}

const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        bio: 'Bio',
        local: 'Local',
        season: 'Saison',
        promo: 'Promotion'
    }
    return labels[type] || type
}

const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
        bio: '🌿',
        local: '📍',
        season: '🍂',
        promo: '🔥'
    }
    return icons[type] || '🏷️'
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const openCreateModal = () => {
    selectedTagId.value = null
    showCreateModal.value = true
}

const editTag = (tag: Tag) => {
    selectedTagId.value = tag.id
    showCreateModal.value = true
}

const deleteTag = (tag: Tag) => {
    tagToDelete.value = tag
    showDeleteModal.value = true
}

const viewTagProducts = (tag: Tag) => {
    // Navigation vers la liste des produits avec ce tag
    console.log('View products with tag:', tag)
}

const exportTags = () => {
    const data = {
        tags: tags.value,
        exportedAt: new Date().toISOString(),
        totalTags: tags.value.length,
        bioTags: bioTags.value,
        localTags: localTags.value,
        seasonTags: seasonTags.value,
        promoTags: promoTags.value
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = `tags-export-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
}

const closeModals = () => {
    showCreateModal.value = false
    showDeleteModal.value = false
    selectedTagId.value = null
    tagToDelete.value = null
}

const handleTagSuccess = () => {
    closeModals()
    refreshTags()
}

const handleDeleteSuccess = () => {
    closeModals()
    refreshTags()
}

// Pagination
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const goToPage = (page: number) => {
    currentPage.value = page
}

// Observateurs
watch([searchQuery, typeFilter, statusFilter], () => {
    currentPage.value = 1
})

// Cycle de vie
onMounted(() => {
    loadTags()
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

/* Animations de tags flottants */
@keyframes float-tags-1 {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }

    33% {
        transform: translate(-25px, -20px) rotate(45deg) scale(1.2);
    }

    66% {
        transform: translate(20px, 15px) rotate(-45deg) scale(0.8);
    }
}

@keyframes float-tags-2 {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }

    33% {
        transform: translate(15px, -25px) rotate(-60deg) scale(0.9);
    }

    66% {
        transform: translate(-20px, 20px) rotate(60deg) scale(1.1);
    }
}

.animate-float-tags-1 {
    animation: float-tags-1 30s ease-in-out infinite;
}

.animate-float-tags-2 {
    animation: float-tags-2 35s ease-in-out infinite;
}

/* Texture de grille de tags */
.bg-tag-grid-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='30' y='30' width='40' height='40' rx='8' stroke='%23005500' stroke-width='1' fill='none' opacity='0.03'/%3E%3Crect x='90' y='60' width='40' height='40' rx='8' stroke='%23005500' stroke-width='1' fill='none' opacity='0.02'/%3E%3Crect x='50' y='110' width='40' height='40' rx='8' stroke='%23005500' stroke-width='1' fill='none' opacity='0.02'/%3E%3Crect x='110' y='140' width='40' height='40' rx='8' stroke='%23005500' stroke-width='1' fill='none' opacity='0.03'/%3E%3C/svg%3E");
    background-size: 400px 400px;
}

/* Ombres organiques */
.shadow-soft-organic {
    box-shadow:
        0 4px 20px -2px rgba(0, 85, 0, 0.05),
        0 2px 8px -1px rgba(139, 195, 74, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.shadow-organic {
    box-shadow:
        0 10px 25px -5px rgba(0, 85, 0, 0.1),
        0 5px 10px -3px rgba(139, 195, 74, 0.08);
}

.shadow-organic-lg {
    box-shadow:
        0 15px 35px -10px rgba(0, 85, 0, 0.15),
        0 8px 15px -5px rgba(139, 195, 74, 0.1);
}

.shadow-organic-xl {
    box-shadow:
        0 25px 50px -12px rgba(0, 85, 0, 0.25),
        0 15px 30px -8px rgba(139, 195, 74, 0.2);
}

/* Transition pour les cartes */
.staggered-fade-enter-active,
.staggered-fade-leave-active {
    transition: all 0.5s var(--ease-out-expo);
}

.staggered-fade-enter-from,
.staggered-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(0, 85, 0, 0.05);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #4ade80, #22c55e);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #22c55e, #16a34a);
}
</style>




