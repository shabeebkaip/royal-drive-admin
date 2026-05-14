import { api } from '~/lib/api'

export interface SyncResult {
  total: number
  created: number
  updated: number
  skipped: number
  errors: Array<{ edealerId: string; error: string }>
}

export interface CacheStatus {
  cached: boolean
  expiresIn: number
  count: number
}

export interface SyncResponse {
  success: boolean
  message: string
  data: SyncResult
}

export interface CacheStatusResponse {
  success: boolean
  message: string
  data: CacheStatus
}

export interface CacheRefreshResponse {
  success: boolean
  message: string
  data: { cache: CacheStatus }
}

export const edealerService = {
  /**
   * Trigger a full sync from EDealer into MongoDB.
   * Fetches all vehicles from EDealer and upserts them into the database.
   */
  async syncInventory(): Promise<SyncResponse> {
    return api.post<SyncResponse>('/edealer/sync', {})
  },

  /**
   * Get the current state of the EDealer in-memory cache.
   */
  async getCacheStatus(): Promise<CacheStatusResponse> {
    return api.get<CacheStatusResponse>('/edealer/cache/status')
  },

  /**
   * Force-refresh the in-memory cache from EDealer.
   */
  async refreshCache(): Promise<CacheRefreshResponse> {
    return api.post<CacheRefreshResponse>('/edealer/cache/refresh', {})
  },
}
