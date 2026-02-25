<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
    <button class="absolute top-6 right-6 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20" @click="emit('close')">
      ✕
    </button>

    <div class="relative w-full max-w-5xl">
      <img
        :src="currentImage?.url || currentImage"
        :alt="currentImage?.alt_text || 'Image produit'"
        class="w-full max-h-[80vh] object-contain rounded-xl"
      />

      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
        @click="previous"
      >
        ◀
      </button>
      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
        @click="next"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ images: any[]; initialIndex?: number }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'next'): void; (e: 'previous'): void }>()

const index = ref(props.initialIndex || 0)

const currentImage = computed(() => props.images[index.value])

const next = () => {
  emit('next')
  index.value = (index.value + 1) % props.images.length
}

const previous = () => {
  emit('previous')
  index.value = (index.value - 1 + props.images.length) % props.images.length
}

watch(
  () => props.initialIndex,
  newValue => {
    if (typeof newValue === 'number') index.value = newValue
  }
)
</script>

