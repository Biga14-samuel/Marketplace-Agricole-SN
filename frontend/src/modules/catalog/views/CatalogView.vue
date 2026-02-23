<template>
  <div class="min-h-screen relative overflow-hidden catalog-landing">
    <!-- Fond organique -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-forest-green/10 via-cream-light/20 to-terracotta/10"></div>
      <div class="absolute inset-0 texture-overlay"></div>
      <div class="absolute inset-0 subtle-grid"></div>
    </div>

    <!-- Éléments flottants -->
    <div class="absolute inset-0 pointer-events-none">
      <span class="float-leaf leaf-1">🍃</span>
      <span class="float-leaf leaf-2">🌿</span>
      <span class="float-leaf leaf-3">🍂</span>
      <span class="float-leaf leaf-4">🌱</span>
    </div>

    <div class="relative z-10">
      <!-- Hero -->
      <section class="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div class="animate-enter">
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/70 border border-forest-green/20 text-forest-green text-sm mb-6">
              🌟 Fraîcheur, Proximité &amp; Confiance
            </div>
            <h1 class="text-4xl md:text-6xl font-serif font-bold text-forest-green leading-tight">
              Le marché frais, directement des producteurs
            </h1>
            <p class="mt-5 text-lg text-nature-gray max-w-xl">
              Des produits de saison, une traçabilité claire, et un parcours simple pour faire vos courses en toute sérénité.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <router-link
                to="/catalog/products"
                class="btn-primary"
              >
                Découvrir le catalogue
              </router-link>
              <router-link
                to="/auth/login"
                class="btn-secondary"
              >
                Mon Espace
              </router-link>
            </div>
          </div>

          <div class="animate-enter delay-1">
            <div class="hero-card">
              <div class="hero-badge">🌿 Bio &amp; Local</div>
              <img
                class="hero-image"
                src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&amp;fit=crop&amp;w=1200&amp;q=80"
                alt="Produits frais"
              />
              <div class="hero-overlay"></div>
              <div class="hero-caption">
                <h3 class="text-xl font-semibold text-forest-green">Panier de saison</h3>
                <p class="text-sm text-nature-gray">Sélection artisanale, livrée près de chez vous.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Réassurance -->
      <section class="max-w-6xl mx-auto px-6 pb-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="item in assurances" :key="item.title" class="info-card">
            <div class="info-icon">{{ item.icon }}</div>
            <h3 class="text-lg font-semibold text-forest-green">{{ item.title }}</h3>
            <p class="text-sm text-nature-gray">{{ item.text }}</p>
          </div>
        </div>
      </section>

      <!-- Catégories phares -->
      <section class="max-w-7xl mx-auto px-6 pb-16">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-3xl font-serif font-bold text-forest-green">Univers gourmands</h2>
            <p class="text-nature-gray">Explorez nos catégories les plus appréciées.</p>
          </div>
          <router-link to="/catalog/categories" class="text-forest-green hover:text-terracotta transition-organic">
            Tout voir →
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(cat, index) in categories"
            :key="cat.id"
            class="category-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="category-icon">{{ cat.icon }}</div>
            <h3 class="text-xl font-semibold text-forest-green">{{ cat.name }}</h3>
            <p class="text-sm text-nature-gray">{{ cat.description }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="tag-pill">{{ cat.badge }}</span>
              <router-link
                :to="`/catalog/categories/${cat.slug}`"
                class="text-forest-green hover:text-terracotta transition-organic"
              >
                Explorer →
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogView',
  data() {
    return {
      assurances: [
        {
          icon: '🥬',
          title: 'Ultra frais',
          text: 'Récolté au plus proche de la livraison pour préserver goût et nutriments.'
        },
        {
          icon: '📍',
          title: '100% local',
          text: 'Des producteurs de votre région avec une transparence totale.'
        },
        {
          icon: '🤝',
          title: 'Confiance totale',
          text: 'Paiement sécurisé, qualité contrôlée et service réactif.'
        }
      ],
      categories: [
        {
          id: 1,
          name: 'Fruits & Légumes',
          description: 'Couleurs de saison, cueillis à maturité.',
          badge: 'Bio certifié',
          icon: '🍎',
          slug: 'fruits-legumes'
        },
        {
          id: 2,
          name: 'Épicerie fine',
          description: 'Miels, huiles, épices et créations artisanales.',
          badge: 'Artisanal',
          icon: '🍯',
          slug: 'epicerie-fine'
        },
        {
          id: 3,
          name: 'Produits laitiers',
          description: 'Fromages fermiers et lait frais.',
          badge: 'Fermier',
          icon: '🍶',
          slug: 'produits-laitiers'
        }
      ]
    }
  }
}
</script>

