// @ts-nocheck
// modules/orders/router/orders.routes.ts
import type { RouteRecordRaw } from 'vue-router'
import { Role } from '@/modules/auth/types/auth.types'

const OrdersRoutes: RouteRecordRaw[] = [
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../components/CartView.vue'),
    meta: {
      title: 'Mon Panier',
      requiresAuth: true,
      breadcrumb: 'Panier',
      icon: 'mdi-cart',
      roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER, Role.CUSTOMER]
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../components/CheckoutView.vue'),
    meta: {
      title: 'Finaliser la commande',
      requiresAuth: true,
      breadcrumb: 'Checkout',
      roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER, Role.CUSTOMER]
    }
  },
  {
    path: '/orders',
    name: 'orders',
    redirect: '/orders/my-orders',
    meta: {
      requiresAuth: true,
      breadcrumb: 'Commandes',
      icon: 'mdi-package-variant-closed',
      roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER, Role.CUSTOMER]
    },
    children: [
      {
        path: 'my-orders',
        name: 'my-orders',
        component: () => import('../components/OrderList.vue'),
        meta: {
          title: 'Mes Commandes',
          breadcrumb: 'Mes Commandes',
          roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER, Role.CUSTOMER]
        }
      },
      {
        path: 'producer-orders',
        name: 'producer-orders',
        component: () => import('../components/ProducerOrders.vue'),
        meta: {
          title: 'Commandes Reçues',
          breadcrumb: 'Commandes Reçues',
          roles: [Role.ADMIN, Role.MANAGER]
        }
      },
      {
        path: ':id',
        name: 'order-detail',
        component: () => import('../components/OrderDetail.vue'),
        meta: {
          title: 'Détails de la Commande',
          breadcrumb: 'Détails',
          roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER, Role.CUSTOMER]
        },
        props: true
      },
      {
        path: ':id/tracking',
        name: 'order-tracking',
        component: () => import('../components/TrackingView.vue'),
        meta: {
          title: 'Suivi de Livraison',
          breadcrumb: 'Suivi',
          roles: [Role.ADMIN, Role.MANAGER, Role.VIEWER, Role.CUSTOMER]
        },
        props: true
      },
      {
        path: ':id/history',
        name: 'order-history',
        component: () => import('../components/OrderHistory.vue'),
        meta: {
          title: 'Historique de la Commande',
          breadcrumb: 'Historique',
          roles: [Role.ADMIN, Role.MANAGER]
        },
        props: true
      }
    ]
  }
]

export default OrdersRoutes