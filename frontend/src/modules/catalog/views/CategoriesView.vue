<template>
  <div class="min-h-screen relative overflow-hidden categories-view">
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-forest-green/12 via-cream-light/20 to-terracotta/12"></div>
      <div class="absolute inset-0 categories-texture"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-10">
      <header class="mb-10 animate-enter">
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green">Catégories</h1>
        <p class="text-nature-gray mt-2">Des univers gourmands pour des choix rapides et inspirés.</p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(category, index) in categories"
          :key="category.id"
          class="category-card"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <h3 class="text-xl font-semibold text-forest-green">{{ category.name }}</h3>
          <p class="text-sm text-nature-gray">{{ category.description }}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="tag-pill">{{ category.badge }}</span>
            <router-link
              :to="`/catalog/categories/${category.slug}`"
              class="text-forest-green hover:text-terracotta transition-organic"
            >
              Voir →
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCategoryStore } from '../store/modules/category.store'

const categoryStore = useCategoryStore()

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const fallbackIcons = ['🥕', '🍓', '🧺', '🌽', '🍠', '🫛', '🍯', '🐟', '🥜', '🌿']

const categories = computed(() =>
  categoryStore.allCategories
    .filter((item: any) => item?.is_active !== false)
    .map((item: any, index: number) => ({
      id: item.id,
      name: item.name,
      description: item.description || 'Produits frais directement des producteurs locaux.',
      badge: `${Number(item.product_count || 0)} produit(s)`,
      icon: item.icon || fallbackIcons[index % fallbackIcons.length],
      slug: item.slug || slugify(item.name || '') || String(item.id)
    }))
)

onMounted(async () => {
  await categoryStore.fetchAllCategories(true)
})
</script>

<style scoped>
.categories-view {
  background: linear-gradient(135deg, rgba(233, 249, 240, 0.95), rgba(255, 246, 235, 0.92));
}

.categories-texture {
  background-image: radial-gradient(circle at 20% 20%, rgba(69, 163, 72, 0.07), transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(226, 114, 91, 0.06), transparent 50%);
}

.animate-enter {
  animation: fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.category-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(34, 139, 34, 0.1);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 42px rgba(34, 139, 34, 0.15);
}

.category-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(69, 163, 72, 0.2), rgba(226, 114, 91, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 14px;
}

.tag-pill {
  background: rgba(69, 163, 72, 0.12);
  color: #2d5016;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.text-forest-green { color: #2d5016; }
.text-nature-gray { color: #6b6b6b; }
.transition-organic { transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>

