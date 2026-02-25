import { createPinia } from 'pinia'
import type { App } from 'vue'
import { useProductStore } from './modules/product.store'
import { useCategoryStore } from './modules/category.store'
import { useTagStore } from './modules/tag.store'
import { useUnitStore } from './modules/unit.store'
import { useInventoryStore } from './modules/inventory.store'

export const pinia = createPinia()

export function installStores(app: App) {
  app.use(pinia)
}

export {
  useProductStore,
  useCategoryStore,
  useTagStore,
  useUnitStore,
  useInventoryStore
}

export interface RootState {
  product: ReturnType<typeof useProductStore>
  category: ReturnType<typeof useCategoryStore>
  tag: ReturnType<typeof useTagStore>
  unit: ReturnType<typeof useUnitStore>
  inventory: ReturnType<typeof useInventoryStore>
}

export const useStores = (): RootState => ({
  product: useProductStore(),
  category: useCategoryStore(),
  tag: useTagStore(),
  unit: useUnitStore(),
  inventory: useInventoryStore()
})

export default {
  pinia,
  install: installStores,
  useProductStore,
  useCategoryStore,
  useTagStore,
  useUnitStore,
  useInventoryStore,
  useStores
}
