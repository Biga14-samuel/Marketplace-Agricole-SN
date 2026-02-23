/**
 * Déclarations globales pour corriger les incompatibilités de types
 */

declare module '@/modules/catalog/services/models/*' {
  export * from '@/modules/catalog/services/api/*';
}

// Augmenter les types pour ajouter les propriétés manquantes
declare global {
  interface Window {
    __INITIAL_STATE__?: any;
  }
}

export {};
