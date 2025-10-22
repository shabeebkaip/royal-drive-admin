import { ApiService } from '~/lib/api'
// All data should come from real APIs; no mock fallbacks. Mock imports removed.

// Types for filter options
export interface Make {
  id: string
  _id: string
  name: string
  slug: string
  active: boolean
  createdAt: string
  updatedAt?: string
}

export interface VehicleType {
  id: string
  _id: string
  name: string
  slug: string
  active: boolean
  createdAt: string
  updatedAt?: string
}

export interface FuelType {
  id: string
  _id: string
  name: string
  slug: string
  active: boolean
  createdAt: string
  updatedAt?: string
}

export interface Transmission {
  id: string
  _id: string
  name: string
  slug: string
  type: 'manual' | 'automatic' | 'cvt' | 'semi-automatic'
  active: boolean
  createdAt: string
  updatedAt?: string
}

export interface Drivetrain {
  id: string
  _id: string
  name: string
  slug: string
  type: 'fwd' | 'rwd' | 'awd' | '4wd'
  active: boolean
  createdAt: string
  updatedAt?: string
}

export interface VehicleStatus {
  id: string
  _id: string
  name: string
  slug: string
  color: string
  description?: string
  active: boolean
  createdAt: string
  updatedAt?: string
}

export interface Model {
  id: string
  _id: string
  name: string
  slug: string
  make: {
    _id: string
    name: string
  }
  active: boolean
  createdAt: string
  updatedAt?: string
}

// Service classes
class MakeService extends ApiService<Make, Partial<Make>> {
  constructor() {
    super('makes')
  }

  async getActiveMakes(): Promise<Make[]> {
    try {
      const response = await this.getAll({ active: true, limit: 100, sortBy: 'name', sortOrder: 'asc' })
      return response.data
    } catch (error) {
  console.error('Error fetching makes:', error)
  return []
    }
  }
}

class VehicleTypeService extends ApiService<VehicleType, Partial<VehicleType>> {
  constructor() {
    super('vehicle-types')
  }

  async getActiveTypes(): Promise<VehicleType[]> {
    try {
      const response = await this.getAll({ active: true, limit: 100, sortBy: 'name', sortOrder: 'asc' })
      return response.data
    } catch (error) {
  console.error('Error fetching vehicle types:', error)
  return []
    }
  }
}

class FuelTypeService extends ApiService<FuelType, Partial<FuelType>> {
  constructor() {
    super('fuel-types')
  }

  async getActiveFuelTypes(): Promise<FuelType[]> {
    try {
      const response = await this.getAll({ active: true, limit: 100, sortBy: 'name', sortOrder: 'asc' })
      return response.data
    } catch (error) {
  console.error('Error fetching fuel types:', error)
  return []
    }
  }
}

class TransmissionService extends ApiService<Transmission, Partial<Transmission>> {
  constructor() {
    super('transmissions')
  }

  async getActiveTransmissions(): Promise<Transmission[]> {
    try {
      const response = await this.getAll({ active: true, limit: 100, sortBy: 'name', sortOrder: 'asc' })
      return response.data
    } catch (error) {
  console.error('Error fetching transmissions:', error)
  return []
    }
  }
}

class DrivetrainService extends ApiService<Drivetrain, Partial<Drivetrain>> {
  constructor() {
    super('drive-types')
  }

  async getActiveDrivetrains(): Promise<Drivetrain[]> {
    try {
      const response = await this.getAll({ active: true, limit: 100, sortBy: 'name', sortOrder: 'asc' })
      return response.data
    } catch (error) {
  console.error('Error fetching drive types:', error)
  return []
    }
  }
}

class VehicleStatusService extends ApiService<VehicleStatus, Partial<VehicleStatus>> {
  constructor() {
    super('statuses')
  }

  async getActiveStatuses(): Promise<VehicleStatus[]> {
    try {
      const response = await this.getAll({ active: true, limit: 100, sortBy: 'name', sortOrder: 'asc' })
      return response.data
    } catch (error) {
  console.error('Error fetching vehicle statuses:', error)
  return []
    }
  }
}

class ModelService extends ApiService<Model, Partial<Model>> {
  constructor() {
    super('models')
  }

  async getModelsByMake(makeId: string): Promise<Model[]> {
    try {
      // Build query params manually for make filter
      const queryString = new URLSearchParams({
        make: makeId,
        active: 'true',
        limit: '200',
        sortBy: 'name',
        sortOrder: 'asc'
      }).toString()
      
      const baseUrl = import.meta.env?.VITE_API_BASE_URL
      if (!baseUrl) {
        throw new Error('VITE_API_BASE_URL is not configured in environment variables')
      }
      const response = await fetch(`${baseUrl}/models?${queryString}`)
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  }

  async getActiveModels(): Promise<Model[]> {
    try {
      const response = await this.getAll({ active: true, limit: 200, sortBy: 'name', sortOrder: 'asc' })
      return response.data
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  }
}

// Service instances
export const makeService = new MakeService()
export const modelService = new ModelService()
export const vehicleTypeService = new VehicleTypeService()
export const fuelTypeService = new FuelTypeService()
export const transmissionService = new TransmissionService()
export const drivetrainService = new DrivetrainService()
export const vehicleStatusService = new VehicleStatusService()

// Combined service for fetching all filter options
export class FilterOptionsService {
  async getAllFilterOptions() {
    try {
      const [makes, vehicleTypes, fuelTypes, transmissions, drivetrains, statuses] = await Promise.all([
        makeService.getActiveMakes(),
        vehicleTypeService.getActiveTypes(),
        fuelTypeService.getActiveFuelTypes(),
        transmissionService.getActiveTransmissions(),
        drivetrainService.getActiveDrivetrains(),
        vehicleStatusService.getActiveStatuses(),
      ])

      return {
        makes,
        vehicleTypes,
        fuelTypes,
        transmissions,
        drivetrains,
        statuses,
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
      return {
        makes: [],
        vehicleTypes: [],
        fuelTypes: [],
        transmissions: [],
        drivetrains: [],
        statuses: [],
      }
    }
  }
}

export const filterOptionsService = new FilterOptionsService()
