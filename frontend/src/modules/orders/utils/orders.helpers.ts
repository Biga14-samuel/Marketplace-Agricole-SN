// @ts-nocheck
// modules/orders/utils/orders.helpers.ts
import type {
  Order,
  OrderStatus,
  Cart,
  CartItem,
  OrderTracking,
  OrderStats
} from '../types/orders.types'

export const ORDER_ENDPOINTS = {
  CART: '/api/v1/orders/cart',
  CART_ITEMS: '/api/v1/orders/cart/items',
  CART_ITEM: (itemId: string | number) => `/api/v1/orders/cart/items/${itemId}`,
  CHECKOUT: '/api/v1/orders/checkout',
  MY_ORDERS: '/api/v1/orders/my-orders',
  PRODUCER_ORDERS: '/api/v1/orders/producer-orders',
  ORDER_DETAIL: (orderId: string | number) => `/api/v1/orders/${orderId}`,
  ORDER_STATUS: (orderId: string | number) => `/api/v1/orders/${orderId}/status`,
  ORDER_CANCEL: (orderId: string | number) => `/api/v1/orders/${orderId}/cancel`,
  ORDER_TRACKING: (orderId: string | number) => `/api/v1/orders/${orderId}/tracking`,
  ORDER_HISTORY: (orderId: string | number) => `/api/v1/orders/${orderId}/history`
}

export const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    color: 'warning',
    icon: 'mdi-clock-outline',
    description: 'Commande en attente de confirmation'
  },
  confirmed: {
    label: 'Confirmée',
    color: 'info',
    icon: 'mdi-check-circle-outline',
    description: 'Commande confirmée par le producteur'
  },
  preparing: {
    label: 'En préparation',
    color: 'primary',
    icon: 'mdi-cog-outline',
    description: 'Le producteur prépare votre commande'
  },
  ready: {
    label: 'Prête',
    color: 'success',
    icon: 'mdi-package-variant',
    description: 'Commande prête pour livraison/retrait'
  },
  completed: {
    label: 'Terminée',
    color: 'success',
    icon: 'mdi-check-all',
    description: 'Commande livrée et terminée'
  },
  cancelled: {
    label: 'Annulée',
    color: 'error',
    icon: 'mdi-close-circle-outline',
    description: 'Commande annulée'
  },
  refunded: {
    label: 'Remboursée',
    color: 'grey',
    icon: 'mdi-cash-refund',
    description: 'Commande remboursée'
  }
} as const

export const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    color: 'warning',
    icon: 'mdi-clock-outline'
  },
  paid: {
    label: 'Payé',
    color: 'success',
    icon: 'mdi-check-circle-outline'
  },
  failed: {
    label: 'Échoué',
    color: 'error',
    icon: 'mdi-close-circle-outline'
  },
  refunded: {
    label: 'Remboursé',
    color: 'grey',
    icon: 'mdi-cash-refund'
  },
  partially_refunded: {
    label: 'Partiellement remboursé',
    color: 'info',
    icon: 'mdi-cash-refund'
  }
} as const

/**
 * Formater un montant
 */
export const formatAmount = (amount: number, currency: string = 'XAF'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Calculer le total du panier
 */
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.subtotal, 0)
}

/**
 * Obtenir la configuration du statut d'une commande
 */
export const getOrderStatusConfig = (status: OrderStatus) => {
  return ORDER_STATUS_CONFIG[status] || {
    label: status,
    color: 'default',
    icon: 'mdi-help-circle-outline',
    description: 'Statut inconnu'
  }
}

/**
 * Obtenir la configuration du statut de paiement
 */
export const getPaymentStatusConfig = (status: string) => {
  return PAYMENT_STATUS_CONFIG[status as keyof typeof PAYMENT_STATUS_CONFIG] || {
    label: status,
    color: 'default',
    icon: 'mdi-help-circle-outline'
  }
}

/**
 * Générer un récapitulatif de commande
 */
