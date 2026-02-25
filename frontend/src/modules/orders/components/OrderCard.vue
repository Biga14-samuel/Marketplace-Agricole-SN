<template>
  <article 
    :class="[
      'order-card',
      'relative overflow-hidden',
      'transition-all duration-500',
      variantClasses,
      sizeClasses,
      roundedClasses,
      { 
        'cursor-pointer hover:shadow-xl': clickable,
        'ring-2 ring-offset-2 ring-opacity-30': selected,
        'animate-pulse-slow': loading
      }
    ]"
    :style="{
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      ...customStyles
    }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Effet d'arrière-plan organique -->
    <div 
      v-if="showBackgroundEffect"
      :class="[
        'absolute inset-0 -z-10 opacity-10',
        getBackgroundEffect(status)
      ]"
    ></div>

    <!-- Texture filigrane subtile -->
    <div 
      v-if="showFiligree"
      class="absolute inset-0 -z-10 opacity-5"
      :style="filigreeStyle"
    ></div>

    <!-- Élément décoratif organique flottant -->
    <div 
      v-if="showFloatingElement"
      :class="[
        'absolute -z-10 transition-all duration-700',
        getFloatingElementPosition(size),
        { 'opacity-20 group-hover:opacity-30': !hovered, 'opacity-30 scale-110': hovered }
      ]"
      :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
    >
      <svg width="80" height="80" viewBox="0 0 100 100" :class="getFloatingElementColor(status)">
        <path :d="getFloatingElementShape(status)" fill="currentColor" fill-opacity="0.1"/>
      </svg>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 h-full flex flex-col">
      <!-- En-tête de la carte -->
      <header class="p-4 sm:p-5 border-b border-cream-light/30">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex-1 min-w-0">
            <!-- Numéro de commande -->
            <h3 
              :class="[
                'font-bold truncate',
                size === 'sm' ? 'text-base' : 'text-lg',
                'text-forest-green group-hover:text-forest-green-dark transition-colors duration-300'
              ]"
            >
              {{ order.id }}
            </h3>
            
            <!-- Date et heure -->
            <div class="flex items-center gap-2 mt-1">
              <i class="far fa-clock text-nature-gray/60 text-xs"></i>
              <span class="text-sm text-nature-gray">{{ formattedDate }}</span>
              <span 
                v-if="showTime && order.time"
                class="text-sm text-nature-gray/70"
              >
                • {{ order.time }}
              </span>
            </div>
          </div>

          <!-- Badge de statut -->
          <div class="flex-shrink-0">
            <OrderStatusBadge 
              :status="order.status"
              :size="getBadgeSize(size)"
              :variant="badgeVariant"
              :show-icon="showStatusIcon"
              :animate-icon="hovered && animateStatusIcon"
              :clickable="false"
            />
          </div>
        </div>

        <!-- Producteur -->
        <div v-if="showProducer" class="mt-3">
          <div class="flex items-center gap-3">
            <!-- Avatar du producteur -->
            <div 
              v-if="showProducerAvatar"
              :class="[
                'flex-shrink-0 overflow-hidden border-2 border-white shadow-sm',
                size === 'sm' ? 'w-8 h-8' : 'w-10 h-10',
                getAvatarRounded(order.producer?.type)
              ]"
            >
              <img 
                v-if="order.producer?.avatar"
                :src="order.producer.avatar"
                :alt="order.producer.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              />
              <div 
                v-else
                :class="[
                  'w-full h-full flex items-center justify-center',
                  getProducerAvatarFallback(order.producer?.type)
                ]"
              >
                <i class="fas fa-user text-white text-xs"></i>
              </div>
            </div>

            <!-- Informations du producteur -->
            <div class="flex-1 min-w-0">
              <p 
                :class="[
                  'font-medium truncate',
                  size === 'sm' ? 'text-sm' : 'text-base',
                  'text-forest-green'
                ]"
              >
                {{ order.producer.name }}
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <p class="text-xs text-nature-gray truncate">
                  <i class="fas fa-map-marker-alt mr-1"></i>
                  {{ order.producer.location }}
                </p>
                
                <!-- Tag du producteur -->
                <span 
                  v-if="order.producer?.type && showProducerType"
                  :class="[
                    'px-2 py-0.5 text-xs rounded-full truncate',
                    getProducerTagClass(order.producer.type)
                  ]"
                >
                  {{ order.producer.type }}
                </span>
              </div>
            </div>

            <!-- Bouton contact rapide -->
            <button 
              v-if="showQuickContact && !compact"
              @click.stop="handleContactProducer"
              class="flex-shrink-0 p-2 text-soft-green hover:text-forest-green hover:bg-cream-light/50 rounded-lg transition-all duration-300"
              :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              :title="`Contacter ${order.producer.name}`"
            >
              <i class="fas fa-comment text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Contenu principal -->
      <div class="flex-1 p-4 sm:p-5">
        <!-- Produits -->
        <div v-if="showProducts && order.items?.length > 0" class="mb-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-nature-gray">
              <i class="fas fa-shopping-basket mr-2"></i>
              Produits
            </h4>
            <span class="text-xs text-nature-gray">
              {{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Liste des produits -->
          <div class="space-y-2">
            <div 
              v-for="(item, index) in visibleItems"
              :key="item.id"
              :data-index="index"
              :class="[
                'flex items-center gap-3 p-2 rounded-lg transition-all duration-300',
                'hover:bg-cream-light/50 group/item',
                { 'animate-fade-in-up': animateItems }
              ]"
              :style="{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                animationDelay: index * 50 + 'ms'
              }"
            >
              <!-- Image du produit -->
              <div 
                v-if="showProductImages"
                :class="[
                  'flex-shrink-0 overflow-hidden border border-cream-light',
                  size === 'sm' ? 'w-10 h-10' : 'w-12 h-12',
                  getProductImageRounded(item)
                ]"
              >
                <img 
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  @error="handleImageError"
                />
                <div 
                  v-if="item.quantity && showProductQuantity"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-forest-green text-white rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {{ item.quantity }}
                </div>
              </div>

              <!-- Détails du produit -->
              <div class="flex-1 min-w-0">
                <p class="font-medium text-forest-green truncate text-sm">
                  {{ item.name }}
                </p>
                <div class="flex items-center justify-between mt-1">
                  <div class="flex items-center gap-2">
                    <!-- Tags du produit -->
                    <span 
                      v-if="item.tags && showProductTags"
                      v-for="tag in visibleTags(item)"
                      :key="tag"
                      :class="[
                        'px-1.5 py-0.5 text-xs rounded-full truncate',
                        getProductTagClass(tag)
                      ]"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <span 
                    v-if="showProductPrices"
                    class="font-medium text-forest-green text-sm"
                  >
                    {{ formatPrice(item.price * (item.quantity || 1)) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Voir plus de produits -->
            <div 
              v-if="hasMoreItems && showViewMore"
              class="text-center pt-2"
            >
              <button 
                @click.stop="toggleShowAllItems"
                class="text-xs text-soft-green hover:text-forest-green transition-colors duration-300"
              >
                <i class="fas fa-plus mr-1"></i>
                Voir les {{ order.items.length - maxVisibleItems }} autres produits
              </button>
            </div>
          </div>
        </div>

        <!-- Détails supplémentaires -->
        <div 
          v-if="showAdditionalDetails && (order.deliveryType || order.paymentMethod)"
          class="mb-4"
        >
          <div class="grid grid-cols-2 gap-3">
            <!-- Type de livraison -->
            <div 
              v-if="order.deliveryType"
              class="flex items-center gap-2 p-2 bg-cream-light/30 rounded-lg"
            >
              <div class="w-8 h-8 rounded-full bg-cream-light flex items-center justify-center">
                <i class="fas fa-truck text-forest-green/70 text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-nature-gray">Livraison</p>
                <p class="text-sm font-medium text-forest-green">{{ order.deliveryType }}</p>
              </div>
            </div>

            <!-- Méthode de paiement -->
            <div 
              v-if="order.paymentMethod"
              class="flex items-center gap-2 p-2 bg-cream-light/30 rounded-lg"
            >
              <div class="w-8 h-8 rounded-full bg-cream-light flex items-center justify-center">
                <i class="fas fa-credit-card text-forest-green/70 text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-nature-gray">Paiement</p>
                <p class="text-sm font-medium text-forest-green">{{ order.paymentMethod }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations de livraison -->
        <div 
          v-if="showDeliveryInfo && order.deliveryInfo"
          class="mb-4 p-3 bg-gradient-to-r from-cream-light/30 to-white/30 rounded-lg"
        >
          <div class="flex items-center gap-2 mb-1">
            <i class="fas fa-shipping-fast text-road-green text-sm"></i>
            <span class="text-xs font-medium text-forest-green">Livraison</span>
          </div>
          <p class="text-sm text-nature-gray">{{ order.deliveryInfo }}</p>
        </div>
      </div>

      <!-- Pied de carte -->
      <footer class="p-4 sm:p-5 border-t border-cream-light/30">
        <!-- Total et actions -->
        <div class="flex items-center justify-between">
          <!-- Total -->
          <div>
            <p class="text-sm text-nature-gray">Total</p>
            <p 
              :class="[
                'font-bold',
                size === 'sm' ? 'text-lg' : 'text-xl',
                'text-forest-green'
              ]"
            >
              {{ formatPrice(order.total) }}
            </p>
          </div>

          <!-- Actions -->
          <div 
            v-if="showActions"
            class="flex items-center gap-2"
            :class="{ 'opacity-0 group-hover:opacity-100 transition-opacity duration-300': hideActionsOnHover }"
          >
            <!-- Action principale -->
            <button 
              v-if="primaryAction"
              @click.stop="handlePrimaryAction"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-500',
                'transform hover:scale-105',
                getPrimaryActionClass(order.status)
              ]"
              :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
            >
              <span class="flex items-center gap-2">
                {{ primaryAction.text }}
                <i 
                  v-if="primaryAction.icon"
                  :class="[primaryAction.icon, 'group-hover/action:translate-x-1 transition-transform duration-300']"
                ></i>
              </span>
            </button>

            <!-- Actions secondaires -->
            <template v-if="secondaryActions?.length > 0 && !compact">
              <button 
                v-for="action in visibleSecondaryActions"
                :key="action.id"
                @click.stop="handleSecondaryAction(action)"
                :class="[
                  'p-2 rounded-lg transition-all duration-300',
                  'hover:bg-cream-light hover:text-forest-green',
                  action.class
                ]"
                :title="action.title"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <i :class="action.icon"></i>
              </button>
            </template>

            <!-- Menu déroulant pour actions supplémentaires -->
            <div 
              v-if="hasMoreActions"
              class="relative"
              @click.stop
            >
              <button 
                @click="toggleActionsMenu"
                class="p-2 rounded-lg hover:bg-cream-light hover:text-forest-green transition-all duration-300"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              >
                <i class="fas fa-ellipsis-h"></i>
              </button>
              
              <!-- Menu d'actions -->
              <div 
                v-if="showActionsMenu"
                v-click-outside="closeActionsMenu"
                class="absolute right-0 bottom-full mb-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-cream-light overflow-hidden animate-dropdown"
              >
                <div class="py-1">
                  <button 
                    v-for="action in hiddenSecondaryActions"
                    :key="action.id"
                    @click="handleSecondaryAction(action); closeActionsMenu()"
                    class="w-full px-4 py-2 text-left text-sm text-nature-gray hover:text-forest-green hover:bg-cream-light/50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <i :class="[action.icon, 'text-nature-gray/60']"></i>
                    {{ action.title }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline de progression (mini) -->
        <div 
          v-if="showTimeline && order.timeline"
          class="mt-4 pt-4 border-t border-cream-light/30"
        >
          <div class="text-xs text-nature-gray mb-2">Progression</div>
          <div class="flex items-center justify-between">
            <div 
              v-for="step in timelineSteps"
              :key="step.id"
              class="flex flex-col items-center flex-1"
            >
              <div 
                :class="[
                  'w-3 h-3 rounded-full mb-1 transition-all duration-500',
                  step.completed ? 'bg-success-dark scale-110' : 'bg-cream-light',
                  { 'animate-pulse-slow': step.current }
                ]"
                :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
              ></div>
              <span class="text-xs text-nature-gray/70 truncate w-full text-center">
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Indicateur de bordure animée -->
    <div 
      v-if="showAnimatedBorder"
      class="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden"
    >
      <div 
        :class="[
          'absolute inset-0 border-2 rounded-inherit transition-all duration-700',
          'border-transparent',
          { 'border-soft-green/30': hovered }
        ]"
        :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
      ></div>
    </div>
  </article>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import OrderStatusBadge from './OrderStatusBadge.vue'

