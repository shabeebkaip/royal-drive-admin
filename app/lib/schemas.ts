import { z } from "zod"

// Fuel Type validation schema
export const fuelTypeSchema = z.object({
  name: z
    .string()
    .min(2, "Fuel type name must be at least 2 characters")
    .max(50, "Fuel type name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Fuel type name can only contain letters, numbers, spaces, and hyphens")
    .trim(),
  active: z.boolean(),
})

export type FuelTypeFormData = z.infer<typeof fuelTypeSchema>

export const defaultFuelTypeValues: FuelTypeFormData = {
  name: "",
  active: true,
}

// Transmission validation schema
export const transmissionSchema = z.object({
  name: z
    .string()
    .min(2, "Transmission name must be at least 2 characters")
    .max(50, "Transmission name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Transmission name can only contain letters, numbers, spaces, and hyphens")
    .trim(),
  active: z.boolean(),
})

export type TransmissionFormData = z.infer<typeof transmissionSchema>

export const defaultTransmissionValues: TransmissionFormData = {
  name: "",
  active: true,
}

export {};
