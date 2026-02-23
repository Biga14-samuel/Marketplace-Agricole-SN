<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Arrière-plan organique -->
    <div class="fixed inset-0 z-0">
      <!-- Dégradé agricole -->
      <div class="absolute inset-0 bg-gradient-to-br from-forest-green/10 via-cream-light/5 to-earth-brown/5"></div>
      
      <!-- Texture agricole -->
      <div class="absolute inset-0 opacity-[0.015]">
        <div class="absolute inset-0 agricultural-texture"></div>
      </div>
      
      <!-- Éléments décoratifs agricoles -->
      <div class="absolute top-24 left-10 w-28 h-28 animate-float-very-slow">
        <div class="w-full h-full opacity-5">
          <svg class="w-full h-full text-forest-green" viewBox="0 0 100 100">
            <path d="M50,15 L70,50 L50,85 L30,50 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <div class="absolute bottom-40 right-12 w-20 h-20 animate-float-slow" style="animation-delay: -8s">
        <div class="w-full h-full opacity-5">
          <svg class="w-full h-full text-earth-brown" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête producteur -->
      <div class="mb-10 animate-fade-in-up">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-3">
              Mes Commandes
            </h1>
            <p class="text-nature-gray text-lg">
              Gérez les commandes de vos produits frais
            </p>
          </div>
          
          <!-- Statistiques rapides -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-500">
              <div class="text-2xl font-bold text-forest-green">{{ stats.today }}</div>
              <div class="text-sm text-nature-gray">Aujourd'hui</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-500">
              <div class="text-2xl font-bold text-warning-dark">{{ stats.pending }}</div>
              <div class="text-sm text-nature-gray">En attente</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-500">
              <div class="text-2xl font-bold text-info-dark">{{ stats.preparing }}</div>
              <div class="text-sm text-nature-gray">En préparation</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-500">
              <div class="text-2xl font-bold text-success-dark">{{ stats.delivered }}</div>
              <div class="text-sm text-nature-gray">Livrées</div>
            </div>
          </div>
        </div>
        
        <!-- Barre d'actions -->
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <div class="flex-1">
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="filter in filters" 
                :key="filter.id"
                @click="activeFilter = filter.id"
                :class="[
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 flex items-center gap-2',
                  activeFilter === filter.id 
                    ? 'bg-soft-green text-white shadow-md transform scale-105' 
                    : 'bg-white text-nature-gray hover:bg-white/90 hover:shadow-sm'
                ]"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <i :class="filter.icon" class="text-sm"></i>
                {{ filter.label }}
                <span v-if="filter.count" class="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {{ filter.count }}
                </span>
              </button>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="refreshOrders"
              class="px-4 py-2.5 bg-cream-light text-forest-green rounded-xl hover:bg-white hover:shadow-sm transition-all duration-500"
              :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
            >
              <i class="fas fa-sync-alt"></i>
            </button>
            <button 
              @click="exportOrders"
              class="px-5 py-2.5 bg-earth-brown/10 text-earth-brown rounded-xl hover:bg-earth-brown/20 hover:shadow-sm transition-all duration-500 flex items-center gap-2"
              :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
            >
              <i class="fas fa-file-export"></i>
              Exporter
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des commandes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <transition-group 
          name="staggered-fade" 
          tag="div"
          class="contents"
          @before-enter="beforeStaggerEnter"
          @enter="staggerEnter"
        >
          <!-- Carte commande -->
          <div 
            v-for="(order, index) in filteredOrders" 
            :key="order.id"
            :data-index="index"
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-cream-light/30 group animate-fade-in-up"
            :style="{ 
              animationDelay: `${index * 50}ms`,
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
            }"
          >
            <!-- En-tête de la carte -->
            <div class="p-6 border-b border-cream-light/30">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-bold text-forest-green">
                    #{{ order.id }}
                  </h3>
                  <p class="text-sm text-nature-gray mt-1">
                    <i class="far fa-clock mr-1"></i>
                    {{ formatTime(order.time) }}
                  </p>
                </div>
                
                <!-- Badge statut -->
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  getStatusClass(order.status)
                ]">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              
              <!-- Client -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-cream-light/50 flex items-center justify-center">
                  <i class="fas fa-user text-forest-green/70"></i>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-forest-green">{{ order.customer.name }}</p>
                  <p class="text-xs text-nature-gray">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    {{ order.distance }}
                  </p>
                </div>
                <button 
                  @click="contactCustomer(order)"
                  class="text-soft-green hover:text-forest-green transition-colors duration-300"
                >
                  <i class="fas fa-comment text-lg"></i>
                </button>
              </div>
            </div>
            
            <!-- Produits -->
            <div class="p-6">
              <h4 class="text-sm font-medium text-nature-gray mb-3">Produits commandés</h4>
              <div class="space-y-3">
                <div 
                  v-for="item in order.items.slice(0, 3)" 
                  :key="item.id"
                  class="flex items-center justify-between p-3 rounded-lg bg-cream-light/30 hover:bg-cream-light/50 transition-all duration-300"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg overflow-hidden">
                      <img 
                        :src="item.image" 
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p class="font-medium text-forest-green">{{ item.name }}</p>
                      <p class="text-xs text-nature-gray">{{ item.variant }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-forest-green">{{ item.total }} €</div>
                    <div class="text-xs text-nature-gray">x{{ item.quantity }}</div>
                  </div>
                </div>
                
                <!-- Voir plus -->
                <div v-if="order.items.length > 3" class="text-center">
                  <button 
                    @click="toggleShowAll(order)"
                    class="text-sm text-soft-green hover:text-forest-green transition-colors duration-300"
                  >
                    + {{ order.items.length - 3 }} autres produits
                  </button>
                </div>
              </div>
              
              <!-- Total et actions -->
              <div class="mt-6 pt-6 border-t border-cream-light/30">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <p class="text-sm text-nature-gray">Total commande</p>
                    <p class="text-xl font-bold text-forest-green">{{ order.total }} €</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-nature-gray">Livraison</p>
                    <p class="font-medium text-forest-green">{{ order.deliveryType }}</p>
                  </div>
                </div>
                
                <!-- Actions rapides -->
                <div class="flex gap-2">
                  <button 
                    v-if="order.status === 'pending'"
                    @click="acceptOrder(order)"
                    class="flex-1 px-4 py-2.5 bg-success-light text-success-dark rounded-lg font-medium hover:bg-success-light/80 hover:shadow-sm transition-all duration-500 flex items-center justify-center gap-2"
                    :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  >
                    <i class="fas fa-check"></i>
                    Accepter
                  </button>
                  
                  <button 
                    v-if="order.status === 'accepted'"
                    @click="markAsReady(order)"
                    class="flex-1 px-4 py-2.5 bg-info-light text-info-dark rounded-lg font-medium hover:bg-info-light/80 hover:shadow-sm transition-all duration-500 flex items-center justify-center gap-2"
                    :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  >
                    <i class="fas fa-box"></i>
                    Prête
                  </button>
                  
                  <button 
                    v-if="order.status === 'ready'"
                    @click="markAsDelivered(order)"
                    class="flex-1 px-4 py-2.5 bg-soft-green text-white rounded-lg font-medium hover:bg-forest-green hover:shadow-sm transition-all duration-500 flex items-center justify-center gap-2"
                    :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  >
                    <i class="fas fa-truck"></i>
                    Livrée
                  </button>
                  
                  <button 
                    @click="viewOrderDetails(order)"
                    class="px-4 py-2.5 bg-white text-forest-green rounded-lg font-medium hover:bg-cream-light hover:shadow-sm transition-all duration-500 border border-cream-light flex items-center gap-2"
                    :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <button 
                    v-if="order.status === 'pending'"
                    @click="showCancelModal = order.id"
                    class="px-4 py-2.5 bg-error-light text-error-dark rounded-lg font-medium hover:bg-error-light/80 hover:shadow-sm transition-all duration-500"
                    :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Timeline de progression -->
            <div class="px-6 pb-6">
              <div class="text-xs text-nature-gray mb-2">Progression</div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    order.timeline.ordered ? 'bg-success-dark' : 'bg-cream-light'
                  ]"></div>
                  <span class="text-xs text-nature-gray">Commandée</span>
                </div>
                <div class="h-0.5 flex-1 mx-2 bg-cream-light"></div>
                <div class="flex items-center gap-1">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    order.timeline.accepted ? 'bg-success-dark' : 'bg-cream-light'
                  ]"></div>
                  <span class="text-xs text-nature-gray">Acceptée</span>
                </div>
                <div class="h-0.5 flex-1 mx-2 bg-cream-light"></div>
                <div class="flex items-center gap-1">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    order.timeline.ready ? 'bg-success-dark' : 'bg-cream-light'
                  ]"></div>
                  <span class="text-xs text-nature-gray">Prête</span>
                </div>
                <div class="h-0.5 flex-1 mx-2 bg-cream-light"></div>
                <div class="flex items-center gap-1">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    order.timeline.delivered ? 'bg-success-dark' : 'bg-cream-light'
                  ]"></div>
                  <span class="text-xs text-nature-gray">Livrée</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- État vide -->
      <div 
        v-if="filteredOrders.length === 0"
        class="text-center py-16 animate-fade-in"
      >
        <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-cream-light/50 flex items-center justify-center">
          <i class="fas fa-clipboard-list text-forest-green/50 text-4xl"></i>
        </div>
        <h3 class="text-2xl font-serif text-forest-green mb-3">
          Aucune commande {{ activeFilter !== 'all' ? filters.find(f => f.id === activeFilter)?.label.toLowerCase() : '' }}
        </h3>
        <p class="text-nature-gray mb-8 max-w-md mx-auto">
          {{ getEmptyStateMessage(activeFilter) }}
        </p>
        <button 
          v-if="activeFilter !== 'all'"
          @click="activeFilter = 'all'"
          class="px-8 py-3 bg-soft-green text-white rounded-xl font-medium hover:bg-forest-green transform hover:scale-105 transition-all duration-500"
          :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
        >
          Voir toutes les commandes
        </button>
      </div>

      <!-- Modal d'annulation -->
      <div 
        v-if="showCancelModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="showCancelModal = null"
      >
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full animate-modal-in">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto rounded-full bg-error-light flex items-center justify-center mb-4">
              <i class="fas fa-exclamation-triangle text-error-dark text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-forest-green mb-2">
              Annuler la commande ?
            </h3>
            <p class="text-nature-gray">
              Cette action ne peut pas être annulée. Le client sera notifié.
            </p>
          </div>
          
          <div class="space-y-3">
            <textarea 
              v-model="cancelReason"
              placeholder="Raison de l'annulation (optionnel)"
              class="w-full p-3 rounded-xl border border-cream-light focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300"
              rows="3"
            ></textarea>
            
            <div class="flex gap-3">
              <button 
                @click="showCancelModal = null"
                class="flex-1 px-6 py-3 bg-cream-light text-forest-green rounded-xl font-medium hover:bg-white transition-all duration-300"
              >
                Annuler
              </button>
              <button 
                @click="confirmCancelOrder"
                class="flex-1 px-6 py-3 bg-error-dark text-white rounded-xl font-medium hover:bg-error-dark/90 transition-all duration-300"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'

