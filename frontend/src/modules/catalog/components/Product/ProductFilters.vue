<template>
  <div class="product-filters-container">
    <!-- Conteneur principal avec texture organique -->
    <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-200/50 backdrop-blur-sm bg-white/80 shadow-lg">
      <!-- Background organique -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-amber-50/20 to-emerald-100/20 z-0"></div>
      
      <!-- Texture de feuilles africaines subtile -->
      <div class="absolute inset-0 opacity-5 z-0" 
           :style="{ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(leafPattern)}')` }">
      </div>

      <!-- En-tête animé -->
      <div class="relative z-10 border-b border-emerald-200/50 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-amber-100">
              <FilterIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
                Affinez votre recherche
              </h3>
              <p class="text-xs text-amber-700/60">Trouvez les produits parfaits</p>
            </div>
          </div>
          
          <button
            @click="toggleFilters"
            class="p-2 rounded-lg hover:bg-emerald-50 transition-all duration-300 ease-organic"
            :class="{ 'text-emerald-600': isExpanded, 'text-amber-600': !isExpanded }"
          >
            <ChevronDownIcon 
              class="w-5 h-5 transition-transform duration-300 ease-organic"
              :class="isExpanded ? 'rotate-180' : ''"
            />
          </button>
        </div>
      </div>

      <!-- Contenu des filtres avec animation -->
      <Transition
        enter-active-class="transition-all duration-500 ease-organic"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-[2000px] opacity-100"
        leave-active-class="transition-all duration-300 ease-organic"
        leave-from-class="max-h-[2000px] opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="isExpanded" class="relative z-10 px-6 py-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <!-- Section 1: Catégories & Origine -->
            <div class="space-y-6">
              <!-- Arbre des catégories -->
              <div class="filter-section">
                <div class="filter-header">
                  <LayersIcon class="w-5 h-5 text-emerald-600" />
                  <h4 class="filter-title">Catégories</h4>
                  <span class="filter-badge">{{ selectedCategories.length }}</span>
                </div>
                
                <div class="filter-content">
                  <div class="category-tree max-h-64 overflow-y-auto pr-2">
                    <div 
                      v-for="category in categoryTree" 
                      :key="category.id"
                      class="space-y-1"
                    >
                      <label class="category-item" :style="{ paddingLeft: `${(category.level || 0) * 24}px` }">
                        <input
                          type="checkbox"
                          :value="category.id"
                          v-model="selectedCategories"
                          @change="emitFilters"
                          class="category-checkbox"
                        />
                        <span class="category-label">{{ category.name }}</span>
                        <span class="category-count">{{ category.product_count || 0 }}</span>
                      </label>
                      
                      <!-- Sous-catégories -->
                      <div v-if="category.children && category.children.length > 0">
                        <label
                          v-for="child in category.children"
                          :key="child.id"
                          class="category-item" 
                          :style="{ paddingLeft: `${(child.level || 1) * 24}px` }"
                        >
                          <input
                            type="checkbox"
                            :value="child.id"
                            v-model="selectedCategories"
                            @change="emitFilters"
                            class="category-checkbox"
                          />
                          <span class="category-label">{{ child.name }}</span>
                          <span class="category-count">{{ child.product_count || 0 }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    v-if="selectedCategories.length > 0"
                    @click="clearCategories"
                    class="clear-btn mt-3"
                  >
                    <XIcon class="w-3 h-3" />
                    Effacer la sélection
                  </button>
                </div>
              </div>

              <!-- Région d'origine -->
              <div class="filter-section">
                <div class="filter-header">
                  <MapPinIcon class="w-5 h-5 text-emerald-600" />
                  <h4 class="filter-title">Région du Cameroun</h4>
                </div>
                
                <div class="filter-content">
                  <div class="relative group">
                    <select
                      v-model="selectedRegion"
                      @change="emitFilters"
                      class="region-select"
                    >
                      <option value="">Toutes les régions</option>
                      <optgroup label="Régions du Nord">
                        <option v-for="region in northernRegions" :key="region" :value="region">
                          🏜️ {{ region }}
                        </option>
                      </optgroup>
                      <optgroup label="Régions du Centre">
                        <option v-for="region in centralRegions" :key="region" :value="region">
                          🏙️ {{ region }}
                        </option>
                      </optgroup>
                      <optgroup label="Régions du Sud">
                        <option v-for="region in southernRegions" :key="region" :value="region">
                          🌴 {{ region }}
                        </option>
                      </optgroup>
                    </select>
                    <div class="select-icon">
                      <ChevronDownIcon class="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Prix & Disponibilité -->
            <div class="space-y-6">
              <!-- Plage de prix -->
              <div class="filter-section">
                <div class="filter-header">
                  <TagIcon class="w-5 h-5 text-emerald-600" />
                  <h4 class="filter-title">Prix (FCFA)</h4>
                  <span class="filter-badge price-badge">
                    {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
                  </span>
                </div>
                
                <div class="filter-content">
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <input
                        type="number"
                        v-model.number="priceRange[0]"
                        :min="0"
                        :max="maxPrice"
                        class="w-24 px-2 py-1.5 text-xs border border-emerald-300/50 rounded-lg bg-white/70 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 ease-organic"
                        @change="handlePriceChange([priceRange[0], priceRange[1]])"
                      />
                      <span class="text-xs text-amber-600">à</span>
                      <input
                        type="number"
                        v-model.number="priceRange[1]"
                        :min="0"
                        :max="maxPrice"
                        class="w-24 px-2 py-1.5 text-xs border border-emerald-300/50 rounded-lg bg-white/70 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 ease-organic"
                        @change="handlePriceChange([priceRange[0], priceRange[1]])"
                      />
                    </div>
                    <div class="relative h-2">
                      <input
                        type="range"
                        v-model.number="priceRange[0]"
                        :min="0"
                        :max="maxPrice"
                        :step="100"
                        class="range-slider"
                        @input="handlePriceChange([priceRange[0], priceRange[1]])"
                      />
                      <input
                        type="range"
                        v-model.number="priceRange[1]"
                        :min="0"
                        :max="maxPrice"
                        :step="100"
                        class="range-slider"
                        @input="handlePriceChange([priceRange[0], priceRange[1]])"
                      />
                    </div>
                  </div>
                  
                  <div class="flex justify-between mt-4 text-sm">
                    <span class="text-amber-700/70">Min: {{ formatPrice(priceRange[0]) }}</span>
                    <span class="text-amber-700/70">Max: {{ formatPrice(priceRange[1]) }}</span>
                  </div>
                </div>
              </div>

              <!-- Disponibilité immédiate -->
              <div class="filter-section">
                <div class="filter-header">
                  <PackageIcon class="w-5 h-5 text-emerald-600" />
                  <h4 class="filter-title">Disponibilité</h4>
                </div>
                
                <div class="filter-content">
                  <div class="space-y-3">
                    <label class="availability-option" :class="{ 'active': filters.inStock }">
                      <input
                        type="checkbox"
                        v-model="filters.inStock"
                        @change="emitFilters"
                        class="availability-checkbox"
                      />
                      <div class="availability-indicator">
                        <CheckIcon class="w-4 h-4" />
                      </div>
                      <div class="flex-1">
                        <span class="availability-label">En stock immédiat</span>
                        <span class="availability-description">Livraison rapide</span>
                      </div>
                      <div class="availability-badge">⚡</div>
                    </label>
                    
                    <label class="availability-option" :class="{ 'active': filters.preOrder }">
                      <input
                        type="checkbox"
                        v-model="filters.preOrder"
                        @change="emitFilters"
                        class="availability-checkbox"
                      />
                      <div class="availability-indicator">
                        <CheckIcon class="w-4 h-4" />
                      </div>
                      <div class="flex-1">
                        <span class="availability-label">Commande préalable</span>
                        <span class="availability-description">Récolte à venir</span>
                      </div>
                      <div class="availability-badge">📅</div>
                    </label>
                    
                    <label class="availability-option" :class="{ 'active': filters.seasonal }">
                      <input
                        type="checkbox"
                        v-model="filters.seasonal"
                        @change="emitFilters"
                        class="availability-checkbox"
                      />
                      <div class="availability-indicator">
                        <CheckIcon class="w-4 h-4" />
                      </div>
                      <div class="flex-1">
                        <span class="availability-label">Produits de saison</span>
                        <span class="availability-description">Meilleure qualité</span>
                      </div>
                      <div class="availability-badge">🌿</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Labels & Évaluations -->
            <div class="space-y-6">
              <!-- Labels de qualité -->
              <div class="filter-section">
                <div class="filter-header">
                  <AwardIcon class="w-5 h-5 text-emerald-600" />
                  <h4 class="filter-title">Labels & Certifications</h4>
                  <span class="filter-badge">{{ selectedLabels.length }}</span>
                </div>
                
                <div class="filter-content">
                  <div class="labels-grid">
                    <label
                      v-for="label in qualityLabels"
                      :key="label.id"
                      class="label-option group"
                      :class="{ 'active': selectedLabels.includes(label.id) }"
                    >
                      <input
                        type="checkbox"
                        :value="label.id"
                        v-model="selectedLabels"
                        @change="emitFilters"
                        class="label-checkbox"
                      />
                      <div class="label-content">
                        <div class="label-icon" :style="{ backgroundColor: label.color + '20', color: label.color }">
                          <component :is="label.icon" class="w-4 h-4" />
                        </div>
                        <div class="label-details">
                          <span class="label-name">{{ label.name }}</span>
                          <span class="label-description">{{ label.description }}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Évaluations -->
              <div class="filter-section">
                <div class="filter-header">
                  <StarIcon class="w-5 h-5 text-emerald-600" />
                  <h4 class="filter-title">Notes des producteurs</h4>
                </div>
                
                <div class="filter-content">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-amber-700/70">Note minimum:</span>
                      <span class="text-emerald-700 font-medium">{{ ratingFilter }}/5</span>
                    </div>
                    
                    <input
                      type="range"
                      v-model.number="ratingFilter"
                      :min="0"
                      :max="5"
                      :step="0.5"
                      class="range-slider rating-slider"
                      @input="handleRatingChange(ratingFilter)"
                    />
                    
                    <div class="flex items-center justify-between mt-4">
                      <div class="flex items-center space-x-1">
                        <StarIcon class="w-4 h-4 text-amber-400" />
                        <StarIcon class="w-4 h-4 text-amber-400" />
                        <StarIcon class="w-4 h-4 text-amber-400" />
                        <StarIcon class="w-4 h-4 text-amber-400" />
                        <StarIcon class="w-4 h-4 text-amber-400" />
                      </div>
                      <button
                        @click="ratingFilter = 0"
                        class="text-xs text-amber-600 hover:text-emerald-600 transition-colors duration-200"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="mt-8 pt-6 border-t border-emerald-200/50">
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="resetFilters"
                class="reset-btn group"
              >
                <RefreshCwIcon class="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500 ease-organic" />
                Tout réinitialiser
              </button>
              
              <div class="flex-1"></div>
              
              <button
                @click="applyFilters"
                class="apply-btn group"
              >
                <span>Appliquer les filtres</span>
                <ArrowRightIcon class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 ease-organic" />
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Bouton flottant pour réinitialiser (visible même quand plié) -->
      <button
        v-if="!isExpanded && hasActiveFilters"
        @click="resetFilters"
        class="absolute -top-2 -right-2 z-20 p-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 active:scale-95 transition-all duration-300 ease-organic"
        title="Filtres actifs - Cliquez pour réinitialiser"
      >
        <div class="relative">
          <FilterIcon class="w-4 h-4" />
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
        </div>
      </button>
    </div>

    <!-- Badge indicateur de filtres actifs -->
    <Transition
      enter-active-class="transition-all duration-300 ease-organic"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-organic"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="hasActiveFilters" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="filter in activeFiltersBadges"
            :key="filter.id"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-200 ease-organic hover:scale-105 cursor-pointer"
            :class="filter.class"
            @click="filter.remove ? filter.remove() : null"
          >
            <component :is="filter.icon" class="w-3 h-3 mr-1.5" />
            {{ filter.label }}
            <XIcon v-if="filter.remove" class="w-3 h-3 ml-1.5 hover:scale-110" />
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { createEmojiIcon } from '@/shared/components/icons/emoji'
import { categoriesApi, type CategoryTree } from '../../services/api/categories.api'

// Icons
const FilterIcon = createEmojiIcon('🎛️', 'Filter')
const ChevronDownIcon = createEmojiIcon('▼', 'ChevronDown')
const LayersIcon = createEmojiIcon('🗂️', 'Layers')
const MapPinIcon = createEmojiIcon('📍', 'MapPin')
const TagIcon = createEmojiIcon('🏷️', 'Tag')
const PackageIcon = createEmojiIcon('📦', 'Package')
const AwardIcon = createEmojiIcon('🏅', 'Award')
const StarIcon = createEmojiIcon('⭐', 'Star')
const RefreshCwIcon = createEmojiIcon('🔄', 'Refresh')
const ArrowRightIcon = createEmojiIcon('➡️', 'ArrowRight')
const XIcon = createEmojiIcon('✕', 'Close')
const CheckIcon = createEmojiIcon('✓', 'Check')
const SproutIcon = createEmojiIcon('🌱', 'Sprout')
const ShieldIcon = createEmojiIcon('🛡️', 'Shield')
const LeafIcon = createEmojiIcon('🍃', 'Leaf')
const SunIcon = createEmojiIcon('☀️', 'Sun')
const DropletsIcon = createEmojiIcon('💧', 'Droplets')
const HeartIcon = createEmojiIcon('❤️', 'Heart')

// Props
interface Props {
  modelValue?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({})
})

// Émits
const emit = defineEmits(['update:modelValue', 'filter'])

// États réactifs
const isExpanded = ref(true)
const priceRange = ref([0, 50000])
const maxPrice = ref(100000)
const selectedRegion = ref('')
const ratingFilter = ref(0)
const selectedCategories = ref<string[]>([])
const selectedLabels = ref<string[]>([])

interface FilterCategoryNode {
  id: string
  name: string
  product_count?: number
  level: number
  children: FilterCategoryNode[]
}

// Filtres
const filters = ref({
  inStock: false,
  preOrder: false,
  seasonal: false
})

const categoryTree = ref<FilterCategoryNode[]>([])

// Régions du Cameroun
const northernRegions = ['Adamaoua', 'Nord', 'Extrême-Nord']
const centralRegions = ['Centre', 'Littoral', 'Ouest']
const southernRegions = ['Sud', 'Sud-Ouest', 'Est', 'Nord-Ouest']

// Labels de qualité camerounais
const qualityLabels = ref([
  { id: 'bio', name: 'Agriculture Biologique', description: 'Sans pesticides', color: '#10b981', icon: SproutIcon },
  { id: 'local', name: 'Producteur Local', description: 'Circuit court', color: '#f59e0b', icon: MapPinIcon },
  { id: 'artisanal', name: 'Artisanal', description: 'Fait main', color: '#8b5cf6', icon: HeartIcon },
  { id: 'fairtrade', name: 'Commerce Équitable', description: 'Rémunération juste', color: '#3b82f6', icon: ShieldIcon },
  { id: 'fresh', name: 'Ultra Frais', description: 'Récolte du jour', color: '#06b6d4', icon: DropletsIcon },
  { id: 'seasonal', name: 'Saisonniers', description: 'Meilleure période', color: '#84cc16', icon: SunIcon }
])

// Pattern SVG pour la texture de fond
const leafPattern = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M20,20 Q40,10 60,20 Q80,30 80,50 Q80,70 60,80 Q40,90 20,80 Q0,70 0,50 Q0,30 20,20" 
        fill="none" stroke="#10b981" stroke-width="0.5" opacity="0.05"/>
  <path d="M30,30 Q50,25 70,35 Q85,45 85,60 Q85,75 70,85 Q55,95 30,85 Q15,75 15,60 Q15,45 30,35" 
        fill="none" stroke="#f59e0b" stroke-width="0.5" opacity="0.05"/>
</svg>`

// Computed
const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    selectedRegion.value !== '' ||
    priceRange.value[0] > 0 ||
    priceRange.value[1] < maxPrice.value ||
    ratingFilter.value > 0 ||
    selectedLabels.value.length > 0 ||
    Object.values(filters.value).some(v => v === true)
  )
})

const activeFiltersBadges = computed(() => {
  const badges: Array<{
    id: string
    label: string
    class: string
    icon: any
    remove?: () => void
  }> = []

  // Badge pour les catégories
  if (selectedCategories.value.length > 0) {
    badges.push({
      id: 'categories',
      label: `${selectedCategories.value.length} catégorie(s)`,
      class: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      icon: LayersIcon,
      remove: clearCategories
    })
  }

  // Badge pour la région
  if (selectedRegion.value) {
    badges.push({
      id: 'region',
      label: selectedRegion.value,
      class: 'bg-amber-100 text-amber-800 border border-amber-300',
      icon: MapPinIcon,
      remove: () => { selectedRegion.value = ''; emitFilters() }
    })
  }

  // Badge pour le prix
  if (priceRange.value[0] > 0 || priceRange.value[1] < maxPrice.value) {
    badges.push({
      id: 'price',
      label: `${formatPrice(priceRange.value[0])} - ${formatPrice(priceRange.value[1])}`,
      class: 'bg-blue-100 text-blue-800 border border-blue-300',
      icon: TagIcon,
      remove: resetPrice
    })
  }

  // Badge pour les labels
  if (selectedLabels.value.length > 0) {
    const labelNames = selectedLabels.value.map(id => 
      qualityLabels.value.find(l => l.id === id)?.name || id
    ).join(', ')
    
    badges.push({
      id: 'labels',
      label: labelNames.length > 20 ? `${labelNames.substring(0, 20)}...` : labelNames,
      class: 'bg-purple-100 text-purple-800 border border-purple-300',
      icon: AwardIcon,
      remove: clearLabels
    })
  }

  // Badge pour la note
  if (ratingFilter.value > 0) {
    badges.push({
      id: 'rating',
      label: `${ratingFilter.value} ★ et plus`,
      class: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      icon: StarIcon,
      remove: () => { ratingFilter.value = 0; emitFilters() }
    })
  }

  return badges
})

// Méthodes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(price)
}

const toggleFilters = () => {
  isExpanded.value = !isExpanded.value
}

const handlePriceChange = (value: [number, number]) => {
  let [min, max] = value
  if (min > max) {
    const temp = min
    min = max
    max = temp
  }
  min = Math.max(0, Math.min(min, maxPrice.value))
  max = Math.max(min, Math.min(max, maxPrice.value))
  priceRange.value = [min, max]
  emitFilters()
}

const handleRatingChange = (value: number) => {
  ratingFilter.value = value
  emitFilters()
}

const clearCategories = () => {
  selectedCategories.value = []
  emitFilters()
}

const clearLabels = () => {
  selectedLabels.value = []
  emitFilters()
}

const resetPrice = () => {
  priceRange.value = [0, maxPrice.value]
  emitFilters()
}

const emitFilters = () => {
  const filterData = {
    categories: selectedCategories.value,
    region: selectedRegion.value,
    price_min: priceRange.value[0],
    price_max: priceRange.value[1],
    rating_min: ratingFilter.value,
    labels: selectedLabels.value,
    ...filters.value
  }

  emit('update:modelValue', filterData)
  emit('filter', filterData)
}

const applyFilters = () => {
  emitFilters()
  // Animation de confirmation
  const applyBtn = document.querySelector('.apply-btn')
  applyBtn?.classList.add('scale-95')
  setTimeout(() => {
    applyBtn?.classList.remove('scale-95')
  }, 150)
}

const resetFilters = () => {
  selectedCategories.value = []
  selectedRegion.value = ''
  priceRange.value = [0, maxPrice.value]
  ratingFilter.value = 0
  selectedLabels.value = []
  filters.value = {
    inStock: false,
    preOrder: false,
    seasonal: false
  }
  emitFilters()
  
  // Animation de réinitialisation
  const resetBtn = document.querySelector('.reset-btn')
  resetBtn?.classList.add('rotate-180')
  setTimeout(() => {
    resetBtn?.classList.remove('rotate-180')
  }, 500)
}

const mapCategoryTreeNode = (node: CategoryTree & { product_count?: number }, level = 0): FilterCategoryNode => {
  return {
    id: String(node.id),
    name: node.name,
    product_count: node.product_count || 0,
    level,
    children: Array.isArray(node.children)
      ? node.children.map(child => mapCategoryTreeNode(child as CategoryTree & { product_count?: number }, level + 1))
      : []
  }
}

const loadCategoryTree = async () => {
  try {
    const apiTree = await categoriesApi.getCategoryTree()
    categoryTree.value = apiTree.map(node => mapCategoryTreeNode(node as CategoryTree & { product_count?: number }))
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    categoryTree.value = []
  }
}

// Initialisation
onMounted(() => {
  void loadCategoryTree()
})

// Watch pour les changements de props
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedCategories.value = newValue.categories || []
    selectedRegion.value = newValue.region || ''
    priceRange.value = [newValue.price_min || 0, newValue.price_max || maxPrice.value]
    ratingFilter.value = newValue.rating_min || 0
    selectedLabels.value = newValue.labels || []
    
    if (newValue.inStock !== undefined) filters.value.inStock = newValue.inStock
    if (newValue.preOrder !== undefined) filters.value.preOrder = newValue.preOrder
    if (newValue.seasonal !== undefined) filters.value.seasonal = newValue.seasonal
  }
}, { immediate: true })
</script>

<style scoped>
/* Variables CSS personnalisées */
:root {
  --color-emerald: #10b981;
  --color-emerald-light: #d1fae5;
  --color-amber: #f59e0b;
  --color-amber-light: #fef3c7;
  --color-cream: #fefce8;
}

/* Transitions organiques */
.ease-organic {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Styles des sections de filtre */
.filter-section {
  @apply rounded-xl p-4 border border-emerald-200/30 bg-white/50 backdrop-blur-sm;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-section:hover {
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.4);
}

.filter-header {
  @apply flex items-center space-x-2 mb-3 pb-2 border-b border-emerald-200/20;
}

.filter-title {
  @apply flex-1 text-sm font-semibold text-emerald-800;
}

.filter-badge {
  @apply px-2 py-0.5 text-xs font-medium rounded-full;
  background: linear-gradient(135deg, var(--color-emerald-light), var(--color-amber-light));
  color: var(--color-emerald);
}

.price-badge {
  @apply whitespace-nowrap;
}

/* Arbre des catégories */
.category-tree {
  scrollbar-width: thin;
  scrollbar-color: var(--color-emerald) var(--color-emerald-light);
}

.category-tree::-webkit-scrollbar {
  width: 4px;
}

.category-tree::-webkit-scrollbar-track {
  background: var(--color-emerald-light);
  border-radius: 2px;
}

.category-tree::-webkit-scrollbar-thumb {
  background: var(--color-emerald);
  border-radius: 2px;
}

.category-item {
  @apply flex items-center space-x-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200 ease-organic;
}

.category-item:hover {
  @apply bg-emerald-50;
}

.category-checkbox {
  @apply w-3.5 h-3.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0;
}

.category-label {
  @apply flex-1 text-sm text-amber-800/80;
}

.category-count {
  @apply text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700;
}

.clear-btn {
  @apply flex items-center justify-center w-full py-1.5 text-xs text-amber-600 hover:text-emerald-600 transition-colors duration-200;
}

/* Sélecteur de région */
.region-select {
  @apply w-full px-4 py-2.5 pr-10 text-sm border border-emerald-300/50 rounded-xl bg-white/50 backdrop-blur-sm;
  @apply focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300 ease-organic;
  appearance: none;
}

.select-icon {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none;
}

/* Sliders natifs */
.range-slider {
  @apply absolute w-full h-2 appearance-none rounded-full bg-amber-100;
  pointer-events: auto;
}

.range-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md;
}

.range-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background: #10b981;
  border: 2px solid #ffffff;
}

.price-slider {
  @apply mt-2;
}

.rating-slider {
  @apply mt-1;
}

/* Options de disponibilité */
.availability-option {
  @apply flex items-center space-x-3 p-3 rounded-xl border border-emerald-200/30 cursor-pointer transition-all duration-200 ease-organic;
}

.availability-option:hover {
  @apply border-emerald-300 bg-emerald-50/50;
  transform: translateY(-1px);
}

.availability-option.active {
  @apply border-emerald-400 bg-gradient-to-r from-emerald-50 to-amber-50;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.availability-checkbox {
  @apply sr-only;
}

.availability-indicator {
  @apply w-5 h-5 rounded border border-emerald-300 flex items-center justify-center opacity-0 transition-all duration-200 ease-organic;
}

.availability-option.active .availability-indicator {
  @apply bg-emerald-500 border-emerald-500 text-white opacity-100;
}

.availability-label {
  @apply block text-sm font-medium text-emerald-800;
}

.availability-description {
  @apply block text-xs text-amber-700/60;
}

.availability-badge {
  @apply text-lg;
}

/* Labels de qualité */
.labels-grid {
  @apply grid grid-cols-1 gap-2;
}

.label-option {
  @apply p-2.5 rounded-xl border border-emerald-200/30 cursor-pointer transition-all duration-200 ease-organic;
}

.label-option:hover {
  @apply border-emerald-300 bg-emerald-50/50;
  transform: translateY(-1px);
}

.label-option.active {
  @apply border-emerald-400 bg-gradient-to-r from-emerald-50 to-amber-50;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.label-checkbox {
  @apply sr-only;
}

.label-content {
  @apply flex items-center space-x-3;
}

.label-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.label-option.active .label-icon {
  transform: scale(1.1);
}

.label-details {
  @apply flex-1;
}

.label-name {
  @apply block text-sm font-medium text-emerald-800;
}

.label-description {
  @apply block text-xs text-amber-700/60;
}

/* Boutons d'action */
.reset-btn {
  @apply flex items-center justify-center px-6 py-3 text-sm font-medium text-amber-700 bg-amber-100/50 border border-amber-300/50 rounded-xl;
  @apply hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all duration-300 ease-organic;
}

.apply-btn {
  @apply flex items-center justify-center px-8 py-3 text-sm font-medium text-white rounded-xl;
  background: linear-gradient(135deg, var(--color-emerald), var(--color-amber));
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.apply-btn:hover {
  background: linear-gradient(135deg, #0da271, #e38c09);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  transform: translateY(-1px);
}

.apply-btn:active {
  transform: translateY(0);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.floating {
  animation: float 3s ease-in-out infinite;
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-section {
    @apply p-3;
  }
  
  .labels-grid {
    @apply grid-cols-1;
  }
}
</style>

