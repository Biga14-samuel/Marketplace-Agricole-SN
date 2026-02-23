import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores'

export function useAuthGuard() {
    const router = useRouter()
    const authStore = useAuthStore()

    return {
        requireAuth: () => {
            if (!authStore.isAuthenticated) {
                router.push('/login')
            }
        },
        requireGuest: () => {
            if (authStore.isAuthenticated) {
                router.push('/')
            }
        }
    }
}