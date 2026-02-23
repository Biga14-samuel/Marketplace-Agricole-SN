// modules/orders/types/orders.types.ts

// ============================================
// TYPES DE BASE
// ============================================

export interface Cart {
  id: string | number
  userId: string | number
  sessionId?: string
  expiresAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  items: CartItem[]
  subtotal: number
  taxAmount: number
  deliveryFee: number
  discountAmount: number
  totalAmount: number
}

export interface CartItem {
  id: string | number
  cartId: string | number
  productId: string | number
  variantId?: string | number
  quantity: number
  unitPrice: number
  subtotal: number
  product?: {
    id: string | number
    name: string
    sku: string
    images: string[]
    category?: string
    brand?: string
    weight?: number
    unit?: string
  }
  variant?: {
    id: string | number
    name: string
    sku: string
    attributes?: Record<string, string>
  }
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum DeliveryType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery'
}

export interface Order {
  id: string | number
  orderNumber: string
  userId: string | number
  producerId: string | number
  producer?: {
    id: string | number
    name: string
    logo?: string
    phone?: string
    email?: string
  }
  status: OrderStatus
  paymentStatus: PaymentStatus
  deliveryType: DeliveryType
  subtotal: number
  taxAmount: number
  deliveryFee: number
  discountAmount: number
  totalAmount: number
  pickupPointId?: string | number
  pickupSlotId?: string | number
  deliveryAddressId?: string | number
  deliveryAddress?: DeliveryAddress
  pickupSlot?: PickupSlot
  pickupPoint?: PickupPoint
  notes?: string
  items: OrderItem[]
  statusHistory: OrderStatusHistory[]
  tracking: OrderTracking[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface OrderItem {
  id: string | number
  orderId: string | number
  productId: string | number
  variantId?: string | number
  quantity: number
  unitPrice: number
  subtotal: number
  productSnapshot: ProductSnapshot
  product?: {
    id: string | number
    name: string
    sku: string
    images: string[]
  }
}

export interface ProductSnapshot {
  id: string | number
  name: string
  sku: string
  description?: string
  price: number
  weight?: number
  unit?: string
  images: string[]
  category?: string
  brand?: string
  attributes?: Record<string, any>
  createdAt: Date | string
}

export interface OrderStatusHistory {
  id: string | number
  orderId: string | number
  oldStatus: OrderStatus
  newStatus: OrderStatus
  comment?: string
  changedBy: string | number
  changedByUser?: {
    id: string | number
    name: string
    email: string
    role: string
  }
  changedAt: Date | string
}

export interface OrderTracking {
  id: string | number
  orderId: string | number
  status: string
  location?: string
  latitude?: number
  longitude?: number
  note?: string
  timestamp: Date | string
  createdAt: Date | string
}

export interface DeliveryAddress {
  id: string | number
  userId: string | number
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  region: string
  postalCode?: string
  country: string
  isDefault: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface PickupPoint {
  id: string | number
  producerId: string | number
  name: string
  address: string
  city: string
  region: string
  phone: string
  openingHours: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface PickupSlot {
  id: string | number
  pickupPointId: string | number
  date: Date | string
  startTime: string
  endTime: string
  capacity: number
  bookedCount: number
  isAvailable: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

// ============================================
// TYPES POUR LES REQUÊTES
// ============================================

export interface AddToCartRequest {
  productId: string | number
  variantId?: string | number
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface CheckoutRequest {
  deliveryType: DeliveryType
  deliveryAddressId?: string | number
  pickupPointId?: string | number
  pickupSlotId?: string | number
  notes?: string
  paymentMethod: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  comment?: string
}

export interface AddTrackingRequest {
  status: string
  location?: string
  latitude?: number
  longitude?: number
  note?: string
}

export interface CancelOrderRequest {
  reason?: string
}

// ============================================
// TYPES POUR LES FILTRES
// ============================================

export interface OrderFilter {
  status?: OrderStatus | OrderStatus[]
  paymentStatus?: PaymentStatus
  deliveryType?: DeliveryType
  dateFrom?: Date | string
  dateTo?: Date | string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'totalAmount' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface ProducerOrderFilter extends OrderFilter {
  producerId?: string | number
}

// ============================================
// TYPES POUR LES STATISTIQUES
// ============================================

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersThisMonth: number
  revenueThisMonth: number
}

export interface CartStats {
  totalItems: number
  uniqueProducts: number
  cartValue: number
  averageItemPrice: number
}