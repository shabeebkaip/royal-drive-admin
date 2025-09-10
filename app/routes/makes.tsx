import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "~/components/ui/input"
import { PageTitle } from "~/components/shared/page-title"
import { DataTableGeneric } from "~/components/shared/data-table"
import { makesMock } from "~/components/makes/list/mock-data"
import { createMakeColumns } from "~/components/makes/list/columns"
import { MakeFormDialog } from "~/components/makes/form/make-form-dialog"
import { DeleteMakeDialog } from "~/components/makes/form/delete-make-dialog"
import type { MakeRow, MakeFormData } from "~/types/make"

export default function MakesPage() {
  const [data, setData] = useState<MakeRow[]>(makesMock)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMake, setSelectedMake] = useState<MakeRow | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter data based on search query
  const filteredData = data.filter((make) =>
    make.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = async (formData: MakeFormData) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      const newMake: MakeRow = {
        id: Date.now().toString(),
        name: formData.name,
        logo: formData.logo || undefined,
        vehicleCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      
      setData([newMake, ...data])
      setIsAddDialogOpen(false)
      
      // TODO: Show success toast
      console.log("Make added successfully:", newMake)
    } catch (error) {
      console.error("Error adding make:", error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (make: MakeRow) => {
    setSelectedMake(make)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (formData: MakeFormData) => {
    if (!selectedMake) return
    
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      const updatedMake: MakeRow = {
        ...selectedMake,
        name: formData.name,
        logo: formData.logo || undefined,
      }
      
      setData(data.map(make => 
        make.id === selectedMake.id ? updatedMake : make
      ))
      setIsEditDialogOpen(false)
      setSelectedMake(null)
      
      // TODO: Show success toast
      console.log("Make updated successfully:", updatedMake)
    } catch (error) {
      console.error("Error updating make:", error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (make: MakeRow) => {
    setSelectedMake(make)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedMake) return
    
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      setData(data.filter(make => make.id !== selectedMake.id))
      setIsDeleteDialogOpen(false)
      setSelectedMake(null)
      
      // TODO: Show success toast
      console.log("Make deleted successfully:", selectedMake)
    } catch (error) {
      console.error("Error deleting make:", error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const columns = createMakeColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Vehicle Makes"
        description="Manage vehicle manufacturers and brands in your inventory."
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Make
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search makes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredData.length} of {data.length} makes
          </div>
        </div>

        {/* Table */}
        <DataTableGeneric
          data={filteredData}
          columns={columns}
        />
      </div>

      {/* Add Dialog */}
      <MakeFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
        onSubmit={handleAdd}
        isLoading={isLoading}
      />

      {/* Edit Dialog */}
      <MakeFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        initialData={selectedMake || undefined}
        onSubmit={handleUpdate}
        isLoading={isLoading}
      />

      {/* Delete Dialog */}
      <DeleteMakeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        make={selectedMake}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
