import { api } from "~/lib/api"
import type {
  ContactEnquiry,
  ContactEnquiryFilters,
  ContactEnquiryResponse,
  ContactEnquiriesListResponse,
  ContactEnquiryStatsResponse,
  UpdateEnquiryPayload,
  AssignEnquiryPayload,
  AddNotePayload,
} from "~/types/contact-enquiry"

const BASE_PATH = "/contact-enquiries"

export const contactEnquiriesService = {
  /**
   * Get all contact enquiries with filtering and pagination
   */
  async getAll(filters?: ContactEnquiryFilters): Promise<ContactEnquiriesListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value))
        }
      })
    }

    const queryString = params.toString()
    const url = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH
    
    return api.get<ContactEnquiriesListResponse>(url)
  },

  /**
   * Get single contact enquiry by ID
   */
  async getById(id: string): Promise<ContactEnquiryResponse> {
    return api.get<ContactEnquiryResponse>(`${BASE_PATH}/${id}`)
  },

  /**
   * Get contact enquiry statistics
   */
  async getStats(): Promise<ContactEnquiryStatsResponse> {
    return api.get<ContactEnquiryStatsResponse>(`${BASE_PATH}/stats`)
  },

  /**
   * Update contact enquiry (status, priority, notes, etc.)
   */
  async update(id: string, payload: UpdateEnquiryPayload): Promise<ContactEnquiryResponse> {
    return api.put<ContactEnquiryResponse>(`${BASE_PATH}/${id}`, payload)
  },

  /**
   * Assign enquiry to admin user
   */
  async assign(id: string, payload: AssignEnquiryPayload): Promise<ContactEnquiryResponse> {
    return api.post<ContactEnquiryResponse>(`${BASE_PATH}/${id}/assign`, payload)
  },

  /**
   * Add note to enquiry
   */
  async addNote(id: string, payload: AddNotePayload): Promise<ContactEnquiryResponse> {
    return api.post<ContactEnquiryResponse>(`${BASE_PATH}/${id}/notes`, payload)
  },

  /**
   * Mark enquiry as resolved
   */
  async markResolved(id: string): Promise<ContactEnquiryResponse> {
    return api.post<ContactEnquiryResponse>(`${BASE_PATH}/${id}/resolve`, {})
  },

  /**
   * Delete contact enquiry (SuperAdmin only)
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete<{ success: boolean; message: string }>(`${BASE_PATH}/${id}`)
  },
}
