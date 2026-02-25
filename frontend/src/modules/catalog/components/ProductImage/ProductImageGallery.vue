<template>
    <div class="product-image-gallery">
        <!-- Background organique avec texture -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-amber-50/20 to-emerald-100/20 rounded-3xl z-0">
            <div class="absolute inset-0 opacity-5 z-0"
                :style="{ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(galleryPattern)}')` }">
            </div>
        </div>

        <div class="relative z-10">
            <!-- En-tête de la galerie -->
            <div class="mb-6 px-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-amber-100 shadow-sm">
                            <ImagesIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3
                                class="text-lg font-bold bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
                                Galerie visuelle
                            </h3>
                            <p class="text-sm text-amber-700/60">
                                Explorez le produit sous tous les angles
                            </p>
                        </div>
                    </div>

                    <!-- Indicateur de navigation -->
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-emerald-800">
                            {{ currentIndex + 1 }}/{{ images.length }}
                        </span>
                        <div class="flex items-center space-x-1">
                            <button @click="toggleFullscreen"
                                class="p-2 rounded-lg hover:bg-amber-50/80 transition-all duration-300 ease-organic"
                                :class="{ 'bg-amber-50/80 text-amber-700': isFullscreen }"
                                :title="isFullscreen ? 'Quitter le plein écran' : 'Plein écran'">
                                <component :is="isFullscreen ? Minimize2Icon : Maximize2Icon" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Image principale avec effet de lumière -->
            <div class="relative mb-6">
                <!-- Cadre décoratif organique -->
                <div
                    class="absolute -inset-4 bg-gradient-to-r from-emerald-400/10 to-amber-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-organic">
                </div>

                <div
                    class="relative aspect-square rounded-2xl overflow-hidden border-3 border-emerald-200/50 bg-gradient-to-br from-white/80 to-emerald-50/30 backdrop-blur-sm shadow-lg group">
                    <!-- Image principale -->
                    <Transition :name="transitionDirection > 0 ? 'slide-next' : 'slide-prev'" mode="out-in">
                        <div v-if="currentImage" :key="currentImage.id || currentIndex" class="relative w-full h-full">
                            <img :src="getImageUrl(currentImage)" :alt="currentImage.alt_text || 'Image produit'"
                                class="w-full h-full object-cover transition-transform duration-700 ease-organic"
                                :class="{ 'scale-105': isZoomed }" @click="toggleZoom" ref="mainImage" />

                            <!-- Overlay d'informations -->
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-organic">
                                <div class="absolute bottom-4 left-4 right-4">
                                    <div
                                        class="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-emerald-200/50">
                                        <p class="text-sm text-emerald-800 font-medium truncate">
                                            {{ currentImage.alt_text || 'Sans description' }}
                                        </p>
                                        <p class="text-xs text-amber-700/60 mt-1">
                                            Cliquez pour zoomer • Double-cliquez pour réinitialiser
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Badge image principale -->
                            <div v-if="currentImage.is_primary" class="absolute top-4 left-4">
                                <span
                                    class="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg shadow-lg shadow-emerald-200/50 flex items-center">
                                    <StarIcon class="w-3 h-3 mr-1.5" />
                                    Principale
                                </span>
                            </div>

                            <!-- Indicateur de zoom -->
                            <div v-if="isZoomed" class="absolute top-4 right-4">
                                <span
                                    class="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg flex items-center">
                                    <ZoomInIcon class="w-3 h-3 mr-1.5" />
                                    Zoom {{ zoomLevel }}x
                                </span>
                            </div>

                            <!-- Contrôles de navigation -->
                            <div class="absolute inset-y-0 left-0 flex items-center">
                                <button @click="previousImage" :disabled="images.length <= 1"
                                    class="ml-4 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-lg hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-organic"
                                    :class="{ 'opacity-0 group-hover:opacity-100': images.length > 1 }">
                                    <ChevronLeftIcon class="w-5 h-5 text-emerald-600" />
                                </button>
                            </div>

                            <div class="absolute inset-y-0 right-0 flex items-center">
                                <button @click="nextImage" :disabled="images.length <= 1"
                                    class="mr-4 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-lg hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-organic"
                                    :class="{ 'opacity-0 group-hover:opacity-100': images.length > 1 }">
                                    <ChevronRightIcon class="w-5 h-5 text-emerald-600" />
                                </button>
                            </div>
                        </div>
                    </Transition>

                    <!-- Placeholder si pas d'images -->
                    <div v-if="!currentImage" class="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div class="relative mb-4">
                            <div
                                class="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-100 to-amber-100 flex items-center justify-center">
                                <ImageOffIcon class="w-12 h-12 text-emerald-400" />
                            </div>
                            <div class="absolute -inset-4 bg-emerald-200/20 rounded-full animate-ping"></div>
                        </div>
                        <h4 class="text-lg font-semibold text-emerald-800 mb-2">
                            Aucune image disponible
                        </h4>
                        <p class="text-amber-700/60 text-center max-w-sm">
                            Ce produit ne possède pas encore d'images. Contactez le producteur pour plus de détails.
                        </p>
                    </div>
                </div>

                <!-- Boutons de contrôle zoom -->
                <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-emerald-200/50 shadow-lg flex items-center space-x-1">
                        <button @click="zoomOut" :disabled="!isZoomed"
                            class="p-2 rounded-lg hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-organic">
                            <ZoomOutIcon class="w-4 h-4 text-emerald-600" />
                        </button>

                        <div class="w-24">
                            <input type="range" v-model.number="zoomLevel" :min="1" :max="3" :step="0.1"
                                class="zoom-slider range-slider" @input="handleZoomChange(zoomLevel)" />
                        </div>

                        <button @click="zoomIn" :disabled="zoomLevel >= 3"
                            class="p-2 rounded-lg hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-organic">
                            <ZoomInIcon class="w-4 h-4 text-emerald-600" />
                        </button>

                        <button @click="resetZoom"
                            class="p-2 rounded-lg hover:bg-amber-50 transition-all duration-200 ease-organic"
                            :class="{ 'text-amber-600': isZoomed }">
                            <RefreshCwIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Galerie de vignettes -->
            <div class="relative">
                <!-- Navigation des vignettes -->
                <div class="flex items-center justify-between mb-4 px-2">
                    <div class="flex items-center space-x-2">
                        <div class="p-1.5 rounded-lg bg-emerald-100/50">
                            <Grid3x3Icon class="w-4 h-4 text-emerald-600" />
                        </div>
                        <h4 class="text-sm font-semibold text-emerald-800">
                            Vignettes ({{ images.length }})
                        </h4>
                    </div>

                    <div class="flex items-center space-x-2">
                        <button @click="scrollThumbnails('left')" :disabled="thumbnailScrollLeft <= 0"
                            class="p-2 rounded-lg hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-organic">
                            <ChevronLeftIcon class="w-4 h-4 text-amber-600" />
                        </button>
                        <button @click="scrollThumbnails('right')" :disabled="thumbnailScrollLeft >= thumbnailMaxScroll"
                            class="p-2 rounded-lg hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-organic">
                            <ChevronRightIcon class="w-4 h-4 text-amber-600" />
                        </button>
                    </div>
                </div>

                <!-- Conteneur des vignettes -->
                <div ref="thumbnailContainer" class="relative overflow-hidden rounded-xl" @wheel="handleThumbnailWheel">
                    <div ref="thumbnailTrack" class="flex space-x-3 transition-transform duration-500 ease-organic"
                        :style="{ transform: `translateX(-${thumbnailScrollLeft}px)` }">
                        <!-- Vignettes -->
                        <div v-for="(image, index) in images" :key="image.id || index"
                            class="flex-shrink-0 relative group/thumb" @click="selectImage(index)">
                            <div class="thumbnail-item relative overflow-hidden rounded-lg border-3 transition-all duration-300 ease-organic"
                                :class="[
                                    currentIndex === index
                                        ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-200/50'
                                        : 'border-emerald-200/50 hover:border-emerald-300 hover:scale-105'
                                ]">
                                <img :src="getImageUrl(image)" :alt="image.alt_text || `Image ${index + 1}`"
                                    class="w-20 h-20 object-cover transition-transform duration-500 ease-organic group-hover/thumb:scale-110" />

                                <!-- Overlay de vignette -->
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 ease-organic">
                                    <div class="absolute bottom-1 left-1 right-1">
                                        <p class="text-xs text-white truncate text-center" :title="image.alt_text">
                                            {{ image.alt_text?.substring(0, 15) || `Image ${index + 1}` }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Indicateur de position -->
                                <div
                                    class="absolute top-1 left-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                                    {{ index + 1 }}
                                </div>

                                <!-- Badge image principale -->
                                <div v-if="image.is_primary" class="absolute top-1 right-1">
                                    <StarIcon class="w-3 h-3 text-amber-400" />
                                </div>
                            </div>

                            <!-- Indicateur de sélection -->
                            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2/3 h-1 rounded-full transition-all duration-300 ease-organic"
                                :class="currentIndex === index ? 'bg-emerald-500' : 'bg-transparent'"></div>
                        </div>

                        <!-- Placeholder pour ajouter des images -->
                        <div v-if="showAddButton" @click="$emit('add-image')" class="flex-shrink-0">
                            <div
                                class="thumbnail-item border-3 border-dashed border-emerald-300/50 bg-gradient-to-br from-emerald-50/50 to-amber-50/50 flex flex-col items-center justify-center p-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/70 active:scale-95 transition-all duration-300 ease-organic">
                                <PlusIcon class="w-6 h-6 text-emerald-500 mb-1" />
                                <span class="text-xs font-medium text-emerald-800">
                                    Ajouter
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Effet de dégradé sur les bords -->
                    <div
                        class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none">
                    </div>
                    <div
                        class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none">
                    </div>
                </div>

                <!-- Pagination points -->
                <div v-if="thumbnailPages > 1" class="flex justify-center space-x-2 mt-4">
                    <button v-for="page in thumbnailPages" :key="page" @click="goToThumbnailPage(page - 1)"
                        class="w-2 h-2 rounded-full transition-all duration-300 ease-organic"
                        :class="currentThumbnailPage === page - 1 ? 'bg-emerald-500 w-4' : 'bg-emerald-300'"></button>
                </div>
            </div>

            <!-- Légende et informations -->
            <Transition enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-organic"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
                <div v-if="showCaption && currentImage"
                    class="mt-6 p-4 rounded-xl border border-emerald-200/50 bg-gradient-to-r from-emerald-50/60 to-amber-50/60 backdrop-blur-sm">
                    <div class="flex items-start space-x-3">
                        <InfoIcon class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div class="flex-1">
                            <h4 class="text-sm font-semibold text-emerald-800 mb-1">
                                À propos de cette image
                            </h4>
                            <p class="text-sm text-amber-800/70">
                                {{ currentImage.alt_text || 'Aucune description disponible pour cette image.' }}
                            </p>
                            <div class="flex items-center space-x-4 mt-2 text-xs text-amber-700/60">
                                <span class="flex items-center">
                                    <CalendarIcon class="w-3 h-3 mr-1" />
                                    {{ formatDate(currentImage.created_at) }}
                                </span>
                                <span v-if="currentImage.is_primary" class="flex items-center">
                                    <StarIcon class="w-3 h-3 mr-1" />
                                    Image principale
                                </span>
                            </div>
                        </div>
                        <button @click="showCaption = false"
                            class="p-1 rounded-lg hover:bg-amber-50 transition-all duration-200 ease-organic">
                            <XIcon class="w-4 h-4 text-amber-600" />
                        </button>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Mode plein écran -->
        <Transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-all duration-300 ease-organic"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isFullscreen"
                class="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="relative w-full h-full flex items-center justify-center">
                    <!-- Bouton fermer -->
                    <button @click="toggleFullscreen"
                        class="absolute top-6 right-6 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 ease-organic z-10">
                        <XIcon class="w-6 h-6" />
                    </button>

                    <!-- Image plein écran -->
                    <div class="relative max-w-7xl max-h-[85vh] w-full h-full">
                        <img :src="getImageUrl(currentImage)" :alt="currentImage?.alt_text || 'Image produit'"
                            class="w-full h-full object-contain"
                            :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }" />

                        <!-- Contrôles plein écran -->
                        <div
                            class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div class="flex items-center space-x-4">
                                <button @click="previousImage" :disabled="images.length <= 1"
                                    class="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-organic">
                                    <ChevronLeftIcon class="w-5 h-5 text-white" />
                                </button>

                                <div class="text-white text-sm font-medium">
                                    {{ currentIndex + 1 }} / {{ images.length }}
                                </div>

                                <button @click="nextImage" :disabled="images.length <= 1"
                                    class="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-organic">
                                    <ChevronRightIcon class="w-5 h-5 text-white" />
                                </button>

                                <div class="w-32 mx-4">
                                    <input type="range" v-model.number="zoomLevel" :min="1" :max="5" :step="0.1"
                                        class="zoom-slider range-slider" @input="handleZoomChange(zoomLevel)" />
                                </div>

                                <button @click="resetZoom"
                                    class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 ease-organic">
                                    <RefreshCwIcon class="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        <!-- Vignettes en bas -->
                        <div class="absolute bottom-24 left-1/2 transform -translate-x-1/2">
                            <div class="flex space-x-2">
                                <div v-for="(image, index) in images" :key="image.id || index"
                                    @click="selectImage(index)"
                                    class="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ease-organic cursor-pointer"
                                    :class="currentIndex === index ? 'border-emerald-400' : 'border-transparent hover:border-white/50'">
                                    <img :src="getImageUrl(image)" :alt="`Image ${index + 1}`"
                                        class="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { createEmojiIcon } from '@/shared/components/icons/emoji'

