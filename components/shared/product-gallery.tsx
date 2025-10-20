"use client"

import { useState, useCallback } from "react"
import { Carousel } from "@/components/shared/carousel"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ZoomIn } from "lucide-react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
  className?: string
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index)
  }, [])

  const handleMainImageClick = useCallback(() => {
    setIsZoomed(true)
  }, [])

  const selectedImages = images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden rounded-lg">
        <Carousel
          images={selectedImages}
          aspectRatio="square"
          showDots={selectedImages.length > 1}
          showArrows={selectedImages.length > 1}
        />
        <button
          onClick={handleMainImageClick}
          className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {selectedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {selectedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative overflow-hidden rounded-lg border-2 transition-all",
                selectedImageIndex === index
                  ? "border-primary scale-105"
                  : "border-muted hover:border-muted-foreground/50"
              )}
            >
              <div className="aspect-square relative">
                <Image
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <div className="relative h-full w-full">
            <Image
              src={selectedImages[selectedImageIndex] || "/placeholder.svg"}
              alt="Product zoomed view"
              fill
              className="object-contain"
              quality={100}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}