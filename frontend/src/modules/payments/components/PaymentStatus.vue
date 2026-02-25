<template>
    <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
        enter-from-class="opacity-0 scale-95 translate-y-8" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div class="payment-status-container">
            <!-- Carte principale -->
            <div class="payment-status-card relative overflow-hidden rounded-2xl border backdrop-blur-sm"
                :class="getCardClass(status)">
                <!-- Texture de fond organique -->
                <div class="absolute inset-0 opacity-[0.03] pointer-events-none" :style="{
                    backgroundImage: `url('data:image/svg+xml,${getBackgroundPattern(status)}')`
                }"></div>

                <!-- Éléments décoratifs animés -->
                <div class="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-10"
                    :class="getDecorationColor(status)"></div>
                <div class="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-10 leaf-float"
                    :class="getDecorationColor(status)" style="animation-delay: 2s;"></div>

                <!-- Contenu -->
                <div class="relative z-10 p-8">
                    <!-- En-tête avec statut -->
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div class="flex items-center space-x-4 mb-4 lg:mb-0">
                            <!-- Icône animée -->
                            <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110"
                                :class="getIconBackground(status)">
                                <component :is="getStatusIcon(status)" class="w-8 h-8" :class="getIconColor(status)" />

                                <!-- Animation de pulsation pour pending -->
                                <div v-if="status === 'pending'"
                                    class="absolute inset-0 rounded-2xl animate-ping opacity-20"
                                    :class="getIconBackground(status)"></div>
                            </div>

                            <div>
                                <h2 class="text-2xl font-bold" :class="getTitleColor(status)">
                                    {{ getStatusTitle(status) }}
                                </h2>
                                <p class="text-nature-600 mt-1">
                                    {{ getStatusDescription(status) }}
                                </p>
                            </div>
                        </div>

                        <!-- Badge de statut -->
                        <div class="inline-flex items-center px-4 py-2 rounded-full border"
                            :class="getBadgeClass(status)">
                            <span class="w-2 h-2 rounded-full mr-2 animate-pulse" :class="getPulseColor(status)"></span>
                            <span class="text-sm font-medium" :class="getBadgeTextColor(status)">
                                {{ formatStatus(status) }}
                            </span>
                        </div>
                    </div>

                    <!-- Barre de progression pour pending -->
                    <Transition v-if="status === 'pending'"
                        enter-active-class="transition-all duration-500 custom-bezier" enter-from-class="opacity-0"
                        enter-to-class="opacity-100">
                        <div class="mb-8">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-nature-700">Progression</span>
                                <span class="text-sm font-bold" :class="getTitleColor(status)">
                                    {{ progress }}%
                                </span>
                            </div>
                            <div class="h-3 bg-nature-200/50 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-1000 custom-bezier"
                                    :class="getProgressBarColor(status)" :style="{ width: `${progress}%` }"></div>
                            </div>
                            <p class="text-xs text-nature-500 mt-2">
                                {{ getProgressMessage(progress) }}
                            </p>
                        </div>
                    </Transition>

                    <!-- Timeline des étapes -->
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-nature-800 mb-6 flex items-center">
                            <ClockIcon class="w-5 h-5 mr-2" :class="getTitleColor(status)" />
                            Suivi du paiement
                        </h3>

                        <div class="relative">
                            <!-- Ligne de connexion -->
                            <div class="absolute left-6 top-0 bottom-0 w-0.5"
                                :class="status === 'completed' ? 'bg-emerald-200' : 'bg-nature-200'">
                                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current"
                                    v-for="step in timelineSteps" :key="step.id" :style="{ top: `${step.position}%` }">
                                </div>
                            </div>

                            <!-- Étapes -->
                            <div class="space-y-8">
                                <div v-for="(step, index) in filteredTimeline" :key="step.id" class="relative pl-16">
                                    <Transition appear
                                        :enter-active-class="`transition-all duration-500 custom-bezier delay-${index * 200}`"
                                        :enter-from-class="'opacity-0 translate-x-8'"
                                        :enter-to-class="'opacity-100 translate-x-0'">
                                        <div>
                                            <!-- Marqueur d'étape -->
                                            <div class="absolute left-6 transform -translate-x-1/2">
                                                <div class="w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500"
                                                    :class="getTimelineStepClass(step, index)">
                                                    <component :is="step.icon" class="w-5 h-5"
                                                        :class="getTimelineIconColor(step, index)" />
                                                </div>
                                            </div>

                                            <!-- Contenu de l'étape -->
                                            <div class="pb-4">
                                                <div class="flex items-center justify-between mb-2">
                                                    <h4 class="font-semibold text-nature-900">{{ step.title }}</h4>
                                                    <span class="text-sm text-nature-500">{{ step.time }}</span>
                                                </div>
                                                <p class="text-sm text-nature-600 mb-2">{{ step.description }}</p>
                                                <div v-if="step.details"
                                                    class="flex items-center text-xs text-nature-500">
                                                    <InformationCircleIcon class="w-4 h-4 mr-1" />
                                                    {{ step.details }}
                                                </div>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Détails du paiement -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <!-- Montant et devise -->
                        <div
                            class="p-5 rounded-xl bg-gradient-to-br from-white to-nature-50/30 border border-nature-200/30">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-nature-700">Montant</span>
                                <span class="text-2xl font-bold" :class="getTitleColor(status)">
                                    {{ formatCurrency(amount) }}
                                </span>
                            </div>
                            <div class="flex items-center text-sm text-nature-600">
                                <CurrencyDollarIcon class="w-4 h-4 mr-2" />
                                {{ currency }} • {{ paymentMethod }}
                            </div>
                        </div>

                        <!-- Informations transaction -->
                        <div
                            class="p-5 rounded-xl bg-gradient-to-br from-white to-primary-50/30 border border-primary-200/30">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-nature-700">Transaction</span>
                                <span class="font-mono font-bold text-nature-900">{{ transactionId }}</span>
                            </div>
                            <div class="flex items-center text-sm text-nature-600">
                                <CalendarIcon class="w-4 h-4 mr-2" />
                                {{ formatDate(createdAt) }}
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <TransitionGroup tag="div" name="actions" class="flex flex-wrap gap-4">
                        <!-- Action principale -->
                        <button v-if="status === 'pending'" key="pending-action" @click="refreshStatus"
                            class="group relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-500 hover:scale-105"
                            :class="getPrimaryButtonClass(status)">
                            <div class="relative flex items-center">
                                <ArrowPathIcon class="w-5 h-5 mr-2 animate-spin" />
                                Actualiser le statut
                            </div>
                        </button>

                        <button v-if="status === 'completed'" key="completed-action" @click="viewInvoice"
                            class="group relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-500 hover:scale-105"
                            :class="getPrimaryButtonClass(status)">
                            <div class="relative flex items-center">
                                <DocumentTextIcon class="w-5 h-5 mr-2" />
                                Voir la facture
                            </div>
                        </button>

                        <button v-if="status === 'failed'" key="failed-action" @click="retryPayment"
                            class="group relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-500 hover:scale-105"
                            :class="getPrimaryButtonClass(status)">
                            <div class="relative flex items-center">
                                <ArrowPathIcon class="w-5 h-5 mr-2" />
                                Réessayer le paiement
                            </div>
                        </button>

                        <!-- Action secondaire -->
                        <button v-if="showSecondaryAction" key="secondary-action" @click="secondaryAction"
                            class="px-6 py-3 rounded-xl border font-medium transition-all duration-300 hover:bg-nature-50"
                            :class="getSecondaryButtonClass(status)">
                            <div class="flex items-center">
                                <ArrowLeftIcon class="w-5 h-5 mr-2" />
                                Retour aux commandes
                            </div>
                        </button>

                        <!-- Action tertiaire -->
                        <button v-if="showTertiaryAction" key="tertiary-action" @click="contactSupport"
                            class="px-6 py-3 rounded-xl border font-medium transition-all duration-300 hover:bg-nature-50"
                            :class="getTertiaryButtonClass(status)">
                            <div class="flex items-center">
                                <PhoneIcon class="w-5 h-5 mr-2" />
                                Contacter le support
                            </div>
                        </button>
                    </TransitionGroup>

                    <!-- Message de réassurance -->
                    <Transition enter-active-class="transition-all duration-500 custom-bezier"
                        enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
                        <div v-if="showReassurance" class="mt-8 p-4 rounded-xl border"
                            :class="getReassuranceClass(status)">
                            <div class="flex items-start space-x-3">
                                <ShieldCheckIcon class="w-5 h-5 flex-shrink-0 mt-0.5"
                                    :class="getReassuranceIconColor(status)" />
                                <div>
                                    <p class="text-sm font-medium" :class="getReassuranceTextColor(status)">
                                        {{ getReassuranceMessage(status) }}
                                    </p>
                                    <p class="text-xs mt-1" :class="getReassuranceSubtextColor(status)">
                                        {{ getReassuranceSubtext(status) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Effet de survol -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                    style="background-size: 200% 100%; animation: shimmer 3s infinite;"></div>
            </div>

            <!-- Notification de statut -->
            <Transition enter-active-class="transition-all duration-500 custom-bezier"
                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="showNotification" class="mt-6 p-4 rounded-xl border backdrop-blur-sm"
                    :class="getNotificationClass(status)">
                    <div class="flex items-center space-x-3">
                        <component :is="getNotificationIcon(status)" class="w-5 h-5 flex-shrink-0"
                            :class="getNotificationIconColor(status)" />
                        <div class="flex-1">
                            <p class="text-sm font-medium" :class="getNotificationTextColor(status)">
                                {{ notificationMessage }}
                            </p>
                            <p v-if="notificationSubtext" class="text-xs mt-1"
                                :class="getNotificationSubtextColor(status)">
                                {{ notificationSubtext }}
                            </p>
                        </div>
                        <button @click="showNotification = false" class="text-nature-400 hover:text-nature-600">
                            <XMarkIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    ArrowLeftIcon,
    PhoneIcon,
    ShieldCheckIcon,
    InformationCircleIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    ArrowRightCircleIcon,
    LockClosedIcon,
    BanknotesIcon,
    TruckIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'

// Props
interface Props {
    status: 'pending' | 'completed' | 'failed' | 'refunded'
    amount: number
    currency?: string
    transactionId: string
    paymentMethod: string
    createdAt: string
    orderId?: string
    showActions?: boolean
    autoRefresh?: boolean
    refreshInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
    currency: 'XAF',
    showActions: true,
    autoRefresh: true,
    refreshInterval: 10000 // 10 secondes
})

// Emits
const emit = defineEmits<{
    refresh: []
    retry: []
    viewInvoice: []
    contactSupport: []
    secondaryAction: []
}>()

// State
const progress = ref(0)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationSubtext = ref('')
const isRefreshing = ref(false)
const refreshTimer = ref<NodeJS.Timeout | null>(null)

// Computed
const showSecondaryAction = computed(() => props.showActions)
const showTertiaryAction = computed(() => props.status === 'failed' || props.status === 'pending')
const showReassurance = computed(() => true)

const timelineSteps = computed(() => [
    {
        id: 1,
        title: 'Commande reçue',
        description: 'Votre commande a été créée avec succès',
        icon: DocumentTextIcon,
        time: formatTimeAgo(props.createdAt),
        status: 'completed',
        position: 0,
        details: `N° de commande: ${props.orderId || 'CMD-XXXXXX'}`
    },
    {
        id: 2,
        title: 'Paiement initié',
        description: 'Traitement du paiement en cours',
        icon: LockClosedIcon,
        time: 'Juste maintenant',
        status: props.status === 'pending' ? 'current' : 'completed',
        position: 25,
        details: `Méthode: ${props.paymentMethod}`
    },
    {
        id: 3,
        title: 'Validation',
        description: 'Vérification des informations de paiement',
        icon: ShieldCheckIcon,
        time: props.status === 'pending' ? 'En cours...' : formatTimeAgo(new Date().toISOString()),
        status: getTimelineStepStatus(2),
        position: 50,
        details: 'Sécurisé par notre système'
    },
    {
        id: 4,
        title: 'Confirmation',
        description: 'Finalisation de la transaction',
        icon: CheckCircleIcon,
        time: props.status === 'completed' ? 'Terminé' : 'En attente',
        status: getTimelineStepStatus(3),
        position: 75,
        details: props.status === 'completed' ? 'Transaction confirmée' : 'En attente de validation'
    },
    {
        id: 5,
        title: 'Livraison',
        description: 'Préparation de votre commande',
        icon: TruckIcon,
        time: 'À venir',
        status: 'pending',
        position: 100,
        details: 'Livraison estimée: 24-48h'
    }
])

const filteredTimeline = computed(() => {
    return timelineSteps.value.filter(step =>
        step.status !== 'pending' || props.status === 'pending'
    )
})

// Méthodes
const getBackgroundPattern = (status: string) => {
    const colors = {
        pending: '00a896',
        completed: '10b981',
        failed: 'ef4444',
        refunded: '8b5cf6'
    }
    const color = colors[status as keyof typeof colors] || '00a896'

    return encodeURIComponent(`
    <svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'>
      <g fill='none' fill-rule='evenodd'>
        <g fill='#${color}' fill-opacity='0.1'>
          <path d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/>
        </g>
      </g>
    </svg>
  `)
}

const getCardClass = (status: string) => {
    const classes = {
        pending: 'border-primary-200/50 bg-gradient-to-br from-primary-50/30 via-white to-yellow-50/20',
        completed: 'border-emerald-200/50 bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20',
        failed: 'border-red-200/50 bg-gradient-to-br from-red-50/30 via-white to-orange-50/20',
        refunded: 'border-purple-200/50 bg-gradient-to-br from-purple-50/30 via-white to-violet-50/20'
    }
    return classes[status as keyof typeof classes] || classes.pending
}

const getDecorationColor = (status: string) => {
    const colors = {
        pending: 'bg-primary-300',
        completed: 'bg-emerald-300',
        failed: 'bg-red-300',
        refunded: 'bg-purple-300'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getIconBackground = (status: string) => {
    const backgrounds = {
        pending: 'bg-gradient-to-br from-primary-100 to-primary-200',
        completed: 'bg-gradient-to-br from-emerald-100 to-green-200',
        failed: 'bg-gradient-to-br from-red-100 to-orange-200',
        refunded: 'bg-gradient-to-br from-purple-100 to-violet-200'
    }
    return backgrounds[status as keyof typeof backgrounds] || backgrounds.pending
}

const getIconColor = (status: string) => {
    const colors = {
        pending: 'text-primary-600',
        completed: 'text-emerald-600',
        failed: 'text-red-600',
        refunded: 'text-purple-600'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getStatusIcon = (status: string) => {
    const icons = {
        pending: ClockIcon,
        completed: CheckCircleIcon,
        failed: XCircleIcon,
        refunded: ArrowPathIcon
    }
    return icons[status as keyof typeof icons] || ClockIcon
}

const getStatusTitle = (status: string) => {
    const titles = {
        pending: 'Paiement en cours',
        completed: 'Paiement confirmé !',
        failed: 'Paiement échoué',
        refunded: 'Remboursement effectué'
    }
    return titles[status as keyof typeof titles] || titles.pending
}

const getStatusDescription = (status: string) => {
    const descriptions = {
        pending: 'Votre paiement est en cours de traitement. Cela peut prendre quelques instants.',
        completed: 'Votre paiement a été traité avec succès. Votre commande est confirmée !',
        failed: 'Une erreur est survenue lors du traitement de votre paiement.',
        refunded: 'Votre paiement a été remboursé. Le montant sera crédité sous 3-5 jours ouvrés.'
    }
    return descriptions[status as keyof typeof descriptions] || descriptions.pending
}

const getTitleColor = (status: string) => {
    const colors = {
        pending: 'text-primary-900',
        completed: 'text-emerald-900',
        failed: 'text-red-900',
        refunded: 'text-purple-900'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getBadgeClass = (status: string) => {
    const classes = {
        pending: 'border-primary-200 bg-primary-100/50',
        completed: 'border-emerald-200 bg-emerald-100/50',
        failed: 'border-red-200 bg-red-100/50',
        refunded: 'border-purple-200 bg-purple-100/50'
    }
    return classes[status as keyof typeof colors] || classes.pending
}

const getBadgeTextColor = (status: string) => {
    const colors = {
        pending: 'text-primary-800',
        completed: 'text-emerald-800',
        failed: 'text-red-800',
        refunded: 'text-purple-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getPulseColor = (status: string) => {
    const colors = {
        pending: 'bg-primary-500',
        completed: 'bg-emerald-500',
        failed: 'bg-red-500',
        refunded: 'bg-purple-500'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getProgressBarColor = (status: string) => {
    const colors = {
        pending: 'bg-gradient-to-r from-primary-500 to-primary-600',
        completed: 'bg-gradient-to-r from-emerald-500 to-green-600',
        failed: 'bg-gradient-to-r from-red-500 to-orange-600',
        refunded: 'bg-gradient-to-r from-purple-500 to-violet-600'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getProgressMessage = (progress: number) => {
    if (progress < 25) return 'Initialisation de la transaction...'
    if (progress < 50) return 'Vérification des informations...'
    if (progress < 75) return 'Confirmation en cours...'
    if (progress < 100) return 'Finalisation...'
    return 'Terminé'
}

const getTimelineStepClass = (step: any, index: number) => {
    const isCompleted = step.status === 'completed'
    const isCurrent = step.status === 'current'
    const isFuture = step.status === 'pending'

    if (isCompleted) {
        return 'border-emerald-200 bg-emerald-100'
    } else if (isCurrent) {
        return 'border-primary-200 bg-primary-100'
    } else {
        return 'border-nature-200 bg-nature-50'
    }
}

const getTimelineIconColor = (step: any, index: number) => {
    const isCompleted = step.status === 'completed'
    const isCurrent = step.status === 'current'

    if (isCompleted) {
        return 'text-emerald-600'
    } else if (isCurrent) {
        return 'text-primary-600'
    } else {
        return 'text-nature-400'
    }
}

const getTimelineStepStatus = (stepIndex: number) => {
    if (props.status === 'completed' && stepIndex <= 3) return 'completed'
    if (props.status === 'pending' && stepIndex === 2) return 'current'
    if (props.status === 'pending' && stepIndex < 2) return 'completed'
    return 'pending'
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' ' + props.currency
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CM', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)} h`
    return `Il y a ${Math.floor(diffMins / 1440)} j`
}

const formatStatus = (status: string) => {
    const statusMap = {
        pending: 'En attente',
        completed: 'Complété',
        failed: 'Échoué',
        refunded: 'Remboursé'
    }
    return statusMap[status as keyof typeof statusMap] || status
}

const getPrimaryButtonClass = (status: string) => {
    const classes = {
        pending: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg',
        completed: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg',
        failed: 'bg-gradient-to-r from-red-500 to-orange-600 text-white hover:shadow-lg',
        refunded: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:shadow-lg'
    }
    return classes[status as keyof typeof classes] || classes.pending
}

const getSecondaryButtonClass = (status: string) => {
    return 'border-nature-300 text-nature-700 hover:border-nature-400'
}

const getTertiaryButtonClass = (status: string) => {
    return 'border-nature-200 text-nature-600 hover:border-nature-300'
}

const getReassuranceClass = (status: string) => {
    const classes = {
        pending: 'border-primary-200 bg-primary-50/30',
        completed: 'border-emerald-200 bg-emerald-50/30',
        failed: 'border-red-200 bg-red-50/30',
        refunded: 'border-purple-200 bg-purple-50/30'
    }
    return classes[status as keyof typeof classes] || classes.pending
}

const getReassuranceIconColor = (status: string) => {
    const colors = {
        pending: 'text-primary-600',
        completed: 'text-emerald-600',
        failed: 'text-red-600',
        refunded: 'text-purple-600'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getReassuranceTextColor = (status: string) => {
    const colors = {
        pending: 'text-primary-900',
        completed: 'text-emerald-900',
        failed: 'text-red-900',
        refunded: 'text-purple-900'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getReassuranceSubtextColor = (status: string) => {
    const colors = {
        pending: 'text-primary-700',
        completed: 'text-emerald-700',
        failed: 'text-red-700',
        refunded: 'text-purple-700'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getReassuranceMessage = (status: string) => {
    const messages = {
        pending: 'Votre paiement est sécurisé',
        completed: 'Paiement confirmé et sécurisé',
        failed: 'Sécurité garantie lors de la prochaine tentative',
        refunded: 'Remboursement sécurisé'
    }
    return messages[status as keyof typeof messages] || messages.pending
}

const getReassuranceSubtext = (status: string) => {
    const subtexts = {
        pending: 'Toutes vos informations sont chiffrées et protégées',
        completed: 'Vos données bancaires ne sont jamais stockées sur nos serveurs',
        failed: 'Vos informations restent confidentielles',
        refunded: 'Le processus de remboursement respecte les normes de sécurité'
    }
    return subtexts[status as keyof typeof subtexts] || subtexts.pending
}

const getNotificationClass = (status: string) => {
    const classes = {
        pending: 'border-primary-200 bg-primary-50/50',
        completed: 'border-emerald-200 bg-emerald-50/50',
        failed: 'border-red-200 bg-red-50/50',
        refunded: 'border-purple-200 bg-purple-50/50'
    }
    return classes[status as keyof typeof classes] || classes.pending
}

const getNotificationIcon = (status: string) => {
    const icons = {
        pending: InformationCircleIcon,
        completed: CheckCircleIcon,
        failed: ExclamationTriangleIcon,
        refunded: InformationCircleIcon
    }
    return icons[status as keyof typeof icons] || InformationCircleIcon
}

const getNotificationIconColor = (status: string) => {
    const colors = {
        pending: 'text-primary-600',
        completed: 'text-emerald-600',
        failed: 'text-red-600',
        refunded: 'text-purple-600'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getNotificationTextColor = (status: string) => {
    const colors = {
        pending: 'text-primary-900',
        completed: 'text-emerald-900',
        failed: 'text-red-900',
        refunded: 'text-purple-900'
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getNotificationSubtextColor = (status: string) => {
    return 'text-nature-700'
}

// Actions
const refreshStatus = async () => {
    if (isRefreshing.value) return

    isRefreshing.value = true
    progress.value = 0

    // Simulation de progression
    const interval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += 10
        } else {
            clearInterval(interval)
            isRefreshing.value = false
            showNotification.value = true
            notificationMessage.value = 'Statut actualisé avec succès'
            notificationSubtext.value = 'Les informations sont à jour'
        }
    }, 200)

    emit('refresh')
}

const retryPayment = () => {
    showNotification.value = true
    notificationMessage.value = 'Redirection vers le paiement'
    notificationSubtext.value = 'Préparation du formulaire de paiement...'
    emit('retry')
}

const viewInvoice = () => {
    showNotification.value = true
    notificationMessage.value = 'Ouverture de la facture'
    notificationSubtext.value = 'Génération du PDF en cours...'
    emit('viewInvoice')
}

const contactSupport = () => {
    showNotification.value = true
    notificationMessage.value = 'Contact du support'
    notificationSubtext.value = 'Redirection vers le chat de support...'
    emit('contactSupport')
}

const secondaryAction = () => {
    emit('secondaryAction')
}

// Lifecycle
onMounted(() => {
    // Initialiser la progression pour pending
    if (props.status === 'pending' && props.autoRefresh) {
        progress.value = 30

        // Simuler une progression lente
        const interval = setInterval(() => {
            if (progress.value < 90) {
                progress.value += 5
            } else {
                clearInterval(interval)
            }
        }, 2000)

        // Configurer l'auto-refresh
        if (props.autoRefresh) {
            refreshTimer.value = setInterval(() => {
                if (props.status === 'pending') {
                    refreshStatus()
                }
            }, props.refreshInterval)
        }
    } else if (props.status === 'completed') {
        progress.value = 100
    }
})

onUnmounted(() => {
    if (refreshTimer.value) {
        clearInterval(refreshTimer.value)
    }
})

// Watch
watch(() => props.status, (newStatus) => {
    if (newStatus === 'completed') {
        progress.value = 100
        showNotification.value = true
        notificationMessage.value = 'Paiement confirmé !'
        notificationSubtext.value = 'Votre commande est maintenant confirmée'
    } else if (newStatus === 'failed') {
        showNotification.value = true
        notificationMessage.value = 'Paiement échoué'
        notificationSubtext.value = 'Une erreur est survenue lors du traitement'
    }
})
</script>

<style scoped>
/* Animations */
.leaf-float {
    animation: float-leaf 15s ease-in-out infinite;
}

@keyframes float-leaf {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
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

.delay-400 {
    animation-delay: 400ms;
}

/* Transitions pour les actions */
.actions-enter-active,
.actions-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.actions-enter-from,
.actions-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.actions-move {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation de pulsation */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>




