<template>
  <div
    class="product-image-item"
    :class="[
      `item-size-${size}`,
      { 
        'is-primary': isPrimary,
        'is-selected': isSelected,
        'is-dragging': isDragging,
        'is-loading': isLoading,
        'has-error': hasError,
        'interactive': interactive,
        'rounded-full': circular
      }
    ]"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @contextmenu="handleContextMenu"
    @dragstart="handleDragStart"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
    :draggable="draggable"
    :title="title"
    ref="itemRef"
  >
    <!-- Background organique avec texture -->
    <div class="absolute inset-0 rounded-2xl overflow-hidden z-0">
      <!-- Dégradé de fond dynamique -->
      <div 
        class="absolute inset-0 transition-all duration-700 ease-organic"
        :class="[
          isPrimary 
            ? 'bg-gradient-to-br from-emerald-400/20 via-amber-400/10 to-emerald-500/15' 
            : 'bg-gradient-to-br from-emerald-50/30 via-amber-50/20 to-emerald-100/25'
        ]"
      ></div>
      
      <!-- Texture de feuilles africaines subtile -->
      <div 
        class="absolute inset-0 opacity-5"
        :style="{ backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(itemPattern)}')` }"
      ></div>
      
      <!-- Effet de bordure organique -->
      <div class="absolute inset-0 border-3 transition-all duration-500 ease-organic"
           :class="[
             isPrimary 
               ? 'border-emerald-400/50 shadow-lg shadow-emerald-200/50' 
               : 'border-emerald-200/30 hover:border-emerald-300/50'
           ]"></div>
      
      <!-- Effet de lumière au survol -->
      <div class="absolute -inset-4 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-amber-400/0 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-all duration-700 ease-organic pointer-events-none"></div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 w-full h-full">
      <!-- État de chargement -->
      <Transition
        enter-active-class="transition-all duration-500 ease-organic"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-organic"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl">
          <!-- Animation de chargement organique -->
          <div class="relative mb-3">
            <div class="w-12 h-12 rounded-full border-3 border-emerald-200 border-t-emerald-500 animate-spin ease-organic"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <ImageIcon class="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <span class="text-xs font-medium text-emerald-700 animate-pulse">
            Chargement...
          </span>
        </div>
      </Transition>

      <!-- État d'erreur -->
      <Transition
        enter-active-class="transition-all duration-300 ease-organic"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-organic"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-red-50/80 backdrop-blur-sm rounded-2xl">
          <AlertCircleIcon class="w-10 h-10 text-red-400 mb-2" />
          <span class="text-xs font-medium text-red-700 text-center">
            Erreur de chargement
          </span>
        </div>
      </Transition>

      <!-- Image principale -->
      <div class="relative w-full h-full rounded-xl overflow-hidden">
        <img
          :src="imageUrl"
          :alt="altText"
          class="w-full h-full object-cover transition-all duration-500 ease-organic"
          :class="[
            `image-${fit}`,
            { 
              'scale-105 group-hover:scale-110': !isLoading && !hasError,
              'grayscale': hasError,
              'opacity-80': isDragging
            }
          ]"
          @load="handleImageLoad"
          @error="handleImageError"
          loading="lazy"
          ref="imageRef"
        />
        
        <!-- Overlay d'informations -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-organic pointer-events-none">
          <!-- Informations en bas -->
          <div class="absolute bottom-0 left-0 right-0 p-3">
            <div class="bg-black/60 backdrop-blur-sm rounded-lg p-2">
              <p class="text-xs text-white truncate font-medium" :title="altText">
                {{ displayAltText }}
              </p>
              <div v-if="showMeta" class="flex items-center justify-between mt-1">
                <span class="text-xs text-emerald-300">
                  {{ formatSize }}
                </span>
                <span class="text-xs text-amber-300">
                  {{ positionLabel }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Indicateur de sélection -->
        <div
          v-if="isSelected"
          class="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/50"
        >
          <CheckIcon class="w-3 h-3 text-white" />
        </div>
        
        <!-- Badge image principale -->
        <div
          v-if="isPrimary && !isLoading"
          class="absolute top-2 left-2"
        >
          <span class="px-2 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg shadow-lg shadow-emerald-200/50 flex items-center">
            <StarIcon class="w-3 h-3 mr-1" />
            Principale
          </span>
        </div>
        
        <!-- Indicateur de position -->
        <div
          v-if="showPosition && !isPrimary"
          class="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-sm"
        >
          {{ position }}
        </div>
      </div>
    </div>

    <!-- Overlay d'actions -->
    <Transition
      enter-active-class="transition-all duration-300 ease-organic"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-organic"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showActions && !isLoading && !hasError"
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-organic"
      >
        <!-- Boutons d'action centrés -->
        <div class="absolute inset-0 flex items-center justify-center space-x-2">
          <!-- Bouton visionner -->
          <button
            v-if="actions.includes('view')"
            @click.stop="emitAction('view')"
            class="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 ease-organic shadow-lg"
            title="Visionner"
          >
            <EyeIcon class="w-4 h-4 text-emerald-600" />
          </button>
          
          <!-- Bouton principale -->
          <button
            v-if="actions.includes('primary') && !isPrimary"
            @click.stop="emitAction('primary')"
            class="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 ease-organic shadow-lg"
            title="Définir comme principale"
          >
            <StarIcon class="w-4 h-4 text-amber-500" />
          </button>
          
          <!-- Bouton modifier -->
          <button
            v-if="actions.includes('edit')"
            @click.stop="emitAction('edit')"
            class="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 ease-organic shadow-lg"
            title="Modifier"
          >
            <EditIcon class="w-4 h-4 text-blue-500" />
          </button>
          
          <!-- Bouton supprimer -->
          <button
            v-if="actions.includes('delete')"
            @click.stop="emitAction('delete')"
            class="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 ease-organic shadow-lg"
            title="Supprimer"
          >
            <Trash2Icon class="w-4 h-4 text-red-500" />
          </button>
        </div>
        
        <!-- Bouton d'actions rapides (coin) -->
        <div class="absolute top-2 right-2 space-x-1 flex opacity-0 group-hover:opacity-100 transition-all duration-500 ease-organic">
          <button
            v-if="actions.includes('download')"
            @click.stop="emitAction('download')"
            class="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 ease-organic"
            title="Télécharger"
          >
            <DownloadIcon class="w-3 h-3 text-emerald-600" />
          </button>
          
          <button
            v-if="actions.includes('share')"
            @click.stop="emitAction('share')"
            class="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-emerald-200/50 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 ease-organic"
            title="Partager"
          >
            <Share2Icon class="w-3 h-3 text-blue-500" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Indicateur de drag & drop -->
    <Transition
      enter-active-class="transition-all duration-200 ease-organic"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150 ease-organic"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDraggingOver"
        class="absolute inset-0 border-4 border-dashed border-emerald-400 bg-emerald-50/50 rounded-2xl flex items-center justify-center pointer-events-none"
      >
        <div class="text-center p-4">
          <UploadIcon class="w-8 h-8 text-emerald-500 mx-auto mb-2 animate-bounce ease-organic" />
          <span class="text-sm font-medium text-emerald-700">
            Déposer ici
          </span>
        </div>
      </div>
    </Transition>

    <!-- Menu contextuel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-organic"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150 ease-organic"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showContextMenu"
        class="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl border border-emerald-200/50 shadow-2xl z-50 min-w-48"
        :style="contextMenuStyle"
        ref="contextMenuRef"
      >
        <div class="p-1">
          <!-- En-tête du menu -->
          <div class="px-3 py-2 border-b border-emerald-200/30">
            <p class="text-xs font-medium text-emerald-800 truncate" :title="altText">
              {{ displayAltText }}
            </p>
            <p class="text-xs text-amber-700/60">
              Image • {{ formatSize }}
            </p>
          </div>
          
          <!-- Options du menu -->
          <div class="py-1">
            <button
              v-if="actions.includes('view')"
              @click="handleContextMenuAction('view')"
              class="w-full px-3 py-2 text-left text-sm text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
            >
              <EyeIcon class="w-4 h-4 mr-2 text-emerald-600" />
              Visionner
            </button>
            
            <button
              v-if="actions.includes('primary') && !isPrimary"
              @click="handleContextMenuAction('primary')"
              class="w-full px-3 py-2 text-left text-sm text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
            >
              <StarIcon class="w-4 h-4 mr-2 text-amber-500" />
              Définir comme principale
            </button>
            
            <button
              v-if="actions.includes('download')"
              @click="handleContextMenuAction('download')"
              class="w-full px-3 py-2 text-left text-sm text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
            >
              <DownloadIcon class="w-4 h-4 mr-2 text-emerald-600" />
              Télécharger
            </button>
            
            <button
              v-if="actions.includes('share')"
              @click="handleContextMenuAction('share')"
              class="w-full px-3 py-2 text-left text-sm text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
            >
              <Share2Icon class="w-4 h-4 mr-2 text-blue-500" />
              Partager
            </button>
            
            <div v-if="actions.includes('edit') || actions.includes('delete')" class="border-t border-emerald-200/30 mt-1 pt-1">
              <button
                v-if="actions.includes('edit')"
                @click="handleContextMenuAction('edit')"
                class="w-full px-3 py-2 text-left text-sm text-blue-800 hover:bg-blue-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
              >
                <EditIcon class="w-4 h-4 mr-2 text-blue-500" />
                Modifier
              </button>
              
              <button
                v-if="actions.includes('delete')"
                @click="handleContextMenuAction('delete')"
                class="w-full px-3 py-2 text-left text-sm text-red-800 hover:bg-red-50 rounded-lg flex items-center transition-all duration-200 ease-organic"
              >
                <Trash2Icon class="w-4 h-4 mr-2 text-red-500" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createEmojiIcon } from '@/shared/components/icons/emoji'

