import type { 
  Drivetrain, 
  CreateDrivetrainRequest, 
  UpdateDrivetrainRequest,
  DrivetrainDropdownItem 
} from "~/types/drivetrain"

const BASE_URL = "https://api.royaldrivecanada.com/api/v1/drive-types"

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

interface DrivetrainStats {
  total: number
  active: number
  inactive: number
}

interface UpdateDrivetrainStatusRequest {
  active: boolean
}

// Query parameters for filtering
interface GetDrivetrainsQuery {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

class DrivetrainsApiService {
  // Get all drivetrains with filtering and pagination
  async getAllWithFilters(query: GetDrivetrainsQuery = {}): Promise<ApiResponse<PaginatedResponse<Drivetrain>>> {
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
      console.error('Error fetching drivetrains:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch drivetrains',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get drivetrain by ID
  async getById(id: string): Promise<ApiResponse<Drivetrain>> {
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
      console.error('Error fetching drivetrain:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch drivetrain',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Create new drivetrain
  async create(drivetrain: CreateDrivetrainRequest): Promise<ApiResponse<Drivetrain>> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drivetrain),
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
      console.error('Error creating drivetrain:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to create drivetrain',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Update drivetrain
  async update(id: string, drivetrain: UpdateDrivetrainRequest): Promise<ApiResponse<Drivetrain>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drivetrain),
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
      console.error('Error updating drivetrain:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to update drivetrain',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Delete drivetrain
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
      console.error('Error deleting drivetrain:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to delete drivetrain',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Update drivetrain status (active/inactive)
  async updateStatus(id: string, statusUpdate: UpdateDrivetrainStatusRequest): Promise<ApiResponse<Drivetrain>> {
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
      console.error('Error updating drivetrain status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to update drivetrain status',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get statistics
  async getStats(): Promise<ApiResponse<DrivetrainStats>> {
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
      console.error('Error fetching drivetrain stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch drivetrain statistics',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Get all active drivetrains for dropdown (no pagination)
  async getActiveForDropdown(): Promise<ApiResponse<DrivetrainDropdownItem[]>> {
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
      console.error('Error fetching dropdown drivetrains:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch dropdown drivetrains',
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Export singleton instance
export const drivetrainsApiService = new DrivetrainsApiService()
