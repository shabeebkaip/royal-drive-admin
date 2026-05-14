import type { Route } from "./+types/vehicles"
import { VehicleInventory } from "~/components/vehicles/inventory"

export default function VehiclesIndex(_props: Route.ComponentProps) {
  // Backend now handles sold/draft exclusion via excludeStatus=sold,draft
  // so no need to fetch status IDs or do client-side filtering
  return <VehicleInventory />
}
