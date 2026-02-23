<template>
  <div class="variant-selector-container">
    <!-- Background organique avec texture de marché -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-amber-50/30 to-emerald-100/30 rounded-3xl z-0">
      <div class="absolute inset-0 opacity-5 z-0" 
           :style="{ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(selectorPattern)}')` }">
      </div>
    </div>

    <div class="relative z-10">
      <!-- En-tête du sélecteur -->
      <div class="mb-6">
        <div class="flex items-center space-x-3 mb-3">
          <div class="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-amber-100 shadow-sm">
            <PackageIcon class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 class="text-lg font-bold bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
              Choisissez votre variante
            </h3>
            <p class="text-sm text-amber-700/60">
              Sélectionnez la version qui correspond à vos besoins
            </p>
          </div>
        </div>

        <!-- Indicateur de sélection -->
        <Transition
          enter-active-class="transition-all duration-500 ease-organic"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-organic"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="selectedVariant" class="mb-4">
            <div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-amber-100 rounded-xl border border-emerald-300/50">
              <CheckCircleIcon class="w-4 h-4 text-emerald-600 mr-2" />
              <span class="text-sm font-medium text-emerald-800">
                Sélectionné : <strong>{{ selectedVariant.name }}</strong>
                <span v-if="selectedVariant.price_modifier !== 0" class="ml-2" :class="priceModifierClass(selectedVariant)">
                  {{ formatPriceModifier(selectedVariant.price_modifier) }}
                </span>
              </span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Mode d'affichage -->
      <div class="mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-emerald-800">
              {{ availableVariants.length }} option(s) disponible(s)
            </span>
            <span v-if="defaultVariant" class="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
              ✨ Recommandée
            </span>
          </div>

          <!-- Toggle de vue -->
          <div class="flex items-center space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-emerald-200/50">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded-lg transition-all duration-300 ease-organic"
              :class="viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-emerald-600 hover:bg-emerald-50'"
              title="Vue grille"
            >
              <LayoutGridIcon class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-1.5 rounded-lg transition-all duration-300 ease-organic"
              :class="viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-emerald-600 hover:bg-emerald-50'"
              title="Vue liste"
            >
              <ListIcon class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'cards'"
              class="p-1.5 rounded-lg transition-all duration-300 ease-organic"
              :class="viewMode === 'cards' ? 'bg-emerald-500 text-white' : 'text-emerald-600 hover:bg-emerald-50'"
              title="Vue cartes"
            >
              <LayoutDashboardIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Conteneur des variantes -->
      <Transition
        :name="`view-${viewMode}`"
        mode="out-in"
      >
        <div
          :key="viewMode"
          class="variants-container"
          :class="[
            `view-${viewMode}`,
            { 'has-selection': selectedVariant }
          ]"
        >
          <!-- Vue grille (par défaut) -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="variant in availableVariants"
              :key="variant.id || variant.tempId"
              class="variant-option group"
              :class="[
                'option-' + getVariantType(variant),
                { 
                  'selected': isSelected(variant),
                  'default': variant.is_default,
                  'unavailable': !isVariantAvailable(variant),
                  'best-value': isBestValue(variant)
                }
              ]"
              @click="selectVariant(variant)"
            >
              <div class="variant-card">
                <!-- En-tête de la carte -->
                <div class="card-header">
                  <!-- Badge par défaut -->
                  <div v-if="variant.is_default" class="default-badge">
                    <StarIcon class="w-3 h-3" />
                    Recommandée
                  </div>

                  <!-- Badge meilleur rapport -->
                  <div v-if="isBestValue(variant)" class="value-badge">
                    <TrendingUpIcon class="w-3 h-3" />
                    Meilleur rapport
                  </div>

                  <!-- Indicateur de sélection -->
                  <div class="selection-indicator" :class="{ 'selected': isSelected(variant) }">
                    <CheckIcon class="w-4 h-4" />
                  </div>
                </div>

                <!-- Contenu principal -->
                <div class="card-content">
                  <!-- Image ou icône -->
                  <div class="variant-image">
                    <div 
                      v-if="variant.color"
                      class="color-swatch"
                      :style="{ 
                        backgroundColor: variant.color,
                        borderColor: variant.color + '40'
                      }"
                      :title="variant.color_name || 'Couleur'"
                    ></div>
                    <div v-else class="variant-icon">
                      <PackageIcon class="w-8 h-8 text-emerald-500" />
                    </div>
                  </div>

                  <!-- Nom et détails -->
                  <div class="variant-details">
                    <h4 class="variant-name">
                      {{ variant.name }}
                    </h4>
                    
                    <div v-if="variant.sku" class="variant-sku">
                      {{ variant.sku }}
                    </div>

                    <div v-if="variant.weight" class="variant-weight">
                      <ScaleIcon class="w-3 h-3" />
                      {{ variant.weight }} {{ variant.weight_unit || 'g' }}
                    </div>
                  </div>

                  <!-- Prix -->
                  <div class="variant-price">
                    <div class="price-amount">
                      {{ formatPrice(calculateVariantPrice(variant)) }} FCFA
                    </div>
                    <div v-if="variant.price_modifier !== 0" class="price-modifier" :class="priceModifierClass(variant)">
                      {{ formatPriceModifier(variant.price_modifier) }}
                    </div>
                  </div>
                </div>

                <!-- Pied de carte -->
                <div class="card-footer">
                  <!-- Stock -->
                  <div class="variant-stock">
                    <div class="stock-info">
                      <PackageIcon class="w-3 h-3" />
                      <span :class="stockClass(variant)">
                        {{ variant.stock || 0 }} disponible(s)
                      </span>
                    </div>
                    <div class="stock-bar">
                      <div 
                        class="stock-level" 
                        :class="stockBarClass(variant)"
                        :style="{ width: `${stockPercentage(variant)}%` }"
                      ></div>
                    </div>
                  </div>

                  <!-- Bouton d'action -->
                  <div class="variant-action">
                    <button
                      class="action-button"
                      :class="{ 'selected': isSelected(variant) }"
                      :disabled="!isVariantAvailable(variant)"
                    >
                      <span v-if="isSelected(variant)">✓ Sélectionné</span>
                      <span v-else-if="!isVariantAvailable(variant)">Indisponible</span>
                      <span v-else>Sélectionner</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Effet de sélection -->
              <div class="selection-overlay"></div>
            </div>
          </div>

          <!-- Vue liste -->
          <div v-else-if="viewMode === 'list'" class="space-y-3">
            <div
              v-for="variant in availableVariants"
              :key="variant.id || variant.tempId"
              class="variant-list-item group"
              :class="[
                { 
                  'selected': isSelected(variant),
                  'default': variant.is_default,
                  'unavailable': !isVariantAvailable(variant)
                }
              ]"
              @click="selectVariant(variant)"
            >
              <div class="list-item-content">
                <!-- Sélection -->
                <div class="list-selection">
                  <div class="selection-circle" :class="{ 'selected': isSelected(variant) }">
                    <CheckIcon v-if="isSelected(variant)" class="w-3 h-3" />
                  </div>
                </div>

                <!-- Détails -->
                <div class="list-details">
                  <div class="flex items-center space-x-3">
                    <!-- Couleur -->
                    <div
                      v-if="variant.color"
                      class="color-indicator"
                      :style="{ backgroundColor: variant.color }"
                      :title="variant.color_name || 'Couleur'"
                    ></div>

                    <!-- Nom -->
                    <div class="flex-1">
                      <div class="flex items-center space-x-2">
                        <h4 class="list-name">
                          {{ variant.name }}
                        </h4>
                        <div v-if="variant.is_default" class="default-tag">
                          <StarIcon class="w-3 h-3" />
                          Recommandée
                        </div>
                      </div>
                      <div class="list-meta">
                        <span v-if="variant.sku" class="list-sku">
                          {{ variant.sku }}
                        </span>
                        <span v-if="variant.weight" class="list-weight">
                          <ScaleIcon class="w-3 h-3" />
                          {{ variant.weight }} {{ variant.weight_unit || 'g' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Prix -->
                <div class="list-price">
                  <div class="price-main">
                    {{ formatPrice(calculateVariantPrice(variant)) }} FCFA
                  </div>
                  <div v-if="variant.price_modifier !== 0" class="price-modifier" :class="priceModifierClass(variant)">
                    {{ formatPriceModifier(variant.price_modifier) }}
                  </div>
                </div>

                <!-- Stock -->
                <div class="list-stock">
                  <div class="stock-status" :class="stockClass(variant)">
                    <PackageIcon class="w-3 h-3" />
                    <span>{{ variant.stock || 0 }} unités</span>
                  </div>
                  <div class="stock-indicator">
                    <div class="stock-dots">
                      <div
                        v-for="i in 5"
                        :key="i"
                        class="stock-dot"
                        :class="{
                          'active': i <= stockDotCount(variant),
                          'low': stockDotCount(variant) <= 2
                        }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Action -->
                <div class="list-action">
                  <button
                    class="list-button"
                    :class="{ 'selected': isSelected(variant) }"
                    :disabled="!isVariantAvailable(variant)"
                  >
                    <span v-if="isSelected(variant)">
                      <CheckIcon class="w-4 h-4" />
                    </span>
                    <span v-else>
                      Choisir
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Vue cartes -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="variant in availableVariants"
              :key="variant.id || variant.tempId"
              class="variant-card-view group"
              :class="[
                { 
                  'selected': isSelected(variant),
                  'default': variant.is_default,
                  'unavailable': !isVariantAvailable(variant),
                  'premium': variant.price_modifier > 0
                }
              ]"
              @click="selectVariant(variant)"
            >
              <!-- Effet de lumière -->
              <div class="card-light-effect"></div>

              <div class="card-view-content">
                <!-- En-tête premium -->
                <div v-if="variant.price_modifier > 0" class="premium-header">
                  <CrownIcon class="w-4 h-4" />
                  <span>Option Premium</span>
                </div>

                <!-- Contenu principal -->
                <div class="card-view-main">
                  <!-- Image/icône -->
                  <div class="card-view-image">
                    <div class="image-container">
                      <div 
                        v-if="variant.color"
                        class="color-display"
                        :style="{ 
                          backgroundColor: variant.color,
                          boxShadow: `0 8px 32px ${variant.color}40`
                        }"
                      ></div>
                      <div v-else class="icon-display">
                        <PackageIcon class="w-12 h-12 text-emerald-500" />
                      </div>
                    </div>
                  </div>

                  <!-- Détails -->
                  <div class="card-view-details">
                    <div class="details-header">
                      <h4 class="card-view-name">
                        {{ variant.name }}
                      </h4>
                      <div v-if="variant.is_default" class="card-view-badge">
                        <StarIcon class="w-3 h-3" />
                        Par défaut
                      </div>
                    </div>

                    <div v-if="variant.description" class="card-view-description">
                      {{ variant.description }}
                    </div>

                    <div class="card-view-features">
                      <div v-if="variant.weight" class="feature">
                        <ScaleIcon class="w-3 h-3" />
                        <span>{{ variant.weight }} {{ variant.weight_unit || 'g' }}</span>
                      </div>
                      <div v-if="variant.color_name" class="feature">
                        <PaletteIcon class="w-3 h-3" />
                        <span>{{ variant.color_name }}</span>
                      </div>
                      <div v-if="variant.sku" class="feature">
                        <HashIcon class="w-3 h-3" />
                        <span>{{ variant.sku }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pied de carte -->
                <div class="card-view-footer">
                  <!-- Prix et stock -->
                  <div class="card-view-info">
                    <div class="info-price">
                      <div class="price-tag">
                        {{ formatPrice(calculateVariantPrice(variant)) }} FCFA
                      </div>
                      <div v-if="variant.price_modifier !== 0" class="price-note" :class="priceModifierClass(variant)">
                        {{ formatPriceModifier(variant.price_modifier) }}
                      </div>
                    </div>

                    <div class="info-stock">
                      <div class="stock-display" :class="stockClass(variant)">
                        <div class="stock-label">
                          <PackageIcon class="w-3 h-3" />
                          <span>Stock : {{ variant.stock || 0 }}</span>
                        </div>
                        <div class="stock-gauge">
                          <div 
                            class="gauge-fill"
                            :class="stockBarClass(variant)"
                            :style="{ width: `${stockPercentage(variant)}%` }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action -->
                  <div class="card-view-action">
                    <button
                      class="card-action-button"
                      :class="{ 'selected': isSelected(variant) }"
                      :disabled="!isVariantAvailable(variant)"
                    >
                      <span v-if="isSelected(variant)">
                        <CheckCircleIcon class="w-4 h-4 mr-2" />
                        Sélectionnée
                      </span>
                      <span v-else-if="!isVariantAvailable(variant)">
                        <XCircleIcon class="w-4 h-4 mr-2" />
                        Indisponible
                      </span>
                      <span v-else>
                        <ShoppingCartIcon class="w-4 h-4 mr-2" />
                        Choisir cette option
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Résumé de sélection -->
      <Transition
        enter-active-class="transition-all duration-500 ease-organic"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-organic"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="selectedVariant" class="mt-8">
          <div class="selection-summary">
            <div class="summary-header">
              <h4 class="summary-title">
                <CheckCircleIcon class="w-5 h-5" />
                Votre sélection
              </h4>
              <button
                @click="clearSelection"
                class="summary-clear"
              >
                <XIcon class="w-4 h-4" />
                Changer
              </button>
            </div>

            <div class="summary-content">
              <div class="summary-variant">
                <div class="variant-display">
                  <div 
                    v-if="selectedVariant.color"
                    class="variant-color"
                    :style="{ backgroundColor: selectedVariant.color }"
                  ></div>
                  <div class="variant-info">
                    <h5 class="variant-name">{{ selectedVariant.name }}</h5>
                    <div class="variant-details">
                      <span class="variant-price">{{ formatPrice(calculateVariantPrice(selectedVariant)) }} FCFA</span>
                      <span v-if="selectedVariant.weight" class="variant-weight">
                        • {{ selectedVariant.weight }} {{ selectedVariant.weight_unit || 'g' }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="variant-stock-info">
                  <div class="stock-status" :class="stockClass(selectedVariant)">
                    <PackageIcon class="w-4 h-4" />
                    <span>{{ selectedVariant.stock || 0 }} en stock</span>
                  </div>
                </div>
              </div>

              <!-- Actions supplémentaires -->
              <div class="summary-actions">
                <button
                  @click="compareVariants"
                  class="action-compare"
                >
                  <BarChart3Icon class="w-4 h-4" />
                  Comparer
                </button>
                <button
                  @click="addToCart"
                  class="action-add"
                  :disabled="!isVariantAvailable(selectedVariant)"
                >
                  <ShoppingCartIcon class="w-4 h-4" />
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Comparateur de variantes -->
      <Transition
        enter-active-class="transition-all duration-500 ease-organic"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-organic"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="showComparison" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-emerald-200/50">
            <!-- En-tête du comparateur -->
            <div class="px-6 py-4 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-50/60 to-amber-50/60">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <BarChart3Icon class="w-6 h-6 text-emerald-600" />
                  <h3 class="text-lg font-bold text-emerald-800">
                    Comparateur de variantes
                  </h3>
                </div>
                <button
                  @click="showComparison = false"
                  class="p-2 rounded-lg hover:bg-amber-50 transition-all duration-200 ease-organic"
                >
                  <XIcon class="w-5 h-5 text-amber-600" />
                </button>
              </div>
            </div>

            <!-- Contenu du comparateur -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div class="comparison-table">
                <div class="comparison-header">
                  <div class="header-cell"></div>
                  <div
                    v-for="variant in comparedVariants"
                    :key="variant.id || variant.tempId"
                    class="header-cell variant-header"
                    :class="{ 'selected': isSelected(variant) }"
                  >
                    <div class="variant-comparison">
                      <div class="comparison-name">{{ variant.name }}</div>
                      <div class="comparison-price">{{ formatPrice(calculateVariantPrice(variant)) }} FCFA</div>
                    </div>
                  </div>
                </div>

                <div class="comparison-rows">
                  <div
                    v-for="row in comparisonRows"
                    :key="row.label"
                    class="comparison-row"
                  >
                    <div class="row-label">
                      <component :is="row.icon" class="w-4 h-4" />
                      <span>{{ row.label }}</span>
                    </div>
                    <div
                      v-for="variant in comparedVariants"
                      :key="variant.id || variant.tempId"
                      class="row-cell"
                      :class="{ 'best': isBestInRow(row, variant) }"
                    >
                      {{ getComparisonValue(row, variant) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="mt-6 flex justify-center space-x-4">
                <button
                  @click="selectFromComparison"
                  class="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200"
                >
                  Sélectionner cette variante
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { createEmojiIcon } from '@/shared/components/icons/emoji'

const PackageIcon = createEmojiIcon('📦', 'Package')
const CheckCircleIcon = createEmojiIcon('✅', 'CheckCircle')
const CheckIcon = createEmojiIcon('✓', 'Check')
const StarIcon = createEmojiIcon('⭐', 'Star')
const TrendingUpIcon = createEmojiIcon('📈', 'TrendingUp')
const LayoutGridIcon = createEmojiIcon('🔲', 'Grid')
const ListIcon = createEmojiIcon('📋', 'List')
const LayoutDashboardIcon = createEmojiIcon('🗂️', 'Dashboard')
const ScaleIcon = createEmojiIcon('⚖️', 'Scale')
const PaletteIcon = createEmojiIcon('🎨', 'Palette')
const HashIcon = createEmojiIcon('#️⃣', 'Hash')
const CrownIcon = createEmojiIcon('👑', 'Crown')
const XIcon = createEmojiIcon('✕', 'Close')
const BarChart3Icon = createEmojiIcon('📊', 'Chart')
const ShoppingCartIcon = createEmojiIcon('🛒', 'Cart')
const XCircleIcon = createEmojiIcon('⛔', 'XCircle')
const DollarSignIcon = createEmojiIcon('💲', 'Dollar')
const CalendarIcon = createEmojiIcon('📅', 'Calendar')
const AwardIcon = createEmojiIcon('🏅', 'Award')

// Props
interface Props {
  variants: any[]
  modelValue?: any
  basePrice?: number
  maxStock?: number
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variants: () => [],
  basePrice: 0,
  maxStock: 1000,
  multiple: false
})

// Émits
const emit = defineEmits(['update:modelValue', 'select', 'add-to-cart'])

// États réactifs
const selectedVariant = ref<any>(null)
const selectedVariants = ref<any[]>(props.multiple && Array.isArray(props.modelValue) ? props.modelValue : [])
const viewMode = ref<'grid' | 'list' | 'cards'>('grid')
const showComparison = ref(false)
const comparedVariants = ref<any[]>([])

// Pattern SVG pour la texture
const selectorPattern = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="selector-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" stroke-width="0.3" opacity="0.02"/>
    </pattern>
    <pattern id="selector-circles" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="4" fill="none" stroke="#f59e0b" stroke-width="0.2" opacity="0.015"/>
      <circle cx="40" cy="40" r="4" fill="none" stroke="#10b981" stroke-width="0.2" opacity="0.015"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#selector-grid)"/>
  <rect width="200" height="200" fill="url(#selector-circles)"/>
</svg>`

// Computed
const availableVariants = computed(() => {
  return props.variants.filter(v => v.is_available !== false)
})

const defaultVariant = computed(() => {
  return availableVariants.value.find(v => v.is_default) || availableVariants.value[0]
})

const priceRange = computed(() => {
  if (availableVariants.value.length === 0) return { min: 0, max: 0 }
  
  const prices = availableVariants.value.map(v => calculateVariantPrice(v))
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
})

const comparisonRows = computed(() => [
  { label: 'Prix', key: 'price', icon: DollarSignIcon },
  { label: 'Stock', key: 'stock', icon: PackageIcon },
  { label: 'Poids', key: 'weight', icon: ScaleIcon },
  { label: 'Modificateur', key: 'price_modifier', icon: TrendingUpIcon },
  { label: 'Disponibilité', key: 'is_available', icon: CalendarIcon },
  { label: 'Valeur', key: 'value', icon: AwardIcon }
])

// Méthodes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formatPriceModifier = (modifier: number) => {
  if (modifier === 0) return '±0 FCFA'
  return `${modifier > 0 ? '+' : ''}${formatPrice(modifier)} FCFA`
}

const calculateVariantPrice = (variant: any) => {
  return props.basePrice + (variant.price_modifier || 0)
}

const priceModifierClass = (variant: any) => {
  return variant.price_modifier > 0 
    ? 'text-emerald-600' 
    : variant.price_modifier < 0 
      ? 'text-red-600' 
      : 'text-amber-600'
}

const stockClass = (variant: any) => {
  if (variant.stock === 0) return 'text-red-600'
  if (variant.stock < 10) return 'text-amber-600'
  return 'text-emerald-600'
}

const stockBarClass = (variant: any) => {
  if (variant.stock === 0) return 'bg-red-500'
  if (variant.stock < 10) return 'bg-amber-500'
  return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
}

const stockPercentage = (variant: any) => {
  return Math.min(Math.round((variant.stock || 0) / props.maxStock * 100), 100)
}

const stockDotCount = (variant: any) => {
  if (variant.stock === 0) return 0
  if (variant.stock < 5) return 1
  if (variant.stock < 10) return 2
  if (variant.stock < 20) return 3
  if (variant.stock < 50) return 4
  return 5
}

const getVariantType = (variant: any) => {
  if (variant.color) return 'color'
  if (variant.weight) return 'weight'
  if (variant.price_modifier > 0) return 'premium'
  if (variant.price_modifier < 0) return 'discount'
  return 'standard'
}

const isSelected = (variant: any) => {
  if (!selectedVariant.value) return false
  
  if (selectedVariant.value.id && variant.id) {
    return selectedVariant.value.id === variant.id
  }
  
  if (selectedVariant.value.tempId && variant.tempId) {
    return selectedVariant.value.tempId === variant.tempId
  }
  
  return selectedVariant.value.name === variant.name
}

const isVariantAvailable = (variant: any) => {
  return variant.is_available !== false && (variant.stock || 0) > 0
}

const isBestValue = (variant: any) => {
  if (!isVariantAvailable(variant)) return false
  
  const price = calculateVariantPrice(variant)
  const stock = variant.stock || 0
  
  // Meilleur rapport qualité-prix (prix bas et bon stock)
  return price <= priceRange.value.min && stock >= 10
}

const selectVariant = (variant: any) => {
  if (!isVariantAvailable(variant)) return
  
  if (props.multiple) {
    // Gestion de la sélection multiple
    const currentSelection = selectedVariants.value || []
    const index = currentSelection.findIndex((v: any) => 
      (v.id && v.id === variant.id) || 
      (v.tempId && v.tempId === variant.tempId)
    )
    
    if (index > -1) {
      selectedVariants.value.splice(index, 1)
    } else {
      selectedVariants.value.push(variant)
    }
  } else {
    // Sélection unique
    selectedVariant.value = variant
  }
  
  emit('update:modelValue', props.multiple ? selectedVariants.value : variant)
  emit('select', variant)
}

const clearSelection = () => {
  selectedVariant.value = null
  emit('update:modelValue', null)
}

const compareVariants = () => {
  // Sélectionner les 3 variantes les plus populaires pour la comparaison
  comparedVariants.value = [
    defaultVariant.value,
    selectedVariant.value,
    ...availableVariants.value
      .filter(v => v !== defaultVariant.value && v !== selectedVariant.value)
      .slice(0, 2)
  ].filter(Boolean)
  
  showComparison.value = true
}

const getComparisonValue = (row: any, variant: any) => {
  switch (row.key) {
    case 'price':
      return `${formatPrice(calculateVariantPrice(variant))} FCFA`
    case 'stock':
      return `${variant.stock || 0} unités`
    case 'weight':
      return variant.weight ? `${variant.weight} ${variant.weight_unit || 'g'}` : '-'
    case 'price_modifier':
      return formatPriceModifier(variant.price_modifier || 0)
    case 'is_available':
      return isVariantAvailable(variant) ? 'Disponible' : 'Indisponible'
    case 'value':
      const price = calculateVariantPrice(variant)
      const stock = variant.stock || 0
      return stock > 0 ? `${Math.round((stock / price) * 100)}/100` : '-'
    default:
      return '-'
  }
}

const isBestInRow = (row: any, variant: any) => {
  if (!comparedVariants.value.length) return false
  
  const values = comparedVariants.value.map(v => {
    const val = getComparisonValue(row, v)
    if (row.key === 'price' || row.key === 'price_modifier') {
      const num = parseFloat(val.replace(/[^0-9.-]+/g, ''))
      return isNaN(num) ? Infinity : num
    }
    if (row.key === 'stock' || row.key === 'value') {
      const num = parseFloat(val.replace(/[^0-9.-]+/g, ''))
      return isNaN(num) ? 0 : num
    }
    return val
  })
  
  const currentValue = getComparisonValue(row, variant)
  let currentNum = currentValue
  
  if (row.key === 'price' || row.key === 'price_modifier') {
    currentNum = parseFloat(currentValue.replace(/[^0-9.-]+/g, ''))
    if (isNaN(currentNum)) currentNum = Infinity
  }
  
  if (row.key === 'stock' || row.key === 'value') {
    currentNum = parseFloat(currentValue.replace(/[^0-9.-]+/g, ''))
    if (isNaN(currentNum)) currentNum = 0
  }
  
  if (row.key === 'price' || row.key === 'price_modifier') {
    return currentNum === Math.min(...values)
  }
  
  if (row.key === 'stock' || row.key === 'value') {
    return currentNum === Math.max(...values)
  }
  
  return currentValue === 'Disponible'
}

const selectFromComparison = () => {
  // Dans une implémentation réelle, on pourrait sélectionner la variante mise en avant
  showComparison.value = false
}

const addToCart = () => {
  if (selectedVariant.value && isVariantAvailable(selectedVariant.value)) {
    emit('add-to-cart', selectedVariant.value)
  }
}

// Lifecycle
onMounted(() => {
  // Initialiser la sélection avec la variante par défaut
  if (defaultVariant.value && !selectedVariant.value) {
    selectVariant(defaultVariant.value)
  }
  
  // Initialiser avec la valeur du modèle
  if (props.modelValue) {
    if (props.multiple) {
      selectedVariants.value = Array.isArray(props.modelValue) ? props.modelValue : []
    } else {
      selectedVariant.value = props.modelValue
    }
  }
})

// Watch
watch(() => props.modelValue, (newValue) => {
  if (props.multiple) {
    selectedVariants.value = Array.isArray(newValue) ? newValue : []
  } else {
    selectedVariant.value = newValue
  }
})

watch(() => props.variants, () => {
  // Si la sélection n'est plus disponible, la réinitialiser
  if (selectedVariant.value && !availableVariants.value.some(v => 
    (v.id && v.id === selectedVariant.value.id) ||
    (v.tempId && v.tempId === selectedVariant.value.tempId)
  )) {
    clearSelection()
  }
})
</script>

<style scoped>
/* Transitions organiques */
.ease-organic {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transitions entre les vues */
.view-grid-enter-active,
.view-list-enter-active,
.view-cards-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-grid-enter-from,
.view-grid-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.view-list-enter-from,
.view-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.view-cards-enter-from,
.view-cards-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Conteneur des variantes */
.variants-container {
  @apply transition-all duration-500 ease-organic;
}

/* Style des cartes en mode grille */
.variant-option {
  @apply relative cursor-pointer transition-all duration-300 ease-organic;
}

.variant-card {
  @apply relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-emerald-200/50 p-4 h-full flex flex-col;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.variant-option:hover .variant-card {
  @apply border-emerald-300 shadow-lg;
  transform: translateY(-2px);
}

.variant-option.selected .variant-card {
  @apply border-emerald-400 bg-gradient-to-br from-emerald-50/50 to-amber-50/50 shadow-xl shadow-emerald-200/50;
  transform: translateY(-4px);
}

.variant-option.unavailable .variant-card {
  @apply opacity-60 grayscale border-amber-200;
}

.variant-option.default .variant-card {
  animation: default-pulse 2s ease-in-out infinite;
}

/* En-tête de carte */
.card-header {
  @apply flex items-center justify-between mb-3;
}

.default-badge {
  @apply px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium rounded-lg flex items-center;
}

.value-badge {
  @apply px-2 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg flex items-center;
}

.selection-indicator {
  @apply w-6 h-6 rounded-full border-2 border-emerald-300 flex items-center justify-center transition-all duration-300 ease-organic;
}

.selection-indicator.selected {
  @apply border-emerald-500 bg-emerald-500 text-white;
}

/* Contenu de carte */
.card-content {
  @apply flex-1 mb-4;
}

.variant-image {
  @apply mb-3;
}

.color-swatch {
  @apply w-12 h-12 rounded-xl border-2 mx-auto transition-all duration-300 ease-organic;
}

.variant-option:hover .color-swatch {
  transform: scale(1.1) rotate(5deg);
}

.variant-icon {
  @apply w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-100 to-amber-100 flex items-center justify-center mx-auto;
}

.variant-details {
  @apply text-center mb-3;
}

.variant-name {
  @apply font-semibold text-emerald-800 mb-1;
}

.variant-sku {
  @apply text-xs text-amber-700/60 font-mono;
}

.variant-weight {
  @apply text-xs text-emerald-600 flex items-center justify-center space-x-1 mt-1;
}

.variant-price {
  @apply text-center;
}

.price-amount {
  @apply text-lg font-bold text-emerald-700;
}

.price-modifier {
  @apply text-xs mt-1;
}

/* Pied de carte */
.card-footer {
  @apply space-y-3;
}

.variant-stock {
  @apply space-y-1;
}

.stock-info {
  @apply flex items-center justify-center space-x-1 text-xs;
}

.stock-bar {
  @apply w-full h-1.5 bg-amber-100 rounded-full overflow-hidden;
}

.stock-level {
  @apply h-full rounded-full transition-all duration-500 ease-organic;
}

.variant-action .action-button {
  @apply w-full py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-organic;
}

.variant-action .action-button:not(.selected):not(:disabled) {
  @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700;
}

.variant-action .action-button.selected {
  @apply bg-emerald-100 text-emerald-700;
}

.variant-action .action-button:disabled {
  @apply bg-amber-100 text-amber-700 cursor-not-allowed;
}

/* Overlay de sélection */
.selection-overlay {
  @apply absolute inset-0 rounded-2xl opacity-0 transition-all duration-300 ease-organic pointer-events-none;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(245, 158, 11, 0.1));
}

.variant-option.selected .selection-overlay {
  @apply opacity-100;
}

/* Style des éléments de liste */
.variant-list-item {
  @apply relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-emerald-200/50 p-4 cursor-pointer transition-all duration-300 ease-organic;
}

.variant-list-item:hover {
  @apply border-emerald-300 shadow-lg;
  transform: translateX(4px);
}

.variant-list-item.selected {
  @apply border-emerald-400 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 shadow-xl shadow-emerald-200/50;
}

.variant-list-item.unavailable {
  @apply opacity-60 grayscale border-amber-200;
}

.list-item-content {
  @apply grid grid-cols-12 gap-4 items-center;
}

.list-selection {
  @apply col-span-1;
}

.selection-circle {
  @apply w-5 h-5 rounded-full border-2 border-emerald-300 flex items-center justify-center transition-all duration-300 ease-organic;
}

.selection-circle.selected {
  @apply border-emerald-500 bg-emerald-500;
}

.list-details {
  @apply col-span-5;
}

.list-name {
  @apply font-semibold text-emerald-800;
}

.default-tag {
  @apply px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center;
}

.list-meta {
  @apply flex items-center space-x-2 mt-1;
}

.list-sku {
  @apply text-xs text-amber-700/60 font-mono;
}

.list-weight {
  @apply text-xs text-emerald-600 flex items-center space-x-1;
}

.list-price {
  @apply col-span-2;
}

.price-main {
  @apply font-bold text-emerald-700;
}

.list-stock {
  @apply col-span-2;
}

.stock-status {
  @apply flex items-center space-x-1 text-sm;
}

.stock-dots {
  @apply flex space-x-1 mt-1;
}

.stock-dot {
  @apply w-1.5 h-1.5 rounded-full bg-amber-200 transition-all duration-300 ease-organic;
}

.stock-dot.active {
  @apply bg-emerald-500;
}

.stock-dot.active.low {
  @apply bg-amber-500;
}

.list-action {
  @apply col-span-2 text-right;
}

.list-button {
  @apply px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ease-organic;
}

.list-button:not(.selected):not(:disabled) {
  @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700;
}

.list-button.selected {
  @apply bg-emerald-100 text-emerald-700;
}

.list-button:disabled {
  @apply bg-amber-100 text-amber-700 cursor-not-allowed;
}

/* Style des cartes en mode "cards" */
.variant-card-view {
  @apply relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-emerald-200/50 p-6 cursor-pointer transition-all duration-500 ease-organic;
}

.variant-card-view:hover {
  @apply border-emerald-300 shadow-2xl;
  transform: translateY(-4px) scale(1.02);
}

.variant-card-view.selected {
  @apply border-emerald-400 bg-gradient-to-br from-emerald-50/50 to-amber-50/50 shadow-2xl shadow-emerald-200/50;
  transform: translateY(-6px) scale(1.03);
}

.variant-card-view.premium {
  @apply border-amber-300;
}

.variant-card-view.unavailable {
  @apply opacity-60 grayscale border-amber-200;
}

.card-light-effect {
  @apply absolute -inset-4 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-amber-400/0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-organic pointer-events-none;
}

.premium-header {
  @apply absolute -top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium rounded-full flex items-center space-x-1;
}

.card-view-main {
  @apply flex flex-col md:flex-row items-center md:items-start gap-6 mb-6;
}

.card-view-image {
  @apply flex-shrink-0;
}

.image-container {
  @apply relative;
}

.color-display {
  @apply w-24 h-24 rounded-2xl border-4 border-white shadow-lg;
}

.icon-display {
  @apply w-24 h-24 rounded-2xl bg-gradient-to-r from-emerald-100 to-amber-100 flex items-center justify-center border-4 border-white shadow-lg;
}

.card-view-details {
  @apply flex-1;
}

.details-header {
  @apply flex items-center justify-between mb-3;
}

.card-view-name {
  @apply text-xl font-bold text-emerald-800;
}

.card-view-badge {
  @apply px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium rounded-full flex items-center;
}

.card-view-description {
  @apply text-sm text-amber-700/70 mb-4 line-clamp-2;
}

.card-view-features {
  @apply flex flex-wrap gap-2;
}

.feature {
  @apply px-3 py-1.5 bg-emerald-100/50 text-emerald-700 text-xs font-medium rounded-lg flex items-center space-x-1;
}

.card-view-footer {
  @apply space-y-4;
}

.card-view-info {
  @apply flex flex-col md:flex-row md:items-center justify-between gap-4;
}

.info-price {
  @apply flex-1;
}

.price-tag {
  @apply text-2xl font-bold text-emerald-700;
}

.price-note {
  @apply text-sm mt-1;
}

.info-stock {
  @apply flex-1;
}

.stock-display {
  @apply space-y-2;
}

.stock-label {
  @apply flex items-center space-x-2 text-sm font-medium;
}

.stock-gauge {
  @apply w-full h-2 bg-amber-100 rounded-full overflow-hidden;
}

.gauge-fill {
  @apply h-full rounded-full transition-all duration-500 ease-organic;
}

.card-view-action .card-action-button {
  @apply w-full py-3 px-6 font-medium rounded-xl transition-all duration-300 ease-organic flex items-center justify-center;
}

.card-view-action .card-action-button:not(.selected):not(:disabled) {
  @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700;
}

.card-view-action .card-action-button.selected {
  @apply bg-emerald-100 text-emerald-700;
}

.card-view-action .card-action-button:disabled {
  @apply bg-amber-100 text-amber-700 cursor-not-allowed;
}

/* Résumé de sélection */
.selection-summary {
  @apply bg-gradient-to-r from-emerald-50/60 to-amber-50/60 rounded-2xl border border-emerald-200/50 p-6;
}

.summary-header {
  @apply flex items-center justify-between mb-4;
}

.summary-title {
  @apply text-lg font-semibold text-emerald-800 flex items-center space-x-2;
}

.summary-clear {
  @apply text-sm text-amber-700 hover:text-emerald-700 transition-colors duration-200 flex items-center space-x-1;
}

.summary-content {
  @apply space-y-4;
}

.summary-variant {
  @apply flex flex-col md:flex-row md:items-center justify-between gap-4;
}

.variant-display {
  @apply flex items-center space-x-4;
}

.variant-color {
  @apply w-10 h-10 rounded-lg border border-emerald-200;
}

.variant-info {
  @apply flex-1;
}

.variant-info .variant-name {
  @apply font-bold text-emerald-800;
}

.variant-details {
  @apply text-sm text-amber-700/70;
}

.variant-stock-info .stock-status {
  @apply text-sm;
}

.summary-actions {
  @apply flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-200/30;
}

.action-compare {
  @apply px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-100/50 border border-emerald-300/50 rounded-xl hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all duration-300 ease-organic flex items-center justify-center space-x-2;
}

.action-add {
  @apply flex-1 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2;
}

.action-add:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Comparateur */
.comparison-table {
  @apply w-full;
}

.comparison-header {
  @apply grid grid-cols-5 gap-4 mb-6;
}

.header-cell {
  @apply p-4 rounded-xl border border-emerald-200/50 bg-white/80;
}

.variant-header {
  @apply text-center;
}

.variant-header.selected {
  @apply border-emerald-400 bg-gradient-to-br from-emerald-50/50 to-amber-50/50;
}

.variant-comparison {
  @apply space-y-2;
}

.comparison-name {
  @apply font-bold text-emerald-800;
}

.comparison-price {
  @apply text-lg font-bold text-emerald-700;
}

.comparison-rows {
  @apply space-y-4;
}

.comparison-row {
  @apply grid grid-cols-5 gap-4 items-center;
}

.row-label {
  @apply p-4 rounded-xl border border-emerald-200/50 bg-white/80 flex items-center space-x-2 font-medium text-emerald-800;
}

.row-cell {
  @apply p-4 rounded-xl border border-emerald-200/50 bg-white/80 text-center transition-all duration-300 ease-organic;
}

.row-cell.best {
  @apply border-emerald-400 bg-gradient-to-br from-emerald-50/50 to-amber-50/50;
}

/* Animations */
@keyframes default-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0.1);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(254, 243, 199, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #10b981, #f59e0b);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0da271, #e38c09);
}

/* Responsive */
@media (max-width: 768px) {
  .variant-card-view {
    @apply p-4;
  }
  
  .card-view-main {
    @apply flex-col items-center text-center;
  }
  
  .details-header {
    @apply flex-col items-center gap-2;
  }
  
  .list-item-content {
    @apply grid-cols-1 gap-3;
  }
  
  .list-selection,
  .list-details,
  .list-price,
  .list-stock,
  .list-action {
    @apply col-span-1;
  }
  
  .comparison-header,
  .comparison-row {
    @apply grid-cols-2;
  }
}

@media (max-width: 480px) {
  .variant-option {
    @apply col-span-2;
  }
  
  .card-view-features {
    @apply flex-col items-start;
  }
  
  .summary-actions {
    @apply flex-col;
  }
}
</style>
