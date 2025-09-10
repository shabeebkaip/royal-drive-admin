import { type ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, MoreHorizontal, Car } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { MakeRow } from "~/types/make"

type MakeColumnsProps = {
  onEdit: (make: MakeRow) => void
  onDelete: (make: MakeRow) => void
}

export const createMakeColumns = ({ onEdit, onDelete }: MakeColumnsProps): ColumnDef<MakeRow>[] => [
  {
    accessorKey: "logo",
    header: "Logo",
    size: 80,
    cell: ({ row }) => {
      const make = row.original
      return (
        <div className="flex items-center justify-center">
          {make.logo ? (
            <img 
              src={make.logo} 
              alt={`${make.name} logo`}
              className="h-8 w-8 object-contain rounded-sm bg-white p-1 border"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-100 rounded-sm flex items-center justify-center">
              <Car className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Make Name",
    cell: ({ row }) => {
      const make = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{make.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "vehicleCount",
    header: "Vehicles",
    size: 100,
    cell: ({ row }) => {
      const count = row.getValue("vehicleCount") as number
      return (
        <Badge 
          variant={count > 0 ? "default" : "secondary"}
          className="text-xs"
        >
          {count} {count === 1 ? "vehicle" : "vehicles"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 120,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    size: 80,
    cell: ({ row }) => {
      const make = row.original
      
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600"
            onClick={() => onEdit(make)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit make</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-50"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => console.log("View vehicles for:", make.name)}
              >
                <Car className="mr-2 h-4 w-4" />
                View Vehicles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(make)}
                disabled={make.vehicleCount > 0}
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
