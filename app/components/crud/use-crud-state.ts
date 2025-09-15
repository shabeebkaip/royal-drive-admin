import { useState } from "react"
import { toast } from "sonner"
import type { BaseEntity, CrudOperations } from "./types"

export function useCrudState<TEntity extends BaseEntity, TFormData>(
  initialData: TEntity[],
  operations?: CrudOperations<TEntity, TFormData>
) {
  const [data, setData] = useState<TEntity[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (formData: TFormData): Promise<TEntity> => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (operations?.create) {
        const newEntity = await operations.create(formData)
        setData(prev => [newEntity, ...prev])
        toast.success("Item created successfully")
        return newEntity
      } else {
        // Mock implementation for development
        const newEntity = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...formData,
        } as unknown as TEntity
        
        setData(prev => [newEntity, ...prev])
        toast.success("Item created successfully")
        return newEntity
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create'
      setError(errorMessage)
      toast.error("Failed to create item", {
        description: errorMessage
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: string, formData: TFormData): Promise<TEntity> => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (operations?.update) {
        const updatedEntity = await operations.update(id, formData)
        setData(prev => prev.map(item => 
          item.id === id ? updatedEntity : item
        ))
        toast.success("Item updated successfully")
        return updatedEntity
      } else {
        // Mock implementation for development
        const updatedEntity = {
          ...data.find(item => item.id === id)!,
          ...formData,
          updatedAt: new Date().toISOString(),
        } as unknown as TEntity
        
        setData(prev => prev.map(item => 
          item.id === id ? updatedEntity : item
        ))
        toast.success("Item updated successfully")
        return updatedEntity
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update'
      setError(errorMessage)
      toast.error("Failed to update item", {
        description: errorMessage
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (operations?.delete) {
        await operations.delete(id)
      }
      
      setData(prev => prev.filter(item => item.id !== id))
      toast.success("Item deleted successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete'
      setError(errorMessage)
      toast.error("Failed to delete item", {
        description: errorMessage
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async (): Promise<void> => {
    if (!operations?.getAll) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const freshData = await operations.getAll()
      setData(freshData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    data,
    isLoading,
    error,
    actions: {
      create: handleCreate,
      update: handleUpdate,
      delete: handleDelete,
      refresh: handleRefresh,
    }
  }
}
