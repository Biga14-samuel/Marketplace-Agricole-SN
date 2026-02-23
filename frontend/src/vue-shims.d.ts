// Déclarations globales pour TypeScript dans les composants Vue

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Utilitaires globaux
declare global {
  const getErrorMessage: (error: unknown) => string;
}

export {};
