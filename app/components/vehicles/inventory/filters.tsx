import { useState } from "react"
import { Search, Filter, X, ChevronDown, DollarSign, Calendar, Settings } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "~/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"
import { Separator } from "~/components/ui/separator"
import type { VehicleFilters } from "~/services/vehicleInventoryService"

// Mock data for dropdowns - these would normally come from API hooks
const makes = [
  { id: "1", name: "Toyota" },
  { id: "2", name: "Honda" },
  { id: "3", name: "Ford" },
  { id: "4", name: "Chevrolet" },
  { id: "5", name: "BMW" },
  { id: "6", name: "Mercedes-Benz" },
  { id: "7", name: "Audi" },
  { id: "8", name: "Volkswagen" },
]

const fuelTypes = [
  { id: "1", name: "Gasoline" },
  { id: "2", name: "Diesel" },
  { id: "3", name: "Hybrid" },
  { id: "4", name: "Electric" },
  { id: "5", name: "Plug-in Hybrid" },
]

const transmissions = [
  { id: "1", name: "Manual" },
  { id: "2", name: "Automatic" },
  { id: "3", name: "CVT" },
  { id: "4", name: "Semi-Automatic" },
]

const drivetrains = [
  { id: "1", name: "Front Wheel Drive" },
  { id: "2", name: "Rear Wheel Drive" },
  { id: "3", name: "All Wheel Drive" },
  { id: "4", name: "Four Wheel Drive" },
]

const statuses = [
  { id: "1", name: "Available", color: "#10b981" },
  { id: "2", name: "Sold", color: "#6b7280" },
  { id: "3", name: "Pending", color: "#f59e0b" },
  { id: "4", name: "Reserved", color: "#3b82f6" },
  { id: "5", name: "On Hold", color: "#ef4444" },
]

const vehicleTypes = [
  { id: "1", name: "Sedan", slug: "sedan" },
  { id: "2", name: "SUV", slug: "suv" },
  { id: "3", name: "Coupe", slug: "coupe" },
  { id: "4", name: "Hatchback", slug: "hatchback" },
  { id: "5", name: "Truck", slug: "truck" },
  { id: "6", name: "Van", slug: "van" },
  { id: "7", name: "Convertible", slug: "convertible" },
  { id: "8", name: "Wagon", slug: "wagon" },
  { id: "9", name: "Crossover", slug: "crossover" },
]

const conditions = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified-pre-owned", label: "Certified Pre-Owned" },
]

const sortOptions = [
  { value: "createdAt", label: "Date Added" },
  { value: "pricing.listPrice", label: "Price" },
  { value: "year", label: "Year" },
  { value: "odometer.value", label: "Mileage" },
  { value: "internal.daysInInventory", label: "Days in Inventory" },
  { value: "make", label: "Make" },
  { value: "model", label: "Model" },
]

interface VehicleInventoryFiltersProps {
  filters: VehicleFilters
  onFiltersChange: (filters: Partial<VehicleFilters>) => void
  onClearFilters: () => void
  resultCount?: number
  loading?: boolean
}

