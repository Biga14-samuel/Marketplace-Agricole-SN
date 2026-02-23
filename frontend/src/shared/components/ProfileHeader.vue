<template>
    <div class="profile-header">
        <!-- En-tête avec dégradé et texture -->
        <div class="header-background">
            <div class="gradient-layer"></div>
            <div class="texture-layer"></div>
            <div class="organic-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
                <div class="shape shape-4"></div>
            </div>

            <!-- Navigation de profil -->
            <nav class="profile-nav">
                <div class="nav-container">
                    <!-- Logo / Retour -->
                    <router-link to="/" class="back-link" @mouseenter="animateNavIcon">
                        <div class="back-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <span class="back-text">Accueil</span>
                    </router-link>

                    <!-- Navigation utilisateur -->
                    <div class="user-nav">
                        <button class="nav-btn notification-btn" @click="toggleNotifications"
                            @mouseenter="animateButton" aria-label="Notifications">
                            <div class="nav-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span class="notification-badge" v-if="notificationCount > 0">
                                    {{ notificationCount }}
                                </span>
                            </div>
                        </button>

                        <div class="user-dropdown" ref="dropdown">
                            <button class="nav-btn user-menu-btn" @click="toggleDropdown" @mouseenter="animateButton"
                                aria-label="Menu utilisateur">
                                <div class="user-avatar-wrapper">
                                    <img v-if="userData?.avatar" :src="userData.avatar" :alt="userData.firstName"
                                        class="user-avatar">
                                    <div v-else class="user-avatar placeholder">
                                        {{ getInitials(userData?.firstName, userData?.lastName) }}
                                    </div>
                                    <div class="status-indicator" :class="userStatus"></div>
                                </div>
                                <span class="user-name">{{ userData?.firstName }}</span>
                                <div class="dropdown-arrow">
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>

                            <!-- Dropdown menu -->
                            <transition name="dropdown">
                                <div v-if="dropdownOpen" class="dropdown-menu">
                                    <div class="dropdown-header">
                                        <div class="dropdown-avatar">
                                            <img v-if="userData?.avatar" :src="userData.avatar"
                                                :alt="userData.firstName">
                                            <div v-else class="dropdown-avatar placeholder">
                                                {{ getInitials(userData?.firstName, userData?.lastName) }}
                                            </div>
                                        </div>
                                        <div class="dropdown-user-info">
                                            <h4>{{ userData?.firstName }} {{ userData?.lastName }}</h4>
                                            <p class="user-email">{{ userData?.email }}</p>
                                            <div class="user-type-badge" :class="userData?.userType">
                                                {{ userData?.userType === 'customer' ? '👤 Client' : '👨‍🌾 Producteur'
                                                }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="dropdown-divider"></div>

                                    <div class="dropdown-items">
                                        <router-link v-for="item in dropdownItems" :key="item.to" :to="item.to"
                                            class="dropdown-item" @click="closeDropdown">
                                            <div class="item-icon">
                                                <component :is="item.icon" />
                                            </div>
                                            <span>{{ item.label }}</span>
                                            <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
                                        </router-link>
                                    </div>

                                    <div class="dropdown-divider"></div>

                                    <button class="dropdown-item logout-btn" @click="handleLogout">
                                        <div class="item-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </div>
                                        <span>Déconnexion</span>
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </nav>
        </div>

        <!-- Section principale du profil -->
        <div class="profile-main">
            <!-- Carte de profil -->
            <div class="profile-card">
                <!-- Bannière du profil -->
                <div class="profile-banner">
                    <div class="banner-overlay"></div>
                    <div class="banner-content">
                        <!-- Avatar -->
                        <div class="profile-avatar-wrapper" @click="triggerAvatarUpload">
                            <div class="avatar-container">
                                <img v-if="userData?.avatar" :src="userData.avatar" :alt="userData.firstName"
                                    class="profile-avatar">
                                <div v-else class="profile-avatar placeholder">
                                    {{ getInitials(userData?.firstName, userData?.lastName) }}
                                </div>
                                <div class="avatar-upload-overlay">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Modifier</span>
                                </div>
                            </div>
                            <input type="file" ref="avatarInput" accept="image/*" @change="handleAvatarUpload"
                                class="avatar-input" />
                        </div>

                        <!-- Informations principales -->
                        <div class="profile-info">
                            <h1 class="profile-name">
                                {{ userData?.firstName }} {{ userData?.lastName }}
                                <span class="verification-badge" v-if="userData?.verified">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Vérifié
                                </span>
                            </h1>

                            <p class="profile-subtitle">
                                <span class="user-type">{{ getUserTypeLabel() }}</span>
                                <span class="member-since" v-if="userData?.createdAt">
                                    Membre depuis {{ formatDate(userData.createdAt) }}
                                </span>
                            </p>

                            <!-- Statistiques -->
                            <div class="profile-stats">
                                <div v-for="stat in userStats" :key="stat.label" class="stat-item"
                                    @mouseenter="animateStatItem">
                                    <div class="stat-value">{{ stat.value }}</div>
                                    <div class="stat-label">{{ stat.label }}</div>
                                    <div class="stat-trend" v-if="stat.trend">
                                        <span :class="['trend-icon', stat.trend > 0 ? 'up' : 'down']">
                                            {{ stat.trend > 0 ? '↗' : '↘' }}
                                        </span>
                                        <span class="trend-value">{{ Math.abs(stat.trend) }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions rapides -->
                        <div class="profile-actions">
                            <button class="action-btn primary" @click="handleEditProfile" @mouseenter="animateButton">
                                <span class="action-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </span>
                                Modifier le profil
                            </button>

                            <button class="action-btn secondary" @click="handleSettings" @mouseenter="animateButton">
                                <span class="action-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </span>
                                Paramètres
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Navigation du profil -->
                <div class="profile-navigation">
                    <nav class="tabs-container">
                        <div class="tabs-scroll">
                            <button v-for="tab in profileTabs" :key="tab.id"
                                :class="['tab-btn', { 'active': activeTab === tab.id }]" @click="switchTab(tab.id)"
                                @mouseenter="animateTab">
                                <span class="tab-icon">{{ tab.icon }}</span>
                                <span class="tab-label">{{ tab.label }}</span>
                                <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
                                <div class="tab-indicator" v-if="activeTab === tab.id"></div>
                            </button>
                        </div>

                        <!-- Indicateur de progression -->
                        <div class="profile-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: `${profileCompletion}%` }"></div>
                            </div>
                            <span class="progress-text">
                                Profil complété à {{ profileCompletion }}%
                            </span>
                        </div>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Notifications panel -->
        <transition name="slide-notification">
            <div v-if="notificationsOpen" class="notifications-panel">
                <div class="notifications-header">
                    <h3>Notifications</h3>
                    <button class="close-btn" @click="toggleNotifications">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="notifications-list">
                    <!-- Les notifications seraient chargées dynamiquement -->
                    <div class="notification-item" v-for="n in 3" :key="n">
                        <div class="notification-icon">📦</div>
                        <div class="notification-content">
                            <p>Votre commande #{{ 1000 + n }} est prête pour le retrait</p>
                            <span class="notification-time">Il y a {{ n }} heure{{ n > 1 ? 's' : '' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { UserType, BaseUser } from '@/shared/types/UserTypes'

interface Props {
    userData?: BaseUser & {
        verified?: boolean
        stats?: {
            orders?: number
            reviews?: number
            favorites?: number
        }
    }
    activeTab?: string
}

const props = withDefaults(defineProps<Props>(), {
    activeTab: 'overview'
})

const emit = defineEmits<{
    'update:activeTab': [tab: string]
    'edit-profile': []
    'settings': []
    'logout': []
    'avatar-upload': [file: File]
}>()

// États réactifs
const dropdownOpen = ref(false)
const notificationsOpen = ref(false)
const notificationCount = ref(3)
const dropdown = ref<HTMLElement | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)

// Données de démonstration
const userStats = computed(() => [
    { label: 'Commandes', value: props.userData?.stats?.orders || 12, trend: 15 },
    { label: 'Avis', value: props.userData?.stats?.reviews || 8, trend: 5 },
    { label: 'Favoris', value: props.userData?.stats?.favorites || 24, trend: 10 }
])

const profileTabs = computed(() => [
    { id: 'overview', label: 'Aperçu', icon: '📊' },
    { id: 'orders', label: 'Commandes', icon: '📦', badge: props.userData?.userType === 'customer' ? '3' : '12' },
    { id: 'products', label: 'Produits', icon: '🥕', badge: props.userData?.userType === 'producer' ? '24' : undefined },
    { id: 'reviews', label: 'Avis', icon: '⭐' },
    { id: 'favorites', label: 'Favoris', icon: '❤️', badge: props.userData?.userType === 'customer' ? '24' : undefined },
    { id: 'addresses', label: 'Adresses', icon: '📍' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
])

const dropdownItems = computed(() => [
    { to: '/profile', label: 'Mon profil', icon: 'user' },
    { to: '/messages', label: 'Messages', icon: 'message', badge: '2' },
    { to: '/favorites', label: 'Favoris', icon: 'heart' },
    { to: '/orders', label: 'Commandes', icon: 'package' },
    { to: '/settings', label: 'Paramètres', icon: 'settings' }
])

const profileCompletion = computed(() => {
    // Logique de calcul du pourcentage de complétion du profil
    return 75
})

const userStatus = computed(() => {
    // Déterminer le statut en ligne/hors ligne
    return 'online'
})

// Méthodes
const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}

const toggleNotifications = () => {
    notificationsOpen.value = !notificationsOpen.value
}

const closeDropdown = () => {
    dropdownOpen.value = false
}

const handleEditProfile = () => {
    emit('edit-profile')
}

const handleSettings = () => {
    emit('settings')
}

const handleLogout = () => {
    emit('logout')
    closeDropdown()
}

const triggerAvatarUpload = () => {
    avatarInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files?.[0]) {
        emit('avatar-upload', input.files[0])
    }
}

const switchTab = (tabId: string) => {
    emit('update:activeTab', tabId)
}

const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return '??'
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
    })
}

