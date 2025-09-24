import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight, Star, StarOff } from "lucide-react"
import type { Status } from "~/types/status"

interface StatusActions {
  onEdit: (status: Status) => void
  onDelete: (status: Status) => void
  onActiveToggle: (status: Status, newState: boolean) => void
  onSetDefault: (status: Status) => void
}

export function createStatusColumns(actions: StatusActions): ColumnDef<Status>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const status = row.original
        return (
          <div className="flex items-center gap-3">
            {status.icon && (
              <span className="text-lg">{status.icon}</span>
            )}
            <div className={`font-medium ${status.isDefault ? 'text-yellow-700' : ''}`}>
              {status.name}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => {
        const color = row.getValue("color") as string
        return color ? (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-mono">{color}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: "isDefault",
      header: () => <div className="text-center">Default</div>,
      cell: ({ row }) => {
        const status = row.original
        return (
          <div className="text-center">
            {status.isDefault ? (
              <div className="flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "vehicleCount",
      header: () => <div className="text-left">Vehicles</div>,
      cell: ({ row }) => {
        const count = row.getValue("vehicleCount") as number
        return (
          <div className="text-left font-medium">
            {count || 0}
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
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const status = row.original
        const isActive = status.active
        const isDefault = status.isDefault

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => actions.onEdit(status)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => actions.onActiveToggle(status, !isActive)}
                >
                  {isActive ? (
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
                {!isDefault && (
                  <DropdownMenuItem 
                    onClick={() => actions.onSetDefault(status)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Set as Default
                  </DropdownMenuItem>
                )}
                {isDefault && (
                  <DropdownMenuItem disabled>
                    <StarOff className="mr-2 h-4 w-4" />
                    Default Status
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => actions.onDelete(status)}
                  className="text-destructive"
                  disabled={isDefault}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDefault ? "Cannot Delete Default" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
