# Vehicle API Integration Documentation

## Overview
This document outlines the complete integration of the Vehicle Add/Edit functionality with the Royal Drive API. The implementation provides a unified form for both creating and updating vehicles using real API endpoints.

## Environment Setup

### 1. Environment Variables
Create a `.env` file in the project root with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.royaldrivecanada.com/api/v1

# Environment
NODE_ENV=development
```

### 2. API Base URL Configuration
The API services automatically use the environment variable or fallback to localhost:

```typescript
// In services/vehicleApiService.ts
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.royaldrivecanada.com/api/v1'
const BASE_URL = `${API_BASE_URL}/vehicles`
```

## File Structure

### Updated Files:
- `app/services/vehicleApiService.ts` - Vehicle API service with environment support
- `app/routes/vehicles.add.tsx` - Add vehicle route with real API integration
- `app/routes/vehicles.$id.edit.tsx` - Edit vehicle route with real API integration
- `app/components/vehicles/addEdit/vehicle-form.tsx` - Updated form with status API integration
- `app/hooks/useVehicleOperations.ts` - Custom hook for vehicle operations

### Created Files:
- `.env.example` - Environment variables template
- `docs/VEHICLE_API_INTEGRATION.md` - This documentation file

## API Integration Details

### 1. Vehicle API Service
The `vehicleApiService` provides methods for all CRUD operations:

```typescript
// Create vehicle
await vehicleApiService.createVehicle(formData)

// Update vehicle
await vehicleApiService.updateVehicle(id, formData)

// Get vehicle by ID
await vehicleApiService.getVehicleById(id)

// Delete vehicle
await vehicleApiService.deleteVehicle(id)
```

### 2. Data Transformation
The service automatically transforms form data to match the API schema:

```typescript
// Form data to API format transformation
function transformFormDataToApiFormat(formData: VehicleFormData) {
  return {
    // Basic Vehicle Information
    vin: formData.vin || undefined,
    make: formData.make,
    model: formData.model,
    year: formData.year,
    trim: formData.trim || undefined,
    type: formData.bodyType,

    // Engine & Performance
    engine: {
      size: formData.engineSize,
      cylinders: formData.cylinders,
      fuelType: formData.fuelType,
      horsepower: formData.horsepower || undefined,
    },

    // ... more transformations
  }
}
```

### 3. Status Integration
The form now loads statuses dynamically from the API:

```typescript
// In vehicle-form.tsx
const [statuses, setStatuses] = useState<StatusDropdownItem[]>([])

useEffect(() => {
  const fetchStatuses = async () => {
    try {
      setLoadingStatuses(true)
      const response = await statusesApiService.getActiveForDropdown()
      setStatuses(response.data || [])
    } catch (error) {
      console.error('Error fetching statuses:', error)
    } finally {
      setLoadingStatuses(false)
    }
  }

  fetchStatuses()
}, [])
```

## Usage Examples

### 1. Creating a New Vehicle
```typescript
// In vehicles.add.tsx
const { createVehicle, loading } = useVehicleOperations()

const handleSubmit = async (data: VehicleFormData) => {
  try {
    const result = await createVehicle(data)
    toast.success("Vehicle added successfully")
    navigate("/vehicles")
  } catch (error) {
    toast.error("Failed to add vehicle")
  }
}
```

### 2. Editing an Existing Vehicle
```typescript
// In vehicles.$id.edit.tsx
const { updateVehicle, getVehicleById, loading } = useVehicleOperations()

// Load vehicle data
useEffect(() => {
  const fetchVehicle = async () => {
    const response = await getVehicleById(id)
    setVehicle(response.data)
  }
  fetchVehicle()
}, [id])

// Update vehicle
const handleSubmit = async (data: VehicleFormData) => {
  await updateVehicle(id, data)
  toast.success("Vehicle updated successfully")
  navigate("/vehicles")
}
```

## Form Features

### 1. Unified Form Component
The `VehicleForm` component works for both add and edit modes:

```typescript
<VehicleForm 
  mode="add"              // or "edit"
  initialData={data}      // Optional for edit mode
  onSubmit={handleSubmit}
  isLoading={loading}
