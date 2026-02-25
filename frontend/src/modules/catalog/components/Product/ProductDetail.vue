<template>
    <div class="product-detail-wrapper">
        <!-- Arrière-plan organique avec animation de feuilles -->
        <div class="organic-background">
            <div class="leaf-animation"></div>
            <div class="gradient-overlay"></div>
        </div>

        <!-- Navigation fluide avec breadcrumb organique -->
        <nav class="product-navigation animate-slide-in-down">
            <div class="nav-container">
                <!-- Breadcrumb avec animation de croissance -->
                <div class="breadcrumb-trail">
                    <router-link to="/catalog" class="breadcrumb-item">
                        <span class="crumb-icon">🏠</span>
                        <span class="crumb-text">Catalogue</span>
                    </router-link>

                    <div class="crumb-separator animate-pulse-soft">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>

                    <router-link v-if="product.category" :to="`/catalog?category=${product.category.id}`"
                        class="breadcrumb-item">
                        <span class="crumb-icon">🌿</span>
                        <span class="crumb-text">{{ product.category.name }}</span>
                    </router-link>

                    <div class="crumb-separator animate-pulse-soft">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>

                    <div class="breadcrumb-item active">
                        <span class="crumb-icon">🍎</span>
                        <span class="crumb-text">{{ product.name }}</span>
                    </div>
                </div>

                <!-- Actions de navigation -->
                <div class="nav-actions">
                    <button @click="goBack" class="nav-action-btn back-btn" title="Retour">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Retour</span>
                    </button>

                    <button @click="shareProduct" class="nav-action-btn share-btn" title="Partager">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>

                    <button @click="toggleFavorite" class="nav-action-btn favorite-btn" :class="{ active: isFavorite }"
                        :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                :class="{ 'filled': isFavorite }" />
                        </svg>
                    </button>

                    <button @click="printPage" class="nav-action-btn print-btn" title="Imprimer">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Contenu principal avec disposition organique -->
        <main class="product-main-content">
            <!-- Section supérieure : Image et informations essentielles -->
            <div class="product-hero-section animate-fade-in">
                <div class="hero-container">
                    <!-- Galerie d'images avec vue principale -->
                    <div class="product-gallery">
                        <!-- Image principale avec zoom organique -->
                        <div class="main-image-container" @mouseenter="enableZoom" @mouseleave="disableZoom"
                            @mousemove="handleZoom">
                            <img :src="mainImageUrl" :alt="product.name" class="main-product-image"
                                :class="{ 'zooming': isZooming }" ref="mainImage" />

                            <!-- Overlay de zoom -->
                            <div v-if="isZooming" class="zoom-overlay" :style="zoomOverlayStyle"></div>

                            <!-- Badges sur l'image -->
                            <div class="image-badges">
                                <div v-if="product.is_featured" class="image-badge featured animate-gentle-glow">
                                    <span class="badge-icon">⭐</span>
                                    <span class="badge-text">Coup de cœur</span>
                                </div>

                                <div v-if="stockStatus === 'low-stock'"
                                    class="image-badge low-stock animate-pulse-soft">
                                    <span class="badge-icon">⚡</span>
                                    <span class="badge-text">Stock limité</span>
                                </div>

                                <div v-if="product.discount_price" class="image-badge discount animate-bounce-soft">
                                    <span class="badge-icon">🔥</span>
                                    <span class="badge-text">-{{ discountPercentage }}%</span>
                                </div>
                            </div>

                            <!-- Contrôles d'image -->
                            <div class="image-controls">
                                <button @click="previousImage" class="image-control-btn prev-btn"
                                    :disabled="currentImageIndex === 0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button @click="nextImage" class="image-control-btn next-btn"
                                    :disabled="currentImageIndex === product.images.length - 1">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <button @click="toggleFullscreen" class="image-control-btn fullscreen-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Miniatures avec animation de sélection -->
                        <div class="image-thumbnails">
                            <div v-for="(image, index) in product.images" :key="image.id || index"
                                @click="selectImage(Number(index))" class="thumbnail-item" :class="{
                                    'active': currentImageIndex === index,
                                    'loading': thumbnailLoading[index]
                                }">
                                <img :src="image.url" :alt="image.alt_text || product.name" class="thumbnail-image"
                                    @load="handleThumbnailLoad(Number(index))" />
                                <div class="thumbnail-overlay"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Informations principales avec animations organiques -->
                    <div class="product-essential-info">
                        <!-- En-tête avec nom et catégorie -->
                        <div class="product-header">
                            <div class="category-badge" :style="categoryStyle">
                                <span class="category-icon">🌿</span>
                                <span class="category-name">{{ product.category?.name }}</span>
                            </div>

                            <h1 class="product-title animate-typewriter">
                                {{ product.name }}
                            </h1>

                            <div class="product-subtitle">
                                <span class="subtitle-text">{{ product.origin || 'Production locale' }}</span>
                                <div class="subtitle-divider"></div>
                                <span class="subtitle-text" v-if="product.harvest_date">
                                    Récolté le {{ formatHarvestDate }}
                                </span>
                            </div>
                        </div>

                        <!-- Évaluation avec animations d'étoiles -->
                        <div class="product-rating-section" v-if="product.rating">
                            <div class="rating-display">
                                <div class="stars-container">
                                    <div v-for="n in 5" :key="n" class="star" :class="{
                                        'filled': n <= Math.round(product.rating),
                                        'twinkling': isHovered
                                    }" @mouseenter="starHoverIndex = n" @mouseleave="starHoverIndex = 0">
                                        ⭐
                                    </div>
                                </div>

                                <div class="rating-details">
                                    <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
                                    <span class="rating-count">
                                        ({{ totalReviewCount }} avis)
                                    </span>

                                    <div v-if="showRatingAnimation" class="rating-animation">
                                        <span class="animation-text">Nouvel avis !</span>
                                    </div>
                                </div>
                            </div>

                            <button @click="scrollToReviews" class="rating-action-btn">
                                Voir tous les avis
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Description avec effet de dévoilement -->
                        <div class="product-description-section">
                            <div class="section-header">
                                <h3 class="section-title">
                                    <span class="title-icon">📝</span>
                                    Sa saveur, son histoire
                                </h3>
                                <div class="section-decoration"></div>
                            </div>

                            <div class="description-content">
                                <p class="description-text" :class="{ 'expanded': descriptionExpanded }"
                                    ref="descriptionText">
                                    {{ product.description || 'Aucune description disponible.' }}
                                </p>

                                <button v-if="showReadMore" @click="toggleDescription" class="read-more-btn">
                                    {{ descriptionExpanded ? 'Réduire' : 'Lire la suite' }}
                                    <svg class="chevron-icon" :class="{ 'expanded': descriptionExpanded }"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Mots-clés avec animation de vague -->
                            <div class="description-keywords" v-if="product.tags && product.tags.length > 0">
                                <div class="keywords-container">
                                    <div v-for="(tag, index) in product.tags" :key="tag.id" class="keyword-item" :style="{
                                        animationDelay: `${Number(index) * 0.1}s`,
                                        '--tag-color': tag.color || '#5a8c5a'
                                    }" @mouseenter="keywordHoverIndex = Number(index)" @mouseleave="keywordHoverIndex = -1">
                                        <span class="keyword-icon">{{ getTagIcon(tag.name) }}</span>
                                        <span class="keyword-text">{{ tag.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Prix avec animation de fluctuation -->
                        <div class="product-pricing-section">
                            <div class="pricing-container">
                                <div class="current-pricing">
                                    <div class="price-display" :class="{ 'has-discount': product.discount_price }">
                                        <span class="price-value">{{ formatPrice(displayPrice) }}</span>
                                        <span class="price-unit" v-if="product.unit">
                                            /{{ product.unit.symbol }}
                                        </span>

                                        <!-- Animation de fluctuation de prix -->
                                        <div v-if="showPriceFluctuation" class="price-fluctuation"
                                            :class="fluctuationDirection">
                                            <span class="fluctuation-icon">
                                                {{ fluctuationDirection === 'up' ? '📈' : '📉' }}
                                            </span>
                                            <span class="fluctuation-text">
                                                {{ fluctuationDirection === 'up' ? '+3.5%' : '-2.1%' }}
                                            </span>
                                        </div>
                                    </div>

                                    <div v-if="product.discount_price" class="original-pricing">
                                        <span class="original-price">
                                            {{ formatPrice(product.price) }}
                                        </span>
                                        <span class="discount-percentage">
                                            -{{ discountPercentage }}%
                                        </span>

                                        <!-- Compte à rebours de promotion -->
                                        <div v-if="showPromotionTimer" class="promotion-timer">
                                            <div class="timer-icon">⏰</div>
                                            <div class="timer-display">
                                                <span class="timer-label">Fin dans :</span>
                                                <span class="timer-value">{{ promotionTimeLeft }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Comparaison de prix avec animation -->
                                <div class="price-comparison" v-if="showPriceComparison">
                                    <div class="comparison-chart">
                                        <div class="chart-bar market-price">
                                            <span class="bar-label">Prix moyen</span>
                                            <div class="bar-fill" :style="{ width: '70%' }"></div>
                                            <span class="bar-value">{{ formatPrice(marketPrice) }}</span>
                                        </div>

                                        <div class="chart-bar our-price">
                                            <span class="bar-label">Notre prix</span>
                                            <div class="bar-fill" :style="{ width: comparisonWidth }"></div>
                                            <span class="bar-value">{{ formatPrice(displayPrice) }}</span>
                                        </div>
                                    </div>

                                    <div class="comparison-savings" v-if="showSavings">
                                        <span class="savings-icon">💰</span>
                                        <span class="savings-text">
                                            Économisez {{ formatPrice(savingsAmount) }} !
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Stock avec barre de progression organique -->
                        <div class="product-stock-section">
                            <div class="stock-header">
                                <h4 class="stock-title">
                                    <span class="title-icon">📦</span>
                                    Disponibilité
                                </h4>

                                <div class="stock-status" :class="stockStatus">
                                    <span class="status-icon">{{ getStockIcon }}</span>
                                    <span class="status-text">{{ stockStatusText }}</span>
                                </div>
                            </div>

                            <div class="stock-progress">
                                <div class="progress-container">
                                    <div class="progress-track">
                                        <div class="progress-fill" :class="stockStatus" :style="progressFillStyle">
                                        </div>

                                        <!-- Marqueurs de niveau de stock -->
                                        <div class="progress-markers">
                                            <div v-for="marker in stockMarkers" :key="marker.label"
                                                class="progress-marker" :style="{ left: marker.position + '%' }"
                                                :class="{ 'active': stockPercentage >= marker.position }">
                                                <div class="marker-tooltip">{{ marker.label }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="progress-info">
                                        <span class="stock-quantity">
                                            {{ product.stock_quantity }} {{ product.unit?.symbol || 'unités' }}
                                            disponibles
                                        </span>

                                        <div class="stock-warning" v-if="stockStatus === 'low-stock'">
                                            <span class="warning-icon">⚠️</span>
                                            <span class="warning-text">Dernières unités !</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Prévision de réapprovisionnement -->
                                <div v-if="showRestockInfo" class="restock-info">
                                    <div class="restock-icon">🚚</div>
                                    <div class="restock-details">
                                        <span class="restock-label">Prochain approvisionnement :</span>
                                        <span class="restock-date">{{ restockDate }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions d'achat avec animations fluides -->
                        <div class="product-actions-section">
                            <div class="quantity-selector">
                                <div class="selector-header">
                                    <span class="selector-label">Quantité</span>
                                    <span class="selector-hint">({{ product.min_order || 1 }} min)</span>
                                </div>

                                <div class="quantity-controls">
                                    <button @click="decreaseQuantity" :disabled="quantity <= (product.min_order || 1)"
                                        class="quantity-btn decrease-btn">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M20 12H4" />
                                        </svg>
                                    </button>

                                    <div class="quantity-display">
                                        <input v-model.number="quantity" type="number" :min="product.min_order || 1"
                                            :max="product.max_order || product.stock_quantity" class="quantity-input"
                                            @change="validateQuantity" />
                                        <span class="quantity-unit">{{ product.unit?.symbol || 'unité' }}</span>
                                    </div>

                                    <button @click="increaseQuantity"
                                        :disabled="quantity >= (product.max_order || product.stock_quantity)"
                                        class="quantity-btn increase-btn">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Indicateur de progression pour les quantités -->
                                <div class="quantity-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" :style="quantityProgressStyle"></div>
                                    </div>

                                    <div class="progress-labels">
                                        <span class="min-label">{{ product.min_order || 1 }}</span>
                                        <span class="current-label">{{ quantity }}</span>
                                        <span class="max-label">{{ product.max_order || product.stock_quantity }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions principales -->
                            <div class="action-buttons">
                                <button @click="addToCart" class="action-btn add-to-cart-btn"
                                    :disabled="product.stock_quantity === 0 || addingToCart" :class="[
                                        stockStatus,
                                        {
                                            'adding': addingToCart,
                                            'pulse': shouldPulseCartButton
                                        }
                                    ]">
                                    <div class="btn-content">
                                        <span class="btn-icon" v-if="!addingToCart">🛒</span>
                                        <div v-else class="btn-spinner"></div>
                                        <span class="btn-text">
                                            {{ product.stock_quantity === 0 ? 'Rupture de stock' : addingToCart ? 'Ajout en cours...' : 'Ajouter au panier' }}
                                        </span>
                                    </div>

                                    <div class="btn-details">
                                        <span class="btn-price">{{ formatPrice(totalPrice) }}</span>
                                        <span class="btn-quantity">× {{ quantity }}</span>
                                    </div>

                                    <!-- Animation d'ajout -->
                                    <div v-if="showCartAnimation" class="cart-animation">
                                        <div class="animation-product"></div>
                                    </div>
                                </button>

                                <button @click="buyNow" class="action-btn buy-now-btn"
                                    :disabled="product.stock_quantity === 0" :class="stockStatus">
                                    <span class="btn-icon">⚡</span>
                                    <span class="btn-text">Acheter maintenant</span>
                                </button>

                                <div class="secondary-actions">
                                    <button @click="addToWishlist" class="secondary-btn wishlist-btn"
                                        :class="{ 'active': inWishlist }" title="Ajouter à la liste d'envies">
                                        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    <button @click="addToCompare" class="secondary-btn compare-btn"
                                        :class="{ 'active': inComparison }" title="Comparer">
                                        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </button>

                                    <button @click="requestNotification" class="secondary-btn notify-btn"
                                        :class="{ 'active': notificationsEnabled }"
                                        title="Être notifié du réapprovisionnement">
                                        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Garanties et assurances -->
                            <div class="product-guarantees">
                                <div class="guarantee-item">
                                    <span class="guarantee-icon">🚚</span>
                                    <span class="guarantee-text">Livraison gratuite dès 50 FCFA</span>
                                </div>

                                <div class="guarantee-item">
                                    <span class="guarantee-icon">↩️</span>
                                    <span class="guarantee-text">Retour gratuit sous 14 jours</span>
                                </div>

                                <div class="guarantee-item">
                                    <span class="guarantee-icon">🔒</span>
                                    <span class="guarantee-text">Paiement 100% sécurisé</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section producteur avec carte interactive -->
            <div class="producer-section animate-slide-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="title-icon">👨‍🌾</span>
                        Rencontrez le producteur
                    </h2>
                    <div class="section-decoration"></div>
                </div>

                <div class="producer-container">
                    <!-- Carte producteur -->
                    <div class="producer-card">
                        <div class="producer-avatar">
                            <img :src="producerImage" :alt="product.producer?.name" class="avatar-image" />
                            <div class="avatar-badge" v-if="product.producer?.verified">
                                <span class="badge-icon">✅</span>
                            </div>
                        </div>

                        <div class="producer-info">
                            <h3 class="producer-name">{{ product.producer?.name || 'Producteur local' }}</h3>

                            <div class="producer-stats">
                                <div class="stat-item">
                                    <span class="stat-icon">⭐</span>
                                    <div class="stat-content">
                                        <span class="stat-value">4.8</span>
                                        <span class="stat-label">Note</span>
                                    </div>
                                </div>

                                <div class="stat-item">
                                    <span class="stat-icon">👥</span>
                                    <div class="stat-content">
                                        <span class="stat-value">250+</span>
                                        <span class="stat-label">Clients</span>
                                    </div>
                                </div>

                                <div class="stat-item">
                                    <span class="stat-icon">🌱</span>
                                    <div class="stat-content">
                                        <span class="stat-value">5 ans</span>
                                        <span class="stat-label">Expérience</span>
                                    </div>
                                </div>
                            </div>

                            <p class="producer-description">
                                {{ producerDescription }}
                            </p>

                            <div class="producer-actions">
                                <button @click="viewProducerProfile" class="producer-action-btn profile-btn">
                                    <span class="btn-icon">👁️</span>
                                    <span class="btn-text">Voir le profil</span>
                                </button>

                                <button @click="contactProducer" class="producer-action-btn contact-btn">
                                    <span class="btn-icon">💬</span>
                                    <span class="btn-text">Contacter</span>
                                </button>
                            </div>
                        </div>

                        <!-- Carte de localisation -->
                        <div class="producer-location">
                            <div class="location-map">
                                <div class="map-placeholder">
                                    <span class="map-icon">📍</span>
                                    <span class="map-text">{{ product.origin || 'Local' }}</span>
                                </div>

                                <div class="location-distance">
                                    <span class="distance-icon">🚗</span>
                                    <span class="distance-text">À 15km de votre position</span>
                                </div>
                            </div>

                            <div class="location-actions">
                                <button @click="viewOnMap" class="location-btn map-btn">
                                    <span class="btn-icon">🗺️</span>
                                    <span>Voir sur la carte</span>
                                </button>

                                <button @click="getDirections" class="location-btn directions-btn">
                                    <span class="btn-icon">🧭</span>
                                    <span>Itinéraire</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Autres produits du producteur -->
                    <div v-if="producerProducts.length > 0" class="producer-other-products">
                        <h4 class="section-subtitle">
                            <span class="subtitle-icon">📦</span>
                            Autres produits de ce producteur
                        </h4>

                        <div class="products-carousel">
                            <div class="carousel-container">
                                <div v-for="relatedProduct in producerProducts" :key="relatedProduct.id"
                                    class="carousel-item" @click="viewRelatedProduct(relatedProduct)">
                                    <ProductCard :product="relatedProduct" :view-mode="'compact'" />
                                </div>
                            </div>

                            <button @click="scrollCarousel(-1)" class="carousel-btn prev-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button @click="scrollCarousel(1)" class="carousel-btn next-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section caractéristiques détaillées -->
            <div class="features-section animate-slide-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="title-icon">🔍</span>
                        Caractéristiques détaillées
                    </h2>
                    <div class="section-decoration"></div>
                </div>

                <div class="features-container">
                    <!-- Onglets de caractéristiques -->
                    <div class="features-tabs">
                        <button v-for="tab in featureTabs" :key="tab.id" @click="selectFeatureTab(tab.id)"
                            class="feature-tab" :class="{ 'active': activeFeatureTab === tab.id }">
                            <span class="tab-icon">{{ tab.icon }}</span>
                            <span class="tab-label">{{ tab.label }}</span>
                        </button>
                    </div>

                    <!-- Contenu des onglets -->
                    <div class="features-content">
                        <transition name="fade-slide" mode="out-in">
                            <div :key="activeFeatureTab" class="tab-content">
                                <!-- Nutrition -->
                                <div v-if="activeFeatureTab === 'nutrition'" class="nutrition-info">
                                    <div class="nutrition-table">
                                        <div class="table-row header">
                                            <div class="table-cell">Valeur nutritionnelle</div>
                                            <div class="table-cell">Pour 100g</div>
                                            <div class="table-cell">% AJR*</div>
                                        </div>

                                        <div class="table-row">
                                            <div class="table-cell">Énergie</div>
                                            <div class="table-cell">45 kcal</div>
                                            <div class="table-cell">2%</div>
                                        </div>

                                        <div class="table-row">
                                            <div class="table-cell">Protéines</div>
                                            <div class="table-cell">0.9g</div>
                                            <div class="table-cell">2%</div>
                                        </div>

                                        <div class="table-row">
                                            <div class="table-cell">Glucides</div>
                                            <div class="table-cell">9.3g</div>
                                            <div class="table-cell">4%</div>
                                        </div>

                                        <div class="table-row">
                                            <div class="table-cell">Lipides</div>
                                            <div class="table-cell">0.2g</div>
                                            <div class="table-cell">0%</div>
                                        </div>

                                        <div class="table-row">
                                            <div class="table-cell">Fibres</div>
                                            <div class="table-cell">1.8g</div>
                                            <div class="table-cell">6%</div>
                                        </div>
                                    </div>

                                    <div class="nutrition-note">
                                        *AJR : Apports Journaliers Recommandés
                                    </div>
                                </div>

                                <!-- Conservation -->
                                <div v-else-if="activeFeatureTab === 'storage'" class="storage-info">
                                    <div class="storage-tips">
                                        <div class="tip-item">
                                            <span class="tip-icon">🌡️</span>
                                            <div class="tip-content">
                                                <h4 class="tip-title">Température optimale</h4>
                                                <p class="tip-text">Conserver entre 4°C et 8°C</p>
                                            </div>
                                        </div>

                                        <div class="tip-item">
                                            <span class="tip-icon">⏱️</span>
                                            <div class="tip-content">
                                                <h4 class="tip-title">Durée de conservation</h4>
                                                <p class="tip-text">7 jours au réfrigérateur</p>
                                            </div>
                                        </div>

                                        <div class="tip-item">
                                            <span class="tip-icon">💡</span>
                                            <div class="tip-content">
                                                <h4 class="tip-title">Astuce de conservation</h4>
                                                <p class="tip-text">Éviter l'exposition directe à la lumière</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="storage-timeline">
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <span class="timeline-label">Récolte</span>
                                                <span class="timeline-date">{{ formatHarvestDate }}</span>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <span class="timeline-label">Consommation optimale</span>
                                                <span class="timeline-date">J+3</span>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <span class="timeline-label">DLUO*</span>
                                                <span class="timeline-date">J+7</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="storage-note">
                                        *DLUO : Date Limite d'Utilisation Optimale
                                    </div>
                                </div>

                                <!-- Préparation -->
                                <div v-else-if="activeFeatureTab === 'preparation'" class="preparation-info">
                                    <div class="preparation-steps">
                                        <div v-for="(step, index) in preparationSteps" :key="index" class="step-item">
                                            <div class="step-number">{{ index + 1 }}</div>
                                            <div class="step-content">
                                                <h4 class="step-title">{{ step.title }}</h4>
                                                <p class="step-description">{{ step.description }}</p>
                                            </div>
                                            <div class="step-icon">{{ step.icon }}</div>
                                        </div>
                                    </div>

                                    <div class="preparation-tips">
                                        <h4 class="tips-title">Conseils du producteur</h4>
                                        <p class="tips-text">
                                            Pour une saveur optimale, consommez à température ambiante.
                                            La peau est comestible et riche en nutriments.
                                        </p>
                                    </div>
                                </div>

                                <!-- Origine -->
                                <div v-else class="origin-info">
                                    <div class="origin-map">
                                        <div class="map-visual">
                                            <div class="map-point">
                                                <span class="point-icon">📍</span>
                                                <span class="point-text">{{ product.origin || 'Origine locale' }}</span>
                                            </div>
                                        </div>

                                        <div class="map-details">
                                            <div class="detail-item">
                                                <span class="detail-icon">🏔️</span>
                                                <div class="detail-content">
                                                    <span class="detail-label">Région</span>
                                                    <span class="detail-value">Vallée fertile</span>
                                                </div>
                                            </div>

                                            <div class="detail-item">
                                                <span class="detail-icon">🌧️</span>
                                                <div class="detail-content">
                                                    <span class="detail-label">Climat</span>
                                                    <span class="detail-value">Tempéré océanique</span>
                                                </div>
                                            </div>

                                            <div class="detail-item">
                                                <span class="detail-icon">🌱</span>
                                                <div class="detail-content">
                                                    <span class="detail-label">Culture</span>
                                                    <span class="detail-value">Agriculture raisonnée</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="origin-certifications">
                                        <h4 class="certifications-title">Certifications</h4>
                                        <div class="certifications-list">
                                            <div class="certification-item">
                                                <span class="certification-icon">🌱</span>
                                                <span class="certification-text">Agriculture Biologique</span>
                                            </div>

                                            <div class="certification-item">
                                                <span class="certification-icon">🏷️</span>
                                                <span class="certification-text">Label Rouge</span>
                                            </div>

                                            <div class="certification-item">
                                                <span class="certification-icon">📍</span>
                                                <span class="certification-text">Origine Cameroun Garantie</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <!-- Section avis avec animations -->
            <div class="reviews-section animate-slide-in-up" ref="reviewsSection">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="title-icon">💬</span>
                        Avis clients
                        <span class="reviews-count">({{ totalReviewCount }})</span>
                    </h2>
                    <div class="section-decoration"></div>
                </div>

                <div class="reviews-container">
                    <!-- Résumé des avis -->
                    <div class="reviews-summary">
                        <div class="summary-rating">
                            <div class="rating-average">
                                <span class="average-value">{{ averageRating.toFixed(1) }}</span>
                                <span class="average-max">/5</span>
                            </div>

                            <div class="rating-stars">
                                <div class="stars-display">
                                    <div v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= Math.round(averageRating) }">
                                        ⭐
                                    </div>
                                </div>
                                <span class="rating-total">{{ totalReviewCount }} avis</span>
                            </div>
                        </div>

                        <div class="summary-distribution">
                            <div v-for="rating in ratingDistribution" :key="rating.stars" class="distribution-item">
                                <span class="distribution-stars">{{ rating.stars }} ⭐</span>
                                <div class="distribution-bar">
                                    <div class="bar-fill" :style="{ width: rating.percentage + '%' }"></div>
                                </div>
                                <span class="distribution-percentage">{{ rating.percentage }}%</span>
                            </div>
                            <p v-if="ratingDistribution.length === 0" class="text-sm text-amber-700/70">
                                Aucun détail de répartition disponible pour ce produit.
                            </p>
                        </div>

                        <button @click="openReviewModal" class="add-review-btn">
                            <span class="btn-icon">✍️</span>
                            <span class="btn-text">Donner mon avis</span>
                        </button>
                    </div>

                    <!-- Liste des avis -->
                    <div class="reviews-list">
                        <div class="reviews-filters">
                            <div class="filter-group">
                                <label class="filter-label">Trier par :</label>
                                <select v-model="reviewSortBy" class="filter-select">
                                    <option value="recent">Plus récents</option>
                                    <option value="helpful">Plus utiles</option>
                                    <option value="high_rating">Note haute</option>
                                    <option value="low_rating">Note basse</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Filtrer par :</label>
                                <div class="filter-stars">
                                    <button v-for="n in 5" :key="n" @click="filterByStars(n)" class="star-filter-btn"
                                        :class="{ 'active': starFilter === n }">
                                        {{ n }} ⭐
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Liste des avis -->
                        <div class="reviews-items">
                            <div v-for="review in filteredReviews" :key="review.id" class="review-item">
                                <div class="review-header">
                                    <div class="reviewer-info">
                                        <div class="reviewer-avatar">
                                            <span class="avatar-text">{{ getInitials(review.author) }}</span>
                                        </div>
                                        <div class="reviewer-details">
                                            <h4 class="reviewer-name">{{ review.author }}</h4>
                                            <span class="review-date">{{ formatReviewDate(review.date) }}</span>
                                        </div>
                                    </div>

                                    <div class="review-rating">
                                        <div class="review-stars">
                                            <span v-for="n in 5" :key="n" class="star"
                                                :class="{ 'filled': n <= review.rating }">
                                                ⭐
                                            </span>
                                        </div>
                                        <span class="review-verified" v-if="review.verified">
                                            ✅ Achat vérifié
                                        </span>
                                    </div>
                                </div>

                                <div class="review-content">
                                    <h5 class="review-title">{{ review.title }}</h5>
                                    <p class="review-text">{{ review.content }}</p>

                                    <div class="review-images" v-if="review.images">
                                        <img v-for="(img, index) in review.images" :key="index" :src="img"
                                            :alt="`Avis de ${review.author}`" class="review-image"
                                            @click="openImageLightbox(img)" />
                                    </div>
                                </div>

                                <div class="review-footer">
                                    <div class="review-helpful">
                                        <button @click="markHelpful(review)" class="helpful-btn"
                                            :class="{ 'active': review.helpful }">
                                            <span class="btn-icon">👍</span>
                                            <span class="btn-text">Utile ({{ review.helpful_count || 0 }})</span>
                                        </button>
                                    </div>

                                    <div class="review-actions">
                                        <button @click="reportReview(review)" class="action-btn report-btn">
                                            Signaler
                                        </button>

                                        <button @click="replyToReview(review)" class="action-btn reply-btn">
                                            Répondre
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p v-if="filteredReviews.length === 0" class="text-sm text-amber-700/70">
                                Aucun avis disponible pour le moment.
                            </p>
                        </div>

                        <!-- Pagination des avis -->
                        <div v-if="totalReviewPages > 1" class="reviews-pagination">
                            <button @click="previousReviewPage" class="pagination-btn prev-btn"
                                :disabled="reviewPage === 1">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div class="page-numbers">
                                <span class="page-info">
                                    Page {{ reviewPage }} sur {{ totalReviewPages }}
                                </span>
                            </div>

                            <button @click="nextReviewPage" class="pagination-btn next-btn"
                                :disabled="reviewPage === totalReviewPages">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section produits similaires -->
            <div v-if="relatedProducts.length > 0" class="related-products-section animate-slide-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="title-icon">🔄</span>
                        Produits similaires
                    </h2>
                    <div class="section-decoration"></div>
                </div>

                <div class="related-products-container">
                    <div class="related-products-grid">
                        <ProductCard v-for="relatedProduct in relatedProducts" :key="relatedProduct.id"
                            :product="relatedProduct" @click="viewRelatedProduct(relatedProduct)" />
                    </div>

                    <div class="related-products-actions">
                        <button @click="viewAllRelated" class="view-all-btn">
                            <span class="btn-text">Voir tous les produits similaires</span>
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- FAQ du produit -->
            <div v-if="productFAQs.length > 0" class="faq-section animate-slide-in-up">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="title-icon">❓</span>
                        Questions fréquentes
                    </h2>
                    <div class="section-decoration"></div>
                </div>

                <div class="faq-container">
                    <div v-for="(faq, index) in productFAQs" :key="index" class="faq-item"
                        :class="{ 'open': openFAQ === index }">
                        <div class="faq-question" @click="toggleFAQ(index)">
                            <h4 class="question-text">{{ faq.question }}</h4>
                            <svg class="chevron-icon" :class="{ 'open': openFAQ === index }" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <transition name="slide-down">
                            <div v-if="openFAQ === index" class="faq-answer">
                                <p class="answer-text">{{ faq.answer }}</p>
                            </div>
                        </transition>
                    </div>
                </div>

                <div class="faq-actions">
                    <button @click="askQuestion" class="ask-question-btn">
                        <span class="btn-icon">💬</span>
                        <span class="btn-text">Poser une question</span>
                    </button>
                </div>
            </div>
        </main>

        <!-- Panneau d'achat fixe pour mobile -->
        <div class="mobile-purchase-panel" :class="{ 'visible': showMobilePanel }">
            <div class="panel-content">
                <div class="panel-pricing">
                    <span class="panel-price">{{ formatPrice(displayPrice) }}</span>
                    <span class="panel-unit" v-if="product.unit">/{{ product.unit.symbol }}</span>
                </div>

                <div class="panel-actions">
                    <button @click="addToCart" class="panel-btn cart-btn" :disabled="product.stock_quantity === 0"
                        :class="stockStatus">
                        <span class="btn-icon">🛒</span>
                        <span class="btn-text">Ajouter</span>
                    </button>

                    <button @click="buyNow" class="panel-btn buy-btn" :disabled="product.stock_quantity === 0"
                        :class="stockStatus">
                        <span class="btn-icon">⚡</span>
                        <span class="btn-text">Acheter</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Boutons d'action flottants -->
        <div class="floating-actions">
            <button @click="scrollToTop" class="floating-action-btn scroll-top-btn"
                :class="{ 'visible': showScrollTop }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
            </button>

            <button @click="toggleMobilePanel" class="floating-action-btn cart-btn mobile-only">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="badge" v-if="cartQuantity > 0">{{ cartQuantity }}</span>
            </button>

            <button @click="shareProduct" class="floating-action-btn share-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </button>

            <button @click="toggleFavorite" class="floating-action-btn favorite-btn" :class="{ 'active': isFavorite }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        :class="{ 'filled': isFavorite }" />
                </svg>
            </button>
        </div>

        <!-- Modal de partage -->
        <transition name="modal">
            <ShareModal v-if="showShareModal" :product="product" @close="showShareModal = false" />
        </transition>

        <!-- Modal d'avis -->
        <transition name="modal">
            <ReviewModal v-if="showReviewModal" :product="product" @submit="submitReview"
                @close="showReviewModal = false" />
        </transition>

        <!-- Lightbox d'images -->
        <transition name="lightbox">
            <ImageLightbox v-if="showLightbox" :images="product.images" :initial-index="lightboxIndex"
                @close="showLightbox = false" @next="nextLightboxImage" @previous="previousLightboxImage" />
        </transition>

        <!-- Notification d'ajout au panier -->
        <transition name="notification">
            <CartNotification v-if="showCartNotification" :product="product" :quantity="quantity"
                @close="showCartNotification = false" @view-cart="goToCart" />
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/modules/catalog/store/modules/product.store'
import { productsApi } from '@/modules/catalog/services/api/products.api'
import { useCartStore } from '@/modules/orders/stores/cart.store'
import ProductCard from './ProductCard.vue'
import ShareModal from './ShareModal.vue'
import ReviewModal from './ReviewModal.vue'
import ImageLightbox from './ImageLightbox.vue'
import CartNotification from './CartNotification.vue'

// Route et router
const route = useRoute()
const router = useRouter()

// Stores
const productStore = useProductStore()
const cartStore = useCartStore()

// Données réactives
const product = ref<any>({})
const loading = ref(true)
const currentImageIndex = ref(0)
const isZooming = ref(false)
const zoomOverlayStyle = ref({})
const thumbnailLoading = ref<boolean[]>([])
const isFavorite = ref(false)
const descriptionExpanded = ref(false)
const isHovered = ref(false)
const starHoverIndex = ref(0)
const keywordHoverIndex = ref(-1)
const showRatingAnimation = ref(false)
const showPriceFluctuation = ref(false)
const fluctuationDirection = ref<'up' | 'down'>('up')
const showPromotionTimer = ref(false)
const promotionTimeLeft = ref('')
const showSavings = ref(false)
const addingToCart = ref(false)
const showCartAnimation = ref(false)
const showCartNotification = ref(false)
const quantity = ref(1)
const inWishlist = ref(false)
const inComparison = ref(false)
const notificationsEnabled = ref(false)
const activeFeatureTab = ref('nutrition')
const reviewSortBy = ref('recent')
const starFilter = ref(0)
const reviewPage = ref(1)
const openFAQ = ref(-1)
const showMobilePanel = ref(false)
const showScrollTop = ref(false)
const showShareModal = ref(false)
const showReviewModal = ref(false)
const showLightbox = ref(false)
const lightboxIndex = ref(0)
const showRestockInfo = computed(() => product.value?.stock_quantity === 0)
const restockDate = computed(() => {
    if (product.value?.restock_date) {
        return formatReviewDate(product.value.restock_date)
    }
    return 'Bientôt disponible'
})

interface ProductReview {
    id: string | number
    author: string
    date: string
    rating: number
    title: string
    content: string
    verified?: boolean
    helpful?: boolean
    helpful_count?: number
    images?: string[]
}

interface ProductFAQ {
    question: string
    answer: string
}

const producerProducts = ref<any[]>([])
const relatedProducts = ref<any[]>([])
const reviews = ref<ProductReview[]>([])
const productFAQs = ref<ProductFAQ[]>([])

const featureTabs = ref([
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'storage', label: 'Conservation', icon: '🌡️' },
    { id: 'preparation', label: 'Préparation', icon: '🍽️' },
    { id: 'origin', label: 'Origine', icon: '📍' },
])

const preparationSteps = ref([
    {
        title: 'Nettoyage',
        description: 'Rincer délicatement à l\'eau fraîche.',
        icon: '💧'
    },
    {
        title: 'Préparation',
        description: 'Couper selon vos préférences.',
        icon: '🔪'
    },
    {
        title: 'Cuisson',
        description: 'Cuire à la vapeur pour préserver les nutriments.',
        icon: '🍲'
    }
])

// Computed properties
const mainImageUrl = computed(() => {
    if (product.value.images && product.value.images.length > 0) {
        const image = product.value.images[currentImageIndex.value]
        return image.url
    }
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23f8f4e9"/%3E%3Cpath d="M200,200 Q400,100 600,200 T800,200" stroke="%23a7d397" stroke-width="8" fill="none"/%3E%3Ccircle cx="400" cy="300" r="80" fill="%235a8c5a"/%3E%3C/svg%3E`
})

const categoryStyle = computed(() => {
    if (!product.value.category) return {}
    return {
        backgroundColor: `${product.value.category.color}20`,
        color: product.value.category.color,
        borderColor: product.value.category.color
    }
})

const stockStatus = computed(() => {
    if (product.value.stock_quantity === 0) return 'out-of-stock'
    if (product.value.stock_quantity < 10) return 'low-stock'
    if (product.value.stock_quantity < 50) return 'limited-stock'
    return 'in-stock'
})

const stockStatusText = computed(() => {
    switch (stockStatus.value) {
        case 'out-of-stock': return 'Rupture de stock'
        case 'low-stock': return 'Stock faible'
        case 'limited-stock': return 'Stock limité'
        default: return 'En stock'
    }
})

const getStockIcon = computed(() => {
    switch (stockStatus.value) {
        case 'out-of-stock': return '❌'
        case 'low-stock': return '⚠️'
        case 'limited-stock': return '📦'
        default: return '✅'
    }
})

const stockPercentage = computed(() => {
    const maxStock = 100 // Valeur de référence
    return Math.min((product.value.stock_quantity / maxStock) * 100, 100)
})

const progressFillStyle = computed(() => ({
    width: `${stockPercentage.value}%`,
    backgroundColor: getStockColor(stockPercentage.value)
}))

const stockMarkers = computed(() => [
    { label: 'Faible', position: 10 },
    { label: 'Moyen', position: 50 },
    { label: 'Bon', position: 75 },
    { label: 'Excellent', position: 100 }
])

const displayPrice = computed(() => {
    return product.value.discount_price || product.value.price || 0
})

const discountPercentage = computed(() => {
    if (!product.value.discount_price) return 0
    const discount = ((product.value.price - product.value.discount_price) / product.value.price) * 100
    return Math.round(discount)
})

const totalPrice = computed(() => {
    return displayPrice.value * quantity.value
})

const quantityProgressStyle = computed(() => {
    const min = product.value.min_order || 1
    const max = product.value.max_order || product.value.stock_quantity
    const percentage = ((quantity.value - min) / (max - min)) * 100
    return { width: `${percentage}%` }
})

const showPriceComparison = computed(() => {
    return product.value.price && product.value.price < 50
})

const marketPrice = computed(() => {
    return (product.value.price || 0) * 1.3 // Prix moyen du marché estimé
})

const comparisonWidth = computed(() => {
    const percentage = (displayPrice.value / marketPrice.value) * 100
    return `${Math.min(percentage, 100)}%`
})

const savingsAmount = computed(() => {
    return marketPrice.value - displayPrice.value
})

const showReadMore = computed(() => {
    return product.value.description && product.value.description.length > 200
})

const formatHarvestDate = computed(() => {
    if (!product.value.harvest_date) return ''
    const date = new Date(product.value.harvest_date)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})

const harvestFreshness = computed(() => {
    if (!product.value.harvest_date) return ''
    const harvestDate = new Date(product.value.harvest_date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - harvestDate.getTime()) / (1000 * 3600 * 24))

    if (diffDays < 1) return 'very-fresh'
    if (diffDays < 3) return 'fresh'
    if (diffDays < 7) return 'moderate'
    return 'aged'
})

const producerImage = computed(() => {
    return product.value.producer?.image || `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Ccircle cx="100" cy="100" r="80" fill="%23c6e6b3"/%3E%3Cpath d="M100,70 Q120,50 140,70 Q160,90 140,110 Q120,130 100,110 Q80,90 100,70 Z" fill="%235a8c5a"/%3E%3C/svg%3E`
})

const producerDescription = computed(() => {
    return product.value.producer?.description || 'Producteur passionné par une agriculture respectueuse de l\'environnement et des saveurs authentiques.'
})

const totalReviewCount = computed(() => {
    if (reviews.value.length > 0) {
        return reviews.value.length
    }

    const backendCount = Number(product.value.review_count || 0)
    return Number.isFinite(backendCount) ? backendCount : 0
})

const averageRating = computed(() => {
    if (reviews.value.length > 0) {
        const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
        return sum / reviews.value.length
    }

    const backendAverage = Number(product.value.average_rating ?? product.value.rating ?? 0)
    return Number.isFinite(backendAverage) ? backendAverage : 0
})

const ratingDistribution = computed(() => {
    if (reviews.value.length === 0) {
        return []
    }

    const total = reviews.value.length
    return [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.value.filter(review => review.rating === stars).length
        return {
            stars,
            percentage: Math.round((count / total) * 100)
        }
    })
})

const filteredReviews = computed(() => {
    let filtered = [...reviews.value]

    if (starFilter.value > 0) {
        filtered = filtered.filter(review => review.rating === starFilter.value)
    }

    // Trier selon la sélection
    switch (reviewSortBy.value) {
        case 'recent':
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            break
        case 'helpful':
            filtered.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0))
            break
        case 'high_rating':
            filtered.sort((a, b) => b.rating - a.rating)
            break
        case 'low_rating':
            filtered.sort((a, b) => a.rating - b.rating)
            break
    }

    // Pagination
    const itemsPerPage = 5
    const startIndex = (reviewPage.value - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
})

