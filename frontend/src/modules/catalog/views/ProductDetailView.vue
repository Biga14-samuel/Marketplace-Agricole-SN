<template>
  <div class="product-detail-view">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-6 text-sm">
        <router-link to="/" class="text-green-600 hover:underline">Accueil</router-link>
        <span class="mx-2">/</span>
        <router-link to="/catalog" class="text-green-600 hover:underline">Catalogue</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-600">{{ product?.name || 'Produit' }}</span>
      </nav>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="grid md:grid-cols-2 gap-8">
        <!-- Images -->
        <div>
          <div class="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              :src="product.image || '/placeholder-product.jpg'" 
              :alt="product.name"
              class="w-full h-96 object-cover"
            >
          </div>
        </div>

        <!-- Info -->
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.name }}</h1>
          
          <div class="flex items-center mb-4">
            <span class="text-3xl font-bold text-green-600">{{ product.price }}€</span>
            <span class="text-gray-600 ml-2">/ {{ product.unit }}</span>
          </div>

          <div class="mb-6">
            <span 
              v-if="product.stock > 0"
              class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              En stock ({{ product.stock }} disponibles)
            </span>
            <span 
              v-else
              class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              Rupture de stock
            </span>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2">Description</h3>
            <p class="text-gray-600">{{ product.description || 'Aucune description disponible' }}</p>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2">Producteur</h3>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
              <div>
                <p class="font-medium">{{ product.producer?.name || 'Producteur local' }}</p>
                <p class="text-sm text-gray-600">{{ product.producer?.location || 'France' }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <div class="flex items-center space-x-4">
              <label class="text-gray-700 font-medium">Quantité:</label>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button 
                  @click="decrementQuantity"
                  class="px-4 py-2 hover:bg-gray-100"
                  :disabled="quantity <= 1"
                >
                  -
                </button>
                <input 
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="w-16 text-center border-x border-gray-300 py-2"
                >
                <button 
                  @click="incrementQuantity"
                  class="px-4 py-2 hover:bg-gray-100"
                  :disabled="quantity >= product.stock"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              @click="addToCart"
              :disabled="product.stock === 0"
              class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible' }}
            </button>

            <button 
              @click="toggleWishlist"
              class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {{ isInWishlist ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 mb-4">Produit non trouvé</p>
        <router-link to="/catalog" class="text-green-600 hover:underline">
          Retour au catalogue
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const product = ref<any>(null)
const quantity = ref(1)
const isInWishlist = ref(false)

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  console.log('Ajout au panier:', product.value?.name, 'x', quantity.value)
  // TODO: Implémenter l'ajout au panier
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  console.log('Wishlist toggled:', isInWishlist.value)
}

onMounted(async () => {
  // Simuler le chargement du produit
  setTimeout(() => {
    product.value = {
      id: route.params.id,
      name: 'Tomates cerises bio',
      price: 4.50,
      unit: 'kg',
      stock: 15,
      description: 'Tomates cerises biologiques cultivées localement. Sucrées et juteuses, parfaites pour vos salades.',
      image: '/images/tomates.jpg',
      producer: {
        name: 'Ferme du Soleil',
        location: 'Provence, France'
      }
    }
    loading.value = false
  }, 500)
})
</script>