<template>
    <div
        class="min-h-screen bg-gradient-to-br from-soft-forest-green via-creamy-white to-earth-red-50 relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 bg-organic-pattern opacity-5"></div>

        <!-- Éléments décoratifs animés subtils -->
        <div class="absolute top-20 left-10 w-16 h-16 opacity-10 animate-leaf-float">
            <LeafDecoration />
        </div>
        <div class="absolute bottom-32 right-12 w-20 h-20 opacity-10 animate-float">
            <FruitDecoration />
        </div>

        <!-- Navigation -->
        <header class="container mx-auto px-6 pt-8">
            <div class="flex justify-between items-center">
                <router-link to="/" class="flex items-center group transition-all duration-500 ease-organic">
                    <div
                        class="w-10 h-10 rounded-full bg-soft-green/20 flex items-center justify-center mr-3 group-hover:bg-soft-green/30 transition-colors duration-300">
                        <svg class="w-5 h-5 text-soft-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <span
                        class="text-forest-green font-semibold group-hover:text-soft-green transition-colors duration-300">
                        Marché Frais
                    </span>
                </router-link>

                <div class="flex items-center space-x-4">
                    <button @click="showHelpModal = true"
                        class="flex items-center text-earth-brown hover:text-forest-green transition-all duration-300 ease-organic group">
                        <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Aide
                    </button>
                    <div
                        class="w-8 h-8 rounded-full bg-soft-green/20 flex items-center justify-center text-soft-green font-bold">
                        {{ userInitials }}
                    </div>
                </div>
            </div>
        </header>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-8">
            <div class="max-w-6xl mx-auto">
                <!-- En-tête avec animations -->
                <transition appear appear-active-class="transition-all duration-800 ease-organic"
                    appear-from-class="opacity-0 transform -translate-y-4"
                    appear-to-class="opacity-100 transform translate-y-0">
                    <div class="text-center mb-12">
                        <h1 class="text-5xl font-serif font-bold text-forest-green mb-4">
                            Finalisez votre commande
                        </h1>
                        <p class="text-earth-brown text-xl max-w-3xl mx-auto">
                            Un dernier pas avant de recevoir vos produits frais directement de nos producteurs locaux
                        </p>
                    </div>
                </transition>

                <div class="grid lg:grid-cols-3 gap-8">
                    <!-- Colonne de gauche : Détails de la commande -->
                    <transition appear appear-active-class="transition-all duration-800 ease-organic delay-100"
                        appear-from-class="opacity-0 transform -translate-x-8"
                        appear-to-class="opacity-100 transform translate-x-0">
                        <div class="lg:col-span-2 space-y-8">
                            <!-- Section Détails de la commande -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-organic border border-soft-green/20">
                                <div class="flex items-center space-x-3 mb-8">
                                    <div class="w-3 h-3 rounded-full bg-soft-green"></div>
                                    <h2 class="text-2xl font-semibold text-forest-green">
                                        Votre panier
                                    </h2>
                                    <span class="bg-cream text-earth-brown px-3 py-1 rounded-full text-sm font-medium">
                                        {{ cartItems.length }} article{{ cartItems.length > 1 ? 's' : '' }}
                                    </span>
                                </div>

                                <!-- Liste des articles -->
                                <div class="space-y-6">
                                    <div v-for="(item, index) in cartItems" :key="item.id"
                                        class="flex items-center p-4 rounded-2xl bg-cream/50 border border-soft-green/10 hover:border-soft-green/30 transition-all duration-500 ease-organic hover:scale-[1.02]"
                                        :class="{ 'animate-fade-in-up': true }"
                                        :style="`animation-delay: ${index * 100}ms;`">
                                        <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <img :src="item.image" :alt="item.name"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div class="ml-6 flex-grow">
                                            <h3 class="font-semibold text-forest-green mb-1">{{ item.name }}</h3>
                                            <p class="text-sm text-earth-brown/70 mb-2">{{ item.producer }}</p>
                                            <div class="flex items-center">
                                                <span
                                                    class="bg-soft-green/10 text-soft-green text-xs px-2 py-1 rounded mr-2">
                                                    {{ item.origin }}
                                                </span>
                                                <span class="text-xs text-earth-brown">
                                                    {{ item.quantity }} × {{ formatCurrency(item.unitPrice) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-forest-green mb-1">
                                                {{ formatCurrency(item.totalPrice) }}
                                            </div>
                                            <button @click="removeItem(item.id)"
                                                class="text-earth-brown/50 hover:text-earth-red transition-colors duration-300">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Zone de livraison -->
                                <div class="mt-8 pt-8 border-t border-soft-green/10">
                                    <div class="flex items-center space-x-3 mb-6">
                                        <div class="w-3 h-3 rounded-full bg-earth-red"></div>
                                        <h3 class="text-xl font-semibold text-forest-green">
                                            Livraison
                                        </h3>
                                    </div>

                                    <div
                                        class="bg-gradient-to-r from-cream/50 to-white/30 rounded-2xl p-6 border border-soft-green/20">
                                        <div class="flex items-center justify-between mb-4">
                                            <div>
                                                <p class="font-medium text-forest-green">{{ delivery.address }}</p>
                                                <p class="text-sm text-earth-brown">{{ delivery.city }}, {{
                                                    delivery.region }}</p>
                                            </div>
                                            <button @click="showAddressModal = true"
                                                class="text-soft-green hover:text-forest-green font-medium transition-colors duration-300 ease-organic">
                                                Modifier
                                            </button>
                                        </div>

                                        <div class="flex items-center space-x-4">
                                            <div class="flex items-center text-earth-brown">
                                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{{ delivery.timeSlot }}</span>
                                            </div>
                                            <div class="flex items-center text-earth-brown">
                                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{{ delivery.type }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section Méthode de paiement -->
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-organic border border-soft-green/20">
                                <div class="flex items-center space-x-3 mb-8">
                                    <div class="w-3 h-3 rounded-full bg-earth-red"></div>
                                    <h2 class="text-2xl font-semibold text-forest-green">
                                        Méthode de paiement
                                    </h2>
                                </div>

                                <!-- Liste des méthodes de paiement -->
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    <button v-for="method in paymentMethods" :key="method.id"
                                        @click="selectPaymentMethod(method.id)" :class="[
                                            'p-4 rounded-2xl border-2 transition-all duration-500 ease-organic hover:scale-105',
                                            selectedPaymentMethod === method.id
                                                ? 'border-soft-green bg-soft-green/10 shadow-md'
                                                : 'border-soft-green/20 hover:border-soft-green/50'
                                        ]">
                                        <div class="flex flex-col items-center space-y-3">
                                            <div
                                                :class="['w-14 h-14 rounded-full flex items-center justify-center', method.bgColor]">
                                                <component :is="method.icon" class="w-7 h-7 text-white" />
                                            </div>
                                            <div class="text-center">
                                                <div class="font-semibold text-forest-green text-sm">{{ method.name }}
                                                </div>
                                                <div v-if="method.fee" class="text-xs text-earth-brown">
                                                    Frais : {{ method.fee }}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                <!-- Formulaire de paiement dynamique -->
                                <transition mode="out-in" enter-active-class="transition-all duration-500 ease-organic"
                                    enter-from-class="opacity-0 transform translate-y-4"
                                    enter-to-class="opacity-100 transform translate-y-0"
                                    leave-active-class="transition-all duration-300 ease-organic"
                                    leave-from-class="opacity-100" leave-to-class="opacity-0">
                                    <div :key="selectedPaymentMethod" class="mt-8">
                                        <MobileMoneyPayment v-if="selectedPaymentMethod === 'mobile-money'"
                                            :amount="totalAmount" @payment-completed="handlePaymentCompleted" />
                                        <PaymentForm v-else-if="selectedPaymentMethod === 'credit-card'"
                                            :amount="totalAmount" @payment-completed="handlePaymentCompleted" />
                                        <!-- Ajouter d'autres méthodes ici -->
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </transition>

                    <!-- Colonne de droite : Récapitulatif -->
                    <transition appear appear-active-class="transition-all duration-800 ease-organic delay-300"
                        appear-from-class="opacity-0 transform translate-x-8"
                        appear-to-class="opacity-100 transform translate-x-0">
                        <div class="space-y-8">
                            <!-- Carte récapitulative -->
                            <div
                                class="bg-gradient-to-br from-forest-green/10 via-white/80 to-cream/50 backdrop-blur-sm rounded-3xl p-8 border border-soft-green/30 shadow-organic sticky top-8">
                                <h3 class="text-2xl font-serif font-bold text-forest-green mb-8">
                                    Récapitulatif
                                </h3>

                                <!-- Détails des prix -->
                                <div class="space-y-4 mb-8">
                                    <div class="flex justify-between text-earth-brown">
                                        <span>Sous-total</span>
                                        <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
                                    </div>
                                    <div class="flex justify-between text-earth-brown">
                                        <span>Livraison</span>
                                        <span class="font-medium">{{ formatCurrency(delivery.fee) }}</span>
                                    </div>
                                    <div v-if="selectedPaymentMethod === 'credit-card'"
                                        class="flex justify-between text-earth-brown">
                                        <span>Frais de transaction</span>
                                        <span class="font-medium">{{ formatCurrency(transactionFee) }}</span>
                                    </div>
                                    <div class="border-t border-soft-green/20 pt-4">
                                        <div class="flex justify-between text-lg font-bold text-forest-green">
                                            <span>Total</span>
                                            <span>{{ formatCurrency(totalAmount) }}</span>
                                        </div>
                                        <p class="text-sm text-earth-brown/70 mt-2">TVA incluse</p>
                                    </div>
                                </div>

                                <!-- Info-bulle promo -->
                                <div
                                    class="bg-gradient-to-r from-soft-green/10 to-cream/30 rounded-2xl p-4 mb-8 border border-soft-green/20">
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 text-soft-green mr-2 mt-0.5 flex-shrink-0" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p class="font-medium text-forest-green mb-1">Code promo disponible</p>
                                            <div class="flex space-x-2">
                                                <input v-model="promoCode" type="text" placeholder="Entrez votre code"
                                                    class="flex-grow px-3 py-2 text-sm border border-soft-green/30 rounded-xl focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic" />
                                                <button @click="applyPromoCode"
                                                    class="px-4 py-2 bg-soft-green text-white text-sm font-medium rounded-xl hover:bg-forest-green transition-all duration-300 ease-organic transform hover:scale-105">
                                                    Appliquer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Protection des acheteurs -->
                                <div class="border-t border-soft-green/20 pt-8">
                                    <div class="flex items-center space-x-3 mb-4">
                                        <svg class="w-6 h-6 text-soft-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <h4 class="font-semibold text-forest-green">Paiement sécurisé</h4>
                                    </div>
                                    <ul class="space-y-2 text-sm text-earth-brown">
                                        <li class="flex items-center">
                                            <svg class="w-4 h-4 text-soft-green mr-2" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            Données cryptées SSL
                                        </li>
                                        <li class="flex items-center">
                                            <svg class="w-4 h-4 text-soft-green mr-2" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            Protection contre la fraude
                                        </li>
                                        <li class="flex items-center">
                                            <svg class="w-4 h-4 text-soft-green mr-2" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd"></path>
                                            </svg>
                                            Remboursement sous 30 jours
                                        </li>
                                    </ul>
                                </div>

                                <!-- Producteurs concernés -->
                                <div class="mt-8">
                                    <p class="text-sm text-earth-brown mb-4">
                                        Votre achat soutient directement {{ producersCount }} producteur{{
                                        producersCount > 1 ? 's' : '' }} local{{ producersCount > 1 ? 's' : '' }}
                                    </p>
                                    <div class="flex -space-x-2">
                                        <div v-for="producer in producers" :key="producer.id"
                                            class="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                                            <img :src="producer.avatar" :alt="producer.name"
                                                class="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations complémentaires -->
                            <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-soft-green/20">
                                <h4 class="font-semibold text-forest-green mb-4 flex items-center">
                                    <svg class="w-5 h-5 mr-2 text-earth-red" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Impact positif
                                </h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="text-center p-3 bg-cream/30 rounded-xl">
                                        <div class="text-2xl font-bold text-forest-green mb-1">{{ carbonReduction }}kg
                                        </div>
                                        <div class="text-xs text-earth-brown">CO₂ économisé</div>
                                    </div>
                                    <div class="text-center p-3 bg-cream/30 rounded-xl">
                                        <div class="text-2xl font-bold text-forest-green mb-1">{{ localDistance }}km
                                        </div>
                                        <div class="text-xs text-earth-brown">Circuit court</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </main>

        <!-- Modal d'adresse -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-all duration-300 ease-organic"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showAddressModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div
                    class="bg-white rounded-3xl p-8 max-w-lg w-full transform transition-all duration-500 ease-organic scale-100">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-forest-green">Modifier l'adresse</h3>
                        <button @click="showAddressModal = false" class="text-earth-brown/50 hover:text-earth-brown">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <!-- Formulaire d'adresse simplifié -->
                    <button @click="selectDeliveryOption('standard')"
                        class="w-full p-4 mb-4 text-left rounded-2xl border-2 border-soft-green/30 hover:border-soft-green transition-all duration-300 ease-organic">
                        <div class="font-medium text-forest-green">Livraison standard</div>
                        <div class="text-sm text-earth-brown">Sous 48h • Gratuite à partir de 15 000 FCFA</div>
                    </button>
                    <button @click="selectDeliveryOption('express')"
                        class="w-full p-4 text-left rounded-2xl border-2 border-soft-green/30 hover:border-soft-green transition-all duration-300 ease-organic">
                        <div class="font-medium text-forest-green">Livraison express</div>
                        <div class="text-sm text-earth-brown">Sous 24h • + 2 000 FCFA</div>
                    </button>
                </div>
            </div>
        </transition>

        <!-- Modal d'aide -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-all duration-300 ease-organic"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showHelpModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div
                    class="bg-white rounded-3xl p-8 max-w-lg w-full transform transition-all duration-500 ease-organic scale-100">
                    <h3 class="text-2xl font-bold text-forest-green mb-6">Besoin d'aide ?</h3>
                    <div class="space-y-4">
                        <a href="tel:+237699999999"
                            class="flex items-center p-4 rounded-2xl bg-cream/50 hover:bg-cream transition-colors duration-300">
                            <div class="w-12 h-12 rounded-full bg-soft-green/20 flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-soft-green" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold text-forest-green">Appelez-nous</div>
                                <div class="text-earth-brown">+237 699 99 99 99</div>
                            </div>
                        </a>
                        <div class="flex items-center p-4 rounded-2xl bg-cream/50">
                            <div class="w-12 h-12 rounded-full bg-soft-green/20 flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-soft-green" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89-5.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold text-forest-green">Écrivez-nous</div>
                                <div class="text-earth-brown">support@marchefrais.cm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Footer -->
        <footer class="container mx-auto px-6 py-8 mt-12 border-t border-soft-green/20">
            <div class="text-center text-earth-brown/70 text-sm">
                <p>© {{ currentYear }} Marché Frais. Tous droits réservés.</p>
                <p class="mt-2">Transactions sécurisées avec cryptage 256-bit SSL</p>
            </div>
        </footer>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MobileMoneyPayment from '../components/MobileMoneyPayment.vue'
import PaymentForm from '../components/PaymentForm.vue'
import { formatCurrency } from '../utils/currencyFormatter'
import { useCartStore } from '@/modules/orders/stores/cart.store'

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

export default {
    name: 'PaymentView',
    components: {
        MobileMoneyPayment,
        PaymentForm,
        LeafDecoration,
        FruitDecoration
    },
    setup() {
        const router = useRouter()
        const cartStore = useCartStore()

        const selectedPaymentMethod = ref('mobile-money')
        const showAddressModal = ref(false)
        const showHelpModal = ref(false)
        const promoCode = ref('')
        const currentYear = new Date().getFullYear()

        // Données de test
        const cartItems = ref([
            {
                id: 1,
                name: 'Tomates cerises bio',
                producer: 'Ferme des Collines',
                origin: 'Local',
                quantity: 2,
                unitPrice: 1500,
                totalPrice: 3000,
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop'
            },
            {
                id: 2,
                name: 'Avocats hass',
                producer: 'Verger Tropical',
                origin: 'Ouest',
                quantity: 4,
                unitPrice: 800,
                totalPrice: 3200,
                image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w-400&h=400&fit=crop'
            },
            {
                id: 3,
                name: 'Piments frais',
                producer: 'Jardin Épicé',
                origin: 'Local',
                quantity: 1,
                unitPrice: 1200,
                totalPrice: 1200,
                image: 'https://images.unsplash.com/photo-1592924356291-c6588c533e50?w=400&h=400&fit=crop'
            }
        ])

        const delivery = ref({
            address: 'Rue 1234, Quartier Bastos',
            city: 'Yaoundé',
            region: 'Centre',
            type: 'Livraison à domicile',
            timeSlot: 'Demain 14h-16h',
            fee: 1500
        })

        const paymentMethods = ref([
            {
                id: 'mobile-money',
                name: 'Mobile Money',
                description: 'MTN & Orange',
                bgColor: 'bg-soft-green',
                icon: {
                    template: `
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 6h-1V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v1H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-1h4v1h-4V5zm8 14H7V8h10v11zm-5-9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          `
                },
                fee: '0 FCFA'
            },
            {
                id: 'credit-card',
                name: 'Carte bancaire',
                description: 'Visa, Mastercard',
                bgColor: 'bg-blue-500',
                icon: {
                    template: `
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
          `
                },
                fee: '2.5%'
            },
            {
                id: 'cash',
                name: 'Paiement à la livraison',
                description: 'Espèces',
                bgColor: 'bg-earth-red',
                icon: {
                    template: `
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
          `
                },
                fee: '0 FCFA'
            }
        ])

        const producers = ref([
            { id: 1, name: 'Pierre', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
            { id: 2, name: 'Marie', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' },
            { id: 3, name: 'Jean', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face' }
        ])

        // Computed
        const subtotal = computed(() => {
            return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
        })

        const transactionFee = computed(() => {
            if (selectedPaymentMethod.value === 'credit-card') {
                return Math.round(subtotal.value * 0.025)
            }
            return 0
        })

        const totalAmount = computed(() => {
            return subtotal.value + delivery.value.fee + transactionFee.value
        })

        const producersCount = computed(() => {
            return new Set(cartItems.value.map(item => item.producer)).size
        })

        const userInitials = computed(() => {
            return 'MF'
        })

        const carbonReduction = computed(() => {
            return (cartItems.value.length * 1.2).toFixed(1)
        })

        const localDistance = computed(() => {
            return (cartItems.value.length * 15).toFixed(0)
        })

        // Methods
        const selectPaymentMethod = (methodId) => {
            selectedPaymentMethod.value = methodId
        }

        const removeItem = (itemId) => {
            const index = cartItems.value.findIndex(item => item.id === itemId)
            if (index !== -1) {
                cartItems.value.splice(index, 1)
            }
        }

        const selectDeliveryOption = (option) => {
            if (option === 'express') {
                delivery.value = {
                    ...delivery.value,
                    type: 'Livraison express',
                    timeSlot: 'Demain 10h-12h',
                    fee: 3500
                }
            } else {
                delivery.value = {
                    ...delivery.value,
                    type: 'Livraison standard',
                    timeSlot: 'Après-demain 14h-16h',
                    fee: 1500
                }
            }
            showAddressModal.value = false
        }

        const applyPromoCode = () => {
            if (promoCode.value.toUpperCase() === 'FRAIS10') {
                // Appliquer la réduction
                alert('Code promo appliqué ! Réduction de 10%')
            } else if (promoCode.value) {
                alert('Code promo invalide')
            }
            promoCode.value = ''
        }

        const handlePaymentCompleted = (paymentData) => {
            console.log('Paiement complété:', paymentData)
            // Rediriger vers la page de confirmation
            router.push('/payment/confirmation')
        }

        onMounted(() => {
            // Charger les données du panier depuis le store si disponible
            if (cartStore.items && cartStore.items.length > 0) {
                // Adaptez selon votre structure de données
            }
        })

        return {
            cartItems,
            delivery,
            paymentMethods,
            producers,
            selectedPaymentMethod,
            showAddressModal,
            showHelpModal,
            promoCode,
            currentYear,
            subtotal,
            transactionFee,
            totalAmount,
            producersCount,
            userInitials,
            carbonReduction,
            localDistance,
            selectPaymentMethod,
            removeItem,
            selectDeliveryOption,
            applyPromoCode,
            handlePaymentCompleted,
            formatCurrency
        }
    }
}
</script>

<style scoped>
/* Animation d'entrée pour les articles */
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
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
        transform: translateY(-10px) rotate(5deg);
    }
}

@keyframes leaf-float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    33% {
        transform: translateY(-8px) rotate(-2deg);
    }

    66% {
        transform: translateY(-5px) rotate(2deg);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-leaf-float {
    animation: leaf-float 8s ease-in-out infinite;
}

/* Styles de défilement personnalisés */
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