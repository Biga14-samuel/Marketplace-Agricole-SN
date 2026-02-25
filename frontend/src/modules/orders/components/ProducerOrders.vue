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
                    <div class="font-bold text-forest-green">{{ formatXaf(item.total) }}</div>
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
                    <p class="text-xl font-bold text-forest-green">{{ formatXaf(order.total) }}</p>
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '../stores/orders.store'

const router = useRouter()
const ordersStore = useOrdersStore()

const activeFilter = ref('all')
const showCancelModal = ref<string | number | null>(null)
const cancelReason = ref('')

const stats = ref({
  today: 0,
  pending: 0,
  preparing: 0,
  delivered: 0
})

const filters = ref([
  { id: 'all', label: 'Toutes', icon: 'fas fa-list', count: null as number | null },
  { id: 'pending', label: 'En attente', icon: 'far fa-clock', count: 0 },
  { id: 'accepted', label: 'Acceptées', icon: 'fas fa-check-circle', count: 0 },
  { id: 'ready', label: 'Prêtes', icon: 'fas fa-box', count: 0 },
  { id: 'delivered', label: 'Livrées', icon: 'fas fa-truck', count: 0 },
  { id: 'cancelled', label: 'Annulées', icon: 'fas fa-times-circle', count: 0 }
])

type UiOrder = {
  id: string | number
  time: string
  status: 'pending' | 'accepted' | 'ready' | 'delivered' | 'cancelled'
  customer: { name: string; avatar: string | null }
  distance: string
  items: Array<{ id: string | number; name: string; variant: string; quantity: number; total: number; image: string }>
  total: number
  deliveryType: string
  timeline: { ordered: boolean; accepted: boolean; ready: boolean; delivered: boolean }
}

const orders = ref<UiOrder[]>([])

const mapBackendStatusToUi = (status: string): UiOrder['status'] => {
  if (status === 'confirmed' || status === 'preparing') return 'accepted'
  if (status === 'ready') return 'ready'
  if (status === 'completed') return 'delivered'
  if (status === 'cancelled') return 'cancelled'
  return 'pending'
}

const buildTimeline = (status: UiOrder['status']) => ({
  ordered: true,
  accepted: status === 'accepted' || status === 'ready' || status === 'delivered',
  ready: status === 'ready' || status === 'delivered',
  delivered: status === 'delivered'
})

const mapOrder = (order: any): UiOrder => {
  const status = mapBackendStatusToUi(order?.status || '')
  const items = Array.isArray(order?.items)
    ? order.items.map((item: any, idx: number) => ({
        id: item?.id ?? `${order?.id ?? 'order'}-${idx}`,
        name: item?.productSnapshot?.name || item?.product?.name || 'Produit',
        variant: item?.productSnapshot?.unit || 'Unité',
        quantity: Number(item?.quantity || 0),
        total: Number(item?.subtotal || 0),
        image: item?.productSnapshot?.images?.[0] || item?.product?.images?.[0] || ''
      }))
    : []

  return {
    id: order?.id ?? order?.orderNumber ?? `ORD-${Date.now()}`,
    time: order?.createdAt || new Date().toISOString(),
    status,
    customer: {
      name: order?.customer?.name || 'Client',
      avatar: null
    },
    distance: order?.deliveryAddress?.city ? `${order.deliveryAddress.city}, Cameroun` : 'Cameroun',
    items,
    total: Number(order?.totalAmount || 0),
    deliveryType: order?.deliveryType === 'pickup' ? 'Retrait' : 'Livraison',
    timeline: buildTimeline(status)
  }
}

const refreshStatsAndCounts = () => {
  const todayIso = new Date().toISOString().slice(0, 10)
  const pending = orders.value.filter(o => o.status === 'pending').length
  const accepted = orders.value.filter(o => o.status === 'accepted').length
  const ready = orders.value.filter(o => o.status === 'ready').length
  const delivered = orders.value.filter(o => o.status === 'delivered').length
  const cancelled = orders.value.filter(o => o.status === 'cancelled').length
  const today = orders.value.filter(o => (o.time || '').slice(0, 10) === todayIso).length

  stats.value = {
    today,
    pending,
    preparing: accepted,
    delivered
  }

  filters.value = filters.value.map((filter) => {
    if (filter.id === 'all') return { ...filter, count: null }
    if (filter.id === 'pending') return { ...filter, count: pending }
    if (filter.id === 'accepted') return { ...filter, count: accepted }
    if (filter.id === 'ready') return { ...filter, count: ready }
    if (filter.id === 'delivered') return { ...filter, count: delivered }
    if (filter.id === 'cancelled') return { ...filter, count: cancelled }
    return filter
  })
}

