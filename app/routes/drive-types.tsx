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
import { driveTypeCrudConfig } from "~/components/drive-types/drive-type-crud-config"
import { useDriveTypes } from "~/components/drive-types/use-drive-types"
import type { DriveType } from "~/types/drive-type"
import type { DriveTypeFormData } from "~/lib/schemas"

export default function DriveTypesPage() {
  const driveTypesHook = useDriveTypes()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDriveType, setSelectedDriveType] = useState<DriveType | null>(null)
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  // Use server-side filtering and pagination - no local filtering needed
  const displayedData = driveTypesHook.data

  const handleAdd = async (formData: DriveTypeFormData) => {
    try {
      await driveTypesHook.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding drive type:', error)
    }
  }

  const handleEdit = async (id: string, formData: DriveTypeFormData) => {
    try {
      await driveTypesHook.update(id, formData)
      setIsEditDialogOpen(false)
      setSelectedDriveType(null)
    } catch (error) {
      console.error('Error updating drive type:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedDriveType) return
    
    try {
      await driveTypesHook.remove(selectedDriveType._id)
      setIsDeleteDialogOpen(false)
      setSelectedDriveType(null)
    } catch (error) {
      console.error('Error deleting drive type:', error)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    driveTypesHook.setSearchQuery(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? null : value === 'active'
    driveTypesHook.setStatusFilter(status)
  }

  const crudActions = {
    onEdit: (driveType: DriveType) => {
      setSelectedDriveType(driveType)
      setIsEditDialogOpen(true)
    },
    onDelete: (driveType: DriveType) => {
      setSelectedDriveType(driveType)
      setIsDeleteDialogOpen(true)
    },
    onStatusToggle: driveTypesHook.toggleStatus,
  }

  const columns = driveTypeCrudConfig.columns(crudActions)

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title={driveTypeCrudConfig.entityNamePlural}
        description={driveTypeCrudConfig.entityDescription}
      />
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <Input
              placeholder={`Search ${driveTypeCrudConfig.entityNamePlural.toLowerCase()}...`}
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
              driveTypesHook.statusFilter === null 
                ? 'all' 
                : driveTypesHook.statusFilter 
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
            onClick={() => {
              setLocalSearchQuery("") // Clear local search input
              driveTypesHook.refresh() // Reset all filters and refresh
            }}
            disabled={driveTypesHook.loading}
            title="Reset all filters and refresh data"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {driveTypeCrudConfig.entityName}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className={`px-3 py-1 transition-all duration-200 ${driveTypesHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Total: {driveTypesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            driveTypesHook.stats?.total || 0
          )}
        </Badge>
        <Badge variant="default" className={`px-3 py-1 transition-all duration-200 ${driveTypesHook.loading ? 'animate-pulse bg-blue-100' : ''}`}>
          Active: {driveTypesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-blue-200 rounded animate-pulse"></span>
          ) : (
            driveTypesHook.stats?.active || 0
          )}
        </Badge>
        <Badge variant="secondary" className={`px-3 py-1 transition-all duration-200 ${driveTypesHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Inactive: {driveTypesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            driveTypesHook.stats?.inactive || 0
          )}
        </Badge>
        {driveTypesHook.stats?.mostUsed && (
          <Badge variant="outline" className="px-3 py-1">
            Most Used: {driveTypesHook.stats.mostUsed.name} ({driveTypesHook.stats.mostUsed.vehicleCount})
          </Badge>
        )}
      </div>

      {/* Data Table */}
      {driveTypesHook.loading ? (
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
      {driveTypesHook.pagination && (
        <ServerPagination
          currentPage={driveTypesHook.pagination.currentPage}
          totalPages={driveTypesHook.pagination.totalPages}
          totalItems={driveTypesHook.pagination.total}
          itemsPerPage={10}
          hasNext={driveTypesHook.pagination.hasNext}
          hasPrev={driveTypesHook.pagination.hasPrev}
          onPageChange={driveTypesHook.setCurrentPage}
          onNext={() => driveTypesHook.setCurrentPage(driveTypesHook.pagination!.currentPage + 1)}
          onPrevious={() => driveTypesHook.setCurrentPage(driveTypesHook.pagination!.currentPage - 1)}
          onFirst={() => driveTypesHook.setCurrentPage(1)}
          onLast={() => driveTypesHook.setCurrentPage(driveTypesHook.pagination!.totalPages)}
          isLoading={driveTypesHook.loading}
        />
      )}

      {/* Add Form Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add {driveTypeCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  active: true // Always set to true by default
                }
                
                try {
                  await driveTypesHook.create(data)
                  setIsAddDialogOpen(false)
                } catch (error) {
                  console.error('Error adding drive type:', error)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter drive type name (e.g., Front-Wheel Drive)"
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
                <Button type="submit" disabled={driveTypesHook.loading}>
                  {driveTypesHook.loading ? 'Adding...' : 'Add Drive Type'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Form Dialog */}
      {isEditDialogOpen && selectedDriveType && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit {driveTypeCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  active: formData.get('active') === 'true'
                }
                
                try {
                  await driveTypesHook.update(selectedDriveType._id, data)
                  setIsEditDialogOpen(false)
                  setSelectedDriveType(null)
                } catch (error) {
                  console.error('Error updating drive type:', error)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={selectedDriveType.name}
                  placeholder="Enter drive type name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="edit-active" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select name="active" defaultValue={selectedDriveType.active.toString()}>
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
                    setSelectedDriveType(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={driveTypesHook.loading}>
                  {driveTypesHook.loading ? 'Updating...' : 'Update Drive Type'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedDriveType && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete Drive Type</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{selectedDriveType.name}"? 
              {selectedDriveType.vehicleCount && selectedDriveType.vehicleCount > 0 && (
                <span className="text-red-600 font-medium">
                  {" "}This drive type is currently used by {selectedDriveType.vehicleCount} vehicle(s).
                </span>
              )}
              {" "}This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedDriveType(null)
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
