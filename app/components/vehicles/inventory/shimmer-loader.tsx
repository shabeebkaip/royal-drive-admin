import { Card, CardContent } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

interface VehicleShimmerLoaderProps {
  viewMode: 'table' | 'grid'
  rows?: number
  compact?: boolean
  className?: string
}

export function VehicleShimmerLoader({ 
  viewMode, 
  rows = 8, 
  compact = false, 
  className 
}: VehicleShimmerLoaderProps) {
  const shimmerClass = "relative overflow-hidden bg-gray-200 rounded before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

  if (viewMode === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className || ''}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            {/* Image placeholder */}
            <div className="aspect-video relative">
              <div className={`w-full h-full ${shimmerClass}`}></div>
              {/* Badge placeholders */}
              <div className="absolute top-2 left-2">
                <div className={`h-6 w-16 rounded-full ${shimmerClass}`}></div>
              </div>
              <div className="absolute top-2 right-2">
                <div className={`h-6 w-20 rounded-full ${shimmerClass}`}></div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Title */}
                <div className="space-y-2">
                  <div className={`h-5 w-3/4 ${shimmerClass}`}></div>
                  <div className={`h-4 w-1/2 ${shimmerClass}`}></div>
                </div>
                
                {/* Details row */}
                <div className="flex items-center justify-between">
                  <div className={`h-4 w-20 ${shimmerClass}`}></div>
                  <div className={`h-5 w-16 rounded ${shimmerClass}`}></div>
                </div>
                
                {/* Price */}
                <div className="space-y-1">
                  <div className={`h-6 w-24 ${shimmerClass}`}></div>
                  <div className={`h-4 w-16 ${shimmerClass}`}></div>
                </div>
                
                {/* Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <div className={`h-8 flex-1 rounded ${shimmerClass}`}></div>
                  <div className={`h-8 w-16 rounded ${shimmerClass}`}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Table view shimmer
  const tableColumns = compact ? 6 : 9
  
  return (
    <Card className={className || "shadow-lg rounded-lg border border-border/40 overflow-hidden bg-white py-0"}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100 border-b-2 [&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-10 [&>tr>th]:bg-gray-100">
              <TableRow className="border-b-0">
                {Array.from({ length: tableColumns }).map((_, index) => (
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
                  {Array.from({ length: tableColumns }).map((_, colIndex) => (
                    <TableCell key={colIndex} className="text-gray-700 py-4">
                      <div className="flex items-center gap-3">
                        {/* Vehicle column (first column) */}
                        {colIndex === 0 && (
                          <>
                            <div className={`h-10 w-16 rounded ${shimmerClass}`}></div>
                            <div className="space-y-1">
                              <div className={`h-4 w-32 ${shimmerClass}`}></div>
                              <div className={`h-3 w-20 ${shimmerClass}`}></div>
                            </div>
                          </>
                        )}
                        {/* Type column */}
                        {colIndex === 1 && (
                          <div className={`h-6 w-20 rounded-full ${shimmerClass}`}></div>
                        )}
                        {/* Engine column */}
                        {colIndex === 2 && (
                          <div className={`h-4 w-16 ${shimmerClass}`}></div>
                        )}
                        {/* Drive column */}
                        {colIndex === 3 && (
                          <div className={`h-4 w-12 ${shimmerClass}`}></div>
                        )}
                        {/* Mileage column */}
                        {colIndex === 4 && (
                          <div className={`h-4 w-20 ${shimmerClass}`}></div>
                        )}
                        {/* Price column */}
                        {colIndex === 5 && (
                          <div className="space-y-1">
                            <div className={`h-4 w-20 ${shimmerClass}`}></div>
                            {!compact && <div className={`h-3 w-16 ${shimmerClass}`}></div>}
                          </div>
                        )}
                        {/* Condition column (non-compact only) */}
                        {colIndex === 6 && !compact && (
                          <div className={`h-6 w-16 rounded-full ${shimmerClass}`}></div>
                        )}
                        {/* Status column (non-compact only) */}
                        {colIndex === 7 && !compact && (
                          <div className={`h-6 w-18 rounded-full ${shimmerClass}`}></div>
                        )}
                        {/* Days column (non-compact only) */}
                        {colIndex === 8 && !compact && (
                          <div className={`h-4 w-12 ${shimmerClass}`}></div>
                        )}
                        {/* Compact mode: combine some columns */}
                        {compact && colIndex === 6 && (
                          <div className="flex items-center gap-2">
                            <div className={`h-6 w-16 rounded-full ${shimmerClass}`}></div>
                            <div className={`h-6 w-18 rounded-full ${shimmerClass}`}></div>
                          </div>
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
