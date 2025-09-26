import { auth } from '~/lib/auth'
import type { CarSubmission, CarSubmissionSearchParams, PaginatedResponse, ApiResponse, CarSubmissionStatus, CarSubmissionPriority, CarSubmissionContactEntry } from '~/types/car-submission'

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3001/api/v1'

function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = auth.getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  return fetch(input, { ...init, headers, credentials: 'include' })
}

function buildQuery(params: Record<string, any>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '') search.set(k, String(v)) })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

interface RawSubmission {
  _id: string
  vehicle: any
  owner: any
  pricing?: any
  evaluation?: any
  inspection?: any
  offer?: any
  status: CarSubmissionStatus
  priority: CarSubmissionPriority
  adminNotes?: string
  assignedTo?: string
  contactHistory?: CarSubmissionContactEntry[]
  source?: string
  createdAt: string
  updatedAt: string
  // Some API responses include media.images instead of embedding images in vehicle
  media?: { images?: string[]; documents?: any[] }
}

function normalize(s: RawSubmission): CarSubmission {
  // Ensure vehicle images are available even if provided under media
  const vehicle = { ...(s.vehicle || {}) }
  if (!vehicle.images && s.media?.images?.length) {
    vehicle.images = s.media.images
  }
  return {
    id: s._id,
    vehicle,
    owner: s.owner,
    pricing: s.pricing,
    evaluation: s.evaluation,
    inspection: s.inspection,
    offer: s.offer,
    status: s.status,
    priority: s.priority,
    adminNotes: s.adminNotes,
    assignedTo: s.assignedTo,
    contactHistory: s.contactHistory || [],
    source: s.source,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }
}

export const carSubmissionsService = {
  async getSubmissions(params: CarSubmissionSearchParams = {}): Promise<PaginatedResponse<CarSubmission>> {
    const qs = buildQuery(params)
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions${qs}`)
    if (!res.ok) throw new Error('Failed to fetch car submissions')
    const json: any = await res.json()
    const page = Number(json.pagination?.currentPage || 1)
    const totalPages = json.pagination?.totalPages || 1
    const total = json.pagination?.totalCount || json.data.length
    const limit = params.limit || json.data.length
  return { data: json.data.map(normalize), page, limit, total, totalPages }
  },
  async getSubmission(id: string): Promise<ApiResponse<CarSubmission>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/${id}`)
    if (!res.ok) throw new Error('Failed to fetch submission')
    const json: any = await res.json()
    return { data: normalize(json.data) }
  },
  async updateSubmission(id: string, data: Partial<Pick<CarSubmission,'status'|'priority'|'adminNotes'|'assignedTo'|'evaluation'|'inspection'|'offer'>>): Promise<ApiResponse<CarSubmission>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update submission')
    const json: any = await res.json()
    return { data: normalize(json.data) }
  },
  async assignSubmission(id: string, assignedTo: string): Promise<ApiResponse<CarSubmission>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/${id}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo }),
    })
    if (!res.ok) throw new Error('Failed to assign submission')
    const json: any = await res.json()
    return { data: normalize(json.data) }
  },
  async addContact(id: string, entry: { method: CarSubmissionContactEntry['method']; notes: string }): Promise<ApiResponse<CarSubmission>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/${id}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    if (!res.ok) throw new Error('Failed to add contact history')
    const json: any = await res.json()
    return { data: normalize(json.data) }
  },
  async deleteSubmission(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete submission')
    return res.json()
  },
  async getStats(): Promise<ApiResponse<any>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/stats`)
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
  },
  async getMyAssignments(): Promise<PaginatedResponse<CarSubmission>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/my-assignments`)
    if (!res.ok) throw new Error('Failed to fetch assignments')
    const json: any = await res.json()
    return { data: json.data.map(normalize), page: 1, limit: json.data.length, total: json.data.length, totalPages: 1 }
  },
  async getAttention(): Promise<PaginatedResponse<CarSubmission>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/attention`)
    if (!res.ok) throw new Error('Failed to fetch attention list')
    const json: any = await res.json()
    return { data: json.data.map(normalize), page: 1, limit: json.data.length, total: json.data.length, totalPages: 1 }
  },
  async searchOwner(term: string): Promise<ApiResponse<CarSubmission[]>> {
    const res = await authorizedFetch(`${API_BASE_URL}/car-submissions/search/owner?term=${encodeURIComponent(term)}`)
    if (!res.ok) throw new Error('Failed to search owners')
    const json: any = await res.json()
    return { data: json.data.map(normalize) }
  }
}

export default carSubmissionsService
