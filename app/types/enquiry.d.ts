export type EnquiryType = "general" | "financing" | "trade-in" | "test-drive" | "price-negotiation"
export type EnquiryStatus = "new" | "contacted" | "in-progress" | "completed" | "closed"
export type EnquiryPriority = "low" | "medium" | "high"
export type ContactMethod = "email" | "phone" | "both"

export interface EnquiryCustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContact: ContactMethod
}

export interface EnquiryDetails {
  type: EnquiryType
  message: string
  preferredDate?: string // ISO date
  preferredTime?: string // HH:MM
}

export interface EnquiryInterests {
  testDrive?: boolean
  financing?: boolean
  tradeIn?: boolean
  warranty?: boolean
}

export interface EnquiryContactEntry {
  id: string
  method: ContactMethod
  notes: string
  staff?: string
  createdAt: string
}

export interface VehicleEnquiry {
  id: string
  vehicleId?: string
  vehicle?: {
    id: string
    year?: number
    make?: string
    model?: string
    trim?: string
    listPrice?: number
  }
  customer: EnquiryCustomerInfo
  enquiry: EnquiryDetails
  interests: EnquiryInterests
  status: EnquiryStatus
  priority: EnquiryPriority
  assignedTo?: string
  adminNotes?: string
  contactHistory: EnquiryContactEntry[]
  source?: string
  createdAt: string
  updatedAt: string
}

export interface EnquirySearchParams {
  page?: number
  limit?: number
  search?: string
  status?: EnquiryStatus
  priority?: EnquiryPriority
  vehicleId?: string
  assignedTo?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
