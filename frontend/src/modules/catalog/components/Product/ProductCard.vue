<template>
    <div class="product-card-wrapper" :class="[
        `stock-${stockStatus}`,
        {
            'featured': product.is_featured,
            'out-of-stock': product.stock_quantity === 0,
            'low-stock': product.stock_quantity > 0 && product.stock_quantity < 10,
            'selected': isSelected
        }
    ]" @click="handleCardClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <!-- Texture d'arrière-plan organique -->
        <div class="organic-card-background" :style="cardBackgroundStyle"></div>

        <!-- Élément de flottement pour l'animation -->
        <div class="card-floating-element" :style="floatingStyle"></div>

        <!-- En-tête de la carte avec badges -->
        <div class="card-header">
            <!-- Badges en cascade -->
            <div class="badges-container">
                <!-- Badge vedette avec animation de lueur -->
                <div v-if="product.is_featured" class="badge badge-featured animate-gentle-glow">
                    <span class="badge-icon">⭐</span>
                    <span class="badge-text">Coup de cœur</span>
                </div>

                <!-- Badge bio avec animation pulsante -->
                <div v-if="hasTag('bio')" class="badge badge-bio animate-subtle-pulse">
                    <span class="badge-icon">🌱</span>
                    <span class="badge-text">Certifié Bio</span>
                </div>

                <!-- Badge local avec animation de rebond -->
                <div v-if="hasTag('local')" class="badge badge-local" :class="{ 'animate-bounce-soft': isHovered }">
                    <span class="badge-icon">📍</span>
                    <span class="badge-text">Local</span>
                </div>

                <!-- Badge de saison -->
                <div v-if="hasTag('saison')" class="badge badge-season">
                    <span class="badge-icon">📅</span>
                    <span class="badge-text">De saison</span>
                </div>

                <!-- Badge promo -->
                <div v-if="product.discount_price" class="badge badge-promo">
                    <span class="badge-icon">🔥</span>
                    <span class="badge-text">-{{ discountPercentage }}%</span>
                </div>
            </div>

            <!-- Bouton favori avec animation organique -->
            <button class="favorite-btn" :class="{ 'active': isFavorite }" @click.stop="toggleFavorite"
                :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                <div class="heart-container">
                    <div class="heart-background"></div>
                    <svg class="heart-icon" viewBox="0 0 24 24" :class="{ 'filled': isFavorite }">
                        <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill="none" stroke="currentColor" stroke-width="2" />
                    </svg>
                    <div class="heart-particles" v-if="showHeartParticles">
                        <div v-for="n in 8" :key="n" class="particle"></div>
                    </div>
                </div>
            </button>
        </div>

        <!-- Image du produit avec effet de croissance -->
        <div class="product-image-container" :class="{ 'hovered': isHovered }">
            <div class="image-wrapper">
                <!-- Image principale -->
                <img :src="productImage" :alt="product.name" class="product-image" :class="{ 'loading': imageLoading }"
                    @load="handleImageLoad" @error="handleImageError" />

                <!-- Overlay organique pour l'effet de profondeur -->
                <div class="image-overlay"></div>

                <!-- État de stock sur l'image -->
                <div v-if="stockStatus !== 'in-stock'" class="stock-overlay">
                    <div class="stock-badge" :class="stockStatus">
                        {{ stockStatusText }}
                    </div>
                </div>

                <!-- Bouton rapide d'ajout au panier -->
                <transition name="slide-up">
                    <button v-if="isHovered && product.stock_quantity > 0" class="quick-add-btn" @click.stop="addToCart"
                        :disabled="addingToCart">
                        <span v-if="addingToCart" class="add-loading">
                            <div class="spinner"></div>
                        </span>
                        <span v-else class="add-content">
                            <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Ajouter</span>
                        </span>
                    </button>
                </transition>
            </div>

            <!-- Indicateur de rotation (pour les produits rotatifs) -->
            <div v-if="product.is_rotating" class="rotation-indicator">
                <div class="rotation-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <span class="rotation-text">Produit en rotation</span>
            </div>
        </div>

        <!-- Contenu de la carte -->
        <div class="card-content">
            <!-- Catégorie avec animation de croissance -->
            <div class="product-category" v-if="product.category">
                <div class="category-wrapper">
                    <span class="category-icon">🌿</span>
                    <span class="category-name">{{ product.category.name }}</span>
                </div>
                <div class="category-growth" :class="{ 'growing': isHovered }"></div>
            </div>

            <!-- Nom du produit avec animation de soulignement -->
            <h3 class="product-name">
                <span class="name-text">{{ product.name }}</span>
                <div class="name-underline" :class="{ 'active': isHovered }"></div>
            </h3>

            <!-- Description courte avec effet de dévoilement -->
            <div class="product-description">
                <p class="description-text">{{ truncatedDescription }}</p>
                <button v-if="showReadMore" @click.stop="toggleDescription" class="read-more-btn">
                    {{ descriptionExpanded ? 'Moins' : 'Plus' }}
                    <svg class="chevron-icon" :class="{ 'expanded': descriptionExpanded }" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <!-- Producteur et origine avec icônes animées -->
            <div class="product-origin">
                <div class="origin-item">
                    <div class="origin-icon-wrapper">
                        <span class="origin-icon">👨‍🌾</span>
                        <div class="origin-pulse"></div>
                    </div>
                    <div class="origin-info">
                        <span class="origin-label">Producteur</span>
                        <span class="origin-value">{{ product.producer?.name || 'Local' }}</span>
                    </div>
                </div>

                <div class="origin-item" v-if="product.origin">
                    <div class="origin-icon-wrapper">
                        <span class="origin-icon">📍</span>
                        <div class="origin-pulse" style="animation-delay: 0.5s"></div>
                    </div>
                    <div class="origin-info">
                        <span class="origin-label">Provenance</span>
                        <span class="origin-value">{{ product.origin }}</span>
                    </div>
                </div>
            </div>

            <!-- Tags avec animation de vague -->
            <div class="product-tags" v-if="product.tags && product.tags.length > 0">
                <div class="tags-container">
                    <div v-for="(tag, index) in visibleTags" :key="tag.id" class="tag-item"
                        :style="{ animationDelay: `${Number(index) * 0.1}s` }" @mouseenter="tagHoveredIndex = Number(index)"
                        @mouseleave="tagHoveredIndex = -1">
                        <span class="tag-dot" :style="{ backgroundColor: tag.color }"></span>
                        <span class="tag-name">{{ tag.name }}</span>
                    </div>

                    <div v-if="product.tags.length > maxVisibleTags" class="tag-more" @click.stop="showAllTags">
                        +{{ product.tags.length - maxVisibleTags }}
                    </div>
                </div>
            </div>

            <!-- Prix avec animation de fluctuation -->
            <div class="product-pricing">
                <div class="price-main">
                    <!-- Prix actuel avec animation -->
                    <div class="current-price" :class="{ 'has-discount': product.discount_price }">
                        <span class="price-value">{{ formatPrice(displayPrice) }}</span>
                        <span class="price-unit" v-if="product.unit">/{{ product.unit.symbol }}</span>

                        <!-- Animation de prix qui "tombe" -->
                        <div v-if="showPriceAnimation" class="price-animation">
                            <span class="animation-text">Nouveau prix !</span>
                        </div>
                    </div>

                    <!-- Prix barré pour les promotions -->
                    <div v-if="product.discount_price" class="original-price">
                        <span class="strikethrough">{{ formatPrice(product.price) }}</span>
                        <span class="discount-badge">-{{ discountPercentage }}%</span>
                    </div>
                </div>

                <!-- Indicateur de prix compétitif -->
                <div v-if="showPriceComparison" class="price-comparison">
                    <div class="comparison-bar">
                        <div class="comparison-fill" :style="comparisonBarStyle"></div>
                    </div>
                    <span class="comparison-text">
                        {{ priceComparisonText }}
                    </span>
                </div>
            </div>

            <!-- Stock avec barre de progression organique -->
            <div class="product-stock">
                <div class="stock-info">
                    <div class="stock-label">
                        <span class="stock-icon">📦</span>
                        <span>Disponibilité</span>
                    </div>
                    <div class="stock-quantity" :class="stockStatus">
                        {{ product.stock_quantity }} {{ product.unit?.symbol || 'unités' }}
                    </div>
                </div>

                <!-- Barre de progression organique -->
                <div class="stock-progress">
                    <div class="progress-track">
                        <div class="progress-fill" :class="stockStatus" :style="progressFillStyle"></div>

                        <!-- Marqueurs de niveau de stock -->
                        <div class="progress-markers">
                            <div v-for="marker in stockMarkers" :key="marker.label" class="progress-marker"
                                :style="{ left: marker.position + '%' }"
                                :class="{ 'active': stockPercentage >= marker.position }">
                                <div class="marker-tooltip">{{ marker.label }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Légende de stock -->
                    <div class="stock-legend">
                        <div class="legend-item" v-for="level in stockLevels" :key="level.status">
                            <div class="legend-color" :class="level.status"></div>
                            <span class="legend-text">{{ level.label }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions avec animations fluides -->
            <div class="card-actions">
                <!-- Bouton détaillé avec effet de croissance -->
                <button class="action-btn detail-btn" @click.stop="viewDetails" :class="{ 'hovered': isHovered }">
                    <span class="btn-icon">👁️</span>
                    <span class="btn-text">Voir détails</span>
                    <div class="btn-ripple" v-if="showDetailRipple"></div>
                </button>

                <!-- Bouton panier avec animation d'ajout -->
                <button class="action-btn cart-btn" @click.stop="addToCart"
                    :disabled="product.stock_quantity === 0 || addingToCart" :class="[
                        stockStatus,
                        {
                            'adding': addingToCart,
                            'pulse': shouldPulseCartButton
                        }
                    ]">
                    <span class="btn-icon" v-if="!addingToCart">🛒</span>
                    <span class="btn-icon" v-else>
                        <div class="cart-spinner"></div>
                    </span>
                    <span class="btn-text">
                        {{ product.stock_quantity === 0 ? 'Rupture' : addingToCart ? 'Ajout...' : 'Ajouter' }}
                    </span>

                    <!-- Animation de produit qui tombe dans le panier -->
                    <div v-if="showCartAnimation" class="cart-animation">
                        <div class="cart-product"></div>
                    </div>
                </button>

                <!-- Boutons d'action rapide (mobile) -->
                <div class="quick-actions">
                    <button class="quick-action-btn share-btn" @click.stop="shareProduct" title="Partager">
                        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>

                    <button class="quick-action-btn compare-btn" @click.stop="addToCompare" title="Comparer">
                        <svg class="compare-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Indicateur de fraîcheur (animation de goutte) -->
            <div v-if="product.is_fresh" class="freshness-indicator">
                <div class="droplet-container">
                    <div class="droplet" v-for="n in 3" :key="n" :style="{
                        animationDelay: `${n * 0.3}s`,
                        left: `${20 + n * 20}%`
                    }">
                    </div>
                </div>
                <span class="freshness-text">Extrême fraîcheur</span>
            </div>
        </div>

        <!-- Footeur avec informations supplémentaires -->
        <div class="card-footer">
            <!-- Note et avis avec animation d'étoiles -->
            <div class="product-rating" v-if="product.rating">
                <div class="stars-container">
                    <div v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= Math.round(product.rating) }">
                        ⭐
                    </div>
                </div>
                <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
                <span class="rating-count">({{ product.review_count || 0 }})</span>

                <!-- Animation de nouvelle note -->
                <div v-if="showNewReviewAnimation" class="new-review-badge">
                    Nouvel avis !
                </div>
            </div>

            <!-- Date de récolte avec animation de calendrier -->
            <div class="harvest-date" v-if="product.harvest_date">
                <div class="date-container">
                    <span class="date-icon">📅</span>
                    <span class="date-text">Récolté le {{ formatHarvestDate }}</span>
                </div>
                <div class="date-freshness" :class="harvestFreshness"></div>
            </div>

            <!-- Producteur vérifié -->
            <div v-if="product.producer?.verified" class="verified-badge">
                <span class="verified-icon">✅</span>
                <span class="verified-text">Producteur vérifié</span>
            </div>
        </div>

        <!-- Éléments de bordure animés -->
        <div class="border-decoration top"></div>
        <div class="border-decoration right"></div>
        <div class="border-decoration bottom"></div>
        <div class="border-decoration left"></div>

        <!-- Effet de sélection (pour les comparaisons) -->
        <div v-if="isSelected" class="selection-overlay">
            <div class="selection-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/modules/catalog/store/modules/product.store'

