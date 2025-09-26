import { useEnquiries } from '~/hooks/useEnquiries'
import { SimpleEnquiriesTable } from '~/components/enquiries/enquiries-simple-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export default function VehicleEnquiriesPage() {
  const { data, loading, status, priority, setStatus, setPriority, search, setSearch, refetch } = useEnquiries()

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Vehicle Enquiries</h1>
        <p className="text-sm text-muted-foreground">Manage customer enquiries originating from vehicle pages.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-40">
          <Select value={status} onValueChange={v => setStatus(v as any)}>
            <SelectTrigger size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {['new','contacted','in-progress','completed','closed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-40">
          <Select value={priority} onValueChange={v => setPriority(v as any)}>
            <SelectTrigger size="sm"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              {['low','medium','high'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-56">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="h-9" />
        </div>
        <Button size="sm" onClick={() => refetch()} disabled={loading}>Apply</Button>
        <Button variant="ghost" size="sm" onClick={() => { setStatus(undefined); setPriority(undefined); setSearch(''); refetch() }}>Reset</Button>
      </div>

      <SimpleEnquiriesTable data={data} loading={loading} />
    </div>
  )
}
