import type {
  Vehicle,
  VehicleFormData,
  VehicleFilters,
  VehicleSearchParams,
  VehicleStats,
  VehicleBulkOperation,
  VehicleDropdowns,
  ApiResponse,
  PaginatedResponse,
} from '~/types/vehicle'
import { auth } from '~/lib/auth'
// Mock service removed; always use real API

// Base URL for the API
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3001/api/v1'

function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = auth.getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  return fetch(input, { ...init, headers, credentials: 'include' })
}

// Always use real API endpoints; no mock fallback

/**
 * Vehicle Service - Provides access to vehicle data with automatic fallback to mock data
 */
export const vehicleService = {
  /**
   * Get all vehicles with pagination and filters
   */
  async getVehicles(params: VehicleSearchParams = {}): Promise<PaginatedResponse<Vehicle>> {
  // Always call real API

    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
    if (params.search) searchParams.set('search', params.search)
    if (params.make) searchParams.set('make', params.make)
    if (params.model) searchParams.set('model', params.model)
    if (params.yearFrom) searchParams.set('yearFrom', params.yearFrom.toString())
    if (params.yearTo) searchParams.set('yearTo', params.yearTo.toString())
    if (params.priceFrom) searchParams.set('priceFrom', params.priceFrom.toString())
    if (params.priceTo) searchParams.set('priceTo', params.priceTo.toString())
    if (params.condition) searchParams.set('condition', params.condition)
    if (params.status) searchParams.set('status', params.status)
    if (params.inStock !== undefined) searchParams.set('inStock', params.inStock.toString())

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Get a single vehicle by ID
   */
  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Create a new vehicle
   */
  async createVehicle(data: VehicleFormData): Promise<ApiResponse<Vehicle>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create vehicle: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Update an existing vehicle
   */
  async updateVehicle(id: string, data: Partial<VehicleFormData>): Promise<ApiResponse<Vehicle>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update vehicle: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Delete a vehicle
   */
  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete vehicle: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Get vehicle statistics for dashboard
   */
  async getVehicleStats(): Promise<ApiResponse<VehicleStats>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/stats`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle stats: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Search vehicles with advanced filters
   */
  async searchVehicles(filters: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to search vehicles: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Get dropdown data for forms
   */
  async getDropdownData(): Promise<ApiResponse<VehicleDropdowns>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/dropdown-data`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dropdown data: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Get models for a specific make
   */
  async getModelsByMake(makeId: string): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/makes/${makeId}/models`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Upload vehicle images
   */
  async uploadImages(vehicleId: string, files: File[]): Promise<ApiResponse<string[]>> {
  // Always call real API

    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`image_${index}`, file)
    })

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${vehicleId}/images`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`Failed to upload images: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Delete vehicle image
   */
  async deleteImage(vehicleId: string, imageUrl: string): Promise<ApiResponse<void>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${vehicleId}/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete image: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Perform bulk operations on vehicles
   */
  async bulkOperation(operation: VehicleBulkOperation): Promise<ApiResponse<{ processed: number; failed: number }>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operation),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to perform bulk operation: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Duplicate a vehicle
   */
  async duplicateVehicle(id: string): Promise<ApiResponse<Vehicle>> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${id}/duplicate`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to duplicate vehicle: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Get vehicle valuation
   */
  async getValuation(vin: string): Promise<ApiResponse<{ 
    estimatedValue: number; 
    marketRange: { min: number; max: number }; 
    source: string;
    lastUpdated: string;
  }>> {
    // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/valuation/${vin}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get valuation: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Generate vehicle report
   */
  async generateReport(vehicleId: string, format: 'pdf' | 'excel'): Promise<Blob> {
  // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${vehicleId}/report?format=${format}`)
    
    if (!response.ok) {
      throw new Error(`Failed to generate report: ${response.statusText}`)
    }
    
    return response.blob()
  },

  /**
   * Get vehicle history
   */
  async getVehicleHistory(vehicleId: string): Promise<ApiResponse<Array<{
    id: string;
    action: string;
    changes: Record<string, any>;
    user: string;
    timestamp: string;
  }>>> {
    // Always call real API

  const response = await authorizedFetch(`${API_BASE_URL}/vehicles/${vehicleId}/history`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle history: ${response.statusText}`)
    }
    
    return response.json()
  },
}

export default vehicleService
