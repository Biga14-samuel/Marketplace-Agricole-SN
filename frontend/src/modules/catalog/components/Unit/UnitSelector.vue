<template>
    <div class="unit-selector-wrapper">
        <!-- Étiquette avec icône organique -->
        <div class="flex items-center mb-3">
            <div class="icon-wrapper mr-2">
                <svg class="leaf-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 18.7 7.79 17.75 8.5 16.99C10.17 15.31 13.3 15.36 15.56 16.85C17.83 18.34 19 21.87 19 21.87C19 21.87 22 19 22 16C22 13 20 8 17 8Z"
                        fill="currentColor" fill-opacity="0.8" />
                    <path
                        d="M15 5C15 5 15.95 2.95 18 2C19.62 2.55 20 4 20 4C20 4 21.45 4.38 22 6C21.05 8.05 19 8 19 8C19 8 18.05 10.05 16 11C14.38 10.45 14 9 14 9C14 9 12.55 9.38 12 11C10.95 9.95 11 8 11 8C11 8 9.95 6.95 8 6C6.38 6.55 6 8 6 8C6 8 4.55 8.38 4 10C5.05 12.05 7 12 7 12"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
            </div>
            <label :for="id" class="form-label text-forest-dark font-semibold">
                {{ label }}
                <span v-if="required" class="text-terracotta ml-1">*</span>
            </label>
        </div>

        <!-- Sélecteur principal avec effet organique -->
        <div class="relative" :class="{ 'has-error': error }">
            <!-- Bouton déclencheur -->
            <button type="button" :id="id" ref="trigger" @click="toggleDropdown" @blur="onBlur" :disabled="disabled"
                :aria-expanded="isOpen"
                :aria-label="selectedUnit ? `${selectedUnit.name} sélectionné` : 'Sélectionner une unité'"
                class="unit-selector-trigger w-full transition-all duration-500 ease-out-custom" :class="[
                    isOpen ? 'selector-open' : 'selector-closed',
                    error ? 'border-terracotta ring-2 ring-terracotta/20' : 'border-green-light/30',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-gentle hover:scale-[1.002]'
                ]">
                <div class="flex items-center justify-between w-full px-4 py-3">
                    <!-- Contenu sélectionné ou placeholder -->
                    <div class="flex items-center space-x-3">
                        <div v-if="selectedUnit" class="unit-badge animate-fadeIn">
                            <span
                                class="unit-symbol bg-green-soft text-forest-dark px-2 py-1 rounded-md text-sm font-medium transition-all duration-300">
                                {{ selectedUnit.symbol }}
                            </span>
                        </div>
                        <span
                            class="text-forest-dark text-base font-medium transition-all duration-400 ease-out-custom">
                            {{ selectedUnit ? selectedUnit.name : placeholder }}
                        </span>
                    </div>

                    <!-- Indicateur d'état -->
                    <div class="flex items-center space-x-2">
                        <!-- Animation de chargement -->
                        <div v-if="loading" class="loading-dots">
                            <div class="dot animate-pulse"></div>
                            <div class="dot animate-pulse animation-delay-200"></div>
                            <div class="dot animate-pulse animation-delay-400"></div>
                        </div>

                        <!-- Icône flèche animée -->
                        <svg class="arrow-icon transition-all duration-500 ease-out-custom"
                            :class="{ 'rotate-180': isOpen }" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-forest-medium" />
                        </svg>
                    </div>
                </div>

                <!-- Ligne décorative organique -->
                <div class="organic-line transition-all duration-700 ease-out-custom"
                    :class="{ 'line-expanded': isOpen }"></div>
            </button>

            <!-- Dropdown avec animation organique -->
            <transition name="unit-dropdown" @enter="onEnter" @leave="onLeave">
                <div v-if="isOpen && !disabled" ref="dropdown"
                    class="unit-dropdown absolute z-50 w-full mt-2 overflow-hidden"
                    :style="{ maxHeight: dropdownHeight }">
                    <!-- Fond avec texture naturelle -->
                    <div class="dropdown-background relative overflow-hidden">
                        <!-- Texture de fond organique -->
                        <div class="organic-texture absolute inset-0 opacity-5"></div>

                        <!-- Contenu du dropdown -->
                        <div class="relative z-10">
                            <!-- En-tête avec recherche -->
                            <div class="dropdown-header px-4 py-3 border-b border-green-light/20">
                                <div class="relative">
                                    <input ref="searchInput" v-model="searchQuery" type="text"
                                        placeholder="Rechercher une unité..."
                                        class="search-input w-full pl-10 pr-4 py-2 rounded-lg border border-green-light/30 bg-cream-light/50 text-forest-dark placeholder-green-medium/60 focus:outline-none focus:ring-2 focus:ring-green-soft focus:border-transparent transition-all duration-300"
                                        @input="onSearch">
                                    <svg class="absolute left-3 top-2.5 w-5 h-5 text-green-medium/60" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <!-- Liste des unités -->
                            <div class="dropdown-content max-h-60 overflow-y-auto custom-scrollbar">
                                <!-- Message d'état -->
                                <div v-if="loading" class="px-4 py-8 text-center">
                                    <div class="leaf-spinner mx-auto"></div>
                                    <p class="mt-3 text-green-medium">Chargement des unités...</p>
                                </div>

                                <div v-else-if="error" class="px-4 py-4 text-center">
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-terracotta/10 mb-3">
                                        <svg class="w-6 h-6 text-terracotta" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p class="text-terracotta mb-2">Erreur de chargement</p>
                                    <button @click="fetchUnits"
                                        class="text-sm text-green-medium hover:text-forest-dark transition-colors">
                                        Réessayer
                                    </button>
                                </div>

                                <div v-else-if="filteredUnits.length === 0" class="px-4 py-8 text-center">
                                    <div
                                        class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-soft/20 mb-3">
                                        <svg class="w-6 h-6 text-green-medium" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p class="text-green-medium">Aucune unité trouvée</p>
                                    <p v-if="searchQuery" class="text-sm text-green-medium/70 mt-1">
                                        Essayez avec d'autres termes
                                    </p>
                                </div>

                                <!-- Liste des unités -->
                                <ul v-else class="unit-list py-2">
                                    <li v-for="unit in filteredUnits" :key="unit.id" @mousedown="selectUnit(unit)"
                                        @mouseenter="setHoveredUnit(unit)"
                                        class="unit-item group relative px-4 py-3 cursor-pointer transition-all duration-300 ease-out-custom"
                                        :class="[
                                            selectedUnit?.id === unit.id ? 'bg-green-soft/30' : 'hover:bg-green-soft/10',
                                            hoveredUnit?.id === unit.id ? 'scale-[1.01] shadow-gentle' : ''
                                        ]">
                                        <!-- Animation de fond organique -->
                                        <div
                                            class="organic-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        </div>

                                        <!-- Contenu de l'unité -->
                                        <div class="relative z-10 flex items-center justify-between">
                                            <div class="flex items-center space-x-3">
                                                <!-- Badge symbole avec animation -->
                                                <div
                                                    class="unit-symbol-badge transform transition-all duration-400 ease-out-custom group-hover:scale-110 group-hover:rotate-3">
                                                    <span
                                                        class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-soft to-green-light text-forest-dark font-bold text-sm shadow-gentle">
                                                        {{ unit.symbol }}
                                                    </span>
                                                </div>

                                                <!-- Informations de l'unité -->
                                                <div>
                                                    <span class="font-medium text-forest-dark block">
                                                        {{ unit.name }}
                                                    </span>
                                                    <span v-if="unit.description"
                                                        class="text-sm text-green-medium/80 mt-0.5 block">
                                                        {{ unit.description }}
                                                    </span>
                                                </div>
                                            </div>

                                            <!-- Indicateur de sélection -->
                                            <div v-if="selectedUnit?.id === unit.id"
                                                class="selection-indicator animate-pulse-subtle">
                                                <svg class="w-5 h-5 text-green-medium" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>

                                        <!-- Ligne décorative basse -->
                                        <div
                                            class="unit-divider absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-green-light/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out-custom">
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <!-- Pied de dropdown -->
                            <div v-if="!loading && !error"
                                class="dropdown-footer px-4 py-3 border-t border-green-light/20">
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-green-medium/70">
                                        {{ filteredUnits.length }} unité{{ filteredUnits.length > 1 ? 's' : '' }}
                                        disponible{{ filteredUnits.length > 1 ? 's' : '' }}
                                    </span>
                                    <button v-if="searchQuery" @click="clearSearch"
                                        class="text-green-medium hover:text-forest-dark transition-colors duration-300">
                                        Effacer la recherche
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Messages d'erreur -->
        <div v-if="error && errorMessage" class="error-message mt-2 animate-shake">
            <div class="flex items-center space-x-2 text-terracotta">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                </svg>
                <span class="text-sm">{{ errorMessage }}</span>
            </div>
        </div>

        <!-- Texte d'aide -->
        <p v-if="helperText" class="helper-text mt-2 text-sm text-green-medium/70">
            {{ helperText }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Unit {
    id: string
    name: string
    symbol: string
    description?: string
    is_active: boolean
}

interface Props {
    modelValue?: string | null
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: boolean
    errorMessage?: string
    helperText?: string
    id?: string
    filterBy?: (unit: Unit) => boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: 'Unité',
    placeholder: 'Sélectionnez une unité...',
    required: false,
    disabled: false,
    error: false,
    errorMessage: '',
    helperText: '',
    id: 'unit-selector'
})

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
    'change': [unit: Unit | null]
}>()

