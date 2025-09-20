import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import type { CrudConfig, FormRenderProps } from "~/components/crud"
import type { FuelType } from "~/types/fuel-type"
import { fuelTypeSchema, defaultFuelTypeValues, type FuelTypeFormData } from "~/lib/schemas"
import { createFuelTypeColumns } from "./columns"

export const fuelTypeCrudConfig: CrudConfig<FuelType, FuelTypeFormData> = {
  entityName: "Fuel Type",
  entityNamePlural: "Fuel Types",
  entityDescription: "Manage fuel types in your inventory (Petrol, Electric, Hybrid, etc.)",
  
  schema: fuelTypeSchema,
  defaultValues: defaultFuelTypeValues,
  
  columns: createFuelTypeColumns,
  
  renderForm: ({ register, errors, watch, setValue }: FormRenderProps<FuelTypeFormData>) => {
    const activeValue = watch("active")
    
    return (
      <div className="space-y-6">
        {/* Fuel Type Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Fuel Type Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., Petrol, Electric, Hybrid, Diesel..."
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Name can only contain letters, numbers, spaces, and hyphens
          </p>
        </div>

        {/* Active Status */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={activeValue}
              onCheckedChange={(checked) => setValue("active", checked as boolean)}
            />
            <Label htmlFor="active" className="text-sm font-medium">
              Active
            </Label>
          </div>
          <p className="text-xs text-gray-500">
            Active fuel types are available for vehicle selection
          </p>
        </div>
      </div>
    )
  },
  
  // Validation for search
  searchFields: ["name", "slug"],
  
  // Enhanced features
  supportsStatusFilter: true,
  supportsAdvancedSearch: false,
  supportsBulkActions: false,
  
  // Optional customizations
  deleteWarning: (entity: FuelType) => `Are you sure you want to delete "${entity.name}"? This action cannot be undone.`,
  canDelete: (entity: FuelType) => !entity.vehicleCount || entity.vehicleCount === 0,
}
