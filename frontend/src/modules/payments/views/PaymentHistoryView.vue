<template>
    <div
        class="min-h-screen bg-gradient-to-br from-soft-forest-green via-creamy-white to-earth-red-50 relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 bg-organic-pattern opacity-5"></div>

        <!-- Éléments décoratifs animés -->
        <div class="absolute top-20 left-5 w-20 h-20 opacity-5 animate-leaf-float">
            <LeafDecoration />
        </div>
        <div class="absolute bottom-10 right-8 w-24 h-24 opacity-5 animate-float">
            <FruitDecoration />
        </div>
        <div class="absolute top-40 right-10 w-16 h-16 opacity-5 animate-float delay-1000">
            <VegetableDecoration />
        </div>

        <!-- Navigation -->
        <header class="container mx-auto px-4 pt-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <div class="flex items-center space-x-4">
                        <router-link to="/payments"
                            class="flex items-center text-forest-green hover:text-soft-green transition-all duration-500 ease-organic group">
                            <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Retour aux paiements
                        </router-link>
                        <div class="hidden md:block w-1 h-6 bg-soft-green/30 rounded-full"></div>
                        <h1 class="text-3xl md:text-4xl font-serif font-bold text-forest-green">
                            Historique des paiements
                        </h1>
                    </div>
                    <p class="text-earth-brown mt-2 max-w-2xl">
                        Retrouvez l'ensemble de vos transactions et suivez l'état de vos commandes
                    </p>
                </div>

                <div class="flex items-center space-x-4">
                    <!-- Bouton export -->
                    <button @click="exportHistory"
                        class="flex items-center px-4 py-2 border-2 border-soft-green/30 text-forest-green rounded-xl hover:border-soft-green hover:bg-soft-green/5 transition-all duration-300 ease-organic">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exporter
                    </button>

                    <!-- Badge solde -->
                    <div
                        class="hidden md:block px-4 py-2 bg-gradient-to-r from-soft-green/10 to-cream/30 rounded-xl border border-soft-green/20">
                        <div class="text-sm text-earth-brown">Solde disponible</div>
                        <div class="text-lg font-bold text-forest-green">{{ formatCurrency(currentBalance) }}</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-6">
            <div class="max-w-7xl mx-auto">
                <!-- Statistiques rapides -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02]">
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-earth-brown">Total dépensé</div>
                                <div class="w-10 h-10 rounded-full bg-soft-green/20 flex items-center justify-center">
                                    <svg class="w-5 h-5 text-soft-green" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-forest-green">{{ formatCurrency(totalSpent) }}</div>
                            <div class="text-sm text-earth-brown/70 mt-2">Sur {{ totalTransactions }} transactions</div>
                        </div>

                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02]">
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-earth-brown">En attente</div>
                                <div class="w-10 h-10 rounded-full bg-earth-red/20 flex items-center justify-center">
                                    <svg class="w-5 h-5 text-earth-red" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-forest-green">{{ pendingTransactions }}</div>
                            <div class="text-sm text-earth-brown/70 mt-2">Paiements à confirmer</div>
                        </div>

                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02]">
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-earth-brown">Commandes ce mois</div>
                                <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-forest-green">{{ monthlyOrders }}</div>
                            <div class="text-sm text-earth-brown/70 mt-2">{{ formatCurrency(monthlySpent) }} dépensés
                            </div>
                        </div>

                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02]">
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-earth-brown">Producteurs soutenus</div>
                                <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-forest-green">{{ supportedProducers }}</div>
                            <div class="text-sm text-earth-brown/70 mt-2">Producteurs locaux</div>
                        </div>
                    </div>
                </transition>

                <!-- Filtres et Recherche -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-100"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-soft-green/20 shadow-organic">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div class="flex flex-wrap items-center gap-4">
                                <!-- Filtre par statut -->
                                <div class="relative">
                                    <select v-model="filters.status"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="">Tous les statuts</option>
                                        <option value="completed">Complétés</option>
                                        <option value="pending">En attente</option>
                                        <option value="failed">Échoués</option>
                                        <option value="refunded">Remboursés</option>
                                    </select>
                                    <div
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg class="w-5 h-5 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <!-- Filtre par méthode -->
                                <div class="relative">
                                    <select v-model="filters.method"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="">Toutes les méthodes</option>
                                        <option value="mobile-money">Mobile Money</option>
                                        <option value="credit-card">Carte bancaire</option>
                                        <option value="cash">Paiement à la livraison</option>
                                    </select>
                                    <div
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg class="w-5 h-5 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <!-- Filtre par période -->
                                <div class="relative">
                                    <select v-model="filters.period"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="all">Toute période</option>
                                        <option value="today">Aujourd'hui</option>
                                        <option value="week">Cette semaine</option>
                                        <option value="month">Ce mois</option>
                                        <option value="quarter">Ce trimestre</option>
                                    </select>
                                    <div
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg class="w-5 h-5 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <!-- Bouton réinitialiser -->
                                <button @click="resetFilters"
                                    class="px-4 py-3 border-2 border-soft-green/30 text-soft-green rounded-xl hover:border-soft-green hover:bg-soft-green/5 transition-all duration-300 ease-organic">
                                    Réinitialiser
                                </button>
                            </div>

                            <!-- Recherche -->
                            <div class="relative">
                                <input v-model="filters.search" type="text" placeholder="Rechercher une transaction..."
                                    class="w-full lg:w-64 bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-10 pr-4 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic" />
                                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-green"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Liste des transactions -->
                <transition-group appear tag="div" class="space-y-6" appear-class="opacity-0"
                    appear-active-class="transition-all duration-500 ease-organic" appear-to-class="opacity-100">
                    <!-- En-tête de liste -->
                    <div key="header"
                        class="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-sm text-earth-brown font-medium bg-white/50 backdrop-blur-sm rounded-2xl border border-soft-green/20">
                        <div class="col-span-3">Transaction</div>
                        <div class="col-span-2">Montant</div>
                        <div class="col-span-2">Méthode</div>
                        <div class="col-span-2">Statut</div>
                        <div class="col-span-3 text-right">Actions</div>
                    </div>

                    <!-- Carte de transaction -->
                    <div v-for="(transaction, index) in filteredTransactions" :key="transaction.id"
                        class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-2 transition-all duration-500 ease-organic hover:shadow-xl hover:border-soft-green/50 hover:scale-[1.005]"
                        :class="[
                            transaction.status === 'completed' ? 'border-soft-green/20' : '',
                            transaction.status === 'pending' ? 'border-yellow-500/20' : '',
                            transaction.status === 'failed' ? 'border-earth-red/20' : ''
                        ]" :style="`animation-delay: ${index * 50}ms;`">
                        <div class="lg:hidden mb-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <div class="text-lg font-semibold text-forest-green">{{ transaction.reference }}
                                    </div>
                                    <div class="text-sm text-earth-brown mt-1">{{ formatDate(transaction.date) }}</div>
                                </div>
                                <StatusBadge :status="transaction.status" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            <!-- Informations transaction (mobile/desktop) -->
                            <div class="lg:col-span-3">
                                <div class="hidden lg:block">
                                    <div class="font-semibold text-forest-green">{{ transaction.reference }}</div>
                                    <div class="text-sm text-earth-brown mt-1">{{ formatDate(transaction.date) }}</div>
                                </div>
                                <div class="lg:hidden">
                                    <div class="flex items-center space-x-3">
                                        <div :class="[
                                            'w-12 h-12 rounded-xl flex items-center justify-center',
                                            transaction.method === 'mobile-money' ? 'bg-soft-green/20' : '',
                                            transaction.method === 'credit-card' ? 'bg-blue-500/20' : '',
                                            transaction.method === 'cash' ? 'bg-earth-red/20' : ''
                                        ]">
                                            <component :is="getMethodIcon(transaction.method)" class="w-6 h-6" :class="[
                                                transaction.method === 'mobile-money' ? 'text-soft-green' : '',
                                                transaction.method === 'credit-card' ? 'text-blue-500' : '',
                                                transaction.method === 'cash' ? 'text-earth-red' : ''
                                            ]" />
                                        </div>
                                        <div>
                                            <div class="text-sm text-earth-brown">Méthode</div>
                                            <div class="font-medium text-forest-green">{{
                                                getMethodLabel(transaction.method) }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Montant (mobile/desktop) -->
                            <div class="lg:col-span-2">
                                <div class="lg:hidden text-sm text-earth-brown mb-1">Montant</div>
                                <div class="text-2xl font-bold text-forest-green">{{ formatCurrency(transaction.amount)
                                    }}</div>
                            </div>

                            <!-- Méthode (desktop seulement) -->
                            <div class="hidden lg:block lg:col-span-2">
                                <div class="flex items-center space-x-3">
                                    <div :class="[
                                        'w-10 h-10 rounded-lg flex items-center justify-center',
                                        transaction.method === 'mobile-money' ? 'bg-soft-green/20' : '',
                                        transaction.method === 'credit-card' ? 'bg-blue-500/20' : '',
                                        transaction.method === 'cash' ? 'bg-earth-red/20' : ''
                                    ]">
                                        <component :is="getMethodIcon(transaction.method)" class="w-5 h-5" :class="[
                                            transaction.method === 'mobile-money' ? 'text-soft-green' : '',
                                            transaction.method === 'credit-card' ? 'text-blue-500' : '',
                                            transaction.method === 'cash' ? 'text-earth-red' : ''
                                        ]" />
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-green">{{ getMethodLabel(transaction.method)
                                            }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Statut (desktop seulement) -->
                            <div class="hidden lg:block lg:col-span-2">
                                <StatusBadge :status="transaction.status" />
                            </div>

                            <!-- Actions -->
                            <div class="lg:col-span-3">
                                <div class="flex items-center justify-end space-x-3">
                                    <!-- Bouton détails -->
                                    <button @click="showTransactionDetails(transaction)"
                                        class="flex items-center px-4 py-2 bg-soft-green/10 text-soft-green rounded-xl hover:bg-soft-green/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Détails
                                    </button>

                                    <!-- Bouton réitération (pour échec) -->
                                    <button v-if="transaction.status === 'failed'" @click="retryPayment(transaction)"
                                        class="flex items-center px-4 py-2 bg-earth-red/10 text-earth-red rounded-xl hover:bg-earth-red/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Réessayer
                                    </button>

                                    <!-- Bouton facture -->
                                    <button v-if="transaction.status === 'completed'"
                                        @click="downloadInvoice(transaction)"
                                        class="flex items-center px-4 py-2 bg-forest-green/10 text-forest-green rounded-xl hover:bg-forest-green/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Facture
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Résumé des produits (mobile) -->
                        <div class="lg:hidden mt-6 pt-6 border-t border-soft-green/10">
                            <div class="text-sm text-earth-brown mb-2">Produits</div>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="product in transaction.products.slice(0, 3)" :key="product"
                                    class="px-3 py-1 bg-cream/50 text-earth-brown rounded-lg text-sm">
                                    {{ product }}
                                </span>
                                <span v-if="transaction.products.length > 3"
                                    class="px-3 py-1 bg-cream/50 text-earth-brown rounded-lg text-sm">
                                    +{{ transaction.products.length - 3 }} autres
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- État vide -->
                    <div v-if="filteredTransactions.length === 0" key="empty-state" class="text-center py-16">
                        <div class="w-32 h-32 mx-auto mb-6 opacity-20">
                            <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 class="text-2xl font-semibold text-forest-green mb-2">Aucune transaction trouvée</h3>
                        <p class="text-earth-brown mb-8 max-w-md mx-auto">
                            {{ filtersApplied ? 'Aucune transaction ne correspond à vos filtres.' : 'Vous n\'avez pas encore effectué de transaction.' }}
                        </p>
                        <button v-if="filtersApplied" @click="resetFilters"
                            class="px-6 py-3 bg-soft-green text-white rounded-xl hover:bg-forest-green transition-all duration-300 ease-organic transform hover:scale-105">
                            Réinitialiser les filtres
                        </button>
                        <router-link v-else to="/products"
                            class="inline-flex items-center px-6 py-3 bg-soft-green text-white rounded-xl hover:bg-forest-green transition-all duration-300 ease-organic transform hover:scale-105">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Découvrir les produits
                        </router-link>
                    </div>
                </transition-group>

                <!-- Pagination -->
                <div v-if="filteredTransactions.length > 0" class="mt-12 flex justify-center">
                    <div class="flex items-center space-x-2">
                        <button @click="previousPage" :disabled="currentPage === 1" :class="[
                            'px-4 py-2 rounded-xl border transition-all duration-300 ease-organic',
                            currentPage === 1
                                ? 'border-soft-green/20 text-soft-green/50 cursor-not-allowed'
                                : 'border-soft-green/30 text-soft-green hover:border-soft-green hover:bg-soft-green/5'
                        ]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div class="flex items-center space-x-1">
                            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                                'w-10 h-10 rounded-xl transition-all duration-300 ease-organic',
                                currentPage === page
                                    ? 'bg-soft-green text-white'
                                    : 'text-forest-green hover:bg-soft-green/10'
                            ]">
                                {{ page }}
                            </button>
                        </div>

                        <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
                            'px-4 py-2 rounded-xl border transition-all duration-300 ease-organic',
                            currentPage === totalPages
                                ? 'border-soft-green/20 text-soft-green/50 cursor-not-allowed'
                                : 'border-soft-green/30 text-soft-green hover:border-soft-green hover:bg-soft-green/5'
                        ]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Modal de détails -->
        <transaction-details-modal v-if="selectedTransaction" :transaction="selectedTransaction"
            @close="selectedTransaction = null" />

        <!-- Footer -->
        <footer class="container mx-auto px-6 py-8 mt-12 border-t border-soft-green/20">
            <div class="text-center text-earth-brown/70 text-sm">
                <p>Vos transactions sont sécurisées et cryptées. Consultez notre <a href="#"
                        class="text-soft-green hover:underline">politique de confidentialité</a>.</p>
                <p class="mt-2">Pour toute question sur une transaction, contactez notre service client.</p>
            </div>
        </footer>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { formatCurrency } from '../utils/currencyFormatter'
