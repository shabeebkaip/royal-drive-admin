import type { Route } from "./+types/vehicles.$id"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { PageTitle } from "~/components/shared/page-title"
import { VehicleForm } from "~/components/vehicles/addEdit/vehicle-form"
import type { VehicleFormData } from "~/components/vehicles/addEdit/schema"
import { vehiclesMock } from "~/components/vehicles/list/mock-data"
import type { VehicleRow } from "~/types/vehicle"

export default function VehiclesEdit(_props: Route.ComponentProps) {
  const navigate = useNavigate()
  const { id } = useParams()

  // Find the vehicle to edit from mock data
  const vehicle = vehiclesMock.find((v: VehicleRow) => v.id === id)

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      // TODO: Implement API call to update vehicle
      console.log("Updating vehicle:", { id, data })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Vehicle updated successfully", {
        description: "The vehicle details have been updated."
      })
      
      // Navigate back to vehicles list on success
      navigate("/vehicles")
    } catch (error) {
      console.error("Error updating vehicle:", error)
      toast.error("Failed to update vehicle", {
        description: "An error occurred while updating the vehicle. Please try again."
      })
    }
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col gap-6">
        <PageTitle
          title="Vehicle Not Found"
          description="The vehicle you're looking for doesn't exist."
        />
      </div>
    )
  }

  // Convert VehicleRow to VehicleFormData format
  const vehicleFormData: Partial<VehicleFormData> = {
    status: vehicle.status as "available" | "sold" | "pending" | "reserved" | "on-hold",
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    bodyType: vehicle.bodyType as "sedan" | "suv" | "coupe" | "hatchback" | "truck" | "van" | "convertible" | "wagon" | "crossover" | "other",
    trim: vehicle.trim || "",
    odometerValue: vehicle.odometer,
    listPrice: vehicle.price,
    fuelType: vehicle.fuelType as "gasoline" | "diesel" | "hybrid" | "electric" | "plug-in-hybrid",
    drivetrain: vehicle.drivetrain as "fwd" | "rwd" | "awd" | "4wd",
    // Most other fields will use default values since VehicleRow is a simplified version
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={`Edit ${vehicle.make} ${vehicle.model}`}
        description="Update the vehicle details in your inventory."
      />
      <div className="px-4 lg:px-6">
        <VehicleForm 
          mode="edit"
          initialData={vehicleFormData}
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </div>
  )
}
