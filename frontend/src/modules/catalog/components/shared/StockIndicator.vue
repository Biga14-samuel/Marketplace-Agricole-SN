<template>
    <div class="organic-indicator-container relative overflow-hidden rounded-3xl">
        <!-- Animations de fond subtiles -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="leaf-float absolute top-3 left-3 text-4xl text-primary-green/20">🍃</div>
            <div class="leaf-float absolute top-2 right-2 text-3xl text-secondary-orange/20"
                style="animation-delay: 3s;">🌿</div>
            <div class="leaf-float absolute bottom-3 left-2 text-5xl text-forest-green/20" style="animation-delay: 6s;">
                🍂</div>
            <div class="leaf-float absolute bottom-2 right-3 text-4xl text-earth-brown/20" style="animation-delay: 9s;">
                🌱</div>
        </div>

        <!-- Texture de fond organique -->
        <div class="absolute inset-0 indicator-texture opacity-5"></div>

        <div class="relative z-10 p-6">
            <!-- En-tête de l'indicateur -->
            <div class="flex items-center justify-between mb-6 animate-slide-in-down">
                <div>
                    <h3 class="text-2xl font-bold text-forest-green">Indicateurs de Stock</h3>
                    <p class="text-earth-brown/80">État des stocks en temps réel</p>
                </div>

                <!-- Sélecteur de vue -->
                <div class="flex items-center space-x-3">
                    <button @click="refreshData"
                        class="p-2 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-700 hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                        title="Actualiser les données">
                        <span class="text-xl animate-spin-slow" :class="{ 'animate-spin': isRefreshing }">🔄</span>
                    </button>

                    <div class="relative">
                        <select v-model="timeRange"
                            class="px-3 py-2 pl-10 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic appearance-none cursor-pointer text-sm">
                            <option value="realtime">🕒 Temps réel</option>
                            <option value="today">📅 Aujourd'hui</option>
                            <option value="week">📊 Cette semaine</option>
                            <option value="month">🗓️ Ce mois</option>
                        </select>
                        <span class="absolute left-3 top-2.5 text-green-500">⏱️</span>
                    </div>
                </div>
            </div>

            <!-- Indicateurs principaux -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Stock Total -->
                <div class="organic-indicator-card animate-card-appear" style="animation-delay: 0.1s;">
                    <div class="card-inner">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">Stock Total</p>
                                <p class="text-3xl font-bold text-forest-green mt-1">{{ formatNumber(totalStock) }}</p>
                            </div>
                            <div
                                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                <span class="text-2xl text-green-600">📦</span>
                            </div>
                        </div>
                        <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                                :style="{ width: `${calculatePercentage(totalStock, maxCapacity)}%` }"
                                :class="getStockLevelClass(totalStock, maxCapacity)">
                            </div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-medium text-white drop-shadow">
                                    {{ calculatePercentage(totalStock, maxCapacity) }}%
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Capacité utilisée</span>
                            <span>{{ maxCapacity - totalStock }} unités libres</span>
                        </div>
                    </div>
                </div>

                <!-- Produits à risque -->
                <div class="organic-indicator-card animate-card-appear" style="animation-delay: 0.2s;">
                    <div class="card-inner">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">À risque</p>
                                <p class="text-3xl font-bold text-red-600 mt-1">{{ atRiskCount }}</p>
                            </div>
                            <div
                                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                <span class="text-2xl text-red-600 animate-pulse">🔥</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div v-for="product in atRiskProducts.slice(0, 3)" :key="product.id"
                                class="flex items-center justify-between p-2 bg-red-50/50 rounded-lg border border-red-100">
                                <div class="flex items-center space-x-2">
                                    <span class="text-lg">{{ product.icon }}</span>
                                    <span class="text-sm font-medium text-gray-800 truncate max-w-24">{{ product.name
                                        }}</span>
                                </div>
                                <span class="text-sm font-bold text-red-600">{{ product.stock }}</span>
                            </div>
                        </div>
                        <button @click="showAtRiskDetails"
                            class="w-full mt-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 transition-organic">
                            Voir tous ({{ atRiskCount }})
                        </button>
                    </div>
                </div>

                <!-- Rotation des stocks -->
                <div class="organic-indicator-card animate-card-appear" style="animation-delay: 0.3s;">
                    <div class="card-inner">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">Rotation</p>
                                <p class="text-3xl font-bold text-blue-600 mt-1">{{ turnoverRate }}x</p>
                            </div>
                            <div
                                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span class="text-2xl text-blue-600">📊</span>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Vitesse de rotation</span>
                                <span class="font-medium"
                                    :class="turnoverTrend >= 0 ? 'text-green-600' : 'text-red-600'">
                                    {{ turnoverTrend >= 0 ? '+' : '' }}{{ turnoverTrend }}%
                                </span>
                            </div>
                            <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-1000 transition-organic" :class="turnoverRate >= 8 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                    turnoverRate >= 5 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                        'bg-gradient-to-r from-red-500 to-red-600'"
                                    :style="{ width: `${Math.min(turnoverRate * 10, 100)}%` }">
                                </div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500">
                            <span class="flex items-center">
                                <span class="mr-1">📈</span>
                                {{ getTurnoverLabel(turnoverRate) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Valeur totale -->
                <div class="organic-indicator-card animate-card-appear" style="animation-delay: 0.4s;">
                    <div class="card-inner">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">Valeur totale</p>
                                <p class="text-3xl font-bold text-purple-600 mt-1">{{ formatCurrency(totalValue) }}</p>
                            </div>
                            <div
                                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                <span class="text-2xl text-purple-600">💰</span>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Évolution mensuelle</span>
                                <span class="font-medium" :class="valueTrend >= 0 ? 'text-green-600' : 'text-red-600'">
                                    {{ valueTrend >= 0 ? '+' : '' }}{{ valueTrend }}%
                                </span>
                            </div>
                            <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                                    :class="valueTrend >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'"
                                    :style="{ width: `${Math.min(Math.abs(valueTrend) * 5, 100)}%` }">
                                </div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500">
                            <span class="flex items-center">
                                <span class="mr-1">📦</span>
                                Valeur moyenne: {{ formatCurrency(averageValue) }}/unité
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Graphique d'évolution -->
            <div
                class="organic-chart-card bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 shadow-sm mb-8 animate-fade-in">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h4 class="text-xl font-semibold text-forest-green mb-1">Évolution du stock</h4>
                        <p class="text-sm text-gray-600">Sur les 30 derniers jours</p>
                    </div>
                    <div class="flex items-center space-x-4 mt-4 md:mt-0">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 rounded-full bg-gradient-to-r from-primary-green to-green-600"></div>
                            <span class="text-sm text-gray-700">Stock</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 rounded-full bg-gradient-to-r from-secondary-orange to-orange-600">
                            </div>
                            <span class="text-sm text-gray-700">Mouvements</span>
                        </div>
                    </div>
                </div>

                <!-- Graphique simple -->
                <div class="relative h-64">
                    <div class="absolute inset-0 flex items-end">
                        <div v-for="(day, index) in stockHistory" :key="index"
                            class="flex-1 mx-1 flex flex-col items-center" @mouseenter="hoverDay = index"
                            @mouseleave="hoverDay = null">
                            <!-- Barre de stock -->
                            <div class="w-8 rounded-t-lg transition-all duration-300 transition-organic hover:opacity-80"
                                :class="hoverDay === index ? 'bg-gradient-to-t from-primary-green to-green-500' : 'bg-gradient-to-t from-primary-green/70 to-green-500/70'"
                                :style="{ height: `${(day.stock / maxDailyStock) * 80}%` }">
                                <div v-if="hoverDay === index"
                                    class="absolute bottom-full mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transform -translate-x-1/2 left-1/2">
                                    {{ day.stock }} unités
                                </div>
                            </div>

                            <!-- Ligne de mouvements -->
                            <div class="w-1 mt-2 transition-all duration-300 transition-organic hover:opacity-80"
                                :class="hoverDay === index ? 'bg-gradient-to-t from-secondary-orange to-orange-500' : 'bg-gradient-to-t from-secondary-orange/70 to-orange-500/70'"
                                :style="{ height: `${(day.movements / maxDailyMovements) * 40}%` }"></div>

                            <!-- Jour -->
                            <div class="mt-2 text-xs text-gray-500">{{ day.day }}</div>
                        </div>
                    </div>

                    <!-- Ligne de référence -->
                    <div class="absolute left-0 right-0 h-px bg-gray-300" style="top: 50%;"></div>
                    <div class="absolute left-0 right-0 h-px bg-gray-300" style="top: 25%;"></div>
                    <div class="absolute left-0 right-0 h-px bg-gray-300" style="top: 75%;"></div>
                </div>

                <!-- Légende du graphique -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                <span class="text-xl text-green-600">📈</span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Stock max ce mois</p>
                                <p class="text-lg font-bold text-gray-900">{{ maxStockThisMonth }} unités</p>
                            </div>
                        </div>

                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span class="text-xl text-blue-600">📉</span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Stock min ce mois</p>
                                <p class="text-lg font-bold text-gray-900">{{ minStockThisMonth }} unités</p>
                            </div>
                        </div>

                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                <span class="text-xl text-purple-600">⚖️</span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Variation moyenne</p>
                                <p class="text-lg font-bold text-gray-900">{{ averageDailyChange }} unités/jour</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Distribution par catégorie -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Répartition -->
                <div
                    class="organic-distribution-card bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 shadow-sm animate-fade-in">
                    <h4 class="text-xl font-semibold text-forest-green mb-6">Répartition par catégorie</h4>

                    <div class="space-y-4">
                        <div v-for="category in categories" :key="category.id" class="flex items-center">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                                :class="category.colorClass">
                                <span class="text-xl">{{ category.icon }}</span>
                            </div>

                            <div class="flex-1">
                                <div class="flex justify-between mb-1">
                                    <span class="font-medium text-gray-800">{{ category.name }}</span>
                                    <span class="font-bold" :class="category.textClass">{{ category.percentage
                                        }}%</span>
                                </div>

                                <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                                        :class="category.barClass" :style="{ width: `${category.percentage}%` }">
                                    </div>
                                </div>

                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{{ category.count }} produits</span>
                                    <span>{{ category.stock }} unités</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-gray-600">
                                <span class="flex items-center">
                                    <span class="mr-2">📊</span>
                                    Diversité des stocks
                                </span>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-forest-green">{{ categories.length }}</p>
                                <p class="text-xs text-gray-500">catégories actives</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alertes et recommandations -->
                <div
                    class="organic-alerts-card bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 shadow-sm animate-fade-in">
                    <h4 class="text-xl font-semibold text-forest-green mb-6">Alertes & Recommandations</h4>

                    <div class="space-y-4">
                        <div v-for="alert in alerts" :key="alert.id"
                            class="p-4 rounded-xl border transition-all duration-300 transition-organic hover:scale-[1.02] cursor-pointer"
                            :class="alert.severityClass">
                            <div class="flex items-start">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-4"
                                    :class="alert.iconClass">
                                    <span class="text-xl">{{ alert.icon }}</span>
                                </div>

                                <div class="flex-1">
                                    <div class="flex justify-between items-start">
                                        <h5 class="font-semibold text-gray-900">{{ alert.title }}</h5>
                                        <span class="text-xs px-2 py-1 rounded-full" :class="alert.badgeClass">
                                            {{ alert.priority }}
                                        </span>
                                    </div>

                                    <p class="text-sm text-gray-600 mt-1">{{ alert.description }}</p>

                                    <div class="flex items-center justify-between mt-3">
                                        <div class="flex items-center text-xs text-gray-500">
                                            <span class="mr-3">📅 {{ alert.date }}</span>
                                            <span>⏰ {{ alert.time }}</span>
                                        </div>

                                        <button @click.stop="handleAlertAction(alert)"
                                            class="text-sm font-medium px-3 py-1 rounded-lg transition-all duration-300 transition-organic hover:scale-105"
                                            :class="alert.actionClass">
                                            {{ alert.action }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Résumé des alertes -->
                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <div class="grid grid-cols-3 gap-4">
                            <div class="text-center">
                                <p class="text-sm text-gray-600">Critiques</p>
                                <p class="text-2xl font-bold text-red-600">{{ criticalAlertsCount }}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-sm text-gray-600">Avertissements</p>
                                <p class="text-2xl font-bold text-amber-600">{{ warningAlertsCount }}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-sm text-gray-600">Informations</p>
                                <p class="text-2xl font-bold text-blue-600">{{ infoAlertsCount }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pied de page -->
            <div class="mt-8 pt-6 border-t border-green-100">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div class="text-sm text-gray-600">
                        <p class="flex items-center">
                            <span class="mr-2 text-xl">💡</span>
                            Les indicateurs sont mis à jour toutes les 15 minutes
                        </p>
                    </div>

                    <div class="flex items-center space-x-3">
                        <button @click="exportData"
                            class="px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-300 text-green-700 rounded-lg hover:shadow-md transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                            <span class="text-lg">📥</span>
                            <span>Exporter</span>
                        </button>

                        <button @click="showDetailedReport"
                            class="px-4 py-2 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                            <span class="text-lg">📋</span>
                            <span>Rapport détaillé</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StockIndicator',
    props: {
        initialData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            timeRange: 'realtime',
            isRefreshing: false,
            hoverDay: null,
            totalStock: 1250,
            maxCapacity: 2000,
            atRiskCount: 8,
            turnoverRate: 6.2,
            turnoverTrend: 12,
            totalValue: 42500,
            valueTrend: 8.5,
            averageValue: 34,
            maxStockThisMonth: 1450,
            minStockThisMonth: 980,
            averageDailyChange: 45,
            maxDailyStock: 1500,
            maxDailyMovements: 300,
            criticalAlertsCount: 3,
            warningAlertsCount: 5,
            infoAlertsCount: 7,
            atRiskProducts: [
                { id: 1, name: 'Pommes Golden', icon: '🍎', stock: 15 },
                { id: 2, name: 'Carottes Nouvelles', icon: '🥕', stock: 25 },
                { id: 3, name: 'Fraises Gariguette', icon: '🍓', stock: 8 },
                { id: 4, name: 'Salade Batavia', icon: '🥬', stock: 30 },
                { id: 5, name: 'Tomates Cerises', icon: '🍅', stock: 42 }
            ],
            stockHistory: [
                { day: '1', stock: 1200, movements: 150 },
                { day: '5', stock: 1150, movements: 180 },
                { day: '10', stock: 1250, movements: 220 },
                { day: '15', stock: 1100, movements: 190 },
                { day: '20', stock: 1300, movements: 250 },
                { day: '25', stock: 1250, movements: 210 },
                { day: '30', stock: 1400, movements: 280 }
            ],
            categories: [
                {
                    id: 1, name: 'Fruits', icon: '🍎', percentage: 35, count: 12, stock: 438,
                    colorClass: 'bg-gradient-to-br from-red-100 to-pink-200',
                    barClass: 'bg-gradient-to-r from-red-500 to-pink-600',
                    textClass: 'text-red-600'
                },
                {
                    id: 2, name: 'Légumes', icon: '🥕', percentage: 28, count: 15, stock: 350,
                    colorClass: 'bg-gradient-to-br from-green-100 to-emerald-200',
                    barClass: 'bg-gradient-to-r from-green-500 to-emerald-600',
                    textClass: 'text-green-600'
                },
                {
                    id: 3, name: 'Produits laitiers', icon: '🥛', percentage: 18, count: 8, stock: 225,
                    colorClass: 'bg-gradient-to-br from-blue-100 to-cyan-200',
                    barClass: 'bg-gradient-to-r from-blue-500 to-cyan-600',
                    textClass: 'text-blue-600'
                },
                {
                    id: 4, name: 'Viandes', icon: '🥩', percentage: 12, count: 6, stock: 150,
                    colorClass: 'bg-gradient-to-br from-amber-100 to-orange-200',
                    barClass: 'bg-gradient-to-r from-amber-500 to-orange-600',
                    textClass: 'text-amber-600'
                },
                {
                    id: 5, name: 'Épicerie', icon: '🥫', percentage: 7, count: 10, stock: 87,
                    colorClass: 'bg-gradient-to-br from-purple-100 to-violet-200',
                    barClass: 'bg-gradient-to-r from-purple-500 to-violet-600',
                    textClass: 'text-purple-600'
                }
            ],
            alerts: [
                {
                    id: 1,
                    title: 'Stock critique de pommes',
                    description: 'Les pommes Golden approchent du seuil minimum (15 unités restantes)',
                    icon: '🍎',
                    priority: 'Critique',
                    date: 'Aujourd\'hui',
                    time: '14:30',
                    action: 'Réapprovisionner',
                    severityClass: 'bg-gradient-to-r from-red-50/50 to-red-100/30 border-red-200',
                    iconClass: 'bg-gradient-to-br from-red-100 to-red-200',
                    badgeClass: 'bg-red-100 text-red-800',
                    actionClass: 'bg-red-100 text-red-700 hover:bg-red-200'
                },
                {
                    id: 2,
                    title: 'Rotation lente des carottes',
                    description: 'Les carottes ont une rotation inférieure à la moyenne du secteur',
                    icon: '🥕',
                    priority: 'Avertissement',
                    date: 'Hier',
                    time: '16:45',
                    action: 'Analyser',
                    severityClass: 'bg-gradient-to-r from-amber-50/50 to-amber-100/30 border-amber-200',
                    iconClass: 'bg-gradient-to-br from-amber-100 to-amber-200',
                    badgeClass: 'bg-amber-100 text-amber-800',
                    actionClass: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                },
                {
                    id: 3,
                    title: 'Excédent de salades',
                    description: 'Le stock de salades Batavia dépasse la capacité optimale de 30%',
                    icon: '🥬',
                    priority: 'Information',
                    date: '15 Jan',
                    time: '09:15',
                    action: 'Optimiser',
                    severityClass: 'bg-gradient-to-r from-blue-50/50 to-blue-100/30 border-blue-200',
                    iconClass: 'bg-gradient-to-br from-blue-100 to-blue-200',
                    badgeClass: 'bg-blue-100 text-blue-800',
                    actionClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }
            ]
        }
    },
    computed: {
        // Calculer le pourcentage de stock utilisé
        stockPercentage() {
            return this.calculatePercentage(this.totalStock, this.maxCapacity)
        }
    },
    methods: {
        calculatePercentage(value, max) {
            return Math.round((value / max) * 100)
        },

        getStockLevelClass(value, max) {
            const percentage = this.calculatePercentage(value, max)
            if (percentage >= 90) return 'bg-gradient-to-r from-red-500 to-red-600'
            if (percentage >= 70) return 'bg-gradient-to-r from-amber-500 to-amber-600'
            if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
            return 'bg-gradient-to-r from-green-500 to-green-600'
        },

        getTurnoverLabel(rate) {
            if (rate >= 8) return 'Rotation excellente'
            if (rate >= 5) return 'Rotation normale'
            if (rate >= 3) return 'Rotation lente'
            return 'Rotation critique'
        },

        formatNumber(num) {
            return num.toLocaleString('fr-FR')
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
            }).format(amount)
        },

        refreshData() {
            this.isRefreshing = true

            // Simuler une requête API
            setTimeout(() => {
                // Mettre à jour quelques données aléatoirement
                this.totalStock = Math.floor(1200 + Math.random() * 300)
                this.turnoverRate = parseFloat((5 + Math.random() * 4).toFixed(1))
                this.turnoverTrend = parseFloat((Math.random() * 20 - 5).toFixed(1))
                this.totalValue = Math.floor(40000 + Math.random() * 5000)
                this.valueTrend = parseFloat((Math.random() * 15 - 3).toFixed(1))

                // Mettre à jour les alertes
                this.atRiskCount = Math.floor(5 + Math.random() * 5)

                this.isRefreshing = false

                // Animation de succès
                this.showRefreshSuccess()
            }, 1500)
        },

        showRefreshSuccess() {
            // Ajouter une animation visuelle de succès
            const refreshBtn = document.querySelector('[title="Actualiser les données"]')
            if (refreshBtn) {
                refreshBtn.classList.add('bg-green-100', 'border-green-300', 'text-green-700')
                setTimeout(() => {
                    refreshBtn.classList.remove('bg-green-100', 'border-green-300', 'text-green-700')
                }, 1000)
            }
        },

        showAtRiskDetails() {
            console.log('Afficher les détails des produits à risque')
            this.$emit('show-risk-details', this.atRiskProducts)
        },

        handleAlertAction(alert) {
            console.log('Action sur alerte:', alert)
            this.$emit('alert-action', alert)
        },

        exportData() {
            console.log('Exporter les données')
            // Logique d'export
            this.$emit('export-data', {
                totalStock: this.totalStock,
                totalValue: this.totalValue,
                turnoverRate: this.turnoverRate,
                categories: this.categories
            })
        },

        showDetailedReport() {
            console.log('Afficher le rapport détaillé')
            this.$emit('show-report')
        }
    },
    mounted() {
        // Initialiser les données si fournies en props
        if (this.initialData && Object.keys(this.initialData).length > 0) {
            Object.assign(this, this.initialData)
        }
    }
}
</script>

