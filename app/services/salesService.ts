import { auth } from '~/lib/auth'
import type { Sale, SaleSearchParams, PaginatedResponse, ApiResponse, SalesSummaryBucket, SaleStatus } from '~/types/sale'

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not configured in environment variables')
}

function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = auth.getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  return fetch(input, { ...init, headers, credentials: 'include' })
}

function buildQuery(params: Record<string, any>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k,v]) => {
    if (v !== undefined && v !== null && v !== '') search.set(k, String(v))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

// Raw backend type (mirrors API spec)
interface RawSale {
  _id: string
  vehicle: any
  customerName: string
  customerEmail?: string
  salePrice: number
  currency: 'CAD' | 'USD'
  costOfGoods?: number
  margin?: number
  marginPercent?: number
  salesperson?: any
  status: SaleStatus
  paymentMethod?: 'cash' | 'finance' | 'lease'
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

function normalize(raw: RawSale): Sale {
  return {
    id: raw._id,
    vehicle: raw.vehicle?._id ? {
      id: raw.vehicle._id,
      vin: raw.vehicle.vin,
      year: raw.vehicle.year,
      make: raw.vehicle.make?.name || raw.vehicle.make,
      model: raw.vehicle.model?.name || raw.vehicle.model,
      listPrice: raw.vehicle?.pricing?.listPrice
    } : raw.vehicle,
    customerName: raw.customerName,
    customerEmail: raw.customerEmail,
    salePrice: raw.salePrice,
    currency: raw.currency,
    costOfGoods: raw.costOfGoods,
    margin: raw.margin,
    marginPercent: raw.marginPercent,
    salesperson: raw.salesperson?._id ? { id: raw.salesperson._id, name: raw.salesperson.name, email: raw.salesperson.email } : raw.salesperson,
    status: raw.status,
    paymentMethod: raw.paymentMethod,
    discount: raw.discount,
    taxRate: raw.taxRate,
    taxAmount: raw.taxAmount,
    grossPrice: raw.grossPrice,
    totalPrice: raw.totalPrice,
    externalDealId: raw.externalDealId,
    notes: raw.notes,
    meta: raw.meta,
    closedAt: raw.closedAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export const salesService = {
  async list(params: SaleSearchParams = {}): Promise<PaginatedResponse<Sale>> {
    const qs = buildQuery(params)
    const res = await authorizedFetch(`${API_BASE_URL}/sales${qs}`)
    if (!res.ok) throw new Error('Failed to fetch sales')
    const json = await res.json() as { success: boolean; data: { data: RawSale[]; pagination: { total:number; page:number; pages:number; limit:number } } }
    const items = json.data.data.map(normalize)
    return {
      data: items,
      page: json.data.pagination.page,
      limit: json.data.pagination.limit,
      total: json.data.pagination.total,
      totalPages: json.data.pagination.pages,
    }
  },
  async get(id: string): Promise<ApiResponse<Sale>> {
    const res = await authorizedFetch(`${API_BASE_URL}/sales/${id}`)
    if (!res.ok) throw new Error('Failed to fetch sale')
    const json = await res.json() as { success: boolean; data: RawSale }
    return { data: normalize(json.data) }
  },
  async create(payload: Partial<Pick<Sale,'vehicle'|'customerName'|'customerEmail'|'salePrice'|'currency'|'costOfGoods'|'discount'|'taxRate'|'paymentMethod'|'externalDealId'|'notes'|'meta'>>): Promise<ApiResponse<Sale>> {
    const res = await authorizedFetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to create sale')
    const json = await res.json() as { success: boolean; data: RawSale }
    return { data: normalize(json.data) }
  },
  async update(id: string, payload: Partial<Sale>): Promise<ApiResponse<Sale>> {
    const res = await authorizedFetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to update sale')
    const json = await res.json() as { success: boolean; data: RawSale }
    return { data: normalize(json.data) }
  },
  async complete(id: string): Promise<ApiResponse<Sale>> {
    const res = await authorizedFetch(`${API_BASE_URL}/sales/${id}/complete`, { method: 'POST' })
    if (!res.ok) throw new Error('Failed to complete sale')
    const json = await res.json() as { success: boolean; data: RawSale }
    return { data: normalize(json.data) }
  },
  async cancel(id: string): Promise<ApiResponse<Sale>> {
    const res = await authorizedFetch(`${API_BASE_URL}/sales/${id}/cancel`, { method: 'POST' })
    if (!res.ok) throw new Error('Failed to cancel sale')
    const json = await res.json() as { success: boolean; data: RawSale }
    return { data: normalize(json.data) }
  },
  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await authorizedFetch(`${API_BASE_URL}/sales/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete sale')
    return res.json()
  },
  async summary(params: { from?: string; to?: string; salesperson?: string } = {}): Promise<ApiResponse<SalesSummaryBucket[]>> {
    const qs = buildQuery(params)
    const res = await authorizedFetch(`${API_BASE_URL}/sales/summary${qs}`)
    if (!res.ok) throw new Error('Failed to fetch sales summary')
    return res.json()
  }
}

export default salesService