const getUserTypeLabel = () => {
    return props.userData?.userType === 'customer' ? 'Client' : 'Producteur'
}

// Animations
const animateButton = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement
    button.classList.add('hover-animate')
    setTimeout(() => {
        button.classList.remove('hover-animate')
    }, 300)
}

const animateTab = (event: MouseEvent) => {
    const tab = event.currentTarget as HTMLElement
    tab.classList.add('tab-hover')
    setTimeout(() => {
        tab.classList.remove('tab-hover')
    }, 300)
}

const animateStatItem = (event: MouseEvent) => {
    const stat = event.currentTarget as HTMLElement
    stat.classList.add('stat-hover')
    setTimeout(() => {
        stat.classList.remove('stat-hover')
    }, 300)
}

const animateNavIcon = (event: MouseEvent) => {
    const icon = (event.currentTarget as HTMLElement).querySelector('.back-icon')
    icon?.classList.add('nav-icon-animate')
    setTimeout(() => {
        icon?.classList.remove('nav-icon-animate')
    }, 300)
}

// Fermer le dropdown en cliquant à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        dropdownOpen.value = false
    }
}

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Watch pour fermer les notifications si on ouvre le dropdown
watch(dropdownOpen, (newVal) => {
    if (newVal) {
        notificationsOpen.value = false
    }
})
</script>