const loadProducerOrders = async () => {
  try {
    await ordersStore.fetchProducerOrders({ limit: 100 })
    orders.value = (ordersStore.producerOrders || []).map(mapOrder)
  } catch (error) {
    console.error('Erreur chargement commandes producteur:', error)
    orders.value = []
  } finally {
    refreshStatsAndCounts()
  }
}

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeFilter.value)
})

const getStatusClass = (status: UiOrder['status']) => {
  const classes: Record<UiOrder['status'], string> = {
    pending: 'bg-warning-light text-warning-dark',
    accepted: 'bg-info-light text-info-dark',
    ready: 'bg-success-light text-success-dark',
    delivered: 'bg-forest-green/10 text-forest-green',
    cancelled: 'bg-error-light text-error-dark'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: UiOrder['status']) => {
  const texts: Record<UiOrder['status'], string> = {
    pending: 'En attente',
    accepted: 'Acceptée',
    ready: 'Prête',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return texts[status] || status
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMinutes = Math.max(1, Math.floor((now.getTime() - date.getTime()) / (1000 * 60)))
    return `Il y a ${diffMinutes} min`
  }
  if (diffHours < 24) {
    return `Il y a ${diffHours} h`
  }
  return date.toLocaleDateString('fr-CM', {
    day: 'numeric',
    month: 'short'
  })
}

const formatXaf = (amount: number) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount || 0))
}

const getEmptyStateMessage = (filter: string) => {
  const messages: Record<string, string> = {
    all: 'Aucune commande n\'a été passée pour le moment.',
    pending: 'Aucune commande en attente de traitement.',
    accepted: 'Aucune commande confirmée en cours.',
    ready: 'Aucune commande prête pour le moment.',
    delivered: 'Aucune commande livrée récemment.',
    cancelled: 'Aucune commande annulée.'
  }
  return messages[filter] || messages.all
}

const acceptOrder = async (order: UiOrder) => {
  order.status = 'accepted'
  order.timeline = buildTimeline(order.status)
  refreshStatsAndCounts()
  try {
    await ordersStore.updateOrderStatus(order.id, 'confirmed' as any)
  } catch (error) {
    console.error('Impossible de confirmer la commande:', error)
  }
}

const markAsReady = async (order: UiOrder) => {
  order.status = 'ready'
  order.timeline = buildTimeline(order.status)
  refreshStatsAndCounts()
  try {
    await ordersStore.updateOrderStatus(order.id, 'ready' as any)
  } catch (error) {
    console.error('Impossible de marquer la commande prête:', error)
  }
}

const markAsDelivered = async (order: UiOrder) => {
  order.status = 'delivered'
  order.timeline = buildTimeline(order.status)
  refreshStatsAndCounts()
  try {
    await ordersStore.updateOrderStatus(order.id, 'completed' as any)
  } catch (error) {
    console.error('Impossible de clôturer la commande:', error)
  }
}

const contactCustomer = (order: UiOrder) => {
  console.log('Contacter le client:', order.customer.name)
}

const viewOrderDetails = (order: UiOrder) => {
  router.push(`/producer/orders/${order.id}`)
}

const toggleShowAll = (order: UiOrder) => {
  console.log('Afficher tous les produits de:', order.id)
}

const refreshOrders = () => {
  void loadProducerOrders()
}

const exportOrders = () => {
  const rows = orders.value.map((order) => ({
    order_id: order.id,
    status: order.status,
    total_xaf: order.total,
    delivery_type: order.deliveryType,
    created_at: order.time
  }))
  console.log('Export commandes (CSV/JSON):', rows)
}

const confirmCancelOrder = async () => {
  const order = orders.value.find(o => o.id === showCancelModal.value)
  if (!order) return
  order.status = 'cancelled'
  order.timeline = buildTimeline(order.status)
  refreshStatsAndCounts()
  try {
    await ordersStore.cancelOrder(order.id, cancelReason.value || undefined)
  } catch (error) {
    console.error('Impossible d\'annuler la commande:', error)
  } finally {
    showCancelModal.value = null
    cancelReason.value = ''
  }
}

const beforeStaggerEnter = (el: any) => {
  el.style.opacity = 0
  el.style.transform = 'translateY(20px) scale(0.95)'
}

const staggerEnter = (el: any, done: any) => {
  const delayMs = Number(el?.dataset?.index || 0) * 100
  window.setTimeout(() => {
    el.style.transition = 'opacity 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0) scale(1)'
    window.setTimeout(() => done(), 460)
  }, delayMs)
}

onMounted(() => {
  document.querySelectorAll('.animate-fade-in-up').forEach((el, index) => {
    ;(el as HTMLElement).style.animationDelay = `${index * 50}ms`
  })
  void loadProducerOrders()
})
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