const ImageIcon = createEmojiIcon('🖼️', 'Image')
const StarIcon = createEmojiIcon('⭐', 'Star')
const EyeIcon = createEmojiIcon('👁️', 'Eye')
const EditIcon = createEmojiIcon('✏️', 'Edit')
const Trash2Icon = createEmojiIcon('🗑️', 'Trash')
const DownloadIcon = createEmojiIcon('⬇️', 'Download')
const Share2Icon = createEmojiIcon('🔗', 'Share')
const UploadIcon = createEmojiIcon('⬆️', 'Upload')
const AlertCircleIcon = createEmojiIcon('⚠️', 'Alert')
const CheckIcon = createEmojiIcon('✓', 'Check')

// Props
interface Props {
  src: string
  alt?: string
  position?: number
  isPrimary?: boolean
  isSelected?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fit?: 'cover' | 'contain' | 'fill'
  showMeta?: boolean
  showActions?: boolean
  showPosition?: boolean
  interactive?: boolean
  draggable?: boolean
  circular?: boolean
  actions?: string[]
  fileSize?: number
  maxAltLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  position: 0,
  isPrimary: false,
  isSelected: false,
  size: 'md',
  fit: 'cover',
  showMeta: true,
  showActions: true,
  showPosition: true,
  interactive: true,
  draggable: false,
  circular: false,
  actions: () => ['view', 'primary', 'edit', 'delete'],
  fileSize: 0,
  maxAltLength: 30
})

