import { useState, useEffect, useCallback } from "react"
import { fuelTypesApiService } from "~/services/fuelTypesService"
import type { FuelType, CreateFuelTypeRequest, UpdateFuelTypeRequest } from "~/types/fuel-type"
import type { FuelTypeFormData } from "~/lib/schemas"

interface UseFuelTypesFilters {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface FuelTypeStats {
  total: number
  active: number
  inactive: number
}

interface Pagination {
  currentPage: number
  totalPages: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

export function useFuelTypes() {
  const [data, setData] = useState<FuelType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<FuelTypeStats | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  
  // Filters state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const fetchFuelTypes = useCallback(async (filters: UseFuelTypesFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fuelTypesApiService.getAllWithFilters({
        page: filters.page || currentPage,
        limit: 10,
        search: filters.search || searchQuery,
        active: filters.active !== undefined ? filters.active : (statusFilter !== null ? statusFilter : undefined),
        sortBy: filters.sortBy || sortBy,
        sortOrder: filters.sortOrder || sortOrder,
        ...filters
      })

      if (response.success && response.data) {
        setData(response.data.fuelTypes)
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          total: response.data.pagination.total,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
        })
      }
    } catch (err) {
      console.error('Error fetching fuel types:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch fuel types')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, statusFilter, sortBy, sortOrder])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fuelTypesApiService.getStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (err) {
      console.error('Error fetching fuel type stats:', err)
    }
  }, [])

  const createFuelType = async (formData: FuelTypeFormData): Promise<FuelType> => {
    try {
      const requestData: CreateFuelTypeRequest = {
        name: formData.name,
        active: formData.active,
      }
      
      const response = await fuelTypesApiService.create(requestData)
      
      if (response.success && response.data) {
        // Refresh the list
        await fetchFuelTypes()
        await fetchStats()
        return response.data
      } else {
        throw new Error(response.message || 'Failed to create fuel type')
      }
    } catch (err) {
      console.error('Error creating fuel type:', err)
      throw err
    }
  }

  const updateFuelType = async (id: string, formData: FuelTypeFormData): Promise<FuelType> => {
    try {
      const requestData: UpdateFuelTypeRequest = {
        name: formData.name,
        active: formData.active,
      }
      
      const response = await fuelTypesApiService.update(id, requestData)
      
      if (response.success && response.data) {
        // Refresh the list
        await fetchFuelTypes()
        await fetchStats()
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update fuel type')
      }
    } catch (err) {
      console.error('Error updating fuel type:', err)
      throw err
    }
  }

  const deleteFuelType = async (id: string): Promise<void> => {
    try {
      const response = await fuelTypesApiService.delete(id)
      
      if (response.success) {
        // Refresh the list
        await fetchFuelTypes()
        await fetchStats()
      } else {
        throw new Error(response.message || 'Failed to delete fuel type')
      }
    } catch (err) {
      console.error('Error deleting fuel type:', err)
      throw err
    }
  }

  const toggleStatus = async (fuelType: FuelType, newStatus: boolean): Promise<FuelType> => {
    try {
      const response = await fuelTypesApiService.updateStatus(fuelType._id, newStatus)
      
      if (response.success && response.data) {
        // Refresh the list
        await fetchFuelTypes()
        await fetchStats()
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update fuel type status')
      }
    } catch (err) {
      console.error('Error toggling fuel type status:', err)
      throw err
    }
  }

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchFuelTypes()
  }, [fetchFuelTypes])

  // Effect to fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, statusFilter])

  return {
    // Data
    data,
    loading,
    error,
    stats,
    pagination,
    
    // Filters
    currentPage,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    
    // Filter setters
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    setSortBy,
    setSortOrder,
    
    // Actions
    fetchFuelTypes,
    createFuelType,
    updateFuelType,
    deleteFuelType,
    toggleStatus,
    
    // Refresh
    refresh: () => {
      fetchFuelTypes()
      fetchStats()
    }
  }
}
