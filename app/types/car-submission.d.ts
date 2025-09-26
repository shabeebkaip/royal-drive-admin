export type CarSubmissionStatus =
  | 'new'
  | 'reviewing'
  | 'contacted'
  | 'scheduled-inspection'
  | 'inspected'
  | 'offer-made'
  | 'negotiating'
  | 'accepted'
  | 'rejected'
  | 'completed'

export type CarSubmissionPriority = 'high' | 'medium' | 'low'

export interface CarSubmissionVehicleInfo {
  make: string
  model: string
  year: number
  vin?: string
  mileage?: number
  condition?: 'poor' | 'fair' | 'good' | 'very-good' | 'excellent'
  color?: string
  images?: string[] // array of image URLs
}

export interface CarSubmissionOwnerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContact?: 'email' | 'phone' | 'both'
}

export interface CarSubmissionPricingInfo {
  expectedPrice?: number
  reasonForSelling?: string
}

export interface CarSubmissionEvaluation {
  evaluator?: string
  notes?: string
  estimatedValue?: number
  marketRange?: { min: number; max: number }
}

export interface CarSubmissionInspection {
  scheduledDate?: string
  location?: string
  inspector?: string
  resultNotes?: string
}

export interface CarSubmissionOffer {
  amount?: number
  expiresAt?: string
  status?: 'pending' | 'accepted' | 'rejected'
  notes?: string
}

export interface CarSubmissionContactEntry {
  id: string
  method: 'email' | 'phone'
  notes: string
  staff?: string
  createdAt: string
}

export interface CarSubmission {
  id: string
  vehicle: CarSubmissionVehicleInfo
  owner: CarSubmissionOwnerInfo
  pricing?: CarSubmissionPricingInfo
  evaluation?: CarSubmissionEvaluation
  inspection?: CarSubmissionInspection
  offer?: CarSubmissionOffer
  status: CarSubmissionStatus
  priority: CarSubmissionPriority
  adminNotes?: string
  assignedTo?: string
  contactHistory: CarSubmissionContactEntry[]
  source?: string
  createdAt: string
  updatedAt: string
}

export interface CarSubmissionSearchParams {
  page?: number
  limit?: number
  status?: CarSubmissionStatus
  priority?: CarSubmissionPriority
  assignedTo?: string
  make?: string
  model?: string
  year?: number
  minPrice?: number
  maxPrice?: number
  condition?: string
  dateFrom?: string
  dateTo?: string
  search?: string
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
