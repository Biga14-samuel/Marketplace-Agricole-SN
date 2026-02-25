<template>
  <div class="rounded-xl border border-primary-200/40 bg-gradient-to-br from-white to-primary-50/30 p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="font-semibold text-nature-900 truncate">{{ invoice.invoice_number }}</p>
        <p class="text-sm text-nature-600 truncate">{{ invoice.customer_name }}</p>
      </div>
      <input type="checkbox" :checked="selected" @change="$emit('select')" />
    </div>

    <div class="mt-3 text-sm text-nature-700">
      <p>Total: <strong>{{ formatCurrency(invoice.total) }}</strong></p>
      <p class="text-xs text-nature-500">{{ formatDate(invoice.issue_date) }}</p>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button class="btn" @click="$emit('view')">Voir</button>
      <button class="btn" @click="$emit('download')">PDF</button>
      <button class="btn" @click="$emit('share')">Partager</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
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
</script>

<style scoped>
.btn {
  @apply rounded-lg border border-nature-300 px-2.5 py-1 text-xs text-nature-700 hover:bg-nature-50;
}
</style>

