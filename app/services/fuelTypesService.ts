import type { 
  FuelType, 
  FuelTypeDropdownItem, 
  CreateFuelTypeRequest, 
  UpdateFuelTypeRequest,
  UpdateFuelTypeStatusRequest 
} from "~/types/fuel-type"

const BASE_URL = "https://api.royaldrivecanada.com/api/v1/fuel-types"

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
}

interface PaginatedResponse<T> {
  fuelTypes: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface GetAllFilters {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface FuelTypeStats {
  total: number
  active: number
  inactive: number
}

export const fuelTypesApiService = {
  // Get all fuel types with filters
  async getAllWithFilters(filters: GetAllFilters = {}): Promise<ApiResponse<PaginatedResponse<FuelType>>> {
    const searchParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })
    
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fuel types: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get fuel types for dropdown (active only)
  async getForDropdown(): Promise<ApiResponse<FuelTypeDropdownItem[]>> {
    const response = await fetch(`${BASE_URL}/dropdown`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fuel types for dropdown: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get fuel type by ID
  async getById(id: string): Promise<ApiResponse<FuelType>> {
    const response = await fetch(`${BASE_URL}/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fuel type: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get fuel type by slug
  async getBySlug(slug: string): Promise<ApiResponse<FuelType>> {
    const response = await fetch(`${BASE_URL}/slug/${slug}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fuel type: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Create new fuel type
  async create(data: CreateFuelTypeRequest): Promise<ApiResponse<FuelType>> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to create fuel type: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Update fuel type
  async update(id: string, data: UpdateFuelTypeRequest): Promise<ApiResponse<FuelType>> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to update fuel type: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Update fuel type status
  async updateStatus(id: string, active: boolean): Promise<ApiResponse<FuelType>> {
    const response = await fetch(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active } as UpdateFuelTypeStatusRequest),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to update fuel type status: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Delete fuel type
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to delete fuel type: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Search fuel types
  async search(query: string): Promise<ApiResponse<PaginatedResponse<FuelType>>> {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`Failed to search fuel types: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get popular fuel types
  async getPopular(): Promise<ApiResponse<FuelType[]>> {
    const response = await fetch(`${BASE_URL}/popular`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch popular fuel types: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get fuel types statistics
  async getStats(): Promise<ApiResponse<FuelTypeStats>> {
    const response = await fetch(`${BASE_URL}/stats`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fuel type statistics: ${response.statusText}`)
    }
    
    return response.json()
  },
}