/>
```

### 2. Dynamic Dropdowns
All dropdowns are populated from API endpoints:
- **Makes**: Loaded from Makes API
- **Models**: Loaded based on selected make
- **Vehicle Types**: Loaded from Vehicle Types API
- **Fuel Types**: Loaded from Fuel Types API
- **Transmissions**: Loaded from Transmissions API
- **Drive Types**: Loaded from Drive Types API
- **Statuses**: Loaded from Statuses API

### 3. Form Validation
Comprehensive validation using Zod schema:
- Required fields validation
- Data type validation
- Business rule validation (e.g., year ranges, positive numbers)

## Error Handling

### 1. API Errors
```typescript
try {
  await createVehicle(data)
} catch (error) {
  // Error is automatically caught and displayed
  let errorMessage = "An error occurred while saving the vehicle."
  if (error instanceof Error) {
    errorMessage = error.message
  }
  
  toast.error("Failed to add vehicle", {
    description: errorMessage
  })
}
```

### 2. Form Errors
Form validation errors are displayed inline:
```typescript
{errors.listPrice && (
  <p className="text-sm text-red-600">{errors.listPrice.message}</p>
)}
```

### 3. Loading States
Loading states are managed throughout the application:
```typescript
<VehicleForm isLoading={loading} />
```

## Data Flow

### 1. Create Vehicle Flow
1. User fills out the form
2. Form validates data using Zod schema
3. Data is transformed to API format
4. POST request to `/api/v1/vehicles`
5. Success/error handling with toast notifications
6. Navigation to vehicles list on success

### 2. Edit Vehicle Flow
1. Load vehicle data using GET `/api/v1/vehicles/:id`
2. Transform API response to form format
3. Populate form with existing data
4. User modifies data
5. Form validates changes
6. Data is transformed to API format
7. PUT request to `/api/v1/vehicles/:id`
8. Success/error handling with toast notifications
9. Navigation to vehicles list on success

## Custom Hook: useVehicleOperations

The custom hook provides a clean interface for vehicle operations:

```typescript
const {
  createVehicle,
  updateVehicle,
  getVehicleById,
  deleteVehicle,
  loading,
  error,
  clearError
} = useVehicleOperations()
```

Benefits:
- Centralized loading state management
- Consistent error handling
- Reusable across components
- Clean separation of concerns

## Testing the Integration

### 1. Prerequisites
- Ensure the API server is running on `http://localhost:3001`
- Verify all required endpoints are available:
  - `POST /api/v1/vehicles`
  - `PUT /api/v1/vehicles/:id`
  - `GET /api/v1/vehicles/:id`
  - `GET /api/v1/statuses/dropdown`

### 2. Test Add Vehicle
1. Navigate to `/vehicles/add`
2. Fill out all required fields
3. Submit the form
4. Verify success toast and navigation
5. Check API logs for successful creation

### 3. Test Edit Vehicle
1. Navigate to `/vehicles/:id/edit` with valid vehicle ID
2. Verify form loads with existing data
3. Modify some fields
4. Submit the form
5. Verify success toast and navigation
6. Check API logs for successful update

## Production Considerations

### 1. Environment Variables
Set appropriate API base URL for production:
```bash
VITE_API_BASE_URL=https://api.royaldrive.com/v1
```

### 2. Error Monitoring
Consider integrating error monitoring service (Sentry, etc.) for production error tracking.

### 3. Performance Optimization
- Implement proper loading states
- Consider caching for dropdown data
- Optimize API calls with proper pagination

### 4. Security
- Ensure proper authentication headers are added
- Validate all user inputs on both client and server
- Implement proper CORS configuration

## Troubleshooting

### Common Issues:

1. **API Connection Failed**
   - Check if API server is running
   - Verify VITE_API_BASE_URL environment variable
   - Check network connectivity

2. **Form Validation Errors**
   - Ensure all required fields are filled
   - Check data types match schema requirements
   - Verify dropdown selections are valid

3. **Loading State Issues**
   - Check if loading states are properly managed
   - Verify error handling is implemented
   - Ensure promises are properly awaited

4. **Data Transformation Issues**
   - Check API response format matches expected structure
   - Verify form data is properly transformed to API format
   - Check for missing or extra fields

This integration provides a robust, production-ready vehicle management system with real API connectivity and comprehensive error handling.
