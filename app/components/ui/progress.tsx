import * as React from "react"
import { cn } from "~/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      data-slot="progress"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full bg-blue-600 transition-all duration-300 ease-in-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export { Progress }
