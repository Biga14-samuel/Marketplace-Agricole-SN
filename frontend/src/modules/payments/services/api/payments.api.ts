// modules/payments/services/api/payments.api.ts

import apiClient from '@/shared/services/api';

// ============================================
// ENUMS ALIGNÉS AVEC LE BACKEND
// ============================================

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash'
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  MTN_MONEY = 'mtn_money',
  ORANGE_MONEY = 'orange_money',
  EXPRESS_UNION = 'express_union'
}

export enum RefundStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// ============================================
// TYPES ALIGNÉS AVEC LE BACKEND
// ============================================

export interface Payment {
  id: number;
  order_id: number;
  payment_method: PaymentMethodType;
  amount: number;
  currency: string;
  provider?: PaymentProvider;
  status: PaymentStatus;
  transaction_id?: string;
  metadata?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentCreate {
  order_id: number;
  payment_method: PaymentMethodType;
  amount: number;
  currency?: string;
  provider?: PaymentProvider;
  transaction_id?: string;
  metadata?: string;
}

export interface PaymentUpdate {
  status?: PaymentStatus;
  transaction_id?: string;
  metadata?: string;
}

export interface PaymentMethod {
  id: number;
  user_id: number;
  type: PaymentMethodType;
  last4?: string;
  brand?: string;
  is_default: boolean;
  stripe_payment_method_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodCreate {
  user_id: number;
  type: PaymentMethodType;
  last4?: string;
  brand?: string;
  is_default?: boolean;
  stripe_payment_method_id?: string;
}

export interface PaymentMethodUpdate {
  is_default?: boolean;
}

export interface Refund {
  id: number;
  payment_id: number;
  amount: number;
  reason?: string;
  status: RefundStatus;
  created_at: string;
  processed_at?: string;
}

export interface RefundCreate {
  payment_id: number;
  amount: number;
  reason?: string;
}

export interface RefundUpdate {
  status?: RefundStatus;
}

export interface PaymentStats {
  total_payments: number;
  total_amount: number;
  completed_amount: number;
  pending_amount: number;
  failed_count: number;
  refunded_amount: number;
}

// ============================================
// API INTERFACE
// ============================================

export interface PaymentsApi {
  // Créer un nouveau paiement
  createPayment(data: PaymentCreate): Promise<Payment>;
  
  // Récupérer les détails d'un paiement
  getPayment(paymentId: number): Promise<Payment>;
  
  // Récupérer tous les paiements d'une commande
  getOrderPayments(orderId: number): Promise<Payment[]>;
  
  // Mettre à jour le statut d'un paiement
  updatePaymentStatus(paymentId: number, newStatus: PaymentStatus, transactionId?: string): Promise<Payment>;
  
  // Obtenir des statistiques sur les paiements
  getPaymentStatistics(startDate: string, endDate: string): Promise<PaymentStats>;
  
  // Sauvegarder un nouveau moyen de paiement
  createPaymentMethod(data: PaymentMethodCreate): Promise<PaymentMethod>;
  
  // Récupérer un moyen de paiement
  getPaymentMethod(methodId: number): Promise<PaymentMethod>;
  
  // Récupérer tous les moyens de paiement d'un utilisateur
  getUserPaymentMethods(userId: number): Promise<PaymentMethod[]>;
  
  // Définir un moyen de paiement comme défaut
  setDefaultPaymentMethod(methodId: number, userId: number): Promise<PaymentMethod>;
  
  // Supprimer un moyen de paiement
  deletePaymentMethod(methodId: number, userId: number): Promise<void>;
  
  // Créer une demande de remboursement
  createRefund(data: RefundCreate): Promise<Refund>;
  
  // Traiter un remboursement
  processRefund(refundId: number): Promise<Refund>;
}

// ============================================
// IMPLÉMENTATION
// ============================================

export const paymentsApi: PaymentsApi = {
  createPayment: async (data: PaymentCreate): Promise<Payment> => {
    const response = await apiClient.post<Payment>(
      '/payments/',
      data
    );
    return response.data;
  },

  getPayment: async (paymentId: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(
      `/payments/${paymentId}`
    );
    return response.data;
  },

  getOrderPayments: async (orderId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(
      `/payments/order/${orderId}`
    );
    return response.data;
  },

  updatePaymentStatus: async (
    paymentId: number,
    newStatus: PaymentStatus,
    transactionId?: string
  ): Promise<Payment> => {
    const params: Record<string, any> = { new_status: newStatus };
    if (transactionId) {
      params.transaction_id = transactionId;
    }
    
    const response = await apiClient.patch<Payment>(
      `/payments/${paymentId}/status`,
      null,
      { params }
    );
    return response.data;
  },

  getPaymentStatistics: async (startDate: string, endDate: string): Promise<PaymentStats> => {
    const response = await apiClient.get<PaymentStats>(
      '/payments/stats/',
      {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      }
    );
    return response.data;
  },

  createPaymentMethod: async (data: PaymentMethodCreate): Promise<PaymentMethod> => {
    const response = await apiClient.post<PaymentMethod>(
      '/payments/methods',
      data
    );
    return response.data;
  },

  getPaymentMethod: async (methodId: number): Promise<PaymentMethod> => {
    const response = await apiClient.get<PaymentMethod>(
      `/payments/methods/${methodId}`
    );
    return response.data;
  },

  getUserPaymentMethods: async (userId: number): Promise<PaymentMethod[]> => {
    const response = await apiClient.get<PaymentMethod[]>(
      `/payments/methods/user/${userId}`
    );
    return response.data;
  },

  setDefaultPaymentMethod: async (methodId: number, userId: number): Promise<PaymentMethod> => {
    const response = await apiClient.patch<PaymentMethod>(
      `/payments/methods/${methodId}/set-default`,
      null,
      {
        params: { user_id: userId }
      }
    );
    return response.data;
  },

  deletePaymentMethod: async (methodId: number, userId: number): Promise<void> => {
    await apiClient.delete(
      `/payments/methods/${methodId}`,
      {
        params: { user_id: userId }
      }
    );
  },

  createRefund: async (data: RefundCreate): Promise<Refund> => {
    const response = await apiClient.post<Refund>(
      '/payments/refunds',
      data
    );
    return response.data;
  },

  processRefund: async (refundId: number): Promise<Refund> => {
    const response = await apiClient.patch<Refund>(
      `/payments/refunds/${refundId}/process`
    );
    return response.data;
  },
};

export default paymentsApi;
