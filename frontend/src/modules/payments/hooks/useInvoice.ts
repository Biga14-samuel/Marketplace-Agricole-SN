// @ts-nocheck
import { getErrorMessage } from '@/shared/utils/error-handler';
// hooks/useInvoice.ts

/**
 * Hook personnalisé pour la gestion des factures
 * Gestion complète du cycle de vie des factures (création, édition, envoi, suivi)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    INVOICE_TYPES,
    INVOICE_STATUS,
    INVOICE_PAYMENT_METHODS,
    VAT_RATES,
    DEFAULT_INVOICE_CONFIG,
    generateInvoiceNumber,
    calculateDueDate,
    calculateVAT,
    formatCurrency,
    isInvoiceOverdue,
    calculateInvoiceBalance,
    validateCameroonVATNumber,
    validateNIUNumber
} from '../constants/invoice.constants';
import {
    DEFAULT_COMPANY_INFO,
    LEGAL_DISCLAIMERS,
    INVOICE_MESSAGES
} from '../constants/invoice.constants';
import {
    CAMEROON_REGIONS,
    POSTAL_CODES
} from '../constants/cameroon.constants';

// Types d'erreur de facturation
export type InvoiceError = {
    code: string;
    message: string;
    field?: string;
    details?: any;
};

// Types de statut de facture
export type InvoiceState = {
    isLoading: boolean;
    isSaving: boolean;
    isGeneratingPDF: boolean;
    isSending: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
    data: any | null;
    error: InvoiceError | null;
};

// Informations client
export interface CustomerInfo {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        region: keyof typeof CAMEROON_REGIONS;
        postalCode?: string;
        country: string;
    };
    taxInfo?: {
        vatNumber?: string;
        niuNumber?: string;
        taxCode?: string;
    };
    type: 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT';
}

// Article de facture
export interface InvoiceItem {
    id: string;
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    vatRate: number;
    discount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED';
    notes?: string;
}

// Options de création de facture
export interface CreateInvoiceOptions {
    customer: CustomerInfo;
    items: InvoiceItem[];
    type: keyof typeof INVOICE_TYPES;
    invoiceDate: Date;
    dueDate?: Date;
    paymentTerm: number;
    paymentMethod: keyof typeof INVOICE_PAYMENT_METHODS;
    currency: string;
    language: string;
    notes?: string;
    terms?: string;
    metadata?: Record<string, any>;
}

// Options de mise à jour de facture
export interface UpdateInvoiceOptions {
    invoiceId: string;
    updates: Partial<CreateInvoiceOptions> & {
        status?: keyof typeof INVOICE_STATUS;
        paymentStatus?: string;
    };
}

// Options de recherche/filtrage
export interface InvoiceFilterOptions {
    status?: keyof typeof INVOICE_STATUS;
    type?: keyof typeof INVOICE_TYPES;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Options de configuration du hook
export interface UseInvoiceOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    onInvoiceCreated?: (invoice: any) => void;
    onInvoiceUpdated?: (invoice: any) => void;
    onInvoiceDeleted?: (invoiceId: string) => void;
    onError?: (error: InvoiceError) => void;
}

/**
 * Hook personnalisé pour la gestion des factures
 */
