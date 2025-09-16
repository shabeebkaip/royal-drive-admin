import type { BaseEntity } from "~/components/crud"

// Vehicle Type interface
export interface VehicleType extends BaseEntity {
  name: string
  slug: string
  icon?: string
  active: boolean // This comes from the API, but we don't need it in the form
  vehicleCount?: number // Virtual field from backend
}
