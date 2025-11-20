import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { Textarea } from "~/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { ServerPagination } from "~/components/shared/server-pagination"
import { contactEnquiriesService } from "~/services/contactEnquiriesService"
import type { 
  ContactEnquiry, 
  ContactEnquiryFilters, 
  EnquiryStatus, 
  EnquiryPriority 
} from "~/types/contact-enquiry"

export function ContactEnquiriesList() {
  const navigate = useNavigate()
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<ContactEnquiry | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Form states for dialog
  const [editStatus, setEditStatus] = useState<EnquiryStatus>("new")
  const [editPriority, setEditPriority] = useState<EnquiryPriority>("medium")
  const [noteContent, setNoteContent] = useState("")
  
  const [filters, setFilters] = useState<ContactEnquiryFilters>({
    page: 1,
    limit: 20,
    status: "",
    priority: "",
    subject: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  useEffect(() => {
    if (selected) {
      setEditStatus(selected.status)
      setEditPriority(selected.priority)
      setNoteContent("")
    }
  }, [selected])

  // Fetch enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      const response = await contactEnquiriesService.getAll(filters)
      
      if (response.success) {
        setEnquiries(response.data)
        setPagination(response.pagination)
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err)
    } finally {
      setLoading(false)
    }
  }

  // Update enquiry
  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await contactEnquiriesService.update(selected._id, {
        status: editStatus,
        priority: editPriority,
        ...(noteContent ? { notes: { content: noteContent } } : {})
      })
      setSelected(null)
      fetchEnquiries()
    } catch (err) {
      console.error("Error updating enquiry:", err)
    } finally {
      setSaving(false)
    }
  }

  // Mark as resolved
  const handleResolve = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await contactEnquiriesService.markResolved(selected._id)
      setSelected(null)
      fetchEnquiries()
    } catch (err) {
      console.error("Error marking as resolved:", err)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [filters])

  const handleFilterChange = (key: keyof ContactEnquiryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      status: "",
      priority: "",
      subject: "",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    })
  }

  const getStatusBadge = (status: EnquiryStatus) => {
    const colors: Record<EnquiryStatus, string> = {
      new: "bg-green-100 text-green-800",
      contacted: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-purple-100 text-purple-800",
      closed: "bg-gray-100 text-gray-800",
    }
    return <Badge variant="outline" className={colors[status]}>{status}</Badge>
  }

  const getPriorityBadge = (priority: EnquiryPriority) => {
    const colors: Record<EnquiryPriority, string> = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[priority]}>{priority}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Contact Enquiries</h1>
        <p className="text-sm text-muted-foreground">Manage customer contact requests from the website</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-56">
          <Input 
            value={filters.search || ""} 
            onChange={e => handleFilterChange("search", e.target.value)} 
            placeholder="Search name, email, phone..." 
            className="h-9" 
          />
        </div>
        
        <div className="w-40">
          <Select 
            value={filters.status || "all"} 
            onValueChange={v => handleFilterChange("status", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select 
            value={filters.priority || "all"} 
            onValueChange={v => handleFilterChange("priority", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select 
            value={filters.subject || "all"} 
            onValueChange={v => handleFilterChange("subject", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
              <SelectItem value="Vehicle Information">Vehicle Information</SelectItem>
              <SelectItem value="Financing Question">Financing Question</SelectItem>
              <SelectItem value="Trade-in Valuation">Trade-in Valuation</SelectItem>
              <SelectItem value="Service Question">Service Question</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={() => fetchEnquiries()} disabled={loading}>Apply</Button>
        <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-md border">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        ) : !enquiries.length ? (
          <div className="p-4 text-sm text-muted-foreground">No contact enquiries found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="p-2 font-medium">Customer</th>
                <th className="p-2 font-medium">Contact</th>
                <th className="p-2 font-medium">Subject</th>
                <th className="p-2 font-medium">Message</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Priority</th>
                <th className="p-2 font-medium">Assigned</th>
                <th className="p-2 font-medium">Created</th>
                <th className="p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map(e => (
                <tr key={e._id} className="border-t hover:bg-muted/20">
                  <td className="p-2 whitespace-nowrap">{e.firstName} {e.lastName}</td>
                  <td className="p-2">
                    <div className="text-xs">{e.email}</div>
                    <div className="text-xs text-muted-foreground">{e.phone}</div>
                  </td>
                  <td className="p-2">{e.subject}</td>
                  <td className="p-2 max-w-xs truncate">{e.message}</td>
                  <td className="p-2">{getStatusBadge(e.status)}</td>
                  <td className="p-2">{getPriorityBadge(e.priority)}</td>
                  <td className="p-2">
                    {e.assignedTo ? `${e.assignedTo.firstName} ${e.assignedTo.lastName}` : '—'}
                  </td>
                  <td className="p-2 whitespace-nowrap text-xs">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelected(e)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <ServerPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalCount}
          itemsPerPage={filters.limit || 20}
          hasNext={pagination.hasNextPage}
          hasPrev={pagination.hasPrevPage}
          onPageChange={(page) => handleFilterChange("page", page)}
          onNext={() => handleFilterChange("page", pagination.currentPage + 1)}
          onPrevious={() => handleFilterChange("page", pagination.currentPage - 1)}
          onFirst={() => handleFilterChange("page", 1)}
          onLast={() => handleFilterChange("page", pagination.totalPages)}
          isLoading={loading}
          showSinglePage
        />
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Enquiry Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{selected.firstName} {selected.lastName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p><a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a></p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p><a href={`tel:${selected.phone}`} className="text-blue-600 hover:underline">{selected.phone}</a></p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subject:</span>
                    <p>{selected.subject}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <div className="p-3 bg-muted/40 rounded-md text-sm whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select value={editStatus} onValueChange={(v: EnquiryStatus) => setEditStatus(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <Select value={editPriority} onValueChange={(v: EnquiryPriority) => setEditPriority(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Note */}
              <div>
                <label className="text-sm font-medium mb-1 block">Add Internal Note</label>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add a note (optional)..."
                  rows={3}
                />
              </div>

              {/* Existing Notes */}
              {selected.notes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Notes History</h4>
                  <div className="space-y-2">
                    {selected.notes.map((note, idx) => (
                      <div key={idx} className="p-2 bg-blue-50 rounded text-sm">
                        <p>{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {note.createdBy.firstName} {note.createdBy.lastName} • {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact History */}
              {selected.contactHistory.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Contact History</h4>
                  <div className="space-y-2">
                    {selected.contactHistory.map((contact, idx) => (
                      <div key={idx} className="p-2 bg-green-50 rounded text-sm">
                        <p className="font-medium capitalize">{contact.method}</p>
                        <p>{contact.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {contact.contactedBy.firstName} {contact.contactedBy.lastName} • {new Date(contact.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-muted-foreground border-t pt-3">
                <p>Created: {new Date(selected.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(selected.updatedAt).toLocaleString()}</p>
                {selected.resolvedAt && <p>Resolved: {new Date(selected.resolvedAt).toLocaleString()}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                {selected.status !== "resolved" && selected.status !== "closed" && (
                  <Button variant="outline" onClick={handleResolve} disabled={saving}>
                    Mark Resolved
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/enquiries/${selected._id}`)}
                >
                  View Full Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
