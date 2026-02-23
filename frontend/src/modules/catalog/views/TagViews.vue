<template>
    <div class="min-h-screen organic-tag-bg relative overflow-hidden">
        <!-- Animations de fond subtiles -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="leaf-float absolute top-8 left-8 text-7xl text-primary-green/15">🏷️</div>
            <div class="leaf-float absolute top-12 right-12 text-6xl text-secondary-orange/15"
                style="animation-delay: 2s;">🏷️</div>
            <div class="leaf-float absolute bottom-24 left-16 text-8xl text-forest-green/15"
                style="animation-delay: 4s;">🏷️</div>
            <div class="leaf-float absolute bottom-16 right-16 text-7xl text-earth-brown/15"
                style="animation-delay: 6s;">🏷️</div>
            <div class="leaf-float absolute top-1/2 left-1/4 text-6xl text-green-300/15" style="animation-delay: 8s;">
                🏷️</div>
        </div>

        <!-- Texture de fond organique -->
        <div class="absolute inset-0 tag-texture opacity-5"></div>

        <div class="relative z-10 container mx-auto px-4 py-12">
            <!-- Header inspirant -->
            <div class="text-center mb-16 animate-slide-in-down">
                <div
                    class="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-primary-green to-green-600 rounded-3xl mb-8 shadow-2xl animate-pulse-soft">
                    <span class="text-6xl text-white">🏷️</span>
                </div>
                <h1 class="text-5xl md:text-6xl font-bold text-forest-green mb-4">
                    Écosystème de Tags
                </h1>
                <p class="text-xl text-earth-brown/80 max-w-3xl mx-auto mb-8 leading-relaxed">
                    Organisez et découvrez vos produits grâce à des tags intelligents, frais et évocateurs
                </p>

                <!-- Indicateurs rapides -->
                <div class="flex flex-wrap justify-center gap-6 mb-12">
                    <div
                        class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-green-100/50 shadow-sm hover:scale-105 transition-all duration-300 transition-organic">
                        <div
                            class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <span class="text-3xl text-green-600">🏷️</span>
                        </div>
                        <div>
                            <p class="text-3xl font-bold text-forest-green">{{ totalTags }}</p>
                            <p class="text-sm text-gray-600">Tags actifs</p>
                        </div>
                    </div>

                    <div
                        class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-green-100/50 shadow-sm hover:scale-105 transition-all duration-300 transition-organic">
                        <div
                            class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                            <span class="text-3xl text-amber-600">🔥</span>
                        </div>
                        <div>
                            <p class="text-3xl font-bold text-forest-green">{{ popularTagsCount }}</p>
                            <p class="text-sm text-gray-600">Tags populaires</p>
                        </div>
                    </div>

                    <div
                        class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-green-100/50 shadow-sm hover:scale-105 transition-all duration-300 transition-organic">
                        <div
                            class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span class="text-3xl text-blue-600">📊</span>
                        </div>
                        <div>
                            <p class="text-3xl font-bold text-forest-green">{{ averageUsage }}</p>
                            <p class="text-sm text-gray-600">Usage moyen</p>
                        </div>
                    </div>

                    <div
                        class="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-green-100/50 shadow-sm hover:scale-105 transition-all duration-300 transition-organic">
                        <div
                            class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                            <span class="text-3xl text-purple-600">✨</span>
                        </div>
                        <div>
                            <p class="text-3xl font-bold text-forest-green">{{ newThisMonth }}</p>
                            <p class="text-sm text-gray-600">Nouveaux ce mois</p>
                        </div>
                    </div>
                </div>

                <!-- Barre de recherche et filtres -->
                <div class="max-w-5xl mx-auto mb-12">
                    <div
                        class="organic-search-card bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 shadow-sm">
                        <div class="flex flex-col md:flex-row gap-6">
                            <!-- Recherche -->
                            <div class="flex-1">
                                <div class="relative group">
                                    <input v-model="searchQuery" type="text"
                                        placeholder="Rechercher un tag, une couleur, un usage..."
                                        class="w-full px-6 py-4 pl-16 bg-white/70 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic hover:border-green-300 text-lg">
                                    <span
                                        class="absolute left-5 top-4 text-3xl text-green-500 group-hover:animate-pulse-soft">🔍</span>
                                    <button v-if="searchQuery" @click="searchQuery = ''"
                                        class="absolute right-5 top-4 text-gray-400 hover:text-gray-600 transition-organic text-2xl">
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <!-- Catégories de tags -->
                            <div class="flex flex-wrap gap-3">
                                <button v-for="category in tagCategories" :key="category.id"
                                    @click="toggleCategory(category.id)"
                                    class="px-4 py-3 rounded-xl border transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2"
                                    :class="[
                                        activeCategory === category.id
                                            ? category.classes.active
                                            : category.classes.inactive
                                    ]">
                                    <span class="text-xl">{{ category.icon }}</span>
                                    <span>{{ category.label }}</span>
                                    <span class="text-xs px-2 py-1 rounded-full bg-white/50">
                                        {{ category.count }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Filtres avancés -->
                        <div class="mt-6 pt-6 border-t border-green-100">
                            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div class="flex flex-wrap gap-4">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-sm text-gray-600">Couleur :</span>
                                        <div class="flex space-x-2">
                                            <button v-for="color in colorFilters" :key="color.id"
                                                @click="toggleColor(color.id)"
                                                class="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-all duration-300 transition-organic hover:scale-110"
                                                :class="[
                                                    activeColors.includes(color.id)
                                                        ? 'ring-2 ring-offset-2 ring-gray-300'
                                                        : ''
                                                ]" :style="{ backgroundColor: color.hex }"
                                                :title="color.label"></button>
                                        </div>
                                    </div>

                                    <div class="flex items-center space-x-2">
                                        <span class="text-sm text-gray-600">Popularité :</span>
                                        <div class="flex space-x-2">
                                            <button v-for="pop in popularityFilters" :key="pop.id"
                                                @click="togglePopularity(pop.id)"
                                                class="px-3 py-1.5 rounded-lg border transition-all duration-300 transition-organic hover:scale-105"
                                                :class="[
                                                    activePopularity === pop.id
                                                        ? 'bg-gradient-to-r from-primary-green/10 to-green-100/50 border-primary-green/30 text-primary-green'
                                                        : 'bg-white/70 border-gray-200 text-gray-700 hover:border-green-200'
                                                ]">
                                                {{ pop.label }}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button @click="resetFilters"
                                    class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 transition-organic">
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nuage de tags principal -->
            <div class="mb-16 animate-fade-in">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-forest-green mb-3">Nuage de Tags</h2>
                    <p class="text-earth-brown/80">Plus un tag est utilisé, plus il apparaît gros</p>
                </div>

                <div
                    class="organic-tag-cloud bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-green-100/50 shadow-sm">
                    <div class="flex flex-wrap justify-center gap-4 min-h-64 items-center">
                        <div v-for="tag in featuredTags" :key="tag.id" @click="selectTag(tag)"
                            @mouseenter="hoverTag = tag.id" @mouseleave="hoverTag = null"
                            class="inline-flex items-center px-6 py-3 rounded-2xl border-2 transition-all duration-300 transition-organic cursor-pointer transform hover:scale-110 hover:shadow-lg"
                            :class="[
                                selectedTag?.id === tag.id
                                    ? 'ring-4 ring-offset-2 ring-primary-green/30 scale-110 shadow-lg'
                                    : '',
                                hoverTag === tag.id ? 'z-10' : ''
                            ]" :style="{
                                backgroundColor: tag.color + '15',
                                borderColor: tag.color + '30',
                                fontSize: `${tag.size}px`,
                                transform: selectedTag?.id === tag.id ? 'scale(1.1)' : hoverTag === tag.id ? 'scale(1.1)' : 'scale(1)'
                            }">
                            <span class="mr-2 text-xl">{{ tag.icon }}</span>
                            <span class="font-semibold" :style="{ color: tag.color }">{{ tag.name }}</span>
                            <span class="ml-3 text-xs px-2 py-1 rounded-full"
                                :style="{ backgroundColor: tag.color + '20', color: tag.color }">
                                {{ tag.count }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-8 pt-8 border-t border-green-100 text-center">
                        <p class="text-gray-600">
                            <span class="text-xl mr-2">💡</span>
                            Cliquez sur un tag pour voir les produits associés
                        </p>
                    </div>
                </div>
            </div>

            <!-- Liste organisée des tags -->
            <div class="animate-fade-in">
                <div class="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h2 class="text-3xl font-bold text-forest-green mb-2">Bibliothèque de Tags</h2>
                        <p class="text-earth-brown/80">Explorez, gérez et organisez vos tags</p>
                    </div>

                    <div class="flex items-center space-x-4 mt-4 md:mt-0">
                        <!-- Tri -->
                        <div class="relative">
                            <select v-model="sortBy"
                                class="px-4 py-3 pl-12 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic appearance-none cursor-pointer">
                                <option value="name">Trier par nom</option>
                                <option value="popularity">Trier par popularité</option>
                                <option value="recent">Trier par récent</option>
                                <option value="color">Trier par couleur</option>
                            </select>
                            <span class="absolute left-4 top-3.5 text-xl text-green-500">📊</span>
                        </div>

                        <!-- Bouton d'ajout -->
                        <button @click="createTag"
                            class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2 group">
                            <span class="text-xl group-hover:animate-bounce">➕</span>
                            <span class="font-semibold">Nouveau Tag</span>
                        </button>
                    </div>
                </div>

                <!-- Grille de tags -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    <div v-for="(tag, index) in filteredTags" :key="tag.id"
                        class="organic-tag-card transform transition-all duration-500 transition-organic hover:scale-[1.02] animate-card-appear"
                        :style="{ animationDelay: `${index * 0.05}s` }">
                        <!-- En-tête de la carte -->
                        <div class="card-header"
                            :style="{ backgroundColor: tag.color + '15', borderColor: tag.color + '30' }">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                                        :style="{ backgroundColor: tag.color + '30' }">
                                        <span class="text-2xl">{{ tag.icon }}</span>
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-900">{{ tag.name }}</h3>
                                        <p class="text-sm text-gray-600">{{ tag.category }}</p>
                                    </div>
                                </div>
                                <span class="text-3xl opacity-20">{{ tag.icon }}</span>
                            </div>

                            <!-- Badges -->
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                    :style="{ backgroundColor: tag.color + '20', color: tag.color }">
                                    {{ tag.type }}
                                </span>
                                <span v-if="tag.featured"
                                    class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-xs font-medium">
                                    <span class="mr-1">⭐</span> En vedette
                                </span>
                                <span v-if="tag.new"
                                    class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-xs font-medium">
                                    <span class="mr-1">🆕</span> Nouveau
                                </span>
                            </div>
                        </div>

                        <!-- Contenu de la carte -->
                        <div class="card-content">
                            <p class="text-gray-700 mb-6">{{ tag.description }}</p>

                            <!-- Statistiques -->
                            <div class="grid grid-cols-3 gap-4 mb-6">
                                <div class="text-center">
                                    <p class="text-sm text-gray-500">Usage</p>
                                    <p class="text-2xl font-bold text-gray-900">{{ tag.usageCount }}</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-sm text-gray-500">Produits</p>
                                    <p class="text-2xl font-bold text-gray-900">{{ tag.productCount }}</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-sm text-gray-500">Créé</p>
                                    <p class="text-lg font-bold text-gray-900">{{ tag.createdAgo }}</p>
                                </div>
                            </div>

                            <!-- Produits taggés -->
                            <div>
                                <p class="text-sm font-medium text-gray-700 mb-2">Produits récents</p>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="product in tag.recentProducts.slice(0, 3)" :key="product"
                                        class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                        {{ product }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Pied de carte -->
                        <div class="card-footer">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-2">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                        <span class="text-sm text-gray-600">👤</span>
                                    </div>
                                    <span class="text-sm text-gray-600">{{ tag.creator }}</span>
                                </div>
                                <div class="flex space-x-2">
                                    <button @click.stop="editTag(tag)"
                                        class="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 hover:shadow-md transition-all duration-300 transition-organic hover:scale-110"
                                        title="Éditer">
                                        <span class="text-lg">✏️</span>
                                    </button>
                                    <button @click.stop="deleteTag(tag)"
                                        class="p-2 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 hover:shadow-md transition-all duration-300 transition-organic hover:scale-110"
                                        title="Supprimer">
                                        <span class="text-lg">🗑️</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Message si pas de résultats -->
                <div v-if="filteredTags.length === 0" class="text-center py-20 animate-fade-in">
                    <div class="text-8xl mb-6 opacity-20">🏷️</div>
                    <h3 class="text-2xl font-semibold text-gray-700 mb-3">Aucun tag trouvé</h3>
                    <p class="text-gray-600 mb-8">Essayez de modifier vos critères de recherche ou créez un nouveau tag
                    </p>
                    <button @click="createTag"
                        class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105">
                        Créer un tag
                    </button>
                </div>

                <!-- Pagination -->
                <div v-if="filteredTags.length > 0" class="animate-fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p class="text-sm text-gray-600">
                            Affichage de {{ filteredTags.length }} tags sur {{ tags.length }}
                        </p>
                        <div class="flex items-center space-x-4">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-4 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-organic disabled:opacity-50 disabled:cursor-not-allowed"
                                :class="{ 'hover:scale-105': currentPage > 1 }">
                                ← Précédent
                            </button>
                            <div class="flex space-x-2">
                                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                                    class="w-10 h-10 rounded-lg transition-all duration-300 transition-organic" :class="currentPage === page
                                        ? 'bg-gradient-to-r from-primary-green to-green-600 text-white shadow-md'
                                        : 'border border-green-200 hover:bg-green-50 hover:scale-105'">
                                    {{ page }}
                                </button>
                            </div>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-4 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-organic disabled:opacity-50 disabled:cursor-not-allowed"
                                :class="{ 'hover:scale-105': currentPage < totalPages }">
                                Suivant →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Détails du tag sélectionné -->
            <div v-if="selectedTag" class="mt-16 animate-fade-in">
                <div
                    class="organic-details-card bg-gradient-to-r from-primary-green/5 via-green-50/30 to-emerald-50/20 rounded-3xl p-8 border border-primary-green/30">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div class="flex items-center space-x-6">
                            <div class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                                :style="{ backgroundColor: selectedTag.color + '30' }">
                                <span class="text-4xl">{{ selectedTag.icon }}</span>
                            </div>
                            <div>
                                <h4 class="text-3xl font-bold text-gray-900">{{ selectedTag.name }}</h4>
                                <p class="text-gray-600">{{ selectedTag.category }} • Créé {{ selectedTag.createdAgo }}
                                </p>
                            </div>
                        </div>

                        <div class="flex space-x-4">
                            <button @click="applyTag(selectedTag)"
                                class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                                <span class="text-xl">🎯</span>
                                <span>Appliquer</span>
                            </button>
                            <button @click="selectedTag = null"
                                class="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 text-gray-700 rounded-xl hover:shadow-md transition-all duration-300 transition-organic hover:scale-105">
                                Fermer
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h5 class="text-lg font-semibold text-gray-900 mb-4">Statistiques</h5>
                            <div class="space-y-4">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Produits taggés</span>
                                    <span class="text-2xl font-bold text-gray-900">{{ selectedTag.productCount }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Utilisation totale</span>
                                    <span class="text-2xl font-bold text-gray-900">{{ selectedTag.usageCount }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Dernière utilisation</span>
                                    <span class="text-lg font-medium text-gray-900">{{ selectedTag.lastUsed }}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h5 class="text-lg font-semibold text-gray-900 mb-4">Description</h5>
                            <p class="text-gray-700">{{ selectedTag.fullDescription }}</p>
                            <div class="mt-4">
                                <span
                                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                                    :style="{ backgroundColor: selectedTag.color + '20', color: selectedTag.color }">
                                    {{ selectedTag.type }}
                                </span>
                                <span v-if="selectedTag.featured"
                                    class="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mr-2 mb-2">
                                    ⭐ En vedette
                                </span>
                            </div>
                        </div>

                        <div>
                            <h5 class="text-lg font-semibold text-gray-900 mb-4">Produits populaires</h5>
                            <div class="space-y-3">
                                <div v-for="product in selectedTag.popularProducts" :key="product.name"
                                    class="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200">
                                    <div class="flex items-center space-x-3">
                                        <span class="text-xl">{{ product.icon }}</span>
                                        <span class="font-medium text-gray-800">{{ product.name }}</span>
                                    </div>
                                    <span class="text-sm text-gray-500">{{ product.count }} fois</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="mt-20 text-center animate-fade-in">
                <div
                    class="bg-gradient-to-r from-primary-green/10 via-green-50/30 to-emerald-50/20 rounded-3xl p-12 border border-primary-green/30">
                    <h3 class="text-3xl font-bold text-forest-green mb-4">Créez votre propre univers de tags</h3>
                    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Personnalisez votre catalogue avec des tags qui reflètent votre identité et vos valeurs
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center gap-6">
                        <button @click="createTag"
                            class="px-8 py-4 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center space-x-3 text-lg font-semibold">
                            <span class="text-2xl">✨</span>
                            <span>Créer un tag personnalisé</span>
                        </button>
                        <button @click="importTags"
                            class="px-8 py-4 bg-gradient-to-r from-secondary-orange/10 to-orange-100 border border-secondary-orange/30 text-earth-brown rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center space-x-3 text-lg font-semibold">
                            <span class="text-2xl">📥</span>
                            <span>Importer des tags</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bouton flottant pour mobile -->
        <button @click="createTag"
            class="md:hidden fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary-green to-green-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 transition-organic z-50 animate-bounce-soft">
            <span class="text-3xl">➕</span>
        </button>

        <!-- Modale de création de tag -->
        <transition name="modal-fade">
            <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <!-- Contenu de la modale -->
                    <div class="text-center mb-8">
                        <div
                            class="w-20 h-20 bg-gradient-to-br from-primary-green to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span class="text-4xl text-white">🏷️</span>
                        </div>
                        <h3 class="text-3xl font-bold text-forest-green mb-3">Créer un nouveau tag</h3>
                        <p class="text-gray-600">Donnez vie à votre tag avec un nom, une couleur et une icône</p>
                    </div>

                    <form @submit.prevent="submitTag" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du tag</label>
                                <input v-model="newTag.name" type="text" required
                                    class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                                <div class="flex space-x-2">
                                    <div v-for="color in availableColors" :key="color" @click="newTag.color = color"
                                        class="w-10 h-10 rounded-full border-2 cursor-pointer transition-all duration-300 transition-organic hover:scale-110"
                                        :class="newTag.color === color ? 'ring-2 ring-offset-2 ring-primary-green' : 'border-white'"
                                        :style="{ backgroundColor: color }">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                            <div class="flex flex-wrap gap-3">
                                <div v-for="icon in availableIcons" :key="icon" @click="newTag.icon = icon"
                                    class="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 transition-organic hover:scale-110"
                                    :class="newTag.icon === icon ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100 border border-gray-300'">
                                    <span class="text-2xl">{{ icon }}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea v-model="newTag.description" rows="3"
                                class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic"></textarea>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                                <select v-model="newTag.category"
                                    class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                                    <option value="qualite">Qualité</option>
                                    <option value="origine">Origine</option>
                                    <option value="saison">Saison</option>
                                    <option value="usage">Usage</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select v-model="newTag.type"
                                    class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                                    <option value="standard">Standard</option>
                                    <option value="premium">Premium</option>
                                    <option value="systeme">Système</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-4 pt-6">
                            <button type="button" @click="showCreateModal = false"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 transition-organic">
                                Annuler
                            </button>
                            <button type="submit"
                                class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105">
                                Créer le tag
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
    name: 'TagViews',
    data() {
        return {
            searchQuery: '',
            activeCategory: null,
            activeColors: [],
            activePopularity: null,
            sortBy: 'popularity',
            currentPage: 1,
            itemsPerPage: 12,
            selectedTag: null,
            hoverTag: null,
            showCreateModal: false,
            totalTags: 48,
            popularTagsCount: 12,
            averageUsage: 23,
            newThisMonth: 5,
            tagCategories: [
                {
                    id: 'qualite',
                    label: 'Qualité',
                    icon: '⭐',
                    count: 15,
                    classes: {
                        active: 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-700',
                        inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-amber-200 hover:bg-amber-50'
                    }
                },
                {
                    id: 'origine',
                    label: 'Origine',
                    icon: '📍',
                    count: 12,
                    classes: {
                        active: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700',
                        inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
                    }
                },
                {
                    id: 'saison',
                    label: 'Saison',
                    icon: '🍂',
                    count: 8,
                    classes: {
                        active: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700',
                        inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-green-200 hover:bg-green-50'
                    }
                },
                {
                    id: 'usage',
                    label: 'Usage',
                    icon: '🍳',
                    count: 10,
                    classes: {
                        active: 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 text-purple-700',
                        inactive: 'bg-white/70 border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50'
                    }
                }
            ],
            colorFilters: [
                { id: 'green', label: 'Vert', hex: '#45a348' },
                { id: 'orange', label: 'Orange', hex: '#ff8c42' },
                { id: 'blue', label: 'Bleu', hex: '#3b82f6' },
                { id: 'purple', label: 'Violet', hex: '#8b5cf6' },
                { id: 'red', label: 'Rouge', hex: '#ef4444' }
            ],
            popularityFilters: [
                { id: 'high', label: 'Élevée' },
                { id: 'medium', label: 'Moyenne' },
                { id: 'low', label: 'Faible' }
            ],
            availableColors: ['#45a348', '#ff8c42', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'],
            availableIcons: ['🏷️', '⭐', '🌿', '📍', '🍎', '🥕', '🍳', '🔥', '✨', '🆕', '💎', '🎯'],
            newTag: {
                name: '',
                color: '#45a348',
                icon: '🏷️',
                description: '',
                category: 'qualite',
                type: 'standard'
            },
            tags: [
                {
                    id: 1,
                    name: 'Bio',
                    color: '#45a348',
                    icon: '🌿',
                    category: 'Qualité',
                    type: 'Premium',
                    description: 'Produits issus de l\'agriculture biologique',
                    usageCount: 156,
                    productCount: 42,
                    createdAgo: 'il y a 2 ans',
                    lastUsed: 'Aujourd\'hui',
                    featured: true,
                    new: false,
                    creator: 'Admin',
                    recentProducts: ['Pommes Golden', 'Carottes', 'Laitue'],
                    popularProducts: [
                        { name: 'Pommes Golden', icon: '🍎', count: 42 },
                        { name: 'Carottes', icon: '🥕', count: 38 },
                        { name: 'Laitue', icon: '🥬', count: 35 }
                    ],
                    fullDescription: 'Ce tag identifie tous les produits certifiés bio, garantissant une culture sans pesticides ni engrais chimiques.'
                },
                {
                    id: 2,
                    name: 'Local',
                    color: '#ff8c42',
                    icon: '📍',
                    category: 'Origine',
                    type: 'Standard',
                    description: 'Produits provenant de producteurs locaux',
                    usageCount: 128,
                    productCount: 38,
                    createdAgo: 'il y a 1 an',
                    lastUsed: 'Hier',
                    featured: true,
                    new: false,
                    creator: 'Manager',
                    recentProducts: ['Miel', 'Fromage', 'Pain'],
                    popularProducts: [
                        { name: 'Miel de lavande', icon: '🍯', count: 45 },
                        { name: 'Fromage de chèvre', icon: '🧀', count: 32 },
                        { name: 'Pain au levain', icon: '🥖', count: 28 }
                    ],
                    fullDescription: 'Produits cultivés ou fabriqués à moins de 100km, soutenant l\'économie locale et réduisant l\'empreinte carbone.'
                },
                {
                    id: 3,
                    name: 'Saisonnier',
                    color: '#3b82f6',
                    icon: '🍂',
                    category: 'Saison',
                    type: 'Standard',
                    description: 'Produits de saison actuelle',
                    usageCount: 95,
                    productCount: 28,
                    createdAgo: 'il y a 8 mois',
                    lastUsed: 'Aujourd\'hui',
                    featured: false,
                    new: false,
                    creator: 'Admin',
                    recentProducts: ['Fraises', 'Asperges', 'Courgettes'],
                    popularProducts: [
                        { name: 'Fraises Gariguette', icon: '🍓', count: 52 },
                        { name: 'Asperges vertes', icon: '🌱', count: 34 },
                        { name: 'Courgettes', icon: '🥒', count: 29 }
                    ],
                    fullDescription: 'Indique les produits actuellement en saison, garantissant fraîcheur optimale et prix compétitifs.'
                },
                {
                    id: 4,
                    name: 'Primeur',
                    color: '#8b5cf6',
                    icon: '✨',
                    category: 'Qualité',
                    type: 'Premium',
                    description: 'Premières récoltes de la saison',
                    usageCount: 42,
                    productCount: 12,
                    createdAgo: 'il y a 3 mois',
                    lastUsed: 'Il y a 2 jours',
                    featured: true,
                    new: true,
                    creator: 'Producteur',
                    recentProducts: ['Petits pois', 'Radis', 'Épinards'],
                    popularProducts: [
                        { name: 'Petits pois frais', icon: '🫛', count: 25 },
                        { name: 'Radis roses', icon: '🌶️', count: 18 },
                        { name: 'Épinards frais', icon: '🥬', count: 15 }
                    ],
                    fullDescription: 'Les toutes premières récoltes de la saison, d\'une fraîcheur et d\'une saveur exceptionnelles.'
                },
                {
                    id: 5,
                    name: 'Fait maison',
                    color: '#ef4444',
                    icon: '🍳',
                    category: 'Usage',
                    type: 'Standard',
                    description: 'Préparations artisanales',
                    usageCount: 87,
                    productCount: 24,
                    createdAgo: 'il y a 1 an',
                    lastUsed: 'Aujourd\'hui',
                    featured: false,
                    new: false,
                    creator: 'Artisan',
                    recentProducts: ['Confiture', 'Pâté', 'Biscuits'],
                    popularProducts: [
                        { name: 'Confiture de fraise', icon: '🍓', count: 38 },
                        { name: 'Pâté de campagne', icon: '🥩', count: 26 },
                        { name: 'Biscuits aux amandes', icon: '🍪', count: 23 }
                    ],
                    fullDescription: 'Produits préparés à la main selon des recettes traditionnelles, sans additifs ni conservateurs.'
                },
                {
                    id: 6,
                    name: 'Équitable',
                    color: '#10b981',
                    icon: '🤝',
                    category: 'Qualité',
                    type: 'Premium',
                    description: 'Commerce équitable certifié',
                    usageCount: 63,
                    productCount: 18,
                    createdAgo: 'il y a 6 mois',
                    lastUsed: 'Il y a 1 semaine',
                    featured: false,
                    new: false,
                    creator: 'Admin',
                    recentProducts: ['Café', 'Chocolat', 'Riz'],
                    popularProducts: [
                        { name: 'Café équitable', icon: '☕', count: 42 },
                        { name: 'Chocolat noir', icon: '🍫', count: 31 },
                        { name: 'Riz basmati', icon: '🍚', count: 22 }
                    ],
                    fullDescription: 'Garantit une rémunération juste aux producteurs et des conditions de travail décentes.'
                },
                {
                    id: 7,
                    name: 'Vegan',
                    color: '#45a348',
                    icon: '🌱',
                    category: 'Usage',
                    type: 'Standard',
                    description: 'Sans produits animaux',
                    usageCount: 72,
                    productCount: 31,
                    createdAgo: 'il y a 10 mois',
                    lastUsed: 'Hier',
                    featured: false,
                    new: false,
                    creator: 'Manager',
                    recentProducts: ['Lait d\'amande', 'Tofu', 'Burger végétal'],
                    popularProducts: [
                        { name: 'Lait d\'amande', icon: '🥛', count: 48 },
                        { name: 'Tofu ferme', icon: '🧈', count: 35 },
                        { name: 'Burger végétal', icon: '🍔', count: 28 }
                    ],
                    fullDescription: 'Produits 100% végétaux, sans ingrédients d\'origine animale, adaptés au régime vegan.'
                },
                {
                    id: 8,
                    name: 'Sans gluten',
                    color: '#f59e0b',
                    icon: '🌾',
                    category: 'Usage',
                    type: 'Standard',
                    description: 'Adapté aux intolérants',
                    usageCount: 58,
                    productCount: 22,
                    createdAgo: 'il y a 1 an',
                    lastUsed: 'Aujourd\'hui',
                    featured: false,
                    new: false,
                    creator: 'Admin',
                    recentProducts: ['Pains GF', 'Pâtes GF', 'Biscuits GF'],
                    popularProducts: [
                        { name: 'Pain sans gluten', icon: '🥖', count: 32 },
                        { name: 'Pâtes de riz', icon: '🍝', count: 25 },
                        { name: 'Cookies GF', icon: '🍪', count: 18 }
                    ],
                    fullDescription: 'Produits certifiés sans gluten, adaptés aux personnes souffrant de maladie cœliaque ou d\'intolérance.'
                }
            ]
        }
    },
    computed: {
        filteredTags() {
            let filtered = this.tags

            // Filtre par recherche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                filtered = filtered.filter(tag =>
                    tag.name.toLowerCase().includes(query) ||
                    tag.description.toLowerCase().includes(query) ||
                    tag.category.toLowerCase().includes(query)
                )
            }

            // Filtre par catégorie
            if (this.activeCategory) {
                filtered = filtered.filter(tag =>
                    tag.category.toLowerCase() === this.activeCategory
                )
            }

            // Filtre par couleur
            if (this.activeColors.length > 0) {
                filtered = filtered.filter(tag =>
                    this.activeColors.some(color => tag.color === this.getColorHex(color))
                )
            }

            // Filtre par popularité
            if (this.activePopularity) {
                filtered = filtered.filter(tag => {
                    if (this.activePopularity === 'high') return tag.usageCount > 100
                    if (this.activePopularity === 'medium') return tag.usageCount >= 50 && tag.usageCount <= 100
                    return tag.usageCount < 50
                })
            }

            // Tri
            filtered = [...filtered].sort((a, b) => {
                switch (this.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name)
                    case 'popularity':
                        return b.usageCount - a.usageCount
                    case 'recent':
                        // Simuler le tri par date de création
                        return b.id - a.id
                    case 'color':
                        return a.color.localeCompare(b.color)
                    default:
                        return b.usageCount - a.usageCount
                }
            })

            // Pagination
            const start = (this.currentPage - 1) * this.itemsPerPage
            const end = start + this.itemsPerPage
            return filtered.slice(start, end)
        },
        featuredTags() {
            // Tags pour le nuage de tags (les plus populaires)
            return this.tags
                .filter(tag => tag.usageCount > 50)
                .map(tag => ({
                    ...tag,
                    size: Math.min(20 + (tag.usageCount / 10), 40)
                }))
                .slice(0, 20)
        },
        totalPages() {
            return Math.ceil(this.tags.length / this.itemsPerPage)
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
        getColorHex(colorId) {
            const color = this.colorFilters.find(c => c.id === colorId)
            return color ? color.hex : '#45a348'
        },
        toggleCategory(categoryId) {
            this.activeCategory = this.activeCategory === categoryId ? null : categoryId
            this.currentPage = 1
        },
        toggleColor(colorId) {
            const index = this.activeColors.indexOf(colorId)
            if (index > -1) {
                this.activeColors.splice(index, 1)
            } else {
                this.activeColors.push(colorId)
            }
            this.currentPage = 1
        },
        togglePopularity(popId) {
            this.activePopularity = this.activePopularity === popId ? null : popId
            this.currentPage = 1
        },
        resetFilters() {
            this.searchQuery = ''
            this.activeCategory = null
            this.activeColors = []
            this.activePopularity = null
            this.currentPage = 1
        },
        selectTag(tag) {
            this.selectedTag = this.selectedTag?.id === tag.id ? null : tag
        },
        createTag() {
            this.showCreateModal = true
        },
        editTag(tag) {
            console.log('Éditer le tag:', tag)
            // Ouvrir une modale d'édition
        },
        deleteTag(tag) {
            if (confirm(`Supprimer le tag "${tag.name}" ? Cette action est irréversible.`)) {
                console.log('Supprimer le tag:', tag)
                // Logique de suppression
            }
        },
        applyTag(tag) {
            console.log('Appliquer le tag:', tag)
            // Logique d'application du tag
        },
        importTags() {
            console.log('Importer des tags')
            // Logique d'import
        },
        submitTag() {
            console.log('Créer un nouveau tag:', this.newTag)
            this.showCreateModal = false
            // Logique de création
            this.resetNewTag()
        },
        resetNewTag() {
            this.newTag = {
                name: '',
                color: '#45a348',
                icon: '🏷️',
                description: '',
                category: 'qualite',
                type: 'standard'
            }
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
.organic-tag-bg {
    background: linear-gradient(135deg,
            rgba(240, 253, 244, 0.95) 0%,
            /* Vert très pâle */
            rgba(220, 252, 231, 0.9) 25%,
            /* Vert clair */
            rgba(255, 255, 255, 1) 50%,
            /* Blanc */
            rgba(254, 243, 199, 0.9) 75%,
            /* Jaune pâle */
            rgba(240, 253, 244, 0.95) 100%
            /* Boucle */
        );
    min-height: 100vh;
}

/* Texture de fond */
.tag-texture {
    background-image:
        radial-gradient(circle at 15% 25%, rgba(69, 163, 72, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 85% 75%, rgba(255, 140, 66, 0.03) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0C26.9 0 0 26.9 0 60s26.9 60 60 60 60-26.9 60-60S93.1 0 60 0zm0 20c22.1 0 40 17.9 40 40s-17.9 40-40 40S20 82.1 20 60 37.9 20 60 20zm-5 60l25-25-25-25v50z' fill='%2345a348' fill-opacity='0.03'/%3E%3C/svg%3E");
    background-size: 200px 200px, 150px 150px, 120px 120px;
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

.animate-slide-in-down {
    animation: slide-in-down 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-card-appear {
    animation: card-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-fade-in {
    animation: fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Animation des feuilles */
@keyframes leaf-float {

    0%,
    100% {
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

    0%,
    100% {
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

    0%,
    100% {
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
    background: linear-gradient(45deg,
            transparent 0%,
            rgba(69, 163, 72, 0.03) 50%,
            transparent 100%);
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

/* Nuage de tags */
.organic-tag-cloud {
    position: relative;
    overflow: hidden;
}

.organic-tag-cloud::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg,
            var(--primary-green) 0%,
            rgba(255, 140, 66, 0.2) 50%,
            var(--primary-green) 100%);
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.2;
    pointer-events: none;
}

/* Carte de tag */
.organic-tag-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
}

.organic-tag-card:hover {
    box-shadow: 0 20px 40px rgba(69, 163, 72, 0.15);
}

.organic-tag-card::before {
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

.organic-tag-card:hover::before {
    opacity: 1;
}

.card-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.card-content {
    padding: 1.5rem;
}

.card-footer {
    padding: 1.5rem;
    background: rgba(249, 250, 251, 0.5);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Carte de détails */
.organic-details-card {
    position: relative;
    overflow: hidden;
}

.organic-details-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg,
            var(--primary-green) 0%,
            rgba(255, 140, 66, 0.3) 50%,
            var(--primary-green) 100%);
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.3;
    pointer-events: none;
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

/* Effet de brillance sur les tags */
.tag-glow {
    position: relative;
    overflow: hidden;
}

.tag-glow::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%);
    transform: rotate(45deg);
    animation: tag-shine 3s infinite;
}

@keyframes tag-shine {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }

    100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .organic-tag-card {
        margin-bottom: 1.5rem;
    }

    .card-header,
    .card-content,
    .card-footer {
        padding: 1rem;
    }

    .text-5xl {
        font-size: 2.5rem;
    }

    .text-6xl {
        font-size: 3rem;
    }

    .grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {

    .grid-cols-4,
    .grid-cols-3,
    .grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .flex-wrap {
        justify-content: center;
    }
}
</style>