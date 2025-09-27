import { z } from 'zod'

export const saleFormSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle is required'),
  customerName: z.string().min(1, 'Customer name is required').max(120, 'Name too long'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  salePrice: z.number().min(0, 'Sale price must be positive'),
  currency: z.literal('CAD').default('CAD'),
  costOfGoods: z.number().min(0, 'Cost must be positive').optional(),
  discount: z.number().min(0, 'Discount must be positive').optional(),
  taxRate: z.number().min(0, 'Tax rate must be positive').max(1, 'Tax rate must be ≤ 100%').optional(),
  paymentMethod: z.enum(['cash', 'finance', 'lease']).optional(),
  externalDealId: z.string().optional(),
  notes: z.string().optional(),
})

export type SaleFormData = z.infer<typeof saleFormSchema>
 