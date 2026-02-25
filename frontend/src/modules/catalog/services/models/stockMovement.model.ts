// module/catalog/services/models/stockMovement.model.ts

export interface StockMovement {
    id: string;
    product_id: string;
    variant_id?: string;
    movement_type: StockMovementType;
    quantity: number;
    previous_quantity: number;
    new_quantity: number;
    reference_id?: string; // ID de commande, transfert, ajustement, etc.
    reference_type?: StockReferenceType;
    adjustment_reason?: string;
    user_id?: string;
    user_name?: string;
    location_id?: string;
    location_name?: string;
    cost_price?: number;
    total_value?: number;
    notes?: string;
    created_at: Date;
    updated_at?: Date;
}

export interface StockAdjustment {
    id: string;
    product_id: string;
    variant_id?: string;
    adjustment_type: 'manual' | 'correction' | 'damaged' | 'expired' | 'other';
    quantity_change: number;
    reason: string;
    user_id?: string;
    created_at: Date;
}

export enum StockMovementType {
    INBOUND = 'inbound',           // Arrivage
    OUTBOUND = 'outbound',         // Sortie
    ADJUSTMENT = 'adjustment',     // Ajustement
    TRANSFER = 'transfer',         // Transfert entre locations
    RESERVATION = 'reservation',   // Réservation
    RELEASE = 'release',           // Libération de réservation
    COUNT = 'count',               // Inventaire
    DAMAGED = 'damaged',           // Détérioré
    EXPIRED = 'expired',           // Périmé
}

export enum StockReferenceType {
    ORDER = 'order',
    TRANSFER = 'transfer',
    ADJUSTMENT = 'adjustment',
    COUNT = 'count',
    PURCHASE_ORDER = 'purchase_order',
    RETURN = 'return',
    DAMAGE = 'damage',
    EXPIRY = 'expiry',
}

export interface CreateStockMovementRequest {
    product_id: string;
    variant_id?: string;
    movement_type: StockMovementType;
    quantity: number;
    reference_id?: string;
    reference_type?: StockReferenceType;
    adjustment_reason?: string;
    location_id?: string;
    cost_price?: number;
    notes?: string;
}

export interface StockMovementFilter {
    product_id?: string;
    variant_id?: string;
    movement_type?: StockMovementType;
    reference_type?: StockReferenceType;
    reference_id?: string;
    user_id?: string;
    location_id?: string;
    start_date?: Date;
    end_date?: Date;
    min_quantity?: number;
    max_quantity?: number;
}

export interface StockMovementStats {
    total_movements: number;
    total_inbound: number;
    total_outbound: number;
    total_adjustments: number;
    net_quantity_change: number;
    total_value_change: number;
    by_movement_type: Record<StockMovementType, number>;
    by_reference_type: Record<StockReferenceType, number>;
    daily_average: number;
    busiest_day?: {
        date: string;
        count: number;
    };
}

export class StockMovementModel {
    id: string;
    product_id: string;
    variant_id?: string;
    movement_type: StockMovementType;
    quantity: number;
    previous_quantity: number;
    new_quantity: number;
    reference_id?: string;
    reference_type?: StockReferenceType;
    adjustment_reason?: string;
    user_id?: string;
    user_name?: string;
    location_id?: string;
    location_name?: string;
    cost_price?: number;
    total_value?: number;
    notes?: string;
    created_at: Date;
    updated_at?: Date;

    constructor(data: Partial<StockMovementModel> = {}) {
        this.id = data.id || '';
        this.product_id = data.product_id || '';
        this.variant_id = data.variant_id;
        this.movement_type = data.movement_type || StockMovementType.ADJUSTMENT;
        this.quantity = data.quantity || 0;
        this.previous_quantity = data.previous_quantity || 0;
        this.new_quantity = data.new_quantity || 0;
        this.reference_id = data.reference_id;
        this.reference_type = data.reference_type;
        this.adjustment_reason = data.adjustment_reason;
        this.user_id = data.user_id;
        this.user_name = data.user_name;
        this.location_id = data.location_id;
        this.location_name = data.location_name;
        this.cost_price = data.cost_price;
        this.total_value = data.total_value || this.calculateTotalValue();
        this.notes = data.notes;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
    }

