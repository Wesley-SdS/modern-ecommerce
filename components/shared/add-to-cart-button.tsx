"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { ShoppingCart } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: any
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const t = useTranslations("product")
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error(t("outOfStock"))
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      sku: product.sku || product.id,
      slug: product.slug || product.id,
    })

    toast.success(t("addedToCart"))
  }

  return (
    <Button onClick={handleAddToCart} disabled={product.stock === 0} className={className} size="lg">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {product.stock === 0 ? t("outOfStock") : t("addToCart")}
    </Button>
  )
}
