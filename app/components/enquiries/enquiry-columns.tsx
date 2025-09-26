import type { ColumnDef } from '@tanstack/react-table'
import type { VehicleEnquiry } from '~/types/enquiry'

export const enquiryColumns: ColumnDef<VehicleEnquiry>[] = [
  {
    header: 'Customer',
    accessorFn: row => `${row.customer.firstName} ${row.customer.lastName}`,
    id: 'customer'
  },
  {
    header: 'Vehicle',
    accessorFn: row => row.vehicle ? `${row.vehicle.year ?? ''} ${row.vehicle.make ?? ''} ${row.vehicle.model ?? ''}`.trim() : '—',
    id: 'vehicle'
  },
  {
    header: 'Type',
    accessorKey: 'enquiry.type'
  },
  {
    header: 'Status',
    accessorKey: 'status'
  },
  {
    header: 'Priority',
    accessorKey: 'priority'
  },
  {
    header: 'Assigned',
    accessorFn: row => row.assignedTo || '—',
    id: 'assignedTo'
  },
  {
    header: 'Created',
    accessorFn: row => new Date(row.createdAt).toLocaleString(),
    id: 'createdAt'
  },
]
