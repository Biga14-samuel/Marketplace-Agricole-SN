<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/modules/auth';

/**
 * COMPOSANT PRINCIPAL DE L'APPLICATION
 * * Fusion des scripts : Restauration de session et imports globaux.
 */

const authStore = useAuthStore();

onMounted(async () => {
  // ✅ FIX Bug 1: Initialisation simple et sûre, sans risque d'effacement
  // Ne pas appeler resetState() qui efface user.value et cause le gel de page
  await authStore.initializeAuth();
});
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* Le style global est géré dans src/style.css via @theme */
#app {
  min-height: 100vh;
}
</style>