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
import { CrudFormDialog } from "~/components/crud/crud-form-dialog"
import { CrudDeleteDialog } from "~/components/crud/crud-delete-dialog"
import { makeCrudConfig } from "~/components/makes/make-crud-config"
import { useMakes } from "~/components/makes/use-makes"
import type { Make } from "~/types/make"
import type { MakeFormData } from "~/lib/schemas/make"

export default function MakesPage() {
  const makesHook = useMakes()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMake, setSelectedMake] = useState<Make | null>(null)
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  // Use server-side filtering and pagination - no local filtering needed
  const displayedData = makesHook.data

  const handleAdd = async (formData: MakeFormData) => {
    try {
      await makesHook.create(formData)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding make:', error)
    }
  }

  const handleEdit = async (id: string, formData: MakeFormData) => {
    try {
      await makesHook.update(id, formData)
      setIsEditDialogOpen(false)
      setSelectedMake(null)
    } catch (error) {
      console.error('Error updating make:', error)
    }
  }

  const handleDelete = async (make: Make) => {
    try {
      await makesHook.delete(make.id)
      setIsDeleteDialogOpen(false)
      setSelectedMake(null)
    } catch (error) {
      console.error('Error deleting make:', error)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    makesHook.search(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? undefined : value === 'active'
    makesHook.setStatusFilter(status)
  }

  const crudActions = {
    onEdit: (make: Make) => {
      setSelectedMake(make)
      setIsEditDialogOpen(true)
    },
    onDelete: (make: Make) => {
      setSelectedMake(make)
      setIsDeleteDialogOpen(true)
    },
    onStatusToggle: makesHook.toggleStatus,
  }

  const columns = makeCrudConfig.columns(crudActions)

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title={makeCrudConfig.entityNamePlural}
        description={makeCrudConfig.entityDescription}
      />
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <Input
              placeholder={`Search ${makeCrudConfig.entityNamePlural.toLowerCase()}...`}
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
              makesHook.statusFilter === undefined 
                ? 'all' 
                : makesHook.statusFilter 
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
            onClick={() => makesHook.refresh()}
            disabled={makesHook.isLoading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {makeCrudConfig.entityName}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className="px-3 py-1">
          Total: {makesHook.pagination.total}
        </Badge>
        <Badge variant="default" className="px-3 py-1">
          Active: {makesHook.data.filter(m => m.active).length}
        </Badge>
        <Badge variant="secondary" className="px-3 py-1">
          Inactive: {makesHook.data.filter(m => !m.active).length}
        </Badge>
      </div>

      {/* Data Table */}
      <DataTableWithoutPagination
        columns={columns}
        data={displayedData}
      />

      {/* Server-side Pagination */}
      <ServerPagination
        currentPage={makesHook.pagination.page}
        totalPages={makesHook.pagination.pages}
        totalItems={makesHook.pagination.total}
        itemsPerPage={makesHook.pagination.limit}
        hasNext={makesHook.pagination.hasNext}
        hasPrev={makesHook.pagination.hasPrev}
        onPageChange={makesHook.goToPage}
        onNext={makesHook.nextPage}
        onPrevious={makesHook.prevPage}
        onFirst={() => makesHook.goToPage(1)}
        onLast={() => makesHook.goToPage(makesHook.pagination.pages)}
        isLoading={makesHook.isLoading}
      />

      {/* Dialogs */}
      <CrudFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
        config={makeCrudConfig}
        mode="add"
      />

      <CrudFormDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) setSelectedMake(null)
        }}
        onSubmit={async (data) => {
          if (selectedMake) {
            await handleEdit(selectedMake.id, data as MakeFormData)
          }
        }}
        config={makeCrudConfig}
        mode="edit"
        initialData={selectedMake || undefined}
      />

      <CrudDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open) setSelectedMake(null)
        }}
        onConfirm={async () => {
          if (selectedMake) {
            await handleDelete(selectedMake)
          }
        }}
        entity={selectedMake}
        config={makeCrudConfig}
      />
    </div>
  )
}
