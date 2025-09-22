import { z } from "zod"

// Vehicle form schema based on the Mongoose schema but simplified for UI
export const vehicleFormSchema = z.object({
  // Basic Vehicle Information
  vin: z.string().optional().or(z.literal("")),
  make: z.string().min(1, "Make is required").max(50, "Make cannot exceed 50 characters"),
  model: z.string().min(1, "Model is required").max(50, "Model cannot exceed 50 characters"),
  year: z.number().min(1900, "Year must be after 1900").max(new Date().getFullYear() + 2, "Year cannot be more than 2 years in the future"),
  trim: z.string().optional().or(z.literal("")),
  bodyType: z.string().min(1, "Body type is required"),

  // Engine & Performance
  engineSize: z.number().min(0.5, "Engine size must be at least 0.5L"),
  cylinders: z.number().min(1, "Must have at least 1 cylinder"),
  fuelType: z.string().min(1, "Fuel type is required"),
  horsepower: z.number().optional(),
  torque: z.number().optional(),

  // Transmission & Drivetrain
  transmissionType: z.string().min(1, "Transmission type is required"),
  transmissionSpeeds: z.number().optional(),
  drivetrain: z.string().min(1, "Drivetrain is required"),

  // Mileage & Condition
  odometerValue: z.number().min(0, "Odometer cannot be negative"),
  odometerUnit: z.string().default("km"),
  condition: z.string().min(1, "Condition is required"),
  accidentHistory: z.boolean().default(false),
  numberOfPreviousOwners: z.number().min(0, "Cannot have negative previous owners").default(0),

  // Pricing
  listPrice: z.number().min(0, "Price cannot be negative"),
  msrp: z.number().optional(),
  dealerCost: z.number().optional(),

  // Physical Specifications
  exteriorColor: z.string().min(1, "Exterior color is required"),
  interiorColor: z.string().min(1, "Interior color is required"),
  doors: z.number().min(2, "Must have at least 2 doors"),
  seatingCapacity: z.number().min(1, "Must seat at least 1 person"),

  // Status & Availability
  status: z.string().default("available"),
  inStock: z.boolean().default(true),

  // Internal Tracking
  stockNumber: z.string().min(1, "Stock number is required"),
  acquisitionDate: z.string(), // Will be converted to Date
  acquisitionCost: z.number().optional(),
  assignedSalesperson: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),

  // Marketing
  description: z.string().min(1, "Description is required").max(2000, "Description cannot exceed 2000 characters"),
  featured: z.boolean().default(false),
  specialOffer: z.string().optional().or(z.literal("")),

  // CarFax
  hasCleanHistory: z.boolean().default(true),
  carfaxReportUrl: z.string().optional().or(z.literal("")),

  // Ontario Specific
  safetyStandardPassed: z.boolean().default(false),
  emissionTestPassed: z.boolean().optional(),

  // Images
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
})

export type VehicleFormData = z.infer<typeof vehicleFormSchema>

// Default values for the form
export const defaultVehicleValues: Partial<VehicleFormData> = {
  odometerUnit: "km",
  condition: "used",
  accidentHistory: false,
  numberOfPreviousOwners: 0,
  status: "available",
  inStock: true,
  featured: false,
  hasCleanHistory: true,
  safetyStandardPassed: false,
  acquisitionDate: new Date().toISOString().split('T')[0], // Today's date
  images: [], // Default empty array for images
}
