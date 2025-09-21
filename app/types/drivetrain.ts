import type { BaseEntity } from "~/components/crud"

export interface Drivetrain extends BaseEntity {
  id: string  // Maps to _id from API
  _id: string
  name: string
  active: boolean
  vehicles?: number // Count of vehicles using this drivetrain
  createdAt: string
  updatedAt?: string
}

export interface CreateDrivetrainRequest {
  name: string
  active?: boolean
}

export interface UpdateDrivetrainRequest {
  name?: string
  active?: boolean
}

export interface DrivetrainResponse {
  success: boolean
  data?: Drivetrain
  error?: string
}

export interface DrivetrainsResponse {
  success: boolean
  data?: {
    drivetrains: Drivetrain[]
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

export interface DrivetrainStatsResponse {
  success: boolean
  data?: {
    total: number
    active: number
    inactive: number
  }
  error?: string
}

export interface DrivetrainFilters {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DrivetrainDropdownItem {
  _id: string
  name: string
  active: boolean
}
