import type { 
  Condition, 
  ConditionFormData, 
  ConditionFilters, 
  ConditionsResponse,
  ConditionDropdown,
  ConditionStats,
  ApiResponse
} from "~/types/condition"

// Mock data for development
const mockConditions: Condition[] = [
  {
    _id: "67a1234567890abcdef12345",
    name: "New",
    slug: "new",
    active: true,
    createdAt: "2025-01-09T10:00:00.000Z",
    updatedAt: "2025-01-09T10:00:00.000Z",
    vehicleCount: 45
  },
  {
    _id: "67a1234567890abcdef12346",
    name: "Used",
    slug: "used",
    active: true,
    createdAt: "2025-01-09T10:15:00.000Z",
    updatedAt: "2025-01-09T10:15:00.000Z",
    vehicleCount: 123
  },
  {
    _id: "67a1234567890abcdef12347",
    name: "Certified Pre-Owned",
    slug: "certified-pre-owned",
    active: true,
    createdAt: "2025-01-09T10:30:00.000Z",
    updatedAt: "2025-01-09T10:30:00.000Z",
    vehicleCount: 67
  },
  {
    _id: "67a1234567890abcdef12348",
    name: "Like New",
    slug: "like-new",
    active: true,
    createdAt: "2025-01-09T10:45:00.000Z",
    updatedAt: "2025-01-09T10:45:00.000Z",
    vehicleCount: 23
  },
  {
    _id: "67a1234567890abcdef12349",
    name: "Refurbished",
    slug: "refurbished",
    active: false,
    createdAt: "2025-01-09T11:00:00.000Z",
    updatedAt: "2025-01-09T11:00:00.000Z",
    vehicleCount: 8
  }
]

// Helper to simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Helper to generate slug from name
const generateSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-zA-Z0-9\s\-]/g, '').replace(/\s+/g, '-')
}

// Helper to filter conditions based on filters
const filterConditions = (conditions: Condition[], filters: ConditionFilters): Condition[] => {
  let filtered = [...conditions]
  
  // Filter by active status
  if (filters.active !== undefined) {
    filtered = filtered.filter(c => c.active === filters.active)
  }
  
  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(searchTerm) || 
      c.slug.toLowerCase().includes(searchTerm)
    )
  }
  
  // Search with 'q' parameter (for search endpoint)
  if (filters.q) {
    const searchTerm = filters.q.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(searchTerm) || 
      c.slug.toLowerCase().includes(searchTerm)
    )
  }
  
  // Sort
  const sortBy = filters.sortBy || 'name'
  const sortOrder = filters.sortOrder || 'asc'
  
  filtered.sort((a, b) => {
    let aVal: any = a[sortBy as keyof Condition]
    let bVal: any = b[sortBy as keyof Condition]
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (sortOrder === 'desc') {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    } else {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    }
  })
  
  return filtered
}

// Helper to paginate results
const paginateResults = (conditions: Condition[], page: number = 1, limit: number = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedConditions = conditions.slice(startIndex, endIndex)
  
  return {
    conditions: paginatedConditions,
    pagination: {
      page,
      limit,
      total: conditions.length,
      pages: Math.ceil(conditions.length / limit),
      hasNext: endIndex < conditions.length,
      hasPrev: page > 1
    }
  }
}

