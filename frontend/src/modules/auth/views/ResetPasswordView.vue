import { getErrorMessage } from '@/shared/utils/error-handler';
<template>
    <div class="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8">
        <!-- Arrière-plan avec dégradé organique -->
        <div class="absolute inset-0 bg-gradient-to-br from-nature-50 via-cream-100/80 to-emerald-50/30 z-0"></div>

        <!-- Texture filigrane subtile -->
        <div class="absolute inset-0 opacity-5 z-0 bg-leaf-pattern bg-[length:250px]"></div>

        <!-- Animation de particules organiques -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div v-for="i in 15" :key="i" class="absolute organic-particle" :style="particleStyle(i)"
                :class="particleType(i)">
            </div>
        </div>

        <!-- Bouton retour à la connexion -->
        <router-link to="/auth/login" class="absolute top-6 left-6 z-20 flex items-center space-x-2 group">
            <div class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center 
                  shadow-soft group-hover:shadow-medium transform group-hover:scale-110 
                  transition-all duration-500 ease-organic">
                <svg class="w-5 h-5 text-nature-600 group-hover:text-emerald-600 transition-colors duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </div>
            <span class="text-nature-700 font-medium opacity-0 group-hover:opacity-100 
                   transform translate-x-[-10px] group-hover:translate-x-0 
                   transition-all duration-500 ease-organic">
                Connexion
            </span>
        </router-link>

        <!-- Conteneur principal -->
        <div class="relative z-10 w-full max-w-md">
            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-float 
                  border border-nature-200/50 relative overflow-hidden">

                <!-- Texture papier subtile -->
                <div class="absolute inset-0 bg-paper-texture bg-[length:15px] opacity-[0.02]"></div>

                <!-- Cercles organiques animés en arrière-plan -->
                <div class="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-r from-emerald-100/30 to-green-100/20 
                    animate-pulse-slow"></div>
                <div class="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-r from-nature-100/20 to-cream-100/20 
                    animate-pulse-slow" style="animation-delay: 1s"></div>

                <div class="relative z-10">
                    <!-- En-tête -->
                    <div class="text-center mb-8 transform transition-all duration-700 ease-organic">
                        <div class="inline-flex items-center justify-center space-x-3 mb-6">
                            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 
                          flex items-center justify-center shadow-lg animate-bounce-soft">
                                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-4xl font-bold text-forest-900 font-display">
                                    Market<span class="text-emerald-600">Fraîche</span>
                                </h1>
                                <p class="text-nature-600">Nouveau mot de passe</p>
                            </div>
                        </div>

                        <p class="text-nature-700 max-w-md mx-auto">
                            Créez un nouveau mot de passe sécurisé pour votre compte.
                        </p>
                    </div>

                    <!-- Messages d'état -->
                    <div v-if="errorMessage" class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50/80 to-red-100/50 
                      border border-red-200 animate-slide-in-down">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-red-800">{{ errorMessage }}</p>
                                <p v-if="errorDetails" class="text-sm text-red-600 mt-1">{{ errorDetails }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="successMessage" class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-green-100/50 
                      border border-emerald-200 animate-slide-in-down">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-emerald-800">{{ successMessage }}</p>
                                <p class="text-sm text-emerald-600 mt-1">Redirection vers la connexion...</p>
                            </div>
                        </div>
                    </div>

                    <!-- État: Token invalide ou expiré -->
                    <div v-if="isTokenInvalid" class="space-y-6 text-center animate-fade-in">
                        <div class="flex justify-center mb-4">
                            <div class="w-24 h-24 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 
                          flex items-center justify-center">
                                <svg class="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <h2 class="text-2xl font-bold text-nature-800">Lien expiré ou invalide</h2>
                            <p class="text-nature-600">
                                Le lien de réinitialisation a expiré ou est invalide.
                            </p>
                            <p class="text-sm text-nature-500">
                                Veuillez demander un nouveau lien de réinitialisation.
                            </p>
                        </div>

                        <div class="pt-4 space-y-3">
                            <router-link to="/forgot-password"
                                class="btn-primary inline-flex items-center justify-center space-x-3 w-full">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>Nouvelle demande</span>
                            </router-link>

                            <router-link to="/auth/login"
                                class="btn-outline inline-flex items-center justify-center space-x-3 w-full">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>Retour à la connexion</span>
                            </router-link>
                        </div>

                        <div class="pt-6 border-t border-nature-200/50">
                            <p class="text-sm text-nature-500">
                                Si le problème persiste,
                                <a href="mailto:support@marketfraiche.com" class="text-emerald-600 hover:text-emerald-800 font-medium underline 
                          transition-colors duration-300 ease-organic">
                                    contactez notre support
                                </a>
                            </p>
                        </div>
                    </div>

                    <!-- État: Formulaire de réinitialisation -->
                    <div v-else-if="!isTokenInvalid" class="space-y-6 animate-fade-in">
                        <!-- Indicateur de progression -->
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-nature-700">Étape 2/2</span>
                            <span class="text-xs text-nature-500">Réinitialisation</span>
                        </div>
                        <div class="h-2 bg-nature-200 rounded-full overflow-hidden mb-6">
                            <div class="h-full bg-gradient-to-r from-emerald-400 to-green-500 
                          w-full animate-pulse-soft"></div>
                        </div>

                        <form @submit.prevent="handleResetPassword" class="space-y-6">
                            <!-- Champ Nouveau mot de passe -->
                            <div class="space-y-3">
                                <label class="block text-nature-800 font-medium">
                                    <div class="flex items-center space-x-2 mb-2">
                                        <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Nouveau mot de passe</span>
                                    </div>
                                </label>
                                <div class="relative group">
                                    <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-xl 
                              transform group-hover:scale-105 transition-all duration-400 ease-organic 
                              opacity-0 group-hover:opacity-100"></div>
                                    <div class="relative">
                                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                            required placeholder="Votre nouveau mot de passe" :disabled="isLoading"
                                            @input="checkPasswordStrength"
                                            class="input-organic w-full pr-12 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 
                                   rounded-full hover:bg-nature-100 transition-all duration-300 ease-organic
                                   disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg v-if="showPassword" class="w-5 h-5 text-nature-600" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                                    clip-rule="evenodd" />
                                                <path
                                                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                            <svg v-else class="w-5 h-5 text-nature-600" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fill-rule="evenodd"
                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <!-- Indicateur de force du mot de passe -->
                                <div v-if="form.password" class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-medium text-nature-700">Force du mot de passe</span>
                                        <span class="text-xs font-medium" :class="passwordStrengthColor">
                                            {{ passwordStrengthText }}
                                        </span>
                                    </div>
                                    <div class="h-2 bg-nature-200 rounded-full overflow-hidden">
                                        <div class="h-full transition-all duration-500 ease-organic"
                                            :class="passwordStrengthBarClass"
                                            :style="{ width: passwordStrength + '%' }"></div>
                                    </div>
                                    <ul class="text-xs text-nature-600 space-y-1">
                                        <li v-for="requirement in passwordRequirements" :key="requirement.key"
                                            class="flex items-center space-x-2">
                                            <svg class="w-3 h-3"
                                                :class="requirement.met ? 'text-emerald-500' : 'text-nature-300'"
                                                fill="currentColor" viewBox="0 0 20 20">
                                                <path v-if="requirement.met" fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                                <path v-else fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span :class="requirement.met ? 'text-nature-700' : 'text-nature-400'">
                                                {{ requirement.text }}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Champ Confirmation du mot de passe -->
                            <div class="space-y-3">
                                <label class="block text-nature-800 font-medium">
                                    <div class="flex items-center space-x-2 mb-2">
                                        <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Confirmer le mot de passe</span>
                                    </div>
                                </label>
                                <div class="relative group">
                                    <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-xl 
                              transform group-hover:scale-105 transition-all duration-400 ease-organic 
                              opacity-0 group-hover:opacity-100"></div>
                                    <div class="relative">
                                        <input v-model="form.confirmPassword"
                                            :type="showConfirmPassword ? 'text' : 'password'" required
                                            placeholder="Confirmez votre nouveau mot de passe" :disabled="isLoading"
                                            class="input-organic w-full pr-12 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 
                                   rounded-full hover:bg-nature-100 transition-all duration-300 ease-organic
                                   disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg v-if="showConfirmPassword" class="w-5 h-5 text-nature-600"
                                                fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                                    clip-rule="evenodd" />
                                                <path
                                                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                            <svg v-else class="w-5 h-5 text-nature-600" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fill-rule="evenodd"
                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <!-- Vérification de correspondance -->
                                <div v-if="form.confirmPassword" class="flex items-center space-x-2 text-sm">
                                    <svg v-if="form.password === form.confirmPassword" class="w-4 h-4 text-emerald-500"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <svg v-else class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span
                                        :class="form.password === form.confirmPassword ? 'text-emerald-600' : 'text-red-600'">
                                        {{ form.password === form.confirmPassword ?
                                            'Les mots de passe correspondent' :
                                        'Les mots de passe ne correspondent pas' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Conseils de sécurité -->
                            <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-green-50/50 
                          border border-emerald-200/50 space-y-3">
                                <h4 class="font-semibold text-emerald-800 flex items-center text-sm">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Créez un mot de passe sécurisé
                                </h4>
                                <ul class="text-xs text-nature-600 space-y-1">
                                    <li class="flex items-start space-x-2">
                                        <svg class="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Utilisez au moins 8 caractères</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <svg class="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Mélangez lettres, chiffres et symboles</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <svg class="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Évitez les informations personnelles</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Bouton de réinitialisation -->
                            <button type="submit" :disabled="isLoading || !formValid" class="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 
                             hover:from-emerald-600 hover:to-green-700 
                             text-white font-semibold rounded-xl shadow-lg 
                             transform hover:scale-[1.02] active:scale-95 
                             transition-all duration-500 ease-organic
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                             flex items-center justify-center space-x-3
                             relative overflow-hidden group">

                                <!-- Effet de brillance -->
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                            translate-x-[-100%] group-hover:translate-x-[100%] 
                            transition-transform duration-1000 ease-organic"></div>

                                <svg v-if="isLoading" class="w-5 h-5 animate-spin-slow" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-lg">
                                    {{ isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe' }}
                                </span>
                            </button>
                        </form>

                        <!-- Séparateur -->
                        <div class="relative flex items-center justify-center">
                            <div class="flex-grow h-px bg-gradient-to-r from-transparent via-nature-200 to-transparent">
                            </div>
                            <span class="px-4 text-nature-500 text-sm">Informations</span>
                            <div class="flex-grow h-px bg-gradient-to-r from-transparent via-nature-200 to-transparent">
                            </div>
                        </div>

                        <!-- Informations supplémentaires -->
                        <div class="text-center space-y-3">
                            <p class="text-sm text-nature-600">
                                Après la réinitialisation, vous serez automatiquement redirigé vers la page de
                                connexion.
                            </p>
                            <router-link to="/auth/login" class="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 
                                  font-medium transition-colors duration-300 ease-organic">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>Retour à la connexion</span>
                            </router-link>
                        </div>
                    </div>

                    <!-- État: Succès -->
                    <div v-else-if="isSuccess" class="space-y-6 text-center animate-slide-in-up">
                        <div class="flex justify-center mb-4">
                            <div class="relative">
                                <!-- Animation de succès -->
                                <div class="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 
                            flex items-center justify-center shadow-lg">
                                    <div class="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 
                              flex items-center justify-center animate-pulse-soft">
                                        <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <!-- Cercles animés -->
                                <div v-for="i in 3" :key="i"
                                    class="absolute inset-0 rounded-full border-2 border-emerald-300/50" :style="{
                                        animation: `ripple 2s ease-out infinite`,
                                        animationDelay: `${i * 0.5}s`
                                    }"></div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <h2 class="text-2xl font-bold text-nature-800">Mot de passe réinitialisé !</h2>
                            <p class="text-nature-600">
                                Votre mot de passe a été réinitialisé avec succès.
                            </p>
                            <p class="text-sm text-nature-500">
                                Vous allez être redirigé vers la page de connexion dans quelques secondes.
                            </p>
                        </div>

                        <div class="pt-4">
                            <div class="w-48 h-1 bg-nature-200 rounded-full overflow-hidden mx-auto">
                                <div class="h-full bg-gradient-to-r from-emerald-400 to-green-500 
                            animate-shimmer w-full"></div>
                            </div>
                        </div>

                        <div class="pt-4">
                            <router-link to="/auth/login"
                                class="btn-primary inline-flex items-center justify-center space-x-3 w-full">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>Me connecter maintenant</span>
                            </router-link>
                        </div>
                    </div>

                    <!-- Pied de page -->
                    <div class="mt-8 pt-6 border-t border-nature-200/50">
                        <div class="text-center space-y-3">
                            <p class="text-sm text-nature-500">
                                Vous rencontrez des problèmes ?
                                <a href="mailto:support@marketfraiche.com" class="text-emerald-600 hover:text-emerald-800 font-medium underline 
                          transition-colors duration-300 ease-organic">
                                    Contactez notre support
                                </a>
                            </p>
                            <p class="text-xs text-nature-400">
                                MarketFraîche © {{ new Date().getFullYear() }} - Sécurité et confidentialité garanties
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { PasswordResetConfirm } from '@/modules/auth/types/auth.types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Récupérer le token depuis l'URL
const token = computed(() => route.query.token as string || '')

// État du formulaire
const form = reactive({
    password: '',
    confirmPassword: ''
})

// États UI
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSuccess = ref(false)
const isTokenInvalid = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const successMessage = ref('')
const passwordStrength = ref(0)

// Styles pour les particules organiques
const particleStyle = (index: number) => {
    const size = 4 + Math.random() * 12
    const duration = 15 + Math.random() * 15

    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${Math.random() * 5}s`
    }
}

const particleType = (index: number) => {
    const types = [
        'bg-emerald-300/20',
        'bg-green-400/15',
        'bg-nature-400/10',
        'bg-lime-300/25'
    ]
    return types[index % types.length]
}

// Validations
const passwordRequirements = computed(() => {
    const password = form.password
    return [
        {
            key: 'length',
            text: 'Au moins 8 caractères',
            met: password.length >= 8
        },
        {
            key: 'uppercase',
            text: 'Au moins une majuscule',
            met: /[A-Z]/.test(password)
        },
        {
            key: 'lowercase',
            text: 'Au moins une minuscule',
            met: /[a-z]/.test(password)
        },
        {
            key: 'number',
            text: 'Au moins un chiffre',
            met: /\d/.test(password)
        },
        {
            key: 'special',
            text: 'Au moins un caractère spécial',
            met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        }
    ]
})

const passwordStrengthText = computed(() => {
    if (passwordStrength.value < 30) return 'Faible'
    if (passwordStrength.value < 60) return 'Moyen'
    if (passwordStrength.value < 80) return 'Bon'
    return 'Excellent'
})

const passwordStrengthColor = computed(() => {
    if (passwordStrength.value < 30) return 'text-red-500'
    if (passwordStrength.value < 60) return 'text-amber-500'
    if (passwordStrength.value < 80) return 'text-emerald-500'
    return 'text-green-500'
})

const passwordStrengthBarClass = computed(() => {
    if (passwordStrength.value < 30) return 'bg-red-500'
    if (passwordStrength.value < 60) return 'bg-amber-500'
    if (passwordStrength.value < 80) return 'bg-emerald-500'
    return 'bg-green-500'
})

const formValid = computed(() => {
    return (
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        passwordStrength.value >= 30 &&
        passwordRequirements.value.every(req => req.met)
    )
})

// Méthodes
const checkPasswordStrength = () => {
    let strength = 0

    // Longueur
    if (form.password.length >= 8) strength += 20
    if (form.password.length >= 12) strength += 10

    // Complexité
    if (/[A-Z]/.test(form.password)) strength += 20
    if (/[a-z]/.test(form.password)) strength += 20
    if (/\d/.test(form.password)) strength += 15
    if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) strength += 15

    // Conséquences
    if (form.password.length < 6) strength = Math.min(strength, 20)

    passwordStrength.value = Math.min(strength, 100)
}

const validateForm = (): string[] => {
    const errors: string[] = []

    if (form.password.length < 8) errors.push('Le mot de passe doit contenir au moins 8 caractères')
    if (!/[A-Z]/.test(form.password)) errors.push('Le mot de passe doit contenir au moins une majuscule')
    if (!/[a-z]/.test(form.password)) errors.push('Le mot de passe doit contenir au moins une minuscule')
    if (!/\d/.test(form.password)) errors.push('Le mot de passe doit contenir au moins un chiffre')

    if (form.password !== form.confirmPassword) errors.push('Les mots de passe ne correspondent pas')

    return errors
}

const handleResetPassword = async () => {
    if (!token.value) {
        isTokenInvalid.value = true
        errorMessage.value = 'Token de réinitialisation manquant'
        return
    }

    const errors = validateForm()

    if (errors.length > 0) {
        errorMessage.value = 'Veuillez corriger les erreurs suivantes'
        errorDetails.value = errors.join(', ')
        return
    }

    isLoading.value = true
    errorMessage.value = ''
    errorDetails.value = ''

    try {
        const resetData: PasswordResetConfirm = {
            token: token.value,
            new_password: form.password
        }

        await authStore.confirmPasswordReset(resetData)

        successMessage.value = 'Mot de passe réinitialisé avec succès'
        isSuccess.value = true

        // Redirection après 3 secondes
        setTimeout(() => {
            router.push('/login')
        }, 3000)

    } catch (error: unknown) {
        const err = error as any
        isSuccess.value = false

        if (err?.response?.status === 400) {
            const errorData = err.response.data

            if (errorData.code === 'TOKEN_EXPIRED') {
                isTokenInvalid.value = true
                errorMessage.value = 'Le lien de réinitialisation a expiré'
                errorDetails.value = 'Veuillez demander un nouveau lien'
            } else if (errorData.code === 'TOKEN_INVALID') {
                isTokenInvalid.value = true
                errorMessage.value = 'Le lien de réinitialisation est invalide'
                errorDetails.value = 'Veuillez demander un nouveau lien'
            } else if (errorData.code === 'PASSWORD_TOO_WEAK') {
                errorMessage.value = 'Le mot de passe est trop faible'
                errorDetails.value = errorData.message || 'Veuillez choisir un mot de passe plus fort'
            } else {
                errorMessage.value = errorData.message || 'Une erreur est survenue lors de la réinitialisation'
            }
        } else if (err?.response?.status === 404) {
            isTokenInvalid.value = true
            errorMessage.value = 'Lien de réinitialisation introuvable'
            errorDetails.value = 'Veuillez demander un nouveau lien'
        } else {
            const err2 = err as any
            errorMessage.value = 'Une erreur inattendue est survenue'
            errorDetails.value = getErrorMessage(err2)
        }
    } finally {
        isLoading.value = false
    }
}

// Initialisation
onMounted(() => {
    // Vérifier si le token est présent
    if (!token.value) {
        isTokenInvalid.value = true
        errorMessage.value = 'Lien de réinitialisation invalide'
        return
    }
})
</script>

<style scoped>
/* Animation de particules organiques */
@keyframes organic-particle {

    0%,
    100% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0.1;
    }

    25% {
        transform: translateY(-20px) translateX(10px) rotate(90deg);
        opacity: 0.3;
    }

    50% {
        transform: translateY(-40px) translateX(-10px) rotate(180deg);
        opacity: 0.1;
    }

    75% {
        transform: translateY(-20px) translateX(-20px) rotate(270deg);
        opacity: 0.3;
    }
}

.organic-particle {
    border-radius: 50%;
    animation: organic-particle linear infinite;
}

/* Animation de ripple pour le succès */
@keyframes ripple {
    0% {
        transform: scale(0.8);
        opacity: 1;
    }

    100% {
        transform: scale(1.5);
        opacity: 0;
    }
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

.animate-shimmer {
    background: linear-gradient(90deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite linear;
}

/* Animation d'entrée de page */
.page-enter-active {
    animation: slide-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-leave-active {
    animation: fade-in 0.4s reverse;
}

/* Styles pour les transitions organiques */
.transition-organic {
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition-duration: 500ms;
}

/* Responsive design */
@media (max-width: 768px) {
    .max-w-md {
        max-width: 100%;
    }

    .p-8 {
        padding: 1.5rem;
    }

    .lg\:p-10 {
        padding: 2rem;
    }

    .text-4xl {
        font-size: 2rem;
    }

    .w-32,
    .h-32 {
        width: 8rem;
        height: 8rem;
    }

    .w-16,
    .h-16 {
        width: 4rem;
        height: 4rem;
    }
}

/* Support pour les réductions de mouvement */
@media (prefers-reduced-motion: reduce) {

    .organic-particle,
    .animate-spin-slow,
    .animate-pulse-soft,
    .animate-bounce-soft,
    .animate-slide-in-up,
    .animate-fade-in,
    .animate-slide-in-down,
    .animate-shimmer {
        animation: none !important;
    }

    .transition-all,
    .transform {
        transition: none !important;
    }
}
</style>
