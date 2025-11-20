import { api } from "~/lib/api"
import type { BusinessSettings, SocialMedia, Address, ContactInfo, BusinessHour, MaintenanceMode, SettingsResponse } from "~/types/settings"

const BASE_URL = "/settings"

export const settingsService = {
  // Get public settings (no auth required)
  getPublicSettings: async (): Promise<SettingsResponse> => {
    return api.get(`${BASE_URL}/public`)
  },

  // Get all settings (admin)
  getSettings: async (): Promise<SettingsResponse> => {
    return api.get(BASE_URL)
  },

  // Update all settings
  updateSettings: async (updates: Partial<BusinessSettings>): Promise<SettingsResponse> => {
    return api.put(BASE_URL, updates)
  },

  // Update social media only
  updateSocialMedia: async (socialMedia: SocialMedia): Promise<SettingsResponse> => {
    return api.put(`${BASE_URL}/social-media`, socialMedia)
  },

  // Update address only
  updateAddress: async (address: Address): Promise<SettingsResponse> => {
    return api.put(`${BASE_URL}/address`, address)
  },

  // Update contact info only
  updateContactInfo: async (contactInfo: ContactInfo): Promise<SettingsResponse> => {
    return api.put(`${BASE_URL}/contact-info`, contactInfo)
  },

  // Update business hours only
  updateBusinessHours: async (businessHours: BusinessHour[]): Promise<SettingsResponse> => {
    return api.put(`${BASE_URL}/business-hours`, { businessHours })
  },

  // Toggle maintenance mode
  toggleMaintenanceMode: async (maintenanceMode: MaintenanceMode): Promise<SettingsResponse> => {
    return api.post(`${BASE_URL}/maintenance-mode`, maintenanceMode)
  },

  // Reset settings to defaults (SuperAdmin only)
  resetSettings: async (): Promise<SettingsResponse> => {
    return api.post(`${BASE_URL}/reset`, {})
  },
}
