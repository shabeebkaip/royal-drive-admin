import { useCallback, useEffect, useState } from 'react'
import { carSubmissionsService } from '~/services/carSubmissionsService'
import { auth } from '~/lib/auth'
import type { CarSubmission, CarSubmissionSearchParams, CarSubmissionStatus, CarSubmissionPriority } from '~/types/car-submission'

export function useCarSubmissions(initial: CarSubmissionSearchParams = {}) {
  const user = auth.getUser()
  const [data, setData] = useState<CarSubmission[]>([])
  const [page, setPage] = useState(initial.page || 1)
  const [limit, setLimit] = useState(initial.limit || 20)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<CarSubmissionStatus | undefined>()
  const [priority, setPriority] = useState<CarSubmissionPriority | undefined>()
  const [search, setSearch] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState<number | undefined>()
  // salespeople default to their own assignments; others default to all
  const [scope, setScope] = useState<'all' | 'mine'>(user?.role === 'salesperson' ? 'mine' : 'all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let res
      if (scope === 'mine') {
        res = await carSubmissionsService.getMyAssignments()
      } else {
        const params: CarSubmissionSearchParams = { page, limit, status, priority, search, make, model, year }
        res = await carSubmissionsService.getSubmissions(params)
      }
      setData(res.data)
      setTotal(res.total)
    } catch (e:any) {
      setError(e.message || 'Failed to load car submissions')
    } finally {
      setLoading(false)
    }
  }, [page, limit, status, priority, search, make, model, year, scope])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, page, limit, total, loading, error, scope, setScope, setPage, setLimit, status, setStatus, priority, setPriority, search, setSearch, make, setMake, model, setModel, year, setYear, refetch: fetchData }
}
