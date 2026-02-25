<template>
    <div class="min-h-screen profile-settings-view">
        <!-- Arrière-plan avec dégradé et texture -->
        <div class="fixed inset-0 -z-10 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-green-50/90 via-emerald-50/70 to-teal-50/50"></div>
            <div
                class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzQ2YTM5MyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiM2I5YWIiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==')] opacity-[0.02]">
            </div>
            <div class="absolute inset-0 bg-veggie-pattern opacity-[0.015] animate-drift-slow"></div>

            <!-- Éléments décoratifs flottants -->
            <div
                class="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-green-200/10 to-emerald-200/5 blur-3xl animate-pulse-gentle">
            </div>
            <div
                class="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-teal-200/10 to-cyan-200/5 blur-3xl animate-pulse-gentle delay-1000">
            </div>
            <div
                class="absolute top-2/3 left-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-amber-200/10 to-orange-200/5 blur-3xl animate-pulse-gentle delay-2000">
            </div>
        </div>

        <!-- Navigation -->
        <nav class="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-green-100/50">
            <div class="container mx-auto px-4 py-3">
                <div class="flex justify-between items-center">
                    <router-link :to="settingsBackRoute"
                        class="flex items-center space-x-2 group transition-all duration-500 ease-out-custom">
                        <ArrowLeftIcon
                            class="w-5 h-5 text-green-600 transform group-hover:-translate-x-1 transition-transform duration-300" />
                        <span class="text-green-700 hover:text-green-800 transition-colors duration-300">
                            Retour au profil
                        </span>
                    </router-link>

                    <div class="flex items-center space-x-2">
                        <div class="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                       border border-green-200/50 text-green-700 text-sm">
                            <span class="font-medium">Paramètres</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-8 max-w-6xl">
            <!-- En-tête avec illustration split-screen -->
            <div class="mb-12">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <!-- Partie gauche : Texte -->
                    <div class="lg:col-span-1 transform transition-all duration-700 ease-out-custom" :class="{
                        'translate-x-0 opacity-100': !loading,
                        '-translate-x-4 opacity-0': loading
                    }">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
                        bg-gradient-to-r from-green-100 to-emerald-100 mb-6
                        border border-green-200/50 shadow-sm animate-pulse-subtle">
                            <Cog8ToothIcon class="w-8 h-8 text-green-700" />
                        </div>

                        <h1 class="text-4xl font-serif font-bold text-green-900 mb-4">
                            Paramètres & <span class="text-emerald-600">Confidentialité</span>
                        </h1>
                        <p class="text-lg text-green-600/80 mb-6">
                            Gérez vos préférences, votre sécurité et vos données personnelles
                        </p>

                        <!-- Indicateur visuel -->
                        <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 
                        border border-green-200/50 backdrop-blur-sm">
                            <ShieldCheckIcon class="w-4 h-4 text-green-600 mr-2" />
                            <span class="text-sm text-green-700/90 font-medium">
                                Votre compte est sécurisé et protégé
                            </span>
                        </div>
                    </div>

                    <!-- Partie droite : Illustration gourmande -->
                    <div class="lg:col-span-1 transform transition-all duration-700 ease-out-custom delay-300" :class="{
                        'translate-x-0 opacity-100': !loading,
                        'translate-x-4 opacity-0': loading
                    }">
                        <div class="relative">
                            <div class="bg-gradient-to-br from-green-100/50 to-emerald-100/30 rounded-3xl 
                        border border-green-200/30 p-8 backdrop-blur-sm">
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="col-span-1 flex flex-col gap-4">
                                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-200 to-emerald-200 
                              flex items-center justify-center animate-float delay-100">
                                            <AppleIcon class="w-8 h-8 text-green-700" />
                                        </div>
                                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-200 to-orange-200 
                              flex items-center justify-center animate-float delay-300">
                                            <CarrotIcon class="w-8 h-8 text-amber-700" />
                                        </div>
                                    </div>
                                    <div class="col-span-2 flex flex-col gap-4">
                                        <div class="w-full h-16 rounded-2xl bg-gradient-to-br from-emerald-200 to-teal-200 
                              flex items-center justify-center animate-float delay-200">
                                            <LeafIcon class="w-10 h-10 text-emerald-700" />
                                        </div>
                                        <div class="w-full h-16 rounded-2xl bg-gradient-to-br from-lime-200 to-green-200 
                              flex items-center justify-center animate-float delay-400">
                                            <ShoppingBagIcon class="w-10 h-10 text-lime-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Badge flottant -->
                            <div class="absolute -top-3 -right-3">
                                <div class="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                          text-white text-sm font-medium shadow-lg animate-pulse-subtle">
                                    🌿 100% Local
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sections des paramètres -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Colonne gauche : Navigation des sections -->
                <div class="lg:col-span-1">
                    <div class="sticky top-24 space-y-3">
                        <button v-for="section in sections" :key="section.id" @click="scrollToSection(section.id)"
                            class="w-full text-left p-4 rounded-2xl transition-all duration-300 ease-out-custom
                     flex items-center space-x-3 group" :class="{
                        'bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-200/50': activeSection === section.id,
                        'bg-white/80 border border-green-100/50 hover:bg-green-50/50': activeSection !== section.id
                    }">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :class="{
                                'bg-gradient-to-r from-green-500 to-emerald-600 text-white': activeSection === section.id,
                                'bg-green-100 text-green-700 group-hover:bg-green-200': activeSection !== section.id
                            }">
                                <component :is="section.icon" class="w-5 h-5" />
                            </div>
                            <div class="flex-1">
                                <div class="font-semibold text-green-900">{{ section.title }}</div>
                                <div class="text-sm text-green-600/70">{{ section.description }}</div>
                            </div>
                            <ChevronRightIcon class="w-4 h-4 text-green-500 transform transition-transform duration-300"
                                :class="{
                                    'translate-x-1': activeSection === section.id
                                }" />
                        </button>

                        <!-- Carte de statut -->
                        <div class="mt-6 bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-sm 
                       rounded-2xl border border-green-200/50 p-5">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                           flex items-center justify-center">
                                    <CheckCircleIcon class="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <div class="font-semibold text-green-900">Statut du compte</div>
                                    <div class="text-sm text-green-600/70">Vérifié & Actif</div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-green-700/80">Dernière connexion</span>
                                    <span class="text-sm font-medium text-green-900">Aujourd'hui</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-green-700/80">Membre depuis</span>
                                    <span class="text-sm font-medium text-green-900">{{ formatDate(profile?.createdAt)
                                    }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-green-700/80">Sessions actives</span>
                                    <span class="text-sm font-medium text-green-900">1 appareil</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonne droite : Contenu des sections -->
                <div class="lg:col-span-2">
                    <div class="space-y-8">
                        <!-- Section Compte -->
                        <section id="account" ref="accountRef" class="scroll-mt-24">
                            <div class="bg-white/95 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                             flex items-center justify-center">
                                        <UserCircleIcon class="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-serif font-semibold text-green-900">
                                            Compte
                                        </h2>
                                        <p class="text-green-600/70">
                                            Informations de base et sécurité
                                        </p>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <!-- Email -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                             border border-green-200/50">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <div class="font-medium text-green-800 mb-1">Adresse email</div>
                                                <div class="text-sm text-green-600/70">
                                                    {{ userEmail }}
                                                    <span class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full 
                                       text-xs bg-green-100 text-green-700">
                                                        Vérifié
                                                    </span>
                                                </div>
                                            </div>
                                            <button @click="showEmailModal = true" class="px-4 py-2 rounded-full border border-green-300 text-green-700 
                               bg-white hover:bg-green-50 transition-all duration-300 ease-out-custom
                               hover:scale-[1.02] active:scale-[0.98] text-sm">
                                                Modifier
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Mot de passe -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 
                             border border-amber-200/50">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <div class="font-medium text-amber-800 mb-1">Mot de passe</div>
                                                <div class="text-sm text-amber-600/70">
                                                    ●●●●●●●●●●
                                                    <span class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full 
                                       text-xs bg-green-100 text-green-700">
                                                        Fort
                                                    </span>
                                                </div>
                                            </div>
                                            <button @click="showPasswordModal = true" class="px-4 py-2 rounded-full border border-amber-300 text-amber-700 
                               bg-white hover:bg-amber-50 transition-all duration-300 ease-out-custom
                               hover:scale-[1.02] active:scale-[0.98] text-sm">
                                                Changer
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Connexions actives -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 
                             border border-blue-200/50">
                                        <div class="flex items-center justify-between mb-4">
                                            <div>
                                                <div class="font-medium text-blue-800">Sessions actives</div>
                                                <div class="text-sm text-blue-600/70">
                                                    Appareils connectés à votre compte
                                                </div>
                                            </div>
                                            <button @click="showSessionsModal = true" class="px-4 py-2 rounded-full border border-blue-300 text-blue-700 
                               bg-white hover:bg-blue-50 transition-all duration-300 ease-out-custom
                               hover:scale-[1.02] active:scale-[0.98] text-sm">
                                                Gérer
                                            </button>
                                        </div>

                                        <div class="space-y-3">
                                            <div class="flex items-center justify-between p-3 rounded-xl bg-white/50 
                                 border border-blue-100/50">
                                                <div class="flex items-center space-x-3">
                                                    <DevicePhoneMobileIcon class="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <div class="font-medium text-blue-900">iPhone 14 Pro</div>
                                                        <div class="text-xs text-blue-600/70">Yaoundé, Cameroun •
                                                            Aujourd'hui</div>
                                                    </div>
                                                </div>
                                                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Déconnexion -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-red-50/50 to-rose-50/50 
                             border border-red-200/50">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <div class="font-medium text-red-800 mb-1">Déconnexion</div>
                                                <div class="text-sm text-red-600/70">
                                                    Fermer la session sur cet appareil
                                                </div>
                                            </div>
                                            <button @click="handleLogout" :disabled="isLoggingOut" class="px-4 py-2 rounded-full border border-red-300 text-red-700 
                               bg-white hover:bg-red-50 transition-all duration-300 ease-out-custom
                               hover:scale-[1.02] active:scale-[0.98] text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                                                {{ isLoggingOut ? 'Déconnexion...' : 'Se déconnecter' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Section Apparence -->
                        <section id="appearance" ref="appearanceRef" class="scroll-mt-24">
                            <div class="bg-white/95 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 
                             flex items-center justify-center">
                                        <Cog8ToothIcon class="w-6 h-6 text-indigo-700" />
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-serif font-semibold text-green-900">
                                            Apparence
                                        </h2>
                                        <p class="text-green-600/70">
                                            Personnalisez l'affichage de votre application
                                        </p>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/50 to-violet-50/50 
                             border border-indigo-200/50">
                                        <div class="font-medium text-indigo-800 mb-3">Thème</div>
                                        <div class="grid grid-cols-2 gap-3">
                                            <button @click="setThemeMode('light')"
                                                class="py-2.5 rounded-xl text-sm transition-all duration-300 ease-out-custom"
                                                :class="{
                                                    'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm': !isDarkTheme,
                                                    'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50': isDarkTheme
                                                }">
                                                Clair
                                            </button>
                                            <button @click="setThemeMode('dark')"
                                                class="py-2.5 rounded-xl text-sm transition-all duration-300 ease-out-custom"
                                                :class="{
                                                    'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm': isDarkTheme,
                                                    'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50': !isDarkTheme
                                                }">
                                                Sombre
                                            </button>
                                        </div>
                                    </div>

                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between p-4 rounded-2xl 
                               bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                               border border-green-200/50">
                                            <div>
                                                <div class="font-medium text-green-800">Réduire les animations</div>
                                                <div class="text-sm text-green-600/70">
                                                    Limite les effets animés pour un affichage plus stable
                                                </div>
                                            </div>
                                            <ToggleSwitch v-model="reducedMotion" :active-color="'bg-green-500'" />
                                        </div>

                                        <div class="flex items-center justify-between p-4 rounded-2xl 
                               bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                               border border-green-200/50">
                                            <div>
                                                <div class="font-medium text-green-800">Mode compact</div>
                                                <div class="text-sm text-green-600/70">
                                                    Réduit légèrement la taille globale pour afficher plus de contenu
                                                </div>
                                            </div>
                                            <ToggleSwitch v-model="compactMode" :active-color="'bg-green-500'" />
                                        </div>

                                        <div class="flex items-center justify-between p-4 rounded-2xl 
                               bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                               border border-green-200/50">
                                            <div>
                                                <div class="font-medium text-green-800">Contraste renforcé</div>
                                                <div class="text-sm text-green-600/70">
                                                    Améliore la lisibilité des textes et des bordures
                                                </div>
                                            </div>
                                            <ToggleSwitch v-model="highContrast" :active-color="'bg-green-500'" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Section Notifications -->
                        <section id="notifications" ref="notificationsRef" class="scroll-mt-24">
                            <div class="bg-white/95 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 
                             flex items-center justify-center">
                                        <BellIcon class="w-6 h-6 text-amber-700" />
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-serif font-semibold text-green-900">
                                            Notifications
                                        </h2>
                                        <p class="text-green-600/70">
                                            Personnalisez vos préférences de communication
                                        </p>
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <div v-for="setting in notificationSettings" :key="setting.id" class="flex items-center justify-between p-4 rounded-2xl 
                              bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                              border border-green-200/50 hover:bg-green-100/30 
                              transition-all duration-300">
                                        <div class="flex items-center space-x-3">
                                            <div
                                                class="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                                <component :is="setting.icon" class="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div class="font-medium text-green-800">{{ setting.title }}</div>
                                                <div class="text-sm text-green-600/70">{{ setting.description }}</div>
                                            </div>
                                        </div>
                                        <ToggleSwitch v-model="setting.enabled" :active-color="'bg-green-500'" />
                                    </div>
                                </div>

                                <!-- Fréquence des emails -->
                                <div class="mt-8 p-4 rounded-2xl bg-gradient-to-r from-teal-50/50 to-cyan-50/50 
                           border border-teal-200/50">
                                    <div class="font-medium text-teal-800 mb-3">Fréquence des emails</div>
                                    <div class="grid grid-cols-3 gap-3">
                                        <button v-for="freq in emailFrequencies" :key="freq.id"
                                            @click="selectedFrequency = freq.id"
                                            class="py-2.5 rounded-xl text-sm transition-all duration-300 ease-out-custom"
                                            :class="{
                                                'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm': selectedFrequency === freq.id,
                                                'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50': selectedFrequency !== freq.id
                                            }">
                                            {{ freq.label }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Section Confidentialité -->
                        <section id="privacy" ref="privacyRef" class="scroll-mt-24">
                            <div class="bg-white/95 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 
                             flex items-center justify-center">
                                        <ShieldCheckIcon class="w-6 h-6 text-blue-700" />
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-serif font-semibold text-green-900">
                                            Confidentialité
                                        </h2>
                                        <p class="text-green-600/70">
                                            Contrôlez vos données personnelles
                                        </p>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <!-- Données personnelles -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 
                             border border-blue-200/50">
                                        <div class="flex items-center justify-between mb-3">
                                            <div>
                                                <div class="font-medium text-blue-800">Données personnelles</div>
                                                <div class="text-sm text-blue-600/70">
                                                    Téléchargez ou supprimez vos données
                                                </div>
                                            </div>
                                            <button @click="exportData" class="px-4 py-2 rounded-full border border-blue-300 text-blue-700 
                               bg-white hover:bg-blue-50 transition-all duration-300 ease-out-custom
                               hover:scale-[1.02] active:scale-[0.98] text-sm">
                                                Exporter
                                            </button>
                                        </div>

                                        <div class="text-xs text-blue-600/70">
                                            Vos données incluent : Profil, commandes, adresses, préférences
                                        </div>
                                    </div>

                                    <!-- Confidentialité du profil -->
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between p-4 rounded-2xl 
                               bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                               border border-green-200/50">
                                            <div>
                                                <div class="font-medium text-green-800">Profil public</div>
                                                <div class="text-sm text-green-600/70">
                                                    Rendre mon profil visible par les producteurs
                                                </div>
                                            </div>
                                            <ToggleSwitch v-model="publicProfile" :active-color="'bg-green-500'" />
                                        </div>

                                        <div class="flex items-center justify-between p-4 rounded-2xl 
                               bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                               border border-green-200/50">
                                            <div>
                                                <div class="font-medium text-green-800">Recherche par email</div>
                                                <div class="text-sm text-green-600/70">
                                                    Permettre aux producteurs de me trouver par email
                                                </div>
                                            </div>
                                            <ToggleSwitch v-model="emailSearchable" :active-color="'bg-green-500'" />
                                        </div>
                                    </div>

                                    <!-- Politique de confidentialité -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-slate-50/50 to-gray-50/50 
                             border border-slate-200/50">
                                        <div class="flex items-start space-x-3">
                                            <DocumentTextIcon class="w-5 h-5 text-slate-600 mt-0.5" />
                                            <div>
                                                <div class="font-medium text-slate-800 mb-1">
                                                    Politique de confidentialité
                                                </div>
                                                <div class="text-sm text-slate-600/70">
                                                    Consultez notre politique de traitement des données
                                                </div>
                                            </div>
                                        </div>

                                        <button @click="openPrivacyPolicy" class="mt-4 w-full py-2.5 rounded-full border border-slate-300 text-slate-700 
                             bg-white hover:bg-slate-50 transition-all duration-300 ease-out-custom
                             hover:scale-[1.02] active:scale-[0.98] text-sm">
                                            Lire la politique
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Section Compte avancée -->
                        <section id="advanced" ref="advancedRef" class="scroll-mt-24">
                            <div class="bg-white/95 backdrop-blur-sm rounded-3xl border border-red-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-red-100 to-pink-100 
                             flex items-center justify-center">
                                        <ExclamationTriangleIcon class="w-6 h-6 text-red-700" />
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-serif font-semibold text-red-900">
                                            Zone de risque
                                        </h2>
                                        <p class="text-red-600/70">
                                            Actions irréversibles sur votre compte
                                        </p>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <!-- Désactivation temporaire -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 
                             border border-amber-200/50">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <div class="font-medium text-amber-800 mb-1">Désactiver temporairement
                                                </div>
                                                <div class="text-sm text-amber-600/70 mb-4">
                                                    Votre compte sera masqué mais vos données conservées
                                                </div>
                                            </div>
                                            <button @click="showDeactivateModal = true" class="px-4 py-2 rounded-full border border-amber-300 text-amber-700 
                               bg-white hover:bg-amber-50 transition-all duration-300 ease-out-custom
                               hover:scale-[1.02] active:scale-[0.98] text-sm">
                                                Désactiver
                                            </button>
                                        </div>

                                        <div class="text-xs text-amber-600/60">
                                            ⓘ Vous pourrez réactiver votre compte à tout moment
                                        </div>
                                    </div>

                                    <!-- Suppression définitive -->
                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-red-50/50 to-pink-50/50 
                             border border-red-200/50">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <div class="font-medium text-red-800 mb-1">Supprimer définitivement
                                                </div>
                                                <div class="text-sm text-red-600/70 mb-4">
                                                    Toutes vos données seront supprimées de façon irréversible
                                                </div>
                                            </div>
                                            <button @click="showDeleteModal = true" class="px-4 py-2 rounded-full border border-red-300 text-red-700 
                               bg-white hover:bg-red-50 transition-all duration-300 ease-out-custom
                               hover:scale-[1.02] active:scale-[0.98] text-sm">
                                                Supprimer
                                            </button>
                                        </div>

                                        <div class="text-xs text-red-600/60">
                                            ⚠️ Cette action est irréversible. Toutes vos données seront perdues.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>

        <!-- Modals -->

        <!-- Modal email -->
        <transition name="fade-scale">
            <div v-if="showEmailModal"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @click.self="closeEmailModal">
                <div class="bg-white rounded-3xl border border-green-200/70 max-w-md w-full p-6 
                    transform transition-all duration-300 ease-out-custom scale-100" @click.stop>
                    <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                     flex items-center justify-center mb-4">
                        <EnvelopeIcon class="w-8 h-8 text-green-700" />
                    </div>

                    <h3 class="text-xl font-serif font-semibold text-green-900 text-center mb-2">
                        Modifier l'email
                    </h3>

                    <p class="text-green-700/80 text-center mb-6">
                        Vous recevrez un email de confirmation à la nouvelle adresse
                    </p>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-green-800 mb-2">
                                Nouvel email
                            </label>
                            <input v-model="newEmail" type="email" class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                       bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                       focus:ring-green-200/50 focus:outline-none transition-all duration-300"
                                placeholder="nouveau@email.com" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-green-800 mb-2">
                                Mot de passe actuel
                            </label>
                            <input v-model="currentPassword" type="password" class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                       bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                       focus:ring-green-200/50 focus:outline-none transition-all duration-300"
                                placeholder="●●●●●●●●●●" />
                        </div>
                    </div>

                    <div class="flex space-x-4 mt-6">
                        <button @click="closeEmailModal" class="flex-1 px-4 py-3 rounded-full border border-green-300 text-green-700 
                     bg-white hover:bg-green-50 transition-all duration-300 ease-out-custom">
                            Annuler
                        </button>

                        <button @click="updateEmail" :disabled="!newEmail || !currentPassword" class="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                     text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ease-out-custom
                     disabled:opacity-50 disabled:cursor-not-allowed">
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Toast notification -->
        <transition name="slide-up">
            <div v-if="showToast" class="fixed bottom-6 right-6 max-w-sm bg-gradient-to-r from-green-500 to-emerald-600 
               text-white rounded-2xl shadow-lg p-4 z-50">
                <div class="flex items-center space-x-3">
                    <CheckCircleIcon class="w-5 h-5" />
                    <div>
                        <div class="font-medium">{{ toastMessage }}</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { CustomerProfile } from '../types'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useCustomerStore } from '../stores/useCustomerStore'
