import { useState, useEffect } from 'react'
import { filterOptionsService, type Make, type VehicleType, type FuelType, type Transmission, type Drivetrain, type VehicleStatus } from '~/services/filterOptionsService'

export interface FilterOptions {
  makes: Make[]
  vehicleTypes: VehicleType[]
  fuelTypes: FuelType[]
  transmissions: Transmission[]
  drivetrains: Drivetrain[]
  statuses: VehicleStatus[]
}

export interface UseFilterOptionsResult {
  filterOptions: FilterOptions
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFilterOptions(): UseFilterOptionsResult {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    makes: [],
    vehicleTypes: [],
    fuelTypes: [],
    transmissions: [],
    drivetrains: [],
    statuses: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFilterOptions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const options = await filterOptionsService.getAllFilterOptions()
      setFilterOptions(options)
    } catch (err) {
      console.error('Failed to fetch filter options:', err)
      setError(err instanceof Error ? err.message : 'Failed to load filter options')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  return {
    filterOptions,
    loading,
    error,
    refetch: fetchFilterOptions,
  }
}
