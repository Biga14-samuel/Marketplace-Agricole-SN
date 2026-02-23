<template>
    <div class="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
        <!-- Arrière-plan avec dégradé et texture -->
        <div class="absolute inset-0 bg-gradient-to-br from-green-50 via-cream-100 to-amber-50 z-0"></div>

        <!-- Texture filigrane de feuilles -->
        <div class="absolute inset-0 opacity-5 z-0">
            <div class="absolute inset-0 leaf-pattern"></div>
        </div>

        <!-- Animation de feuilles flottantes -->
        <div class="absolute inset-0 overflow-hidden z-0">
            <div v-for="i in 8" :key="i" class="absolute leaf-float" :style="leafStyle(i)" :class="`leaf-${i}`">
                <svg class="w-full h-full text-green-200 opacity-30" viewBox="0 0 100 100">
                    <path d="M50,10 C70,10 85,30 85,50 C85,70 70,90 50,90 C30,90 15,70 15,50 C15,30 30,10 50,10 Z"
                        fill="currentColor" />
                </svg>
            </div>
        </div>

        <!-- Conteneur principal -->
        <div class="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden 
                shadow-2xl transform transition-all duration-800 ease-organic">

            <!-- Partie gauche - Illustration gourmande -->
            <div class="lg:w-1/2 bg-gradient-to-br from-green-100 to-amber-50 p-8 lg:p-12 
                  flex flex-col justify-center items-center relative overflow-hidden">

                <!-- Overlay texturé -->
                <div class="absolute inset-0 bg-paper-texture opacity-10"></div>

                <!-- Contenu de l'illustration -->
                <div class="relative z-10 text-center space-y-8 transform transition-all duration-700 ease-organic">

                    <!-- Logo -->
                    <div class="space-y-4">
                        <div class="flex justify-center items-center space-x-3 transform hover:scale-105 
                        transition-transform duration-500 ease-organic">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 
                          flex items-center justify-center shadow-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h1 class="text-4xl font-bold text-emerald-900 font-display">MarketFraîche</h1>
                        </div>
                        <p class="text-emerald-700 text-lg italic">Vos produits frais, directement des producteurs</p>
                    </div>

                    <!-- Illustration principale -->
                    <div class="relative transform hover:scale-105 transition-all duration-700 ease-organic">
                        <div class="w-64 h-64 mx-auto relative">
                            <!-- Potager circulaire -->
                            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-200 to-green-300 
                          shadow-inner flex items-center justify-center">
                                <div class="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 
                            flex items-center justify-center relative overflow-hidden">

                                    <!-- Légumes animés -->
                                    <div v-for="veg in vegetables" :key="veg.id"
                                        class="absolute transform animate-float" :style="{
                                            top: veg.top + '%',
                                            left: veg.left + '%',
                                            animationDelay: veg.delay + 's'
                                        }">
                                        <component :is="veg.component" class="w-8 h-8" :class="veg.color" />
                                    </div>

                                    <!-- Panier au centre -->
                                    <div
                                        class="relative z-10 transform hover:rotate-12 transition-transform duration-500 ease-organic">
                                        <svg class="w-16 h-16 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Messages d'accroche -->
                    <div class="space-y-4">
                        <div class="flex items-center space-x-3 transform hover:translate-x-2 
                        transition-transform duration-400 ease-organic">
                            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span class="text-emerald-800 font-medium">Produits 100% locaux & de saison</span>
                        </div>
                        <div class="flex items-center space-x-3 transform hover:translate-x-2 
                        transition-transform duration-400 ease-organic" style="transition-delay: 100ms">
                            <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg class="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span class="text-emerald-800 font-medium">Directement des producteurs camerounais</span>
                        </div>
                        <div class="flex items-center space-x-3 transform hover:translate-x-2 
                        transition-transform duration-400 ease-organic" style="transition-delay: 200ms">
                            <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <svg class="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span class="text-emerald-800 font-medium">Livraison ultra-fraîche à votre porte</span>
                        </div>
                    </div>
                </div>

                <!-- Décoration végétale dans les coins -->
                <div class="absolute top-4 left-4 w-16 h-16 text-green-300 opacity-30">
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <path
                            d="M50,10 Q70,5 85,25 Q95,40 90,60 Q85,80 65,85 Q45,90 30,75 Q15,60 20,40 Q25,20 40,15 Z" />
                    </svg>
                </div>
                <div class="absolute bottom-4 right-4 w-20 h-20 text-amber-300 opacity-20">
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <path
                            d="M50,10 Q70,5 85,25 Q95,40 90,60 Q85,80 65,85 Q45,90 30,75 Q15,60 20,40 Q25,20 40,15 Z" />
                    </svg>
                </div>
            </div>

            <!-- Partie droite - Formulaire de connexion -->
            <div class="lg:w-1/2 bg-white/90 backdrop-blur-sm p-8 lg:p-12 
                  flex flex-col justify-center relative overflow-hidden">

                <!-- Texture papier sur le formulaire -->
                <div class="absolute inset-0 bg-paper-texture opacity-5"></div>

                <div class="relative z-10 space-y-8 transform transition-all duration-700 ease-organic">

                    <!-- En-tête du formulaire -->
                    <div class="space-y-4 text-center lg:text-left">
                        <h2 class="text-3xl lg:text-4xl font-bold text-emerald-900 font-display 
                       transform transition-all duration-500 ease-organic">
                            Bienvenue<span class="text-emerald-600 animate-pulse-slow">•</span>
                        </h2>
                        <p class="text-emerald-700/80 text-lg">
                            Accédez à votre espace pour gérer vos commandes et découvrir les nouveautés
                        </p>
                    </div>

                    <!-- Messages d'état -->
                    <div v-if="errorMessage"
                        class="p-4 rounded-2xl bg-red-50 border border-red-200 transform transition-all duration-500 ease-organic">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span class="text-red-700 font-medium">{{ errorMessage }}</span>
                        </div>
                    </div>

                    <div v-if="successMessage"
                        class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 transform transition-all duration-500 ease-organic">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span class="text-emerald-700 font-medium">{{ successMessage }}</span>
                        </div>
                    </div>

                    <!-- Formulaire -->
                    <form @submit.prevent="handleLogin"
                        class="space-y-6 transform transition-all duration-500 ease-organic">

                        <!-- Champ Email -->
                        <div class="space-y-2">
                            <label class="block text-emerald-800 font-medium">
                                <div class="flex items-center space-x-2 mb-2">
                                    <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span>Adresse email</span>
                                </div>
                            </label>
                            <div class="relative group">
                                <div class="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl 
                            transform group-hover:scale-105 transition-all duration-400 ease-organic 
                            opacity-0 group-hover:opacity-100"></div>
                                <input v-model="form.email" type="email" required placeholder="votre@email.com" class="relative w-full px-5 py-4 bg-white/80 rounded-2xl border-2 border-emerald-100 
                              focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:ring-opacity-50 
                              outline-none transition-all duration-400 ease-organic 
                              placeholder-emerald-300 text-emerald-900
                              hover:shadow-lg hover:border-emerald-300">
                            </div>
                        </div>

                        <!-- Champ Mot de passe -->
                        <div class="space-y-2">
                            <label class="block text-emerald-800 font-medium">
                                <div class="flex items-center space-x-2 mb-2">
                                    <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Mot de passe</span>
                                </div>
                            </label>
                            <div class="relative group">
                                <div class="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl 
                            transform group-hover:scale-105 transition-all duration-400 ease-organic 
                            opacity-0 group-hover:opacity-100"></div>
                                <div class="relative flex items-center">
                                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                                        placeholder="Votre mot de passe" class="w-full px-5 py-4 bg-white/80 rounded-2xl border-2 border-emerald-100 
                                focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:ring-opacity-50 
                                outline-none transition-all duration-400 ease-organic 
                                placeholder-emerald-300 text-emerald-900 pr-12
                                hover:shadow-lg hover:border-emerald-300">
                                    <button type="button" @click="showPassword = !showPassword" class="absolute right-4 p-2 rounded-full hover:bg-emerald-50 
                                 transition-all duration-300 ease-organic">
                                        <svg v-if="showPassword" class="w-5 h-5 text-emerald-600" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                                clip-rule="evenodd" />
                                            <path
                                                d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                        <svg v-else class="w-5 h-5 text-emerald-600" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fill-rule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Options supplémentaires -->
                        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                            <label class="flex items-center space-x-3 cursor-pointer group">
                                <div class="relative">
                                    <input type="checkbox" v-model="form.rememberMe" class="sr-only peer">
                                    <div class="w-6 h-6 bg-white border-2 border-emerald-200 rounded-lg 
                              peer-checked:bg-emerald-500 peer-checked:border-emerald-500
                              transition-all duration-300 ease-organic
                              group-hover:border-emerald-400
                              flex items-center justify-center">
                                        <svg v-if="form.rememberMe" class="w-4 h-4 text-white" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <span class="text-emerald-700 group-hover:text-emerald-900 
                             transition-colors duration-300 ease-organic">
                                    Se souvenir de moi
                                </span>
                            </label>

                            <router-link to="/forgot-password" class="text-emerald-600 hover:text-emerald-800 font-medium 
                                  transform hover:scale-105 transition-all duration-300 ease-organic
                                  flex items-center space-x-2">
                                <span>Mot de passe oublié ?</span>
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </router-link>
                        </div>

                        <!-- Bouton de connexion -->
                        <button type="submit" :disabled="loading" class="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 
                           hover:from-emerald-600 hover:to-green-700 
                           text-white font-semibold rounded-2xl shadow-lg 
                           transform hover:scale-105 active:scale-95 
                           transition-all duration-500 ease-organic
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center space-x-3
                           relative overflow-hidden group">

                            <!-- Effet de brillance -->
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] 
                          transition-transform duration-1000 ease-organic"></div>

                            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{{ loading ? 'Connexion en cours...' : 'Se connecter' }}</span>
                        </button>

                        <!-- Séparateur -->
                        <div class="relative flex items-center justify-center">
                            <div
                                class="flex-grow h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent">
                            </div>
                            <span class="px-4 text-emerald-500 font-medium">ou</span>
                            <div
                                class="flex-grow h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent">
                            </div>
                        </div>

                        <!-- Bouton d'inscription -->
                        <router-link to="/register" class="w-full py-4 px-6 bg-gradient-to-r from-amber-100 to-orange-50 
                                hover:from-amber-200 hover:to-orange-100 
                                text-amber-800 font-semibold rounded-2xl border-2 border-amber-200
                                transform hover:scale-105 active:scale-95 
                                transition-all duration-500 ease-organic
                                flex items-center justify-center space-x-3
                                shadow-md hover:shadow-lg">

                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>Créer un compte</span>
                        </router-link>
                    </form>

                    <!-- Pied de page -->
                    <div class="pt-6 border-t border-emerald-100 space-y-4">
                        <p class="text-center text-emerald-600 text-sm">
                            En vous connectant, vous acceptez nos
                            <a href="#" class="font-medium hover:text-emerald-800 underline 
                               transition-colors duration-300 ease-organic">
                                Conditions d'utilisation
                            </a> et notre
                            <a href="#" class="font-medium hover:text-emerald-800 underline 
                               transition-colors duration-300 ease-organic">
                                Politique de confidentialité
                            </a>
                        </p>

                        <!-- Bouton accès public -->
                        <div class="text-center">
                            <router-link to="/" class="inline-flex items-center space-x-2 text-emerald-700 
                                  hover:text-emerald-900 font-medium
                                  transform hover:scale-105 transition-all duration-300 ease-organic">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>Continuer sans compte → Découvrir les produits</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { LoginCredentials } from '@/modules/auth/types/auth.types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// État du formulaire
