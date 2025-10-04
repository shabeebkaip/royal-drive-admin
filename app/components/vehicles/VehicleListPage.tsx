import { useState, useEffect } from 'react'
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { DataTable } from "./DataTable"
import { PageTitle } from "~/components/shared/page-title"
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Eye, Edit, Trash2, Copy } from "lucide-react"
import type { Vehicle, VehicleStats, VehicleSearchParams, VehicleDropdowns } from "~/types/vehicle"
import { vehicleService } from "~/services/vehicleService"
import { toast } from "sonner"
import { Link } from "react-router"

// Define table columns for vehicles
const vehicleColumns = [
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }: any) => (
      <Link 
        to={`/vehicles/${row.original._id}`}
        className="font-medium text-blue-600 hover:text-blue-800"
      >
        {row.original.year}
      </Link>
    )
  },
  {
    accessorKey: "make",
    header: "Make",
    cell: ({ row }: any) => {
      const make = row.original.make
      return typeof make === 'string' ? make : make.name
    }
  },
  {
    accessorKey: "model",
    header: "Model", 
    cell: ({ row }: any) => {
      const model = row.original.model
      return typeof model === 'string' ? model : model.name
    }
  },
  {
    accessorKey: "trim",
    header: "Trim",
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }: any) => (
      <Badge variant={row.original.condition === 'new' ? 'default' : 'secondary'}>
        {row.original.condition}
      </Badge>
    )
  },
  {
    accessorKey: "odometer.value",
    header: "Mileage",
    cell: ({ row }: any) => (
      <span>
        {row.original.odometer.value.toLocaleString()} {row.original.odometer.unit}
      </span>
    )
  },
  {
    accessorKey: "pricing.listPrice",
    header: "Price",
    cell: ({ row }: any) => (
      <span className="font-medium">
        ${row.original.pricing.listPrice.toLocaleString()} CAD
      </span>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.original.status
      const statusName = typeof status === 'string' ? status : status.name
      const statusColor = typeof status === 'string' ? '#666' : (status.color || '#666')
      
      return (
        <Badge 
          variant="outline" 
          style={{ borderColor: statusColor, color: statusColor }}
        >
          {statusName}
        </Badge>
      )
    }
  },
  {
    accessorKey: "availability.inStock",
    header: "In Stock",
    cell: ({ row }: any) => (
      <Badge variant={row.original.availability.inStock ? 'default' : 'destructive'}>
        {row.original.availability.inStock ? 'Yes' : 'No'}
      </Badge>
    )
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }: any) => <VehicleActions vehicle={row.original} />
  }
]

