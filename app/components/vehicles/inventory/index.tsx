import { useState } from "react"
import { Link } from "react-router"
import { Plus, Download, RefreshCw, Grid, List, AlertCircle, Filter } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Input } from "~/components/ui/input"
import { DataTableGeneric } from "~/components/shared/data-table"
import { PageTitle } from "~/components/shared/page-title"
import { useVehicleInventory } from "~/hooks/useVehicleInventory"
import { VehicleFilterSidebar } from "./filter-sidebar"
import { vehicleInventoryColumns, vehicleInventoryColumnsCompact } from "./columns"
import { VehicleShimmerLoader } from "./shimmer-loader"
import { useLocalStorage } from "~/hooks/use-local-storage"

interface VehicleInventoryProps {
  defaultFilters?: Record<string, any>
}

export function VehicleInventory({ defaultFilters = {} }: VehicleInventoryProps) {
  const [viewMode, setViewMode] = useLocalStorage<'table' | 'grid'>('vehicle-inventory-view', 'table')
  const [showCompact, setShowCompact] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  
  const {
    vehicles,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    refetch,
    updateFilter,
    searchQuery,
    setSearchQuery,
    showOnlyInStock,
    setShowOnlyInStock,
    showOnlyFeatured,
    setShowOnlyFeatured,
  } = useVehicleInventory(defaultFilters)

  const handlePageChange = (page: number) => {
    updateFilter('page', page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ limit: pageSize, page: 1 })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export vehicles with filters:', filters)
  }

  const renderVehicleGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle._id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative">
            {vehicle.media?.images?.[0] ? (
              <img
                src={vehicle.media.images[0]}
                alt={`${vehicle.make?.name || 'Unknown'} ${vehicle.model?.name || 'Model'}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {(vehicle.make?.name || 'U').charAt(0)}{(vehicle.model?.name || 'M').charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm">No Image</p>
                </div>
              </div>
            )}
            
            {/* Overlay badges */}
            <div className="absolute top-2 left-2">
              {vehicle.marketing?.featured && (
                <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>
              )}
            </div>
            
            <div className="absolute top-2 right-2">
              <Badge 
                variant="outline"
                className="bg-white/90 backdrop-blur-sm"
                style={{ 
                  borderColor: vehicle.status?.color || '#6b7280',
                  color: vehicle.status?.color || '#6b7280'
                }}
              >
                {vehicle.status?.name || 'Unknown'}
              </Badge>
            </div>
            
            {!vehicle.availability?.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {vehicle.year} {vehicle.make?.name || 'Unknown'} {vehicle.model?.name || 'Model'}
                </h3>
                {vehicle.trim && (
                  <p className="text-sm text-gray-600">{vehicle.trim}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Intl.NumberFormat().format(vehicle.odometer?.value || 0)} {vehicle.odometer?.unit || 'km'}
                </span>
                <Badge variant="outline" className="text-xs">
                  {vehicle.type?.name || 'Unknown'}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat("en-CA", { 
                    style: "currency", 
                    currency: vehicle.pricing?.currency || 'CAD'
                  }).format(vehicle.pricing?.listPrice || 0)}
                </div>
                
                {vehicle.pricing?.financing?.available && vehicle.pricing?.financing?.monthlyPayment && (
                  <div className="text-sm text-blue-600">
                    ${vehicle.pricing.financing.monthlyPayment}/mo
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" className="flex-1" asChild>
                  <Link to={`/vehicles/${vehicle._id}`}>
                    View Details
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/vehicles/${vehicle._id}/edit`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderVehicleTable = () => (
    <Card>
      <CardContent className="p-0">
        <DataTableGeneric
          columns={showCompact ? vehicleInventoryColumnsCompact : vehicleInventoryColumns}
          data={vehicles}
          pageSize={pagination?.limit || 12}
        />
      </CardContent>
    </Card>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Vehicle Inventory</h1>
              <p className="text-sm text-gray-600 mt-1">
                {loading ? (
                  "Loading..."
                ) : (
                  `${pagination?.total || 0} vehicles`
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <VehicleFilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
                resultCount={pagination?.total}
                loading={loading}
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              />
              
              <Button size="sm" asChild>
                <Link to="/vehicles/add" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Link>
              </Button>
            </div>
          </div>

          {/* Simple Search and View Toggle */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refetch}
                  className="ml-2"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Content */}
          {!error && (
            <div className="space-y-4">
              {/* Loading State */}
              {loading && (
                <VehicleShimmerLoader 
                  viewMode={viewMode} 
                  compact={showCompact}
                  rows={12}
                />
              )}
              
              {/* Show content only if we have vehicles and not loading */}
              {!loading && vehicles.length > 0 && (
                <>
                  {viewMode === 'grid' ? renderVehicleGrid() : renderVehicleTable()}
                </>
              )}
              
              {/* Empty State - show only when not loading and no vehicles */}
              {!loading && vehicles.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
                    <p className="text-sm text-gray-500">
                      {Object.keys(filters).length > 0 || searchQuery
                        ? "Try adjusting your search or filters"
                        : "Add your first vehicle to get started"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(Object.keys(filters).length > 0 || searchQuery) && (
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <Link to="/vehicles/add">
                        Add Vehicle
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

  {/* No persistent sidebar; drawer is triggered from header */}
    </div>
  )
}
