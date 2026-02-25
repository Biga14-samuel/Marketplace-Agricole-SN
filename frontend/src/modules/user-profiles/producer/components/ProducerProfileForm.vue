import { getErrorMessage } from '@/shared/utils/error-handler';
<template>
    <div class="min-h-screen organic-gradient p-4 md:p-8">
        <!-- Texture de fond -->
        <div class="absolute inset-0 texture-overlay pointer-events-none"></div>

        <!-- Header avec navigation -->
        <div class="max-w-6xl mx-auto">
            <div class="flex items-center justify-between mb-8 animate-fade-in-down">
                <div class="flex items-center space-x-4">
                    <button @click="goBack"
                        class="back-button group flex items-center text-foreground-secondary hover:text-primary transition-all duration-500 ease-organic">
                        <svg class="w-5 h-5 mr-2 transition-transform duration-500 ease-organic group-hover:-translate-x-1"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour
                    </button>

                    <div class="flex items-center space-x-2">
                        <div
                            class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-lg font-semibold text-foreground-primary">Mon Profil Producteur</h1>
                            <p class="text-sm text-foreground-secondary">Complétez vos informations professionnelles</p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-3">
                    <div v-if="store.isProfileLoading" class="flex items-center text-primary">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                        <span class="text-sm">Enregistrement...</span>
                    </div>

                    <button v-if="mode === 'edit' && !store.isProfileLoading" @click="handleSave"
                        class="save-button px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-organic hover:scale-105">
                        <span class="flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            Enregistrer les modifications
                        </span>
                    </button>
                </div>
            </div>

            <!-- Progress Steps -->
            <div class="mb-12 animate-slide-in-right">
                <div class="flex items-center justify-between max-w-3xl mx-auto">
                    <div v-for="(step, index) in steps" :key="step.id" class="flex items-center flex-1">
                        <div class="flex items-center justify-center">
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-organic',
                                currentStep >= index ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-400'
                            ]">
                                <span v-if="currentStep > index" class="text-sm">✓</span>
                                <span v-else class="text-sm">{{ index + 1 }}</span>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium"
                                    :class="currentStep >= index ? 'text-primary' : 'text-gray-500'">
                                    {{ step.label }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index < steps.length - 1"
                            :class="['flex-1 h-1 mx-4 transition-all duration-500 ease-organic', currentStep > index ? 'bg-primary' : 'bg-gray-200']">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Form Container -->
            <div class="max-w-4xl mx-auto">
                <!-- Error Message -->
                <div v-if="formError" class="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-red-800 font-medium">{{ formError }}</p>
                            <p v-if="formErrorDetails" class="text-red-600 text-sm mt-1">{{ formErrorDetails }}</p>
                        </div>
                    </div>
                </div>

                <!-- Success Message -->
                <div v-if="successMessage"
                    class="mb-8 p-4 rounded-xl bg-green-50 border border-green-200 animate-fade-in">
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

                <!-- Form Sections with Animation -->
                <transition name="form-slide" mode="out-in">
                    <!-- STEP 1: Identité de l'entreprise -->
                    <div v-if="currentStep === 0" key="step1" class="animate-slide-in-up">
                        <div class="glass-card p-8 rounded-2xl mb-8">
                            <div class="flex items-center mb-8">
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-foreground-primary">Identité de votre entreprise
                                    </h2>
                                    <p class="text-foreground-secondary mt-1">Informations légales et de contact</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Nom de l'entreprise -->
                                <div class="form-group">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Nom de l'entreprise *</span>
                                        <div class="relative mt-2">
                                            <div class="absolute left-3 top-3 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input v-model="form.business_name" type="text"
                                                placeholder="Ex: La Ferme du Bonheur" class="form-input pl-10"
                                                :class="{ 'form-input-error': errors.business_name }" />
                                        </div>
                                        <p v-if="errors.business_name" class="form-error">{{ errors.business_name }}</p>
                                    </label>
                                </div>

                                <!-- SIRET -->
                                <div class="form-group">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Numéro SIRET *</span>
                                        <div class="relative mt-2">
                                            <div class="absolute left-3 top-3 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <input v-model="form.siret" type="text" placeholder="14 chiffres"
                                                class="form-input pl-10" :class="{ 'form-input-error': errors.siret }"
                                                @blur="validateSiret" />
                                        </div>
                                        <div class="flex items-center mt-2">
                                            <div v-if="siretValidating" class="flex items-center text-primary text-sm">
                                                <div
                                                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2">
                                                </div>
                                                Vérification...
                                            </div>
                                            <div v-else-if="siretValidation.valid"
                                                class="flex items-center text-green-600 text-sm">
                                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                SIRET valide
                                            </div>
                                            <div v-else-if="siretValidation.message" class="text-red-600 text-sm">
                                                {{ siretValidation.message }}
                                            </div>
                                        </div>
                                        <p v-if="errors.siret" class="form-error">{{ errors.siret }}</p>
                                    </label>
                                </div>

                                <!-- Numéro de TVA -->
                                <div class="form-group">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Numéro de TVA
                                            intracommunautaire</span>
                                        <div class="relative mt-2">
                                            <div class="absolute left-3 top-3 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <input v-model="form.tva_number" type="text" placeholder="Ex: FR12345678901"
                                                class="form-input pl-10"
                                                :class="{ 'form-input-error': errors.tva_number }"
                                                @blur="validateVat" />
                                        </div>
                                        <div v-if="vatValidation.valid"
                                            class="flex items-center mt-2 text-green-600 text-sm">
                                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            Numéro de TVA valide
                                        </div>
                                        <p v-if="errors.tva_number" class="form-error">{{ errors.tva_number }}</p>
                                    </label>
                                </div>

                                <!-- IBAN -->
                                <div class="form-group">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">IBAN *</span>
                                        <div class="relative mt-2">
                                            <div class="absolute left-3 top-3 text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <input v-model="form.iban" type="text"
                                                placeholder="Ex: FR76 3000 1000 0100 0000 0000 000"
                                                class="form-input pl-10" :class="{ 'form-input-error': errors.iban }"
                                                @blur="validateIban" />
                                        </div>
                                        <div v-if="ibanValid" class="flex items-center mt-2 text-green-600 text-sm">
                                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            IBAN valide
                                        </div>
                                        <p v-if="errors.iban" class="form-error">{{ errors.iban }}</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation Buttons -->
                        <div class="flex justify-between mt-8">
                            <button @click="goBack"
                                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transform transition-all duration-500 ease-organic hover:scale-105">
                                Annuler
                            </button>
                            <button @click="nextStep"
                                class="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-organic hover:scale-105">
                                Continuer
                                <svg class="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- STEP 2: Description et production -->
                    <div v-else-if="currentStep === 1" key="step2" class="animate-slide-in-up">
                        <div class="glass-card p-8 rounded-2xl mb-8">
                            <div class="flex items-center mb-8">
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-green-dark flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-foreground-primary">Votre activité agricole</h2>
                                    <p class="text-foreground-secondary mt-1">Présentez votre ferme et vos pratiques</p>
                                </div>
                            </div>

                            <!-- Bio -->
                            <div class="form-group mb-8">
                                <label class="form-label">
                                    <span class="text-foreground-primary font-medium">Présentation de votre ferme</span>
                                    <p class="text-foreground-secondary text-sm mt-1 mb-3">Décrivez votre histoire, vos
                                        valeurs, et ce qui rend vos produits uniques</p>
                                    <textarea v-model="form.bio" rows="4"
                                        placeholder="Parlez-nous de votre passion pour l'agriculture, de votre engagement pour la qualité, de votre terroir..."
                                        class="form-textarea" :class="{ 'form-input-error': errors.bio }"></textarea>
                                    <div class="flex justify-between mt-2">
                                        <p v-if="errors.bio" class="form-error">{{ errors.bio }}</p>
                                        <p class="text-foreground-secondary text-sm">{{ form.bio?.length || 0 }}/500
                                            caractères</p>
                                    </div>
                                </label>
                            </div>

                            <!-- Type de production -->
                            <div class="form-group mb-8">
                                <label class="form-label">
                                    <span class="text-foreground-primary font-medium">Type(s) de production *</span>
                                    <p class="text-foreground-secondary text-sm mt-1 mb-4">Sélectionnez les types qui
                                        correspondent à votre activité</p>

                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <button v-for="type in productionTypes" :key="type.value" type="button"
                                            @click="toggleProductionType(type.value)" :class="[
                                                'py-3 px-4 rounded-xl border transition-all duration-500 ease-organic transform hover:scale-105',
                                                form.production_type?.includes(type.value)
                                                    ? 'border-primary bg-primary-light text-primary'
                                                    : 'border-gray-300 hover:border-primary text-gray-700'
                                            ]">
                                            <div class="flex items-center justify-center">
                                                <span class="text-lg mr-2">{{ type.icon }}</span>
                                                <span class="font-medium">{{ type.label }}</span>
                                            </div>
                                        </button>
                                    </div>
                                    <p v-if="errors.production_type" class="form-error mt-2">{{ errors.production_type
                                    }}</p>
                                </label>
                            </div>

                            <!-- Taille de la ferme et certifications -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <!-- Taille de la ferme -->
                                <div class="form-group">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Superficie exploitée</span>
                                        <div class="relative mt-2">
                                            <input v-model.number="form.farm_size" type="number" min="0" step="0.1"
                                                placeholder="Ex: 5.2" class="form-input pr-12"
                                                :class="{ 'form-input-error': errors.farm_size }" />
                                            <div class="absolute right-3 top-3 text-gray-500">ha</div>
                                        </div>
                                        <p class="text-foreground-secondary text-sm mt-2">
                                            Cette information aide les clients à comprendre l'échelle de votre
                                            production
                                        </p>
                                        <p v-if="errors.farm_size" class="form-error">{{ errors.farm_size }}</p>
                                    </label>
                                </div>

                                <!-- Certifications -->
                                <div class="form-group">
                                    <label class="form-label">
                                        <span class="text-foreground-primary font-medium">Certifications</span>
                                        <div class="relative mt-2">
                                            <input v-model="certificationInput" type="text"
                                                placeholder="Ajoutez une certification (ex: Agriculture Biologique, Label Rouge...)"
                                                class="form-input" @keyup.enter="addCertification" />
                                            <button @click="addCertification" type="button"
                                                class="absolute right-3 top-3 text-primary hover:text-primary-dark">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>

                                        <!-- Liste des certifications -->
                                        <div v-if="form.certifications && form.certifications.length > 0" class="mt-4">
                                            <div class="flex flex-wrap gap-2">
                                                <div v-for="(cert, index) in form.certifications" :key="index"
                                                    class="inline-flex items-center px-3 py-1.5 rounded-full bg-accent-green-light text-accent-green-dark text-sm font-medium">
                                                    {{ cert }}
                                                    <button @click="removeCertification(index)" type="button"
                                                        class="ml-2 text-accent-green-dark hover:text-accent-green-dark/80">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <p class="text-foreground-secondary text-sm mt-2">
                                            Ajoutez vos certifications pour renforcer la confiance des clients
                                        </p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation Buttons -->
                        <div class="flex justify-between mt-8">
                            <button @click="prevStep"
                                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transform transition-all duration-500 ease-organic hover:scale-105">
                                <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour
                            </button>
                            <div class="flex space-x-4">
                                <button @click="handleSave"
                                    class="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-500 ease-organic hover:scale-105">
                                    Enregistrer et terminer
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- Background Animation (feuilles flottantes) -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="n in 8" :key="n" :class="`leaf-animation leaf-${n}`"
                :style="`--delay: ${n * 0.5}s; --duration: ${15 + n * 3}s; --start-x: ${(n * 12.5)}%;`">
                <svg class="w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProducerStore } from '../stores/useProducerStore';
