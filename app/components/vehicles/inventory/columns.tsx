import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2, MoreHorizontal, Star, Car } from "lucide-react"
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
import type { VehicleInventoryItem } from "~/services/vehicleInventoryService"

interface ActionsProps {
  vehicle: VehicleInventoryItem
  onEdit?: (vehicle: VehicleInventoryItem) => void
  onDelete?: (vehicle: VehicleInventoryItem) => void
  onView?: (vehicle: VehicleInventoryItem) => void
}

const ActionsCell = ({ vehicle, onEdit, onDelete, onView }: ActionsProps) => {
  const isSold = vehicle.status?.slug === 'sold'
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link to={`/vehicles/${vehicle._id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        {!isSold && (
          <>
            <DropdownMenuItem asChild>
              <Link to={`/vehicles/${vehicle._id}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit Vehicle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete?.(vehicle)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Minimal table with essential information only - no horizontal scrolling
export const vehicleInventoryColumns: ColumnDef<VehicleInventoryItem>[] = [
  {
    id: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicle = row.original
      return (
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex-shrink-0">
            {vehicle.media.images[0] ? (
              <img
                src={vehicle.media.images[0]}
                alt={`${vehicle.make?.name || 'Vehicle'} ${vehicle.model?.name || 'Model'}`}
                className="h-12 w-16 rounded object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-12 w-16 rounded bg-gray-100 flex items-center justify-center">
                <Car className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 truncate">
                {vehicle.year} {vehicle.make?.name || 'Unknown'}
              </span>
              {vehicle.marketing.featured && (
                <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">
              {vehicle.model?.name || 'Model'} {vehicle.trim && `• ${vehicle.trim}`}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">
        {row.original.type?.name || 'Unknown'}
      </span>
    ),
  },
  {
    id: "engine",
    header: "Engine",
    cell: ({ row }) => {
      const { engine } = row.original
      return (
        <div className="text-sm">
          <div className="text-gray-900">
            {engine.size}L {engine.fuelType?.name || 'Unknown'}
          </div>
          <div className="text-gray-500 text-xs">
            {engine.cylinders} cyl
          </div>
        </div>
      )
    },
  },
  {
    id: "mileage",
    header: "Mileage",
    cell: ({ row }) => {
      const { odometer } = row.original
      return (
        <div className="text-sm">
          <div className="text-gray-900">
            {new Intl.NumberFormat().format(odometer.value)}
          </div>
          <div className="text-gray-500 text-xs">{odometer.unit}</div>
        </div>
      )
    },
  },
  {
    id: "price",
    header: "Price",
    cell: ({ row }) => {
      const { pricing } = row.original
      return (
        <div className="text-sm font-semibold text-gray-900">
          {new Intl.NumberFormat("en-CA", { 
            style: "currency", 
            currency: pricing.currency 
          }).format(pricing.listPrice)}
        </div>
      )
    },
  },
  {
    id: "condition",
    header: "Condition",
    cell: ({ row }) => {
      const condition = row.original.condition
      const conditionColors: Record<string, string> = {
        'new': "bg-green-100 text-green-800",
        'used': "bg-blue-100 text-blue-800",
        'certified-pre-owned': "bg-purple-100 text-purple-800",
      }
      
      return (
        <Badge 
          variant="outline" 
          className={`text-xs ${conditionColors[condition] || 'bg-gray-100 text-gray-800'}`}
        >
          {condition === 'certified-pre-owned' ? 'CPO' : condition}
        </Badge>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status, availability } = row.original
      return (
        <div>
          <Badge 
            variant="outline"
            className="text-xs"
            style={{ 
              backgroundColor: `${status?.color || '#gray'}20`,
              borderColor: status?.color || '#gray',
              color: status?.color || '#gray' 
            }}
          >
            {status?.name || 'Unknown'}
          </Badge>
          {!availability.inStock && (
            <div className="text-xs text-red-600 mt-1">Out of Stock</div>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell vehicle={row.original} />,
  },
]
