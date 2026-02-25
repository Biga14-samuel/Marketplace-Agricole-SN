<template>
    <div class="producer-dashboard min-h-screen">
        <!-- Arrière-plan organique avec dégradé et animation -->
        <div class="fixed inset-0 -z-20 bg-gradient-to-br from-forest-30/90 via-cream-40/80 to-terracotta-30/60">
            <div class="absolute inset-0 bg-vegetable-pattern opacity-5"></div>
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-forest-500/10 to-transparent"></div>
        </div>

        <!-- Navigation latérale -->
        <aside class="fixed left-0 top-0 h-full w-20 lg:w-64 z-30">
            <div class="h-full bg-white/90 backdrop-blur-xl border-r border-forest-100/30 flex flex-col">
                <!-- Logo -->
                <div class="p-6 border-b border-forest-100/30">
                    <div class="flex items-center justify-center lg:justify-start space-x-3">
                        <div class="p-3 bg-gradient-to-br from-forest-400 to-forest-600 rounded-xl shadow-lg">
                            <span class="text-2xl">🌱</span>
                        </div>
                        <div class="hidden lg:block">
                            <h1 class="font-serif text-xl font-bold text-forest-800">Mon Fermier</h1>
                            <p class="text-xs text-terracotta-600">Producteur</p>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 p-4 space-y-2">
                    <router-link to="/producer/dashboard"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group"
                        :class="{ 'bg-forest-50 text-forest-700 shadow-sm': $route.path === '/producer/dashboard', 'text-forest-600 hover:bg-forest-25': $route.path !== '/producer/dashboard' }">
                        <span class="text-xl">📊</span>
                        <span class="hidden lg:block">Tableau de bord</span>
                    </router-link>

                    <router-link to="/producer/profile"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group hover:bg-forest-25 text-forest-600">
                        <span class="text-xl">👤</span>
                        <span class="hidden lg:block">Mon Profil</span>
                    </router-link>

                    <router-link to="/producer/products"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group hover:bg-forest-25 text-forest-600">
                        <span class="text-xl">🥕</span>
                        <span class="hidden lg:block">Mes Produits</span>
                    </router-link>

                    <router-link to="/producer/orders"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group hover:bg-forest-25 text-forest-600">
                        <span class="text-xl">📦</span>
                        <span class="hidden lg:block">Commandes</span>
                        <span
                            class="hidden lg:block ml-auto bg-forest-100 text-forest-700 text-xs px-2 py-1 rounded-full">
                            {{ pendingOrders }}
                        </span>
                    </router-link>

                    <router-link to="/producer/pickup-points"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group hover:bg-forest-25 text-forest-600">
                        <span class="text-xl">📍</span>
                        <span class="hidden lg:block">Points de retrait</span>
                    </router-link>

                    <router-link to="/producer/schedule"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group hover:bg-forest-25 text-forest-600">
                        <span class="text-xl">🕒</span>
                        <span class="hidden lg:block">Horaires</span>
                    </router-link>

                    <router-link to="/producer/verification"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group hover:bg-forest-25 text-forest-600">
                        <span class="text-xl">✅</span>
                        <span class="hidden lg:block">Vérification</span>
                    </router-link>

                    <router-link to="/producer/settings"
                        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-organic group hover:bg-forest-25 text-forest-600">
                        <span class="text-xl">⚙️</span>
                        <span class="hidden lg:block">Paramètres</span>
                    </router-link>
                </nav>

                <!-- Statut producteur -->
                <div class="p-4 border-t border-forest-100/30">
                    <div class="hidden lg:block p-3 bg-gradient-to-r from-forest-50 to-cream-50 rounded-xl">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-xs font-medium px-2 py-1 rounded-full"
                                :class="verificationStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                                {{ verificationStatus === 'verified' ? '✅ Vérifié' : '🔄 En attente' }}
                            </span>
                        </div>
                        <p class="text-xs text-forest-600">Producteur depuis {{ joinDate }}</p>
                    </div>
                    <div class="lg:hidden text-center">
                        <div
                            class="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center">
                            <span class="text-white">👨‍🌾</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Contenu principal -->
        <main class="ml-20 lg:ml-64 p-6 lg:p-8">
            <!-- En-tête du dashboard -->
            <header class="mb-8 animate-slide-up">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl lg:text-3xl font-serif font-bold text-forest-800">
                            Bonjour, {{ producerName }} ! 👋
                        </h1>
                        <p class="text-terracotta-600 mt-1">
                            Voici un résumé de votre activité aujourd'hui
                        </p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Notifications -->
                        <button @click="toggleNotifications"
                            class="relative p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-forest-100 hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic">
                            <span class="text-xl">🔔</span>
                            <span v-if="unreadNotifications > 0"
                                class="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {{ unreadNotifications }}
                            </span>
                        </button>

                        <!-- Ajouter produit -->
                        <router-link to="/producer/products/new"
                            class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>➕</span>
                            <span class="hidden lg:inline">Nouveau produit</span>
                        </router-link>
                    </div>
                </div>

                <!-- Date et météo -->
                <div class="mt-4 flex items-center space-x-4 text-sm text-forest-600">
                    <span>📅 {{ currentDate }}</span>
                    <span>•</span>
                    <span>🌤️ {{ weather }}</span>
                    <span>•</span>
                    <span>📍 {{ pickupPointsOpen }}/{{ pickupPointsTotal }} points ouverts</span>
                </div>
            </header>

            <!-- Cartes de statistiques -->
            <section class="mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up"
                    style="animation-delay: 100ms">
                    <!-- Chiffre d'affaires -->
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6 hover:shadow-md hover:border-forest-200 transition-all duration-300 ease-organic group">
                        <div class="flex items-center justify-between mb-4">
                            <div
                                class="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <span class="text-2xl">💰</span>
                            </div>
                            <span class="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">+12%</span>
                        </div>
                        <div class="mb-2">
                            <div class="text-2xl font-bold text-forest-800">{{ formatXaf(revenue) }}</div>
                            <div class="text-sm text-terracotta-600">Chiffre d'affaires</div>
                        </div>
                        <div class="text-xs text-forest-600">Ce mois</div>
                    </div>

                    <!-- Commandes en attente -->
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6 hover:shadow-md hover:border-forest-200 transition-all duration-300 ease-organic group">
                        <div class="flex items-center justify-between mb-4">
                            <div
                                class="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <span class="text-2xl">📦</span>
                            </div>
                            <span class="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full">À préparer</span>
                        </div>
                        <div class="mb-2">
                            <div class="text-2xl font-bold text-forest-800">{{ pendingOrders }}</div>
                            <div class="text-sm text-terracotta-600">Commandes en attente</div>
                        </div>
                        <div class="text-xs text-forest-600">Aujourd'hui</div>
                    </div>

                    <!-- Évaluation -->
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6 hover:shadow-md hover:border-forest-200 transition-all duration-300 ease-organic group">
                        <div class="flex items-center justify-between mb-4">
                            <div
                                class="p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <span class="text-2xl">⭐</span>
                            </div>
                            <span class="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">{{ reviews }}
                                avis</span>
                        </div>
                        <div class="mb-2">
                            <div class="flex items-center space-x-2">
                                <div class="text-2xl font-bold text-forest-800">{{ rating }}</div>
                                <div class="flex">
                                    <span v-for="n in 5" :key="n" class="text-lg">
                                        {{ n <= Math.floor(rating) ? '⭐' : '☆' }} </span>
                                </div>
                            </div>
                            <div class="text-sm text-terracotta-600">Évaluation moyenne</div>
                        </div>
                        <div class="text-xs text-forest-600">Basé sur {{ reviews }} avis</div>
                    </div>

                    <!-- Produits en stock -->
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6 hover:shadow-md hover:border-forest-200 transition-all duration-300 ease-organic group">
                        <div class="flex items-center justify-between mb-4">
                            <div
                                class="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <span class="text-2xl">🥕</span>
                            </div>
                            <span class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{{ lowStockCount }}
                                bas</span>
                        </div>
                        <div class="mb-2">
                            <div class="text-2xl font-bold text-forest-800">{{ productsTotal }}</div>
                            <div class="text-sm text-terracotta-600">Produits en stock</div>
                        </div>
                        <div class="text-xs text-forest-600">{{ productsAvailable }} disponibles</div>
                    </div>
                </div>
            </section>

            <!-- Grille principale -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Colonne gauche : Commandes récentes -->
                <div class="lg:col-span-2">
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden animate-slide-up"
                        style="animation-delay: 200ms">
                        <div
                            class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">📦</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Commandes récentes
                                    </h2>
                                </div>
                                <router-link to="/producer/orders"
                                    class="text-sm text-forest-600 hover:text-forest-700 flex items-center space-x-1 transition-colors duration-200">
                                    <span>Tout voir</span>
                                    <span>➡️</span>
                                </router-link>
                            </div>
                        </div>

                        <div class="p-6">
                            <div v-if="recentOrders.length === 0" class="text-center py-12">
                                <span class="text-4xl block mb-4">📭</span>
                                <p class="text-lg text-forest-700 mb-2">Aucune commande récente</p>
                                <p class="text-sm text-terracotta-600">Les commandes apparaîtront ici</p>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="order in recentOrders" :key="order.id"
                                    class="bg-white border border-forest-100 rounded-xl p-4 hover:shadow-sm hover:border-forest-200 transition-all duration-300 ease-organic group">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center space-x-3">
                                            <div class="p-2 rounded-lg" :class="{
                                                'bg-green-100': order.status === 'delivered',
                                                'bg-orange-100': order.status === 'pending',
                                                'bg-blue-100': order.status === 'processing'
                                            }">
                                                <span class="text-lg">{{ order.status === 'pending' ? '⏳' : '✅'
                                                    }}</span>
                                            </div>
                                            <div>
                                                <div class="font-medium text-forest-800">Commande #{{ order.id }}</div>
                                                <div class="text-sm text-terracotta-600">{{ order.customerName }}</div>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="font-bold text-forest-800">{{ formatXaf(order.amount) }}</div>
                                            <div class="text-xs text-forest-600">{{ order.time }}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-2">
                                            <span class="text-xs px-2 py-1 rounded-full" :class="{
                                                'bg-green-50 text-green-700': order.status === 'delivered',
                                                'bg-orange-50 text-orange-700': order.status === 'pending',
                                                'bg-blue-50 text-blue-700': order.status === 'processing'
                                            }">
                                                {{ order.statusText }}
                                            </span>
                                            <span class="text-xs text-forest-600">{{ order.items }} articles</span>
                                        </div>
                                        <button @click="viewOrder(order)"
                                            class="text-sm text-forest-600 hover:text-forest-700 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-1">
                                            <span>Voir</span>
                                            <span>➡️</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Produits populaires -->
                    <div class="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden animate-slide-up"
                        style="animation-delay: 300ms">
                        <div
                            class="bg-gradient-to-r from-cream-50 to-forest-50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">🏆</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Produits populaires
                                    </h2>
                                </div>
                                <span class="text-sm text-forest-600">Ce mois</span>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="space-y-6">
                                <div v-for="product in popularProducts" :key="product.id"
                                    class="flex items-center space-x-4 group">
                                    <div class="relative">
                                        <div
                                            class="w-16 h-16 rounded-xl bg-gradient-to-br from-forest-100 to-cream-100 flex items-center justify-center">
                                            <span class="text-2xl">{{ product.icon }}</span>
                                        </div>
                                        <div v-if="product.trend === 'up'"
                                            class="absolute -top-2 -right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                            📈
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-1">
                                            <div class="font-medium text-forest-800">{{ product.name }}</div>
                                            <div class="font-bold text-forest-700">{{ product.sales }} ventes</div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="text-sm text-terracotta-600">{{ product.category }}</div>
                                            <div class="flex items-center space-x-1">
                                                <div class="w-24 h-2 bg-forest-100 rounded-full overflow-hidden">
                                                    <div class="h-full bg-gradient-to-r from-forest-400 to-forest-500 rounded-full transition-all duration-1000 ease-organic"
                                                        :style="{ width: `${product.percentage}%` }"></div>
                                                </div>
                                                <span class="text-xs text-forest-600">{{ product.percentage }}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonne droite : Actions rapides & Calendrier -->
                <div>
                    <!-- Actions rapides -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden mb-8 animate-slide-up"
                        style="animation-delay: 400ms">
                        <div
                            class="bg-gradient-to-r from-forest-50 to-terracotta-50/50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center space-x-3">
                                <span class="text-xl">⚡</span>
                                <h2 class="text-xl font-serif font-semibold text-forest-800">
                                    Actions rapides
                                </h2>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="grid grid-cols-2 gap-4">
                                <button @click="goTo('products')"
                                    class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300 ease-organic flex flex-col items-center justify-center group">
                                    <span class="text-2xl mb-2">🥕</span>
                                    <span class="text-sm font-medium text-forest-700 text-center">Ajouter produit</span>
                                </button>

                                <button @click="goTo('orders')"
                                    class="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300 ease-organic flex flex-col items-center justify-center group">
                                    <span class="text-2xl mb-2">📦</span>
                                    <span class="text-sm font-medium text-forest-700 text-center">Voir commandes</span>
                                </button>

                                <button @click="goTo('schedule')"
                                    class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300 ease-organic flex flex-col items-center justify-center group">
                                    <span class="text-2xl mb-2">🕒</span>
                                    <span class="text-sm font-medium text-forest-700 text-center">Modifier
                                        horaires</span>
                                </button>

                                <button @click="goTo('pickup-points')"
                                    class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300 ease-organic flex flex-col items-center justify-center group">
                                    <span class="text-2xl mb-2">📍</span>
                                    <span class="text-sm font-medium text-forest-700 text-center">Points de
                                        retrait</span>
                                </button>
                            </div>

                            <!-- Notifications urgentes -->
                            <div v-if="urgentTasks.length > 0" class="mt-6 pt-6 border-t border-forest-100">
                                <h3 class="text-sm font-medium text-forest-700 mb-3 flex items-center space-x-2">
                                    <span>🚨</span>
                                    <span>À faire aujourd'hui</span>
                                </h3>
                                <div class="space-y-3">
                                    <div v-for="task in urgentTasks" :key="task.id"
                                        class="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                                        <span class="text-lg">{{ task.icon }}</span>
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-forest-800">{{ task.title }}</div>
                                            <div class="text-xs text-terracotta-600">{{ task.time }}</div>
                                        </div>
                                        <button @click="completeTask(task)"
                                            class="text-sm px-3 py-1 bg-forest-500 text-white rounded-lg hover:bg-forest-600 transition-colors">
                                            Fait
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Calendrier -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden animate-slide-up"
                        style="animation-delay: 500ms">
                        <div
                            class="bg-gradient-to-r from-cream-50 to-forest-50/50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">📅</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Calendrier
                                    </h2>
                                </div>
                                <span class="text-sm text-forest-600">{{ currentMonth }}</span>
                            </div>
                        </div>

                        <div class="p-6">
                            <!-- Jours de la semaine -->
                            <div class="grid grid-cols-7 gap-1 mb-4">
                                <div v-for="day in ['L', 'M', 'M', 'J', 'V', 'S', 'D']" :key="day"
                                    class="text-center text-xs font-medium text-terracotta-600">
                                    {{ day }}
                                </div>
                            </div>

                            <!-- Grille du calendrier -->
                            <div class="grid grid-cols-7 gap-1">
                                <div v-for="day in calendarDays" :key="day.date"
                                    class="aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200 ease-organic"
                                    :class="{
                                        'text-forest-700 bg-forest-50': day.isToday,
                                        'text-terracotta-600 hover:bg-cream-50 cursor-pointer': !day.isToday && day.inMonth,
                                        'text-forest-300': !day.inMonth,
                                        'bg-gradient-to-br from-forest-100 to-forest-50 border border-forest-200': day.hasEvents
                                    }">
                                    <div class="relative">
                                        {{ day.day }}
                                        <div v-if="day.hasEvents"
                                            class="absolute -top-1 -right-1 w-2 h-2 bg-forest-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Événements du jour -->
                            <div v-if="todaysEvents.length > 0" class="mt-6 pt-6 border-t border-forest-100">
                                <h3 class="text-sm font-medium text-forest-700 mb-3">Aujourd'hui</h3>
                                <div class="space-y-3">
                                    <div v-for="event in todaysEvents" :key="event.id"
                                        class="flex items-center space-x-3 p-3 bg-white border border-forest-100 rounded-lg hover:shadow-sm transition-all duration-200">
                                        <div
                                            class="w-10 h-10 rounded-lg bg-gradient-to-br from-forest-100 to-forest-50 flex items-center justify-center">
                                            <span class="text-lg">{{ event.icon }}</span>
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-forest-800">{{ event.title }}</div>
                                            <div class="text-xs text-terracotta-600">{{ event.time }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Conseils et astuces -->
            <div class="mt-8 bg-gradient-to-r from-forest-50/50 to-cream-50/50 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6 animate-slide-up"
                style="animation-delay: 600ms">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="p-2 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                        <span class="text-xl">💡</span>
                    </div>
                    <div>
                        <h3 class="text-lg font-serif font-semibold text-forest-800">
                            Astuce du jour
                        </h3>
                        <p class="text-sm text-terracotta-600">
                            Améliorez votre visibilité
                        </p>
                    </div>
                </div>
                <p class="text-forest-700">
                    📸 <strong>Prenez de belles photos !</strong> Les produits avec des photos de qualité ont
                    <span class="text-forest-600 font-medium">3 fois plus</span> de chances d'être achetés.
                    Utilisez la lumière naturelle et montrez vos produits sous différents angles.
                </p>
                <button @click="showTips = !showTips"
                    class="mt-4 text-sm text-forest-600 hover:text-forest-700 flex items-center space-x-1 transition-colors">
                    <span>{{ showTips ? 'Voir moins' : 'Voir plus d\'astuces' }}</span>
                    <span>{{ showTips ? '👆' : '👇' }}</span>
                </button>
            </div>
        </main>

        <!-- Notifications panel -->
        <transition enter-active-class="transition-all duration-500 ease-organic"
            enter-from-class="opacity-0 translate-x-full" enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-500 ease-organic" leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-full">
            <div v-if="showNotificationsPanel" class="fixed inset-y-0 right-0 w-96 z-40">
                <div class="h-full bg-white/95 backdrop-blur-xl border-l border-forest-100/30 shadow-2xl p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-serif font-semibold text-forest-800">Notifications</h2>
                        <button @click="toggleNotifications"
                            class="p-2 hover:bg-forest-50 rounded-lg transition-colors">
                            <span class="text-lg">✖️</span>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div v-for="notification in notifications" :key="notification.id"
                            class="p-4 bg-gradient-to-r from-forest-50 to-white border border-forest-100 rounded-xl hover:shadow-sm transition-all duration-200">
                            <div class="flex items-start space-x-3">
                                <div class="p-2 bg-forest-100 rounded-lg">
                                    <span class="text-lg">{{ notification.icon }}</span>
                                </div>
                                <div class="flex-1">
                                    <div class="font-medium text-forest-800">{{ notification.title }}</div>
                                    <div class="text-sm text-terracotta-600 mt-1">{{ notification.message }}</div>
                                    <div class="text-xs text-forest-500 mt-2">{{ notification.time }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useOrdersStore } from '@/modules/orders/stores/orders.store'
import { CustomerProfileService } from '@/modules/user-profiles/customer/services'
import { ProducerProfileService } from '@/modules/user-profiles/producer/services'
import catalogService from '@/modules/catalog/services/catalog.service'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

// État de l'interface
const showNotificationsPanel = ref(false)
const showTips = ref(false)
const unreadNotifications = ref(0)

// Données du producteur
const producerName = ref('Producteur')
const verificationStatus = ref('pending')
const joinDate = ref('récemment')
const weather = ref('Yaoundé, Cameroun')
const currentDate = ref(new Date().toLocaleDateString('fr-CM', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}))
const currentMonth = ref(new Date().toLocaleDateString('fr-CM', { month: 'long', year: 'numeric' }))

