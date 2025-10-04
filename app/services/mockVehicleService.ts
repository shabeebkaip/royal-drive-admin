import type { 
  Vehicle, 
  VehicleFormData, 
  VehicleFilters, 
  VehicleSearchParams,
  VehicleStats,
  VehicleBulkOperation,
  VehicleDropdowns,
  ApiResponse,
  PaginatedResponse,
  PopulatedMake,
  PopulatedModel,
  PopulatedVehicleType,
  PopulatedFuelType,
  PopulatedTransmission,
  PopulatedDriveType,
  PopulatedStatus
} from '~/types/vehicle'

// Type for our mock vehicles with guaranteed populated fields
interface MockVehicle extends Omit<Vehicle, 'make' | 'model' | 'type' | 'engine' | 'transmission' | 'drivetrain' | 'status'> {
  make: PopulatedMake
  model: PopulatedModel
  type: PopulatedVehicleType
  engine: Vehicle['engine'] & {
    fuelType: PopulatedFuelType
  }
  transmission: {
    type: PopulatedTransmission
    speeds?: number
  }
  drivetrain: PopulatedDriveType
  status: PopulatedStatus
}

// Sample vehicle data for development
const mockVehicles: MockVehicle[] = [
  {
    _id: '1',
    vin: '1HGCM82633A004352',
    make: {
      _id: 'make-1',
      name: 'Toyota',
      slug: 'toyota'
    },
    model: {
      _id: 'model-1',
      name: 'Camry',
      slug: 'camry'
    },
    year: 2023,
    trim: 'LE',
    type: {
      _id: 'type-1',
      name: 'Sedan',
      slug: 'sedan'
    },
    engine: {
      size: 2.5,
      cylinders: 4,
      fuelType: {
        _id: 'fuel-1',
        name: 'Gasoline',
        slug: 'gasoline'
      },
      horsepower: 203,
      torque: 184
    },
    transmission: {
      type: {
        _id: 'trans-1',
        name: 'Automatic CVT',
        slug: 'automatic-cvt'
      },
      speeds: 0
    },
    drivetrain: {
      _id: 'drive-1',
      name: 'Front-Wheel Drive',
      slug: 'fwd'
    },
    odometer: {
      value: 15000,
      unit: 'km',
      isAccurate: true
    },
    condition: 'used',
    accidentHistory: false,
    numberOfPreviousOwners: 1,
    carfax: {
      hasCleanHistory: true,
      serviceRecords: 3
    },
    pricing: {
      listPrice: 28500,
      msrp: 30000,
      currency: 'CAD',
      taxes: {
        hst: 13,
        licensing: 150
      },
      financing: {
        available: true,
        rate: 4.99,
        term: 60,
        monthlyPayment: 485
      }
    },
    features: {
      exterior: ['LED Headlights', 'Alloy Wheels', 'Power Sunroof'],
      interior: ['Leather Seats', 'Heated Seats', 'Navigation System'],
      safety: ['Backup Camera', 'Blind Spot Monitor', 'Lane Departure Warning'],
      technology: ['Bluetooth', 'Apple CarPlay', 'Android Auto'],
      convenience: ['Keyless Entry', 'Remote Start', 'Cruise Control']
    },
    specifications: {
      exteriorColor: 'Midnight Blue',
      interiorColor: 'Black Leather',
      doors: 4,
      seatingCapacity: 5,
      fuelTankCapacity: 60,
      fuelEconomy: {
        city: 8.7,
        highway: 6.5,
        combined: 7.6
      }
    },
    status: {
      _id: 'status-1',
      name: 'Available',
      slug: 'available',
      color: '#28a745'
    },
    availability: {
      inStock: true,
      lastUpdated: new Date()
    },
    media: {
      images: [
        'https://example.com/vehicle-1-front.jpg',
        'https://example.com/vehicle-1-side.jpg',
        'https://example.com/vehicle-1-interior.jpg'
      ]
    },
    warranty: {
      manufacturer: {
        hasWarranty: true,
        expiryDate: new Date('2027-01-15'),
        kilometersRemaining: 85000,
        type: 'Comprehensive'
      },
      extended: {
        available: true,
        provider: 'Toyota Extended',
        cost: 2500
      }
    },
    ontario: {
      emissionTest: {
        required: true,
        passed: true,
        expiryDate: new Date('2025-01-15')
      },
      safetyStandard: {
        passed: true,
        certificationDate: new Date('2024-01-10'),
        expiryDate: new Date('2026-01-10'),
        inspector: 'Certified Mechanic #12345'
      },
      uvip: {
        required: true,
        obtained: true,
        cost: 20
      }
    },
    internal: {
      acquisitionDate: new Date('2024-01-05'),
      acquisitionCost: 25000,
      daysInInventory: 15,
      assignedSalesperson: 'John Smith'
    },
    marketing: {
      featured: true,
      specialOffer: '0.9% Financing Available',
      keywords: ['reliable', 'fuel-efficient', 'family-car'],
      description: 'A well-maintained 2023 Toyota Camry with low mileage and excellent condition. Perfect for families looking for reliability and fuel efficiency.',
      slug: 'toyota-camry-2023-sku-001'
    },
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  },
  {
    _id: '2',
    vin: '3VWD17AJ5EM388202',
    make: {
      _id: 'make-2',
      name: 'Honda',
      slug: 'honda'
    },
    model: {
      _id: 'model-2',
      name: 'Civic',
      slug: 'civic'
    },
    year: 2022,
    trim: 'Sport',
    type: {
      _id: 'type-2',
      name: 'Hatchback',
      slug: 'hatchback'
    },
    engine: {
      size: 2.0,
      cylinders: 4,
      fuelType: {
        _id: 'fuel-1',
        name: 'Gasoline',
        slug: 'gasoline'
      },
      horsepower: 158,
      torque: 138
    },
    transmission: {
      type: {
        _id: 'trans-2',
        name: '6-Speed Manual',
        slug: '6-speed-manual'
      },
      speeds: 6
    },
    drivetrain: {
      _id: 'drive-1',
      name: 'Front-Wheel Drive',
      slug: 'fwd'
    },
    odometer: {
      value: 35000,
      unit: 'km',
      isAccurate: true
    },
    condition: 'used',
    accidentHistory: false,
    numberOfPreviousOwners: 1,
    carfax: {
      hasCleanHistory: true,
      serviceRecords: 5
    },
    pricing: {
      listPrice: 24900,
      msrp: 26500,
      currency: 'CAD',
      taxes: {
        hst: 13,
        licensing: 150
      },
      financing: {
        available: true,
        rate: 5.49,
        term: 72,
        monthlyPayment: 395
      }
    },
    features: {
      exterior: ['Sport Wheels', 'Rear Spoiler', 'LED Fog Lights'],
      interior: ['Sport Seats', 'Manual Transmission', 'Digital Display'],
      safety: ['Honda Sensing Suite', 'Collision Mitigation', 'Road Departure Mitigation'],
      technology: ['7-inch Display', 'Apple CarPlay', 'Android Auto'],
      convenience: ['Push Button Start', 'Dual-Zone Climate']
    },
    specifications: {
      exteriorColor: 'Rally Red',
      interiorColor: 'Black Cloth',
      doors: 5,
      seatingCapacity: 5,
      fuelTankCapacity: 47,
      fuelEconomy: {
        city: 8.9,
        highway: 6.7,
        combined: 7.8
      }
    },
    status: {
      _id: 'status-1',
      name: 'Available',
      slug: 'available',
      color: '#28a745'
    },
    availability: {
      inStock: true,
      lastUpdated: new Date()
    },
    media: {
      images: [
        'https://example.com/vehicle-2-front.jpg',
        'https://example.com/vehicle-2-side.jpg'
      ]
    },
    warranty: {
      manufacturer: {
        hasWarranty: true,
        expiryDate: new Date('2025-06-15'),
        kilometersRemaining: 65000,
        type: 'Basic'
      },
      extended: {
        available: true
      }
    },
    ontario: {
      emissionTest: {
        required: true,
        passed: true
      },
      safetyStandard: {
        passed: true,
        certificationDate: new Date('2024-01-08')
      },
      uvip: {
        required: true,
        obtained: true,
        cost: 20
      }
    },
    internal: {
      acquisitionDate: new Date('2024-01-08'),
      acquisitionCost: 22000,
      daysInInventory: 12
    },
    marketing: {
      featured: false,
      keywords: ['sporty', 'manual', 'compact'],
      description: 'A fun-to-drive 2022 Honda Civic Sport with manual transmission. Perfect for enthusiasts who enjoy the driving experience.',
      slug: 'honda-civic-2022-sku-002'
    },
    createdAt: new Date('2024-01-08').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString()
  }
]