// Émits
const emit = defineEmits([
  'click',
  'double-click',
  'action',
  'drag-start',
  'drag-end',
  'drop',
  'load',
  'error',
  'context-menu'
])

// Références
const itemRef = ref<HTMLDivElement>()
const imageRef = ref<HTMLImageElement>()
const contextMenuRef = ref<HTMLDivElement>()

// États réactifs
const isLoading = ref(true)
const hasError = ref(false)
const isDragging = ref(false)
const isDraggingOver = ref(false)
const showContextMenu = ref(false)
const contextMenuStyle = ref({})
const imageNaturalSize = ref({ width: 0, height: 0 })

// Pattern SVG pour la texture
const itemPattern = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="item-dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="#10b981" opacity="0.05"/>
    </pattern>
    <pattern id="item-lines" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0,20 L40,20 M20,0 L20,40" fill="none" stroke="#f59e0b" stroke-width="0.5" opacity="0.03"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#item-dots)"/>
  <rect width="100" height="100" fill="url(#item-lines)"/>
</svg>`

// Computed
const imageUrl = computed(() => {
  if (props.src?.startsWith('http') || props.src?.startsWith('/') || props.src?.startsWith('data:')) {
    return props.src
  }
  if (props.src) {
    return `/api/uploads/${props.src}`
  }
  return '/placeholder-product.jpg'
})

const altText = computed(() => {
  return props.alt || `Image ${props.position + 1}`
})

const displayAltText = computed(() => {
  if (props.alt.length <= props.maxAltLength) return props.alt
  return props.alt.substring(0, props.maxAltLength) + '...'
})

const title = computed(() => {
  const parts = []
  if (props.alt) parts.push(props.alt)
  if (props.isPrimary) parts.push('(Image principale)')
  if (props.position > 0) parts.push(`Position: ${props.position}`)
  if (props.fileSize > 0) parts.push(`Taille: ${formatFileSize(props.fileSize)}`)
  return parts.join(' • ')
})

const positionLabel = computed(() => {
  return `#${props.position + 1}`
})

