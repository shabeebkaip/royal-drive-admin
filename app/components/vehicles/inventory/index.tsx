import { useState } from "react";
import { Link } from "react-router";
import { Plus, Grid, List, AlertCircle, ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useVehicleInventory } from "~/hooks/useVehicleInventory";
import { VehicleFilterSidebar } from "./filter-sidebar";
import { getVehicleInventoryColumns } from "./columns";
import { VehicleShimmerLoader } from "./shimmer-loader";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { vehicleService } from "~/services/vehicleService";
import { toast } from "sonner";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface VehicleInventoryProps {
  defaultFilters?: Record<string, any>;
  hideFilters?: boolean;
  hideAddButton?: boolean;
  customTitle?: string;
  hideActionButtons?: boolean;
  excludeSoldStatus?: string; // ID of sold status to exclude from inventory
}

export function VehicleInventory({
  defaultFilters = {},
  hideFilters = false,
  hideAddButton = false,
  customTitle,
  hideActionButtons = false,
  excludeSoldStatus,
}: VehicleInventoryProps) {
  console.log(
    "🚗 VehicleInventory component rendered with defaultFilters:",
    defaultFilters,
    "excludeSoldStatus:",
    excludeSoldStatus
  );

  const [viewMode, setViewMode] = useLocalStorage<"table" | "grid">(
    "vehicle-inventory-view",
    "grid"
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    vehicles: allVehicles,
    pagination,
    loading,
    isInitialLoad,
    isFetching,
    error,
    filters,
    setFilters,
    clearFilters,
    refetch,
    updateFilter,
    searchQuery,
    setSearchQuery,
  } = useVehicleInventory(defaultFilters);

  // Filter out sold vehicles if excludeSoldStatus is provided
  const vehicles = excludeSoldStatus
    ? allVehicles.filter(vehicle => vehicle.status?._id !== excludeSoldStatus)
    : allVehicles;

  const handlePageChange = (page: number) => {
    console.log("📄 Page change requested:", page);
    console.log("📊 Current filters:", filters);
    updateFilter("page", page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ limit: pageSize, page: 1 });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export vehicles with filters:", filters);
  };

  const handleDeleteClick = (vehicle: any) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;

    try {
      setIsDeleting(true);
      await vehicleService.deleteVehicle(vehicleToDelete._id);
      toast.success("Vehicle deleted successfully");
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      refetch(); // Refresh the vehicle list
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle");
    } finally {
      setIsDeleting(false);
    }
  };

  // Initialize table at component level (hooks must be at top level)
  const table = useReactTable({
    data: vehicles,
    columns: getVehicleInventoryColumns(handleDeleteClick),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.pages ?? 0,
  });

  const renderVehicleGrid = () => {
    if (!pagination) {
      return <div>Loading...</div>;
    }

    const { page, pages, total, limit, hasNext, hasPrev } = pagination;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                {vehicle.media?.images?.[0] ? (
                  <img
                    src={vehicle.media.images[0]}
                    alt={`${vehicle.make?.name || "Unknown"} ${vehicle.model?.name || "Model"}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {(vehicle.make?.name || "U").charAt(0)}
                          {(vehicle.model?.name || "M").charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm">No Image</p>
                    </div>
                  </div>
                )}

                {/* Overlay badges */}
                <div className="absolute top-2 left-2">
                  {vehicle.marketing?.featured && (
                    <Badge className="bg-yellow-500 text-yellow-900">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <Badge
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm"
                    style={{
                      borderColor: vehicle.status?.color || "#6b7280",
                      color: vehicle.status?.color || "#6b7280",
                    }}
                  >
                    {vehicle.status?.name || "Unknown"}
                  </Badge>
                </div>

                {!vehicle.availability?.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {vehicle.year} {vehicle.make?.name || "Unknown"}{" "}
                      {vehicle.model?.name || "Model"}
                    </h3>
                    {vehicle.trim && (
                      <p className="text-sm text-gray-600">{vehicle.trim}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Intl.NumberFormat().format(
                        vehicle.odometer?.value || 0
                      )}{" "}
                      {vehicle.odometer?.unit || "km"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {vehicle.type?.name || "Unknown"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat("en-CA", {
                        style: "currency",
                        currency: vehicle.pricing?.currency || "CAD",
                      }).format(vehicle.pricing?.listPrice || 0)}
                    </div>

                    {vehicle.pricing?.financing?.available &&
                      vehicle.pricing?.financing?.monthlyPayment && (
                        <div className="text-sm text-blue-600">
                          ${vehicle.pricing.financing.monthlyPayment}/mo
                        </div>
                      )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link to={`/vehicles/${vehicle._id}`}>View Details</Link>
                    </Button>
                    {vehicle.status?.slug !== "sold" && (
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/vehicles/${vehicle._id}/edit`}>Edit</Link>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(vehicle)}
                      className="px-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Server Pagination Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {start} to {end} of {total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={!hasPrev || loading}
                  variant="outline"
                >
                  First
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!hasPrev || loading}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm px-2">
                  Page {page} of {pages}
                </span>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasNext || loading}
                  variant="outline"
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePageChange(pages)}
                  disabled={!hasNext || loading}
                  variant="outline"
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVehicleTable = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100 border-b-2">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-0">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-gray-800 font-semibold text-sm tracking-wide"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="bg-white">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`border-b border-gray-100 hover:bg-gray-50/80 transition-colors ${
                        idx % 2 === 1 ? "bg-gray-50/30" : "bg-white"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-gray-700">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center text-gray-500"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Server-side Pagination */}
          {pagination && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={!pagination.hasPrev || loading}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev || loading}
                >
                  Previous
                </Button>

                <span className="px-4 py-2 text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext || loading}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.pages)}
                  disabled={!pagination.hasNext || loading}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {customTitle || "Vehicle Inventory"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {loading ? "Loading..." : `${pagination?.total || 0} vehicles`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!hideFilters && (
                <VehicleFilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  resultCount={pagination?.total}
                  loading={loading}
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                />
              )}

              {!hideAddButton && (
                <Button size="sm" asChild>
                  <Link to="/vehicles/add" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vehicle
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Simple Search and View Toggle */}
          {!hideFilters && (
            <div className="flex items-center justify-between mt-6 gap-4">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={filters.sortBy || "year_desc"}
                  onValueChange={(value) => updateFilter("sortBy", value)}
                >
                  <SelectTrigger className="w-[180px] h-9">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="year_desc">Year: Newest First</SelectItem>
                    <SelectItem value="year_asc">Year: Oldest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="mileage_asc">
                      Mileage: Low to High
                    </SelectItem>
                    <SelectItem value="mileage_desc">
                      Mileage: High to Low
                    </SelectItem>
                    <SelectItem value="created_desc">Recently Added</SelectItem>
                    <SelectItem value="featured">Featured First</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {hideFilters && (
            <div className="flex items-center justify-end mt-6 gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          )}
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
            <>
              {/* Loading State - only show shimmer on initial load */}
              {isInitialLoad ? (
                <VehicleShimmerLoader
                  viewMode={viewMode}
                  compact={false}
                  rows={12}
                />
              ) : (
                <div className="relative">
                  {/* Subtle loading overlay for refetching */}
                  {isFetching && (
                    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm py-2 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Updating...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Show content if we have vehicles */}
                  {vehicles.length > 0 ? (
                    <>
                      {viewMode === "grid"
                        ? renderVehicleGrid()
                        : renderVehicleTable()}
                    </>
                  ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          No vehicles found
                        </h3>
                        <p className="text-sm text-gray-500">
                          {Object.keys(filters).length > 0 || searchQuery
                            ? "Try adjusting your search or filters"
                            : "Add your first vehicle to get started"}
                        </p>
                      </div>
                      {!hideActionButtons && (
                        <div className="flex items-center gap-2">
                          {(Object.keys(filters).length > 0 || searchQuery) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearFilters}
                            >
                              Clear Filters
                            </Button>
                          )}
                          <Button size="sm" asChild>
                            <Link to="/vehicles/add">Add Vehicle</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* No persistent sidebar; drawer is triggered from header */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vehicle "
              {vehicleToDelete?.year} {vehicleToDelete?.make?.name}{" "}
              {vehicleToDelete?.model?.name}" and remove it from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Vehicle"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
