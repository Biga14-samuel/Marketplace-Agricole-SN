<template>
    <div class="schedule-view min-h-screen">
        <!-- Arrière-plan organique avec dégradé et animation -->
        <div class="fixed inset-0 -z-20 bg-gradient-to-br from-forest-20/95 via-cream-40/90 to-terracotta-30/85">
            <div class="absolute inset-0 bg-clock-pattern opacity-5"></div>
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-forest-500/15 to-transparent"></div>
        </div>

        <!-- Navigation supérieure -->
        <nav class="sticky top-0 z-30 backdrop-blur-xl bg-white/85 border-b border-forest-100/30 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex items-center space-x-3">
                        <router-link to="/producer/dashboard"
                            class="p-2 rounded-full hover:bg-forest-50 transition-all duration-300 ease-organic">
                            <span class="text-xl">⬅️</span>
                        </router-link>
                        <div>
                            <h1 class="text-2xl lg:text-3xl font-serif font-bold text-forest-800">
                                🕒 Gestion des horaires
                            </h1>
                            <p class="text-sm text-terracotta-600">
                                Planifiez vos horaires d'ouverture et vos créneaux de retrait
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <router-link to="/producer/settings"
                            class="px-4 py-3 bg-white text-forest-700 border border-forest-200 rounded-xl shadow-sm hover:shadow-md hover:bg-forest-50 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>⚙️</span>
                            <span class="hidden sm:inline">Paramètres</span>
                        </router-link>
                        <!-- Sélecteur de période -->
                        <div class="flex bg-forest-50 rounded-lg p-1">
                            <button @click="selectedPeriod = 'week'"
                                class="px-4 py-2 rounded-md transition-all duration-300 ease-organic"
                                :class="selectedPeriod === 'week' ? 'bg-white shadow-sm' : 'hover:bg-white/50'">
                                <span class="text-sm">📅 Semaine</span>
                            </button>
                            <button @click="selectedPeriod = 'month'"
                                class="px-4 py-2 rounded-md transition-all duration-300 ease-organic"
                                :class="selectedPeriod === 'month' ? 'bg-white shadow-sm' : 'hover:bg-white/50'">
                                <span class="text-sm">🗓️ Mois</span>
                            </button>
                        </div>

                        <!-- Bouton d'action rapide -->
                        <button @click="openQuickScheduleModal"
                            class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>⚡</span>
                            <span>Planification rapide</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Statistiques et vue d'ensemble -->
            <section class="mb-8 animate-slide-up">
                <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                    <div class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-xl">📊</span>
                                <h2 class="text-xl font-serif font-semibold text-forest-800">
                                    Vue d'ensemble des horaires
                                </h2>
                            </div>
                            <span class="text-sm text-forest-600">
                                Semaine du {{ currentWeekRange }}
                            </span>
                        </div>
                    </div>

                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div class="bg-gradient-to-br from-forest-50 to-forest-25 rounded-xl p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="p-2 bg-white rounded-lg shadow-sm">
                                        <span class="text-xl">📍</span>
                                    </div>
                                    <span class="text-xs px-2 py-1 bg-forest-100 text-forest-700 rounded-full">
                                        {{ activePickupPoints }}/{{ totalPickupPoints }}
                                    </span>
                                </div>
                                <div class="text-2xl font-bold text-forest-800">{{ totalSlots }}</div>
                                <div class="text-sm text-terracotta-600">Créneaux actifs</div>
                            </div>

                            <div class="bg-gradient-to-br from-green-50 to-green-25 rounded-xl p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="p-2 bg-white rounded-lg shadow-sm">
                                        <span class="text-xl">📦</span>
                                    </div>
                                    <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        +{{ upcomingOrdersChange }}%
                                    </span>
                                </div>
                                <div class="text-2xl font-bold text-forest-800">{{ upcomingOrders }}</div>
                                <div class="text-sm text-terracotta-600">Réservations à venir</div>
                            </div>

                            <div class="bg-gradient-to-br from-blue-50 to-blue-25 rounded-xl p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="p-2 bg-white rounded-lg shadow-sm">
                                        <span class="text-xl">👥</span>
                                    </div>
                                    <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        Moyenne
                                    </span>
                                </div>
                                <div class="text-2xl font-bold text-forest-800">{{ averageOccupancy }}%</div>
                                <div class="text-sm text-terracotta-600">Taux d'occupation</div>
                            </div>

                            <div class="bg-gradient-to-br from-orange-50 to-orange-25 rounded-xl p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="p-2 bg-white rounded-lg shadow-sm">
                                        <span class="text-xl">⏱️</span>
                                    </div>
                                    <span class="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                        Total
                                    </span>
                                </div>
                                <div class="text-2xl font-bold text-forest-800">{{ totalHours }}h</div>
                                <div class="text-sm text-terracotta-600">Heures d'ouverture</div>
                            </div>
                        </div>

                        <!-- Graphique d'occupation -->
                        <div class="bg-gradient-to-br from-forest-25 to-white rounded-xl p-5 border border-forest-100">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center space-x-3">
                                    <span class="text-lg">📈</span>
                                    <h3 class="font-medium text-forest-800">Occupation par jour</h3>
                                </div>
                                <select v-model="selectedTimeframe"
                                    class="text-sm border border-forest-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-forest-500 focus:border-transparent">
                                    <option value="week">Cette semaine</option>
                                    <option value="month">Ce mois</option>
                                    <option value="quarter">Ce trimestre</option>
                                </select>
                            </div>

                            <div class="flex items-end justify-between h-32">
                                <div v-for="day in occupancyData" :key="day.name" class="flex flex-col items-center">
                                    <div class="text-xs text-terracotta-600 mb-2">{{ day.shortName }}</div>
                                    <div class="w-10 rounded-t-lg transition-all duration-500 ease-organic hover:opacity-80 cursor-pointer"
                                        :class="day.occupancy > 80 ? 'bg-gradient-to-t from-green-400 to-green-500' : day.occupancy > 50 ? 'bg-gradient-to-t from-forest-400 to-forest-500' : 'bg-gradient-to-t from-terracotta-300 to-terracotta-400'"
                                        :style="{ height: `${day.occupancy}%` }" @mouseenter="hoveredDay = day"
                                        @mouseleave="hoveredDay = null"></div>
                                    <div class="text-xs font-medium text-forest-700 mt-1">{{ day.occupancy }}%</div>
                                </div>
                            </div>

                            <div v-if="hoveredDay" class="mt-4 p-3 bg-white border border-forest-100 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium text-forest-800">{{ hoveredDay.name }}</div>
                                        <div class="text-sm text-terracotta-600">{{ hoveredDay.date }}</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="font-bold text-forest-800">{{ hoveredDay.occupancy }}% d'occupation
                                        </div>
                                        <div class="text-sm text-terracotta-600">{{ hoveredDay.reservations }}
                                            réservations</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Onglets principaux -->
            <div class="mb-8">
                <div class="flex overflow-x-auto border-b border-forest-100">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                        class="flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-300 ease-organic whitespace-nowrap"
                        :class="activeTab === tab.id
                            ? 'border-forest-500 text-forest-700 font-medium bg-gradient-to-b from-forest-50/50 to-transparent'
                            : 'border-transparent text-forest-600 hover:text-forest-700 hover:bg-forest-25'">
                        <span class="text-lg">{{ tab.icon }}</span>
                        <span>{{ tab.label }}</span>
                        <span v-if="tab.badge"
                            class="ml-2 px-2 py-0.5 text-xs rounded-full bg-forest-100 text-forest-700">
                            {{ tab.badge }}
                        </span>
                    </button>
                </div>
            </div>

            <!-- Contenu des onglets -->
            <transition mode="out-in" enter-active-class="transition-all duration-500 ease-organic"
                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-500 ease-organic"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
                <!-- Onglet Horaires de la ferme -->
                <section v-if="activeTab === 'farm'" key="farm" class="animate-slide-up" style="animation-delay: 100ms">
                    <div
                        class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden mb-8">
                        <div
                            class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">🏡</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Horaires de la ferme
                                    </h2>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button @click="copyScheduleToAll"
                                        class="px-4 py-2 bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>📋</span>
                                        <span>Copier à toute la semaine</span>
                                    </button>
                                    <button @click="resetFarmSchedule"
                                        class="px-4 py-2 bg-terracotta-100 text-terracotta-700 rounded-lg hover:bg-terracotta-200 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>🔄</span>
                                        <span>Réinitialiser</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                                <div v-for="day in farmSchedule" :key="day.id"
                                    class="bg-gradient-to-br from-white to-forest-25 border border-forest-100 rounded-xl p-4 hover:shadow-md hover:border-forest-200 transition-all duration-300 ease-organic"
                                    :class="{ 'ring-2 ring-forest-300': day.isOpen }">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" v-model="day.isOpen" :id="`farm-day-${day.id}`"
                                                class="h-4 w-4 rounded-full text-forest-500 focus:ring-forest-400 border-forest-300" />
                                            <label :for="`farm-day-${day.id}`"
                                                class="font-medium text-forest-700 cursor-pointer">
                                                {{ day.name }}
                                            </label>
                                        </div>
                                        <span class="text-xs px-2 py-1 rounded-full"
                                            :class="day.isOpen ? 'bg-green-100 text-green-700' : 'bg-terracotta-100 text-terracotta-700'">
                                            {{ day.isOpen ? 'Ouvert' : 'Fermé' }}
                                        </span>
                                    </div>

                                    <div v-if="day.isOpen" class="space-y-3">
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-medium text-forest-600 mb-1">
                                                    Ouverture
                                                </label>
                                                <input type="time" v-model="day.openTime"
                                                    class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-forest-600 mb-1">
                                                    Fermeture
                                                </label>
                                                <input type="time" v-model="day.closeTime"
                                                    class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                                            </div>
                                        </div>

                                        <div class="pt-3 border-t border-forest-100">
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="text-xs font-medium text-forest-600">
                                                    Pause déjeuner 🍽️
                                                </label>
                                                <button @click="day.hasLunchBreak = !day.hasLunchBreak"
                                                    class="text-xs px-2 py-1 rounded transition-colors"
                                                    :class="day.hasLunchBreak ? 'bg-forest-100 text-forest-700' : 'bg-gray-100 text-gray-600'">
                                                    {{ day.hasLunchBreak ? 'Oui' : 'Non' }}
                                                </button>
                                            </div>

                                            <div v-if="day.hasLunchBreak" class="grid grid-cols-2 gap-3">
                                                <input type="time" v-model="day.lunchStart" placeholder="Début"
                                                    class="w-full px-2 py-1 text-sm border border-forest-200 rounded" />
                                                <input type="time" v-model="day.lunchEnd" placeholder="Fin"
                                                    class="w-full px-2 py-1 text-sm border border-forest-200 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    <div v-else class="text-center py-4 text-terracotta-500">
                                        <span class="text-2xl block mb-2">🏡</span>
                                        <span class="text-sm">Fermé</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 pt-6 border-t border-forest-100">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm text-forest-700">
                                        Ces horaires s'appliquent à tous les points de retrait de la ferme
                                    </div>
                                    <button @click="saveFarmSchedule"
                                        class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>💾</span>
                                        <span>Enregistrer les horaires</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Horaires spéciaux -->
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                        <div
                            class="bg-gradient-to-r from-cream-50 to-terracotta-50/50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">🎉</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Horaires spéciaux
                                    </h2>
                                </div>
                                <button @click="addSpecialSchedule"
                                    class="px-4 py-2 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2">
                                    <span>➕</span>
                                    <span>Ajouter un horaire spécial</span>
                                </button>
                            </div>
                        </div>

                        <div class="p-6">
                            <div v-if="specialSchedules.length === 0" class="text-center py-12">
                                <span class="text-4xl block mb-4">📅</span>
                                <h3 class="text-lg font-serif font-semibold text-forest-800 mb-2">
                                    Aucun horaire spécial configuré
                                </h3>
                                <p class="text-terracotta-600 mb-6">
                                    Ajoutez des exceptions pour les jours fériés, événements, etc.
                                </p>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="schedule in specialSchedules" :key="schedule.id"
                                    class="border border-forest-100 rounded-xl p-4 hover:shadow-sm transition-all duration-300 ease-organic group">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center space-x-3">
                                            <div class="p-2 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg">
                                                <span class="text-lg">{{ schedule.icon }}</span>
                                            </div>
                                            <div>
                                                <div class="font-medium text-forest-800">{{ schedule.title }}</div>
                                                <div class="text-sm text-terracotta-600">{{ schedule.dateRange }}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <span class="text-xs px-2 py-1 rounded-full"
                                                :class="schedule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                                                {{ schedule.status === 'active' ? 'Actif' : 'Passé' }}
                                            </span>
                                            <button @click="editSpecialSchedule(schedule)"
                                                class="p-1 hover:bg-forest-50 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <span>✏️</span>
                                            </button>
                                            <button @click="deleteSpecialSchedule(schedule)"
                                                class="p-1 hover:bg-terracotta-50 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <span>🗑️</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="text-sm text-forest-700 mb-3">{{ schedule.description }}</div>

                                    <div class="flex items-center justify-between">
                                        <div class="text-sm text-terracotta-600">
                                            {{ schedule.hours }}
                                        </div>
                                        <div class="text-xs text-forest-600">
                                            {{ schedule.affectedPoints }} points affectés
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Onglet Créneaux de retrait -->
                <section v-else-if="activeTab === 'slots'" key="slots" class="animate-slide-up"
                    style="animation-delay: 100ms">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Liste des points de retrait -->
                        <div class="lg:col-span-1">
                            <div
                                class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden sticky top-24">
                                <div
                                    class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/30">
                                    <div class="flex items-center space-x-3">
                                        <span class="text-xl">📍</span>
                                        <h2 class="text-xl font-serif font-semibold text-forest-800">
                                            Points de retrait
                                        </h2>
                                    </div>
                                </div>

                                <div class="p-6">
                                    <div class="space-y-3">
                                        <button v-for="point in pickupPoints" :key="point.id"
                                            @click="selectedPickupPoint = point"
                                            class="w-full p-4 rounded-xl border transition-all duration-300 ease-organic text-left"
                                            :class="selectedPickupPoint?.id === point.id
                                                ? 'bg-gradient-to-r from-forest-50 to-white border-forest-300 shadow-sm'
                                                : 'border-forest-100 hover:border-forest-200 hover:bg-forest-25'">
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center space-x-3">
                                                    <span class="text-xl">{{ point.icon }}</span>
                                                    <div>
                                                        <div class="font-medium text-forest-800">{{ point.name }}</div>
                                                        <div class="text-xs text-terracotta-600">{{ point.slotsCount }}
                                                            créneaux</div>
                                                    </div>
                                                </div>
                                                <span class="text-xs px-2 py-1 rounded-full"
                                                    :class="point.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-terracotta-100 text-terracotta-700'">
                                                    {{ point.status === 'active' ? 'Actif' : 'Inactif' }}
                                                </span>
                                            </div>
                                        </button>

                                        <button @click="addPickupPoint"
                                            class="w-full p-4 border-2 border-dashed border-forest-200 rounded-xl hover:border-forest-300 hover:bg-forest-50/50 transition-all duration-300 ease-organic flex items-center justify-center space-x-2">
                                            <span class="text-xl">➕</span>
                                            <span class="font-medium text-forest-700">Nouveau point</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Créneaux du point sélectionné -->
                        <div class="lg:col-span-2">
                            <div v-if="selectedPickupPoint" class="space-y-8">
                                <!-- En-tête du point sélectionné -->
                                <div
                                    class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                                    <div
                                        class="bg-gradient-to-r from-cream-50 to-forest-50 px-6 py-4 border-b border-forest-100/30">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center space-x-3">
                                                <div class="p-2 bg-white rounded-lg shadow-sm">
                                                    <span class="text-xl">{{ selectedPickupPoint.icon }}</span>
                                                </div>
                                                <div>
                                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                                        {{ selectedPickupPoint.name }}
                                                    </h2>
                                                    <p class="text-sm text-terracotta-600">
                                                        {{ selectedPickupPoint.address }}
                                                    </p>
                                                </div>
                                            </div>
                                            <button @click="openSlotModal"
                                                class="px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-organic flex items-center space-x-2">
                                                <span>➕</span>
                                                <span>Nouveau créneau</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="p-6">
                                        <!-- Vue semaine -->
                                        <div class="mb-6">
                                            <div class="flex items-center justify-between mb-4">
                                                <h3 class="font-medium text-forest-800">Semaine du {{ currentWeekRange
                                                }}</h3>
                                                <div class="flex items-center space-x-2">
                                                    <button @click="previousWeek"
                                                        class="p-2 hover:bg-forest-50 rounded-lg transition-colors">
                                                        <span>⬅️</span>
                                                    </button>
                                                    <button @click="nextWeek"
                                                        class="p-2 hover:bg-forest-50 rounded-lg transition-colors">
                                                        <span>➡️</span>
                                                    </button>
                                                    <button @click="currentWeek = new Date()"
                                                        class="px-3 py-1 text-sm bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-colors">
                                                        Aujourd'hui
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="overflow-x-auto">
                                                <table class="w-full">
                                                    <thead>
                                                        <tr class="border-b border-forest-100">
                                                            <th
                                                                class="text-left py-3 px-2 text-sm font-medium text-forest-700">
                                                                Jour</th>
                                                            <th v-for="timeSlot in timeSlots" :key="timeSlot"
                                                                class="text-center py-3 px-2 text-sm font-medium text-forest-700">
                                                                {{ timeSlot }}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="day in weekDays" :key="day.id"
                                                            class="border-b border-forest-100/30 hover:bg-forest-50/30 transition-colors">
                                                            <td class="py-4 px-2">
                                                                <div class="flex items-center space-x-3">
                                                                    <span class="text-lg">{{ getDayEmoji(day.id)
                                                                    }}</span>
                                                                    <div>
                                                                        <div class="font-medium text-forest-800">{{
                                                                            day.name }}</div>
                                                                        <div class="text-xs text-terracotta-600">{{
                                                                            day.date }}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td v-for="timeSlot in timeSlots" :key="timeSlot"
                                                                class="py-4 px-2">
                                                                <div v-if="hasSlotAt(day.id, timeSlot)"
                                                                    class="h-8 mx-auto rounded-lg cursor-pointer transition-all duration-200 ease-organic hover:scale-105"
                                                                    :class="getSlotClass(day.id, timeSlot)"
                                                                    @click="editSlotAt(day.id, timeSlot)"
                                                                    @mouseenter="hoveredSlot = { day: day.id, time: timeSlot }"
                                                                    @mouseleave="hoveredSlot = null"></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div v-if="hoveredSlot"
                                                class="mt-4 p-3 bg-white border border-forest-100 rounded-lg">
                                                <div class="flex items-center justify-between">
                                                    <div>
                                                        <div class="font-medium text-forest-800">
                                                            {{ getDayName(hoveredSlot.day) }} à {{ hoveredSlot.time }}
                                                        </div>
                                                        <div class="text-sm text-terracotta-600">
                                                            {{ getSlotInfo(hoveredSlot.day, hoveredSlot.time) }}
                                                        </div>
                                                    </div>
                                                    <button @click="editSlotAt(hoveredSlot.day, hoveredSlot.time)"
                                                        class="px-3 py-1 text-sm bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-colors">
                                                        Modifier
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Liste des créneaux -->
                                        <div>
                                            <h3 class="font-medium text-forest-800 mb-4 flex items-center space-x-2">
                                                <span>📋</span>
                                                <span>Tous les créneaux</span>
                                            </h3>

                                            <div v-if="currentSlots.length === 0" class="text-center py-12">
                                                <span class="text-4xl block mb-4">🕒</span>
                                                <p class="text-lg text-forest-700 mb-2">Aucun créneau configuré</p>
                                                <p class="text-sm text-terracotta-600 mb-6">Commencez par ajouter vos
                                                    premiers créneaux</p>
                                                <button @click="openSlotModal"
                                                    class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-organic flex items-center space-x-2 mx-auto">
                                                    <span>➕</span>
                                                    <span>Ajouter un créneau</span>
                                                </button>
                                            </div>

                                            <div v-else class="space-y-3">
                                                <div v-for="slot in currentSlots" :key="slot.id"
                                                    class="border border-forest-100 rounded-xl p-4 hover:shadow-sm transition-all duration-300 ease-organic group">
                                                    <div class="flex items-center justify-between mb-3">
                                                        <div class="flex items-center space-x-3">
                                                            <div class="flex flex-col items-center">
                                                                <span class="text-xl">{{ getDayEmoji(slot.dayOfWeek)
                                                                }}</span>
                                                                <span class="text-xs font-medium text-forest-700 mt-1">
                                                                    {{ getDayName(slot.dayOfWeek) }}
                                                                </span>
                                                            </div>

                                                            <div class="flex items-center space-x-4">
                                                                <div class="text-center">
                                                                    <div class="text-sm text-terracotta-600">Début</div>
                                                                    <div class="text-lg font-bold text-forest-700">{{
                                                                        slot.startTime }}</div>
                                                                </div>

                                                                <div class="text-terracotta-400">➡️</div>

                                                                <div class="text-center">
                                                                    <div class="text-sm text-terracotta-600">Fin</div>
                                                                    <div class="text-lg font-bold text-forest-700">{{
                                                                        slot.endTime }}</div>
                                                                </div>
                                                            </div>

                                                            <div class="flex items-center space-x-2">
                                                                <div
                                                                    class="w-24 h-2 bg-forest-100 rounded-full overflow-hidden">
                                                                    <div class="h-full bg-gradient-to-r from-forest-400 to-forest-500 rounded-full transition-all duration-500 ease-organic"
                                                                        :style="{ width: `${(slot.currentOrders / slot.maxOrders) * 100}%` }">
                                                                    </div>
                                                                </div>
                                                                <span class="text-xs font-bold"
                                                                    :class="slot.currentOrders >= slot.maxOrders ? 'text-terracotta-600' : 'text-forest-600'">
                                                                    {{ slot.currentOrders }}/{{ slot.maxOrders }}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div
                                                            class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <button @click="editSlot(slot)"
                                                                class="p-2 hover:bg-forest-50 rounded-lg transition-colors">
                                                                <span>✏️</span>
                                                            </button>
                                                            <button @click="deleteSlot(slot)"
                                                                class="p-2 hover:bg-terracotta-50 rounded-lg transition-colors">
                                                                <span>🗑️</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div class="flex items-center justify-between text-sm">
                                                        <span class="text-terracotta-600">Durée: {{ slot.duration
                                                        }}</span>
                                                        <span class="text-forest-600">Capacité: {{ slot.capacity
                                                        }}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Configuration rapide -->
                                <div
                                    class="bg-gradient-to-r from-forest-50/50 to-cream-50/50 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                                    <h3
                                        class="font-serif font-semibold text-forest-800 mb-4 flex items-center space-x-2">
                                        <span>⚡</span>
                                        <span>Configuration rapide</span>
                                    </h3>

                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button @click="applyTemplate('morning')"
                                            class="p-4 bg-white border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex flex-col items-center">
                                            <span class="text-2xl mb-2">🌅</span>
                                            <span class="font-medium text-forest-800">Matinée</span>
                                            <span class="text-xs text-terracotta-600 mt-1">9h-12h</span>
                                        </button>

                                        <button @click="applyTemplate('afternoon')"
                                            class="p-4 bg-white border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex flex-col items-center">
                                            <span class="text-2xl mb-2">☀️</span>
                                            <span class="font-medium text-forest-800">Après-midi</span>
                                            <span class="text-xs text-terracotta-600 mt-1">14h-18h</span>
                                        </button>

                                        <button @click="applyTemplate('evening')"
                                            class="p-4 bg-white border border-forest-100 rounded-xl hover:border-forest-200 hover:shadow-sm transition-all duration-300 ease-organic flex flex-col items-center">
                                            <span class="text-2xl mb-2">🌙</span>
                                            <span class="font-medium text-forest-800">Soirée</span>
                                            <span class="text-xs text-terracotta-600 mt-1">18h-20h</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-16">
                                <span class="text-6xl block mb-6">📍</span>
                                <h3 class="text-xl font-serif font-semibold text-forest-800 mb-2">
                                    Sélectionnez un point de retrait
                                </h3>
                                <p class="text-terracotta-600">
                                    Choisissez un point de retrait dans la liste pour gérer ses créneaux
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Onglet Calendrier -->
                <section v-else-if="activeTab === 'calendar'" key="calendar" class="animate-slide-up"
                    style="animation-delay: 100ms">
                    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-forest-100/30 overflow-hidden">
                        <div
                            class="bg-gradient-to-r from-forest-50 to-terracotta-50/50 px-6 py-4 border-b border-forest-100/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl">🗓️</span>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Calendrier global
                                    </h2>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button @click="previousMonth"
                                        class="p-2 hover:bg-white/50 rounded-lg transition-colors">
                                        <span>⬅️</span>
                                    </button>
                                    <span class="font-medium text-forest-700">{{ currentMonthYear }}</span>
                                    <button @click="nextMonth"
                                        class="p-2 hover:bg-white/50 rounded-lg transition-colors">
                                        <span>➡️</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="p-6">
                            <!-- Vue calendrier -->
                            <div class="mb-6">
                                <div class="grid grid-cols-7 gap-1 mb-2">
                                    <div v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']" :key="day"
                                        class="text-center text-sm font-medium text-terracotta-600 py-2">
                                        {{ day }}
                                    </div>
                                </div>

                                <div class="grid grid-cols-7 gap-1">
                                    <div v-for="day in calendarDays" :key="day.date"
                                        class="min-h-24 border border-forest-100 rounded-lg p-2 transition-all duration-200 ease-organic"
                                        :class="{
                                            'bg-forest-50/30': day.isToday,
                                            'bg-white hover:bg-forest-25': day.inMonth && !day.isToday,
                                            'bg-cream-50/30 text-forest-300': !day.inMonth,
                                            'ring-2 ring-forest-300': selectedDate === day.date
                                        }" @click="selectDate(day)">
                                        <div class="flex items-center justify-between mb-1">
                                            <div class="font-medium"
                                                :class="day.isToday ? 'text-forest-700' : day.inMonth ? 'text-forest-600' : 'text-forest-300'">
                                                {{ day.day }}
                                            </div>
                                            <div v-if="day.hasEvents" class="flex space-x-1">
                                                <div class="w-2 h-2 bg-forest-400 rounded-full"></div>
                                                <div v-if="day.eventCount > 1"
                                                    class="w-2 h-2 bg-terracotta-400 rounded-full"></div>
                                            </div>
                                        </div>

                                        <div v-if="day.events && day.events.length > 0" class="space-y-1">
                                            <div v-for="event in day.events.slice(0, 2)" :key="event.id"
                                                class="text-xs p-1 rounded truncate" :class="{
                                                    'bg-green-100 text-green-700': event.type === 'slot',
                                                    'bg-blue-100 text-blue-700': event.type === 'special',
                                                    'bg-orange-100 text-orange-700': event.type === 'holiday'
                                                }">
                                                {{ event.time }} {{ event.title }}
                                            </div>
                                            <div v-if="day.events.length > 2"
                                                class="text-xs text-terracotta-500 text-center">
                                                +{{ day.events.length - 2 }} autres
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Événements du jour sélectionné -->
                            <div v-if="selectedDate && selectedDateEvents.length > 0"
                                class="border-t border-forest-100 pt-6 mt-6">
                                <h3 class="font-medium text-forest-800 mb-4 flex items-center space-x-2">
                                    <span>📅</span>
                                    <span>Événements du {{ selectedDateFormatted }}</span>
                                </h3>

                                <div class="space-y-3">
                                    <div v-for="event in selectedDateEvents" :key="event.id"
                                        class="flex items-center space-x-3 p-3 bg-white border border-forest-100 rounded-lg hover:shadow-sm transition-all duration-200">
                                        <div class="p-2 rounded-lg" :class="{
                                            'bg-green-100': event.type === 'slot',
                                            'bg-blue-100': event.type === 'special',
                                            'bg-orange-100': event.type === 'holiday'
                                        }">
                                            <span class="text-lg">{{ event.icon }}</span>
                                        </div>
                                        <div class="flex-1">
                                            <div class="font-medium text-forest-800">{{ event.title }}</div>
                                            <div class="text-sm text-terracotta-600">{{ event.location }}</div>
                                            <div class="text-xs text-forest-600 mt-1">{{ event.timeRange }}</div>
                                        </div>
                                        <button @click="editCalendarEvent(event)"
                                            class="p-2 hover:bg-forest-50 rounded-lg transition-colors">
                                            <span>✏️</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </transition>

            <!-- Conseils d'optimisation -->
            <section class="mt-8 animate-slide-up" style="animation-delay: 200ms">
                <div
                    class="bg-gradient-to-r from-forest-50/50 to-cream-50/50 backdrop-blur-sm rounded-2xl border border-forest-100/30 p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-gradient-to-br from-forest-100 to-forest-50 rounded-xl">
                            <span class="text-xl">💡</span>
                        </div>
                        <div>
                            <h3 class="text-lg font-serif font-semibold text-forest-800">
                                Optimisez vos horaires
                            </h3>
                            <p class="text-sm text-terracotta-600">
                                Conseils pour améliorer l'expérience de vos clients
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="p-4 bg-white/70 rounded-xl">
                            <div class="text-2xl mb-2">⏰</div>
                            <div class="font-medium text-forest-700 mb-2">Crénaux de 2h</div>
                            <div class="text-sm text-terracotta-600">
                                Les créneaux de 2 heures maximisent les retraits
                            </div>
                        </div>

                        <div class="p-4 bg-white/70 rounded-xl">
                            <div class="text-2xl mb-2">📱</div>
                            <div class="font-medium text-forest-700 mb-2">Soirées week-end</div>
                            <div class="text-sm text-terracotta-600">
                                Ajoutez des créneaux le vendredi et samedi soir
                            </div>
                        </div>

                        <div class="p-4 bg-white/70 rounded-xl">
                            <div class="text-2xl mb-2">🎯</div>
                            <div class="font-medium text-forest-700 mb-2">Heures de pointe</div>
                            <div class="text-sm text-terracotta-600">
                                17h-19h est le créneau le plus demandé
                            </div>
                        </div>

                        <div class="p-4 bg-white/70 rounded-xl">
                            <div class="text-2xl mb-2">📊</div>
                            <div class="font-medium text-forest-700 mb-2">Analyse régulière</div>
                            <div class="text-sm text-terracotta-600">
                                Revisitez vos horaires tous les trimestres
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-forest-100/50 flex justify-end">
                        <button @click="generateOptimalSchedule"
                            class="px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2">
                            <span>✨</span>
                            <span>Générer un planning optimisé</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>

        <!-- Modal de création/édition de créneau -->
        <transition enter-active-class="transition-all duration-500 ease-organic" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-500 ease-organic"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showSlotModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeSlotModal"></div>
                <div
                    class="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                    <!-- En-tête du modal -->
                    <div class="bg-gradient-to-r from-forest-500 to-forest-600 px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl text-white">{{ editingSlot ? '✏️' : '➕' }}</span>
                                <h3 class="text-xl font-serif font-semibold text-white">
                                    {{ editingSlot ? 'Modifier le créneau' : 'Nouveau créneau' }}
                                </h3>
                            </div>
                            <button @click="closeSlotModal" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <span class="text-white text-xl">✖️</span>
                            </button>
                        </div>
                    </div>

                    <!-- Contenu du modal -->
                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        <div class="space-y-6">
                            <!-- Jour et heures -->
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>📅</span>
                                            <span>Jour</span>
                                        </span>
                                    </label>
                                    <select v-model="slotForm.dayOfWeek"
                                        class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                        <option v-for="day in weekDays" :key="day.id" :value="day.id">
                                            {{ day.name }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>🕒</span>
                                            <span>Point de retrait</span>
                                        </span>
                                    </label>
                                    <div class="p-3 bg-forest-50 rounded-lg border border-forest-100">
                                        <div class="flex items-center space-x-2">
                                            <span class="text-lg">{{ selectedPickupPoint?.icon || '📍' }}</span>
                                            <span class="font-medium text-forest-700">{{ selectedPickupPoint?.name ||
                                                'Non sélectionné' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>🕐</span>
                                            <span>Heure de début</span>
                                        </span>
                                    </label>
                                    <input v-model="slotForm.startTime" type="time"
                                        class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-forest-700 mb-2">
                                        <span class="inline-flex items-center space-x-1">
                                            <span>🕔</span>
                                            <span>Heure de fin</span>
                                        </span>
                                    </label>
                                    <input v-model="slotForm.endTime" type="time"
                                        class="w-full px-4 py-3 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                                </div>
                            </div>

                            <!-- Capacité -->
                            <div>
                                <label class="block text-sm font-medium text-forest-700 mb-2">
                                    <span class="inline-flex items-center space-x-1">
                                        <span>👥</span>
                                        <span>Capacité maximale</span>
                                    </span>
                                </label>
                                <div class="space-y-4">
                                    <div class="flex items-center space-x-6">
                                        <div class="flex-1">
                                            <input v-model.number="slotForm.maxOrders" type="range" min="1" max="50"
                                                class="w-full accent-forest-500" />
                                            <div class="flex justify-between text-xs text-terracotta-600 mt-1">
                                                <span>1 personne</span>
                                                <span>Jusqu'à 50 personnes</span>
                                            </div>
                                        </div>
                                        <div class="w-20 text-center">
                                            <div class="text-3xl font-bold text-forest-800">{{ slotForm.maxOrders }}
                                            </div>
                                            <div class="text-xs text-terracotta-600">personnes</div>
                                        </div>
                                    </div>

                                    <div class="p-3 bg-forest-50/50 rounded-lg">
                                        <div class="flex items-center justify-between text-sm">
                                            <span class="text-forest-700">Durée estimée:</span>
                                            <span class="font-medium text-forest-800">{{ calculateDuration() }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Répétition -->
                            <div>
                                <label class="block text-sm font-medium text-forest-700 mb-2">
                                    <span class="inline-flex items-center space-x-1">
                                        <span>🔁</span>
                                        <span>Répétition</span>
                                    </span>
                                </label>
                                <div class="flex items-center space-x-4">
                                    <label class="flex items-center space-x-2">
                                        <input v-model="slotForm.repeat" type="checkbox"
                                            class="rounded text-forest-500 focus:ring-forest-400" />
                                        <span class="text-forest-700">Répéter chaque semaine</span>
                                    </label>

                                    <div v-if="slotForm.repeat" class="flex items-center space-x-2">
                                        <span class="text-sm text-terracotta-600">pendant</span>
                                        <input v-model.number="slotForm.repeatWeeks" type="number" min="1" max="52"
                                            class="w-16 px-2 py-1 border border-forest-200 rounded text-center" />
                                        <span class="text-sm text-terracotta-600">semaines</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Boutons -->
                        <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-forest-100">
                            <button type="button" @click="closeSlotModal"
                                class="px-6 py-3 text-forest-600 hover:bg-forest-50 rounded-xl transition-all duration-300 ease-organic">
                                Annuler
                            </button>
                            <button @click="saveSlot"
                                class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-organic flex items-center space-x-2">
                                <span>{{ editingSlot ? '💾' : '➕' }}</span>
                                <span>{{ editingSlot ? 'Mettre à jour' : 'Créer le créneau' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Toast de confirmation -->
        <transition enter-active-class="transition-all duration-500 ease-organic"
            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-500 ease-organic" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4">
            <div v-if="showSuccessToast"
                class="fixed bottom-6 right-6 bg-white border border-forest-200 rounded-xl shadow-xl p-4 max-w-sm animate-slide-up">
                <div class="flex items-center space-x-3">
                    <div class="p-2 bg-forest-100 rounded-lg">
                        <span class="text-xl">✅</span>
                    </div>
                    <div>
                        <p class="font-medium text-forest-700">{{ toastMessage }}</p>
                        <p class="text-sm text-terracotta-600">{{ toastDescription }}</p>
                    </div>
                    <button @click="showSuccessToast = false" class="ml-4 p-1 hover:bg-forest-50 rounded">
                        <span>✖️</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducerStore } from '../stores/useProducerStore'
import { ProducerProfileService } from '../services'
import { getErrorMessage } from '@/shared/utils/error-handler'

const router = useRouter()
const store = useProducerStore()

// État de l'interface
const activeTab = ref('farm')
const selectedPeriod = ref('week')
const selectedTimeframe = ref('week')
const hoveredDay = ref<any>(null)
const hoveredSlot = ref<any>(null)
const selectedPickupPoint = ref<any>(null)
const selectedDate = ref<string | null>(null)
const showSlotModal = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')
const toastDescription = ref('')
const editingSlot = ref<any>(null)
const currentWeek = ref(new Date())
const currentMonth = ref(new Date())

// Données
const tabs = computed(() => [
    { id: 'farm', label: 'Horaires ferme', icon: '🏡', badge: null },
    { id: 'slots', label: 'Créneaux', icon: '🕒', badge: totalSlots.value > 0 ? String(totalSlots.value) : null },
    { id: 'calendar', label: 'Calendrier', icon: '🗓️', badge: null }
])

const createDefaultFarmSchedule = () => ([
    { id: 1, name: 'Lundi', isOpen: false, openTime: '08:00', closeTime: '17:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' },
    { id: 2, name: 'Mardi', isOpen: false, openTime: '08:00', closeTime: '17:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' },
    { id: 3, name: 'Mercredi', isOpen: false, openTime: '08:00', closeTime: '17:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' },
    { id: 4, name: 'Jeudi', isOpen: false, openTime: '08:00', closeTime: '17:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' },
    { id: 5, name: 'Vendredi', isOpen: false, openTime: '08:00', closeTime: '17:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' },
    { id: 6, name: 'Samedi', isOpen: false, openTime: '08:00', closeTime: '14:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' },
    { id: 7, name: 'Dimanche', isOpen: false, openTime: '08:00', closeTime: '12:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' }
])

// Horaires de la ferme
const farmSchedule = ref(createDefaultFarmSchedule())

// Horaires spéciaux
const specialSchedules = ref<any[]>([])

// Points de retrait
const pickupPoints = ref<any[]>([])

// Créneaux
const slots = ref<any[]>([])

// Formulaire de créneau
const slotForm = reactive({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '12:00',
    maxOrders: 10,
    repeat: false,
    repeatWeeks: 4
})

// Jours de la semaine
const weekDays = computed(() => [
    { id: 1, name: 'Lundi', date: formatDate(addDays(currentWeek.value, 0)) },
    { id: 2, name: 'Mardi', date: formatDate(addDays(currentWeek.value, 1)) },
    { id: 3, name: 'Mercredi', date: formatDate(addDays(currentWeek.value, 2)) },
    { id: 4, name: 'Jeudi', date: formatDate(addDays(currentWeek.value, 3)) },
    { id: 5, name: 'Vendredi', date: formatDate(addDays(currentWeek.value, 4)) },
    { id: 6, name: 'Samedi', date: formatDate(addDays(currentWeek.value, 5)) },
    { id: 7, name: 'Dimanche', date: formatDate(addDays(currentWeek.value, 6)) }
])

// Créneaux horaires pour la grille
const timeSlots = computed(() => {
    const slots = []
    for (let hour = 8; hour <= 20; hour += 2) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
})

// Créneaux du point sélectionné
const currentSlots = computed(() => {
    if (!selectedPickupPoint.value) return []
    return slots.value.filter(slot => slot.pickupPointId === selectedPickupPoint.value.id)
})

// Calculs
const activePickupPoints = computed(() => pickupPoints.value.filter(p => p.status === 'active').length)
const totalPickupPoints = computed(() => pickupPoints.value.length)
const totalSlots = computed(() => slots.value.length)
const upcomingOrders = computed(() => slots.value.reduce((sum, slot) => sum + Number(slot.currentOrders || 0), 0))
const upcomingOrdersChange = computed(() => {
    const now = new Date()
    const nextWeek = addDays(now, 7)
    const previousWeek = addDays(now, -7)

    let upcoming = 0
    let previous = 0

    for (const slot of slots.value) {
        if (!slot.date) continue
        const slotDate = new Date(slot.date)
        if (slotDate >= now && slotDate <= nextWeek) {
            upcoming += Number(slot.currentOrders || 0)
        }
        if (slotDate < now && slotDate >= previousWeek) {
            previous += Number(slot.currentOrders || 0)
        }
    }

    if (previous <= 0) return upcoming > 0 ? 100 : 0
    const change = Math.round(((upcoming - previous) / previous) * 100)
    return Math.max(change, 0)
})
const averageOccupancy = computed(() => {
    if (slots.value.length === 0) return 0
    const total = slots.value.reduce((sum, slot) => sum + slot.capacity, 0)
    return Math.round(total / slots.value.length)
})
const totalHours = computed(() => {
    return farmSchedule.value.reduce((sum, day) => {
        if (!day.isOpen) return sum
        const open = parseTime(day.openTime)
        const close = parseTime(day.closeTime)
        if (!open || !close) return sum
        const diff = (close.getTime() - open.getTime()) / (1000 * 60 * 60)
        return diff > 0 ? sum + diff : sum
    }, 0)
})

const occupancyData = computed(() =>
    weekDays.value.map(day => {
        const daySlots = slots.value.filter(slot => slot.dayOfWeek === day.id)
        const maxOrders = daySlots.reduce((sum, slot) => sum + Number(slot.maxOrders || 0), 0)
        const currentOrders = daySlots.reduce((sum, slot) => sum + Number(slot.currentOrders || 0), 0)
        const occupancy = maxOrders > 0 ? Math.round((currentOrders / maxOrders) * 100) : 0
        return {
            name: day.name,
            shortName: day.name.slice(0, 3),
            date: day.date,
            occupancy,
            reservations: currentOrders
        }
    })
)

// Dates
const currentWeekRange = computed(() => {
    const start = new Date(currentWeek.value)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return `${formatDate(start)} - ${formatDate(end)}`
})

const currentMonthYear = computed(() => {
    return currentMonth.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const calendarEventsByDate = computed(() => {
    const events = new Map<string, Array<{ id: string; type: string; time: string; title: string; location: string; timeRange: string; icon: string }>>()

    for (const slot of slots.value) {
        if (!slot.date) continue
        const point = pickupPoints.value.find(p => String(p.id) === String(slot.pickupPointId))
        const list = events.get(slot.date) || []
        list.push({
            id: `slot-${slot.id}`,
            type: 'slot',
            icon: '🕒',
            time: slot.startTime,
            title: 'Créneau de retrait',
            location: point?.name || 'Point de retrait',
            timeRange: `${slot.startTime} - ${slot.endTime}`
        })
        events.set(slot.date, list)
    }

    for (const special of specialSchedules.value) {
        if (!special.date) continue
        const list = events.get(special.date) || []
        list.push({
            id: `special-${special.id}`,
            type: special.hours === 'Fermé' ? 'holiday' : 'special',
            icon: special.icon || '🎉',
            time: '00:00',
            title: special.title,
            location: 'Ferme',
            timeRange: special.hours || 'Exception horaire'
        })
        events.set(special.date, list)
    }

    return events
})

// Jours du calendrier
const calendarDays = computed(() => {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []

    // Jours du mois précédent
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    for (let i = firstDayOfWeek; i > 0; i--) {
        const date = new Date(year, month, -i + 1)
        days.push(createCalendarDay(date, false))
    }

    // Jours du mois en cours
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i)
        days.push(createCalendarDay(date, true))
    }

    // Jours du mois suivant
    const totalCells = 42 // 6 semaines
    for (let i = 1; days.length < totalCells; i++) {
        const date = new Date(year, month + 1, i)
        days.push(createCalendarDay(date, false))
    }

    return days
})

const selectedDateEvents = computed(() => {
    if (!selectedDate.value) return []
    return calendarEventsByDate.value.get(selectedDate.value) || []
})

const selectedDateFormatted = computed(() => {
    if (!selectedDate.value) return ''
    const date = new Date(selectedDate.value)
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
})

// Méthodes utilitaires
function formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

function createCalendarDay(date: Date, inMonth: boolean) {
    const today = new Date()
    const isToday = date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    const dateKey = date.toISOString().split('T')[0]
    const dayEvents = calendarEventsByDate.value.get(dateKey) || []
    const hasEvents = dayEvents.length > 0
    const eventCount = dayEvents.length

    return {
        date: dateKey,
        day: date.getDate(),
        inMonth,
        isToday,
        hasEvents,
        eventCount,
        events: dayEvents.map(event => ({
            id: event.id,
            type: event.type,
            time: event.time,
            title: event.title
        }))
    }
}

function getDayEmoji(dayId: number): string {
    const emojis = ['📅', '🌱', '🌿', '🍃', '🍀', '🌻', '🎉']
    return emojis[dayId - 1] || '📅'
}

function getDayName(dayId: number): string {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    return days[dayId - 1] || ''
}

function hasSlotAt(dayId: number, timeSlot: string): boolean {
    if (!selectedPickupPoint.value) return false
    return currentSlots.value.some(slot => {
        return slot.dayOfWeek === dayId &&
            slot.startTime <= timeSlot &&
            slot.endTime >= timeSlot
    })
}

function getSlotClass(dayId: number, timeSlot: string): string {
    const slot = currentSlots.value.find(s =>
        s.dayOfWeek === dayId &&
        s.startTime <= timeSlot &&
        s.endTime >= timeSlot
    )

    if (!slot) return ''

    const occupancy = (slot.currentOrders / slot.maxOrders) * 100
    if (occupancy >= 80) return 'bg-gradient-to-t from-green-400 to-green-500'
    if (occupancy >= 50) return 'bg-gradient-to-t from-forest-400 to-forest-500'
    return 'bg-gradient-to-t from-terracotta-300 to-terracotta-400'
}

function getSlotInfo(dayId: number, timeSlot: string): string {
    const slot = currentSlots.value.find(s =>
        s.dayOfWeek === dayId &&
        s.startTime <= timeSlot &&
        s.endTime >= timeSlot
    )

    if (!slot) return 'Aucun créneau'
    return `${slot.startTime} - ${slot.endTime} • ${slot.currentOrders}/${slot.maxOrders} places`
}

function calculateDuration(): string {
    const start = parseTime(slotForm.startTime)
    const end = parseTime(slotForm.endTime)

    if (!start || !end) return '0h'

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return `${diff}h`
}

function parseTime(time: string): Date | null {
    if (!time) return null
    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
}

function calculateDurationBetween(start: string, end: string): string {
    const startTime = parseTime(start)
    const endTime = parseTime(end)
    if (!startTime || !endTime) return '0h'
    const diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    return `${diff > 0 ? diff : 0}h`
}

function getIsoDateForDay(dayId: number): string {
    const base = new Date(currentWeek.value)
    const target = addDays(base, dayId - 1)
    return target.toISOString().split('T')[0]
}

function pickupPointIcon(pointType?: string) {
    if (pointType === 'farm') return '🏡'
    if (pointType === 'farmers_market') return '🏪'
    if (pointType === 'delivery_point') return '📦'
    if (pointType === 'drive_thru') return '🚗'
    return '📍'
}

function pickupPointAddress(point: any) {
    const address = point?.address
    if (!address) return 'Adresse non renseignée'
    return [address.street, address.city, address.postal_code].filter(Boolean).join(', ')
}

function mapSlot(raw: any) {
    const maxOrders = Number(raw.max_orders ?? raw.maxOrders ?? raw.capacity?.max_orders ?? 0)
    const currentOrders = Number(raw.current_orders ?? raw.currentOrders ?? raw.bookings?.current_orders ?? 0)
    const fallbackDay = raw.date ? (() => {
        const d = new Date(String(raw.date))
        const js = d.getDay()
        return js === 0 ? 7 : js
    })() : 1
    const dayOfWeek = Number(raw.day_of_week ?? raw.dayOfWeek ?? fallbackDay)
    const startTime = String(raw.start_time ?? raw.startTime ?? '')
    const endTime = String(raw.end_time ?? raw.endTime ?? '')
    const duration = calculateDurationBetween(startTime, endTime)
    const capacity = maxOrders > 0 ? Math.round((currentOrders / maxOrders) * 100) : 0

    return {
        id: String(raw.id),
        pickupPointId: String(raw.pickup_point_id ?? raw.pickupPointId),
        dayOfWeek,
        startTime,
        endTime,
        maxOrders,
        currentOrders,
        duration,
        capacity,
        date: String(raw.date ?? getIsoDateForDay(dayOfWeek))
    }
}

async function loadProducerScheduleData() {
    try {
        await store.fetchPickupPoints()
        pickupPoints.value = ((store.pickupPoints as any[]) || []).map(point => ({
            id: String(point.id),
            name: point.name || 'Point de retrait',
            icon: pickupPointIcon(point.type),
            address: pickupPointAddress(point),
            slotsCount: 0,
            status: point.is_active ? 'active' : 'inactive'
        }))

        await store.fetchAllSlots()
        slots.value = ((store.slots as any[]) || []).map(mapSlot)

        const pointCounters = new Map<string, number>()
        for (const slot of slots.value) {
            pointCounters.set(String(slot.pickupPointId), (pointCounters.get(String(slot.pickupPointId)) || 0) + 1)
        }
        pickupPoints.value = pickupPoints.value.map(point => ({
            ...point,
            slotsCount: pointCounters.get(String(point.id)) || 0
        }))

        if (!selectedPickupPoint.value && pickupPoints.value.length > 0) {
            selectedPickupPoint.value = pickupPoints.value[0]
        } else if (selectedPickupPoint.value) {
            const refreshed = pickupPoints.value.find(point => String(point.id) === String(selectedPickupPoint.value?.id))
            selectedPickupPoint.value = refreshed || pickupPoints.value[0] || null
        }

        try {
            const schedule = await ProducerProfileService.getSchedule()
            if (Array.isArray(schedule) && schedule.length > 0) {
                const nextSchedule = createDefaultFarmSchedule()
                for (const item of schedule) {
                    const day = nextSchedule.find(d => d.id === Number((item as any).day_of_week))
                    if (!day) continue
                    day.isOpen = Boolean((item as any).is_active)
                    day.openTime = String((item as any).open_time || day.openTime)
                    day.closeTime = String((item as any).close_time || day.closeTime)
                }
                farmSchedule.value = nextSchedule
            }
        } catch {
            // Aucun horaire configuré côté API: on garde la grille par défaut.
        }

        try {
            const exceptions = await ProducerProfileService.getScheduleExceptions()
            specialSchedules.value = (exceptions || []).map((exception: any) => {
                const date = String(exception.date || '')
                const closed = Boolean(exception.is_closed)
                return {
                    id: String(exception.id),
                    title: exception.reason || 'Exception horaire',
                    icon: closed ? '🚫' : '🎉',
                    dateRange: date ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue',
                    description: closed ? 'Fermeture exceptionnelle' : 'Horaires exceptionnels',
                    hours: closed ? 'Fermé' : `${exception.special_hours?.open_time || '--:--'} - ${exception.special_hours?.close_time || '--:--'}`,
                    affectedPoints: pickupPoints.value.length,
                    status: date && new Date(date) < new Date() ? 'past' : 'active',
                    date
                }
            })
        } catch {
            specialSchedules.value = []
        }
    } catch (error: unknown) {
        showToast('Erreur de chargement', getErrorMessage(error))
    }
}

// Actions
function openQuickScheduleModal() {
    activeTab.value = 'slots'
}

function copyScheduleToAll() {
    const template = { ...farmSchedule.value[0] }
    farmSchedule.value.forEach(day => {
        if (day.id !== 1) {
            day.openTime = template.openTime
            day.closeTime = template.closeTime
            day.hasLunchBreak = template.hasLunchBreak
            day.lunchStart = template.lunchStart
            day.lunchEnd = template.lunchEnd
        }
    })

    showToast('Horaires copiés', 'Les horaires ont été appliqués à toute la semaine')
}

function resetFarmSchedule() {
    farmSchedule.value = createDefaultFarmSchedule()

    showToast('Horaires réinitialisés', 'Les horaires par défaut ont été appliqués')
}

async function saveFarmSchedule() {
    try {
        const payload = farmSchedule.value.map(day => ({
            day_of_week: day.id,
            open_time: day.isOpen ? day.openTime : '00:00',
            close_time: day.isOpen ? day.closeTime : '00:00',
            is_active: day.isOpen
        }))
        await ProducerProfileService.updateSchedule(payload as any)
        showToast('Horaires sauvegardés', 'Les horaires de la ferme ont été mis à jour')
    } catch (error: unknown) {
        showToast('Erreur horaires', getErrorMessage(error))
    }
}

function addSpecialSchedule() {
    showToast('Exception horaire', 'Ajoutez vos exceptions depuis la configuration horaire API.')
}

function editSpecialSchedule(_schedule: any) {
    showToast('Exception horaire', 'La modification d’exception sera ajoutée dans cette vue.')
}

function deleteSpecialSchedule(schedule: any) {
    specialSchedules.value = specialSchedules.value.filter(s => s.id !== schedule.id)
    showToast('Horaire retiré', 'L’exception a été retirée de l’affichage local.')
}

function addPickupPoint() {
    router.push('/producer/pickup-points')
}

function previousWeek() {
    currentWeek.value = addDays(currentWeek.value, -7)
}

function nextWeek() {
    currentWeek.value = addDays(currentWeek.value, 7)
}

function openSlotModal() {
    editingSlot.value = null
    Object.assign(slotForm, {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '12:00',
        maxOrders: 10,
        repeat: false,
        repeatWeeks: 4
    })
    showSlotModal.value = true
}

function closeSlotModal() {
    showSlotModal.value = false
    editingSlot.value = null
}

function editSlotAt(dayId: number, timeSlot: string) {
    const slot = currentSlots.value.find(s =>
        s.dayOfWeek === dayId &&
        s.startTime <= timeSlot &&
        s.endTime >= timeSlot
    )

    if (slot) {
        editSlot(slot)
    } else {
        slotForm.dayOfWeek = dayId
        slotForm.startTime = timeSlot

        // Définir la fin du créneau 3 heures plus tard
        const [hours, minutes] = timeSlot.split(':').map(Number)
        const endTime = new Date()
        endTime.setHours(hours + 3, minutes)
        slotForm.endTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`

        editingSlot.value = null
        showSlotModal.value = true
    }
}

function editSlot(slot: any) {
    editingSlot.value = slot
    Object.assign(slotForm, {
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxOrders: slot.maxOrders,
        repeat: false,
        repeatWeeks: 4
    })
    showSlotModal.value = true
}

async function deleteSlot(slot: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le créneau du ${getDayName(slot.dayOfWeek)} de ${slot.startTime} à ${slot.endTime} ?`)) {
        try {
            await store.deleteSlot(String(slot.id))
            await loadProducerScheduleData()
            showToast('Créneau supprimé', 'Le créneau a été supprimé avec succès')
        } catch (error: unknown) {
            showToast('Erreur suppression', getErrorMessage(error))
        }
    }
}

async function saveSlot() {
    if (!selectedPickupPoint.value) {
        showToast('Point manquant', 'Sélectionnez un point de retrait avant de continuer.')
        return
    }
    if (!slotForm.startTime || !slotForm.endTime || slotForm.endTime <= slotForm.startTime) {
        showToast('Horaire invalide', 'L’heure de fin doit être supérieure à l’heure de début.')
        return
    }

    const payload = {
        pickup_point_id: String(selectedPickupPoint.value.id),
        date: getIsoDateForDay(slotForm.dayOfWeek),
        day_of_week: slotForm.dayOfWeek,
        start_time: slotForm.startTime,
        end_time: slotForm.endTime,
        max_orders: slotForm.maxOrders,
        is_active: true
    }

    try {
        if (editingSlot.value?.id) {
            await store.updateSlot(String(editingSlot.value.id), payload as any)
            showToast('Créneau mis à jour', 'Les modifications ont été enregistrées')
        } else {
            await store.createSlot(String(selectedPickupPoint.value.id), payload as any)
            showToast('Créneau créé', 'Le nouveau créneau a été ajouté')
        }
        closeSlotModal()
        await loadProducerScheduleData()
    } catch (error: unknown) {
        showToast('Erreur créneau', getErrorMessage(error))
    }
}

function applyTemplate(template: string) {
    openSlotModal()
    const templates = {
        morning: { startTime: '09:00', endTime: '12:00', maxOrders: 15 },
        afternoon: { startTime: '14:00', endTime: '18:00', maxOrders: 20 },
        evening: { startTime: '18:00', endTime: '20:00', maxOrders: 10 }
    }

    Object.assign(slotForm, templates[template as keyof typeof templates])
}

function previousMonth() {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

function nextMonth() {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}

function selectDate(day: any) {
    selectedDate.value = selectedDate.value === day.date ? null : day.date
}

function editCalendarEvent(event: any) {
    if (String(event.type) === 'slot') {
        const slotId = String(event.id).replace('slot-', '')
        const found = slots.value.find(slot => String(slot.id) === slotId)
        if (found) {
            editSlot(found)
            return
        }
    }
    showToast('Événement', 'La modification est disponible pour les créneaux.')
}

function generateOptimalSchedule() {
    activeTab.value = 'slots'
    showToast('Suggestion prête', 'Utilisez les modèles matin/après-midi/soir pour planifier rapidement.')
}

function showToast(message: string, description: string) {
    toastMessage.value = message
    toastDescription.value = description
    showSuccessToast.value = true
    setTimeout(() => {
        showSuccessToast.value = false
    }, 3000)
}

onMounted(() => {
    // Sélectionner la date d'aujourd'hui dans le calendrier
    const today = new Date()
    selectedDate.value = today.toISOString().split('T')[0]
    void loadProducerScheduleData()
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
        transform: translateY(-5px) rotate(0.5deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
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

/* Pattern d'horloge en filigrane */
.bg-clock-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='80' stroke='%233a7d34' stroke-width='2' stroke-opacity='0.03' fill='none'/%3E%3Cline x1='100' y1='100' x2='140' y2='100' stroke='%233a7d34' stroke-width='2' stroke-opacity='0.03'/%3E%3Cline x1='100' y1='100' x2='100' y2='60' stroke='%233a7d34' stroke-width='2' stroke-opacity='0.03'/%3E%3Ccircle cx='100' cy='100' r='5' fill='%233a7d34' fill-opacity='0.03'/%3E%3C/svg%3E");
}

/* Palette de couleurs étendue */
.text-forest-20 {
    color: #fdfdfd;
}

.bg-forest-20 {
    background-color: #fdfdfd;
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
.schedule-view::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 10% 20%, rgba(100, 170, 100, 0.05) 0%, transparent 25%),
        radial-gradient(circle at 90% 80%, rgba(235, 158, 105, 0.03) 0%, transparent 25%);
    animation: float 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: -15;
}

/* Scrollbar personnalisée */
.schedule-view ::-webkit-scrollbar {
    width: 6px;
}

.schedule-view ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
}

.schedule-view ::-webkit-scrollbar-thumb {
    background: rgba(100, 170, 100, 0.3);
    border-radius: 10px;
}

.schedule-view ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 170, 100, 0.5);
}

/* Styles pour les transitions */
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

/* Effets de survol spéciaux */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Styles pour la grille de créneaux */
.slot-grid-cell {
    transition: all 0.2s ease-organic;
}

.slot-grid-cell:hover {
    transform: scale(1.1);
    z-index: 10;
}

/* Styles pour le calendrier */
.calendar-day {
    transition: all 0.2s ease-organic;
}

.calendar-day:hover {
    background-color: rgba(100, 170, 100, 0.1);
    transform: translateY(-2px);
}

/* Styles pour les barres de progression */
.progress-bar {
    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Styles pour les graphiques */
.occupancy-bar {
    transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Styles pour les boutons de navigation */
.nav-button {
    transition: all 0.3s ease-organic;
}

.nav-button:hover {
    background-color: rgba(100, 170, 100, 0.1);
    transform: translateY(-1px);
}

/* Styles pour les onglets */
.tab-button {
    position: relative;
    overflow: hidden;
}

.tab-button::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, #64aa64, #508850);
    transform: translateX(-100%);
    transition: transform 0.3s ease-organic;
}

.tab-button:hover::after {
    transform: translateX(0);
}

/* Animation pour les créneaux occupés */
@keyframes slotPulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
    }
}

.slot-occupied {
    animation: slotPulse 2s infinite;
}

/* Styles pour les jours fériés */
.holiday {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border-color: #ffeaa7;
}

/* Styles pour les événements spéciaux */
.special-event {
    background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
    border-color: #bee5eb;
}

/* Responsive design */
@media (max-width: 768px) {
    .schedule-view {
        font-size: 14px;
    }

    .time-slots-grid {
        font-size: 11px;
    }

    .calendar-day {
        min-height: 60px;
        padding: 4px;
    }
}
</style>
