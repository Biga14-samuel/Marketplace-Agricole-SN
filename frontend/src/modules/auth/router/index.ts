/**
 * Routes du module d'authentification
 * Aligné avec les endpoints du backend FastAPI
 */

import type { RouteRecordRaw } from 'vue-router'
import { requireGuest } from '../guards/auth.guard'

const authRoutes: RouteRecordRaw[] = [
    {
        path: '/auth',
        name: 'Auth',
        redirect: '/auth/login',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('../views/LoginView.vue'),
                beforeEnter: requireGuest,
                meta: {
                    title: 'Connexion',
                    description: 'Connectez-vous à votre compte MarketFraîche'
                }
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('../views/RegisterView.vue'),
                beforeEnter: requireGuest,
                meta: {
                    title: 'Inscription',
                    description: 'Créez votre compte MarketFraîche'
                }
            },
            {
                path: 'verify-email',
                name: 'VerifyEmail',
                component: () => import('../views/VerifyEmailView.vue'),
                meta: {
                    title: 'Vérification d\'email',
                    description: 'Vérifiez votre adresse email'
                }
            },
            {
                path: 'forgot-password',
                name: 'ForgotPassword',
                component: () => import('../views/ForgotPasswordView.vue'),
                beforeEnter: requireGuest,
                meta: {
                    title: 'Mot de passe oublié',
                    description: 'Réinitialisez votre mot de passe'
                }
            },
            {
                path: 'reset-password',
                name: 'ResetPassword',
                component: () => import('../views/ResetPasswordView.vue'),
                beforeEnter: requireGuest,
                meta: {
                    title: 'Réinitialisation du mot de passe',
                    description: 'Définissez un nouveau mot de passe'
                }
            }
        ]
    }
]

export default authRoutes
