// Vehicle interfaces based on comprehensive API documentation
export interface Vehicle {
  _id: string                    // MongoDB ObjectId
  vin?: string                   // Vehicle Identification Number (17 chars, optional)
  make: string | PopulatedMake   // ObjectId reference to Make or populated object
  model: string | PopulatedModel // ObjectId reference to Model or populated object
  year: number                   // Manufacturing year (1900 - current year + 2)
  trim?: string                  // Vehicle trim level
  type: string | PopulatedVehicleType // ObjectId reference to VehicleType or populated object
  
  // Engine & Performance
  engine: {
    size: number                 // Engine displacement in liters
    cylinders: number            // Number of cylinders
    fuelType: string | PopulatedFuelType // ObjectId reference to FuelType or populated object
    horsepower?: number          // Engine horsepower
    torque?: number              // Engine torque
  }
  
  // Transmission
  transmission: {
    type: string | PopulatedTransmission // ObjectId reference to Transmission or populated object
    speeds?: number              // Number of transmission speeds
  }
  
  drivetrain: string | PopulatedDriveType // ObjectId reference to DriveType or populated object
  
  // Mileage
  odometer: {
    value: number                // Odometer reading
    unit: 'km' | 'miles'         // Distance unit (default: 'km')
    isAccurate: boolean          // Whether reading is accurate
  }
  
  // Condition & History
  condition: 'new' | 'used' | 'certified-pre-owned'
  accidentHistory: boolean      // Has accident history
  numberOfPreviousOwners: number // Number of previous owners
  
  // CarFax Information
  carfax: {
    reportUrl?: string           // CarFax report URL
    reportId?: string            // CarFax report ID
    hasCleanHistory: boolean     // Clean history status
    lastUpdated?: Date           // Last CarFax update
    serviceRecords: number       // Number of service records
  }
  
  // Pricing (CAD)
  pricing: {
    listPrice: number            // Listed selling price
    msrp?: number                // Manufacturer suggested retail price
    dealerCost?: number          // Dealer acquisition cost
    tradeInValue?: number        // Trade-in value
    marketValue?: number         // Current market value
    currency: 'CAD'              // Currency (always CAD)
    taxes: {
      hst: number                // HST percentage (default: 13%)
      licensing: number          // Licensing fees
      other?: number             // Other taxes/fees
    }
    financing: {
      available: boolean         // Financing available
      rate?: number              // Interest rate
      term?: number              // Financing term in months
      monthlyPayment?: number    // Calculated monthly payment
    }
  }
  
  // Features
  features: {
    exterior: string[]           // Exterior features
    interior: string[]           // Interior features
    safety: string[]             // Safety features
    technology: string[]         // Technology features
    convenience: string[]        // Convenience features
  }
  
  // Specifications
  specifications: {
    exteriorColor: string        // Exterior color
    interiorColor: string        // Interior color
    doors: number                // Number of doors
    seatingCapacity: number      // Seating capacity
    fuelTankCapacity?: number    // Fuel tank capacity
    fuelEconomy?: {
      city?: number              // City fuel economy
      highway?: number           // Highway fuel economy
      combined?: number          // Combined fuel economy
    }
    dimensions?: {
      length?: number            // Length in mm
      width?: number             // Width in mm
      height?: number            // Height in mm
      wheelbase?: number         // Wheelbase in mm
      weight?: number            // Weight in kg
    }
  }
  
  status: string | PopulatedStatus // ObjectId reference to Status or populated object
  availability: {
    inStock: boolean             // Currently in stock
    estimatedArrival?: Date      // Estimated arrival date
    lastUpdated: Date            // Last availability update
  }
  
  // Media
  media: {
    images: string[]             // Image URLs (at least 1 required)
    videos?: string[]            // Video URLs
    documents?: string[]         // Document URLs
  }
  
  // Warranty
  warranty: {
    manufacturer: {
      hasWarranty: boolean       // Has manufacturer warranty
      expiryDate?: Date          // Warranty expiry date
      kilometersRemaining?: number // Remaining warranty km
      type?: string              // Warranty type
    }
    extended: {
      available: boolean         // Extended warranty available
      provider?: string          // Extended warranty provider
      cost?: number              // Extended warranty cost
      duration?: number          // Extended warranty duration
    }
  }
  
  // Ontario Specific Requirements
  ontario: {
    emissionTest: {
      required: boolean          // Emission test required
      passed?: boolean           // Emission test passed
      expiryDate?: Date          // Emission test expiry
    }
    safetyStandard: {
      passed: boolean            // Safety standard passed
      certificationDate?: Date   // Certification date
      expiryDate?: Date          // Certification expiry
      inspector?: string         // Inspector name
    }
    uvip: {
      required: boolean          // UVIP required
      obtained?: boolean         // UVIP obtained
      cost: number               // UVIP cost (default: $20)
    }
  }
  
  // Internal Tracking
  internal: {
    stockNumber: string          // Unique stock number
    acquisitionDate: Date        // Date acquired by dealer
    acquisitionCost?: number     // Cost to acquire vehicle
    daysInInventory: number      // Days in inventory (calculated)
    lastServiceDate?: Date       // Last service date
    nextServiceDue?: Date        // Next service due date
    assignedSalesperson?: string // Assigned salesperson
    notes?: string               // Internal notes
  }
  
  // SEO & Marketing
  marketing: {
    featured: boolean            // Featured vehicle
    specialOffer?: string        // Special offer text
    keywords: string[]           // SEO keywords
    description: string          // Marketing description
    slug: string                 // URL-friendly slug (auto-generated)
  }
  
  createdAt: string              // ISO timestamp
  updatedAt: string              // ISO timestamp
  daysInInventoryCalculated?: number // Virtual field
}

