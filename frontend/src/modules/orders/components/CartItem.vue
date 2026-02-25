<template>
  <div 
    class="cart-item relative group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg hover:shadow-xl border border-green-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-500 ease-out-expo"
    :style="{ animationDelay: `${animationDelay}s` }"
  >
    <!-- Effet de halo au survol -->
    <div class="absolute -inset-2 bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
    
    <!-- Indicateur de fraîcheur -->
    <div class="absolute top-4 left-4 z-10">
      <div class="relative">
        <div class="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-70 animate-pulse-slow"></div>
        <div class="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Frais
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="relative p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-6">
        <!-- Image produit avec effet organique -->
        <div class="relative flex-shrink-0">
          <div class="absolute -inset-3 bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
          
          <div 
            class="relative w-32 h-32 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden border-2 border-white shadow-inner group-hover:shadow-lg transition-all duration-500 ease-out-expo"
            @click="zoomImage"
          >
            <img 
              v-if="item.product?.images?.[0]" 
              :src="item.product.images[0]" 
              :alt="item.product.name"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out-expo"
              loading="lazy"
            />
            <div 
              v-else 
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100/50 to-emerald-100/50"
            >
              <svg class="w-16 h-16 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            
            <!-- Overlay de fraîcheur -->
            <div class="absolute inset-0 bg-gradient-to-t from-green-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <!-- Badge quantité sur image -->
          <div class="absolute -bottom-2 -right-2">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur opacity-50"></div>
              <div class="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                ×{{ item.quantity }}
              </div>
            </div>
          </div>
        </div>

        <!-- Informations produit -->
        <div class="flex-grow">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <!-- Titre et détails -->
            <div class="flex-grow">
              <div class="flex items-start justify-between">
                <div>
                  <h3 
                    class="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300 cursor-pointer"
                    @click="viewProduct"
                  >
                    {{ item.product?.name || 'Produit' }}
                  </h3>
                  
                  <!-- Variante -->
                  <div v-if="item.variant" class="mt-1">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {{ item.variant.name }}
                    </span>
                  </div>

                  <!-- Tags de provenance -->
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Producteur local
                    </span>
                    
                    <span v-if="item.product?.category" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {{ item.product.category }}
                    </span>
                    
                    <span v-if="item.product?.unit" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      {{ item.product.unit }}
                    </span>
                  </div>

                  <!-- Description rapide -->
                  <div v-if="(item.product as any)?.description !== undefined && (item.product as any)?.description !== ''" class="mt-3">
                    <p class="text-sm text-gray-600 line-clamp-2">
                      {{ truncateDescription((item.product as any).description || '') }}
                    </p>
                  </div>
                </div>

                <!-- Prix unitaire -->
                <div class="text-right ml-4">
                  <div class="text-lg font-semibold text-gray-500">Prix unitaire</div>
                  <div class="text-2xl font-bold text-green-800 mt-1">
                    {{ formatAmount(item.unitPrice) }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">TTC</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contrôles et actions -->
          <div class="mt-6 pt-6 border-t border-green-100">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <!-- Contrôle de quantité -->
              <div class="flex items-center space-x-4">
                <div class="text-sm font-medium text-gray-700">Quantité :</div>
                
                <div class="flex items-center bg-gradient-to-b from-green-50 to-emerald-50 rounded-xl p-1 shadow-inner">
                  <button 
                    @click="decreaseQuantity"
                    :disabled="item.quantity <= 1"
                    class="relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out-expo group/btn"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></div>
                    <svg class="relative w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <div class="relative mx-3">
                    <input 
                      type="number" 
                      v-model.number="localQuantity"
                      @change="handleQuantityChange"
                      @blur="validateQuantity"
                      min="1" 
                      max="99"
                      class="w-16 text-center bg-transparent text-lg font-semibold text-gray-800 focus:outline-none focus:ring-0"
                    />
                    <div class="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out-expo"></div>
                  </div>
                  
                  <button 
                    @click="increaseQuantity"
                    class="relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-green-700 transition-all duration-300 ease-out-expo group/btn"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></div>
                    <svg class="relative w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <!-- Indicateur de disponibilité -->
                <div v-if="showStockIndicator" class="flex items-center">
                  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                  <span class="text-xs text-green-700 font-medium">En stock</span>
                </div>
              </div>

              <!-- Sous-total et actions -->
              <div class="flex items-center space-x-6">
                <!-- Calcul du sous-total -->
                <div class="text-right">
                  <div class="text-sm text-gray-500 mb-1">Sous-total</div>
                  <div class="text-2xl font-bold text-green-800">
                    {{ formatAmount(item.subtotal) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ item.quantity }} × {{ formatAmount(item.unitPrice) }}
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex items-center space-x-2">
                  <!-- Bouton favori -->
                  <button 
                    @click="toggleFavorite"
                    class="relative p-2 rounded-full hover:bg-amber-50 transition-colors duration-300 group/fav"
                    :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full blur opacity-0 group-hover/fav:opacity-30 transition-opacity duration-300"></div>
                    <svg 
                      class="relative w-5 h-5 transition-all duration-300 ease-out-expo" 
                      :class="isFavorite ? 'text-amber-500 fill-amber-500' : 'text-amber-400 hover:text-amber-500'"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        :stroke-width="isFavorite ? '2.5' : '1.5'"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                      />
                    </svg>
                  </button>

                  <!-- Bouton suppression -->
                  <button 
                    @click="removeItem"
                    class="relative p-2 rounded-full hover:bg-red-50 transition-colors duration-300 group/remove"
                    title="Retirer du panier"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-red-200 to-red-300 rounded-full blur opacity-0 group-hover/remove:opacity-30 transition-opacity duration-300"></div>
                    <svg class="relative w-5 h-5 text-red-500 group-hover/remove:text-red-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de fraîcheur animée -->
    <div class="px-6 pb-6">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="text-gray-600">Fraîcheur garantie jusqu'au</span>
        <span class="font-medium text-green-700">{{ formatFreshnessDate() }}</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-amber-400 rounded-full animate-freshness-bar"
          :style="{ width: `${freshnessPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Modal zoom image (simplifié) -->
    <transition name="modal-fade">
      <div 
        v-if="showImageModal" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        @click.self="showImageModal = false"
      >
        <div class="relative max-w-4xl max-h-[90vh]">
          <button 
            @click="showImageModal = false"
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-300"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            v-if="item.product?.images?.[0]" 
            :src="item.product.images[0]" 
            :alt="item.product.name"
            class="rounded-2xl shadow-2xl max-w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CartItem as CartItemType } from '../types/orders.types'

interface Props {
  item: CartItemType
  animationDelay?: number
  showStockIndicator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animationDelay: 0,
  showStockIndicator: true
})

