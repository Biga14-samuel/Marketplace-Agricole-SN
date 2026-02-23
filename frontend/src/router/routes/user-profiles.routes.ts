/**
 * Routes des profils utilisateurs
 */
import type { RouteRecordRaw } from 'vue-router'

const userProfilesRoutes: RouteRecordRaw[] = [
  // Routes des profils clients
  {
    path: '/profile/customer',
    name: 'CustomerProfile',
    children: [
      {
        path: '',
        name: 'CustomerProfileView',
        component: () => import('@/modules/user-profiles/customer/views/CustomerProfileView.vue'),
        meta: {
          title: 'Mon profil',
          requiresAuth: true
        }
      },
      {
        path: 'addresses',
        name: 'AddressManagement',
        component: () => import('@/modules/user-profiles/customer/views/AddressManagementView.vue'),
        meta: {
          title: 'Mes adresses',
          requiresAuth: true
        }
      },
      {
        path: 'settings',
        name: 'ProfileSettings',
        component: () => import('@/modules/user-profiles/customer/views/ProfileSettingsView.vue'),
        meta: {
          title: 'Paramètres',
          requiresAuth: true
        }
      }
    ]
  },
  
  // Routes des profils producteurs
  {
    path: '/profile/producer',
    name: 'ProducerProfile',
    children: [
      {
        path: '',
        name: 'ProducerProfileView',
        component: () => import('@/modules/user-profiles/producer/views/ProducerProfileView.vue'),
        meta: {
          title: 'Mon profil producteur',
          requiresAuth: true
        }
      },
      {
        path: 'dashboard',
        name: 'ProducerDashboard',
        component: () => import('@/modules/user-profiles/producer/views/ProducerDashboardView.vue'),
        meta: {
          title: 'Tableau de bord',
          requiresAuth: true
        }
      },
      {
        path: 'verification',
        name: 'ProducerVerification',
        component: () => import('@/modules/user-profiles/producer/views/VerificationView.vue'),
        meta: {
          title: 'Vérification',
          requiresAuth: true
        }
      },
      {
        path: 'pickup-points',
        name: 'PickupPoints',
        component: () => import('@/modules/user-profiles/producer/views/PickupPointsView.vue'),
        meta: {
          title: 'Points de retrait',
          requiresAuth: true
        }
      }
    ]
  }
]

export default userProfilesRoutes