export default {
  name: 'ProducerOrders',
  
  setup() {
    const activeFilter = ref('all')
    const showCancelModal = ref(null)
    const cancelReason = ref('')
    
    const stats = ref({
      today: 8,
      pending: 3,
      preparing: 5,
      delivered: 42
    })
    
    const filters = ref([
      { id: 'all', label: 'Toutes', icon: 'fas fa-list', count: null },
      { id: 'pending', label: 'En attente', icon: 'far fa-clock', count: 3 },
      { id: 'accepted', label: 'Acceptées', icon: 'fas fa-check-circle', count: 5 },
      { id: 'ready', label: 'Prêtes', icon: 'fas fa-box', count: 2 },
      { id: 'delivered', label: 'Livrées', icon: 'fas fa-truck', count: 42 },
      { id: 'cancelled', label: 'Annulées', icon: 'fas fa-times-circle', count: 2 }
    ])
    
    // Données de démonstration
    const orders = ref([
      {
        id: 'CMD-00145',
        time: '2023-10-25T09:30:00',
        status: 'pending',
        customer: {
          name: 'Marie Dubois',
          avatar: null
        },
        distance: '3.2 km',
        items: [
          { id: 1, name: 'Tomates anciennes', variant: 'Bio - 500g', quantity: 2, price: 3.50, total: 7.00, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200' },
          { id: 2, name: 'Salade verte', variant: 'Cueillie du jour', quantity: 1, price: 2.50, total: 2.50, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200' }
        ],
        total: 9.50,
        deliveryType: 'Livraison',
        timeline: {
          ordered: true,
          accepted: false,
          ready: false,
          delivered: false
        }
      },
      {
        id: 'CMD-00144',
        time: '2023-10-25T08:15:00',
        status: 'accepted',
        customer: {
          name: 'Jean Martin',
          avatar: null
        },
        distance: '5.7 km',
        items: [
          { id: 3, name: 'Fromage de chèvre', variant: 'Affiné 3 semaines', quantity: 3, price: 6.50, total: 19.50, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
          { id: 4, name: 'Œufs frais', variant: 'Plein air - 6 unités', quantity: 2, price: 4.20, total: 8.40, image: 'https://images.unsplash.com/photo-1587486913049-53fc88980f79?w=200' }
        ],
        total: 27.90,
        deliveryType: 'Retrait',
        timeline: {
          ordered: true,
          accepted: true,
          ready: false,
          delivered: false
        }
      },
      {
        id: 'CMD-00143',
        time: '2023-10-24T16:45:00',
        status: 'ready',
        customer: {
          name: 'Sophie Lambert',
          avatar: null
        },
        distance: '2.1 km',
        items: [
          { id: 5, name: 'Pain au levain', variant: '800g', quantity: 1, price: 4.80, total: 4.80, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200' },
          { id: 6, name: 'Miel de lavande', variant: 'Pot 250g', quantity: 2, price: 8.90, total: 17.80, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200' }
        ],
        total: 22.60,
        deliveryType: 'Livraison',
        timeline: {
          ordered: true,
          accepted: true,
          ready: true,
          delivered: false
        }
      }
    ])
    
    const filteredOrders = computed(() => {
      if (activeFilter.value === 'all') return orders.value
      return orders.value.filter(order => order.status === activeFilter.value)
    })
    
    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-warning-light text-warning-dark',
        accepted: 'bg-info-light text-info-dark',
        ready: 'bg-success-light text-success-dark',
        delivered: 'bg-forest-green/10 text-forest-green',
        cancelled: 'bg-error-light text-error-dark'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }
    
    const getStatusText = (status) => {
      const texts = {
        pending: 'En attente',
        accepted: 'Acceptée',
        ready: 'Prête',
        delivered: 'Livrée',
        cancelled: 'Annulée'
      }
      return texts[status] || status
    }
    
    const formatTime = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffHours < 1) {
        const diffMinutes = Math.floor((now - date) / (1000 * 60))
        return `Il y a ${diffMinutes} min`
      } else if (diffHours < 24) {
        return `Il y a ${diffHours} h`
      } else {
        return date.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        })
      }
    }
    
    const getEmptyStateMessage = (filter) => {
      const messages = {
        all: 'Aucune commande n\'a été passée pour le moment.',
        pending: 'Aucune commande en attente de traitement.',
        accepted: 'Toutes les commandes sont en cours de préparation.',
        ready: 'Aucune commande prête pour le moment.',
        delivered: 'Aucune commande livrée récemment.',
        cancelled: 'Aucune commande annulée.'
      }
      return messages[filter] || messages.all
    }
    
    // Actions
    const acceptOrder = (order) => {
      order.status = 'accepted'
      order.timeline.accepted = true
      stats.value.pending--
      stats.value.preparing++
    }
    
    const markAsReady = (order) => {
      order.status = 'ready'
      order.timeline.ready = true
      stats.value.preparing--
    }
    
    const markAsDelivered = (order) => {
      order.status = 'delivered'
      order.timeline.delivered = true
      stats.value.delivered++
    }
    
    const contactCustomer = (order) => {
      console.log('Contacter le client:', order.customer.name)
    }
    
    const viewOrderDetails = (order) => {
      console.log('Voir détails de la commande:', order.id)
    }
    
    const toggleShowAll = (order) => {
      console.log('Afficher tous les produits de:', order.id)
    }
    
    const refreshOrders = () => {
      console.log('Actualiser les commandes')
    }
    
    const exportOrders = () => {
      console.log('Exporter les commandes')
    }
    
    const confirmCancelOrder = () => {
      const order = orders.value.find(o => o.id === showCancelModal.value)
      if (order) {
        order.status = 'cancelled'
        stats.value.pending--
        showCancelModal.value = null
        cancelReason.value = ''
      }
    }
    
    // Animations
    const beforeStaggerEnter = (el) => {
      el.style.opacity = 0
      el.style.transform = 'translateY(20px) scale(0.95)'
    }
    
    const staggerEnter = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: el.dataset.index * 0.1,
        ease: 'back.out(1.7)',
        onComplete: done
      })
    }
    
    onMounted(() => {
      // Initialiser les animations
      document.querySelectorAll('.animate-fade-in-up').forEach((el, index) => {
        el.style.animationDelay = `${index * 50}ms`
      })
    })
    
    return {
      activeFilter,
      showCancelModal,
      cancelReason,
      stats,
      filters,
      orders,
      filteredOrders,
      getStatusClass,
      getStatusText,
      formatTime,
      getEmptyStateMessage,
      acceptOrder,
      markAsReady,
      markAsDelivered,
      contactCustomer,
      viewOrderDetails,
      toggleShowAll,
      refreshOrders,
      exportOrders,
      confirmCancelOrder,
      beforeStaggerEnter,
      staggerEnter
    }
  }
}
</script>

