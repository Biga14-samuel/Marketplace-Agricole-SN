<template>
  <div class="stock-adjustment-form">
    <h3 class="text-lg font-semibold mb-4">Ajustement de stock</h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Produit</label>
        <select v-model="form.productId" class="w-full border rounded px-3 py-2" required>
          <option value="">Sélectionner un produit</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Type d'ajustement</label>
        <select v-model="form.type" class="w-full border rounded px-3 py-2" required>
          <option value="add">Ajouter</option>
          <option value="remove">Retirer</option>
          <option value="set">Définir</option>
        </select>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Quantité</label>
        <input 
          v-model.number="form.quantity" 
          type="number" 
          min="0" 
          class="w-full border rounded px-3 py-2" 
          required 
        />
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Raison</label>
        <textarea 
          v-model="form.reason" 
          class="w-full border rounded px-3 py-2" 
          rows="3"
        ></textarea>
      </div>
      
      <div class="flex justify-end gap-2">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-primary-green text-white rounded hover:bg-primary-green/90"
        >
          Valider
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Product {
  id: string | number
  name: string
}

interface Props {
  products?: Product[]
}

const props = withDefaults(defineProps<Props>(), {
  products: () => []
})

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const form = reactive({
  productId: '',
  type: 'add',
  quantity: 0,
  reason: ''
})

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
