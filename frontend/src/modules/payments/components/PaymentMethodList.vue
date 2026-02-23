<template>
    <div class="payment-methods-page min-h-screen relative overflow-hidden">
        <!-- Animation de fond organique -->
        <div class="absolute inset-0 overflow-hidden">
            <!-- Dégradé principal -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-white to-nature-50/40"></div>

            <!-- Texture filigrane organique -->
            <div class="absolute inset-0 opacity-[0.03] bg-pattern-filigree"></div>

            <!-- Éléments décoratifs flottants -->
            <div class="absolute top-1/4 left-10 w-32 h-32 leaf-float">
                <div class="w-full h-full bg-primary-200/10 rounded-full blur-xl"></div>
            </div>
            <div class="absolute bottom-1/4 right-10 w-40 h-40 leaf-float" style="animation-delay: 2s;">
                <div class="w-full h-full bg-nature-300/10 rounded-full blur-xl"></div>
            </div>
        </div>

        <div class="relative z-10 container mx-auto px-4 py-8">
            <!-- En-tête avec animation d'entrée -->
            <Transition appear enter-active-class="transition-all duration-1000 custom-bezier"
                enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0">
                <div class="mb-10">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h1 class="text-4xl font-bold text-nature-900 mb-3">
                                <span
                                    class="bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                                    Mes Moyens de Paiement
                                </span>
                            </h1>
                            <p class="text-nature-600 text-lg max-w-2xl">
                                Gérez vos moyens de paiement préférés pour des transactions rapides et sécurisées.
                                Ajoutez vos cartes ou comptes Mobile Money pour une expérience fluide.
                            </p>
                        </div>

                        <!-- Bouton ajouter méthode -->
                        <button @click="showAddMethodModal = true"
                            class="group relative overflow-hidden px-6 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-500 custom-bezier hover:shadow-xl hover:scale-105"
                            style="background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-nature-500) 100%);">
                            <!-- Effet de brillance au survol -->
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"
                                style="background-size: 200% 100%; animation: shimmer 2s infinite;"></div>

                            <div class="relative flex items-center space-x-3">
                                <PlusCircleIcon class="w-6 h-6" />
                                <span>Ajouter un moyen de paiement</span>
                            </div>
                        </button>
                    </div>

                    <!-- Indicateur visuel -->
                    <div
                        class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100/50 to-nature-100/50 border border-primary-200/30">
                        <ShieldCheckIcon class="w-5 h-5 text-primary-600 mr-2" />
                        <span class="text-sm text-nature-700">Toutes vos informations de paiement sont sécurisées et
                            chiffrées</span>
                    </div>
                </div>
            </Transition>

            <!-- Contenu principal -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Liste des méthodes -->
                <div class="lg:col-span-2">
                    <!-- État chargement -->
                    <Transition enter-active-class="transition-all duration-500 custom-bezier"
                        enter-from-class="opacity-0" enter-to-class="opacity-100"
                        leave-active-class="transition-all duration-300" leave-from-class="opacity-100"
                        leave-to-class="opacity-0">
                        <div v-if="loading" class="space-y-6">
                            <div v-for="i in 3" :key="i"
                                class="h-40 bg-gradient-to-r from-white to-nature-50/50 rounded-2xl animate-pulse border border-nature-200/30">
                            </div>
                        </div>
                    </Transition>

                    <!-- État vide -->
                    <Transition appear enter-active-class="transition-all duration-700 custom-bezier"
                        enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100">
                        <div v-if="!loading && paymentMethods.length === 0"
                            class="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-primary-200/50 bg-gradient-to-b from-white/60 to-primary-50/20 backdrop-blur-sm">
                            <div class="max-w-md mx-auto">
                                <div
                                    class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                                    <CreditCardIcon class="w-12 h-12 text-primary-400" />
                                </div>
                                <h3 class="text-2xl font-semibold text-nature-800 mb-3">
                                    Aucun moyen de paiement
                                </h3>
                                <p class="text-nature-600 mb-8">
                                    Ajoutez votre première méthode de paiement pour des achats rapides et sécurisés.
                                    Nous acceptons les cartes bancaires et les paiements Mobile Money.
                                </p>
                                <button @click="showAddMethodModal = true"
                                    class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                    Ajouter mon premier moyen de paiement
                                </button>
                            </div>
                        </div>
                    </Transition>

                    <!-- Liste avec transitions -->
                    <div v-if="!loading && paymentMethods.length > 0" class="space-y-6">
                        <!-- Méthode par défaut -->
                        <div class="mb-8">
                            <div class="flex items-center mb-4">
                                <div
                                    class="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-nature-500 rounded-full mr-3">
                                </div>
                                <h2 class="text-xl font-semibold text-nature-800">
                                    Moyen de paiement principal
                                </h2>
                            </div>

                            <TransitionGroup tag="div" name="list"
                                enter-active-class="transition-all duration-500 custom-bezier"
                                enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0"
                                leave-active-class="transition-all duration-300 absolute" leave-from-class="opacity-100"
                                leave-to-class="opacity-0 scale-95"
                                move-class="transition-all duration-500 custom-bezier">
                                <PaymentMethodCard v-for="method in defaultMethods" :key="method.id" :method="method"
                                    @select="selectMethod" @edit="editMethod" @delete="deleteMethod"
                                    @setDefault="setDefaultMethod" class="list-item" />
                            </TransitionGroup>
                        </div>

                        <!-- Autres méthodes -->
                        <div v-if="otherMethods.length > 0">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center">
                                    <div
                                        class="w-1.5 h-6 bg-gradient-to-b from-nature-400 to-nature-300 rounded-full mr-3">
                                    </div>
                                    <h2 class="text-xl font-semibold text-nature-800">
                                        Autres moyens de paiement
                                    </h2>
                                </div>
                                <span class="text-nature-500 text-sm">
                                    {{ otherMethods.length }} méthode{{ otherMethods.length > 1 ? 's' : '' }}
                                </span>
                            </div>

                            <TransitionGroup tag="div" name="list"
                                enter-active-class="transition-all duration-500 custom-bezier"
                                enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0"
                                leave-active-class="transition-all duration-300 absolute" leave-from-class="opacity-100"
                                leave-to-class="opacity-0 scale-95"
                                move-class="transition-all duration-500 custom-bezier" class="relative space-y-6">
                                <PaymentMethodCard v-for="method in otherMethods" :key="method.id" :method="method"
                                    @select="selectMethod" @edit="editMethod" @delete="deleteMethod"
                                    @setDefault="setDefaultMethod" class="list-item" />
                            </TransitionGroup>
                        </div>
                    </div>
                </div>

                <!-- Panneau latéral informatif -->
                <Transition appear enter-active-class="transition-all duration-700 custom-bezier delay-300"
                    enter-from-class="opacity-0 translate-x-10" enter-to-class="opacity-100 translate-x-0">
                    <div class="lg:col-span-1">
                        <div class="sticky top-8 space-y-6">
                            <!-- Cartouches d'information -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/80 to-primary-50/30 border border-primary-200/30 backdrop-blur-sm">
                                <h3 class="font-semibold text-nature-800 mb-4 flex items-center">
                                    <InformationCircleIcon class="w-5 h-5 text-primary-500 mr-2" />
                                    Paiements au Cameroun
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex items-start space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                            <DevicePhoneMobileIcon class="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p class="font-medium text-nature-800">Mobile Money</p>
                                            <p class="text-sm text-nature-600">MTN & Orange Money acceptés avec sécurité
                                                optimale</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <CreditCardIcon class="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p class="font-medium text-nature-800">Cartes bancaires</p>
                                            <p class="text-sm text-nature-600">Visa, Mastercard et cartes locales
                                                acceptées</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheckIcon class="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p class="font-medium text-nature-800">Sécurité</p>
                                            <p class="text-sm text-nature-600">Certifié PCI-DSS - Aucune donnée bancaire
                                                stockée</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Statistiques -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/80 to-nature-50/30 border border-nature-200/30 backdrop-blur-sm">
                                <h3 class="font-semibold text-nature-800 mb-4 flex items-center">
                                    <ChartBarIcon class="w-5 h-5 text-nature-500 mr-2" />
                                    Vos statistiques
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex justify-between items-center">
                                        <span class="text-nature-600">Méthodes actives</span>
                                        <span class="font-bold text-nature-900">{{ paymentMethods.length }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-nature-600">Dernier ajout</span>
                                        <span class="font-medium text-nature-900">{{ lastAddedMethod || '--' }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-nature-600">Paiements réussis</span>
                                        <span class="font-bold text-primary-600">{{ successfulPayments }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Conseil du jour -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/80 to-emerald-50/30 border border-emerald-200/30 backdrop-blur-sm">
                                <h3 class="font-semibold text-nature-800 mb-3 flex items-center">
                                    <LightBulbIcon class="w-5 h-5 text-emerald-500 mr-2" />
                                    Conseil du jour
                                </h3>
                                <p class="text-sm text-nature-600 mb-4">
                                    Utilisez Mobile Money pour des transactions instantanées sans frais supplémentaires.
                                    Idéal pour les achats récurrents.
                                </p>
                                <div class="flex items-center text-emerald-600 text-sm">
                                    <ArrowPathIcon class="w-4 h-4 mr-1" />
                                    <span>Actualisé quotidiennement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Modal d'ajout -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <AddPaymentMethodModal v-if="showAddMethodModal" @close="showAddMethodModal = false"
                @added="handleMethodAdded" />
        </Transition>

        <!-- Toast notifications -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier"
            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="toast.show" :class="[
                'fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl max-w-sm backdrop-blur-sm border',
                toast.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-50/90 to-green-50/90 border-emerald-200/50'
                    : 'bg-gradient-to-r from-red-50/90 to-orange-50/90 border-red-200/50'
            ]">
                <div class="flex items-center space-x-3">
                    <CheckCircleIcon v-if="toast.type === 'success'" class="w-6 h-6 text-emerald-600" />
                    <XCircleIcon v-else class="w-6 h-6 text-red-600" />
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
import PaymentMethodCard from './PaymentMethodCard.vue'
import AddPaymentMethodModal from './AddPaymentMethodModal.vue'
import {
    PlusCircleIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    InformationCircleIcon,
    ChartBarIcon,
    LightBulbIcon,
    ArrowPathIcon,
    DevicePhoneMobileIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/vue/24/outline'
import type { PaymentMethod } from '@/modules/payments/types/payment.types'

// Données mockées pour la démonstration
const loading = ref(true)
const paymentMethods = ref<PaymentMethod[]>([
    {
        id: '1',
        type: 'mtn_mobile_money',
        phone_number: '237699887766',
        is_default: true,
        status: 'active',
        network: 'mtn',
        brand: 'MTN Cameroon'
    },
    {
        id: '2',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiry_date: '12/25',
        is_default: false,
        status: 'active'
    },
    {
        id: '3',
        type: 'orange_money',
        phone_number: '237655443322',
        is_default: false,
        status: 'active',
        network: 'orange',
        brand: 'Orange Cameroun'
    }
])

const showAddMethodModal = ref(false)
const successfulPayments = ref(42)

// Toast notification
const toast = ref({
    show: false,
    type: 'success' as 'success' | 'error',
    message: '',
    details: ''
})

// Computed
const defaultMethods = computed(() =>
    paymentMethods.value.filter(m => m.is_default)
)

const otherMethods = computed(() =>
    paymentMethods.value.filter(m => !m.is_default)
)

const lastAddedMethod = computed(() => {
    if (paymentMethods.value.length === 0) return null
    const last = paymentMethods.value[paymentMethods.value.length - 1]
    return getMethodName(last.type)
})

// Lifecycle
onMounted(async () => {
    // Simuler le chargement
    setTimeout(() => {
        loading.value = false
    }, 800)
})

// Méthodes
const getMethodName = (type: string) => {
    const names: Record<string, string> = {
        card: 'Carte bancaire',
        mtn_mobile_money: 'MTN Mobile Money',
        orange_money: 'Orange Money',
        express_union: 'Express Union',
        cash: 'Espèces',
        wallet: 'Porte-monnaie'
    }
    return names[type] || 'Méthode de paiement'
}

const selectMethod = (method: PaymentMethod) => {
    console.log('Méthode sélectionnée:', method)
    // Navigation vers les détails ou pré-remplissage pour paiement
}

const editMethod = (methodId: string) => {
    const method = paymentMethods.value.find(m => m.id === methodId)
    if (method) {
        showToast('Modification', `Ouverture de l'édition pour ${getMethodName(method.type)}`, 'success')
    }
}

const deleteMethod = async (methodId: string) => {
    const method = paymentMethods.value.find(m => m.id === methodId)
    if (!method) return

    // Demande de confirmation avec animation
    if (confirm(`Supprimer ${getMethodName(method.type)} ?`)) {
        const index = paymentMethods.value.findIndex(m => m.id === methodId)
        if (index > -1) {
            paymentMethods.value.splice(index, 1)
            showToast(
                'Supprimé',
                `${getMethodName(method.type)} a été supprimé de vos méthodes de paiement`,
                'success'
            )
        }
    }
}

const setDefaultMethod = async (methodId: string) => {
    // Retirer le statut par défaut de toutes les méthodes
    paymentMethods.value.forEach(method => {
        method.is_default = method.id === methodId
    })

    const method = paymentMethods.value.find(m => m.id === methodId)
    if (method) {
        showToast(
            'Défini par défaut',
            `${getMethodName(method.type)} est maintenant votre méthode de paiement principale`,
            'success'
        )
    }
}

const handleMethodAdded = (newMethod: PaymentMethod) => {
    paymentMethods.value.push(newMethod)
    showAddMethodModal.value = false

    showToast(
        'Ajouté',
        `${getMethodName(newMethod.type)} a été ajouté à vos méthodes de paiement`,
        'success'
    )
}

const showToast = (title: string, details: string, type: 'success' | 'error') => {
    toast.value = {
        show: true,
        type,
        message: title,
        details
    }

    // Auto-hide après 5 secondes
    setTimeout(() => {
        toast.value.show = false
    }, 5000)
}
</script>

<style scoped>
/* Background pattern */
.bg-pattern-filigree {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a896' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-size: 60px 60px;
}

/* Animation de la liste */
.list-move {
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

.list-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.list-leave-active {
    position: absolute;
    width: 100%;
}

/* Courbe de bézier personnalisée */
.custom-bezier {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation de feuilles flottantes */
@keyframes float-leaf {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

.leaf-float {
    animation: float-leaf 15s ease-in-out infinite;
}

/* Animation de brillance */
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

/* Variables CSS pour les couleurs */
:root {
    --color-primary-50: #f0f9ff;
    --color-primary-500: #0ea5e9;
    --color-nature-50: #fafaf9;
    --color-nature-500: #78716c;
    --color-nature-800: #292524;
}
</style>