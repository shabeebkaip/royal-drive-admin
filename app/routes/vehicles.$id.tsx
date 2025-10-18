import type { Route } from "./+types/vehicles.$id";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { vehicleApiService } from "~/services/vehicleApiService";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Download,
  DollarSign,
  Gauge,
  Calendar,
  Car,
  Fuel,
  Settings,
  Wrench,
  Sparkles,
  CreditCard,
  Play,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Clock,
  FileText,
  Shield
} from "lucide-react";
import { toast } from "sonner";

export default function VehicleDetail(_props: Route.ComponentProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehicleApiService.getVehicleById(id!);
      
      if (response.success && response.data) {
        setVehicle(response.data);
      } else {
        setError("Failed to load vehicle");
      }
    } catch (err) {
      console.error("Error loading vehicle:", err);
      setError("Failed to load vehicle");
      toast.error("Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    
    try {
      await vehicleApiService.deleteVehicle(id!);
      toast.success("Vehicle deleted successfully");
      navigate("/vehicles");
    } catch (err) {
      toast.error("Failed to delete vehicle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested vehicle could not be found."}
          </p>
          <Link to="/vehicles">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const make = vehicle.make?.name || vehicle.make || "N/A";
  const model = vehicle.model?.name || vehicle.model || "N/A";
  const type = vehicle.type?.name || vehicle.type || "N/A";
  const status = vehicle.status?.name || vehicle.status || "N/A";
  const fuelType = vehicle.engine?.fuelType?.name || vehicle.engine?.fuelType || "N/A";
  const transmission = vehicle.transmission?.type?.name || vehicle.transmission?.type || "N/A";
  const drivetrain = vehicle.drivetrain?.name || vehicle.drivetrain || "N/A";
  const images = vehicle.media?.images || [];
  const hasImages = images.length > 0;
  
  const listPrice = vehicle.pricing?.listPrice || 0;
  const acquisitionCost = vehicle.internal?.acquisitionCost || 0;
  const profit = listPrice - acquisitionCost;
  const profitMargin = acquisitionCost > 0 ? ((profit / acquisitionCost) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/vehicles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            {vehicle.status?.slug !== 'sold' && (
              <div className="flex gap-2">
                <Link to={`/vehicles/${vehicle._id}/edit`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-[500px_1fr] gap-0">
            <div className="relative bg-gray-100 flex items-center justify-center">
              {hasImages ? (
                <div className="relative w-full">
                  <img src={images[selectedImage]} alt={`${vehicle.year} ${make} ${model}`} className="w-full h-auto object-contain" />
                  {images.length > 1 && (
                    <>
                      <button onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"><ChevronLeft className="h-6 w-6" /></button>
                      <button onClick={() => setSelectedImage((selectedImage + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"><ChevronRight className="h-6 w-6" /></button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_: any, idx: number) => (
                          <button key={idx} onClick={() => setSelectedImage(idx)} className={`h-2 rounded-full transition-all ${idx === selectedImage ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center"><ImageIcon className="h-24 w-24 text-gray-400" /></div>
              )}
            </div>

            <div className="p-8 space-y-5">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-sm">{vehicle.condition === "new" ? "New" : "Used"}</Badge>
                  <Badge className={status === "Available" ? "bg-green-500" : "bg-yellow-500"}>{status}</Badge>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{vehicle.year} {make} {model}</h1>
                {vehicle.trim && <p className="text-xl text-gray-600">{vehicle.trim}</p>}
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-500 mb-1">List Price</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold text-blue-600">${listPrice.toLocaleString()}</p>
                  <span className="text-gray-500">{vehicle.pricing?.currency || "CAD"}</span>
                </div>
                {acquisitionCost > 0 && (
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600"><span>Cost: ${acquisitionCost.toLocaleString()}</span></div>
                    <div className="flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4 text-green-600" /><span className="font-semibold text-green-600">${profit.toLocaleString()} profit ({profitMargin}%)</span></div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3"><div className="p-2 bg-blue-50 rounded-lg"><Gauge className="h-5 w-5 text-blue-600" /></div><div><p className="text-xs text-gray-500">Mileage</p><p className="font-semibold">{vehicle.odometer?.value?.toLocaleString() || "0"} {vehicle.odometer?.unit || "km"}</p></div></div>
                <div className="flex items-center gap-3"><div className="p-2 bg-purple-50 rounded-lg"><Fuel className="h-5 w-5 text-purple-600" /></div><div><p className="text-xs text-gray-500">Fuel Type</p><p className="font-semibold">{fuelType}</p></div></div>
                <div className="flex items-center gap-3"><div className="p-2 bg-green-50 rounded-lg"><Settings className="h-5 w-5 text-green-600" /></div><div><p className="text-xs text-gray-500">Transmission</p><p className="font-semibold">{transmission}</p></div></div>
                <div className="flex items-center gap-3"><div className="p-2 bg-orange-50 rounded-lg"><Car className="h-5 w-5 text-orange-600" /></div><div><p className="text-xs text-gray-500">Drivetrain</p><p className="font-semibold">{drivetrain}</p></div></div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-gray-500">VIN</p>
                <p className="font-mono text-sm bg-gray-50 px-3 py-2 rounded">{vehicle.vin || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <InfoSection title="Vehicle Information" icon={<Car className="h-5 w-5 text-blue-600" />}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Make" value={make} />
                <InfoRow label="Model" value={model} />
                <InfoRow label="Year" value={vehicle.year} />
                <InfoRow label="Type" value={type} />
                <InfoRow label="Trim" value={vehicle.trim || "N/A"} />
                <InfoRow label="Condition" value={vehicle.condition} />
                <InfoRow label="Body Style" value={type} />
                <InfoRow label="Doors" value={vehicle.specifications?.doors || "N/A"} />
                <InfoRow label="Seating" value={`${vehicle.specifications?.seatingCapacity || "N/A"} seats`} />
                <InfoRow label="Exterior Color" value={vehicle.specifications?.exteriorColor || "N/A"} />
                <InfoRow label="Interior Color" value={vehicle.specifications?.interiorColor || "N/A"} />
              </div>
            </InfoSection>

            <InfoSection title="Engine & Performance" icon={<Wrench className="h-5 w-5 text-purple-600" />}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Engine Size" value={`${vehicle.engine?.size || "N/A"}L`} />
                <InfoRow label="Cylinders" value={vehicle.engine?.cylinders || "N/A"} />
                <InfoRow label="Horsepower" value={`${vehicle.engine?.horsepower || "N/A"} hp`} />
                <InfoRow label="Torque" value={vehicle.engine?.torque ? `${vehicle.engine.torque} lb-ft` : "N/A"} />
                <InfoRow label="Fuel Type" value={fuelType} />
                <InfoRow label="Transmission" value={transmission} />
                <InfoRow label="Drivetrain" value={drivetrain} />
                {vehicle.transmission?.speeds && <InfoRow label="Speeds" value={`${vehicle.transmission.speeds}-speed`} />}
              </div>
              {vehicle.specifications?.fuelEconomy && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Fuel Economy (L/100km)</p>
                    <div className="grid grid-cols-3 gap-4">
                      <FuelEconCard value={vehicle.specifications.fuelEconomy.city} label="City" />
                      <FuelEconCard value={vehicle.specifications.fuelEconomy.highway} label="Highway" />
                      <FuelEconCard value={vehicle.specifications.fuelEconomy.combined} label="Combined" />
                    </div>
                  </div>
                </>
              )}
            </InfoSection>

            {vehicle.features && (
              <InfoSection title="Features & Options" icon={<Sparkles className="h-5 w-5 text-yellow-600" />}>
                <div className="grid md:grid-cols-2 gap-6">
                  {vehicle.features.exterior?.length > 0 && <FeatureSection title="Exterior" features={vehicle.features.exterior} />}
                  {vehicle.features.interior?.length > 0 && <FeatureSection title="Interior" features={vehicle.features.interior} />}
                  {vehicle.features.safety?.length > 0 && <FeatureSection title="Safety" features={vehicle.features.safety} />}
                  {vehicle.features.technology?.length > 0 && <FeatureSection title="Technology" features={vehicle.features.technology} />}
                  {vehicle.features.convenience?.length > 0 && <FeatureSection title="Convenience" features={vehicle.features.convenience} />}
                </div>
              </InfoSection>
            )}

            <InfoSection title="Pricing Details" icon={<CreditCard className="h-5 w-5 text-green-600" />}>
              <div className="space-y-3">
                <PriceRow label="List Price" value={listPrice} large />
                {vehicle.pricing?.msrp && <PriceRow label="MSRP" value={vehicle.pricing.msrp} />}
                {vehicle.pricing?.taxes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Taxes & Fees</p>
                      {vehicle.pricing.taxes.hst && <PriceRow label={`HST (${vehicle.pricing.taxes.hst}%)`} value={(listPrice * vehicle.pricing.taxes.hst) / 100} small />}
                      {vehicle.pricing.taxes.licensing && <PriceRow label="Licensing" value={vehicle.pricing.taxes.licensing} small />}
                      {vehicle.pricing.taxes.other && <PriceRow label="Other Fees" value={vehicle.pricing.taxes.other} small />}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold text-blue-600">
                      <span>Total Price</span>
                      <span>${(listPrice + (vehicle.pricing.taxes.hst ? (listPrice * vehicle.pricing.taxes.hst) / 100 : 0) + (vehicle.pricing.taxes.licensing || 0) + (vehicle.pricing.taxes.other || 0)).toLocaleString()}</span>
                    </div>
                  </>
                )}
                {vehicle.pricing?.financing?.available && (
                  <>
                    <Separator />
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Financing Available</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {vehicle.pricing.financing.rate && <div><p className="text-blue-600">Rate</p><p className="font-semibold text-blue-900">{vehicle.pricing.financing.rate}%</p></div>}
                        {vehicle.pricing.financing.term && <div><p className="text-blue-600">Term</p><p className="font-semibold text-blue-900">{vehicle.pricing.financing.term} months</p></div>}
                        {vehicle.pricing.financing.monthlyPayment && <div className="col-span-2 mt-2"><p className="text-blue-600">Monthly Payment</p><p className="text-2xl font-bold text-blue-900">${vehicle.pricing.financing.monthlyPayment.toLocaleString()}</p></div>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </InfoSection>
          </div>

          <div className="space-y-6">
            <SideSection title="Inventory" icon={<Clock className="h-5 w-5 text-blue-600" />}>
              <div className="space-y-3">
                <div><p className="text-xs text-gray-500">Days in Stock</p><p className="text-2xl font-bold text-gray-900">{vehicle.internal?.daysInInventory || 0}</p></div>
                {vehicle.internal?.acquisitionDate && <div><p className="text-xs text-gray-500">Acquired</p><p className="text-sm font-medium">{new Date(vehicle.internal.acquisitionDate).toLocaleDateString()}</p></div>}
                <div><p className="text-xs text-gray-500">Availability</p><Badge variant={vehicle.availability?.inStock ? "default" : "secondary"} className="mt-1">{vehicle.availability?.inStock ? "In Stock" : "Not Available"}</Badge></div>
              </div>
            </SideSection>

            <SideSection title="History" icon={<FileText className="h-5 w-5 text-purple-600" />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Previous Owners</span><span className="font-bold text-2xl text-gray-900">{vehicle.numberOfPreviousOwners || 0}</span></div>
                <Separator />
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Accidents</span><Badge variant={vehicle.accidentHistory ? "destructive" : "default"}>{vehicle.accidentHistory ? <><XCircle className="h-3 w-3 mr-1" /> Yes</> : <><CheckCircle className="h-3 w-3 mr-1" /> Clean</>}</Badge></div>
                {vehicle.carfax && (
                  <>
                    <Separator />
                    <div><p className="text-sm text-gray-600 mb-2">CarFax Report</p><Badge variant={vehicle.carfax.hasCleanHistory ? "default" : "destructive"}>{vehicle.carfax.hasCleanHistory ? "Clean History" : "Issues Found"}</Badge>{vehicle.carfax.reportUrl && <a href={vehicle.carfax.reportUrl} target="_blank" rel="noopener noreferrer"><Button variant="link" size="sm" className="p-0 h-auto mt-2">View Full Report</Button></a>}</div>
                  </>
                )}
              </div>
            </SideSection>

            <SideSection title="Ontario Compliance" icon={<Shield className="h-5 w-5 text-green-600" />}>
              <div className="space-y-3">
                <StatusItem label="Emission Test" passed={vehicle.ontario?.emissionTest?.passed} />
                <StatusItem label="Safety Standard" passed={vehicle.ontario?.safetyStandard?.passed} />
                <StatusItem label="UVIP" passed={vehicle.ontario?.uvip?.obtained} />
              </div>
            </SideSection>

            {(vehicle.marketing?.featured || vehicle.marketing?.specialOffer) && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-3"><Sparkles className="h-5 w-5 text-yellow-600" /><h2 className="text-lg font-bold">Marketing</h2></div>
                {vehicle.marketing.featured && <Badge className="mb-3 bg-yellow-500">Featured Vehicle</Badge>}
                {vehicle.marketing.specialOffer && <div><p className="text-sm font-semibold text-yellow-900 mb-1">Special Offer</p><p className="text-sm text-yellow-800">{vehicle.marketing.specialOffer}</p></div>}
              </div>
            )}

            {(vehicle.internal?.notes || vehicle.internal?.assignedSalesperson) && (
              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3"><Info className="h-5 w-5 text-gray-600" /><h2 className="text-lg font-bold">Internal Info</h2></div>
                {vehicle.internal.assignedSalesperson && <div className="mb-3"><p className="text-xs text-gray-500">Assigned To</p><p className="text-sm font-medium">{vehicle.internal.assignedSalesperson}</p></div>}
                {vehicle.internal.notes && <div><p className="text-xs text-gray-500 mb-1">Notes</p><p className="text-sm text-gray-700 italic">{vehicle.internal.notes}</p></div>}
              </div>
            )}
          </div>
        </div>

        {hasImages && images.length > 1 && (
          <InfoSection title="Photo Gallery" icon={<ImageIcon className="h-5 w-5 text-blue-600" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative aspect-video rounded-lg overflow-hidden border-2 transition ${idx === selectedImage ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}><img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" /></button>
              ))}
            </div>
          </InfoSection>
        )}

        {vehicle.media?.videos?.length > 0 && (
          <InfoSection title="Videos" icon={<Play className="h-5 w-5 text-red-600" />}>
            <div className="grid md:grid-cols-2 gap-4">
              {vehicle.media.videos.map((video: string, idx: number) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden border"><video controls className="w-full h-full"><source src={video} /></video></div>
              ))}
            </div>
          </InfoSection>
        )}

        {vehicle.media?.documents?.length > 0 && (
          <InfoSection title="Documents" icon={<FileText className="h-5 w-5 text-gray-600" />}>
            <div className="space-y-2">
              {vehicle.media.documents.map((doc: string, idx: number) => (
                <a key={idx} href={doc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-2 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"><FileText className="h-5 w-5 text-blue-600" /><span className="flex-1 font-medium">Document {idx + 1}</span><Download className="h-4 w-4 text-gray-400" /></a>
              ))}
            </div>
          </InfoSection>
        )}

        <InfoSection title="Timeline" icon={<Calendar className="h-5 w-5 text-purple-600" />}>
          <div className="space-y-4">
            {vehicle.internal?.acquisitionDate && (
              <TimelineItem 
                icon={<DollarSign className="h-4 w-4" />} 
                title="Acquired by Dealership" 
                date={vehicle.internal.acquisitionDate} 
              />
            )}
            <TimelineItem 
              icon={<CheckCircle className="h-4 w-4" />} 
              title="Vehicle Added to Inventory" 
              date={vehicle.createdAt} 
            />
            {vehicle.updatedAt && vehicle.createdAt !== vehicle.updatedAt && (
              <TimelineItem 
                icon={<Edit className="h-4 w-4" />} 
                title="Last Updated" 
                date={vehicle.updatedAt} 
              />
            )}
            {vehicle.status?.slug === 'sold' && vehicle.updatedAt && (
              <TimelineItem 
                icon={<TrendingUp className="h-4 w-4" />} 
                title="Vehicle Sold" 
                date={vehicle.updatedAt} 
                highlight
              />
            )}
          </div>
        </InfoSection>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return <div><p className="text-xs text-gray-500 mb-1">{label}</p><p className="font-semibold text-gray-900">{value}</p></div>;
}

function FeatureSection({ title, features }: { title: string; features: string[] }) {
  return <div><p className="text-sm font-semibold text-gray-700 mb-2">{title}</p><ul className="space-y-1.5">{features.map((feature, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /><span>{feature}</span></li>)}</ul></div>;
}

function StatusItem({ label, passed }: { label: string; passed?: boolean }) {
  return <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm font-medium text-gray-700">{label}</span><Badge variant={passed ? "default" : "secondary"} className="text-xs">{passed ? <><CheckCircle className="h-3 w-3 mr-1" /> Passed</> : <><AlertCircle className="h-3 w-3 mr-1" /> Pending</>}</Badge></div>;
}

function TimelineItem({ icon, title, date, highlight }: { icon: React.ReactNode; title: string; date: string; highlight?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${highlight ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {icon}
        </div>
        <div className="h-full w-px bg-gray-200" />
      </div>
      <div className="flex-1 pb-4">
        <p className={`font-medium ${highlight ? 'text-green-900' : 'text-gray-900'}`}>{title}</p>
        <p className="text-sm text-gray-500">{new Date(date).toLocaleString()}</p>
      </div>
    </div>
  );
}

function InfoSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-2 mb-4">{icon}<h2 className="text-xl font-bold">{title}</h2></div>{children}</div>;
}

function SideSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-2 mb-4">{icon}<h2 className="text-lg font-bold">{title}</h2></div>{children}</div>;
}

function FuelEconCard({ value, label }: { value: number; label: string }) {
  return <div className="text-center p-3 bg-blue-50 rounded-lg"><p className="text-2xl font-bold text-blue-600">{value}</p><p className="text-xs text-gray-600 mt-1">{label}</p></div>;
}

function PriceRow({ label, value, large, small }: { label: string; value: number; large?: boolean; small?: boolean }) {
  return <div className={`flex justify-between items-center ${large ? 'text-lg' : small ? 'text-sm' : ''}`}><span className={large ? 'text-gray-700' : 'text-gray-600'}>{label}</span><span className={large ? 'text-xl font-bold' : small ? 'text-sm' : 'text-gray-700'}>${value.toLocaleString()}</span></div>;
}

export const meta = () => [{ title: "Vehicle Details" }];
