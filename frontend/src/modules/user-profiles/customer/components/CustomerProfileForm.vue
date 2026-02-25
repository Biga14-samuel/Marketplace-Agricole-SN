import { getErrorMessage } from '@/shared/utils/error-handler';
<template>
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-nature-50 via-cream-100/80 to-blue-50/30">
        <!-- Texture filigrane subtile -->
        <div class="absolute inset-0 opacity-5 z-0 bg-leaf-pattern bg-[length:250px]"></div>

        <!-- Animation de feuilles flottantes -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div v-for="i in 8" :key="i" class="absolute leaf-float" :style="leafStyle(i)"
                :class="`leaf-float-${(i % 4) + 1}`">
                <span class="text-2xl opacity-10">{{ leafEmojis[i % leafEmojis.length] }}</span>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="relative z-10 container mx-auto px-4 py-8 md:py-12">
            <!-- En-tête -->
            <div class="text-center mb-8 animate-slide-in-down">
                <div class="inline-flex items-center justify-center space-x-3 mb-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-nature-300/30 
                      flex items-center justify-center shadow-soft">
                        <span class="text-2xl">👤</span>
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold text-forest-900 font-display">
                        Mon <span class="text-primary">Profil</span>
                    </h1>
                </div>
                <p class="text-nature-600 max-w-2xl mx-auto">
                    🌿 Complétez votre profil pour une expérience personnalisée
                </p>
            </div>

            <!-- Formulaire -->
            <div class="max-w-4xl mx-auto">
                <form @submit.prevent="handleSubmit" class="space-y-8 animate-slide-in-up">

                    <!-- Section Informations personnelles -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-soft 
                     border border-nature-200/50 transform transition-all duration-500 ease-organic">
                        <div class="flex items-center space-x-3 mb-6">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-nature-100 
                          flex items-center justify-center">
                                <span class="text-xl">📝</span>
                            </div>
                            <h2 class="text-xl font-bold text-forest-800">Informations personnelles</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Prénom -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-forest-700">
                                    <span class="flex items-center space-x-2">
                                        <span>👤</span>
                                        <span>Prénom</span>
                                    </span>
                                </label>
                                <input v-model="formData.firstName" type="text" :class="[
                                    'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                    'bg-white/80 backdrop-blur-sm',
                                    errors.firstName ? 'border-red-300' : 'border-nature-200/50'
                                ]" placeholder="Votre prénom" />
                                <p v-if="errors.firstName" class="text-sm text-red-500 animate-pulse">{{
                                    errors.firstName }}</p>
                            </div>

                            <!-- Nom -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-forest-700">
                                    <span class="flex items-center space-x-2">
                                        <span>🏷️</span>
                                        <span>Nom</span>
                                    </span>
                                </label>
                                <input v-model="formData.lastName" type="text" :class="[
                                    'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                    'bg-white/80 backdrop-blur-sm',
                                    errors.lastName ? 'border-red-300' : 'border-nature-200/50'
                                ]" placeholder="Votre nom" />
                                <p v-if="errors.lastName" class="text-sm text-red-500 animate-pulse">{{ errors.lastName
                                    }}</p>
                            </div>

                            <!-- Email -->
                            <div class="space-y-2 md:col-span-2">
                                <label class="block text-sm font-medium text-forest-700">
                                    <span class="flex items-center space-x-2">
                                        <span>📧</span>
                                        <span>Email</span>
                                    </span>
                                </label>
                                <input v-model="formData.email" type="email" :class="[
                                    'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                    'bg-white/80 backdrop-blur-sm',
                                    errors.email ? 'border-red-300' : 'border-nature-200/50'
                                ]" placeholder="votre@email.com" />
                                <p v-if="errors.email" class="text-sm text-red-500 animate-pulse">{{ errors.email }}</p>
                            </div>

                            <!-- Téléphone -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-forest-700">
                                    <span class="flex items-center space-x-2">
                                        <span>📱</span>
                                        <span>Téléphone</span>
                                    </span>
                                </label>
                                <input v-model="formData.phone" type="tel" :class="[
                                    'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                    'bg-white/80 backdrop-blur-sm',
                                    errors.phone ? 'border-red-300' : 'border-nature-200/50'
                                ]" placeholder="+237 6 XX XX XX XX" />
                                <p v-if="errors.phone" class="text-sm text-red-500 animate-pulse">{{ errors.phone }}</p>
                            </div>

                            <!-- Date de naissance -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-forest-700">
                                    <span class="flex items-center space-x-2">
                                        <span>🎂</span>
                                        <span>Date de naissance</span>
                                    </span>
                                </label>
                                <input v-model="formData.birthDate" type="date" :class="[
                                    'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                    'bg-white/80 backdrop-blur-sm',
                                    errors.birthDate ? 'border-red-300' : 'border-nature-200/50'
                                ]" />
                                <p v-if="errors.birthDate" class="text-sm text-red-500 animate-pulse">{{
                                    errors.birthDate }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Section Avatar -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-soft 
                     border border-nature-200/50 transform transition-all duration-500 ease-organic">
                        <div class="flex items-center space-x-3 mb-6">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-nature-100 
                          flex items-center justify-center">
                                <span class="text-xl">🖼️</span>
                            </div>
                            <h2 class="text-xl font-bold text-forest-800">Photo de profil</h2>
                        </div>

                        <div class="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                            <!-- Aperçu avatar -->
                            <div class="relative group">
                                <div class="w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-nature-300/30 
                            flex items-center justify-center shadow-lg overflow-hidden
                            transform group-hover:scale-105 transition-all duration-500 ease-organic">
                                    <div v-if="avatarPreview" class="w-full h-full">
                                        <img :src="avatarPreview" alt="Avatar preview"
                                            class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                                    </div>
                                    <span v-else class="text-5xl opacity-70">👤</span>
                                </div>
                                <div
                                    class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-nature-500
                            flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                                    <span class="text-white">✨</span>
                                </div>
                            </div>

                            <!-- Upload -->
                            <div class="flex-1 space-y-4">
                                <p class="text-nature-600">Ajoutez une photo pour personnaliser votre profil</p>
                                <div class="flex space-x-4">
                                    <label :for="fileInputId" class="px-6 py-3 bg-gradient-to-r from-primary/10 to-nature-100 text-forest-700 font-medium rounded-xl
                                border border-nature-200/50 cursor-pointer transform hover:scale-105 active:scale-95
                                transition-all duration-300 ease-organic flex items-center space-x-2 group">
                                        <span
                                            class="text-lg group-hover:rotate-12 transition-transform duration-300">📤</span>
                                        <span>Choisir une photo</span>
                                    </label>
                                    <button v-if="avatarPreview" type="button" @click="removeAvatar" class="px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-medium rounded-xl
                                 border border-red-200/50 transform hover:scale-105 active:scale-95
                                 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>🗑️</span>
                                        <span>Supprimer</span>
                                    </button>
                                </div>
                                <input :id="fileInputId" type="file" accept="image/*" @change="handleAvatarUpload"
                                    class="hidden" />
                                <p class="text-sm text-nature-500">Formats acceptés : JPG, PNG (max 2MB)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Section Préférences -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-soft 
                     border border-nature-200/50 transform transition-all duration-500 ease-organic">
                        <div class="flex items-center space-x-3 mb-6">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-nature-100 
                          flex items-center justify-center">
                                <span class="text-xl">⚙️</span>
                            </div>
                            <h2 class="text-xl font-bold text-forest-800">Préférences</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Notifications -->
                            <div class="space-y-4">
                                <h3 class="font-bold text-forest-800 flex items-center space-x-2">
                                    <span>🔔</span>
                                    <span>Notifications</span>
                                </h3>

                                <label
                                    class="flex items-center space-x-3 p-3 rounded-xl border border-nature-200/50 
                             bg-white/50 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ease-organic">
                                    <input v-model="formData.preferences.newsletterSubscription" type="checkbox"
                                        class="w-5 h-5 text-primary rounded border-nature-300 focus:ring-primary/30">
                                    <div class="flex-1">
                                        <p class="font-medium text-forest-800">Newsletter</p>
                                        <p class="text-sm text-nature-500">Recevoir les offres et actualités</p>
                                    </div>
                                    <span class="text-xl">📰</span>
                                </label>

                                <label
                                    class="flex items-center space-x-3 p-3 rounded-xl border border-nature-200/50 
                             bg-white/50 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ease-organic">
                                    <input v-model="formData.preferences.marketingEmails" type="checkbox"
                                        class="w-5 h-5 text-primary rounded border-nature-300 focus:ring-primary/30">
                                    <div class="flex-1">
                                        <p class="font-medium text-forest-800">Emails marketing</p>
                                        <p class="text-sm text-nature-500">Promotions et nouveautés</p>
                                    </div>
                                    <span class="text-xl">📧</span>
                                </label>

                                <label
                                    class="flex items-center space-x-3 p-3 rounded-xl border border-nature-200/50 
                             bg-white/50 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ease-organic">
                                    <input v-model="formData.preferences.smsNotifications" type="checkbox"
                                        class="w-5 h-5 text-primary rounded border-nature-300 focus:ring-primary/30">
                                    <div class="flex-1">
                                        <p class="font-medium text-forest-800">Notifications SMS</p>
                                        <p class="text-sm text-nature-500">Rappels et mises à jour</p>
                                    </div>
                                    <span class="text-xl">📱</span>
                                </label>
                            </div>

                            <!-- Langue et Livraison -->
                            <div class="space-y-4">
                                <!-- Langue -->
                                <div class="space-y-2">
                                    <label class="block font-medium text-forest-800 flex items-center space-x-2">
                                        <span>🌐</span>
                                        <span>Langue</span>
                                    </label>
                                    <select v-model="formData.preferences.language" class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                 transition-all duration-300 ease-organic">
                                        <option value="fr">🇫🇷 Français</option>
                                        <option value="en">🇬🇧 English</option>
                                    </select>
                                </div>

                                <!-- Créneau de livraison -->
                                <div class="space-y-2">
                                    <label class="block font-medium text-forest-800 flex items-center space-x-2">
                                        <span>🚚</span>
                                        <span>Créneau de livraison préféré</span>
                                    </label>
                                    <select v-model="formData.preferences.preferredDeliveryTime" class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                 transition-all duration-300 ease-organic">
                                        <option value="">Pas de préférence</option>
                                        <option value="MORNING">🌅 Matin (8h-12h)</option>
                                        <option value="AFTERNOON">☀️ Après-midi (12h-18h)</option>
                                        <option value="EVENING">🌙 Soir (18h-22h)</option>
                                    </select>
                                </div>

                                <!-- Allergies -->
                                <div class="space-y-2">
                                    <label class="block font-medium text-forest-800 flex items-center space-x-2">
                                        <span>⚠️</span>
                                        <span>Allergies alimentaires</span>
                                    </label>
                                    <textarea v-model="formData.preferences.allergies" rows="3"
                                        placeholder="Ex: gluten, lactose, fruits à coque..." class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                   transition-all duration-300 ease-organic"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
                        <button type="button" @click="handleCancel" class="px-8 py-3 bg-gradient-to-r from-nature-100 to-nature-200 text-forest-700 font-semibold rounded-xl
                           border border-nature-300/50 shadow-soft transform hover:scale-105 active:scale-95
                           transition-all duration-500 ease-organic flex items-center space-x-3 group">
                            <span class="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
                            <span>Annuler</span>
                        </button>

                        <div class="flex gap-4">
                            <button type="button" @click="handleReset" class="px-8 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-semibold rounded-xl
                             border border-orange-200/50 shadow-soft transform hover:scale-105 active:scale-95
                             transition-all duration-500 ease-organic flex items-center space-x-3 group">
                                <span class="text-lg group-hover:rotate-180 transition-transform duration-500">🔄</span>
                                <span>Réinitialiser</span>
                            </button>

                            <button type="submit" :disabled="isSubmitting" :class="[
                                'px-8 py-3 font-semibold rounded-xl shadow-lg transform transition-all duration-500 ease-organic',
                                'flex items-center space-x-3 group',
                                isSubmitting
                                    ? 'bg-gradient-to-r from-nature-400 to-nature-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-nature-600 to-forest-700 hover:scale-105 active:scale-95'
                            ]">
                                <span v-if="isSubmitting" class="animate-spin">⏳</span>
                                <span v-else
                                    class="text-lg group-hover:rotate-12 transition-transform duration-300">💾</span>
                                <span class="text-white">{{ isSubmitting ? 'Enregistrement...' : 'Enregistrer mon profil' }}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Confirmation toast -->
            <transition enter-active-class="transform transition-all duration-500 ease-organic"
                enter-from-class="translate-y-10 opacity-0" enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transform transition-all duration-300 ease-organic"
                leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-10 opacity-0">
                <div v-if="showSuccess" class="fixed bottom-6 right-6 max-w-sm bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200/50
                    rounded-xl p-4 shadow-lg backdrop-blur-sm animate-slide-in-up">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 
                        flex items-center justify-center">
                            <span class="text-xl text-white">✅</span>
                        </div>
                        <div>
                            <p class="font-medium text-forest-800">Profil enregistré avec succès !</p>
                            <p class="text-sm text-nature-600">Vos modifications ont été sauvegardées</p>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted, computed } from 'vue'