interface Props {
    product: any
    viewMode?: 'grid' | 'list' | 'compact'
    showActions?: boolean
    selectable?: boolean
    selected?: boolean
}

interface Emits {
    (e: 'click', product: any): void
    (e: 'add-to-cart', product: any): void
    (e: 'toggle-favorite', product: any): void
    (e: 'select', product: any): void
    (e: 'compare', product: any): void
    (e: 'share', product: any): void
}

const props = withDefaults(defineProps<Props>(), {
    viewMode: 'grid',
    showActions: true,
    selectable: false,
    selected: false
})

const emit = defineEmits<Emits>()

// Stores et router
const productStore = useProductStore()
const router = useRouter()

// États réactifs
const isHovered = ref(false)
const isFavorite = ref(false)
const isSelected = ref(props.selected)
const imageLoading = ref(true)
const addingToCart = ref(false)
const descriptionExpanded = ref(false)
const showHeartParticles = ref(false)
const showPriceAnimation = ref(false)
const showCartAnimation = ref(false)
const showDetailRipple = ref(false)
const showNewReviewAnimation = ref(false)
const tagHoveredIndex = ref(-1)
const hoverStartTime = ref(0)

// Constantes
const maxVisibleTags = 3
const maxDescriptionLength = 80

// Computed properties
const productImage = computed(() => {
    if (props.product.images && props.product.images.length > 0) {
        const primary = props.product.images.find((img: any) => img.is_primary)
        return primary?.url || props.product.images[0]?.url
    }
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f8f4e9"/%3E%3Cpath d="M100,100 Q200,50 300,100 T400,100" stroke="%23a7d397" stroke-width="4" fill="none"/%3E%3Ccircle cx="200" cy="150" r="40" fill="%235a8c5a"/%3E%3C/svg%3E`
})

