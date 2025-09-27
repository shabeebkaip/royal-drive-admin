export interface DashboardAnalyticsResponse {
  period: { start: string; end: string }
  kpis: {
    totalVehicles: number
    newVehicles: number
    enquiries: number
    carSubmissions: number
    activeUsers: number
    avgDaysInInventory: number
    revenue: number
    revenueGrowth: number
    salesCount: number
    salesGrowth: number
    totalMargin: number
    avgMargin: number
  }
  breakdown: {
    vehiclesByStatus: Record<string, number>
    enquiriesByStatus: Record<string, number>
    submissionsByStatus: Record<string, number>
  }
  topMakes: { makeId: string; count: number; name: string; slug?: string }[]
  trend: { date: string; vehicles: number; enquiries: number; submissions: number }[]
  trendSmoothed: { date: string; vehicles: number; vehiclesSmoothed: number; enquiries: number; enquiriesSmoothed: number; submissions: number; submissionsSmoothed: number }[]
  meta?: { cached?: boolean }
}

export type DashboardPeriod = 'last_7_days' | 'last_30_days' | 'last_90_days' | 'ytd' | 'custom'