import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { VehicleRow } from "~/types/vehicle"

export const vehicleColumns: ColumnDef<VehicleRow>[] = [
  {
    accessorKey: "make",
    header: "Make",
    size: 120,
    cell: ({ getValue }) => (
      <span className="font-medium text-gray-900">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "model",
    header: "Model",
    size: 140,
    cell: ({ getValue }) => (
      <span className="font-medium text-gray-900">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
    size: 70,
    cell: ({ getValue }) => (
      <span className="text-gray-700">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "trim",
    header: "Trim",
    size: 140,
    cell: ({ getValue }) => (
      <span className="text-gray-600">{String(getValue() || "—")}</span>
    ),
  },
  {
    accessorKey: "bodyType",
    header: "Body Type",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="px-2 py-1 text-xs font-medium capitalize">
        {String(getValue())}
      </Badge>
    ),
  },
  {
    accessorKey: "fuelType",
    header: "Fuel",
    cell: ({ getValue }) => (
      <span className="text-gray-700 capitalize">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "drivetrain",
    header: "Drive",
    cell: ({ getValue }) => (
      <span className="text-gray-700 uppercase text-sm font-mono">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "odometer",
    header: "Mileage",
    cell: ({ getValue }) => (
      <span className="text-gray-700">
        {new Intl.NumberFormat().format(Number(getValue()))} km
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900">
        {new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
          Number(getValue())
        )}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = String(getValue())
      const statusColors: Record<string, string> = {
        available: "bg-green-100 text-green-800 border-green-200",
        sold: "bg-gray-100 text-gray-800 border-gray-200", 
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        reserved: "bg-blue-100 text-blue-800 border-blue-200",
      }
      return (
        <Badge 
          variant="outline" 
          className={`px-2 py-1 text-xs font-medium capitalize ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    size: 80,
    cell: ({ row }) => {
      const vehicle = row.original
      
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            asChild
          >
            <Link to={`/vehicles/${vehicle.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View vehicle</span>
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600"
            asChild
          >
            <Link to={`/vehicles/${vehicle.id}/edit`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit vehicle</span>
            </Link>
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
                onClick={() => console.log("Duplicate vehicle:", vehicle.id)}
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Mark as featured:", vehicle.id)}
              >
                Mark as Featured
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => console.log("Delete vehicle:", vehicle.id)}
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
