/**
 * Vehicle Inventory API Service
 * Handles all vehicle listing, filtering, and pagination operations
 */

export interface VehicleInventoryItem {
  _id: string
  vin?: string
  make: {
    _id: string
    name: string
    slug: string
    country?: string
  }
  model: {
    _id: string
    name: string
    slug: string
  }
  year: number
  trim?: string
  type: {
    _id: string
    name: string
    slug: string
  }
  engine: {
    size: number
    cylinders: number
    fuelType: {
      _id: string
      name: string
      slug: string
    }
    horsepower?: number
    torque?: number
  }
  transmission: {
    type: {
      _id: string
      name: string
      slug: string
    }
    speeds?: number
  }
  drivetrain: {
    _id: string
    name: string
    slug: string
  }
  odometer: {
    value: number
    unit: 'km' | 'miles'
    isAccurate: boolean
  }
  condition: 'new' | 'used' | 'certified-pre-owned'
  accidentHistory: boolean
  numberOfPreviousOwners: number
  carfax: {
    hasCleanHistory: boolean
    serviceRecords: number
    reportUrl?: string
  }
  pricing: {
    listPrice: number
    msrp?: number
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
      city: number
      highway: number
      combined: number
    }
    dimensions?: {
      length: number
      width: number
      height: number
      wheelbase: number
      weight: number
    }
  }
  status: {
    _id: string
    name: string
    slug: string
    color: string
  }
  availability: {
    inStock: boolean
    estimatedArrival?: string
    lastUpdated: string
  }
  media: {
    images: string[]
    videos: string[]
    documents: string[]
  }
  ontario: {
    emissionTest: {
      required: boolean
      passed: boolean
      expiryDate?: string
    }
    safetyStandard: {
      passed: boolean
      certificationDate?: string
      inspector?: string
    }
    uvip: {
      required: boolean
      obtained: boolean
      cost?: number
    }
  }
  internal: {
    acquisitionDate: string
    daysInInventory: number
    assignedSalesperson?: string
  }
  marketing: {
    featured: boolean
    specialOffer?: string
    description?: string
    keywords: string[]
    slug: string
  }
  history: {
    owners: number
    accidents: any[]
    carfaxScore: number
    serviceRecords: any[]
  }
  createdAt: string
  updatedAt: string
}

export interface VehicleFilters {
  // Pagination
  page?: number
  limit?: number
  
  // Sorting
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  
  // Basic Information
  make?: string
  model?: string
  year?: number
  minYear?: number
  maxYear?: number
  type?: string
  condition?: string
  
  // Engine & Performance
  fuelType?: string
  transmission?: string
  drivetrain?: string
  minEngine?: number
  maxEngine?: number
  minHorsepower?: number
  maxHorsepower?: number
  
  // Pricing
  minPrice?: number
  maxPrice?: number
  hasFinancing?: boolean
  maxMonthlyPayment?: number
  
  // Mileage
  minMileage?: number
  maxMileage?: number
  mileageUnit?: 'km' | 'miles'
  
  // Physical Specifications
  exteriorColor?: string
  interiorColor?: string
  minDoors?: number
  maxDoors?: number
  minSeating?: number
  maxSeating?: number
  
  // Status & Availability
  status?: string
  inStock?: boolean
  featured?: boolean
  
  // History & Condition
  accidentHistory?: boolean
  maxOwners?: number
  cleanCarfax?: boolean
  
  // Ontario Specific
  safetyPassed?: boolean
  emissionPassed?: boolean
  uvipObtained?: boolean
  
  // Inventory Management
  maxDaysInInventory?: number
  assignedSalesperson?: string
  
  // Search
  search?: string
  vin?: string
}

