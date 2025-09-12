import { useForm, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import type { BaseEntity, CrudConfig } from "./types"

type CrudFormDialogProps<TEntity extends BaseEntity, TFormData extends FieldValues> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: TEntity
  onSubmit: (data: TFormData) => void | Promise<void>
  isLoading?: boolean
  config: CrudConfig<TEntity, TFormData>
}

export function CrudFormDialog<TEntity extends BaseEntity, TFormData extends FieldValues>({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  config,
}: CrudFormDialogProps<TEntity, TFormData>) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
  })

  // Reset form with entity data when editing
  useEffect(() => {
    if (mode === "edit" && initialData && open) {
      // Extract only the form fields from the entity
      const formData = Object.keys(config.defaultValues).reduce((acc, key) => {
        if (key in (initialData as any)) {
          acc[key as keyof TFormData] = (initialData as any)[key]
        }
        return acc
      }, {} as Partial<TFormData>)
      
      reset(formData as TFormData)
    } else if (mode === "add" && open) {
      reset(config.defaultValues)
    }
  }, [mode, initialData, open, reset, config.defaultValues])

  const handleFormSubmit = async (data: TFormData) => {
    await onSubmit(data)
    if (mode === "add") {
      reset()
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const entityName = config.entityName.toLowerCase()
  const title = mode === "add" 
    ? `Add New ${config.entityName}`
    : `Edit ${initialData ? (initialData as any).name || config.entityName : config.entityName}`

  const description = mode === "add"
    ? `Create a new ${entityName} in the system.`
    : `Update the ${entityName} information below.`

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
          <div className="space-y-4">
            {config.renderForm({
              register,
              errors,
              watch,
              setValue,
              formData: mode === "edit" ? (initialData as unknown as TFormData) : undefined,
            })}
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? "Saving..." 
                : mode === "add" 
                  ? `Add ${config.entityName}` 
                  : `Update ${config.entityName}`
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
