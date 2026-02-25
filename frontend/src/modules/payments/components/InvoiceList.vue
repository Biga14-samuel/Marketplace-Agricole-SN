<template>
    <div
        class="invoice-list-page min-h-screen bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30 overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none" :style="{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
          <svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='organic-pattern' width='40' height='40' patternUnits='userSpaceOnUse'>
                <path d='M0,20 Q10,15 20,20 T40,20' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <path d='M20,0 Q15,10 20,20 T20,40' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <circle cx='10' cy='10' r='2' fill='%2300a896' opacity='0.03'/>
                <circle cx='30' cy='30' r='2' fill='%2300a896' opacity='0.03'/>
              </pattern>
            </defs>
            <rect width='100' height='100' fill='url(%23organic-pattern)'/>
          </svg>
        `)}')`
        }"></div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-1/4 left-5% w-64 h-64 leaf-float opacity-10">
            <div class="w-full h-full bg-primary-300/20 rounded-full blur-3xl"></div>
        </div>
        <div class="absolute bottom-1/3 right-5% w-72 h-72 leaf-float opacity-10" style="animation-delay: 2s;">
            <div class="w-full h-full bg-emerald-300/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Conteneur principal -->
        <div class="container mx-auto px-4 py-8 relative z-10">
            <!-- En-tête avec animations -->
            <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
                enter-from-class="opacity-0 -translate-y-6" enter-to-class="opacity-100 translate-y-0">
                <div class="mb-10">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div class="mb-6 lg:mb-0">
                            <h1 class="text-4xl font-bold text-nature-900 mb-3">
                                <span
                                    class="bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                                    Mes Factures
                                </span>
                            </h1>
                            <p class="text-nature-600 text-lg max-w-2xl">
                                Gérez et suivez toutes vos factures en un seul endroit.
                                Consultez, téléchargez et payez vos factures en toute simplicité.
                            </p>
                        </div>

                        <!-- Bouton nouvelle facture -->
                        <button @click="generateNewInvoice"
                            class="group relative overflow-hidden px-6 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-500 custom-bezier hover:shadow-xl hover:scale-105"
                            style="background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-emerald-500) 100%);">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"
                                style="background-size: 200% 100%; animation: shimmer 2s infinite;"></div>
                            <div class="relative flex items-center space-x-3">
                                <PlusCircleIcon class="w-6 h-6" />
                                <span>Nouvelle facture</span>
                            </div>
                        </button>
                    </div>

                    <!-- Statistiques rapides -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Transition appear v-for="(stat, index) in stats" :key="stat.label"
                            :enter-active-class="`transition-all duration-500 custom-bezier delay-${index * 100}`"
                            :enter-from-class="'opacity-0 translate-y-4'" :enter-to-class="'opacity-100 translate-y-0'">
                            <div class="p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                                :class="stat.bgClass" @click="filterByStatus(stat.filter)">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm text-nature-600 mb-1">{{ stat.label }}</p>
                                        <p class="text-2xl font-bold" :class="stat.textClass">{{ stat.value }}</p>
                                    </div>
                                    <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                                        :class="stat.iconBg">
                                        <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
                                    </div>
                                </div>
                                <div class="mt-3 text-xs text-nature-500 flex items-center">
                                    <ArrowTrendingUpIcon v-if="stat.trend === 'up'"
                                        class="w-4 h-4 text-emerald-500 mr-1" />
                                    <ArrowTrendingDownIcon v-else class="w-4 h-4 text-red-500 mr-1" />
                                    {{ stat.change }} vs mois dernier
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </Transition>

            <!-- Contenu principal -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Panneau de filtres -->
                <Transition appear enter-active-class="transition-all duration-700 custom-bezier"
                    enter-from-class="opacity-0 -translate-x-8" enter-to-class="opacity-100 translate-x-0">
                    <div class="lg:w-1/4">
                        <div class="sticky top-8 space-y-6">
                            <!-- Filtres -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-primary-50/30 border border-primary-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <FunnelIcon class="w-5 h-5 text-primary-600 mr-2" />
                                    Filtres
                                </h3>

                                <!-- Recherche -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                        Rechercher
                                    </label>
                                    <div class="relative">
                                        <MagnifyingGlassIcon
                                            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-nature-400" />
                                        <input v-model="searchQuery" type="text" placeholder="Numéro, client..."
                                            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300" />
                                    </div>
                                </div>

                                <!-- Statut -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                        Statut
                                    </label>
                                    <div class="space-y-2">
                                        <label v-for="status in statusOptions" :key="status.value"
                                            class="flex items-center space-x-3 cursor-pointer group">
                                            <input type="checkbox" :value="status.value" v-model="selectedStatuses"
                                                class="w-4 h-4 rounded border-nature-300 text-primary-600 focus:ring-primary-500" />
                                            <div class="flex-1 flex items-center justify-between">
                                                <span
                                                    class="text-nature-700 group-hover:text-nature-900 transition-colors">{{
                                                        status.label }}</span>
                                                <span class="text-xs px-2 py-1 rounded-full" :class="status.badgeClass">
                                                    {{ getStatusCount(status.value) }}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <!-- Date -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                        Période
                                    </label>
                                    <select v-model="selectedPeriod"
                                        class="w-full px-4 py-2.5 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white/50">
                                        <option value="all">Toutes les dates</option>
                                        <option value="today">Aujourd'hui</option>
                                        <option value="week">Cette semaine</option>
                                        <option value="month">Ce mois</option>
                                        <option value="quarter">Ce trimestre</option>
                                        <option value="year">Cette année</option>
                                        <option value="custom">Période personnalisée</option>
                                    </select>

                                    <!-- Période personnalisée -->
                                    <div v-if="selectedPeriod === 'custom'" class="mt-4 space-y-3">
                                        <div>
                                            <label class="block text-xs text-nature-600 mb-1">Du</label>
                                            <input v-model="customStartDate" type="date"
                                                class="w-full px-3 py-1.5 rounded-lg border border-nature-300/50" />
                                        </div>
                                        <div>
                                            <label class="block text-xs text-nature-600 mb-1">Au</label>
                                            <input v-model="customEndDate" type="date"
                                                class="w-full px-3 py-1.5 rounded-lg border border-nature-300/50" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Montant -->
                                <div>
                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                        Montant
                                    </label>
                                    <div class="space-y-3">
                                        <div>
                                            <label class="block text-xs text-nature-600 mb-1">Minimum</label>
                                            <input v-model="minAmount" type="number" placeholder="0 XAF"
                                                class="w-full px-3 py-1.5 rounded-lg border border-nature-300/50" />
                                        </div>
                                        <div>
                                            <label class="block text-xs text-nature-600 mb-1">Maximum</label>
                                            <input v-model="maxAmount" type="number" placeholder="100000 XAF"
                                                class="w-full px-3 py-1.5 rounded-lg border border-nature-300/50" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Boutons filtres -->
                                <div class="mt-6 pt-4 border-t border-nature-200/50 space-y-2">
                                    <button @click="applyFilters"
                                        class="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                        Appliquer les filtres
                                    </button>
                                    <button @click="resetFilters"
                                        class="w-full py-2.5 rounded-xl border border-nature-300 text-nature-700 font-medium hover:bg-nature-50 transition-all duration-300">
                                        Réinitialiser
                                    </button>
                                </div>
                            </div>

                            <!-- Téléchargement groupé -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-emerald-50/30 border border-emerald-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <ArrowDownTrayIcon class="w-5 h-5 text-emerald-600 mr-2" />
                                    Export
                                </h3>
                                <p class="text-sm text-nature-600 mb-4">
                                    Téléchargez toutes vos factures sélectionnées en un seul fichier.
                                </p>
                                <button @click="exportInvoices" :disabled="selectedInvoices.length === 0" :class="[
                                    'w-full py-2.5 rounded-xl font-medium transition-all duration-300',
                                    selectedInvoices.length > 0
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                                        : 'bg-nature-200 text-nature-400 cursor-not-allowed'
                                ]">
                                    <div class="flex items-center justify-center">
                                        <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
                                        Exporter ({{ selectedInvoices.length }})
                                    </div>
                                </button>
                            </div>

                            <!-- Aide rapide -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-blue-50/30 border border-blue-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-3 flex items-center">
                                    <QuestionMarkCircleIcon class="w-5 h-5 text-blue-600 mr-2" />
                                    Besoin d'aide ?
                                </h3>
                                <p class="text-sm text-nature-600 mb-4">
                                    Consultez notre guide complet sur la gestion des factures.
                                </p>
                                <button @click="openHelp"
                                    class="w-full py-2.5 rounded-xl border border-blue-300 text-blue-700 font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center">
                                    <BookOpenIcon class="w-5 h-5 mr-2" />
                                    Guide des factures
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- Liste des factures -->
                <Transition appear enter-active-class="transition-all duration-800 custom-bezier delay-200"
                    enter-from-class="opacity-0 translate-x-8" enter-to-class="opacity-100 translate-x-0">
                    <div class="lg:w-3/4">
                        <!-- En-tête de liste -->
                        <div class="mb-6">
                            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                <div class="mb-4 lg:mb-0">
                                    <h2 class="text-xl font-bold text-nature-900">
                                        {{ filteredInvoices.length }} facture{{ filteredInvoices.length !== 1 ? 's' : ''
                                        }}
                                    </h2>
                                    <p class="text-nature-600 text-sm">
                                        Total: {{ formatCurrency(totalAmount) }}
                                    </p>
                                </div>

                                <!-- Options d'affichage -->
                                <div class="flex items-center space-x-4">
                                    <!-- Sélection multiple -->
                                    <button @click="toggleSelectAll"
                                        class="flex items-center text-sm text-nature-700 hover:text-primary-700 transition-colors duration-300">
                                        <Checkbox v-if="!allSelected" class="w-4 h-4 mr-2 border-nature-300" />
                                        <CheckIcon v-else class="w-4 h-4 mr-2 text-primary-600" />
                                        {{ allSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
                                    </button>

                                    <!-- Tri -->
                                    <select v-model="sortBy"
                                        class="px-3 py-1.5 rounded-lg border border-nature-300/50 bg-white/50 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300">
                                        <option value="date_desc">Plus récentes</option>
                                        <option value="date_asc">Plus anciennes</option>
                                        <option value="amount_desc">Montant décroissant</option>
                                        <option value="amount_asc">Montant croissant</option>
                                        <option value="number">Numéro de facture</option>
                                    </select>

                                    <!-- Vue -->
                                    <div class="flex items-center space-x-1">
                                        <button @click="viewMode = 'list'" :class="[
                                            'p-2 rounded-lg transition-all duration-300',
                                            viewMode === 'list'
                                                ? 'bg-primary-100 text-primary-600'
                                                : 'text-nature-500 hover:text-primary-600 hover:bg-primary-50'
                                        ]">
                                            <Bars3Icon class="w-5 h-5" />
                                        </button>
                                        <button @click="viewMode = 'grid'" :class="[
                                            'p-2 rounded-lg transition-all duration-300',
                                            viewMode === 'grid'
                                                ? 'bg-primary-100 text-primary-600'
                                                : 'text-nature-500 hover:text-primary-600 hover:bg-primary-50'
                                        ]">
                                            <Squares2X2Icon class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Tags de filtres actifs -->
                            <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mb-4">
                                <span v-for="filter in activeFilters" :key="filter"
                                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-primary-100/50 to-primary-50 border border-primary-200/50 text-primary-800">
                                    {{ filter }}
                                    <button @click="removeFilter(filter)" class="ml-2 hover:text-primary-600">
                                        <XMarkIcon class="w-3 h-3" />
                                    </button>
                                </span>
                                <button @click="resetFilters"
                                    class="text-sm text-nature-600 hover:text-primary-600 transition-colors duration-300">
                                    Tout effacer
                                </button>
                            </div>
                        </div>

                        <!-- État de chargement -->
                        <Transition enter-active-class="transition-all duration-500 custom-bezier"
                            enter-from-class="opacity-0" enter-to-class="opacity-100"
                            leave-active-class="transition-all duration-300" leave-from-class="opacity-100"
                            leave-to-class="opacity-0">
                            <div v-if="loading" class="space-y-4">
                                <div v-for="i in 3" :key="i"
                                    class="h-32 bg-gradient-to-r from-white to-nature-50/50 rounded-xl animate-pulse border border-nature-200/30">
                                </div>
                            </div>
                        </Transition>

                        <!-- État vide -->
                        <Transition appear enter-active-class="transition-all duration-700 custom-bezier"
                            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100">
                            <div v-if="!loading && filteredInvoices.length === 0"
                                class="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-primary-200/50 bg-gradient-to-b from-white/60 to-primary-50/20 backdrop-blur-sm">
                                <div class="max-w-md mx-auto">
                                    <div
                                        class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                                        <DocumentTextIcon class="w-12 h-12 text-primary-400" />
                                    </div>
                                    <h3 class="text-2xl font-semibold text-nature-800 mb-3">
                                        Aucune facture trouvée
                                    </h3>
                                    <p class="text-nature-600 mb-8">
                                        Aucune facture ne correspond à vos critères de recherche.
                                        Essayez de modifier vos filtres ou créez une nouvelle facture.
                                    </p>
                                    <div class="space-x-4">
                                        <button @click="resetFilters"
                                            class="px-6 py-3 border border-nature-300 text-nature-700 rounded-xl font-medium hover:bg-nature-50 transition-all duration-300">
                                            Réinitialiser les filtres
                                        </button>
                                        <button @click="generateNewInvoice"
                                            class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            Créer une facture
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition>

                        <!-- Liste des factures -->
                        <div v-if="!loading && filteredInvoices.length > 0">
                            <!-- Vue liste -->
                            <TransitionGroup v-if="viewMode === 'list'" tag="div" name="list" class="space-y-4">
                                <div v-for="(invoice, index) in paginatedInvoices" :key="invoice.id" class="group"
                                    :style="{ animationDelay: `${index * 100}ms` }">
                                    <InvoiceListItem :invoice="invoice"
                                        :selected="selectedInvoices.includes(invoice.id)"
                                        @select="toggleInvoiceSelection(invoice.id)" @view="viewInvoice(invoice)"
                                        @pay="payInvoice(invoice)" @download="downloadInvoice(invoice)"
                                        @share="shareInvoice(invoice)" />
                                </div>
                            </TransitionGroup>

                            <!-- Vue grille -->
                            <TransitionGroup v-else tag="div" name="grid"
                                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <div v-for="(invoice, index) in paginatedInvoices" :key="invoice.id" class="group"
                                    :style="{ animationDelay: `${index * 100}ms` }">
                                    <InvoiceGridItem :invoice="invoice"
                                        :selected="selectedInvoices.includes(invoice.id)"
                                        @select="toggleInvoiceSelection(invoice.id)" @view="viewInvoice(invoice)"
                                        @pay="payInvoice(invoice)" @download="downloadInvoice(invoice)"
                                        @share="shareInvoice(invoice)" />
                                </div>
                            </TransitionGroup>

                            <!-- Pagination -->
                            <Transition enter-active-class="transition-all duration-500 custom-bezier"
                                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
                                <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
                                    <div class="text-sm text-nature-600">
                                        Affichage de {{ startItem }}-{{ endItem }} sur {{ filteredInvoices.length }}
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <button @click="previousPage" :disabled="currentPage === 1" :class="[
                                            'px-3 py-1.5 rounded-lg border transition-all duration-300',
                                            currentPage === 1
                                                ? 'border-nature-200 text-nature-400 cursor-not-allowed'
                                                : 'border-nature-300 text-nature-700 hover:bg-nature-50 hover:border-nature-400'
                                        ]">
                                            <ChevronLeftIcon class="w-4 h-4" />
                                        </button>

                                        <div class="flex items-center space-x-1">
                                            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                                                :class="[
                                                    'w-8 h-8 rounded-lg transition-all duration-300',
                                                    currentPage === page
                                                        ? 'bg-primary-500 text-white shadow-md'
                                                        : 'text-nature-700 hover:bg-nature-100'
                                                ]">
                                                {{ page }}
                                            </button>
                                            <span v-if="showEllipsis" class="px-2 text-nature-500">...</span>
                                        </div>

                                        <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
                                            'px-3 py-1.5 rounded-lg border transition-all duration-300',
                                            currentPage === totalPages
                                                ? 'border-nature-200 text-nature-400 cursor-not-allowed'
                                                : 'border-nature-300 text-nature-700 hover:bg-nature-50 hover:border-nature-400'
                                        ]">
                                            <ChevronRightIcon class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Toast de notification -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier"
            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="toast.show" :class="[
                'fixed bottom-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl max-w-sm backdrop-blur-sm border',
                toast.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-50/90 to-green-50/90 border-emerald-200/50'
                    : 'bg-gradient-to-r from-blue-50/90 to-blue-50/90 border-blue-200/50'
            ]">
                <div class="flex items-center space-x-3">
                    <component :is="toast.icon" class="w-6 h-6"
                        :class="toast.type === 'success' ? 'text-emerald-600' : 'text-blue-600'" />
                    <div>
                        <p class="font-medium text-nature-900">{{ toast.message }}</p>
                        <p class="text-sm text-nature-600 mt-1">{{ toast.details }}</p>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InvoiceListItem from './InvoiceListItem.vue'
