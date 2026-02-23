// Export des vues du module d'authentification

// Importations des composants
import LoginView from './LoginView.vue'
import RegisterView from './RegisterView.vue'
import VerifyEmailView from './VerifyEmailView.vue'
import ForgotPasswordView from './ForgotPasswordView.vue'
import ResetPasswordView from './ResetPasswordView.vue'

// Export nommé
export { LoginView }
export { RegisterView }
export { VerifyEmailView }
export { ForgotPasswordView }
export { ResetPasswordView }

// Export par défaut (objet)
export default {
    LoginView,
    RegisterView,
    VerifyEmailView,
    ForgotPasswordView,
    ResetPasswordView
}

// Types pour les props des vues
export interface AuthViewProps {
    redirectTo?: string
    showBackButton?: boolean
    variant?: 'default' | 'minimal' | 'full'
}

// Interface pour la configuration des vues
export interface AuthViewsConfig {
    login: {
        enableSocialLogin: boolean
        enableRememberMe: boolean
        enableForgotPassword: boolean
    }
    register: {
        enableTerms: boolean
        enableNewsletter: boolean
        enableAddress: boolean
    }
}