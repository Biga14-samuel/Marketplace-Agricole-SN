<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30 py-8">
    <div class="container mx-auto px-4 space-y-6">
      <header>
        <h1 class="text-3xl font-bold text-nature-900">Mes versements</h1>
        <p class="text-nature-600">Consultez vos paiements producteur avec vos donnees reelles.</p>
      </header>

      <PayoutCalculator />
      <PayoutList />
    </div>
  </div>
</template>

<script setup lang="ts">
import PayoutCalculator from '../components/PayoutCalculator.vue'
import PayoutList from '../components/PayoutList.vue'
</script>

