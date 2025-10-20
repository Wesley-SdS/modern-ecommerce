"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  product: any
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("common")
  const locale = useLocale()
  const addItem = useCartStore((state) => state.addItem)
  const isInCart = useCartStore((state) => state.isInCart)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productId: product.id,
      name: product.title,
      price: product.priceCents,
      imageUrl: product.images?.[0] || "/placeholder.svg",
      sku: product.sku,
      slug: product.slug,
    })
    toast.success(t("addToCart"), {
      description: `${product.title}`,
    })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images?.[0] || "/placeholder.svg?height=400&width=400"}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.stock < 10 && product.stock > 0 && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {product.stock} {t("inStock")}
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              {t("outOfStock")}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(4.5) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(4.5)</span>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{formatCurrency(product.priceCents / 100, locale)}</p>
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
