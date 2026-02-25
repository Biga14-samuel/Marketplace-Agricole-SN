<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

    <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <div class="mb-4 flex items-start justify-between">
        <div>
          <h3 class="text-xl font-semibold text-forest-green">Details du remboursement</h3>
          <p class="text-sm text-nature-gray">Reference: {{ refund?.orderNumber || '-' }}</p>
        </div>
        <button
          type="button"
          class="rounded-lg px-3 py-1 text-sm text-nature-gray hover:bg-gray-100"
          @click="$emit('close')"
        >
          Fermer
        </button>
      </div>

      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-nature-gray">Statut</span>
          <span class="font-medium text-forest-green">{{ refund?.status || '-' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-nature-gray">Montant</span>
          <span class="font-medium text-forest-green">{{ formatXaf(refund?.amount) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-nature-gray">Date de demande</span>
          <span class="font-medium text-forest-green">{{ refund?.requestDate || '-' }}</span>
        </div>
        <div>
          <p class="mb-1 text-nature-gray">Motif</p>
          <p class="rounded-lg bg-cream-light/40 p-3 text-forest-green">{{ refund?.reason || '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ refund?: any }>()
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

