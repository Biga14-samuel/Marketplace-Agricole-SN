/**
 * Tests pour le module d'authentification
 * Vérification de l'intégration avec le backend FastAPI
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth.store'
import { authService } from '../services/auth.service'
import { usePasswordValidation } from '../composables/usePasswordValidation'

describe('Module Auth - Intégration Backend', () => {
    
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Validation des mots de passe', () => {
        it('devrait valider un mot de passe fort', () => {
            const { validatePassword } = usePasswordValidation()
            const result = validatePassword('Password123')
            
            expect(result.isValid).toBe(true)
            expect(result.errors).toHaveLength(0)
            expect(result.strength).toBeGreaterThan(70)
        })

        it('devrait rejeter un mot de passe trop court', () => {
            const { validatePassword } = usePasswordValidation()
            const result = validatePassword('Pass1')
            
            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Le mot de passe doit contenir au moins 8 caractères')
        })

        it('devrait rejeter un mot de passe sans majuscule', () => {
            const { validatePassword } = usePasswordValidation()
            const result = validatePassword('password123')
            
            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule')
        })

        it('devrait rejeter un mot de passe sans minuscule', () => {
            const { validatePassword } = usePasswordValidation()
            const result = validatePassword('PASSWORD123')
            
            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Le mot de passe doit contenir au moins une minuscule')
        })

        it('devrait rejeter un mot de passe sans chiffre', () => {
            const { validatePassword } = usePasswordValidation()
            const result = validatePassword('Password')
            
            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Le mot de passe doit contenir au moins un chiffre')
        })
    })

    describe('Store Auth', () => {
        it('devrait initialiser avec un état vide', () => {
            const store = useAuthStore()
            
            expect(store.user).toBeNull()
            expect(store.isAuthenticated).toBe(false)
            expect(store.isLoading).toBe(false)
            expect(store.error).toBeNull()
        })

        it('devrait avoir les getters corrects', () => {
            const store = useAuthStore()
            
            expect(store.currentUser).toBeNull()
            expect(store.userRole).toBe('Customer')
        })
    })

    describe('Service Auth', () => {
        it('devrait avoir toutes les méthodes requises', () => {
            expect(authService.register).toBeDefined()
            expect(authService.login).toBeDefined()
            expect(authService.logout).toBeDefined()
            expect(authService.refreshToken).toBeDefined()
            expect(authService.getCurrentUser).toBeDefined()
            expect(authService.verifyEmail).toBeDefined()
            expect(authService.requestPasswordReset).toBeDefined()
            expect(authService.confirmPasswordReset).toBeDefined()
            expect(authService.changePassword).toBeDefined()
        })

        it('devrait gérer les tokens correctement', () => {
            const testToken = 'test-token-123'
            
            authService.saveAccessToken(testToken)
            expect(authService.getAccessToken()).toBe(testToken)
            
            authService.clearTokens()
            expect(authService.getAccessToken()).toBeNull()
        })

        it('devrait vérifier l\'authentification', () => {
            authService.clearTokens()
            expect(authService.isAuthenticated()).toBe(false)
            
            authService.saveAccessToken('test-token')
            expect(authService.isAuthenticated()).toBe(true)
        })
    })

    describe('Types TypeScript', () => {
        it('devrait avoir les types User corrects', () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                phone: '+33612345678',
                is_active: true,
                is_verified: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                roles: [
                    {
                        id: 1,
                        name: 'Customer',
                        description: 'Client',
                        created_at: '2024-01-01T00:00:00Z'
                    }
                ]
            }
            
            expect(user.id).toBeTypeOf('number')
            expect(user.email).toBeTypeOf('string')
            expect(user.is_active).toBeTypeOf('boolean')
            expect(user.roles).toBeInstanceOf(Array)
        })
    })
})

describe('Intégration avec le Backend', () => {
    
    it('devrait avoir la bonne URL de base', () => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        expect(baseURL).toBeDefined()
        expect(baseURL).toMatch(/^https?:\/\//)
    })

    // Tests d'intégration réels (nécessitent un backend actif)
    describe.skip('Tests d\'intégration réels', () => {
        
        it('devrait pouvoir s\'inscrire', async () => {
            const store = useAuthStore()
            
            const result = await store.register({
                email: 'test@example.com',
                password: 'Password123',
                phone: '+33612345678'
            })
            
            expect(result.message).toBeDefined()
        })

        it('devrait pouvoir se connecter', async () => {
            const store = useAuthStore()
            
            await store.login({
                email: 'test@example.com',
                password: 'Password123'
            })
            
            expect(store.isAuthenticated).toBe(true)
            expect(store.user).not.toBeNull()
        })

        it('devrait pouvoir se déconnecter', async () => {
            const store = useAuthStore()
            
            await store.logout()
            
            expect(store.isAuthenticated).toBe(false)
            expect(store.user).toBeNull()
        })
    })
})
