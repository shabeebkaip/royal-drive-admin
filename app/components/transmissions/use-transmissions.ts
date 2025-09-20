import { useState, useEffect, useCallback } from "react"
import { transmissionsApiService } from "~/services/transmissionsService"
import type { Transmission, CreateTransmissionRequest, UpdateTransmissionRequest } from "~/types/transmission"
import type { TransmissionFormData } from "~/lib/schemas"

interface TransmissionStats {
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

export function useTransmissions() {
  const [data, setData] = useState<Transmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<TransmissionStats | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  
  // Filters state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null)

  const fetchTransmissions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await transmissionsApiService.getAllWithFilters({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        active: statusFilter !== null ? statusFilter : undefined,
        sortBy: "name",
        sortOrder: "asc",
      })

      if (response.success && response.data) {
        setData(response.data.transmissions)
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          total: response.data.pagination.total,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
        })
      } else {
        setError(response.error || "Failed to fetch transmissions")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching transmissions:", err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, statusFilter])

  const fetchStats = useCallback(async () => {
    try {
      const response = await transmissionsApiService.getStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (err) {
      console.error("Error fetching transmission stats:", err)
    }
  }, [])

  // CRUD operations
  const create = useCallback(async (data: TransmissionFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await transmissionsApiService.create(data)
      
      if (response.success) {
        await fetchTransmissions()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to create transmission")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchTransmissions, fetchStats])

  const update = useCallback(async (id: string, data: TransmissionFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await transmissionsApiService.update(id, data)
      
      if (response.success) {
        await fetchTransmissions()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update transmission")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchTransmissions, fetchStats])

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      const response = await transmissionsApiService.delete(id)
      
      if (response.success) {
        await fetchTransmissions()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to delete transmission")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchTransmissions, fetchStats])

  const toggleStatus = useCallback(async (transmission: Transmission, newStatus: boolean): Promise<void> => {
    try {
      const response = await transmissionsApiService.updateStatus(transmission._id, {
        active: newStatus
      })
      
      if (response.success) {
        await fetchTransmissions()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update transmission status")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }, [fetchTransmissions, fetchStats])

  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchTransmissions()
  }, [fetchTransmissions])

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
      // Reset all filters
      setCurrentPage(1)
      setSearchQuery("")
      setStatusFilter(null)
      // This will trigger fetchTransmissions via useEffect due to dependencies
    }
  }
}