export interface VehicleInventoryResponse {
  success: boolean
  message: string
  timestamp: string
  data: {
    vehicles: VehicleInventoryItem[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface VehicleStats {
  totalVehicles: number
  availableVehicles: number
  soldVehicles: number
  pendingVehicles: number
  featuredVehicles: number
  averagePrice: number
  averageDaysInInventory: number
}

class VehicleInventoryService {
  private baseUrl: string

  constructor() {
    // Get base URL from environment variables with fallback
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'https://api.royaldrivecanada.com/api/v1'
    this.baseUrl = `${apiBaseUrl}/vehicles`
  }

  /**
   * Fetch vehicles with filters and pagination
   */
  async getVehicles(filters: VehicleFilters = {}): Promise<VehicleInventoryResponse> {
    const queryParams = new URLSearchParams()
    
    console.log('🌐 VehicleInventoryService - Base URL:', this.baseUrl)
    console.log('🔧 VehicleInventoryService - Filters:', filters)
    
    // Add pagination
    if (filters.page) queryParams.append('page', filters.page.toString())
    if (filters.limit) queryParams.append('limit', filters.limit.toString())
    
    // Add sorting
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)
    
    // Add basic information filters
    if (filters.make) queryParams.append('make', filters.make)
    if (filters.model) queryParams.append('model', filters.model)
    if (filters.year) queryParams.append('year', filters.year.toString())
    if (filters.minYear) queryParams.append('minYear', filters.minYear.toString())
    if (filters.maxYear) queryParams.append('maxYear', filters.maxYear.toString())
    if (filters.type) queryParams.append('type', filters.type)
    if (filters.condition) queryParams.append('condition', filters.condition)
    
    // Add engine & performance filters
    if (filters.fuelType) queryParams.append('fuelType', filters.fuelType)
    if (filters.transmission) queryParams.append('transmission', filters.transmission)
    if (filters.drivetrain) queryParams.append('drivetrain', filters.drivetrain)
    if (filters.minEngine) queryParams.append('minEngine', filters.minEngine.toString())
    if (filters.maxEngine) queryParams.append('maxEngine', filters.maxEngine.toString())
    if (filters.minHorsepower) queryParams.append('minHorsepower', filters.minHorsepower.toString())
    if (filters.maxHorsepower) queryParams.append('maxHorsepower', filters.maxHorsepower.toString())
    
    // Add pricing filters
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString())
    if (filters.hasFinancing !== undefined) queryParams.append('hasFinancing', filters.hasFinancing.toString())
    if (filters.maxMonthlyPayment) queryParams.append('maxMonthlyPayment', filters.maxMonthlyPayment.toString())
    
    // Add mileage filters
    if (filters.minMileage) queryParams.append('minMileage', filters.minMileage.toString())
    if (filters.maxMileage) queryParams.append('maxMileage', filters.maxMileage.toString())
    if (filters.mileageUnit) queryParams.append('mileageUnit', filters.mileageUnit)
    
    // Add physical specification filters
    if (filters.exteriorColor) queryParams.append('exteriorColor', filters.exteriorColor)
    if (filters.interiorColor) queryParams.append('interiorColor', filters.interiorColor)
    if (filters.minDoors) queryParams.append('minDoors', filters.minDoors.toString())
    if (filters.maxDoors) queryParams.append('maxDoors', filters.maxDoors.toString())
    if (filters.minSeating) queryParams.append('minSeating', filters.minSeating.toString())
    if (filters.maxSeating) queryParams.append('maxSeating', filters.maxSeating.toString())
    
    // Add status & availability filters
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString())
    if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString())
    
    // Add history & condition filters
    if (filters.accidentHistory !== undefined) queryParams.append('accidentHistory', filters.accidentHistory.toString())
    if (filters.maxOwners) queryParams.append('maxOwners', filters.maxOwners.toString())
    if (filters.cleanCarfax !== undefined) queryParams.append('cleanCarfax', filters.cleanCarfax.toString())
    
    // Add Ontario specific filters
    if (filters.safetyPassed !== undefined) queryParams.append('safetyPassed', filters.safetyPassed.toString())
    if (filters.emissionPassed !== undefined) queryParams.append('emissionPassed', filters.emissionPassed.toString())
    if (filters.uvipObtained !== undefined) queryParams.append('uvipObtained', filters.uvipObtained.toString())
    
