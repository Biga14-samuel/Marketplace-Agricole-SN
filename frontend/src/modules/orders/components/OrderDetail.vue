<template>
  <div v-if="order" class="min-h-screen relative overflow-hidden">
    <!-- Arrière-plan organique -->
    <div class="fixed inset-0 z-0"></div>
      <!-- Dégradé radial naturel -->
      <div class="absolute inset-0 bg-gradient-radial from-soft-green/20 via-cream-light/10 to-transparent"></div>
      
      <!-- Texture filigrane organique -->
      <div class="absolute inset-0 opacity-[0.02]">
        <div class="absolute inset-0" 
             style="background-image: url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%232E7D32\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E');">
        </div>
      </div>
      
      <!-- Éléments décoratifs flottants -->
      <div class="absolute top-20 right-10 w-32 h-32 animate-float-very-slow">
        <div class="w-full h-full opacity-5">
          <svg class="w-full h-full text-clay-light" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>
      </div>
      
      <div class="absolute bottom-32 left-8 w-24 h-24 animate-float-slow" style="animation-delay: -5s">
        <div class="w-full h-full opacity-5">
          <svg class="w-full h-full text-forest-green" viewBox="0 0 100 100">
            <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" fill="currentColor"/>
          </svg>
        </div>
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
        Retour à mes commandes
      </button>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête de la commande -->
      <div class="mb-10 animate-fade-in-up">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-3">
              Commande #{{ order.id }}
            </h1>
            <div class="flex flex-wrap items-center gap-4">
              <span :class="[
                'px-4 py-2 rounded-full text-sm font-semibold shadow-sm',
                getStatusClass(order.status)
              ]">
                <i :class="getStatusIcon(order.status)" class="mr-2"></i>
                {{ getStatusText(order.status) }}
              </span>
              <div class="text-nature-gray">
                <i class="far fa-calendar mr-2"></i>
                Passée le {{ formatDate(order.date) }}
              </div>
            </div>
          </div>
          
          <!-- Actions rapides -->
          <div class="flex flex-wrap gap-3">
            <button 
              @click="downloadInvoice"
              class="px-5 py-3 bg-white/80 text-forest-green rounded-xl font-medium hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all duration-500 border border-cream-light"
              :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
            >
              <i class="fas fa-file-invoice mr-2"></i>
              Facture
            </button>
            <button 
              @click="reorder"
              class="px-6 py-3 bg-soft-green text-white rounded-xl font-medium hover:bg-forest-green hover:shadow-lg transform hover:scale-105 transition-all duration-500"
              :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
            >
              <i class="fas fa-redo mr-2"></i>
              Recommander
            </button>
          </div>
        </div>
      </div>

      <!-- Grid principale -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Colonne gauche (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Produits de la commande -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 animate-fade-in-up"
               style="animation-delay: 100ms">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-serif font-semibold text-forest-green">
                Votre panier
              </h2>
              <span class="text-nature-gray">
                {{ order.items.length }} produit{{ order.items.length > 1 ? 's' : '' }}
              </span>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="(item, index) in order.items" 
                :key="item.id"
                :data-index="index"
                class="group/item"
              >
                <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-cream-light/50 transition-all duration-300"
                     :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }">
                  <!-- Image du produit -->
                  <div class="relative">
                    <div class="w-20 h-20 rounded-xl overflow-hidden shadow-sm">
                      <img 
                        :src="item.image" 
                        :alt="item.name"
                        class="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-500"
                        :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                      />
                    </div>
                    <div class="absolute -top-2 -right-2 w-8 h-8 bg-forest-green text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {{ item.quantity }}
                    </div>
                  </div>
                  
                  <!-- Détails du produit -->
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <div>
                        <h3 class="font-semibold text-forest-green group-hover/item:text-forest-green-dark transition-colors duration-300">
                          {{ item.name }}
                        </h3>
                        <p class="text-sm text-nature-gray mt-1">{{ item.description }}</p>
                        
                        <!-- Tags du produit -->
                        <div class="flex flex-wrap gap-2 mt-2">
                          <span 
                            v-if="item.isOrganic"
                            class="px-2 py-1 bg-bio-tag/10 text-bio-tag text-xs rounded-full"
                          >
                            <i class="fas fa-leaf mr-1"></i> Bio
                          </span>
                          <span 
                            v-if="item.isLocal"
                            class="px-2 py-1 bg-local-tag/10 text-local-tag text-xs rounded-full"
                          >
                            <i class="fas fa-map-marker-alt mr-1"></i> Local
                          </span>
                          <span 
                            v-if="item.isSeasonal"
                            class="px-2 py-1 bg-seasonal-tag/10 text-seasonal-tag text-xs rounded-full"
                          >
                            <i class="fas fa-sun mr-1"></i> De saison
                          </span>
                        </div>
                      </div>
                      
                      <div class="text-right">
                        <div class="text-lg font-bold text-forest-green">
                          {{ (item.price * item.quantity).toFixed(2) }} €
                        </div>
                        <div class="text-sm text-nature-gray">
                          {{ item.price }} € l'unité
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Séparateur organique -->
                <div v-if="index < order.items.length - 1" class="relative px-4">
                  <div class="h-px bg-gradient-to-r from-transparent via-cream-light to-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Récapitulatif de paiement -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 animate-fade-in-up"
               style="animation-delay: 200ms">
            <h2 class="text-2xl font-serif font-semibold text-forest-green mb-6">
              Récapitulatif
            </h2>
            
            <div class="space-y-3">
              <div class="flex justify-between py-2">
                <span class="text-nature-gray">Sous-total</span>
                <span class="font-medium">{{ order.subtotal }} €</span>
              </div>
              
              <div class="flex justify-between py-2">
                <span class="text-nature-gray">Frais de livraison</span>
                <span class="font-medium text-success-dark">
                  {{ order.shippingCost }} €
                </span>
              </div>
              
              <div class="flex justify-between py-2">
                <span class="text-nature-gray">Réduction</span>
                <span class="font-medium text-success-dark">
                  -{{ order.discount }} €
                </span>
              </div>
              
              <!-- Séparateur -->
              <div class="relative my-4">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-dashed border-cream-light"></div>
                </div>
              </div>
              
              <div class="flex justify-between py-2 pt-4">
                <span class="text-xl font-bold text-forest-green">Total</span>
                <span class="text-2xl font-bold text-forest-green">
                  {{ order.total }} €
                </span>
              </div>
              
              <div class="mt-4 p-4 bg-cream-light/30 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-success-light flex items-center justify-center">
                    <i class="fas fa-check text-success-dark"></i>
                  </div>
                  <div>
                    <p class="font-medium text-success-dark">Paiement confirmé</p>
                    <p class="text-sm text-nature-gray">
                      {{ order.paymentMethod }} • {{ formatDate(order.paymentDate) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne droite (1/3) -->
        <div class="space-y-8">
          <!-- Carte du producteur -->
          <div v-if="order.producer" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 animate-fade-in-up"
               style="animation-delay: 300ms">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-serif font-semibold text-forest-green">
                Votre producteur
              </h2>
              <i class="fas fa-user text-soft-green text-xl"></i>
            </div>
            
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                <img 
                  :src="order.producer.image" 
                  :alt="order.producer.name"
                  class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                />
              </div>
              <h3 class="text-xl font-bold text-forest-green mb-1">
                {{ order.producer.name }}
              </h3>
              <p class="text-nature-gray mb-3">
                <i class="fas fa-map-marker-alt mr-2"></i>
                {{ order.producer.location }}
              </p>
              
              <!-- Évaluation -->
              <div class="flex items-center justify-center gap-2 mb-4">
                <div class="flex">
                  <i v-for="n in 5" :key="n" 
                     :class="[
                       n <= (order.producer.rating || 0) ? 'fas fa-star text-warning' : 'far fa-star text-nature-gray/30',
                       'text-sm'
                     ]"></i>
                </div>
                <span class="text-sm text-nature-gray">
                  ({{ order.producer.reviewCount || 0 }} avis)
                </span>
              </div>
            </div>
            
            <p class="text-nature-gray text-center mb-6">
              {{ order.producer.description }}
            </p>
            
            <div class="flex flex-col gap-3">
              <button 
                @click="contactProducer"
                class="w-full px-6 py-3 bg-cream-light text-forest-green rounded-xl font-medium hover:bg-white border border-cream-light transform hover:scale-[1.02] transition-all duration-500 group"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <span class="flex items-center justify-center gap-2">
                  <i class="fas fa-comment transform group-hover:scale-110 transition-transform duration-300"></i>
                  Contacter {{ (order.producer.name || '').split(' ')[0] || 'le producteur' }}
                </span>
              </button>
              
              <button 
                @click="viewProducerProfile"
                class="w-full px-6 py-3 bg-soft-green text-white rounded-xl font-medium hover:bg-forest-green transform hover:scale-[1.02] transition-all duration-500 group"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <span class="flex items-center justify-center gap-2">
                  Voir la boutique
                  <i class="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform duration-300"></i>
                </span>
              </button>
            </div>
          </div>

          <!-- Informations de livraison -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 animate-fade-in-up"
               style="animation-delay: 400ms">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-serif font-semibold text-forest-green">
                Livraison
              </h2>
              <i class="fas fa-truck text-clay-light text-xl"></i>
            </div>
            
            <div class="space-y-4">
              <div>
                <p class="text-sm text-nature-gray mb-1">Adresse de livraison</p>
                <p class="font-medium text-forest-green">{{ order.shippingAddress }}</p>
              </div>
              
              <div>
                <p class="text-sm text-nature-gray mb-1">Date de livraison estimée</p>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
                    <i class="fas fa-calendar-check text-success-dark text-sm"></i>
                  </div>
                  <p class="font-medium text-success-dark">
                    {{ formatDate(order.estimatedDelivery) }}
                  </p>
                </div>
              </div>
              
              <div v-if="order.trackingNumber">
                <p class="text-sm text-nature-gray mb-1">Numéro de suivi</p>
                <div class="flex items-center justify-between">
                  <code class="font-mono text-forest-green bg-cream-light/50 px-3 py-1 rounded">
                    {{ order.trackingNumber }}
                  </code>
                  <button 
                    @click="copyTrackingNumber"
                    class="text-sm text-soft-green hover:text-forest-green transition-colors duration-300"
                  >
                    <i class="far fa-copy"></i>
                  </button>
                </div>
              </div>
              
              <!-- Barre de progression -->
              <div class="mt-6">
                <p class="text-sm text-nature-gray mb-2">Statut de la livraison</p>
                <div class="relative pt-1">
                  <div class="flex mb-2 items-center justify-between">
                    <div>
                      <span class="text-xs font-semibold inline-block text-forest-green">
                        {{ getDeliveryStep(order.deliveryStatus) }}
                      </span>
                    </div>
                    <div class="text-right">
                      <span class="text-xs font-semibold inline-block text-forest-green">
                        {{ getDeliveryProgress(order.deliveryStatus) }}%
                      </span>
                    </div>
                  </div>
                  <div class="overflow-hidden h-2 text-xs flex rounded-full bg-cream-light">
                    <div 
                      :style="{ width: getDeliveryProgress(order.deliveryStatus) + '%' }"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-soft-green to-forest-green transition-all duration-1000"
                      :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Besoin d'aide ? -->
          <div class="bg-gradient-to-br from-cream-light/50 to-white/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 animate-fade-in-up"
               style="animation-delay: 500ms">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto rounded-full bg-soft-green/20 flex items-center justify-center mb-4">
                <i class="fas fa-headset text-forest-green text-2xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-forest-green mb-2">
                Une question sur cette commande ?
              </h3>
              <p class="text-nature-gray text-sm mb-4">
                Notre équipe est là pour vous aider
              </p>
              <button 
                @click="openHelp"
                class="w-full px-6 py-3 bg-white text-forest-green rounded-xl font-medium hover:bg-cream-light border border-cream-light transform hover:scale-[1.02] transition-all duration-500"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <span class="flex items-center justify-center gap-2">
                  <i class="fas fa-question-circle"></i>
                  Obtenir de l'aide
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.params.id

// Données de démonstration
const order = ref({
      id: 'ORD-2023-00145',
      date: '2023-10-15',
      status: 'delivered',
      deliveryStatus: 'delivered',
      subtotal: 42.50,
      shippingCost: 4.50,
      discount: 2.00,
      total: 45.00,
      paymentMethod: 'Carte bancaire',
      paymentDate: '2023-10-15',
      shippingAddress: '12 Rue des Vergers, 75000 Paris',
      estimatedDelivery: '2023-10-18',
      trackingNumber: 'TRK-789456123',
      items: [
        {
          id: 1,
          name: 'Tomates anciennes',
          description: 'Variétés anciennes cultivées en plein champ',
          price: 3.50,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
          isOrganic: true,
          isLocal: true,
          isSeasonal: true
        },
        {
          id: 2,
          name: 'Salade verte',
          description: 'Cueillie le matin même',
          price: 2.50,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
          isOrganic: true,
          isLocal: true,
          isSeasonal: true
        },
        {
          id: 3,
          name: 'Fromage de chèvre',
          description: 'Affiné 3 semaines',
          price: 6.50,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
          isOrganic: false,
          isLocal: true,
          isSeasonal: false
        }
      ],
      producer: {
        name: 'La Ferme du Val Joyeux',
        location: 'Saint-Rémy (10km)',
        image: 'https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4a?w=400',
        description: 'Producteur familial depuis 3 générations',
        rating: 4.8,
        reviewCount: 124,
        type: 'Bio'
      }
    })

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning-light text-warning-dark border border-warning-light',
    preparing: 'bg-info-light text-info-dark border border-info-light',
    delivered: 'bg-success-light text-success-dark border border-success-light',
    cancelled: 'bg-error-light text-error-dark border border-error-light'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 border border-gray-100'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pending: 'far fa-clock',
    preparing: 'fas fa-utensils',
    delivered: 'fas fa-check-circle',
    cancelled: 'fas fa-times-circle'
  }
  return icons[status] || 'fas fa-question-circle'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'En attente de confirmation',
    preparing: 'En préparation',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return texts[status] || status
}

