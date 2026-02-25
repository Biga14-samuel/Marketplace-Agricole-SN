<template>
    <div class="relative">
        <!-- Nœud de catégorie -->
        <div class="relative group" :style="{ marginLeft: `${level * 40}px` }">
            <!-- Ligne de connexion -->
            <div v-if="level > 0"
                class="absolute top-6 -left-6 w-6 h-px bg-gradient-to-r from-forest-green-300 to-spring-green-300">
            </div>

            <!-- Carte du nœud -->
            <div class="relative min-w-[280px] max-w-xs bg-white/90 backdrop-blur-sm rounded-xl border-2 transition-all duration-500 ease-in-out-organic hover:scale-105 hover:shadow-organic-xl"
                :class="[
                    node.is_active
                        ? 'border-spring-green-200 hover:border-spring-green-300'
                        : 'border-terracotta-200 hover:border-terracotta-300',
                    hasChildren ? 'shadow-organic' : 'shadow-soft-organic'
                ]">
                <!-- En-tête du nœud -->
                <div class="p-5">
                    <div class="flex items-start justify-between mb-3">
                        <!-- Icône et nom -->
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 ease-out-custom group-hover:scale-110"
                                :class="[
                                    node.is_active
                                        ? 'bg-gradient-to-br from-spring-green-100 to-cream-100 text-spring-green-600'
                                        : 'bg-gradient-to-br from-terracotta-100 to-cream-100 text-terracotta-600'
                                ]">
                                {{ node.icon || (hasChildren ? '🌳' : '🍃') }}
                            </div>
                            <div>
                                <h3 class="font-bold text-forest-green-900 group-hover:text-forest-green-700 transition-colors duration-300"
                                    :class="{ 'text-nature-gray-500': !node.is_active }">
                                    {{ node.name }}
                                </h3>
                                <p class="text-sm text-nature-gray-500 mt-1">{{ node.slug }}</p>
                            </div>
                        </div>

                        <!-- Badge statut et bouton expand -->
                        <div class="flex flex-col items-end space-y-2">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="[
                                node.is_active
                                    ? 'bg-spring-green-100 text-spring-green-800'
                                    : 'bg-terracotta-100 text-terracotta-800'
                            ]">
                                <span class="w-2 h-2 rounded-full mr-1" :class="[
                                    node.is_active ? 'bg-spring-green-500' : 'bg-terracotta-500'
                                ]"></span>
                                {{ node.is_active ? 'Active' : 'Inactive' }}
                            </span>

                            <button v-if="hasChildren" @click="$emit('toggle', node.id)"
                                class="p-1.5 rounded-lg hover:bg-spring-green-50 transition-all duration-300 ease-out-custom">
                                <svg class="w-4 h-4 text-spring-green-600 transition-transform duration-500 ease-out-expo"
                                    :class="{ 'rotate-90': isExpanded }" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Description -->
                    <p v-if="node.description" class="text-sm text-nature-gray-600 mb-4 line-clamp-2">
                        {{ node.description }}
                    </p>

                    <!-- Métadonnées -->
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <div class="flex items-center space-x-1.5 text-xs text-nature-gray-500">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>Position: {{ node.position }}</span>
                        </div>
                        <div v-if="hasChildren" class="flex items-center space-x-1.5 text-xs text-forest-green-600">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ node.children.length }} sous-cat.</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-between pt-4 border-t border-nature-gray-200/40">
                        <div class="flex items-center space-x-2">
                            <button @click="$emit('view', node)"
                                class="p-1.5 text-nature-gray-500 hover:text-forest-green-700 hover:bg-spring-green-50 rounded-lg transition-all duration-300 ease-out-custom"
                                title="Voir">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div class="flex items-center space-x-1">
                            <button @click="$emit('edit', node)"
                                class="p-1.5 text-spring-green-600 hover:text-spring-green-700 hover:bg-spring-green-50 rounded-lg transition-all duration-300 ease-out-custom"
                                title="Éditer">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>

                            <button @click="$emit('delete', node)"
                                class="p-1.5 text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-50 rounded-lg transition-all duration-300 ease-out-custom"
                                title="Supprimer">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Indicateur d'enfants -->
                <div v-if="hasChildren"
                    class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-white"
                    :class="[
                        node.is_active
                            ? 'border-spring-green-300'
                            : 'border-terracotta-300'
                    ]"></div>
            </div>
        </div>

        <!-- Enfants (récursif) -->
        <Transition v-if="hasChildren" enter-active-class="transition-all duration-500 ease-out-expo overflow-hidden"
            enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[2000px] opacity-100"
            leave-active-class="transition-all duration-300 ease-in-expo overflow-hidden"
            leave-from-class="max-h-[2000px] opacity-100" leave-to-class="max-h-0 opacity-0">
            <div v-show="isExpanded" class="mt-8">
                <!-- Ligne verticale de connexion -->
                <div v-if="hasChildren && isExpanded"
                    class="absolute top-16 left-0 w-px h-[calc(100%-64px)] bg-gradient-to-b from-forest-green-300/50 to-transparent"
                    :style="{ marginLeft: `${level * 40 + 20}px` }"></div>

                <!-- Enfants en grille -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CategoryTreeNode v-for="child in node.children" :key="child.id" :node="child" :level="level + 1"
                        :expanded-nodes="expandedNodes" :max-depth="maxDepth" @toggle="$emit('toggle', $event)"
                        @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" @view="$emit('view', $event)" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    node: any
    level: number
    expandedNodes: Set<number>
    maxDepth: number
}

const props = defineProps<Props>()

interface Emits {
    (e: 'toggle', id: number): void
    (e: 'edit', category: any): void
    (e: 'delete', category: any): void
    (e: 'view', category: any): void
}

const emit = defineEmits<Emits>()

// Données calculées
const hasChildren = computed(() => {
    return props.node.children && props.node.children.length > 0
})

const isExpanded = computed(() => {
    return props.expandedNodes.has(props.node.id) && props.level < props.maxDepth
})
</script>

<style scoped>
/* Courbes de Bézier personnalisées */
:deep() {
    --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
    --ease-out-custom: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-in-out-organic: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-out-expo {
    transition-timing-function: var(--ease-out-expo);
}

.ease-out-custom {
    transition-timing-function: var(--ease-out-custom);
}

.ease-in-out-organic {
    transition-timing-function: var(--ease-in-out-organic);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    /* version standard pour compatibilité future */
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Ombres organiques */
.shadow-soft-organic {
    box-shadow:
        0 2px 8px -1px rgba(0, 85, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.shadow-organic {
    box-shadow:
        0 4px 12px -2px rgba(0, 85, 0, 0.1),
        0 2px 6px -1px rgba(139, 195, 74, 0.08);
}

.shadow-organic-xl {
    box-shadow:
        0 8px 25px -5px rgba(0, 85, 0, 0.15),
        0 4px 10px -3px rgba(139, 195, 74, 0.1);
}
</style>
