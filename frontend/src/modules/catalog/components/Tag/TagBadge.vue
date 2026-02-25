<template>
    <!-- Badge de tag avec design organique et animations fluides -->
    <span
        :class="[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-sm',
            'transition-all duration-300 ease-out-custom',
            'hover:scale-105 hover:shadow-organic active:scale-95',
            'cursor-pointer select-none',
            sizeClasses,
            variantClasses,
            { 'opacity-60 cursor-not-allowed': disabled }
        ]"
        :style="customStyles"
        @click="handleClick"
        role="button"
        :tabindex="disabled ? -1 : 0"
        @keydown.enter="handleClick"
        @keydown.space.prevent="handleClick"
    >
        <!-- Icône du type de tag -->
        <span v-if="showIcon" class="flex-shrink-0 transition-transform duration-300 group-hover:rotate-12">
            {{ tagIcon }}
        </span>

        <!-- Nom du tag -->
        <span class="truncate">{{ displayName }}</span>

        <!-- Compteur de produits (optionnel) -->
        <span
            v-if="showCount && count !== undefined"
            :class="[
                'ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold',
                'bg-white/30 backdrop-blur-sm',
                'transition-all duration-300'
            ]"
        >
            {{ count }}
        </span>

        <!-- Bouton de suppression (optionnel) -->
        <button
            v-if="removable && !disabled"
            @click.stop="handleRemove"
            :class="[
                'ml-1 flex-shrink-0 w-4 h-4 rounded-full',
                'flex items-center justify-center',
                'hover:bg-white/40 active:bg-white/60',
                'transition-all duration-200 ease-out-custom',
                'focus:outline-none focus:ring-2 focus:ring-white/50'
            ]"
            type="button"
            :aria-label="`Retirer le tag ${name}`"
        >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
    name: string
    type?: 'bio' | 'local' | 'season' | 'promo' | 'custom'
    color?: string
    size?: 'xs' | 'sm' | 'md' | 'lg'
    variant?: 'solid' | 'outline' | 'soft' | 'gradient'
    showIcon?: boolean
    showCount?: boolean
    count?: number
    removable?: boolean
    disabled?: boolean
    clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'custom',
    size: 'md',
    variant: 'soft',
    showIcon: true,
    showCount: false,
    removable: false,
    disabled: false,
    clickable: true
})

// Emits
const emit = defineEmits<{
    click: [name: string]
    remove: [name: string]
}>()

// Computed - Nom affiché
const displayName = computed(() => {
    return props.name.startsWith('#') ? props.name : `#${props.name}`
})

// Computed - Icône selon le type
const tagIcon = computed(() => {
    const icons: Record<string, string> = {
        bio: '🌿',
        local: '📍',
        season: '🍂',
        promo: '🔥',
        custom: '🏷️'
    }
    return icons[props.type] || icons.custom
})

// Computed - Classes de taille
const sizeClasses = computed(() => {
    const sizes = {
        xs: 'text-xs px-2 py-0.5 gap-1',
        sm: 'text-sm px-2.5 py-1 gap-1',
        md: 'text-sm px-3 py-1.5 gap-1.5',
        lg: 'text-base px-4 py-2 gap-2'
    }
    return sizes[props.size]
})

