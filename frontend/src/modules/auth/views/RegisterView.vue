<template>
    <div class="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8">
        <!-- Arrière-plan avec dégradé organique -->
        <div class="absolute inset-0 bg-gradient-to-br from-nature-50 via-cream-100/80 to-earth-50 z-0"></div>

        <!-- Texture filigrane de feuilles -->
        <div class="absolute inset-0 opacity-[0.03] z-0 bg-leaf-pattern bg-[length:300px]"></div>

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

        <!-- Bouton retour -->
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
                Retour
            </span>
        </router-link>

        <!-- Conteneur principal -->
        <div class="relative z-10 w-full max-w-6xl">
            <!-- En-tête -->
            <div class="text-center mb-8 lg:mb-12 transform transition-all duration-700 ease-organic">
                <div class="inline-flex items-center space-x-3 mb-4">
                    <div class="w-14 h-14 rounded-full bg-gradient-to-r from-fresh-400 to-bio 
                      flex items-center justify-center shadow-lg animate-bounce-soft">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div class="text-left">
                        <h1 class="text-4xl lg:text-5xl font-bold text-forest-900 font-display">
                            Market<span class="text-fresh-600">Fraîche</span>
                        </h1>
                        <p class="text-nature-600 italic">Rejoignez notre communauté de gourmets</p>
                    </div>
                </div>

                <div class="max-w-2xl mx-auto">
                    <p class="text-lg text-nature-700 mb-6">
                        Créez votre compte pour accéder aux meilleurs produits frais du Cameroun,
                        suivre vos commandes et bénéficier d'offres exclusives.
                    </p>

                    <!-- Badges de réassurance -->
                    <div class="flex flex-wrap justify-center gap-3 mb-8">
                        <div class="badge-bio flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>100% produits locaux</span>
                        </div>
                        <div class="badge-local flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>Livraison ultra-fraîche</span>
                        </div>
                        <div class="badge-season flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>De saison</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contenu principal -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Partie gauche - Illustration et avantages -->
                <div class="lg:w-2/5">
                    <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-float 
                      border border-nature-200/50 hover:border-fresh-300 
                      transition-all duration-700 ease-organic">

                        <!-- Illustration de bienvenue -->
                        <div class="mb-8 relative">
                            <div class="relative w-full h-64 rounded-2xl overflow-hidden 
                          bg-gradient-to-br from-fresh-100 to-cream-100">

                                <!-- Animation de légumes qui tombent -->
                                <div class="absolute inset-0">
                                    <div v-for="veg in vegetables" :key="veg.id" class="absolute animate-float" :style="{
                                        left: veg.left + '%',
                                        animationDuration: veg.duration + 's',
                                        animationDelay: veg.delay + 's'
                                    }">
                                        <component :is="veg.component" class="w-10 h-10" :class="veg.color" />
                                    </div>
                                </div>

                                <!-- Panier au centre -->
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div
                                        class="relative transform hover:scale-110 transition-transform duration-700 ease-organic">
                                        <div class="w-32 h-32 rounded-full bg-gradient-to-br from-earth-200 to-cream-300 
                                flex items-center justify-center shadow-inner">
                                            <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-white to-earth-50 
                                  flex items-center justify-center relative overflow-hidden">

                                                <!-- Fruits dans le panier -->
                                                <div v-for="fruit in basketFruits" :key="fruit.id" class="absolute"
                                                    :style="{
                                                        top: fruit.top + '%',
                                                        left: fruit.left + '%',
                                                        transform: `rotate(${fruit.rotation}deg)`
                                                    }">
                                                    <component :is="fruit.component" class="w-6 h-6"
                                                        :class="fruit.color" />
                                                </div>

                                                <svg class="w-12 h-12 text-earth-600 z-10" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path
                                                        d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <!-- Effet de lumière -->
                                        <div class="absolute top-0 left-0 w-full h-full rounded-full 
                                bg-gradient-to-tr from-transparent via-white/30 to-transparent 
                                animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Texte d'accroche -->
                            <div class="mt-6 text-center">
                                <h3 class="text-2xl font-bold text-forest-800 mb-3">
                                    Votre marché frais à portée de main
                                </h3>
                                <p class="text-nature-600">
                                    Découvrez des produits sélectionnés avec soin par nos producteurs partenaires
                                </p>
                            </div>
                        </div>

                        <!-- Avantages -->
                        <div class="space-y-6">
                            <h4 class="text-xl font-bold text-forest-800 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-fresh-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                                Vos avantages
                            </h4>

                            <div class="space-y-4">
                                <div v-for="benefit in benefits" :key="benefit.id" class="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-white to-nature-50/50 
                            hover:from-fresh-50/30 hover:to-white transform hover:scale-[1.02] 
                            transition-all duration-500 ease-organic border border-nature-200/50">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                        :class="benefit.bgColor">
                                        <component :is="benefit.icon" class="w-5 h-5" :class="benefit.iconColor" />
                                    </div>
                                    <div>
                                        <h5 class="font-bold text-nature-800 mb-1">{{ benefit.title }}</h5>
                                        <p class="text-sm text-nature-600">{{ benefit.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Témoignage -->
                        <div class="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cream-50/50 to-earth-50/50 
                        border border-earth-200/50">
                            <div class="flex items-center space-x-4 mb-4">
                                <div class="w-12 h-12 rounded-full bg-gradient-to-r from-earth-300 to-cream-400 
                            flex items-center justify-center">
                                    <span class="font-bold text-earth-800">M</span>
                                </div>
                                <div>
                                    <p class="font-bold text-earth-900">Marie, Yaoundé</p>
                                    <p class="text-sm text-earth-600">Membre depuis 2023</p>
                                </div>
                            </div>
                            <p class="text-earth-700 italic">
                                "Je ne pourrais plus me passer de MarketFraîche ! Les produits sont d'une fraîcheur
                                incroyable,
                                et savoir qu'ils viennent directement des producteurs camerounais, c'est un vrai
                                plaisir."
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Partie droite - Formulaire d'inscription -->
                <div class="lg:w-3/5">
                    <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-float 
                      border border-nature-200/50 relative overflow-hidden">

                        <!-- Texture papier subtile -->
                        <div class="absolute inset-0 bg-paper-texture bg-[length:20px] opacity-[0.03]"></div>

                        <div class="relative z-10">
                            <!-- En-tête du formulaire -->
                            <div class="mb-8 text-center lg:text-left">
                                <h2 class="text-3xl lg:text-4xl font-bold text-forest-900 font-display mb-3">
                                    Créer votre compte
                                    <span class="text-fresh-600 animate-pulse-soft">.</span>
                                </h2>
                                <p class="text-nature-600">
                                    Remplissez les informations ci-dessous pour créer votre compte personnel
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

                            <div v-if="successMessage" class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-fresh-50/80 to-bio-100/50 
                          border border-fresh-200 animate-slide-in-down">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 rounded-full bg-fresh-100 flex items-center justify-center">
                                        <svg class="w-5 h-5 text-fresh-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-fresh-800">{{ successMessage }}</p>
                                        <p class="text-sm text-fresh-600 mt-1">Redirection vers votre espace...</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Formulaire d'inscription -->
                            <form @submit.prevent="handleRegister" class="space-y-6">
                                <!-- Nom complet -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-3">
                                        <label class="block text-nature-800 font-medium">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <svg class="w-5 h-5 text-fresh-600" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>Prénom</span>
                                            </div>
                                        </label>
                                        <div class="relative group">
                                            <div class="absolute inset-0 bg-gradient-to-r from-fresh-50/50 to-nature-50/50 rounded-xl 
                                  transform group-hover:scale-105 transition-all duration-400 ease-organic 
                                  opacity-0 group-hover:opacity-100"></div>
                                            <input v-model="form.firstName" type="text" required
                                                placeholder="Votre prénom" class="input-organic relative w-full">
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <label class="block text-nature-800 font-medium">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <svg class="w-5 h-5 text-fresh-600" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>Nom</span>
                                            </div>
                                        </label>
                                        <div class="relative group">
                                            <div class="absolute inset-0 bg-gradient-to-r from-fresh-50/50 to-nature-50/50 rounded-xl 
                                  transform group-hover:scale-105 transition-all duration-400 ease-organic 
                                  opacity-0 group-hover:opacity-100"></div>
                                            <input v-model="form.lastName" type="text" required placeholder="Votre nom"
                                                class="input-organic relative w-full">
                                        </div>
                                    </div>
                                </div>

                                <!-- Email -->
                                <div class="space-y-3">
                                    <label class="block text-nature-800 font-medium">
                                        <div class="flex items-center space-x-2 mb-2">
                                            <svg class="w-5 h-5 text-fresh-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <span>Adresse email</span>
                                        </div>
                                    </label>
                                    <div class="relative group">
                                        <div class="absolute inset-0 bg-gradient-to-r from-fresh-50/50 to-nature-50/50 rounded-xl 
                                transform group-hover:scale-105 transition-all duration-400 ease-organic 
                                opacity-0 group-hover:opacity-100"></div>
                                        <input v-model="form.email" type="email" required placeholder="votre@email.com"
                                            class="input-organic relative w-full">
                                    </div>
                                    <p class="text-xs text-nature-500">Nous utiliserons cet email pour vous envoyer vos
                                        confirmations de commande.</p>
                                </div>

                                <!-- ✅ NOUVEAU: Choix du type de compte -->
                                <div class="space-y-3">
                                    <label class="block text-nature-800 font-medium">
                                        <div class="flex items-center space-x-2 mb-2">
                                            <svg class="w-5 h-5 text-fresh-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Type de compte</span>
                                        </div>
                                    </label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <!-- Option Client -->
                                        <label class="relative cursor-pointer group">
                                            <input type="radio" v-model="form.role" value="Customer" class="sr-only peer" required>
                                            <div class="p-6 rounded-2xl border-2 border-nature-200 bg-white/50
                                                peer-checked:border-fresh-500 peer-checked:bg-fresh-50/50
                                                hover:border-fresh-300 hover:bg-fresh-50/30
                                                transition-all duration-300 ease-organic
                                                transform hover:scale-[1.02] peer-checked:scale-[1.02]">
                                                <div class="flex flex-col items-center text-center space-y-3">
                                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100
                                                        flex items-center justify-center
                                                        peer-checked:from-fresh-200 peer-checked:to-fresh-300">
                                                        <svg class="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="font-semibold text-nature-800 mb-1">Client</div>
                                                        <div class="text-sm text-nature-600">
                                                            Acheter des produits frais locaux
                                                        </div>
                                                    </div>
                                                    <div class="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity">
                                                        <svg class="w-5 h-5 text-fresh-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>

                                        <!-- Option Producteur -->
                                        <label class="relative cursor-pointer group">
                                            <input type="radio" v-model="form.role" value="Producer" class="sr-only peer" required>
                                            <div class="p-6 rounded-2xl border-2 border-nature-200 bg-white/50
                                                peer-checked:border-amber-500 peer-checked:bg-amber-50/50
                                                hover:border-amber-300 hover:bg-amber-50/30
                                                transition-all duration-300 ease-organic
                                                transform hover:scale-[1.02] peer-checked:scale-[1.02]">
                                                <div class="flex flex-col items-center text-center space-y-3">
                                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-100 to-orange-100
                                                        flex items-center justify-center">
                                                        <svg class="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="font-semibold text-nature-800 mb-1">Producteur</div>
                                                        <div class="text-sm text-nature-600">
                                                            Vendre mes produits agricoles
                                                        </div>
                                                    </div>
                                                    <div class="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity">
                                                        <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <p class="text-xs text-nature-500">
                                        Vous pourrez modifier ce choix plus tard dans vos paramètres
                                    </p>
                                </div>

                                <!-- Téléphone (optionnel) -->
                                <div class="space-y-3">
                                    <label class="block text-nature-800 font-medium">
                                        <div class="flex items-center space-x-2 mb-2">
                                            <svg class="w-5 h-5 text-fresh-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            <span>Téléphone (optionnel)</span>
                                        </div>
                                    </label>
                                    <div class="relative group">
                                        <div class="absolute inset-0 bg-gradient-to-r from-fresh-50/50 to-nature-50/50 rounded-xl 
                                transform group-hover:scale-105 transition-all duration-400 ease-organic 
                                opacity-0 group-hover:opacity-100"></div>
                                        <input v-model="form.phone" type="tel" placeholder="06 12 34 56 78"
                                            class="input-organic relative w-full">
                                    </div>
                                    <p class="text-xs text-nature-500">Pour vous contacter en cas de problème de
                                        livraison.</p>
                                </div>

                                <!-- Mot de passe -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-3">
                                        <label class="block text-nature-800 font-medium">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <svg class="w-5 h-5 text-fresh-600" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>Mot de passe</span>
                                            </div>
                                        </label>
                                        <div class="relative group">
                                            <div class="absolute inset-0 bg-gradient-to-r from-fresh-50/50 to-nature-50/50 rounded-xl 
                                  transform group-hover:scale-105 transition-all duration-400 ease-organic 
                                  opacity-0 group-hover:opacity-100"></div>
                                            <div class="relative">
                                                <input v-model="form.password"
                                                    :type="showPassword ? 'text' : 'password'" required
                                                    placeholder="Votre mot de passe" class="input-organic w-full pr-12"
                                                    @input="checkPasswordStrength">
                                                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 
                                       rounded-full hover:bg-nature-100 transition-all duration-300 ease-organic">
                                                    <svg v-if="showPassword" class="w-5 h-5 text-nature-600"
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

                                        <!-- Indicateur de force du mot de passe -->
                                        <div v-if="form.password" class="space-y-2">
                                            <div class="flex items-center justify-between">
                                                <span class="text-xs font-medium text-nature-700">Force du mot de
                                                    passe</span>
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
                                                        :class="requirement.met ? 'text-fresh-500' : 'text-nature-300'"
                                                        fill="currentColor" viewBox="0 0 20 20">
                                                        <path v-if="requirement.met" fill-rule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clip-rule="evenodd" />
                                                        <path v-else fill-rule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    <span
                                                        :class="requirement.met ? 'text-nature-700' : 'text-nature-400'">
                                                        {{ requirement.text }}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <label class="block text-nature-800 font-medium">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <svg class="w-5 h-5 text-fresh-600" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span>Confirmer le mot de passe</span>
                                            </div>
                                        </label>
                                        <div class="relative group">
                                            <div class="absolute inset-0 bg-gradient-to-r from-fresh-50/50 to-nature-50/50 rounded-xl 
                                  transform group-hover:scale-105 transition-all duration-400 ease-organic 
                                  opacity-0 group-hover:opacity-100"></div>
                                            <div class="relative">
                                                <input v-model="form.confirmPassword"
                                                    :type="showConfirmPassword ? 'text' : 'password'" required
                                                    placeholder="Confirmez votre mot de passe"
                                                    class="input-organic w-full pr-12">
                                                <button type="button"
                                                    @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 
                                       rounded-full hover:bg-nature-100 transition-all duration-300 ease-organic">
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
                                        <div v-if="form.confirmPassword && form.password !== form.confirmPassword"
                                            class="flex items-center space-x-2 text-red-600 text-sm">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span>Les mots de passe ne correspondent pas</span>
                                        </div>
                                        <div v-else-if="form.confirmPassword && form.password === form.confirmPassword"
                                            class="flex items-center space-x-2 text-fresh-600 text-sm">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span>Les mots de passe correspondent</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Adresse -->
                                <div class="space-y-3">
                                    <label class="block text-nature-800 font-medium">
                                        <div class="flex items-center space-x-2 mb-2">
                                            <svg class="w-5 h-5 text-fresh-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span>Adresse de livraison (optionnel)</span>
                                        </div>
                                    </label>
                                    <div class="relative group">
                                        <div class="absolute inset-0 bg-gradient-to-r from-fresh-50/50 to-nature-50/50 rounded-xl 
                                transform group-hover:scale-105 transition-all duration-400 ease-organic 
                                opacity-0 group-hover:opacity-100"></div>
                                        <input v-model="form.address" type="text" placeholder="Rue, numéro, appartement"
                                            class="input-organic relative w-full">
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input v-model="form.city" type="text" placeholder="Ville"
                                            class="input-organic">
                                        <input v-model="form.zipCode" type="text" placeholder="Code postal"
                                            class="input-organic">
                                        <input v-model="form.country" type="text" placeholder="Pays"
                                            class="input-organic">
                                    </div>
                                </div>

                                <!-- Newsletter et conditions -->
                                <div class="space-y-4">
                                    <label class="flex items-start space-x-3 cursor-pointer group">
                                        <div class="relative flex-shrink-0 mt-1">
                                            <input type="checkbox" v-model="form.newsletter" class="sr-only peer">
                                            <div class="w-5 h-5 bg-white border-2 border-nature-300 rounded 
                                  peer-checked:bg-fresh-500 peer-checked:border-fresh-500
                                  transition-all duration-300 ease-organic
                                  group-hover:border-fresh-400
                                  flex items-center justify-center">
                                                <svg v-if="form.newsletter" class="w-3 h-3 text-white"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span class="text-nature-700 group-hover:text-nature-900 
                                 transition-colors duration-300 ease-organic text-sm">
                                            Je souhaite recevoir la newsletter MarketFraîche avec les nouveautés,
                                            les promotions et les recettes de saison.
                                        </span>
                                    </label>

                                    <label class="flex items-start space-x-3 cursor-pointer group">
                                        <div class="relative flex-shrink-0 mt-1">
                                            <input type="checkbox" v-model="form.acceptTerms" class="sr-only peer"
                                                required>
                                            <div class="w-5 h-5 bg-white border-2 border-nature-300 rounded 
                                  peer-checked:bg-fresh-500 peer-checked:border-fresh-500
                                  transition-all duration-300 ease-organic
                                  group-hover:border-fresh-400
                                  flex items-center justify-center">
                                                <svg v-if="form.acceptTerms" class="w-3 h-3 text-white"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span class="text-nature-700 group-hover:text-nature-900 
                                 transition-colors duration-300 ease-organic">
                                            J'accepte les
                                            <a href="#" class="text-fresh-600 hover:text-fresh-800 font-medium underline 
                                       transition-colors duration-300 ease-organic">
                                                conditions générales d'utilisation
                                            </a>
                                            et la
                                            <a href="#" class="text-fresh-600 hover:text-fresh-800 font-medium underline 
                                       transition-colors duration-300 ease-organic">
                                                politique de confidentialité
                                            </a>
                                            <span class="text-red-500">*</span>
                                        </span>
                                    </label>
                                </div>

                                <!-- Bouton d'inscription -->
                                <button type="submit" :disabled="loading || !formValid" class="w-full py-4 px-6 bg-gradient-to-r from-fresh-500 to-bio 
                               hover:from-fresh-600 hover:to-bio-600 
                               text-white font-semibold rounded-xl shadow-lg 
                               transform hover:scale-[1.02] active:scale-95 
                               transition-all duration-500 ease-organic
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                               flex items-center justify-center space-x-3
                               relative overflow-hidden group mt-8">

                                    <!-- Effet de brillance -->
                                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                              translate-x-[-100%] group-hover:translate-x-[100%] 
                              transition-transform duration-1000 ease-organic"></div>

                                    <svg v-if="loading" class="w-5 h-5 animate-spin-slow" fill="none"
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
                                        {{ loading ? 'Création du compte...' : 'Créer mon compte' }}
                                    </span>
                                </button>

                                <!-- Lien vers login -->
                                <div class="text-center pt-6 border-t border-nature-200/50">
                                    <p class="text-nature-600">
                                        Vous avez déjà un compte ?
                                        <router-link to="/auth/login" class="text-fresh-600 hover:text-fresh-800 font-medium 
                                        transform hover:scale-105 transition-all duration-300 ease-organic
                                        inline-flex items-center space-x-1">
                                            <span>Connectez-vous</span>
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </router-link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pied de page -->
            <div class="mt-8 text-center">
                <p class="text-nature-500 text-sm">
                    En créant un compte, vous accédez à l'ensemble de nos services.
                    Vous pouvez modifier vos préférences à tout moment dans votre espace personnel.
                </p>
                <p class="text-nature-400 text-xs mt-2">
                    MarketFraîche © {{ new Date().getFullYear() }} - Tous droits réservés
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { RegisterData } from '@/modules/auth/types/auth.types'

const router = useRouter()
const authStore = useAuthStore()

// État du formulaire
const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Cameroun',
    role: 'Customer', // ✅ NOUVEAU: Rôle par défaut
    newsletter: true,
    acceptTerms: false
})