export const useInvoice = (options: UseInvoiceOptions = {}) => {
    const router = useRouter();

    // Configuration par défaut
    const config = {
        autoRefresh: options.autoRefresh ?? false,
        refreshInterval: options.refreshInterval ?? 30000, // 30 secondes
        onInvoiceCreated: options.onInvoiceCreated ?? (() => { }),
        onInvoiceUpdated: options.onInvoiceUpdated ?? (() => { }),
        onInvoiceDeleted: options.onInvoiceDeleted ?? (() => { }),
        onError: options.onError ?? (() => { })
    };

    // États
    const [invoiceState, setInvoiceState] = useState<InvoiceState>({
        isLoading: false,
        isSaving: false,
        isGeneratingPDF: false,
        isSending: false,
        isSuccess: false,
        isError: false,
        message: '',
        data: null,
        error: null
    });

    const [invoices, setInvoices] = useState<any[]>([]);
    const [pagination, setPagination] = useState<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const [stats, setStats] = useState<{
        total: number;
        pending: number;
        paid: number;
        overdue: number;
        cancelled: number;
        totalAmount: number;
    }>({
        total: 0,
        pending: 0,
        paid: 0,
        overdue: 0,
        cancelled: 0,
        totalAmount: 0
    });

    // Références
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Valide les données d'une facture
     */
    const validateInvoiceData = useCallback((data: CreateInvoiceOptions): {
        isValid: boolean;
        errors: string[];
        validatedData: CreateInvoiceOptions;
    } => {
        const errors: string[] = [];
        const validatedData = { ...data };

        // Validation client
        if (!data.customer?.name?.trim()) {
            errors.push('Le nom du client est requis');
        }

        if (!data.customer?.address?.street?.trim()) {
            errors.push('L\'adresse du client est requise');
        }

        // Validation des articles
        if (!data.items || data.items.length === 0) {
            errors.push('Au moins un article est requis');
        } else {
            data.items.forEach((item, index) => {
                if (!item.description?.trim()) {
                    errors.push(`Article ${index + 1}: description requise`);
                }
                if (item.quantity <= 0) {
                    errors.push(`Article ${index + 1}: quantité invalide`);
                }
                if (item.unitPrice <= 0) {
                    errors.push(`Article ${index + 1}: prix unitaire invalide`);
                }
            });
        }

        // Validation TVA
        if (data.customer?.taxInfo?.vatNumber && !validateCameroonVATNumber(data.customer.taxInfo.vatNumber)) {
            errors.push('Numéro de TVA invalide');
        }

        if (data.customer?.taxInfo?.niuNumber && !validateNIUNumber(data.customer.taxInfo.niuNumber)) {
            errors.push('Numéro NIU invalide');
        }

        // Calcul de la date d'échéance si non fournie
        if (!data.dueDate) {
            validatedData.dueDate = calculateDueDate(data.invoiceDate, data.paymentTerm);
        }

        // Formatage des valeurs
        validatedData.items = data.items.map(item => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            vatRate: Number(item.vatRate) || VAT_RATES.STANDARD
        }));

        return {
            isValid: errors.length === 0,
            errors,
            validatedData
        };
    }, []);

    /**
     * Calcule les totaux d'une facture
     */
    const calculateInvoiceTotals = useCallback((items: InvoiceItem[]) => {
        const totals = {
            subtotal: 0,
            totalDiscount: 0,
            totalVAT: 0,
            total: 0,
            items: items.map(item => {
                const lineTotal = item.quantity * item.unitPrice;
                const discount = item.discount
                    ? item.discountType === 'PERCENTAGE'
                        ? (lineTotal * item.discount) / 100
                        : item.discount
                    : 0;
                const lineSubtotal = lineTotal - discount;
                const vatAmount = calculateVAT(lineSubtotal, item.vatRate);
                const lineTotalWithVAT = lineSubtotal + vatAmount;

                return {
                    ...item,
                    lineTotal,
                    discount,
                    lineSubtotal,
                    vatAmount,
                    lineTotalWithVAT
                };
            })
        };

        totals.items.forEach(item => {
            totals.subtotal += item.lineSubtotal;
            totals.totalDiscount += item.discount || 0;
            totals.totalVAT += item.vatAmount;
            totals.total += item.lineTotalWithVAT;
        });

        return totals;
    }, []);

    /**
     * Génère un numéro de facture unique
     */
    const generateUniqueInvoiceNumber = useCallback((): string => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return generateInvoiceNumber(
            DEFAULT_INVOICE_CONFIG.NUMBER_FORMAT,
            Math.floor(timestamp / 1000) + random,
            new Date()
        );
    }, []);

    /**
     * Récupère la liste des factures
     */
    const fetchInvoices = useCallback(async (filters: InvoiceFilterOptions = {}): Promise<{
        success: boolean;
        data?: any[];
        error?: string;
    }> => {
        setInvoiceState(prev => ({
            ...prev,
            isLoading: true,
            message: 'Chargement des factures...'
        }));

        try {
            // Construction des paramètres de requête
            const queryParams = new URLSearchParams();

            if (filters.status) queryParams.append('status', filters.status);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.customerId) queryParams.append('customerId', filters.customerId);
            if (filters.startDate) queryParams.append('startDate', filters.startDate.toISOString());
            if (filters.endDate) queryParams.append('endDate', filters.endDate.toISOString());
            if (filters.minAmount) queryParams.append('minAmount', filters.minAmount.toString());
            if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString());
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

            const response = await fetch(`/api/invoices?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec du chargement des factures');
            }

            setInvoices(data.invoices || []);
            setPagination(data.pagination || {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0
            });

            setInvoiceState(prev => ({
                ...prev,
                isLoading: false,
                isSuccess: true,
                message: `${data.invoices?.length || 0} factures chargées`
            }));

            return {
                success: true,
                data: data.invoices
            };

        } catch (error: unknown) {
            const invoiceError: InvoiceError = {
                code: 'FETCH_INVOICES_FAILED',
                message: getErrorMessage(error),
                details: error
            };

            setInvoiceState(prev => ({
                ...prev,
                isLoading: false,
                isError: true,
                message: invoiceError.message,
                error: invoiceError
            }));

            config.onError?.(invoiceError);

            return {
                success: false,
                error: invoiceError.message
            };
        }
    }, [config]);

    /**
     * Récupère une facture par son ID
     */
    const fetchInvoiceById = useCallback(async (invoiceId: string): Promise<{
        success: boolean;
        data?: any;
        error?: string;
    }> => {
        setInvoiceState(prev => ({
            ...prev,
            isLoading: true,
            message: 'Chargement de la facture...'
        }));

        try {
            const response = await fetch(`/api/invoices/${invoiceId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Facture non trouvée');
            }

            setInvoiceState(prev => ({
                ...prev,
                isLoading: false,
                isSuccess: true,
                data: data.invoice,
                message: 'Facture chargée avec succès'
            }));

            return {
                success: true,
                data: data.invoice
            };

        } catch (error: unknown) {
            const invoiceError: InvoiceError = {
                code: 'FETCH_INVOICE_FAILED',
                message: getErrorMessage(error),
                details: error
            };

            setInvoiceState(prev => ({
                ...prev,
                isLoading: false,
                isError: true,
                message: invoiceError.message,
                error: invoiceError
            }));

            config.onError?.(invoiceError);

            return {
                success: false,
                error: invoiceError.message
            };
        }
    }, [config]);

    /**
     * Crée une nouvelle facture
     */
    const createInvoice = useCallback(async (options: CreateInvoiceOptions): Promise<{
        success: boolean;
        invoice?: any;
        error?: string;
    }> => {
        setInvoiceState(prev => ({
            ...prev,
            isSaving: true,
            message: 'Création de la facture...'
        }));

        try {
            // Validation des données
            const validation = validateInvoiceData(options);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Calcul des totaux
            const totals = calculateInvoiceTotals(validation.validatedData.items);

            // Génération du numéro de facture
            const invoiceNumber = generateUniqueInvoiceNumber();

            // Construction de la requête
            const invoiceRequest = {
                ...validation.validatedData,
                invoiceNumber,
                totals,
                status: INVOICE_STATUS.DRAFT,
                metadata: {
                    ...validation.validatedData.metadata,
                    createdAt: new Date().toISOString(),
                    createdBy: localStorage.getItem('user_id')
                }
            };

            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(invoiceRequest)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la création de la facture');
            }

            // Mettre à jour la liste locale
            setInvoices(prev => [data.invoice, ...prev]);

            setInvoiceState(prev => ({
                ...prev,
                isSaving: false,
                isSuccess: true,
                data: data.invoice,
                message: 'Facture créée avec succès'
            }));

            config.onInvoiceCreated?.(data.invoice);

            return {
                success: true,
                invoice: data.invoice
            };

        } catch (error: unknown) {
            const invoiceError: InvoiceError = {
                code: 'CREATE_INVOICE_FAILED',
                message: getErrorMessage(error),
                details: error
            };

            setInvoiceState(prev => ({
                ...prev,
                isSaving: false,
                isError: true,
                message: invoiceError.message,
                error: invoiceError
            }));

            config.onError?.(invoiceError);

            return {
                success: false,
                error: invoiceError.message
            };
        }
    }, [validateInvoiceData, calculateInvoiceTotals, generateUniqueInvoiceNumber, config]);

    /**
     * Met à jour une facture existante
     */
    const updateInvoice = useCallback(async (options: UpdateInvoiceOptions): Promise<{
        success: boolean;
        invoice?: any;
        error?: string;
    }> => {
        setInvoiceState(prev => ({
            ...prev,
            isSaving: true,
            message: 'Mise à jour de la facture...'
        }));

        try {
            const response = await fetch(`/api/invoices/${options.invoiceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(options.updates)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la mise à jour de la facture');
            }

            // Mettre à jour la liste locale
            setInvoices(prev => prev.map(inv =>
                inv.id === options.invoiceId ? data.invoice : inv
            ));

            // Mettre à jour la facture courante si c'est celle-ci
            if (invoiceState.data?.id === options.invoiceId) {
                setInvoiceState(prev => ({
                    ...prev,
                    data: data.invoice
                }));
            }

            setInvoiceState(prev => ({
                ...prev,
                isSaving: false,
                isSuccess: true,
                message: 'Facture mise à jour avec succès'
            }));

            config.onInvoiceUpdated?.(data.invoice);

            return {
                success: true,
                invoice: data.invoice
            };

        } catch (error: unknown) {
            const invoiceError: InvoiceError = {
                code: 'UPDATE_INVOICE_FAILED',
                message: getErrorMessage(error),
                details: error
            };

            setInvoiceState(prev => ({
                ...prev,
                isSaving: false,
                isError: true,
                message: invoiceError.message,
                error: invoiceError
            }));

            config.onError?.(invoiceError);

            return {
                success: false,
                error: invoiceError.message
            };
        }
    }, [invoiceState.data, config]);

    /**
     * Supprime une facture
     */
    const deleteInvoice = useCallback(async (invoiceId: string): Promise<{
        success: boolean;
        message: string;
        error?: string;
    }> => {
        setInvoiceState(prev => ({
            ...prev,
            isSaving: true,
            message: 'Suppression de la facture...'
        }));

        try {
            const response = await fetch(`/api/invoices/${invoiceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la suppression de la facture');
            }

            // Mettre à jour la liste locale
            setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));

            setInvoiceState(prev => ({
                ...prev,
                isSaving: false,
                isSuccess: true,
                message: 'Facture supprimée avec succès'
            }));

            config.onInvoiceDeleted?.(invoiceId);

            return {
                success: true,
                message: data.message
            };

        } catch (error: unknown) {
            const invoiceError: InvoiceError = {
                code: 'DELETE_INVOICE_FAILED',
                message: getErrorMessage(error),
                details: error
            };

            setInvoiceState(prev => ({
                ...prev,
                isSaving: false,
                isError: true,
                message: invoiceError.message,
                error: invoiceError
            }));

            config.onError?.(invoiceError);

            return {
                success: false,
                message: invoiceError.message,
                error: invoiceError.message
            };
        }
    }, [config]);

    /**
     * Génère un PDF de facture
     */
    const generateInvoicePDF = useCallback(async (invoiceId: string): Promise<{
        success: boolean;
        pdfUrl?: string;
        pdfBlob?: Blob;
        error?: string;
    }> => {
        setInvoiceState(prev => ({
            ...prev,
            isGeneratingPDF: true,
            message: 'Génération du PDF...'
        }));

        try {
            const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Échec de la génération du PDF');
            }

            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);

            setInvoiceState(prev => ({
                ...prev,
                isGeneratingPDF: false,
                isSuccess: true,
                message: 'PDF généré avec succès'
            }));

            return {
                success: true,
                pdfUrl,
                pdfBlob
            };

        } catch (error: unknown) {
            const invoiceError: InvoiceError = {
                code: 'GENERATE_PDF_FAILED',
                message: getErrorMessage(error),
                details: error
            };

            setInvoiceState(prev => ({
                ...prev,
                isGeneratingPDF: false,
                isError: true,
                message: invoiceError.message,
                error: invoiceError
            }));

            config.onError?.(invoiceError);

            return {
                success: false,
                error: invoiceError.message
            };
        }
    }, [config]);

    /**
     * Envoie une facture par email
     */
    const sendInvoiceByEmail = useCallback(async (
        invoiceId: string,
        emailOptions?: {
            to?: string[];
            cc?: string[];
            bcc?: string[];
            subject?: string;
            message?: string;
            attachPDF?: boolean;
        }
    ): Promise<{
        success: boolean;
        message: string;
        error?: string;
    }> => {
        setInvoiceState(prev => ({
            ...prev,
            isSending: true,
            message: 'Envoi de la facture...'
        }));

        try {
            const response = await fetch(`/api/invoices/${invoiceId}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(emailOptions || {})
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de l\'envoi de la facture');
            }

            // Mettre à jour le statut de la facture
            await updateInvoice({
                invoiceId,
                updates: { status: INVOICE_STATUS.SENT }
            });

            setInvoiceState(prev => ({
                ...prev,
                isSending: false,
                isSuccess: true,
                message: 'Facture envoyée avec succès'
            }));

            return {
                success: true,
                message: data.message
            };

        } catch (error: unknown) {
            const invoiceError: InvoiceError = {
                code: 'SEND_INVOICE_FAILED',
                message: `Erreur lors de l'envoi de la facture: ${getErrorMessage(error)}`,
                details: error
            };

            setInvoiceState(prev => ({
                ...prev,
                isSending: false,
                isError: true,
                message: invoiceError.message,
                error: invoiceError
            }));

            config.onError?.(invoiceError);

            return {
                success: false,
                message: invoiceError.message,
                error: invoiceError.message
            };
        }
    }, [updateInvoice, config]);

    /**
     * Change le statut d'une facture
     */
    const changeInvoiceStatus = useCallback(async (
        invoiceId: string,
        status: keyof typeof INVOICE_STATUS,
        notes?: string
    ): Promise<{
        success: boolean;
        invoice?: any;
        error?: string;
    }> => {
        return updateInvoice({
            invoiceId,
            updates: {
                status,
                metadata: {
                    statusChange: {
                        previousStatus: invoiceState.data?.status,
                        newStatus: status,
                        changedAt: new Date().toISOString(),
                        changedBy: localStorage.getItem('user_id'),
                        notes
                    }
                }
            }
        });
    }, [updateInvoice, invoiceState.data]);

    /**
     * Marque une facture comme payée
     */
    const markInvoiceAsPaid = useCallback(async (
        invoiceId: string,
        paymentInfo: {
            amount: number;
            method: string;
            transactionId?: string;
            paymentDate?: Date;
            notes?: string;
        }
    ): Promise<{
        success: boolean;
        invoice?: any;
        error?: string;
    }> => {
        return updateInvoice({
            invoiceId,
            updates: {
                status: INVOICE_STATUS.PAID,
                paymentStatus: 'PAID',
                metadata: {
                    payment: {
                        ...paymentInfo,
                        paymentDate: paymentInfo.paymentDate || new Date(),
                        processedAt: new Date().toISOString()
                    },
                    statusChange: {
                        previousStatus: invoiceState.data?.status,
                        newStatus: INVOICE_STATUS.PAID,
                        changedAt: new Date().toISOString(),
                        changedBy: localStorage.getItem('user_id'),
                        notes: paymentInfo.notes
                    }
                }
            }
        });
    }, [updateInvoice, invoiceState.data]);

    /**
     * Récupère l'historique d'une facture
     */
    const getInvoiceHistory = useCallback(async (invoiceId: string): Promise<{
        success: boolean;
        history?: any[];
        error?: string;
    }> => {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la récupération de l\'historique');
            }

            return {
                success: true,
                history: data.history
            };

        } catch (error: unknown) {
            return {
                success: false,
                error: `Erreur lors du chargement de l'historique: ${getErrorMessage(error)}`
            };
        }
    }, []);

    /**
     * Récupère les statistiques des factures
     */
    const fetchInvoiceStats = useCallback(async (): Promise<{
        success: boolean;
        stats?: any;
        error?: string;
    }> => {
        try {
            const response = await fetch('/api/invoices/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la récupération des statistiques');
            }

            setStats(data.stats);

            return {
                success: true,
                stats: data.stats
            };

        } catch (error: unknown) {
            return {
                success: false,
                error: getErrorMessage(error)
            };
        }
    }, []);

    /**
     * Recherche des factures
     */
    const searchInvoices = useCallback(async (query: string): Promise<{
        success: boolean;
        results?: any[];
        error?: string;
    }> => {
        try {
            const response = await fetch(`/api/invoices/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la recherche');
            }

            return {
                success: true,
                results: data.results
            };

        } catch (error: unknown) {
            return {
                success: false,
                error: getErrorMessage(error)
            };
        }
    }, []);

    /**
     * Duplique une facture
     */
    const duplicateInvoice = useCallback(async (invoiceId: string): Promise<{
        success: boolean;
        newInvoice?: any;
        error?: string;
    }> => {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/duplicate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Échec de la duplication');
            }

            // Ajouter à la liste locale
            setInvoices(prev => [data.invoice, ...prev]);

            return {
                success: true,
                newInvoice: data.invoice
            };

        } catch (error: unknown) {
            return {
                success: false,
                error: getErrorMessage(error)
            };
        }
    }, []);

    /**
     * Exporte les factures
     */
    const exportInvoices = useCallback(async (
        format: 'CSV' | 'EXCEL' | 'PDF',
        filters?: InvoiceFilterOptions
    ): Promise<{
        success: boolean;
        blob?: Blob;
        url?: string;
        error?: string;
    }> => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('format', format);

            if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString());
            if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());
            if (filters?.status) queryParams.append('status', filters.status);

            const response = await fetch(`/api/invoices/export?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Échec de l\'export');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            return {
                success: true,
                blob,
                url
            };

        } catch (error: unknown) {
            return {
                success: false,
                error: `Erreur lors de l'export: ${getErrorMessage(error)}`
            };
        }
    }, []);

    /**
     * Formate un montant selon la devise
     */
    const formatAmount = useCallback((amount: number, currency: string = 'XAF'): string => {
        return formatCurrency(amount, currency, 'fr');
    }, []);

    /**
     * Vérifie si une facture est en retard
     */
    const isInvoiceOverdueCheck = useCallback((invoice: any): boolean => {
        if (!invoice?.invoiceDate || !invoice?.dueDate) return false;
        return isInvoiceOverdue(
            new Date(invoice.invoiceDate),
            new Date(invoice.dueDate),
            invoice.status
        );
    }, []);

    /**
     * Calcule le solde d'une facture
     */
    const calculateBalance = useCallback((invoice: any): number => {
        return calculateInvoiceBalance(
            invoice.totals?.total || 0,
            invoice.payments?.totalPaid || 0,
            invoice.totals?.totalDiscount || 0
        );
    }, []);

    /**
     * Réinitialise l'état du hook
     */
    const resetState = useCallback(() => {
        setInvoiceState({
            isLoading: false,
            isSaving: false,
            isGeneratingPDF: false,
            isSending: false,
            isSuccess: false,
            isError: false,
            message: '',
            data: null,
            error: null
        });
    }, []);

    /**
     * Démarre le rafraîchissement automatique
     */
    const startAutoRefresh = useCallback(() => {
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
        }

        refreshIntervalRef.current = setInterval(() => {
            fetchInvoices({
                page: pagination.page,
                limit: pagination.limit
            });
        }, config.refreshInterval);
    }, [config.refreshInterval, fetchInvoices, pagination.page, pagination.limit]);

    /**
     * Arrête le rafraîchissement automatique
     */
    const stopAutoRefresh = useCallback(() => {
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
    }, []);

    // Initialisation au montage
    useEffect(() => {
        fetchInvoices({
            page: 1,
            limit: 10
        });

        fetchInvoiceStats();

        if (config.autoRefresh) {
            startAutoRefresh();
        }

        // Nettoyage à la destruction
        return () => {
            stopAutoRefresh();
        };
    }, [config.autoRefresh, startAutoRefresh, stopAutoRefresh, fetchInvoices, fetchInvoiceStats]);

    // Gestion des paramètres d'URL
    useEffect(() => {
        const { invoice_id } = router.query;

        if (invoice_id && typeof invoice_id === 'string') {
            fetchInvoiceById(invoice_id);
        }
    }, [router.query, fetchInvoiceById]);

    return {
        // États
        invoiceState,
        invoices,
        pagination,
        stats,

        // Méthodes principales
        fetchInvoices,
        fetchInvoiceById,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        generateInvoicePDF,
        sendInvoiceByEmail,
        changeInvoiceStatus,
        markInvoiceAsPaid,

        // Méthodes supplémentaires
        getInvoiceHistory,
        fetchInvoiceStats,
        searchInvoices,
        duplicateInvoice,
        exportInvoices,

        // Utilitaires
        validateInvoiceData,
        calculateInvoiceTotals,
        formatAmount,
        isInvoiceOverdue: isInvoiceOverdueCheck,
        calculateBalance,
        generateUniqueInvoiceNumber,

        // Contrôle du rafraîchissement
        startAutoRefresh,
        stopAutoRefresh,
        resetState,

        // États dérivés
        isLoading: invoiceState.isLoading,
        isSaving: invoiceState.isSaving,
        isGeneratingPDF: invoiceState.isGeneratingPDF,
        isSending: invoiceState.isSending,
        isSuccess: invoiceState.isSuccess,
        isError: invoiceState.isError,
        message: invoiceState.message,
        error: invoiceState.error,
        currentInvoice: invoiceState.data
    };
};

