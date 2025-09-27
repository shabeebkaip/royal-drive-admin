export type SaleStatus = 'pending' | 'completed' | 'cancelled'
export type SaleCurrency = 'CAD' | 'USD'
export type SalePaymentMethod = 'cash' | 'finance' | 'lease'

export interface Sale {
  id: string
  vehicle: string | { id: string; vin?: string; year?: number; make?: string; model?: string; listPrice?: number }
  customerName: string
  customerEmail?: string
  salePrice: number
  currency: SaleCurrency
  costOfGoods?: number
  margin?: number
  marginPercent?: number
  salesperson?: string | { id: string; name?: string; email?: string }
  status: SaleStatus
  paymentMethod?: SalePaymentMethod
  discount?: number
  taxRate?: number
  taxAmount?: number
  grossPrice?: number
  totalPrice?: number
  externalDealId?: string
  notes?: string
  meta?: Record<string, any>
  closedAt?: string
  createdAt: string
  updatedAt: string
}

export interface SaleSearchParams {
  status?: SaleStatus
  salesperson?: string
  vehicle?: string
  search?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> { data: T }

export interface SalesSummaryBucket {
  _id: SaleStatus
  count: number
  totalRevenue: number
  totalGross: number
  totalMargin: number
}
