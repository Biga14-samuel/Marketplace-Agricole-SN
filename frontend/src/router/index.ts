import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth'
import authRoutes from './routes/auth.routes'
import catalogRoutes from './routes/catalog.routes'
import userProfilesRoutes from './routes/user-profiles.routes'
import ordersRoutes from '@/modules/orders/router/orders.routes'
import paymentRoutes from '@/modules/payments/router/paymentRoutes'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Route d'accueil
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/HomeView.vue')
        },
        
        // Route de debug
        {
            path: '/debug',
            name: 'Debug',
            component: () => import('../views/DebugView.vue')
        },
        
        // Routes importées
        ...authRoutes,
        ...catalogRoutes,
        ...userProfilesRoutes,
        ...ordersRoutes,
        ...paymentRoutes,
        
        // Route 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('../views/NotFoundView.vue')
        }
    ]
})

// Guard global
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // ✅ FIX: Attendre l'initialisation avant de vérifier l'authentification
    // Évite que le guard s'exécute avant que initializeAuth() soit terminé
    if (!authStore.isInitialized) {
        await authStore.initializeAuth()
    }
    
    // Définir le titre de la page
    if (to.meta.title) {
        document.title = `${to.meta.title} - Marketplace Agricole`
    }
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
    }
    
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next({ name: 'Home' })
        return
    }
    
    next()
})

export default router
