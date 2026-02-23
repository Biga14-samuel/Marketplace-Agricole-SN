<template>
  <div class="not-found-view min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
      </div>
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Page non trouvée</h2>
      <p class="text-gray-600 mb-8 max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div class="space-x-4">
        <router-link 
          to="/" 
          class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Retour à l'accueil
        </router-link>
        <button 
          @click="$router.go(-1)"
          class="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Page précédente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page 404
</script>