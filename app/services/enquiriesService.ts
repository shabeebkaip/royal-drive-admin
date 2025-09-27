import type {
  VehicleEnquiry,
  EnquirySearchParams,
  PaginatedResponse,
  ApiResponse,
  EnquiryContactEntry,
  EnquiryStatus,
  EnquiryPriority,
} from "~/types/enquiry"
import { auth } from "~/lib/auth"

// Raw backend shape (partial) used for normalization
interface RawVehicleEnquiry {
  _id: string
  vehicle?: {
    _id: string
    year?: number
    make?: { _id: string; name: string; slug?: string }
    model?: { _id: string; name: string; slug?: string }
    pricing?: { listPrice?: number }
  }
  customer: any
  enquiry: any
  interests: any
  status: EnquiryStatus
  priority: EnquiryPriority
  assignedTo?: string
  adminNotes?: string
  contactHistory?: EnquiryContactEntry[]
  source?: string
  createdAt: string
  updatedAt: string
}

function normalize(enq: RawVehicleEnquiry): VehicleEnquiry {
  return {
    id: enq._id,
    vehicleId: enq.vehicle?._id,
    vehicle: enq.vehicle
      ? {
          id: enq.vehicle._id,
          year: enq.vehicle.year,
          make: enq.vehicle.make?.name,
          model: enq.vehicle.model?.name,
          listPrice: enq.vehicle.pricing?.listPrice,
        }
      : undefined,
    customer: enq.customer,
    enquiry: enq.enquiry,
    interests: enq.interests || {},
    status: enq.status,
    priority: enq.priority,
    assignedTo: enq.assignedTo,
    adminNotes: enq.adminNotes,
    contactHistory: enq.contactHistory || [],
    source: enq.source,
    createdAt: enq.createdAt,
    updatedAt: enq.updatedAt,
  }
}

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string | undefined) || "https://api.royaldrivecanada.com/api/v1"

function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = auth.getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set("Authorization", `Bearer ${token}`)
  // Always accept JSON
  if (!headers.has("Accept")) headers.set("Accept", "application/json")
  return fetch(input, { ...init, headers, credentials: "include" })
}

function buildQuery(params: Record<string, any>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k,v]) => {
    if (v !== undefined && v !== null && v !== '') search.set(k, String(v))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const enquiriesService = {
  async getEnquiries(params: EnquirySearchParams = {}): Promise<PaginatedResponse<VehicleEnquiry>> {
    const qs = buildQuery(params)
    const res = await authorizedFetch(`${API_BASE_URL}/enquiries${qs}`)
    if (!res.ok) throw new Error('Failed to fetch enquiries')
    const json: { success: boolean; message?: string; data: RawVehicleEnquiry[]; pagination?: { currentPage: string | number; totalPages: number; totalCount: number } } = await res.json()
    const page = Number(json.pagination?.currentPage || 1)
    const totalPages = json.pagination?.totalPages || 1
    const total = json.pagination?.totalCount || json.data.length
    const limit = params.limit || json.data.length
    return {
      data: json.data.map(normalize),
      page,
      limit,
      total,
      totalPages,
    }
  },
  async getEnquiry(id: string): Promise<ApiResponse<VehicleEnquiry>> {
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/${id}`)
  if (!res.ok) throw new Error('Failed to fetch enquiry')
  const json: { success: boolean; data: RawVehicleEnquiry } = await res.json()
  return { data: normalize(json.data) }
  },
  async getStats(): Promise<ApiResponse<{ total:number; byStatus: Record<EnquiryStatus, number>; byType: Record<string, number>; responseTimeAvg?: number }>> {
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/stats`)
    if (!res.ok) throw new Error('Failed to fetch enquiry stats')
    return res.json()
  },
  async getMyAssignments(): Promise<PaginatedResponse<VehicleEnquiry>> {
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/my-assignments`)
    if (!res.ok) throw new Error('Failed to fetch assignments')
    return res.json()
  },
  async getByVehicle(vehicleId: string, params: Omit<EnquirySearchParams, 'vehicleId'> = {}): Promise<PaginatedResponse<VehicleEnquiry>> {
    const qs = buildQuery(params)
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/vehicle/${vehicleId}${qs}`)
    if (!res.ok) throw new Error('Failed to fetch vehicle enquiries')
    return res.json()
  },
  async updateEnquiry(id: string, data: Partial<Pick<VehicleEnquiry,'status'|'priority'|'adminNotes'|'assignedTo'>>): Promise<ApiResponse<VehicleEnquiry>> {
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  if (!res.ok) throw new Error('Failed to update enquiry')
  const json: { success: boolean; data: RawVehicleEnquiry } = await res.json()
  return { data: normalize(json.data) }
  },
  async quickUpdateStatus(id: string, status: EnquiryStatus): Promise<ApiResponse<VehicleEnquiry>> {
    return this.updateEnquiry(id, { status })
  },
  async assignEnquiry(id: string, assignedTo: string): Promise<ApiResponse<VehicleEnquiry>> {
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/${id}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo }),
    })
  if (!res.ok) throw new Error('Failed to assign enquiry')
  const json: { success: boolean; data: RawVehicleEnquiry } = await res.json()
  return { data: normalize(json.data) }
  },
  async addContactHistory(id: string, entry: { method: EnquiryContactEntry['method']; notes: string }): Promise<ApiResponse<VehicleEnquiry>> {
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/${id}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
  if (!res.ok) throw new Error('Failed to add contact history')
  const json: { success: boolean; data: RawVehicleEnquiry } = await res.json()
  return { data: normalize(json.data) }
  },
  async deleteEnquiry(id: string): Promise<ApiResponse<{ id: string }>> {
  const res = await authorizedFetch(`${API_BASE_URL}/enquiries/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete enquiry')
    return res.json()
  }
}

export default enquiriesService