import TransactionDetailsModal from './components/TransactionDetailsModal.vue'

// Composants décoratifs
const LeafDecoration = {
    template: `
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <path d="M50,20 C70,10 85,25 80,45 C75,65 55,75 40,85 C25,75 15,60 20,40 C25,20 40,25 50,20 Z" 
            fill="currentColor" opacity="0.3"/>
    </svg>
  `
}

const FruitDecoration = {
    template: `
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.2"/>
      <path d="M50,20 L55,40 L70,45 L55,50 L60,65 L50,55 L40,65 L45,50 L30,45 L45,40 Z" 
            fill="currentColor" opacity="0.4"/>
    </svg>
  `
}

const VegetableDecoration = {
    template: `
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <path d="M50,20 C60,15 75,20 78,35 C81,50 70,65 55,75 C40,65 30,50 30,35 C30,20 40,15 50,20 Z" 
            fill="currentColor" opacity="0.3"/>
    </svg>
  `
}

// Composant Badge de statut
const StatusBadge = {
    props: ['status'],
    template: `
    <span 
      :class="[
        'px-3 py-1 rounded-full text-sm font-medium',
        status === 'completed' ? 'bg-green-100 text-green-800' : '',
        status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '',
        status === 'failed' ? 'bg-red-100 text-red-800' : '',
        status === 'refunded' ? 'bg-blue-100 text-blue-800' : ''
      ]"
    >
      {{ getStatusLabel(status) }}
    </span>
  `,
    methods: {
        getStatusLabel(status) {
            const labels = {
                'completed': 'Complété',
                'pending': 'En attente',
                'failed': 'Échoué',
                'refunded': 'Remboursé'
            }
            return labels[status] || status
        }
    }
}

