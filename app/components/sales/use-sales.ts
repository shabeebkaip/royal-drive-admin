import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import salesService from '~/services/salesService'
import type { Sale, SaleSearchParams } from '~/types/sale'
import type { SaleFormData } from '~/lib/schemas/sale'

export function useSales() {
  const [data, setData] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  })

  // Load initial data
  useEffect(() => {
    loadSales()
  }, [])

  // Reload when filters or pagination change
  useEffect(() => {
    loadSales()
  }, [searchQuery, statusFilter, pagination.page, pagination.limit])

  const loadSales = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: SaleSearchParams = { 
        page: pagination.page, 
        limit: pagination.limit 
      }
      if (searchQuery) params.search = searchQuery
      if (statusFilter) params.status = statusFilter as any
      
      const response = await salesService.list(params)
      setData(response.data)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sales'
      setError(errorMessage)
      console.error('Failed to load sales:', err)
      toast.error('Failed to load sales', {
        description: errorMessage
      })
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
    if (pagination.page < pagination.totalPages) {
      goToPage(pagination.page + 1)
    }
  }

  const prevPage = () => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1)
    }
  }

  const setPageSize = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
  }

  // Search function
  const search = (query: string) => {
    setSearchQuery(query)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Status filter function
  const setStatus = (status: string) => {
    setStatusFilter(status)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Create new sale
  const create = async (formData: SaleFormData): Promise<Sale> => {
    setError(null)
    try {
      const response = await salesService.create(formData)
      const newSale = response.data
      await loadSales() // Reload to get updated list
      toast.success('Sale created successfully', {
        description: `Sale for ${newSale.customerName} has been created.`
      })
      return newSale
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create sale'
      setError(errorMessage)
      toast.error('Failed to create sale', {
        description: errorMessage
      })
      throw err
    }
  }

  // Complete sale
  const complete = async (id: string): Promise<void> => {
    setError(null)
    try {
      await salesService.complete(id)
      await loadSales()
      toast.success('Sale completed successfully', {
        description: 'The sale has been marked as completed.'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete sale'
      setError(errorMessage)
      toast.error('Failed to complete sale', {
        description: errorMessage
      })
      throw err
    }
  }

  // Cancel sale
  const cancel = async (id: string): Promise<void> => {
    setError(null)
    try {
      await salesService.cancel(id)
      await loadSales()
      toast.success('Sale cancelled successfully', {
        description: 'The sale has been cancelled.'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel sale'
      setError(errorMessage)
      toast.error('Failed to cancel sale', {
        description: errorMessage
      })
      throw err
    }
  }

  // Delete sale
  const deleteSale = async (id: string): Promise<void> => {
    setError(null)
    try {
      await salesService.delete(id)
      await loadSales()
      toast.success('Sale deleted successfully', {
        description: 'The sale has been removed.'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete sale'
      setError(errorMessage)
      toast.error('Failed to delete sale', {
        description: errorMessage
      })
      throw err
    }
  }

  // Refresh function
  const refresh = () => {
    setSearchQuery('')
    setStatusFilter('')
    setPagination(prev => ({ ...prev, page: 1 }))
    loadSales()
  }

  return {
    data,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    pagination,
    search,
    setStatusFilter: setStatus,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    create,
    complete,
    cancel,
    delete: deleteSale,
    refresh,
  }
}
