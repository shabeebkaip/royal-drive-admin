import { useState } from 'react'
import { vehicleApiService, transformFormDataToApiFormat } from '~/services/vehicleApiService'
import type { VehicleFormData } from '~/components/vehicles/addEdit/schema'
import { getChangedFields } from '~/lib/sanitize-payload'

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

  const updateVehiclePartial = async (id: string, updatedData: VehicleFormData, originalFormData: Partial<VehicleFormData>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Transform both to API format for proper comparison
      const originalApiData = transformFormDataToApiFormat(originalFormData as VehicleFormData)
      const updatedApiData = transformFormDataToApiFormat(updatedData)
      
      // Get only the changed fields
      const changes = getChangedFields(originalApiData, updatedApiData)
      
      // If nothing changed, don't make API call
      if (Object.keys(changes).length === 0) {
        setLoading(false)
        return { success: true, message: 'No changes detected', data: null }
      }

      console.log('Changed fields:', changes)
      
      // Use patch endpoint for partial update
      const result = await vehicleApiService.patchVehicle(id, changes)
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
    updateVehiclePartial,
    getVehicleById,
    deleteVehicle,
    loading,
    error,
    clearError: () => setError(null)
  }
}
