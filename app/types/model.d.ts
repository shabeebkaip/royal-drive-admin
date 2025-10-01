import type { BaseEntity } from "~/components/crud"
import type { Make } from "./make"
import type { VehicleType } from "./vehicle-type"

// Model interface - matches API response format
export interface Model extends BaseEntity {
  _id?: string // MongoDB ObjectId (when returned from API)
  name: string
  slug: string
  description?: string
  active: boolean
  make: Make | string // Populated Make object or ObjectId string
  vehicleType: VehicleType | string // Populated VehicleType object or ObjectId string
  vehicleCount?: number // Virtual field from backend
}

// Simplified model for dropdowns
export interface ModelDropdownItem {
  id: string
  name: string
  slug: string
  make: {
    id: string
    name: string
  }
  vehicleType: {
    id: string
    name: string
  }
}