const totalReviewPages = computed(() => {
    const itemsPerPage = 5
    return Math.max(1, Math.ceil(reviews.value.length / itemsPerPage))
})

const cartQuantity = computed(() => {
    return cartStore.getItemQuantity(product.value.id)
})

const shouldPulseCartButton = computed(() => {
    return isHovered.value && product.value.stock_quantity > 0 && !addingToCart.value
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
    if (percentage === 0) return '#ef4444'
    if (percentage < 10) return '#f97316'
    if (percentage < 50) return '#eab308'
    return '#22c55e'
}

const getTagIcon = (tagName: string) => {
    const icons: Record<string, string> = {
        'bio': '🌱',
        'local': '📍',
        'saison': '📅',
        'frais': '❄️',
        'artisanal': '👨‍🍳',
        'traditionnel': '🏺',
        'primeur': '🥇',
        'durable': '♻️'
    }

    const lowerTag = tagName.toLowerCase()
    for (const [key, icon] of Object.entries(icons)) {
        if (lowerTag.includes(key)) {
            return icon
        }
    }

    return '🏷️'
}

const selectImage = (index: number) => {
    currentImageIndex.value = index
}

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    }
}

const nextImage = () => {
    if (product.value.images && currentImageIndex.value < product.value.images.length - 1) {
        currentImageIndex.value++
    }
}

