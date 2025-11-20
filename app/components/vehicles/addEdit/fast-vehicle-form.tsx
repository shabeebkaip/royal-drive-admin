import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { ChevronDown, Zap, Save, X } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { makesApiService } from "~/components/makes/makes-api"
import { modelsApiService } from "~/components/models/models-api"
import { fuelTypesApiService } from "~/components/fuel-types/fuel-types-api"
import { transmissionsApiService } from "~/components/transmissions/transmissions-api"
import { statusesApiService } from "~/services/statusesService"

// Minimal schema - only essentials required
const fastEntrySchema = z.object({
  // REQUIRED
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  listPrice: z.number().min(0, "Price must be positive"),
  licensingPrice: z.number().min(0, "Licensing price cannot be negative").default(70),
  images: z.array(z.string()).min(1, "At least one image is required"),
  
  // OPTIONAL WITH DEFAULTS
  mileage: z.number().optional(),
  exteriorColor: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  condition: z.enum(["new", "used", "certified-pre-owned"]).default("used"),
  
  // Advanced (Optional)
  vin: z.string().optional(),
  trim: z.string().optional(),
  engineSize: z.number().optional(),
  drivetrain: z.string().optional(),
  interiorColor: z.string().optional(),
  doors: z.number().optional(),
  seatingCapacity: z.number().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  
  // Auto-populated defaults
  status: z.string().default("available"),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
})

type FastEntryData = z.infer<typeof fastEntrySchema>

type FastVehicleFormProps = {
  initialData?: Partial<FastEntryData>
  onSubmit: (data: any) => void
  isLoading?: boolean
  mode: "add" | "edit"
}

