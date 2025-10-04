import { useState, useEffect, useCallback } from 'react'
import { vehicleInventoryService, type VehicleFilters, type VehicleInventoryItem, type VehicleInventoryResponse } from '~/services/vehicleInventoryService'

export interface UseVehicleInventoryResult {
  // Data
  vehicles: VehicleInventoryItem[]
  pagination: VehicleInventoryResponse['data']['pagination'] | null
  
  // State
  loading: boolean
  error: string | null
  
  // Filters
  filters: VehicleFilters
  setFilters: (filters: Partial<VehicleFilters>) => void
  clearFilters: () => void
  
  // Actions
  refetch: () => Promise<void>
  updateFilter: (key: keyof VehicleFilters, value: any) => void
  resetPage: () => void
  
  // Sorting
  sortBy: string
  sortOrder: 'asc' | 'desc'
  updateSort: (field: string) => void
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Quick filters
  showOnlyInStock: boolean
  setShowOnlyInStock: (show: boolean) => void
  showOnlyFeatured: boolean
  setShowOnlyFeatured: (show: boolean) => void
}

const defaultFilters: VehicleFilters = {
  page: 1,
  limit: 12,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  inStock: true,
}

export function useVehicleInventory(initialFilters: Partial<VehicleFilters> = {}): UseVehicleInventoryResult {
  const [vehicles, setVehicles] = useState<VehicleInventoryItem[]>([])
  const [pagination, setPagination] = useState<VehicleInventoryResponse['data']['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<VehicleFilters>({
    ...defaultFilters,
    ...initialFilters,
  })

  // Debounced search
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  
  // Quick filter states
  const [showOnlyInStock, setShowOnlyInStock] = useState(filters.inStock || false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(filters.featured || false)

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Fetching vehicles with filters:', filters)
      
      const response = await vehicleInventoryService.getVehicles(filters)
      
      console.log('✅ Vehicle response:', response)
      
      setVehicles(response.data.vehicles)
      setPagination(response.data.pagination)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vehicles'
      setError(errorMessage)
      console.error('❌ Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Update filters and reset to first page
  const setFilters = useCallback((newFilters: Partial<VehicleFilters>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }))
  }, [])

  // Update a single filter (without resetting page for pagination changes)
  const updateFilter = useCallback((key: keyof VehicleFilters, value: any) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // Clear all filters except pagination defaults
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      ...defaultFilters,
      page: 1,
    }
    setFiltersState(clearedFilters)
    setSearchQuery('')
    setShowOnlyInStock(true)
    setShowOnlyFeatured(false)
  }, [])

  // Reset to first page
  const resetPage = useCallback(() => {
    setFiltersState(prev => ({
      ...prev,
      page: 1,
    }))
  }, [])

  // Handle sorting
  const updateSort = useCallback((field: string) => {
    setFiltersState(prev => {
      const newSortOrder = prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
      return {
        ...prev,
        sortBy: field,
        sortOrder: newSortOrder,
        page: 1, // Reset to first page when sorting changes
      }
    })
  }, [])

  // Update search with debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        setFilters({ search: searchQuery || undefined })
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery, filters.search, setFilters])

  // Update in stock filter
  useEffect(() => {
    if (showOnlyInStock !== filters.inStock) {
      setFilters({ inStock: showOnlyInStock || undefined })
    }
  }, [showOnlyInStock, filters.inStock, setFilters])

  // Update featured filter
  useEffect(() => {
    if (showOnlyFeatured !== filters.featured) {
      setFilters({ featured: showOnlyFeatured || undefined })
    }
  }, [showOnlyFeatured, filters.featured, setFilters])

  return {
    // Data
    vehicles,
    pagination,
    
    // State
    loading,
    error,
    
    // Filters
    filters,
    setFilters,
    clearFilters,
    
    // Actions
    refetch: fetchVehicles,
    updateFilter,
    resetPage,
    
    // Sorting
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
    updateSort,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Quick filters
    showOnlyInStock,
    setShowOnlyInStock,
    showOnlyFeatured,
    setShowOnlyFeatured,
  }
}
