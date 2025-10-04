/**
 * Sanitize vehicle payload by removing stockNumber and any null/undefined values
 * This prevents E11000 duplicate key errors when the backend has removed stockNumber logic
 * Also removes empty objects and empty arrays
 */
export function sanitizeVehiclePayload<T = any>(input: T): T {
  const omittedKeys = new Set(['stockNumber'])

  const walk = (val: any): any => {
    // Handle arrays
    if (Array.isArray(val)) {
      const filtered = val.map(walk).filter(item => item !== undefined && item !== null)
      // Return undefined if array is empty (will be removed by parent)
      return filtered.length > 0 ? filtered : undefined
    }
    
    // Handle objects (but not Date)
    if (val && typeof val === 'object' && !(val instanceof Date)) {
      const result: any = {}
      
      for (const [key, value] of Object.entries(val)) {
        // Skip if key is in the omitted list
        if (omittedKeys.has(key)) {
          continue
        }
        
        // Skip if value is null or undefined
        if (value === null || value === undefined) {
          continue
        }
        
        // Recursively process the value
        const processedValue = walk(value)
        
        // Only add if the processed value is not undefined and not an empty object
        if (processedValue !== undefined) {
          // Don't add empty objects or empty arrays
          if (typeof processedValue === 'object' && !Array.isArray(processedValue) && !(processedValue instanceof Date)) {
            if (Object.keys(processedValue).length > 0) {
              result[key] = processedValue
            }
          } else {
            result[key] = processedValue
          }
        }
      }
      
      // Return undefined if object is empty (will be removed by parent)
      return Object.keys(result).length > 0 ? result : undefined
    }
    
    return val
  }

  const sanitized = walk(input)
  // If result is undefined or empty object, return empty object
  return sanitized && typeof sanitized === 'object' && Object.keys(sanitized).length > 0 
    ? sanitized 
    : {} as T
}

/**
 * Get only the changed fields between original and updated data
 * This optimizes the update process by sending only what changed
 * 
 * Important: For arrays, the entire array is included if any element changed
 * This matches backend behavior where arrays are replaced, not merged
 */
export function getChangedFields(original: any, updated: any): any {
  const changes: any = {}

  // Helper to check if values are equal
  const isEqual = (val1: any, val2: any): boolean => {
    // Handle null/undefined
    if (val1 === val2) return true
    if (val1 == null || val2 == null) return false
    
    // Handle arrays - compare by JSON string for simplicity
    // Backend replaces arrays entirely, so we need exact comparison
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false
      return JSON.stringify(val1) === JSON.stringify(val2)
    }
    
    // Handle dates
    if (val1 instanceof Date && val2 instanceof Date) {
      return val1.getTime() === val2.getTime()
    }
    
    // Handle date strings
    if (typeof val1 === 'string' && typeof val2 === 'string') {
      // Try parsing as dates
      const date1 = new Date(val1)
      const date2 = new Date(val2)
      if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
        return date1.getTime() === date2.getTime()
      }
    }
    
    // Handle objects (but not Date instances)
    if (
      typeof val1 === 'object' && 
      typeof val2 === 'object' &&
      !Array.isArray(val1) &&
      !Array.isArray(val2) &&
      !(val1 instanceof Date) &&
      !(val2 instanceof Date)
    ) {
      const keys1 = Object.keys(val1)
      const keys2 = Object.keys(val2)
      
      // Get all unique keys from both objects
      const allKeys = new Set([...keys1, ...keys2])
      
      return Array.from(allKeys).every(key => isEqual(val1[key], val2[key]))
    }
    
    return val1 === val2
  }

  // Walk through updated object
  for (const [key, newValue] of Object.entries(updated)) {
    const oldValue = original[key]
    
    // Skip if values are equal
    if (isEqual(oldValue, newValue)) {
      continue
    }
    
    // For arrays: include entire array if changed (backend replaces arrays)
    if (Array.isArray(newValue)) {
      changes[key] = newValue
      continue
    }
    
    // For objects (excluding Date): recurse to get nested changes
    if (
      newValue &&
      typeof newValue === 'object' &&
      !(newValue instanceof Date) &&
      oldValue &&
      typeof oldValue === 'object' &&
      !(oldValue instanceof Date) &&
      !Array.isArray(oldValue)
    ) {
      const nestedChanges = getChangedFields(oldValue, newValue)
      // Only include if there are actual changes
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges
      }
    } else {
      // Primitive value, Date, or null changed
      changes[key] = newValue
    }
  }

  return changes
}
