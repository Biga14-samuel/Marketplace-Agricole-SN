<template>
    <div
        class="min-h-screen bg-gradient-to-br from-soft-forest-green via-creamy-white to-earth-red-50 relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 bg-organic-pattern opacity-5"></div>

        <!-- Éléments décoratifs animés -->
        <div class="absolute top-20 left-5 w-24 h-24 opacity-10 animate-leaf-float">
            <LeafDecoration />
        </div>
        <div class="absolute bottom-24 right-8 w-28 h-28 opacity-10 animate-float">
            <FruitDecoration />
        </div>
        <div class="absolute top-1/3 right-12 w-20 h-20 opacity-5 animate-float delay-1500">
            <PaymentCardDecoration />
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
                            Méthodes de paiement
                        </h1>
                    </div>
                    <p class="text-earth-brown max-w-2xl">
                        Gérez vos moyens de paiement pour des achats rapides et sécurisés
                    </p>
                </div>

                <!-- Bouton d'ajout -->
                <button @click="showAddMethodModal = true"
                    class="flex items-center px-6 py-3 bg-gradient-to-r from-soft-green to-forest-green text-white rounded-xl hover:shadow-lg transition-all duration-300 ease-organic transform hover:scale-105 group">
                    <svg class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter une méthode
                </button>
            </div>
        </header>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-6">
            <div class="max-w-6xl mx-auto">
                <!-- Statistiques rapides -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="mb-10">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Carte statistique 1 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Méthodes actives</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-soft-green/20 flex items-center justify-center group-hover:bg-soft-green/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ activeMethodsCount }}</div>
                                <div class="text-sm text-earth-brown/70">Dont {{ defaultMethod ? '1 par défaut' :
                                    'aucune par défaut' }}</div>
                            </div>

                            <!-- Carte statistique 2 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Utilisation ce mois</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">{{ monthlyUsage }}</div>
                                <div class="text-sm text-earth-brown/70">Transactions réussies</div>
                            </div>

                            <!-- Carte statistique 3 -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="text-earth-brown">Sécurité</div>
                                    <div
                                        class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                                        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-3xl font-bold text-forest-green mb-2">100%</div>
                                <div class="text-sm text-earth-brown/70">Transactions sécurisées</div>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Méthodes de paiement existantes -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-100"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="mb-12">
                        <div class="flex items-center space-x-3 mb-6">
                            <div class="w-3 h-3 rounded-full bg-soft-green"></div>
                            <h2 class="text-2xl font-semibold text-forest-green">
                                Vos méthodes de paiement
                            </h2>
                        </div>

                        <!-- Liste des méthodes -->
                        <div class="space-y-6">
                            <!-- État vide -->
                            <div v-if="paymentMethods.length === 0"
                                class="bg-gradient-to-br from-cream/50 to-white/30 rounded-3xl p-12 text-center border-2 border-dashed border-soft-green/30">
                                <div class="w-24 h-24 mx-auto mb-6 opacity-20">
                                    <PaymentCardDecoration />
                                </div>
                                <h3 class="text-2xl font-semibold text-forest-green mb-3">Aucune méthode enregistrée
                                </h3>
                                <p class="text-earth-brown mb-8 max-w-md mx-auto">
                                    Ajoutez une méthode de paiement pour des achats plus rapides et sécurisés
                                </p>
                                <button @click="showAddMethodModal = true"
                                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-soft-green to-forest-green text-white rounded-xl hover:shadow-lg transition-all duration-300 ease-organic transform hover:scale-105">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Ajouter ma première méthode
                                </button>
                            </div>

                            <!-- Cartes de méthode -->
                            <transition-group tag="div" class="space-y-6"
                                enter-active-class="transition-all duration-500 ease-organic"
                                enter-from-class="opacity-0 transform translate-y-8"
                                enter-to-class="opacity-100 transform translate-y-0"
                                leave-active-class="transition-all duration-300 ease-organic"
                                leave-from-class="opacity-100" leave-to-class="opacity-0">
                                <div v-for="method in paymentMethods" :key="method.id"
                                    class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-2 transition-all duration-500 ease-organic hover:shadow-xl hover:scale-[1.005] group"
                                    :class="[
                                        method.isDefault ? 'border-soft-green bg-soft-green/5' : 'border-soft-green/20 hover:border-soft-green/50',
                                        method.status === 'expired' ? 'border-earth-red/20' : ''
                                    ]">
                                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <!-- Informations de la méthode -->
                                        <div class="flex-grow">
                                            <div
                                                class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div class="flex items-start space-x-4">
                                                    <!-- Icône -->
                                                    <div :class="[
                                                        'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0',
                                                        method.type === 'mobile-money' ? 'bg-soft-green/20' : '',
                                                        method.type === 'credit-card' ? 'bg-blue-500/20' : '',
                                                        method.type === 'bank-account' ? 'bg-purple-500/20' : ''
                                                    ]">
                                                        <component :is="getMethodIcon(method.type)" class="w-8 h-8"
                                                            :class="[
                                                                method.type === 'mobile-money' ? 'text-soft-green' : '',
                                                                method.type === 'credit-card' ? 'text-blue-500' : '',
                                                                method.type === 'bank-account' ? 'text-purple-500' : ''
                                                            ]" />
                                                    </div>

                                                    <!-- Détails -->
                                                    <div>
                                                        <div class="flex items-center space-x-3 mb-2">
                                                            <h3 class="text-xl font-semibold text-forest-green">{{
                                                                method.name }}</h3>
                                                            <span v-if="method.isDefault"
                                                                class="px-3 py-1 bg-soft-green/20 text-soft-green rounded-full text-sm font-medium">
                                                                Par défaut
                                                            </span>
                                                            <span v-if="method.status === 'expired'"
                                                                class="px-3 py-1 bg-earth-red/20 text-earth-red rounded-full text-sm font-medium">
                                                                Expiré
                                                            </span>
                                                        </div>

                                                        <div class="space-y-2">
                                                            <!-- Numéro masqué -->
                                                            <div class="flex items-center text-earth-brown">
                                                                <svg class="w-5 h-5 mr-2" fill="none"
                                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2"
                                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span class="font-mono">{{ method.maskedNumber }}</span>
                                                            </div>

                                                            <!-- Expiration pour les cartes -->
                                                            <div v-if="method.expiration"
                                                                class="flex items-center text-earth-brown">
                                                                <svg class="w-5 h-5 mr-2" fill="none"
                                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2"
                                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <span>Expire le {{ method.expiration }}</span>
                                                            </div>

                                                            <!-- Opérateur pour Mobile Money -->
                                                            <div v-if="method.operator"
                                                                class="flex items-center text-earth-brown">
                                                                <svg class="w-5 h-5 mr-2" fill="none"
                                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2"
                                                                        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                                                </svg>
                                                                <span>{{ method.operator }}</span>
                                                            </div>

                                                            <!-- Statut de vérification -->
                                                            <div class="flex items-center text-earth-brown">
                                                                <svg class="w-5 h-5 mr-2 text-green-500"
                                                                    fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fill-rule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clip-rule="evenodd" />
                                                                </svg>
                                                                <span>Vérifiée • Ajoutée le {{
                                                                    formatDate(method.addedDate) }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Utilisation récente -->
                                                <div v-if="method.lastUsed" class="md:text-right">
                                                    <div class="text-sm text-earth-brown mb-1">Dernière utilisation
                                                    </div>
                                                    <div class="font-medium text-forest-green">{{
                                                        formatDate(method.lastUsed) }}</div>
                                                    <div class="text-sm text-earth-brown/70">{{
                                                        formatCurrency(method.lastAmount) }}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Actions -->
                                        <div class="flex flex-wrap gap-3 lg:flex-col lg:items-end">
                                            <!-- Bouton par défaut -->
                                            <button v-if="!method.isDefault" @click="setAsDefault(method)"
                                                class="flex items-center px-4 py-2 bg-soft-green/10 text-soft-green rounded-xl hover:bg-soft-green/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Définir par défaut
                                            </button>

                                            <!-- Bouton modifier -->
                                            <button @click="editMethod(method)"
                                                class="flex items-center px-4 py-2 bg-forest-green/10 text-forest-green rounded-xl hover:bg-forest-green/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Modifier
                                            </button>

                                            <!-- Bouton supprimer -->
                                            <button @click="confirmDelete(method)"
                                                class="flex items-center px-4 py-2 bg-earth-red/10 text-earth-red rounded-xl hover:bg-earth-red/20 transition-all duration-300 ease-organic transform hover:scale-105">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </transition-group>
                        </div>
                    </div>
                </transition>

                <!-- Section Méthodes disponibles -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-200"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="mb-12">
                        <div class="flex items-center space-x-3 mb-6">
                            <div class="w-3 h-3 rounded-full bg-earth-red"></div>
                            <h2 class="text-2xl font-semibold text-forest-green">
                                Méthodes disponibles
                            </h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Carte Mobile Money -->
                            <div
                                class="bg-gradient-to-br from-soft-green/10 to-cream/50 rounded-3xl p-6 border border-soft-green/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-6">
                                    <div
                                        class="w-14 h-14 rounded-2xl bg-soft-green/20 flex items-center justify-center group-hover:bg-soft-green/30 transition-colors duration-300">
                                        <svg class="w-8 h-8 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 6h-1V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v1H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-1h4v1h-4V5zm8 14H7V8h10v11zm-5-9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </div>
                                    <span
                                        class="px-3 py-1 bg-soft-green/20 text-soft-green rounded-full text-sm font-medium">
                                        Populaire
                                    </span>
                                </div>
                                <h3 class="text-xl font-semibold text-forest-green mb-3">Mobile Money</h3>
                                <p class="text-earth-brown mb-6">
                                    Payez instantanément avec MTN Mobile Money ou Orange Money. Aucun frais
                                    supplémentaire.
                                </p>
                                <div class="flex items-center text-sm text-earth-brown/70 mb-6">
                                    <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Transaction instantanée</span>
                                </div>
                                <button @click="addMobileMoneyMethod"
                                    class="w-full py-3 bg-white border-2 border-soft-green text-soft-green rounded-xl hover:bg-soft-green hover:text-white transition-all duration-300 ease-organic transform hover:scale-105">
                                    Ajouter Mobile Money
                                </button>
                            </div>

                            <!-- Carte Carte bancaire -->
                            <div
                                class="bg-gradient-to-br from-blue-500/10 to-cream/50 rounded-3xl p-6 border border-blue-500/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-6">
                                    <div
                                        class="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                                        <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <span
                                        class="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm font-medium">
                                        Sécurisé
                                    </span>
                                </div>
                                <h3 class="text-xl font-semibold text-forest-green mb-3">Carte bancaire</h3>
                                <p class="text-earth-brown mb-6">
                                    Utilisez votre carte Visa ou Mastercard. Cryptage SSL et protection contre la
                                    fraude.
                                </p>
                                <div class="flex items-center text-sm text-earth-brown/70 mb-6">
                                    <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Protection 3D Secure</span>
                                </div>
                                <button @click="addCreditCardMethod"
                                    class="w-full py-3 bg-white border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 ease-organic transform hover:scale-105">
                                    Ajouter une carte
                                </button>
                            </div>

                            <!-- Carte Compte bancaire -->
                            <div
                                class="bg-gradient-to-br from-purple-500/10 to-cream/50 rounded-3xl p-6 border border-purple-500/20 shadow-organic hover:shadow-lg transition-all duration-500 ease-organic hover:scale-[1.02] group">
                                <div class="flex items-center justify-between mb-6">
                                    <div
                                        class="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                                        <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                    </div>
                                    <span
                                        class="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm font-medium">
                                        Pour entreprises
                                    </span>
                                </div>
                                <h3 class="text-xl font-semibold text-forest-green mb-3">Compte bancaire</h3>
                                <p class="text-earth-brown mb-6">
                                    Liez votre compte bancaire pour les remboursements et les paiements récurrents.
                                </p>
                                <div class="flex items-center text-sm text-earth-brown/70 mb-6">
                                    <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Virements SEPA</span>
                                </div>
                                <button @click="addBankAccountMethod"
                                    class="w-full py-3 bg-white border-2 border-purple-500 text-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-300 ease-organic transform hover:scale-105">
                                    Ajouter un compte
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Section Sécurité -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic delay-300"
                    appear-from-class="opacity-0 transform translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div
                        class="bg-gradient-to-br from-forest-green/10 via-white/80 to-cream/50 backdrop-blur-sm rounded-3xl p-8 border border-soft-green/30">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            <div>
                                <h3 class="text-2xl font-semibold text-forest-green mb-4">
                                    <svg class="w-8 h-8 inline-block mr-3 text-soft-green" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Vos données sont sécurisées
                                </h3>
                                <p class="text-earth-brown max-w-2xl">
                                    Toutes vos méthodes de paiement sont cryptées et protégées selon les normes les plus
                                    strictes.
                                    Nous ne stockons jamais vos informations sensibles.
                                </p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-forest-green">256-bit</div>
                                    <div class="text-sm text-earth-brown">SSL</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-forest-green">PCI DSS</div>
                                    <div class="text-sm text-earth-brown">Niveau 1</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-forest-green">3D</div>
                                    <div class="text-sm text-earth-brown">Secure</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </main>

        <!-- Modal d'ajout de méthode -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-all duration-300 ease-organic"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showAddMethodModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div
                    class="bg-white rounded-3xl p-8 max-w-2xl w-full transform transition-all duration-500 ease-organic scale-100 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-forest-green">Ajouter une méthode de paiement</h3>
                        <button @click="showAddMethodModal = false" class="text-earth-brown/50 hover:text-earth-brown">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Sélection du type -->
                    <div class="mb-8">
                        <div class="text-earth-brown font-medium mb-4">Sélectionnez le type de paiement</div>
                        <div class="grid grid-cols-3 gap-4">
                            <button @click="selectMethodType('mobile-money')" :class="[
                                'p-4 rounded-2xl border-2 transition-all duration-300 ease-organic',
                                selectedMethodType === 'mobile-money'
                                    ? 'border-soft-green bg-soft-green/10'
                                    : 'border-soft-green/20 hover:border-soft-green/50'
                            ]">
                                <div class="flex flex-col items-center space-y-3">
                                    <div
                                        class="w-12 h-12 rounded-full bg-soft-green/20 flex items-center justify-center">
                                        <svg class="w-6 h-6 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 6h-1V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v1H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-1h4v1h-4V5zm8 14H7V8h10v11zm-5-9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <div class="font-semibold text-forest-green">Mobile Money</div>
                                    </div>
                                </div>
                            </button>

                            <button @click="selectMethodType('credit-card')" :class="[
                                'p-4 rounded-2xl border-2 transition-all duration-300 ease-organic',
                                selectedMethodType === 'credit-card'
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-blue-500/20 hover:border-blue-500/50'
                            ]">
                                <div class="flex flex-col items-center space-y-3">
                                    <div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <div class="font-semibold text-forest-green">Carte bancaire</div>
                                    </div>
                                </div>
                            </button>

                            <button @click="selectMethodType('bank-account')" :class="[
                                'p-4 rounded-2xl border-2 transition-all duration-300 ease-organic',
                                selectedMethodType === 'bank-account'
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-purple-500/20 hover:border-purple-500/50'
                            ]">
                                <div class="flex flex-col items-center space-y-3">
                                    <div
                                        class="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <div class="font-semibold text-forest-green">Compte bancaire</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Formulaire dynamique -->
                    <transition mode="out-in" enter-active-class="transition-all duration-500 ease-organic"
                        enter-from-class="opacity-0 transform translate-y-4"
                        enter-to-class="opacity-100 transform translate-y-0"
                        leave-active-class="transition-all duration-300 ease-organic" leave-from-class="opacity-100"
                        leave-to-class="opacity-0">
                        <div :key="selectedMethodType" class="mb-8">
                            <!-- Formulaire Mobile Money -->
                            <div v-if="selectedMethodType === 'mobile-money'" class="space-y-6">
                                <div class="grid grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-earth-brown font-medium mb-2">Opérateur</label>
                                        <select v-model="newMethod.operator"
                                            class="w-full bg-cream/50 border-2 border-soft-green/30 rounded-xl px-4 py-3 text-forest-green focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic">
                                            <option value="">Sélectionnez un opérateur</option>
                                            <option value="MTN">MTN Mobile Money</option>
                                            <option value="Orange">Orange Money</option>
                                            <option value="Express Union">Express Union Mobile Money</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-earth-brown font-medium mb-2">Numéro de
                                            téléphone</label>
                                        <div class="relative">
                                            <div
                                                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-forest-green font-medium">
                                                +237</div>
                                            <input v-model="newMethod.phoneNumber" type="tel"
                                                class="w-full pl-16 pr-4 py-3 text-forest-green bg-cream/50 border-2 border-soft-green/30 rounded-xl focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic"
                                                placeholder="6 XX XX XX XX" />
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl">
                                    <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-sm text-yellow-800">
                                        Vous recevrez un code de confirmation par SMS pour vérifier votre numéro.
                                    </p>
                                </div>
                            </div>

                            <!-- Formulaire Carte bancaire -->
                            <div v-else-if="selectedMethodType === 'credit-card'" class="space-y-6">
                                <div>
                                    <label class="block text-earth-brown font-medium mb-2">Numéro de carte</label>
                                    <input v-model="newMethod.cardNumber" type="text"
                                        class="w-full bg-cream/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ease-organic"
                                        placeholder="4242 4242 4242 4242" />
                                </div>

                                <div class="grid grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-earth-brown font-medium mb-2">Date d'expiration</label>
                                        <input v-model="newMethod.expiration" type="text"
                                            class="w-full bg-cream/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ease-organic"
                                            placeholder="MM/AA" />
                                    </div>
                                    <div>
                                        <label class="block text-earth-brown font-medium mb-2">Cryptogramme
                                            (CVV)</label>
                                        <input v-model="newMethod.cvv" type="text"
                                            class="w-full bg-cream/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ease-organic"
                                            placeholder="123" maxlength="3" />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-earth-brown font-medium mb-2">Nom sur la carte</label>
                                    <input v-model="newMethod.cardHolder" type="text"
                                        class="w-full bg-cream/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ease-organic"
                                        placeholder="JOHN DOE" />
                                </div>

                                <div class="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                                    <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <p class="text-sm text-green-800">
                                        Vos données sont cryptées et sécurisées. Nous ne stockons jamais votre CVV.
                                    </p>
                                </div>
                            </div>

                            <!-- Formulaire Compte bancaire -->
                            <div v-else-if="selectedMethodType === 'bank-account'" class="space-y-6">
                                <div>
                                    <label class="block text-earth-brown font-medium mb-2">Nom de la banque</label>
                                    <select v-model="newMethod.bankName"
                                        class="w-full bg-cream/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ease-organic">
                                        <option value="">Sélectionnez une banque</option>
                                        <option value="Afriland First Bank">Afriland First Bank</option>
                                        <option value="Société Générale">Société Générale Cameroun</option>
                                        <option value="BICEC">BICEC</option>
                                        <option value="Standard Chartered">Standard Chartered</option>
                                        <option value="ECOBANK">ECOBANK</option>
                                    </select>
                                </div>

                                <div class="grid grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-earth-brown font-medium mb-2">Numéro de compte</label>
                                        <input v-model="newMethod.accountNumber" type="text"
                                            class="w-full bg-cream/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ease-organic"
                                            placeholder="XX123456789" />
                                    </div>
                                    <div>
                                        <label class="block text-earth-brown font-medium mb-2">Code banque</label>
                                        <input v-model="newMethod.bankCode" type="text"
                                            class="w-full bg-cream/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ease-organic"
                                            placeholder="10002" />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-earth-brown font-medium mb-2">Nom du titulaire</label>
                                    <input v-model="newMethod.accountHolder" type="text"
                                        class="w-full bg-cream/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-forest-green focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ease-organic"
                                        placeholder="Nom tel qu'il apparaît sur le compte" />
                                </div>

                                <div class="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                                    <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-sm text-blue-800">
                                        Ce compte sera utilisé uniquement pour les remboursements et les paiements
                                        récurrents.
                                    </p>
                                </div>
                            </div>

                            <!-- Aucun type sélectionné -->
                            <div v-else class="text-center py-12">
                                <div class="w-24 h-24 mx-auto mb-6 opacity-20">
                                    <PaymentCardDecoration />
                                </div>
                                <h4 class="text-xl font-semibold text-forest-green mb-3">Sélectionnez un type de
                                    paiement</h4>
                                <p class="text-earth-brown">
                                    Choisissez une méthode de paiement ci-dessus pour continuer
                                </p>
                            </div>
                        </div>
                    </transition>

                    <!-- Boutons d'action -->
                    <div class="flex justify-end space-x-4">
                        <button @click="showAddMethodModal = false"
                            class="px-6 py-3 border-2 border-soft-green/30 text-forest-green rounded-xl hover:border-soft-green transition-all duration-300 ease-organic">
                            Annuler
                        </button>
                        <button @click="addNewMethod" :disabled="!isFormValid" :class="[
                            'px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-organic transform hover:scale-105',
                            isFormValid
                                ? 'bg-gradient-to-r from-soft-green to-forest-green text-white hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        ]">
                            Ajouter la méthode
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal de confirmation de suppression -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-all duration-300 ease-organic"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="methodToDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div
                    class="bg-white rounded-3xl p-8 max-w-md w-full transform transition-all duration-500 ease-organic scale-100">
                    <div class="text-center">
                        <div
                            class="w-20 h-20 rounded-full bg-earth-red/20 flex items-center justify-center mx-auto mb-6">
                            <svg class="w-10 h-10 text-earth-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-forest-green mb-2">Supprimer cette méthode ?</h3>
                        <p class="text-earth-brown mb-6">
                            Êtes-vous sûr de vouloir supprimer {{ methodToDelete.name }} ?
                            Cette action est irréversible.
                        </p>
                        <div class="flex space-x-4">
                            <button @click="methodToDelete = null"
                                class="flex-1 py-3 px-6 border-2 border-soft-green/30 text-forest-green rounded-xl hover:border-soft-green transition-all duration-300 ease-organic">
                                Annuler
                            </button>
                            <button @click="deleteMethod"
                                class="flex-1 py-3 px-6 bg-earth-red text-white rounded-xl hover:bg-red-700 transition-all duration-300 ease-organic">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Footer -->
        <footer class="container mx-auto px-6 py-8 mt-12 border-t border-soft-green/20">
            <div class="text-center text-earth-brown/70 text-sm">
                <p>Vos méthodes de paiement sont sécurisées avec cryptage 256-bit SSL.</p>
                <p class="mt-2">Pour toute question, consultez notre <a href="#"
                        class="text-soft-green hover:underline">centre d'aide</a>.</p>
            </div>
        </footer>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { formatCurrency } from '../utils/currencyFormatter'
