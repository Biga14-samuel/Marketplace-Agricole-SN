<template>
    <div class="min-h-screen relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 z-0">
            <!-- Dégradé organique -->
            <div class="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-cream-light to-terracotta/5"></div>

            <!-- Filigrane de produits frais -->
            <div class="absolute inset-0 opacity-[0.015]">
                <div
                    class="absolute top-1/4 left-1/4 w-64 h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMjggNDhDMTQ4Ljg2NiA0OCAxNjYgNjUuMTM0MyAxNjYgODZDMzY2IDg2IDE2NiAxNjcuODY2IDE2NiAxODZDNjYgMTg2IDE2NiAyMDUuMTM0IDE2NiAyMjZDMTY2IDI0Ni44NjYgMTQ4Ljg2NiAyNjQgMTI4IDI2NEMxMDcuMTM0IDI2NCA5MCAyNDYuODY2IDkwIDIyNkM5MCAyMDUuMTM0IDcwLjEzNDMgMTg2IDUwIDE4NkM3MC4xMzQzIDE4NiA5MCAxNjcuODY2IDkwIDE0NkM5MCAxMjYuMTM0IDcwIDEwNiA1MCA4NkM3MCA4NiA5MCA2NS4xMzQzIDkwIDQ2QzkwIDI1LjEzNDMgMTA3LjEzNCA4IDEyOCA4WiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4K')] bg-contain">
                </div>
                <div
                    class="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik05NiAzMkMxMTYuODU0IDMyIDEzNCA0OS4xNDU4IDEzNCA3MEMxMzQgOTAuODU0MiAxMTYuODU0IDEwOCA5NiAxMDhDNzUuMTQ1OCAxMDggNTggOTAuODU0MiA1OCA3MEM1OCA0OS4xNDU4IDc1LjE0NTggMzIgOTYgMzJaTTE0MiAxMjJDMTYyLjg1NCAxMjIgMTgwIDEzOS4xNDYgMTgwIDE2MEMxODAgMTgwLjg1NCAxNjIuODU0IDE5OCAxNDIgMTk4QzEyMS4xNDYgMTk4IDEwNCAxODAuODU0IDEwNCAxNjBDMTA0IDEzOS4xNDYgMTIxLjE0NiAxMjIgMTQyIDEyMlpNNTAgMTIyQzcwLjg1NDIgMTIyIDg4IDEzOS4xNDYgODggMTYwQzg4IDE4MC44NTQgNzAuODU0MiAxOTggNTAgMTk4QzI5LjE0NTggMTk4IDEyIDE4MC44NTQgMTIgMTYwQzEyIDEzOS4xNDYgMjkuMTQ1OCAxMjIgNTAgMTIyWiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4K')] bg-contain">
                </div>
            </div>
        </div>

        <!-- Animation d'ambiance subtile -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div class="floating-leaf leaf-1"></div>
            <div class="floating-leaf leaf-2"></div>
            <div class="floating-leaf leaf-3"></div>
        </div>

        <!-- Contenu principal -->
        <div class="relative z-10">
            <!-- En-tête avec navigation organique -->
            <header class="pt-8 px-6">
                <nav class="flex justify-between items-center max-w-7xl mx-auto">
                    <router-link to="/" class="group">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-12 h-12 rounded-full bg-gradient-to-br from-forest-green to-terracotta p-0.5 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                                <div class="w-full h-full rounded-full bg-cream-light flex items-center justify-center">
                                    <span class="text-2xl font-serif text-forest-green">🍎</span>
                                </div>
                            </div>
                            <div>
                                <h1 class="text-2xl font-serif font-semibold text-forest-green">Les Producteurs Locaux
                                </h1>
                                <p class="text-sm text-nature-gray mt-1">Trouvez la fraîcheur près de chez vous</p>
                            </div>
                        </div>
                    </router-link>

                    <div class="flex items-center space-x-6">
                        <router-link to="/"
                            class="text-nature-gray hover:text-forest-green transition-all duration-500 hover:scale-105 font-medium relative group">
                            Accueil
                            <span
                                class="absolute -bottom-1 left-0 w-0 h-0.5 bg-forest-green transition-all duration-500 group-hover:w-full"></span>
                        </router-link>
                        <router-link to="/catalog"
                            class="text-nature-gray hover:text-forest-green transition-all duration-500 hover:scale-105 font-medium relative group">
                            Catalogue
                            <span
                                class="absolute -bottom-1 left-0 w-0 h-0.5 bg-forest-green transition-all duration-500 group-hover:w-full"></span>
                        </router-link>
                        <button class="btn-primary px-6 py-3">
                            <span class="flex items-center space-x-2">
                                <span>👤</span>
                                <span>Mon compte</span>
                            </span>
                        </button>
                    </div>
                </nav>
            </header>

            <!-- Hero section -->
            <section class="pt-16 pb-20 px-6">
                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-16 animate-slide-up">
                        <h2 class="text-5xl font-serif font-bold text-forest-green mb-6 leading-tight">
                            Nos <span class="text-terracotta">Producteurs</span> Partenaires
                        </h2>
                        <p class="text-xl text-nature-gray max-w-3xl mx-auto">
                            Rencontrez les artisans passionnés qui cultivent avec soin vos produits frais
                        </p>
                    </div>

                    <!-- Filtres organiques -->
                    <div class="mb-12 animate-slide-up" style="animation-delay: 0.1s">
                        <div class="flex flex-wrap justify-center gap-4">
                            <button v-for="category in categories" :key="category.id"
                                @click="filterByCategory(category.id)" :class="[
                                    'px-6 py-3 rounded-full border-2 transition-all duration-500 hover:scale-105',
                                    activeCategory === category.id
                                        ? 'bg-forest-green border-forest-green text-white shadow-lg transform scale-105'
                                        : 'border-forest-green/20 text-forest-green hover:border-forest-green/40 hover:bg-forest-green/5'
                                ]" style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)">
                                <span class="flex items-center space-x-2">
                                    <span>{{ category.icon }}</span>
                                    <span>{{ category.name }}</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Barre de recherche organique -->
                    <div class="max-w-2xl mx-auto mb-16 animate-slide-up" style="animation-delay: 0.2s">
                        <div class="relative group">
                            <div
                                class="absolute -inset-1 bg-gradient-to-r from-forest-green/20 to-terracotta/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            </div>
                            <div class="relative">
                                <input v-model="searchQuery" type="text"
                                    placeholder="Rechercher un producteur, une spécialité..."
                                    class="w-full px-8 py-4 bg-white/90 backdrop-blur-sm border-2 border-forest-green/20 rounded-2xl text-nature-gray focus:outline-none focus:border-forest-green/40 focus:ring-4 focus:ring-forest-green/10 transition-all duration-500"
                                    style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)" />
                                <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <span class="text-forest-green">🔍</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Grille des producteurs -->
            <section class="pb-24 px-6">
                <div class="max-w-7xl mx-auto">
                    <!-- Statistiques -->
                    <div class="mb-12 animate-slide-up" style="animation-delay: 0.3s">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="card-stat">
                                <div class="text-4xl text-forest-green mb-2">{{ filteredUnits.length }}</div>
                                <div class="text-nature-gray">Producteurs actifs</div>
                            </div>
                            <div class="card-stat">
                                <div class="text-4xl text-terracotta mb-2">{{ bioCount }}</div>
                                <div class="text-nature-gray">Producteurs bio</div>
                            </div>
                            <div class="card-stat">
                                <div class="text-4xl text-forest-green mb-2">{{ localCount }}</div>
                                <div class="text-nature-gray">Producteurs locaux</div>
                            </div>
                        </div>
                    </div>

                    <!-- Cartes des producteurs -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <transition-group name="staggered-fade">
                            <div v-for="(unit, index) in filteredUnits" :key="unit.id" class="animate-slide-up"
                                :style="`animation-delay: ${0.4 + index * 0.05}s`">
                                <router-link :to="`/unit/${unit.id}`">
                                    <div class="card-producer group">
                                        <!-- Badge bio si applicable -->
                                        <div v-if="unit.isBio" class="absolute top-4 right-4 z-20">
                                            <div class="bio-badge">
                                                🌿 Bio
                                            </div>
                                        </div>

                                        <!-- Image du producteur -->
                                        <div class="relative h-64 overflow-hidden rounded-t-2xl">
                                            <div
                                                class="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-terracotta/20 z-10">
                                            </div>
                                            <img :src="unit.image" :alt="unit.name"
                                                class="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                                                style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)" />
                                            <div
                                                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-16 z-10">
                                            </div>
                                        </div>

                                        <!-- Contenu de la carte -->
                                        <div class="p-6">
                                            <div class="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3
                                                        class="text-xl font-serif font-semibold text-forest-green group-hover:text-terracotta transition-colors duration-500">
                                                        {{ unit.name }}
                                                    </h3>
                                                    <p class="text-nature-gray mt-1">{{ unit.category }}</p>
                                                </div>
                                                <div class="text-terracotta text-3xl">{{ unit.icon }}</div>
                                            </div>

                                            <p class="text-nature-gray mb-6 line-clamp-2">
                                                {{ unit.description }}
                                            </p>

                                            <!-- Spécialités -->
                                            <div class="flex flex-wrap gap-2 mb-6">
                                                <span v-for="specialty in unit.specialties" :key="specialty"
                                                    class="px-3 py-1 bg-forest-green/10 text-forest-green rounded-full text-sm">
                                                    {{ specialty }}
                                                </span>
                                            </div>

                                            <!-- Distance et notation -->
                                            <div
                                                class="flex justify-between items-center pt-4 border-t border-forest-green/10">
                                                <div class="flex items-center space-x-2">
                                                    <span class="text-terracotta">📍</span>
                                                    <span class="text-nature-gray">{{ unit.distance }}</span>
                                                </div>
                                                <div class="flex items-center space-x-1">
                                                    <span class="text-amber-500">⭐</span>
                                                    <span class="font-medium text-forest-green">{{ unit.rating }}</span>
                                                    <span class="text-nature-gray">({{ unit.reviews }})</span>
                                                </div>
                                            </div>

                                            <!-- Bouton visiter -->
                                            <div class="mt-6">
                                                <button class="btn-secondary w-full">
                                                    <span class="flex items-center justify-center space-x-2">
                                                        <span>👨‍🌾</span>
                                                        <span>Visiter la ferme</span>
                                                        <span
                                                            class="transform transition-transform duration-500 group-hover:translate-x-1">→</span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </transition-group>
                    </div>

                    <!-- Message si aucun résultat -->
                    <div v-if="filteredUnits.length === 0" class="text-center py-16 animate-slide-up">
                        <div class="text-6xl mb-6">🍃</div>
                        <h3 class="text-2xl font-serif text-forest-green mb-4">Aucun producteur trouvé</h3>
                        <p class="text-nature-gray mb-8 max-w-md mx-auto">
                            Essayez de modifier vos filtres ou de chercher autre chose
                        </p>
                        <button @click="resetFilters" class="btn-primary px-8 py-3">
                            Réinitialiser les filtres
                        </button>
                    </div>
                </div>
            </section>

            <!-- CTA -->
            <section class="pb-24 px-6">
                <div class="max-w-4xl mx-auto">
                    <div class="cta-container animate-slide-up">
                        <div class="text-center">
                            <h3 class="text-3xl font-serif font-bold text-white mb-6">
                                Vous êtes producteur ?
                            </h3>
                            <p class="text-white/90 mb-8 max-w-2xl mx-auto">
                                Rejoignez notre communauté de passionnés et partagez vos produits frais avec des
                                consommateurs engagés.
                            </p>
                            <button class="btn-cta">
                                <span class="flex items-center space-x-3">
                                    <span>👨‍🌾</span>
                                    <span>Devenir producteur partenaire</span>
                                    <span
                                        class="transform transition-transform duration-500 group-hover:translate-x-2">→</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UnitViews',
    data() {
        return {
            searchQuery: '',
            activeCategory: null,
            categories: [
                { id: 1, name: 'Tous', icon: '🌱' },
                { id: 2, name: 'Maraîchers', icon: '🥬' },
                { id: 3, name: 'Arboriculteurs', icon: '🍎' },
                { id: 4, name: 'Éleveurs', icon: '🐄' },
                { id: 5, name: 'Fromagers', icon: '🧀' },
                { id: 6, name: 'Viticulteurs', icon: '🍇' }
            ],
            units: [
                {
                    id: 1,
                    name: 'Ferme du Bois Joli',
                    category: 'Maraîcher Bio',
                    description: 'Cultivateur passionné depuis 3 générations, spécialisé dans les légumes de saison et les herbes aromatiques.',
                    distance: 'à 12km',
                    rating: 4.8,
                    reviews: 142,
                    isBio: true,
                    isLocal: true,
                    icon: '🥕',
                    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800',
                    specialties: ['Légumes bio', 'Herbes aromatiques', 'Produits de saison']
                },
                {
                    id: 2,
                    name: 'Verger des Trois Vallées',
                    category: 'Arboriculteur',
                    description: 'Pommes, poires et fruits rouges cultivés en agriculture raisonnée dans nos vergers familiaux.',
                    distance: 'à 8km',
                    rating: 4.6,
                    reviews: 89,
                    isBio: false,
                    isLocal: true,
                    icon: '🍎',
                    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800',
                    specialties: ['Pommes', 'Poires', 'Fruits rouges']
                },
                {
                    id: 3,
                    name: 'Fromagerie du Vieux Chêne',
                    category: 'Fromager Artisanal',
                    description: 'Fromages au lait cru de vache et de chèvre, affinés dans nos caves naturelles.',
                    distance: 'à 25km',
                    rating: 4.9,
                    reviews: 203,
                    isBio: true,
                    isLocal: true,
                    icon: '🧀',
                    image: 'https://images.unsplash.com/photo-1559561725-8762bb2c188c?auto=format&fit=crop&w=800',
                    specialties: ['Fromages au lait cru', 'Chèvre', 'Fromages affinés']
                }
                // Ajoutez plus de producteurs ici...
            ]
        }
    },
    computed: {
        filteredUnits() {
            let filtered = this.units

            // Filtre par catégorie
            if (this.activeCategory) {
                const category = this.categories.find(c => c.id === this.activeCategory)
                if (category && category.name !== 'Tous') {
                    filtered = filtered.filter(unit =>
                        unit.category.toLowerCase().includes(category.name.toLowerCase())
                    )
                }
            }

            // Filtre par recherche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                filtered = filtered.filter(unit =>
                    unit.name.toLowerCase().includes(query) ||
                    unit.description.toLowerCase().includes(query) ||
                    unit.specialties.some(s => s.toLowerCase().includes(query))
                )
            }

            return filtered
        },
        bioCount() {
            return this.units.filter(unit => unit.isBio).length
        },
        localCount() {
            return this.units.filter(unit => unit.isLocal).length
        }
    },
    methods: {
        filterByCategory(categoryId) {
            this.activeCategory = this.activeCategory === categoryId ? null : categoryId
        },
        resetFilters() {
            this.searchQuery = ''
            this.activeCategory = null
        }
    }
}
</script>

