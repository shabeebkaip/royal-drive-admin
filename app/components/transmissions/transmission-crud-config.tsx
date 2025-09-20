import type { CrudConfig } from "~/components/crud"
import type { Transmission } from "~/types/transmission"
import type { TransmissionFormData } from "~/lib/schemas"
import { transmissionSchema, defaultTransmissionValues } from "~/lib/schemas"
import { createTransmissionColumns } from "./columns"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"

export const transmissionCrudConfig: CrudConfig<Transmission, TransmissionFormData> = {
  // Entity configuration
  entityName: "Transmission",
  entityNamePlural: "Transmissions",
  entityDescription: "Manage transmission types and categories for your vehicle inventory",

  // Schema and validation
  schema: transmissionSchema,
  defaultValues: defaultTransmissionValues,

  // Table configuration
  columns: createTransmissionColumns,
  
  // Form configuration
  renderForm: ({ register, errors, watch, setValue }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Transmission Name</Label>
        <Input
          id="name"
          placeholder="Enter transmission name (e.g., Manual, Automatic, CVT)"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Examples: Manual, Automatic, CVT, Semi-Automatic
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={watch("active")}
          onCheckedChange={(checked) => setValue("active", !!checked)}
        />
        <Label htmlFor="active" className="text-sm font-normal">
          Active transmission type
        </Label>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Manual:</strong> Traditional manual transmission requiring driver to shift gears
        </p>
        <p>
          <strong>Automatic:</strong> Transmission that shifts gears automatically
        </p>
        <p>
          <strong>CVT:</strong> Continuously Variable Transmission for smooth acceleration
        </p>
        <p>
          <strong>Semi-Automatic:</strong> Manual transmission with automatic clutch
        </p>
      </div>
    </div>
  ),
  
  // Enhanced features
  supportsStatusFilter: true,
  supportsAdvancedSearch: false,
  supportsBulkActions: false,
  
  // Optional customizations
  deleteWarning: (entity: Transmission) => `Are you sure you want to delete "${entity.name}"? This action cannot be undone.`,
  canDelete: (entity: Transmission) => !entity.vehicleCount || entity.vehicleCount === 0,
}
