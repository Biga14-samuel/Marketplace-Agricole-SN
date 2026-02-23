<template>
    <div
        class="payout-list-page min-h-screen bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30 overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none" :style="{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
          <svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='payout-list-pattern' width='50' height='50' patternUnits='userSpaceOnUse'>
                <path d='M0,25 Q12.5,15 25,25 T50,25' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <path d='M25,0 Q15,12.5 25,25 T25,50' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <circle cx='12.5' cy='12.5' r='3' fill='%2300a896' opacity='0.03'/>
                <circle cx='37.5' cy='37.5' r='3' fill='%2300a896' opacity='0.03'/>
                <path d='M10,40 Q25,30 40,40' stroke='%2300a896' fill='none' stroke-width='0.3' opacity='0.03'/>
              </pattern>
            </defs>
            <rect width='100' height='100' fill='url(%23payout-list-pattern)'/>
          </svg>
        `)}')`
        }"></div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-20 left-10 w-48 h-48 leaf-float opacity-10">
            <div class="w-full h-full bg-emerald-300/20 rounded-full blur-3xl"></div>
        </div>
        <div class="absolute bottom-20 right-10 w-56 h-56 leaf-float opacity-10" style="animation-delay: 2s;">
            <div class="w-full h-full bg-amber-300/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Conteneur principal -->
        <div class="container mx-auto px-4 py-8 relative z-10">
            <!-- En-tête avec animations -->
            <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
                enter-from-class="opacity-0 -translate-y-6" enter-to-class="opacity-100 translate-y-0">
                <div class="mb-10">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div class="mb-6 lg:mb-0">
                            <div class="flex items-center space-x-3 mb-4">
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center shadow-lg">
                                    <BanknotesIcon class="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h1 class="text-4xl font-bold text-nature-900">
                                        <span
                                            class="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                            Mes Versements
                                        </span>
                                    </h1>
                                    <p class="text-nature-600">
                                        Suivez et gérez tous vos versements en un seul endroit
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Actions principales -->
                        <div class="flex flex-wrap gap-3">
                            <button @click="requestPayout"
                                class="group relative overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <div class="relative flex items-center">
                                    <PlusCircleIcon class="w-5 h-5 mr-2" />
                                    Demander un versement
                                </div>
                            </button>
                            <button @click="exportPayouts"
                                class="group relative overflow-hidden px-5 py-2.5 rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <div class="relative flex items-center">
                                    <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
                                    Exporter
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Statistiques en temps réel -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-emerald-50/30 border border-emerald-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <FunnelIcon class="w-5 h-5 text-emerald-600 mr-2" />
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
                                        <input v-model="searchQuery" type="text" placeholder="N° versement, période..."
                                            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-nature-300/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300" />
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
                                                class="w-4 h-4 rounded border-nature-300 text-emerald-600 focus:ring-emerald-500" />
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

                                <!-- Période -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                        Période
                                    </label>
                                    <select v-model="selectedPeriod"
                                        class="w-full px-4 py-2.5 rounded-xl border border-nature-300/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-white/50">
                                        <option value="all">Toutes les périodes</option>
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
                                            <input v-model="maxAmount" type="number" placeholder="1000000 XAF"
                                                class="w-full px-3 py-1.5 rounded-lg border border-nature-300/50" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Boutons filtres -->
                                <div class="mt-6 pt-4 border-t border-nature-200/50 space-y-2">
                                    <button @click="applyFilters"
                                        class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                        Appliquer les filtres
                                    </button>
                                    <button @click="resetFilters"
                                        class="w-full py-2.5 rounded-xl border border-nature-300 text-nature-700 font-medium hover:bg-nature-50 transition-all duration-300">
                                        Réinitialiser
                                    </button>
                                </div>
                            </div>

                            <!-- Récapitulatif financier -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-blue-50/30 border border-blue-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <ChartBarIcon class="w-5 h-5 text-blue-600 mr-2" />
                                    Récapitulatif
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Total versé</span>
                                        <span class="font-bold text-blue-600">{{ formatCurrency(totalPaid) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">En attente</span>
                                        <span class="font-bold text-amber-600">{{ formatCurrency(totalPending) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Commission totale</span>
                                        <span class="font-bold text-nature-900">{{ formatCurrency(totalCommission)
                                            }}</span>
                                    </div>
                                    <div class="pt-3 border-t border-nature-200/50">
                                        <div class="flex justify-between text-lg font-bold">
                                            <span class="text-nature-900">Revenus nets</span>
                                            <span class="text-emerald-600">{{ formatCurrency(totalNet) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Prochain versement -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-green-50/30 border border-green-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <CalendarIcon class="w-5 h-5 text-green-600 mr-2" />
                                    Prochain versement
                                </h3>
                                <div v-if="nextPayout" class="space-y-3">
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Date estimée</span>
                                        <span class="font-medium text-nature-900">{{
                                            formatDate(nextPayout.estimated_date) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Montant estimé</span>
                                        <span class="font-bold text-emerald-600">{{
                                            formatCurrency(nextPayout.estimated_amount) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Commandes incluses</span>
                                        <span class="font-medium text-nature-900">{{ nextPayout.orders_count }}</span>
                                    </div>
                                    <button @click="viewNextPayoutDetails"
                                        class="w-full mt-4 py-2.5 rounded-xl border border-green-300 text-green-700 font-medium hover:bg-green-50 transition-all duration-300">
                                        Voir le détail
                                    </button>
                                </div>
                                <div v-else class="text-center py-4">
                                    <p class="text-nature-500 text-sm">Aucun versement à venir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- Liste des versements -->
                <Transition appear enter-active-class="transition-all duration-800 custom-bezier delay-200"
                    enter-from-class="opacity-0 translate-x-8" enter-to-class="opacity-100 translate-x-0">
                    <div class="lg:w-3/4">
                        <!-- En-tête de liste -->
                        <div class="mb-6">
                            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                <div class="mb-4 lg:mb-0">
                                    <h2 class="text-xl font-bold text-nature-900">
                                        {{ filteredPayouts.length }} versement{{ filteredPayouts.length !== 1 ? 's' : ''
                                        }}
                                    </h2>
                                    <p class="text-nature-600 text-sm">
                                        Total net: {{ formatCurrency(totalFilteredAmount) }}
                                    </p>
                                </div>

                                <!-- Options d'affichage -->
                                <div class="flex items-center space-x-4">
                                    <!-- Tri -->
                                    <select v-model="sortBy"
                                        class="px-3 py-1.5 rounded-lg border border-nature-300/50 bg-white/50 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300">
                                        <option value="date_desc">Plus récents</option>
                                        <option value="date_asc">Plus anciens</option>
                                        <option value="amount_desc">Montant décroissant</option>
                                        <option value="amount_asc">Montant croissant</option>
                                        <option value="status">Par statut</option>
                                    </select>

                                    <!-- Vue -->
                                    <div class="flex items-center space-x-1">
                                        <button @click="viewMode = 'list'" :class="[
                                            'p-2 rounded-lg transition-all duration-300',
                                            viewMode === 'list'
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'text-nature-500 hover:text-emerald-600 hover:bg-emerald-50'
                                        ]">
                                            <Bars3Icon class="w-5 h-5" />
                                        </button>
                                        <button @click="viewMode = 'grid'" :class="[
                                            'p-2 rounded-lg transition-all duration-300',
                                            viewMode === 'grid'
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'text-nature-500 hover:text-emerald-600 hover:bg-emerald-50'
                                        ]">
                                            <Squares2X2Icon class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Tags de filtres actifs -->
                            <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mb-4">
                                <span v-for="filter in activeFilters" :key="filter"
                                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-emerald-100/50 to-emerald-50 border border-emerald-200/50 text-emerald-800">
                                    {{ filter }}
                                    <button @click="removeFilter(filter)" class="ml-2 hover:text-emerald-600">
                                        <XMarkIcon class="w-3 h-3" />
                                    </button>
                                </span>
                                <button @click="resetFilters"
                                    class="text-sm text-nature-600 hover:text-emerald-600 transition-colors duration-300">
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
                            <div v-if="!loading && filteredPayouts.length === 0"
                                class="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-emerald-200/50 bg-gradient-to-b from-white/60 to-emerald-50/20 backdrop-blur-sm">
                                <div class="max-w-md mx-auto">
                                    <div
                                        class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                                        <BanknotesIcon class="w-12 h-12 text-emerald-400" />
                                    </div>
                                    <h3 class="text-2xl font-semibold text-nature-800 mb-3">
                                        Aucun versement trouvé
                                    </h3>
                                    <p class="text-nature-600 mb-8">
                                        Aucun versement ne correspond à vos critères de recherche.
                                        Essayez de modifier vos filtres ou demandez un nouveau versement.
                                    </p>
                                    <div class="space-x-4">
                                        <button @click="resetFilters"
                                            class="px-6 py-3 border border-nature-300 text-nature-700 rounded-xl font-medium hover:bg-nature-50 transition-all duration-300">
                                            Réinitialiser les filtres
                                        </button>
                                        <button @click="requestPayout"
                                            class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            Demander un versement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition>

                        <!-- Liste des versements -->
                        <div v-if="!loading && filteredPayouts.length > 0">
                            <!-- Vue liste -->
                            <TransitionGroup v-if="viewMode === 'list'" tag="div" name="list" class="space-y-4">
                                <div v-for="(payout, index) in paginatedPayouts" :key="payout.id" class="group"
                                    :style="{ animationDelay: `${index * 100}ms` }">
                                    <PayoutListItem :payout="payout" @view="viewPayoutDetails(payout)"
                                        @download="downloadPayout(payout)" @track="trackPayout(payout)"
                                        @contact="contactSupport(payout)" />
                                </div>
                            </TransitionGroup>

                            <!-- Vue grille -->
                            <TransitionGroup v-else tag="div" name="grid"
                                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <div v-for="(payout, index) in paginatedPayouts" :key="payout.id" class="group"
                                    :style="{ animationDelay: `${index * 100}ms` }">
                                    <PayoutGridItem :payout="payout" @view="viewPayoutDetails(payout)"
                                        @download="downloadPayout(payout)" @track="trackPayout(payout)"
                                        @contact="contactSupport(payout)" />
                                </div>
                            </TransitionGroup>

                            <!-- Pagination -->
                            <Transition enter-active-class="transition-all duration-500 custom-bezier"
                                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
                                <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
                                    <div class="text-sm text-nature-600">
                                        Affichage de {{ startItem }}-{{ endItem }} sur {{ filteredPayouts.length }}
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
                                                        ? 'bg-emerald-500 text-white shadow-md'
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

        <!-- Modal de détails du versement -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <PayoutDetailModal v-if="selectedPayout" :payout="selectedPayout" @close="selectedPayout = null"
                @download="downloadPayout(selectedPayout)" @track="trackPayout(selectedPayout)"
                @contact="contactSupport(selectedPayout)" />
        </Transition>

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
import PayoutListItem from './PayoutListItem.vue'
import PayoutGridItem from './PayoutGridItem.vue'
import PayoutDetailModal from './PayoutDetailModal.vue'
import {
    BanknotesIcon,
    PlusCircleIcon,
    ArrowDownTrayIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    CalendarIcon,
    Bars3Icon,
    Squares2X2Icon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    TruckIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Types
interface Payout {
    id: string
    payout_number: string
    period_start: string
    period_end: string
    gross_amount: number
    commission: number
    net_amount: number
    status: 'pending' | 'processing' | 'completed' | 'failed'
    paid_at?: string
    payment_method: string
    transaction_id?: string
    orders_count: number
    currency: string
}

// Données mockées
const loading = ref(true)
const payouts = ref<Payout[]>([
    {
        id: '1',
        payout_number: 'PAY-2024-00123',
        period_start: '2024-03-01',
        period_end: '2024-03-31',
        gross_amount: 456800,
        commission: 68520,
        net_amount: 388280,
        status: 'completed',
        paid_at: '2024-04-05',
        payment_method: 'Mobile Money (MTN)',
        transaction_id: 'TXN-7890123456',
        orders_count: 42,
        currency: 'XAF'
    },
    {
        id: '2',
        payout_number: 'PAY-2024-00124',
        period_start: '2024-04-01',
        period_end: '2024-04-15',
        gross_amount: 287500,
        commission: 43125,
        net_amount: 244375,
        status: 'processing',
        payment_method: 'Orange Money',
        orders_count: 28,
        currency: 'XAF'
    },
    {
        id: '3',
        payout_number: 'PAY-2024-00125',
        period_start: '2024-02-01',
        period_end: '2024-02-29',
        gross_amount: 389200,
        commission: 58380,
        net_amount: 330820,
        status: 'completed',
        paid_at: '2024-03-05',
        payment_method: 'Virement bancaire',
        transaction_id: 'TXN-7890123457',
        orders_count: 35,
        currency: 'XAF'
    },
    {
        id: '4',
        payout_number: 'PAY-2024-00126',
        period_start: '2024-04-16',
        period_end: '2024-04-30',
        gross_amount: 156300,
        commission: 23445,
        net_amount: 132855,
        status: 'pending',
        payment_method: 'Non défini',
        orders_count: 15,
        currency: 'XAF'
    },
    {
        id: '5',
        payout_number: 'PAY-2024-00127',
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        gross_amount: 312400,
        commission: 46860,
        net_amount: 265540,
        status: 'completed',
        paid_at: '2024-02-05',
        payment_method: 'Mobile Money (MTN)',
        transaction_id: 'TXN-7890123458',
        orders_count: 31,
        currency: 'XAF'
    },
    {
        id: '6',
        payout_number: 'PAY-2024-00128',
        period_start: '2023-12-01',
        period_end: '2023-12-31',
        gross_amount: 289500,
        commission: 43425,
        net_amount: 246075,
        status: 'completed',
        paid_at: '2024-01-05',
        payment_method: 'Orange Money',
        transaction_id: 'TXN-7890123459',
        orders_count: 29,
        currency: 'XAF'
    }
])

const nextPayout = ref({
    estimated_date: '2024-05-05',
    estimated_amount: 215000,
    orders_count: 22
})

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
const itemsPerPage = ref(6)
const selectedPayout = ref<Payout | null>(null)

// Toast
const toast = ref({
    show: false,
    type: 'success' as 'success' | 'info',
    message: '',
    details: '',
    icon: BanknotesIcon
})

// Options de statut
const statusOptions = [
    { value: 'pending', label: 'En attente', badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200' },
    { value: 'processing', label: 'En cours', badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200' },
    { value: 'completed', label: 'Complété', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
    { value: 'failed', label: 'Échoué', badgeClass: 'bg-red-100 text-red-800 border border-red-200' }
]

// Statistiques
const stats = computed(() => [
    {
        label: 'Total versé',
        value: formatCurrency(payouts.value.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.net_amount, 0)),
        filter: 'completed',
        bgClass: 'border-emerald-200/50 bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20',
        textClass: 'text-emerald-700',
        icon: BanknotesIcon,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        trend: 'up' as const,
        change: '+18%'
    },
    {
        label: 'En attente',
        value: payouts.value.filter(p => p.status === 'pending').length.toString(),
        filter: 'pending',
        bgClass: 'border-amber-200/50 bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20',
        textClass: 'text-amber-700',
        icon: ClockIcon,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        trend: 'down' as const,
        change: '-5%'
    },
    {
        label: 'En cours',
        value: payouts.value.filter(p => p.status === 'processing').length.toString(),
        filter: 'processing',
        bgClass: 'border-blue-200/50 bg-gradient-to-br from-blue-50/30 via-white to-blue-50/20',
        textClass: 'text-blue-700',
        icon: TruckIcon,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        trend: 'up' as const,
        change: '+12%'
    },
    {
        label: 'Revenus nets',
        value: formatCurrency(payouts.value.reduce((sum, p) => sum + p.net_amount, 0)),
        filter: null,
        bgClass: 'border-nature-200/50 bg-gradient-to-br from-nature-50/30 via-white to-nature-50/20',
        textClass: 'text-nature-700',
        icon: CurrencyDollarIcon,
        iconBg: 'bg-nature-100',
        iconColor: 'text-nature-600',
        trend: 'up' as const,
        change: '+22%'
    }
])

// Computed
const filteredPayouts = computed(() => {
    let result = [...payouts.value]

    // Recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(payout =>
            payout.payout_number.toLowerCase().includes(query) ||
            payout.transaction_id?.toLowerCase().includes(query) ||
            payout.payment_method.toLowerCase().includes(query)
        )
    }

    // Filtre par statut
    if (selectedStatuses.value.length > 0) {
        result = result.filter(payout => selectedStatuses.value.includes(payout.status))
    }

    // Filtre par période
    if (selectedPeriod.value !== 'all') {
        const now = new Date()
        const payoutDate = new Date()

        result = result.filter(payout => {
            payoutDate.setTime(new Date(payout.period_end).getTime())

            switch (selectedPeriod.value) {
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    return payoutDate >= weekAgo
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    return payoutDate >= monthAgo
                case 'quarter':
                    const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                    return payoutDate >= quarterAgo
                case 'year':
                    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
                    return payoutDate >= yearAgo
                case 'custom':
                    if (customStartDate.value && customEndDate.value) {
                        const start = new Date(customStartDate.value)
                        const end = new Date(customEndDate.value)
                        end.setHours(23, 59, 59, 999)
                        return payoutDate >= start && payoutDate <= end
                    }
                    return true
                default:
                    return true
            }
        })
    }

    // Filtre par montant
    if (minAmount.value !== null) {
        result = result.filter(payout => payout.net_amount >= minAmount.value!)
    }
    if (maxAmount.value !== null) {
        result = result.filter(payout => payout.net_amount <= maxAmount.value!)
    }

    // Tri
    result.sort((a, b) => {
        switch (sortBy.value) {
            case 'date_desc':
                return new Date(b.period_end).getTime() - new Date(a.period_end).getTime()
            case 'date_asc':
                return new Date(a.period_end).getTime() - new Date(b.period_end).getTime()
            case 'amount_desc':
                return b.net_amount - a.net_amount
            case 'amount_asc':
                return a.net_amount - b.net_amount
            case 'status':
                return a.status.localeCompare(b.status)
            default:
                return 0
        }
    })

    return result
})

const totalFilteredAmount = computed(() =>
    filteredPayouts.value.reduce((sum, payout) => sum + payout.net_amount, 0)
)

const totalPaid = computed(() =>
    payouts.value.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.net_amount, 0)
)

const totalPending = computed(() =>
    payouts.value.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.net_amount, 0)
)

const totalCommission = computed(() =>
    payouts.value.reduce((sum, p) => sum + p.commission, 0)
)

const totalNet = computed(() =>
    payouts.value.reduce((sum, p) => sum + p.net_amount, 0)
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
    Math.ceil(filteredPayouts.value.length / itemsPerPage.value)
)

const paginatedPayouts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPayouts.value.slice(start, end)
})

const startItem = computed(() =>
    (currentPage.value - 1) * itemsPerPage.value + 1
)

const endItem = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, filteredPayouts.value.length)
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
    return payouts.value.filter(p => p.status === status).length
}

const filterByStatus = (status: string | null) => {
    if (!status) return

    selectedStatuses.value = [status]
    applyFilters()
}

const applyFilters = () => {
    currentPage.value = 1
    showToast('Filtres appliqués', `${filteredPayouts.value.length} versements trouvés`, 'info', FunnelIcon)
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

const viewPayoutDetails = (payout: Payout) => {
    selectedPayout.value = payout
}

const downloadPayout = (payout: Payout) => {
    showToast('Téléchargement', `Reçu du versement ${payout.payout_number} téléchargé`, 'success', ArrowDownTrayIcon)
}

const trackPayout = (payout: Payout) => {
    showToast('Suivi', `Ouverture du suivi pour ${payout.payout_number}`, 'info', TruckIcon)
}

const contactSupport = (payout: Payout) => {
    showToast('Support', `Contact du support pour ${payout.payout_number}`, 'info', CurrencyDollarIcon)
}

const requestPayout = () => {
    router.push('/payouts/request')
}

const exportPayouts = () => {
    showToast(
        'Export',
        `Téléchargement de ${filteredPayouts.value.length} versement(s)`,
        'success',
        ArrowDownTrayIcon
    )
}

const viewNextPayoutDetails = () => {
    showToast('Versement à venir', 'Ouverture des détails du prochain versement', 'info', CalendarIcon)
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
        icon: icon || BanknotesIcon
    }

    setTimeout(() => {
        toast.value.show = false
    }, 5000)
}

// Lifecycle
onMounted(() => {
    // Simulation de chargement
    setTimeout(() => {
        loading.value = false
    }, 800)
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
    --color-emerald-50: #ecfdf5;
    --color-emerald-500: #10b981;
    --color-emerald-600: #059669;
    --color-amber-500: #f59e0b;
    --color-blue-500: #3b82f6;
    --color-nature-50: #fafaf9;
    --color-nature-200: #e7e5e4;
    --color-nature-500: #78716c;
    --color-nature-600: #57534e;
    --color-nature-700: #44403c;
    --color-nature-900: #1c1917;
}
</style>