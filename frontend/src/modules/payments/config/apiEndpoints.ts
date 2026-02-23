// @ts-nocheck
// apiEndpoints.ts

/**
 * Configuration des endpoints API
 * Centralisation de toutes les routes de l'application
 */

export enum ApiVersion {
    V1 = 'v1',
    V2 = 'v2',
    V3 = 'v3'
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS'
}

export interface EndpointConfig {
    /** Méthode HTTP */
    method: HttpMethod;
    /** Chemin de l'endpoint */
    path: string;
    /** Description de l'endpoint */
    description: string;
    /** Version de l'API */
    version: ApiVersion;
    /** Authentification requise */
    requiresAuth: boolean;
    /** Rôles autorisés */
    allowedRoles?: string[];
    /** Validation requise */
    requiresValidation?: boolean;
    /** Cache config */
    cache?: {
        enabled: boolean;
        ttl: number; // Time to live en secondes
    };
    /** Rate limiting */
    rateLimit?: {
        enabled: boolean;
        maxRequests: number;
        windowMs: number;
    };
    /** Logging */
    logging?: {
        enabled: boolean;
        level: 'info' | 'debug' | 'error';
    };
    /** Paramètres requis */
    requiredParams?: string[];
    /** Paramètres optionnels */
    optionalParams?: string[];
    /** Exemple de corps de requête */
    requestExample?: any;
    /** Exemple de réponse */
    responseExample?: any;
}

export interface EndpointGroup {
    name: string;
    description: string;
    basePath: string;
    endpoints: Record<string, EndpointConfig>;
}

export interface ApiConfig {
    baseUrl: string;
    defaultVersion: ApiVersion;
    timeout: number;
    retryAttempts: number;
    endpoints: Record<string, EndpointGroup>;
}

/**
 * Classe utilitaire pour générer des URLs d'API
 */
export class ApiEndpointBuilder {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Construit une URL complète pour un endpoint
     */
    buildUrl(
        group: string,
        endpoint: string,
        params: Record<string, string | number> = {},
        queryParams: Record<string, string | number> = {}
    ): string {
        const endpointConfig = API_CONFIG.endpoints[group]?.endpoints[endpoint];

        if (!endpointConfig) {
            throw new Error(`Endpoint ${group}.${endpoint} non trouvé`);
        }

        // Remplacer les paramètres dans le chemin
        let path = endpointConfig.path;

        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`:${key}`, String(value));
        }

        // Vérifier qu'il ne reste pas de paramètres non remplacés
        const remainingParams = path.match(/:\w+/g);
        if (remainingParams) {
            throw new Error(`Paramètres manquants: ${remainingParams.join(', ')}`);
        }

        // Construire l'URL de base
        const version = endpointConfig.version;
        const basePath = API_CONFIG.endpoints[group].basePath;
        let url = `${this.baseUrl}/api/${version}${basePath}${path}`;

        // Ajouter les paramètres de requête
        if (Object.keys(queryParams).length > 0) {
            const queryString = new URLSearchParams(
                Object.entries(queryParams).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {} as Record<string, string>)
            ).toString();
            url += `?${queryString}`;
        }

        return url;
    }

    /**
     * Obtient la configuration d'un endpoint
     */
    getEndpointConfig(group: string, endpoint: string): EndpointConfig | undefined {
        return API_CONFIG.endpoints[group]?.endpoints[endpoint];
    }

    /**
     * Génère une documentation OpenAPI pour un groupe d'endpoints
     */
    generateOpenAPI(group: string): any {
        const endpointGroup = API_CONFIG.endpoints[group];

        if (!endpointGroup) {
            throw new Error(`Groupe ${group} non trouvé`);
        }

        const paths: any = {};

        for (const [endpointName, endpointConfig] of Object.entries(endpointGroup.endpoints)) {
            const path = endpointConfig.path;
            const method = endpointConfig.method.toLowerCase();

            if (!paths[path]) {
                paths[path] = {};
            }

            paths[path][method] = {
                summary: endpointConfig.description,
                security: endpointConfig.requiresAuth ? [{ bearerAuth: [] }] : [],
                parameters: [
                    ...(endpointConfig.requiredParams || []).map(param => ({
                        name: param,
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    })),
                    ...(endpointConfig.optionalParams || []).map(param => ({
                        name: param,
                        in: 'path',
                        required: false,
                        schema: { type: 'string' }
                    }))
                ],
                requestBody: endpointConfig.requestExample ? {
                    content: {
                        'application/json': {
                            example: endpointConfig.requestExample
                        }
                    }
                } : undefined,
                responses: {
                    200: {
                        description: 'Succès',
                        content: endpointConfig.responseExample ? {
                            'application/json': {
                                example: endpointConfig.responseExample
                            }
                        } : undefined
                    }
                }
            };
        }

        return {
            [endpointGroup.basePath]: paths
        };
    }
}

