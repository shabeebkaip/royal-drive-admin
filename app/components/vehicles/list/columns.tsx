import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "~/components/ui/badge"

export type VehicleRow = {
  id: string
  year: number
  make: string
  model: string
  trim?: string
  bodyType: string
  fuelType: string
  drivetrain: string
  odometer: number
  price: number
  status: string
}

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
]
