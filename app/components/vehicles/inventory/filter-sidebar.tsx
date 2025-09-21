import { useState } from "react"
import { Filter, X, DollarSign, Calendar, Settings, Search, RotateCcw } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"
import { Separator } from "~/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import { useFilterOptions } from "~/hooks/useFilterOptions"
import type { VehicleFilters } from "~/services/vehicleInventoryService"

// Static conditions (these don't come from API)
const conditions = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified-pre-owned", label: "Certified Pre-Owned" },
]

interface VehicleFilterSidebarProps {
  filters: VehicleFilters
  onFiltersChange: (filters: Partial<VehicleFilters>) => void
  onClearFilters: () => void
  resultCount?: number
  loading?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VehicleFilterSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  loading,
  open,
  onOpenChange,
}: VehicleFilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "")
  const { filterOptions, loading: optionsLoading, error: optionsError } = useFilterOptions()
  const [internalOpen, setInternalOpen] = useState(false)

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ [key]: value })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.make) count++
    if (filters.type) count++
    if (filters.condition) count++
    if (filters.status) count++
    if (filters.fuelType) count++
    if (filters.transmission) count++
    if (filters.drivetrain) count++
    if (filters.minYear || filters.maxYear) count++
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.minMileage || filters.maxMileage) count++
    if (filters.inStock) count++
    if (filters.featured) count++
    if (filters.hasFinancing) count++
    if (filters.safetyPassed) count++
    if (filters.search) count++
    return count
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', searchQuery)
  }

  const closeDrawer = () => (onOpenChange ? onOpenChange(false) : setInternalOpen(false))
  const handleApply = () => {
    // Ensure the search input is applied as well
    if ((filters.search || "") !== searchQuery) {
      updateFilter('search', searchQuery)
    }
    closeDrawer()
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Error State for Filter Options */}
      {optionsError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">Failed to load filter options</p>
        </div>
      )}

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            id="search"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm" className="px-3">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <Separator />

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Settings className="h-4 w-4" />
          <h3 className="font-medium">Basic Information</h3>
          {optionsLoading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 pl-6 border-l-2 border-muted">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Make</Label>
            <Select
              value={filters.make || ""}
              onValueChange={(value) => updateFilter('make', value === "all" ? undefined : value)}
              disabled={optionsLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={optionsLoading ? "Loading..." : "All Makes"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {filterOptions.makes.map((make) => (
                  <SelectItem key={make.id} value={make.name}>
                    {make.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Vehicle Type</Label>
            <Select
              value={filters.type || ""}
              onValueChange={(value) => updateFilter('type', value === "all" ? undefined : value)}
              disabled={optionsLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={optionsLoading ? "Loading..." : "All Types"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions.vehicleTypes.map((type) => (
                  <SelectItem key={type.id} value={type.slug}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Condition</Label>
            <Select
              value={filters.condition || ""}
              onValueChange={(value) => updateFilter('condition', value === "all" ? undefined : value)}
            >
              <SelectTrigger className="h-9 w-full">
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => updateFilter('status', value === "all" ? undefined : value)}
              disabled={optionsLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={optionsLoading ? "Loading..." : "All Statuses"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.statuses.map((status) => (
                  <SelectItem key={status.id} value={status.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
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
        <div className="flex items-center gap-2 text-primary">
          <Calendar className="h-4 w-4" />
          <h3 className="font-medium">Year Range</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 pl-6 border-l-2 border-muted">
          <div className="space-y-2">
            <Label className="text-sm font-medium">From Year</Label>
            <Input
              type="number"
              placeholder="2000"
              min="1900"
              max="2030"
              className="h-9"
              value={filters.minYear || ""}
              onChange={(e) => updateFilter('minYear', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">To Year</Label>
            <Input
              type="number"
              placeholder="2025"
              min="1900"
              max="2030"
              className="h-9"
              value={filters.maxYear || ""}
              onChange={(e) => updateFilter('maxYear', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <DollarSign className="h-4 w-4" />
          <h3 className="font-medium">Price Range (CAD)</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 pl-6 border-l-2 border-muted">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Price</Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              className="h-9"
              value={filters.minPrice || ""}
              onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Price</Label>
            <Input
              type="number"
              placeholder="No limit"
              min="0"
              className="h-9"
              value={filters.maxPrice || ""}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Engine & Performance */}
      <div className="space-y-4">
        <h3 className="font-medium text-primary">Engine & Performance</h3>

        <div className="space-y-4 pl-6 border-l-2 border-muted">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fuel Type</Label>
            <Select
              value={filters.fuelType || ""}
              onValueChange={(value) => updateFilter('fuelType', value === "all" ? undefined : value)}
              disabled={optionsLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={optionsLoading ? "Loading..." : "All Fuel Types"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fuel Types</SelectItem>
                {filterOptions.fuelTypes.map((fuel) => (
                  <SelectItem key={fuel.id} value={fuel.name}>
                    {fuel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Transmission</Label>
            <Select
              value={filters.transmission || ""}
              onValueChange={(value) => updateFilter('transmission', value === "all" ? undefined : value)}
              disabled={optionsLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={optionsLoading ? "Loading..." : "All Transmissions"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transmissions</SelectItem>
                {filterOptions.transmissions.map((transmission) => (
                  <SelectItem key={transmission.id} value={transmission.name}>
                    {transmission.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Drivetrain</Label>
            <Select
              value={filters.drivetrain || ""}
              onValueChange={(value) => updateFilter('drivetrain', value === "all" ? undefined : value)}
              disabled={optionsLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={optionsLoading ? "Loading..." : "All Drivetrains"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivetrains</SelectItem>
                {filterOptions.drivetrains.map((drivetrain) => (
                  <SelectItem key={drivetrain.id} value={drivetrain.name}>
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
        <h3 className="font-medium text-primary">Mileage Range</h3>

        <div className="grid grid-cols-2 gap-2 pl-6 border-l-2 border-muted">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Mileage</Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              className="h-9"
              value={filters.minMileage || ""}
              onChange={(e) => updateFilter('minMileage', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Mileage</Label>
            <Input
              type="number"
              placeholder="No limit"
              min="0"
              className="h-9"
              value={filters.maxMileage || ""}
              onChange={(e) => updateFilter('maxMileage', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      <Separator />

  {/* Additional Options */}
      <div className="space-y-4">
        <h3 className="font-medium text-primary">Additional Options</h3>

        <div className="space-y-3 pl-6 border-l-2 border-muted">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock || false}
              onCheckedChange={(checked) => updateFilter('inStock', checked)}
            />
            <Label htmlFor="inStock" className="text-sm font-medium cursor-pointer">In Stock Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.featured || false}
              onCheckedChange={(checked) => updateFilter('featured', checked)}
            />
            <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">Featured Vehicles</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasFinancing"
              checked={filters.hasFinancing || false}
              onCheckedChange={(checked) => updateFilter('hasFinancing', checked)}
            />
            <Label htmlFor="hasFinancing" className="text-sm font-medium cursor-pointer">Financing Available</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="safetyPassed"
              checked={filters.safetyPassed || false}
              onCheckedChange={(checked) => updateFilter('safetyPassed', checked)}
            />
            <Label htmlFor="safetyPassed" className="text-sm font-medium cursor-pointer">Safety Certification Passed</Label>
          </div>
        </div>
      </div>

  {/* Actions moved to sticky footer */}
    </div>
  )

  return (
    <>
      {/* Filters Sheet (acts like a drawer from right) */}
      <Sheet open={open ?? internalOpen} onOpenChange={onOpenChange ?? setInternalOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[360px] sm:w-[420px] p-0">
          <div className="flex h-full flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </SheetTitle>
            <SheetDescription>
              Filter your vehicle inventory with advanced options
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <FilterContent />
          </div>
          <div className="border-t bg-background p-4">
            {resultCount !== undefined && (
              <div className="text-xs text-muted-foreground mb-2">
                {loading ? (
                  <span>Updating results…</span>
                ) : (
                  <span>
                    {resultCount.toLocaleString()} {resultCount === 1 ? 'vehicle' : 'vehicles'}
                  </span>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={onClearFilters}
                variant="outline"
                disabled={loading || getActiveFiltersCount() === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button onClick={handleApply} disabled={loading}>
                Apply
              </Button>
            </div>
          </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
