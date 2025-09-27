import { useDashboardAnalytics } from "~/hooks/useDashboardAnalytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { IconTrendingUp, IconTrendingDown, IconCar, IconUsers, IconCurrencyDollar, IconClipboardList, IconChartBar } from "@tabler/icons-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

// Utility functions
function fmtCurrency(n: number | undefined) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
}

function fmtNumber(n: number | undefined) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString()
}

function GrowthBadge({ value }: { value: number | undefined }) {
  if (value == null || isNaN(value)) return <Badge variant="outline">NA</Badge>
  const positive = value >= 0
  const Icon = positive ? IconTrendingUp : IconTrendingDown
  return (
    <Badge variant="outline" className={positive ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}>
      <Icon className="w-3 h-3 mr-1" />
      {positive ? '+' : ''}{value.toFixed(1)}%
    </Badge>
  )
}

// Chart colors
const chartColors = {
  vehicles: '#3b82f6',    // Blue
  enquiries: '#f59e0b',   // Amber
  submissions: '#8b5cf6', // Purple
  sales: '#10b981',       // Emerald
  revenue: '#ef4444'      // Red
}

const pieColors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#6b7280']

export default function Page() {
  const { data, loading, error, period, setPeriod } = useDashboardAnalytics()

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <IconChartBar className="w-5 h-5" />
              <span className="font-medium">Failed to load dashboard analytics</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  // Prepare chart data
  const trendData = data.trend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    vehicles: item.vehicles,
    enquiries: item.enquiries,
    submissions: item.submissions,
    sales: item.sales,
    revenue: item.salesRevenue
  }))

  // Prepare pie chart data for breakdown
  const breakdownData = [
    { name: 'Vehicles', value: data.kpis.totalVehicles, color: chartColors.vehicles },
    { name: 'Enquiries', value: data.kpis.enquiries, color: chartColors.enquiries },
    { name: 'Submissions', value: data.kpis.carSubmissions, color: chartColors.submissions },
    { name: 'Sales', value: data.kpis.salesCount, color: chartColors.sales }
  ].filter(item => item.value > 0)

  const totalActivity = breakdownData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6 p-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Analytics overview for {new Date(data.period.start).toLocaleDateString()} - {new Date(data.period.end).toLocaleDateString()}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-blue-700">Revenue</CardDescription>
            <IconCurrencyDollar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{fmtCurrency(data.kpis.revenue)}</div>
            <div className="flex items-center gap-2 mt-1">
              <GrowthBadge value={data.kpis.revenueGrowth} />
              <span className="text-xs text-blue-700">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-emerald-700">Sales</CardDescription>
            <IconChartBar className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{fmtNumber(data.kpis.salesCount)}</div>
            <div className="flex items-center gap-2 mt-1">
              <GrowthBadge value={data.kpis.salesGrowth} />
              <span className="text-xs text-emerald-700">completed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-violet-700">Vehicles</CardDescription>
            <IconCar className="w-4 h-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-900">{fmtNumber(data.kpis.totalVehicles)}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-violet-700">
                +{data.kpis.newVehicles} new
              </Badge>
              <span className="text-xs text-violet-700">in inventory</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-amber-700">Leads</CardDescription>
            <IconUsers className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {fmtNumber(data.kpis.enquiries + data.kpis.carSubmissions)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-amber-700">
                {data.kpis.enquiries}E + {data.kpis.carSubmissions}S
              </Badge>
              <span className="text-xs text-amber-700">total leads</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* Activity Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChartBar className="w-5 h-5" />
              Activity Trend
            </CardTitle>
            <CardDescription>Daily activity across all metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="vehicles" fill={chartColors.vehicles} name="Vehicles" />
                  <Bar dataKey="enquiries" fill={chartColors.enquiries} name="Enquiries" />
                  <Bar dataKey="submissions" fill={chartColors.submissions} name="Submissions" />
                  <Bar dataKey="sales" fill={chartColors.sales} name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCurrencyDollar className="w-5 h-5" />
              Sales Revenue Trend
            </CardTitle>
            <CardDescription>Daily sales revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={chartColors.revenue} 
                    strokeWidth={3}
                    dot={{ fill: chartColors.revenue, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        {/* Activity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>Distribution of all activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {breakdownData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key business indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Days in Inventory</span>
              <span className="font-semibold">{data.kpis.avgDaysInInventory.toFixed(1)} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Margin</span>
              <span className="font-semibold">{fmtCurrency(data.kpis.totalMargin)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Margin per Sale</span>
              <span className="font-semibold">{fmtCurrency(data.kpis.avgMargin)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="font-semibold">{data.kpis.activeUsers}</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Makes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vehicle Makes</CardTitle>
            <CardDescription>Most popular brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topMakes.map((make, index) => (
                <div key={make.makeId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{make.name}</span>
                  </div>
                  <Badge variant="secondary">{make.count} vehicles</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cache indicator */}
      {data.meta?.cached && (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            <IconClipboardList className="w-3 h-3 mr-1" />
            Data served from cache
          </Badge>
        </div>
      )}
    </div>
  )
}
