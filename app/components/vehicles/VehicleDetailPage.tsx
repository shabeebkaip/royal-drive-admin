import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { PageTitle } from "~/components/shared/page-title"
import { ArrowLeft, Edit, Trash2, Copy, Download, FileText, History, DollarSign, Gauge, Calendar, MapPin, Shield, Star } from "lucide-react"
import type { Vehicle } from "~/types/vehicle"
import { vehicleService } from "~/services/vehicleService"
import { toast } from "sonner"

export default function VehicleDetailPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [vehicleHistory, setVehicleHistory] = useState<any[]>([])
  const [valuation, setValuation] = useState<any>(null)

  useEffect(() => {
    if (id) {
      loadVehicleData(id)
    }
  }, [id])

  const loadVehicleData = async (vehicleId: string) => {
    try {
      setLoading(true)
      
      // Load vehicle data and additional info in parallel
      const [vehicleResponse, historyResponse, valuationResponse] = await Promise.all([
        vehicleService.getVehicle(vehicleId),
        vehicleService.getVehicleHistory(vehicleId).catch(() => ({ success: false, data: [] })),
        vehicle?.vin ? vehicleService.getValuation(vehicle.vin).catch(() => ({ success: false, data: null })) : Promise.resolve({ success: false, data: null })
      ])

      if (vehicleResponse.success && vehicleResponse.data) {
        setVehicle(vehicleResponse.data)
      }

      if (historyResponse.success && historyResponse.data) {
        setVehicleHistory(historyResponse.data)
      }

      if (valuationResponse.success && valuationResponse.data) {
        setValuation(valuationResponse.data)
      }
    } catch (error) {
      console.error('Error loading vehicle:', error)
      toast.error('Failed to load vehicle details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!vehicle) return
    
    try {
      setIsDeleting(true)
      await vehicleService.deleteVehicle(vehicle._id)
      toast.success('Vehicle deleted successfully')
      // Navigate back to list
      window.history.back()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Failed to delete vehicle')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleDuplicate = async () => {
    if (!vehicle) return
    
    try {
      setIsDuplicating(true)
      const response = await vehicleService.duplicateVehicle(vehicle._id)
      if (response.success) {
        toast.success('Vehicle duplicated successfully')
        // Navigate to the new vehicle
        window.location.href = `/vehicles/${response.data!._id}`
      }
    } catch (error) {
      console.error('Error duplicating vehicle:', error)
      toast.error('Failed to duplicate vehicle')
    } finally {
      setIsDuplicating(false)
    }
  }

  const handleGenerateReport = async (format: 'pdf' | 'excel') => {
    if (!vehicle) return
    
    try {
      const blob = await vehicleService.generateReport(vehicle._id, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `vehicle-${vehicle._id}-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success(`${format.toUpperCase()} report downloaded successfully`)
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/vehicles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vehicles
              </Button>
            </Link>
            <PageTitle title="Vehicle Not Found" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">The requested vehicle could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const make = typeof vehicle.make === 'string' ? vehicle.make : vehicle.make.name
  const model = typeof vehicle.model === 'string' ? vehicle.model : vehicle.model.name
  const status = typeof vehicle.status === 'string' ? vehicle.status : vehicle.status.name
  const fuelType = typeof vehicle.engine.fuelType === 'string' ? vehicle.engine.fuelType : vehicle.engine.fuelType.name

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/vehicles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
          <div>
            <PageTitle title={`${vehicle.year} ${make} ${model}`} />
            <p className="text-sm text-muted-foreground">
              {vehicle.vin || 'No VIN'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleGenerateReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF Report
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDuplicate}
            disabled={isDuplicating}
          >
            <Copy className="h-4 w-4 mr-2" />
            {isDuplicating ? 'Duplicating...' : 'Duplicate'}
          </Button>
          <Link to={`/vehicles/${vehicle._id}/edit`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Vehicle
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">List Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${vehicle.pricing.listPrice.toLocaleString()} CAD
            </div>
            {vehicle.pricing.msrp && (
              <p className="text-xs text-muted-foreground">
                MSRP: ${vehicle.pricing.msrp.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mileage</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicle.odometer.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {vehicle.odometer.unit} • {vehicle.odometer.isAccurate ? 'Accurate' : 'Estimated'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days in Inventory</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicle.internal.daysInInventory || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Since {new Date(vehicle.internal.acquisitionDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge 
                variant={vehicle.availability.inStock ? 'default' : 'destructive'}
                className="text-sm"
              >
                {status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {vehicle.availability.inStock ? 'In Stock' : 'Not Available'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Year</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Make</Label>
                    <p className="text-sm text-muted-foreground">{make}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Model</Label>
                    <p className="text-sm text-muted-foreground">{model}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Trim</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.trim || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Condition</Label>
                    <Badge variant={vehicle.condition === 'new' ? 'default' : 'secondary'}>
                      {vehicle.condition}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">VIN</Label>
                    <p className="text-sm font-mono text-muted-foreground">{vehicle.vin || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle History */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Previous Owners</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.numberOfPreviousOwners}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Accident History</Label>
                    <Badge variant={vehicle.accidentHistory ? 'destructive' : 'default'}>
                      {vehicle.accidentHistory ? 'Yes' : 'Clean'}
                    </Badge>
                  </div>
                </div>
                {vehicle.carfax && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">CarFax Report</Label>
                    <div className="flex items-center gap-4">
                      <Badge variant={vehicle.carfax.hasCleanHistory ? 'default' : 'destructive'}>
                        {vehicle.carfax.hasCleanHistory ? 'Clean History' : 'Issues Found'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {vehicle.carfax.serviceRecords} service records
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ontario Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Ontario Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Emission Test</span>
                    <Badge variant={vehicle.ontario.emissionTest.passed ? 'default' : 'destructive'}>
                      {vehicle.ontario.emissionTest.passed ? 'Passed' : 'Required'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Safety Standard</span>
                    <Badge variant={vehicle.ontario.safetyStandard.passed ? 'default' : 'destructive'}>
                      {vehicle.ontario.safetyStandard.passed ? 'Certified' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">UVIP</span>
                    <Badge variant={vehicle.ontario.uvip.obtained ? 'default' : 'secondary'}>
                      {vehicle.ontario.uvip.obtained ? 'Obtained' : 'Required'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing */}
            <Card>
              <CardHeader>
                <CardTitle>Marketing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Badge variant={vehicle.marketing.featured ? 'default' : 'secondary'}>
                    {vehicle.marketing.featured ? 'Featured' : 'Standard'}
                  </Badge>
                </div>
                {vehicle.marketing.specialOffer && (
                  <div>
                    <Label className="text-sm font-medium">Special Offer</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.marketing.specialOffer}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{vehicle.marketing.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Engine & Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Engine & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Engine Size</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.engine.size}L</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Cylinders</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.engine.cylinders}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fuel Type</Label>
                    <p className="text-sm text-muted-foreground">{fuelType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Drivetrain</Label>
                    <p className="text-sm text-muted-foreground">
                      {typeof vehicle.drivetrain === 'string' ? vehicle.drivetrain : vehicle.drivetrain.name}
                    </p>
                  </div>
                  {vehicle.engine.horsepower && (
                    <div>
                      <Label className="text-sm font-medium">Horsepower</Label>
                      <p className="text-sm text-muted-foreground">{vehicle.engine.horsepower} HP</p>
                    </div>
                  )}
                  {vehicle.engine.torque && (
                    <div>
                      <Label className="text-sm font-medium">Torque</Label>
                      <p className="text-sm text-muted-foreground">{vehicle.engine.torque} lb-ft</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Physical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Exterior Color</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.specifications.exteriorColor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Interior Color</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.specifications.interiorColor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Doors</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.specifications.doors}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Seating</Label>
                    <p className="text-sm text-muted-foreground">{vehicle.specifications.seatingCapacity} passengers</p>
                  </div>
                </div>
                {vehicle.specifications.fuelEconomy && (
                  <div>
                    <Label className="text-sm font-medium">Fuel Economy</Label>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.specifications.fuelEconomy.city && `City: ${vehicle.specifications.fuelEconomy.city}L/100km`}
                      {vehicle.specifications.fuelEconomy.highway && ` • Highway: ${vehicle.specifications.fuelEconomy.highway}L/100km`}
                      {vehicle.specifications.fuelEconomy.combined && ` • Combined: ${vehicle.specifications.fuelEconomy.combined}L/100km`}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(vehicle.features).map(([category, features]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {features.length > 0 ? (
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No {category} features listed</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pricing Details */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">List Price</span>
                    <span>${vehicle.pricing.listPrice.toLocaleString()} CAD</span>
                  </div>
                  {vehicle.pricing.msrp && (
                    <div className="flex justify-between">
                      <span>MSRP</span>
                      <span>${vehicle.pricing.msrp.toLocaleString()} CAD</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span>HST ({vehicle.pricing.taxes.hst}%)</span>
                    <span>${Math.round(vehicle.pricing.listPrice * (vehicle.pricing.taxes.hst / 100)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Licensing</span>
                    <span>${vehicle.pricing.taxes.licensing}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Price</span>
                    <span>${Math.round(vehicle.pricing.listPrice * (1 + vehicle.pricing.taxes.hst / 100) + vehicle.pricing.taxes.licensing).toLocaleString()} CAD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financing */}
            {vehicle.pricing.financing.available && (
              <Card>
                <CardHeader>
                  <CardTitle>Financing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {vehicle.pricing.financing.rate && (
                      <div className="flex justify-between">
                        <span>Interest Rate</span>
                        <span>{vehicle.pricing.financing.rate}%</span>
                      </div>
                    )}
                    {vehicle.pricing.financing.term && (
                      <div className="flex justify-between">
                        <span>Term</span>
                        <span>{vehicle.pricing.financing.term} months</span>
                      </div>
                    )}
                    {vehicle.pricing.financing.monthlyPayment && (
                      <div className="flex justify-between font-medium">
                        <span>Monthly Payment</span>
                        <span>${vehicle.pricing.financing.monthlyPayment.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Valuation */}
            {valuation && (
              <Card>
                <CardHeader>
                  <CardTitle>Market Valuation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Estimated Value</span>
                      <span>${valuation.estimatedValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Range</span>
                      <span>${valuation.marketRange.min.toLocaleString()} - ${valuation.marketRange.max.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Source</span>
                      <span className="text-sm text-muted-foreground">{valuation.source}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="grid gap-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images ({vehicle.media.images.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.media.images.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {vehicle.media.images.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <img 
                          src={image} 
                          alt={`Vehicle image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling!.classList.remove('hidden')
                          }}
                        />
                        <div className="hidden text-muted-foreground">
                          <div className="flex items-center justify-center">
                            <FileText className="h-8 w-8" />
                            <span className="ml-2">Image {index + 1}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No images available</p>
                )}
              </CardContent>
            </Card>

            {/* Videos */}
            {vehicle.media.videos && vehicle.media.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Videos ({vehicle.media.videos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {vehicle.media.videos.map((video, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg">
                        <video 
                          src={video} 
                          controls 
                          className="w-full h-full rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {vehicle.media.documents && vehicle.media.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents ({vehicle.media.documents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vehicle.media.documents.map((document, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Document {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle History</CardTitle>
              <CardDescription>
                Activity log and changes made to this vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vehicleHistory.length > 0 ? (
                <div className="space-y-4">
                  {vehicleHistory.map((entry, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <History className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium capitalize">{entry.action.replace('_', ' ')}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">By {entry.user}</p>
                        {Object.keys(entry.changes).length > 0 && (
                          <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                            <pre>{JSON.stringify(entry.changes, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No history available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle 
              "{vehicle.year} {make} {model}" and remove it from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  )
}