/**
 * Configuration complète des endpoints API
 */
export const API_CONFIG: ApiConfig = {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    defaultVersion: ApiVersion.V1,
    timeout: 30000, // 30 secondes
    retryAttempts: 3,

    endpoints: {
        // ==================== ORDRES & PANIER ====================
        orders: {
            name: 'orders',
            description: 'Gestion des commandes et du panier',
            basePath: '/orders',

            endpoints: {
                // --- Panier ---
                addToCart: {
                    method: HttpMethod.POST,
                    path: '/cart/items',
                    description: 'Ajouter un article au panier',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'user'],
                    requiresValidation: true,
                    cache: { enabled: false, ttl: 0 },
                    rateLimit: { enabled: true, maxRequests: 10, windowMs: 60000 },
                    logging: { enabled: true, level: 'info' },
                    requiredParams: [],
                    requestExample: {
                        productId: 'prod_12345',
                        quantity: 2,
                        variantId: 'var_67890',
                        notes: 'Je préfère les tomates bien mûres'
                    },
                    responseExample: {
                        success: true,
                        message: 'Article ajouté au panier',
                        cartItem: {
                            id: 'cart_item_123',
                            productId: 'prod_12345',
                            productName: 'Tomates Bio',
                            quantity: 2,
                            unitPrice: 500,
                            totalPrice: 1000,
                            variant: '1kg',
                            image: 'https://example.com/tomates.jpg'
                        },
                        cartSummary: {
                            totalItems: 5,
                            totalAmount: 12500,
                            itemsCount: 3
                        }
                    }
                },

                getCart: {
                    method: HttpMethod.GET,
                    path: '/cart',
                    description: 'Voir mon panier',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'user'],
                    cache: { enabled: true, ttl: 30 },
                    rateLimit: { enabled: true, maxRequests: 30, windowMs: 60000 },
                    logging: { enabled: false, level: 'info' },
                    responseExample: {
                        success: true,
                        cart: {
                            id: 'cart_789',
                            userId: 'user_123',
                            items: [
                                {
                                    id: 'cart_item_123',
                                    productId: 'prod_12345',
                                    productName: 'Tomates Bio',
                                    quantity: 2,
                                    unitPrice: 500,
                                    totalPrice: 1000,
                                    variant: '1kg',
                                    image: 'https://example.com/tomates.jpg',
                                    seller: {
                                        id: 'seller_456',
                                        name: 'Ferme Bio du Village',
                                        rating: 4.5
                                    }
                                }
                            ],
                            summary: {
                                totalItems: 5,
                                totalAmount: 12500,
                                itemsCount: 3,
                                deliveryFee: 1500,
                                taxAmount: 1875,
                                grandTotal: 15875
                            },
                            lastUpdated: '2024-01-15T10:30:00Z'
                        }
                    }
                },

                clearCart: {
                    method: HttpMethod.DELETE,
                    path: '/cart',
                    description: 'Vider le panier',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'user'],
                    logging: { enabled: true, level: 'info' },
                    responseExample: {
                        success: true,
                        message: 'Panier vidé avec succès',
                        cartId: 'cart_789'
                    }
                },

                updateCartItem: {
                    method: HttpMethod.PUT,
                    path: '/cart/items/:itemId',
                    description: 'Mettre à jour un article du panier',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'user'],
                    requiresValidation: true,
                    requiredParams: ['itemId'],
                    requestExample: {
                        quantity: 3,
                        notes: 'Augmenter la quantité'
                    },
                    responseExample: {
                        success: true,
                        message: 'Article mis à jour',
                        cartItem: {
                            id: 'cart_item_123',
                            productId: 'prod_12345',
                            quantity: 3,
                            unitPrice: 500,
                            totalPrice: 1500
                        }
                    }
                },

                removeCartItem: {
                    method: HttpMethod.DELETE,
                    path: '/cart/items/:itemId',
                    description: 'Retirer un article du panier',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'user'],
                    requiredParams: ['itemId'],
                    responseExample: {
                        success: true,
                        message: 'Article retiré du panier',
                        itemId: 'cart_item_123',
                        cartSummary: {
                            totalItems: 4,
                            totalAmount: 11000,
                            itemsCount: 2
                        }
                    }
                },

                // --- Commandes ---
                checkout: {
                    method: HttpMethod.POST,
                    path: '/checkout',
                    description: 'Finaliser la commande',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'user'],
                    requiresValidation: true,
                    rateLimit: { enabled: true, maxRequests: 5, windowMs: 60000 },
                    requestExample: {
                        shippingAddress: {
                            street: '123 Rue du Commerce',
                            city: 'Yaoundé',
                            region: 'Centre',
                            postalCode: '00237',
                            country: 'Cameroun',
                            phone: '+237677123456'
                        },
                        billingAddress: {
                            sameAsShipping: true
                        },
                        paymentMethod: 'MTN_MOBILE_MONEY',
                        deliveryMethod: 'standard',
                        deliveryInstructions: 'Livrer après 17h',
                        useSavedPayment: false,
                        couponCode: 'PROMO10'
                    },
                    responseExample: {
                        success: true,
                        orderId: 'order_123456',
                        paymentRequired: true,
                        paymentUrl: 'https://payment.example.com/pay/order_123456',
                        summary: {
                            itemsTotal: 12500,
                            deliveryFee: 1500,
                            taxAmount: 1875,
                            discountAmount: 1250,
                            grandTotal: 14625
                        }
                    }
                },

                getMyOrders: {
                    method: HttpMethod.GET,
                    path: '/my-orders',
                    description: 'Mes commandes',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'user'],
                    cache: { enabled: true, ttl: 60 },
                    optionalParams: ['status', 'page', 'limit', 'fromDate', 'toDate'],
                    responseExample: {
                        success: true,
                        orders: [
                            {
                                id: 'order_123456',
                                orderNumber: 'CMD-2024-00123',
                                status: 'processing',
                                totalAmount: 14625,
                                itemCount: 3,
                                createdAt: '2024-01-15T10:30:00Z',
                                sellerName: 'Ferme Bio du Village',
                                deliveryDate: '2024-01-17'
                            }
                        ],
                        pagination: {
                            page: 1,
                            limit: 10,
                            total: 5,
                            totalPages: 1
                        }
                    }
                },

                getProducerOrders: {
                    method: HttpMethod.GET,
                    path: '/producer-orders',
                    description: 'Commandes reçues (Producteur)',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['producer', 'seller', 'admin'],
                    cache: { enabled: true, ttl: 30 },
                    optionalParams: ['status', 'page', 'limit', 'fromDate', 'toDate'],
                    responseExample: {
                        success: true,
                        orders: [
                            {
                                id: 'order_123456',
                                orderNumber: 'CMD-2024-00123',
                                status: 'pending',
                                totalAmount: 14625,
                                itemCount: 3,
                                customerName: 'Jean Dupont',
                                customerPhone: '+237677123456',
                                createdAt: '2024-01-15T10:30:00Z',
                                deliveryAddress: '123 Rue du Commerce, Yaoundé'
                            }
                        ],
                        summary: {
                            pending: 2,
                            processing: 1,
                            shipped: 3,
                            delivered: 5,
                            cancelled: 0
                        }
                    }
                },

                getOrderDetails: {
                    method: HttpMethod.GET,
                    path: '/:orderId',
                    description: 'Détails d\'une commande',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'producer', 'seller', 'admin'],
                    requiredParams: ['orderId'],
                    cache: { enabled: true, ttl: 300 },
                    responseExample: {
                        success: true,
                        order: {
                            id: 'order_123456',
                            orderNumber: 'CMD-2024-00123',
                            status: 'processing',
                            statusHistory: [
                                { status: 'pending', timestamp: '2024-01-15T10:30:00Z' },
                                { status: 'confirmed', timestamp: '2024-01-15T10:35:00Z' }
                            ],
                            customer: {
                                id: 'user_123',
                                name: 'Jean Dupont',
                                email: 'jean@example.com',
                                phone: '+237677123456'
                            },
                            items: [
                                {
                                    id: 'order_item_123',
                                    productId: 'prod_12345',
                                    productName: 'Tomates Bio',
                                    quantity: 2,
                                    unitPrice: 500,
                                    totalPrice: 1000,
                                    variant: '1kg',
                                    image: 'https://example.com/tomates.jpg'
                                }
                            ],
                            shippingAddress: {
                                street: '123 Rue du Commerce',
                                city: 'Yaoundé',
                                region: 'Centre',
                                postalCode: '00237',
                                country: 'Cameroun',
                                phone: '+237677123456'
                            },
                            payment: {
                                method: 'MTN_MOBILE_MONEY',
                                status: 'paid',
                                amount: 14625,
                                transactionId: 'txn_789012',
                                paidAt: '2024-01-15T10:32:00Z'
                            },
                            delivery: {
                                method: 'standard',
                                fee: 1500,
                                estimatedDelivery: '2024-01-17',
                                instructions: 'Livrer après 17h'
                            },
                            summary: {
                                itemsTotal: 12500,
                                deliveryFee: 1500,
                                taxAmount: 1875,
                                discountAmount: 1250,
                                grandTotal: 14625
                            },
                            createdAt: '2024-01-15T10:30:00Z',
                            updatedAt: '2024-01-15T10:35:00Z'
                        }
                    }
                },

                updateOrderStatus: {
                    method: HttpMethod.POST,
                    path: '/:orderId/status',
                    description: 'Changer le statut d\'une commande',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['producer', 'seller', 'admin'],
                    requiredParams: ['orderId'],
                    requiresValidation: true,
                    requestExample: {
                        status: 'shipped',
                        notes: 'Colis expédié via DHL',
                        trackingNumber: 'DHL123456789'
                    },
                    responseExample: {
                        success: true,
                        message: 'Statut de commande mis à jour',
                        orderId: 'order_123456',
                        previousStatus: 'processing',
                        newStatus: 'shipped',
                        updatedAt: '2024-01-16T09:15:00Z'
                    }
                },

                cancelOrder: {
                    method: HttpMethod.POST,
                    path: '/:orderId/cancel',
                    description: 'Annuler une commande',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'producer', 'seller', 'admin'],
                    requiredParams: ['orderId'],
                    requiresValidation: true,
                    requestExample: {
                        reason: 'Changement d\'avis',
                        notes: 'Je souhaite annuler ma commande'
                    },
                    responseExample: {
                        success: true,
                        message: 'Commande annulée avec succès',
                        orderId: 'order_123456',
                        refundStatus: 'pending',
                        estimatedRefund: 14625,
                        cancellationFee: 0
                    }
                },

                addTracking: {
                    method: HttpMethod.POST,
                    path: '/:orderId/tracking',
                    description: 'Ajouter un suivi de livraison',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['producer', 'seller', 'admin'],
                    requiredParams: ['orderId'],
                    requiresValidation: true,
                    requestExample: {
                        carrier: 'DHL',
                        trackingNumber: 'DHL123456789',
                        estimatedDelivery: '2024-01-18',
                        notes: 'Livraison express'
                    },
                    responseExample: {
                        success: true,
                        message: 'Information de suivi ajoutée',
                        trackingId: 'track_123',
                        orderId: 'order_123456',
                        carrier: 'DHL',
                        trackingNumber: 'DHL123456789',
                        trackingUrl: 'https://www.dhl.com/track?trackingId=DHL123456789'
                    }
                },

                getTracking: {
                    method: HttpMethod.GET,
                    path: '/:orderId/tracking',
                    description: 'Voir le suivi d\'une commande',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'producer', 'seller', 'admin'],
                    requiredParams: ['orderId'],
                    cache: { enabled: true, ttl: 60 },
                    responseExample: {
                        success: true,
                        tracking: {
                            orderId: 'order_123456',
                            carrier: 'DHL',
                            trackingNumber: 'DHL123456789',
                            status: 'in_transit',
                            events: [
                                {
                                    date: '2024-01-16T09:15:00Z',
                                    location: 'Yaoundé, Cameroun',
                                    description: 'Colis pris en charge',
                                    status: 'shipped'
                                },
                                {
                                    date: '2024-01-16T14:30:00Z',
                                    location: 'Douala, Cameroun',
                                    description: 'Arrivé au centre de tri',
                                    status: 'in_transit'
                                }
                            ],
                            estimatedDelivery: '2024-01-18',
                            lastUpdated: '2024-01-16T14:30:00Z',
                            trackingUrl: 'https://www.dhl.com/track?trackingId=DHL123456789'
                        }
                    }
                },

                getOrderHistory: {
                    method: HttpMethod.GET,
                    path: '/:orderId/history',
                    description: 'Voir l\'historique des statuts',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    allowedRoles: ['customer', 'producer', 'seller', 'admin'],
                    requiredParams: ['orderId'],
                    cache: { enabled: true, ttl: 300 },
                    responseExample: {
                        success: true,
                        orderId: 'order_123456',
                        history: [
                            {
                                id: 'history_1',
                                status: 'pending',
                                timestamp: '2024-01-15T10:30:00Z',
                                changedBy: 'system',
                                notes: 'Commande créée'
                            },
                            {
                                id: 'history_2',
                                status: 'confirmed',
                                timestamp: '2024-01-15T10:35:00Z',
                                changedBy: 'user_123',
                                notes: 'Paiement confirmé'
                            },
                            {
                                id: 'history_3',
                                status: 'processing',
                                timestamp: '2024-01-15T11:00:00Z',
                                changedBy: 'seller_456',
                                notes: 'Commande en préparation'
                            }
                        ],
                        timeline: [
                            {
                                status: 'pending',
                                completed: true,
                                date: '2024-01-15T10:30:00Z'
                            },
                            {
                                status: 'confirmed',
                                completed: true,
                                date: '2024-01-15T10:35:00Z'
                            },
                            {
                                status: 'processing',
                                completed: true,
                                date: '2024-01-15T11:00:00Z'
                            },
                            {
                                status: 'shipped',
                                completed: false,
                                estimatedDate: '2024-01-16'
                            },
                            {
                                status: 'delivered',
                                completed: false,
                                estimatedDate: '2024-01-18'
                            }
                        ]
                    }
                }
            }
        },

        // ==================== PRODUITS ====================
        products: {
            name: 'products',
            description: 'Gestion des produits',
            basePath: '/products',

            endpoints: {
                getProducts: {
                    method: HttpMethod.GET,
                    path: '',
                    description: 'Lister les produits',
                    version: ApiVersion.V1,
                    requiresAuth: false,
                    cache: { enabled: true, ttl: 300 },
                    optionalParams: ['category', 'seller', 'page', 'limit', 'sort', 'minPrice', 'maxPrice'],
                    responseExample: {
                        success: true,
                        products: [],
                        pagination: {}
                    }
                },

                getProductDetails: {
                    method: HttpMethod.GET,
                    path: '/:productId',
                    description: 'Détails d\'un produit',
                    version: ApiVersion.V1,
                    requiresAuth: false,
                    requiredParams: ['productId'],
                    cache: { enabled: true, ttl: 600 },
                    responseExample: {
                        success: true,
                        product: {}
                    }
                }
            }
        },

        // ==================== UTILISATEURS ====================
        users: {
            name: 'users',
            description: 'Gestion des utilisateurs',
            basePath: '/users',

            endpoints: {
                register: {
                    method: HttpMethod.POST,
                    path: '/register',
                    description: 'Inscription',
                    version: ApiVersion.V1,
                    requiresAuth: false,
                    requiresValidation: true
                },

                login: {
                    method: HttpMethod.POST,
                    path: '/login',
                    description: 'Connexion',
                    version: ApiVersion.V1,
                    requiresAuth: false,
                    requiresValidation: true
                },

                getProfile: {
                    method: HttpMethod.GET,
                    path: '/profile',
                    description: 'Mon profil',
                    version: ApiVersion.V1,
                    requiresAuth: true
                }
            }
        },

        // ==================== PAIEMENTS ====================
        payments: {
            name: 'payments',
            description: 'Gestion des paiements',
            basePath: '/payments',

            endpoints: {
                initiatePayment: {
                    method: HttpMethod.POST,
                    path: '/initiate',
                    description: 'Initier un paiement',
                    version: ApiVersion.V1,
                    requiresAuth: true,
                    requiresValidation: true
                },

                verifyPayment: {
                    method: HttpMethod.POST,
                    path: '/verify',
                    description: 'Vérifier un paiement',
                    version: ApiVersion.V1,
                    requiresAuth: true
                }
            }
        }
    }
};