// Mock dropdown data
const mockDropdownData: VehicleDropdowns = {
  makes: [
    { _id: 'make-1', name: 'Toyota', slug: 'toyota' },
    { _id: 'make-2', name: 'Honda', slug: 'honda' },
    { _id: 'make-3', name: 'Ford', slug: 'ford' },
    { _id: 'make-4', name: 'Chevrolet', slug: 'chevrolet' },
    { _id: 'make-5', name: 'Nissan', slug: 'nissan' }
  ],
  models: [
    { _id: 'model-1', name: 'Camry', slug: 'camry' },
    { _id: 'model-2', name: 'Civic', slug: 'civic' },
    { _id: 'model-3', name: 'Accord', slug: 'accord' },
    { _id: 'model-4', name: 'F-150', slug: 'f-150' },
    { _id: 'model-5', name: 'Silverado', slug: 'silverado' }
  ],
  vehicleTypes: [
    { _id: 'type-1', name: 'Sedan', slug: 'sedan' },
    { _id: 'type-2', name: 'Hatchback', slug: 'hatchback' },
    { _id: 'type-3', name: 'SUV', slug: 'suv' },
    { _id: 'type-4', name: 'Truck', slug: 'truck' },
    { _id: 'type-5', name: 'Coupe', slug: 'coupe' }
  ],
  fuelTypes: [
    { _id: 'fuel-1', name: 'Gasoline', slug: 'gasoline' },
    { _id: 'fuel-2', name: 'Diesel', slug: 'diesel' },
    { _id: 'fuel-3', name: 'Hybrid', slug: 'hybrid' },
    { _id: 'fuel-4', name: 'Electric', slug: 'electric' }
  ],
  transmissions: [
    { _id: 'trans-1', name: 'Automatic CVT', slug: 'automatic-cvt' },
    { _id: 'trans-2', name: '6-Speed Manual', slug: '6-speed-manual' },
    { _id: 'trans-3', name: '8-Speed Automatic', slug: '8-speed-automatic' },
    { _id: 'trans-4', name: '10-Speed Automatic', slug: '10-speed-automatic' }
  ],
  driveTypes: [
    { _id: 'drive-1', name: 'Front-Wheel Drive', slug: 'fwd' },
    { _id: 'drive-2', name: 'Rear-Wheel Drive', slug: 'rwd' },
    { _id: 'drive-3', name: 'All-Wheel Drive', slug: 'awd' },
    { _id: 'drive-4', name: 'Four-Wheel Drive', slug: '4wd' }
  ],
  statuses: [
    { _id: 'status-1', name: 'Available', slug: 'available' },
    { _id: 'status-2', name: 'Sold', slug: 'sold' },
    { _id: 'status-3', name: 'Pending', slug: 'pending' },
    { _id: 'status-4', name: 'Reserved', slug: 'reserved' }
  ]
}

