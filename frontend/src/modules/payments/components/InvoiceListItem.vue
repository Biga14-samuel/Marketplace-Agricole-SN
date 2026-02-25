<template>
  <div class="rounded-xl border border-nature-200/60 bg-white/80 p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="font-semibold text-nature-900 truncate">Facture {{ invoice.invoice_number }}</p>
        <p class="text-sm text-nature-600 truncate">{{ invoice.customer_name }}</p>
        <p class="text-xs text-nature-500">{{ formatDate(invoice.issue_date) }}</p>
      </div>
      <input type="checkbox" :checked="selected" @change="$emit('select')" />
    </div>

    <div class="mt-3 flex items-center justify-between">
      <span class="text-sm font-medium text-primary-700">{{ formatCurrency(invoice.total) }}</span>
      <span class="rounded-full px-2 py-0.5 text-xs" :class="statusClass">{{ statusLabel }}</span>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button class="btn" @click="$emit('view')">Voir</button>
      <button class="btn" @click="$emit('pay')">Payer</button>
      <button class="btn" @click="$emit('download')">PDF</button>
      <button class="btn" @click="$emit('share')">Partager</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  invoice: any
  selected: boolean
}>()

defineEmits<{
  (e: 'select'): void
  (e: 'view'): void
  (e: 'pay'): void
  (e: 'download'): void
  (e: 'share'): void
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
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En retard'
  }
  return labels[String(props.invoice?.status || '')] || 'Inconnu'
})

const statusClass = computed(() => {
  const classes: Record<string, string> = {
    draft: 'bg-nature-100 text-nature-700',
    sent: 'bg-primary-100 text-primary-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700'
  }
  return classes[String(props.invoice?.status || '')] || 'bg-nature-100 text-nature-700'
})
</script>

<style scoped>
.btn {
  @apply rounded-lg border border-nature-300 px-2.5 py-1 text-xs text-nature-700 hover:bg-nature-50;
}
</style>

