import { Card, CardContent } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

interface ShimmerTableLoaderProps {
  rows?: number
  columns?: number
  className?: string
}

export function ShimmerTableLoader({ rows = 5, columns = 4, className }: ShimmerTableLoaderProps) {
  const shimmerClass = "relative overflow-hidden bg-gray-200 rounded before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

  return (
    <Card className={className ? className : "shadow-lg rounded-lg border border-border/40 overflow-hidden bg-white py-0"}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100 border-b-2 [&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-10 [&>tr>th]:bg-gray-100">
              <TableRow className="border-b-0">
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead key={index} className="text-gray-800 font-semibold text-sm tracking-wide">
                    <div className={`h-4 ${shimmerClass}`}></div>
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
                    <TableCell key={colIndex} className="text-gray-700 py-4">
                      <div className="flex items-center gap-3">
                        {colIndex === 0 && (
                          <>
                            {/* Logo shimmer */}
                            <div className={`h-8 w-8 rounded ${shimmerClass}`}></div>
                            {/* Name shimmer */}
                            <div className={`h-4 w-24 ${shimmerClass}`}></div>
                          </>
                        )}
                        {colIndex === 1 && (
                          <div className={`h-6 w-16 rounded-full ${shimmerClass}`}></div>
                        )}
                        {colIndex === 2 && (
                          <div className={`h-4 w-12 ${shimmerClass}`}></div>
                        )}
                        {colIndex === 3 && (
                          <div className={`h-4 w-20 ${shimmerClass}`}></div>
                        )}
                        {colIndex > 3 && (
                          <div className={`h-4 w-16 ${shimmerClass}`}></div>
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
