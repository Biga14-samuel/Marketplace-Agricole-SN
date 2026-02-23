import { getErrorMessage } from '@/shared/utils/error-handler';
<template>
    <div class="auth-demo p-6 max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">
                🔐 Démo Module Auth - Backend Integration
            </h1>

            <!-- État de connexion -->
            <div class="mb-6 p-4 rounded-lg" :class="isAuthenticated ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-semibold" :class="isAuthenticated ? 'text-green-800' : 'text-gray-800'">
                            {{ isAuthenticated ? '✅ Connecté' : '❌ Non connecté' }}
                        </h2>
                        <p v-if="user" class="text-sm text-gray-600 mt-1">
                            Email: {{ user.email }} | Rôle: {{ userRole }}
                        </p>
                    </div>
                    <button v-if="isAuthenticated" @click="handleLogout" 
                            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Déconnexion
                    </button>
                </div>
            </div>

            <!-- Formulaire de test -->
            <div v-if="!isAuthenticated" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Inscription -->
                <div class="border rounded-lg p-4">
                    <h3 class="text-xl font-semibold mb-4">Inscription</h3>
                    <form @submit.prevent="handleRegister" class="space-y-3">
                        <input v-model="registerForm.email" type="email" placeholder="Email" required
                               class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                        <input v-model="registerForm.password" type="password" placeholder="Mot de passe" required
                               class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                        <input v-model="registerForm.phone" type="tel" placeholder="Téléphone (ex: +237670123456)"
                               class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                        <button type="submit" :disabled="loading"
                                class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
                            {{ loading ? 'Chargement...' : 'S\'inscrire' }}
                        </button>
                    </form>
                </div>

                <!-- Connexion -->
                <div class="border rounded-lg p-4">
                    <h3 class="text-xl font-semibold mb-4">Connexion</h3>
                    <form @submit.prevent="handleLogin" class="space-y-3">
                        <input v-model="loginForm.email" type="email" placeholder="Email" required
                               class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500">
                        <input v-model="loginForm.password" type="password" placeholder="Mot de passe" required
                               class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500">
                        <button type="submit" :disabled="loading"
                                class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
                            {{ loading ? 'Chargement...' : 'Se connecter' }}
                        </button>
                    </form>
                </div>
            </div>

            <!-- Informations utilisateur -->
            <div v-if="isAuthenticated && user" class="mt-6 border rounded-lg p-4">
                <h3 class="text-xl font-semibold mb-4">Informations Utilisateur</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold">ID:</span> {{ user.id }}
                    </div>
                    <div>
                        <span class="font-semibold">Email:</span> {{ user.email }}
                    </div>
                    <div>
                        <span class="font-semibold">Téléphone:</span> {{ user.phone || 'Non renseigné' }}
                    </div>
                    <div>
                        <span class="font-semibold">Actif:</span> {{ user.is_active ? 'Oui' : 'Non' }}
                    </div>
                    <div>
                        <span class="font-semibold">Email vérifié:</span> {{ user.is_verified ? 'Oui' : 'Non' }}
                    </div>
                    <div>
                        <span class="font-semibold">Rôles:</span> {{ user.roles.map(r => r.name).join(', ') }}
                    </div>
                    <div>
                        <span class="font-semibold">Créé le:</span> {{ formatDate(user.created_at) }}
                    </div>
                    <div>
                        <span class="font-semibold">Mis à jour:</span> {{ formatDate(user.updated_at) }}
                    </div>
                </div>
            </div>

            <!-- Messages -->
            <div v-if="message" class="mt-6 p-4 rounded-lg" 
                 :class="messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
                {{ message }}
            </div>

            <!-- Tests API -->
            <div class="mt-6 border rounded-lg p-4">
                <h3 class="text-xl font-semibold mb-4">Tests API</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button @click="testGetProfile" :disabled="!isAuthenticated"
                            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50">
                        GET /auth/me
                    </button>
                    <button @click="testPasswordReset"
                            class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                        Reset Password
                    </button>
                    <button @click="testRefreshToken" :disabled="!isAuthenticated"
                            class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50">
                        Refresh Token
                    </button>
                </div>
            </div>

            <!-- Logs -->
            <div class="mt-6 border rounded-lg p-4 bg-gray-50">
                <h3 class="text-xl font-semibold mb-4">Logs</h3>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    <div v-for="(log, index) in logs" :key="index" class="text-sm font-mono p-2 bg-white rounded">
                        <span class="text-gray-500">{{ log.time }}</span> - 
                        <span :class="log.type === 'error' ? 'text-red-600' : 'text-green-600'">{{ log.message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import type { RegisterData, LoginCredentials } from '../types/auth.types'

const authStore = useAuthStore()

// État
const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const logs = ref<Array<{ time: string; message: string; type: string }>>([])

// Formulaires
const registerForm = ref<RegisterData>({
    email: '',
    password: '',
    phone: ''
})

const loginForm = ref<LoginCredentials>({
    email: '',
    password: ''
})

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const userRole = computed(() => authStore.userRole)

// Méthodes
const addLog = (message: string, type: 'success' | 'error' = 'success') => {
    const time = new Date().toLocaleTimeString()
    logs.value.unshift({ time, message, type })
    if (logs.value.length > 20) logs.value.pop()
}

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => { message.value = '' }, 5000)
}

