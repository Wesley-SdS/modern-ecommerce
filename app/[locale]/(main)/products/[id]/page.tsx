import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Share2 } from "lucide-react"
import { AddToCartButton } from "@/components/shared/add-to-cart-button"

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/products/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const resolvedParams = await params
  const t = await getTranslations("product")
  const product = await getProduct(resolvedParams.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.stock < 10 && product.stock > 0 && <Badge variant="destructive">{t("lowStock")}</Badge>}
                {product.stock === 0 && <Badge variant="outline">{t("outOfStock")}</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating?.toFixed(1)} ({product.reviewCount || 0} {t("reviews")})
                </span>
              </div>
            </div>

            <div className="border-t border-b py-6">
              <div className="text-4xl font-bold text-primary mb-2">R$ {product.price.toFixed(2)}</div>
              {product.stock > 0 && (
                <p className="text-sm text-muted-foreground">{t("inStock", { count: product.stock })}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("description")}</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <AddToCartButton product={product} className="flex-1" />
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("sku")}</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("category")}</span>
                <span className="font-medium">{product.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
