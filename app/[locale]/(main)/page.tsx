import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shared/product-card"
import { ArrowRight, Shield, Truck, CreditCard } from "lucide-react"

async function getBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/banners`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/products?featured=true&limit=8`,
      {
        cache: "no-store",
      },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.products || []
  } catch (error) {
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
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              {activeBanner?.title || t("hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              {activeBanner?.description || t("hero.subtitle")}
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  {t("hero.cta")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">{t("hero.learnMore")}</Link>
              </Button>
            </div>
          </div>
          {activeBanner?.imageUrl && (
            <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2">
              <Image
                src={activeBanner.imageUrl || "/placeholder.svg"}
                alt={activeBanner.title}
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("features.shipping.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.shipping.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("features.secure.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.secure.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("features.payment.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.payment.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t("featured.title")}</h2>
              <p className="text-muted-foreground">{t("featured.subtitle")}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                {t("featured.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
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
