<template>
    <div class="producer-profile min-h-screen">
        <!-- Arrière-plan organique avec dégradé et animation -->
        <div class="fixed inset-0 -z-20 bg-gradient-to-br from-forest-20/95 via-cream-30/90 to-terracotta-20/85">
            <div class="absolute inset-0 bg-farm-pattern opacity-5"></div>
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-forest-500/15 to-transparent"></div>
        </div>

        <!-- Navigation supérieure -->
        <nav class="sticky top-0 z-30 backdrop-blur-xl bg-white/85 border-b border-forest-100/30 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <router-link to="/producer/dashboard"
                            class="p-2 rounded-full hover:bg-forest-50 transition-all duration-300 ease-organic">
                            <span class="text-xl">⬅️</span>
                        </router-link>
                        <div>
                            <h1 class="text-2xl lg:text-3xl font-serif font-bold text-forest-800">
                                👨‍🌾 Mon Profil Producteur
                            </h1>
                            <p class="text-sm text-terracotta-600">
                                Gérez votre présence et vos informations professionnelles
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <router-link to="/producer/settings"
                            class="px-5 py-2.5 bg-white text-forest-700 border border-forest-200 rounded-xl shadow-sm hover:shadow-md hover:bg-forest-50 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>⚙️</span>
                            <span>Paramètres</span>
                        </router-link>
                        <button v-if="isEditMode" @click="cancelEditMode"
                            class="px-5 py-2.5 bg-white text-forest-700 border border-forest-200 rounded-xl shadow-sm hover:shadow-md hover:bg-forest-50 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>✖️</span>
                            <span>Annuler</span>
                        </button>
                        <button @click="handlePrimaryAction"
                            class="px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>{{ isEditMode ? '💾' : '✏️' }}</span>
                            <span>{{ isEditMode ? 'Sauvegarder' : 'Modifier le profil' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Section d'en-tête avec photo de couverture -->
            <section class="mb-8 animate-slide-up">
                <div class="relative rounded-2xl overflow-hidden shadow-soft border border-forest-100/30">
                    <!-- Photo de couverture -->
                    <div
                        class="h-48 lg:h-64 bg-gradient-to-r from-forest-400/20 via-forest-300/30 to-terracotta-300/20 relative">
                        <img v-if="profile.banner_url" :src="profile.banner_url" alt="Photo de couverture"
                            class="absolute inset-0 w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-farm-scene opacity-10"></div>
                        <div v-if="!isEditMode" class="absolute bottom-4 right-4">
                            <button @click="changeCoverPhoto"
                                class="px-4 py-2 bg-white/90 backdrop-blur-sm text-forest-700 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2">
                                <span>📷</span>
                                <span>Changer la photo</span>
                            </button>
                        </div>
                    </div>

                    <!-- Photo de profil et informations principales -->
                    <div
                        class="relative px-6 lg:px-8 pb-6 pt-16 bg-gradient-to-b from-white/95 to-white/85 backdrop-blur-sm">
                        <div
                            class="flex flex-col lg:flex-row items-start lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
                            <!-- Photo de profil -->
                            <div class="relative -top-20 lg:-top-24">
                                <div class="relative group">
                                    <div
                                        class="w-40 h-40 lg:w-48 lg:h-48 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-forest-100 to-cream-100 flex items-center justify-center overflow-hidden">
                                        <img v-if="profile.avatar" :src="profile.avatar" alt="Photo de profil"
                                            class="w-full h-full object-cover" />
                                        <span v-else class="text-6xl">👨‍🌾</span>
                                    </div>
                                    <button v-if="!isEditMode" @click="changeAvatar"
                                        class="absolute bottom-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 ease-organic opacity-0 group-hover:opacity-100">
                                        <span class="text-lg">📷</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Informations principales -->
                            <div class="flex-1 space-y-4 lg:pt-6">
                                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <h1 class="text-2xl lg:text-3xl font-serif font-bold text-forest-800">
                                            {{ profile.business_name || 'Profil producteur' }}
                                        </h1>
                                        <p class="text-terracotta-600 mt-1">
                                            Producteur {{ productionTypeLabel }}
                                            <span v-if="profile.farm_size > 0">• {{ profile.farm_size }} hectares</span>
                                        </p>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="px-4 py-2 bg-gradient-to-r from-forest-50 to-cream-50 rounded-xl border border-forest-100">
                                            <div class="flex items-center space-x-2">
                                                <span class="text-lg">⭐</span>
                                                <div>
                                                    <div class="font-bold text-forest-700">{{ profile.rating }}</div>
                                                    <div class="text-xs text-terracotta-600">{{ profile.reviews }} avis
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                                            <div class="flex items-center space-x-2">
                                                <span class="text-lg">{{ profile.verification_status === 'verified' ?
                                                    '✅' : '🔄' }}</span>
                                                <div>
                                                    <div class="font-bold text-green-700">
                                                        {{ profile.verification_status === 'verified' ? 'Vérifié' : 'En attente' }}
                                                    </div>
                                                    <div class="text-xs text-green-600">Statut</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tags et catégories -->
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="cert in profile.certifications" :key="cert"
                                        class="px-3 py-1.5 bg-gradient-to-r from-forest-100 to-forest-50 text-forest-700 rounded-full text-sm font-medium border border-forest-200">
                                        {{ cert }}
                                    </span>
                                    <span
                                        class="px-3 py-1.5 bg-gradient-to-r from-terracotta-100 to-terracotta-50 text-terracotta-700 rounded-full text-sm font-medium border border-terracotta-200">
                                        🌱 {{ productionTypeLabel }}
                                    </span>
                                    <span v-if="profile.farm_size > 0"
                                        class="px-3 py-1.5 bg-gradient-to-r from-cream-100 to-cream-50 text-forest-700 rounded-full text-sm font-medium border border-cream-200">
                                        🏡 {{ profile.farm_size }} hectares
                                    </span>
                                </div>

                                <!-- Actions rapides -->
                                <div class="flex flex-wrap gap-3 pt-2">
                                    <button @click="showProducts = !showProducts"
                                        class="px-4 py-2 bg-white border border-forest-200 rounded-lg hover:bg-forest-50 hover:border-forest-300 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>🥕</span>
                                        <span>{{ profile.products_count }} produits</span>
                                    </button>
                                    <button @click="showReviews = !showReviews"
                                        class="px-4 py-2 bg-white border border-forest-200 rounded-lg hover:bg-forest-50 hover:border-forest-300 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>⭐</span>
                                        <span>{{ profile.reviews }} avis</span>
                                    </button>
                                    <button @click="shareProfile"
                                        class="px-4 py-2 bg-white border border-forest-200 rounded-lg hover:bg-forest-50 hover:border-forest-300 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>📤</span>
                                        <span>Partager</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Grille principale -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Colonne gauche : Informations générales -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Section Bio -->
                    <section class="animate-slide-up" style="animation-delay: 100ms">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                            <div
                                class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <span class="text-xl">📝</span>
                                        <h2 class="text-xl font-serif font-semibold text-forest-800">
                                            Ma présentation
                                        </h2>
                                    </div>
                                    <span class="text-sm text-forest-600">{{ profile.bio.length }}/500 caractères</span>
                                </div>
                            </div>
                            <div class="p-6">
                                <div v-if="!isEditMode" class="prose prose-green max-w-none">
                                    <p class="text-forest-700 leading-relaxed whitespace-pre-line">
                                        {{ profile.bio || "Ajoutez une présentation pour faire connaître votre ferme et votre philosophie..." }}
                                    </p>
                                </div>
                                <div v-else>
                                    <textarea v-model="editableProfile.bio" rows="6" maxlength="500"
                                        class="w-full px-4 py-3 border border-forest-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Parlez de votre ferme, votre philosophie, vos méthodes de production..."></textarea>
                                    <div class="flex justify-between items-center mt-3">
                                        <span class="text-sm text-terracotta-600">
                                            {{ editableProfile.bio.length }}/500 caractères
                                        </span>
                                        <button @click="generateBio"
                                            class="text-sm text-forest-600 hover:text-forest-700 flex items-center space-x-1 transition-colors">
                                            <span>✨</span>
                                            <span>Suggérer une bio</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section Informations légales -->
                    <section class="animate-slide-up" style="animation-delay: 200ms">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                            <div
                                class="bg-gradient-to-r from-forest-50 to-terracotta-50/50 px-6 py-4 border-b border-forest-100/30">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">📄</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Informations légales
                                    </h2>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- SIRET -->
                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>🏢</span>
                                                <span>Numéro SIRET</span>
                                            </span>
                                        </label>
                                        <div v-if="!isEditMode"
                                            class="p-3 bg-forest-50 rounded-lg border border-forest-100">
                                            <div class="font-mono text-forest-800">{{ profile.siret }}</div>
                                        </div>
                                        <input v-else v-model="editableProfile.siret" type="text"
                                            class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
                                            placeholder="123 456 789 00012" />
                                    </div>

                                    <!-- Numéro TVA -->
                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>🧾</span>
                                                <span>Numéro TVA intracommunautaire</span>
                                            </span>
                                        </label>
                                        <div v-if="!isEditMode"
                                            class="p-3 bg-forest-50 rounded-lg border border-forest-100">
                                            <div class="font-mono text-forest-800">{{ profile.tva_number }}</div>
                                        </div>
                                        <input v-else v-model="editableProfile.tva_number" type="text"
                                            class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
                                            placeholder="FRXX 123456789" />
                                    </div>

                                    <!-- IBAN -->
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>🏦</span>
                                                <span>IBAN pour les paiements</span>
                                            </span>
                                        </label>
                                        <div v-if="!isEditMode"
                                            class="p-3 bg-forest-50 rounded-lg border border-forest-100">
                                            <div class="font-mono text-forest-800">{{ profile.iban }}</div>
                                        </div>
                                        <input v-else v-model="editableProfile.iban" type="text"
                                            class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
                                            placeholder="FR76 3000 1000 0100 0000 0000 X99" />
                                        <p v-if="isEditMode" class="mt-2 text-xs text-terracotta-600">
                                            Cet IBAN est utilisé pour les virements lors du paiement de vos produits.
                                            Assurez-vous qu'il est correct.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section Exploitation -->
                    <section class="animate-slide-up" style="animation-delay: 300ms">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                            <div
                                class="bg-gradient-to-r from-cream-50 to-forest-50/50 px-6 py-4 border-b border-forest-100/30">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">🌾</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Mon exploitation
                                    </h2>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Nom de l'exploitation -->
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>🏪</span>
                                                <span>Nom de l'exploitation *</span>
                                            </span>
                                        </label>
                                        <div v-if="!isEditMode"
                                            class="p-3 bg-forest-50 rounded-lg border border-forest-100">
                                            <div class="text-forest-800">
                                                {{ profile.business_name || 'Nom non renseigné' }}
                                            </div>
                                        </div>
                                        <input v-else v-model="editableProfile.business_name" type="text"
                                            class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Ex: Ferme du Soleil Levant" />
                                    </div>

                                    <!-- Type de production -->
                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>🌱</span>
                                                <span>Type de production</span>
                                            </span>
                                        </label>
                                        <div v-if="!isEditMode"
                                            class="p-3 bg-forest-50 rounded-lg border border-forest-100">
                                            <div class="text-forest-800 capitalize">{{ profile.production_type }}</div>
                                        </div>
                                        <select v-else v-model="editableProfile.production_type"
                                            class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                            <option value="organic">Agriculture biologique 🌿</option>
                                            <option value="conventional">Agriculture conventionnelle 🌾</option>
                                            <option value="permaculture">Permaculture 🌳</option>
                                            <option value="biodynamic">Biodynamique ✨</option>
                                            <option value="other">Autre 🍃</option>
                                        </select>
                                    </div>

                                    <!-- Taille de la ferme -->
                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>📏</span>
                                                <span>Superficie de l'exploitation</span>
                                            </span>
                                        </label>
                                        <div v-if="!isEditMode"
                                            class="p-3 bg-forest-50 rounded-lg border border-forest-100">
                                            <div class="text-forest-800">{{ profile.farm_size }} hectares</div>
                                        </div>
                                        <div v-else class="flex items-center space-x-3">
                                            <input v-model.number="editableProfile.farm_size" type="range" min="0.1"
                                                max="1000" step="0.1" class="flex-1 accent-forest-500" />
                                            <div class="w-32">
                                                <input v-model.number="editableProfile.farm_size" type="number"
                                                    min="0.1" max="1000" step="0.1"
                                                    class="w-full px-3 py-2 border border-forest-200 rounded-lg text-center" />
                                                <div class="text-xs text-terracotta-600 text-center mt-1">hectares</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Certifications -->
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>✅</span>
                                                <span>Certifications et labels</span>
                                            </span>
                                        </label>
                                        <div v-if="!isEditMode" class="space-y-3">
                                            <div v-if="profile.certifications.length === 0"
                                                class="text-center py-6 text-terracotta-500">
                                                <span class="text-2xl block mb-2">📋</span>
                                                <p>Aucune certification ajoutée</p>
                                            </div>
                                            <div v-else class="flex flex-wrap gap-2">
                                                <span v-for="cert in profile.certifications" :key="cert"
                                                    class="px-4 py-2 bg-gradient-to-r from-forest-100 to-forest-50 text-forest-700 rounded-lg text-sm font-medium border border-forest-200">
                                                    {{ cert }}
                                                </span>
                                            </div>
                                        </div>
                                        <div v-else class="space-y-4">
                                            <div class="flex flex-wrap gap-2">
                                                <span v-for="(cert, index) in editableProfile.certifications"
                                                    :key="cert"
                                                    class="px-4 py-2 bg-gradient-to-r from-forest-100 to-forest-50 text-forest-700 rounded-lg text-sm font-medium border border-forest-200 flex items-center space-x-2">
                                                    <span>{{ cert }}</span>
                                                    <button @click="removeCertification(index)"
                                                        class="text-terracotta-500 hover:text-terracotta-700">
                                                        ✖️
                                                    </button>
                                                </span>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <input v-model="newCertification" type="text"
                                                    class="flex-1 px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                                                    placeholder="Ajouter une certification (ex: Bio, AOP, etc.)"
                                                    @keyup.enter="addCertification" />
                                                <button @click="addCertification"
                                                    class="px-4 py-2 bg-forest-500 text-white rounded-lg hover:bg-forest-600 transition-colors">
                                                    Ajouter
                                                </button>
                                            </div>
                                            <div class="text-xs text-terracotta-600">
                                                Les certifications renforcent la confiance de vos clients.
                                                Exemples : Agriculture Biologique, Label Rouge, AOP, etc.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Colonne droite : Statistiques et actions -->
                <div class="space-y-8">
                    <!-- Statut de vérification -->
                    <section class="animate-slide-up" style="animation-delay: 400ms">
                        <div
                            class="bg-gradient-to-br from-forest-50 to-cream-50 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                            <div class="flex items-center space-x-3 mb-4">
                                <div class="p-3 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                                    <span class="text-2xl">✅</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-serif font-semibold text-forest-800">
                                        Statut de vérification
                                    </h3>
                                    <p class="text-sm text-terracotta-600">
                                        Votre profil public
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="p-4 bg-white/70 rounded-xl border border-forest-100">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-medium text-forest-700">Profil complet</span>
                                        <span class="text-lg">{{ isProfileComplete ? '✅' : '⚠️' }}</span>
                                    </div>
                                    <div class="text-xs text-terracotta-600">
                                        {{ isProfileComplete ? 'Toutes les informations principales sont renseignées' : 'Certaines informations sont encore manquantes' }}
                                    </div>
                                </div>

                                <div class="p-4 bg-white/70 rounded-xl border border-forest-100">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-medium text-forest-700">Documents légaux</span>
                                        <span class="text-lg">{{ documentsVerified ? '✅' : '⚠️' }}</span>
                                    </div>
                                    <div class="text-xs text-terracotta-600">
                                        {{ documentsCount }} documents téléchargés
                                    </div>
                                    <button v-if="!documentsVerified" @click="goToVerification"
                                        class="mt-3 w-full px-4 py-2 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic">
                                        Vérifier mes documents
                                    </button>
                                </div>

                                <div class="p-4 bg-white/70 rounded-xl border border-forest-100">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-medium text-forest-700">Visibilité</span>
                                        <span class="text-lg">👁️</span>
                                    </div>
                                    <div class="text-xs text-terracotta-600">
                                        Votre profil est visible par les clients
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 pt-6 border-t border-forest-100/50">
                                <div class="text-center">
                                    <div class="text-sm text-forest-700 mb-2">Score de confiance</div>
                                    <div class="text-3xl font-bold text-forest-800 mb-1">{{ confidenceScore }}%</div>
                                    <div class="w-full h-2 bg-forest-100 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-forest-400 to-forest-500 rounded-full transition-all duration-1000 ease-organic"
                                            :style="{ width: `${confidenceScore}%` }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Statistiques rapides -->
                    <section class="animate-slide-up" style="animation-delay: 500ms">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                            <div
                                class="bg-gradient-to-r from-cream-50 to-terracotta-50/50 px-6 py-4 border-b border-forest-100/30">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">📊</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        En un coup d'œil
                                    </h2>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between p-3 bg-forest-50/50 rounded-lg">
                                        <div class="flex items-center space-x-3">
                                            <span class="text-xl">🥕</span>
                                            <div>
                                                <div class="font-medium text-forest-700">Produits actifs</div>
                                                <div class="text-xs text-terracotta-600">Dans votre catalogue</div>
                                            </div>
                                        </div>
                                        <div class="text-xl font-bold text-forest-800">{{ profile.products_count }}
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between p-3 bg-forest-50/50 rounded-lg">
                                        <div class="flex items-center space-x-3">
                                            <span class="text-xl">⭐</span>
                                            <div>
                                                <div class="font-medium text-forest-700">Évaluation moyenne</div>
                                                <div class="text-xs text-terracotta-600">Basé sur {{ profile.reviews }}
                                                    avis</div>
                                            </div>
                                        </div>
                                        <div class="text-xl font-bold text-forest-800">{{ profile.rating }}/5</div>
                                    </div>

                                    <div class="flex items-center justify-between p-3 bg-forest-50/50 rounded-lg">
                                        <div class="flex items-center space-x-3">
                                            <span class="text-xl">📦</span>
                                            <div>
                                                <div class="font-medium text-forest-700">Commandes ce mois</div>
                                                <div class="text-xs text-terracotta-600">Période en cours</div>
                                            </div>
                                        </div>
                                        <div class="text-xl font-bold text-forest-800">{{ ordersThisMonth }}</div>
                                    </div>

                                    <div class="flex items-center justify-between p-3 bg-forest-50/50 rounded-lg">
                                        <div class="flex items-center space-x-3">
                                            <span class="text-xl">👥</span>
                                            <div>
                                                <div class="font-medium text-forest-700">Clients fidèles</div>
                                                <div class="text-xs text-terracotta-600">Acheté 3+ fois</div>
                                            </div>
                                        </div>
                                        <div class="text-xl font-bold text-forest-800">{{ loyalCustomers }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Actions importantes -->
                    <section class="animate-slide-up" style="animation-delay: 600ms">
                        <div
                            class="bg-gradient-to-br from-terracotta-50/50 to-cream-50 backdrop-blur-sm rounded-2xl border border-terracotta-100/30 p-6">
                            <h3
                                class="text-lg font-serif font-semibold text-forest-800 mb-4 flex items-center space-x-2">
                                <span>🚀</span>
                                <span>Améliorez votre profil</span>
                            </h3>

                            <div class="space-y-3">
                                <button @click="addProducts"
                                    class="w-full p-4 bg-white/80 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex items-center space-x-3 group">
                                    <div
                                        class="p-2 bg-gradient-to-br from-forest-100 to-forest-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <span class="text-xl">🥕</span>
                                    </div>
                                    <div class="text-left flex-1">
                                        <div class="font-medium text-forest-800">Ajouter des produits</div>
                                        <div class="text-xs text-terracotta-600">Diversifiez votre offre</div>
                                    </div>
                                    <span class="text-forest-400 group-hover:text-forest-600">➡️</span>
                                </button>

                                <button @click="inviteReviews"
                                    class="w-full p-4 bg-white/80 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex items-center space-x-3 group">
                                    <div
                                        class="p-2 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <span class="text-xl">⭐</span>
                                    </div>
                                    <div class="text-left flex-1">
                                        <div class="font-medium text-forest-800">Demander des avis</div>
                                        <div class="text-xs text-terracotta-600">Renforcez la confiance</div>
                                    </div>
                                    <span class="text-forest-400 group-hover:text-forest-600">➡️</span>
                                </button>

                                <button @click="shareProfile"
                                    class="w-full p-4 bg-white/80 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex items-center space-x-3 group">
                                    <div
                                        class="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <span class="text-xl">📤</span>
                                    </div>
                                    <div class="text-left flex-1">
                                        <div class="font-medium text-forest-800">Partager votre profil</div>
                                        <div class="text-xs text-terracotta-600">Augmentez votre visibilité</div>
                                    </div>
                                    <span class="text-forest-400 group-hover:text-forest-600">➡️</span>
                                </button>

                                <button @click="downloadReport"
                                    class="w-full p-4 bg-white/80 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex items-center space-x-3 group">
                                    <div
                                        class="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <span class="text-xl">📈</span>
                                    </div>
                                    <div class="text-left flex-1">
                                        <div class="font-medium text-forest-800">Télécharger rapport</div>
                                        <div class="text-xs text-terracotta-600">Vos performances détaillées</div>
                                    </div>
                                    <span class="text-forest-400 group-hover:text-forest-600">📥</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Documents légaux (section pleine largeur) -->
            <section class="mt-8 animate-slide-up" style="animation-delay: 700ms">
                <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                    <div
                        class="bg-gradient-to-r from-forest-50 to-terracotta-50 px-6 py-4 border-b border-forest-100/30">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-xl">📑</span>
                                <h2 class="text-xl font-serif font-semibold text-forest-800">
                                    Documents légaux
                                </h2>
                            </div>
                            <span class="text-sm text-forest-600">{{ documentsCount }} documents</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div v-for="doc in documents" :key="doc.id"
                                class="p-4 bg-gradient-to-br from-white to-forest-50 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic group">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="p-2 bg-forest-100 rounded-lg">
                                        <span class="text-xl">{{ doc.type === 'kbis' ? '🏢' : doc.type === 'insurance' ?
                                            '🛡️' : '✅' }}</span>
                                    </div>
                                    <span class="text-xs px-2 py-1 rounded-full"
                                        :class="doc.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                                        {{ doc.verified ? 'Vérifié' : 'En attente' }}
                                    </span>
                                </div>
                                <div class="mb-2">
                                    <div class="font-medium text-forest-800">{{ doc.title }}</div>
                                    <div class="text-xs text-terracotta-600">Ajouté le {{ doc.uploaded_at }}</div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-forest-600">{{ doc.size }}</span>
                                    <div
                                        class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button @click="viewDocument(doc)" class="p-1 hover:bg-forest-50 rounded">
                                            <span>👁️</span>
                                        </button>
                                        <button v-if="!doc.verified" @click="uploadDocument(doc.type)"
                                            class="p-1 hover:bg-forest-50 rounded">
                                            <span>📤</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Bouton ajouter document -->
                            <button @click="addDocument"
                                class="p-6 border-2 border-dashed border-forest-200 rounded-xl hover:border-forest-300 hover:bg-forest-50/50 transition-all duration-300 ease-organic flex flex-col items-center justify-center group">
                                <div
                                    class="p-3 bg-forest-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <span class="text-2xl">➕</span>
                                </div>
                                <div class="text-center">
                                    <div class="font-medium text-forest-700">Ajouter un document</div>
                                    <div class="text-xs text-terracotta-600">KBIS, assurance, certification</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Modal pour ajouter/modifier un document -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-500 ease-organic"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showDocumentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDocumentModal"></div>
                <div class="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 class="text-xl font-serif font-semibold text-forest-800 mb-4 flex items-center space-x-2">
                        <span>📄</span>
                        <span>Ajouter un document</span>
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-forest-700 mb-2">Type de document</label>
                            <select v-model="documentForm.type"
                                class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                <option v-for="option in documentTypeOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-forest-700 mb-2">Fichier</label>
                            <div class="border-2 border-dashed border-forest-200 rounded-xl p-4 bg-forest-25/60">
                                <div class="text-sm text-forest-700">
                                    {{ documentForm.file ? documentForm.file.name : 'Aucun fichier sélectionné' }}
                                </div>
                                <div class="text-xs text-terracotta-600 mt-1">
                                    Formats supportés : PDF, JPG, PNG (max selon backend)
                                </div>
                                <button type="button" @click="triggerDocumentSelection"
                                    class="mt-3 px-4 py-2 bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-all duration-300 ease-organic">
                                    Choisir un fichier
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-forest-100">
                        <button type="button" @click="closeDocumentModal"
                            class="px-4 py-2 text-forest-700 hover:bg-forest-50 rounded-lg transition-all duration-300 ease-organic">
                            Annuler
                        </button>
                        <button type="button" @click="submitDocumentModal"
                            class="px-5 py-2 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic">
                            Téléverser
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <input ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarFileSelected" />
        <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="onCoverFileSelected" />
        <input ref="documentInputRef" type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden"
            @change="onDocumentFileSelected" />

        <!-- Toast de succès -->
        <transition enter-active-class="transition-all duration-500 ease-organic"
            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-500 ease-organic" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4">
            <div v-if="showSuccessToast"
                class="fixed bottom-6 right-6 bg-white border border-forest-200 rounded-xl shadow-xl p-4 max-w-sm animate-slide-up">
                <div class="flex items-center space-x-3">
                    <div class="p-2 bg-forest-100 rounded-lg">
                        <span class="text-xl">✅</span>
                    </div>
                    <div>
                        <p class="font-medium text-forest-700">{{ toastTitle }}</p>
                        <p class="text-sm text-terracotta-600">{{ toastDescription }}</p>
                    </div>
                    <button @click="showSuccessToast = false" class="ml-4 p-1 hover:bg-forest-50 rounded">
                        <span>✖️</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducerStore } from '../stores/useProducerStore'
import { ProducerDocumentService } from '../services'
import { getErrorMessage } from '@/shared/utils/error-handler'

const router = useRouter()
const store = useProducerStore()

// État de l'interface
const isEditMode = ref(false)
const showSuccessToast = ref(false)
const showDocumentModal = ref(false)
const newCertification = ref('')
const showProducts = ref(false)
const showReviews = ref(false)
const toastTitle = ref('Mise à jour effectuée')
const toastDescription = ref('Vos modifications ont été appliquées.')

const avatarInputRef = ref<HTMLInputElement | null>(null)
const coverInputRef = ref<HTMLInputElement | null>(null)
const documentInputRef = ref<HTMLInputElement | null>(null)
type SupportedDocumentType = 'kbis' | 'insurance' | 'certification'
const pendingDocumentType = ref<SupportedDocumentType>('kbis')
const documentForm = reactive({
    type: 'kbis' as SupportedDocumentType,
    file: null as File | null
})
const documentTypeOptions: Array<{ value: SupportedDocumentType; label: string }> = [
    { value: 'kbis', label: 'Extrait K-bis / immatriculation' },
    { value: 'insurance', label: 'Attestation d’assurance' },
    { value: 'certification', label: 'Certification / label' }
]

type ProfileVM = {
    business_name: string
    bio: string
    certifications: string[]
    siret: string
    tva_number: string
    iban: string
    farm_size: number
    production_type: string
    verification_status: string
    rating: number
    reviews: number
    products_count: number
    avatar: string | null
    banner_url: string | null
}

type DocumentVM = {
    id: string
    type: string
    title: string
    verified: boolean
    uploaded_at: string
    size: string
    file_path?: string | null
}

const createEmptyProfile = (): ProfileVM => ({
    business_name: '',
    bio: '',
    certifications: [],
    siret: '',
    tva_number: '',
    iban: '',
    farm_size: 0,
    production_type: '',
    verification_status: 'pending',
    rating: 0,
    reviews: 0,
    products_count: 0,
    avatar: null,
    banner_url: null
})

// Données du profil
const profile = reactive<ProfileVM>(createEmptyProfile())

// Copie éditable pour le mode édition
const editableProfile = reactive<ProfileVM>(createEmptyProfile())

// Documents
const documents = ref<DocumentVM[]>([])

// Computed
const documentsCount = computed(() => documents.value.length)
const documentsVerified = computed(() => documents.value.length > 0 && documents.value.every(doc => doc.verified))

const productionTypeLabels: Record<string, string> = {
    organic: 'Agriculture biologique',
    conventional: 'Agriculture conventionnelle',
    biodynamic: 'Biodynamique',
    permaculture: 'Permaculture',
    hydroponic: 'Hydroponie',
    urban: 'Agriculture urbaine',
    family: 'Ferme familiale',
    cooperative: 'Coopérative',
    specialty: 'Production spécialisée'
}

const productionTypeLabel = computed(() => {
    if (!profile.production_type) return 'Type non renseigné'
    return productionTypeLabels[profile.production_type] || profile.production_type
})

const isProfileComplete = computed(() => {
    return Boolean(
        profile.business_name.trim() &&
        profile.bio.trim() &&
        profile.siret.trim() &&
        profile.iban.trim() &&
        profile.production_type &&
        profile.farm_size > 0
    )
})

const confidenceScore = computed(() => {
    let points = 0
    const max = 7

    if (profile.business_name.trim()) points += 1
    if (profile.bio.trim()) points += 1
    if (profile.siret.trim()) points += 1
    if (profile.iban.trim()) points += 1
    if (profile.production_type) points += 1
    if (profile.farm_size > 0) points += 1
    if (documents.value.length > 0) points += 1

    return Math.round((points / max) * 100)
})

const ordersThisMonth = computed(() => 0)
const loyalCustomers = computed(() => 0)

const certificationLabels: Record<string, string> = {
    ab: 'Agriculture Biologique',
    eu_organic: 'Bio Européen',
    demeter: 'Demeter',
    nature_progres: 'Nature & Progrès',
    hve: 'Haute Valeur Environnementale',
    fairtrade: 'Commerce Équitable',
    local: 'Producteur Local',
    aop: 'AOP',
    aoc: 'AOC',
    igp: 'IGP',
    label_rouge: 'Label Rouge'
}

const documentTitles: Record<string, string> = {
    kbis: 'Extrait K-bis',
    insurance: 'Attestation d’assurance',
    certification: 'Certificat',
    identity: 'Pièce d’identité',
    siret: 'Justificatif SIRET',
    tva: 'Numéro TVA',
    iban: 'RIB / IBAN',
    hygiene: 'Certificat d’hygiène',
    quality: 'Certification qualité',
    other: 'Document'
}

const formatCertification = (value: string) => {
    return certificationLabels[value] || value.replace(/_/g, ' ')
}

const formatFileSize = (sizeInBytes: number) => {
    if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) return '0 KB'
    const kb = sizeInBytes / 1024
    if (kb < 1024) return `${kb.toFixed(0)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
}

const formatDate = (value?: string) => {
    if (!value) return 'Date inconnue'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('fr-FR')
}

const normalizeDocumentType = (value: string): SupportedDocumentType => {
    if (value === 'kbis' || value === 'insurance' || value === 'certification') {
        return value
    }
    if (value === 'identity' || value === 'siret' || value === 'tva' || value === 'iban') {
        return 'kbis'
    }
    return 'certification'
}

const syncEditableProfile = () => {
    Object.assign(editableProfile, profile)
}

const applyRemoteProfile = (remote: any | null) => {
    if (!remote) {
        Object.assign(profile, createEmptyProfile())
        syncEditableProfile()
        return
    }

    const productionTypeValue = Array.isArray(remote.production_type)
        ? (remote.production_type[0] || '')
        : (remote.production_type || '')

    Object.assign(profile, {
        business_name: remote.business_name || '',
        bio: remote.bio || '',
        certifications: Array.isArray(remote.certifications)
            ? remote.certifications.map((cert: string) => formatCertification(cert))
            : [],
        siret: remote.siret || '',
        tva_number: remote.tva_number || '',
        iban: remote.iban || '',
        farm_size: Number(remote.farm_size || 0),
        production_type: productionTypeValue,
        verification_status: remote.verification_status || 'pending',
        rating: Number(remote.rating || 0),
        reviews: Number(remote.review_count || 0),
        products_count: Number(remote.product_count || 0),
        avatar: remote.avatar || remote.logo_url || null,
        banner_url: remote.cover_image || remote.banner_url || null
    })

    syncEditableProfile()
}

const applyRemoteDocuments = (remoteDocuments: any[]) => {
    documents.value = remoteDocuments.map((doc: any) => ({
        id: String(doc.id),
        type: doc.type || 'other',
        title: documentTitles[doc.type] || doc.file_name || 'Document',
        verified: Boolean(doc.verified),
        uploaded_at: formatDate(doc.uploaded_at),
        size: formatFileSize(Number(doc.file_size || 0)),
        file_path: doc.file_path || null
    }))
}

const showToast = (title: string, description: string) => {
    toastTitle.value = title
    toastDescription.value = description
    showSuccessToast.value = true
    setTimeout(() => {
        showSuccessToast.value = false
    }, 3000)
}

const clearFileInput = (inputRef: HTMLInputElement | null) => {
    if (inputRef) inputRef.value = ''
}

const refreshData = async () => {
    try {
        await store.fetchProfile()
        applyRemoteProfile(store.profile as any)
    } catch (error) {
        applyRemoteProfile(null)
        console.warn('Profil producteur introuvable ou non configuré:', error)
    }

    try {
        await store.fetchDocuments()
        applyRemoteDocuments(store.documents as any[])
    } catch (error) {
        documents.value = []
        console.warn('Impossible de charger les documents producteur:', error)
    }
}

// Méthodes
const beginEditMode = () => {
    syncEditableProfile()
    isEditMode.value = true
}

const cancelEditMode = () => {
    syncEditableProfile()
    isEditMode.value = false
    showToast('Modification annulée', 'Le profil est revenu aux dernières données sauvegardées.')
}

const saveProfile = async () => {
    try {
        const normalizedBusinessName = editableProfile.business_name.trim()
        if (normalizedBusinessName.length < 2) {
            showToast('Champ requis', 'Le nom de l’exploitation est obligatoire.')
            return
        }

        const payload: any = {
            business_name: normalizedBusinessName
        }

        const normalizedBio = editableProfile.bio?.trim() || ''
        payload.bio = normalizedBio || null

        const normalizedCertifications = (editableProfile.certifications || [])
            .map(cert => String(cert || '').trim())
            .filter(Boolean)
        payload.certifications = normalizedCertifications.length > 0 ? normalizedCertifications : null

        const normalizedSiret = String(editableProfile.siret || '')
            .replace(/\s+/g, '')
            .trim()
        if (normalizedSiret && !/^\d{9}(\d{5})?$/.test(normalizedSiret)) {
            showToast('SIRET invalide', 'Le SIRET doit contenir 9 ou 14 chiffres.')
            return
        }
        payload.siret = normalizedSiret || null

        const normalizedTva = String(editableProfile.tva_number || '')
            .replace(/\s+/g, '')
            .trim()
            .toUpperCase()
        payload.tva_number = normalizedTva || null

        const normalizedIban = String(editableProfile.iban || '')
            .replace(/\s+/g, '')
            .trim()
            .toUpperCase()
        if (normalizedIban && (normalizedIban.length < 15 || normalizedIban.length > 34)) {
            showToast('IBAN invalide', 'L’IBAN doit contenir entre 15 et 34 caractères.')
            return
        }
        payload.iban = normalizedIban || null

        payload.farm_size = Number.isFinite(editableProfile.farm_size) && editableProfile.farm_size > 0
            ? editableProfile.farm_size
            : null

        const normalizedProductionType = editableProfile.production_type?.trim()
        payload.production_type = normalizedProductionType ? [normalizedProductionType] : null

        // Images de profil / couverture: champs backend uniquement.
        if (editableProfile.avatar) {
            payload.avatar = editableProfile.avatar
        }
        if (editableProfile.banner_url) {
            payload.cover_image = editableProfile.banner_url
        }

        if (store.profile) {
            await store.updateProfile(payload)
        } else {
            await store.createProfile(payload)
        }

        await refreshData()
        isEditMode.value = false
        showToast('Profil mis à jour', 'Les informations ont été sauvegardées.')
    } catch (error: unknown) {
        showToast('Échec de sauvegarde', getErrorMessage(error))
    }
}

const handlePrimaryAction = () => {
    if (isEditMode.value) {
        void saveProfile()
        return
    }
    beginEditMode()
}

const generateBio = () => {
    const suggestions = [
        "Notre ferme familiale cultive des produits sains et savoureux depuis plus de 20 ans. Passionnés par notre métier, nous mettons tout en œuvre pour offrir à nos clients le meilleur de la terre.",
        "Producteurs engagés dans une agriculture respectueuse de l'environnement, nous privilégions les méthodes naturelles et les circuits courts. Nos produits sont cultivés avec amour et expertise.",
        "Bienvenue dans notre exploitation où tradition et innovation se rencontrent. Nous sommes fiers de vous proposer des produits frais, de saison, cultivés avec soin dans le respect de la biodiversité."
    ]
    editableProfile.bio = suggestions[Math.floor(Math.random() * suggestions.length)]
}

const addCertification = () => {
    if (newCertification.value.trim() && !editableProfile.certifications.includes(newCertification.value.trim())) {
        editableProfile.certifications.push(newCertification.value.trim())
        newCertification.value = ''
    }
}

const removeCertification = (index: number) => {
    editableProfile.certifications.splice(index, 1)
}

const changeCoverPhoto = () => {
    coverInputRef.value?.click()
}

const changeAvatar = () => {
    avatarInputRef.value?.click()
}

const onAvatarFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    try {
        if (!file.type.startsWith('image/')) {
            showToast('Format invalide', 'Veuillez sélectionner un fichier image (JPG, PNG, WEBP, GIF).')
            return
        }
        if (file.size > 8 * 1024 * 1024) {
            showToast('Image trop volumineuse', 'La taille maximale autorisée est de 8MB.')
            return
        }

        await ensureProducerProfile()
        const updatedProfile = await store.uploadAvatar(file)
        applyRemoteProfile(updatedProfile as any)

        showToast('Photo mise à jour', 'La photo de profil a été appliquée.')
    } catch (error: unknown) {
        showToast('Erreur photo', getErrorMessage(error))
    } finally {
        clearFileInput(input)
    }
}

const onCoverFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    try {
        if (!file.type.startsWith('image/')) {
            showToast('Format invalide', 'Veuillez sélectionner un fichier image (JPG, PNG, WEBP, GIF).')
            return
        }
        if (file.size > 8 * 1024 * 1024) {
            showToast('Image trop volumineuse', 'La taille maximale autorisée est de 8MB.')
            return
        }

        await ensureProducerProfile()
        const updatedProfile = await store.uploadCoverImage(file)
        applyRemoteProfile(updatedProfile as any)

        showToast('Couverture mise à jour', 'La photo de couverture a été appliquée.')
    } catch (error: unknown) {
        showToast('Erreur couverture', getErrorMessage(error))
    } finally {
        clearFileInput(input)
    }
}

const shareProfile = async () => {
    const url = window.location.href
    const title = profile.business_name || 'Profil producteur'
    const text = profile.business_name
        ? `Découvrez ${profile.business_name} sur Marché Local`
        : 'Découvrez ce profil producteur sur Marché Local'

    try {
        if (navigator.share) {
            await navigator.share({ title, text, url })
            showToast('Partage effectué', 'Le profil a été partagé.')
            return
        }

        await navigator.clipboard.writeText(url)
        showToast('Lien copié', 'Le lien du profil a été copié dans le presse-papiers.')
    } catch (error: unknown) {
        showToast('Partage indisponible', getErrorMessage(error))
    }
}

const goToVerification = () => {
    router.push('/producer/verification')
}

const addProducts = () => {
    router.push('/producer/products/new')
}

const inviteReviews = () => {
    showToast('Fonction à venir', 'L’invitation aux avis sera disponible prochainement.')
}

const downloadReport = () => {
    showToast('Fonction à venir', 'Le rapport producteur sera disponible prochainement.')
}

const resetDocumentModal = () => {
    documentForm.type = 'kbis'
    documentForm.file = null
}

const resolveFallbackBusinessName = () => {
    const fromEditable = editableProfile.business_name?.trim()
    if (fromEditable && fromEditable.length >= 2) return fromEditable

    const fromProfile = profile.business_name?.trim()
    if (fromProfile && fromProfile.length >= 2) return fromProfile

    return 'Mon exploitation'
}

const ensureProducerProfile = async () => {
    if (store.profile) return

    try {
        await store.fetchProfile()
        if (store.profile) return
    } catch {
        // Profil absent: création minimale pour débloquer le téléversement.
    }

    await store.createProfile({
        business_name: resolveFallbackBusinessName(),
        bio: (editableProfile.bio || profile.bio || '').trim()
    } as any)

    await store.fetchProfile()
    applyRemoteProfile(store.profile as any)
}

const addDocument = () => {
    resetDocumentModal()
    showDocumentModal.value = true
}

const closeDocumentModal = () => {
    resetDocumentModal()
    showDocumentModal.value = false
}

const triggerDocumentSelection = () => {
    pendingDocumentType.value = documentForm.type
    documentInputRef.value?.click()
}

const uploadSelectedDocument = async (file: File, type: SupportedDocumentType) => {
    await ensureProducerProfile()

    await store.uploadDocument({
        type,
        file
    } as any)

    await store.fetchDocuments()
    applyRemoteDocuments(store.documents as any[])

    showToast('Document téléversé', `Le document "${file.name}" a bien été ajouté.`)
}

const viewDocument = (doc: any) => {
    if (!doc?.id) {
        showToast('Document invalide', 'Aucun identifiant de document trouvé.')
        return
    }

    ProducerDocumentService.getDocumentPreview(doc.id)
        .then((result) => {
            if (result?.preview_url) {
                window.open(result.preview_url, '_blank', 'noopener,noreferrer')
                return
            }
            showToast('Prévisualisation indisponible', 'Impossible d’ouvrir ce document.')
        })
        .catch(async () => {
            try {
                const blob = await ProducerDocumentService.downloadDocument(doc.id)
                const blobUrl = URL.createObjectURL(blob)
                window.open(blobUrl, '_blank', 'noopener,noreferrer')
            } catch (error: unknown) {
                showToast('Erreur document', getErrorMessage(error))
            }
        })
}

const uploadDocument = (type: string) => {
    pendingDocumentType.value = normalizeDocumentType(type)
    documentInputRef.value?.click()
}

const onDocumentFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    try {
        if (showDocumentModal.value) {
            documentForm.file = file
            return
        }

        await uploadSelectedDocument(file, pendingDocumentType.value)
    } catch (error: unknown) {
        showToast('Erreur de téléversement', getErrorMessage(error))
    } finally {
        clearFileInput(input)
    }
}

const submitDocumentModal = async () => {
    if (!documentForm.file) {
        showToast('Fichier manquant', 'Sélectionnez un document PDF/JPG/PNG avant de téléverser.')
        return
    }

    try {
        await uploadSelectedDocument(documentForm.file, documentForm.type)
        closeDocumentModal()
    } catch (error: unknown) {
        showToast('Erreur de téléversement', getErrorMessage(error))
    }
}

onMounted(() => {
    refreshData()
})
</script>

<style scoped>
/* Animation personnalisée */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-5px) rotate(0.5deg);
    }
}

/* Classes d'animation */
.animate-slide-up {
    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Courbe de bézier organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Pattern de ferme en filigrane */
.bg-farm-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 30c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm100 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zM30 100c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16zm128 0c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16-16-7.163-16-16zM50 170c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm100 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z' fill='%233a7d34' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Scène de ferme pour la photo de couverture */
.bg-farm-scene {
    background-image: url("data:image/svg+xml,%3Csvg width='400' height='200' viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 150 Q100 130 200 150 T400 150 L400 200 L0 200 Z' fill='%2364aa64' fill-opacity='0.1'/%3E%3Cpath d='M50 120 Q150 100 250 120 T350 120' stroke='%23eb9e69' stroke-width='2' stroke-opacity='0.1' fill='none'/%3E%3Ccircle cx='100' cy='80' r='15' fill='%23a2cca2' fill-opacity='0.1'/%3E%3Ccircle cx='300' cy='90' r='20' fill='%23a2cca2' fill-opacity='0.1'/%3E%3C/svg%3E");
}

/* Palette de couleurs étendue */
.text-forest-20 {
    color: #fdfdfd;
}

.bg-forest-20 {
    background-color: #fdfdfd;
}

.text-forest-25 {
    color: #f7faf7;
}

.bg-forest-25 {
    background-color: #f7faf7;
}

.text-forest-50 {
    color: #f0f7f0;
}

.bg-forest-50 {
    background-color: #f0f7f0;
}

.text-forest-100 {
    color: #e0eee0;
}

.bg-forest-100 {
    background-color: #e0eee0;
}

.text-forest-200 {
    color: #c1ddc1;
}

.bg-forest-200 {
    background-color: #c1ddc1;
}

.text-forest-300 {
    color: #a2cca2;
}

.bg-forest-300 {
    background-color: #a2cca2;
}

.text-forest-400 {
    color: #83bb83;
}

.bg-forest-400 {
    background-color: #83bb83;
}

.text-forest-500 {
    color: #64aa64;
}

.bg-forest-500 {
    background-color: #64aa64;
}

.text-forest-600 {
    color: #508850;
}

.bg-forest-600 {
    background-color: #508850;
}

.text-forest-700 {
    color: #3c663c;
}

.bg-forest-700 {
    background-color: #3c663c;
}

.text-forest-800 {
    color: #284428;
}

.bg-forest-800 {
    background-color: #284428;
}

.text-cream-30 {
    color: #fffefb;
}

.bg-cream-30 {
    background-color: #fffefb;
}

.text-cream-50 {
    color: #fefaf0;
}

.bg-cream-50 {
    background-color: #fefaf0;
}

.text-cream-100 {
    color: #fdf5e1;
}

.bg-cream-100 {
    background-color: #fdf5e1;
}

.text-cream-200 {
    color: #fbebc3;
}

.bg-cream-200 {
    background-color: #fbebc3;
}

.text-terracotta-20 {
    color: #fefcfb;
}

.bg-terracotta-20 {
    background-color: #fefcfb;
}

.text-terracotta-50 {
    color: #fdf5f0;
}

.bg-terracotta-50 {
    background-color: #fdf5f0;
}

.text-terracotta-100 {
    color: #fbebe1;
}

.bg-terracotta-100 {
    background-color: #fbebe1;
}

.text-terracotta-200 {
    color: #f7d8c3;
}

.bg-terracotta-200 {
    background-color: #f7d8c3;
}

.text-terracotta-300 {
    color: #f3c4a5;
}

.bg-terracotta-300 {
    background-color: #f3c4a5;
}

.text-terracotta-400 {
    color: #efb187;
}

.bg-terracotta-400 {
    background-color: #efb187;
}

.text-terracotta-500 {
    color: #eb9e69;
}

.bg-terracotta-500 {
    background-color: #eb9e69;
}

.text-terracotta-600 {
    color: #bc7e54;
}

.bg-terracotta-600 {
    background-color: #bc7e54;
}

.text-terracotta-700 {
    color: #8d5f3f;
}

.bg-terracotta-700 {
    background-color: #8d5f3f;
}

/* Ombres douces */
.shadow-soft {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Animation d'arrière-plan subtile */
.producer-profile::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 15% 20%, rgba(100, 170, 100, 0.05) 0%, transparent 25%),
        radial-gradient(circle at 85% 80%, rgba(235, 158, 105, 0.03) 0%, transparent 25%);
    animation: float 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: -15;
}

/* Scrollbar personnalisée */
.producer-profile ::-webkit-scrollbar {
    width: 6px;
}

.producer-profile ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
}

.producer-profile ::-webkit-scrollbar-thumb {
    background: rgba(100, 170, 100, 0.3);
    border-radius: 10px;
}

.producer-profile ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 170, 100, 0.5);
}

/* Styles pour les textareas et inputs */
.prose-green {
    color: #3c663c;
}

.prose-green p {
    margin-bottom: 1em;
    line-height: 1.6;
}

/* Effets de survol spéciaux */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Transition pour les routes */
.router-view-transition-enter-active,
.router-view-transition-leave-active {
    transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.router-view-transition-enter-from,
.router-view-transition-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* Styles pour les états désactivés */
input:disabled,
textarea:disabled,
select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Amélioration de l'accessibilité focus */
*:focus {
    outline: 2px solid rgba(100, 170, 100, 0.5);
    outline-offset: 2px;
}

/* Styles pour les états de validation */
input:invalid,
textarea:invalid {
    border-color: #efb187;
}

input:valid,
textarea:valid {
    border-color: #a2cca2;
}
</style>