import InvoiceGridItem from './InvoiceGridItem.vue'
import invoiceService from '../services/invoiceService'
import {
    PlusCircleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    DocumentArrowDownIcon,
    QuestionMarkCircleIcon,
    BookOpenIcon,
    Bars3Icon,
    Squares2X2Icon,
    XMarkIcon,
    DocumentTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    CurrencyDollarIcon,
    ShareIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Types
interface Invoice {
    id: string
    invoice_number: string
    customer_name: string
    customer_email: string
    issue_date: string
    due_date?: string
    total: number
    status: 'draft' | 'sent' | 'paid' | 'overdue'
    payment_method: string
    items_count: number
    currency: string
}

const loading = ref(true)
const invoices = ref<Invoice[]>([])

// Filtres
const searchQuery = ref('')
const selectedStatuses = ref<string[]>([])
const selectedPeriod = ref('all')
const customStartDate = ref('')
const customEndDate = ref('')
const minAmount = ref<number | null>(null)
const maxAmount = ref<number | null>(null)

// Affichage
const viewMode = ref<'list' | 'grid'>('list')
const sortBy = ref('date_desc')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const selectedInvoices = ref<string[]>([])

// Toast
const toast = ref({
    show: false,
    type: 'success' as 'success' | 'info',
    message: '',
    details: '',
    icon: DocumentTextIcon
})

// Options de statut
const statusOptions = [
    { value: 'draft', label: 'Brouillon', badgeClass: 'bg-nature-100 text-nature-800 border border-nature-200' },
    { value: 'sent', label: 'Envoyée', badgeClass: 'bg-primary-100 text-primary-800 border border-primary-200' },
    { value: 'paid', label: 'Payée', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
    { value: 'overdue', label: 'En retard', badgeClass: 'bg-red-100 text-red-800 border border-red-200' }
]

const normalizeInvoiceStatus = (status: unknown): Invoice['status'] => {
    const normalized = String(status || '').toLowerCase()
    if (normalized === 'draft') return 'draft'
    if (normalized === 'paid' || normalized === 'completed') return 'paid'
    if (normalized === 'overdue' || normalized === 'late') return 'overdue'
    return 'sent'
}

const mapBackendInvoice = (invoice: any): Invoice => ({
    id: String(invoice?.id ?? ''),
    invoice_number: String(invoice?.invoice_number ?? invoice?.invoiceNumber ?? ''),
    customer_name: String(
        invoice?.customer_name ??
        invoice?.customerName ??
        invoice?.customer?.name ??
        'Client'
    ),
    customer_email: String(
        invoice?.customer_email ??
        invoice?.customerEmail ??
        invoice?.customer?.email ??
        ''
    ),
    issue_date: String(invoice?.issue_date ?? invoice?.issueDate ?? invoice?.created_at ?? invoice?.createdAt ?? new Date().toISOString()),
    due_date: invoice?.due_date ?? invoice?.dueDate,
    total: Number(invoice?.total ?? invoice?.total_amount ?? invoice?.totalAmount ?? 0),
    status: normalizeInvoiceStatus(invoice?.status),
    payment_method: String(invoice?.payment_method ?? invoice?.paymentMethod ?? 'Non renseigné'),
    items_count: Number(invoice?.items_count ?? invoice?.items?.length ?? 0),
    currency: String(invoice?.currency ?? 'XAF')
})

// Statistiques
const stats = computed(() => [
    {
        label: 'Total des factures',
        value: invoices.value.length.toString(),
        filter: null,
        bgClass: 'border-primary-200/50 bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20',
        textClass: 'text-primary-700',
        icon: DocumentTextIcon,
        iconBg: 'bg-primary-100',
        iconColor: 'text-primary-600',
        trend: 'up' as const,
        change: '0%'
    },
    {
        label: 'À payer',
        value: invoices.value.filter(i => i.status === 'sent' || i.status === 'overdue').length.toString(),
        filter: ['sent', 'overdue'],
        bgClass: 'border-orange-200/50 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20',
        textClass: 'text-orange-700',
        icon: ArrowTrendingUpIcon,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        trend: 'up' as const,
        change: '0%'
    },
    {
        label: 'Payées',
        value: invoices.value.filter(i => i.status === 'paid').length.toString(),
        filter: 'paid',
        bgClass: 'border-emerald-200/50 bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20',
        textClass: 'text-emerald-700',
        icon: CheckIcon,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        trend: 'up' as const,
        change: '0%'
    },
    {
        label: 'Montant total',
        value: formatCurrency(invoices.value.reduce((sum, inv) => sum + inv.total, 0)),
        filter: null,
        bgClass: 'border-nature-200/50 bg-gradient-to-br from-nature-50/30 via-white to-nature-50/20',
        textClass: 'text-nature-700',
        icon: CurrencyDollarIcon,
        iconBg: 'bg-nature-100',
        iconColor: 'text-nature-600',
        trend: 'up' as const,
        change: '0%'
    }
])

// Computed
const filteredInvoices = computed(() => {
    let result = [...invoices.value]

    // Recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(invoice =>
            invoice.invoice_number.toLowerCase().includes(query) ||
            invoice.customer_name.toLowerCase().includes(query) ||
            invoice.customer_email.toLowerCase().includes(query)
        )
    }

    // Filtre par statut
    if (selectedStatuses.value.length > 0) {
        result = result.filter(invoice => selectedStatuses.value.includes(invoice.status))
    }

    // Filtre par période
    if (selectedPeriod.value !== 'all') {
        const now = new Date()
        const invoiceDate = new Date()

        result = result.filter(invoice => {
            invoiceDate.setTime(new Date(invoice.issue_date).getTime())

            switch (selectedPeriod.value) {
                case 'today':
                    return invoiceDate.toDateString() === now.toDateString()
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    return invoiceDate >= weekAgo
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    return invoiceDate >= monthAgo
                case 'quarter':
                    const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                    return invoiceDate >= quarterAgo
                case 'year':
                    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
                    return invoiceDate >= yearAgo
                case 'custom':
                    if (customStartDate.value && customEndDate.value) {
                        const start = new Date(customStartDate.value)
                        const end = new Date(customEndDate.value)
                        end.setHours(23, 59, 59, 999)
                        return invoiceDate >= start && invoiceDate <= end
                    }
                    return true
                default:
                    return true
            }
        })
    }

    // Filtre par montant
    if (minAmount.value !== null) {
        result = result.filter(invoice => invoice.total >= minAmount.value!)
    }
    if (maxAmount.value !== null) {
        result = result.filter(invoice => invoice.total <= maxAmount.value!)
    }

    // Tri
    result.sort((a, b) => {
        switch (sortBy.value) {
            case 'date_desc':
                return new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
            case 'date_asc':
                return new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime()
            case 'amount_desc':
                return b.total - a.total
            case 'amount_asc':
                return a.total - b.total
            case 'number':
                return b.invoice_number.localeCompare(a.invoice_number)
            default:
                return 0
        }
    })

    return result
})

