import { toast } from "sonner"

// Image upload API service
export interface ImageUploadResponse {
  success: boolean
  message: string
  timestamp: string
  data: {
    url: string
    secureUrl: string
    publicId: string
    resourceType: string
    format: string
    bytes: number
    width: number
    height: number
    originalFilename: string
  }
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'royal-drive/images')

    // Show loading toast
    const uploadToast = toast.loading("Uploading image...", {
      description: `Uploading ${file.name}`
    })

    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'
    const response = await fetch(`${apiBaseUrl}/uploads`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      toast.dismiss(uploadToast)
      toast.error("Upload failed", {
        description: `Failed to upload ${file.name}: ${response.statusText}`
      })
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data: ImageUploadResponse = await response.json()

    if (!data.success || !data.data?.secureUrl) {
      toast.dismiss(uploadToast)
      toast.error("Upload failed", {
        description: data.message || 'Upload failed'
      })
      throw new Error(data.message || 'Upload failed')
    }

    // Dismiss loading toast and show success
    toast.dismiss(uploadToast)
    toast.success("Image uploaded successfully", {
      description: `${file.name} has been uploaded`
    })

    // Return the secure URL (HTTPS version)
    return data.data.secureUrl
  } catch (error) {
    console.error('Image upload error:', error)
    // If we haven't already shown an error toast, show a generic one
    if (error instanceof Error && !error.message.includes('Upload failed:')) {
      toast.error("Upload failed", {
        description: "An unexpected error occurred during upload"
      })
    }
    throw error
  }
}
