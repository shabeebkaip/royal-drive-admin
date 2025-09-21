import { useState, useEffect, useCallback } from "react"
import { statusesApiService } from "~/services/statusesService"
import type { Status, CreateStatusRequest, UpdateStatusRequest } from "~/types/status"
import type { StatusFormData } from "~/lib/schemas"

interface StatusStats {
  total: number
  active: number
  inactive: number
  defaultStatus?: {
    name: string
    code: string
  }
  mostUsed?: {
    name: string
    vehicleCount: number
  }
}

interface Pagination {
  currentPage: number
  totalPages: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

export function useStatuses() {
  const [data, setData] = useState<Status[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatusStats | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  
  // Filters state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null)
  const [defaultFilter, setDefaultFilter] = useState<boolean | null>(null)

  const fetchStatuses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await statusesApiService.getAllWithFilters({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        active: statusFilter !== null ? statusFilter : undefined,
        isDefault: defaultFilter !== null ? defaultFilter : undefined,
        sortBy: "name",
        sortOrder: "asc",
      })

      if (response.success && response.data) {
        setData(response.data.statuses)
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          total: response.data.pagination.total,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
        })
      } else {
        setError(response.error || "Failed to fetch statuses")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching statuses:", err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, statusFilter, defaultFilter])

  const fetchStats = useCallback(async () => {
    try {
      const response = await statusesApiService.getStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (err) {
      console.error("Error fetching status stats:", err)
    }
  }, [])

  // CRUD operations
  const create = useCallback(async (data: StatusFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await statusesApiService.create(data)
      
      if (response.success) {
        await fetchStatuses()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to create status")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchStatuses, fetchStats])

  const update = useCallback(async (id: string, data: StatusFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await statusesApiService.update(id, data)
      
      if (response.success) {
        await fetchStatuses()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update status")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchStatuses, fetchStats])

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      const response = await statusesApiService.delete(id)
      
      if (response.success) {
        await fetchStatuses()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to delete status")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchStatuses, fetchStats])

  const toggleActiveStatus = useCallback(async (status: Status, newActiveState: boolean): Promise<void> => {
    try {
      const response = await statusesApiService.updateActiveStatus(status._id, {
        active: newActiveState
      })
      
      if (response.success) {
        await fetchStatuses()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update status active state")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }, [fetchStatuses, fetchStats])

  const setAsDefault = useCallback(async (status: Status): Promise<void> => {
    try {
      const response = await statusesApiService.setDefault(status._id)
      
      if (response.success) {
        await fetchStatuses()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to set default status")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }, [fetchStatuses, fetchStats])

  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, statusFilter, defaultFilter])

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
    defaultFilter,
    
    // Filter setters
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    setDefaultFilter,
    
    // Actions
    create,
    update,
    remove,
    toggleActiveStatus,
    setAsDefault,
    
    // Refresh
    refresh: () => {
      // Reset all filters
      setCurrentPage(1)
      setSearchQuery("")
      setStatusFilter(null)
      setDefaultFilter(null)
      // This will trigger fetchStatuses via useEffect due to dependencies
    }
  }
}