// États UI
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const successMessage = ref('')
const passwordStrength = ref(0)

// Données pour les illustrations
const vegetables = ref([
    { id: 1, left: 10, duration: 4, delay: 0, color: 'text-red-400', component: 'TomatoIcon' },
    { id: 2, left: 30, duration: 5, delay: 1, color: 'text-green-500', component: 'CarrotIcon' },
    { id: 3, left: 50, duration: 6, delay: 2, color: 'text-purple-400', component: 'EggplantIcon' },
    { id: 4, left: 70, duration: 4.5, delay: 0.5, color: 'text-yellow-500', component: 'PepperIcon' },
    { id: 5, left: 90, duration: 5.5, delay: 1.5, color: 'text-orange-400', component: 'PumpkinIcon' },
])

const basketFruits = ref([
    { id: 1, top: 30, left: 30, rotation: 15, color: 'text-red-300', component: 'AppleIcon' },
    { id: 2, top: 50, left: 50, rotation: -10, color: 'text-green-400', component: 'PearIcon' },
    { id: 3, top: 40, left: 70, rotation: 20, color: 'text-purple-300', component: 'GrapeIcon' },
    { id: 4, top: 60, left: 20, rotation: -15, color: 'text-yellow-300', component: 'LemonIcon' },
])

const benefits = ref([
    {
        id: 1,
        title: 'Produits de saison',
        description: 'Accédez aux meilleurs produits frais selon les saisons',
        icon: 'CalendarIcon',
        iconColor: 'text-fresh-600',
        bgColor: 'bg-fresh-100'
    },
    {
        id: 2,
        title: 'Producteurs camerounais',
        description: 'Soutenir directement les producteurs du Cameroun',
        icon: 'FarmIcon',
        iconColor: 'text-earth-600',
        bgColor: 'bg-earth-100'
    },
    {
        id: 3,
        title: 'Livraison flexible',
        description: 'Choisissez votre créneau de livraison selon vos disponibilités',
        icon: 'TruckIcon',
        iconColor: 'text-accent-orange',
        bgColor: 'bg-orange-100'
    },
    {
        id: 4,
        title: 'Réduction fidélité',
        description: 'Bénéficiez de réductions exclusives dès votre 3ème commande',
        icon: 'DiscountIcon',
        iconColor: 'text-accent-red',
        bgColor: 'bg-red-100'
    }
])

