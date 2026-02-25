<template>
  <div class="min-h-screen relative overflow-hidden category-detail">
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-forest-green/10 via-cream-light/15 to-terracotta/12"></div>
      <div class="absolute inset-0 detail-texture"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <div class="mb-8 animate-enter">
        <router-link to="/catalog/categories" class="text-forest-green hover:text-terracotta transition-organic">
          ← Retour aux categories
        </router-link>
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green mt-4">{{ category?.name || 'Categorie' }}</h1>
        <p class="text-nature-gray mt-2 max-w-2xl">
          {{ category?.description || 'Decouvrez les produits disponibles dans cette categorie.' }}
        </p>
      </div>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div>
            <p class="text-sm text-nature-gray">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-forest-green">{{ stat.value }}</p>
          </div>
        </div>
      </section>

      <div v-if="loading" class="py-12 text-center text-nature-gray">Chargement...</div>

      <div v-else-if="!category" class="py-12 text-center text-nature-gray">
        Categorie introuvable.
      </div>

      <section v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="(item, index) in products"
          :key="item.id"
          class="product-card"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <img :src="item.image || ''" :alt="item.name" class="product-image" />
          <div class="product-body">
            <h3 class="text-xl font-semibold text-forest-green">{{ item.name }}</h3>
            <p class="text-sm text-nature-gray">{{ item.origin || 'Cameroun' }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="price">{{ formatCurrency(item.price) }}</span>
              <router-link :to="`/catalog/products/${item.id}`" class="btn-outline">Voir</router-link>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="py-12 text-center text-nature-gray">
        Aucun produit actif pour cette categorie.
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoryStore } from '../store/modules/category.store'
import { useProductStore } from '../store/modules/product.store'

const route = useRoute()
const categoryStore = useCategoryStore()
const productStore = useProductStore()

const loading = ref(true)
const category = ref<any | null>(null)
const products = ref<any[]>([])

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(Number.isFinite(amount) ? amount : 0)

const loadCategoryDetail = async () => {
  loading.value = true
  category.value = null
  products.value = []

  try {
    await categoryStore.fetchAllCategories(true)

    const slugParam = String(route.params.slug || '').toLowerCase()
    const foundCategory = categoryStore.allCategories.find((item: any) =>
      item.id === slugParam || slugify(item.name || '') === slugParam
    )

    category.value = foundCategory || null

    if (!foundCategory?.id) {
      return
    }

    const response = await productStore.searchProducts({
      category_id: foundCategory.id,
      page: 1,
      limit: 24,
      sort_by: 'created_at',
      sort_order: 'desc'
    })

    products.value = (response?.products || []).filter((item: any) => item?.is_active !== false)
  } catch {
    category.value = null
    products.value = []
  } finally {
    loading.value = false
  }
}

const stats = computed(() => {
  const producerCount = new Set(
    products.value
      .map((item: any) => item.producer_id || item.producer?.id)
      .filter(Boolean)
  ).size

  const averagePrice = products.value.length
    ? Math.round(
      products.value.reduce((total: number, item: any) => total + Number(item.price || 0), 0) /
          products.value.length
    )
    : 0

  return [
    { label: 'Produits', value: products.value.length, icon: '🧺' },
    { label: 'Producteurs', value: producerCount, icon: '👩‍🌾' },
    { label: 'Prix moyen', value: formatCurrency(averagePrice), icon: '💰' }
  ]
})

watch(() => route.params.slug, loadCategoryDetail)
onMounted(loadCategoryDetail)
</script>

<style scoped>
.category-detail {
  background: linear-gradient(135deg, rgba(233, 249, 240, 0.95), rgba(255, 246, 235, 0.9));
}

.detail-texture {
  background-image: radial-gradient(circle at 20% 30%, rgba(69, 163, 72, 0.06), transparent 55%),
    radial-gradient(circle at 70% 80%, rgba(226, 114, 91, 0.06), transparent 50%);
}

.animate-enter {
  animation: fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 18px;
  border: 1px solid rgba(34, 139, 34, 0.1);
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 34px rgba(34, 139, 34, 0.12);
}

.stat-icon {
  font-size: 1.8rem;
}

.product-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(34, 139, 34, 0.1);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 42px rgba(34, 139, 34, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-card:hover .product-image {
  transform: scale(1.06);
}

.product-body {
  padding: 20px;
}

.price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d5016;
}

.btn-outline {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(226, 114, 91, 0.3);
  color: #e2725b;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-outline:hover {
  transform: scale(1.05);
}
</style>

