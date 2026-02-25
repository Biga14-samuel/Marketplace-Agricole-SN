<template>
    <!-- Conteneur principal avec fond organique -->
    <div class="relative min-h-[600px] overflow-hidden">
        <!-- Fond en dégradé naturel -->
        <div class="absolute inset-0 bg-gradient-to-br from-forest-mist-40/80 via-cream-30/70 to-spring-green-20/60">
            <!-- Texture de tags en filigrane -->
            <div class="absolute inset-0 opacity-5 bg-tag-texture"></div>
        </div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-10 right-12 w-16 h-16 opacity-10 animate-float-tags-1">
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
                        {{ isEditMode ? 'Éditer le Tag' : 'Nouveau Tag' }}
                        <div
                            class="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-spring-green-400 via-forest-green-400 to-terracotta-300 rounded-full opacity-70">
                        </div>
                    </span>
                </h2>

                <p class="text-center text-nature-gray-600 max-w-2xl mx-auto px-4 text-lg">
                    {{ isEditMode ? 'Modifiez les propriétés de votre tag' : 'Créez un nouveau tag pour catégoriser vos produits' }}
                </p>
            </div>

            <!-- Grille principale -->
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                        <!-- Nom du tag -->
                                        <div class="relative">
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-spring-green-100 to-cream-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-spring-green-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                Nom du tag *
                                            </label>
                                            <div class="relative">
                                                <input v-model="formData.name" type="text" required maxlength="50"
                                                    class="w-full px-5 py-4 pl-14 bg-white/80 border border-nature-gray-200/60 rounded-xl focus:ring-3 focus:ring-spring-green-300/50 focus:border-spring-green-400 transition-all duration-400 ease-out-custom placeholder-nature-gray-400 text-forest-green-900 text-lg shadow-sm"
                                                    placeholder="Ex: Bio, Local, Saison..."
                                                    :class="{ 'border-terracotta-300 ring-2 ring-terracotta-200/50': nameError }"
                                                    @input="generateSlug" />
                                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                    <div
                                                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-spring-green-100 to-spring-green-200 flex items-center justify-center">
                                                        <svg class="w-5 h-5 text-spring-green-600" fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path
                                                                d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                            <path fill-rule="evenodd"
                                                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
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
                                                    {{ formData.name.length }}/50 caractères
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Slug -->
                                        <div class="relative">
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-100 to-cream-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-forest-green-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                Slug (URL) *
                                            </label>
                                            <div class="relative">
                                                <input v-model="formData.slug" type="text" required pattern="[a-z0-9-]+"
                                                    title="Seulement des lettres minuscules, chiffres et tirets"
                                                    class="w-full px-5 py-4 pl-14 bg-white/80 border border-nature-gray-200/60 rounded-xl focus:ring-3 focus:ring-forest-green-300/50 focus:border-forest-green-400 transition-all duration-400 ease-out-custom placeholder-nature-gray-400 text-forest-green-900 font-mono text-lg shadow-sm"
                                                    placeholder="bio-local-saison" />
                                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                    <div
                                                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-green-100 to-forest-green-200 flex items-center justify-center">
                                                        <svg class="w-5 h-5 text-forest-green-600" fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd"
                                                                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <p class="mt-3 text-sm text-nature-gray-500">
                                                Le slug est utilisé dans l'URL. Utilisez uniquement des lettres
                                                minuscules, chiffres et tirets.
                                            </p>
                                        </div>

                                        <!-- Type de tag -->
                                        <div>
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-100 to-cream-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-terracotta-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                Type de tag *
                                            </label>

                                            <!-- Boutons de sélection du type -->
                                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <button v-for="type in tagTypes" :key="type.value" type="button"
                                                    @click="formData.type = type.value"
                                                    class="relative p-4 rounded-xl border-2 transition-all duration-300 ease-out-custom group hover:scale-105 hover:shadow-md"
                                                    :class="[
                                                        formData.type === type.value
                                                            ? `${type.borderColor} ${type.bgColor} shadow-sm`
                                                            : 'border-nature-gray-200/60 bg-white/70 hover:border-nature-gray-300'
                                                    ]">
                                                    <div class="flex flex-col items-center space-y-3">
                                                        <div class="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                                                            :class="type.iconColor">
                                                            {{ type.icon }}
                                                        </div>
                                                        <div class="font-medium"
                                                            :class="formData.type === type.value ? type.textColor : 'text-nature-gray-700'">
                                                            {{ type.label }}
                                                        </div>
                                                    </div>

                                                    <!-- Indicateur de sélection -->
                                                    <div v-if="formData.type === type.value"
                                                        class="absolute -top-2 -right-2">
                                                        <div
                                                            class="w-6 h-6 rounded-full bg-gradient-to-r from-spring-green-400 to-forest-green-400 flex items-center justify-center">
                                                            <svg class="w-3 h-3 text-white" fill="currentColor"
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

                                        <!-- Sélecteur de couleur -->
                                        <div>
                                            <label
                                                class="text-lg font-medium mb-4 text-forest-green-800 flex items-center">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-cream-100 to-terracotta-100 flex items-center justify-center mr-3">
                                                    <svg class="w-6 h-6 text-cream-600" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                Couleur du tag *
                                            </label>

                                            <!-- Palette de couleurs prédéfinies -->
                                            <div class="mb-6">
                                                <p class="text-sm text-nature-gray-600 mb-4">Palette recommandée :</p>
                                                <div class="flex flex-wrap gap-3">
                                                    <button v-for="color in predefinedColors" :key="color.value"
                                                        type="button" @click="formData.color = color.value"
                                                        class="relative w-12 h-12 rounded-xl transition-all duration-300 ease-out-custom hover:scale-110 hover:shadow-lg"
                                                        :style="{ backgroundColor: color.value }">
                                                        <!-- Indicateur de sélection -->
                                                        <div v-if="formData.color === color.value"
                                                            class="absolute -inset-1 border-2 border-white rounded-xl">
                                                        </div>
                                                        <div v-if="formData.color === color.value"
                                                            class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                                            <svg class="w-3 h-3 text-forest-green-800"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- Sélecteur de couleur personnalisé -->
                                            <div class="relative">
                                                <label class="block text-sm font-medium mb-3 text-nature-gray-600">Ou
                                                    choisissez une couleur personnalisée :</label>
                                                <div class="flex items-center space-x-4">
                                                    <div class="relative">
                                                        <input v-model="formData.color" type="color"
                                                            class="w-16 h-16 rounded-xl cursor-pointer border-2 border-nature-gray-200/60 shadow-sm" />
                                                        <div
                                                            class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white border border-nature-gray-300 flex items-center justify-center">
                                                            <svg class="w-4 h-4 text-nature-gray-600"
                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd"
                                                                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                                                    clip-rule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div class="flex-1">
                                                        <input v-model="formData.color" type="text"
                                                            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                                            placeholder="#38a169"
                                                            class="w-full px-4 py-3 bg-white/80 border border-nature-gray-200/60 rounded-xl focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom placeholder-nature-gray-400 text-forest-green-900 font-mono shadow-sm" />
                                                        <p class="mt-2 text-xs text-nature-gray-500">
                                                            Format hexadécimal (ex: #38a169)
                                                        </p>
                                                    </div>

                                                    <!-- Prévisualisation de la couleur -->
                                                    <div class="flex-shrink-0">
                                                        <div class="w-16 h-16 rounded-xl border-2 border-white shadow-lg"
                                                            :style="{ backgroundColor: formData.color }"></div>
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
                                        Aperçu du tag
                                    </h3>

                                    <!-- Tag preview -->
                                    <div
                                        class="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-spring-green-50/30 to-cream-50/30 rounded-xl border border-spring-green-200/30 mb-6">
                                        <div class="text-sm text-nature-gray-500 mb-4">Votre tag ressemblera à :</div>

                                        <div class="inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-out-custom transform hover:scale-105"
                                            :style="{
                                                backgroundColor: formData.color + '20',
                                                color: formData.color,
                                                border: `2px solid ${formData.color}40`
                                            }">
                                            <span v-if="formData.name">{{ formData.name }}</span>
                                            <span v-else class="italic text-nature-gray-400">Nom du tag</span>

                                            <!-- Badge type -->
                                            <span v-if="formData.type"
                                                class="ml-3 px-3 py-1 text-xs rounded-full font-medium" :style="{
                                                    backgroundColor: getTypeColor(formData.type) + '30',
                                                    color: getTypeColor(formData.type)
                                                }">
                                                {{ getTypeLabel(formData.type) }}
                                            </span>
                                        </div>

                                        <!-- Détails du preview -->
                                        <div class="mt-8 grid grid-cols-2 gap-4 w-full">
                                            <div class="text-center p-3 bg-white/70 rounded-lg">
                                                <div class="text-sm text-nature-gray-500">Slug</div>
                                                <div class="font-mono text-sm text-forest-green-800 truncate">{{
                                                    formData.slug || 'exemple-slug' }}</div>
                                            </div>
                                            <div class="text-center p-3 bg-white/70 rounded-lg">
                                                <div class="text-sm text-nature-gray-500">Couleur</div>
                                                <div class="flex items-center justify-center space-x-2">
                                                    <div class="w-4 h-4 rounded-full border border-nature-gray-300"
                                                        :style="{ backgroundColor: formData.color || '#38a169' }"></div>
                                                    <div class="font-mono text-sm text-forest-green-800">{{
                                                        formData.color || '#38a169' }}</div>
                                                </div>
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
                                            <span class="text-sm font-medium text-forest-green-700">Actif</span>
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
                                        Guide des types de tags
                                    </h3>

                                    <div class="space-y-4">
                                        <div v-for="type in tagTypes" :key="type.value"
                                            class="p-4 rounded-lg border transition-all duration-300 ease-out-custom hover:scale-[1.02]"
                                            :class="type.bgColor.replace('bg-', 'bg-').replace('/70', '/30') + ' ' + type.borderColor">
                                            <div class="flex items-center space-x-3">
                                                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                    :class="type.iconColor">
                                                    {{ type.icon }}
                                                </div>
                                                <div>
                                                    <div class="font-semibold" :class="type.textColor">{{ type.label }}
                                                    </div>
                                                    <div class="text-sm mt-1"
                                                        :class="type.textColor.replace('text-', 'text-').replace('-700', '-600')">
                                                        {{ type.description }}
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
                                                <span class="font-medium">Astuce :</span> Utilisez des couleurs
                                                contrastées pour une meilleure visibilité
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
                            {{ isEditMode ? 'Mettre à jour le tag' : 'Créer le tag' }}
                        </template>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

