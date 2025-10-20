import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shared/product-card"
import FeaturedCarousel from "@/components/shared/featured-carousel"
import { ArrowRight, Shield, Truck, CreditCard } from "lucide-react"
import { logger } from "@/lib/logger"

async function getBanners() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(`${apiUrl}/api/v1/banners`, {
      cache: "no-store",
    })
    if (!res.ok) {
      logger.warn("Failed to fetch banners", { status: res.status })
      return []
    }
    const body = await res.json()
    const banners = body?.data ?? body?.banners ?? body
    const list = Array.isArray(banners) ? banners : []
    logger.info("Banners fetched successfully", { count: list.length })
    return list
  } catch (error) {
    logger.error("Error fetching banners", error)
    return []
  }
}

async function getFeaturedProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(
      `${apiUrl}/api/v1/products?featured=true&limit=8`,
      {
        cache: "no-store",
      },
    )
    if (!res.ok) {
      logger.warn("Failed to fetch featured products", { status: res.status })
      return []
    }
    const data = await res.json()
    const products = data.data?.data || data.products || []
    logger.info("Featured products fetched successfully", { count: products.length })
    return products
  } catch (error) {
    logger.error("Error fetching featured products", error)
    return []
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const t = await getTranslations("home")
  const [banners, products] = await Promise.all([getBanners(), getFeaturedProducts()])
  const activeBanner = banners.find((b: any) => b.isActive)

  return (
    <div className="min-h-screen">
      {/* Hero Section Minimalista */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-rose-50 pt-20 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="text-left lg:text-left space-y-4">
              <h1 className="text-2xl md:text-4xl font-light tracking-tight">
                <span className="block text-rose-900">
                  Descubra a
                </span>
                <span className="block text-rose-700 mt-1">
                  Coleção Perfeita
                </span>
              </h1>
              
              <p className="text-sm md:text-base text-rose-600 leading-relaxed max-w-lg">
                Produtos premium com design minimalista
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button className="bg-rose-700 hover:bg-rose-800 text-white text-sm px-6 py-2 h-auto rounded-lg transition-all duration-300" asChild>
                <Link href="/products">
                  {t("hero.shopNow")} <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              <Button variant="outline" className="text-rose-700 text-sm px-6 py-2 h-auto rounded-lg border-rose-700/30 hover:bg-rose-50 transition-all duration-300" asChild>
                <Link href="/products">{t("hero.browseCategories")}</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-rose-200 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-lg font-light text-rose-800 mb-1">1000+</div>
                <div className="text-xs text-rose-600">Produtos Premium</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-light text-rose-800 mb-1">24h</div>
                <div className="text-xs text-rose-600">Entrega Rápida</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-light text-rose-800 mb-1">100%</div>
                <div className="text-xs text-rose-600">Satisfação Garantida</div>
              </div>
            </div>
          </div>
        </div>
        

      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 bg-gradient-to-b from-white via-white to-rose-50/30">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2 text-rose-900">
              {t("featuredProducts.title")}
            </h2>
            <p className="text-base text-rose-700/70">{t("featuredProducts.description")}</p>
          </div>
          <div className="mb-8">
            <FeaturedCarousel 
              products={products.slice(0, 6).map((product: any) => ({
                id: product.id,
                name: product.title || product.name,
                images: product.images || [product.imageUrl || "/placeholder.jpg"],
                price: product.priceCents || product.price || 0,
                badge: product.stock < 5 ? "Últimas Unidades" : 
                       product.priceCents < 5000 ? "Oferta" : 
                       "Destaque",
                gradient: "transparent"
              }))} 
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-rose-50/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-rose-100 group-hover:bg-rose-200 transition-colors flex items-center justify-center">
                <Truck className="h-6 w-6 text-rose-700" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-rose-800 transition-colors">{t("features.freeShipping.title")}</h3>
                <p className="text-sm text-rose-600/70">{t("features.freeShipping.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-rose-100 group-hover:bg-rose-200 transition-colors flex items-center justify-center">
                <Shield className="h-6 w-6 text-rose-700" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-rose-800 transition-colors">{t("features.securePayment.title")}</h3>
                <p className="text-sm text-rose-600/70">{t("features.securePayment.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-rose-100 group-hover:bg-rose-200 transition-colors flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-rose-700" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-rose-800 transition-colors">{t("features.support.title")}</h3>
                <p className="text-sm text-rose-600/70">{t("features.support.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Featured Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-rose-900">Todos os Produtos</h2>
              <p className="text-rose-700/70">Explore nossa coleção completa</p>
            </div>
            <Button variant="outline" className="border-rose-700/50 text-rose-800 hover:bg-rose-50" asChild>
              <Link href="/products">
                {t("featuredProducts.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}