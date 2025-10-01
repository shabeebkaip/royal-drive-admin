import { z } from "zod"
import type { ColumnDef } from "@tanstack/react-table"
import type { ReactNode } from "react"
import type { FieldValues, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form"

// Base entity interface that all CRUD entities must implement
export interface BaseEntity {
  id: string
  _id?: string // MongoDB ObjectId support
  createdAt: string
  updatedAt?: string
}

// Generic CRUD configuration
export interface CrudConfig<TEntity extends BaseEntity, TFormData extends FieldValues> {
  // Entity configuration
  entityName: string           // "Make", "Vehicle Type"
  entityNamePlural: string     // "Makes", "Vehicle Types"
  entityDescription: string    // Description for the page

  // Schema and validation
  schema: z.ZodSchema<TFormData>
  defaultValues: TFormData

  // Table configuration
  columns: (actions: CrudActions<TEntity>) => ColumnDef<TEntity>[]
  
  // Form configuration
  renderForm: (props: FormRenderProps<TFormData>) => ReactNode
  
  // API configuration (for future use)
  apiEndpoint?: string
  
  // Optional customizations
  searchFields?: (keyof TEntity)[]  // Fields to search in
  deleteWarning?: (entity: TEntity) => string | null  // Custom delete warning
  canDelete?: (entity: TEntity) => boolean  // Whether entity can be deleted
  
  // Enhanced features
  supportsStatusFilter?: boolean    // Whether entity supports active/inactive filtering
  supportsAdvancedSearch?: boolean  // Whether to show advanced search options
  supportsBulkActions?: boolean     // Whether to show bulk action controls
}

// Actions passed to columns and other components
export interface CrudActions<TEntity extends BaseEntity> {
  onEdit: (entity: TEntity) => void
  onDelete: (entity: TEntity) => void
  onView?: (entity: TEntity) => void
  onStatusToggle?: (entity: TEntity, newStatus: boolean) => Promise<void>
  onBulkAction?: (entities: TEntity[], action: string) => Promise<void>
}

// Props for form rendering
export interface FormRenderProps<TFormData extends FieldValues> {
  register: UseFormRegister<TFormData>
  errors: FieldErrors<TFormData>
  watch: UseFormWatch<TFormData>
  setValue: UseFormSetValue<TFormData>
  formData?: TFormData  // for edit mode
}

// Hook return type for CRUD operations
export interface CrudState<TEntity extends BaseEntity> {
  data: TEntity[]
  isLoading: boolean
  error: string | null
}

// CRUD operations interface
export interface CrudOperations<TEntity extends BaseEntity, TFormData extends FieldValues> {
  create: (data: TFormData) => Promise<TEntity>
  update: (id: string, data: TFormData) => Promise<TEntity>
  delete: (id: string) => Promise<void>
  getAll: () => Promise<TEntity[]>
}
