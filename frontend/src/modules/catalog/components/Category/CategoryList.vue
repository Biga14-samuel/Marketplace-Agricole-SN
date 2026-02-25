<template>
    <div class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Overlay avec flou -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out-expo"></div>

        <!-- Modal -->
        <div class="relative min-h-screen flex items-center justify-center p-4">
            <Transition enter-active-class="transition-all duration-500 ease-out-expo"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition-all duration-300 ease-in-expo" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <div v-if="show"
                    class="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-organic-xl max-w-md w-full p-6">
                    <!-- Icone d'alerte -->
                    <div class="mx-auto w-20 h-20 mb-6">
                        <div
                            class="w-full h-full rounded-full bg-gradient-to-br from-terracotta-100 to-terracotta-200 flex items-center justify-center">
                            <svg class="w-10 h-10 text-terracotta-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <!-- Contenu -->
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-forest-green-900 mb-3">
                            Supprimer la catégorie
                        </h3>
                        <p class="text-nature-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer la catégorie
                            <span class="font-semibold text-terracotta-700">{{ category?.name }}</span> ?
                        </p>
                        <div class="bg-terracotta-50/50 rounded-xl p-4 mb-6 border border-terracotta-200/50">
                            <p class="text-sm text-terracotta-700">
                                ⚠️ Cette action est irréversible. Tous les produits de cette catégorie devront être
                                réaffectés.
                            </p>
                        </div>
                    </div>

                    <!-- Boutons d'action -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button @click="$emit('close')"
                            class="flex-1 px-6 py-3 border border-nature-gray-300 text-nature-gray-700 rounded-xl font-medium hover:bg-nature-gray-50 transition-all duration-300 ease-out-custom active:scale-95">
                            Annuler
                        </button>
                        <button @click="confirmDelete" :disabled="deleting"
                            class="flex-1 px-6 py-3 bg-gradient-to-r from-terracotta-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 ease-out-custom active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                            <span v-if="deleting">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Suppression...
                            </span>
                            <span v-else>Supprimer définitivement</span>
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCategoryStore } from '@/modules/catalog/store/modules/category.store'

interface Props {
    category: any
}

interface Emits {
    (e: 'close'): void
    (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const categoryStore = useCategoryStore()
const deleting = ref(false)
const show = ref(true)

const confirmDelete = async () => {
    deleting.value = true
    try {
        await categoryStore.deleteCategory(props.category.id)
        emit('success')
    } catch (error) {
        console.error('Erreur lors de la suppression:', error)
    } finally {
        deleting.value = false
    }
}
</script>
