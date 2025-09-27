import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { SectionCards } from "~/components/section-cards"
import { useDashboardAnalytics } from "~/hooks/useDashboardAnalytics"

// layout wrappers moved to root `routes/__app.tsx`

export default function Page() {
  const { data, loading, error } = useDashboardAnalytics()

  const stats = data ? {
    revenue: data.kpis.revenue,
    revenueGrowth: data.kpis.revenueGrowth,
    salesCount: data.kpis.salesCount,
    salesGrowth: data.kpis.salesGrowth,
    totalVehicles: data.kpis.totalVehicles,
    newVehicles: data.kpis.newVehicles,
    enquiries: data.kpis.enquiries,
    carSubmissions: data.kpis.carSubmissions,
  } : undefined

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <SectionCards loading={loading} stats={stats} />
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load analytics: {error}
        </div>
      )}
      <ChartAreaInteractive data={data?.trend} />
      {/* Future: breakdown widgets, tables, etc. */}
      {data?.meta?.cached && (
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Served from cache</p>
      )}
    </div>
  )
}
