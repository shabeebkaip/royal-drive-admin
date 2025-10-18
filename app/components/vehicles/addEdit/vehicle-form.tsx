import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Checkbox } from "~/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { SearchableDropdown } from "~/components/ui/searchable-dropdown"
import { vehicleFormSchema, defaultVehicleValues, type VehicleFormData } from "./schema"
import { ImageUpload } from "./image-upload"
import { makesApiService } from "~/components/makes/makes-api"
import { modelsApiService } from "~/components/models/models-api"
import { vehicleTypesApiService } from "~/components/vehicle-types/vehicle-types-api"
import { fuelTypesApiService } from "~/components/fuel-types/fuel-types-api"
import { transmissionsApiService } from "~/components/transmissions/transmissions-api"
import { driveTypesApiService } from "~/services/driveTypesService"
import { statusesApiService } from "~/services/statusesService"
import type { Make } from "~/types/make"
import type { Model } from "~/types/model"
import type { VehicleType } from "~/types/vehicle-type"
import type { FuelType } from "~/types/fuel-type"
import type { Transmission } from "~/types/transmission"
import type { DriveType } from "~/types/drive-type"
import type { StatusDropdownItem } from "~/types/status"

type VehicleFormProps = {
  initialData?: Partial<VehicleFormData>
  onSubmit: (data: VehicleFormData) => void
  isLoading?: boolean
  mode: "add" | "edit"
}

