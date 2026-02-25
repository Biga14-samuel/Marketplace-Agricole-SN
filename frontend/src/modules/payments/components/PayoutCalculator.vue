<template>
    <div
        class="payout-calculator-page min-h-screen bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30 overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none" :style="{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
          <svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='payout-pattern' width='60' height='60' patternUnits='userSpaceOnUse'>
                <path d='M0,30 Q15,20 30,30 T60,30' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <path d='M30,0 Q20,15 30,30 T30,60' stroke='%2300a896' fill='none' stroke-width='0.5' opacity='0.05'/>
                <circle cx='15' cy='15' r='4' fill='%2300a896' opacity='0.03'/>
                <circle cx='45' cy='45' r='4' fill='%2300a896' opacity='0.03'/>
                <path d='M20,40 Q30,50 40,40' stroke='%2300a896' fill='none' stroke-width='0.3' opacity='0.03'/>
              </pattern>
            </defs>
            <rect width='100' height='100' fill='url(%23payout-pattern)'/>
          </svg>
        `)}')`
        }"></div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-1/4 left-8 w-56 h-56 leaf-float opacity-10">
            <div class="w-full h-full bg-emerald-300/20 rounded-full blur-3xl"></div>
        </div>
        <div class="absolute bottom-1/3 right-8 w-64 h-64 leaf-float opacity-10" style="animation-delay: 1.5s;">
            <div class="w-full h-full bg-amber-300/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Conteneur principal -->
        <div class="container mx-auto px-4 py-8 relative z-10">
            <!-- En-tête avec animations -->
            <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
                enter-from-class="opacity-0 -translate-y-6" enter-to-class="opacity-100 translate-y-0">
                <div class="mb-10 text-center">
                    <div
                        class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 mb-6 shadow-lg">
                        <CalculatorIcon class="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 class="text-4xl font-bold text-nature-900 mb-3">
                        <span class="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                            Calculateur de Versement
                        </span>
                    </h1>
                    <p class="text-nature-600 text-lg max-w-2xl mx-auto">
                        Estimez vos revenus nets en fonction de vos ventes. Notre calculateur prend en compte
                        toutes les commissions et frais pour vous donner une estimation précise.
                    </p>
                </div>
            </Transition>

            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <!-- Panneau gauche: Formulaire de calcul -->
                    <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
                        enter-from-class="opacity-0 -translate-x-10" enter-to-class="opacity-100 translate-x-0">
                        <div class="lg:w-2/5">
                            <div
                                class="bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm rounded-2xl border border-emerald-200/50 shadow-2xl overflow-hidden">
                                <!-- En-tête du formulaire -->
                                <div
                                    class="p-6 border-b border-emerald-200/50 bg-gradient-to-r from-white to-emerald-50/30">
                                    <h2 class="text-2xl font-bold text-nature-900 mb-2">
                                        <span
                                            class="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                            Paramètres de Calcul
                                        </span>
                                    </h2>
                                    <p class="text-nature-600">
                                        Configurez les paramètres pour estimer votre versement
                                    </p>
                                </div>

                                <!-- Formulaire -->
                                <div class="p-6">
                                    <!-- Période -->
                                    <div class="mb-8">
                                        <label class="block text-sm font-medium text-nature-700 mb-4">
                                            Période de calcul
                                        </label>
                                        <div class="grid grid-cols-2 gap-3">
                                            <button v-for="period in periodOptions" :key="period.value"
                                                @click="selectPeriod(period.value)" :class="[
                                                    'py-3 rounded-xl border transition-all duration-300 hover:scale-105',
                                                    selectedPeriod === period.value
                                                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                                                        : 'border-nature-200/50 hover:border-emerald-300/50'
                                                ]">
                                                <div class="text-center">
                                                    <div class="font-semibold text-nature-900">{{ period.label }}</div>
                                                    <div class="text-xs text-nature-600 mt-1">{{ period.description }}
                                                    </div>
                                                </div>
                                            </button>
                                        </div>

                                        <!-- Dates personnalisées -->
                                        <div v-if="selectedPeriod === 'custom'" class="mt-4 space-y-3">
                                            <div>
                                                <label class="block text-xs text-nature-600 mb-1">Date de début</label>
                                                <input v-model="customStartDate" type="date"
                                                    class="w-full px-3 py-2 rounded-lg border border-nature-300/50 bg-white/50" />
                                            </div>
                                            <div>
                                                <label class="block text-xs text-nature-600 mb-1">Date de fin</label>
                                                <input v-model="customEndDate" type="date"
                                                    class="w-full px-3 py-2 rounded-lg border border-nature-300/50 bg-white/50" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Montant des ventes -->
                                    <div class="mb-8">
                                        <label class="block text-sm font-medium text-nature-700 mb-2">
                                            Chiffre d'affaires brut
                                        </label>
                                        <div class="relative">
                                            <input v-model="grossAmount" type="number" min="0" step="100"
                                                class="w-full pl-12 pr-4 py-3 rounded-xl border border-nature-300/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                                                placeholder="Montant en XAF" @input="calculatePayout" />
                                            <CurrencyDollarIcon
                                                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-nature-400" />
                                        </div>
                                        <p class="text-xs text-nature-500 mt-2">
                                            Entrez le montant total de vos ventes avant déduction des commissions
                                        </p>
                                    </div>

                                    <!-- Options de calcul -->
                                    <div class="mb-8 space-y-4">
                                        <!-- Commission de plateforme -->
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="text-sm font-medium text-nature-700">
                                                    Commission de plateforme
                                                </label>
                                                <span class="text-sm font-bold text-emerald-600">
                                                    {{ commissionRate }}%
                                                </span>
                                            </div>
                                            <input v-model="commissionRate" type="range" min="5" max="30" step="0.5"
                                                class="w-full h-2 bg-nature-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                                @input="calculatePayout" />
                                            <div class="flex justify-between text-xs text-nature-500 mt-1">
                                                <span>5%</span>
                                                <span>15%</span>
                                                <span>30%</span>
                                            </div>
                                        </div>

                                        <!-- Frais de transaction -->
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="text-sm font-medium text-nature-700">
                                                    Frais de transaction
                                                </label>
                                                <span class="text-sm font-bold text-amber-600">
                                                    {{ transactionFeeRate }}%
                                                </span>
                                            </div>
                                            <input v-model="transactionFeeRate" type="range" min="0" max="5" step="0.1"
                                                class="w-full h-2 bg-nature-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                                @input="calculatePayout" />
                                            <div class="flex justify-between text-xs text-nature-500 mt-1">
                                                <span>0%</span>
                                                <span>2.5%</span>
                                                <span>5%</span>
                                            </div>
                                        </div>

                                        <!-- Taxe -->
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="text-sm font-medium text-nature-700">
                                                    Taxe (TVA)
                                                </label>
                                                <span class="text-sm font-bold text-blue-600">
                                                    {{ taxRate }}%
                                                </span>
                                            </div>
                                            <input v-model="taxRate" type="range" min="0" max="20" step="0.5"
                                                class="w-full h-2 bg-nature-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                                @input="calculatePayout" />
                                            <div class="flex justify-between text-xs text-nature-500 mt-1">
                                                <span>0%</span>
                                                <span>10%</span>
                                                <span>20%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Réinitialiser -->
                                    <button @click="resetCalculator"
                                        class="w-full py-3 rounded-xl border border-nature-300 text-nature-700 font-medium hover:bg-nature-50 transition-all duration-300 flex items-center justify-center">
                                        <ArrowPathIcon class="w-5 h-5 mr-2" />
                                        Réinitialiser les valeurs
                                    </button>
                                </div>

                                <!-- Pied de page du formulaire -->
                                <div
                                    class="p-6 border-t border-emerald-200/50 bg-gradient-to-r from-emerald-50/30 to-white/30">
                                    <div class="flex items-center text-sm text-nature-600">
                                        <InformationCircleIcon class="w-4 h-4 mr-2" />
                                        <span>Les taux par défaut sont basés sur nos conditions standards</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Graphique de répartition -->
                            <Transition appear enter-active-class="transition-all duration-700 custom-bezier delay-300"
                                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
                                <div
                                    class="mt-8 p-6 rounded-2xl bg-gradient-to-br from-white/90 to-amber-50/30 border border-amber-200/50 backdrop-blur-sm">
                                    <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                        <ChartPieIcon class="w-5 h-5 text-amber-600 mr-2" />
                                        Répartition des montants
                                    </h3>
                                    <div class="space-y-3">
                                        <div v-for="item in distribution" :key="item.label"
                                            class="flex items-center justify-between">
                                            <div class="flex items-center">
                                                <div class="w-3 h-3 rounded-full mr-2"
                                                    :style="{ backgroundColor: item.color }"></div>
                                                <span class="text-sm text-nature-700">{{ item.label }}</span>
                                            </div>
                                            <span class="text-sm font-medium text-nature-900">{{
                                                formatCurrency(item.amount) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </Transition>

                    <!-- Panneau droit: Résultats et détails -->
                    <Transition appear enter-active-class="transition-all duration-800 custom-bezier delay-200"
                        enter-from-class="opacity-0 translate-x-10" enter-to-class="opacity-100 translate-x-0">
                        <div class="lg:w-3/5">
                            <div class="sticky top-8 space-y-8">
                                <!-- Carte de résultat principal -->
                                <div
                                    class="bg-gradient-to-br from-white/90 to-green-50/50 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-2xl overflow-hidden">
                                    <div class="p-8 text-center">
                                        <!-- Montant net -->
                                        <div class="mb-6">
                                            <p class="text-nature-600 mb-2">Votre versement net estimé</p>
                                            <div class="text-5xl font-bold text-emerald-600 mb-2">
                                                {{ formatCurrency(payout.netAmount) }}
                                            </div>
                                            <p class="text-nature-600">
                                                Sur un chiffre d'affaires de {{ formatCurrency(payout.grossAmount) }}
                                            </p>
                                        </div>

                                        <!-- Indicateur de performance -->
                                        <div
                                            class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100/50 to-green-100/50 border border-emerald-200/50 mb-6">
                                            <TrophyIcon class="w-4 h-4 text-emerald-600 mr-2" />
                                            <span class="text-sm font-medium text-emerald-800">
                                                Taux de rétention: {{ retentionRate }}%
                                            </span>
                                        </div>

                                        <!-- Bouton d'action -->
                                        <button @click="requestPayout" :disabled="payout.netAmount <= 0" :class="[
                                            'w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105',
                                            payout.netAmount > 0
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-xl'
                                                : 'bg-nature-200 text-nature-400 cursor-not-allowed'
                                        ]">
                                            <div class="flex items-center justify-center">
                                                <BanknotesIcon class="w-6 h-6 mr-3" />
                                                Demander ce versement
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <!-- Détails du calcul -->
                                <div
                                    class="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm rounded-2xl border border-blue-200/50 overflow-hidden">
                                    <div
                                        class="p-6 border-b border-blue-200/50 bg-gradient-to-r from-white to-blue-50/30">
                                        <h3 class="text-xl font-bold text-nature-900 mb-2">
                                            <span
                                                class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                                Détails du Calcul
                                            </span>
                                        </h3>
                                        <p class="text-nature-600">
                                            Découvrez comment votre versement net est calculé
                                        </p>
                                    </div>

                                    <div class="p-6">
                                        <!-- Étapes du calcul -->
                                        <div class="space-y-6">
                                            <div v-for="(step, index) in calculationSteps" :key="step.label"
                                                class="flex items-start space-x-4"
                                                :style="{ animationDelay: `${index * 100}ms` }">
                                                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                    :class="step.bgColor">
                                                    <component :is="step.icon" class="w-4 h-4"
                                                        :class="step.iconColor" />
                                                </div>
                                                <div class="flex-1">
                                                    <div class="flex items-center justify-between mb-1">
                                                        <h4 class="font-medium text-nature-900">{{ step.label }}</h4>
                                                        <span class="font-bold" :class="step.amountClass">
                                                            {{ step.amountPrefix }}{{ formatCurrency(step.amount) }}
                                                        </span>
                                                    </div>
                                                    <p class="text-sm text-nature-600">{{ step.description }}</p>
                                                    <div v-if="step.formula"
                                                        class="mt-2 text-xs font-mono text-nature-500 bg-nature-50/50 p-2 rounded-lg">
                                                        {{ step.formula }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Ligne de séparation -->
                                        <div class="my-6 border-t border-nature-200/50"></div>

                                        <!-- Total net -->
                                        <div
                                            class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-200/50">
                                            <div class="flex items-center">
                                                <CheckCircleIcon class="w-5 h-5 text-emerald-600 mr-3" />
                                                <div>
                                                    <h4 class="font-bold text-emerald-900">Versement net</h4>
                                                    <p class="text-sm text-emerald-700">Montant qui vous sera
                                                        effectivement versé</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-2xl font-bold text-emerald-600">{{
                                                    formatCurrency(payout.netAmount) }}</div>
                                                <div class="text-sm text-emerald-700">{{ retentionRate }}% du chiffre
                                                    d'affaires</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Comparaison avec d'autres périodes -->
                                <Transition appear
                                    enter-active-class="transition-all duration-700 custom-bezier delay-400"
                                    enter-from-class="opacity-0 translate-y-4"
                                    enter-to-class="opacity-100 translate-y-0">
                                    <div
                                        class="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm rounded-2xl border border-purple-200/50 overflow-hidden">
                                        <div class="p-6 border-b border-purple-200/50">
                                            <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                                <ChartBarIcon class="w-5 h-5 text-purple-600 mr-2" />
                                                Comparaison mensuelle
                                            </h3>
                                            <div class="space-y-4">
                                                <div v-for="month in monthlyComparison" :key="month.month"
                                                    class="flex items-center justify-between p-3 rounded-lg border border-purple-200/30 hover:border-purple-300/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                                                    @click="loadMonthData(month)">
                                                    <div>
                                                        <div class="font-medium text-nature-900">{{ month.month }}</div>
                                                        <div class="text-sm text-nature-600">{{ month.orders }}
                                                            commandes</div>
                                                    </div>
                                                    <div class="text-right">
                                                        <div class="font-bold text-purple-600">{{
                                                            formatCurrency(month.payout) }}</div>
                                                        <div class="text-xs"
                                                            :class="month.change >= 0 ? 'text-emerald-600' : 'text-red-600'">
                                                            {{ month.change >= 0 ? '+' : '' }}{{ month.change }}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Conseils pour optimiser vos revenus -->
                                <Transition appear
                                    enter-active-class="transition-all duration-700 custom-bezier delay-500"
                                    enter-from-class="opacity-0 translate-y-4"
                                    enter-to-class="opacity-100 translate-y-0">
                                    <div
                                        class="bg-gradient-to-br from-white/90 to-amber-50/50 backdrop-blur-sm rounded-2xl border border-amber-200/50 overflow-hidden">
                                        <div class="p-6">
                                            <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                                <LightBulbIcon class="w-5 h-5 text-amber-600 mr-2" />
                                                Optimisez vos revenus
                                            </h3>
                                            <div class="space-y-3">
                                                <div class="flex items-start space-x-3">
                                                    <div
                                                        class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                        <SparklesIcon class="w-3 h-3 text-amber-600" />
                                                    </div>
                                                    <p class="text-sm text-nature-700">
                                                        Augmentez vos ventes de 20% pour atteindre
                                                        <span class="font-bold text-emerald-600">
                                                            {{
                                                                formatCurrency(calculateProjectedRevenue(payout.grossAmount
                                                                    * 1.2)) }}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div class="flex items-start space-x-3">
                                                    <div
                                                        class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                        <TagIcon class="w-3 h-3 text-amber-600" />
                                                    </div>
                                                    <p class="text-sm text-nature-700">
                                                        Réduisez vos retours de 5% pour gagner
                                                        <span class="font-bold text-emerald-600">
                                                            {{ formatCurrency(calculateReductionImpact()) }}
                                                        </span>
                                                        supplémentaires
                                                    </p>
                                                </div>
                                                <div class="flex items-start space-x-3">
                                                    <div
                                                        class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                        <TruckIcon class="w-3 h-3 text-amber-600" />
                                                    </div>
                                                    <p class="text-sm text-nature-700">
                                                        Optimisez vos frais de livraison pour économiser jusqu'à
                                                        <span class="font-bold text-emerald-600">15%</span>
                                                        sur vos coûts
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <!-- Modal de confirmation de demande -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showRequestModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-nature-900/40 backdrop-blur-sm" @click="showRequestModal = false"></div>

                <div
                    class="relative w-full max-w-md bg-gradient-to-br from-white to-emerald-50/90 rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden">
                    <div class="p-8 text-center">
                        <div
                            class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                            <BanknotesIcon class="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 class="text-2xl font-bold text-emerald-900 mb-3">Demande de versement</h3>
                        <p class="text-nature-600 mb-6">
                            Vous êtes sur le point de demander un versement de
                            <span class="font-bold text-emerald-600">{{ formatCurrency(payout.netAmount) }}</span>
                        </p>

                        <div class="space-y-4">
                            <button @click="confirmPayoutRequest"
                                class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                Confirmer la demande
                            </button>
                            <button @click="showRequestModal = false"
                                class="w-full py-3 rounded-xl border border-nature-300 text-nature-700 font-medium hover:bg-nature-50 transition-all duration-300">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    CalculatorIcon,
    CurrencyDollarIcon,
    InformationCircleIcon,
    ChartPieIcon,
    TrophyIcon,
    BanknotesIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ChartBarIcon,
    LightBulbIcon,
    SparklesIcon,
    TagIcon,
    TruckIcon,
    ShoppingCartIcon,
    ReceiptPercentIcon,
    ScaleIcon,
    WalletIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// État du calculateur
