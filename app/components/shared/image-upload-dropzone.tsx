import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { uploadImage } from "~/lib/image-upload"

interface ImageUploadDropzoneProps {
  onUploadSuccess: (url: string) => void
  onUploadError?: (error: string) => void
  currentImageUrl?: string
  disabled?: boolean
  maxSize?: number // in bytes, default 5MB
  className?: string
}

export function ImageUploadDropzone({
  onUploadSuccess,
  onUploadError,
  currentImageUrl,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
}: ImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)

  // Sync currentImageUrl prop changes with internal state
  useEffect(() => {
    setPreviewUrl(currentImageUrl || null)
  }, [currentImageUrl])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setError(null)
      setIsUploading(true)

      try {
        // Create preview URL immediately
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        // Upload to server
        const uploadedUrl = await uploadImage(file)
        
        // Clean up object URL and set server URL
        URL.revokeObjectURL(objectUrl)
        setPreviewUrl(uploadedUrl)
        onUploadSuccess(uploadedUrl)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMessage)
        onUploadError?.(errorMessage)
        setPreviewUrl(currentImageUrl || null)
      } finally {
        setIsUploading(false)
      }
    },
    [onUploadSuccess, onUploadError, currentImageUrl]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize,
    maxFiles: 1,
    disabled: disabled || isUploading,
  })

  const removeImage = () => {
    setPreviewUrl(null)
    setError(null)
    onUploadSuccess("")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Image */}
      {previewUrl && (
        <div className="flex items-center justify-center">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
            />
            {!isUploading && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 shadow-md"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <div className="bg-white rounded-full p-2">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dropzone */}
      {!previewUrl && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="py-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900">Uploading...</p>
            </div>
          ) : (
            <div className="py-8">
              {isDragActive ? (
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              )}
              
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload an image'}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop or click to browse
              </p>
              
              <div className="text-xs text-gray-400">
                <div>PNG, JPG, GIF, WEBP • Max {formatFileSize(maxSize)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <X className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="font-medium">Upload failed</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* File Rejection Errors */}
      {fileRejections.length > 0 && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="space-y-2">
            <p className="font-medium text-red-800">File validation errors:</p>
            <ul className="space-y-2">
              {fileRejections.map(({ file, errors }) => (
                <li key={file.name} className="bg-white rounded-md p-3 border border-red-100">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <ul className="mt-1 space-y-1">
                    {errors.map((error) => (
                      <li key={error.code} className="text-red-600 text-xs">
                        • {error.code === 'file-too-large' 
                          ? `File is too large. Maximum size is ${formatFileSize(maxSize)}`
                          : error.message
                        }
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
