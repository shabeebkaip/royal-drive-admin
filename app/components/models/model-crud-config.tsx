import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import type { CrudConfig, FormRenderProps } from "~/components/crud"
import type { Model } from "~/types/model"
import { modelFormSchema, defaultModelValues, type ModelFormData } from "~/lib/schemas/model"
import { createModelColumns } from "~/components/models/columns"
import { useModels } from "./use-models"
import { useEffect, useState } from "react"
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
    const [isLoadingMakes, setIsLoadingMakes] = useState(true)
    const [isLoadingVehicleTypes, setIsLoadingVehicleTypes] = useState(true)
    
    const selectedMake = watch("make")
    const selectedVehicleType = watch("vehicleType")
    
    // Initialize form values from entity data when editing
    useEffect(() => {
      if (formData) {
        // When editing, formData contains the full Model entity
        // We need to extract the IDs for the dropdowns
        const entityData = formData as any // The actual Model entity
        
        let makeId = ""
        let vehicleTypeId = ""
        
        // Extract make ID
        if (entityData.make) {
          if (typeof entityData.make === 'string') {
            makeId = entityData.make
          } else if (entityData.make.id) {
            makeId = entityData.make.id
          }
        }
        
        // Extract vehicle type ID
        if (entityData.vehicleType) {
          if (typeof entityData.vehicleType === 'string') {
            vehicleTypeId = entityData.vehicleType
          } else if (entityData.vehicleType.id) {
            vehicleTypeId = entityData.vehicleType.id
          }
        }
        
        // Set the form values
        if (makeId) setValue("make", makeId)
        if (vehicleTypeId) setValue("vehicleType", vehicleTypeId)
      }
    }, [formData, setValue])
    
    // Load makes and vehicle types for dropdowns
    useEffect(() => {
      const loadMakes = async () => {
        try {
          setIsLoadingMakes(true)
          const response = await makesApiService.getAllWithFilters({
            active: true,
            sortBy: 'name',
            sortOrder: 'asc',
            limit: 100 // Get all active makes
          })
          setMakes(response.data || [])
        } catch (error) {
          console.error('Failed to load makes:', error)
        } finally {
          setIsLoadingMakes(false)
        }
      }
      
      const loadVehicleTypes = async () => {
        try {
          setIsLoadingVehicleTypes(true)
          const response = await vehicleTypesApiService.getAllWithFilters({
            active: true,
            sortBy: 'name',
            sortOrder: 'asc',
            limit: 100 // Get all active vehicle types
          })
          setVehicleTypes(response.data || [])
        } catch (error) {
          console.error('Failed to load vehicle types:', error)
        } finally {
          setIsLoadingVehicleTypes(false)
        }
      }
      
      loadMakes()
      loadVehicleTypes()
    }, [])
    
    return (
      <div className="space-y-6">
        {/* Model Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Model Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., A4, 3 Series, Civic, Camry..."
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Make Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Make *</Label>
          <Select
            value={selectedMake}
            onValueChange={(value) => setValue("make", value)}
            disabled={isLoadingMakes}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingMakes ? "Loading makes..." : "Select a make"} />
            </SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make.id} value={make.id}>
                  {make.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && (
            <p className="text-sm text-red-600">{errors.make.message}</p>
          )}
        </div>

        {/* Vehicle Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle Type *</Label>
          <Select
            value={selectedVehicleType}
            onValueChange={(value) => setValue("vehicleType", value)}
            disabled={isLoadingVehicleTypes}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingVehicleTypes ? "Loading vehicle types..." : "Select a vehicle type"} />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((vehicleType) => (
                <SelectItem key={vehicleType.id} value={vehicleType.id}>
                  {vehicleType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicleType && (
            <p className="text-sm text-red-600">{errors.vehicleType.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Brief description of this model (optional)"
            className="min-h-[80px]"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
          <p className="text-xs text-gray-500">
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

  // Enhanced configuration for status filtering and additional features
  supportsStatusFilter: true,
  supportsAdvancedSearch: true,
}
