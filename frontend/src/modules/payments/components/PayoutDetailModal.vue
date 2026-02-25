<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
      <div class="mb-4 flex items-start justify-between">
        <div>
          <h3 class="text-xl font-semibold text-nature-900">Détail du versement</h3>
          <p class="text-sm text-nature-600">{{ payout?.payout_number }}</p>
        </div>
        <button class="rounded-lg border px-2 py-1 text-sm" @click="$emit('close')">Fermer</button>
      </div>

      <div class="space-y-2 text-sm text-nature-700">
        <p>Brut: <strong>{{ formatCurrency(payout?.gross_amount) }}</strong></p>
        <p>Commission: <strong>{{ formatCurrency(payout?.commission) }}</strong></p>
        <p>Net: <strong>{{ formatCurrency(payout?.net_amount) }}</strong></p>
        <p>Période: {{ formatDate(payout?.period_start) }} - {{ formatDate(payout?.period_end) }}</p>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button class="btn" @click="$emit('download')">Télécharger reçu</button>
        <button class="btn" @click="$emit('track')">Suivre</button>
        <button class="btn" @click="$emit('contact')">Contacter support</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  payout: any
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'download'): void
  (e: 'track'): void
  (e: 'contact'): void
}>()

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount || 0))

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleDateString('fr-CM', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
</script>

<style scoped>
.btn {
  @apply rounded-lg border border-nature-300 px-3 py-1.5 text-sm text-nature-700 hover:bg-nature-50;
}
</style>

