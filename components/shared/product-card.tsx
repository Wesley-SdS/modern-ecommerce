"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Heart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { toast } from "sonner"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { formatProductPrice } from "@/lib/utils/product-utils"

interface ProductCardProps {
  product: any
  showWishlistButton?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  showWishlistButton = true,
  className 
}: ProductCardProps) {
  const t = useTranslations("common")
  const locale = useLocale()
  const addItem = useCartStore((state) => state.addItem)
  const isInCart = useCartStore((state) => state.isInCart)
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlistStore()

  const productPrice = product.priceCents || product.price || 0
  const productImages = product.images || [product.imageUrl || "/placeholder.jpg"]
  const productTitle = product.title || product.name
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      productId: product.id,
      name: productTitle,
      price: productPrice,
      imageUrl: productImages[0],
      sku: product.sku,
      slug: product.slug,
    })
    toast.success(t("addToCart"), {
      description: productTitle,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast.success("Removido da lista de desejos")
    } else {
      addToWishlist(product.id, product)
      toast.success("Adicionado à lista de desejos")
    }
  }

  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300 relative", className)}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={productImages[0]}
            alt={productTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1600px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          {product.stock < 10 && product.stock > 0 && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              {product.stock} {t("inStock")}
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              {t("outOfStock")}
            </Badge>
          )}
          
          {showWishlistButton && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  inWishlist ? "fill-destructive text-destructive" : ""
                )} 
              />
            </Button>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {productTitle}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating || 0) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({(product.rating || 0).toFixed(1)})
            </span>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{formatProductPrice(productPrice, locale)}</p>
            <p className="text-xs text-muted-foreground capitalize">{product.category?.name}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          onClick={handleAddToCart} 
          disabled={product.stock === 0}
          variant={isInCart(product.id) ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? t("outOfStock") : isInCart(product.id) ? t("inCart") : t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  )
}
