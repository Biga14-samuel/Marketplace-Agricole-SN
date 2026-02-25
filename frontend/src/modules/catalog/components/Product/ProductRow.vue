<template>
  <div
    class="grid grid-cols-12 gap-4 p-4 bg-white/60 backdrop-blur-sm border-b border-green-light/30 hover:bg-green-soft/10 transition-all duration-300 ease-organic cursor-pointer"
    @click="emit('click', product)"
  >
    <div class="col-span-3 flex items-center gap-3">
      <img :src="productImage" :alt="product.name" class="w-12 h-12 rounded-lg object-cover border border-green-light/30" />
      <div class="min-w-0">
        <div class="font-medium text-forest-dark truncate">{{ product.name }}</div>
        <div class="text-xs text-green-medium/70 truncate">{{ product.sku || 'Sans SKU' }}</div>
      </div>
    </div>

    <div class="col-span-2 flex items-center text-sm text-forest-dark">
      {{ product.category?.name || 'Sans catégorie' }}
    </div>

    <div class="col-span-2 flex items-center text-sm text-forest-dark">
      {{ formatPrice(product.price) }}
    </div>

    <div class="col-span-2 flex items-center text-sm">
      <span :class="stockClass">{{ product.stock_quantity }}</span>
      <span class="ml-1 text-green-medium/70">{{ product.unit?.symbol || 'unités' }}</span>
    </div>

    <div class="col-span-1 flex items-center">
      <span class="status-badge" :class="statusClass">{{ statusText }}</span>
    </div>

    <div class="col-span-2 flex items-center justify-end gap-2">
      <button
        class="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
        @click.stop="emit('edit', product)"
      >
        ✏️ Modifier
      </button>
      <button
        class="px-3 py-1.5 rounded-lg text-xs font-medium bg-terracotta-soft text-terracotta hover:bg-terracotta/10 transition-colors"
        @click.stop="emit('delete', product)"
      >
        🗑️ Supprimer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  product: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', product: any): void
  (e: 'delete', product: any): void
  (e: 'click', product: any): void
}>()

const productImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    const primary = props.product.images.find((img: any) => img.is_primary)
    return primary?.url || props.product.images[0]?.url
  }
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f8f4e9"/%3E%3Cpath d="M80,70 Q100,50 120,70 T160,70" stroke="%23a7d397" stroke-width="3" fill="none"/%3E%3Ccircle cx="100" cy="90" r="20" fill="%235a8c5a"/%3E%3C/svg%3E`
})

const statusText = computed(() => {
  if (props.product.stock_quantity === 0) return 'Rupture'
  if (props.product.stock_quantity < 10) return 'Faible'
  return 'Disponible'
})

const statusClass = computed(() => {
  if (props.product.stock_quantity === 0) return 'bg-terracotta-100 text-terracotta-700'
  if (props.product.stock_quantity < 10) return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
})

const stockClass = computed(() => {
  if (props.product.stock_quantity === 0) return 'text-terracotta'
  if (props.product.stock_quantity < 10) return 'text-amber-700'
  return 'text-emerald-700'
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 2
  }).format(price || 0)
}
</script>

<style scoped>
.status-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}
</style>

