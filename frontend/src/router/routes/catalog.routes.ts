/**
 * Routes du catalogue
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
        component: () => import('@/modules/catalog/views/CatalogView.vue'),
        meta: {
          title: 'Catalogue'
        }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/modules/catalog/views/ProductsView.vue'),
        meta: {
          title: 'Produits'
        }
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('@/modules/catalog/views/ProductDetailView.vue'),
        meta: {
          title: 'Détail produit'
        }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/modules/catalog/views/CategoriesView.vue'),
        meta: {
          title: 'Catégories'
        }
      },
      {
        path: 'categories/:slug',
        name: 'CategoryDetail',
        component: () => import('@/modules/catalog/views/CategoryDetailView.vue'),
        meta: {
          title: 'Catégorie'
        }
      },
      // Routes protégées pour les producteurs
      {
        path: 'my-products',
        name: 'MyProducts',
        component: () => import('@/modules/catalog/views/MyProductsView.vue'),
        meta: {
          title: 'Mes produits',
          requiresAuth: true
        }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/modules/catalog/views/InventoryView.vue'),
        meta: {
          title: 'Inventaire',
          requiresAuth: true
        }
      },
      {
        path: 'stock-alerts',
        name: 'StockAlerts',
        component: () => import('@/modules/catalog/views/StockAlertsView.vue'),
        meta: {
          title: 'Alertes de stock',
          requiresAuth: true
        }
      }
    ]
  }
]

export default catalogRoutes
