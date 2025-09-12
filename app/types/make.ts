import type { BaseEntity } from "~/components/crud"

// Make entity interface - matches backend Mongoose schema
export interface Make extends BaseEntity {
  name: string
  slug: string
  logo?: string
  description?: string
  country?: string
  website?: string
  active: boolean
  vehicleCount?: number // Virtual field from backend
}

// For backwards compatibility
export type MakeRow = Make
