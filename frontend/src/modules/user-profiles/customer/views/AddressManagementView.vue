<template>
    <div class="min-h-screen address-management-view">
        <!-- Arrière-plan avec dégradé et texture -->
        <div class="fixed inset-0 -z-10">
            <div class="absolute inset-0 bg-gradient-to-br from-green-50/90 via-amber-50/70 to-orange-50/50"></div>
            <div
                class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzQ2YTM5MyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlYmM4OTMiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==')] opacity-[0.02]">
            </div>
            <div class="absolute inset-0 bg-grid-pattern opacity-[0.015] animate-pan-slow"></div>
            <div
                class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-green-200/20 to-amber-200/10 blur-3xl animate-pulse-soft">
            </div>
        </div>

        <!-- Navigation -->
        <nav class="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-green-100/50">
            <div class="container mx-auto px-4 py-3">
                <div class="flex justify-between items-center">
                    <router-link to="/profile/customer"
                        class="flex items-center space-x-2 group transition-all duration-500 ease-out-custom">
                        <ArrowLeftIcon
                            class="w-5 h-5 text-green-600 transform group-hover:-translate-x-1 transition-transform duration-300" />
                        <span class="text-green-700 hover:text-green-800 transition-colors duration-300">
                            Retour au profil
                        </span>
                    </router-link>

                    <div class="flex items-center space-x-4">
                        <button v-if="!showForm" @click="openNewAddressForm" class="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                     text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg
                     transition-all duration-300 ease-out-custom hover:scale-[1.02] active:scale-[0.98]
                     transform shadow-md">
                            <PlusIcon class="w-4 h-4" />
                            <span>Nouvelle adresse</span>
                        </button>

                        <button @click="useCurrentLocation" class="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm 
                     border border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300
                     transition-all duration-300 ease-out-custom hover:scale-[1.02] hover:shadow-sm">
                            <MapPinIcon class="w-4 h-4" />
                            <span>Utiliser ma position</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Contenu principal -->
        <main class="container mx-auto px-4 py-8 max-w-7xl">
            <!-- En-tête -->
            <div class="text-center mb-12 transform transition-all duration-700 ease-out-custom" :class="{
                'translate-y-0 opacity-100': !loading,
                'translate-y-4 opacity-0': loading
            }">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
                    bg-gradient-to-r from-green-100 to-emerald-100 mb-4
                    border border-green-200/50 shadow-sm animate-pulse-subtle">
                    <HomeIcon class="w-8 h-8 text-green-700" />
                </div>

                <h1 class="text-4xl font-serif font-bold text-green-900 mb-3">
                    Mes Adresses
                </h1>
                <p class="text-lg text-green-600/80 max-w-2xl mx-auto">
                    Gérez vos adresses de livraison et de facturation pour une expérience d'achat fluide
                </p>

                <!-- Indicateur visuel -->
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 
                    border border-green-200/50 backdrop-blur-sm mt-6">
                    <div class="w-2 h-2 rounded-full bg-green-500 mr-2 animate-ping-slow"></div>
                    <span class="text-sm text-green-700/90 font-medium">
                        {{ addresses.length }} adresse{{ addresses.length > 1 ? 's' : '' }} enregistrée{{
                            addresses.length > 1 ? 's' : '' }}
                    </span>
                </div>
            </div>

            <!-- Split Screen : Liste des adresses et formulaire -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Colonne gauche : Liste des adresses -->
                <div class="lg:col-span-1">
                    <div class="sticky top-24">
                        <!-- En-tête de la liste -->
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-serif font-semibold text-green-900">
                                Vos adresses
                            </h2>
                            <button @click="toggleViewMode" class="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 
                       hover:bg-green-100 transition-all duration-300 ease-out-custom">
                                <component :is="viewModeIcon" class="w-4 h-4" />
                                <span class="text-sm">{{ viewMode === 'grid' ? 'Vue liste' : 'Vue grille' }}</span>
                            </button>
                        </div>

                        <!-- Message si aucune adresse -->
                        <transition name="fade-scale" mode="out-in">
                            <div v-if="addresses.length === 0" key="empty" class="bg-gradient-to-br from-amber-50/80 to-orange-50/60 rounded-3xl border border-amber-200/50 
                       p-8 text-center backdrop-blur-sm hover:shadow-md transition-all duration-500 ease-out-custom">
                                <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-amber-100 to-orange-100 
                           flex items-center justify-center mb-4 border border-amber-200/50">
                                    <MapIcon class="w-10 h-10 text-amber-600" />
                                </div>
                                <h3 class="text-xl font-serif font-semibold text-amber-900 mb-2">
                                    Aucune adresse enregistrée
                                </h3>
                                <p class="text-amber-700/80 mb-6">
                                    Ajoutez votre première adresse pour commencer vos achats
                                </p>
                                <button @click="openNewAddressForm" class="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 
                         text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-lg
                         transition-all duration-300 ease-out-custom hover:scale-[1.02] active:scale-[0.98]
                         transform shadow-md">
                                    <PlusIcon class="w-4 h-4" />
                                    <span>Ajouter une adresse</span>
                                </button>
                            </div>

                            <!-- Liste/Grille des adresses -->
                            <div v-else key="list" :class="[
                                'space-y-4',
                                viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''
                            ]">
                                <transition-group name="staggered-fade" tag="div"
                                    :class="viewMode === 'grid' ? 'contents' : 'space-y-4'">
                                    <div v-for="(address, index) in addresses" :key="address.id" :data-index="index"
                                        class="group cursor-pointer" @click="editAddress(address)">
                                        <!-- Carte d'adresse -->
                                        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border-2 
                               hover:border-green-300 hover:shadow-lg p-5 transition-all duration-300 ease-out-custom
                               transform hover:scale-[1.005]" :class="{
                                'border-green-500/30': address.isDefault,
                                'border-green-100/70': !address.isDefault
                            }">
                                            <div class="flex items-start justify-between mb-3">
                                                <div class="flex items-center space-x-3">
                                                    <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                        :class="{
                                                            'bg-gradient-to-r from-green-100 to-emerald-100': address.type === 'DELIVERY',
                                                            'bg-gradient-to-r from-amber-100 to-orange-100': address.type === 'BILLING'
                                                        }">
                                                        <component
                                                            :is="address.type === 'DELIVERY' ? TruckIcon : CreditCardIcon"
                                                            class="w-5 h-5" :class="{
                                                                'text-green-700': address.type === 'DELIVERY',
                                                                'text-amber-700': address.type === 'BILLING'
                                                            }" />
                                                    </div>
                                                    <div>
                                                        <div class="flex items-center space-x-2">
                                                            <h3 class="font-semibold text-green-900">
                                                                {{ address.name || (address.type === 'DELIVERY' ?
                                                                    'Adresse de livraison' : 'Adresse de facturation') }}
                                                            </h3>
                                                            <span v-if="address.isDefault"
                                                                class="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                                                Par défaut
                                                            </span>
                                                            <span class="px-2 py-0.5 text-xs rounded-full" :class="{
                                                                'bg-green-100 text-green-700': address.type === 'DELIVERY',
                                                                'bg-amber-100 text-amber-700': address.type === 'BILLING'
                                                            }">
                                                                {{ address.type === 'DELIVERY' ? 'Livraison' :
                                                                    'Facturation' }}
                                                            </span>
                                                        </div>
                                                        <p class="text-sm text-green-600/70">
                                                            Ajoutée le {{ formatDate(address.createdAt) }}
                                                        </p>
                                                    </div>
                                                </div>

                                                <!-- Menu d'actions -->
                                                <div class="relative">
                                                    <button @click.stop="toggleAddressMenu(address.id)" class="w-8 h-8 rounded-full flex items-center justify-center 
                                   hover:bg-green-100 text-green-600 transition-colors duration-200">
                                                        <EllipsisHorizontalIcon class="w-5 h-5" />
                                                    </button>

                                                    <!-- Menu déroulant -->
                                                    <transition name="dropdown" mode="out-in">
                                                        <div v-if="activeMenu === address.id"
                                                            v-click-outside="closeMenu" class="absolute right-0 top-full mt-1 w-48 bg-white/95 backdrop-blur-sm 
                                     rounded-xl border border-green-200 shadow-lg py-1 z-10">
                                                            <button @click.stop="setDefaultAddress(address)" class="w-full px-4 py-2 text-left text-sm text-green-700 
                                       hover:bg-green-50 flex items-center space-x-2 transition-colors duration-200">
                                                                <StarIcon class="w-4 h-4" />
                                                                <span>Définir par défaut</span>
                                                            </button>
                                                            <button @click.stop="duplicateAddress(address)" class="w-full px-4 py-2 text-left text-sm text-green-700 
                                       hover:bg-green-50 flex items-center space-x-2 transition-colors duration-200">
                                                                <DocumentDuplicateIcon class="w-4 h-4" />
                                                                <span>Dupliquer</span>
                                                            </button>
                                                            <div class="border-t border-green-100 my-1"></div>
                                                            <button @click.stop="deleteAddress(address.id)" class="w-full px-4 py-2 text-left text-sm text-red-600 
                                       hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200">
                                                                <TrashIcon class="w-4 h-4" />
                                                                <span>Supprimer</span>
                                                            </button>
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>

                                            <!-- Détails de l'adresse -->
                                            <div class="mb-4">
                                                <div class="flex items-start space-x-2 text-green-800">
                                                    <MapPinIcon class="w-4 h-4 mt-1 flex-shrink-0" />
                                                    <p class="leading-relaxed">
                                                        {{ address.street }}<br>
                                                        {{ address.postalCode }} {{ address.city }}<br>
                                                        {{ address.country }}
                                                    </p>
                                                </div>
                                            </div>

                                            <!-- Coordonnées et instructions -->
                                            <div v-if="address.instructions" class="mb-4">
                                                <div class="flex items-start space-x-2 text-green-700/80">
                                                    <ChatBubbleLeftRightIcon class="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <p class="text-sm">{{ address.instructions }}</p>
                                                </div>
                                            </div>

                                            <!-- Boutons d'action -->
                                            <div class="flex space-x-2 pt-4 border-t border-green-100/50">
                                                <button @click.stop="editAddress(address)" class="flex-1 px-3 py-1.5 rounded-lg text-sm bg-green-50 text-green-700 
                                 hover:bg-green-100 transition-all duration-300 ease-out-custom
                                 flex items-center justify-center space-x-1">
                                                    <PencilSquareIcon class="w-3.5 h-3.5" />
                                                    <span>Modifier</span>
                                                </button>
                                                <button @click.stop="showOnMap(address)" class="flex-1 px-3 py-1.5 rounded-lg text-sm bg-white border border-green-200 text-green-700 
                                 hover:bg-green-50 transition-all duration-300 ease-out-custom
                                 flex items-center justify-center space-x-1">
                                                    <MapIcon class="w-3.5 h-3.5" />
                                                    <span>Carte</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </transition-group>
                            </div>
                        </transition>

                        <!-- Statistiques -->
                        <div v-if="addresses.length > 0" class="mt-8 bg-gradient-to-r from-green-50/80 to-emerald-50/60 backdrop-blur-sm 
                        rounded-2xl border border-green-200/50 p-5">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-green-800">{{ addresses.length }}</div>
                                    <div class="text-xs text-green-600/70">Adresses totales</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-green-800">{{ deliveryAddresses.length }}</div>
                                    <div class="text-xs text-green-600/70">Livraison</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-green-800">{{ billingAddresses.length }}</div>
                                    <div class="text-xs text-green-600/70">Facturation</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-green-800">{{ defaultAddresses }}</div>
                                    <div class="text-xs text-green-600/70">Par défaut</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonne droite : Formulaire d'adresse -->
                <div class="lg:col-span-1">
                    <transition name="slide-fade" mode="out-in">
                        <!-- Carte formulaire -->
                        <div v-if="showForm" key="form" class="sticky top-24 bg-white/95 backdrop-blur-sm rounded-3xl border border-green-100/70 
                     shadow-xl p-6 lg:p-8 transition-all duration-500 ease-out-custom
                     transform hover:scale-[1.002]">
                            <!-- En-tête du formulaire -->
                            <div class="flex items-center justify-between mb-8">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                             flex items-center justify-center">
                                        <component :is="editingAddress ? PencilSquareIcon : PlusIcon"
                                            class="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-serif font-semibold text-green-900">
                                            {{ editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse' }}
                                        </h2>
                                        <p class="text-green-600/70">
                                            {{ editingAddress ? 'Mettez à jour les informations' : 'Ajoutez une nouvelle adresse' }}
                                        </p>
                                    </div>
                                </div>

                                <button @click="closeForm" class="w-10 h-10 rounded-full flex items-center justify-center 
                         hover:bg-green-100 text-green-600 transition-all duration-300 ease-out-custom">
                                    <XMarkIcon class="w-5 h-5" />
                                </button>
                            </div>

                            <!-- Form -->
                            <form @submit.prevent="saveAddress" class="space-y-6">
                                <!-- Type d'adresse -->
                                <div>
                                    <label class="block text-sm font-medium text-green-800 mb-3">
                                        Type d'adresse
                                    </label>
                                    <div class="grid grid-cols-2 gap-4">
                                        <button type="button" @click="formData.type = 'DELIVERY'" class="p-4 rounded-xl border-2 transition-all duration-300 ease-out-custom
                             flex items-center space-x-3" :class="{
                                'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50': formData.type === 'DELIVERY',
                                'border-green-200/70 bg-white/50 hover:bg-green-50/50': formData.type !== 'DELIVERY'
                            }">
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                :class="{
                                                    'bg-green-100': formData.type === 'DELIVERY',
                                                    'bg-green-50': formData.type !== 'DELIVERY'
                                                }">
                                                <TruckIcon class="w-5 h-5" :class="{
                                                    'text-green-700': formData.type === 'DELIVERY',
                                                    'text-green-600/70': formData.type !== 'DELIVERY'
                                                }" />
                                            </div>
                                            <div class="text-left">
                                                <div class="font-medium text-green-900">Livraison</div>
                                                <div class="text-xs text-green-600/70">Pour recevoir vos commandes</div>
                                            </div>
                                        </button>

                                        <button type="button" @click="formData.type = 'BILLING'" class="p-4 rounded-xl border-2 transition-all duration-300 ease-out-custom
                             flex items-center space-x-3" :class="{
                                'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50': formData.type === 'BILLING',
                                'border-amber-200/70 bg-white/50 hover:bg-amber-50/50': formData.type !== 'BILLING'
                            }">
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                :class="{
                                                    'bg-amber-100': formData.type === 'BILLING',
                                                    'bg-amber-50': formData.type !== 'BILLING'
                                                }">
                                                <CreditCardIcon class="w-5 h-5" :class="{
                                                    'text-amber-700': formData.type === 'BILLING',
                                                    'text-amber-600/70': formData.type !== 'BILLING'
                                                }" />
                                            </div>
                                            <div class="text-left">
                                                <div class="font-medium text-amber-900">Facturation</div>
                                                <div class="text-xs text-amber-600/70">Pour vos factures et reçus</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <!-- Nom de l'adresse -->
                                <div>
                                    <label class="block text-sm font-medium text-green-800 mb-2">
                                        Nom de l'adresse (optionnel)
                                    </label>
                                    <input v-model="formData.name" type="text"
                                        placeholder="Ex: Maison, Bureau, Parents..." class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                           bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                           focus:ring-green-200/50 focus:outline-none transition-all duration-300
                           placeholder:text-green-400" />
                                </div>

                                <!-- Adresse -->
                                <div>
                                    <label class="block text-sm font-medium text-green-800 mb-2">
                                        Adresse
                                    </label>
                                    <input v-model="formData.street" type="text" placeholder="Numéro et nom de rue"
                                        class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                           bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                           focus:ring-green-200/50 focus:outline-none transition-all duration-300
                           placeholder:text-green-400" @input="debouncedGeocode" />
                                </div>

                                <!-- Ville, Code postal, Pays -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="md:col-span-1">
                                        <label class="block text-sm font-medium text-green-800 mb-2">
                                            Code postal
                                        </label>
                                        <input v-model="formData.postalCode" type="text" placeholder="00237" class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                             bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                             focus:ring-green-200/50 focus:outline-none transition-all duration-300
                             placeholder:text-green-400" @input="debouncedGeocode" />
                                    </div>

                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-green-800 mb-2">
                                            Ville
                                        </label>
                                        <input v-model="formData.city" type="text" placeholder="Ville" class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                             bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                             focus:ring-green-200/50 focus:outline-none transition-all duration-300
                             placeholder:text-green-400" @input="debouncedGeocode" />
                                    </div>
                                </div>

                                <!-- Pays -->
                                <div>
                                    <label class="block text-sm font-medium text-green-800 mb-2">
                                        Pays
                                    </label>
                                    <select v-model="formData.country" class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                           bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                           focus:ring-green-200/50 focus:outline-none transition-all duration-300
                           text-green-900 appearance-none">
                                        <option value="Cameroun">Cameroun</option>
                                        <option value="Tchad">Tchad</option>
                                        <option value="Gabon">Gabon</option>
                                        <option value="Congo">Congo</option>
                                    </select>
                                </div>

                                <!-- Instructions -->
                                <div>
                                    <label class="block text-sm font-medium text-green-800 mb-2">
                                        Instructions de livraison (optionnel)
                                    </label>
                                    <textarea v-model="formData.instructions" rows="3"
                                        placeholder="Code d'entrée, étage, interphone, informations complémentaires..."
                                        class="w-full px-4 py-3 rounded-xl border border-green-200/70 
                           bg-white/50 focus:bg-white focus:border-green-400 focus:ring-2 
                           focus:ring-green-200/50 focus:outline-none transition-all duration-300
                           placeholder:text-green-400 resize-none"></textarea>
                                </div>

                                <!-- Options -->
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between p-4 rounded-2xl bg-green-50/50 
                             border border-green-200/50 hover:bg-green-100/30 transition-all duration-300">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                                <StarIcon class="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div class="font-medium text-green-800">Définir comme adresse par défaut
                                                </div>
                                                <div class="text-sm text-green-600/70">
                                                    Cette adresse sera utilisée par défaut pour {{ formData.type ===
                                                        'DELIVERY' ? 'la livraison' : 'la facturation' }}
                                                </div>
                                            </div>
                                        </div>
                                        <ToggleSwitch v-model="formData.isDefault"
                                            :active-color="formData.type === 'DELIVERY' ? 'bg-green-500' : 'bg-amber-500'" />
                                    </div>

                                    <div v-if="formData.coordinates" class="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 
                              border border-emerald-200/50">
                                        <div class="flex items-center space-x-3 mb-2">
                                            <MapIcon class="w-5 h-5 text-emerald-600" />
                                            <div class="font-medium text-emerald-800">Position géolocalisée</div>
                                        </div>
                                        <div class="text-sm text-emerald-700/80">
                                            Coordonnées : {{ formData.coordinates.lat.toFixed(4) }}, {{
                                                formData.coordinates.lng.toFixed(4) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Boutons d'action -->
                                <div class="pt-6 border-t border-green-100/50">
                                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                        <button type="button" @click="closeForm" class="flex-1 px-6 py-3.5 rounded-full border border-green-300 text-green-700 
                             bg-white hover:bg-green-50 transition-all duration-300 ease-out-custom
                             hover:scale-[1.02] active:scale-[0.98]">
                                            Annuler
                                        </button>

                                        <button type="submit" :disabled="saving || !isFormValid" class="flex-1 px-6 py-3.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                             text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg
                             transition-all duration-300 ease-out-custom hover:scale-[1.02] active:scale-[0.98]
                             transform shadow-md flex items-center justify-center space-x-2 
                             disabled:opacity-50 disabled:cursor-not-allowed" :class="{
                                'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600': formData.type === 'BILLING'
                            }">
                                            <span v-if="saving">
                                                <svg class="animate-spin h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                    </path>
                                                </svg>
                                            </span>
                                            <span v-else>
                                                <CheckIcon class="w-4 h-4" />
                                            </span>
                                            <span>{{ saving ? 'Enregistrement...' : (editingAddress ? 'Mettre à jour' :
                                                'Ajouter l\'adresse') }}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <!-- Carte d'aide (quand le formulaire est caché) -->
                        <div v-else key="help" class="sticky top-24 bg-gradient-to-br from-green-50/90 to-emerald-50/80 backdrop-blur-sm 
                     rounded-3xl border border-green-200/70 p-8 shadow-sm hover:shadow-md 
                     transition-all duration-500 ease-out-custom transform hover:scale-[1.002]">
                            <div class="text-center">
                                <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-100 to-emerald-100 
                           flex items-center justify-center mb-6 border border-green-200/50">
                                    <QuestionMarkCircleIcon class="w-10 h-10 text-green-700" />
                                </div>

                                <h3 class="text-2xl font-serif font-semibold text-green-900 mb-4">
                                    Gestion des adresses
                                </h3>

                                <div class="space-y-4 text-left mb-8">
                                    <div class="flex items-start space-x-3">
                                        <div
                                            class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Number1 class="w-3 h-3 text-green-700" />
                                        </div>
                                        <div>
                                            <div class="font-medium text-green-800">Cliquez sur une adresse pour la
                                                modifier</div>
                                            <div class="text-sm text-green-600/70">Ou utilisez le menu déroulant pour
                                                plus d'options</div>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-3">
                                        <div
                                            class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Number2 class="w-3 h-3 text-green-700" />
                                        </div>
                                        <div>
                                            <div class="font-medium text-green-800">Ajoutez plusieurs adresses</div>
                                            <div class="text-sm text-green-600/70">Pour la maison, le travail, la
                                                famille...</div>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-3">
                                        <div
                                            class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Number3 class="w-3 h-3 text-green-700" />
                                        </div>
                                        <div>
                                            <div class="font-medium text-green-800">Géolocalisation automatique</div>
                                            <div class="text-sm text-green-600/70">L'adresse est automatiquement
                                                positionnée sur la carte</div>
                                        </div>
                                    </div>
                                </div>

                                <button @click="openNewAddressForm" class="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                         text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg
                         transition-all duration-300 ease-out-custom hover:scale-[1.02] active:scale-[0.98]
                         transform shadow-md">
                                    <PlusIcon class="w-4 h-4" />
                                    <span>Commencer à ajouter</span>
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </main>

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

        <!-- Modal de confirmation de suppression -->
        <transition name="fade">
            <div v-if="showDeleteConfirm"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @click.self="cancelDelete">
                <div class="bg-white rounded-3xl border border-red-200/70 max-w-md w-full p-6 
                    transform transition-all duration-300 ease-out-custom scale-100" @click.stop>
                    <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-100 to-pink-100 
                     flex items-center justify-center mb-4">
                        <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
                    </div>

                    <h3 class="text-xl font-serif font-semibold text-red-900 text-center mb-2">
                        Supprimer l'adresse ?
                    </h3>

                    <p class="text-red-700/80 text-center mb-6">
                        Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action est irréversible.
                    </p>

                    <div class="flex space-x-4">
                        <button @click="cancelDelete" class="flex-1 px-4 py-3 rounded-full border border-red-300 text-red-700 
                     bg-white hover:bg-red-50 transition-all duration-300 ease-out-custom">
                            Annuler
                        </button>

                        <button @click="confirmDelete" class="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 
                     text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 ease-out-custom">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { vOnClickOutside } from '@vueuse/components'
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '../types'
import { useCustomerStore } from '../stores/useCustomerStore'

// Icons
import {
    ArrowLeftIcon,
    PlusIcon,
    MapPinIcon,
    HomeIcon,
    MapIcon,
    PencilSquareIcon,
    TruckIcon,
    CreditCardIcon,
    EllipsisHorizontalIcon,
    StarIcon,
    DocumentDuplicateIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    CheckIcon,
    QuestionMarkCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Composants d'icônes numériques
const Number1 = {
    template: '<span class="font-bold">1</span>'
}
const Number2 = {
    template: '<span class="font-bold">2</span>'
}
const Number3 = {
    template: '<span class="font-bold">3</span>'
}

// Store et router
const router = useRouter()
const customerStore = useCustomerStore()

// États
const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const showToast = ref(false)
const showDeleteConfirm = ref(false)
const viewMode = ref<'list' | 'grid'>('list')
const activeMenu = ref<string | null>(null)
const toastMessage = ref('')
const addressToDelete = ref<string | null>(null)

// Données
const addresses = ref<Address[]>([])

const editingAddress = ref<Address | null>(null)
const formData = reactive<CreateAddressRequest & { title?: string; instructions?: string; name?: string }>({
    type: 'DELIVERY',
    title: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Cameroun',
    phone: '',
    isDefault: false,
    name: '',
    instructions: ''
})

// Computed
const deliveryAddresses = computed(() => {
    return addresses.value.filter(addr => addr.type === 'DELIVERY')
})

const billingAddresses = computed(() => {
    return addresses.value.filter(addr => addr.type === 'BILLING')
})

const defaultAddresses = computed(() => {
    return addresses.value.filter(addr => addr.isDefault).length
})

const viewModeIcon = computed(() => {
    return viewMode.value === 'grid' ? 'Bars3Icon' : 'Squares2X2Icon'
})

const isFormValid = computed(() => {
    return formData.street.trim() !== '' &&
        formData.city.trim() !== '' &&
        formData.postalCode.trim() !== '' &&
        formData.country.trim() !== ''
})

// Méthodes
const loadAddresses = async () => {
    loading.value = true
    try {
        await customerStore.fetchAddresses({ page: 1, limit: 100 })
        addresses.value = [...customerStore.addresses]
    } catch (error) {
        console.error('Erreur chargement adresses:', error)
    } finally {
        loading.value = false
    }
}

const openNewAddressForm = () => {
    editingAddress.value = null
    resetForm()
    formData.type = 'DELIVERY'
    formData.isDefault = addresses.value.length === 0 // Première adresse par défaut
    showForm.value = true
}

const closeForm = () => {
    showForm.value = false
    editingAddress.value = null
    resetForm()
}

const resetForm = () => {
    formData.type = 'DELIVERY'
    formData.street = ''
    formData.city = ''
    formData.postalCode = ''
    formData.country = 'Cameroun'
    formData.isDefault = false
    formData.name = ''
    formData.instructions = ''
    formData.firstName = ''
    formData.lastName = ''
    formData.title = ''
    formData.phone = ''
    delete formData.coordinates
}

const editAddress = (address: Address) => {
    editingAddress.value = address
    formData.type = address.type
    formData.street = address.street
    formData.city = address.city
    formData.postalCode = address.postalCode
    formData.country = address.country
    formData.isDefault = address.isDefault
    formData.name = address.firstName && address.lastName ? `${address.firstName} ${address.lastName}` : ''
    formData.instructions = address.instructions || ''
    formData.firstName = address.firstName || ''
    formData.lastName = address.lastName || ''
    formData.title = address.title || ''
    formData.phone = address.phone || ''
    formData.coordinates = address.coordinates
    showForm.value = true
}

const saveAddress = async () => {
    if (!isFormValid.value) return

    saving.value = true
    try {
        const [firstNameFromName, ...restName] = (formData.name || '').trim().split(' ').filter(Boolean)
        const payload: CreateAddressRequest = {
            type: formData.type,
            title: formData.title || formData.name || (formData.type === 'DELIVERY' ? 'Livraison' : 'Facturation'),
            firstName: formData.firstName || firstNameFromName || '',
            lastName: formData.lastName || restName.join(' '),
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone || '',
            isDefault: formData.isDefault,
            instructions: formData.instructions || '',
            coordinates: formData.coordinates
                ? {
                    latitude: formData.coordinates.latitude ?? (formData.coordinates as any).lat,
                    longitude: formData.coordinates.longitude ?? (formData.coordinates as any).lng
                }
                : undefined
        }

        if (editingAddress.value) {
            const updatePayload: UpdateAddressRequest = {
                ...payload
            }
            await customerStore.updateAddress(String(editingAddress.value.id), updatePayload)
            showToastMessage('Adresse mise à jour avec succès')
        } else {
            await customerStore.addAddress(payload)
            showToastMessage('Adresse ajoutée avec succès')
        }

        await loadAddresses()

        closeForm()

    } catch (error) {
        console.error('Erreur sauvegarde:', error)
        showToastMessage('Erreur lors de la sauvegarde', true)
    } finally {
        saving.value = false
    }
}

const deleteAddress = (id: string) => {
    addressToDelete.value = id
    showDeleteConfirm.value = true
    closeMenu()
}

const confirmDelete = async () => {
    if (!addressToDelete.value) return

    try {
        await customerStore.deleteAddress(addressToDelete.value)
        await loadAddresses()
        showToastMessage('Adresse supprimée avec succès')

    } catch (error) {
        console.error('Erreur suppression:', error)
        showToastMessage('Erreur lors de la suppression', true)
    } finally {
        cancelDelete()
    }
}

const cancelDelete = () => {
    showDeleteConfirm.value = false
    addressToDelete.value = null
}

const setDefaultAddress = (address: Address) => {
    customerStore.setDefaultAddress(String(address.id)).then(async () => {
        await loadAddresses()
        showToastMessage('Adresse par défaut mise à jour')
        closeMenu()
    }).catch((error) => {
        console.error('Erreur définition adresse par défaut:', error)
        showToastMessage('Erreur lors de la mise à jour', true)
    })
}

const duplicateAddress = (address: Address) => {
    const duplicated: CreateAddressRequest = {
        type: address.type,
        title: address.title || 'Copie',
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone || '',
        isDefault: false,
        instructions: address.instructions || '',
        coordinates: address.coordinates
            ? {
                latitude: address.coordinates.latitude ?? (address.coordinates as any).lat,
                longitude: address.coordinates.longitude ?? (address.coordinates as any).lng
            }
            : undefined
    }

    customerStore.addAddress(duplicated).then(async () => {
        await loadAddresses()
        showToastMessage('Adresse dupliquée avec succès')
        closeMenu()
    }).catch((error) => {
        console.error('Erreur duplication adresse:', error)
        showToastMessage('Erreur lors de la duplication', true)
    })
}

const showOnMap = (address: Address) => {
    if (address.coordinates) {
        const { lat, lng } = address.coordinates
        const url = `https://www.google.com/maps?q=${lat},${lng}`
        window.open(url, '_blank')
    }
}

const useCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                formData.coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
                showToastMessage('Position géolocalisée. Complétez l’adresse postale.')
            },
            (error) => {
                console.error('Erreur géolocalisation:', error)
                showToastMessage('Impossible d\'obtenir votre position', true)
            }
        )
    } else {
        showToastMessage('La géolocalisation n\'est pas supportée', true)
    }
}

