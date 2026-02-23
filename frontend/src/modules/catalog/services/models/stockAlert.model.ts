// module/catalog/services/models/stockAlert.model.ts

import {type CreateStockAlertRequest } from '../api/stockAlerts.api';

export class StockAlert {
    id: string;
    product_id: string;
    threshold: number;
    current_stock?: number;
    is_active: boolean;
    is_triggered: boolean;
    created_at: Date;
    updated_at?: Date;
    triggered_at?: Date;
    notification_sent: boolean;
    notification_count: number;
    last_notification_at?: Date;
    alert_type: StockAlertType;
    severity: StockAlertSeverity;
    product_name?: string;
    product_sku?: string;

    constructor(data: Partial<StockAlert> = {}) {
        this.id = data.id || '';
        this.product_id = data.product_id || '';
        this.threshold = data.threshold || 0;
        this.current_stock = data.current_stock;
        this.is_active = data.is_active ?? true;
        this.is_triggered = data.is_triggered ?? false;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
        this.triggered_at = data.triggered_at ? new Date(data.triggered_at) : undefined;
        this.notification_sent = data.notification_sent ?? false;
        this.notification_count = data.notification_count || 0;
        this.last_notification_at = data.last_notification_at ? new Date(data.last_notification_at) : undefined;
        this.alert_type = data.alert_type || StockAlertType.LOW_STOCK;
        this.severity = data.severity || StockAlertSeverity.MEDIUM;
        this.product_name = data.product_name;
        this.product_sku = data.product_sku;
    }

