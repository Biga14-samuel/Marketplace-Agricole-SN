<template>
    <div class="min-h-screen verification-gradient p-4 md:p-8">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 organic-texture pointer-events-none"></div>

        <!-- Animation de particules de confiance -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="n in 15" :key="n" :class="`trust-particle particle-${n}`"
                :style="`--delay: ${n * 0.2}s; --duration: ${20 + n}s;`">
                <div class="particle-inner"></div>
            </div>
        </div>

        <!-- Container principal -->
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
                        Retour au profil
                    </button>
                </div>

                <!-- Badge de statut de vérification -->
                <div class="verification-status-badge" :class="verificationStatusClass">
                    <div class="flex items-center">
                        <div class="status-dot animate-pulse"></div>
                        <span class="ml-2 font-medium">{{ verificationStatusText }}</span>
                    </div>
                </div>
            </div>

            <!-- Hero Section -->
            <div class="text-center mb-12 animate-fade-in-up">
                <div
                    class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-light to-primary mb-6">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 class="text-4xl font-bold text-foreground-primary mb-4">
                    Vérification de votre compte producteur
                </h1>
                <p class="text-xl text-foreground-secondary max-w-3xl mx-auto">
                    Joignez vos documents pour obtenir le badge "Producteur Vérifié" et renforcer la confiance de vos
                    clients
                </p>
            </div>

            <!-- Split Screen Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <!-- Colonne gauche : Illustration et avantages -->
                <div class="verification-illustration animate-slide-in-left">
                    <div class="glass-card rounded-3xl p-8 h-full">
                        <div class="flex items-center mb-8">
                            <div
                                class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-green-dark flex items-center justify-center mr-4">
                                <span class="text-white text-xl">🌱</span>
                            </div>
                            <h2 class="text-2xl font-bold text-foreground-primary">Pourquoi se faire vérifier ?</h2>
                        </div>

                        <div class="space-y-6">
                            <div v-for="benefit in benefits" :key="benefit.id"
                                class="benefit-card transform transition-all duration-500 ease-natural hover:scale-[1.02]">
                                <div class="flex items-start">
                                    <div
                                        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mr-4">
                                        <span class="text-primary text-lg">{{ benefit.icon }}</span>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-foreground-primary mb-1">{{ benefit.title }}</h3>
                                        <p class="text-foreground-secondary text-sm">{{ benefit.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Statistiques de confiance -->
                        <div class="mt-10 pt-8 border-t border-gray-200">
                            <h3 class="font-semibold text-foreground-primary mb-4">Les producteurs vérifiés bénéficient
                                de :</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div
                                    class="stat-card transform transition-all duration-500 ease-natural hover:scale-105">
                                    <div class="text-2xl font-bold text-primary">+87%</div>
                                    <div class="text-sm text-foreground-secondary">de confiance client</div>
                                </div>
                                <div
                                    class="stat-card transform transition-all duration-500 ease-natural hover:scale-105">
                                    <div class="text-2xl font-bold text-primary">+63%</div>
                                    <div class="text-sm text-foreground-secondary">de conversions</div>
                                </div>
                                <div
                                    class="stat-card transform transition-all duration-500 ease-natural hover:scale-105">
                                    <div class="text-2xl font-bold text-primary">2.5x</div>
                                    <div class="text-sm text-foreground-secondary">plus de visibilité</div>
                                </div>
                                <div
                                    class="stat-card transform transition-all duration-500 ease-natural hover:scale-105">
                                    <div class="text-2xl font-bold text-primary">92%</div>
                                    <div class="text-sm text-foreground-secondary">de taux de satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonne droite : Formulaire de vérification -->
                <div class="verification-form animate-slide-in-right">
                    <div class="glass-card rounded-3xl p-8 h-full">
                        <!-- Progress Bar -->
                        <div class="mb-8">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-medium text-foreground-primary">Progression de
                                    vérification</span>
                                <span class="text-sm font-bold text-primary">{{ verificationProgress }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="progress-bar h-3 rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-1000 ease-natural"
                                    :style="{ width: verificationProgress + '%' }"></div>
                            </div>
                        </div>

                        <!-- État actuel de vérification -->
                        <div class="mb-8">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-bold text-foreground-primary">Documents requis</h3>
                                <span class="text-sm text-foreground-secondary">
                                    {{ uploadedDocumentsCount }}/{{ requiredDocuments.length }} téléchargés
                                </span>
                            </div>
                        </div>

                        <!-- Liste des documents -->
                        <div class="space-y-4 mb-8">
                            <div v-for="document in requiredDocuments" :key="document.type"
                                class="document-item transform transition-all duration-500 ease-natural hover:scale-[1.01]"
                                :class="{ 'document-completed': isDocumentUploaded(document.type) }">
                                <div class="flex items-center justify-between p-4 rounded-xl border-2"
                                    :class="getDocumentCardClass(document.type)">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                                            :class="getDocumentIconClass(document.type)">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-foreground-primary">{{ document.label }}</h4>
                                            <p class="text-sm text-foreground-secondary">{{ document.description }}</p>
                                            <div class="flex items-center mt-1">
                                                <span class="text-xs px-2 py-0.5 rounded-full"
                                                    :class="getDocumentStatusClass(document.type)">
                                                    {{ getDocumentStatusText(document.type) }}
                                                </span>
                                                <span v-if="getDocumentFile(document.type)"
                                                    class="text-xs text-foreground-secondary ml-2">
                                                    {{ formatFileSize(getDocumentFile(document.type)?.size) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center space-x-2">
                                        <!-- Bouton de suppression -->
                                        <button v-if="isDocumentUploaded(document.type)"
                                            @click="removeDocument(document.type)"
                                            class="delete-document-btn p-2 rounded-lg hover:bg-red-50 transition-colors duration-300">
                                            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>

                                        <!-- Bouton de téléchargement -->
                                        <button @click="triggerFileInput(document.type)"
                                            class="upload-btn px-4 py-2 rounded-lg font-medium transition-all duration-500 ease-natural transform hover:scale-105"
                                            :class="getUploadButtonClass(document.type)">
                                            {{ isDocumentUploaded(document.type) ? 'Remplacer' : 'Télécharger' }}
                                        </button>

                                        <!-- Input file caché -->
                                        <input :ref="`fileInput-${document.type}`" type="file"
                                            :accept="document.allowedFormats.join(',')" class="hidden"
                                            @change="handleFileUpload($event, document.type)"
                                            :disabled="uploadingDocument === document.type" />
                                    </div>
                                </div>

                                <!-- Zone de drag & drop -->
                                <div v-if="activeDropzone === document.type"
                                    @drop.prevent="handleDrop($event, document.type)"
                                    @dragover.prevent="handleDragOver($event, document.type)"
                                    @dragleave.prevent="handleDragLeave"
                                    class="drop-zone mt-2 p-4 border-2 border-dashed rounded-xl transition-all duration-300"
                                    :class="dropzoneClass">
                                    <div class="text-center">
                                        <svg class="w-12 h-12 mx-auto text-primary mb-2" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p class="font-medium text-foreground-primary mb-1">Déposez votre fichier ici
                                        </p>
                                        <p class="text-sm text-foreground-secondary">
                                            Formats acceptés : {{ document.allowedFormats.join(', ') }}
                                        </p>
                                        <p class="text-xs text-foreground-secondary mt-1">
                                            Taille max : {{ formatFileSize(document.maxSize) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Documents optionnels -->
                        <div v-if="optionalDocuments.length > 0" class="mb-8">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-bold text-foreground-primary">Documents optionnels</h3>
                                <button @click="showOptionalDocuments = !showOptionalDocuments"
                                    class="text-primary hover:text-primary-dark transition-colors duration-300">
                                    {{ showOptionalDocuments ? 'Masquer' : 'Afficher' }}
                                </button>
                            </div>

                            <transition name="slide-vertical">
                                <div v-if="showOptionalDocuments" class="space-y-4">
                                    <div v-for="document in optionalDocuments" :key="document.type"
                                        class="document-item optional transform transition-all duration-500 ease-natural hover:scale-[1.01]">
                                        <div
                                            class="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200">
                                            <div class="flex items-center">
                                                <div
                                                    class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                                                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 class="font-semibold text-foreground-primary">{{ document.label
                                                        }}</h4>
                                                    <p class="text-sm text-foreground-secondary">{{ document.description
                                                        }}</p>
                                                    <div class="text-xs text-gray-500 mt-1">
                                                        Optionnel • {{ formatFileSize(document.maxSize) }}
                                                    </div>
                                                </div>
                                            </div>
                                            <button @click="triggerFileInput(document.type)"
                                                class="upload-btn-optional px-4 py-2 rounded-lg font-medium border border-primary text-primary hover:bg-primary-light transition-all duration-500 ease-natural transform hover:scale-105">
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <!-- Actions principales -->
                        <div class="mt-10 pt-8 border-t border-gray-200">
                            <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                <div class="text-sm text-foreground-secondary">
                                    <p>La vérification prend généralement 2-3 jours ouvrés</p>
                                    <p class="text-xs mt-1">Notre équipe examinera vos documents avec attention</p>
                                </div>

                                <div class="flex space-x-4">
                                    <button @click="saveDraft"
                                        class="draft-btn px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all duration-500 ease-natural transform hover:scale-105">
                                        Enregistrer comme brouillon
                                    </button>

                                    <button @click="submitVerification" :disabled="!canSubmit || isSubmitting"
                                        class="submit-btn px-8 py-3 rounded-xl font-medium transition-all duration-500 ease-natural transform hover:scale-105"
                                        :class="submitButtonClass">
                                        <span v-if="isSubmitting" class="flex items-center">
                                            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2">
                                            </div>
                                            Soumission en cours...
                                        </span>
                                        <span v-else>
                                            Soumettre pour vérification
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Guide et assistance -->
            <div class="glass-card rounded-3xl p-8 mb-8 animate-fade-in-up" style="animation-delay: 0.3s">
                <div class="flex items-center mb-6">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-orange to-accent-orange-dark flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-foreground-primary">Guide de vérification</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="tip in verificationTips" :key="tip.id"
                        class="tip-card p-6 rounded-xl transform transition-all duration-500 ease-natural hover:scale-105">
                        <div class="text-4xl mb-4">{{ tip.icon }}</div>
                        <h3 class="font-semibold text-foreground-primary mb-2">{{ tip.title }}</h3>
                        <p class="text-foreground-secondary text-sm">{{ tip.description }}</p>
                    </div>
                </div>
            </div>

            <!-- FAQ -->
            <div class="glass-card rounded-3xl p-8 animate-fade-in-up" style="animation-delay: 0.5s">
                <div class="flex items-center mb-6">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-dark flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-foreground-primary">Questions fréquentes</h2>
                </div>

                <div class="space-y-4">
                    <div v-for="faq in faqs" :key="faq.id"
                        class="faq-item rounded-xl border border-gray-200 overflow-hidden">
                        <button @click="toggleFaq(faq.id)"
                            class="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-300">
                            <span class="font-medium text-foreground-primary">{{ faq.question }}</span>
                            <svg class="w-5 h-5 text-gray-500 transition-transform duration-300"
                                :class="{ 'rotate-180': expandedFaq === faq.id }" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="slide-vertical">
                            <div v-if="expandedFaq === faq.id" class="p-6 pt-0 border-t border-gray-200">
                                <p class="text-foreground-secondary">{{ faq.answer }}</p>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de succès -->
        <transition name="modal">
            <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div class="success-modal glass-card max-w-md w-full p-8 rounded-3xl transform transition-all duration-500 ease-natural"
                    @click.stop>
                    <div class="text-center">
                        <div class="success-icon mx-auto mb-6">
                            <div class="checkmark animate-draw-check"></div>
                        </div>
                        <h3 class="text-2xl font-bold text-foreground-primary mb-4">Demande soumise avec succès !</h3>
                        <p class="text-foreground-secondary mb-6">
                            Votre demande de vérification a été envoyée à notre équipe.
                            Vous recevrez une notification dès que votre compte sera vérifié.
                        </p>
                        <button @click="closeSuccessModal"
                            class="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transition-all duration-500 ease-natural transform hover:scale-105">
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useProducerStore } from '../stores/useProducerStore';
import { getErrorMessage } from '@/shared/utils/error-handler';
import type { DocumentType, ProducerDocumentUpload } from '../types';

const router = useRouter();
const store = useProducerStore();

// État du formulaire
const uploadedDocuments = reactive<Record<DocumentType, File | null>>({
    kbis: null,
    insurance: null,
    certification: null,
    identity: null,
    siret: null,
    tva: null,
    iban: null,
    hygiene: null,
    quality: null,
    other: null
});

const uploadingDocument = ref<DocumentType | null>(null);
const activeDropzone = ref<DocumentType | null>(null);
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showOptionalDocuments = ref(false);
const expandedFaq = ref<number | null>(null);

// Documents requis et optionnels
const requiredDocuments = [
    {
        type: 'kbis' as DocumentType,
        label: 'Extrait KBIS',
        description: 'Extrait de l\'immatriculation au registre du commerce',
        required: true,
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedFormats: ['.pdf', '.jpg', '.jpeg', '.png']
    },
    {
        type: 'insurance' as DocumentType,
        label: 'Assurance Responsabilité Civile',
        description: 'Attestation d\'assurance responsabilité civile professionnelle',
        required: true,
        maxSize: 5 * 1024 * 1024,
        allowedFormats: ['.pdf', '.jpg', '.jpeg', '.png']
    },
    {
        type: 'identity' as DocumentType,
        label: 'Pièce d\'identité',
        description: 'Carte d\'identité ou passeport du responsable légal',
        required: true,
        maxSize: 3 * 1024 * 1024,
        allowedFormats: ['.jpg', '.jpeg', '.png']
    }
];

const optionalDocuments = [
    {
        type: 'certification' as DocumentType,
        label: 'Certifications agricoles',
        description: 'Certifications Bio, Label Rouge, ou autres labels qualité',
        required: false,
        maxSize: 10 * 1024 * 1024,
        allowedFormats: ['.pdf', '.jpg', '.jpeg', '.png']
    },
    {
        type: 'tax' as DocumentType,
        label: 'Avis d\'imposition',
        description: 'Dernier avis d\'imposition ou justificatif de domicile',
        required: false,
        maxSize: 5 * 1024 * 1024,
        allowedFormats: ['.pdf', '.jpg', '.jpeg', '.png']
    },
    {
        type: 'license' as DocumentType,
        label: 'Licences & Permis',
        description: 'Licences de vente, permis d\'exploitation, autorisations',
        required: false,
        maxSize: 5 * 1024 * 1024,
        allowedFormats: ['.pdf', '.jpg', '.jpeg', '.png']
    }
];

// Avantages de la vérification
const benefits = [
    {
        id: 1,
        icon: '⭐',
        title: 'Badge de confiance',
        description: 'Obtenez le badge "Vérifié" visible par tous les clients'
    },
    {
        id: 2,
        icon: '📈',
        title: 'Plus de visibilité',
        description: 'Priorité dans les résultats de recherche et recommandations'
    },
    {
        id: 3,
        icon: '🤝',
        title: 'Confiance accrue',
        description: 'Les clients font plus facilement confiance aux producteurs vérifiés'
    },
    {
        id: 4,
        icon: '⚡',
        title: 'Validation rapide',
        description: 'Processus simplifié pour les commandes et paiements'
    }
];

// Conseils de vérification
const verificationTips = [
    {
        id: 1,
        icon: '📄',
        title: 'Documents clairs',
        description: 'Assurez-vous que les scans sont lisibles et sans reflets'
    },
    {
        id: 2,
        icon: '🔒',
        title: 'Sécurité des données',
        description: 'Vos documents sont cryptés et protégés conformément au RGPD'
    },
    {
        id: 3,
        icon: '⏱️',
        title: 'Délai de traitement',
        description: 'La vérification est généralement effectuée sous 48h ouvrées'
    }
];

// FAQ
const faqs = [
    {
        id: 1,
        question: 'Combien de temps prend la vérification ?',
        answer: 'La vérification est généralement effectuée sous 48 heures ouvrées. Vous recevrez une notification dès que votre compte sera vérifié.'
    },
    {
        id: 2,
        question: 'Mes documents sont-ils sécurisés ?',
        answer: 'Oui, tous les documents sont cryptés et stockés de manière sécurisée conformément au RGPD. Ils ne sont accessibles qu\'à notre équipe de vérification.'
    },
    {
        id: 3,
        question: 'Puis-je modifier mes documents après soumission ?',
        answer: 'Vous pouvez mettre à jour vos documents à tout moment depuis votre espace producteur. Les modifications seront soumises à une nouvelle vérification.'
    },
    {
        id: 4,
        question: 'Que faire si ma vérification est rejetée ?',
        answer: 'Vous recevrez un email détaillant les raisons du rejet et les corrections à apporter. Vous pourrez ensuite soumettre à nouveau vos documents.'
    }
];

// Computed properties
const verificationProgress = computed(() => {
    const requiredCount = requiredDocuments.length;
    const uploadedCount = requiredDocuments.filter(doc =>
        uploadedDocuments[doc.type] !== null
    ).length;
    return Math.round((uploadedCount / requiredCount) * 100);
});

const uploadedDocumentsCount = computed(() => {
    return requiredDocuments.filter(doc => uploadedDocuments[doc.type] !== null).length;
});

const canSubmit = computed(() => {
    return verificationProgress.value === 100 && !isSubmitting.value;
});

const verificationStatusClass = computed(() => {
    const status = store.verificationStatus;
    switch (status) {
        case 'verified':
            return 'status-verified';
        case 'rejected':
            return 'status-rejected';
        case 'pending':
            return 'status-pending';
        default:
            return 'status-not-submitted';
    }
});

const verificationStatusText = computed(() => {
    const status = store.verificationStatus;
    switch (status) {
        case 'verified':
            return 'Compte vérifié ✓';
        case 'rejected':
            return 'Vérification rejetée';
        case 'pending':
            return 'En attente de vérification';
        default:
            return 'Non soumis';
    }
});

const submitButtonClass = computed(() => {
    if (!canSubmit.value || isSubmitting.value) {
        return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    return 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg';
});

const dropzoneClass = computed(() => {
    return activeDropzone.value ? 'border-primary bg-primary/5' : 'border-gray-300';
});

// Méthodes utilitaires
function getDocumentCardClass(type: DocumentType): string {
    if (uploadedDocuments[type]) {
        return 'border-primary bg-primary/5';
    }
    return 'border-gray-200 hover:border-primary/50';
}

function getDocumentIconClass(type: DocumentType): string {
    if (uploadedDocuments[type]) {
        return 'bg-primary/20 text-primary';
    }
    return 'bg-gray-100 text-gray-500';
}

function getDocumentStatusClass(type: DocumentType): string {
    if (uploadedDocuments[type]) {
        return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
}

function getDocumentStatusText(type: DocumentType): string {
    return uploadedDocuments[type] ? 'Téléchargé' : 'Requis';
}

function getUploadButtonClass(type: DocumentType): string {
    if (uploadedDocuments[type]) {
        return 'bg-primary/10 text-primary hover:bg-primary/20';
    }
    return 'bg-primary text-white hover:bg-primary-dark';
}

function isDocumentUploaded(type: DocumentType): boolean {
    return uploadedDocuments[type] !== null;
}

function getDocumentFile(type: DocumentType): File | null {
    return uploadedDocuments[type];
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Gestion des fichiers
function triggerFileInput(type: DocumentType) {
    const inputRef = `fileInput-${type}`;
    const input = document.querySelector(`[ref="${inputRef}"]`) as HTMLInputElement;
    if (input) {
        input.click();
    }
}

function handleFileUpload(event: Event, type: DocumentType) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        validateAndUploadFile(file, type);
    }
    input.value = ''; // Reset pour permettre le re-téléchargement
}

async function validateAndUploadFile(file: File, type: DocumentType) {
    const docConfig = [...requiredDocuments, ...optionalDocuments].find(d => d.type === type);

    if (!docConfig) return;

    // Validation de la taille
    if (file.size > docConfig.maxSize) {
        store.addNotification({
            type: 'error',
            message: `Le fichier est trop volumineux (max: ${formatFileSize(docConfig.maxSize)})`
        });
        return;
    }

    // Validation du type de fichier
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isValidFormat = docConfig.allowedFormats.some(format =>
        fileExtension === format.toLowerCase() ||
        file.type.startsWith('image/') ||
        file.type === 'application/pdf'
    );

    if (!isValidFormat) {
        store.addNotification({
            type: 'error',
            message: `Format non supporté. Formats acceptés: ${docConfig.allowedFormats.join(', ')}`
        });
        return;
    }

    // Simulation d'upload
    uploadingDocument.value = type;

    try {
        // Simulation de progression
        await new Promise(resolve => setTimeout(resolve, 1000));

        uploadedDocuments[type] = file;

        store.addNotification({
            type: 'success',
            message: `${docConfig.label} téléchargé avec succès`
        });

    } catch (error) {
        store.addNotification({
            type: 'error',
            message: 'Erreur lors du téléchargement du fichier'
        });
    } finally {
        uploadingDocument.value = null;
        activeDropzone.value = null;
    }
}

// Drag & Drop
function handleDragOver(event: DragEvent, type: DocumentType) {
    event.preventDefault();
    activeDropzone.value = type;
}

function handleDragLeave() {
    activeDropzone.value = null;
}

function handleDrop(event: DragEvent, type: DocumentType) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
        validateAndUploadFile(files[0], type);
    }
    activeDropzone.value = null;
}

// Actions
function removeDocument(type: DocumentType) {
    uploadedDocuments[type] = null;
    store.addNotification({
        type: 'info',
        message: 'Document supprimé'
    });
}

async function saveDraft() {
    // Ici, on pourrait sauvegarder l'état local dans le store ou le localStorage
    store.addNotification({
        type: 'success',
        message: 'Brouillon enregistré'
    });
}

async function submitVerification() {
    if (!canSubmit.value) return;

    isSubmitting.value = true;

    try {
        // Préparer les données pour l'upload
        const uploadPromises = Object.entries(uploadedDocuments)
            .filter(([_, file]) => file !== null)
            .map(([type, file]) => {
                const documentData: ProducerDocumentUpload = {
                    type: type as DocumentType,
                    file: file!
                };
                return store.uploadDocument(documentData);
            });

        // Uploader tous les documents
        await Promise.all(uploadPromises);

        // Soumettre pour vérification
        await store.submitForVerification();

        // Afficher le modal de succès
        showSuccessModal.value = true;

    } catch (error: unknown) {
        store.addNotification({
            type: 'error',
            message: getErrorMessage(error)
        });
    } finally {
        isSubmitting.value = false;
    }
}

function toggleFaq(id: number) {
    expandedFaq.value = expandedFaq.value === id ? null : id;
}

function goBack() {
    router.back();
}

function closeSuccessModal() {
    showSuccessModal.value = false;
    router.push('/producer/dashboard');
}

// Initialisation
onMounted(async () => {
    // Charger les documents existants
    await store.fetchDocuments();

    // Pré-remplir avec les documents déjà téléchargés
    store.documents.forEach(doc => {
        // Simuler un fichier pour les documents existants
        uploadedDocuments[doc.type] = new File([], doc.file_name, {
            type: doc.file_type,
            lastModified: new Date(doc.uploaded_at).getTime()
        });
    });
});
</script>

<style scoped>
/* Dégradé de vérification */
.verification-gradient {
    background: linear-gradient(135deg,
            #f0f9ff 0%,
            #ecfdf5 25%,
            #fef7ff 50%,
            #fefce8 75%,
            #f0f9ff 100%);
    background-size: 400% 400%;
    animation: gradient-flow 25s ease infinite;
}

/* Texture organique */
.organic-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%2310b981' fill-opacity='0.03' cx='60' cy='60' r='50'/%3E%3Ccircle fill='%2334d399' fill-opacity='0.02' cx='30' cy='30' r='30'/%3E%3Ccircle fill='%23059669' fill-opacity='0.02' cx='90' cy='90' r='30'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.4;
}

/* Animations de particules */
@keyframes particle-float {
    0% {
        transform: translateY(100vh) translateX(0) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 0.1;
    }

    90% {
        opacity: 0.1;
    }

    100% {
        transform: translateY(-100px) translateX(calc(100vw * var(--random-x))) rotate(360deg);
        opacity: 0;
    }
}

.trust-particle {
    position: absolute;
    animation: particle-float var(--duration) ease-in-out var(--delay) infinite;
    z-index: 0;
}

.particle-inner {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: linear-gradient(45deg, #10b981, #34d399);
    opacity: 0.4;
}

.particle-1 {
    --random-x: 0.1;
}

.particle-2 {
    --random-x: 0.3;
}

.particle-3 {
    --random-x: 0.5;
}

.particle-4 {
    --random-x: 0.7;
}

.particle-5 {
    --random-x: 0.9;
}

.particle-6 {
    --random-x: 0.2;
}

.particle-7 {
    --random-x: 0.4;
}

.particle-8 {
    --random-x: 0.6;
}

.particle-9 {
    --random-x: 0.8;
}

.particle-10 {
    --random-x: 0.15;
}

.particle-11 {
    --random-x: 0.35;
}

.particle-12 {
    --random-x: 0.55;
}

.particle-13 {
    --random-x: 0.75;
}

.particle-14 {
    --random-x: 0.95;
}

.particle-15 {
    --random-x: 0.25;
}

/* Animation de gradient */
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

/* Effet glassmorphism */
.glass-card {
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow:
        0 10px 40px rgba(31, 38, 135, 0.08),
        0 4px 16px rgba(0, 0, 0, 0.04);
}

/* Badge de statut */
.verification-status-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.status-verified {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
}

.status-pending {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
}

.status-rejected {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #991b1b;
}

.status-not-submitted {
    background: linear-gradient(135deg, #e5e7eb, #d1d5db);
    color: #4b5563;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-verified .status-dot {
    background-color: #10b981;
}

.status-pending .status-dot {
    background-color: #f59e0b;
}

.status-rejected .status-dot {
    background-color: #ef4444;
}

.status-not-submitted .status-dot {
    background-color: #9ca3af;
}

/* Progress bar animée */
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

/* Cartes interactives */
.benefit-card,
.tip-card,
.stat-card {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.benefit-card:hover,
.tip-card:hover,
.stat-card:hover {
    box-shadow:
        0 8px 24px rgba(16, 185, 129, 0.1),
        0 4px 12px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* Animation de succès */
.success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #34d399);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.checkmark {
    width: 40px;
    height: 20px;
    border-left: 4px solid white;
    border-bottom: 4px solid white;
    transform: rotate(-45deg);
}

@keyframes draw-check {
    0% {
        width: 0;
        height: 0;
        opacity: 0;
    }

    50% {
        width: 0;
        height: 20px;
        opacity: 1;
    }

    100% {
        width: 40px;
        height: 20px;
        opacity: 1;
    }
}

.animate-draw-check {
    animation: draw-check 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Transitions */
.ease-natural {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-down {
    animation: slide-in-down 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-fade-in-up {
    animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-left {
    animation: slide-in-left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-right {
    animation: slide-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(30px);
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

/* Transitions pour FAQ et documents optionnels */
.slide-vertical-enter-active,
.slide-vertical-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.slide-vertical-enter-from,
.slide-vertical-leave-to {
    max-height: 0;
    opacity: 0;
}

.slide-vertical-enter-to,
.slide-vertical-leave-from {
    max-height: 500px;
    opacity: 1;
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

.modal-enter-active .success-modal,
.modal-leave-active .success-modal {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .success-modal,
.modal-leave-to .success-modal {
    opacity: 0;
    transform: scale(0.9);
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

/* Document complété */
.document-completed {
    position: relative;
}

.document-completed::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #10b981, #34d399);
    border-radius: 4px 0 0 4px;
}

/* Zone de drop améliorée */
.drop-zone {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drop-zone:hover {
    border-color: #10b981;
    background: linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.1));
}
</style>