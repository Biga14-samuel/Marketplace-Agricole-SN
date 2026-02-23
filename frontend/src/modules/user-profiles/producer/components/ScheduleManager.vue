<template>
    <div class="schedule-manager min-h-screen">
        <!-- Arrière-plan avec dégradé et texture -->
        <div class="absolute inset-0 -z-10 bg-gradient-to-br from-forest-50/80 via-cream-50/90 to-terracotta-50/70">
            <div class="absolute inset-0 bg-leaf-pattern opacity-5"></div>
        </div>

        <!-- Navigation supérieure -->
        <div class="sticky top-0 z-20 backdrop-blur-sm bg-white/80 border-b border-forest-100/20">
            <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <button @click="$router.back()"
                            class="p-2 rounded-full hover:bg-forest-50 transition-all duration-300 ease-organic">
                            <span class="text-xl">⬅️</span>
                        </button>
                        <div>
                            <h1 class="text-2xl font-serif font-semibold text-forest-800">
                                📅 Gestion des horaires
                            </h1>
                            <p class="text-sm text-terracotta-600">
                                Configurez vos horaires d'ouverture et vos créneaux de retrait
                            </p>
                        </div>
                    </div>
                    <button @click="saveAllSchedules" :disabled="isSaving"
                        class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-organic disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isSaving" class="flex items-center space-x-2">
                            <span class="animate-pulse">🔄</span>
                            <span>Sauvegarde...</span>
                        </span>
                        <span v-else class="flex items-center space-x-2">
                            <span>💾</span>
                            <span>Tout sauvegarder</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Contenu principal -->
        <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Section Horaires d'ouverture -->
            <section class="mb-12">
                <div
                    class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft border border-forest-100/30 overflow-hidden">
                    <!-- En-tête section -->
                    <div class="bg-gradient-to-r from-forest-50 to-cream-50 px-6 py-4 border-b border-forest-100/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-forest-100 rounded-lg">
                                    <span class="text-xl">🏪</span>
                                </div>
                                <div>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Horaires d'ouverture de la ferme
                                    </h2>
                                    <p class="text-sm text-terracotta-600">
                                        Définissez quand vos clients peuvent venir récupérer leurs commandes
                                    </p>
                                </div>
                            </div>
                            <button @click="toggleWeekSchedule"
                                class="px-4 py-2 bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-all duration-300 ease-organic flex items-center space-x-2">
                                <span>{{ showWeekSchedule ? 'Masquer' : 'Afficher' }}</span>
                                <span>{{ showWeekSchedule ? '👆' : '👇' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Horaires de la semaine -->
                    <transition enter-active-class="transition-all duration-500 ease-organic"
                        enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-screen"
                        leave-active-class="transition-all duration-500 ease-organic"
                        leave-from-class="opacity-100 max-h-screen" leave-to-class="opacity-0 max-h-0">
                        <div v-if="showWeekSchedule" class="p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <!-- Jour de la semaine -->
                                <div v-for="day in weekSchedule" :key="day.id"
                                    class="bg-white border border-forest-100 rounded-xl p-4 hover:shadow-md hover:border-forest-200 transition-all duration-300 ease-organic group"
                                    :class="{ 'bg-forest-50/50 border-forest-300': day.isOpen }">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center space-x-2">
                                            <input type="checkbox" v-model="day.isOpen" :id="`day-${day.id}`"
                                                class="h-4 w-4 rounded-full text-forest-600 focus:ring-forest-500 border-forest-300" />
                                            <label :for="`day-${day.id}`"
                                                class="font-medium text-forest-700 cursor-pointer">
                                                {{ day.name }}
                                            </label>
                                        </div>
                                        <span class="text-sm px-2 py-1 rounded-full"
                                            :class="day.isOpen ? 'bg-forest-100 text-forest-700' : 'bg-terracotta-50 text-terracotta-600'">
                                            {{ day.isOpen ? 'Ouvert 🌿' : 'Fermé 🍂' }}
                                        </span>
                                    </div>

                                    <div v-if="day.isOpen" class="space-y-3 animate-slide-up">
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

                                        <!-- Pause déjeuner -->
                                        <div class="pt-3 border-t border-forest-100">
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="text-xs font-medium text-forest-600">
                                                    Pause déjeuner 🍽️
                                                </label>
                                                <button @click="day.hasLunchBreak = !day.hasLunchBreak"
                                                    class="text-xs px-2 py-1 rounded"
                                                    :class="day.hasLunchBreak ? 'bg-forest-100 text-forest-700' : 'bg-gray-100 text-gray-600'">
                                                    {{ day.hasLunchBreak ? 'Activée' : 'Désactivée' }}
                                                </button>
                                            </div>

                                            <div v-if="day.hasLunchBreak"
                                                class="grid grid-cols-2 gap-3 animate-fade-in">
                                                <input type="time" v-model="day.lunchStart" placeholder="Début"
                                                    class="w-full px-2 py-1 text-sm border border-forest-200 rounded" />
                                                <input type="time" v-model="day.lunchEnd" placeholder="Fin"
                                                    class="w-full px-2 py-1 text-sm border border-forest-200 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    <div v-else class="text-center py-6 text-terracotta-500">
                                        <span class="text-2xl block mb-2">🏡</span>
                                        <span class="text-sm">Fermé ce jour</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions rapides -->
                            <div class="mt-6 pt-6 border-t border-forest-100 flex flex-wrap gap-3">
                                <button @click="copyScheduleToAllDays"
                                    class="px-4 py-2 bg-cream-200 text-forest-700 rounded-lg hover:bg-cream-300 transition-all duration-300 ease-organic flex items-center space-x-2">
                                    <span>📋</span>
                                    <span>Copier ce planning à toute la semaine</span>
                                </button>
                                <button @click="resetWeekSchedule"
                                    class="px-4 py-2 bg-terracotta-100 text-terracotta-700 rounded-lg hover:bg-terracotta-200 transition-all duration-300 ease-organic flex items-center space-x-2">
                                    <span>🔄</span>
                                    <span>Réinitialiser</span>
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </section>

            <!-- Section Créneaux de retrait -->
            <section class="mb-12">
                <div
                    class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft border border-forest-100/30 overflow-hidden">
                    <!-- En-tête section -->
                    <div class="bg-gradient-to-r from-cream-50 to-forest-50 px-6 py-4 border-b border-forest-100/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-cream-100 rounded-lg">
                                    <span class="text-xl">🕒</span>
                                </div>
                                <div>
                                    <h2 class="text-xl font-serif font-semibold text-forest-800">
                                        Créneaux de retrait
                                    </h2>
                                    <p class="text-sm text-terracotta-600">
                                        Gérez les créneaux disponibles pour chaque point de retrait
                                    </p>
                                </div>
                            </div>
                            <button @click="showAddSlotForm = !showAddSlotForm"
                                class="px-6 py-3 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-organic flex items-center space-x-2">
                                <span>➕</span>
                                <span>Nouveau créneau</span>
                            </button>
                        </div>
                    </div>

                    <!-- Liste des points de retrait -->
                    <div class="p-6">
                        <!-- Sélecteur de point de retrait -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-forest-700 mb-2">
                                📍 Point de retrait
                            </label>
                            <div class="flex flex-wrap gap-3">
                                <button v-for="point in pickupPoints" :key="point.id" @click="selectPickupPoint(point)"
                                    class="px-4 py-3 rounded-xl border transition-all duration-300 ease-organic flex items-center space-x-3"
                                    :class="{
                                        'border-forest-300 bg-forest-50 text-forest-700 shadow-sm': selectedPickupPoint?.id === point.id,
                                        'border-forest-100 hover:border-forest-200 hover:bg-forest-25': selectedPickupPoint?.id !== point.id
                                    }">
                                    <span class="text-lg">{{ point.icon }}</span>
                                    <div class="text-left">
                                        <div class="font-medium">{{ point.name }}</div>
                                        <div class="text-xs text-terracotta-600">{{ point.address }}</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Formulaire d'ajout de créneau -->
                        <transition enter-active-class="transition-all duration-500 ease-organic"
                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-screen"
                            leave-active-class="transition-all duration-500 ease-organic"
                            leave-from-class="opacity-100 max-h-screen" leave-to-class="opacity-0 max-h-0">
                            <div v-if="showAddSlotForm && selectedPickupPoint"
                                class="mb-8 p-6 bg-cream-50/50 rounded-xl border border-forest-100">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-medium text-forest-800">
                                        ✨ Nouveau créneau pour {{ selectedPickupPoint.name }}
                                    </h3>
                                    <button @click="showAddSlotForm = false"
                                        class="p-2 hover:bg-white/50 rounded-lg transition-colors">
                                        <span class="text-lg">✖️</span>
                                    </button>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            📅 Jour
                                        </label>
                                        <select v-model="newSlot.dayOfWeek"
                                            class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200">
                                            <option v-for="day in weekDays" :key="day.id" :value="day.id">
                                                {{ day.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            🕐 Heure de début
                                        </label>
                                        <input type="time" v-model="newSlot.startTime"
                                            class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            🕔 Heure de fin
                                        </label>
                                        <input type="time" v-model="newSlot.endTime"
                                            class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-forest-700 mb-2">
                                            👥 Capacité maximale
                                        </label>
                                        <div class="flex items-center space-x-3">
                                            <input type="range" v-model.number="newSlot.maxOrders" min="1" max="50"
                                                class="flex-1 accent-forest-500" />
                                            <span class="text-lg font-bold text-forest-600 min-w-[2rem] text-center">
                                                {{ newSlot.maxOrders }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-6 flex justify-end space-x-3">
                                    <button @click="showAddSlotForm = false"
                                        class="px-4 py-2 text-forest-600 hover:bg-white/50 rounded-lg transition-all duration-300 ease-organic">
                                        Annuler
                                    </button>
                                    <button @click="addNewSlot"
                                        class="px-6 py-2 bg-forest-500 text-white rounded-lg hover:bg-forest-600 hover:shadow-md transition-all duration-300 ease-organic flex items-center space-x-2">
                                        <span>✅</span>
                                        <span>Ajouter ce créneau</span>
                                    </button>
                                </div>
                            </div>
                        </transition>

                        <!-- Liste des créneaux existants -->
                        <div v-if="selectedPickupPoint">
                            <h3 class="text-lg font-medium text-forest-800 mb-4">
                                🗓️ Créneaux configurés
                            </h3>

                            <div v-if="selectedPickupPointSlots.length === 0"
                                class="text-center py-12 text-terracotta-500">
                                <span class="text-4xl block mb-4">📭</span>
                                <p class="text-lg mb-2">Aucun créneau configuré</p>
                                <p class="text-sm">Commencez par ajouter vos premiers créneaux de retrait</p>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="slot in selectedPickupPointSlots" :key="slot.id"
                                    class="group bg-white border border-forest-100 rounded-xl p-4 hover:shadow-md hover:border-forest-200 transition-all duration-300 ease-organic">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-4">
                                            <div class="flex flex-col items-center">
                                                <span class="text-2xl">{{ getDayEmoji(slot.day_of_week) }}</span>
                                                <span class="text-xs font-medium text-forest-700 mt-1">
                                                    {{ getDayName(slot.day_of_week) }}
                                                </span>
                                            </div>

                                            <div class="flex items-center space-x-6">
                                                <div class="text-center">
                                                    <div class="text-sm text-terracotta-600">Début</div>
                                                    <div class="text-lg font-bold text-forest-700">{{ slot.start_time }}
                                                    </div>
                                                </div>

                                                <div class="text-terracotta-400">➡️</div>

                                                <div class="text-center">
                                                    <div class="text-sm text-terracotta-600">Fin</div>
                                                    <div class="text-lg font-bold text-forest-700">{{ slot.end_time }}
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex items-center space-x-2">
                                                <div class="relative"
                                                    v-tooltip="`${slot.bookings?.current_orders || 0}/${slot.capacity?.max_orders || 0} commandes réservées`">
                                                    <div class="w-32 h-2 bg-forest-100 rounded-full overflow-hidden">
                                                        <div class="h-full bg-gradient-to-r from-forest-400 to-forest-500 rounded-full transition-all duration-500 ease-organic"
                                                            :style="{ width: `${((slot.bookings?.current_orders || 0) / (slot.capacity?.max_orders || 1)) * 100}%` }">
                                                        </div>
                                                    </div>
                                                    <div class="absolute -top-1 -right-8 text-xs font-bold"
                                                        :class="(slot.bookings?.current_orders || 0) >= (slot.capacity?.max_orders || 0) ? 'text-terracotta-600' : 'text-forest-600'">
                                                        {{ slot.bookings?.current_orders || 0 }}/{{ slot.capacity?.max_orders || 0 }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button @click="editSlot(slot)"
                                                class="p-2 hover:bg-forest-50 rounded-lg transition-colors">
                                                <span>✏️</span>
                                            </button>
                                            <button @click="deleteSlot(slot.id)"
                                                class="p-2 hover:bg-terracotta-50 rounded-lg transition-colors">
                                                <span>🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Résumé des disponibilités -->
            <section>
                <div
                    class="bg-gradient-to-r from-forest-50 to-cream-50/50 backdrop-blur-sm rounded-2xl p-6 border border-forest-100/30">
                    <h3 class="text-lg font-serif font-semibold text-forest-800 mb-4 flex items-center space-x-2">
                        <span>📊</span>
                        <span>Résumé des disponibilités</span>
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center p-4 bg-white/70 rounded-xl">
                            <div class="text-3xl mb-2">📅</div>
                            <div class="text-2xl font-bold text-forest-700">{{ openDaysCount }}</div>
                            <div class="text-sm text-terracotta-600">Jours ouverts par semaine</div>
                        </div>

                        <div class="text-center p-4 bg-white/70 rounded-xl">
                            <div class="text-3xl mb-2">🕒</div>
                            <div class="text-2xl font-bold text-forest-700">{{ totalSlotsCount }}</div>
                            <div class="text-sm text-terracotta-600">Créneaux configurés</div>
                        </div>

                        <div class="text-center p-4 bg-white/70 rounded-xl">
                            <div class="text-3xl mb-2">👥</div>
                            <div class="text-2xl font-bold text-forest-700">{{ totalCapacity }}</div>
                            <div class="text-sm text-terracotta-600">Capacité totale hebdomadaire</div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

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
                        <p class="font-medium text-forest-700">Configuration sauvegardée !</p>
                        <p class="text-sm text-terracotta-600">Vos horaires ont été mis à jour</p>
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
import { ref, computed, onMounted } from 'vue'
import type { PickupPoint, PickupSlot, ProducerSchedule } from '../types'
import { PickupPointType, PickupPointStatus, DayOfWeek } from '../types'

// État de l'interface
const showWeekSchedule = ref(true)
const showAddSlotForm = ref(false)
const showSuccessToast = ref(false)
const isSaving = ref(false)

// Données des horaires de la semaine
const weekSchedule = ref([
    { id: 1, name: 'Lundi', isOpen: true, openTime: '09:00', closeTime: '18:00', hasLunchBreak: true, lunchStart: '12:30', lunchEnd: '14:00' },
    { id: 2, name: 'Mardi', isOpen: true, openTime: '09:00', closeTime: '18:00', hasLunchBreak: true, lunchStart: '12:30', lunchEnd: '14:00' },
    { id: 3, name: 'Mercredi', isOpen: true, openTime: '09:00', closeTime: '18:00', hasLunchBreak: true, lunchStart: '12:30', lunchEnd: '14:00' },
    { id: 4, name: 'Jeudi', isOpen: true, openTime: '09:00', closeTime: '18:00', hasLunchBreak: true, lunchStart: '12:30', lunchEnd: '14:00' },
    { id: 5, name: 'Vendredi', isOpen: true, openTime: '09:00', closeTime: '18:00', hasLunchBreak: true, lunchStart: '12:30', lunchEnd: '14:00' },
    { id: 6, name: 'Samedi', isOpen: true, openTime: '09:00', closeTime: '17:00', hasLunchBreak: false, lunchStart: '', lunchEnd: '' },
    { id: 7, name: 'Dimanche', isOpen: false, openTime: '', closeTime: '', hasLunchBreak: false, lunchStart: '', lunchEnd: '' }
])

// Données des points de retrait
const pickupPoints = ref<PickupPoint[]>([
    { 
        id: '1', 
        producer_id: 'prod1',
        external_id: undefined,
        name: 'Ferme principale', 
        type: PickupPointType.FARM,
        status: PickupPointStatus.ACTIVE,
        is_active: true,
        description: 'Notre ferme principale',
        address: {
            street: '123 Route des Vergers',
            city: 'Paris',
            postal_code: '75000',
            country: 'France'
        },
        instructions: 'Sonner à la barrière',
        contact: { phone: '0123456789', email: 'contact@ferme.fr' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    { 
        id: '2', 
        producer_id: 'prod1',
        external_id: undefined,
        name: 'Marché central', 
        type: PickupPointType.FARMERS_MARKET,
        status: PickupPointStatus.ACTIVE,
        is_active: true,
        description: 'Stand au marché de la ville',
        address: {
            street: 'Place du Marché',
            city: 'Paris',
            postal_code: '75001',
            country: 'France'
        },
        instructions: 'Samedi de 8h à 13h',
        contact: { phone: '0123456789', email: 'marche@ferme.fr' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
])

// Données des créneaux
const pickupSlots = ref<PickupSlot[]>([
    { 
        id: '1', 
        pickup_point_id: '1',
        producer_id: 'prod1',
        day_of_week: DayOfWeek.MONDAY,
        start_time: '09:00', 
        end_time: '12:00',
        max_orders: 15,
        current_orders: 8,
        available_slots: 7,
        is_active: true,
        is_full: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    { 
        id: '2', 
        pickup_point_id: '1',
        producer_id: 'prod1',
        day_of_week: DayOfWeek.MONDAY,
        start_time: '14:00', 
        end_time: '18:00',
        max_orders: 20,
        current_orders: 12,
        available_slots: 8,
        is_active: true,
        is_full: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
])

// Point de retrait sélectionné
const selectedPickupPoint = ref<PickupPoint | null>(pickupPoints.value[0])

// Nouveau créneau
const newSlot = ref({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '12:00',
    maxOrders: 10
})

// Jours de la semaine pour le select
const weekDays = computed(() => [
    { id: 1, name: 'Lundi' },
    { id: 2, name: 'Mardi' },
    { id: 3, name: 'Mercredi' },
    { id: 4, name: 'Jeudi' },
    { id: 5, name: 'Vendredi' },
    { id: 6, name: 'Samedi' },
    { id: 7, name: 'Dimanche' }
])

// Créneaux du point sélectionné
const selectedPickupPointSlots = computed(() => {
    if (!selectedPickupPoint.value) return []
    return pickupSlots.value.filter(slot => slot.pickup_point_id === selectedPickupPoint.value!.id)
})

// Statistiques
const openDaysCount = computed(() => weekSchedule.value.filter(day => day.isOpen).length)
const totalSlotsCount = computed(() => pickupSlots.value.length)
const totalCapacity = computed(() =>
    pickupSlots.value.reduce((total, slot) => total + (slot.max_orders || 0), 0)
)

// Méthodes
const toggleWeekSchedule = () => {
    showWeekSchedule.value = !showWeekSchedule.value
}

const copyScheduleToAllDays = () => {
    const template = { ...weekSchedule.value[0] }
    weekSchedule.value.forEach(day => {
        if (day.id !== 1) {
            day.openTime = template.openTime
            day.closeTime = template.closeTime
            day.hasLunchBreak = template.hasLunchBreak
            day.lunchStart = template.lunchStart
            day.lunchEnd = template.lunchEnd
        }
    })
}

const resetWeekSchedule = () => {
    weekSchedule.value = weekSchedule.value.map(day => ({
        ...day,
        isOpen: day.id !== 7,
        openTime: '09:00',
        closeTime: '18:00',
        hasLunchBreak: day.id < 6,
        lunchStart: '12:30',
        lunchEnd: '14:00'
    }))
}

const selectPickupPoint = (point: PickupPoint) => {
    selectedPickupPoint.value = point
    showAddSlotForm.value = false
}

const addNewSlot = () => {
    if (!selectedPickupPoint.value) return

    const newId = String(Math.max(...pickupSlots.value.map(s => parseInt(s.id)), 0) + 1)
    const slot: PickupSlot = {
        id: newId,
        pickup_point_id: selectedPickupPoint.value.id,
        producer_id: selectedPickupPoint.value.producer_id,
        day_of_week: newSlot.value.dayOfWeek,
        start_time: newSlot.value.startTime,
        end_time: newSlot.value.endTime,
        max_orders: newSlot.value.maxOrders,
        current_orders: 0,
        available_slots: newSlot.value.maxOrders,
        is_active: true,
        is_full: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    pickupSlots.value.push(slot)
    showAddSlotForm.value = false
    resetNewSlot()
}

const editSlot = (slot: PickupSlot) => {
    // Implémenter l'édition
    console.log('Édition du créneau:', slot)
}

const deleteSlot = (slotId: string) => {
    pickupSlots.value = pickupSlots.value.filter(slot => slot.id !== slotId)
}

const saveAllSchedules = async () => {
    isSaving.value = true
    try {
        // Simuler une sauvegarde API
        await new Promise(resolve => setTimeout(resolve, 1500))
        showSuccessToast.value = true
        setTimeout(() => {
            showSuccessToast.value = false
        }, 3000)
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
    } finally {
        isSaving.value = false
    }
}

const getDayEmoji = (dayId: number) => {
    const emojis = ['📅', '🌱', '🌿', '🍃', '🍀', '🌻', '🎉']
    return emojis[dayId - 1] || '📅'
}

const getDayName = (dayId: number) => {
    return weekDays.value.find(day => day.id === dayId)?.name || ''
}

const resetNewSlot = () => {
    newSlot.value = {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '12:00',
        maxOrders: 10
    }
}

onMounted(() => {
    // Charger les données initiales
    console.log('ScheduleManager monté')
})
</script>

<style scoped>
/* Animation personnalisée pour les entrées */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
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

/* Classes d'animation */
.animate-slide-up {
    animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

/* Courbe de bézier personnalisée pour un effet organique */
.ease-organic {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Pattern de feuilles en filigrane */
.bg-leaf-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%233a7d34' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Palette de couleurs personnalisée */
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

.text-cream-300 {
    color: #f9e1a5;
}

.bg-cream-300 {
    background-color: #f9e1a5;
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
.schedule-manager::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 10% 20%, rgba(163, 221, 163, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(235, 158, 105, 0.05) 0%, transparent 20%);
    animation: float 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: -5;
}

@keyframes float {
    0% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(-10px, 10px) scale(1.02);
    }

    100% {
        transform: translate(10px, -10px) scale(0.98);
    }
}
</style>