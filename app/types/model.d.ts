import type { BaseEntity } from "~/components/crud"
import type { Make } from "./make"
import type { VehicleType } from "./vehicle-type"

// Model interface
export interface Model extends BaseEntity {
  name: string
  slug: string
  description?: string
  active: boolean
  make: Make | string // Populated or just ID
  vehicleType: VehicleType | string // Populated or just ID
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
