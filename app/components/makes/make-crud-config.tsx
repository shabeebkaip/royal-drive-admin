import { Car } from "lucide-react"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import type { CrudConfig, FormRenderProps } from "~/components/crud"
import type { Make, MakeFormData } from "~/types/make"
import { makeFormSchema, defaultMakeValues } from "~/types/make"
import { createMakeColumns } from "~/components/makes/columns"

export const makeCrudConfig: CrudConfig<Make, MakeFormData> = {
  entityName: "Make",
  entityNamePlural: "Vehicle Makes",
  entityDescription: "Manage vehicle manufacturers and brands in your inventory.",
  
  schema: makeFormSchema,
  defaultValues: defaultMakeValues,
  
  columns: createMakeColumns,
  
  renderForm: ({ register, errors, watch }: FormRenderProps<MakeFormData>) => {
    const logoUrl = watch("logo")
    
    return (
      <>
        {/* Make Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Make Name *</Label>
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

        {/* Logo URL */}
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL (Optional)</Label>
          <Input
            id="logo"
            {...register("logo")}
            placeholder="https://example.com/logo.png"
            type="url"
          />
          {errors.logo && (
            <p className="text-sm text-red-600">{errors.logo.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Paste a URL to the make's logo image
          </p>
        </div>

        {/* Logo Preview */}
        {logoUrl && (
          <div className="space-y-2">
            <Label>Logo Preview</Label>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-12 w-12 object-contain bg-white p-2 rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Logo Preview</p>
                <p className="text-xs text-gray-500 truncate">{logoUrl}</p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  },
  
  searchFields: ["name"],
  
  canDelete: (make) => (make.vehicleCount || 0) === 0,
  
  deleteWarning: (make) => 
    (make.vehicleCount || 0) > 0 
      ? `Please reassign or remove all ${make.vehicleCount} vehicle${make.vehicleCount !== 1 ? "s" : ""} from this make before deleting.`
      : null,
}
