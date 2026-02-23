<template>
    <Transition appear enter-active-class="transition-all duration-700 custom-bezier"
        enter-from-class="opacity-0 translate-y-8 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-500 custom-bezier" leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95">
        <div :class="[
            'payment-method-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            'border-2 border-transparent hover:border-primary-300/30',
            isDefault ? 'ring-2 ring-primary-400/20' : '',
            getCardBackground(method.type)
        ]" @click="$emit('select', method)">
            <!-- Texture de fond organique -->
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-pattern-organic"></div>

            <!-- Élément décoratif organique -->
            <div class="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-all duration-700"
                :class="getDecorationColor(method.type)"></div>

            <!-- Contenu principal -->
            <div class="relative z-10">
                <!-- En-tête avec logo et actions -->
                <div class="flex items-start justify-between mb-6">
                    <div class="flex items-center space-x-3">
                        <!-- Logo du type de paiement -->
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110"
                            :class="getLogoBackground(method.type)">
                            <component :is="getMethodIcon(method.type)" class="w-6 h-6"
                                :class="getIconColor(method.type)" />
                        </div>

                        <!-- Type et statut -->
                        <div>
                            <h3 class="font-semibold text-lg text-nature-900">
                                {{ getMethodName(method.type) }}
                            </h3>
                            <div class="flex items-center space-x-2 mt-1">
                                <span v-if="isDefault"
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200/50">
                                    <SparklesIcon class="w-3 h-3 mr-1" />
                                    Par défaut
                                </span>
                                <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusStyle(method.status)">
                                    {{ method.status }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Menu d'actions -->
                    <div class="relative">
                        <button @click.stop="toggleActions"
                            class="p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:rotate-90">
                            <EllipsisVerticalIcon class="w-5 h-5 text-nature-600" />
                        </button>

                        <!-- Menu déroulant -->
                        <Transition enter-active-class="transition-all duration-300 custom-bezier"
                            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                            leave-active-class="transition-all duration-200" leave-from-class="opacity-100 scale-100"
                            leave-to-class="opacity-0 scale-95">
                            <div v-if="showActions"
                                class="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl border border-nature-200/50 bg-gradient-to-b from-white to-nature-50/80 backdrop-blur-sm overflow-hidden z-20"
                                v-click-outside="closeActions">
                                <button v-if="!isDefault" @click="setAsDefault"
                                    class="w-full px-4 py-3 text-left hover:bg-primary-50/50 transition-all duration-300 flex items-center text-sm text-nature-700">
                                    <SparklesIcon class="w-4 h-4 mr-3 text-primary-500" />
                                    Définir par défaut
                                </button>
                                <button @click="editMethod"
                                    class="w-full px-4 py-3 text-left hover:bg-primary-50/50 transition-all duration-300 flex items-center text-sm text-nature-700">
                                    <PencilIcon class="w-4 h-4 mr-3 text-nature-500" />
                                    Modifier
                                </button>
                                <div class="border-t border-nature-200/50">
                                    <button @click="deleteMethod"
                                        class="w-full px-4 py-3 text-left hover:bg-red-50/50 transition-all duration-300 flex items-center text-sm text-red-600">
                                        <TrashIcon class="w-4 h-4 mr-3" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- Détails de la méthode -->
                <div class="space-y-4">
                    <!-- Numéro/Identifiant -->
                    <div class="flex items-center">
                        <div class="w-8">
                            <CreditCardIcon v-if="method.type === 'card'" class="w-5 h-5 text-nature-500" />
                            <DevicePhoneMobileIcon v-else-if="method.type.includes('mobile')"
                                class="w-5 h-5 text-nature-500" />
                            <BanknotesIcon v-else class="w-5 h-5 text-nature-500" />
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-nature-600 mb-1">
                                {{ getIdentifierLabel(method.type) }}
                            </p>
                            <p class="font-mono text-lg font-semibold text-nature-900 tracking-wider">
                                {{ getIdentifierValue(method) }}
                            </p>
                        </div>
                    </div>

                    <!-- Informations supplémentaires -->
                    <div v-if="method.expiry_date || method.brand" class="grid grid-cols-2 gap-4">
                        <div v-if="method.brand" class="flex items-center">
                            <div class="w-8">
                                <BuildingLibraryIcon class="w-5 h-5 text-nature-500" />
                            </div>
                            <div>
                                <p class="text-sm text-nature-600">Émetteur</p>
                                <p class="font-medium text-nature-900">{{ method.brand }}</p>
                            </div>
                        </div>
                        <div v-if="method.expiry_date" class="flex items-center">
                            <div class="w-8">
                                <CalendarIcon class="w-5 h-5 text-nature-500" />
                            </div>
                            <div>
                                <p class="text-sm text-nature-600">Expiration</p>
                                <p class="font-medium text-nature-900">{{ formatExpiryDate(method.expiry_date) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tag réseau pour Mobile Money -->
                    <div v-if="method.network" class="inline-block">
                        <span
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100/50 to-emerald-100/50 text-green-800 border border-green-200/50">
                            <SignalIcon class="w-3 h-3 mr-1.5" />
                            {{ getNetworkName(method.network) }}
                        </span>
                    </div>
                </div>

                <!-- Badge d'état en overlay -->
                <div v-if="method.is_expired" class="absolute -top-3 -right-3 rotate-12">
                    <div
                        class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Expiré
                    </div>
                </div>
            </div>

            <!-- Effet de survol - gradient animé -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"
                style="background-size: 200% 100%; animation: shimmer 2s infinite;"></div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    CreditCardIcon,
    DevicePhoneMobileIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    CalendarIcon,
    EllipsisVerticalIcon,
    PencilIcon,
    TrashIcon,
    SparklesIcon,
    SignalIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Props
interface PaymentMethod {
    id: string
    type: 'card' | 'mtn_mobile_money' | 'orange_money' | 'express_union' | 'cash' | 'wallet'
    last4?: string
    phone_number?: string
    brand?: string
    expiry_date?: string
    is_default: boolean
    status: 'active' | 'expired' | 'pending'
    network?: 'mtn' | 'orange' | 'express_union'
    metadata?: Record<string, any>
}

const props = defineProps<{
    method: PaymentMethod
}>()

const emit = defineEmits<{
    select: [method: PaymentMethod]
    edit: [methodId: string]
    delete: [methodId: string]
    setDefault: [methodId: string]
}>()

// State
const showActions = ref(false)

// Computed
const isDefault = computed(() => props.method.is_default)

// Méthodes
const getCardBackground = (type: string) => {
    const gradients = {
        card: 'bg-gradient-to-br from-blue-50/60 via-white to-emerald-50/40 border-blue-200/30',
        mtn_mobile_money: 'bg-gradient-to-br from-yellow-50/70 via-white to-orange-50/40 border-yellow-200/30',
        orange_money: 'bg-gradient-to-br from-orange-50/70 via-white to-red-50/40 border-orange-200/30',
        express_union: 'bg-gradient-to-br from-purple-50/70 via-white to-blue-50/40 border-purple-200/30',
        cash: 'bg-gradient-to-br from-green-50/70 via-white to-emerald-50/40 border-green-200/30',
        wallet: 'bg-gradient-to-br from-primary-50/70 via-white to-teal-50/40 border-primary-200/30'
    }
    return gradients[type as keyof typeof gradients] || gradients.card
}

const getDecorationColor = (type: string) => {
    const colors = {
        card: 'bg-blue-300',
        mtn_mobile_money: 'bg-yellow-300',
        orange_money: 'bg-orange-300',
        express_union: 'bg-purple-300',
        cash: 'bg-green-300',
        wallet: 'bg-primary-300'
    }
    return colors[type as keyof typeof colors] || colors.card
}

const getLogoBackground = (type: string) => {
    const backgrounds = {
        card: 'bg-gradient-to-br from-blue-100 to-blue-200',
        mtn_mobile_money: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
        orange_money: 'bg-gradient-to-br from-orange-100 to-orange-200',
        express_union: 'bg-gradient-to-br from-purple-100 to-purple-200',
        cash: 'bg-gradient-to-br from-green-100 to-green-200',
        wallet: 'bg-gradient-to-br from-primary-100 to-primary-200'
    }
    return backgrounds[type as keyof typeof backgrounds] || backgrounds.card
}

const getIconColor = (type: string) => {
    const colors = {
        card: 'text-blue-600',
        mtn_mobile_money: 'text-yellow-600',
        orange_money: 'text-orange-600',
        express_union: 'text-purple-600',
        cash: 'text-green-600',
        wallet: 'text-primary-600'
    }
    return colors[type as keyof typeof colors] || colors.card
}

const getMethodIcon = (type: string) => {
    const icons = {
        card: CreditCardIcon,
        mtn_mobile_money: DevicePhoneMobileIcon,
        orange_money: DevicePhoneMobileIcon,
        express_union: DevicePhoneMobileIcon,
        cash: BanknotesIcon,
        wallet: CreditCardIcon
    }
    return icons[type as keyof typeof icons] || CreditCardIcon
}

const getMethodName = (type: string) => {
    const names = {
        card: 'Carte bancaire',
        mtn_mobile_money: 'MTN Mobile Money',
        orange_money: 'Orange Money',
        express_union: 'Express Union',
        cash: 'Espèces',
        wallet: 'Porte-monnaie'
    }
    return names[type as keyof typeof names] || 'Méthode de paiement'
}

const getIdentifierLabel = (type: string) => {
    const labels = {
        card: 'Numéro de carte',
        mtn_mobile_money: 'Numéro de téléphone',
        orange_money: 'Numéro de téléphone',
        express_union: 'Numéro de compte',
        cash: 'Méthode',
        wallet: 'Solde'
    }
    return labels[type as keyof typeof labels] || 'Identifiant'
}

const getIdentifierValue = (method: PaymentMethod) => {
    if (method.type === 'card' && method.last4) {
        return `**** **** **** ${method.last4}`
    }
    if ((method.type === 'mtn_mobile_money' || method.type === 'orange_money') && method.phone_number) {
        return formatPhoneNumber(method.phone_number)
    }
    if (method.type === 'cash') {
        return 'Paiement en espèces'
    }
    return '•••• •••• ••••'
}

const getNetworkName = (network: string) => {
    const networks = {
        mtn: 'MTN Cameroon',
        orange: 'Orange Cameroun',
        express_union: 'Express Union'
    }
    return networks[network as keyof typeof networks] || network
}

const getStatusStyle = (status: string) => {
    const styles = {
        active: 'bg-green-100 text-green-800 border border-green-200/50',
        expired: 'bg-red-100 text-red-800 border border-red-200/50',
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200/50'
    }
    return styles[status as keyof typeof styles] || styles.active
}

const formatPhoneNumber = (phone: string) => {
    // Format camerounais : +237 6xx xxx xxx
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('237')) {
        const rest = cleaned.substring(3)
        return `+237 ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`
    }
    return phone
}

const formatExpiryDate = (date: string) => {
    // Format MM/YY
    return date
}

const toggleActions = () => {
    showActions.value = !showActions.value
}

const closeActions = () => {
    showActions.value = false
}

const editMethod = () => {
    emit('edit', props.method.id)
    closeActions()
}

const deleteMethod = () => {
    emit('delete', props.method.id)
    closeActions()
}

const setAsDefault = () => {
    emit('setDefault', props.method.id)
    closeActions()
}
</script>

<style scoped>
/* Background pattern */
.bg-pattern-organic {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300a896' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Courbe de bézier personnalisée pour fluidité organique */
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

/* Effet de relief organique */
.payment-method-card {
    box-shadow:
        0 4px 20px -2px rgba(0, 168, 150, 0.1),
        0 2px 8px -1px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.payment-method-card:hover {
    transform: translateY(-4px);
    box-shadow:
        0 12px 32px -4px rgba(0, 168, 150, 0.15),
        0 4px 16px -2px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Style pour le v-click-outside (directive personnalisée) */
</style>