import { apiClient } from '@/shared/services/api'
import { useTheme } from '@/composables/useTheme'

// Icons
import {
    ArrowLeftIcon,
    Cog8ToothIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    BellIcon,
    ExclamationTriangleIcon,
    ChevronRightIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    DevicePhoneMobileIcon,
    DocumentTextIcon,
    // AppleIcon, // N'existe pas
    // CarrotIcon, // N'existe pas  
    // LeafIcon, // N'existe pas
    ShoppingBagIcon
} from '@heroicons/vue/24/outline'

// Store et router
const router = useRouter()
const authStore = useAuthStore()
const customerStore = useCustomerStore()
const { theme, setTheme } = useTheme()

// États
const loading = ref(false)
const showEmailModal = ref(false)
const showPasswordModal = ref(false)
const showSessionsModal = ref(false)
const showDeactivateModal = ref(false)
const showDeleteModal = ref(false)
const isLoggingOut = ref(false)
const showToast = ref(false)
const activeSection = ref('account')
const toastMessage = ref('')

// Données modales
const newEmail = ref('')
const currentPassword = ref('')
const publicProfile = ref(true)
const emailSearchable = ref(false)
const selectedFrequency = ref('weekly')
const reducedMotion = ref(false)
const compactMode = ref(false)
const highContrast = ref(false)