/**
 * Singleton pour le builder d'endpoints
 */
let endpointBuilder: ApiEndpointBuilder | null = null;

export function getApiEndpointBuilder(): ApiEndpointBuilder {
    if (!endpointBuilder) {
        endpointBuilder = new ApiEndpointBuilder(API_CONFIG.baseUrl);
    }
    return endpointBuilder;
}

/**
 * Fonctions utilitaires pour accéder aux endpoints
 */
export const ApiEndpoints = {
    // Panier
    addToCart: () => getApiEndpointBuilder().buildUrl('orders', 'addToCart'),
    getCart: () => getApiEndpointBuilder().buildUrl('orders', 'getCart'),
    clearCart: () => getApiEndpointBuilder().buildUrl('orders', 'clearCart'),
    updateCartItem: (itemId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'updateCartItem', { itemId }),
    removeCartItem: (itemId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'removeCartItem', { itemId }),

    // Commandes
    checkout: () => getApiEndpointBuilder().buildUrl('orders', 'checkout'),
    getMyOrders: (params?: Record<string, string | number>) =>
        getApiEndpointBuilder().buildUrl('orders', 'getMyOrders', {}, params),
    getProducerOrders: (params?: Record<string, string | number>) =>
        getApiEndpointBuilder().buildUrl('orders', 'getProducerOrders', {}, params),
    getOrderDetails: (orderId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'getOrderDetails', { orderId }),
    updateOrderStatus: (orderId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'updateOrderStatus', { orderId }),
    cancelOrder: (orderId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'cancelOrder', { orderId }),
    addTracking: (orderId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'addTracking', { orderId }),
    getTracking: (orderId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'getTracking', { orderId }),
    getOrderHistory: (orderId: string) =>
        getApiEndpointBuilder().buildUrl('orders', 'getOrderHistory', { orderId }),

    // Obtenir la configuration d'un endpoint
    getConfig: (group: string, endpoint: string) =>
        getApiEndpointBuilder().getEndpointConfig(group, endpoint),

    // Générer la documentation
    generateDocs: (group: string) =>
        getApiEndpointBuilder().generateOpenAPI(group)
};