const enableZoom = () => {
    isZooming.value = true
}

const disableZoom = () => {
    isZooming.value = false
}

const handleZoom = (event: MouseEvent) => {
    if (!isZooming.value) return

    const container = event.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    zoomOverlayStyle.value = {
        backgroundPosition: `${x}% ${y}%`
    }
}

const toggleFullscreen = () => {
    lightboxIndex.value = currentImageIndex.value
    showLightbox.value = true
}

const handleThumbnailLoad = (index: number) => {
    thumbnailLoading.value[index] = false
}

const goBack = () => {
    router.back()
}

const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value

    // Animation et sauvegarde
    if (isFavorite.value) {
        // Ajouter aux favoris
        localStorage.setItem(`favorite_${product.value.id}`, 'true')
    } else {
        // Retirer des favoris
        localStorage.removeItem(`favorite_${product.value.id}`)
    }
}

const shareProduct = () => {
    showShareModal.value = true
}

const printPage = () => {
    window.print()
}

const toggleDescription = () => {
    descriptionExpanded.value = !descriptionExpanded.value
}

const scrollToReviews = () => {
    const reviewsSection = document.querySelector('.reviews-section')
    if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' })
    }
}

const decreaseQuantity = () => {
    const min = product.value.min_order || 1
    if (quantity.value > min) {
        quantity.value--
    }
}

