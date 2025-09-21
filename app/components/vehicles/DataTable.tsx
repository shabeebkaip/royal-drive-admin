import React from 'react'
import { Card, CardContent } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Column {
  accessorKey: string
  header: string
  cell?: ({ row }: { row: { original: any } }) => React.ReactNode
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: Pagination
  onPageChange?: (page: number) => void
}

export function DataTable({ 
  columns, 
  data, 
  loading = false, 
  pagination,
  onPageChange 
}: DataTableProps) {
  const getCellValue = (item: any, accessorKey: string) => {
    return accessorKey.split('.').reduce((obj, key) => obj?.[key], item)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.accessorKey}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className="h-24 text-center text-muted-foreground"
                  >
                    No vehicles found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item._id || index}>
                    {columns.map((column) => (
                      <TableCell key={column.accessorKey}>
                        {column.cell 
                          ? column.cell({ row: { original: item } })
                          : getCellValue(item, column.accessorKey)
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && onPageChange && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm">
                Page {pagination.page} of {pagination.pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
