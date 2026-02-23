/**
 * Routes du module catalog
 */

import type { RouteRecordRaw } from 'vue-router'

const catalogRoutes: RouteRecordRaw[] = [
  {
    path: '/catalog',
    name: 'Catalog',
    children: [
      {
        path: '',
        name: 'CatalogHome',
        component: () => import('../views/CatalogView.vue'),
        meta: {
          title: 'Catalogue'
        }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/ProductsView.vue'),
        meta: {
          title: 'Produits'
        }
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('../views/ProductDetailView.vue'),
        meta: {
          title: 'Détail produit'
        }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/CategoriesView.vue'),
        meta: {
          title: 'Catégories'
        }
      },
      {
        path: 'categories/:slug',
        name: 'CategoryDetail',
        component: () => import('../views/CategoryDetailView.vue'),
        meta: {
          title: 'Catégorie'
        }
      },
      {
        path: 'my-products',
        name: 'MyProducts',
        component: () => import('../views/MyProductsView.vue'),
        meta: {
          title: 'Mes produits',
          requiresAuth: true
        }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('../views/InventoryView.vue'),
        meta: {
          title: 'Inventaire',
          requiresAuth: true
        }
      },
      {
        path: 'stock-alerts',
        name: 'StockAlerts',
        component: () => import('../views/StockAlertsView.vue'),
        meta: {
          title: 'Alertes stock',
          requiresAuth: true
        }
      }
    ]
  }
]

export default catalogRoutes