const form = reactive<LoginCredentials & { rememberMe?: boolean }>({
    email: '',
    password: '',
    rememberMe: false
})

// États UI
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Légumes pour l'animation
const vegetables = ref([
    { id: 1, top: 20, left: 20, delay: 0, color: 'text-red-400', component: 'TomatoIcon' },
    { id: 2, top: 60, left: 10, delay: 0.5, color: 'text-green-500', component: 'CarrotIcon' },
    { id: 3, top: 40, left: 70, delay: 1, color: 'text-purple-400', component: 'EggplantIcon' },
    { id: 4, top: 80, left: 60, delay: 1.5, color: 'text-yellow-500', component: 'PepperIcon' },
])

// Composants SVG pour les légumes
const TomatoIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
  </svg>`
}

const CarrotIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.1 10.9l-6.6-6.6c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l6.6 6.6-1.4 1.4-6.6-6.6c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l6.6 6.6-1.4 1.4-6.6-6.6c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l6.6 6.6 1.4-1.4 6.6 6.6c.6.6 1.5.6 2.1 0 .6-.6.6-1.5 0-2.1l-6.6-6.6 1.4-1.4 6.6 6.6c.6.6 1.5.6 2.1 0 .6-.6.6-1.5 0-2.1l-6.6-6.6-1.4 1.4z"/>
  </svg>`
}

const EggplantIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5zm-4 12H9v-2h6v2zm0-4H9v-2h6v2zm0-4H9V7h6v2z"/>
  </svg>`
}

const PepperIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4z"/>
  </svg>`
}

// Style pour les feuilles flottantes
const leafStyle = (index: number) => {
    const size = 40 + Math.random() * 40
    const duration = 20 + Math.random() * 10
    const delay = Math.random() * 5

    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
    }
}

// Gestion de la connexion
const handleLogin = async () => {
    if (!form.email || !form.password) {
        errorMessage.value = 'Veuillez remplir tous les champs'
        return
    }

    loading.value = true
    errorMessage.value = ''

    try {
        await authStore.login({
            email: form.email,
            password: form.password
        })
        successMessage.value = 'Connexion réussie ! Redirection...'

        // Redirection: utiliser le paramètre `redirect` si présent,
        // sinon rediriger en fonction du rôle de l'utilisateur
        setTimeout(() => {
            const redirectPath = (route.query.redirect as string) || null

            if (redirectPath && redirectPath !== '/auth/login') {
                router.push(redirectPath)
                return
            }

            // Récupérer l'utilisateur depuis le store
            const user = authStore.user
            
            if (!user) {
                console.error('❌ User non défini après login')
                router.push('/')
                return
            }
            
            const role = user?.roles?.[0]?.name || 'Customer'

            console.log('👤 Utilisateur:', user.email)
            console.log('🎭 Rôle:', role)
            console.log('✅ isAuthenticated:', authStore.isAuthenticated)

            // Redirection basée sur le rôle
            try {
                if (role === 'Producer') {
                    console.log('🔄 Redirection vers /profile/producer')
                    router.push('/profile/producer')
                } else if (role === 'Admin') {
                    console.log('🔄 Redirection vers /admin/dashboard')
                    router.push('/admin/dashboard')
                } else {
                    console.log('🔄 Redirection vers /profile/customer')
                    router.push('/profile/customer')
                }
            } catch (navError) {
                console.error('❌ Erreur de navigation:', navError)
                router.push('/')
            }
        }, 800)

    } catch (error: unknown) {
        const err = error as any
        errorMessage.value = err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            'Identifiants incorrects. Veuillez réessayer.'
    } finally {
        loading.value = false
    }
}

