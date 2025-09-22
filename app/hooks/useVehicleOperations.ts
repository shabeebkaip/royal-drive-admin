import { useState } from 'react'
import { vehicleApiService } from '~/services/vehicleApiService'
import type { VehicleFormData } from '~/components/vehicles/addEdit/schema'

export function useVehicleOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createVehicle = async (data: VehicleFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await vehicleApiService.createVehicle(data)
      setLoading(false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setLoading(false)
      throw err
    }
  }

  const updateVehicle = async (id: string, data: VehicleFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await vehicleApiService.updateVehicle(id, data)
      setLoading(false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setLoading(false)
      throw err
    }
  }

  const getVehicleById = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await vehicleApiService.getVehicleById(id)
      setLoading(false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setLoading(false)
      throw err
    }
  }

  const deleteVehicle = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await vehicleApiService.deleteVehicle(id)
      setLoading(false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setLoading(false)
      throw err
    }
  }

  return {
    createVehicle,
    updateVehicle,
    getVehicleById,
    deleteVehicle,
    loading,
    error,
    clearError: () => setError(null)
  }
}
