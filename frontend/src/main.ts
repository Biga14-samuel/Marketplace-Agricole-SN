import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import { initializeTheme } from '@/composables/useTheme'

// Initialise le thème avant le montage pour limiter le "flash" visuel.
initializeTheme()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ✅ FIX: Suppression de l'initialisation en double
// L'initialisation est gérée dans App.vue pour éviter les conflits

app.mount('#app')
