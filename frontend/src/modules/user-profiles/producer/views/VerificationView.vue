<template>
    <div class="verification-view min-h-screen">
        <!-- Arrière-plan organique avec dégradé et animation -->
        <div class="fixed inset-0 -z-20 bg-gradient-to-br from-forest-20/95 via-cream-30/90 to-terracotta-20/85">
            <div class="absolute inset-0 bg-document-pattern opacity-5"></div>
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-forest-500/10 to-transparent"></div>
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
                                ✅ Vérification du producteur
                            </h1>
                            <p class="text-sm text-terracotta-600">
                                Sécurisez votre compte et renforcez la confiance de vos clients
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <router-link to="/producer/settings"
                            class="px-4 py-3 bg-white text-forest-700 border border-forest-200 rounded-xl shadow-sm hover:shadow-md hover:bg-forest-50 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>⚙️</span>
                            <span class="hidden sm:inline">Paramètres</span>
                        </router-link>
                        <button v-if="verificationStatus === 'pending' && allDocumentsUploaded" @click="submitVerification"
                            :disabled="isSubmitting"
                            class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isSubmitting" class="flex items-center space-x-2">
                                <span class="animate-spin">🔄</span>
                                <span>Soumission...</span>
                            </span>
                            <span v-else class="flex items-center space-x-2">
                                <span>📤</span>
                                <span>Soumettre à vérification</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Bannière de statut -->
            <section class="mb-8 animate-slide-up">
                <div class="relative overflow-hidden rounded-2xl shadow-soft border border-forest-100/30">
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-forest-400/20 via-cream-300/30 to-terracotta-300/20">
                    </div>

                    <div class="relative bg-white/95 backdrop-blur-sm p-6 lg:p-8">
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div class="flex-1">
                                <div class="flex items-center space-x-3 mb-4">
                                    <div class="p-3 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                                        <span class="text-2xl">
                                            {{ verificationStatus === 'verified' ? '✅' : verificationStatus ===
                                                'pending' ? '🔄' : '⚠️' }}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-serif font-semibold text-forest-800">
                                            {{ statusTitle }}
                                        </h2>
                                        <p class="text-terracotta-600">
                                            {{ statusDescription }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Barre de progression -->
                                <div class="mb-6">
                                    <div class="flex justify-between text-sm text-forest-600 mb-2">
                                        <span>Progression de la vérification</span>
                                        <span>{{ verificationProgress }}%</span>
                                    </div>
                                    <div class="w-full h-3 bg-forest-100 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-forest-400 via-forest-500 to-forest-600 rounded-full transition-all duration-1000 ease-organic"
                                            :style="{ width: verificationProgress + '%' }"></div>
                                    </div>
                                </div>

                                <!-- Éléments de vérification -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div v-for="item in verificationItems" :key="item.id"
                                        class="flex items-center space-x-3 p-3 bg-forest-50/50 rounded-lg"
                                        :class="{ 'bg-green-50/50': item.completed }">
                                        <span class="text-lg">{{ item.completed ? '✅' : item.icon }}</span>
                                        <span class="text-sm font-medium text-forest-700">{{ item.label }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Badge de vérification -->
                            <div class="text-center">
                                <div class="inline-block p-4 rounded-2xl shadow-lg" :class="verificationStatus === 'verified'
                                    ? 'bg-gradient-to-br from-green-100 to-green-50 border border-green-200'
                                    : 'bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200'">
                                    <div class="text-4xl mb-2">
                                        {{ verificationStatus === 'verified' ? '🏆' : '🛡️' }}
                                    </div>
                                    <div class="font-bold text-lg"
                                        :class="verificationStatus === 'verified' ? 'text-green-700' : 'text-yellow-700'">
                                        {{ verificationStatus === 'verified' ? 'PRODUCTEUR VÉRIFIÉ' : 'EN VÉRIFICATION'
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Grille principale -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Colonne gauche : Documents légaux -->
                <div class="lg:col-span-2">
                    <!-- Section Documents requis -->
                    <section class="mb-8 animate-slide-up" style="animation-delay: 100ms">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                            <div
                                class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <span class="text-xl">📑</span>
                                        <h2 class="text-xl font-serif font-semibold text-forest-800">
                                            Documents légaux requis
                                        </h2>
                                    </div>
                                    <span class="text-sm text-forest-600">{{ completedDocuments }}/{{ totalDocuments }}
                                        complétés</span>
                                </div>
                            </div>
                            <div class="p-6">
                                <!-- KBIS / Extrait d'immatriculation -->
                                <div class="mb-6 pb-6 border-b border-forest-100">
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                                                <span class="text-xl">🏢</span>
                                            </div>
                                            <div>
                                                <h3 class="font-serif font-semibold text-forest-800">Extrait K-bis /
                                                    Immatriculation</h3>
                                                <p class="text-sm text-terracotta-600">
                                                    Document officiel prouvant l'existence légale de votre entreprise
                                                </p>
                                            </div>
                                        </div>
                                        <span class="px-3 py-1 rounded-full text-sm font-medium"
                                            :class="documents.kbis.verified ? 'bg-green-100 text-green-700' : documents.kbis.uploaded ? 'bg-yellow-100 text-yellow-700' : 'bg-terracotta-100 text-terracotta-700'">
                                            {{ documents.kbis.verified ? 'Vérifié' : documents.kbis.uploaded ? 'En attente' : 'Manquant' }}
                                        </span>
                                    </div>

                                    <div v-if="documents.kbis.uploaded" class="space-y-4">
                                        <div class="flex items-center justify-between p-4 bg-forest-50/50 rounded-xl">
                                            <div class="flex items-center space-x-3">
                                                <span class="text-2xl">📄</span>
                                                <div>
                                                    <div class="font-medium text-forest-800">{{ documents.kbis.fileName
                                                    }}</div>
                                                    <div class="text-sm text-terracotta-600">
                                                        Téléversé le {{ documents.kbis.uploadDate }} • {{
                                                            documents.kbis.fileSize }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <button @click="viewDocument('kbis')"
                                                    class="p-2 hover:bg-white rounded-lg transition-colors"
                                                    title="Voir le document">
                                                    <span>👁️</span>
                                                </button>
                                                <button @click="replaceDocument('kbis')"
                                                    class="p-2 hover:bg-white rounded-lg transition-colors"
                                                    title="Remplacer le document">
                                                    <span>🔄</span>
                                                </button>
                                                <button v-if="!documents.kbis.verified"
                                                    @click="downloadTemplate('kbis')"
                                                    class="px-4 py-2 bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-colors text-sm">
                                                    <span>📥</span>
                                                    <span class="hidden sm:inline ml-1">Modèle</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div v-if="!documents.kbis.verified"
                                            class="p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
                                            <div class="flex items-start space-x-3">
                                                <span class="text-lg">⏳</span>
                                                <div>
                                                    <div class="font-medium text-yellow-800">En attente de vérification
                                                    </div>
                                                    <div class="text-sm text-yellow-600">
                                                        Notre équipe examine votre document. Vous serez notifié par
                                                        email une fois vérifié.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-else>
                                        <div
                                            class="p-6 text-center border-2 border-dashed border-forest-200 rounded-xl hover:border-forest-300 hover:bg-forest-50/50 transition-all duration-300 ease-organic">
                                            <div class="text-4xl mb-3">📄</div>
                                            <h4 class="font-medium text-forest-800 mb-2">Document manquant</h4>
                                            <p class="text-sm text-terracotta-600 mb-4">
                                                Téléversez votre extrait K-bis ou document d'immatriculation
                                            </p>
                                            <div class="flex flex-wrap justify-center gap-3">
                                                <button @click="uploadDocument('kbis')"
                                                    class="px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2">
                                                    <span>📤</span>
                                                    <span>Téléverser</span>
                                                </button>
                                                <button @click="downloadTemplate('kbis')"
                                                    class="px-5 py-2.5 bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-all duration-300 ease-organic flex items-center space-x-2">
                                                    <span>📥</span>
                                                    <span>Télécharger le modèle</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Assurance responsabilité civile -->
                                <div class="mb-6 pb-6 border-b border-forest-100">
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                                                <span class="text-xl">🛡️</span>
                                            </div>
                                            <div>
                                                <h3 class="font-serif font-semibold text-forest-800">Assurance
                                                    responsabilité civile</h3>
                                                <p class="text-sm text-terracotta-600">
                                                    Attestation d'assurance couvrant votre activité de production et
                                                    vente
                                                </p>
                                            </div>
                                        </div>
                                        <span class="px-3 py-1 rounded-full text-sm font-medium"
                                            :class="documents.insurance.verified ? 'bg-green-100 text-green-700' : documents.insurance.uploaded ? 'bg-yellow-100 text-yellow-700' : 'bg-terracotta-100 text-terracotta-700'">
                                            {{ documents.insurance.verified ? 'Vérifié' : documents.insurance.uploaded ?
                                                'En attente' : 'Manquant' }}
                                        </span>
                                    </div>

                                    <div v-if="documents.insurance.uploaded" class="space-y-4">
                                        <div class="flex items-center justify-between p-4 bg-forest-50/50 rounded-xl">
                                            <div class="flex items-center space-x-3">
                                                <span class="text-2xl">📄</span>
                                                <div>
                                                    <div class="font-medium text-forest-800">{{
                                                        documents.insurance.fileName }}</div>
                                                    <div class="text-sm text-terracotta-600">
                                                        Téléversé le {{ documents.insurance.uploadDate }} • {{
                                                            documents.insurance.fileSize }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <button @click="viewDocument('insurance')"
                                                    class="p-2 hover:bg-white rounded-lg transition-colors">
                                                    <span>👁️</span>
                                                </button>
                                                <button @click="replaceDocument('insurance')"
                                                    class="p-2 hover:bg-white rounded-lg transition-colors">
                                                    <span>🔄</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div v-if="!documents.insurance.verified"
                                            class="p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
                                            <div class="flex items-start space-x-3">
                                                <span class="text-lg">⏳</span>
                                                <div>
                                                    <div class="font-medium text-yellow-800">En attente de vérification
                                                    </div>
                                                    <div class="text-sm text-yellow-600">
                                                        Vérifiez que l'attestation est valide et à jour.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-else>
                                        <div
                                            class="p-6 text-center border-2 border-dashed border-forest-200 rounded-xl hover:border-forest-300 hover:bg-forest-50/50 transition-all duration-300 ease-organic">
                                            <div class="text-4xl mb-3">🛡️</div>
                                            <h4 class="font-medium text-forest-800 mb-2">Assurance manquante</h4>
                                            <p class="text-sm text-terracotta-600 mb-4">
                                                Téléversez votre attestation d'assurance responsabilité civile
                                            </p>
                                            <button @click="uploadDocument('insurance')"
                                                class="px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2 mx-auto">
                                                <span>📤</span>
                                                <span>Téléverser l'attestation</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Certifications spécifiques -->
                                <div>
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                                                <span class="text-xl">🏅</span>
                                            </div>
                                            <div>
                                                <h3 class="font-serif font-semibold text-forest-800">Certifications
                                                    (optionnel)</h3>
                                                <p class="text-sm text-terracotta-600">
                                                    Certifications de qualité : Bio, Label Rouge, AOP, etc.
                                                </p>
                                            </div>
                                        </div>
                                        <span class="px-3 py-1 rounded-full text-sm font-medium"
                                            :class="certifications.length > 0 ? 'bg-green-100 text-green-700' : 'bg-forest-100 text-forest-700'">
                                            {{ certifications.length > 0 ? `${certifications.length} ajoutées` :
                                                'Optionnel' }}
                                        </span>
                                    </div>

                                    <div v-if="certifications.length > 0" class="space-y-4">
                                        <div v-for="cert in certifications" :key="cert.id"
                                            class="flex items-center justify-between p-4 bg-forest-50/50 rounded-xl">
                                            <div class="flex items-center space-x-3">
                                                <span class="text-2xl">{{ cert.type === 'bio' ? '🌿' : cert.type ===
                                                    'label' ? '🏅' : '✅' }}</span>
                                                <div>
                                                    <div class="font-medium text-forest-800">{{ cert.name }}</div>
                                                    <div class="text-sm text-terracotta-600">
                                                        N° {{ cert.certificateNumber }} • Valide jusqu'au {{
                                                            cert.validUntil }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <button @click="viewCertification(cert)"
                                                    class="p-2 hover:bg-white rounded-lg transition-colors">
                                                    <span>👁️</span>
                                                </button>
                                                <button @click="editCertification(cert)"
                                                    class="p-2 hover:bg-white rounded-lg transition-colors">
                                                    <span>✏️</span>
                                                </button>
                                            </div>
                                        </div>

                                        <button @click="addCertification"
                                            class="w-full p-4 border-2 border-dashed border-forest-200 rounded-xl hover:border-forest-300 hover:bg-forest-50/50 transition-all duration-300 ease-organic flex items-center justify-center space-x-2">
                                            <span class="text-xl">➕</span>
                                            <span class="font-medium text-forest-700">Ajouter une certification</span>
                                        </button>
                                    </div>

                                    <div v-else>
                                        <div
                                            class="p-6 text-center border-2 border-dashed border-forest-200 rounded-xl hover:border-forest-300 hover:bg-forest-50/50 transition-all duration-300 ease-organic">
                                            <div class="text-4xl mb-3">🏅</div>
                                            <h4 class="font-medium text-forest-800 mb-2">Renforcez votre crédibilité
                                            </h4>
                                            <p class="text-sm text-terracotta-600 mb-4">
                                                Ajoutez vos certifications pour augmenter la confiance de vos clients
                                            </p>
                                            <button @click="addCertification"
                                                class="px-5 py-2.5 bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-all duration-300 ease-organic flex items-center space-x-2 mx-auto">
                                                <span>➕</span>
                                                <span>Ajouter une certification</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section Informations complémentaires -->
                    <section class="animate-slide-up" style="animation-delay: 200ms">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                            <div
                                class="bg-gradient-to-r from-cream-50 to-forest-50 px-6 py-4 border-b border-forest-100/30">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">ℹ️</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Informations complémentaires
                                    </h2>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            <span class="inline-flex items-center space-x-1">
                                                <span>👥</span>
                                                <span>Type d'exploitation</span>
                                            </span>
                                        </label>
                                        <select v-model="additionalInfo.farmType"
                                            class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                            <option value="organic">Agriculture biologique</option>
                                            <option value="conventional">Agriculture conventionnelle</option>
                                            <option value="permaculture">Permaculture</option>
                                            <option value="biodynamic">Biodynamique</option>
                                            <option value="hydroponic">Hydroponie</option>
                                            <option value="urban">Agriculture urbaine</option>
                                            <option value="family">Ferme familiale</option>
                                            <option value="cooperative">Coopérative</option>
                                            <option value="specialty">Production spécialisée</option>
                                        </select>
                                        <p class="mt-2 text-xs text-terracotta-600">
                                            Ce champ est enregistré dans votre profil producteur.
                                        </p>
                                    </div>
                                </div>

                                <div class="mt-6 pt-6 border-t border-forest-100 flex justify-end gap-3">
                                    <button @click="resetAdditionalInfo"
                                        class="px-5 py-2.5 bg-white border border-forest-200 text-forest-700 rounded-lg hover:bg-forest-50 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>↩️</span>
                                        <span>Annuler</span>
                                    </button>
                                    <button @click="saveAdditionalInfo"
                                        class="px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>💾</span>
                                        <span>Enregistrer les informations</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Colonne droite : Guide et avantages -->
                <div class="space-y-8">
                    <!-- Avantages de la vérification -->
                    <section class="animate-slide-up" style="animation-delay: 300ms">
                        <div
                            class="bg-gradient-to-br from-forest-50 to-green-50/50 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                            <div class="flex items-center space-x-3 mb-4">
                                <div class="p-2 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                                    <span class="text-xl">🏆</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-serif font-semibold text-forest-800">
                                        Avantages du statut vérifié
                                    </h3>
                                    <p class="text-sm text-terracotta-600">
                                        Pourquoi devenir producteur vérifié ?
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="flex items-start space-x-3 p-3 bg-white/70 rounded-xl">
                                    <div class="p-1.5 bg-green-100 rounded-lg">
                                        <span class="text-lg">🤝</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-800">Confiance accrue</div>
                                        <div class="text-xs text-terracotta-600">
                                            Les clients font 3x plus confiance aux producteurs vérifiés
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-start space-x-3 p-3 bg-white/70 rounded-xl">
                                    <div class="p-1.5 bg-blue-100 rounded-lg">
                                        <span class="text-lg">📈</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-800">Visibilité améliorée</div>
                                        <div class="text-xs text-terracotta-600">
                                            Mise en avant dans les résultats de recherche
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-start space-x-3 p-3 bg-white/70 rounded-xl">
                                    <div class="p-1.5 bg-purple-100 rounded-lg">
                                        <span class="text-lg">🛡️</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-800">Protection renforcée</div>
                                        <div class="text-xs text-terracotta-600">
                                            Accès à des options de paiement sécurisées
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-start space-x-3 p-3 bg-white/70 rounded-xl">
                                    <div class="p-1.5 bg-yellow-100 rounded-lg">
                                        <span class="text-lg">⭐</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-forest-800">Badge exclusif</div>
                                        <div class="text-xs text-terracotta-600">
                                            Badge "Vérifié" visible sur votre profil et produits
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Guide de vérification -->
                    <section class="animate-slide-up" style="animation-delay: 400ms">
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                            <div
                                class="bg-gradient-to-r from-cream-50 to-terracotta-50/50 px-6 py-4 border-b border-forest-100/30">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">📋</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Étapes de vérification
                                    </h2>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="space-y-6">
                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0">
                                            <div
                                                class="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center text-white font-bold">
                                                1
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-medium text-forest-800 mb-1">Complétez votre profil</div>
                                            <div class="text-sm text-terracotta-600">
                                                Toutes les informations doivent être à jour
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0">
                                            <div
                                                class="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center text-white font-bold">
                                                2
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-medium text-forest-800 mb-1">Téléversez vos documents</div>
                                            <div class="text-sm text-terracotta-600">
                                                KBIS, assurance et éventuellement certifications
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0">
                                            <div
                                                class="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center text-white font-bold">
                                                3
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-medium text-forest-800 mb-1">Soumettez à vérification</div>
                                            <div class="text-sm text-terracotta-600">
                                                Notre équipe examine votre dossier sous 48h
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0">
                                            <div
                                                class="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center text-white font-bold">
                                                4
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-medium text-forest-800 mb-1">Recevez votre badge</div>
                                            <div class="text-sm text-terracotta-600">
                                                Statut vérifié et tous ses avantages
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-6 pt-6 border-t border-forest-100">
                                    <div class="text-center">
                                        <div class="text-sm text-forest-700 mb-2">Délai moyen de traitement</div>
                                        <div class="text-2xl font-bold text-forest-800 mb-1">24-48h</div>
                                        <div class="text-xs text-terracotta-600">
                                            Notre équipe travaille du lundi au vendredi
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Support et assistance -->
                    <section class="animate-slide-up" style="animation-delay: 500ms">
                        <div
                            class="bg-gradient-to-br from-terracotta-50/50 to-cream-50 backdrop-blur-sm rounded-2xl border border-terracotta-100/30 p-6">
                            <h3
                                class="text-lg font-serif font-semibold text-forest-800 mb-4 flex items-center space-x-2">
                                <span>🤝</span>
                                <span>Besoin d'aide ?</span>
                            </h3>

                            <div class="space-y-4">
                                <button @click="openHelpModal"
                                    class="w-full p-4 bg-white/80 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex items-center space-x-3 group">
                                    <div
                                        class="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <span class="text-xl">❓</span>
                                    </div>
                                    <div class="text-left flex-1">
                                        <div class="font-medium text-forest-800">Questions fréquentes</div>
                                        <div class="text-xs text-terracotta-600">Trouvez des réponses rapides</div>
                                    </div>
                                    <span class="text-forest-400 group-hover:text-forest-600">➡️</span>
                                </button>

                                <button @click="contactSupport"
                                    class="w-full p-4 bg-white/80 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex items-center space-x-3 group">
                                    <div
                                        class="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <span class="text-xl">💬</span>
                                    </div>
                                    <div class="text-left flex-1">
                                        <div class="font-medium text-forest-800">Contacter le support</div>
                                        <div class="text-xs text-terracotta-600">Notre équipe vous répond sous 24h</div>
                                    </div>
                                    <span class="text-forest-400 group-hover:text-forest-600">➡️</span>
                                </button>

                                <button @click="downloadChecklist"
                                    class="w-full p-4 bg-white/80 border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex items-center space-x-3 group">
                                    <div
                                        class="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg group-hover:scale-110 transition-transform">
                                        <span class="text-xl">📋</span>
                                    </div>
                                    <div class="text-left flex-1">
                                        <div class="font-medium text-forest-800">Liste de vérification</div>
                                        <div class="text-xs text-terracotta-600">Téléchargez le guide complet</div>
                                    </div>
                                    <span class="text-forest-400 group-hover:text-forest-600">📥</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Confidentialité et sécurité -->
            <section class="mt-8 animate-slide-up" style="animation-delay: 600ms">
                <div
                    class="bg-gradient-to-r from-forest-50/50 to-cream-50/50 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                            <span class="text-xl">🔒</span>
                        </div>
                        <div>
                            <h3 class="text-lg font-serif font-semibold text-forest-800">
                                Confidentialité et sécurité
                            </h3>
                            <p class="text-sm text-terracotta-600">
                                Vos données sont protégées
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="p-4 bg-white/70 rounded-xl">
                            <div class="text-2xl mb-2">🔐</div>
                            <div class="font-medium text-forest-700 mb-2">Chiffrement SSL</div>
                            <div class="text-sm text-terracotta-600">
                                Tous les documents sont chiffés pendant le transfert et le stockage
                            </div>
                        </div>

                        <div class="p-4 bg-white/70 rounded-xl">
                            <div class="text-2xl mb-2">👁️</div>
                            <div class="font-medium text-forest-700 mb-2">Accès restreint</div>
                            <div class="text-sm text-terracotta-600">
                                Seule notre équipe de vérification a accès à vos documents
                            </div>
                        </div>

                        <div class="p-4 bg-white/70 rounded-xl">
                            <div class="text-2xl mb-2">🗑️</div>
                            <div class="font-medium text-forest-700 mb-2">Suppression automatique</div>
                            <div class="text-sm text-terracotta-600">
                                Les documents sont supprimés après 90 jours de vérification réussie
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Modal pour ajouter/modifier une certification -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-500 ease-organic"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showCertificationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCertificationModal"></div>
                <div class="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 class="text-xl font-serif font-semibold text-forest-800 mb-4 flex items-center space-x-2">
                        <span>🏅</span>
                        <span>{{ editingCertification ? 'Modifier la certification' : 'Ajouter une certification'
                        }}</span>
                    </h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-forest-700 mb-2">
                                Type de certification
                            </label>
                            <select v-model="certificationForm.type"
                                class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                <option value="bio">Agriculture biologique 🌿</option>
                                <option value="label">Label Rouge 🏅</option>
                                <option value="aop">AOP / IGP 🏆</option>
                                <option value="other">Autre certification ✅</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-forest-700 mb-2">
                                Nom de la certification
                            </label>
                            <input v-model="certificationForm.name" type="text"
                                class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
                                placeholder="Ex: Agriculture Biologique, Label Rouge Poulet..." />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-forest-700 mb-2">
                                    Numéro de certificat
                                </label>
                                <input v-model="certificationForm.certificateNumber" type="text"
                                    class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
                                    placeholder="N° 123456" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-forest-700 mb-2">
                                    Valide jusqu'au
                                </label>
                                <input v-model="certificationForm.validUntil" type="date"
                                    class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-forest-700 mb-2">
                                Attestation (fichier PDF)
                            </label>
                            <div class="border-2 border-dashed border-forest-200 rounded-lg p-4 text-center hover:border-forest-300 hover:bg-forest-50/50 transition-all duration-300 cursor-pointer"
                                @click="triggerCertificationFileUpload">
                                <span class="text-2xl block mb-2">📄</span>
                                <span class="text-sm text-forest-700">
                                    {{ certificationForm.file ? certificationForm.file.name : 'Cliquez pour téléverser le certificat' }}
                                </span>
                                <input ref="certificationFileInput" type="file" accept=".pdf,.jpg,.png" class="hidden"
                                    @change="handleCertificationFileUpload" />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-4 mt-6 pt-6 border-t border-forest-100">
                        <button type="button" @click="closeCertificationModal"
                            class="px-4 py-2 text-forest-600 hover:bg-forest-50 rounded-lg transition-colors">
                            Annuler
                        </button>
                        <button @click="saveCertification"
                            class="px-5 py-2 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>{{ editingCertification ? '💾' : '➕' }}</span>
                            <span>{{ editingCertification ? 'Mettre à jour' : 'Ajouter' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <input ref="verificationFileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden"
            @change="handleVerificationFileUpload" />

        <!-- Toast de confirmation -->
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
                        <p class="font-medium text-forest-700">{{ toastMessage }}</p>
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

type RequiredDocumentType = 'kbis' | 'insurance'

const verificationStatus = ref<'pending' | 'verified' | 'rejected'>('pending')
const isSubmitting = ref(false)
const showCertificationModal = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')
const toastDescription = ref('')
const certificationFileInput = ref<HTMLInputElement | null>(null)
const verificationFileInput = ref<HTMLInputElement | null>(null)
const editingCertification = ref<any>(null)
const pendingUploadType = ref<RequiredDocumentType>('kbis')

const documents = reactive<Record<RequiredDocumentType, {
    id: string | null
    uploaded: boolean
    verified: boolean
    fileName: string
    uploadDate: string
    fileSize: string
}>>({
    kbis: {
        id: null,
        uploaded: false,
        verified: false,
        fileName: '',
        uploadDate: '',
        fileSize: ''
    },
    insurance: {
        id: null,
        uploaded: false,
        verified: false,
        fileName: '',
        uploadDate: '',
        fileSize: ''
    }
})

const certifications = ref<any[]>([])
const additionalInfo = reactive({
    farmType: ''
})

const certificationForm = reactive({
    type: 'bio',
    name: '',
    certificateNumber: '',
    validUntil: '',
    file: null as File | null
})

const formatDate = (value?: string) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('fr-FR')
}

const formatFileSize = (sizeInBytes: number) => {
    if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) return '0 KB'
    const kb = sizeInBytes / 1024
    if (kb < 1024) return `${kb.toFixed(0)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
}

const setDocumentState = (type: RequiredDocumentType, source: any | null) => {
    const resolvedFileName = source?.file_name || source?.original_filename || source?.title || ''
    const rawSize = Number(source?.file_size ?? source?.size ?? 0)
    documents[type].id = source ? String(source.id) : null
    documents[type].uploaded = Boolean(source)
    documents[type].verified = Boolean(source?.verified)
    documents[type].fileName = resolvedFileName
    documents[type].uploadDate = source?.uploaded_at ? formatDate(source.uploaded_at) : ''
    documents[type].fileSize = source
        ? (rawSize > 0 ? formatFileSize(rawSize) : 'Taille inconnue')
        : ''
}

const syncFromStore = () => {
    const remoteDocs = (store.documents as any[]) || []
    const kbisDoc = remoteDocs.find(doc => doc.type === 'kbis') || null
    const insuranceDoc = remoteDocs.find(doc => doc.type === 'insurance') || null

    setDocumentState('kbis', kbisDoc)
    setDocumentState('insurance', insuranceDoc)

    certifications.value = remoteDocs
        .filter(doc => doc.type === 'certification')
        .map((doc, index) => ({
            id: doc.id || `cert-${index + 1}`,
            type: 'certification',
            name: doc.file_name || 'Certification',
            certificateNumber: doc.document_number || (doc.metadata?.certificate_number ?? '-'),
            validUntil: doc.expires_at ? formatDate(doc.expires_at) : '-',
            verified: Boolean(doc.verified)
        }))

    const profile = store.profile as any
    if (profile?.is_verified || profile?.verification_status === 'verified') {
        verificationStatus.value = 'verified'
    } else if (profile?.verification_status === 'rejected') {
        verificationStatus.value = 'rejected'
    } else {
        verificationStatus.value = 'pending'
    }

    additionalInfo.farmType = Array.isArray(profile?.production_type)
        ? (profile.production_type[0] || '')
        : (profile?.production_type || '')
}

const refreshVerificationData = async () => {
    try {
        await store.fetchProfile()
    } catch {
        // Le profil peut ne pas encore exister pour un nouveau producteur.
    }

    try {
        await store.fetchDocuments()
    } catch {
        // Les documents dépendent du profil: on garde l'UI fonctionnelle.
    } finally {
        syncFromStore()
    }
}

const ensureProducerProfile = async () => {
    if (store.profile) return

    try {
        await store.fetchProfile()
        return
    } catch {
        // Tentative de création minimale pour débloquer le téléversement.
    }

    await store.createProfile({
        business_name: 'Mon exploitation',
        bio: ''
    } as any)
    await store.fetchProfile()
}

const verificationItems = computed(() => {
    const profile = store.profile as any
    const profileComplete = Boolean(profile?.business_name && profile?.bio)
    const docsVerified = documents.kbis.verified && documents.insurance.verified

    return [
        { id: 1, label: 'Profil complet', icon: '👤', completed: profileComplete },
        { id: 2, label: 'KBIS téléversé', icon: '🏢', completed: documents.kbis.uploaded },
        { id: 3, label: 'Assurance téléversée', icon: '🛡️', completed: documents.insurance.uploaded },
        { id: 4, label: 'Documents vérifiés', icon: '✅', completed: docsVerified }
    ]
})

const verificationProgress = computed(() => {
    const totalItems = verificationItems.value.length
    const completedItems = verificationItems.value.filter(item => item.completed).length
    return Math.round((completedItems / totalItems) * 100)
})

const allDocumentsUploaded = computed(() => documents.kbis.uploaded && documents.insurance.uploaded)

const completedDocuments = computed(() => {
    let count = 0
    if (documents.kbis.uploaded) count += 1
    if (documents.insurance.uploaded) count += 1
    return count
})

const totalDocuments = computed(() => 2)

const statusTitle = computed(() => {
    switch (verificationStatus.value) {
        case 'verified': return 'Votre compte est vérifié ! 🎉'
        case 'pending': return 'Vérification en cours 🔄'
        case 'rejected': return 'Vérification requise ⚠️'
        default: return 'Statut inconnu'
    }
})

const statusDescription = computed(() => {
    switch (verificationStatus.value) {
        case 'verified': return 'Vous bénéficiez de tous les avantages des producteurs vérifiés'
        case 'pending': return 'Votre dossier est en cours d\'examen par notre équipe'
        case 'rejected': return 'Certains documents nécessitent votre attention'
        default: return ''
    }
})

const submitVerification = async () => {
    if (!allDocumentsUploaded.value) {
        showToast('Documents manquants', 'Ajoutez KBIS et assurance avant soumission.')
        return
    }

    isSubmitting.value = true
    try {
        await store.submitForVerification()
        await refreshVerificationData()
        showToast(
            'Demande soumise',
            'Votre dossier est en cours d\'examen. Vous recevrez une notification par email.'
        )
    } catch (error: unknown) {
        showToast('Erreur de soumission', getErrorMessage(error))
    } finally {
        isSubmitting.value = false
    }
}

const uploadDocument = (type: RequiredDocumentType) => {
    pendingUploadType.value = type
    verificationFileInput.value?.click()
}

const replaceDocument = (type: RequiredDocumentType) => {
    pendingUploadType.value = type
    verificationFileInput.value?.click()
}

const handleVerificationFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    try {
        await ensureProducerProfile()
        await store.uploadDocument({
            type: pendingUploadType.value as any,
            file
        } as any)
        await refreshVerificationData()
        showToast('Document téléversé', `Le document "${file.name}" a été ajouté.`)
    } catch (error: unknown) {
        showToast('Erreur de téléversement', getErrorMessage(error))
    } finally {
        input.value = ''
    }
}

const viewDocument = async (type: RequiredDocumentType) => {
    const documentId = documents[type].id
    if (!documentId) {
        showToast('Document indisponible', 'Ce document n\'est pas encore téléversé.')
        return
    }

    try {
        const preview = await ProducerDocumentService.getDocumentPreview(documentId)
        if (preview?.preview_url) {
            window.open(preview.preview_url, '_blank', 'noopener,noreferrer')
            return
        }

        const blob = await ProducerDocumentService.downloadDocument(documentId)
        const blobUrl = URL.createObjectURL(blob)
        window.open(blobUrl, '_blank', 'noopener,noreferrer')
    } catch (error: unknown) {
        showToast('Erreur document', getErrorMessage(error))
    }
}
const downloadTemplate = async (type: RequiredDocumentType) => {
    try {
        const requirements = await ProducerDocumentService.getDocumentRequirements()
        const match = requirements.required_documents.find((doc: any) => doc.type === type)
        if (match?.template_url) {
            window.open(match.template_url, '_blank', 'noopener,noreferrer')
            return
        }
        showToast('Modèle non disponible', 'Aucun modèle officiel n’est disponible pour ce type de document.')
    } catch (error: unknown) {
        showToast('Erreur modèle', getErrorMessage(error))
    }
}

const addCertification = () => {
    editingCertification.value = null
    Object.assign(certificationForm, {
        type: 'bio',
        name: '',
        certificateNumber: '',
        validUntil: '',
        file: null
    })
    showCertificationModal.value = true
}

const editCertification = (cert: any) => {
    editingCertification.value = cert
    Object.assign(certificationForm, {
        type: cert.type || 'other',
        name: cert.name || '',
        certificateNumber: cert.certificateNumber || '',
        validUntil: cert.validUntil || '',
        file: null
    })
    showCertificationModal.value = true
}

const viewCertification = async (cert: any) => {
    if (!cert?.id) {
        showToast('Document introuvable', 'Impossible de retrouver ce document de certification.')
        return
    }

    try {
        const preview = await ProducerDocumentService.getDocumentPreview(String(cert.id))
        if (preview?.preview_url) {
            window.open(preview.preview_url, '_blank', 'noopener,noreferrer')
            return
        }

        const blob = await ProducerDocumentService.downloadDocument(String(cert.id))
        const blobUrl = URL.createObjectURL(blob)
        window.open(blobUrl, '_blank', 'noopener,noreferrer')
    } catch (error: unknown) {
        showToast('Erreur document', getErrorMessage(error))
    }
}

const closeCertificationModal = () => {
    showCertificationModal.value = false
    editingCertification.value = null
}

const triggerCertificationFileUpload = () => {
    certificationFileInput.value?.click()
}

const handleCertificationFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        certificationForm.file = input.files[0]
    }
}

const saveCertification = () => {
    if (!certificationForm.file) {
        showToast('Fichier manquant', 'Ajoutez un fichier PDF/JPG/PNG pour la certification.')
        return
    }

    void (async () => {
        try {
            await ensureProducerProfile()
            await store.uploadDocument({
                type: 'certification' as any,
                file: certificationForm.file as File
            } as any)

            if (editingCertification.value?.id) {
                try {
                    await store.deleteDocument(String(editingCertification.value.id))
                } catch {
                    // Le nouveau document est déjà téléversé : on ne bloque pas l'utilisateur.
                }
            }

            await refreshVerificationData()
            showToast('Certification enregistrée', 'La certification a été téléversée avec succès.')
            closeCertificationModal()
        } catch (error: unknown) {
            showToast('Erreur de téléversement', getErrorMessage(error))
        }
    })()
}

const saveAdditionalInfo = async () => {
    if (!additionalInfo.farmType) {
        showToast('Champ manquant', 'Sélectionnez un type d’exploitation.')
        return
    }

    try {
        await ensureProducerProfile()
        await store.updateProfile({
            production_type: [additionalInfo.farmType]
        } as any)
        await refreshVerificationData()
        showToast('Informations sauvegardées', 'Le type d’exploitation a été mis à jour.')
    } catch (error: unknown) {
        showToast('Erreur de sauvegarde', getErrorMessage(error))
    }
}

const resetAdditionalInfo = () => {
    const profile = store.profile as any
    additionalInfo.farmType = Array.isArray(profile?.production_type)
        ? (profile.production_type[0] || '')
        : (profile?.production_type || '')
}

const openHelpModal = () => {
    router.push('/help/verification')
}

const contactSupport = () => {
    router.push('/contact/support')
}

const downloadChecklist = () => {
    showToast('Checklist', 'Le guide de vérification sera disponible prochainement.')
}

const showToast = (message: string, description: string) => {
    toastMessage.value = message
    toastDescription.value = description
    showSuccessToast.value = true
    setTimeout(() => {
        showSuccessToast.value = false
    }, 3000)
}

onMounted(() => {
    void refreshVerificationData()
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

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

/* Classes d'animation */
.animate-slide-up {
    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Courbe de bézier organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Pattern de documents en filigrane */
.bg-document-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 30c0-8.284 6.716-15 15-15h70c8.284 0 15 6.716 15 15v140c0 8.284-6.716 15-15 15H65c-8.284 0-15-6.716-15-15V30zm20 20h60v10H70V50zm0 30h60v10H70V80zm0 30h60v10H70v-10z' fill='%233a7d34' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
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
.verification-view::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(100, 170, 100, 0.05) 0%, transparent 25%),
        radial-gradient(circle at 80% 70%, rgba(235, 158, 105, 0.03) 0%, transparent 25%);
    animation: float 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: -15;
}

/* Scrollbar personnalisée */
.verification-view ::-webkit-scrollbar {
    width: 6px;
}

.verification-view ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
}

.verification-view ::-webkit-scrollbar-thumb {
    background: rgba(100, 170, 100, 0.3);
    border-radius: 10px;
}

.verification-view ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 170, 100, 0.5);
}

/* Styles pour les transitions */
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

/* Effets de survol spéciaux */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Animation pour la barre de progression */
.progress-bar {
    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Styles pour les badges de statut */
.status-badge {
    transition: all 0.3s ease-organic;
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

/* Animation pour les documents manquants */
.pulse-warning {
    animation: pulse 2s infinite;
}

/* Styles pour les zones de dépôt de fichiers */
.file-drop-zone {
    transition: all 0.3s ease-organic;
}

.file-drop-zone:hover {
    border-color: #64aa64;
    background-color: rgba(100, 170, 100, 0.05);
}

/* Styles pour les états de vérification */
.verified {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    border-color: #c3e6cb;
}

.pending {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border-color: #ffeaa7;
}

.missing {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    border-color: #f5c6cb;
}
</style>
