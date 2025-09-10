import type { Route } from "./+types/vehicles.add"
import { useNavigate } from "react-router"
import { PageTitle } from "~/components/shared/page-title"
import { VehicleForm } from "~/components/vehicles/addEdit/vehicle-form"
import type { VehicleFormData } from "~/components/vehicles/addEdit/schema"

export default function VehiclesAdd(_props: Route.ComponentProps) {
  const navigate = useNavigate()

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      // TODO: Implement API call to save vehicle
      console.log("Saving vehicle:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate back to vehicles list on success
      navigate("/vehicles")
    } catch (error) {
      console.error("Error saving vehicle:", error)
      // TODO: Show error toast/notification
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
          isLoading={false}
        />
      </div>
    </div>
  )
}
