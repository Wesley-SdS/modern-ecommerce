"use client"

import { useEffect } from "react"
import { useWishlistStore } from "@/store/wishlist-store"
import { ProductCard } from "@/components/shared/product-card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function WishlistPage() {
  const t = useTranslations("wishlist")
  const { items, removeFromWishlist, clearWishlist, syncWithServer, isLoading } = useWishlistStore()

  useEffect(() => {
    syncWithServer()
  }, [syncWithServer])

  if (isLoading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Sua lista de desejos está vazia</h1>
            <p className="text-muted-foreground">
              Adicione produtos que você ama para encontrá-los facilmente aqui.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="flex-1 sm:flex-initial">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explorar Produtos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minha Lista de Desejos</h1>
            <p className="text-muted-foreground">
              {items.length} produto{items.length !== 1 ? "s" : ""} na sua lista
            </p>
          </div>
          
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearWishlist}
              disabled={isLoading}
            >
              Limpar Lista
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard 
                product={item.product}
                showWishlistButton={false}
              />
              
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromWishlist(item.productId)}
                disabled={isLoading}
              >
                <Heart className="h-4 w-4 mr-1" />
                Remover
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 pt-8 border-t">
          <p className="text-muted-foreground">
            Viu tudo que queria?
          </p>
          <Button asChild variant="outline">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}