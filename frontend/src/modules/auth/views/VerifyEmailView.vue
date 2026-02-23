<template>
    <div class="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8">
        <!-- Arrière-plan avec dégradé organique -->
        <div class="absolute inset-0 bg-gradient-to-br from-nature-50 via-cream-100/80 to-fresh-50/30 z-0"></div>

        <!-- Texture filigrane subtile -->
        <div class="absolute inset-0 opacity-5 z-0 bg-leaf-pattern bg-[length:250px]"></div>

        <!-- Animation de particules organiques -->
        <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div v-for="i in 15" :key="i" class="absolute organic-particle" :style="particleStyle(i)"
                :class="particleType(i)">
            </div>
        </div>

        <!-- Bouton retour à l'accueil -->
        <router-link to="/" class="absolute top-6 left-6 z-20 flex items-center space-x-2 group">
            <div class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center 
                  shadow-soft group-hover:shadow-medium transform group-hover:scale-110 
                  transition-all duration-500 ease-organic">
                <svg class="w-5 h-5 text-nature-600 group-hover:text-fresh-600 transition-colors duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            <span class="text-nature-700 font-medium opacity-0 group-hover:opacity-100 
                   transform translate-x-[-10px] group-hover:translate-x-0 
                   transition-all duration-500 ease-organic">
                Accueil
            </span>
        </router-link>

        <!-- Conteneur principal -->
        <div class="relative z-10 w-full max-w-2xl">
            <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-float 
                  border border-nature-200/50 relative overflow-hidden">

                <!-- Texture papier subtile -->
                <div class="absolute inset-0 bg-paper-texture bg-[length:15px] opacity-[0.02]"></div>

                <!-- Cercle organique animé en arrière-plan -->
                <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-r from-fresh-100/30 to-bio-100/20 
                    animate-pulse-slow"></div>
                <div class="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-r from-nature-100/20 to-cream-100/20 
                    animate-pulse-slow" style="animation-delay: 1s"></div>

                <div class="relative z-10">
                    <!-- Logo et titre -->
                    <div class="text-center mb-10 transform transition-all duration-700 ease-organic">
                        <div class="inline-flex items-center space-x-3 mb-6">
                            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-fresh-400 to-bio 
                          flex items-center justify-center shadow-lg animate-bounce-soft">
                                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-4xl font-bold text-forest-900 font-display">
                                    Market<span class="text-fresh-600">Fraîche</span>
                                </h1>
                                <p class="text-nature-600">Vérification de votre email</p>
                            </div>
                        </div>
                    </div>

                    <!-- Contenu dynamique selon l'état -->
                    <div class="text-center space-y-8">

                        <!-- État: Chargement -->
                        <div v-if="isLoading" class="space-y-6 animate-fade-in">
                            <div class="flex justify-center">
                                <div class="relative">
                                    <!-- Cercle extérieur animé -->
                                    <div class="w-32 h-32 rounded-full border-4 border-nature-200 border-t-fresh-500 
                              animate-spin-slow"></div>

                                    <!-- Cercle intérieur animé -->
                                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                              w-20 h-20 rounded-full border-4 border-nature-100 border-b-bio 
                              animate-spin-slow" style="animation-direction: reverse"></div>

                                    <!-- Icone au centre -->
                                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                              w-12 h-12 rounded-full bg-gradient-to-r from-fresh-100 to-bio-100 
                              flex items-center justify-center">
                                        <svg class="w-6 h-6 text-fresh-600 animate-pulse-soft" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <h2 class="text-2xl font-bold text-nature-800">Vérification en cours</h2>
                                <p class="text-nature-600 max-w-md mx-auto">
                                    Nous vérifions votre adresse email. Cette opération ne prendra que quelques
                                    secondes.
                                </p>
                                <div class="pt-4">
                                    <div class="w-48 h-1 bg-nature-200 rounded-full overflow-hidden mx-auto">
                                        <div class="h-full bg-gradient-to-r from-fresh-400 to-bio animate-shimmer">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- État: Succès -->
                        <div v-else-if="isSuccess" class="space-y-6 animate-slide-in-up">
                            <div class="flex justify-center">
                                <div class="relative">
                                    <!-- Cercle de succès animé -->
                                    <div class="w-40 h-40 rounded-full bg-gradient-to-r from-fresh-100/50 to-bio-100/30 
                              flex items-center justify-center shadow-glow-green">

                                        <!-- Animation de cercles concentriques -->
                                        <div v-for="i in 3" :key="i"
                                            class="absolute inset-0 rounded-full border-2 border-fresh-300/50" :style="{
                                                animation: `ripple 2s ease-out infinite`,
                                                animationDelay: `${i * 0.5}s`
                                            }"></div>

                                        <!-- Icône de succès -->
                                        <div class="relative z-10 w-28 h-28 rounded-full bg-gradient-to-r from-fresh-400 to-bio 
                                flex items-center justify-center shadow-lg transform hover:scale-110 
                                transition-transform duration-500 ease-organic">
                                            <svg class="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <h2 class="text-3xl font-bold text-nature-800 font-display">
                                    Félicitations !
                                </h2>
                                <div class="text-lg text-nature-600 max-w-md mx-auto space-y-3">
                                    <p>
                                        Votre adresse email <span class="font-semibold text-fresh-600">{{ userEmail
                                            }}</span>
                                        a été vérifiée avec succès.
                                    </p>
                                    <p class="text-sm text-nature-500">
                                        Votre compte est maintenant entièrement activé.
                                    </p>
                                </div>

                                <!-- Badges de réassurance -->
                                <div class="flex flex-wrap justify-center gap-3 pt-4">
                                    <div class="badge-bio flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Compte vérifié</span>
                                    </div>
                                    <div class="badge-local flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Accès complet</span>
                                    </div>
                                    <div class="badge-season flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Sécurité renforcée</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Boutons d'action -->
                            <div class="pt-8 space-y-4">
                                <router-link to="/"
                                    class="btn-primary inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span>Découvrir les produits</span>
                                </router-link>

                                <router-link to="/auth/login"
                                    class="btn-outline inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Accéder à mon espace</span>
                                </router-link>
                            </div>

                            <!-- Message supplémentaire -->
                            <div class="pt-6 border-t border-nature-200/50 mt-8">
                                <p class="text-sm text-nature-500">
                                    Vous recevrez bientôt un email de bienvenue avec nos meilleures offres et conseils.
                                </p>
                            </div>
                        </div>

                        <!-- État: Email déjà vérifié -->
                        <div v-else-if="isAlreadyVerified" class="space-y-6 animate-slide-in-up">
                            <div class="flex justify-center">
                                <div class="relative">
                                    <!-- Cercle d'information -->
                                    <div class="w-40 h-40 rounded-full bg-gradient-to-r from-blue-50 to-sky-100 
                              flex items-center justify-center shadow-soft">

                                        <!-- Icône d'information -->
                                        <div class="relative z-10 w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-sky-500 
                                flex items-center justify-center shadow-lg transform hover:scale-110 
                                transition-transform duration-500 ease-organic">
                                            <svg class="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <h2 class="text-3xl font-bold text-nature-800 font-display">
                                    Email déjà vérifié
                                </h2>
                                <div class="text-lg text-nature-600 max-w-md mx-auto space-y-3">
                                    <p>
                                        Votre adresse email <span class="font-semibold text-blue-600">{{ userEmail
                                            }}</span>
                                        a déjà été vérifiée précédemment.
                                    </p>
                                    <p class="text-sm text-nature-500">
                                        Vous pouvez accéder à toutes les fonctionnalités de votre compte.
                                    </p>
                                </div>
                            </div>

                            <!-- Boutons d'action -->
                            <div class="pt-8 space-y-4">
                                <router-link to="/"
                                    class="btn-primary inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span>Explorer le catalogue</span>
                                </router-link>

                                <router-link to="/auth/login"
                                    class="btn-outline inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Se connecter</span>
                                </router-link>
                            </div>
                        </div>

                        <!-- État: Erreur -->
                        <div v-else-if="isError" class="space-y-6 animate-slide-in-up">
                            <div class="flex justify-center">
                                <div class="relative">
                                    <!-- Cercle d'erreur -->
                                    <div class="w-40 h-40 rounded-full bg-gradient-to-r from-red-50/50 to-orange-100/30 
                              flex items-center justify-center shadow-soft">

                                        <!-- Icône d'erreur -->
                                        <div class="relative z-10 w-28 h-28 rounded-full bg-gradient-to-r from-red-400 to-orange-500 
                                flex items-center justify-center shadow-lg transform hover:scale-110 
                                transition-transform duration-500 ease-organic">
                                            <svg class="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <h2 class="text-3xl font-bold text-nature-800 font-display">
                                    Oups ! Un problème est survenu
                                </h2>
                                <div class="text-lg text-nature-600 max-w-md mx-auto space-y-4">
                                    <p class="font-medium text-red-600">
                                        {{ errorMessage }}
                                    </p>

                                    <div class="bg-red-50/50 border border-red-100 rounded-xl p-4 text-left space-y-2">
                                        <p class="text-sm font-medium text-red-800">Raisons possibles :</p>
                                        <ul class="text-sm text-red-600 space-y-1">
                                            <li class="flex items-start space-x-2">
                                                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>Le lien de vérification a expiré (valable 24h)</span>
                                            </li>
                                            <li class="flex items-start space-x-2">
                                                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>Le lien a déjà été utilisé</span>
                                            </li>
                                            <li class="flex items-start space-x-2">
                                                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>Le lien est incorrect ou invalide</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Boutons d'action pour les erreurs -->
                            <div class="pt-8 space-y-4">
                                <button @click="resendVerificationEmail" :disabled="resendLoading" class="btn-primary inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto
                               disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg v-if="resendLoading" class="w-5 h-5 animate-spin" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>{{ resendLoading ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'
                                        }}</span>
                                </button>

                                <router-link to="/auth/login"
                                    class="btn-outline inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Se connecter</span>
                                </router-link>

                                <router-link to="/contact" class="text-fresh-600 hover:text-fresh-800 font-medium 
                                    inline-flex items-center justify-center space-x-2 text-sm">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Besoin d'aide ? Contactez notre support</span>
                                </router-link>
                            </div>

                            <!-- Message de succès pour le renvoi -->
                            <div v-if="resendSuccess" class="mt-6 p-4 rounded-xl bg-gradient-to-r from-fresh-50/80 to-bio-100/50 
                          border border-fresh-200 animate-slide-in-down">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 rounded-full bg-fresh-100 flex items-center justify-center">
                                        <svg class="w-4 h-4 text-fresh-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-fresh-800">Email envoyé !</p>
                                        <p class="text-sm text-fresh-600">Vérifiez votre boîte de réception (et vos
                                            spams).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- État: Lien invalide -->
                        <div v-else class="space-y-6 animate-slide-in-up">
                            <div class="flex justify-center">
                                <div class="relative">
                                    <!-- Cercle d'attention -->
                                    <div class="w-40 h-40 rounded-full bg-gradient-to-r from-amber-50/50 to-yellow-100/30 
                              flex items-center justify-center shadow-soft">

                                        <!-- Icône d'attention -->
                                        <div class="relative z-10 w-28 h-28 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 
                                flex items-center justify-center shadow-lg transform hover:scale-110 
                                transition-transform duration-500 ease-organic">
                                            <svg class="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <h2 class="text-3xl font-bold text-nature-800 font-display">
                                    Lien de vérification invalide
                                </h2>
                                <div class="text-lg text-nature-600 max-w-md mx-auto space-y-3">
                                    <p>
                                        Le lien de vérification semble incorrect ou incomplet.
                                    </p>
                                    <p class="text-sm text-nature-500">
                                        Assurez-vous d'avoir cliqué sur le lien complet reçu par email.
                                    </p>
                                </div>
                            </div>

                            <!-- Boutons d'action -->
                            <div class="pt-8 space-y-4">
                                <router-link to="/auth/login"
                                    class="btn-primary inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Se connecter</span>
                                </router-link>

                                <router-link to="/contact"
                                    class="btn-outline inline-flex items-center justify-center space-x-3 w-full max-w-xs mx-auto">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>Contactez le support</span>
                                </router-link>
                            </div>
                        </div>

                    </div>

                    <!-- Informations supplémentaires -->
                    <div class="mt-12 pt-8 border-t border-nature-200/50">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div class="space-y-2">
                                <div
                                    class="w-10 h-10 rounded-full bg-nature-100 flex items-center justify-center mx-auto">
                                    <svg class="w-5 h-5 text-nature-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-nature-800">Sécurité renforcée</h4>
                                <p class="text-sm text-nature-500">Protection optimale de vos données</p>
                            </div>

                            <div class="space-y-2">
                                <div
                                    class="w-10 h-10 rounded-full bg-nature-100 flex items-center justify-center mx-auto">
                                    <svg class="w-5 h-5 text-nature-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-nature-800">Accès complet</h4>
                                <p class="text-sm text-nature-500">À toutes les fonctionnalités</p>
                            </div>

                            <div class="space-y-2">
                                <div
                                    class="w-10 h-10 rounded-full bg-nature-100 flex items-center justify-center mx-auto">
                                    <svg class="w-5 h-5 text-nature-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-nature-800">Notifications</h4>
                                <p class="text-sm text-nature-500">Restez informé de vos commandes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pied de page -->
            <div class="mt-8 text-center">
                <p class="text-nature-400 text-xs">
                    MarketFraîche © {{ new Date().getFullYear() }} - Vos produits frais, directement des producteurs
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// États
const isLoading = ref(true)
const isSuccess = ref(false)
const isError = ref(false)
const isAlreadyVerified = ref(false)
const errorMessage = ref('')
const userEmail = ref('')
const resendLoading = ref(false)
const resendSuccess = ref(false)