import type { CustomerProfileFormData } from '../types'
import { useCustomerStore } from '../stores/useCustomerStore'
import { getErrorMessage } from '@/shared/utils/error-handler'

// Store
const customerStore = useCustomerStore()

// État du formulaire
const formData = reactive<CustomerProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    avatar: '',
    preferences: {
        newsletterSubscription: true,
        marketingEmails: true,
        smsNotifications: true,
        preferredDeliveryTime: 'AFTERNOON',
        language: 'fr'
    }
})

// État UI
const isSubmitting = ref(false)
const showSuccess = ref(false)
const errors = reactive<Record<string, string>>({})
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string>('')
const fileInputId = `file-input-${Math.random().toString(36).substr(2, 9)}`

// Emojis pour les feuilles flottantes
const leafEmojis = ['🍃', '🌿', '🍂', '🍁', '🌱', '🥬', '🥦', '🥒']

// Styles pour les feuilles flottantes
const leafStyle = (index: number) => {
    const size = 20 + Math.random() * 40
    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${index * 2}s`
    }
}

// Charger les données existantes
onMounted(async () => {
    await customerStore.fetchProfile()

    if (customerStore.profile) {
        const profile = customerStore.profile
        formData.firstName = profile.firstName
        formData.lastName = profile.lastName
        formData.email = profile.email || ''
        formData.phone = profile.phone || ''
        formData.birthDate = profile.birthDate || ''
        formData.avatar = profile.avatar || ''

        if (profile.preferences) {
            formData.preferences = {
                newsletterSubscription: profile.preferences.newsletterSubscription ?? true,
                marketingEmails: profile.preferences.marketingEmails ?? true,
                smsNotifications: profile.preferences.smsNotifications ?? true,
                preferredDeliveryTime: profile.preferences.preferredDeliveryTime || 'AFTERNOON',
                language: profile.preferences.language || 'fr'
            }
        }

        if (profile.avatar) {
            avatarPreview.value = profile.avatar
        }
    }
})

// Gestion de l'upload d'avatar
const handleAvatarUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        avatarFile.value = input.files[0]

        // Créer un preview
        const reader = new FileReader()
        reader.onload = (e) => {
            avatarPreview.value = e.target?.result as string
            formData.avatar = avatarPreview.value
        }
        reader.readAsDataURL(avatarFile.value)
    }
}

const removeAvatar = () => {
    avatarFile.value = null
    avatarPreview.value = ''
    formData.avatar = ''
}

// Validation
const validateForm = (): boolean => {
    // Réinitialiser les erreurs
    Object.keys(errors).forEach(key => delete errors[key])

    let isValid = true

    if (!formData.firstName.trim()) {
        errors.firstName = 'Le prénom est requis'
        isValid = false
    } else if (formData.firstName.length < 2) {
        errors.firstName = 'Le prénom doit contenir au moins 2 caractères'
        isValid = false
    }

    if (!formData.lastName.trim()) {
        errors.lastName = 'Le nom est requis'
        isValid = false
    } else if (formData.lastName.length < 2) {
        errors.lastName = 'Le nom doit contenir au moins 2 caractères'
        isValid = false
    }

    if (!formData.email.trim()) {
        errors.email = 'L\'email est requis'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email invalide'
        isValid = false
    }

    if (!formData.phone.trim()) {
        errors.phone = 'Le téléphone est requis'
        isValid = false
    } else if (!/^\+?[0-9\s\-\(\)]{8,20}$/.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Numéro de téléphone invalide'
        isValid = false
    }

    if (formData.birthDate) {
        const birthDate = new Date(formData.birthDate)
        const today = new Date()
        const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
        const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())

        if (birthDate < minDate || birthDate > maxDate) {
            errors.birthDate = 'Date de naissance invalide'
            isValid = false
        }
    }

    return isValid
}

// Soumission
const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        // Préparer les données pour l'API
        const updateData = customerStore.prepareProfileUpdateData(formData)

        // Si un nouveau fichier avatar est sélectionné, l'uploader
        if (avatarFile.value) {
            // Ici, vous devriez appeler un service d'upload
            // const avatarUrl = await uploadAvatar(avatarFile.value)
            // updateData.avatar = avatarUrl
        }

        // Mettre à jour le profil
        const updatedProfile = await customerStore.updateProfile(updateData)

        if (updatedProfile) {
            // Afficher le message de succès
            showSuccess.value = true
            setTimeout(() => {
                showSuccess.value = false
            }, 3000)

            // Émettre un événement si nécessaire
            emit('saved', updatedProfile)
        }
    } catch (error: unknown) {
        console.error('Erreur lors de la sauvegarde:', error)
        errors.submit = getErrorMessage(error)
    } finally {
        isSubmitting.value = false
    }
}

// Réinitialiser
const handleReset = () => {
    if (customerStore.profile) {
        const profile = customerStore.profile
        formData.firstName = profile.firstName
        formData.lastName = profile.lastName
        formData.email = profile.email || ''
        formData.phone = profile.phone || ''
        formData.birthDate = profile.birthDate || ''
        formData.avatar = profile.avatar || ''

        if (profile.preferences) {
            formData.preferences = {
                newsletterSubscription: profile.preferences.newsletterSubscription ?? true,
                marketingEmails: profile.preferences.marketingEmails ?? true,
                smsNotifications: profile.preferences.smsNotifications ?? true,
                preferredDeliveryTime: profile.preferences.preferredDeliveryTime || 'AFTERNOON',
                language: profile.preferences.language || 'fr'
            }
        }

        if (profile.avatar) {
            avatarPreview.value = profile.avatar
        }
    }

    Object.keys(errors).forEach(key => delete errors[key])
}

// Annuler
const handleCancel = () => {
    emit('cancel')
}

// Événements
const emit = defineEmits<{
    saved: [profile: any]
    cancel: []
}>()

// Exposer des méthodes si nécessaire
defineExpose({
    formData,
    validateForm,
    handleSubmit
})
</script>

<style scoped>
/* Animation de feuilles flottantes */
.leaf-float {
    animation: leaf-float 20s linear infinite;
    opacity: 0.1;
}

.leaf-float-1 {
    animation-duration: 25s;
    animation-delay: 0s;
}

.leaf-float-2 {
    animation-duration: 30s;
    animation-delay: 5s;
}

.leaf-float-3 {
    animation-duration: 20s;
    animation-delay: 10s;
}

.leaf-float-4 {
    animation-duration: 35s;
    animation-delay: 15s;
}

@keyframes leaf-float {
    0% {
        transform: translateY(100vh) rotate(0deg);
    }

    100% {
        transform: translateY(-100px) rotate(360deg);
    }
}

/* Courbe de transition organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations d'entrée */
.animate-slide-in-down {
    animation: slide-in-down 0.6s ease-organic;
}

.animate-slide-in-up {
    animation: slide-in-up 0.6s ease-organic;
}

@keyframes slide-in-down {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
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

/* Support pour les réductions de mouvement */
@media (prefers-reduced-motion: reduce) {

    .leaf-float,
    .animate-slide-in-down,
    .animate-slide-in-up,
    .transform,
    .transition-all {
        animation: none !important;
        transition: none !important;
    }
}

/* Styles pour la texture de feuille */
.bg-leaf-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Styles pour l'ombre douce */
.shadow-soft {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.1);
}
</style>


