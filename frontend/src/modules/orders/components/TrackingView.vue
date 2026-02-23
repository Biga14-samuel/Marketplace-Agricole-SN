<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Arrière-plan organique avec animation -->
    <div class="fixed inset-0 z-0">
      <!-- Dégradé de voyage -->
      <div class="absolute inset-0 bg-gradient-to-br from-road-green/10 via-cream-light/5 to-earth-brown/10"></div>
      
      <!-- Texture de route -->
      <div class="absolute inset-0 opacity-[0.015]">
        <div class="absolute inset-0 road-texture"></div>
      </div>
      
      <!-- Éléments décoratifs flottants (feuilles, gouttes) -->
      <div class="absolute top-20 right-16 w-20 h-20 animate-float-very-slow">
        <div class="w-full h-full opacity-10">
          <svg class="w-full h-full text-road-green" viewBox="0 0 100 100">
            <path d="M50,10 Q70,30 65,60 Q50,80 35,60 Q30,30 50,10 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <div class="absolute bottom-32 left-20 w-16 h-16 animate-float-slow" style="animation-delay: -7s">
        <div class="w-full h-full opacity-10">
          <svg class="w-full h-full text-earth-brown" viewBox="0 0 100 100">
            <path d="M50,20 C70,20 80,40 80,60 C80,80 60,85 50,80 C40,85 20,80 20,60 C20,40 30,20 50,20 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <!-- Animation de route en pointillés -->
      <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 opacity-10">
        <div class="w-full h-full border-t-2 border-dashed border-road-green"></div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <button 
        @click="$router.go(-1)"
        class="inline-flex items-center text-nature-gray hover:text-forest-green group transition-all duration-500"
        :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
      >
        <i class="fas fa-arrow-left mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"></i>
        Retour à la commande
      </button>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-road-green/20 to-cream-light/20 mb-6">
          <i class="fas fa-truck text-3xl text-road-green"></i>
        </div>
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-4">
          Suivi de livraison
        </h1>
        <p class="text-lg text-nature-gray max-w-2xl mx-auto">
          Suivez en temps réel le chemin de vos produits frais, du producteur jusqu'à votre domicile
        </p>
      </div>

      <!-- Grid principale -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Colonne gauche (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Carte de progression -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 animate-fade-in-up"
               style="animation-delay: 100ms">
            <!-- En-tête progression -->
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-serif font-semibold text-forest-green">
                  Progression de la livraison
                </h2>
                <p class="text-nature-gray">Commande #{{ order.id }}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-forest-green">{{ deliveryProgress }}%</div>
                <div class="text-sm text-nature-gray">Complété</div>
              </div>
            </div>

            <!-- Barre de progression principale -->
            <div class="mb-10">
              <div class="flex justify-between text-sm text-nature-gray mb-2">
                <span>Producteur</span>
                <span>Chez vous</span>
              </div>
              <div class="h-4 bg-cream-light rounded-full overflow-hidden">
                <div 
                  :style="{ width: deliveryProgress + '%', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  class="h-full bg-gradient-to-r from-road-green to-forest-green transition-all duration-1000"
                ></div>
              </div>
            </div>

            <!-- Timeline verticale -->
            <div class="relative">
              <!-- Ligne de la timeline -->
              <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-road-green via-earth-brown to-road-green"></div>
              
              <!-- Étapes -->
              <div v-for="(step, index) in deliverySteps" :key="step.id" class="relative mb-10 last:mb-0">
                <!-- Point de l'étape -->
                <div class="absolute left-6 transform -translate-x-1/2">
                  <div 
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700',
                      step.completed ? 'bg-road-green scale-110' : 'bg-cream-light scale-100',
                      step.current ? 'ring-4 ring-road-green/30' : ''
                    ]"
                    :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  >
                    <i 
                      :class="[
                        step.icon,
                        step.completed ? 'text-white' : 'text-nature-gray/50',
                        step.current ? 'animate-pulse-slow' : ''
                      ]"
                      class="text-sm"
                    ></i>
                  </div>
                </div>
                
                <!-- Contenu de l'étape -->
                <div class="ml-16 pl-4">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <h3 class="font-semibold text-forest-green text-lg">{{ step.title }}</h3>
                      <p class="text-nature-gray">{{ step.description }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium text-nature-gray">{{ step.time }}</div>
                      <div class="text-xs text-nature-gray/70">{{ step.date }}</div>
                    </div>
                  </div>
                  
                  <!-- Détails supplémentaires -->
                  <div v-if="step.details" class="mt-3 p-4 bg-cream-light/30 rounded-xl">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <i :class="step.details.icon" class="text-road-green"></i>
                        </div>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-forest-green">{{ step.details.title }}</p>
                        <p class="text-sm text-nature-gray">{{ step.details.description }}</p>
                      </div>
                      <div v-if="step.details.action" class="flex-shrink-0">
                        <button 
                          @click="handleStepAction(step)"
                          class="px-4 py-2 bg-road-green/10 text-road-green rounded-lg hover:bg-road-green/20 transition-all duration-300 text-sm"
                        >
                          {{ step.details.action }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carte du livreur en direct -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 animate-fade-in-up"
               style="animation-delay: 200ms">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-serif font-semibold text-forest-green">
                <i class="fas fa-user-circle mr-3 text-road-green"></i>
                Votre livreur
              </h2>
              <span class="px-3 py-1 bg-road-green/10 text-road-green rounded-full text-sm font-medium">
                <i class="fas fa-bolt mr-1"></i>
                En direct
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Infos livreur -->
              <div>
                <div class="flex items-center gap-4 mb-6">
                  <div class="relative">
                    <div class="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        :src="deliveryDriver.avatar" 
                        :alt="deliveryDriver.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-road-green rounded-full border-2 border-white flex items-center justify-center">
                      <i class="fas fa-check text-white text-xs"></i>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-forest-green">{{ deliveryDriver.name }}</h3>
                    <p class="text-nature-gray">Livreur certifié</p>
                    <div class="flex items-center gap-1 mt-1">
                      <i v-for="n in 5" :key="n" 
                         :class="n <= deliveryDriver.rating ? 'fas fa-star text-warning' : 'far fa-star text-nature-gray/30'"
                         class="text-sm"></i>
                      <span class="text-sm text-nature-gray ml-1">({{ deliveryDriver.reviews }})</span>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-road-green/10 flex items-center justify-center">
                      <i class="fas fa-phone text-road-green"></i>
                    </div>
                    <div>
                      <p class="text-sm text-nature-gray">Contact</p>
                      <p class="font-medium text-forest-green">{{ deliveryDriver.phone }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-road-green/10 flex items-center justify-center">
                      <i class="fas fa-car text-road-green"></i>
                    </div>
                    <div>
                      <p class="text-sm text-nature-gray">Véhicule</p>
                      <p class="font-medium text-forest-green">{{ deliveryDriver.vehicle }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Carte de localisation -->
              <div class="relative">
                <div class="h-full min-h-[200px] bg-gradient-to-br from-cream-light/50 to-white/50 rounded-xl border border-cream-light overflow-hidden">
                  <!-- Simulation de carte -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="relative w-full h-full">
                      <!-- Route -->
                      <div class="absolute left-1/4 top-1/2 w-1/2 h-2 bg-road-green/30 rounded-full"></div>
                      
                      <!-- Points d'intérêt -->
                      <div class="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div class="w-10 h-10 rounded-full bg-forest-green/20 flex items-center justify-center">
                          <i class="fas fa-store text-forest-green"></i>
                        </div>
                      </div>
                      
                      <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div class="w-12 h-12 rounded-full bg-road-green/30 flex items-center justify-center animate-pulse">
                          <div class="w-8 h-8 rounded-full bg-road-green flex items-center justify-center">
                            <i class="fas fa-truck text-white"></i>
                          </div>
                        </div>
                      </div>
                      
                      <div class="absolute left-3/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div class="w-10 h-10 rounded-full bg-earth-brown/20 flex items-center justify-center">
                          <i class="fas fa-home text-earth-brown"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Légende -->
                  <div class="absolute bottom-4 left-0 right-0 px-4">
                    <div class="flex items-center justify-center gap-6">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-forest-green"></div>
                        <span class="text-xs text-nature-gray">Producteur</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-road-green"></div>
                        <span class="text-xs text-nature-gray">Livreur</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-earth-brown"></div>
                        <span class="text-xs text-nature-gray">Chez vous</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Estimation -->
                <div class="mt-4 text-center">
                  <p class="text-nature-gray mb-1">Estimation d'arrivée</p>
                  <p class="text-xl font-bold text-road-green">
                    <i class="far fa-clock mr-2"></i>
                    {{ estimatedArrival }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne droite (1/3) -->
        <div class="space-y-8">
          <!-- Carte d'infos rapides -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 animate-fade-in-up"
               style="animation-delay: 300ms">
            <h2 class="text-2xl font-serif font-semibold text-forest-green mb-6">
              Informations
            </h2>
            
            <div class="space-y-6">
              <!-- Numéro de suivi -->
              <div>
                <p class="text-sm text-nature-gray mb-2">Numéro de suivi</p>
                <div class="flex items-center justify-between">
                  <code class="font-mono text-lg font-bold text-forest-green bg-cream-light/50 px-4 py-2 rounded-lg">
                    {{ trackingNumber }}
                  </code>
                  <button 
                    @click="copyTrackingNumber"
                    class="px-4 py-2 bg-cream-light text-forest-green rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300"
                  >
                    <i class="far fa-copy"></i>
                  </button>
                </div>
              </div>
              
              <!-- Adresse -->
              <div>
                <p class="text-sm text-nature-gray mb-2">Adresse de livraison</p>
                <div class="p-4 bg-cream-light/30 rounded-xl">
                  <p class="font-medium text-forest-green">{{ deliveryAddress.street }}</p>
                  <p class="text-nature-gray">{{ deliveryAddress.city }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <i class="fas fa-phone text-road-green"></i>
                    <span class="text-sm text-nature-gray">{{ deliveryAddress.phone }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Instructions -->
              <div v-if="deliveryInstructions">
                <p class="text-sm text-nature-gray mb-2">Instructions spéciales</p>
                <div class="p-4 bg-earth-brown/5 rounded-xl border border-earth-brown/20">
                  <p class="text-forest-green">{{ deliveryInstructions }}</p>
                </div>
              </div>
              
              <!-- Produits dans la livraison -->
              <div>
                <p class="text-sm text-nature-gray mb-3">Contenu de la livraison</p>
                <div class="space-y-2">
                  <div 
                    v-for="item in deliveryItems" 
                    :key="item.id"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-light/50 transition-all duration-300"
                  >
                    <div class="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        :src="item.image" 
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-forest-green">{{ item.name }}</p>
                      <p class="text-sm text-nature-gray">{{ item.quantity }} unité{{ item.quantity > 1 ? 's' : '' }}</p>
                    </div>
                    <span 
                      v-if="item.fragile"
                      class="px-2 py-1 bg-warning-light/30 text-warning-dark text-xs rounded-full"
                    >
                      <i class="fas fa-exclamation-triangle mr-1"></i>
                      Fragile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="bg-gradient-to-br from-cream-light/50 to-white/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 animate-fade-in-up"
               style="animation-delay: 400ms">
            <h3 class="text-lg font-semibold text-forest-green mb-4">
              <i class="fas fa-bolt text-road-green mr-2"></i>
              Actions rapides
            </h3>
            
            <div class="space-y-3">
              <button 
                @click="contactDriver"
                class="w-full px-4 py-3 bg-road-green text-white rounded-xl font-medium hover:bg-forest-green transform hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3 group"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <i class="fas fa-comment transform group-hover:scale-110 transition-transform duration-300"></i>
                Contacter le livreur
              </button>
              
              <button 
                @click="updateDeliveryAddress"
                class="w-full px-4 py-3 bg-white text-forest-green rounded-xl font-medium hover:bg-cream-light border border-cream-light transform hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3 group"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <i class="fas fa-map-marker-alt transform group-hover:scale-110 transition-transform duration-300"></i>
                Modifier l'adresse
              </button>
              
              <button 
                @click="delayDelivery"
                class="w-full px-4 py-3 bg-white text-nature-gray rounded-xl font-medium hover:bg-cream-light border border-cream-light transform hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3 group"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <i class="far fa-clock transform group-hover:scale-110 transition-transform duration-300"></i>
                Reporter la livraison
              </button>
            </div>
            
            <!-- Mettre à jour le statut -->
            <div class="mt-6 pt-6 border-t border-cream-light/50">
              <p class="text-sm text-nature-gray mb-3">Mettre à jour le statut</p>
              <button 
                @click="markAsReceived"
                :disabled="!canMarkAsReceived"
                :class="[
                  'w-full px-4 py-3 rounded-xl font-medium transition-all duration-500',
                  canMarkAsReceived 
                    ? 'bg-forest-green text-white hover:bg-forest-green/90 transform hover:scale-[1.02]' 
                    : 'bg-cream-light text-nature-gray/50 cursor-not-allowed'
                ]"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <i class="fas fa-check-circle mr-2"></i>
                Marquer comme reçu
              </button>
            </div>
          </div>

          <!-- Aide en direct -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 animate-fade-in-up"
               style="animation-delay: 500ms">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto rounded-full bg-road-green/20 flex items-center justify-center mb-4">
                <i class="fas fa-headset text-road-green text-2xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-forest-green mb-2">
                Besoin d'aide ?
              </h3>
              <p class="text-nature-gray text-sm mb-4">
                Notre équipe est disponible pour vous aider
              </p>
              <button 
                @click="openLiveChat"
                class="w-full px-4 py-3 bg-cream-light text-forest-green rounded-xl font-medium hover:bg-white border border-cream-light transform hover:scale-[1.02] transition-all duration-500"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <span class="flex items-center justify-center gap-2">
                  <i class="fas fa-comments"></i>
                  Chat en direct
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mise à jour en temps réel -->
      <div class="mt-12 bg-road-green/10 backdrop-blur-sm rounded-2xl p-6 animate-fade-in-up">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-road-green flex items-center justify-center animate-pulse">
              <i class="fas fa-sync-alt text-white"></i>
            </div>
            <div>
              <p class="font-medium text-forest-green">Mise à jour automatique activée</p>
              <p class="text-sm text-nature-gray">Les informations se mettent à jour toutes les 30 secondes</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-nature-gray mb-1">Dernière mise à jour</p>
            <p class="font-medium text-forest-green">{{ lastUpdateTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'TrackingView',
  
  setup() {
    const route = useRoute()
    const orderId = route.params.id
    
    // Données de démonstration
    const order = ref({
      id: 'ORD-2023-00145',
      trackingNumber: 'TRK-789456123XYZ'
    })
    
    const deliverySteps = ref([
      {
        id: 1,
        title: 'Commande confirmée',
        description: 'Votre commande a été acceptée par le producteur',
        icon: 'fas fa-check-circle',
        completed: true,
        current: false,
        time: '09:30',
        date: '25 Oct'
      },
      {
        id: 2,
        title: 'En préparation',
        description: 'Le producteur prépare vos produits frais',
        icon: 'fas fa-utensils',
        completed: true,
        current: false,
        time: '10:15',
        date: '25 Oct',
        details: {
          icon: 'fas fa-user',
          title: 'Producteur : La Ferme du Val Joyeux',
          description: 'Récolte en cours des produits de votre commande'
        }
      },
      {
        id: 3,
        title: 'Prête pour livraison',
        description: 'Votre colis est prêt et attend le livreur',
        icon: 'fas fa-box',
        completed: true,
        current: false,
        time: '13:45',
        date: '25 Oct'
      },
      {
        id: 4,
        title: 'En cours de livraison',
        description: 'Votre livreur a récupéré le colis',
        icon: 'fas fa-truck',
        completed: true,
        current: true,
        time: '14:30',
        date: '25 Oct',
        details: {
          icon: 'fas fa-map-marker-alt',
          title: 'En route vers votre domicile',
          description: 'Le livreur se trouve à environ 15 minutes de chez vous',
          action: 'Voir sur la carte'
        }
      },
      {
        id: 5,
        title: 'Livraison',
        description: 'Le livreur est à votre adresse',
        icon: 'fas fa-home',
        completed: false,
        current: false,
        time: '15:00 - 15:30',
        date: '25 Oct (estimé)'
      }
    ])
    
    const deliveryDriver = ref({
      name: 'Thomas Martin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      rating: 4.9,
      reviews: 247,
      phone: '+33 6 12 34 56 78',
      vehicle: 'Renault Kangoo électrique'
    })
    
    const deliveryAddress = ref({
      street: '12 Rue des Vergers, Appt 3B',
      city: '75000 Paris',
      phone: '+33 6 98 76 54 32'
    })
    
    const deliveryInstructions = ref('Sonner deux fois, laisser devant la porte si absence')
    
    const deliveryItems = ref([
      { id: 1, name: 'Tomates anciennes', quantity: 2, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200', fragile: true },
      { id: 2, name: 'Salade verte', quantity: 1, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200', fragile: false },
      { id: 3, name: 'Fromage de chèvre', quantity: 1, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200', fragile: true }
    ])
    
    const estimatedArrival = ref('15:15 - 15:30')
    const lastUpdateTime = ref('14:42')
    
    const canMarkAsReceived = computed(() => {
      return deliverySteps.value[4].completed
    })
    
    const deliveryProgress = computed(() => {
      const completedSteps = deliverySteps.value.filter(step => step.completed).length
      return Math.round((completedSteps / deliverySteps.value.length) * 100)
    })
    
    const trackingNumber = computed(() => {
      return order.value.trackingNumber
    })
    
    // Méthodes
    const copyTrackingNumber = () => {
      navigator.clipboard.writeText(trackingNumber.value)
      // Afficher une notification
      console.log('Numéro de suivi copié')
    }
    
    const handleStepAction = (step) => {
      if (step.id === 4) {
        // Voir sur la carte
        console.log('Ouvrir la carte avec la position du livreur')
      }
    }
    
    const contactDriver = () => {
      console.log('Contacter le livreur:', deliveryDriver.value.name)
    }
    
    const updateDeliveryAddress = () => {
      console.log('Modifier l\'adresse de livraison')
    }
    
    const delayDelivery = () => {
      console.log('Reporter la livraison')
    }
    
    const markAsReceived = () => {
      if (canMarkAsReceived.value) {
        deliverySteps.value[4].completed = true
        console.log('Commande marquée comme reçue')
      }
    }
    
    const openLiveChat = () => {
      console.log('Ouvrir le chat en direct')
    }
    
    // Simulation de mise à jour en temps réel
    let updateInterval
    onMounted(() => {
      updateInterval = setInterval(() => {
        // Simuler une mise à jour
        const now = new Date()
        lastUpdateTime.value = now.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }, 30000) // Toutes les 30 secondes
    })
    
    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval)
      }
    })
    
    return {
      order,
      deliverySteps,
      deliveryDriver,
      deliveryAddress,
      deliveryInstructions,
      deliveryItems,
      estimatedArrival,
      lastUpdateTime,
      canMarkAsReceived,
      deliveryProgress,
      trackingNumber,
      copyTrackingNumber,
      handleStepAction,
      contactDriver,
      updateDeliveryAddress,
      delayDelivery,
      markAsReceived,
      openLiveChat
    }
  }
}
</script>

<style scoped>
/* Texture de route */
.road-texture {
  background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60h120M60 0v120' stroke='%232E7D32' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E");
}

/* Animations CSS personnalisées */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-very-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-float-slow {
  animation: float-slow 15s ease-in-out infinite;
}

.animate-float-very-slow {
  animation: float-very-slow 25s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Styles spécifiques pour les couleurs */
:deep() {
  .bg-road-green { background-color: #4CAF50; }
  .text-road-green { color: #4CAF50; }
  .bg-forest-green { background-color: #2E7D32; }
  .text-forest-green { color: #2E7D32; }
  .bg-cream-light { background-color: #FFF8E1; }
  .text-cream-light { color: #FFF8E1; }
  .bg-earth-brown { background-color: #8D6E63; }
  .text-earth-brown { color: #8D6E63; }
  .text-nature-gray { color: #666; }
  
  .bg-warning-light { background-color: #FFF3E0; }
  .text-warning-dark { color: #F57F17; }
  
  .text-warning { color: #FF9800; }
}

/* Effet de progression fluide */
.progress-transition {
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>