    // Factory method pour créer un mouvement de stock à partir des données de l'API
    static fromApiData(data: any): StockMovementModel {
        return new StockMovementModel({
            id: data.id,
            product_id: data.product_id,
            variant_id: data.variant_id,
            movement_type: data.movement_type,
            quantity: data.quantity,
            previous_quantity: data.previous_quantity,
            new_quantity: data.new_quantity,
            reference_id: data.reference_id,
            reference_type: data.reference_type,
            adjustment_reason: data.adjustment_reason,
            user_id: data.user_id,
            user_name: data.user_name,
            location_id: data.location_id,
            location_name: data.location_name,
            cost_price: data.cost_price,
            total_value: data.total_value,
            notes: data.notes,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateStockMovementRequest {
        return {
            product_id: this.product_id,
            variant_id: this.variant_id,
            movement_type: this.movement_type,
            quantity: this.quantity,
            reference_id: this.reference_id,
            reference_type: this.reference_type,
            adjustment_reason: this.adjustment_reason,
            location_id: this.location_id,
            cost_price: this.cost_price,
            notes: this.notes,
        };
    }

    // Calculer la valeur totale du mouvement
    calculateTotalValue(): number {
        if (this.cost_price) {
            return Math.abs(this.quantity) * this.cost_price;
        }
        return 0;
    }

    // Vérifier si le mouvement est valide
    isValid(): boolean {
        return (
            !!this.product_id &&
            this.quantity !== 0 &&
            !!this.movement_type &&
            this.previous_quantity >= 0 &&
            this.new_quantity >= 0
        );
    }

    // Vérifier si c'est un mouvement d'entrée (augmentation du stock)
    isInbound(): boolean {
        return this.quantity > 0;
    }

    // Vérifier si c'est un mouvement de sortie (diminution du stock)
    isOutbound(): boolean {
        return this.quantity < 0;
    }

    // Obtenir la quantité absolue (positive)
    getAbsoluteQuantity(): number {
        return Math.abs(this.quantity);
    }

    // Obtenir le type de mouvement formaté pour l'affichage
    getFormattedMovementType(): string {
        const typeNames: Record<StockMovementType, string> = {
            [StockMovementType.INBOUND]: 'Arrivage',
            [StockMovementType.OUTBOUND]: 'Sortie',
            [StockMovementType.ADJUSTMENT]: 'Ajustement',
            [StockMovementType.TRANSFER]: 'Transfert',
            [StockMovementType.RESERVATION]: 'Réservation',
            [StockMovementType.RELEASE]: 'Libération',
            [StockMovementType.COUNT]: 'Inventaire',
            [StockMovementType.DAMAGED]: 'Détérioré',
            [StockMovementType.EXPIRED]: 'Périmé',
        };
        return typeNames[this.movement_type] || this.movement_type;
    }

    // Obtenir le type de référence formaté pour l'affichage
    getFormattedReferenceType(): string {
        if (!this.reference_type) return 'N/A';

        const typeNames: Record<StockReferenceType, string> = {
            [StockReferenceType.ORDER]: 'Commande',
            [StockReferenceType.TRANSFER]: 'Transfert',
            [StockReferenceType.ADJUSTMENT]: 'Ajustement',
            [StockReferenceType.COUNT]: 'Inventaire',
            [StockReferenceType.PURCHASE_ORDER]: 'Commande fournisseur',
            [StockReferenceType.RETURN]: 'Retour',
            [StockReferenceType.DAMAGE]: 'Détérioration',
            [StockReferenceType.EXPIRY]: 'Péremption',
        };
        return typeNames[this.reference_type] || this.reference_type;
    }

    // Obtenir la date formatée
    getFormattedDate(format: 'short' | 'medium' | 'long' = 'medium'): string {
        const date = this.created_at;

        switch (format) {
            case 'short':
                return date.toLocaleDateString();
            case 'medium':
                return date.toLocaleString();
            case 'long':
                return date.toLocaleString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            default:
                return date.toLocaleString();
        }
    }

    // Obtenir la valeur totale formatée
    getFormattedTotalValue(): string {
        if (!this.total_value) return 'N/A';
        return `${this.total_value.toFixed(2)} FCFA`;
    }

    // Obtenir la description du mouvement
    getDescription(): string {
        const quantity = this.getAbsoluteQuantity();
        const direction = this.isInbound() ? 'ajoutée' : 'retirée';
        const productRef = this.variant_id ? `variante ${this.variant_id}` : `produit ${this.product_id}`;

        return `${quantity} unité(s) ${direction} pour le ${productRef}`;
    }

    // Vérifier si le mouvement est lié à une commande
    isOrderRelated(): boolean {
        return this.reference_type === StockReferenceType.ORDER;
    }

    // Vérifier si le mouvement est lié à un ajustement manuel
    isManualAdjustment(): boolean {
        return this.movement_type === StockMovementType.ADJUSTMENT;
    }

    // Cloner le mouvement
    clone(): StockMovementModel {
        return new StockMovementModel({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: this.updated_at ? new Date(this.updated_at) : undefined,
        });
    }

    // Mettre à jour les propriétés
    update(data: Partial<StockMovementModel>): void {
        Object.assign(this, data);
        if (data.quantity !== undefined || data.cost_price !== undefined) {
            this.total_value = this.calculateTotalValue();
        }
        this.updated_at = new Date();
    }

    // Créer un mouvement d'ajustement de stock
    static createAdjustment(
        productId: string,
        variantId: string | undefined,
        quantity: number,
        previousQuantity: number,
        reason: string,
        userId?: string
    ): StockMovementModel {
        const newQuantity = previousQuantity + quantity;
        return new StockMovementModel({
            product_id: productId,
            variant_id: variantId,
            movement_type: StockMovementType.ADJUSTMENT,
            quantity,
            previous_quantity: previousQuantity,
            new_quantity: newQuantity,
            adjustment_reason: reason,
            user_id: userId,
        });
    }

    // Créer un mouvement d'entrée de stock
    static createInbound(
        productId: string,
        variantId: string | undefined,
        quantity: number,
        previousQuantity: number,
        referenceId?: string,
        referenceType?: StockReferenceType
    ): StockMovementModel {
        const newQuantity = previousQuantity + quantity;
        return new StockMovementModel({
            product_id: productId,
            variant_id: variantId,
            movement_type: StockMovementType.INBOUND,
            quantity,
            previous_quantity: previousQuantity,
            new_quantity: newQuantity,
            reference_id: referenceId,
            reference_type: referenceType,
        });
    }

    // Créer un mouvement de sortie de stock
    static createOutbound(
        productId: string,
        variantId: string | undefined,
        quantity: number,
        previousQuantity: number,
        referenceId?: string,
        referenceType?: StockReferenceType
    ): StockMovementModel {
        const newQuantity = previousQuantity - quantity;
        return new StockMovementModel({
            product_id: productId,
            variant_id: variantId,
            movement_type: StockMovementType.OUTBOUND,
            quantity: -quantity,
            previous_quantity: previousQuantity,
            new_quantity: newQuantity,
            reference_id: referenceId,
            reference_type: referenceType,
        });
    }
}

// Helper functions
export const StockMovementHelper = {
    // Filtrer les mouvements
    filterMovements(
        movements: StockMovementModel[],
        filter: StockMovementFilter
    ): StockMovementModel[] {
        return movements.filter(movement => {
            if (filter.product_id && movement.product_id !== filter.product_id) return false;
            if (filter.variant_id && movement.variant_id !== filter.variant_id) return false;
            if (filter.movement_type && movement.movement_type !== filter.movement_type) return false;
            if (filter.reference_type && movement.reference_type !== filter.reference_type) return false;
            if (filter.reference_id && movement.reference_id !== filter.reference_id) return false;
            if (filter.user_id && movement.user_id !== filter.user_id) return false;
            if (filter.location_id && movement.location_id !== filter.location_id) return false;

            if (filter.start_date && movement.created_at < filter.start_date) return false;
            if (filter.end_date && movement.created_at > filter.end_date) return false;

            if (filter.min_quantity !== undefined && Math.abs(movement.quantity) < filter.min_quantity) return false;
            if (filter.max_quantity !== undefined && Math.abs(movement.quantity) > filter.max_quantity) return false;

            return true;
        });
    },

    // Trier les mouvements
    sortMovements(
        movements: StockMovementModel[],
        sortBy: 'created_at' | 'quantity' | 'total_value' | 'product_id' = 'created_at',
        order: 'asc' | 'desc' = 'desc'
    ): StockMovementModel[] {
        const sorted = [...movements];

        switch (sortBy) {
            case 'created_at':
                sorted.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
                break;
            case 'quantity':
                sorted.sort((a, b) => Math.abs(a.quantity) - Math.abs(b.quantity));
                break;
            case 'total_value':
                sorted.sort((a, b) => (a.total_value || 0) - (b.total_value || 0));
                break;
            case 'product_id':
                sorted.sort((a, b) => a.product_id.localeCompare(b.product_id));
                break;
        }

        return order === 'desc' ? sorted.reverse() : sorted;
    },

    // Grouper les mouvements par date
    groupByDate(movements: StockMovementModel[]): Record<string, StockMovementModel[]> {
        const groups: Record<string, StockMovementModel[]> = {};

        movements.forEach(movement => {
            const dateKey = movement.created_at.toISOString().split('T')[0];
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(movement);
        });

        return groups;
    },

    // Grouper les mouvements par type
    groupByMovementType(movements: StockMovementModel[]): Record<StockMovementType, StockMovementModel[]> {
        const groups: Record<StockMovementType, StockMovementModel[]> = {
            [StockMovementType.INBOUND]: [],
            [StockMovementType.OUTBOUND]: [],
            [StockMovementType.ADJUSTMENT]: [],
            [StockMovementType.TRANSFER]: [],
            [StockMovementType.RESERVATION]: [],
            [StockMovementType.RELEASE]: [],
            [StockMovementType.COUNT]: [],
            [StockMovementType.DAMAGED]: [],
            [StockMovementType.EXPIRED]: [],
        };

        movements.forEach(movement => {
            if (groups[movement.movement_type]) {
                groups[movement.movement_type].push(movement);
            }
        });

        return groups;
    },

    // Grouper les mouvements par produit
    groupByProduct(movements: StockMovementModel[]): Record<string, StockMovementModel[]> {
        const groups: Record<string, StockMovementModel[]> = {};

        movements.forEach(movement => {
            const key = movement.variant_id
                ? `${movement.product_id}_${movement.variant_id}`
                : movement.product_id;

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(movement);
        });

        return groups;
    },

    // Calculer les statistiques des mouvements
    calculateStats(movements: StockMovementModel[]): StockMovementStats {
        const total_movements = movements.length;

        let total_inbound = 0;
        let total_outbound = 0;
        let total_adjustments = 0;
        let net_quantity_change = 0;
        let total_value_change = 0;

        const by_movement_type: Record<StockMovementType, number> = {
            [StockMovementType.INBOUND]: 0,
            [StockMovementType.OUTBOUND]: 0,
            [StockMovementType.ADJUSTMENT]: 0,
            [StockMovementType.TRANSFER]: 0,
            [StockMovementType.RESERVATION]: 0,
            [StockMovementType.RELEASE]: 0,
            [StockMovementType.COUNT]: 0,
            [StockMovementType.DAMAGED]: 0,
            [StockMovementType.EXPIRED]: 0,
        };

        const by_reference_type: Record<StockReferenceType, number> = {} as any;

        const dailyCounts: Record<string, number> = {};
        let busiestDay: { date: string; count: number } | undefined;

        movements.forEach(movement => {
            // Calculs par type de mouvement
            by_movement_type[movement.movement_type]++;

            if (movement.isInbound()) {
                total_inbound += movement.getAbsoluteQuantity();
            } else if (movement.isOutbound()) {
                total_outbound += movement.getAbsoluteQuantity();
            }

            if (movement.movement_type === StockMovementType.ADJUSTMENT) {
                total_adjustments++;
            }

            // Changement net de quantité
            net_quantity_change += movement.quantity;

            // Changement de valeur totale
            total_value_change += movement.total_value || 0;

            // Par type de référence
            if (movement.reference_type) {
                by_reference_type[movement.reference_type] =
                    (by_reference_type[movement.reference_type] || 0) + 1;
            }

            // Comptage quotidien
            const dateKey = movement.created_at.toISOString().split('T')[0];
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;

            // Trouver le jour le plus chargé
            if (!busiestDay || dailyCounts[dateKey] > busiestDay.count) {
                busiestDay = { date: dateKey, count: dailyCounts[dateKey] };
            }
        });

        const daysWithData = Object.keys(dailyCounts).length;
        const daily_average = daysWithData > 0 ? total_movements / daysWithData : 0;

        return {
            total_movements,
            total_inbound,
            total_outbound,
            total_adjustments,
            net_quantity_change,
            total_value_change,
            by_movement_type,
            by_reference_type,
            daily_average,
            busiest_day: busiestDay,
        };
    },

    // Calculer l'historique du stock pour un produit/variante
    calculateStockHistory(
        movements: StockMovementModel[],
        productId: string,
        variantId?: string
    ): Array<{
        date: Date;
        quantity: number;
        movement: StockMovementModel;
    }> {
        const filtered = StockMovementHelper.filterMovements(movements, {
            product_id: productId,
            variant_id: variantId,
        });

        const sorted = StockMovementHelper.sortMovements(filtered, 'created_at', 'asc');

        let currentStock = 0;
        const history: Array<{
            date: Date;
            quantity: number;
            movement: StockMovementModel;
        }> = [];

        sorted.forEach(movement => {
            currentStock = movement.new_quantity;
            history.push({
                date: movement.created_at,
                quantity: currentStock,
                movement,
            });
        });

        return history;
    },

    // Obtenir le dernier mouvement pour un produit/variante
    getLastMovement(
        movements: StockMovementModel[],
        productId: string,
        variantId?: string
    ): StockMovementModel | null {
        const filtered = StockMovementHelper.filterMovements(movements, {
            product_id: productId,
            variant_id: variantId,
        });

        const sorted = StockMovementHelper.sortMovements(filtered, 'created_at', 'desc');
        return sorted.length > 0 ? sorted[0] : null;
    },

    // Calculer le coût moyen pondéré (CMUP)
    calculateWeightedAverageCost(movements: StockMovementModel[]): number | null {
        const inboundMovements = movements.filter(m => m.isInbound() && m.cost_price);

        if (inboundMovements.length === 0) return null;

        let totalValue = 0;
        let totalQuantity = 0;

        inboundMovements.forEach(movement => {
            const quantity = movement.getAbsoluteQuantity();
            const value = quantity * (movement.cost_price || 0);
            totalValue += value;
            totalQuantity += quantity;
        });

        return totalQuantity > 0 ? totalValue / totalQuantity : null;
    },

    // Valider une série de mouvements
    validateMovements(movements: StockMovementModel[]): {
        valid: StockMovementModel[];
        invalid: StockMovementModel[];
        errors: Array<{ movementId: string; message: string }>;
    } {
        const valid: StockMovementModel[] = [];
        const invalid: StockMovementModel[] = [];
        const errors: Array<{ movementId: string; message: string }> = [];

        movements.forEach(movement => {
            if (movement.isValid()) {
                valid.push(movement);
            } else {
                invalid.push(movement);
                errors.push({
                    movementId: movement.id || 'nouveau',
                    message: 'Mouvement de stock invalide',
                });
            }
        });

        return { valid, invalid, errors };
    },
};

// Classe pour gérer l'historique des mouvements de stock
export class StockMovementHistoryManager {
    private movements: Map<string, StockMovementModel> = new Map();
    private productHistory: Map<string, StockMovementModel[]> = new Map();

    constructor(movements: StockMovementModel[] = []) {
        movements.forEach(movement => {
            this.movements.set(movement.id, movement);
            this.addToProductHistory(movement);
        });
    }

    // Ajouter un mouvement à l'historique
    addMovement(movement: StockMovementModel): void {
        this.movements.set(movement.id, movement);
        this.addToProductHistory(movement);
    }

    // Ajouter un mouvement à l'historique du produit
    private addToProductHistory(movement: StockMovementModel): void {
        const key = this.getProductHistoryKey(movement.product_id, movement.variant_id);
        const history = this.productHistory.get(key) || [];
        history.push(movement);
        this.productHistory.set(key, history);
    }

    // Obtenir la clé d'historique du produit
    private getProductHistoryKey(productId: string, variantId?: string): string {
        return variantId ? `${productId}_${variantId}` : productId;
    }

    // Obtenir l'historique d'un produit/variante
    getProductHistory(productId: string, variantId?: string): StockMovementModel[] {
        const key = this.getProductHistoryKey(productId, variantId);
        const history = this.productHistory.get(key) || [];
        return StockMovementHelper.sortMovements(history, 'created_at', 'desc');
    }

    // Obtenir le stock actuel basé sur l'historique
    getCurrentStock(productId: string, variantId?: string): number {
        const history = this.getProductHistory(productId, variantId);
        if (history.length === 0) return 0;

        const lastMovement = history[0];
        return lastMovement.new_quantity;
    }

    // Obtenir les mouvements récents
    getRecentMovements(limit: number = 50): StockMovementModel[] {
        const allMovements = Array.from(this.movements.values());
        return StockMovementHelper.sortMovements(allMovements, 'created_at', 'desc')
            .slice(0, limit);
    }

    // Filtrer les mouvements
    filterMovements(filter: StockMovementFilter): StockMovementModel[] {
        const allMovements = Array.from(this.movements.values());
        return StockMovementHelper.filterMovements(allMovements, filter);
    }

    // Obtenir les statistiques
    getStats(filter?: StockMovementFilter): StockMovementStats {
        let movements = Array.from(this.movements.values());

        if (filter) {
            movements = StockMovementHelper.filterMovements(movements, filter);
        }

        return StockMovementHelper.calculateStats(movements);
    }

    // Obtenir un mouvement par ID
    getMovement(movementId: string): StockMovementModel | undefined {
        return this.movements.get(movementId);
    }

    // Supprimer un mouvement
    removeMovement(movementId: string): boolean {
        const movement = this.movements.get(movementId);
        if (!movement) return false;

        // Retirer de l'historique du produit
        const key = this.getProductHistoryKey(movement.product_id, movement.variant_id);
        const productHistory = this.productHistory.get(key);
        if (productHistory) {
            const filtered = productHistory.filter(m => m.id !== movementId);
            this.productHistory.set(key, filtered);
        }

        // Retirer de la map principale
        return this.movements.delete(movementId);
    }

    // Mettre à jour un mouvement
    updateMovement(movementId: string, data: Partial<StockMovementModel>): boolean {
        const movement = this.movements.get(movementId);
        if (!movement) return false;

        movement.update(data);
        return true;
    }

    // Obtenir tous les mouvements
    getAllMovements(): StockMovementModel[] {
        return Array.from(this.movements.values());
    }

    // Vider l'historique
    clear(): void {
        this.movements.clear();
        this.productHistory.clear();
    }

    // Exporter l'historique
    exportHistory(): StockMovementModel[] {
        return this.getAllMovements();
    }

    // Importer l'historique
    importHistory(movements: StockMovementModel[]): void {
        this.clear();
        movements.forEach(movement => this.addMovement(movement));
    }
}

// Classe pour gérer les ajustements de stock en temps réel
export class RealTimeStockAdjuster {
    private movements: StockMovementHistoryManager;

    constructor(movements: StockMovementModel[] = []) {
        this.movements = new StockMovementHistoryManager(movements);
    }

    // Effectuer un ajustement de stock
    adjustStock(
        productId: string,
        variantId: string | undefined,
        quantity: number,
        reason: string,
        userId?: string
    ): StockMovementModel {
        const currentStock = this.movements.getCurrentStock(productId, variantId);
        const movement = StockMovementModel.createAdjustment(
            productId,
            variantId,
            quantity,
            currentStock,
            reason,
            userId
        );

        this.movements.addMovement(movement);
        return movement;
    }

    // Effectuer une entrée de stock
    addStock(
        productId: string,
        variantId: string | undefined,
        quantity: number,
        referenceId?: string,
        referenceType?: StockReferenceType,
        costPrice?: number
    ): StockMovementModel {
        const currentStock = this.movements.getCurrentStock(productId, variantId);
        const movement = StockMovementModel.createInbound(
            productId,
            variantId,
            quantity,
            currentStock,
            referenceId,
            referenceType
        );

        if (costPrice) {
            movement.cost_price = costPrice;
            movement.total_value = movement.calculateTotalValue();
        }

        this.movements.addMovement(movement);
        return movement;
    }

    // Effectuer une sortie de stock
    removeStock(
        productId: string,
        variantId: string | undefined,
        quantity: number,
        referenceId?: string,
        referenceType?: StockReferenceType
    ): StockMovementModel | null {
        const currentStock = this.movements.getCurrentStock(productId, variantId);

        if (currentStock < quantity) {
            return null; // Stock insuffisant
        }

        const movement = StockMovementModel.createOutbound(
            productId,
            variantId,
            quantity,
            currentStock,
            referenceId,
            referenceType
        );

        this.movements.addMovement(movement);
        return movement;
    }

    // Vérifier la disponibilité
    checkAvailability(productId: string, variantId: string | undefined, quantity: number): boolean {
        const currentStock = this.movements.getCurrentStock(productId, variantId);
        return currentStock >= quantity;
    }

    // Obtenir le stock actuel
    getCurrentStock(productId: string, variantId?: string): number {
        return this.movements.getCurrentStock(productId, variantId);
    }

    // Obtenir l'historique complet
    getHistory(): StockMovementHistoryManager {
        return this.movements;
    }

    // Obtenir les mouvements récents
    getRecentMovements(limit: number = 20): StockMovementModel[] {
        return this.movements.getRecentMovements(limit);
    }

    // Obtenir les statistiques
    getStats(): StockMovementStats {
        return this.movements.getStats();
    }

    // Réinitialiser l'ajusteur
    reset(): void {
        this.movements.clear();
    }
}

// Types utilitaires pour les composants
export interface StockMovementTimelineItem {
    date: Date;
    movements: StockMovementModel[];
    netChange: number;
    dayStart: number;
    dayEnd: number;
}

export interface StockLevelAlert {
    product_id: string;
    variant_id?: string;
    current_stock: number;
    threshold: number;
    movement: StockMovementModel;
    alert_type: 'low_stock' | 'out_of_stock' | 'high_stock';
}
