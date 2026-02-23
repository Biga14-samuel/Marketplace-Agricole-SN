<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Arrière-plan organique -->
    <div class="fixed inset-0 z-0">
      <!-- Dégradé historique -->
      <div class="absolute inset-0 bg-gradient-to-br from-vintage-green/10 via-cream-light/5 to-earth-brown/5"></div>
      
      <!-- Texture papier ancien -->
      <div class="absolute inset-0 opacity-[0.02]">
        <div class="absolute inset-0 paper-texture"></div>
      </div>
      
      <!-- Éléments décoratifs historiques -->
      <div class="absolute top-32 left-16 w-24 h-24 animate-float-very-slow">
        <div class="w-full h-full opacity-8">
          <svg class="w-full h-full text-vintage-green" viewBox="0 0 100 100">
            <path d="M50,10 L70,30 L70,70 L50,90 L30,70 L30,30 Z" fill="currentColor" fill-opacity="0.1"/>
          </svg>
        </div>
      </div>
      
      <div class="absolute bottom-40 right-20 w-20 h-20 animate-float-slow" style="animation-delay: -6s">
        <div class="w-full h-full opacity-8">
          <svg class="w-full h-full text-earth-brown" viewBox="0 0 100 100">
            <path d="M20,20 C40,10 60,10 80,20 C90,40 90,60 80,80 C60,90 40,90 20,80 C10,60 10,40 20,20 Z" 
                  fill="currentColor" fill-opacity="0.1"/>
          </svg>
        </div>
      </div>
      
      <!-- Animation de feuilles tombantes (ambiance) -->
      <div class="absolute top-0 left-1/4 w-8 h-8 animate-leaf-fall" style="animation-delay: 0s">
        <i class="fas fa-leaf text-vintage-green/20"></i>
      </div>
      <div class="absolute top-0 left-2/3 w-6 h-6 animate-leaf-fall" style="animation-delay: 3s; animation-duration: 8s">
        <i class="fas fa-leaf text-earth-brown/20"></i>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête historique -->
      <div class="mb-12 text-center animate-fade-in-up">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-vintage-green/20 to-cream-light/20 mb-6">
          <i class="fas fa-history text-3xl text-vintage-green"></i>
        </div>
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-4">
          Historique des commandes
        </h1>
        <p class="text-lg text-nature-gray max-w-2xl mx-auto">
          Retracez le parcours complet de vos achats, du panier à la réception
        </p>
      </div>

      <!-- Filtres temporels -->
      <div class="mb-10 animate-fade-in-up" style="animation-delay: 100ms">
        <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 class="text-xl font-semibold text-forest-green mb-2">Période</h2>
              <div class="flex flex-wrap gap-3">
                <button 
                  v-for="period in timePeriods" 
                  :key="period.id"
                  @click="activePeriod = period.id"
                  :class="[
                    'px-5 py-2 rounded-full text-sm font-medium transition-all duration-500',
                    activePeriod === period.id 
                      ? 'bg-vintage-green text-white shadow-md transform scale-105' 
                      : 'bg-white text-nature-gray hover:bg-white/90 hover:shadow-sm'
                  ]"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                >
                  {{ period.label }}
                </button>
              </div>
            </div>
            
            <!-- Recherche et stats -->
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="relative">
                <input 
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher une commande..."
                  class="pl-10 pr-4 py-2.5 bg-white rounded-xl border border-cream-light focus:border-vintage-green focus:ring-2 focus:ring-vintage-green/20 transition-all duration-300 w-full sm:w-64"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                >
                <i class="fas fa-search absolute left-3 top-3 text-nature-gray/50"></i>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-forest-green">{{ stats.total }}</div>
                  <div class="text-sm text-nature-gray">Commandes</div>
                </div>
                <div class="h-8 w-px bg-cream-light"></div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-success-dark">{{ stats.delivered }}</div>
                  <div class="text-sm text-nature-gray">Livrées</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue chronologique -->
      <div class="relative">
        <!-- Ligne centrale de la timeline -->
        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-vintage-green via-cream-light to-earth-brown opacity-30"></div>
        
        <!-- Années/Mois -->
        <div class="mb-12 text-center animate-fade-in-up" style="animation-delay: 200ms">
          <h3 class="text-2xl font-serif font-semibold text-forest-green mb-6">
            {{ currentYear }}
          </h3>
          <div class="flex flex-wrap justify-center gap-3">
            <button 
              v-for="month in months" 
              :key="month"
              @click="activeMonth = month"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                activeMonth === month 
                  ? 'bg-vintage-green text-white shadow-sm' 
                  : 'bg-white/50 text-nature-gray hover:bg-white/80'
              ]"
            >
              {{ month }}
            </button>
          </div>
        </div>

        <!-- Timeline des commandes -->
        <div class="space-y-12">
          <transition-group 
            name="staggered-timeline"
            tag="div"
            @before-enter="beforeStaggerEnter"
            @enter="staggerEnter"
          >
            <!-- Groupe par mois -->
            <div 
              v-for="(monthGroup, monthIndex) in groupedOrders" 
              :key="monthGroup.month"
              :data-index="monthIndex"
              class="relative"
            >
              <!-- Titre du mois -->
              <div class="text-center mb-8">
                <h4 class="text-xl font-bold text-forest-green inline-block px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  {{ monthGroup.month }}
                </h4>
              </div>

              <!-- Commandes du mois -->
              <div class="space-y-8">
                <!-- Commande (alternance gauche/droite) -->
                <div 
                  v-for="(order, orderIndex) in monthGroup.orders" 
                  :key="order.id"
                  :class="[
                    'relative flex flex-col md:flex-row items-start gap-8',
                    (orderIndex % 2 === 0) ? 'md:flex-row' : 'md:flex-row-reverse'
                  ]"
                >
                  <!-- Point sur la timeline -->
                  <div class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 z-10">
                    <div class="relative">
                      <div 
                        :class="[
                          'w-6 h-6 rounded-full border-4 border-white transform transition-all duration-700',
                          getStatusColor(order.status)
                        ]"
                        :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                      ></div>
                      <div 
                        class="absolute inset-0 rounded-full animate-pulse-slow"
                        :class="getStatusPulseColor(order.status)"
                        v-if="order.status === 'pending' || order.status === 'preparing'"
                      ></div>
                    </div>
                  </div>

                  <!-- Date -->
                  <div 
                    :class="[
                      'md:w-1/2 pt-1',
                      (orderIndex % 2 === 0) ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
                    ]"
                  >
                    <div class="sticky top-24">
                      <div class="text-sm text-nature-gray mb-1">{{ order.day }}</div>
                      <div class="text-2xl font-bold text-forest-green">{{ order.date }}</div>
                      <div class="text-sm text-nature-gray mt-1">{{ order.time }}</div>
                    </div>
                  </div>

                  <!-- Carte de la commande -->
                  <div 
                    :class="[
                      'md:w-1/2',
                      (orderIndex % 2 === 0) ? 'md:pl-12' : 'md:pr-12'
                    ]"
                  >
                    <div 
                      class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-cream-light/30 group"
                      :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                      @mouseenter="hoveredOrder = order.id"
                      @mouseleave="hoveredOrder = null"
                    >
                      <div class="p-6">
                        <!-- En-tête de la commande -->
                        <div class="flex items-start justify-between mb-4">
                          <div>
                            <h3 class="text-lg font-bold text-forest-green mb-1">
                              Commande #{{ order.id }}
                            </h3>
                            <p class="text-sm text-nature-gray">
                              <i class="fas fa-store mr-1"></i>
                              {{ order.producer }}
                            </p>
                          </div>
                          <OrderStatusBadge 
                            :status="order.status"
                            :size="'sm'"
                            :show-icon="true"
                            :animate-icon="hoveredOrder === order.id"
                          />
                        </div>

                        <!-- Produits -->
                        <div class="mb-4">
                          <div class="flex flex-wrap gap-2 mb-3">
                            <div 
                              v-for="item in order.items.slice(0, 3)" 
                              :key="item.id"
                              class="flex items-center gap-2 px-3 py-1.5 bg-cream-light/50 rounded-full group/item hover:bg-cream-light transition-all duration-300"
                            >
                              <div class="w-6 h-6 rounded-full overflow-hidden">
                                <img 
                                  :src="item.image" 
                                  :alt="item.name"
                                  class="w-full h-full object-cover"
                                />
                              </div>
                              <span class="text-xs text-nature-gray">{{ item.name }}</span>
                            </div>
                            <div 
                              v-if="order.items.length > 3"
                              class="flex items-center gap-2 px-3 py-1.5 bg-cream-light/30 rounded-full text-xs text-nature-gray"
                            >
                              +{{ order.items.length - 3 }} autres
                            </div>
                          </div>
                        </div>

                        <!-- Détails financiers -->
                        <div class="flex items-center justify-between mb-4 pt-4 border-t border-cream-light/30">
                          <div>
                            <p class="text-sm text-nature-gray">Total</p>
                            <p class="text-xl font-bold text-forest-green">{{ order.total }} €</p>
                          </div>
                          <div class="text-right">
                            <p class="text-sm text-nature-gray">Articles</p>
                            <p class="font-medium text-forest-green">{{ order.items.length }}</p>
                          </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-2">
                          <button 
                            @click="viewOrderDetails(order)"
                            class="flex-1 px-4 py-2.5 bg-vintage-green text-white rounded-lg font-medium hover:bg-forest-green transform hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-2 group/btn"
                            :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                          >
                            <i class="fas fa-eye transform group-hover/btn:scale-110 transition-transform duration-300"></i>
                            Détails
                          </button>
                          <button 
                            v-if="order.status === 'delivered'"
                            @click="reorder(order)"
                            class="px-4 py-2.5 bg-cream-light text-forest-green rounded-lg font-medium hover:bg-white border border-cream-light transform hover:scale-[1.02] transition-all duration-500"
                            :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                          >
                            <i class="fas fa-redo"></i>
                          </button>
                          <button 
                            @click="downloadInvoice(order)"
                            class="px-4 py-2.5 bg-white text-forest-green rounded-lg font-medium hover:bg-cream-light border border-cream-light transform hover:scale-[1.02] transition-all duration-500"
                            :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                          >
                            <i class="fas fa-file-invoice"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Timeline mini intégrée -->
                      <div class="px-6 pb-6">
                        <div class="text-xs text-nature-gray mb-2">Progression</div>
                        <div class="flex items-center justify-between text-xs">
                          <div class="flex flex-col items-center">
                            <div :class="[
                              'w-3 h-3 rounded-full mb-1',
                              order.timeline.confirmed ? 'bg-success-dark' : 'bg-cream-light'
                            ]"></div>
                            <span class="text-nature-gray/70">Confirmée</span>
                          </div>
                          <div class="h-0.5 flex-1 mx-2 bg-gradient-to-r from-vintage-green/30 to-cream-light/30"></div>
                          <div class="flex flex-col items-center">
                            <div :class="[
                              'w-3 h-3 rounded-full mb-1',
                              order.timeline.prepared ? 'bg-success-dark' : 'bg-cream-light'
                            ]"></div>
                            <span class="text-nature-gray/70">Préparée</span>
                          </div>
                          <div class="h-0.5 flex-1 mx-2 bg-gradient-to-r from-cream-light/30 to-vintage-green/30"></div>
                          <div class="flex flex-col items-center">
                            <div :class="[
                              'w-3 h-3 rounded-full mb-1',
                              order.timeline.delivered ? 'bg-success-dark' : 'bg-cream-light'
                            ]"></div>
                            <span class="text-nature-gray/70">Livrée</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- État vide -->
        <div 
          v-if="filteredOrders.length === 0"
          class="text-center py-20 animate-fade-in"
        >
          <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-cream-light/50 flex items-center justify-center">
            <i class="fas fa-scroll text-vintage-green/50 text-4xl"></i>
          </div>
          <h3 class="text-2xl font-serif text-forest-green mb-3">
            Aucune commande trouvée
          </h3>
          <p class="text-nature-gray mb-8 max-w-md mx-auto">
            {{ searchQuery 
              ? 'Aucune commande ne correspond à votre recherche.' 
              : `Vous n'avez pas encore passé de commande pour ${activeMonth} ${currentYear}.` 
            }}
          </p>
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="px-8 py-3 bg-vintage-green text-white rounded-xl font-medium hover:bg-forest-green transform hover:scale-105 transition-all duration-500"
            :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
          >
            Effacer la recherche
          </button>
        </div>

        <!-- Navigation de pagination -->
        <div 
          v-if="filteredOrders.length > 0"
          class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up"
          style="animation-delay: 300ms"
        >
          <div class="text-nature-gray">
            Affichage de <span class="font-bold text-forest-green">{{ showingStart }}-{{ showingEnd }}</span> 
            sur <span class="font-bold text-forest-green">{{ filteredOrders.length }}</span> commandes
          </div>
          <div class="flex gap-2">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                'px-4 py-2 rounded-lg transition-all duration-300',
                currentPage === 1 
                  ? 'bg-cream-light text-nature-gray/50 cursor-not-allowed' 
                  : 'bg-white text-forest-green hover:bg-cream-light hover:shadow-sm'
              ]"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="flex items-center gap-2">
              <button 
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'w-10 h-10 rounded-lg transition-all duration-300',
                  currentPage === page 
                    ? 'bg-vintage-green text-white shadow-sm' 
                    : 'bg-white text-forest-green hover:bg-cream-light'
                ]"
              >
                {{ page }}
              </button>
            </div>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-4 py-2 rounded-lg transition-all duration-300',
                currentPage === totalPages 
                  ? 'bg-cream-light text-nature-gray/50 cursor-not-allowed' 
                  : 'bg-white text-forest-green hover:bg-cream-light hover:shadow-sm'
              ]"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiques résumé -->
    <div 
      class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      v-if="filteredOrders.length > 0"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style="animation-delay: 400ms">
        <!-- Dépenses totales -->
        <div class="bg-gradient-to-br from-vintage-green/10 to-cream-light/10 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-forest-green">Dépenses totales</h4>
            <i class="fas fa-coins text-vintage-green text-xl"></i>
          </div>
          <div class="text-3xl font-bold text-forest-green">{{ totalSpent }} €</div>
          <div class="text-sm text-nature-gray mt-2">Sur {{ filteredOrders.length }} commandes</div>
        </div>
        
        <!-- Producteur préféré -->
        <div class="bg-gradient-to-br from-cream-light/20 to-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-forest-green">Producteur préféré</h4>
            <i class="fas fa-crown text-warning text-xl"></i>
          </div>
          <div class="text-lg font-bold text-forest-green truncate">{{ favoriteProducer.name }}</div>
          <div class="text-sm text-nature-gray mt-1">{{ favoriteProducer.count }} commandes</div>
        </div>
        
        <!-- Taux de satisfaction -->
        <div class="bg-gradient-to-br from-success-light/20 to-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-forest-green">Satisfaction</h4>
            <i class="fas fa-smile-beam text-success-dark text-xl"></i>
          </div>
          <div class="text-3xl font-bold text-forest-green">{{ satisfactionRate }}%</div>
          <div class="text-sm text-nature-gray mt-2">Commandes livrées avec succès</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'