export const mockConditionsService = {
  // Get all conditions with filtering and pagination
  async getAll(filters: ConditionFilters = {}): Promise<ConditionsResponse> {
    await delay()
    
    const filtered = filterConditions(mockConditions, filters)
    const result = paginateResults(filtered, filters.page, filters.limit)
    
    return result
  },

  // Get active conditions only
  async getActive(): Promise<Condition[]> {
    await delay()
    return mockConditions.filter(c => c.active)
  },

  // Get conditions for dropdown (simplified)
  async getDropdown(): Promise<ConditionDropdown[]> {
    await delay()
    return mockConditions
      .filter(c => c.active)
      .map(c => ({ _id: c._id, name: c.name, slug: c.slug }))
  },

  // Get condition statistics
  async getStats(): Promise<ConditionStats> {
    await delay()
    
    const total = mockConditions.length
    const active = mockConditions.filter(c => c.active).length
    const inactive = total - active
    const mostUsed = mockConditions.reduce((prev, current) => 
      (current.vehicleCount || 0) > (prev.vehicleCount || 0) ? current : prev
    )
    
    return {
      total,
      active,
      inactive,
      mostUsed: {
        name: mostUsed.name,
        vehicleCount: mostUsed.vehicleCount || 0
      },
      conditionDistribution: mockConditions.map(c => ({
        name: c.name,
        slug: c.slug,
        vehicleCount: c.vehicleCount || 0,
        percentage: total > 0 ? Math.round(((c.vehicleCount || 0) / total) * 100) : 0
      }))
    }
  },

  // Get condition by ID
  async getById(id: string): Promise<Condition> {
    await delay()
    const condition = mockConditions.find(c => c._id === id)
    if (!condition) {
      throw new Error('Condition not found')
    }
    return condition
  },

  // Get condition by slug
  async getBySlug(slug: string): Promise<Condition> {
    await delay()
    const condition = mockConditions.find(c => c.slug === slug)
    if (!condition) {
      throw new Error('Condition not found')
    }
    return condition
  },

  // Create new condition
  async create(data: ConditionFormData): Promise<Condition> {
    await delay()
    
    // Check for duplicate name
    const existingCondition = mockConditions.find(c => 
      c.name.toLowerCase() === data.name.toLowerCase()
    )
    if (existingCondition) {
      throw new Error('Condition name already exists')
    }
    
    const newCondition: Condition = {
      _id: `67a${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      slug: generateSlug(data.name),
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vehicleCount: 0
    }
    
    mockConditions.push(newCondition)
    return newCondition
  },

  // Update condition
  async update(id: string, data: Partial<ConditionFormData>): Promise<Condition> {
    await delay()
    
    const conditionIndex = mockConditions.findIndex(c => c._id === id)
    if (conditionIndex === -1) {
      throw new Error('Condition not found')
    }
    
    // Check for duplicate name (excluding current condition)
    if (data.name) {
      const existingCondition = mockConditions.find(c => 
        c._id !== id && c.name.toLowerCase() === data.name!.toLowerCase()
      )
      if (existingCondition) {
        throw new Error('Condition name already exists')
      }
    }
    
    const updatedCondition = {
      ...mockConditions[conditionIndex],
      ...data,
      slug: data.name ? generateSlug(data.name) : mockConditions[conditionIndex].slug,
      updatedAt: new Date().toISOString()
    }
    
    mockConditions[conditionIndex] = updatedCondition
    return updatedCondition
  },

  // Update condition active state
  async updateStatus(id: string, active: boolean): Promise<Condition> {
    await delay()
    
    const conditionIndex = mockConditions.findIndex(c => c._id === id)
    if (conditionIndex === -1) {
      throw new Error('Condition not found')
    }
    
    const updatedCondition = {
      ...mockConditions[conditionIndex],
      active,
      updatedAt: new Date().toISOString()
    }
    
    mockConditions[conditionIndex] = updatedCondition
    return updatedCondition
  },

  // Delete condition
  async delete(id: string): Promise<void> {
    await delay()
    
    const conditionIndex = mockConditions.findIndex(c => c._id === id)
    if (conditionIndex === -1) {
      throw new Error('Condition not found')
    }
    
    const condition = mockConditions[conditionIndex]
    if ((condition.vehicleCount || 0) > 0) {
      throw new Error(`Cannot delete condition. It is currently used by ${condition.vehicleCount} vehicle(s)`)
    }
    
    mockConditions.splice(conditionIndex, 1)
  },

  // Bulk update conditions
  async bulkUpdate(updates: Array<{ id: string; data: Partial<ConditionFormData> }>): Promise<{ updated: number; failed: number }> {
    await delay()
    
    let updated = 0
    let failed = 0
    
    for (const update of updates) {
      try {
        await this.update(update.id, update.data)
        updated++
      } catch {
        failed++
      }
    }
    
    return { updated, failed }
  },

  // Bulk update active states
  async bulkUpdateStatus(ids: string[], active: boolean): Promise<{ updated: number; failed: number }> {
    await delay()
    
    let updated = 0
    let failed = 0
    
    for (const id of ids) {
      try {
        await this.updateStatus(id, active)
        updated++
      } catch {
        failed++
      }
    }
    
    return { updated, failed }
  },

  // Bulk delete conditions
  async bulkDelete(ids: string[]): Promise<{ deleted: number; failed: number; errors: string[] }> {
    await delay()
    
    let deleted = 0
    let failed = 0
    const errors: string[] = []
    
    for (const id of ids) {
      try {
        await this.delete(id)
        deleted++
      } catch (error) {
        failed++
        errors.push(error instanceof Error ? error.message : 'Unknown error')
      }
    }
    
    return { deleted, failed, errors }
  },

  // Search conditions
  async search(query: string, filters: Omit<ConditionFilters, 'search' | 'q'> = {}): Promise<ConditionsResponse> {
    await delay()
    
    const searchFilters = { ...filters, q: query }
    const filtered = filterConditions(mockConditions, searchFilters)
    const result = paginateResults(filtered, filters.page, filters.limit)
    
    return result
  },
}
