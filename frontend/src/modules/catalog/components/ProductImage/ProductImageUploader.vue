<template>
    <div class="product-image-uploader">
        <!-- Background organique avec texture -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-amber-50/30 to-emerald-100/30 rounded-2xl z-0">
            <div class="absolute inset-0 opacity-5"
                :style="{ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(texturePattern)}')` }">
            </div>
        </div>

        <div class="relative z-10">
            <!-- En-tête animé -->
            <div class="mb-6">
                <div class="flex items-center space-x-3 mb-3">
                    <div class="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-amber-100 shadow-sm">
                        <ImageIcon class="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3
                            class="text-lg font-bold bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
                            Galerie du produit
                        </h3>
                        <p class="text-sm text-amber-700/60">
                            Montrez votre produit sous son meilleur angle
                        </p>
                    </div>
                </div>

                <!-- Indicateur de progression -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex-1 mr-4">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-emerald-800">
                                {{ images.length }}/{{ maxImages }} images
                            </span>
                            <span v-if="images.length > 0"
                                class="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                {{ primaryImageCount }} principale(s)
                            </span>
                        </div>
                        <div class="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ease-organic"
                                :style="{ width: `${(images.length / maxImages) * 100}%` }"></div>
                        </div>
                    </div>

                    <!-- Bouton d'aide -->
                    <button @click="showTips = !showTips"
                        class="p-2 rounded-lg hover:bg-amber-50/80 transition-all duration-300 ease-organic"
                        :class="{ 'bg-amber-50/80 text-amber-700': showTips }">
                        <HelpCircleIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Conseils d'upload -->
            <Transition enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-organic"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
                <div v-if="showTips"
                    class="mb-6 p-4 rounded-xl border border-emerald-200/50 bg-gradient-to-r from-emerald-50/60 to-amber-50/60 backdrop-blur-sm">
                    <div class="flex items-start space-x-3">
                        <LightbulbIcon class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div class="flex-1">
                            <h4 class="text-sm font-semibold text-emerald-800 mb-1">
                                Conseils pour de belles photos
                            </h4>
                            <ul class="text-xs text-amber-700/70 space-y-1">
                                <li class="flex items-center">
                                    <CheckCircleIcon class="w-3 h-3 text-emerald-500 mr-1.5 flex-shrink-0" />
                                    Utilisez la lumière naturelle pour des couleurs fidèles
                                </li>
                                <li class="flex items-center">
                                    <CheckCircleIcon class="w-3 h-3 text-emerald-500 mr-1.5 flex-shrink-0" />
                                    Prenez plusieurs angles (face, profil, détails)
                                </li>
                                <li class="flex items-center">
                                    <CheckCircleIcon class="w-3 h-3 text-emerald-500 mr-1.5 flex-shrink-0" />
                                    Montrez le produit dans son contexte naturel
                                </li>
                                <li class="flex items-center">
                                    <CheckCircleIcon class="w-3 h-3 text-emerald-500 mr-1.5 flex-shrink-0" />
                                    Choisissez une image principale attractive
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- Zone principale d'upload -->
            <div class="mb-8">
                <!-- Zone de drag & drop -->
                <div ref="dropZone" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave"
                    @drop.prevent="handleDrop" @click="triggerFileInput" class="relative group"
                    :class="{ 'border-emerald-400 bg-emerald-50/50': isDragging }">
                    <!-- Effet de lumière au survol -->
                    <div
                        class="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-organic">
                    </div>

                    <div class="relative min-h-64 border-3 border-dashed rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 ease-organic"
                        :class="[
                            isDragging
                                ? 'border-emerald-400 bg-emerald-50/80 scale-[1.02]'
                                : 'border-emerald-200/70 bg-white/70 hover:border-emerald-300 hover:bg-white/80'
                        ]">

                        <!-- État vide -->
                        <div v-if="images.length === 0"
                            class="absolute inset-0 flex flex-col items-center justify-center p-8">
                            <div class="relative mb-4">
                                <div
                                    class="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-100 to-amber-100 flex items-center justify-center">
                                    <UploadIcon class="w-10 h-10 text-emerald-500" />
                                </div>
                                <div
                                    class="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                    <ImageIcon class="w-4 h-4 text-amber-600" />
                                </div>
                            </div>

                            <h4 class="text-lg font-semibold text-emerald-800 mb-2">
                                Déposez vos images ici
                            </h4>
                            <p class="text-amber-700/60 text-center mb-4 max-w-md">
                                Glissez-déposez vos photos ou cliquez pour parcourir vos fichiers
                            </p>

                            <div class="flex flex-wrap justify-center gap-2 mb-4">
                                <span
                                    class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    JPG, PNG, WebP
                                </span>
                                <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                    Max 5MB par image
                                </span>
                                <span
                                    class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    Jusqu'à {{ maxImages }} images
                                </span>
                            </div>

                            <button type="button"
                                class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-emerald-200">
                                <CameraIcon class="w-4 h-4 inline mr-2" />
                                Sélectionner des images
                            </button>
                        </div>

                        <!-- État avec images -->
                        <div v-else class="p-6">
                            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                <TransitionGroup name="image-item" tag="div" class="contents">
                                    <!-- Image principale -->
                                    <div v-for="(image, index) in images" :key="image.id || image.file?.name || index"
                                        class="relative group/image">
                                        <div class="aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ease-organic"
                                            :class="[
                                                image.is_primary
                                                    ? 'border-emerald-400 shadow-lg shadow-emerald-200'
                                                    : 'border-emerald-200/50 hover:border-emerald-300'
                                            ]">

                                            <!-- Image ou preview -->
                                            <img :src="getImageUrl(image)" :alt="image.alt_text || 'Image produit'"
                                                class="w-full h-full object-cover transition-transform duration-500 ease-organic group-hover/image:scale-110" />

                                            <!-- Overlay d'actions -->
                                            <div
                                                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300 ease-organic">
                                                <div class="absolute top-2 right-2 flex space-x-1">
                                                    <!-- Bouton image principale -->
                                                    <button v-if="!image.is_primary" @click.stop="setAsPrimary(index)"
                                                        class="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 ease-organic"
                                                        title="Définir comme image principale">
                                                        <StarIcon class="w-4 h-4 text-amber-500" />
                                                    </button>

                                                    <!-- Bouton supprimer -->
                                                    <button @click.stop="removeImage(index)"
                                                        class="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 ease-organic"
                                                        title="Supprimer l'image">
                                                        <Trash2Icon class="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>

                                                <!-- Badge image principale -->
                                                <div v-if="image.is_primary" class="absolute top-2 left-2">
                                                    <span
                                                        class="px-2 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg shadow-sm">
                                                        Principale
                                                    </span>
                                                </div>

                                                <!-- Contrôles du bas -->
                                                <div
                                                    class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                    <input v-model="image.alt_text" type="text"
                                                        placeholder="Description de l'image..."
                                                        class="w-full px-2 py-1 text-xs bg-white/90 backdrop-blur-sm rounded border border-emerald-200/50 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 outline-none transition-all duration-200 ease-organic"
                                                        @change="updateImageAltText(index, image.alt_text)" />
                                                </div>
                                            </div>

                                            <!-- Indicateur de chargement -->
                                            <div v-if="image.uploading"
                                                class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                <div class="text-center">
                                                    <div class="relative inline-block mb-2">
                                                        <div
                                                            class="w-12 h-12 rounded-full border-3 border-emerald-200 border-t-emerald-500 animate-spin ease-organic">
                                                        </div>
                                                        <UploadIcon
                                                            class="absolute inset-0 m-auto w-6 h-6 text-emerald-500" />
                                                    </div>
                                                    <span class="text-xs font-medium text-emerald-700">
                                                        {{ image.progress || 0 }}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Indicateur de position -->
                                        <div
                                            class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                                            {{ index + 1 }}
                                        </div>

                                        <!-- Bouton réorganiser -->
                                        <button v-if="images.length > 1" @mousedown="startDrag(index)"
                                            class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm hover:bg-amber-600 active:scale-95 transition-all duration-200 ease-organic cursor-move"
                                            title="Déplacer l'image">
                                            <MoveIcon class="w-3 h-3" />
                                        </button>
                                    </div>

                                    <!-- Bouton ajouter plus d'images -->
                                    <div v-if="images.length < maxImages" @click="triggerFileInput"
                                        class="aspect-square rounded-xl border-2 border-dashed border-emerald-300/50 bg-gradient-to-br from-emerald-50/50 to-amber-50/50 flex flex-col items-center justify-center p-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/70 active:scale-95 transition-all duration-300 ease-organic">
                                        <div
                                            class="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-100 to-amber-100 flex items-center justify-center mb-3">
                                            <PlusIcon class="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <span class="text-sm font-medium text-emerald-800 mb-1">
                                            Ajouter {{ maxImages - images.length }} image(s)
                                        </span>
                                        <span class="text-xs text-amber-700/60 text-center">
                                            Cliquez ou glissez-déposez
                                        </span>
                                    </div>
                                </TransitionGroup>
                            </div>

                            <!-- Bouton ajouter plus (bas) -->
                            <div v-if="images.length > 0 && images.length < maxImages" class="mt-6 text-center">
                                <button @click="triggerFileInput" type="button"
                                    class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 active:scale-95 transition-all duration-300 ease-organic shadow-lg shadow-amber-200">
                                    <PlusIcon class="w-4 h-4 mr-2" />
                                    Ajouter d'autres images
                                </button>
                            </div>
                        </div>

                        <!-- Input file caché -->
                        <input ref="fileInput" type="file" multiple accept="image/jpeg,image/png,image/webp"
                            class="hidden" @change="handleFileSelect" />
                    </div>

                    <!-- Indicateur de drag & drop -->
                    <Transition enter-active-class="transition-all duration-300 ease-organic"
                        enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                        leave-active-class="transition-all duration-200 ease-organic"
                        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                        <div v-if="isDragging"
                            class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-emerald-400">
                                <div class="flex flex-col items-center">
                                    <UploadIcon class="w-12 h-12 text-emerald-500 mb-3 animate-bounce ease-organic" />
                                    <span class="text-lg font-semibold text-emerald-800">
                                        Relâchez pour uploader
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>

            <!-- Barre d'actions -->
            <div
                class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-emerald-200/50">
                <div class="flex items-center space-x-4">
                    <!-- Indicateur d'upload -->
                    <div v-if="uploadingCount > 0" class="flex items-center space-x-2">
                        <div class="relative">
                            <div
                                class="w-8 h-8 rounded-full border-2 border-emerald-200 border-t-emerald-500 animate-spin ease-organic">
                            </div>
                            <UploadIcon class="absolute inset-0 m-auto w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                            <span class="text-sm font-medium text-emerald-800">
                                {{ uploadingCount }} upload en cours
                            </span>
                            <span class="block text-xs text-amber-700/60">
                                Ne quittez pas cette page
                            </span>
                        </div>
                    </div>

                    <!-- Message d'erreur -->
                    <div v-if="uploadErrors.length > 0" class="flex items-center space-x-2">
                        <AlertCircleIcon class="w-5 h-5 text-red-500" />
                        <div>
                            <span class="text-sm font-medium text-red-700">
                                {{ uploadErrors.length }} erreur(s)
                            </span>
                            <button @click="showUploadErrors = !showUploadErrors"
                                class="text-xs text-amber-700 hover:text-emerald-700 transition-colors duration-200">
                                Voir les détails
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex items-center space-x-3">
                    <button v-if="images.length > 0" @click="clearAllImages" type="button"
                        class="px-5 py-2.5 text-sm font-medium text-amber-700 bg-amber-100/50 border border-amber-300/50 rounded-xl hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all duration-300 ease-organic">
                        <Trash2Icon class="w-4 h-4 inline mr-2" />
                        Tout effacer
                    </button>

                    <button v-if="hasChanges" @click="saveChanges" type="button" :disabled="uploadingCount > 0"
                        class="px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-300 ease-organic disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="[
                            uploadingCount > 0
                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 shadow-lg shadow-emerald-200'
                        ]">
                        <SaveIcon class="w-4 h-4 inline mr-2" />
                        {{ uploadingCount > 0 ? 'Enregistrement...' : 'Enregistrer les changements' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal d'erreurs d'upload -->
        <Transition enter-active-class="transition-all duration-300 ease-organic" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-organic"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showUploadErrors"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-200/50">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-emerald-800">
                            Erreurs d'upload
                        </h3>
                        <button @click="showUploadErrors = false"
                            class="p-2 rounded-lg hover:bg-amber-50 transition-all duration-200 ease-organic">
                            <XIcon class="w-5 h-5 text-amber-600" />
                        </button>
                    </div>

                    <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
                        <div v-for="(error, index) in uploadErrors" :key="index"
                            class="p-3 rounded-lg border border-red-200 bg-red-50/50">
                            <div class="flex items-start space-x-2">
                                <AlertCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-red-700">
                                        {{ error.fileName }}
                                    </p>
                                    <p class="text-xs text-red-600/80 mt-1">
                                        {{ getErrorMessage(error) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button @click="uploadErrors = []"
                        class="w-full mt-6 py-2.5 text-sm font-medium text-red-700 bg-red-100/50 border border-red-300/50 rounded-xl hover:bg-red-100 hover:border-red-400 active:scale-95 transition-all duration-300 ease-organic">
                        Effacer toutes les erreurs
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { createEmojiIcon } from '@/shared/components/icons/emoji'
import { getErrorMessage } from '@/shared/utils/error-handler'
import { productsApi } from '../../services/api/products.api'

const ImageIcon = createEmojiIcon('🖼️', 'Image')
const UploadIcon = createEmojiIcon('⬆️', 'Upload')
const CameraIcon = createEmojiIcon('📷', 'Camera')
const HelpCircleIcon = createEmojiIcon('❓', 'Help')
const LightbulbIcon = createEmojiIcon('💡', 'Tip')
const CheckCircleIcon = createEmojiIcon('✅', 'Check')
const StarIcon = createEmojiIcon('⭐', 'Star')
const Trash2Icon = createEmojiIcon('🗑️', 'Trash')
const MoveIcon = createEmojiIcon('↔️', 'Move')
const PlusIcon = createEmojiIcon('➕', 'Plus')
const SaveIcon = createEmojiIcon('💾', 'Save')
const AlertCircleIcon = createEmojiIcon('⚠️', 'Alert')
const XIcon = createEmojiIcon('✕', 'Close')

// Props
interface Props {
    modelValue: any[]
    productId?: number
    maxImages?: number
    maxFileSize?: number // en MB
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    maxImages: 10,
    maxFileSize: 5 // 5MB
})

// Émits
const emit = defineEmits(['update:modelValue', 'upload', 'save', 'error'])

// Références
const fileInput = ref<HTMLInputElement>()
const dropZone = ref<HTMLDivElement>()

// États réactifs
const images = ref<any[]>([])
const isDragging = ref(false)
const showTips = ref(false)
const uploadingCount = ref(0)
const uploadErrors = ref<Array<{ fileName: string; message: string }>>([])
const showUploadErrors = ref(false)
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// Pattern SVG pour la texture
const texturePattern = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" stroke-width="0.5" opacity="0.05"/>
    </pattern>
    <pattern id="leaves" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20,10 C25,5 35,5 40,10 C35,15 25,15 20,10" fill="none" stroke="#f59e0b" stroke-width="0.3" opacity="0.03"/>
      <path d="M10,30 C15,25 25,25 30,30 C25,35 15,35 10,30" fill="none" stroke="#10b981" stroke-width="0.3" opacity="0.03"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#grid)"/>
  <rect width="100" height="100" fill="url(#leaves)"/>
</svg>`

// Computed
const primaryImageCount = computed(() => {
    return images.value.filter(img => img.is_primary).length
})

const hasChanges = computed(() => {
    return images.value.some(img =>
        img.uploading ||
        img.changed ||
        img.file // nouvelle image
    )
})

// Méthodes
const getImageUrl = (image: any) => {
    if (image.url?.startsWith('http') || image.url?.startsWith('/')) {
        return image.url
    }
    if (image.file instanceof File) {
        return URL.createObjectURL(image.file)
    }
    return ''
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    const newImages: any[] = []
    const errors: Array<{ fileName: string; message: string }> = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Vérifier le nombre maximum d'images
        if (images.value.length + newImages.length >= props.maxImages) {
            errors.push({
                fileName: file.name,
                message: `Limite de ${props.maxImages} images atteinte`
            })
            continue
        }

        // Vérifier la taille du fichier
        if (file.size > props.maxFileSize * 1024 * 1024) {
            errors.push({
                fileName: file.name,
                message: `Fichier trop volumineux (max ${props.maxFileSize}MB)`
            })
            continue
        }

        // Vérifier le type MIME
        if (!file.type.startsWith('image/')) {
            errors.push({
                fileName: file.name,
                message: 'Format de fichier non supporté'
            })
            continue
        }

        // Ajouter l'image
        newImages.push({
            file,
            alt_text: file.name.split('.')[0],
            position: images.value.length + newImages.length,
            is_primary: images.value.length === 0 && newImages.length === 0,
            uploading: false,
            progress: 0,
            changed: true
        })
    }

    // Ajouter les erreurs
    if (errors.length > 0) {
        uploadErrors.value.push(...errors)
        showUploadErrors.value = true
        emit('error', errors)
    }

    // Ajouter les nouvelles images
    if (newImages.length > 0) {
        images.value = [...images.value, ...newImages]
        emit('update:modelValue', images.value)

        // Uploader immédiatement si productId existe
        if (props.productId) {
            await uploadNewImages(newImages)
        }
    }

    // Réinitialiser l'input file
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const uploadNewImages = async (imagesToUpload: any[]) => {
    for (const image of imagesToUpload) {
        if (!image.file) continue

        image.uploading = true
        image.progress = 0
        uploadingCount.value++

        try {
            if (!props.productId) {
                image.uploading = false
                image.progress = 100
                continue
            }

            const uploadedImage = await productsApi.uploadProductImage(
                String(props.productId),
                {
                    file: image.file,
                    alt_text: image.alt_text || image.file.name.split('.')[0],
                    is_primary: image.is_primary || false,
                    position: image.position ?? 0
                },
                (progress) => {
                    image.progress = progress
                }
            )

            image.id = uploadedImage.id
            image.url = uploadedImage.url
            image.alt_text = uploadedImage.alt_text || image.alt_text
            image.position = uploadedImage.position
            image.is_primary = uploadedImage.is_primary
            image.uploaded = true
            image.changed = false
            delete image.file

            emit('upload', {
                image: uploadedImage,
                productId: props.productId
            })
        } catch (error) {
            image.error = true

            const uploadError = {
                fileName: image.file.name,
                message: error instanceof Error ? getErrorMessage(error) : 'Erreur lors de l\'upload'
            }
            uploadErrors.value.push(uploadError)
            showUploadErrors.value = true
            emit('error', [uploadError])
        } finally {
            image.uploading = false
            emit('update:modelValue', images.value)
            uploadingCount.value--
        }
    }
}

const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
    event.preventDefault()
    const relatedTarget = event.relatedTarget as HTMLElement
    if (!dropZone.value?.contains(relatedTarget)) {
        isDragging.value = false
    }
}

const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = false

    const files = event.dataTransfer?.files
    if (!files) return

    // Créer un event synthétique pour réutiliser handleFileSelect
    const syntheticEvent = {
        target: { files }
    } as unknown as Event

    handleFileSelect(syntheticEvent)
}

const setAsPrimary = (index: number) => {
    // Réinitialiser toutes les images principales
    images.value.forEach(img => {
        img.is_primary = false
        img.changed = true
    })

    // Définir la nouvelle image principale
    images.value[index].is_primary = true
    images.value[index].changed = true

    emit('update:modelValue', images.value)
}

const removeImage = (index: number) => {
    const image = images.value[index]

    // Si c'est l'image principale, en désigner une nouvelle
    const wasPrimary = image.is_primary
    images.value.splice(index, 1)

    // Réorganiser les positions
    images.value.forEach((img, idx) => {
        img.position = idx
        if (idx === 0 && wasPrimary) {
            img.is_primary = true
            img.changed = true
        }
    })

    emit('update:modelValue', images.value)
}

const clearAllImages = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les images ?')) {
        images.value = []
        emit('update:modelValue', images.value)
    }
}

const updateImageAltText = (index: number, altText: string) => {
    images.value[index].alt_text = altText
    images.value[index].changed = true
    emit('update:modelValue', images.value)
}

const startDrag = (index: number) => {
    dragIndex.value = index

    const handleMouseMove = (event: MouseEvent) => {
        // Logique de drag & drop pour réorganiser
        // À implémenter selon les besoins
    }

    const handleMouseUp = () => {
        dragIndex.value = null
        dragOverIndex.value = null
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

const saveChanges = async () => {
    const pendingImages = images.value.filter((image) => image.file instanceof File)

    if (!props.productId) {
        // En mode création, les images seront envoyées après la publication du produit.
        emit('save', {
            images: images.value,
            productId: props.productId
        })
        return
    }

    if (pendingImages.length > 0) {
        await uploadNewImages(pendingImages)
    }

    emit('save', {
        images: images.value,
        productId: props.productId
    })
}

// Lifecycle
onMounted(() => {
    // Initialiser avec les images existantes
    images.value = [...props.modelValue]

    // Ajouter des écouteurs globaux pour le drag & drop
    document.addEventListener('dragover', (e) => {
        if (e.dataTransfer?.types.includes('Files')) {
            e.preventDefault()
        }
    })
})

onUnmounted(() => {
    // Nettoyer les URLs d'objets blob
    images.value.forEach(img => {
        if (img.file && img.url?.startsWith('blob:')) {
            URL.revokeObjectURL(img.url)
        }
    })
})

// Watch pour synchroniser avec les props
watch(() => props.modelValue, (newValue) => {
    if (JSON.stringify(images.value) !== JSON.stringify(newValue)) {
        images.value = [...newValue]
    }
}, { deep: true })
</script>

<style scoped>
/* Transitions organiques */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations pour les éléments d'image */
.image-item-enter-active,
.image-item-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-item-enter-from,
.image-item-leave-to {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
}

.image-item-move {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Style pour la bordure drag & drop */
.border-3 {
    border-width: 3px;
}

/* Animation de pulse pour les nouvelles images */
@keyframes new-image-pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }

    50% {
        box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.1);
    }
}

.new-image {
    animation: new-image-pulse 1.5s ease-in-out;
}

/* Style pour le placeholder de drag & drop */
.drag-placeholder {
    background: linear-gradient(45deg,
            rgba(16, 185, 129, 0.1) 25%,
            rgba(245, 158, 11, 0.1) 50%,
            rgba(16, 185, 129, 0.1) 75%);
    background-size: 200% 200%;
    animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(254, 243, 199, 0.3);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #10b981, #f59e0b);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0da271, #e38c09);
}

/* Effet de lumière sur les images */
.image-light-effect {
    position: relative;
    overflow: hidden;
}

.image-light-effect::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.image-light-effect:hover::after {
    opacity: 1;
}

/* Responsive */
@media (max-width: 640px) {
    .grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .grid-cols-2 {
        grid-template-columns: 1fr;
    }
}
</style>
