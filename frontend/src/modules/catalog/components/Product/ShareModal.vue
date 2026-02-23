<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6">
    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')"></div>
    <div class="relative w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/50 shadow-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-emerald-800">Partager le produit</h3>
        <button class="p-2 rounded-lg hover:bg-amber-50" @click="emit('close')">✕</button>
      </div>

      <p class="text-sm text-amber-700/80 mb-4">
        Partagez <span class="font-semibold text-emerald-700">{{ product?.name || 'ce produit' }}</span> avec vos proches.
      </p>

      <div class="flex items-center gap-3">
        <input
          ref="shareInput"
          :value="shareUrl"
          class="flex-1 px-4 py-2.5 rounded-lg border border-emerald-200/50 bg-white/80 text-sm"
          readonly
        />
        <button class="px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600" @click="copy">
          Copier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ product: any }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const shareInput = ref<HTMLInputElement | null>(null)
const shareUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/catalog/products/${props.product?.id || ''}`
})

const copy = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
  } catch {
    shareInput.value?.select()
    document.execCommand('copy')
  }
}
</script>
