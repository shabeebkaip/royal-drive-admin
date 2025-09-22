import type { Route } from "./+types/vehicles.add"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { PageTitle } from "~/components/shared/page-title"
import { VehicleForm } from "~/components/vehicles/addEdit/vehicle-form"
import type { VehicleFormData } from "~/components/vehicles/addEdit/schema"
import { useVehicleOperations } from "~/hooks/useVehicleOperations"

export default function VehiclesAdd(_props: Route.ComponentProps) {
  const navigate = useNavigate()
  const { createVehicle, loading } = useVehicleOperations()

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      const result = await createVehicle(data)
      
      toast.success("Vehicle added successfully", {
        description: `The new vehicle has been added to your inventory with ID: ${result.data?._id || 'Unknown'}`
      })
      
      // Navigate back to vehicles list on success
      navigate("/vehicles")
    } catch (error) {
      console.error("Error saving vehicle:", error)
      
      let errorMessage = "An error occurred while saving the vehicle. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error("Failed to add vehicle", {
        description: errorMessage
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Add New Vehicle"
        description="Enter all the details for the new vehicle in your inventory."
      />
      <div className="px-4 lg:px-6">
        <VehicleForm 
          mode="add"
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  )
}
