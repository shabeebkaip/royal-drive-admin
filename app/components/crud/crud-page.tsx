import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "~/components/ui/input"
import { PageTitle } from "~/components/shared/page-title"
import { DataTableGeneric } from "~/components/shared/data-table"
import { CrudFormDialog } from "./crud-form-dialog"
import { CrudDeleteDialog } from "./crud-delete-dialog"
import { useCrudState } from "./use-crud-state"
import type { BaseEntity, CrudConfig, CrudOperations } from "./types"
import type { FieldValues } from "react-hook-form"

type CrudPageProps<TEntity extends BaseEntity, TFormData extends FieldValues> = {
  config: CrudConfig<TEntity, TFormData>
  initialData: TEntity[]
  operations?: CrudOperations<TEntity, TFormData>
}

export function CrudPage<TEntity extends BaseEntity, TFormData extends FieldValues>({
  config,
  initialData,
  operations,
}: CrudPageProps<TEntity, TFormData>) {
  const { data, isLoading, error, actions } = useCrudState(initialData, operations)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<TEntity | null>(null)

  // Filter data based on search query
  const searchFields = config.searchFields || ['name' as keyof TEntity]
  const filteredData = data.filter((entity) =>
    searchFields.some(field => {
      const value = entity[field]
      return typeof value === 'string' && 
             value.toLowerCase().includes(searchQuery.toLowerCase())
    })
  )

  const handleAdd = async (formData: TFormData) => {
    try {
      await actions.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error(`Error adding ${config.entityName.toLowerCase()}:`, error)
    }
  }

  const handleEdit = (entity: TEntity) => {
    setSelectedEntity(entity)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (formData: TFormData) => {
    if (!selectedEntity) return
    
    try {
      await actions.update(selectedEntity.id, formData)
      setIsEditDialogOpen(false)
      setSelectedEntity(null)
    } catch (error) {
      console.error(`Error updating ${config.entityName.toLowerCase()}:`, error)
    }
  }

  const handleDelete = (entity: TEntity) => {
    setSelectedEntity(entity)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedEntity) return
    
    try {
      await actions.delete(selectedEntity.id)
      setIsDeleteDialogOpen(false)
      setSelectedEntity(null)
    } catch (error) {
      console.error(`Error deleting ${config.entityName.toLowerCase()}:`, error)
    }
  }

  const columns = config.columns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => actions.refresh()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <PageTitle
        title={config.entityNamePlural}
        description={config.entityDescription}
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {config.entityName}
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={`Search ${config.entityNamePlural.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredData.length} of {data.length} {config.entityNamePlural.toLowerCase()}
          </div>
        </div>

        {/* Table */}
        <DataTableGeneric
          data={filteredData}
          columns={columns}
        />
      </div>

      {/* Add Dialog */}
      <CrudFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
        onSubmit={handleAdd}
        isLoading={isLoading}
        config={config}
      />

      {/* Edit Dialog */}
      <CrudFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        initialData={selectedEntity || undefined}
        onSubmit={handleUpdate}
        isLoading={isLoading}
        config={config}
      />

      {/* Delete Dialog */}
      <CrudDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        entity={selectedEntity}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
        config={config}
      />
    </div>
  )
}
