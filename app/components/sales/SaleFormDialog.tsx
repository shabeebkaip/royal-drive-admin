import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { saleFormSchema, type SaleFormData } from '~/lib/schemas/sale'
import { useVehicles } from './use-vehicles'

interface SaleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SaleFormData) => Promise<void>
  isLoading?: boolean
}

export function SaleFormDialog({ open, onOpenChange, onSubmit, isLoading = false }: SaleFormDialogProps) {
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles()
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      vehicle: '',
      customerName: '',
      customerEmail: '',
      currency: 'CAD',
      salePrice: 0,
      costOfGoods: 0,
      discount: 0,
      taxRate: 0.13, // Default 13% HST for Canada
      paymentMethod: undefined,
      externalDealId: '',
      notes: '',
    },
  })

  const handleVehicleChange = (vehicleId: string) => {
    setValue('vehicle', vehicleId)
    const vehicle = vehicles.find(v => v.value === vehicleId)
    if (vehicle) {
      setSelectedVehicle(vehicle.data)
      // Auto-fill sale price with list price
      if (vehicle.data.pricing?.listPrice) {
        setValue('salePrice', vehicle.data.pricing.listPrice)
      }
    } else {
      setSelectedVehicle(null)
    }
  }

  const handleFormSubmit = async (data: SaleFormData) => {
    try {
      // Ensure currency is always CAD
      const formData = { ...data, currency: 'CAD' as const }
      await onSubmit(formData)
      reset()
      setSelectedVehicle(null)
      onOpenChange(false)
    } catch (error) {
      // Error handled by parent component
    }
  }

  const handleClose = () => {
    reset()
    setSelectedVehicle(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Sale</DialogTitle>
          <DialogDescription>
            Record a new vehicle sale transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-4">
            {/* Vehicle Selection */}
            <div className="space-y-2">
              <Label htmlFor="vehicle" className="text-sm font-medium">Vehicle *</Label>
              <Select
                value={watch('vehicle') || ''}
                onValueChange={handleVehicleChange}
                disabled={vehiclesLoading}
              >
                <SelectTrigger className={`w-full ${errors.vehicle ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={
                    vehiclesLoading 
                      ? 'Loading vehicles...' 
                      : vehicles.length === 0
                        ? 'No vehicles available'
                        : 'Select a vehicle'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.length === 0 && !vehiclesLoading && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No vehicles available for sale
                    </div>
                  )}
                  {vehicles
                    .filter(vehicle => vehicle.value && vehicle.value.trim() !== '') // Extra safety check
                    .map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.value}>
                      {vehicle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicle && (
                <p className="text-sm text-red-600">{errors.vehicle.message}</p>
              )}
              {vehiclesError && (
                <p className="text-sm text-red-600">⚠️ {vehiclesError}</p>
              )}
              {!vehiclesLoading && !vehiclesError && vehicles.length > 0 && (
                <p className="text-sm text-green-600">✓ {vehicles.length} vehicles loaded</p>
              )}
              
              {/* Reference Information Display */}
              {selectedVehicle && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-blue-900">Vehicle Reference Information</h4>
                  <div className="text-sm">
                    <span className="text-blue-700 font-medium">Website List Price:</span>
                    <p className="text-blue-900 font-semibold text-lg mt-1">
                      {selectedVehicle.pricing?.listPrice 
                        ? `CAD ${selectedVehicle.pricing.listPrice.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-sm font-medium">Customer Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                {...register('customerName')}
                className={errors.customerName ? 'border-red-500' : ''}
              />
              {errors.customerName && (
                <p className="text-sm text-red-600">{errors.customerName.message}</p>
              )}
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-sm font-medium">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="Enter customer email (optional)"
                {...register('customerEmail')}
                className={errors.customerEmail ? 'border-red-500' : ''}
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-600">{errors.customerEmail.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Sale Price */}
              <div className="space-y-2">
                <Label htmlFor="salePrice" className="text-sm font-medium">Sale Price *</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('salePrice', { valueAsNumber: true })}
                  className={errors.salePrice ? 'border-red-500' : ''}
                />
                {errors.salePrice && (
                  <p className="text-sm text-red-600">{errors.salePrice.message}</p>
                )}
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-sm font-medium">Discount Amount</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  placeholder="0.00 (optional)"
                  {...register('discount', { valueAsNumber: true })}
                  className={errors.discount ? 'border-red-500' : ''}
                />
                {errors.discount && (
                  <p className="text-sm text-red-600">{errors.discount.message}</p>
                )}
              </div>

              {/* Tax Rate */}
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-sm font-medium">Tax Rate</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.13 (13%)"
                  {...register('taxRate', { valueAsNumber: true })}
                  className={errors.taxRate ? 'border-red-500' : ''}
                />
                {errors.taxRate && (
                  <p className="text-sm text-red-600">{errors.taxRate.message}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method</Label>
                <Select
                  value={watch('paymentMethod') || ''}
                  onValueChange={(value) => setValue('paymentMethod', value as 'cash' | 'finance' | 'lease')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the sale (optional)"
                className="min-h-[80px]"
                {...register('notes')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || vehiclesLoading}>
              {isLoading ? "Creating Sale..." : "Create Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
