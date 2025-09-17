import { z } from "zod"

// Model form schema for validation
export const modelFormSchema = z.object({
  name: z
    .string()
    .min(1, "Model name is required")
    .min(2, "Model name must be at least 2 characters")
    .max(100, "Model name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal(""))
    .transform(val => val || undefined),
  make: z
    .string()
    .min(1, "Make is required"),
  vehicleType: z
    .string()
    .min(1, "Vehicle type is required"),
})

export type ModelFormData = z.infer<typeof modelFormSchema>

export const defaultModelValues: ModelFormData = {
  name: "",
  description: undefined,
  make: "",
  vehicleType: "",
}