const grossAmount = ref(150000)
const commissionRate = ref(15)
const transactionFeeRate = ref(2.5)
const taxRate = ref(19.25)
const selectedPeriod = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
const showRequestModal = ref(false)

// Périodes disponibles
const periodOptions = [
    { value: 'week', label: 'Cette semaine', description: '7 derniers jours' },
    { value: 'month', label: 'Ce mois', description: '30 derniers jours' },
    { value: 'quarter', label: 'Ce trimestre', description: '90 derniers jours' },
    { value: 'year', label: 'Cette année', description: 'Année en cours' },
    { value: 'custom', label: 'Personnalisée', description: 'Choisir les dates' }
]

// Calcul du versement
const payout = computed(() => {
    const gross = grossAmount.value || 0
    const commission = gross * (commissionRate.value / 100)
    const transactionFee = gross * (transactionFeeRate.value / 100)
    const tax = (gross - commission) * (taxRate.value / 100)
    const totalDeductions = commission + transactionFee + tax
    const netAmount = gross - totalDeductions

    return {
        grossAmount: gross,
        commission,
        transactionFee,
        tax,
        totalDeductions,
        netAmount
    }
})

const retentionRate = computed(() => {
    if (payout.value.grossAmount <= 0) return 0
    return ((payout.value.netAmount / payout.value.grossAmount) * 100).toFixed(1)
})

