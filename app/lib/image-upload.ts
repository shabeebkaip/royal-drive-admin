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

    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'
    const response = await fetch(`${apiBaseUrl}/uploads`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data: ImageUploadResponse = await response.json()

    if (!data.success || !data.data?.secureUrl) {
      throw new Error(data.message || 'Upload failed')
    }

    // Return the secure URL (HTTPS version)
    return data.data.secureUrl
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}
