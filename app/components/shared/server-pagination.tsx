import { Button } from "~/components/ui/button"

export interface ServerPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  onNext: () => void
  onPrevious: () => void
  onFirst: () => void
  onLast: () => void
  isLoading?: boolean
}

export function ServerPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNext,
  hasPrev,
  onPageChange,
  onNext,
  onPrevious,
  onFirst,
  onLast,
  isLoading = false,
}: ServerPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-gray-500">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFirst}
          disabled={!hasPrev || isLoading}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPrev || isLoading}
        >
          Previous
        </Button>
        
        <span className="px-4 py-2 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNext || isLoading}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLast}
          disabled={!hasNext || isLoading}
        >
          Last
        </Button>
      </div>
    </div>
  )
}
