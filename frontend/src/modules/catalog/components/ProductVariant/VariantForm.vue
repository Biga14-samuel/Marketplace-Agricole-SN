<template>
    <div class="variant-form-container">
        <!-- Background organique avec texture de marché -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-amber-50/30 to-emerald-100/30 rounded-3xl z-0">
            <div class="absolute inset-0 opacity-5 z-0"
                :style="{ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(variantPattern)}')` }">
            </div>
        </div>

        <div class="relative z-10">
            <!-- En-tête inspiré des étals de marché -->
            <div class="mb-8">
                <div class="inline-block p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-amber-500/10 mb-4">
                    <div class="flex items-center space-x-3">
                        <LayersIcon class="w-8 h-8 text-emerald-600" />
                        <h2
                            class="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
                            Gestion des Variantes
                        </h2>
                        <PackageIcon class="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
                <p class="text-amber-800/70 max-w-2xl">
                    Créez des variantes pour votre produit (tailles, couleurs, qualités, etc.).
                    Chaque variante peut avoir son propre prix et stock.
                </p>
            </div>

            <!-- Mode d'affichage -->
            <div class="mb-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-amber-100">
                            <LayoutGridIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-emerald-800">
                                {{ variants.length }} variante(s) configurée(s)
                            </h3>
                            <p class="text-sm text-amber-700/60">
                                Organisez les différentes versions de votre produit
                            </p>
                        </div>
                    </div>

                    <!-- Bouton de bascule de vue -->
                    <div class="flex items-center space-x-2">
                        <button @click="toggleViewMode"
                            class="p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 hover:bg-amber-50/80 transition-all duration-300 ease-organic"
                            :class="{ 'bg-amber-50/80 text-amber-700': isListView }"
                            :title="isListView ? 'Passer en vue cartes' : 'Passer en vue liste'">
                            <component :is="isListView ? LayoutGridIcon : ListIcon" class="w-5 h-5" />
                        </button>

                        <!-- Statistiques -->
                        <div class="hidden md:flex items-center space-x-4">
                            <div class="px-3 py-1.5 rounded-lg bg-emerald-100/50 border border-emerald-200/50">
                                <span class="text-sm font-medium text-emerald-800">
                                    Total stock: {{ totalStock }}
                                </span>
                            </div>
                            <div class="px-3 py-1.5 rounded-lg bg-amber-100/50 border border-amber-200/50">
                                <span class="text-sm font-medium text-amber-800">
                                    Prix moyen: {{ averagePrice }} FCFA
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Formulaire d'ajout de variante -->
            <Transition enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-organic"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
                <div v-if="showAddForm" class="mb-8">
                    <div class="relative group">
                        <!-- Effet de lumière autour du formulaire -->
                        <div
                            class="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 ease-organic">
                        </div>

                        <div
                            class="relative bg-white/90 backdrop-blur-sm rounded-2xl border-3 border-emerald-200/50 shadow-lg overflow-hidden">
                            <!-- En-tête du formulaire -->
                            <div
                                class="px-6 py-4 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-50/60 to-amber-50/60">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <PlusCircleIcon class="w-6 h-6 text-emerald-600" />
                                        <h4 class="text-lg font-semibold text-emerald-800">
                                            {{ editingVariant ? 'Modifier la variante' : 'Nouvelle variante' }}
                                        </h4>
                                    </div>
                                    <button @click="cancelEdit"
                                        class="p-2 rounded-lg hover:bg-amber-50 transition-all duration-200 ease-organic">
                                        <XIcon class="w-5 h-5 text-amber-600" />
                                    </button>
                                </div>
                            </div>

                            <!-- Formulaire -->
                            <div class="p-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <!-- Nom de la variante -->
                                    <div class="form-group">
                                        <label class="form-label">
                                            <TagIcon class="w-4 h-4" />
                                            Nom de la variante *
                                        </label>
                                        <input v-model="newVariant.name" type="text"
                                            placeholder="Ex: Grande taille, Bio, Rouge, Premium..." class="form-input"
                                            :class="{ 'border-emerald-400 ring-2 ring-emerald-200': newVariant.name }"
                                            required />
                                        <p class="form-hint">
                                            Décrivez la particularité de cette variante
                                        </p>
                                    </div>

                                    <!-- Prix modificateur -->
                                    <div class="form-group">
                                        <label class="form-label">
                                            <DollarSignIcon class="w-4 h-4" />
                                            Modification de prix *
                                        </label>
                                        <div class="relative">
                                            <div
                                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 font-medium">
                                                FCFA
                                            </div>
                                            <input v-model.number="newVariant.price_modifier" type="number" step="50"
                                                placeholder="0" class="form-input pl-16" :class="[
                                                    newVariant.price_modifier > 0
                                                        ? 'border-emerald-400 ring-2 ring-emerald-200'
                                                        : newVariant.price_modifier < 0
                                                            ? 'border-red-400 ring-2 ring-red-200'
                                                            : ''
                                                ]" required />
                                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <span class="text-sm font-medium" :class="priceModifierClass">
                                                    {{ priceModifierPercentage }}
                                                </span>
                                            </div>
                                        </div>
                                        <p class="form-hint">
                                            Ajout ou réduction par rapport au prix de base
                                        </p>
                                    </div>

                                    <!-- Stock -->
                                    <div class="form-group">
                                        <label class="form-label">
                                            <PackageIcon class="w-4 h-4" />
                                            Stock disponible *
                                        </label>
                                        <input v-model.number="newVariant.stock" type="number" min="0" placeholder="0"
                                            class="form-input"
                                            :class="{ 'border-emerald-400 ring-2 ring-emerald-200': newVariant.stock > 0 }"
                                            required />
                                        <div class="flex items-center space-x-2 mt-2">
                                            <div class="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                                                <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ease-organic"
                                                    :style="{ width: `${stockPercentage}%` }"></div>
                                            </div>
                                            <span class="text-xs font-medium text-emerald-700">
                                                {{ stockPercentage }}%
                                            </span>
                                        </div>
                                    </div>

                                    <!-- SKU -->
                                    <div class="form-group">
                                        <label class="form-label">
                                            <HashIcon class="w-4 h-4" />
                                            Référence SKU
                                        </label>
                                        <input v-model="newVariant.sku" type="text" placeholder="Ex: PROD-VAR-001"
                                            class="form-input"
                                            :class="{ 'border-emerald-400 ring-2 ring-emerald-200': newVariant.sku }" />
                                        <p class="form-hint">
                                            Identifiant unique pour la gestion des stocks
                                        </p>
                                    </div>
                                </div>

                                <!-- Attributs supplémentaires -->
                                <div class="mt-6 pt-6 border-t border-emerald-200/50">
                                    <h5 class="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                                        <SettingsIcon class="w-4 h-4 mr-2" />
                                        Options supplémentaires
                                    </h5>

                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <!-- Poids/Volume -->
                                        <div class="form-group">
                                            <label class="form-label">
                                                <ScaleIcon class="w-4 h-4" />
                                                Poids / Volume
                                            </label>
                                            <div class="flex space-x-2">
                                                <input v-model="newVariant.weight" type="number" step="0.1"
                                                    placeholder="0" class="form-input flex-1" />
                                                <select v-model="newVariant.weight_unit" class="form-select w-24">
                                                    <option value="g">g</option>
                                                    <option value="kg">kg</option>
                                                    <option value="ml">ml</option>
                                                    <option value="L">L</option>
                                                    <option value="unité">unité</option>
                                                </select>
                                            </div>
                                        </div>

                                        <!-- Code couleur -->
                                        <div class="form-group">
                                            <label class="form-label">
                                                <PaletteIcon class="w-4 h-4" />
                                                Couleur
                                            </label>
                                            <div class="flex items-center space-x-3">
                                                <input v-model="newVariant.color" type="color"
                                                    class="w-10 h-10 rounded-lg cursor-pointer border border-emerald-200/50" />
                                                <input v-model="newVariant.color_name" type="text"
                                                    placeholder="Nom de la couleur" class="form-input flex-1" />
                                            </div>
                                        </div>

                                        <!-- Disponibilité -->
                                        <div class="form-group">
                                            <label class="form-label">
                                                <CalendarIcon class="w-4 h-4" />
                                                Disponibilité
                                            </label>
                                            <div class="space-y-2">
                                                <label class="flex items-center space-x-2">
                                                    <input v-model="newVariant.is_available" type="checkbox"
                                                        class="rounded text-emerald-600 focus:ring-emerald-500" />
                                                    <span class="text-sm text-emerald-800">Disponible à la vente</span>
                                                </label>
                                                <label class="flex items-center space-x-2">
                                                    <input v-model="newVariant.is_default" type="checkbox"
                                                        class="rounded text-amber-600 focus:ring-amber-500" />
                                                    <span class="text-sm text-amber-800">Variante par défaut</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Boutons d'action -->
                                <div class="mt-8 pt-6 border-t border-emerald-200/50 flex justify-end space-x-4">
                                    <button @click="cancelEdit" type="button"
                                        class="px-6 py-3 text-sm font-medium text-amber-700 bg-amber-100/50 border border-amber-300/50 rounded-xl hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all duration-300 ease-organic">
                                        Annuler
                                    </button>
                                    <button @click="addOrUpdateVariant" type="button" :disabled="!isValidVariant"
                                        class="px-8 py-3 text-sm font-medium text-white rounded-xl transition-all duration-300 ease-organic disabled:opacity-50 disabled:cursor-not-allowed"
                                        :class="[
                                            isValidVariant
                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 shadow-lg shadow-emerald-200'
                                                : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                        ]">
                                        <SaveIcon class="w-4 h-4 inline mr-2" />
                                        {{ editingVariant ? 'Mettre à jour' : 'Ajouter la variante' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- Bouton pour ajouter une variante -->
            <Transition enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition-all duration-300 ease-organic" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <div v-if="!showAddForm" class="mb-8 text-center">
                    <button @click="showAddForm = true"
                        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-2xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200 group">
                        <PlusCircleIcon
                            class="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500 ease-organic" />
                        Ajouter une nouvelle variante
                    </button>
                    <p class="text-sm text-amber-700/60 mt-3">
                        Créez différentes versions de votre produit pour répondre à tous les besoins
                    </p>
                </div>
            </Transition>

            <!-- Liste des variantes -->
            <TransitionGroup v-if="variants.length > 0" :name="isListView ? 'list-item' : 'grid-item'" tag="div"
                class="mb-8" :class="isListView ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'">
                <!-- Variante en mode liste -->
                <div v-for="(variant, index) in variants" :key="variant.id || index" :class="[
                    isListView
                        ? 'variant-list-item group'
                        : 'variant-card group'
                ]">
                    <!-- Background de la carte -->
                    <div class="absolute inset-0 rounded-2xl overflow-hidden z-0">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/90 to-emerald-50/50"></div>
                        <div class="absolute inset-0 border-2 transition-all duration-300 ease-organic" :class="[
                            variant.is_default
                                ? 'border-emerald-400/50 shadow-lg shadow-emerald-200/50'
                                : 'border-emerald-200/30 group-hover:border-emerald-300/50'
                        ]"></div>
                    </div>

                    <div class="relative z-10 p-5">
                        <!-- En-tête de la variante -->
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <div class="flex items-center space-x-2 mb-1">
                                    <h4 class="text-lg font-semibold text-emerald-800 truncate">
                                        {{ variant.name || 'Sans nom' }}
                                    </h4>
                                    <span v-if="variant.is_default"
                                        class="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-full">
                                        Par défaut
                                    </span>
                                </div>
                                <div class="flex items-center space-x-3 text-sm text-amber-700/60">
                                    <span v-if="variant.sku" class="font-mono bg-emerald-100 px-2 py-0.5 rounded">
                                        {{ variant.sku }}
                                    </span>
                                    <span v-if="variant.color_name" class="flex items-center">
                                        <div class="w-3 h-3 rounded-full mr-1 border border-emerald-200"
                                            :style="{ backgroundColor: variant.color || '#10b981' }"></div>
                                        {{ variant.color_name }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions rapides -->
                            <div class="flex items-center space-x-1">
                                <button @click="editVariant(index)"
                                    class="p-2 rounded-lg hover:bg-emerald-50 transition-all duration-200 ease-organic"
                                    title="Modifier">
                                    <EditIcon class="w-4 h-4 text-emerald-600" />
                                </button>
                                <button @click="duplicateVariant(index)"
                                    class="p-2 rounded-lg hover:bg-amber-50 transition-all duration-200 ease-organic"
                                    title="Dupliquer">
                                    <CopyIcon class="w-4 h-4 text-amber-600" />
                                </button>
                                <button @click="removeVariant(index)"
                                    class="p-2 rounded-lg hover:bg-red-50 transition-all duration-200 ease-organic"
                                    title="Supprimer">
                                    <Trash2Icon class="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>

                        <!-- Détails de la variante -->
                        <div :class="isListView ? 'grid grid-cols-4 gap-4' : 'space-y-4'">
                            <!-- Prix -->
                            <div class="detail-item">
                                <div class="detail-label">
                                    <DollarSignIcon class="w-4 h-4" />
                                    Prix
                                </div>
                                <div class="detail-value">
                                    <span class="text-lg font-bold text-emerald-700">
                                        {{ formatPrice(calculateVariantPrice(variant)) }} FCFA
                                    </span>
                                    <span class="text-sm ml-2" :class="priceModifierClass(variant)">
                                        {{ formatPriceModifier(variant.price_modifier || 0) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Stock -->
                            <div class="detail-item">
                                <div class="detail-label">
                                    <PackageIcon class="w-4 h-4" />
                                    Stock
                                </div>
                                <div class="detail-value">
                                    <span class="text-lg font-bold" :class="stockClass(variant)">
                                        {{ variant.stock }} unités
                                    </span>
                                    <div class="w-full h-2 bg-amber-100 rounded-full overflow-hidden mt-1">
                                        <div class="h-full rounded-full transition-all duration-500 ease-organic"
                                            :class="stockBarClass(variant)"
                                            :style="{ width: `${(variant.stock / maxStock) * 100}%` }"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Poids -->
                            <div v-if="variant.weight" class="detail-item">
                                <div class="detail-label">
                                    <ScaleIcon class="w-4 h-4" />
                                    Poids
                                </div>
                                <div class="detail-value">
                                    <span class="text-lg font-medium text-emerald-800">
                                        {{ variant.weight }} {{ variant.weight_unit || 'g' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Disponibilité -->
                            <div class="detail-item">
                                <div class="detail-label">
                                    <CalendarIcon class="w-4 h-4" />
                                    Statut
                                </div>
                                <div class="detail-value">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                        :class="availabilityClass(variant)">
                                        <div class="w-2 h-2 rounded-full mr-1.5" :class="availabilityDotClass(variant)">
                                        </div>
                                        {{ variant.is_available !== false ? 'Disponible' : 'Indisponible' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Description (si disponible) -->
                        <div v-if="variant.description" class="mt-4 pt-4 border-t border-emerald-200/30">
                            <p class="text-sm text-amber-700/70 line-clamp-2">
                                {{ variant.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </TransitionGroup>

            <!-- Message vide -->
            <Transition enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition-all duration-300 ease-organic" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <div v-if="variants.length === 0" class="text-center py-16">
                    <div class="max-w-md mx-auto">
                        <div class="relative w-32 h-32 mx-auto mb-6">
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-emerald-100 to-amber-100 rounded-full opacity-60 animate-pulse">
                            </div>
                            <LayersIcon class="relative w-full h-full text-emerald-500 p-8" />
                        </div>
                        <h3 class="text-xl font-semibold text-emerald-800 mb-2">
                            Aucune variante configurée
                        </h3>
                        <p class="text-amber-700/60 mb-6">
                            Commencez par ajouter votre première variante pour personnaliser votre produit
                        </p>
                        <button @click="showAddForm = true"
                            class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200">
                            <PlusCircleIcon class="w-5 h-5 mr-2" />
                            Créer une première variante
                        </button>
                    </div>
                </div>
            </Transition>

            <!-- Résumé -->
            <Transition enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-organic"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
                <div v-if="variants.length > 0" class="mt-8">
                    <div
                        class="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 rounded-2xl p-6">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div class="summary-item">
                                <div class="summary-icon bg-emerald-100/50">
                                    <LayersIcon class="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div class="summary-value text-emerald-700">
                                        {{ variants.length }}
                                    </div>
                                    <div class="summary-label">
                                        Variantes
                                    </div>
                                </div>
                            </div>

                            <div class="summary-item">
                                <div class="summary-icon bg-amber-100/50">
                                    <PackageIcon class="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <div class="summary-value text-amber-700">
                                        {{ totalStock }}
                                    </div>
                                    <div class="summary-label">
                                        Unités totales
                                    </div>
                                </div>
                            </div>

                            <div class="summary-item">
                                <div class="summary-icon bg-blue-100/50">
                                    <DollarSignIcon class="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div class="summary-value text-blue-700">
                                        {{ formatPrice(priceRange.min) }} - {{ formatPrice(priceRange.max) }}
                                    </div>
                                    <div class="summary-label">
                                        Fourchette de prix
                                    </div>
                                </div>
                            </div>

                            <div class="summary-item">
                                <div class="summary-icon bg-purple-100/50">
                                    <TrendingUpIcon class="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div class="summary-value text-purple-700">
                                        {{ availableVariants }}
                                    </div>
                                    <div class="summary-label">
                                        Disponibles
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { createEmojiIcon } from '@/shared/components/icons/emoji'

const LayersIcon = createEmojiIcon('🗂️', 'Layers')
const PackageIcon = createEmojiIcon('📦', 'Package')
const LayoutGridIcon = createEmojiIcon('🔲', 'Grid')
const ListIcon = createEmojiIcon('📋', 'List')
const PlusCircleIcon = createEmojiIcon('➕', 'PlusCircle')
const XIcon = createEmojiIcon('✕', 'Close')
const TagIcon = createEmojiIcon('🏷️', 'Tag')
const DollarSignIcon = createEmojiIcon('💲', 'Dollar')
const HashIcon = createEmojiIcon('#️⃣', 'Hash')
const SettingsIcon = createEmojiIcon('⚙️', 'Settings')
const ScaleIcon = createEmojiIcon('⚖️', 'Scale')
const PaletteIcon = createEmojiIcon('🎨', 'Palette')
const CalendarIcon = createEmojiIcon('📅', 'Calendar')
const SaveIcon = createEmojiIcon('💾', 'Save')
const EditIcon = createEmojiIcon('✏️', 'Edit')
const CopyIcon = createEmojiIcon('📋', 'Copy')
const Trash2Icon = createEmojiIcon('🗑️', 'Trash')
const TrendingUpIcon = createEmojiIcon('📈', 'TrendingUp')

// Props
interface Props {
    modelValue: any[]
    productId?: number
    basePrice?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    basePrice: 0
})

// Émits
const emit = defineEmits(['update:modelValue', 'save', 'error'])

// États réactifs
const variants = ref<any[]>([])
const showAddForm = ref(false)
const editingVariant = ref<number | null>(null)
const isListView = ref(false)

// Nouvelle variante
const newVariant = ref({
    name: '',
    price_modifier: 0,
    stock: 0,
    sku: '',
    weight: null as number | null,
    weight_unit: 'g',
    color: '#10b981',
    color_name: '',
    description: '',
    is_available: true,
    is_default: false
})

// Pattern SVG pour la texture
const variantPattern = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="variant-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" stroke-width="0.5" opacity="0.03"/>
    </pattern>
    <pattern id="variant-dots" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="2" fill="#10b981" opacity="0.05"/>
      <circle cx="45" cy="15" r="2" fill="#f59e0b" opacity="0.05"/>
      <circle cx="15" cy="45" r="2" fill="#f59e0b" opacity="0.05"/>
      <circle cx="45" cy="45" r="2" fill="#10b981" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#variant-grid)"/>
  <rect width="200" height="200" fill="url(#variant-dots)"/>
</svg>`

// Computed
const totalStock = computed(() => {
    return variants.value.reduce((sum, variant) => sum + (variant.stock || 0), 0)
})

const averagePrice = computed(() => {
    if (variants.value.length === 0) return 0
    const total = variants.value.reduce((sum, variant) => {
        return sum + (props.basePrice + (variant.price_modifier || 0))
    }, 0)
    return Math.round(total / variants.value.length)
})

const priceRange = computed(() => {
    if (variants.value.length === 0) return { min: 0, max: 0 }

    const prices = variants.value.map(v => props.basePrice + (v.price_modifier || 0))
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    }
})

const availableVariants = computed(() => {
    return variants.value.filter(v => v.is_available !== false).length
})

const maxStock = computed(() => {
    if (variants.value.length === 0) return 1
    return Math.max(...variants.value.map(v => v.stock || 0), 1)
})

const isValidVariant = computed(() => {
    return newVariant.value.name.trim() !== '' &&
        newVariant.value.stock >= 0
})

const stockPercentage = computed(() => {
    const max = 1000 // Stock maximum théorique
    return Math.min(Math.round((newVariant.value.stock / max) * 100), 100)
})

const priceModifierClass = computed(() => {
    return newVariant.value.price_modifier > 0
        ? 'text-emerald-600'
        : newVariant.value.price_modifier < 0
            ? 'text-red-600'
            : 'text-amber-600'
})

const priceModifierPercentage = computed(() => {
    if (props.basePrice === 0) return '0%'
    const percentage = (newVariant.value.price_modifier / props.basePrice) * 100
    return `${percentage > 0 ? '+' : ''}${Math.round(percentage)}%`
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

const stockClass = (variant: any) => {
    if (variant.stock === 0) return 'text-red-600'
    if (variant.stock < 10) return 'text-amber-600'
    return 'text-emerald-700'
}

const stockBarClass = (variant: any) => {
    if (variant.stock === 0) return 'bg-red-500'
    if (variant.stock < 10) return 'bg-amber-500'
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
}

const availabilityClass = (variant: any) => {
    return variant.is_available !== false
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-amber-100 text-amber-800'
}

const availabilityDotClass = (variant: any) => {
    return variant.is_available !== false
        ? 'bg-emerald-500'
        : 'bg-amber-500'
}

const toggleViewMode = () => {
    isListView.value = !isListView.value
}

const addOrUpdateVariant = () => {
    if (!isValidVariant.value) return

    const variantData = { ...newVariant.value }

    if (editingVariant.value !== null) {
        // Mettre à jour la variante existante
        variants.value[editingVariant.value] = {
            ...variants.value[editingVariant.value],
            ...variantData
        }
    } else {
        // Ajouter une nouvelle variante
        // Si c'est la première variante ou si elle est marquée comme défaut, la définir comme défaut
        if (variants.value.length === 0 || variantData.is_default) {
            // Désélectionner les autres variantes par défaut
            variants.value.forEach(v => v.is_default = false)
            variantData.is_default = true
        }

        variants.value.push({
            id: Date.now(), // ID temporaire
            ...variantData
        })
    }

    // Émettre la mise à jour
    emit('update:modelValue', variants.value)

    // Réinitialiser le formulaire
    resetForm()
}

const editVariant = (index: number) => {
    editingVariant.value = index
    newVariant.value = { ...variants.value[index] }
    showAddForm.value = true

    // Scroll vers le formulaire
    setTimeout(() => {
        document.querySelector('.variant-form-container')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }, 100)
}

const duplicateVariant = (index: number) => {
    const original = variants.value[index]
    const duplicate = {
        ...original,
        id: Date.now(), // Nouvel ID
        name: `${original.name} (Copie)`,
        sku: original.sku ? `${original.sku}-COPY` : '',
        is_default: false // La copie n'est pas par défaut
    }

    variants.value.splice(index + 1, 0, duplicate)
    emit('update:modelValue', variants.value)
}

const removeVariant = (index: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette variante ?')) {
        const removed = variants.value.splice(index, 1)[0]

        // Si on supprime la variante par défaut et qu'il reste des variantes
        if (removed.is_default && variants.value.length > 0) {
            variants.value[0].is_default = true
        }

        emit('update:modelValue', variants.value)
    }
}

const cancelEdit = () => {
    resetForm()
}

const resetForm = () => {
    newVariant.value = {
        name: '',
        price_modifier: 0,
        stock: 0,
        sku: '',
        weight: null,
        weight_unit: 'g',
        color: '#10b981',
        color_name: '',
        description: '',
        is_available: true,
        is_default: false
    }
    editingVariant.value = null
    showAddForm.value = false
}

// Lifecycle
onMounted(() => {
    variants.value = [...props.modelValue]
})

// Watch
watch(() => props.modelValue, (newValue) => {
    variants.value = [...newValue]
}, { deep: true })

watch(() => props.basePrice, () => {
    // Recalculer les prix si le prix de base change
})
</script>

<style scoped>
/* Transitions organiques */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations pour les éléments de liste */
.list-item-enter-active,
.list-item-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-item-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.list-item-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.list-item-move {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations pour les éléments de grille */
.grid-item-enter-active,
.grid-item-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-item-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

.grid-item-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

.grid-item-move {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Style du formulaire */
.border-3 {
    border-width: 3px;
}

.form-group {
    @apply space-y-2;
}

.form-label {
    @apply flex items-center space-x-2 text-sm font-semibold text-emerald-800;
}

.form-input {
    @apply w-full px-4 py-3 border-2 border-emerald-200/50 rounded-xl bg-white/80 backdrop-blur-sm;
    @apply focus:border-emerald-400 focus:ring-3 focus:ring-emerald-200 focus:outline-none;
    @apply transition-all duration-300 ease-organic;
}

.form-select {
    @apply w-full px-4 py-3 border-2 border-emerald-200/50 rounded-xl bg-white/80 backdrop-blur-sm;
    @apply focus:border-emerald-400 focus:ring-3 focus:ring-emerald-200 focus:outline-none;
    @apply transition-all duration-300 ease-organic;
}

.form-hint {
    @apply text-xs text-amber-700/60;
}

/* Style des variantes */
.variant-card {
    @apply relative rounded-2xl transition-all duration-500 ease-organic;
}

.variant-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.1);
}

.variant-list-item {
    @apply relative rounded-2xl transition-all duration-300 ease-organic;
}

.variant-list-item:hover {
    @apply bg-white/95;
    transform: translateX(4px);
}

/* Style des détails */
.detail-item {
    @apply space-y-1;
}

.detail-label {
    @apply flex items-center space-x-1 text-xs font-medium text-amber-700/70;
}

.detail-value {
    @apply text-base font-semibold;
}

/* Style du résumé */
.summary-item {
    @apply flex items-center space-x-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/30;
}

.summary-icon {
    @apply w-12 h-12 rounded-xl flex items-center justify-center;
}

.summary-value {
    @apply text-2xl font-bold;
}

.summary-label {
    @apply text-sm text-amber-700/60;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(254, 243, 199, 0.3);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #10b981, #f59e0b);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0da271, #e38c09);
}

/* Effet de lumière organique */
@keyframes organic-light {
    0% {
        background-position: -200% center;
    }

    100% {
        background-position: 200% center;
    }
}

.organic-light {
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%);
    background-size: 200% 100%;
    animation: organic-light 3s infinite linear;
}

/* Responsive */
@media (max-width: 768px) {
    .variant-card {
        @apply p-4;
    }

    .detail-value {
        @apply text-sm;
    }
}

@media (max-width: 480px) {

    .form-input,
    .form-select {
        @apply py-2.5 text-sm;
    }

    .variant-card {
        @apply p-3;
    }
}

/* Animation de pulse pour les valeurs importantes */
@keyframes value-pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
    }
}

.value-pulse {
    animation: value-pulse 2s ease-in-out infinite;
}

/* Effet de texture granulaire */
.grain-effect {
    position: relative;
}

.grain-effect::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.02;
    pointer-events: none;
    z-index: 1;
}
</style>