<style scoped>
.profile-header {
    position: relative;
    width: 100%;
}

/* Arrière-plan avec dégradé et texture */
.header-background {
    position: relative;
    min-height: 200px;
    overflow: hidden;
}

.gradient-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(135deg,
            #f0f7ee 0%,
            #e8f4e5 25%,
            #dcedd4 50%,
            #c5e1a5 75%,
            #aed581 100%);
    animation: gradientFlow 20s ease-in-out infinite alternate;
}

.texture-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background-image:
        radial-gradient(circle at 10% 20%, rgba(174, 213, 129, 0.1) 0px, transparent 50%),
        radial-gradient(circle at 90% 40%, rgba(197, 225, 165, 0.1) 0px, transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(220, 237, 212, 0.1) 0px, transparent 50%);
    opacity: 0.6;
}

/* Formes organiques */
.organic-shapes {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    overflow: hidden;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(20px);
}

.shape-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -50px;
    background: rgba(174, 213, 129, 0.2);
    animation: floatShape 25s ease-in-out infinite;
}

.shape-2 {
    width: 150px;
    height: 150px;
    bottom: -50px;
    left: 10%;
    background: rgba(197, 225, 165, 0.15);
    animation: floatShape 30s ease-in-out infinite reverse;
}

.shape-3 {
    width: 120px;
    height: 120px;
    top: 50px;
    left: 20%;
    background: rgba(220, 237, 212, 0.1);
    animation: floatShape 35s ease-in-out infinite;
}

