import type { Route } from "./+types/vehicles"
import { VehicleInventory } from "~/components/vehicles/inventory"

export default function VehiclesIndex(_props: Route.ComponentProps) {
  return <VehicleInventory />
}
