import { ApiService, type QueryParams, type ApiResponse } from "~/lib/api"
import type { Model, ModelDropdownItem } from "~/types/model"
import type { ModelFormData } from "~/lib/schemas/model"
import type { CrudOperations } from "~/components/crud"

export interface ModelStats {
  total: number
  active: number
  inactive: number
}

export class ModelsApiService extends ApiService<Model, ModelFormData> {
  constructor() {
    super('models')
  }

  // Override getAll to handle models response structure
  async getAll(params?: QueryParams): Promise<ApiResponse<Model>> {
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
      
      // Handle the API response format: { data: { models: [], pagination: {} } }
      if (result.data && result.data.models && Array.isArray(result.data.models)) {
        return {
          data: result.data.models,
          pagination: result.data.pagination
        } as ApiResponse<Model>
      } else if (result.data && Array.isArray(result.data)) {
        return result as ApiResponse<Model>
      } else if (Array.isArray(result)) {
        return { data: result } as ApiResponse<Model>
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
    make?: string
    vehicleType?: string
    sortBy?: 'name' | 'createdAt' | 'updatedAt'
  }): Promise<ApiResponse<Model>> {
    return this.getAll(params)
  }

  // Override create to set active: true by default and handle API response format
  async create(data: ModelFormData): Promise<Model> {
    console.log('ModelsApiService create - Original data:', data)
    
    // Prepare data according to API documentation
    const createData = {
      name: data.name,
      make: data.make, // ObjectId as string
      vehicleType: data.vehicleType, // ObjectId as string  
      description: data.description || undefined,
      active: true, // Always set active to true for new models
    }
    
    console.log('ModelsApiService create - Data being sent to API:', createData)
    console.log('ModelsApiService create - API URL:', this.baseUrl)
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('ModelsApiService create - HTTP error:', response.status, errorData)
        throw new Error(errorData.message || `Failed to create model: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('ModelsApiService create - Raw API response:', result)
      
      // Handle API response format: { success: true, message: "...", data: {...} }
      const modelData = result.data || result
      console.log('ModelsApiService create - Processed model data:', modelData)
      
      return modelData
    } catch (error) {
      console.error('ModelsApiService create - API error:', error)
      throw error
    }
  }

  // Override update to use PATCH method as per API documentation
  async update(id: string, data: ModelFormData): Promise<Model> {
    console.log('ModelsApiService update - Original data:', data)
    
    // Prepare data according to API documentation
    const updateData = {
      name: data.name,
      make: data.make, // ObjectId as string
      vehicleType: data.vehicleType, // ObjectId as string
      description: data.description || undefined,
    }
    
    console.log('ModelsApiService update - Data being sent to API:', updateData)
    console.log('ModelsApiService update - API URL:', `${this.baseUrl}/${id}`)
    
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH', // Using PATCH as per API documentation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('ModelsApiService update - HTTP error:', response.status, errorData)
        throw new Error(errorData.message || `Failed to update model: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('ModelsApiService update - Raw API response:', result)
      
      // Handle API response format: { success: true, message: "...", data: {...} }
      const modelData = result.data || result
      console.log('ModelsApiService update - Processed model data:', modelData)
      
      return modelData
    } catch (error) {
      console.error('ModelsApiService update - API error:', error)
      throw error
    }
  }

  // Additional methods specific to models

  // Update model status (active/inactive) 
  async updateStatus(id: string, isActive: boolean): Promise<Model> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: isActive }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update model status: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (updateStatus):', error)
      throw error
    }
  }

  // Get models by make
  async getByMake(makeId: string): Promise<Model[]> {
    try {
      const response = await fetch(`${this.baseUrl}/make/${makeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models by make: ${response.statusText}`)
      }
      
      const result = await response.json()
      return result.data?.models || result.data || result
    } catch (error) {
      console.error('API Error (getByMake):', error)
      throw error
    }
  }

  // Get models by vehicle type
  async getByVehicleType(vehicleTypeId: string): Promise<Model[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicle-type/${vehicleTypeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models by vehicle type: ${response.statusText}`)
      }
      
      const result = await response.json()
      return result.data?.models || result.data || result
    } catch (error) {
      console.error('API Error (getByVehicleType):', error)
      throw error
    }
  }

  // Get model by slug
  async getBySlug(slug: string): Promise<Model> {
    try {
      const response = await fetch(`${this.baseUrl}/slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch model by slug: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getBySlug):', error)
      throw error
    }
  }

  // Get active models for dropdown
  async getDropdownOptions(): Promise<ModelDropdownItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/dropdown`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models dropdown: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getDropdownOptions):', error)
      throw error
    }
  }

  // Get models statistics
  async getStats(): Promise<ModelStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models stats: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getStats):', error)
      throw error
    }
  }

  // Get popular models
  async getPopular(): Promise<Model[]> {
    try {
      const response = await fetch(`${this.baseUrl}/popular`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch popular models: ${response.statusText}`)
      }
      
      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('API Error (getPopular):', error)
      throw error
    }
  }

  // Search models
  async search(query: string): Promise<Model[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to search models: ${response.statusText}`)
      }
      
      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('API Error (search):', error)
      throw error
    }
  }
}

// Export singleton instance
export const modelsApiService = new ModelsApiService()
