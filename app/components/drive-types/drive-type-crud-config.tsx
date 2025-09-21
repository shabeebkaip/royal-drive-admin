import { createDriveTypeColumns } from "./columns"
import type { DriveType } from "~/types/drive-type"

interface DriveTypeActions {
  onEdit: (driveType: DriveType) => void
  onDelete: (driveType: DriveType) => void
  onStatusToggle: (driveType: DriveType, newStatus: boolean) => void
}

export const driveTypeCrudConfig = {
  // Entity configuration
  entityName: "Drive Type",
  entityNamePlural: "Drive Types", 
  entityDescription: "Manage drivetrain types for vehicles (FWD, RWD, AWD, 4WD)",

  // Table columns
  columns: (actions: DriveTypeActions) => createDriveTypeColumns(actions),

  // API endpoints would be used by the service layer
  apiEndpoints: {
    list: "/drive-types",
    create: "/drive-types",
    update: "/drive-types/:id",
    delete: "/drive-types/:id",
    updateStatus: "/drive-types/:id/status",
    stats: "/drive-types/stats",
    dropdown: "/drive-types/dropdown",
  },

  // Form field configuration for different contexts
  fields: {
    create: ["name", "code"],
    edit: ["name", "code", "active"],
    filter: ["search", "active"],
  },

  // Validation rules
  validation: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-]+$/,
      message: "Drive type name can only contain letters, numbers, spaces, and hyphens"
    },
    code: {
      required: true,
      minLength: 2,
      maxLength: 10,
      pattern: /^[A-Z0-9]+$/,
      message: "Drive type code can only contain uppercase letters and numbers"
    }
  },

  // Default values
  defaultValues: {
    active: true,
  },

  // Business rules
  rules: {
    canDelete: (driveType: DriveType) => {
      // Can't delete if drive type has vehicles
      return !driveType.vehicleCount || driveType.vehicleCount === 0
    },
    canDeactivate: (driveType: DriveType) => {
      // Can deactivate even if it has vehicles (just warn user)
      return true
    },
  },

  // UI Configuration
  ui: {
    tablePageSize: 10,
    showVehicleCount: true,
    enableBulkActions: false,
    searchPlaceholder: "Search drive types...",
    emptyStateMessage: "No drive types found",
  },

  // Sample data for reference
  sampleData: [
    { name: "Front-Wheel Drive", code: "FWD" },
    { name: "Rear-Wheel Drive", code: "RWD" },
    { name: "All-Wheel Drive", code: "AWD" },
    { name: "4-Wheel Drive", code: "4WD" },
  ]
}