import OrderStatusBadge from './OrderStatusBadge.vue'

export default {
  name: 'OrderHistory',
  
  components: {
    OrderStatusBadge
  },
  
  setup() {
    const activePeriod = ref('all')
    const activeMonth = ref('Tous')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(5)
    const hoveredOrder = ref(null)
    const currentYear = new Date().getFullYear()
    
    const timePeriods = [
      { id: 'all', label: 'Toute la période' },
      { id: 'year', label: 'Cette année' },
      { id: 'month', label: 'Ce mois' },
      { id: 'week', label: 'Cette semaine' }
    ]
    
    const months = ['Tous', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    
    const stats = ref({
      total: 24,
      delivered: 18,
      pending: 3,
      preparing: 2,
      cancelled: 1
    })
    
    // Données de démonstration
    const orders = ref([
      {
        id: 'ORD-2023-00145',
        date: '15 Oct',
        day: 'Dimanche',
        time: '09:30',
        month: 'Octobre',
        year: 2023,
        status: 'delivered',
        producer: 'La Ferme du Val Joyeux',
        items: [
          { id: 1, name: 'Tomates anciennes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100' },
          { id: 2, name: 'Salade verte', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100' },
          { id: 3, name: 'Fromage de chèvre', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100' }
        ],
        total: 42.50,
        timeline: {
          confirmed: true,
          prepared: true,
          delivered: true
        }
      },
      {
        id: 'ORD-2023-00144',
        date: '12 Oct',
        day: 'Jeudi',
        time: '14:15',
        month: 'Octobre',
        year: 2023,
        status: 'delivered',
        producer: 'Le Fournil des Champs',
        items: [
          { id: 4, name: 'Pain au levain', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100' },
          { id: 5, name: 'Confiture artisanale', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100' }
        ],
        total: 28.90,
        timeline: {
          confirmed: true,
          prepared: true,
          delivered: true
        }
      },
      {
        id: 'ORD-2023-00143',
        date: '8 Oct',
        day: 'Dimanche',
        time: '11:45',
        month: 'Octobre',
        year: 2023,
        status: 'preparing',
        producer: 'Les Jardins de la Rivière',
        items: [
          { id: 6, name: 'Courges', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=100' },
          { id: 7, name: 'Pommes de terre', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100' }
        ],
        total: 35.20,
        timeline: {
          confirmed: true,
          prepared: false,
          delivered: false
        }
      }
    ])
    
    const filteredOrders = computed(() => {
      let filtered = orders.value
      
      // Filtre par période
      if (activePeriod.value === 'year') {
        const currentYear = new Date().getFullYear()
        filtered = filtered.filter(order => order.year === currentYear)
      } else if (activePeriod.value === 'month') {
        const currentMonth = new Date().getMonth()
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                           'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        filtered = filtered.filter(order => order.month === monthNames[currentMonth])
      }
      
      // Filtre par mois
      if (activeMonth.value !== 'Tous') {
        filtered = filtered.filter(order => order.month === activeMonth.value)
      }
      
      // Filtre par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.producer.toLowerCase().includes(query) ||
          order.items.some(item => item.name.toLowerCase().includes(query))
        )
      }
      
      return filtered
    })
    
    const groupedOrders = computed(() => {
      const groups = {}
      filteredOrders.value.forEach(order => {
        if (!groups[order.month]) {
          groups[order.month] = {
            month: order.month,
            orders: []
          }
        }
        groups[order.month].orders.push(order)
      })
      
      // Trier les mois dans l'ordre chronologique inverse
      const monthOrder = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                         'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      
      return Object.values(groups)
        .sort((a, b) => monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month))
    })
    
    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredOrders.value.slice(start, end)
    })
    
    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage.value)
    })
    
    const showingStart = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value + 1
    })
    
    const showingEnd = computed(() => {
      const end = currentPage.value * itemsPerPage.value
      return end > filteredOrders.value.length ? filteredOrders.value.length : end
    })
    
    const totalSpent = computed(() => {
      return filteredOrders.value
        .reduce((sum, order) => sum + parseFloat(order.total), 0)
        .toFixed(2)
    })
    
    const favoriteProducer = computed(() => {
      const producerCounts = {}
      filteredOrders.value.forEach(order => {
        producerCounts[order.producer] = (producerCounts[order.producer] || 0) + 1
      })
      
      const maxProducer = Object.entries(producerCounts)
        .reduce((max, [producer, count]) => count > (max.count || 0) ? { producer, count } : max, {})
      
      return maxProducer
    })
    
    const satisfactionRate = computed(() => {
      const deliveredOrders = filteredOrders.value.filter(order => order.status === 'delivered').length
      return Math.round((deliveredOrders / filteredOrders.value.length) * 100) || 0
    })
    
    const getStatusColor = (status) => {
      const colors = {
        pending: 'bg-warning-light border-warning-light',
        preparing: 'bg-info-light border-info-light',
        delivered: 'bg-success-dark border-success-dark',
        cancelled: 'bg-error-light border-error-light'
      }
      return colors[status] || 'bg-gray-300 border-gray-300'
    }
    
    const getStatusPulseColor = (status) => {
      const colors = {
        pending: 'bg-warning-pulse',
        preparing: 'bg-info-pulse',
        delivered: '',
        cancelled: ''
      }
      return colors[status] || ''
    }
    
    // Actions
    const viewOrderDetails = (order) => {
      console.log('Voir détails de la commande:', order.id)
    }
    
    const reorder = (order) => {
      console.log('Recommander les produits de la commande:', order.id)
    }
    
    const downloadInvoice = (order) => {
      console.log('Télécharger la facture de la commande:', order.id)
    }
    
    const clearSearch = () => {
      searchQuery.value = ''
    }
    
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }
    
    // Animations
    const beforeStaggerEnter = (el) => {
      el.style.opacity = 0
      el.style.transform = 'translateY(30px)'
    }
    
    const staggerEnter = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: el.dataset.index * 0.2,
        ease: 'back.out(1.7)',
        onComplete: done
      })
    }
    
    onMounted(() => {
      // Initialiser les animations
      document.querySelectorAll('.animate-fade-in-up').forEach((el, index) => {
        el.style.animationDelay = `${index * 100}ms`
      })
    })
    
    return {
      activePeriod,
      activeMonth,
      searchQuery,
      currentPage,
      hoveredOrder,
      currentYear,
      timePeriods,
      months,
      stats,
      filteredOrders,
      groupedOrders,
      paginatedOrders,
      totalPages,
      showingStart,
      showingEnd,
      totalSpent,
      favoriteProducer,
      satisfactionRate,
      getStatusColor,
      getStatusPulseColor,
      viewOrderDetails,
      reorder,
      downloadInvoice,
      clearSearch,
      previousPage,
      nextPage,
      beforeStaggerEnter,
      staggerEnter
    }
  }
}
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

