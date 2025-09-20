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
import { transmissionCrudConfig } from "~/components/transmissions/transmission-crud-config"
import { useTransmissions } from "~/components/transmissions/use-transmissions"
import type { Transmission } from "~/types/transmission"
import type { TransmissionFormData } from "~/lib/schemas"

export default function TransmissionsPage() {
  const transmissionsHook = useTransmissions()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTransmission, setSelectedTransmission] = useState<Transmission | null>(null)
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  // Use server-side filtering and pagination - no local filtering needed
  const displayedData = transmissionsHook.data

  const handleAdd = async (formData: TransmissionFormData) => {
    try {
      await transmissionsHook.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding transmission:', error)
    }
  }

  const handleEdit = async (id: string, formData: TransmissionFormData) => {
    try {
      await transmissionsHook.update(id, formData)
      setIsEditDialogOpen(false)
      setSelectedTransmission(null)
    } catch (error) {
      console.error('Error updating transmission:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedTransmission) return
    
    try {
      await transmissionsHook.remove(selectedTransmission._id)
      setIsDeleteDialogOpen(false)
      setSelectedTransmission(null)
    } catch (error) {
      console.error('Error deleting transmission:', error)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    transmissionsHook.setSearchQuery(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? null : value === 'active'
    transmissionsHook.setStatusFilter(status)
  }

  const crudActions = {
    onEdit: (transmission: Transmission) => {
      setSelectedTransmission(transmission)
      setIsEditDialogOpen(true)
    },
    onDelete: (transmission: Transmission) => {
      setSelectedTransmission(transmission)
      setIsDeleteDialogOpen(true)
    },
    onStatusToggle: transmissionsHook.toggleStatus,
  }

  const columns = transmissionCrudConfig.columns(crudActions)

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title={transmissionCrudConfig.entityNamePlural}
        description={transmissionCrudConfig.entityDescription}
      />
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <Input
              placeholder={`Search ${transmissionCrudConfig.entityNamePlural.toLowerCase()}...`}
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
              transmissionsHook.statusFilter === null 
                ? 'all' 
                : transmissionsHook.statusFilter 
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
              transmissionsHook.refresh() // Reset all filters and refresh
            }}
            disabled={transmissionsHook.loading}
            title="Reset all filters and refresh data"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {transmissionCrudConfig.entityName}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className={`px-3 py-1 transition-all duration-200 ${transmissionsHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Total: {transmissionsHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            transmissionsHook.stats?.total || 0
          )}
        </Badge>
        <Badge variant="default" className={`px-3 py-1 transition-all duration-200 ${transmissionsHook.loading ? 'animate-pulse bg-blue-100' : ''}`}>
          Active: {transmissionsHook.loading ? (
            <span className="inline-block w-6 h-4 bg-blue-200 rounded animate-pulse"></span>
          ) : (
            transmissionsHook.stats?.active || 0
          )}
        </Badge>
        <Badge variant="secondary" className={`px-3 py-1 transition-all duration-200 ${transmissionsHook.loading ? 'animate-pulse bg-gray-100' : ''}`}>
          Inactive: {transmissionsHook.loading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            transmissionsHook.stats?.inactive || 0
          )}
        </Badge>
      </div>

      {/* Data Table */}
      {transmissionsHook.loading ? (
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
      {transmissionsHook.pagination && (
        <ServerPagination
          currentPage={transmissionsHook.pagination.currentPage}
          totalPages={transmissionsHook.pagination.totalPages}
          totalItems={transmissionsHook.pagination.total}
          itemsPerPage={10}
          hasNext={transmissionsHook.pagination.hasNext}
          hasPrev={transmissionsHook.pagination.hasPrev}
          onPageChange={transmissionsHook.setCurrentPage}
          onNext={() => transmissionsHook.setCurrentPage(transmissionsHook.pagination!.currentPage + 1)}
          onPrevious={() => transmissionsHook.setCurrentPage(transmissionsHook.pagination!.currentPage - 1)}
          onFirst={() => transmissionsHook.setCurrentPage(1)}
          onLast={() => transmissionsHook.setCurrentPage(transmissionsHook.pagination!.totalPages)}
          isLoading={transmissionsHook.loading}
        />
      )}

      {/* Add Form Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add {transmissionCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  active: true // Always set to true by default
                }
                
                try {
                  await transmissionsHook.create(data)
                  setIsAddDialogOpen(false)
                } catch (error) {
                  console.error('Error adding transmission:', error)
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
                  placeholder="Enter transmission name (e.g., Manual, Automatic, CVT)"
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
                <Button type="submit" disabled={transmissionsHook.loading}>
                  {transmissionsHook.loading ? 'Adding...' : 'Add Transmission'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Form Dialog */}
      {isEditDialogOpen && selectedTransmission && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit {transmissionCrudConfig.entityName}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  active: formData.get('active') === 'true'
                }
                
                try {
                  await transmissionsHook.update(selectedTransmission._id, data)
                  setIsEditDialogOpen(false)
                  setSelectedTransmission(null)
                } catch (error) {
                  console.error('Error updating transmission:', error)
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
                  defaultValue={selectedTransmission.name}
                  placeholder="Enter transmission name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="edit-active" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select name="active" defaultValue={selectedTransmission.active.toString()}>
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
                    setSelectedTransmission(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={transmissionsHook.loading}>
                  {transmissionsHook.loading ? 'Updating...' : 'Update Transmission'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedTransmission && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete Transmission</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{selectedTransmission.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedTransmission(null)
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
