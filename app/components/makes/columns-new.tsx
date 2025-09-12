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
import type { Make } from "~/types/make"
import type { CrudActions, BaseEntity } from "~/components/crud"

interface ExtendedCrudActions<T extends BaseEntity> extends CrudActions<T> {
  onStatusToggle?: (item: T, newStatus: boolean) => Promise<void>
}

export function createMakeColumns(actions: ExtendedCrudActions<Make>): ColumnDef<Make>[] {
  return [
    {
      accessorKey: "name",
      header: "Make Name",
      cell: ({ row }) => {
        const make = row.original
        return (
          <div className="flex items-center gap-3">
            {make.logo && (
              <img
                src={make.logo}
                alt={`${make.name} logo`}
                className="h-8 w-8 object-contain bg-white p-1 rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium">{make.name}</span>
              {make.description && (
                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                  {make.description}
                </span>
              )}
            </div>
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
        const make = row.original
        const canDelete = (make.vehicleCount || 0) === 0

        const handleStatusToggle = async () => {
          if (actions.onStatusToggle) {
            await actions.onStatusToggle(make, !make.active)
          }
        }

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
              {actions.onView && (
                <DropdownMenuItem onClick={() => actions.onView!(make)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => actions.onEdit(make)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Make
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {actions.onStatusToggle && (
                <DropdownMenuItem onClick={handleStatusToggle}>
                  {make.active ? (
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
              {canDelete ? (
                <DropdownMenuItem 
                  onClick={() => actions.onDelete(make)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Make
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cannot delete (has vehicles)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
