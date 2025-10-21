import * as React from "react"
import { cn } from "~/lib/utils"

interface SwitchProps {
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ defaultChecked, checked, onCheckedChange, disabled, className }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)
    
    const currentChecked = checked !== undefined ? checked : isChecked

    const handleClick = () => {
      if (disabled) return
      const newValue = !currentChecked
      setIsChecked(newValue)
      onCheckedChange?.(newValue)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={currentChecked}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          currentChecked ? "bg-primary" : "bg-input",
          className
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            currentChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    )
  }
)

Switch.displayName = "Switch"

