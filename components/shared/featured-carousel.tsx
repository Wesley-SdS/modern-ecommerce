"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatProductPrice } from "@/lib/utils/product-utils"

interface FeaturedProduct {
  id: string
  name: string
  images: string[]
  price: number
  badge?: string
  gradient?: string
}

interface FeaturedCarouselProps {
  products: FeaturedProduct[]
  autoplay?: boolean
  className?: string
}

export default function FeaturedCarousel({ 
  products, 
  autoplay = true, 
  className 
}: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || !autoplay) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [emblaApi, autoplay])

  if (products.length === 0) return null

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden rounded-2xl border border-rose-200 shadow-sm" ref={emblaRef}>
        <div className="flex">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] lg:aspect-[21/9]"
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
                style={{
                  background: product.gradient ||
                    "linear-gradient(135deg, oklch(0.48 0.18 20), oklch(0.62 0.16 20))",
                }}
              />
              
              <div className="relative h-full flex items-center justify-between p-8 lg:p-16">
                <div className="flex-1 max-w-xl space-y-6">
                  <div className="space-y-4">
                    {product.badge && (
                      <Badge className="w-fit bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                        {product.badge}
                      </Badge>
                    )}
                    <h2 className="text-3xl lg:text-5xl font-bold text-foreground drop-shadow-lg">
                      {product.name}
                    </h2>
                    <p className="text-xl lg:text-2xl font-semibold text-primary">
                      {formatProductPrice(product.price, "pt-BR")}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                      <Link href={`/products/${product.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="backdrop-blur-sm">
                      Comprar Agora
                    </Button>
                  </div>
                </div>
                
                <div className="hidden lg:block flex-1 max-w-md">
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-2xl animate-fadeIn"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              selectedIndex === index 
                ? "bg-primary w-8" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
