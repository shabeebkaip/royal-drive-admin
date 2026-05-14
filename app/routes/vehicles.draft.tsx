import type { Route } from "./+types/vehicles.draft"
import { useEffect, useState } from "react"
import { VehicleInventory } from "~/components/vehicles/inventory"
import { statusesApiService } from "~/services/statusesService"

export default function DraftVehiclesPage(_props: Route.ComponentProps) {
  const [draftStatusId, setDraftStatusId] = useState<string | null>(null)

  useEffect(() => {
    statusesApiService.getAllWithFilters({ limit: 100 }).then(response => {
      if (response.success && response.data) {
        const draftStatus = response.data.statuses.find(
          (s: any) => s.slug === 'draft' || s.name?.toLowerCase() === 'draft'
        )
        if (draftStatus) setDraftStatusId(draftStatus._id)
      }
    }).catch(console.error)
  }, [])

  if (!draftStatusId) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <VehicleInventory
      key={draftStatusId}
      defaultFilters={{ status: draftStatusId, inStock: undefined }}
      customTitle="Draft Vehicles"
      hideAddButton={true}
      hideActionButtons={true}
    />
  )
}