// Icons (emoji fallback)
const ImagesIcon = createEmojiIcon('🖼️', 'Images')
const ChevronLeftIcon = createEmojiIcon('◀', 'ChevronLeft')
const ChevronRightIcon = createEmojiIcon('▶', 'ChevronRight')
const StarIcon = createEmojiIcon('⭐', 'Star')
const ZoomInIcon = createEmojiIcon('🔍', 'ZoomIn')
const ZoomOutIcon = createEmojiIcon('🔎', 'ZoomOut')
const RefreshCwIcon = createEmojiIcon('🔄', 'Refresh')
const Grid3x3Icon = createEmojiIcon('🔲', 'Grid')
const PlusIcon = createEmojiIcon('➕', 'Plus')
const InfoIcon = createEmojiIcon('ℹ️', 'Info')
const CalendarIcon = createEmojiIcon('📅', 'Calendar')
const XIcon = createEmojiIcon('✕', 'Close')
const Maximize2Icon = createEmojiIcon('⤢', 'Maximize')
const Minimize2Icon = createEmojiIcon('⤡', 'Minimize')
const ImageOffIcon = createEmojiIcon('🖼️', 'ImageOff')

// Props
interface Props {
    images: any[]
    initialIndex?: number
    showAddButton?: boolean
    interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    images: () => [],
    initialIndex: 0,
    showAddButton: false,
    interactive: true
})

