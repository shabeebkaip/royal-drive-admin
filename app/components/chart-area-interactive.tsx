"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "~/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/components/ui/toggle-group"

export const description = "An interactive area chart"

interface TrendPoint { date: string; vehicles: number; enquiries: number; submissions: number; sales: number; salesRevenue: number }

const chartConfig = {
  vehicles: { label: 'Vehicles', color: 'hsl(var(--chart-1))' },
  enquiries: { label: 'Enquiries', color: 'hsl(var(--chart-2))' },
  submissions: { label: 'Submissions', color: 'hsl(var(--chart-3))' },
  sales: { label: 'Sales', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig
export function ChartAreaInteractive({ data }: { data: TrendPoint[] | undefined }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState('30d')
  const [series, setSeries] = React.useState<{ vehicles: boolean; enquiries: boolean; submissions: boolean; sales: boolean }>({ vehicles: true, enquiries: true, submissions: true, sales: true })

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const src = data || []
  console.log('Chart data:', src)
  const referenceDate = src.length ? new Date(src[src.length - 1].date) : new Date()
  const filteredData = src.filter((item) => {
    const date = new Date(item.date)
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
  <CardTitle>Activity Trend</CardTitle>
  <CardDescription>Vehicles, enquiries, submissions & sales</CardDescription>
        <CardAction>
          <div className="flex flex-col gap-2 @container/action">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">90d</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">Last 90 days</SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 text-xs">
              <label className="flex items-center gap-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={series.vehicles} 
                  onChange={(e) => setSeries(s => ({ ...s, vehicles: e.target.checked }))}
                  className="w-3 h-3"
                />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--chart-1))' }}></div>
                Vehicles
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={series.enquiries} 
                  onChange={(e) => setSeries(s => ({ ...s, enquiries: e.target.checked }))}
                  className="w-3 h-3"
                />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--chart-2))' }}></div>
                Enquiries
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={series.submissions} 
                  onChange={(e) => setSeries(s => ({ ...s, submissions: e.target.checked }))}
                  className="w-3 h-3"
                />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--chart-3))' }}></div>
                Submissions
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={series.sales} 
                  onChange={(e) => setSeries(s => ({ ...s, sales: e.target.checked }))}
                  className="w-3 h-3"
                />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--chart-4))' }}></div>
                Sales
              </label>
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
      <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillVehicles" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'hsl(var(--chart-1))'} stopOpacity={0.5} />
                <stop offset="95%" stopColor={'hsl(var(--chart-1))'} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillEnquiries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'hsl(var(--chart-2))'} stopOpacity={0.5} />
                <stop offset="95%" stopColor={'hsl(var(--chart-2))'} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'hsl(var(--chart-3))'} stopOpacity={0.5} />
                <stop offset="95%" stopColor={'hsl(var(--chart-3))'} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'hsl(var(--chart-4))'} stopOpacity={0.5} />
                <stop offset="95%" stopColor={'hsl(var(--chart-4))'} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {filteredData.length < 2 ? (
              // Not enough points to draw a meaningful area curve
              <text x="50%" y="45%" textAnchor="middle" className="fill-muted-foreground text-sm">
                Not enough data points for trend visualization
              </text>
            ) : (
              <>
                {series.vehicles && (
                  <Area
                    dataKey="vehicles"
                    type="monotone"
                    fill="url(#fillVehicles)"
                    stroke={'hsl(var(--chart-1))'}
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                    isAnimationActive={false}
                  />
                )}
                {series.enquiries && (
                  <Area
                    dataKey="enquiries"
                    type="monotone"
                    fill="url(#fillEnquiries)"
                    stroke={'hsl(var(--chart-2))'}
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                    isAnimationActive={false}
                  />
                )}
                {series.submissions && (
                  <Area
                    dataKey="submissions"
                    type="monotone"
                    fill="url(#fillSubmissions)"
                    stroke={'hsl(var(--chart-3))'}
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                    isAnimationActive={false}
                  />
                )}
                {series.sales && (
                  <Area
                    dataKey="sales"
                    type="monotone"
                    fill="url(#fillSales)"
                    stroke={'hsl(var(--chart-4))'}
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 2, r: 4 }}
                    isAnimationActive={false}
                  />
                )}
              </>
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
