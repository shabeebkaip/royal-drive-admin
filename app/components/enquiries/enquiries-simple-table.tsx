import * as React from 'react'
import type { VehicleEnquiry, EnquiryStatus, EnquiryPriority } from '~/types/enquiry'
import { enquiriesService } from '~/services/enquiriesService'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'

interface SimpleEnquiriesTableProps {
  data: VehicleEnquiry[]
  loading?: boolean
}

export function SimpleEnquiriesTable({ data, loading }: SimpleEnquiriesTableProps) {
  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading enquiries...</div>
  if (!data.length) return <div className="p-4 text-sm text-muted-foreground">No enquiries found.</div>

  const [selected, setSelected] = React.useState<VehicleEnquiry | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [status, setStatus] = React.useState<EnquiryStatus | ''>('')
  const [priority, setPriority] = React.useState<EnquiryPriority | ''>('')
  const [notes, setNotes] = React.useState('')

  React.useEffect(() => {
    if (selected) {
      setStatus(selected.status)
      setPriority(selected.priority)
      setNotes(selected.adminNotes || '')
    }
  }, [selected])

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await enquiriesService.updateEnquiry(selected.id, {
        status: status as any,
        priority: priority as any,
        adminNotes: notes,
      })
      // Update local row (simple replace)
      Object.assign(selected, res.data)
      setSelected({ ...selected })
  // Close dialog after save
  setSelected(null)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="overflow-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="text-left">
            <th className="p-2 font-medium">Customer</th>
            <th className="p-2 font-medium">Email</th>
            <th className="p-2 font-medium">Phone</th>
            <th className="p-2 font-medium">Vehicle</th>
            <th className="p-2 font-medium">Type</th>
            <th className="p-2 font-medium">Status</th>
            <th className="p-2 font-medium">Priority</th>
            <th className="p-2 font-medium">Assigned</th>
            <th className="p-2 font-medium">Created</th>
            <th className="p-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.customer.firstName} {e.customer.lastName}</td>
              <td className="p-2">{e.customer.email}</td>
              <td className="p-2">{e.customer.phone}</td>
              <td className="p-2">{e.vehicle ? `${e.vehicle.year ?? ''} ${e.vehicle.make ?? ''} ${e.vehicle.model ?? ''}`.trim() : '—'}</td>
              <td className="p-2">{e.enquiry.type}</td>
              <td className="p-2"><Badge variant="outline" className="capitalize">{e.status}</Badge></td>
              <td className="p-2 capitalize"><Badge variant="secondary" className="capitalize">{e.priority}</Badge></td>
              <td className="p-2">{e.assignedTo || '—'}</td>
              <td className="p-2 whitespace-nowrap">{new Date(e.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <Button variant="outline" size="sm" onClick={() => setSelected(e)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

  <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Customer</h4>
                <p>{selected.customer.firstName} {selected.customer.lastName}</p>
                <p className="text-muted-foreground">{selected.customer.email} · {selected.customer.phone}</p>
              </div>
              <div>
                <h4 className="font-medium">Vehicle</h4>
                <p>{selected.vehicle ? `${selected.vehicle.year ?? ''} ${selected.vehicle.make ?? ''} ${selected.vehicle.model ?? ''}`.trim() : '—'}</p>
              </div>
              <div>
                <h4 className="font-medium">Enquiry</h4>
                <p className="capitalize">Type: {selected.enquiry.type}</p>
                <p className="mt-1 whitespace-pre-wrap leading-relaxed">{selected.enquiry.message}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">Status</label>
                  <Select value={status} onValueChange={v => setStatus(v as EnquiryStatus)}>
                    <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['new','contacted','in-progress','completed','closed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">Priority</label>
                  <Select value={priority} onValueChange={v => setPriority(v as EnquiryPriority)}>
                    <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['low','medium','high'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Admin Notes</label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes..." rows={4} />
              </div>
              <div className="text-xs text-muted-foreground">Created {new Date(selected.createdAt).toLocaleString()}</div>
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" onClick={() => setSelected(null)} disabled={saving}>Close</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving || !selected}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
