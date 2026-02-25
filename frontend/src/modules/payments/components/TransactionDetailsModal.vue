<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

    <div class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
      <div class="mb-4 flex items-start justify-between">
        <div>
          <h3 class="text-xl font-semibold text-forest-green">Details de la transaction</h3>
          <p class="text-sm text-nature-gray">ID: {{ transaction?.id || '-' }}</p>
        </div>
        <button
          type="button"
          class="rounded-lg px-3 py-1 text-sm text-nature-gray hover:bg-gray-100"
          @click="$emit('close')"
        >
          Fermer
        </button>
      </div>

      <div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
        <div class="rounded-lg bg-cream-light/40 p-3">
          <p class="text-nature-gray">Montant</p>
          <p class="font-medium text-forest-green">{{ formatXaf(transaction?.amount) }}</p>
        </div>
        <div class="rounded-lg bg-cream-light/40 p-3">
          <p class="text-nature-gray">Statut</p>
          <p class="font-medium text-forest-green">{{ transaction?.status || '-' }}</p>
        </div>
        <div class="rounded-lg bg-cream-light/40 p-3">
          <p class="text-nature-gray">Methode</p>
          <p class="font-medium text-forest-green">{{ transaction?.method || '-' }}</p>
        </div>
        <div class="rounded-lg bg-cream-light/40 p-3">
          <p class="text-nature-gray">Date</p>
          <p class="font-medium text-forest-green">{{ transaction?.date || '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ transaction?: any }>()
defineEmits<{ (e: 'close'): void }>()

const formatXaf = (amount: number | string | undefined) =>
  new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount || 0))

void props
</script>

