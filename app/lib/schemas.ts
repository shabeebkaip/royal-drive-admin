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

// Drive Type validation schema
export const driveTypeSchema = z.object({
  name: z
    .string()
    .min(2, "Drive type name must be at least 2 characters")
    .max(100, "Drive type name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Drive type name can only contain letters, numbers, spaces, and hyphens")
    .trim(),
  code: z
    .string()
    .min(2, "Drive type code must be at least 2 characters")
    .max(10, "Drive type code must be less than 10 characters")
    .regex(/^[A-Z0-9]+$/, "Drive type code can only contain uppercase letters and numbers")
    .trim(),
  active: z.boolean(),
})

export type DriveTypeFormData = z.infer<typeof driveTypeSchema>

export const defaultDriveTypeValues: DriveTypeFormData = {
  name: "",
  code: "",
  active: true,
}

export {};
