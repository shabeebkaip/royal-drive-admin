import { z } from "zod"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Checkbox } from "~/components/ui/checkbox"
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
    const watchedIsActive = watch("isActive")
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Vehicle Type Name *</Label>
          <Input
            id="name"
            placeholder="Enter vehicle type name (e.g., SUV, Sedan, Hatchback)"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon URL</Label>
          <Input
            id="icon"
            type="url"
            placeholder="https://example.com/icon.png (optional)"
            {...register("icon")}
          />
          {errors.icon && (
            <p className="text-sm text-red-600">{errors.icon.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of this vehicle type (optional)"
            className="min-h-[80px]"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={watchedIsActive}
            onCheckedChange={(checked) => setValue("isActive", checked as boolean)}
          />
          <Label htmlFor="isActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Active (visible in vehicle creation forms)
          </Label>
        </div>
      </div>
    )
  },

  // Optional customizations
  searchFields: ["name", "description"],
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