<style scoped>
/* Animation de page */
.page-enter-active,
.page-leave-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

/* Animation staggered pour les cartes */
.staggered-fade-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.staggered-fade-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

/* Animation de slide up personnalisée */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* Animations de feuilles flottantes */
.floating-leaf {
    position: absolute;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5C40 5 45 15 45 25C45 35 35 45 25 45C15 45 5 35 5 25C5 15 15 5 25 5C35 5 40 15 40 25C40 35 30 45 20 45C10 45 0 35 0 25C0 15 10 5 20 5C30 5 35 15 35 25C35 35 25 45 15 45C5 45 0 35 0 25C0 15 10 5 20 5Z' fill='%23008000' opacity='0.05'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    animation: float 25s infinite ease-in-out;
}

.leaf-1 {
    width: 80px;
    height: 80px;
    top: 10%;
    left: 5%;
    animation-delay: 0s;
}

.leaf-2 {
    width: 120px;
    height: 120px;
    top: 60%;
    right: 10%;
    animation-delay: 5s;
}

.leaf-3 {
    width: 60px;
    height: 60px;
    bottom: 20%;
    left: 15%;
    animation-delay: 10s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    33% {
        transform: translateY(-20px) rotate(120deg);
    }

    66% {
        transform: translateY(10px) rotate(240deg);
    }
}

