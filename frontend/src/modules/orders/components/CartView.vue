<template>
  <div class="cart-view min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50">
    <!-- Texture filigrane en arrière-plan -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+CjxkZWZzPgo8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHBhdGggZD0iTTIwIDBMMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE2YTM0MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+Cjwvc3ZnPgo=')]"></div>
      </div>
      
      <!-- Éléments flottants organiques -->
      <div class="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 opacity-10 animate-float-slow"></div>
      <div class="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 opacity-8 animate-float-medium"></div>
      <div class="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 opacity-6 animate-float-fast"></div>
    </div>

    <div class="container relative mx-auto px-4 py-12 max-w-7xl z-10">
      <!-- Header avec animation d'entrée -->
      <div class="mb-12 animate-fade-in-down">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-emerald-700 to-amber-800">
              Mon Panier
            </h1>
            <p class="text-lg text-gray-600 mt-2">
              Vos produits frais vous attendent
            </p>
          </div>
          
          <!-- Indicateur d'articles -->
          <div class="hidden md:block">
            <div class="relative">
              <div class="absolute -inset-2 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full blur opacity-30"></div>
              <div class="relative bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200">
                <div class="flex items-center space-x-3">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-800">{{ cartStats.totalItems }}</div>
                    <div class="text-xs text-gray-600">Articles</div>
                  </div>
                  <div class="h-8 w-px bg-gray-300"></div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-800">{{ cartStats.uniqueProducts }}</div>
                    <div class="text-xs text-gray-600">Produits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Barre de progression -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Votre panier est presque complet !</span>
            <span class="text-sm font-medium text-green-700">{{ cartStats.totalItems }}/20 articles</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out-expo"
              :style="{ width: `${Math.min((cartStats.totalItems / 20) * 100, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="relative">
            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 animate-pulse mx-auto"></div>
            <div class="mt-4 text-gray-600 font-medium">Chargement de votre panier...</div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-fade-in-up">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button 
            @click="fetchCart"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 ease-out-expo"
          >
            Réessayer
          </button>
        </div>
      </div>

      <div v-else-if="!cart || cartItems.length === 0" class="text-center py-16 animate-fade-in-up">
        <!-- Illustration panier vide -->
        <div class="relative inline-block mb-8">
          <div class="absolute -inset-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-xl opacity-50"></div>
          <div class="relative w-48 h-48 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center border-4 border-white shadow-xl">
            <svg class="w-32 h-32 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Votre panier est vide</h2>
        <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Ajoutez des produits frais de nos producteurs locaux pour commencer
        </p>
        <div class="space-x-4">
          <router-link 
            to="/catalog"
            class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Découvrir les produits
          </router-link>
          <router-link 
            to="/"
            class="inline-flex items-center px-8 py-3 bg-white/80 backdrop-blur-sm border-2 border-green-600 text-green-700 rounded-xl font-semibold hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l'accueil
          </router-link>
        </div>
      </div>

      <div v-else class="animate-fade-in-up">
        <!-- Layout principal avec split screen effect -->
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <!-- Section articles (2/3) -->
          <div class="lg:col-span-2">
            <!-- Liste des articles -->
            <div class="space-y-6">
              <transition-group name="list" tag="div">
                <div 
                  v-for="(item, index) in cartItems" 
                  :key="item.id"
                  class="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-green-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <div class="p-6">
                    <div class="flex flex-col md:flex-row md:items-center gap-6">
                      <!-- Image produit -->
                      <div class="relative flex-shrink-0">
                        <div class="absolute -inset-2 bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div class="relative w-32 h-32 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden border-2 border-white shadow-md">
                          <img 
                            v-if="item.product?.images?.[0]" 
                            :src="item.product.images[0]" 
                            :alt="item.product.name"
                            class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div v-else class="w-full h-full flex items-center justify-center">
                            <svg class="w-16 h-16 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <!-- Détails produit -->
                      <div class="flex-grow">
                        <div class="flex justify-between items-start">
                          <div>
                            <h3 class="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                              {{ item.product?.name || 'Produit' }}
                            </h3>
                            <p v-if="item.variant" class="text-sm text-gray-600 mt-1">
                              Variante: {{ item.variant.name }}
                            </p>
                            <div class="flex items-center mt-2 space-x-3">
                              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Local
                              </span>
                              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Frais du jour
                              </span>
                            </div>
                          </div>
                          
                          <!-- Prix unitaire -->
                          <div class="text-right">
                            <div class="text-2xl font-bold text-green-800">
                              {{ formatAmount(item.unitPrice) }}
                            </div>
                            <div class="text-sm text-gray-500">/ unité</div>
                          </div>
                        </div>

                        <!-- Contrôles quantité et actions -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-6 border-t border-gray-100">
                          <!-- Contrôle quantité -->
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center bg-green-50 rounded-xl p-1">
                              <button 
                                @click="updateQuantity(item.id, item.quantity - 1)"
                                :disabled="item.quantity <= 1"
                                class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out-expo"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <div class="relative">
                                <input 
                                  type="number" 
                                  v-model.number="item.quantity"
                                  @change="debouncedUpdateQuantity(item.id, item.quantity)"
                                  min="1" 
                                  max="99"
                                  class="w-16 text-center bg-transparent text-lg font-semibold text-gray-800 focus:outline-none"
                                />
                                <div class="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                              </div>
                              
                              <button 
                                @click="updateQuantity(item.id, item.quantity + 1)"
                                class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-green-700 transition-all duration-300 ease-out-expo"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            
                            <div class="text-sm text-gray-600">
                              {{ item.quantity }} × {{ formatAmount(item.unitPrice) }}
                            </div>
                          </div>

                          <!-- Sous-total et actions -->
                          <div class="flex items-center space-x-6 mt-4 sm:mt-0">
                            <div class="text-right">
                              <div class="text-sm text-gray-500">Sous-total</div>
                              <div class="text-2xl font-bold text-green-800">
                                {{ formatAmount(item.subtotal) }}
                              </div>
                            </div>
                            
                            <!-- Bouton suppression -->
                            <button 
                              @click="removeItem(item.id)"
                              class="relative group p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                              title="Retirer du panier"
                            >
                              <div class="absolute inset-0 bg-gradient-to-r from-red-200 to-red-300 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                              <svg class="relative w-6 h-6 text-red-500 group-hover:text-red-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Ligne de progression de fraîcheur -->
                  <div class="px-6 pb-6">
                    <div class="flex items-center justify-between text-sm mb-2">
                      <span class="text-gray-600">Fraîcheur garantie</span>
                      <span class="font-medium text-green-700">Livraison sous 24h</span>
                    </div>
                    <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-amber-400 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>

            <!-- Actions panier -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                @click="continueShopping"
                class="flex-1 flex items-center justify-center px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-green-600 text-green-700 rounded-xl font-semibold hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Continuer mes achats
              </button>
              
              <button 
                @click="clearCart"
                class="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Vider le panier
              </button>
            </div>
          </div>

          <!-- Section récapitulatif (1/3) -->
          <div class="lg:col-span-1 mt-8 lg:mt-0">
            <div class="sticky top-6">
              <!-- Carte récapitulative -->
              <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                <!-- Header carte -->
                <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                  <div class="flex items-center justify-between text-white">
                    <h2 class="text-2xl font-bold">Récapitulatif</h2>
                    <div class="relative">
                      <div class="absolute -inset-1 bg-white/20 rounded-full blur"></div>
                      <div class="relative bg-white/10 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="text-green-100 mt-2">Commande sécurisée et sans engagement</p>
                </div>

                <!-- Corps carte -->
                <div class="p-6">
                  <!-- Détails des prix -->
                  <div class="space-y-4">
                    <div class="flex justify-between items-center py-2">
                      <span class="text-gray-600">Sous-total</span>
                      <span class="text-lg font-semibold text-gray-800">{{ formatAmount(cart.subtotal) }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2">
                      <span class="text-gray-600">Frais de livraison</span>
                      <span class="text-lg font-semibold text-green-700">{{ formatAmount(cart.deliveryFee) }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2">
                      <span class="text-gray-600">Taxes</span>
                      <span class="text-lg font-semibold text-gray-800">{{ formatAmount(cart.taxAmount) }}</span>
                    </div>
                    
                    <div v-if="cart.discountAmount > 0" class="flex justify-between items-center py-2">
                      <span class="text-gray-600">Réduction</span>
                      <span class="text-lg font-semibold text-green-700">-{{ formatAmount(cart.discountAmount) }}</span>
                    </div>
                    
                    <!-- Séparateur -->
                    <div class="relative py-4">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                      </div>
                      <div class="relative flex justify-center">
                        <span class="px-4 bg-white text-sm text-gray-500">Total</span>
                      </div>
                    </div>
                    
                    <!-- Total -->
                    <div class="flex justify-between items-center py-4">
                      <span class="text-xl font-bold text-gray-800">Total</span>
                      <div class="text-right">
                        <div class="text-3xl font-bold text-green-800">{{ formatAmount(cart.totalAmount) }}</div>
                        <div class="text-sm text-gray-500">TVA incluse</div>
                      </div>
                    </div>
                  </div>

                  <!-- Badge avantages -->
                  <div class="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 class="font-semibold text-green-800">Livraison gratuite</h4>
                        <p class="text-sm text-gray-600">À partir de 25 000 XAF d'achat</p>
                      </div>
                    </div>
                  </div>

                  <!-- Bouton checkout -->
                  <div class="mt-8">
                    <router-link 
                      to="/checkout"
                      class="block w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center rounded-xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
                    >
                      <div class="flex items-center justify-center">
                        <span>Finaliser la commande</span>
                        <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </router-link>
                  </div>

                  <!-- Sécurité et confiance -->
                  <div class="mt-6 pt-6 border-t border-gray-200">
                    <div class="flex items-center justify-center space-x-6 text-gray-500">
                      <div class="text-center">
                        <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <div class="text-xs">Paiement sécurisé</div>
                      </div>
                      <div class="text-center">
                        <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="text-xs">Garantie satisfaction</div>
                      </div>
                      <div class="text-center">
                        <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                        </svg>
                        <div class="text-xs">Produits frais</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Suggestions de produits -->
              <div v-if="suggestedProducts.length > 0" class="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Complétez votre panier</h3>
                <div class="space-y-4">
                  <div 
                    v-for="product in suggestedProducts" 
                    :key="product.id"
                    class="group flex items-center p-3 rounded-xl hover:bg-green-50 cursor-pointer transition-all duration-300 ease-out-expo"
                    @click="addSuggestedProduct(product)"
                  >
                    <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center border border-green-200">
                      <img 
                        v-if="product.image" 
                        :src="product.image" 
                        :alt="product.name"
                        class="w-12 h-12 object-cover rounded"
                      />
                      <svg v-else class="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div class="ml-4 flex-grow">
                      <h4 class="font-medium text-gray-800 group-hover:text-green-700 transition-colors duration-300">{{ product.name }}</h4>
                      <div class="flex items-center mt-1">
                        <span class="text-green-700 font-semibold">{{ formatAmount(product.price) }}</span>
                        <span class="text-xs text-gray-500 ml-2">/ {{ product.unit }}</span>
                      </div>
                    </div>
                    <button class="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-300">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification toast -->
    <transition name="slide-up">
      <div v-if="showNotification" class="fixed bottom-6 right-6 z-50">
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-2xl p-4 min-w-[300px] animate-fade-in-up">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="font-medium">{{ notificationMessage }}</p>
            </div>
            <button @click="showNotification = false" class="ml-auto text-white/80 hover:text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '../stores/orders.store'
import { formatAmount } from '../utils/orders.helpers'
import debounce from 'lodash/debounce'

const router = useRouter()
const ordersStore = useOrdersStore()

// Accès aux données du store
const cart = computed(() => ordersStore.cart)
const cartItems = computed(() => ordersStore.cartItems)
const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)
const cartStats = computed(() => ordersStore.cartStats)

// État local
const showNotification = ref(false)
const notificationMessage = ref('')

// Produits suggérés
const suggestedProducts = ref([
  { id: 1, name: 'Tomates Bio', price: 1500, unit: 'kg', image: '' },
  { id: 2, name: 'Oignons frais', price: 800, unit: 'kg', image: '' },
  { id: 3, name: 'Persil', price: 300, unit: 'botte', image: '' }
])

// Mounted hook
onMounted(() => {
  fetchCart()
})

// Fonctions
const fetchCart = async () => {
  try {
    await ordersStore.fetchCart()
  } catch (err) {
    console.error('Error fetching cart:', err)
  }
}

const updateQuantity = async (itemId: string | number, quantity: number) => {
  if (quantity < 1) return
  
  try {
    await ordersStore.updateCartItem(itemId, quantity)
    showNotification.value = true
    notificationMessage.value = 'Quantité mise à jour'
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  } catch (err) {
    console.error('Error updating quantity:', err)
    notificationMessage.value = 'Erreur lors de la mise à jour'
  }
}

// Debounced version pour éviter trop d'appels API
const debouncedUpdateQuantity = debounce(updateQuantity, 500)

const removeItem = async (itemId: string | number) => {
  try {
    await ordersStore.removeCartItem(itemId)
    showNotification.value = true
    notificationMessage.value = 'Article retiré du panier'
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  } catch (err) {
    console.error('Error removing item:', err)
  }
}

const clearCart = async () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    try {
      await ordersStore.clearCart()
      showNotification.value = true
      notificationMessage.value = 'Panier vidé'
      setTimeout(() => {
        showNotification.value = false
      }, 3000)
    } catch (err) {
      console.error('Error clearing cart:', err)
    }
  }
}

const continueShopping = () => {
  router.push('/catalog')
}

const addSuggestedProduct = async (product: any) => {
  try {
    await ordersStore.addToCart({
      productId: product.id,
      quantity: 1
    })
    showNotification.value = true
    notificationMessage.value = `${product.name} ajouté au panier`
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  } catch (err) {
    console.error('Error adding product:', err)
  }
}
</script>

<style scoped>
/* Animations personnalisées */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatSlow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes floatMedium {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(90deg);
  }
}

@keyframes floatFast {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(45deg);
  }
}

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

.animate-fade-in-down {
  animation: fadeInDown 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

.animate-float-slow {
  animation: floatSlow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: floatMedium 6s ease-in-out infinite;
}

.animate-float-fast {
  animation: floatFast 4s ease-in-out infinite;
}

/* Courbe de bézier personnalisée pour fluidité organique */
.ease-out-expo {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

/* Transitions pour la liste */
.list-enter-active,
.list-leave-active {
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.list-move {
  transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

/* Transition pour le toast */
.slide-up-enter-active {
  animation: slideUp 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.slide-up-leave-active {
  animation: slideUp 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(34, 197, 94, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #10b981, #059669);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #059669, #047857);
}

/* Optimisation des performances */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
