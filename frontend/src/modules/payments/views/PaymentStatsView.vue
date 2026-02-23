<template>
    <div class="min-h-screen bg-gradient-to-br from-forest-green/5 to-cream-light p-4 md:p-8 relative overflow-hidden">
        <!-- Texture de fond subtile -->
        <div
            class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGM2LjYyNyAwIDEyIDUuMzczIDEyIDEycy01LjM3MyAxMi0xMiAxMm0wLTI0QzE3LjM3MyA2IDYgMTcuMzczIDYgMzBzMTEuMzczIDI0IDI0IDI0IiBzdHJva2U9IiMwMDgwMDAiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvZz48L3N2Zz4=')] opacity-10">
        </div>

        <!-- Animation de feuilles subtiles -->
        <div class="absolute top-10 left-5 w-32 h-32 opacity-3">
            <div class="leaf-animation-1"></div>
        </div>

        <div class="max-w-7xl mx-auto relative z-10">
            <!-- En-tête avec navigation -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h1
                        class="text-4xl font-bold text-forest-green mb-2 transition-all duration-500 ease-out-custom transform translate-y-0 opacity-100">
                        📊 Statistiques de Paiement
                    </h1>
                    <p class="text-natural-gray text-lg max-w-3xl">
                        Analysez les performances de vos transactions et suivez l'évolution de vos revenus
                        <span class="block text-sm text-natural-gray/70 mt-1">
                            Données mises à jour en temps réel • Source: transactions validées
                        </span>
                    </p>
                </div>

                <!-- Filtres de période -->
                <div class="flex flex-wrap gap-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-natural-light">
                    <button v-for="period in timePeriods" :key="period.id" @click="activePeriod = period.id" :class="[
                        'px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ease-out-custom',
                        activePeriod === period.id
                            ? 'bg-forest-green text-white shadow-md transform scale-105'
                            : 'text-natural-gray hover:bg-forest-green/10 hover:scale-102'
                    ]">
                        {{ period.label }}
                    </button>
                </div>
            </div>

            <!-- Cartes principales de statistiques -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Carte 1: Chiffre d'affaires total -->
                <div class="stats-card group" :style="{ animationDelay: '0.1s' }">
                    <div class="stats-card-header">
                        <div
                            class="w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta/15 to-cream-light flex items-center justify-center mb-4">
                            <span class="text-2xl">💰</span>
                        </div>
                        <h3 class="text-natural-gray text-sm font-medium">Chiffre d'Affaires</h3>
                    </div>
                    <div class="stats-card-content">
                        <p class="text-3xl font-bold text-forest-green mb-1">{{ formatCurrency(totalRevenue) }}</p>
                        <div class="flex items-center gap-2">
                            <span :class="[
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                revenueChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            ]">
                                <svg :class="[
                                    'w-3 h-3 mr-1',
                                    revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                                ]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        :d="revenueChange >= 0
                                            ? 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
                                            : 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'"
                                        clip-rule="evenodd" />
                                </svg>
                                {{ Math.abs(revenueChange) }}%
                            </span>
                            <span class="text-natural-gray/70 text-sm">vs période précédente</span>
                        </div>
                    </div>
                    <div class="stats-card-footer">
                        <div class="w-full bg-cream-light rounded-full h-2">
                            <div class="bg-gradient-to-r from-terracotta to-terracotta-light h-2 rounded-full"
                                :style="{ width: '85%' }"></div>
                        </div>
                    </div>
                </div>

                <!-- Carte 2: Transactions moyennes -->
                <div class="stats-card group" :style="{ animationDelay: '0.2s' }">
                    <div class="stats-card-header">
                        <div
                            class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-green/15 to-cream-light flex items-center justify-center mb-4">
                            <span class="text-2xl">📈</span>
                        </div>
                        <h3 class="text-natural-gray text-sm font-medium">Panier Moyen</h3>
                    </div>
                    <div class="stats-card-content">
                        <p class="text-3xl font-bold text-forest-green mb-1">{{ formatCurrency(averageTransaction) }}
                        </p>
                        <div class="flex items-center gap-2">
                            <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                <svg class="w-3 h-3 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                        clip-rule="evenodd" />
                                </svg>
                                +12.5%
                            </span>
                            <span class="text-natural-gray/70 text-sm">plus élevé</span>
                        </div>
                    </div>
                    <div class="stats-card-footer">
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-natural-gray/70">Objectif: {{ formatCurrency(450) }}</span>
                            <span class="font-medium text-forest-green">78%</span>
                        </div>
                    </div>
                </div>

                <!-- Carte 3: Nombre de transactions -->
                <div class="stats-card group" :style="{ animationDelay: '0.3s' }">
                    <div class="stats-card-header">
                        <div
                            class="w-12 h-12 rounded-xl bg-gradient-to-br from-golden-yellow/15 to-cream-light flex items-center justify-center mb-4">
                            <span class="text-2xl">🛒</span>
                        </div>
                        <h3 class="text-natural-gray text-sm font-medium">Transactions</h3>
                    </div>
                    <div class="stats-card-content">
                        <p class="text-3xl font-bold text-forest-green mb-1">{{ totalTransactions.toLocaleString() }}
                        </p>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center">
                                <span class="w-2 h-2 rounded-full bg-terracotta mr-2"></span>
                                <span class="text-natural-gray/70 text-sm">Succès: <strong
                                        class="text-forest-green">98.2%</strong></span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-card-footer">
                        <div class="flex -space-x-2">
                            <div v-for="n in 5" :key="n"
                                class="w-8 h-8 rounded-full bg-gradient-to-br from-forest-green to-terracotta-light border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                                {{ n }}
                            </div>
                            <div
                                class="w-8 h-8 rounded-full bg-cream-light border-2 border-white flex items-center justify-center text-xs text-natural-gray font-bold">
                                +{{ totalTransactions - 5 }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carte 4: Taux de conversion -->
                <div class="stats-card group" :style="{ animationDelay: '0.4s' }">
                    <div class="stats-card-header">
                        <div
                            class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-nature/15 to-cream-light flex items-center justify-center mb-4">
                            <span class="text-2xl">🎯</span>
                        </div>
                        <h3 class="text-natural-gray text-sm font-medium">Taux de Conversion</h3>
                    </div>
                    <div class="stats-card-content">
                        <p class="text-3xl font-bold text-forest-green mb-1">{{ conversionRate }}%</p>
                        <div class="flex items-center gap-2">
                            <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                                <svg class="w-3 h-3 mr-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clip-rule="evenodd" />
                                </svg>
                                +5.3%
                            </span>
                            <span class="text-natural-gray/70 text-sm">meilleure performance</span>
                        </div>
                    </div>
                    <div class="stats-card-footer">
                        <div class="w-full bg-cream-light rounded-full h-2">
                            <div class="bg-gradient-to-r from-blue-nature to-forest-green h-2 rounded-full"
                                :style="{ width: `${conversionRate}%` }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Graphiques et visualisations -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Graphique d'évolution des revenus -->
                <div
                    class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-natural-light border border-white/50 animate-in slide-in-from-bottom">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-forest-green mb-1">Évolution des Revenus</h3>
                            <p class="text-natural-gray/70">Tendance sur les 30 derniers jours</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button v-for="chartType in ['Ligne', 'Barre']" :key="chartType"
                                @click="selectedChart = chartType" :class="[
                                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out-custom',
                                    selectedChart === chartType
                                        ? 'bg-forest-green text-white'
                                        : 'text-natural-gray hover:bg-forest-green/10'
                                ]">
                                {{ chartType }}
                            </button>
                        </div>
                    </div>

                    <!-- Graphique simulé -->
                    <div class="h-64 relative">
                        <div class="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-between px-4">
                            <div v-for="(day, index) in revenueData" :key="index" class="flex flex-col items-center">
                                <div class="w-8 rounded-t-lg transition-all duration-500 ease-out-custom hover:scale-110 cursor-pointer"
                                    :style="{
                                        height: `${day.value / 5}px`,
                                        background: index % 3 === 0
                                            ? 'linear-gradient(to top, var(--terracotta), var(--terracotta-light))'
                                            : 'linear-gradient(to top, var(--forest-green), var(--forest-green-light))'
                                    }" @mouseenter="hoveredBar = index" @mouseleave="hoveredBar = null"></div>
                                <span class="text-xs text-natural-gray/70 mt-2">{{ day.label }}</span>
                            </div>
                        </div>

                        <!-- Ligne de tendance -->
                        <div class="absolute top-12 left-4 right-4 h-px bg-natural-gray/20"></div>
                        <div class="absolute top-24 left-4 right-4 h-px bg-natural-gray/20"></div>
                        <div class="absolute top-36 left-4 right-4 h-px bg-natural-gray/20"></div>

                        <!-- Tooltip au survol -->
                        <div v-if="hoveredBar !== null"
                            class="absolute bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 transition-all duration-300 ease-out-custom"
                            :style="{
                                left: `${(hoveredBar * 40) + 16}px`,
                                top: '20px',
                                transform: 'translateX(-50%)'
                            }">
                            <div class="text-sm font-bold text-forest-green">{{
                                formatCurrency(revenueData[hoveredBar].value) }}</div>
                            <div class="text-xs text-natural-gray/70">le {{ revenueData[hoveredBar].label }}</div>
                        </div>
                    </div>

                    <!-- Légende -->
                    <div class="flex justify-center gap-6 mt-6 pt-6 border-t border-natural-gray/10">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-sm bg-gradient-to-r from-terracotta to-terracotta-light"></div>
                            <span class="text-sm text-natural-gray">Week-end</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-sm bg-gradient-to-r from-forest-green to-forest-green-light">
                            </div>
                            <span class="text-sm text-natural-gray">Semaine</span>
                        </div>
                    </div>
                </div>

                <!-- Répartition des méthodes de paiement -->
                <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-natural-light border border-white/50 animate-in slide-in-from-bottom"
                    style="animation-delay: 0.1s">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-forest-green mb-1">Méthodes de Paiement</h3>
                            <p class="text-natural-gray/70">Répartition des transactions</p>
                        </div>
                        <div class="text-2xl">💳</div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div v-for="method in paymentMethods" :key="method.name"
                            class="flex items-center justify-between p-3 rounded-xl hover:bg-cream-light/50 transition-all duration-300 ease-out-custom group">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                    :style="{ background: method.color + '15' }">
                                    <span class="text-lg">{{ method.icon }}</span>
                                </div>
                                <div>
                                    <h4 class="font-medium text-forest-green">{{ method.name }}</h4>
                                    <p class="text-sm text-natural-gray/70">{{ method.transactions }} transactions</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-32 bg-cream-light rounded-full h-2">
                                    <div class="h-2 rounded-full" :style="{
                                        width: `${method.percentage}%`,
                                        background: method.color
                                    }"></div>
                                </div>
                                <span class="font-bold text-forest-green min-w-10">{{ method.percentage }}%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Graphique circulaire simulé -->
                    <div class="mt-8 pt-6 border-t border-natural-gray/10">
                        <div class="flex items-center justify-center">
                            <div class="relative w-40 h-40">
                                <!-- Cercle de fond -->
                                <div class="absolute inset-0 rounded-full bg-cream-light"></div>

                                <!-- Segments du graphique circulaire -->
                                <div v-for="(method, index) in paymentMethods" :key="method.name"
                                    class="absolute inset-0 rounded-full" :style="{
                                        clipPath: getPieSegment(index, paymentMethods.length, method.percentage),
                                        background: method.color
                                    }"></div>

                                <!-- Centre du graphique -->
                                <div class="absolute inset-8 rounded-full bg-white flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-forest-green">{{ totalTransactions }}</div>
                                        <div class="text-xs text-natural-gray/70">transactions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tableau des transactions récentes -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-natural-light border border-white/50 animate-in slide-in-from-bottom"
                style="animation-delay: 0.2s">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-forest-green mb-1">Transactions Récentes</h3>
                        <p class="text-natural-gray/70">Les dernières transactions validées</p>
                    </div>
                    <button
                        class="px-4 py-2 rounded-xl bg-forest-green/10 text-forest-green font-medium hover:bg-forest-green hover:text-white transition-all duration-300 ease-out-custom flex items-center gap-2">
                        <span>Exporter</span>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div class="overflow-x-auto rounded-2xl">
                    <table class="min-w-full divide-y divide-natural-gray/10">
                        <thead>
                            <tr class="bg-cream-light/50">
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-natural-gray uppercase tracking-wider rounded-tl-2xl">
                                    Client</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-natural-gray uppercase tracking-wider">
                                    Date</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-natural-gray uppercase tracking-wider">
                                    Méthode</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-natural-gray uppercase tracking-wider">
                                    Montant</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-natural-gray uppercase tracking-wider">
                                    Statut</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-natural-gray uppercase tracking-wider rounded-tr-2xl">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-natural-gray/10">
                            <tr v-for="transaction in recentTransactions" :key="transaction.id"
                                class="hover:bg-cream-light/30 transition-all duration-300 ease-out-custom">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="w-8 h-8 rounded-full bg-gradient-to-br from-forest-green/20 to-terracotta/20 flex items-center justify-center text-forest-green font-bold mr-3">
                                            {{ transaction.customer.initials }}
                                        </div>
                                        <div>
                                            <div class="font-medium text-forest-green">{{ transaction.customer.name }}
                                            </div>
                                            <div class="text-sm text-natural-gray/70">{{ transaction.customer.email }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-natural-gray">{{ transaction.date }}</div>
                                    <div class="text-sm text-natural-gray/70">{{ transaction.time }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
                                            :style="{ background: transaction.method.color + '15' }">
                                            <span>{{ transaction.method.icon }}</span>
                                        </div>
                                        <span>{{ transaction.method.name }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="font-bold text-forest-green">{{ formatCurrency(transaction.amount) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                                        transaction.status === 'Complété' ? 'bg-green-100 text-green-800' :
                                            transaction.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                    ]">
                                        <span :class="[
                                            'w-1.5 h-1.5 rounded-full mr-1.5',
                                            transaction.status === 'Complété' ? 'bg-green-500' :
                                                transaction.status === 'En attente' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                        ]"></span>
                                        {{ transaction.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <button
                                        class="px-3 py-1.5 rounded-lg bg-forest-green/10 text-forest-green hover:bg-forest-green hover:text-white transition-all duration-300 ease-out-custom text-sm font-medium">
                                        Détails
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex justify-between items-center mt-6 pt-6 border-t border-natural-gray/10">
                    <div class="text-sm text-natural-gray/70">
                        Affichage de {{ recentTransactions.length }} transactions sur {{ totalTransactions }} au total
                    </div>
                    <div class="flex gap-2">
                        <button
                            class="w-8 h-8 rounded-lg flex items-center justify-center bg-cream-light text-natural-gray hover:bg-forest-green hover:text-white transition-all duration-300 ease-out-custom">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button class="w-8 h-8 rounded-lg flex items-center justify-center bg-forest-green text-white">
                            1
                        </button>
                        <button
                            class="w-8 h-8 rounded-lg flex items-center justify-center bg-cream-light text-natural-gray hover:bg-forest-green hover:text-white transition-all duration-300 ease-out-custom">
                            2
                        </button>
                        <button
                            class="w-8 h-8 rounded-lg flex items-center justify-center bg-cream-light text-natural-gray hover:bg-forest-green hover:text-white transition-all duration-300 ease-out-custom">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PaymentStatsView',
    data() {
        return {
            activePeriod: 'month',
            selectedChart: 'Ligne',
            hoveredBar: null,
            timePeriods: [
                { id: 'day', label: 'Aujourd\'hui' },
                { id: 'week', label: '7 jours' },
                { id: 'month', label: 'Mois' },
                { id: 'quarter', label: 'Trimestre' },
                { id: 'year', label: 'Année' }
            ],
            totalRevenue: 12485.50,
            revenueChange: 15.2,
            averageTransaction: 68.40,
            totalTransactions: 182,
            conversionRate: 42.5,
            revenueData: [
                { label: 'Lun', value: 420 },
                { label: 'Mar', value: 580 },
                { label: 'Mer', value: 510 },
                { label: 'Jeu', value: 690 },
                { label: 'Ven', value: 820 },
                { label: 'Sam', value: 950 },
                { label: 'Dim', value: 720 },
                { label: 'Lun', value: 640 },
                { label: 'Mar', value: 710 },
                { label: 'Mer', value: 890 }
            ],
            paymentMethods: [
                { name: 'Carte Bancaire', icon: '💳', color: '#2E8B57', percentage: 65, transactions: 118 },
                { name: 'PayPal', icon: '🔗', color: '#00308F', percentage: 22, transactions: 40 },
                { name: 'Virement', icon: '🏦', color: '#B8860B', percentage: 8, transactions: 15 },
                { name: 'Espèces', icon: '💰', color: '#8B4513', percentage: 5, transactions: 9 }
            ],
            recentTransactions: [
                {
                    id: 1,
                    customer: { name: 'Marie Dubois', email: 'marie.dubois@email.com', initials: 'MD' },
                    date: '15 Fév 2026',
                    time: '14:30',
                    method: { name: 'Carte', icon: '💳', color: '#2E8B57' },
                    amount: 89.50,
                    status: 'Complété'
                },
                {
                    id: 2,
                    customer: { name: 'Jean Martin', email: 'jean.martin@email.com', initials: 'JM' },
                    date: '14 Fév 2026',
                    time: '11:15',
                    method: { name: 'PayPal', icon: '🔗', color: '#00308F' },
                    amount: 42.00,
                    status: 'Complété'
                },
                {
                    id: 3,
                    customer: { name: 'Sophie Leroy', email: 'sophie.leroy@email.com', initials: 'SL' },
                    date: '14 Fév 2026',
                    time: '09:45',
                    method: { name: 'Virement', icon: '🏦', color: '#B8860B' },
                    amount: 156.80,
                    status: 'En attente'
                },
                {
                    id: 4,
                    customer: { name: 'Pierre Bernard', email: 'pierre.bernard@email.com', initials: 'PB' },
                    date: '13 Fév 2026',
                    time: '16:20',
                    method: { name: 'Carte', icon: '💳', color: '#2E8B57' },
                    amount: 34.90,
                    status: 'Complété'
                },
                {
                    id: 5,
                    customer: { name: 'Élise Petit', email: 'elise.petit@email.com', initials: 'EP' },
                    date: '12 Fév 2026',
                    time: '13:10',
                    method: { name: 'Espèces', icon: '💰', color: '#8B4513' },
                    amount: 25.00,
                    status: 'Complété'
                }
            ]
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(value)
        },
        getPieSegment(index, totalSegments, percentage) {
            // Calcule les segments d'un graphique circulaire
            const startAngle = (index / totalSegments) * 360
            const angle = (percentage / 100) * 360
            const endAngle = startAngle + angle

            const startRad = (startAngle - 90) * Math.PI / 180
            const endRad = (endAngle - 90) * Math.PI / 180

            const x1 = 50 + 50 * Math.cos(startRad)
            const y1 = 50 + 50 * Math.sin(startRad)
            const x2 = 50 + 50 * Math.cos(endRad)
            const y2 = 50 + 50 * Math.sin(endRad)

            const largeArcFlag = angle > 180 ? 1 : 0

            return `path('M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z')`
        }
    }
}
</script>

<style scoped>
/* Variables CSS pour la palette de couleurs naturelle */
:root {
    --forest-green: #2E8B57;
    --forest-green-light: #3CB371;
    --terracotta: #B22222;
    --terracotta-light: #CD5C5C;
    --cream-light: #FFF8DC;
    --natural-gray: #556B2F;
    --golden-yellow: #DAA520;
    --blue-nature: #5F9EA0;
}

/* Animation d'entrée personnalisée */
@keyframes slideInFromBottom {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: slideInFromBottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Courbe de Bézier personnalisée pour fluidité */
.ease-out-custom {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation de feuille subtile */
@keyframes floatLeaf {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

.leaf-animation-1 {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,20 C70,10 90,30 80,50 C70,70 30,70 20,50 C10,30 30,10 50,20 Z" fill="%232E8B57" fill-opacity="0.05"/></svg>');
    background-repeat: no-repeat;
    animation: floatLeaf 15s ease-in-out infinite;
}

/* Styles des cartes de statistiques */
.stats-card {
    @apply bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-natural-light border border-white/50 transition-all duration-500 ease-out-custom hover:shadow-lg hover:scale-102 opacity-0 transform translate-y-4;
    animation: slideInFromBottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.stats-card:hover {
    transform: translateY(-4px) scale(1.02);
}

.stats-card-header {
    @apply mb-4;
}

.stats-card-content {
    @apply mb-6;
}

.stats-card-footer {
    @apply pt-4 border-t border-natural-gray/10;
}

/* Ombres naturelles */
.shadow-natural-light {
    box-shadow: 0 10px 30px rgba(46, 139, 87, 0.08), 0 4px 12px rgba(139, 69, 19, 0.05);
}

/* Styles pour les barres de progression */
.hover\:scale-102:hover {
    transform: scale(1.02);
}

/* Responsive */
@media (max-width: 768px) {
    .stats-card {
        @apply p-4;
    }
}
</style>