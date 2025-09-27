import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { TrendingUp, DollarSign, Users, Percent } from 'lucide-react'
import salesService from '~/services/salesService'
import type { SalesSummaryBucket } from '~/types/sale'

export function SalesSummary() {
  const [summary, setSummary] = useState<SalesSummaryBucket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSummary()
  }, [])

  const loadSummary = async () => {
    try {
      setIsLoading(true)
      const response = await salesService.summary()
      setSummary(response.data)
    } catch (error) {
      console.error('Failed to load sales summary:', error)
      setSummary([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusSummary = (status: string) => {
    return summary.find(s => s._id === status) || { _id: status, count: 0, totalRevenue: 0, totalGross: 0, totalMargin: 0 }
  }

  const completed = getStatusSummary('completed')
  const pending = getStatusSummary('pending')
  const cancelled = getStatusSummary('cancelled')

  const totalSales = summary.reduce((acc, curr) => acc + curr.count, 0)
  const totalRevenue = summary.reduce((acc, curr) => acc + curr.totalRevenue, 0)
  const totalMargin = summary.reduce((acc, curr) => curr._id !== 'cancelled' ? acc + curr.totalMargin : acc, 0)
  const avgMargin = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSales}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge variant="default" className="text-xs">{completed.count} Completed</Badge>
            <Badge variant="secondary" className="text-xs">{pending.count} Pending</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            Including taxes and fees
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Margin</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalMargin)}</div>
          <p className="text-xs text-muted-foreground">
            Gross profit earned
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Margin %</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgMargin.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Average profit margin
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
