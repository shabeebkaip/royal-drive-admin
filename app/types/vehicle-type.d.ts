import { z } from "zod"
import type { BaseEntity } from "~/components/crud"

// Vehicle Type interface
export interface VehicleType extends BaseEntity {
  name: string
  description?: string
  isActive: boolean
  vehicleCount: number
}

// Form data for Vehicle Type
export const vehicleTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Vehicle type name is required")
    .min(2, "Vehicle type name must be at least 2 characters")
    .max(50, "Vehicle type name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
})

export type VehicleTypeFormData = z.infer<typeof vehicleTypeFormSchema>

export const defaultVehicleTypeValues: VehicleTypeFormData = {
  name: "",
  description: "",
  isActive: true,
}
