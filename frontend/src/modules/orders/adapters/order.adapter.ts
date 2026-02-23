// frontend/src/modules/orders/adapters/order.adapter.ts

import type {
    Cart,
    CartItem,
    Order,
    OrderItem,
    OrderStatusHistory,
    OrderTracking,
    AddToCartRequest,
    UpdateCartItemRequest,
    CheckoutRequest,
    UpdateOrderStatusRequest,
    AddTrackingRequest,
    CancelOrderRequest
} from '../types/orders.types'

import { OrderStatus, PaymentStatus, DeliveryType } from '../types/orders.types'

// ============ BACKEND API TYPES ============
// These match the Python backend schemas

interface BackendCartItem {
    id: number
    cart_id: number
    product_id: number
    variant_id?: number
    quantity: number
    unit_price: string // Decimal as string
    subtotal: string // Decimal as string
    created_at: string
    updated_at: string
    product?: {
        id: number
        name: string
        sku: string
        description?: string
        price: string
        images: string[]
        category?: string
        unit?: string
    }
}

interface BackendCart {
    id: number
    user_id?: number
    session_id?: string
    expires_at: string
    created_at: string
    updated_at: string
    items: BackendCartItem[]
    subtotal: string
    tax_amount: string
    delivery_fee: string
    discount_amount: string
    total_amount: string
    total: string
    items_count: number
}

interface BackendOrderItem {
    id: number
    order_id: number
    product_id?: number
    variant_id?: number
    quantity: number
    unit_price: string
    subtotal: string
    product_snapshot?: any
    created_at: string
}

interface BackendOrder {
    id: number
    user_id?: number
    producer_id?: number
    order_number: string
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    subtotal: string
    tax_amount: string
    delivery_fee: string
    discount_amount: string
    total_amount: string
    delivery_type: 'pickup' | 'delivery'
    pickup_point_id?: number
    pickup_slot_id?: number
    delivery_address_id?: number
    notes?: string
    created_at: string
    updated_at: string
    items: BackendOrderItem[]
    producer?: {
        id: number
        business_name: string
        avatar?: string
    }
}

interface BackendOrderStatusHistory {
    id: number
    order_id: number
    old_status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
    new_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
    comment?: string
    changed_by?: number
    changed_at: string
}

interface BackendOrderTracking {
    id: number
    order_id: number
    status: string
    location?: string
    note?: string
    timestamp: string
}

// ============ ENUM MAPPERS ============

const BACKEND_TO_FRONTEND_ORDER_STATUS: Record<string, OrderStatus> = {
    'pending': OrderStatus.PENDING,
    'confirmed': OrderStatus.CONFIRMED,
    'preparing': OrderStatus.PREPARING,
    'ready': OrderStatus.READY,
    'completed': OrderStatus.COMPLETED,
    'cancelled': OrderStatus.CANCELLED
}

const FRONTEND_TO_BACKEND_ORDER_STATUS: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'pending',
    [OrderStatus.CONFIRMED]: 'confirmed',
    [OrderStatus.PREPARING]: 'preparing',
    [OrderStatus.READY]: 'ready',
    [OrderStatus.COMPLETED]: 'completed',
    [OrderStatus.CANCELLED]: 'cancelled',
    [OrderStatus.REFUNDED]: 'cancelled' // Map to closest backend equivalent
}

const BACKEND_TO_FRONTEND_PAYMENT_STATUS: Record<string, PaymentStatus> = {
    'pending': PaymentStatus.PENDING,
    'completed': PaymentStatus.PAID,
    'failed': PaymentStatus.FAILED,
    'refunded': PaymentStatus.REFUNDED
}

const FRONTEND_TO_BACKEND_PAYMENT_STATUS: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'pending',
    [PaymentStatus.PAID]: 'completed',
    [PaymentStatus.FAILED]: 'failed',
    [PaymentStatus.REFUNDED]: 'refunded',
    [PaymentStatus.PARTIALLY_REFUNDED]: 'refunded' // Map to closest backend equivalent
}

const BACKEND_TO_FRONTEND_DELIVERY_TYPE: Record<string, DeliveryType> = {
    'pickup': DeliveryType.PICKUP,
    'delivery': DeliveryType.DELIVERY
}

