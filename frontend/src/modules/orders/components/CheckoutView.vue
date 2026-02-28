<template>
  <div class="checkout-view min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-amber-50">
    <!-- Texture filigrane en arrière-plan -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yMCAyMEg4MFY4MEgyMFYyMFoiIHN0cm9rZT0iIzE2YTM0MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiIvPgo8cGF0aCBkPSJNNTAgMjBMODAgNTBWNzBINzBMMzAgMzBWMjBINTBaIiBzdHJva2U9IiMxNmEzNDEiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtZGFzaGFycmF5PSIyIDIiLz4KPHBhdGggZD0iTTIwIDUwTDUwIDIwVjgwSDIwVjUwWiIgc3Ryb2tlPSIjMTZhMzQxIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIi8+Cjwvc3ZnPgo=')]"></div>
      </div>
      
      <!-- Éléments flottants organiques -->
      <div class="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 opacity-10 animate-float-slow"></div>
      <div class="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 opacity-8 animate-float-medium"></div>
      <div class="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 opacity-6 animate-float-fast"></div>
    </div>

    <div class="container relative mx-auto px-4 py-8 max-w-7xl z-10">
      <!-- Header avec breadcrumb animé -->
      <div class="mb-8 animate-fade-in-down">
        <nav class="flex items-center space-x-2 text-sm mb-6">
          <router-link 
            to="/catalog" 
            class="text-green-700 hover:text-green-800 transition-colors duration-300"
          >
            Catalogue
          </router-link>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <router-link 
            to="/cart" 
            class="text-green-700 hover:text-green-800 transition-colors duration-300"
          >
            Panier
          </router-link>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-green-900 font-semibold">Finalisation</span>
        </nav>

        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-emerald-700 to-amber-800">
              Finaliser votre commande
            </h1>
            <p class="text-lg text-gray-600 mt-2">
              Une dernière étape avant de recevoir vos produits frais
            </p>
          </div>
          
          <!-- Indicateur de progression -->
          <div class="mt-4 md:mt-0">
            <div class="relative">
              <div class="absolute -inset-2 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full blur opacity-30"></div>
              <div class="relative bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200">
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <div class="text-xl font-bold text-green-800">{{ cartStats.totalItems }}</div>
                    <div class="text-xs text-gray-600">Articles</div>
                  </div>
                  <div class="h-8 w-px bg-gray-300"></div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-green-800">{{ formatAmount(cartTotal) }}</div>
                    <div class="text-xs text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="relative inline-block">
            <div class="absolute -inset-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur animate-pulse"></div>
            <div class="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-gray-600 font-medium">Préparation de votre commande...</div>
        </div>
      </div>

      <!-- État d'erreur -->
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

      <!-- Panier vide -->
      <div v-else-if="!cart || cartItems.length === 0" class="text-center py-16 animate-fade-in-up">
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
          Ajoutez des produits frais avant de finaliser votre commande
        </p>
        <router-link 
          to="/catalog"
          class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
        >
          Découvrir les produits
        </router-link>
      </div>

      <!-- Formulaire de checkout -->
      <div v-else class="animate-fade-in-up">
        <!-- Étapes de commande -->
        <div class="mb-12">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-800">Étapes de commande</h2>
            <div class="mt-2 md:mt-0 text-sm text-gray-600">
              Étape {{ currentStep }} sur 3
            </div>
          </div>
          
          <!-- Barre de progression -->
          <div class="relative">
            <!-- Ligne de progression -->
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out-expo"
                :style="{ width: `${(currentStep / 3) * 100}%` }"
              ></div>
            </div>
            
            <!-- Points d'étape -->
            <div class="flex justify-between mt-2">
              <div 
                v-for="(step, index) in steps" 
                :key="index"
                class="flex flex-col items-center"
              >
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-out-expo"
                  :class="[
                    index + 1 <= currentStep 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <span 
                  class="mt-2 text-sm font-medium transition-colors duration-300"
                  :class="index + 1 <= currentStep ? 'text-green-700' : 'text-gray-500'"
                >
                  {{ step }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Layout split screen -->
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <!-- Section formulaire (2/3) -->
          <div class="lg:col-span-2">
            <!-- Formulaire avec onglets -->
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 overflow-hidden">
              <!-- Onglets -->
              <div class="border-b border-gray-200">
                <nav class="flex">
                  <button 
                    v-for="(tab, index) in tabs" 
                    :key="index"
                    @click="currentStep = index + 1"
                    class="flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ease-out-expo"
                    :class="[
                      currentStep === index + 1
                        ? 'text-green-700 border-b-2 border-green-500 bg-green-50/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    ]"
                  >
                    <div class="flex items-center justify-center">
                      <component 
                        :is="tab.icon" 
                        class="w-5 h-5 mr-2"
                        :class="currentStep === index + 1 ? 'text-green-600' : 'text-gray-400'"
                      />
                      {{ tab.label }}
                    </div>
                  </button>
                </nav>
              </div>

              <!-- Contenu des onglets -->
              <div class="p-6 md:p-8">
                <!-- Étape 1 : Adresse -->
                <div v-if="currentStep === 1" class="animate-fade-in-up">
                  <h3 class="text-xl font-bold text-gray-800 mb-6">Livraison ou retrait</h3>
                  
                  <!-- Sélection type de livraison -->
                  <div class="mb-8">
                    <label class="block text-sm font-medium text-gray-700 mb-4">
                      Comment souhaitez-vous recevoir votre commande ?
                    </label>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div 
                        v-for="option in deliveryOptions" 
                        :key="option.value"
                        @click="selectDeliveryType(option.value)"
                        class="group relative cursor-pointer"
                      >
                        <div 
                          class="relative rounded-xl p-6 border-2 transition-all duration-300 ease-out-expo"
                          :class="[
                            form.deliveryType === option.value
                              ? 'border-green-500 bg-green-50/50'
                              : 'border-gray-300 hover:border-green-300 hover:bg-gray-50/50'
                          ]"
                        >
                          <div class="absolute top-4 right-4">
                            <div 
                              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                              :class="[
                                form.deliveryType === option.value
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 group-hover:border-green-300'
                              ]"
                            >
                              <svg 
                                v-if="form.deliveryType === option.value" 
                                class="w-3 h-3 text-white" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          <div class="flex items-start">
                            <div 
                              class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                              :class="[
                                form.deliveryType === option.value
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-500 group-hover:text-green-500'
                              ]"
                            >
                              <component :is="option.icon" class="w-6 h-6" />
                            </div>
                            <div>
                              <h4 class="font-semibold text-gray-800">{{ option.label }}</h4>
                              <p class="text-sm text-gray-600 mt-1">{{ option.description }}</p>
                              <div class="mt-2">
                                <span class="text-sm font-medium text-green-700">{{ option.price }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Adresse de livraison (si livraison sélectionnée) -->
                  <div v-if="form.deliveryType === 'delivery'" class="mb-8">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">Adresse de livraison</h4>
                    
                    <!-- Adresses existantes -->
                    <div v-if="addresses.length > 0" class="mb-6">
                      <label class="block text-sm font-medium text-gray-700 mb-3">
                        Sélectionnez une adresse
                      </label>
                      <div class="space-y-3">
                        <div 
                          v-for="address in addresses" 
                          :key="address.id"
                          @click="selectAddress(address)"
                          class="group relative cursor-pointer"
                        >
                          <div 
                            class="relative rounded-xl p-4 border-2 transition-all duration-300 ease-out-expo"
                            :class="[
                              form.deliveryAddressId === address.id
                                ? 'border-green-500 bg-green-50/50'
                                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50/50'
                            ]"
                          >
                            <div class="absolute top-4 right-4">
                              <div 
                                class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                :class="[
                                  form.deliveryAddressId === address.id
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300 group-hover:border-green-300'
                                ]"
                              >
                                <svg 
                                  v-if="form.deliveryAddressId === address.id" 
                                  class="w-2.5 h-2.5 text-white" 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            
                            <div class="flex items-start">
                              <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <div>
                                <div class="font-medium text-gray-800">
                                  {{ address.firstName }} {{ address.lastName }}
                                </div>
                                <div class="text-sm text-gray-600 mt-1">
                                  {{ address.address }}, {{ address.city }}, {{ address.region }}
                                </div>
                                <div class="text-sm text-gray-600">{{ address.phone }}</div>
                                <div v-if="address.isDefault" class="inline-block mt-2">
                                  <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Adresse par défaut
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Nouvelle adresse -->
                    <div class="mt-6">
                      <button 
                        @click="showNewAddressForm = !showNewAddressForm"
                        class="inline-flex items-center px-4 py-2 bg-white border-2 border-green-500 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-all duration-300 ease-out-expo"
                      >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter une nouvelle adresse
                      </button>
                    </div>
                  </div>

                  <!-- Points de retrait (si retrait sélectionné) -->
                  <div v-if="form.deliveryType === 'pickup'" class="mb-8">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">Point de retrait</h4>
                    
                    <div class="space-y-4">
                      <div 
                        v-for="point in pickupPoints" 
                        :key="point.id"
                        @click="selectPickupPoint(point)"
                        class="group relative cursor-pointer"
                      >
                        <div 
                          class="relative rounded-xl p-6 border-2 transition-all duration-300 ease-out-expo"
                          :class="[
                            form.pickupPointId === point.id
                              ? 'border-green-500 bg-green-50/50'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50/50'
                          ]"
                        >
                          <div class="absolute top-4 right-4">
                            <div 
                              class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                              :class="[
                                form.pickupPointId === point.id
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 group-hover:border-green-300'
                              ]"
                            >
                              <svg 
                                v-if="form.pickupPointId === point.id" 
                                class="w-3 h-3 text-white" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          <div class="flex items-start">
                            <div 
                              class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                              :class="[
                                form.pickupPointId === point.id
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-500 group-hover:text-green-500'
                              ]"
                            >
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div class="flex-grow">
                              <h4 class="font-semibold text-gray-800">{{ point.name }}</h4>
                              <p class="text-sm text-gray-600 mt-1">{{ point.address }}</p>
                              <p class="text-sm text-gray-600">{{ point.city }}, {{ point.region }}</p>
                              <div class="flex items-center mt-2 text-sm text-gray-600">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ point.openingHours }}
                              </div>
                            </div>
                          </div>
                          
                          <!-- Horaires disponibles -->
                          <div v-if="form.pickupPointId === point.id" class="mt-6 pt-6 border-t border-gray-200">
                            <h5 class="font-medium text-gray-700 mb-3">Choisissez un créneau horaire</h5>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div 
                                v-for="slot in pickupSlots" 
                                :key="slot.id"
                                @click="selectPickupSlot(slot)"
                                class="text-center p-3 rounded-lg border transition-all duration-300 ease-out-expo"
                                :class="[
                                  form.pickupSlotId === slot.id
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                                ]"
                              >
                                <div class="font-medium">{{ formatTime(slot.startTime) }}</div>
                                <div class="text-xs text-gray-500">{{ slot.date }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Boutons navigation -->
                  <div class="flex justify-between pt-6 border-t border-gray-200">
                    <router-link 
                      to="/cart"
                      class="inline-flex items-center px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-xl font-medium hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour au panier
                    </router-link>
                    <button 
                      @click="nextStep"
                      :disabled="!canProceedToStep2"
                      class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500 ease-out-expo disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuer
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Étape 2 : Paiement -->
                <div v-if="currentStep === 2" class="animate-fade-in-up">
                  <h3 class="text-xl font-bold text-gray-800 mb-6">Méthode de paiement</h3>
                  
                  <div class="mb-8">
                    <label class="block text-sm font-medium text-gray-700 mb-4">
                      Choisissez votre moyen de paiement
                    </label>
                    <div class="space-y-4">
                      <div 
                        v-for="method in paymentMethods" 
                        :key="method.value"
                        @click="form.paymentMethod = method.value"
                        class="group relative cursor-pointer"
                      >
                        <div 
                          class="relative rounded-xl p-6 border-2 transition-all duration-300 ease-out-expo"
                          :class="[
                            form.paymentMethod === method.value
                              ? 'border-green-500 bg-green-50/50'
                              : 'border-gray-300 hover:border-green-300 hover:bg-gray-50/50'
                          ]"
                        >
                          <div class="absolute top-4 right-4">
                            <div 
                              class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                              :class="[
                                form.paymentMethod === method.value
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 group-hover:border-green-300'
                              ]"
                            >
                              <svg 
                                v-if="form.paymentMethod === method.value" 
                                class="w-3 h-3 text-white" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          <div class="flex items-center">
                            <div 
                              class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                              :class="[
                                form.paymentMethod === method.value
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-500 group-hover:text-green-500'
                              ]"
                            >
                              <component :is="method.icon" class="w-6 h-6" />
                            </div>
                            <div class="flex-grow">
                              <h4 class="font-semibold text-gray-800">{{ method.label }}</h4>
                              <p class="text-sm text-gray-600 mt-1">{{ method.description }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Notes de commande -->
                  <div class="mb-8">
                    <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                      Notes pour le producteur (optionnel)
                    </label>
                    <textarea 
                      id="notes"
                      v-model="form.notes"
                      rows="3"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 ease-out-expo"
                      placeholder="Instructions spéciales, allergies, préférences..."
                    ></textarea>
                  </div>

                  <!-- Boutons navigation -->
                  <div class="flex justify-between pt-6 border-t border-gray-200">
                    <button 
                      @click="prevStep"
                      class="inline-flex items-center px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-xl font-medium hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour
                    </button>
                    <button 
                      @click="nextStep"
                      :disabled="!form.paymentMethod"
                      class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500 ease-out-expo disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuer
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Étape 3 : Confirmation -->
                <div v-if="currentStep === 3" class="animate-fade-in-up">
                  <h3 class="text-xl font-bold text-gray-800 mb-6">Confirmation de commande</h3>
                  
                  <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-bold text-green-800">Vérifiez votre commande</h4>
                        <p class="text-sm text-gray-600">Confirmez les détails avant de valider</p>
                      </div>
                    </div>

                    <!-- Récapitulatif -->
                    <div class="space-y-4">
                      <!-- Livraison -->
                      <div class="flex justify-between items-center py-3 border-b border-green-100">
                        <span class="text-gray-700">Mode de livraison</span>
                        <span class="font-medium text-green-800">
                          {{ form.deliveryType === 'delivery' ? 'Livraison à domicile' : 'Retrait en point de vente' }}
                        </span>
                      </div>
                      
                      <!-- Adresse -->
                      <div v-if="selectedAddress" class="flex justify-between items-start py-3 border-b border-green-100">
                        <span class="text-gray-700">Adresse</span>
                        <div class="text-right">
                          <div class="font-medium text-green-800">{{ selectedAddress.firstName }} {{ selectedAddress.lastName }}</div>
                          <div class="text-sm text-gray-600">{{ selectedAddress.address }}</div>
                          <div class="text-sm text-gray-600">{{ selectedAddress.city }}, {{ selectedAddress.region }}</div>
                        </div>
                      </div>
                      
                      <!-- Point de retrait -->
                      <div v-if="selectedPickupPoint" class="flex justify-between items-start py-3 border-b border-green-100">
                        <span class="text-gray-700">Point de retrait</span>
                        <div class="text-right">
                          <div class="font-medium text-green-800">{{ selectedPickupPoint.name }}</div>
                          <div class="text-sm text-gray-600">{{ selectedPickupPoint.address }}</div>
                          <div class="text-sm text-gray-600">{{ selectedPickupSlot ? formatTime(selectedPickupSlot.startTime) : '' }}</div>
                        </div>
                      </div>
                      
                      <!-- Paiement -->
                      <div class="flex justify-between items-center py-3 border-b border-green-100">
                        <span class="text-gray-700">Moyen de paiement</span>
                        <span class="font-medium text-green-800">
                          {{ selectedPaymentMethod?.label || '' }}
                        </span>
                      </div>
                      
                      <!-- Total -->
                      <div class="flex justify-between items-center py-3">
                        <span class="text-lg font-bold text-gray-800">Total à payer</span>
                        <span class="text-2xl font-bold text-green-800">{{ formatAmount(cartTotal) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Conditions générales -->
                  <div class="mb-8">
                    <label class="flex items-start">
                      <input 
                        type="checkbox" 
                        v-model="acceptTerms"
                        class="mt-1 mr-3 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span class="text-sm text-gray-600">
                        Je certifie avoir pris connaissance et accepté les 
                        <a href="#" class="text-green-700 hover:text-green-800 font-medium">conditions générales de vente</a> 
                        et la 
                        <a href="#" class="text-green-700 hover:text-green-800 font-medium">politique de confidentialité</a>.
                      </span>
                    </label>
                  </div>

                  <!-- Boutons navigation -->
                  <div class="flex justify-between pt-6 border-t border-gray-200">
                    <button 
                      @click="prevStep"
                      class="inline-flex items-center px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-xl font-medium hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour
                    </button>
                    <button 
                      @click="submitOrder"
                      :disabled="!acceptTerms || isSubmitting"
                      class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 ease-out-expo disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="isSubmitting" class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {{ isSubmitting ? 'Traitement...' : 'Confirmer et payer' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations de sécurité -->
            <div class="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
              <div class="flex flex-col md:flex-row md:items-center justify-between">
                <div class="flex items-center mb-4 md:mb-0">
                  <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">Paiement sécurisé</h4>
                    <p class="text-sm text-gray-600">Vos données sont protégées par un cryptage SSL</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <svg class="w-8 h-8 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                    </svg>
                    <div class="text-xs text-gray-600 mt-1">Frais frais</div>
                  </div>
                  <div class="text-center">
                    <svg class="w-8 h-8 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="text-xs text-gray-600 mt-1">Local</div>
                  </div>
                  <div class="text-center">
                    <svg class="w-8 h-8 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div class="text-xs text-gray-600 mt-1">Sécurisé</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Récapitulatif commande (1/3) -->
          <div class="lg:col-span-1 mt-8 lg:mt-0">
            <div class="sticky top-6">
              <!-- Récapitulatif -->
              <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-200 overflow-hidden mb-6">
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
                </div>

                <div class="p-6">
                  <!-- Articles -->
                  <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Vos articles</h3>
                    <div class="space-y-4 max-h-64 overflow-y-auto pr-2">
                      <div 
                        v-for="item in cartItems" 
                        :key="item.id"
                        class="flex items-center p-3 rounded-lg bg-white border border-gray-100"
                      >
                        <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center mr-3">
                          <img 
                            v-if="item.product?.images?.[0]" 
                            :src="item.product.images[0]" 
                            :alt="item.product.name"
                            class="w-10 h-10 object-cover rounded"
                          />
                          <svg v-else class="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div class="flex-grow">
                          <div class="font-medium text-gray-800 text-sm">{{ item.product?.name }}</div>
                          <div class="text-xs text-gray-600">{{ item.quantity }} × {{ formatAmount(item.unitPrice) }}</div>
                        </div>
                        <div class="font-semibold text-green-800">
                          {{ formatAmount(item.subtotal) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Détails prix -->
                  <div class="space-y-3 border-t border-gray-200 pt-6">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Sous-total</span>
                      <span class="font-medium text-gray-800">{{ formatAmount(cart?.subtotal || 0) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Frais de livraison</span>
                      <span class="font-medium text-green-700">{{ formatAmount(cart?.deliveryFee || 0) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Taxes</span>
                      <span class="font-medium text-gray-800">{{ formatAmount(cart?.taxAmount || 0) }}</span>
                    </div>
                    <div v-if="cart?.discountAmount && cart.discountAmount > 0" class="flex justify-between">
                      <span class="text-gray-600">Réduction</span>
                      <span class="font-medium text-green-700">-{{ formatAmount(cart.discountAmount) }}</span>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-300">
                      <div class="flex justify-between items-center">
                        <span class="text-xl font-bold text-gray-800">Total</span>
                        <div class="text-right">
                          <div class="text-2xl font-bold text-green-800">{{ formatAmount(cartTotal) }}</div>
                          <div class="text-sm text-gray-500">TVA incluse</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Assistance -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
                <div class="flex items-center mb-4">
                  <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">Besoin d'aide ?</h4>
                    <p class="text-sm text-gray-600">Notre équipe est disponible</p>
                  </div>
                </div>
                <button class="w-full mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors duration-300">
                  Contactez-nous
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmation -->
    <transition name="modal-fade">
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div class="relative max-w-md w-full">
          <div class="bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
            <!-- Header -->
            <div class="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center">
              <div class="relative inline-block mb-4">
                <div class="absolute -inset-4 bg-white/20 rounded-full blur"></div>
                <div class="relative w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white">Commande confirmée !</h3>
              <p class="text-green-100 mt-2">Votre commande #{{ orderNumber }} a été enregistrée</p>
            </div>
            
            <!-- Body -->
            <div class="p-8">
              <div class="text-center mb-6">
                <div class="text-3xl font-bold text-green-800 mb-2">{{ formatAmount(cartTotal) }}</div>
                <p class="text-gray-600">Montant total de votre commande</p>
              </div>
              
              <div class="space-y-4 mb-8">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Vous recevrez une confirmation par email</span>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Paiement sécurisé et traité</span>
                </div>
              </div>
              
              <div class="flex flex-col space-y-3">
                <button 
                  @click="goToOrders"
                  class="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Voir mes commandes
                </button>
                <button 
                  @click="continueShopping"
                  class="w-full py-3 bg-white border-2 border-green-600 text-green-700 rounded-xl font-medium hover:bg-green-50 transition-all duration-300"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
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
import { useCustomerStore } from '@/modules/user-profiles/customer/stores/useCustomerStore'
import { DeliveryType, type CheckoutRequest } from '../types/orders.types'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import paymentService from '@/modules/payments/services/paymentService'
import { PAYMENT_METHODS, PAYMENT_CURRENCIES } from '@/modules/payments/types/payment.types'
import paymentsApi, { PaymentStatus as ApiPaymentStatus } from '@/modules/payments/services/api/payments.api'

const router = useRouter()
const ordersStore = useOrdersStore()
const customerStore = useCustomerStore()
const authStore = useAuthStore()

// Accès aux données du store
const cart = computed(() => ordersStore.cart)
const cartItems = computed(() => ordersStore.cartItems)
const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)
const cartStats = computed(() => ordersStore.cartStats)

// État local
const currentStep = ref(1)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const orderNumber = ref('')
const showNewAddressForm = ref(false)
const acceptTerms = ref(false)

// Données de formulaire
const form = ref({
  deliveryType: 'delivery',
  deliveryAddressId: null as string | number | null,
  pickupPointId: null as string | number | null,
  pickupSlotId: null as string | number | null,
  paymentMethod: '',
  notes: ''
})

const steps = ['Livraison', 'Paiement', 'Confirmation']
const addresses = computed(() =>
  customerStore.addresses.map(address => ({
    id: address.id,
    firstName: address.firstName,
    lastName: address.lastName,
    address: address.street,
    city: address.city,
    region: address.region || address.country,
    phone: address.phone,
    isDefault: address.isDefault
  }))
)

const pickupPoints = ref<any[]>([])
const pickupSlots = ref<any[]>([])

const deliveryOptions = [
  {
    value: 'delivery',
    label: 'Livraison à domicile',
    description: 'Recevez vos produits frais chez vous',
    price: '2 000 XAF',
    icon: 'DeliveryIcon'
  },
  {
    value: 'pickup',
    label: 'Retrait en point de vente',
    description: 'Récupérez votre commande chez le producteur',
    price: 'Gratuit',
    icon: 'StoreIcon'
  }
]

const paymentMethods = [
  {
    value: 'mobile_money',
    label: 'Mobile Money',
    description: 'MTN Mobile Money ou Orange Money',
    icon: 'MobileIcon'
  },
  {
    value: 'card',
    label: 'Carte bancaire',
    description: 'Visa, Mastercard, ou carte locale',
    icon: 'CardIcon'
  },
  {
    value: 'cash',
    label: 'Paiement à la livraison',
    description: 'Payer en espèces à la réception',
    icon: 'CashIcon'
  }
]

const tabs = [
  { label: 'Livraison', icon: 'TruckIcon' },
  { label: 'Paiement', icon: 'CreditCardIcon' },
  { label: 'Confirmation', icon: 'CheckIcon' }
]

// Icônes SVG
const DeliveryIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  `
}

const StoreIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  `
}

const MobileIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  `
}

const CardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  `
}

const CashIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
}

const TruckIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  `
}

const CreditCardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  `
}

const CheckIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

// Computed
const cartTotal = computed(() => {
  return cart.value?.totalAmount || 0
})

const canProceedToStep2 = computed(() => {
  if (form.value.deliveryType === 'delivery') {
    return !!form.value.deliveryAddressId
  } else if (form.value.deliveryType === 'pickup') {
    return !!form.value.pickupPointId && !!form.value.pickupSlotId
  }
  return false
})

const selectedAddress = computed(() => {
  return addresses.value.find(addr => String(addr.id) === String(form.value.deliveryAddressId ?? ''))
})

const selectedPickupPoint = computed(() => {
  return pickupPoints.value.find(point => String(point.id) === String(form.value.pickupPointId ?? ''))
})

const selectedPickupSlot = computed(() => {
  return pickupSlots.value.find(slot => String(slot.id) === String(form.value.pickupSlotId ?? ''))
})

const selectedPaymentMethod = computed(() => {
  return paymentMethods.find(method => method.value === form.value.paymentMethod)
})

// Méthodes
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  return `${hours}h${minutes}`
}

const fetchCart = async () => {
  try {
    await ordersStore.fetchCart()
  } catch (err) {
    console.error('Error fetching cart:', err)
  }
}

const fetchCustomerAddresses = async () => {
  try {
    await customerStore.fetchAddresses({ page: 1, limit: 100 })
  } catch (err) {
    console.error('Error fetching customer addresses:', err)
  }
}

const selectDeliveryType = (type: string) => {
  form.value.deliveryType = type
  if (type === 'delivery') {
    form.value.pickupPointId = null
    form.value.pickupSlotId = null
  } else {
    form.value.deliveryAddressId = null
  }
}

const selectAddress = (address: any) => {
  form.value.deliveryAddressId = address.id
}

const selectPickupPoint = (point: any) => {
  form.value.pickupPointId = point.id
  form.value.pickupSlotId = null
}

const selectPickupSlot = (slot: any) => {
  form.value.pickupSlotId = slot.id
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submitOrder = async () => {
  if (!acceptTerms.value) {
    alert('Veuillez accepter les conditions générales')
    return
  }

  if (!form.value.paymentMethod) {
    alert('Veuillez sélectionner un mode de paiement')
    return
  }

  isSubmitting.value = true

  try {
    const payload: CheckoutRequest = {
      deliveryType: form.value.deliveryType as DeliveryType,
      paymentMethod: form.value.paymentMethod,
      notes: form.value.notes || undefined
    }

    if (form.value.deliveryType === DeliveryType.DELIVERY) {
      if (!form.value.deliveryAddressId) {
        throw new Error('Veuillez sélectionner une adresse de livraison')
      }
      payload.deliveryAddressId = form.value.deliveryAddressId
    } else {
      if (!form.value.pickupPointId || !form.value.pickupSlotId) {
        throw new Error('Veuillez sélectionner un point et un créneau de retrait')
      }
      payload.pickupPointId = form.value.pickupPointId
      payload.pickupSlotId = form.value.pickupSlotId
    }

    const createdOrder = await ordersStore.checkout(payload)
    orderNumber.value = createdOrder.orderNumber || String(createdOrder.id)

    // Créer un enregistrement de paiement aligné avec le backend
    try {
      const currentUser: any = authStore.currentUser || {}
      const mapPaymentMethodToEnum = (method: string) => {
        switch (method) {
          case 'mobile_money':
            return PAYMENT_METHODS.MOBILE_MONEY
          case 'card':
            return PAYMENT_METHODS.CREDIT_CARD
          case 'cash':
            return PAYMENT_METHODS.CASH_ON_DELIVERY
          default:
            return PAYMENT_METHODS.CASH_ON_DELIVERY
        }
      }

      const paymentMethodEnum = mapPaymentMethodToEnum(form.value.paymentMethod)

      const payment = await paymentService.createPayment({
        orderId: String(createdOrder.id),
        amount: Number(createdOrder.totalAmount || cartTotal.value),
        currency: PAYMENT_CURRENCIES.XAF,
        method: paymentMethodEnum,
        customerId: String(currentUser.id || ''),
        customerEmail: currentUser.email,
        customerName: `${currentUser.first_name || currentUser.firstName || ''} ${currentUser.last_name || currentUser.lastName || ''}`.trim() || currentUser.email,
        customerPhone: currentUser.phone || currentUser.phone_number,
        items: cartItems.value.map((item: any) => ({
          id: String(item.id),
          name: item.product?.name || 'Produit',
          description: item.product?.sku,
          quantity: Number(item.quantity || 0),
          unitPrice: Number(item.unitPrice || 0),
          totalPrice: Number(item.subtotal || 0),
          productId: String(item.productId)
        })),
        metadata: {
          ui_payment_method: form.value.paymentMethod,
          delivery_type: form.value.deliveryType
        },
        description: `Paiement pour la commande #${createdOrder.orderNumber || createdOrder.id}`
      })

      // Pour les paiements autres que "paiement à la livraison",
      // marquer immédiatement le paiement comme complété côté backend
      if (form.value.paymentMethod !== 'cash' && payment?.id) {
        await paymentsApi.updatePaymentStatus(parseInt(payment.id, 10), ApiPaymentStatus.COMPLETED)
      }
    } catch (paymentError) {
      // Ne pas bloquer la commande si l'enregistrement du paiement échoue,
      // mais logguer l'erreur pour diagnostic
      console.error('Erreur lors de la création du paiement pour la commande:', paymentError)
    }

    showSuccessModal.value = true

  } catch (err: any) {
    console.error('Error submitting order:', err)
    alert(err?.message || 'Une erreur est survenue lors de la commande')
  } finally {
    isSubmitting.value = false
  }
}

const goToOrders = () => {
  showSuccessModal.value = false
  router.push('/orders/my-orders')
}

const continueShopping = () => {
  showSuccessModal.value = false
  router.push('/catalog')
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchCart(),
    fetchCustomerAddresses()
  ])

  const defaultAddress = addresses.value.find(addr => addr.isDefault)
  if (defaultAddress) {
    form.value.deliveryAddressId = defaultAddress.id
  }
})
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

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
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

.animate-modal-in {
  animation: modalIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

/* Courbe de bézier personnalisée pour fluidité organique */
.ease-out-expo {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

/* Transitions pour modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(34, 197, 94, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #10b981, #059669);
  border-radius: 3px;
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
