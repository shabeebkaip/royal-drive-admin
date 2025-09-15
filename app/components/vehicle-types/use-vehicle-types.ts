import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { VehicleType } from "~/types/vehicle-type"
import type { VehicleTypeFormData } from "~/lib/schemas/vehicle-type"
import { vehicleTypesApiService, type VehicleTypeStats } from "./vehicle-types-api"

interface PaginationState {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export function useVehicleTypes() {
  const [data, setData] = useState<VehicleType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  const [stats, setStats] = useState<VehicleTypeStats>({ total: 0, active: 0, inactive: 0 })
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  })

  // Load vehicle types data
  const loadVehicleTypes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await vehicleTypesApiService.getAllWithFilters({
        search: searchQuery || undefined,
        active: statusFilter,
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle types'
      setError(errorMessage)
      console.error('Failed to load vehicle types:', err)
      toast.error("Failed to load vehicle types", {
        description: errorMessage
      })
      // Don't fall back to mock data - show the error
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load statistics
  const loadStats = async () => {
    setIsStatsLoading(true)
    try {
      const statsData = await vehicleTypesApiService.getStats()
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load vehicle types stats:', err)
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

  // Create new vehicle type
  const create = async (formData: VehicleTypeFormData): Promise<VehicleType> => {
    setError(null)
    try {
      const newVehicleType = await vehicleTypesApiService.create(formData)
      setData(prev => [newVehicleType, ...prev])
      // Reload stats after creating
      loadStats()
      toast.success("Vehicle type created successfully", {
        description: `${newVehicleType.name} has been added to your inventory.`
      })
      return newVehicleType
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create vehicle type'
      setError(errorMessage)
      toast.error("Failed to create vehicle type", {
        description: errorMessage
      })
      throw err
    }
  }

  // Update vehicle type
  const update = async (id: string, formData: VehicleTypeFormData): Promise<VehicleType> => {
    setError(null)
    try {
      const updatedVehicleType = await vehicleTypesApiService.update(id, formData)
      setData(prev => prev.map(item => item.id === id ? updatedVehicleType : item))
      // Reload stats after updating
      loadStats()
      toast.success("Vehicle type updated successfully", {
        description: `${updatedVehicleType.name} has been updated.`
      })
      return updatedVehicleType
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update vehicle type'
      setError(errorMessage)
      toast.error("Failed to update vehicle type", {
        description: errorMessage
      })
      throw err
    }
  }

  // Delete vehicle type
  const deleteMake = async (id: string): Promise<void> => {
    setError(null)
    try {
      const vehicleTypeToDelete = data.find(item => item.id === id)
      await vehicleTypesApiService.delete(id)
      setData(prev => prev.filter(item => item.id !== id))
      // Reload stats after deleting
      loadStats()
      toast.success("Vehicle type deleted successfully", {
        description: vehicleTypeToDelete ? `${vehicleTypeToDelete.name} has been removed from your inventory.` : "Vehicle type has been deleted."
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete vehicle type'
      setError(errorMessage)
      toast.error("Failed to delete vehicle type", {
        description: errorMessage
      })
      throw err
    }
  }

  // Handle status toggle
  const toggleStatus = async (vehicleType: VehicleType, newStatus: boolean): Promise<void> => {
    setError(null)
    
    // Optimistic update first
    setData(prev => prev.map(item => 
      item.id === vehicleType.id ? { ...item, isActive: newStatus } : item
    ))
    
    try {
      const updatedVehicleType = await vehicleTypesApiService.updateStatus(vehicleType.id, newStatus)
      
      // Check if the API returned valid data
      if (!updatedVehicleType || typeof updatedVehicleType !== 'object' || !updatedVehicleType.id) {
        console.warn('Status Toggle - Invalid API response, forcing refresh')
        // If API response is invalid, just refresh the data
        await loadVehicleTypes()
        loadStats()
        toast.success(`Vehicle type ${newStatus ? 'activated' : 'deactivated'}`, {
          description: `${vehicleType.name} status has been updated.`
        })
        return
      }
      
      // Ensure we have all required fields for the VehicleType interface
      const completeUpdatedVehicleType: VehicleType = {
        ...vehicleType,  // Start with original vehicle type data
        ...updatedVehicleType,  // Override with API response
        isActive: newStatus,  // Ensure the status is definitely set
        updatedAt: updatedVehicleType.updatedAt || new Date().toISOString(),
      }
      
      // Update with the complete data from API
      setData(prev => prev.map(item => 
        item.id === vehicleType.id ? completeUpdatedVehicleType : item
      ))
      
      // Reload stats after status change
      loadStats()
      toast.success(`Vehicle type ${newStatus ? 'activated' : 'deactivated'}`, {
        description: `${vehicleType.name} is now ${newStatus ? 'active' : 'inactive'}.`
      })
    } catch (err) {
      // Revert optimistic update on error
      setData(prev => prev.map(item => 
        item.id === vehicleType.id ? vehicleType : item
      ))
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle vehicle type status'
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
    // loadVehicleTypes will be called automatically via useEffect
  }

  // Handle status filter
  const handleStatusFilter = (status: boolean | undefined) => {
    setStatusFilter(status)
    // Reset to first page when filtering
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Refresh all data (reset filters and reload)
  const refresh = async () => {
    setIsLoading(true)
    setSearchQuery("")
    setStatusFilter(undefined)
    setPagination(prev => ({ ...prev, page: 1 }))
    
    try {
      // Load fresh data without any filters
      const response = await vehicleTypesApiService.getAllWithFilters({
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
      console.error('Failed to refresh vehicle types:', err)
      toast.error("Failed to refresh data", {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when dependencies change
  useEffect(() => {
    loadVehicleTypes()
  }, [pagination.page, pagination.limit, searchQuery, statusFilter])

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
    
    // Actions
    create,
    update,
    deleteMake,
    toggleStatus,
    search,
    refresh,
    
    // Pagination
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    setStatusFilter: handleStatusFilter,
  }
}