import { getErrorMessage } from '@/shared/utils/error-handler';
import type { ProducerProfileCreate, ProducerProfileUpdate, ProductionType, ProducerFormData } from '../types';
import { CertificationType } from '../types';

const router = useRouter();
const store = useProducerStore();

const props = defineProps<{
    mode?: 'create' | 'edit';
}>();

const emit = defineEmits<{
    (e: 'success'): void;
    (e: 'cancel'): void;
}>();

// États du formulaire
const currentStep = ref(0);
const steps = [
    { id: 'identity', label: 'Identité' },
    { id: 'activity', label: 'Activité' },
    { id: 'confirmation', label: 'Confirmation' }
];

// Données du formulaire
const form = reactive<ProducerFormData>({
    farm_name: '',
    business_name: '',
    bio: '',
    siret: '',
    tva_number: '',
    iban: '',
    certifications: [],
    farm_size: undefined,
    production_type: []
});

const certificationInput = ref('');

// Validation
const errors = reactive<Record<string, string>>({});
const formError = ref<string>('');
const formErrorDetails = ref<string>('');
const successMessage = ref<string>('');

// Validation SIRET
const siretValidating = ref(false);
const siretValidation = reactive({
    valid: false,
    message: ''
});

// Validation TVA
const vatValidation = reactive({
    valid: false,
    message: ''
});

