import type { BaseEntity } from "~/components/crud"

// Transmission interface based on API documentation
export interface Transmission extends BaseEntity {
  id: string  // Maps to _id from API
  _id: string
  name: string
  slug: string
  active: boolean
  vehicleCount?: number // Virtual field from backend
  createdAt: string
  updatedAt?: string
}

// Simplified transmission for dropdowns
export interface TransmissionDropdownItem {
  _id: string
  name: string
  slug: string
}

// Request payload for creating/updating transmissions
export interface CreateTransmissionRequest {
  name: string
  active?: boolean
}

export interface UpdateTransmissionRequest {
  name: string
  active?: boolean
}

export interface UpdateTransmissionStatusRequest {
  active: boolean
}