// Statistiques
const revenue = ref(0)
const pendingOrders = ref(0)
const rating = ref(0)
const reviews = ref(0)
const productsTotal = ref(0)
const productsAvailable = ref(0)
const lowStockCount = ref(0)
const pickupPointsOpen = ref(0)
const pickupPointsTotal = ref(0)

// Commandes récentes
const recentOrders = ref<any[]>([])

// Produits populaires
const popularProducts = ref<any[]>([])

// Tâches urgentes
const urgentTasks = ref<any[]>([])

// Calendrier
const calendarDays = computed(() => {
    const days = []
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    // Premier jour du mois
    const firstDay = new Date(currentYear, currentMonth, 1)
    // Dernier jour du mois
    const lastDay = new Date(currentYear, currentMonth + 1, 0)

    // Jours du mois précédent
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    for (let i = firstDayOfWeek; i > 0; i--) {
        const date = new Date(currentYear, currentMonth, -i + 1)
        days.push({
            day: date.getDate(),
            date: date.toISOString(),
            inMonth: false,
            isToday: false,
            hasEvents: false
        })
    }

    // Jours du mois en cours
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(currentYear, currentMonth, i)
        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        const hasEvents = [2, 5, 12, 18, 23, 27].includes(i) // Exemple de jours avec événements
        days.push({
            day: i,
            date: date.toISOString(),
            inMonth: true,
            isToday,
            hasEvents
        })
    }

    // Jours du mois suivant
    const daysToAdd = 42 - days.length // 6 semaines de 7 jours
    for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(currentYear, currentMonth + 1, i)
        days.push({
            day: i,
            date: date.toISOString(),
            inMonth: false,
            isToday: false,
            hasEvents: false
        })
    }

    return days
})

