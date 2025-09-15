import { z } from "zod"

// Vehicle Type form schema for validation
export const vehicleTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Vehicle type name is required")
    .min(2, "Vehicle type name must be at least 2 characters")
    .max(50, "Vehicle type name must be less than 50 characters")
    .trim(),
  icon: z
    .string()
    .url("Icon must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform(val => val || undefined),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal(""))
    .transform(val => val || undefined),
  isActive: z.boolean(),
})

export type VehicleTypeFormData = z.infer<typeof vehicleTypeFormSchema>

export const defaultVehicleTypeValues: VehicleTypeFormData = {
  name: "",
  icon: undefined,
  description: undefined,
  isActive: true,
}