/**
 * Middleware pour valider les endpoints
 */
export function validateEndpoint(
    method: HttpMethod,
    path: string,
    userRole?: string
): { isValid: boolean; error?: string; config?: EndpointConfig } {
    // Chercher l'endpoint correspondant
    for (const [groupName, group] of Object.entries(API_CONFIG.endpoints)) {
        for (const [endpointName, endpointConfig] of Object.entries(group.endpoints)) {
            // Vérifier si la méthode correspond
            if (endpointConfig.method !== method) continue;

            // Vérifier si le chemin correspond (simplifié)
            const basePath = `/api/${endpointConfig.version}${group.basePath}`;
            const fullPath = `${basePath}${endpointConfig.path}`;

            // Pour simplifier, on vérifie juste si le chemin commence par le pattern
            // Dans une implémentation réelle, il faudrait un routeur plus sophistiqué
            if (path.startsWith(basePath)) {
                // Vérifier les autorisations
                if (endpointConfig.requiresAuth && !userRole) {
                    return {
                        isValid: false,
                        error: 'Authentification requise'
                    };
                }

                if (endpointConfig.allowedRoles && userRole) {
                    if (!endpointConfig.allowedRoles.includes(userRole)) {
                        return {
                            isValid: false,
                            error: 'Autorisation insuffisante'
                        };
                    }
                }

                return {
                    isValid: true,
                    config: endpointConfig
                };
            }
        }
    }

    return {
        isValid: false,
        error: 'Endpoint non trouvé'
    };
}

