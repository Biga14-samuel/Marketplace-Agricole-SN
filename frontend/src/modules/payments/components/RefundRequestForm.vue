<template>
    <div
        class="refund-request-page min-h-screen bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30 overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none" :style="{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
          <svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='refund-pattern' width='50' height='50' patternUnits='userSpaceOnUse'>
                <path d='M25,5 Q30,0 35,5 T45,5' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <path d='M5,25 Q0,30 5,35 T5,45' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <circle cx='25' cy='25' r='3' fill='%2300a896' opacity='0.03'/>
                <circle cx='45' cy='45' r='3' fill='%2300a896' opacity='0.03'/>
              </pattern>
            </defs>
            <rect width='100' height='100' fill='url(%23refund-pattern)'/>
            <path d='M30,70 Q50,90 70,70' stroke='%2300a896' fill='none' stroke-width='0.3' opacity='0.03'/>
          </svg>
        `)}')`
        }"></div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-20 left-10 w-48 h-48 leaf-float opacity-10">
            <div class="w-full h-full bg-primary-300/20 rounded-full blur-3xl"></div>
        </div>
        <div class="absolute bottom-20 right-10 w-56 h-56 leaf-float opacity-10" style="animation-delay: 2s;">
            <div class="w-full h-full bg-orange-300/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Conteneur principal -->
        <div class="container mx-auto px-4 py-8 relative z-10">
            <!-- Indicateur de progression -->
            <Transition appear enter-active-class="transition-all duration-700 custom-bezier"
                enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0">
                <div class="max-w-6xl mx-auto mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex-1">
                            <div class="h-2 bg-nature-200/50 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-primary-500 to-orange-500 rounded-full transition-all duration-1000 custom-bezier"
                                    :style="{ width: `${progress}%` }"></div>
                            </div>
                        </div>
                        <span class="ml-4 text-sm font-medium text-nature-700">
                            Étape {{ currentStep }} sur 3
                        </span>
                    </div>

                    <div class="flex justify-between text-sm text-nature-600">
                        <span class="font-medium" :class="{ 'text-primary-600': currentStep >= 1 }">
                            1. Sélection
                        </span>
                        <span class="font-medium" :class="{ 'text-primary-600': currentStep >= 2 }">
                            2. Détails
                        </span>
                        <span class="font-medium" :class="{ 'text-primary-600': currentStep >= 3 }">
                            3. Confirmation
                        </span>
                    </div>
                </div>
            </Transition>

            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <!-- Panneau gauche: Illustration et informations -->
                    <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
                        enter-from-class="opacity-0 -translate-x-10" enter-to-class="opacity-100 translate-x-0">
                        <div class="lg:w-2/5">
                            <div class="sticky top-8 space-y-8">
                                <!-- Illustration gourmande -->
                                <div
                                    class="rounded-2xl overflow-hidden border border-nature-200/50 shadow-2xl bg-gradient-to-br from-white/90 to-primary-50/50 backdrop-blur-sm">
                                    <div class="p-6">
                                        <h2 class="text-2xl font-bold text-nature-900 mb-4">
                                            Demande de Remboursement
                                        </h2>
                                        <p class="text-nature-600 mb-6">
                                            Nous comprenons que parfois les choses ne se passent pas comme prévu.
                                            Notre équipe est là pour vous aider à résoudre votre problème rapidement.
                                        </p>

                                        <!-- Informations sur le processus -->
                                        <div class="space-y-4 mb-6">
                                            <div class="flex items-start space-x-3">
                                                <div
                                                    class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                                    <ClockIcon class="w-4 h-4 text-primary-600" />
                                                </div>
                                                <div>
                                                    <p class="font-medium text-nature-900">Traitement rapide</p>
                                                    <p class="text-sm text-nature-600">Remboursement sous 3-5 jours
                                                        ouvrés</p>
                                                </div>
                                            </div>
                                            <div class="flex items-start space-x-3">
                                                <div
                                                    class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                    <ShieldCheckIcon class="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p class="font-medium text-nature-900">Garantie satisfait</p>
                                                    <p class="text-sm text-nature-600">Politique de remboursement
                                                        transparente</p>
                                                </div>
                                            </div>
                                            <div class="flex items-start space-x-3">
                                                <div
                                                    class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                                    <PhoneIcon class="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p class="font-medium text-nature-900">Support dédié</p>
                                                    <p class="text-sm text-nature-600">Notre équipe est disponible pour
                                                        vous aider</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Politique de remboursement -->
                                        <div
                                            class="p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-200/50">
                                            <h4 class="font-semibold text-emerald-900 mb-2 flex items-center">
                                                <InformationCircleIcon class="w-5 h-5 text-emerald-600 mr-2" />
                                                Notre politique de remboursement
                                            </h4>
                                            <ul class="text-xs text-emerald-800 space-y-1">
                                                <li class="flex items-start">
                                                    <CheckCircleIcon
                                                        class="w-3 h-3 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span>Remboursement sous 14 jours après réception</span>
                                                </li>
                                                <li class="flex items-start">
                                                    <CheckCircleIcon
                                                        class="w-3 h-3 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span>Produits frais: remboursement intégral sous 48h</span>
                                                </li>
                                                <li class="flex items-start">
                                                    <CheckCircleIcon
                                                        class="w-3 h-3 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span>Frais de retour pris en charge</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- Note sur les remboursements -->
                                    <div
                                        class="px-6 py-4 bg-gradient-to-r from-primary-50/50 to-orange-50/50 border-t border-primary-200/30">
                                        <div class="flex items-start space-x-3">
                                            <ExclamationCircleIcon
                                                class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                            <p class="text-sm text-nature-700">
                                                Les remboursements sont effectués sur le moyen de paiement d'origine.
                                                Les délais peuvent varier selon votre banque ou opérateur Mobile Money.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Statut des demandes précédentes -->
                                <div
                                    class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-nature-50/50 border border-nature-200/30">
                                    <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                        <ArchiveBoxIcon class="w-5 h-5 text-nature-600 mr-2" />
                                        Vos demandes récentes
                                    </h3>
                                    <div v-if="previousRefunds.length > 0" class="space-y-3">
                                        <div v-for="refund in previousRefunds" :key="refund.id"
                                            class="p-3 rounded-lg border border-nature-200/50 hover:border-primary-300/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                                            @click="viewRefund(refund)">
                                            <div class="flex justify-between items-start mb-1">
                                                <span class="font-medium text-nature-900">CMD-{{ refund.order_id
                                                    }}</span>
                                                <span class="text-xs px-2 py-1 rounded-full"
                                                    :class="getStatusClass(refund.status)">
                                                    {{ refund.status }}
                                                </span>
                                            </div>
                                            <div class="flex justify-between text-sm text-nature-600">
                                                <span>{{ formatCurrency(refund.amount) }}</span>
                                                <span>{{ formatDate(refund.created_at) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-center py-4">
                                        <p class="text-nature-500 text-sm">Aucune demande de remboursement précédente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>

                    <!-- Panneau droit: Formulaire de remboursement -->
                    <Transition appear enter-active-class="transition-all duration-800 custom-bezier delay-200"
                        enter-from-class="opacity-0 translate-x-10" enter-to-class="opacity-100 translate-x-0">
                        <div class="lg:w-3/5">
                            <!-- Carte du formulaire -->
                            <div
                                class="bg-gradient-to-br from-white/90 to-nature-50/50 backdrop-blur-sm rounded-2xl border border-nature-200/50 shadow-2xl overflow-hidden">
                                <!-- En-tête -->
                                <div
                                    class="p-6 border-b border-nature-200/50 bg-gradient-to-r from-white to-primary-50/30">
                                    <h1 class="text-3xl font-bold text-nature-900 mb-2">
                                        <span
                                            class="bg-gradient-to-r from-primary-600 to-orange-600 bg-clip-text text-transparent">
                                            Demander un Remboursement
                                        </span>
                                    </h1>
                                    <p class="text-nature-600">
                                        Remplissez ce formulaire pour initier votre demande de remboursement
                                    </p>
                                </div>

                                <!-- Contenu du formulaire -->
                                <div class="p-6">
                                    <!-- Étape 1: Sélection de la commande -->
                                    <Transition name="step" mode="out-in">
                                        <div v-if="currentStep === 1" key="step1" class="space-y-6">
                                            <h2 class="text-xl font-bold text-nature-900 flex items-center">
                                                <ShoppingCartIcon class="w-6 h-6 text-primary-600 mr-3" />
                                                Sélectionnez votre commande
                                            </h2>

                                            <div class="mb-6">
                                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                                    Commandes éligibles au remboursement
                                                </label>

                                                <div class="space-y-4">
                                                    <div v-for="order in eligibleOrders" :key="order.id"
                                                        @click="selectOrder(order)" :class="[
                                                            'p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer',
                                                            selectedOrder?.id === order.id
                                                                ? 'border-primary-500 bg-primary-50/50 shadow-lg'
                                                                : 'border-nature-200/50 hover:border-primary-300/50'
                                                        ]">
                                                        <div class="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h4 class="font-semibold text-nature-900">Commande #{{
                                                                    order.order_number }}</h4>
                                                                <p class="text-sm text-nature-600">{{
                                                                    formatDate(order.date) }}</p>
                                                            </div>
                                                            <div class="text-right">
                                                                <p class="font-bold text-nature-900">{{
                                                                    formatCurrency(order.total) }}</p>
                                                                <p class="text-xs text-nature-500">{{ order.items_count
                                                                    }} articles</p>
                                                            </div>
                                                        </div>

                                                        <!-- Articles de la commande -->
                                                        <div class="mb-3">
                                                            <div class="flex flex-wrap gap-2">
                                                                <span v-for="item in order.items.slice(0, 3)"
                                                                    :key="item.id"
                                                                    class="text-xs px-2 py-1 rounded-full bg-nature-100 text-nature-700 border border-nature-200/50">
                                                                    {{ item.name }}
                                                                </span>
                                                                <span v-if="order.items.length > 3"
                                                                    class="text-xs px-2 py-1 rounded-full bg-nature-200 text-nature-600">
                                                                    +{{ order.items.length - 3 }} autres
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <!-- Statut de la commande -->
                                                        <div class="flex items-center justify-between text-sm">
                                                            <div class="flex items-center">
                                                                <CheckCircleIcon
                                                                    class="w-4 h-4 text-emerald-500 mr-1" />
                                                                <span class="text-emerald-700">Livrée le {{
                                                                    formatDate(order.delivery_date) }}</span>
                                                            </div>
                                                            <span class="text-nature-500">Éligible jusqu'au {{
                                                                formatDate(order.refund_deadline) }}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Aucune commande éligible -->
                                                <div v-if="eligibleOrders.length === 0"
                                                    class="text-center py-8 px-4 rounded-xl border-2 border-dashed border-nature-300/50 bg-nature-50/30">
                                                    <div
                                                        class="w-16 h-16 mx-auto mb-4 rounded-full bg-nature-100 flex items-center justify-center">
                                                        <ShoppingBagIcon class="w-8 h-8 text-nature-400" />
                                                    </div>
                                                    <h4 class="text-lg font-semibold text-nature-800 mb-2">Aucune
                                                        commande éligible</h4>
                                                    <p class="text-nature-600 mb-4">
                                                        Aucune de vos commandes récentes n'est éligible au
                                                        remboursement.
                                                        Consultez notre politique pour plus d'informations.
                                                    </p>
                                                    <button @click="viewRefundPolicy"
                                                        class="text-primary-600 hover:text-primary-700 font-medium">
                                                        Voir la politique de remboursement
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- Navigation -->
                                            <div class="flex justify-end">
                                                <button @click="nextStep" :disabled="!selectedOrder" :class="[
                                                    'px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center',
                                                    selectedOrder
                                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg'
                                                        : 'bg-nature-200 text-nature-400 cursor-not-allowed'
                                                ]">
                                                    Continuer
                                                    <ArrowRightIcon class="w-5 h-5 ml-2" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Étape 2: Détails du remboursement -->
                                        <div v-else-if="currentStep === 2" key="step2" class="space-y-6">
                                            <h2 class="text-xl font-bold text-nature-900 flex items-center">
                                                <CurrencyDollarIcon class="w-6 h-6 text-primary-600 mr-3" />
                                                Détails du remboursement
                                            </h2>

                                            <!-- Montant du remboursement -->
                                            <div class="mb-6">
                                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                                    Montant à rembourser
                                                </label>

                                                <div
                                                    class="p-4 rounded-xl bg-gradient-to-br from-nature-50/50 to-white border border-nature-200/30 mb-4">
                                                    <div class="flex justify-between items-center mb-4">
                                                        <span class="text-nature-600">Montant total de la
                                                            commande</span>
                                                        <span class="font-bold text-nature-900">{{
                                                            formatCurrency(selectedOrder.total) }}</span>
                                                    </div>

                                                    <div class="mb-4">
                                                        <label class="block text-sm font-medium text-nature-700 mb-3">
                                                            Sélectionnez le montant à rembourser
                                                        </label>
                                                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                            <button v-for="option in refundAmountOptions"
                                                                :key="option.label" @click="selectRefundAmount(option)"
                                                                :class="[
                                                                    'py-3 rounded-xl border transition-all duration-300 hover:scale-105',
                                                                    formData.amount === option.value
                                                                        ? 'border-primary-500 bg-primary-50/50 shadow-md'
                                                                        : 'border-nature-200/50 hover:border-primary-300/50'
                                                                ]">
                                                                <div class="text-center">
                                                                    <div class="font-semibold text-nature-900">{{
                                                                        option.label }}</div>
                                                                    <div class="text-sm text-nature-600">{{
                                                                        formatCurrency(option.value) }}</div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <!-- Montant personnalisé -->
                                                    <div>
                                                        <label class="block text-sm font-medium text-nature-700 mb-2">
                                                            Ou spécifiez un montant personnalisé
                                                        </label>
                                                        <div class="relative">
                                                            <input v-model="customAmount" type="number"
                                                                :max="selectedOrder.total" :min="0"
                                                                class="w-full pl-12 pr-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                                placeholder="Montant en XAF" @input="setCustomAmount" />
                                                            <CurrencyDollarIcon
                                                                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-nature-400" />
                                                        </div>
                                                        <p class="text-xs text-nature-500 mt-2">
                                                            Montant maximum: {{ formatCurrency(selectedOrder.total) }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Motif du remboursement -->
                                            <div class="mb-6">
                                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                                    Motif du remboursement
                                                </label>

                                                <div class="space-y-3 mb-4">
                                                    <div v-for="reason in refundReasons" :key="reason.id"
                                                        @click="selectReason(reason)" :class="[
                                                            'p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer',
                                                            formData.reason === reason.id
                                                                ? 'border-primary-500 bg-primary-50/50 shadow-md'
                                                                : 'border-nature-200/50 hover:border-primary-300/50'
                                                        ]">
                                                        <div class="flex items-start space-x-3">
                                                            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                                :class="reason.bgColor">
                                                                <component :is="reason.icon" class="w-4 h-4"
                                                                    :class="reason.iconColor" />
                                                            </div>
                                                            <div class="flex-1">
                                                                <h4 class="font-medium text-nature-900 mb-1">{{
                                                                    reason.title }}</h4>
                                                                <p class="text-sm text-nature-600">{{ reason.description
                                                                    }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Détails supplémentaires -->
                                                <div>
                                                    <label class="block text-sm font-medium text-nature-700 mb-2">
                                                        Détails supplémentaires (optionnel)
                                                    </label>
                                                    <textarea v-model="formData.details" rows="4"
                                                        class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                                                        placeholder="Décrivez brièvement la raison de votre demande de remboursement..."></textarea>
                                                    <p class="text-xs text-nature-500 mt-2">
                                                        Plus vous fournissez de détails, plus nous pouvons traiter votre
                                                        demande rapidement.
                                                    </p>
                                                </div>
                                            </div>

                                            <!-- Preuves (photos) -->
                                            <div class="mb-6">
                                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                                    Photos ou preuves (optionnel)
                                                </label>
                                                <div class="border-2 border-dashed border-nature-300/50 rounded-xl p-6 text-center hover:border-primary-400/50 transition-all duration-300 cursor-pointer"
                                                    @click="triggerFileInput">
                                                    <div
                                                        class="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <PhotoIcon class="w-6 h-6 text-primary-600" />
                                                    </div>
                                                    <p class="text-nature-700 font-medium mb-1">Ajoutez des photos</p>
                                                    <p class="text-sm text-nature-500">Glissez-déposez ou cliquez pour
                                                        ajouter des fichiers</p>
                                                    <p class="text-xs text-nature-400 mt-2">JPG, PNG ou PDF - Maximum
                                                        10MB par fichier</p>
                                                    <input ref="fileInput" type="file" multiple accept="image/*,.pdf"
                                                        class="hidden" @change="handleFileUpload" />
                                                </div>

                                                <!-- Prévisualisation des fichiers -->
                                                <div v-if="formData.attachments.length > 0" class="mt-4">
                                                    <div class="flex flex-wrap gap-2">
                                                        <div v-for="(file, index) in formData.attachments" :key="index"
                                                            class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-nature-100/50 border border-nature-200/50">
                                                            <DocumentIcon class="w-4 h-4 text-nature-500" />
                                                            <span
                                                                class="text-sm text-nature-700 truncate max-w-[150px]">{{
                                                                file.name }}</span>
                                                            <button @click="removeAttachment(index)"
                                                                class="text-nature-400 hover:text-nature-600">
                                                                <XMarkIcon class="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Navigation -->
                                            <div class="flex justify-between">
                                                <button @click="prevStep"
                                                    class="px-6 py-3 border border-nature-300 text-nature-700 rounded-xl font-medium hover:bg-nature-50 transition-all duration-300 flex items-center">
                                                    <ArrowLeftIcon class="w-5 h-5 mr-2" />
                                                    Retour
                                                </button>
                                                <button @click="nextStep"
                                                    :disabled="!formData.amount || !formData.reason" :class="[
                                                        'px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center',
                                                        formData.amount && formData.reason
                                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg'
                                                            : 'bg-nature-200 text-nature-400 cursor-not-allowed'
                                                    ]">
                                                    Vérifier la demande
                                                    <ArrowRightIcon class="w-5 h-5 ml-2" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Étape 3: Confirmation -->
                                        <div v-else key="step3" class="space-y-6">
                                            <h2 class="text-xl font-bold text-nature-900 flex items-center">
                                                <CheckCircleIcon class="w-6 h-6 text-emerald-600 mr-3" />
                                                Confirmez votre demande
                                            </h2>

                                            <!-- Récapitulatif -->
                                            <div
                                                class="p-6 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-200/50">
                                                <h3 class="font-bold text-emerald-900 mb-4 flex items-center">
                                                    <InformationCircleIcon class="w-5 h-5 text-emerald-600 mr-2" />
                                                    Récapitulatif de votre demande
                                                </h3>
                                                <div class="space-y-4">
                                                    <div class="flex justify-between">
                                                        <span class="text-emerald-800">Commande</span>
                                                        <span class="font-bold text-emerald-900">CMD-{{
                                                            selectedOrder?.order_number }}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-emerald-800">Montant du remboursement</span>
                                                        <span class="font-bold text-emerald-900">{{
                                                            formatCurrency(formData.amount) }}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-emerald-800">Motif</span>
                                                        <span class="font-medium text-emerald-900">{{
                                                            getReasonTitle(formData.reason) }}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-emerald-800">Méthode de remboursement</span>
                                                        <span class="font-medium text-emerald-900">{{
                                                            selectedOrder?.payment_method }}</span>
                                                    </div>
                                                    <div v-if="formData.details"
                                                        class="pt-3 border-t border-emerald-200/50">
                                                        <span class="text-emerald-800 block mb-1">Détails
                                                            supplémentaires</span>
                                                        <p class="text-sm text-emerald-900">{{ formData.details }}</p>
                                                    </div>
                                                    <div v-if="formData.attachments.length > 0"
                                                        class="pt-3 border-t border-emerald-200/50">
                                                        <span class="text-emerald-800 block mb-1">Pièces jointes</span>
                                                        <p class="text-sm text-emerald-900">{{
                                                            formData.attachments.length }} fichier(s)</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Informations sur le traitement -->
                                            <div
                                                class="p-6 rounded-xl bg-gradient-to-br from-primary-50/50 to-orange-50/50 border border-primary-200/50">
                                                <div class="flex items-start space-x-3">
                                                    <ClockIcon class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 class="font-semibold text-primary-900 mb-1">Délai de
                                                            traitement</h4>
                                                        <p class="text-sm text-primary-800">
                                                            Votre demande sera traitée sous 24-48 heures. Vous recevrez
                                                            une confirmation par email.
                                                            Le remboursement sera effectué sur votre méthode de paiement
                                                            d'origine.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Conditions -->
                                            <div class="mb-6">
                                                <label class="flex items-start space-x-3 cursor-pointer">
                                                    <input v-model="formData.agreeTerms" type="checkbox"
                                                        class="w-5 h-5 rounded border-nature-300 text-primary-600 focus:ring-primary-500 mt-0.5" />
                                                    <span class="text-sm text-nature-700">
                                                        Je confirme avoir lu et accepté la
                                                        <button @click.prevent="viewRefundPolicy"
                                                            class="text-primary-600 hover:text-primary-700 font-medium">
                                                            politique de remboursement
                                                        </button>
                                                        . J'accepte que mon compte soit crédité du montant indiqué.
                                                    </span>
                                                </label>
                                            </div>

                                            <!-- Navigation finale -->
                                            <div class="flex justify-between">
                                                <button @click="prevStep"
                                                    class="px-6 py-3 border border-nature-300 text-nature-700 rounded-xl font-medium hover:bg-nature-50 transition-all duration-300 flex items-center">
                                                    <ArrowLeftIcon class="w-5 h-5 mr-2" />
                                                    Modifier
                                                </button>
                                                <button @click="submitRefundRequest" :disabled="!formData.agreeTerms"
                                                    :class="[
                                                        'px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center',
                                                        formData.agreeTerms
                                                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg'
                                                            : 'bg-nature-200 text-nature-400 cursor-not-allowed'
                                                    ]">
                                                    <PaperAirplaneIcon class="w-5 h-5 mr-2" />
                                                    Soumettre la demande
                                                </button>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>

                                <!-- Pied de page -->
                                <div
                                    class="p-6 border-t border-nature-200/50 bg-gradient-to-r from-nature-50/30 to-white/30">
                                    <div class="flex items-center justify-between text-sm">
                                        <div class="flex items-center text-nature-600">
                                            <ShieldCheckIcon class="w-4 h-4 mr-2" />
                                            <span>Demande sécurisée et confidentielle</span>
                                        </div>
                                        <div class="text-nature-500">
                                            <button @click="contactSupport"
                                                class="hover:text-primary-600 transition-colors duration-300">
                                                Besoin d'aide ?
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <!-- Modal de confirmation -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showConfirmationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-nature-900/40 backdrop-blur-sm" @click="closeConfirmationModal"></div>

                <div
                    class="relative w-full max-w-md bg-gradient-to-br from-white to-emerald-50/90 rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden">
                    <div class="p-8 text-center">
                        <div
                            class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                            <CheckCircleIcon class="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 class="text-2xl font-bold text-emerald-900 mb-3">Demande envoyée !</h3>
                        <p class="text-nature-600 mb-6">
                            Votre demande de remboursement a été soumise avec succès.
                            Notre équide la traitera dans les plus brefs délais.
                        </p>
                        <div class="space-y-4">
                            <button @click="viewRefundStatus"
                                class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                Suivre ma demande
                            </button>
                            <button @click="closeConfirmationModal"
                                class="w-full py-3 rounded-xl border border-nature-300 text-nature-700 font-medium hover:bg-nature-50 transition-all duration-300">
                                Retour aux commandes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
    ClockIcon,
    ShieldCheckIcon,
    PhoneIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ArchiveBoxIcon,
    ShoppingCartIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    PhotoIcon,
    DocumentIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    TruckIcon,
    ExclamationTriangleIcon,
    FaceFrownIcon,
    XCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// État du formulaire
