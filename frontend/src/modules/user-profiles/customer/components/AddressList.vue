<template>
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-nature-50 via-cream-100/80 to-blue-50/30">
        <!-- Texture filigrane subtile -->
        <div class="absolute inset-0 opacity-5 z-0 bg-leaf-pattern bg-[length:250px]"></div>

        <!-- Animation de feuilles flottantes -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div v-for="i in 12" :key="i" class="absolute leaf-float" :style="leafStyle(i)"
                :class="`leaf-float-${(i % 4) + 1}`">
                <span class="text-2xl opacity-10">{{ addressEmojis[i % addressEmojis.length] }}</span>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="relative z-10 container mx-auto px-4 py-8 md:py-12">
            <!-- En-tête -->
            <div class="text-center mb-8 animate-slide-in-down">
                <div class="inline-flex items-center justify-center space-x-3 mb-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-nature-300/30 
                      flex items-center justify-center shadow-soft">
                        <span class="text-2xl">📋</span>
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold text-forest-900 font-display">
                        Mes <span class="text-primary">Adresses</span>
                    </h1>
                </div>
                <p class="text-nature-600 max-w-2xl mx-auto">
                    🏡 Gérez vos adresses de livraison et de facturation
                </p>
            </div>

            <!-- Statistiques et actions -->
            <div class="max-w-6xl mx-auto mb-8 animate-slide-in-up">
                <div class="flex flex-col md:flex-row gap-6">
                    <!-- Statistiques -->
                    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div v-for="stat in addressStats" :key="stat.label" class="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-soft border border-nature-200/50
                        transform hover:scale-105 transition-all duration-300 ease-organic">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                                    :class="stat.color">
                                    <span class="text-xl">{{ stat.icon }}</span>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold text-forest-800">{{ stat.value }}</p>
                                    <p class="text-sm text-nature-600">{{ stat.label }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions principales -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-end">
                        <button @click="handleAddAddress" class="px-6 py-3 bg-gradient-to-r from-primary to-nature-600 text-white font-semibold rounded-xl
                           shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-500 ease-organic
                           flex items-center justify-center space-x-2 group">
                            <span class="text-lg group-hover:rotate-90 transition-transform duration-300">➕</span>
                            <span>Nouvelle adresse</span>
                        </button>

                        <button v-if="hasAddresses" @click="refreshAddresses" :disabled="isLoading" class="px-6 py-3 bg-gradient-to-r from-nature-100 to-nature-200 text-forest-700 font-semibold rounded-xl
                           border border-nature-300/50 shadow-soft transform hover:scale-105 active:scale-95
                           transition-all duration-300 ease-organic flex items-center justify-center space-x-2">
                            <span :class="{ 'animate-spin': isLoading }">🔄</span>
                            <span>{{ isLoading ? 'Actualisation...' : 'Actualiser' }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Contenu principal -->
            <div class="max-w-6xl mx-auto">
                <!-- État de chargement -->
                <div v-if="isLoading" class="animate-pulse space-y-6">
                    <div v-for="i in 3" :key="`skeleton-${i}`"
                        class="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-nature-200/50">
                        <div class="flex items-start justify-between">
                            <div class="space-y-3 flex-1">
                                <div class="h-4 bg-nature-200 rounded w-1/4"></div>
                                <div class="h-3 bg-nature-100 rounded w-1/2"></div>
                                <div class="h-3 bg-nature-100 rounded w-3/4"></div>
                            </div>
                            <div class="flex space-x-2">
                                <div class="w-10 h-10 bg-nature-100 rounded-lg"></div>
                                <div class="w-10 h-10 bg-nature-100 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- État vide -->
                <div v-else-if="!hasAddresses" class="text-center py-12 animate-fade-in">
                    <div class="max-w-md mx-auto">
                        <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary/10 to-nature-300/30 
                        flex items-center justify-center mb-6">
                            <span class="text-6xl">🏠</span>
                        </div>
                        <h3 class="text-xl font-bold text-forest-800 mb-3">Aucune adresse enregistrée</h3>
                        <p class="text-nature-600 mb-8">
                            Ajoutez votre première adresse pour recevoir vos produits frais
                        </p>
                        <button @click="handleAddAddress" class="px-8 py-3 bg-gradient-to-r from-primary to-nature-600 text-white font-semibold rounded-xl
                           shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-500 ease-organic
                           flex items-center justify-center space-x-2 mx-auto group">
                            <span class="text-lg group-hover:rotate-90 transition-transform duration-300">➕</span>
                            <span>Ajouter ma première adresse</span>
                        </button>
                    </div>
                </div>

                <!-- Liste d'adresses -->
                <div v-else class="space-y-6 animate-slide-in-up">
                    <!-- Filtres -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-nature-200/50">
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <div class="flex flex-wrap gap-2">
                                <button v-for="filter in addressFilters" :key="filter.value"
                                    @click="toggleFilter(filter.value)" :class="[
                                        'px-4 py-2 rounded-lg border transition-all duration-300 ease-organic',
                                        'flex items-center space-x-2',
                                        activeFilter === filter.value
                                            ? 'bg-gradient-to-r from-primary/20 to-nature-100 border-primary/50 text-forest-800'
                                            : 'bg-white/50 border-nature-200/50 hover:scale-105 text-nature-600'
                                    ]">
                                    <span>{{ filter.icon }}</span>
                                    <span>{{ filter.label }}</span>
                                    <span v-if="filter.count" class="text-xs bg-nature-200 px-1.5 py-0.5 rounded">
                                        {{ filter.count }}
                                    </span>
                                </button>
                            </div>

                            <div class="flex items-center space-x-4">
                                <div class="relative">
                                    <input v-model="searchQuery" type="text" placeholder="Rechercher une adresse..."
                                        class="pl-10 pr-4 py-2 rounded-lg border border-nature-200/50 bg-white/80 backdrop-blur-sm
                                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                transition-all duration-300 ease-organic w-64" />
                                    <span
                                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-nature-400">🔍</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Liste des adresses -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <transition-group name="address-card">
                            <div v-for="address in filteredAddresses" :key="address.id" :class="[
                                'bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border transform transition-all duration-500 ease-organic',
                                'hover:scale-[1.02] hover:shadow-lg',
                                address.isDefault ? 'border-primary/30' : 'border-nature-200/50'
                            ]">
                                <!-- En-tête de la carte -->
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 rounded-full flex items-center justify-center"
                                            :class="getAddressTypeColor(address.type)">
                                            <span class="text-xl">{{ getAddressTypeEmoji(address.type) }}</span>
                                        </div>
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <h3 class="font-bold text-forest-800">{{ address.title }}</h3>
                                                <span v-if="address.isDefault" class="px-2 py-0.5 text-xs font-semibold rounded-full 
                                     bg-gradient-to-r from-primary/20 to-green-100 text-green-700
                                     border border-green-200/50">
                                                    ⭐ Par défaut
                                                </span>
                                            </div>
                                            <p class="text-sm text-nature-500 flex items-center space-x-1">
                                                <span>{{ formatAddressType(address.type) }}</span>
                                                <span>•</span>
                                                <span>Ajoutée le {{ formatDate(address.createdAt) }}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Menu d'actions -->
                                    <div class="relative">
                                        <button @click="toggleAddressMenu(address.id)" class="w-8 h-8 rounded-full bg-nature-100/50 hover:bg-nature-200/50
                                   flex items-center justify-center transition-all duration-300 ease-organic
                                   hover:scale-110">
                                            <span>⚙️</span>
                                        </button>

                                        <!-- Menu déroulant -->
                                        <div v-if="activeMenu === address.id" class="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg
                                border border-nature-200/50 z-50 animate-slide-in-down">
                                            <div class="py-1">
                                                <button @click="handleEditAddress(address)" class="w-full px-4 py-3 text-left flex items-center space-x-3
                                       hover:bg-nature-50/50 transition-colors duration-200">
                                                    <span>✏️</span>
                                                    <span>Modifier</span>
                                                </button>

                                                <button v-if="!address.isDefault" @click="handleSetDefault(address)"
                                                    class="w-full px-4 py-3 text-left flex items-center space-x-3
                                       hover:bg-nature-50/50 transition-colors duration-200">
                                                    <span>⭐</span>
                                                    <span>Définir par défaut</span>
                                                </button>

                                                <button @click="handleCopyAddress(address)" class="w-full px-4 py-3 text-left flex items-center space-x-3
                                       hover:bg-nature-50/50 transition-colors duration-200">
                                                    <span>📋</span>
                                                    <span>Copier l'adresse</span>
                                                </button>

                                                <div class="border-t border-nature-200/50 my-1"></div>

                                                <button @click="handleDeleteAddress(address)" class="w-full px-4 py-3 text-left flex items-center space-x-3
                                       text-red-600 hover:bg-red-50/50 transition-colors duration-200">
                                                    <span>🗑️</span>
                                                    <span>Supprimer</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Informations de l'adresse -->
                                <div class="space-y-3 mb-6">
                                    <div class="flex items-start space-x-3">
                                        <span class="text-nature-400 mt-1">👤</span>
                                        <div>
                                            <p class="font-medium text-forest-800">{{ address.firstName }} {{
                                                address.lastName }}</p>
                                            <p v-if="address.company" class="text-sm text-nature-600">{{ address.company
                                            }}</p>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-3">
                                        <span class="text-nature-400 mt-1">📍</span>
                                        <div>
                                            <p class="text-forest-800">{{ address.street }}</p>
                                            <p v-if="address.street2" class="text-forest-800">{{ address.street2 }}</p>
                                            <p class="text-nature-600">
                                                {{ address.postalCode }} {{ address.city }}
                                                <span v-if="address.region">, {{ address.region }}</span>
                                            </p>
                                            <p class="text-nature-600 flex items-center space-x-1">
                                                <span>{{ getCountryFlag(address.country) }}</span>
                                                <span>{{ getCountryName(address.country) }}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-3">
                                        <span class="text-nature-400 mt-1">📱</span>
                                        <p class="text-forest-800">{{ formatPhoneNumber(address.phone) }}</p>
                                    </div>

                                    <div v-if="address.instructions" class="flex items-start space-x-3">
                                        <span class="text-nature-400 mt-1">📝</span>
                                        <div>
                                            <p class="text-sm font-medium text-nature-700">Instructions :</p>
                                            <p class="text-sm text-nature-600">{{ address.instructions }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Actions rapides -->
                                <div class="flex items-center justify-between pt-4 border-t border-nature-200/50">
                                    <div class="flex space-x-2">
                                        <button @click="handleUseForOrder(address)" class="px-4 py-2 bg-gradient-to-r from-primary/10 to-nature-100 text-forest-700 
                                   rounded-lg border border-nature-200/50 text-sm font-medium
                                   transform hover:scale-105 transition-all duration-300 ease-organic
                                   flex items-center space-x-2">
                                            <span>🛒</span>
                                            <span>Utiliser pour commande</span>
                                        </button>

                                        <button @click="handleCopyAddress(address)" class="px-4 py-2 bg-gradient-to-r from-nature-100 to-nature-200 text-nature-700 
                                   rounded-lg border border-nature-200/50 text-sm font-medium
                                   transform hover:scale-105 transition-all duration-300 ease-organic
                                   flex items-center space-x-2">
                                            <span>📋</span>
                                            <span>Copier</span>
                                        </button>
                                    </div>

                                    <div class="text-xs text-nature-500">
                                        Dernière modification : {{ formatDate(address.updatedAt) }}
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1"
                        class="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-nature-200/50">
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-nature-600">
                                Affichage de <span class="font-semibold">{{ startItem }}</span> à
                                <span class="font-semibold">{{ endItem }}</span> sur
                                <span class="font-semibold">{{ totalItems }}</span> adresses
                            </div>

                            <div class="flex items-center space-x-2">
                                <button @click="prevPage" :disabled="currentPage === 1" :class="[
                                    'w-10 h-10 rounded-lg border flex items-center justify-center',
                                    'transition-all duration-300 ease-organic',
                                    currentPage === 1
                                        ? 'bg-nature-100/50 border-nature-200/50 text-nature-400 cursor-not-allowed'
                                        : 'bg-white/50 border-nature-200/50 hover:scale-105 hover:bg-nature-100/50'
                                ]">
                                    <span>←</span>
                                </button>

                                <div class="flex space-x-1">
                                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                                        'w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-medium',
                                        'transition-all duration-300 ease-organic',
                                        page === currentPage
                                            ? 'bg-gradient-to-r from-primary to-nature-600 text-white border-primary/50'
                                            : 'bg-white/50 border-nature-200/50 hover:scale-105 hover:bg-nature-100/50'
                                    ]">
                                        {{ page }}
                                    </button>
                                </div>

                                <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
                                    'w-10 h-10 rounded-lg border flex items-center justify-center',
                                    'transition-all duration-300 ease-organic',
                                    currentPage === totalPages
                                        ? 'bg-nature-100/50 border-nature-200/50 text-nature-400 cursor-not-allowed'
                                        : 'bg-white/50 border-nature-200/50 hover:scale-105 hover:bg-nature-100/50'
                                ]">
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modale de confirmation de suppression -->
        <transition enter-active-class="transform transition-all duration-300 ease-organic"
            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
            leave-active-class="transform transition-all duration-200 ease-organic"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showDeleteModal = false"></div>

                <div class="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full shadow-2xl
                    border border-nature-200/50 animate-slide-in-up">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-100 to-red-200 
                        flex items-center justify-center mb-4">
                            <span class="text-2xl">⚠️</span>
                        </div>
                        <h3 class="text-xl font-bold text-forest-800 mb-2">Supprimer l'adresse</h3>
                        <p class="text-nature-600">
                            Êtes-vous sûr de vouloir supprimer l'adresse "{{ addressToDelete?.title }}" ?
                            Cette action est irréversible.
                        </p>
                    </div>

                    <div class="flex justify-center space-x-4">
                        <button @click="showDeleteModal = false" class="px-6 py-3 bg-gradient-to-r from-nature-100 to-nature-200 text-forest-700 font-medium rounded-xl
                           border border-nature-300/50 transform hover:scale-105 active:scale-95
                           transition-all duration-300 ease-organic">
                            Annuler
                        </button>

                        <button @click="confirmDelete" :disabled="isDeleting" class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl
                           transform hover:scale-105 active:scale-95 transition-all duration-300 ease-organic
                           flex items-center space-x-2">
                            <span v-if="isDeleting" class="animate-spin">⏳</span>
                            <span v-else>🗑️</span>
                            <span>{{ isDeleting ? 'Suppression...' : 'Supprimer' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Toast de confirmation -->
        <transition enter-active-class="transform transition-all duration-500 ease-organic"
            enter-from-class="translate-y-10 opacity-0" enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transform transition-all duration-300 ease-organic"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-10 opacity-0">
            <div v-if="showToast" class="fixed bottom-6 right-6 max-w-sm bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200/50
                  rounded-xl p-4 shadow-lg backdrop-blur-sm animate-slide-in-up">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 
                      flex items-center justify-center">
                        <span class="text-xl text-white">✅</span>
                    </div>
                    <div>
                        <p class="font-medium text-forest-800">{{ toastMessage }}</p>
                        <p class="text-sm text-nature-600">{{ toastDescription }}</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Address, AddressType } from '../types'
import { useCustomerStore } from '../stores/useCustomerStore'
import { useRouter } from 'vue-router'

// Store et router
const customerStore = useCustomerStore()
const router = useRouter()

// État
const isLoading = ref(false)
const activeMenu = ref<string | null>(null)
const activeFilter = ref<string>('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)
const showDeleteModal = ref(false)
const addressToDelete = ref<Address | null>(null)
const isDeleting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastDescription = ref('')

// Données
const addressEmojis = ['🏠', '🏢', '🏡', '🏘️', '📍', '🗺️', '🌍', '🚚', '🧾', '📦', '📮', '🎯']
const countries = [
    { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
    { code: 'TD', name: 'Tchad', flag: '🇹🇩' },
    { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
    { code: 'CG', name: 'Congo', flag: '🇨🇬' },
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
]

// Styles pour les feuilles flottantes
const leafStyle = (index: number) => {
    const size = 20 + Math.random() * 40
    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${index * 2}s`
    }
}

// Computed properties
const hasAddresses = computed(() => customerStore.addresses.length > 0)
const totalItems = computed(() => customerStore.addresses.length)

const addressStats = computed(() => [
    {
        label: 'Total',
        value: customerStore.addresses.length,
        icon: '📋',
        color: 'bg-gradient-to-r from-blue-100 to-blue-200'
    },
    {
        label: 'Par défaut',
        value: customerStore.addresses.filter(a => a.isDefault).length,
        icon: '⭐',
        color: 'bg-gradient-to-r from-yellow-100 to-yellow-200'
    },
    {
        label: 'Livraison',
        value: customerStore.addresses.filter(a => a.type === 'DELIVERY' || a.type === 'BOTH').length,
        icon: '🚚',
        color: 'bg-gradient-to-r from-green-100 to-green-200'
    },
    {
        label: 'Facturation',
        value: customerStore.addresses.filter(a => a.type === 'BILLING' || a.type === 'BOTH').length,
        icon: '🧾',
        color: 'bg-gradient-to-r from-purple-100 to-purple-200'
    }
])

const addressFilters = computed(() => [
    { value: 'all', label: 'Toutes', icon: '📋', count: customerStore.addresses.length },
    { value: 'default', label: 'Par défaut', icon: '⭐', count: customerStore.addresses.filter(a => a.isDefault).length },
    { value: 'delivery', label: 'Livraison', icon: '🚚', count: customerStore.addresses.filter(a => a.type === 'DELIVERY' || a.type === 'BOTH').length },
    { value: 'billing', label: 'Facturation', icon: '🧾', count: customerStore.addresses.filter(a => a.type === 'BILLING' || a.type === 'BOTH').length }
])

const filteredAddresses = computed(() => {
    let filtered = [...customerStore.addresses]

    // Filtrer par type
    if (activeFilter.value !== 'all') {
        switch (activeFilter.value) {
            case 'default':
                filtered = filtered.filter(a => a.isDefault)
                break
            case 'delivery':
                filtered = filtered.filter(a => a.type === 'DELIVERY' || a.type === 'BOTH')
                break
            case 'billing':
                filtered = filtered.filter(a => a.type === 'BILLING' || a.type === 'BOTH')
                break
        }
    }

    // Filtrer par recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(address =>
            address.title.toLowerCase().includes(query) ||
            address.city.toLowerCase().includes(query) ||
            address.street.toLowerCase().includes(query) ||
            `${address.firstName} ${address.lastName}`.toLowerCase().includes(query)
        )
    }

    // Trier : d'abord les adresses par défaut, puis par date de modification
    filtered.sort((a, b) => {
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    // Pagination
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filtered.slice(start, end)
})

const totalPages = computed(() =>
    Math.ceil(
        (activeFilter.value === 'all' && !searchQuery.value
            ? totalItems.value
            : filteredAddresses.value.length * (totalItems.value / customerStore.addresses.length)
        ) / itemsPerPage.value
    )
)

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

// Méthodes utilitaires
const getAddressTypeColor = (type: AddressType) => {
    switch (type) {
        case 'DELIVERY': return 'bg-gradient-to-r from-green-100 to-green-200'
        case 'BILLING': return 'bg-gradient-to-r from-purple-100 to-purple-200'
        case 'BOTH': return 'bg-gradient-to-r from-blue-100 to-blue-200'
        default: return 'bg-gradient-to-r from-nature-100 to-nature-200'
    }
}

const getAddressTypeEmoji = (type: AddressType) => {
    switch (type) {
        case 'DELIVERY': return '🚚'
        case 'BILLING': return '🧾'
        case 'BOTH': return '🏠'
        default: return '📍'
    }
}

const formatAddressType = (type: AddressType) => {
    switch (type) {
        case 'DELIVERY': return 'Livraison'
        case 'BILLING': return 'Facturation'
        case 'BOTH': return 'Livraison & Facturation'
        default: return 'Inconnu'
    }
}

const getCountryFlag = (code: string) => {
    const country = countries.find(c => c.code === code)
    return country?.flag || '🌍'
}

const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code)
    return country?.name || code
}

const formatPhoneNumber = (phone: string) => {
    // Format simple pour l'affichage
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const showToastMessage = (message: string, description = '') => {
    toastMessage.value = message
    toastDescription.value = description
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

// Méthodes
const refreshAddresses = async () => {
    isLoading.value = true
    try {
        await customerStore.fetchAddresses()
        showToastMessage('Liste actualisée', 'Vos adresses ont été mises à jour')
    } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error)
        showToastMessage('Erreur', 'Impossible de rafraîchir la liste')
    } finally {
        isLoading.value = false
    }
}

const toggleAddressMenu = (addressId: string) => {
    activeMenu.value = activeMenu.value === addressId ? null : addressId
}

const toggleFilter = (filter: string) => {
    activeFilter.value = filter
    currentPage.value = 1
}

const handleAddAddress = () => {
    router.push('/profile/addresses/new')
}

const handleEditAddress = (address: Address) => {
    activeMenu.value = null
    router.push(`/profile/addresses/edit/${address.id}`)
}

const handleSetDefault = async (address: Address) => {
    activeMenu.value = null
    try {
        await customerStore.setDefaultAddress(address.id)
        showToastMessage('Adresse par défaut', `${address.title} est maintenant l'adresse par défaut`)
    } catch (error) {
        console.error('Erreur:', error)
        showToastMessage('Erreur', 'Impossible de définir cette adresse par défaut')
    }
}

const handleCopyAddress = async (address: Address) => {
    activeMenu.value = null
    const addressText = `${address.street}, ${address.postalCode} ${address.city}, ${getCountryName(address.country)}`
    try {
        await navigator.clipboard.writeText(addressText)
        showToastMessage('Adresse copiée', 'L\'adresse a été copiée dans le presse-papier')
    } catch (error) {
        console.error('Erreur de copie:', error)
        showToastMessage('Erreur', 'Impossible de copier l\'adresse')
    }
}

const handleDeleteAddress = (address: Address) => {
    activeMenu.value = null
    addressToDelete.value = address
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (!addressToDelete.value) return

    isDeleting.value = true
    try {
        await customerStore.deleteAddress(addressToDelete.value.id)
        showToastMessage('Adresse supprimée', `${addressToDelete.value.title} a été supprimée`)
        showDeleteModal.value = false
        addressToDelete.value = null
    } catch (error) {
        console.error('Erreur:', error)
        showToastMessage('Erreur', 'Impossible de supprimer cette adresse')
    } finally {
        isDeleting.value = false
    }
}

const handleUseForOrder = (address: Address) => {
    // Ici, vous pourriez stocker l'adresse sélectionnée pour la commande
    // Par exemple : store.commit('order/setDeliveryAddress', address)
    showToastMessage('Adresse sélectionnée', `Utilisez ${address.title} pour votre commande`)
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

const goToPage = (page: number) => {
    currentPage.value = page
}

// Lifecycle
onMounted(async () => {
    isLoading.value = true
    try {
        await customerStore.fetchAddresses()
    } catch (error) {
        console.error('Erreur lors du chargement des adresses:', error)
    } finally {
        isLoading.value = false
    }
})

// Fermer le menu au clic ailleurs
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
        activeMenu.value = null
    }
})

// Émets
const emit = defineEmits<{
    'add-address': []
    'edit-address': [address: Address]
    'delete-address': [address: Address]
    'set-default': [address: Address]
}>()
</script>

<style scoped>
/* Animation de feuilles flottantes */
.leaf-float {
    animation: leaf-float 20s linear infinite;
    opacity: 0.1;
}

.leaf-float-1 {
    animation-duration: 25s;
    animation-delay: 0s;
}

.leaf-float-2 {
    animation-duration: 30s;
    animation-delay: 5s;
}

.leaf-float-3 {
    animation-duration: 20s;
    animation-delay: 10s;
}

.leaf-float-4 {
    animation-duration: 35s;
    animation-delay: 15s;
}

@keyframes leaf-float {
    0% {
        transform: translateY(100vh) rotate(0deg);
    }

    100% {
        transform: translateY(-100px) rotate(360deg);
    }
}

/* Courbe de transition organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations d'entrée */
.animate-slide-in-down {
    animation: slide-in-down 0.6s ease-organic;
}

.animate-slide-in-up {
    animation: slide-in-up 0.6s ease-organic;
}

.animate-fade-in {
    animation: fade-in 0.6s ease-organic;
}

@keyframes slide-in-down {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slide-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* Animation des cartes d'adresses */
.address-card-enter-active,
.address-card-leave-active,
.address-card-move {
    transition: all 0.5s ease-organic;
}

.address-card-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.address-card-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.address-card-leave-active {
    position: absolute;
}

/* Support pour les réductions de mouvement */
@media (prefers-reduced-motion: reduce) {

    .leaf-float,
    .animate-slide-in-down,
    .animate-slide-in-up,
    .animate-fade-in,
    .address-card-enter-active,
    .address-card-leave-active,
    .address-card-move,
    .transform,
    .transition-all {
        animation: none !important;
        transition: none !important;
    }
}

/* Styles pour la texture de feuille */
.bg-leaf-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Styles pour l'ombre douce */
.shadow-soft {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.1);
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
}
</style>
