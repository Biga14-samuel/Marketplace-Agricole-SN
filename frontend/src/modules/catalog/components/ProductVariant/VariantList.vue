<template>
  <div class="variant-list-container">
    <!-- Background organique avec texture de marché -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-amber-50/30 to-emerald-100/30 rounded-3xl z-0">
      <div class="absolute inset-0 opacity-5 z-0" 
           :style="{ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(variantListPattern)}')` }">
      </div>
    </div>

    <div class="relative z-10">
      <!-- En-tête avec statistiques -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div class="flex items-center space-x-3">
            <div class="p-3 rounded-2xl bg-gradient-to-r from-emerald-100 to-amber-100 shadow-sm">
              <LayersIcon class="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
                Variantes du Produit
              </h2>
              <p class="text-amber-800/70">
                Gestion des différentes versions disponibles
              </p>
            </div>
          </div>

          <!-- Boutons d'action principaux -->
          <div class="flex items-center space-x-3">
            <button
              @click="exportVariants"
              class="px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-100/50 border border-emerald-300/50 rounded-xl hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all duration-300 ease-organic flex items-center"
            >
              <DownloadIcon class="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button
              @click="toggleAllSelection"
              class="px-4 py-2.5 text-sm font-medium text-amber-700 bg-amber-100/50 border border-amber-300/50 rounded-xl hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all duration-300 ease-organic flex items-center"
            >
              <CheckSquareIcon class="w-4 h-4 mr-2" />
              {{ allSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
            </button>
          </div>
        </div>

        <!-- Statistiques en temps réel -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card group">
            <div class="stat-icon bg-emerald-100/50">
              <LayersIcon class="w-6 h-6 text-emerald-600" />
            </div>
            <div class="stat-content">
              <div class="stat-value text-emerald-700">
                {{ variants.length }}
              </div>
              <div class="stat-label">
                Variantes
              </div>
            </div>
            <div class="stat-trend" :class="stockTrendClass">
              <TrendingUpIcon class="w-4 h-4" />
            </div>
          </div>

          <div class="stat-card group">
            <div class="stat-icon bg-amber-100/50">
              <PackageIcon class="w-6 h-6 text-amber-600" />
            </div>
            <div class="stat-content">
              <div class="stat-value text-amber-700">
                {{ totalStock }}
              </div>
              <div class="stat-label">
                Stock total
              </div>
            </div>
            <div class="stat-trend" :class="availabilityTrendClass">
              <TrendingUpIcon class="w-4 h-4" />
            </div>
          </div>

          <div class="stat-card group">
            <div class="stat-icon bg-blue-100/50">
              <DollarSignIcon class="w-6 h-6 text-blue-600" />
            </div>
            <div class="stat-content">
              <div class="stat-value text-blue-700">
                {{ formatPrice(priceRange.min) }}
              </div>
              <div class="stat-label">
                Prix minimum
              </div>
            </div>
            <div class="stat-trend" :class="priceTrendClass">
              <TrendingUpIcon class="w-4 h-4" />
            </div>
          </div>

          <div class="stat-card group">
            <div class="stat-icon bg-purple-100/50">
              <BarChart3Icon class="w-6 h-6 text-purple-600" />
            </div>
            <div class="stat-content">
              <div class="stat-value text-purple-700">
                {{ availableCount }}
              </div>
              <div class="stat-label">
                Disponibles
              </div>
            </div>
            <div class="stat-trend" :class="availabilityTrendClass">
              <TrendingUpIcon class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Barre de contrôle -->
      <div class="mb-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Recherche et filtres -->
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Recherche -->
                <div class="relative flex-1">
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <SearchIcon class="w-5 h-5 text-emerald-600" />
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher une variante..."
                    class="w-full pl-10 pr-4 py-2.5 border border-emerald-200/50 rounded-xl bg-white/50 focus:border-emerald-400 focus:ring-3 focus:ring-emerald-200 focus:outline-none transition-all duration-300 ease-organic"
                  />
                </div>

                <!-- Filtres -->
                <div class="flex items-center space-x-2">
                  <select
                    v-model="selectedFilter"
                    class="px-4 py-2.5 border border-emerald-200/50 rounded-xl bg-white/50 focus:border-emerald-400 focus:ring-3 focus:ring-emerald-200 focus:outline-none transition-all duration-300 ease-organic"
                  >
                    <option value="all">Toutes les variantes</option>
                    <option value="available">Disponibles</option>
                    <option value="low-stock">Stock faible</option>
                    <option value="out-of-stock">En rupture</option>
                    <option value="default">Par défaut</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Actions groupées -->
            <div v-if="selectedVariants.length > 0" class="flex items-center space-x-3">
              <span class="text-sm font-medium text-emerald-800">
                {{ selectedVariants.length }} sélectionné(s)
              </span>
              <button
                @click="bulkUpdateStatus(true)"
                class="px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-100/50 border border-emerald-300/50 rounded-xl hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all duration-300 ease-organic flex items-center"
              >
                <CheckCircleIcon class="w-4 h-4 mr-1.5" />
                Activer
              </button>
              <button
                @click="bulkUpdateStatus(false)"
                class="px-3 py-2 text-sm font-medium text-amber-700 bg-amber-100/50 border border-amber-300/50 rounded-xl hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all duration-300 ease-organic flex items-center"
              >
                <XCircleIcon class="w-4 h-4 mr-1.5" />
                Désactiver
              </button>
              <button
                @click="bulkDelete"
                class="px-3 py-2 text-sm font-medium text-red-700 bg-red-100/50 border border-red-300/50 rounded-xl hover:bg-red-100 hover:border-red-400 active:scale-95 transition-all duration-300 ease-organic flex items-center"
              >
                <Trash2Icon class="w-4 h-4 mr-1.5" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des variantes -->
      <div class="overflow-hidden rounded-2xl border border-emerald-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
        <!-- En-tête du tableau -->
        <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-50/60 to-amber-50/60">
          <div class="col-span-1 flex items-center">
            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleAllSelection"
              class="rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <div class="col-span-3 font-semibold text-emerald-800 flex items-center">
            <TagIcon class="w-4 h-4 mr-2" />
            Nom
          </div>
          <div class="col-span-2 font-semibold text-emerald-800 flex items-center">
            <DollarSignIcon class="w-4 h-4 mr-2" />
            Prix
          </div>
          <div class="col-span-2 font-semibold text-emerald-800 flex items-center">
            <PackageIcon class="w-4 h-4 mr-2" />
            Stock
          </div>
          <div class="col-span-2 font-semibold text-emerald-800 flex items-center">
            <ActivityIcon class="w-4 h-4 mr-2" />
            Statut
          </div>
          <div class="col-span-2 font-semibold text-emerald-800 flex items-center justify-end">
            <SettingsIcon class="w-4 h-4 mr-2" />
            Actions
          </div>
        </div>

        <!-- Liste des variantes -->
        <TransitionGroup
          name="variant-list"
          tag="div"
          class="divide-y divide-emerald-200/30"
        >
          <!-- Variante -->
          <div
            v-for="(variant, index) in filteredVariants"
            :key="variant.id || index"
            class="variant-row group"
            :class="{
              'bg-emerald-50/30': variant.is_default,
              'hover:bg-emerald-50/50': !variant.is_default
            }"
          >
            <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <!-- Sélection -->
              <div class="col-span-1">
                <input
                  type="checkbox"
                  :checked="isSelected(variant)"
                  @change="toggleSelection(variant)"
                  class="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <!-- Nom et détails -->
              <div class="col-span-3">
                <div class="flex items-center space-x-3">
                  <!-- Badge par défaut -->
                  <div v-if="variant.is_default" class="relative">
                    <span class="px-2 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg shadow-sm">
                      Défaut
                    </span>
                    <div class="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                  </div>

                  <!-- Nom -->
                  <div>
                    <h4 class="font-medium text-emerald-800 group-hover:text-emerald-900 transition-colors duration-200">
                      {{ variant.name || 'Sans nom' }}
                    </h4>
                    <div class="flex items-center space-x-2 mt-1">
                      <span v-if="variant.sku" class="text-xs font-mono bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                        {{ variant.sku }}
                      </span>
                      <span v-if="variant.color_name" class="text-xs text-amber-700 flex items-center">
                        <div class="w-2 h-2 rounded-full mr-1" :style="{ backgroundColor: variant.color || '#10b981' }"></div>
                        {{ variant.color_name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Prix -->
              <div class="col-span-2">
                <div class="flex flex-col">
                  <span class="font-bold text-emerald-700">
                    {{ formatPrice(calculateVariantPrice(variant)) }} FCFA
                  </span>
                  <span class="text-xs" :class="priceModifierClass(variant)">
                    {{ formatPriceModifier(variant.price_modifier) }}
                  </span>
                </div>
              </div>

              <!-- Stock -->
              <div class="col-span-2">
                <div class="flex flex-col">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="font-bold" :class="stockClass(variant)">
                      {{ variant.stock || 0 }} unités
                    </span>
                    <span class="text-xs px-1.5 py-0.5 rounded-full" :class="stockBadgeClass(variant)">
                      {{ stockPercentage(variant) }}%
                    </span>
                  </div>
                  <div class="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-500 ease-organic"
                      :class="stockBarClass(variant)"
                      :style="{ width: `${stockPercentage(variant)}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Statut -->
              <div class="col-span-2">
                <div class="flex items-center space-x-2">
                  <div class="relative">
                    <div class="w-2 h-2 rounded-full" :class="availabilityDotClass(variant)"></div>
                    <div class="absolute -inset-1 rounded-full animate-ping" :class="availabilityPingClass(variant)"></div>
                  </div>
                  <span class="text-sm font-medium" :class="availabilityTextClass(variant)">
                    {{ variant.is_available !== false ? 'Disponible' : 'Indisponible' }}
                  </span>
                </div>
                <div v-if="variant.weight" class="text-xs text-amber-700/70 mt-1">
                  {{ variant.weight }} {{ variant.weight_unit || 'g' }}
                </div>
              </div>

              <!-- Actions -->
              <div class="col-span-2">
                <div class="flex items-center justify-end space-x-1">
                  <!-- Bouton visionner -->
                  <button
                    @click="viewVariant(variant)"
                    class="p-2 rounded-lg hover:bg-emerald-50 group/action transition-all duration-200 ease-organic"
                    title="Visionner les détails"
                  >
                    <EyeIcon class="w-4 h-4 text-emerald-600 group-hover/action:scale-110 transition-transform duration-200" />
                  </button>

                  <!-- Bouton éditer -->
                  <button
                    @click="editVariant(variant, index)"
                    class="p-2 rounded-lg hover:bg-blue-50 group/action transition-all duration-200 ease-organic"
                    title="Modifier"
                  >
                    <EditIcon class="w-4 h-4 text-blue-600 group-hover/action:scale-110 transition-transform duration-200" />
                  </button>

                  <!-- Bouton définir par défaut -->
                  <button
                    v-if="!variant.is_default"
                    @click="setAsDefault(variant, index)"
                    class="p-2 rounded-lg hover:bg-amber-50 group/action transition-all duration-200 ease-organic"
                    title="Définir comme variante par défaut"
                  >
                    <StarIcon class="w-4 h-4 text-amber-500 group-hover/action:scale-110 transition-transform duration-200" />
                  </button>

                  <!-- Menu déroulant des actions -->
                  <div class="relative">
                    <button
                      @click="toggleActionMenu(index)"
                      class="p-2 rounded-lg hover:bg-emerald-50 group/action transition-all duration-200 ease-organic"
                      title="Plus d'actions"
                    >
                      <MoreVerticalIcon class="w-4 h-4 text-emerald-600 group-hover/action:rotate-90 transition-all duration-300 ease-organic" />
                    </button>

                    <!-- Menu d'actions -->
                    <Transition
                      enter-active-class="transition-all duration-200 ease-organic"
                      enter-from-class="opacity-0 scale-95"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition-all duration-150 ease-organic"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-95"
                    >
                      <div
                        v-if="actionMenuIndex === index"
                        class="absolute right-0 mt-1 bg-white/95 backdrop-blur-sm rounded-xl border border-emerald-200/50 shadow-2xl z-10 min-w-48"
                        ref="actionMenuRef"
                      >
                        <div class="py-1">
                          <button
                            @click="duplicateVariant(variant, index)"
                            class="w-full px-3 py-2 text-left text-sm text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
                          >
                            <CopyIcon class="w-4 h-4 mr-2 text-emerald-600" />
                            Dupliquer
                          </button>
                          <button
                            @click="toggleAvailability(variant, index)"
                            class="w-full px-3 py-2 text-left text-sm text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
                          >
                            <component :is="variant.is_available !== false ? EyeOffIcon : EyeIcon" class="w-4 h-4 mr-2 text-amber-600" />
                            {{ variant.is_available !== false ? 'Masquer' : 'Afficher' }}
                          </button>
                          <div class="border-t border-emerald-200/30 my-1"></div>
                          <button
                            @click="deleteVariant(variant, index)"
                            class="w-full px-3 py-2 text-left text-sm text-red-800 hover:bg-red-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
                          >
                            <Trash2Icon class="w-4 h-4 mr-2 text-red-500" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message vide -->
          <div
            v-if="filteredVariants.length === 0"
            key="empty-state"
            class="px-6 py-16 text-center"
          >
            <div class="max-w-md mx-auto">
              <div class="relative w-24 h-24 mx-auto mb-6">
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-100 to-amber-100 rounded-full opacity-60 animate-pulse"></div>
                <PackageXIcon class="relative w-full h-full text-emerald-400 p-6" />
              </div>
              <h3 class="text-xl font-semibold text-emerald-800 mb-2">
                Aucune variante trouvée
              </h3>
              <p class="text-amber-700/60 mb-6">
                {{ searchQuery ? 'Aucune variante ne correspond à votre recherche.' : 'Commencez par ajouter votre première variante.' }}
              </p>
              <button
                v-if="!searchQuery"
                @click="$emit('add-variant')"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200"
              >
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Ajouter une variante
              </button>
              <button
                v-else
                @click="searchQuery = ''"
                class="inline-flex items-center px-6 py-3 text-emerald-700 bg-emerald-100/50 border border-emerald-300/50 rounded-xl hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all duration-300 ease-organic"
              >
                <XIcon class="w-5 h-5 mr-2" />
                Réinitialiser la recherche
              </button>
            </div>
          </div>
        </TransitionGroup>

        <!-- Pied de tableau -->
        <div v-if="filteredVariants.length > 0" class="px-6 py-4 border-t border-emerald-200/50 bg-gradient-to-r from-emerald-50/30 to-amber-50/30">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="text-sm text-amber-700/70">
              Affichage de {{ filteredVariants.length }} variante(s) sur {{ variants.length }}
            </div>
            <div class="flex items-center space-x-4">
              <!-- Pagination -->
              <div class="flex items-center space-x-2">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="p-2 rounded-lg border border-emerald-200/50 hover:bg-amber-50/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-organic"
                >
                  <ChevronLeftIcon class="w-4 h-4 text-emerald-700" />
                </button>
                <span class="text-sm font-medium text-emerald-800">
                  Page {{ currentPage }} sur {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="p-2 rounded-lg border border-emerald-200/50 hover:bg-amber-50/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-organic"
                >
                  <ChevronRightIcon class="w-4 h-4 text-emerald-700" />
                </button>
              </div>

              <!-- Sélection du nombre d'éléments par page -->
              <div class="flex items-center space-x-2">
                <span class="text-sm text-amber-700/70">Afficher :</span>
                <select
                  v-model="itemsPerPage"
                  class="px-3 py-1.5 border border-emerald-200/50 rounded-lg bg-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-300 ease-organic"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé des actions -->
      <Transition
        enter-active-class="transition-all duration-500 ease-organic"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-organic"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="selectedVariants.length > 0" class="mt-6">
          <div class="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 rounded-2xl p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-amber-100">
                  <CheckSquareIcon class="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-emerald-800">
                    {{ selectedVariants.length }} variante(s) sélectionnée(s)
                  </h4>
                  <p class="text-sm text-amber-700/60">
                    Actions disponibles pour les variantes sélectionnées
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  @click="clearSelection"
                  class="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100/50 border border-amber-300/50 rounded-xl hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all duration-300 ease-organic"
                >
                  Annuler la sélection
                </button>
                <button
                  @click="exportSelected"
                  class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200"
                >
                  Exporter la sélection
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createEmojiIcon } from '@/shared/components/icons/emoji'

const LayersIcon = createEmojiIcon('🗂️', 'Layers')
const PackageIcon = createEmojiIcon('📦', 'Package')
const DollarSignIcon = createEmojiIcon('💲', 'Dollar')
const BarChart3Icon = createEmojiIcon('📊', 'Chart')
const TrendingUpIcon = createEmojiIcon('📈', 'TrendingUp')
const SearchIcon = createEmojiIcon('🔍', 'Search')
const TagIcon = createEmojiIcon('🏷️', 'Tag')
const ActivityIcon = createEmojiIcon('📈', 'Activity')
const SettingsIcon = createEmojiIcon('⚙️', 'Settings')
const EyeIcon = createEmojiIcon('👁️', 'Eye')
const EyeOffIcon = createEmojiIcon('🙈', 'EyeOff')
const EditIcon = createEmojiIcon('✏️', 'Edit')
const StarIcon = createEmojiIcon('⭐', 'Star')
const MoreVerticalIcon = createEmojiIcon('⋮', 'More')
const CopyIcon = createEmojiIcon('📋', 'Copy')
const Trash2Icon = createEmojiIcon('🗑️', 'Trash')
const DownloadIcon = createEmojiIcon('⬇️', 'Download')
const CheckSquareIcon = createEmojiIcon('☑️', 'CheckSquare')
const CheckCircleIcon = createEmojiIcon('✅', 'CheckCircle')
const XCircleIcon = createEmojiIcon('⛔', 'XCircle')
const ChevronLeftIcon = createEmojiIcon('◀', 'ChevronLeft')
const ChevronRightIcon = createEmojiIcon('▶', 'ChevronRight')
const PlusCircleIcon = createEmojiIcon('➕', 'PlusCircle')
const XIcon = createEmojiIcon('✕', 'Close')
const PackageXIcon = createEmojiIcon('📦', 'PackageX')

// Props
interface Props {
  variants: any[]
  basePrice?: number
  maxStock?: number
}

const props = withDefaults(defineProps<Props>(), {
  variants: () => [],
  basePrice: 0,
  maxStock: 1000
})

// Émits
const emit = defineEmits([
  'view-variant',
  'edit-variant',
  'delete-variant',
  'duplicate-variant',
  'update-variant',
  'export-variants',
  'add-variant'
])

// États réactifs
const searchQuery = ref('')
const selectedFilter = ref('all')
const selectedVariants = ref<any[]>([])
const actionMenuIndex = ref<number | null>(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Pattern SVG pour la texture
const variantListPattern = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="list-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" stroke-width="0.3" opacity="0.02"/>
    </pattern>
    <pattern id="list-diamonds" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M30,0 L60,30 L30,60 L0,30 Z" fill="none" stroke="#f59e0b" stroke-width="0.2" opacity="0.015"/>
      <path d="M30,15 L45,30 L30,45 L15,30 Z" fill="none" stroke="#10b981" stroke-width="0.2" opacity="0.015"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#list-grid)"/>
  <rect width="200" height="200" fill="url(#list-diamonds)"/>
</svg>`

// Computed
const filteredVariants = computed(() => {
  let filtered = [...props.variants]

  // Recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(variant =>
      variant.name?.toLowerCase().includes(query) ||
      variant.sku?.toLowerCase().includes(query) ||
      variant.color_name?.toLowerCase().includes(query)
    )
  }

  // Filtre
  switch (selectedFilter.value) {
    case 'available':
      filtered = filtered.filter(v => v.is_available !== false)
      break
    case 'low-stock':
      filtered = filtered.filter(v => (v.stock || 0) > 0 && (v.stock || 0) < 10)
      break
    case 'out-of-stock':
      filtered = filtered.filter(v => (v.stock || 0) === 0)
      break
    case 'default':
      filtered = filtered.filter(v => v.is_default)
      break
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(props.variants.length / itemsPerPage.value)
})

const totalStock = computed(() => {
  return props.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
})

const availableCount = computed(() => {
  return props.variants.filter(v => v.is_available !== false).length
})

const priceRange = computed(() => {
  if (props.variants.length === 0) return { min: 0, max: 0 }
  
  const prices = props.variants.map(v => props.basePrice + (v.price_modifier || 0))
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
})

const allSelected = computed(() => {
  return filteredVariants.value.length > 0 && 
         filteredVariants.value.every(v => isSelected(v))
})

const stockTrendClass = computed(() => {
  const total = totalStock.value
  const avg = props.variants.length > 0 ? total / props.variants.length : 0
  return avg > 50 ? 'text-emerald-500' : avg > 10 ? 'text-amber-500' : 'text-red-500'
})

const availabilityTrendClass = computed(() => {
  const percentage = props.variants.length > 0 
    ? (availableCount.value / props.variants.length) * 100 
    : 0
  return percentage > 75 ? 'text-emerald-500' : percentage > 50 ? 'text-amber-500' : 'text-red-500'
})

const priceTrendClass = computed(() => {
  const avg = priceRange.value.max - priceRange.value.min
  return avg < 1000 ? 'text-emerald-500' : avg < 5000 ? 'text-amber-500' : 'text-red-500'
})

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
  return 'text-emerald-700'
}

const stockBadgeClass = (variant: any) => {
  if (variant.stock === 0) return 'bg-red-100 text-red-700'
  if (variant.stock < 10) return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}

const stockBarClass = (variant: any) => {
  if (variant.stock === 0) return 'bg-red-500'
  if (variant.stock < 10) return 'bg-amber-500'
  return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
}

const stockPercentage = (variant: any) => {
  return Math.min(Math.round((variant.stock || 0) / props.maxStock * 100), 100)
}

const availabilityDotClass = (variant: any) => {
  return variant.is_available !== false ? 'bg-emerald-500' : 'bg-amber-500'
}

const availabilityPingClass = (variant: any) => {
  return variant.is_available !== false ? 'bg-emerald-500/30' : 'bg-amber-500/30'
}

const availabilityTextClass = (variant: any) => {
  return variant.is_available !== false ? 'text-emerald-700' : 'text-amber-700'
}

const isSelected = (variant: any) => {
  return selectedVariants.value.some(v => 
    (v.id && v.id === variant.id) || 
    (v.tempId && v.tempId === variant.tempId) ||
    (!v.id && !variant.id && v.name === variant.name && v.sku === variant.sku)
  )
}

const toggleSelection = (variant: any) => {
  const index = selectedVariants.value.findIndex(v => 
    (v.id && v.id === variant.id) || 
    (v.tempId && v.tempId === variant.tempId) ||
    (!v.id && !variant.id && v.name === variant.name && v.sku === variant.sku)
  )
  
  if (index > -1) {
    selectedVariants.value.splice(index, 1)
  } else {
    selectedVariants.value.push(variant)
  }
}

const toggleAllSelection = () => {
  if (allSelected.value) {
    selectedVariants.value = selectedVariants.value.filter(v => 
      !filteredVariants.value.some(fv => 
        (fv.id && fv.id === v.id) || 
        (fv.tempId && fv.tempId === v.tempId) ||
        (!fv.id && !v.id && fv.name === v.name && fv.sku === v.sku)
      )
    )
  } else {
    const newSelections = filteredVariants.value.filter(fv => 
      !selectedVariants.value.some(v => 
        (v.id && v.id === fv.id) || 
        (v.tempId && v.tempId === fv.tempId) ||
        (!v.id && !fv.id && v.name === fv.name && v.sku === fv.sku)
      )
    )
    selectedVariants.value.push(...newSelections)
  }
}

const clearSelection = () => {
  selectedVariants.value = []
}

const viewVariant = (variant: any) => {
  emit('view-variant', variant)
}

const editVariant = (variant: any, index: number) => {
  emit('edit-variant', { variant, index })
}

const deleteVariant = (variant: any, index: number) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la variante "${variant.name || 'Sans nom'}" ?`)) {
    emit('delete-variant', { variant, index })
  }
  closeActionMenu()
}

const duplicateVariant = (variant: any, index: number) => {
  emit('duplicate-variant', { variant, index })
  closeActionMenu()
}

const toggleAvailability = (variant: any, index: number) => {
  const updatedVariant = {
    ...variant,
    is_available: variant.is_available !== false ? false : true
  }
  emit('update-variant', { variant: updatedVariant, index })
  closeActionMenu()
}

const setAsDefault = (variant: any, index: number) => {
  const updatedVariants = props.variants.map(v => ({
    ...v,
    is_default: (v.id && v.id === variant.id) || 
                (v.tempId && v.tempId === variant.tempId) ||
                (!v.id && !variant.id && v.name === variant.name && v.sku === variant.sku)
  }))
  
  emit('update-variant', { variant: { ...variant, is_default: true }, index })
  
  // Mettre à jour les autres variantes pour qu'elles ne soient plus par défaut
  updatedVariants.forEach((v, i) => {
    if (i !== index && v.is_default) {
      emit('update-variant', { variant: { ...v, is_default: false }, index: i })
    }
  })
}

const bulkUpdateStatus = (status: boolean) => {
  if (selectedVariants.value.length === 0) return
  
  selectedVariants.value.forEach((variant, index) => {
    const variantIndex = props.variants.findIndex(v => 
      (v.id && v.id === variant.id) || 
      (v.tempId && v.tempId === variant.tempId) ||
      (!v.id && !variant.id && v.name === variant.name && v.sku === variant.sku)
    )
    
    if (variantIndex !== -1) {
      const updatedVariant = { ...variant, is_available: status }
      emit('update-variant', { variant: updatedVariant, index: variantIndex })
    }
  })
  
  selectedVariants.value = []
}

const bulkDelete = () => {
  if (selectedVariants.value.length === 0) return
  
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedVariants.value.length} variante(s) ?`)) {
    selectedVariants.value.forEach(variant => {
      const variantIndex = props.variants.findIndex(v => 
        (v.id && v.id === variant.id) || 
        (v.tempId && v.tempId === variant.tempId) ||
        (!v.id && !variant.id && v.name === variant.name && v.sku === variant.sku)
      )
      
      if (variantIndex !== -1) {
        emit('delete-variant', { variant, index: variantIndex })
      }
    })
    
    selectedVariants.value = []
  }
}

const exportVariants = () => {
  emit('export-variants', props.variants)
}

const exportSelected = () => {
  emit('export-variants', selectedVariants.value)
}

const toggleActionMenu = (index: number) => {
  actionMenuIndex.value = actionMenuIndex.value === index ? null : index
}

const closeActionMenu = () => {
  actionMenuIndex.value = null
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Gestionnaire de clic externe pour fermer les menus
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  const actionMenuRef = document.querySelector('.action-menu')
  
  if (actionMenuRef && !actionMenuRef.contains(target)) {
    closeActionMenu()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Transitions organiques */
.ease-organic {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations pour la liste */
.variant-list-enter-active,
.variant-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.variant-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.variant-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.variant-list-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Style des cartes de statistiques */
.stat-card {
  @apply relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-4 flex items-center space-x-4;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  @apply bg-white shadow-lg;
  transform: translateY(-2px);
}

.stat-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0;
}

.stat-content {
  @apply flex-1;
}

.stat-value {
  @apply text-2xl font-bold;
}

.stat-label {
  @apply text-sm text-amber-700/60;
}

.stat-trend {
  @apply absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

/* Style des lignes de variantes */
.variant-row {
  @apply transition-all duration-300 ease-organic;
}

.variant-row:hover {
  @apply bg-emerald-50/30;
}

.variant-row:nth-child(even) {
  @apply bg-emerald-50/10;
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

/* Effet de texture organique */
@keyframes organic-shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.organic-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: organic-shimmer 3s infinite linear;
}

/* Animation de pulse pour les éléments importants */
@keyframes important-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.important-pulse {
  animation: important-pulse 2s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 1024px) {
  .variant-row .grid-cols-12 {
    grid-template-columns: repeat(6, 1fr);
    gap: 2rem;
  }
  
  .variant-row .col-span-1,
  .variant-row .col-span-2,
  .variant-row .col-span-3 {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .variant-row .grid-cols-12 {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .variant-row .col-span-1,
  .variant-row .col-span-2,
  .variant-row .col-span-3 {
    grid-column: span 1;
  }
  
  .stat-card {
    @apply p-3;
  }
  
  .stat-value {
    @apply text-xl;
  }
}

@media (max-width: 480px) {
  .variant-row {
    @apply px-4 py-3;
  }
  
  .variant-row .grid-cols-12 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    @apply flex-col items-start space-x-0 space-y-3;
  }
  
  .stat-content {
    @apply w-full;
  }
}

/* Effet de rebond léger */
@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.gentle-bounce {
  animation: gentle-bounce 3s ease-in-out infinite;
}

/* Style pour les indicateurs de progression */
.progress-indicator {
  position: relative;
  overflow: hidden;
}

.progress-indicator::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Effet de focus organique */
.organic-focus {
  position: relative;
}

.organic-focus::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, #10b981, #f59e0b);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.organic-focus:focus-within::after {
  opacity: 0.3;
}
</style>
