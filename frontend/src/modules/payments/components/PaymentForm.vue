<template>
    <div class="min-h-screen overflow-hidden bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none bg-pattern-organic"></div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-20 left-10 w-40 h-40 leaf-float opacity-20">
            <div class="w-full h-full bg-primary-300/20 rounded-full blur-3xl"></div>
        </div>
        <div class="absolute bottom-20 right-10 w-60 h-60 leaf-float opacity-20" style="animation-delay: 3s;">
            <div class="w-full h-full bg-nature-400/20 rounded-full blur-3xl"></div>
        </div>

        <div class="container mx-auto px-4 py-8 relative z-10">
            <!-- Indicateur de progression -->
            <Transition appear enter-active-class="transition-all duration-700 custom-bezier"
                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
                <div class="max-w-4xl mx-auto mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex-1">
                            <div class="h-2 bg-nature-200/50 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-primary-500 to-nature-500 rounded-full transition-all duration-1000 custom-bezier"
                                    :style="{ width: `${progress}%` }"></div>
                            </div>
                        </div>
                        <span class="ml-4 text-sm font-medium text-nature-700">
                            Étape {{ currentStep }} sur 3
                        </span>
                    </div>

                    <div class="flex justify-between text-sm text-nature-600">
                        <span class="font-medium" :class="{ 'text-primary-600': currentStep >= 1 }">
                            1. Détails
                        </span>
                        <span class="font-medium" :class="{ 'text-primary-600': currentStep >= 2 }">
                            2. Paiement
                        </span>
                        <span class="font-medium" :class="{ 'text-primary-600': currentStep >= 3 }">
                            3. Confirmation
                        </span>
                    </div>
                </div>
            </Transition>

            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <!-- Panneau gauche: Illustration et résumé -->
                    <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
                        enter-from-class="opacity-0 -translate-x-10" enter-to-class="opacity-100 translate-x-0">
                        <div class="lg:w-2/5">
                            <div class="sticky top-8 space-y-8">
                                <!-- Illustration gourmande -->
                                <div
                                    class="rounded-2xl overflow-hidden border border-nature-200/50 shadow-2xl bg-gradient-to-br from-white/90 to-primary-50/50 backdrop-blur-sm">
                                    <div class="p-6">
                                        <h2 class="text-2xl font-bold text-nature-900 mb-4">
                                            Votre Panier Gourmand
                                        </h2>
                                        <p class="text-nature-600 mb-6">
                                            Des produits frais sélectionnés avec soin par nos producteurs locaux
                                        </p>

                                        <!-- Mini panier d'illustration -->
                                        <div class="space-y-4 mb-6">
                                            <div v-for="(item, index) in cartItems" :key="item.id"
                                                class="flex items-center p-4 rounded-xl bg-gradient-to-r from-white to-nature-50/50 border border-nature-200/30"
                                                :style="{ animationDelay: `${index * 100}ms` }">
                                                <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                                                    <img :src="item.image" :alt="item.name"
                                                        class="w-full h-full object-cover" />
                                                </div>
                                                <div class="flex-1">
                                                    <h4 class="font-medium text-nature-900">{{ item.name }}</h4>
                                                    <p class="text-sm text-nature-600">{{ item.quantity }} × {{
                                                        item.price }} XAF</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="font-bold text-nature-900">{{ item.total }} XAF</p>
                                                    <p class="text-xs text-nature-500">{{ item.weight }}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Total -->
                                        <div class="pt-6 border-t border-nature-200/50 space-y-3">
                                            <div class="flex justify-between text-nature-700">
                                                <span>Sous-total</span>
                                                <span class="font-medium">{{ subtotal }} XAF</span>
                                            </div>
                                            <div class="flex justify-between text-nature-700">
                                                <span>Livraison</span>
                                                <span class="font-medium">{{ deliveryFee }} XAF</span>
                                            </div>
                                            <div v-if="discount" class="flex justify-between text-green-600">
                                                <span>Réduction</span>
                                                <span class="font-medium">-{{ discount }} XAF</span>
                                            </div>
                                            <div
                                                class="flex justify-between text-xl font-bold text-nature-900 pt-3 border-t border-nature-200/50">
                                                <span>Total</span>
                                                <span class="text-primary-600">{{ total }} XAF</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Note sur les frais -->
                                    <div
                                        class="px-6 py-4 bg-gradient-to-r from-primary-50/50 to-emerald-50/50 border-t border-primary-200/30">
                                        <div class="flex items-start space-x-3">
                                            <InformationCircleIcon
                                                class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                            <p class="text-sm text-nature-700">
                                                Frais de service inclus. Livraison gratuite à partir de 15 000 XAF.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Réassurance -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div
                                        class="text-center p-4 rounded-xl bg-gradient-to-br from-white/80 to-emerald-50/50 border border-emerald-200/30">
                                        <ShieldCheckIcon class="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                        <p class="text-sm font-medium text-nature-800">Paiement sécurisé</p>
                                    </div>
                                    <div
                                        class="text-center p-4 rounded-xl bg-gradient-to-br from-white/80 to-primary-50/50 border border-primary-200/30">
                                        <TruckIcon class="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                        <p class="text-sm font-medium text-nature-800">Livraison 24h</p>
                                    </div>
                                    <div
                                        class="text-center p-4 rounded-xl bg-gradient-to-br from-white/80 to-nature-50/50 border border-nature-200/30">
                                        <CheckCircleIcon class="w-8 h-8 text-nature-600 mx-auto mb-2" />
                                        <p class="text-sm font-medium text-nature-800">Produits frais</p>
                                    </div>
                                    <div
                                        class="text-center p-4 rounded-xl bg-gradient-to-br from-white/80 to-orange-50/50 border border-orange-200/30">
                                        <PhoneIcon class="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                        <p class="text-sm font-medium text-nature-800">Support 7j/7</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>

                    <!-- Panneau droit: Formulaire de paiement -->
                    <Transition appear enter-active-class="transition-all duration-800 custom-bezier delay-200"
                        enter-from-class="opacity-0 translate-x-10" enter-to-class="opacity-100 translate-x-0">
                        <div class="lg:w-3/5">
                            <div
                                class="bg-gradient-to-br from-white/90 to-nature-50/50 backdrop-blur-sm rounded-2xl border border-nature-200/50 shadow-2xl overflow-hidden">
                                <!-- En-tête du formulaire -->
                                <div
                                    class="p-6 border-b border-nature-200/50 bg-gradient-to-r from-white to-primary-50/30">
                                    <h1 class="text-3xl font-bold text-nature-900 mb-2">
                                        <span
                                            class="bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                                            Finalisez votre commande
                                        </span>
                                    </h1>
                                    <p class="text-nature-600">
                                        Remplissez vos informations pour recevoir vos produits frais
                                    </p>
                                </div>

                                <!-- Contenu du formulaire -->
                                <div class="p-6">
                                    <!-- Étape 1: Détails de livraison -->
                                    <Transition name="step" mode="out-in">
                                        <div v-if="currentStep === 1" key="step1" class="space-y-6">
                                            <h2 class="text-xl font-bold text-nature-900 flex items-center">
                                                <MapPinIcon class="w-6 h-6 text-primary-600 mr-3" />
                                                Adresse de livraison
                                            </h2>

                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                                        Prénom
                                                    </label>
                                                    <input v-model="form.firstName" type="text"
                                                        class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                        placeholder="Votre prénom" />
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                                        Nom
                                                    </label>
                                                    <input v-model="form.lastName" type="text"
                                                        class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                        placeholder="Votre nom" />
                                                </div>
                                            </div>

                                            <div>
                                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                                    Adresse
                                                </label>
                                                <input v-model="form.address" type="text"
                                                    class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                    placeholder="Rue, quartier" />
                                            </div>

                                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div class="md:col-span-2">
                                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                                        Ville
                                                    </label>
                                                    <select v-model="form.city"
                                                        class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white">
                                                        <option value="">Choisir une ville</option>
                                                        <option value="douala">Douala</option>
                                                        <option value="yaounde">Yaoundé</option>
                                                        <option value="bafoussam">Bafoussam</option>
                                                        <option value="bamenda">Bamenda</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                                        Code postal
                                                    </label>
                                                    <input v-model="form.postalCode" type="text"
                                                        class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                        placeholder="00000" />
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                                        Téléphone
                                                    </label>
                                                    <input v-model="form.phone" type="tel"
                                                        class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                        placeholder="6xx xxx xxx" />
                                                </div>
                                            </div>

                                            <div>
                                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                                    Instructions spéciales
                                                </label>
                                                <textarea v-model="form.instructions" rows="3"
                                                    class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                    placeholder="Informations supplémentaires pour le livreur..."></textarea>
                                            </div>

                                            <div class="flex justify-end">
                                                <button @click="nextStep"
                                                    class="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center">
                                                    Continuer vers le paiement
                                                    <ArrowRightIcon class="w-5 h-5 ml-2" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Étape 2: Méthode de paiement -->
                                        <div v-else-if="currentStep === 2" key="step2" class="space-y-6">
                                            <h2 class="text-xl font-bold text-nature-900 flex items-center">
                                                <CreditCardIcon class="w-6 h-6 text-primary-600 mr-3" />
                                                Moyen de paiement
                                            </h2>

                                            <!-- Sélection du type de paiement -->
                                            <div>
                                                <p class="text-nature-700 mb-4">
                                                    Choisissez votre méthode de paiement préférée
                                                </p>

                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    <button v-for="method in paymentMethods" :key="method.id"
                                                        @click="selectedPaymentMethod = method.id" :class="[
                                                            'p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105',
                                                            selectedPaymentMethod === method.id
                                                                ? 'border-primary-500 bg-primary-50/50 shadow-lg'
                                                                : 'border-nature-200/50 hover:border-primary-300/50'
                                                        ]">
                                                        <div class="flex items-center space-x-4">
                                                            <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                                                                :class="method.iconBg">
                                                                <component :is="method.icon" class="w-6 h-6"
                                                                    :class="method.iconColor" />
                                                            </div>
                                                            <div class="text-left">
                                                                <h3 class="font-semibold text-nature-900">{{ method.name
                                                                    }}</h3>
                                                                <p class="text-sm text-nature-600">{{ method.description
                                                                    }}</p>
                                                            </div>
                                                            <div v-if="method.popular" class="ml-auto">
                                                                <span
                                                                    class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200">
                                                                    Populaire
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>

                                                <!-- Formulaire Mobile Money -->
                                                <div v-if="selectedPaymentMethod === 'mobile_money'" class="space-y-4">
                                                    <div>
                                                        <label class="block text-sm font-medium text-nature-700 mb-2">
                                                            Opérateur
                                                        </label>
                                                        <div class="flex space-x-4">
                                                            <button v-for="operator in mobileOperators"
                                                                :key="operator.id"
                                                                @click="selectedOperator = operator.id" :class="[
                                                                    'flex-1 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105',
                                                                    selectedOperator === operator.id
                                                                        ? 'border-primary-500 bg-primary-50/50'
                                                                        : 'border-nature-200/50'
                                                                ]">
                                                                <div class="flex flex-col items-center">
                                                                    <div
                                                                        class="w-12 h-12 mb-2 rounded-full bg-gradient-to-br from-white to-cream/60 border border-soft-green/20 flex items-center justify-center">
                                                                        <span class="text-xl">{{ operator.icon }}</span>
                                                                    </div>
                                                                    <span class="font-medium text-nature-900">{{
                                                                        operator.name }}</span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label class="block text-sm font-medium text-nature-700 mb-2">
                                                            Numéro de téléphone
                                                        </label>
                                                        <input v-model="mobileMoneyForm.phone" type="tel"
                                                            class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                            placeholder="6xx xxx xxx" />
                                                        <p class="text-sm text-nature-500 mt-2">
                                                            Vous recevrez une demande de paiement sur ce numéro
                                                        </p>
                                                    </div>
                                                </div>

                                                <!-- Formulaire Carte bancaire -->
                                                <div v-if="selectedPaymentMethod === 'card'" class="space-y-4">
                                                    <div>
                                                        <label class="block text-sm font-medium text-nature-700 mb-2">
                                                            Numéro de carte
                                                        </label>
                                                        <div class="relative">
                                                            <input v-model="cardForm.number" type="text"
                                                                class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 pl-12"
                                                                placeholder="4242 4242 4242 4242" maxlength="19"
                                                                @input="formatCardNumber" />
                                                            <CreditCardIcon
                                                                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-nature-400" />
                                                        </div>
                                                    </div>

                                                    <div class="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label
                                                                class="block text-sm font-medium text-nature-700 mb-2">
                                                                Date d'expiration
                                                            </label>
                                                            <input v-model="cardForm.expiry" type="text"
                                                                class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                                placeholder="MM/AA" maxlength="5"
                                                                @input="formatExpiry" />
                                                        </div>
                                                        <div>
                                                            <label
                                                                class="block text-sm font-medium text-nature-700 mb-2">
                                                                CVV
                                                            </label>
                                                            <div class="relative">
                                                                <input v-model="cardForm.cvv" type="text"
                                                                    class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                                    placeholder="123" maxlength="4" />
                                                                <InformationCircleIcon
                                                                    class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-nature-400 cursor-help"
                                                                    @mouseenter="showCVVInfo = true"
                                                                    @mouseleave="showCVVInfo = false" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label class="block text-sm font-medium text-nature-700 mb-2">
                                                            Titulaire de la carte
                                                        </label>
                                                        <input v-model="cardForm.name" type="text"
                                                            class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                            placeholder="Nom comme sur la carte" />
                                                    </div>
                                                </div>

                                                <!-- Informations de sécurité -->
                                                <div
                                                    class="p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-200/50">
                                                    <div class="flex items-start space-x-3">
                                                        <LockClosedIcon
                                                            class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p class="text-sm font-medium text-nature-800 mb-1">
                                                                Paiement 100% sécurisé
                                                            </p>
                                                            <p class="text-xs text-nature-600">
                                                                Vos informations sont chiffrées et protégées. Nous ne
                                                                stockons jamais vos données bancaires.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex justify-between">
                                                <button @click="prevStep"
                                                    class="px-6 py-3 border border-nature-300 text-nature-700 rounded-xl font-medium hover:bg-nature-50 transition-all duration-300 flex items-center">
                                                    <ArrowLeftIcon class="w-5 h-5 mr-2" />
                                                    Retour
                                                </button>
                                                <button @click="nextStep" :disabled="!canProceedToPayment" :class="[
                                                    'px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center',
                                                    canProceedToPayment
                                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:scale-105'
                                                        : 'bg-nature-200 text-nature-400 cursor-not-allowed'
                                                ]">
                                                    Payer {{ total }} XAF
                                                    <LockClosedIcon class="w-5 h-5 ml-2" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Étape 3: Confirmation -->
                                        <div v-else key="step3" class="space-y-6">
                                            <div class="text-center py-8">
                                                <div
                                                    class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                                                    <CheckCircleIcon class="w-12 h-12 text-emerald-600" />
                                                </div>
                                                <h2 class="text-2xl font-bold text-nature-900 mb-3">
                                                    Paiement réussi !
                                                </h2>
                                                <p class="text-nature-600 max-w-md mx-auto">
                                                    Votre commande a été confirmée. Vous recevrez une confirmation par
                                                    SMS et email.
                                                </p>

                                                <div
                                                    class="mt-8 p-6 rounded-xl bg-gradient-to-br from-white to-primary-50/30 border border-primary-200/30 max-w-md mx-auto">
                                                    <h3 class="font-bold text-nature-900 mb-4">Récapitulatif</h3>
                                                    <div class="space-y-3 text-sm">
                                                        <div class="flex justify-between">
                                                            <span class="text-nature-600">N° de commande</span>
                                                            <span class="font-mono font-bold text-nature-900">CMD-{{
                                                                orderId }}</span>
                                                        </div>
                                                        <div class="flex justify-between">
                                                            <span class="text-nature-600">Date de livraison
                                                                estimée</span>
                                                            <span class="font-medium text-nature-900">{{ deliveryDate
                                                                }}</span>
                                                        </div>
                                                        <div class="flex justify-between">
                                                            <span class="text-nature-600">Montant payé</span>
                                                            <span class="font-bold text-primary-600">{{ total }}
                                                                XAF</span>
                                                        </div>
                                                        <div class="flex justify-between">
                                                            <span class="text-nature-600">Méthode</span>
                                                            <span class="font-medium text-nature-900">{{
                                                                getPaymentMethodName(selectedPaymentMethod) }}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="mt-8 space-y-4">
                                                    <button @click="goToOrderTracking"
                                                        class="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 w-full md:w-auto">
                                                        Suivre ma commande
                                                    </button>
                                                    <button @click="goToHome"
                                                        class="px-8 py-3 border border-nature-300 text-nature-700 rounded-xl font-medium hover:bg-nature-50 transition-all duration-300 w-full md:w-auto">
                                                        Retour à l'accueil
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>

                                <!-- Pied de page du formulaire -->
                                <div
                                    class="p-6 border-t border-nature-200/50 bg-gradient-to-r from-nature-50/30 to-white/30">
                                    <div class="flex items-center justify-between text-sm">
                                        <div class="flex items-center text-nature-600">
                                            <LockClosedIcon class="w-4 h-4 mr-2" />
                                            <span>Paiement sécurisé SSL</span>
                                        </div>
                                        <div class="flex items-center space-x-4">
                                            <span
                                                class="px-2 py-1 rounded-md border border-nature-300/40 bg-white/70 text-xs font-semibold text-nature-700">Visa</span>
                                            <span
                                                class="px-2 py-1 rounded-md border border-nature-300/40 bg-white/70 text-xs font-semibold text-nature-700">Mastercard</span>
                                            <span
                                                class="px-2 py-1 rounded-md border border-nature-300/40 bg-white/70 text-xs font-semibold text-nature-700">MTN</span>
                                            <span
                                                class="px-2 py-1 rounded-md border border-nature-300/40 bg-white/70 text-xs font-semibold text-nature-700">Orange</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Popup d'info CVV -->
                            <Transition enter-active-class="transition-all duration-300 custom-bezier"
                                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                                leave-active-class="transition-all duration-200"
                                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                                <div v-if="showCVVInfo"
                                    class="absolute right-0 mt-2 w-64 p-4 rounded-xl bg-gradient-to-br from-white to-nature-50/90 border border-nature-200/50 shadow-2xl z-10">
                                    <div class="flex items-start space-x-3">
                                        <InformationCircleIcon class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p class="font-medium text-nature-900 mb-1">Code de sécurité</p>
                                            <p class="text-sm text-nature-600">
                                                Les 3 ou 4 derniers chiffres au dos de votre carte, à côté de la
                                                signature.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/modules/orders/stores/cart.store'