export function FastVehicleForm({ initialData, onSubmit, isLoading = false, mode }: FastVehicleFormProps) {
  const [makes, setMakes] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [fuelTypes, setFuelTypes] = useState<any[]>([])
  const [transmissions, setTransmissions] = useState<any[]>([])
  const [statuses, setStatuses] = useState<any[]>([])
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1990 + 2 }, (_, i) => currentYear + 1 - i)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FastEntryData>({
    resolver: zodResolver(fastEntrySchema),
    defaultValues: {
      condition: "used",
      inStock: true,
      featured: false,
      ...initialData,
    },
  })

  const selectedMake = watch("make")
  const images = watch("images") || []
  const watchedPrice = watch("listPrice")
  const watchedYear = watch("year")
  const watchedMake = watch("make")
  const watchedModel = watch("model")

  // Load all dropdown data in parallel
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoadingData(true)
        const [makesRes, fuelRes, transRes, statusRes] = await Promise.all([
          makesApiService.getAllWithFilters({ active: true, sortBy: 'name', sortOrder: 'asc', limit: 1000 }),
          fuelTypesApiService.getForDropdown(),
          transmissionsApiService.getDropdownItems(),
          statusesApiService.getActiveForDropdown(),
        ])
        
        setMakes(makesRes.data || [])
        setFuelTypes(fuelRes.data || [])
        setTransmissions(transRes.data || [])
        setStatuses(statusRes.data || [])
        
        // Set default status to "Available"
        const availableStatus = (statusRes.data || []).find((s: any) => 
          s.slug === 'available' || s.name.toLowerCase() === 'available'
        )
        if (availableStatus && !initialData?.status) {
          setValue("status", availableStatus._id)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoadingData(false)
      }
    }
    loadAllData()
  }, [])

  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([])
        return
      }

      try {
        const selectedMakeObj = makes.find(m => m._id === selectedMake || m.id === selectedMake)
        if (!selectedMakeObj) return

        const makeId = selectedMakeObj._id || selectedMakeObj.id
        const response = await modelsApiService.getAllWithFilters({
          make: makeId,
          active: true,
          sortBy: 'name',
          sortOrder: 'asc',
          limit: 1000
        })
        setModels(response.data || [])
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    }

    if (makes.length > 0 && selectedMake) {
      fetchModels()
    }
  }, [selectedMake, makes])

  const handleFastSubmit = (data: FastEntryData) => {
    // Transform to match backend expected format
    const transformed = {
      make: data.make,
      model: data.model,
      year: data.year,
      trim: data.trim || "",
      vin: data.vin || "",
      type: "sedan", // Default - can be enhanced later
      condition: data.condition,
      
      // Engine
      engineSize: data.engineSize || 2.0,
      cylinders: 4, // Default
      fuelType: data.fuelType || fuelTypes[0]?._id,
      transmissionType: data.transmission || transmissions[0]?._id,
      drivetrain: data.drivetrain || "fwd",
      
      // Mileage
      odometerValue: data.mileage || 0,
      odometerIsAccurate: true,
      
      // Physical
      exteriorColor: data.exteriorColor || "Unknown",
      interiorColor: data.interiorColor || "Unknown",
      doors: data.doors || 4,
      seatingCapacity: data.seatingCapacity || 5,
      
      // Pricing
      listPrice: data.listPrice,
      
      // History
      numberOfPreviousOwners: 1,
      accidentHistory: false,
      hasCleanHistory: true,
      
      // Status
      status: data.status || statuses[0]?._id,
      inStock: data.inStock,
      
      // Marketing
      description: data.description || `${watchedYear} ${watchedMake} ${watchedModel}`,
      featured: data.featured,
      specialOffer: "",
      
      // Media
      images: data.images,
      
      // Ontario
      safetyStandardPassed: false,
      
      // Internal
      acquisitionDate: new Date().toISOString().split('T')[0],
      acquisitionCost: undefined,
      notes: "",
      assignedSalesperson: "",
      
      carfaxReportUrl: "",
    }
    
    onSubmit(transformed)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit(handleFastSubmit)()
      }
    }
    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [handleSubmit])

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFastSubmit)} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Quick Add Vehicle
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the essentials. Everything else has smart defaults.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+Enter</kbd> to save
        </div>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <CardTitle>Essential Information</CardTitle>
          <CardDescription>Only 5 required fields - we'll handle the rest!</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Vehicle Identity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1">
                Make <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("make", value)
                  setValue("model", "")
                }}
                defaultValue={initialData?.make}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((make) => (
                    <SelectItem key={make._id || make.id} value={make._id || make.id}>
                      {make.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.make && <p className="text-xs text-red-600">{errors.make.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1">
                Model <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("model", value)}
                disabled={!selectedMake}
                defaultValue={initialData?.model}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedMake ? "Select model" : "Select make first"} />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model._id || model.id} value={model._id || model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model && <p className="text-xs text-red-600">{errors.model.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1">
                Year <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("year", parseInt(value))}
                defaultValue={initialData?.year?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-xs text-red-600">{errors.year.message}</p>}
            </div>
          </div>

          {/* Price */}
          <div className="max-w-md">
            <Label className="text-sm font-semibold flex items-center gap-1">
              Selling Price (CAD) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              {...register("listPrice", { valueAsNumber: true })}
              placeholder="25000"
              className="text-lg font-medium mt-2"
            />
            {watchedPrice && (
              <p className="text-sm text-gray-600 mt-1">
                ${watchedPrice.toLocaleString()} CAD
              </p>
            )}
            {errors.listPrice && <p className="text-xs text-red-600 mt-1">{errors.listPrice.message}</p>}
          </div>

          {/* Quick Details */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Details (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Mileage (km)</Label>
                <Input
                  type="number"
                  {...register("mileage", { valueAsNumber: true })}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Exterior Color</Label>
                <Input
                  {...register("exteriorColor")}
                  placeholder="Black, White, Silver..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Transmission</Label>
                <Select onValueChange={(value) => setValue("transmission", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((t) => (
                      <SelectItem key={t._id || t.id} value={t._id || t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Fuel Type</Label>
                <Select onValueChange={(value) => setValue("fuelType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((f) => (
                      <SelectItem key={f._id || f.id} value={f._id || f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Condition</Label>
                <Select
                  onValueChange={(value) => setValue("condition", value as any)}
                  defaultValue="used"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="certified-pre-owned">Certified Pre-Owned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="border-t pt-6">
            <Label className="text-sm font-semibold flex items-center gap-1 mb-4">
              Vehicle Images <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-gray-500 ml-2">(At least 1 required)</span>
            </Label>
            <ImageUpload
              images={images}
              onImagesChange={(newImages) => setValue("images", newImages)}
              maxImages={15}
              disabled={isLoading}
            />
            {errors.images && <p className="text-xs text-red-600 mt-2">{errors.images.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Options (Collapsible) */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <Card>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setAdvancedOpen(!advancedOpen)}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Advanced Options
                  <span className="text-xs font-normal text-gray-500">(All Optional)</span>
                </CardTitle>
                <CardDescription>Additional details for complete listing</CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="space-y-6 border-t">
              {/* VIN */}
              <div className="pt-6">
                <Label className="text-sm font-semibold">VIN (Optional)</Label>
                <Input
                  {...register("vin")}
                  placeholder="17-character VIN"
                  maxLength={17}
                  className="mt-2"
                />
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Trim</Label>
                  <Input {...register("trim")} placeholder="SE, EX, Limited..." />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Engine Size (L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("engineSize", { valueAsNumber: true })}
                    placeholder="2.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Interior Color</Label>
                  <Input {...register("interiorColor")} placeholder="Black, Beige..." />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Number of Doors</Label>
                  <Input
                    type="number"
                    {...register("doors", { valueAsNumber: true })}
                    placeholder="4"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm">Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Describe the vehicle's features and condition..."
                  rows={3}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white py-4 border-t">
        <Button type="button" variant="outline" disabled={isLoading} onClick={() => window.history.back()}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} size="lg" className="min-w-[150px]">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {mode === "add" ? "Add Vehicle" : "Update Vehicle"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
