<template>
  <div class="rounded-xl border border-emerald-200/40 bg-gradient-to-br from-white to-emerald-50/25 p-4 shadow-sm">
    <p class="font-semibold text-nature-900 truncate">{{ payout.payout_number }}</p>
    <p class="mt-1 text-xs text-nature-600">{{ formatDate(payout.period_end) }}</p>
    <p class="mt-2 text-sm text-emerald-700 font-semibold">{{ formatCurrency(payout.net_amount) }}</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <button class="btn" @click="$emit('view')">Voir</button>
      <button class="btn" @click="$emit('download')">Reçu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
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
</script>

<style scoped>
.btn {
  @apply rounded-lg border border-nature-300 px-2.5 py-1 text-xs text-nature-700 hover:bg-nature-50;
}
</style>