const totalAmount = computed(() =>
    filteredInvoices.value.reduce((sum, invoice) => sum + invoice.total, 0)
)

const allSelected = computed(() =>
    selectedInvoices.value.length === filteredInvoices.value.length && filteredInvoices.value.length > 0
)

const activeFilters = computed(() => {
    const filters: string[] = []

    if (searchQuery.value) filters.push(`Recherche: "${searchQuery.value}"`)
    if (selectedStatuses.value.length > 0) {
        const statusLabels = selectedStatuses.value.map(status =>
            statusOptions.find(opt => opt.value === status)?.label
        ).filter(Boolean)
        if (statusLabels.length > 0) {
            filters.push(`Statut: ${statusLabels.join(', ')}`)
        }
    }
    if (selectedPeriod.value !== 'all') {
        const periodLabels: Record<string, string> = {
            today: 'Aujourd\'hui',
            week: 'Cette semaine',
            month: 'Ce mois',
            quarter: 'Ce trimestre',
            year: 'Cette année',
            custom: 'Période personnalisée'
        }
        filters.push(`Période: ${periodLabels[selectedPeriod.value]}`)
    }
    if (minAmount.value !== null) filters.push(`Min: ${formatCurrency(minAmount.value)}`)
    if (maxAmount.value !== null) filters.push(`Max: ${formatCurrency(maxAmount.value)}`)

    return filters
})

