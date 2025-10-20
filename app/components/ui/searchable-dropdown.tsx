import * as React from "react"
import { Check, ChevronsUpDown, X, Search } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Input } from "~/components/ui/input"

export interface DropdownOption {
  label: string
  value: string
  disabled?: boolean
}

interface SearchableDropdownProps {
  // Either pass pre-mapped options...
  options?: DropdownOption[]
  // ...or pass raw items with mapping functions
  items?: any[]
  getOptionLabel?: (item: any) => string
  getOptionValue?: (item: any) => string
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  allowClear?: boolean
  loading?: boolean
}

export function SearchableDropdown({
  options,
  items,
  getOptionLabel,
  getOptionValue,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false,
  className,
  allowClear = false,
  loading = false,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Build options from items if provided
  const computedOptions = React.useMemo<DropdownOption[]>(() => {
    if (options && options.length) return options
    if (items && getOptionLabel && getOptionValue) {
      return items.map((item) => ({
        label: String(getOptionLabel(item) ?? ""),
        value: String(getOptionValue(item) ?? ""),
      }))
    }
    return []
  }, [options, items, getOptionLabel, getOptionValue])

  // Find the selected option
  const selectedOption = computedOptions.find((option) => option.value === value)

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return computedOptions
    
    const query = searchQuery.toLowerCase()
    return computedOptions.filter((option) =>
      option.label.toLowerCase().includes(query)
    )
  }, [computedOptions, searchQuery])

  // Reset highlighted index when filtered options change
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions])

  // Auto-focus search input when popover opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (open && listRef.current) {
      const highlightedElement = listRef.current.children[0]?.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [highlightedIndex, open])

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      // If clicking the same value, deselect it
      onValueChange("")
    } else {
      onValueChange(selectedValue)
    }
    setOpen(false)
    setSearchQuery("")
    setHighlightedIndex(0)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          handleSelect(filteredOptions[highlightedIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        setSearchQuery("")
        setHighlightedIndex(0)
        break
      case 'Tab':
        setOpen(false)
        setSearchQuery("")
        setHighlightedIndex(0)
        break
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled || loading}
        >
          <span className="truncate">
            {loading
              ? "Loading..."
              : selectedOption
              ? selectedOption.label
              : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {allowClear && value && !disabled && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
      >
        {/* Search Input */}
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 w-full border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Scrollable Options List */}
        <div 
          ref={listRef}
          className="max-h-[300px] overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                    option.disabled
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent",
                    highlightedIndex === index && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
