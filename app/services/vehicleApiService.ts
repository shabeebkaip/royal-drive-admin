import type { VehicleFormData } from "~/components/vehicles/addEdit/schema"

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'
const BASE_URL = `${API_BASE_URL}/vehicles`

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
}

interface ValidationError {
  field: string
  message: string
}

interface ApiError {
  success: false
  message: string
  timestamp: string
  errors?: ValidationError[]
  error?: string
}

// Transform form data to API format
function transformFormDataToApiFormat(formData: VehicleFormData) {
  return {
    // Basic Vehicle Information
    vin: formData.vin || undefined,
    make: formData.make,
    model: formData.model,
    year: formData.year,
    trim: formData.trim || undefined,
    type: formData.type,

    // Engine & Performance
    engine: {
      size: formData.engineSize,
      cylinders: formData.cylinders,
      fuelType: formData.fuelType,
      horsepower: formData.horsepower || undefined,
    },

    // Transmission
    transmission: {
      type: formData.transmissionType,
    },

    drivetrain: formData.drivetrain,

    // Mileage
    odometer: {
      value: formData.odometerValue,
      unit: formData.odometerUnit || "km",
      isAccurate: formData.odometerIsAccurate !== undefined ? formData.odometerIsAccurate : true,
    },

    // Condition & History
    condition: formData.condition,
    accidentHistory: formData.accidentHistory || false,
    numberOfPreviousOwners: formData.numberOfPreviousOwners || 0,

    // CarFax Information
    carfax: formData.carfaxReportUrl ? {
      reportUrl: formData.carfaxReportUrl,
      hasCleanHistory: formData.hasCleanHistory || true,
    } : undefined,

    // Pricing
    pricing: {
      listPrice: formData.listPrice,
      currency: formData.currency || "CAD",
      taxes: {
        hst: formData.hstRate || 13, // Ontario HST default
      },
      financing: {
        available: formData.financingAvailable !== undefined ? formData.financingAvailable : true,
      },
    },

    // Physical Specifications
    specifications: {
      exteriorColor: formData.exteriorColor,
      interiorColor: formData.interiorColor,
      doors: formData.doors,
      seatingCapacity: formData.seatingCapacity,
    },

    status: formData.status,

    // Availability
    availability: {
      inStock: formData.inStock || true,
    },

    // Media
    media: {
      images: formData.images || ["https://via.placeholder.com/800x600/cccccc/969696?text=Vehicle+Image"],
    },

    // Ontario Specific
    ontario: {
      safetyStandard: {
        passed: formData.safetyStandardPassed || false,
      },
    },

    // Internal Tracking
    internal: {
      acquisitionDate: formData.acquisitionDate ? new Date(formData.acquisitionDate) : undefined,
      acquisitionCost: formData.acquisitionCost || undefined,
      assignedSalesperson: formData.assignedSalesperson || undefined,
      notes: formData.notes || undefined,
    },

    // SEO & Marketing
    marketing: {
      featured: formData.featured || false,
      specialOffer: formData.specialOffer || undefined,
      description: formData.description,
    },
  }
}

export const vehicleApiService = {
  // Create a new vehicle
  async createVehicle(formData: VehicleFormData): Promise<ApiResponse<any>> {
    try {
      const apiData = transformFormDataToApiFormat(formData)

      console.log('Creating vehicle with data:', apiData)

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  },

  // Update an existing vehicle
  async updateVehicle(id: string, formData: VehicleFormData): Promise<ApiResponse<any>> {
    try {
      const apiData = transformFormDataToApiFormat(formData)

      console.log('Updating vehicle with data:', apiData)

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error('Error updating vehicle:', error)
      throw error
    }
  },

  // Get vehicle by ID
  async getVehicleById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      throw error
    }
  },

  // Delete vehicle
  async deleteVehicle(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      throw error
    }
  },
}
