<template>
    <div class="relative group" :class="containerClasses">
        <!-- Avatar principal -->
        <div ref="avatarContainer" :class="[
            'relative rounded-full overflow-hidden transform transition-all duration-500 ease-organic',
            'border-2 shadow-soft',
            hasError ? 'border-red-300/50' : 'border-nature-200/50',
            isUploading ? 'animate-pulse' : '',
            isInteractive ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : '',
            sizeClasses
        ]" @click="handleAvatarClick" @mouseenter="showOverlay = true" @mouseleave="showOverlay = false">

            <!-- Dégradé de fond organique -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-nature-100/30 to-blue-50/20"></div>

            <!-- Texture filigrane subtile -->
            <div class="absolute inset-0 opacity-5 bg-leaf-pattern bg-[length:100px]"></div>

            <!-- Image d'avatar -->
            <div v-if="avatarSrc && !hasError" class="relative w-full h-full">
                <img :src="avatarSrc" :alt="altText" @load="handleImageLoad" @error="handleImageError"
                    class="w-full h-full object-cover transform transition-transform duration-700 ease-organic group-hover:scale-110" />

                <!-- Effet de brillance organique -->
                <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 
                    mix-blend-overlay pointer-events-none"></div>
            </div>

            <!-- Initiales ou emoji par défaut -->
            <div v-else :class="[
                'w-full h-full flex items-center justify-center transform transition-all duration-500 ease-organic',
                hasError ? 'bg-gradient-to-br from-red-50 to-red-100/50' : 'bg-gradient-to-br from-primary/20 to-nature-300/30'
            ]">
                <span v-if="initials" class="font-bold text-forest-800" :class="textSizeClasses">
                    {{ initials }}
                </span>
                <span v-else class="opacity-70" :class="emojiSizeClasses">
                    {{ defaultEmoji }}
                </span>
            </div>

            <!-- Overlay d'interaction -->
            <transition enter-active-class="transform transition-all duration-300 ease-organic"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transform transition-all duration-200 ease-organic"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="showOverlay && isInteractive" class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent
                    flex flex-col items-center justify-end pb-4">
                    <div class="text-white text-center space-y-2">
                        <span class="text-xl animate-bounce">👆</span>
                        <p class="text-sm font-medium drop-shadow">Modifier la photo</p>
                    </div>
                </div>
            </transition>

            <!-- Indicateur de chargement -->
            <transition enter-active-class="transform transition-all duration-300 ease-organic"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transform transition-all duration-200 ease-organic"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="isUploading"
                    class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div class="space-y-3 text-center">
                        <div class="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-nature-300/30 
                        flex items-center justify-center animate-spin">
                            <span class="text-xl">🌀</span>
                        </div>
                        <p class="text-white text-sm font-medium drop-shadow">Envoi en cours...</p>
                    </div>
                </div>
            </transition>

            <!-- Indicateur d'erreur -->
            <transition enter-active-class="transform transition-all duration-300 ease-organic"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transform transition-all duration-200 ease-organic"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="hasError" class="absolute inset-0 bg-gradient-to-t from-red-500/20 via-red-400/10 to-transparent
                    flex items-center justify-center">
                    <div class="text-center space-y-2 p-4">
                        <span class="text-2xl">❌</span>
                        <p class="text-xs font-medium text-red-800 drop-shadow">Erreur de chargement</p>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Bouton d'action (flottant) -->
        <transition enter-active-class="transform transition-all duration-300 ease-organic"
            enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transform transition-all duration-200 ease-organic"
            leave-from-class="opacity-100 scale-100 translate-y-0" leave-to-class="opacity-0 scale-95 translate-y-4">
            <div v-if="showActionButton" :class="[
                'absolute -bottom-2 -right-2 transform transition-all duration-500 ease-organic',
                'hover:scale-110 hover:rotate-12'
            ]">
                <div class="relative">
                    <!-- Bouton principal -->
                    <button @click="toggleActionMenu" :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center shadow-lg',
                        'transform transition-all duration-300 ease-organic',
                        'border-2 border-white',
                        isActionMenuOpen ? 'bg-gradient-to-r from-nature-600 to-forest-700 rotate-45'
                            : 'bg-gradient-to-r from-primary to-nature-500'
                    ]">
                        <span class="text-white text-lg">{{ isActionMenuOpen ? '×' : '➕' }}</span>
                    </button>

                    <!-- Menu d'actions -->
                    <transition enter-active-class="transform transition-all duration-300 ease-organic"
                        enter-from-class="opacity-0 scale-95 translate-y-4"
                        enter-to-class="opacity-100 scale-100 translate-y-0"
                        leave-active-class="transform transition-all duration-200 ease-organic"
                        leave-from-class="opacity-100 scale-100 translate-y-0"
                        leave-to-class="opacity-0 scale-95 translate-y-4">
                        <div v-if="isActionMenuOpen" class="absolute bottom-full right-0 mb-2 space-y-2 min-w-max">
                            <!-- Option Télécharger -->
                            <button @click="triggerFileInput" class="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg
                             shadow-soft border border-nature-200/50 text-forest-800
                             transform hover:scale-105 transition-all duration-300 ease-organic
                             whitespace-nowrap">
                                <span class="text-lg">📤</span>
                                <span>Télécharger</span>
                            </button>

                            <!-- Option Supprimer (si avatar existant) -->
                            <button v-if="avatarSrc" @click="handleRemoveAvatar" class="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg
                             shadow-soft border border-red-200/50 text-red-700
                             transform hover:scale-105 transition-all duration-300 ease-organic
                             whitespace-nowrap">
                                <span class="text-lg">🗑️</span>
                                <span>Supprimer</span>
                            </button>

                            <!-- Option Regénérer (avatars par défaut) -->
                            <button @click="handleRegenerate" class="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg
                             shadow-soft border border-nature-200/50 text-forest-800
                             transform hover:scale-105 transition-all duration-300 ease-organic
                             whitespace-nowrap">
                                <span class="text-lg">🎲</span>
                                <span>Nouveau style</span>
                            </button>
                        </div>
                    </transition>
                </div>
            </div>
        </transition>

        <!-- Input fichier caché -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect">

        <!-- Éléments décoratifs flottants -->
        <div v-for="i in floatingElements" :key="i" :class="`absolute floating-element-${i % 3 + 1}`"
            :style="getFloatingElementStyle(i)">
            <span class="text-lg opacity-20">{{ floatingEmojis[i % floatingEmojis.length] }}</span>
        </div>
    </div>

    <!-- Toast de notification -->
    <transition enter-active-class="transform transition-all duration-500 ease-organic"
        enter-from-class="translate-y-10 opacity-0" enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transform transition-all duration-300 ease-organic"
        leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-10 opacity-0">
        <div v-if="showToast" :class="[
            'fixed bottom-6 right-6 max-w-sm rounded-xl p-4 shadow-lg backdrop-blur-sm animate-slide-in-up',
            'border-2',
            toastType === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200/50'
                : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200/50'
        ]">
            <div class="flex items-center space-x-3">
                <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    toastType === 'success'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : 'bg-gradient-to-r from-red-400 to-red-500'
                ]">
                    <span class="text-xl text-white">{{ toastType === 'success' ? '✅' : '❌' }}</span>
                </div>
                <div>
                    <p class="font-medium text-forest-800">{{ toastMessage }}</p>
                    <p class="text-sm text-nature-600">{{ toastDescription }}</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Props
