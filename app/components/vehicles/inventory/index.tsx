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
          <PageTitle
            title="Vehicle Inventory"
            description="Manage your vehicle inventory with advanced filtering and search capabilities."
            actions={
              <div className="flex items-center gap-2">
                {/* Filters Drawer trigger (all screens) */}
                <VehicleFilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  resultCount={pagination?.total}
                  loading={loading}
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                
                <Button size="sm" asChild>
                  <Link to="/vehicles/add" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vehicle
                  </Link>
                </Button>
              </div>
            }
          />
        </div>

        {/* Quick Search and Controls */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Quick search vehicles..."
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
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Table
              </Button>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <Grid className="h-4 w-4" />
                Grid
              </Button>
              
              {viewMode === 'table' && (
                <Button
                  variant={showCompact ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowCompact(!showCompact)}
                >
                  Compact
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Showing {vehicles.length} of {pagination?.total || 0} vehicles
                  {pagination && pagination.pages > 1 && (
                    <> • Page {pagination.page} of {pagination.pages}</>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={showOnlyInStock ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              >
                In Stock Only
              </Badge>
              <Badge
                variant={showOnlyFeatured ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
              >
                Featured Only
              </Badge>
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
              {viewMode === 'grid' ? renderVehicleGrid() : renderVehicleTable()}
              
              {/* Empty State */}
              {!loading && vehicles.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">No vehicles found</h3>
                      <p className="text-gray-600 mt-1">
                        Try adjusting your filters or search criteria.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                      <Button asChild>
                        <Link to="/vehicles/add">Add First Vehicle</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

  {/* No persistent sidebar; drawer is triggered from header */}
    </div>
  )
}