const currentStep = ref(1)
const progress = computed(() => (currentStep.value / 3) * 100)

// Données mockées
const eligibleOrders = ref([
    {
        id: '1',
        order_number: '2024-04567',
        date: '2024-03-15',
        delivery_date: '2024-03-17',
        refund_deadline: '2024-03-31',
        total: 33500,
        items_count: 8,
        payment_method: 'Mobile Money (MTN)',
        items: [
            { id: '1', name: 'Tomates bio' },
            { id: '2', name: 'Avocats' },
            { id: '3', name: 'Carottes' },
            { id: '4', name: 'Bananes plantain' },
            { id: '5', name: 'Oignons' },
            { id: '6', name: 'Pommes de terre' },
            { id: '7', name: 'Salade' },
            { id: '8', name: 'Concombres' }
        ]
    },
    {
        id: '2',
        order_number: '2024-04568',
        date: '2024-03-10',
        delivery_date: '2024-03-12',
        refund_deadline: '2024-03-26',
        total: 18700,
        items_count: 5,
        payment_method: 'Orange Money',
        items: [
            { id: '1', name: 'Mangues' },
            { id: '2', name: 'Ananas' },
            { id: '3', name: 'Papayes' },
            { id: '4', name: 'Citrons' },
            { id: '5', name: 'Gingembre' }
        ]
    }
])