// Composants SVG
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

const PumpkinIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>`
}

const AppleIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 21H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2zM6 5v14h12V5H6z"/>
  </svg>`
}

const PearIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>`
}

const GrapeIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="7" cy="12" r="2"/>
    <circle cx="12" cy="9" r="2"/>
    <circle cx="17" cy="12" r="2"/>
  </svg>`
}

const LemonIcon = {
    template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>`
}

const CalendarIcon = {
    template: `<svg viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
  </svg>`
}

const FarmIcon = {
    template: `<svg viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
  </svg>`
}

const TruckIcon = {
    template: `<svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1.05a2.5 2.5 0 010-4.9V10a1 1 0 001-1V6a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v1.05a2.5 2.5 0 010 4.9V15a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
  </svg>`
}

const DiscountIcon = {
    template: `<svg viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
  </svg>`
}

// Style pour les feuilles flottantes
const leafStyle = (index: number) => {
    const size = 30 + Math.random() * 40
    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
    }
}

const leafColor = (index: number) => {
    const colors = [
        'text-fresh-300/20',
        'text-nature-400/15',
        'text-earth-400/10',
        'text-bio-300/25'
    ]
    return colors[index % colors.length]
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
    if (passwordStrength.value < 80) return 'text-fresh-500'
    return 'text-green-500'
})

const passwordStrengthBarClass = computed(() => {
    if (passwordStrength.value < 30) return 'bg-red-500'
    if (passwordStrength.value < 60) return 'bg-amber-500'
    if (passwordStrength.value < 80) return 'bg-fresh-500'
    return 'bg-green-500'
})

const formValid = computed(() => {
    return (
        form.firstName &&
        form.lastName &&
        form.email &&
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.acceptTerms &&
        passwordStrength.value >= 30
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

    if (!form.firstName.trim()) errors.push('Le prénom est requis')
    if (!form.lastName.trim()) errors.push('Le nom est requis')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) errors.push('Adresse email invalide')

    if (form.password.length < 8) errors.push('Le mot de passe doit contenir au moins 8 caractères')
    if (!/[A-Z]/.test(form.password)) errors.push('Le mot de passe doit contenir au moins une majuscule')
    if (!/[a-z]/.test(form.password)) errors.push('Le mot de passe doit contenir au moins une minuscule')
    if (!/\d/.test(form.password)) errors.push('Le mot de passe doit contenir au moins un chiffre')

    if (form.password !== form.confirmPassword) errors.push('Les mots de passe ne correspondent pas')

    if (!form.acceptTerms) errors.push('Vous devez accepter les conditions générales')

    return errors
}

const handleRegister = async () => {
    const errors = validateForm()

    if (errors.length > 0) {
        errorMessage.value = 'Veuillez corriger les erreurs suivantes'
        errorDetails.value = errors.join(', ')
        return
    }

    loading.value = true
    errorMessage.value = ''
    errorDetails.value = ''

    try {
        const registerData: RegisterData = {
            email: form.email,
            password: form.password,
            phone: form.phone || undefined,
            first_name: form.firstName,
            last_name: form.lastName,
            role: form.role // ✅ NOUVEAU: Envoyer le rôle choisi
        }

        const response = await authStore.register(registerData)

        successMessage.value = response.message || 'Compte créé avec succès ! Veuillez vérifier votre email.'

        // 🔧 FIX: Extraire le token de la réponse et rediriger avec
        console.log('📧 Réponse inscription:', response)
        
        // Extraire le token depuis le detail (format: "Token de vérification (dev mode): abc123")
        let verificationToken = null
        if (response.detail) {
            const tokenMatch = response.detail.match(/Token de vérification \(dev mode\): (.+)/)
            if (tokenMatch && tokenMatch[1]) {
                verificationToken = tokenMatch[1].trim()
                console.log('🎫 Token extrait:', verificationToken)
            }
        }

        // Redirection vers la page de vérification d'email
        setTimeout(() => {
            if (verificationToken) {
                // En mode dev, rediriger avec le token
                console.log('🔄 Redirection avec token vers:', `/auth/verify-email?token=${verificationToken}`)
                router.push(`/auth/verify-email?token=${verificationToken}`)
            } else {
                // En production, rediriger sans token (l'utilisateur doit cliquer sur le lien email)
                console.log('🔄 Redirection sans token (mode production)')
                router.push('/auth/verify-email')
            }
        }, 2000)

    } catch (error: unknown) {
        const err = error as any
        errorMessage.value = err?.response?.data?.detail || 
                           err?.response?.data?.message || 
                           err?.message ||
                           'Une erreur est survenue lors de l\'inscription'
        errorDetails.value = err?.response?.data?.errors ?
            Object.values(err.response.data.errors).flat().join(', ') : ''
    } finally {
        loading.value = false
    }
}

// Initialisation
onMounted(() => {
    // Pré-remplir pour le développement
    if (import.meta.env.DEV) {
        form.firstName = 'Jean'
        form.lastName = 'Dupont'
        form.email = 'jean.dupont@example.com'
        form.phone = '+237670123456'
        form.password = 'Demo123!'
        form.confirmPassword = 'Demo123!'
        form.address = '12 Rue de la Réunification'
        form.city = 'Yaoundé'
        form.zipCode = '00237'
        form.country = 'Cameroun'
        form.acceptTerms = true
        checkPasswordStrength()
    }
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
        transform: translateY(-30px) rotate(180deg);
    }
}

.animate-float {
    animation: float ease-in-out infinite;
}

/* Animation spécifique pour les feuilles */
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

/* Animation d'entrée de page */
.page-enter-active {
    animation: slide-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-leave-active {
    animation: fade-in 0.4s reverse;
}

/* Effet de texture pour les arrière-plans */
.bg-paper-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none' stroke='%23000' stroke-width='0.5' stroke-opacity='0.05'/%3E%3C/svg%3E");
}

.bg-leaf-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,10 Q70,5 85,25 Q95,40 90,60 Q85,80 65,85 Q45,90 30,75 Q15,60 20,40 Q25,20 40,15 Z' fill='%2345a348' fill-opacity='0.03'/%3E%3C/svg%3E");
}

/* Styles spécifiques pour les transitions */
.transition-organic {
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition-duration: 500ms;
}

/* Responsive design */
@media (max-width: 768px) {
    .grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}
</style>