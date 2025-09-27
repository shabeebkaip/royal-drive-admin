// Generic CRUD Service for the app
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  data: T[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export class ApiService<TEntity extends BaseEntity, TFormData> {
  protected baseUrl: string

  constructor(endpoint: string) {
    // Use environment variable or fallback to localhost
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'https://api.royaldrivecanada.com/api/v1'
    this.baseUrl = `${apiBaseUrl}/${endpoint}`
  }

  async getAll(params?: QueryParams): Promise<ApiResponse<TEntity>> {
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
      
      // Handle both paginated and non-paginated responses
      if (result.data && result.data.makes && Array.isArray(result.data.makes)) {
        // Handle the API response format: { data: { makes: [], pagination: {} } }
        return {
          data: result.data.makes,
          pagination: result.data.pagination
        } as ApiResponse<TEntity>
      } else if (result.data && Array.isArray(result.data)) {
        return result as ApiResponse<TEntity>
      } else if (Array.isArray(result)) {
        return { data: result } as ApiResponse<TEntity>
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('API Error (getAll):', error)
      throw error
    }
  }

  async getById(id: string): Promise<TEntity> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (getById):', error)
      throw error
    }
  }

  async create(data: TFormData): Promise<TEntity> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (create):', error)
      throw error
    }
  }

  async update(id: string, data: TFormData): Promise<TEntity> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`)
      }
      
      const result = await response.json()
      // Handle API response format: { success: true, message: "...", data: {...} }
      return result.data || result
    } catch (error) {
      console.error('API Error (update):', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`)
      }
    } catch (error) {
      console.error('API Error (delete):', error)
      throw error
    }
  }

  async search(query: string): Promise<TEntity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to search: ${response.statusText}`)
      }
      
      const result = await response.json()
      return Array.isArray(result) ? result : result.data || []
    } catch (error) {
      console.error('API Error (search):', error)
      throw error
    }
  }
}