export default {
  name: 'OrderCard',
  
  components: {
    OrderStatusBadge
  },
  
  props: {
    order: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && value.id && value.status
      }
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'compact', 'detailed', 'minimal'].includes(value)
    },
    badgeVariant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'outline', 'soft', 'pill'].includes(value)
    },
    clickable: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    showBackgroundEffect: {
      type: Boolean,
      default: true
    },
    showFiligree: {
      type: Boolean,
      default: true
    },
    showFloatingElement: {
      type: Boolean,
      default: true
    },
    showProducer: {
      type: Boolean,
      default: true
    },
    showProducerAvatar: {
      type: Boolean,
      default: true
    },
    showProducerType: {
      type: Boolean,
      default: true
    },
    showQuickContact: {
      type: Boolean,
      default: true
    },
    showProducts: {
      type: Boolean,
      default: true
    },
    showProductImages: {
      type: Boolean,
      default: true
    },
    showProductQuantity: {
      type: Boolean,
      default: true
    },
    showProductTags: {
      type: Boolean,
      default: true
    },
    showProductPrices: {
      type: Boolean,
      default: true
    },
    showAdditionalDetails: {
      type: Boolean,
      default: true
    },
    showDeliveryInfo: {
      type: Boolean,
      default: true
    },
    showTime: {
      type: Boolean,
      default: true
    },
    showStatusIcon: {
      type: Boolean,
      default: true
    },
    showActions: {
      type: Boolean,
      default: true
    },
    showTimeline: {
      type: Boolean,
      default: true
    },
    showAnimatedBorder: {
      type: Boolean,
      default: true
    },
    hideActionsOnHover: {
      type: Boolean,
      default: false
    },
    animateStatusIcon: {
      type: Boolean,
      default: true
    },
    animateItems: {
      type: Boolean,
      default: true
    },
    maxVisibleItems: {
      type: Number,
      default: 3
    },
    maxVisibleTags: {
      type: Number,
      default: 2
    },
    maxVisibleActions: {
      type: Number,
      default: 2
    },
    primaryAction: {
      type: Object,
      default: () => ({
        text: 'Voir détails',
        icon: 'fas fa-arrow-right',
        handler: null
      })
    },
    secondaryActions: {
      type: Array,
      default: () => [
        { id: 'reorder', title: 'Recommander', icon: 'fas fa-redo', handler: null, class: '' },
        { id: 'invoice', title: 'Facture', icon: 'fas fa-file-invoice', handler: null, class: '' },
        { id: 'contact', title: 'Contacter', icon: 'fas fa-comment', handler: null, class: '' },
        { id: 'track', title: 'Suivre', icon: 'fas fa-truck', handler: null, class: '' }
      ]
    },
    customStyles: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: [
    'click',
    'mouseenter',
    'mouseleave',
    'primary-action',
    'secondary-action',
    'contact-producer',
    'show-all-items',
    'image-error'
  ],
  
  setup(props, { emit }) {
    // États réactifs
    const hovered = ref(false)
    const showAllItems = ref(false)
    const showActionsMenu = ref(false)
    const filigreePattern = ref(`
      <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,20 L100,20 L100,100 L20,100 Z" fill="none" stroke="#2E7D32" stroke-width="0.3" stroke-opacity="0.05"/>
        <circle cx="30" cy="30" r="2" fill="#2E7D32" fill-opacity="0.03"/>
        <circle cx="90" cy="30" r="2" fill="#2E7D32" fill-opacity="0.03"/>
        <circle cx="30" cy="90" r="2" fill="#2E7D32" fill-opacity="0.03"/>
        <circle cx="90" cy="90" r="2" fill="#2E7D32" fill-opacity="0.03"/>
      </svg>
    `)
    
    // Computed properties
    const filigreeStyle = computed(() => ({
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(filigreePattern.value)}")`,
      backgroundSize: '120px 120px'
    }))
    
    const compact = computed(() => props.variant === 'compact' || props.variant === 'minimal')
    const detailed = computed(() => props.variant === 'detailed')
    
    const sizeClasses = computed(() => {
      const classes = {
        sm: 'text-sm',
        md: '',
        lg: 'text-base'
      }
      return classes[props.size] || ''
    })
    
    const variantClasses = computed(() => {
      const classes = {
        default: 'bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md',
        compact: 'bg-white/90 backdrop-blur-sm shadow-xs',
        detailed: 'bg-white/70 backdrop-blur-md shadow-md hover:shadow-lg',
        minimal: 'bg-transparent shadow-none border border-cream-light/50'
      }
      return classes[props.variant] || classes.default
    })
    
    const roundedClasses = computed(() => {
      if (props.variant === 'minimal') return 'rounded-xl'
      return 'rounded-2xl'
    })
    
    const formattedDate = computed(() => {
      if (!props.order.date) return ''
      
      if (typeof props.order.date === 'string') {
        const date = new Date(props.order.date)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }
      }
      
      return props.order.date
    })
    
    const getBadgeSize = (size) => {
      const sizes = { sm: 'xs', md: 'sm', lg: 'md' }
      return sizes[size] || 'sm'
    }
    
    const visibleItems = computed(() => {
      if (showAllItems.value || !props.maxVisibleItems) {
        return props.order.items || []
      }
      return (props.order.items || []).slice(0, props.maxVisibleItems)
    })
    
    const hasMoreItems = computed(() => {
      return props.order.items && props.order.items.length > props.maxVisibleItems
    })
    
    const showViewMore = computed(() => {
      return hasMoreItems.value && !showAllItems.value
    })
    
    const visibleSecondaryActions = computed(() => {
      if (!props.secondaryActions) return []
      return props.secondaryActions.slice(0, props.maxVisibleActions)
    })
    
    const hiddenSecondaryActions = computed(() => {
      if (!props.secondaryActions) return []
      return props.secondaryActions.slice(props.maxVisibleActions)
    })
    
    const hasMoreActions = computed(() => {
      return hiddenSecondaryActions.value.length > 0
    })
    
    const timelineSteps = computed(() => {
      if (!props.order.timeline) return []
      
      const steps = [
        { id: 'ordered', label: 'Commandée', completed: props.order.timeline.ordered, current: false },
        { id: 'confirmed', label: 'Confirmée', completed: props.order.timeline.confirmed, current: false },
        { id: 'prepared', label: 'Préparée', completed: props.order.timeline.prepared, current: false },
        { id: 'delivered', label: 'Livrée', completed: props.order.timeline.delivered, current: false }
      ]
      
      // Trouver l'étape actuelle
      const currentIndex = steps.findIndex(step => !step.completed)
      if (currentIndex >= 0) {
        steps[currentIndex].current = true
      }
      
      return steps
    })
    
    // Méthodes de style
    const getBackgroundEffect = (status) => {
      const effects = {
        pending: 'bg-gradient-to-br from-warning-light/20 to-warning-lighter/10',
        preparing: 'bg-gradient-to-br from-info-light/20 to-info-lighter/10',
        delivered: 'bg-gradient-to-br from-success-light/20 to-success-lighter/10',
        cancelled: 'bg-gradient-to-br from-error-light/20 to-error-lighter/10'
      }
      return effects[status] || 'bg-gradient-to-br from-cream-light/20 to-white/10'
    }
    
    const getFloatingElementPosition = (size) => {
      const positions = {
        sm: '-top-3 -right-3 w-12 h-12',
        md: '-top-4 -right-4 w-16 h-16',
        lg: '-top-5 -right-5 w-20 h-20'
      }
      return positions[size] || positions.md
    }
    
    const getFloatingElementColor = (status) => {
      const colors = {
        pending: 'text-warning-dark',
        preparing: 'text-info-dark',
        delivered: 'text-success-dark',
        cancelled: 'text-error-dark'
      }
      return colors[status] || 'text-forest-green'
    }
    
    const getFloatingElementShape = (status) => {
      const shapes = {
        pending: 'M20,50 Q50,20 80,50 Q50,80 20,50 Z',
        preparing: 'M20,20 L80,20 L80,80 L20,80 Z',
        delivered: 'M10,50 L40,80 L90,30 L80,20 L40,60 L20,40 Z',
        cancelled: 'M20,20 L80,80 M80,20 L20,80'
      }
      return shapes[status] || 'M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10 Z'
    }
    
    const getAvatarRounded = (type) => {
      if (type === 'Artisanal') return 'rounded-lg'
      if (type === 'Bio') return 'rounded-full'
      return 'rounded-xl'
    }
    
    const getProducerAvatarFallback = (type) => {
      const classes = {
        Bio: 'bg-bio-tag',
        Artisanal: 'bg-artisanal-tag',
        Local: 'bg-local-tag',
        default: 'bg-soft-green'
      }
      return classes[type] || classes.default
    }
    
    const getProducerTagClass = (type) => {
      const classes = {
        Bio: 'bg-bio-tag/10 text-bio-tag',
        Artisanal: 'bg-artisanal-tag/10 text-artisanal-tag',
        Local: 'bg-local-tag/10 text-local-tag',
        Seasonal: 'bg-seasonal-tag/10 text-seasonal-tag'
      }
      return classes[type] || 'bg-cream-light text-nature-gray'
    }
    
    const getProductImageRounded = (item) => {
      if (item.tags?.includes('Bio')) return 'rounded-full'
      if (item.tags?.includes('Fragile')) return 'rounded-lg'
      return 'rounded-xl'
    }
    
    const visibleTags = (item) => {
      if (!item.tags || !props.showProductTags) return []
      return item.tags.slice(0, props.maxVisibleTags)
    }
    
    const getProductTagClass = (tag) => {
      const classes = {
        Bio: 'bg-bio-tag/10 text-bio-tag',
        Local: 'bg-local-tag/10 text-local-tag',
        Seasonal: 'bg-seasonal-tag/10 text-seasonal-tag',
        'Nouveau': 'bg-nouveau-tag/10 text-nouveau-tag',
        Fragile: 'bg-fragile-tag/10 text-fragile-tag'
      }
      return classes[tag] || 'bg-cream-light text-nature-gray'
    }
    
    const getPrimaryActionClass = (status) => {
      const classes = {
        pending: 'bg-warning-light text-warning-dark hover:bg-warning-light/80',
        preparing: 'bg-info-light text-info-dark hover:bg-info-light/80',
        delivered: 'bg-soft-green text-white hover:bg-forest-green',
        cancelled: 'bg-error-light text-error-dark hover:bg-error-light/80'
      }
      return classes[status] || 'bg-soft-green text-white hover:bg-forest-green'
    }
    
    // Méthodes utilitaires
    const formatPrice = (price) => {
      if (typeof price !== 'number') return price
      return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0
      }).format(price)
    }
    
    // Gestionnaires d'événements
    const handleClick = () => {
      if (props.clickable) {
        emit('click', props.order)
      }
    }
    
    const handleMouseEnter = () => {
      hovered.value = true
      emit('mouseenter', props.order)
    }
    
    const handleMouseLeave = () => {
      hovered.value = false
      emit('mouseleave', props.order)
    }
    
    const handlePrimaryAction = () => {
      if (props.primaryAction?.handler) {
        props.primaryAction.handler(props.order)
      }
      emit('primary-action', props.order)
    }
    
    const handleSecondaryAction = (action) => {
      if (action.handler) {
        action.handler(props.order)
      }
      emit('secondary-action', { action: action.id, order: props.order })
    }
    
    const handleContactProducer = () => {
      emit('contact-producer', props.order)
    }
    
    const toggleShowAllItems = () => {
      showAllItems.value = !showAllItems.value
      if (showAllItems.value) {
        emit('show-all-items', props.order)
      }
    }
    
    const handleImageError = (event) => {
      emit('image-error', { order: props.order, event })
      // Fallback image
      event.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#FFF8E1"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="#A5D6A7" fill-opacity="0.3"/>
          <path d="M40,40 L60,40 L60,60 L40,60 Z" fill="#2E7D32" fill-opacity="0.1"/>
          <circle cx="50" cy="50" r="15" fill="#2E7D32" fill-opacity="0.05"/>
        </svg>
      `)
    }
    
    const toggleActionsMenu = () => {
      showActionsMenu.value = !showActionsMenu.value
    }
    
    const closeActionsMenu = () => {
      showActionsMenu.value = false
    }
    
    // Watchers
    watch(() => props.order, () => {
      showAllItems.value = false
    })
    
    // Lifecycle
    onMounted(() => {
      // Initialiser les animations si nécessaire
    })
    
    return {
      hovered,
      showAllItems,
      showActionsMenu,
      filigreePattern,
      filigreeStyle,
      compact,
      detailed,
      sizeClasses,
      variantClasses,
      roundedClasses,
      formattedDate,
      getBadgeSize,
      visibleItems,
      hasMoreItems,
      showViewMore,
      visibleSecondaryActions,
      hiddenSecondaryActions,
      hasMoreActions,
      timelineSteps,
      getBackgroundEffect,
      getFloatingElementPosition,
      getFloatingElementColor,
      getFloatingElementShape,
      getAvatarRounded,
      getProducerAvatarFallback,
      getProducerTagClass,
      getProductImageRounded,
      visibleTags,
      getProductTagClass,
      getPrimaryActionClass,
      formatPrice,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handlePrimaryAction,
      handleSecondaryAction,
      handleContactProducer,
      toggleShowAllItems,
      handleImageError,
      toggleActionsMenu,
      closeActionsMenu
    }
  }
}
</script>

<style scoped>
.order-card {
  --rounded-inherit: inherit;
}

.rounded-inherit {
  border-radius: var(--rounded-inherit);
}

/* Animations CSS personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
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
    transform: scale(1.02);
  }
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-dropdown {
  animation: dropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Styles spécifiques pour les couleurs */
:deep() {
  .bg-forest-green { background-color: #2E7D32; }
  .text-forest-green { color: #2E7D32; }
  .text-forest-green-dark { color: #1B5E20; }
  .bg-soft-green { background-color: #A5D6A7; }
  .text-soft-green { color: #A5D6A7; }
  .bg-cream-light { background-color: #FFF8E1; }
  .text-cream-light { color: #FFF8E1; }
  .text-nature-gray { color: #666; }
  .bg-road-green { background-color: #4CAF50; }
  
  /* Status colors */
  .bg-success-light { background-color: #C8E6C9; }
  .text-success-dark { color: #2E7D32; }
  .bg-warning-light { background-color: #FFF3E0; }
  .text-warning-dark { color: #F57F17; }
  .bg-warning-lighter { background-color: #FFE0B2; }
  .bg-info-light { background-color: #B3E5FC; }
  .text-info-dark { color: #0288D1; }
  .bg-info-lighter { background-color: #81D4FA; }
  .bg-error-light { background-color: #FFCDD2; }
  .text-error-dark { color: #C62828; }
  .bg-error-lighter { background-color: #EF9A9A; }
  
  /* Tags colors */
  .bg-bio-tag { background-color: #4CAF50; }
  .text-bio-tag { color: #4CAF50; }
  .bg-artisanal-tag { background-color: #FF9800; }
  .text-artisanal-tag { color: #FF9800; }
  .bg-local-tag { background-color: #2196F3; }
  .text-local-tag { color: #2196F3; }
  .bg-seasonal-tag { background-color: #9C27B0; }
  .text-seasonal-tag { color: #9C27B0; }
  .bg-nouveau-tag { background-color: #E91E63; }
  .text-nouveau-tag { color: #E91E63; }
  .bg-fragile-tag { background-color: #795548; }
  .text-fragile-tag { color: #795548; }
}

/* Transition group pour les items */
.item-enter-active,
.item-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-enter-from,
.item-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>