// Références
const trigger = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()
const searchInput = ref<HTMLInputElement>()

// États
const isOpen = ref(false)
const loading = ref(false)
const error = ref(false)
const units = ref<Unit[]>([])
const searchQuery = ref('')
const hoveredUnit = ref<Unit | null>(null)
const dropdownHeight = ref('0px')

// Données locales
const localUnits = ref<Unit[]>([
    { id: '1', name: 'Kilogramme', symbol: 'kg', description: 'Poids en kilogrammes', is_active: true },
    { id: '2', name: 'Gramme', symbol: 'g', description: 'Poids en grammes', is_active: true },
    { id: '3', name: 'Litre', symbol: 'L', description: 'Volume en litres', is_active: true },
    { id: '4', name: 'Millilitre', symbol: 'ml', description: 'Volume en millilitres', is_active: true },
    { id: '5', name: 'Pièce', symbol: 'pce', description: 'À la pièce', is_active: true },
    { id: '6', name: 'Botte', symbol: 'bt', description: 'En botte', is_active: true },
    { id: '7', name: 'Bouquet', symbol: 'bq', description: 'En bouquet', is_active: true },
    { id: '8', name: 'Douzaine', symbol: 'dz', description: 'Par douzaine', is_active: true }
])

// Unités filtrées
const filteredUnits = computed(() => {
    let filtered = units.value.filter(unit => unit.is_active)

    // Filtre personnalisé
    if (props.filterBy) {
        filtered = filtered.filter(props.filterBy)
    }

    // Filtre de recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(unit =>
            unit.name.toLowerCase().includes(query) ||
            unit.symbol.toLowerCase().includes(query) ||
            (unit.description && unit.description.toLowerCase().includes(query))
        )
    }

    return filtered
})