@keyframes leaf-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
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

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.animate-float-slow {
  animation: float-slow 15s ease-in-out infinite;
}

.animate-float-very-slow {
  animation: float-very-slow 25s ease-in-out infinite;
}

.animate-leaf-fall {
  animation: leaf-fall 10s linear infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Transition group */
.staggered-timeline-move {
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Styles spécifiques pour les couleurs */
.paper-texture {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none' stroke='%232E7D32' stroke-width='0.5' stroke-opacity='0.05'/%3E%3Cline x1='0' y1='20' x2='100' y2='20' stroke='%232E7D32' stroke-width='0.3' stroke-opacity='0.03'/%3E%3Cline x1='0' y1='40' x2='100' y2='40' stroke='%232E7D32' stroke-width='0.3' stroke-opacity='0.03'/%3E%3Cline x1='0' y1='60' x2='100' y2='60' stroke='%232E7D32' stroke-width='0.3' stroke-opacity='0.03'/%3E%3Cline x1='0' y1='80' x2='100' y2='80' stroke='%232E7D32' stroke-width='0.3' stroke-opacity='0.03'/%3E%3C/svg%3E");
}

/* Styles spécifiques pour les couleurs */
:deep() {
  .bg-vintage-green { background-color: #4A7C59; }
  .text-vintage-green { color: #4A7C59; }
  .bg-forest-green { background-color: #2E7D32; }
  .text-forest-green { color: #2E7D32; }
  .bg-cream-light { background-color: #FFF8E1; }
  .text-cream-light { color: #FFF8E1; }
  .bg-earth-brown { background-color: #8D6E63; }
  .text-earth-brown { color: #8D6E63; }
  .text-nature-gray { color: #666; }
  
  /* Status colors */
  .bg-success-light { background-color: #C8E6C9; }
  .text-success-dark { color: #2E7D32; }
  .bg-warning-light { background-color: #FFF3E0; }
  .text-warning-dark { color: #F57F17; }
  .bg-info-light { background-color: #B3E5FC; }
  .text-info-dark { color: #0288D1; }
  .bg-error-light { background-color: #FFCDD2; }
  .text-error-dark { color: #C62828; }
  
  .bg-warning-pulse { background-color: #FF9800; }
  .bg-info-pulse { background-color: #2196F3; }
  
  .text-warning { color: #FF9800; }
}

/* Custom scrollbar pour la timeline */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #FFF8E1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #A5D6A7;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4A7C59;
}
</style>