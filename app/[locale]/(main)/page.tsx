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
      {/* Hero Section Moderno */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,oklch(0.5_0.16_20/0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,oklch(0.62_0.16_20/0.12),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  {activeBanner?.title || "Descubra a"}
                </span>
                <br />
                <span className="text-foreground">
                  {activeBanner?.title ? "" : "Coleção Perfeita"}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {activeBanner?.description || "Produtos premium que transformam seu estilo de vida com design inovador e qualidade excepcional."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                <Link href="/products">
                  {t("hero.shopNow")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto rounded-full border-2 hover:bg-background transition-all duration-300" asChild>
                <Link href="/about">{t("hero.browseCategories")}</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Produtos Premium</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">24h</div>
                <div className="text-sm text-muted-foreground">Entrega Rápida</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Satisfação Garantida</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/10 rounded-full blur-xl animate-pulse delay-500" />
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("featuredProducts.title")}
            </h2>
            <p className="text-lg text-muted-foreground">{t("featuredProducts.description")}</p>
          </div>
          <div className="mb-8">
            <FeaturedCarousel 
              products={products.slice(0, 6).map((product: any) => ({
                id: product.id,
                name: product.title || product.name,
                images: product.images || [product.imageUrl || "/placeholder.jpg"],
                price: product.priceCents || product.price || 0,
                badge: product.stock < 5 ? "ÃƒÆ’Ã…Â¡ltimas Unidades" : 
                       product.priceCents < 5000 ? "Oferta" : 
                       "Destaque",
                gradient: "linear-gradient(135deg, oklch(0.65 0.25 270), oklch(0.75 0.24 50))"
              }))} 
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{t("features.freeShipping.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.freeShipping.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{t("features.securePayment.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.securePayment.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{t("features.support.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.support.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* (images carousel removed) */}
      {/* All Featured Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Todos os Produtos</h2>
              <p className="text-muted-foreground">Explore nossa coleção completa</p>
            </div>
            <Button variant="outline" asChild>
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

