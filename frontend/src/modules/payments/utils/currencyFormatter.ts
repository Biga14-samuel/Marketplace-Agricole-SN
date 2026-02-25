// @ts-nocheck
import { getErrorMessage } from '@/shared/utils/error-handler';
// currencyFormatter.ts

/**
 * Formateur de monnaie XAF (Franc CFA d'Afrique centrale)
 * Le XAF n'a pas de décimales et s'arrondit à l'unité
 */

export interface CurrencyFormatOptions {
    /** Afficher le symbole (ex: FCFA) */
    showSymbol?: boolean;
    /** Afficher le code de la devise (ex: XAF) */
    showCode?: boolean;
    /** Séparateur de milliers (par défaut: espace) */
    thousandsSeparator?: string;
    /** Position du symbole (before|after) */
    symbolPosition?: 'before' | 'after';
    /** Langue pour le formatage */
    locale?: string;
    /** Format compact (ex: 1k, 1M) */
    compact?: boolean;
    /** Afficher les décimales si zéro (ex: 500,00) */
    alwaysShowDecimals?: boolean;
    /** Arrondi personnalisé (par défaut: arrondi à l'unité pour XAF) */
    rounding?: 'ceil' | 'floor' | 'round';
}

export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
    /** Indique si la devise a des décimales */
    hasDecimals: boolean;
    /** Nombre de décimales standard */
    decimalDigits: number;
    /** Taux de change par rapport au XAF */
    exchangeRate?: number;
}

export interface ConvertedAmount {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    date: Date;
}

export class CurrencyFormatter {
    private static readonly CURRENCIES: Map<string, CurrencyInfo> = new Map([
        ['XAF', {
            code: 'XAF',
            symbol: 'FCFA',
            name: 'Franc CFA d\'Afrique centrale',
            hasDecimals: false,
            decimalDigits: 0
        }]
    ]);

    private static readonly XAF_EXCHANGE_RATES: Map<string, number> = new Map();

    private defaultOptions: CurrencyFormatOptions = {
        showSymbol: true,
        showCode: false,
        thousandsSeparator: ' ',
        symbolPosition: 'after',
        locale: 'fr-FR',
        compact: false,
        alwaysShowDecimals: false,
        rounding: 'round'
    };

    constructor(private options?: Partial<CurrencyFormatOptions>) {
        this.options = { ...this.defaultOptions, ...options };
    }

    /**
     * Formate un montant en XAF selon les options spécifiées
     */
    formatXAF(amount: number | string, customOptions?: Partial<CurrencyFormatOptions>): string {
        const options = { ...this.options, ...customOptions };
        const numAmount = typeof amount === 'string' ? this.parse(amount) : amount;

        if (isNaN(numAmount)) {
            throw new Error('Montant invalide');
        }

        const roundedAmount = this.roundToXAF(numAmount, options.rounding!);

        if (options.compact) {
            return this.formatCompact(roundedAmount, 'XAF', options);
        }

        return this.formatStandard(roundedAmount, 'XAF', options);
    }

    /**
     * Formate un montant pour n'importe quelle devise
     */
    format(amount: number | string, currencyCode: string, customOptions?: Partial<CurrencyFormatOptions>): string {
        const currency = CurrencyFormatter.CURRENCIES.get(currencyCode.toUpperCase());

        if (!currency) {
            throw new Error(`Devise non supportée: ${currencyCode}`);
        }

        const options = { ...this.options, ...customOptions };
        const numAmount = typeof amount === 'string' ? this.parse(amount, currencyCode) : amount;

        if (isNaN(numAmount)) {
            throw new Error('Montant invalide');
        }

        const roundedAmount = this.roundToCurrency(numAmount, currency, options.rounding!);

        if (options.compact) {
            return this.formatCompact(roundedAmount, currencyCode, options);
        }

        return this.formatStandard(roundedAmount, currencyCode, options);
    }

    /**
     * Formatage standard
     */
    private formatStandard(amount: number, currencyCode: string, options: CurrencyFormatOptions): string {
        const currency = CurrencyFormatter.CURRENCIES.get(currencyCode)!;

        // Préparation du nombre
        let formattedNumber: string;

        if (currency.hasDecimals || options.alwaysShowDecimals) {
            formattedNumber = this.formatWithDecimals(amount, currency.decimalDigits, options.thousandsSeparator!);
        } else {
            formattedNumber = this.formatWithoutDecimals(amount, options.thousandsSeparator!);
        }

        // Ajout du symbole/code
        return this.addCurrencySymbol(formattedNumber, currency, options);
    }

