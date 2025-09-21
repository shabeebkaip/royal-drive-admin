import { useState, useEffect, useCallback } from "react"
import { driveTypesApiService } from "~/services/driveTypesService"
import type { DriveType, CreateDriveTypeRequest, UpdateDriveTypeRequest } from "~/types/drive-type"
import type { DriveTypeFormData } from "~/lib/schemas"

interface DriveTypeStats {
  total: number
  active: number
  inactive: number
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

export function useDriveTypes() {
  const [data, setData] = useState<DriveType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DriveTypeStats | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  
  // Filters state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null)

  const fetchDriveTypes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await driveTypesApiService.getAllWithFilters({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        active: statusFilter !== null ? statusFilter : undefined,
        sortBy: "name",
        sortOrder: "asc",
      })

      if (response.success && response.data) {
        setData(response.data.driveTypes)
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          total: response.data.pagination.total,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
        })
      } else {
        setError(response.error || "Failed to fetch drive types")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching drive types:", err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, statusFilter])

  const fetchStats = useCallback(async () => {
    try {
      const response = await driveTypesApiService.getStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (err) {
      console.error("Error fetching drive type stats:", err)
    }
  }, [])

  // CRUD operations
  const create = useCallback(async (data: DriveTypeFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await driveTypesApiService.create(data)
      
      if (response.success) {
        await fetchDriveTypes()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to create drive type")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDriveTypes, fetchStats])

  const update = useCallback(async (id: string, data: DriveTypeFormData): Promise<void> => {
    try {
      setLoading(true)
      const response = await driveTypesApiService.update(id, data)
      
      if (response.success) {
        await fetchDriveTypes()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update drive type")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDriveTypes, fetchStats])

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      const response = await driveTypesApiService.delete(id)
      
      if (response.success) {
        await fetchDriveTypes()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to delete drive type")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDriveTypes, fetchStats])

  const toggleStatus = useCallback(async (driveType: DriveType, newStatus: boolean): Promise<void> => {
    try {
      const response = await driveTypesApiService.updateStatus(driveType._id, {
        active: newStatus
      })
      
      if (response.success) {
        await fetchDriveTypes()
        await fetchStats()
      } else {
        throw new Error(response.error || "Failed to update drive type status")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }, [fetchDriveTypes, fetchStats])

  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchDriveTypes()
  }, [fetchDriveTypes])

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
      // This will trigger fetchDriveTypes via useEffect due to dependencies
    }
  }
}