// Vehicle Actions Component
function VehicleActions({ vehicle, onDelete, onDuplicate }: { 
  vehicle: Vehicle
  onDelete?: (vehicle: Vehicle) => void
  onDuplicate?: (vehicle: Vehicle) => void
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await vehicleService.deleteVehicle(vehicle._id)
      toast.success('Vehicle deleted successfully')
      onDelete?.(vehicle)
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Failed to delete vehicle')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true)
      const response = await vehicleService.duplicateVehicle(vehicle._id)
      if (response.success) {
        toast.success('Vehicle duplicated successfully')
        onDuplicate?.(response.data!)
      }
    } catch (error) {
      console.error('Error duplicating vehicle:', error)
      toast.error('Failed to duplicate vehicle')
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to={`/vehicles/${vehicle._id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/vehicles/${vehicle._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Vehicle
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDuplicate}
            disabled={isDuplicating}
          >
            <Copy className="mr-2 h-4 w-4" />
            {isDuplicating ? 'Duplicating...' : 'Duplicate'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle 
              "{vehicle.year} {typeof vehicle.make === 'string' ? vehicle.make : vehicle.make.name} {typeof vehicle.model === 'string' ? vehicle.model : vehicle.model.name}" 
              and remove it from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<VehicleStats | null>(null)
  const [dropdowns, setDropdowns] = useState<VehicleDropdowns | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchParams, setSearchParams] = useState<VehicleSearchParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  })

  // Load initial data
  useEffect(() => {
    loadData()
  }, [searchParams])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load all data in parallel
      const [vehiclesResponse, statsResponse, dropdownsResponse] = await Promise.all([
        vehicleService.getVehicles(searchParams),
        vehicleService.getVehicleStats(),
        vehicleService.getDropdownData()
      ])

      setVehicles(vehiclesResponse.data)
      setPagination(vehiclesResponse.pagination)
      
      if (statsResponse.success) {
        setStats(statsResponse.data!)
      }
      
      if (dropdownsResponse.success) {
        setDropdowns(dropdownsResponse.data!)
      }
    } catch (error) {
      console.error('Error loading vehicle data:', error)
      toast.error('Failed to load vehicle data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      await loadData()
      toast.success('Data refreshed successfully')
    } catch (error) {
      console.error('Error refreshing data:', error)
      toast.error('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }

  // Handle vehicle deletion
  const handleVehicleDeleted = (deletedVehicle: Vehicle) => {
    setVehicles(prev => prev.filter(v => v._id !== deletedVehicle._id))
    refreshData() // Refresh stats
  }

  // Handle vehicle duplication
  const handleVehicleDuplicated = (newVehicle: Vehicle) => {
    refreshData() // Refresh the entire list to show the new vehicle
  }

  // Create vehicle columns with callbacks
  const getVehicleColumns = () => [
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "make",
      header: "Make",
      cell: ({ row }: any) => {
        const make = row.original.make
        return typeof make === 'string' ? make : make.name
      }
    },
    {
      accessorKey: "model",
      header: "Model", 
      cell: ({ row }: any) => {
        const model = row.original.model
        return typeof model === 'string' ? model : model.name
      }
    },
    {
      accessorKey: "trim",
      header: "Trim",
    },
    {
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }: any) => (
        <Badge variant={row.original.condition === 'new' ? 'default' : 'secondary'}>
          {row.original.condition}
        </Badge>
      )
    },
    {
      accessorKey: "odometer.value",
      header: "Mileage",
      cell: ({ row }: any) => (
        <span>
          {row.original.odometer.value.toLocaleString()} {row.original.odometer.unit}
        </span>
      )
    },
    {
      accessorKey: "pricing.listPrice",
      header: "Price",
      cell: ({ row }: any) => (
        <span className="font-medium">
          ${row.original.pricing.listPrice.toLocaleString()} CAD
        </span>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status
        const statusName = typeof status === 'string' ? status : status.name
        const statusColor = typeof status === 'string' ? '#666' : (status.color || '#666')
        
        return (
          <Badge 
            variant="outline" 
            style={{ borderColor: statusColor, color: statusColor }}
          >
            {statusName}
          </Badge>
        )
      }
    },
    {
      accessorKey: "availability.inStock",
      header: "In Stock",
      cell: ({ row }: any) => (
        <Badge variant={row.original.availability.inStock ? 'default' : 'destructive'}>
          {row.original.availability.inStock ? 'Yes' : 'No'}
        </Badge>
      )
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <VehicleActions 
          vehicle={row.original} 
          onDelete={handleVehicleDeleted}
          onDuplicate={handleVehicleDuplicated}
        />
      )
    }
  ]
  const handleSearch = (term: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: term,
      page: 1
    }))
  }

  const handleFilterChange = (key: keyof VehicleSearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }

  const clearFilters = () => {
    setSearchParams({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Vehicle Inventory" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link to="/vehicles/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.inStock} in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.available}</div>
              <p className="text-xs text-muted-foreground">
                Ready for sale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(stats.averagePrice).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                CAD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featured}</div>
              <p className="text-xs text-muted-foreground">
                Featured listings
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Vehicle List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search & Filters</CardTitle>
              <CardDescription>
                Find vehicles using search and filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by make, model, year, or stock number..."
                    value={searchParams.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  disabled={!Object.keys(searchParams).some(key => 
                    key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder' && 
                    searchParams[key as keyof VehicleSearchParams]
                  )}
                >
                  Clear
                </Button>
              </div>

              {/* Filters Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Make Filter */}
                <div className="space-y-2">
                  <Label>Make</Label>
                  <Select 
                    value={searchParams.make || ''} 
                    onValueChange={(value) => handleFilterChange('make', value === 'all-makes' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Makes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-makes">All Makes</SelectItem>
                      {dropdowns?.makes.map((make) => (
                        <SelectItem key={make._id} value={make._id}>
                          {make.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model Filter */}
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select 
                    value={searchParams.model || ''} 
                    onValueChange={(value) => handleFilterChange('model', value === 'all-models' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Models" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-models">All Models</SelectItem>
                      {dropdowns?.models.map((model) => (
                        <SelectItem key={model._id} value={model._id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Filter */}
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select 
                    value={searchParams.condition || ''} 
                    onValueChange={(value) => handleFilterChange('condition', value === 'all-conditions' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-conditions">All Conditions</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="certified-pre-owned">Certified Pre-Owned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={searchParams.status || ''} 
                    onValueChange={(value) => handleFilterChange('status', value === 'all-statuses' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-statuses">All Statuses</SelectItem>
                      {dropdowns?.statuses.map((status) => (
                        <SelectItem key={status._id} value={status._id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Year and Price Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Year Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="From"
                      value={searchParams.yearFrom || ''}
                      onChange={(e) => handleFilterChange('yearFrom', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                    <Input
                      type="number"
                      placeholder="To"
                      value={searchParams.yearTo || ''}
                      onChange={(e) => handleFilterChange('yearTo', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Price Range (CAD)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={searchParams.priceFrom || ''}
                      onChange={(e) => handleFilterChange('priceFrom', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={searchParams.priceTo || ''}
                      onChange={(e) => handleFilterChange('priceTo', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vehicles</CardTitle>
                  <CardDescription>
                    {pagination.total} vehicles found
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select 
                    value={searchParams.sortBy || 'createdAt'} 
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Added</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="make">Make</SelectItem>
                      <SelectItem value="model">Model</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="odometer">Mileage</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={searchParams.sortOrder || 'desc'} 
                    onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={getVehicleColumns()}
                data={vehicles}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Content */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Condition Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>New</span>
                      <Badge>{stats.conditionBreakdown.new}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Used</span>
                      <Badge variant="secondary">{stats.conditionBreakdown.used}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Certified Pre-Owned</span>
                      <Badge variant="outline">{stats.conditionBreakdown['certified-pre-owned']}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Makes</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-2">
                    {stats.topMakes.map((make, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{make.make}</span>
                        <Badge>{make.count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