// Pagination
const totalPages = computed(() =>
    Math.ceil(filteredInvoices.value.length / itemsPerPage.value)
)

const paginatedInvoices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredInvoices.value.slice(start, end)
})

const startItem = computed(() =>
    (currentPage.value - 1) * itemsPerPage.value + 1
)

const endItem = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, filteredInvoices.value.length)
)

const visiblePages = computed(() => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages.value <= maxVisible) {
        for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    } else {
        let start = Math.max(1, currentPage.value - 2)
        let end = Math.min(totalPages.value, start + maxVisible - 1)

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }

        for (let i = start; i <= end; i++) pages.push(i)
    }

    return pages
})

const showEllipsis = computed(() =>
    totalPages.value > 5 && currentPage.value < totalPages.value - 2
)

// Méthodes
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CM', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const getStatusCount = (status: string) => {
    return invoices.value.filter(inv => inv.status === status).length
}

const filterByStatus = (status: string | string[] | null) => {
    if (!status) return

    if (Array.isArray(status)) {
        selectedStatuses.value = status
    } else {
        selectedStatuses.value = [status]
    }
    applyFilters()
}

const applyFilters = () => {
    currentPage.value = 1
    showToast('Filtres appliqués', `${filteredInvoices.value.length} factures trouvées`, 'info', FunnelIcon)
}

