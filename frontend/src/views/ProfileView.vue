<template>
    <div class="min-h-screen relative overflow-hidden">
        <!-- Arrière-plan avec dégradé organique -->
        <div class="absolute inset-0 bg-gradient-to-br from-nature-50 via-cream-100/80 to-blue-50/30 z-0"></div>

        <!-- Texture filigrane subtile -->
        <div class="absolute inset-0 opacity-5 z-0 bg-leaf-pattern bg-[length:250px]"></div>

        <!-- Bouton retour -->
        <router-link to="/" class="absolute top-6 left-6 z-20 flex items-center space-x-2 group">
            <div class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center 
            shadow-soft group-hover:shadow-medium transform group-hover:scale-110 
            transition-all duration-500 ease-organic">
                <svg class="w-5 h-5 text-nature-600 group-hover:text-primary transition-colors duration-300" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </div>
            <span class="text-nature-700 font-medium opacity-0 group-hover:opacity-100 
             transform translate-x-[-10px] group-hover:translate-x-0 
             transition-all duration-500 ease-organic">
                Accueil
            </span>
        </router-link>

        <!-- Contenu principal -->
        <div class="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-float 
            border border-nature-200/50 relative overflow-hidden">

                <!-- Texture papier subtile -->
                <div class="absolute inset-0 bg-paper-texture bg-[length:15px] opacity-[0.02]"></div>

                <!-- Cercles organiques animés -->
                <div class="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-r from-blue-100/30 to-sky-100/20 
              animate-pulse-slow"></div>
                <div class="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-r from-nature-100/20 to-cream-100/20 
              animate-pulse-slow" style="animation-delay: 1s"></div>

                <div class="relative z-10">
                    <!-- En-tête -->
                    <div class="text-center mb-10 animate-slide-in-down">
                        <div class="inline-flex items-center justify-center space-x-4 mb-6">
                            <div class="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-nature-500 
                    flex items-center justify-center shadow-lg">
                                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-4xl font-bold text-forest-900 font-display">Mon Profil</h1>
                                <p class="text-nature-600">Gérez vos informations personnelles</p>
                            </div>
                        </div>
                    </div>

                    <!-- Message en construction -->
                    <div class="bg-gradient-to-r from-blue-50/50 to-sky-50/50 rounded-2xl p-8 mb-8 
                border border-blue-200/50 animate-slide-in-up" style="animation-delay: 0.2s">
                        <div class="flex items-center space-x-4">
                            <div class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-sky-100 
                    flex items-center justify-center flex-shrink-0">
                                <svg class="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-forest-800 mb-2">Page en construction</h2>
                                <p class="text-nature-600">
                                    Nous travaillons activement à la création de votre espace personnel.
                                    Vous pourrez bientôt gérer vos informations, vos commandes et vos préférences.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Fonctionnalités à venir -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style="animation-delay: 0.4s">
                        <div v-for="(feature, index) in upcomingFeatures" :key="index" class="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-nature-200/50
                     transform hover:scale-105 transition-all duration-500 ease-organic">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary/10 to-nature-100 
                      flex items-center justify-center flex-shrink-0">
                                    <component :is="feature.icon" class="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-forest-800 mb-1">{{ feature.title }}</h3>
                                    <p class="text-sm text-nature-600">{{ feature.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bouton de déconnexion -->
                    <div class="mt-10 text-center animate-fade-in" style="animation-delay: 0.6s">
                        <button @click="handleLogout" class="px-8 py-3 bg-gradient-to-r from-nature-100 to-green-100 hover:from-nature-200 hover:to-green-200
                     text-nature-700 font-semibold rounded-xl border border-nature-300
                     transform hover:scale-105 active:scale-95 transition-all duration-500 ease-organic
                     flex items-center justify-center space-x-3 mx-auto">

                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Se déconnecter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const upcomingFeatures = [
    {
        icon: 'OrderIcon',
        title: 'Historique des commandes',
        description: 'Suivez toutes vos commandes passées et en cours.'
    },
    {
        icon: 'AddressIcon',
        title: 'Adresses de livraison',
        description: 'Gérez vos adresses pour des livraisons facilitées.'
    },
    {
        icon: 'PaymentIcon',
        title: 'Moyens de paiement',
        description: 'Ajoutez et gérez vos cartes et moyens de paiement.'
    },
    {
        icon: 'NotificationIcon',
        title: 'Préférences de notification',
        description: 'Choisissez les notifications que vous souhaitez recevoir.'
    }
]

const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
}
</script>