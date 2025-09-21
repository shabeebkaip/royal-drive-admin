import type { BaseEntity } from "~/components/crud"

// Drive Type interface based on API documentation
export interface DriveType extends BaseEntity {
  id: string  // Maps to _id from API
  _id: string
  name: string
  code: string
  slug: string
  description?: string
  active: boolean
  vehicleCount?: number // Virtual field - count of vehicles for this drive type
  createdAt: string
  updatedAt?: string
}

// Simplified drive type for dropdowns
export interface DriveTypeDropdownItem {
  _id: string
  name: string
  code: string
  slug: string
}

export interface CreateDriveTypeRequest {
  name: string
  code: string
  description?: string
  active?: boolean
}

export interface UpdateDriveTypeRequest {
  name?: string
  code?: string
  description?: string
  active?: boolean
}

export interface UpdateDriveTypeStatusRequest {
  active: boolean
}

export interface DriveTypeResponse {
  success: boolean
  data?: DriveType
  error?: string
}

export interface DriveTypesResponse {
  success: boolean
  data?: {
    driveTypes: DriveType[]
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

export interface DriveTypeStatsResponse {
  success: boolean
  data?: {
    total: number
    active: number
    inactive: number
    mostUsed?: {
      name: string
      vehicleCount: number
    }
  }
  error?: string
}

export interface DriveTypeFilters {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
