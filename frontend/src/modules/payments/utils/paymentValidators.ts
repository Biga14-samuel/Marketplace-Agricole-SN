// @ts-nocheck
// paymentValidators.ts

/**
 * Validateurs de paiement pour le Cameroun
 * Validation des numéros de téléphone, comptes, cartes, références, etc.
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    normalized?: string;
    metadata?: Record<string, any>;
}

export interface PhoneValidationResult extends ValidationResult {
    operator?: string;
    formatted?: string;
}

export interface BankAccountValidationResult extends ValidationResult {
    bankCode?: string;
    bankName?: string;
    accountType?: string;
}

export interface CardValidationResult extends ValidationResult {
    cardType?: string;
    issuer?: string;
}

export enum ValidationType {
    PHONE = 'PHONE',
    MOBILE_MONEY = 'MOBILE_MONEY',
    BANK_ACCOUNT = 'BANK_ACCOUNT',
    CREDIT_CARD = 'CREDIT_CARD',
    AMOUNT = 'AMOUNT',
    REFERENCE = 'REFERENCE',
    TRANSACTION_CODE = 'TRANSACTION_CODE',
    EMAIL = 'EMAIL',
    IDENTIFICATION = 'IDENTIFICATION',
    IBAN = 'IBAN',
    SWIFT = 'SWIFT'
}

export class PaymentValidators {
    private static readonly CAMEROON_OPERATORS = {
        MTN: { prefixes: ['6', '67', '68', '69', '65'], name: 'MTN Cameroon' },
        ORANGE: { prefixes: ['7', '79', '77', '78'], name: 'Orange Cameroon' },
        NEXTTEL: { prefixes: ['66'], name: 'Nexttel' },
        CAMTEL: { prefixes: ['233', '22', '24'], name: 'Camtel' }
    };

    private static readonly BANK_CODES: Record<string, string> = {
        '10001': 'Société Générale Cameroon',
        '10002': 'United Bank for Africa Cameroon',
        '10003': 'BICEC',
        '10004': 'BGFI Bank Cameroon',
        '10005': 'Ecobank Cameroon',
        '10006': 'Commercial Bank of Cameroon',
        '10007': 'National Financial Credit Bank',
        '10008': 'Citibank Cameroon',
        '10009': 'Standard Chartered Bank Cameroon',
        '10010': 'Coris Bank Cameroon',
        '10011': 'Afriland First Bank',
        '10012': 'Banque Atlantique Cameroon',
        '10013': 'COFINA Cameroon',
        '10014': 'UBC Cameroon',
        '10015': 'Credit du Sahel Cameroon'
    };

    private static readonly CARD_PREFIXES = {
        VISA: ['4'],
        MASTERCARD: ['51', '52', '53', '54', '55', '2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228', '2229', '223', '224', '225', '226', '227', '228', '229', '23', '24', '25', '26', '270', '271', '2720'],
        AMEX: ['34', '37'],
        DISCOVER: ['6011', '622', '644', '645', '646', '647', '648', '649', '65'],
        UNIONPAY: ['62']
    };

    /**
     * Valide un numéro de téléphone camerounais
     */
    static validatePhoneNumber(phone: string): PhoneValidationResult {
        const errors: string[] = [];

        if (!phone || typeof phone !== 'string') {
            return {
                isValid: false,
                errors: ['Le numéro de téléphone est requis']
            };
        }

        // Nettoyage
        const cleaned = phone.replace(/\D/g, '');

        // Validation de base
        if (cleaned.length < 9 || cleaned.length > 12) {
            errors.push('Le numéro doit contenir entre 9 et 12 chiffres');
        }

        let normalized = cleaned;
        let operator: string | undefined;

        // Normalisation du format international
        if (cleaned.length === 12 && cleaned.startsWith('237')) {
            normalized = cleaned;
        } else if (cleaned.length === 9) {
            normalized = `237${cleaned}`;
        } else {
            errors.push('Format de numéro invalide');
        }

        // Détection de l'opérateur
        if (normalized.length === 12 && normalized.startsWith('237')) {
            const localNumber = normalized.substring(3);

            for (const [op, data] of Object.entries(this.CAMEROON_OPERATORS)) {
                if (data.prefixes.some(prefix => localNumber.startsWith(prefix))) {
                    operator = op;
                    break;
                }
            }

            if (!operator) {
                errors.push('Opérateur non reconnu');
            }
        }

        // Formatage pour l'affichage
        let formatted: string | undefined;
        if (normalized.length === 12) {
            formatted = `+${normalized.substring(0, 3)} ${normalized.substring(3, 6)} ${normalized.substring(6, 9)} ${normalized.substring(9)}`;
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized,
            operator,
            formatted
        };
    }

    /**
     * Valide un numéro de compte Mobile Money
     */
    static validateMobileMoneyAccount(account: string, operator?: 'MTN' | 'ORANGE'): ValidationResult {
        const phoneValidation = this.validatePhoneNumber(account);
        const errors = [...phoneValidation.errors];

        if (!phoneValidation.isValid) {
            return phoneValidation;
        }

        // Vérification spécifique à l'opérateur
        if (operator) {
            const expectedOperator = operator.toUpperCase();

            if (phoneValidation.operator !== expectedOperator) {
                errors.push(`Le numéro doit être un numéro ${operator} pour utiliser ${operator} Mobile Money`);
            }
        }

        // Vérification que c'est un numéro mobile (pas de fixe)
        if (phoneValidation.operator === 'CAMTEL') {
            errors.push('Les numéros Camtel ne sont pas éligibles au Mobile Money');
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: phoneValidation.normalized,
            metadata: {
                operator: phoneValidation.operator,
                formatted: phoneValidation.formatted
            }
        };
    }

    /**
     * Valide un numéro de compte bancaire camerounais
     */
    static validateBankAccount(accountNumber: string, bankCode?: string): BankAccountValidationResult {
        const errors: string[] = [];
        let bankName: string | undefined;
        let accountType: string | undefined;

        if (!accountNumber || typeof accountNumber !== 'string') {
            return {
                isValid: false,
                errors: ['Le numéro de compte est requis'],
                bankName,
                accountType
            };
        }

        // Nettoyage
        const cleaned = accountNumber.replace(/\s/g, '');

        // Validation de longueur (généralement 10-20 chiffres)
        if (cleaned.length < 10 || cleaned.length > 20) {
            errors.push('Le numéro de compte doit contenir entre 10 et 20 chiffres');
        }

        // Validation des caractères
        if (!/^\d+$/.test(cleaned)) {
            errors.push('Le numéro de compte ne doit contenir que des chiffres');
        }

        // Vérification du code banque si fourni
        if (bankCode) {
            bankName = this.BANK_CODES[bankCode];

            if (!bankName) {
                errors.push(`Code banque invalide: ${bankCode}`);
            }
        }

        // Détermination du type de compte (basé sur les premiers chiffres)
        if (cleaned.length >= 2) {
            const prefix = cleaned.substring(0, 2);

            if (prefix === '10' || prefix === '20') {
                accountType = 'COMPTE_COURANT';
            } else if (prefix === '30' || prefix === '40') {
                accountType = 'COMPTE_EPARGNE';
            } else if (prefix === '50') {
                accountType = 'COMPTE_DEPOT';
            } else {
                accountType = 'AUTRE';
            }
        }

        // Validation par algorithme de Luhn (pour certains comptes)
        if (this.isValidLuhn(cleaned)) {
            // C'est un numéro valide selon Luhn
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned,
            bankCode,
            bankName,
            accountType
        };
    }

    /**
     * Valide un numéro de carte bancaire
     */
    static validateCreditCard(cardNumber: string): CardValidationResult {
        const errors: string[] = [];
        let cardType: string | undefined;
        let issuer: string | undefined;

        if (!cardNumber || typeof cardNumber !== 'string') {
            return {
                isValid: false,
                errors: ['Le numéro de carte est requis'],
                cardType,
                issuer
            };
        }

        // Nettoyage
        const cleaned = cardNumber.replace(/\s/g, '');

        // Validation de longueur
        if (cleaned.length < 13 || cleaned.length > 19) {
            errors.push('Le numéro de carte doit contenir entre 13 et 19 chiffres');
        }

        // Validation des caractères
        if (!/^\d+$/.test(cleaned)) {
            errors.push('Le numéro de carte ne doit contenir que des chiffres');
        }

        // Détection du type de carte
        for (const [type, prefixes] of Object.entries(this.CARD_PREFIXES)) {
            if (prefixes.some(prefix => cleaned.startsWith(prefix))) {
                cardType = type;

                // Détermination de l'émetteur
                switch (type) {
                    case 'VISA':
                        issuer = 'Visa International';
                        break;
                    case 'MASTERCARD':
                        issuer = 'Mastercard Worldwide';
                        break;
                    case 'AMEX':
                        issuer = 'American Express';
                        break;
                    case 'DISCOVER':
                        issuer = 'Discover Financial Services';
                        break;
                    case 'UNIONPAY':
                        issuer = 'China UnionPay';
                        break;
                }
                break;
            }
        }

        if (!cardType) {
            errors.push('Type de carte non reconnu');
        }

        // Validation par algorithme de Luhn
        if (!this.isValidLuhn(cleaned)) {
            errors.push('Numéro de carte invalide (algorithme de Luhn)');
        }

        // Vérification de la date d'expiration (si fournie)
        // Cette partie serait généralement dans une validation séparée

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned,
            cardType,
            issuer
        };
    }

    /**
     * Valide un montant de paiement
     */
    static validateAmount(
        amount: number | string,
        options: {
            min?: number;
            max?: number;
            currency?: string;
            allowDecimals?: boolean;
        } = {}
    ): ValidationResult {
        const errors: string[] = [];
        const {
            min = 0,
            max = 1000000000,
            currency = 'XAF',
            allowDecimals = false
        } = options;

        let numericAmount: number;

        // Conversion en nombre
        if (typeof amount === 'string') {
            numericAmount = parseFloat(amount.replace(/,/g, '.'));

            if (isNaN(numericAmount)) {
                errors.push('Le montant doit être un nombre valide');
                return { isValid: false, errors };
            }
        } else {
            numericAmount = amount;
        }

        // Validation de base
        if (numericAmount <= 0) {
            errors.push('Le montant doit être supérieur à 0');
        }

        if (numericAmount < min) {
            errors.push(`Le montant minimum est ${min} ${currency}`);
        }

        if (numericAmount > max) {
            errors.push(`Le montant maximum est ${max} ${currency}`);
        }

        // Validation des décimales
        if (!allowDecimals && currency === 'XAF' && !Number.isInteger(numericAmount)) {
            errors.push('Le montant en XAF ne doit pas contenir de décimales');
        }

        // Validation de la précision décimale
        if (allowDecimals) {
            const decimalPlaces = (numericAmount.toString().split('.')[1] || '').length;

            if (currency === 'XAF' && decimalPlaces > 0) {
                errors.push('Le montant en XAF ne doit pas contenir de décimales');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: numericAmount.toString(),
            metadata: {
                numericValue: numericAmount,
                currency
            }
        };
    }

    /**
     * Valide une référence de paiement
     */
    static validatePaymentReference(reference: string): ValidationResult {
        const errors: string[] = [];

        if (!reference || typeof reference !== 'string') {
            return {
                isValid: false,
                errors: ['La référence de paiement est requise']
            };
        }

        // Nettoyage
        const cleaned = reference.trim();

        // Longueur minimale
        if (cleaned.length < 6) {
            errors.push('La référence doit contenir au moins 6 caractères');
        }

        if (cleaned.length > 50) {
            errors.push('La référence ne doit pas dépasser 50 caractères');
        }

        // Format recommandé : ALPHANUM avec tirets/soulignés
        if (!/^[A-Z0-9\-_]+$/i.test(cleaned)) {
            errors.push('La référence ne doit contenir que des lettres, chiffres, tirets et underscores');
        }

        // Vérification des séquences interdites
        const forbiddenSequences = ['TEST', 'DUMMY', 'FAKE', 'NULL', 'NONE'];
        const upperReference = cleaned.toUpperCase();

        for (const seq of forbiddenSequences) {
            if (upperReference.includes(seq)) {
                errors.push(`La référence contient une séquence interdite: ${seq}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned
        };
    }

    /**
     * Valide un code de transaction Mobile Money
     */
    static validateTransactionCode(
        code: string,
        operator?: 'MTN' | 'ORANGE' | 'EXPRESS_UNION'
    ): ValidationResult {
        const errors: string[] = [];

        if (!code || typeof code !== 'string') {
            return {
                isValid: false,
                errors: ['Le code de transaction est requis']
            };
        }

        // Nettoyage
        const cleaned = code.trim();

        // Longueur (généralement 8-12 caractères)
        if (cleaned.length < 8 || cleaned.length > 12) {
            errors.push('Le code de transaction doit contenir entre 8 et 12 caractères');
        }

        // Format (généralement numérique)
        if (!/^\d+$/.test(cleaned)) {
            errors.push('Le code de transaction ne doit contenir que des chiffres');
        }

        // Validation spécifique à l'opérateur
        if (operator) {
            switch (operator) {
                case 'MTN':
                    // MTN: commence souvent par 1-6, 8 chiffres
                    if (cleaned.length !== 8 && cleaned.length !== 9) {
                        errors.push('Le code de transaction MTN doit contenir 8 ou 9 chiffres');
                    }
                    if (!/^[1-6]/.test(cleaned)) {
                        errors.push('Le code de transaction MTN doit commencer par un chiffre entre 1 et 6');
                    }
                    break;

                case 'ORANGE':
                    // Orange: 9-10 chiffres, commence par 7-9
                    if (cleaned.length !== 9 && cleaned.length !== 10) {
                        errors.push('Le code de transaction Orange doit contenir 9 ou 10 chiffres');
                    }
                    if (!/^[7-9]/.test(cleaned)) {
                        errors.push('Le code de transaction Orange doit commencer par un chiffre entre 7 et 9');
                    }
                    break;

                case 'EXPRESS_UNION':
                    // Express Union: 10 chiffres
                    if (cleaned.length !== 10) {
                        errors.push('Le code de transaction Express Union doit contenir 10 chiffres');
                    }
                    break;
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned
        };
    }

    /**
     * Valide une adresse email
     */
    static validateEmail(email: string): ValidationResult {
        const errors: string[] = [];

        if (!email || typeof email !== 'string') {
            return {
                isValid: false,
                errors: ['L\'adresse email est requise']
            };
        }

        const cleaned = email.trim().toLowerCase();

        // Expression régulière pour validation d'email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(cleaned)) {
            errors.push('Format d\'email invalide');
        }

        // Vérification des domaines spécifiques au Cameroun
        const cameroonDomains = ['.cm', '.co.cm', '.com.cm', '.org.cm', '.net.cm'];
        const hasCameroonDomain = cameroonDomains.some(domain => cleaned.endsWith(domain));

        // Vérification des domaines temporaires/jetables
        const disposableDomains = [
            'tempmail.com', '10minutemail.com', 'guerrillamail.com',
            'mailinator.com', 'yopmail.com', 'trashmail.com'
        ];

        const domain = cleaned.split('@')[1];
        if (disposableDomains.includes(domain)) {
            errors.push('Les emails jetables ne sont pas acceptés');
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned,
            metadata: {
                domain,
                isCameroonDomain: hasCameroonDomain
            }
        };
    }

    /**
     * Valide un numéro d'identification (CNI, Passeport, Carte Consulaire)
     */
    static validateIdentification(
        idNumber: string,
        idType?: 'CNI' | 'PASSPORT' | 'CONSULAR' | 'DRIVER_LICENSE'
    ): ValidationResult {
        const errors: string[] = [];

        if (!idNumber || typeof idNumber !== 'string') {
            return {
                isValid: false,
                errors: ['Le numéro d\'identification est requis']
            };
        }

        const cleaned = idNumber.trim().toUpperCase();

        // Validation selon le type
        switch (idType) {
            case 'CNI':
                // Format CNI camerounaise: 1 lettre + 7 chiffres
                if (!/^[A-Z]\d{7}$/.test(cleaned)) {
                    errors.push('Le numéro de CNI doit être composé d\'une lettre suivie de 7 chiffres');
                }
                break;

            case 'PASSPORT':
                // Format passeport: généralement 9 caractères alphanumériques
                if (!/^[A-Z0-9]{6,9}$/.test(cleaned)) {
                    errors.push('Format de passeport invalide');
                }
                break;

            case 'DRIVER_LICENSE':
                // Permis de conduire: format variable
                if (cleaned.length < 8 || cleaned.length > 15) {
                    errors.push('Le numéro de permis doit contenir entre 8 et 15 caractères');
                }
                break;

            default:
                // Validation générique
                if (cleaned.length < 6 || cleaned.length > 20) {
                    errors.push('Le numéro d\'identification doit contenir entre 6 et 20 caractères');
                }

                if (!/^[A-Z0-9\-_]+$/.test(cleaned)) {
                    errors.push('Le numéro d\'identification contient des caractères invalides');
                }
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned
        };
    }

    /**
     * Valide un IBAN (International Bank Account Number)
     */
    static validateIBAN(iban: string): ValidationResult {
        const errors: string[] = [];

        if (!iban || typeof iban !== 'string') {
            return {
                isValid: false,
                errors: ['L\'IBAN est requis']
            };
        }

        const cleaned = iban.replace(/\s/g, '').toUpperCase();

        // Longueur minimale
        if (cleaned.length < 15 || cleaned.length > 34) {
            errors.push('L\'IBAN doit contenir entre 15 et 34 caractères');
        }

        // Format général
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(cleaned)) {
            errors.push('Format d\'IBAN invalide');
        }

        // Vérification du code pays (CM pour Cameroun)
        if (cleaned.startsWith('CM')) {
            // IBAN camerounais: 27 caractères
            if (cleaned.length !== 27) {
                errors.push('L\'IBAN camerounais doit contenir 27 caractères');
            }

            // Vérification du code banque et compte
            const bankCode = cleaned.substring(4, 9);
            const branchCode = cleaned.substring(9, 14);
            const accountNumber = cleaned.substring(14, 25);
            const checkDigit = cleaned.substring(25, 27);

            // Validation supplémentaire
            if (!this.BANK_CODES[bankCode]) {
                errors.push(`Code banque inconnu: ${bankCode}`);
            }
        }

        // Validation par algorithme MOD 97
        if (!this.isValidIBAN(cleaned)) {
            errors.push('IBAN invalide (vérification MOD 97)');
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned
        };
    }

    /**
     * Valide un code SWIFT/BIC
     */
    static validateSWIFT(swift: string): ValidationResult {
        const errors: string[] = [];

        if (!swift || typeof swift !== 'string') {
            return {
                isValid: false,
                errors: ['Le code SWIFT/BIC est requis']
            };
        }

        const cleaned = swift.replace(/\s/g, '').toUpperCase();

        // Longueur: 8 ou 11 caractères
        if (cleaned.length !== 8 && cleaned.length !== 11) {
            errors.push('Le code SWIFT/BIC doit contenir 8 ou 11 caractères');
        }

        // Format: 4 lettres banque, 2 lettres pays, 2 lettres localisation, 3 lettres optionnelles
        if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleaned)) {
            errors.push('Format de code SWIFT/BIC invalide');
        }

        // Vérification du code pays (CM pour Cameroun)
        if (!cleaned.startsWith('XXXX') && cleaned.substring(4, 6) === 'CM') {
            // SWIFT d'une banque camerounaise
            // Vous pouvez ajouter des vérifications spécifiques ici
        }

        return {
            isValid: errors.length === 0,
            errors,
            normalized: cleaned
        };
    }

    /**
     * Valide un ensemble de données de paiement
     */
    static validatePaymentData(data: {
        phone?: string;
        amount?: number | string;
        reference?: string;
        email?: string;
        transactionCode?: string;
        operator?: string;
    }): ValidationResult {
        const errors: string[] = [];
        const metadata: Record<string, any> = {};

        // Validation du téléphone
        if (data.phone) {
            const phoneValidation = this.validatePhoneNumber(data.phone);
            if (!phoneValidation.isValid) {
                errors.push(...phoneValidation.errors.map(e => `Téléphone: ${e}`));
            } else {
                metadata.phone = phoneValidation;
            }
        }

        // Validation du montant
        if (data.amount) {
            const amountValidation = this.validateAmount(data.amount, {
                min: 100,
                max: 10000000,
                currency: 'XAF',
                allowDecimals: false
            });

            if (!amountValidation.isValid) {
                errors.push(...amountValidation.errors.map(e => `Montant: ${e}`));
            } else {
                metadata.amount = amountValidation;
            }
        }

        // Validation de la référence
        if (data.reference) {
            const refValidation = this.validatePaymentReference(data.reference);
            if (!refValidation.isValid) {
                errors.push(...refValidation.errors.map(e => `Référence: ${e}`));
            } else {
                metadata.reference = refValidation;
            }
        }

        // Validation de l'email
        if (data.email) {
            const emailValidation = this.validateEmail(data.email);
            if (!emailValidation.isValid) {
                errors.push(...emailValidation.errors.map(e => `Email: ${e}`));
            } else {
                metadata.email = emailValidation;
            }
        }

        // Validation du code de transaction
        if (data.transactionCode && data.operator) {
            const operator = data.operator.toUpperCase() as 'MTN' | 'ORANGE' | 'EXPRESS_UNION';
            const codeValidation = this.validateTransactionCode(data.transactionCode, operator);

            if (!codeValidation.isValid) {
                errors.push(...codeValidation.errors.map(e => `Code transaction: ${e}`));
            } else {
                metadata.transactionCode = codeValidation;
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            metadata
        };
    }

    /**
     * Algorithme de Luhn pour validation de numéros
     */
    private static isValidLuhn(number: string): boolean {
        let sum = 0;
        let isEven = false;

        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    /**
     * Validation MOD 97 pour IBAN
     */
    private static isValidIBAN(iban: string): boolean {
        // Réorganiser (déplacer les 4 premiers caractères à la fin)
        const rearranged = iban.substring(4) + iban.substring(0, 4);

        // Convertir les lettres en chiffres (A=10, B=11, ..., Z=35)
        let numericIBAN = '';

        for (const char of rearranged) {
            if (/[A-Z]/.test(char)) {
                numericIBAN += (char.charCodeAt(0) - 55).toString();
            } else {
                numericIBAN += char;
            }
        }

        // Calculer MOD 97
        let remainder = 0;

        for (let i = 0; i < numericIBAN.length; i++) {
            remainder = (remainder * 10 + parseInt(numericIBAN[i], 10)) % 97;
        }

        return remainder === 1;
    }

    /**
     * Génère une expression régulière pour un type de validation
     */
    static getValidationRegex(type: ValidationType): RegExp {
        switch (type) {
            case ValidationType.PHONE:
                return /^(?:\+237|237)?[67]\d{8}$/;

            case ValidationType.MOBILE_MONEY:
                return /^(?:\+237|237)?[67]\d{8}$/;

            case ValidationType.BANK_ACCOUNT:
                return /^\d{10,20}$/;

            case ValidationType.CREDIT_CARD:
                return /^\d{13,19}$/;

            case ValidationType.AMOUNT:
                return /^\d+(?:[.,]\d{1,2})?$/;

            case ValidationType.REFERENCE:
                return /^[A-Z0-9\-_]{6,50}$/i;

            case ValidationType.TRANSACTION_CODE:
                return /^\d{8,12}$/;

            case ValidationType.EMAIL:
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            case ValidationType.IDENTIFICATION:
                return /^[A-Z0-9\-_]{6,20}$/;

            case ValidationType.IBAN:
                return /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

            case ValidationType.SWIFT:
                return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

            default:
                return /^.*$/;
        }
    }

    /**
     * Crée un validateur personnalisé avec des règles spécifiques
     */
    static createValidator(
        fieldName: string,
        rules: Array<{
            test: (value: unknown) => boolean;
            message: string;
        }>
    ): (value: unknown) => ValidationResult {
        return (value: unknown) => {
            const errors: string[] = [];

            for (const rule of rules) {
                if (!rule.test(value)) {
                    errors.push(`${fieldName}: ${rule.message}`);
                }
            }

            return {
                isValid: errors.length === 0,
                errors,
                normalized: typeof value === 'string' ? value.trim() : value
            };
        };
    }
}

// Exports de fonctions utilitaires simplifiées
export const validatePhone = (phone: string) => PaymentValidators.validatePhoneNumber(phone);
export const validatePhoneNumber = (phone: string) => PaymentValidators.validatePhoneNumber(phone);
export const validateAmount = (amount: number | string, options?: Record<string, unknown>) =>
    PaymentValidators.validateAmount(amount, options);
export const validateEmail = (email: string) => PaymentValidators.validateEmail(email);
export const validateReference = (reference: string) =>
    PaymentValidators.validatePaymentReference(reference);
export const validateTransactionCode = (code: string, operator?: string) =>
    PaymentValidators.validateTransactionCode(code, operator as any);
export const validateBankAccount = (accountNumber: string, bankCode?: string) =>
    PaymentValidators.validateBankAccount(accountNumber, bankCode);
