<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

    <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h3 class="mb-2 text-xl font-semibold text-forest-green">Options de paiement</h3>
      <p class="mb-5 text-sm text-nature-gray">
        Facture {{ invoice?.invoice_number || invoice?.id || '-' }} - {{ formatXaf(invoice?.total) }}
      </p>

      <div class="space-y-2">
        <button
          v-for="method in methods"
          :key="method.id"
          type="button"
          class="w-full rounded-xl border border-cream-light px-4 py-3 text-left text-forest-green hover:bg-cream-light/30"
          @click="pay(method.id)"
        >
          {{ method.label }}
        </button>
      </div>

      <div class="mt-5 flex justify-end gap-3">
        <button type="button" class="rounded-lg px-4 py-2 text-nature-gray hover:bg-gray-100" @click="$emit('close')">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ invoice?: any }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'paid', payload?: any): void }>()

const methods = [
  { id: 'mtn_mobile_money', label: 'MTN Mobile Money' },
  { id: 'orange_money', label: 'Orange Money' },
  { id: 'express_union', label: 'Express Union' },
  { id: 'card', label: 'Carte bancaire' }
]

const formatXaf = (amount: number | string | undefined) =>
  new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount || 0))

const pay = (method: string) => {
  emit('paid', { method })
  emit('close')
}

void props
</script>