const stockStatus = computed(() => {
    if (props.product.stock_quantity === 0) return 'out-of-stock'
    if (props.product.stock_quantity < 10) return 'low-stock'
    if (props.product.stock_quantity < 50) return 'limited-stock'
    return 'in-stock'
})

const stockStatusText = computed(() => {
    switch (stockStatus.value) {
        case 'out-of-stock': return 'Rupture'
        case 'low-stock': return 'Stock faible'
        case 'limited-stock': return 'Stock limité'
        default: return 'En stock'
    }
})

const stockPercentage = computed(() => {
    const maxStock = 100 // Valeur maximale pour la visualisation
    return Math.min((props.product.stock_quantity / maxStock) * 100, 100)
})

const progressFillStyle = computed(() => ({
    width: `${stockPercentage.value}%`,
    backgroundColor: getStockColor(stockPercentage.value)
}))

const displayPrice = computed(() => {
    return props.product.discount_price || props.product.price
})

const discountPercentage = computed(() => {
    if (!props.product.discount_price) return 0
    const discount = ((props.product.price - props.product.discount_price) / props.product.price) * 100
    return Math.round(discount)
})

const truncatedDescription = computed(() => {
    if (!props.product.description) return ''
    if (descriptionExpanded.value) return props.product.description
    return props.product.description.length > maxDescriptionLength
        ? props.product.description.substring(0, maxDescriptionLength) + '...'
        : props.product.description
})