const selectedOrder = ref<any>(null)

const refundAmountOptions = [
    { label: 'Montant total', value: selectedOrder.value?.total || 0 },
    { label: '50%', value: selectedOrder.value?.total ? selectedOrder.value.total * 0.5 : 0 },
    { label: '25%', value: selectedOrder.value?.total ? selectedOrder.value.total * 0.25 : 0 },
    { label: 'Autre montant', value: 0 }
]

const refundReasons = [
    {
        id: 'quality',
        title: 'Problème de qualité',
        description: 'Produits abîmés, pas frais ou de mauvaise qualité',
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600'
    },
    {
        id: 'delivery',
        title: 'Problème de livraison',
        description: 'Commande non livrée, retard ou articles manquants',
        icon: TruckIcon,
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600'
    },
    {
        id: 'mistake',
        title: 'Erreur de commande',
        description: 'Articles différents de la commande ou quantité incorrecte',
        icon: XCircleIcon,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        id: 'other',
        title: 'Autre raison',
        description: 'Autre motif non listé ci-dessus',
        icon: FaceFrownIcon,
        bgColor: 'bg-nature-100',
        iconColor: 'text-nature-600'
    }
]

const previousRefunds = ref([
    {
        id: '1',
        order_id: '2024-04566',
        amount: 12000,
        status: 'completed',
        created_at: '2024-03-05'
    },
    {
        id: '2',
        order_id: '2024-04565',
        amount: 8500,
        status: 'processing',
        created_at: '2024-03-12'
    }
])