<style scoped>
.catalog-landing {
  background: linear-gradient(135deg, rgba(233, 250, 238, 0.9), rgba(255, 248, 235, 0.9));
}

.texture-overlay {
  background-image: url("data:image/svg+xml,%3Csvg width='140' height='140' viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 20c8 0 14 6 14 14s-6 14-14 14-14-6-14-14 6-14 14-14zm70 40c10 0 18 8 18 18s-8 18-18 18-18-8-18-18 8-18 18-18z' fill='%2345a348' fill-opacity='0.04'/%3E%3Cpath d='M10 120c20-30 50-40 90-30' stroke='%23E2725B' stroke-opacity='0.05' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  opacity: 0.5;
}

.subtle-grid {
  background-image: radial-gradient(circle at 1px 1px, rgba(34, 139, 34, 0.05) 1px, transparent 0);
  background-size: 36px 36px;
  opacity: 0.2;
}

.float-leaf {
  position: absolute;
  font-size: 2.2rem;
  opacity: 0.2;
  animation: floatLeaf 18s infinite linear;
}

.leaf-1 { top: 10%; left: 5%; animation-duration: 22s; }
.leaf-2 { top: 30%; right: 10%; animation-duration: 19s; }
.leaf-3 { bottom: 20%; left: 15%; animation-duration: 24s; }
.leaf-4 { bottom: 8%; right: 20%; animation-duration: 20s; }

@keyframes floatLeaf {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(10deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.animate-enter {
  animation: fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.delay-1 { animation-delay: 0.15s; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(34, 139, 34, 0.15);
  background: white;
}

.hero-image {
  width: 100%;
  height: 360px;
  object-fit: cover;
  display: block;
  transform: scale(1.02);
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-card:hover .hero-image {
  transform: scale(1.08);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(34, 139, 34, 0.08), rgba(226, 114, 91, 0.12));
}

.hero-caption {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 18px;
  padding: 16px;
  backdrop-filter: blur(8px);
}

.hero-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(34, 139, 34, 0.2);
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  color: #2d5016;
  z-index: 2;
}

.btn-primary,
.btn-secondary {
  padding: 14px 24px;
  border-radius: 999px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(90deg, #45a348, #2d8a3c);
  color: white;
  box-shadow: 0 14px 30px rgba(69, 163, 72, 0.25);
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 18px 40px rgba(69, 163, 72, 0.35);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.8);
  color: #2d5016;
  border: 1px solid rgba(45, 80, 22, 0.2);
}

.btn-secondary:hover {
  transform: scale(1.04);
  border-color: rgba(226, 114, 91, 0.35);
  color: #e2725b;
}

.info-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(34, 139, 34, 0.1);
  border-radius: 22px;
  padding: 20px;
  display: grid;
  gap: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.info-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(34, 139, 34, 0.12);
}

.info-icon {
  font-size: 2rem;
}

.category-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(34, 139, 34, 0.08);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 22px 40px rgba(45, 80, 22, 0.18);
}

.category-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(69, 163, 72, 0.2), rgba(226, 114, 91, 0.15));
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

.transition-organic {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