<style scoped>
/* Variables de couleur */
:root {
    --primary-green: #45a348;
    --secondary-orange: #ff8c42;
    --forest-green: #2d5016;
    --earth-brown: #8b4513;
}

/* Conteneur principal */
.organic-indicator-container {
    background: linear-gradient(135deg,
            rgba(240, 253, 244, 0.95) 0%,
            /* Vert très pâle */
            rgba(220, 252, 231, 0.9) 25%,
            /* Vert clair */
            rgba(255, 255, 255, 1) 50%,
            /* Blanc */
            rgba(254, 243, 199, 0.9) 75%,
            /* Jaune pâle */
            rgba(240, 253, 244, 0.95) 100%
            /* Boucle */
        );
}

/* Texture de fond */
.indicator-texture {
    background-image:
        radial-gradient(circle at 15% 25%, rgba(69, 163, 72, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 85% 75%, rgba(255, 140, 66, 0.03) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' fill='%2345a348' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 150px 150px, 120px 120px, 80px 80px;
}

/* Animation d'entrée */
@keyframes slide-in-down {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes card-appear {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.animate-slide-in-down {
    animation: slide-in-down 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-card-appear {
    animation: card-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-fade-in {
    animation: fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Animation de rotation lente */
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 3s linear infinite;
}

/* Cartes d'indicateurs */
.organic-indicator-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(69, 163, 72, 0.1);
    border-radius: 20px;
    padding: 1px;
    position: relative;
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.organic-indicator-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(69, 163, 72, 0.1);
}

.organic-indicator-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg,
            var(--primary-green) 0%,
            transparent 30%,
            var(--secondary-orange) 70%,
            transparent 100%);
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.3;
    pointer-events: none;
}

.card-inner {
    background: white;
    border-radius: 19px;
    padding: 1.5rem;
    height: 100%;
}

/* Cartes organiques */
.organic-chart-card,
.organic-distribution-card,
.organic-alerts-card {
    position: relative;
    border: 1px solid transparent;
    background-clip: padding-box;
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.organic-chart-card::before,
.organic-distribution-card::before,
.organic-alerts-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg,
            var(--primary-green) 0%,
            rgba(255, 140, 66, 0.2) 50%,
            var(--primary-green) 100%);
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.2;
    pointer-events: none;
}

/* Animation des feuilles */
@keyframes leaf-float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    33% {
        transform: translateY(-10px) rotate(5deg);
    }

    66% {
        transform: translateY(5px) rotate(-2deg);
    }
}

.leaf-float {
    animation: leaf-float 15s ease-in-out infinite;
}

/* Transitions organiques */
.transition-organic {
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition-duration: 300ms;
}

/* Animation de pulsation */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Barres de progression animées */
.progress-bar {
    position: relative;
    overflow: hidden;
}

.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%);
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .organic-indicator-container {
        border-radius: 1.5rem;
        padding: 1rem;
    }

    .organic-indicator-card .card-inner {
        padding: 1rem;
    }

    .grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
    }

    .grid-cols-2 {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .grid-cols-4 {
        grid-template-columns: 1fr;
    }

    .flex-col {
        flex-direction: column;
        align-items: stretch;
    }

    .text-3xl {
        font-size: 1.75rem;
    }

    .text-2xl {
        font-size: 1.5rem;
    }
}

/* Effet de survol pour les cartes */
.organic-indicator-card:hover::before {
    animation: border-flow 3s linear infinite;
}

@keyframes border-flow {
    0% {
        background: linear-gradient(135deg,
                var(--primary-green) 0%,
                transparent 30%,
                var(--secondary-orange) 70%,
                transparent 100%);
    }

    50% {
        background: linear-gradient(135deg,
                transparent 0%,
                var(--secondary-orange) 30%,
                transparent 70%,
                var(--primary-green) 100%);
    }

    100% {
        background: linear-gradient(135deg,
                var(--primary-green) 0%,
                transparent 30%,
                var(--secondary-orange) 70%,
                transparent 100%);
    }
}
</style>