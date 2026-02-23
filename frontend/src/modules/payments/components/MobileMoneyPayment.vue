<template>
    <div
        class="min-h-screen bg-gradient-to-br from-soft-forest-green via-creamy-white to-earth-red-50 relative overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 bg-organic-pattern opacity-5"></div>

        <!-- Éléments décoratifs subtils -->
        <div class="absolute top-10 left-5 w-24 h-24 opacity-10">
            <LeafDecoration />
        </div>
        <div class="absolute bottom-10 right-5 w-32 h-32 opacity-10">
            <FruitDecoration />
        </div>

        <!-- Navigation retour -->
        <div class="container mx-auto px-4 pt-8">
            <button @click="$router.back()"
                class="flex items-center text-forest-green hover:text-earth-red transition-all duration-500 ease-organic">
                <svg class="w-5 h-5 mr-2 transform hover:-translate-x-1 transition-transform duration-300 ease-organic"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Retour
            </button>
        </div>

        <!-- Contenu principal -->
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
                <!-- En-tête avec animation d'entrée -->
                <transition enter-active-class="transition-all duration-700 ease-organic"
                    enter-from-class="opacity-0 transform -translate-y-4"
                    enter-to-class="opacity-100 transform translate-y-0">
                    <div class="text-center mb-10">
                        <div
                            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-soft-green/20 mb-6">
                            <svg class="w-10 h-10 text-soft-green" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <h1 class="text-4xl font-serif font-bold text-forest-green mb-4">
                            Paiement Mobile Money
                        </h1>
                        <p class="text-earth-brown text-lg max-w-2xl mx-auto">
                            Paiement sécurisé via les opérateurs camerounais. Transaction instantanée et 100% sécurisée.
                        </p>
                    </div>
                </transition>

                <div class="grid md:grid-cols-2 gap-8">
                    <!-- Formulaire de paiement -->
                    <transition appear appear-active-class="transition-all duration-800 ease-organic delay-100"
                        appear-from-class="opacity-0 transform translate-x-8"
                        appear-to-class="opacity-100 transform translate-x-0">
                        <div
                            class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-organic border border-soft-green/20">
                            <div class="mb-8">
                                <div class="flex items-center space-x-2 mb-6">
                                    <div class="w-3 h-3 rounded-full bg-soft-green"></div>
                                    <h2 class="text-2xl font-semibold text-forest-green">
                                        Détails du paiement
                                    </h2>
                                </div>

                                <!-- Montant -->
                                <div class="mb-8">
                                    <label class="block text-earth-brown font-medium mb-3">Montant à payer</label>
                                    <div class="relative">
                                        <div
                                            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-forest-green">
                                            FCFA</div>
                                        <input v-model="amount" type="text"
                                            class="w-full pl-20 pr-4 py-4 text-3xl font-bold text-forest-green bg-cream/50 border-2 border-soft-green/30 rounded-2xl focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic"
                                            placeholder="0" readonly />
                                    </div>
                                    <p class="text-sm text-earth-brown/70 mt-2">Montant correspondant à votre commande
                                    </p>
                                </div>

                                <!-- Opérateurs Mobile Money -->
                                <div class="mb-8">
                                    <label class="block text-earth-brown font-medium mb-4">Sélectionnez votre
                                        opérateur</label>
                                    <div class="grid grid-cols-2 gap-4">
                                        <button v-for="operator in operators" :key="operator.id"
                                            @click="selectOperator(operator.id)" :class="[
                                                'p-4 rounded-2xl border-2 transition-all duration-500 ease-organic hover:scale-105',
                                                selectedOperator === operator.id
                                                    ? 'border-soft-green bg-soft-green/10 shadow-md'
                                                    : 'border-soft-green/20 hover:border-soft-green/50'
                                            ]">
                                            <div class="flex items-center space-x-3">
                                                <div
                                                    :class="['w-12 h-12 rounded-full flex items-center justify-center', operator.bgColor]">
                                                    <component :is="operator.icon" class="w-6 h-6 text-white" />
                                                </div>
                                                <div class="text-left">
                                                    <div class="font-semibold text-forest-green">{{ operator.name }}
                                                    </div>
                                                    <div class="text-xs text-earth-brown">{{ operator.description }}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <!-- Numéro de téléphone -->
                                <div class="mb-8">
                                    <label class="block text-earth-brown font-medium mb-3">Numéro Mobile Money</label>
                                    <div class="relative">
                                        <div
                                            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-forest-green font-medium">
                                            +237</div>
                                        <input v-model="phoneNumber" type="tel"
                                            class="w-full pl-16 pr-4 py-4 text-lg text-forest-green bg-cream/50 border-2 border-soft-green/30 rounded-2xl focus:border-soft-green focus:ring-2 focus:ring-soft-green/20 transition-all duration-300 ease-organic"
                                            placeholder="6 XX XX XX XX" @input="formatPhoneNumber" />
                                    </div>
                                    <p class="text-sm text-earth-brown/70 mt-2">Le numéro associé à votre compte Mobile
                                        Money</p>
                                </div>

                                <!-- Bouton de paiement -->
                                <button @click="processPayment" :disabled="!isFormValid" :class="[
                                    'w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-500 ease-organic transform hover:scale-105 active:scale-95',
                                    isFormValid
                                        ? 'bg-gradient-to-r from-soft-green to-forest-green text-white shadow-lg hover:shadow-xl'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                ]">
                                    <div class="flex items-center justify-center">
                                        <svg v-if="isProcessing" class="animate-spin h-5 w-5 mr-3 text-white"
                                            fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        <span>{{ isProcessing ? 'Traitement en cours...' : `Payer ${amount} FCFA`
                                            }}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </transition>

                    <!-- Panneau d'information -->
                    <transition appear appear-active-class="transition-all duration-800 ease-organic delay-300"
                        appear-from-class="opacity-0 transform -translate-x-8"
                        appear-to-class="opacity-100 transform translate-x-0">
                        <div class="space-y-6">
                            <!-- Instructions -->
                            <div
                                class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-soft-green/20 shadow-organic">
                                <h3 class="text-xl font-semibold text-forest-green mb-4 flex items-center">
                                    <svg class="w-6 h-6 mr-2 text-soft-green" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Comment procéder ?
                                </h3>
                                <ol class="space-y-4">
                                    <li class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-8 h-8 rounded-full bg-soft-green/20 flex items-center justify-center text-soft-green font-bold mr-3">
                                            1</div>
                                        <p class="text-earth-brown">Sélectionnez votre opérateur Mobile Money (MTN ou
                                            Orange)</p>
                                    </li>
                                    <li class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-8 h-8 rounded-full bg-soft-green/20 flex items-center justify-center text-soft-green font-bold mr-3">
                                            2</div>
                                        <p class="text-earth-brown">Entrez le numéro de téléphone associé à votre compte
                                            Mobile Money</p>
                                    </li>
                                    <li class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-8 h-8 rounded-items-center justify-center text-soft-green font-bold mr-3">
                                            3</div>
                                        <p class="text-earth-brown">Validez le paiement et attendez la demande de
                                            confirmation sur votre téléphone</p>
                                    </li>
                                </ol>
                            </div>

                            <!-- Réassurance -->
                            <div
                                class="bg-gradient-to-br from-soft-green/10 to-cream/50 rounded-3xl p-6 border border-soft-green/30">
                                <h3 class="text-xl font-semibold text-forest-green mb-4 flex items-center">
                                    <svg class="w-6 h-6 mr-2 text-soft-green" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                                        </path>
                                    </svg>
                                    Paiement 100% sécurisé
                                </h3>
                                <ul class="space-y-3">
                                    <li class="flex items-center text-earth-brown">
                                        <svg class="w-5 h-5 text-soft-green mr-2" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        Cryptage des données SSL
                                    </li>
                                    <li class="flex items-center text-earth-brown">
                                        <svg class="w-5 h-5 text-soft-green mr-2" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        Aucune donnée bancaire stockée
                                    </li>
                                    <li class="flex items-center text-earth-brown">
                                        <svg class="w-5 h-5 text-soft-green mr-2" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        Confirmation par code USSD
                                    </li>
                                </ul>
                            </div>

                            <!-- Assistance -->
                            <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-earth-red/20">
                                <div class="flex items-start">
                                    <div
                                        class="flex-shrink-0 w-12 h-12 rounded-full bg-earth-red/10 flex items-center justify-center text-earth-red mr-4">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-forest-green mb-2">Besoin d'aide ?</h4>
                                        <p class="text-earth-brown text-sm mb-3">Notre équipe est disponible pour vous
                                            accompagner</p>
                                        <button
                                            class="text-soft-green font-medium hover:text-forest-green transition-colors duration-300 ease-organic">
                                            Contactez-nous →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <!-- Modal de confirmation -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-all duration-300 ease-organic"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div
                    class="bg-white rounded-3xl p-8 max-w-md w-full transform transition-all duration-500 ease-organic scale-100">
                    <div class="text-center">
                        <div
                            class="w-20 h-20 rounded-full bg-soft-green/20 flex items-center justify-center mx-auto mb-6">
                            <svg class="w-10 h-10 text-soft-green" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-forest-green mb-2">Paiement initié !</h3>
                        <p class="text-earth-brown mb-6">
                            Vous allez recevoir une demande de confirmation sur votre téléphone. Veuillez saisir votre
                            code PIN pour finaliser la transaction.
                        </p>
                        <div class="flex space-x-4">
                            <button @click="showConfirmation = false"
                                class="flex-1 py-3 px-6 border-2 border-soft-green/30 text-forest-green rounded-2xl hover:border-soft-green transition-all duration-300 ease-organic">
                                Fermer
                            </button>
                            <button @click="confirmPayment"
                                class="flex-1 py-3 px-6 bg-soft-green text-white rounded-2xl hover:bg-forest-green transition-all duration-300 ease-organic">
                                J'ai validé
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'MobileMoneyPayment',
    components: {
        // Composants décoratifs
        LeafDecoration: {
            template: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <path d="M50,20 C70,10 85,25 80,45 C75,65 55,75 40,85 C25,75 15,60 20,40 C25,20 40,25 50,20 Z" 
                fill="currentColor" opacity="0.3"/>
        </svg>
      `
        },
        FruitDecoration: {
            template: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.2"/>
          <path d="M50,20 L55,40 L70,45 L55,50 L60,65 L50,55 L40,65 L45,50 L30,45 L45,40 Z" 
                fill="currentColor" opacity="0.4"/>
        </svg>
      `
        }
    },
    data() {
        return {
            amount: '15 750',
            selectedOperator: 'mtn',
            phoneNumber: '',
            isProcessing: false,
            showConfirmation: false,
            operators: [
                {
                    id: 'mtn',
                    name: 'MTN Mobile Money',
                    description: 'Service MTN',
                    bgColor: 'bg-yellow-500',
                    icon: {
                        template: `
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <text x="12" y="16" text-anchor="middle" font-size="10" fill="white" font-weight="bold">MTN</text>
              </svg>
            `
                    }
                },
                {
                    id: 'orange',
                    name: 'Orange Money',
                    description: 'Service Orange',
                    bgColor: 'bg-orange-500',
                    icon: {
                        template: `
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <text x="12" y="16" text-anchor="middle" font-size="10" fill="white" font-weight="bold">OM</text>
              </svg>
            `
                    }
                }
            ]
        }
    },
    computed: {
        isFormValid() {
            return this.selectedOperator && this.phoneNumber.replace(/\s/g, '').length >= 9 && !this.isProcessing
        }
    },
    methods: {
        selectOperator(operatorId) {
            this.selectedOperator = operatorId
        },
        formatPhoneNumber() {
            let numbers = this.phoneNumber.replace(/\D/g, '')
            if (numbers.length > 9) numbers = numbers.substring(0, 9)

            if (numbers.length > 0) {
                const groups = []
                if (numbers.length > 2) {
                    groups.push(numbers.substring(0, 2))
                    numbers = numbers.substring(2)
                }
                while (numbers.length > 2) {
                    groups.push(numbers.substring(0, 2))
                    numbers = numbers.substring(2)
                }
                if (numbers.length > 0) {
                    groups.push(numbers)
                }
                this.phoneNumber = groups.join(' ')
            } else {
                this.phoneNumber = ''
            }
        },
        async processPayment() {
            if (!this.isFormValid) return

            this.isProcessing = true

            // Simulation d'un délai de traitement
            await new Promise(resolve => setTimeout(resolve, 1500))

            this.showConfirmation = true
            this.isProcessing = false
        },
        confirmPayment() {
            this.showConfirmation = false
            // Redirection vers la page de confirmation
            this.$router.push('/payment-confirmation')
        }
    },
    mounted() {
        // Récupération du montant depuis la commande (exemple)
        // this.amount = this.$route.params.amount || '15 750'
    }
}
</script>

<style scoped>
/* Animation de fond subtile */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

/* Classes personnalisées pour l'identité visuelle */
.bg-organic-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300a86b' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.shadow-organic {
    box-shadow:
        0 10px 25px -5px rgba(0, 168, 107, 0.1),
        0 10px 10px -5px rgba(0, 168, 107, 0.04),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
}

/* Classes de couleurs personnalisées */
.bg-soft-forest-green {
    background-color: #e8f5f0;
}

.bg-creamy-white {
    background-color: #fefaf6;
}

.bg-earth-red-50 {
    background-color: #fdf6f3;
}

.text-forest-green {
    color: #1a4731;
}

.text-soft-green {
    color: #00a86b;
}

.text-earth-brown {
    color: #8b7355;
}

.text-earth-red {
    color: #c44536;
}

.border-soft-green {
    border-color: #00a86b;
}

.border-earth-red {
    border-color: #c44536;
}

.bg-soft-green {
    background-color: #00a86b;
}

.bg-earth-red {
    background-color: #c44536;
}

/* Courbe de Bézier personnalisée pour les animations "ultra-fluides" */
.ease-organic {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation de flottement pour les éléments décoratifs */
.floating {
    animation: float 6s ease-in-out infinite;
}
</style>