const showReadMore = computed(() => {
    return props.product.description && props.product.description.length > maxDescriptionLength
})

const visibleTags = computed(() => {
    return props.product.tags?.slice(0, maxVisibleTags) || []
})

const stockMarkers = computed(() => [
    { label: 'Faible', position: 10 },
    { label: 'Moyen', position: 50 },
    { label: 'Bon', position: 75 },
    { label: 'Excellent', position: 100 }
])

const stockLevels = computed(() => [
    { status: 'out-of-stock', label: 'Rupture' },
    { status: 'low-stock', label: 'Faible (<10)' },
    { status: 'limited-stock', label: 'Limité (10-49)' },
    { status: 'in-stock', label: 'Bon (50+)' }
])

const formatHarvestDate = computed(() => {
    if (!props.product.harvest_date) return ''
    const date = new Date(props.product.harvest_date)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})

const harvestFreshness = computed(() => {
    if (!props.product.harvest_date) return ''
    const harvestDate = new Date(props.product.harvest_date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - harvestDate.getTime()) / (1000 * 3600 * 24))

    if (diffDays < 1) return 'very-fresh'
    if (diffDays < 3) return 'fresh'
    if (diffDays < 7) return 'moderate'
    return 'aged'
})

const showPriceComparison = computed(() => {
    return props.product.price < 50 // Exemple de condition
})

const priceComparisonText = computed(() => {
    if (props.product.price < 10) return 'Prix très attractif'
    if (props.product.price < 30) return 'Bon rapport qualité-prix'
    return 'Prix compétitif'
})

const comparisonBarStyle = computed(() => {
    const percentage = Math.min((props.product.price / 50) * 100, 100)
    return { width: `${percentage}%` }
})

const cardBackgroundStyle = computed(() => {
    const hue = Math.sin(props.product.id * 0.1) * 10 + 120 // Vert varié
    return {
        background: `linear-gradient(135deg, 
      hsl(${hue}, 70%, 85%) 0%, 
      hsl(${hue}, 60%, 92%) 50%, 
      hsl(${hue + 10}, 50%, 88%) 100%)`
    }
})

const floatingStyle = computed(() => ({
    animationDelay: `${(props.product.id % 10) * 0.5}s`
}))

const shouldPulseCartButton = computed(() => {
    return isHovered.value && props.product.stock_quantity > 0 && !addingToCart.value
})

// Méthodes
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 2
    }).format(price)
}

const getStockColor = (percentage: number) => {
    if (percentage === 0) return '#ef4444' // Rouge pour rupture
    if (percentage < 10) return '#f97316' // Orange pour faible
    if (percentage < 50) return '#eab308' // Jaune pour limité
    return '#22c55e' // Vert pour bon stock
}

const hasTag = (tagName: string) => {
    return props.product.tags?.some((tag: any) =>
        tag.name.toLowerCase().includes(tagName.toLowerCase())
    )
}

const handleCardClick = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('.no-card-click')) {
        emit('click', props.product)
    }
}

const handleMouseEnter = () => {
    isHovered.value = true
    hoverStartTime.value = Date.now()
}

const handleMouseLeave = () => {
    isHovered.value = false
    const hoverDuration = Date.now() - hoverStartTime.value
    if (hoverDuration > 1000) {
        // Logique pour le tracking de temps de survol
    }
}

const handleImageLoad = () => {
    imageLoading.value = false
}