export default {
    name: 'PaymentHistoryView',
    components: {
        TransactionDetailsModal,
        StatusBadge
    },
    setup() {
        const filters = ref({
            status: '',
            method: '',
            period: 'all',
            search: ''
        })

        const selectedTransaction = ref(null)
        const currentPage = ref(1)
        const itemsPerPage = 10

        // Données de test
        const transactions = ref([
            {
                id: 1,
                reference: 'CMD-2024-00123',
                date: '2024-03-15T10:30:00',
                amount: 15750,
                method: 'mobile-money',
                status: 'completed',
                products: ['Tomates cerises bio', 'Avocats hass', 'Piments frais'],
                details: {
                    operator: 'MTN Mobile Money',
                    phone: '699 00 00 00',
                    deliveryAddress: 'Rue 1234, Quartier Bastos, Yaoundé'
                }
            },
            {
                id: 2,
                reference: 'CMD-2024-00124',
                date: '2024-03-14T14:20:00',
                amount: 8900,
                method: 'credit-card',
                status: 'completed',
                products: ['Salade fraîche', 'Oignons nouveaux'],
                details: {
                    cardType: 'Visa',
                    lastDigits: '4242',
                    deliveryAddress: 'Avenue Kennedy, Douala'
                }
            },
            {
                id: 3,
                reference: 'CMD-2024-00125',
                date: '2024-03-13T09:15:00',
                amount: 12400,
                method: 'cash',
                status: 'pending',
                products: ['Mangues', 'Ananas', 'Papayes'],
                details: {
                    deliveryType: 'À la livraison',
                    deliveryAddress: 'Boulevard du 20 Mai, Yaoundé'
                }
            },
            {
                id: 4,
                reference: 'CMD-2024-00126',
                date: '2024-03-12T16:45:00',
                amount: 6500,
                method: 'mobile-money',
                status: 'failed',
                products: ['Carottes', 'Céléri'],
                details: {
                    operator: 'Orange Money',
                    phone: '655 00 00 00',
                    reason: 'Fonds insuffisants'
                }
            },
            {
                id: 5,
                reference: 'CMD-2024-00127',
                date: '2024-03-10T11:10:00',
                amount: 21300,
                method: 'credit-card',
                status: 'completed',
                products: ['Poulet fermier', 'Œufs bio', 'Fromage local'],
                details: {
                    cardType: 'Mastercard',
                    lastDigits: '8888',
                    deliveryAddress: 'Rue des Banques, Bafoussam'
                }
            },
            {
                id: 6,
                reference: 'CMD-2024-00128',
                date: '2024-03-08T13:30:00',
                amount: 7400,
                method: 'mobile-money',
                status: 'refunded',
                products: ['Courgettes', 'Aubergines'],
                details: {
                    operator: 'MTN Mobile Money',
                    phone: '699 00 00 00',
                    refundReason: 'Produit non disponible'
                }
            }
        ])

        // Computed properties
        const filteredTransactions = computed(() => {
            let filtered = [...transactions.value]

            // Filtre par statut
            if (filters.value.status) {
                filtered = filtered.filter(t => t.status === filters.value.status)
            }

            // Filtre par méthode
            if (filters.value.method) {
                filtered = filtered.filter(t => t.method === filters.value.method)
            }

            // Filtre par période
            if (filters.value.period !== 'all') {
                const now = new Date()
                filtered = filtered.filter(t => {
                    const date = new Date(t.date)
                    switch (filters.value.period) {
                        case 'today':
                            return date.toDateString() === now.toDateString()
                        case 'week':
                            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                            return date >= weekAgo
                        case 'month':
                            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                            return date >= monthAgo
                        case 'quarter':
                            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                            return date >= quarterAgo
                        default:
                            return true
                    }
                })
            }

            // Filtre par recherche
            if (filters.value.search) {
                const searchTerm = filters.value.search.toLowerCase()
                filtered = filtered.filter(t =>
                    t.reference.toLowerCase().includes(searchTerm) ||
                    t.products.some(p => p.toLowerCase().includes(searchTerm))
                )
            }

            // Pagination
            const start = (currentPage.value - 1) * itemsPerPage
            const end = start + itemsPerPage
            return filtered.slice(start, end)
        })

        const totalTransactions = computed(() => transactions.value.length)
        const totalPages = computed(() => Math.ceil(transactions.value.length / itemsPerPage))

        const totalSpent = computed(() => {
            return transactions.value
                .filter(t => t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
        })

        const pendingTransactions = computed(() => {
            return transactions.value.filter(t => t.status === 'pending').length
        })

        const monthlyOrders = computed(() => {
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            return transactions.value.filter(t =>
                new Date(t.date) >= monthAgo && t.status === 'completed'
            ).length
        })

        const monthlySpent = computed(() => {
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            return transactions.value
                .filter(t => new Date(t.date) >= monthAgo && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
        })

        const supportedProducers = computed(() => {
            // Simuler des producteurs uniques basés sur les transactions
            return new Set(transactions.value.flatMap(t => t.products)).size
        })

        const filtersApplied = computed(() => {
            return filters.value.status || filters.value.method ||
                filters.value.period !== 'all' || filters.value.search
        })

        const currentBalance = computed(() => {
            // Simuler un solde (dans un cas réel, cela viendrait d'une API)
            return 25000
        })

        // Methods
        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const getMethodIcon = (method) => {
            const icons = {
                'mobile-money': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 6h-1V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v1H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-1h4v1h-4V5zm8 14H7V8h10v11zm-5-9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          `
                },
                'credit-card': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
          `
                },
                'cash': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
          `
                }
            }
            return icons[method] || icons['mobile-money']
        }

        const getMethodLabel = (method) => {
            const labels = {
                'mobile-money': 'Mobile Money',
                'credit-card': 'Carte bancaire',
                'cash': 'Paiement à la livraison'
            }
            return labels[method] || method
        }

        const resetFilters = () => {
            filters.value = {
                status: '',
                method: '',
                period: 'all',
                search: ''
            }
            currentPage.value = 1
        }

        const showTransactionDetails = (transaction) => {
            selectedTransaction.value = transaction
        }

        const retryPayment = (transaction) => {
            // Logique de réessai de paiement
            console.log('Réessai de paiement pour:', transaction.reference)
            // Rediriger vers la page de paiement avec les détails de la transaction
        }

        const downloadInvoice = (transaction) => {
            // Logique de téléchargement de facture
            console.log('Téléchargement facture pour:', transaction.reference)
        }

        const exportHistory = () => {
            // Logique d'export
            console.log('Export de l\'historique')
        }

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

        const goToPage = (page) => {
            currentPage.value = page
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        onMounted(() => {
            // Charger les transactions depuis l'API
            // fetchTransactions()
        })

        return {
            filters,
            selectedTransaction,
            currentPage,
            transactions: filteredTransactions,
            totalTransactions,
            totalPages,
            totalSpent,
            pendingTransactions,
            monthlyOrders,
            monthlySpent,
            supportedProducers,
            filtersApplied,
            currentBalance,
            formatCurrency,
            formatDate,
            getMethodIcon,
            getMethodLabel,
            resetFilters,
            showTransactionDetails,
            retryPayment,
            downloadInvoice,
            exportHistory,
            previousPage,
            nextPage,
            goToPage,
            LeafDecoration,
            FruitDecoration,
            VegetableDecoration
        }
    }
}
</script>

<style scoped>
/* Animation d'entrée progressive pour les cartes */
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Appliquer l'animation avec délai dynamique */
.transaction-card {
    animation: fade-in-up 0.6s ease-out forwards;
}

/* Classes de couleurs personnalisées */
.bg-soft-forest-green {
    background-color: #e8f5f0;
}

.bg-creamy-white {
    background-color: #fefaf6;
}

.bg-earth-red-50 {
    background-color: #fdf6f3;
}

.text-forest-green {
    color: #1a4731;
}

.text-soft-green {
    color: #00a86b;
}

.text-earth-brown {
    color: #8b7355;
}

.text-earth-red {
    color: #c44536;
}

.bg-organic-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300a86b' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.shadow-organic {
    box-shadow:
        0 10px 25px -5px rgba(0, 168, 107, 0.1),
        0 10px 10px -5px rgba(0, 168, 107, 0.04),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
}

/* Courbe de Bézier personnalisée pour les animations "ultra-fluides" */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-15px) rotate(5deg);
    }
}

@keyframes leaf-float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    33% {
        transform: translateY(-10px) rotate(-3deg);
    }

    66% {
        transform: translateY(-8px) rotate(3deg);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-leaf-float {
    animation: leaf-float 8s ease-in-out infinite;
}

.delay-1000 {
    animation-delay: 1s;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(0, 168, 107, 0.1);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 168, 107, 0.3);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 168, 107, 0.5);
}

/* Amélioration du focus pour l'accessibilité */
:focus {
    outline: 2px solid rgba(0, 168, 107, 0.5);
    outline-offset: 2px;
}

:focus:not(:focus-visible) {
    outline: none;
}

:focus-visible {
    outline: 2px solid rgba(0, 168, 107, 0.5);
    outline-offset: 2px;
}
</style>