const handleRegister = async () => {
    loading.value = true
    try {
        const response = await authStore.register(registerForm.value)
        addLog(`Inscription réussie: ${registerForm.value.email}`, 'success')
        showMessage(response.message || 'Inscription réussie !', 'success')
        registerForm.value = { email: '', password: '', phone: '' }
    } catch (error: unknown) {
        const err = error as any
        const errorMsg = (err?.response?.data?.detail) || getErrorMessage(err)
        addLog(`Erreur inscription: ${errorMsg}`, 'error')
        showMessage(errorMsg, 'error')
    } finally {
        loading.value = false
    }
}

const handleLogin = async () => {
    loading.value = true
    try {
        await authStore.login(loginForm.value)
        addLog(`Connexion réussie: ${loginForm.value.email}`, 'success')
        showMessage('Connexion réussie !', 'success')
        loginForm.value = { email: '', password: '' }
    } catch (error: unknown) {
        const err = error as any
        const errorMsg = (err?.response?.data?.detail) || getErrorMessage(err)
        addLog(`Erreur connexion: ${errorMsg}`, 'error')
        showMessage(errorMsg, 'error')
    } finally {
        loading.value = false
    }
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        addLog('Déconnexion réussie', 'success')
        showMessage('Déconnexion réussie !', 'success')
    } catch (error: unknown) {
            const err = error as any
            addLog(`Erreur déconnexion: ${getErrorMessage ? getErrorMessage(err) : (err?.response?.data?.message || err?.message || 'Erreur')}`, 'error')
    }
}

const testGetProfile = async () => {
    try {
        await authStore.fetchUserProfile()
        addLog('GET /auth/me - Succès', 'success')
        showMessage('Profil récupéré avec succès', 'success')
    } catch (error: unknown) {
        addLog(`GET /auth/me - Erreur: ${getErrorMessage(error)}`, 'error')
        showMessage('Erreur lors de la récupération du profil', 'error')
    }
}

const testPasswordReset = async () => {
    const email = prompt('Email pour la réinitialisation:')
    if (!email) return
    
    try {
        await authStore.requestPasswordReset({ email })
        addLog(`POST /auth/password-reset/request - Succès`, 'success')
        showMessage('Email de réinitialisation envoyé', 'success')
    } catch (error: unknown) {
        addLog(`POST /auth/password-reset/request - Erreur`, 'error')
        showMessage('Erreur lors de la demande', 'error')
    }
}

const testRefreshToken = async () => {
    try {
        await authStore.fetchUserProfile()
        addLog('Token rafraîchi avec succès', 'success')
        showMessage('Token rafraîchi', 'success')
    } catch (error: unknown) {
        addLog(`Erreur refresh token: ${getErrorMessage(error)}`, 'error')
        showMessage('Erreur refresh token', 'error')
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR')
}
</script>

<style scoped>
.auth-demo {
    font-family: system-ui, -apple-system, sans-serif;
}
</style>