// Distribution des montants pour le graphique
const distribution = computed(() => [
    { label: 'Chiffre d\'affaires', amount: payout.value.grossAmount, color: '#10b981' },
    { label: 'Commission', amount: payout.value.commission, color: '#f59e0b' },
    { label: 'Frais de transaction', amount: payout.value.transactionFee, color: '#ef4444' },
    { label: 'Taxe', amount: payout.value.tax, color: '#3b82f6' },
    { label: 'Versement net', amount: payout.value.netAmount, color: '#8b5cf6' }
])

// Étapes du calcul détaillé
const calculationSteps = computed(() => [
    {
        label: 'Chiffre d\'affaires brut',
        amount: payout.value.grossAmount,
        description: 'Total de vos ventes avant déductions',
        icon: ShoppingCartIcon,
        bgColor: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        amountClass: 'text-emerald-600',
        amountPrefix: '+',
        formula: `Ventes totales = ${formatCurrency(payout.value.grossAmount)}`
    },
    {
        label: 'Commission de plateforme',
        amount: payout.value.commission,
        description: `Commission de ${commissionRate.value}% sur le chiffre d'affaires`,
        icon: ReceiptPercentIcon,
        bgColor: 'bg-amber-100',
        iconColor: 'text-amber-600',
        amountClass: 'text-amber-600',
        amountPrefix: '-',
        formula: `Commission = ${formatCurrency(payout.value.grossAmount)} × ${commissionRate.value}%`
    },
    {
        label: 'Frais de transaction',
        amount: payout.value.transactionFee,
        description: `Frais de ${transactionFeeRate.value}% pour le traitement des paiements`,
        icon: ScaleIcon,
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        amountClass: 'text-red-600',
        amountPrefix: '-',
        formula: `Frais = ${formatCurrency(payout.value.grossAmount)} × ${transactionFeeRate.value}%`
    },
    {
        label: 'Taxe (TVA)',
        amount: payout.value.tax,
        description: `Taxe de ${taxRate.value}% sur le montant après commission`,
        icon: CurrencyDollarIcon,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        amountClass: 'text-blue-600',
        amountPrefix: '-',
        formula: `Taxe = (${formatCurrency(payout.value.grossAmount)} - ${formatCurrency(payout.value.commission)}) × ${taxRate.value}%`
    }
])

