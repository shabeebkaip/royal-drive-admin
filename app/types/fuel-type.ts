import type { BaseEntity } from "~/components/crud"

// FuelType interface based on API documentation
export interface FuelType extends BaseEntity {
  id: string  // Maps to _id from API
  _id: string
  name: string
  slug: string
  active: boolean
  vehicleCount?: number // Virtual field from backend
  createdAt: string
  updatedAt?: string
}

// Simplified fuel type for dropdowns
export interface FuelTypeDropdownItem {
  _id: string
  name: string
  slug: string
}

// Request payload for creating/updating fuel types
export interface CreateFuelTypeRequest {
  name: string
  active?: boolean
}

export interface UpdateFuelTypeRequest {
  name: string
  active?: boolean
}

export interface UpdateFuelTypeStatusRequest {
  active: boolean
}
