import { useState } from "react"
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
import { vehicleFormSchema, defaultVehicleValues, type VehicleFormData } from "./schema"

type VehicleFormProps = {
  initialData?: Partial<VehicleFormData>
  onSubmit: (data: VehicleFormData) => void
  isLoading?: boolean
  mode: "add" | "edit"
}

export function VehicleForm({ initialData, onSubmit, isLoading = false, mode }: VehicleFormProps) {
  const [customMake, setCustomMake] = useState("")
  const [customModel, setCustomModel] = useState("")
  
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

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1990 + 3 }, (_, i) => currentYear + 2 - i)

  // Popular vehicle makes
  const vehicleMakes = [
    "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", 
    "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", 
    "Kia", "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "MINI", 
    "Mitsubishi", "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", 
    "Volkswagen", "Volvo", "Other"
  ]

  // Watch the selected make to update available models
  const selectedMake = watch("make")
  const selectedModel = watch("model")

  // Vehicle models by make - simplified list of popular models
  const vehicleModels: Record<string, string[]> = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Tacoma", "Tundra", "4Runner", "Sienna", "Avalon"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Ridgeline", "HR-V", "Passport", "Insight"],
    "Ford": ["F-150", "Escape", "Explorer", "Mustang", "Edge", "Expedition", "Fusion", "Focus", "Ranger"],
    "Chevrolet": ["Silverado", "Equinox", "Malibu", "Traverse", "Tahoe", "Suburban", "Camaro", "Corvette", "Cruze"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano", "Armada", "Frontier", "Titan", "Leaf"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "X1", "7 Series", "4 Series", "X7", "Z4"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS", "A-Class", "CLA", "G-Class"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3", "A8", "TT", "R8"],
    "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Kona", "Veloster", "Genesis"],
    "Kia": ["Forte", "Optima", "Sorento", "Sportage", "Telluride", "Soul", "Stinger", "Rio"],
    "Subaru": ["Outback", "Forester", "Impreza", "Legacy", "Crosstrek", "Ascent", "WRX", "BRZ"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-3", "CX-30", "MX-5 Miata"],
    "Volkswagen": ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Beetle", "Arteon"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
    "Lexus": ["ES", "RX", "NX", "GX", "LX", "IS", "LS", "LC"],
    "Acura": ["TLX", "MDX", "RDX", "ILX", "NSX", "TLX Type S"],
    "Infiniti": ["Q50", "QX60", "QX80", "Q60", "QX50", "Q70"],
    "Cadillac": ["Escalade", "XT5", "XT6", "CT5", "CT4", "XTS"],
    "Lincoln": ["Navigator", "Aviator", "Corsair", "Nautilus", "Continental"],
    "Buick": ["Enclave", "Encore", "Envision", "Regal", "LaCrosse"],
    "GMC": ["Sierra", "Acadia", "Terrain", "Yukon", "Canyon", "Savana"],
    "Ram": ["1500", "2500", "3500", "ProMaster", "ProMaster City"],
    "Dodge": ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan"],
    "Chrysler": ["Pacifica", "300", "Voyager"],
    "Mitsubishi": ["Outlander", "Eclipse Cross", "Mirage", "Outlander Sport"],
    "Volvo": ["XC90", "XC60", "XC40", "S60", "S90", "V60", "V90"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718"],
    "Jaguar": ["F-PACE", "E-PACE", "I-PACE", "XE", "XF", "XJ", "F-TYPE"],
    "Land Rover": ["Range Rover", "Range Rover Sport", "Discovery", "Defender", "Evoque"],
    "MINI": ["Cooper", "Countryman", "Clubman", "Convertible"],
    "Genesis": ["G90", "G80", "G70", "GV80", "GV70"],
    "Other": ["Custom Model"]
  }

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
              <Select 
                onValueChange={(value) => {
                setValue("make", value)
                setValue("model", "") // Reset model when make changes
              }}
                defaultValue={initialData?.make}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleMakes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.make && <p className="text-sm text-red-600">{errors.make.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Select 
                onValueChange={(value) => setValue("model", value)}
                disabled={!selectedMake}
                defaultValue={initialData?.model}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedMake ? "Select model" : "Select make first"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedMake && vehicleModels[selectedMake] ? (
                    <>
                      {vehicleModels[selectedMake].map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other / Custom Model</SelectItem>
                    </>
                  ) : (
                    selectedMake && (
                      <SelectItem value="Other">Other / Custom Model</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.model && <p className="text-sm text-red-600">{errors.model.message}</p>}
            </div>

            {/* Custom Make Input (when Other is selected) */}
            {selectedMake === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="customMake">Custom Make *</Label>
                <Input
                  id="customMake"
                  value={customMake}
                  placeholder="Enter custom make..."
                  onChange={(e) => {
                    setCustomMake(e.target.value)
                    setValue("make", e.target.value)
                  }}
                />
              </div>
            )}

            {/* Custom Model Input (when Other is selected) */}
            {selectedModel === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="customModel">Custom Model *</Label>
                <Input
                  id="customModel"
                  value={customModel}
                  placeholder="Enter custom model..."
                  onChange={(e) => {
                    setCustomModel(e.target.value)
                    setValue("model", e.target.value)
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select onValueChange={(value) => setValue("year", parseInt(value))}>
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
              <Label htmlFor="bodyType">Body Type *</Label>
              <Select onValueChange={(value) => setValue("bodyType", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="coupe">Coupe</SelectItem>
                  <SelectItem value="hatchback">Hatchback</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="convertible">Convertible</SelectItem>
                  <SelectItem value="wagon">Wagon</SelectItem>
                  <SelectItem value="crossover">Crossover</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.bodyType && <p className="text-sm text-red-600">{errors.bodyType.message}</p>}
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
              <Select onValueChange={(value) => setValue("fuelType", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="plug-in-hybrid">Plug-in Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && <p className="text-sm text-red-600">{errors.fuelType.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transmissionType">Transmission *</Label>
              <Select onValueChange={(value) => setValue("transmissionType", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
              {errors.transmissionType && <p className="text-sm text-red-600">{errors.transmissionType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="drivetrain">Drivetrain *</Label>
              <Select onValueChange={(value) => setValue("drivetrain", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select drivetrain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fwd">Front-Wheel Drive (FWD)</SelectItem>
                  <SelectItem value="rwd">Rear-Wheel Drive (RWD)</SelectItem>
                  <SelectItem value="awd">All-Wheel Drive (AWD)</SelectItem>
                  <SelectItem value="4wd">4-Wheel Drive (4WD)</SelectItem>
                </SelectContent>
              </Select>
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
              <Select onValueChange={(value) => setValue("condition", value as any)}>
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
              onCheckedChange={(checked) => setValue("accidentHistory", !!checked)}
            />
            <Label htmlFor="accidentHistory">Vehicle has accident history</Label>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Set pricing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listPrice">List Price (CAD) *</Label>
              <Input
                id="listPrice"
                type="number"
                {...register("listPrice", { valueAsNumber: true })}
                placeholder="25000"
              />
              {errors.listPrice && <p className="text-sm text-red-600">{errors.listPrice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="msrp">MSRP (CAD)</Label>
              <Input
                id="msrp"
                type="number"
                {...register("msrp", { valueAsNumber: true })}
                placeholder="28000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dealerCost">Dealer Cost (CAD)</Label>
              <Input
                id="dealerCost"
                type="number"
                {...register("dealerCost", { valueAsNumber: true })}
                placeholder="22000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Specifications</CardTitle>
          <CardDescription>Colors and physical details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label htmlFor="stockNumber">Stock Number *</Label>
              <Input
                id="stockNumber"
                {...register("stockNumber")}
                placeholder="STK001"
              />
              {errors.stockNumber && <p className="text-sm text-red-600">{errors.stockNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionDate">Acquisition Date *</Label>
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
              onCheckedChange={(checked) => setValue("featured", !!checked)}
            />
            <Label htmlFor="featured">Feature this vehicle on the homepage</Label>
          </div>
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
              <Select onValueChange={(value) => setValue("status", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
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
                  onCheckedChange={(checked) => setValue("safetyStandardPassed", !!checked)}
                />
                <Label htmlFor="safetyStandardPassed">Safety standard certification passed</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCleanHistory"
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
