import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { 
  Mail, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  Calendar,
  MessageSquare,
  AlertCircle,
  Save,
  RefreshCw,
  Clock,
  UserCircle,
  FileText,
  Activity,
  Tag,
  Shield,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Edit
} from "lucide-react"
import { contactEnquiriesService } from "~/services/contactEnquiriesService"
import type { ContactEnquiry, EnquiryPriority, EnquiryStatus, ContactMethod } from "~/types/contact-enquiry"
import { toast } from "sonner"

export function ContactEnquiryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [enquiry, setEnquiry] = useState<ContactEnquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [noteContent, setNoteContent] = useState("")
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone")
  const [contactNotes, setContactNotes] = useState("")

  const fetchEnquiry = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await contactEnquiriesService.getById(id)
      
      if (response.success) {
        setEnquiry(response.data)
      } else {
        setError("Failed to load enquiry")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch enquiry")
      console.error("Error fetching enquiry:", err)
      toast.error("Failed to load enquiry details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiry()
  }, [id])

  const updatePriority = async (priority: EnquiryPriority) => {
    if (!id) return
    
    try {
      setSaving(true)
      await contactEnquiriesService.update(id, { priority })
      await fetchEnquiry()
      toast.success("Priority updated successfully")
    } catch (err) {
      console.error("Error updating priority:", err)
      toast.error("Failed to update priority")
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (status: EnquiryStatus) => {
    if (!id) return
    
    try {
      setSaving(true)
      await contactEnquiriesService.update(id, { status })
      await fetchEnquiry()
      toast.success("Status updated successfully")
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update status")
    } finally {
      setSaving(false)
    }
  }

  const addNote = async () => {
    if (!id || !noteContent.trim()) return
    
    try {
      setSaving(true)
      await contactEnquiriesService.addNote(id, { content: noteContent })
      setNoteContent("")
      await fetchEnquiry()
      toast.success("Note added successfully")
    } catch (err) {
      console.error("Error adding note:", err)
      toast.error("Failed to add note")
    } finally {
      setSaving(false)
    }
  }

  const addContactHistory = async () => {
    if (!id || !contactNotes.trim()) return
    
    try {
      setSaving(true)
      await contactEnquiriesService.update(id, {
        contactHistory: {
          method: contactMethod,
          notes: contactNotes,
        },
      })
      setContactNotes("")
      await fetchEnquiry()
      toast.success("Contact history logged successfully")
    } catch (err) {
      console.error("Error adding contact history:", err)
      toast.error("Failed to log contact history")
    } finally {
      setSaving(false)
    }
  }

  const markResolved = async () => {
    if (!id) return
    
    try {
      setSaving(true)
      await contactEnquiriesService.markResolved(id)
      await fetchEnquiry()
      toast.success("Enquiry marked as resolved")
    } catch (err) {
      console.error("Error marking as resolved:", err)
      toast.error("Failed to mark as resolved")
    } finally {
      setSaving(false)
    }
  }

  const getPriorityColor = (priority: EnquiryPriority) => {
    const colors: Record<EnquiryPriority, string> = {
      low: "bg-gray-500",
      medium: "bg-blue-500",
      high: "bg-orange-500",
      urgent: "bg-red-500",
    }
    return colors[priority]
  }

  const getStatusColor = (status: EnquiryStatus) => {
    const colors: Record<EnquiryStatus, string> = {
      new: "bg-green-500",
      contacted: "bg-blue-500",
      "in-progress": "bg-yellow-500",
      resolved: "bg-purple-500",
      closed: "bg-gray-500",
    }
    return colors[status]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !enquiry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Enquiry Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested enquiry could not be found."}
          </p>
          <Link to="/enquiries/contact">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Enquiries
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isResolved = enquiry.status === "resolved" || enquiry.status === "closed"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      {/* Header - matching vehicle detail */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/enquiries/contact">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            {!isResolved && (
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={markResolved} 
                disabled={saving}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Resolved
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Main Card - matching vehicle detail style */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 space-y-5">
            {/* Title & Badges */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="text-sm capitalize">{enquiry.source}</Badge>
                <Badge className={getStatusColor(enquiry.status)}>
                  {enquiry.status.replace("-", " ")}
                </Badge>
                <Badge className={getPriorityColor(enquiry.priority)}>
                  {enquiry.priority}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {enquiry.firstName} {enquiry.lastName}
              </h1>
              <p className="text-xl text-gray-600">{enquiry.subject}</p>
            </div>

            <Separator />

            {/* Contact Quick Info Grid - matching vehicle style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a 
                    href={`mailto:${enquiry.email}`}
                    className="font-semibold text-blue-600 hover:underline text-sm"
                  >
                    {enquiry.email.length > 20 ? enquiry.email.substring(0, 20) + '...' : enquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a 
                    href={`tel:${enquiry.phone}`}
                    className="font-semibold text-green-600 hover:underline text-sm"
                  >
                    {enquiry.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Tag className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="font-semibold text-sm">{enquiry.subject}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Received</p>
                  <p className="font-semibold text-sm">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status & Priority Controls Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <Select
                  value={enquiry.status}
                  onValueChange={(value: EnquiryStatus) => updateStatus(value)}
                  disabled={saving}
                >
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Priority</label>
                <Select
                  value={enquiry.priority}
                  onValueChange={(value: EnquiryPriority) => updatePriority(value)}
                  disabled={saving}
                >
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
          </div>
        </div>

        {/* Two Column Layout - matching vehicle detail */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Customer Message */}
            <InfoSection 
              title="Customer Message" 
              icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
            >
              <div className="bg-gray-50 rounded-lg p-6 border">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {enquiry.message}
                </p>
              </div>
            </InfoSection>

            {/* Internal Notes */}
            <InfoSection 
              title="Internal Notes" 
              icon={<FileText className="h-5 w-5 text-purple-600" />}
            >
              <div className="space-y-4">
                {/* Add Note Form */}
                <div className="space-y-2">
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add a note about this enquiry..."
                    rows={3}
                    disabled={saving}
                  />
                  <Button 
                    onClick={addNote} 
                    disabled={!noteContent.trim() || saving}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>

                <Separator />

                {/* Notes List */}
                <div className="space-y-3">
                  {enquiry.notes.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No notes yet. Add a note above.
                    </p>
                  ) : (
                    enquiry.notes.map((note, index) => (
                      <div 
                        key={index} 
                        className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                      >
                        <p className="text-gray-800 mb-2">{note.content}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          <span>
                            {note.createdBy.firstName} {note.createdBy.lastName}
                          </span>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </InfoSection>

            {/* Contact History */}
            <InfoSection 
              title="Contact History" 
              icon={<Activity className="h-5 w-5 text-green-600" />}
            >
              <div className="space-y-4">
                {/* Add Contact Form */}
                <div className="space-y-3">
                  <Select
                    value={contactMethod}
                    onValueChange={(value: ContactMethod) => setContactMethod(value)}
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    value={contactNotes}
                    onChange={(e) => setContactNotes(e.target.value)}
                    placeholder="Describe the contact interaction..."
                    rows={3}
                    disabled={saving}
                  />
                  
                  <Button 
                    onClick={addContactHistory} 
                    disabled={!contactNotes.trim() || saving}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Log Contact
                  </Button>
                </div>

                <Separator />

                {/* History List */}
                <div className="space-y-3">
                  {enquiry.contactHistory.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No contact history yet. Log a contact above.
                    </p>
                  ) : (
                    enquiry.contactHistory.map((contact, index) => (
                      <div 
                        key={index} 
                        className="bg-green-50 rounded-lg p-4 border border-green-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">
                            {contact.method}
                          </Badge>
                        </div>
                        <p className="text-gray-800 mb-2">{contact.notes}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          <span>
                            {contact.contactedBy.firstName} {contact.contactedBy.lastName}
                          </span>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(contact.date).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </InfoSection>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Assignment */}
            {enquiry.assignedTo && (
              <SideSection 
                title="Assigned To" 
                icon={<User className="h-5 w-5 text-blue-600" />}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold">
                      {enquiry.assignedTo.firstName} {enquiry.assignedTo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-700">{enquiry.assignedTo.email}</p>
                  </div>
                </div>
              </SideSection>
            )}

            {/* Activity Stats */}
            <SideSection 
              title="Activity" 
              icon={<Activity className="h-5 w-5 text-green-600" />}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notes</span>
                  <span className="font-bold text-2xl text-gray-900">{enquiry.notes.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contact Logs</span>
                  <span className="font-bold text-2xl text-gray-900">{enquiry.contactHistory.length}</span>
                </div>
              </div>
            </SideSection>

            {/* Timeline */}
            <InfoSection 
              title="Timeline" 
              icon={<Calendar className="h-5 w-5 text-purple-600" />}
            >
              <div className="space-y-4">
                <TimelineItem 
                  icon={<CheckCircle className="h-4 w-4" />} 
                  title="Enquiry Created" 
                  date={enquiry.createdAt}
                />
                {enquiry.createdAt !== enquiry.updatedAt && (
                  <TimelineItem 
                    icon={<Edit className="h-4 w-4" />} 
                    title="Last Updated" 
                    date={enquiry.updatedAt}
                  />
                )}
                {enquiry.resolvedAt && (
                  <TimelineItem 
                    icon={<CheckCircle2 className="h-4 w-4" />} 
                    title={`Resolved${enquiry.resolvedBy ? ` by ${enquiry.resolvedBy.firstName} ${enquiry.resolvedBy.lastName}` : ''}`}
                    date={enquiry.resolvedAt}
                    highlight
                  />
                )}
              </div>
            </InfoSection>

            {/* Resolved Banner */}
            {isResolved && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  <h2 className="text-lg font-bold">Status: Resolved</h2>
                </div>
                {enquiry.resolvedBy && enquiry.resolvedAt && (
                  <div className="text-sm text-yellow-900">
                    <p>
                      <span className="font-semibold">Resolved by: </span>
                      {enquiry.resolvedBy.firstName} {enquiry.resolvedBy.lastName}
                    </p>
                    <p className="text-yellow-800 mt-1">
                      {new Date(enquiry.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components - matching vehicle detail style
function InfoSection({ 
  title, 
  icon, 
  children 
}: { 
  title: string
  icon: React.ReactNode
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function SideSection({ 
  title, 
  icon, 
  children 
}: { 
  title: string
  icon: React.ReactNode
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function TimelineItem({ 
  icon, 
  title, 
  date, 
  highlight 
}: { 
  icon: React.ReactNode
  title: string
  date: string
  highlight?: boolean 
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          highlight ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {icon}
        </div>
        <div className="h-full w-px bg-gray-200" />
      </div>
      <div className="flex-1 pb-4">
        <p className={`font-medium ${highlight ? 'text-green-900' : 'text-gray-900'}`}>
          {title}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(date).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