// Computed - Classes de variante
const variantClasses = computed(() => {
    if (props.color) return '' // Si couleur custom, on utilise les styles inline

    const variants: Record<string, Record<string, string>> = {
        bio: {
            solid: 'bg-gradient-to-r from-green-medium to-forest-dark text-white shadow-glow-green',
            outline: 'border-2 border-green-medium text-green-medium bg-white/80 backdrop-blur-sm',
            soft: 'bg-green-light/30 text-forest-dark border border-green-light/50 backdrop-blur-sm',
            gradient: 'bg-gradient-to-r from-green-light via-green-medium to-forest-dark text-white shadow-organic'
        },
        local: {
            solid: 'bg-gradient-to-r from-terracotta to-terracotta-light text-white shadow-organic',
            outline: 'border-2 border-terracotta text-terracotta bg-white/80 backdrop-blur-sm',
            soft: 'bg-terracotta-soft/40 text-terracotta-light border border-terracotta/30 backdrop-blur-sm',
            gradient: 'bg-gradient-to-r from-terracotta-soft via-terracotta to-terracotta-light text-white shadow-organic'
        },
        season: {
            solid: 'bg-gradient-to-r from-cream-dark to-cream-medium text-forest-dark shadow-soft',
            outline: 'border-2 border-cream-dark text-cream-dark bg-white/80 backdrop-blur-sm',
            soft: 'bg-cream-light/60 text-forest-dark border border-cream-medium/40 backdrop-blur-sm',
            gradient: 'bg-gradient-to-r from-cream-light via-cream-medium to-cream-dark text-forest-dark shadow-organic'
        },
        promo: {
            solid: 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-organic',
            outline: 'border-2 border-red-500 text-red-600 bg-white/80 backdrop-blur-sm',
            soft: 'bg-red-50/60 text-red-700 border border-red-200/50 backdrop-blur-sm',
            gradient: 'bg-gradient-to-r from-red-400 via-orange-400 to-red-500 text-white shadow-organic animate-pulse-slow'
        },
        custom: {
            solid: 'bg-gradient-to-r from-nature-500 to-nature-600 text-white shadow-soft',
            outline: 'border-2 border-nature-400 text-nature-700 bg-white/80 backdrop-blur-sm',
            soft: 'bg-nature-100/60 text-nature-800 border border-nature-200/50 backdrop-blur-sm',
            gradient: 'bg-gradient-to-r from-nature-300 via-nature-400 to-nature-500 text-white shadow-organic'
        }
    }

    return variants[props.type]?.[props.variant] || variants.custom[props.variant]
})

// Computed - Styles personnalisés (si couleur fournie)
const customStyles = computed(() => {
    if (!props.color) return {}

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              }
            : { r: 90, g: 140, b: 90 } // Fallback vert nature
    }

    const rgb = hexToRgb(props.color)
    const isLight = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186

    const styles: Record<string, any> = {
        solid: {
            backgroundColor: props.color,
            color: isLight ? '#1e3a22' : '#ffffff',
            boxShadow: `0 4px 14px ${props.color}40`
        },
        outline: {
            borderColor: props.color,
            color: props.color,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderWidth: '2px',
            borderStyle: 'solid'
        },
        soft: {
            backgroundColor: `${props.color}20`,
            color: props.color,
            borderColor: `${props.color}30`,
            borderWidth: '1px',
            borderStyle: 'solid'
        },
        gradient: {
            backgroundImage: `linear-gradient(135deg, ${props.color}dd 0%, ${props.color} 100%)`,
            color: isLight ? '#1e3a22' : '#ffffff',
            boxShadow: `0 8px 20px ${props.color}30`
        }
    }

    return styles[props.variant] || styles.soft
})

// Handlers
const handleClick = () => {
    if (!props.disabled && props.clickable) {
        emit('click', props.name)
    }
}

const handleRemove = () => {
    if (!props.disabled) {
        emit('remove', props.name)
    }
}
</script>

<style scoped>
/* Animations personnalisées pour les badges */
@keyframes pulse-slow {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.85;
    }
}

.animate-pulse-slow {
    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Effet de lueur pour les badges bio */
.shadow-glow-green {
    box-shadow: 0 0 20px rgba(90, 140, 90, 0.4), 0 4px 14px rgba(90, 140, 90, 0.2);
}

.shadow-glow-green:hover {
    box-shadow: 0 0 30px rgba(90, 140, 90, 0.5), 0 8px 20px rgba(90, 140, 90, 0.3);
}

/* Transition fluide personnalisée */
.ease-out-custom {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Ombre organique */
.shadow-organic {
    box-shadow: 0 10px 40px rgba(44, 85, 48, 0.1), 0 2px 10px rgba(167, 211, 151, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.shadow-organic:hover {
    box-shadow: 0 20px 60px rgba(44, 85, 48, 0.15), 0 8px 25px rgba(167, 211, 151, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* Ombre douce */
.shadow-soft {
    box-shadow: 0 4px 20px rgba(44, 85, 48, 0.08);
}

/* Focus accessible */
span:focus {
    outline: 2px solid rgba(90, 140, 90, 0.5);
    outline-offset: 2px;
}

/* Animation d'entrée */
@keyframes badge-enter {
    from {
        opacity: 0;
        transform: scale(0.8) translateY(-10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

span {
    animation: badge-enter 0.3s ease-out-custom;
}
</style>

