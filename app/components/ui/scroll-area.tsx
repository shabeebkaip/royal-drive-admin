"use client"

import * as React from "react"
import { cn } from "~/lib/utils"

// Lightweight custom ScrollArea (removes dependency on @radix-ui/react-scroll-area)
// Props kept broadly compatible (className, children). Additional props are spread to wrapper div.
// Styling: wrapper hides native scrollbar track; custom scrollbar rendered absolutely.

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
  hideScrollbar?: boolean
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, viewportClassName, hideScrollbar = false, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
        <div
          className={cn(
            "h-full w-full overflow-auto", 
            hideScrollbar && "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            viewportClassName
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
ScrollArea.displayName = "ScrollArea"

// Placeholder ScrollBar export to avoid breaking imports; optional usage.
const ScrollBar: React.FC<{ orientation?: 'vertical' | 'horizontal'; className?: string }> = () => null

export { ScrollArea, ScrollBar }
