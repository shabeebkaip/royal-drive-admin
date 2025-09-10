import type { Route } from "./+types/vehicles"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { PageTitle } from "~/components/shared/page-title"
import { DataTableGeneric } from "~/components/shared/data-table"
import { vehicleColumns } from "~/components/vehicles/list/columns"
import { vehiclesMock } from "~/components/vehicles/list/mock-data"

export default function VehiclesIndex(_props: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Vehicles"
        description="Manage your inventory. Add, edit, and track vehicles."
        actions={
          <Button size="sm" asChild>
            <Link to="/vehicles/add">Add Vehicle</Link>
          </Button>
        }
      />
      <div className="px-4 lg:px-6">
        <DataTableGeneric columns={vehicleColumns} data={vehiclesMock} pageSize={10} />
      </div>
    </div>
  )
}
