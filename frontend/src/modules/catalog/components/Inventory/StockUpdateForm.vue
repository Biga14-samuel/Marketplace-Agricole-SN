<template>
    <div class="min-h-screen organic-split-bg relative overflow-hidden">
        <!-- Split Screen Container -->
        <div class="flex flex-col lg:flex-row min-h-screen">
            <!-- Illustration de gauche - Jardin de produits frais -->
            <div class="lg:w-1/2 relative overflow-hidden animate-slide-in-left">
                <div class="absolute inset-0 bg-gradient-to-br from-green-900/30 via-emerald-800/20 to-teal-900/10">
                </div>

                <!-- Jardin animé -->
                <div class="relative h-full flex items-center justify-center p-8 lg:p-12">
                    <div class="relative z-20 text-center max-w-2xl">
                        <!-- Titre inspirant -->
                        <h2 class="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
                            Mettre à jour le Stock
                        </h2>
                        <p class="text-xl lg:text-2xl text-green-50/90 mb-8 leading-relaxed">
                            Réapprovisionnez votre inventaire avec des produits frais et locaux
                        </p>

                        <!-- Jardin interactif -->
                        <div class="relative mx-auto w-full h-96 mb-8">
                            <!-- Sol de jardin -->
                            <div
                                class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-earth-brown/80 to-amber-900/60 rounded-t-3xl">
                            </div>

                            <!-- Plantes et légumes animés -->
                            <div class="absolute bottom-32 left-1/4 text-6xl animate-grow"
                                style="animation-delay: 0.3s;">🥕</div>
                            <div class="absolute bottom-28 right-1/4 text-7xl animate-grow"
                                style="animation-delay: 0.6s;">🍅</div>
                            <div class="absolute bottom-36 left-1/3 text-5xl animate-grow"
                                style="animation-delay: 0.9s;">🥬</div>
                            <div class="absolute bottom-40 right-1/3 text-6xl animate-grow"
                                style="animation-delay: 1.2s;">🥦</div>

                            <!-- Arbre fruitier -->
                            <div class="absolute bottom-32 left-10 text-8xl animate-sway"
                                style="animation-delay: 0.5s;">🌳</div>
                            <div class="absolute top-20 right-12 text-7xl animate-bounce-soft"
                                style="animation-delay: 1.5s;">🍎</div>
                            <div class="absolute top-28 left-20 text-6xl animate-bounce-soft"
                                style="animation-delay: 2s;">🍐</div>

                            <!-- Panier de récolte -->
                            <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                                <div class="relative animate-float">
                                    <div
                                        class="w-24 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg rotate-12">
                                    </div>
                                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 text-5xl">🧺</div>
                                    <div class="absolute top-2 left-6 text-3xl animate-bounce-soft"
                                        style="animation-delay: 0.7s;">🍓</div>
                                    <div class="absolute top-1 right-6 text-3xl animate-bounce-soft"
                                        style="animation-delay: 1s;">🍇</div>
                                </div>
                            </div>
                        </div>

                        <!-- Statistiques inspirantes -->
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <p class="text-3xl font-bold text-white">24h</p>
                                <p class="text-green-50/80 text-sm">Frais maximum</p>
                            </div>
                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <p class="text-3xl font-bold text-white">100%</p>
                                <p class="text-green-50/80 text-sm">Produits locaux</p>
                            </div>
                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <p class="text-3xl font-bold text-white">50+</p>
                                <p class="text-green-50/80 text-sm">Producteurs</p>
                            </div>
                        </div>

                        <!-- Citation -->
                        <div
                            class="bg-gradient-to-r from-primary-green/30 to-green-600/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse-soft">
                            <p class="text-lg italic text-white">"La fraîcheur n'attend pas. Mettez à jour vos stocks
                                avec soin pour servir le meilleur à vos clients."</p>
                            <p class="text-right mt-3 text-green-50">— Producteur local</p>
                        </div>
                    </div>

                    <!-- Animations de fond -->
                    <div class="absolute top-8 left-8 text-6xl text-green-300/20 leaf-float">🌿</div>
                    <div class="absolute bottom-12 right-8 text-5xl text-amber-300/20 leaf-float"
                        style="animation-delay: 4s;">🍃</div>
                    <div class="absolute top-32 right-20 text-4xl text-lime-300/20 leaf-float"
                        style="animation-delay: 8s;">🍂</div>
                    <div class="absolute bottom-24 left-20 text-5xl text-emerald-300/20 leaf-float"
                        style="animation-delay: 12s;">🌱</div>
                </div>

                <!-- Texture de jardin -->
                <div class="absolute inset-0 garden-texture opacity-10"></div>
            </div>

            <!-- Formulaire de droite -->
            <div class="lg:w-1/2 flex items-center justify-center p-4 lg:p-8 animate-slide-in-right">
                <div class="w-full max-w-2xl">
                    <!-- En-tête du formulaire -->
                    <div class="text-center mb-8">
                        <div
                            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-green to-green-600 rounded-2xl mb-4 shadow-2xl animate-pulse-soft">
                            <span class="text-4xl text-white">📦</span>
                        </div>
                        <h1 class="text-3xl lg:text-4xl font-bold text-forest-green mb-2">Mise à Jour du Stock</h1>
                        <p class="text-lg text-gray-600">Renseignez les informations du mouvement de stock</p>
                    </div>

                    <!-- Carte du formulaire -->
                    <div
                        class="organic-update-form bg-white/95 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border border-green-100/50">
                        <!-- Indicateur de progression -->
                        <div class="mb-8">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-medium text-forest-green">Formulaire de mise à jour</span>
                                <span
                                    class="text-xs px-3 py-1 bg-gradient-to-r from-primary-green/10 to-green-100 rounded-full text-primary-green font-medium">
                                    ⚡ Temps réel
                                </span>
                            </div>
                            <div class="h-2 bg-green-100 rounded-full overflow-hidden">
                                <div
                                    class="h-full bg-gradient-to-r from-primary-green via-green-500 to-green-600 rounded-full w-full progress-animation">
                                </div>
                            </div>
                        </div>

                        <!-- Formulaire -->
                        <form @submit.prevent="handleSubmit" class="space-y-8">
                            <!-- Section Produit -->
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold text-forest-green flex items-center">
                                    <span class="mr-3">🎯</span>
                                    Produit concerné
                                </h3>

                                <!-- Recherche de produit -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Rechercher un produit
                                        <span class="text-primary-green">*</span>
                                    </label>
                                    <div class="relative group">
                                        <input v-model="searchProduct" @input="searchProducts" type="text"
                                            placeholder="Tapez le nom, code ou catégorie..."
                                            class="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic hover:border-green-300">
                                        <span
                                            class="absolute left-4 top-3.5 text-xl text-green-500 group-hover:animate-spin-slow">🔍</span>
                                        <div v-if="searchProduct && filteredProducts.length > 0"
                                            class="absolute z-50 mt-1 w-full bg-white border border-green-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto animate-dropdown">
                                            <div v-for="product in filteredProducts.slice(0, 5)" :key="product.id"
                                                @click="selectProduct(product)"
                                                class="px-4 py-3 hover:bg-green-50 cursor-pointer transition-all duration-200 transition-organic border-b border-green-50 last:border-b-0 flex items-center space-x-3"
                                                :class="{ 'bg-green-50': selectedProduct?.id === product.id }">
                                                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    :class="product.stockLevel === 'low' ? 'bg-red-100' : product.stockLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'">
                                                    <span class="text-xl">{{ product.icon }}</span>
                                                </div>
                                                <div class="flex-1">
                                                    <p class="font-medium text-gray-800">{{ product.name }}</p>
                                                    <p class="text-sm text-gray-600">Stock: {{ product.currentStock }} •
                                                        {{ product.code }}</p>
                                                </div>
                                                <span :class="[
                                                    'text-xs px-2 py-1 rounded-full',
                                                    product.stockLevel === 'low' ? 'bg-red-100 text-red-700' :
                                                        product.stockLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-green-100 text-green-700'
                                                ]">
                                                    {{ product.stockLevel === 'low' ? 'Faible' : product.stockLevel ===
                                                        'medium' ? 'Moyen' : 'Bon' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Produit sélectionné -->
                                <div v-if="selectedProduct" class="animate-product-selected">
                                    <div
                                        class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200/50">
                                        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                                            <div class="flex-shrink-0">
                                                <div class="relative">
                                                    <div
                                                        class="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center shadow-lg">
                                                        <span class="text-4xl">{{ selectedProduct.icon }}</span>
                                                    </div>
                                                    <div
                                                        class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-2 border-green-300 flex items-center justify-center shadow-md">
                                                        <span class="text-lg">{{ selectedProduct.categoryIcon }}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex-1">
                                                <div class="flex flex-wrap justify-between items-start mb-3">
                                                    <div>
                                                        <h4 class="text-xl font-bold text-gray-900">{{
                                                            selectedProduct.name }}</h4>
                                                        <p class="text-gray-600">{{ selectedProduct.category }} • {{
                                                            selectedProduct.code }}</p>
                                                    </div>
                                                    <div class="text-right">
                                                        <p class="text-3xl font-bold" :class="selectedProduct.stockLevel === 'low' ? 'text-red-600' :
                                                            selectedProduct.stockLevel === 'medium' ? 'text-amber-600' :
                                                                'text-green-600'">
                                                            {{ selectedProduct.currentStock }}
                                                        </p>
                                                        <p class="text-sm text-gray-500">unités en stock</p>
                                                    </div>
                                                </div>

                                                <!-- Indicateur de stock -->
                                                <div class="mt-4">
                                                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                                                        <span>Niveau de stock actuel</span>
                                                        <span>Seuil: {{ selectedProduct.threshold }}</span>
                                                    </div>
                                                    <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                        <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                                                            :class="selectedProduct.stockLevel === 'low' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                                selectedProduct.stockLevel === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                                                    'bg-gradient-to-r from-green-500 to-green-600'"
                                                            :style="{ width: `${Math.min((selectedProduct.currentStock / selectedProduct.maxStock) * 100, 100)}%` }">
                                                        </div>
                                                    </div>
                                                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                                                        <span>Épuisé</span>
                                                        <span>Bon niveau</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section Type et Quantité -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- Type de mouvement -->
                                <div class="space-y-4">
                                    <h3 class="text-xl font-semibold text-forest-green flex items-center">
                                        <span class="mr-3">🔄</span>
                                        Type de mouvement
                                    </h3>

                                    <div class="grid grid-cols-3 gap-3">
                                        <label v-for="type in movementTypes" :key="type.id"
                                            @click="form.movementType = type.id" class="movement-type-option"
                                            :class="{ 'selected': form.movementType === type.id }">
                                            <div class="movement-type-icon" :class="type.colorClasses">
                                                <span class="text-2xl">{{ type.icon }}</span>
                                            </div>
                                            <p class="font-medium text-gray-800 text-center mt-2">{{ type.label }}</p>
                                            <p class="text-xs text-gray-600 text-center">{{ type.description }}</p>
                                        </label>
                                    </div>
                                </div>

                                <!-- Quantité -->
                                <div class="space-y-4">
                                    <h3 class="text-xl font-semibold text-forest-green flex items-center">
                                        <span class="mr-3">📊</span>
                                        Quantité
                                    </h3>

                                    <div
                                        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                        <div class="flex items-center justify-between mb-4">
                                            <label class="block text-sm font-medium text-gray-700">
                                                Quantité à {{ form.movementType === 'in' ? 'ajouter' : form.movementType
                                                    === 'out' ? 'retirer' : 'ajuster' }}
                                                <span class="text-primary-green">*</span>
                                            </label>
                                            <div class="text-right">
                                                <p class="text-sm text-gray-600">Stock après mouvement:</p>
                                                <p class="text-2xl font-bold text-gray-900">{{ calculateNewStock }}</p>
                                            </div>
                                        </div>

                                        <!-- Contrôle de quantité -->
                                        <div class="flex items-center space-x-4">
                                            <button type="button" @click="decrementQuantity"
                                                class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-red-700 border border-red-300 hover:shadow-md transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center"
                                                :disabled="form.quantity <= 0">
                                                <span class="text-2xl">−</span>
                                            </button>

                                            <div class="flex-1 relative">
                                                <input v-model.number="form.quantity" type="number" min="0"
                                                    :max="form.movementType === 'out' ? selectedProduct?.currentStock || 0 : 9999"
                                                    required
                                                    class="w-full px-4 py-4 text-center text-3xl font-bold bg-white border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                                                <span class="absolute right-4 top-4 text-gray-400">unités</span>
                                            </div>

                                            <button type="button" @click="incrementQuantity"
                                                class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-300 hover:shadow-md transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center">
                                                <span class="text-2xl">+</span>
                                            </button>
                                        </div>

                                        <!-- Boutons de quantité rapide -->
                                        <div class="flex flex-wrap gap-2 mt-4">
                                            <button v-for="quickAmount in quickAmounts" :key="quickAmount" type="button"
                                                @click="form.quantity = quickAmount"
                                                class="px-3 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 text-gray-700 hover:shadow-sm transition-all duration-200 transition-organic hover:scale-105 text-sm">
                                                {{ quickAmount }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section Détails -->
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold text-forest-green flex items-center">
                                    <span class="mr-3">📝</span>
                                    Détails supplémentaires
                                </h3>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <!-- Emplacement -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Emplacement
                                            <span class="text-primary-green">*</span>
                                        </label>
                                        <div class="relative">
                                            <select v-model="form.location" required
                                                class="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic appearance-none cursor-pointer">
                                                <option value="" disabled>Sélectionnez un emplacement</option>
                                                <option value="entrepot">🏢 Entrepôt principal</option>
                                                <option value="chambre-froide">❄️ Chambre froide A</option>
                                                <option value="rayon">🛒 Rayon frais</option>
                                                <option value="reserve">📦 Réserve sèche</option>
                                                <option value="preparation">👨‍🍳 Zone préparation</option>
                                            </select>
                                            <span class="absolute left-4 top-3.5 text-xl text-green-500">📍</span>
                                            <span class="absolute right-4 top-3.5 text-green-500">▼</span>
                                        </div>
                                    </div>

                                    <!-- Fournisseur / Client -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            {{ form.movementType === 'in' ? 'Fournisseur' : form.movementType === 'out'
                                                ? 'Client' : 'Raison' }}
                                        </label>
                                        <div class="relative">
                                            <input v-model="form.reference" type="text"
                                                :placeholder="form.movementType === 'in' ? 'Nom du fournisseur...' : form.movementType === 'out' ? 'Nom du client...' : 'Raison de l\'ajustement...'"
                                                class="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                                            <span class="absolute left-4 top-3.5 text-xl text-green-500">
                                                {{ form.movementType === 'in' ? '🚚' : form.movementType === 'out' ?
                                                    '👤' : '📋' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Commentaire -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Commentaire
                                        <span class="text-xs text-gray-500">(Optionnel)</span>
                                    </label>
                                    <div class="relative">
                                        <textarea v-model="form.comment" rows="3"
                                            placeholder="Ajoutez des notes sur ce mouvement de stock..."
                                            class="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic resize-none"></textarea>
                                        <span class="absolute left-4 top-3.5 text-xl text-green-500">💬</span>
                                        <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                                            {{ form.comment.length }}/500
                                        </div>
                                    </div>
                                </div>

                                <!-- Date et Heure -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Date du mouvement
                                        </label>
                                        <div class="relative">
                                            <input v-model="form.date" type="date"
                                                class="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                                            <span class="absolute left-4 top-3.5 text-xl text-green-500">📅</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Heure du mouvement
                                        </label>
                                        <div class="relative">
                                            <input v-model="form.time" type="time"
                                                class="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic">
                                            <span class="absolute left-4 top-3.5 text-xl text-green-500">⏰</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Résumé -->
                            <div v-if="selectedProduct"
                                class="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200 animate-fade-in">
                                <h4 class="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                                    <span class="mr-2">📋</span>
                                    Récapitulatif du mouvement
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <p class="text-sm text-amber-700">Avant</p>
                                        <p class="text-3xl font-bold text-amber-900">{{ selectedProduct.currentStock }}
                                        </p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-sm text-amber-700">Mouvement</p>
                                        <p :class="[
                                            'text-3xl font-bold',
                                            form.movementType === 'in' ? 'text-green-600' :
                                                form.movementType === 'out' ? 'text-red-600' :
                                                    'text-blue-600'
                                        ]">
                                            {{ form.movementType === 'in' ? '+' : form.movementType === 'out' ? '−' :
                                                '±' }}{{ form.quantity }}
                                        </p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-sm text-amber-700">Après</p>
                                        <p class="text-3xl font-bold text-amber-900">{{ calculateNewStock }}</p>
                                    </div>
                                </div>
                                <div class="mt-4 pt-4 border-t border-amber-200">
                                    <p class="text-sm text-amber-700 text-center">
                                        {{ selectedProduct.name }} •
                                        {{ form.movementType === 'in' ? 'Entrée' : form.movementType === 'out' ?
                                            'Sortie' : 'Ajustement' }} •
                                        {{ form.location }}
                                    </p>
                                </div>
                            </div>

                            <!-- Boutons d'action -->
                            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-green-100">
                                <button type="button" @click="handleCancel"
                                    class="px-8 py-4 border-2 border-green-300 text-green-700 rounded-xl hover:bg-green-50 transition-all duration-300 transition-organic hover:scale-105 flex-1 flex items-center justify-center space-x-2 group">
                                    <span class="text-xl group-hover:animate-spin-slow">↶</span>
                                    <span class="font-semibold">Annuler</span>
                                </button>

                                <button type="submit" :disabled="!canSubmit"
                                    class="px-8 py-4 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transition-organic hover:scale-105 flex-1 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span class="text-xl group-hover:animate-bounce">✅</span>
                                    <span class="font-semibold">Valider la mise à jour</span>
                                    <span
                                        class="text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">✨</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Conseils -->
                    <div class="mt-8 text-center">
                        <p class="text-sm text-gray-600 flex items-center justify-center space-x-2">
                            <span class="text-xl">💡</span>
                            <span>Les mises à jour de stock en temps réel garantissent la fraîcheur de vos produits
                                !</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notification de succès -->
        <transition name="slide-up">
            <div v-if="showSuccess"
                class="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-2xl max-w-sm z-50 animate-success">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span class="text-2xl">✅</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg">Stock mis à jour !</h4>
                        <p class="text-sm opacity-90">Le mouvement a été enregistré avec succès.</p>
                    </div>
                    <button @click="showSuccess = false" class="text-white/70 hover:text-white">
                        ✕
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'StockUpdateForm',
    data() {
        return {
            searchProduct: '',
            selectedProduct: null,
            showSuccess: false,
            form: {
                productId: '',
                movementType: 'in',
                quantity: 0,
                location: '',
                reference: '',
                comment: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5)
            },
            products: [
                {
                    id: 1,
                    name: 'Pommes Golden Bio',
                    code: 'POM-BIO-001',
                    icon: '🍎',
                    category: 'Fruits',
                    categoryIcon: '🍎',
                    currentStock: 125,
                    maxStock: 500,
                    threshold: 50,
                    stockLevel: 'low'
                },
                {
                    id: 2,
                    name: 'Carottes Nouvelles',
                    code: 'CAR-NEW-002',
                    icon: '🥕',
                    category: 'Légumes',
                    categoryIcon: '🥕',
                    currentStock: 75,
                    maxStock: 300,
                    threshold: 40,
                    stockLevel: 'low'
                },
                {
                    id: 3,
                    name: 'Salade Batavia',
                    code: 'SAL-BAT-003',
                    icon: '🥬',
                    category: 'Légumes',
                    categoryIcon: '🥬',
                    currentStock: 200,
                    maxStock: 400,
                    threshold: 75,
                    stockLevel: 'medium'
                },
                {
                    id: 4,
                    name: 'Tomates Cerises',
                    code: 'TOM-CER-004',
                    icon: '🍅',
                    category: 'Fruits',
                    categoryIcon: '🍅',
                    currentStock: 180,
                    maxStock: 350,
                    threshold: 60,
                    stockLevel: 'medium'
                },
                {
                    id: 5,
                    name: 'Oignons Jaunes',
                    code: 'OIG-JAU-005',
                    icon: '🧅',
                    category: 'Légumes',
                    categoryIcon: '🧅',
                    currentStock: 300,
                    maxStock: 600,
                    threshold: 100,
                    stockLevel: 'good'
                },
                {
                    id: 6,
                    name: 'Fraises Gariguette',
                    code: 'FRA-GAR-006',
                    icon: '🍓',
                    category: 'Fruits',
                    categoryIcon: '🍓',
                    currentStock: 40,
                    maxStock: 200,
                    threshold: 25,
                    stockLevel: 'low'
                }
            ],
            movementTypes: [
                {
                    id: 'in',
                    label: 'Entrée',
                    icon: '📥',
                    description: 'Ajout stock',
                    colorClasses: 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
                },
                {
                    id: 'out',
                    label: 'Sortie',
                    icon: '📤',
                    description: 'Retrait stock',
                    colorClasses: 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300'
                },
                {
                    id: 'adjustment',
                    label: 'Ajustement',
                    icon: '⚖️',
                    description: 'Correction',
                    colorClasses: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
                }
            ],
            quickAmounts: [10, 25, 50, 100, 250]
        }
    },
    computed: {
        filteredProducts() {
            if (!this.searchProduct) return []
            const query = this.searchProduct.toLowerCase()
            return this.products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.code.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            )
        },
        calculateNewStock() {
            if (!this.selectedProduct) return 0
            const current = this.selectedProduct.currentStock
            const change = this.form.quantity

            if (this.form.movementType === 'in') return current + change
            if (this.form.movementType === 'out') return Math.max(0, current - change)
            return change // Pour ajustement, on considère que c'est la nouvelle valeur
        },
        canSubmit() {
            return this.selectedProduct &&
                this.form.quantity > 0 &&
                this.form.location &&
                (this.form.movementType !== 'out' || this.form.quantity <= this.selectedProduct.currentStock)
        }
    },
    methods: {
        searchProducts() {
            // Déclenché automatiquement par l'input
        },
        selectProduct(product) {
            this.selectedProduct = product
            this.form.productId = product.id
            this.searchProduct = product.name
        },
        incrementQuantity() {
            this.form.quantity++
        },
        decrementQuantity() {
            if (this.form.quantity > 0) {
                this.form.quantity--
            }
        },
        handleSubmit() {
            if (!this.canSubmit) return

            console.log('Formulaire soumis:', this.form)

            // Animation de succès
            this.showSuccess = true

            // Réinitialiser le formulaire après 2 secondes
            setTimeout(() => {
                this.resetForm()
                this.showSuccess = false
                // Redirection ou autre action
                this.$router.push('/stock/movements')
            }, 2000)
        },
        handleCancel() {
            if (this.form.quantity > 0 || this.selectedProduct || this.form.comment) {
                if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
                    this.$router.push('/stock')
                }
            } else {
                this.$router.push('/stock')
            }
        },
        resetForm() {
            this.selectedProduct = null
            this.searchProduct = ''
            this.form = {
                productId: '',
                movementType: 'in',
                quantity: 0,
                location: '',
                reference: '',
                comment: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5)
            }
        }
    }
}
</script>

