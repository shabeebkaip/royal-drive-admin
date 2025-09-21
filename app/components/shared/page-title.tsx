import * as React from "react"
import { cn } from "~/lib/utils"

type PageTitleProps = {
  title: string
  description?: string
  className?: string
  actions?: React.ReactNode
}

export function PageTitle({ title, description, className, actions }: PageTitleProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-4", className)}>
      <div className="space-y-0.5">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}
