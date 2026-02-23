<template>
    <div class="product-form-wrapper">
        <!-- Texture d'arrière-plan organique -->
        <div class="organic-background"></div>

        <!-- En-tête avec navigation fluide -->
        <div class="form-header animate-fade-in">
            <div class="header-content">
                <!-- Icône organique -->
                <div class="header-icon animate-float">
                    <svg class="leaf-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                            fill="currentColor" fill-opacity="0.1" />
                        <path
                            d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 18.7 7.79 17.75 8.5 16.99C10.17 15.31 13.3 15.36 15.56 16.85C17.83 18.34 19 21.87 19 21.87C19 21.87 22 19 22 16C22 13 20 8 17 8Z"
                            fill="currentColor" fill-opacity="0.8" />
                        <path
                            d="M15 5C15 5 15.95 2.95 18 2C19.62 2.55 20 4 20 4C20 4 21.45 4.38 22 6C21.05 8.05 19 8 19 8C19 8 18.05 10.05 16 11C14.38 10.45 14 9 14 9C14 9 12.55 9.38 12 11C10.95 9.95 11 8 11 8C11 8 9.95 6.95 8 6C6.38 6.55 6 8 6 8C6 8 4.55 8.38 4 10C5.05 12.05 7 12 7 12"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </div>

                <!-- Titre dynamique -->
                <h1 class="form-title">
                    <span class="title-text">{{ isEditMode ? 'Cultiver les détails' : 'Semer un nouveau produit'
                    }}</span>
                    <span class="title-subtext animate-subtle-pulse">
                        {{ isEditMode ? 'Affinez votre récolte' : 'Faites pousser votre offre' }}
                    </span>
                </h1>

                <!-- Navigation par étapes -->
                <div class="step-navigation">
                    <div v-for="(step, index) in steps" :key="index" class="step-item" :class="{
                        'active': currentStep === index,
                        'completed': currentStep > index,
                        'next': currentStep < index
                    }" @click="goToStep(index)">
                        <div class="step-indicator">
                            <div class="step-circle">
                                <span v-if="currentStep > index" class="check-icon">✓</span>
                                <span v-else>{{ index + 1 }}</span>
                            </div>
                            <div class="step-line"></div>
                        </div>
                        <span class="step-label">{{ step.label }}</span>
                        <div class="step-hint">{{ step.hint }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formulaire principal avec animation de transition -->
        <transition name="step-slide" mode="out-in">
            <div :key="currentStep" class="form-container">
                <!-- Section 1 : Informations de base -->
                <div v-if="currentStep === 0" class="form-section animate-slide-in-up">
                    <div class="section-header">
                        <h2 class="section-title">🌱 Informations racines</h2>
                        <p class="section-description">Les fondements de votre produit local et authentique</p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Colonne gauche -->
                        <div class="space-y-6">
                            <!-- Nom du produit -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">🍎</span>
                                    Nom du produit *
                                </label>
                                <div class="relative">
                                    <input v-model="formData.name" type="text"
                                        placeholder="Ex: Tomates anciennes du jardin..." class="form-input-organic"
                                        :class="{ 'input-error': errors.name }" @input="generateSlugFromName" />
                                    <div class="input-decoration"></div>
                                    <transition name="fade">
                                        <div v-if="formData.name" class="char-counter">
                                            {{ formData.name.length }}/100
                                        </div>
                                    </transition>
                                </div>
                                <transition name="slide-down">
                                    <div v-if="errors.name" class="error-message">
                                        {{ errors.name }}
                                    </div>
                                </transition>
                            </div>

                            <!-- Description -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">📝</span>
                                    Description gourmande
                                </label>
                                <div class="relative">
                                    <textarea v-model="formData.description" rows="4"
                                        placeholder="Décrivez la saveur, la texture, l'histoire de votre produit..."
                                        class="form-input-organic"
                                        :class="{ 'input-error': errors.description }"></textarea>
                                    <div class="textarea-decoration"></div>
                                    <div class="inspiration-hint">
                                        <span class="hint-icon">💡</span>
                                        <span>Inspirez vos clients avec des détails sensoriels</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Origine et récolte -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="input-group">
                                    <label class="form-label-organic">
                                        <span class="label-icon">📍</span>
                                        Origine
                                    </label>
                                    <input v-model="formData.origin" type="text" placeholder="Ville, région..."
                                        class="form-input-organic" />
                                </div>
                                <div class="input-group">
                                    <label class="form-label-organic">
                                        <span class="label-icon">📅</span>
                                        Date de récolte
                                    </label>
                                    <input v-model="formData.harvest_date" type="date" class="form-input-organic" />
                                </div>
                            </div>
                        </div>

                        <!-- Colonne droite -->
                        <div class="space-y-6">
                            <!-- Slug (généré automatiquement) -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">🔗</span>
                                    Lien unique (URL)
                                </label>
                                <div class="relative">
                                    <div class="slug-preview">
                                        <span class="slug-prefix">farmershub.com/produits/</span>
                                        <input v-model="formData.slug" type="text"
                                            placeholder="tomates-anciennes-jardin" class="slug-input"
                                            :class="{ 'input-error': errors.slug }" />
                                    </div>
                                    <button type="button" @click="generateSlug" class="slug-generator-btn"
                                        title="Générer automatiquement">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Catégorie avec arbre visuel -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">🌿</span>
                                    Catégorie *
                                </label>
                                <CategorySelector v-model="formData.category_id" :error="errors.category_id"
                                    @change="onCategoryChange" />
                                <transition name="fade">
                                    <div v-if="selectedCategory" class="category-preview">
                                        <div class="category-badge" :style="categoryStyle">
                                            {{ selectedCategory.name }}
                                        </div>
                                        <p v-if="selectedCategory.description" class="category-hint">
                                            {{ selectedCategory.description }}
                                        </p>
                                    </div>
                                </transition>
                            </div>

                            <!-- Tags sélection -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">🏷️</span>
                                    Labels & caractéristiques
                                </label>
                                <TagSelector v-model="formData.tags" :max-tags="5" @change="onTagsChange" />
                                <div class="tags-preview">
                                    <div v-for="tag in selectedTags" :key="tag.id" class="tag-preview-item">
                                        <span class="tag-badge"
                                            :style="{ backgroundColor: tag.color + '20', color: tag.color }">
                                            {{ tag.name }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 2 : Prix et unités -->
                <div v-else-if="currentStep === 1" class="form-section animate-slide-in-up">
                    <div class="section-header">
                        <h2 class="section-title">💰 Valeur & Mesure</h2>
                        <p class="section-description">Définissez le prix et l'unité qui correspondent à votre produit
                        </p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Colonne gauche - Prix -->
                        <div class="space-y-6">
                            <!-- Prix de base -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">💶</span>
                                    Prix de base *
                                </label>
                                <div class="price-input-wrapper">
                                    <div class="price-prefix">€</div>
                                    <input v-model.number="formData.price" type="number" step="0.01" min="0"
                                        placeholder="0,00" class="price-input"
                                        :class="{ 'input-error': errors.price }" />
                                    <div class="price-suffix">HT</div>
                                </div>
                                <transition name="fade">
                                    <div v-if="formData.price" class="price-preview">
                                        <span class="price-display">
                                            {{ formatPrice(formData.price) }}
                                        </span>
                                        <span class="price-hint">par unité sélectionnée</span>
                                    </div>
                                </transition>
                            </div>

                            <!-- Comparaison de prix -->
                            <div class="price-comparison card-organic">
                                <h3 class="comparison-title">🎯 Contexte de prix</h3>
                                <div class="comparison-grid">
                                    <div class="comparison-item">
                                        <span class="comparison-label">Moyenne du marché</span>
                                        <span class="comparison-value">€4.50/kg</span>
                                    </div>
                                    <div class="comparison-item">
                                        <span class="comparison-label">Bio équivalent</span>
                                        <span class="comparison-value">€6.20/kg</span>
                                    </div>
                                    <div class="comparison-item">
                                        <span class="comparison-label">Votre prix</span>
                                        <span class="comparison-value highlight">{{ formatPrice(formData.price)
                                        }}/kg</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Quantités de commande -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="input-group">
                                    <label class="form-label-organic">
                                        <span class="label-icon">📦</span>
                                        Commande minimum
                                    </label>
                                    <input v-model.number="formData.min_order" type="number" min="1" placeholder="1"
                                        class="form-input-organic" />
                                </div>
                                <div class="input-group">
                                    <label class="form-label-organic">
                                        <span class="label-icon">🚚</span>
                                        Commande maximum
                                    </label>
                                    <input v-model.number="formData.max_order" type="number"
                                        :min="formData.min_order || 1" placeholder="Illimité"
                                        class="form-input-organic" />
                                </div>
                            </div>
                        </div>

                        <!-- Colonne droite - Unités -->
                        <div class="space-y-6">
                            <!-- Sélecteur d'unité -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">⚖️</span>
                                    Unité de vente *
                                </label>
                                <UnitSelector v-model="formData.unit_id" :error="!!errors.unit_id"
                                    @change="onUnitChange" />
                                <transition name="fade">
                                    <div v-if="selectedUnit" class="unit-preview">
                                        <div class="unit-display">
                                            <span class="unit-symbol">{{ selectedUnit.symbol }}</span>
                                            <span class="unit-name">{{ selectedUnit.name }}</span>
                                        </div>
                                        <p v-if="selectedUnit.description" class="unit-description">
                                            {{ selectedUnit.description }}
                                        </p>
                                    </div>
                                </transition>
                            </div>

                            <!-- Variantes de prix par unité -->
                            <div class="unit-variants card-organic">
                                <h3 class="variants-title">🔄 Variantes d'unité</h3>
                                <div class="variants-list">
                                    <div class="variant-item">
                                        <span class="variant-label">Petit panier</span>
                                        <span class="variant-price">{{ formatPrice(formData.price * 0.5) }}</span>
                                        <span class="variant-hint">(500g)</span>
                                    </div>
                                    <div class="variant-item">
                                        <span class="variant-label">Panier standard</span>
                                        <span class="variant-price highlight">{{ formatPrice(formData.price) }}</span>
                                        <span class="variant-hint">(1kg)</span>
                                    </div>
                                    <div class="variant-item">
                                        <span class="variant-label">Gros panier</span>
                                        <span class="variant-price">{{ formatPrice(formData.price * 1.8) }}</span>
                                        <span class="variant-hint">(2kg, -10%)</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Calcul automatique -->
                            <div class="auto-calculation card-organic">
                                <h3 class="calculation-title">🧮 Calcul rapide</h3>
                                <div class="calculation-formula">
                                    <div class="formula-item">
                                        <span>Prix de base</span>
                                        <span>{{ formData.price || 0 }}€</span>
                                    </div>
                                    <div class="formula-item">
                                        <span>× Quantité</span>
                                        <input v-model.number="calculationQuantity" type="number" min="1"
                                            class="calculation-input" placeholder="1" />
                                    </div>
                                    <div class="formula-divider">=</div>
                                    <div class="formula-result">
                                        <span>Total</span>
                                        <span class="result-value">{{ formatPrice((formData.price || 0) *
                                            calculationQuantity) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 3 : Stock et disponibilité -->
                <div v-else-if="currentStep === 2" class="form-section animate-slide-in-up">
                    <div class="section-header">
                        <h2 class="section-title">📊 Gestion des récoltes</h2>
                        <p class="section-description">Organisez votre stock et planifiez la disponibilité</p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Colonne gauche - Stock -->
                        <div class="space-y-6">
                            <!-- Quantité en stock -->
                            <div class="input-group">
                                <label class="form-label-organic">
                                    <span class="label-icon">📦</span>
                                    Quantité disponible *
                                </label>
                                <div class="stock-input-wrapper">
                                    <input v-model.number="formData.stock_quantity" type="number" min="0"
                                        placeholder="0" class="stock-input" :class="{
                                            'input-error': errors.stock_quantity,
                                            'low-stock': formData.stock_quantity > 0 && formData.stock_quantity < 10,
                                            'out-of-stock': formData.stock_quantity === 0
                                        }" />
                                    <div class="stock-indicator" :class="getStockIndicatorClass">
                                        {{ getStockStatusText }}
                                    </div>
                                </div>
                                <div class="stock-helper">
                                    <div class="stock-bar">
                                        <div class="stock-fill" :style="stockFillStyle"></div>
                                    </div>
                                    <div class="stock-hints">
                                        <span class="hint-item">😊 Abondant: 100+</span>
                                        <span class="hint-item">👌 Bon: 50-99</span>
                                        <span class="hint-item">⚠️ Limité: 10-49</span>
                                        <span class="hint-item">🚨 Faible: 1-9</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Alertes de stock -->
                            <div class="stock-alerts card-organic">
                                <h3 class="alerts-title">🔔 Alertes automatiques</h3>
                                <div class="alerts-list">
                                    <div class="alert-item">
                                        <label class="alert-label">
                                            <input v-model="stockAlerts.lowStock" type="checkbox"
                                                class="alert-checkbox" />
                                            <span>Alerte stock faible (< 10 unités)</span>
                                        </label>
                                    </div>
                                    <div class="alert-item">
                                        <label class="alert-label">
                                            <input v-model="stockAlerts.outOfStock" type="checkbox"
                                                class="alert-checkbox" />
                                            <span>Alerte rupture de stock</span>
                                        </label>
                                    </div>
                                    <div class="alert-item">
                                        <label class="alert-label">
                                            <input v-model="stockAlerts.reorder" type="checkbox"
                                                class="alert-checkbox" />
                                            <span>Rappel de réapprovisionnement</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Historique du stock -->
                            <div class="stock-history card-organic">
                                <h3 class="history-title">📈 Tendances</h3>
                                <div class="history-chart">
                                    <div class="chart-bars">
                                        <div v-for="(month, index) in stockHistory" :key="index" class="chart-bar">
                                            <div class="bar-fill" :style="{ height: month.value + '%' }"></div>
                                            <span class="bar-label">{{ month.label }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Colonne droite - Disponibilité -->
                        <div class="space-y-6">
                            <!-- Calendrier de disponibilité -->
                            <div class="availability-calendar card-organic">
                                <h3 class="calendar-title">📅 Disponibilité saisonnière</h3>
                                <div class="calendar-grid">
                                    <div v-for="month in months" :key="month" class="calendar-month">
                                        <label class="month-label">
                                            <input v-model="availability.months" type="checkbox" :value="month"
                                                class="month-checkbox" />
                                            <span class="month-name">{{ month }}</span>
                                        </label>
                                        <div class="season-indicator" :class="getSeasonClass(month)"></div>
                                    </div>
                                </div>
                                <div class="season-legend">
                                    <div class="legend-item">
                                        <div class="legend-color spring"></div>
                                        <span>Printemps</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color summer"></div>
                                        <span>Été</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color autumn"></div>
                                        <span>Automne</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color winter"></div>
                                        <span>Hiver</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Jours de livraison -->
                            <div class="delivery-days card-organic">
                                <h3 class="delivery-title">🚚 Jours de distribution</h3>
                                <div class="days-grid">
                                    <label v-for="(day, index) in weekDays" :key="index" class="day-item">
                                        <input v-model="availability.deliveryDays" type="checkbox" :value="index"
                                            class="day-checkbox" />
                                        <span class="day-name">{{ day }}</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Statut du produit -->
                            <div class="product-status card-organic">
                                <h3 class="status-title">🎯 Statut de vente</h3>
                                <div class="status-options">
                                    <label class="status-option">
                                        <input v-model="formData.is_active" type="checkbox" class="status-checkbox" />
                                        <div class="status-content">
                                            <span class="status-label">Produit actif</span>
                                            <span class="status-hint">Visible dans le catalogue</span>
                                        </div>
                                        <div class="status-indicator" :class="{ 'active': formData.is_active }"></div>
                                    </label>
                                    <label class="status-option">
                                        <input v-model="formData.is_featured" type="checkbox" class="status-checkbox" />
                                        <div class="status-content">
                                            <span class="status-label">Produit vedette</span>
                                            <span class="status-hint">Mis en avant sur la page d'accueil</span>
                                        </div>
                                        <div class="status-indicator" :class="{ 'active': formData.is_featured }"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 4 : Images et présentation -->
                <div v-else class="form-section animate-slide-in-up">
                    <div class="section-header">
                        <h2 class="section-title">🖼️ Présentation gourmande</h2>
                        <p class="section-description">Montrez votre produit sous son meilleur jour</p>
                    </div>

                    <div class="space-y-8">
                        <!-- Uploader d'images -->
                        <div class="image-uploader-wrapper">
                            <ProductImageUploader v-model="formData.images" :max-images="5" :product-id="productId ? Number(productId) : undefined"
                                @primary-selected="setPrimaryImage" @image-removed="removeImage" />
                            <div class="uploader-tips">
                                <div class="tip-item">
                                    <span class="tip-icon">📸</span>
                                    <span>Utilisez la lumière naturelle</span>
                                </div>
                                <div class="tip-item">
                                    <span class="tip-icon">🎨</span>
                                    <span>Montrez le produit sous différents angles</span>
                                </div>
                                <div class="tip-item">
                                    <span class="tip-icon">🌿</span>
                                    <span>Ajoutez une photo du producteur</span>
                                </div>
                            </div>
                        </div>

                        <!-- Galerie prévisualisation -->
                        <div v-if="formData.images.length > 0" class="image-gallery-preview">
                            <h3 class="gallery-title">Aperçu de la galerie</h3>
                            <div class="gallery-grid">
                                <div v-for="(image, index) in formData.images" :key="index" class="gallery-item"
                                    :class="{ 'primary': image.is_primary }">
                                    <img :src="getImageUrl(image)" :alt="image.alt_text" class="gallery-image" />
                                    <div class="gallery-overlay">
                                        <button @click="removeImage(index)" class="remove-btn" title="Supprimer">
                                            ✕
                                        </button>
                                        <button @click="setPrimaryImage(index)" class="primary-btn"
                                            :class="{ 'active': image.is_primary }"
                                            :title="image.is_primary ? 'Image principale' : 'Définir comme principale'">
                                            ⭐
                                        </button>
                                    </div>
                                    <div class="image-position">#{{ index + 1 }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Description des images -->
                        <div class="image-metadata">
                            <div class="metadata-group">
                                <label class="metadata-label">Texte alternatif des images</label>
                                <input v-model="imageAltText" type="text"
                                    placeholder="Description pour l'accessibilité..." class="metadata-input" />
                                <p class="metadata-hint">Décrivez l'image pour les malvoyants</p>
                            </div>
                        </div>

                        <!-- Aperçu sur mobile -->
                        <div class="mobile-preview card-organic">
                            <h3 class="preview-title">📱 Aperçu mobile</h3>
                            <div class="preview-device">
                                <div class="device-screen">
                                    <div v-if="formData.images[0]" class="preview-image">
                                        <img :src="getImageUrl(formData.images[0])" alt="Preview" />
                                    </div>
                                    <div class="preview-content">
                                        <h4 class="preview-product-name">{{ formData.name || 'Nom du produit' }}</h4>
                                        <p class="preview-price">{{ formatPrice(formData.price || 0) }}</p>
                                        <div class="preview-tags">
                                            <span v-if="selectedCategory" class="preview-tag">{{ selectedCategory.name
                                            }}</span>
                                            <span v-if="selectedUnit" class="preview-tag">{{ selectedUnit.symbol
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Navigation entre les étapes -->
        <div class="form-navigation animate-fade-in">
            <div class="navigation-content">
                <!-- Bouton précédent -->
                <button v-if="currentStep > 0" @click="previousStep" class="nav-btn prev-btn">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Précédent</span>
                    <span class="step-name">{{ steps[currentStep - 1].label }}</span>
                </button>

                <div v-else class="nav-spacer"></div>

                <!-- Indicateur de progression -->
                <div class="progress-indicator">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="progressStyle"></div>
                    </div>
                    <span class="progress-text">
                        Étape {{ currentStep + 1 }} sur {{ steps.length }}
                    </span>
                </div>

                <!-- Bouton suivant/soumettre -->
                <button v-if="currentStep < steps.length - 1" @click="nextStep" class="nav-btn next-btn"
                    :disabled="!isStepValid">
                    <span>Continuer</span>
                    <span class="step-name">{{ steps[currentStep + 1].label }}</span>
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <button v-else @click="submitForm" class="nav-btn submit-btn" :disabled="isSubmitting || !isFormValid">
                    <span v-if="isSubmitting" class="submit-loading">
                        <div class="loading-spinner"></div>
                        Publication en cours...
                    </span>
                    <span v-else class="submit-content">
                        <span class="submit-icon">🌱</span>
                        {{ isEditMode ? 'Mettre à jour le produit' : 'Publier le produit' }}
                    </span>
                </button>
            </div>

            <!-- Sauvegarde automatique -->
            <div v-if="autoSaveStatus" class="auto-save-status">
                <div class="auto-save-indicator" :class="autoSaveStatus"></div>
                <span class="auto-save-text">
                    {{ autoSaveMessages[autoSaveStatus] }}
                </span>
            </div>
        </div>

        <!-- Aperçu rapide flottant -->
        <div class="floating-preview animate-float">
            <div class="preview-header">
                <h4>Aperçu produit</h4>
                <button @click="togglePreview" class="preview-toggle">
                    {{ showPreview ? '⇧' : '⇩' }}
                </button>
            </div>
            <transition name="slide-down">
                <div v-if="showPreview" class="preview-content">
                    <div class="preview-card card-organic">
                        <div class="preview-image">
                            <div v-if="formData.images[0]" class="image-container">
                                <img :src="getImageUrl(formData.images[0])" alt="Preview" />
                            </div>
                            <div v-else class="image-placeholder">
                                <span>🖼️</span>
                            </div>
                        </div>
                        <div class="preview-info">
                            <h5>{{ formData.name || 'Nom du produit' }}</h5>
                            <p class="preview-description">
                                {{ truncateDescription(formData.description) }}
                            </p>
                            <div class="preview-meta">
                                <span class="preview-price">{{ formatPrice(formData.price || 0) }}</span>
                                <span v-if="selectedUnit" class="preview-unit">/{{ selectedUnit.symbol }}</span>
                            </div>
                            <div class="preview-tags">
                                <span v-if="selectedCategory" class="preview-tag">{{ selectedCategory.name }}</span>
                                <span v-if="formData.stock_quantity > 0" class="preview-stock">
                                    📦 {{ formData.stock_quantity }} disponible{{ formData.stock_quantity > 1 ? 's' : ''
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/modules/catalog/store/modules/product.store'
import { useCategoryStore } from '@/modules/catalog/store/modules/category.store'
import { useUnitStore } from '@/modules/catalog/store/modules/unit.store'
import { useTagStore } from '@/modules/catalog/store/modules/tag.store'
import CategorySelector from '../Category/CategorySelector.vue'
import UnitSelector from '../Unit/UnitSelector.vue'
import TagSelector from '../Tag/TagSelector.vue'
import ProductImageUploader from '../ProductImage/ProductImageUploader.vue'

interface Props {
    productId?: string
}

interface Emits {
    (e: 'success'): void
    (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const unitStore = useUnitStore()
const tagStore = useTagStore()
const router = useRouter()

// États réactifs
const isEditMode = computed(() => !!props.productId)
const currentStep = ref(0)
const isSubmitting = ref(false)
const showPreview = ref(true)
const calculationQuantity = ref(1)
const imageAltText = ref('')
const autoSaveTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const autoSaveStatus = ref<'saved' | 'saving' | 'error' | null>(null)

// Données du formulaire
const formData = reactive({
    name: '',
    slug: '',
    description: '',
    price: 0,
    category_id: null as string | null,
    unit_id: null as string | null,
    stock_quantity: 0,
    min_order: 1,
    max_order: null as number | null,
    is_active: true,
    is_featured: false,
    origin: '',
    harvest_date: '',
    tags: [] as string[],
    images: [] as any[]
})

// Erreurs de validation
const errors = reactive({
    name: '',
    slug: '',
    description: '',
    price: '',
    category_id: '',
    unit_id: '',
    stock_quantity: ''
})

// États supplémentaires
const availability = reactive({
    months: [] as string[],
    deliveryDays: [] as number[]
})

const stockAlerts = reactive({
    lowStock: true,
    outOfStock: true,
    reorder: false
})

// Données de sélection
const selectedCategory = computed(() => {
    return categoryStore.categories.find(c => c.id === formData.category_id) || null
})

const selectedUnit = computed(() => {
    return unitStore.units.find(u => u.id === formData.unit_id) || null
})

const selectedTags = computed(() => {
    return tagStore.tags.filter(t => formData.tags.includes(t.id))
})

// Étapes du formulaire
const steps = [
    { label: 'Informations', hint: 'Nom, description, catégorie' },
    { label: 'Prix & Unité', hint: 'Tarification et mesure' },
    { label: 'Stock', hint: 'Disponibilité et gestion' },
    { label: 'Images', hint: 'Présentation visuelle' }
]

// Données pour les sélecteurs
const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
]

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const stockHistory = [
    { label: 'J', value: 80 },
    { label: 'F', value: 75 },
    { label: 'M', value: 90 },
    { label: 'A', value: 85 },
    { label: 'M', value: 95 },
    { label: 'J', value: 100 }
]

// Computed properties
const progressStyle = computed(() => ({
    width: `${((currentStep.value + 1) / steps.length) * 100}%`
}))

const stockFillStyle = computed(() => ({
    width: `${Math.min((formData.stock_quantity / 100) * 100, 100)}%`
}))

const getStockIndicatorClass = computed(() => {
    if (formData.stock_quantity === 0) return 'out-of-stock'
    if (formData.stock_quantity < 10) return 'low-stock'
    if (formData.stock_quantity < 50) return 'limited-stock'
    return 'good-stock'
})

const getStockStatusText = computed(() => {
    if (formData.stock_quantity === 0) return 'Rupture'
    if (formData.stock_quantity < 10) return 'Faible'
    if (formData.stock_quantity < 50) return 'Limité'
    return 'Bon'
})

const categoryStyle = computed(() => {
    if (!selectedCategory.value) return {}
    const color = (selectedCategory.value as { color?: string }).color || '#10b981'
    return {
        backgroundColor: `${color}20`,
        color,
        borderColor: color
    }
})

const autoSaveMessages = {
    saving: 'Sauvegarde en cours...',
    saved: 'Modifications sauvegardées',
    error: 'Erreur de sauvegarde'
}

// Validation
const isStepValid = computed(() => {
    switch (currentStep.value) {
        case 0:
            return formData.name.trim().length >= 3 && formData.category_id !== null
        case 1:
            return formData.price > 0 && formData.unit_id !== null
        case 2:
            return formData.stock_quantity >= 0
        case 3:
            return true // Les images sont optionnelles
        default:
            return false
    }
})

const isFormValid = computed(() => {
    return formData.name.trim().length >= 3 &&
        formData.category_id !== null &&
        formData.price > 0 &&
        formData.unit_id !== null &&
        formData.stock_quantity >= 0
})

// Méthodes
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(price)
}

const generateSlugFromName = () => {
    if (!formData.slug || formData.slug === '') {
        generateSlug()
    }
}

const generateSlug = () => {
    const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
        .slice(0, 100)

    formData.slug = slug
}

const onCategoryChange = (category: any) => {
    console.log('Catégorie sélectionnée:', category)
}

const onUnitChange = (unit: any) => {
    console.log('Unité sélectionnée:', unit)
}

const onTagsChange = (tags: any[]) => {
    console.log('Tags sélectionnés:', tags)
}

const getSeasonClass = (month: string) => {
    const monthIndex = months.indexOf(month)
    if (monthIndex >= 2 && monthIndex <= 4) return 'spring'
    if (monthIndex >= 5 && monthIndex <= 7) return 'summer'
    if (monthIndex >= 8 && monthIndex <= 10) return 'autumn'
    return 'winter'
}

const getImageUrl = (image: any) => {
    if (image.url) return image.url
    if (image.file) return URL.createObjectURL(image.file)
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f8f4e9"/%3E%3Cpath d="M80,70 Q100,50 120,70 T160,70" stroke="%23a7d397" stroke-width="3" fill="none"/%3E%3Ccircle cx="100" cy="90" r="20" fill="%235a8c5a"/%3E%3C/svg%3E'
}

const setPrimaryImage = (index: number) => {
    formData.images.forEach((img, i) => {
        img.is_primary = i === index
    })
}

const removeImage = (index: number) => {
    formData.images.splice(index, 1)
}

const truncateDescription = (text: string, length = 100) => {
    if (!text) return 'Aucune description'
    return text.length > length ? text.substring(0, length) + '...' : text
}

const togglePreview = () => {
    showPreview.value = !showPreview.value
}

const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
        currentStep.value = step
    }
}

const nextStep = () => {
    if (currentStep.value < steps.length - 1 && isStepValid.value) {
        currentStep.value++
    }
}

const previousStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--
    }
}

const autoSave = () => {
    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value)
    }

    autoSaveStatus.value = 'saving'

    autoSaveTimer.value = setTimeout(() => {
        // Simuler la sauvegarde
        setTimeout(() => {
            autoSaveStatus.value = 'saved'
            setTimeout(() => {
                autoSaveStatus.value = null
            }, 2000)
        }, 500)
    }, 1000)
}

const submitForm = async () => {
    if (!isFormValid.value || isSubmitting.value) return

    isSubmitting.value = true

    try {
        const productData = {
            ...formData,
            producer_id: 1, // À remplacer par l'ID du producteur connecté
            availability: {
                months: availability.months,
                delivery_days: availability.deliveryDays
            },
            stock_alerts: stockAlerts
        }

        if (isEditMode.value && props.productId) {
            await productStore.updateProduct(props.productId, productData)
        } else {
            await productStore.createProduct(productData)
        }

        emit('success')

        // Redirection ou message de succès
        setTimeout(() => {
            router.push('/catalog/products/my')
        }, 1500)

    } catch (error) {
        console.error('Erreur lors de la soumission:', error)
        // Gérer les erreurs de validation
    } finally {
        isSubmitting.value = false
    }
}

const loadProductData = async () => {
    if (!props.productId) return

    try {
        await productStore.getProductById(props.productId)

        if (productStore.currentProduct) {
            Object.assign(formData, productStore.currentProduct)

            // Charger les données associées
            if (formData.category_id) {
                await categoryStore.fetchAllCategories()
            }
            if (formData.unit_id) {
                await unitStore.fetchAllUnits()
            }
            if (formData.tags && formData.tags.length > 0) {
                await tagStore.fetchAllTags()
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement du produit:', error)
    }
}

// Watch pour l'auto-save
watch(formData, () => {
    if (isEditMode.value) {
        autoSave()
    }
}, { deep: true })

// Cycle de vie
onMounted(async () => {
    // Charger les données initiales
    await Promise.all([
        categoryStore.fetchAllCategories(),
        unitStore.fetchAllUnits(),
        tagStore.fetchAllTags()
    ])

    if (props.productId) {
        await loadProductData()
    }
})

onUnmounted(() => {
    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value)
    }
})
</script>

<style scoped>
.product-form-wrapper {
    @apply relative min-h-screen bg-gradient-nature p-4 md:p-8;
}

.organic-background {
    @apply absolute inset-0 bg-leaf-pattern opacity-5;
    animation: float-leaves 60s linear infinite;
}

/* Header styles */
.form-header {
    @apply mb-8 relative z-10;
}

.header-content {
    @apply max-w-6xl mx-auto;
}

.header-icon {
    @apply mb-4 text-green-medium;
}

.leaf-icon {
    @apply w-12 h-12;
}

.form-title {
    @apply mb-6;
}

.title-text {
    @apply block text-3xl md:text-4xl font-bold text-forest-dark mb-2;
}

.title-subtext {
    @apply block text-lg text-green-medium italic;
}

/* Step navigation */
.step-navigation {
    @apply flex flex-wrap gap-2 md:gap-4 mt-8;
}

.step-item {
    @apply flex-1 min-w-[120px] cursor-pointer transition-all duration-300 ease-organic;
}

.step-item:hover {
    @apply transform scale-105;
}

.step-indicator {
    @apply flex items-center mb-2;
}

.step-circle {
    @apply w-8 h-8 rounded-full flex items-center justify-center border-2 border-green-light bg-white text-green-medium font-bold text-sm transition-all duration-300 ease-organic;
}

.step-item.active .step-circle {
    @apply bg-gradient-vert text-white border-green-soft transform scale-110;
}

.step-item.completed .step-circle {
    @apply bg-green-soft text-white border-green-soft;
}

.step-line {
    @apply flex-1 h-0.5 bg-green-light/30 ml-2 transition-all duration-300;
}

.step-item.completed .step-line {
    @apply bg-green-soft;
}

.step-label {
    @apply block text-sm font-medium text-forest-dark mb-1;
}

.step-hint {
    @apply block text-xs text-green-medium/70;
}

/* Form container */
.form-container {
    @apply max-w-6xl mx-auto relative z-10;
}

.form-section {
    @apply bg-gradient-naturel rounded-3xl border border-green-light/30 shadow-organic p-6 md:p-8 mb-8 backdrop-blur-sm;
}

.section-header {
    @apply mb-8 pb-6 border-b border-green-light/20;
}

.section-title {
    @apply text-2xl font-bold text-forest-dark mb-2 flex items-center gap-3;
}

.section-description {
    @apply text-green-medium/80;
}

/* Input groups */
.input-group {
    @apply mb-6;
}

/* Price input */
.price-input-wrapper {
    @apply flex items-center border-2 border-green-light/30 rounded-xl bg-white overflow-hidden transition-all duration-300 ease-organic focus-within:border-green-soft focus-within:ring-2 focus-within:ring-green-soft/30;
}

.price-prefix,
.price-suffix {
    @apply px-4 py-3 bg-green-light/10 text-green-medium font-medium;
}

.price-input {
    @apply flex-1 px-4 py-3 border-none outline-none text-forest-dark text-lg font-medium bg-transparent;
}

.price-preview {
    @apply mt-2 flex items-center gap-2;
}

.price-display {
    @apply text-2xl font-bold text-forest-dark;
}

.price-hint {
    @apply text-sm text-green-medium/70;
}

/* Stock input */
.stock-input-wrapper {
    @apply relative;
}

.stock-input {
    @apply w-full px-4 py-3 bg-cream-light/50 backdrop-blur-sm rounded-xl border-2 border-green-light/30 focus:border-green-soft focus:ring-2 focus:ring-green-soft/30 outline-none transition-all duration-300 ease-organic text-forest-dark;
}

.stock-input.low-stock {
    @apply border-terracotta/50 focus:border-terracotta;
}

.stock-input.out-of-stock {
    @apply border-red-300/50 focus:border-red-400;
}

.stock-indicator {
    @apply absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300;
}

.stock-indicator.good-stock {
    @apply bg-green-soft/20 text-green-medium;
}

.stock-indicator.limited-stock {
    @apply bg-accent-orange/20 text-accent-orange;
}

.stock-indicator.low-stock {
    @apply bg-terracotta/20 text-terracotta;
}

.stock-indicator.out-of-stock {
    @apply bg-red-100 text-red-600;
}

.stock-helper {
    @apply mt-3;
}

.stock-bar {
    @apply h-2 bg-green-light/20 rounded-full overflow-hidden mb-2;
}

.stock-fill {
    @apply h-full bg-gradient-to-r from-green-soft to-green-light rounded-full transition-all duration-500 ease-organic;
}

.stock-hints {
    @apply flex justify-between text-xs text-green-medium/60;
}

/* Cards organiques */
.card-organic {
    @apply bg-gradient-naturel rounded-2xl border border-green-light/30 p-4 transition-all duration-300 ease-organic;
}

.card-organic:hover {
    @apply shadow-organic-hover border-green-light/50;
}

/* Preview cards */
.preview-card {
    @apply flex gap-4;
}

.preview-image .image-container {
    @apply w-20 h-20 rounded-xl overflow-hidden;
}

.preview-image img {
    @apply w-full h-full object-cover;
}

.preview-image .image-placeholder {
    @apply w-20 h-20 rounded-xl bg-green-light/20 flex items-center justify-center text-green-medium text-2xl;
}

.preview-info {
    @apply flex-1;
}

.preview-info h5 {
    @apply font-bold text-forest-dark mb-1;
}

.preview-description {
    @apply text-sm text-green-medium/80 mb-2 line-clamp-2;
}

.preview-meta {
    @apply flex items-center gap-2 mb-2;
}

.preview-price {
    @apply font-bold text-forest-dark;
}

.preview-unit {
    @apply text-sm text-green-medium/70;
}

.preview-tags {
    @apply flex flex-wrap gap-2;
}

.preview-tag {
    @apply px-2 py-1 bg-green-soft/20 text-green-medium text-xs rounded-full font-medium;
}

/* Navigation */
.form-navigation {
    @apply fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-green-light/30 py-4 z-20;
}

.navigation-content {
    @apply max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8;
}

.nav-btn {
    @apply px-6 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 ease-organic;
}

.prev-btn {
    @apply bg-gradient-naturel border border-green-light/50 text-green-medium hover:bg-green-soft/10 hover:border-green-soft;
}

.next-btn {
    @apply bg-gradient-vert text-white hover:shadow-organic-hover disabled:opacity-50 disabled:cursor-not-allowed;
}

.submit-btn {
    @apply bg-gradient-to-r from-green-medium to-forest-dark text-white hover:shadow-organic-hover disabled:opacity-50 disabled:cursor-not-allowed px-8;
}

.submit-loading {
    @apply flex items-center gap-2;
}

.loading-spinner {
    @apply w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin;
}

.submit-content {
    @apply flex items-center gap-2;
}

.progress-indicator {
    @apply flex-1 max-w-md mx-8;
}

.progress-bar {
    @apply h-2 bg-green-light/20 rounded-full overflow-hidden mb-2;
}

.progress-fill {
    @apply h-full bg-gradient-to-r from-green-soft to-green-medium rounded-full transition-all duration-500 ease-organic;
}

.progress-text {
    @apply block text-center text-sm text-green-medium;
}

.step-name {
    @apply hidden md:inline;
}

/* Floating preview */
.floating-preview {
    @apply fixed right-4 bottom-20 w-80 z-10;
}

.preview-header {
    @apply flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-t-xl px-4 py-2 border-b border-green-light/30;
}

.preview-header h4 {
    @apply font-medium text-forest-dark;
}

.preview-toggle {
    @apply w-6 h-6 flex items-center justify-center rounded-full bg-green-soft/20 text-green-medium hover:bg-green-soft/30 transition-all duration-300;
}

.preview-content {
    @apply bg-white/95 backdrop-blur-md rounded-b-xl shadow-organic overflow-hidden;
}

/* Animations */
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

.animate-slide-in-up {
    animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-slide-enter-active,
.step-slide-leave-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.step-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .form-section {
        @apply p-4;
    }

    .step-navigation {
        @apply flex-col;
    }

    .step-item {
        @apply flex items-center gap-3;
    }

    .step-indicator {
        @apply mb-0;
    }

    .step-line {
        @apply hidden;
    }

    .floating-preview {
        @apply hidden;
    }

    .navigation-content {
        @apply px-2;
    }

    .nav-btn {
        @apply px-4 py-2 text-sm;
    }
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(198, 230, 179, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--green-soft), var(--green-light));
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, var(--green-light), var(--green-medium));
}
</style>
