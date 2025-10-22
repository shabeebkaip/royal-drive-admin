import type { 
  DriveType, 
  CreateDriveTypeRequest, 
  UpdateDriveTypeRequest,
  UpdateDriveTypeStatusRequest,
  DriveTypeDropdownItem 
} from "~/types/drive-type"

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not configured in environment variables')
}
const BASE_URL = `${API_BASE_URL}/drive-types`

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
}

interface PaginatedResponse<T> {
  driveTypes: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface DriveTypeStats {
  total: number
  active: number
  inactive: number
  mostUsed?: {
    name: string
    vehicleCount: number
  }
}

// Query parameters for filtering
interface GetDriveTypesQuery {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: 'name' | 'code' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

class DriveTypesApiService {
  // Get all drive types with filtering and pagination
  async getAllWithFilters(query: GetDriveTypesQuery = {}): Promise<ApiResponse<PaginatedResponse<DriveType>>> {
    try {
      const searchParams = new URLSearchParams()
      
      if (query.page) searchParams.append('page', query.page.toString())
      if (query.limit) searchParams.append('limit', query.limit.toString())
      if (query.search) searchParams.append('search', query.search)
      if (query.active !== undefined) searchParams.append('active', query.active.toString())
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
      console.error('Error fetching drive types:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch drive types',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get drive type by ID
  async getById(id: string): Promise<ApiResponse<DriveType>> {
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
      console.error('Error fetching drive type:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch drive type',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Create new drive type
  async create(driveType: CreateDriveTypeRequest): Promise<ApiResponse<DriveType>> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driveType),
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
      console.error('Error creating drive type:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to create drive type',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Update drive type
  async update(id: string, driveType: UpdateDriveTypeRequest): Promise<ApiResponse<DriveType>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driveType),
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
      console.error('Error updating drive type:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to update drive type',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Delete drive type
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
      console.error('Error deleting drive type:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to delete drive type',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Update drive type status (active/inactive)
  async updateStatus(id: string, statusUpdate: UpdateDriveTypeStatusRequest): Promise<ApiResponse<DriveType>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusUpdate),
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
      console.error('Error updating drive type status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to update drive type status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get statistics
  async getStats(): Promise<ApiResponse<DriveTypeStats>> {
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
      console.error('Error fetching drive type stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch drive type statistics',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get all active drive types for dropdown (no pagination)
  async getActiveForDropdown(): Promise<ApiResponse<DriveTypeDropdownItem[]>> {
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
      console.error('Error fetching dropdown drive types:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch dropdown drive types',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get active drive types
  async getActive(): Promise<ApiResponse<DriveTypeDropdownItem[]>> {
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
      console.error('Error fetching active drive types:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch active drive types',
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Export singleton instance
export const driveTypesApiService = new DriveTypesApiService()
