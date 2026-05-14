import type { Route } from "./+types/sync-history"
import { useEffect, useState } from "react"
import { api } from "~/lib/api"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { PageTitle } from "~/components/shared/page-title"
import { DataTableWithoutPagination } from "~/components/shared/data-table"
import { ShimmerTableLoader } from "~/components/shared/shimmer-table-loader"
import { Card, CardContent } from "~/components/ui/card"
import type { ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle2, XCircle, AlertTriangle, Loader2,
  RotateCcw, Clock, Database, CalendarDays, TrendingUp,
} from "lucide-react"

interface SyncLog {
  _id: string
  startedAt: string
  completedAt?: string
  durationSeconds?: number
  trigger: "manual" | "scheduled"
  status: "running" | "success" | "partial" | "failed"
  result: { total: number; created: number; updated: number; skipped: number; errors: number }
  errorMessage?: string
  errorDetails?: Array<{ edealerId: string; error: string }>
}

function StatusBadge({ status }: { status: SyncLog["status"] }) {
  const cfg = {
    success: { label: "Success",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
    partial:  { label: "Partial",  cls: "bg-amber-50 text-amber-700 border-amber-200",   Icon: AlertTriangle },
    failed:   { label: "Failed",   cls: "bg-red-50 text-red-700 border-red-200",         Icon: XCircle },
    running:  { label: "Running",  cls: "bg-blue-50 text-blue-700 border-blue-200",      Icon: Loader2 },
  }[status] ?? { label: status, cls: "bg-gray-50 text-gray-700 border-gray-200", Icon: Loader2 }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <cfg.Icon className={`w-3.5 h-3.5 ${status === "running" ? "animate-spin" : ""}`} />
      {cfg.label}
    </span>
  )
}

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" }) : "—"

const fmtDur = (s?: number) => {
  if (s == null) return "—"
  const m = Math.floor(s / 60), sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

const buildColumns = (): ColumnDef<SyncLog>[] => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "trigger",
    header: "Trigger",
    cell: ({ row }) => (
      <Badge variant={row.original.trigger === "manual" ? "default" : "secondary"} className="text-xs">
        {row.original.trigger}
      </Badge>
    ),
  },
  {
    accessorKey: "startedAt",
    header: "Started",
    cell: ({ row }) => <span className="text-sm text-gray-700 whitespace-nowrap">{fmtDate(row.original.startedAt)}</span>,
  },
  {
    accessorKey: "completedAt",
    header: "Completed",
    cell: ({ row }) => <span className="text-sm text-gray-700 whitespace-nowrap">{fmtDate(row.original.completedAt)}</span>,
  },
  {
    accessorKey: "durationSeconds",
    header: "Duration",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 text-gray-500 text-sm whitespace-nowrap">
        <Clock className="w-3.5 h-3.5" />{fmtDur(row.original.durationSeconds)}
      </span>
    ),
  },
  {
    accessorKey: "result.total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900 text-sm">
        {row.original.result.total > 0 ? row.original.result.total : <span className="text-gray-300">—</span>}
      </span>
    ),
  },
  {
    accessorKey: "result.created",
    header: "+New",
    cell: ({ row }) => {
      const n = row.original.result.created
      return n > 0
        ? <span className="font-bold text-emerald-600 text-sm">+{n}</span>
        : <span className="text-gray-300 text-sm">—</span>
    },
  },
  {
    accessorKey: "result.updated",
    header: "Updated",
    cell: ({ row }) => {
      const n = row.original.result.updated
      return n > 0
        ? <span className="font-semibold text-blue-600 text-sm">{n}</span>
        : <span className="text-gray-300 text-sm">—</span>
    },
  },
  {
    accessorKey: "result.errors",
    header: "Errors",
    cell: ({ row }) => {
      const n = row.original.result.errors
      return n > 0
        ? <span className="font-bold text-red-600 text-sm">{n}</span>
        : <span className="text-gray-300 text-sm">0</span>
    },
  },
  {
    id: "error",
    header: "Error Detail",
    cell: ({ row }) => {
      const msg = row.original.errorMessage
      if (!msg) return null
      return (
        <div className="max-w-xs">
          <p className="text-xs text-red-600 font-medium truncate" title={msg}>{msg}</p>
          {(row.original.errorDetails?.length ?? 0) > 0 && (
            <p className="text-[10px] text-red-400 mt-0.5">
              +{row.original.errorDetails!.length} vehicle-level error{row.original.errorDetails!.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )
    },
  },
]

// ── Analytics stat card ────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; color: string
}) {
  return (
    <Card className="border">
      <CardContent className="p-5 flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function SyncHistoryPage(_: Route.ComponentProps) {
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ success: boolean; data: SyncLog[] }>("/edealer/sync/history?limit=50")
      if (res.success) setLogs(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const totalRuns = logs.length
  const successful = logs.filter(l => l.status === "success").length
  const failed = logs.filter(l => l.status === "failed" || l.status === "partial").length
  const totalCreated = logs.reduce((s, l) => s + l.result.created, 0)
  const lastRun = logs[0]
  const avgDur = logs.filter(l => l.durationSeconds != null).length > 0
    ? Math.round(logs.filter(l => l.durationSeconds != null).reduce((s, l) => s + (l.durationSeconds ?? 0), 0) / logs.filter(l => l.durationSeconds != null).length)
    : null

  const columns = buildColumns()

  return (
    <div className="space-y-6 p-4">
      <PageTitle
        title="EDealer Sync History"
        description="Track every sync run — manual and scheduled. Failed syncs trigger an email alert automatically."
        actions={
          <Button variant="outline" onClick={load} disabled={loading}>
            <RotateCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {/* Analytics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
        <StatCard
          label="Total Runs"
          value={totalRuns}
          icon={Database}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Successful"
          value={successful}
          sub={totalRuns > 0 ? `${Math.round((successful / totalRuns) * 100)}% success rate` : undefined}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Failed / Partial"
          value={failed}
          sub={failed > 0 ? "Check email for alerts" : "All good!"}
          icon={XCircle}
          color={failed > 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"}
        />
        <StatCard
          label="Vehicles Added"
          value={totalCreated > 0 ? `+${totalCreated}` : "0"}
          sub="Across all syncs"
          icon={TrendingUp}
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Avg Duration"
          value={avgDur != null ? fmtDur(avgDur) : "—"}
          sub={lastRun ? `Last: ${fmtDate(lastRun.startedAt).split(",")[0]}` : undefined}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Status summary badges */}
      <div className="flex gap-3 flex-wrap px-4">
        <Badge variant="outline" className="px-3 py-1">All: <span className="font-bold ml-1">{totalRuns}</span></Badge>
        <Badge className="px-3 py-1 bg-emerald-600 hover:bg-emerald-600">Success: <span className="font-bold ml-1">{successful}</span></Badge>
        {failed > 0 && <Badge variant="destructive" className="px-3 py-1">Failed: <span className="font-bold ml-1">{failed}</span></Badge>}
        {logs.filter(l => l.status === "running").length > 0 && (
          <Badge className="px-3 py-1 bg-blue-600 hover:bg-blue-600">Running: <span className="font-bold ml-1">{logs.filter(l => l.status === "running").length}</span></Badge>
        )}
      </div>

      {/* Data table */}
      {loading ? (
        <ShimmerTableLoader rows={8} columns={10} />
      ) : (
        <DataTableWithoutPagination columns={columns} data={logs} />
      )}
    </div>
  )
}
