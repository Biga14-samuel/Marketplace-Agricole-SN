<template>
  <div class="tag-selector">
    <label v-if="label" class="block text-sm font-medium mb-2 text-forest-green-700">
      {{ label }}
      <span v-if="required" class="text-terracotta-500">*</span>
    </label>

    <!-- Tags sélectionnés -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="tag in selectedTags"
        :key="tag.id"
        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
        :style="{
          backgroundColor: `${tag.color || '#10b981'}20`,
          color: tag.color || '#065f46',
          borderColor: `${tag.color || '#10b981'}40`
        }"
      >
        {{ tag.name }}
        <button
          type="button"
          class="ml-2 text-xs hover:opacity-80"
          @click="removeTag(tag.id)"
          :disabled="disabled"
        >
          ✕
        </button>
      </span>
    </div>

    <!-- Recherche -->
    <div class="relative mb-3">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-2.5 bg-white/80 border border-spring-green-200/50 rounded-lg focus:ring-2 focus:ring-spring-green-300 focus:border-spring-green-400 transition-all duration-300 ease-out-custom placeholder-nature-gray-400 text-forest-green-800 shadow-sm"
        :disabled="disabled"
      />
    </div>

    <!-- Liste des tags -->
    <div class="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
      <label
        v-for="tag in filteredTags"
        :key="tag.id"
        class="flex items-center gap-3 p-2 rounded-lg border border-emerald-200/30 bg-white/60 hover:bg-emerald-50/50 transition-all duration-200 ease-organic cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': isTagDisabled(tag.id) }"
      >
        <input
          type="checkbox"
          :value="tag.id"
          v-model="selectedIds"
          :disabled="disabled || isTagDisabled(tag.id)"
          class="rounded text-emerald-600 focus:ring-emerald-500"
        />
        <span
          class="text-sm font-medium"
          :style="{ color: tag.color || '#065f46' }"
        >
          {{ tag.name }}
        </span>
      </label>
    </div>

    <p v-if="error" class="mt-2 text-sm text-terracotta-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useTagStore } from '@/modules/catalog/store/modules/tag.store'

interface Props {
  modelValue?: string[]
  label?: string
  placeholder?: string
  maxTags?: number
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: 'Tags',
  placeholder: 'Rechercher un tag...',
  maxTags: 5,
  required: false,
  disabled: false,
  error: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}>()

const tagStore = useTagStore()
const searchQuery = ref('')
const selectedIds = ref<string[]>([...props.modelValue])

const filteredTags = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return tagStore.tags
  return tagStore.tags.filter(tag => tag.name.toLowerCase().includes(query))
})

const selectedTags = computed(() => {
  return tagStore.tags.filter(tag => selectedIds.value.includes(tag.id))
})

const isMaxReached = computed(() => {
  return props.maxTags !== undefined && selectedIds.value.length >= props.maxTags
})

const isTagDisabled = (tagId: string) => {
  return !selectedIds.value.includes(tagId) && isMaxReached.value
}

const removeTag = (tagId: string) => {
  if (props.disabled) return
  selectedIds.value = selectedIds.value.filter(id => id !== tagId)
}

watch(
  () => props.modelValue,
  value => {
    selectedIds.value = Array.isArray(value) ? [...value] : []
  }
)

watch(
  () => selectedIds.value,
  value => {
    emit('update:modelValue', value)
    emit('change', value)
  },
  { deep: true }
)

onMounted(async () => {
  if (tagStore.tags.length === 0) {
    await tagStore.fetchAllTags()
  }
})
</script>

<style scoped>
.ease-organic {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 85, 0, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4ade80, #22c55e);
  border-radius: 3px;
}
</style>