// Unité sélectionnée
const selectedUnit = computed(() => {
    if (!props.modelValue) return null
    return units.value.find(unit => unit.id === props.modelValue) || null
})

// Gestion du clic en dehors
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (!isOpen.value) return

    if (dropdown.value?.contains(target) || trigger.value?.contains(target)) {
        return
    }

    closeDropdown()
}

// Méthodes
const fetchUnits = async () => {
    loading.value = true
    error.value = false

    try {
        // Dans un vrai projet, vous utiliseriez l'API :
        // const response = await unitApi.getAllUnits()
        // units.value = response.data

        // Pour la démo, on utilise les données locales avec un délai
        await new Promise(resolve => setTimeout(resolve, 300))
        units.value = localUnits.value
    } catch (err) {
        error.value = true
        console.error('Erreur lors du chargement des unités:', err)
    } finally {
        loading.value = false
    }
}

const toggleDropdown = async () => {
    if (props.disabled) return

    if (!isOpen.value) {
        if (units.value.length === 0) {
            await fetchUnits()
        }
        isOpen.value = true
        await nextTick()
        searchInput.value?.focus()
    } else {
        closeDropdown()
    }
}

const closeDropdown = () => {
    isOpen.value = false
    searchQuery.value = ''
    hoveredUnit.value = null
}

const selectUnit = (unit: Unit) => {
    emit('update:modelValue', unit.id)
    emit('change', unit)
    closeDropdown()
}

const onSearch = () => {
    // Animation de filtrage
    if (searchInput.value) {
        searchInput.value.style.transform = 'scale(1.02)'
        setTimeout(() => {
            if (searchInput.value) {
                searchInput.value.style.transform = 'scale(1)'
            }
        }, 150)
    }
}

const clearSearch = () => {
    searchQuery.value = ''
    searchInput.value?.focus()
}

const setHoveredUnit = (unit: Unit) => {
    hoveredUnit.value = unit
}

const onBlur = (event: FocusEvent) => {
    // Ne pas fermer si le focus va vers le dropdown
    if (dropdown.value?.contains(event.relatedTarget as Node)) {
        return
    }
    setTimeout(() => {
        if (!dropdown.value?.contains(document.activeElement)) {
            closeDropdown()
        }
    }, 100)
}

// Animation d'entrée du dropdown
const onEnter = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    element.style.maxHeight = '0'
    element.style.opacity = '0'
    element.style.transform = 'translateY(-10px) scale(0.95)'

    requestAnimationFrame(() => {
        element.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        element.style.maxHeight = '400px'
        element.style.opacity = '1'
        element.style.transform = 'translateY(0) scale(1)'

        setTimeout(done, 500)
    })
}

