import type { 
  Status, 
  CreateStatusRequest, 
  UpdateStatusRequest,
  UpdateStatusActiveRequest,
  StatusDropdownItem 
} from "~/types/status"

const BASE_URL = "http://localhost:3001/api/v1/statuses"

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
}

interface PaginatedResponse<T> {
  statuses: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

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

// Query parameters for filtering
interface GetStatusesQuery {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  isDefault?: boolean
  sortBy?: 'name' | 'code' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

class StatusesApiService {
  // Get all statuses with filtering and pagination
  async getAllWithFilters(query: GetStatusesQuery = {}): Promise<ApiResponse<PaginatedResponse<Status>>> {
    try {
      const searchParams = new URLSearchParams()
      
      if (query.page) searchParams.append('page', query.page.toString())
      if (query.limit) searchParams.append('limit', query.limit.toString())
      if (query.search) searchParams.append('search', query.search)
      if (query.active !== undefined) searchParams.append('active', query.active.toString())
      if (query.isDefault !== undefined) searchParams.append('isDefault', query.isDefault.toString())
      if (query.sortBy) searchParams.append('sortBy', query.sortBy)
      if (query.sortOrder) searchParams.append('sortOrder', query.sortOrder)

      const url = `${BASE_URL}?${searchParams.toString()}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error fetching statuses:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch statuses',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get status by ID
  async getById(id: string): Promise<ApiResponse<Status>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error fetching status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Create new status
  async create(status: CreateStatusRequest): Promise<ApiResponse<Status>> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error creating status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to create status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Update status
  async update(id: string, status: UpdateStatusRequest): Promise<ApiResponse<Status>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error updating status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to update status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Delete status
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: null,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error deleting status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to delete status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Update status active state
  async updateActiveStatus(id: string, activeUpdate: UpdateStatusActiveRequest): Promise<ApiResponse<Status>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activeUpdate),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error updating status active state:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to update status active state',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Set default status
  async setDefault(id: string): Promise<ApiResponse<Status>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}/default`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error setting default status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to set default status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get statistics
  async getStats(): Promise<ApiResponse<StatusStats>> {
    try {
      const response = await fetch(`${BASE_URL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error fetching status stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch status statistics',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get default status
  async getDefault(): Promise<ApiResponse<Status>> {
    try {
      const response = await fetch(`${BASE_URL}/default`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error fetching default status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch default status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get all active statuses for dropdown (no pagination)
  async getActiveForDropdown(): Promise<ApiResponse<StatusDropdownItem[]>> {
    try {
      const response = await fetch(`${BASE_URL}/dropdown`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error fetching dropdown statuses:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch dropdown statuses',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get active statuses
  async getActive(): Promise<ApiResponse<StatusDropdownItem[]>> {
    try {
      const response = await fetch(`${BASE_URL}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('Error fetching active statuses:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch active statuses',
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Export singleton instance
export const statusesApiService = new StatusesApiService()
