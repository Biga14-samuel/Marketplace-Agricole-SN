<template>
  <div class="min-h-screen organic-bg relative overflow-hidden">
    <!-- Texture de feuilles en arrière-plan -->
    <div class="absolute inset-0 opacity-5 pointer-events-none">
      <div class="leaf-float absolute top-10 left-5 text-green-200 text-6xl">🍃</div>
      <div class="leaf-float absolute top-20 right-10 text-green-100 text-5xl" style="animation-delay: 2s;">🌿</div>
      <div class="leaf-float absolute bottom-20 left-10 text-green-300 text-4xl" style="animation-delay: 5s;">🍂</div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- En-tête avec animation d'entrée -->
      <div class="animate-slide-in-down transition-organic mb-10">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-4xl font-bold text-forest-green mb-2">Mouvements de Stock</h1>
            <p class="text-earth-brown/80 text-lg">Suivi en temps réel des entrées et sorties</p>
          </div>
          
          <!-- Boutons d'action -->
          <div class="flex space-x-4">
            <button 
              @click="openMovementModal('in')"
              class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2"
            >
              <span class="text-xl">📥</span>
              <span>Nouvelle Entrée</span>
            </button>
            
            <button 
              @click="openMovementModal('out')"
              class="px-6 py-3 bg-gradient-to-r from-secondary-orange to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2"
            >
              <span class="text-xl">📤</span>
              <span>Nouvelle Sortie</span>
            </button>
          </div>
        </div>

        <!-- Filtres avec effet organique -->
        <div class="organic-card-texture bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-green-100/50 shadow-sm animate-fade-in">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[250px]">
              <label class="block text-sm font-medium text-forest-green mb-2">Produit</label>
              <div class="relative">
                <input 
                  v-model="filters.product"
                  type="text" 
                  placeholder="Rechercher un produit..."
                  class="w-full px-4 py-3 pl-10 bg-white/70 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-organic"
                >
                <span class="absolute left-3 top-3.5 text-green-400">🔍</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-forest-green mb-2">Type</label>
              <select 
                v-model="filters.type"
                class="px-4 py-3 bg-white/70 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-organic appearance-none cursor-pointer"
              >
                <option value="">Tous les types</option>
                <option value="in">Entrées</option>
                <option value="out">Sorties</option>
                <option value="adjustment">Ajustements</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-forest-green mb-2">Période</label>
              <select 
                v-model="filters.period"
                class="px-4 py-3 bg-white/70 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-organic appearance-none cursor-pointer"
              >
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="all">Tout l'historique</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques en temps réel -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="organic-card-texture bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 animate-slide-in-up" style="animation-delay: 0.1s;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Total Entrées</p>
              <p class="text-3xl font-bold text-forest-green mt-2">{{ totalEntries }} unités</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span class="text-2xl text-green-600">📈</span>
            </div>
          </div>
        </div>
        
        <div class="organic-card-texture bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100 animate-slide-in-up" style="animation-delay: 0.2s;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-600 font-medium">Total Sorties</p>
              <p class="text-3xl font-bold text-earth-brown mt-2">{{ totalExits }} unités</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <span class="text-2xl text-orange-600">📉</span>
            </div>
          </div>
        </div>
        
        <div class="organic-card-texture bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 animate-slide-in-up" style="animation-delay: 0.3s;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Variation Nette</p>
              <p :class="['text-3xl font-bold mt-2', netVariation >= 0 ? 'text-green-600' : 'text-red-600']">
                {{ netVariation >= 0 ? '+' : '' }}{{ netVariation }} unités
              </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-2xl text-blue-600">⚖️</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des mouvements -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100/50 overflow-hidden shadow-sm animate-fade-in" style="animation-delay: 0.4s;">
        <!-- En-tête du tableau -->
        <div class="bg-gradient-to-r from-green-50 to-green-100/50 px-6 py-4 border-b border-green-100">
          <div class="grid grid-cols-12 gap-4 text-sm font-semibold text-forest-green">
            <div class="col-span-3">Produit</div>
            <div class="col-span-2">Type</div>
            <div class="col-span-2">Quantité</div>
            <div class="col-span-2">Date</div>
            <div class="col-span-3">Commentaire</div>
          </div>
        </div>

        <!-- Liste avec animation de scroll -->
        <div class="overflow-y-auto max-h-[500px] scroll-smooth">
          <div 
            v-for="(movement, index) in filteredMovements" 
            :key="movement.id"
            class="border-b border-green-50 hover:bg-green-50/50 transition-all duration-300 transition-organic"
            :class="{ 'bg-yellow-50/30': movement.highlight }"
          >
            <div class="px-6 py-4">
              <div class="grid grid-cols-12 gap-4 items-center">
                <!-- Colonne Produit -->
                <div class="col-span-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                         :class="movement.type === 'in' ? 'bg-green-100' : 'bg-orange-100'">
                      <span v-if="movement.productCategory === 'fruits'" class="text-lg">🍎</span>
                      <span v-else-if="movement.productCategory === 'legumes'" class="text-lg">🥕</span>
                      <span v-else class="text-lg">📦</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">{{ movement.productName }}</p>
                      <p class="text-sm text-gray-500">{{ movement.productCode }}</p>
                    </div>
                  </div>
                </div>

                <!-- Colonne Type -->
                <div class="col-span-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                        :class="movement.type === 'in' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : movement.type === 'out'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'">
                    <span class="w-2 h-2 rounded-full mr-2"
                          :class="movement.type === 'in' ? 'bg-green-500' : movement.type === 'out' ? 'bg-orange-500' : 'bg-blue-500'"></span>
                    {{ getMovementTypeLabel(movement.type) }}
                  </span>
                </div>

                <!-- Colonne Quantité -->
                <div class="col-span-2">
                  <p class="text-lg font-semibold" 
                     :class="movement.type === 'in' ? 'text-green-600' : 'text-orange-600'">
                    {{ movement.type === 'in' ? '+' : '-' }}{{ movement.quantity }}
                    <span class="text-sm font-normal text-gray-500">unités</span>
                  </p>
                  <p v-if="movement.previousStock !== undefined" class="text-xs text-gray-500">
                    Stock: {{ movement.previousStock }} → {{ movement.newStock }}
                  </p>
                </div>

                <!-- Colonne Date -->
                <div class="col-span-2">
                  <p class="font-medium text-gray-700">{{ formatDate(movement.date) }}</p>
                  <p class="text-sm text-gray-500">{{ formatTime(movement.date) }}</p>
                </div>

                <!-- Colonne Commentaire -->
                <div class="col-span-3">
                  <p class="text-gray-700">{{ movement.comment || '—' }}</p>
                  <div v-if="movement.user" class="flex items-center mt-1">
                    <div class="w-6 h-6 rounded-full bg-gradient-to-r from-primary-green to-green-600 flex items-center justify-center text-white text-xs">
                      {{ getUserInitials(movement.user) }}
                    </div>
                    <span class="ml-2 text-sm text-gray-500">{{ movement.user }}</span>
                  </div>
                </div>
              </div>

              <!-- Détails supplémentaires (expansible) -->
              <div v-if="movement.showDetails" class="mt-4 pt-4 border-t border-green-100 animate-fade-in">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-500">Emplacement:</p>
                    <p class="font-medium">{{ movement.location || 'Stock principal' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Fournisseur:</p>
                    <p class="font-medium">{{ movement.supplier || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Lot:</p>
                    <p class="font-medium">{{ movement.batch || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Date péremption:</p>
                    <p class="font-medium" :class="{ 'text-red-600': isExpiringSoon(movement.expirationDate) }">
                      {{ formatDate(movement.expirationDate) || '—' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pied du tableau -->
        <div class="bg-green-50/50 px-6 py-4 border-t border-green-100">
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-600">
              Affichage de {{ filteredMovements.length }} mouvements sur {{ movements.length }}
            </p>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-sm rounded-lg border border-green-200 hover:bg-green-100 transition-organic">
                ← Précédent
              </button>
              <button class="px-3 py-1 text-sm rounded-lg border border-green-200 hover:bg-green-100 transition-organic">
                Suivant →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aperçu en temps réel (mobile) -->
      <div class="mt-8 md:hidden">
        <div class="bg-gradient-to-r from-primary-green/10 to-green-100/30 rounded-2xl p-6 border border-primary-green/20">
          <h3 class="font-semibold text-forest-green mb-3">📱 Vue Mobile</h3>
          <div class="space-y-3">
            <div v-for="movement in recentMovements.slice(0, 3)" :key="'mobile-' + movement.id"
                 class="bg-white/70 rounded-xl p-3 border border-green-100">
              <div class="flex justify-between items-center">
                <span class="font-medium text-sm">{{ movement.productName }}</span>
                <span :class="['text-sm font-bold', movement.type === 'in' ? 'text-green-600' : 'text-orange-600']">
                  {{ movement.type === 'in' ? '+' : '-' }}{{ movement.quantity }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(movement.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockMovementList',
  data() {
    return {
      filters: {
        product: '',
        type: '',
        period: '7days'
      },
      movements: [
        {
          id: 1,
          productName: 'Pommes Golden Bio',
          productCode: 'POM-BIO-001',
          productCategory: 'fruits',
          type: 'in',
          quantity: 150,
          date: '2024-01-15T09:30:00',
          previousStock: 350,
          newStock: 500,
          comment: 'Livraison hebdomadaire - Producteur local',
          user: 'Jean Martin',
          location: 'Chambre froide A',
          supplier: 'Ferme du Verger Bio',
          batch: 'LOT-2024-01',
          expirationDate: '2024-02-28',
          highlight: true
        },
        {
          id: 2,
          productName: 'Carottes Nouvelles',
          productCode: 'CAR-NEW-002',
          productCategory: 'legumes',
          type: 'out',
          quantity: 75,
          date: '2024-01-15T14:20:00',
          previousStock: 200,
          newStock: 125,
          comment: 'Commande restaurant "Le Terroir"',
          user: 'Marie Dubois',
          location: 'Rayon légumes',
          supplier: null,
          batch: 'LOT-2024-02',
          expirationDate: '2024-01-30'
        },
        {
          id: 3,
          productName: 'Salade Batavia',
          productCode: 'SAL-BAT-003',
          productCategory: 'legumes',
          type: 'in',
          quantity: 200,
          date: '2024-01-14T11:15:00',
          previousStock: 100,
          newStock: 300,
          comment: 'Récolte du matin',
          user: 'Pierre Lefevre',
          location: 'Chambre froide B',
          supplier: 'Maraîchage Bio Direct',
          batch: 'LOT-2024-03',
          expirationDate: '2024-01-20'
        },
        {
          id: 4,
          productName: 'Tomates Cerises',
          productCode: 'TOM-CER-004',
          productCategory: 'fruits',
          type: 'adjustment',
          quantity: -10,
          date: '2024-01-14T16:45:00',
          previousStock: 180,
          newStock: 170,
          comment: 'Ajustement - Produits abîmés',
          user: 'Sophie Bernard',
          location: 'Rayon fruits',
          supplier: null,
          batch: 'LOT-2024-01',
          expirationDate: '2024-01-25'
        },
        {
          id: 5,
          productName: 'Oignons Jaunes',
          productCode: 'OIG-JAU-005',
          productCategory: 'legumes',
          type: 'out',
          quantity: 50,
          date: '2024-01-13T10:30:00',
          previousStock: 300,
          newStock: 250,
          comment: 'Commande traiteur',
          user: 'Thomas Leroy',
          location: 'Réserve sèche',
          supplier: null,
          batch: 'LOT-2023-12',
          expirationDate: '2024-03-15'
        }
      ]
    }
  },
  computed: {
    filteredMovements() {
      return this.movements.filter(movement => {
        const matchesProduct = !this.filters.product || 
          movement.productName.toLowerCase().includes(this.filters.product.toLowerCase()) ||
          movement.productCode.toLowerCase().includes(this.filters.product.toLowerCase())
        
        const matchesType = !this.filters.type || movement.type === this.filters.type
        
        // Filtre par période (simplifié)
        const movementDate = new Date(movement.date)
        const now = new Date()
        let periodStart = new Date()
        
        switch(this.filters.period) {
          case '7days':
            periodStart.setDate(now.getDate() - 7)
            break
          case '30days':
            periodStart.setDate(now.getDate() - 30)
            break
          default:
            periodStart = new Date(0) // Date très ancienne pour "all"
        }
        
        const matchesPeriod = movementDate >= periodStart
        
        return matchesProduct && matchesType && matchesPeriod
      })
    },
    totalEntries() {
      return this.filteredMovements
        .filter(m => m.type === 'in')
        .reduce((sum, m) => sum + m.quantity, 0)
    },
    totalExits() {
      return this.filteredMovements
        .filter(m => m.type === 'out')
        .reduce((sum, m) => sum + m.quantity, 0)
    },
    netVariation() {
      return this.totalEntries - this.totalExits
    },
    recentMovements() {
      return [...this.movements]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    }
  },
  methods: {
    getMovementTypeLabel(type) {
      const labels = {
        'in': 'Entrée Stock',
        'out': 'Sortie Stock',
        'adjustment': 'Ajustement'
      }
      return labels[type] || type
    },
    formatDate(dateString) {
      if (!dateString) return '—'
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    formatTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getUserInitials(name) {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    isExpiringSoon(expirationDate) {
      if (!expirationDate) return false
      const expDate = new Date(expirationDate)
      const today = new Date()
      const diffTime = expDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 3 && diffDays >= 0
    },
    openMovementModal(type) {
      // Logique pour ouvrir un modal de création de mouvement
      console.log(`Ouverture modal pour mouvement: ${type}`)
    }
  }
}
</script>

<style scoped>
/* Couleurs personnalisées en accord avec l'identité visuelle */
:root {
  --primary-green: #45a348;
  --secondary-orange: #ff8c42;
  --forest-green: #2d5016;
  --earth-brown: #8b4513;
}

.bg-primary-green {
  background-color: var(--primary-green);
}

.from-primary-green {
  --tw-gradient-from: var(--primary-green);
}

.to-green-600 {
  --tw-gradient-to: #16a34a;
}

.text-forest-green {
  color: var(--forest-green);
}

.text-earth-brown {
  color: var(--earth-brown);
}

/* Animation d'apparition personnalisée pour les lignes */
@keyframes row-appear {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-row-appear {
  animation: row-appear 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Dégradé organique pour le fond */
.organic-bg {
  background: linear-gradient(135deg, 
    rgba(69, 163, 72, 0.05) 0%,
    rgba(255, 255, 255, 0.9) 20%,
    rgba(255, 255, 255, 0.9) 80%,
    rgba(255, 140, 66, 0.05) 100%
  );
  position: relative;
}

.organic-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(69, 163, 72, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 140, 66, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

/* Animation pour les bordures des cartes */
.organic-card {
  position: relative;
  border: 1px solid transparent;
  background-clip: padding-box;
}

.organic-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(45deg, 
    var(--primary-green) 0%, 
    transparent 50%, 
    var(--secondary-orange) 100%);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.3;
  pointer-events: none;
}
</style>
