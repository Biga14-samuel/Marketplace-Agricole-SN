<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6">🔍 Page de Debug</h1>
      
      <div class="space-y-6">
        <!-- Test Router -->
        <div class="border-2 border-blue-500 rounded p-4">
          <h2 class="text-xl font-bold mb-4">Test Router</h2>
          <div class="space-y-2">
            <button @click="testRouterPush" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Test router.push('/catalog')
            </button>
            <button @click="testWindowLocation" class="bg-green-500 text-white px-4 py-2 rounded mr-2">
              Test window.location
            </button>
            <router-link to="/catalog" class="inline-block bg-purple-500 text-white px-4 py-2 rounded">
              Test router-link
            </router-link>
          </div>
          <p class="mt-4 text-sm text-gray-600">Résultat: {{ routerTestResult }}</p>
        </div>

        <!-- Test Auth Store -->
        <div class="border-2 border-green-500 rounded p-4">
          <h2 class="text-xl font-bold mb-4">Test Auth Store</h2>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ authStoreState }}</pre>
        </div>

        <!-- Test localStorage -->
        <div class="border-2 border-yellow-500 rounded p-4">
          <h2 class="text-xl font-bold mb-4">Test localStorage</h2>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ localStorageState }}</pre>
        </div>

        <!-- Routes disponibles -->
        <div class="border-2 border-red-500 rounded p-4">
          <h2 class="text-xl font-bold mb-4">Routes disponibles</h2>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{{ availableRoutes }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth'

const router = useRouter()
const authStore = useAuthStore()
const routerTestResult = ref('')

const testRouterPush = async () => {
  try {
    await router.push('/catalog')
    routerTestResult.value = '✅ router.push fonctionne'
  } catch (err: any) {
    routerTestResult.value = `❌ Erreur: ${err.message}`
  }
}

const testWindowLocation = () => {
  window.location.href = '/catalog'
}

const authStoreState = computed(() => ({
  isAuthenticated: authStore.isAuthenticated,
  isInitialized: authStore.isInitialized,
  user: authStore.user,
  userRole: authStore.userRole,
  isLoading: authStore.isLoading,
  error: authStore.error
}))

const localStorageState = computed(() => ({
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
  allKeys: Object.keys(localStorage)
}))

const availableRoutes = computed(() => {
  return router.getRoutes().map(route => ({
    name: route.name,
    path: route.path,
    meta: route.meta
  }))
})

onMounted(() => {
  console.log('🔍 Debug View montée')
  console.log('Router:', router)
  console.log('Auth Store:', authStore)
})
</script>
