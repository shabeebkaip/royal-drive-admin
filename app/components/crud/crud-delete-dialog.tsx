import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import type { BaseEntity, CrudConfig } from "./types"

type CrudDeleteDialogProps<TEntity extends BaseEntity, TFormData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: TEntity | null
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
  config: CrudConfig<TEntity, TFormData>
}

export function CrudDeleteDialog<TEntity extends BaseEntity, TFormData>({
  open,
  onOpenChange,
  entity,
  onConfirm,
  isLoading = false,
  config,
}: CrudDeleteDialogProps<TEntity, TFormData>) {
  if (!entity) return null

  const canDelete = config.canDelete ? config.canDelete(entity) : true
  const deleteWarning = config.deleteWarning ? config.deleteWarning(entity) : null
  const entityName = (entity as any).name || config.entityName.toLowerCase()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {config.entityName}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {!canDelete && deleteWarning ? (
              <>
                <p>
                  Cannot delete <strong>{entityName}</strong>.
                </p>
                <p className="text-amber-600">
                  {deleteWarning}
                </p>
              </>
            ) : (
              <>
                <p>
                  Are you sure you want to delete <strong>{entityName}</strong>?
                </p>
                <p className="text-red-600">
                  This action cannot be undone.
                </p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : `Delete ${config.entityName}`}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