import {
    MapPinIcon,
    CreditCardIcon,
    LockClosedIcon,
    InformationCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    TruckIcon,
    PhoneIcon,
    DevicePhoneMobileIcon,
    BanknotesIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// État du formulaire
const currentStep = ref(1)
const progress = computed(() => (currentStep.value / 3) * 100)

// Données du formulaire
const form = ref({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    instructions: ''
})

// Méthodes de paiement
const selectedPaymentMethod = ref('mobile_money')
const selectedOperator = ref('mtn')

const paymentMethods = [
    {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'MTN & Orange Money',
        icon: DevicePhoneMobileIcon,
        iconBg: 'bg-gradient-to-br from-yellow-100 to-orange-100',
        iconColor: 'text-orange-600',
        popular: true
    },
    {
        id: 'card',
        name: 'Carte bancaire',
        description: 'Visa, Mastercard',
        icon: CreditCardIcon,
        iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
        iconColor: 'text-blue-600',
        popular: false
    },
    {
        id: 'cash',
        name: 'Paiement à la livraison',
        description: 'Espèces ou Mobile Money',
        icon: BanknotesIcon,
        iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
        iconColor: 'text-green-600',
        popular: false
    }
]

const mobileOperators = [
    {
        id: 'mtn',
        name: 'MTN Money',
        icon: '📱'
    },
    {
        id: 'orange',
        name: 'Orange Money',
        icon: '🟧'
    }
]

const mobileMoneyForm = ref({
    phone: ''
})

const cardForm = ref({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
})

const cartItems = computed(() => {
    const items = Array.isArray(cartStore.items) ? cartStore.items : []
    return items.map((item: any) => ({
        id: item?.id,
        name: item?.product?.name || 'Produit',
        price: Number(item?.unitPrice || 0),
        quantity: Number(item?.quantity || 0),
        total: Number(item?.subtotal || 0),
        weight: item?.product?.unit || '',
        image: item?.product?.images?.[0] || ''
    }))
})

const subtotal = computed(() => Number(cartStore.subtotal || 0))
const deliveryFee = computed(() => Number(cartStore.cart?.deliveryFee || 0))
const discount = computed(() => Number(cartStore.cart?.discountAmount || 0))
const total = computed(() => Number(cartStore.totalAmount || 0))

const canProceedToPayment = computed(() => {
    if (selectedPaymentMethod.value === 'mobile_money') {
        return mobileMoneyForm.value.phone.length >= 9
    }
    if (selectedPaymentMethod.value === 'card') {
        return cardForm.value.number.length >= 16 &&
            cardForm.value.expiry.length === 5 &&
            cardForm.value.cvv.length >= 3 &&
            cardForm.value.name.length > 0
    }
    return true
})

const showCVVInfo = ref(false)
const orderId = ref<string | number>(String(route.query.orderId || ''))
const deliveryDate = ref(getDeliveryDate())

// Méthodes
function nextStep() {
    if (currentStep.value < 3) {
        currentStep.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

function prevStep() {
    if (currentStep.value > 1) {
        currentStep.value--
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

function formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement
    let value = input.value.replace(/\D/g, '')
    value = value.replace(/(\d{4})/g, '$1 ').trim()
    cardForm.value.number = value.substring(0, 19)
}

function formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement
    let value = input.value.replace(/\D/g, '')
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }
    cardForm.value.expiry = value.substring(0, 5)
}

function getPaymentMethodName(methodId: string) {
    const method = paymentMethods.find(m => m.id === methodId)
    return method?.name || ''
}

function getDeliveryDate() {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    return date.toLocaleDateString('fr-CM', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })
}

function goToOrderTracking() {
    if (orderId.value) {
        router.push(`/orders/${orderId.value}`)
        return
    }
    router.push('/orders')
}

function goToHome() {
    router.push('/')
}

// Animation d'entrée des éléments du panier
onMounted(() => {
    cartStore.fetchCart()
    if (!orderId.value && cartStore.cart?.id) {
        orderId.value = String(cartStore.cart.id)
    }

    // Simulation de chargement
    setTimeout(() => {
        // Animation des éléments du panier
        const items = document.querySelectorAll('.cart-item')
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-slide-in')
            }, index * 100)
        })
    }, 500)
})
</script>

<style scoped>
/* Background pattern */
.bg-pattern-organic {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300a896' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

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

/* Transitions entre étapes */
.step-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.step-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

/* Animation d'entrée des éléments du panier */
.cart-item {
    animation: slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes slide-in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Effet de brillance sur les boutons */
.shimmer {
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* Variables pour les couleurs */
:root {
    --color-primary-50: #f0f9ff;
    --color-primary-500: #0ea5e9;
    --color-primary-600: #0284c7;
    --color-nature-50: #fafaf9;
    --color-nature-500: #78716c;
    --color-nature-600: #57534e;
    --color-nature-900: #1c1917;
    --color-emerald-500: #10b981;
    --color-green-500: #22c55e;
}
</style>