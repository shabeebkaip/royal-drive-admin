import type { Route } from "./+types/vehicles.$id"
import { useNavigate, useParams } from "react-router"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import { PageTitle } from "~/components/shared/page-title"
import { VehicleForm } from "~/components/vehicles/addEdit/vehicle-form"
import type { VehicleFormData } from "~/components/vehicles/addEdit/schema"
import { useVehicleOperations } from "~/hooks/useVehicleOperations"

export default function VehiclesEdit(_props: Route.ComponentProps) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [vehicle, setVehicle] = useState<any>(null)
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { updateVehiclePartial, getVehicleById, loading } = useVehicleOperations()
  
  // Store original form data for comparison
  const originalFormDataRef = useRef<Partial<VehicleFormData> | null>(null)

  // Fetch vehicle data from API
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setError("Vehicle ID not provided")
        setIsLoadingVehicle(false)
        return
      }

      try {
        setIsLoadingVehicle(true)
        const response = await getVehicleById(id)
        const vehicleData = response.data
        
        // Check if vehicle is sold - redirect if it is
        if (vehicleData?.status?.slug === 'sold') {
          toast.error("Cannot edit sold vehicle", {
            description: "This vehicle has been sold and cannot be edited."
          })
          navigate(`/vehicles/${id}`)
          return
        }
        
        setVehicle(vehicleData)
      } catch (error) {
        console.error("Error fetching vehicle:", error)
        setError("Failed to load vehicle data")
        toast.error("Failed to load vehicle", {
          description: "Could not load vehicle data. Please try again."
        })
      } finally {
        setIsLoadingVehicle(false)
      }
    }

    fetchVehicle()
  }, [id, navigate]) // Remove getVehicleById from dependencies to avoid infinite loop

  const handleSubmit = async (data: VehicleFormData) => {
    if (!id) {
      toast.error("Vehicle ID not found")
      return
    }

    if (!originalFormDataRef.current) {
      toast.error("Original data not available")
      return
    }

    try {
      // Use partial update - only sends changed fields
      const result = await updateVehiclePartial(id, data, originalFormDataRef.current)
      
      if (result.success) {
        toast.success("Vehicle updated successfully", {
          description: `Vehicle details have been updated successfully.`
        })
        
        // Navigate back to vehicles list on success
        navigate("/vehicles")
      }
    } catch (error) {
      console.error("Error updating vehicle:", error)
      
      let errorMessage = "An error occurred while updating the vehicle. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error("Failed to update vehicle", {
        description: errorMessage
      })
    }
  }

  if (isLoadingVehicle) {
    return (
      <div className="flex flex-col gap-6">
        <PageTitle
          title="Loading Vehicle..."
          description="Please wait while we load the vehicle details."
        />
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col gap-6">
        <PageTitle
          title="Vehicle Not Found"
          description={error || "The vehicle you're looking for doesn't exist."}
        />
      </div>
    )
  }

  // Convert API response to VehicleFormData format
  const vehicleFormData: Partial<VehicleFormData> = {
    vin: vehicle.vin || "",
    make: vehicle.make?._id || vehicle.make,
    model: vehicle.model?._id || vehicle.model,
    year: vehicle.year,
    trim: vehicle.trim || "",
    type: vehicle.type?._id || vehicle.type, // Changed from bodyType to type
    
    // Engine
    engineSize: vehicle.engine?.size,
    cylinders: vehicle.engine?.cylinders,
    fuelType: vehicle.engine?.fuelType?._id || vehicle.engine?.fuelType,
    horsepower: vehicle.engine?.horsepower,
    torque: vehicle.engine?.torque,
    
    // Transmission
    transmissionType: vehicle.transmission?.type?._id || vehicle.transmission?.type,
    transmissionSpeeds: vehicle.transmission?.speeds,
    drivetrain: vehicle.drivetrain?._id || vehicle.drivetrain,
    
    // Odometer
    odometerValue: vehicle.odometer?.value,
    odometerUnit: vehicle.odometer?.unit || "km",
    odometerIsAccurate: vehicle.odometer?.isAccurate !== false,
    
    // Condition
    condition: vehicle.condition,
    accidentHistory: vehicle.accidentHistory || false,
    numberOfPreviousOwners: vehicle.numberOfPreviousOwners || 0,
    
    // Pricing
    listPrice: vehicle.pricing?.listPrice,
    
    // Specifications
    exteriorColor: vehicle.specifications?.exteriorColor,
    interiorColor: vehicle.specifications?.interiorColor,
    doors: vehicle.specifications?.doors,
    seatingCapacity: vehicle.specifications?.seatingCapacity,
    
    // Status
    status: vehicle.status?._id || vehicle.status,
    inStock: vehicle.availability?.inStock !== false,
    
    // Internal
    acquisitionDate: vehicle.internal?.acquisitionDate 
      ? new Date(vehicle.internal.acquisitionDate).toISOString().split('T')[0] 
      : "",
    acquisitionCost: vehicle.internal?.acquisitionCost,
    assignedSalesperson: vehicle.internal?.assignedSalesperson || "",
    notes: vehicle.internal?.notes || "",
    
    // Marketing
    description: vehicle.marketing?.description || "",
    featured: vehicle.marketing?.featured || false,
    specialOffer: vehicle.marketing?.specialOffer || "",
    
    // CarFax
    hasCleanHistory: vehicle.carfax?.hasCleanHistory !== false,
    carfaxReportUrl: vehicle.carfax?.reportUrl || "",
    
    // Ontario
    safetyStandardPassed: vehicle.ontario?.safetyStandard?.passed || false,
    emissionTestPassed: vehicle.ontario?.emissionTest?.passed,
    
    // Images
    images: vehicle.media?.images || [],
  }

  // Store original form data on first load
  if (!originalFormDataRef.current) {
    originalFormDataRef.current = vehicleFormData
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={`Edit ${vehicle.make?.name || vehicle.make} ${vehicle.model?.name || vehicle.model}`}
        description="Update the vehicle details in your inventory."
      />
      <div className="px-4 lg:px-6">
        <VehicleForm 
          mode="edit"
          initialData={vehicleFormData}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  )
}