const props = defineProps({
    // Source de l'image
    avatarSrc: {
        type: String,
        default: ''
    },

    // Initiales pour l'affichage par défaut
    initials: {
        type: String,
        default: ''
    },

    // Texte alternatif
    altText: {
        type: String,
        default: 'Photo de profil'
    },

    // Taille du composant
    size: {
        type: String,
        default: 'medium', // 'small' | 'medium' | 'large' | 'xlarge'
        validator: (value: string) => ['small', 'medium', 'large', 'xlarge'].includes(value)
    },

    // Mode interactif
    interactive: {
        type: Boolean,
        default: true
    },

    // Afficher le bouton d'action
    showActionButton: {
        type: Boolean,
        default: true
    },

    // Émoticône par défaut
    defaultEmoji: {
        type: String,
        default: '👤'
    },

    // Classes CSS supplémentaires
    customClasses: {
        type: String,
        default: ''
    }
})

// Émits
const emit = defineEmits<{
    'update:avatar': [file: File]
    'remove-avatar': []
    'click': []
    'upload:start': []
    'upload:complete': [url: string]
    'upload:error': [error: Error]
}>()

// Références
const fileInput = ref<HTMLInputElement | null>(null)
const avatarContainer = ref<HTMLElement | null>(null)

// État
const showOverlay = ref(false)
const isActionMenuOpen = ref(false)
const isUploading = ref(false)
const hasError = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastDescription = ref('')
const toastType = ref<'success' | 'error'>('success')

