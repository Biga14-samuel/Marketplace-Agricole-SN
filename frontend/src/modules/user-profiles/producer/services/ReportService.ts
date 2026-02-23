import api from '@/shared/services/api';

export interface ReportOptions {
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel' | 'csv';
    includeDetails?: boolean;
}

export interface SalesReport {
    period: string;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    topProducts: Array<{
        productId: string;
        productName: string;
        quantity: number;
        revenue: number;
    }>;
}

export interface PickupReport {
    period: string;
    totalSlots: number;
    bookedSlots: number;
    occupancyRate: number;
    pickupPoints: Array<{
        pointId: string;
        pointName: string;
        totalSlots: number;
        bookedSlots: number;
        occupancyRate: number;
    }>;
}

export class ReportService {
    static async generateSalesReport(options: ReportOptions): Promise<SalesReport> {
        const response = await api.get('/producer-profiles/reports/sales', {
            params: options
        });
        return response.data;
    }

    static async generatePickupReport(options: ReportOptions): Promise<PickupReport> {
        const response = await api.get('/producer-profiles/reports/pickups', {
            params: options
        });
        return response.data;
    }

    static async downloadReport(type: 'sales' | 'pickups', options: ReportOptions): Promise<Blob> {
        const response = await api.get(`/producer-profiles/reports/${type}/download`, {
            params: options,
            responseType: 'blob'
        });
        return response.data;
    }

    static async getReportHistory(): Promise<Array<{
        id: string;
        type: string;
        createdAt: string;
        downloadUrl: string;
    }>> {
        const response = await api.get('/producer-profiles/reports/history');
        return response.data;
    }

    static downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}