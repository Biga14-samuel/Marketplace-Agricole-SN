// @ts-nocheck
// modules/orders/router/orders.routes.ts
import type { RouteRecordRaw } from 'vue-router'
import { RoleName } from '@/modules/auth/types/auth.types'

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
      roles: [RoleName.ADMIN, RoleName.CUSTOMER, RoleName.PRODUCER]
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
      roles: [RoleName.ADMIN, RoleName.CUSTOMER, RoleName.PRODUCER]
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
      roles: [RoleName.ADMIN, RoleName.CUSTOMER, RoleName.PRODUCER]
    },
    children: [
      {
        path: 'my-orders',
        name: 'my-orders',
        component: () => import('../components/OrderList.vue'),
        meta: {
          title: 'Mes Commandes',
          breadcrumb: 'Mes Commandes',
          roles: [RoleName.ADMIN, RoleName.CUSTOMER, RoleName.PRODUCER]
        }
      },
      {
        path: 'producer-orders',
        name: 'producer-orders',
        component: () => import('../components/ProducerOrders.vue'),
        meta: {
          title: 'Commandes Reçues',
          breadcrumb: 'Commandes Reçues',
          roles: [RoleName.ADMIN, RoleName.PRODUCER]
        }
      },
      {
        path: ':id',
        name: 'order-detail',
        component: () => import('../components/OrderDetail.vue'),
        meta: {
          title: 'Détails de la Commande',
          breadcrumb: 'Détails',
          roles: [RoleName.ADMIN, RoleName.CUSTOMER, RoleName.PRODUCER]
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
          roles: [RoleName.ADMIN, RoleName.CUSTOMER, RoleName.PRODUCER]
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
          roles: [RoleName.ADMIN, RoleName.PRODUCER]
        },
        props: true
      }
    ]
  }
]

export default OrdersRoutes
