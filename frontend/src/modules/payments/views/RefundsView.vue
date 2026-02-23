<template>
    <div
        class="min-h-screen bg-gradient-to-br from-soft-forest-green via-creamy-white to-earth-red-50 relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 bg-organic-pattern opacity-5"></div>

        <!-- Éléments décoratifs animés -->
        <div class="absolute top-20 left-8 w-24 h-24 opacity-10 animate-leaf-float">
            <LeafDecoration />
        </div>
        <div class="absolute bottom-32 right-12 w-28 h-28 opacity-10 animate-float">
            <FruitDecoration />
        </div>
        <div class="absolute top-1/3 left-1/4 w-20 h-20 opacity-5 animate-float delay-1000">
            <MoneyBackDecoration />
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
                            Remboursements
                        </h1>
                    </div>
                    <p class="text-earth-brown max-w-2xl">
                        Gérez vos demandes de remboursement en toute simplicité et transparence
                    </p>
                </div>

                <!-- Bouton nouvelle demande -->
                <button @click="showNewRefundModal = true"
                    class="flex items-center px-6 py-3 bg-gradient-to-r from-soft-green to-forest-green text-white rounded-xl hover:shadow-lg transition-all duration-300 ease-organic transform hover:scale-105 group">
                    <svg class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nouvelle demande
                </button>
            </div>
        </header>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-6">
            <div class="max-w-7xl mx-auto">
                <!-- Bannière de garantie -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div
                        class="bg-gradient-to-r from-soft-green/10 via-cream/50 to-soft-green/5 rounded-3xl p-6 mb-10 border border-soft-green/20 shadow-organic">
                        <div class="flex flex-col md:flex-row md:items-center gap-6">
                            <div class="flex-shrink-0">
                                <div class="w-20 h-20 rounded-full bg-soft-green/20 flex items-center justify-center">
                                    <svg class="w-10 h-10 text-soft-green" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-grow">
                                <h3 class="text-2xl font-semibold text-forest-green mb-2">Garantie Satisfaction 30 jours
                                </h3>
                                <p class="text-earth-brown">
                                    Nous nous engageons à vous rembourser intégralement si vous n'êtes pas satisfait de
                                    vos produits.
                                    Les demandes sont traitées sous 48h ouvrables.
                                </p>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="text-center">
                                    <div class="text-4xl font-bold text-forest-green">30</div>
                                    <div class="text-earth-brown">jours</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Statistiques rapides -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-100"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="mb-10">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <!-- Carte statistique 1 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Total remboursé</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ formatCurrency(totalRefunded)
                                    }}</div>
                                <div class="text-sm text-earth-brown/70">{{ totalRefunds }} remboursements</div>
                            </div>

                            <!-- Carte statistique 2 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">En attente</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ pendingRefunds }}</div>
                                <div class="text-sm text-earth-brown/70">Demandes à traiter</div>
                            </div>

                            <!-- Carte statistique 3 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Taux de succès</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ successRate }}%</div>
                                <div class="text-sm text-earth-brown/70">Demandes acceptées</div>
                            </div>

                            <!-- Carte statistique 4 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Délai moyen</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ averageDelay }}</div>
                                <div class="text-sm text-earth-brown/70">jours de traitement</div>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Filtres et Recherche -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-200"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-soft-green/20 shadow-organic">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <!-- Filtres de gauche -->
                            <div class="flex flex-wrap items-center gap-4">
                                <!-- Filtre par statut -->
                                <div class="relative">
                                    <select v-model="filters.status"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="all">Tous les statuts</option>
                                        <option value="pending">En attente</option>
                                        <option value="approved">Approuvé</option>
                                        <option value="rejected">Rejeté</option>
                                        <option value="processed">Traité</option>
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
                                        <option value="year">Cette année</option>
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

                                <!-- Filtre par type -->
                                <div class="relative">
                                    <select v-model="filters.type"
                                        class="appearance-none bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-4 pr-10 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                        <option value="all">Tous les types</option>
                                        <option value="product">Produit défectueux</option>
                                        <option value="delivery">Problème de livraison</option>
                                        <option value="quality">Qualité insuffisante</option>
                                        <option value="other">Autre</option>
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
                                <input v-model="filters.search" type="text" placeholder="Rechercher un remboursement..."
                                    class="w-full lg:w-64 bg-cream/50 border-2 border-soft-green/30 rounded-xl pl-10 pr-4 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic" />
                                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-green"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
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

                <!-- Liste des remboursements -->
                <div class="mb-12">
                    <!-- En-tête de liste (desktop) -->
                    <div
                        class="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 text-sm text-earth-brown font-medium bg-white/50 backdrop-blur-sm rounded-2xl border border-soft-green/20 mb-4">
                        <div class="col-span-3">Commande</div>
                        <div class="col-span-2">Date</div>
                        <div class="col-span-2">Montant</div>
                        <div class="col-span-2">Statut</div>
                        <div class="col-span-3 text-right">Actions</div>
                    </div>

                    <!-- Transition group pour les remboursements -->
                    <transition-group appear tag="div" class="space-y-6"
                        appear-class="opacity-0 transform translate-y-4"
                        appear-active-class="transition-all duration-500 ease-organic"
                        appear-to-class="opacity-100 transform translate-y-0">
                        <!-- Carte de remboursement -->
                        <div v-for="(refund, index) in filteredRefunds" :key="refund.id"
                            class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-2 transition-all duration-500 ease-organic hover:shadow-xl hover:border-soft-green/50 hover:scale-[1.005] group"
                            :class="[
                                refund.status === 'approved' ? 'border-green-500/20' : '',
                                refund.status === 'pending' ? 'border-yellow-500/20' : '',
                                refund.status === 'rejected' ? 'border-earth-red/20' : '',
                                refund.status === 'processed' ? 'border-blue-500/20' : ''
                            ]" :style="`animation-delay: ${index * 50}ms;`">
                            <!-- Version mobile -->
                            <div class="lg:hidden mb-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <div class="text-lg font-semibold text-forest-green">{{ refund.orderNumber }}
                                        </div>
                                        <div class="text-sm text-earth-brown mt-1">{{ formatDate(refund.requestDate) }}
                                        </div>
                                    </div>
                                    <RefundStatusBadge :status="refund.status" />
                                </div>
                                <div class="text-2xl font-bold text-forest-green mb-4">
                                    {{ formatCurrency(refund.amount) }}
                                </div>
                            </div>

                            <!-- Grille desktop/mobile -->
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                <!-- Informations commande -->
                                <div class="lg:col-span-3">
                                    <div class="hidden lg:block">
                                        <div
                                            class="font-semibold text-forest-green group-hover:text-soft-green transition-colors duration-300">
                                            {{ refund.orderNumber }}
                                        </div>
                                        <div class="text-sm text-earth-brown mt-1">{{ formatDate(refund.requestDate) }}
                                        </div>
                                    </div>
                                    <div class="lg:hidden">
                                        <div class="flex items-center space-x-3">
                                            <div :class="[
                                                'w-12 h-12 rounded-xl flex items-center justify-center',
                                                refund.type === 'product' ? 'bg-earth-red/20' : '',
                                                refund.type === 'delivery' ? 'bg-yellow-500/20' : '',
                                                refund.type === 'quality' ? 'bg-blue-500/20' : '',
                                                refund.type === 'other' ? 'bg-gray-500/20' : ''
                                            ]">
                                                <component :is="getRefundTypeIcon(refund.type)" class="w-6 h-6" :class="[
                                                    refund.type === 'product' ? 'text-earth-red' : '',
                                                    refund.type === 'delivery' ? 'text-yellow-500' : '',
                                                    refund.type === 'quality' ? 'text-blue-500' : '',
                                                    refund.type === 'other' ? 'text-gray-500' : ''
                                                ]" />
                                            </div>
                                            <div>
                                                <div class="text-sm text-earth-brown">Type</div>
                                                <div class="font-medium text-forest-green">{{
                                                    getRefundTypeLabel(refund.type) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Date (desktop) -->
                                <div class="hidden lg:block lg:col-span-2">
                                    <div class="text-forest-green">{{ formatDate(refund.requestDate) }}</div>
                                    <div class="text-sm text-earth-brown">{{ formatRelativeDate(refund.requestDate) }}
                                    </div>
                                </div>

                                <!-- Montant -->
                                <div class="lg:col-span-2">
                                    <div class="hidden lg:block text-2xl font-bold text-forest-green">
                                        {{ formatCurrency(refund.amount) }}
                                    </div>
                                    <div class="lg:hidden text-sm text-earth-brown mb-1">Montant</div>
                                    <div class="lg:hidden text-lg font-bold text-forest-green">
                                        {{ formatCurrency(refund.amount) }}
                                    </div>
                                    <div class="text-xs text-earth-brown/70">
                                        {{ refund.refundMethod === 'original' ? 'Versement original' : 'Portefeuille' }}
                                    </div>
                                </div>

                                <!-- Statut (desktop) -->
                                <div class="hidden lg:block lg:col-span-2">
                                    <RefundStatusBadge :status="refund.status" />
                                </div>

                                <!-- Actions -->
                                <div class="lg:col-span-3">
                                    <div class="flex flex-wrap items-center justify-end gap-2">
                                        <!-- Bouton détails -->
                                        <button @click="showRefundDetails(refund)"
                                            class="flex items-center px-3 py-2 bg-soft-green/10 text-soft-green rounded-lg hover:bg-soft-green/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span class="hidden sm:inline">Détails</span>
                                        </button>

                                        <!-- Bouton contester (pour rejet) -->
                                        <button v-if="refund.status === 'rejected'" @click="appealRefund(refund)"
                                            class="flex items-center px-3 py-2 bg-earth-red/10 text-earth-red rounded-lg hover:bg-earth-red/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span class="hidden sm:inline">Contester</span>
                                        </button>

                                        <!-- Bouton suivi (pour approuvé) -->
                                        <button v-if="refund.status === 'approved' || refund.status === 'processed'"
                                            @click="trackRefund(refund)"
                                            class="flex items-center px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                            <span class="hidden sm:inline">Suivre</span>
                                        </button>

                                        <!-- Bouton annuler (pour en attente) -->
                                        <button v-if="refund.status === 'pending'" @click="cancelRefund(refund)"
                                            class="flex items-center px-3 py-2 bg-gray-500/10 text-gray-500 rounded-lg hover:bg-gray-500/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span class="hidden sm:inline">Annuler</span>
                                        </button>

                                        <!-- Menu d'actions -->
                                        <div class="relative">
                                            <button @click="toggleActionMenu(refund.id)"
                                                class="flex items-center px-3 py-2 border border-soft-green/30 text-forest-green rounded-lg hover:border-soft-green transition-all duration-300 ease-organic">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                </svg>
                                            </button>

                                            <!-- Menu déroulant -->
                                            <div v-if="activeActionMenu === refund.id"
                                                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-soft-green/20 z-10">
                                                <div class="py-1">
                                                    <button @click="duplicateRefundRequest(refund)"
                                                        class="w-full text-left px-4 py-2 text-sm text-earth-brown hover:bg-soft-green/10 hover:text-forest-green transition-colors duration-200">
                                                        Dupliquer la demande
                                                    </button>
                                                    <button @click="downloadRefundDocument(refund)"
                                                        class="w-full text-left px-4 py-2 text-sm text-earth-brown hover:bg-soft-green/10 hover:text-forest-green transition-colors duration-200">
                                                        Télécharger le reçu
                                                    </button>
                                                    <button @click="contactAboutRefund(refund)"
                                                        class="w-full text-left px-4 py-2 text-sm text-earth-brown hover:bg-soft-green/10 hover:text-forest-green transition-colors duration-200">
                                                        Contacter le support
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations supplémentaires (mobile) -->
                            <div class="lg:hidden mt-6 pt-6 border-t border-soft-green/10">
                                <div class="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div class="text-sm text-earth-brown mb-1">Statut</div>
                                        <RefundStatusBadge :status="refund.status" />
                                    </div>
                                    <div>
                                        <div class="text-sm text-earth-brown mb-1">Type</div>
                                        <div class="font-medium text-forest-green">{{ getRefundTypeLabel(refund.type) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Raison -->
                                <div v-if="refund.reason" class="mb-4">
                                    <div class="text-sm text-earth-brown mb-2">Raison</div>
                                    <p class="text-sm text-earth-brown bg-cream/50 p-3 rounded-xl">
                                        {{ refund.reason }}
                                    </p>
                                </div>

                                <!-- Produits concernés -->
                                <div v-if="refund.products" class="mt-4">
                                    <div class="text-sm text-earth-brown mb-2">Produits concernés</div>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="product in refund.products.slice(0, 2)" :key="product"
                                            class="px-2 py-1 bg-cream/50 text-earth-brown rounded-lg text-xs">
                                            {{ product }}
                                        </span>
                                        <span v-if="refund.products.length > 2"
                                            class="px-2 py-1 bg-cream/50 text-earth-brown rounded-lg text-xs">
                                            +{{ refund.products.length - 2 }} autres
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Détails supplémentaires (desktop) -->
                            <div class="hidden lg:block mt-6 pt-6 border-t border-soft-green/10">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <div class="text-sm text-earth-brown mb-2">Raison</div>
                                        <p class="text-earth-brown max-w-2xl">
                                            {{ refund.reason }}
                                        </p>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm text-earth-brown mb-2">Produits concernés</div>
                                        <div class="flex flex-wrap gap-2 justify-end">
                                            <span v-for="product in refund.products" :key="product"
                                                class="px-3 py-1 bg-cream/50 text-earth-brown rounded-lg text-sm">
                                                {{ product }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- État vide -->
                        <div v-if="filteredRefunds.length === 0" key="empty-state" class="text-center py-16">
                            <div class="w-40 h-40 mx-auto mb-6 opacity-20">
                                <MoneyBackDecoration />
                            </div>
                            <h3 class="text-2xl font-semibold text-forest-green mb-3">
                                {{ filtersApplied ? 'Aucun remboursement trouvé' : 'Aucun remboursement pour le moment'
                                }}
                            </h3>
                            <p class="text-earth-brown mb-8 max-w-md mx-auto">
                                {{ filtersApplied
                                    ? 'Aucun remboursement ne correspond à vos critères de recherche.'
                                    : 'Vous n\'avez effectué aucune demande de remboursement.'
                                }}
                            </p>
                            <div class="flex flex-wrap justify-center gap-4">
                                <button v-if="filtersApplied" @click="resetFilters"
                                    class="px-6 py-3 bg-soft-green text-white rounded-xl hover:bg-forest-green transition-all duration-300 ease-organic transform hover:scale-105">
                                    Réinitialiser les filtres
                                </button>
                                <button @click="showNewRefundModal = true"
                                    class="px-6 py-3 bg-white border-2 border-soft-green text-soft-green rounded-xl hover:bg-soft-green hover:text-white transition-all duration-300 ease-organic transform hover:scale-105">
                                    Faire une demande
                                </button>
                            </div>
                        </div>
                    </transition-group>
                </div>

                <!-- Section informations et politique -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-300"
                    appear-from-class="opacity-0 transform translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <!-- Politique de remboursement -->
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
                                    <h4 class="font-semibold text-forest-green mb-2">Conditions de remboursement</h4>
                                    <ul class="space-y-2 text-sm text-earth-brown">
                                        <li class="flex items-start">
                                            <svg class="w-4 h-4 text-soft-green mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            <span>Produits périmés ou défectueux</span>
                                        </li>
                                        <li class="flex items-start">
                                            <svg class="w-4 h-4 text-soft-green mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            <span>Erreur de commande de notre part</span>
                                        </li>
                                        <li class="flex items-start">
                                            <svg class="w-4 h-4 text-soft-green mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            <span>Livraison non effectuée</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Délais de traitement -->
                        <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-soft-green/20">
                            <div class="flex items-start mb-4">
                                <div
                                    class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-forest-green mb-2">Délais de traitement</h4>
                                    <div class="space-y-3">
                                        <div>
                                            <div class="text-sm text-earth-brown">Examen de la demande</div>
                                            <div class="font-medium text-forest-green">24-48 heures</div>
                                        </div>
                                        <div>
                                            <div class="text-sm text-earth-brown">Versement du remboursement</div>
                                            <div class="font-medium text-forest-green">3-5 jours ouvrables</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Support -->
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
                                        Une question sur votre remboursement ? Notre équipe est là pour vous aider.
                                    </p>
                                    <button @click="contactSupport"
                                        class="text-soft-green font-medium hover:text-forest-green transition-colors duration-300">
                                        Contacter le support →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </main>

        <!-- Modal nouvelle demande -->
        <new-refund-modal v-if="showNewRefundModal" @close="showNewRefundModal = false" @submit="handleNewRefund" />

        <!-- Modal détails remboursement -->
        <refund-details-modal v-if="selectedRefund" :refund="selectedRefund" @close="selectedRefund = null" />

        <!-- Footer -->
        <footer class="container mx-auto px-6 py-8 mt-12 border-t border-soft-green/20">
            <div class="text-center text-earth-brown/70 text-sm">
                <p>Toutes les demandes de remboursement sont traitées dans le respect de notre politique de garantie.
                </p>
                <p class="mt-2">Consultez nos <a href="#" class="text-soft-green hover:underline">Conditions Générales
                        de Vente</a> pour plus d'informations.</p>
            </div>
        </footer>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { formatCurrency } from '../utils/currencyFormatter'
import NewRefundModal from '../components/RefundRequestForm.vue'
import RefundDetailsModal from '../components/RefundDetailsModal.vue'

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

const MoneyBackDecoration = {
    template: `
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <path d="M50,20 C70,10 85,25 80,45 C75,65 55,75 40,85 C25,75 15,60 20,40 C25,20 40,25 50,20 Z" 
            fill="currentColor" opacity="0.2"/>
      <path d="M30,50 L45,65 L70,40" 
            stroke="currentColor" stroke-width="4" opacity="0.4" fill="none"/>
    </svg>
  `
}

// Composant Badge de statut de remboursement
const RefundStatusBadge = {
    props: ['status'],
    template: `
    <span 
      :class="[
        'px-3 py-1 rounded-full text-sm font-medium inline-flex items-center',
        status === 'approved' ? 'bg-green-100 text-green-800' : '',
        status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '',
        status === 'rejected' ? 'bg-red-100 text-red-800' : '',
        status === 'processed' ? 'bg-blue-100 text-blue-800' : ''
      ]"
    >
      <span :class="[
        'w-2 h-2 rounded-full mr-2',
        status === 'approved' ? 'bg-green-500' : '',
        status === 'pending' ? 'bg-yellow-500' : '',
        status === 'rejected' ? 'bg-red-500' : '',
        status === 'processed' ? 'bg-blue-500' : ''
      ]"></span>
      {{ getStatusLabel(status) }}
    </span>
  `,
    methods: {
        getStatusLabel(status) {
            const labels = {
                'approved': 'Approuvé',
                'pending': 'En attente',
                'rejected': 'Rejeté',
                'processed': 'Traité'
            }
            return labels[status] || status
        }
    }
}

export default {
    name: 'RefundsView',
    components: {
        NewRefundModal,
        RefundDetailsModal,
        RefundStatusBadge
    },
    setup() {
        const filters = ref({
            status: 'all',
            period: 'all',
            type: 'all',
            search: ''
        })

        const showNewRefundModal = ref(false)
        const selectedRefund = ref(null)
        const activeActionMenu = ref(null)
        const activeQuickFilter = ref('pending')

        // Données de test
        const refunds = ref([
            {
                id: 1,
                orderNumber: 'CMD-2024-00123',
                requestDate: '2024-03-15',
                amount: 15750,
                type: 'product',
                status: 'approved',
                reason: 'Tomates arrivées abîmées et trop mûres',
                products: ['Tomates cerises bio', 'Avocats hass'],
                refundMethod: 'original',
                estimatedDate: '2024-03-18'
            },
            {
                id: 2,
                orderNumber: 'CMD-2024-00124',
                requestDate: '2024-03-14',
                amount: 8900,
                type: 'delivery',
                status: 'pending',
                reason: 'Livraison non effectuée dans le créneau horaire prévu',
                products: ['Salade fraîche'],
                refundMethod: 'wallet',
                estimatedDate: null
            },
            {
                id: 3,
                orderNumber: 'CMD-2024-00125',
                requestDate: '2024-03-10',
                amount: 12400,
                type: 'quality',
                status: 'rejected',
                reason: 'Les fruits ne correspondent pas à la qualité attendue',
                products: ['Mangues', 'Ananas'],
                refundMethod: 'original',
                rejectionReason: 'Les produits étaient conformes à la description'
            },
            {
                id: 4,
                orderNumber: 'CMD-2024-00126',
                requestDate: '2024-03-05',
                amount: 6500,
                type: 'other',
                status: 'processed',
                reason: 'Commande annulée avant expédition',
                products: ['Carottes', 'Céléri'],
                refundMethod: 'original',
                processedDate: '2024-03-07'
            },
            {
                id: 5,
                orderNumber: 'CMD-2024-00127',
                requestDate: '2024-02-28',
                amount: 21300,
                type: 'product',
                status: 'approved',
                reason: 'Poulet avec une odeur suspecte à la réception',
                products: ['Poulet fermier', 'Œufs bio'],
                refundMethod: 'wallet',
                estimatedDate: '2024-03-02'
            }
        ])

        const quickFilters = ref([
            { id: 'pending', label: 'En attente' },
            { id: 'approved', label: 'Approuvés' },
            { id: 'rejected', label: 'Rejetés' },
            { id: 'thisMonth', label: 'Ce mois' },
            { id: 'lastMonth', label: 'Mois dernier' },
            { id: 'highAmount', label: 'Montant élevé' }
        ])

        // Computed properties
        const filteredRefunds = computed(() => {
            let filtered = [...refunds.value]

            // Filtre par statut
            if (filters.value.status !== 'all') {
                filtered = filtered.filter(refund => refund.status === filters.value.status)
            }

            // Filtre par période
            if (filters.value.period !== 'all') {
                const now = new Date()
                filtered = filtered.filter(refund => {
                    const date = new Date(refund.requestDate)
                    switch (filters.value.period) {
                        case 'today':
                            return date.toDateString() === now.toDateString()
                        case 'week':
                            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                            return date >= weekAgo
                        case 'month':
                            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                            return date >= monthAgo
                        case 'year':
                            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
                            return date >= yearAgo
                        default:
                            return true
                    }
                })
            }

            // Filtre par type
            if (filters.value.type !== 'all') {
                filtered = filtered.filter(refund => refund.type === filters.value.type)
            }

            // Filtre par recherche
            if (filters.value.search) {
                const searchTerm = filters.value.search.toLowerCase()
                filtered = filtered.filter(refund =>
                    refund.orderNumber.toLowerCase().includes(searchTerm) ||
                    refund.reason.toLowerCase().includes(searchTerm) ||
                    refund.products.some(p => p.toLowerCase().includes(searchTerm))
                )
            }

            return filtered
        })

        const totalRefunded = computed(() => {
            return refunds.value
                .filter(r => r.status === 'processed')
                .reduce((sum, r) => sum + r.amount, 0)
        })

        const totalRefunds = computed(() => refunds.value.length)

        const pendingRefunds = computed(() => {
            return refunds.value.filter(r => r.status === 'pending').length
        })

        const successRate = computed(() => {
            const approved = refunds.value.filter(r => r.status === 'approved' || r.status === 'processed').length
            return refunds.value.length > 0 ? Math.round((approved / refunds.value.length) * 100) : 0
        })

        const averageDelay = computed(() => {
            // Calcul simplifié du délai moyen
            return '2.5'
        })

        const filtersApplied = computed(() => {
            return filters.value.status !== 'all' ||
                filters.value.period !== 'all' ||
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

        const getRefundTypeIcon = (type) => {
            const icons = {
                'product': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
          `
                },
                'delivery': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
            </svg>
          `
                },
                'quality': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          `
                },
                'other': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          `
                }
            }
            return icons[type] || icons['other']
        }

        const getRefundTypeLabel = (type) => {
            const labels = {
                'product': 'Produit défectueux',
                'delivery': 'Problème de livraison',
                'quality': 'Qualité insuffisante',
                'other': 'Autre'
            }
            return labels[type] || type
        }

        const resetFilters = () => {
            filters.value = {
                status: 'all',
                period: 'all',
                type: 'all',
                search: ''
            }
            activeQuickFilter.value = 'pending'
        }

        const applyQuickFilter = (filter) => {
            activeQuickFilter.value = filter.id

            switch (filter.id) {
                case 'pending':
                    filters.value.status = 'pending'
                    break
                case 'approved':
                    filters.value.status = 'approved'
                    break
                case 'rejected':
                    filters.value.status = 'rejected'
                    break
                case 'thisMonth':
                    filters.value.period = 'month'
                    break
                case 'highAmount':
                    // Trier par montant décroissant
                    refunds.value.sort((a, b) => b.amount - a.amount)
                    break
            }
        }

        const showRefundDetails = (refund) => {
            selectedRefund.value = refund
        }

        const appealRefund = (refund) => {
            // Logique de contestation
            console.log('Contestation du remboursement:', refund.orderNumber)
            // Ouvrir un formulaire de contestation
        }

        const trackRefund = (refund) => {
            // Logique de suivi
            console.log('Suivi du remboursement:', refund.orderNumber)
            // Afficher les détails de suivi
        }

        const cancelRefund = (refund) => {
            // Logique d'annulation
            console.log('Annulation du remboursement:', refund.orderNumber)
            // Confirmation et mise à jour du statut
        }

        const toggleActionMenu = (refundId) => {
            activeActionMenu.value = activeActionMenu.value === refundId ? null : refundId
        }

        const duplicateRefundRequest = (refund) => {
            console.log('Duplication de la demande:', refund.orderNumber)
            activeActionMenu.value = null
            // Pré-remplir le formulaire avec les mêmes données
        }

        const downloadRefundDocument = (refund) => {
            console.log('Téléchargement du reçu pour:', refund.orderNumber)
            activeActionMenu.value = null
        }

        const contactAboutRefund = (refund) => {
            console.log('Contact support pour:', refund.orderNumber)
            activeActionMenu.value = null
        }

        const handleNewRefund = (refundData) => {
            // Ajouter le nouveau remboursement à la liste
            const newId = Math.max(...refunds.value.map(r => r.id), 0) + 1
            refunds.value.unshift({
                id: newId,
                orderNumber: refundData.orderNumber,
                requestDate: new Date().toISOString().split('T')[0],
                amount: refundData.amount,
                type: refundData.type,
                status: 'pending',
                reason: refundData.reason,
                products: refundData.products,
                refundMethod: refundData.refundMethod,
                estimatedDate: null
            })

            showNewRefundModal.value = false
        }

        const contactSupport = () => {
            // Rediriger vers la page de contact
            console.log('Contact support')
        }

        onMounted(() => {
            // Charger les remboursements depuis l'API
            // fetchRefunds()
        })

        return {
            filters,
            showNewRefundModal,
            selectedRefund,
            activeActionMenu,
            activeQuickFilter,
            quickFilters,
            refunds: filteredRefunds,
            totalRefunded,
            totalRefunds,
            pendingRefunds,
            successRate,
            averageDelay,
            filtersApplied,
            formatCurrency,
            formatDate,
            formatRelativeDate,
            getRefundTypeIcon,
            getRefundTypeLabel,
            resetFilters,
            applyQuickFilter,
            showRefundDetails,
            appealRefund,
            trackRefund,
            cancelRefund,
            toggleActionMenu,
            duplicateRefundRequest,
            downloadRefundDocument,
            contactAboutRefund,
            handleNewRefund,
            contactSupport,
            LeafDecoration,
            FruitDecoration,
            MoneyBackDecoration
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

.delay-1000 {
    animation-delay: 1s;
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

/* Effet de rebond léger pour les boutons */
@keyframes gentle-bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

.hover\:gentle-bounce:hover {
    animation: gentle-bounce 0.5s ease;
}
</style>