const resetFilters = () => {
    searchQuery.value = ''
    selectedStatuses.value = []
    selectedPeriod.value = 'all'
    customStartDate.value = ''
    customEndDate.value = ''
    minAmount.value = null
    maxAmount.value = null
    currentPage.value = 1
    selectedInvoices.value = []
    showToast('Filtres réinitialisés', 'Tous les filtres ont été effacés', 'info', FunnelIcon)
}

const removeFilter = (filterText: string) => {
    if (filterText.startsWith('Recherche:')) {
        searchQuery.value = ''
    } else if (filterText.startsWith('Statut:')) {
        selectedStatuses.value = []
    } else if (filterText.startsWith('Période:')) {
        selectedPeriod.value = 'all'
    } else if (filterText.startsWith('Min:')) {
        minAmount.value = null
    } else if (filterText.startsWith('Max:')) {
        maxAmount.value = null
    }
}

const toggleSelectAll = () => {
    if (allSelected.value) {
        selectedInvoices.value = []
    } else {
        selectedInvoices.value = filteredInvoices.value.map(inv => inv.id)
    }
}

const toggleInvoiceSelection = (invoiceId: string) => {
    const index = selectedInvoices.value.indexOf(invoiceId)
    if (index === -1) {
        selectedInvoices.value.push(invoiceId)
    } else {
        selectedInvoices.value.splice(index, 1)
    }
}

