import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Plus, Search, RotateCcw } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { Textarea } from "~/components/ui/textarea"
import { Checkbox } from "~/components/ui/checkbox"
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
import { statusCrudConfig } from "~/components/statuses/status-crud-config"
import { useStatuses } from "~/components/statuses/use-statuses"
import type { Status } from "~/types/status"
import type { StatusFormData } from "~/lib/schemas"

export default function StatusesPage() {
  const statusesHook = useStatuses()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null)
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  // Use server-side filtering and pagination - no local filtering needed
  const displayedData = statusesHook.data

  const handleAdd = async (formData: StatusFormData) => {
    try {
      await statusesHook.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding status:', error)
    }
  }

  const handleEdit = async (id: string, formData: StatusFormData) => {
    try {
      await statusesHook.update(id, formData)
      setIsEditDialogOpen(false)
      setSelectedStatus(null)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedStatus) return
    
    try {
      await statusesHook.remove(selectedStatus._id)
      setIsDeleteDialogOpen(false)
      setSelectedStatus(null)
    } catch (error) {
      console.error('Error deleting status:', error)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    statusesHook.setSearchQuery(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? null : value === 'active'
    statusesHook.setStatusFilter(status)
  }

  const handleDefaultFilter = (value: string) => {
    const isDefault = value === 'all' ? null : value === 'default'
    statusesHook.setDefaultFilter(isDefault)
  }

  const crudActions = {
    onEdit: (status: Status) => {
      setSelectedStatus(status)
      setIsEditDialogOpen(true)
    },
    onDelete: (status: Status) => {
      setSelectedStatus(status)
      setIsDeleteDialogOpen(true)
    },
    onActiveToggle: statusesHook.toggleActiveStatus,
    onSetDefault: statusesHook.setAsDefault,
  }

  const columns = statusCrudConfig.columns(crudActions)

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title={statusCrudConfig.entityNamePlural}
        description={statusCrudConfig.entityDescription}
      />
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-lg">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <Input
              placeholder={`Search ${statusCrudConfig.entityNamePlural.toLowerCase()}...`}
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="flex gap-2">
            <Select
              value={
                statusesHook.statusFilter === null 
                  ? 'all' 
                  : statusesHook.statusFilter 
                    ? 'active' 
                    : 'inactive'
              }
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                statusesHook.defaultFilter === null 
                  ? 'all' 
                  : statusesHook.defaultFilter 
                    ? 'default' 
                    : 'non-default'
              }
              onValueChange={handleDefaultFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="non-default">Non-Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setLocalSearchQuery("") // Clear local search input
              statusesHook.refresh() // Reset all filters and refresh
            }}
            disabled={statusesHook.loading}
            title="Reset all filters and refresh data"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {statusCrudConfig.entityName}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-4 flex-wrap">
        <Badge variant="outline" className={`px-3 py-1 transition-all duration-200 ${statusesHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Total: {statusesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            statusesHook.stats?.total || 0
          )}
        </Badge>
        <Badge variant="default" className={`px-3 py-1 transition-all duration-200 ${statusesHook.loading ? 'animate-pulse bg-blue-100' : ''}`}>
          Active: {statusesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-blue-200 rounded animate-pulse"></span>
          ) : (
            statusesHook.stats?.active || 0
          )}
        </Badge>
        <Badge variant="secondary" className={`px-3 py-1 transition-all duration-200 ${statusesHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Inactive: {statusesHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            statusesHook.stats?.inactive || 0
          )}
        </Badge>
        {statusesHook.stats?.defaultStatus && (
          <Badge variant="outline" className="px-3 py-1">
            Default: {statusesHook.stats.defaultStatus.name}
          </Badge>
        )}
        {statusesHook.stats?.mostUsed && (
          <Badge variant="outline" className="px-3 py-1">
            Most Used: {statusesHook.stats.mostUsed.name} ({statusesHook.stats.mostUsed.vehicleCount})
          </Badge>
        )}
      </div>

      {/* Data Table */}
      {statusesHook.loading ? (
        <ShimmerTableLoader 
          rows={10} 
          columns={5}
        />
      ) : (
        <DataTableWithoutPagination
          columns={columns}
          data={displayedData}
        />
      )}

      {/* Server-side Pagination */}
      {statusesHook.pagination && (
        <ServerPagination
          currentPage={statusesHook.pagination.currentPage}
          totalPages={statusesHook.pagination.totalPages}
          totalItems={statusesHook.pagination.total}
          itemsPerPage={10}
          hasNext={statusesHook.pagination.hasNext}
          hasPrev={statusesHook.pagination.hasPrev}
          onPageChange={statusesHook.setCurrentPage}
          onNext={() => statusesHook.setCurrentPage(statusesHook.pagination!.currentPage + 1)}
          onPrevious={() => statusesHook.setCurrentPage(statusesHook.pagination!.currentPage - 1)}
          onFirst={() => statusesHook.setCurrentPage(1)}
          onLast={() => statusesHook.setCurrentPage(statusesHook.pagination!.totalPages)}
          isLoading={statusesHook.loading}
        />
      )}

      {/* Add Form Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add {statusCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  color: (formData.get('color') as string)?.trim() || undefined,
                  isDefault: formData.get('isDefault') === 'on',
                  active: true // Always set to true by default
                }
                
                try {
                  await statusesHook.create(data)
                  setIsAddDialogOpen(false)
                } catch (error) {
                  console.error('Error adding status:', error)
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
                  placeholder="Enter status name (e.g., Available)"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    placeholder="#28a745"
                    className="flex-1"
                    onChange={(e) => {
                      const colorInput = document.getElementById('color') as HTMLInputElement
                      if (colorInput && e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                        colorInput.value = e.target.value
                      }
                    }}
                  />
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {statusCrudConfig.colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                      onClick={() => {
                        const colorInput = document.getElementById('color') as HTMLInputElement
                        if (colorInput) colorInput.value = preset.value
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isDefault" name="isDefault" />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                  Set as default status
                </label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={statusesHook.loading}>
                  {statusesHook.loading ? 'Adding...' : 'Add Status'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Form Dialog */}
      {isEditDialogOpen && selectedStatus && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit {statusCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  color: (formData.get('color') as string)?.trim() || undefined,
                  isDefault: formData.get('isDefault') === 'on',
                  active: formData.get('active') === 'true'
                }
                
                try {
                  await statusesHook.update(selectedStatus._id, data)
                  setIsEditDialogOpen(false)
                  setSelectedStatus(null)
                } catch (error) {
                  console.error('Error updating status:', error)
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
                  defaultValue={selectedStatus.name}
                  placeholder="Enter status name"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="edit-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color"
                    name="color"
                    type="color"
                    defaultValue={selectedStatus.color || "#000000"}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    defaultValue={selectedStatus.color || ""}
                    placeholder="#28a745"
                    className="flex-1"
                    onChange={(e) => {
                      const colorInput = document.getElementById('edit-color') as HTMLInputElement
                      if (colorInput && e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                        colorInput.value = e.target.value
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-isDefault" 
                  name="isDefault" 
                  defaultChecked={selectedStatus.isDefault}
                />
                <label htmlFor="edit-isDefault" className="text-sm font-medium text-gray-700">
                  Set as default status
                </label>
              </div>
              
              <div>
                <label htmlFor="edit-active" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select name="active" defaultValue={selectedStatus.active.toString()}>
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
                    setSelectedStatus(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={statusesHook.loading}>
                  {statusesHook.loading ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedStatus && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete Status</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{selectedStatus.name}"? 
              {selectedStatus.isDefault && (
                <span className="text-red-600 font-medium">
                  {" "}This is the default status and cannot be deleted.
                </span>
              )}
              {!selectedStatus.isDefault && selectedStatus.vehicleCount && selectedStatus.vehicleCount > 0 && (
                <span className="text-orange-600 font-medium">
                  {" "}This status is currently used by {selectedStatus.vehicleCount} vehicle(s).
                </span>
              )}
              {!selectedStatus.isDefault && (
                " This action cannot be undone."
              )}
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedStatus(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={selectedStatus.isDefault}
              >
                {selectedStatus.isDefault ? "Cannot Delete" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