// Validation IBAN
const ibanValid = ref(false);

// Types de production
const productionTypes = [
    { value: 'organic' as ProductionType, label: 'Bio', icon: '🌱' },
    { value: 'biodynamic' as ProductionType, label: 'Biodynamique', icon: '✨' },
    { value: 'permaculture' as ProductionType, label: 'Permaculture', icon: '♻️' },
    { value: 'conventional' as ProductionType, label: 'Conventionnel', icon: '🏭' },
    { value: 'hydroponic' as ProductionType, label: 'Hydroponie', icon: '💧' },
    { value: 'aquaponic' as ProductionType, label: 'Aquaponie', icon: '🐟' },
    { value: 'urban' as ProductionType, label: 'Urbaine', icon: '🏙️' },
    { value: 'family' as ProductionType, label: 'Familiale', icon: '👨‍👩‍👧‍👦' }
];

// Initialisation
onMounted(() => {
    if (store.profile && props.mode === 'edit') {
        loadProfileData();
    }
});

function loadProfileData() {
    if (!store.profile) return;

    form.business_name = store.profile.business_name;
    form.siret = store.profile.siret;
    form.tva_number = store.profile.tva_number || '';
    form.iban = store.profile.iban;
    form.bio = store.profile.bio || '';
    form.certifications = store.profile.certifications || [];
    form.farm_size = store.profile.farm_size;
    form.production_type = Array.isArray(store.profile.production_type) 
        ? store.profile.production_type 
        : store.profile.production_type ? [store.profile.production_type] : [];

    // Valider les données existantes
    validateSiret();
    validateVat();
    validateIban();
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
    if (validateStep(currentStep.value)) {
        currentStep.value++;
    }
}

