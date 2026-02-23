import type { RouteRecordRaw } from 'vue-router'
import { RoleName } from '@/modules/auth/types/auth.types'

const catalogRoutes: RouteRecordRaw[] = [
  {
    path: '/catalog',
    name: 'catalog',
    redirect: '/catalog/products',
    meta: {
      requiresAuth: false,
      title: 'Catalogue des Produits Frais'
    },
    children: [
      // Routes publiques - Consultation du catalogue
      {
        path: 'products',
        name: 'catalog-products',
        component: () => import('@/modules/catalog/views/ProductsView.vue'),
        meta: {
          title: 'Produits Disponibles',
          requiresAuth: false
        }
      },
      {
        path: 'products/:id',
        name: 'catalog-product-detail',
        component: () => import('@/modules/catalog/views/ProductDetailView.vue'),
        props: true,
        meta: {
          title: 'Détails du Produit',
          requiresAuth: false
        }
      },
      {
        path: 'categories',
        name: 'catalog-categories',
        component: () => import('@/modules/catalog/views/CategoriesView.vue'),
        meta: {
          title: 'Catégories',
          requiresAuth: false
        }
      },
      {
        path: 'categories/:id',
        name: 'catalog-category-detail',
        component: () => import('@/modules/catalog/views/CategoryDetailView.vue'),
        props: true,
        meta: {
          title: 'Produits par Catégorie',
          requiresAuth: false
        }
      },
      
      // Routes producteurs - Gestion des produits
      {
        path: 'my-products',
        name: 'catalog-my-products',
        component: () => import('@/modules/catalog/views/MyProductsView.vue'),
        meta: {
          title: 'Mes Produits',
          roles: [RoleName.PRODUCER],
          requiresAuth: true
        }
      },
      {
        path: 'inventory',
        name: 'catalog-inventory',
        component: () => import('@/modules/catalog/views/InventoryView.vue'),
        meta: {
          title: 'Gestion des Stocks',
          roles: [RoleName.PRODUCER],
          requiresAuth: true
        }
      },
      {
        path: 'stock-alerts',
        name: 'catalog-stock-alerts',
        component: () => import('@/modules/catalog/views/StockAlertsView.vue'),
        meta: {
          title: 'Alertes de Stock',
          roles: [RoleName.PRODUCER],
          requiresAuth: true
        }
      },
      
      // Routes admin - Gestion du catalogue
      {
        path: 'admin/categories',
        name: 'catalog-admin-categories',
        component: () => import('@/modules/catalog/views/CategoryViews.vue'),
        meta: {
          title: 'Gestion des Catégories',
          roles: [RoleName.ADMIN],
          requiresAuth: true
        }
      },
      {
        path: 'admin/tags',
        name: 'catalog-admin-tags',
        component: () => import('@/modules/catalog/views/TagViews.vue'),
        meta: {
          title: 'Gestion des Tags',
          roles: [RoleName.ADMIN],
          requiresAuth: true
        }
      },
      {
        path: 'admin/units',
        name: 'catalog-admin-units',
        component: () => import('@/modules/catalog/views/UnitViews.vue'),
        meta: {
          title: 'Gestion des Unités',
          roles: [RoleName.ADMIN],
          requiresAuth: true
        }
      }
    ]
  }
]

export default catalogRoutes
