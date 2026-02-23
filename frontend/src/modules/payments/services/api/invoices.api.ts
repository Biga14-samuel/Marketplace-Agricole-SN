// modules/payments/services/api/invoices.api.ts

import apiClient from '@/shared/services/api';

// ============================================
// ENUMS ALIGNÉS AVEC LE BACKEND
// ============================================

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// ============================================
// TYPES ALIGNÉS AVEC LE BACKEND
// ============================================

export interface Invoice {
  id: number;
  order_id: number;
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: InvoiceStatus;
  file_path?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceCreate {
  order_id: number;
  invoice_number: string;
  subtotal: number;
  tax_amount?: number;
  total: number;
  due_date?: string;
}

export interface InvoiceUpdate {
  status?: InvoiceStatus;
  file_path?: string;
  due_date?: string;
}

export interface ProducerPayout {
  id: number;
  producer_id: number;
  period_start: string;
  period_end: string;
  gross_amount: number;
  commission: number;
  net_amount: number;
  status: PayoutStatus;
  created_at: string;
  paid_at?: string;
}

export interface ProducerPayoutCalculation {
  producer_id: number;
  period_start: string;
  period_end: string;
  total_orders: number;
  gross_amount: number;
  commission_rate: number;
  commission_amount: number;
  net_amount: number;
}

// ============================================
// API INTERFACE
// ============================================

export interface InvoicesApi {
  // Générer une facture pour une commande
  createInvoiceForOrder(orderId: number): Promise<Invoice>;
  
  // Récupérer une facture
  getInvoice(invoiceId: number): Promise<Invoice>;
  
  // Récupérer la facture d'une commande
  getInvoiceByOrder(orderId: number): Promise<Invoice>;
  
  // Mettre à jour le statut d'une facture
  updateInvoiceStatus(invoiceId: number, newStatus: InvoiceStatus): Promise<Invoice>;
  
  // Calculer le versement pour un producteur
  calculateProducerPayout(
    producerId: number,
    periodStart: string,
    periodEnd: string,
    commissionRate?: number
  ): Promise<ProducerPayoutCalculation>;
  
  // Créer un versement producteur
  createProducerPayout(
    producerId: number,
    periodStart: string,
    periodEnd: string,
    commissionRate?: number
  ): Promise<ProducerPayout>;
  
  // Récupérer un versement
  getProducerPayout(payoutId: number): Promise<ProducerPayout>;
  
  // Récupérer tous les versements d'un producteur
  getProducerPayouts(producerId: number, skip?: number, limit?: number): Promise<ProducerPayout[]>;
  
  // Traiter un versement
  processPayout(payoutId: number): Promise<ProducerPayout>;
  
  // Générer tous les versements mensuels
  generateMonthlyPayouts(year: number, month: number): Promise<ProducerPayout[]>;
}

// ============================================
// IMPLÉMENTATION
// ============================================

export const invoicesApi: InvoicesApi = {
  createInvoiceForOrder: async (orderId: number): Promise<Invoice> => {
    const response = await apiClient.post<Invoice>(
      `/payments/invoices/order/${orderId}`
    );
    return response.data;
  },

  getInvoice: async (invoiceId: number): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(
      `/payments/invoices/${invoiceId}`
    );
    return response.data;
  },

  getInvoiceByOrder: async (orderId: number): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(
      `/payments/invoices/order/${orderId}`
    );
    return response.data;
  },

  updateInvoiceStatus: async (invoiceId: number, newStatus: InvoiceStatus): Promise<Invoice> => {
    const response = await apiClient.patch<Invoice>(
      `/payments/invoices/${invoiceId}/status`,
      null,
      {
        params: { new_status: newStatus }
      }
    );
    return response.data;
  },

  calculateProducerPayout: async (
    producerId: number,
    periodStart: string,
    periodEnd: string,
    commissionRate = 0.15
  ): Promise<ProducerPayoutCalculation> => {
    const response = await apiClient.get<ProducerPayoutCalculation>(
      '/payments/payouts/calculate',
      {
        params: {
          producer_id: producerId,
          period_start: periodStart,
          period_end: periodEnd,
          commission_rate: commissionRate
        }
      }
    );
    return response.data;
  },

  createProducerPayout: async (
    producerId: number,
    periodStart: string,
    periodEnd: string,
    commissionRate = 0.15
  ): Promise<ProducerPayout> => {
    const response = await apiClient.post<ProducerPayout>(
      '/payments/payouts',
      null,
      {
        params: {
          producer_id: producerId,
          period_start: periodStart,
          period_end: periodEnd,
          commission_rate: commissionRate
        }
      }
    );
    return response.data;
  },

  getProducerPayout: async (payoutId: number): Promise<ProducerPayout> => {
    const response = await apiClient.get<ProducerPayout>(
      `/payments/payouts/${payoutId}`
    );
    return response.data;
  },

  getProducerPayouts: async (
    producerId: number,
    skip = 0,
    limit = 100
  ): Promise<ProducerPayout[]> => {
    const response = await apiClient.get<ProducerPayout[]>(
      `/payments/payouts/producer/${producerId}`,
      {
        params: { skip, limit }
      }
    );
    return response.data;
  },

  processPayout: async (payoutId: number): Promise<ProducerPayout> => {
    const response = await apiClient.patch<ProducerPayout>(
      `/payments/payouts/${payoutId}/process`
    );
    return response.data;
  },

  generateMonthlyPayouts: async (year: number, month: number): Promise<ProducerPayout[]> => {
    const response = await apiClient.post<ProducerPayout[]>(
      '/payments/payouts/generate-monthly',
      null,
      {
        params: { year, month }
      }
    );
    return response.data;
  },
};

export default invoicesApi;