const increaseQuantity = () => {
    const max = product.value.max_order || product.value.stock_quantity
    if (quantity.value < max) {
        quantity.value++
    }
}

const validateQuantity = () => {
    const min = product.value.min_order || 1
    const max = product.value.max_order || product.value.stock_quantity

    if (quantity.value < min) {
        quantity.value = min
    } else if (quantity.value > max) {
        quantity.value = max
    }
}

const addToCart = async () => {
    if (product.value.stock_quantity === 0 || addingToCart.value) return

    addingToCart.value = true
    showCartAnimation.value = true

    try {
        // Simulation d'ajout au panier
        await new Promise(resolve => setTimeout(resolve, 800))

        // Ajouter au store du panier
        await cartStore.addToCart({
            productId: product.value.id,
            quantity: quantity.value
        })

        // Afficher la notification
        showCartNotification.value = true

        // Réinitialiser l'animation
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

const buyNow = () => {
    addToCart().then(() => {
        router.push('/cart/checkout')
    })
}

const addToWishlist = () => {
    inWishlist.value = !inWishlist.value
}

const addToCompare = () => {
    inComparison.value = !inComparison.value
}

const requestNotification = () => {
    notificationsEnabled.value = !notificationsEnabled.value

    if (notificationsEnabled.value && 'Notification' in window) {
        Notification.requestPermission()
    }
}

const selectFeatureTab = (tabId: string) => {
    activeFeatureTab.value = tabId
}

const filterByStars = (stars: number) => {
    starFilter.value = starFilter.value === stars ? 0 : stars
    reviewPage.value = 1
}

const previousReviewPage = () => {
    if (reviewPage.value > 1) {
        reviewPage.value--
    }
}

const nextReviewPage = () => {
    if (reviewPage.value < totalReviewPages.value) {
        reviewPage.value++
    }
}

const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase()
}

const markHelpful = (review: any) => {
    review.helpful = !review.helpful
    if (review.helpful) {
        review.helpful_count = (review.helpful_count || 0) + 1
    } else {
        review.helpful_count = Math.max(0, (review.helpful_count || 1) - 1)
    }
}

const reportReview = (review: any) => {
    console.log('Signaler l\'avis:', review)
    // Implémenter la logique de signalement
}

const replyToReview = (review: any) => {
    console.log('Répondre à l\'avis:', review)
    // Implémenter la logique de réponse
}

const toggleFAQ = (index: number) => {
    openFAQ.value = openFAQ.value === index ? -1 : index
}

const askQuestion = () => {
    console.log('Poser une question')
    // Implémenter l'ouverture d'un formulaire de question
}

const viewProducerProfile = () => {
    if (product.value.producer?.id) {
        router.push(`/producers/${product.value.producer.id}`)
    }
}

const contactProducer = () => {
    console.log('Contacter le producteur')
    // Implémenter le formulaire de contact
}

const viewOnMap = () => {
    console.log('Voir sur la carte')
    // Implémenter l'ouverture de la carte
}

const getDirections = () => {
    console.log('Obtenir l\'itinéraire')
    // Implémenter l'ouverture de l'application de navigation
}

const scrollCarousel = (direction: number) => {
    const carousel = document.querySelector('.carousel-container')
    if (carousel) {
        const scrollAmount = 300
        carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' })
    }
}

const viewRelatedProduct = (relatedProduct: any) => {
    router.push(`/catalog/products/${relatedProduct.id}`)
}

const viewAllRelated = () => {
    router.push(`/catalog?category=${product.value.category?.id}`)
}

const normalizeReview = (rawReview: any, index: number): ProductReview => {
    return {
        id: rawReview?.id ?? `review-${index}`,
        author: rawReview?.author || rawReview?.user_name || 'Client',
        date: rawReview?.date || rawReview?.created_at || new Date().toISOString(),
        rating: Number(rawReview?.rating || 0),
        title: rawReview?.title || 'Avis client',
        content: rawReview?.content || rawReview?.comment || '',
        verified: Boolean(rawReview?.verified ?? rawReview?.is_verified_purchase),
        helpful: Boolean(rawReview?.helpful),
        helpful_count: Number(rawReview?.helpful_count || 0),
        images: Array.isArray(rawReview?.images) ? rawReview.images : []
    }
}

const hydrateDetailSections = async (productId: string) => {
    const rawReviews = Array.isArray(product.value?.reviews) ? product.value.reviews : []
    reviews.value = rawReviews.map((review, index) => normalizeReview(review, index))
    reviewPage.value = 1
    starFilter.value = 0

    const rawFaqs = Array.isArray(product.value?.faqs) ? product.value.faqs : []
    productFAQs.value = rawFaqs
        .filter((faq: any) => faq?.question && faq?.answer)
        .map((faq: any) => ({
            question: faq.question,
            answer: faq.answer
        }))
    openFAQ.value = -1

    const rawProducerProducts = Array.isArray(product.value?.producer?.products)
        ? product.value.producer.products
        : []

    producerProducts.value = rawProducerProducts.filter((item: any) => String(item?.id) !== productId)

    const rawRelatedProducts = Array.isArray(product.value?.related_products)
        ? product.value.related_products
        : []

    relatedProducts.value = rawRelatedProducts.filter((item: any) => String(item?.id) !== productId)

    if (relatedProducts.value.length === 0 && product.value?.category_id) {
        try {
            const relatedResponse = await productsApi.searchProducts({
                page: 1,
                limit: 12,
                category_id: String(product.value.category_id)
            })

            relatedProducts.value = relatedResponse.products
                .filter(item => String(item.id) !== productId)
                .slice(0, 8)

            if (producerProducts.value.length === 0 && product.value?.producer?.id) {
                const producerId = String(product.value.producer.id)
                producerProducts.value = relatedProducts.value.filter(
                    (item: any) => String(item?.producer?.id || '') === producerId
                )
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits liés:', error)
            relatedProducts.value = []
        }
    }
}

const openReviewModal = () => {
    showReviewModal.value = true
}

const submitReview = (reviewData: any) => {
    console.log('Soumettre l\'avis:', reviewData)
    // Implémenter la soumission de l'avis
    showReviewModal.value = false
}

const openImageLightbox = (imageUrl: string) => {
    lightboxIndex.value = product.value.images.findIndex((img: any) => img.url === imageUrl)
    showLightbox.value = true
}

const nextLightboxImage = () => {
    if (lightboxIndex.value < product.value.images.length - 1) {
        lightboxIndex.value++
    }
}

const previousLightboxImage = () => {
    if (lightboxIndex.value > 0) {
        lightboxIndex.value--
    }
}

const goToCart = () => {
    router.push('/cart')
}

const toggleMobilePanel = () => {
    showMobilePanel.value = !showMobilePanel.value
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
    showScrollTop.value = window.scrollY > 300
    showMobilePanel.value = window.scrollY > 500 && window.innerWidth < 768
}

// Cycle de vie
onMounted(async () => {
    // Charger le produit
    const productId = String(route.params.id || '')
    if (productId) {
        loading.value = true
        try {
            const data = await productStore.getCompleteProduct(productId)
            product.value = data || productStore.currentProduct || {}
            await hydrateDetailSections(productId)

            // Initialiser le chargement des miniatures
            if (product.value.images) {
                thumbnailLoading.value = new Array(product.value.images.length).fill(true)
            }

            // Vérifier les favoris
            isFavorite.value = !!localStorage.getItem(`favorite_${productId}`)

            // Vérifier la wishlist
            inWishlist.value = !!localStorage.getItem(`wishlist_${productId}`)

            // Initialiser la quantité
            quantity.value = product.value.min_order || 1

            // Animation initiale
            setTimeout(() => {
                showRatingAnimation.value = true
                setTimeout(() => {
                    showRatingAnimation.value = false
                }, 3000)
            }, 1000)

            // Animation de fluctuation de prix (aléatoire)
            if (Math.random() > 0.5) {
                setTimeout(() => {
                    showPriceFluctuation.value = true
                    fluctuationDirection.value = Math.random() > 0.5 ? 'up' : 'down'
                    setTimeout(() => {
                        showPriceFluctuation.value = false
                    }, 5000)
                }, 2000)
            }

            // Timer de promotion
            if (product.value.discount_price) {
                showPromotionTimer.value = true
                updatePromotionTimer()
                const timerInterval = setInterval(updatePromotionTimer, 1000)
                onUnmounted(() => clearInterval(timerInterval))
            }

            // Calculer les économies
            if (displayPrice.value < marketPrice.value) {
                showSavings.value = true
            }
        } catch (error) {
            console.error('Erreur lors du chargement du produit:', error)
        } finally {
            loading.value = false
        }
    }

    // Écouter le scroll
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// Mettre à jour le timer de promotion
const updatePromotionTimer = () => {
    const endDate = new Date()
    endDate.setHours(endDate.getHours() + 24) // Promotion de 24h

    const now = new Date()
    const diff = endDate.getTime() - now.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    promotionTimeLeft.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.product-detail-wrapper {
    @apply relative min-h-screen bg-gradient-nature;
}

.organic-background {
    @apply absolute inset-0 overflow-hidden;
}

.leaf-animation {
    @apply absolute inset-0 bg-leaf-pattern opacity-5;
    animation: float-leaves 60s linear infinite;
}

.gradient-overlay {
    @apply absolute inset-0;
    background: linear-gradient(135deg,
            rgba(248, 244, 233, 0.8) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(198, 230, 179, 0.1) 100%);
}

/* Navigation */
.product-navigation {
    @apply sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-light/30;
}

.nav-container {
    @apply max-w-7xl mx-auto px-4 py-3 flex justify-between items-center;
}

.breadcrumb-trail {
    @apply flex items-center gap-2;
}

.breadcrumb-item {
    @apply flex items-center gap-1 px-3 py-1 rounded-lg text-green-medium hover:bg-green-soft/10 transition-all duration-300 ease-organic;
}

.breadcrumb-item.active {
    @apply bg-green-soft/20 text-forest-dark font-medium;
}

.crumb-icon {
    @apply text-sm;
}

.crumb-text {
    @apply text-sm font-medium;
}

.crumb-separator {
    @apply text-green-light/50;
}

.crumb-separator svg {
    @apply w-4 h-4;
}

.nav-actions {
    @apply flex items-center gap-2;
}

.nav-action-btn {
    @apply p-2 rounded-lg border border-green-light/30 text-green-medium hover:bg-green-soft/10 hover:border-green-soft hover:text-forest-dark transition-all duration-300 ease-organic;
}

.nav-action-btn.back-btn {
    @apply flex items-center gap-2;
}

.nav-action-btn.favorite-btn.active {
    @apply bg-pink-100 border-pink-300 text-pink-600;
}

.nav-action-btn.favorite-btn.active svg {
    @apply fill-pink-500;
}

.nav-icon {
    @apply w-5 h-5;
}

/* Contenu principal */
.product-main-content {
    @apply relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-12;
}

/* Section hero */
.product-hero-section {
    @apply animate-fade-in;
}

.hero-container {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

/* Galerie */
.product-gallery {
    @apply space-y-4;
}

.main-image-container {
    @apply relative rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-green-light/30 shadow-organic;
}

.main-product-image {
    @apply w-full h-auto object-cover transition-transform duration-700 ease-organic;
}

.main-product-image.zooming {
    @apply transform scale-150;
}

.zoom-overlay {
    @apply absolute inset-0 bg-no-repeat pointer-events-none;
    background-image: var(--zoom-bg);
    background-size: 200%;
}

.image-badges {
    @apply absolute top-4 left-4 flex flex-col gap-2;
}

.image-badge {
    @apply flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm shadow-soft;
}

.image-badge.featured {
    @apply bg-gradient-to-r from-yellow-400 to-orange-400 text-white;
}

.image-badge.low-stock {
    @apply bg-orange-500/90 text-white;
}

.image-badge.discount {
    @apply bg-red-500/90 text-white;
}

.badge-icon {
    @apply text-sm;
}

.badge-text {
    @apply font-semibold;
}

.image-controls {
    @apply absolute bottom-4 right-4 flex gap-2;
}

.image-control-btn {
    @apply w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-green-light/30 text-green-medium flex items-center justify-center hover:bg-green-soft hover:text-white transition-all duration-300 ease-organic disabled:opacity-30 disabled:cursor-not-allowed;
}

.image-control-btn svg {
    @apply w-5 h-5;
}

.image-thumbnails {
    @apply flex gap-2 overflow-x-auto pb-2 scrollbar-hide;
}

.thumbnail-item {
    @apply relative w-20 h-20 rounded-xl overflow-hidden border-2 border-transparent cursor-pointer transition-all duration-300 ease-organic hover:scale-105;
}

.thumbnail-item.active {
    @apply border-green-soft scale-105;
}

.thumbnail-image {
    @apply w-full h-full object-cover;
}

.thumbnail-overlay {
    @apply absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300;
}

/* Informations essentielles */
.product-essential-info {
    @apply space-y-6;
}

.product-header {
    @apply space-y-3;
}

.category-badge {
    @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 ease-organic;
}

.product-title {
    @apply text-3xl md:text-4xl font-bold text-forest-dark leading-tight;
}

.product-subtitle {
    @apply flex items-center gap-3 text-green-medium/80;
}

.subtitle-divider {
    @apply w-1 h-1 rounded-full bg-green-light/50;
}

/* Animation de dactylographie */
@keyframes typewriter {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

.animate-typewriter {
    overflow: hidden;
    white-space: nowrap;
    animation: typewriter 1s steps(40, end);
}

/* Section d'évaluation */
.product-rating-section {
    @apply p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-green-light/30;
}

.rating-display {
    @apply flex items-center gap-4 mb-3;
}

.stars-container {
    @apply flex gap-1;
}

.star {
    @apply text-xl text-yellow-400 transition-all duration-300;
}

.star.filled {
    animation: star-twinkle 0.5s ease-out;
}

.star.twinkling {
    animation: star-twinkle 1s infinite;
}

@keyframes star-twinkle {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.8;
    }
}

.rating-details {
    @apply flex items-center gap-2;
}

.rating-value {
    @apply text-2xl font-bold text-forest-dark;
}

.rating-count {
    @apply text-green-medium/70;
}

.rating-animation {
    @apply ml-3 px-2 py-1 bg-green-soft/20 text-green-medium text-sm rounded-full animate-pulse-soft;
}

.rating-action-btn {
    @apply flex items-center gap-2 text-green-medium hover:text-forest-dark transition-colors duration-300;
}

/* Description */
.product-description-section {
    @apply space-y-4;
}

.section-header {
    @apply flex items-center gap-3 mb-4;
}

.section-title {
    @apply text-xl font-bold text-forest-dark flex items-center gap-2;
}

.section-decoration {
    @apply flex-1 h-0.5 bg-gradient-to-r from-green-soft to-transparent rounded-full;
}

.description-content {
    @apply space-y-3;
}

.description-text {
    @apply text-green-medium/80 leading-relaxed;
}

.description-text.expanded {
    @apply line-clamp-none;
}

.read-more-btn {
    @apply flex items-center gap-1 text-green-medium hover:text-forest-dark transition-colors duration-300;
}

.chevron-icon {
    @apply w-4 h-4 transition-transform duration-300;
}

.chevron-icon.expanded {
    @apply transform rotate-180;
}

.description-keywords {
    @apply mt-4;
}

.keywords-container {
    @apply flex flex-wrap gap-2;
}

.keyword-item {
    @apply flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-light/20 text-green-medium cursor-pointer transition-all duration-300 ease-organic hover:scale-105 hover:bg-green-light/30;
    animation: keyword-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    border: 1px solid var(--tag-color, transparent);
}

@keyframes keyword-enter {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Prix */
.product-pricing-section {
    @apply p-6 rounded-2xl bg-gradient-naturel border border-green-light/30;
}

.pricing-container {
    @apply space-y-4;
}

.current-pricing {
    @apply space-y-2;
}

.price-display {
    @apply flex items-center gap-2;
}

.price-value {
    @apply text-3xl font-bold text-forest-dark;
}

.price-unit {
    @apply text-lg text-green-medium/70;
}

.price-display.has-discount .price-value {
    @apply text-green-600;
}

.price-fluctuation {
    @apply flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium animate-pulse-soft;
}

.price-fluctuation.up {
    @apply bg-green-soft/20 text-green-medium;
}

.price-fluctuation.down {
    @apply bg-red-100 text-red-600;
}

.original-pricing {
    @apply flex items-center gap-3;
}

.original-price {
    @apply text-lg text-green-medium/50 line-through;
}

.discount-percentage {
    @apply px-2 py-1 bg-red-500/20 text-red-600 text-sm font-bold rounded-full;
}

.promotion-timer {
    @apply flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full;
}

.price-comparison {
    @apply space-y-3;
}

.comparison-chart {
    @apply space-y-2;
}

.chart-bar {
    @apply flex items-center gap-3;
}

.bar-label {
    @apply w-24 text-sm text-green-medium/70;
}

.bar-fill {
    @apply flex-1 h-3 rounded-full transition-all duration-1000 ease-organic;
}

.market-price .bar-fill {
    @apply bg-green-light/30;
}

.our-price .bar-fill {
    @apply bg-gradient-to-r from-green-soft to-green-light;
}

.bar-value {
    @apply w-16 text-right text-sm font-medium text-forest-dark;
}

.comparison-savings {
    @apply flex items-center gap-2 p-3 bg-green-soft/10 rounded-xl;
}

/* Stock */
.product-stock-section {
    @apply p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-green-light/30;
}

.stock-header {
    @apply flex justify-between items-center mb-4;
}

.stock-title {
    @apply text-lg font-bold text-forest-dark flex items-center gap-2;
}

.stock-status {
    @apply flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium;
}

.stock-status.out-of-stock {
    @apply bg-red-100 text-red-600;
}

.stock-status.low-stock {
    @apply bg-orange-100 text-orange-600;
}

.stock-status.limited-stock {
    @apply bg-yellow-100 text-yellow-600;
}

.stock-status.in-stock {
    @apply bg-green-100 text-green-600;
}

.stock-progress {
    @apply space-y-4;
}

.progress-container {
    @apply space-y-2;
}

.progress-track {
    @apply h-3 bg-green-light/20 rounded-full relative overflow-hidden;
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
    @apply absolute w-0.5 h-4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300;
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

.progress-info {
    @apply flex justify-between items-center text-sm;
}

.stock-warning {
    @apply flex items-center gap-1 text-orange-600;
}

.restock-info {
    @apply flex items-center gap-3 p-3 bg-blue-50 rounded-xl;
}

/* Actions */
.product-actions-section {
    @apply space-y-6;
}

.quantity-selector {
    @apply space-y-3;
}

.selector-header {
    @apply flex items-center gap-2;
}

.selector-label {
    @apply font-medium text-forest-dark;
}

.selector-hint {
    @apply text-sm text-green-medium/70;
}

.quantity-controls {
    @apply flex items-center gap-3;
}

.quantity-btn {
    @apply w-10 h-10 rounded-xl border border-green-light/30 bg-white text-green-medium hover:bg-green-soft hover:text-white transition-all duration-300 ease-organic disabled:opacity-30 disabled:cursor-not-allowed;
}

.quantity-btn svg {
    @apply w-5 h-5 mx-auto;
}

.quantity-display {
    @apply flex-1 flex items-center border border-green-light/30 rounded-xl bg-white overflow-hidden;
}

.quantity-input {
    @apply flex-1 px-4 py-2 text-center text-lg font-bold text-forest-dark border-none outline-none;
}

.quantity-unit {
    @apply px-3 py-2 bg-green-light/10 text-green-medium font-medium;
}

.quantity-progress {
    @apply space-y-1;
}

.progress-bar {
    @apply h-1 bg-green-light/20 rounded-full overflow-hidden;
}

.progress-fill {
    @apply h-full bg-gradient-to-r from-green-soft to-green-light rounded-full transition-all duration-300 ease-organic;
}

.progress-labels {
    @apply flex justify-between text-xs text-green-medium/70;
}

.action-buttons {
    @apply space-y-3;
}

.action-btn {
    @apply w-full flex justify-between items-center px-6 py-4 rounded-xl font-medium transition-all duration-300 ease-organic focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.add-to-cart-btn {
    @apply bg-gradient-vert text-white hover:shadow-organic-hover focus:ring-green-soft disabled:opacity-50 disabled:cursor-not-allowed;
}

.add-to-cart-btn.pulse {
    animation: cart-pulse 1.5s infinite;
}

@keyframes cart-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.02);
    }
}

.add-to-cart-btn.adding {
    @apply opacity-70;
}

.btn-content {
    @apply flex items-center gap-3;
}

.btn-spinner {
    @apply w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin;
}

.btn-details {
    @apply flex items-center gap-2;
}

.buy-now-btn {
    @apply bg-gradient-to-r from-green-medium to-forest-dark text-white hover:shadow-organic-hover focus:ring-green-medium;
}

.secondary-actions {
    @apply flex justify-center gap-4;
}

.secondary-btn {
    @apply p-3 rounded-xl border border-green-light/30 text-green-medium hover:bg-green-soft/10 hover:border-green-soft transition-all duration-300 ease-organic;
}

.secondary-btn.active {
    @apply bg-green-soft/20 border-green-soft text-green-medium;
}

.product-guarantees {
    @apply grid grid-cols-1 md:grid-cols-3 gap-3;
}

.guarantee-item {
    @apply flex items-center gap-2 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-green-light/30;
}

/* Section producteur */
.producer-section {
    @apply space-y-6;
}

.producer-container {
    @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}

.producer-card {
    @apply lg:col-span-2 p-6 rounded-2xl bg-gradient-naturel border border-green-light/30 space-y-6;
}

.producer-avatar {
    @apply relative w-20 h-20;
}

.avatar-image {
    @apply w-full h-full rounded-full object-cover border-4 border-white shadow-soft;
}

.avatar-badge {
    @apply absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-soft flex items-center justify-center border-2 border-white;
}

.producer-info {
    @apply space-y-4;
}

.producer-name {
    @apply text-2xl font-bold text-forest-dark;
}

.producer-stats {
    @apply grid grid-cols-3 gap-4;
}

.stat-item {
    @apply flex items-center gap-2 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-green-light/30;
}

.stat-icon {
    @apply text-xl;
}

.stat-content {
    @apply flex flex-col;
}

.stat-value {
    @apply font-bold text-forest-dark;
}

.stat-label {
    @apply text-xs text-green-medium/70;
}

.producer-description {
    @apply text-green-medium/80 leading-relaxed;
}

.producer-actions {
    @apply flex gap-3;
}

.producer-action-btn {
    @apply flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-organic;
}

.producer-action-btn.profile-btn {
    @apply bg-green-soft/10 text-green-medium hover:bg-green-soft/20;
}

.producer-action-btn.contact-btn {
    @apply bg-green-soft text-white hover:bg-green-medium;
}

.producer-location {
    @apply p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-green-light/30;
}

.location-map {
    @apply mb-4;
}

.map-placeholder {
    @apply flex items-center justify-center h-32 rounded-xl bg-green-light/20 mb-2;
}

.location-distance {
    @apply flex items-center justify-center gap-2 text-green-medium;
}

.location-actions {
    @apply flex gap-3;
}

.location-btn {
    @apply flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-green-light/30 text-green-medium hover:bg-green-soft/10 transition-all duration-300 ease-organic;
}

.producer-other-products {
    @apply space-y-4;
}

.products-carousel {
    @apply relative;
}

.carousel-container {
    @apply flex gap-4 overflow-x-auto pb-4 scrollbar-hide;
}

.carousel-btn {
    @apply absolute top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-green-light/30 text-green-medium hover:bg-green-soft hover:text-white transition-all duration-300 ease-organic disabled:opacity-30 disabled:cursor-not-allowed;
}

.carousel-btn.prev-btn {
    @apply left-0 -translate-x-1/2;
}

.carousel-btn.next-btn {
    @apply right-0 translate-x-1/2;
}

/* Section caractéristiques */
.features-section {
    @apply space-y-6;
}

.features-container {
    @apply rounded-2xl bg-gradient-naturel border border-green-light/30 overflow-hidden;
}

.features-tabs {
    @apply flex border-b border-green-light/30;
}

.feature-tab {
    @apply flex-1 flex items-center justify-center gap-2 px-6 py-4 text-green-medium hover:bg-green-soft/10 transition-all duration-300 ease-organic border-b-2 border-transparent;
}

.feature-tab.active {
    @apply border-green-soft text-forest-dark bg-green-soft/10;
}

.tab-content {
    @apply p-6;
}

/* Section avis */
.reviews-section {
    @apply space-y-6;
}

.reviews-container {
    @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}

.reviews-summary {
    @apply p-6 rounded-2xl bg-gradient-naturel border border-green-light/30 space-y-6;
}

.summary-rating {
    @apply space-y-4;
}

.rating-average {
    @apply text-center;
}

.average-value {
    @apply text-5xl font-bold text-forest-dark;
}

.average-max {
    @apply text-2xl text-green-medium/70;
}

.rating-stars {
    @apply space-y-2 text-center;
}

.stars-display {
    @apply flex justify-center gap-1;
}

.stars-display .star {
    @apply text-2xl text-yellow-400;
}

.rating-total {
    @apply block text-green-medium/70;
}

.summary-distribution {
    @apply space-y-2;
}

.distribution-item {
    @apply flex items-center gap-2;
}

.distribution-bar {
    @apply flex-1 h-2 bg-green-light/20 rounded-full overflow-hidden;
}

.bar-fill {
    @apply h-full bg-gradient-to-r from-green-soft to-green-light rounded-full;
}

.add-review-btn {
    @apply w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-soft text-white font-medium hover:bg-green-medium transition-all duration-300 ease-organic;
}

.reviews-list {
    @apply lg:col-span-2 space-y-6;
}

.reviews-filters {
    @apply flex flex-wrap gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-green-light/30;
}

.filter-group {
    @apply flex items-center gap-2;
}

.filter-label {
    @apply text-sm text-green-medium/70;
}

.filter-select {
    @apply px-3 py-1.5 rounded-lg border border-green-light/30 bg-white focus:border-green-soft focus:ring-1 focus:ring-green-soft/30 outline-none;
}

.filter-stars {
    @apply flex gap-1;
}

.star-filter-btn {
    @apply px-2 py-1 rounded-lg border border-green-light/30 text-sm hover:bg-green-soft/10 transition-colors duration-300;
}

.star-filter-btn.active {
    @apply bg-green-soft text-white border-green-soft;
}

.reviews-items {
    @apply space-y-4;
}

.review-item {
    @apply p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-green-light/30 space-y-4;
}

.review-header {
    @apply flex justify-between items-start;
}

.reviewer-info {
    @apply flex items-center gap-3;
}

.reviewer-avatar {
    @apply w-10 h-10 rounded-full bg-green-soft/20 flex items-center justify-center text-green-medium font-bold;
}

.reviewer-details {
    @apply space-y-1;
}

.reviewer-name {
    @apply font-medium text-forest-dark;
}

.review-date {
    @apply text-xs text-green-medium/70;
}

.review-rating {
    @apply flex items-center gap-2;
}

.review-stars {
    @apply flex gap-0.5;
}

.review-stars .star {
    @apply text-sm;
}

.review-stars .star.filled {
    @apply text-yellow-400;
}

.review-verified {
    @apply text-xs text-green-medium;
}

.review-content {
    @apply space-y-3;
}

.review-title {
    @apply font-medium text-forest-dark;
}

.review-text {
    @apply text-green-medium/80;
}

.review-images {
    @apply flex gap-2;
}

.review-image {
    @apply w-20 h-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-300;
}

.review-footer {
    @apply flex justify-between items-center;
}

.review-helpful {
    @apply flex items-center gap-2;
}

.helpful-btn {
    @apply flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-light/30 text-sm text-green-medium hover:bg-green-soft/10 transition-colors duration-300;
}

.helpful-btn.active {
    @apply bg-green-soft/20 border-green-soft text-green-medium;
}

.review-actions {
    @apply flex gap-2;
}

.reviews-pagination {
    @apply flex justify-center items-center gap-4;
}

/* Panneau mobile */
.mobile-purchase-panel {
    @apply fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-green-light/30 transform translate-y-full transition-transform duration-300 ease-organic z-40 md:hidden;
}

.mobile-purchase-panel.visible {
    @apply transform translate-y-0;
}

.panel-content {
    @apply px-4 py-3 flex justify-between items-center;
}

.panel-pricing {
    @apply flex items-center gap-1;
}

.panel-price {
    @apply text-xl font-bold text-forest-dark;
}

.panel-unit {
    @apply text-sm text-green-medium/70;
}

.panel-actions {
    @apply flex gap-2;
}

.panel-btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-organic;
}

.panel-btn.cart-btn {
    @apply bg-green-soft text-white;
}

.panel-btn.buy-btn {
    @apply bg-gradient-to-r from-green-medium to-forest-dark text-white;
}

.panel-btn:disabled {
    @apply opacity-50 cursor-not-allowed;
}

/* Actions flottantes */
.floating-actions {
    @apply fixed right-4 bottom-20 flex flex-col gap-2 z-30;
}

.floating-action-btn {
    @apply w-12 h-12 rounded-full bg-white shadow-organic border border-green-light/30 text-green-medium flex items-center justify-center hover:bg-green-soft hover:text-white transition-all duration-300 ease-organic;
}

.floating-action-btn.scroll-top-btn {
    @apply opacity-0 transform translate-y-10 transition-all duration-300;
}

.floating-action-btn.scroll-top-btn.visible {
    @apply opacity-100 transform translate-y-0;
}

.floating-action-btn.mobile-only {
    @apply hidden md:flex;
}

.floating-action-btn.active {
    @apply bg-green-soft text-white;
}

.floating-action-btn .badge {
    @apply absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center;
}

/* Animations */
.animate-slide-in-up {
    animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-slide-in-down {
    animation: slideInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.lightbox-enter-active,
.lightbox-leave-active {
    transition: all 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
    opacity: 0;
}

.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.notification-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
    .hero-container {
        @apply grid-cols-1;
    }

    .product-gallery {
        @apply mb-6;
    }

    .producer-container {
        @apply grid-cols-1;
    }

    .reviews-container {
        @apply grid-cols-1;
    }

    .features-tabs {
        @apply flex-col;
    }

    .floating-action-btn.mobile-only {
        @apply flex;
    }

    .reviews-filters {
        @apply flex-col items-stretch;
    }
}

/* Impression */
@media print {

    .product-navigation,
    .floating-actions,
    .mobile-purchase-panel {
        @apply hidden;
    }

    .product-main-content {
        @apply max-w-none p-0;
    }

    .organic-background {
        @apply hidden;
    }

    .product-essential-info,
    .producer-section,
    .features-section,
    .reviews-section,
    .related-products-section,
    .faq-section {
        break-inside: avoid;
    }
}
</style>
