import type { Route } from "./+types/vehicles"
import { useEffect, useState } from "react"
import { VehicleInventory } from "~/components/vehicles/inventory"
import { statusesApiService } from "~/services/statusesService"

export default function VehiclesIndex(_props: Route.ComponentProps) {
  const [soldStatusId, setSoldStatusId] = useState<string | undefined>(undefined)
  const [excludeStatuses, setExcludeStatuses] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the "sold" status ID from the API to exclude it
    async function fetchStatuses() {
      try {
        const response = await statusesApiService.getAllWithFilters({ limit: 100 })
        if (response.success && response.data) {
          // Find the sold status (by slug or name)
          const soldStatus = response.data.statuses.find(
            (status: any) => status.slug === 'sold' || status.name.toLowerCase() === 'sold'
          )
          if (soldStatus) {
            setSoldStatusId(soldStatus._id)
            // We'll use a client-side filter approach instead of trying to pass exclude to API
          }
        }
      } catch (error) {
        console.error('Error fetching statuses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStatuses()
  }, [])

  // Show loading state briefly
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  return <VehicleInventory excludeSoldStatus={soldStatusId} />
}
