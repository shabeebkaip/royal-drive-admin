import { ApiService } from "~/lib/api"
import type { Make } from "~/types/make"
import type { MakeFormData } from "~/lib/schemas/make"
import type { CrudOperations } from "~/components/crud"

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

  // Additional make-specific methods can be added here
  async getActiveMakes(): Promise<Make[]> {
    try {
      const response = await fetch(`${this.baseUrl}?status=active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch active makes: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error (getActiveMakes):', error)
      throw error
    }
  }
}

// Create a singleton instance
export const makesApiService = new MakesApiService()

// Create CRUD operations for the hook
export const makesOperations: CrudOperations<Make, MakeFormData> = {
  create: (data: MakeFormData) => makesApiService.create(data),
  update: (id: string, data: MakeFormData) => makesApiService.update(id, data),
  delete: (id: string) => makesApiService.delete(id),
  getAll: () => makesApiService.getAll(),
}
