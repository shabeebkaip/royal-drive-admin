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
import type { Transmission } from "~/types/transmission"
import type { CrudActions, BaseEntity } from "~/components/crud"

interface ExtendedCrudActions<T extends BaseEntity> extends CrudActions<T> {
  onStatusToggle?: (item: T, newStatus: boolean) => Promise<void>
}

export function createTransmissionColumns(actions: ExtendedCrudActions<Transmission>): ColumnDef<Transmission>[] {
  return [
    {
      accessorKey: "name",
      header: "Transmission Name",
      cell: ({ row }) => {
        const transmission = row.original
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{transmission.name}</span>
            {!transmission.active && (
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
        const transmission = row.original
        const canDelete = (transmission.vehicleCount || 0) === 0

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
              <DropdownMenuItem
                onClick={() => actions.onEdit(transmission)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              
              {actions.onStatusToggle && (
                <DropdownMenuItem
                  onClick={() => actions.onStatusToggle!(transmission, !transmission.active)}
                >
                  {transmission.active ? (
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
                onClick={() => actions.onDelete(transmission)}
                className="text-destructive"
                disabled={!canDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
                {!canDelete && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Has vehicles)
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