function prevStep() {
    currentStep.value--;
}

// Gestion des certifications
function addCertification() {
    if (certificationInput.value.trim()) {
        if (!form.certifications) {
            form.certifications = [];
        }
        form.certifications.push(certificationInput.value.trim());
        certificationInput.value = '';
    }
}

function removeCertification(index: number) {
    if (form.certifications) {
        form.certifications.splice(index, 1);
    }
}

// Gestion des types de production
function toggleProductionType(type: ProductionType) {
    if (!form.production_type) {
        form.production_type = [];
    }

    const index = form.production_type.indexOf(type);
    if (index === -1) {
        form.production_type.push(type);
    } else {
        form.production_type.splice(index, 1);
    }
}

// Validation
function validateStep(step: number): boolean {
    clearErrors();

    switch (step) {
        case 0:
            return validateIdentityStep();
        case 1:
            return validateActivityStep();
        default:
            return true;
    }
}

function validateIdentityStep(): boolean {
    let isValid = true;

    if (!form.business_name?.trim()) {
        errors.business_name = 'Le nom de l\'entreprise est requis';
        isValid = false;
    }

    if (!form.siret?.trim()) {
        errors.siret = 'Le numéro SIRET est requis';
        isValid = false;
    } else if (form.siret.replace(/\s/g, '').length !== 14) {
        errors.siret = 'Le SIRET doit contenir 14 chiffres';
        isValid = false;
    }

    if (!form.iban?.trim()) {
        errors.iban = 'L\'IBAN est requis';
        isValid = false;
    }

    if (!isValid) {
        formError.value = 'Veuillez corriger les erreurs dans le formulaire';
    }

    return isValid;
}

function validateActivityStep(): boolean {
    let isValid = true;

    if (!form.production_type || form.production_type.length === 0) {
        errors.production_type = 'Veuillez sélectionner au moins un type de production';
        isValid = false;
    }

    if (!isValid) {
        formError.value = 'Veuillez compléter les informations sur votre activité';
    }

    return isValid;
}

function clearErrors() {
    Object.keys(errors).forEach(key => {
        errors[key] = '';
    });
    formError.value = '';
    formErrorDetails.value = '';
}

// Validation SIRET
async function validateSiret() {
    if (!form.siret || form.siret.replace(/\s/g, '').length !== 14) {
        siretValidation.valid = false;
        siretValidation.message = '';
        return;
    }

    siretValidating.value = true;

    try {
        // Simuler une vérification SIRET
        await new Promise(resolve => setTimeout(resolve, 500));

        const cleanSiret = form.siret.replace(/\s/g, '');
        const isValid = /^\d{14}$/.test(cleanSiret);

        siretValidation.valid = isValid;
        siretValidation.message = isValid ? '' : 'Numéro SIRET invalide';
    } finally {
        siretValidating.value = false;
    }
}

// Validation TVA
function validateVat() {
    if (!form.tva_number) {
        vatValidation.valid = false;
        vatValidation.message = '';
        return;
    }

    const vatRegex = /^[A-Z]{2}[0-9A-Z]{2,12}$/;
    const isValid = vatRegex.test(form.tva_number.replace(/\s/g, ''));

    vatValidation.valid = isValid;
    vatValidation.message = isValid ? '' : 'Format de TVA invalide';
}

