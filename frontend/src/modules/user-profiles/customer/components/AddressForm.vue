import { getErrorMessage } from '@/shared/utils/error-handler';
<template>
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-nature-50 via-cream-100/80 to-blue-50/30">
        <!-- Texture filigrane subtile -->
        <div class="absolute inset-0 opacity-5 z-0 bg-leaf-pattern bg-[length:250px]"></div>

        <!-- Animation de feuilles flottantes -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div v-for="i in 8" :key="i" class="absolute leaf-float" :style="leafStyle(i)"
                :class="`leaf-float-${(i % 4) + 1}`">
                <span class="text-2xl opacity-10">{{ locationEmojis[i % locationEmojis.length] }}</span>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="relative z-10 container mx-auto px-4 py-8 md:py-12">
            <!-- En-tête -->
            <div class="text-center mb-8 animate-slide-in-down">
                <div class="inline-flex items-center justify-center space-x-3 mb-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-nature-300/30 
                      flex items-center justify-center shadow-soft">
                        <span class="text-2xl">📍</span>
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold text-forest-900 font-display">
                        {{ isEditing ? 'Modifier' : 'Nouvelle' }} <span class="text-primary">Adresse</span>
                    </h1>
                </div>
                <p class="text-nature-600 max-w-2xl mx-auto">
                    🏡 Ajoutez une adresse pour recevoir vos produits frais
                </p>
            </div>

            <!-- Carte de localisation (côté gauche sur desktop) -->
            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Carte/Illustration (mobile: cachée, desktop: visible) -->
                    <div class="hidden lg:block flex-1 animate-slide-in-left">
                        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-nature-200/50
                       h-full transform transition-all duration-500 ease-organic hover:scale-[1.02]">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-nature-100 
                            flex items-center justify-center">
                                    <span class="text-xl">🗺️</span>
                                </div>
                                <h2 class="text-xl font-bold text-forest-800">Localisation</h2>
                            </div>

                            <div class="space-y-4">
                                <!-- Carte illustrative -->
                                <div class="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-nature-100 to-blue-100/50
                           border border-nature-200/50">
                                    <!-- Points de localisation animés -->
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="relative">
                                            <!-- Point central -->
                                            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-nature-300/30 
                                  flex items-center justify-center animate-pulse">
                                                <span class="text-3xl">🏠</span>
                                            </div>

                                            <!-- Ondes de localisation -->
                                            <div class="absolute inset-0">
                                                <div v-for="i in 3" :key="i"
                                                    :class="`absolute inset-0 rounded-full border-2 border-primary/30 animate-ping`"
                                                    :style="{
                                                        animationDelay: `${i * 0.5}s`,
                                                        transform: `scale(${1 + i * 0.3})`
                                                    }"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Points de repère -->
                                    <div
                                        class="absolute top-4 left-4 w-8 h-8 rounded-full bg-green-100/80 flex items-center justify-center">
                                        <span class="text-sm">🌳</span>
                                    </div>
                                    <div
                                        class="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center">
                                        <span class="text-sm">🚚</span>
                                    </div>
                                </div>

                                <!-- Infos de localisation -->
                                <div class="space-y-3">
                                    <div class="flex items-center space-x-3 p-3 rounded-xl bg-nature-50/50">
                                        <span class="text-2xl">🎯</span>
                                        <div>
                                            <p class="font-medium text-forest-800">Précision de livraison</p>
                                            <p class="text-sm text-nature-600">Nos livreurs atteignent toutes les zones
                                            </p>
                                        </div>
                                    </div>

                                    <div class="flex items-center space-x-3 p-3 rounded-xl bg-nature-50/50">
                                        <span class="text-2xl">⏱️</span>
                                        <div>
                                            <p class="font-medium text-forest-800">Livraison rapide</p>
                                            <p class="text-sm text-nature-600">24h max après commande</p>
                                        </div>
                                    </div>

                                    <button v-if="!geolocationLoading" @click="getCurrentLocation" type="button" class="w-full px-4 py-3 bg-gradient-to-r from-primary/10 to-nature-100 text-forest-700 
                                 rounded-xl border border-nature-200/50 flex items-center justify-center space-x-2
                                 transform hover:scale-105 transition-all duration-300 ease-organic">
                                        <span class="text-lg">📍</span>
                                        <span>Utiliser ma position actuelle</span>
                                    </button>

                                    <div v-else
                                        class="w-full px-4 py-3 bg-gradient-to-r from-primary/10 to-nature-100 
                                     rounded-xl border border-nature-200/50 flex items-center justify-center space-x-2">
                                        <span class="animate-spin">⏳</span>
                                        <span>Détection de la position...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Formulaire (côté droit) -->
                    <div class="flex-1 animate-slide-in-right">
                        <form @submit.prevent="handleSubmit" class="space-y-6">

                            <!-- Type et Titre -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft 
                         border border-nature-200/50 transform transition-all duration-500 ease-organic">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Type d'adresse -->
                                    <div class="space-y-3">
                                        <label class="block text-sm font-medium text-forest-700">
                                            <span class="flex items-center space-x-2">
                                                <span>🏷️</span>
                                                <span>Type d'adresse</span>
                                            </span>
                                        </label>
                                        <div class="grid grid-cols-3 gap-3">
                                            <button v-for="type in addressTypes" :key="type.value" type="button"
                                                @click="formData.type = type.value" :class="[
                                                    'p-3 rounded-xl border transition-all duration-300 ease-organic',
                                                    'flex flex-col items-center justify-center space-y-2',
                                                    formData.type === type.value
                                                        ? 'bg-gradient-to-r from-primary/20 to-nature-100 border-primary/50 shadow-inner'
                                                        : 'bg-white/50 border-nature-200/50 hover:scale-105'
                                                ]">
                                                <span class="text-xl">{{ type.emoji }}</span>
                                                <span class="text-xs font-medium">{{ type.label }}</span>
                                            </button>
                                        </div>
                                        <p v-if="errors.type" class="text-sm text-red-500 animate-pulse">{{ errors.type
                                        }}</p>
                                    </div>

                                    <!-- Titre -->
                                    <div class="space-y-2">
                                        <label class="block text-sm font-medium text-forest-700">
                                            <span class="flex items-center space-x-2">
                                                <span>📝</span>
                                                <span>Titre de l'adresse</span>
                                            </span>
                                        </label>
                                        <input v-model="formData.title" type="text" :class="[
                                            'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                            'bg-white/80 backdrop-blur-sm',
                                            errors.title ? 'border-red-300' : 'border-nature-200/50'
                                        ]" placeholder="Ex: Maison, Bureau, Famille..." maxlength="50" />
                                        <p v-if="errors.title" class="text-sm text-red-500 animate-pulse">{{
                                            errors.title }}</p>
                                    </div>
                                </div>

                                <!-- Adresse par défaut -->
                                <div class="mt-4">
                                    <label
                                        class="flex items-center space-x-3 p-3 rounded-xl border border-nature-200/50 
                               bg-white/50 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ease-organic">
                                        <input v-model="formData.isDefault" type="checkbox"
                                            class="w-5 h-5 text-primary rounded border-nature-300 focus:ring-primary/30">
                                        <div class="flex-1">
                                            <p class="font-medium text-forest-800">Définir comme adresse par défaut</p>
                                            <p class="text-sm text-nature-500">Utilisée automatiquement pour les
                                                commandes</p>
                                        </div>
                                        <span class="text-xl">⭐</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Informations personnelles -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft 
                         border border-nature-200/50 transform transition-all duration-500 ease-organic">
                                <div class="flex items-center space-x-3 mb-4">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-nature-100 
                              flex items-center justify-center">
                                        <span class="text-xl">👤</span>
                                    </div>
                                    <h3 class="text-lg font-bold text-forest-800">Destinataire</h3>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Prénom -->
                                    <div class="space-y-2">
                                        <label class="block text-sm font-medium text-forest-700">Prénom</label>
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
                                        <label class="block text-sm font-medium text-forest-700">Nom</label>
                                        <input v-model="formData.lastName" type="text" :class="[
                                            'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                            'bg-white/80 backdrop-blur-sm',
                                            errors.lastName ? 'border-red-300' : 'border-nature-200/50'
                                        ]" placeholder="Votre nom" />
                                        <p v-if="errors.lastName" class="text-sm text-red-500 animate-pulse">{{
                                            errors.lastName }}</p>
                                    </div>

                                    <!-- Entreprise (optionnel) -->
                                    <div class="space-y-2 md:col-span-2">
                                        <label class="block text-sm font-medium text-forest-700">
                                            Entreprise (optionnel)
                                        </label>
                                        <input v-model="formData.company" type="text" class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all duration-300 ease-organic" placeholder="Nom de votre entreprise" />
                                    </div>
                                </div>
                            </div>

                            <!-- Adresse physique -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft 
                         border border-nature-200/50 transform transition-all duration-500 ease-organic">
                                <div class="flex items-center space-x-3 mb-4">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-nature-100 
                              flex items-center justify-center">
                                        <span class="text-xl">🏠</span>
                                    </div>
                                    <h3 class="text-lg font-bold text-forest-800">Adresse physique</h3>
                                </div>

                                <div class="space-y-6">
                                    <!-- Rue -->
                                    <div class="space-y-2">
                                        <label
                                            class="text-sm font-medium text-forest-700 flex items-center space-x-2">
                                            <span>🛣️</span>
                                            <span>Adresse</span>
                                        </label>
                                        <input v-model="formData.street" type="text" :class="[
                                            'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                            'bg-white/80 backdrop-blur-sm',
                                            errors.street ? 'border-red-300' : 'border-nature-200/50'
                                        ]" placeholder="Numéro et nom de rue" />
                                        <p v-if="errors.street" class="text-sm text-red-500 animate-pulse">{{
                                            errors.street }}</p>
                                    </div>

                                    <!-- Complément d'adresse -->
                                    <div class="space-y-2">
                                        <label class="block text-sm font-medium text-forest-700">
                                            Complément d'adresse (optionnel)
                                        </label>
                                        <input v-model="formData.street2" type="text" class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all duration-300 ease-organic" placeholder="Appartement, étage, bâtiment..." />
                                    </div>

                                    <!-- Ville, Code postal, Pays -->
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <!-- Ville -->
                                        <div class="space-y-2">
                                            <label
                                                class="block text-sm font-medium text-forest-700 flex items-center space-x-2">
                                                <span>🏙️</span>
                                                <span>Ville</span>
                                            </label>
                                            <input v-model="formData.city" type="text" :class="[
                                                'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                                'bg-white/80 backdrop-blur-sm',
                                                errors.city ? 'border-red-300' : 'border-nature-200/50'
                                            ]" placeholder="Votre ville" />
                                            <p v-if="errors.city" class="text-sm text-red-500 animate-pulse">{{
                                                errors.city }}</p>
                                        </div>

                                        <!-- Code postal -->
                                        <div class="space-y-2">
                                            <label
                                                class="block text-sm font-medium text-forest-700 flex items-center space-x-2">
                                                <span>📮</span>
                                                <span>Code postal</span>
                                            </label>
                                            <input v-model="formData.postalCode" type="text" :class="[
                                                'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                                'bg-white/80 backdrop-blur-sm',
                                                errors.postalCode ? 'border-red-300' : 'border-nature-200/50'
                                            ]" placeholder="Ex: 75001" />
                                            <p v-if="errors.postalCode" class="text-sm text-red-500 animate-pulse">{{
                                                errors.postalCode }}</p>
                                        </div>

                                        <!-- Pays -->
                                        <div class="space-y-2">
                                            <label
                                                class="block text-sm font-medium text-forest-700 flex items-center space-x-2">
                                                <span>🌍</span>
                                                <span>Pays</span>
                                            </label>
                                            <select v-model="formData.country" :class="[
                                                'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                                'bg-white/80 backdrop-blur-sm',
                                                errors.country ? 'border-red-300' : 'border-nature-200/50'
                                            ]">
                                                <option value="">Sélectionnez un pays</option>
                                                <option v-for="country in countries" :key="country.code"
                                                    :value="country.code">
                                                    {{ country.flag }} {{ country.name }}
                                                </option>
                                            </select>
                                            <p v-if="errors.country" class="text-sm text-red-500 animate-pulse">{{
                                                errors.country }}</p>
                                        </div>
                                    </div>

                                    <!-- Région (dépend du pays) -->
                                    <div v-if="showRegionField" class="space-y-2">
                                        <label class="block text-sm font-medium text-forest-700">
                                            Région/Département (optionnel)
                                        </label>
                                        <select v-if="formData.country === 'CM' && cameroonRegions.length"
                                            v-model="formData.region" class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                   transition-all duration-300 ease-organic">
                                            <option value="">Sélectionnez une région</option>
                                            <option v-for="region in cameroonRegions" :key="region" :value="region">
                                                {{ region }}
                                            </option>
                                        </select>
                                        <input v-else v-model="formData.region" type="text" class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                  transition-all duration-300 ease-organic" placeholder="Région ou département" />
                                    </div>
                                </div>
                            </div>

                            <!-- Contact et instructions -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft 
                         border border-nature-200/50 transform transition-all duration-500 ease-organic">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Téléphone -->
                                    <div class="space-y-2">
                                        <label
                                            class="block text-sm font-medium text-forest-700 flex items-center space-x-2">
                                            <span>📱</span>
                                            <span>Téléphone</span>
                                        </label>
                                        <input v-model="formData.phone" type="tel" :class="[
                                            'w-full px-4 py-3 rounded-xl border transition-all duration-300 ease-organic',
                                            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                            'bg-white/80 backdrop-blur-sm',
                                            errors.phone ? 'border-red-300' : 'border-nature-200/50'
                                        ]" placeholder="+237 6 XX XX XX XX" />
                                        <p v-if="errors.phone" class="text-sm text-red-500 animate-pulse">{{
                                            errors.phone }}</p>
                                    </div>

                                    <!-- Instructions -->
                                    <div class="space-y-2">
                                        <label
                                            class="block text-sm font-medium text-forest-700 flex items-center space-x-2">
                                            <span>📝</span>
                                            <span>Instructions de livraison</span>
                                        </label>
                                        <textarea v-model="formData.instructions" rows="3" class="w-full px-4 py-3 rounded-xl border border-nature-200/50 bg-white/80 backdrop-blur-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all duration-300 ease-organic"
                                            placeholder="Code d'entrée, étage, indications spéciales..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
                                <button type="button" @click="handleCancel" class="px-8 py-3 bg-gradient-to-r from-nature-100 to-nature-200 text-forest-700 font-semibold rounded-xl
                               border border-nature-300/50 shadow-soft transform hover:scale-105 active:scale-95
                               transition-all duration-500 ease-organic flex items-center space-x-3 group">
                                    <span
                                        class="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
                                    <span>Annuler</span>
                                </button>

                                <div class="flex gap-4">
                                    <button type="button" @click="handleReset" class="px-8 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-semibold rounded-xl
                                 border border-orange-200/50 shadow-soft transform hover:scale-105 active:scale-95
                                 transition-all duration-500 ease-organic flex items-center space-x-3 group">
                                        <span
                                            class="text-lg group-hover:rotate-180 transition-transform duration-500">🔄</span>
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
                                        <span class="text-white">{{ isSubmitting ? 'Enregistrement...' : (isEditing ?
                                            'Mettre à jour' : 'Ajouter l\'adresse') }}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
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
                            <p class="font-medium text-forest-800">{{ isEditing ? 'Adresse mise à jour' : 'Adresse ajoutée' }} avec succès !</p>
                            <p class="text-sm text-nature-600">Vos modifications ont été sauvegardées</p>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { AddressFormData, AddressType } from '../types'