export const generateOrderSummary = (order: Order) => {
  return {
    itemsCount: order.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: order.subtotal,
    taxAmount: order.taxAmount,
    deliveryFee: order.deliveryFee,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount
  }
}

/**
 * Vérifier si une commande peut être annulée
 */
export const canCancelOrder = (order: Order): boolean => {
  const cancellableStatuses: OrderStatus[] = ['pending', 'confirmed']
  return cancellableStatuses.includes(order.status)
}

/**
 * Vérifier si une commande peut être modifiée
 */
export const canModifyOrder = (order: Order): boolean => {
  const modifiableStatuses: OrderStatus[] = ['pending']
  return modifiableStatuses.includes(order.status)
}

/**
 * Formater la date de commande
 */
export const formatOrderDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Générer des statistiques à partir des commandes
 */
export const calculateOrderStats = (orders: Order[]): OrderStats => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const ordersThisMonth = orders.filter(order => {
    const orderDate = new Date(order.createdAt)
    return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear
  })

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => 
      ['pending', 'confirmed', 'preparing'].includes(order.status)
    ).length,
    completedOrders: orders.filter(order => order.status === 'completed').length,
    cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
    totalRevenue: orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.totalAmount, 0),
    averageOrderValue: orders.length > 0
      ? orders.reduce((total, order) => total + order.totalAmount, 0) / orders.length
      : 0,
    ordersThisMonth: ordersThisMonth.length,
    revenueThisMonth: ordersThisMonth
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.totalAmount, 0)
  }
}

/**
 * Simuler un suivi de livraison
 */
export const simulateTracking = (order: Order): OrderTracking[] => {
  const tracking: OrderTracking[] = []
  const orderDate = new Date(order.createdAt)

  tracking.push({
    id: 1,
    orderId: order.id,
    status: 'Commande créée',
    timestamp: orderDate,
    createdAt: orderDate
  })

  if (order.status !== 'pending') {
    const confirmedDate = new Date(orderDate.getTime() + 30 * 60000)
    tracking.push({
      id: 2,
      orderId: order.id,
      status: 'Commande confirmée',
      timestamp: confirmedDate,
      createdAt: confirmedDate
    })
  }

  if (['preparing', 'ready', 'completed'].includes(order.status)) {
    const preparingDate = new Date(orderDate.getTime() + 60 * 60000)
    tracking.push({
      id: 3,
      orderId: order.id,
      status: 'En préparation',
      timestamp: preparingDate,
      createdAt: preparingDate
    })
  }

  if (['ready', 'completed'].includes(order.status)) {
    const readyDate = new Date(orderDate.getTime() + 90 * 60000)
    tracking.push({
      id: 4,
      orderId: order.id,
      status: 'Prête pour livraison',
      timestamp: readyDate,
      createdAt: readyDate
    })
  }

  if (order.status === 'completed') {
    const deliveredDate = new Date(orderDate.getTime() + 120 * 60000)
    tracking.push({
      id: 5,
      orderId: order.id,
      status: 'Livrée',
      timestamp: deliveredDate,
      createdAt: deliveredDate
    })
  }

  return tracking
}

/**
 * Valider les données du panier avant checkout
 */
export const validateCartForCheckout = (cart: Cart): string[] => {
  const errors: string[] = []

  if (!cart.items || cart.items.length === 0) {
    errors.push('Le panier est vide')
  }

  cart.items.forEach((item, index) => {
    if (item.quantity <= 0) {
      errors.push(`L'article "${item.product?.name || 'Produit ' + (index + 1)}" a une quantité invalide`)
    }
    if (item.unitPrice <= 0) {
      errors.push(`L'article "${item.product?.name || 'Produit ' + (index + 1)}" a un prix invalide`)
    }
  })

  return errors
}

export default {
  ORDER_ENDPOINTS,
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  formatAmount,
  calculateCartTotal,
  getOrderStatusConfig,
  getPaymentStatusConfig,
  generateOrderSummary,
  canCancelOrder,
  canModifyOrder,
  formatOrderDate,
  calculateOrderStats,
  simulateTracking,
  validateCartForCheckout
}