const FRONTEND_TO_BACKEND_DELIVERY_TYPE: Record<DeliveryType, string> = {
    [DeliveryType.PICKUP]: 'pickup',
    [DeliveryType.DELIVERY]: 'delivery'
}

// ============ UTILITY FUNCTIONS ============

export function parseDecimalString(value: string): number {
    return parseFloat(value) || 0
}

export function formatCurrencyXAF(amount: number): string {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

export function formatDateString(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-CM', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// ============ ADAPTERS ============

/**
 * Adapter for CartItem objects
 */
export class CartItemAdapter {
    static toFrontend(backendItem: BackendCartItem): CartItem {
        const unitPrice = parseDecimalString(backendItem.unit_price)
        const subtotal = parseDecimalString(backendItem.subtotal)

        return {
            id: backendItem.id.toString(),
            cartId: backendItem.cart_id.toString(),
            productId: backendItem.product_id.toString(),
            variantId: backendItem.variant_id?.toString(),
            quantity: backendItem.quantity,
            unitPrice,
            subtotal,
            product: backendItem.product ? {
                id: backendItem.product.id.toString(),
                name: backendItem.product.name,
                sku: backendItem.product.sku,
                images: backendItem.product.images || [],
                category: backendItem.product.category,
                unit: backendItem.product.unit,
                weight: 0 // Default value
            } : undefined
        }
    }

    static toBackendCreate(frontendRequest: AddToCartRequest): any {
        return {
            product_id: parseInt(frontendRequest.productId.toString()),
            variant_id: frontendRequest.variantId ? parseInt(frontendRequest.variantId.toString()) : undefined,
            quantity: frontendRequest.quantity
        }
    }

    static toBackendUpdate(frontendRequest: UpdateCartItemRequest): any {
        return {
            quantity: frontendRequest.quantity
        }
    }
}

/**
 * Adapter for Cart objects
 */
export class CartAdapter {
    static toFrontend(backendCart: BackendCart): Cart {
        const subtotal = parseDecimalString(backendCart.subtotal)
        const taxAmount = parseDecimalString(backendCart.tax_amount)
        const deliveryFee = parseDecimalString(backendCart.delivery_fee)
        const discountAmount = parseDecimalString(backendCart.discount_amount)
        const totalAmount = parseDecimalString(backendCart.total_amount)

        return {
            id: backendCart.id.toString(),
            userId: backendCart.user_id?.toString() || '',
            sessionId: backendCart.session_id,
            expiresAt: new Date(backendCart.expires_at),
            createdAt: new Date(backendCart.created_at),
            updatedAt: new Date(backendCart.updated_at),
            items: backendCart.items.map(item => CartItemAdapter.toFrontend(item)),
            subtotal,
            taxAmount,
            deliveryFee,
            discountAmount,
            totalAmount
        }
    }
}

/**
 * Adapter for OrderItem objects
 */
export class OrderItemAdapter {
    static toFrontend(backendItem: BackendOrderItem): OrderItem {
        const unitPrice = parseDecimalString(backendItem.unit_price)
        const subtotal = parseDecimalString(backendItem.subtotal)

        return {
            id: backendItem.id.toString(),
            orderId: backendItem.order_id.toString(),
            productId: backendItem.product_id?.toString() || '',
            variantId: backendItem.variant_id?.toString(),
            quantity: backendItem.quantity,
            unitPrice,
            subtotal,
            productSnapshot: backendItem.product_snapshot || {
                id: backendItem.product_id?.toString() || '',
                name: 'Produit',
                sku: '',
                price: unitPrice,
                images: [],
                createdAt: new Date(backendItem.created_at)
            }
        }
    }
}

/**
 * Adapter for Order objects
 */
export class OrderAdapter {
    static toFrontend(backendOrder: BackendOrder): Order {
        const subtotal = parseDecimalString(backendOrder.subtotal)
        const taxAmount = parseDecimalString(backendOrder.tax_amount)
        const deliveryFee = parseDecimalString(backendOrder.delivery_fee)
        const discountAmount = parseDecimalString(backendOrder.discount_amount)
        const totalAmount = parseDecimalString(backendOrder.total_amount)

        return {
            id: backendOrder.id.toString(),
            orderNumber: backendOrder.order_number,
            userId: backendOrder.user_id?.toString() || '',
            producerId: backendOrder.producer_id?.toString() || '',
            producer: backendOrder.producer ? {
                id: backendOrder.producer.id.toString(),
                name: backendOrder.producer.business_name,
                logo: backendOrder.producer.avatar
            } : undefined,
            status: BACKEND_TO_FRONTEND_ORDER_STATUS[backendOrder.status] || OrderStatus.PENDING,
            paymentStatus: BACKEND_TO_FRONTEND_PAYMENT_STATUS[backendOrder.payment_status] || PaymentStatus.PENDING,
            deliveryType: BACKEND_TO_FRONTEND_DELIVERY_TYPE[backendOrder.delivery_type] || DeliveryType.PICKUP,
            subtotal,
            taxAmount,
            deliveryFee,
            discountAmount,
            totalAmount,
            pickupPointId: backendOrder.pickup_point_id?.toString(),
            pickupSlotId: backendOrder.pickup_slot_id?.toString(),
            deliveryAddressId: backendOrder.delivery_address_id?.toString(),
            notes: backendOrder.notes,
            items: backendOrder.items.map(item => OrderItemAdapter.toFrontend(item)),
            statusHistory: [], // Will be populated separately
            tracking: [], // Will be populated separately
            createdAt: new Date(backendOrder.created_at),
            updatedAt: new Date(backendOrder.updated_at)
        }
    }

    static toBackendCheckout(frontendRequest: CheckoutRequest): any {
        return {
            delivery_type: FRONTEND_TO_BACKEND_DELIVERY_TYPE[frontendRequest.deliveryType],
            pickup_point_id: frontendRequest.pickupPointId ? parseInt(frontendRequest.pickupPointId.toString()) : undefined,
            pickup_slot_id: frontendRequest.pickupSlotId ? parseInt(frontendRequest.pickupSlotId.toString()) : undefined,
            delivery_address_id: frontendRequest.deliveryAddressId ? parseInt(frontendRequest.deliveryAddressId.toString()) : undefined,
            notes: frontendRequest.notes,
            payment_method: frontendRequest.paymentMethod
        }
    }
}

/**
 * Adapter for OrderStatusHistory objects
 */
export class OrderStatusHistoryAdapter {
    static toFrontend(backendHistory: BackendOrderStatusHistory): OrderStatusHistory {
        return {
            id: backendHistory.id.toString(),
            orderId: backendHistory.order_id.toString(),
            oldStatus: backendHistory.old_status ? BACKEND_TO_FRONTEND_ORDER_STATUS[backendHistory.old_status] : undefined,
            newStatus: BACKEND_TO_FRONTEND_ORDER_STATUS[backendHistory.new_status] || OrderStatus.PENDING,
            comment: backendHistory.comment,
            changedBy: backendHistory.changed_by?.toString() || '',
            changedAt: new Date(backendHistory.changed_at)
        }
    }

    static toBackendCreate(frontendRequest: UpdateOrderStatusRequest): any {
        return {
            status: FRONTEND_TO_BACKEND_ORDER_STATUS[frontendRequest.status],
            comment: frontendRequest.comment
        }
    }
}

/**
 * Adapter for OrderTracking objects
 */
export class OrderTrackingAdapter {
    static toFrontend(backendTracking: BackendOrderTracking): OrderTracking {
        return {
            id: backendTracking.id.toString(),
            orderId: backendTracking.order_id.toString(),
            status: backendTracking.status,
            location: backendTracking.location,
            note: backendTracking.note,
            timestamp: new Date(backendTracking.timestamp),
            createdAt: new Date(backendTracking.timestamp) // Use timestamp as createdAt
        }
    }

    static toBackendCreate(frontendRequest: AddTrackingRequest): any {
        return {
            status: frontendRequest.status,
            location: frontendRequest.location,
            latitude: frontendRequest.latitude,
            longitude: frontendRequest.longitude,
            note: frontendRequest.note
        }
    }
}

// Exports are provided via individual `export class` declarations above.