import { useCustomerStore } from '../stores/useCustomerStore'

// Props
const props = defineProps<{
    addressId?: string
    initialData?: AddressFormData
}>()

// Émits
const emit = defineEmits<{
    saved: [data: any]
    cancel: []
}>()

// Store
const customerStore = useCustomerStore()

// État
const isEditing = ref(!!props.addressId)
const isSubmitting = ref(false)
const showSuccess = ref(false)
const geolocationLoading = ref(false)
const errors = reactive<Record<string, string>>({})

// Données du formulaire
const formData = reactive<AddressFormData>({
    type: 'DELIVERY',
    title: '',
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    street2: '',
    city: '',
    postalCode: '',
    country: 'CM',
    region: '',
    phone: '',
    isDefault: false,
    instructions: ''
})

// Types d'adresse
const addressTypes = [
    { value: 'DELIVERY' as AddressType, label: 'Livraison', emoji: '🚚' },
    { value: 'BILLING' as AddressType, label: 'Facturation', emoji: '🧾' },
    { value: 'BOTH' as AddressType, label: 'Les deux', emoji: '🏠' }
]

// Données de localisation
const countries = [
    { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
    { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
]

const cameroonRegions = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
    'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
]

const locationEmojis = ['📍', '🏠', '🏢', '🏡', '🏘️', '🌳', '🚚', '🗺️']

// Computed
const showRegionField = computed(() => {
    return ['CM', 'FR', 'CA'].includes(formData.country)
})

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

// Initialisation
onMounted(async () => {
    if (props.initialData) {
        Object.assign(formData, props.initialData)
    } else if (props.addressId) {
        await loadAddress(props.addressId)
    } else {
        // Pré-remplir avec les infos du profil
        if (customerStore.profile) {
            formData.firstName = customerStore.profile.firstName
            formData.lastName = customerStore.profile.lastName
            formData.phone = customerStore.profile.phone || ''
        }
    }
})

// Charger une adresse existante
const loadAddress = async (id: string) => {
    try {
        const address = await customerStore.fetchAddress(id)
        if (address) {
            formData.type = address.type
            formData.title = address.title
            formData.firstName = address.firstName
            formData.lastName = address.lastName
            formData.company = address.company || ''
            formData.street = address.street
            formData.street2 = address.street2 || ''
            formData.city = address.city
            formData.postalCode = address.postalCode
            formData.country = address.country
            formData.region = address.region || ''
            formData.phone = address.phone
            formData.isDefault = address.isDefault
            formData.instructions = address.instructions || ''
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'adresse:', error)
    }
}

// Géolocalisation
const getCurrentLocation = () => {
    if (!navigator.geolocation) {
        errors.geolocation = 'La géolocalisation n\'est pas supportée par votre navigateur'
        return
    }

    geolocationLoading.value = true

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords

                // Utiliser un service de géocodage inversé
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                )

                if (response.ok) {
                    const data = await response.json()
                    const address = data.address

                    // Mettre à jour le formulaire
                    formData.street = address.road || address.pedestrian || ''
                    formData.city = address.city || address.town || address.village || ''
                    formData.postalCode = address.postcode || ''
                    formData.country = address.country_code?.toUpperCase() || 'CM'

                    if (address.state) {
                        formData.region = address.state
                    }
                }
            } catch (error) {
                console.error('Erreur lors du géocodage inversé:', error)
            } finally {
                geolocationLoading.value = false
            }
        },
        (error) => {
            console.error('Erreur de géolocalisation:', error)
            errors.geolocation = 'Impossible d\'obtenir votre position'
            geolocationLoading.value = false
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    )
}

