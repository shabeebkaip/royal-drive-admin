export interface DashboardAnalyticsResponse {
  period: { start: string; end: string }
  kpis: {
    totalVehicles: number
    newVehicles: number
    vehicleEnquiries: number
    carSubmissions: number
    contactEnquiries: number
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
    vehicleEnquiriesByStatus: Record<string, number>
    carSubmissionsByStatus: Record<string, number>
    contactEnquiriesByStatus: Record<string, number>
  }
  topMakes: { makeId: string; count: number; name: string; slug?: string }[]
  trend: { date: string; vehicles: number; vehicleEnquiries: number; carSubmissions: number; contactEnquiries: number; sales: number; salesRevenue: number }[]
  trendSmoothed: { date: string; vehicles: number; vehiclesSmoothed: number; vehicleEnquiries: number; vehicleEnquiriesSmoothed: number; carSubmissions: number; carSubmissionsSmoothed: number; contactEnquiries: number; contactEnquiriesSmoothed: number; sales: number; salesSmoothed: number; salesRevenue: number; salesRevenueSmoothed: number }[]
  meta?: { cached?: boolean }
}

export type DashboardPeriod = 'all_time' | 'last_7_days' | 'last_30_days' | 'last_90_days' | 'ytd' | 'custom'