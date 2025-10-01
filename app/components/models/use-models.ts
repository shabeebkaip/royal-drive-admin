import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { Model } from "~/types/model"
import type { ModelFormData } from "~/lib/schemas/model"
import { modelsApiService, type ModelStats } from "./models-api"

interface PaginationState {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export function useModels() {
  const [data, setData] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  const [makeFilter, setMakeFilter] = useState<string | undefined>(undefined)
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string | undefined>(undefined)
  const [stats, setStats] = useState<ModelStats>({ total: 0, active: 0, inactive: 0 })
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  })

  // Load models data
  const loadModels = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await modelsApiService.getAllWithFilters({
        search: searchQuery || undefined,
        active: statusFilter,
        make: makeFilter,
        vehicleType: vehicleTypeFilter,
        sortBy: 'name',
        sortOrder: 'asc',
        page: pagination.page,
        limit: pagination.limit
      })
      
      setData(response.data || [])
      if (response.pagination) {
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          pages: response.pagination.pages,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load models'
      setError(errorMessage)
      console.error('Failed to load models:', err)
      toast.error("Failed to load models", {
        description: errorMessage
      })
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load statistics
  const loadStats = async () => {
    setIsStatsLoading(true)
    try {
      const statsData = await modelsApiService.getStats()
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load models stats:', err)
      // Don't show toast for stats errors, just use defaults
    } finally {
      setIsStatsLoading(false)
    }
  }

  // Pagination functions
  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const nextPage = () => {
    if (pagination.hasNext) {
      goToPage(pagination.page + 1)
    }
  }

  const prevPage = () => {
    if (pagination.hasPrev) {
      goToPage(pagination.page - 1)
    }
  }

  const setPageSize = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
  }

  // Create new model
  const create = async (formData: ModelFormData): Promise<Model> => {
    setError(null)
    console.log('useModels create - Form data received:', formData)
    console.log('useModels create - Make ID:', formData.make)
    console.log('useModels create - Vehicle Type ID:', formData.vehicleType)
    
    try {
      const newModel = await modelsApiService.create(formData)
      console.log('useModels create - API response:', newModel)
      setData(prev => [newModel, ...prev])
      // Reload stats after creating
      loadStats()
      toast.success("Model created successfully", {
        description: `${newModel.name} has been added to your inventory.`
      })
      return newModel
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create model'
      console.error('useModels create - Error:', err)
      setError(errorMessage)
      toast.error("Failed to create model", {
        description: errorMessage
      })
      throw err
    }
  }

  // Update model
  const update = async (id: string, formData: ModelFormData): Promise<Model> => {
    setError(null)
    try {
      const updatedModel = await modelsApiService.update(id, formData)
      setData(prev => prev.map(item => item.id === id ? updatedModel : item))
      // Reload stats after updating
      loadStats()
      toast.success("Model updated successfully", {
        description: `${updatedModel.name} has been updated.`
      })
      return updatedModel
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update model'
      setError(errorMessage)
      toast.error("Failed to update model", {
        description: errorMessage
      })
      throw err
    }
  }

  // Delete model
  const deleteModel = async (id: string): Promise<void> => {
    setError(null)
    try {
      const modelToDelete = data.find(item => item.id === id)
      await modelsApiService.delete(id)
      setData(prev => prev.filter(item => item.id !== id))
      // Reload stats after deleting
      loadStats()
      toast.success("Model deleted successfully", {
        description: modelToDelete ? `${modelToDelete.name} has been removed from your inventory.` : "Model has been deleted."
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete model'
      setError(errorMessage)
      toast.error("Failed to delete model", {
        description: errorMessage
      })
      throw err
    }
  }

  // Handle status toggle
  const toggleStatus = async (model: Model, newStatus: boolean): Promise<void> => {
    setError(null)
    
    // Optimistic update first
    setData(prev => prev.map(item => 
      item.id === model.id ? { ...item, active: newStatus } : item
    ))
    
    try {
      const updatedModel = await modelsApiService.updateStatus(model.id, newStatus)
      
      // Check if the API returned valid data
      if (!updatedModel || typeof updatedModel !== 'object' || !updatedModel.id) {
        console.warn('Status Toggle - Invalid API response, forcing refresh')
        // If API response is invalid, just refresh the data
        await loadModels()
        loadStats()
        toast.success(`Model ${newStatus ? 'activated' : 'deactivated'}`, {
          description: `${model.name} status has been updated.`
        })
        return
      }
      
      // Ensure we have all required fields for the Model interface
      const completeUpdatedModel: Model = {
        ...model,  // Start with original model data
        ...updatedModel,  // Override with API response
        active: newStatus,  // Ensure the status is definitely set
        updatedAt: updatedModel.updatedAt || new Date().toISOString(),
      }
      
      // Update with the complete data from API
      setData(prev => prev.map(item => 
        item.id === model.id ? completeUpdatedModel : item
      ))
      
      // Reload stats after status change
      loadStats()
      toast.success(`Model ${newStatus ? 'activated' : 'deactivated'}`, {
        description: `${model.name} is now ${newStatus ? 'active' : 'inactive'}.`
      })
    } catch (err) {
      // Revert optimistic update on error
      setData(prev => prev.map(item => 
        item.id === model.id ? model : item
      ))
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle model status'
      setError(errorMessage)
      toast.error("Failed to update status", {
        description: errorMessage
      })
      throw err
    }
  }

  // Handle search
  const search = async (query: string) => {
    setSearchQuery(query)
    // loadModels will be called automatically via useEffect
  }

  // Handle status filter
  const handleStatusFilter = (status: boolean | undefined) => {
    setStatusFilter(status)
    // Reset to first page when filtering
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Handle make filter
  const handleMakeFilter = (makeId: string | undefined) => {
    setMakeFilter(makeId)
    // Reset to first page when filtering
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Handle vehicle type filter
  const handleVehicleTypeFilter = (vehicleTypeId: string | undefined) => {
    setVehicleTypeFilter(vehicleTypeId)
    // Reset to first page when filtering
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Refresh all data (reset filters and reload)
  const refresh = async () => {
    setIsLoading(true)
    setSearchQuery("")
    setStatusFilter(undefined)
    setMakeFilter(undefined)
    setVehicleTypeFilter(undefined)
    setPagination(prev => ({ ...prev, page: 1 }))
    
    try {
      // Load fresh data without any filters
      const response = await modelsApiService.getAllWithFilters({
        page: 1,
        limit: pagination.limit,
        sortBy: 'name',
        sortOrder: 'asc'
      })
      
      setData(response.data || [])
      if (response.pagination) {
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          pages: response.pagination.pages,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev,
        })
      }
      loadStats()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data'
      setError(errorMessage)
      console.error('Failed to refresh models:', err)
      toast.error("Failed to refresh data", {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when dependencies change
  useEffect(() => {
    loadModels()
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, makeFilter, vehicleTypeFilter])

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [])

  return {
    // Data
    data,
    isLoading,
    isStatsLoading,
    error,
    stats,
    pagination,
    searchQuery,
    statusFilter,
    makeFilter,
    vehicleTypeFilter,
    
    // Actions
    create,
    update,
    deleteModel,
    toggleStatus,
    search,
    refresh,
    
    // Pagination
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    
    // Filters
    setStatusFilter: handleStatusFilter,
    setMakeFilter: handleMakeFilter,
    setVehicleTypeFilter: handleVehicleTypeFilter,
  }
}