<style scoped>
/* Variables de couleur */
:root {
    --primary-green: #45a348;
    --secondary-orange: #ff8c42;
    --forest-green: #2d5016;
    --earth-brown: #8b4513;
}

/* Background split-screen organique */
.organic-split-bg {
    background: linear-gradient(135deg,
            rgba(34, 139, 34, 0.95) 0%,
            /* Vert forêt */
            rgba(69, 163, 72, 0.9) 50%,
            /* Vert primaire */
            rgba(255, 255, 255, 0.9) 50%,
            /* Transition */
            rgba(255, 255, 255, 1) 100%
            /* Blanc pur */
        );
}

@media (max-width: 1024px) {
    .organic-split-bg {
        background: linear-gradient(135deg,
                rgba(34, 139, 34, 0.95) 0%,
                rgba(69, 163, 72, 0.9) 30%,
                rgba(255, 255, 255, 0.9) 30%,
                rgba(255, 255, 255, 1) 100%);
    }
}

/* Texture de jardin */
.garden-texture {
    background-image:
        radial-gradient(circle at 20% 30%, rgba(139, 195, 74, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 183, 77, 0.05) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2345a348' fill-opacity='0.05'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' fill-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 200px 200px, 150px 150px, 80px 80px;
}

/* Animation d'entrée */
@keyframes slide-in-left {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slide-in-right {
    from {
        opacity: 0;
        transform: translateX(50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-slide-in-left {
    animation: slide-in-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-slide-in-right {
    animation: slide-in-right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
    opacity: 0;
}

/* Animation de croissance pour les légumes */
@keyframes grow {
    0% {
        transform: scale(0) translateY(20px);
        opacity: 0;
    }

    70% {
        transform: scale(1.1) translateY(-5px);
    }

    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.animate-grow {
    animation: grow 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Animation de balancement */
@keyframes sway {

    0%,
    100% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(3deg);
    }

    75% {
        transform: rotate(-3deg);
    }
}

.animate-sway {
    animation: sway 4s ease-in-out infinite;
}

/* Animation de flottement */
@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-10px) rotate(2deg);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Animation de rebond doux */
@keyframes bounce-soft {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-15px);
    }
}

.animate-bounce-soft {
    animation: bounce-soft 2s ease-in-out infinite;
}

/* Animation de pulsation douce */
@keyframes pulse-soft {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(1.05);
    }
}

.animate-pulse-soft {
    animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Animation de rotation lente */
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 2s linear infinite;
}

/* Carte de formulaire organique */
.organic-update-form {
    position: relative;
    border: 2px solid transparent;
    background-clip: padding-box;
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.organic-update-form::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg,
            var(--primary-green) 0%,
            rgba(255, 140, 66, 0.3) 50%,
            var(--primary-green) 100%);
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.4;
    pointer-events: none;
}

.organic-update-form:hover::before {
    animation: border-flow 3s linear infinite;
}

/* Animation de la barre de progression */
@keyframes progress-flow {
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

.progress-animation {
    background-size: 200% 200%;
    animation: progress-flow 2s ease-in-out infinite;
}

/* Animation d'apparition du produit sélectionné */
@keyframes product-selected {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-product-selected {
    animation: product-selected 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Option de type de mouvement */
.movement-type-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.7);
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.movement-type-option:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.movement-type-option.selected {
    background: rgba(69, 163, 72, 0.1);
    border-color: var(--primary-green);
    transform: scale(1.05);
    box-shadow: 0 15px 30px rgba(69, 163, 72, 0.15);
}

.movement-type-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border-width: 2px;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.movement-type-option.selected .movement-type-icon {
    transform: scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Animation de dropdown */
@keyframes dropdown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-dropdown {
    animation: dropdown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Animation de notification de succès */
@keyframes success {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
    }

    50% {
        opacity: 1;
        transform: translateY(-10px) scale(1.05);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-success {
    animation: success 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Transition pour notification */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

/* Animation pour les feuilles */
.leaf-float {
    animation: leaf-float 20s linear infinite;
}

/* Transitions organiques */
.transition-organic {
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition-duration: 300ms;
}

/* Style pour les inputs focus */
input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 0 3px rgba(69, 163, 72, 0.1);
}

/* Style pour les boutons désactivés */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .movement-type-option {
        padding: 0.75rem;
    }

    .movement-type-icon {
        width: 48px;
        height: 48px;
    }

    .organic-update-form {
        padding: 1.5rem;
    }
}
</style>