.shape-4 {
    width: 180px;
    height: 180px;
    bottom: -80px;
    right: 20%;
    background: rgba(240, 247, 238, 0.1);
    animation: floatShape 40s ease-in-out infinite reverse;
}

/* Navigation principale */
.profile-nav {
    position: relative;
    z-index: 10;
    padding: 1rem 2rem;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
}

/* Lien de retour */
.back-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #2e7d32;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.back-link:hover {
    transform: translateX(-5px);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.back-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.back-icon svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
}

.back-link:hover .back-icon {
    transform: translateX(-3px) scale(1.1);
}

.back-text {
    font-weight: 600;
    font-size: 0.95rem;
}

/* Navigation utilisateur */
.user-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-btn {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.nav-btn:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.notification-btn {
    padding: 0.75rem;
    position: relative;
}

.nav-icon {
    position: relative;
    width: 24px;
    height: 24px;
}

.nav-icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.5;
    color: #2e7d32;
}

.notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff6b6b;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    animation: pulseBadge 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Bouton utilisateur */
.user-menu-btn {
    padding: 0.5rem 1rem 0.5rem 0.5rem;
}

.user-avatar-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
}

.user-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.user-avatar.placeholder {
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
}

.status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid white;
}

.status-indicator.online {
    background: #4caf50;
    animation: pulseStatus 2s ease-in-out infinite;
}

.user-name {
    font-weight: 600;
    color: #2e7d32;
}

.dropdown-arrow {
    width: 20px;
    height: 20px;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.user-dropdown.open .dropdown-arrow {
    transform: rotate(180deg);
}

/* Dropdown menu */
.user-dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 320px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    overflow: hidden;
    z-index: 1000;
    animation: dropdownSlide 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
}

.dropdown-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.dropdown-avatar.placeholder {
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.2rem;
}

.dropdown-user-info h4 {
    margin: 0 0 0.25rem;
    color: #2e7d32;
    font-size: 1.1rem;
}

.user-email {
    margin: 0 0 0.5rem;
    color: #666;
    font-size: 0.85rem;
}

.user-type-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    background: rgba(76, 175, 80, 0.15);
    color: #2e7d32;
}

.user-type-badge.customer {
    background: rgba(76, 175, 80, 0.15);
    color: #2e7d32;
}

.user-type-badge.producer {
    background: rgba(255, 152, 0, 0.15);
    color: #ef6c00;
}

.dropdown-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
    margin: 0.5rem 0;
}

.dropdown-items {
    padding: 0.5rem;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    text-decoration: none;
    color: #333;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
}

.dropdown-item:hover {
    background: rgba(76, 175, 80, 0.1);
    transform: translateX(5px);
}

.dropdown-item.router-link-active {
    background: rgba(76, 175, 80, 0.15);
    color: #2e7d32;
    font-weight: 500;
}

.item-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4caf50;
}

.item-icon svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.5;
}

.item-badge {
    margin-left: auto;
    background: #ff6b6b;
    color: white;
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    border-radius: 10px;
}

.logout-btn {
    color: #ff6b6b;
}

.logout-btn .item-icon {
    color: #ff6b6b;
}

/* Section principale du profil */
.profile-main {
    position: relative;
    z-index: 5;
    max-width: 1400px;
    margin: -60px auto 0;
    padding: 0 2rem;
}

