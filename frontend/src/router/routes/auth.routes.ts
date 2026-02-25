/**
 * Routes d'authentification
 */
import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  // Routes plates pour compatibilité (redirections)
  {
    path: '/login',
    redirect: (to) => ({
      path: '/auth/login',
      query: to.query,
      hash: to.hash
    })
  },
  {
    path: '/register',
    redirect: (to) => ({
      path: '/auth/register',
      query: to.query,
      hash: to.hash
    })
  },
  {
    path: '/verify-email',
    redirect: (to) => ({
      path: '/auth/verify-email',
      query: to.query,
      hash: to.hash
    })
  },
  
  // Routes principales sous /auth
  {
    path: '/auth',
    name: 'Auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/modules/auth/views/LoginView.vue'),
        meta: {
          title: 'Connexion',
          requiresGuest: true
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/modules/auth/views/RegisterView.vue'),
        meta: {
          title: 'Inscription',
          requiresGuest: true
        }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/modules/auth/views/ForgotPasswordView.vue'),
        meta: {
          title: 'Mot de passe oublié',
          requiresGuest: true
        }
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/modules/auth/views/ResetPasswordView.vue'),
        meta: {
          title: 'Réinitialiser le mot de passe',
          requiresGuest: true
        }
      },
      {
        path: 'verify-email',
        name: 'VerifyEmail',
        component: () => import('@/modules/auth/views/VerifyEmailView.vue'),
        meta: {
          title: 'Vérification email'
        }
      }
    ]
  }
]

export default authRoutes
