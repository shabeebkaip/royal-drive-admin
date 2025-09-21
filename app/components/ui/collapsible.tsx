import * as React from "react"
import { cn } from "~/utils/cn"

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Collapsible({ open, onOpenChange, children, className }: CollapsibleProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}

interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function CollapsibleTrigger({ children, onClick, ...props }: CollapsibleTriggerProps) {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

export function CollapsibleContent({ children, className }: CollapsibleContentProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}
