export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface ValidationRule<T> {
    validate: (value: T) => boolean;
    message: string;
}

export class ValidationService {
    static validateRequired(value: unknown): ValidationResult {
        const isValid = value !== null && value !== undefined && value !== '';
        return {
            isValid,
            errors: isValid ? [] : ['Ce champ est requis']
        };
    }

    static validateEmail(email: string): ValidationResult {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        return {
            isValid,
            errors: isValid ? [] : ['Format d\'email invalide']
        };
    }

    static validatePhone(phone: string): ValidationResult {
        const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
        const isValid = phoneRegex.test(phone.replace(/\s/g, ''));
        return {
            isValid,
            errors: isValid ? [] : ['Format de téléphone invalide']
        };
    }

    static validateSiret(siret: string): ValidationResult {
        const cleanSiret = siret.replace(/\s/g, '');
        const isValid = /^\d{14}$/.test(cleanSiret);
        return {
            isValid,
            errors: isValid ? [] : ['Le SIRET doit contenir 14 chiffres']
        };
    }

    static validateIban(iban: string): ValidationResult {
        const cleanIban = iban.replace(/\s/g, '').toUpperCase();
        const isValid = /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}$/.test(cleanIban);
        return {
            isValid,
            errors: isValid ? [] : ['Format IBAN invalide']
        };
    }

    static validateMultiple<T>(value: T, rules: ValidationRule<T>[]): ValidationResult {
        const errors: string[] = [];
        
        for (const rule of rules) {
            if (!rule.validate(value)) {
                errors.push(rule.message);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}