// Refs pour les sections
const accountRef = ref<HTMLElement>()
const appearanceRef = ref<HTMLElement>()
const notificationsRef = ref<HTMLElement>()
const privacyRef = ref<HTMLElement>()
const advancedRef = ref<HTMLElement>()

// Données
const profile = ref<CustomerProfile | null>(null)

const UI_PREF_KEYS = {
    REDUCED_MOTION: 'ui_reduced_motion',
    COMPACT_MODE: 'ui_compact_mode',
    HIGH_CONTRAST: 'ui_high_contrast'
} as const

// Sections de navigation
const sections = [
    {
        id: 'account',
        title: 'Compte & Sécurité',
        description: 'Email, mot de passe, sessions',
        icon: 'UserCircleIcon'
    },
    {
        id: 'appearance',
        title: 'Apparence',
        description: 'Thème et affichage',
        icon: 'Cog8ToothIcon'
    },
    {
        id: 'notifications',
        title: 'Notifications',
        description: 'Préférences de communication',
        icon: 'BellIcon'
    },
    {
        id: 'privacy',
        title: 'Confidentialité',
        description: 'Données personnelles',
        icon: 'ShieldCheckIcon'
    },
    {
        id: 'advanced',
        title: 'Zone de risque',
        description: 'Actions irréversibles',
        icon: 'ExclamationTriangleIcon'
    }
]