// Émits
const emit = defineEmits(['image-change', 'add-image', 'fullscreen-change'])

// Références
const thumbnailContainer = ref<HTMLDivElement>()
const thumbnailTrack = ref<HTMLDivElement>()
const mainImage = ref<HTMLImageElement>()

// États réactifs
const currentIndex = ref(props.initialIndex)
const isFullscreen = ref(false)
const isZoomed = ref(false)
const zoomLevel = ref(1)
const showCaption = ref(true)
const thumbnailScrollLeft = ref(0)
const thumbnailItemWidth = ref(92) // w-20 (80px) + gap (12px)
const transitionDirection = ref(0)

// Pattern SVG pour la texture
const galleryPattern = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="gallery-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" stroke-width="0.3" opacity="0.03"/>
    </pattern>
    <pattern id="gallery-circles" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="15" fill="none" stroke="#f59e0b" stroke-width="0.2" opacity="0.02"/>
      <circle cx="30" cy="30" r="8" fill="none" stroke="#10b981" stroke-width="0.2" opacity="0.02"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#gallery-grid)"/>
  <rect width="200" height="200" fill="url(#gallery-circles)"/>
</svg>`

// Computed
const currentImage = computed(() => {
    return props.images[currentIndex.value] || null
})

const thumbnailPages = computed(() => {
    if (!thumbnailContainer.value) return 1
    const containerWidth = thumbnailContainer.value.clientWidth
    const totalWidth = props.images.length * thumbnailItemWidth.value
    return Math.ceil(totalWidth / containerWidth)
})

const currentThumbnailPage = computed(() => {
    return Math.floor(thumbnailScrollLeft.value / (thumbnailContainer.value?.clientWidth || 1))
})

const thumbnailMaxScroll = computed(() => {
    if (!thumbnailTrack.value || !thumbnailContainer.value) return 0
    return Math.max(0, thumbnailTrack.value.scrollWidth - thumbnailContainer.value.clientWidth)
})

// Méthodes
const getImageUrl = (image: any) => {
    if (!image) return ''
    if (image.url?.startsWith('http') || image.url?.startsWith('/')) {
        return image.url
    }
    if (image.file instanceof File) {
        return URL.createObjectURL(image.file)
    }
    return ''
}

const selectImage = (index: number) => {
    if (index === currentIndex.value) return

    // Déterminer la direction de la transition
    transitionDirection.value = index > currentIndex.value ? 1 : -1

    const oldIndex = currentIndex.value
    currentIndex.value = index
    showCaption.value = true

    // Scroll la vignette dans la vue
    scrollThumbnailIntoView(index)

    emit('image-change', {
        index,
        previousIndex: oldIndex,
        image: props.images[index]
    })
}

const nextImage = () => {
    if (props.images.length <= 1) return
    const newIndex = (currentIndex.value + 1) % props.images.length
    selectImage(newIndex)
}

const previousImage = () => {
    if (props.images.length <= 1) return
    const newIndex = (currentIndex.value - 1 + props.images.length) % props.images.length
    selectImage(newIndex)
}

const toggleZoom = () => {
    if (!props.interactive) return

    if (isZoomed.value) {
        resetZoom()
    } else {
        zoomIn()
    }
}

const zoomIn = () => {
    if (!props.interactive) return

    zoomLevel.value = Math.min(zoomLevel.value + 0.5, 3)
    isZoomed.value = zoomLevel.value > 1
}

const zoomOut = () => {
    if (!props.interactive) return

    zoomLevel.value = Math.max(zoomLevel.value - 0.5, 1)
    isZoomed.value = zoomLevel.value > 1
}

const resetZoom = () => {
    if (!props.interactive) return

    zoomLevel.value = 1
    isZoomed.value = false
}

const handleZoomChange = (value: number) => {
    isZoomed.value = value > 1
}

const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!thumbnailContainer.value) return

    const scrollAmount = thumbnailContainer.value.clientWidth * 0.8

    if (direction === 'left') {
        thumbnailScrollLeft.value = Math.max(0, thumbnailScrollLeft.value - scrollAmount)
    } else {
        thumbnailScrollLeft.value = Math.min(
            thumbnailMaxScroll.value,
            thumbnailScrollLeft.value + scrollAmount
        )
    }
}

const scrollThumbnailIntoView = (index: number) => {
    if (!thumbnailContainer.value) return

    const itemLeft = index * thumbnailItemWidth.value
    const itemRight = itemLeft + thumbnailItemWidth.value
    const containerWidth = thumbnailContainer.value.clientWidth

    // Si l'item est à gauche de la vue
    if (itemLeft < thumbnailScrollLeft.value) {
        thumbnailScrollLeft.value = itemLeft
    }
    // Si l'item est à droite de la vue
    else if (itemRight > thumbnailScrollLeft.value + containerWidth) {
        thumbnailScrollLeft.value = itemRight - containerWidth
    }
}

const goToThumbnailPage = (page: number) => {
    if (!thumbnailContainer.value) return

    thumbnailScrollLeft.value = page * thumbnailContainer.value.clientWidth
}

const handleThumbnailWheel = (event: WheelEvent) => {
    if (!props.interactive) return

    event.preventDefault()
    thumbnailScrollLeft.value = Math.max(
        0,
        Math.min(
            thumbnailMaxScroll.value,
            thumbnailScrollLeft.value + event.deltaY * 0.5
        )
    )
}

const toggleFullscreen = () => {
    if (!props.interactive) return

    isFullscreen.value = !isFullscreen.value
    emit('fullscreen-change', isFullscreen.value)

    if (isFullscreen.value) {
        document.documentElement.style.overflow = 'hidden'
    } else {
        document.documentElement.style.overflow = ''
        resetZoom()
    }
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue'

    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

// Écouteurs d'événements
const handleKeyDown = (event: KeyboardEvent) => {
    if (!props.interactive) return

    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault()
            previousImage()
            break
        case 'ArrowRight':
            event.preventDefault()
            nextImage()
            break
        case 'Escape':
            if (isFullscreen.value) {
                toggleFullscreen()
            } else if (isZoomed.value) {
                resetZoom()
            }
            break
        case '+':
        case '=':
            event.preventDefault()
            zoomIn()
            break
        case '-':
            event.preventDefault()
            zoomOut()
            break
        case '0':
            event.preventDefault()
            resetZoom()
            break
        case 'f':
        case 'F':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault()
                toggleFullscreen()
            }
            break
    }
}

// Lifecycle
onMounted(() => {
    // Initialiser le scroll des vignettes
    scrollThumbnailIntoView(currentIndex.value)

    // Ajouter les écouteurs d'événements
    if (props.interactive) {
        document.addEventListener('keydown', handleKeyDown)
    }

    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(() => {
        scrollThumbnailIntoView(currentIndex.value)
    })

    if (thumbnailContainer.value) {
        resizeObserver.observe(thumbnailContainer.value)
    }
})

onUnmounted(() => {
    // Nettoyer les écouteurs d'événements
    document.removeEventListener('keydown', handleKeyDown)

    // Nettoyer les URLs blob
    props.images.forEach(image => {
        if (image.file && image.url?.startsWith('blob:')) {
            URL.revokeObjectURL(image.url)
        }
    })
})

// Watch
watch(() => props.initialIndex, (newIndex) => {
    if (newIndex !== currentIndex.value) {
        selectImage(newIndex)
    }
})

watch(() => props.images, () => {
    // Réinitialiser l'index si nécessaire
    if (currentIndex.value >= props.images.length) {
        currentIndex.value = Math.max(0, props.images.length - 1)
    }

    // Scroll vers la vignette actuelle
    setTimeout(() => {
        scrollThumbnailIntoView(currentIndex.value)
    }, 100)
}, { deep: true })
</script>

<style scoped>
/* Transitions organiques */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations de transition des images */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-next-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-next-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

.slide-prev-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.slide-prev-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

/* Style pour la bordure */
.border-3 {
    border-width: 3px;
}

/* Sliders natifs */
.range-slider {
    @apply w-full h-2 appearance-none rounded-full bg-amber-100;
}

.range-slider::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md;
}

.range-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: #10b981;
    border: 2px solid #ffffff;
}

.zoom-slider {
    @apply mt-1;
}

/* Style des vignettes */
.thumbnail-item {
    @apply w-20 h-20;
}

/* Animation de pulse pour les nouvelles images */
@keyframes thumbnail-pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }

    50% {
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.1);
    }
}

.thumbnail-pulse {
    animation: thumbnail-pulse 1.5s ease-in-out;
}

/* Effet de lumière sur l'image principale */
.image-light-effect {
    position: relative;
    overflow: hidden;
}

.image-light-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent);
    transition: left 0.7s ease;
    pointer-events: none;
}

.image-light-effect:hover::before {
    left: 100%;
}

/* Animation de flottement organique */
@keyframes organic-float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    33% {
        transform: translateY(-3px) rotate(0.5deg);
    }

    66% {
        transform: translateY(3px) rotate(-0.5deg);
    }
}

.organic-float {
    animation: organic-float 6s ease-in-out infinite;
}

/* Style pour le mode plein écran */
.fullscreen-image {
    cursor: grab;
}

.fullscreen-image:active {
    cursor: grabbing;
}

/* Responsive */
@media (max-width: 768px) {
    .thumbnail-item {
        @apply w-16 h-16;
    }

    .border-3 {
        border-width: 2px;
    }
}

@media (max-width: 480px) {
    .thumbnail-item {
        @apply w-14 h-14;
    }
}

/* Custom scrollbar pour le conteneur des vignettes */
.thumbnail-container::-webkit-scrollbar {
    height: 4px;
}

.thumbnail-container::-webkit-scrollbar-track {
    background: rgba(254, 243, 199, 0.3);
    border-radius: 2px;
}

.thumbnail-container::-webkit-scrollbar-thumb {
    background: linear-gradient(to right, #10b981, #f59e0b);
    border-radius: 2px;
}

.thumbnail-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to right, #0da271, #e38c09);
}
</style>

