<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h1 class="text-2xl font-bold mb-6 text-center">Test de vérification d'email</h1>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Token de vérification:</label>
          <input 
            v-model="testToken" 
            type="text" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Collez le token ici"
          />
        </div>
        
        <button 
          @click="testVerification"
          :disabled="!testToken || loading"
          class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Vérification...' : 'Tester la vérification' }}
        </button>
        
        <div v-if="result" class="mt-4 p-4 rounded-lg" :class="result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <p class="font-semibold">{{ result.success ? '✅ Succès' : '❌ Erreur' }}</p>
          <p class="text-sm mt-2">{{ result.message }}</p>
          <pre v-if="result.details" class="text-xs mt-2 overflow-auto">{{ JSON.stringify(result.details, null, 2) }}</pre>
        </div>
        
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800 font-semibold mb-2">Instructions:</p>
          <ol class="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Inscrivez-vous sur la page d'inscription</li>
            <li>Copiez le token depuis les logs backend ou l'email</li>
            <li>Collez-le dans le champ ci-dessus</li>
            <li>Cliquez sur "Tester la vérification"</li>
          </ol>
        </div>
        
        <div class="mt-4">
          <router-link to="/auth/verify-email" class="text-sm text-blue-600 hover:underline">
            Aller à la page de vérification normale
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const authStore = useAuthStore()
const testToken = ref('')
const loading = ref(false)
const result = ref<{ success: boolean; message: string; details?: any } | null>(null)

const testVerification = async () => {
  if (!testToken.value) return
  
  loading.value = true
  result.value = null
  
  console.log('=== TEST DE VÉRIFICATION ===')
  console.log('Token:', testToken.value)
  
  try {
    const response = await authStore.verifyEmail(testToken.value)
    console.log('✅ Réponse:', response)
    
    result.value = {
      success: true,
      message: 'Email vérifié avec succès!',
      details: response
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error)
    
    result.value = {
      success: false,
      message: error?.response?.data?.detail || error?.message || 'Erreur inconnue',
      details: {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      }
    }
  } finally {
    loading.value = false
  }
}
</script>
