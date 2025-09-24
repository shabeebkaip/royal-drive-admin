import type { BaseEntity } from "~/components/crud"

// Status interface based on API documentation
export interface Status extends BaseEntity {
  id: string  // Maps to _id from API
  _id: string
  name: string
  slug: string
  description?: string
  color?: string        // Hex color code for UI (e.g., "#28a745")
  icon?: string         // Icon class or emoji for UI
  isDefault: boolean    // Whether this is the default status
  active: boolean
  vehicleCount?: number // Virtual field - count of vehicles with this status
  createdAt: string
  updatedAt?: string
}

// Simplified status for dropdowns
export interface StatusDropdownItem {
  _id: string
  name: string
  color?: string
  icon?: string
}

export interface CreateStatusRequest {
  name: string
  description?: string
  color?: string
  icon?: string
  isDefault?: boolean
  active?: boolean
}

export interface UpdateStatusRequest {
  name?: string
  description?: string
  color?: string
  icon?: string
  isDefault?: boolean
  active?: boolean
}

export interface UpdateStatusActiveRequest {
  active: boolean
}

export interface StatusResponse {
  success: boolean
  data?: Status
  error?: string
}

export interface StatusesResponse {
  success: boolean
  data?: {
    statuses: Status[]
    pagination: {
      page: number
      pages: number
      total: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  error?: string
}

export interface StatusStatsResponse {
  success: boolean
  data?: {
    total: number
    active: number
    inactive: number
    defaultStatus?: {
      name: string
      code: string
    }
    mostUsed?: {
      name: string
      vehicleCount: number
    }
  }
  error?: string
}

export interface StatusFilters {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  isDefault?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
