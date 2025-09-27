import { auth } from '~/lib/auth'
import type { DashboardAnalyticsResponse, DashboardPeriod } from '~/types/analytics'

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string | undefined) || 'https://api.royaldrivecanada.com/api/v1'

function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = auth.getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  return fetch(input, { ...init, headers, credentials: 'include' })
}

function buildQuery(params: Record<string, any>) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '') qs.set(k, String(v)) })
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export const analyticsService = {
  async getDashboard(opts: { period?: DashboardPeriod; dateFrom?: string; dateTo?: string } = {}) {
    const qs = buildQuery(opts)
    const res = await authorizedFetch(`${API_BASE_URL}/analytics/dashboard${qs}`)
    if (!res.ok) throw new Error('Failed to fetch dashboard analytics')
    const json: { success: boolean; data: DashboardAnalyticsResponse } = await res.json()
    return json.data
  }
}

export default analyticsService