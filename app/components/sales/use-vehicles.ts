import { useState, useEffect } from 'react'
import { vehicleInventoryService } from '~/services/vehicleInventoryService'
import { toast } from 'sonner'

interface VehicleOption {
  id: string
  label: string
  value: string
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
      
      // Filter out sold vehicles and vehicles that are not available
      const availableVehicles = vehicleData.filter(vehicle => {
        const statusSlug = vehicle.status?.slug
        // Also ensure the vehicle has a valid ID
        return vehicle._id && 
               vehicle._id.trim() !== '' &&
               statusSlug !== 'sold' && 
               statusSlug !== 'pending' && 
               statusSlug === 'available'
      })
      
      console.log(`Filtered ${availableVehicles.length} available vehicles out of ${vehicleData.length} total`)
      
      if (availableVehicles.length === 0) {
        console.warn('No available vehicles found for sale')
        setVehicles([])
        setError('No available vehicles for sale')
        toast.info('No vehicles available for sale')
        return
      }
      
      const options = availableVehicles
        .filter(vehicle => vehicle._id && vehicle._id.trim() !== '') // Double check for valid IDs
        .map((vehicle) => ({
        id: vehicle._id,
        value: vehicle._id,
        label: `${vehicle.year || 'Unknown'} ${vehicle.make?.name || 'Unknown'} ${vehicle.model?.name || 'Unknown'}${vehicle.trim ? ` ${vehicle.trim}` : ''} - ${vehicle.vin || vehicle._id}`.trim()
      }))
      
      // Final validation to ensure no empty values
      const validOptions = options.filter(option => option.value && option.value.trim() !== '')
      
      console.log('Valid vehicle options:', validOptions)
      setVehicles(validOptions)
      console.log(`Successfully loaded ${validOptions.length} available vehicles for sale`)
      
      // Show success message with count
      toast.success(`${validOptions.length} vehicles available for sale`)
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