// Validation IBAN
function validateIban() {
    if (!form.iban) {
        ibanValid.value = false;
        return;
    }

    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
    ibanValid.value = ibanRegex.test(form.iban.replace(/\s/g, ''));
}

// Sauvegarde
async function handleSave() {
    if (!validateStep(currentStep.value)) {
        return;
    }

    try {
        // Transformer les données du formulaire pour correspondre aux types attendus
        const profileData = {
            farm_name: form.farm_name,
            business_name: form.business_name || form.farm_name,
            description: form.description,
            bio: form.bio,
            siret: form.siret,
            tva_number: form.tva_number,
            iban: form.iban,
            farm_size: form.farm_size,
            production_type: form.production_type.length > 0 ? form.production_type[0] : 'conventional' as ProductionType,
            certifications: form.certifications.filter(c => typeof c === 'string' && Object.values(CertificationType).includes(c as CertificationType)) as CertificationType[],
            address: form.address,
            phone: form.phone,
            email: form.email,
            website: form.website
        };

        if (props.mode === 'edit') {
            await store.updateProfile(profileData as ProducerProfileUpdate);
            successMessage.value = 'Profil mis à jour avec succès !';
        } else {
            await store.createProfile(profileData as ProducerProfileCreate);
            successMessage.value = 'Profil créé avec succès !';
        }

        // Redirection après succès
        setTimeout(() => {
            emit('success');
            if (props.mode === 'create') {
                router.push('/producer/dashboard');
            }
        }, 1500);

    } catch (error: unknown) {
        formError.value = 'Une erreur est survenue lors de l\'enregistrement';
        formErrorDetails.value = getErrorMessage(error);

        // Animation d'erreur
        const formElement = document.querySelector('.glass-card');
        if (formElement) {
            formElement.classList.add('animate-shake');
            setTimeout(() => {
                formElement.classList.remove('animate-shake');
            }, 500);
        }
    }
}
</script>

<style scoped>
/* Dégradé organique */
.organic-gradient {
    background: linear-gradient(135deg,
            #f8fafc 0%,
            #f0f9ff 25%,
            #ecfdf5 50%,
            #fef7ff 75%,
            #f8fafc 100%);
    background-size: 400% 400%;
    animation: gradient-shift 20s ease infinite;
}

/* Texture filigrane */
.texture-overlay {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234ade80' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.4;
}

/* Effet glassmorphism */
.glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
        0 8px 32px rgba(31, 38, 135, 0.07),
        0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Animations personnalisées */
@keyframes gradient-shift {
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

@keyframes leaf-float {
    0% {
        transform: translate(var(--start-x), 100vh) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 0.3;
    }

    90% {
        opacity: 0.3;
    }

    100% {
        transform: translate(calc(var(--start-x) + 100px), -100px) rotate(360deg);
        opacity: 0;
    }
}

.leaf-animation {
    position: absolute;
    animation: leaf-float var(--duration) ease-in-out var(--delay) infinite;
    z-index: 0;
}

.leaf-1 {
    --start-x: 10%;
}

.leaf-2 {
    --start-x: 25%;
}

.leaf-3 {
    --start-x: 40%;
}

.leaf-4 {
    --start-x: 55%;
}

.leaf-5 {
    --start-x: 70%;
}

.leaf-6 {
    --start-x: 85%;
}

.leaf-7 {
    --start-x: 20%;
}

.leaf-8 {
    --start-x: 65%;
}

/* Transitions personnalisées */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.form-slide-enter-active {
    animation: slide-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-slide-leave-active {
    animation: slide-out-down 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

@keyframes slide-out-down {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(20px);
    }
}

.animate-slide-in-up {
    animation: slide-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-right {
    animation: slide-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slide-in-right {
    from {
        opacity: 0;
        transform: translateX(20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in-down {
    animation: fade-in-down 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fade-in-down {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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

/* Styles des formulaires */
.form-label {
    display: block;
}

.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
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
    background: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    resize: vertical;
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

.from-primary {
    --tw-gradient-from: #10b981;
}

.to-primary-dark {
    --tw-gradient-to: #059669;
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

.bg-accent-green-light {
    background-color: #d1fae5;
}

.text-accent-green-dark {
    color: #065f46;
}

.back-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.save-button {
    box-shadow:
        0 4px 20px rgba(16, 185, 129, 0.2),
        0 1px 3px rgba(0, 0, 0, 0.1);
}

.save-button:hover {
    box-shadow:
        0 8px 30px rgba(16, 185, 129, 0.3),
        0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>