// 🔧 Fonction robuste pour récupérer le token depuis toutes les sources possibles
const getTokenFromAllSources = (): string | null => {
    console.log('🔍 === RECHERCHE DU TOKEN ===')
    console.log('📍 URL complète:', window.location.href)
    console.log('📍 window.location.search:', window.location.search)
    console.log('📍 window.location.hash:', window.location.hash)
    console.log('📍 route.query:', route.query)
    console.log('📍 route.params:', route.params)
    
    // 1. Vue Router query (history mode)
    if (route.query.token) {
        console.log('✅ Token trouvé dans route.query.token:', route.query.token)
        return route.query.token as string
    }
    
    // 2. Vue Router params (route dynamique /verify/:token)
    if (route.params.token) {
        console.log('✅ Token trouvé dans route.params.token:', route.params.token)
        return route.params.token as string
    }
    
    // 3. 🎯 FIX CLÉ: window.location.search (pour hash mode où ?token= est avant le #)
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromSearch = urlParams.get('token')
    if (tokenFromSearch) {
        console.log('✅ Token trouvé dans window.location.search:', tokenFromSearch)
        return tokenFromSearch
    }
    
    // 4. Query dans le hash lui-même (cas rare)
    const hash = window.location.hash
    if (hash.includes('?')) {
        const hashQuery = new URLSearchParams(hash.split('?')[1])
        const tokenFromHash = hashQuery.get('token')
        if (tokenFromHash) {
            console.log('✅ Token trouvé dans le hash query:', tokenFromHash)
            return tokenFromHash
        }
    }
    
    // 5. Autres noms de paramètres possibles
    const altNames = ['verificationToken', 'verification_token', 'emailToken']
    for (const name of altNames) {
        const altToken = route.query[name] as string || urlParams.get(name)
        if (altToken) {
            console.log(`✅ Token trouvé avec le nom alternatif ${name}:`, altToken)
            return altToken
        }
    }
    
    console.log('❌ Aucun token trouvé dans aucune source')
    console.log('🔍 === FIN RECHERCHE DU TOKEN ===')
    return null
}

