import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { ImageUploadDropzone } from "~/components/shared/image-upload-dropzone"
import type { CrudConfig, FormRenderProps } from "~/components/crud"
import type { Make } from "~/types/make"
import { makeFormSchema, defaultMakeValues, type MakeFormData } from "~/lib/schemas/make"
import { createMakeColumns } from "~/components/makes/columns"

export const makeCrudConfig: CrudConfig<Make, MakeFormData> = {
  entityName: "Make",
  entityNamePlural: "Vehicle Makes",
  entityDescription: "Manage vehicle manufacturers and brands in your inventory.",
  
  schema: makeFormSchema,
  defaultValues: defaultMakeValues,
  
  columns: createMakeColumns,
  
  renderForm: ({ register, errors, watch, setValue }: FormRenderProps<MakeFormData>) => {
    const logoUrl = watch("logo")
    
    return (
      <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-2">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
            <p className="text-sm text-gray-500">Enter the basic details for this vehicle make.</p>
          </div>
          
          {/* Make Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Make Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Toyota, Honda, BMW..."
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the vehicle make..."
              rows={2}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Optional description about the vehicle manufacturer (max 500 characters)
            </p>
          </div>
        </div>

        {/* Logo Upload Section */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-base font-semibold text-gray-900">Logo Image</h3>
            <p className="text-sm text-gray-500">Upload a logo image for this vehicle make.</p>
          </div>

          <div className="space-y-2">
            <ImageUploadDropzone
              onUploadSuccess={(url: string) => setValue("logo", url)}
              currentImageUrl={logoUrl}
              className="h-32"
            />
            {errors.logo && (
              <p className="text-sm text-red-600">{errors.logo.message}</p>
            )}
          </div>
        </div>
      </div>
    )
  },
  
  searchFields: ["name", "description"],
  
  canDelete: (make) => (make.vehicleCount || 0) === 0,
  
  deleteWarning: (make) => 
    (make.vehicleCount || 0) > 0 
      ? `Please reassign or remove all ${make.vehicleCount} vehicle${make.vehicleCount !== 1 ? "s" : ""} from this make before deleting.`
      : null,
}