/**
 * Classe client HTTP pour consommer les APIs
 */
export class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || API_CONFIG.baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    setAuthToken(token: string): void {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    async request<T>(
        group: string,
        endpoint: string,
        options: {
            params?: Record<string, string | number>;
            queryParams?: Record<string, string | number>;
            data?: any;
            headers?: Record<string, string>;
            timeout?: number;
        } = {}
    ): Promise<T> {
        const builder = new ApiEndpointBuilder(this.baseUrl);
        const config = builder.getEndpointConfig(group, endpoint);

        if (!config) {
            throw new Error(`Endpoint ${group}.${endpoint} non trouvé`);
        }

        const url = builder.buildUrl(
            group,
            endpoint,
            options.params || {},
            options.queryParams || {}
        );

        const headers = {
            ...this.defaultHeaders,
            ...options.headers
        };

        const fetchOptions: RequestInit = {
            method: config.method,
            headers,
            signal: AbortSignal.timeout(options.timeout || API_CONFIG.timeout)
        };

        if (options.data && (config.method === HttpMethod.POST || config.method === HttpMethod.PUT)) {
            fetchOptions.body = JSON.stringify(options.data);
        }

        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json() as T;
        } catch (error) {
            // Log l'erreur si configuré
            if (config.logging?.enabled) {
                console.error(`API Error [${group}.${endpoint}]:`, error);
            }

            throw error;
        }
    }

    // Méthodes spécifiques pour les commandes
    async addToCart(data: any) {
        return this.request('orders', 'addToCart', { data });
    }

    async getCart() {
        return this.request('orders', 'getCart');
    }

    async checkout(data: any) {
        return this.request('orders', 'checkout', { data });
    }

    async getMyOrders(params?: Record<string, string | number>) {
        return this.request('orders', 'getMyOrders', { queryParams: params });
    }
}