// Populated reference types
export interface PopulatedMake {
  _id: string
  name: string
  slug: string
}

export interface PopulatedModel {
  _id: string
  name: string
  slug: string
}

export interface PopulatedVehicleType {
  _id: string
  name: string
  slug: string
}

export interface PopulatedFuelType {
  _id: string
  name: string
  slug: string
}

export interface PopulatedTransmission {
  _id: string
  name: string
  slug: string
}

export interface PopulatedDriveType {
  _id: string
  name: string
  slug: string
}

export interface PopulatedStatus {
  _id: string
  name: string
  slug: string
  color?: string
}

// Form data for creating/updating vehicles
export interface VehicleFormData {
  vin?: string
  make: string
  model: string
  year: number
  trim?: string
  type: string
  
  engine: {
    size: number
    cylinders: number
    fuelType: string
    horsepower?: number
    torque?: number
  }
  
  transmission: {
    type: string
    speeds?: number
  }
  
  drivetrain: string
  
  odometer: {
    value: number
    unit: 'km' | 'miles'
    isAccurate: boolean
  }
  
  condition: 'new' | 'used' | 'certified-pre-owned'
  accidentHistory: boolean
  numberOfPreviousOwners: number
  
  carfax?: {
    reportUrl?: string
    reportId?: string
    hasCleanHistory: boolean
    lastUpdated?: string
    serviceRecords: number
  }
  
  pricing: {
    listPrice: number
    msrp?: number
    dealerCost?: number
    tradeInValue?: number
    marketValue?: number
    currency: 'CAD'
    taxes: {
      hst: number
      licensing: number
      other?: number
    }
    financing: {
      available: boolean
      rate?: number
      term?: number
      monthlyPayment?: number
    }
  }
  
  features: {
    exterior: string[]
    interior: string[]
    safety: string[]
    technology: string[]
    convenience: string[]
  }
  
  specifications: {
    exteriorColor: string
    interiorColor: string
    doors: number
    seatingCapacity: number
    fuelTankCapacity?: number
    fuelEconomy?: {
      city?: number
      highway?: number
      combined?: number
    }
    dimensions?: {
      length?: number
      width?: number
      height?: number
      wheelbase?: number
      weight?: number
    }
  }
  
  status: string
  availability: {
    inStock: boolean
    estimatedArrival?: string
    lastUpdated: string
  }
  
  media: {
    images: string[]
    videos?: string[]
    documents?: string[]
  }
  
  warranty: {
    manufacturer: {
      hasWarranty: boolean
      expiryDate?: string
      kilometersRemaining?: number
      type?: string
    }
    extended: {
      available: boolean
      provider?: string
      cost?: number
      duration?: number
    }
  }
  
  ontario: {
    emissionTest: {
      required: boolean
      passed?: boolean
      expiryDate?: string
    }
    safetyStandard: {
      passed: boolean
      certificationDate?: string
      expiryDate?: string
      inspector?: string
    }
    uvip: {
      required: boolean
      obtained?: boolean
      cost: number
    }
  }
  
  internal: {
    stockNumber: string
    acquisitionDate: string
    acquisitionCost?: number
    lastServiceDate?: string
    nextServiceDue?: string
    assignedSalesperson?: string
    notes?: string
  }
  
  marketing: {
    featured: boolean
    specialOffer?: string
    keywords: string[]
    description: string
  }
}

// API query parameters
export interface VehicleFilters {
  page?: number
  limit?: number
  search?: string
  make?: string
  model?: string
  type?: string
  fuelType?: string
  transmission?: string
  drivetrain?: string
  status?: string
  condition?: 'new' | 'used' | 'certified-pre-owned'
  year?: number
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  featured?: boolean
  inStock?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  q?: string // for search endpoint
}

// Search parameters interface
export interface VehicleSearchParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  make?: string
  model?: string
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  condition?: 'new' | 'used' | 'certified-pre-owned'
  status?: string
  inStock?: boolean
}

// Bulk operations interface
export interface VehicleBulkOperation {
  operation: 'delete' | 'update-status' | 'update-price' | 'feature' | 'unfeature'
  vehicleIds: string[]
  data?: Record<string, any>
}

// API response interfaces
export interface VehiclesResponse {
  vehicles: Vehicle[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Paginated response for API calls
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface VehicleStats {
  total: number
  available: number
  sold: number
  pending: number
  featured: number
  inStock: number
  averagePrice: number
  priceRange: {
    min: number
    max: number
  }
  yearRange: {
    min: number
    max: number
  }
  conditionBreakdown: {
    new: number
    used: number
    'certified-pre-owned': number
  }
  topMakes: Array<{
    make: string
    count: number
  }>
}

// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
}

// Dropdown data types for form selects
export interface DropdownOption {
  _id: string
  name: string
  slug: string
}

export interface VehicleDropdowns {
  makes: DropdownOption[]
  models: DropdownOption[]
  vehicleTypes: DropdownOption[]
  fuelTypes: DropdownOption[]
  transmissions: DropdownOption[]
  driveTypes: DropdownOption[]
  statuses: DropdownOption[]
}

// Legacy types for backward compatibility
export type VehicleRow = {
  id: string
  year: number
  make: string
  model: string
  trim?: string
  bodyType: string
  fuelType: string
  drivetrain: string
  odometer: number
  price: number
  status: string
}

export type VehicleStatus = "available" | "sold" | "pending" | "reserved" | "on-hold"
export type BodyType = "sedan" | "suv" | "coupe" | "hatchback" | "truck" | "van" | "convertible" | "wagon" | "crossover" | "other"
export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric" | "plug-in-hybrid"
export type DrivetrainType = "fwd" | "rwd" | "awd" | "4wd"
