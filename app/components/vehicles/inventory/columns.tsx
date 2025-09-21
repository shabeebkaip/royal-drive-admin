import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2, MoreHorizontal, ArrowUpDown, Star, Car, Calendar, DollarSign } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import type { VehicleInventoryItem } from "~/services/vehicleInventoryService"

interface ActionsProps {
  vehicle: VehicleInventoryItem
  onEdit?: (vehicle: VehicleInventoryItem) => void
  onDelete?: (vehicle: VehicleInventoryItem) => void
  onView?: (vehicle: VehicleInventoryItem) => void
}

const ActionsCell = ({ vehicle, onEdit, onDelete, onView }: ActionsProps) => (
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
    </DropdownMenuContent>
  </DropdownMenu>
)

export const vehicleInventoryColumns: ColumnDef<VehicleInventoryItem>[] = [
  {
    id: "featured",
    header: "",
    size: 40,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.marketing.featured && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Featured Vehicle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    ),
  },
  {
    id: "vehicle",
    header: "Vehicle",
    size: 200,
    cell: ({ row }) => {
      const vehicle = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {vehicle.media.images[0] ? (
              <img
                src={vehicle.media.images[0]}
                alt={`${vehicle.make?.name || 'Vehicle'} ${vehicle.model?.name || 'Model'}`}
                className="h-12 w-16 rounded-md object-cover border"
                loading="lazy"
              />
            ) : (
              <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center border">
                <Car className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 truncate">
                {vehicle.year} {vehicle.make?.name || 'Unknown'} {vehicle.model?.name || 'Model'}
              </span>
            </div>
            {vehicle.trim && (
              <p className="text-sm text-gray-600 truncate">{vehicle.trim}</p>
            )}
            <p className="text-xs text-gray-500">
              Stock: {vehicle.internal.stockNumber}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "type.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 100,
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 py-1 text-xs font-medium">
        {row.original.type?.name || 'Unknown'}
      </Badge>
    ),
  },
  {
    id: "engine",
    header: "Engine",
    size: 120,
    cell: ({ row }) => {
      const { engine } = row.original
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {engine.size}L {engine.fuelType?.name || 'Unknown'}
          </div>
          <div className="text-gray-500">
            {engine.cylinders} cyl
            {engine.horsepower && ` • ${engine.horsepower}hp`}
          </div>
        </div>
      )
    },
  },
  {
    id: "drivetrain",
    header: "Drive",
    size: 80,
    cell: ({ row }) => (
      <span className="text-gray-700 uppercase text-sm font-mono">
        {row.original.drivetrain.slug}
      </span>
    ),
  },
  {
    accessorKey: "odometer.value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        Mileage
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 100,
    cell: ({ row }) => {
      const { odometer } = row.original
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Intl.NumberFormat().format(odometer.value)}
          </div>
          <div className="text-gray-500 text-xs">{odometer.unit}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "pricing.listPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 120,
    cell: ({ row }) => {
      const { pricing } = row.original
      return (
        <div className="text-sm">
          <div className="font-semibold text-gray-900">
            {new Intl.NumberFormat("en-CA", { 
              style: "currency", 
              currency: pricing.currency 
            }).format(pricing.listPrice)}
          </div>
          {pricing.financing.available && pricing.financing.monthlyPayment && (
            <div className="text-xs text-blue-600 flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              ${pricing.financing.monthlyPayment}/mo
            </div>
          )}
        </div>
      )
    },
  },
  {
    id: "condition",
    header: "Condition",
    size: 110,
    cell: ({ row }) => {
      const condition = row.original.condition
      const conditionColors: Record<string, string> = {
        'new': "bg-green-100 text-green-800 border-green-200",
        'used': "bg-blue-100 text-blue-800 border-blue-200",
        'certified-pre-owned': "bg-purple-100 text-purple-800 border-purple-200",
      }
      
      return (
        <Badge 
          variant="outline" 
          className={`px-2 py-1 text-xs font-medium capitalize ${conditionColors[condition] || ''}`}
        >
          {condition === 'certified-pre-owned' ? 'CPO' : condition}
        </Badge>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const { status, availability } = row.original
      return (
        <div className="space-y-1">
          <Badge 
            variant="outline"
            className="px-2 py-1 text-xs font-medium"
            style={{ 
              backgroundColor: `${status?.color || '#gray'}20`,
              borderColor: status?.color || '#gray',
              color: status?.color || '#gray' 
            }}
          >
            {status?.name || 'Unknown'}
          </Badge>
          {!availability.inStock && (
            <div className="text-xs text-red-600 font-medium">Out of Stock</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "internal.daysInInventory",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        Days
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 80,
    cell: ({ row }) => {
      const days = row.original.internal.daysInInventory
      const colorClass = days > 90 ? 'text-red-600' : days > 60 ? 'text-yellow-600' : 'text-green-600'
      
      return (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className={`text-sm font-medium ${colorClass}`}>
            {days}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    size: 50,
    cell: ({ row }) => <ActionsCell vehicle={row.original} />,
  },
]

// Compact version for mobile/smaller screens
export const vehicleInventoryColumnsCompact: ColumnDef<VehicleInventoryItem>[] = [
  {
    id: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicle = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {vehicle.media.images[0] ? (
              <img
                src={vehicle.media.images[0]}
                alt={`${vehicle.make?.name || 'Vehicle'} ${vehicle.model?.name || 'Model'}`}
                className="h-16 w-20 rounded-md object-cover border"
                loading="lazy"
              />
            ) : (
              <div className="h-16 w-20 rounded-md bg-gray-100 flex items-center justify-center border">
                <Car className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {vehicle.year} {vehicle.make?.name || 'Unknown'} {vehicle.model?.name || 'Model'}
              </span>
              {vehicle.marketing.featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            {vehicle.trim && (
              <p className="text-sm text-gray-600">{vehicle.trim}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500">
                {new Intl.NumberFormat().format(vehicle.odometer.value)} {vehicle.odometer.unit}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {new Intl.NumberFormat("en-CA", { 
                  style: "currency", 
                  currency: vehicle.pricing.currency 
                }).format(vehicle.pricing.listPrice)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {vehicle.type?.name || 'Unknown'}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  backgroundColor: `${vehicle.status?.color || '#gray'}20`,
                  borderColor: vehicle.status?.color || '#gray',
                  color: vehicle.status?.color || '#gray' 
                }}
              >
                {vehicle.status?.name || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    size: 50,
    cell: ({ row }) => <ActionsCell vehicle={row.original} />,
  },
]