<style scoped>
/* Texture agricole */
.agricultural-texture {
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232E7D32' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='40' cy='20' r='2'/%3E%3Ccircle cx='60' cy='20' r='3'/%3E%3Ccircle cx='20' cy='40' r='2'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='60' cy='40' r='2'/%3E%3Ccircle cx='20' cy='60' r='3'/%3E%3Ccircle cx='40' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='3'/%3E%3C/g%3E%3C/svg%3E");
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-float-slow {
  animation: float-slow 12s ease-in-out infinite;
}

.animate-float-very-slow {
  animation: float-very-slow 20s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-modal-in {
  animation: modalIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Transition group */
.staggered-fade-move {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Styles spécifiques pour les couleurs */
:deep() {
  .bg-forest-green { background-color: #2E7D32; }
  .text-forest-green { color: #2E7D32; }
  .bg-soft-green { background-color: #A5D6A7; }
  .text-soft-green { color: #A5D6A7; }
  .bg-cream-light { background-color: #FFF8E1; }
  .text-cream-light { color: #FFF8E1; }
  .bg-earth-brown { background-color: #A1887F; }
  .text-earth-brown { color: #A1887F; }
  .text-nature-gray { color: #666; }
  
  /* Status colors */
  .bg-success-light { background-color: #C8E6C9; }
  .text-success-dark { color: #2E7D32; }
  .bg-warning-light { background-color: #FFF9C4; }
  .text-warning-dark { color: #F57F17; }
  .bg-info-light { background-color: #B3E5FC; }
  .text-info-dark { color: #0288D1; }
  .bg-error-light { background-color: #FFCDD2; }
  .text-error-dark { color: #C62828; }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #FFF8E1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #A5D6A7;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2E7D32;
}
</style>