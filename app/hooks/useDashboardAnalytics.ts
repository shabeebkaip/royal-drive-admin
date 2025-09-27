import { useCallback, useEffect, useState } from 'react'
import { analyticsService } from '~/services/analyticsService'
import type { DashboardAnalyticsResponse, DashboardPeriod } from '~/types/analytics'

export function useDashboardAnalytics(initial: { period?: DashboardPeriod; dateFrom?: string; dateTo?: string } = {}) {
  const [period, setPeriod] = useState<DashboardPeriod>(initial.period || 'last_30_days')
  const [dateFrom, setDateFrom] = useState<string | undefined>(initial.dateFrom)
  const [dateTo, setDateTo] = useState<string | undefined>(initial.dateTo)
  const [data, setData] = useState<DashboardAnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await analyticsService.getDashboard({ period, dateFrom, dateTo })
      setData(d)
    } catch (e: any) {
      setError(e.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [period, dateFrom, dateTo])

  useEffect(() => { fetchData() }, [fetchData])

  return { period, setPeriod, dateFrom, setDateFrom, dateTo, setDateTo, data, loading, error, refetch: fetchData }
}
