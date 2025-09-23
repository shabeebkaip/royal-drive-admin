import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import type { DriveType } from "~/types/drive-type"

interface DriveTypeActions {
  onEdit: (driveType: DriveType) => void
  onDelete: (driveType: DriveType) => void
  onStatusToggle: (driveType: DriveType, newStatus: boolean) => void
}

export function createDriveTypeColumns(actions: DriveTypeActions): ColumnDef<DriveType>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
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
        const driveType = row.original
        const isActive = driveType.active

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
                <DropdownMenuItem onClick={() => actions.onEdit(driveType)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => actions.onStatusToggle(driveType, !isActive)}
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
                <DropdownMenuItem 
                  onClick={() => actions.onDelete(driveType)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