const notificationSettings = reactive([
    {
        id: 'orders',
        title: 'Commandes',
        description: 'Suivi et confirmations de commandes',
        icon: 'ShoppingBagIcon',
        enabled: true
    },
    {
        id: 'newsletter',
        title: 'Newsletter',
        description: 'Actualités et offres spéciales',
        icon: 'EnvelopeIcon',
        enabled: true
    },
    {
        id: 'product_updates',
        title: 'Nouveautés produits',
        description: 'Nouveaux arrivages et saisons',
        icon: 'BellIcon',
        enabled: true
    },
    {
        id: 'producer_news',
        title: 'Nouvelles des producteurs',
        description: 'Actualités de vos producteurs favoris',
        icon: 'UserGroupIcon',
        enabled: false
    }
])

const emailFrequencies = [
    { id: 'daily', label: 'Quotidien' },
    { id: 'weekly', label: 'Hebdomadaire' },
    { id: 'monthly', label: 'Mensuel' }
]

const userEmail = computed(() => {
    return authStore.currentUser?.email || profile.value?.email || ''
})

const isProducerUser = computed(() =>
    (authStore.currentUser?.roles || []).some(role => String(role?.name || '').toLowerCase() === 'producer')
)

const settingsBackRoute = computed(() => (isProducerUser.value ? '/producer/dashboard' : '/profile/customer'))

