// Generic CRUD Service for the app
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

export class ApiService<TEntity extends BaseEntity, TFormData> {
  protected baseUrl: string

  constructor(endpoint: string) {
    // Use environment variable or fallback to localhost
    const apiBaseUrl = 'http://localhost:3001/api'
    this.baseUrl = `${apiBaseUrl}/${endpoint}`
  }

  async getAll(): Promise<TEntity[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      return await response.json()
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
      
      return await response.json()
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
      
      return await response.json()
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
      
      return await response.json()
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
}
