import * as React from 'react'
import { enquiryColumns } from './enquiry-columns'
import type { VehicleEnquiry } from '~/types/enquiry'
import { DataTable } from '~/components/data-table'

interface EnquiriesTableProps {
  data: VehicleEnquiry[]
  loading?: boolean
}

export function EnquiriesTable({ data, loading }: EnquiriesTableProps) {
  return (
    <div className="space-y-2">
      <DataTable columns={enquiryColumns} data={data} loading={loading} />
    </div>
  )
}