/* Composants stylisés */
.card-producer {
    @apply bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-forest-green/10 shadow-lg hover:shadow-2xl transition-all duration-700;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-producer:hover {
    transform: translateY(-8px);
}

.card-stat {
    @apply bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-forest-green/10 shadow-lg;
}

.cta-container {
    @apply relative overflow-hidden rounded-3xl p-12;
    background: linear-gradient(135deg,
            rgba(34, 139, 34, 0.9) 0%,
            rgba(152, 251, 152, 0.85) 100%);
    backdrop-filter: blur(10px);
}

.cta-container::before {
    content: '';
    @apply absolute inset-0 opacity-10;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.bio-badge {
    @apply px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110;
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
    }

    50% {
        box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
}

/* Boutons avec courbes de bézier personnalisées */
.btn-primary {
    @apply bg-gradient-to-r from-forest-green to-emerald-600 text-white font-semibold rounded-full shadow-lg transition-all duration-500 hover:shadow-xl transform hover:scale-105;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-secondary {
    @apply bg-gradient-to-r from-terracotta/10 to-terracotta/5 text-terracotta font-semibold rounded-full border border-terracotta/20 transition-all duration-500 hover:border-terracotta/40 transform hover:scale-105;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-cta {
    @apply bg-white text-forest-green font-semibold rounded-full px-8 py-4 shadow-2xl transition-all duration-700 hover:scale-105 hover:shadow-3xl;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Utilitaires */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

<style>
/* Variables globales */
:root {
    --forest-green: #228B22;
    --cream-light: #FFFDD0;
    --terracotta: #E2725B;
    --nature-gray: #666666;
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