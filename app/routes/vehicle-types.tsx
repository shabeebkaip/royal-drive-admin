import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Plus, Search, Filter, RotateCcw } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { PageTitle } from "~/components/shared/page-title"
import { DataTableWithoutPagination, ServerPagination } from "~/components/shared/data-table"
import { ShimmerTableLoader } from "~/components/shared/shimmer-table-loader"
import { CrudFormDialog } from "~/components/crud/crud-form-dialog"
import { CrudDeleteDialog } from "~/components/crud/crud-delete-dialog"
import { vehicleTypeCrudConfig } from "~/components/vehicle-types/vehicle-type-crud-config"
import { useVehicleTypes } from "~/components/vehicle-types/use-vehicle-types"
import type { VehicleType } from "~/types/vehicle-type"
import type { VehicleTypeFormData } from "~/lib/schemas/vehicle-type"

export default function VehicleTypesPage() {
  const vehicleTypesHook = useVehicleTypes()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null)
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  // Use server-side filtering and pagination - no local filtering needed
  const displayedData = vehicleTypesHook.data

  const handleAdd = async (formData: VehicleTypeFormData) => {
    try {
      await vehicleTypesHook.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding vehicle type:', error)
    }
  }

  const handleEdit = async (id: string, formData: VehicleTypeFormData) => {
    try {
      await vehicleTypesHook.update(id, formData)
      setIsEditDialogOpen(false)
      setSelectedVehicleType(null)
    } catch (error) {
      console.error('Error updating vehicle type:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedVehicleType) return
    
    try {
      await vehicleTypesHook.deleteMake(selectedVehicleType.id)
      setIsDeleteDialogOpen(false)
      setSelectedVehicleType(null)
    } catch (error) {
      console.error('Error deleting vehicle type:', error)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    vehicleTypesHook.search(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? undefined : value === 'active'
    vehicleTypesHook.setStatusFilter(status)
  }

  const crudActions = {
    onEdit: (vehicleType: VehicleType) => {
      setSelectedVehicleType(vehicleType)
      setIsEditDialogOpen(true)
    },
    onDelete: (vehicleType: VehicleType) => {
      setSelectedVehicleType(vehicleType)
      setIsDeleteDialogOpen(true)
    },
    onStatusToggle: vehicleTypesHook.toggleStatus,
  }

  const columns = vehicleTypeCrudConfig.columns(crudActions)

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title={vehicleTypeCrudConfig.entityNamePlural}
        description={vehicleTypeCrudConfig.entityDescription}
      />
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <Input
              placeholder={`Search ${vehicleTypeCrudConfig.entityNamePlural.toLowerCase()}...`}
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <Select
            value={
              vehicleTypesHook.statusFilter === undefined 
                ? 'all' 
                : vehicleTypesHook.statusFilter 
                  ? 'active' 
                  : 'inactive'
            }
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={vehicleTypesHook.refresh}
            disabled={vehicleTypesHook.isLoading}
            title="Reset all filters and refresh data"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {vehicleTypeCrudConfig.entityName}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className={`px-3 py-1 transition-all duration-200 ${vehicleTypesHook.isStatsLoading ? 'animate-pulse bg-gray-100' : ''}`}>
          Total: {vehicleTypesHook.isStatsLoading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            vehicleTypesHook.stats.total
          )}
        </Badge>
        <Badge variant="default" className={`px-3 py-1 transition-all duration-200 ${vehicleTypesHook.isStatsLoading ? 'animate-pulse bg-blue-100' : ''}`}>
          Active: {vehicleTypesHook.isStatsLoading ? (
            <span className="inline-block w-6 h-4 bg-blue-200 rounded animate-pulse"></span>
          ) : (
            vehicleTypesHook.stats.active
          )}
        </Badge>
        <Badge variant="secondary" className={`px-3 py-1 transition-all duration-200 ${vehicleTypesHook.isStatsLoading ? 'animate-pulse bg-gray-100' : ''}`}>
          Inactive: {vehicleTypesHook.isStatsLoading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            vehicleTypesHook.stats.inactive
          )}
        </Badge>
      </div>

      {/* Data Table */}
      {vehicleTypesHook.isLoading ? (
        <ShimmerTableLoader 
          rows={vehicleTypesHook.pagination.limit || 10} 
          columns={4}
        />
      ) : (
        <DataTableWithoutPagination
          columns={columns}
          data={displayedData}
        />
      )}

      {/* Server-side Pagination */}
      <ServerPagination
        currentPage={vehicleTypesHook.pagination.page}
        totalPages={vehicleTypesHook.pagination.pages}
        totalItems={vehicleTypesHook.pagination.total}
        itemsPerPage={vehicleTypesHook.pagination.limit}
        hasNext={vehicleTypesHook.pagination.hasNext}
        hasPrev={vehicleTypesHook.pagination.hasPrev}
        onPageChange={vehicleTypesHook.goToPage}
        onNext={vehicleTypesHook.nextPage}
        onPrevious={vehicleTypesHook.prevPage}
        onFirst={() => vehicleTypesHook.goToPage(1)}
        onLast={() => vehicleTypesHook.goToPage(vehicleTypesHook.pagination.pages)}
        isLoading={vehicleTypesHook.isLoading}
      />

      {/* Dialogs */}
      <CrudFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
        config={vehicleTypeCrudConfig}
        mode="add"
      />

      <CrudFormDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) setSelectedVehicleType(null)
        }}
        onSubmit={async (formData) => {
          if (selectedVehicleType) {
            return await handleEdit(selectedVehicleType.id, formData)
          }
        }}
        config={vehicleTypeCrudConfig}
        mode="edit"
        initialData={selectedVehicleType || undefined}
      />

      <CrudDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open) setSelectedVehicleType(null)
        }}
        entity={selectedVehicleType}
        onConfirm={handleDelete}
        config={vehicleTypeCrudConfig}
      />
    </div>
  )
}
