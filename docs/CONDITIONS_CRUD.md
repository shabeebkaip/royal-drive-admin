# Conditions CRUD Module

This document describes the updated Conditions CRUD module that implements the complete Conditions API as per the provided documentation.

## 📁 File Structure

```
app/
├── types/condition.ts                    # TypeScript interfaces and types
├── services/conditionsService.ts         # API service layer
├── components/conditions/
│   ├── use-conditions.ts                 # React hook for state management
│   └── columns.tsx                       # Table column definitions
├── routes/conditions.tsx                 # Main conditions page
└── utils/conditions-test.ts              # Testing utilities
```

## 🔧 Key Features

### ✅ Complete API Integration
- **All 12 API endpoints** from the documentation implemented
- **Standard response handling** with proper error management
- **Type-safe** operations with comprehensive TypeScript interfaces

### ✅ Enhanced UI Components
- **Statistics dashboard** showing total, active, inactive, and most used conditions
- **Advanced search and filtering** with real-time updates
- **Form validation** following API rules (2-50 characters, allowed characters)
- **Optimistic updates** for better user experience

### ✅ API Endpoints Implemented

1. `GET /conditions` - Get all conditions with pagination/filtering
2. `GET /conditions/active` - Get active conditions only
3. `GET /conditions/dropdown` - Get dropdown data
4. `GET /conditions/stats` - Get condition statistics
5. `GET /conditions/:id` - Get condition by ID
6. `GET /conditions/slug/:slug` - Get condition by slug
7. `POST /conditions` - Create new condition
8. `PUT /conditions/:id` - Update condition
9. `PATCH /conditions/:id/status` - Update active status
10. `PATCH /conditions/bulk/status` - Bulk update statuses
11. `DELETE /conditions/:id` - Delete condition
12. `GET /conditions/search` - Search conditions

## 🎯 Usage Examples

### Using the Service Layer

```typescript
import { conditionsService } from "~/services/conditionsService"

// Get all conditions with filtering
const result = await conditionsService.getAll({
  active: true,
  search: "new",
  page: 1,
  limit: 10
})

// Get statistics
const stats = await conditionsService.getStats()

// Create new condition
const newCondition = await conditionsService.create({
  name: "Certified Pre-Owned",
  active: true
})
```

### Using the React Hook

```typescript
import { useConditions } from "~/components/conditions/use-conditions"

function MyComponent() {
  const {
    conditions,
    loading,
    error,
    pagination,
    create,
    update,
    delete: deleteCondition,
    getStats,
    search
  } = useConditions()

  // Hook provides complete CRUD operations
  // with optimistic updates and error handling
}
```

## 📋 Validation Rules

According to the API documentation:

- **Name**: Required, 2-50 characters
- **Characters**: Letters, numbers, spaces, and hyphens only
- **Uniqueness**: Names must be unique (case-insensitive)
- **Slug**: Auto-generated from name (do not send in requests)
- **Active**: Boolean, defaults to `true`

## 🎨 UI Features

### Statistics Dashboard
- Real-time condition statistics
- Most used condition display
- Active/inactive counts
- Responsive card layout

### Enhanced Search & Filtering
- Search by name and slug
- Filter by active status
- Sorting options (name, created date, updated date)
- Server-side pagination

### Form Validation
- Real-time validation feedback
- Character counting and restrictions
- Clear error messages
- Auto-generation notes for slugs

### Protection Features
- Prevents deletion of conditions with associated vehicles
- Warning messages for conditions in use
- Bulk operations support

## 🧪 Testing

Use the test utilities in `utils/conditions-test.ts`:

```javascript
// In browser console
await testConditionsAPI()        // Test all read operations
testConditionValidation()        // Test validation rules
await testConditionCRUD()        // Test CRUD operations (creates data)
```

## 🔄 Integration

The Conditions CRUD integrates seamlessly with:

- **Navigation**: Available in sidebar as "Conditions"
- **Route**: Accessible at `/conditions`
- **API**: Connects to `/api/v1/conditions` endpoints
- **Design System**: Uses shadcn/ui components
- **State Management**: Custom hooks with optimistic updates

## 📊 API Response Format

All API responses follow the standard format:

```typescript
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
}
```

## 🚀 Future Enhancements

Potential improvements that could be added:

1. **Bulk Operations UI**: Checkbox selection for bulk actions
2. **Export/Import**: CSV export and import functionality
3. **Audit Logs**: Track changes to conditions
4. **Advanced Analytics**: Usage trends and reports
5. **Drag & Drop**: Reorder conditions by priority

## 🔧 Configuration

The module is configured through:

- **Base URL**: Set in `conditionsService.ts`
- **Pagination**: Default 10 items per page
- **Validation**: Regex patterns in form validation
- **Auto-refresh**: After successful CRUD operations

This implementation provides a complete, production-ready Conditions CRUD module that follows best practices and integrates perfectly with the existing codebase architecture.
