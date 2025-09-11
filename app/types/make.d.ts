import { z } from "zod"
import type { BaseEntity } from "~/components/crud"

// Update Make interface to extend BaseEntity
export interface Make extends BaseEntity {
  name: string
  logo?: string
  vehicleCount: number // Remove optional to fix TypeScript errors
}

// Form data for Make
export const makeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Make name is required")
    .min(2, "Make name must be at least 2 characters")
    .max(50, "Make name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s\-&.]+$/, "Make name contains invalid characters"),
  logo: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
})

export type MakeFormData = z.infer<typeof makeFormSchema>

export const defaultMakeValues: MakeFormData = {
  name: "",
  logo: "",
}

// For backwards compatibility
export type MakeRow = Make