const isDarkTheme = computed(() => theme.value === 'dark')

const setThemeMode = (mode: 'light' | 'dark') => {
    setTheme(mode)
}

const getStoredBoolPreference = (key: string) => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(key) === '1'
}

const persistBoolPreference = (key: string, value: boolean) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, value ? '1' : '0')
}

const applyPreferenceClass = (className: string, enabled: boolean) => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle(className, enabled)
}

const initializeAppearancePreferences = () => {
    reducedMotion.value = getStoredBoolPreference(UI_PREF_KEYS.REDUCED_MOTION)
    compactMode.value = getStoredBoolPreference(UI_PREF_KEYS.COMPACT_MODE)
    highContrast.value = getStoredBoolPreference(UI_PREF_KEYS.HIGH_CONTRAST)

    applyPreferenceClass('app-reduced-motion', reducedMotion.value)
    applyPreferenceClass('app-compact', compactMode.value)
    applyPreferenceClass('app-high-contrast', highContrast.value)
}

watch(reducedMotion, (enabled) => {
    applyPreferenceClass('app-reduced-motion', enabled)
    persistBoolPreference(UI_PREF_KEYS.REDUCED_MOTION, enabled)
})

watch(compactMode, (enabled) => {
    applyPreferenceClass('app-compact', enabled)
    persistBoolPreference(UI_PREF_KEYS.COMPACT_MODE, enabled)
})