.profile-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow:
        0 25px 70px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
}

/* Bannière du profil */
.profile-banner {
    position: relative;
    padding: 2.5rem;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
    overflow: hidden;
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(circle at 20% 80%, rgba(174, 213, 129, 0.2) 0px, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(197, 225, 165, 0.2) 0px, transparent 50%);
}

.banner-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 2rem;
    align-items: center;
}

/* Avatar */
.profile-avatar-wrapper {
    position: relative;
    cursor: pointer;
    width: 140px;
    height: 140px;
}

.avatar-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid white;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.profile-avatar-wrapper:hover .avatar-container {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.profile-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-avatar.placeholder {
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: 600;
}

.avatar-upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.profile-avatar-wrapper:hover .avatar-upload-overlay {
    opacity: 1;
}

.avatar-upload-overlay svg {
    width: 32px;
    height: 32px;
    margin-bottom: 0.5rem;
    stroke-width: 1.5;
}

.avatar-input {
    display: none;
}

/* Informations du profil */
.profile-info {
    padding: 0 1rem;
}

.profile-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2e7d32;
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.verification-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(76, 175, 80, 0.15);
    color: #2e7d32;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
}

.verification-badge svg {
    width: 16px;
    height: 16px;
}

.profile-subtitle {
    color: #666;
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.user-type {
    background: rgba(76, 175, 80, 0.1);
    color: #2e7d32;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-weight: 500;
}

.member-since {
    color: #888;
    font-size: 0.9rem;
}

/* Statistiques */
.profile-stats {
    display: flex;
    gap: 2rem;
}

.stat-item {
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    overflow: hidden;
    min-width: 120px;
    border: 1px solid rgba(76, 175, 80, 0.1);
}

.stat-item:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 10px 30px rgba(76, 175, 80, 0.15);
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #2e7d32;
    margin-bottom: 0.25rem;
}

.stat-label {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.stat-trend {
    font-size: 0.8rem;
    font-weight: 600;
}

.trend-icon {
    margin-right: 0.25rem;
}

.trend-icon.up {
    color: #4caf50;
}

.trend-icon.down {
    color: #f44336;
}

/* Actions du profil */
.profile-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 200px;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border: none;
    position: relative;
    overflow: hidden;
}

.action-btn.primary {
    background: linear-gradient(135deg, #4caf50, #2e7d32);
    color: white;
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.action-btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
}

.action-btn.primary:active {
    transform: translateY(-1px);
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #2e7d32;
    border: 2px solid rgba(76, 175, 80, 0.3);
}

.action-btn.secondary:hover {
    background: rgba(76, 175, 80, 0.1);
    transform: translateY(-3px);
    border-color: rgba(76, 175, 80, 0.5);
}

.action-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-icon svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
}

.action-btn.primary .action-icon svg {
    stroke: white;
}

.action-btn.secondary .action-icon svg {
    stroke: #4caf50;
}

/* Navigation par onglets */
.profile-navigation {
    padding: 0 2rem;
    background: rgba(255, 255, 255, 0.5);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.tabs-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.tabs-scroll {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
    scrollbar-width: none;
}

.tabs-scroll::-webkit-scrollbar {
    display: none;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    background: transparent;
    border: none;
    border-radius: 50px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    white-space: nowrap;
}

.tab-btn:hover {
    background: rgba(76, 175, 80, 0.1);
    color: #2e7d32;
    transform: translateY(-2px);
}

.tab-btn.active {
    background: rgba(76, 175, 80, 0.15);
    color: #2e7d32;
    font-weight: 600;
}

.tab-icon {
    font-size: 1.1rem;
}

.tab-badge {
    background: #ff6b6b;
    color: white;
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    border-radius: 10px;
    font-weight: 600;
}

.tab-indicator {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    border-radius: 2px;
    animation: indicatorSlide 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Progression du profil */
.profile-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
}

.progress-bar {
    width: 200px;
    height: 6px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    border-radius: 3px;
    transition: width 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    overflow: hidden;
}

.progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
}

