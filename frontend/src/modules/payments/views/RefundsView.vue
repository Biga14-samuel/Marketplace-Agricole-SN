<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30 py-8">
    <div class="container mx-auto px-4">
      <header class="mb-6">
        <h1 class="text-3xl font-bold text-nature-900">Remboursements</h1>
        <p class="text-nature-600">Suivez vos demandes de remboursement reelles et soumettez une nouvelle demande.</p>
      </header>
      <RefundRequestForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import RefundRequestForm from '../components/RefundRequestForm.vue'
</script>

