// @ts-nocheck
// stores/inventory.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Inventory } from '@/modules/catalog/types/catalog.types'
import api from '@/shared/services/api'

export const useInventoryStore = defineStore('inventory', () => {
  const inventories = ref<Inventory[]>([])
  const currentInventory = ref<Inventory | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // GET /inventory - Récupérer tous les inventaires
  const fetchAllInventories = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get('/inventory')
      inventories.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des inventaires'
      console.error('Error fetching inventories:', err)
    } finally {
      loading.value = false
    }
  }

  // GET /inventory/:id - Récupérer un inventaire par ID
  const fetchInventoryById = async (id: string | number) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get(`/inventory/${id}`)
      currentInventory.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la récupération de l'inventaire ${id}`
      console.error(`Error fetching inventory ${id}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // POST /inventory - Créer un nouvel inventaire
  const createInventory = async (inventoryData: Partial<Inventory>) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post('/inventory', inventoryData)
      inventories.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de l\'inventaire'
      console.error('Error creating inventory:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // PUT /inventory/:id - Mettre à jour un inventaire
  const updateInventory = async (id: string | number, inventoryData: Partial<Inventory>) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.put(`/inventory/${id}`, inventoryData)
      
      // Mettre à jour dans la liste
      const index = inventories.value.findIndex(inv => inv.id === id)
      if (index !== -1) {
        inventories.value[index] = response.data
      }
      
      // Mettre à jour l'élément courant si c'est lui
      if (currentInventory.value?.id === id) {
        currentInventory.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la mise à jour de l'inventaire ${id}`
      console.error(`Error updating inventory ${id}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // DELETE /inventory/:id - Supprimer un inventaire
  const deleteInventory = async (id: string | number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/inventory/${id}`)
      
      // Retirer de la liste
      inventories.value = inventories.value.filter(inv => inv.id !== id)
      
      // Réinitialiser l'élément courant si c'est lui
      if (currentInventory.value?.id === id) {
        currentInventory.value = null
      }
    } catch (err: any) {
      error.value = err.message || `Erreur lors de la suppression de l'inventaire ${id}`
      console.error(`Error deleting inventory ${id}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Rechercher des inventaires (si endpoint disponible)
  const searchInventories = async (criteria: Record<string, any>) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get('/inventory/search', { params: criteria })
      inventories.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la recherche des inventaires'
      console.error('Error searching inventories:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Réinitialiser l'état
  const resetCurrentInventory = () => {
    currentInventory.value = null
  }

  // Clear errors
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    inventories,
    currentInventory,
    loading,
    error,
    
    // Getters (computed)
    getInventoryById: (id: string | number) => 
      inventories.value.find(inv => inv.id === id),
    getActiveInventories: () => 
      inventories.value.filter(inv => inv.isActive),
    
    // Actions
    fetchAllInventories,
    fetchInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
    searchInventories,
    resetCurrentInventory,
    clearError
  }
})