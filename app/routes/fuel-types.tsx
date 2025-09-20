import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Plus, Search, RotateCcw } from "lucide-react"
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
import { fuelTypeCrudConfig } from "~/components/fuel-types/fuel-type-crud-config"
import { useFuelTypes } from "~/components/fuel-types/use-fuel-types"
import type { FuelType } from "~/types/fuel-type"
import type { FuelTypeFormData } from "~/lib/schemas"

export default function FuelTypesPage() {
  const fuelTypesHook = useFuelTypes()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null)
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  // Use server-side filtering and pagination - no local filtering needed
  const displayedData = fuelTypesHook.data

  const handleAdd = async (formData: FuelTypeFormData) => {
    try {
      await fuelTypesHook.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding fuel type:', error)
    }
  }

  const handleEdit = async (id: string, formData: FuelTypeFormData) => {
    try {
      await fuelTypesHook.update(id, formData)
      setIsEditDialogOpen(false)
      setSelectedFuelType(null)
    } catch (error) {
      console.error('Error updating fuel type:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedFuelType) return
    
    try {
      await fuelTypesHook.remove(selectedFuelType._id)
      setIsDeleteDialogOpen(false)
      setSelectedFuelType(null)
    } catch (error) {
      console.error('Error deleting fuel type:', error)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fuelTypesHook.setSearchQuery(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? null : value === 'active'
    fuelTypesHook.setStatusFilter(status)
  }

  const crudActions = {
    onEdit: (fuelType: FuelType) => {
      setSelectedFuelType(fuelType)
      setIsEditDialogOpen(true)
    },
    onDelete: (fuelType: FuelType) => {
      setSelectedFuelType(fuelType)
      setIsDeleteDialogOpen(true)
    },
    onStatusToggle: fuelTypesHook.toggleStatus,
  }

  const columns = fuelTypeCrudConfig.columns(crudActions)

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title={fuelTypeCrudConfig.entityNamePlural}
        description={fuelTypeCrudConfig.entityDescription}
      />
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <Input
              placeholder={`Search ${fuelTypeCrudConfig.entityNamePlural.toLowerCase()}...`}
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
              fuelTypesHook.statusFilter === null 
                ? 'all' 
                : fuelTypesHook.statusFilter 
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
            onClick={fuelTypesHook.refresh}
            disabled={fuelTypesHook.loading}
            title="Reset all filters and refresh data"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {fuelTypeCrudConfig.entityName}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className={`px-3 py-1 transition-all duration-200 ${fuelTypesHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Total: {fuelTypesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            fuelTypesHook.stats?.total || 0
          )}
        </Badge>
        <Badge variant="default" className={`px-3 py-1 transition-all duration-200 ${fuelTypesHook.loading ? 'animate-pulse bg-blue-100' : ''}`}>
          Active: {fuelTypesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-blue-200 rounded animate-pulse"></span>
          ) : (
            fuelTypesHook.stats?.active || 0
          )}
        </Badge>
        <Badge variant="secondary" className={`px-3 py-1 transition-all duration-200 ${fuelTypesHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Inactive: {fuelTypesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            fuelTypesHook.stats?.inactive || 0
          )}
        </Badge>
      </div>

      {/* Data Table */}
      {fuelTypesHook.loading ? (
        <ShimmerTableLoader 
          rows={10} 
          columns={4}
        />
      ) : (
        <DataTableWithoutPagination
          columns={columns}
          data={displayedData}
        />
      )}

      {/* Server-side Pagination */}
      {fuelTypesHook.pagination && (
        <ServerPagination
          currentPage={fuelTypesHook.pagination.currentPage}
          totalPages={fuelTypesHook.pagination.totalPages}
          totalItems={fuelTypesHook.pagination.total}
          itemsPerPage={10}
          hasNext={fuelTypesHook.pagination.hasNext}
          hasPrev={fuelTypesHook.pagination.hasPrev}
          onPageChange={fuelTypesHook.setCurrentPage}
          onNext={() => fuelTypesHook.setCurrentPage(fuelTypesHook.pagination!.currentPage + 1)}
          onPrevious={() => fuelTypesHook.setCurrentPage(fuelTypesHook.pagination!.currentPage - 1)}
          onFirst={() => fuelTypesHook.setCurrentPage(1)}
          onLast={() => fuelTypesHook.setCurrentPage(fuelTypesHook.pagination!.totalPages)}
          isLoading={fuelTypesHook.loading}
        />
      )}

      {/* Add Form Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add {fuelTypeCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  active: true // Always set to true by default
                }
                
                try {
                  await fuelTypesHook.create(data)
                  setIsAddDialogOpen(false)
                } catch (error) {
                  console.error('Error adding fuel type:', error)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter fuel type name"
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={fuelTypesHook.loading}>
                  {fuelTypesHook.loading ? 'Adding...' : 'Add Fuel Type'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Form Dialog */}
      {isEditDialogOpen && selectedFuelType && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit {fuelTypeCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  active: formData.get('active') === 'true'
                }
                
                try {
                  await fuelTypesHook.update(selectedFuelType._id, data)
                  setIsEditDialogOpen(false)
                  setSelectedFuelType(null)
                } catch (error) {
                  console.error('Error updating fuel type:', error)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={selectedFuelType.name}
                  placeholder="Enter fuel type name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="edit-active" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select name="active" defaultValue={selectedFuelType.active.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setSelectedFuelType(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={fuelTypesHook.loading}>
                  {fuelTypesHook.loading ? 'Updating...' : 'Update Fuel Type'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {/* TODO: Implement proper CRUD delete dialog once generic type issues are resolved */}
      {isDeleteDialogOpen && selectedFuelType && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete Fuel Type</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{selectedFuelType.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedFuelType(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