    // Factory method pour créer une alerte de stock à partir des données de l'API
    static fromApiData(data: any): StockAlert {
        return new StockAlert({
            id: data.id,
            product_id: data.product_id,
            threshold: data.threshold,
            current_stock: data.current_stock,
            is_active: data.is_active,
            is_triggered: data.is_triggered,
            created_at: data.created_at,
            updated_at: data.updated_at,
            triggered_at: data.triggered_at,
            notification_sent: data.notification_sent,
            notification_count: data.notification_count,
            last_notification_at: data.last_notification_at,
            alert_type: data.alert_type,
            severity: data.severity,
            product_name: data.product_name,
            product_sku: data.product_sku,
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateStockAlertRequest {
        return {
            threshold: this.threshold,
            is_active: this.is_active,
        };
    }

    // Vérifier si l'alerte est valide pour la création
    isValidForCreation(): boolean {
        return !!this.product_id && this.threshold >= 0;
    }

    // Vérifier si l'alerte est valide pour la mise à jour
    isValidForUpdate(): boolean {
        return !!this.id && !!this.product_id && this.threshold >= 0;
    }

    // Vérifier si l'alerte est déclenchée en fonction du stock actuel
    checkTrigger(currentStock: number): boolean {
        if (!this.is_active) {
            this.is_triggered = false;
            return false;
        }

        const shouldTrigger = this.shouldTrigger(currentStock);

        if (shouldTrigger && !this.is_triggered) {
            // Alerte vient d'être déclenchée
            this.is_triggered = true;
            this.triggered_at = new Date();
            this.severity = this.calculateSeverity(currentStock);
        } else if (!shouldTrigger && this.is_triggered) {
            // Alerte n'est plus déclenchée
            this.is_triggered = false;
            this.triggered_at = undefined;
        } else if (shouldTrigger && this.is_triggered) {
            // Alerte toujours déclenchée, mettre à jour la sévérité
            this.severity = this.calculateSeverity(currentStock);
        }

        return shouldTrigger;
    }

    // Déterminer si l'alerte devrait être déclenchée
    private shouldTrigger(currentStock: number): boolean {
        switch (this.alert_type) {
            case StockAlertType.LOW_STOCK:
                return currentStock <= this.threshold && currentStock > 0;
            case StockAlertType.OUT_OF_STOCK:
                return currentStock === 0;
            case StockAlertType.CRITICAL_STOCK:
                return currentStock <= this.threshold * 0.3 && currentStock > 0;
            case StockAlertType.OVERSTOCK:
                return currentStock >= this.threshold * 1.5;
            default:
                return currentStock <= this.threshold;
        }
    }

    // Calculer la sévérité en fonction du stock
    private calculateSeverity(currentStock: number): StockAlertSeverity {
        if (currentStock === 0) {
            return StockAlertSeverity.CRITICAL;
        }

        const percentage = (currentStock / this.threshold) * 100;

        if (percentage <= 10) return StockAlertSeverity.CRITICAL;
        if (percentage <= 30) return StockAlertSeverity.HIGH;
        if (percentage <= 50) return StockAlertSeverity.MEDIUM;
        return StockAlertSeverity.LOW;
    }

    // Marquer la notification comme envoyée
    markNotificationSent(): void {
        this.notification_sent = true;
        this.notification_count += 1;
        this.last_notification_at = new Date();
        this.updated_at = new Date();
    }

    // Réinitialiser les notifications
    resetNotifications(): void {
        this.notification_sent = false;
        this.notification_count = 0;
        this.last_notification_at = undefined;
        this.updated_at = new Date();
    }

    // Activer l'alerte
    activate(): void {
        this.is_active = true;
        this.updated_at = new Date();
    }

    // Désactiver l'alerte
    deactivate(): void {
        this.is_active = false;
        this.is_triggered = false;
        this.updated_at = new Date();
    }

    // Basculer l'état actif/inactif
    toggleActive(): void {
        this.is_active = !this.is_active;
        if (!this.is_active) {
            this.is_triggered = false;
        }
        this.updated_at = new Date();
    }

    // Obtenir le statut formaté
    getStatus(): string {
        if (!this.is_active) return 'Inactive';
        return this.is_triggered ? 'Triggered' : 'Active';
    }

    // Obtenir le type d'alerte formaté
    getAlertTypeFormatted(): string {
        const typeNames: Record<StockAlertType, string> = {
            [StockAlertType.LOW_STOCK]: 'Stock Bas',
            [StockAlertType.OUT_OF_STOCK]: 'Rupture de Stock',
            [StockAlertType.CRITICAL_STOCK]: 'Stock Critique',
            [StockAlertType.OVERSTOCK]: 'Surstock',
            [StockAlertType.CUSTOM]: 'Personnalisée',
        };
        return typeNames[this.alert_type] || this.alert_type;
    }

    // Obtenir la sévérité formatée
    getSeverityFormatted(): string {
        const severityNames: Record<StockAlertSeverity, string> = {
            [StockAlertSeverity.LOW]: 'Basse',
            [StockAlertSeverity.MEDIUM]: 'Moyenne',
            [StockAlertSeverity.HIGH]: 'Élevée',
            [StockAlertSeverity.CRITICAL]: 'Critique',
        };
        return severityNames[this.severity] || this.severity;
    }

    // Obtenir la couleur de la sévérité
    getSeverityColor(): string {
        const colors: Record<StockAlertSeverity, string> = {
            [StockAlertSeverity.LOW]: '#10B981', // Vert
            [StockAlertSeverity.MEDIUM]: '#F59E0B', // Orange
            [StockAlertSeverity.HIGH]: '#EF4444', // Rouge
            [StockAlertSeverity.CRITICAL]: '#7C3AED', // Violet
        };
        return colors[this.severity] || '#6B7280';
    }

    // Obtenir le message d'alerte
    getAlertMessage(currentStock?: number): string {
        const stock = currentStock !== undefined ? currentStock : this.current_stock;

        if (stock === undefined) {
            return `Alerte configurée à ${this.threshold} unités`;
        }

        switch (this.alert_type) {
            case StockAlertType.LOW_STOCK:
                return `Stock bas: ${stock} unités restantes (seuil: ${this.threshold})`;
            case StockAlertType.OUT_OF_STOCK:
                return `Rupture de stock! ${stock} unités restantes`;
            case StockAlertType.CRITICAL_STOCK:
                return `Stock critique: ${stock} unités restantes (seuil: ${this.threshold})`;
            case StockAlertType.OVERSTOCK:
                return `Surstock: ${stock} unités en stock (seuil: ${this.threshold})`;
            default:
                return `Stock: ${stock} unités (seuil: ${this.threshold})`;
        }
    }

    // Obtenir la description de l'alerte
    getDescription(): string {
        return `${this.getAlertTypeFormatted()} - Seuil: ${this.threshold}`;
    }

    // Vérifier si une notification doit être envoyée
    shouldSendNotification(currentStock: number): boolean {
        if (!this.is_active || !this.checkTrigger(currentStock)) {
            return false;
        }

        // Ne pas envoyer de notification si déjà envoyée récemment
        if (this.notification_sent && this.last_notification_at) {
            const hoursSinceLastNotification =
                (new Date().getTime() - this.last_notification_at.getTime()) / (1000 * 60 * 60);

            // Attendre au moins 24 heures avant de renvoyer une notification
            if (hoursSinceLastNotification < 24) {
                return false;
            }
        }

        return true;
    }

    // Cloner l'alerte
    clone(): StockAlert {
        return new StockAlert({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: this.updated_at ? new Date(this.updated_at) : undefined,
            triggered_at: this.triggered_at ? new Date(this.triggered_at) : undefined,
            last_notification_at: this.last_notification_at ? new Date(this.last_notification_at) : undefined,
        });
    }

    // Mettre à jour les propriétés
    update(data: Partial<StockAlert>): void {
        Object.assign(this, data);
        this.updated_at = new Date();
    }

    // Mettre à jour avec les informations du produit
    updateProductInfo(productName: string, productSku: string): void {
        this.product_name = productName;
        this.product_sku = productSku;
        this.updated_at = new Date();
    }
}

// Enums pour les types d'alertes et sévérités
export enum StockAlertType {
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    CRITICAL_STOCK = 'critical_stock',
    OVERSTOCK = 'overstock',
    CUSTOM = 'custom',
}

export enum StockAlertSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

// Interfaces pour les filtres et les réponses
export interface StockAlertFilter {
    product_id?: string;
    is_active?: boolean;
    is_triggered?: boolean;
    alert_type?: StockAlertType;
    severity?: StockAlertSeverity;
    start_date?: Date;
    end_date?: Date;
    min_threshold?: number;
    max_threshold?: number;
}

export interface StockAlertStats {
    total_alerts: number;
    active_alerts: number;
    triggered_alerts: number;
    by_type: Record<StockAlertType, number>;
    by_severity: Record<StockAlertSeverity, number>;
    average_threshold: number;
    notification_count: number;
}

// Helper functions
export const StockAlertHelper = {
    // Filtrer les alertes
    filterAlerts(
        alerts: StockAlert[],
        filter: StockAlertFilter
    ): StockAlert[] {
        return alerts.filter(alert => {
            if (filter.product_id && alert.product_id !== filter.product_id) return false;
            if (filter.is_active !== undefined && alert.is_active !== filter.is_active) return false;
            if (filter.is_triggered !== undefined && alert.is_triggered !== filter.is_triggered) return false;
            if (filter.alert_type && alert.alert_type !== filter.alert_type) return false;
            if (filter.severity && alert.severity !== filter.severity) return false;

            if (filter.start_date && alert.created_at < filter.start_date) return false;
            if (filter.end_date && alert.created_at > filter.end_date) return false;

            if (filter.min_threshold !== undefined && alert.threshold < filter.min_threshold) return false;
            if (filter.max_threshold !== undefined && alert.threshold > filter.max_threshold) return false;

            return true;
        });
    },

    // Trier les alertes
    sortAlerts(
        alerts: StockAlert[],
        sortBy: 'created_at' | 'threshold' | 'severity' | 'product_name' = 'created_at',
        order: 'asc' | 'desc' = 'desc'
    ): StockAlert[] {
        const sorted = [...alerts];

        switch (sortBy) {
            case 'created_at':
                sorted.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
                break;
            case 'threshold':
                sorted.sort((a, b) => a.threshold - b.threshold);
                break;
            case 'severity':
                const severityOrder = {
                    [StockAlertSeverity.CRITICAL]: 4,
                    [StockAlertSeverity.HIGH]: 3,
                    [StockAlertSeverity.MEDIUM]: 2,
                    [StockAlertSeverity.LOW]: 1,
                };
                sorted.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
                break;
            case 'product_name':
                sorted.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
                break;
        }

        return order === 'desc' ? sorted.reverse() : sorted;
    },

    // Grouper les alertes par produit
    groupByProduct(alerts: StockAlert[]): Record<string, StockAlert[]> {
        const groups: Record<string, StockAlert[]> = {};

        alerts.forEach(alert => {
            if (!groups[alert.product_id]) {
                groups[alert.product_id] = [];
            }
            groups[alert.product_id].push(alert);
        });

        return groups;
    },

    // Grouper les alertes par type
    groupByType(alerts: StockAlert[]): Record<StockAlertType, StockAlert[]> {
        const groups: Record<StockAlertType, StockAlert[]> = {
            [StockAlertType.LOW_STOCK]: [],
            [StockAlertType.OUT_OF_STOCK]: [],
            [StockAlertType.CRITICAL_STOCK]: [],
            [StockAlertType.OVERSTOCK]: [],
            [StockAlertType.CUSTOM]: [],
        };

        alerts.forEach(alert => {
            if (groups[alert.alert_type]) {
                groups[alert.alert_type].push(alert);
            }
        });

        return groups;
    },

    // Grouper les alertes par sévérité
    groupBySeverity(alerts: StockAlert[]): Record<StockAlertSeverity, StockAlert[]> {
        const groups: Record<StockAlertSeverity, StockAlert[]> = {
            [StockAlertSeverity.LOW]: [],
            [StockAlertSeverity.MEDIUM]: [],
            [StockAlertSeverity.HIGH]: [],
            [StockAlertSeverity.CRITICAL]: [],
        };

        alerts.forEach(alert => {
            groups[alert.severity].push(alert);
        });

        return groups;
    },

    // Calculer les statistiques des alertes
    calculateStats(alerts: StockAlert[]): StockAlertStats {
        const total_alerts = alerts.length;
        const active_alerts = alerts.filter(alert => alert.is_active).length;
        const triggered_alerts = alerts.filter(alert => alert.is_triggered).length;

        const by_type: Record<StockAlertType, number> = {
            [StockAlertType.LOW_STOCK]: 0,
            [StockAlertType.OUT_OF_STOCK]: 0,
            [StockAlertType.CRITICAL_STOCK]: 0,
            [StockAlertType.OVERSTOCK]: 0,
            [StockAlertType.CUSTOM]: 0,
        };

        const by_severity: Record<StockAlertSeverity, number> = {
            [StockAlertSeverity.LOW]: 0,
            [StockAlertSeverity.MEDIUM]: 0,
            [StockAlertSeverity.HIGH]: 0,
            [StockAlertSeverity.CRITICAL]: 0,
        };

        let total_threshold = 0;
        let total_notifications = 0;

        alerts.forEach(alert => {
            by_type[alert.alert_type]++;
            by_severity[alert.severity]++;
            total_threshold += alert.threshold;
            total_notifications += alert.notification_count;
        });

        const average_threshold = total_alerts > 0 ? total_threshold / total_alerts : 0;

        return {
            total_alerts,
            active_alerts,
            triggered_alerts,
            by_type,
            by_severity,
            average_threshold,
            notification_count: total_notifications,
        };
    },

    // Vérifier les alertes avec un niveau de stock
    checkAlertsWithStock(alerts: StockAlert[], productStock: Record<string, number>): StockAlert[] {
        return alerts.map(alert => {
            const stock = productStock[alert.product_id] || 0;
            const clone = alert.clone();
            clone.checkTrigger(stock);
            clone.current_stock = stock;
            return clone;
        });
    },

    // Obtenir les alertes déclenchées
    getTriggeredAlerts(alerts: StockAlert[]): StockAlert[] {
        return alerts.filter(alert => alert.is_triggered);
    },

    // Obtenir les alertes actives
    getActiveAlerts(alerts: StockAlert[]): StockAlert[] {
        return alerts.filter(alert => alert.is_active);
    },

    // Trouver une alerte par ID
    findById(alerts: StockAlert[], id: string): StockAlert | undefined {
        return alerts.find(alert => alert.id === id);
    },

    // Trouver des alertes par produit
    findByProductId(alerts: StockAlert[], productId: string): StockAlert[] {
        return alerts.filter(alert => alert.product_id === productId);
    },

    // Vérifier si une alerte similaire existe déjà
    similarAlertExists(
        alerts: StockAlert[],
        productId: string,
        alertType: StockAlertType,
        threshold: number,
        excludeId?: string
    ): boolean {
        return alerts.some(alert =>
            alert.product_id === productId &&
            alert.alert_type === alertType &&
            Math.abs(alert.threshold - threshold) < 0.01 && // Tolérance pour les nombres flottants
            (!excludeId || alert.id !== excludeId)
        );
    },

    // Générer des alertes recommandées basées sur l'historique de stock
    generateRecommendedAlerts(
        productId: string,
        stockHistory: Array<{ date: Date; quantity: number }>,
        productName?: string
    ): StockAlert[] {
        if (stockHistory.length === 0) return [];

        const quantities = stockHistory.map(h => h.quantity);
        const avgStock = quantities.reduce((a, b) => a + b, 0) / quantities.length;
        const minStock = Math.min(...quantities);
        const maxStock = Math.max(...quantities);

        const recommendations: StockAlert[] = [];

        // Alerte de stock bas (30% de la moyenne)
        const lowStockThreshold = Math.round(avgStock * 0.3);
        if (lowStockThreshold > 0) {
            recommendations.push(new StockAlert({
                product_id: productId,
                product_name: productName,
                threshold: lowStockThreshold,
                alert_type: StockAlertType.LOW_STOCK,
                severity: StockAlertSeverity.MEDIUM,
            }));
        }

        // Alerte de rupture de stock
        if (minStock === 0) {
            recommendations.push(new StockAlert({
                product_id: productId,
                product_name: productName,
                threshold: 0,
                alert_type: StockAlertType.OUT_OF_STOCK,
                severity: StockAlertSeverity.CRITICAL,
            }));
        }

        // Alerte de stock critique (10% de la moyenne)
        const criticalThreshold = Math.round(avgStock * 0.1);
        if (criticalThreshold > 0) {
            recommendations.push(new StockAlert({
                product_id: productId,
                product_name: productName,
                threshold: criticalThreshold,
                alert_type: StockAlertType.CRITICAL_STOCK,
                severity: StockAlertSeverity.HIGH,
            }));
        }

        return recommendations;
    },

    // Valider les alertes
    validateAlerts(alerts: StockAlert[]): {
        valid: StockAlert[];
        invalid: StockAlert[];
        errors: Array<{ alertId: string; message: string }>;
    } {
        const valid: StockAlert[] = [];
        const invalid: StockAlert[] = [];
        const errors: Array<{ alertId: string; message: string }> = [];

        alerts.forEach(alert => {
            if (alert.isValidForCreation()) {
                valid.push(alert);
            } else {
                invalid.push(alert);
                errors.push({
                    alertId: alert.id || 'nouveau',
                    message: 'Alerte de stock invalide',
                });
            }
        });

        return { valid, invalid, errors };
    },
};

// Classe pour gérer le système d'alertes de stock
export class StockAlertSystem {
    private alerts: Map<string, StockAlert> = new Map();
    private productAlerts: Map<string, StockAlert[]> = new Map();

    constructor(alerts: StockAlert[] = []) {
        alerts.forEach(alert => {
            this.addAlert(alert);
        });
    }

    // Ajouter une alerte
    addAlert(alert: StockAlert): void {
        this.alerts.set(alert.id, alert);
        this.addToProductAlerts(alert);
    }

    // Ajouter une alerte aux alertes du produit
    private addToProductAlerts(alert: StockAlert): void {
        const productAlerts = this.productAlerts.get(alert.product_id) || [];
        productAlerts.push(alert);
        this.productAlerts.set(alert.product_id, productAlerts);
    }

    // Vérifier les alertes pour un produit avec son stock actuel
    checkProductAlerts(productId: string, currentStock: number): StockAlert[] {
        const productAlerts = this.productAlerts.get(productId) || [];
        const updatedAlerts: StockAlert[] = [];

        productAlerts.forEach(alert => {
            const shouldTrigger = alert.checkTrigger(currentStock);
            if (shouldTrigger !== alert.is_triggered) {
                this.alerts.set(alert.id, alert);
                updatedAlerts.push(alert);
            }
        });

        return updatedAlerts;
    }

    // Vérifier toutes les alertes avec les stocks actuels
    checkAllAlerts(productStocks: Record<string, number>): StockAlert[] {
        const updatedAlerts: StockAlert[] = [];

        Object.entries(productStocks).forEach(([productId, stock]) => {
            const triggered = this.checkProductAlerts(productId, stock);
            updatedAlerts.push(...triggered);
        });

        return updatedAlerts;
    }

    // Obtenir les alertes déclenchées
    getTriggeredAlerts(): StockAlert[] {
        return Array.from(this.alerts.values()).filter(alert => alert.is_triggered);
    }

    // Obtenir les alertes actives
    getActiveAlerts(): StockAlert[] {
        return Array.from(this.alerts.values()).filter(alert => alert.is_active);
    }

    // Obtenir les alertes par produit
    getProductAlerts(productId: string): StockAlert[] {
        return this.productAlerts.get(productId) || [];
    }

    // Obtenir une alerte par ID
    getAlert(alertId: string): StockAlert | undefined {
        return this.alerts.get(alertId);
    }

    // Mettre à jour une alerte
    updateAlert(alertId: string, data: Partial<StockAlert>): boolean {
        const alert = this.alerts.get(alertId);
        if (!alert) return false;

        alert.update(data);
        return true;
    }

    // Supprimer une alerte
    removeAlert(alertId: string): boolean {
        const alert = this.alerts.get(alertId);
        if (!alert) return false;

        // Retirer des alertes du produit
        const productAlerts = this.productAlerts.get(alert.product_id);
        if (productAlerts) {
            const filtered = productAlerts.filter(a => a.id !== alertId);
            this.productAlerts.set(alert.product_id, filtered);
        }

        // Retirer de la map principale
        return this.alerts.delete(alertId);
    }

    // Activer/désactiver une alerte
    toggleAlert(alertId: string): boolean {
        const alert = this.alerts.get(alertId);
        if (!alert) return false;

        alert.toggleActive();
        return true;
    }

    // Obtenir les statistiques du système
    getStats(): StockAlertStats {
        const allAlerts = Array.from(this.alerts.values());
        return StockAlertHelper.calculateStats(allAlerts);
    }

    // Filtrer les alertes
    filterAlerts(filter: StockAlertFilter): StockAlert[] {
        const allAlerts = Array.from(this.alerts.values());
        return StockAlertHelper.filterAlerts(allAlerts, filter);
    }

    // Obtenir toutes les alertes
    getAllAlerts(): StockAlert[] {
        return Array.from(this.alerts.values());
    }

    // Vider le système
    clear(): void {
        this.alerts.clear();
        this.productAlerts.clear();
    }

    // Exporter les alertes
    exportAlerts(): StockAlert[] {
        return this.getAllAlerts();
    }

    // Importer les alertes
    importAlerts(alerts: StockAlert[]): void {
        this.clear();
        alerts.forEach(alert => this.addAlert(alert));
    }

    // Générer des alertes recommandées
    generateRecommendedAlerts(
        productId: string,
        stockHistory: Array<{ date: Date; quantity: number }>,
        productName?: string
    ): StockAlert[] {
        return StockAlertHelper.generateRecommendedAlerts(productId, stockHistory, productName);
    }
}

// Types utilitaires pour les composants
export interface StockAlertNotification {
    alert: StockAlert;
    message: string;
    timestamp: Date;
    read: boolean;
}

export interface StockAlertDashboard {
    stats: StockAlertStats;
    triggeredAlerts: StockAlert[];
    recentAlerts: StockAlert[];
    alertsByProduct: Record<string, StockAlert[]>;
    alertsBySeverity: Record<StockAlertSeverity, StockAlert[]>;
}

// Classe pour gérer les notifications d'alertes
export class StockAlertNotificationManager {
    private notifications: StockAlertNotification[] = [];
    private maxNotifications: number = 100;

    // Ajouter une notification
    addNotification(alert: StockAlert): void {
        const notification: StockAlertNotification = {
            alert,
            message: alert.getAlertMessage(),
            timestamp: new Date(),
            read: false,
        };

        this.notifications.unshift(notification);

        // Limiter le nombre de notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        // Marquer l'alerte comme notification envoyée
        alert.markNotificationSent();
    }

    // Marquer une notification comme lue
    markAsRead(alertId: string): void {
        this.notifications.forEach(notification => {
            if (notification.alert.id === alertId) {
                notification.read = true;
            }
        });
    }

    // Marquer toutes les notifications comme lues
    markAllAsRead(): void {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
    }

    // Supprimer une notification
    removeNotification(alertId: string): void {
        this.notifications = this.notifications.filter(
            notification => notification.alert.id !== alertId
        );
    }

    // Supprimer toutes les notifications
    clearAll(): void {
        this.notifications = [];
    }

    // Obtenir les notifications non lues
    getUnreadNotifications(): StockAlertNotification[] {
        return this.notifications.filter(notification => !notification.read);
    }

    // Obtenir toutes les notifications
    getAllNotifications(): StockAlertNotification[] {
        return [...this.notifications];
    }

    // Obtenir le nombre de notifications non lues
    getUnreadCount(): number {
        return this.getUnreadNotifications().length;
    }

    // Filtrer les notifications par sévérité
    filterBySeverity(severity: StockAlertSeverity): StockAlertNotification[] {
        return this.notifications.filter(
            notification => notification.alert.severity === severity
        );
    }

    // Obtenir les notifications récentes
    getRecentNotifications(limit: number = 10): StockAlertNotification[] {
        return this.notifications.slice(0, limit);
    }
}