// Données du formulaire
const formData = ref({
    amount: 0,
    reason: '',
    details: '',
    attachments: [] as File[],
    agreeTerms: false
})

const customAmount = ref('')
const fileInput = ref<HTMLInputElement>()
const showConfirmationModal = ref(false)

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

const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        processing: 'bg-blue-100 text-blue-800 border border-blue-200',
        completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        rejected: 'bg-red-100 text-red-800 border border-red-200'
    }
    return classes[status] || classes.pending
}

const selectOrder = (order: any) => {
    selectedOrder.value = order
    formData.value.amount = order.total

    // Mettre à jour les options de montant
    refundAmountOptions[0].value = order.total
    refundAmountOptions[1].value = order.total * 0.5
    refundAmountOptions[2].value = order.total * 0.25
}

const selectRefundAmount = (option: any) => {
    if (option.label === 'Autre montant') {
        customAmount.value = ''
        formData.value.amount = 0
    } else {
        formData.value.amount = option.value
        customAmount.value = ''
    }
}

const setCustomAmount = () => {
    const amount = parseFloat(customAmount.value) || 0
    const maxAmount = selectedOrder.value?.total || 0
    formData.value.amount = Math.min(amount, maxAmount)
}

const selectReason = (reason: any) => {
    formData.value.reason = reason.id
}

