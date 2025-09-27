import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

interface KPIProps {
  loading?: boolean
  error?: string | null
  stats?: {
    revenue: number
    revenueGrowth: number
    salesCount: number
    salesGrowth: number
    totalVehicles: number
    newVehicles: number
    enquiries: number
    carSubmissions: number
  }
}

function fmtCurrency(n: number | undefined) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
}
function fmtNumber(n: number | undefined) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString()
}
function growthBadge(value: number | undefined) {
  if (value == null || isNaN(value)) return <Badge variant="outline">NA</Badge>
  const positive = value >= 0
  const Icon = positive ? IconTrendingUp : IconTrendingDown
  return (
    <Badge variant="outline" className={positive ? 'text-green-600' : 'text-red-600'}>
      <Icon /> {positive ? '+' : ''}{value.toFixed(1)}%
    </Badge>
  )
}

export function SectionCards({ loading, error, stats }: KPIProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '…' : fmtCurrency(stats?.revenue)}
          </CardTitle>
          <CardAction>{growthBadge(stats?.revenueGrowth)}</CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Total revenue in period</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sales</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '…' : fmtNumber(stats?.salesCount)}
          </CardTitle>
          <CardAction>{growthBadge(stats?.salesGrowth)}</CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Completed sales</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Vehicles</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '…' : fmtNumber(stats?.totalVehicles)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">+{loading || stats?.newVehicles == null ? '…' : stats.newVehicles}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Inventory size / new added</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '…' : fmtNumber((stats?.enquiries || 0) + (stats?.carSubmissions || 0))}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Veh: {stats?.enquiries ?? 0} / Sub: {stats?.carSubmissions ?? 0}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Enquiries + submissions</div>
        </CardFooter>
      </Card>
    </div>
  )
}