/**
 * Hook simplifié pour l'utilisation des factures
 */
export const useInvoiceSimple = () => {
    const invoice = useInvoice({
        autoRefresh: false,
        onInvoiceCreated: (invoice) => {
            console.log('Facture créée:', invoice);
            // Notification, redirection, etc.
        },
        onError: (error) => {
            console.error('Erreur de facturation:', error);
            // Affichage d'un message d'erreur
        }
    });

    return invoice;
};

/**
 * Hook pour la création de factures
 */
export const useInvoiceCreation = () => {
    const invoice = useInvoice();
    const [formData, setFormData] = useState<Partial<CreateInvoiceOptions>>({
        type: INVOICE_TYPES.STANDARD,
        currency: 'XAF',
        language: 'fr',
        paymentTerm: 30,
        paymentMethod: INVOICE_PAYMENT_METHODS.BANK_TRANSFER,
        invoiceDate: new Date(),
        items: []
    });

    const addItem = useCallback((item: Omit<InvoiceItem, 'id'>) => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...(prev.items || []),
                {
                    ...item,
                    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                }
            ]
        }));
    }, []);

    const removeItem = useCallback((itemId: string) => {
        setFormData(prev => ({
            ...prev,
            items: (prev.items || []).filter(item => item.id !== itemId)
        }));
    }, []);

    const updateItem = useCallback((itemId: string, updates: Partial<InvoiceItem>) => {
        setFormData(prev => ({
            ...prev,
            items: (prev.items || []).map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            )
        }));
    }, []);

    const submitInvoice = useCallback(async (customer: CustomerInfo) => {
        if (!formData.items || formData.items.length === 0) {
            throw new Error('Ajoutez au moins un article');
        }

        return invoice.createInvoice({
            ...formData as CreateInvoiceOptions,
            customer
        });
    }, [formData, invoice]);

    return {
        ...invoice,
        formData,
        setFormData,
        addItem,
        removeItem,
        updateItem,
        submitInvoice,
        totals: formData.items ? invoice.calculateInvoiceTotals(formData.items) : null
    };
};

/**
 * Hook pour la gestion des clients dans les factures
 */
export const useInvoiceCustomers = () => {
    const [customers, setCustomers] = useState<CustomerInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/customers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setCustomers(data.customers);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des clients:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addCustomer = useCallback((customer: CustomerInfo) => {
        setCustomers(prev => [...prev, customer]);
    }, []);

    const updateCustomer = useCallback((customerId: string, updates: Partial<CustomerInfo>) => {
        setCustomers(prev => prev.map(customer =>
            customer.id === customerId ? { ...customer, ...updates } : customer
        ));
    }, []);

    const deleteCustomer = useCallback((customerId: string) => {
        setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    }, []);

    return {
        customers,
        loading,
        fetchCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer
    };
};

export default useInvoice;