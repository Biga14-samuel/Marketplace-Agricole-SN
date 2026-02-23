<template>
    <div class="min-h-screen relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 z-0">
            <!-- Dégradé organique raffiné -->
            <div class="absolute inset-0 bg-gradient-to-br from-forest-green/3 via-cream-light/5 to-terracotta/2"></div>

            <!-- Motifs filigranes gourmands -->
            <div class="absolute inset-0 opacity-[0.02]">
                <div class="absolute top-10 left-10 w-48 h-48" v-html="fruitPattern"></div>
                <div class="absolute bottom-10 right-10 w-64 h-64" v-html="veggiePattern"></div>
                <div class="absolute top-1/2 left-1/4 w-32 h-32" v-html="leafPattern"></div>
            </div>

            <!-- Grille artisanale subtile -->
            <div class="absolute inset-0"
                style="background-image: radial-gradient(circle at 1px 1px, rgba(34, 139, 34, 0.03) 1px, transparent 0); background-size: 40px 40px;">
            </div>
        </div>

        <!-- Animation d'ambiance subtile - Particules de fraîcheur -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
            <div class="particle particle-4"></div>
            <div class="particle particle-5"></div>
        </div>

        <!-- Contenu principal -->
        <div class="relative z-10">
            <!-- Navigation organique -->
            <header class="pt-6 px-6">
                <div class="max-w-7xl mx-auto">
                    <nav class="flex justify-between items-center">
                        <router-link to="/" class="group">
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-gradient-to-br from-forest-green to-terracotta p-0.5 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                                    <div
                                        class="w-full h-full rounded-full bg-cream-light flex items-center justify-center">
                                        <span class="text-xl font-serif text-forest-green">🍒</span>
                                    </div>
                                </div>
                                <div>
                                    <h1
                                        class="text-xl font-serif font-semibold text-forest-green group-hover:text-terracotta transition-colors duration-500">
                                        Marché Frais</h1>
                                </div>
                            </div>
                        </router-link>

                        <!-- Fil d'ariane organique -->
                        <div class="flex items-center space-x-2 text-sm">
                            <router-link to="/"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300">Accueil</router-link>
                            <span class="text-forest-green/30">›</span>
                            <router-link to="/catalog"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300">Catalogue</router-link>
                            <span class="text-forest-green/30">›</span>
                            <router-link :to="`/unit/${product.producer.id}`"
                                class="text-nature-gray hover:text-forest-green transition-colors duration-300">{{
                                    product.producer.name }}</router-link>
                            <span class="text-forest-green/30">›</span>
                            <span class="text-forest-green font-medium">{{ product.name }}</span>
                        </div>

                        <div class="flex items-center space-x-4">
                            <button class="relative group">
                                <div
                                    class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-forest-green/10 flex items-center justify-center text-forest-green hover:bg-forest-green/5 transition-all duration-500 hover:scale-110">
                                    <span>🛒</span>
                                    <span v-if="cartCount > 0"
                                        class="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                        {{ cartCount }}
                                    </span>
                                </div>
                            </button>
                            <button class="btn-secondary px-4 py-2 text-sm">
                                <span class="flex items-center space-x-2">
                                    <span>👤</span>
                                    <span>Mon compte</span>
                                </span>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <!-- Contenu produit principal -->
            <main class="py-8 px-6">
                <div class="max-w-7xl mx-auto">
                    <!-- En-tête produit avec animations -->
                    <div class="mb-8 animate-slide-up">
                        <button @click="$router.back()"
                            class="inline-flex items-center space-x-2 text-forest-green hover:text-terracotta transition-colors duration-500 group">
                            <span
                                class="transform transition-transform duration-500 group-hover:-translate-x-1">←</span>
                            <span>Retour aux produits</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        <!-- Galerie produit avec effet gourmand -->
                        <div class="animate-slide-up" style="animation-delay: 0.1s">
                            <div class="relative">
                                <!-- Image principale -->
                                <div class="relative rounded-3xl overflow-hidden shadow-2xl group">
                                    <div
                                        class="absolute inset-0 bg-gradient-to-br from-forest-green/10 to-terracotta/10 z-10">
                                    </div>
                                    <img :src="product.image" :alt="product.name"
                                        class="w-full h-[400px] object-cover transform transition-all duration-1000 group-hover:scale-105"
                                        style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)" />
                                    <!-- Badges flottants -->
                                    <div class="absolute top-6 left-6 z-20">
                                        <div v-if="product.isBio" class="bio-badge floating">
                                            🌿 Bio certifié
                                        </div>
                                    </div>
                                    <div class="absolute top-6 right-6 z-20">
                                        <div v-if="product.isLocal" class="local-badge floating"
                                            style="animation-delay: 0.3s">
                                            📍 Local
                                        </div>
                                    </div>
                                    <div class="absolute bottom-6 left-6 z-20">
                                        <div v-if="product.isSeasonal" class="season-badge floating"
                                            style="animation-delay: 0.6s">
                                            🌸 De saison
                                        </div>
                                    </div>
                                </div>

                                <!-- Miniatures -->
                                <div class="flex space-x-4 mt-6">
                                    <div v-for="(thumb, index) in product.thumbnails" :key="index"
                                        @click="selectedImage = thumb" :class="[
                                            'w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-500 hover:scale-110',
                                            selectedImage === thumb
                                                ? 'border-forest-green scale-110 shadow-lg'
                                                : 'border-transparent hover:border-forest-green/30'
                                        ]" style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)">
                                        <img :src="thumb" :alt="product.name" class="w-full h-full object-cover">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Informations produit -->
                        <div class="animate-slide-up" style="animation-delay: 0.2s">
                            <!-- En-tête produit -->
                            <div class="mb-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h1 class="text-4xl font-serif font-bold text-forest-green mb-2">{{ product.name
                                        }}</h1>
                                        <p class="text-terracotta text-xl font-medium">{{ product.producer.name }}</p>
                                    </div>
                                    <div class="text-5xl">{{ product.icon }}</div>
                                </div>

                                <!-- Note et avis -->
                                <div class="flex items-center space-x-4 mb-6">
                                    <div class="flex items-center space-x-1">
                                        <span v-for="n in 5" :key="n" class="text-amber-500 text-xl">⭐</span>
                                        <span class="ml-2 font-medium text-forest-green">{{ product.rating }}</span>
                                        <span class="text-nature-gray">({{ product.reviews }} avis)</span>
                                    </div>
                                    <div class="w-1 h-1 rounded-full bg-nature-gray/30"></div>
                                    <div class="text-nature-gray">
                                        {{ product.orders }} commandes ce mois-ci
                                    </div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="mb-8">
                                <h3 class="text-lg font-semibold text-forest-green mb-3">Description</h3>
                                <p class="text-nature-gray leading-relaxed">{{ product.description }}</p>
                            </div>

                            <!-- Caractéristiques -->
                            <div class="mb-8">
                                <h3 class="text-lg font-semibold text-forest-green mb-4">Caractéristiques</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="feature-card">
                                        <div class="text-terracotta mb-2">🌱</div>
                                        <div class="font-medium text-forest-green">Agriculture</div>
                                        <div class="text-sm text-nature-gray">{{ product.isBio ? 'Biologique' :
                                            'Raisonnée' }}</div>
                                    </div>
                                    <div class="feature-card">
                                        <div class="text-terracotta mb-2">📍</div>
                                        <div class="font-medium text-forest-green">Distance</div>
                                        <div class="text-sm text-nature-gray">{{ product.distance }}</div>
                                    </div>
                                    <div class="feature-card">
                                        <div class="text-terracotta mb-2">📅</div>
                                        <div class="font-medium text-forest-green">Récolte</div>
                                        <div class="text-sm text-nature-gray">{{ product.harvestDate }}</div>
                                    </div>
                                    <div class="feature-card">
                                        <div class="text-terracotta mb-2">⚖️</div>
                                        <div class="font-medium text-forest-green">Conditionnement</div>
                                        <div class="text-sm text-nature-gray">{{ product.packaging }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Prix et quantité -->
                            <div class="mb-8">
                                <div class="flex items-center justify-between mb-6">
                                    <div>
                                        <div class="text-3xl font-bold text-forest-green">{{ product.price }}€</div>
                                        <div v-if="product.unit" class="text-nature-gray text-sm">/{{ product.unit }}
                                        </div>
                                    </div>
                                    <div v-if="product.stock > 0"
                                        class="text-green-600 font-medium flex items-center space-x-2">
                                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span>En stock ({{ product.stock }} disponibles)</span>
                                    </div>
                                    <div v-else class="text-terracotta font-medium flex items-center space-x-2">
                                        <span class="w-2 h-2 rounded-full bg-terracotta"></span>
                                        <span>Rupture de stock</span>
                                    </div>
                                </div>

                                <!-- Sélecteur de quantité -->
                                <div class="flex items-center space-x-6 mb-8">
                                    <div class="flex items-center space-x-4">
                                        <span class="text-forest-green font-medium">Quantité :</span>
                                        <div
                                            class="flex items-center border border-forest-green/20 rounded-full overflow-hidden">
                                            <button @click="decreaseQuantity"
                                                class="w-12 h-12 flex items-center justify-center text-forest-green hover:bg-forest-green/5 transition-colors duration-300"
                                                :disabled="quantity <= 1">
                                                <span class="text-xl">-</span>
                                            </button>
                                            <div
                                                class="w-16 h-12 flex items-center justify-center font-bold text-forest-green text-lg">
                                                {{ quantity }}
                                            </div>
                                            <button @click="increaseQuantity"
                                                class="w-12 h-12 flex items-center justify-center text-forest-green hover:bg-forest-green/5 transition-colors duration-300"
                                                :disabled="quantity >= product.stock">
                                                <span class="text-xl">+</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-xl font-bold text-terracotta">
                                        Total : {{ (product.price * quantity).toFixed(2) }}€
                                    </div>
                                </div>

                                <!-- Boutons d'action -->
                                <div class="flex space-x-4">
                                    <button @click="addToCart" :disabled="product.stock === 0" :class="[
                                        'btn-primary flex-1 py-4',
                                        product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    ]">
                                        <span class="flex items-center justify-center space-x-3">
                                            <span>🛒</span>
                                            <span>Ajouter au panier</span>
                                            <span v-if="product.stock > 0"
                                                class="transform transition-transform duration-500 group-hover:translate-x-1">→</span>
                                        </span>
                                    </button>
                                    <button @click="buyNow" :disabled="product.stock === 0" :class="[
                                        'btn-secondary flex-1 py-4',
                                        product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    ]">
                                        <span class="flex items-center justify-center space-x-3">
                                            <span>⚡</span>
                                            <span>Acheter maintenant</span>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <!-- Livraison et garanties -->
                            <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-forest-green/10">
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <div class="text-forest-green text-2xl mb-2">🚚</div>
                                        <div class="font-medium text-forest-green">Livraison gratuite</div>
                                        <div class="text-sm text-nature-gray">dès 40€</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-forest-green text-2xl mb-2">↩️</div>
                                        <div class="font-medium text-forest-green">Retour gratuit</div>
                                        <div class="text-sm text-nature-gray">14 jours</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-forest-green text-2xl mb-2">💎</div>
                                        <div class="font-medium text-forest-green">Qualité garantie</div>
                                        <div class="text-sm text-nature-gray">Produit frais</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section producteur -->
                    <div class="mb-16 animate-slide-up" style="animation-delay: 0.3s">
                        <div class="producer-card">
                            <div class="flex items-center justify-between mb-6">
                                <div>
                                    <h3 class="text-2xl font-serif font-bold text-forest-green mb-2">Votre producteur
                                    </h3>
                                    <p class="text-nature-gray">Rencontrez la personne derrière ce produit exceptionnel
                                    </p>
                                </div>
                                <router-link :to="`/unit/${product.producer.id}`" class="btn-secondary px-6 py-3">
                                    Visiter la ferme →
                                </router-link>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div class="col-span-2">
                                    <div class="flex items-start space-x-6">
                                        <div
                                            class="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                            <img :src="product.producer.image" :alt="product.producer.name"
                                                class="w-full h-full object-cover">
                                        </div>
                                        <div>
                                            <h4 class="text-xl font-bold text-forest-green mb-2">{{
                                                product.producer.name }}</h4>
                                            <p class="text-nature-gray mb-4">{{ product.producer.description }}</p>
                                            <div class="flex flex-wrap gap-2">
                                                <span
                                                    class="px-3 py-1 bg-forest-green/10 text-forest-green rounded-full text-sm">
                                                    👨‍🌾 {{ product.producer.experience }} ans d'expérience
                                                </span>
                                                <span
                                                    class="px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm">
                                                    🌟 {{ product.producer.rating }}/5
                                                </span>
                                                <span
                                                    class="px-3 py-1 bg-forest-green/10 text-forest-green rounded-full text-sm">
                                                    📍 {{ product.producer.location }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                                    <h5 class="font-bold text-forest-green mb-4">Engagements</h5>
                                    <ul class="space-y-3">
                                        <li class="flex items-center space-x-3">
                                            <span class="text-green-500">✓</span>
                                            <span class="text-nature-gray">Agriculture respectueuse</span>
                                        </li>
                                        <li class="flex items-center space-x-3">
                                            <span class="text-green-500">✓</span>
                                            <span class="text-nature-gray">Cueilli à maturité</span>
                                        </li>
                                        <li class="flex items-center space-x-3">
                                            <span class="text-green-500">✓</span>
                                            <span class="text-nature-gray">Emballages écologiques</span>
                                        </li>
                                        <li class="flex items-center space-x-3">
                                            <span class="text-green-500">✓</span>
                                            <span class="text-nature-gray">Circuit court</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Avis clients -->
                    <div class="mb-16 animate-slide-up" style="animation-delay: 0.4s">
                        <div class="flex justify-between items-center mb-8">
                            <div>
                                <h3 class="text-2xl font-serif font-bold text-forest-green mb-2">Avis clients</h3>
                                <p class="text-nature-gray">Ce que pensent les consommateurs de ce produit</p>
                            </div>
                            <button class="btn-secondary px-6 py-3" @click="showReviewModal = true">
                                <span class="flex items-center space-x-2">
                                    <span>✍️</span>
                                    <span>Donner mon avis</span>
                                </span>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div v-for="(review, index) in product.reviewsList" :key="review.id"
                                class="review-card animate-slide-up" :style="`animation-delay: ${0.5 + index * 0.1}s`">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-10 h-10 rounded-full bg-gradient-to-br from-forest-green/20 to-terracotta/20 flex items-center justify-center">
                                            <span class="text-forest-green">{{ review.avatar }}</span>
                                        </div>
                                        <div>
                                            <div class="font-medium text-forest-green">{{ review.author }}</div>
                                            <div class="text-sm text-nature-gray">{{ review.date }}</div>
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <span v-for="n in review.rating" :key="n" class="text-amber-500">⭐</span>
                                    </div>
                                </div>
                                <p class="text-nature-gray">{{ review.comment }}</p>
                                <div v-if="review.verified" class="mt-4 flex items-center space-x-2">
                                    <span class="text-green-500 text-sm">✓</span>
                                    <span class="text-sm text-nature-gray">Achat vérifié</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Produits similaires -->
                    <div class="animate-slide-up" style="animation-delay: 0.5s">
                        <h3 class="text-2xl font-serif font-bold text-forest-green mb-8">Vous aimerez aussi</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <router-link v-for="related in relatedProducts" :key="related.id"
                                :to="`/product/${related.id}`" class="related-product-card group">
                                <div class="relative h-48 overflow-hidden rounded-2xl mb-4">
                                    <img :src="related.image" :alt="related.name"
                                        class="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                                        style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)" />
                                    <div class="absolute top-3 right-3">
                                        <div v-if="related.isBio"
                                            class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">
                                            🌿
                                        </div>
                                    </div>
                                </div>
                                <h4
                                    class="font-medium text-forest-green group-hover:text-terracotta transition-colors duration-300 mb-2">
                                    {{ related.name }}</h4>
                                <p class="text-sm text-nature-gray mb-2">{{ related.producer }}</p>
                                <div class="flex justify-between items-center">
                                    <span class="font-bold text-forest-green">{{ related.price }}€</span>
                                    <span class="text-xs px-2 py-1 bg-forest-green/10 text-forest-green rounded-full">{{
                                        related.unit }}</span>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Modal d'avis -->
            <transition name="modal">
                <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showReviewModal = false"></div>
                    <div
                        class="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-modal">
                        <h3 class="text-2xl font-serif font-bold text-forest-green mb-6">Donner votre avis</h3>
                        <!-- Formulaire d'avis -->
                        <form @submit.prevent="submitReview">
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-forest-green font-medium mb-2">Note</label>
                                    <div class="flex space-x-2">
                                        <button v-for="n in 5" :key="n" type="button" @click="newReview.rating = n"
                                            class="text-3xl transition-all duration-300 hover:scale-125"
                                            :class="n <= newReview.rating ? 'text-amber-500' : 'text-gray-300'">
                                            ⭐
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-forest-green font-medium mb-2">Commentaire</label>
                                    <textarea v-model="newReview.comment" rows="4"
                                        class="w-full px-4 py-3 bg-white/80 border border-forest-green/20 rounded-2xl focus:outline-none focus:border-forest-green/40 focus:ring-4 focus:ring-forest-green/10 transition-all duration-300"
                                        placeholder="Partagez votre expérience avec ce produit..."></textarea>
                                </div>
                                <div class="flex space-x-4">
                                    <button type="button" @click="showReviewModal = false" class="btn-secondary flex-1">
                                        Annuler
                                    </button>
                                    <button type="submit" class="btn-primary flex-1">
                                        Publier l'avis
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductViews',
    data() {
        return {
            quantity: 1,
            selectedImage: null,
            cartCount: 3,
            showReviewModal: false,
            newReview: {
                rating: 5,
                comment: ''
            },
            fruitPattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34,139,34,0.05)" stroke-width="0.5"/>
        <path d="M30,50 Q50,30 70,50 Q50,70 30,50" fill="none" stroke="rgba(226,114,91,0.05)" stroke-width="0.3"/>
      </svg>`,
            veggiePattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" rx="35" ry="45" fill="none" stroke="rgba(34,139,34,0.03)" stroke-width="0.5"/>
        <path d="M50,10 L50,90 M20,50 L80,50" stroke="rgba(226,114,91,0.03)" stroke-width="0.3"/>
      </svg>`,
            leafPattern: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,20 C70,20 85,35 85,55 C85,75 65,85 50,95 C35,85 15,75 15,55 C15,35 30,20 50,20" 
              fill="none" stroke="rgba(34,139,34,0.04)" stroke-width="0.4"/>
      </svg>`,
            product: {
                id: 1,
                name: 'Tomates Anciennes Coeur de Boeuf',
                description: 'Tomates anciennes cultivées en plein champ, récoltées à maturité pour une saveur intense et sucrée. Variété cœur de bœuf, charnue et peu granuleuse, idéale pour les salades et coulis.',
                price: 4.90,
                unit: 'kg',
                icon: '🍅',
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800',
                isBio: true,
                isLocal: true,
                isSeasonal: true,
                rating: 4.7,
                reviews: 124,
                orders: 342,
                stock: 45,
                distance: 'à 15km',
                harvestDate: 'Récolté hier',
                packaging: 'Cagette en bois 1kg',
                thumbnails: [
                    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400',
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400',
                    'https://images.unsplash.com/photo-1563416541-4c0117177142?auto=format&fit=crop&w=400'
                ],
                producer: {
                    id: 1,
                    name: 'Ferme du Bois Joli',
                    description: 'Cultivateur passionné depuis 3 générations, spécialisé dans les légumes de saison bio.',
                    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129fc?auto=format&fit=crop&w=400',
                    experience: 25,
                    rating: 4.8,
                    location: 'Saint-Rémy (15km)'
                },
                reviewsList: [
                    {
                        id: 1,
                        author: 'Marie L.',
                        avatar: '👩',
                        date: 'Il y a 2 jours',
                        rating: 5,
                        comment: 'Tomates délicieuses, très parfumées. Le goût est incomparable avec les tomates de supermarché !',
                        verified: true
                    },
                    {
                        id: 2,
                        author: 'Pierre D.',
                        avatar: '👨',
                        date: 'Il y a 1 semaine',
                        rating: 4,
                        comment: 'Excellent produit, très frais. La livraison a été rapide et l\'emballage éco-responsable.',
                        verified: true
                    },
                    {
                        id: 3,
                        author: 'Sophie M.',
                        avatar: '👩‍🍳',
                        date: 'Il y a 3 semaines',
                        rating: 5,
                        comment: 'Parfait pour mes sauces tomates maison. La chair est dense et peu aquatique.',
                        verified: true
                    }
                ]
            },
            relatedProducts: [
                {
                    id: 2,
                    name: 'Courgettes Bio',
                    price: 3.20,
                    unit: 'kg',
                    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400',
                    producer: 'Ferme du Bois Joli',
                    isBio: true
                },
                {
                    id: 3,
                    name: 'Aubergines Violette',
                    price: 4.10,
                    unit: 'kg',
                    image: 'https://images.unsplash.com/photo-1551845543-2f7c2a4a2cc5?auto=format&fit=crop&w=400',
                    producer: 'Ferme du Bois Joli',
                    isBio: false
                },
                {
                    id: 4,
                    name: 'Poivrons Tricolores',
                    price: 5.40,
                    unit: 'kg',
                    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400',
                    producer: 'Ferme du Bois Joli',
                    isBio: true
                },
                {
                    id: 5,
                    name: 'Concombres',
                    price: 2.80,
                    unit: 'pièce',
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400',
                    producer: 'Ferme du Bois Joli',
                    isBio: true
                }
            ]
        }
    },
    mounted() {
        this.selectedImage = this.product.image
    },
    methods: {
        increaseQuantity() {
            if (this.quantity < this.product.stock) {
                this.quantity++
            }
        },
        decreaseQuantity() {
            if (this.quantity > 1) {
                this.quantity--
            }
        },
        addToCart() {
            if (this.product.stock === 0) return

            this.cartCount++
            // Animation de confirmation
            const btn = event.target.closest('button')
            btn.classList.add('animate-pulse')
            setTimeout(() => btn.classList.remove('animate-pulse'), 500)

            // Notification visuelle
            this.$toast?.success(`${this.quantity} ${this.product.name} ajouté au panier`)
        },
        buyNow() {
            if (this.product.stock === 0) return
            this.addToCart()
            this.$router.push('/cart')
        },
        submitReview() {
            if (this.newReview.comment.trim()) {
                const newReview = {
                    id: Date.now(),
                    author: 'Vous',
                    avatar: '⭐',
                    date: 'À l\'instant',
                    rating: this.newReview.rating,
                    comment: this.newReview.comment,
                    verified: false
                }
                this.product.reviewsList.unshift(newReview)
                this.product.reviews++
                this.showReviewModal = false
                this.newReview = { rating: 5, comment: '' }

                this.$toast?.success('Merci pour votre avis !')
            }
        }
    }
}
</script>

<style scoped>
/* Animation de page */
.page-enter-active,
.page-leave-active {
    transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateX(20px);
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

/* Animation de modal */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-modal {
    animation: modalAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animations de particules */
.particle {
    position: absolute;
    background: rgba(34, 139, 34, 0.1);
    border-radius: 50%;
    animation: floatParticle 20s infinite linear;
}

.particle-1 {
    width: 60px;
    height: 60px;
    top: 10%;
    left: 5%;
    animation-duration: 25s;
    background: radial-gradient(circle, rgba(34, 139, 34, 0.05) 0%, transparent 70%);
}

.particle-2 {
    width: 40px;
    height: 40px;
    top: 30%;
    right: 10%;
    animation-duration: 20s;
    animation-delay: 5s;
    background: radial-gradient(circle, rgba(226, 114, 91, 0.04) 0%, transparent 70%);
}

.particle-3 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 15%;
    animation-duration: 30s;
    animation-delay: 10s;
    background: radial-gradient(circle, rgba(34, 139, 34, 0.03) 0%, transparent 70%);
}

.particle-4 {
    width: 50px;
    height: 50px;
    top: 60%;
    left: 80%;
    animation-duration: 22s;
    animation-delay: 3s;
}

.particle-5 {
    width: 70px;
    height: 70px;
    bottom: 10%;
    right: 20%;
    animation-duration: 28s;
    animation-delay: 7s;
}

@keyframes floatParticle {
    0% {
        transform: translateY(0) rotate(0deg);
    }

    25% {
        transform: translateY(-100px) rotate(90deg);
    }

    50% {
        transform: translateY(0) rotate(180deg);
    }

    75% {
        transform: translateY(100px) rotate(270deg);
    }

    100% {
        transform: translateY(0) rotate(360deg);
    }
}

/* Badges flottants */
.floating {
    animation: floatBadge 3s ease-in-out infinite;
}

@keyframes floatBadge {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

/* Composants stylisés */
.bio-badge {
    @apply px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm;
}

.local-badge {
    @apply px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm;
}

.season-badge {
    @apply px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm;
}

.feature-card {
    @apply bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-forest-green/10 transition-all duration-500 hover:scale-105 hover:shadow-lg;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.producer-card {
    @apply bg-gradient-to-br from-white/70 to-cream-light/30 backdrop-blur-sm rounded-3xl p-8 border border-forest-green/10 shadow-xl;
}

.review-card {
    @apply bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-forest-green/10 transition-all duration-500 hover:scale-105 hover:shadow-lg;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.related-product-card {
    @apply bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-forest-green/10 transition-all duration-500 hover:scale-105 hover:shadow-xl;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Boutons avec courbes de bézier personnalisées */
.btn-primary {
    @apply bg-gradient-to-r from-forest-green to-emerald-600 text-white font-semibold rounded-full shadow-lg transition-all duration-500 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-secondary {
    @apply bg-gradient-to-r from-terracotta/10 to-terracotta/5 text-terracotta font-semibold rounded-full border border-terracotta/20 transition-all duration-500 hover:border-terracotta/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Effets de survol spéciaux */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Utilitaires */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(34, 139, 34, 0.05);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: rgba(34, 139, 34, 0.2);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 139, 34, 0.3);
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

/* Animation globale pour les badges */
@keyframes gentlePulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.9;
    }
}

.animate-gentle-pulse {
    animation: gentlePulse 2s ease-in-out infinite;
}
</style>