const handleImageError = () => {
    imageLoading.value = false
    // On pourrait définir une image de fallback ici
}

const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
    showHeartParticles.value = true

    // Animation des particules
    setTimeout(() => {
        showHeartParticles.value = false
    }, 1000)

    emit('toggle-favorite', props.product)
}

const addToCart = async () => {
    if (props.product.stock_quantity === 0 || addingToCart.value) return

    addingToCart.value = true
    showCartAnimation.value = true

    try {
        // Simulation d'ajout au panier
        await new Promise(resolve => setTimeout(resolve, 800))
        emit('add-to-cart', props.product)

        // Animation de succès
        setTimeout(() => {
            showCartAnimation.value = false
            addingToCart.value = false
        }, 300)
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error)
        addingToCart.value = false
        showCartAnimation.value = false
    }
}

const viewDetails = () => {
    showDetailRipple.value = true
    setTimeout(() => {
        showDetailRipple.value = false
    }, 600)

    router.push(`/catalog/products/${props.product.id}`)
}

const toggleDescription = () => {
    descriptionExpanded.value = !descriptionExpanded.value
}

const showAllTags = () => {
    // Afficher tous les tags dans une modal ou tooltip
    console.log('Tous les tags:', props.product.tags)
}

const shareProduct = () => {
    if (navigator.share) {
        navigator.share({
            title: props.product.name,
            text: `Découvrez ${props.product.name} - ${props.product.description?.substring(0, 100)}...`,
            url: window.location.origin + `/catalog/products/${props.product.id}`
        })
    } else {
        // Fallback pour copier le lien
        navigator.clipboard.writeText(window.location.origin + `/catalog/products/${props.product.id}`)
        // Afficher un toast de confirmation
    }

    emit('share', props.product)
}

const addToCompare = () => {
    isSelected.value = !isSelected.value
    emit('select', props.product)
    emit('compare', props.product)
}

// Cycle de vie
onMounted(() => {
    // Vérifier si le produit est dans les favoris
    const favorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]')
    isFavorite.value = favorites.some((fav: any) => fav.id === props.product.id)

    // Animation initiale
    setTimeout(() => {
        showPriceAnimation.value = true
        setTimeout(() => {
            showPriceAnimation.value = false
        }, 2000)
    }, 500)

    // Animation aléatoire de nouvelle review
    if (Math.random() > 0.7) {
        setTimeout(() => {
            showNewReviewAnimation.value = true
            setTimeout(() => {
                showNewReviewAnimation.value = false
            }, 3000)
        }, 2000)
    }
})

onUnmounted(() => {
    // Nettoyage si nécessaire
})

// Watch
watch(() => props.selected, (newVal) => {
    isSelected.value = newVal
})
</script>

<style scoped>
.product-card-wrapper {
    @apply relative bg-gradient-naturel rounded-3xl border border-green-light/30 shadow-organic overflow-hidden cursor-pointer transform-gpu transition-all duration-500 ease-organic hover:shadow-organic-hover hover:scale-[1.02] hover:border-green-soft/50;
}

.product-card-wrapper.featured {
    @apply border-green-soft shadow-glow-green;
}

.product-card-wrapper.out-of-stock {
    @apply opacity-80;
}

.product-card-wrapper.selected {
    @apply ring-2 ring-green-soft ring-offset-2;
}

/* Arrière-plan organique */
.organic-card-background {
    @apply absolute inset-0 opacity-30;
    background-size: 200% 200%;
    animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

.card-floating-element {
    @apply absolute top-4 right-4 w-8 h-8 rounded-full bg-green-soft/20;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-10px) rotate(180deg);
    }
}

/* En-tête de la carte */
.card-header {
    @apply flex justify-between items-start p-4 relative z-10;
}

.badges-container {
    @apply flex flex-wrap gap-2;
}

.badge {
    @apply flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 ease-organic hover:scale-105;
}

.badge-featured {
    @apply bg-gradient-to-r from-yellow-400 to-orange-400 text-white;
}

.badge-bio {
    @apply bg-green-soft/30 text-green-medium border border-green-soft/50;
}

.badge-local {
    @apply bg-terracotta/20 text-terracotta border border-terracotta/30;
}

.badge-season {
    @apply bg-accent-orange/20 text-accent-orange border border-accent-orange/30;
}

.badge-promo {
    @apply bg-red-500/20 text-red-600 border border-red-500/30;
}

.badge-icon {
    @apply text-xs;
}

.badge-text {
    @apply font-semibold;
}

/* Bouton favori */
.favorite-btn {
    @apply relative w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-green-light/30 flex items-center justify-center transition-all duration-300 ease-organic hover:bg-pink-50 hover:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200;
}

.favorite-btn.active {
    @apply bg-pink-100 border-pink-400;
}

.heart-container {
    @apply relative;
}

