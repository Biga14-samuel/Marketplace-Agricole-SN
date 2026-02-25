<template>
    <!-- Conteneur principal avec fond organique -->
    <div class="relative min-h-[600px] overflow-hidden">
        <!-- Fond en dégradé naturel -->
        <div class="absolute inset-0 bg-gradient-to-br from-forest-mist-40/80 via-cream-30/70 to-spring-green-20/60">
            <!-- Texture de mesures en filigrane -->
            <div class="absolute inset-0 opacity-5 bg-measure-texture"></div>
        </div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-12 left-10 w-14 h-14 opacity-10 animate-float-measure-1">
            <div class="w-full h-full rounded-full bg-gradient-to-r from-spring-green-400 to-forest-green-400"></div>
        </div>

        <div class="relative z-10">
            <!-- En-tête avec effet organique -->
            <div class="mb-10 relative">
                <div
                    class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-terracotta-300 to-transparent rounded-full">
                </div>

                <h2 class="text-4xl font-bold text-center mb-4 text-forest-green-900">
                    <span class="relative inline-block">
                        {{ isEditMode ? 'Éditer l\'Unité' : 'Nouvelle Unité de Mesure' }}
                        <div
                            class="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-spring-green-400 via-forest-green-400 to-terracotta-300 rounded-full opacity-70">
                        </div>
                    </span>
                </h2>

                <p class="text-center text-nature-gray-600 max-w-2xl mx-auto px-4 text-lg">
                    {{ isEditMode ? 'Modifiez les propriétés de votre unité de mesure' : 'Créez une nouvelle unité pour mesurer vos produits naturellement' }}
                </p>
            </div>

            <!-- Grille principale -->
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Colonne gauche - Formulaire -->
                    <div class="lg:col-span-2">
                        <div class="relative group">
                            <!-- Effet de lumière externe -->
                            <div
                                class="absolute -inset-3 bg-gradient-to-r from-spring-green-200/30 via-cream-200/20 to-terracotta-200/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-700 ease-out-custom">
                            </div>

                            <!-- Carte du formulaire -->
                            <div
                                class="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-organic-xl border border-white/50 overflow-hidden">
                                <!-- Barre de couleur organique en haut -->
                                <div
                                    class="h-3 bg-gradient-to-r from-spring-green-400 via-forest-green-400 to-terracotta-300">
                                </div>

                                <div class="p-8">
                                    <form @submit.prevent="handleSubmit" class="space-y-8">
                                        <!-- Nom de l'unité -->
                                        <div class="relative">
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-spring-green-100 to-cream-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-spring-green-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                Nom de l'unité *
                                            </label>
                                            <div class="relative">
                                                <input v-model="formData.name" type="text" required maxlength="30"
                                                    class="w-full px-5 py-4 pl-14 bg-white/80 border border-nature-gray-200/60 rounded-xl focus:ring-3 focus:ring-spring-green-300/50 focus:border-spring-green-400 transition-all duration-400 ease-out-custom placeholder-nature-gray-400 text-forest-green-900 text-lg shadow-sm"
                                                    placeholder="Ex: Kilogramme, Litre, Pièce..."
                                                    :class="{ 'border-terracotta-300 ring-2 ring-terracotta-200/50': nameError }" />
                                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                    <div
                                                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-spring-green-100 to-spring-green-200 flex items-center justify-center">
                                                        <svg class="w-5 h-5 text-spring-green-600" fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd"
                                                                d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex justify-between items-center mt-3">
                                                <div v-if="nameError"
                                                    class="flex items-center text-sm text-terracotta-600 animate-fade-in">
                                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    {{ nameError }}
                                                </div>
                                                <div class="text-sm text-nature-gray-400 ml-auto">
                                                    {{ formData.name.length }}/30 caractères
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Abréviation -->
                                        <div class="relative">
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-100 to-cream-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-forest-green-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path
                                                            d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                                                    </svg>
                                                </div>
                                                Abréviation *
                                            </label>
                                            <div class="relative">
                                                <input v-model="formData.abbreviation" type="text" required
                                                    maxlength="10"
                                                    class="w-full px-5 py-4 pl-14 bg-white/80 border border-nature-gray-200/60 rounded-xl focus:ring-3 focus:ring-forest-green-300/50 focus:border-forest-green-400 transition-all duration-400 ease-out-custom placeholder-nature-gray-400 text-forest-green-900 text-lg font-bold shadow-sm"
                                                    placeholder="Ex: kg, L, pce" />
                                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                    <div
                                                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-green-100 to-forest-green-200 flex items-center justify-center">
                                                        <svg class="w-5 h-5 text-forest-green-600" fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <p class="mt-3 text-sm text-nature-gray-500">
                                                Version courte utilisée dans les listes et les calculs
                                            </p>
                                        </div>

                                        <!-- Type d'unité -->
                                        <div>
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-100 to-cream-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-terracotta-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                Type d'unité *
                                            </label>

                                            <!-- Boutons de sélection du type -->
                                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <button v-for="type in unitTypes" :key="type.value" type="button"
                                                    @click="formData.type = type.value as 'weight' | 'volume' | 'piece'"
                                                    class="relative p-5 rounded-xl border-2 transition-all duration-300 ease-out-custom group hover:scale-105 hover:shadow-md"
                                                    :class="[
                                                        formData.type === type.value
                                                            ? `${type.borderColor} ${type.bgColor} shadow-sm`
                                                            : 'border-nature-gray-200/60 bg-white/70 hover:border-nature-gray-300'
                                                    ]">
                                                    <div class="flex flex-col items-center space-y-4">
                                                        <div class="w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                                                            :class="type.iconBgColor">
                                                            {{ type.icon }}
                                                        </div>
                                                        <div>
                                                            <div class="font-semibold text-lg"
                                                                :class="formData.type === type.value ? type.textColor : 'text-nature-gray-700'">
                                                                {{ type.label }}
                                                            </div>
                                                            <div class="text-sm mt-2 text-nature-gray-500">
                                                                {{ type.description }}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Indicateur de sélection -->
                                                    <div v-if="formData.type === type.value"
                                                        class="absolute -top-2 -right-2">
                                                        <div
                                                            class="w-7 h-7 rounded-full bg-gradient-to-r from-spring-green-400 to-forest-green-400 flex items-center justify-center">
                                                            <svg class="w-4 h-4 text-white" fill="currentColor"
                                                                viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Précisons supplémentaires -->
                                        <div>
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-cream-100 to-terracotta-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-cream-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                Précisions
                                            </label>

                                            <!-- Options supplémentaires -->
                                            <div class="space-y-6">
                                                <!-- Facteur de conversion -->
                                                <div
                                                    class="p-5 bg-gradient-to-r from-spring-green-50/30 to-cream-50/20 rounded-xl border border-spring-green-200/30">
                                                    <div class="flex items-center justify-between mb-3">
                                                        <div class="flex items-center space-x-3">
                                                            <svg class="w-5 h-5 text-spring-green-600"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                            <span class="font-medium text-forest-green-800">Facteur de
                                                                conversion</span>
                                                        </div>
                                                        <span class="text-sm text-nature-gray-500">Optionnel</span>
                                                    </div>
                                                    <div class="flex items-center space-x-4">
                                                        <div class="flex-1">
                                                            <div class="flex items-center space-x-3">
                                                                <input v-model.number="formData.conversion_factor"
                                                                    type="number" step="0.001" min="0"
                                                                    class="w-32 px-4 py-3 bg-white/80 border border-nature-gray-200/60 rounded-lg focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom text-forest-green-900 shadow-sm"
                                                                    placeholder="1.0" />
                                                                <span class="text-nature-gray-600">=</span>
                                                                <select v-model="formData.base_unit_id"
                                                                    class="flex-1 px-4 py-3 bg-white/80 border border-nature-gray-200/60 rounded-lg focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom text-forest-green-900 shadow-sm">
                                                                    <option value="">-- Sélectionnez l'unité de base --
                                                                    </option>
                                                                    <option v-for="unit in baseUnits" :key="unit.id"
                                                                        :value="unit.id">
                                                                        {{ unit.name }} ({{ unit.symbol || unit.abbreviation }})
                                                                    </option>
                                                                </select>
                                                            </div>
                                                            <p class="mt-2 text-xs text-nature-gray-500">
                                                                Ex: 1000 grammes = 1 kilogramme
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Décimale autorisée -->
                                                <div
                                                    class="p-5 bg-gradient-to-r from-forest-green-50/30 to-cream-50/20 rounded-xl border border-forest-green-200/30">
                                                    <div class="flex items-center justify-between mb-3">
                                                        <div class="flex items-center space-x-3">
                                                            <svg class="w-5 h-5 text-forest-green-600"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                            <span class="font-medium text-forest-green-800">Précision
                                                                décimale</span>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center space-x-4">
                                                        <div class="flex-1">
                                                            <div class="flex items-center space-x-3">
                                                                <label
                                                                    class="flex items-center space-x-3 cursor-pointer group">
                                                                    <input v-model="formData.allow_decimal"
                                                                        type="checkbox" class="sr-only" />
                                                                    <div class="relative">
                                                                        <div
                                                                            class="w-12 h-6 bg-nature-gray-200 rounded-full transition-all duration-300 ease-out-custom group-hover:bg-nature-gray-300">
                                                                        </div>
                                                                        <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ease-out-custom transform"
                                                                            :class="{ 'translate-x-6 bg-spring-green-500': formData.allow_decimal }">
                                                                        </div>
                                                                    </div>
                                                                    <span class="text-forest-green-700">Autoriser les
                                                                        valeurs décimales</span>
                                                                </label>
                                                            </div>
                                                            <p class="mt-2 text-xs text-nature-gray-500">
                                                                Décochez pour les unités qui ne peuvent être
                                                                fractionnées (ex: pièces)
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Description -->
                                                <div
                                                    class="p-5 bg-gradient-to-r from-cream-50/30 to-terracotta-50/20 rounded-xl border border-cream-200/30">
                                                    <div class="flex items-center space-x-3 mb-3">
                                                        <svg class="w-5 h-5 text-cream-600" fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd"
                                                                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="font-medium text-forest-green-800">Description
                                                            (optionnel)</span>
                                                    </div>
                                                    <textarea v-model="formData.description" rows="3" maxlength="200"
                                                        class="w-full px-4 py-3 bg-white/80 border border-nature-gray-200/60 rounded-lg focus:ring-2 focus:ring-cream-300 focus:border-cream-400 transition-all duration-300 ease-out-custom placeholder-nature-gray-400 text-forest-green-900 shadow-sm resize-none"
                                                        placeholder="Description de l'unité, ex: 'Utilisé pour les produits solides en vrac'"></textarea>
                                                    <div class="flex justify-between items-center mt-2">
                                                        <p class="text-xs text-nature-gray-500">
                                                            Maximum 200 caractères
                                                        </p>
                                                        <div class="text-xs text-nature-gray-400">
                                                            {{ formData.description?.length || 0 }}/200
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Colonne droite - Prévisualisation et aide -->
                    <div class="space-y-8">
                        <!-- Carte de prévisualisation -->
                        <div class="relative group">
                            <div
                                class="absolute -inset-2 bg-gradient-to-b from-spring-green-200/20 to-terracotta-200/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-700 ease-out-custom">
                            </div>

                            <div
                                class="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-organic-xl border border-white/50 overflow-hidden">
                                <div
                                    class="h-3 bg-gradient-to-r from-terracotta-300 via-forest-green-400 to-spring-green-400">
                                </div>

                                <div class="p-6">
                                    <h3 class="text-xl font-bold text-forest-green-900 mb-6 flex items-center">
                                        <svg class="w-6 h-6 text-terracotta-500 mr-2" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fill-rule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Aperçu de l'unité
                                    </h3>

                                    <!-- Unit preview -->
                                    <div
                                        class="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-spring-green-50/30 to-cream-50/30 rounded-xl border border-spring-green-200/30 mb-6">
                                        <div class="text-sm text-nature-gray-500 mb-6">Votre unité ressemblera à :</div>

                                        <div class="flex flex-col items-center space-y-6 w-full">
                                            <!-- Exemple d'affichage produit -->
                                            <div
                                                class="w-full bg-white/80 rounded-xl p-5 shadow-sm border border-nature-gray-200/40">
                                                <div class="flex items-center justify-between mb-3">
                                                    <div class="text-sm text-nature-gray-500">Exemple produit :</div>
                                                    <div class="text-sm font-medium text-forest-green-800">Tomates
                                                        fraîches</div>
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <div class="text-lg font-bold text-forest-green-900">12,50</div>
                                                    <div class="px-4 py-2 rounded-lg font-bold text-lg transition-all duration-300 ease-out-custom transform hover:scale-105"
                                                        :class="getTypeClasses(formData.type)">
                                                        {{ formData.abbreviation || 'kg' }}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Badge type -->
                                            <div class="w-full">
                                                <div class="text-center text-sm text-nature-gray-500 mb-2">Type d'unité
                                                    :</div>
                                                <div v-if="formData.type"
                                                    class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mx-auto"
                                                    :class="getTypeBadgeClasses(formData.type)">
                                                    {{ getTypeLabel(formData.type) }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Détails du preview -->
                                        <div class="mt-8 grid grid-cols-2 gap-4 w-full">
                                            <div class="text-center p-3 bg-white/70 rounded-lg">
                                                <div class="text-sm text-nature-gray-500">Nom complet</div>
                                                <div class="font-medium text-forest-green-800 truncate">{{ formData.name
                                                    || 'Kilogramme' }}</div>
                                            </div>
                                            <div class="text-center p-3 bg-white/70 rounded-lg">
                                                <div class="text-sm text-nature-gray-500">Abréviation</div>
                                                <div class="font-bold text-lg text-forest-green-900">{{
                                                    formData.abbreviation || 'kg' }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Statut -->
                                    <div
                                        class="flex items-center justify-between p-4 bg-gradient-to-r from-spring-green-50/30 to-cream-50/20 rounded-xl border border-spring-green-200/30">
                                        <div class="flex items-center space-x-3">
                                            <div
                                                class="w-10 h-10 rounded-lg bg-gradient-to-br from-spring-green-100 to-cream-100 flex items-center justify-center">
                                                <svg class="w-5 h-5 text-spring-green-600" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div class="font-medium text-forest-green-800">Statut</div>
                                                <div class="text-sm text-nature-gray-500">Prêt à être enregistré</div>
                                            </div>
                                        </div>

                                        <label class="flex items-center space-x-3 cursor-pointer group">
                                            <div class="relative">
                                                <input v-model="formData.is_active" type="checkbox" class="sr-only" />
                                                <div
                                                    class="w-12 h-6 bg-nature-gray-200 rounded-full transition-all duration-300 ease-out-custom group-hover:bg-nature-gray-300">
                                                </div>
                                                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ease-out-custom transform"
                                                    :class="{ 'translate-x-6 bg-spring-green-500': formData.is_active }">
                                                </div>
                                            </div>
                                            <span class="text-sm font-medium text-forest-green-700">Active</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Aide contextuelle -->
                        <div class="relative group">
                            <div
                                class="absolute -inset-2 bg-gradient-to-b from-forest-green-200/20 to-cream-200/10 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 ease-out-custom">
                            </div>

                            <div
                                class="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-organic-xl border border-white/50 overflow-hidden">
                                <div class="h-3 bg-gradient-to-r from-forest-green-400 to-spring-green-400"></div>

                                <div class="p-6">
                                    <h3 class="text-xl font-bold text-forest-green-900 mb-6 flex items-center">
                                        <svg class="w-6 h-6 text-forest-green-500 mr-2" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Guide des unités
                                    </h3>

                                    <div class="space-y-4">
                                        <div v-for="type in unitTypes" :key="type.value"
                                            class="p-4 rounded-lg border transition-all duration-300 ease-out-custom hover:scale-[1.02]"
                                            :class="type.bgColor.replace('bg-', 'bg-').replace('/70', '/30') + ' ' + type.borderColor">
                                            <div class="flex items-center space-x-3">
                                                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                    :class="type.iconBgColor">
                                                    {{ type.icon }}
                                                </div>
                                                <div>
                                                    <div class="font-semibold" :class="type.textColor">{{ type.label }}
                                                    </div>
                                                    <div class="text-sm mt-1"
                                                        :class="type.textColor.replace('text-', 'text-').replace('-700', '-600')">
                                                        {{ type.description }}
                                                    </div>
                                                    <div class="text-xs text-nature-gray-500 mt-2">
                                                        Ex: {{ type.examples }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="mt-6 p-4 bg-gradient-to-r from-terracotta-50/30 to-cream-50/20 rounded-xl border border-terracotta-200/30">
                                        <div class="flex items-center space-x-3">
                                            <svg class="w-5 h-5 text-terracotta-500 flex-shrink-0" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <div class="text-sm text-terracotta-700">
                                                <span class="font-medium">Astuce :</span> Pensez aux conversions pour
                                                les unités dérivées (ex: 1000g = 1kg)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div class="mt-12 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6">
                    <button type="button" @click="handleCancel"
                        class="px-8 py-4 border-2 border-nature-gray-300 text-nature-gray-700 rounded-xl font-medium transition-all duration-400 ease-out-custom hover:bg-nature-gray-50 hover:border-nature-gray-400 hover:shadow-md active:scale-95 flex items-center justify-center group text-lg">
                        <svg class="w-6 h-6 mr-3 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        Annuler
                    </button>

                    <button type="submit" @click="handleSubmit" :disabled="isSubmitting"
                        class="px-8 py-4 bg-gradient-to-r from-spring-green-500 to-forest-green-500 text-white rounded-xl font-medium transition-all duration-400 ease-out-custom hover:from-spring-green-600 hover:to-forest-green-600 hover:shadow-xl active:scale-95 flex items-center justify-center group text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                        <template v-if="isSubmitting">
                            <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Enregistrement en cours...
                        </template>
                        <template v-else>
                            <svg class="w-6 h-6 mr-3 transition-transform duration-500 ease-out-expo group-hover:scale-110"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            {{ isEditMode ? 'Mettre à jour l\'unité' : 'Créer l\'unité' }}
                        </template>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUnitStore } from '@/modules/catalog/store/modules/unit.store'
import { UnitCategory } from '@/modules/catalog/services/models/unit.model'

interface Props {
    unitId?: string
}

interface Emits {
    (e: 'success'): void
    (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const unitStore = useUnitStore()
const isSubmitting = ref(false)
const nameError = ref<string | null>(null)

// Types d'unités prédéfinis
const unitTypes = [
    {
        value: 'weight',
        label: 'Poids',
        icon: '⚖️',
        description: 'Mesures de masse et poids',
        examples: 'kg, g, lb, oz',
        borderColor: 'border-spring-green-400',
        bgColor: 'bg-spring-green-50',
        textColor: 'text-spring-green-800',
        iconBgColor: 'text-spring-green-600 bg-spring-green-100'
    },
    {
        value: 'volume',
        label: 'Volume',
        icon: '🧪',
        description: 'Mesures de capacité liquide',
        examples: 'L, mL, gal, fl oz',
        borderColor: 'border-forest-green-400',
        bgColor: 'bg-forest-green-50',
        textColor: 'text-forest-green-800',
        iconBgColor: 'text-forest-green-600 bg-forest-green-100'
    },
    {
        value: 'piece',
        label: 'Pièce',
        icon: '📦',
        description: 'Unités entières non fractionnables',
        examples: 'pièce, unité, botte, bouquet',
        borderColor: 'border-terracotta-400',
        bgColor: 'bg-terracotta-50',
        textColor: 'text-terracotta-800',
        iconBgColor: 'text-terracotta-600 bg-terracotta-100'
    }
]

// Unités de base pour les conversions
const baseUnits = ref<Array<{ id: string; name: string; symbol?: string; abbreviation?: string }>>([])

// Données du formulaire
const formData = reactive({
    name: '',
    abbreviation: '',
    type: 'weight' as 'weight' | 'volume' | 'piece',
    description: '',
    conversion_factor: 1,
    base_unit_id: null as string | null,
    allow_decimal: true,
    is_active: true
})

// Mode édition
const isEditMode = computed(() => !!props.unitId)

// Valider le formulaire
const validateForm = (): boolean => {
    nameError.value = null

    if (!formData.name.trim()) {
        nameError.value = 'Le nom de l\'unité est requis'
        return false
    }

    if (formData.name.length < 2) {
        nameError.value = 'Le nom doit contenir au moins 2 caractères'
        return false
    }

    if (!formData.abbreviation.trim()) {
        nameError.value = 'L\'abréviation est requise'
        return false
    }

    if (formData.abbreviation.length > 10) {
        nameError.value = 'L\'abréviation ne doit pas dépasser 10 caractères'
        return false
    }

    // Validation du facteur de conversion si unité de base sélectionnée
    if (formData.base_unit_id && formData.conversion_factor <= 0) {
        nameError.value = 'Le facteur de conversion doit être supérieur à 0'
        return false
    }

    return true
}

// Obtenir les informations du type
const getTypeLabel = (type: string): string => {
    const found = unitTypes.find(t => t.value === type)
    return found?.label || type
}

const getTypeClasses = (type: string): string => {
    const classes: Record<string, string> = {
        weight: 'bg-spring-green-100 text-spring-green-800 border-spring-green-300',
        volume: 'bg-forest-green-100 text-forest-green-800 border-forest-green-300',
        piece: 'bg-terracotta-100 text-terracotta-800 border-terracotta-300'
    }
    return classes[type] || 'bg-nature-gray-100 text-nature-gray-800 border-nature-gray-300'
}

const getTypeBadgeClasses = (type: string): string => {
    const classes: Record<string, string> = {
        weight: 'bg-spring-green-500 text-white',
        volume: 'bg-forest-green-500 text-white',
        piece: 'bg-terracotta-500 text-white'
    }
    return classes[type] || 'bg-nature-gray-500 text-white'
}

// Soumettre le formulaire
const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        const normalizedCategory: UnitCategory =
            formData.type === 'piece'
                ? UnitCategory.COUNT
                : formData.type === 'volume'
                    ? UnitCategory.VOLUME
                    : UnitCategory.WEIGHT

        // Préparer les données pour l'API
        const submitData = {
            name: formData.name.trim(),
            symbol: formData.abbreviation.trim().toUpperCase(),
            description: formData.description?.trim() || undefined,
            category: normalizedCategory,
            conversion_factor: formData.base_unit_id ? formData.conversion_factor : undefined,
            base_unit_id: formData.base_unit_id || undefined
        }

        if (isEditMode.value && props.unitId) {
            await unitStore.updateUnit(props.unitId, submitData)
        } else {
            await unitStore.createUnit(submitData)
        }

        // Animation de succès
        await new Promise(resolve => setTimeout(resolve, 600))
        emit('success')
    } catch (error: unknown) {
        const err = error as any
        console.error('Erreur lors de la sauvegarde:', err)
        nameError.value = err?.response?.data?.detail || err?.message || 'Une erreur est survenue lors de l\'enregistrement'
    } finally {
        isSubmitting.value = false
    }
}

// Annuler
const handleCancel = () => {
    emit('cancel')
}

// Charger les unités de base pour les conversions
const loadBaseUnits = async () => {
    try {
        const units = await unitStore.fetchAllUnits()
        baseUnits.value = units || []
    } catch (error) {
        console.error('Erreur lors du chargement des unités:', error)
    }
}

// Charger les données si en mode édition
onMounted(async () => {
    await loadBaseUnits()

    // Si en mode édition, charger l'unité
    if (isEditMode.value && props.unitId) {
        try {
            const unit = await unitStore.fetchUnitById(props.unitId)
            if (unit) {
                formData.name = unit.name || ''
                formData.abbreviation = unit.symbol || ''
                formData.description = unit.description || ''
                formData.conversion_factor = unit.conversion_factor || 1
                formData.base_unit_id = unit.base_unit_id || null
                formData.type = unit.category === 'volume'
                    ? 'volume'
                    : unit.category === 'count'
                        ? 'piece'
                        : 'weight'
                formData.allow_decimal = true
                formData.is_active = true
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'unité:', error)
        }
    }
})
</script>

<style scoped>
/* Courbes de Bézier personnalisées */
:deep() {
    --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
    --ease-out-custom: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ease-out-expo {
    transition-timing-function: var(--ease-out-expo);
}

.ease-out-custom {
    transition-timing-function: var(--ease-out-custom);
}

/* Animation de flottement pour les mesures */
@keyframes float-measure-1 {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    33% {
        transform: translate(-15px, -20px) scale(1.1);
    }

    66% {
        transform: translate(20px, 10px) scale(0.9);
    }
}

.animate-float-measure-1 {
    animation: float-measure-1 25s ease-in-out infinite;
}

/* Animation d'apparition */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.4s ease-out;
}

/* Texture de mesures en filigrane */
.bg-measure-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,30 L150,30 L150,50 L50,50 Z' stroke='%23005500' stroke-width='1' fill='none' opacity='0.05'/%3E%3Cpath d='M40,70 L160,70 L160,90 L40,90 Z' stroke='%23005500' stroke-width='1' fill='none' opacity='0.04'/%3E%3Cpath d='M60,110 L140,110 L140,130 L60,130 Z' stroke='%23005500' stroke-width='1' fill='none' opacity='0.03'/%3E%3Ccircle cx='100' cx='160' r='15' stroke='%23005500' stroke-width='1' fill='none' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 400px 400px;
}

/* Ombres organiques douces */
.shadow-soft-organic-xl {
    box-shadow:
        0 10px 40px -10px rgba(0, 85, 0, 0.08),
        0 5px 20px -5px rgba(139, 195, 74, 0.06),
        0 2px 10px -3px rgba(139, 195, 74, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* Survol des cartes avec effet organique */
.group:hover .group-hover\:scale-x-100 {
    transform: scaleX(1);
}
</style>