    /**
     * Formatage compact (k, M, B, etc.)
     */
    private formatCompact(amount: number, currencyCode: string, options: CurrencyFormatOptions): string {
        const currency = CurrencyFormatter.CURRENCIES.get(currencyCode)!;

        const { value, suffix } = this.compressNumber(amount);
        let formattedValue: string;

        if (currency.hasDecimals && Math.abs(value) >= 1) {
            formattedValue = value.toFixed(1).replace('.', ',');
        } else {
            formattedValue = Math.round(value).toString();
        }

        const formattedNumber = formattedValue + suffix;
        return this.addCurrencySymbol(formattedNumber, currency, options);
    }

    /**
     * Compression du nombre pour format compact
     */
    private compressNumber(amount: number): { value: number; suffix: string } {
        const absAmount = Math.abs(amount);

        if (absAmount >= 1e12) {
            return { value: amount / 1e12, suffix: 'B' }; // Billion (milliard)
        } else if (absAmount >= 1e9) {
            return { value: amount / 1e9, suffix: 'Md' }; // Milliard
        } else if (absAmount >= 1e6) {
            return { value: amount / 1e6, suffix: 'M' }; // Million
        } else if (absAmount >= 1e3) {
            return { value: amount / 1e3, suffix: 'k' }; // Mille
        }

        return { value: amount, suffix: '' };
    }

    /**
     * Formatage avec décimales
     */
    private formatWithDecimals(amount: number, decimalDigits: number, separator: string): string {
        const fixedAmount = amount.toFixed(decimalDigits);
        const parts = fixedAmount.split('.');
        let integerPart = parts[0];
        const decimalPart = parts[1] || '';

        // Ajout des séparateurs de milliers
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

        if (decimalDigits > 0) {
            const paddedDecimal = decimalPart.padEnd(decimalDigits, '0');
            return `${integerPart},${paddedDecimal}`;
        }

        return integerPart;
    }

