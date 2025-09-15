import type { BaseEntity } from "~/components/crud"

// Vehicle Type interface
export interface VehicleType extends BaseEntity {
  name: string
  slug: string
  icon?: string
  description?: string
  isActive: boolean
  vehicleCount?: number // Virtual field from backend
}