watch(highContrast, (enabled) => {
    applyPreferenceClass('app-high-contrast', enabled)
    persistBoolPreference(UI_PREF_KEYS.HIGH_CONTRAST, enabled)
})

// Méthodes
const loadProfile = async () => {
    loading.value = true
    try {
        if (!authStore.currentUser) {
            await authStore.fetchCurrentUser()
        }
        await customerStore.fetchProfile()
        profile.value = customerStore.profile

    } catch (error) {
        console.error('Erreur chargement profil:', error)
    } finally {
        loading.value = false
    }
}

const scrollToSection = (sectionId: string) => {
    activeSection.value = sectionId
    const sectionRef = {
        account: accountRef,
        appearance: appearanceRef,
        notifications: notificationsRef,
        privacy: privacyRef,
        advanced: advancedRef
    }[sectionId]

    if (sectionRef?.value) {
        sectionRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }
}

const handleScroll = () => {
    const scrollPosition = window.scrollY + 100

    // Déterminer la section active en fonction de la position de défilement
    const sections = [
        { id: 'account', ref: accountRef },
        { id: 'appearance', ref: appearanceRef },
        { id: 'notifications', ref: notificationsRef },
        { id: 'privacy', ref: privacyRef },
        { id: 'advanced', ref: advancedRef }
    ]

    for (const section of sections) {
        if (section.ref.value) {
            const { offsetTop, offsetHeight } = section.ref.value
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                activeSection.value = section.id
                break
            }
        }
    }
}