// Événements du jour
const todaysEvents = ref<any[]>([])

// Notifications
const notifications = ref<any[]>([])

const formatXaf = (amount: number | string) =>
    new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Number(amount || 0))

const formatRelativeTime = (value: string | Date) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'récemment'

    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffHours < 1) {
        const mins = Math.max(1, Math.floor((now.getTime() - date.getTime()) / (1000 * 60)))
        return `Il y a ${mins} min`
    }
    if (diffHours < 24) return `Il y a ${diffHours} h`
    return date.toLocaleDateString('fr-CM')
}

const formatJoinDate = (value: string | Date | undefined) => {
    if (!value) return 'récemment'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'récemment'
    return date.toLocaleDateString('fr-CM', { month: 'long', year: 'numeric' })
}

const normalizeNamePart = (value: unknown): string => (
    typeof value === 'string' ? value.trim() : ''
)

const buildFullName = (first: unknown, last: unknown): string => {
    const normalizedFirst = normalizeNamePart(first)
    const normalizedLast = normalizeNamePart(last)
    return [normalizedFirst, normalizedLast].filter(Boolean).join(' ').trim()
}

const resolveProducerName = async (): Promise<string> => {
    const authUser = authStore.currentUser as any
    const authFullName = buildFullName(
        authUser?.first_name ?? authUser?.firstName,
        authUser?.last_name ?? authUser?.lastName
    )
    if (authFullName) return authFullName

    try {
        const customerProfile = await CustomerProfileService.getProfile()
        const customerName = buildFullName(customerProfile?.firstName, customerProfile?.lastName)
        if (customerName) return customerName
    } catch {
        // Un producteur peut ne pas avoir de profil client.
    }

    try {
        const producerProfile: any = await ProducerProfileService.getProfile()
        const legalName = normalizeNamePart(producerProfile?.legal_name ?? producerProfile?.legalName)
        if (legalName) return legalName

        const businessName = normalizeNamePart(producerProfile?.business_name ?? producerProfile?.businessName)
        if (businessName) return businessName
    } catch {
        // Profil producteur non encore configuré.
    }

    return 'Producteur'
}

