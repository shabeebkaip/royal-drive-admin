import type { Route } from "./+types/vehicles.sold"
import { useEffect, useState } from "react"
import { VehicleInventory } from "~/components/vehicles/inventory"
import { statusesApiService } from "~/services/statusesService"

export default function SoldVehiclesPage(_props: Route.ComponentProps) {
  const [soldStatusId, setSoldStatusId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the "sold" status ID from the API
    async function fetchSoldStatus() {
      try {
        const response = await statusesApiService.getAllWithFilters({ limit: 100 })
        if (response.success && response.data) {
          // Find the sold status (by slug or name)
          const soldStatus = response.data.statuses.find(
            (status: any) => status.slug === 'sold' || status.name.toLowerCase() === 'sold'
          )
          if (soldStatus) {
            setSoldStatusId(soldStatus._id)
          }
        }
      } catch (error) {
        console.error('Error fetching sold status:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSoldStatus()
  }, [])

  // Show loading state or the inventory with sold filter
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sold vehicles...</p>
        </div>
      </div>
    )
  }

  // Pass the sold status ID as a filter
  return (
    <VehicleInventory 
      defaultFilters={{ 
        status: soldStatusId,
        inStock: undefined // Remove the default inStock filter for sold vehicles
      }}
      hideFilters={true} // Hide search and filters for sold vehicles page
      hideAddButton={true} // Hide add vehicle button for sold vehicles page
    />
  )
}