const getDeliveryStep = (status: string) => {
  const steps: Record<string, string> = {
    pending: 'Commande validée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée'
  }
  return steps[status] || 'En attente'
}

const getDeliveryProgress = (status: string) => {
  const progress: Record<string, number> = {
    pending: 25,
    processing: 50,
    shipped: 75,
    delivered: 100
  }
  return progress[status] || 0
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const downloadInvoice = () => {
  console.log('Téléchargement de la facture pour la commande:', order.value.id)
  // Logique de téléchargement
}

const reorder = () => {
  console.log('Recommander les produits de la commande:', order.value.id)
  // Navigation vers le panier avec les produits pré-remplis
}

const contactProducer = () => {
  if (order.value.producer) {
    console.log('Contacter le producteur:', order.value.producer.name)
    // Ouverture du formulaire de contact
  }
}

const viewProducerProfile = () => {
  if (order.value.producer) {
    console.log('Voir le profil du producteur:', order.value.producer.name)
    // Navigation vers le profil du producteur
  }
}

const copyTrackingNumber = () => {
  if (order.value.trackingNumber) {
    navigator.clipboard.writeText(order.value.trackingNumber)
    // Afficher une notification de succès
  }
}

const openHelp = () => {
  console.log('Ouvrir le centre d\'aide')
  // Navigation vers le centre d'aide ou ouverture d'un modal
}

onMounted(() => {
  // Animation d'entrée progressive
  document.querySelectorAll('.animate-fade-in-up').forEach((el, index) => {
    (el as HTMLElement).style.animationDelay = `${index * 100}ms`
  })
})
</script>

<style scoped>
/* Animations CSS personnalisées */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}

