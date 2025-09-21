import { useState, useEffect, useCallback } from "react"
import { drivetrainsApiService } from "~/services/drivetrainsService"
import type { Drivetrain, CreateDrivetrainRequest, UpdateDrivetrainRequest } from "~/types/drivetrain"
import type { DrivetrainFormData } from "~/lib/schemas"

interface DrivetrainStats {
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

export function useDrivetrains() {
  const [data, setData] = useState<Drivetrain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DrivetrainStats | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  
  // Filters state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null)

  const fetchDrivetrains = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await drivetrainsApiService.getAllWithFilters({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        active: statusFilter !== null ? statusFilter : undefined,
        sortBy: "name",
        sortOrder: "asc",
      })

      if (response.success && response.data) {
        setData(response.data.drivetrains)
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          total: response.data.pagination.total,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
        })
      } else {
        setError(response.error || "Failed to fetch drivetrains")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching drivetrains:", err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, statusFilter])

  const fetchStats = useCallback(async () => {
    try {
      const response = await drivetrainsApiService.getStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (err) {
      console.error("Error fetching drivetrain stats:", err)
    }
  }, [])

  // CRUD operations
  const create = useCallback(async (data: DrivetrainFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await drivetrainsApiService.create(data)
      
      if (response.success) {
        await fetchDrivetrains()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to create drivetrain")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDrivetrains, fetchStats])

  const update = useCallback(async (id: string, data: DrivetrainFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await drivetrainsApiService.update(id, data)
      
      if (response.success) {
        await fetchDrivetrains()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update drivetrain")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDrivetrains, fetchStats])

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      const response = await drivetrainsApiService.delete(id)
      
      if (response.success) {
        await fetchDrivetrains()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to delete drivetrain")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDrivetrains, fetchStats])

  const toggleStatus = useCallback(async (drivetrain: Drivetrain, newStatus: boolean): Promise<void> => {
    try {
      const response = await drivetrainsApiService.updateStatus(drivetrain._id, {
        active: newStatus
      })
      
      if (response.success) {
        await fetchDrivetrains()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update drivetrain status")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }, [fetchDrivetrains, fetchStats])

  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchDrivetrains()
  }, [fetchDrivetrains])

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
      // This will trigger fetchDrivetrains via useEffect due to dependencies
    }
  }
}
