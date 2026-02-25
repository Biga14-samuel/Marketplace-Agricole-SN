<template>
  <div class="home-view">
    <!-- Hero Section avec dégradé organique et texture -->
    <section class="hero relative bg-gradient-to-br from-green-50 via-gray-50 to-amber-50 text-gray-800 py-20">
      <!-- Texture filigrane en arrière-plan (non interactive) -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div
          class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDU1QzQzLjgwNzEgNTUgNTUgNDMuODA3MSA1NSAzMEM1NSAxNi4xOTI5IDQzLjgwNzEgNSAzMCA1QzE2LjE5MjkgNSA1IDE2LjE5MjkgNSAzMEM1IDQzLjgwNzEgMTYuMTkyOSA1NSAzMCA1NVoiIHN0cm9rZT0iIzE2YTM0MSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPHBhdGggZD0iTTMwIDQwQzM1LjUyMjggNDAgNDAgMzUuNTIyOCA0MCAzMEM0MCAyNC40NzcyIDM1LjUyMjggMjAgMzAgMjBDMjQuNDc3MiAyMCAyMCAyNC40NzcyIDIwIDMwQzIwIDM1LjUyMjggMjQuNDc3MiA0MCAzMCA0MFoiIHN0cm9rZT0iIzE2YTM0MSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+')] pointer-events-none">
        </div>
      </div>

      <!-- Éléments flottants subtils (décoratifs, non interactifs) -->
      <div
        class="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-r from-green-200 to-green-300 opacity-20 animate-float-slow pointer-events-none">
      </div>
      <div
        class="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 opacity-15 animate-float-medium pointer-events-none">
      </div>

      <div class="container relative mx-auto px-4 text-center z-10">
        <h1
          class="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-green-700 to-amber-800">
          Bienvenue sur MarketFraîche
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-700">
          Découvrez les meilleurs produits agricoles locaux directement des producteurs de votre région
        </p>
        <div class="space-x-4 space-y-4 md:space-y-0">
          <router-link to="/catalog"
            class="inline-block bg-gradient-to-r from-green-700 to-green-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 ease-out-expo text-lg">
            Découvrir les produits
          </router-link>
          <router-link to="/auth/register"
            class="inline-block bg-white/90 backdrop-blur-sm border-2 border-green-700 text-green-800 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-500 ease-out-expo text-lg">
            Devenir producteur
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-gradient-to-r from-green-800 to-green-900 text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="text-4xl md:text-5xl font-bold mb-2">300+</div>
            <div class="text-green-200">Producteurs locaux</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="text-4xl md:text-5xl font-bold mb-2">2 000+</div>
            <div class="text-green-200">Produits disponibles</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="text-4xl md:text-5xl font-bold mb-2">15 000+</div>
            <div class="text-green-200">Clients satisfaits</div>
          </div>
          <div class="animate-fade-in-up" style="animation-delay: 0.4s">
            <div class="text-4xl md:text-5xl font-bold mb-2">100%</div>
            <div class="text-green-200">Produits locaux</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section avec arrière-plan texturé -->
    <section class="py-16 bg-gradient-to-b from-white via-gray-50/30 to-amber-50/20">
      <div class="container mx-auto px-4">
        <h2
          class="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-700">
          Pourquoi choisir MarketFraîche ?
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 ease-out-expo border border-gray-200">
            <div
              class="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-500">
              <svg class="w-10 h-10 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Produits frais</h3>
            <p class="text-gray-600">Directement des producteurs locaux, récoltés à maturité</p>
          </div>
          <div
            class="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 ease-out-expo border border-gray-200">
            <div
              class="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-500">
              <svg class="w-10 h-10 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Circuit court</h3>
            <p class="text-gray-600">Réduisez votre empreinte carbone avec des produits locaux</p>
          </div>
          <div
            class="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 ease-out-expo border border-gray-200">
            <div
              class="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-500">
              <svg class="w-10 h-10 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                </path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Prix équitables</h3>
            <p class="text-gray-600">Soutenez les producteurs avec une rémunération juste</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Produits phares -->
    <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div class="container mx-auto px-4">
        <h2
          class="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-amber-800">
          Nos produits phares
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="product in featuredProducts" :key="product.id"
            class="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 ease-out-expo cursor-pointer border border-gray-200">
            <div
              class="bg-gradient-to-br from-green-100 to-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
              <div v-html="product.icon" class="w-8 h-8" style="color: #166534;"></div>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600">{{ product.description }}</p>
            <div class="mt-4 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              {{ product.region }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2
          class="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-700">
          Comment ça marche ?
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(step, index) in steps" :key="index" class="relative text-center">
            <div
              class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-full flex items-center justify-center font-bold text-xl z-10 border-2 border-white">
              {{ index + 1 }}
            </div>
            <div
              class="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8 pt-12 border-t-4 border-green-700 shadow-lg">
              <div
                class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <div v-html="step.icon" class="w-8 h-8" style="color: #166534;"></div>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-gray-800">{{ step.title }}</h3>
              <p class="text-gray-600">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section avec effet split screen virtuel -->
    <section class="py-16 bg-gradient-to-r from-gray-50/40 via-green-50/30 to-amber-50/40">
      <div class="container mx-auto px-4 text-center">
        <h2
          class="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-amber-800">
          Prêt à commencer ?
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez notre communauté de consommateurs et producteurs responsables au Cameroun
        </p>
        <div class="space-x-4 space-y-4 md:space-y-0">
          <router-link to="/auth/register"
            class="inline-block bg-gradient-to-r from-green-700 to-green-800 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-500 ease-out-expo border border-green-900">
            S'inscrire maintenant
          </router-link>
          <router-link to="/catalog"
            class="inline-block bg-white/90 backdrop-blur-sm border-2 border-green-700 text-green-800 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-500 ease-out-expo">
            Voir le catalogue
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Produits phares du Cameroun
const featuredProducts = ref([
  {
    id: 1,
    name: 'Plantain',
    description: 'Banane plantain fraîche',
    region: 'Ouest',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
      <path d="M12 2C10.5 2 9 3 9 5v1c0 1.5-.5 2-2 2H6c-1 0-2 1-2 2v8c0 1 1 2 2 2h1c1.5 0 2 .5 2 2v1c0 2 1.5 3 3 3s3-1 3-3v-1c0-1.5.5-2 2-2h1c1 0 2-1 2-2v-8c0-1-1-2-2-2h-1c-1.5 0-2-.5-2-2V5c0-2-1.5-3-3-3zm0 2c.5 0 1 .5 1 1v1c0 2 1 3 3 3h1v8h-1c-2 0-3 1-3 3v1c0 .5-.5 1-1 1s-1-.5-1-1v-1c0-2-1-3-3-3H6v-8h1c2 0 3-1 3-3V5c0-.5.5-1 1-1z"/>
    </svg>`
  },
  {
    id: 2,
    name: 'Cacao',
    description: 'Fèves de cacao premium',
    region: 'Sud',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="2"/>
      <circle cx="8" cy="10" r="1.5"/>
      <circle cx="16" cy="10" r="1.5"/>
      <circle cx="10" cy="15" r="1.5"/>
      <circle cx="14" cy="15" r="1.5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
    </svg>`
  },
  {
    id: 3,
    name: 'Café Arabica',
    description: 'Café de montagne',
    region: 'Ouest',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13h14M5 13c0 3.866 3.134 7 7 7s7-3.134 7-7M5 13V9a2 2 0 012-2h10a2 2 0 012 2v4M8 20h8"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9h2a2 2 0 012 2v1a2 2 0 01-2 2h-2"/>
    </svg>`
  },
  {
    id: 4,
    name: 'Huile de Palme',
    description: 'Huile rouge naturelle',
    region: 'Littoral',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2v20M12 2L8 6m4-4l4 4M12 22l-4-4m4 4l4-4"/>
      <ellipse cx="12" cy="12" rx="3" ry="8" stroke-width="1.5"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 8c-1-1-2-1-3 0M15 8c1-1 2-1 3 0M9 16c-1 1-2 1-3 0M15 16c1 1 2 1 3 0"/>
    </svg>`
  },
])

// Étapes du fonctionnement
const steps = ref([
  {
    title: 'Choisissez vos produits',
    description: 'Parcourez notre catalogue et sélectionnez les produits bios de votre région.',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>`
  },
  {
    title: 'Commandez en ligne',
    description: 'Validez votre panier en quelques clics. Livraison ou retrait chez le producteur.',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>`
  },
  {
    title: 'Recevez et dégustez',
    description: 'Profitez de produits ultra-frais livrés directement de la ferme à votre table.',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="100%" height="100%">
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>`
  }
])

// ⚠️ DEPRECATED: Anciens composants icônes (non utilisés)
// Conservés pour référence mais remplacés par du SVG inline
</script>

<style scoped>
.hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
}

/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatSlow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

@keyframes floatMedium {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animate-float-slow {
  animation: floatSlow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: floatMedium 6s ease-in-out infinite;
}

/* Courbe de bézier personnalisée pour fluidité organique */
.ease-out-expo {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}
</style>
