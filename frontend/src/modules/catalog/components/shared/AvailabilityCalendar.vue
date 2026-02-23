<template>
    <div class="organic-calendar-container relative overflow-hidden rounded-3xl">
        <!-- Animations de fond subtiles -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="leaf-float absolute top-5 left-5 text-5xl text-primary-green/20">🍃</div>
            <div class="leaf-float absolute top-10 right-10 text-4xl text-secondary-orange/20"
                style="animation-delay: 3s;">🌿</div>
            <div class="leaf-float absolute bottom-20 left-20 text-6xl text-forest-green/20"
                style="animation-delay: 6s;">🍂</div>
            <div class="leaf-float absolute bottom-10 right-20 text-5xl text-earth-brown/20"
                style="animation-delay: 9s;">🌱</div>
        </div>

        <!-- Texture de fond organique -->
        <div class="absolute inset-0 calendar-texture opacity-5"></div>

        <!-- Contenu du calendrier -->
        <div class="relative z-10">
            <!-- En-tête du calendrier -->
            <div class="calendar-header animate-slide-in-down">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div class="text-center md:text-left">
                        <h2 class="text-3xl font-bold text-forest-green mb-2">Calendrier de Disponibilité</h2>
                        <p class="text-earth-brown/80">Suivez la fraîcheur des produits au fil des saisons</p>
                    </div>

                    <!-- Sélecteur de produit -->
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <select v-model="selectedProduct"
                                class="px-4 py-3 pl-12 bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all duration-300 transition-organic appearance-none cursor-pointer hover:border-green-300">
                                <option value="all">Tous les produits</option>
                                <option v-for="product in products" :key="product.id" :value="product.id">
                                    {{ product.icon }} {{ product.name }}
                                </option>
                            </select>
                            <span class="absolute left-4 top-3.5 text-xl text-green-500">🍎</span>
                            <span class="absolute right-4 top-3.5 text-green-500">▼</span>
                        </div>

                        <!-- Bouton d'export -->
                        <button @click="exportCalendar"
                            class="p-3 bg-gradient-to-r from-primary-green/10 to-green-100/50 border border-primary-green/30 text-primary-green rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center justify-center"
                            title="Exporter le calendrier">
                            <span class="text-xl">📤</span>
                        </button>
                    </div>
                </div>

                <!-- Contrôles de navigation -->
                <div
                    class="organic-navigation-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-green-100/50 shadow-sm">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                        <!-- Navigation mois/année -->
                        <div class="flex items-center space-x-4">
                            <button @click="previousYear"
                                class="p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-700 hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                                title="Année précédente">
                                <span class="text-xl">⏪</span>
                            </button>

                            <button @click="previousMonth"
                                class="p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-700 hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                                title="Mois précédent">
                                <span class="text-xl">◀</span>
                            </button>

                            <div class="text-center">
                                <h3 class="text-2xl font-bold text-forest-green">{{ currentMonthName }} {{ currentYear
                                    }}</h3>
                                <p class="text-sm text-earth-brown/70">{{ getSeason() }} • {{ getSeasonIcon() }}</p>
                            </div>

                            <button @click="nextMonth"
                                class="p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-700 hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                                title="Mois suivant">
                                <span class="text-xl">▶</span>
                            </button>

                            <button @click="nextYear"
                                class="p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-700 hover:shadow-md transition-all duration-300 transition-organic hover:scale-105"
                                title="Année suivante">
                                <span class="text-xl">⏩</span>
                            </button>
                        </div>

                        <!-- Vue rapide -->
                        <div class="flex items-center space-x-4">
                            <div class="flex space-x-2">
                                <button v-for="view in viewTypes" :key="view.id" @click="activeView = view.id"
                                    class="px-4 py-2 rounded-lg transition-all duration-300 transition-organic hover:scale-105"
                                    :class="activeView === view.id
                                        ? 'bg-gradient-to-r from-primary-green to-green-600 text-white shadow-md'
                                        : 'bg-white/70 border border-green-200 text-gray-700 hover:bg-green-50'">
                                    <span class="flex items-center space-x-2">
                                        <span>{{ view.icon }}</span>
                                        <span class="hidden sm:inline">{{ view.label }}</span>
                                    </span>
                                </button>
                            </div>

                            <!-- Aujourd'hui -->
                            <button @click="goToToday"
                                class="px-4 py-3 bg-gradient-to-r from-secondary-orange/10 to-orange-100 border border-secondary-orange/30 text-earth-brown rounded-xl hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                                <span class="text-xl">📅</span>
                                <span class="hidden md:inline">Aujourd'hui</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Légende de disponibilité -->
                <div class="mb-6 animate-fade-in">
                    <div class="flex flex-wrap justify-center gap-4">
                        <div v-for="status in availabilityStatuses" :key="status.id"
                            class="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-green-100">
                            <div class="w-3 h-3 rounded-full" :class="status.colorClass"></div>
                            <span class="text-sm font-medium text-gray-700">{{ status.label }}</span>
                            <span v-if="status.count" class="text-xs px-2 py-1 rounded-full bg-gray-100">
                                {{ status.count }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Grille du calendrier -->
            <div
                class="organic-calendar-grid bg-white/90 backdrop-blur-sm rounded-2xl border border-green-100/50 shadow-sm overflow-hidden animate-fade-in">
                <!-- En-tête des jours de la semaine -->
                <div class="grid grid-cols-7 border-b border-green-100 bg-gradient-to-r from-green-50 to-green-100/30">
                    <div v-for="day in weekDays" :key="day"
                        class="p-4 text-center font-semibold text-forest-green border-r border-green-100 last:border-r-0">
                        {{ day }}
                    </div>
                </div>

                <!-- Grille des jours -->
                <div class="grid grid-cols-7">
                    <!-- Jours vides du début -->
                    <div v-for="n in startingDay" :key="`empty-start-${n}`"
                        class="min-h-32 p-2 border-r border-b border-green-50 bg-gradient-to-br from-gray-50 to-gray-100/50">
                    </div>

                    <!-- Jours du mois -->
                    <div v-for="day in daysInMonth" :key="day" @click="selectDay(day)"
                        class="min-h-32 p-3 border-r border-b border-green-50 transition-all duration-300 transition-organic hover:bg-green-50/50 cursor-pointer relative"
                        :class="{
                            'bg-gradient-to-br from-yellow-50 to-yellow-100/30': isToday(day),
                            'bg-gradient-to-br from-primary-green/5 to-green-50/30': isSelectedDay(day),
                            'hover:scale-[1.02]': !isSelectedDay(day)
                        }">
                        <!-- Numéro du jour -->
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-lg font-semibold text-gray-800">{{ day }}</span>

                            <!-- Indicateur d'aujourd'hui -->
                            <span v-if="isToday(day)"
                                class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-secondary-orange to-orange-500 text-white">
                                Aujourd'hui
                            </span>
                        </div>

                        <!-- Disponibilités du jour -->
                        <div class="space-y-2 max-h-24 overflow-y-auto pr-1">
                            <div v-for="availability in getDayAvailabilities(day)" :key="availability.id"
                                @click.stop="toggleAvailability(availability)" class="availability-item" :class="{
                                    'selected': selectedAvailability === availability.id
                                }">
                                <div class="flex items-center space-x-2">
                                    <div class="w-2 h-2 rounded-full flex-shrink-0"
                                        :class="getStatusColor(availability.status)"></div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-800 truncate">{{
                                            availability.productName }}</p>
                                        <div class="flex items-center space-x-2">
                                            <span class="text-xs text-gray-500">{{ availability.timeRange }}</span>
                                            <span class="text-xs px-1.5 py-0.5 rounded"
                                                :class="getStatusBadgeClass(availability.status)">
                                                {{ getStatusLabel(availability.status) }}
                                            </span>
                                        </div>
                                    </div>
                                    <span class="text-lg flex-shrink-0">{{ availability.productIcon }}</span>
                                </div>
                            </div>

                            <!-- Placeholder si pas de disponibilités -->
                            <div v-if="getDayAvailabilities(day).length === 0" class="text-center py-4">
                                <span class="text-2xl text-gray-300">🌱</span>
                                <p class="text-xs text-gray-400 mt-1">Pas de disponibilité</p>
                            </div>
                        </div>

                        <!-- Indicateur de week-end -->
                        <div v-if="isWeekend(day)" class="absolute top-2 right-2">
                            <span class="text-xs text-blue-500">🏖️</span>
                        </div>
                    </div>

                    <!-- Jours vides de fin -->
                    <div v-for="n in endingDay" :key="`empty-end-${n}`"
                        class="min-h-32 p-2 border-r border-b border-green-50 bg-gradient-to-br from-gray-50 to-gray-100/50">
                    </div>
                </div>
            </div>

            <!-- Vue mensuelle - Graphique -->
            <div v-if="activeView === 'monthly'" class="mt-8 animate-fade-in">
                <div
                    class="organic-chart-card bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 shadow-sm">
                    <h3 class="text-xl font-semibold text-forest-green mb-6 flex items-center">
                        <span class="mr-3">📈</span>
                        Vue mensuelle des disponibilités
                    </h3>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Graphique à barres -->
                        <div>
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-medium text-gray-700">Disponibilité par semaine</h4>
                                <span class="text-sm text-gray-500">{{ currentMonthName }} {{ currentYear }}</span>
                            </div>

                            <div class="space-y-4">
                                <div v-for="week in weeklyStats" :key="week.weekNumber"
                                    class="flex items-center space-x-4">
                                    <span class="text-sm font-medium text-gray-700 w-16">Sem. {{ week.weekNumber
                                        }}</span>
                                    <div class="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                        <div class="h-full rounded-full transition-all duration-1000 transition-organic"
                                            :class="getWeekColorClass(week.percentage)"
                                            :style="{ width: `${week.percentage}%` }"></div>
                                    </div>
                                    <span class="text-sm font-medium" :class="getWeekTextClass(week.percentage)">
                                        {{ week.percentage }}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Statistiques -->
                        <div>
                            <div class="grid grid-cols-2 gap-4">
                                <div
                                    class="bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl p-4 border border-green-200">
                                    <p class="text-sm text-gray-600">Jours disponibles</p>
                                    <p class="text-3xl font-bold text-green-600 mt-1">{{ stats.availableDays }}</p>
                                    <p class="text-xs text-gray-500 mt-1">sur {{ daysInMonth }} jours</p>
                                </div>

                                <div
                                    class="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-xl p-4 border border-amber-200">
                                    <p class="text-sm text-gray-600">Disponibilité moyenne</p>
                                    <p class="text-3xl font-bold text-amber-600 mt-1">{{ stats.averageAvailability }}%
                                    </p>
                                    <p class="text-xs text-gray-500 mt-1">Ce mois-ci</p>
                                </div>

                                <div
                                    class="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-200">
                                    <p class="text-sm text-gray-600">Produits concernés</p>
                                    <p class="text-3xl font-bold text-blue-600 mt-1">{{ stats.totalProducts }}</p>
                                    <p class="text-xs text-gray-500 mt-1">En gestion</p>
                                </div>

                                <div
                                    class="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-xl p-4 border border-purple-200">
                                    <p class="text-sm text-gray-600">Prochain pic</p>
                                    <p class="text-3xl font-bold text-purple-600 mt-1">{{ stats.nextPeakDay }}</p>
                                    <p class="text-xs text-gray-500 mt-1">{{ stats.nextPeakMonth }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vue hebdomadaire -->
            <div v-if="activeView === 'weekly'" class="mt-8 animate-fade-in">
                <div
                    class="organic-week-view bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 shadow-sm">
                    <h3 class="text-xl font-semibold text-forest-green mb-6 flex items-center">
                        <span class="mr-3">📅</span>
                        Vue hebdomadaire détaillée
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
                        <div v-for="(day, index) in currentWeekDays" :key="day.date"
                            class="bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl p-4 border border-green-200">
                            <div class="text-center mb-3">
                                <p class="text-sm text-gray-500">{{ day.weekDay }}</p>
                                <p class="text-2xl font-bold text-gray-800">{{ day.day }}</p>
                                <p class="text-xs text-gray-500">{{ day.month }}</p>
                            </div>

                            <div class="space-y-2">
                                <div v-for="availability in getAvailabilitiesForDate(day.date)" :key="availability.id"
                                    class="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-lg">{{ availability.productIcon }}</span>
                                        <div>
                                            <p class="text-xs font-medium text-gray-800">{{ availability.productName }}
                                            </p>
                                            <p class="text-xs text-gray-500">{{ availability.timeRange }}</p>
                                        </div>
                                    </div>
                                    <span class="text-xs px-2 py-1 rounded"
                                        :class="getStatusBadgeClass(availability.status)">
                                        {{ getStatusLabel(availability.status).charAt(0) }}
                                    </span>
                                </div>

                                <div v-if="getAvailabilitiesForDate(day.date).length === 0" class="text-center py-2">
                                    <span class="text-2xl text-gray-300">🌿</span>
                                    <p class="text-xs text-gray-400 mt-1">Libre</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Détails de la disponibilité sélectionnée -->
            <div v-if="selectedAvailabilityDetails" class="mt-8 animate-fade-in">
                <div
                    class="organic-details-card bg-gradient-to-r from-primary-green/5 via-green-50/30 to-emerald-50/20 rounded-2xl p-6 border border-primary-green/30">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                <span class="text-3xl">{{ selectedAvailabilityDetails.productIcon }}</span>
                            </div>
                            <div>
                                <h4 class="text-xl font-bold text-gray-900">{{ selectedAvailabilityDetails.productName
                                    }}</h4>
                                <p class="text-gray-600">{{ formatDate(selectedAvailabilityDetails.date) }} • {{
                                    selectedAvailabilityDetails.timeRange }}</p>
                            </div>
                        </div>

                        <div class="flex space-x-3">
                            <button @click="editAvailability(selectedAvailabilityDetails)"
                                class="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 rounded-lg hover:shadow-md transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                                <span class="text-lg">✏️</span>
                                <span>Modifier</span>
                            </button>
                            <button @click="deleteAvailability(selectedAvailabilityDetails)"
                                class="px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 rounded-lg hover:shadow-md transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                                <span class="text-lg">🗑️</span>
                                <span>Supprimer</span>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p class="text-sm text-gray-500">Statut</p>
                            <div class="flex items-center space-x-2 mt-1">
                                <div class="w-3 h-3 rounded-full"
                                    :class="getStatusColor(selectedAvailabilityDetails.status)"></div>
                                <span class="font-medium"
                                    :class="getStatusTextClass(selectedAvailabilityDetails.status)">
                                    {{ getStatusLabel(selectedAvailabilityDetails.status) }}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">Quantité disponible</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">{{ selectedAvailabilityDetails.quantity }}
                                unités</p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">Producteur</p>
                            <p class="font-medium text-gray-900 mt-1 flex items-center">
                                <span class="mr-2">👨‍🌾</span>
                                {{ selectedAvailabilityDetails.producer }}
                            </p>
                        </div>

                        <div class="md:col-span-3">
                            <p class="text-sm text-gray-500">Notes</p>
                            <p class="text-gray-700 mt-1">{{ selectedAvailabilityDetails.notes || "Aucune note particulière" }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pied de page du calendrier -->
            <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
                <div class="text-sm text-gray-600">
                    <p class="flex items-center space-x-2">
                        <span class="text-xl">💡</span>
                        <span>Les disponibilités sont mises à jour quotidiennement par nos producteurs locaux</span>
                    </p>
                </div>

                <div class="flex space-x-4">
                    <button @click="printCalendar"
                        class="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:shadow-md transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                        <span class="text-lg">🖨️</span>
                        <span>Imprimer</span>
                    </button>
                    <button @click="shareCalendar"
                        class="px-4 py-2 bg-gradient-to-r from-primary-green to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transition-organic hover:scale-105 flex items-center space-x-2">
                        <span class="text-lg">🔗</span>
                        <span>Partager</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AvailabilityCalendar',
    props: {
        initialDate: {
            type: Date,
            default: () => new Date()
        },
        availabilities: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            currentDate: new Date(),
            selectedDay: null,
            selectedProduct: 'all',
            activeView: 'monthly',
            selectedAvailability: null,
            products: [
                { id: 'pommes', name: 'Pommes Golden', icon: '🍎' },
                { id: 'carottes', name: 'Carottes', icon: '🥕' },
                { id: 'salades', name: 'Salades', icon: '🥬' },
                { id: 'tomates', name: 'Tomates', icon: '🍅' },
                { id: 'fraises', name: 'Fraises', icon: '🍓' }
            ],
            weekDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            viewTypes: [
                { id: 'monthly', label: 'Mensuel', icon: '📅' },
                { id: 'weekly', label: 'Hebdo', icon: '📊' }
            ],
            availabilityData: [
                {
                    id: 1,
                    productId: 'pommes',
                    productName: 'Pommes Golden Bio',
                    productIcon: '🍎',
                    date: '2024-01-15',
                    timeRange: '9h-18h',
                    status: 'available',
                    quantity: 150,
                    producer: 'Ferme du Verger',
                    notes: 'Récolte du matin, très frais'
                },
                {
                    id: 2,
                    productId: 'carottes',
                    productName: 'Carottes Nouvelles',
                    productIcon: '🥕',
                    date: '2024-01-15',
                    timeRange: '10h-19h',
                    status: 'limited',
                    quantity: 75,
                    producer: 'Maraîchage Bio Direct',
                    notes: 'Quantité limitée ce jour'
                },
                {
                    id: 3,
                    productId: 'salades',
                    productName: 'Salade Batavia',
                    productIcon: '🥬',
                    date: '2024-01-16',
                    timeRange: '8h-17h',
                    status: 'available',
                    quantity: 200,
                    producer: 'Jardins de Saison',
                    notes: 'Livraison directe producteur'
                },
                {
                    id: 4,
                    productId: 'tomates',
                    productName: 'Tomates Cerises',
                    productIcon: '🍅',
                    date: '2024-01-17',
                    timeRange: '11h-20h',
                    status: 'unavailable',
                    quantity: 0,
                    producer: 'Serres du Sud',
                    notes: 'Rupture de stock temporaire'
                },
                {
                    id: 5,
                    productId: 'fraises',
                    productName: 'Fraises Gariguette',
                    productIcon: '🍓',
                    date: '2024-01-18',
                    timeRange: '7h-16h',
                    status: 'seasonal',
                    quantity: 40,
                    producer: 'Vergers du Soleil',
                    notes: 'Produit de saison'
                }
            ]
        }
    },
    computed: {
        currentYear() {
            return this.currentDate.getFullYear()
        },
        currentMonth() {
            return this.currentDate.getMonth()
        },
        currentMonthName() {
            const months = [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ]
            return months[this.currentMonth]
        },
        daysInMonth() {
            return new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
        },
        startingDay() {
            const firstDay = new Date(this.currentYear, this.currentMonth, 1)
            return firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
        },
        endingDay() {
            const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
            const lastDayOfWeek = lastDay.getDay()
            return lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek
        },
        availabilityStatuses() {
            const statuses = [
                { id: 'available', label: 'Disponible', colorClass: 'bg-green-500', count: 12 },
                { id: 'limited', label: 'Limité', colorClass: 'bg-amber-500', count: 8 },
                { id: 'unavailable', label: 'Indisponible', colorClass: 'bg-red-500', count: 3 },
                { id: 'seasonal', label: 'Saisonnier', colorClass: 'bg-blue-500', count: 5 }
            ]
            return statuses
        },
        selectedAvailabilityDetails() {
            if (!this.selectedAvailability) return null
            return this.availabilityData.find(a => a.id === this.selectedAvailability)
        },
        currentWeekDays() {
            const days = []
            const today = new Date()
            const currentDay = today.getDay()
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek)
                day.setDate(startOfWeek.getDate() + i)

                days.push({
                    date: day.toISOString().split('T')[0],
                    day: day.getDate(),
                    month: day.toLocaleDateString('fr-FR', { month: 'short' }),
                    weekDay: this.weekDays[i]
                })
            }

            return days
        },
        weeklyStats() {
            return [
                { weekNumber: 1, percentage: 85 },
                { weekNumber: 2, percentage: 90 },
                { weekNumber: 3, percentage: 75 },
                { weekNumber: 4, percentage: 95 },
                { weekNumber: 5, percentage: 80 }
            ]
        },
        stats() {
            return {
                availableDays: 22,
                averageAvailability: 85,
                totalProducts: this.products.length,
                nextPeakDay: 25,
                nextPeakMonth: 'Janvier'
            }
        }
    },
    methods: {
        getDayAvailabilities(day) {
            const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

            let filtered = this.availabilityData.filter(a => a.date === dateStr)

            if (this.selectedProduct !== 'all') {
                filtered = filtered.filter(a => a.productId === this.selectedProduct)
            }

            return filtered
        },
        getAvailabilitiesForDate(dateStr) {
            let filtered = this.availabilityData.filter(a => a.date === dateStr)

            if (this.selectedProduct !== 'all') {
                filtered = filtered.filter(a => a.productId === this.selectedProduct)
            }

            return filtered
        },
        isToday(day) {
            const today = new Date()
            return day === today.getDate() &&
                this.currentMonth === today.getMonth() &&
                this.currentYear === today.getFullYear()
        },
        isSelectedDay(day) {
            return this.selectedDay === day
        },
        isWeekend(day) {
            const date = new Date(this.currentYear, this.currentMonth, day)
            const dayOfWeek = date.getDay()
            return dayOfWeek === 0 || dayOfWeek === 6
        },
        selectDay(day) {
            this.selectedDay = this.selectedDay === day ? null : day
            this.selectedAvailability = null
        },
        toggleAvailability(availability) {
            this.selectedAvailability = this.selectedAvailability === availability.id ? null : availability.id
        },
        getStatusColor(status) {
            const colors = {
                available: 'bg-green-500',
                limited: 'bg-amber-500',
                unavailable: 'bg-red-500',
                seasonal: 'bg-blue-500'
            }
            return colors[status] || 'bg-gray-400'
        },
        getStatusTextClass(status) {
            const classes = {
                available: 'text-green-600',
                limited: 'text-amber-600',
                unavailable: 'text-red-600',
                seasonal: 'text-blue-600'
            }
            return classes[status] || 'text-gray-600'
        },
        getStatusBadgeClass(status) {
            const classes = {
                available: 'bg-green-100 text-green-800',
                limited: 'bg-amber-100 text-amber-800',
                unavailable: 'bg-red-100 text-red-800',
                seasonal: 'bg-blue-100 text-blue-800'
            }
            return classes[status] || 'bg-gray-100 text-gray-800'
        },
        getStatusLabel(status) {
            const labels = {
                available: 'Disponible',
                limited: 'Limité',
                unavailable: 'Indisponible',
                seasonal: 'Saisonnier'
            }
            return labels[status] || status
        },
        getWeekColorClass(percentage) {
            if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-green-600'
            if (percentage >= 60) return 'bg-gradient-to-r from-amber-500 to-amber-600'
            return 'bg-gradient-to-r from-red-500 to-red-600'
        },
        getWeekTextClass(percentage) {
            if (percentage >= 80) return 'text-green-600'
            if (percentage >= 60) return 'text-amber-600'
            return 'text-red-600'
        },
        getSeason() {
            const month = this.currentMonth
            if (month >= 2 && month <= 4) return 'Printemps 🌸'
            if (month >= 5 && month <= 7) return 'Été ☀️'
            if (month >= 8 && month <= 10) return 'Automne 🍂'
            return 'Hiver ❄️'
        },
        getSeasonIcon() {
            const month = this.currentMonth
            if (month >= 2 && month <= 4) return '🌱'
            if (month >= 5 && month <= 7) return '🌻'
            if (month >= 8 && month <= 10) return '🍁'
            return '⛄'
        },
        previousMonth() {
            this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1)
        },
        nextMonth() {
            this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1)
        },
        previousYear() {
            this.currentDate = new Date(this.currentYear - 1, this.currentMonth, 1)
        },
        nextYear() {
            this.currentDate = new Date(this.currentYear + 1, this.currentMonth, 1)
        },
        goToToday() {
            this.currentDate = new Date()
            this.selectedDay = null
            this.selectedAvailability = null
        },
        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        },
        editAvailability(availability) {
            console.log('Modifier la disponibilité:', availability)
            this.$emit('edit-availability', availability)
        },
        deleteAvailability(availability) {
            if (confirm(`Supprimer la disponibilité pour "${availability.productName}" ?`)) {
                console.log('Supprimer la disponibilité:', availability)
                this.$emit('delete-availability', availability.id)
            }
        },
        exportCalendar() {
            console.log('Exporter le calendrier')
            // Logique d'export
        },
        printCalendar() {
            window.print()
        },
        shareCalendar() {
            if (navigator.share) {
                navigator.share({
                    title: 'Calendrier de Disponibilité',
                    text: `Consultez le calendrier de disponibilité pour ${this.currentMonthName} ${this.currentYear}`,
                    url: window.location.href
                })
            } else {
                navigator.clipboard.writeText(window.location.href)
                alert('Lien copié dans le presse-papier !')
            }
        }
    },
    mounted() {
        this.currentDate = this.initialDate ? new Date(this.initialDate) : new Date()
        const today = new Date()
        if (this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth()) {
            this.selectedDay = today.getDate()
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
.organic-calendar-container {
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
    padding: 2rem;
}

/* Texture de fond */
.calendar-texture {
    background-image:
        radial-gradient(circle at 10% 20%, rgba(69, 163, 72, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(255, 140, 66, 0.03) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2345a348' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 200px 200px, 150px 150px, 100px 100px;
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

.animate-fade-in {
    animation: fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Cartes organiques */
.organic-navigation-card,
.organic-calendar-grid,
.organic-chart-card,
.organic-week-view,
.organic-details-card {
    position: relative;
    border: 1px solid transparent;
    background-clip: padding-box;
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.organic-navigation-card::before,
.organic-calendar-grid::before,
.organic-chart-card::before,
.organic-week-view::before,
.organic-details-card::before {
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
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.2;
    pointer-events: none;
}

.organic-details-card::before {
    opacity: 0.3;
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

/* Élément de disponibilité */
.availability-item {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 0.75rem;
    border: 1px solid rgba(229, 231, 235, 0.5);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.availability-item:hover {
    background: rgba(69, 163, 72, 0.05);
    border-color: var(--primary-green);
    transform: translateX(4px);
}

.availability-item.selected {
    background: rgba(69, 163, 72, 0.1);
    border-color: var(--primary-green);
    box-shadow: 0 4px 12px rgba(69, 163, 72, 0.15);
}

/* Transitions organiques */
.transition-organic {
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition-duration: 300ms;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(229, 231, 235, 0.3);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: var(--primary-green);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--forest-green);
}

/* Responsive */
@media (max-width: 768px) {
    .organic-calendar-container {
        padding: 1rem;
    }

    .calendar-header h2 {
        font-size: 1.5rem;
    }

    .organic-calendar-grid .min-h-32 {
        min-height: 6rem;
    }
}

@media (max-width: 640px) {
    .organic-calendar-grid .min-h-32 {
        min-height: 5rem;
        padding: 0.5rem;
    }

    .availability-item {
        padding: 0.25rem;
        font-size: 0.75rem;
    }
}

/* Impression */
@media print {
    .organic-calendar-container {
        background: white !important;
    }

    .leaf-float,
    .calendar-texture,
    button {
        display: none !important;
    }
}
</style>