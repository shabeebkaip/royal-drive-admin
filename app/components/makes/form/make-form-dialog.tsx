import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { makeFormSchema, defaultMakeValues, type MakeFormData } from "./schema"
import type { MakeRow } from "~/types/make"

type MakeFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: MakeRow
  onSubmit: (data: MakeFormData) => void
  isLoading?: boolean
}

export function MakeFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: MakeFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<MakeFormData>({
    resolver: zodResolver(makeFormSchema),
    defaultValues: mode === "edit" && initialData ? {
      name: initialData.name,
      logo: initialData.logo || "",
    } : defaultMakeValues,
  })

  const logoUrl = watch("logo")

  const handleFormSubmit = (data: MakeFormData) => {
    onSubmit(data)
    if (mode === "add") {
      reset()
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Make" : `Edit ${initialData?.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Create a new vehicle make with name and logo."
              : "Update the make information below."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Make Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Make Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Toyota, Honda, BMW..."
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (Optional)</Label>
              <Input
                id="logo"
                {...register("logo")}
                placeholder="https://example.com/logo.png"
                type="url"
              />
              {errors.logo && (
                <p className="text-sm text-red-600">{errors.logo.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Paste a URL to the make's logo image
              </p>
            </div>

            {/* Logo Preview */}
            {logoUrl && (
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-12 w-12 object-contain bg-white p-2 rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logo Preview</p>
                    <p className="text-xs text-gray-500 truncate">{logoUrl}</p>
                  </div>
                </div>
              </div>
            )}
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
                  ? "Add Make" 
                  : "Update Make"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
