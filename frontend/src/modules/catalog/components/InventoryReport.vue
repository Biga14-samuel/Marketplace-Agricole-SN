<template>
  <div class="inventory-report">
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Rapport d'inventaire</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card">
          <div class="text-sm text-gray-600">Total produits</div>
          <div class="text-2xl font-bold">{{ stats.totalProducts }}</div>
        </div>
        
        <div class="stat-card">
          <div class="text-sm text-gray-600">Valeur totale</div>
          <div class="text-2xl font-bold">{{ formatCurrency(stats.totalValue) }}</div>
        </div>
        
        <div class="stat-card">
          <div class="text-sm text-gray-600">Stock faible</div>
          <div class="text-2xl font-bold text-orange-600">{{ stats.lowStock }}</div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Produit</th>
              <th class="text-right py-2">Stock</th>
              <th class="text-right py-2">Prix unitaire</th>
              <th class="text-right py-2">Valeur</th>
              <th class="text-center py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-b">
              <td class="py-2">{{ item.name }}</td>
              <td class="text-right">{{ item.stock }} {{ item.unit }}</td>
              <td class="text-right">{{ formatCurrency(item.price) }}</td>
              <td class="text-right">{{ formatCurrency(item.stock * item.price) }}</td>
              <td class="text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs',
                    item.stock <= item.minStock ? 'bg-red-100 text-red-800' :
                    item.stock <= item.minStock * 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  ]"
                >
                  {{ getStockStatus(item) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface InventoryItem {
  id: string | number
  name: string
  stock: number
  unit: string
  price: number
  minStock: number
}

interface Props {
  items?: InventoryItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

const stats = computed(() => {
  const totalProducts = props.items.length
  const totalValue = props.items.reduce((sum, item) => sum + (item.stock * item.price), 0)
  const lowStock = props.items.filter(item => item.stock <= item.minStock).length
  
  return {
    totalProducts,
    totalValue,
    lowStock
  }
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(value)
}

const getStockStatus = (item: InventoryItem) => {
  if (item.stock <= item.minStock) return 'Critique'
  if (item.stock <= item.minStock * 2) return 'Faible'
  return 'Normal'
}
</script>

<style scoped>
.stat-card {
  @apply bg-gray-50 rounded-lg p-4;
}
</style>