// Avoid static imports that pull in top-level aliases or environment-dependent modules
// Use a lightweight local slug generator and lazy-load the tag store when needed.

const simpleSlugify = (s: string) =>
    s
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')

let _tagStore: any = null
async function getTagStore() {
    if (_tagStore) return _tagStore
    const mod = await import('../../store/modules/tag.store')
    _tagStore = mod.useTagStore()
    return _tagStore
}

interface Props {
    tagId?: string
}

interface Emits {
    (e: 'success'): void
    (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

let tagStore: any = null
const isSubmitting = ref(false)
const nameError = ref<string | null>(null)

// Types de tags prédéfinis
const tagTypes = [
    {
        value: 'bio' as const,
        label: 'Bio',
        icon: '🌿',
        description: 'Produits issus de l\'agriculture biologique',
        borderColor: 'border-spring-green-400',
        bgColor: 'bg-spring-green-50',
        textColor: 'text-spring-green-800',
        iconColor: 'text-spring-green-600 bg-spring-green-100'
    },
    {
        value: 'local' as const,
        label: 'Local',
        icon: '📍',
        description: 'Produits locaux et de proximité',
        borderColor: 'border-forest-green-400',
        bgColor: 'bg-forest-green-50',
        textColor: 'text-forest-green-800',
        iconColor: 'text-forest-green-600 bg-forest-green-100'
    },
    {
        value: 'season' as const,
        label: 'Saison',
        icon: '🍂',
        description: 'Produits de saison disponibles',
        borderColor: 'border-terracotta-400',
        bgColor: 'bg-terracotta-50',
        textColor: 'text-terracotta-800',
        iconColor: 'text-terracotta-600 bg-terracotta-100'
    },
    {
        value: 'promo' as const,
        label: 'Promo',
        icon: '🔥',
        description: 'Produits en promotion spéciale',
        borderColor: 'border-red-400',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        iconColor: 'text-red-600 bg-red-100'
    }
]

// Couleurs prédéfinies basées sur la palette naturelle
const predefinedColors = [
    { value: '#38a169', label: 'Vert forêt' },
    { value: '#22c55e', label: 'Vert printemps' },
    { value: '#f59e0b', label: 'Ambre' },
    { value: '#f97316', label: 'Orange' },
    { value: '#ef4444', label: 'Rouge' },
    { value: '#8b5cf6', label: 'Violet' },
    { value: '#0ea5e9', label: 'Bleu ciel' },
    { value: '#14b8a6', label: 'Turquoise' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#a855f7', label: 'Pourpre' }
]

// Données du formulaire
const formData = reactive({
    name: '',
    slug: '',
    type: 'bio' as 'bio' | 'local' | 'season' | 'promo',
    color: '#38a169',
    is_active: true
})

// Mode édition
const isEditMode = computed(() => !!props.tagId)

// Générer le slug automatiquement
const generateSlug = () => {
    if (!isEditMode.value) {
        formData.slug = simpleSlugify(formData.name)
    }
}

// Valider le formulaire
const validateForm = (): boolean => {
    nameError.value = null

    if (!formData.name.trim()) {
        nameError.value = 'Le nom du tag est requis'
        return false
    }

    if (formData.name.length < 2) {
        nameError.value = 'Le nom doit contenir au moins 2 caractères'
        return false
    }

    if (!formData.slug.trim()) {
        nameError.value = 'Le slug est requis'
        return false
    }

    // Validation du format du slug
    const slugPattern = /^[a-z0-9-]+$/
    if (!slugPattern.test(formData.slug)) {
        nameError.value = 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets'
        return false
    }

    // Validation de la couleur hexadécimale
    const colorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!colorPattern.test(formData.color)) {
        nameError.value = 'La couleur doit être au format hexadécimal (ex: #38a169)'
        return false
    }

    return true
}

// Obtenir les informations du type
const getTypeLabel = (type: string): string => {
    const found = tagTypes.find(t => t.value === type)
    return found?.label || type
}

const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        bio: '#38a169',
        local: '#22c55e',
        season: '#f59e0b',
        promo: '#ef4444'
    }
    return colors[type] || '#38a169'
}

