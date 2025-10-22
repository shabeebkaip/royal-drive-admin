import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { SearchableDropdown } from "~/components/ui/searchable-dropdown"
import type { CrudConfig, FormRenderProps } from "~/components/crud"
import type { Model } from "~/types/model"
import { modelFormSchema, defaultModelValues, type ModelFormData } from "~/lib/schemas/model"
import { createModelColumns } from "~/components/models/columns"
import { useEffect, useState, useMemo } from "react"
import { makesApiService } from "~/components/makes/makes-api"
import { vehicleTypesApiService } from "~/components/vehicle-types/vehicle-types-api"
import type { Make } from "~/types/make"
import type { VehicleType } from "~/types/vehicle-type"

export const modelCrudConfig: CrudConfig<Model, ModelFormData> = {
  entityName: "Model",
  entityNamePlural: "Vehicle Models",
  entityDescription: "Manage vehicle models that connect makes and vehicle types in your inventory.",
  
  schema: modelFormSchema,
  defaultValues: defaultModelValues,
  
  columns: createModelColumns,
  
  renderForm: ({ register, errors, watch, setValue, formData }: FormRenderProps<ModelFormData>) => {
    const [makes, setMakes] = useState<Make[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [loadingMakes, setLoadingMakes] = useState(true)
    const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(true)
    
    // Watch form values
    const makeValue = watch("make")
    const vehicleTypeValue = watch("vehicleType")

    console.log('🔍 Form Values:', {
      name: watch("name"),
      make: makeValue,
      vehicleType: vehicleTypeValue,
      description: watch("description"),
      formData
    })

    // Initialize form with populated data on edit
    useEffect(() => {
      if (formData) {
        console.log('📝 Initializing form with data:', formData)
        
        // Extract ID from make (could be string or populated object)
        const makeId = typeof formData.make === 'string' 
          ? formData.make 
          : (formData.make as any)?._id || (formData.make as any)?.id || ''
        
        // Extract ID from vehicleType (could be string or populated object)
        const vehicleTypeId = typeof formData.vehicleType === 'string'
          ? formData.vehicleType
          : (formData.vehicleType as any)?._id || (formData.vehicleType as any)?.id || ''
        
        console.log('📝 Extracted IDs:', { makeId, vehicleTypeId })
        
        // Set form values with extracted IDs
        if (makeId) {
          setValue("make", String(makeId), { shouldValidate: false })
        }
        if (vehicleTypeId) {
          setValue("vehicleType", String(vehicleTypeId), { shouldValidate: false })
        }
      }
    }, [formData, setValue])

  // No custom lists; use raw items with mappers
  const getMakeLabel = (m: any) => m?.name ?? ""
  const getMakeValue = (m: any) => String(m?._id ?? m?.id ?? "")
  const getTypeLabel = (t: any) => t?.name ?? ""
  const getTypeValue = (t: any) => String(t?._id ?? t?.id ?? "")

    // Load makes on mount
    useEffect(() => {
      const fetchMakes = async () => {
        try {
          setLoadingMakes(true)
          console.log('🔄 Fetching makes...')
          const response = await makesApiService.getAllWithFilters({
            active: true,
            sortBy: 'name',
            sortOrder: 'asc',
            limit: 100
          })
          console.log('✅ Makes loaded:', response.data?.length || 0)
          setMakes(response.data || [])
        } catch (error) {
          console.error('❌ Error loading makes:', error)
        } finally {
          setLoadingMakes(false)
        }
      }
      fetchMakes()
    }, [])

    // Load vehicle types on mount
    useEffect(() => {
      const fetchVehicleTypes = async () => {
        try {
          setLoadingVehicleTypes(true)
          console.log('🔄 Fetching vehicle types...')
          const response = await vehicleTypesApiService.getAllWithFilters({
            active: true,
            sortBy: 'name',
            sortOrder: 'asc',
            limit: 100
          })
          console.log('✅ Vehicle types loaded:', response.data?.length || 0)
          setVehicleTypes(response.data || [])
        } catch (error) {
          console.error('❌ Error loading vehicle types:', error)
        } finally {
          setLoadingVehicleTypes(false)
        }
      }
      fetchVehicleTypes()
    }, [])
    
    return (
      <div className="space-y-6">
        {/* Model Name - Required */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Model Name *
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., Camry, Civic, A4..."
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Make Selection - Required */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Make *</Label>
          <SearchableDropdown
            items={makes}
            getOptionLabel={getMakeLabel}
            getOptionValue={getMakeValue}
            value={makeValue || ""}
            onValueChange={(value) => {
              console.log('✅ Make selected:', value)
              console.log('📝 Setting make value...')
              // Coerce to string to satisfy schema and ensure watch updates
              setValue("make", String(value), { shouldValidate: true, shouldDirty: true })
              console.log('✅ Make value set to:', value)
            }}
            placeholder="Select a make"
            searchPlaceholder="Search makes..."
            emptyText="No make found"
            loading={loadingMakes}
            disabled={loadingMakes}
            allowClear
          />
          {errors.make && (
            <p className="text-sm text-red-600">{errors.make.message}</p>
          )}
        </div>

        {/* Vehicle Type Selection - Required */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle Type *</Label>
          <SearchableDropdown
            items={vehicleTypes}
            getOptionLabel={getTypeLabel}
            getOptionValue={getTypeValue}
            value={vehicleTypeValue || ""}
            onValueChange={(value) => {
              console.log('✅ Vehicle Type selected:', value)
              console.log('📝 Setting vehicleType value...')
              // Coerce to string to satisfy schema and ensure watch updates
              setValue("vehicleType", String(value), { shouldValidate: true, shouldDirty: true })
              console.log('✅ Vehicle Type value set to:', value)
            }}
            placeholder="Select a vehicle type"
            searchPlaceholder="Search vehicle types..."
            emptyText="No vehicle type found"
            loading={loadingVehicleTypes}
            disabled={loadingVehicleTypes}
            allowClear
          />
          {errors.vehicleType && (
            <p className="text-sm text-red-600">{errors.vehicleType.message}</p>
          )}
        </div>

        {/* Description - Optional */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Brief description of this model..."
            className="min-h-[80px] resize-none"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Optional description to help differentiate this model from others.
          </p>
        </div>
      </div>
    )
  },
  
  searchFields: ["name", "description"],
  
  canDelete: (model) => (model.vehicleCount || 0) === 0,
  
  deleteWarning: (model) => 
    (model.vehicleCount || 0) > 0 
      ? `Please reassign or remove all ${model.vehicleCount} vehicle${model.vehicleCount !== 1 ? "s" : ""} from this model before deleting.`
      : null,

  supportsStatusFilter: true,
  supportsAdvancedSearch: true,
}
