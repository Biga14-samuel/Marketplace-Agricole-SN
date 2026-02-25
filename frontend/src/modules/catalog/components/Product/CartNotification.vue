<template>
  <div class="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-md border border-emerald-200/50 rounded-2xl shadow-2xl p-4 w-80">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-emerald-800 font-semibold">Ajouté au panier</p>
        <p class="text-xs text-amber-700/70 mt-1">
          {{ quantity }} × {{ product?.name || 'Produit' }}
        </p>
      </div>
      <button class="text-amber-600 hover:text-amber-800" @click="emit('close')">✕</button>
    </div>

    <div class="flex items-center gap-2 mt-4">
      <button class="flex-1 px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50" @click="emit('close')">
        Continuer
      </button>
      <button class="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600" @click="emit('view-cart')">
        Voir panier
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ product: any; quantity: number }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'view-cart'): void }>()
</script>