const formatSize = computed(() => {
  if (props.fileSize > 0) {
    return formatFileSize(props.fileSize)
  }
  
  if (imageNaturalSize.value.width && imageNaturalSize.value.height) {
    return `${imageNaturalSize.value.width}×${imageNaturalSize.value.height}`
  }
  
  return 'Taille inconnue'
})

// Méthodes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Octets'
  
  const k = 1024
  const sizes = ['Octets', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const handleClick = (event: MouseEvent) => {
  if (!props.interactive) return
  
  if (showContextMenu.value) {
    showContextMenu.value = false
    return
  }
  
  emit('click', {
    event,
    position: props.position,
    isPrimary: props.isPrimary,
    src: props.src
  })
}

const handleDoubleClick = (event: MouseEvent) => {
  if (!props.interactive) return
  
  emit('double-click', {
    event,
    position: props.position,
    isPrimary: props.isPrimary,
    src: props.src
  })
}

const handleContextMenu = (event: MouseEvent) => {
  if (!props.interactive) return
  
  event.preventDefault()
  
  // Positionner le menu contextuel
  const rect = itemRef.value?.getBoundingClientRect()
  if (rect) {
    contextMenuStyle.value = {
      left: `${event.clientX - rect.left}px`,
      top: `${event.clientY - rect.top}px`
    }
  }
  
  showContextMenu.value = true
  
  emit('context-menu', {
    event,
    position: props.position,
    isPrimary: props.isPrimary,
    src: props.src
  })
}

const handleContextMenuAction = (action: string) => {
  emitAction(action)
  showContextMenu.value = false
}

const emitAction = (action: string) => {
  if (!props.interactive) return
  
  emit('action', {
    action,
    position: props.position,
    isPrimary: props.isPrimary,
    src: props.src
  })
}

const handleDragStart = (event: DragEvent) => {
  if (!props.draggable || !props.interactive) return
  
  isDragging.value = true
  
  // Définir les données de drag
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'product-image',
      position: props.position,
      src: props.src
    }))
    event.dataTransfer.effectAllowed = 'move'
    
    // Créer un drag image
    if (imageRef.value) {
      const dragImage = document.createElement('div')
      dragImage.style.width = '100px'
      dragImage.style.height = '100px'
      dragImage.style.background = `url(${props.src}) center/cover no-repeat`
      dragImage.style.borderRadius = '12px'
      dragImage.style.border = '2px solid #10b981'
      dragImage.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)'
      document.body.appendChild(dragImage)
      event.dataTransfer.setDragImage(dragImage, 50, 50)
      
      // Nettoyer après le drag
      setTimeout(() => document.body.removeChild(dragImage), 0)
    }
  }
  
  emit('drag-start', {
    event,
    position: props.position,
    isPrimary: props.isPrimary,
    src: props.src
  })
}