const mapOrderStatusText = (status: string) => {
    if (status === 'pending') return 'En attente'
    if (status === 'confirmed') return 'Confirmée'
    if (status === 'preparing') return 'En préparation'
    if (status === 'ready') return 'Prête'
    if (status === 'completed') return 'Livrée'
    if (status === 'cancelled') return 'Annulée'
    return 'En cours'
}

// Méthodes
const toggleNotifications = () => {
    showNotificationsPanel.value = !showNotificationsPanel.value
    if (!showNotificationsPanel.value) {
        unreadNotifications.value = 0
    }
}

const goTo = (page: string) => {
    router.push(`/producer/${page}`)
}

const viewOrder = (order: any) => {
    console.log('Voir commande:', order)
    router.push(`/producer/orders/${order.id}`)
}

const completeTask = (task: any) => {
    urgentTasks.value = urgentTasks.value.filter(t => t.id !== task.id)
}

onMounted(() => {
    verificationStatus.value = authStore?.currentUser?.is_verified ? 'verified' : 'pending'
    joinDate.value = formatJoinDate(authStore?.user?.created_at)

    void (async () => {
        producerName.value = await resolveProducerName()

        try {
            await ordersStore.fetchProducerOrders({ limit: 20 })
            const producerOrders = ordersStore.producerOrders || []

            pendingOrders.value = producerOrders.filter((order: any) =>
                ['pending', 'confirmed', 'preparing'].includes(order?.status)
            ).length

            revenue.value = producerOrders
                .filter((order: any) => order?.status === 'completed')
                .reduce((sum: number, order: any) => sum + Number(order?.totalAmount || 0), 0)

            recentOrders.value = producerOrders.slice(0, 4).map((order: any) => ({
                id: order?.orderNumber || order?.id,
                customerName: order?.customer?.name || 'Client',
                amount: Number(order?.totalAmount || 0),
                time: formatRelativeTime(order?.createdAt || new Date()),
                status: order?.status,
                statusText: mapOrderStatusText(order?.status),
                items: Array.isArray(order?.items) ? order.items.length : 0
            }))

            if (pendingOrders.value > 0) {
                notifications.value = [{
                    id: 1,
                    title: 'Commandes en attente',
                    icon: '📦',
                    message: `${pendingOrders.value} commande(s) à traiter`,
                    time: 'maintenant'
                }]
                unreadNotifications.value = 1
            } else {
                notifications.value = []
                unreadNotifications.value = 0
            }
        } catch (error) {
            console.error('Erreur chargement commandes producteur:', error)
            recentOrders.value = []
            pendingOrders.value = 0
            revenue.value = 0
            notifications.value = []
            unreadNotifications.value = 0
        }

        try {
            const response = await catalogService.getMyProducts({ limit: 200 })
            const products = Array.isArray(response?.products) ? response.products : []
            productsTotal.value = products.length
            productsAvailable.value = products.filter((product: any) => Number(product?.stock_quantity || 0) > 0).length
            lowStockCount.value = products.filter((product: any) => {
                const stock = Number(product?.stock_quantity || 0)
                const threshold = Number(product?.low_stock_threshold || 10)
                return stock > 0 && stock <= threshold
            }).length

            popularProducts.value = products.slice(0, 4).map((product: any) => ({
                id: product?.id,
                name: product?.name || 'Produit',
                icon: '🥬',
                category: product?.category?.name || 'Produits locaux',
                sales: 0,
                percentage: 0,
                trend: 'stable'
            }))
        } catch (error) {
            console.error('Erreur chargement produits producteur:', error)
            productsTotal.value = 0
            productsAvailable.value = 0
            lowStockCount.value = 0
            popularProducts.value = []
        }
    })()
})
</script>

