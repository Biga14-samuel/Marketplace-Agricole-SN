<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6">
    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')"></div>
    <div class="relative w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/50 shadow-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-emerald-800">Donner votre avis</h3>
        <button class="p-2 rounded-lg hover:bg-amber-50" @click="emit('close')">✕</button>
      </div>

      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-emerald-800 mb-1">Note</label>
            <input v-model.number="form.rating" type="range" min="1" max="5" step="1" class="w-full" />
            <div class="text-xs text-amber-700/70">Note: {{ form.rating }}/5</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-800 mb-1">Titre</label>
            <input v-model="form.title" type="text" class="w-full px-4 py-2.5 rounded-lg border border-emerald-200/50 bg-white/80" />
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-800 mb-1">Commentaire</label>
            <textarea v-model="form.content" rows="4" class="w-full px-4 py-2.5 rounded-lg border border-emerald-200/50 bg-white/80"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-6">
          <button type="button" class="px-4 py-2.5 rounded-lg border border-emerald-200 text-emerald-700" @click="emit('close')">
            Annuler
          </button>
          <button type="submit" class="px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600">
            Envoyer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{ product: any }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'submit', data: any): void }>()

const form = reactive({
  rating: 5,
  title: '',
  content: ''
})

const submit = () => {
  emit('submit', { ...form, productId: props.product?.id })
  emit('close')
}
</script>

