import { useState, useEffect } from 'react'
import { vehicleInventoryService, type VehicleInventoryItem } from '~/services/vehicleInventoryService'
import { toast } from 'sonner'

interface VehicleOption {
  id: string
  label: string
  value: string
  data: VehicleInventoryItem // Full vehicle data for reference
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<VehicleOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('Loading vehicles for dropdown...')
      
      const response = await vehicleInventoryService.getVehicles({ 
        limit: 200, // Get more vehicles for dropdown
        page: 1
      })
      console.log('Vehicle API response:', response)
      
      if (!response?.success || !response.data?.vehicles) {
        throw new Error('Invalid API response format')
      }
      
      const vehicleData = response.data.vehicles
      
      if (vehicleData.length === 0) {
        console.warn('No vehicles found in API response')
        setVehicles([])
        setError('No vehicles found')
        return
      }
      
      // Filter to show ONLY sold vehicles for sales records
      const soldVehicles = vehicleData.filter(vehicle => {
        const statusSlug = vehicle.status?.slug
        // Only show vehicles with 'sold' status and valid ID
        return vehicle._id && 
               vehicle._id.trim() !== '' &&
               statusSlug === 'sold'
      })
      
      console.log(`Filtered ${soldVehicles.length} sold vehicles out of ${vehicleData.length} total`)
      
      if (soldVehicles.length === 0) {
        console.warn('No sold vehicles found')
        setVehicles([])
        setError('No sold vehicles found')
        toast.info('No sold vehicles available')
        return
      }
      
      const options = soldVehicles
        .filter(vehicle => vehicle._id && vehicle._id.trim() !== '') // Double check for valid IDs
        .map((vehicle) => ({
          id: vehicle._id,
          value: vehicle._id,
          label: `${vehicle.year || 'Unknown'} ${vehicle.make?.name || 'Unknown'} ${vehicle.model?.name || 'Unknown'}${vehicle.trim ? ` ${vehicle.trim}` : ''} - ${vehicle.vin || vehicle._id}`.trim(),
          data: vehicle // Include full vehicle data
        }))
      
      // Final validation to ensure no empty values
      const validOptions = options.filter(option => option.value && option.value.trim() !== '')
      
      console.log('Valid vehicle options:', validOptions)
      setVehicles(validOptions)
      console.log(`Successfully loaded ${validOptions.length} sold vehicles`)
      
      // Show success message with count
      toast.success(`${validOptions.length} sold vehicles loaded`)
    } catch (error: any) {
      console.error('Failed to load vehicles:', error)
      const errorMessage = error?.message || 'Failed to load vehicles'
      setError(errorMessage)
      setVehicles([])
      toast.error('Failed to load vehicles', {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    vehicles,
    isLoading,
    error,
    reload: loadVehicles
  }
}