// Token récupéré de manière robuste
const token = computed(() => getTokenFromAllSources())

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
        'bg-fresh-300/20',
        'bg-nature-400/15',
        'bg-earth-400/10',
        'bg-bio-300/25',
        'bg-blue-300/20',
        'bg-amber-300/15'
    ]
    return types[index % types.length]
}

// Vérifier l'email
const verifyEmail = async () => {
    console.log('=== DÉBUT VÉRIFICATION EMAIL ===')
    console.log('🌐 URL complète:', window.location.href)
    console.log('🔍 window.location.search:', window.location.search)
    console.log('🔍 window.location.hash:', window.location.hash)
    console.log('📋 Route query complète:', route.query)
    console.log('📋 Route params complets:', route.params)
    console.log('🎯 Token récupéré:', token.value)

    if (!token.value) {
        console.error('❌ Aucun token trouvé dans l\'URL')
        console.error('🔧 Vérifiez que le lien email contient bien ?token=... ou que le router est en bon mode')
        isLoading.value = false
        isError.value = true
        errorMessage.value = 'Aucun token de vérification trouvé dans le lien'
        return
    }

    try {
        console.log('📤 Appel API avec token:', token.value)

        // Appeler l'API de vérification d'email
        const response = await authStore.verifyEmail(token.value)

        console.log('✅ Réponse API:', response)

        // Récupérer l'email de l'utilisateur si disponible
        if (authStore.user?.email) {
            userEmail.value = authStore.user.email
        } else {
            userEmail.value = 'votre adresse email'
        }

        isSuccess.value = true
        isError.value = false
        isAlreadyVerified.value = false

        console.log('✅ Vérification réussie!')

        // Redirection automatique après succès
        setTimeout(() => {
            console.log('🔄 Redirection vers la page d\'accueil...')
            router.push('/')
        }, 5000)

    } catch (error: unknown) {
        const err = error as any
        console.error('❌ Erreur lors de la vérification:', err)
        console.error('Détails de l\'erreur:', {
            status: err?.response?.status,
            data: err?.response?.data,
            message: err?.message
        })

        isLoading.value = false

        // Déterminer le type d'erreur
        if (err?.response?.status === 400) {
            const errorData = err.response.data
            console.log('Données d\'erreur 400:', errorData)

            if (errorData.detail?.includes('déjà été vérifiée') || errorData.detail?.includes('already verified')) {
                isAlreadyVerified.value = true
                userEmail.value = authStore.user?.email || 'votre adresse email'
                console.log('ℹ️ Email déjà vérifié')
            } else if (errorData.detail?.includes('expiré') || errorData.detail?.includes('expired')) {
                isError.value = true
                errorMessage.value = 'Le lien de vérification a expiré (valable 24h)'
                console.log('⏰ Token expiré')
            } else if (errorData.detail?.includes('invalide') || errorData.detail?.includes('invalid')) {
                isError.value = true
                errorMessage.value = 'Le lien de vérification est invalide'
                console.log('❌ Token invalide')
            } else {
                isError.value = true
                errorMessage.value = errorData.detail || errorData.message || 'Une erreur est survenue lors de la vérification'
                console.log('❌ Autre erreur 400:', errorMessage.value)
            }
        } else if (err?.response?.status === 404) {
            isError.value = true
            errorMessage.value = 'Token de vérification non trouvé'
            console.log('❌ Token non trouvé (404)')
        } else if (err?.response?.status === 500) {
            isError.value = true
            errorMessage.value = 'Erreur serveur. Veuillez réessayer plus tard.'
            console.log('❌ Erreur serveur (500)')
        } else if (err?.message?.includes('Network Error') || err?.code === 'ERR_NETWORK') {
            isError.value = true
            errorMessage.value = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
            console.log('❌ Erreur réseau')
        } else {
            isError.value = true
            errorMessage.value = err?.response?.data?.detail || err?.message || 'Une erreur inattendue est survenue'
            console.log('❌ Erreur inattendue:', errorMessage.value)
        }
    } finally {
        isLoading.value = false
        console.log('=== FIN VÉRIFICATION EMAIL ===')
    }
}

