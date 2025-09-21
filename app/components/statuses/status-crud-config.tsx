import { createStatusColumns } from "./columns"
import type { Status } from "~/types/status"

interface StatusActions {
  onEdit: (status: Status) => void
  onDelete: (status: Status) => void
  onActiveToggle: (status: Status, newState: boolean) => void
  onSetDefault: (status: Status) => void
}

export const statusCrudConfig = {
  // Entity configuration
  entityName: "Status",
  entityNamePlural: "Statuses", 
  entityDescription: "Manage vehicle status types with color and icon support",

  // Table columns
  columns: (actions: StatusActions) => createStatusColumns(actions),

  // API endpoints would be used by the service layer
  apiEndpoints: {
    list: "/statuses",
    create: "/statuses",
    update: "/statuses/:id",
    delete: "/statuses/:id",
    updateStatus: "/statuses/:id/status",
    setDefault: "/statuses/:id/default",
    stats: "/statuses/stats",
    dropdown: "/statuses/dropdown",
    default: "/statuses/default",
  },

  // Form field configuration for different contexts
  fields: {
    create: ["name", "code", "color", "isDefault"],
    edit: ["name", "code", "color", "isDefault", "active"],
    filter: ["search", "active", "isDefault"],
  },

  // Validation rules
  validation: {
    name: {
      required: true,
      maxLength: 50,
      message: "Status name is required and cannot exceed 50 characters"
    },
    code: {
      required: false,
      maxLength: 30,
      pattern: /^[a-z0-9\-]*$/,
      message: "Code must contain only lowercase letters, numbers, and hyphens"
    },
    color: {
      required: false,
      pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      message: "Color must be a valid hex color code (e.g., #28a745)"
    }
  },

  // Default values
  defaultValues: {
    active: true,
    isDefault: false,
  },

  // Business rules
  rules: {
    canDelete: (status: Status) => {
      // Can't delete if status is default
      return !status.isDefault
    },
    canDeactivate: (status: Status) => {
      // Can deactivate even if it's default (with warning)
      return true
    },
    canSetDefault: (status: Status) => {
      // Can only set as default if not already default
      return !status.isDefault
    },
  },

  // UI Configuration
  ui: {
    tablePageSize: 10,
    showColor: true,
    showIcon: true,
    showVehicleCount: true,
    showDefaultBadge: true,
    enableBulkActions: false,
    searchPlaceholder: "Search statuses...",
    emptyStateMessage: "No statuses found",
  },

  // Color presets for quick selection
  colorPresets: [
    { name: "Success Green", value: "#28a745" },
    { name: "Danger Red", value: "#dc3545" },
    { name: "Warning Yellow", value: "#ffc107" },
    { name: "Info Blue", value: "#007bff" },
    { name: "Orange", value: "#fd7e14" },
    { name: "Purple", value: "#6f42c1" },
    { name: "Teal", value: "#20c997" },
    { name: "Gray", value: "#6c757d" },
  ],

  // Sample data for reference
  sampleData: [
    { 
      name: "Available", 
      code: "available", 
      description: "Vehicle is available for sale",
      color: "#28a745", 
      icon: "✅",
      isDefault: true 
    },
    { 
      name: "Sold", 
      code: "sold", 
      description: "Vehicle has been sold",
      color: "#dc3545", 
      icon: "🔴" 
    },
    { 
      name: "Pending", 
      code: "pending", 
      description: "Sale is pending completion",
      color: "#ffc107", 
      icon: "⏳" 
    },
    { 
      name: "Reserved", 
      code: "reserved", 
      description: "Vehicle is reserved for a customer",
      color: "#007bff", 
      icon: "🔒" 
    },
    { 
      name: "On Hold", 
      code: "on_hold", 
      description: "Vehicle is temporarily on hold",
      color: "#fd7e14", 
      icon: "⏸️" 
    },
  ]
}