// Animation de sortie du dropdown
const onLeave = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    element.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
    element.style.maxHeight = '0'
    element.style.opacity = '0'
    element.style.transform = 'translateY(-10px) scale(0.95)'

    setTimeout(done, 300)
}

// Cycle de vie
onMounted(() => {
    // Préchargement avec effet de fondu
    setTimeout(() => {
        if (units.value.length === 0 && !props.disabled) {
            fetchUnits()
        }
    }, 100)

    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Watch pour les changements de valeur
watch(() => props.modelValue, (newValue) => {
    if (newValue && units.value.length === 0) {
        fetchUnits()
    }
})
</script>

<style scoped>
/* Variables CSS locales */
.unit-selector-wrapper {
    --green-soft: #a7d397;
    --green-light: #c6e6b3;
    --green-medium: #5a8c5a;
    --forest-dark: #2c5530;
    --terracotta: #d2691e;
    --cream-light: #f8f4e9;
}

/* Classe de transition personnalisée */
.ease-out-custom {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Bouton déclencheur */
.unit-selector-trigger {
    background: linear-gradient(135deg, rgba(248, 244, 233, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
    border: 2px solid;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    box-shadow:
        0 4px 20px rgba(44, 85, 48, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
}

.selector-open {
    border-color: var(--green-soft);
    box-shadow:
        0 8px 32px rgba(167, 211, 151, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.selector-closed {
    border-color: rgba(198, 230, 179, 0.3);
}

/* Ligne décorative organique */
.organic-line {
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(90deg,
            transparent 0%,
            var(--green-soft) 20%,
            var(--green-light) 50%,
            var(--green-soft) 80%,
            transparent 100%);
    transform: scaleX(0.3);
    opacity: 0.3;
}

.line-expanded {
    transform: scaleX(1);
    opacity: 0.8;
}

/* Icône feuille */
.leaf-icon {
    width: 20px;
    height: 20px;
    color: var(--green-medium);
    opacity: 0.9;
}

/* Animation des points de chargement */
.loading-dots {
    display: flex;
    align-items: center;
    gap: 4px;
}

.dot {
    width: 6px;
    height: 6px;
    background-color: var(--green-medium);
    border-radius: 50%;
}

.animation-delay-200 {
    animation-delay: 0.2s;
}

.animation-delay-400 {
    animation-delay: 0.4s;
}

/* Dropdown */
.unit-dropdown {
    background: linear-gradient(135deg,
            rgba(248, 244, 233, 0.98) 0%,
            rgba(255, 255, 255, 0.95) 100%);
    border: 2px solid rgba(198, 230, 179, 0.5);
    border-radius: 16px;
    box-shadow:
        0 20px 60px rgba(44, 85, 48, 0.15),
        0 8px 32px rgba(167, 211, 151, 0.25);
    backdrop-filter: blur(20px);
}

/* Texture organique */
.organic-texture {
    background-image:
        radial-gradient(circle at 25% 25%, rgba(167, 211, 151, 0.1) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(198, 230, 179, 0.05) 1px, transparent 1px);
    background-size: 40px 40px, 30px 30px;
    animation: texture-float 60s infinite linear;
}

@keyframes texture-float {
    0% {
        background-position: 0 0, 0 0;
    }

    100% {
        background-position: 40px 40px, 30px 30px;
    }
}

/* Arrière-plan organique des items */
.organic-bg {
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(167, 211, 151, 0.1) 50%,
            transparent 100%);
}

/* Spinner feuille */
.leaf-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(198, 230, 179, 0.3);
    border-top-color: var(--green-medium);
    border-radius: 50%;
    animation: leaf-spin 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

@keyframes leaf-spin {
    0% {
        transform: rotate(0deg);
        border-top-color: var(--green-medium);
    }

    50% {
        border-top-color: var(--green-light);
    }

    100% {
        transform: rotate(360deg);
        border-top-color: var(--green-medium);
    }
}

/* Scrollbar personnalisée */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--green-soft) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(198, 230, 179, 0.1);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--green-soft), var(--green-light));
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--green-light), var(--green-medium));
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse-subtle {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-2px);
    }

    75% {
        transform: translateX(2px);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-pulse-subtle {
    animation: pulse-subtle 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Classes utilitaires Tailwind personnalisées */
.shadow-gentle {
    box-shadow: 0 8px 30px rgba(44, 85, 48, 0.12);
}

/* Transitions de Vue pour le dropdown */
.unit-dropdown-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.unit-dropdown-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.unit-dropdown-enter-from,
.unit-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}
</style>
