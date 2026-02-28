<template>
  <div class="product-detail-view">
    <div class="container mx-auto px-4 py-8">
      <nav class="mb-6 text-sm">
        <router-link to="/" class="text-green-600 hover:underline">Accueil</router-link>
        <span class="mx-2">/</span>
        <router-link to="/catalog" class="text-green-600 hover:underline">Catalogue</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-600">{{ product?.name || 'Produit' }}</span>
      </nav>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>

      <div v-else-if="product" class="grid md:grid-cols-2 gap-8">
        <div>
          <div class="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              :src="mainImage"
              :alt="product.name"
              class="w-full h-96 object-cover"
            >
          </div>
        </div>

        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.name }}</h1>

          <div class="flex items-center mb-4">
            <span class="text-3xl font-bold text-green-600">{{ formatCurrency(Number(product.price || 0)) }}</span>
            <span class="text-gray-600 ml-2">/ {{ unitLabel }}</span>
          </div>

          <div class="mb-6">
            <span
              v-if="stockQuantity > 0"
              class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              En stock ({{ stockQuantity }} disponibles)
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
                <p class="font-medium">{{ producerName }}</p>
                <p class="text-sm text-gray-600">{{ producerLocation }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center space-x-4">
              <label class="text-gray-700 font-medium">Quantite:</label>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="decrementQuantity"
                  class="px-4 py-2 hover:bg-gray-100"
                  :disabled="quantity <= minOrder"
                >
                  -
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  :min="minOrder"
                  :max="maxAllowedOrder"
                  class="w-20 text-center border-x border-gray-300 py-2"
                >
                <button
                  @click="incrementQuantity"
                  class="px-4 py-2 hover:bg-gray-100"
                  :disabled="quantity >= maxAllowedOrder"
                >
                  +
                </button>
              </div>
            </div>

            <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

            <button
              @click="addToCart"
              :disabled="stockQuantity === 0 || submitting"
              class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ stockQuantity > 0 ? (submitting ? 'Ajout...' : 'Ajouter au panier') : 'Produit indisponible' }}
            </button>

            <button
              @click="toggleWishlist"
              class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {{ isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600 mb-4">Produit non trouve</p>
        <router-link to="/catalog" class="text-green-600 hover:underline">
          Retour au catalogue
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../store/modules/product.store'
import { ordersService } from '@/modules/orders/services/orders.service'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const loading = ref(true)
const submitting = ref(false)
const quantity = ref(1)
const errorMessage = ref('')
const isInWishlist = ref(false)

const product = computed(() => productStore.completeProduct || productStore.currentProduct)

const stockQuantity = computed(() => Number(product.value?.stock_quantity ?? product.value?.stock ?? 0))
const minOrder = computed(() => Math.max(1, Number(product.value?.min_order ?? 1)))
const maxOrder = computed(() => Number(product.value?.max_order ?? stockQuantity.value))
const maxAllowedOrder = computed(() => Math.max(minOrder.value, Math.min(stockQuantity.value || minOrder.value, maxOrder.value || stockQuantity.value || minOrder.value)))
const unitLabel = computed(() => product.value?.unit?.name || product.value?.unit_name || 'unite')
const producerName = computed(() => product.value?.producer?.business_name || product.value?.producer_name || 'Producteur local')
const producerLocation = computed(() => product.value?.origin || product.value?.producer?.location || 'Cameroun')

const mainImage = computed(() => {
  const storeMain = productStore.currentProductImages?.find?.((img: any) => img?.is_main || img?.is_primary)?.url
  const firstStore = productStore.currentProductImages?.[0]?.url
  const inlinePrimary = product.value?.images?.find?.((img: any) => img?.is_main || img?.is_primary)?.url
  const inlineFirst = product.value?.images?.[0]?.url
  return storeMain || firstStore || inlinePrimary || inlineFirst || product.value?.image || ''
})

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(Number.isFinite(amount) ? amount : 0)

const normalizeQuantity = () => {
  if (!Number.isFinite(quantity.value)) {
    quantity.value = minOrder.value
    return
  }
  quantity.value = Math.max(minOrder.value, Math.min(quantity.value, maxAllowedOrder.value))
}

const incrementQuantity = () => {
  quantity.value = Math.min(maxAllowedOrder.value, quantity.value + 1)
}

const decrementQuantity = () => {
  quantity.value = Math.max(minOrder.value, quantity.value - 1)
}

const loadProduct = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const productId = String(route.params.id || '')
    if (!productId) {
      return
    }
    await productStore.getCompleteProduct(productId, true)
    quantity.value = minOrder.value
    normalizeQuantity()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Impossible de charger ce produit.'
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  if (!product.value?.id) {
    return
  }

  errorMessage.value = ''
  submitting.value = true

  try {
    await ordersService.addToCart({
      productId: String(product.value.id),
      quantity: quantity.value
    })
    await router.push('/cart')
  } catch (error: any) {
    errorMessage.value = error?.message || "Impossible d'ajouter le produit au panier."
  } finally {
    submitting.value = false
  }
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
}

watch([minOrder, maxAllowedOrder], normalizeQuantity)
watch(() => route.params.id, () => {
  loadProduct()
})

onMounted(loadProduct)
</script>