.heart-icon {
    @apply w-6 h-6 transition-all duration-300 ease-organic;
}

.heart-icon.filled {
    @apply text-red-500 fill-red-500;
    animation: heart-beat 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes heart-beat {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }
}

.heart-particles {
    @apply absolute inset-0 pointer-events-none;
}

.particle {
    @apply absolute w-1 h-1 rounded-full bg-pink-500;
    animation: particle-pop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes particle-pop {
    0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(var(--tx), var(--ty)) scale(0);
    }
}

/* Image du produit */
.product-image-container {
    @apply relative px-4;
}

.image-wrapper {
    @apply relative overflow-hidden rounded-2xl aspect-square transition-all duration-500 ease-organic;
}

.product-image-container.hovered .image-wrapper {
    @apply transform scale-105;
}

.product-image {
    @apply w-full h-full object-cover transition-all duration-700 ease-organic;
}

.product-image.loading {
    @apply animate-pulse bg-green-light/30;
}

.image-overlay {
    @apply absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 ease-organic;
}

.product-image-container.hovered .image-overlay {
    @apply opacity-100;
}

.stock-overlay {
    @apply absolute top-3 left-3;
}

.stock-badge {
    @apply px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm;
}

.stock-badge.out-of-stock {
    @apply bg-red-500/90;
}

.stock-badge.low-stock {
    @apply bg-orange-500/90;
}

.stock-badge.limited-stock {
    @apply bg-yellow-500/90;
}

.stock-badge.in-stock {
    @apply bg-green-600/90;
}

.quick-add-btn {
    @apply absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-green-light/30 text-green-medium font-medium flex items-center gap-2 transition-all duration-300 ease-organic hover:bg-green-soft hover:text-white hover:shadow-organic focus:outline-none focus:ring-2 focus:ring-green-soft/50;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
    opacity: 0;
    transform: translate(-50%, 20px);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translate(-50%, 20px);
}

.add-loading .spinner {
    @apply w-4 h-4 border-2 border-green-soft/30 border-t-green-soft rounded-full animate-spin;
}

.rotation-indicator {
    @apply flex items-center justify-center gap-2 mt-2 text-xs text-green-medium;
}

.rotation-dots {
    @apply flex gap-1;
}

.rotation-dots .dot {
    @apply w-1 h-1 rounded-full bg-green-soft;
    animation: rotation-dot 1.5s ease-in-out infinite;
}

.rotation-dots .dot:nth-child(2) {
    animation-delay: 0.2s;
}

.rotation-dots .dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes rotation-dot {

    0%,
    100% {
        opacity: 0.3;
    }

    50% {
        opacity: 1;
    }
}

/* Contenu de la carte */
.card-content {
    @apply p-4 space-y-3 relative z-10;
}

.product-category {
    @apply relative;
}

.category-wrapper {
    @apply flex items-center gap-2 text-green-medium text-sm font-medium;
}

.category-growth {
    @apply absolute bottom-0 left-0 h-0.5 bg-green-soft/30 rounded-full transition-all duration-500 ease-organic;
    width: 0;
}

.category-growth.growing {
    @apply w-full;
}

.product-name {
    @apply relative;
}

.name-text {
    @apply text-lg font-bold text-forest-dark line-clamp-1;
}

.name-underline {
    @apply absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-soft to-green-light transition-all duration-500 ease-organic;
    width: 0;
}

.name-underline.active {
    @apply w-full;
}

.product-description {
    @apply relative;
}

.description-text {
    @apply text-sm text-green-medium/80 line-clamp-2 mb-1;
}

.read-more-btn {
    @apply flex items-center gap-1 text-xs text-green-medium hover:text-forest-dark transition-colors duration-300;
}

.chevron-icon {
    @apply w-3 h-3 transition-transform duration-300;
}

.chevron-icon.expanded {
    @apply transform rotate-180;
}

.product-origin {
    @apply space-y-2;
}

.origin-item {
    @apply flex items-center gap-3;
}

.origin-icon-wrapper {
    @apply relative;
}

.origin-icon {
    @apply text-lg;
}

.origin-pulse {
    @apply absolute inset-0 rounded-full border border-green-soft/50;
    animation: pulse 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.5;
        transform: scale(1);
    }

    50% {
        opacity: 0;
        transform: scale(1.5);
    }
}

.origin-info {
    @apply flex flex-col;
}

.origin-label {
    @apply text-xs text-green-medium/70;
}

.origin-value {
    @apply text-sm font-medium text-forest-dark;
}

.product-tags {
    @apply mt-2;
}

.tags-container {
    @apply flex flex-wrap gap-2;
}

