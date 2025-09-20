import { useState, useEffect, useCallback } from "react"
import { fuelTypesApiService } from "~/services/fuelTypesService"
import type { FuelType, CreateFuelTypeRequest, UpdateFuelTypeRequest } from "~/types/fuel-type"
import type { FuelTypeFormData } from "~/lib/schemas"

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

  const fetchFuelTypes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fuelTypesApiService.getAllWithFilters({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        active: statusFilter !== null ? statusFilter : undefined,
        sortBy: "name",
        sortOrder: "asc",
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
  }, [currentPage, searchQuery, statusFilter])

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

  const create = async (formData: FuelTypeFormData): Promise<void> => {
    const requestData: CreateFuelTypeRequest = {
      name: formData.name,
      active: formData.active,
    }
    
    const response = await fuelTypesApiService.create(requestData)
    
    if (response.success) {
      await fetchFuelTypes()
      await fetchStats()
    } else {
      throw new Error(response.message || 'Failed to create fuel type')
    }
  }

  const update = async (id: string, formData: FuelTypeFormData): Promise<void> => {
    const requestData: UpdateFuelTypeRequest = {
      name: formData.name,
      active: formData.active,
    }
    
    const response = await fuelTypesApiService.update(id, requestData)
    
    if (response.success) {
      await fetchFuelTypes()
      await fetchStats()
    } else {
      throw new Error(response.message || 'Failed to update fuel type')
    }
  }

  const remove = async (id: string): Promise<void> => {
    const response = await fuelTypesApiService.delete(id)
    
    if (response.success) {
      await fetchFuelTypes()
      await fetchStats()
    } else {
      throw new Error(response.message || 'Failed to delete fuel type')
    }
  }

  const toggleStatus = async (fuelType: FuelType, newStatus: boolean): Promise<void> => {
    const response = await fuelTypesApiService.updateStatus(fuelType._id, newStatus)
    
    if (response.success) {
      await fetchFuelTypes()
      await fetchStats()
    } else {
      throw new Error(response.message || 'Failed to update fuel type status')
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
    
    // Filter setters
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    
    // Actions
    create,
    update,
    remove,
    toggleStatus,
    
    // Refresh
    refresh: () => {
      fetchFuelTypes()
      fetchStats()
    }
  }
}