/**
 * Démonstration de l'utilisation
 */
export function demonstrateApiEndpoints(): void {
    const builder = getApiEndpointBuilder();

    console.log('=== Configuration des Endpoints API ===\n');

    // Afficher les endpoints de commandes
    const ordersGroup = API_CONFIG.endpoints.orders;
    console.log(`Groupe: ${ordersGroup.name}`);
    console.log(`Description: ${ordersGroup.description}`);
    console.log(`Base Path: ${ordersGroup.basePath}`);
    console.log(`Nombre d'endpoints: ${Object.keys(ordersGroup.endpoints).length}\n`);

    // Générer des URLs d'exemple
    console.log('=== URLs d\'exemple ===\n');

    console.log('Panier:');
    console.log(`- Ajouter au panier: ${ApiEndpoints.addToCart()}`);
    console.log(`- Voir panier: ${ApiEndpoints.getCart()}`);
    console.log(`- Mettre à jour article: ${ApiEndpoints.updateCartItem('item_123')}`);
    console.log(`- Retirer article: ${ApiEndpoints.removeCartItem('item_123')}\n`);

    console.log('Commandes:');
    console.log(`- Checkout: ${ApiEndpoints.checkout()}`);
    console.log(`- Mes commandes: ${ApiEndpoints.getMyOrders({ page: 1, limit: 10 })}`);
    console.log(`- Détails commande: ${ApiEndpoints.getOrderDetails('order_123')}`);
    console.log(`- Historique: ${ApiEndpoints.getOrderHistory('order_123')}\n`);

    // Afficher la configuration d'un endpoint
    console.log('=== Configuration d\'endpoint ===\n');

    const config = ApiEndpoints.getConfig('orders', 'addToCart');
    if (config) {
        console.log('Endpoint: addToCart');
        console.log(`Méthode: ${config.method}`);
        console.log(`Description: ${config.description}`);
        console.log(`Authentification requise: ${config.requiresAuth}`);
        console.log(`Rôles autorisés: ${config.allowedRoles?.join(', ')}`);
        console.log(`Rate limiting: ${config.rateLimit?.maxRequests} req/${config.rateLimit?.windowMs}ms`);
    }

    // Exemple d'utilisation du client API
    console.log('\n=== Exemple client API ===\n');

    const apiClient = new ApiClient();
    apiClient.setAuthToken('fake-jwt-token');

    console.log('Client API initialisé avec token JWT');
    console.log('Méthodes disponibles:');
    console.log('- apiClient.addToCart(data)');
    console.log('- apiClient.getCart()');
    console.log('- apiClient.checkout(data)');
    console.log('- apiClient.getMyOrders(params)');
}

// Exécuter la démonstration si le fichier est exécuté directement
if (require.main === module) {
    demonstrateApiEndpoints();
}