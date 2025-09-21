// Condition interface based on API documentation
export interface Condition {
  _id: string           // MongoDB ObjectId
  name: string          // Condition name (e.g., "New", "Used")
  slug: string          // URL-friendly version (e.g., "new", "used")
  active: boolean       // Whether condition is active (default: true)
  createdAt: string     // ISO timestamp
  updatedAt: string     // ISO timestamp
  vehicleCount?: number // Virtual field - count of vehicles with this condition
}

// Simplified condition for dropdowns
export interface ConditionDropdown {
  _id: string
  name: string
  slug: string
}

// API response interfaces
export interface ConditionsResponse {
  conditions: Condition[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ConditionStats {
  total: number
  active: number
  inactive: number
  mostUsed: {
    name: string
    vehicleCount: number
  }
  conditionDistribution: Array<{
    name: string
    slug: string
    vehicleCount: number
    percentage: number
  }>
}

// Form data for creating/updating conditions
export interface ConditionFormData {
  name: string
  active?: boolean
}

// API query parameters
export interface ConditionFilters {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}
