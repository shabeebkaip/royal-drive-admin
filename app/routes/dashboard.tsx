import { useDashboardAnalytics } from "~/hooks/useDashboardAnalytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { IconTrendingUp, IconTrendingDown, IconCar, IconUsers, IconCurrencyDollar, IconClipboardList, IconChartBar, IconCalendar, IconFilter } from "@tabler/icons-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { useEffect, useState } from "react"
import { statusesApiService } from "~/services/statusesService"
import type { StatusDropdownItem } from "~/types/status"
import type { DashboardPeriod } from "~/types/analytics"

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
  const { data, loading, error, period, setPeriod, dateFrom, setDateFrom, dateTo, setDateTo, refetch } = useDashboardAnalytics()
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})
  const [loadingStatuses, setLoadingStatuses] = useState(true)
  const [customDateFrom, setCustomDateFrom] = useState(dateFrom || '')
  const [customDateTo, setCustomDateTo] = useState(dateTo || '')
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false)

  const periodOptions: { value: DashboardPeriod; label: string }[] = [
    { value: 'all_time', label: 'All Time' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const handlePeriodChange = (newPeriod: DashboardPeriod) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setDateFrom(undefined)
      setDateTo(undefined)
      setCustomDateFrom('')
      setCustomDateTo('')
    }
  }

  const handleApplyCustomDates = () => {
    if (customDateFrom && customDateTo) {
      setPeriod('custom')
      setDateFrom(customDateFrom)
      setDateTo(customDateTo)
      setIsCustomDateOpen(false)
      refetch()
    }
  }

  // Fetch status mappings on mount
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await statusesApiService.getActiveForDropdown()
        if (response.success && response.data) {
          const map: Record<string, string> = {}
          response.data.forEach((status: StatusDropdownItem) => {
            map[status._id] = status.name
          })
          setStatusMap(map)
        }
      } catch (err) {
        console.error('Failed to fetch status mappings:', err)
      } finally {
        setLoadingStatuses(false)
      }
    }
    fetchStatuses()
  }, [])

  if (loading || loadingStatuses) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
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
    vehicleEnquiries: item.vehicleEnquiries,
    carSubmissions: item.carSubmissions,
    contactEnquiries: item.contactEnquiries,
    sales: item.sales,
    revenue: item.salesRevenue
  }))

  // Prepare pie chart data for breakdown
  const breakdownData = [
    { name: 'Vehicles', value: data.kpis.totalVehicles, color: chartColors.vehicles },
    { name: 'Vehicle Enquiries', value: data.kpis.vehicleEnquiries, color: chartColors.enquiries },
    { name: 'Car Submissions', value: data.kpis.carSubmissions, color: chartColors.submissions },
    { name: 'Contact Enquiries', value: data.kpis.contactEnquiries, color: '#ec4899' },
    { name: 'Sales', value: data.kpis.salesCount, color: chartColors.sales }
  ].filter(item => item.value > 0)

  const totalActivity = breakdownData.reduce((sum, item) => sum + item.value, 0)

  // Helper function to get status name from ID
  const getStatusName = (statusId: string): string => {
    return statusMap[statusId] || statusId
  }

  // Prepare status breakdown data
  const vehicleStatusData = Object.entries(data.breakdown.vehiclesByStatus || {}).map(([status, count]) => ({
    status: getStatusName(status),
    statusId: status,
    count,
    percentage: ((count / data.kpis.totalVehicles) * 100).toFixed(1)
  }))

  const enquiryStatusData = Object.entries(data.breakdown.vehicleEnquiriesByStatus || {}).map(([status, count]) => ({
    status: status,
    statusId: status,
    count,
    percentage: ((count / data.kpis.vehicleEnquiries) * 100).toFixed(1)
  }))

  const submissionStatusData = Object.entries(data.breakdown.carSubmissionsByStatus || {}).map(([status, count]) => ({
    status: status,
    statusId: status,
    count,
    percentage: ((count / data.kpis.carSubmissions) * 100).toFixed(1)
  }))

  // Calculate conversion metrics
  const conversionRate = data.kpis.salesCount > 0 && (data.kpis.vehicleEnquiries + data.kpis.carSubmissions + data.kpis.contactEnquiries) > 0
    ? ((data.kpis.salesCount / (data.kpis.vehicleEnquiries + data.kpis.carSubmissions + data.kpis.contactEnquiries)) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6 p-6 w-full">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Analytics overview for {new Date(data.period.start).toLocaleDateString()} - {new Date(data.period.end).toLocaleDateString()}
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <IconFilter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {period === 'custom' && (
            <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconCalendar className="w-4 h-4 mr-2" />
                  {customDateFrom && customDateTo
                    ? `${new Date(customDateFrom).toLocaleDateString()} - ${new Date(customDateTo).toLocaleDateString()}`
                    : 'Select dates'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">From Date</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => setCustomDateFrom(e.target.value)}
                      max={customDateTo || undefined}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTo">To Date</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={customDateTo}
                      onChange={(e) => setCustomDateTo(e.target.value)}
                      min={customDateFrom || undefined}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <Button
                    onClick={handleApplyCustomDates}
                    disabled={!customDateFrom || !customDateTo}
                    className="w-full"
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4">
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
              <span className="text-xs text-emerald-700">{conversionRate}% conv.</span>
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
            <CardDescription className="text-amber-700">Vehicle Enquiries</CardDescription>
            <IconClipboardList className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{fmtNumber(data.kpis.vehicleEnquiries)}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-amber-700">
                {enquiryStatusData.length} statuses
              </Badge>
              <span className="text-xs text-amber-700">tracked</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-purple-700">Car Submissions</CardDescription>
            <IconUsers className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{fmtNumber(data.kpis.carSubmissions)}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-purple-700">
                {submissionStatusData.length} statuses
              </Badge>
              <span className="text-xs text-purple-700">tracked</span>
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
                  <Bar dataKey="vehicleEnquiries" fill={chartColors.enquiries} name="Vehicle Enquiries" />
                  <Bar dataKey="carSubmissions" fill={chartColors.submissions} name="Car Submissions" />
                  <Bar dataKey="contactEnquiries" fill="#ec4899" name="Contact Enquiries" />
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

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vehicle Enquiries Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <IconClipboardList className="w-5 h-5" />
              Vehicle Enquiries
            </CardTitle>
            <CardDescription>Status distribution of vehicle enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enquiryStatusData.length > 0 ? (
                enquiryStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium capitalize">{item.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No enquiries yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Car Submissions Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <IconUsers className="w-5 h-5" />
              Car Submissions
            </CardTitle>
            <CardDescription>Status distribution of car submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissionStatusData.length > 0 ? (
                submissionStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium capitalize">{item.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No submissions yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Enquiries Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <IconUsers className="w-5 h-5" />
              Contact Enquiries
            </CardTitle>
            <CardDescription>Status distribution of contact enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.breakdown.contactEnquiriesByStatus || {}).length > 0 ? (
                Object.entries(data.breakdown.contactEnquiriesByStatus || {}).map(([status, count], index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      <span className="text-sm font-medium capitalize">{status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {((count / data.kpis.contactEnquiries) * 100).toFixed(1)}%
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No contact enquiries yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-700">
              <IconCar className="w-5 h-5" />
              Vehicle Status
            </CardTitle>
            <CardDescription>Status distribution of inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicleStatusData.length > 0 ? (
                vehicleStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                      <span className="text-sm font-medium capitalize">{item.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No vehicles yet</p>
              )}
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

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Funnel</CardTitle>
            <CardDescription>Lead to sale conversion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Total Leads</span>
                  <span className="text-sm font-semibold">{fmtNumber(data.kpis.vehicleEnquiries + data.kpis.carSubmissions + data.kpis.contactEnquiries)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-amber-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Vehicle Enquiries</span>
                  <span className="text-sm font-semibold">{fmtNumber(data.kpis.vehicleEnquiries)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-amber-400 h-3 rounded-full" 
                    style={{ width: `${((data.kpis.vehicleEnquiries / (data.kpis.vehicleEnquiries + data.kpis.carSubmissions + data.kpis.contactEnquiries)) * 100).toFixed(0)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Car Submissions</span>
                  <span className="text-sm font-semibold">{fmtNumber(data.kpis.carSubmissions)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full" 
                    style={{ width: `${((data.kpis.carSubmissions / (data.kpis.vehicleEnquiries + data.kpis.carSubmissions + data.kpis.contactEnquiries)) * 100).toFixed(0)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Contact Enquiries</span>
                  <span className="text-sm font-semibold">{fmtNumber(data.kpis.contactEnquiries)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-pink-500 h-3 rounded-full" 
                    style={{ width: `${((data.kpis.contactEnquiries / (data.kpis.vehicleEnquiries + data.kpis.carSubmissions + data.kpis.contactEnquiries)) * 100).toFixed(0)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Converted to Sales</span>
                  <span className="text-sm font-semibold text-emerald-600">{fmtNumber(data.kpis.salesCount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full" 
                    style={{ width: `${conversionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <Badge variant="default" className="bg-emerald-600">{conversionRate}%</Badge>
              </div>
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
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Avg Days in Inventory</span>
              <span className="font-semibold">{data.kpis.avgDaysInInventory.toFixed(1)} days</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Total Margin</span>
              <span className="font-semibold text-emerald-600">{fmtCurrency(data.kpis.totalMargin)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Avg Margin per Sale</span>
              <span className="font-semibold text-emerald-600">{fmtCurrency(data.kpis.avgMargin)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="font-semibold">{data.kpis.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Avg Revenue per Sale</span>
              <span className="font-semibold text-blue-600">
                {data.kpis.salesCount > 0 ? fmtCurrency(data.kpis.revenue / data.kpis.salesCount) : '—'}
              </span>
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
