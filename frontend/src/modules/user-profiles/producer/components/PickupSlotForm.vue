<template>
    <div class="min-h-screen pickup-gradient p-4 md:p-8">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 pickup-texture pointer-events-none"></div>

        <!-- Animation de particules de localisation -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="n in 12" :key="n" :class="`location-particle particle-${n}`"
                :style="`--delay: ${n * 0.3}s; --duration: ${25 + n * 2}s;`">
                <div class="particle-icon">
                    <svg class="w-6 h-6 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="max-w-6xl mx-auto">
            <!-- En-tête avec navigation -->
            <div class="flex items-center justify-between mb-10 animate-slide-in-down">
                <div class="flex items-center space-x-4">
                    <button @click="goBack"
                        class="back-button group flex items-center text-foreground-secondary hover:text-primary transition-all duration-500 ease-natural">
                        <svg class="w-5 h-5 mr-2 transition-transform duration-500 ease-natural group-hover:-translate-x-1"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {{ isEditMode ? 'Retour aux points de retrait' : 'Retour' }}
                    </button>

                    <div class="flex items-center space-x-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-foreground-primary">
                                {{ isEditMode ? 'Modifier le point de retrait' : 'Nouveau point de retrait' }}
                            </h1>
                            <p class="text-foreground-secondary">
                                {{ isEditMode ? 'Mettez à jour les informations de votre point de retrait' : 'Créez un nouveau lieu de retrait pour vos clients' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-3">
                    <div v-if="loading" class="flex items-center text-primary">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                        <span class="text-sm">{{ isEditMode ? 'Mise à jour...' : 'Création...' }}</span>
                    </div>

                    <button v-if="!loading" @click="handleSave" :disabled="!isFormValid || loading"
                        class="save-button px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-natural hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span class="flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            {{ isEditMode ? 'Mettre à jour' : 'Créer le point de retrait' }}
                        </span>
                    </button>
                </div>
            </div>

            <!-- Split Screen Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Colonne gauche : Formulaire -->
                <div class="form-container animate-slide-in-left">
                    <div class="glass-card rounded-3xl p-8 h-full">
                        <!-- Étapes de création -->
                        <div class="mb-8">
                            <div class="flex space-x-2 mb-6">
                                <button v-for="(step, index) in steps" :key="step.id" @click="currentStep = index"
                                    :class="[
                                        'step-tab px-4 py-3 rounded-xl font-medium transition-all duration-500 ease-natural',
                                        currentStep === index
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    ]">
                                    <span class="flex items-center">
                                        <span class="flex items-center justify-center w-6 h-6 rounded-full mr-2"
                                            :class="currentStep >= index ? 'bg-white/20' : 'bg-gray-300'">
                                            {{ index + 1 }}
                                        </span>
                                        {{ step.label }}
                                    </span>
                                </button>
                            </div>

                            <!-- Barre de progression -->
                            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div class="progress-bar h-2 rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-1000 ease-natural"
                                    :style="{ width: ((currentStep + 1) / steps.length) * 100 + '%' }"></div>
                            </div>
                        </div>

                        <!-- Messages d'erreur/succès -->
                        <div v-if="errorMessage"
                            class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p class="text-red-800 font-medium">{{ errorMessage }}</p>
                                    <p v-if="errorDetails" class="text-red-600 text-sm mt-1">{{ errorDetails }}</p>
                                </div>
                            </div>
                        </div>

                        <div v-if="successMessage"
                            class="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 animate-fade-in">
                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p class="text-green-800 font-medium">{{ successMessage }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Étapes du formulaire -->
                        <transition name="step-slide" mode="out-in">
                            <!-- Étape 1 : Informations de base -->
                            <div v-if="currentStep === 0" key="step1" class="step-content animate-slide-in-up">
                                <div class="flex items-center mb-6">
                                    <div
                                        class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center mr-4">
                                        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h2 class="text-xl font-bold text-foreground-primary">Informations du point de
                                        retrait</h2>
                                </div>

                                <!-- Nom du point -->
                                <div class="form-group mb-6">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Nom du point de retrait
                                            *</span>
                                        <div class="relative mt-2">
                                            <div class="absolute left-3 top-3 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input v-model="form.name" type="text"
                                                placeholder="Ex: La Ferme du Bonheur - Retrait principal"
                                                class="form-input pl-10" :class="{ 'form-input-error': errors.name }"
                                                @input="validateField('name')" />
                                        </div>
                                        <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
                                        <p class="text-foreground-secondary text-sm mt-2">
                                            Un nom clair aide vos clients à identifier facilement le point de retrait
                                        </p>
                                    </label>
                                </div>

                                <!-- Instructions -->
                                <div class="form-group mb-6">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Instructions de retrait</span>
                                        <textarea v-model="form.instructions" rows="4"
                                            placeholder="Ex: Venez à l'arrière de la ferme, sonnez à la porte verte..."
                                            class="form-textarea"
                                            :class="{ 'form-input-error': errors.instructions }"></textarea>
                                        <div class="flex justify-between mt-2">
                                            <p v-if="errors.instructions" class="form-error">{{ errors.instructions }}
                                            </p>
                                            <p class="text-foreground-secondary text-sm">{{ form.instructions?.length ||
                                                0 }}/500 caractères</p>
                                        </div>
                                        <p class="text-foreground-secondary text-sm mt-2">
                                            Des instructions claires facilitent le retrait pour vos clients
                                        </p>
                                    </label>
                                </div>

                                <!-- Statut actif -->
                                <div class="form-group mb-6">
                                    <label class="form-label">
                                        <div class="flex items-center justify-between">
                                            <span class="text-foreground-primary font-medium">Point de retrait
                                                actif</span>
                                            <button type="button" @click="form.is_active = !form.is_active" :class="[
                                                'toggle-switch relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 ease-natural',
                                                form.is_active ? 'bg-primary' : 'bg-gray-300'
                                            ]">
                                                <span :class="[
                                                    'toggle-switch-handle inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-500 ease-natural',
                                                    form.is_active ? 'translate-x-6' : 'translate-x-1'
                                                ]" />
                                            </button>
                                        </div>
                                        <p class="text-foreground-secondary text-sm mt-2">
                                            {{ form.is_active ? 'Le point de retrait est visible et accessible par vos clients' : 'Le point de retrait est temporairement désactivé' }}
                                        </p>
                                    </label>
                                </div>

                                <!-- Navigation des étapes -->
                                <div class="flex justify-end mt-8 pt-6 border-t border-gray-200">
                                    <button @click="nextStep" :disabled="!validateStep1()"
                                        class="next-step-btn px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-natural hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Continuer
                                        <svg class="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Étape 2 : Localisation -->
                            <div v-else-if="currentStep === 1" key="step2" class="step-content animate-slide-in-up">
                                <div class="flex items-center mb-6">
                                    <div
                                        class="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-green/20 to-accent-green/30 flex items-center justify-center mr-4">
                                        <svg class="w-5 h-5 text-accent-green" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h2 class="text-xl font-bold text-foreground-primary">Localisation</h2>
                                </div>

                                <!-- Recherche d'adresse -->
                                <div class="form-group mb-6">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Rechercher une adresse</span>
                                        <div class="relative mt-2">
                                            <div class="absolute left-3 top-3 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input v-model="addressSearch" type="text"
                                                placeholder="Saisissez une adresse..." class="form-input pl-10"
                                                @input="debouncedSearchAddress" />
                                            <button v-if="addressSearch" @click="clearAddressSearch"
                                                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </label>

                                    <!-- Suggestions d'adresse -->
                                    <div v-if="addressSuggestions.length > 0" class="mt-2">
                                        <div
                                            class="suggestions-list bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                            <div v-for="suggestion in addressSuggestions" :key="suggestion.place_id"
                                                @click="selectAddressSuggestion(suggestion)"
                                                class="suggestion-item p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-300">
                                                <div class="font-medium text-foreground-primary">{{
                                                    suggestion.display_name }}</div>
                                                <div class="text-sm text-foreground-secondary mt-1">{{ suggestion.type
                                                }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Adresse manuelle -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div class="form-group">
                                        <label class="form-label">
                                            <span class="text-foreground-primary font-medium">Adresse *</span>
                                            <input v-model="form.address" type="text" placeholder="Numéro et nom de rue"
                                                class="form-input" :class="{ 'form-input-error': errors.address }"
                                                @input="validateField('address')" />
                                            <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
                                        </label>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">
                                            <span class="text-foreground-primary font-medium">Ville *</span>
                                            <input v-model="form.city" type="text" placeholder="Ex: Lyon"
                                                class="form-input" :class="{ 'form-input-error': errors.city }"
                                                @input="validateField('city')" />
                                            <p v-if="errors.city" class="form-error">{{ errors.city }}</p>
                                        </label>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">
                                            <span class="text-foreground-primary font-medium">Code postal *</span>
                                            <input v-model="form.postal_code" type="text" placeholder="Ex: 69001"
                                                class="form-input" :class="{ 'form-input-error': errors.postal_code }"
                                                @input="validateField('postal_code')" />
                                            <p v-if="errors.postal_code" class="form-error">{{ errors.postal_code }}</p>
                                        </label>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">
                                            <span class="text-foreground-primary font-medium">Pays *</span>
                                            <input v-model="form.country" type="text" placeholder="Ex: France"
                                                class="form-input" :class="{ 'form-input-error': errors.country }"
                                                @input="validateField('country')" />
                                            <p v-if="errors.country" class="form-error">{{ errors.country }}</p>
                                        </label>
                                    </div>
                                </div>

                                <!-- Coordonnées GPS -->
                                <div class="form-group mb-6">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Coordonnées GPS</span>
                                        <p class="text-foreground-secondary text-sm mt-1 mb-3">
                                            Les coordonnées sont automatiquement détectées depuis l'adresse
                                        </p>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="coordinate-input">
                                                <label
                                                    class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                                <div class="relative">
                                                    <input v-model="form.coordinates.lat" type="number" step="0.000001"
                                                        class="form-input" placeholder="45.764043" readonly />
                                                    <div class="absolute right-3 top-3 text-gray-500 text-sm">°</div>
                                                </div>
                                            </div>

                                            <div class="coordinate-input">
                                                <label
                                                    class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                                <div class="relative">
                                                    <input v-model="form.coordinates.lng" type="number" step="0.000001"
                                                        class="form-input" placeholder="4.835659" readonly />
                                                    <div class="absolute right-3 top-3 text-gray-500 text-sm">°</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-center justify-between mt-4">
                                            <button @click="geocodeAddress" type="button"
                                                class="geocode-btn px-4 py-2 bg-gradient-to-r from-accent-green to-accent-green-dark text-white rounded-lg font-medium hover:shadow-lg transform transition-all duration-500 ease-natural hover:scale-105"
                                                :disabled="!canGeocode">
                                                <span class="flex items-center">
                                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    Détecter les coordonnées
                                                </span>
                                            </button>

                                            <button v-if="form.coordinates.lat && form.coordinates.lng"
                                                @click="openMapModal" type="button"
                                                class="map-btn px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transform transition-all duration-500 ease-natural hover:scale-105">
                                                Voir sur la carte
                                            </button>
                                        </div>
                                    </label>
                                </div>

                                <!-- Navigation des étapes -->
                                <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                    <button @click="prevStep"
                                        class="prev-step-btn px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transform transition-all duration-500 ease-natural hover:scale-105">
                                        <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Retour
                                    </button>

                                    <button @click="nextStep" :disabled="!validateStep2()"
                                        class="next-step-btn px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-natural hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Continuer
                                        <svg class="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Étape 3 : Prévisualisation et confirmation -->
                            <div v-else-if="currentStep === 2" key="step3" class="step-content animate-slide-in-up">
                                <div class="flex items-center mb-6">
                                    <div
                                        class="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-orange/20 to-accent-orange/30 flex items-center justify-center mr-4">
                                        <svg class="w-5 h-5 text-accent-orange" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 class="text-xl font-bold text-foreground-primary">Confirmation</h2>
                                </div>

                                <!-- Carte de prévisualisation -->
                                <div class="preview-card glass-card rounded-2xl p-6 mb-6">
                                    <div class="flex items-center justify-between mb-4">
                                        <h3 class="font-bold text-foreground-primary text-lg">Prévisualisation</h3>
                                        <div class="status-badge"
                                            :class="form.is_active ? 'status-active' : 'status-inactive'">
                                            {{ form.is_active ? 'Actif' : 'Inactif' }}
                                        </div>
                                    </div>

                                    <div class="space-y-4">
                                        <!-- Informations principales -->
                                        <div class="preview-item">
                                            <div class="text-sm text-foreground-secondary mb-1">Nom</div>
                                            <div class="font-medium text-foreground-primary">{{ form.name }}</div>
                                        </div>

                                        <!-- Adresse -->
                                        <div class="preview-item">
                                            <div class="text-sm text-foreground-secondary mb-1">Adresse</div>
                                            <div class="font-medium text-foreground-primary">
                                                {{ form.address }}, {{ form.postal_code }} {{ form.city }}, {{
                                                    form.country }}
                                            </div>
                                        </div>

                                        <!-- Instructions -->
                                        <div v-if="form.instructions" class="preview-item">
                                            <div class="text-sm text-foreground-secondary mb-1">Instructions</div>
                                            <div class="text-foreground-primary">{{ form.instructions }}</div>
                                        </div>

                                        <!-- Coordonnées -->
                                        <div class="preview-item">
                                            <div class="text-sm text-foreground-secondary mb-1">Coordonnées GPS</div>
                                            <div class="font-mono text-sm text-foreground-primary">
                                                {{ form.coordinates.lat?.toFixed(6) || 'N/A' }}, {{
                                                    form.coordinates.lng?.toFixed(6) || 'N/A' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Conseils de configuration -->
                                <div
                                    class="tips-card bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 mb-6">
                                    <div class="flex items-center mb-4">
                                        <svg class="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 class="font-bold text-foreground-primary">Conseils après création</h3>
                                    </div>

                                    <ul class="space-y-3">
                                        <li class="flex items-start">
                                            <span
                                                class="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                                                <span class="text-xs text-primary">1</span>
                                            </span>
                                            <span class="text-foreground-secondary text-sm">
                                                Ajoutez des créneaux de retrait pour permettre les réservations
                                            </span>
                                        </li>
                                        <li class="flex items-start">
                                            <span
                                                class="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                                                <span class="text-xs text-primary">2</span>
                                            </span>
                                            <span class="text-foreground-secondary text-sm">
                                                Partagez l'adresse exacte avec les clients confirmés
                                            </span>
                                        </li>
                                        <li class="flex items-start">
                                            <span
                                                class="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                                                <span class="text-xs text-primary">3</span>
                                            </span>
                                            <span class="text-foreground-secondary text-sm">
                                                Pensez à mettre à jour le statut lors des fermetures exceptionnelles
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <!-- Navigation finale -->
                                <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                    <button @click="prevStep"
                                        class="prev-step-btn px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transform transition-all duration-500 ease-natural hover:scale-105">
                                        <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Retour
                                    </button>

                                    <div class="flex space-x-4">
                                        <button @click="handleSaveDraft"
                                            class="draft-btn px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transform transition-all duration-500 ease-natural hover:scale-105">
                                            Enregistrer comme brouillon
                                        </button>

                                        <button @click="handleSave" :disabled="loading"
                                            class="confirm-btn px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-natural hover:scale-105">
                                            <span v-if="loading" class="flex items-center">
                                                <div
                                                    class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2">
                                                </div>
                                                {{ isEditMode ? 'Mise à jour...' : 'Création...' }}
                                            </span>
                                            <span v-else>
                                                {{ isEditMode ? 'Mettre à jour' : 'Créer le point de retrait' }}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

                <!-- Colonne droite : Aide et informations -->
                <div class="help-container animate-slide-in-right">
                    <div class="glass-card rounded-3xl p-8 h-full">
                        <!-- Titre section aide -->
                        <div class="flex items-center mb-8">
                            <div
                                class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/30 flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold text-foreground-primary">Conseils pour vos points de retrait
                            </h2>
                        </div>

                        <!-- Conseils par étape -->
                        <div class="space-y-6">
                            <div v-for="tip in currentStepTips" :key="tip.id"
                                class="tip-card transform transition-all duration-500 ease-natural hover:scale-[1.02]">
                                <div class="flex items-start">
                                    <div
                                        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mr-4">
                                        <span class="text-primary text-lg">{{ tip.icon }}</span>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-foreground-primary mb-1">{{ tip.title }}</h3>
                                        <p class="text-foreground-secondary text-sm">{{ tip.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Séparateur -->
                        <div class="my-8 border-t border-gray-200"></div>

                        <!-- Statistiques et avantages -->
                        <div class="stats-section">
                            <h3 class="font-semibold text-foreground-primary mb-4">Les avantages des points de retrait
                                bien configurés</h3>

                            <div class="space-y-4">
                                <div class="stat-item flex items-center">
                                    <div
                                        class="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                                        <span class="text-green-600 text-sm">↑</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-foreground-primary">+40% de satisfaction client
                                        </div>
                                        <div class="text-foreground-secondary text-sm">Avec des instructions claires
                                        </div>
                                    </div>
                                </div>

                                <div class="stat-item flex items-center">
                                    <div
                                        class="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                        <span class="text-blue-600 text-sm">⏱️</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-foreground-primary">Réduction des retards de 60%
                                        </div>
                                        <div class="text-foreground-secondary text-sm">Grâce à une localisation précise
                                        </div>
                                    </div>
                                </div>

                                <div class="stat-item flex items-center">
                                    <div
                                        class="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                        <span class="text-purple-600 text-sm">🔄</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-foreground-primary">+25% de clients récurrents
                                        </div>
                                        <div class="text-foreground-secondary text-sm">Avec une expérience de retrait
                                            fluide</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Séparateur -->
                        <div class="my-8 border-t border-gray-200"></div>

                        <!-- Quick actions -->
                        <div class="quick-actions">
                            <h3 class="font-semibold text-foreground-primary mb-4">Actions rapides</h3>

                            <div class="grid grid-cols-2 gap-3">
                                <button @click="duplicateCurrentPoint"
                                    class="quick-action-btn p-3 rounded-xl border border-gray-300 text-foreground-primary hover:border-primary hover:bg-primary/5 transform transition-all duration-500 ease-natural hover:scale-105">
                                    <div class="flex flex-col items-center">
                                        <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>
                                        <span class="text-xs">Dupliquer</span>
                                    </div>
                                </button>

                                <button @click="resetForm"
                                    class="quick-action-btn p-3 rounded-xl border border-gray-300 text-foreground-primary hover:border-red-300 hover:bg-red-50 transform transition-all duration-500 ease-natural hover:scale-105">
                                    <div class="flex flex-col items-center">
                                        <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span class="text-xs">Effacer</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Carte interactive (modal) -->
            <transition name="modal">
                <div v-if="showMapModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div class="map-modal glass-card max-w-4xl w-full rounded-3xl overflow-hidden transform transition-all duration-500 ease-natural"
                        @click.stop>
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-bold text-foreground-primary">Localisation sur la carte</h3>
                                <button @click="showMapModal = false" class="text-gray-500 hover:text-gray-700">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="p-6">
                            <!-- Carte simulée (dans un vrai projet, intégrer Leaflet/Google Maps) -->
                            <div
                                class="map-preview h-96 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div class="text-center">
                                    <div
                                        class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p class="text-foreground-primary font-medium">{{ form.name }}</p>
                                    <p class="text-foreground-secondary text-sm mt-1">
                                        {{ form.address }}, {{ form.postal_code }} {{ form.city }}
                                    </p>
                                    <p class="text-foreground-secondary text-sm mt-4">
                                        Coordonnées: {{ form.coordinates.lat?.toFixed(6) }}, {{
                                            form.coordinates.lng?.toFixed(6) }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-6 flex justify-end">
                                <button @click="showMapModal = false"
                                    class="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-natural hover:scale-105">
                                    Fermer la carte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Animation de succès -->
        <transition name="success">
            <div v-if="showSuccessAnimation"
                class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div class="success-animation">
                    <div class="success-circle"></div>
                    <div class="success-checkmark"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProducerStore } from '../stores/useProducerStore';
import { getErrorMessage } from '@/shared/utils/error-handler';
import type { PickupPoint, PickupPointCreate, UpdatePickupPointRequest, PickupPointFormData } from '../types';

const router = useRouter();
const store = useProducerStore();

const props = defineProps<{
    mode?: 'create' | 'edit';
    pickupPointId?: string;
}>();

const emit = defineEmits<{
    (e: 'success'): void;
    (e: 'cancel'): void;
}>();

// États du formulaire
const currentStep = ref(0);
const steps = [
    { id: 'info', label: 'Informations' },
    { id: 'location', label: 'Localisation' },
    { id: 'confirmation', label: 'Confirmation' }
];

const isEditMode = computed(() => props.mode === 'edit' && props.pickupPointId);

// Données du formulaire
const form = reactive<PickupPointFormData>({
    name: '',
    type: 'farm' as any,
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    coordinates: {
        lat: 0,
        lng: 0
    },
    instructions: '',
    is_active: true
});

// États UI
const loading = ref(false);
const errorMessage = ref<string>('');
const errorDetails = ref<string>('');
const successMessage = ref<string>('');
const showMapModal = ref(false);
const showSuccessAnimation = ref(false);

// Recherche d'adresse
const addressSearch = ref('');
const addressSuggestions = ref<any[]>([]);
const addressSearchTimeout = ref<number | null>(null);

// Validation
const errors = reactive<Record<string, string>>({});

// Conseils par étape
const currentStepTips = computed(() => {
    const tips = {
        0: [
            { id: 1, icon: '🏷️', title: 'Nom clair', description: 'Utilisez un nom facile à reconnaître pour vos clients' },
            { id: 2, icon: '📝', title: 'Instructions détaillées', description: 'Décrivez précisément comment accéder au point de retrait' },
            { id: 3, icon: '⚙️', title: 'Statut actif', description: 'Activez le point uniquement quand il est disponible' }
        ],
        1: [
            { id: 4, icon: '📍', title: 'Précision', description: 'Une adresse exacte évite les retards et confusions' },
            { id: 5, icon: '🗺️', title: 'Coordonnées GPS', description: 'Essentielles pour la navigation et les calculs de distance' },
            { id: 6, icon: '🏘️', title: 'Accessibilité', description: 'Assurez-vous que le point est facilement accessible' }
        ],
        2: [
            { id: 7, icon: '👁️', title: 'Vérification', description: 'Vérifiez toutes les informations avant de créer' },
            { id: 8, icon: '🎯', title: 'Prévisualisation', description: 'Voyez comment vos clients verront le point' },
            { id: 9, icon: '⚡', title: 'Configuration rapide', description: 'Pensez à ajouter des créneaux après la création' }
        ]
    };

    return tips[currentStep.value as keyof typeof tips] || [];
});

// Computed properties
const isFormValid = computed(() => {
    return validateStep1() && validateStep2();
});

const canGeocode = computed(() => {
    return form.address && form.postal_code && form.city && form.country;
});

// Initialisation
onMounted(() => {
    if (isEditMode.value && props.pickupPointId) {
        loadPickupPointData();
    }
});

async function loadPickupPointData() {
    if (!props.pickupPointId) return;

    try {
        loading.value = true;
        const point = store.pickupPoints.find(p => p.id === props.pickupPointId);

        if (point) {
            form.name = point.name;
            form.type = point.type;
            form.description = point.description;
            // Mapper l'adresse imbriquée vers la structure plate du formulaire
            if (typeof point.address === 'object' && 'street' in point.address) {
                form.address = point.address.street;
                form.city = point.address.city;
                form.postal_code = point.address.postal_code;
                form.country = point.address.country;
                if (point.address.coordinates) {
                    form.coordinates = {
                        lat: point.address.coordinates.lat || point.address.coordinates.latitude,
                        lng: point.address.coordinates.lng || point.address.coordinates.longitude
                    };
                }
            }
            form.phone = point.contact?.phone;
            form.email = point.contact?.email;
            form.instructions = point.instructions;
            form.is_active = point.is_active;
        }
    } catch (error) {
        console.error('Erreur lors du chargement du point de retrait:', error);
    } finally {
        loading.value = false;
    }
}

// Navigation
function goBack() {
    if (currentStep.value > 0) {
        prevStep();
    } else {
        emit('cancel');
    }
}

function nextStep() {
    if (currentStep.value < steps.length - 1) {
        currentStep.value++;
    }
}

function prevStep() {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
}

// Validation
function validateStep1(): boolean {
    clearErrors();
    let isValid = true;

    if (!form.name?.trim()) {
        errors.name = 'Le nom du point de retrait est requis';
        isValid = false;
    }

    if (form.name && form.name.length > 100) {
        errors.name = 'Le nom ne doit pas dépasser 100 caractères';
        isValid = false;
    }

    if (form.instructions && form.instructions.length > 500) {
        errors.instructions = 'Les instructions ne doivent pas dépasser 500 caractères';
        isValid = false;
    }

    return isValid;
}

function validateStep2(): boolean {
    clearErrors();
    let isValid = true;

    if (!form.address?.trim()) {
        errors.address = 'L\'adresse est requise';
        isValid = false;
    }

    if (!form.city?.trim()) {
        errors.city = 'La ville est requise';
        isValid = false;
    }

    if (!form.postal_code?.trim()) {
        errors.postal_code = 'Le code postal est requis';
        isValid = false;
    }

    if (!form.country?.trim()) {
        errors.country = 'Le pays est requis';
        isValid = false;
    }

    return isValid;
}

function validateField(field: string) {
    switch (field) {
        case 'name':
            if (!form.name?.trim()) {
                errors.name = 'Le nom du point de retrait est requis';
            } else if (form.name.length > 100) {
                errors.name = 'Le nom ne doit pas dépasser 100 caractères';
            } else {
                delete errors.name;
            }
            break;

        case 'address':
            if (!form.address?.trim()) {
                errors.address = 'L\'adresse est requise';
            } else {
                delete errors.address;
            }
            break;

        case 'city':
            if (!form.city?.trim()) {
                errors.city = 'La ville est requise';
            } else {
                delete errors.city;
            }
            break;

        case 'postal_code':
            if (!form.postal_code?.trim()) {
                errors.postal_code = 'Le code postal est requis';
            } else {
                delete errors.postal_code;
            }
            break;

        case 'country':
            if (!form.country?.trim()) {
                errors.country = 'Le pays est requis';
            } else {
                delete errors.country;
            }
            break;
    }
}

function clearErrors() {
    Object.keys(errors).forEach(key => {
        errors[key] = '';
    });
    errorMessage.value = '';
    errorDetails.value = '';
}

// Recherche d'adresse
function debouncedSearchAddress() {
    if (addressSearchTimeout.value) {
        clearTimeout(addressSearchTimeout.value);
    }

    addressSearchTimeout.value = setTimeout(() => {
        if (addressSearch.value.trim()) {
            searchAddress();
        }
    }, 500);
}

async function searchAddress() {
    // Simulation de recherche d'adresse
    // Dans un vrai projet, on utiliserait une API comme OpenStreetMap Nominatim
    addressSuggestions.value = [
        {
            place_id: '1',
            display_name: `${form.address || 'Adresse'}, ${form.postal_code || 'Code postal'} ${form.city || 'Ville'}, ${form.country || 'Pays'}`,
            type: 'building'
        },
        {
            place_id: '2',
            display_name: `${form.city || 'Ville'}, ${form.country || 'Pays'}`,
            type: 'city'
        }
    ];
}

function clearAddressSearch() {
    addressSearch.value = '';
    addressSuggestions.value = [];
}

function selectAddressSuggestion(suggestion: any) {
    // Dans un vrai projet, on parserait les données de l'API
    // Pour l'exemple, on simule juste la sélection
    addressSearch.value = suggestion.display_name;
    addressSuggestions.value = [];
}

// Géocodage
async function geocodeAddress() {
    if (!canGeocode.value) return;

    try {
        loading.value = true;

        // Simulation de géocodage
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Coordonnées simulées (Paris par défaut)
        form.coordinates = {
            lat: 48.8566 + (Math.random() - 0.5) * 0.1,
            lng: 2.3522 + (Math.random() - 0.5) * 0.1
        };

        successMessage.value = 'Coordonnées GPS détectées avec succès';
        setTimeout(() => successMessage.value = '', 3000);

    } catch (error) {
        errorMessage.value = 'Erreur lors de la détection des coordonnées';
        errorDetails.value = 'Veuillez vérifier votre adresse et réessayer';
    } finally {
        loading.value = false;
    }
}

// Actions
function openMapModal() {
    if (form.coordinates.lat && form.coordinates.lng) {
        showMapModal.value = true;
    }
}

function duplicateCurrentPoint() {
    if (isEditMode.value) {
        form.name = `${form.name} - Copie`;
        // Réinitialiser l'ID pour créer un nouveau point
        currentStep.value = 0;
        successMessage.value = 'Point de retrait dupliqué - Modifiez les informations';
        setTimeout(() => successMessage.value = '', 3000);
    }
}

function resetForm() {
    if (confirm('Voulez-vous vraiment réinitialiser le formulaire ? Toutes les modifications seront perdues.')) {
        Object.assign(form, {
            name: '',
            address: '',
            city: '',
            postal_code: '',
            country: 'France',
            coordinates: { lat: 0, lng: 0 },
            instructions: '',
            is_active: true
        });
        currentStep.value = 0;
        clearErrors();
        addressSearch.value = '';
        addressSuggestions.value = [];

        successMessage.value = 'Formulaire réinitialisé';
        setTimeout(() => successMessage.value = '', 3000);
    }
}

async function handleSaveDraft() {
    // Ici, on pourrait sauvegarder dans le store local ou localStorage
    successMessage.value = 'Point de retrait enregistré comme brouillon';
    setTimeout(() => successMessage.value = '', 3000);
}

async function handleSave() {
    // Validation finale
    if (!validateStep1() || !validateStep2()) {
        errorMessage.value = 'Veuillez corriger les erreurs dans le formulaire';
        return;
    }

    try {
        loading.value = true;
        clearErrors();

        // Transformer les données du formulaire pour correspondre à l'API
        const addressData = {
            street: form.address,
            city: form.city,
            postal_code: form.postal_code,
            country: form.country,
            coordinates: form.coordinates || { lat: 0, lng: 0 }
        };

        const pickupPointData = {
            name: form.name,
            type: form.type,
            description: form.description,
            address: addressData,
            instructions: form.instructions || '',
            contact_phone: form.phone,
            contact_email: form.email,
            is_active: form.is_active,
            status: form.status
        };

        if (isEditMode.value && props.pickupPointId) {
            await store.updatePickupPoint(props.pickupPointId, pickupPointData as UpdatePickupPointRequest);
            successMessage.value = 'Point de retrait mis à jour avec succès !';
        } else {
            await store.createPickupPoint(pickupPointData as PickupPointCreate);
            successMessage.value = 'Point de retrait créé avec succès !';
        }

        // Animation de succès
        showSuccessAnimation.value = true;
        setTimeout(() => {
            showSuccessAnimation.value = false;

            // Redirection après succès
            setTimeout(() => {
                emit('success');
                router.push('/producer/pickup-points');
            }, 500);
        }, 1500);

    } catch (error: unknown) {
        errorMessage.value = 'Une erreur est survenue';
        errorDetails.value = getErrorMessage(error);

        // Animation d'erreur
        const formElement = document.querySelector('.form-container .glass-card');
        if (formElement) {
            formElement.classList.add('animate-shake');
            setTimeout(() => {
                formElement.classList.remove('animate-shake');
            }, 500);
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
/* Dégradé organique pour points de retrait */
.pickup-gradient {
    background: linear-gradient(135deg,
            #f0f9ff 0%,
            #ecfdf5 25%,
            #f5f3ff 50%,
            #fefce8 75%,
            #f0f9ff 100%);
    background-size: 400% 400%;
    animation: gradient-flow 30s ease infinite;
}

/* Texture de fond */
.pickup-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2310b981' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
}

/* Animation de particules de localisation */
@keyframes location-float {
    0% {
        transform: translateY(100vh) translateX(calc(var(--start-x) * 100vw)) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 0.2;
    }

    90% {
        opacity: 0.2;
    }

    100% {
        transform: translateY(-100px) translateX(calc((var(--start-x) + 0.2) * 100vw)) rotate(360deg);
        opacity: 0;
    }
}

.location-particle {
    position: absolute;
    animation: location-float var(--duration) ease-in-out var(--delay) infinite;
    z-index: 0;
}

.particle-icon {
    opacity: 0.2;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.particle-1 {
    --start-x: 0.1;
}

.particle-2 {
    --start-x: 0.3;
}

.particle-3 {
    --start-x: 0.5;
}

.particle-4 {
    --start-x: 0.7;
}

.particle-5 {
    --start-x: 0.9;
}

.particle-6 {
    --start-x: 0.2;
}

.particle-7 {
    --start-x: 0.4;
}

.particle-8 {
    --start-x: 0.6;
}

.particle-9 {
    --start-x: 0.8;
}

.particle-10 {
    --start-x: 0.15;
}

.particle-11 {
    --start-x: 0.35;
}

.particle-12 {
    --start-x: 0.55;
}

/* Animations */
@keyframes gradient-flow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.ease-natural {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-down {
    animation: slide-in-down 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-left {
    animation: slide-in-left 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.animate-slide-in-right {
    animation: slide-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.animate-slide-in-up {
    animation: slide-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-fade-in {
    animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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

@keyframes slide-in-left {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slide-in-right {
    from {
        opacity: 0;
        transform: translateX(30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
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

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-5px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(5px);
    }
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transition entre étapes */
.step-slide-enter-active {
    animation: step-slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-slide-leave-active {
    animation: step-slide-out 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes step-slide-in {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes step-slide-out {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(-30px);
    }
}

/* Effet glassmorphism */
.glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow:
        0 10px 40px rgba(31, 38, 135, 0.08),
        0 4px 16px rgba(0, 0, 0, 0.04);
}

/* Barre de progression animée */
.progress-bar {
    background: linear-gradient(90deg,
            #10b981 0%,
            #34d399 25%,
            #10b981 50%,
            #34d399 75%,
            #10b981 100%);
    background-size: 200% 100%;
    animation: progress-shimmer 2s linear infinite;
}

@keyframes progress-shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: 0 0;
    }
}

/* Styles des formulaires */
.form-label {
    display: block;
}

.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.95);
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input:focus {
    outline: none;
    border-color: #10b981;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input-error {
    border-color: #ef4444;
}

.form-input-error:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.95);
    font-size: 16px;
    resize: vertical;
    min-height: 100px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-textarea:focus {
    outline: none;
    border-color: #10b981;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-error {
    color: #ef4444;
    font-size: 14px;
    margin-top: 4px;
}

/* Suggestions d'adresse */
.suggestions-list {
    z-index: 10;
}

.suggestion-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.suggestion-item:hover {
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1));
}

/* Cartes interactives */
.tip-card,
.preview-card,
.tips-card {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.tip-card:hover,
.preview-card:hover,
.tips-card:hover {
    box-shadow:
        0 8px 24px rgba(16, 185, 129, 0.1),
        0 4px 12px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* Badge de statut */
.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.status-active {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
}

.status-inactive {
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    color: #4b5563;
}

/* Bouton toggle */
.toggle-switch {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-switch-handle {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Animation de succès */
@keyframes success-circle {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 0;
    }
}

@keyframes success-check {
    0% {
        stroke-dashoffset: 100;
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        stroke-dashoffset: 0;
        opacity: 1;
    }
}

.success-animation {
    position: relative;
    width: 100px;
    height: 100px;
}

.success-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #34d399);
    animation: success-circle 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.success-checkmark {
    position: absolute;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%;
    stroke: white;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: success-check 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
}

/* Transitions modales */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .map-modal,
.modal-leave-active .map-modal {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .map-modal,
.modal-leave-to .map-modal {
    opacity: 0;
    transform: scale(0.9);
}

/* Animation de succès */
.success-enter-active,
.success-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.success-enter-from,
.success-leave-to {
    opacity: 0;
}

/* Couleurs personnalisées */
.text-foreground-primary {
    color: #1f2937;
}

.text-foreground-secondary {
    color: #6b7280;
}

.bg-primary {
    background-color: #10b981;
}

.bg-primary-light {
    background-color: #d1fae5;
}

.bg-primary-dark {
    background-color: #059669;
}

.text-primary {
    color: #10b981;
}

.border-primary {
    border-color: #10b981;
}

.bg-accent-green {
    background-color: #34d399;
}

.bg-accent-green-dark {
    background-color: #10b981;
}

.bg-accent-orange {
    background-color: #f59e0b;
}

.bg-accent-orange-dark {
    background-color: #d97706;
}

.bg-accent-blue {
    background-color: #3b82f6;
}

.bg-accent-blue-dark {
    background-color: #1d4ed8;
}

/* Effets sur les boutons */
.back-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.save-button {
    box-shadow:
        0 4px 20px rgba(16, 185, 129, 0.2),
        0 1px 3px rgba(0, 0, 0, 0.1);
}

.save-button:hover:not(:disabled) {
    box-shadow:
        0 8px 30px rgba(16, 185, 129, 0.3),
        0 2px 6px rgba(0, 0, 0, 0.1);
}

.next-step-btn,
.confirm-btn {
    box-shadow:
        0 4px 20px rgba(16, 185, 129, 0.2),
        0 1px 3px rgba(0, 0, 0, 0.1);
}

.next-step-btn:hover:not(:disabled),
.confirm-btn:hover:not(:disabled) {
    box-shadow:
        0 8px 30px rgba(16, 185, 129, 0.3),
        0 2px 6px rgba(0, 0, 0, 0.1);
}

.prev-step-btn:hover,
.draft-btn:hover {
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.05);
}

.geocode-btn {
    box-shadow:
        0 4px 15px rgba(52, 211, 153, 0.2),
        0 1px 3px rgba(0, 0, 0, 0.1);
}

.geocode-btn:hover:not(:disabled) {
    box-shadow:
        0 6px 25px rgba(52, 211, 153, 0.3),
        0 2px 5px rgba(0, 0, 0, 0.1);
}

.map-btn:hover {
    box-shadow:
        0 4px 12px rgba(16, 185, 129, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.05);
}

.quick-action-btn:hover {
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Preview items */
.preview-item {
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
}

.preview-item:last-child {
    border-bottom: none;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .step-tab span {
        display: none;
    }

    .step-tab {
        padding: 8px;
        min-width: 40px;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .steps-tabs {
        flex-direction: column;
        gap: 8px;
    }

    .step-tab {
        width: 100%;
        justify-content: center;
    }

    .step-tab span {
        display: flex;
    }
}
</style>