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
          title: 'Parametres',
          requiresAuth: true
        }
      }
    ]
  },

  // Routes producteurs (chemin principal)
  {
    path: '/producer',
    name: 'ProducerRoot',
    redirect: '/producer/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'ProducerDashboard',
        component: () => import('@/modules/user-profiles/producer/views/ProducerDashboardView.vue'),
        meta: {
          title: 'Tableau de bord producteur',
          requiresAuth: true
        }
      },
      {
        path: 'profile',
        name: 'ProducerProfileView',
        component: () => import('@/modules/user-profiles/producer/views/ProducerProfileView.vue'),
        meta: {
          title: 'Profil producteur',
          requiresAuth: true
        }
      },
      {
        path: 'verification',
        name: 'ProducerVerification',
        component: () => import('@/modules/user-profiles/producer/views/VerificationView.vue'),
        meta: {
          title: 'Verification producteur',
          requiresAuth: true
        }
      },
      {
        path: 'settings',
        name: 'ProducerSettings',
        component: () => import('@/modules/user-profiles/customer/views/ProfileSettingsView.vue'),
        meta: {
          title: 'Paramètres producteur',
          requiresAuth: true
        }
      },
      {
        path: 'pickup-points',
        name: 'ProducerPickupPoints',
        component: () => import('@/modules/user-profiles/producer/views/PickupPointsView.vue'),
        meta: {
          title: 'Points de retrait',
          requiresAuth: true
        }
      },
      {
        path: 'pickup-points/:id',
        name: 'ProducerPickupPointDetail',
        component: () => import('@/modules/user-profiles/producer/views/PickupPointsView.vue'),
        props: true,
        meta: {
          title: 'Point de retrait',
          requiresAuth: true
        }
      },
      {
        path: 'schedule',
        name: 'ProducerSchedule',
        component: () => import('@/modules/user-profiles/producer/views/ScheduleView.vue'),
        meta: {
          title: 'Horaires producteur',
          requiresAuth: true
        }
      },
      {
        path: 'products',
        name: 'ProducerProducts',
        component: () => import('@/modules/catalog/views/MyProductsView.vue'),
        meta: {
          title: 'Mes produits',
          requiresAuth: true
        }
      },
      {
        path: 'products/new',
        name: 'ProducerProductCreate',
        component: () => import('@/modules/catalog/views/MyProductsView.vue'),
        meta: {
          title: 'Nouveau produit',
          requiresAuth: true
        }
      },
      {
        path: 'inventory',
        name: 'ProducerInventory',
        component: () => import('@/modules/catalog/views/InventoryView.vue'),
        meta: {
          title: 'Inventaire',
          requiresAuth: true
        }
      },
      {
        path: 'stock-alerts',
        name: 'ProducerStockAlerts',
        component: () => import('@/modules/catalog/views/StockAlertsView.vue'),
        meta: {
          title: 'Alertes de stock',
          requiresAuth: true
        }
      },
      {
        path: 'orders',
        name: 'ProducerOrdersRoute',
        component: () => import('@/modules/orders/components/ProducerOrders.vue'),
        meta: {
          title: 'Commandes producteur',
          requiresAuth: true
        }
      },
      {
        path: 'orders/:id',
        name: 'ProducerOrderDetail',
        component: () => import('@/modules/orders/components/OrderDetail.vue'),
        props: true,
        meta: {
          title: 'Detail commande',
          requiresAuth: true
        }
      },
      {
        path: 'payouts',
        name: 'ProducerPayoutsRoute',
        component: () => import('@/modules/payments/views/ProducerPayoutsView.vue'),
        meta: {
          title: 'Virements producteur',
          requiresAuth: true
        }
      },
      {
        path: 'invoices',
        name: 'ProducerInvoices',
        component: () => import('@/modules/payments/views/InvoiceView.vue'),
        meta: {
          title: 'Factures producteur',
          requiresAuth: true
        }
      },
      {
        path: 'payments',
        redirect: '/payments'
      }
    ]
  },

  // Compatibilite avec les anciens chemins
  { path: '/profile/producer', redirect: '/producer/profile' },
  { path: '/profile/producer/dashboard', redirect: '/producer/dashboard' },
  { path: '/profile/producer/verification', redirect: '/producer/verification' },
  { path: '/profile/producer/settings', redirect: '/producer/settings' },
  { path: '/profile/producer/pickup-points', redirect: '/producer/pickup-points' },
  { path: '/profile/producer/schedule', redirect: '/producer/schedule' },
  { path: '/profile/producer/products', redirect: '/producer/products' },
  { path: '/profile/producer/products/new', redirect: '/producer/products/new' },
  { path: '/profile/producer/orders', redirect: '/producer/orders' },
  { path: '/profile/producer/payouts', redirect: '/producer/payouts' }
]

export default userProfilesRoutes
