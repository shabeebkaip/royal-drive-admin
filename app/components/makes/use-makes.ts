import { useState, useEffect } from "react"
import { toast } from "sonner"
import { makesApiService } from "./makes-api"
import type { Make } from "~/types/make"
import type { MakeFormData } from "~/lib/schemas/make"

export function useMakes() {
  const [data, setData] = useState<Make[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStatsLoading, setIsStatsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  
  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  })
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  })

  // Load initial data and stats
  useEffect(() => {
    loadMakes()
    loadStats()
  }, [])

  // Reload when filters or pagination change
  useEffect(() => {
    loadMakes()
  }, [searchQuery, statusFilter, pagination.page, pagination.limit])

  const loadStats = async () => {
    try {
      setIsStatsLoading(true)
      const statsData = await makesApiService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Keep current stats or set defaults
    } finally {
      setIsStatsLoading(false)
    }
  }

  const loadMakes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await makesApiService.getAllWithFilters({
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load makes'
      setError(errorMessage)
      console.error('Failed to load makes:', err)
      toast.error("Failed to load makes", {
        description: errorMessage
      })
      // Don't fall back to mock data - show the error
      setData([])
    } finally {
      setIsLoading(false)
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

  // Create new make
  const create = async (formData: MakeFormData): Promise<Make> => {
    setError(null)
    try {
      const newMake = await makesApiService.create(formData)
      setData(prev => [newMake, ...prev])
      // Reload stats after creating
      loadStats()
      toast.success("Make created successfully", {
        description: `${newMake.name} has been added to your inventory.`
      })
      return newMake
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create make'
      setError(errorMessage)
      toast.error("Failed to create make", {
        description: errorMessage
      })
      throw err
    }
  }

  // Update make
  const update = async (id: string, formData: MakeFormData): Promise<Make> => {
    setError(null)
    try {
      const updatedMake = await makesApiService.update(id, formData)
      setData(prev => prev.map(item => item.id === id ? updatedMake : item))
      // Reload stats after updating
      loadStats()
      toast.success("Make updated successfully", {
        description: `${updatedMake.name} has been updated.`
      })
      return updatedMake
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update make'
      setError(errorMessage)
      toast.error("Failed to update make", {
        description: errorMessage
      })
      throw err
    }
  }

  // Delete make
  const deleteMake = async (id: string): Promise<void> => {
    setError(null)
    try {
      const makeToDelete = data.find(item => item.id === id)
      await makesApiService.delete(id)
      setData(prev => prev.filter(item => item.id !== id))
      // Reload stats after deleting
      loadStats()
      toast.success("Make deleted successfully", {
        description: makeToDelete ? `${makeToDelete.name} has been removed from your inventory.` : "Make has been deleted."
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete make'
      setError(errorMessage)
      toast.error("Failed to delete make", {
        description: errorMessage
      })
      throw err
    }
  }

  // Handle status toggle
  const toggleStatus = async (make: Make, newStatus: boolean): Promise<void> => {
    setError(null)
    
    // Optimistic update first
    setData(prev => prev.map(item => 
      item.id === make.id ? { ...item, active: newStatus } : item
    ))
    
    try {
      const updatedMake = await makesApiService.updateStatus(make.id, newStatus)
      
      // Check if the API returned valid data
      if (!updatedMake || typeof updatedMake !== 'object' || !updatedMake.id) {
        console.warn('Status Toggle - Invalid API response, forcing refresh')
        // If API response is invalid, just refresh the data
        await loadMakes()
        loadStats()
        toast.success(`Make ${newStatus ? 'activated' : 'deactivated'}`, {
          description: `${make.name} status has been updated.`
        })
        return
      }
      
      // Ensure we have all required fields for the Make interface
      const completeUpdatedMake: Make = {
        ...make,  // Start with original make data
        ...updatedMake,  // Override with API response
        active: newStatus,  // Ensure the status is definitely set
        updatedAt: updatedMake.updatedAt || new Date().toISOString(),
      }
      
      // Update with the complete data from API
      setData(prev => prev.map(item => 
        item.id === make.id ? completeUpdatedMake : item
      ))
      
      // Reload stats after status change
      loadStats()
      toast.success(`Make ${newStatus ? 'activated' : 'deactivated'}`, {
        description: `${make.name} is now ${newStatus ? 'active' : 'inactive'}.`
      })
    } catch (err) {
      // Revert optimistic update on error
      setData(prev => prev.map(item => 
        item.id === make.id ? make : item
      ))
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle make status'
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
    // loadMakes will be called automatically via useEffect
  }

  // Handle status filter
  const handleStatusFilter = (status: boolean | undefined) => {
    setStatusFilter(status)
    // loadMakes will be called automatically via useEffect
  }

  // Get dropdown options for other forms
  const getDropdownOptions = async () => {
    try {
      return await makesApiService.getDropdownOptions()
    } catch (error) {
      console.error('Failed to load dropdown options:', error)
      return []
    }
  }

  // Get statistics
  const getStats = async () => {
    try {
      return await makesApiService.getStats()
    } catch (error) {
      console.error('Failed to load stats:', error)
      return { total: 0, active: 0, inactive: 0 }
    }
  }

  // Refresh with full reset
  const refreshWithReset = async () => {
    // Reset all filters and pagination
    setSearchQuery("")
    setStatusFilter(undefined)
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
      hasNext: false,
      hasPrev: false,
    })
    
    // Load fresh data and stats
    setIsLoading(true)
    setError(null)
    try {
      const response = await makesApiService.getAllWithFilters({
        sortBy: 'name',
        sortOrder: 'asc',
        page: 1,
        limit: 10
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
      
      // Reload stats
      await loadStats()
      
      toast.success("Data refreshed", {
        description: "All filters and pagination have been reset."
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh makes'
      setError(errorMessage)
      toast.error("Failed to refresh data", {
        description: errorMessage
      })
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // Data
    data,
    isLoading,
    isStatsLoading,
    error,
    searchQuery,
    statusFilter,
    pagination,
    stats,

    // CRUD Actions
    create,
    update,
    delete: deleteMake,
    refresh: refreshWithReset,

    // Enhanced Actions
    toggleStatus,
    search,
    setStatusFilter: handleStatusFilter,
    
    // Pagination Actions
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    
    // Utility functions
    getDropdownOptions,
    getStats,
  }
}