.progress-text {
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
}

/* Panneau de notifications */
.notifications-panel {
    position: fixed;
    top: 80px;
    right: 2rem;
    width: 360px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    z-index: 999;
    overflow: hidden;
}

.slide-notification-enter-active,
.slide-notification-leave-active {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-notification-enter-from,
.slide-notification-leave-to {
    opacity: 0;
    transform: translateX(100%) translateY(-20px);
}

.notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.notifications-header h3 {
    margin: 0;
    color: #2e7d32;
    font-size: 1.25rem;
}

.close-btn {
    background: none;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #666;
}

.close-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #2e7d32;
}

.close-btn svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
}

.notifications-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 0.5rem;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.notification-item:hover {
    background: rgba(76, 175, 80, 0.1);
}

.notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.notification-content {
    flex: 1;
}

.notification-content p {
    margin: 0 0 0.25rem;
    color: #333;
    font-weight: 500;
}

.notification-time {
    font-size: 0.8rem;
    color: #888;
}

/* Animations */
@keyframes gradientFlow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes floatShape {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    33% {
        transform: translateY(-20px) rotate(120deg);
    }

    66% {
        transform: translateY(10px) rotate(240deg);
    }
}

@keyframes pulseBadge {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

@keyframes pulseStatus {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    }

    50% {
        box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
    }
}

@keyframes dropdownSlide {
    from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes indicatorSlide {
    from {
        width: 0;
        opacity: 0;
    }

    to {
        width: 30px;
        opacity: 1;
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(200%);
    }
}

@keyframes navIconAnimate {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-3px);
    }

    50% {
        transform: translateX(0);
    }

    75% {
        transform: translateX(3px);
    }

    100% {
        transform: translateX(0);
    }
}

/* Classes d'animation pour les interactions */
.hover-animate {
    animation: buttonPulse 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tab-hover {
    animation: tabBounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.stat-hover {
    animation: statPulse 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.nav-icon-animate {
    animation: navIconAnimate 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes buttonPulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes tabBounce {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }

    100% {
        transform: translateY(0);
    }
}

@keyframes statPulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

/* Responsive */
@media (max-width: 1200px) {
    .banner-content {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .profile-stats {
        justify-content: center;
    }

    .profile-actions {
        flex-direction: row;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .profile-nav {
        padding: 1rem;
    }

    .profile-main {
        padding: 0 1rem;
        margin-top: -40px;
    }

    .profile-banner {
        padding: 1.5rem;
    }

    .profile-name {
        font-size: 2rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .profile-subtitle {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .profile-stats {
        flex-direction: column;
        align-items: center;
    }

    .tabs-container {
        flex-direction: column;
        gap: 1rem;
    }

    .progress-bar {
        width: 150px;
    }

    .notifications-panel {
        right: 1rem;
        left: 1rem;
        width: auto;
    }
}

@media (max-width: 480px) {
    .user-nav {
        gap: 0.5rem;
    }

    .nav-btn {
        padding: 0.5rem;
    }

    .user-menu-btn {
        padding: 0.5rem;
    }

    .user-name {
        display: none;
    }

    .profile-avatar-wrapper {
        width: 100px;
        height: 100px;
    }

    .profile-name {
        font-size: 1.75rem;
    }

    .dropdown-menu {
        width: 280px;
        right: -20px;
    }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
    .gradient-layer {
        background: linear-gradient(135deg,
                #1a1a1a 0%,
                #2d2d2d 25%,
                #3a3a3a 50%,
                #2d4a2d 75%,
                #1b5e20 100%);
    }

    .profile-card {
        background: rgba(45, 45, 45, 0.95);
        color: #e0e0e0;
    }

    .back-link,
    .nav-btn {
        background: rgba(45, 45, 45, 0.9);
        color: #a5d6a7;
    }

    .dropdown-menu {
        background: rgba(45, 45, 45, 0.98);
        color: #e0e0e0;
    }

    .profile-name {
        color: #a5d6a7;
    }

    .notifications-panel {
        background: rgba(45, 45, 45, 0.98);
        color: #e0e0e0;
    }
}
</style>