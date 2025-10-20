"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, X, Share2, Download } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ProductGalleryProps {
  images: string[]
  productName?: string
  className?: string
}

export function ProductGallery({ 
  images, 
  productName = "Product", 
  className 
}: ProductGalleryProps) {
  const [mainCarouselRef, mainCarouselApi] = useEmblaCarousel({
    loop: true,
  })
  
  const [thumbnailCarouselRef, thumbnailCarouselApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

  const selectedImages = images.length > 0 ? images : ["/placeholder.jpg"]

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainCarouselApi) return
      mainCarouselApi.scrollTo(index)
    },
    [mainCarouselApi]
  )

  const onSelect = useCallback(() => {
    if (!mainCarouselApi || !thumbnailCarouselApi) return
    
    const selected = mainCarouselApi.selectedScrollSnap()
    setSelectedIndex(selected)
    
    thumbnailCarouselApi.scrollTo(selected)
  }, [mainCarouselApi, thumbnailCarouselApi])

  const handleZoomClick = useCallback(() => {
    setIsZoomed(true)
    setZoomScale(1)
    setImagePosition({ x: 0, y: 0 })
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isZoomed) return
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoomScale(prev => Math.max(1, Math.min(3, prev + delta)))
  }, [isZoomed])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || zoomScale === 1) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * (zoomScale - 1)
    const y = (e.clientY - rect.top - rect.height / 2) * (zoomScale - 1)
    
    setImagePosition({ x, y })
  }, [isZoomed, zoomScale])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          url: window.location.href,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }, [productName])

  const handleDownload = useCallback(() => {
    const link = document.createElement("a")
    link.href = selectedImages[selectedIndex] || "/placeholder.jpg"
    link.download = `${productName}-${selectedIndex + 1}.jpg`
    link.click()
  }, [productName, selectedIndex, selectedImages])

  useEffect(() => {
    if (!mainCarouselApi) return
    
    onSelect()
    mainCarouselApi.on("select", onSelect)
    mainCarouselApi.on("reInit", onSelect)

    return () => {
      mainCarouselApi.off("select", onSelect)
      mainCarouselApi.off("reInit", onSelect)
    }
  }, [mainCarouselApi, onSelect])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return
      
      switch (e.key) {
        case "Escape":
          setIsZoomed(false)
          break
        case "ArrowLeft":
          mainCarouselApi?.scrollPrev()
          break
        case "ArrowRight":
          mainCarouselApi?.scrollNext()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isZoomed, mainCarouselApi])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative group">
        <div className="overflow-hidden rounded-2xl" ref={mainCarouselRef}>
          <div className="flex">
            {selectedImages.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] relative aspect-square"
              >
                <Image
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover cursor-zoom-in"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  onClick={handleZoomClick}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => mainCarouselApi?.scrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => mainCarouselApi?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            onClick={handleZoomClick}
          >
            <ChevronLeft className="h-4 w-4 rotate-90" />
          </Button>
        </div>
      </div>

      {selectedImages.length > 1 && (
        <div className="overflow-hidden" ref={thumbnailCarouselRef}>
          <div className="flex gap-2">
            {selectedImages.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={cn(
                  "flex-[0_0_auto] relative overflow-hidden rounded-lg border-2 transition-all",
                  selectedIndex === index
                    ? "border-primary scale-105 shadow-lg"
                    : "border-muted hover:border-muted-foreground/50"
                )}
              >
                <div className="relative w-20 h-20">
                  <Image
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
          <div className="relative h-full w-full flex items-center justify-center overflow-hidden"
               onWheel={handleWheel}
               onMouseMove={handleMouseMove}>
            <div 
              className="relative cursor-grab active:cursor-grabbing transition-transform"
              style={{
                transform: `scale(${zoomScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
              }}
            >
              <Image
                src={selectedImages[selectedIndex] || "/placeholder.jpg"}
                alt={`${productName} zoomed view`}
                className="max-w-none"
                width={1200}
                height={1200}
                quality={100}
                style={{ maxHeight: "80vh" }}
              />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={() => mainCarouselApi?.scrollPrev()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm">
                {selectedIndex + 1} / {selectedImages.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={() => mainCarouselApi?.scrollNext()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={() => setZoomScale(1)}
              >
                <span className="text-xs">1:1</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}