// Animation d'entrée de la page
onMounted(() => {
    // Pas de pré-remplissage pour éviter d'écraser les saisies utilisateur
})
</script>

<style scoped>
/* Animation de flottement pour les légumes */
@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Animation lente pour le point pulsant */
@keyframes pulse-slow {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
}

/* Pattern de feuilles en filigrane */
.leaf-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,10 Q70,5 85,25 Q95,40 90,60 Q85,80 65,85 Q45,90 30,75 Q15,60 20,40 Q25,20 40,15 Z' fill='%234ade80' fill-opacity='0.03'/%3E%3C/svg%3E");
    background-size: 200px;
}

/* Animation de feuilles flottantes */
@keyframes leafFloat {
    0% {
        transform: translateY(0) rotate(0deg) translateX(0);
        opacity: 0.3;
    }

    25% {
        transform: translateY(-20px) rotate(90deg) translateX(20px);
        opacity: 0.5;
    }

    50% {
        transform: translateY(-40px) rotate(180deg) translateX(0);
        opacity: 0.3;
    }

    75% {
        transform: translateY(-20px) rotate(270deg) translateX(-20px);
        opacity: 0.5;
    }

    100% {
        transform: translateY(0) rotate(360deg) translateX(0);
        opacity: 0.3;
    }
}

.leaf-float {
    animation: leafFloat linear infinite;
    pointer-events: none;
}

/* Texture papier */
.bg-paper-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none' stroke='%23000' stroke-width='0.5' stroke-opacity='0.05'/%3E%3C/svg%3E");
    background-size: 20px;
}

/* Courbe de bézier personnalisée pour les transitions organiques */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transitions spécifiques pour différents éléments */
.transition-all {
    transition-property: all;
}

.duration-400 {
    transition-duration: 400ms;
}

.duration-500 {
    transition-duration: 500ms;
}

.duration-700 {
    transition-duration: 700ms;
}

.duration-800 {
    transition-duration: 800ms;
}

/* Effet de brillance sur le bouton */
@keyframes shine {
    0% {
        transform: translateX(-100%) skewX(-15deg);
    }

    100% {
        transform: translateX(100%) skewX(-15deg);
    }
}

.group:hover .group-hover\:translate-x-\[100\%\] {
    animation: shine 1s ease-organic;
}

/* Police personnalisée pour les titres */
.font-display {
    font-family: 'Playfair Display', Georgia, serif;
}
</style>