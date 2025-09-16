import { ApiService, type QueryParams, type ApiResponse } from "~/lib/api"
import type { VehicleType } from "~/types/vehicle-type"
import type { VehicleTypeFormData } from "~/lib/schemas/vehicle-type"
import type { CrudOperations } from "~/components/crud"

export interface VehicleTypeDropdownItem {
  id: string
  name: string
  slug: string
  icon?: string
}

export interface VehicleTypeStats {
  total: number
  active: number
  inactive: number
}

export interface VehicleTypePaginationResponse {
  data: VehicleType[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class VehicleTypesApiService extends ApiService<VehicleType, VehicleTypeFormData> {
  constructor() {
    super('vehicle-types')
  }

  // Override getAll to handle vehicleTypes response structure
  async getAll(params?: QueryParams): Promise<ApiResponse<VehicleType>> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.search) searchParams.append('search', params.search)
      if (params?.active !== undefined) searchParams.append('active', params.active.toString())
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)
      
      const url = searchParams.toString() ? `${this.baseUrl}?${searchParams}` : this.baseUrl
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // Handle the API response format: { data: { vehicleTypes: [], pagination: {} } }
      if (result.data && result.data.vehicleTypes && Array.isArray(result.data.vehicleTypes)) {
        return {
          data: result.data.vehicleTypes,
          pagination: result.data.pagination
        } as ApiResponse<VehicleType>
      } else if (result.data && Array.isArray(result.data)) {
        return result as ApiResponse<VehicleType>
      } else if (Array.isArray(result)) {
        return { data: result } as ApiResponse<VehicleType>
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('API Error (getAll):', error)
      throw error
    }
  }

  // Override getAll to support enhanced filtering and pagination
  async getAllWithFilters(params?: QueryParams & { 
    active?: boolean 
    sortBy?: 'name' | 'createdAt' | 'updatedAt'
  }): Promise<ApiResponse<VehicleType>> {
    return this.getAll(params)
  }

  // Override create to set active: true by default
  async create(data: VehicleTypeFormData): Promise<VehicleType> {
    const createData = {
      ...data,
      active: true, // Always set active to true for new vehicle types
    }
    return super.create(createData as any)
  }

  // Additional methods specific to vehicle types that aren't in the base class

  // Update vehicle type status (active/inactive) 
  async updateStatus(id: string, isActive: boolean): Promise<VehicleType> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: isActive }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update vehicle type status: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (updateStatus):', error)
      throw error
    }
  }

  // Get vehicle type by slug
  async getBySlug(slug: string): Promise<VehicleType> {
    try {
      const response = await fetch(`${this.baseUrl}/slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle type by slug: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getBySlug):', error)
      throw error
    }
  }

  // Get active vehicle types for dropdown
  async getDropdownOptions(): Promise<VehicleTypeDropdownItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/dropdown`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle types dropdown: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getDropdownOptions):', error)
      throw error
    }
  }

  // Get vehicle types statistics
  async getStats(): Promise<VehicleTypeStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle types stats: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getStats):', error)
      throw error
    }
  }
}

// Export singleton instance
export const vehicleTypesApiService = new VehicleTypesApiService()
