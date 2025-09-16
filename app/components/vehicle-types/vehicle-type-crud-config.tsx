import { z } from "zod"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { ImageUploadDropzone } from "~/components/shared/image-upload-dropzone"
import type { CrudConfig } from "~/components/crud"
import type { VehicleType } from "~/types/vehicle-type"
import { vehicleTypeFormSchema, type VehicleTypeFormData, defaultVehicleTypeValues } from "~/lib/schemas/vehicle-type"
import { createVehicleTypeColumns } from "./columns"

export const vehicleTypeCrudConfig: CrudConfig<VehicleType, VehicleTypeFormData> = {
  // Entity configuration
  entityName: "Vehicle Type",
  entityNamePlural: "Vehicle Types",
  entityDescription: "Manage vehicle categories and body types for your inventory",

  // Schema and validation
  schema: vehicleTypeFormSchema,
  defaultValues: defaultVehicleTypeValues,

  // Table configuration
  columns: createVehicleTypeColumns,
  
  // Form configuration
  renderForm: ({ register, errors, watch, setValue }) => {
    const iconUrl = watch("icon")
    
    return (
      <div className="space-y-6">
        {/* Vehicle Type Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Vehicle Type Name *</Label>
          <Input
            id="name"
            placeholder="Enter vehicle type name (e.g., SUV, Sedan, Hatchback)"
            {...register("name")}
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Icon Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Icon Image</Label>
          <ImageUploadDropzone
            onUploadSuccess={(url: string) => setValue("icon", url)}
            currentImageUrl={iconUrl}
          />
          {errors.icon && (
            <p className="text-sm text-red-600">{errors.icon.message}</p>
          )}
        </div>
      </div>
    )
  },

  // Optional customizations
  searchFields: ["name"],
  deleteWarning: (entity) => {
    if (entity.vehicleCount && entity.vehicleCount > 0) {
      return `This vehicle type is currently used by ${entity.vehicleCount} vehicle${entity.vehicleCount !== 1 ? 's' : ''}. Deleting it may affect those vehicles.`
    }
    return null
  },
  canDelete: (entity) => (entity.vehicleCount || 0) === 0,
  
  // Enhanced features
  supportsStatusFilter: true,
  supportsAdvancedSearch: false,
  supportsBulkActions: false,
}