// Comparaison mensuelle
const monthlyComparison = computed(() => [
    {
        month: 'Mars 2024',
        orders: 42,
        payout: 156800,
        change: 12
    },
    {
        month: 'Février 2024',
        orders: 38,
        payout: 142300,
        change: 8
    },
    {
        month: 'Janvier 2024',
        orders: 35,
        payout: 131500,
        change: -2
    },
    {
        month: 'Décembre 2023',
        orders: 40,
        payout: 134200,
        change: 15
    }
])

// Méthodes
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

const selectPeriod = (period: string) => {
    selectedPeriod.value = period
    // Simuler le chargement des données pour la période sélectionnée
    if (period !== 'custom') {
        // Ajuster le montant brut en fonction de la période
        const multipliers: Record<string, number> = {
            week: 0.25,
            month: 1,
            quarter: 3,
            year: 12
        }
        grossAmount.value = Math.round(150000 * (multipliers[period] || 1))
        calculatePayout()
    }
}

const calculatePayout = () => {
    // Le calcul est réactif via les computed properties
    // Cette méthode est appelée sur les changements d'input
}

const resetCalculator = () => {
    grossAmount.value = 150000
    commissionRate.value = 15
    transactionFeeRate.value = 2.5
    taxRate.value = 19.25
    selectedPeriod.value = 'month'
}