const viewInvoice = (invoice: Invoice) => {
    router.push(`/invoices/${invoice.id}`)
}

const payInvoice = (invoice: Invoice) => {
    showToast('Paiement', `Ouverture du paiement pour ${invoice.invoice_number}`, 'info', CurrencyDollarIcon)
}

const downloadInvoice = (invoice: Invoice) => {
    showToast('Téléchargement', `Facture ${invoice.invoice_number} téléchargée`, 'success', ArrowDownTrayIcon)
}

const shareInvoice = (invoice: Invoice) => {
    showToast('Partage', `Facture ${invoice.invoice_number} partagée`, 'success', ShareIcon)
}

const generateNewInvoice = () => {
    showToast('Nouvelle facture', 'Création d\'une nouvelle facture...', 'info', PlusCircleIcon)
    router.push('/invoices/new')
}

const exportInvoices = () => {
    if (selectedInvoices.value.length === 0) return

    showToast(
        'Export',
        `Téléchargement de ${selectedInvoices.value.length} facture(s)`,
        'success',
        DocumentArrowDownIcon
    )
}

const openHelp = () => {
    showToast('Aide', 'Ouverture du guide des factures...', 'info', BookOpenIcon)
}

// Pagination
const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const goToPage = (page: number) => {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showToast = (message: string, details: string, type: 'success' | 'info', icon?: any) => {
    toast.value = {
        show: true,
        type,
        message,
        details,
        icon: icon || DocumentTextIcon
    }

    setTimeout(() => {
        toast.value.show = false
    }, 5000)
}

const loadInvoices = async () => {
    loading.value = true
    try {
        const userInvoices = await invoiceService.getUserInvoices()
        invoices.value = Array.isArray(userInvoices) ? userInvoices.map(mapBackendInvoice) : []
    } catch (error) {
        invoices.value = []
        showToast('Erreur', 'Impossible de charger vos factures', 'info', QuestionMarkCircleIcon)
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadInvoices()
})
</script>

<style scoped>
/* Animations */
.leaf-float {
    animation: float-leaf 20s ease-in-out infinite;
}

@keyframes float-leaf {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-30px) rotate(5deg);
    }
}

.custom-bezier {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation de scintillement */
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* Transitions de liste */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.list-move {
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Transitions de grille */
.grid-enter-active,
.grid-leave-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.grid-enter-from,
.grid-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.grid-move {
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Délais d'animation */
.delay-100 {
    animation-delay: 100ms;
}

.delay-200 {
    animation-delay: 200ms;
}

.delay-300 {
    animation-delay: 300ms;
}

/* Variables CSS */
:root {
    --color-primary-50: #f0f9ff;
    --color-primary-500: #0ea5e9;
    --color-primary-600: #0284c7;
    --color-emerald-500: #10b981;
    --color-nature-50: #fafaf9;
    --color-nature-500: #78716c;
    --color-nature-600: #57534e;
    --color-nature-900: #1c1917;
}
</style>

