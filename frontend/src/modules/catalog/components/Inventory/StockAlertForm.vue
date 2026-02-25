<template>
  <div class="min-h-screen organic-bg-split relative overflow-hidden">
    <!-- Split Screen Container -->
    <div class="flex flex-col lg:flex-row min-h-screen">
      <!-- Illustration de gauche - Panier de produits frais -->
      <div class="lg:w-1/2 relative overflow-hidden animate-slide-in-left">
        <div class="absolute inset-0 bg-gradient-to-br from-green-900/20 to-orange-900/10"></div>
        
        <!-- Illustration principale -->
        <div class="relative h-full flex items-center justify-center p-12">
          <div class="relative z-20 text-center max-w-lg">
            <!-- Panier animé -->
            <div class="mb-8 animate-float-slow">
              <div class="relative mx-auto w-64 h-64">
                <!-- Panier -->
                <div class="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-100 rounded-full shadow-2xl"></div>
                
                <!-- Fruits et légumes dans le panier -->
                <div class="absolute top-8 left-12 text-5xl animate-bounce-soft" style="animation-delay: 0.2s;">🍎</div>
                <div class="absolute top-4 right-12 text-4xl animate-bounce-soft" style="animation-delay: 0.5s;">🥕</div>
                <div class="absolute bottom-12 left-16 text-5xl animate-bounce-soft" style="animation-delay: 0.8s;">🍋</div>
                <div class="absolute bottom-8 right-16 text-6xl animate-bounce-soft" style="animation-delay: 1.1s;">🥦</div>
                <div class="absolute top-16 left-24 text-4xl animate-bounce-soft" style="animation-delay: 1.4s;">🍇</div>
              </div>
            </div>

            <h2 class="text-4xl font-bold text-white mb-4 drop-shadow-lg">Restez informé</h2>
            <p class="text-xl text-green-50/90 mb-6">
              Configurez vos alertes pour ne jamais manquer de produits frais
            </p>
            
            <!-- Avantages sous forme de badges -->
            <div class="flex flex-wrap justify-center gap-4">
              <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span class="text-2xl">⏰</span>
                <span class="text-white font-medium">Alertes en temps réel</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span class="text-2xl">📱</span>
                <span class="text-white font-medium">Notifications multi-canal</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span class="text-2xl">🎯</span>
                <span class="text-white font-medium">Personnalisation fine</span>
              </div>
            </div>
          </div>

          <!-- Feuilles décoratives flottantes -->
          <div class="absolute top-10 left-10 text-6xl text-green-300/30 leaf-float">🍃</div>
          <div class="absolute bottom-10 right-10 text-5xl text-amber-300/30 leaf-float" style="animation-delay: 3s;">🌿</div>
          <div class="absolute top-20 right-20 text-4xl text-lime-300/30 leaf-float" style="animation-delay: 6s;">🍂</div>
        </div>

        <!-- Texture de fond organique -->
        <div class="absolute inset-0 organic-texture opacity-10"></div>
      </div>

      <!-- Formulaire de droite -->
      <div class="lg:w-1/2 flex items-center justify-center p-6 animate-slide-in-right">
        <div class="w-full max-w-2xl">
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-green to-green-600 rounded-2xl mb-4 shadow-lg animate-pulse-soft">
              <span class="text-3xl text-white">⚠️</span>
            </div>
            <h1 class="text-4xl font-bold text-forest-green mb-3">Configurer une Alerte Stock</h1>
            <p class="text-lg text-gray-600">Soyez averti lorsque vos stocks atteignent des niveaux critiques</p>
          </div>

          <!-- Carte du formulaire -->
          <div class="organic-form-card bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100/50">
            <!-- Indicateur de progression -->
            <div class="mb-8">
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-forest-green">Configuration de l'alerte</span>
                <span class="text-sm font-medium text-primary-green">Étape 1/3</span>
              </div>
              <div class="h-2 bg-green-100 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary-green to-green-500 rounded-full w-1/3 transition-all duration-500 transition-organic"></div>
              </div>
            </div>

            <!-- Formulaire -->
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <!-- Section Produit -->
              <div class="space-y-6">
                <h3 class="text-xl font-semibold text-forest-green flex items-center">
                  <span class="mr-3">📦</span>
                  Sélection du produit
                </h3>
                
                <!-- Sélecteur de produit -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Produit à surveiller
                    <span class="text-primary-green">*</span>
                  </label>
                  <div class="relative">
                    <select 
                      v-model="form.productId"
                      required
                      class="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic appearance-none cursor-pointer hover:border-green-300"
                    >
                      <option value="" disabled>Sélectionnez un produit</option>
                      <option value="pommes">🍎 Pommes Golden Bio</option>
                      <option value="carottes">🥕 Carottes Nouvelles</option>
                      <option value="salades">🥬 Salade Batavia</option>
                      <option value="tomates">🍅 Tomates Cerises</option>
                      <option value="oignons">🧅 Oignons Jaunes</option>
                      <option value="fraises">🍓 Fraises Gariguette</option>
                    </select>
                    <span class="absolute left-4 top-3.5 text-xl">🔍</span>
                    <span class="absolute right-4 top-3.5 text-green-500">▼</span>
                  </div>
                </div>

                <!-- Aperçu du produit sélectionné -->
                <div v-if="selectedProduct" class="bg-gradient-to-r from-green-50 to-green-100/30 rounded-xl p-4 border border-green-200 animate-fade-in">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-green to-green-600 flex items-center justify-center">
                      <span class="text-2xl text-white">{{ selectedProduct.icon }}</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800">{{ selectedProduct.name }}</h4>
                      <p class="text-sm text-gray-600">Stock actuel: 
                        <span :class="[
                          'font-bold',
                          selectedProduct.stock < selectedProduct.criticalLevel 
                            ? 'text-red-600 animate-pulse'
                            : selectedProduct.stock < selectedProduct.warningLevel
                              ? 'text-amber-600'
                              : 'text-green-600'
                        ]">
                          {{ selectedProduct.stock }} unités
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Seuils -->
              <div class="space-y-6">
                <h3 class="text-xl font-semibold text-forest-green flex items-center">
                  <span class="mr-3">🎯</span>
                  Définition des seuils
                </h3>

                <!-- Barre de seuil visuelle -->
                <div class="relative h-32 bg-gradient-to-r from-red-100 via-amber-100 to-green-100 rounded-xl p-4 border border-gray-200">
                  <div class="absolute top-4 left-0 right-0 flex justify-between px-4">
                    <span class="text-xs font-medium text-red-600">Critique</span>
                    <span class="text-xs font-medium text-amber-600">Attention</span>
                    <span class="text-xs font-medium text-green-600">Bon niveau</span>
                  </div>
                  
                  <!-- Curseurs -->
                  <div class="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
                    <div class="relative h-2 bg-gray-300 rounded-full mx-4">
                      <!-- Niveau actuel -->
                      <div 
                        v-if="selectedProduct"
                        class="absolute w-6 h-6 rounded-full bg-white border-2 border-primary-green -translate-y-1/2 shadow-lg"
                        :style="{ left: `${calculateStockPercentage(selectedProduct.stock)}%` }"
                        title="Stock actuel"
                      >
                        <div class="absolute inset-1 rounded-full bg-primary-green animate-ping-soft"></div>
                      </div>

                      <!-- Seuil d'avertissement -->
                      <input 
                        v-model.number="form.warningThreshold"
                        type="range"
                        min="0"
                        :max="maxStock"
                        step="5"
                        class="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                        @input="updateWarningLabel"
                      >
                      <div 
                        class="absolute w-4 h-4 rounded-full bg-amber-500 border-2 border-white -translate-y-1/2 shadow-md"
                        :style="{ left: `${calculatePercentage(form.warningThreshold)}%` }"
                      >
                        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Avertissement: {{ form.warningThreshold }}
                        </div>
                      </div>

                      <!-- Seuil critique -->
                      <input 
                        v-model.number="form.criticalThreshold"
                        type="range"
                        min="0"
                        :max="maxStock"
                        step="5"
                        class="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                        @input="updateCriticalLabel"
                      >
                      <div 
                        class="absolute w-4 h-4 rounded-full bg-red-500 border-2 border-white -translate-y-1/2 shadow-md"
                        :style="{ left: `${calculatePercentage(form.criticalThreshold)}%` }"
                      >
                        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Critique: {{ form.criticalThreshold }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Champs numériques -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Seuil d'avertissement
                      <span class="text-primary-green">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        v-model.number="form.warningThreshold"
                        type="number"
                        min="0"
                        :max="maxStock"
                        required
                        class="w-full px-4 py-3 bg-white/80 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300/30 focus:border-amber-400 transition-all duration-300 transition-organic"
                      >
                      <span class="absolute right-4 top-3.5 text-amber-600 font-bold">⚠️</span>
                    </div>
                    <p class="mt-2 text-sm text-amber-600">Alerte lorsque le stock descend sous ce niveau</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Seuil critique
                      <span class="text-primary-green">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        v-model.number="form.criticalThreshold"
                        type="number"
                        min="0"
                        :max="maxStock"
                        required
                        class="w-full px-4 py-3 bg-white/80 border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:border-red-400 transition-all duration-300 transition-organic"
                      >
                      <span class="absolute right-4 top-3.5 text-red-600 font-bold">🔥</span>
                    </div>
                    <p class="mt-2 text-sm text-red-600">Alerte urgente pour réapprovisionnement</p>
                  </div>
                </div>
              </div>

              <!-- Section Notifications -->
              <div class="space-y-6">
                <h3 class="text-xl font-semibold text-forest-green flex items-center">
                  <span class="mr-3">🔔</span>
                  Méthodes de notification
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label 
                    class="notification-option"
                    :class="{ 'selected': form.notifications.email }"
                    @click="form.notifications.email = !form.notifications.email"
                  >
                    <div class="notification-icon">
                      <span class="text-3xl">📧</span>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-800">Email</p>
                      <p class="text-sm text-gray-600">Notifications quotidiennes</p>
                    </div>
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                         :class="form.notifications.email 
                           ? 'bg-primary-green border-primary-green' 
                           : 'border-gray-300'">
                      <span v-if="form.notifications.email" class="text-white text-sm">✓</span>
                    </div>
                  </label>

                  <label 
                    class="notification-option"
                    :class="{ 'selected': form.notifications.sms }"
                    @click="form.notifications.sms = !form.notifications.sms"
                  >
                    <div class="notification-icon">
                      <span class="text-3xl">📱</span>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-800">SMS</p>
                      <p class="text-sm text-gray-600">Alertes urgentes</p>
                    </div>
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                         :class="form.notifications.sms 
                           ? 'bg-primary-green border-primary-green' 
                           : 'border-gray-300'">
                      <span v-if="form.notifications.sms" class="text-white text-sm">✓</span>
                    </div>
                  </label>

                  <label 
                    class="notification-option"
                    :class="{ 'selected': form.notifications.push }"
                    @click="form.notifications.push = !form.notifications.push"
                  >
                    <div class="notification-icon">
                      <span class="text-3xl">🔔</span>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-800">Push</p>
                      <p class="text-sm text-gray-600">Notifications instantanées</p>
                    </div>
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                         :class="form.notifications.push 
                           ? 'bg-primary-green border-primary-green' 
                           : 'border-gray-300'">
                      <span v-if="form.notifications.push" class="text-white text-sm">✓</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-green-100">
                <button 
                  type="button"
                  @click="handleCancel"
                  class="px-8 py-4 border-2 border-green-300 text-green-700 rounded-xl hover:bg-green-50 transition-all duration-300 transition-organic hover:scale-105 flex-1 flex items-center justify-center space-x-2"
                >
                  <span class="text-xl">↶</span>
                  <span>Annuler</span>
                </button>
                
                <button 
                  type="submit"
                  class="px-8 py-4 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transition-organic hover:scale-105 flex-1 flex items-center justify-center space-x-2 group"
                >
                  <span class="text-xl group-hover:animate-bounce">💾</span>
                  <span class="font-semibold">Créer l'alerte</span>
                  <span class="text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Informations supplémentaires -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600 flex items-center justify-center space-x-2">
              <span class="text-xl">💡</span>
              <span>Une alerte peut sauver votre journée ! Configurez soigneusement vos seuils.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockAlertForm',
  data() {
    return {
      form: {
        productId: '',
        warningThreshold: 50,
        criticalThreshold: 20,
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        frequency: 'daily',
        recipients: []
      },
      products: {
        pommes: {
          name: '🍎 Pommes Golden Bio',
          icon: '🍎',
          stock: 125,
          warningLevel: 100,
          criticalLevel: 50,
          category: 'fruits'
        },
        carottes: {
          name: '🥕 Carottes Nouvelles',
          icon: '🥕',
          stock: 75,
          warningLevel: 80,
          criticalLevel: 40,
          category: 'legumes'
        },
        salades: {
          name: '🥬 Salade Batavia',
          icon: '🥬',
          stock: 200,
          warningLevel: 150,
          criticalLevel: 75,
          category: 'legumes'
        },
        tomates: {
          name: '🍅 Tomates Cerises',
          icon: '🍅',
          stock: 180,
          warningLevel: 120,
          criticalLevel: 60,
          category: 'fruits'
        },
        oignons: {
          name: '🧅 Oignons Jaunes',
          icon: '🧅',
          stock: 300,
          warningLevel: 200,
          criticalLevel: 100,
          category: 'legumes'
        },
        fraises: {
          name: '🍓 Fraises Gariguette',
          icon: '🍓',
          stock: 40,
          warningLevel: 50,
          criticalLevel: 25,
          category: 'fruits'
        }
      },
      maxStock: 500
    }
  },
  computed: {
    selectedProduct() {
      return this.products[this.form.productId]
    }
  },
  methods: {
    calculatePercentage(value) {
      return (value / this.maxStock) * 100
    },
    calculateStockPercentage(stock) {
      return (stock / this.maxStock) * 100
    },
    updateWarningLabel(event) {
      this.form.warningThreshold = parseInt(event.target.value)
    },
    updateCriticalLabel(event) {
      this.form.criticalThreshold = parseInt(event.target.value)
    },
    handleSubmit() {
      console.log('Formulaire soumis:', this.form)
      
      // Animation de succès
      this.showSuccessAnimation()
      
      // Simuler une requête API
      setTimeout(() => {
        alert('Alerte configurée avec succès !')
        this.$router.push('/stock/alerts')
      }, 1500)
    },
    handleCancel() {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        this.$router.push('/stock/alerts')
      }
    },
    showSuccessAnimation() {
      // Ajouter une animation de succès
      const submitBtn = document.querySelector('button[type="submit"]')
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="text-xl animate-spin">⏳</span><span>Création en cours...</span>'
        submitBtn.disabled = true
      }
    }
  }
}
</script>