const calculateProjectedRevenue = (projectedGross: number) => {
    const commission = projectedGross * (commissionRate.value / 100)
    const transactionFee = projectedGross * (transactionFeeRate.value / 100)
    const tax = (projectedGross - commission) * (taxRate.value / 100)
    return projectedGross - commission - transactionFee - tax
}

const calculateReductionImpact = () => {
    const reductionAmount = payout.value.grossAmount * 0.05 // 5% de réduction des retours
    const commissionSaved = reductionAmount * (commissionRate.value / 100)
    const transactionFeeSaved = reductionAmount * (transactionFeeRate.value / 100)
    const taxSaved = (reductionAmount - commissionSaved) * (taxRate.value / 100)
    return reductionAmount - commissionSaved - transactionFeeSaved - taxSaved
}

const loadMonthData = (month: any) => {
    grossAmount.value = month.payout * 1.5 // Estimation du CA brut
    calculatePayout()
}

const requestPayout = () => {
    if (payout.value.netAmount > 0) {
        showRequestModal.value = true
    }
}

const confirmPayoutRequest = async () => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    showRequestModal.value = false

    // Rediriger vers la page des versements
    router.push('/payouts')
}

// Initialisation
onMounted(() => {
    calculatePayout()
})
</script>

<style scoped>
/* Animations */
.leaf-float {
    animation: float-leaf 20s ease-in-out infinite;
}

@keyframes float-leaf {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-30px) rotate(5deg);
    }
}

.custom-bezier {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation des étapes de calcul */
@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.calculation-step {
    animation: slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
}

/* Délais d'animation */
.delay-100 {
    animation-delay: 100ms;
}

.delay-200 {
    animation-delay: 200ms;
}

.delay-300 {
    animation-delay: 300ms;
}

.delay-400 {
    animation-delay: 400ms;
}

.delay-500 {
    animation-delay: 500ms;
}

/* Style personnalisé pour le range input */
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: var(--thumb-color, #10b981);
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

/* Variables CSS */
:root {
    --color-primary-50: #f0f9ff;
    --color-primary-500: #0ea5e9;
    --color-emerald-50: #ecfdf5;
    --color-emerald-500: #10b981;
    --color-emerald-600: #059669;
    --color-green-500: #22c55e;
    --color-amber-500: #f59e0b;
    --color-blue-500: #3b82f6;
    --color-purple-500: #8b5cf6;
    --color-nature-50: #fafaf9;
    --color-nature-200: #e7e5e4;
    --color-nature-500: #78716c;
    --color-nature-600: #57534e;
    --color-nature-700: #44403c;
    --color-nature-900: #1c1917;
}
</style>
