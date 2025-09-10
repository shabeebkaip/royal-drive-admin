import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"
import { Button } from "~/components/ui/button"

export type PaginationState = {
  pageIndex: number
  pageSize: number
}

type Props = {
  pageCount: number
  state: PaginationState
  onChange: (state: PaginationState) => void
}

export function DataPagination({ pageCount, state, onChange }: Props) {
  const canPrev = state.pageIndex > 0
  const canNext = state.pageIndex < pageCount - 1

  const setPageIndex = (pageIndex: number) => onChange({ ...state, pageIndex })

  return (
    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium">{state.pageIndex + 1}</span> of
        <span className="font-medium"> {pageCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => setPageIndex(0)}
          className="w-8 p-0"
        >
          <IconChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => setPageIndex(state.pageIndex - 1)}
          className="w-8 p-0"
        >
          <IconChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => setPageIndex(state.pageIndex + 1)}
          className="w-8 p-0"
        >
          <IconChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => setPageIndex(pageCount - 1)}
          className="w-8 p-0"
        >
          <IconChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