<style scoped>
/* Variables de couleur cohérentes */
:root {
  --primary-green: #45a348;
  --secondary-orange: #ff8c42;
  --forest-green: #2d5016;
  --earth-brown: #8b4513;
}

/* Background split-screen organique */
.organic-bg-split {
  background: linear-gradient(135deg, 
    rgba(43, 108, 44, 0.95) 0%,    /* Vert forêt */
    rgba(69, 163, 72, 0.9) 50%,    /* Vert primaire */
    rgba(255, 255, 255, 0.9) 50%,  /* Transition */
    rgba(255, 255, 255, 1) 100%    /* Blanc pur */
  );
}

@media (max-width: 1024px) {
  .organic-bg-split {
    background: linear-gradient(135deg, 
      rgba(43, 108, 44, 0.95) 0%,
      rgba(69, 163, 72, 0.9) 30%,
      rgba(255, 255, 255, 0.9) 30%,
      rgba(255, 255, 255, 1) 100%
    );
  }
}

/* Animation d'entrée split-screen */
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slide-in-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
  opacity: 0;
}

/* Carte de formulaire organique */
.organic-form-card {
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.organic-form-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, var(--primary-green) 0%, rgba(255, 140, 66, 0.3) 50%, var(--primary-green) 100%);

  /* Version standard (pour les navigateurs récents) */
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;

  /* Version préfixée WebKit (pour compatibilité étendue) */
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;

  opacity: 0.5;
  pointer-events: none;
}

.organic-form-card:hover::before {
  animation: border-flow 3s linear infinite;
}

/* Texture organique pour l'illustration */
.organic-texture {
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.1) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Animation de flottement lente */
@keyframes float-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(2deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

/* Animation de rebond doux */
@keyframes bounce-soft {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-bounce-soft {
  animation: bounce-soft 3s ease-in-out infinite;
}

/* Ping doux */
@keyframes ping-soft {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping-soft {
  animation: ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Option de notification stylée */
.notification-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.notification-option:hover {
  background: rgba(69, 163, 72, 0.05);
  border-color: var(--primary-green);
  transform: translateY(-4px);
}

.notification-option.selected {
  background: rgba(69, 163, 72, 0.1);
  border-color: var(--primary-green);
  box-shadow: 0 10px 25px rgba(69, 163, 72, 0.15);
}

.notification-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.notification-option.selected .notification-icon {
  background: linear-gradient(135deg, var(--primary-green), #16a34a);
  transform: scale(1.1);
}

/* Curseurs customisés */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-green);
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-green);
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Animation pour les feuilles */
.leaf-float {
  animation: leaf-float 25s linear infinite;
}
</style>