.tag-item {
    @apply flex items-center gap-1 px-2 py-1 rounded-full bg-green-light/20 text-xs text-green-medium transition-all duration-300 ease-organic hover:scale-105 hover:bg-green-light/30;
    animation: tag-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes tag-enter {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.tag-dot {
    @apply w-2 h-2 rounded-full;
}

.tag-name {
    @apply font-medium;
}

.tag-more {
    @apply px-2 py-1 rounded-full bg-cream-medium text-forest-dark text-xs font-medium cursor-pointer hover:bg-cream-dark transition-colors duration-300;
}

/* Prix */
.product-pricing {
    @apply space-y-2;
}

.price-main {
    @apply flex items-center gap-2;
}

.current-price {
    @apply flex items-center gap-1;
}

.price-value {
    @apply text-xl font-bold text-forest-dark;
}

.price-unit {
    @apply text-sm text-green-medium/70;
}

.current-price.has-discount .price-value {
    @apply text-green-600;
}

.price-animation {
    @animate absolute -top-6 right-0 px-2 py-1 bg-green-soft/20 rounded-full text-xs text-green-medium font-medium;
    animation: price-drop 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes price-drop {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.original-price {
    @apply flex items-center gap-2;
}

.strikethrough {
    @apply text-sm text-green-medium/50 line-through;
}

.discount-badge {
    @apply px-2 py-0.5 bg-red-500/20 text-red-600 text-xs font-bold rounded-full;
}

.price-comparison {
    @apply space-y-1;
}

.comparison-bar {
    @apply h-1 bg-green-light/20 rounded-full overflow-hidden;
}

.comparison-fill {
    @apply h-full bg-gradient-to-r from-green-soft to-green-light rounded-full transition-all duration-1000 ease-organic;
}

.comparison-text {
    @apply text-xs text-green-medium/70;
}

/* Stock */
.product-stock {
    @apply space-y-2;
}

.stock-info {
    @apply flex justify-between items-center;
}

.stock-label {
    @apply flex items-center gap-2 text-sm text-green-medium;
}

.stock-quantity {
    @apply text-sm font-bold;
}

.stock-quantity.out-of-stock {
    @apply text-red-500;
}

.stock-quantity.low-stock {
    @apply text-orange-500;
}

.stock-quantity.limited-stock {
    @apply text-yellow-600;
}

.stock-quantity.in-stock {
    @apply text-green-600;
}

.stock-progress {
    @apply space-y-2;
}

.progress-track {
    @apply h-2 bg-green-light/20 rounded-full relative overflow-hidden;
}

.progress-fill {
    @apply h-full rounded-full transition-all duration-1000 ease-organic;
}

.progress-fill.out-of-stock {
    @apply bg-red-500;
}

.progress-fill.low-stock {
    @apply bg-orange-500;
}

.progress-fill.limited-stock {
    @apply bg-yellow-500;
}

.progress-fill.in-stock {
    @apply bg-green-500;
}

.progress-markers {
    @apply absolute inset-0;
}

.progress-marker {
    @apply absolute w-0.5 h-3 -translate-x-1/2 -translate-y-1/2 transition-all duration-300;
}

.progress-marker::before {
    content: '';
    @apply absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-2 h-2 rounded-full bg-current opacity-30;
}

.progress-marker.active::before {
    @apply opacity-100;
}

.marker-tooltip {
    @apply absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-forest-dark text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-300;
    white-space: nowrap;
}

.progress-marker:hover .marker-tooltip {
    @apply opacity-100;
}

.stock-legend {
    @apply flex justify-between text-xs text-green-medium/70;
}

.legend-item {
    @apply flex items-center gap-1;
}

.legend-color {
    @apply w-2 h-2 rounded-full;
}

.legend-color.out-of-stock {
    @apply bg-red-500;
}

.legend-color.low-stock {
    @apply bg-orange-500;
}

.legend-color.limited-stock {
    @apply bg-yellow-500;
}

.legend-color.in-stock {
    @apply bg-green-500;
}

/* Actions */
.card-actions {
    @apply flex gap-2 pt-2;
}

.action-btn {
    @apply flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-organic focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.detail-btn {
    @apply bg-gradient-naturel border border-green-light/30 text-green-medium hover:bg-green-soft/10 hover:border-green-soft hover:text-forest-dark focus:ring-green-soft;
}

.detail-btn.hovered {
    animation: detail-pulse 2s infinite;
}

@keyframes detail-pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(167, 211, 151, 0.4);
    }

    50% {
        box-shadow: 0 0 0 4px rgba(167, 211, 151, 0);
    }
}

.btn-ripple {
    @apply absolute inset-0 rounded-xl;
    background: radial-gradient(circle, rgba(167, 211, 151, 0.4) 0%, transparent 70%);
    animation: ripple 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes ripple {
    from {
        transform: scale(0);
        opacity: 1;
    }

    to {
        transform: scale(1);
        opacity: 0;
    }
}

.cart-btn {
    @apply bg-gradient-vert text-white hover:shadow-organic-hover focus:ring-green-soft disabled:opacity-50 disabled:cursor-not-allowed;
}

.cart-btn.pulse {
    animation: cart-pulse 1.5s infinite;
}

@keyframes cart-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.cart-btn.adding {
    @apply opacity-70;
}

.cart-spinner {
    @apply w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin;
}

.cart-animation {
    @apply absolute inset-0 overflow-hidden;
}

.cart-product {
    @apply absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full;
    animation: fly-to-cart 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fly-to-cart {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(calc(50vw - 50%), calc(-100vh - 50%)) scale(0.1);
    }
}

.quick-actions {
    @apply flex gap-1;
}

.quick-action-btn {
    @apply p-2 rounded-lg border border-green-light/30 text-green-medium hover:bg-green-soft/10 hover:border-green-soft hover:text-forest-dark transition-all duration-300 ease-organic;
}

.share-icon,
.compare-icon {
    @apply w-4 h-4;
}

/* Indicateur de fraîcheur */
.freshness-indicator {
    @apply flex items-center justify-center gap-2 p-2 bg-green-soft/10 rounded-lg;
}

.droplet-container {
    @apply relative h-4;
}

.droplet {
    @apply absolute w-3 h-3 bg-blue-400/50 rounded-full;
    animation: droplet-fall 1.5s ease-in-out infinite;
}

@keyframes droplet-fall {

    0%,
    100% {
        transform: translateY(0) scale(1);
        opacity: 0.3;
    }

    50% {
        transform: translateY(8px) scale(1.2);
        opacity: 1;
    }
}

.freshness-text {
    @apply text-xs font-medium text-green-medium;
}

/* Pied de carte */
.card-footer {
    @apply p-4 border-t border-green-light/20 space-y-2;
}

.product-rating {
    @apply flex items-center gap-2;
}

.stars-container {
    @apply flex gap-0.5;
}

.star {
    @apply text-sm text-yellow-400;
}

.star.filled {
    animation: star-twinkle 0.5s ease-out;
}

@keyframes star-twinkle {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }
}

.rating-value {
    @apply font-bold text-forest-dark;
}

.rating-count {
    @apply text-xs text-green-medium/70;
}

.new-review-badge {
    @animate ml-2 px-2 py-0.5 bg-green-soft/20 text-green-medium text-xs rounded-full;
    animation: badge-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.harvest-date {
    @apply flex items-center justify-between;
}

.date-container {
    @apply flex items-center gap-2 text-sm text-green-medium;
}

.date-freshness {
    @apply w-3 h-3 rounded-full;
}

.date-freshness.very-fresh {
    @apply bg-green-500 animate-pulse;
}

.date-freshness.fresh {
    @apply bg-green-400;
}

.date-freshness.moderate {
    @apply bg-yellow-400;
}

.date-freshness.aged {
    @apply bg-orange-400;
}

.verified-badge {
    @apply flex items-center gap-2 text-sm text-green-600;
}

/* Bordures décoratives */
.border-decoration {
    @apply absolute bg-gradient-to-r from-green-soft via-green-light to-green-soft transition-all duration-1000 ease-organic;
    opacity: 0;
}

.product-card-wrapper:hover .border-decoration {
    opacity: 0.3;
}

.border-decoration.top {
    @apply top-0 left-0 right-0 h-0.5;
    transform: scaleX(0);
}

.product-card-wrapper:hover .border-decoration.top {
    transform: scaleX(1);
}

.border-decoration.right {
    @apply top-0 right-0 bottom-0 w-0.5;
    transform: scaleY(0);
}

.product-card-wrapper:hover .border-decoration.right {
    transform: scaleY(1);
}

.border-decoration.bottom {
    @apply bottom-0 left-0 right-0 h-0.5;
    transform: scaleX(0);
}

.product-card-wrapper:hover .border-decoration.bottom {
    transform: scaleX(1);
}

.border-decoration.left {
    @apply top-0 left-0 bottom-0 w-0.5;
    transform: scaleY(0);
}

.product-card-wrapper:hover .border-decoration.left {
    transform: scaleY(1);
}

/* Overlay de sélection */
.selection-overlay {
    @apply absolute inset-0 bg-green-soft/10 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-300;
}

.product-card-wrapper.selected .selection-overlay {
    @apply opacity-100;
}

.selection-check {
    @apply w-12 h-12 rounded-full bg-green-soft flex items-center justify-center text-white transform scale-0 transition-transform duration-300 ease-bounce;
}

.product-card-wrapper.selected .selection-check {
    @apply scale-100;
}

.selection-check svg {
    @apply w-6 h-6;
}

/* Responsive */
@media (max-width: 640px) {
    .card-actions {
        @apply flex-col;
    }

    .quick-actions {
        @apply justify-center mt-2;
    }

    .product-image-container {
        @apply px-2;
    }

    .card-content,
    .card-footer {
        @apply p-3;
    }
}
</style>