const geocodeAddress = async () => {
    if (!formData.street || !formData.city || !formData.postalCode) return

    try {
        const query = `${formData.street}, ${formData.postalCode} ${formData.city}, ${formData.country}`
        const result = await customerStore.geocodeAddress(query)

        const latitude = result?.latitude ?? result?.lat
        const longitude = result?.longitude ?? result?.lng

        if (typeof latitude === 'number' && typeof longitude === 'number') {
            formData.coordinates = {
                latitude,
                longitude
            }
        }
    } catch (error) {
        console.error('Erreur géocodage:', error)
    }
}

const debouncedGeocode = debounce(geocodeAddress, 1000)

const toggleAddressMenu = (id: string) => {
    activeMenu.value = activeMenu.value === id ? null : id
}

const closeMenu = () => {
    activeMenu.value = null
}

const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
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
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
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
    loadAddresses()
})

// Watch pour la géolocalisation
watch(() => [formData.street, formData.city, formData.postalCode], () => {
    if (formData.street && formData.city && formData.postalCode) {
        debouncedGeocode()
    }
})
</script>

<style scoped>
/* Styles spécifiques à cette vue */
.address-management-view {
    --curve-primary: cubic-bezier(0.4, 0, 0.2, 1);
    --curve-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animations personnalisées */
@keyframes pan-slow {
    0% {
        background-position: 0% 0%;
    }

    100% {
        background-position: 100% 100%;
    }
}

@keyframes pulse-soft {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(1.05);
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

@keyframes dropdown {
    0% {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Appliquer les animations */
.animate-pan-slow {
    animation: pan-slow 120s linear infinite;
}

.animate-pulse-soft {
    animation: pulse-soft 8s ease-in-out infinite;
}

.animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse-subtle {
    animation: pulse-subtle 3s ease-in-out infinite;
}

.slide-up-enter-active {
    animation: slide-up 0.4s var(--curve-bouncy);
}

.slide-up-leave-active {
    animation: slide-up 0.4s var(--curve-bouncy) reverse;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s var(--curve-primary);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-scale-enter-active {
    animation: fade-scale 0.5s var(--curve-bouncy);
}

.fade-scale-leave-active {
    animation: fade-scale 0.5s var(--curve-bouncy) reverse;
}

.dropdown-enter-active {
    animation: dropdown 0.2s var(--curve-bouncy);
}

.dropdown-leave-active {
    animation: dropdown 0.2s var(--curve-bouncy) reverse;
}

/* Transition staggered pour les cartes */
.staggered-fade-move {
    transition: transform 0.5s var(--curve-bouncy);
}

.staggered-fade-enter-active {
    transition: all 0.5s var(--curve-bouncy);
}

.staggered-fade-leave-active {
    transition: all 0.3s var(--curve-primary);
    position: absolute;
}

.staggered-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.staggered-fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

/* Pattern de grille en filigrane */
.bg-grid-pattern {
    background-image:
        linear-gradient(to right, #4CAF50 0.5px, transparent 0.5px),
        linear-gradient(to bottom, #4CAF50 0.5px, transparent 0.5px);
    background-size: 40px 40px;
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
    transform: translateX(20px);
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

/* Ombre portée naturelle */
.shadow-sm {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-md:hover {
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.15);
}

/* Personnalisation de la scrollbar */
.address-management-view ::-webkit-scrollbar {
    width: 6px;
}

.address-management-view ::-webkit-scrollbar-track {
    background: rgba(209, 250, 229, 0.3);
    border-radius: 10px;
}

.address-management-view ::-webkit-scrollbar-thumb {
    background: rgba(76, 175, 80, 0.5);
    border-radius: 10px;
}

.address-management-view ::-webkit-scrollbar-thumb:hover {
    background: rgba(76, 175, 80, 0.7);
}
</style>


