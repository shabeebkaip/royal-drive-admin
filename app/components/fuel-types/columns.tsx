import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { FuelType } from "~/types/fuel-type"
import type { CrudActions, BaseEntity } from "~/components/crud"

interface ExtendedCrudActions<T extends BaseEntity> extends CrudActions<T> {
  onStatusToggle?: (item: T, newStatus: boolean) => Promise<void>
}

export function createFuelTypeColumns(actions: ExtendedCrudActions<FuelType>): ColumnDef<FuelType>[] {
  return [
    {
      accessorKey: "name",
      header: "Fuel Type Name",
      cell: ({ row }) => {
        const fuelType = row.original
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{fuelType.name}</span>
            {!fuelType.active && (
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            )}
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
        const count = row.getValue("vehicleCount") as number || 0
        return (
          <div className="text-left">
            <span className="font-medium">{count}</span>
            <span className="text-xs text-gray-500 ml-1">
              {count === 1 ? 'vehicle' : 'vehicles'}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const fuelType = row.original
        const canDelete = (fuelType.vehicleCount || 0) === 0

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => actions.onEdit(fuelType)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              {actions.onStatusToggle && (
                <DropdownMenuItem
                  onClick={() => actions.onStatusToggle!(fuelType, !fuelType.active)}
                  className="cursor-pointer"
                >
                  {fuelType.active ? (
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
              )}

              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => actions.onDelete(fuelType)}
                disabled={!canDelete}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              
              {!canDelete && (
                <div className="px-2 py-1 text-xs text-gray-500">
                  Cannot delete: {fuelType.vehicleCount} vehicle{fuelType.vehicleCount !== 1 ? "s" : ""} using this fuel type
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