const emit = defineEmits<{
  'update-quantity': [quantity: number]
  'remove': []
  'view-product': []
}>()

// État local
const localQuantity = ref(props.item.quantity)
const isFavorite = ref(false)
const showImageModal = ref(false)

// Calculs
const freshnessPercentage = computed(() => {
  // Simule la fraîcheur (100% pour aujourd'hui, décroît avec le temps)
  return Math.max(70, 100 - (props.item.quantity * 2))
})

// Formattage
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatFreshnessDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 3) // 3 jours de fraîcheur
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit'
  })
}

const truncateDescription = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Actions
const decreaseQuantity = () => {
  if (localQuantity.value > 1) {
    localQuantity.value--
    emit('update-quantity', localQuantity.value)
  }
}

const increaseQuantity = () => {
  if (localQuantity.value < 99) {
    localQuantity.value++
    emit('update-quantity', localQuantity.value)
  }
}

const handleQuantityChange = () => {
  if (localQuantity.value < 1) localQuantity.value = 1
  if (localQuantity.value > 99) localQuantity.value = 99
  emit('update-quantity', localQuantity.value)
}

const validateQuantity = () => {
  if (localQuantity.value < 1) {
    localQuantity.value = 1
    emit('update-quantity', localQuantity.value)
  }
}

const removeItem = () => {
  emit('remove')
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // Ici, vous pourriez appeler une API pour sauvegarder l'état favori
}

const zoomImage = () => {
  if (props.item.product?.images?.[0]) {
    showImageModal.value = true
  }
}

const viewProduct = () => {
  emit('view-product')
}

// Watch pour synchroniser avec les props
watch(() => props.item.quantity, (newQuantity) => {
  localQuantity.value = newQuantity
})
</script>

<style scoped>
/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulseSlow {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

@keyframes freshnessBar {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Classes d'animation */
.cart-item {
  animation: fadeInUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  opacity: 0;
  animation-fill-mode: forwards;
}

.animate-pulse-slow {
  animation: pulseSlow 2s ease-in-out infinite;
}

.animate-freshness-bar {
  background-size: 200% 200%;
  animation: freshnessBar 3s ease infinite;
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
  transform: scale(0.95);
}

/* Clamp pour texte multiligne */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Optimisation des performances */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Scrollbar personnalisée pour input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 0;
  height: 0;
}

input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Effet de focus personnalisé */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Effet de hover pour les boutons */
button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out-expo;
}
</style>