// Soumettre le formulaire
const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        if (isEditMode.value && props.tagId) {
            await tagStore.updateTag(props.tagId, formData)
        } else {
            await tagStore.createTag(formData)
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

// Charger les données si en mode édition
onMounted(async () => {
    // Initialiser le store
    tagStore = await getTagStore()

    // Si en mode édition, charger le tag
    if (isEditMode.value && props.tagId) {
        try {
            const tag = await tagStore.fetchTagById(props.tagId)
            if (tag) {
                Object.assign(formData, tag)
            }
        } catch (error) {
            console.error('Erreur lors du chargement du tag:', error)
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

/* Animation de flottement pour les tags */
@keyframes float-tags-1 {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    33% {
        transform: translate(-20px, -15px) scale(1.1);
    }

    66% {
        transform: translate(15px, 10px) scale(0.9);
    }
}

.animate-float-tags-1 {
    animation: float-tags-1 25s ease-in-out infinite;
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

/* Texture de tags en filigrane */
.bg-tag-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,30 Q70,10 90,30 T130,30 Q150,10 170,30' stroke='%23005500' stroke-width='1' fill='none' opacity='0.05'/%3E%3Cpath d='M30,70 Q50,50 70,70 T110,70 Q130,50 150,70' stroke='%23005500' stroke-width='1' fill='none' opacity='0.04'/%3E%3Cpath d='M70,110 Q90,90 110,110 T150,110 Q170,90 190,110' stroke='%23005500' stroke-width='1' fill='none' opacity='0.03'/%3E%3Ccircle cx='40' cy='140' r='15' stroke='%23005500' stroke-width='1' fill='none' opacity='0.04'/%3E%3Ccircle cx='140' cy='160' r='12' stroke='%23005500' stroke-width='1' fill='none' opacity='0.04'/%3E%3C/svg%3E");
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

/* Input color personnalisé */
input[type="color"] {
    appearance: none;
    -webkit-appearance: none;
    border: none;
}

input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 10px;
}
</style>

