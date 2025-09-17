import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Plus, Search, RotateCcw } from "lucide-react"
import { PageTitle } from "~/components/shared/page-title"
import { DataTableWithoutPagination } from "~/components/shared/data-table"
import { ServerPagination } from "~/components/shared/data-table"
import { ShimmerTableLoader } from "~/components/shared/shimmer-table-loader"
import { CrudFormDialog } from "~/components/crud/crud-form-dialog"
import { CrudDeleteDialog } from "~/components/crud/crud-delete-dialog"
import { useModels } from "~/components/models/use-models"
import { modelCrudConfig } from "~/components/models/model-crud-config"
import type { Make } from "~/types/make"
import type { VehicleType } from "~/types/vehicle-type"
import type { Model } from "~/types/model"
import { makesApiService } from "~/components/makes/makes-api"
import { vehicleTypesApiService } from "~/components/vehicle-types/vehicle-types-api"

export default function ModelsPage() {
  const modelsHook = useModels()
  const [makes, setMakes] = useState<Make[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loadingFilters, setLoadingFilters] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState(modelsHook.searchQuery)
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoadingFilters(true)
        const [makesResponse, vehicleTypesResponse] = await Promise.all([
          makesApiService.getAllWithFilters({ limit: 1000, active: true }),
          vehicleTypesApiService.getAllWithFilters({ limit: 1000, active: true })
        ])
        setMakes(makesResponse.data)
        setVehicleTypes(vehicleTypesResponse.data)
      } catch (error) {
        console.error('Error loading filter options:', error)
      } finally {
        setLoadingFilters(false)
      }
    }

    loadFilterOptions()
  }, [])

  // Sync local search with hook
  useEffect(() => {
    setLocalSearchQuery(modelsHook.searchQuery)
  }, [modelsHook.searchQuery])

  const displayedData = modelsHook.data || []

  const handleAdd = async (formData: { name: string; make: string; vehicleType: string; description?: string }) => {
    try {
      await modelsHook.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding model:', error)
    }
  }

  const handleEdit = async (formData: { name: string; make: string; vehicleType: string; description?: string }) => {
    if (!selectedModel) return
    
    try {
      await modelsHook.update(selectedModel.id, formData)
      setIsEditDialogOpen(false)
      setSelectedModel(null)
    } catch (error) {
      console.error('Error updating model:', error)
    }
  }

  const handleDelete = async (model: Model) => {
    try {
      await modelsHook.deleteModel(model.id)
      setIsDeleteDialogOpen(false)
      setSelectedModel(null)
    } catch (error) {
      console.error('Error deleting model:', error)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    modelsHook.search(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? undefined : value === 'active'
    modelsHook.setStatusFilter(status)
  }

  const crudActions = {
    onEdit: (model: Model) => {
      setSelectedModel(model)
      setIsEditDialogOpen(true)
    },
    onDelete: (model: Model) => {
      setSelectedModel(model)
      setIsDeleteDialogOpen(true)
    },
    onStatusToggle: modelsHook.toggleStatus,
  }

  const columns = modelCrudConfig.columns(crudActions)

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title={modelCrudConfig.entityNamePlural}
        description={modelCrudConfig.entityDescription}
      />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Models</p>
              <p className="text-2xl font-bold text-gray-900">
                {modelsHook.isStatsLoading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  modelsHook.stats.total
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Models</p>
              <p className="text-2xl font-bold text-green-700">
                {modelsHook.isStatsLoading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  modelsHook.stats.active
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Models</p>
              <p className="text-2xl font-bold text-red-700">
                {modelsHook.isStatsLoading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  modelsHook.stats.inactive
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Makes</p>
              <p className="text-2xl font-bold text-blue-700">
                {modelsHook.isStatsLoading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  makes.length
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
            <Input
              placeholder={`Search ${modelCrudConfig.entityNamePlural.toLowerCase()}...`}
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Make Filter */}
          <Select
            value={modelsHook.makeFilter || "all"}
            onValueChange={(value) => modelsHook.setMakeFilter(value === "all" ? undefined : value)}
            disabled={loadingFilters}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {makes.map((make) => (
                <SelectItem key={make.id} value={make.id}>
                  {make.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Vehicle Type Filter */}
          <Select
            value={modelsHook.vehicleTypeFilter || "all"}
            onValueChange={(value) => modelsHook.setVehicleTypeFilter(value === "all" ? undefined : value)}
            disabled={loadingFilters}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicle Types</SelectItem>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Status Filter */}
          <Select
            value={
              modelsHook.statusFilter === undefined 
                ? 'all' 
                : modelsHook.statusFilter 
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
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setLocalSearchQuery("")
              modelsHook.refresh()
            }}
            disabled={modelsHook.isLoading}
            title="Reset all filters and refresh data"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {modelCrudConfig.entityName}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className={`px-3 py-1 transition-all duration-200 ${modelsHook.isStatsLoading ? 'animate-pulse bg-gray-100' : ''}`}>
          Total: {modelsHook.isStatsLoading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            modelsHook.stats.total
          )}
        </Badge>
        <Badge variant="default" className={`px-3 py-1 transition-all duration-200 ${modelsHook.isStatsLoading ? 'animate-pulse bg-blue-100' : ''}`}>
          Active: {modelsHook.isStatsLoading ? (
            <span className="inline-block w-6 h-4 bg-blue-200 rounded animate-pulse"></span>
          ) : (
            modelsHook.stats.active
          )}
        </Badge>
        <Badge variant="secondary" className={`px-3 py-1 transition-all duration-200 ${modelsHook.isStatsLoading ? 'animate-pulse bg-gray-100' : ''}`}>
          Inactive: {modelsHook.isStatsLoading ? (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            modelsHook.stats.inactive
          )}
        </Badge>
      </div>

      {/* Data Table */}
      {modelsHook.isLoading ? (
        <ShimmerTableLoader 
          rows={modelsHook.pagination.limit || 10} 
          columns={5}
        />
      ) : (
        <DataTableWithoutPagination
          columns={columns}
          data={displayedData}
        />
      )}

      {/* Server-side Pagination */}
      <ServerPagination
        currentPage={modelsHook.pagination.page}
        totalPages={modelsHook.pagination.pages}
        totalItems={modelsHook.pagination.total}
        itemsPerPage={modelsHook.pagination.limit}
        hasNext={modelsHook.pagination.hasNext}
        hasPrev={modelsHook.pagination.hasPrev}
        onPageChange={modelsHook.goToPage}
        onNext={modelsHook.nextPage}
        onPrevious={modelsHook.prevPage}
        onFirst={() => modelsHook.goToPage(1)}
        onLast={() => modelsHook.goToPage(modelsHook.pagination.pages)}
        isLoading={modelsHook.isLoading}
      />

      {/* Add Dialog */}
      <CrudFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
        config={modelCrudConfig}
        mode="add"
      />

      {/* Edit Dialog */}
      <CrudFormDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) setSelectedModel(null)
        }}
        onSubmit={async (data) => {
          if (selectedModel) {
            await handleEdit(data as any)
          }
        }}
        config={modelCrudConfig}
        mode="edit"
        initialData={selectedModel || undefined}
      />

      {/* Delete Dialog */}
      <CrudDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open) setSelectedModel(null)
        }}
        entity={selectedModel}
        onConfirm={async () => {
          if (selectedModel) {
            await handleDelete(selectedModel)
          }
        }}
        config={modelCrudConfig}
      />
    </div>
  )
}
