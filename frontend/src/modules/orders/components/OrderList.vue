<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Arrière-plan organique -->
    <div class="fixed inset-0 z-0">
      <!-- Dégradé naturel -->
      <div class="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-cream-light to-clay-light/10"></div>
      
      <!-- Texture filigrane -->
      <div class="absolute inset-0 opacity-[0.015]">
        <div class="absolute inset-0 bg-pattern-dots"></div>
      </div>
      
      <!-- Animation d'ambiance subtile -->
      <div class="absolute top-10 left-10 w-40 h-40 animate-float-slow">
        <div class="w-full h-full opacity-10">
          <svg class="w-full h-full text-forest-green" viewBox="0 0 100 100">
            <path d="M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10 Z" 
                  fill="currentColor" fill-rule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête -->
      <div class="mb-12 text-center animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-4">
          Mes Commandes
        </h1>
        <p class="text-nature-gray text-lg max-w-2xl mx-auto">
          Retrouvez l'historique de tous vos achats chez nos producteurs locaux
        </p>
      </div>

      <!-- Filtres -->
      <div class="mb-8 animate-fade-in-up" style="animation-delay: 100ms">
        <div class="flex flex-wrap gap-3 justify-center">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-6 py-3 rounded-full transition-all duration-500',
              activeFilter === filter.id 
                ? 'bg-soft-green text-white shadow-lg transform scale-105' 
                : 'bg-white/70 text-nature-gray hover:bg-white/90 hover:shadow-md'
            ]"
            :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Liste des commandes -->
      <div class="space-y-6">
        <transition-group 
          name="staggered-fade" 
          tag="div"
          class="space-y-6"
          @before-enter="beforeStaggerEnter"
          @enter="staggerEnter"
        >
          <!-- Carte de commande -->
          <div 
            v-for="(order, index) in filteredOrders" 
            :key="order.id"
            :data-index="index"
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-cream-light/30 group"
            :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
          >
            <div class="p-6 md:p-8">
              <!-- En-tête de commande -->
              <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-xl font-semibold text-forest-green">
                      Commande #{{ order.id }}
                    </h3>
                    <span :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      getStatusClass(order.status)
                    ]">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                  <p class="text-nature-gray">
                    <span class="font-medium">Passée le :</span> {{ formatDate(order.date) }}
                  </p>
                </div>
                
                <div class="mt-4 md:mt-0">
                  <div class="text-2xl font-bold text-forest-green">
                    {{ order.total }} €
                  </div>
                  <p class="text-sm text-nature-gray mt-1">
                    {{ order.items.length }} produit{{ order.items.length > 1 ? 's' : '' }}
                  </p>
                </div>
              </div>

              <!-- Séparateur organique -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-cream-light"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="px-4 bg-white/80 text-nature-gray text-sm">
                    <i class="fas fa-leaf text-soft-green/50 mr-2"></i>
                    Produits locaux
                  </span>
                </div>
              </div>

              <!-- Produits -->
              <div class="mb-6">
                <h4 class="font-medium text-forest-green mb-4">Votre sélection</h4>
                <div class="flex flex-wrap gap-3">
                  <div 
                    v-for="item in order.items.slice(0, 3)" 
                    :key="item.id"
                    class="flex items-center gap-2 px-4 py-2 bg-cream-light/50 rounded-full group/item hover:bg-cream-light transition-all duration-300"
                    :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                  >
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        :src="item.image" 
                        :alt="item.name"
                        class="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-500"
                        :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                      />
                    </div>
                    <span class="text-sm text-nature-gray">{{ item.name }}</span>
                    <span class="text-xs text-forest-green bg-white/50 px-2 py-1 rounded-full">
                      x{{ item.quantity }}
                    </span>
                  </div>
                  
                  <div 
                    v-if="order.items.length > 3"
                    class="flex items-center gap-2 px-4 py-2 bg-cream-light/30 rounded-full text-sm text-nature-gray"
                  >
                    +{{ order.items.length - 3 }} autres produits
                  </div>
                </div>
              </div>

              <!-- Producteur -->
              <div class="mb-6 p-4 bg-cream-light/30 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-soft-green/20 flex items-center justify-center">
                    <i class="fas fa-user text-soft-green"></i>
                  </div>
                  <div>
                    <p class="font-medium text-forest-green">{{ order.producer.name }}</p>
                    <p class="text-sm text-nature-gray">{{ order.producer.location }}</p>
                  </div>
                  <div class="ml-auto">
                    <span class="px-3 py-1 bg-bio-tag/10 text-bio-tag text-xs rounded-full">
                      {{ order.producer.type }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-cream-light/50">
                <button 
                  @click="viewOrderDetails(order)"
                  class="flex-1 px-6 py-3 bg-soft-green text-white rounded-xl font-medium hover:bg-forest-green transform hover:scale-[1.02] transition-all duration-500 group/btn"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                >
                  <span class="flex items-center justify-center gap-2">
                    Voir les détails
                    <i class="fas fa-arrow-right transform group-hover/btn:translate-x-1 transition-transform duration-300"></i>
                  </span>
                </button>
                
                <button 
                  v-if="order.status === 'delivered'"
                  @click="reorder(order)"
                  class="flex-1 px-6 py-3 bg-cream-light text-forest-green rounded-xl font-medium hover:bg-white border border-cream-light transform hover:scale-[1.02] transition-all duration-500"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                >
                  Commander à nouveau
                </button>
                
                <button 
                  v-if="order.status === 'delivered'"
                  @click="contactProducer(order)"
                  class="px-6 py-3 bg-white/50 text-nature-gray rounded-xl font-medium hover:bg-white hover:text-forest-green border border-cream-light transform hover:scale-[1.02] transition-all duration-500"
                  :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
                >
                  <i class="fas fa-comment mr-2"></i>
                  Contacter
                </button>
              </div>
            </div>

            <!-- Élément décoratif latéral -->
            <div class="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-24 bg-gradient-to-b from-soft-green to-clay-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </transition-group>

        <!-- Message vide -->
        <div 
          v-if="filteredOrders.length === 0"
          class="text-center py-16 animate-fade-in"
        >
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-light/50 flex items-center justify-center">
            <i class="fas fa-shopping-basket text-forest-green/50 text-3xl"></i>
          </div>
          <h3 class="text-2xl font-serif text-forest-green mb-3">
            Aucune commande trouvée
          </h3>
          <p class="text-nature-gray mb-8 max-w-md mx-auto">
            {{ activeFilter === 'all' 
              ? 'Vous n\'avez pas encore passé de commande. Découvrez nos produits frais !' 
              : 'Aucune commande ne correspond à ce filtre.' 
            }}
          </p>
          <button 
            v-if="activeFilter !== 'all'"
            @click="activeFilter = 'all'"
            class="px-8 py-3 bg-soft-green text-white rounded-xl font-medium hover:bg-forest-green transform hover:scale-105 transition-all duration-500"
            :style="{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
          >
            Voir toutes les commandes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import gsap from 'gsap'

export default {
  name: 'OrderList',
  
  setup() {
    const activeFilter = ref('all')
    
    const filters = [
      { id: 'all', label: 'Toutes les commandes' },
      { id: 'pending', label: 'En attente' },
      { id: 'preparing', label: 'En préparation' },
      { id: 'delivered', label: 'Livrées' },
      { id: 'cancelled', label: 'Annulées' }
    ]

    // Données de démonstration
    const orders = ref([
      {
        id: 'ORD-2023-00145',
        date: '2023-10-15',
        status: 'delivered',
        total: 42.50,
        items: [
          { id: 1, name: 'Tomates anciennes', quantity: 2, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100' },
          { id: 2, name: 'Salade verte', quantity: 1, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w-100' },
          { id: 3, name: 'Fromage de chèvre', quantity: 1, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100' }
        ],
        producer: {
          name: 'La Ferme du Val Joyeux',
          location: 'Saint-Rémy (10km)',
          type: 'Bio'
        }
      },
      {
        id: 'ORD-2023-00146',
        date: '2023-10-18',
        status: 'preparing',
        total: 68.90,
        items: [
          { id: 4, name: 'Pain au levain', quantity: 3, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100' },
          { id: 5, name: 'Confiture artisanale', quantity: 2, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100' }
        ],
        producer: {
          name: 'Le Fournil des Champs',
          location: 'Beaumont (5km)',
          type: 'Artisanal'
        }
      }
    ])

    const filteredOrders = computed(() => {
      if (activeFilter.value === 'all') return orders.value
      return orders.value.filter(order => order.status === activeFilter.value)
    })

    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-warning-light text-warning-dark',
        preparing: 'bg-info-light text-info-dark',
        delivered: 'bg-success-light text-success-dark',
        cancelled: 'bg-error-light text-error-dark'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status) => {
      const texts = {
        pending: 'En attente',
        preparing: 'En préparation',
        delivered: 'Livrée',
        cancelled: 'Annulée'
      }
      return texts[status] || status
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const viewOrderDetails = (order) => {
      console.log('Voir détails:', order.id)
      // Navigation vers la page de détails
    }

    const reorder = (order) => {
      console.log('Commander à nouveau:', order.id)
      // Logique de ré-commande
    }

    const contactProducer = (order) => {
      console.log('Contacter producteur:', order.producer.name)
      // Ouverture du formulaire de contact
    }

    // Animations stagger pour la liste
    const beforeStaggerEnter = (el) => {
      el.style.opacity = 0
      el.style.transform = 'translateY(20px)'
    }

    const staggerEnter = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: el.dataset.index * 0.1,
        ease: 'back.out(1.7)',
        onComplete: done
      })
    }

    return {
      activeFilter,
      filters,
      orders,
      filteredOrders,
      getStatusClass,
      getStatusText,
      formatDate,
      viewOrderDetails,
      reorder,
      contactProducer,
      beforeStaggerEnter,
      staggerEnter
    }
  }
}
</script>

<style scoped>
/* Background pattern */
.bg-pattern-dots {
  background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%232E7D32" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
}

/* Animations CSS personnalisées */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-float-slow {
  animation: float 20s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Transition group personnalisée */
.staggered-fade-move {
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Styles spécifiques pour les couleurs (à adapter selon votre configuration Tailwind) */
:deep() {
  .bg-forest-green { background-color: #2E7D32; }
  .text-forest-green { color: #2E7D32; }
  .bg-soft-green { background-color: #A5D6A7; }
  .text-soft-green { color: #A5D6A7; }
  .bg-cream-light { background-color: #FFF8E1; }
  .text-cream-light { color: #FFF8E1; }
  .bg-clay-light { background-color: #FFAB91; }
  .text-clay-light { color: #FFAB91; }
  .text-nature-gray { color: #666; }
  
  /* Tags produits */
  .bg-bio-tag { background-color: #4CAF50; }
  .text-bio-tag { color: #4CAF50; }
  
  /* Status */
  .bg-success-light { background-color: #C8E6C9; }
  .text-success-dark { color: #2E7D32; }
  .bg-warning-light { background-color: #FFF9C4; }
  .text-warning-dark { color: #F57F17; }
  .bg-info-light { background-color: #B3E5FC; }
  .text-info-dark { color: #0288D1; }
  .bg-error-light { background-color: #FFCDD2; }
  .text-error-dark { color: #C62828; }
}
</style>