    /**
     * Formatage sans décimales
     */
    private formatWithoutDecimals(amount: number, separator: string): string {
        const roundedAmount = Math.round(amount);
        return roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    /**
     * Ajoute le symbole ou code de la devise
     */
    private addCurrencySymbol(formattedNumber: string, currency: CurrencyInfo, options: CurrencyFormatOptions): string {
        const symbolOrCode = options.showCode ? currency.code : currency.symbol;

        if (!options.showSymbol && !options.showCode) {
            return formattedNumber;
        }

        if (options.symbolPosition === 'before') {
            return `${symbolOrCode} ${formattedNumber}`;
        } else {
            return `${formattedNumber} ${symbolOrCode}`;
        }
    }

    /**
     * Arrondi spécifique pour le XAF (pas de décimales)
     */
    private roundToXAF(amount: number, rounding: 'ceil' | 'floor' | 'round'): number {
        switch (rounding) {
            case 'ceil':
                return Math.ceil(amount);
            case 'floor':
                return Math.floor(amount);
            case 'round':
            default:
                return Math.round(amount);
        }
    }

    /**
     * Arrondi pour une devise spécifique
     */
    private roundToCurrency(amount: number, currency: CurrencyInfo, rounding: 'ceil' | 'floor' | 'round'): number {
        if (!currency.hasDecimals) {
            return this.roundToXAF(amount, rounding);
        }

        const factor = Math.pow(10, currency.decimalDigits);

        switch (rounding) {
            case 'ceil':
                return Math.ceil(amount * factor) / factor;
            case 'floor':
                return Math.floor(amount * factor) / factor;
            case 'round':
            default:
                return Math.round(amount * factor) / factor;
        }
    }

    /**
     * Convertit une chaîne formatée en nombre
     */
    parse(formattedAmount: string, currencyCode: string = 'XAF'): number {
        // Nettoyage de la chaîne
        const cleanAmount = formattedAmount
            .replace(/[^\d,-]/g, '')  // Garde seulement chiffres, virgule et tiret
            .replace(/,/g, '.')       // Remplace virgule par point pour parseFloat
            .replace(/ /g, '');       // Supprime les espaces

        const amount = parseFloat(cleanAmount);

        if (isNaN(amount)) {
            throw new Error('Impossible de parser le montant');
        }

        // Pour le XAF, on arrondit à l'unité
        const currency = CurrencyFormatter.CURRENCIES.get(currencyCode.toUpperCase());
        if (currency && !currency.hasDecimals) {
            return Math.round(amount);
        }

        return amount;
    }

    /**
     * Convertit un montant d'une devise vers le XAF
     */
    convertToXAF(amount: number, fromCurrency: string): ConvertedAmount {
        if (fromCurrency.toUpperCase() === 'XAF') {
            return {
                amount: Math.round(amount),
                fromCurrency,
                toCurrency: 'XAF',
                rate: 1,
                date: new Date()
            };
        }

        const rate = CurrencyFormatter.XAF_EXCHANGE_RATES.get(fromCurrency.toUpperCase());

        if (!rate) {
            throw new Error(`Taux de change non disponible pour ${fromCurrency}`);
        }

        const convertedAmount = amount / rate; // Note: le taux est donné pour 1 XAF

        return {
            amount: Math.round(convertedAmount), // XAF n'a pas de décimales
            fromCurrency,
            toCurrency: 'XAF',
            rate,
            date: new Date()
        };
    }

    /**
     * Convertit un montant du XAF vers une autre devise
     */
    convertFromXAF(amount: number, toCurrency: string): ConvertedAmount {
        if (toCurrency.toUpperCase() === 'XAF') {
            return {
                amount: Math.round(amount),
                fromCurrency: 'XAF',
                toCurrency,
                rate: 1,
                date: new Date()
            };
        }

        const rate = CurrencyFormatter.XAF_EXCHANGE_RATES.get(toCurrency.toUpperCase());

        if (!rate) {
            throw new Error(`Taux de change non disponible pour ${toCurrency}`);
        }

        const convertedAmount = amount * rate;
        const currency = CurrencyFormatter.CURRENCIES.get(toCurrency.toUpperCase());

        return {
            amount: currency?.hasDecimals ? convertedAmount : Math.round(convertedAmount),
            fromCurrency: 'XAF',
            toCurrency,
            rate,
            date: new Date()
        };
    }

    /**
     * Obtient les informations d'une devise
     */
    getCurrencyInfo(currencyCode: string): CurrencyInfo {
        const currency = CurrencyFormatter.CURRENCIES.get(currencyCode.toUpperCase());

        if (!currency) {
            throw new Error(`Devise inconnue: ${currencyCode}`);
        }

        return currency;
    }

    /**
     * Liste toutes les devises supportées
     */
    getAllCurrencies(): CurrencyInfo[] {
        return Array.from(CurrencyFormatter.CURRENCIES.values());
    }

    /**
     * Ajoute une devise personnalisée
     */
    static addCurrency(currency: CurrencyInfo): void {
        CurrencyFormatter.CURRENCIES.set(currency.code.toUpperCase(), currency);
    }

    /**
     * Met à jour un taux de change
     */
    static updateExchangeRate(fromCurrency: string, toCurrency: string, rate: number): void {
        // Pour simplifier, nous stockons les taux par rapport au XAF
        if (toCurrency.toUpperCase() === 'XAF') {
            CurrencyFormatter.XAF_EXCHANGE_RATES.set(fromCurrency.toUpperCase(), rate);
        }
    }

    /**
     * Formate un montant en XAF avec le format standard pour l'Afrique centrale
     * Méthode utilitaire rapide
     */
    static formatXAFSimple(amount: number): string {
        const formatter = new CurrencyFormatter();
        return formatter.formatXAF(amount);
    }

    /**
     * Formate un montant avec le style comptabilité (nombres entre parenthèses pour les négatifs)
     */
    formatAccounting(amount: number, currencyCode: string = 'XAF'): string {
        const absAmount = Math.abs(amount);
        const formatted = this.format(absAmount, currencyCode, {
            showSymbol: true,
            symbolPosition: 'after'
        });

        return amount < 0 ? `(${formatted})` : formatted;
    }

    /**
     * Décompose un montant en billets et pièces
     */
    breakDownAmount(amount: number, currencyCode: string = 'XAF'): Map<number, number> {
        const currency = this.getCurrencyInfo(currencyCode);
        const roundedAmount = this.roundToCurrency(amount, currency, 'floor');

        // Valeurs courantes pour le XAF (en unités)
        const denominations = currencyCode === 'XAF'
            ? [10000, 5000, 2000, 1000, 500, 100, 50, 25, 10, 5, 1]
            : [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];

        const breakdown = new Map<number, number>();
        let remaining = roundedAmount;

        for (const denomination of denominations) {
            if (denomination <= remaining) {
                const count = Math.floor(remaining / denomination);
                breakdown.set(denomination, count);
                remaining = Math.round((remaining - count * denomination) * 100) / 100;
            }

            if (remaining <= 0) break;
        }

        return breakdown;
    }
}

// Exports additionnels pour une utilisation facile
export const XAF_FORMATTER = new CurrencyFormatter();

export function formatAsXAF(amount: number, options?: Partial<CurrencyFormatOptions>): string {
    return XAF_FORMATTER.formatXAF(amount, options);
}

export function formatCurrencyXAF(amount: number, options?: Partial<CurrencyFormatOptions>): string {
    return XAF_FORMATTER.formatXAF(amount, options);
}

export function formatCurrency(amount: number, options?: Partial<CurrencyFormatOptions>): string {
    return XAF_FORMATTER.formatXAF(amount, options);
}

export function parseXAF(formattedAmount: string): number {
    return XAF_FORMATTER.parse(formattedAmount, 'XAF');
}
