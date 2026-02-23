// @ts-nocheck
/**
 * MODULE ORDERS - Point d'entrée principal
 * Gestion des commandes et du panier
 */

// Types
export * from './types/orders.types'

// Services
export { ordersService, default as OrdersService } from './services/orders.service'

// Store
export { useOrdersStore } from './stores/orders.store'

// Routes
export { default as ordersRoutes } from './router/orders.routes'

// Utils
export * from './utils/orders.helpers'
export * from './utils/orders.validators'

// Components
export { default as CartView } from './components/CartView.vue'
export { default as CartItem } from './components/CartItem.vue'
export { default as CheckoutView } from './components/CheckoutView.vue'
export { default as OrderList } from './components/OrderList.vue'
export { default as OrderDetail } from './components/OrderDetail.vue'
export { default as OrderCard } from './components/OrderCard.vue'
export { default as OrderHistory } from './components/OrderHistory.vue'
export { default as OrderStatusBadge } from './components/OrderStatusBadge.vue'
export { default as ProducerOrders } from './components/ProducerOrders.vue'
export { default as TrackingView } from './components/TrackingView.vue'
