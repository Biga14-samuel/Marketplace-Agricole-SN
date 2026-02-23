<template>
  <div class="min-h-screen relative overflow-hidden category-detail">
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-forest-green/10 via-cream-light/15 to-terracotta/12"></div>
      <div class="absolute inset-0 detail-texture"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <div class="mb-8 animate-enter">
        <router-link to="/catalog/categories" class="text-forest-green hover:text-terracotta transition-organic">← Retour aux catégories</router-link>
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green mt-4">{{ category.name }}</h1>
        <p class="text-nature-gray mt-2 max-w-2xl">{{ category.description }}</p>
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

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(item, index) in category.products"
          :key="item.id"
          class="product-card"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <img :src="item.image" :alt="item.name" class="product-image" />
          <div class="product-body">
            <h3 class="text-xl font-semibold text-forest-green">{{ item.name }}</h3>
            <p class="text-sm text-nature-gray">{{ item.origin }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="price">{{ item.price }} €</span>
              <button class="btn-outline">Ajouter</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryDetailView',
  computed: {
    category() {
      const slug = this.$route.params.slug
      const categories = {
        'fruits-frais': {
          name: 'Fruits frais',
          description: 'Des fruits locaux, cueillis à maturité pour un goût incomparable.',
          products: [
            {
              id: 1,
              name: 'Pommes golden',
              origin: 'Verger du Matin · 6km',
              price: 3.2,
              image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80'
            },
            {
              id: 2,
              name: 'Poires williams',
              origin: 'Verger du Matin · 6km',
              price: 3.8,
              image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
            }
          ]
        },
        'legumes-gourmands': {
          name: 'Légumes gourmands',
          description: 'Une sélection de légumes de saison pour des recettes équilibrées.',
          products: [
            {
              id: 3,
              name: 'Carottes nouvelles',
              origin: 'Jardin des Sources · 5km',
              price: 2.4,
              image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=900&q=80'
            },
            {
              id: 4,
              name: 'Courgettes vertes',
              origin: 'Jardin des Sources · 5km',
              price: 2.9,
              image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80'
            }
          ]
        },
        'epicerie-artisanale': {
          name: 'Épicerie artisanale',
          description: 'Des produits raffinés et faits main pour sublimer vos plats.',
          products: [
            {
              id: 5,
              name: 'Huile d\'olive premium',
              origin: 'Maison du Soleil · 30km',
              price: 9.6,
              image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80'
            },
            {
              id: 6,
              name: 'Miel de fleurs',
              origin: 'Rucher des Collines · 22km',
              price: 7.1,
              image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=80'
            }
          ]
        }
      }

      return categories[slug] || {
        name: 'Catégorie gourmande',
        description: 'Découvrez des produits sélectionnés avec soin pour votre table.',
        products: []
      }
    },
    stats() {
      return [
        { label: 'Produits', value: this.category.products.length || 12, icon: '🧺' },
        { label: 'Producteurs', value: 8, icon: '👩‍🌾' },
        { label: 'Note moyenne', value: '4.8', icon: '⭐' }
      ]
    }
  }
}
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
  border-color: rgba(226, 114, 91, 0.5);
  box-shadow: 0 10px 24px rgba(226, 114, 91, 0.2);
}

.text-forest-green { color: #2d5016; }
.text-nature-gray { color: #6b6b6b; }
.transition-organic { transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>