export function VehicleForm({ initialData, onSubmit, isLoading = false, mode }: VehicleFormProps) {
  const [customMake, setCustomMake] = useState("")
  const [customModel, setCustomModel] = useState("")

  // API Data State
  const [makes, setMakes] = useState<Make[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [fuelTypes, setFuelTypes] = useState<any[]>([]) // Using any[] for dropdown items
  const [transmissions, setTransmissions] = useState<any[]>([]) // Using any[] for dropdown items
  const [driveTypes, setDriveTypes] = useState<any[]>([]) // Using any[] for dropdown items
  const [statuses, setStatuses] = useState<StatusDropdownItem[]>([])
  const [loadingMakes, setLoadingMakes] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(true)
  const [loadingFuelTypes, setLoadingFuelTypes] = useState(true)
  const [loadingTransmissions, setLoadingTransmissions] = useState(true)
  const [loadingDriveTypes, setLoadingDriveTypes] = useState(true)
  const [loadingStatuses, setLoadingStatuses] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      ...defaultVehicleValues,
      ...initialData,
    },
  })

  // Watch the selected make to update available models
  const selectedMake = watch("make")
  const selectedModel = watch("model")
  const images = watch("images") || []

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i)

  // Fetch Makes
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingMakes(true)
        const response = await makesApiService.getAllWithFilters({
          active: true,
          sortBy: 'name',
          sortOrder: 'asc',
          limit: 1000
        })
        setMakes(response.data || [])
      } catch (error) {
        console.error('Error fetching makes:', error)
      } finally {
        setLoadingMakes(false)
      }
    }

    fetchMakes()
  }, [])

  // Fetch Vehicle Types
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoadingVehicleTypes(true)
        const response = await vehicleTypesApiService.getAllWithFilters({
          active: true,
          sortBy: 'name',
          sortOrder: 'asc',
          limit: 1000
        })
        setVehicleTypes(response.data || [])
      } catch (error) {
        console.error('Error fetching vehicle types:', error)
      } finally {
        setLoadingVehicleTypes(false)
      }
    }

    fetchVehicleTypes()
  }, [])

  // Fetch Fuel Types using dropdown endpoint
  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        setLoadingFuelTypes(true)
        const response = await fuelTypesApiService.getForDropdown()
        setFuelTypes(response.data || [])
      } catch (error) {
        console.error('Error fetching fuel types:', error)
      } finally {
        setLoadingFuelTypes(false)
      }
    }

    fetchFuelTypes()
  }, [])

  // Fetch Transmissions using dropdown endpoint
  useEffect(() => {
    const fetchTransmissions = async () => {
      try {
        setLoadingTransmissions(true)
        const response = await transmissionsApiService.getDropdownItems()
        setTransmissions(response.data || [])
      } catch (error) {
        console.error('Error fetching transmissions:', error)
      } finally {
        setLoadingTransmissions(false)
      }
    }

    fetchTransmissions()
  }, [])

  // Fetch Drive Types using dropdown endpoint
  useEffect(() => {
    const fetchDriveTypes = async () => {
      try {
        setLoadingDriveTypes(true)
        const response = await driveTypesApiService.getActiveForDropdown()
        setDriveTypes(response.data || [])
      } catch (error) {
        console.error('Error fetching drive types:', error)
      } finally {
        setLoadingDriveTypes(false)
      }
    }

    fetchDriveTypes()
  }, [])

  // Fetch Statuses using dropdown endpoint
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoadingStatuses(true)
        const response = await statusesApiService.getActiveForDropdown()
        setStatuses(response.data || [])
      } catch (error) {
        console.error('Error fetching statuses:', error)
      } finally {
        setLoadingStatuses(false)
      }
    }

    fetchStatuses()
  }, [])

  // Fetch Models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([])
        return
      }

      try {
        setLoadingModels(true)
        console.log('Fetching models for make:', selectedMake)
        console.log('Available makes:', makes)

        // Find the make ID - check both id and _id fields
        // Also handle case where selectedMake is already an ObjectId (edit mode)
        let selectedMakeObj
        
        // First check if selectedMake is already an ObjectId
        if (selectedMake && selectedMake.length === 24) {
          // Likely an ObjectId, find by ID
          selectedMakeObj = makes.find(make =>
            (make as any)._id === selectedMake || make.id === selectedMake
          )
        } else {
          // Assume it's a name, find by name
          selectedMakeObj = makes.find(make =>
            make.name === selectedMake ||
            make.name?.toLowerCase() === selectedMake.toLowerCase()
          )
        }

        console.log('Selected make object:', selectedMakeObj)

        if (!selectedMakeObj) {
          console.warn('Make not found in API data, skipping model fetch')
          setModels([])
          return
        }

        // Use _id if available, fallback to id
        const makeId = (selectedMakeObj as any)._id || selectedMakeObj.id

        console.log('Using make ID:', makeId)

        const response = await modelsApiService.getAllWithFilters({
          make: makeId,
          active: true,
          sortBy: 'name',
          sortOrder: 'asc',
          limit: 1000
        })

        console.log('Models API response:', response)
        setModels(response.data || [])
      } catch (error) {
        console.error('Error fetching models:', error)
        setModels([])
      } finally {
        setLoadingModels(false)
      }
    }

    // Only fetch models if we have makes data and a selected make
    if (makes.length > 0 && selectedMake) {
      fetchModels()
    } else if (!selectedMake) {
      setModels([])
    }
  }, [selectedMake, makes])

  // Get display data for dropdowns - only use real API data
  const displayMakes = makes

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Vehicle Information</CardTitle>
          <CardDescription>Enter the core details about the vehicle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <SearchableDropdown
                options={displayMakes.map((make) => ({
                  label: make.name,
                  value: (make as any)._id || make.id,
                }))}
                value={selectedMake || ""}
                onValueChange={(value) => {
                  setValue("make", value)
                  setValue("model", "") // Reset model when make changes
                }}
                placeholder="Select make"
                searchPlaceholder="Search makes..."
                emptyText="No make found"
                loading={loadingMakes}
                allowClear
              />
              {errors.make && <p className="text-sm text-red-600">{errors.make.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <SearchableDropdown
                options={models.map((model) => ({
                  label: model.name,
                  value: (model as any)._id || model.id,
                }))}
                value={selectedModel || ""}
                onValueChange={(value) => setValue("model", value)}
                placeholder={selectedMake ? "Select model" : "Select make first"}
                searchPlaceholder="Search models..."
                emptyText={selectedMake ? "No model found" : "Select make first"}
                disabled={!selectedMake}
                loading={loadingModels}
                allowClear
              />
              {errors.model && <p className="text-sm text-red-600">{errors.model.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select onValueChange={(value) => setValue("year", parseInt(value))} defaultValue={initialData?.year?.toString() || undefined}>
                <SelectTrigger className="w-full">
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
              {errors.year && <p className="text-sm text-red-600">{errors.year.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trim">Trim</Label>
              <Input
                id="trim"
                {...register("trim")}
                placeholder="SE, EX, Limited..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type *</Label>
              <SearchableDropdown
                options={[
                  ...vehicleTypes.map((type) => ({
                    label: type.name,
                    value: (type as any)._id || type.id,
                  })),
                  { label: "Other", value: "other" }
                ]}
                value={watch("type") || ""}
                onValueChange={(value) => setValue("type", value as any)}
                placeholder="Select body type"
                searchPlaceholder="Search vehicle types..."
                emptyText="No vehicle type found"
                loading={loadingVehicleTypes}
                allowClear
              />
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              {...register("vin")}
              placeholder="17-character VIN"
              maxLength={17}
            />
            {errors.vin && <p className="text-sm text-red-600">{errors.vin.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Engine & Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Engine & Performance</CardTitle>
          <CardDescription>Technical specifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engineSize">Engine Size (L) *</Label>
              <Input
                id="engineSize"
                type="number"
                step="0.1"
                {...register("engineSize", { valueAsNumber: true })}
                placeholder="2.0"
              />
              {errors.engineSize && <p className="text-sm text-red-600">{errors.engineSize.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cylinders">Cylinders *</Label>
              <Input
                id="cylinders"
                type="number"
                {...register("cylinders", { valueAsNumber: true })}
                placeholder="4"
              />
              {errors.cylinders && <p className="text-sm text-red-600">{errors.cylinders.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <SearchableDropdown
                options={fuelTypes.map((fuel) => ({
                  label: fuel.name,
                  value: (fuel as any)._id || fuel.id,
                }))}
                value={watch("fuelType") || ""}
                onValueChange={(value) => setValue("fuelType", value as any)}
                placeholder="Select fuel type"
                searchPlaceholder="Search fuel types..."
                emptyText="No fuel type found"
                loading={loadingFuelTypes}
                allowClear
              />
              {errors.fuelType && <p className="text-sm text-red-600">{errors.fuelType.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transmissionType">Transmission *</Label>
              <SearchableDropdown
                options={transmissions.map((transmission) => ({
                  label: transmission.name,
                  value: (transmission as any)._id || transmission.id,
                }))}
                value={watch("transmissionType") || ""}
                onValueChange={(value) => setValue("transmissionType", value as any)}
                placeholder="Select transmission"
                searchPlaceholder="Search transmissions..."
                emptyText="No transmission found"
                loading={loadingTransmissions}
                allowClear
              />
              {errors.transmissionType && <p className="text-sm text-red-600">{errors.transmissionType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="drivetrain">Drivetrain *</Label>
              <SearchableDropdown
                options={driveTypes.map((drive) => ({
                  label: drive.name,
                  value: (drive as any)._id || drive.id,
                }))}
                value={watch("drivetrain") || ""}
                onValueChange={(value) => setValue("drivetrain", value as any)}
                placeholder="Select drivetrain"
                searchPlaceholder="Search drivetrains..."
                emptyText="No drivetrain found"
                loading={loadingDriveTypes}
                allowClear
              />
              {errors.drivetrain && <p className="text-sm text-red-600">{errors.drivetrain.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="horsepower">Horsepower</Label>
              <Input
                id="horsepower"
                type="number"
                {...register("horsepower", { valueAsNumber: true })}
                placeholder="200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition & Mileage */}
      <Card>
        <CardHeader>
          <CardTitle>Condition & Mileage</CardTitle>
          <CardDescription>Vehicle condition and usage details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select onValueChange={(value) => setValue("condition", value as any)} defaultValue={initialData?.condition || undefined}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="certified-pre-owned">Certified Pre-Owned</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && <p className="text-sm text-red-600">{errors.condition.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometerValue">Odometer Reading *</Label>
              <Input
                id="odometerValue"
                type="number"
                {...register("odometerValue", { valueAsNumber: true })}
                placeholder="50000"
              />
              {errors.odometerValue && <p className="text-sm text-red-600">{errors.odometerValue.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPreviousOwners">Previous Owners</Label>
              <Input
                id="numberOfPreviousOwners"
                type="number"
                {...register("numberOfPreviousOwners", { valueAsNumber: true })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="accidentHistory"
              checked={watch("accidentHistory")}
              onCheckedChange={(checked) => setValue("accidentHistory", !!checked)}
            />
            <Label htmlFor="accidentHistory">Vehicle has accident history</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="odometerIsAccurate"
              checked={watch("odometerIsAccurate")}
              onCheckedChange={(checked) => setValue("odometerIsAccurate", !!checked)}
            />
            <Label htmlFor="odometerIsAccurate">Odometer reading is accurate</Label>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Physical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Physical Details</CardTitle>
          <CardDescription>Set customer pricing and vehicle specifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pricing Section */}
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Pricing</h4>
            <div className="max-w-md">
              <div className="space-y-2">
                <Label htmlFor="listPrice">List Price (CAD) *</Label>
                <Input
                  id="listPrice"
                  type="number"
                  {...register("listPrice", { valueAsNumber: true })}
                  placeholder="25000"
                  className="text-lg font-medium"
                />
                <p className="text-xs text-gray-500">The selling price shown to customers on the website</p>
                {errors.listPrice && <p className="text-sm text-red-600">{errors.listPrice.message}</p>}
              </div>
            </div>
          </div>

          {/* Physical Specifications Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Physical Specifications</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exteriorColor">Exterior Color *</Label>
                  <Input
                    id="exteriorColor"
                    {...register("exteriorColor")}
                    placeholder="Black, White, Silver..."
                  />
                  {errors.exteriorColor && <p className="text-sm text-red-600">{errors.exteriorColor.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interiorColor">Interior Color *</Label>
                  <Input
                    id="interiorColor"
                    {...register("interiorColor")}
                    placeholder="Black, Beige, Gray..."
                  />
                  {errors.interiorColor && <p className="text-sm text-red-600">{errors.interiorColor.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doors">Number of Doors *</Label>
                  <Input
                    id="doors"
                    type="number"
                    {...register("doors", { valueAsNumber: true })}
                    placeholder="4"
                  />
                  {errors.doors && <p className="text-sm text-red-600">{errors.doors.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seatingCapacity">Seating Capacity *</Label>
                  <Input
                    id="seatingCapacity"
                    type="number"
                    {...register("seatingCapacity", { valueAsNumber: true })}
                    placeholder="5"
                  />
                  {errors.seatingCapacity && <p className="text-sm text-red-600">{errors.seatingCapacity.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internal Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Internal Tracking</CardTitle>
          <CardDescription>Internal dealership information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Acquisition Date</Label>
              <Input
                id="acquisitionDate"
                type="date"
                {...register("acquisitionDate")}
              />
              {errors.acquisitionDate && <p className="text-sm text-red-600">{errors.acquisitionDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acquisitionCost">Acquisition Cost (CAD)</Label>
              <Input
                id="acquisitionCost"
                type="number"
                {...register("acquisitionCost", { valueAsNumber: true })}
                placeholder="20000"
              />
              <p className="text-xs text-gray-500">Your actual cost to acquire this vehicle (used for profit calculations)</p>
              {errors.acquisitionCost && <p className="text-sm text-red-600">{errors.acquisitionCost.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedSalesperson">Assigned Salesperson</Label>
              <Input
                id="assignedSalesperson"
                {...register("assignedSalesperson")}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any internal notes about this vehicle..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketing & Description */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing & Description</CardTitle>
          <CardDescription>Public-facing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the vehicle features, condition, and selling points..."
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialOffer">Special Offer</Label>
            <Input
              id="specialOffer"
              {...register("specialOffer")}
              placeholder="Weekend Special, No Payments for 3 months..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(checked) => setValue("featured", !!checked)}
            />
            <Label htmlFor="featured">Feature this vehicle on the homepage</Label>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Images */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
          <CardDescription>Upload high-quality images of the vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onImagesChange={(newImages) => setValue("images", newImages)}
            maxImages={15}
            disabled={isLoading}
          />
          {errors.images && <p className="text-sm text-red-600">{errors.images.message}</p>}
        </CardContent>
      </Card>

      {/* Status & Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Availability</CardTitle>
          <CardDescription>Current status and availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <SearchableDropdown
                options={statuses.map((status) => ({
                  label: status.name,
                  value: status._id,
                }))}
                value={watch("status") || ""}
                onValueChange={(value) => setValue("status", value as any)}
                placeholder="Select status"
                searchPlaceholder="Search statuses..."
                emptyText="No status found"
                loading={loadingStatuses}
                allowClear
              />
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={watch("inStock")}
                onCheckedChange={(checked) => setValue("inStock", !!checked)}
              />
              <Label htmlFor="inStock">Currently in stock</Label>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Ontario Specific Requirements</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="safetyStandardPassed"
                  checked={watch("safetyStandardPassed")}
                  onCheckedChange={(checked) => setValue("safetyStandardPassed", !!checked)}
                />
                <Label htmlFor="safetyStandardPassed">Safety standard certification passed</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCleanHistory"
                  checked={watch("hasCleanHistory")}
                  onCheckedChange={(checked) => setValue("hasCleanHistory", !!checked)}
                />
                <Label htmlFor="hasCleanHistory">Clean CarFax history</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="carfaxReportUrl">CarFax Report URL</Label>
            <Input
              id="carfaxReportUrl"
              {...register("carfaxReportUrl")}
              placeholder="https://carfax.com/report/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : mode === "add" ? "Add Vehicle" : "Update Vehicle"}
        </Button>
      </div>
    </form>
  )
}
