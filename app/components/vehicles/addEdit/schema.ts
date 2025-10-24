import { z } from "zod"

// Vehicle form schema aligned with the updated backend structure
export const vehicleFormSchema = z.object({
  // Basic Vehicle Information (Required)
  make: z.string().min(1, "Make is required").max(50, "Make cannot exceed 50 characters"),
  model: z.string().min(1, "Model is required").max(50, "Model cannot exceed 50 characters"),
  year: z.number().min(1900, "Year must be after 1900").max(new Date().getFullYear() + 2, "Year cannot be more than 2 years in the future"),
  type: z.string().min(1, "Vehicle type is required"), // Changed from bodyType to type

  // Optional Basic Information
  vin: z.string().optional().or(z.literal("")),
  trim: z.string().optional().or(z.literal("")),

  // Engine Information (Required fields)
  engineSize: z.number().min(0.5, "Engine size must be at least 0.5L"),
  cylinders: z.number().min(1, "Must have at least 1 cylinder"),
  fuelType: z.string().min(1, "Fuel type is required"),
  
  // Optional Engine Information
  horsepower: z.number().optional(),
  torque: z.number().optional(),

  // Transmission & Drivetrain (Required)
  transmissionType: z.string().min(1, "Transmission type is required"),
  drivetrain: z.string().min(1, "Drivetrain is required"),
  
  // Optional Transmission Info
  transmissionSpeeds: z.number().optional(),

  // Odometer (Required value, optional unit with default)
  odometerValue: z.number().min(0, "Odometer cannot be negative"),
  odometerUnit: z.string().default("km"),
  odometerIsAccurate: z.boolean().default(true),

  // Condition (Required)
  condition: z.string().min(1, "Condition is required"),

  // Optional with defaults
  accidentHistory: z.boolean().default(false),
  numberOfPreviousOwners: z.number().min(0, "Cannot have negative previous owners").default(0),

  // Pricing (Customer-facing - Required listPrice only)
  listPrice: z.number().min(0, "List price is required and cannot be negative"),
  licensingPrice: z.number().min(0, "Licensing price cannot be negative").default(70),
  
  // Pricing defaults
  currency: z.string().default("CAD"),
  hstRate: z.number().default(13), // Ontario HST
  financingAvailable: z.boolean().default(true),

  // Physical Specifications (Required)
  exteriorColor: z.string().min(1, "Exterior color is required"),
  interiorColor: z.string().min(1, "Interior color is required"),
  doors: z.number().min(2, "Must have at least 2 doors"),
  seatingCapacity: z.number().min(1, "Must seat at least 1 person"),

  // Status & Availability (Required)
  status: z.string().min(1, "Status is required"),
  inStock: z.boolean().default(true),

  // Marketing (Required description)
  description: z.string().min(1, "Marketing description is required").max(2000, "Description cannot exceed 2000 characters"),
  featured: z.boolean().default(false),
  specialOffer: z.string().optional().or(z.literal("")),

  // Images (Required - at least 1)
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),

  // Optional Internal Tracking (removed stockNumber as it's auto-generated)
  // Internal Tracking (Business Operations)
  acquisitionDate: z.string().optional(),
  acquisitionCost: z.number().min(0, "Acquisition cost cannot be negative").optional(),
  assignedSalesperson: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),

  // Optional CarFax
  hasCleanHistory: z.boolean().default(true),
  carfaxReportUrl: z.string().optional().or(z.literal("")),

  // Optional Ontario Specific (auto-calculated)
  safetyStandardPassed: z.boolean().optional(),
  emissionTestPassed: z.boolean().optional(),
})

export type VehicleFormData = z.infer<typeof vehicleFormSchema>

// Default values for the form
export const defaultVehicleValues: Partial<VehicleFormData> = {
  // Odometer defaults
  odometerUnit: "km",
  odometerIsAccurate: true,
  
  // History defaults
  accidentHistory: false,
  numberOfPreviousOwners: 0,
  
  // Pricing defaults
  currency: "CAD",
  hstRate: 13, // Ontario HST
  licensingPrice: 70, // Default licensing fee in CAD
  financingAvailable: true,
  
  // Availability defaults
  inStock: true,
  
  // Marketing defaults
  featured: false,
  
  // CarFax defaults
  hasCleanHistory: true,
  
  // Images
  images: [], // Default empty array for images
}
