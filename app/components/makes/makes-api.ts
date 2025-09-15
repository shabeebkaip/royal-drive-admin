import { ApiService, type QueryParams, type ApiResponse } from "~/lib/api"
import type { Make } from "~/types/make"
import type { MakeFormData } from "~/lib/schemas/make"
import type { CrudOperations } from "~/components/crud"

export interface MakeDropdownItem {
  id: string
  name: string
  slug: string
  logo?: string
}

export interface MakeStats {
  total: number
  active: number
  inactive: number
}

export class MakesApiService extends ApiService<Make, MakeFormData> {
  constructor() {
    super('makes')
  }

  // Override create to add active: true by default
  async create(data: MakeFormData): Promise<Make> {
    const createData = {
      ...data,
      active: true, // Always set active to true for new makes
    }
    return super.create(createData as any)
  }

  // Override update to add active: true by default if not provided
  async update(id: string, data: MakeFormData): Promise<Make> {
    const updateData = {
      ...data,
      active: true, // Always set active to true for updates
    }
    return super.update(id, updateData as any)
  }

  // Get active makes for dropdown
  async getDropdownOptions(): Promise<MakeDropdownItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/dropdown`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dropdown makes: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getDropdownOptions):', error)
      throw error
    }
  }

  // Get make by slug
  async getBySlug(slug: string): Promise<Make> {
    try {
      const response = await fetch(`${this.baseUrl}/slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch make by slug: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getBySlug):', error)
      throw error
    }
  }

  // Update make status (active/inactive)
  async updateStatus(id: string, active: boolean): Promise<Make> {
    try {
      console.log('🔧 API updateStatus - Request:', { id, active })
      
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update make status: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('🔧 API updateStatus - Raw response:', result)
      
      // Handle API response format: { success: true, message: "...", data: {...} }
      const finalResult = result.data || result
      console.log('🔧 API updateStatus - Final result:', finalResult)
      
      return finalResult
    } catch (error) {
      console.error('API Error (updateStatus):', error)
      throw error
    }
  }

  // Get popular makes (sorted by vehicle count)
  async getPopular(): Promise<Make[]> {
    try {
      const response = await fetch(`${this.baseUrl}/popular`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch popular makes: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getPopular):', error)
      throw error
    }
  }

  // Get makes statistics
  async getStats(): Promise<MakeStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch makes stats: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getStats):', error)
      throw error
    }
  }

  // Override getAll to support enhanced filtering and pagination
  async getAllWithFilters(params?: QueryParams & { 
    active?: boolean 
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'vehicleCount'
  }): Promise<ApiResponse<Make>> {
    return super.getAll(params)
  }
}

// Create a singleton instance
export const makesApiService = new MakesApiService()

// Create CRUD operations for the hook - adapted for new API response format
export const makesOperations: CrudOperations<Make, MakeFormData> = {
  create: (data: MakeFormData) => makesApiService.create(data),
  update: (id: string, data: MakeFormData) => makesApiService.update(id, data),
  delete: (id: string) => makesApiService.delete(id),
  getAll: async () => {
    const response = await makesApiService.getAll()
    return response.data // Extract data array from ApiResponse
  },
}