const handleDragOver = (event: DragEvent) => {
  if (!props.interactive) return
  
  isDraggingOver.value = true
  
  // Définir l'effet de drop
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragLeave = () => {
  isDraggingOver.value = false
}

const handleDrop = (event: DragEvent) => {
  if (!props.interactive) return
  
  isDraggingOver.value = false
  
  try {
    const data = event.dataTransfer?.getData('text/plain')
    if (data) {
      const dragData = JSON.parse(data)
      
      emit('drop', {
        event,
        dragData,
        position: props.position,
        isPrimary: props.isPrimary,
        src: props.src
      })
    }
  } catch (error) {
    console.error('Error parsing drop data:', error)
  }
}

const handleImageLoad = (event: Event) => {
  isLoading.value = false
  hasError.value = false
  
  // Récupérer les dimensions naturelles de l'image
  const img = event.target as HTMLImageElement
  imageNaturalSize.value = {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
  
  emit('load', {
    event,
    position: props.position,
    isPrimary: props.isPrimary,
    src: props.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight
  })
}

const handleImageError = (event: Event) => {
  isLoading.value = false
  hasError.value = true
  
  emit('error', {
    event,
    position: props.position,
    isPrimary: props.isPrimary,
    src: props.src
  })
}

// Gestionnaires d'événements globaux
const handleClickOutside = (event: MouseEvent) => {
  if (!showContextMenu.value) return
  
  const target = event.target as Node
  if (contextMenuRef.value && !contextMenuRef.value.contains(target)) {
    showContextMenu.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showContextMenu.value) {
    showContextMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Ajouter les écouteurs d'événements globaux
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
  
  // Simuler un chargement si l'image est déjà chargée
  if (imageRef.value?.complete) {
    handleImageLoad(new Event('load'))
  }
})

onUnmounted(() => {
  // Nettoyer les écouteurs d'événements
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* Transitions organiques */
.ease-organic {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Classes de taille */
.product-image-item {
  @apply relative transition-all duration-500 ease-organic;
}

.item-size-xs {
  @apply w-16 h-16;
}

.item-size-sm {
  @apply w-24 h-24;
}

.item-size-md {
  @apply w-32 h-32;
}

.item-size-lg {
  @apply w-48 h-48;
}

.item-size-xl {
  @apply w-64 h-64;
}

/* Classes d'état */
.is-primary {
  @apply ring-4 ring-emerald-400/30;
  animation: primary-pulse 2s ease-in-out infinite;
}

.is-selected {
  @apply ring-4 ring-blue-400/30;
}

.is-dragging {
  @apply opacity-60 scale-95;
}

.has-error {
  @apply ring-2 ring-red-300;
}

/* Classes pour le fit de l'image */
.image-cover {
  @apply object-cover;
}

.image-contain {
  @apply object-contain;
}

.image-fill {
  @apply object-fill;
}

/* Animation pour l'image principale */
@keyframes primary-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.1);
    transform: scale(1.02);
  }
}

/* Animation d'apparition */
@keyframes item-fade-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.product-image-item {
  animation: item-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Effet de rebond au survol */
.interactive:hover {
  transform: translateY(-2px);
}

/* Style pour les images circulaires */
.rounded-full .image-cover {
  border-radius: 50%;
}

.rounded-full::before {
  border-radius: 50%;
}

/* Custom scrollbar pour le menu contextuel */
::-webkit-scrollbar {
  width: 6px;
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

/* Effet de texture sur l'image */
.product-image-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: 5;
}

.product-image-item:hover::before {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .item-size-lg {
    @apply w-40 h-40;
  }
  
  .item-size-xl {
    @apply w-56 h-56;
  }
}

@media (max-width: 480px) {
  .item-size-md {
    @apply w-28 h-28;
  }
  
  .item-size-lg {
    @apply w-36 h-36;
  }
  
  .item-size-xl {
    @apply w-48 h-48;
  }
}

/* Animation de shake pour les erreurs */
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.has-error {
  animation: error-shake 0.5s ease-in-out;
}

/* Effet de brillance organique */
@keyframes organic-shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.organic-shine {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: organic-shine 3s infinite linear;
}

/* Effet de profondeur */
.depth-effect {
  box-shadow: 
    0 4px 6px -1px rgba(16, 185, 129, 0.1),
    0 2px 4px -1px rgba(16, 185, 129, 0.06),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.depth-effect:hover {
  box-shadow: 
    0 10px 15px -3px rgba(16, 185, 129, 0.1),
    0 4px 6px -2px rgba(16, 185, 129, 0.05),
    inset 0 -2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
</style>