const updateEmail = async () => {
    if (!newEmail.value || !currentPassword.value) return

    try {
        await apiClient.put('/authentification/auth/me', {
            email: newEmail.value
        })
        await authStore.fetchCurrentUser()
        showToastMessage('Email mis à jour avec succès')
        closeEmailModal()
        newEmail.value = ''
        currentPassword.value = ''

    } catch (error) {
        console.error('Erreur mise à jour email:', error)
        showToastMessage('Erreur lors de la mise à jour', true)
    }
}

const handleLogout = async () => {
    if (isLoggingOut.value) return
    isLoggingOut.value = true
    try {
        await authStore.logout()
        router.push('/login')
    } catch (error) {
        console.error('Erreur de déconnexion:', error)
        showToastMessage('Impossible de se déconnecter pour le moment', true)
    } finally {
        isLoggingOut.value = false
    }
}

const exportData = async () => {
    try {
        showToastMessage('Export de vos données en cours...')
        showToastMessage('Demande d\'export enregistrée.')

    } catch (error) {
        console.error('Erreur export:', error)
        showToastMessage('Erreur lors de l\'export', true)
    }
}

const openPrivacyPolicy = () => {
    window.open('/privacy-policy', '_blank')
}

const showToastMessage = (message: string, isError = false) => {
    toastMessage.value = message
    showToast.value = true

    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

const closeEmailModal = () => {
    showEmailModal.value = false
    newEmail.value = ''
    currentPassword.value = ''
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'récemment'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// Composant ToggleSwitch
const ToggleSwitch = {
    props: {
        modelValue: Boolean,
        activeColor: {
            type: String,
            default: 'bg-green-500'
        }
    },
    emits: ['update:modelValue'],
    setup(props: any, { emit }: any) {
        const toggle = () => {
            emit('update:modelValue', !props.modelValue)
        }

        return { toggle }
    },
    template: `
    <button
      type="button"
      @click="toggle"
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-out-custom"
      :class="modelValue ? activeColor : 'bg-gray-200'"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-out-custom"
        :class="modelValue ? 'translate-x-6' : 'translate-x-1'"
      />
    </button>
  `
}

// Composants d'icônes supplémentaires
const UserGroupIcon = {
    template: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>'
}

// Cycle de vie
onMounted(() => {
    initializeAppearancePreferences()
    loadProfile()
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Styles spécifiques à cette vue */
.profile-settings-view {
    --curve-primary: cubic-bezier(0.4, 0, 0.2, 1);
    --curve-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animations personnalisées */
@keyframes drift-slow {
    0% {
        background-position: 0% 0%;
    }

    50% {
        background-position: 100% 100%;
    }

    100% {
        background-position: 0% 0%;
    }
}

@keyframes pulse-gentle {

    0%,
    100% {
        opacity: 0.1;
        transform: scale(1);
    }

    50% {
        opacity: 0.2;
        transform: scale(1.1);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes pulse-subtle {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
    }
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-scale {
    0% {
        opacity: 0;
        transform: scale(0.95);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

/* Appliquer les animations */
.animate-drift-slow {
    animation: drift-slow 60s ease-in-out infinite;
}

.animate-pulse-gentle {
    animation: pulse-gentle 6s ease-in-out infinite;
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-pulse-subtle {
    animation: pulse-subtle 3s ease-in-out infinite;
}

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

.delay-1000 {
    animation-delay: 1000ms;
}

.delay-2000 {
    animation-delay: 2000ms;
}

.slide-up-enter-active {
    animation: slide-up 0.4s var(--curve-bouncy);
}

.slide-up-leave-active {
    animation: slide-up 0.4s var(--curve-bouncy) reverse;
}

.fade-scale-enter-active {
    animation: fade-scale 0.3s var(--curve-bouncy);
}

.fade-scale-leave-active {
    animation: fade-scale 0.3s var(--curve-bouncy) reverse;
}

/* Pattern de légumes en filigrane */
.bg-veggie-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234CAF50' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c-5.523 0-10-4.477-10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10C14.477 20 10 15.523 10 10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Classes utilitaires personnalisées */
.ease-out-custom {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Optimisations pour le dégradé */
.bg-gradient-to-br {
    background-attachment: fixed;
}

/* Effets de verre améliorés */
.backdrop-blur-sm {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

/* Bordures subtiles */
.border-green-100\/70 {
    border-color: rgba(209, 250, 229, 0.7);
}

.border-amber-200\/50 {
    border-color: rgba(253, 230, 138, 0.5);
}

.border-red-100\/70 {
    border-color: rgba(254, 226, 226, 0.7);
}

/* Ombre portée naturelle */
.shadow-sm {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-md:hover {
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.15);
}

/* Personnalisation de la scrollbar */
.profile-settings-view ::-webkit-scrollbar {
    width: 6px;
}

.profile-settings-view ::-webkit-scrollbar-track {
    background: rgba(209, 250, 229, 0.3);
    border-radius: 10px;
}

.profile-settings-view ::-webkit-scrollbar-thumb {
    background: rgba(76, 175, 80, 0.5);
    border-radius: 10px;
}

.profile-settings-view ::-webkit-scrollbar-thumb:hover {
    background: rgba(76, 175, 80, 0.7);
}

/* Amélioration du focus pour l'accessibilité */
button:focus-visible {
    outline: 2px solid rgba(76, 175, 80, 0.5);
    outline-offset: 2px;
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 2px solid rgba(76, 175, 80, 0.3);
    outline-offset: 2px;
}

/* Amélioration des transitions */
.scroll-mt-24 {
    scroll-margin-top: 6rem;
}

/* Optimisation des performances */
.transform {
    will-change: transform;
}

.backdrop-blur-sm {
    will-change: backdrop-filter;
}

/* Responsive improvements */
@media (max-width: 768px) {
    .scroll-mt-24 {
        scroll-margin-top: 4rem;
    }

    .profile-settings-view ::-webkit-scrollbar {
        width: 4px;
    }
}

/* Color scheme piloté par le thème applicatif */
:global(:root[data-theme='light']) .profile-settings-view {
    color-scheme: light;
}

:global(:root[data-theme='dark']) .profile-settings-view {
    color-scheme: dark;
}

/* Print styles */
@media print {
    .profile-settings-view {
        background: white !important;
    }

    .bg-gradient-to-br,
    .backdrop-blur-sm,
    .animate-float,
    .animate-pulse-gentle {
        display: none !important;
    }
}
</style>
