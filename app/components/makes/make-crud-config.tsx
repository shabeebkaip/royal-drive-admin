import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { ImageUploadDropzone } from "~/components/shared/image-upload-dropzone"
import type { CrudConfig, FormRenderProps } from "~/components/crud"
import type { Make } from "~/types/make"
import { makeFormSchema, defaultMakeValues, type MakeFormData } from "~/lib/schemas/make"
import { createMakeColumns } from "~/components/makes/columns"
import { useMakes } from "./use-makes"

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
      <div className="space-y-6">
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

        {/* Logo Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Logo Image</Label>
          <ImageUploadDropzone
            onUploadSuccess={(url: string) => setValue("logo", url)}
            currentImageUrl={logoUrl}
          />
          {errors.logo && (
            <p className="text-sm text-red-600">{errors.logo.message}</p>
          )}
        </div>
      </div>
    )
  },
  
  searchFields: ["name"],
  
  canDelete: (make) => (make.vehicleCount || 0) === 0,
  
  deleteWarning: (make) => 
    (make.vehicleCount || 0) > 0 
      ? `Please reassign or remove all ${make.vehicleCount} vehicle${make.vehicleCount !== 1 ? "s" : ""} from this make before deleting.`
      : null,

  // Enhanced configuration for status filtering and additional features
  supportsStatusFilter: true,
  supportsAdvancedSearch: true,
}