<style scoped>
/* Animation personnalisée */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-10px) rotate(1deg);
    }
}

/* Classes d'animation */
.animate-slide-up {
    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Courbe de bézier organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Pattern de légumes en filigrane */
.bg-vegetable-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm85 85c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zM35 135c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zM135 35c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15z' fill='%233a7d34' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Palette de couleurs étendue */
.text-forest-30 {
    color: #fbfdfb;
}

.bg-forest-30 {
    background-color: #fbfdfb;
}

.text-forest-25 {
    color: #f7faf7;
}

.bg-forest-25 {
    background-color: #f7faf7;
}

.text-forest-50 {
    color: #f0f7f0;
}

.bg-forest-50 {
    background-color: #f0f7f0;
}

.text-forest-100 {
    color: #e0eee0;
}

.bg-forest-100 {
    background-color: #e0eee0;
}

.text-forest-200 {
    color: #c1ddc1;
}

.bg-forest-200 {
    background-color: #c1ddc1;
}

.text-forest-300 {
    color: #a2cca2;
}

.bg-forest-300 {
    background-color: #a2cca2;
}

.text-forest-400 {
    color: #83bb83;
}

.bg-forest-400 {
    background-color: #83bb83;
}

.text-forest-500 {
    color: #64aa64;
}

.bg-forest-500 {
    background-color: #64aa64;
}

.text-forest-600 {
    color: #508850;
}

.bg-forest-600 {
    background-color: #508850;
}

.text-forest-700 {
    color: #3c663c;
}

.bg-forest-700 {
    background-color: #3c663c;
}

.text-forest-800 {
    color: #284428;
}

.bg-forest-800 {
    background-color: #284428;
}

.text-cream-40 {
    color: #fefdf5;
}

.bg-cream-40 {
    background-color: #fefdf5;
}

.text-cream-50 {
    color: #fefaf0;
}

.bg-cream-50 {
    background-color: #fefaf0;
}

.text-cream-100 {
    color: #fdf5e1;
}

.bg-cream-100 {
    background-color: #fdf5e1;
}

.text-cream-200 {
    color: #fbebc3;
}

.bg-cream-200 {
    background-color: #fbebc3;
}

.text-terracotta-30 {
    color: #fefaf5;
}

.bg-terracotta-30 {
    background-color: #fefaf5;
}

.text-terracotta-50 {
    color: #fdf5f0;
}

.bg-terracotta-50 {
    background-color: #fdf5f0;
}

.text-terracotta-100 {
    color: #fbebe1;
}

.bg-terracotta-100 {
    background-color: #fbebe1;
}

.text-terracotta-200 {
    color: #f7d8c3;
}

.bg-terracotta-200 {
    background-color: #f7d8c3;
}

.text-terracotta-300 {
    color: #f3c4a5;
}

.bg-terracotta-300 {
    background-color: #f3c4a5;
}

.text-terracotta-400 {
    color: #efb187;
}

.bg-terracotta-400 {
    background-color: #efb187;
}

.text-terracotta-500 {
    color: #eb9e69;
}

.bg-terracotta-500 {
    background-color: #eb9e69;
}

.text-terracotta-600 {
    color: #bc7e54;
}

.bg-terracotta-600 {
    background-color: #bc7e54;
}

.text-terracotta-700 {
    color: #8d5f3f;
}

.bg-terracotta-700 {
    background-color: #8d5f3f;
}

/* Ombres douces */
.shadow-soft {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Animation d'arrière-plan subtile */
.producer-dashboard::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(100, 170, 100, 0.08) 0%, transparent 25%),
        radial-gradient(circle at 80% 70%, rgba(235, 158, 105, 0.05) 0%, transparent 25%);
    animation: float 15s ease-in-out infinite;
    pointer-events: none;
    z-index: -10;
}

/* Scrollbar personnalisée */
.producer-dashboard ::-webkit-scrollbar {
    width: 6px;
}

.producer-dashboard ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
}

.producer-dashboard ::-webkit-scrollbar-thumb {
    background: rgba(100, 170, 100, 0.3);
    border-radius: 10px;
}

.producer-dashboard ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 170, 100, 0.5);
}

/* Effets de survol spéciaux */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Transition pour les routes */
.router-view-transition-enter-active,
.router-view-transition-leave-active {
    transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.router-view-transition-enter-from,
.router-view-transition-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