// Renvoyer l'email de vérification
const resendVerificationEmail = async () => {
    console.log('📧 Tentative de renvoi d\'email de vérification')
    resendLoading.value = true
    resendSuccess.value = false

    try {
        // Demander à l'utilisateur son email via un prompt
        const email = prompt('Veuillez entrer votre adresse email pour recevoir un nouveau lien de vérification:')

        if (!email) {
            console.log('❌ Aucun email fourni')
            resendLoading.value = false
            return
        }

        console.log('📤 Envoi de la demande pour:', email)

        // Appeler l'API pour renvoyer l'email
        // Note: Il faudrait créer un endpoint backend pour cela
        // Pour l'instant, on simule
        await new Promise(resolve => setTimeout(resolve, 1500))

        resendSuccess.value = true
        console.log('✅ Email de vérification renvoyé')

        // Masquer le message de succès après 5 secondes
        setTimeout(() => {
            resendSuccess.value = false
        }, 5000)

    } catch (error) {
        console.error('❌ Erreur lors du renvoi:', error)
        errorMessage.value = 'Impossible d\'envoyer l\'email de vérification. Veuillez réessayer.'
    } finally {
        resendLoading.value = false
    }
}

// Formater l'email pour l'affichage
const formatEmail = (email: string) => {
    if (!email) return ''

    const [username, domain] = email.split('@')
    if (username.length > 3) {
        const firstThree = username.substring(0, 3)
        const stars = '*'.repeat(username.length - 3)
        return `${firstThree}${stars}@${domain}`
    }
    return email
}

// Initialisation
onMounted(() => {
    // Simuler un léger délai pour l'animation de chargement
    setTimeout(() => {
        verifyEmail()
    }, 1000)
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

/* Styles pour les badges */
.badge-bio {
    @apply px-3 py-1.5 bg-gradient-to-r from-bio to-fresh-500 text-white text-xs font-bold rounded-full shadow-glow-green animate-pulse-soft inline-flex items-center;
}

.badge-local {
    @apply px-3 py-1.5 bg-gradient-to-r from-earth-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-soft inline-flex items-center;
}

.badge-season {
    @apply px-3 py-1.5 bg-gradient-to-r from-accent-orange to-red-500 text-white text-xs font-bold rounded-full shadow-soft inline-flex items-center;
}

/* Responsive design */
@media (max-width: 768px) {
    .grid-cols-3 {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .w-40,
    .w-32,
    .w-28 {
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
    .animate-shimmer,
    .animate-bounce-soft,
    .animate-slide-in-up,
    .animate-fade-in,
    .animate-slide-in-down {
        animation: none !important;
    }

    .transition-all,
    .transform {
        transition: none !important;
    }
}
</style>