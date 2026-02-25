<template>
  <div class="products-view">
    <div class="products-header">
      <h1>Produits Frais Disponibles</h1>
      <p class="subtitle">Découvrez les produits locaux de nos producteurs camerounais</p>
    </div>

    <!-- Filtres -->
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un produit..."
          @input="handleSearch"
        />
      </div>

      <div class="filter-chips">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['filter-chip', { active: selectedCategory === category.id }]"
          @click="filterByCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Liste des produits -->
    <div v-if="loading" class="loading">
      <p>Chargement des produits...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="products-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        @click="goToProduct(product.id)"
      >
        <div class="product-image">
          <img
            :src="product.images?.[0]?.url || '/images/placeholder.jpg'"
            :alt="product.name"
          />
          <span v-if="product.tags?.includes('bio')" class="badge bio">Bio</span>
          <span v-if="product.tags?.includes('local')" class="badge local">Local</span>
        </div>

        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="producer">{{ product.producer_name }}</p>
          <p class="description">{{ product.description }}</p>

          <div class="product-footer">
            <div class="price">
              <span class="amount">{{ formatPrice(product.price) }}</span>
              <span class="unit">/ {{ product.unit }}</span>
            </div>

            <div class="stock">
              <span v-if="product.stock_quantity > 0" class="in-stock">
                {{ product.stock_quantity }} disponible(s)
              </span>
              <span v-else class="out-of-stock">Rupture de stock</span>
            </div>
          </div>

          <button
            v-if="product.stock_quantity > 0"
            class="btn-reserve"
            @click.stop="reserveProduct(product)"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && filteredProducts.length === 0" class="no-products">
      <p>Aucun produit disponible pour le moment</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../store/modules/product.store'
import { useCategoryStore } from '../store/modules/category.store'

const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const products = computed(() => productStore.products)
const categories = computed(() => categoryStore.categories)

const filteredProducts = computed(() => {
  let result = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    result = result.filter((p) => p.category_id === selectedCategory.value)
  }

  return result
})

const handleSearch = () => {
  // La recherche est réactive via computed
}

const filterByCategory = (categoryId: string) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
}

const goToProduct = (productId: string) => {
  router.push({ name: 'catalog-product-detail', params: { id: productId } })
}

const reserveProduct = (product: any) => {
  // TODO: Implémenter la logique de réservation
  console.log('Réserver:', product)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF'
  }).format(price)
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      productStore.searchProducts(),
      categoryStore.fetchAllCategories()
    ])
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des produits'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.products-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.products-header {
  text-align: center;
  margin-bottom: 2rem;
}

.products-header h1 {
  font-size: 2rem;
  color: #2c5f2d;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.filters-section {
  margin-bottom: 2rem;
}

.search-box {
  margin-bottom: 1rem;
}

.search-box input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-chip:hover {
  border-color: #2c5f2d;
  color: #2c5f2d;
}

.filter-chip.active {
  background: #2c5f2d;
  color: white;
  border-color: #2c5f2d;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.badge.bio {
  background: #4caf50;
  color: white;
}

.badge.local {
  background: #ff9800;
  color: white;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.producer {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.price {
  font-weight: bold;
}

.price .amount {
  font-size: 1.25rem;
  color: #2c5f2d;
}

.price .unit {
  font-size: 0.85rem;
  color: #666;
}

.stock .in-stock {
  color: #4caf50;
  font-size: 0.85rem;
}

.stock .out-of-stock {
  color: #f44336;
  font-size: 0.85rem;
}

.btn-reserve {
  width: 100%;
  padding: 0.75rem;
  background: #2c5f2d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-reserve:hover {
  background: #1e4620;
}

.loading,
.error,
.no-products {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #f44336;
}
</style>

