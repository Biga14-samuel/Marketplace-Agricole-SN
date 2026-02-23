// Export des composants du module d'authentification

// Imports des composants
import AuthForm from './AuthForm.vue'
import PasswordInput from './PasswordInput.vue'
import SocialLoginButtons from './SocialLoginButtons.vue'
import AuthHeader from './AuthHeader.vue'
import AuthFooter from './AuthFooter.vue'

// Types des props des composants
export interface AuthFormProps {
    variant?: 'login' | 'register' | 'reset'
    loading?: boolean
    error?: string
}

export interface PasswordInputProps {
    showStrength?: boolean
    showToggle?: boolean
    disabled?: boolean
    modelValue?: string
    placeholder?: string
    error?: string
}

export interface SocialLoginButtonsProps {
    label?: string
    providers?: Array<{
        id: string
        label: string
        icon?: any
        color?: string
    }>
}

export interface AuthHeaderProps {
    appName?: string
    title?: string
    subtitle?: string
}

export interface AuthFooterProps {
    currentYear?: number
    showLinks?: boolean
}

// Export unique avec syntaxe raccourcie
export {
    AuthForm,
    PasswordInput,
    SocialLoginButtons,
    AuthHeader,
    AuthFooter
}

// Export par défaut (CHOISISSEZ UNIQUEMENT L'UNE DES DEUX OPTIONS CI-DESSOUS)

// Export par défaut comme objet
export default {
    AuthForm,
    PasswordInput,
    SocialLoginButtons,
    AuthHeader,
    AuthFooter
}
