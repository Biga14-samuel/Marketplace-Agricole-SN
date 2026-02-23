<template>
    <div class="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8">
        <!-- Arrière-plan avec dégradé organique -->
        <div class="absolute inset-0 bg-gradient-to-br from-nature-50 via-cream-100/80 to-blue-50/30 z-0"></div>

        <!-- Texture filigrane subtile -->
        <div class="absolute inset-0 opacity-5 z-0 bg-leaf-pattern bg-[length:250px]"></div>

        <!-- Animation de feuilles flottantes -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div v-for="i in 12" :key="i" class="absolute leaf-float" :style="leafStyle(i)"
                :class="`leaf-float-${(i % 4) + 1}`">
                <svg class="w-full h-full" viewBox="0 0 100 100" :class="leafColor(i)">
                    <path d="M50,10 C70,10 85,30 85,50 C85,70 70,90 50,90 C30,90 15,70 15,50 C15,30 30,10 50,10 Z"
                        fill="currentColor" />
                </svg>
            </div>
        </div>

        <!-- Bouton retour à la connexion -->
        <router-link to="/auth/login" class="absolute top-6 left-6 z-20 flex items-center space-x-2 group">
            <div class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center 
                  shadow-soft group-hover:shadow-medium transform group-hover:scale-110 
                  transition-all duration-500 ease-organic">
                <svg class="w-5 h-5 text-nature-600 group-hover:text-fresh-600 transition-colors duration-300"
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
        <div class="relative z-10 w-full max-w-lg">
            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-float 
                  border border-nature-200/50 relative overflow-hidden">

                <!-- Texture papier subtile -->
                <div class="absolute inset-0 bg-paper-texture bg-[length:15px] opacity-[0.02]"></div>

                <!-- Cercles organiques animés en arrière-plan -->
                <div class="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-r from-blue-100/30 to-sky-100/20 
                    animate-pulse-slow"></div>
                <div class="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-r from-nature-100/20 to-cream-100/20 
                    animate-pulse-slow" style="animation-delay: 1s"></div>

                <div class="relative z-10">
                    <!-- En-tête -->
                    <div class="text-center mb-8 transform transition-all duration-700 ease-organic">
                        <div class="inline-flex items-center justify-center space-x-3 mb-6">
                            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-sky-500 
                          flex items-center justify-center shadow-lg animate-bounce-soft">
                                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-4xl font-bold text-forest-900 font-display">
                                    Market<span class="text-blue-600">Fraîche</span>
                                </h1>
                                <p class="text-nature-600">Réinitialisation du mot de passe</p>
                            </div>
                        </div>

                        <p class="text-nature-700 max-w-md mx-auto">
                            Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
                        </p>
                    </div>

                    <!-- Illustration animée -->
                    <div class="mb-8 relative">
                        <div class="relative w-full h-40">
                            <!-- Enveloppe animée -->
                            <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div class="relative w-32 h-32">
                                    <!-- Enveloppe -->
                                    <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-sky-200 rounded-xl 
                              shadow-inner border-2 border-blue-200"></div>

                                    <!-- Rabat de l'enveloppe -->
                                    <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 
                              w-36 h-12 bg-gradient-to-r from-blue-200 to-sky-300 rounded-t-xl 
                              border-2 border-blue-300 border-b-0">
                                        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                                w-6 h-2 bg-blue-300 rounded-b-full"></div>
                                    </div>

                                    <!-- Lettre à l'intérieur -->
                                    <div class="absolute top-6 left-1/2 transform -translate-x-1/2 
                              w-24 h-20 bg-gradient-to-r from-white to-blue-50 rounded-lg 
                              border border-blue-200 shadow-sm">
                                        <div class="absolute top-3 left-3 w-6 h-1 bg-blue-200 rounded-full"></div>
                                        <div class="absolute top-5 left-3 w-16 h-1 bg-blue-300 rounded-full"></div>
                                        <div class="absolute top-7 left-3 w-12 h-1 bg-blue-200 rounded-full"></div>
                                        <div class="absolute top-9 left-3 w-10 h-1 bg-blue-100 rounded-full"></div>
                                    </div>

                                    <!-- Effet de vol de lettre -->
                                    <div v-if="isLoading" class="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-sky-500 
                              rounded-full flex items-center justify-center shadow-lg 
                              animate-float-fast">
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Points de parcours animés -->
                            <div class="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-blue-300/50 
                          animate-pulse-soft" style="animation-delay: 0.2s"></div>
                            <div class="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-sky-300/50 
                          animate-pulse-soft" style="animation-delay: 0.4s"></div>
                            <div class="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-blue-200/30 
                          animate-pulse-soft" style="animation-delay: 0.6s"></div>
                        </div>
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

                    <div v-if="successMessage" class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-50/80 to-emerald-100/50 
                      border border-green-200 animate-slide-in-down">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-green-800">{{ successMessage }}</p>
                                <p class="text-sm text-green-600 mt-1">
                                    Vérifiez votre boîte de réception et votre dossier spam.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Formulaire de réinitialisation -->
                    <div v-if="!isSuccess" class="space-y-6 animate-fade-in">
                        <form @submit.prevent="handleResetRequest" class="space-y-6">
                            <!-- Champ Email -->
                            <div class="space-y-3">
                                <label class="block text-nature-800 font-medium">
                                    <div class="flex items-center space-x-2 mb-2">
                                        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span>Adresse email associée à votre compte</span>
                                    </div>
                                </label>
                                <div class="relative group">
                                    <div class="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-sky-50/50 rounded-xl 
                              transform group-hover:scale-105 transition-all duration-400 ease-organic 
                              opacity-0 group-hover:opacity-100"></div>
                                    <input v-model="form.email" type="email" required placeholder="votre@email.com"
                                        :disabled="isLoading"
                                        class="input-organic relative w-full disabled:opacity-50 disabled:cursor-not-allowed">
                                </div>
                                <p class="text-xs text-nature-500">
                                    Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
                                </p>
                            </div>

                            <!-- Conseils de sécurité -->
                            <div class="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-sky-50/50 
                          border border-blue-200/50 space-y-3">
                                <h4 class="font-semibold text-blue-800 flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Conseils de sécurité
                                </h4>
                                <ul class="text-sm text-nature-600 space-y-2">
                                    <li class="flex items-start space-x-2">
                                        <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Le lien de réinitialisation est valable 24 heures</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Ne partagez jamais ce lien avec quelqu'un d'autre</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Vérifiez votre dossier spam si vous ne recevez pas l'email</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Bouton d'envoi -->
                            <button type="submit" :disabled="isLoading || !form.email" class="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-sky-600 
                             hover:from-blue-600 hover:to-sky-700 
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
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-lg">
                                    {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
                                </span>
                            </button>
                        </form>

                        <!-- Séparateur -->
                        <div class="relative flex items-center justify-center">
                            <div class="flex-grow h-px bg-gradient-to-r from-transparent via-nature-200 to-transparent">
                            </div>
                            <span class="px-4 text-nature-500 text-sm">ou</span>
                            <div class="flex-grow h-px bg-gradient-to-r from-transparent via-nature-200 to-transparent">
                            </div>
                        </div>

                        <!-- Lien vers la création de compte -->
                        <div class="text-center">
                            <p class="text-nature-600">
                                Vous n'avez pas de compte ?
                                <router-link to="/auth/register" class="text-blue-600 hover:text-blue-800 font-medium 
                                    transform hover:scale-105 transition-all duration-300 ease-organic
                                    inline-flex items-center space-x-1">
                                    <span>Créez-en un</span>
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </router-link>
                            </p>
                        </div>
                    </div>

                    <!-- État de succès -->
                    <div v-else class="space-y-6 animate-slide-in-up">
                        <div class="text-center space-y-6">
                            <!-- Animation de succès -->
                            <div class="relative flex justify-center">
                                <div class="w-32 h-32">
                                    <!-- Cercle extérieur animé -->
                                    <div class="absolute inset-0 rounded-full border-4 border-green-200 
                              animate-ping opacity-20"></div>

                                    <!-- Cercle intérieur -->
                                    <div class="absolute inset-4 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                              flex items-center justify-center shadow-lg">
                                        <div class="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 
                                flex items-center justify-center">
                                            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Message de succès -->
                            <div class="space-y-3">
                                <h2 class="text-2xl font-bold text-nature-800">Email envoyé avec succès !</h2>
                                <p class="text-nature-600">
                                    Nous avons envoyé un lien de réinitialisation à
                                    <span class="font-semibold text-blue-600">{{ form.email }}</span>
                                </p>
                                <p class="text-sm text-nature-500">
                                    Vérifiez votre boîte de réception et suivez les instructions.
                                </p>
                            </div>

                            <!-- Conseils -->
                            <div class="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-sky-50/50 
                          border border-blue-200/50 space-y-3">
                                <h4 class="font-semibold text-blue-800 text-sm">Prochaines étapes :</h4>
                                <ol class="text-sm text-nature-600 space-y-2 list-decimal list-inside">
                                    <li>Ouvrez l'email que nous venons d'envoyer</li>
                                    <li>Cliquez sur le lien de réinitialisation</li>
                                    <li>Créez un nouveau mot de passe sécurisé</li>
                                    <li>Connectez-vous avec vos nouveaux identifiants</li>
                                </ol>
                            </div>

                            <!-- Boutons d'action -->
                            <div class="pt-4 space-y-4">
                                <button @click="handleResend" :disabled="resendLoading || resendCooldown > 0" class="w-full py-3 px-6 bg-gradient-to-r from-blue-100 to-sky-100 
                               hover:from-blue-200 hover:to-sky-200 
                               text-blue-700 font-semibold rounded-xl border border-blue-200
                               transform hover:scale-[1.02] active:scale-95 
                               transition-all duration-500 ease-organic
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                               flex items-center justify-center space-x-3">

                                    <svg v-if="resendLoading" class="w-5 h-5 animate-spin-slow" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>
                                        {{ resendLoading ? 'Envoi...' :
                                            resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` :
                                                'Renvoyer l\'email' }}
                                    </span>
                                </button>

                                <router-link to="/auth/login" class="w-full py-3 px-6 bg-gradient-to-r from-nature-50 to-green-50 
                                    hover:from-nature-100 hover:to-green-100 
                                    text-nature-700 font-semibold rounded-xl border border-nature-200
                                    transform hover:scale-[1.02] active:scale-95 
                                    transition-all duration-500 ease-organic
                                    flex items-center justify-center space-x-3">

                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Retour à la connexion</span>
                                </router-link>
                            </div>

                            <!-- Message de renvoi réussi -->
                            <div v-if="resendSuccess" class="mt-4 p-3 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-100/50 
                          border border-green-200 animate-slide-in-down">
                                <div class="flex items-center space-x-2">
                                    <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span class="text-sm text-green-700">Email renvoyé avec succès !</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pied de page -->
                    <div class="mt-8 pt-6 border-t border-nature-200/50">
                        <div class="text-center space-y-3">
                            <p class="text-sm text-nature-500">
                                Vous rencontrez des problèmes ?
                                <a href="mailto:support@marketfraiche.com" class="text-blue-600 hover:text-blue-800 font-medium underline 
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { PasswordResetRequest } from '@/modules/auth/types/auth.types'

const router = useRouter()
const authStore = useAuthStore()

// État du formulaire
const form = reactive<PasswordResetRequest>({
    email: ''
})

// États UI
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const successMessage = ref('')
const resendLoading = ref(false)
const resendSuccess = ref(false)
const resendCooldown = ref(0)
let cooldownInterval: number | null = null

// Styles pour les feuilles flottantes
const leafStyle = (index: number) => {
    const size = 20 + Math.random() * 40
    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
    }
}

const leafColor = (index: number) => {
    const colors = [
        'text-blue-300/20',
        'text-sky-300/15',
        'text-nature-400/10',
        'text-emerald-300/25'
    ]
    return colors[index % colors.length]
}

// Validation de l'email
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Gestion de la demande de réinitialisation
const handleResetRequest = async () => {
    if (!form.email.trim()) {
        errorMessage.value = 'Veuillez saisir votre adresse email'
        return
    }

    if (!validateEmail(form.email)) {
        errorMessage.value = 'Veuillez saisir une adresse email valide'
        return
    }

    isLoading.value = true
    errorMessage.value = ''
    errorDetails.value = ''
    successMessage.value = ''

    try {
        await authStore.requestPasswordReset(form)

        successMessage.value = 'Un email de réinitialisation a été envoyé'
        isSuccess.value = true

        // Démarrer le cooldown pour le renvoi
        startResendCooldown()

    } catch (error: unknown) {
        const err = error as any
        isSuccess.value = false

        if (err?.response?.status === 404) {
            errorMessage.value = 'Aucun compte n\'est associé à cette adresse email'
            errorDetails.value = 'Vérifiez l\'adresse saisie ou créez un nouveau compte'
        } else if (err?.response?.status === 429) {
            errorMessage.value = 'Trop de tentatives'
            errorDetails.value = 'Veuillez patienter quelques minutes avant de réessayer'
        } else {
            errorMessage.value = err?.response?.data?.message || getErrorMessage(err)
            errorDetails.value = err?.response?.data?.errors ?
                Object.values(err?.response?.data?.errors).flat().join(', ') : ''
        }
    } finally {
        isLoading.value = false
    }
}

// Gestion du renvoi d'email
const handleResend = async () => {
    if (resendCooldown.value > 0 || resendLoading.value) return

    resendLoading.value = true
    resendSuccess.value = false

    try {
        await authStore.requestPasswordReset(form)

        resendSuccess.value = true
        startResendCooldown()

        // Masquer le message de succès après 5 secondes
        setTimeout(() => {
            resendSuccess.value = false
        }, 5000)

    } catch (error: unknown) {
        const err = error as any
        errorMessage.value = 'Impossible de renvoyer l\'email'
        errorDetails.value = err?.response?.data?.message || getErrorMessage(err)
    } finally {
        resendLoading.value = false
    }
}

// Gestion du cooldown pour le renvoi
const startResendCooldown = () => {
    resendCooldown.value = 60 // 60 secondes

    if (cooldownInterval) {
        clearInterval(cooldownInterval)
    }

    cooldownInterval = window.setInterval(() => {
        if (resendCooldown.value > 0) {
            resendCooldown.value--
        } else {
            if (cooldownInterval) {
                clearInterval(cooldownInterval)
                cooldownInterval = null
            }
        }
    }, 1000)
}

// Nettoyage de l'intervalle
onUnmounted(() => {
    if (cooldownInterval) {
        clearInterval(cooldownInterval)
    }
})

// Initialisation
onMounted(() => {
    // Pré-remplir pour le développement
    if (import.meta.env.DEV) {
        form.email = 'jean.dupont@example.com'
    }
})
</script>

<style scoped>
/* Animation de flottement rapide */
@keyframes float-fast {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-15px) rotate(10deg);
    }
}

.animate-float-fast {
    animation: float-fast 2s ease-in-out infinite;
}

/* Animation de feuilles flottantes */
.leaf-float-1 {
    animation: leaf-float 25s linear infinite;
}

.leaf-float-2 {
    animation: leaf-float 30s linear infinite;
    animation-delay: 5s;
}

.leaf-float-3 {
    animation: leaf-float 20s linear infinite;
    animation-delay: 10s;
}

.leaf-float-4 {
    animation: leaf-float 35s linear infinite;
    animation-delay: 15s;
}

/* Animation de brillance */
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

/* Animation de ping personnalisée */
@keyframes ping {

    75%,
    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}

.animate-ping {
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
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
    .max-w-lg {
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

    .leaf-float,
    .animate-spin-slow,
    .animate-pulse-soft,
    .animate-bounce-soft,
    .animate-slide-in-up,
    .animate-fade-in,
    .animate-slide-in-down,
    .animate-ping,
    .animate-float-fast {
        animation: none !important;
    }

    .transition-all,
    .transform {
        transition: none !important;
    }
}
</style>