import { useState, useRef } from "react"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { uploadImage } from "~/lib/image-upload"
import { toast } from "sonner"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({ images, onImagesChange, maxImages = 10, disabled = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`, {
        description: `You can only upload ${maxImages - images.length} more image(s)`
      })
      return
    }

    setUploading(true)
    const uploadPromises = files.map(file => uploadImage(file))

    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedUrls])
      toast.success("Images uploaded successfully", {
        description: `${files.length} image(s) uploaded`
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload failed", {
        description: "Some images failed to upload. Please try again."
      })
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Vehicle Images</Label>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Vehicle image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://via.placeholder.com/300x300/cccccc/969696?text=Image+Error"
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                disabled={disabled || uploading}
                className="mb-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Images"}
              </Button>
              <p className="text-sm text-gray-500">
                {images.length === 0 ? "Upload vehicle images (required)" : `Upload up to ${maxImages - images.length} more images`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports JPG, PNG, WebP up to 10MB each
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {images.length === 0 && (
        <p className="text-sm text-red-600">At least one image is required</p>
      )}
    </div>
  )
}