const getReasonTitle = (reasonId: string) => {
    const reason = refundReasons.find(r => r.id === reasonId)
    return reason?.title || ''
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
        const files = Array.from(input.files)
        // Vérifier la taille des fichiers (max 10MB)
        const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024)
        formData.value.attachments = [...formData.value.attachments, ...validFiles]
    }
    input.value = ''
}

const removeAttachment = (index: number) => {
    formData.value.attachments.splice(index, 1)
}

const nextStep = () => {
    if (currentStep.value < 3) {
        currentStep.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const viewRefundPolicy = () => {
    router.push('/refund-policy')
}

const contactSupport = () => {
    router.push('/support')
}

const viewRefund = (refund: any) => {
    router.push(`/refunds/${refund.id}`)
}

const submitRefundRequest = async () => {
    if (!formData.value.agreeTerms) return

    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500))

    showConfirmationModal.value = true
    currentStep.value = 1
    resetForm()
}

const closeConfirmationModal = () => {
    showConfirmationModal.value = false
    router.push('/orders')
}

const viewRefundStatus = () => {
    closeConfirmationModal()
    router.push('/refunds')
}

const resetForm = () => {
    formData.value = {
        amount: 0,
        reason: '',
        details: '',
        attachments: [],
        agreeTerms: false
    }
    selectedOrder.value = null
    customAmount.value = ''
}
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

/* Animation de scintillement */
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
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
    --color-orange-500: #f97316;
    --color-nature-50: #fafaf9;
    --color-nature-500: #78716c;
    --color-nature-600: #57534e;
    --color-nature-900: #1c1917;
}

</script>