@keyframes float-very-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
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

.animate-float-slow {
  animation: float 15s ease-in-out infinite;
}

.animate-float-very-slow {
  animation: float-very-slow 25s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

/* Styles spécifiques pour les couleurs */
.bg-gradient-radial {
  background-image: radial-gradient(var(--tw-gradient-stops));
}

:deep() {
  .bg-forest-green { background-color: #2E7D32; }
  .text-forest-green { color: #2E7D32; }
  .bg-forest-green-dark { background-color: #1B5E20; }
  .text-forest-green-dark { color: #1B5E20; }
  .bg-soft-green { background-color: #A5D6A7; }
  .text-soft-green { color: #A5D6A7; }
  .bg-cream-light { background-color: #FFF8E1; }
  .text-cream-light { color: #FFF8E1; }
  .bg-clay-light { background-color: #FFAB91; }
  .text-clay-light { color: #FFAB91; }
  .text-nature-gray { color: #666; }
  
  /* Tags produits */
  .bg-bio-tag { background-color: #4CAF50; }
  .text-bio-tag { color: #4CAF50; }
  .bg-local-tag { background-color: #2196F3; }
  .text-local-tag { color: #2196F3; }
  .bg-seasonal-tag { background-color: #FF9800; }
  .text-seasonal-tag { color: #FF9800; }
  
  /* Status */
  .bg-success-light { background-color: #C8E6C9; }
  .text-success-dark { color: #2E7D32; }
  .bg-warning-light { background-color: #FFF9C4; }
  .text-warning-dark { color: #F57F17; }
  .bg-info-light { background-color: #B3E5FC; }
  .text-info-dark { color: #0288D1; }
  .bg-error-light { background-color: #FFCDD2; }
  .text-error-dark { color: #C62828; }
  
  .text-warning { color: #FF9800; }
}
</style>