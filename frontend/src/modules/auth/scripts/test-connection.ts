import { getErrorMessage } from '@/shared/utils/error-handler';
/**
 * Script de test de connexion avec le backend FastAPI
 * Exécuter avec: npm run test:connection
 */

import axios from 'axios'

// Déclaration pour Node.js process
declare const process: {
    env: {
        VITE_API_URL?: string;
        [key: string]: string | undefined;
    };
    exit: (code: number) => never;
};

const API_URL = process.env.VITE_API_URL || 'http://localhost:8000'

interface TestResult {
    name: string
    status: 'success' | 'error'
    message: string
    duration?: number
}

const results: TestResult[] = []

/**
 * Teste la connexion au backend
 */
async function testBackendConnection(): Promise<TestResult> {
    const start = Date.now()
    try {
        const response = await axios.get(`${API_URL}/`)
        const duration = Date.now() - start
        
        return {
            name: 'Connexion Backend',
            status: 'success',
            message: `Backend accessible (${duration}ms)`,
            duration
        }
    } catch (error: unknown) {
        return {
            name: 'Connexion Backend',
            status: 'error',
            message: getErrorMessage(error)
        }
    }
}

/**
 * Teste l'endpoint de santé
 */
async function testHealthEndpoint(): Promise<TestResult> {
    const start = Date.now()
    try {
        const response = await axios.get(`${API_URL}/health`)
        const duration = Date.now() - start
        
        return {
            name: 'Health Check',
            status: 'success',
            message: `Health endpoint OK (${duration}ms)`,
            duration
        }
    } catch (error: unknown) {
        return {
            name: 'Health Check',
            status: 'error',
            message: (error as any).response?.status === 404 ? 'Endpoint non trouvé' : getErrorMessage(error)
        }
    }
}

/**
 * Teste l'endpoint d'inscription
 */
async function testRegisterEndpoint(): Promise<TestResult> {
    try {
        // Test avec des données invalides pour vérifier que l'endpoint existe
        const response = await axios.post(`${API_URL}/auth/register`, {
            email: 'invalid',
            password: 'short'
        })
        
        return {
            name: 'Endpoint Register',
            status: 'error',
            message: 'Devrait retourner une erreur de validation'
        }
    } catch (error: unknown) {
        if ((error as any).response?.status === 422 || (error as any).response?.status === 400) {
            return {
                name: 'Endpoint Register',
                status: 'success',
                message: 'Endpoint accessible et validation active'
            }
        }
        
        return {
            name: 'Endpoint Register',
            status: 'error',
            message: getErrorMessage(error)
        }
    }
}

/**
 * Teste l'endpoint de connexion
 */
async function testLoginEndpoint(): Promise<TestResult> {
    try {
        // Test avec des credentials invalides
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'wrongpassword'
        })
        
        return {
            name: 'Endpoint Login',
            status: 'error',
            message: 'Devrait retourner une erreur 401'
        }
    } catch (error: unknown) {
        if ((error as any).response?.status === 401) {
            return {
                name: 'Endpoint Login',
                status: 'success',
                message: 'Endpoint accessible et authentification active'
            }
        }
        
        return {
            name: 'Endpoint Login',
            status: 'error',
            message: getErrorMessage(error)
        }
    }
}

/**
 * Teste la structure de réponse d'erreur
 */
async function testErrorStructure(): Promise<TestResult> {
    try {
        await axios.post(`${API_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'wrong'
        })
        
        return {
            name: 'Structure Erreur',
            status: 'error',
            message: 'Pas d\'erreur retournée'
        }
    } catch (error: unknown) {
        const hasDetail = (error as any).response?.data?.detail !== undefined
        const hasMessage = (error as any).response?.data?.message !== undefined
        
        if (hasDetail || hasMessage) {
            return {
                name: 'Structure Erreur',
                status: 'success',
                message: `Structure correcte (${hasDetail ? 'detail' : 'message'})`
            }
        }
        
        return {
            name: 'Structure Erreur',
            status: 'error',
            message: 'Structure de réponse incorrecte'
        }
    }
}

/**
 * Teste CORS
 */
async function testCORS(): Promise<TestResult> {
    try {
        const response = await axios.options(`${API_URL}/auth/login`)
        
        const allowOrigin = response.headers['access-control-allow-origin']
        const allowMethods = response.headers['access-control-allow-methods']
        
        if (allowOrigin && allowMethods) {
            return {
                name: 'Configuration CORS',
                status: 'success',
                message: `CORS configuré (Origin: ${allowOrigin})`
            }
        }
        
        return {
            name: 'Configuration CORS',
            status: 'error',
            message: 'Headers CORS manquants'
        }
    } catch (error: unknown) {
        return {
            name: 'Configuration CORS',
            status: 'error',
            message: getErrorMessage(error)
        }
    }
}

/**
 * Affiche les résultats
 */
function displayResults(results: TestResult[]) {
    console.log('\n' + '='.repeat(60))
    console.log('  TEST DE CONNEXION BACKEND FASTAPI')
    console.log('='.repeat(60) + '\n')
    
    console.log(`URL Backend: ${API_URL}\n`)
    
    let successCount = 0
    let errorCount = 0
    
    results.forEach(result => {
        const icon = result.status === 'success' ? '✅' : '❌'
        const duration = result.duration ? ` (${result.duration}ms)` : ''
        
        console.log(`${icon} ${result.name}${duration}`)
        console.log(`   ${result.message}\n`)
        
        if (result.status === 'success') {
            successCount++
        } else {
            errorCount++
        }
    })
    
    console.log('='.repeat(60))
    console.log(`Résultats: ${successCount} succès, ${errorCount} erreurs`)
    console.log('='.repeat(60) + '\n')
    
    if (errorCount === 0) {
        console.log('🎉 Tous les tests sont passés ! Le backend est prêt.\n')
    } else {
        console.log('⚠️  Certains tests ont échoué. Vérifiez la configuration.\n')
    }
}

/**
 * Exécute tous les tests
 */
async function runAllTests() {
    console.log('Démarrage des tests de connexion...\n')
    
    const tests = [
        testBackendConnection,
        testHealthEndpoint,
        testRegisterEndpoint,
        testLoginEndpoint,
        testErrorStructure,
        testCORS
    ]
    
    for (const test of tests) {
        const result = await test()
        results.push(result)
    }
    
    displayResults(results)
}

// Exécuter les tests
runAllTests().catch(error => {
    console.error('Erreur lors de l\'exécution des tests:', error)
    process.exit(1)
})
