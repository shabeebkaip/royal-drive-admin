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
import type { MakeRow } from "~/types/make"

type DeleteMakeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  make: MakeRow | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteMakeDialog({
  open,
  onOpenChange,
  make,
  onConfirm,
  isLoading = false,
}: DeleteMakeDialogProps) {
  if (!make) return null

  const hasVehicles = make.vehicleCount > 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Make</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {hasVehicles ? (
              <>
                <p>
                  Cannot delete <strong>{make.name}</strong> because it has{" "}
                  <strong>{make.vehicleCount}</strong> vehicle{make.vehicleCount !== 1 ? "s" : ""} associated with it.
                </p>
                <p className="text-amber-600">
                  Please reassign or remove all vehicles from this make before deleting.
                </p>
              </>
            ) : (
              <>
                <p>
                  Are you sure you want to delete <strong>{make.name}</strong>?
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
          {!hasVehicles && (
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Make"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
