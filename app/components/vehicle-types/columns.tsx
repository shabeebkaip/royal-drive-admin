import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { VehicleType } from "~/types/vehicle-type"
import type { CrudActions, BaseEntity } from "~/components/crud"

interface ExtendedCrudActions<T extends BaseEntity> extends CrudActions<T> {
  onStatusToggle?: (item: T, newStatus: boolean) => Promise<void>
}

export function createVehicleTypeColumns(actions: ExtendedCrudActions<VehicleType>): ColumnDef<VehicleType>[] {
  return [
    {
      accessorKey: "name",
      header: "Vehicle Type Name",
      cell: ({ row }) => {
        const vehicleType = row.original
        return (
          <div className="flex items-center gap-3">
            {vehicleType.icon && (
              <img
                src={vehicleType.icon}
                alt={`${vehicleType.name} icon`}
                className="h-8 w-8 object-contain bg-white p-1 rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            )}
            <span className="font-medium">{vehicleType.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("active") as boolean
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "vehicleCount",
      header: "Vehicles",
      cell: ({ row }) => {
        const count = row.getValue("vehicleCount") as number | undefined
        return (
          <span className="text-sm text-gray-600">
            {count || 0} vehicle{count !== 1 ? "s" : ""}
          </span>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as string
        return (
          <span className="text-sm text-gray-600">
            {new Date(date).toLocaleDateString()}
          </span>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const vehicleType = row.original
        const canDelete = (vehicleType.vehicleCount || 0) === 0

        const handleStatusToggle = async () => {
          if (actions.onStatusToggle) {
            await actions.onStatusToggle(vehicleType, !vehicleType.active)
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                aria-label="Open actions menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => actions.onEdit(vehicleType)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStatusToggle}>
                {vehicleType.active ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => actions.onDelete(vehicleType)}
                disabled={!canDelete}
                className={!canDelete ? "opacity-50 cursor-not-allowed" : "text-red-600"}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              {!canDelete && (
                <div className="px-2 py-1 text-xs text-gray-500">
                  Cannot delete: has {vehicleType.vehicleCount} vehicle{vehicleType.vehicleCount !== 1 ? "s" : ""}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
