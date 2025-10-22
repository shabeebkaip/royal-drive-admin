import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Plus, Search, RotateCcw, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { DataTableWithoutPagination, ServerPagination } from '~/components/shared/data-table'
import { ShimmerTableLoader } from '~/components/shared/shimmer-table-loader'
import { SaleFormDialog } from './SaleFormDialog'
import { useSales } from './use-sales'
import type { Sale } from '~/types/sale'
import type { SaleFormData } from '~/lib/schemas/sale'
import type { ColumnDef } from '@tanstack/react-table'

export function SalesList() {
  const salesHook = useSales()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState('')

  const handleCreate = async (formData: SaleFormData) => {
    try {
      await salesHook.create(formData)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating sale:', error)
      // Error is handled by the hook with toast
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    salesHook.search(localSearchQuery)
  }

  const handleStatusFilter = (value: string) => {
    const status = value === 'all' ? '' : value
    salesHook.setStatusFilter(status)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number | undefined, currency: string = 'CAD') => {
    if (amount === undefined) return '-'
    return `${currency} ${amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.customerName}
        </div>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => {
        const vehicle = row.original.vehicle
        if (!vehicle) {
          return <span className="text-sm text-muted-foreground">N/A</span>
        }
        if (typeof vehicle === 'string') {
          return <span className="text-sm text-muted-foreground">{vehicle}</span>
        }
        return (
          <div className="text-sm">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </div>
        )
      },
    },
    {
      accessorKey: 'salePrice',
      header: 'Sale Price',
      cell: ({ row }) => formatCurrency(row.original.salePrice, row.original.currency),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Total Price',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.totalPrice, row.original.currency)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'marginPercent',
      header: 'Margin',
      cell: ({ row }) => {
        const margin = row.original.marginPercent
        if (margin === undefined || margin === null) return '-'
        return `${(margin * 100).toFixed(1)}%`
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('en-CA'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const sale = row.original
        return (
          <div className="flex items-center space-x-1">
            {sale.status === 'pending' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => salesHook.complete(sale.id)}
                  className="text-green-600 hover:text-green-700"
                  title="Complete Sale"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => salesHook.cancel(sale.id)}
                  className="text-yellow-600 hover:text-yellow-700"
                  title="Cancel Sale"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this sale?')) {
                      salesHook.delete(sale.id)
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                  title="Delete Sale"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
            <Input
              placeholder="Search customer, email, deal ID..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <Select
            value={salesHook.statusFilter || 'all'}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setLocalSearchQuery('')
              salesHook.refresh()
            }}
            disabled={salesHook.isLoading}
            title="Reset all filters and refresh data"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sale
          </Button>
        </div>
      </div>

      {/* Data Table */}
      {salesHook.isLoading ? (
        <ShimmerTableLoader columns={8} />
      ) : (
        <DataTableWithoutPagination
          columns={columns}
          data={salesHook.data}
        />
      )}

      {/* Server Pagination */}
      <ServerPagination
        currentPage={salesHook.pagination.page}
        totalPages={salesHook.pagination.totalPages}
        totalItems={salesHook.pagination.total}
        itemsPerPage={salesHook.pagination.limit}
        hasNext={salesHook.pagination.page < salesHook.pagination.totalPages}
        hasPrev={salesHook.pagination.page > 1}
        onPageChange={salesHook.goToPage}
        onNext={salesHook.nextPage}
        onPrevious={salesHook.prevPage}
        onFirst={() => salesHook.goToPage(1)}
        onLast={() => salesHook.goToPage(salesHook.pagination.totalPages)}
        isLoading={salesHook.isLoading}
      />

      {/* Create Sale Dialog */}
      <SaleFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        isLoading={salesHook.isLoading}
      />
    </div>
  )
}

export default SalesList
