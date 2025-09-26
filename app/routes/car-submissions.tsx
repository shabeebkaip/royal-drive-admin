import * as React from 'react'
import { useCarSubmissions } from '~/hooks/useCarSubmissions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '~/components/ui/dialog'
import { auth } from '~/lib/auth'
import { carSubmissionsService } from '~/services/carSubmissionsService'
import { ServerPagination } from '~/components/shared/server-pagination'

export default function CarSubmissionsPage() {
  const { data, loading, status, priority, setStatus, setPriority, search, setSearch, scope, setScope, refetch, page, setPage, limit, total } = useCarSubmissions()
  const user = auth.getUser()
  const [selected, setSelected] = React.useState<any | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [editStatus, setEditStatus] = React.useState<string>('')
  const [editPriority, setEditPriority] = React.useState<string>('')
  const [notes, setNotes] = React.useState('')
  const [galleryIndex, setGalleryIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (selected) {
      setEditStatus(selected.status)
      setEditPriority(selected.priority)
      setNotes(selected.adminNotes || '')
    }
  }, [selected])

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await carSubmissionsService.updateSubmission(selected.id, {
        status: editStatus as any,
        priority: editPriority as any,
        adminNotes: notes,
      })
      Object.assign(selected, res.data)
      setSelected(null) // close after save
      refetch()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  // Lightbox keyboard handlers
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (galleryIndex !== null) {
        if (e.key === 'Escape') {
          e.stopPropagation()
          e.preventDefault()
          setGalleryIndex(null)
          return
        }
        if (selected?.vehicle?.images?.length) {
          if (e.key === 'ArrowRight') {
            e.stopPropagation(); e.preventDefault()
            setGalleryIndex(i => i === null ? i : (i + 1) % selected.vehicle.images.length)
          }
          if (e.key === 'ArrowLeft') {
            e.stopPropagation(); e.preventDefault()
            setGalleryIndex(i => i === null ? i : (i - 1 + selected.vehicle.images.length) % selected.vehicle.images.length)
          }
        }
      }
    }
    // capture phase to intercept before dialog handles ESC
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [galleryIndex, selected])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Car Submissions</h1>
        <p className="text-sm text-muted-foreground">Manage vehicles submitted by owners (sell-your-car leads).</p>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        {user && user.role !== 'salesperson' && (
          <div className="flex gap-1 rounded-md border p-1 bg-muted/40">
            <Button type="button" size="sm" variant={scope==='all' ? 'default' : 'ghost'} onClick={() => { setScope('all'); refetch() }}>All</Button>
            <Button type="button" size="sm" variant={scope==='mine' ? 'default' : 'ghost'} onClick={() => { setScope('mine'); refetch() }}>My</Button>
          </div>
        )}
        <div className="w-40">
          <Select value={status} onValueChange={v => setStatus(v as any)}>
            <SelectTrigger size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {['new','reviewing','contacted','scheduled-inspection','inspected','offer-made','negotiating','accepted','rejected','completed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
  <div className="overflow-auto rounded-md border">
        {loading ? <div className="p-4 text-sm text-muted-foreground">Loading...</div> : !data.length ? <div className="p-4 text-sm text-muted-foreground">No submissions.</div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="p-2 font-medium">Owner</th>
                <th className="p-2 font-medium">Contact</th>
                <th className="p-2 font-medium">Vehicle</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Priority</th>
                <th className="p-2 font-medium">Expected</th>
                <th className="p-2 font-medium">Created</th>
                <th className="p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.owner.firstName} {s.owner.lastName}</td>
                  <td className="p-2">
                    <div>{s.owner.email}</div>
                    <div className="text-muted-foreground text-xs">{s.owner.phone}</div>
                  </td>
                  <td className="p-2">{`${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model}`}</td>
                  <td className="p-2 capitalize">{s.status}</td>
                  <td className="p-2 capitalize">{s.priority}</td>
                  <td className="p-2">{s.pricing?.expectedPrice ? `$${s.pricing.expectedPrice.toLocaleString()}` : '—'}</td>
                  <td className="p-2 whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="p-2"><Button size="sm" variant="outline" onClick={() => setSelected(s)}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Owner</h4>
                    <p>{selected.owner.firstName} {selected.owner.lastName}</p>
                    <p className="text-muted-foreground">{selected.owner.email}</p>
                    <p className="text-muted-foreground">{selected.owner.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Vehicle</h4>
                    <p>{selected.vehicle.year} {selected.vehicle.make} {selected.vehicle.model}</p>
                    {selected.vehicle.vin && <p className="text-muted-foreground">VIN: {selected.vehicle.vin}</p>}
                    {selected.vehicle.mileage && <p className="text-muted-foreground">Mileage: {selected.vehicle.mileage}</p>}
                    {selected.pricing?.expectedPrice && <p className="text-muted-foreground">Expected: ${selected.pricing.expectedPrice.toLocaleString()}</p>}
                    {Array.isArray(selected.vehicle.images) && selected.vehicle.images.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium">Images</p>
                        <div className="flex gap-3 flex-wrap">
                          {selected.vehicle.images.slice(0,8).map((url: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative h-24 w-36 overflow-hidden rounded border bg-muted/30 cursor-pointer group"
                              onClick={() => setGalleryIndex(idx)}
                              title="Click to enlarge"
                            >
                              <img
                                src={url}
                                alt={selected.vehicle.make + ' ' + selected.vehicle.model + ' image ' + (idx+1)}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-medium">Status</label>
                    <Select value={editStatus} onValueChange={v => setEditStatus(v)}>
                      <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['new','reviewing','contacted','scheduled-inspection','inspected','offer-made','negotiating','accepted','rejected','completed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-medium">Priority</label>
                    <Select value={editPriority} onValueChange={v => setEditPriority(v)}>
                      <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['low','medium','high'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Admin Notes</label>
                  <Textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes..." />
                </div>
                <div className="text-xs text-muted-foreground">Created {new Date(selected.createdAt).toLocaleString()}</div>
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" disabled={saving} onClick={() => setSelected(null)}>Close</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={saving || !selected}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Pagination */}
      <ServerPagination
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(total / limit))}
        totalItems={total}
        itemsPerPage={limit}
        hasNext={page < Math.ceil(total / limit)}
        hasPrev={page > 1}
        onPageChange={(p) => { setPage(p); refetch() }}
        onNext={() => { if (page < Math.ceil(total / limit)) { setPage(page + 1); refetch() } }}
        onPrevious={() => { if (page > 1) { setPage(page - 1); refetch() } }}
        onFirst={() => { setPage(1); refetch() }}
        onLast={() => { const last = Math.max(1, Math.ceil(total / limit)); setPage(last); refetch() }}
        isLoading={loading}
  showSinglePage
      />
      {selected && galleryIndex !== null && selected.vehicle.images && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center"
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-4xl w-full px-6">
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white text-sm"
              onClick={() => setGalleryIndex(null)}
            >Close</button>
            <div className="flex items-center gap-4">
              <button
                className="text-white/70 hover:text-white px-3 py-2 disabled:opacity-30"
                onClick={() => setGalleryIndex(i => i === null ? i : (i - 1 + selected.vehicle.images.length) % selected.vehicle.images.length)}
                disabled={selected.vehicle.images.length <= 1}
              >&larr;</button>
              <div className="flex-1 flex justify-center">
                <img
                  src={selected.vehicle.images[galleryIndex]}
                  alt="Full size"
                  className="max-h-[70vh] rounded shadow-lg object-contain"
                />
              </div>
              <button
                className="text-white/70 hover:text-white px-3 py-2 disabled:opacity-30"
                onClick={() => setGalleryIndex(i => i === null ? i : (i + 1) % selected.vehicle.images.length)}
                disabled={selected.vehicle.images.length <= 1}
              >&rarr;</button>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {selected.vehicle.images.map((u: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`h-14 w-20 overflow-hidden rounded border ${i===galleryIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={u} alt={`thumb ${i+1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="mt-1 text-center text-xs text-white/60">Image {galleryIndex + 1} of {selected.vehicle.images.length} (Esc to close, ← → to navigate)</div>
          </div>
        </div>
      )}
    </div>
  )
}