    // Add inventory management filters
    if (filters.maxDaysInInventory) queryParams.append('maxDaysInInventory', filters.maxDaysInInventory.toString())
    if (filters.assignedSalesperson) queryParams.append('assignedSalesperson', filters.assignedSalesperson)
    
    // Add search filters
    if (filters.search) queryParams.append('search', filters.search)
    if (filters.vin) queryParams.append('vin', filters.vin)

    try {
      const url = `${this.baseUrl}?${queryParams.toString()}`
      console.log('🚀 Making request to:', url)
      
      const response = await fetch(url)
      
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: VehicleInventoryResponse = await response.json()
      
      console.log('📦 Response data:', data)
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch vehicles')
      }
      
      return data
    } catch (error) {
      console.error('💥 Error fetching vehicles:', error)
      throw error
    }
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: string): Promise<VehicleInventoryItem> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch vehicle')
      }
      
      return data.data
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      throw error
    }
  }

  /**
   * Get vehicle statistics
   */
  async getStats(): Promise<VehicleStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch vehicle stats')
      }
      
      return data.data
    } catch (error) {
      console.error('Error fetching vehicle stats:', error)
      throw error
    }
  }

  /**
   * Helper functions for filter options
   */
  getMakeOptions() {
    return [
      { value: 'honda', label: 'Honda' },
      { value: 'toyota', label: 'Toyota' },
      { value: 'ford', label: 'Ford' },
      { value: 'chevrolet', label: 'Chevrolet' },
      { value: 'hyundai', label: 'Hyundai' },
      { value: 'kia', label: 'Kia' },
      { value: 'mazda', label: 'Mazda' },
      { value: 'subaru', label: 'Subaru' },
      { value: 'volkswagen', label: 'Volkswagen' },
      { value: 'bmw', label: 'BMW' },
      { value: 'mercedes-benz', label: 'Mercedes-Benz' },
      { value: 'audi', label: 'Audi' },
      { value: 'lexus', label: 'Lexus' },
      { value: 'acura', label: 'Acura' },
      { value: 'infiniti', label: 'Infiniti' }
    ]
  }

  getVehicleTypeOptions() {
    return [
      { value: 'sedan', label: 'Sedan' },
      { value: 'hatchback', label: 'Hatchback' },
      { value: 'suv', label: 'SUV' },
      { value: 'crossover', label: 'Crossover' },
      { value: 'truck', label: 'Truck' },
      { value: 'coupe', label: 'Coupe' },
      { value: 'convertible', label: 'Convertible' },
      { value: 'wagon', label: 'Wagon' },
      { value: 'van', label: 'Van' },
      { value: 'minivan', label: 'Minivan' }
    ]
  }

  getConditionOptions() {
    return [
      { value: 'new', label: 'New' },
      { value: 'used', label: 'Used' },
      { value: 'certified-pre-owned', label: 'Certified Pre-Owned' }
    ]
  }

  getStatusOptions() {
    return [
      { value: 'available', label: 'Available' },
      { value: 'pending', label: 'Pending' },
      { value: 'sold', label: 'Sold' },
      { value: 'on-hold', label: 'On Hold' }
    ]
  }

  getFuelTypeOptions() {
    return [
      { value: 'gasoline', label: 'Gasoline' },
      { value: 'diesel', label: 'Diesel' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'electric', label: 'Electric' },
      { value: 'plug-in-hybrid', label: 'Plug-in Hybrid' }
    ]
  }

  getTransmissionOptions() {
    return [
      { value: 'manual', label: 'Manual' },
      { value: 'automatic', label: 'Automatic' },
      { value: 'cvt', label: 'CVT' },
      { value: 'dual-clutch', label: 'Dual Clutch' }
    ]
  }

  getDrivetrainOptions() {
    return [
      { value: 'fwd', label: 'Front-Wheel Drive' },
      { value: 'rwd', label: 'Rear-Wheel Drive' },
      { value: 'awd', label: 'All-Wheel Drive' },
      { value: '4wd', label: '4-Wheel Drive' }
    ]
  }
}

export const vehicleInventoryService = new VehicleInventoryService()
