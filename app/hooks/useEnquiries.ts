import { useCallback, useEffect, useState } from 'react'
import { enquiriesService } from '~/services/enquiriesService'
import type { VehicleEnquiry, EnquirySearchParams, EnquiryStatus, EnquiryPriority } from '~/types/enquiry'

interface UseEnquiriesOptions {
  initialPage?: number
  initialLimit?: number
}

export function useEnquiries(options: UseEnquiriesOptions = {}) {
  const { initialPage = 1, initialLimit = 20 } = options
  const [data, setData] = useState<VehicleEnquiry[]>([])
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<EnquiryStatus | undefined>()
  const [priority, setPriority] = useState<EnquiryPriority | undefined>()
  const [search, setSearch] = useState('')
  const [assignedTo, setAssignedTo] = useState<string | undefined>()
  const [vehicleId, setVehicleId] = useState<string | undefined>()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params: EnquirySearchParams = { page, limit, status, priority, search, assignedTo, vehicleId }
      const res = await enquiriesService.getEnquiries(params)
      setData(res.data)
      setTotal(res.total)
    } catch (e:any) {
      setError(e.message || 'Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }, [page, limit, status, priority, search, assignedTo, vehicleId])

  useEffect(() => { fetchData() }, [fetchData])

  return {
    data,
    page,
    limit,
    total,
    loading,
    error,
    setPage,
    setLimit,
    setStatus,
    setPriority,
    setSearch,
    setAssignedTo,
    setVehicleId,
  status,
  priority,
  search,
    refetch: fetchData,
  }
}