// Données
const floatingEmojis = ['🍃', '🌿', '🌸', '🌼', '🍂', '🌱', '🥬', '🥦']
const floatingElements = 4

// Computed
const containerClasses = computed(() => {
    return props.customClasses
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'small':
            return 'w-16 h-16'
        case 'medium':
            return 'w-24 h-24'
        case 'large':
            return 'w-32 h-32'
        case 'xlarge':
            return 'w-48 h-48'
        default:
            return 'w-24 h-24'
    }
})

const textSizeClasses = computed(() => {
    switch (props.size) {
        case 'small':
            return 'text-lg'
        case 'medium':
            return 'text-2xl'
        case 'large':
            return 'text-3xl'
        case 'xlarge':
            return 'text-4xl'
        default:
            return 'text-2xl'
    }
})

const emojiSizeClasses = computed(() => {
    switch (props.size) {
        case 'small':
            return 'text-2xl'
        case 'medium':
            return 'text-3xl'
        case 'large':
            return 'text-4xl'
        case 'xlarge':
            return 'text-5xl'
        default:
            return 'text-3xl'
    }
})

const isInteractive = computed(() => {
    return props.interactive && !isUploading.value
})

// Méthodes
const getFloatingElementStyle = (index: number) => {
    const size = 20 + Math.random() * 30
    const rotation = Math.random() * 360
    const delay = index * 1.5

    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${delay}s`
    }
}

const handleAvatarClick = () => {
    if (!isInteractive.value) return

    emit('click')

    if (!props.avatarSrc && !isActionMenuOpen.value) {
        triggerFileInput()
    } else if (!showActionButton.value) {
        toggleActionMenu()
    }
}

const toggleActionMenu = () => {
    isActionMenuOpen.value = !isActionMenuOpen.value
}

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click()
    }
    isActionMenuOpen.value = false
}

const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return

    const file = input.files[0]

    // Validation du fichier
    if (!validateFile(file)) {
        showNotification('Fichier invalide', 'Format ou taille non supportée', 'error')
        return
    }

    // Émettre l'événement de début d'upload
    emit('upload:start')
    isUploading.value = true
    hasError.value = false

    try {
        // Simuler un upload (dans la réalité, appeler une API)
        await simulateUpload(file)

        // Émettre le fichier pour le parent
        emit('update:avatar', file)

        // Afficher la notification de succès
        showNotification('Photo mise à jour', 'Votre nouvelle photo de profil a été enregistrée', 'success')

        // Émettre l'événement de fin d'upload
        emit('upload:complete', URL.createObjectURL(file))

    } catch (error) {
        hasError.value = true
        showNotification('Erreur d\'upload', 'Impossible de télécharger la photo', 'error')
        emit('upload:error', error as Error)
    } finally {
        isUploading.value = false
        // Réinitialiser l'input file
        if (input) input.value = ''
    }
}

const validateFile = (file: File): boolean => {
    // Vérifier le type MIME
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
        return false
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
        return false
    }

    return true
}

const simulateUpload = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Simuler un délai d'upload
        setTimeout(() => {
            const shouldSucceed = Math.random() > 0.1 // 90% de succès
            if (shouldSucceed) {
                resolve()
            } else {
                reject(new Error('Échec de l\'upload simulé'))
            }
        }, 1500 + Math.random() * 1000)
    })
}

const handleRemoveAvatar = () => {
    isActionMenuOpen.value = false

    // Demander confirmation
    if (window.confirm('Voulez-vous vraiment supprimer votre photo de profil ?')) {
        emit('remove-avatar')
        showNotification('Photo supprimée', 'Votre photo de profil a été supprimée', 'success')
    }
}

const handleRegenerate = () => {
    isActionMenuOpen.value = false

    // Générer un nouvel emoji aléatoire
    const randomEmojis = ['👤', '👨', '👩', '🧑', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '🦸', '🦸‍♀️']
    const randomEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)]

    // Émettre un événement pour informer le parent
    emit('update:avatar', new File([], `emoji-${randomEmoji}`))

    showNotification('Style mis à jour', 'Votre avatar a été regénéré', 'success')
}

const handleImageLoad = () => {
    hasError.value = false
}

const handleImageError = () => {
    hasError.value = true
    showNotification('Erreur d\'image', 'Impossible de charger la photo', 'error')
}

const showNotification = (message: string, description: string, type: 'success' | 'error') => {
    toastMessage.value = message
    toastDescription.value = description
    toastType.value = type
    showToast.value = true

    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

// Lifecycle
onMounted(() => {
    // Ajouter des écouteurs d'événements globaux
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    // Nettoyer les écouteurs
    document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
    if (avatarContainer.value && !avatarContainer.value.contains(event.target as Node)) {
        isActionMenuOpen.value = false
        showOverlay.value = false
    }
}

// Watch pour réinitialiser l'état d'erreur quand la source change
watch(() => props.avatarSrc, () => {
    hasError.value = false
})

// Exposer des méthodes publiques si nécessaire
defineExpose({
    triggerFileInput,
    handleRemoveAvatar
})
</script>

<style scoped>
/* Courbe de transition organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations d'entrée */
.animate-slide-in-up {
    animation: slide-in-up 0.6s ease-organic;
}

@keyframes slide-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Animations des éléments flottants */
.floating-element-1 {
    animation: floating-1 15s ease-in-out infinite;
}

.floating-element-2 {
    animation: floating-2 20s ease-in-out infinite;
    animation-delay: 5s;
}

.floating-element-3 {
    animation: floating-3 25s ease-in-out infinite;
    animation-delay: 10s;
}

@keyframes floating-1 {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

@keyframes floating-2 {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-30px) rotate(360deg);
    }
}

@keyframes floating-3 {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-40px) rotate(-180deg);
    }
}

/* Animation de rebond */
@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.animate-bounce {
    animation: bounce 1s ease-in-out infinite;
}

/* Styles pour la texture de feuille */
.bg-leaf-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Styles pour l'ombre douce */
.shadow-soft {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.1);
}

/* Support pour les réductions de mouvement */
@media (prefers-reduced-motion: reduce) {

    .floating-element-1,
    .floating-element-2,
    .floating-element-3,
    .animate-slide-in-up,
    .animate-bounce,
    .animate-pulse,
    .transform,
    .transition-all {
        animation: none !important;
        transition: none !important;
    }
}

/* Styles pour le mix-blend */
.mix-blend-overlay {
    mix-blend-mode: overlay;
}

/* Styles pour le dégradé de brillance */
@keyframes shine {
    0% {
        background-position: -100% -100%;
    }

    100% {
        background-position: 200% 200%;
    }
}

.shine-effect {
    background: linear-gradient(45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 70%);
    background-size: 200% 200%;
    animation: shine 3s ease-in-out infinite;
}
</style>


