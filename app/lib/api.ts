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

// Transform MongoDB document to frontend entity (convert _id to id)
function transformMongoDoc<T extends BaseEntity>(doc: any): T {
  if (!doc) return doc
  
  const { _id, ...rest } = doc
  return {
    ...rest,
    id: _id || doc.id, // Use _id if present, fallback to id
  } as T
}

// Transform array of MongoDB documents
function transformMongoDocs<T extends BaseEntity>(docs: any[]): T[] {
  return docs.map(doc => transformMongoDoc<T>(doc))
}

export class ApiService<TEntity extends BaseEntity, TFormData> {
  protected baseUrl: string

  constructor(endpoint: string) {
    // Use environment variable only - must be configured in .env
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL
    if (!apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL is not configured in environment variables')
    }
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
          data: transformMongoDocs<TEntity>(result.data.makes),
          pagination: result.data.pagination
        } as ApiResponse<TEntity>
      } else if (result.data && Array.isArray(result.data)) {
        return {
          data: transformMongoDocs<TEntity>(result.data),
          pagination: result.pagination
        } as ApiResponse<TEntity>
      } else if (Array.isArray(result)) {
        return { data: transformMongoDocs<TEntity>(result) } as ApiResponse<TEntity>
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
      const data = result.data || result
      return transformMongoDoc<TEntity>(data)
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
      const createdData = result.data || result
      return transformMongoDoc<TEntity>(createdData)
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
      const updatedData = result.data || result
      return transformMongoDoc<TEntity>(updatedData)
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
      const data = Array.isArray(result) ? result : result.data || []
      return transformMongoDocs<TEntity>(data)
    } catch (error) {
      console.error('API Error (search):', error)
      throw error
    }
  }
}

// Authenticated API client for protected endpoints
export const api = {
  getBaseUrl() {
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL
    if (!apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL is not configured in environment variables')
    }
    return apiBaseUrl
  },

  getAuthHeaders() {
    // Get token from cookie (matches auth.ts implementation)
    const token = this.getTokenFromCookie()
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    }
  },

  getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null
    const cookie = document.cookie.split('; ').find(row => row.startsWith('auth_token='))
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
  },

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.getBaseUrl()}${path}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `Request failed: ${response.statusText}`)
    }

    return response.json()
  },

  async post<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`${this.getBaseUrl()}${path}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `Request failed: ${response.statusText}`)
    }

    return response.json()
  },

  async put<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`${this.getBaseUrl()}${path}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `Request failed: ${response.statusText}`)
    }

    return response.json()
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.getBaseUrl()}${path}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `Request failed: ${response.statusText}`)
    }

    return response.json()
  },
}