import paymentMethodService from '../services/paymentMethodService'

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

const PaymentCardDecoration = {
    template: `
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <rect x="20" y="20" width="60" height="40" rx="8" fill="currentColor" opacity="0.2"/>
      <rect x="25" y="30" width="50" height="8" rx="4" fill="currentColor" opacity="0.4"/>
      <rect x="25" y="45" width="30" height="5" rx="2.5" fill="currentColor" opacity="0.4"/>
      <rect x="60" y="45" width="15" height="5" rx="2.5" fill="currentColor" opacity="0.4"/>
    </svg>
  `
}

export default {
    name: 'PaymentMethodsView',
    setup() {
        const showAddMethodModal = ref(false)
        const selectedMethodType = ref('')
        const methodToDelete = ref(null)

        const paymentMethods = ref([])

        // Nouvelle méthode
        const newMethod = ref({
            operator: '',
            phoneNumber: '',
            cardNumber: '',
            expiration: '',
            cvv: '',
            cardHolder: '',
            bankName: '',
            accountNumber: '',
            bankCode: '',
            accountHolder: '',
            isDefault: false
        })

        // Computed properties
        const activeMethodsCount = computed(() => {
            return paymentMethods.value.filter(method => method.status === 'active').length
        })

        const defaultMethod = computed(() => {
            return paymentMethods.value.find(method => method.isDefault)
        })

        const monthlyUsage = computed(() => {
            // Simuler le nombre d'utilisations ce mois-ci
            return paymentMethods.value.reduce((total, method) => {
                const lastUsed = new Date(method.lastUsed)
                const now = new Date()
                const isThisMonth = lastUsed.getMonth() === now.getMonth() &&
                    lastUsed.getFullYear() === now.getFullYear()
                return isThisMonth ? total + 1 : total
            }, 0)
        })

        const isFormValid = computed(() => {
            if (!selectedMethodType.value) return false

            switch (selectedMethodType.value) {
                case 'mobile-money':
                    return newMethod.value.operator && newMethod.value.phoneNumber
                case 'credit-card':
                    return newMethod.value.cardNumber && newMethod.value.expiration &&
                        newMethod.value.cvv && newMethod.value.cardHolder
                case 'bank-account':
                    return newMethod.value.bankName && newMethod.value.accountNumber &&
                        newMethod.value.bankCode && newMethod.value.accountHolder
                default:
                    return false
            }
        })

        // Methods
        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-CM', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        }

        const getMethodIcon = (type) => {
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
                'bank-account': {
                    template: `
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
          `
                }
            }
            return icons[type] || icons['mobile-money']
        }

        const selectMethodType = (type) => {
            selectedMethodType.value = type
            // Réinitialiser le formulaire
            newMethod.value = {
                operator: '',
                phoneNumber: '',
                cardNumber: '',
                expiration: '',
                cvv: '',
                cardHolder: '',
                bankName: '',
                accountNumber: '',
                bankCode: '',
                accountHolder: '',
                isDefault: false
            }
        }

        const addMobileMoneyMethod = () => {
            selectedMethodType.value = 'mobile-money'
            showAddMethodModal.value = true
        }

        const addCreditCardMethod = () => {
            selectedMethodType.value = 'credit-card'
            showAddMethodModal.value = true
        }

        const addBankAccountMethod = () => {
            selectedMethodType.value = 'bank-account'
            showAddMethodModal.value = true
        }

        const mapServiceMethod = (method) => {
            const details = method?.details || {}
            const normalizedType = String(method?.type || '').toLowerCase()
            let type = 'mobile-money'
            if (normalizedType.includes('card') || normalizedType.includes('credit')) type = 'credit-card'
            if (normalizedType.includes('bank') || normalizedType.includes('transfer')) type = 'bank-account'

            const phoneNumber = details?.phoneNumber || details?.phone || ''
            const cardLast4 = details?.last4 || details?.cardLast4 || ''
            const accountNumber = details?.accountNumber || ''
            const maskedNumber = phoneNumber
                ? `${String(phoneNumber).slice(0, 3)} •••• ${String(phoneNumber).slice(-4)}`
                : cardLast4
                    ? `•••• ${cardLast4}`
                    : accountNumber
                        ? `•••${String(accountNumber).slice(-3)}`
                        : 'Non renseigné'

            const expiryMonth = details?.expiryMonth
            const expiryYear = details?.expiryYear
            const expiration = expiryMonth && expiryYear
                ? `${String(expiryMonth).padStart(2, '0')}/${String(expiryYear).slice(-2)}`
                : undefined

            return {
                id: method?.id,
                name: method?.name || 'Méthode de paiement',
                type,
                maskedNumber,
                operator: details?.provider || method?.provider || '',
                expiration,
                isDefault: Boolean(method?.isDefault),
                status: method?.status === 'active' || method?.isActive ? 'active' : 'expired',
                addedDate: method?.createdAt || new Date().toISOString(),
                lastUsed: method?.lastUsedAt || null,
                lastAmount: 0
            }
        }

        const loadPaymentMethods = async () => {
            try {
                const methods = await paymentMethodService.getPaymentMethods()
                paymentMethods.value = Array.isArray(methods) ? methods.map(mapServiceMethod) : []
            } catch (error) {
                console.error('Erreur chargement des méthodes de paiement:', error)
                paymentMethods.value = []
            }
        }

        const addNewMethod = async () => {
            if (!isFormValid.value) return
            try {
                if (selectedMethodType.value === 'mobile-money') {
                    await paymentMethodService.addMobileMoneyAccount({
                        provider: newMethod.value.operator,
                        phoneNumber: newMethod.value.phoneNumber,
                        accountName: newMethod.value.accountHolder || '',
                        isDefault: newMethod.value.isDefault
                    })
                } else if (selectedMethodType.value === 'credit-card') {
                    const [month, year] = String(newMethod.value.expiration || '').split('/')
                    await paymentMethodService.addCard({
                        cardNumber: newMethod.value.cardNumber.replace(/\s/g, ''),
                        cardHolder: newMethod.value.cardHolder,
                        expiryMonth: Number(month || 0),
                        expiryYear: Number(`20${year || '0'}`),
                        cvv: newMethod.value.cvv,
                        isDefault: newMethod.value.isDefault
                    })
                } else if (selectedMethodType.value === 'bank-account') {
                    await paymentMethodService.addBankAccount({
                        bankName: newMethod.value.bankName,
                        accountNumber: newMethod.value.accountNumber,
                        accountHolder: newMethod.value.accountHolder,
                        bankCode: newMethod.value.bankCode,
                        isDefault: newMethod.value.isDefault
                    })
                }

                await loadPaymentMethods()
                showAddMethodModal.value = false
                selectedMethodType.value = ''

                newMethod.value = {
                    operator: '',
                    phoneNumber: '',
                    cardNumber: '',
                    expiration: '',
                    cvv: '',
                    cardHolder: '',
                    bankName: '',
                    accountNumber: '',
                    bankCode: '',
                    accountHolder: '',
                    isDefault: false
                }
            } catch (error) {
                console.error('Erreur ajout méthode de paiement:', error)
            }
        }

        const setAsDefault = async (method) => {
            try {
                await paymentMethodService.setDefaultPaymentMethod(String(method.id))
                await loadPaymentMethods()
            } catch (error) {
                console.error('Erreur définition méthode par défaut:', error)
            }
        }

        const editMethod = (method) => {
            // Logique d'édition (pourrait ouvrir un modal similaire à l'ajout)
            console.log('Édition de la méthode:', method.id)
            // Dans une version complète, on ouvrirait un modal d'édition
        }

        const confirmDelete = (method) => {
            methodToDelete.value = method
        }

        const deleteMethod = async () => {
            if (!methodToDelete.value) return
            try {
                await paymentMethodService.removePaymentMethod(String(methodToDelete.value.id))
                methodToDelete.value = null
                await loadPaymentMethods()
            } catch (error) {
                console.error('Erreur suppression méthode de paiement:', error)
            }
        }

        onMounted(async () => {
            await loadPaymentMethods()
        })

        return {
            showAddMethodModal,
            selectedMethodType,
            methodToDelete,
            paymentMethods,
            newMethod,
            activeMethodsCount,
            defaultMethod,
            monthlyUsage,
            isFormValid,
            formatCurrency,
            formatDate,
            getMethodIcon,
            selectMethodType,
            addMobileMoneyMethod,
            addCreditCardMethod,
            addBankAccountMethod,
            addNewMethod,
            setAsDefault,
            editMethod,
            confirmDelete,
            deleteMethod,
            LeafDecoration,
            FruitDecoration,
            PaymentCardDecoration
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

.delay-1500 {
    animation-delay: 1.5s;
}

/* Styles pour le scroll dans les modaux */
.modal-content {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 168, 107, 0.3) transparent;
}

.modal-content::-webkit-scrollbar {
    width: 6px;
}

.modal-content::-webkit-scrollbar-track {
    background: rgba(0, 168, 107, 0.1);
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
    background: rgba(0, 168, 107, 0.3);
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
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

/* Animation de rotation pour les icônes */
.rotate-90 {
    transform: rotate(90deg);
}
</style>
