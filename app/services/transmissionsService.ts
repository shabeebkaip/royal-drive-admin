import type { 
  Transmission, 
  CreateTransmissionRequest, 
  UpdateTransmissionRequest,
  UpdateTransmissionStatusRequest,
  TransmissionDropdownItem 
} from "~/types/transmission"

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not configured in environment variables')
}
const BASE_URL = `${API_BASE_URL}/transmissions`

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
}

interface PaginatedResponse<T> {
  transmissions: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface TransmissionStats {
  total: number
  active: number
  inactive: number
}

// Query parameters for filtering
interface GetTransmissionsQuery {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

class TransmissionsApiService {
  // Get all transmissions with filtering and pagination
  async getAllWithFilters(query: GetTransmissionsQuery = {}): Promise<ApiResponse<PaginatedResponse<Transmission>>> {
    const params = new URLSearchParams()
    
    if (query.page) params.append('page', query.page.toString())
    if (query.limit) params.append('limit', query.limit.toString())
    if (query.search) params.append('search', query.search)
    if (query.active !== undefined) params.append('active', query.active.toString())
    if (query.sortBy) params.append('sortBy', query.sortBy)
    if (query.sortOrder) params.append('sortOrder', query.sortOrder)

    const url = `${BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching transmissions:', error)
      throw error
    }
  }

  // Get transmission by ID
  async getById(id: string): Promise<ApiResponse<Transmission>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching transmission:', error)
      throw error
    }
  }

  // Get transmission by slug
  async getBySlug(slug: string): Promise<ApiResponse<Transmission>> {
    try {
      const response = await fetch(`${BASE_URL}/slug/${slug}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching transmission by slug:', error)
      throw error
    }
  }

  // Get active transmissions for dropdown
  async getDropdownItems(): Promise<ApiResponse<TransmissionDropdownItem[]>> {
    try {
      const response = await fetch(`${BASE_URL}/dropdown`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching transmission dropdown items:', error)
      throw error
    }
  }

  // Create new transmission
  async create(data: CreateTransmissionRequest): Promise<ApiResponse<Transmission>> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating transmission:', error)
      throw error
    }
  }

  // Update transmission
  async update(id: string, data: UpdateTransmissionRequest): Promise<ApiResponse<Transmission>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating transmission:', error)
      throw error
    }
  }

  // Update transmission status
  async updateStatus(id: string, data: UpdateTransmissionStatusRequest): Promise<ApiResponse<Transmission>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating transmission status:', error)
      throw error
    }
  }

  // Delete transmission
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error deleting transmission:', error)
      throw error
    }
  }

  // Search transmissions
  async search(query: string): Promise<ApiResponse<PaginatedResponse<Transmission>>> {
    try {
      const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error searching transmissions:', error)
      throw error
    }
  }

  // Get popular transmissions
  async getPopular(): Promise<ApiResponse<Transmission[]>> {
    try {
      const response = await fetch(`${BASE_URL}/popular`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching popular transmissions:', error)
      throw error
    }
  }

  // Get transmission statistics
  async getStats(): Promise<ApiResponse<TransmissionStats>> {
    try {
      const response = await fetch(`${BASE_URL}/stats`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching transmission stats:', error)
      throw error
    }
  }
}

export const transmissionsApiService = new TransmissionsApiService()
