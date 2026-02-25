<template>
    <div
        class="min-h-screen bg-gradient-to-br from-soft-forest-green via-creamy-white to-earth-red-50 relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 bg-organic-pattern opacity-5"></div>

        <!-- Éléments décoratifs animés -->
        <div class="absolute top-24 left-8 w-24 h-24 opacity-10 animate-leaf-float">
            <LeafDecoration />
        </div>
        <div class="absolute bottom-32 right-10 w-28 h-28 opacity-10 animate-float">
            <FruitDecoration />
        </div>
        <div class="absolute top-1/2 left-12 w-20 h-20 opacity-5 animate-float delay-2000">
            <ReceiptDecoration />
        </div>

        <!-- Navigation -->
        <header class="container mx-auto px-4 pt-8">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                    <div class="flex items-center space-x-4 mb-3">
                        <router-link to="/payments"
                            class="flex items-center text-forest-green hover:text-soft-green transition-all duration-500 ease-organic group">
                            <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Retour aux paiements
                        </router-link>
                        <div class="hidden lg:block w-1 h-6 bg-soft-green/30 rounded-full"></div>
                        <h1 class="text-3xl lg:text-4xl font-serif font-bold text-forest-green">
                            Mes factures
                        </h1>
                    </div>
                    <p class="text-earth-brown max-w-2xl">
                        Consultez, téléchargez et gérez toutes vos factures en un seul endroit
                    </p>
                </div>

                <!-- Boutons d'action -->
                <div class="flex flex-wrap gap-4">
                    <button @click="exportAllInvoices"
                        class="flex items-center px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-soft-green/30 text-forest-green rounded-xl hover:border-soft-green hover:bg-white transition-all duration-300 ease-organic group">
                        <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exporter tout
                    </button>

                    <button @click="generateTaxReport"
                        class="flex items-center px-4 py-3 bg-gradient-to-r from-soft-green to-forest-green text-white rounded-xl hover:shadow-lg transition-all duration-300 ease-organic transform hover:scale-105">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Rapport fiscal
                    </button>
                </div>
            </div>
        </header>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-6">
            <div class="max-w-7xl mx-auto">
                <!-- En-tête avec statistiques -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="mb-10">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <!-- Carte statistique 1 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Total facturé</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-soft-green/20 flex items-center justify-center group-hover:bg-soft-green/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ formatCurrency(totalInvoiced)
                                }}</div>
                                <div class="flex items-center text-sm text-earth-brown/70">
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        +12% ce mois
                                    </span>
                                </div>
                            </div>

                            <!-- Carte statistique 2 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Factures ce mois</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ monthlyInvoices }}</div>
                                <div class="flex items-center text-sm text-earth-brown/70">
                                    <span
                                        class="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        {{ pendingInvoices }} en attente
                                    </span>
                                </div>
                            </div>

                            <!-- Carte statistique 3 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Économies TVA</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ formatCurrency(vatSaved) }}
                                </div>
                                <div class="text-sm text-earth-brown/70">Produits locaux exonérés</div>
                            </div>

                            <!-- Carte statistique 4 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">CO₂ économisé</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-earth-red/20 flex items-center justify-center group-hover:bg-earth-red/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-earth-red" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ carbonSaved }}kg</div>
                                <div class="text-sm text-earth-brown/70">Circuit court</div>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Barre de filtres -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-100"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-soft-green/20 shadow-organic">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <!-- Filtres de gauche -->
                            <div class="flex flex-wrap items-center gap-4">
                                <!-- Année -->
                                <div class="relative">
                                    <select v-model="filters.year"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="all">Toutes années</option>
                                        <option v-for="year in availableYears" :key="year" :value="year">
                                            {{ year }}
                                        </option>
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

                                <!-- Statut -->
                                <div class="relative">
                                    <select v-model="filters.status"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="all">Tous statuts</option>
                                        <option value="paid">Payées</option>
                                        <option value="pending">En attente</option>
                                        <option value="overdue">En retard</option>
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

                                <!-- Type de facture -->
                                <div class="relative">
                                    <select v-model="filters.type"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="all">Tous types</option>
                                        <option value="purchase">Achats</option>
                                        <option value="subscription">Abonnements</option>
                                        <option value="refund">Remboursements</option>
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
                            <div class="flex items-center space-x-4">
                                <div class="relative flex-grow lg:flex-grow-0">
                                    <input v-model="filters.search" type="text" placeholder="Rechercher une facture..."
                                        class="w-full lg:w-64 bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-10 pr-4 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic" />
                                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-green"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Filtres rapides -->
                        <div class="mt-6 pt-6 border-t border-soft-green/10">
                            <div class="flex flex-wrap gap-2">
                                <button v-for="quickFilter in quickFilters" :key="quickFilter.id"
                                    @click="applyQuickFilter(quickFilter)" :class="[
                                        'px-4 py-2 rounded-xl border transition-all duration-300 ease-organic',
                                        activeQuickFilter === quickFilter.id
                                            ? 'bg-soft-green text-white border-soft-green'
                                            : 'bg-white border-soft-green/30 text-forest-green hover:border-soft-green'
                                    ]">
                                    {{ quickFilter.label }}
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Liste des factures -->
                <div class="mb-12">
                    <!-- En-tête de liste (desktop) -->
                    <div
                        class="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 text-sm text-earth-brown font-medium bg-white/50 backdrop-blur-sm rounded-2xl border border-soft-green/20 mb-4">
                        <div class="col-span-3">Référence</div>
                        <div class="col-span-2">Date</div>
                        <div class="col-span-2">Montant</div>
                        <div class="col-span-2">Statut</div>
                        <div class="col-span-3 text-right">Actions</div>
                    </div>

                    <!-- Transition group pour les factures -->
                    <transition-group appear tag="div" class="space-y-4"
                        appear-class="opacity-0 transform translate-y-4"
                        appear-active-class="transition-all duration-500 ease-organic"
                        appear-to-class="opacity-100 transform translate-y-0">
                        <!-- Carte de facture -->
                        <div v-for="(invoice, index) in filteredInvoices" :key="invoice.id"
                            class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-2 transition-all duration-500 ease-organic hover:shadow-xl hover:border-soft-green/50 hover:scale-[1.005] group"
                            :class="[
                                invoice.status === 'paid' ? 'border-soft-green/20' : '',
                                invoice.status === 'pending' ? 'border-yellow-500/20' : '',
                                invoice.status === 'overdue' ? 'border-earth-red/20' : ''
                            ]" :style="`animation-delay: ${index * 50}ms;`">
                            <!-- Version mobile -->
                            <div class="lg:hidden mb-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <div class="text-lg font-semibold text-forest-green">{{ invoice.number }}</div>
                                        <div class="text-sm text-earth-brown mt-1">{{ formatDate(invoice.date) }}</div>
                                    </div>
                                    <InvoiceStatusBadge :status="invoice.status" />
                                </div>
                                <div class="text-2xl font-bold text-forest-green mb-4">
                                    {{ formatCurrency(invoice.amount) }}
                                </div>
                            </div>

                            <!-- Grille desktop/mobile -->
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                <!-- Référence -->
                                <div class="lg:col-span-3">
                                    <div class="hidden lg:block">
                                        <div
                                            class="font-semibold text-forest-green group-hover:text-soft-green transition-colors duration-300">
                                            {{ invoice.number }}
                                        </div>
                                        <div class="text-sm text-earth-brown mt-1">{{ formatDate(invoice.date) }}</div>
                                    </div>
                                    <div class="lg:hidden">
                                        <div class="flex items-center space-x-3">
                                            <div :class="[
                                                'w-12 h-12 rounded-xl flex items-center justify-center',
                                                invoice.type === 'purchase' ? 'bg-soft-green/20' : '',
                                                invoice.type === 'subscription' ? 'bg-blue-500/20' : '',
                                                invoice.type === 'refund' ? 'bg-green-500/20' : ''
                                            ]">
                                                <component :is="getInvoiceTypeIcon(invoice.type)" class="w-6 h-6"
                                                    :class="[
                                                        invoice.type === 'purchase' ? 'text-soft-green' : '',
                                                        invoice.type === 'subscription' ? 'text-blue-500' : '',
                                                        invoice.type === 'refund' ? 'text-green-500' : ''
                                                    ]" />
                                            </div>
                                            <div>
                                                <div class="text-sm text-earth-brown">Type</div>
                                                <div class="font-medium text-forest-green">{{
                                                    getInvoiceTypeLabel(invoice.type) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Date (desktop) -->
                                <div class="hidden lg:block lg:col-span-2">
                                    <div class="text-forest-green">{{ formatDate(invoice.date) }}</div>
                                    <div class="text-sm text-earth-brown">{{ formatRelativeDate(invoice.date) }}</div>
                                </div>

                                <!-- Montant -->
                                <div class="lg:col-span-2">
                                    <div class="hidden lg:block text-2xl font-bold text-forest-green">
                                        {{ formatCurrency(invoice.amount) }}
                                    </div>
                                    <div class="lg:hidden text-sm text-earth-brown mb-1">Montant TTC</div>
                                    <div class="lg:hidden text-lg font-bold text-forest-green">
                                        {{ formatCurrency(invoice.amount) }}
                                    </div>
                                    <div v-if="invoice.vat > 0" class="text-xs text-earth-brown/70">
                                        dont TVA : {{ formatCurrency(invoice.vat) }}
                                    </div>
                                </div>

                                <!-- Statut (desktop) -->
                                <div class="hidden lg:block lg:col-span-2">
                                    <InvoiceStatusBadge :status="invoice.status" />
                                </div>

                                <!-- Actions -->
                                <div class="lg:col-span-3">
                                    <div class="flex flex-wrap items-center justify-end gap-2">
                                        <!-- Bouton aperçu -->
                                        <button @click="previewInvoice(invoice)"
                                            class="flex items-center px-3 py-2 bg-soft-green/10 text-soft-green rounded-lg hover:bg-soft-green/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span class="hidden sm:inline">Aperçu</span>
                                        </button>

                                        <!-- Bouton télécharger -->
                                        <button @click="downloadInvoice(invoice)"
                                            class="flex items-center px-3 py-2 bg-forest-green/10 text-forest-green rounded-lg hover:bg-forest-green/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span class="hidden sm:inline">PDF</span>
                                        </button>

                                        <!-- Bouton partager -->
                                        <button @click="shareInvoice(invoice)"
                                            class="flex items-center px-3 py-2 bg-earth-red/10 text-earth-red rounded-lg hover:bg-earth-red/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                            <span class="hidden sm:inline">Partager</span>
                                        </button>

                                        <!-- Menu d'actions -->
                                        <div class="relative">
                                            <button @click="toggleActionMenu(invoice.id)"
                                                class="flex items-center px-3 py-2 border border-soft-green/30 text-forest-green rounded-lg hover:border-soft-green transition-all duration-300 ease-organic">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                </svg>
                                            </button>

                                            <!-- Menu déroulant -->
                                            <div v-if="activeActionMenu === invoice.id"
                                                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-soft-green/20 z-10">
                                                <div class="py-1">
                                                    <button @click="duplicateInvoice(invoice)"
                                                        class="w-full text-left px-4 py-2 text-sm text-earth-brown hover:bg-soft-green/10 hover:text-forest-green transition-colors duration-200">
                                                        Dupliquer la facture
                                                    </button>
                                                    <button @click="sendReminder(invoice)"
                                                        v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                                                        class="w-full text-left px-4 py-2 text-sm text-earth-brown hover:bg-soft-green/10 hover:text-forest-green transition-colors duration-200">
                                                        Envoyer un rappel
                                                    </button>
                                                    <button @click="archiveInvoice(invoice)"
                                                        class="w-full text-left px-4 py-2 text-sm text-earth-brown hover:bg-soft-green/10 hover:text-forest-green transition-colors duration-200">
                                                        Archiver
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations supplémentaires (mobile) -->
                            <div class="lg:hidden mt-6 pt-6 border-t border-soft-green/10">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <div class="text-sm text-earth-brown mb-1">Statut</div>
                                        <InvoiceStatusBadge :status="invoice.status" />
                                    </div>
                                    <div>
                                        <div class="text-sm text-earth-brown mb-1">Échéance</div>
                                        <div class="font-medium text-forest-green">{{ formatDate(invoice.dueDate) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Produits résumés -->
                                <div v-if="invoice.products" class="mt-4">
                                    <div class="text-sm text-earth-brown mb-2">Produits</div>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="product in invoice.products.slice(0, 2)" :key="product"
                                            class="px-2 py-1 bg-cream/50 text-earth-brown rounded-lg text-xs">
                                            {{ product }}
                                        </span>
                                        <span v-if="invoice.products.length > 2"
                                            class="px-2 py-1 bg-cream/50 text-earth-brown rounded-lg text-xs">
                                            +{{ invoice.products.length - 2 }} autres
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- État vide -->
                        <div v-if="filteredInvoices.length === 0" key="empty-state" class="text-center py-16">
                            <div class="w-40 h-40 mx-auto mb-6 opacity-20">
                                <ReceiptDecoration />
                            </div>
                            <h3 class="text-2xl font-semibold text-forest-green mb-3">
                                {{ filtersApplied ? 'Aucune facture trouvée' : 'Aucune facture pour le moment' }}
                            </h3>
                            <p class="text-earth-brown mb-8 max-w-md mx-auto">
                                {{ filtersApplied
                                    ? 'Aucune facture ne correspond à vos critères de recherche.'
                                    : 'Vos factures apparaîtront ici après vos achats.'
                                }}
                            </p>
                            <div class="flex flex-wrap justify-center gap-4">
                                <button v-if="filtersApplied" @click="resetFilters"
                                    class="px-6 py-3 bg-soft-green text-white rounded-xl hover:bg-forest-green transition-all duration-300 ease-organic transform hover:scale-105">
                                    Réinitialiser les filtres
                                </button>
                                <router-link to="/products"
                                    class="px-6 py-3 bg-white border-2 border-soft-green text-soft-green rounded-xl hover:bg-soft-green hover:text-white transition-all duration-300 ease-organic transform hover:scale-105">
                                    Découvrir nos produits
                                </router-link>
                            </div>
                        </div>
                    </transition-group>
                </div>

                <!-- Section informations -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-300"
                    appear-from-class="opacity-0 transform translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <!-- Information TVA -->
                        <div
                            class="bg-gradient-to-br from-soft-green/10 to-cream/50 rounded-3xl p-6 border border-soft-green/20">
                            <div class="flex items-start mb-4">
                                <div
                                    class="w-12 h-12 rounded-full bg-soft-green/20 flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-soft-green" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-forest-green mb-2">TVA réduite</h4>
                                    <p class="text-sm text-earth-brown">
                                        Les produits agricoles locaux bénéficient d'un taux de TVA réduit de 5,5% au
                                        lieu de 19,25%.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Information archive -->
                        <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-soft-green/20">
                            <div class="flex items-start mb-4">
                                <div
                                    class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-forest-green mb-2">Conservation</h4>
                                    <p class="text-sm text-earth-brown">
                                        Vos factures sont conservées 10 ans conformément à la réglementation fiscale
                                        camerounaise.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Information support -->
                        <div
                            class="bg-gradient-to-br from-earth-red/10 to-cream/50 rounded-3xl p-6 border border-earth-red/20">
                            <div class="flex items-start mb-4">
                                <div
                                    class="w-12 h-12 rounded-full bg-earth-red/20 flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-earth-red" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-forest-green mb-2">Besoin d'aide ?</h4>
                                    <p class="text-sm text-earth-brown mb-3">
                                        Une erreur sur votre facture ? Contactez notre service client.
                                    </p>
                                    <button @click="contactSupport"
                                        class="text-soft-green font-medium hover:text-forest-green transition-colors duration-300">
                                        Contactez-nous →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </main>

        <!-- Modal d'aperçu de facture -->
        <invoice-preview-modal v-if="selectedInvoice" :invoice="selectedInvoice" @close="selectedInvoice = null" />

        <!-- Footer -->
        <footer class="container mx-auto px-6 py-8 mt-12 border-t border-soft-green/20">
            <div class="text-center text-earth-brown/70 text-sm">
                <p>Factures générées conformément à la réglementation fiscale camerounaise.</p>
                <p class="mt-2">N° RCCM : RC/YAO/2024/B/1234 • NIU : M1234567891234</p>
            </div>
        </footer>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { formatCurrency } from '../utils/currencyFormatter'
import InvoicePreviewModal from '../components/InvoiceViewer.vue'
import invoiceService from '../services/invoiceService'

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

const ReceiptDecoration = {
    template: `
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <rect x="20" y="20" width="60" height="60" rx="10" fill="currentColor" opacity="0.2"/>
      <line x1="30" y1="35" x2="70" y2="35" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <line x1="30" y1="45" x2="70" y2="45" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <line x1="30" y1="55" x2="70" y2="55" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <line x1="30" y1="65" x2="70" y2="65" stroke="currentColor" stroke-width="2" opacity="0.4"/>
    </svg>
  `
}

// Composant Badge de statut de facture
const InvoiceStatusBadge = {
    props: ['status'],
    template: `
    <span 
      :class="[
        'px-3 py-1 rounded-full text-sm font-medium inline-flex items-center',
        status === 'paid' ? 'bg-green-100 text-green-800' : '',
        status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '',
        status === 'overdue' ? 'bg-red-100 text-red-800' : ''
      ]"
    >
      <span :class="[
        'w-2 h-2 rounded-full mr-2',
        status === 'paid' ? 'bg-green-500' : '',
        status === 'pending' ? 'bg-yellow-500' : '',
        status === 'overdue' ? 'bg-red-500' : ''
      ]"></span>
      {{ getStatusLabel(status) }}
    </span>
  `,
    methods: {
        getStatusLabel(status) {
            const labels = {
                'paid': 'Payée',
                'pending': 'En attente',
                'overdue': 'En retard'
            }
            return labels[status] || status
        }
    }
}

export default {
    name: 'InvoiceView',
    components: {
        InvoicePreviewModal,
        InvoiceStatusBadge
    },
    setup() {
        const filters = ref({
            year: 'all',
            status: 'all',
            type: 'all',
            search: ''
        })

        const selectedInvoice = ref(null)
        const activeActionMenu = ref(null)
        const activeQuickFilter = ref('recent')

        const invoices = ref([])

        const quickFilters = ref([
            { id: 'recent', label: 'Récentes' },
            { id: 'pending', label: 'En attente' },
            { id: 'overdue', label: 'En retard' },
            { id: 'thisMonth', label: 'Ce mois' },
            { id: 'lastMonth', label: 'Mois dernier' },
            { id: 'highAmount', label: 'Montant élevé' }
        ])

        const normalizeStatus = (status) => {
            const normalized = String(status || '').toLowerCase()
            if (normalized === 'paid' || normalized === 'completed') return 'paid'
            if (normalized === 'overdue' || normalized === 'late') return 'overdue'
            return 'pending'
        }

        const normalizeType = (type) => {
            const normalized = String(type || '').toLowerCase()
            if (normalized === 'refund' || normalized === 'credit') return 'refund'
            if (normalized === 'subscription' || normalized === 'recurring') return 'subscription'
            return 'purchase'
        }

        const mapBackendInvoice = (invoice) => ({
            id: invoice?.id,
            number: invoice?.invoice_number || invoice?.invoiceNumber || `FACT-${invoice?.id || ''}`,
            date: invoice?.issue_date || invoice?.issueDate || invoice?.createdAt || new Date().toISOString(),
            dueDate: invoice?.due_date || invoice?.dueDate,
            amount: Number(invoice?.total || invoice?.total_amount || invoice?.totalAmount || 0),
            vat: Number(invoice?.vat || invoice?.tax_amount || invoice?.taxAmount || 0),
            type: normalizeType(invoice?.type),
            status: normalizeStatus(invoice?.status),
            products: Array.isArray(invoice?.items)
                ? invoice.items.map(item => item?.description || item?.productName || item?.name).filter(Boolean)
                : [],
            customer: {
                name: invoice?.customer_name || invoice?.customerName || invoice?.customer?.name || 'Client',
                address: invoice?.customer_address || invoice?.customerAddress?.street || invoice?.customer?.address || 'Cameroun'
            }
        })

        // Computed properties
        const filteredInvoices = computed(() => {
            let filtered = [...invoices.value]

            // Filtre par année
            if (filters.value.year !== 'all') {
                const year = parseInt(filters.value.year)
                filtered = filtered.filter(invoice => {
                    const invoiceYear = new Date(invoice.date).getFullYear()
                    return invoiceYear === year
                })
            }

            // Filtre par statut
            if (filters.value.status !== 'all') {
                filtered = filtered.filter(invoice => invoice.status === filters.value.status)
            }

            // Filtre par type
            if (filters.value.type !== 'all') {
                filtered = filtered.filter(invoice => invoice.type === filters.value.type)
            }

            // Filtre par recherche
            if (filters.value.search) {
                const searchTerm = filters.value.search.toLowerCase()
                filtered = filtered.filter(invoice =>
                    invoice.number.toLowerCase().includes(searchTerm) ||
                    invoice.customer.name.toLowerCase().includes(searchTerm) ||
                    invoice.products.some(p => p.toLowerCase().includes(searchTerm))
                )
            }

            return filtered
        })

        const totalInvoiced = computed(() => {
            return invoices.value
                .filter(inv => inv.status === 'paid')
                .reduce((sum, inv) => sum + inv.amount, 0)
        })

        const monthlyInvoices = computed(() => {
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            return invoices.value.filter(inv => new Date(inv.date) >= monthAgo).length
        })

        const pendingInvoices = computed(() => {
            return invoices.value.filter(inv => inv.status === 'pending').length
        })

        const vatSaved = computed(() => {
            return invoices.value
                .filter(inv => inv.type === 'purchase')
                .reduce((sum, inv) => sum + Number(inv.vat || 0), 0)
        })

        const carbonSaved = computed(() => {
            return (invoices.value.length * 0.5).toFixed(1)
        })

        const availableYears = computed(() => {
            const years = new Set(invoices.value.map(inv => new Date(inv.date).getFullYear()))
            return Array.from(years).sort((a, b) => b - a)
        })

        const filtersApplied = computed(() => {
            return filters.value.year !== 'all' ||
                filters.value.status !== 'all' ||
                filters.value.type !== 'all' ||
                filters.value.search
        })

        // Methods
        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        }

        const formatRelativeDate = (dateString) => {
            const date = new Date(dateString)
            const now = new Date()
            const diffTime = Math.abs(now - date)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 0) return "Aujourd'hui"
            if (diffDays === 1) return "Hier"
            if (diffDays < 7) return `Il y a ${diffDays} jours`
            if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
            if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
            return `Il y a ${Math.floor(diffDays / 365)} ans`
        }

        const getInvoiceTypeIcon = (type) => {
            const icons = {
                'purchase': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          `
                },
                'subscription': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
            </svg>
          `
                },
                'refund': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          `
                }
            }
            return icons[type] || icons['purchase']
        }

        const getInvoiceTypeLabel = (type) => {
            const labels = {
                'purchase': 'Achat',
                'subscription': 'Abonnement',
                'refund': 'Remboursement'
            }
            return labels[type] || type
        }

        const resetFilters = () => {
            filters.value = {
                year: 'all',
                status: 'all',
                type: 'all',
                search: ''
            }
            activeQuickFilter.value = 'recent'
        }

        const applyQuickFilter = (filter) => {
            activeQuickFilter.value = filter.id

            switch (filter.id) {
                case 'recent':
                    // Trier par date récente
                    invoices.value.sort((a, b) => new Date(b.date) - new Date(a.date))
                    break
                case 'pending':
                    filters.value.status = 'pending'
                    break
                case 'overdue':
                    filters.value.status = 'overdue'
                    break
                case 'thisMonth':
                    filters.value.year = '2024' // À adapter dynamiquement
                    break
                case 'highAmount':
                    // Trier par montant décroissant
                    invoices.value.sort((a, b) => b.amount - a.amount)
                    break
            }
        }

        const previewInvoice = (invoice) => {
            selectedInvoice.value = invoice
        }

        const downloadInvoice = (invoice) => {
            // Logique de téléchargement
            console.log('Téléchargement facture:', invoice.number)
            // Générer et télécharger le PDF
        }

        const shareInvoice = (invoice) => {
            // Logique de partage
            console.log('Partage facture:', invoice.number)
            // Partage par email ou autres canaux
        }

        const toggleActionMenu = (invoiceId) => {
            activeActionMenu.value = activeActionMenu.value === invoiceId ? null : invoiceId
        }

        const duplicateInvoice = (invoice) => {
            console.log('Duplication facture:', invoice.number)
            activeActionMenu.value = null
        }

        const sendReminder = (invoice) => {
            console.log('Envoi rappel pour:', invoice.number)
            activeActionMenu.value = null
        }

        const archiveInvoice = (invoice) => {
            console.log('Archivage facture:', invoice.number)
            activeActionMenu.value = null
        }

        const exportAllInvoices = () => {
            console.log('Export de toutes les factures')
            // Logique d'export en ZIP ou PDF
        }

        const generateTaxReport = () => {
            console.log('Génération rapport fiscal')
            // Générer un rapport fiscal annuel
        }

        const contactSupport = () => {
            // Rediriger vers la page de contact
            console.log('Contact support')
        }

        const fetchInvoices = async () => {
            try {
                const userInvoices = await invoiceService.getUserInvoices()
                invoices.value = Array.isArray(userInvoices)
                    ? userInvoices.map(mapBackendInvoice)
                    : []
            } catch (error) {
                invoices.value = []
            }
        }

        onMounted(() => {
            fetchInvoices()
        })

        return {
            filters,
            selectedInvoice,
            activeActionMenu,
            activeQuickFilter,
            quickFilters,
            invoices: filteredInvoices,
            totalInvoiced,
            monthlyInvoices,
            pendingInvoices,
            vatSaved,
            carbonSaved,
            availableYears,
            filtersApplied,
            formatCurrency,
            formatDate,
            formatRelativeDate,
            getInvoiceTypeIcon,
            getInvoiceTypeLabel,
            resetFilters,
            applyQuickFilter,
            previewInvoice,
            downloadInvoice,
            shareInvoice,
            toggleActionMenu,
            duplicateInvoice,
            sendReminder,
            archiveInvoice,
            exportAllInvoices,
            generateTaxReport,
            contactSupport,
            LeafDecoration,
            FruitDecoration,
            ReceiptDecoration
        }
    }
}
</script>

<style scoped>
/* Animation d'entrée progressive */
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
        transform: translateY(-20px) rotate(5deg);
    }
}

@keyframes leaf-float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    33% {
        transform: translateY(-15px) rotate(-3deg);
    }

    66% {
        transform: translateY(-10px) rotate(3deg);
    }
}

.animate-float {
    animation: float 8s ease-in-out infinite;
}

.animate-leaf-float {
    animation: leaf-float 10s ease-in-out infinite;
}

.delay-2000 {
    animation-delay: 2s;
}

/* Styles pour le menu déroulant */
.menu-enter-active,
.menu-leave-active {
    transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
    opacity: 0;
    transform: translateY(-10px);
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
</style>