// Validation
const validateForm = (): boolean => {
    // Réinitialiser les erreurs
    Object.keys(errors).forEach(key => delete errors[key])

    let isValid = true

    // Type
    if (!formData.type) {
        errors.type = 'Le type d\'adresse est requis'
        isValid = false
    }

    // Titre
    if (!formData.title.trim()) {
        errors.title = 'Le titre est requis'
        isValid = false
    } else if (formData.title.length < 2) {
        errors.title = 'Le titre doit contenir au moins 2 caractères'
        isValid = false
    }

    // Prénom
    if (!formData.firstName.trim()) {
        errors.firstName = 'Le prénom est requis'
        isValid = false
    } else if (formData.firstName.length < 2) {
        errors.firstName = 'Le prénom doit contenir au moins 2 caractères'
        isValid = false
    }

    // Nom
    if (!formData.lastName.trim()) {
        errors.lastName = 'Le nom est requis'
        isValid = false
    } else if (formData.lastName.length < 2) {
        errors.lastName = 'Le nom doit contenir au moins 2 caractères'
        isValid = false
    }

    // Rue
    if (!formData.street.trim()) {
        errors.street = 'L\'adresse est requise'
        isValid = false
    } else if (formData.street.length < 5) {
        errors.street = 'L\'adresse doit contenir au moins 5 caractères'
        isValid = false
    }

    // Ville
    if (!formData.city.trim()) {
        errors.city = 'La ville est requise'
        isValid = false
    } else if (formData.city.length < 2) {
        errors.city = 'La ville doit contenir au moins 2 caractères'
        isValid = false
    }

    // Code postal
    if (!formData.postalCode.trim()) {
        errors.postalCode = 'Le code postal est requis'
        isValid = false
    } else if (!/^[0-9]{4,10}$/.test(formData.postalCode.replace(/\s/g, ''))) {
        errors.postalCode = 'Code postal invalide'
        isValid = false
    }

    // Pays
    if (!formData.country) {
        errors.country = 'Le pays est requis'
        isValid = false
    }

    // Téléphone
    if (!formData.phone.trim()) {
        errors.phone = 'Le téléphone est requis'
        isValid = false
    } else if (!/^\+?[0-9\s\-\(\)]{8,20}$/.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Numéro de téléphone invalide'
        isValid = false
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
        let result

        if (isEditing.value && props.addressId) {
            // Mise à jour
            const updateData = customerStore.prepareAddressUpdateData(formData)
            result = await customerStore.updateAddress(props.addressId, updateData)
        } else {
            // Création
            const createData = customerStore.prepareAddressCreateData(formData)
            result = await customerStore.addAddress(createData)
        }

        if (result) {
            // Afficher le message de succès
            showSuccess.value = true
            setTimeout(() => {
                showSuccess.value = false
            }, 3000)

            // Émettre l'événement
            emit('saved', result)
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
    if (isEditing.value && props.initialData) {
        Object.assign(formData, props.initialData)
    } else {
        // Réinitialiser aux valeurs par défaut
        formData.type = 'DELIVERY'
        formData.title = ''
        formData.firstName = customerStore.profile?.firstName || ''
        formData.lastName = customerStore.profile?.lastName || ''
        formData.company = ''
        formData.street = ''
        formData.street2 = ''
        formData.city = ''
        formData.postalCode = ''
        formData.country = 'CM'
        formData.region = ''
        formData.phone = customerStore.profile?.phone || ''
        formData.isDefault = false
        formData.instructions = ''
    }

    Object.keys(errors).forEach(key => delete errors[key])
}

// Annuler
const handleCancel = () => {
    emit('cancel')
}

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

.animate-slide-in-left {
    animation: slide-in-left 0.6s ease-organic;
}

.animate-slide-in-right {
    animation: slide-in-right 0.6s ease-organic;
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

@keyframes slide-in-left {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slide-in-right {
    from {
        opacity: 0;
        transform: translateX(20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Support pour les réductions de mouvement */
@media (prefers-reduced-motion: reduce) {

    .leaf-float,
    .animate-slide-in-down,
    .animate-slide-in-up,
    .animate-slide-in-left,
    .animate-slide-in-right,
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

.shadow-inner {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>