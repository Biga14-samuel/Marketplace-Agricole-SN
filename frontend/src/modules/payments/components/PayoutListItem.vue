<template>
  <div class="rounded-xl border border-emerald-200/50 bg-white/80 p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="font-semibold text-nature-900 truncate">{{ payout.payout_number }}</p>
        <p class="text-xs text-nature-600">
          {{ formatDate(payout.period_start) }} - {{ formatDate(payout.period_end) }}
        </p>
      </div>
      <span class="rounded-full px-2 py-0.5 text-xs" :class="statusClass">{{ statusLabel }}</span>
    </div>

    <div class="mt-3 text-sm text-nature-700">
      <p>Net: <strong>{{ formatCurrency(payout.net_amount) }}</strong></p>
      <p>Brut: {{ formatCurrency(payout.gross_amount) }} • Commission: {{ formatCurrency(payout.commission) }}</p>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button class="btn" @click="$emit('view')">Voir</button>
      <button class="btn" @click="$emit('download')">Reçu</button>
      <button class="btn" @click="$emit('track')">Suivi</button>
      <button class="btn" @click="$emit('contact')">Support</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  payout: any
}>()

defineEmits<{
  (e: 'view'): void
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
  new Date(value).toLocaleDateString('fr-CM', { day: 'numeric', month: 'short', year: 'numeric' })

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Complété',
    failed: 'Échoué'
  }
  return labels[String(props.payout?.status || '')] || 'Inconnu'
})

const statusClass = computed(() => {
  const classes: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700'
  }
  return classes[String(props.payout?.status || '')] || 'bg-nature-100 text-nature-700'
})
</script>

<style scoped>
.btn {
  @apply rounded-lg border border-nature-300 px-2.5 py-1 text-xs text-nature-700 hover:bg-nature-50;
}
</style>