/**
 * Mock Vehicle Service - Provides realistic mock data for development
 */
export const mockVehicleService = {
  /**
   * Get all vehicles with pagination and filters
   */
  async getVehicles(params: VehicleSearchParams = {}): Promise<PaginatedResponse<Vehicle>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    let filteredVehicles: Vehicle[] = [...(mockVehicles as Vehicle[])]

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      filteredVehicles = filteredVehicles.filter(vehicle => {
        const make = typeof vehicle.make === 'string' ? vehicle.make : vehicle.make.name
        const model = typeof vehicle.model === 'string' ? vehicle.model : vehicle.model.name
        
        return make.toLowerCase().includes(searchTerm) ||
          model.toLowerCase().includes(searchTerm) ||
          vehicle.year.toString().includes(searchTerm) ||
          (vehicle.vin && vehicle.vin.toLowerCase().includes(searchTerm))
      })
    }

    // Apply make filter
    if (params.make) {
      filteredVehicles = filteredVehicles.filter(vehicle => {
        const make = typeof vehicle.make === 'string' ? vehicle.make : vehicle.make._id
        const makeSlug = typeof vehicle.make === 'string' ? vehicle.make : vehicle.make.slug
        return make === params.make || makeSlug === params.make
      })
    }

    // Apply model filter
    if (params.model) {
      filteredVehicles = filteredVehicles.filter(vehicle => {
        const model = typeof vehicle.model === 'string' ? vehicle.model : vehicle.model._id
        const modelSlug = typeof vehicle.model === 'string' ? vehicle.model : vehicle.model.slug
        return model === params.model || modelSlug === params.model
      })
    }

    // Apply year filters
    if (params.yearFrom) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.year >= params.yearFrom!)
    }
    if (params.yearTo) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.year <= params.yearTo!)
    }

    // Apply price filters
    if (params.priceFrom) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.pricing.listPrice >= params.priceFrom!)
    }
    if (params.priceTo) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.pricing.listPrice <= params.priceTo!)
    }

    // Apply condition filter
    if (params.condition) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.condition === params.condition)
    }

    // Apply status filter
    if (params.status) {
      filteredVehicles = filteredVehicles.filter(vehicle => {
        const status = typeof vehicle.status === 'string' ? vehicle.status : vehicle.status._id
        const statusSlug = typeof vehicle.status === 'string' ? vehicle.status : vehicle.status.slug
        return status === params.status || statusSlug === params.status
      })
    }

    // Apply stock filter
    if (params.inStock !== undefined) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.availability.inStock === params.inStock)
    }

    // Apply sorting
    if (params.sortBy) {
      filteredVehicles.sort((a, b) => {
        let aValue: any, bValue: any
        
        switch (params.sortBy) {
          case 'year':
            aValue = a.year
            bValue = b.year
            break
          case 'price':
            aValue = a.pricing.listPrice
            bValue = b.pricing.listPrice
            break
          case 'make':
            aValue = typeof a.make === 'string' ? a.make : a.make.name
            bValue = typeof b.make === 'string' ? b.make : b.make.name
            break
          case 'model':
            aValue = typeof a.model === 'string' ? a.model : a.model.name
            bValue = typeof b.model === 'string' ? b.model : b.model.name
            break
          case 'odometer':
            aValue = a.odometer.value
            bValue = b.odometer.value
            break
          default:
            aValue = a.createdAt
            bValue = b.createdAt
        }

        if (params.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        }
      })
    }

    // Apply pagination
    const page = params.page || 1
    const limit = params.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)

    return {
      data: paginatedVehicles,
      pagination: {
        page,
        limit,
        total: filteredVehicles.length,
        pages: Math.ceil(filteredVehicles.length / limit),
        hasNext: endIndex < filteredVehicles.length,
        hasPrev: page > 1
      }
    }
  },

  /**
   * Get a single vehicle by ID
   */
  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const vehicle = mockVehicles.find(v => v._id === id)
    
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    return {
      success: true,
      message: 'Vehicle retrieved successfully',
      data: vehicle,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Create a new vehicle
   */
  async createVehicle(data: VehicleFormData): Promise<ApiResponse<Vehicle>> {
    await new Promise(resolve => setTimeout(resolve, 800))

    const newVehicle = {
      _id: `vehicle-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as Vehicle

    // Cast to MockVehicle for internal array storage
    mockVehicles.push(newVehicle as MockVehicle)

    return {
      success: true,
      message: 'Vehicle created successfully',
      data: newVehicle,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Update an existing vehicle
   */
  async updateVehicle(id: string, data: Partial<VehicleFormData>): Promise<ApiResponse<Vehicle>> {
    await new Promise(resolve => setTimeout(resolve, 700))

    const vehicleIndex = mockVehicles.findIndex(v => v._id === id)
    
    if (vehicleIndex === -1) {
      throw new Error('Vehicle not found')
    }

    const existingVehicle = mockVehicles[vehicleIndex]
    const updatedVehicle = {
      ...existingVehicle,
      ...data,
      updatedAt: new Date().toISOString()
    } as Vehicle

    mockVehicles[vehicleIndex] = updatedVehicle as MockVehicle

    return {
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Delete a vehicle
   */
  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const vehicleIndex = mockVehicles.findIndex(v => v._id === id)
    
    if (vehicleIndex === -1) {
      throw new Error('Vehicle not found')
    }

    mockVehicles.splice(vehicleIndex, 1)

    return {
      success: true,
      message: 'Vehicle deleted successfully',
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Get vehicle statistics
   */
  async getVehicleStats(): Promise<ApiResponse<VehicleStats>> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const stats: VehicleStats = {
      total: mockVehicles.length,
      available: mockVehicles.filter(v => v.status.slug === 'available').length,
      sold: mockVehicles.filter(v => v.status.slug === 'sold').length,
      pending: mockVehicles.filter(v => v.status.slug === 'pending').length,
      featured: mockVehicles.filter(v => v.marketing.featured).length,
      inStock: mockVehicles.filter(v => v.availability.inStock).length,
      averagePrice: mockVehicles.reduce((sum, v) => sum + v.pricing.listPrice, 0) / mockVehicles.length,
      priceRange: {
        min: Math.min(...mockVehicles.map(v => v.pricing.listPrice)),
        max: Math.max(...mockVehicles.map(v => v.pricing.listPrice))
      },
      yearRange: {
        min: Math.min(...mockVehicles.map(v => v.year)),
        max: Math.max(...mockVehicles.map(v => v.year))
      },
      conditionBreakdown: {
        new: mockVehicles.filter(v => v.condition === 'new').length,
        used: mockVehicles.filter(v => v.condition === 'used').length,
        'certified-pre-owned': mockVehicles.filter(v => v.condition === 'certified-pre-owned').length
      },
      topMakes: mockDropdownData.makes.slice(0, 5).map(make => ({
        make: make.name,
        count: mockVehicles.filter(v => v.make._id === make._id).length
      }))
    }

    return {
      success: true,
      message: 'Vehicle statistics retrieved successfully',
      data: stats,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Search vehicles with advanced filters
   */
  async searchVehicles(filters: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
    // Convert VehicleFilters to VehicleSearchParams and reuse getVehicles logic
    const searchParams: VehicleSearchParams = {
      page: filters.page,
      limit: filters.limit,
      search: filters.search || filters.q,
      make: filters.make,
      model: filters.model,
      yearFrom: filters.minYear,
      yearTo: filters.maxYear,
      priceFrom: filters.minPrice,
      priceTo: filters.maxPrice,
      condition: filters.condition,
      status: filters.status,
      inStock: filters.inStock,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }

    return this.getVehicles(searchParams)
  },

  /**
   * Get dropdown data for forms
   */
  async getDropdownData(): Promise<ApiResponse<VehicleDropdowns>> {
    await new Promise(resolve => setTimeout(resolve, 200))

    return {
      success: true,
      message: 'Dropdown data retrieved successfully',
      data: mockDropdownData,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Get models for a specific make
   */
  async getModelsByMake(makeId: string): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    await new Promise(resolve => setTimeout(resolve, 300))

    // In a real implementation, this would filter models by make
    // For mock data, we'll return a subset of models
    const models = [
      { id: 'model-1', name: 'Camry' },
      { id: 'model-2', name: 'Corolla' },
      { id: 'model-3', name: 'RAV4' },
      { id: 'model-4', name: 'Prius' }
    ]

    return {
      success: true,
      message: 'Models retrieved successfully',
      data: models,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Upload vehicle images (mock implementation)
   */
  async uploadImages(vehicleId: string, files: File[]): Promise<ApiResponse<string[]>> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate mock URLs for uploaded files
    const imageUrls = files.map((file, index) => 
      `https://example.com/vehicles/${vehicleId}/image-${Date.now()}-${index}.jpg`
    )

    return {
      success: true,
      message: 'Images uploaded successfully',
      data: imageUrls,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Delete vehicle image (mock implementation)
   */
  async deleteImage(vehicleId: string, imageUrl: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      message: 'Image deleted successfully',
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Perform bulk operations on vehicles (mock implementation)
   */
  async bulkOperation(operation: VehicleBulkOperation): Promise<ApiResponse<{ processed: number; failed: number }>> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      success: true,
      message: 'Bulk operation completed successfully',
      data: {
        processed: operation.vehicleIds.length,
        failed: 0
      },
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Duplicate a vehicle (mock implementation)
   */
  async duplicateVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const originalVehicle = mockVehicles.find(v => v._id === id)
    
    if (!originalVehicle) {
      throw new Error('Vehicle not found')
    }

    const duplicatedVehicle = {
      ...originalVehicle,
      _id: `vehicle-${Date.now()}`,
      internal: {
        ...originalVehicle.internal
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as Vehicle

    mockVehicles.push(duplicatedVehicle as MockVehicle)

    return {
      success: true,
      message: 'Vehicle duplicated successfully',
      data: duplicatedVehicle,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Get vehicle valuation (mock implementation)
   */
  async getValuation(vin: string): Promise<ApiResponse<{ 
    estimatedValue: number; 
    marketRange: { min: number; max: number }; 
    source: string;
    lastUpdated: string;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 800))

    return {
      success: true,
      message: 'Vehicle valuation retrieved successfully',
      data: {
        estimatedValue: 25000,
        marketRange: {
          min: 22000,
          max: 28000
        },
        source: 'Canadian Black Book',
        lastUpdated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Generate vehicle report (mock implementation)
   */
  async generateReport(vehicleId: string, format: 'pdf' | 'excel'): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create a mock blob
    const content = `Vehicle Report for ${vehicleId} in ${format} format`
    return new Blob([content], { 
      type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
  },

  /**
   * Get vehicle history (mock implementation)
   */
  async getVehicleHistory(vehicleId: string): Promise<ApiResponse<Array<{
    id: string;
    action: string;
    changes: Record<string, any>;
    user: string;
    timestamp: string;
  }>>> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const history = [
      {
        id: '1',
        action: 'created',
        changes: { vehicle: 'created' },
        user: 'Admin User',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        action: 'price_updated',
        changes: { 
          pricing: { 
            listPrice: { from: 29000, to: 28500 } 
          } 
        },
        user: 'Sales Manager',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        action: 'featured',
        changes: { 
          marketing: { 
            featured: { from: false, to: true } 
          } 
        },
        user: 'Marketing Team',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return {
      success: true,
      message: 'Vehicle history retrieved successfully',
      data: history,
      timestamp: new Date().toISOString()
    }
  }
}

export default mockVehicleService
