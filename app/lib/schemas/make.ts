import { z } from "zod"

// Make form validation schema
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
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
})

// Infer the type from schema
export type MakeFormData = z.infer<typeof makeFormSchema>

// Default form values
export const defaultMakeValues: MakeFormData = {
  name: "",
  logo: "",
  description: "",
}