export function VehicleInventoryFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  loading = false
}: VehicleInventoryFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchQuery, setSearchQuery] = useState(filters.search || "")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // Debounce will be handled by the hook
    onFiltersChange({ search: value || undefined })
  }

  const handleFilterChange = (key: keyof VehicleFilters, value: any) => {
    onFiltersChange({ [key]: value === "" ? undefined : value })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.make) count++
    if (filters.model) count++
    if (filters.minYear || filters.maxYear) count++
    if (filters.type) count++
    if (filters.condition) count++
    if (filters.fuelType) count++
    if (filters.transmission) count++
    if (filters.drivetrain) count++
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.minMileage || filters.maxMileage) count++
    if (filters.status) count++
    if (filters.featured) count++
    if (filters.accidentHistory !== undefined) count++
    if (filters.cleanCarfax) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vehicles, VIN, stock number..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.inStock ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange('inStock', !filters.inStock)}
        >
          In Stock Only
        </Button>
        
        <Button
          variant={filters.featured ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange('featured', !filters.featured)}
        >
          Featured
        </Button>
        
        <Button
          variant={filters.cleanCarfax ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange('cleanCarfax', !filters.cleanCarfax)}
        >
          Clean CarFax
        </Button>
        
        <Button
          variant={filters.accidentHistory === false ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange('accidentHistory', filters.accidentHistory === false ? undefined : false)}
        >
          No Accidents
        </Button>
      </div>

      {/* Results Summary */}
      {resultCount !== undefined && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {loading ? "Loading..." : `${new Intl.NumberFormat().format(resultCount)} vehicles found`}
          </p>
          
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort" className="text-sm">Sort by:</Label>
            <Select
              value={filters.sortBy || 'createdAt'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleContent className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Select value={filters.make || "all"} onValueChange={(value) => handleFilterChange('make', value === "all" ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Makes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Makes</SelectItem>
                        {makes.map((make) => (
                          <SelectItem key={make.id} value={make.id}>
                            {make.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Vehicle Type</Label>
                    <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange('type', value === "all" ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={filters.condition || "all"} onValueChange={(value) => handleFilterChange('condition', value === "all" ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Conditions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statuses.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: status.color }}
                              />
                              {status.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />

              {/* Year Range */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Year Range
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minYear">From Year</Label>
                    <Input
                      id="minYear"
                      type="number"
                      placeholder="2000"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={filters.minYear || ""}
                      onChange={(e) => handleFilterChange('minYear', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxYear">To Year</Label>
                    <Input
                      id="maxYear"
                      type="number"
                      placeholder={new Date().getFullYear().toString()}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={filters.maxYear || ""}
                      onChange={(e) => handleFilterChange('maxYear', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price Range */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range (CAD)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minPrice">Min Price</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      min="0"
                      step="1000"
                      value={filters.minPrice || ""}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice">Max Price</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="No limit"
                      min="0"
                      step="1000"
                      value={filters.maxPrice || ""}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Engine & Performance */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Engine & Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select value={filters.fuelType || "all"} onValueChange={(value) => handleFilterChange('fuelType', value === "all" ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Fuel Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Fuel Types</SelectItem>
                        {fuelTypes.map((fuelType) => (
                          <SelectItem key={fuelType.id} value={fuelType.id}>
                            {fuelType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select value={filters.transmission || "all"} onValueChange={(value) => handleFilterChange('transmission', value === "all" ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Transmissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transmissions</SelectItem>
                        {transmissions.map((transmission) => (
                          <SelectItem key={transmission.id} value={transmission.id}>
                            {transmission.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="drivetrain">Drivetrain</Label>
                    <Select value={filters.drivetrain || "all"} onValueChange={(value) => handleFilterChange('drivetrain', value === "all" ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Drivetrains" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Drivetrains</SelectItem>
                        {drivetrains.map((drivetrain) => (
                          <SelectItem key={drivetrain.id} value={drivetrain.id}>
                            {drivetrain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Mileage Range */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Mileage Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minMileage">Min Mileage</Label>
                    <Input
                      id="minMileage"
                      type="number"
                      placeholder="0"
                      min="0"
                      step="1000"
                      value={filters.minMileage || ""}
                      onChange={(e) => handleFilterChange('minMileage', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxMileage">Max Mileage</Label>
                    <Input
                      id="maxMileage"
                      type="number"
                      placeholder="No limit"
                      min="0"
                      step="1000"
                      value={filters.maxMileage || ""}
                      onChange={(e) => handleFilterChange('maxMileage', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Additional Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasFinancing"
                      checked={filters.hasFinancing || false}
                      onCheckedChange={(checked) => handleFilterChange('hasFinancing', checked || undefined)}
                    />
                    <Label htmlFor="hasFinancing">Has Financing Available</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="safetyPassed"
                      checked={filters.safetyPassed || false}
                      onCheckedChange={(checked) => handleFilterChange('safetyPassed', checked || undefined)}
                    />
                    <Label htmlFor="safetyPassed">Safety Certification Passed</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emissionPassed"
                      checked={filters.emissionPassed || false}
                      onCheckedChange={(checked) => handleFilterChange('emissionPassed', checked || undefined)}
                    />
                    <Label htmlFor="emissionPassed">Emission Test Passed</Label>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
