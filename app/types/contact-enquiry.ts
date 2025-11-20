export interface ContactEnquiry {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: ContactSubject
  message: string
  status: EnquiryStatus
  priority: EnquiryPriority
  source: string
  assignedTo?: AssignedUser | null
  notes: EnquiryNote[]
  contactHistory: ContactHistory[]
  resolvedAt?: string | null
  resolvedBy?: ResolvedByUser | null
  createdAt: string
  updatedAt: string
}

export type ContactSubject =
  | "General Inquiry"
  | "Vehicle Information"
  | "Financing Question"
  | "Trade-in Valuation"
  | "Service Question"

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "in-progress"
  | "resolved"
  | "closed"

export type EnquiryPriority = "low" | "medium" | "high" | "urgent"

export type ContactMethod = "phone" | "email" | "in-person" | "sms"

export interface AssignedUser {
  _id: string
  firstName: string
  lastName: string
  email: string
}

export interface EnquiryNote {
  content: string
  createdBy: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

export interface ContactHistory {
  date: string
  method: ContactMethod
  notes: string
  contactedBy: {
    firstName: string
    lastName: string
  }
}

export interface ResolvedByUser {
  firstName: string
  lastName: string
}

export interface ContactEnquiryFilters {
  page?: number
  limit?: number
  status?: EnquiryStatus | ""
  priority?: EnquiryPriority | ""
  subject?: ContactSubject | ""
  assignedTo?: string
  search?: string
  sortBy?: "createdAt" | "updatedAt" | "status" | "priority"
  sortOrder?: "asc" | "desc"
  startDate?: string
  endDate?: string
}

export interface ContactEnquiryStats {
  total: number
  byStatus: {
    new: number
    contacted: number
    inProgress: number
    resolved: number
    closed: number
  }
  bySubject: Array<{
    _id: ContactSubject
    count: number
  }>
  byPriority: Array<{
    _id: EnquiryPriority
    count: number
  }>
  recentEnquiries: ContactEnquiry[]
}

export interface UpdateEnquiryPayload {
  status?: EnquiryStatus
  priority?: EnquiryPriority
  assignedTo?: string
  notes?: {
    content: string
  }
  contactHistory?: {
    method: ContactMethod
    notes: string
  }
}

export interface AssignEnquiryPayload {
  adminUserId: string
}

export interface AddNotePayload {
  content: string
}

export interface ContactEnquiryResponse {
  success: boolean
  message: string
  data: ContactEnquiry
}

export interface ContactEnquiriesListResponse {
  success: boolean
  message: string
  data: ContactEnquiry[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ContactEnquiryStatsResponse {
  success: boolean
  message: string
  data: ContactEnquiryStats
}
