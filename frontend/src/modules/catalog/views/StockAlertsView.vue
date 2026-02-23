<template>
  <div class="stock-alerts-view">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Alertes de stock</h1>
        <button 
          @click="refreshAlerts"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Actualiser
        </button>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Tous</option>
              <option value="low">Stock faible</option>
              <option value="out">Rupture</option>
              <option value="critical">Critique</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select v-model="filters.category" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Toutes</option>
              <option value="fruits">Fruits</option>
              <option value="legumes">Légumes</option>
              <option value="cereales">Céréales</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="Nom du produit..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
          </div>
        </div>
      </div>

      <!-- Liste des alertes -->
      <div class="space-y-4">
        <div 
          v-for="alert in filteredAlerts" 
          :key="alert.id"
          class="bg-white rounded-lg shadow-sm p-6 border-l-4"
          :class="getAlertBorderClass(alert.level)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <h3 class="text-lg font-semibold text-gray-800">{{ alert.productName }}</h3>
                <span 
                  class="ml-3 px-2 py-1 text-xs font-medium rounded-full"
                  :class="getAlertBadgeClass(alert.level)"
                >
                  {{ getAlertLevelText(alert.level) }}
                </span>
              </div>
              <p class="text-gray-600 mb-2">{{ alert.message }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <span>Stock actuel: {{ alert.currentStock }}</span>
                <span class="mx-2">•</span>
                <span>Seuil: {{ alert.threshold }}</span>
                <span class="mx-2">•</span>
                <span>{{ formatDate(alert.createdAt) }}</span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="updateStock(alert)"
                class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Mettre à jour
              </button>
              <button 
                @click="dismissAlert(alert.id)"
                class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Ignorer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-if="filteredAlerts.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">Aucune alerte</h3>
        <p class="text-gray-600">Tous vos stocks sont à niveau !</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface StockAlert {
  id: string
  productName: string
  currentStock: number
  threshold: number
  level: 'low' | 'out' | 'critical'
  message: string
  createdAt: string
}

const alerts = ref<StockAlert[]>([])
const filters = ref({
  status: '',
  category: '',
  search: ''
})

const filteredAlerts = computed(() => {
  return alerts.value.filter(alert => {
    if (filters.value.status && alert.level !== filters.value.status) return false
    if (filters.value.search && !alert.productName.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    return true
  })
})

const getAlertBorderClass = (level: string) => {
  switch (level) {
    case 'critical': return 'border-red-500'
    case 'out': return 'border-orange-500'
    case 'low': return 'border-yellow-500'
    default: return 'border-gray-300'
  }
}

const getAlertBadgeClass = (level: string) => {
  switch (level) {
    case 'critical': return 'bg-red-100 text-red-800'
    case 'out': return 'bg-orange-100 text-orange-800'
    case 'low': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAlertLevelText = (level: string) => {
  switch (level) {
    case 'critical': return 'Critique'
    case 'out': return 'Rupture'
    case 'low': return 'Stock faible'
    default: return 'Inconnu'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const refreshAlerts = () => {
  // TODO: Implémenter le rafraîchissement des alertes
  console.log('Rafraîchissement des alertes...')
}

const updateStock = (alert: StockAlert) => {
  // TODO: Implémenter la mise à jour du stock
  console.log('Mise à jour du stock pour:', alert.productName)
}

const dismissAlert = (alertId: string) => {
  alerts.value = alerts.value.filter(alert => alert.id !== alertId)
}

onMounted(() => {
  // Données de test
  alerts.value = [
    {
      id: '1',
      productName: 'Tomates cerises',
      currentStock: 2,
      threshold: 10,
      level: 'low',
      message: 'Le stock est en dessous du seuil minimum',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      productName: 'Courgettes',
      currentStock: 0,
      threshold: 5,
      level: 'out',
      message: 'Produit en rupture de stock',
      createdAt: new Date().toISOString()
    }
  ]
})
</script>