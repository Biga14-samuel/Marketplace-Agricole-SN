<template>
    <div class="min-h-screen customer-profile-view">
        <!-- Arrière-plan avec dégradé et texture -->
        <div class="fixed inset-0 -z-10">
            <div class="absolute inset-0 bg-gradient-to-br from-green-50/80 via-cream-50/60 to-amber-50/40"></div>
            <div
                class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzRjYWY5MyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4N2RiYjAiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==')] opacity-[0.03]">
            </div>
            <div class="absolute inset-0 bg-leaves-pattern opacity-[0.02] animate-float-slow"></div>
        </div>

        <!-- Navigation -->
        <nav class="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-green-100/50">
            <div class="container mx-auto px-4 py-3">
                <div class="flex justify-between items-center">
                    <router-link to="/"
                        class="flex items-center space-x-2 group transition-all duration-500 ease-out-custom">
                        <div
                            class="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 
                        flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                            <SparklesIcon class="w-5 h-5 text-white" />
                        </div>
                        <span class="text-xl font-serif font-semibold text-green-800 tracking-tight">
                            MarketFrais
                        </span>
                    </router-link>

                    <div class="flex items-center space-x-4">
                        <button @click="goToAddresses" class="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm 
                     border border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300
                     transition-all duration-300 ease-out-custom hover:scale-[1.02] hover:shadow-sm">
                            <MapPinIcon class="w-4 h-4" />
                            <span>Mes adresses</span>
                        </button>

                        <button @click="goToSettings" class="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm 
                     border border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300
                     transition-all duration-300 ease-out-custom hover:scale-[1.02] hover:shadow-sm">
                            <CogIcon class="w-4 h-4" />
                            <span>Paramètres</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-8 max-w-6xl">
            <!-- En-tête du profil -->
            <div class="mb-8 transform transition-all duration-700 ease-out-custom" :class="{
                'translate-y-0 opacity-100': !loading,
                'translate-y-4 opacity-0': loading
            }">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h1 class="text-3xl font-serif font-bold text-green-900 mb-2">
                            Mon Profil
                        </h1>
                        <p class="text-green-600/80">
                            Gérez vos informations personnelles et préférences
                        </p>
                    </div>

                    <div class="flex items-center space-x-3">
                        <button v-if="!isEditing" @click="startEditing" class="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                     text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg
                     transition-all duration-300 ease-out-custom hover:scale-[1.02] active:scale-[0.98]
                     transform shadow-md">
                            <PencilIcon class="w-4 h-4" />
                            <span>Modifier</span>
                        </button>

                        <button v-if="isEditing" @click="cancelEditing" class="px-5 py-2.5 rounded-full border border-red-300 text-red-600 bg-red-50/80
                     hover:bg-red-100 hover:border-red-400 transition-all duration-300 ease-out-custom">
                            Annuler
                        </button>
                    </div>
                </div>

                <!-- Indicateur de saison -->
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100/50 to-orange-100/50 
                    border border-amber-200/50 backdrop-blur-sm mb-6 animate-pulse-subtle">
                    <div class="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-ping-slow"></div>
                    <span class="text-sm text-amber-800/90 font-medium">
                        {{ seasonMessage }}
                    </span>
                </div>
            </div>

            <!-- Avatar et informations -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Colonne gauche : Avatar -->
                <div class="lg:col-span-1">
                    <div class="sticky top-24">
                        <!-- Carte avatar -->
                        <div class="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100/70 
                       shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom overflow-hidden
                       transform hover:scale-[1.005]" :class="{
                        'animate-float': !loading
                    }">

                            <!-- Couverture -->
                            <div class="h-24 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 
                         relative overflow-hidden">
                                <img v-if="profile?.coverImage" :src="profile.coverImage" alt="Photo de couverture"
                                    class="absolute inset-0 w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10">
                                </div>
                                <div class="absolute inset-0 bg-dots-pattern opacity-5"></div>
                                <button v-if="isEditing" type="button" @click="triggerCoverUpload" class="absolute inset-0 bg-black/35 text-white flex items-center justify-center 
                             opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <span class="inline-flex items-center space-x-2">
                                        <CameraIcon class="w-5 h-5" />
                                        <span class="text-sm font-medium">Modifier la couverture</span>
                                    </span>
                                </button>
                            </div>

                            <!-- Avatar -->
                            <div class="px-6 pb-6 -mt-12">
                                <div class="relative group">
                                    <div class="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg 
                             bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden
                             transform transition-all duration-500 ease-out-custom group-hover:scale-105">
                                        <img v-if="profile?.avatar" :src="profile.avatar"
                                            :alt="`${profile?.firstName} ${profile?.lastName}`"
                                            class="w-full h-full object-cover" />
                                        <div v-else
                                            class="w-full h-full flex items-center justify-center text-green-800">
                                            <UserIcon class="w-16 h-16" />
                                        </div>

                                        <!-- Overlay pour changement d'avatar -->
                                        <div v-if="isEditing" @click="triggerAvatarUpload" class="absolute inset-0 bg-black/50 flex items-center justify-center 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                             cursor-pointer backdrop-blur-sm">
                                            <CameraIcon class="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <!-- Badge statut -->
                                    <div class="absolute bottom-2 right-6">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                                flex items-center justify-center shadow-lg animate-pulse-subtle">
                                            <CheckIcon class="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Nom -->
                                <div class="text-center mt-6">
                                    <h2 class="text-2xl font-serif font-bold text-green-900 mb-1">
                                        {{ profile?.firstName }} {{ profile?.lastName }}
                                    </h2>
                                    <p class="text-green-600/70 text-sm">
                                        Membre depuis {{ formatDate(profile?.createdAt) }}
                                    </p>
                                </div>

                                <!-- Stats -->
                                <div class="mt-8 grid grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-green-800">{{ orderCount }}</div>
                                        <div class="text-xs text-green-600/70">Commandes</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-green-800">{{ favoriteProducers }}</div>
                                        <div class="text-xs text-green-600/70">Producteurs favoris</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-green-800">{{ seasonPurchases }}</div>
                                        <div class="text-xs text-green-600/70">Achats cette saison</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Adresse par défaut -->
                        <div class="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-green-100/70 
                       p-5 shadow-sm hover:shadow-md transition-all duration-300 ease-out-custom
                       transform hover:scale-[1.005]" v-if="defaultAddress">
                            <div class="flex items-start space-x-3">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                           flex items-center justify-center flex-shrink-0">
                                    <HomeIcon class="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <div class="flex items-center space-x-2 mb-2">
                                        <h3 class="font-semibold text-green-900">Adresse par défaut</h3>
                                        <span class="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                                            {{ defaultAddress.type === 'DELIVERY' ? 'Livraison' : 'Facturation' }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-green-700/80 leading-relaxed">
                                        {{ defaultAddress.street }}<br>
                                        {{ defaultAddress.postalCode }} {{ defaultAddress.city }}<br>
                                        {{ defaultAddress.country }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonne droite : Formulaire/Informations -->
                <div class="lg:col-span-2">
                    <transition name="slide-fade" mode="out-in">
                        <!-- Mode édition -->
                        <div v-if="isEditing" key="edit" class="space-y-6">
                            <!-- Carte informations personnelles -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom
                         transform hover:scale-[1.002]">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                             flex items-center justify-center">
                                        <UserIcon class="w-5 h-5 text-green-700" />
                                    </div>
                                    <h3 class="text-xl font-serif font-semibold text-green-900">
                                        Informations personnelles
                                    </h3>
                                </div>

                                <form @submit.prevent="saveProfile" class="space-y-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-green-800 mb-2">
                                                Prénom
                                            </label>
                                            <input v-model="editForm.first_name" type="text" class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                               bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                               focus:ring-green-200/50 focus:outline-none transition-all duration-300
                               placeholder:text-green-400" placeholder="Votre prénom" />
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-green-800 mb-2">
                                                Nom
                                            </label>
                                            <input v-model="editForm.last_name" type="text" class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                               bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                               focus:ring-green-200/50 focus:outline-none transition-all duration-300
                               placeholder:text-green-400" placeholder="Votre nom" />
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-green-800 mb-2">
                                            Email
                                        </label>
                                        <input v-model="editForm.email" type="email" disabled class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                             bg-green-50/50 text-green-600 cursor-not-allowed" placeholder="Votre email" />
                                        <p class="text-xs text-green-500/70 mt-2">
                                            L'email ne peut pas être modifié ici
                                        </p>
                                    </div>
                                </form>
                            </div>

                            <!-- Carte préférences -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom
                         transform hover:scale-[1.002]">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 
                             flex items-center justify-center">
                                        <BellIcon class="w-5 h-5 text-amber-700" />
                                    </div>
                                    <h3 class="text-xl font-serif font-semibold text-green-900">
                                        Préférences
                                    </h3>
                                </div>

                                <div class="space-y-4">
                                    <div class="flex items-center justify-between p-4 rounded-2xl bg-green-50/50 
                             border border-green-200/50 hover:bg-green-100/30 transition-all duration-300">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                                <EnvelopeIcon class="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div class="font-medium text-green-800">Newsletter</div>
                                                <div class="text-sm text-green-600/70">
                                                    Recevez nos actualités et offres
                                                </div>
                                            </div>
                                        </div>
                                        <ToggleSwitch v-model="editForm.preferences.newsletterSubscription"
                                            :active-color="'bg-green-500'" />
                                    </div>

                                    <div class="flex items-center justify-between p-4 rounded-2xl bg-green-50/50 
                             border border-green-200/50 hover:bg-green-100/30 transition-all duration-300">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                                <BellAlertIcon class="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div class="font-medium text-green-800">Notifications</div>
                                                <div class="text-sm text-green-600/70">
                                                    Alertes commandes et messages
                                                </div>
                                            </div>
                                        </div>
                                        <ToggleSwitch v-model="editForm.preferences.marketingEmails"
                                            :active-color="'bg-green-500'" />
                                    </div>

                                    <div class="p-4 rounded-2xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                             border border-green-200/50">
                                        <label class="block text-sm font-medium text-green-800 mb-3">
                                            Restrictions alimentaires
                                        </label>
                                        <div class="flex flex-wrap gap-2">
                                            <span v-for="restriction in dietaryRestrictions" :key="restriction"
                                                @click="toggleRestriction(restriction)" class="px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all duration-300 ease-out-custom
                               hover:scale-105" :class="{
                                'bg-green-500 text-white': editForm.preferences.dietaryRestrictions?.includes(restriction),
                                'bg-green-100 text-green-700 hover:bg-green-200': !editForm.preferences.dietaryRestrictions?.includes(restriction)
                            }">
                                                {{ restriction }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Boutons d'action -->
                            <div class="sticky bottom-6 bg-gradient-to-t from-white via-white/90 to-transparent 
                         pt-6 pb-4 -mx-6 px-6 rounded-t-3xl backdrop-blur-sm">
                                <div class="flex justify-end space-x-4">
                                    <button @click="cancelEditing" class="px-6 py-3 rounded-full border border-green-300 text-green-700 
                           bg-white hover:bg-green-50 transition-all duration-300 ease-out-custom
                           hover:scale-[1.02] active:scale-[0.98]">
                                        Annuler
                                    </button>

                                    <button @click="saveProfile" :disabled="saving" class="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                           text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg
                           transition-all duration-300 ease-out-custom hover:scale-[1.02] active:scale-[0.98]
                           transform shadow-md flex items-center space-x-2 disabled:opacity-50 
                           disabled:cursor-not-allowed">
                                        <span v-if="saving">
                                            <svg class="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                        </span>
                                        <span v-else>
                                            <CheckIcon class="w-4 h-4" />
                                        </span>
                                        <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Mode affichage -->
                        <div v-else key="view" class="space-y-6">
                            <!-- Carte informations -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom
                         transform hover:scale-[1.002]">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                             flex items-center justify-center">
                                        <UserCircleIcon class="w-5 h-5 text-green-700" />
                                    </div>
                                    <h3 class="text-xl font-serif font-semibold text-green-900">
                                        Informations personnelles
                                    </h3>
                                </div>

                                <div class="space-y-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div class="text-sm text-green-600/70 mb-1">Prénom</div>
                                            <div class="text-lg font-medium text-green-900">
                                                {{ profile?.firstName || 'Non renseigné' }}
                                            </div>
                                        </div>

                                        <div>
                                            <div class="text-sm text-green-600/70 mb-1">Nom</div>
                                            <div class="text-lg font-medium text-green-900">
                                                {{ profile?.lastName || 'Non renseigné' }}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div class="text-sm text-green-600/70 mb-1">Email</div>
                                        <div class="text-lg font-medium text-green-900">
                                            {{ userEmail }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Carte préférences -->
                            <div class="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100/70 
                         p-6 shadow-sm hover:shadow-md transition-all duration-500 ease-out-custom
                         transform hover:scale-[1.002]">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 
                             flex items-center justify-center">
                                        <Cog6ToothIcon class="w-5 h-5 text-amber-700" />
                                    </div>
                                    <h3 class="text-xl font-serif font-semibold text-green-900">
                                        Préférences
                                    </h3>
                                </div>

                                <div class="space-y-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="p-4 rounded-2xl bg-green-50/50 border border-green-200/50">
                                            <div class="flex items-center space-x-3 mb-2">
                                                <EnvelopeIcon class="w-5 h-5 text-green-600" />
                                                <div class="font-medium text-green-800">Newsletter</div>
                                            </div>
                                            <div class="text-sm text-green-600/70">
                                                {{ profile?.preferences.newsletterSubscription ? 'Activée' :
                                                    'Désactivée' }}
                                            </div>
                                        </div>

                                        <div class="p-4 rounded-2xl bg-green-50/50 border border-green-200/50">
                                            <div class="flex items-center space-x-3 mb-2">
                                                <BellIcon class="w-5 h-5 text-green-600" />
                                                <div class="font-medium text-green-800">Notifications</div>
                                            </div>
                                            <div class="text-sm text-green-600/70">
                                                {{ profile?.preferences.marketingEmails ? 'Activées' : 'Désactivées'
                                                }}
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="profile?.preferences.dietaryRestrictions?.length" class="p-4 rounded-2xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 
                              border border-green-200/50">
                                        <div class="text-sm font-medium text-green-800 mb-3">
                                            Restrictions alimentaires
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <span v-for="restriction in profile.preferences.dietaryRestrictions"
                                                :key="restriction"
                                                class="px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-700">
                                                {{ restriction }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Recommandations saisonnières -->
                            <div class="bg-gradient-to-r from-green-50/80 to-emerald-50/60 backdrop-blur-sm 
                         rounded-3xl border border-green-200/50 p-6">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 
                             flex items-center justify-center">
                                        <SparklesIcon class="w-5 h-5 text-green-700" />
                                    </div>
                                    <h3 class="text-xl font-serif font-semibold text-green-900">
                                        Recommandations {{ currentSeason }}
                                    </h3>
                                </div>

                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div v-for="product in seasonalProducts" :key="product.id"
                                        class="group cursor-pointer" @click="viewProduct(product)">
                                        <div class="bg-white rounded-2xl p-4 border border-green-200/50 
                               hover:border-green-300 hover:shadow-md transition-all duration-300 
                               ease-out-custom transform group-hover:scale-[1.02]">
                                            <div class="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-green-100 
                                 to-emerald-100 flex items-center justify-center mb-3">
                                                <component :is="product.icon" class="w-6 h-6 text-green-600" />
                                            </div>
                                            <div class="text-center">
                                                <div class="font-medium text-green-800 mb-1">{{ product.name }}</div>
                                                <div class="text-xs text-green-600/70">à partir de {{ product.price }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </main>

        <!-- Input fichier caché pour avatar -->
        <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
        <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />

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
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '../stores/useCustomerStore'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { CustomerProfile, UpdateCustomerProfileRequest } from '../types'

// Icons
// Icons
import {
    // LeafIcon, // N'existe pas dans @heroicons/vue
    MapPinIcon,
    CogIcon,
    PencilIcon,
    UserIcon,
    CheckIcon,
    HomeIcon,
    BellIcon,
    EnvelopeIcon,
    BellAlertIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    SparklesIcon,
    CameraIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Store et router
const customerStore = useCustomerStore()
const authStore = useAuthStore()
const router = useRouter()

// États
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)
const coverInput = ref<HTMLInputElement | null>(null)

// Données
const profile = ref<CustomerProfile | null>(null)
const editForm = reactive({
    first_name: '',
    last_name: '',
    email: '',
    preferences: {
        newsletterSubscription: false,
        marketingEmails: false,
        smsNotifications: false,
        preferredDeliveryTime: undefined as 'MORNING' | 'AFTERNOON' | 'EVENING' | undefined,
        preferredCommunicationMethod: undefined as 'EMAIL' | 'SMS' | 'WHATSAPP' | undefined,
        allergies: [] as string[],
        dietaryRestrictions: [] as string[],
        language: 'fr' as 'fr' | 'en'
    }
})

const orderCount = ref(0)
const favoriteProducers = ref(0)
const seasonPurchases = ref(0)
const defaultAddress = computed(() => customerStore.activeDefaultAddress)

const currentSeason = computed(() => {
    // Saisons du Cameroun (zone équatoriale - 4 saisons)
    const month = new Date().getMonth() // 0=Jan
    if (month >= 2 && month <= 5) return 'Grande saison des pluies'   // Mar-Jun
    if (month >= 6 && month <= 8) return 'Petite saison sèche'        // Jul-Sep
    if (month >= 9 && month <= 10) return 'Petite saison des pluies'  // Oct-Nov
    return 'Grande saison sèche'                                        // Dec-Fev
})

const seasonMessage = computed(() => {
    const messages: Record<string, string> = {
        'Grande saison des pluies': '🌧️ Mangues, ananas et plantains en abondance !',
        'Petite saison sèche': '☀️ Profitez des tomates, gombo et aubergines',
        'Petite saison des pluies': '🌦️ Ignames, macabo et légumes feuilles de saison',
        'Grande saison sèche': '🌞 Oranges, manioc et tubercules à l\'honneur'
    }
    return messages[currentSeason.value] || '🌿 Produits frais disponibles'
})

const userEmail = computed(() => {
    return authStore.currentUser?.email || profile.value?.email || ''
})

const dietaryRestrictions = [
    'Végétarien',
    'Sans gluten',
    'Sans lactose',
    'Végan',
    'Halal',
    'Sans poisson',
    'Sans viande rouge',
    'Sans arachide'
]

const seasonalProducts = computed(() => {
    const products = {
        'Grande saison des pluies': [
            { id: 1, name: 'Mangue', price: '500F/kg', icon: SparklesIcon },
            { id: 2, name: 'Ananas', price: '300F/pièce', icon: SparklesIcon },
            { id: 3, name: 'Plantain', price: '200F/régime', icon: SparklesIcon },
            { id: 4, name: 'Avocat', price: '150F/pièce', icon: SparklesIcon }
        ],
        'Petite saison sèche': [
            { id: 5, name: 'Tomate', price: '400F/kg', icon: SparklesIcon },
            { id: 6, name: 'Gombo', price: '300F/kg', icon: SparklesIcon },
            { id: 7, name: 'Aubergine', price: '250F/kg', icon: SparklesIcon },
            { id: 8, name: 'Pastèque', price: '500F/pièce', icon: SparklesIcon }
        ],
        'Petite saison des pluies': [
            { id: 9, name: 'Igname', price: '600F/kg', icon: SparklesIcon },
            { id: 10, name: 'Macabo', price: '400F/kg', icon: SparklesIcon },
            { id: 11, name: 'Ndolé', price: '500F/botte', icon: SparklesIcon },
            { id: 12, name: 'Safou', price: '250F/kg', icon: SparklesIcon }
        ],
        'Grande saison sèche': [
            { id: 13, name: 'Orange', price: '200F/pièce', icon: SparklesIcon },
            { id: 14, name: 'Manioc', price: '300F/kg', icon: SparklesIcon },
            { id: 15, name: 'Patate douce', price: '350F/kg', icon: SparklesIcon },
            { id: 16, name: 'Arachide', price: '800F/kg', icon: SparklesIcon }
        ]
    }
    return products[currentSeason.value]
})

// Méthodes
const loadProfile = async () => {
    loading.value = true
    try {
        if (!authStore.currentUser) {
            await authStore.fetchCurrentUser()
        }
        await customerStore.fetchCompleteProfile()
        profile.value = customerStore.profile

        // Remplir le formulaire d'édition
        if (profile.value) {
            editForm.first_name = profile.value.firstName
            editForm.last_name = profile.value.lastName
            editForm.email = userEmail.value
            Object.assign(editForm.preferences, profile.value.preferences)
        }

    } catch (error) {
        console.error('Erreur chargement profil:', error)
    } finally {
        loading.value = false
    }
}

const startEditing = () => {
    isEditing.value = true
}

const cancelEditing = () => {
    isEditing.value = false
    // Restaurer les valeurs originales
    if (profile.value) {
        editForm.first_name = profile.value.firstName
        editForm.last_name = profile.value.lastName
        Object.assign(editForm.preferences, profile.value.preferences)
    }
}

const saveProfile = async () => {
    saving.value = true
    try {
        const payload: UpdateCustomerProfileRequest = {
            firstName: editForm.first_name,
            lastName: editForm.last_name,
            preferences: editForm.preferences
        }
        await customerStore.updateProfile(payload)
        profile.value = customerStore.profile

        showToastMessage('Profil mis à jour avec succès')
        isEditing.value = false

    } catch (error) {
        console.error('Erreur sauvegarde:', error)
        showToastMessage('Erreur lors de la mise à jour', true)
    } finally {
        saving.value = false
    }
}

const toggleRestriction = (restriction: string) => {
    if (!isEditing.value) return

    const index = editForm.preferences.dietaryRestrictions.indexOf(restriction)
    if (index === -1) {
        editForm.preferences.dietaryRestrictions.push(restriction)
    } else {
        editForm.preferences.dietaryRestrictions.splice(index, 1)
    }
}

const triggerAvatarUpload = () => {
    avatarInput.value?.click()
}

const triggerCoverUpload = () => {
    coverInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    try {
        if (!file.type.startsWith('image/')) {
            showToastMessage('Format de fichier invalide', true)
            return
        }
        if (file.size > 8 * 1024 * 1024) {
            showToastMessage('Image trop volumineuse (max 8MB)', true)
            return
        }

        const updated = await customerStore.uploadAvatar(file)
        if (updated) {
            profile.value = updated
        } else if (customerStore.profile) {
            profile.value = customerStore.profile
        }

        showToastMessage('Photo de profil mise à jour')
    } catch (error) {
        console.error('Erreur upload avatar:', error)
        showToastMessage('Erreur lors du téléchargement', true)
    } finally {
        // Réinitialiser l'input pour permettre un nouvel upload du même fichier
        target.value = ''
    }
}

const handleCoverUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    try {
        if (!file.type.startsWith('image/')) {
            showToastMessage('Format de fichier invalide', true)
            return
        }
        if (file.size > 8 * 1024 * 1024) {
            showToastMessage('Image trop volumineuse (max 8MB)', true)
            return
        }

        const updated = await customerStore.uploadCoverImage(file)
        if (updated) {
            profile.value = updated
        } else if (customerStore.profile) {
            profile.value = customerStore.profile
        }

        showToastMessage('Photo de couverture mise à jour')
    } catch (error) {
        console.error('Erreur upload couverture:', error)
        showToastMessage('Erreur lors du téléchargement', true)
    } finally {
        target.value = ''
    }
}

const showToastMessage = (message: string, isError = false) => {
    toastMessage.value = message
    showToast.value = true

    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'récemment'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const viewProduct = (product: any) => {
    console.log('Voir produit:', product)
    // router.push(`/products/${product.id}`)
}

const goToAddresses = () => {
    router.push('/profile/customer/addresses')
}

const goToSettings = () => {
    router.push('/profile/customer/settings')
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

// Cycle de vie
onMounted(() => {
    loadProfile()
})
</script>

<style scoped>
/* Styles spécifiques à cette vue */
.customer-profile-view {
    --curve-primary: cubic-bezier(0.4, 0, 0.2, 1);
    --curve-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animations personnalisées */
@keyframes float-slow {

    0%,
    100% {
        transform: translateY(0px) translateX(0px);
    }

    50% {
        transform: translateY(-10px) translateX(5px);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-6px);
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

@keyframes ping-slow {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
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

/* Appliquer les animations */
.animate-float-slow {
    animation: float-slow 20s ease-in-out infinite;
    animation-timing-function: var(--curve-primary);
}

.animate-float {
    animation: float 6s ease-in-out infinite;
    animation-timing-function: var(--curve-bouncy);
}

.animate-pulse-subtle {
    animation: pulse-subtle 3s ease-in-out infinite;
}

.animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.slide-up-enter-active {
    animation: slide-up 0.4s var(--curve-bouncy);
}

.slide-up-leave-active {
    animation: slide-up 0.4s var(--curve-bouncy) reverse;
}

/* Transition pour le contenu */
.slide-fade-enter-active {
    transition: all 0.4s var(--curve-bouncy);
}

.slide-fade-leave-active {
    transition: all 0.3s var(--curve-primary);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(10px);
}

/* Pattern de feuilles en filigrane */
.bg-leaves-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232e7d32' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.bg-dots-pattern {
    background-image: radial-gradient(circle, #4CAF50 1px, transparent 1px);
    background-size: 20px 20px;
}

/* Classes utilitaires personnalisées */
.ease-out-custom {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-cream-50 {
    background-color: #fefaf0;
}

/* Optimisations pour le dégradé */
.bg-gradient-to-br {
    background-attachment: fixed;
}

/* Amélioration de la lisibilité */
.text-green-900 {
    --tw-text-opacity: 1;
    color: rgba(5, 46, 22, var(--tw-text-opacity));
}

/* Effets de verre améliorés */
.backdrop-blur-sm {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

/* Bordures subtiles */
.border-green-100\/70 {
    border-color: rgba(209, 250, 229, 0.7);
}

/* Ombre portée naturelle */
.shadow-sm {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-md:hover {
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.15);
}
</style>
