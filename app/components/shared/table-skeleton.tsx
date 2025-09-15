import { Card, CardContent } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <Card className={className ? className : "shadow-lg rounded-lg border border-border/40 overflow-hidden bg-white py-0"}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100 border-b-2 [&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-10 [&>tr>th]:bg-gray-100">
              <TableRow className="border-b-0">
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead key={index} className="text-gray-800 font-semibold text-sm tracking-wide">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`border-b border-gray-100 ${
                    rowIndex % 2 === 1 ? "bg-gray-50/30" : "bg-white"
                  }`}
                >
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell key={colIndex} className="text-gray-700">
                      <div className="flex items-center gap-3">
                        {colIndex === 0 && (
                          <>
                            {/* Logo skeleton */}
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            {/* Name skeleton */}
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                          </>
                        )}
                        {colIndex === 1 && (
                          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                        )}
                        {colIndex === 2 && (
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                        )}
                        {colIndex === 3 && (
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        )}
                        {colIndex > 3 && (
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
