import * as React from 'react'
import { enquiryColumns } from './enquiry-columns'
import type { VehicleEnquiry } from '~/types/enquiry'
import { DataTableGeneric } from '~/components/shared'

interface EnquiriesTableProps {
  data: VehicleEnquiry[]
  loading?: boolean
}

export function EnquiriesTable({ data, loading }: EnquiriesTableProps) {
  return (
    <div className="space-y-2">
      {loading ? (
        <div className="text-sm text-muted-foreground p-4 border rounded-md">Loading enquiries...</div>
      ) : (
        <DataTableGeneric columns={enquiryColumns} data={data} />
      )}
    </div>
  )
}
