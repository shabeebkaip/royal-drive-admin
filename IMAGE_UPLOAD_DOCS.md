## Recent Fixes

### ✅ Fixed Image Preview Issue
**Problem:** Image preview wasn't showing after successful upload when using with React Hook Form.

**Root Cause:** The component wasn't syncing the `currentImageUrl` prop changes with its internal `previewUrl` state.

**Solution:** Added `useEffect` to sync prop changes:
```tsx
// Sync currentImageUrl prop changes with internal state  
useEffect(() => {
  setPreviewUrl(currentImageUrl || null)
}, [currentImageUrl])
```

**API Response Structure:** Updated to handle Cloudinary response format:
```json
{
  "success": true,
  "message": "File uploaded",
  "timestamp": "2025-09-12T11:27:24.411Z",
  "data": {
    "url": "http://res.cloudinary.com/djockemg3/image/upload/v1757676443/royal-drive/images/file_dajxnl.jpg",
    "secureUrl": "https://res.cloudinary.com/djockemg3/image/upload/v1757676443/royal-drive/images/file_dajxnl.jpg",
    "publicId": "royal-drive/images/file_dajxnl",
    "resourceType": "image",
    "format": "jpg",
    "bytes": 80574,
    "width": 1920,
    "height": 860,
    "originalFilename": "90a4f6cf5cd9f1fe06f0d9b68424e8f829e3b2d8.jpg"
  }
}
```

Now the image preview works correctly: upload → show preview → form value updates → preview persists.

---

# Image Upload Service Documentation

## Overview
The image upload system provides a complete solution for uploading images with drag-and-drop interface, preview functionality, and error handling.

## Components

### 1. ImageUploadDropzone Component
Located: `app/components/shared/image-upload-dropzone.tsx`

**Props:**
- `onUploadSuccess: (url: string) => void` - Callback when upload succeeds
- `onUploadError?: (error: string) => void` - Optional error handler  
- `currentImageUrl?: string` - URL of existing image to display
- `disabled?: boolean` - Disable the dropzone
- `maxSize?: number` - Max file size in bytes (default: 5MB)
- `className?: string` - Additional CSS classes

**Usage Example:**
```tsx
import { ImageUploadDropzone } from "~/components/shared/image-upload-dropzone"

<ImageUploadDropzone
  onUploadSuccess={(url) => setValue("logo", url)}
  currentImageUrl={logoUrl}
  className="h-32"
  onUploadError={(error) => console.error("Upload failed:", error)}
/>
```

### 2. Image Upload API Service
Located: `app/lib/image-upload.ts`

**Function:**
```typescript
uploadImage(file: File): Promise<{ url: string }>
```

**Features:**
- Uploads to `royal-drive/images/` folder on the server
- Handles FormData encoding
- Returns the uploaded image URL
- Proper error handling and status checking

**Usage Example:**
```typescript
import { uploadImage } from "~/lib/image-upload"

try {
  const result = await uploadImage(file)
  console.log("Uploaded image URL:", result.url)
} catch (error) {
  console.error("Upload failed:", error)
}
```

## Integration Example

### In Make CRUD Form
The image upload has been integrated into the vehicle makes form:

```tsx
// In make-crud-config.tsx
renderForm: ({ register, errors, watch, setValue }: FormRenderProps<MakeFormData>) => {
  const logoUrl = watch("logo")
  
  return (
    <>
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Logo Image</Label>
        <ImageUploadDropzone
          onUploadSuccess={(url: string) => setValue("logo", url)}
          currentImageUrl={logoUrl}
          className="h-32"
        />
        {errors.logo && (
          <p className="text-sm text-red-600">{errors.logo.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Upload a logo image for this vehicle make (PNG, JPG, or WEBP)
        </p>
      </div>

      {/* Manual URL Entry (Alternative) */}
      <div className="space-y-2">
        <Label htmlFor="logo">Or paste Logo URL</Label>
        <Input
          id="logo"
          {...register("logo")}
          placeholder="https://example.com/logo.png"
          type="url"
        />
        <p className="text-xs text-gray-500">
          Alternatively, paste a direct URL to the logo image
        </p>
      </div>
    </>
  )
}
```

## API Configuration

The upload service uses the environment variable for the API base URL:

**.env file:**
```
VITE_API_BASE_URL=http://localhost:3001/api/v1/
```

**Upload endpoint:** `POST {VITE_API_BASE_URL}/upload/image`

**Expected server response:**
```json
{
  "url": "http://localhost:3001/api/v1/uploads/royal-drive/images/filename.jpg"
}
```

## Features

### Drag & Drop Interface
- Visual feedback for drag over states
- Click to browse files alternative
- File type validation (PNG, JPG, JPEG, WEBP)
- File size validation (configurable, default 5MB)

### Image Preview
- Shows current image if `currentImageUrl` is provided
- Preview with remove button
- Fallback for broken images

### Error Handling
- Invalid file type errors
- File size limit errors
- Upload failure errors
- Network errors

### Loading States
- Upload progress indication
- Disabled state during upload
- Visual feedback for all states

## Styling
Uses Tailwind CSS classes and can be customized via the `className` prop. The component includes:
- Hover and focus states
- Border animations for drag states
- Responsive design
- Accessible keyboard navigation
