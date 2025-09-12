import { useState, useEffect } from "react"
import { makesApiService } from "./makes-api"
import type { Make } from "~/types/make"
import type { MakeFormData } from "~/lib/schemas/make"

export function useMakes() {
  const [data, setData] = useState<Make[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  })

  // Load initial data
  useEffect(() => {
    loadMakes()
  }, [])

  // Reload when filters or pagination change
  useEffect(() => {
    loadMakes()
  }, [searchQuery, statusFilter, pagination.page, pagination.limit])

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
    setIsLoading(true)
    setError(null)
    try {
      const newMake = await makesApiService.create(formData)
      setData(prev => [newMake, ...prev])
      return newMake
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create make'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Update make
  const update = async (id: string, formData: MakeFormData): Promise<Make> => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedMake = await makesApiService.update(id, formData)
      setData(prev => prev.map(item => item.id === id ? updatedMake : item))
      return updatedMake
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update make'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Delete make
  const deleteMake = async (id: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await makesApiService.delete(id)
      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete make'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Handle status toggle
  const toggleStatus = async (make: Make, newStatus: boolean): Promise<void> => {
    setError(null)
    try {
      const updatedMake = await makesApiService.updateStatus(make.id, newStatus)
      setData(prev => prev.map(item => item.id === make.id ? updatedMake : item))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle make status'
      setError(errorMessage)
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

  return {
    // Data
    data,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    pagination,

    // CRUD Actions
    create,
    update,
    delete: deleteMake,
    refresh: loadMakes,

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
